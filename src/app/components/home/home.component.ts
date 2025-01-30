import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../recipe-saver-recipes.model';
import { Ingredient } from '../../recipe-saver-ingredients.model';
import { Users } from '../../recipe-saver-users.model';
import { RecipeSaverService } from '../../services/recipe-saver.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  public userList : Users[] = []

// This is hard coded for now, but will be replaced with the current user's ID once we have login service set up, the variable will be equual to data stored in session storage
  currentUserId : number = 1;

//Lists of Recipes, one for recipes on the shopping list, one for recipes not on the shopping list that the user can select from
  recipesOnList : Recipe[] = [] //"true" - on shopping list - Not Needed

  recipesNotOnList: Recipe[] = [] //"false" - not on shopping list - Not Needed

  userIngredients: Ingredient[] = []//Pull directly from the ingredient table

  selectedReciepeId : number = 0;
  displayedRecipe? : Recipe;

  allRecipes : Recipe[] = []

  selectedRecipe : Recipe | null = null;
  
  constructor (private recipeService : RecipeSaverService ){}

  async ngOnInit(){
    this.userList = await this.recipeService.getAllUsers()
    this.recipesOnList = await this.recipeService.getAllRecipesByUserIdAndList(this.currentUserId, true)
    this.recipesNotOnList = await this.recipeService.getAllRecipesByUserIdAndList(this.currentUserId, false)
    this.allRecipes = await this.recipeService.getAllRecipesByUserId(this.currentUserId)
    this.userIngredients = await this.recipeService.getAllIngredientsByUserId(this.currentUserId)
    console.log(this.recipesOnList)
    console.log(this.userIngredients)
  }

  //consolelog the recipeonlist and recipenot on list
  // console.log(recipesOnList)

//when user selects recipe from list, populate card with recipe details

//when user selects "add Recipe" button, add recipe to shopping list

//when user selects "remove Recipe" button, remove recipe from shopping list can call the editRecipe method from the service
async removeUnchecked(){
  this.recipesOnList = this.recipesOnList.filter(i => !i.isOnList);

  for (const recipe of this.recipesOnList) {
    recipe.isOnList = false;
    await this.recipeService.updateRecipe(recipe);
  }
  this.recipesOnList = await this.recipeService.getAllRecipesByUserIdAndList(this.currentUserId, true)
  this.recipesNotOnList = await this.recipeService.getAllRecipesByUserIdAndList(this.currentUserId, false)
  console.log("removeUnchecked")
}

async addChecked(aRecipe : Recipe){
  this.recipesNotOnList = this.recipesNotOnList.filter(i => i.isOnList);

  //split the ingredient property from the recipe and store it in an array

  //loop through the array and add each one to the ingredient table under the users ID 
  for (const recipe of this.recipesNotOnList) {
    recipe.isOnList = true;
    await this.recipeService.updateRecipe(recipe);
  }
  this.recipesOnList = await this.recipeService.getAllRecipesByUserIdAndList(this.currentUserId, true)
  this.recipesNotOnList = await this.recipeService.getAllRecipesByUserIdAndList(this.currentUserId, false)
  console.log("addChecked")
}


}
