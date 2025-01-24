import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeSearchComponent } from './recipe-search.component';

describe('RecipeSearchComponent', () => {
  let component: RecipeSearchComponent;
  let fixture: ComponentFixture<RecipeSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
