package com.employee.management.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequestDTO{
    @NotBlank(message = "Username is required")
    @Size(min=3,max=8,message = "the username should be 3-20 characters")
    private String username;
    @NotBlank(message = "password is required")
    @Size(min=8, message = "the password must be atleast 8 characters")
    private String password;
    @NotBlank(message = "email is required")
    @Email(message  = "invalid email")
    private String email;
    @NotBlank(message = "confirm password is required")
    private String confirmPassword;
    public RegisterRequestDTO(){

    }
    public RegisterRequestDTO(String username,String password,String email,String confirmPassword){
        this.username=username;
        this.password=password;
        this.email=email;
        this.confirmPassword=confirmPassword;
    }

    public String getUsername(){
        return username;
    }
    public void setUsername(String username){
        this.username = username;
    }
    public String getPassword(){
        return password;
    }
    public void setPassword(String password){
        this.password=password;
    }
    public String getEmail(){
        return email;
    }
    public void setEmail(String email){
        this.email = email;
    }
    public String getConfirmPassword(){
        return confirmPassword;
    }
    public void setConfirmPassword(String confirmPassword){
        this.confirmPassword=confirmPassword;
    }

}