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
import com.employee.management.Service.EmployeeService;
import com.employee.management.dto.EmployeeRequestDTO;
import com.employee.management.dto.EmployeeResponseDTO;

@RestController
@RequestMapping("/employees")
public class EmployeeController {
    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public List<EmployeeResponseDTO> getAll() {
        return employeeService.getAllEmployees();
    }

    @GetMapping("/{id}")
    public EmployeeResponseDTO getEmpById(@PathVariable int id) {
        return employeeService.getEmployeeById(id);
    }

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    public EmployeeResponseDTO AddEmployee(@RequestBody EmployeeRequestDTO dto) {
        return employeeService.AddEmployee(dto);
    }

    @DeleteMapping("/{id}")
    public void DeleteEmp(@PathVariable int id) {
        employeeService.DeleteEmployee(id);
    }

    @PutMapping("/{id}")
    public EmployeeResponseDTO UpdateEmpById(@PathVariable int id, @RequestBody EmployeeRequestDTO dto) {
        return employeeService.updateEmployeeById(id, dto);
    }
}
