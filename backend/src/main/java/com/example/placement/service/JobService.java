package com.example.placement.service;

import com.example.placement.model.Company;
import com.example.placement.model.Job;
import com.example.placement.repository.ApplicationRepository;
import com.example.placement.repository.CompanyRepository;
import com.example.placement.repository.JobRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final CompanyRepository companyRepository;

    public JobService(JobRepository jobRepository, ApplicationRepository applicationRepository, CompanyRepository companyRepository) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.companyRepository = companyRepository;
    }

    public Job saveJob(Job job) {
        return saveJob(job, null);
    }

    public Job saveJob(Job job, String callerEmail) {
        if (job == null) {
            throw new IllegalArgumentException("Job cannot be null");
        }
        if (job.getTitle() == null || job.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Job title is required");
        }
        if (job.getSalary() != null && job.getSalary().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Salary cannot be negative");
        }
        if (job.getMinimumCgpa() != null) {
            BigDecimal minCgpa = job.getMinimumCgpa();
            if (minCgpa.compareTo(BigDecimal.ZERO) < 0 || minCgpa.compareTo(BigDecimal.valueOf(10.0)) > 0) {
                throw new IllegalArgumentException("Minimum CGPA must be between 0.0 and 10.0");
            }
        }

        if (job.getCompany() == null && callerEmail != null && companyRepository != null) {
            companyRepository.findByUserEmail(callerEmail).ifPresent(job::setCompany);
        }

        if (job.getCompany() == null) {
            throw new IllegalArgumentException("Company is required");
        }

        if (job.getCompany().getId() != null && companyRepository != null) {
            if (!companyRepository.existsById(job.getCompany().getId())) {
                throw new IllegalArgumentException("Company not found with ID: " + job.getCompany().getId());
            }
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
    public Job updateJob(Long id, Job details, String companyEmail) {
        Job existing = jobRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Job not found: " + id));

        if (companyEmail != null) {
            String ownerEmail = existing.getCompany() != null && existing.getCompany().getUser() != null
                    ? existing.getCompany().getUser().getEmail()
                    : null;
            if (ownerEmail == null || !ownerEmail.equalsIgnoreCase(companyEmail)) {
                throw new AccessDeniedException("You can only modify jobs posted by your own company");
            }
        }

        if (details.getTitle() != null && !details.getTitle().trim().isEmpty()) {
            existing.setTitle(details.getTitle().trim());
        }
        if (details.getDescription() != null) {
            existing.setDescription(details.getDescription());
        }
        if (details.getLocation() != null) {
            existing.setLocation(details.getLocation());
        }
        if (details.getSalary() != null) {
            if (details.getSalary().compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalArgumentException("Salary cannot be negative");
            }
            existing.setSalary(details.getSalary());
        }
        if (details.getMinimumCgpa() != null) {
            if (details.getMinimumCgpa().compareTo(BigDecimal.ZERO) < 0 || details.getMinimumCgpa().compareTo(BigDecimal.valueOf(10.0)) > 0) {
                throw new IllegalArgumentException("Minimum CGPA must be between 0.0 and 10.0");
            }
            existing.setMinimumCgpa(details.getMinimumCgpa());
        }
        if (details.getJobType() != null) {
            existing.setJobType(details.getJobType());
        }
        if (details.getExperienceRequired() != null) {
            existing.setExperienceRequired(details.getExperienceRequired());
        }
        if (details.getDeadline() != null) {
            existing.setDeadline(details.getDeadline());
        }

        return jobRepository.save(existing);
    }

    public void deleteJob(Long id) {
        deleteJob(id, null);
    }

    @Transactional
    public void deleteJob(Long id, String companyEmail) {
        Job job = jobRepository.findById(id).orElse(null);
        if (job == null) {
            return;
        }

        if (companyEmail != null) {
            String ownerEmail = job.getCompany() != null && job.getCompany().getUser() != null
                    ? job.getCompany().getUser().getEmail()
                    : null;
            if (ownerEmail == null || !ownerEmail.equalsIgnoreCase(companyEmail)) {
                throw new AccessDeniedException("You can only delete jobs posted by your own company");
            }
        }

        var apps = applicationRepository.findByJobId(id);
        if (!apps.isEmpty()) {
            applicationRepository.deleteAllInBatch(apps);
        }
        job.getSkills().clear();
        jobRepository.saveAndFlush(job);
        jobRepository.delete(job);
    }
}
