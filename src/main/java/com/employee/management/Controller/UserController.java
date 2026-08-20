package com.employee.management.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.employee.management.Model.Role;
import com.employee.management.Service.UserService;
import com.employee.management.dto.UpdateRoleDTO;
import com.employee.management.dto.UserResponseDTO;

@RestController
@RequestMapping("/users")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserResponseDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserResponseDTO getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponseDTO createUser(
            @RequestParam String username,
            @RequestParam String email,
            @RequestParam Role role) {

        return userService.createUser(username, email, role);
    }

    @PutMapping("/{id}/role")
    public UserResponseDTO updateUserRole(
            @PathVariable Long id,
            @RequestBody UpdateRoleDTO dto) {

        return userService.updateUserRole(id, dto);
    }

    @PutMapping("/{id}/status")
    public UserResponseDTO updateUserStatus(
            @PathVariable Long id,
            @RequestParam boolean enabled) {

        return userService.updateUserStatus(id, enabled);
    }
}