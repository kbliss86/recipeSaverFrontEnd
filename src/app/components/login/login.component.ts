import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Users } from '../../recipe-saver-users.model';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { RecipeSaverService } from '../../services/recipe-saver.service';
import * as bcrypt from 'bcryptjs';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { consumerMarkDirty } from '@angular/core/primitives/signals';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit{
    loginForm!: FormGroup;
  
    constructor(private fb: FormBuilder, private recipeService : RecipeSaverService, private router : Router) {}
    
    async ngOnInit() {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      });
    }
  // may need to create a "User Object" to store the user's email and password when the method is called -ignore for now
  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('email', email);
      console.log('password', password)
  
      try {
        // Fetch user from the database
        const userFromDb : Users = await this.recipeService.getUserByEmail(email);
        console.log('Fetched userFromDb:', JSON.stringify(userFromDb, null, 2));

        if (userFromDb) {
          console.log('UserFromDb' + userFromDb.userEmail)
          const isPasswordMatch = await bcrypt.compare(password, userFromDb.userPassword);
  
          if (isPasswordMatch) {
            alert('Login Successful!');
            sessionStorage.setItem('userId', JSON.stringify(userFromDb.userID));
            this.router.navigate(['/home']);
          } else {
            alert('Invalid email or password.');
          }
        } else {
          alert('Invalid email or password.');
        }
      } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again later.');
      }
    } else {
      alert('Please enter valid login details.');
    }
  }
}
       
        //compare form values with the values from the database
        //bcrypt.compare(plaintextPassword, hashedPasswordFromServer)
        //if true
        
        //store user ID in session storage
        //redirect user to home page
      
        //if false

//Add in a portion where the user ID is pulled and stored in session storage so other pages can access it
//bcrypt.compare(plaintextPassword, hashedPasswordFromServer)

//if false then error
//if true then store user ID in session storage
