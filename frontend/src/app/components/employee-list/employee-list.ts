import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Employee } from '../../models/employee.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { NgChartsModule } from 'ng2-charts';
import { DecimalPipe } from '@angular/common';

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
     DecimalPipe 
  ],
  providers: [DecimalPipe]
})
export class EmployeeList implements OnInit, AfterViewInit {
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
    const employees: Employee[] = [
      { employeeId: 1, firstName: 'Amit', lastName: 'Patel', email: 'amit@mail.com', department: 'IT', designation: 'Developer', salary: 85000, dateOfJoining: '2023-06-12' },
      { employeeId: 2, firstName: 'Neha', lastName: 'Singh', email: 'neha@mail.com', department: 'HR', designation: 'Manager', salary: 120000, dateOfJoining: '2022-03-18' },
      { employeeId: 3, firstName: 'Rahul', lastName: 'Kumar', email: 'rahul@mail.com', department: 'Finance', designation: 'Analyst', salary: 95000, dateOfJoining: '2024-01-10' },
      { employeeId: 4, firstName: 'Sara', lastName: 'Fernandez', email: 'sara@mail.com', department: 'IT', designation: 'Tester', salary: 70000, dateOfJoining: '2023-09-05' },
    ];
    this.dataSource.data = employees;
    this.updateChart(employees);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
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

  viewEmployee(emp: Employee) {
    alert(`Viewing ${emp.firstName} ${emp.lastName}`);
  }
  editEmployee(emp: Employee) {
    alert(`Editing ${emp.firstName} ${emp.lastName}`);
  }
  deleteEmployee(emp: Employee) {
    alert(`Deleting ${emp.firstName} ${emp.lastName}`);
  }
}
