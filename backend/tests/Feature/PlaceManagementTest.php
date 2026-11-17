<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlaceManagementTest extends TestCase
{
    use RefreshDatabase;

    private function account(string $email): string
    {
        return $this->postJson('/api/auth/register', ['name' => 'Explorer', 'email' => $email, 'password' => 'password123'])->assertCreated()->json('data.token');
    }

    public function test_only_owner_can_delete_and_ratings_are_removed(): void
    {
        $owner = $this->account('owner@example.test');
        $place = $this->withToken($owner)->postJson('/api/places', [
            'name' => 'Spot uji', 'location' => 'Bandung', 'category' => config('spots.categories')[0],
            'description' => 'Uji hapus', 'image' => 'https://example.com/image.jpg',
        ])->assertCreated()->json('data');
        $other = $this->account('other@example.test');
        $id = $place['id'];
        $this->withToken($other)->putJson("/api/places/$id/rating", ['photoScore' => 4])->assertOk();
        $this->withToken($other)->deleteJson("/api/places/$id")->assertForbidden();
        $this->assertDatabaseHas('places', ['id' => $id]);
        $this->withToken($owner)->deleteJson("/api/places/$id")->assertOk();
        $this->assertDatabaseMissing('places', ['id' => $id]);
        $this->assertDatabaseMissing('ratings', ['place_id' => $id]);
        $this->getJson("/api/places/$id")->assertNotFound();
    }

    public function test_coordinates_persist_and_only_owner_can_change_them(): void
    {
        $owner = $this->account('owner@example.test');
        $place = $this->withToken($owner)->postJson('/api/places', [
            'name' => 'Spot uji', 'location' => 'Bandung', 'category' => config('spots.categories')[0],
            'description' => 'Uji pin', 'image' => 'https://example.com/image.jpg', 'latitude' => -6.9, 'longitude' => 107.6,
        ])->assertCreated()->assertJsonPath('data.latitude', -6.9)->json('data');
        $id = $place['id'];
        $this->withToken($owner)->patchJson("/api/places/$id/location", ['latitude' => 91, 'longitude' => 107])->assertUnprocessable();
        $this->withToken($owner)->patchJson("/api/places/$id/location", ['latitude' => -7])->assertUnprocessable();
        $this->withToken($owner)->patchJson("/api/places/$id/location", ['latitude' => 0, 'longitude' => 0])->assertOk()->assertJsonPath('data.latitude', 0)->assertJsonPath('data.longitude', 0);
        $this->getJson("/api/places/$id")->assertJsonPath('data.latitude', 0);
        $other = $this->account('other@example.test');
        $this->withToken($other)->patchJson("/api/places/$id/location", ['latitude' => 1, 'longitude' => 1])->assertForbidden();
        $this->withHeaders(['Authorization' => ''])->deleteJson("/api/places/$id")->assertUnauthorized();
    }
}
