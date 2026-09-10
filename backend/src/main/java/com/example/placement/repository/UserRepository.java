package com.example.placement.repository;

import com.example.placement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    @org.springframework.data.jpa.repository.Query("SELECT u FROM User u WHERE LOWER(u.email) = LOWER(:email)")
    Optional<User> findByEmail(@org.springframework.data.repository.query.Param("email") String email);
}
