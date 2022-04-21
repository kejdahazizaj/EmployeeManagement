<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    use HasFactory;

    protected $table = 'Chat';

    protected $primaryKey = 'idChat';

    public $timestamps = false;

    protected $fillable = ['SenderId'
        ,'ReceiverId'
        ,'Message'];

    public function sender()
    {
        return $this->belongsTo(User::class,'SenderId');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'ReceiverId');
    }


}
