import { Routes } from '@angular/router';
import { EmployeeList } from './components/employee-list/employee-list';
import { EmployeeFormComponent } from './components/employee-form/employee-form';
import { Dashboard } from './components/dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'employees', component: EmployeeList },
  { path: 'employees/new', component: EmployeeFormComponent },
  { path: 'employees/:id/edit', component: EmployeeFormComponent },
  { path: '**', redirectTo: 'dashboard' }
];
