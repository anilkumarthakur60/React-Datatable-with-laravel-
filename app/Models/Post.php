<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Post extends Model
{
    use HasFactory;
    use Sluggable;

    protected $guarded = [];


    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }


    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'name',
            ],
        ];
    }


    public function scopeWhereLike(Builder $query, $column, $value):Builder
    {
        if (empty($value)) {
            return $query;
        }
        return $query->where($column, 'like', '%' . $value . '%');
    }
}
