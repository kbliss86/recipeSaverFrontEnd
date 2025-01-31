import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Users } from '../../recipe-saver-users.model';
import { HttpClient } from '@angular/common/http';
import { RecipeSaverService } from '../../services/recipe-saver.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

user = {
  userID: 0,
  userName: '',
  userEmail: '',
  userPassword: '',
};
  
constructor (private recipieService : RecipeSaverService) {}

async onSubmit() {
  try{
    const response = await this.recipieService.addUser(this.user);
    console.log('User sign-up successfully:', response);
    alert('Sign-up Successfull!');
  }
  catch (error) {
    console.error('Error during Sign-up', error);
    alert('Sign-up Failed');
  }
  
} 
}

