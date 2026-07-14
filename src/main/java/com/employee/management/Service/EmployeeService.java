package com.employee.management.Service;

import java.util.List;

import com.employee.management.dto.EmployeeRequestDTO;
import com.employee.management.dto.EmployeeResponseDTO;
public interface EmployeeService {
    
    List<EmployeeResponseDTO> getAllEmployees();
    EmployeeResponseDTO getEmployeeById(int id);
    EmployeeResponseDTO AddEmployee(EmployeeRequestDTO dto);
    void DeleteEmployee(int id);
    EmployeeResponseDTO updateEmployeeById(int id,EmployeeRequestDTO dto);
}   
