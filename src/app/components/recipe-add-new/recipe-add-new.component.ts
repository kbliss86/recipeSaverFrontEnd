import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';//Get Rid of This
import { Ingredient } from '../../recipe-saver-ingredients.model';//Get Rid of This
import { Recipe } from '../../recipe-saver-recipes.model';
import { FormGroup, FormBuilder, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { RecipeSaverService } from '../../services/recipe-saver.service';

@Component({
  selector: 'app-recipe-add-new',
  standalone: true,
  //Get Rid of This
  // imports: [CommonModule, FormsModule, FormGroup, FormBuilder, FormArray, Validators],
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recipe-add-new.component.html',
  styleUrl: './recipe-add-new.component.css'
})
export class RecipeAddNewComponent implements OnInit {
recipeForm!: FormGroup;

//Get Rid of This
//Add in hardcoded user ID for now, will be replaced with the current user's ID once we have login service set up, the variable will be equual to data stored in session storage
currentUserId : number;

constructor(private fb: FormBuilder, private recipeService : RecipeSaverService) {
  const storedUserId = sessionStorage.getItem('userId');
  this.currentUserId = storedUserId && !isNaN(Number(storedUserId)) ? parseInt(storedUserId, 10) : 0;
}


ngOnInit(): void {
    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      ingredientList: this.fb.array([]),
      //Get Rid of This
      // measureList: this.fb.array([])
    });

    this.addIngredient();
}

//helper getter for easier access in the tamplate - this is so we dont have to retype this.recipeForm.get('ingredientList') as FormArray; in the template
get ingredientList() {
  return this.recipeForm.get('ingredientList') as FormArray;
}

addIngredient(): void {
  const ingredientGroup = this.fb.group({
    
    name: ['', Validators.required],
    quantity: ['', Validators.required],
  });
  this.ingredientList.push(ingredientGroup);
}

removeIngredient(index: number): void {
  this.ingredientList.removeAt(index);
}

onSubmit(): void{
  const formValue = this.recipeForm.value;
  const ingredientsString = formValue.ingredientList
    .map((ing: any) => `${ing.name} - ${ing.quantity}`)
    .join(', ');

  console.log(formValue);//Get Rid of This
  console.log(ingredientsString);//Get Rid of This
  console.log(formValue.recipeName);//Get Rid of This
  console.log(formValue.recipeCategory);//Get Rid of This

  const newRecipe : Recipe = {
    recipeId: 0,
    recipeName: formValue.title, 
    recipeCategory: formValue.category,
    ingredientList: ingredientsString,
    isOnList: false,
    userID: this.currentUserId
  }
  //Get Rid of This
  //add in the add recipe method from the service
  this.recipeService.addRecipe(newRecipe)

}

}
