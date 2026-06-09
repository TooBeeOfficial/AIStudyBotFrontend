import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionBuilderDialogComponent } from './create-new-question';

describe('CreateNewQuestion', () => {
  let component: QuestionBuilderDialogComponent;
  let fixture: ComponentFixture<QuestionBuilderDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionBuilderDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionBuilderDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
