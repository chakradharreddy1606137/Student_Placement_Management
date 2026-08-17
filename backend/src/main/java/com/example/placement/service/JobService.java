package com.example.placement.service;

import com.example.placement.model.Job;
import com.example.placement.repository.ApplicationRepository;
import com.example.placement.repository.JobRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public JobService(JobRepository jobRepository, ApplicationRepository applicationRepository) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    public Job saveJob(Job job) {
        if (job.getSalary() != null && job.getSalary().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Salary cannot be negative");
        }
        if (job.getMinimumCgpa() != null) {
            BigDecimal minCgpa = job.getMinimumCgpa();
            if (minCgpa.compareTo(BigDecimal.ZERO) < 0 || minCgpa.compareTo(BigDecimal.valueOf(10.0)) > 0) {
                throw new IllegalArgumentException("Minimum CGPA must be between 0.0 and 10.0");
            }
        }
        if (job.getTitle() == null || job.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Job title is required");
        }
        return jobRepository.save(job);
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Optional<Job> getJobById(Long id) {
        return jobRepository.findById(id);
    }

    @Transactional
    public void deleteJob(Long id) {
        jobRepository.findById(id).ifPresent(job -> {
            var apps = applicationRepository.findByJobId(id);
            if (!apps.isEmpty()) {
                applicationRepository.deleteAllInBatch(apps);
            }
            job.getSkills().clear();
            jobRepository.saveAndFlush(job);
            jobRepository.delete(job);
        });
    }
}

