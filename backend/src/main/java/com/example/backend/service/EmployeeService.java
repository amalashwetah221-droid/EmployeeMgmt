package com.example.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.example.backend.model.Employee;
import com.example.backend.repository.EmployeeRepository;
import com.example.backend.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Optional<Employee> getEmployeeById(int id) {
        return employeeRepository.findById(id);
    }

    public Optional<Employee> getEmployeeIfAuthorized(int id, Authentication auth) {
        return employeeRepository.findById(id)
                .filter(emp -> isAuthorized(auth, emp));
    }

    public Employee addEmployee(Employee employee) {
    // when user is provided, auto populate entity from DB
    if (employee.getUser() != null && employee.getUser().getUserId() != 0) {
        int userId = employee.getUser().getUserId();
        userRepository.findById(userId).ifPresent(employee::setUser);
    }

    employee.setStatus(true);
    return employeeRepository.saveAndFlush(employee);
}


    public Employee updateEmployeeIfAuthorized(int id, Employee updatedEmployee, Authentication auth) {
        return employeeRepository.findById(id)
                .map(existing -> {
                     if (!isAuthorized(auth, existing)) {
                        throw new SecurityException("Not allowed to update this employee");
                    }
                    existing.setFirstName(updatedEmployee.getFirstName());
                    existing.setLastName(updatedEmployee.getLastName());
                    existing.setEmail(updatedEmployee.getEmail());
                    existing.setPhone(updatedEmployee.getPhone());
                    existing.setDepartment(updatedEmployee.getDepartment());
                    existing.setDesignation(updatedEmployee.getDesignation());
                    existing.setSalary(updatedEmployee.getSalary());
                    existing.setDateOfJoining(updatedEmployee.getDateOfJoining());
                    existing.setManagerName(updatedEmployee.getManagerName());
                    existing.setStatus(updatedEmployee.getStatus());
                    return employeeRepository.saveAndFlush(existing);
                })
                .orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    public void deleteEmployee(int id) {
        employeeRepository.deleteById(id);
    }

   public List<Employee> searchEmployees(String keyword) {
    if (keyword == null || keyword.isEmpty()) {
        return employeeRepository.findAll();
    }
    return employeeRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrDepartmentContainingIgnoreCaseOrDesignationContainingIgnoreCase(
            keyword, keyword, keyword, keyword
    );
}

    public List<Employee> getEmployeesSorted(String order) {
        if (order != null && order.equalsIgnoreCase("desc")) {
            return employeeRepository.findAllByOrderByFirstNameDesc();
        } else {
            return employeeRepository.findAllByOrderByFirstNameAsc();
        }
    }
    
    private boolean isAuthorized(Authentication auth, Employee emp) {
        if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return true;
        }
        if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_USER"))) {
            return emp.getUser() != null && emp.getUser().getUsername().equals(auth.getName());
        }
        return false;
    }

}
