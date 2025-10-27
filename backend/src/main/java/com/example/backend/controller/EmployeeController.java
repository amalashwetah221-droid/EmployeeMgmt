package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.backend.model.Employee;
import com.example.backend.service.EmployeeService;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    // @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<List<Employee>> list(@RequestParam(value = "q", required = false) String q) {
        List<Employee> results = employeeService.searchEmployees(q);
        return ResponseEntity.ok(results);
    }

    // @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    @GetMapping("/{id}")
    public ResponseEntity<Employee> get(@PathVariable int id,  Authentication authentication) {
        return employeeService.getEmployeeIfAuthorized(id, authentication)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(403).build());
    }

    // @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/sort")
    public List<Employee> sortEmployees(@RequestParam(defaultValue = "asc") String order) {
        return employeeService.getEmployeesSorted(order);
    }

    // @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<Employee> create(@RequestBody Employee employee) {
        Employee created = employeeService.addEmployee(employee);
        return ResponseEntity.ok(created);
    }

    // @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    @PutMapping("/{id}")
    public ResponseEntity<Employee> update(@PathVariable int id, @RequestBody Employee employee, Authentication authentication) {
        try {
            Employee updated = employeeService.updateEmployeeIfAuthorized(id, employee,authentication);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }
}
