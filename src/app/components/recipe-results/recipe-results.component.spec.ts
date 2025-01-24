import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeResultsComponent } from './recipe-results.component';

describe('RecipeResultsComponent', () => {
  let component: RecipeResultsComponent;
  let fixture: ComponentFixture<RecipeResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
