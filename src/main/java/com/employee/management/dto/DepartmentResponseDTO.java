package com.employee.management.dto;

public class DepartmentResponseDTO {
    private int deptId;
    private String deptName;

    public DepartmentResponseDTO(){

    }
    public DepartmentResponseDTO(int deptId, String deptName){
        this.deptId = deptId;
        this.deptName = deptName;
    }

    public void setDeptName(String deptName){
        this.deptName = deptName;
    }
    public void setDeptId(int deptId){
        this.deptId = deptId;
    }

    public String getDeptName(){
        return deptName;
    }
    public int getDeptId(){
        return deptId;
    }
}
