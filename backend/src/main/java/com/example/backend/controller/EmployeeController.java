package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.backend.dto.EmployeeRequestDTO;
import com.example.backend.model.Employee;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.EmployeeRepository;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.EmployeeService;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<List<Employee>> list(@RequestParam(value = "q", required = false) String q) {
        List<Employee> results = employeeService.searchEmployees(q);
        return ResponseEntity.ok(results);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER', 'ROLE_MANAGER')")
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

     // Assign role based on designation
        if (dto.getUserId() != null) {
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            String roleName = getRoleForDesignation(dto.getDesignation());
            Role role = roleRepository.findByRoleName(roleName);
            user.setRole(role);
            userRepository.save(user);
        }

    return ResponseEntity.ok(created);
}


    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER','ROLE_MANAGER')")
    @PutMapping("/{id}")
    public ResponseEntity<Employee> update(@PathVariable int id, @RequestBody Employee employee, Authentication authentication) {
        try {
            Employee updated = employeeService.updateEmployeeIfAuthorized(id, employee,authentication);
              if (updated.getUser() != null && employee.getDesignation() != null) {
            String designation = employee.getDesignation().toUpperCase();
            String roleName;

            switch (designation) {
                case "ADMIN":
                    roleName = "ROLE_ADMIN";
                    break;
                case "MANAGER":
                    roleName = "ROLE_MANAGER";
                    break;
                default:
                    roleName = "ROLE_USER";
            }

            Role role = roleRepository.findByRoleName(roleName);
            if (role != null) {
                User user = updated.getUser();
                user.setRole(role);
                userRepository.save(user); 
            }
        }

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

     private String getRoleForDesignation(String designation) {
        if (designation == null) return "ROLE_USER"; // default role
        switch (designation.toLowerCase()) {
            case "admin": return "ROLE_ADMIN";
            case "manager": return "ROLE_MANAGER";
            default: return "ROLE_USER";
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/salary-by-designation")
    public ResponseEntity<List<Map<String, Object>>> getSalaryByDesignation() {
        List<Map<String, Object>> results = employeeService.getSalaryByDesignation();
        return ResponseEntity.ok(results);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER', 'ROLE_MANAGER')")
    @GetMapping("/employees-by-department")
    public List<Map<String, Object>> getEmployeesByDepartment() {
    return employeeRepository.findAll()
        .stream()
        .collect(Collectors.groupingBy(Employee::getDepartment, Collectors.counting()))
        .entrySet()
        .stream()
        .map(e -> {
            Map<String, Object> map = new HashMap<>();
            map.put("name", e.getKey());
            map.put("value", e.getValue());
            return map;
        })
        .collect(Collectors.toList());
}

@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER', 'ROLE_MANAGER')")
@GetMapping("/employees-joined-per-year")
public List<Map<String, Object>> getEmployeesJoinedPerYear() {
    return employeeRepository.findAll()
        .stream()
        .collect(Collectors.groupingBy(e -> e.getDateOfJoining().getYear(), Collectors.counting()))
        .entrySet()
        .stream()
        .map(e -> {
            Map<String, Object> map = new HashMap<>();
            map.put("name", String.valueOf(e.getKey())); // year as string
            map.put("value", e.getValue());
            return map;
        })
        .collect(Collectors.toList());
}

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/employees-active-status")
    public List<Map<String, Object>> getEmployeesActiveStatus() {
    return employeeRepository.findAll()
        .stream()
        .collect(Collectors.groupingBy(e -> e.getStatus() ? "Active" : "Inactive", Collectors.counting()))
        .entrySet()
        .stream()
        .map(e -> {
            Map<String, Object> map = new HashMap<>();
            map.put("name", e.getKey());
            map.put("value", e.getValue());
            return map;
        })
        .collect(Collectors.toList());
}


}
