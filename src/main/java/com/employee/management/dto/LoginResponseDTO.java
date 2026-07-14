package com.employee.management.dto;

import com.employee.management.Model.Role;

public class LoginResponseDTO {
    private String accessToken;
    private String tokenType;
    private String username;
    private String email;
    private Role role;

    public LoginResponseDTO(){

    }
    public LoginResponseDTO(String accessToken,String tokenType,String username,String email, Role role){
        this.accessToken=accessToken;
        this.tokenType=tokenType;
        this.username=username;
        this.email=email;
        this.role=role;
    }
    public String getAccessToken(){
        return accessToken;
    }
    public void setAccessToken(String accessToken){
        this.accessToken=accessToken;
    }
    public String getTokenType(){
        return tokenType;
    }
    public void setTokenType(String tokenType){
        this.tokenType=tokenType;
    }
     public String getUsername(){
        return username;
    }
    public void setUsername(String username){
        this.username = username;
    }
    public String getEmail(){
        return email;
    }
    public void setEmail(String email){
        this.email = email;
    }
    public Role getRole(){
        return role;
    }
    public void setRole(Role role){
        this.role = role;
    }
}
