package com.employee.management.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.List;
import jakarta.persistence.OneToMany;
@Entity
@Table(name = "employeedb")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    private double salary;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "dept_id")
    private Department department;

    @OneToMany(mappedBy = "employee")
    private List<LeaveRequest> leaveRequests;

    public Employee() {

    }

    public Employee(
            int id,
            String name,
            double salary) {

        this.id = id;
        this.name = name;
        this.salary = salary;
    }

    public int getId() {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getSalary() {
        return this.salary;
    }

    public void setSalary(double salary) {
        this.salary = salary;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public List<LeaveRequest> getLeaveRequests() {
    return leaveRequests;
}

public void setLeaveRequests(List<LeaveRequest> leaveRequests) {
    this.leaveRequests = leaveRequests;
}
}