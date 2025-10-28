import { Component, OnInit, AfterViewInit, ViewChild, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { NgChartsModule } from 'ng2-charts';
import { DecimalPipe, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeEditDialog } from '../employee-edit-dialog/employee-edit-dialog';
import { EmployeeViewDialog } from '../employee-view-dialog/employee-view-dialog';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.scss'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    NgChartsModule,
    DecimalPipe,
    NgIf
  ],
  providers: [DecimalPipe]
})
export class EmployeeList implements OnInit, AfterViewInit {
  private employeeService = inject(EmployeeService);
  private authService = inject(AuthService);
  isAdminUser = false;

  displayedColumns: string[] = [
    'employeeId', 'name', 'email', 'department', 'designation', 'salary', 'actions',
  ];
  dataSource = new MatTableDataSource<Employee>([]);
  filterValue = '';
  chartData: any = {
    labels: [],
    datasets: [
      {
        label: 'Average Salary by Designation',
        data: [],
        backgroundColor: ['#2e8b57', '#1e90ff', '#3cb371', '#4682b4'],
      },
    ],
  };
  chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Salary Variation Across Designations' },
    },
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    // Fetch employees based on role via service
    this.isAdminUser = this.authService.isAdmin();
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.dataSource.data = employees;
        this.updateChart(employees);
      },
      error: (error) => {
        console.error('Error fetching employees:', error);
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

 applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  this.loadEmployees(filterValue);  
}


  updateChart(employees: Employee[]) {
    const salaryMap: Record<string, number[]> = {};
    employees.forEach(emp => {
      const designation = emp.designation ?? 'Unknown';
      const salary = emp.salary ?? 0;
      if (!salaryMap[designation]) salaryMap[designation] = [];
      salaryMap[designation].push(salary);
    });
    const labels = Object.keys(salaryMap);
    const avgSalary = labels.map(
      desig => salaryMap[desig].reduce((a, b) => a + b, 0) / salaryMap[desig].length
    );
    this.chartData = {
      labels,
      datasets: [
        {
          label: 'Average Salary',
          data: avgSalary,
          backgroundColor: ['#2e8b57', '#1e90ff', '#3cb371', '#4682b4'],
        },
      ],
    };
  }

  private dialog = inject(MatDialog);
  editEmployee(emp: Employee) {
    const dialogRef = this.dialog.open(EmployeeEditDialog, {
      width: '400px',
      data: emp,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.updateEmployee(result).subscribe({
          next: () => {
            alert('Employee updated successfully');
            this.loadEmployees();
          },
          error: (err) => alert('Failed to update employee: ' + err.message),
        });
      }
    });
  }
  
deleteEmployee(emp: Employee) {
  if (!emp.employeeId) {
    alert('Employee ID is missing!');
    return;
  }

  if (confirm(`Are you sure you want to delete ${emp.firstName} ${emp.lastName}?`)) {
    this.employeeService.deleteEmployee(emp.employeeId).subscribe({
      next: () => {
        alert('Employee deleted successfully');
        this.loadEmployees();
      },
      error: (err) => alert('Failed to delete employee: ' + err.message),
    });
  }
}

  sortAscending() {
    this.dataSource.data = [...this.dataSource.data].sort((a, b) =>
      (a.firstName ?? '').localeCompare(b.firstName ?? '')
    );
  }

  sortDescending() {
    this.dataSource.data = [...this.dataSource.data].sort((a, b) =>
      (b.firstName ?? '').localeCompare(a.firstName ?? '')
    );
  }
  viewEmployee(emp: Employee) {
    this.dialog.open(EmployeeViewDialog, {
      width: '400px',
      data: emp
    });
  }
   loadEmployees(query: string = '') {
  this.employeeService.searchEmployees(query).subscribe({
    next: (employees) => {
      this.dataSource.data = employees;
      this.updateChart(employees);
    },
    error: (error) => {
      console.error('Error fetching employees:', error);
    }
  });
}

}
