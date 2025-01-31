import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeAddNewComponent } from '../recipe-add-new/recipe-add-new.component';
import { RecipeEditComponent } from '../recipe-edit/recipe-edit.component';

@Component({
  selector: 'app-recipe-manipulation',
  standalone: true,
  imports: [RecipeAddNewComponent, RecipeEditComponent, CommonModule],
  templateUrl: './recipe-manipulation.component.html',
  styleUrl: './recipe-manipulation.component.css'
})
export class RecipeManipulationComponent {
//variable for the logic for Add/Edit Recipe components to show
  showCard: string = '';
//method for button click "Add New Recipe" - Not Needed
  addNewRecipe(){
    this.showCard = 'add';
    console.log("Add New Recipe Button Clicked")
  }

  //method for button click "Edit Recipe" - Not Needed
  editRecipe(){
    this.showCard = 'edit';
    console.log("Edit Recipe Button Clicked")
  }

}
