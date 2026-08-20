package com.employee.management.dto;

import com.employee.management.Model.Role;

public class EmployeeRequestDTO {

    private String name;
    private double salary;
    private int departmentId;

    // Login account details
    private String email;
    private String password;
    private Role role;

    public EmployeeRequestDTO() {

    }

    public EmployeeRequestDTO(
            String name,
            double salary,
            int departmentId,
            String email,
            String password,
            Role role) {

        this.name = name;
        this.salary = salary;
        this.departmentId = departmentId;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public double getSalary() {
        return salary;
    }

    public int getDepartmentId() {
        return departmentId;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public Role getRole() {
        return role;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSalary(double salary) {
        this.salary = salary;
    }

    public void setDepartmentId(int departmentId) {
        this.departmentId = departmentId;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}