import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextForm } from './text-form';

describe('TextForm', () => {
  let component: TextForm;
  let fixture: ComponentFixture<TextForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextForm],
    }).compileComponents();

    fixture = TestBed.createComponent(TextForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
