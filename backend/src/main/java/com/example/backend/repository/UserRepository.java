package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.model.User;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUsername(String username);
    boolean existsByUsername(String username); //for signup to see if already taken
    boolean existsByEmail(String email); //for signup to see if email already taken
    boolean findByEnabled(boolean enabled);
}