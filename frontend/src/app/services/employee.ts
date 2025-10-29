import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import { AuthService } from './auth';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private apiUrl = `${environment.apiBase}/employees`;
  private auth = inject(AuthService);
  constructor(private http: HttpClient) {}
  addEmployee(emp: Employee): Observable<Employee> { return this.http.post<Employee>(this.apiUrl, emp); }
  deleteEmployee(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }

  updateEmployee(emp: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${emp.employeeId}`, emp);
  }
  getEmployees(): Observable<Employee[]> {
    // decide endpoint based on role
    if (this.auth.isAdmin()) {
      // Admin gets all employees
      return this.http.get<Employee[]>(`${this.apiUrl}`);
    }

    if (this.auth.hasAnyRole(['ROLE_MANAGER'])) {
      // Manager gets subordinates only
      return this.http.get<Employee[]>(`${this.apiUrl}/subordinates`);
    }

    return new Observable(subscriber => {
      subscriber.next([]);
      subscriber.complete();
    });
  }
  getSalaryByDesignation(): Observable<{ name: string; value: number }[]> {
  return this.http.get<{ name: string; value: number }[]>(`${this.apiUrl}/salary-by-designation`);
}
  getEmployeesByDepartment(): Observable<{ name: string; value: number }[]> {
    return this.http.get<{ name: string; value: number }[]>(`${this.apiUrl}/employees-by-department`);
  }

  getEmployeesJoinedPerYear(): Observable<{ name: string; value: number }[]> {
    return this.http.get<{ name: string; value: number }[]>(`${this.apiUrl}/employees-joined-per-year`);
  }

  getEmployeesActiveStatus(): Observable<{ name: string; value: number }[]> {
    return this.http.get<{ name: string; value: number }[]>(`${this.apiUrl}/employees-active-status`);
  }

  getEmployee(employeeId: number): Observable<Employee> {
  return this.http.get<Employee>(`${this.apiUrl}/${employeeId}`);
}

  // method to search employees
  searchEmployees(query: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}?q=${query}`);
  }

}
