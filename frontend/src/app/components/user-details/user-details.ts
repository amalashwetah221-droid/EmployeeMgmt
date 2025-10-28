import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { EmployeeService } from '../../services/employee';
import { catchError, of } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './user-details.html',
  styles: [`
    .user-details-container {
      padding: 20px;
      border: 1px solid #ccc;
      background: #fff;
      border-radius: 4px;
    }
  `],
})
export class UserDetailsComponent implements OnInit {
  private auth = inject(AuthService);
  private empService = inject(EmployeeService);

  userDetails: any;
  employee: any;
  
  ngOnInit() {
    this.userDetails = this.auth['decodeToken']?.() ?? {}; // Decode the JWT token

    const employeeId = this.userDetails?.employeeId;  // Retrieve the employeeId from JWT
    if (employeeId) {
      // Fetch the employee details using the employeeId
      this.empService.getEmployee(employeeId)
        .pipe(
          catchError(() => of(null))  // Handle any errors (e.g., 403 or not found)
        )
        .subscribe((emp: any) => {
          this.employee = emp;
        });
    }
  }
}
