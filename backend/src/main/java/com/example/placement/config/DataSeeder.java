package com.example.placement.config;

import com.example.placement.model.*;
import com.example.placement.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      StudentRepository studentRepository,
                      CompanyRepository companyRepository,
                      JobRepository jobRepository,
                      ApplicationRepository applicationRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Already initialized
        }

        System.out.println("[DataSeeder] Initializing cloud database with seed data...");

        String defaultHash = passwordEncoder.encode("password123");

        // 1. Admin
        User admin = new User();
        admin.setName("Placement Officer (Admin)");
        admin.setEmail("admin@example.com");
        admin.setPassword(defaultHash);
        admin.setRole("ADMIN");
        userRepository.save(admin);

        // 2. Student 1
        User studentUser = new User();
        studentUser.setName("Alex Sharma");
        studentUser.setEmail("student@example.com");
        studentUser.setPassword(defaultHash);
        studentUser.setRole("STUDENT");
        userRepository.save(studentUser);

        Student student = new Student();
        student.setUser(studentUser);
        student.setCollege("National Institute of Technology");
        student.setDegree("B.Tech");
        student.setBranch("Computer Science & Engineering");
        student.setGraduationYear(2026);
        student.setCgpa(new BigDecimal("8.90"));
        student.setPhone("+91 98765 43210");
        student.setResumeUrl("https://example.com/alex_resume.pdf");
        studentRepository.save(student);

        // 3. Student 2
        User studentUser2 = new User();
        studentUser2.setName("Priya Patel");
        studentUser2.setEmail("priya@example.com");
        studentUser2.setPassword(defaultHash);
        studentUser2.setRole("STUDENT");
        userRepository.save(studentUser2);

        Student student2 = new Student();
        student2.setUser(studentUser2);
        student2.setCollege("IIT Bombay");
        student2.setDegree("B.Tech");
        student2.setBranch("Information Technology");
        student2.setGraduationYear(2026);
        student2.setCgpa(new BigDecimal("9.40"));
        student2.setPhone("+91 98765 43211");
        student2.setResumeUrl("https://example.com/priya_resume.pdf");
        studentRepository.save(student2);

        // 4. Company 1
        User companyUser1 = new User();
        companyUser1.setName("Google Campus Recruiter");
        companyUser1.setEmail("recruiter@google.com");
        companyUser1.setPassword(defaultHash);
        companyUser1.setRole("COMPANY");
        userRepository.save(companyUser1);

        Company company1 = new Company();
        company1.setUser(companyUser1);
        company1.setCompanyName("Google Cloud");
        company1.setDescription("Global technology leader in cloud computing and distributed systems.");
        company1.setLocation("Bengaluru / Hyderabad");
        company1.setWebsite("https://careers.google.com");
        companyRepository.save(company1);

        // 5. Company 2
        User companyUser2 = new User();
        companyUser2.setName("Microsoft Talent Recruiter");
        companyUser2.setEmail("recruiter@microsoft.com");
        companyUser2.setPassword(defaultHash);
        companyUser2.setRole("COMPANY");
        userRepository.save(companyUser2);

        Company company2 = new Company();
        company2.setUser(companyUser2);
        company2.setCompanyName("Microsoft");
        company2.setDescription("Empowering every person and organization on the planet to achieve more.");
        company2.setLocation("Hyderabad, India");
        company2.setWebsite("https://careers.microsoft.com");
        companyRepository.save(company2);

        // 6. Jobs
        Job job1 = new Job();
        job1.setCompany(company1);
        job1.setTitle("Software Development Engineer (SDE-1)");
        job1.setDescription("Design and build high-throughput backend services in Java/Spring Boot and modern React.");
        job1.setLocation("Bengaluru, India");
        job1.setSalary(new BigDecimal("2200000.00"));
        job1.setJobType("FULL_TIME");
        job1.setMinimumCgpa(new BigDecimal("7.50"));
        job1.setExperienceRequired("0-1 Year (Fresher)");
        job1.setDeadline(LocalDate.now().plusMonths(3));
        job1.setCreatedAt(LocalDateTime.now());
        jobRepository.save(job1);

        Job job2 = new Job();
        job2.setCompany(company1);
        job2.setTitle("Cloud Solutions Associate");
        job2.setDescription("Architect scalable cloud infrastructures and Kubernetes pipelines.");
        job2.setLocation("Hyderabad, India");
        job2.setSalary(new BigDecimal("1850000.00"));
        job2.setJobType("FULL_TIME");
        job2.setMinimumCgpa(new BigDecimal("7.00"));
        job2.setExperienceRequired("Fresher");
        job2.setDeadline(LocalDate.now().plusMonths(4));
        job2.setCreatedAt(LocalDateTime.now());
        jobRepository.save(job2);

        Job job3 = new Job();
        job3.setCompany(company2);
        job3.setTitle("Full Stack Engineer");
        job3.setDescription("Develop end-to-end cloud products using TypeScript, React, Spring Boot, and Azure.");
        job3.setLocation("Hyderabad, India");
        job3.setSalary(new BigDecimal("2000000.00"));
        job3.setJobType("FULL_TIME");
        job3.setMinimumCgpa(new BigDecimal("8.00"));
        job3.setExperienceRequired("0-2 Years");
        job3.setDeadline(LocalDate.now().plusMonths(2));
        job3.setCreatedAt(LocalDateTime.now());
        jobRepository.save(job3);

        // 7. Applications
        Application app1 = new Application();
        app1.setStudent(student);
        app1.setJob(job1);
        app1.setStatus("SHORTLISTED");
        app1.setAppliedAt(LocalDateTime.now());
        applicationRepository.save(app1);

        Application app2 = new Application();
        app2.setStudent(student2);
        app2.setJob(job1);
        app2.setStatus("SELECTED");
        app2.setAppliedAt(LocalDateTime.now());
        applicationRepository.save(app2);

        System.out.println("[DataSeeder] Successfully seeded initial cloud database records!");
    }
}
