<?php

namespace App\Observers;

use App\Models\Post;
use App\Events\PageRefreshEvent;

class PostObserver
{

    public function created(Post $post): void
    {
        broadcast(new PageRefreshEvent($post))->toOthers();

        //
    }

    public function updated(Post $post)
    {
        //
    }


    public function deleted(Post $post)
    {

        broadcast(new PageRefreshEvent($post))->toOthers();
    }

    public function restored(Post $post)
    {
        //
    }

    public function forceDeleted(Post $post)
    {

        broadcast(new PageRefreshEvent($post))->toOthers();
    }
}
