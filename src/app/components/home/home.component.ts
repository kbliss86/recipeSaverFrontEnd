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
  currentUserId : number = 2;

//Lists of Recipes, one for recipes on the shopping list, one for recipes not on the shopping list that the user can select from
  recipesOnList : Recipe[] = [] //"true" - on shopping list - Not Needed

  recipesNotOnList: Recipe[] = [] //"false" - not on shopping list - Not Needed

  userIngredients: Ingredient[] = []//Pull directly from the ingredient table

  selectedRecipeId : number = 0;
  displayedRecipe : Recipe | undefined;

  allRecipes : Recipe[] = []

  // selectedRecipe : Recipe | null = null
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
async onRecipeSelected(){
  console.log(this.selectedRecipeId)
  const foundRecipe = this.allRecipes.find(recipe => recipe.recipeId == this.selectedRecipeId);
  if (foundRecipe) {
    this.displayedRecipe = foundRecipe;
  }
  console.log(this.displayedRecipe)
}

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

//when user selects "add Recipe" button, add recipe to shopping list

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
