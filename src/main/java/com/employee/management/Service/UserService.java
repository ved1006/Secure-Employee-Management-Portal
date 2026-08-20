package com.employee.management.Service;

import java.util.List;

import com.employee.management.Model.Role;
import com.employee.management.dto.UpdateRoleDTO;
import com.employee.management.dto.UserResponseDTO;

public interface UserService {

    List<UserResponseDTO> getAllUsers();

    UserResponseDTO getUserById(Long id);

    UserResponseDTO createUser(
            String username,
            String email,
            Role role);

    UserResponseDTO updateUserRole(
            Long id,
            UpdateRoleDTO dto);

    UserResponseDTO updateUserStatus(
            Long id,
            boolean enabled);


}