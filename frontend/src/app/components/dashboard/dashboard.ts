import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { EmployeeService } from '../../services/employee';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard {
  private empService = inject(EmployeeService);

  salaryData: { name: string; value: number}[] = [];
  deptData: { name: string; value: number }[] = [];
  joinedYearData: { name: string; value: number }[] = [];
  statusData: { name: string; value: number }[] = [];
  isHidden = false;
  view: [number, number] = [700, 400];
  colorScheme = {
    domain: ['#2e8b57', '#1e90ff', '#3cb371', '#4682b4'],
    name: '',
    selectable: false,
    group: ScaleType.Time
  };

    ngOnInit() {
    this.loadSalaryData();
    this.loadDeptData();
    this.loadJoinedYearData();
    this.loadStatusData();
  }

  private loadSalaryData() {
    this.empService.getSalaryByDesignation()
      .pipe(catchError(err => {
        if (err.status === 403) {
          this.salaryData = [{ name: 'This data is hidden', value: 0 }];
        }
        return of([]);
      }))
      .subscribe(data => { if (data.length) this.salaryData = data; });
  }

  private loadDeptData() {
    this.empService.getEmployeesByDepartment()
      .pipe(catchError(() => of([])))
      .subscribe(data => this.deptData = data);
  }

  private loadJoinedYearData() {
    this.empService.getEmployeesJoinedPerYear()
      .pipe(catchError(() => of([])))
      .subscribe(data => this.joinedYearData = data);
  }

  private loadStatusData() {
    this.empService.getEmployeesActiveStatus()
      .pipe(catchError(err => {
        if (err.status === 403) {
          this.statusData = [{ name: 'This data is hidden', value: 1}];
        }
        return of([]);
      }))
      .subscribe(data => this.statusData = data);
  }
}

