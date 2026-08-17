package com.example.placement.service;

import com.example.placement.model.Company;
import com.example.placement.model.Job;
import com.example.placement.repository.ApplicationRepository;
import com.example.placement.repository.CompanyRepository;
import com.example.placement.repository.JobRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public CompanyService(CompanyRepository companyRepository, JobRepository jobRepository, ApplicationRepository applicationRepository) {
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    public Company saveCompany(Company company) {
        if (company.getCompanyName() == null || company.getCompanyName().trim().isEmpty()) {
            throw new IllegalArgumentException("Company name is required");
        }
        return companyRepository.save(company);
    }

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public Optional<Company> getCompanyById(Long id) {
        return companyRepository.findById(id);
    }

    public Optional<Company> getCompanyByEmail(String email) {
        return companyRepository.findByUserEmail(email);
    }

    @Transactional
    public void deleteCompany(Long id) {
        companyRepository.findById(id).ifPresent(company -> {
            var jobs = jobRepository.findByCompanyId(id);
            for (var job : jobs) {
                var apps = applicationRepository.findByJobId(job.getId());
                if (!apps.isEmpty()) {
                    applicationRepository.deleteAllInBatch(apps);
                }
                job.getSkills().clear();
                jobRepository.saveAndFlush(job);
                jobRepository.delete(job);
            }
            companyRepository.delete(company);
        });
    }
}

