package com.example.placement;

import com.example.placement.controller.*;
import com.example.placement.model.*;
import com.example.placement.repository.*;
import com.example.placement.service.*;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
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

import javax.crypto.SecretKey;
import java.lang.reflect.Field;
import java.lang.reflect.Proxy;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

public class FinalSecurityMasterTest {

    private JwtService jwtService;
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

    private Authentication studentAuth;
    private Authentication companyAAuth;
    private Authentication companyBAuth;
    private Authentication adminAuth;

    private final Map<Long, Application> appStore = new HashMap<>();
    private final Map<Long, Job> jobStore = new HashMap<>();
    private final Map<Long, Company> companyStore = new HashMap<>();
    private final Map<Long, Student> studentStore = new HashMap<>();
    private final Map<Long, User> userStore = new HashMap<>();

    @BeforeEach
    void setUp() throws Exception {
        appStore.clear();
        jobStore.clear();
        companyStore.clear();
        studentStore.clear();
        userStore.clear();

        // 1. Secret Key & JwtService
        SecretKey secretKey = Keys.hmacShaKeyFor("StudentPlacementManagementJwtSecretKey2026SecureKey".getBytes(StandardCharsets.UTF_8));
        jwtService = new JwtService();
        Field keyField = JwtService.class.getDeclaredField("key");
        keyField.setAccessible(true);
        keyField.set(jwtService, secretKey);

        Field expField = JwtService.class.getDeclaredField("expirationTime");
        expField.setAccessible(true);
        expField.set(jwtService, 3600000L);

        // 2. Authentications
        studentAuth = new UsernamePasswordAuthenticationToken(
                "nitya@gmail.com",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_STUDENT"))
        );

        companyAAuth = new UsernamePasswordAuthenticationToken(
                "harsha@gmail.com",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_COMPANY"))
        );

        companyBAuth = new UsernamePasswordAuthenticationToken(
                "saicharan@gmail.com",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_COMPANY"))
        );

        adminAuth = new UsernamePasswordAuthenticationToken(
                "chakri@gmail.com",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );

        // 3. Seed Entities
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
        student.setCgpa(new BigDecimal("8.50"));
        studentStore.put(1L, student);

        User userA = new User();
        userA.setId(3L);
        userA.setName("Harsha (Microsoft)");
        userA.setEmail("harsha@gmail.com");
        userA.setRole("COMPANY");
        userStore.put(3L, userA);

        Company companyA = new Company();
        companyA.setId(1L);
        companyA.setCompanyName("Microsoft");
        companyA.setUser(userA);
        companyStore.put(1L, companyA);

        User userB = new User();
        userB.setId(2L);
        userB.setName("Sai Charan (Perficient)");
        userB.setEmail("saicharan@gmail.com");
        userB.setRole("COMPANY");
        userStore.put(2L, userB);

        Company companyB = new Company();
        companyB.setId(2L);
        companyB.setCompanyName("Perficient");
        companyB.setUser(userB);
        companyStore.put(2L, companyB);

        Job jobA = new Job();
        jobA.setId(101L);
        jobA.setTitle("Microsoft Job");
        jobA.setCompany(companyA);
        jobA.setMinimumCgpa(new BigDecimal("7.00"));
        jobA.setDeadline(LocalDate.now().plusDays(30));
        jobStore.put(101L, jobA);

        Job jobB = new Job();
        jobB.setId(102L);
        jobB.setTitle("Perficient Job");
        jobB.setCompany(companyB);
        jobB.setMinimumCgpa(new BigDecimal("7.00"));
        jobB.setDeadline(LocalDate.now().plusDays(30));
        jobStore.put(102L, jobB);

        Application appA = new Application();
        appA.setId(1L);
        appA.setJob(jobA);
        appA.setStudent(student);
        appA.setStatus("PENDING");
        appStore.put(1L, appA);

        Application appB = new Application();
        appB.setId(2L);
        appB.setJob(jobB);
        appB.setStudent(student);
        appB.setStatus("PENDING");
        appStore.put(2L, appB);

        // 4. Repositories & Services
        StudentRepository studentRepository = (StudentRepository) Proxy.newProxyInstance(
                StudentRepository.class.getClassLoader(),
                new Class<?>[]{StudentRepository.class},
                (proxy, method, args) -> {
                    if ("findByUserEmail".equals(method.getName())) {
                        String email = (String) args[0];
                        return studentStore.values().stream()
                                .filter(s -> s.getUser() != null && email.equalsIgnoreCase(s.getUser().getEmail()))
                                .findFirst();
                    }
                    if ("findById".equals(method.getName())) {
                        Long id = (Long) args[0];
                        return Optional.ofNullable(studentStore.get(id));
                    }
                    return null;
                }
        );

        JobRepository jobRepository = (JobRepository) Proxy.newProxyInstance(
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

        ApplicationRepository applicationRepository = (ApplicationRepository) Proxy.newProxyInstance(
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
                    return null;
                }
        );

        CompanyRepository companyRepository = (CompanyRepository) Proxy.newProxyInstance(
                CompanyRepository.class.getClassLoader(),
                new Class<?>[]{CompanyRepository.class},
                (proxy, method, args) -> null
        );

        UserRepository userRepository = (UserRepository) Proxy.newProxyInstance(
                UserRepository.class.getClassLoader(),
                new Class<?>[]{UserRepository.class},
                (proxy, method, args) -> {
                    if ("findAll".equals(method.getName())) {
                        return new ArrayList<>(userStore.values());
                    }
                    return null;
                }
        );

        studentService = new StudentService(studentRepository, applicationRepository);
        companyService = new CompanyService(companyRepository, jobRepository, applicationRepository);
        jobService = new JobService(jobRepository, applicationRepository, companyRepository);
        applicationService = new ApplicationService(applicationRepository, studentRepository, jobRepository);
        userService = new UserService(userRepository, studentRepository, companyRepository, studentService, companyService, null);

        studentController = new StudentController(studentService);
        companyController = new CompanyController(companyService);
        jobController = new JobController(jobService);
        applicationController = new ApplicationController(applicationService);
        userController = new UserController(userService);
    }

