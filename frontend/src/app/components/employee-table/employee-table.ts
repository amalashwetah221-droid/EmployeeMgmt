import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface Employee {
  employeeId: number;
  firstName: string;
  lastName: string;
  designation: string;
  department: string;
  salary: number;
  dateOfJoining: string;
}

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.html',
  styleUrls: ['./employee-table.scss'],
   imports: [
    CommonModule,
    MatFormFieldModule,  
    MatInputModule,      
    MatButtonModule,
    MatTableModule,  
    MatSortModule,    
    MatPaginatorModule  
  ]
})
export class EmployeeTable implements OnInit {
  displayedColumns: string[] = ['firstName', 'designation', 'department', 'salary', 'dateOfJoining'];
  dataSource = new MatTableDataSource<Employee>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.dataSource.data = [
      { employeeId: 1, firstName: 'Amit', lastName: 'Sharma', designation: 'Manager', department: 'IT', salary: 150000, dateOfJoining: '2020-03-12' },
      { employeeId: 2, firstName: 'Neha', lastName: 'Singh', designation: 'Developer', department: 'IT', salary: 120000, dateOfJoining: '2021-01-15' },
      { employeeId: 3, firstName: 'Ravi', lastName: 'Patel', designation: 'Tester', department: 'QA', salary: 95000, dateOfJoining: '2022-07-10' }
    ];
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
