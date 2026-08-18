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
        if (userRepository.findByEmail("chakri@gmail.com").isPresent()) {
            return; // Already initialized with main dataset
        }

        System.out.println("[DataSeeder] Initializing MySQL database with primary placement dataset...");

        // 1. ADMIN (Chakri)
        User admin = new User();
        admin.setName("Chakri (Admin)");
        admin.setEmail("chakri@gmail.com");
        admin.setPassword(passwordEncoder.encode("chakri123"));
        admin.setRole("ADMIN");
        userRepository.save(admin);

        // 2. COMPANY RECRUITERS (Harsha, Sai Charan, Indra)
        User harshaUser = new User();
        harshaUser.setName("Harsha (Microsoft Recruiter)");
        harshaUser.setEmail("harsha@gmail.com");
        harshaUser.setPassword(passwordEncoder.encode("harsha123"));
        harshaUser.setRole("COMPANY");
        userRepository.save(harshaUser);

        Company microsoftCompany = new Company();
        microsoftCompany.setUser(harshaUser);
        microsoftCompany.setCompanyName("Microsoft");
        microsoftCompany.setDescription("Software development company");
        microsoftCompany.setLocation("Hyderabad");
        microsoftCompany.setWebsite("https://www.microsoft.com/en-in/");
        companyRepository.save(microsoftCompany);

        User saicharanUser = new User();
        saicharanUser.setName("Sai Charan (Perficient Recruiter)");
        saicharanUser.setEmail("saicharan@gmail.com");
        saicharanUser.setPassword(passwordEncoder.encode("saicharan123"));
        saicharanUser.setRole("COMPANY");
        userRepository.save(saicharanUser);

        Company perficientCompany = new Company();
        perficientCompany.setUser(saicharanUser);
        perficientCompany.setCompanyName("Perficient");
        perficientCompany.setDescription("Associate Technical Consultant");
        perficientCompany.setLocation("Nagpur");
        perficientCompany.setWebsite("https://www.perficient.com/");
        companyRepository.save(perficientCompany);

        User indraUser = new User();
        indraUser.setName("Indra (Accenture Recruiter)");
        indraUser.setEmail("indra@gmail.com");
        indraUser.setPassword(passwordEncoder.encode("indra123"));
        indraUser.setRole("COMPANY");
        userRepository.save(indraUser);

        Company accentureCompany = new Company();
        accentureCompany.setUser(indraUser);
        accentureCompany.setCompanyName("Accenture");
        accentureCompany.setDescription("AI Engineer");
        accentureCompany.setLocation("Bangalore");
        accentureCompany.setWebsite("https://www.accenture.com/in-en");
        companyRepository.save(accentureCompany);

        // 3. STUDENTS (Exact records from MySQL Workbench)
        createStudent("Nitya", "nitya@gmail.com", "nitya123", "VNIT Nagpur", "B.Tech", "CSE", 2025, "8.50", "6300373746", "https://Nitya.com");
        createStudent("Srujan", "srujan@gmail.com", "srujan123", "NIT Trichy", "B.Tech", "ECE", 2026, "7.15", "9177323879", "https://srujan.com");
        createStudent("Bhargav", "bhargav@gmail.com", "bhargav123", "NIT Surat", "B.Tech", "ECE", 2026, "8.29", "8106821142", "https://Bhargav.com");
        createStudent("Anurag", "anurag@gmail.com", "anurag123", "NIT Warangal", "BTech", "CSE", 2026, "7.50", "9063443206", "https://Anurag.com");
        createStudent("Rishitha", "rishitha@gmail.com", "rishitha123", "VNIT Nagpur", "B.Tech", "CSE", 2025, "9.00", "8125622401", "https://rishitha.com");

        // 4. JOBS
        Job job1 = new Job();
        job1.setCompany(microsoftCompany);
        job1.setTitle("Software Development Engineer (SDE-1)");
        job1.setDescription("Build high-performance distributed backend services using Java, Spring Boot, and React.");
        job1.setLocation("Bengaluru, India");
        job1.setSalary(new BigDecimal("2400000.00"));
        job1.setJobType("FULL_TIME");
        job1.setMinimumCgpa(new BigDecimal("7.50"));
        job1.setExperienceRequired("Fresher (2026 Batch)");
        job1.setDeadline(LocalDate.now().plusMonths(3));
        job1.setCreatedAt(LocalDateTime.now());
        jobRepository.save(job1);

        Job job2 = new Job();
        job2.setCompany(perficientCompany);
        job2.setTitle("Cloud Solutions Engineer");
        job2.setDescription("Design and build scalable Azure enterprise cloud architectures.");
        job2.setLocation("Hyderabad, India");
        job2.setSalary(new BigDecimal("2100000.00"));
        job2.setJobType("FULL_TIME");
        job2.setMinimumCgpa(new BigDecimal("7.00"));
        job2.setExperienceRequired("Fresher");
        job2.setDeadline(LocalDate.now().plusMonths(4));
        job2.setCreatedAt(LocalDateTime.now());
        jobRepository.save(job2);

        Job job3 = new Job();
        job3.setCompany(accentureCompany);
        job3.setTitle("AWS DevOps & Backend Engineer");
        job3.setDescription("Develop high-scale cloud services, CI/CD automation, and microservices.");
        job3.setLocation("Bengaluru, India");
        job3.setSalary(new BigDecimal("2250000.00"));
        job3.setJobType("FULL_TIME");
        job3.setMinimumCgpa(new BigDecimal("8.00"));
        job3.setExperienceRequired("0-1 Year");
        job3.setDeadline(LocalDate.now().plusMonths(2));
        job3.setCreatedAt(LocalDateTime.now());
        jobRepository.save(job3);

        // 5. APPLICATIONS
        Student rishithaStudent = studentRepository.findAll().stream().filter(s -> s.getUser().getEmail().equals("rishitha@gmail.com")).findFirst().orElse(null);
        Student nityaStudent = studentRepository.findAll().stream().filter(s -> s.getUser().getEmail().equals("nitya@gmail.com")).findFirst().orElse(null);
        Student bhargavStudent = studentRepository.findAll().stream().filter(s -> s.getUser().getEmail().equals("bhargav@gmail.com")).findFirst().orElse(null);

        if (rishithaStudent != null) {
            Application app1 = new Application();
            app1.setStudent(rishithaStudent);
            app1.setJob(job1);
            app1.setStatus("SELECTED");
            app1.setAppliedAt(LocalDateTime.now().minusDays(3));
            applicationRepository.save(app1);
        }

        if (nityaStudent != null) {
            Application app2 = new Application();
            app2.setStudent(nityaStudent);
            app2.setJob(job2);
            app2.setStatus("SHORTLISTED");
            app2.setAppliedAt(LocalDateTime.now().minusDays(2));
            applicationRepository.save(app2);
        }

        if (bhargavStudent != null) {
            Application app3 = new Application();
            app3.setStudent(bhargavStudent);
            app3.setJob(job3);
            app3.setStatus("PENDING");
            app3.setAppliedAt(LocalDateTime.now().minusDays(1));
            applicationRepository.save(app3);
        }

        System.out.println("[DataSeeder] Successfully initialized database with Chakri, Harsha, Sai Charan, Indra, Rishitha, Nitya, Bhargav, Srujan, and Anurag!");
    }

    private void createStudent(String name, String email, String password, String college, String degree, String branch, int graduationYear, String cgpa, String phone, String resumeUrl) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("STUDENT");
        userRepository.save(user);

        Student student = new Student();
        student.setUser(user);
        student.setCollege(college);
        student.setDegree(degree);
        student.setBranch(branch);
        student.setGraduationYear(graduationYear);
        student.setCgpa(new BigDecimal(cgpa));
        student.setPhone(phone);
        student.setResumeUrl(resumeUrl);
        studentRepository.save(student);
    }
}
