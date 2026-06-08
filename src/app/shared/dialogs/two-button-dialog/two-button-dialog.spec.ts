import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoButtonDialog } from './two-button-dialog';

describe('TwoButtonDialog', () => {
  let component: TwoButtonDialog;
  let fixture: ComponentFixture<TwoButtonDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwoButtonDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(TwoButtonDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
