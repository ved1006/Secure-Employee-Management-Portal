package com.employee.management.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import com.employee.management.Model.Department;
import com.employee.management.Repository.DepartmentRepository;
import com.employee.management.dto.DepartmentRequestDTO;
import com.employee.management.dto.DepartmentResponseDTO;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    public DepartmentServiceImpl(DepartmentRepository departmentRepository){
        this.departmentRepository = departmentRepository;
    }

    @Override   
    public List<DepartmentResponseDTO> getAllDepartments(){
        List<Department> list = departmentRepository.findAll();
        List<DepartmentResponseDTO> dto = new ArrayList<>();
        //every entity should have a individual separate dto

        for(Department department : list){
            DepartmentResponseDTO dto1 = new DepartmentResponseDTO();
            dto1.setDeptName(department.getDeptName());
            dto1.setDeptId(department.getDeptId());

            dto.add(dto1);
        }
        return dto;
    }

    @Override
    public DepartmentResponseDTO getDepartmentById(int deptId){
       Department department =  departmentRepository.findById(deptId).get();
       DepartmentResponseDTO dto = new DepartmentResponseDTO();

        dto.setDeptId(department.getDeptId());
        dto.setDeptName(department.getDeptName());

        return dto;

    }

    @Override
    public DepartmentResponseDTO addDepartment(DepartmentRequestDTO dto){
        Department department = new Department();
        department.setDeptName(dto.getDeptName());
        
        Department savedDepartment = departmentRepository.save(department);
        DepartmentResponseDTO retDto = new DepartmentResponseDTO();
        retDto.setDeptId(savedDepartment.getDeptId());
        retDto.setDeptName(savedDepartment.getDeptName());
        return retDto;
    }

    @Override
public DepartmentResponseDTO updateDepartment(int deptId, DepartmentRequestDTO dto) {

    System.out.println("Incoming DTO deptName = " + dto.getDeptName());

    Department department = departmentRepository
            .findById(deptId)
            .orElseThrow(() -> new RuntimeException("No id found"));

    System.out.println("Before update = " + department.getDeptName());

    department.setDeptName(dto.getDeptName());

    Department savedDepartment = departmentRepository.save(department);

    System.out.println("After save = " + savedDepartment.getDeptName());
    DepartmentResponseDTO retDto = new DepartmentResponseDTO();
retDto.setDeptId(savedDepartment.getDeptId());
retDto.setDeptName(savedDepartment.getDeptName());

return retDto;
}

    @Override
    public void deleteDepartment(int deptId){
        if(!departmentRepository.existsById(deptId)){
            throw new RuntimeException("Department not found");
        }
        departmentRepository.deleteById(deptId);
    }
}
