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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/employees")
public class EmployeeController {
    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public List<EmployeeResponseDTO> getAll() {
        return employeeService.getAllEmployees();
    }
    @GetMapping("/me")
    @PreAuthorize("hasRole('EMPLOYEE')")
        public EmployeeResponseDTO getMyEmployee(
            Authentication authentication) {

                String email = authentication.getName();

            return employeeService.getMyEmployee(email);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")  
    public EmployeeResponseDTO getEmpById(@PathVariable int id) {
         System.out.println("GET EMPLOYEE BY ID CONTROLLER REACHED");

        return employeeService.getEmployeeById(id);
    }

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public EmployeeResponseDTO AddEmployee(@RequestBody EmployeeRequestDTO dto) {
        return employeeService.AddEmployee(dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void DeleteEmp(@PathVariable int id) {
        employeeService.DeleteEmployee(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public EmployeeResponseDTO UpdateEmpById(@PathVariable int id, @RequestBody EmployeeRequestDTO dto) {
        return employeeService.updateEmployeeById(id, dto);
    }
}
