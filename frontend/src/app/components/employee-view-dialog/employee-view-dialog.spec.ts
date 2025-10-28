import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeViewDialog } from './employee-view-dialog';

describe('EmployeeViewDialog', () => {
  let component: EmployeeViewDialog;
  let fixture: ComponentFixture<EmployeeViewDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeViewDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeViewDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
