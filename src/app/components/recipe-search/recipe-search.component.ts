import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, Validators, ReactiveFormsModule, Form } from '@angular/forms';
import { RecipeSaverService } from '../../services/recipe-saver.service';
import { MealsResponse } from '../../recipe-saver-mealsResponse';//Get Rid of This
import { Recipe } from '../../recipe-saver-recipes.model';
import { Users } from '../../recipe-saver-users.model';//Get Rid of This
import { Meal } from '../../recipe-saver-meals.model';//Get Rid of This
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recipe-search.component.html',
  styleUrl: './recipe-search.component.css'
})
export class RecipeSearchComponent implements OnInit{

  sessionId = sessionStorage.getItem('userId') //userid from session storage - Not Needed
  currentUserId : number; // current userid parsed from session storage - Not Needed
  searchForm! : FormGroup;
  resultsForm! : FormGroup; //use to display the results of the search
  searchItem: string = ''; //use with the search bar to store the users input 
  categories : any[] = []; // use with the "get Cataegories" function
  selectedCategory : string = ''; //use with the form control to store the users selection
  //Get Rid of This
  // mealsFound : Meal[] = [];//use with the get meals by category function
  mealsFound : any[] = []; //use with the get meals by category function

  constructor(private fb: FormBuilder, private recipeService : RecipeSaverService, private router: Router ) {
    const storedUserId = sessionStorage.getItem('userId')
    this.currentUserId = storedUserId && !isNaN(Number(storedUserId)) ? parseInt(storedUserId, 10) : 0;
  }

  async ngOnInit() {
    //check if user is logged in on init
    if (!this.currentUserId) {
      alert('Please login to view your recipes');
      this.router.navigate(['/login']);
      return;
      }

    this.searchForm = this.fb.group({
      searchBar : [''],
      //Get Rid of This
      // selectedCategory: ['', Validators.required],
    })
    this.resultsForm = this.fb.group({
      mealList : this.fb.array([])
    }) 
    // clean this up 
    const storedUserId = sessionStorage.getItem('userId');
    this.sessionId = storedUserId;
    this.currentUserId = this.sessionId && !isNaN(Number(this.sessionId))
    ? parseInt(this.sessionId, 10)
    : 2;

  }
  //helper function to get the mealList form array
  get mealList(): FormArray {
    return this.resultsForm.get('mealList') as FormArray;
  }

  //when the user hits the "submit button" to execute a search
  async onSubmit(){
    const searchValue = this.searchForm.get('searchBar')?.value;
    this.searchItem = searchValue
    const results = await this.recipeService.searchByMealName(searchValue)
    console.log(results);//Get Rid of This
    this.mealsFound = results;
    if(this.mealsFound.length > 0){
      this.resultsForm = this.fb.group({
        mealList : this.fb.array([])
      })
      for(let i = 0; i < this.mealsFound.length; i++){
        const meal = this.mealsFound[i];
        console.log(meal);//Get Rid of This
        console.log(meal.strMeal);//Get Rid of This
        console.log(meal.strCategory);//Get Rid of This
        console.log(meal.strMealThumb);//Get Rid of This
        console.log(meal.strInstructions);//Get Rid of This
        //build ingredients and quantities arrays
        let combinedIngredients: string[] = [];
        for (let j = 1; j <= 20; j++){
          const ingredient = meal[`strIngredient${j}`];
          const quantity = meal[`strMeasure${j}`];
          //only add to array if not null
          if(ingredient && ingredient.trim().length > 0){
            const pair = `${ingredient} - ${quantity}`;
            combinedIngredients.push(pair);
          }
        }
        const mealIngredientString = combinedIngredients.join(', ');
        console.log(mealIngredientString);
        const mealGroup = this.fb.group({
          mealName : [meal.strMeal],
          mealCategory : [meal.strCategory],
          mealPicture : [meal.strMealThumb],
          mealInstructions : [meal.strInstructions],
          mealIngredients : [mealIngredientString],
        })
        console.log(mealGroup);//Get Rid of This
        this.mealList.push(mealGroup);
      }
      //console.log the results to see if they are correct
      console.log(this.mealsFound);//Get Rid of This
      console.log(this.resultsForm);//Get Rid of This
    } 
  }
  // method to save recipe when button is clicked
  addRecipe(i : number){
    const mealFormGroup = this.mealList.at(i)
    const newRecipe : Recipe = {
      recipeId: 0,
      recipeName: mealFormGroup.get('mealName')?.value,
      recipeCategory: mealFormGroup.get('mealCategory')?.value,
      ingredientList: mealFormGroup.get('mealIngredients')?.value,
      isOnList: false,
      userID: this.currentUserId
    }
    console.log(newRecipe)//Get Rid of This
    this.recipeService.addRecipe(newRecipe)
  }
}
