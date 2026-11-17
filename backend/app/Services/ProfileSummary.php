<?php

namespace App\Services;

use App\Models\Place;
use App\Models\Rating;
use App\Models\User;

class ProfileSummary
{
    public function forUser(User $user): array
    {
        $places = Place::where('user_id', $user->id);
        $ratings = Rating::where('ratings.user_id', $user->id);
        $placeCount = (clone $places)->count();
        $ratingCount = (clone $ratings)->count();
        $completeCount = (clone $ratings)->whereNotNull('photoScore')->whereNotNull('placeScore')->count();
        $photoCount = (clone $ratings)->whereNotNull('photoScore')->count();
        $progress = min(3, (clone $ratings)->whereNotNull('photoScore')->whereNotNull('placeScore')->where('updated_at', '>=', now()->subDays(7))->count());

        $badges = [];
        if ($placeCount >= 1) {
            $badges[] = ['key' => 'local-guide', 'label' => 'Local Guide', 'description' => 'Membagikan tempat pertama.'];
        }
        if ($photoCount >= 5) {
            $badges[] = ['key' => 'photo-scout', 'label' => 'Photo Scout', 'description' => 'Menilai foto pada 5 tempat berbeda.'];
        }
        if ($completeCount >= 5) {
            $badges[] = ['key' => 'trusted-rater', 'label' => 'Trusted Rater', 'description' => 'Menilai foto dan tempat pada 5 spot berbeda.'];
        }

        $activities = (clone $places)->latest('created_at')->latest('id')->limit(10)->get()->map(fn ($place) => [
            'id' => 'place-'.$place->id,
            'title' => 'Upload '.$place->name,
            'meta' => $place->category,
            'occurredAt' => $place->created_at->toISOString(),
        ])->concat(
            (clone $ratings)->join('places', 'ratings.place_id', '=', 'places.id')
                ->select('ratings.*', 'places.name as place_name')->orderByDesc('ratings.updated_at')->orderByDesc('ratings.id')->limit(10)->get()
                ->map(fn ($rating) => [
                    'id' => 'rating-'.$rating->id,
                    'title' => 'Rating '.$rating->place_name,
                    'meta' => 'Foto '.($rating->photoScore ?? 'belum dinilai').' / Tempat '.($rating->placeScore ?? 'belum dinilai'),
                    'occurredAt' => $rating->updated_at->toISOString(),
                ])
        )->sortByDesc('occurredAt')->take(10)->values()->all();

        return [
            'stats' => ['places' => $placeCount, 'ratings' => $ratingCount, 'badges' => count($badges)],
            'level' => 1 + intdiv($placeCount + $completeCount, 5),
            'challengeProgress' => [
                'label' => 'Rating foto dan tempat pada 3 spot dalam 7 hari terakhir',
                'completed' => $progress, 'target' => 3, 'percentage' => round($progress / 3 * 100),
            ],
            'badges' => $badges,
            'activities' => $activities,
        ];
    }
}
