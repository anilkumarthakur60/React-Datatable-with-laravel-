<?php

namespace App\Http\Controllers\Api;

use App\Models\Post;
use App\Http\Resources\PostResource;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Http\Controllers\SuperController;

class PostController extends SuperController
{
    public function __construct()
    {
        parent::__construct(
            Post::class,
            PostResource::class,
            StorePostRequest::class,
            UpdatePostRequest::class
        );
    }
    //
}
