import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeAddNewComponent } from './recipe-add-new.component';

describe('RecipeAddNewComponent', () => {
  let component: RecipeAddNewComponent;
  let fixture: ComponentFixture<RecipeAddNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeAddNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeAddNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
