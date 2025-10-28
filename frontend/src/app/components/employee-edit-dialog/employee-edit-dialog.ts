import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee } from '../../models/employee.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-employee-edit-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './employee-edit-dialog.html',
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 12px;
    }

    form {
      display: flex;
      flex-direction: column;
    }

    ::ng-deep .mat-mdc-dialog-container .mdc-dialog__surface {
      max-height: 90vh;
      overflow-y: auto;
    }
  `]
})
export class EmployeeEditDialog {
  form: FormGroup;
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<EmployeeEditDialog>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: Employee) {
    this.form = this.fb.group({
      firstName: [data.firstName || '', Validators.required],
      lastName: [data.lastName || '', Validators.required],
      email: [data.email || '', [Validators.required, Validators.email]],
      phone: [data.phone || ''],
      department: [data.department || ''],
      designation: [data.designation || ''],
      salary: [data.salary || 0],
      dateOfJoining: [data.dateOfJoining || ''],
      status: [data.status ?? true],
      managerId: [data.managerId || ''],
      userId: [data.userId || '']
    });
  }

  onSave() {
    if (this.form.valid) {
      this.dialogRef.close({ ...this.data, ...this.form.value });
    }
  }
}
