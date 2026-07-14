package com.employee.management.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class LoginRequestDTO {
   @NotBlank(message = "the password should not be blank")
   @Size(min=8, message = "the password shound be atleast 8 characters")
    private String password;
    @NotBlank(message = "the email should not be blank")
    @Email(message = "invalid email")
    private String email;

    public LoginRequestDTO(){

    }
    public LoginRequestDTO(String password,String email){

        this.password=password;
        this.email=email;
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
}