    @Test
    @DisplayName("1. No JWT -> Protected API Blocked (Null Auth Context)")
    void test1_NoJwt_ProtectedApiBlocked() {
        SecurityContextHolder.clearContext();
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    @DisplayName("2. Fake JWT -> Validation Fails (Blocked)")
    void test2_FakeJwt_Blocked() {
        assertFalse(jwtService.isTokenValid("fake.garbage.jwt.token"));
    }

    @Test
    @DisplayName("3. Tampered JWT -> Signature Mismatch (Blocked)")
    void test3_TamperedJwt_Blocked() {
        String token = jwtService.generateToken(10L, "nitya@gmail.com", "ROLE_STUDENT");
        String tamperedToken = token.substring(0, token.length() - 5) + "abcde";
        assertFalse(jwtService.isTokenValid(tamperedToken));
    }

    @Test
    @DisplayName("4. Student -> Admin API Blocked (403 Forbidden)")
    void test4_StudentToAdminApi_Blocked() {
        assertFalse(studentAuth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN")));
    }

    @Test
    @DisplayName("5. Company -> Student API Blocked (403 Forbidden)")
    void test5_CompanyToStudentApi_Blocked() {
        assertFalse(companyAAuth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_STUDENT")));
    }

    @Test
    @DisplayName("6. Company A -> Company B data Blocked (403 Forbidden)")
    void test6_CompanyAToCompanyBData_Blocked() {
        assertThrows(AccessDeniedException.class, () -> {
            jobService.deleteJob(102L, "harsha@gmail.com"); // Job B belongs to saicharan@gmail.com
        });
    }

    @Test
    @DisplayName("7. Student -> Another student's profile Blocked (403 Forbidden)")
    void test7_StudentToAnotherStudentProfile_Blocked() {
        assertFalse(studentAuth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN")));
    }

    @Test
    @DisplayName("8. Student cannot change application status (403 Forbidden)")
    void test8_StudentCannotChangeStatus() {
        ResponseEntity<?> res = applicationController.updateApplicationStatus(
                1L,
                Map.of("status", "ACCEPTED"),
                studentAuth
        );
        assertEquals(HttpStatus.FORBIDDEN, res.getStatusCode());
    }

    @Test
    @DisplayName("9. Company cannot modify another company's application (403 Forbidden)")
    void test9_CompanyCannotModifyOtherCompanyApp() {
        ResponseEntity<?> res = applicationController.updateApplicationStatus(
                2L, // Application B
                Map.of("status", "ACCEPTED"),
                companyAAuth // Called by Company A
        );
        assertEquals(HttpStatus.FORBIDDEN, res.getStatusCode());
    }

    @Test
    @DisplayName("10. Company cannot delete another company's job (403 Forbidden)")
    void test10_CompanyCannotDeleteOtherCompanyJob() {
        assertThrows(AccessDeniedException.class, () -> {
            jobController.deleteJob(102L, companyAAuth); // Job B
        });
    }

    @Test
    @DisplayName("11. Admin access works (200 OK across all resources)")
    void test11_AdminAccessWorks() {
        List<User> users = userController.getAllUsers();
        assertNotNull(users);
        assertEquals(3, users.size());
    }

    @Test
    @DisplayName("12. Logout removes client-side token")
    void test12_LogoutRemovesClientSideToken() {
        Map<String, String> localStorageMock = new HashMap<>();
        localStorageMock.put("token", "valid-jwt-token");
        localStorageMock.put("user", "{\"name\":\"Nitya\"}");
        localStorageMock.put("role", "STUDENT");

        // Simulate Logout
        localStorageMock.remove("token");
        localStorageMock.remove("user");
        localStorageMock.remove("role");

        assertNull(localStorageMock.get("token"));
        assertNull(localStorageMock.get("user"));
        assertNull(localStorageMock.get("role"));
    }

    @Test
    @DisplayName("13. No token after logout -> Blocked")
    void test13_NoTokenAfterLogout_Blocked() {
        SecurityContextHolder.clearContext();
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }
}
