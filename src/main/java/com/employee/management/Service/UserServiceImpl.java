package com.employee.management.Service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.employee.management.Model.Role;
import com.employee.management.Model.User;
import com.employee.management.Repository.UserRepository;
import com.employee.management.dto.UpdateRoleDTO;
import com.employee.management.dto.UserResponseDTO;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Override
    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with id: " + id));

        return convertToDTO(user);
    }

    @Override
    public UserResponseDTO createUser(
            String username,
            String email,
            Role role) {

        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();

        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(
                passwordEncoder.encode("Temp@123"));
        user.setRole(role);
        user.setEnabled(true);

        User savedUser = userRepository.save(user);

        return convertToDTO(savedUser);
    }

    @Override
    public UserResponseDTO updateUserRole(
            Long id,
            UpdateRoleDTO dto) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with id: " + id));

        user.setRole(dto.getRole());

        User updatedUser = userRepository.save(user);

        return convertToDTO(updatedUser);
    }

    @Override
    public UserResponseDTO updateUserStatus(
            Long id,
            boolean enabled) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with id: " + id));

        user.setEnabled(enabled);

        User updatedUser = userRepository.save(user);

        return convertToDTO(updatedUser);
    }

    private UserResponseDTO convertToDTO(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.isEnabled()
        );
    }
}