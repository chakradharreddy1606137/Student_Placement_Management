package com.example.placement;

import com.example.placement.controller.*;
import com.example.placement.model.Application;
import com.example.placement.model.Company;
import com.example.placement.model.Job;
import com.example.placement.model.Student;
import com.example.placement.model.User;
import com.example.placement.service.*;
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

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

public class StudentAuthorizationTest {

    private StudentController studentController;
    private ApplicationController applicationController;
    private UserController userController;
    private CompanyController companyController;
    private JobController jobController;

    private StudentService studentService;
    private ApplicationService applicationService;
    private UserService userService;
    private CompanyService companyService;
    private JobService jobService;

    private Authentication studentAuth;

    @BeforeEach
    void setUp() {
        // Authenticated Student (Nitya)
        studentAuth = new UsernamePasswordAuthenticationToken(
                "nitya@gmail.com",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_STUDENT"))
        );
        SecurityContextHolder.getContext().setAuthentication(studentAuth);

        studentService = new StudentService(null, null) {
            @Override
            public Optional<Student> getStudentByEmail(String email) {
                Student s = new Student();
                s.setId(10L);
                return Optional.of(s);
            }
            @Override
            public Optional<Student> getStudentById(Long id) {
                Student s = new Student();
                s.setId(id);
                return Optional.of(s);
            }
            @Override
            public List<Student> getAllStudents() {
                return List.of(new Student());
            }
        };

        applicationService = new ApplicationService(null, null, null) {
            @Override
            public List<Application> getApplicationsByStudentEmail(String email) {
                return List.of(new Application());
            }
            @Override
            public List<Application> getAllApplications() {
                return List.of(new Application());
            }
        };

        userService = new UserService(null, null, null, null, null, null) {
            @Override
            public List<User> getAllUsers() {
                return List.of(new User());
            }
        };

        companyService = new CompanyService(null, null, null) {
            @Override
            public Optional<Company> getCompanyByEmail(String email) {
                return Optional.empty(); // Student has no company profile
            }
            @Override
            public List<Company> getAllCompanies() {
                return List.of(new Company());
            }
        };

        jobService = new JobService(null, null, null) {
            @Override
            public List<Job> getAllJobs() {
                return List.of(new Job());
            }
        };

        studentController = new StudentController(studentService);
        applicationController = new ApplicationController(applicationService);
        userController = new UserController(userService);
        companyController = new CompanyController(companyService);
        jobController = new JobController(jobService);
    }

    @Test
    @DisplayName("13. GET /api/students/me -> Allowed for Student (200 OK)")
    void test13_GetStudentsMe_Allowed() {
        ResponseEntity<Student> response = studentController.getCurrentStudent(studentAuth);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    @DisplayName("14. GET /api/students -> Requires ADMIN, Student forbidden (403 via SecurityConfig)")
    void test14_GetAllStudents_RequiresAdmin() {
        // SecurityConfig: .requestMatchers("/api/students/**").hasRole("ADMIN")
        assertFalse(studentAuth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN")));
    }

    @Test
    @DisplayName("15. GET another student by ID (/api/students/{id}) -> Requires ADMIN, Student forbidden (403)")
    void test15_GetStudentById_RequiresAdmin() {
        // SecurityConfig: .requestMatchers("/api/students/**").hasRole("ADMIN")
        assertFalse(studentAuth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN")));
    }

    @Test
    @DisplayName("16. GET /api/users -> Requires ADMIN, Student forbidden (403)")
    void test16_GetUsers_RequiresAdmin() {
        // SecurityConfig: .requestMatchers("/api/users/**").hasRole("ADMIN")
        assertFalse(studentAuth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN")));
    }

    @Test
    @DisplayName("17. GET /api/companies -> Requires ADMIN, Student forbidden (403)")
    void test17_GetCompanies_RequiresAdmin() {
        // SecurityConfig: .requestMatchers("/api/companies/**").hasRole("ADMIN")
        assertFalse(studentAuth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN")));
    }

    @Test
    @DisplayName("18. GET /api/companies/me -> Requires COMPANY, Student forbidden (403)")
    void test18_GetCompanyMe_RequiresCompany() {
        // SecurityConfig: .requestMatchers(HttpMethod.GET, "/api/companies/me").hasRole("COMPANY")
        assertFalse(studentAuth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_COMPANY")));
    }

    @Test
    @DisplayName("19. DELETE student (/api/students/{id}) -> Requires ADMIN, Student forbidden (403)")
    void test19_DeleteStudent_RequiresAdmin() {
        // SecurityConfig: .requestMatchers("/api/students/**").hasRole("ADMIN")
        assertFalse(studentAuth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN")));
    }

    @Test
    @DisplayName("20. POST job (/api/jobs) -> Requires COMPANY or ADMIN, Student forbidden (403)")
    void test20_PostJob_RequiresCompanyOrAdmin() {
        // SecurityConfig: .requestMatchers(HttpMethod.POST, "/api/jobs/**").hasAnyRole("COMPANY", "ADMIN")
        boolean hasCompanyOrAdmin = studentAuth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_COMPANY") || a.getAuthority().equals("ROLE_ADMIN"));
        assertFalse(hasCompanyOrAdmin);
    }

    @Test
    @DisplayName("21. DELETE job (/api/jobs/{id}) -> Requires COMPANY or ADMIN, Student forbidden (403)")
    void test21_DeleteJob_RequiresCompanyOrAdmin() {
        // SecurityConfig: .requestMatchers(HttpMethod.DELETE, "/api/jobs/**").hasAnyRole("COMPANY", "ADMIN")
        boolean hasCompanyOrAdmin = studentAuth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_COMPANY") || a.getAuthority().equals("ROLE_ADMIN"));
        assertFalse(hasCompanyOrAdmin);
    }

    @Test
    @DisplayName("22. GET /api/applications/my -> Allowed for Student (200 OK)")
    void test22_GetMyApplications_Allowed() {
        ResponseEntity<List<Application>> response = applicationController.getMyApplications(studentAuth);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
    }

    @Test
    @DisplayName("23. GET all applications (/api/applications) -> Throws AccessDeniedException for Student (403)")
    void test23_GetAllApplications_ForbiddenForStudent() {
        assertThrows(AccessDeniedException.class, () -> {
            applicationController.getAllApplications(studentAuth);
        });
    }

    @Test
    @DisplayName("24. Change application status (/api/applications/{id}/status) -> Returns 403 FORBIDDEN for Student")
    void test24_ChangeApplicationStatus_ForbiddenForStudent() {
        ResponseEntity<?> response = applicationController.updateApplicationStatus(
                1L,
                Map.of("status", "SELECTED"),
                studentAuth
        );
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

    @Test
    @DisplayName("25. Delete application (/api/applications/{id}) -> Returns 403 FORBIDDEN for Student")
    void test25_DeleteApplication_ForbiddenForStudent() {
        ResponseEntity<Void> response = applicationController.deleteApplication(1L, studentAuth);
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }
}
