<?php

namespace Database\Seeders;

use App\Models\Place;
use App\Models\Rating;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DemoSpotSeeder extends Seeder
{
    public function run(): void
    {
        abort_unless(app()->environment('local', 'testing'), 403);
        DB::transaction(function () {
            $owner = User::firstOrCreate(['email' => 'fixtures@example.invalid'], ['name' => 'Komunitas Demo', 'password' => bin2hex(random_bytes(32))]);
            foreach (json_decode(file_get_contents(database_path('seeders/data/spots.json')), true) as $spot) {
                $place = Place::firstOrCreate(['name' => $spot['name'], 'user_id' => $owner->id], [...array_intersect_key($spot, array_flip(['name', 'category', 'description', 'location', 'image', 'tags'])), 'user_id' => $owner->id]);
                Rating::firstOrCreate(['user_id' => $owner->id, 'place_id' => $place->id], ['photoScore' => $spot['photoScore'], 'placeScore' => $spot['placeScore']]);
            }
        });
    }
}
