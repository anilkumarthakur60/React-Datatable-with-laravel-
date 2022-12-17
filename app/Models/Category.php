<?php

namespace App\Models;

use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    public function posts():HasMany
    {
        return $this->hasMany(Post::class);
    }

      use Sluggable;

       public function sluggable(): array
          {
              return [
                  'slug' => [
                      'source' => 'name'
                  ]
              ];
          }
}
