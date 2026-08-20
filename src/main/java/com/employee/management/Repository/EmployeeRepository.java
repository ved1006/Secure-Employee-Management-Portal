package com.employee.management.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.employee.management.Model.Employee;

public interface EmployeeRepository
        extends JpaRepository<Employee, Integer> {

    Optional<Employee> findByUser_Email(String email);
}