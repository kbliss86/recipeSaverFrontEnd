import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../recipe-saver-recipes.model';
import { FormGroup, FormBuilder, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { RecipeSaverService } from '../../services/recipe-saver.service';

@Component({
  selector: 'app-recipe-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recipe-edit.component.html',
  styleUrl: './recipe-edit.component.css'
})
export class RecipeEditComponent implements OnInit {
  //current user ID
  currentUserId : number;
  userRecipes: Recipe[] = [];// Pull directly from the recipe table by user ID
  editRecipeForm!: FormGroup;

  constructor(private fb: FormBuilder, private recipeService : RecipeSaverService) {
    const storedUserId = sessionStorage.getItem('userId');
    this.currentUserId = storedUserId && !isNaN(Number(storedUserId)) ? parseInt(storedUserId, 10) : 0;
  }

  async ngOnInit() {
    this.editRecipeForm = this.fb.group({
      selectedRecipe: [''],
      recipeId: ['', Validators.required],
      title: ['', Validators.required],
      category: ['', Validators.required],
      ingredientList: this.fb.array([]),
    });

  //fethcing the user's recipes - for dropdown
    this.userRecipes = await this.recipeService.getAllRecipesByUserId(this.currentUserId);
  }

  //helper getter for easier access in the tamplate - this is so we dont have to retype this.recipeForm.get('ingredientList') as FormArray; in the template
  get ingredientList() {
    return this.editRecipeForm.get('ingredientList') as FormArray;
  }

  //add ingredient to the form
  addIngredient(): void {
    const ingredientGroup = this.fb.group({
      name: ['', Validators.required],
      quantity: ['', Validators.required],
    });
    this.ingredientList.push(ingredientGroup);
  }
  //remove ingredient from the form
  removeIngredient(index: number): void {
    this.ingredientList.removeAt(index);
  }

  //on recipe select populate the form with the recipe details
  async onRecipeSelected(){
    const selectedId = this.editRecipeForm.get('selectedRecipe')?.value;
    const selectedRecipe = this.userRecipes.find(recipe => recipe.recipeId == selectedId);
    if (selectedRecipe) {
      this.editRecipeForm.patchValue({
        recipeId: selectedRecipe.recipeId,
        title: selectedRecipe.recipeName,
        category: selectedRecipe.recipeCategory,
      });
      //split ingredients by comma
      const byComma = selectedRecipe.ingredientList.split(',');
      //split ingredients by dash
      for ( let part of byComma) {
        const byDash = part.split('-');
        const ingredientGroup = this.fb.group({
          name: (byDash[0] || '').trim(),
          quantity: (byDash[1] || '').trim(),
        });
        this.ingredientList.push(ingredientGroup);
      }
    }

  }

  //onsubmit update the recipe
  onSubmit(): void {
    const formValue = this.editRecipeForm.value;
    const ingredientsString = formValue.ingredientList
      .map((ing: any) => `${ing.name} - ${ing.quantity}`)
      .join(', ');

    const updatedRecipe : Recipe = {
      recipeId: formValue.recipeId,
      recipeName: formValue.title, 
      recipeCategory: formValue.category,
      ingredientList: ingredientsString,
      isOnList: false,
      userID: this.currentUserId
    }
  this.recipeService.updateRecipe(updatedRecipe);
  }

  deleteRecipe(): void {
    const formValue = this.editRecipeForm.value;
    const deletedRecipe : Recipe = {
      recipeId: formValue.recipeId,
      recipeName: formValue.title, 
      recipeCategory: formValue.category,
      ingredientList: '',
      isOnList: false,
      userID: this.currentUserId
    }
    this.recipeService.deleteRecipe(deletedRecipe);
  }

}
