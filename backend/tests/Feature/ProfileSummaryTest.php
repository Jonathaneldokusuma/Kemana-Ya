<?php

namespace Tests\Feature;

use App\Models\Place;
use App\Models\Rating;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ProfileSummaryTest extends TestCase
{
    use RefreshDatabase;

    private function register(string $email): string
    {
        return $this->postJson('/api/auth/register', ['name' => 'Explorer', 'email' => $email, 'password' => 'password123'])
            ->assertCreated()->json('data.token');
    }

    private function place(User $owner, string $name): Place
    {
        return Place::create(['user_id' => $owner->id, 'name' => $name, 'location' => 'Bandung', 'category' => config('spots.categories')[0], 'description' => 'Tempat uji', 'image' => 'https://example.com/photo.jpg', 'tags' => []]);
    }

    public function test_new_account_starts_empty(): void
    {
        $token = $this->register('new@example.com');
        $this->withToken($token)->getJson('/api/me')->assertOk()
            ->assertJsonPath('data.stats', ['places' => 0, 'ratings' => 0, 'badges' => 0])
            ->assertJsonPath('data.level', 1)->assertJsonPath('data.challengeProgress.completed', 0)
            ->assertJsonCount(0, 'data.badges')->assertJsonCount(0, 'data.activities');
    }

    public function test_activity_and_stats_use_only_current_account_and_latest_rating(): void
    {
        $token = $this->register('mine@example.com');
        $mine = User::where('email', 'mine@example.com')->firstOrFail();
        $other = User::factory()->create();
        $spot = $this->place($mine, 'My Spot');
        $foreign = $this->place($other, 'Other Spot');
        Rating::create(['user_id' => $other->id, 'place_id' => $spot->id, 'photoScore' => 1, 'placeScore' => 1]);
        $this->withToken($token)->putJson("/api/places/{$foreign->id}/rating", ['photoScore' => 5])->assertOk();
        $this->withToken($token)->getJson('/api/me')->assertOk()
            ->assertJsonPath('data.stats.places', 1)->assertJsonPath('data.stats.ratings', 1)
            ->assertJsonPath('data.challengeProgress.completed', 0)->assertJsonPath('data.badges.0.key', 'local-guide')
            ->assertJsonCount(2, 'data.activities');
        $this->withToken($token)->putJson("/api/places/{$foreign->id}/rating", ['placeScore' => 4])->assertOk();
        $this->withToken($token)->getJson('/api/me')->assertJsonPath('data.challengeProgress.completed', 1)
            ->assertJsonPath('data.stats.ratings', 1)->assertJsonCount(2, 'data.activities');
        $this->withToken($token)->patchJson('/api/me', ['stats' => ['places' => 99], 'level' => 99])->assertJsonPath('data.stats.places', 1)->assertJsonPath('data.level', 1);
    }

    public function test_badges_level_rolling_challenge_and_activity_limit(): void
    {
        $token = $this->register('active@example.com');
        $user = User::where('email', 'active@example.com')->firstOrFail();
        for ($i = 1; $i <= 6; $i++) {
            $spot = $this->place($user, 'Spot '.$i);
            Rating::create(['user_id' => $user->id, 'place_id' => $spot->id, 'photoScore' => 5, 'placeScore' => 4]);
        }
        $this->withToken($token)->getJson('/api/me')->assertOk()->assertJsonPath('data.stats', ['places' => 6, 'ratings' => 6, 'badges' => 3])
            ->assertJsonPath('data.level', 3)->assertJsonPath('data.challengeProgress.completed', 3)
            ->assertJsonPath('data.challengeProgress.percentage', 100)->assertJsonCount(10, 'data.activities');
        DB::table('ratings')->where('user_id', $user->id)->update(['updated_at' => now()->subDays(8)]);
        $this->withToken($token)->getJson('/api/me')->assertJsonPath('data.challengeProgress.completed', 0)
            ->assertJsonPath('data.stats.badges', 3)->assertJsonPath('data.level', 3);
    }
}
