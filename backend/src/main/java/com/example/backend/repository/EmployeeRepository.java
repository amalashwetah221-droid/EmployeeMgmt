package com.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.backend.model.Employee;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    // To search by filters i.e the name, dept, designation, dept
    // @Query("SELECT e FROM Employee e WHERE " +
    //        "LOWER(e.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
    //        "LOWER(e.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
    //        "LOWER(e.department) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
    //        "LOWER(e.designation) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    // List<Employee> searchEmployees(String keyword);

    List<Employee> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrDepartmentContainingIgnoreCaseOrDesignationContainingIgnoreCase(
            String firstName, String lastName, String department, String designation
    );
    List<Employee> findAllByOrderByFirstNameAsc();
    List<Employee> findAllByOrderByFirstNameDesc();
    List<Employee> findByManager(Employee manager);
    Optional<Employee> findByUserUsername(String username);

}