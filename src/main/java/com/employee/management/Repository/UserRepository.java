package com.employee.management.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.employee.management.Model.User;

public interface UserRepository extends JpaRepository<User,Long> {
    public Optional<User> findByEmail(String email);
    public Optional<User> findByUsername(String username);
    public boolean existsByEmail(String email);
    public boolean existsByUsername(String username);
}
