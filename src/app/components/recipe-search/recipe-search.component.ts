import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, Validators, ReactiveFormsModule, Form } from '@angular/forms';
import { RecipeSaverService } from '../../services/recipe-saver.service';
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
  searchItem: string = '';//use with the search bar to store the users input 
  categories : any[] = [];// use with the "get Cataegories" function
  selectedCategory : string = '';//use with the form control to store the users selection
  mealsFound : Meal[] = [];//use with the get meals by category function

  constructor(private fb: FormBuilder, private recipeService : RecipeSaverService) {}

  async ngOnInit() {
    this.searchForm = this.fb.group({
      searchBar : [''],
      // selectedCategory: ['', Validators.required],
      
    })   
  }
  //when the user hits the "submit button" to execute a search
  async onSubmit(){
    const searchValue = this.searchForm.get('searchBar')?.value;
    this.searchItem = searchValue
    const results = await this.recipeService.searchByMealName(searchValue)
    console.log(results);
    this.mealsFound = results;
    console.log(this.mealsFound);
    // this.recipeService.searchByMealName(searchItem)
    // console.log(this.recipeService.searchByMealName(searchItem));
    //get the selected category from the form control
    //use the selected category to get the meals from the database
    //store the meals in the mealsFound array
  }

  //**use the meals found array to use either reactive form or ngFor to create a list of "form objects" */
  //create a form array to creates a list of form objects with the Name, Category, Picture and Description of the meal with an "Add Button"
  //create logic to combine ingredient and qty into a single string

        //create two arrays, one for the ingredients and one for the quantities
          //there will always be 20 ingredients and 20 quantities - push the ingredients and quantities into the arrays in the same order so the indexes match
        //use a for loop to combine the two arrays into a single string
        // for(let i = 0; i < 20; i++){
        //const ingredient = ingredients[i];
        //const quantity = quantities[i];
        //if not null then add to the string using "ingredient + " - " + quantity"

  //assign the ingredients to the form object as a hidden input field


  //method/function to add the meal to the users list of meals if they click the "Add Button"

}
