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

    /**
     * Authenticate the user's access to the channel.
     *
     * @param  \App\Models\User  $user
     * @return array|bool
     */
    public function join(User $user, $id)
    {
        return (int) $user->id === (int) $id;
        //
    }
}
