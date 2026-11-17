<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class PhotoUploadTest extends TestCase
{
    use RefreshDatabase;

    private const PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aP1sAAAAASUVORK5CYII=';

    private function account(): string
    {
        return $this->postJson('/api/auth/register', ['name' => 'Photo test', 'email' => 'photo@example.test', 'password' => 'password123'])->assertCreated()->json('data.token');
    }

    private function fields(): array
    {
        return ['name' => 'Foto galeri', 'location' => 'Bandung', 'category' => config('spots.categories')[0], 'description' => 'Foto dari galeri', 'latitude' => -6.9, 'longitude' => 107.6];
    }

    public function test_upload_is_persisted_and_served_as_an_image(): void
    {
        $token = $this->account();
        $file = UploadedFile::fake()->createWithContent('galeri.png', base64_decode(self::PNG));
        $place = $this->withToken($token)->post('/api/places', [...$this->fields(), 'photo' => $file], ['Accept' => 'application/json'])->assertCreated()->json('data');
        $id = $place['id'];
        $this->assertStringEndsWith("/api/places/$id/photo", $place['image']);
        $this->assertDatabaseHas('places', ['id' => $id, 'image' => 'data:image/png;base64,'.self::PNG]);
        $this->get("/api/places/$id/photo")->assertOk()->assertHeader('Content-Type', 'image/png')->assertContent(base64_decode(self::PNG));
        $this->getJson('/api/places')->assertJsonPath('data.0.image', $place['image']);
        $this->withToken($token)->deleteJson("/api/places/$id")->assertOk();
        $this->get("/api/places/$id/photo")->assertNotFound();
    }

    public function test_invalid_missing_oversized_and_unauthenticated_uploads_are_rejected(): void
    {
        $this->postJson('/api/places', $this->fields())->assertUnauthorized();
        $token = $this->account();
        $this->withToken($token)->postJson('/api/places', $this->fields())->assertUnprocessable();
        $this->withToken($token)->post('/api/places', [...$this->fields(), 'photo' => UploadedFile::fake()->createWithContent('bad.jpg', '<script>test</script>')], ['Accept' => 'application/json'])->assertUnprocessable();
        $this->withToken($token)->post('/api/places', [...$this->fields(), 'photo' => UploadedFile::fake()->createWithContent('large.png', base64_decode(self::PNG).str_repeat('a', 513 * 1024))], ['Accept' => 'application/json'])->assertUnprocessable();
        $this->assertDatabaseCount('places', 0);
    }
}
