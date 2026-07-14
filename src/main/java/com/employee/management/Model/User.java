package com.employee.management.Model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true,nullable = false)
    private String username;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false)
    private String password;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    @Column(nullable = false)
    private boolean enabled;
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public User(){

    }
    public User(Long id, String username, String email,boolean enabled, String password, Role role, LocalDateTime createdAt,LocalDateTime updatedAt){
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this.enabled = enabled;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId(){
        return id;
    }
    public void setId(Long id){
        this.id =id;
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
        this.password = password;
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
    public boolean isEnabled(){
        return enabled;
    }
    public void setEnabled(boolean enabled){
        this.enabled = enabled;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }   
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
        public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}