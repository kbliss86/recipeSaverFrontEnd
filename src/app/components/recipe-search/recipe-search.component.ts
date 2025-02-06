import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, Validators, ReactiveFormsModule, Form } from '@angular/forms';
import { RecipeSaverService } from '../../services/recipe-saver.service';
import { MealsResponse } from '../../recipe-saver-mealsResponse';
import { Recipe } from '../../recipe-saver-recipes.model';
import { Users } from '../../recipe-saver-users.model';
import { Meal } from '../../recipe-saver-meals.model';

@Component({
  selector: 'app-recipe-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recipe-search.component.html',
  styleUrl: './recipe-search.component.css'
})
export class RecipeSearchComponent implements OnInit{

  searchForm! : FormGroup;
  resultsForm! : FormGroup; //use to display the results of the search
  searchItem: string = '';//use with the search bar to store the users input 
  categories : any[] = [];// use with the "get Cataegories" function
  selectedCategory : string = '';//use with the form control to store the users selection
  // mealsFound : Meal[] = [];//use with the get meals by category function
  mealsFound : any[] = [];//use with the get meals by category function

  constructor(private fb: FormBuilder, private recipeService : RecipeSaverService) {}

  async ngOnInit() {
    this.searchForm = this.fb.group({
      searchBar : [''],
      // selectedCategory: ['', Validators.required],
    })
    this.resultsForm = this.fb.group({
      mealList : this.fb.array([])
    }) 
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
    console.log(results);
    this.mealsFound = results;
    if(this.mealsFound.length > 0){
      this.resultsForm = this.fb.group({
        mealList : this.fb.array([])
      })
      for(let i = 0; i < this.mealsFound.length; i++){
        const meal = this.mealsFound[i];
        console.log(meal);
        console.log(meal.strMeal);
        console.log(meal.strCategory);
        console.log(meal.strMealThumb);
        console.log(meal.strInstructions);
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
        console.log(mealGroup);
        this.mealList.push(mealGroup);
      }
      //console.log the results to see if they are correct
      console.log(this.mealsFound);
      console.log(this.resultsForm);
    } 
  }
}
