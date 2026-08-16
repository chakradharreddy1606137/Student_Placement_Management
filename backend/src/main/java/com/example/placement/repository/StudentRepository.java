package com.example.placement.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.placement.model.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {
    @Query("SELECT s FROM Student s LEFT JOIN FETCH s.skills WHERE s.user.email = :email")
    Optional<Student> findByUserEmail(@Param("email") String email);
}
