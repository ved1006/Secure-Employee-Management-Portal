package com.employee.management.Service;

import java.util.List;

import com.employee.management.dto.DepartmentRequestDTO;
import com.employee.management.dto.DepartmentResponseDTO;

public interface DepartmentService {
    List<DepartmentResponseDTO> getAllDepartments();
    DepartmentResponseDTO getDepartmentById(int deptId);
    DepartmentResponseDTO addDepartment(DepartmentRequestDTO dto);
    public DepartmentResponseDTO updateDepartment(int deptId,DepartmentRequestDTO dto);
    void deleteDepartment(int deptId);

}
