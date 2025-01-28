import { Injectable } from '@angular/core';
import { Recipe } from '../recipe-saver-recipes.model';
import { Users } from '../recipe-saver-users.model';
import { lastValueFrom } from 'rxjs';
import { HttpClient }    from '@angular/common/http';
import { HttpHeaders }   from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipeSaverService {

  private recipesOnList : Recipe[] = [] //"true" - on shopping list 

  private recipesNotOnList: Recipe[] = [] //"false" - not on shopping list

  private allUserRecipes : Recipe[] = [] // all user recipes regardless of list affilation

  private listOfUsers : Users[] = []

  private theServerUrl : string = "https://localhost:7218/api/RecipeSaverApi"

  constructor(private theServer:HttpClient) {}
  // ========================
  //        USER CRUD
  // ========================
   
    // Method to get Users
    async getAllUsers() : Promise<Users[]> {
      const result : Users[] =
      await lastValueFrom(this.theServer.get<Users[]>(this.theServerUrl+"/users"))
      this.listOfUsers
      return result
    }

    // Method to add User
    async addUser(newUser : Users){
      
      const headers = new HttpHeaders ({
        'Content-Type' : 'application/json'
      });
      
      return lastValueFrom(this.theServer.post(this.theServerUrl+"/users", newUser, {headers}))
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
      await lastValueFrom(this.theServer.delete(this.theServerUrl + "/users" +aUser.userID))
    }

  // ========================
  //       RECIPE CRUD
  // ========================

    // Method to get all recipes by userId
    async getAllRecipesByUserId(userId : number) : Promise<Recipe[]> {
      const result : Recipe[] =
      await lastValueFrom(this.theServer.get<Recipe[]>(this.theServerUrl+"/recipes/"+userId))
      this.allUserRecipes = result
      return result
    }

    // Method to get all recipes by userId with Boolean option
    async getAllRecipesByUserIdAndList(userId : number, onList? : boolean) : Promise<Recipe[]> {
      const result : Recipe[] =
      await lastValueFrom(this.theServer.get<Recipe[]>(this.theServerUrl+"/recipes/"+userId+"?isOnlist="+onList))
      if(onList){
        this.recipesOnList = result
      } else {
        this.recipesNotOnList = result
      }
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
  //     MealDB EXTERNAL
  // ========================

}
