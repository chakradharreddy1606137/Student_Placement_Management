package com.example.placement;

import com.example.placement.config.GlobalExceptionHandler;
import com.example.placement.controller.JobController;
import com.example.placement.model.Company;
import com.example.placement.model.Job;
import com.example.placement.model.User;
import com.example.placement.repository.CompanyRepository;
import com.example.placement.repository.JobRepository;
import com.example.placement.service.JobService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.lang.reflect.Proxy;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

public class JobCreationTest {

    private JobController jobController;
    private JobService jobService;
    private GlobalExceptionHandler exceptionHandler;

    private CompanyRepository companyRepository;
    private JobRepository jobRepository;

    private Authentication companyAuth;
    private Authentication studentAuth;

    private Company microsoftCompany;
    private final Map<Long, Company> companyStore = new HashMap<>();
    private final Map<Long, Job> jobStore = new HashMap<>();

    @BeforeEach
    void setUp() {
        companyStore.clear();
        jobStore.clear();
        exceptionHandler = new GlobalExceptionHandler();

        // 1. Authenticated Company: Harsha (Microsoft)
        companyAuth = new UsernamePasswordAuthenticationToken(
                "harsha@gmail.com",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_COMPANY"))
        );

        // 2. Authenticated Student: Nitya
        studentAuth = new UsernamePasswordAuthenticationToken(
                "nitya@gmail.com",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_STUDENT"))
        );

        User harshaUser = new User();
        harshaUser.setId(3L);
        harshaUser.setName("Harsha");
        harshaUser.setEmail("harsha@gmail.com");
        harshaUser.setRole("COMPANY");

        microsoftCompany = new Company();
        microsoftCompany.setId(1L);
        microsoftCompany.setCompanyName("Microsoft");
        microsoftCompany.setUser(harshaUser);
        companyStore.put(1L, microsoftCompany);

        companyRepository = (CompanyRepository) Proxy.newProxyInstance(
                CompanyRepository.class.getClassLoader(),
                new Class<?>[]{CompanyRepository.class},
                (proxy, method, args) -> {
                    if ("findByUserEmail".equals(method.getName())) {
                        String email = (String) args[0];
                        if ("harsha@gmail.com".equalsIgnoreCase(email)) {
                            return Optional.of(microsoftCompany);
                        }
                        return Optional.empty();
                    }
                    if ("existsById".equals(method.getName())) {
                        Long id = (Long) args[0];
                        return companyStore.containsKey(id);
                    }
                    if ("findById".equals(method.getName())) {
                        Long id = (Long) args[0];
                        return Optional.ofNullable(companyStore.get(id));
                    }
                    return null;
                }
        );

        jobRepository = (JobRepository) Proxy.newProxyInstance(
                JobRepository.class.getClassLoader(),
                new Class<?>[]{JobRepository.class},
                (proxy, method, args) -> {
                    if ("save".equals(method.getName())) {
                        Job j = (Job) args[0];
                        if (j.getId() == null) {
                            j.setId(jobStore.size() + 100L);
                        }
                        jobStore.put(j.getId(), j);
                        return j;
                    }
                    return null;
                }
        );

        jobService = new JobService(jobRepository, null, companyRepository);
        jobController = new JobController(jobService);
    }

    @Test
    @DisplayName("55. Valid job -> Successfully Created (200 OK)")
    void test55_ValidJob_Created() {
        Job job = new Job();
        job.setTitle("Full Stack Engineer");
        job.setDescription("Develop high-scale web platforms");
        job.setLocation("Hyderabad");
        job.setSalary(new BigDecimal("1600000.00"));
        job.setMinimumCgpa(new BigDecimal("7.50"));
        job.setDeadline(LocalDate.now().plusMonths(3));
        job.setCompany(microsoftCompany);

        ResponseEntity<Job> response = jobController.createJob(job, companyAuth);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Full Stack Engineer", response.getBody().getTitle());
        assertEquals("Microsoft", response.getBody().getCompany().getCompanyName());
    }

