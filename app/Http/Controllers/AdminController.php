<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Employee;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    //
    public function home()
    {
        //return deps
        $EmployeeData = Employee::all();
        return view('Pages/crud-data-list', ['employees' => $EmployeeData]);
    }

    public function createEmployee()
    {
        return view('Pages/create');
    }

    public function createEmployeePost(Request $request)
    {

        $defaultPassword = 123456;
        //validate input
        //if fails return back with errors
        //if ok create user and employee
        // Redirect to home

        $validator = Validator::make($request->all(),[
            'SSN'=>'required',
            'Username'=>'required',
            'Name'=>'required',
            'Department'=>'required'
        ]);
//        $validator = \Validator::make($request->all());
//        $validator['password']=md5($validator['password']);

        if ($validator->fails()) {
            return \Redirect::to('addEmployee')
                ->withErrors($validator)
                ->withInput();

             } else {

            $employeeRole = Role::where('idRole',2)->first();

            $user = User::create([
                'Username' => request('Username'),
                'Password' => md5($defaultPassword),
            ]);

            $employeeRole->users()->save($user);

            Employee::create([
                'SSN' => request('SSN'),
                'Name' => request('Name'),
                'LastName'=> request('Name'),
                'DepartmentId' => request('Department'),
                'UserId'=>$user->idUser
            ]);
            return redirect('/home');
        }
    }
}
