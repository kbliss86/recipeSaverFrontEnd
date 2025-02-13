import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

//component imports
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { RecipeSearchComponent } from './components/recipe-search/recipe-search.component';
import { LoginComponent } from './components/login/login.component';
import { RecipeManipulationComponent } from './components/recipe-manipulation/recipe-manipulation.component';


const routes: Routes = [
    // if there is no URL path use (redirect the /home path)
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    // if the URL path is /home switch to the HomeComponent
    { path: 'home', component: HomeComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'login', component: LoginComponent },
    { path: 'search', component: RecipeSearchComponent },
    { path: 'modify', component: RecipeManipulationComponent }

]


@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
