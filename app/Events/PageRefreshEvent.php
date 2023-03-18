<?php

namespace App\Events;

use App\Models\Post;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class PageRefreshEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public array $message;


    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(public Post $post)
    {
        $this->message = [
            'slug' => $post->slug,
            'to' => route('posts.show', $post->slug),
        ];
    }


    /**
     * Get the channels the event should broadcast on.
     *
     * @return Channel|array
     */
    public function broadcastOn()
    {

        return new PrivateChannel('pageRefreshChannel.2');
    }


    public  function  broadcastWith()
    {
        return [
            'message' => $this->message,
        ];
    }


}
