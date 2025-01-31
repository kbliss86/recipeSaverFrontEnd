import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ingredient } from '../../recipe-saver-ingredients.model';
import { Recipe } from '../../recipe-saver-recipes.model';
import { FormGroup, FormBuilder, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { RecipeSaverService } from '../../services/recipe-saver.service';

@Component({
  selector: 'app-recipe-add-new',
  standalone: true,
  // imports: [CommonModule, FormsModule, FormGroup, FormBuilder, FormArray, Validators],
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recipe-add-new.component.html',
  styleUrl: './recipe-add-new.component.css'
})
export class RecipeAddNewComponent implements OnInit {
recipeForm!: FormGroup;

//Add in hardcoded user ID for now, will be replaced with the current user's ID once we have login service set up, the variable will be equual to data stored in session storage
currentUserId : number = 2;

constructor(private fb: FormBuilder) {}


ngOnInit(): void {
    this.recipeForm = this.fb.group({
      recipeName: ['', Validators.required],
      recipeCategory: ['', Validators.required],
      ingredientList: this.fb.array([]),
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
  const ingredientsString = formValue.ingredients
    .map((ing: any) => `${ing.name} - ${ing.quantity}`)
    .join(', ');

  console.log(formValue);
  console.log(ingredientsString);
  console.log(formValue.recipeName);
  console.log(formValue.recipeCategory);

  //add in the add recipe method from the service

}
  newRecipe : Recipe = {
    recipeId: 0,
    recipeName: '',
    recipeCategory: '',
    ingredientList: '',
    isOnList: false,
    userID: 0
  }
  
  currentIngredients: Ingredient[] =[]


}
