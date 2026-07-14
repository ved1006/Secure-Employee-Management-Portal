package com.employee.management.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.employee.management.Model.Department;

public interface DepartmentRepository extends JpaRepository<Department,Integer> {
    
}
