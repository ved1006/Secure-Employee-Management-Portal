package com.employee.management.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.employee.management.Service.AuthService;
import com.employee.management.dto.LoginRequestDTO;
import com.employee.management.dto.LoginResponseDTO;
import com.employee.management.dto.RegisterRequestDTO;
import com.employee.management.dto.RegisterResponseDTO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public RegisterResponseDTO register(@Valid @RequestBody RegisterRequestDTO dto) {

        return authService.register(dto);
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public LoginResponseDTO login(@Valid @RequestBody LoginRequestDTO dto) {

        return authService.login(dto);
    }
}