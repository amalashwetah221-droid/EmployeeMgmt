package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.backend.dto.EmployeeRequestDTO;
import com.example.backend.model.Employee;
import com.example.backend.service.EmployeeService;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<List<Employee>> list(@RequestParam(value = "q", required = false) String q) {
        List<Employee> results = employeeService.searchEmployees(q);
        return ResponseEntity.ok(results);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    @GetMapping("/{id}")
    public ResponseEntity<Employee> get(@PathVariable int id,  Authentication authentication) {
        return employeeService.getEmployeeIfAuthorized(id, authentication)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(403).build());
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/sort")
    public List<Employee> sortEmployees(@RequestParam(defaultValue = "asc") String order) {
        return employeeService.getEmployeesSorted(order);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<?> addEmployee(@RequestBody EmployeeRequestDTO dto) {
    Employee employee = new Employee();
    employee.setFirstName(dto.getFirstName());
    employee.setLastName(dto.getLastName());
    employee.setEmail(dto.getEmail());
    employee.setPhone(dto.getPhone());
    employee.setDepartment(dto.getDepartment());
    employee.setDesignation(dto.getDesignation());
    employee.setSalary(dto.getSalary());
    employee.setDateOfJoining(dto.getDateOfJoining());
    employee.setStatus(dto.isStatus());

    Employee created = employeeService.addEmployee(employee, dto.getUserId(), dto.getManagerId());
    return ResponseEntity.ok(created);
}


    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
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

    @GetMapping("/subordinates")
    public ResponseEntity<?> getSubordinates(Authentication auth) {
        try {
            List<Employee> subordinates = employeeService.getSubordinates(auth);
            if (subordinates.isEmpty()) {
                return ResponseEntity.ok("No subordinates found for this manager.");
            }
            return ResponseEntity.ok(subordinates);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body("Access denied: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}
