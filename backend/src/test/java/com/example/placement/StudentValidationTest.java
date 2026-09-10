package com.example.placement;

import com.example.placement.config.GlobalExceptionHandler;
import com.example.placement.controller.StudentController;
import com.example.placement.model.Student;
import com.example.placement.model.User;
import com.example.placement.repository.ApplicationRepository;
import com.example.placement.repository.StudentRepository;
import com.example.placement.repository.UserRepository;
import com.example.placement.service.StudentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.lang.reflect.Proxy;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

public class StudentValidationTest {

    private StudentController studentController;
    private StudentService studentService;
    private GlobalExceptionHandler exceptionHandler;

    private StudentRepository studentRepository;
    private UserRepository userRepository;

    private final Map<Long, Student> studentDb = new HashMap<>();
    private final Map<Long, User> userDb = new HashMap<>();

    private User validUser;

    @BeforeEach
    void setUp() {
        studentDb.clear();
        userDb.clear();
        exceptionHandler = new GlobalExceptionHandler();

        validUser = new User();
        validUser.setId(10L);
        validUser.setName("Nitya");
        validUser.setEmail("nitya@gmail.com");
        validUser.setRole("STUDENT");
        userDb.put(10L, validUser);

        userRepository = (UserRepository) Proxy.newProxyInstance(
                UserRepository.class.getClassLoader(),
                new Class<?>[]{UserRepository.class},
                (proxy, method, args) -> {
                    if ("existsById".equals(method.getName())) {
                        Long id = (Long) args[0];
                        return userDb.containsKey(id);
                    }
                    if ("findById".equals(method.getName())) {
                        Long id = (Long) args[0];
                        return Optional.ofNullable(userDb.get(id));
                    }
                    return null;
                }
        );

        studentRepository = (StudentRepository) Proxy.newProxyInstance(
                StudentRepository.class.getClassLoader(),
                new Class<?>[]{StudentRepository.class},
                (proxy, method, args) -> {
                    if ("save".equals(method.getName())) {
                        Student s = (Student) args[0];
                        if (s.getId() == null) {
                            s.setId(studentDb.size() + 1L);
                        }
                        studentDb.put(s.getId(), s);
                        return s;
                    }
                    return null;
                }
        );

        studentService = new StudentService(studentRepository, null, userRepository);
        studentController = new StudentController(studentService);
    }

    @Test
    @DisplayName("103. Valid student -> Allowed (200 OK)")
    void test103_ValidStudent_Success() {
        Student student = new Student();
        student.setUser(validUser);
        student.setCollege("VNIT Nagpur");
        student.setDegree("B.Tech");
        student.setBranch("CSE");
        student.setGraduationYear(2025);
        student.setCgpa(new BigDecimal("8.50"));

        Student saved = studentController.createStudent(student);
        assertNotNull(saved);
        assertNotNull(saved.getId());
        assertEquals("VNIT Nagpur", saved.getCollege());
        assertEquals(new BigDecimal("8.50"), saved.getCgpa());
    }

    @Test
    @DisplayName("104. CGPA = 0 -> Allowed per business rules (Freshman/no score yet)")
    void test104_ZeroCgpa_Allowed() {
        Student student = new Student();
        student.setUser(validUser);
        student.setCollege("VNIT Nagpur");
        student.setCgpa(BigDecimal.ZERO);

        Student saved = studentController.createStudent(student);
        assertNotNull(saved);
        assertEquals(BigDecimal.ZERO, saved.getCgpa());
    }

    @Test
    @DisplayName("105. CGPA = 10 -> Allowed (200 OK)")
    void test105_MaxCgpaTen_Allowed() {
        Student student = new Student();
        student.setUser(validUser);
        student.setCollege("VNIT Nagpur");
        student.setCgpa(new BigDecimal("10.00"));

        Student saved = studentController.createStudent(student);
        assertNotNull(saved);
        assertEquals(new BigDecimal("10.00"), saved.getCgpa());
    }

    @Test
    @DisplayName("106. CGPA = -1 -> throws IllegalArgumentException (400 Bad Request)")
    void test106_NegativeCgpa_Throws400() {
        Student student = new Student();
        student.setUser(validUser);
        student.setCollege("VNIT Nagpur");
        student.setCgpa(new BigDecimal("-1.00"));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            studentController.createStudent(student);
        });
        assertEquals("CGPA must be between 0.0 and 10.0", ex.getMessage());

        ResponseEntity<Map<String, Object>> errorRes = exceptionHandler.handleIllegalArgument(ex);
        assertEquals(HttpStatus.BAD_REQUEST, errorRes.getStatusCode());
    }

    @Test
    @DisplayName("107. CGPA = 11 -> throws IllegalArgumentException (400 Bad Request)")
    void test107_CgpaGreaterThanTen_Throws400() {
        Student student = new Student();
        student.setUser(validUser);
        student.setCollege("VNIT Nagpur");
        student.setCgpa(new BigDecimal("11.00"));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            studentController.createStudent(student);
        });
        assertEquals("CGPA must be between 0.0 and 10.0", ex.getMessage());

        ResponseEntity<Map<String, Object>> errorRes = exceptionHandler.handleIllegalArgument(ex);
        assertEquals(HttpStatus.BAD_REQUEST, errorRes.getStatusCode());
    }

    @Test
    @DisplayName("108. Missing required student field (college missing) -> throws IllegalArgumentException (400 Bad Request)")
    void test108_MissingRequiredField_Throws400() {
        Student student = new Student();
        student.setUser(validUser);
        student.setCollege("   "); // Blank college

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            studentController.createStudent(student);
        });
        assertEquals("College is required", ex.getMessage());

        ResponseEntity<Map<String, Object>> errorRes = exceptionHandler.handleIllegalArgument(ex);
        assertEquals(HttpStatus.BAD_REQUEST, errorRes.getStatusCode());
    }

    @Test
    @DisplayName("109. Nonexistent user ID -> throws IllegalArgumentException (400/404)")
    void test109_NonexistentUserId_Throws400() {
        User ghostUser = new User();
        ghostUser.setId(99999L);

        Student student = new Student();
        student.setUser(ghostUser);
        student.setCollege("VNIT Nagpur");
        student.setCgpa(new BigDecimal("8.00"));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            studentController.createStudent(student);
        });
        assertTrue(ex.getMessage().contains("User not found with ID: 99999"));

        ResponseEntity<Map<String, Object>> errorRes = exceptionHandler.handleIllegalArgument(ex);
        assertEquals(HttpStatus.BAD_REQUEST, errorRes.getStatusCode());
    }
}
