<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'user';

    protected $primaryKey = 'idUser';

    public $timestamps = false;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'Username',
        'Password',
        'IdRole'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function setPasswordAttribute($value)
    {
        $this->attributes['Password'] = md5($value);
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'idRole');
    }

    public function employee()
    {
        return $this->hasOne(Employee::class,'UserId', 'idUser' );
    }

    public function sender()
    {
        return $this->hasOne(Chat::class,'SenderId', 'idUser');
    }

    public function receiver()
    {
        return $this->hasOne(Chat::class, 'ReceiveId', 'idUser');
    }

}
