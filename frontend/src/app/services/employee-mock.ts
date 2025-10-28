import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Employee } from '../models/employee.model';


const MOCK: Employee[] = [
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