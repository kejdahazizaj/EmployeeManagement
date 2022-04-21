<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $table = 'Role';

    protected $primaryKey = 'idRole';

    public $timestamps = false;

    protected $fillable = ['Name'];

    public function users()
    {
        return $this->hasMany(User::class, 'IdRole', 'idRole');
    }
}
