<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Place extends Model
{
    protected $fillable = ['name', 'location', 'category', 'description', 'image', 'tags', 'user_id', 'latitude', 'longitude'];

    protected function casts(): array
    {
        return ['tags' => 'array', 'latitude' => 'float', 'longitude' => 'float'];
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }
}
