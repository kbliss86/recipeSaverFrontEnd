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

  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
  
      try {
        // Fetch user from the database
        const userFromDb : Users = await this.recipeService.getUserByEmail(email);
        
        if (userFromDb) {
          const isPasswordMatch = await bcrypt.compare(password, userFromDb.userPassword);
          if (isPasswordMatch) {
            
            sessionStorage.setItem('userId', JSON.stringify(userFromDb.userId));

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
