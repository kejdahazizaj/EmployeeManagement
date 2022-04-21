<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $table = 'Employee';

    protected $primaryKey = 'SSN';

    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'SSN',
        'Name',
        'LastName',
        'DepartmentId',
        'UserId'
    ];

    public function users()
    {
        return $this->belongsTo(User::class, 'UserId');
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'DepartmentId');
    }


}
