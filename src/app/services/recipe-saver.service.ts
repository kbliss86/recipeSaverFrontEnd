import { Injectable } from '@angular/core';
import { Recipe } from '../recipe-saver-recipes.model';
import { Users } from '../recipe-saver-users.model';
import { Meal } from '../recipe-saver-meals.model';
import { MealsResponse } from '../recipe-saver-mealsResponse';
import { Category } from '../recipe-saver-categories.model';
import { Ingredient } from '../recipe-saver-ingredients.model';
import { lastValueFrom } from 'rxjs';
import { HttpClient }    from '@angular/common/http';
import { HttpHeaders }   from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RecipeSaverService {

  private theServerUrl : string = environment.apiDomain //variable to provide URL for our api based on the run enivronment

  private recipeServerURl : string = "https://www.themealdb.com/api/json/v1/1" //external api url

  constructor(private theServer:HttpClient) {}
  // ========================
  //        USER CRUD
  // ========================
   
    // Method to get Users
    async getAllUsers() : Promise<Users[]> {
      const result : Users[] =
      await lastValueFrom(this.theServer.get<Users[]>(this.theServerUrl+"/users"))
      return result
    }

    //method to get user by email
    async getUserByEmail ( email : string) : Promise <Users>{
      const encodedEmail = encodeURIComponent(email); // Encode the email for URL safety
      const result: Users = await lastValueFrom(
        this.theServer.get<Users>(`${this.theServerUrl}/user?email=${encodedEmail}`)
      );
      return result;
    }

    // Method to add User
    async addUser(newUser : Users){
      
      const headers = new HttpHeaders ({
        'Content-Type' : 'application/json'
      });
      
      return lastValueFrom(this.theServer.post(this.theServerUrl+"/users", newUser, {headers, withCredentials: true } ))
    }

    // Method to update Users
    async updateUser(updateUser : Users){
      const headers = new HttpHeaders({
        'Content-Type' : 'application/json'
      })
      lastValueFrom(this.theServer.put(this.theServer+"/users", updateUser, {headers}))
    }
    
    // Method to delete Users
    async deleteUser(aUser : Users){
      await lastValueFrom(this.theServer.delete(this.theServerUrl + "/users" +aUser.userId))
    }

  // ========================
  //       RECIPE CRUD
  // ========================

    // Method to get all recipes by userId
    async getAllRecipesByUserId(userId : number) : Promise<Recipe[]> {
      const result : Recipe[] =
      await lastValueFrom(this.theServer.get<Recipe[]>(this.theServerUrl+"/recipes/"+userId))
      return result
    }

    // Method to get all recipes by userId with Boolean option
    async getAllRecipesByUserIdAndList(userId : number, onList? : boolean) : Promise<Recipe[]> {
      const result : Recipe[] =
      await lastValueFrom(this.theServer.get<Recipe[]>(this.theServerUrl+"/recipes/"+userId+"?isOnlist="+onList))
      return result
    }

    // Method to get Recipe by Recipe ID
    async getRecipeByRecipeId(recipeId : number) : Promise<Recipe[]> {
      const result : Recipe[] =
      await lastValueFrom(this.theServer.get<Recipe[]>(this.theServerUrl+"/recipe/"+recipeId))
      return result
    }

    // Method to add Recipe
    async addRecipe(newRecipe : Recipe){
      const headers = new HttpHeaders({
        'Content-Type' : 'application/json'
      })
      return lastValueFrom(this.theServer.post(this.theServerUrl+"/recipe", newRecipe, {headers}))
    }

    // Method to update Recipe
    async updateRecipe(updateRecipe : Recipe){
      const headers = new HttpHeaders({
        'Content-Type' : 'application/json'
      })
      return lastValueFrom(this.theServer.put(this.theServerUrl+"/recipe", updateRecipe, {headers}))
    }

    // Method to delete Recipe
    async deleteRecipe(aRecipe : Recipe){
      return lastValueFrom(this.theServer.delete(this.theServerUrl+"/recipe/"+aRecipe.recipeId))
    }
  // ========================
  //     Ingredient CRUD
  // ========================

    //console.log the URL to see if it is correct
    //Method to get ingredients by userId
    async getAllIngredientsByUserId(userId : number) : Promise<Ingredient[]> {
      const result : Ingredient[] =
      await lastValueFrom(this.theServer.get<Ingredient[]>(this.theServerUrl+"/ingredients/"+userId))
      return result
    }

    //console.log the URL to see if it is correct


    //Method to add ingredient
    async addIngredient(newIngredient : Ingredient){
      const headers = new HttpHeaders({
        'Content-Type' : 'application/json'
      })
      return lastValueFrom(this.theServer.post(this.theServerUrl+"/ingredient", newIngredient, {headers}))
    }

    //Method to delete ingredient
    async deleteIngredient(aIngredient : Ingredient){
      return lastValueFrom(this.theServer.delete(this.theServerUrl+"/ingredient/"+aIngredient.ingredientId))
    }

  // ========================
  //     MealDB EXTERNAL
  // ========================

  //Method to search recipe by name/partial name
  async searchByMealName(mealName: string): Promise<Meal[]> {
    const result : MealsResponse = await lastValueFrom(this.theServer.get<MealsResponse>(this.recipeServerURl+"/search.php?s=" + mealName))
    return result.meals ?? [];
  }

  //Method to get a single random meal
  async getARandomMeal() : Promise<Meal> {
    const result : Meal = await lastValueFrom(this.theServer.get<Meal>(this.recipeServerURl+"/random.php"))
    return result
  }

  //Method to get a single meal by id
  async getMealByID(id : number) : Promise<Meal> {
    const result : Meal = await lastValueFrom(this.theServer.get<Meal>(this.recipeServerURl + "/lookup.php?1=" + id))
    return result
  }

  // Method to get all meal categories (to be used in a dropdown to provide valid categories to filter by in the search component)
  async getAllCategories() : Promise<Category[]> {
    const result : Category [] = await lastValueFrom(this.theServer.get<Category[]>(this.recipeServerURl + "/categories.php"))
    return result
  }

  // Method to filter meals by their main ingredient (NOTE: ingredients must be formatted as 'ingredient_name')
  async filterMealsByMainIngredient(ingredientName : string) : Promise<Meal[]> {
    const result : Meal[] = await lastValueFrom(this.theServer.get<Meal[]>(this.recipeServerURl + "/filter.php?i=" + ingredientName))
    return result
  }

  //method to filter meals by their category
  async filterMealsByCategory (category : string) : Promise<Meal[]> {
    const result : Meal[] = await lastValueFrom(this.theServer.get<Meal[]>(this.recipeServerURl + "/filter.php?c=" + category))
    return result
  }

  // method to filter meals by region of origin 
  async filterMealsByRegion (place : string) : Promise<Meal[]> {
    const result : Meal[] = await lastValueFrom(this.theServer.get<Meal[]>(this.recipeServerURl + "/filter.php?a=" + place))
    return result
  }


}
