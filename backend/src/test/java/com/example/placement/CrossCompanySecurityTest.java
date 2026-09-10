package com.example.placement;

import com.example.placement.controller.ApplicationController;
import com.example.placement.controller.JobController;
import com.example.placement.model.Application;
import com.example.placement.model.Company;
import com.example.placement.model.Job;
import com.example.placement.model.Student;
import com.example.placement.model.User;
import com.example.placement.repository.ApplicationRepository;
import com.example.placement.repository.CompanyRepository;
import com.example.placement.repository.JobRepository;
import com.example.placement.repository.StudentRepository;
import com.example.placement.service.ApplicationService;
import com.example.placement.service.JobService;
import org.junit.jupiter.api.AfterEach;
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

public class CrossCompanySecurityTest {

    private ApplicationController applicationController;
    private JobController jobController;

    private ApplicationService applicationService;
    private JobService jobService;

    private ApplicationRepository applicationRepository;
    private JobRepository jobRepository;
    private StudentRepository studentRepository;
    private CompanyRepository companyRepository;

    private Authentication companyAAuth; // Company A (Microsoft / Harsha)
    private Authentication companyBAuth; // Company B (Perficient / Sai Charan)

    private Company companyA;
    private Company companyB;
    private Job jobA;
    private Job jobB;
    private Application applicationA;
    private Application applicationB;
    private Student testStudent;

    private final Map<Long, Application> appStore = new HashMap<>();
    private final Map<Long, Job> jobStore = new HashMap<>();
    private final Map<Long, Company> companyStore = new HashMap<>();
    private final Map<Long, Student> studentStore = new HashMap<>();

