import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Employee } from '../models/employee.model';


const MOCK: Employee[] = [
{ employeeId: 1, firstName: 'Raj', lastName: 'Kumar', designation: 'Manager', department: 'Sales', salary: 150000, dateOfJoining: '2019-01-10', status: true },
{ employeeId: 2, firstName: 'Anita', lastName: 'Singh', designation: 'Developer', department: 'IT', salary: 120000, dateOfJoining: '2020-06-15', status: true, manager: { employeeId: 1 } },
{ employeeId: 3, firstName: 'Rohan', lastName: 'Patel', designation: 'Tester', department: 'QA', salary: 90000, dateOfJoining: '2021-03-20', status: true, manager: { employeeId: 1 } },
{ employeeId: 4, firstName: 'Meera', lastName: 'Shah', designation: 'Developer', department: 'IT', salary: 110000, dateOfJoining: '2022-11-01', status: true, manager: { employeeId: 1 } }
];


@Injectable({ providedIn: 'root' })
export class EmployeeMock {
private data = [...MOCK];


list(): Observable<Employee[]> { return of(this.data); }
get(id: number): Observable<Employee | undefined> { return of(this.data.find(d => d.employeeId === id)); }
add(emp: Employee): Observable<Employee> {
const next = Math.max(0, ...this.data.map(d => d.employeeId || 0)) + 1;
emp.employeeId = next; this.data.push(emp); return of(emp);
}
update(id: number, emp: Employee): Observable<Employee | undefined> {
const idx = this.data.findIndex(d => d.employeeId === id);
if (idx >= 0) { this.data[idx] = { ...this.data[idx], ...emp }; return of(this.data[idx]); }
return of(undefined);
}
delete(id: number): Observable<void> { this.data = this.data.filter(d => d.employeeId !== id); return of(void 0); }
}