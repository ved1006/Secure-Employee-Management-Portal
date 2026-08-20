package com.employee.management.Service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.employee.management.Model.Role;
import com.employee.management.Model.User;
import com.employee.management.Repository.UserRepository;
import com.employee.management.dto.LoginRequestDTO;
import com.employee.management.dto.LoginResponseDTO;
import com.employee.management.dto.RegisterRequestDTO;
import com.employee.management.dto.RegisterResponseDTO;
import com.employee.management.security.JwtService;
import com.employee.management.exception.BadRequestException;
import com.employee.management.exception.ResourceNotFoundException;
@Service
public class AuthServiceImpl implements AuthService{

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    public AuthServiceImpl(PasswordEncoder passwordEncoder, UserRepository userRepository,JwtService jwtService){
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @Override
    public RegisterResponseDTO register(RegisterRequestDTO dto){
   if (!dto.getPassword().equals(dto.getConfirmPassword())) {
    throw new BadRequestException("Passwords do not match.");
}

if (userRepository.existsByUsername(dto.getUsername())) {
    throw new BadRequestException(
        "Username already exists. Please choose another username."
    );
}

if (userRepository.existsByEmail(dto.getEmail())) {
    throw new BadRequestException(
        "Email already exists. Please login."
    );
}
        String pass = passwordEncoder.encode(dto.getPassword());

        RegisterResponseDTO response = new RegisterResponseDTO();
        User user = new User();
        user.setEmail(dto.getEmail());
        user.setUsername(dto.getUsername());
        user.setPassword(pass);
        user.setRole(Role.EMPLOYEE);
        user.setEnabled(true); //do email verification
        User savedUser = userRepository.save(user);

        response.setId(savedUser.getId());
        response.setUsername(savedUser.getUsername());
        response.setEmail(savedUser.getEmail());;
        response.setMessage("registered successfully !!");

        return response;
    }

    @Override
public LoginResponseDTO login(LoginRequestDTO dto) {

    User user = userRepository.findByEmail(dto.getEmail())
            .orElseThrow(() ->
                    new RuntimeException("No account found with this email. Please register first."));

    if (!user.isEnabled()) {
        throw new RuntimeException("Please verify your email before logging in.");
    }

    if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
        throw new RuntimeException("Invalid email or password.");
    }

    String token = jwtService.generateToken(user);

    LoginResponseDTO response = new LoginResponseDTO();
    response.setAccessToken(token);
    response.setTokenType("Bearer");
    response.setUsername(user.getUsername());
    response.setEmail(user.getEmail());
    response.setRole(user.getRole());

    return response;
}
@Override
public void changePassword(
        String email,
        String currentPassword,
        String newPassword,
        String confirmPassword) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("User not found."));

    if (!passwordEncoder.matches(
            currentPassword,
            user.getPassword())) {

        throw new RuntimeException(
                "Current password is incorrect.");
    }

    if (currentPassword.equals(newPassword)) {
        throw new RuntimeException(
                "New password must be different from current password.");
    }

    if (!newPassword.equals(confirmPassword)) {
        throw new RuntimeException(
                "New passwords do not match.");
    }

    user.setPassword(
            passwordEncoder.encode(newPassword));

    userRepository.save(user);
}
}