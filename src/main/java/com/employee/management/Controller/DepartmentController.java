package com.employee.management.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import com.employee.management.Service.DepartmentService;
import com.employee.management.dto.DepartmentRequestDTO;
import com.employee.management.dto.DepartmentResponseDTO;

@RestController
@RequestMapping("/departments")
public class DepartmentController {
    
    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService){
        this.departmentService = departmentService;
    }

    @GetMapping
    public List<DepartmentResponseDTO> getAllDepartments(){
        return departmentService.getAllDepartments();
    }

    @GetMapping("/{deptId}")
    public DepartmentResponseDTO getDepartmentById(@PathVariable int deptId){
        return departmentService.getDepartmentById(deptId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DepartmentResponseDTO addDepartment(@RequestBody DepartmentRequestDTO department){
        return departmentService.addDepartment(department);
    }

    @PutMapping("/{deptId}")
    public DepartmentResponseDTO updateDepartment(@PathVariable int deptId, @RequestBody DepartmentRequestDTO department){
        return departmentService.updateDepartment(deptId, department);
    }

    @DeleteMapping("/{deptId}")
    public void deleteDepartment(@PathVariable int deptId){
        departmentService.deleteDepartment(deptId);
    }
}
