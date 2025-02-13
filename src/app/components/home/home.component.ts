import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../recipe-saver-recipes.model';
import { Ingredient } from '../../recipe-saver-ingredients.model';
import { Users } from '../../recipe-saver-users.model';
import { RecipeSaverService } from '../../services/recipe-saver.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  public userList : Users[] = []

//variables for Lists of All Recipes, All ingredients for a user and the selected recipe
  userIngredients: Ingredient[] = []//Pull directly from the ingredient table
  selectedRecipeId : number = 0;
  displayedRecipe : Recipe | undefined;
  allRecipes : Recipe[] = []
  currentUserId : number;

  constructor (private recipeService : RecipeSaverService, private router: Router ){
    const storedUserId = sessionStorage.getItem('userId')
    this.currentUserId = storedUserId && !isNaN(Number(storedUserId)) ? parseInt(storedUserId, 10) : 0;
  }

  async ngOnInit(){
    //check if user is logged in on init
    if (!this.currentUserId) {
      this.router.navigate(['/login']);
      return;
    }
    this.userList = await this.recipeService.getAllUsers()//probably not needed
    this.allRecipes = await this.recipeService.getAllRecipesByUserId(this.currentUserId)
    this.userIngredients = await this.recipeService.getAllIngredientsByUserId(this.currentUserId)
  }

//when user selects recipe from list, populate card with recipe details
async onRecipeSelected(){
  console.log(this.selectedRecipeId)
  const foundRecipe = this.allRecipes.find(recipe => recipe.recipeId == this.selectedRecipeId);
  if (foundRecipe) {
    this.displayedRecipe = foundRecipe;
  }
}

//when user selects "remove Recipe" button, remove recipe from shopping list can call the editRecipe method from the service
async removeChecked(){
  for (let ingredient of this.userIngredients) {
    if (ingredient.toRemove) {
      await this.recipeService.deleteIngredient(ingredient);
    }
  }
  //refresh list
  const userId = this.currentUserId;
  this.userIngredients = await this.recipeService.getAllIngredientsByUserId(this.currentUserId);
}

//when user selects "add ingredients" button, add ingredeients to shopping list
async addIngredients() {
  if (!this.displayedRecipe) return;
  //variable to store the current user's ID and ingredient list
  const userId = this.currentUserId;
  const ingString = this.displayedRecipe.ingredientList;
  //split ingredients by comma
  const byComma = ingString.split(',');

  //for loop to add each ingredient to the ingredient table
  for (let part of byComma) {
  //split the ingredient and measure by "-"
    const byDash = part.split('-');
    const ingName = (byDash[0]|| '').trim();
    const ingQty = (byDash[1]||'').trim();

    //if statement needs to happen inside for loop
    if (ingName) {
      const newIngredient: Ingredient = {
        ingredientId: 0,
        ingredientName: ingName,
        ingredientQuantity: ingQty,
        userId: userId,
        toRemove: false
      };
      await this.recipeService.addIngredient(newIngredient);
    }
  }
  //run the get all ingredients by user ID method to update the ingredient list
  this.userIngredients = await this.recipeService.getAllIngredientsByUserId(this.currentUserId);
}

}
