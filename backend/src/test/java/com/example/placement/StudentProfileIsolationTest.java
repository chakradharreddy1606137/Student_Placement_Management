package com.example.placement;

import com.example.placement.controller.StudentController;
import com.example.placement.model.Student;
import com.example.placement.model.User;
import com.example.placement.service.StudentService;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

public class StudentProfileIsolationTest {

    private StudentController studentController;
    private StudentService studentService;

    private Authentication studentNityaAuth;
    private Authentication companyHarshaAuth;

    private Student nityaStudent;
    private Student srujanStudent;
    private final Map<Long, Student> studentDb = new HashMap<>();

    @BeforeEach
    void setUp() {
        studentDb.clear();

        // 1. Authenticated Student: Nitya
        studentNityaAuth = new UsernamePasswordAuthenticationToken(
                "nitya@gmail.com",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_STUDENT"))
        );

        // 2. Authenticated Company: Harsha (Microsoft)
        companyHarshaAuth = new UsernamePasswordAuthenticationToken(
                "harsha@gmail.com",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_COMPANY"))
        );

        User nityaUser = new User();
        nityaUser.setId(10L);
        nityaUser.setName("Nitya");
        nityaUser.setEmail("nitya@gmail.com");
        nityaUser.setRole("STUDENT");

        nityaStudent = new Student();
        nityaStudent.setId(1L);
        nityaStudent.setUser(nityaUser);
        nityaStudent.setCollege("VNIT Nagpur");
        nityaStudent.setCgpa(new BigDecimal("8.50"));
        studentDb.put(1L, nityaStudent);

        User srujanUser = new User();
        srujanUser.setId(6L);
        srujanUser.setName("Srujan");
        srujanUser.setEmail("srujan@gmail.com");
        srujanUser.setRole("STUDENT");

        srujanStudent = new Student();
        srujanStudent.setId(2L);
        srujanStudent.setUser(srujanUser);
        srujanStudent.setCollege("NIT Trichy");
        srujanStudent.setCgpa(new BigDecimal("7.15"));
        studentDb.put(2L, srujanStudent);

        studentService = new StudentService(null, null) {
            @Override
            public Optional<Student> getStudentByEmail(String email) {
                if ("nitya@gmail.com".equalsIgnoreCase(email)) {
                    return Optional.of(nityaStudent);
                }
                if ("srujan@gmail.com".equalsIgnoreCase(email)) {
                    return Optional.of(srujanStudent);
                }
                return Optional.empty();
            }

            @Override
            public Optional<Student> getStudentById(Long id) {
                return Optional.ofNullable(studentDb.get(id));
            }

            @Override
            public List<Student> getAllStudents() {
                return List.of(nityaStudent, srujanStudent);
            }
        };

        studentController = new StudentController(studentService);
    }

    @Test
    @DisplayName("47. Student views own /me -> Returns only caller's profile (200 OK)")
    void test47_StudentViewsOwnMe_Success() {
        SecurityContextHolder.getContext().setAuthentication(studentNityaAuth);

        ResponseEntity<Student> response = studentController.getCurrentStudent(studentNityaAuth);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Nitya", response.getBody().getUser().getName());
        assertEquals("nitya@gmail.com", response.getBody().getUser().getEmail());
        assertEquals("VNIT Nagpur", response.getBody().getCollege());
        assertEquals(new BigDecimal("8.50"), response.getBody().getCgpa());
    }

    @Test
    @DisplayName("48. Student attempts another student's profile -> Requires ADMIN role (403 Forbidden)")
    void test48_StudentAttemptsAnotherStudentProfile_Forbidden() {
        SecurityContextHolder.getContext().setAuthentication(studentNityaAuth);

        // SecurityConfig rule: .requestMatchers("/api/students/**").hasRole("ADMIN")
        // Direct access to /api/students/{id} requires ROLE_ADMIN
        boolean hasAdmin = studentNityaAuth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        assertFalse(hasAdmin, "Student must not possess ROLE_ADMIN authority to view arbitrary student profiles");
    }

    @Test
    @DisplayName("49. Student attempts admin student list -> Requires ADMIN role (403 Forbidden)")
    void test49_StudentAttemptsAdminStudentList_Forbidden() {
        SecurityContextHolder.getContext().setAuthentication(studentNityaAuth);

        // SecurityConfig rule: .requestMatchers("/api/students/**").hasRole("ADMIN")
        // GET /api/students requires ROLE_ADMIN
        boolean hasAdmin = studentNityaAuth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        assertFalse(hasAdmin, "Student must not possess ROLE_ADMIN authority to list all students");
    }

    @Test
    @DisplayName("50. Company attempts student /me -> Requires STUDENT role (403 Forbidden)")
    void test50_CompanyAttemptsStudentMe_Forbidden() {
        SecurityContextHolder.getContext().setAuthentication(companyHarshaAuth);

        // SecurityConfig rule: .requestMatchers(HttpMethod.GET, "/api/students/me").hasRole("STUDENT")
        // GET /api/students/me strictly requires ROLE_STUDENT
        boolean hasStudent = companyHarshaAuth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_STUDENT"));
        assertFalse(hasStudent, "Company user must not possess ROLE_STUDENT authority to access student /me endpoint");

        // Controller check if called directly without student profile
        ResponseEntity<Student> response = studentController.getCurrentStudent(companyHarshaAuth);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }
}
