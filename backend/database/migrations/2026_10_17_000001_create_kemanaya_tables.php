<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->json('profile')->nullable();
            $table->json('settings')->nullable();
        });
        Schema::create('api_tokens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('hash', 64)->unique();
            $table->timestamp('expires_at');
        });
        Schema::create('places', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('location');
            $table->string('category');
            $table->text('description');
            $table->text('image');
            $table->json('tags');
            $table->timestamps();
        });
        Schema::create('ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('place_id')->constrained()->cascadeOnDelete();
            $table->decimal('photoScore', 2, 1)->nullable();
            $table->decimal('placeScore', 2, 1)->nullable();
            $table->timestamps();
            $table->unique(['user_id', 'place_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ratings');
        Schema::dropIfExists('places');
        Schema::dropIfExists('api_tokens');
        Schema::table('users', fn (Blueprint $table) => $table->dropColumn(['profile', 'settings']));
    }
};
