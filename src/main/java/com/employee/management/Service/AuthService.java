package com.employee.management.Service;

import com.employee.management.dto.LoginRequestDTO;
import com.employee.management.dto.LoginResponseDTO;
import com.employee.management.dto.RegisterRequestDTO;
import com.employee.management.dto.RegisterResponseDTO;

public interface AuthService{
    public RegisterResponseDTO register(RegisterRequestDTO dto);
    
    public LoginResponseDTO login(LoginRequestDTO dto);
}