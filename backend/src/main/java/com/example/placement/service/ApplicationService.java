package com.example.placement.service;

import com.example.placement.model.Application;
import com.example.placement.model.Job;
import com.example.placement.model.Student;
import com.example.placement.repository.ApplicationRepository;
import com.example.placement.repository.JobRepository;
import com.example.placement.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            StudentRepository studentRepository,
            JobRepository jobRepository
    ) {
        this.applicationRepository = applicationRepository;
        this.studentRepository = studentRepository;
        this.jobRepository = jobRepository;
    }

    public Application saveApplication(Application application) {
        return saveApplication(application, null);
    }

    public Application saveApplication(Application application, String userEmail) {
        Long studentId = application.getStudent() != null ? application.getStudent().getId() : null;
        Long jobId = application.getJob() != null ? application.getJob().getId() : null;

        if (jobId == null) {
            throw new IllegalArgumentException("Job is required");
        }

        Student student = null;
        if (studentId != null) {
            student = studentRepository.findById(studentId).orElse(null);
        }
        if (student == null && userEmail != null) {
            student = studentRepository.findByUserEmail(userEmail).orElse(null);
        }
        if (student == null) {
            throw new IllegalArgumentException("Student not found");
        }
        studentId = student.getId();

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));

        Long studentUserId = student.getUser() != null ? student.getUser().getId() : null;
        Long jobCompanyUserId =
            job.getCompany() != null && job.getCompany().getUser() != null
                ? job.getCompany().getUser().getId()
                : null;
        if (studentUserId != null && studentUserId.equals(jobCompanyUserId)) {
            throw new IllegalArgumentException(
                "Student cannot apply to a job posted by their own company"
            );
        }

        application.setStudent(student);
        application.setJob(job);

        boolean alreadyApplied =
                applicationRepository.existsByStudentIdAndJobId(studentId, jobId);
        if (alreadyApplied) {
            throw new IllegalArgumentException(
                    "Student has already applied for this job"
            );
        }

        LocalDate today = LocalDate.now();
        LocalDate deadline = job.getDeadline();
        if (deadline == null) {
            throw new IllegalArgumentException("Job deadline is missing");
        }
        if (today.isAfter(deadline)) {
            throw new IllegalArgumentException(
                    "Application deadline has passed"
            );
        }

        BigDecimal studentCgpa = student.getCgpa();
        BigDecimal minimumCgpa = job.getMinimumCgpa();
        if (minimumCgpa != null &&
                (studentCgpa == null || studentCgpa.compareTo(minimumCgpa) < 0)) {
            throw new IllegalArgumentException(
                    "Student does not meet the minimum CGPA requirement"
            );
        }

        Set<Long> studentSkillIds = new HashSet<>();
        if (student.getSkills() != null) {
            for (var skill : student.getSkills()) {
                if (skill != null && skill.getId() != null) {
                    studentSkillIds.add(skill.getId());
                }
            }
        }

        Set<Long> requiredSkillIds = new HashSet<>();
        if (job.getSkills() != null) {
            for (var skill : job.getSkills()) {
                if (skill != null && skill.getId() != null) {
                    requiredSkillIds.add(skill.getId());
                }
            }
        }

        if (!requiredSkillIds.isEmpty()) {
            for (Long requiredSkillId : requiredSkillIds) {
                if (!studentSkillIds.contains(requiredSkillId)) {
                    throw new IllegalArgumentException(
                            "Student does not have the required skills"
                    );
                }
            }
        }

        if (application.getAppliedAt() == null) {
            application.setAppliedAt(java.time.LocalDateTime.now());
        }
        application.setStatus("PENDING");
        return applicationRepository.save(application);
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    public List<Application> getApplicationsByCompanyEmail(String email) {
        return applicationRepository.findByCompanyUserEmail(email);
    }

    public List<Application> getApplicationsByStudentEmail(String email) {
        return applicationRepository.findByStudentUserEmail(email);
    }

    public Optional<Application> getApplicationById(Long id) {
        return applicationRepository.findById(id);
    }

    public Application updateApplicationStatus(Long id, String status, String userEmail) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));

        if (userEmail != null) {
            String companyEmail = application.getJob() != null
                    && application.getJob().getCompany() != null
                    && application.getJob().getCompany().getUser() != null
                    ? application.getJob().getCompany().getUser().getEmail()
                    : null;
            if (companyEmail == null || !companyEmail.equals(userEmail)) {
                throw new org.springframework.security.access.AccessDeniedException("Not authorized to update this application");
            }
        }

        application.setStatus(status);
        return applicationRepository.save(application);
    }

    public void deleteApplication(Long id) {
        applicationRepository.deleteById(id);
    }
}