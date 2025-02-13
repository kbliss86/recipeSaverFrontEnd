import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../recipe-saver-recipes.model';
import { FormGroup, FormBuilder, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { RecipeSaverService } from '../../services/recipe-saver.service';

@Component({
  selector: 'app-recipe-add-new',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recipe-add-new.component.html',
  styleUrl: './recipe-add-new.component.css'
})
export class RecipeAddNewComponent implements OnInit {

recipeForm!: FormGroup;
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

  const newRecipe : Recipe = {
    recipeId: 0,
    recipeName: formValue.title, 
    recipeCategory: formValue.category,
    ingredientList: ingredientsString,
    isOnList: false,
    userID: this.currentUserId
  }

  this.recipeService.addRecipe(newRecipe)

  }
}
