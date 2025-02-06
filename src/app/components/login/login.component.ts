import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit{
    loginForm!: FormGroup;
  
    constructor(private fb: FormBuilder) {}
    
    async ngOnInit() {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      });
    }
  // may need to create a "User Object" to store the user's email and password when the method is called -ignore for now
    onSubmit() {
      if (this.loginForm.valid) {
        //Call Get User by email API Method from service
        const { email, password } = this.loginForm.value;
        console.log('User Login:', { email, password });
        //compare form values with the values from the database
        //bcrypt.compare(plaintextPassword, hashedPasswordFromServer)
        //if true
        alert('Login Successful!');
        //store user ID in session storage
        //redirect user to home page
      } else {
        //if false
        alert('Please enter valid login details.');
      }
    }
 
//Add in a portion where the user ID is pulled and stored in session storage so other pages can access it
//bcrypt.compare(plaintextPassword, hashedPasswordFromServer)

//if false then error
//if true then store user ID in session storage
}
