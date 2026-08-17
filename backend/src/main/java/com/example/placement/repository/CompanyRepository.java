package com.example.placement.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.placement.model.Company;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT c FROM Company c WHERE c.user.email = :email")
    Optional<Company> findByUserEmail(@org.springframework.data.repository.query.Param("email") String email);

    @org.springframework.data.jpa.repository.Query("SELECT c FROM Company c WHERE c.user.id = :userId")
    Optional<Company> findByUserId(@org.springframework.data.repository.query.Param("userId") Long userId);
}
