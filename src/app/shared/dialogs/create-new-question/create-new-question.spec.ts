import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewQuestion } from './create-new-question';

describe('CreateNewQuestion', () => {
  let component: CreateNewQuestion;
  let fixture: ComponentFixture<CreateNewQuestion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewQuestion],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateNewQuestion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
