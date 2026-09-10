package com.example.placement;

import com.example.placement.controller.ApplicationController;
import com.example.placement.model.Application;
import com.example.placement.model.Company;
import com.example.placement.model.Job;
import com.example.placement.model.Student;
import com.example.placement.model.User;
import com.example.placement.repository.ApplicationRepository;
import com.example.placement.repository.JobRepository;
import com.example.placement.repository.StudentRepository;
import com.example.placement.service.ApplicationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.lang.reflect.Proxy;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

public class ApplicationLifecycleTest {

    private ApplicationController applicationController;
    private ApplicationService applicationService;

    private ApplicationRepository applicationRepository;
    private StudentRepository studentRepository;
    private JobRepository jobRepository;

    private Authentication studentNityaAuth;
    private Authentication companyMicrosoftAuth;
    private Authentication companyPerficientAuth;

    private Student nityaStudent;
    private Company microsoftCompany;
    private Company perficientCompany;
    private Job activeMicrosoftJob;
    private Job expiredJob;
    private Job highCgpaJob;
    private Job perficientJob;

    private final Map<Long, Application> appStore = new HashMap<>();
    private final Map<Long, Student> studentStore = new HashMap<>();
    private final Map<Long, Job> jobStore = new HashMap<>();

    @BeforeEach
    void setUp() {
        appStore.clear();
        studentStore.clear();
        jobStore.clear();

        // 1. Authenticated Student: Nitya
        studentNityaAuth = new UsernamePasswordAuthenticationToken(
                "nitya@gmail.com",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_STUDENT"))
        );

        // 2. Authenticated Company: Harsha (Microsoft)
        companyMicrosoftAuth = new UsernamePasswordAuthenticationToken(
                "harsha@gmail.com",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_COMPANY"))
        );

        // 3. Authenticated Company: Sai Charan (Perficient)
        companyPerficientAuth = new UsernamePasswordAuthenticationToken(
                "saicharan@gmail.com",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_COMPANY"))
        );

        // Student (CGPA = 8.00)
        User studentUser = new User();
        studentUser.setId(10L);
        studentUser.setName("Nitya");
        studentUser.setEmail("nitya@gmail.com");
        studentUser.setRole("STUDENT");

        nityaStudent = new Student();
        nityaStudent.setId(1L);
        nityaStudent.setUser(studentUser);
        nityaStudent.setCollege("VNIT Nagpur");
        nityaStudent.setCgpa(new BigDecimal("8.00"));
        studentStore.put(1L, nityaStudent);

        // Microsoft Company & Recruiter
        User microsoftUser = new User();
        microsoftUser.setId(3L);
        microsoftUser.setName("Harsha");
        microsoftUser.setEmail("harsha@gmail.com");
        microsoftUser.setRole("COMPANY");

        microsoftCompany = new Company();
        microsoftCompany.setId(1L);
        microsoftCompany.setCompanyName("Microsoft");
        microsoftCompany.setUser(microsoftUser);

        // Perficient Company & Recruiter
        User perficientUser = new User();
        perficientUser.setId(2L);
        perficientUser.setName("Sai Charan");
        perficientUser.setEmail("saicharan@gmail.com");
        perficientUser.setRole("COMPANY");

        perficientCompany = new Company();
        perficientCompany.setId(2L);
        perficientCompany.setCompanyName("Perficient");
        perficientCompany.setUser(perficientUser);

        // Active Microsoft Job (Min CGPA = 7.00, Deadline = +30 days)
        activeMicrosoftJob = new Job();
        activeMicrosoftJob.setId(101L);
        activeMicrosoftJob.setTitle("Software Engineer");
        activeMicrosoftJob.setCompany(microsoftCompany);
        activeMicrosoftJob.setMinimumCgpa(new BigDecimal("7.00"));
        activeMicrosoftJob.setDeadline(LocalDate.now().plusDays(30));
        jobStore.put(101L, activeMicrosoftJob);

        // Expired Job (Deadline = -5 days ago)
        expiredJob = new Job();
        expiredJob.setId(102L);
        expiredJob.setTitle("Legacy Analyst");
        expiredJob.setCompany(microsoftCompany);
        expiredJob.setMinimumCgpa(new BigDecimal("6.00"));
        expiredJob.setDeadline(LocalDate.now().minusDays(5));
        jobStore.put(102L, expiredJob);

        // High CGPA Job (Min CGPA = 9.00 > Student's 8.00)
        highCgpaJob = new Job();
        highCgpaJob.setId(103L);
        highCgpaJob.setTitle("AI Research Scientist");
        highCgpaJob.setCompany(microsoftCompany);
        highCgpaJob.setMinimumCgpa(new BigDecimal("9.00"));
        highCgpaJob.setDeadline(LocalDate.now().plusDays(30));
        jobStore.put(103L, highCgpaJob);

        // Perficient Job
        perficientJob = new Job();
        perficientJob.setId(104L);
        perficientJob.setTitle("Cloud Consultant");
        perficientJob.setCompany(perficientCompany);
        perficientJob.setMinimumCgpa(new BigDecimal("7.00"));
        perficientJob.setDeadline(LocalDate.now().plusDays(30));
        jobStore.put(104L, perficientJob);

        // Repositories
        studentRepository = (StudentRepository) Proxy.newProxyInstance(
                StudentRepository.class.getClassLoader(),
                new Class<?>[]{StudentRepository.class},
                (proxy, method, args) -> {
                    if ("findById".equals(method.getName())) {
                        Long id = (Long) args[0];
                        return Optional.ofNullable(studentStore.get(id));
                    }
                    if ("findByUserEmail".equals(method.getName())) {
                        String email = (String) args[0];
                        if ("nitya@gmail.com".equalsIgnoreCase(email)) {
                            return Optional.of(nityaStudent);
                        }
                        return Optional.empty();
                    }
                    return null;
                }
        );

        jobRepository = (JobRepository) Proxy.newProxyInstance(
                JobRepository.class.getClassLoader(),
                new Class<?>[]{JobRepository.class},
                (proxy, method, args) -> {
                    if ("findById".equals(method.getName())) {
                        Long id = (Long) args[0];
                        return Optional.ofNullable(jobStore.get(id));
                    }
                    return null;
                }
        );

        applicationRepository = (ApplicationRepository) Proxy.newProxyInstance(
                ApplicationRepository.class.getClassLoader(),
                new Class<?>[]{ApplicationRepository.class},
                (proxy, method, args) -> {
                    if ("save".equals(method.getName())) {
                        Application a = (Application) args[0];
                        if (a.getId() == null) {
                            a.setId(appStore.size() + 1L);
                        }
                        appStore.put(a.getId(), a);
                        return a;
                    }
                    if ("findById".equals(method.getName())) {
                        Long id = (Long) args[0];
                        return Optional.ofNullable(appStore.get(id));
                    }
                    if ("existsByStudentIdAndJobId".equals(method.getName())) {
                        Long sId = (Long) args[0];
                        Long jId = (Long) args[1];
                        return appStore.values().stream()
                                .anyMatch(a -> a.getStudent() != null && a.getStudent().getId().equals(sId)
                                        && a.getJob() != null && a.getJob().getId().equals(jId));
                    }
                    if ("findByStudentUserEmail".equals(method.getName())) {
                        String email = (String) args[0];
                        return appStore.values().stream()
                                .filter(a -> a.getStudent() != null && a.getStudent().getUser() != null
                                        && email.equalsIgnoreCase(a.getStudent().getUser().getEmail()))
                                .toList();
                    }
                    if ("findByCompanyUserEmail".equals(method.getName())) {
                        String email = (String) args[0];
                        return appStore.values().stream()
                                .filter(a -> a.getJob() != null && a.getJob().getCompany() != null
                                        && a.getJob().getCompany().getUser() != null
                                        && email.equalsIgnoreCase(a.getJob().getCompany().getUser().getEmail()))
                                .toList();
                    }
                    if ("deleteById".equals(method.getName())) {
                        Long id = (Long) args[0];
                        appStore.remove(id);
                        return null;
                    }
                    return null;
                }
        );

        applicationService = new ApplicationService(applicationRepository, studentRepository, jobRepository);
        applicationController = new ApplicationController(applicationService);
    }

