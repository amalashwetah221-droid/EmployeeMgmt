 import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../services/employee';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Employee } from '../../models/employee.model';


@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  templateUrl: './employee-form.html',
  styleUrls: ['./employee-form.scss'],
})
export class EmployeeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private empService = inject(EmployeeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);


  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    department: [''],
    designation: [''],
    salary: [0],
    dateOfJoining: [''],
    status: [true],
    managerId: [''],
    userId: ['']
  });


  editMode = false;
  id?: number;


  ngOnInit() {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.editMode = true;
      this.id = +paramId;


      this.empService.getEmployee(this.id).subscribe((emp: Employee) => {
        if (emp) {
          // Ensure backward compatibility with older nested models
          const patchedEmp = {
            ...emp,
            managerId: (emp as any).manager?.employeeId || emp.managerId || '',
            userId: (emp as any).user?.userId || emp.userId || ''
          };
          this.form.patchValue(patchedEmp);
        }
      });
    }
  }


  submit() {
    if (this.form.invalid) return;


    const payload: Employee = {
      ...this.form.value,
      employeeId: this.editMode ? this.id : undefined
    } as Employee;


    if (this.editMode) {
      this.empService.updateEmployee(payload).subscribe(() => {
        this.router.navigate(['/employees']);
      });
    } else {
      this.empService.addEmployee(payload).subscribe(() => {
        this.router.navigate(['/employees']);
      });
    }
  }
}