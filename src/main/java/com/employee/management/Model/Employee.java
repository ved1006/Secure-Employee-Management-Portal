package com.employee.management.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "employeedb")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    private double salary;

    @ManyToOne
    @JoinColumn(name = "dept_id")
    private Department department;

    public Employee() {

    }

    public Employee(int id, String name, double salary) {

        this.id = id;
        this.name = name;
        this.salary = salary;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSalary(double salary) {
        this.salary = salary;
    }

    public int getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public double getSalary() {
        return this.salary;
    }
    public Department getDepartment(){
        return department;
    }
    public void setDepartment(Department department){
        this.department = department;
    }
}
