package com.example.placement;

import com.example.placement.controller.*;
import com.example.placement.model.*;
import com.example.placement.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

public class AdminAuthorizationTest {

    private StudentController studentController;
    private CompanyController companyController;
    private JobController jobController;
    private ApplicationController applicationController;
    private UserController userController;

    private StudentService studentService;
    private CompanyService companyService;
    private JobService jobService;
    private ApplicationService applicationService;
    private UserService userService;

    private Authentication adminAuth;

    private final Map<Long, Student> studentStore = new HashMap<>();
    private final Map<Long, Company> companyStore = new HashMap<>();
    private final Map<Long, Job> jobStore = new HashMap<>();
    private final Map<Long, Application> appStore = new HashMap<>();
    private final Map<Long, User> userStore = new HashMap<>();

    @BeforeEach
    void setUp() {
        studentStore.clear();
        companyStore.clear();
        jobStore.clear();
        appStore.clear();
        userStore.clear();

        // 1. Authenticated Admin: Chakri
        adminAuth = new UsernamePasswordAuthenticationToken(
                "chakri@gmail.com",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );
        SecurityContextHolder.getContext().setAuthentication(adminAuth);

        // Seed Sample Entities
        User studentUser = new User();
        studentUser.setId(10L);
        studentUser.setName("Nitya");
        studentUser.setEmail("nitya@gmail.com");
        studentUser.setRole("STUDENT");
        userStore.put(10L, studentUser);

        Student student = new Student();
        student.setId(1L);
        student.setUser(studentUser);
        student.setCollege("VNIT Nagpur");
        student.setDegree("B.Tech");
        student.setCgpa(new BigDecimal("8.50"));
        studentStore.put(1L, student);

        User companyUser = new User();
        companyUser.setId(3L);
        companyUser.setName("Harsha");
        companyUser.setEmail("harsha@gmail.com");
        companyUser.setRole("COMPANY");
        userStore.put(3L, companyUser);

        Company company = new Company();
        company.setId(1L);
        company.setCompanyName("Microsoft");
        company.setUser(companyUser);
        companyStore.put(1L, company);

        Job job = new Job();
        job.setId(101L);
        job.setTitle("Software Engineer");
        job.setCompany(company);
        job.setSalary(new BigDecimal("1500000.00"));
        jobStore.put(101L, job);

        Application application = new Application();
        application.setId(1L);
        application.setStudent(student);
        application.setJob(job);
        application.setStatus("PENDING");
        appStore.put(1L, application);

        // Stub Services
        studentService = new StudentService(null, null) {
            @Override
            public List<Student> getAllStudents() {
                return new ArrayList<>(studentStore.values());
            }
            @Override
            public Optional<Student> getStudentById(Long id) {
                return Optional.ofNullable(studentStore.get(id));
            }
            @Override
            public void deleteStudent(Long id) {
                studentStore.remove(id);
            }
        };

        companyService = new CompanyService(null, null, null) {
            @Override
            public List<Company> getAllCompanies() {
                return new ArrayList<>(companyStore.values());
            }
            @Override
            public Optional<Company> getCompanyById(Long id) {
                return Optional.ofNullable(companyStore.get(id));
            }
            @Override
            public void deleteCompany(Long id) {
                companyStore.remove(id);
            }
        };

        jobService = new JobService(null, null, null) {
            @Override
            public List<Job> getAllJobs() {
                return new ArrayList<>(jobStore.values());
            }
            @Override
            public Optional<Job> getJobById(Long id) {
                return Optional.ofNullable(jobStore.get(id));
            }
            @Override
            public Job saveJob(Job j, String callerEmail) {
                long newId = jobStore.size() + 100L;
                j.setId(newId);
                jobStore.put(newId, j);
                return j;
            }
            @Override
            public Job updateJob(Long id, Job details, String companyEmail) {
                Job existing = jobStore.get(id);
                if (existing == null) throw new NoSuchElementException("Job not found");
                if (details.getTitle() != null) existing.setTitle(details.getTitle());
                return existing;
            }
            @Override
            public void deleteJob(Long id, String companyEmail) {
                jobStore.remove(id);
            }
        };

        applicationService = new ApplicationService(null, null, null) {
            @Override
            public List<Application> getAllApplications() {
                return new ArrayList<>(appStore.values());
            }
            @Override
            public Optional<Application> getApplicationById(Long id) {
                return Optional.ofNullable(appStore.get(id));
            }
            @Override
            public Application updateApplicationStatus(Long id, String status, String companyEmail) {
                Application app = appStore.get(id);
                if (app == null) throw new NoSuchElementException("Application not found");
                app.setStatus(status);
                return app;
            }
            @Override
            public void deleteApplication(Long id) {
                appStore.remove(id);
            }
        };

        userService = new UserService(null, null, null, null, null, null) {
            @Override
            public List<User> getAllUsers() {
                return new ArrayList<>(userStore.values());
            }
            @Override
            public Optional<User> getUserById(Long id) {
                return Optional.ofNullable(userStore.get(id));
            }
            @Override
            public void deleteUser(Long id) {
                userStore.remove(id);
            }
        };

        studentController = new StudentController(studentService);
        companyController = new CompanyController(companyService);
        jobController = new JobController(jobService);
        applicationController = new ApplicationController(applicationService);
        userController = new UserController(userService);
    }

