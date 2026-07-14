package com.employee.management.dto;

public class DepartmentRequestDTO {
    private String deptName;
    public DepartmentRequestDTO(){

    }
    public DepartmentRequestDTO(String deptName){
        this.deptName = deptName;
    }

    public void setDeptName(String deptName){
        this.deptName = deptName;
    }
    public String getDeptName(){
        return deptName;
    }
}
