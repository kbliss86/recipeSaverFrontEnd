import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeManipulationComponent } from './recipe-manipulation.component';

describe('RecipeManipulationComponent', () => {
  let component: RecipeManipulationComponent;
  let fixture: ComponentFixture<RecipeManipulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeManipulationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeManipulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