    @Test
    @DisplayName("39. GET students (/api/students) -> Allowed for Admin (200 OK)")
    void test39_GetStudents_Allowed() {
        List<Student> students = studentController.getAllStudents();
        assertNotNull(students);
        assertEquals(1, students.size());
        assertEquals("VNIT Nagpur", students.get(0).getCollege());
    }

    @Test
    @DisplayName("40. GET companies (/api/companies) -> Allowed for Admin (200 OK)")
    void test40_GetCompanies_Allowed() {
        List<Company> companies = companyController.getAllCompanies();
        assertNotNull(companies);
        assertEquals(1, companies.size());
        assertEquals("Microsoft", companies.get(0).getCompanyName());
    }

    @Test
    @DisplayName("41. GET jobs (/api/jobs) -> Allowed for Admin (200 OK)")
    void test41_GetJobs_Allowed() {
        List<Job> jobs = jobController.getAllJobs();
        assertNotNull(jobs);
        assertEquals(1, jobs.size());
        assertEquals("Software Engineer", jobs.get(0).getTitle());
    }

    @Test
    @DisplayName("42. GET applications (/api/applications) -> Allowed for Admin (200 OK)")
    void test42_GetApplications_Allowed() {
        List<Application> applications = applicationController.getAllApplications(adminAuth);
        assertNotNull(applications);
        assertEquals(1, applications.size());
        assertEquals("PENDING", applications.get(0).getStatus());
    }

    @Test
    @DisplayName("43. GET users (/api/users) -> Allowed for Admin (200 OK)")
    void test43_GetUsers_Allowed() {
        List<User> users = userController.getAllUsers();
        assertNotNull(users);
        assertEquals(2, users.size());
    }

    @Test
    @DisplayName("44. Admin can access required management endpoints (Students, Companies, Jobs, Applications, Users)")
    void test44_AdminCanAccessManagementEndpoints() {
        // 1. Get Student by ID
        ResponseEntity<Student> studentRes = studentController.getStudentById(1L);
        assertEquals(HttpStatus.OK, studentRes.getStatusCode());
        assertNotNull(studentRes.getBody());

        // 2. Get Company by ID
        ResponseEntity<Company> companyRes = companyController.getCompanyById(1L);
        assertEquals(HttpStatus.OK, companyRes.getStatusCode());
        assertNotNull(companyRes.getBody());

        // 3. Get User by ID
        ResponseEntity<User> userRes = userController.getUserById(10L);
        assertEquals(HttpStatus.OK, userRes.getStatusCode());
        assertNotNull(userRes.getBody());

        // 4. Update Job as Admin
        Job updateJob = new Job();
        updateJob.setTitle("Lead Architect");
        ResponseEntity<Job> updatedJobRes = jobController.updateJob(101L, updateJob, adminAuth);
        assertEquals(HttpStatus.OK, updatedJobRes.getStatusCode());
        assertEquals("Lead Architect", updatedJobRes.getBody().getTitle());

        // 5. Update Application Status as Admin
        ResponseEntity<?> appStatusRes = applicationController.updateApplicationStatus(
                1L,
                Map.of("status", "ACCEPTED"),
                adminAuth
        );
        assertEquals(HttpStatus.OK, appStatusRes.getStatusCode());
        assertEquals("ACCEPTED", appStore.get(1L).getStatus());

        // 6. Delete Application as Admin
        ResponseEntity<Void> deleteAppRes = applicationController.deleteApplication(1L, adminAuth);
        assertEquals(HttpStatus.NO_CONTENT, deleteAppRes.getStatusCode());
        assertNull(appStore.get(1L));
    }

    @Test
    @DisplayName("45. Admin can delete student (DELETE /api/students/{id} -> 204 No Content)")
    void test45_AdminCanDeleteStudent() {
        assertNotNull(studentStore.get(1L));
        ResponseEntity<Void> response = studentController.deleteStudent(1L);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertNull(studentStore.get(1L));
    }

    @Test
    @DisplayName("46. Admin can delete company (DELETE /api/companies/{id} -> 204 No Content)")
    void test46_AdminCanDeleteCompany() {
        assertNotNull(companyStore.get(1L));
        ResponseEntity<Void> response = companyController.deleteCompany(1L);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertNull(companyStore.get(1L));
    }
}
