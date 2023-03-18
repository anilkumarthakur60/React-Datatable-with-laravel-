<?php

namespace App\Models;

use App\Traits\CRUD;
use App\Events\PageRefreshEvent;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Post extends Model
{
    use HasFactory;
    use Sluggable;
    use  CRUD;

    protected $guarded = [];
    protected $fillable = [
        'name',
        'slug',
        'category_id',
    ];


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

    public function scopeQueryFilter(Builder $query,$search): Builder
    {
        if (empty($search)) {
            return $query;
        }

        return $query->likeWhere(['name'],$search);
    }

    public function afterDeleteProcess(): void
    {

        broadcast(new PageRefreshEvent($this))->toOthers();
    }
}
