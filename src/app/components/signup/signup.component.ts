import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Users } from '../../recipe-saver-users.model';
import { HttpClient } from '@angular/common/http';//Get Rid of This
import { RecipeSaverService } from '../../services/recipe-saver.service';
import * as bcrypt from 'bcryptjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;
  

  constructor(private fb: FormBuilder, private recipieService : RecipeSaverService, private router: Router ) {}

  async ngOnInit() {
    this.signupForm = this.fb.group({
      userName:['', [Validators.required]],
      userEmail: ['', [Validators.required, Validators.email]],
      userPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
    })
  }

    
  

async onSubmit() {
  if(this.signupForm.invalid){
    alert('Please correct errors before submitting.');
    return;
  }
  
  try{
    // This Hashes the password before sending it to the backend
    const saltRounds = 10; // Number of salt determins how many of hashing algorithim will be applied to password. 10-12 is typically sufficient for web apps to prevent brute force
    const hashedPassword = await bcrypt.hash(this.signupForm.value.userPassword, saltRounds);

    // This replaces the plain text password with the hashed password
    const hashPass = {...this.signupForm.value, userPassword: hashedPassword};

    const newUser : Users = {
      userId: 0,
      userName: this.signupForm.value.userName,
      userEmail: this.signupForm.value.userEmail,
      userPassword: hashPass.userPassword
    }

    const response = await this.recipieService.addUser(newUser);
    console.log('User sign-up successfully:', response);//Get Rid of This
    alert('Sign-up Successfull!');//Get Rid of This
    this.router.navigate(['/login']);
  }
  catch (error) {
    console.error('Error during Sign-up', error);//Get Rid of This
    alert('Sign-up Failed');
  }
  
} 
}

