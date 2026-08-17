package com.example.placement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.example.placement.model.Job;

public interface JobRepository extends JpaRepository<Job, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT j FROM Job j WHERE j.company.id = :companyId")
    List<Job> findByCompanyId(@org.springframework.data.repository.query.Param("companyId") Long companyId);

    @org.springframework.transaction.annotation.Transactional
    @org.springframework.data.jpa.repository.Modifying(clearAutomatically = true, flushAutomatically = true)
    @org.springframework.data.jpa.repository.Query("DELETE FROM Job j WHERE j.company.id = :companyId")
    void deleteByCompanyId(@org.springframework.data.repository.query.Param("companyId") Long companyId);
}
