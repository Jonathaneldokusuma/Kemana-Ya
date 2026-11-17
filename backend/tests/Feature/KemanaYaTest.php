<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class KemanaYaTest extends TestCase
{
    use RefreshDatabase;

    private function account(string $email = 'user@example.com'): string
    {
        return $this->postJson('/api/auth/register', ['name' => 'Explorer', 'email' => $email, 'password' => 'password123', 'city' => 'Bandung'])
            ->assertCreated()->assertJsonPath('data.user.city', 'Bandung')->json('data.token');
    }

    private function place(): array
    {
        return ['name' => 'Kafe Uji', 'location' => 'Bandung', 'category' => config('spots.categories')[2], 'description' => 'Tempat tenang', 'image' => 'https://example.com/photo.jpg'];
    }

    public function test_auth_profile_and_revocation(): void
    {
        $token = $this->account();
        $this->postJson('/api/auth/login', ['email' => 'user@example.com', 'password' => 'wrong'])->assertUnprocessable();
        $this->postJson('/api/auth/login', ['email' => 'user@example.com', 'password' => 'password123'])->assertOk();
        $this->withToken($token)->patchJson('/api/me', ['name' => 'Updated', 'settings' => ['compactFeed' => true]])->assertOk()->assertJsonPath('data.name', 'Updated');
        $this->withToken($token)->getJson('/api/me')->assertJsonPath('data.settings.compactFeed', true);
        $this->withToken($token)->postJson('/api/auth/logout')->assertOk();
        $this->withToken($token)->getJson('/api/me')->assertUnauthorized();
    }

    public function test_place_validation_and_independent_averaged_votes(): void
    {
        $this->postJson('/api/places', $this->place())->assertUnauthorized();
        $token = $this->account();
        $this->withToken($token)->postJson('/api/places', [...$this->place(), 'category' => 'invalid'])->assertUnprocessable();
        $id = $this->withToken($token)->postJson('/api/places', $this->place())->assertCreated()->assertJsonPath('data.rating', 0)->json('data.id');
        $this->withToken($token)->putJson("/api/places/$id/rating", ['photoScore' => 5])->assertOk();
        $this->withToken($token)->putJson("/api/places/$id/rating", ['placeScore' => 3])->assertJsonPath('data.ratingCount', 1)->assertJsonPath('data.rating', 4);
        $other = $this->account('other@example.com');
        $this->withToken($other)->putJson("/api/places/$id/rating", ['photoScore' => 3, 'placeScore' => 5])->assertJsonPath('data.photoScore', 4)->assertJsonPath('data.placeScore', 4)->assertJsonPath('data.ratingCount', 2);
        $this->withToken($other)->putJson("/api/places/$id/rating", ['placeScore' => 7])->assertUnprocessable();
        $this->getJson('/api/places')->assertOk()->assertJsonCount(1, 'data');
        $this->getJson('/api/places/99999')->assertNotFound()->assertJsonPath('message', 'Data tidak ditemukan.');
    }

    public function test_profile_is_scoped_to_account_and_token_expires(): void
    {
        $first = $this->account();
        $this->account('other@example.com');
        $this->withToken($first)->patchJson('/api/me', ['id' => 2, 'email' => 'other@example.com', 'name' => 'Mine'])->assertOk()->assertJsonPath('data.email', 'user@example.com');
        DB::table('api_tokens')->update(['expires_at' => now()->subMinute()]);
        $this->withToken($first)->getJson('/api/me')->assertUnauthorized();
    }

    public function test_cors_preflight(): void
    {
        $this->withHeaders(['Origin' => 'http://localhost:5173', 'Access-Control-Request-Method' => 'POST', 'Access-Control-Request-Headers' => 'authorization,content-type'])
            ->options('/api/places')->assertNoContent()->assertHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    }
}