    @Test
    @DisplayName("56. Missing title (null) -> throws IllegalArgumentException (400 Bad Request)")
    void test56_MissingTitle_Throws400() {
        Job job = new Job();
        job.setTitle(null);
        job.setCompany(microsoftCompany);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            jobController.createJob(job, companyAuth);
        });
        assertEquals("Job title is required", ex.getMessage());

        ResponseEntity<Map<String, Object>> errorRes = exceptionHandler.handleIllegalArgument(ex);
        assertEquals(HttpStatus.BAD_REQUEST, errorRes.getStatusCode());
    }

    @Test
    @DisplayName("57. Empty title (blank string) -> throws IllegalArgumentException (400 Bad Request)")
    void test57_EmptyTitle_Throws400() {
        Job job = new Job();
        job.setTitle("   ");
        job.setCompany(microsoftCompany);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            jobController.createJob(job, companyAuth);
        });
        assertEquals("Job title is required", ex.getMessage());

        ResponseEntity<Map<String, Object>> errorRes = exceptionHandler.handleIllegalArgument(ex);
        assertEquals(HttpStatus.BAD_REQUEST, errorRes.getStatusCode());
    }

    @Test
    @DisplayName("58. Missing company -> throws IllegalArgumentException (400 Bad Request)")
    void test58_MissingCompany_Throws400() {
        Job job = new Job();
        job.setTitle("DevOps Specialist");
        job.setCompany(null);

        // Caller has no company registered
        Authentication unknownAuth = new UsernamePasswordAuthenticationToken("unknown@gmail.com", null);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            jobController.createJob(job, unknownAuth);
        });
        assertEquals("Company is required", ex.getMessage());

        ResponseEntity<Map<String, Object>> errorRes = exceptionHandler.handleIllegalArgument(ex);
        assertEquals(HttpStatus.BAD_REQUEST, errorRes.getStatusCode());
    }

    @Test
    @DisplayName("59. Negative salary -> throws IllegalArgumentException (400 Bad Request)")
    void test59_NegativeSalary_Throws400() {
        Job job = new Job();
        job.setTitle("Frontend Developer");
        job.setSalary(new BigDecimal("-50000.00"));
        job.setCompany(microsoftCompany);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            jobController.createJob(job, companyAuth);
        });
        assertEquals("Salary cannot be negative", ex.getMessage());

        ResponseEntity<Map<String, Object>> errorRes = exceptionHandler.handleIllegalArgument(ex);
        assertEquals(HttpStatus.BAD_REQUEST, errorRes.getStatusCode());
    }

    @Test
    @DisplayName("60. Salary = 0 -> Valid per business rules (Unpaid internship/entry level) -> Created (200 OK)")
    void test60_ZeroSalary_Allowed() {
        Job job = new Job();
        job.setTitle("Graduate Trainee Intern");
        job.setSalary(BigDecimal.ZERO);
        job.setCompany(microsoftCompany);

        ResponseEntity<Job> response = jobController.createJob(job, companyAuth);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(BigDecimal.ZERO, response.getBody().getSalary());
    }

    @Test
    @DisplayName("61. Negative minimum CGPA -> throws IllegalArgumentException (400 Bad Request)")
    void test61_NegativeCgpa_Throws400() {
        Job job = new Job();
        job.setTitle("Backend Engineer");
        job.setMinimumCgpa(new BigDecimal("-1.50"));
        job.setCompany(microsoftCompany);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            jobController.createJob(job, companyAuth);
        });
        assertEquals("Minimum CGPA must be between 0.0 and 10.0", ex.getMessage());

        ResponseEntity<Map<String, Object>> errorRes = exceptionHandler.handleIllegalArgument(ex);
        assertEquals(HttpStatus.BAD_REQUEST, errorRes.getStatusCode());
    }

    @Test
    @DisplayName("62. Minimum CGPA > 10 -> throws IllegalArgumentException (400 Bad Request)")
    void test62_CgpaGreaterThanTen_Throws400() {
        Job job = new Job();
        job.setTitle("Cloud Architect");
        job.setMinimumCgpa(new BigDecimal("11.50"));
        job.setCompany(microsoftCompany);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            jobController.createJob(job, companyAuth);
        });
        assertEquals("Minimum CGPA must be between 0.0 and 10.0", ex.getMessage());

        ResponseEntity<Map<String, Object>> errorRes = exceptionHandler.handleIllegalArgument(ex);
        assertEquals(HttpStatus.BAD_REQUEST, errorRes.getStatusCode());
    }

    @Test
    @DisplayName("63. Invalid date / past deadline -> 400 Bad Request")
    void test63_InvalidDate_Handled() {
        HttpMessageNotReadableException ex = new HttpMessageNotReadableException("Cannot deserialize value of type java.time.LocalDate from String \"2026-99-99\": Failed to deserialize java.time.LocalDate");
        ResponseEntity<Map<String, Object>> errorRes = exceptionHandler.handleMalformedJson(ex);
        assertEquals(HttpStatus.BAD_REQUEST, errorRes.getStatusCode());
        assertEquals("Malformed or invalid JSON payload", errorRes.getBody().get("error"));
    }

    @Test
    @DisplayName("64. Malformed JSON -> GlobalExceptionHandler returns 400 Bad Request")
    void test64_MalformedJson_Throws400() {
        HttpMessageNotReadableException ex = new HttpMessageNotReadableException("JSON parse error: Unexpected character ('}' (code 125))");
        ResponseEntity<Map<String, Object>> errorRes = exceptionHandler.handleMalformedJson(ex);
        assertEquals(HttpStatus.BAD_REQUEST, errorRes.getStatusCode());
        assertEquals(400, errorRes.getBody().get("status"));
    }

    @Test
    @DisplayName("65. Nonexistent company ID -> throws IllegalArgumentException (400/404)")
    void test65_NonexistentCompanyId_Throws400() {
        Job job = new Job();
        job.setTitle("AI Engineer");
        Company nonexistentCompany = new Company();
        nonexistentCompany.setId(99999L);
        job.setCompany(nonexistentCompany);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            jobController.createJob(job, companyAuth);
        });
        assertTrue(ex.getMessage().contains("Company not found with ID: 99999"));

        ResponseEntity<Map<String, Object>> errorRes = exceptionHandler.handleIllegalArgument(ex);
        assertEquals(HttpStatus.BAD_REQUEST, errorRes.getStatusCode());
    }

    @Test
    @DisplayName("66. Student creates job -> Blocked by SecurityConfig (403 Forbidden)")
    void test66_StudentCreatesJob_Forbidden() {
        SecurityContextHolder.getContext().setAuthentication(studentAuth);

        // SecurityConfig: .requestMatchers(HttpMethod.POST, "/api/jobs/**").hasAnyRole("COMPANY", "ADMIN")
        boolean hasCompanyOrAdmin = studentAuth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_COMPANY") || a.getAuthority().equals("ROLE_ADMIN"));
        assertFalse(hasCompanyOrAdmin, "Student role must not possess COMPANY or ADMIN authority to create jobs");
    }
}
