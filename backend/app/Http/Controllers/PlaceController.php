<?php

namespace App\Http\Controllers;

use App\Models\Place;
use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class PlaceController extends Controller
{
    public function index()
    {
        return response()->json(['data' => Place::with('ratings')->latest('id')->get()->map(fn ($place) => $this->resource($place))]);
    }

    public function show(Place $place)
    {
        return response()->json(['data' => $this->resource($place->load('ratings'))]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255', 'location' => 'required|string|max:255',
            'description' => 'required|string|max:5000', 'category' => ['required', Rule::in(config('spots.categories'))],
            'image' => 'nullable|required_without:photo|url:http,https|max:2048',
            'photo' => 'nullable|required_without:image|file|image|mimes:jpg,jpeg,png,webp|max:512',
            'latitude' => 'nullable|required_with:longitude|numeric|between:-90,90',
            'longitude' => 'nullable|required_with:latitude|numeric|between:-180,180',
        ]);
        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $bytes = $file->get();
            $info = @getimagesizefromstring($bytes);
            if (! $info || ! in_array($info['mime'], ['image/jpeg', 'image/png', 'image/webp'], true) || $info[0] > 4096 || $info[1] > 4096) {
                throw ValidationException::withMessages(['photo' => ['Pilih foto JPEG, PNG, atau WebP yang valid, maksimal 4096 piksel.']]);
            }
            $data['image'] = 'data:'.$info['mime'].';base64,'.base64_encode($bytes);
        }
        unset($data['photo']);
        $place = Place::create([...$data, 'user_id' => $request->user()->id, 'tags' => ['New Spot', 'Komunitas']]);

        return response()->json(['data' => $this->resource($place->load('ratings'))], 201);
    }

    public function rate(Request $request, Place $place)
    {
        $data = $request->validate(['photoScore' => 'required_without:placeScore|numeric|between:1,5', 'placeScore' => 'required_without:photoScore|numeric|between:1,5']);
        // One row per user/place: changing a score never adds an extra vote.
        Rating::upsert([['user_id' => $request->user()->id, 'place_id' => $place->id, ...$data, 'created_at' => now(), 'updated_at' => now()]], ['user_id', 'place_id'], [...array_keys($data), 'updated_at']);

        return $this->show($place);
    }

    public function destroy(Request $request, Place $place)
    {
        abort_unless((int) $place->user_id === (int) $request->user()->id, 403, 'Hanya pemilik yang dapat menghapus spot ini.');
        $place->delete();

        return response()->json(['data' => ['id' => $place->id]]);
    }

    public function photo(Place $place)
    {
        abort_unless(preg_match('/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/s', $place->image, $matches), 404);
        $bytes = base64_decode($matches[2], true);
        abort_if($bytes === false, 404);

        return response($bytes, 200, [
            'Content-Type' => $matches[1],
            'Cache-Control' => 'public, max-age=3600',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    public function updateLocation(Request $request, Place $place)
    {
        abort_unless((int) $place->user_id === (int) $request->user()->id, 403, 'Hanya pemilik yang dapat mengubah titik lokasi.');
        $data = $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);
        $place->update($data);

        return $this->show($place);
    }

    private function resource(Place $place): array
    {
        $photo = round((float) $place->ratings->avg('photoScore'), 1);
        $score = round((float) $place->ratings->avg('placeScore'), 1);

        return [...$place->only(['id', 'name', 'location', 'latitude', 'longitude', 'description', 'category', 'tags', 'created_at', 'updated_at']),
            'image' => str_starts_with($place->image, 'data:image/') ? url('/api/places/'.$place->id.'/photo') : $place->image,
            'ownerId' => $place->user_id, 'photoScore' => $photo, 'placeScore' => $score,
            'rating' => round(($photo + $score) / 2, 1), 'ratingCount' => $place->ratings->count()];
    }
}
