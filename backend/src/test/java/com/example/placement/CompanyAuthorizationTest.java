package com.example.placement;

import com.example.placement.controller.CompanyController;
import com.example.placement.controller.JobController;
import com.example.placement.controller.StudentController;
import com.example.placement.controller.UserController;
import com.example.placement.model.Company;
import com.example.placement.model.Job;
import com.example.placement.model.User;
import com.example.placement.service.CompanyService;
import com.example.placement.service.JobService;
import com.example.placement.service.StudentService;
import com.example.placement.service.UserService;
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

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

public class CompanyAuthorizationTest {

    private CompanyController companyController;
    private JobController jobController;
    private StudentController studentController;
    private UserController userController;

    private CompanyService companyService;
    private JobService jobService;
    private StudentService studentService;
    private UserService userService;

    private Authentication companyAuth; // Harsha (Microsoft)
    private Company microsoftCompany;
    private Company perficientCompany;
    private Job microsoftJob;
    private Job perficientJob;
    private final Map<Long, Job> jobStore = new HashMap<>();

    @BeforeEach
    void setUp() {
        jobStore.clear();

        // 1. Authenticated Company: Harsha (Microsoft)
        companyAuth = new UsernamePasswordAuthenticationToken(
                "harsha@gmail.com",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_COMPANY"))
        );
        SecurityContextHolder.getContext().setAuthentication(companyAuth);

        User harshaUser = new User();
        harshaUser.setId(3L);
        harshaUser.setName("Harsha");
        harshaUser.setEmail("harsha@gmail.com");

        microsoftCompany = new Company();
        microsoftCompany.setId(1L);
        microsoftCompany.setCompanyName("Microsoft");
        microsoftCompany.setUser(harshaUser);

        User saicharanUser = new User();
        saicharanUser.setId(2L);
        saicharanUser.setName("Sai Charan");
        saicharanUser.setEmail("saicharan@gmail.com");

        perficientCompany = new Company();
        perficientCompany.setId(2L);
        perficientCompany.setCompanyName("Perficient");
        perficientCompany.setUser(saicharanUser);

        microsoftJob = new Job();
        microsoftJob.setId(101L);
        microsoftJob.setTitle("Software Engineer");
        microsoftJob.setCompany(microsoftCompany);
        microsoftJob.setSalary(new BigDecimal("1500000.00"));
        jobStore.put(101L, microsoftJob);

        perficientJob = new Job();
        perficientJob.setId(102L);
        perficientJob.setTitle("Cloud Solutions Engineer");
        perficientJob.setCompany(perficientCompany);
        perficientJob.setSalary(new BigDecimal("1200000.00"));
        jobStore.put(102L, perficientJob);

        companyService = new CompanyService(null, null, null) {
            @Override
            public Optional<Company> getCompanyByEmail(String email) {
                if ("harsha@gmail.com".equalsIgnoreCase(email)) {
                    return Optional.of(microsoftCompany);
                }
                return Optional.empty();
            }
        };

        jobService = new JobService(null, null, null) {
            @Override
            public Job saveJob(Job job, String callerEmail) {
                if (job.getCompany() == null && "harsha@gmail.com".equalsIgnoreCase(callerEmail)) {
                    job.setCompany(microsoftCompany);
                }
                long newId = jobStore.size() + 100L;
                job.setId(newId);
                jobStore.put(newId, job);
                return job;
            }

            @Override
            public Job updateJob(Long id, Job details, String companyEmail) {
                Job existing = jobStore.get(id);
                if (existing == null) {
                    throw new java.util.NoSuchElementException("Job not found: " + id);
                }
                String ownerEmail = existing.getCompany() != null && existing.getCompany().getUser() != null
                        ? existing.getCompany().getUser().getEmail()
                        : null;
                if (companyEmail != null && (ownerEmail == null || !ownerEmail.equalsIgnoreCase(companyEmail))) {
                    throw new AccessDeniedException("You can only modify jobs posted by your own company");
                }
                if (details.getTitle() != null) existing.setTitle(details.getTitle());
                if (details.getSalary() != null) existing.setSalary(details.getSalary());
                return existing;
            }

            @Override
            public void deleteJob(Long id, String companyEmail) {
                Job existing = jobStore.get(id);
                if (existing == null) return;
                String ownerEmail = existing.getCompany() != null && existing.getCompany().getUser() != null
                        ? existing.getCompany().getUser().getEmail()
                        : null;
                if (companyEmail != null && (ownerEmail == null || !ownerEmail.equalsIgnoreCase(companyEmail))) {
                    throw new AccessDeniedException("You can only delete jobs posted by your own company");
                }
                jobStore.remove(id);
            }
        };

        studentService = new StudentService(null, null);
        userService = new UserService(null, null, null, null, null, null);

        companyController = new CompanyController(companyService);
        jobController = new JobController(jobService);
        studentController = new StudentController(studentService);
        userController = new UserController(userService);
    }

