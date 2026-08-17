package com.example.placement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.example.placement.model.Job;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByCompanyId(Long companyId);
    void deleteByCompanyId(Long companyId);
}
