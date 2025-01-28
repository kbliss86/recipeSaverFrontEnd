import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../recipe-saver-recipes.model';
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
  recipesOnList : Recipe[] = [] //"true" - on shopping list 

  recipesNotOnList: Recipe[] = [] //"false" - not on shopping list

  selectedReciepeId : number = 0;

  selectedRecipe : Recipe | null = null;
  
  constructor (private recipeService : RecipeSaverService ){}

  async ngOnInit(){
    this.userList = await this.recipeService.getAllUsers()
    this.recipesOnList = await this.recipeService.getAllRecipesByUserIdAndList(this.currentUserId, true)
    this.recipesNotOnList = await this.recipeService.getAllRecipesByUserIdAndList(this.currentUserId, false)
    console.log(this.recipesOnList)
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

async addChecked(){
  this.recipesNotOnList = this.recipesNotOnList.filter(i => i.isOnList);

  for (const recipe of this.recipesNotOnList) {
    recipe.isOnList = true;
    await this.recipeService.updateRecipe(recipe);
  }
  this.recipesOnList = await this.recipeService.getAllRecipesByUserIdAndList(this.currentUserId, true)
  this.recipesNotOnList = await this.recipeService.getAllRecipesByUserIdAndList(this.currentUserId, false)
  console.log("addChecked")
}


}