    @Test
    @DisplayName("67. Student applies to valid job -> 201 Created with PENDING status")
    void test67_StudentAppliesToValidJob_Created() {
        Application appReq = new Application();
        appReq.setJob(activeMicrosoftJob);

        ResponseEntity<Application> response = applicationController.createApplication(appReq, studentNityaAuth);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("PENDING", response.getBody().getStatus());
        assertEquals(activeMicrosoftJob.getId(), response.getBody().getJob().getId());
    }

    @Test
    @DisplayName("68. Student applies twice to same job -> Throws IllegalArgumentException (Rejected)")
    void test68_StudentAppliesTwice_Rejected() {
        Application app1 = new Application();
        app1.setJob(activeMicrosoftJob);
        applicationController.createApplication(app1, studentNityaAuth);

        Application app2 = new Application();
        app2.setJob(activeMicrosoftJob);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            applicationController.createApplication(app2, studentNityaAuth);
        });
        assertEquals("Student has already applied for this job", ex.getMessage());
    }

    @Test
    @DisplayName("69. Apply after deadline -> Throws IllegalArgumentException (Rejected)")
    void test69_ApplyAfterDeadline_Rejected() {
        Application app = new Application();
        app.setJob(expiredJob);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            applicationController.createApplication(app, studentNityaAuth);
        });
        assertEquals("Application deadline has passed", ex.getMessage());
    }

    @Test
    @DisplayName("70. CGPA below minimum -> Throws IllegalArgumentException (Rejected)")
    void test70_CgpaBelowMinimum_Rejected() {
        Application app = new Application();
        app.setJob(highCgpaJob); // Requires 9.00, student has 8.00

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            applicationController.createApplication(app, studentNityaAuth);
        });
        assertEquals("Student does not meet the minimum CGPA requirement", ex.getMessage());
    }

    @Test
    @DisplayName("71. CGPA exactly minimum -> Allowed (201 Created)")
    void test71_CgpaExactlyMinimum_Allowed() {
        Job exactCgpaJob = new Job();
        exactCgpaJob.setId(105L);
        exactCgpaJob.setTitle("DevOps Lead");
        exactCgpaJob.setCompany(microsoftCompany);
        exactCgpaJob.setMinimumCgpa(new BigDecimal("8.00")); // Exactly 8.00
        exactCgpaJob.setDeadline(LocalDate.now().plusDays(20));
        jobStore.put(105L, exactCgpaJob);

        Application app = new Application();
        app.setJob(exactCgpaJob);

        ResponseEntity<Application> response = applicationController.createApplication(app, studentNityaAuth);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    @DisplayName("72. Student views own applications (GET /api/applications/my -> 200 OK)")
    void test72_StudentViewsOwnApplications_Allowed() {
        Application app = new Application();
        app.setJob(activeMicrosoftJob);
        applicationController.createApplication(app, studentNityaAuth);

        ResponseEntity<List<Application>> response = applicationController.getMyApplications(studentNityaAuth);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
    }

    @Test
    @DisplayName("73. Student views all applications -> Throws AccessDeniedException (403 Forbidden)")
    void test73_StudentViewsAllApplications_Forbidden() {
        assertThrows(AccessDeniedException.class, () -> {
            applicationController.getAllApplications(studentNityaAuth);
        });
    }

    @Test
    @DisplayName("74. Student changes status -> Returns 403 Forbidden")
    void test74_StudentChangesStatus_Forbidden() {
        Application app = new Application();
        app.setJob(activeMicrosoftJob);
        applicationController.createApplication(app, studentNityaAuth);

        ResponseEntity<?> response = applicationController.updateApplicationStatus(
                1L,
                Map.of("status", "ACCEPTED"),
                studentNityaAuth
        );
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

    @Test
    @DisplayName("75. Student deletes application -> Returns 403 Forbidden")
    void test75_StudentDeletesApplication_Forbidden() {
        Application app = new Application();
        app.setJob(activeMicrosoftJob);
        applicationController.createApplication(app, studentNityaAuth);

        ResponseEntity<Void> response = applicationController.deleteApplication(1L, studentNityaAuth);
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

    @Test
    @DisplayName("76. Company changes own applicant status -> Allowed (200 OK)")
    void test76_CompanyChangesOwnApplicantStatus_Allowed() {
        Application app = new Application();
        app.setJob(activeMicrosoftJob);
        applicationController.createApplication(app, studentNityaAuth);

        ResponseEntity<?> response = applicationController.updateApplicationStatus(
                1L,
                Map.of("status", "ACCEPTED"),
                companyMicrosoftAuth
        );
        assertEquals(HttpStatus.OK, response.getStatusCode());
        Application updated = (Application) response.getBody();
        assertEquals("ACCEPTED", updated.getStatus());
    }

    @Test
    @DisplayName("77. Company changes another company's application -> Returns 403 Forbidden")
    void test77_CompanyChangesAnotherCompanyApplication_Forbidden() {
        Application app = new Application();
        app.setJob(perficientJob); // Belongs to Perficient (Sai Charan)
        applicationController.createApplication(app, studentNityaAuth);

        // Microsoft (Harsha) tries to update Perficient's application
        ResponseEntity<?> response = applicationController.updateApplicationStatus(
                1L,
                Map.of("status", "REJECTED"),
                companyMicrosoftAuth
        );
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

    @Test
    @DisplayName("78. Company deletes another company's application -> Returns 403 Forbidden")
    void test78_CompanyDeletesAnotherCompanyApplication_Forbidden() {
        Application app = new Application();
        app.setJob(perficientJob); // Belongs to Perficient
        applicationController.createApplication(app, studentNityaAuth);

        // Microsoft (Harsha) tries to delete Perficient's application
        ResponseEntity<Void> response = applicationController.deleteApplication(1L, companyMicrosoftAuth);
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertNotNull(appStore.get(1L)); // Still in store
    }

    @Test
    @DisplayName("79. Company views appropriate applications -> Returns only applications for company's jobs (200 OK)")
    void test79_CompanyViewsAppropriateApplications_Success() {
        // Microsoft job application
        Application app1 = new Application();
        app1.setJob(activeMicrosoftJob);
        applicationController.createApplication(app1, studentNityaAuth);

        // Perficient job application
        Application app2 = new Application();
        app2.setJob(perficientJob);
        applicationController.createApplication(app2, studentNityaAuth);

        List<Application> microsoftApps = applicationController.getAllApplications(companyMicrosoftAuth);
        assertEquals(1, microsoftApps.size());
        assertEquals("Microsoft", microsoftApps.get(0).getJob().getCompany().getCompanyName());

        List<Application> perficientApps = applicationController.getAllApplications(companyPerficientAuth);
        assertEquals(1, perficientApps.size());
        assertEquals("Perficient", perficientApps.get(0).getJob().getCompany().getCompanyName());
    }

    @Test
    @DisplayName("80. Nonexistent application ID -> Returns 404 Not Found")
    void test80_NonexistentApplicationId_Returns404() {
        ResponseEntity<Application> response = applicationController.getApplicationById(99999L);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }
}
