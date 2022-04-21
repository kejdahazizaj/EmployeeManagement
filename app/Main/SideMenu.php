<?php

namespace App\Main;

class SideMenu
{
    /**
     * List of side menu items.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public static function menu()
    {
        return [
            'dashboard' => [
                'icon' => 'home',
                'title' => 'Home',
            ]
        ];
    }
}
