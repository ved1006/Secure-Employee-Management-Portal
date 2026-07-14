package com.employee.management.dto;

public class EmployeeRequestDTO {
    private String name;
    private double salary;
    private int departmentId;

    public EmployeeRequestDTO(){

    }
    public EmployeeRequestDTO(String name, double salary, int departmentId){
        this.name = name;
        this.salary = salary;
        this.departmentId = departmentId;
    }

    public String getName(){
        return name;
    }
    public double getSalary(){
        return salary;
    }
    public int getDepartmentId(){
        return departmentId;
    }

    public void setName(String name){
        this.name = name;
    }
    public void setSalary(double salary){
        this.salary = salary;
    }
    public void setDepartmentId(int departmentId){
        this.departmentId = departmentId;
    }
}
