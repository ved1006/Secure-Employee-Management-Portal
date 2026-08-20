package com.employee.management.Service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

import com.employee.management.Model.Department;
import com.employee.management.Model.Employee;
import com.employee.management.Repository.DepartmentRepository;
import com.employee.management.Repository.EmployeeRepository;
import com.employee.management.dto.EmployeeRequestDTO;
import com.employee.management.dto.EmployeeResponseDTO;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import com.employee.management.Model.Role;
import com.employee.management.Model.User;
import com.employee.management.Repository.UserRepository;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    public EmployeeServiceImpl(
        EmployeeRepository employeeRepository,
        DepartmentRepository departmentRepository,
        UserRepository userRepository,
        PasswordEncoder passwordEncoder) {

    this.employeeRepository = employeeRepository;
    this.departmentRepository = departmentRepository;
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
}
@Override
    public List<EmployeeResponseDTO> getAllEmployees(){
        List<Employee> dbemployees= employeeRepository.findAll();
        List<EmployeeResponseDTO> responseList = new ArrayList<>();
        for(Employee employee : dbemployees){
            
            //create one dto for each employee
            EmployeeResponseDTO dto = new EmployeeResponseDTO();

            dto.setId(employee.getId());
            dto.setName(employee.getName());
            dto.setSalary(employee.getSalary());
            dto.setDepartmentName(employee.getDepartment().getDeptName());

            responseList.add(dto);
        }
        return responseList;
    }

@Override
    public EmployeeResponseDTO getEmployeeById(int id){
        Employee employee = employeeRepository.findById(id).orElseThrow(() -> new RuntimeException("Employee not found"));
        
        EmployeeResponseDTO dto = new EmployeeResponseDTO();
            dto.setId(employee.getId());
            dto.setName(employee.getName());
            dto.setSalary(employee.getSalary());
            dto.setDepartmentName(employee.getDepartment().getDeptName());
        
            return dto;
    }

@Override
@Transactional
public EmployeeResponseDTO AddEmployee(EmployeeRequestDTO dto) {

    // Check email
    if (userRepository.existsByEmail(dto.getEmail())) {
        throw new RuntimeException("Email already exists");
    }

    // Find department
    Department department = departmentRepository
            .findById(dto.getDepartmentId())
            .orElseThrow(() ->
                    new RuntimeException("Department not found"));

    // Create User account
    User user = new User();

    user.setUsername(dto.getEmail());
    user.setEmail(dto.getEmail());

    user.setPassword(
            passwordEncoder.encode(dto.getPassword())
    );

    user.setRole(dto.getRole());
    user.setEnabled(true);

    User savedUser = userRepository.save(user);

    // Create Employee
    Employee employee = new Employee();

    employee.setName(dto.getName());
    employee.setSalary(dto.getSalary());
    employee.setDepartment(department);

    // Connect Employee to User
    employee.setUser(savedUser);

    Employee savedEmployee =
            employeeRepository.save(employee);

    // Response
    EmployeeResponseDTO response =
            new EmployeeResponseDTO();

    response.setId(savedEmployee.getId());
    response.setName(savedEmployee.getName());
    response.setSalary(savedEmployee.getSalary());

    response.setDepartmentName(
            savedEmployee
                    .getDepartment()
                    .getDeptName()
    );

    return response;
} 
@Override
    public void DeleteEmployee(int id){
        if(employeeRepository.existsById(id)){
            employeeRepository.deleteById(id);
        } else {
            throw new RuntimeException("doesnt exists");
        }
    }

@Override
    public EmployeeResponseDTO updateEmployeeById(int id,EmployeeRequestDTO dto){
        Employee employee = employeeRepository
        .findById(id)
        .orElseThrow(() -> new RuntimeException("Employee not found"));
        employee.setName(dto.getName());
        employee.setSalary(dto.getSalary());

        Department department = departmentRepository
        .findById(dto.getDepartmentId())
        .orElseThrow(() -> new RuntimeException("Department not found"));

        employee.setDepartment(department); 
        Employee updatedEmployee = employeeRepository.save(employee);
       EmployeeResponseDTO response = new EmployeeResponseDTO();

        response.setId(updatedEmployee.getId());
        response.setName(updatedEmployee.getName());
        response.setSalary(updatedEmployee.getSalary());
        response.setDepartmentName(
        updatedEmployee.getDepartment().getDeptName()
);
return response;
    }

    @Override
public EmployeeResponseDTO getMyEmployee(String email) {

    Employee employee = employeeRepository
            .findByUser_Email(email)
            .orElseThrow(() ->
                    new RuntimeException("Employee profile not found"));

    EmployeeResponseDTO dto = new EmployeeResponseDTO();

    dto.setId(employee.getId());
    dto.setName(employee.getName());
    dto.setSalary(employee.getSalary());
    dto.setDepartmentName(
            employee.getDepartment().getDeptName()
    );

    return dto;
    }
}
    