    @BeforeEach
    void setUp() {
        appStore.clear();
        jobStore.clear();
        companyStore.clear();
        studentStore.clear();

        // 1. Company A: Microsoft (harsha@gmail.com)
        companyAAuth = new UsernamePasswordAuthenticationToken(
                "companyA@gmail.com",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_COMPANY"))
        );

        User userA = new User();
        userA.setId(101L);
        userA.setName("Company A Recruiter");
        userA.setEmail("companyA@gmail.com");
        userA.setRole("COMPANY");

        companyA = new Company();
        companyA.setId(1L);
        companyA.setCompanyName("Company A");
        companyA.setUser(userA);
        companyStore.put(1L, companyA);

        // 2. Company B: Perficient (saicharan@gmail.com)
        companyBAuth = new UsernamePasswordAuthenticationToken(
                "companyB@gmail.com",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_COMPANY"))
        );

        User userB = new User();
        userB.setId(102L);
        userB.setName("Company B Recruiter");
        userB.setEmail("companyB@gmail.com");
        userB.setRole("COMPANY");

        companyB = new Company();
        companyB.setId(2L);
        companyB.setCompanyName("Company B");
        companyB.setUser(userB);
        companyStore.put(2L, companyB);

        // 3. Test Student
        User studentUser = new User();
        studentUser.setId(201L);
        studentUser.setName("Test Student");
        studentUser.setEmail("student@gmail.com");
        studentUser.setRole("STUDENT");

        testStudent = new Student();
        testStudent.setId(1L);
        testStudent.setUser(studentUser);
        testStudent.setCgpa(new BigDecimal("8.50"));
        studentStore.put(1L, testStudent);

        // 4. Job A -> Company A
        jobA = new Job();
        jobA.setId(11L);
        jobA.setTitle("Job A");
        jobA.setCompany(companyA);
        jobA.setSalary(new BigDecimal("1200000.00"));
        jobA.setMinimumCgpa(new BigDecimal("7.00"));
        jobA.setDeadline(LocalDate.now().plusDays(30));
        jobStore.put(11L, jobA);

        // 5. Job B -> Company B
        jobB = new Job();
        jobB.setId(22L);
        jobB.setTitle("Job B");
        jobB.setCompany(companyB);
        jobB.setSalary(new BigDecimal("1400000.00"));
        jobB.setMinimumCgpa(new BigDecimal("7.00"));
        jobB.setDeadline(LocalDate.now().plusDays(30));
        jobStore.put(22L, jobB);

        // 6. Application A -> Job A (Company A)
        applicationA = new Application();
        applicationA.setId(1001L);
        applicationA.setJob(jobA);
        applicationA.setStudent(testStudent);
        applicationA.setStatus("PENDING");
        appStore.put(1001L, applicationA);

        // 7. Application B -> Job B (Company B)
        applicationB = new Application();
        applicationB.setId(1002L);
        applicationB.setJob(jobB);
        applicationB.setStudent(testStudent);
        applicationB.setStatus("PENDING");
        appStore.put(1002L, applicationB);

        // Mock Repositories
        applicationRepository = (ApplicationRepository) Proxy.newProxyInstance(
                ApplicationRepository.class.getClassLoader(),
                new Class<?>[]{ApplicationRepository.class},
                (proxy, method, args) -> {
                    if ("findById".equals(method.getName())) {
                        Long id = (Long) args[0];
                        return Optional.ofNullable(appStore.get(id));
                    }
                    if ("save".equals(method.getName())) {
                        Application a = (Application) args[0];
                        appStore.put(a.getId(), a);
                        return a;
                    }
                    if ("deleteById".equals(method.getName())) {
                        Long id = (Long) args[0];
                        appStore.remove(id);
                        return null;
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
                    if ("delete".equals(method.getName())) {
                        Job j = (Job) args[0];
                        jobStore.remove(j.getId());
                        return null;
                    }
                    return null;
                }
        );

        studentRepository = (StudentRepository) Proxy.newProxyInstance(
                StudentRepository.class.getClassLoader(),
                new Class<?>[]{StudentRepository.class},
                (proxy, method, args) -> null
        );

        companyRepository = (CompanyRepository) Proxy.newProxyInstance(
                CompanyRepository.class.getClassLoader(),
                new Class<?>[]{CompanyRepository.class},
                (proxy, method, args) -> null
        );

        applicationService = new ApplicationService(applicationRepository, studentRepository, jobRepository);
        jobService = new JobService(jobRepository, applicationRepository, companyRepository);

        applicationController = new ApplicationController(applicationService);
        jobController = new JobController(jobService);
    }

    @AfterEach
    void tearDown() {
        // Explicitly clean up and purge all test data used for Section 9 tests
        appStore.clear();
        jobStore.clear();
        companyStore.clear();
        studentStore.clear();
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("81. Company A modifies A's application -> Allowed (200 OK)")
    void test81_CompanyAModifiesOwnApplication_Allowed() {
        ResponseEntity<?> response = applicationController.updateApplicationStatus(
                1001L,
                Map.of("status", "SHORTLISTED"),
                companyAAuth
        );
        assertEquals(HttpStatus.OK, response.getStatusCode());
        Application updated = (Application) response.getBody();
        assertEquals("SHORTLISTED", updated.getStatus());
        assertEquals("SHORTLISTED", appStore.get(1001L).getStatus());
    }

    @Test
    @DisplayName("82. Company B modifies B's application -> Allowed (200 OK)")
    void test82_CompanyBModifiesOwnApplication_Allowed() {
        ResponseEntity<?> response = applicationController.updateApplicationStatus(
                1002L,
                Map.of("status", "ACCEPTED"),
                companyBAuth
        );
        assertEquals(HttpStatus.OK, response.getStatusCode());
        Application updated = (Application) response.getBody();
        assertEquals("ACCEPTED", updated.getStatus());
        assertEquals("ACCEPTED", appStore.get(1002L).getStatus());
    }

    @Test
    @DisplayName("83. Company A modifies B's application -> Forbidden (403)")
    void test83_CompanyAModifiesCompanyBApplication_Forbidden() {
        ResponseEntity<?> response = applicationController.updateApplicationStatus(
                1002L, // Application B belongs to Company B
                Map.of("status", "REJECTED"),
                companyAAuth // Called by Company A
        );
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("PENDING", appStore.get(1002L).getStatus()); // Status unchanged
    }

    @Test
    @DisplayName("84. Company B modifies A's application -> Forbidden (403)")
    void test84_CompanyBModifiesCompanyAApplication_Forbidden() {
        ResponseEntity<?> response = applicationController.updateApplicationStatus(
                1001L, // Application A belongs to Company A
                Map.of("status", "REJECTED"),
                companyBAuth // Called by Company B
        );
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("PENDING", appStore.get(1001L).getStatus()); // Status unchanged
    }

    @Test
    @DisplayName("85. Company A deletes B's application -> Forbidden (403)")
    void test85_CompanyADeletesCompanyBApplication_Forbidden() {
        ResponseEntity<Void> response = applicationController.deleteApplication(
                1002L, // Application B
                companyAAuth // Called by Company A
        );
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertNotNull(appStore.get(1002L)); // Not deleted
    }

    @Test
    @DisplayName("86. Company B deletes A's application -> Forbidden (403)")
    void test86_CompanyBDeletesCompanyAApplication_Forbidden() {
        ResponseEntity<Void> response = applicationController.deleteApplication(
                1001L, // Application A
                companyBAuth // Called by Company B
        );
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertNotNull(appStore.get(1001L)); // Not deleted
    }

    @Test
    @DisplayName("87. Company A deletes B's job -> Throws AccessDeniedException (403)")
    void test87_CompanyADeletesCompanyBJob_Forbidden() {
        assertThrows(AccessDeniedException.class, () -> {
            jobController.deleteJob(22L, companyAAuth); // Job B belongs to Company B
        });
        assertNotNull(jobStore.get(22L)); // Job B remains untouched
    }

    @Test
    @DisplayName("88. Company B deletes A's job -> Throws AccessDeniedException (403)")
    void test88_CompanyBDeletesCompanyAJob_Forbidden() {
        assertThrows(AccessDeniedException.class, () -> {
            jobController.deleteJob(11L, companyBAuth); // Job A belongs to Company A
        });
        assertNotNull(jobStore.get(11L)); // Job A remains untouched
    }
}
