<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $table = 'Department';

    protected $primaryKey = 'idDepartment';

    public $timestamps = false;

    protected $fillable = ['Name'
        ,'ParentId'];

    public function employee()
    {
        return $this->hasMany(Employee::class, 'DepartmentId', 'idDepartment');
    }
}
