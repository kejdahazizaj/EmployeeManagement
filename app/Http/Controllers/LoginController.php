<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    public function show()
    {
        return view('login', [
        'layout' => 'login'
        ]);
    }

    public function doLogin(Request $request)
    {
        $rules = array(
            'username'    => 'required', // make sure the email is an actual email
            'password' => 'required|alphaNum|min:3' // password can only be alphanumeric and has to be greater than 3 characters
        );

        // run the validation rules on the inputs from the form
        $validator = \Validator::make($request->all(), $rules);
        // if the validator fails, redirect back to the form
        if ($validator->fails()) {
            return \Redirect::to('login')
                ->withErrors($validator) // send back all errors to the login form
                ->withInput($request->except('password')); // send back the input (not the password) so that we can repopulate the form
        } else {
            // attempt to do the login
            $user = User::where('Username',$request->get('username'))->where('Password',md5($request->get('password')))->first();
            if ($user != null) {
                \Auth::loginUsingId($user->idUser);
                $request->session()->regenerate();
                return redirect()->intended('home');

            }
            return back()->withErrors([
                'username' => 'The provided credentials do not match our records.',
            ]);
        }
    }
}
