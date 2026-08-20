package com.employee.management.dto;

import com.employee.management.Model.Role;

public class UpdateRoleDTO {

    private Role role;

    public UpdateRoleDTO() {
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}