<?php

namespace App\Broadcasting;

use App\Models\User;

class PageRefreshChannel
{
    /**
     * Create a new channel instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function join(User $user, $id)
    {
        return (int) $user->id === (int) $id;
        //
    }
}
