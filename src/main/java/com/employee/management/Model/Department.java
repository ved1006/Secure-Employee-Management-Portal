package com.employee.management.Model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "department_db")
public class Department {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int deptId;
    private String deptName;

    @OneToMany(mappedBy = "department")
    @JsonIgnore
    private List<Employee> employees = new ArrayList<>();

    public Department(){

    }

    public Department(int deptId, String deptName){
        this.deptId = deptId;
        this.deptName = deptName;
    }

    public int getDeptId(){
        return deptId;
    }

    public String getDeptName(){
        return deptName;
    }
    public void setDeptId(int deptId){
        this.deptId = deptId;
    }
    public void setDeptName(String deptName){
        this.deptName = deptName;
    }
    public List<Employee> getEmployees() {
    return employees;
    }

    public void setEmployees(List<Employee> employees) {
    this.employees = employees;
    }
}
