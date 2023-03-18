<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {

        Category::factory(1)->hasPosts(2)->create();

        User::updateOrCreate([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
        ], [
            'password' => bcrypt('aaaassss'),

        ]);
        User::updateOrCreate([
            'name' => 'Admin',
            'email' => 'admin1@gmail.com',
        ], [
            'password' => bcrypt('aaaassss'),

        ]);
        User::updateOrCreate([
            'name' => 'Admin',
            'email' => 'admin2@gmail.com',
        ], [
            'password' => bcrypt('aaaassss'),

        ]);
        User::updateOrCreate([
            'name' => 'Admin',
            'email' => 'admin3@gmail.com',
        ], [
            'password' => bcrypt('aaaassss'),

        ]);
    }
}
