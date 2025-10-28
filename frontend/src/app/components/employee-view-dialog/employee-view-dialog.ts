import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-view-dialog',
  standalone: true,
  imports: [MatDialogModule, CommonModule],
  template: `
    <h1 mat-dialog-title>Employee Details</h1>
    <div mat-dialog-content>
      <p><strong>First Name:</strong> {{data.firstName}}</p>
      <p><strong>Last Name:</strong> {{data.lastName}}</p>
      <p><strong>Email:</strong> {{data.email}}</p>
      <p><strong>Phone:</strong> {{data.phone}}</p>
      <p><strong>Department:</strong> {{data.department}}</p>
      <p><strong>Designation:</strong> {{data.designation}}</p>
      <p><strong>Salary:</strong> ₹{{data.salary | number}}</p>
      <p><strong>Date of Joining:</strong> {{data.dateOfJoining | date}}</p>
      <p><strong>Status:</strong> {{data.status ? 'Active' : 'Inactive'}}</p>
      <p><strong>Manager:</strong> {{ data.manager ? (data.manager.firstName + ' ' + data.manager.lastName) : 'N/A' }}</p>
      <p><strong>User ID:</strong> {{data.user?.userId}}</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close>Close</button>
    </div>
  `
})
export class EmployeeViewDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Employee,
    public dialogRef: MatDialogRef<EmployeeViewDialog>
  ) {}
}
