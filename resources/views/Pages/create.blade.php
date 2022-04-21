@extends('../layout/' . $layout)

@section('subhead')
    <title>Update Profile - Midone - Tailwind HTML Admin Template</title>
@endsection

@section('subcontent')
    <div class="intro-y flex items-center mt-8">
        <h2 class="text-lg font-medium mr-auto">Add New Employee</h2>
    </div>
    <div class="grid grid-cols-12 gap-6">
<div class="col-span-12 lg:col-span-8 2xl:col-span-9">
            <!-- BEGIN: Display Information -->
            <div class="intro-y box lg:mt-5">
                <div class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 class="font-medium text-base mr-auto">Add Information</h2>
                </div>
                <div class="p-5">
                    <div class="flex flex-col-reverse xl:flex-row flex-col">
                        <div class="flex-1 mt-6 xl:mt-0">
                            <div class="grid grid-cols-12 gap-x-5">
                                <div class="col-span-12 2xl:col-span-6">
                                    <form id="addEmployee-form" method="POST" action="/addEmployee">
                                        @csrf
                                    <div>
                                        <label for="post-form-7" class="form-label">SSN</label>
                                        <input id="post-form-7" type="text" name="SSN" class="form-control" placeholder="Add SSN">
                                    </div>
                                    <div class="mt-3">
                                        <label for="post-form-7" class="form-label">Employee Name</label>
                                        <input id="post-form-7" type="text" name="Name" class="form-control" placeholder="Add Employee Name">

                                        <label for="post-form-7" class="form-label">Username</label>
                                        <input id="post-form-7" name="Username" type="text" class="intro-x login__input form-control py-3 px-4 block" placeholder="Add Username">
                                        @error('username')
                                        <div id="error-username" class="login__input-error text-danger mt-2">{{ $message }}</div>
                                        @enderror
                                        <label for="post-form-7" class="form-label">Password</label>
                                        <input id="post-form-7" name="Password" type="password" class="intro-x login__input form-control py-3 px-4 block mt-4" placeholder="Add Password">
                                        @error('password')
                                        <div id="error-password" class="login__input-error text-danger mt-2">{{ $message }}</div>
                                        @enderror
                                </div>
                                    <div class="mt-3">
                                        <label for="post-form-7" class="form-label">Department</label>
                                        <select id="post-form-7" data-search="true" name="Department" class="tom-select w-full">
                                            <option value="1">Finance</option>
                                            <option value="2">IT</option>
                                        </select>
                                    </div>
                                        <input type="submit" class="btn btn-primary w-20 mt-3" value="Save"/>
                                    </form>
                                    </div>

                            </div>
                            </div>

                        </div>
                      </div>
                    </div>
                </div>
            </div>




@endsection
