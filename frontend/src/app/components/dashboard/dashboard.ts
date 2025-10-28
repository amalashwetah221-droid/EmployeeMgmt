import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard {
  salaryData = [
    { name: 'Developer', value: 120000 },
    { name: 'Tester', value: 90000 },
    { name: 'Manager', value: 150000 },
    { name: 'HR', value: 80000 }
  ];
  view: [number, number] = [700, 400];
  colorScheme = {
    domain: ['#2e8b57', '#1e90ff', '#3cb371', '#4682b4'],
    name: '',
    selectable: false,
    group: ScaleType.Time
  };
}
