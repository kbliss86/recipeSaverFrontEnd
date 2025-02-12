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
    //Get Rid of This
  // may need to create a "User Object" to store the user's email and password when the method is called -ignore for now
  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('email', email);//Get Rid of This
      console.log('password', password)//Get Rid of This
  
      try {
        // Fetch user from the database
        const userFromDb : Users = await this.recipeService.getUserByEmail(email);
        console.log('Fetched userFromDb:', JSON.stringify(userFromDb, null, 2));//Get Rid of This
        
        if (userFromDb) {
          console.log('UserFromDb: ' + userFromDb.userEmail);//Get Rid of This
          console.log('UserFromDb: ' + userFromDb.userId);//Get Rid of This
          const isPasswordMatch = await bcrypt.compare(password, userFromDb.userPassword);
          console.log('isPasswordMatch:', isPasswordMatch);//Get Rid of This
          if (isPasswordMatch) {
            alert('Login Successful!');//Get Rid of This
            sessionStorage.setItem('userId', JSON.stringify(userFromDb.userId));
            //Get Rid of This
            // sessionStorage.setItem("userId", JSON.stringify(userFromDb.userID));
            console.log('Stored userId in session:', sessionStorage.getItem("userId"));//Get Rid of This
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
  async onSignup(){
    this.router.navigate(['/signup']);
  }
}