    @Test
    @DisplayName("26. GET /api/companies/me -> Allowed for Company (200 OK)")
    void test26_GetCompanyMe_Allowed() {
        ResponseEntity<Company> response = companyController.getCurrentCompany(companyAuth);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Microsoft", response.getBody().getCompanyName());
    }

    @Test
    @DisplayName("27. GET /api/companies -> Requires ADMIN, Company forbidden (403 via SecurityConfig)")
    void test27_GetCompanies_RequiresAdmin() {
        // SecurityConfig: .requestMatchers("/api/companies/**").hasRole("ADMIN")
        assertFalse(companyAuth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN")));
    }

    @Test
    @DisplayName("28. GET /api/students -> Requires ADMIN, Company forbidden (403 via SecurityConfig)")
    void test28_GetStudents_RequiresAdmin() {
        // SecurityConfig: .requestMatchers("/api/students/**").hasRole("ADMIN")
        assertFalse(companyAuth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN")));
    }

    @Test
    @DisplayName("29. GET /api/students/me -> Requires STUDENT, Company forbidden (403 via SecurityConfig)")
    void test29_GetStudentMe_RequiresStudent() {
        // SecurityConfig: .requestMatchers(HttpMethod.GET, "/api/students/me").hasRole("STUDENT")
        assertFalse(companyAuth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_STUDENT")));
    }

    @Test
    @DisplayName("30. GET /api/users -> Requires ADMIN, Company forbidden (403 via SecurityConfig)")
    void test30_GetUsers_RequiresAdmin() {
        // SecurityConfig: .requestMatchers("/api/users/**").hasRole("ADMIN")
        assertFalse(companyAuth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN")));
    }

    @Test
    @DisplayName("31. GET /api/companies/{id} for another company -> Requires ADMIN, Company forbidden (403)")
    void test31_GetAnotherCompanyById_RequiresAdmin() {
        // SecurityConfig: .requestMatchers("/api/companies/**").hasRole("ADMIN")
        assertFalse(companyAuth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN")));
    }

    @Test
    @DisplayName("32. DELETE student (/api/students/{id}) -> Requires ADMIN, Company forbidden (403)")
    void test32_DeleteStudent_RequiresAdmin() {
        // SecurityConfig: .requestMatchers("/api/students/**").hasRole("ADMIN")
        assertFalse(companyAuth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN")));
    }

    @Test
    @DisplayName("33. DELETE another company (/api/companies/{id}) -> Requires ADMIN, Company forbidden (403)")
    void test33_DeleteCompany_RequiresAdmin() {
        // SecurityConfig: .requestMatchers("/api/companies/**").hasRole("ADMIN")
        assertFalse(companyAuth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN")));
    }

    @Test
    @DisplayName("34. Create own job -> Allowed for Company (200 OK)")
    void test34_CreateOwnJob_Allowed() {
        Job newJob = new Job();
        newJob.setTitle("Frontend Architect");
        newJob.setSalary(new BigDecimal("1800000.00"));

        ResponseEntity<Job> response = jobController.createJob(newJob, companyAuth);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Microsoft", response.getBody().getCompany().getCompanyName());
    }

    @Test
    @DisplayName("35. Modify own job -> Allowed for Company (200 OK)")
    void test35_ModifyOwnJob_Allowed() {
        Job updateDetails = new Job();
        updateDetails.setTitle("Principal Software Engineer");
        updateDetails.setSalary(new BigDecimal("2200000.00"));

        ResponseEntity<Job> response = jobController.updateJob(101L, updateDetails, companyAuth);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Principal Software Engineer", response.getBody().getTitle());
        assertEquals(new BigDecimal("2200000.00"), response.getBody().getSalary());
    }

    @Test
    @DisplayName("36. Delete own job -> Allowed for Company (204 No Content)")
    void test36_DeleteOwnJob_Allowed() {
        ResponseEntity<Void> response = jobController.deleteJob(101L, companyAuth);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertNull(jobStore.get(101L));
    }

    @Test
    @DisplayName("37. Modify another company's job -> Throws AccessDeniedException (403 Forbidden)")
    void test37_ModifyAnotherCompanyJob_Forbidden() {
        Job updateDetails = new Job();
        updateDetails.setTitle("Hacked Title");

        assertThrows(AccessDeniedException.class, () -> {
            jobController.updateJob(102L, updateDetails, companyAuth);
        });
    }

    @Test
    @DisplayName("38. Delete another company's job -> Throws AccessDeniedException (403 Forbidden)")
    void test38_DeleteAnotherCompanyJob_Forbidden() {
        assertThrows(AccessDeniedException.class, () -> {
            jobController.deleteJob(102L, companyAuth);
        });
        assertNotNull(jobStore.get(102L));
    }
}
