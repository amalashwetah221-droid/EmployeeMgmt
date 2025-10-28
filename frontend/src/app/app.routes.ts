import { Routes } from '@angular/router';
import { EmployeeList } from './components/employee-list/employee-list';
import { EmployeeFormComponent } from './components/employee-form/employee-form';
import { Dashboard } from './components/dashboard/dashboard';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { AuthGuard } from './guards/auth-guard-guard';
import { UserDetailsComponent } from './components/user-details/user-details';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },  // no canActivate here
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  { path: 'employees', component: EmployeeList, canActivate: [AuthGuard] },
  { path: 'employees/new', component: EmployeeFormComponent, canActivate: [AuthGuard] },
  { path: 'user-details', component: UserDetailsComponent, canActivate:[AuthGuard] },
  { path: 'employees/:id/edit', component: EmployeeFormComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'dashboard' }  // no canActivate
];
