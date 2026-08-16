package com.example.placement.repository;

import com.example.placement.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    boolean existsByStudentIdAndJobId(Long studentId, Long jobId);

    @Query("""
        SELECT a
        FROM Application a
        WHERE a.job.company.user.email = :email
    """)
    List<Application> findByCompanyUserEmail(@Param("email") String email);

    @Query("""
        SELECT a
        FROM Application a
        WHERE a.student.user.email = :email
    """)
    List<Application> findByStudentUserEmail(@Param("email") String email);
}
