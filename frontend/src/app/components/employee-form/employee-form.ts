import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../services/employee';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
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
  });
  editMode = false;
  id?: number;

  ngOnInit() {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.editMode = true;
      this.id = +paramId;
      this.empService.getEmployee(this.id).subscribe(emp => {
        if (emp) this.form.patchValue(emp);
      });
    }
  }

  submit() {
  if (this.form.invalid) return;
  const rawPayload = this.form.value;

  // Cast to Record<string, any> for safe indexing
  const payload: Record<string, any> = {};
  const raw = rawPayload as Record<string, any>;

  Object.keys(raw).forEach(key => {
    payload[key] = raw[key] === null ? undefined : raw[key];
  });

  if (this.editMode && this.id) {
    this.empService.updateEmployee(this.id, payload).subscribe(() => this.router.navigate(['/employees']));
  } else {
    this.empService.addEmployee(payload).subscribe(() => this.router.navigate(['/employees']));
  }
}


}
