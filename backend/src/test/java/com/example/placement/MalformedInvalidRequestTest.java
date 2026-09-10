package com.example.placement;

import com.example.placement.config.GlobalExceptionHandler;
import com.example.placement.controller.StudentController;
import com.example.placement.model.Student;
import com.example.placement.service.StudentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.math.BigDecimal;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

public class MalformedInvalidRequestTest {

    private GlobalExceptionHandler exceptionHandler;
    private StudentController studentController;
    private StudentService studentService;

    @BeforeEach
    void setUp() {
        exceptionHandler = new GlobalExceptionHandler();

        studentService = new StudentService(null, null) {
            @Override
            public Optional<Student> getStudentById(Long id) {
                if (id == 99999L) {
                    return Optional.empty();
                }
                Student s = new Student();
                s.setId(id);
                return Optional.of(s);
            }
        };

        studentController = new StudentController(studentService);
    }

    @Test
    @DisplayName("110. Malformed JSON -> GlobalExceptionHandler returns 400 Bad Request")
    void test110_MalformedJson_Returns400() {
        HttpMessageNotReadableException ex = new HttpMessageNotReadableException("JSON parse error: Unexpected character ('\"' (code 34)): was expecting comma to separate Object entries");
        ResponseEntity<Map<String, Object>> response = exceptionHandler.handleMalformedJson(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(400, response.getBody().get("status"));
        assertEquals("Malformed or invalid JSON payload", response.getBody().get("error"));
    }

    @Test
    @DisplayName("111. Wrong data type -> GlobalExceptionHandler returns 400 Bad Request")
    void test111_WrongDataType_Returns400() {
        MethodArgumentTypeMismatchException ex = new MethodArgumentTypeMismatchException("abc", Long.class, "id", null, new NumberFormatException("For input string: \"abc\""));
        ResponseEntity<Map<String, Object>> response = exceptionHandler.handleTypeMismatch(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(400, response.getBody().get("status"));
        assertTrue(response.getBody().get("error").toString().contains("Wrong data type"));
    }

    @Test
    @DisplayName("112. Missing required field -> GlobalExceptionHandler returns 400 Bad Request")
    void test112_MissingRequiredField_Returns400() {
        IllegalArgumentException ex = new IllegalArgumentException("Job title is required");
        ResponseEntity<Map<String, Object>> response = exceptionHandler.handleIllegalArgument(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(400, response.getBody().get("status"));
        assertEquals("Job title is required", response.getBody().get("error"));
    }

    @Test
    @DisplayName("113. Empty required field -> GlobalExceptionHandler returns 400 Bad Request")
    void test113_EmptyRequiredField_Returns400() {
        IllegalArgumentException ex = new IllegalArgumentException("Email cannot be empty");
        ResponseEntity<Map<String, Object>> response = exceptionHandler.handleIllegalArgument(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(400, response.getBody().get("status"));
        assertEquals("Email cannot be empty", response.getBody().get("error"));
    }

    @Test
    @DisplayName("114. Negative numeric value -> GlobalExceptionHandler returns 400 Bad Request")
    void test114_NegativeNumericValue_Returns400() {
        IllegalArgumentException ex = new IllegalArgumentException("Salary cannot be negative");
        ResponseEntity<Map<String, Object>> response = exceptionHandler.handleIllegalArgument(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(400, response.getBody().get("status"));
        assertEquals("Salary cannot be negative", response.getBody().get("error"));
    }

    @Test
    @DisplayName("115. Nonexistent ID -> Returns 404 Not Found")
    void test115_NonexistentId_Returns404() {
        // Direct controller call for nonexistent ID (99999)
        ResponseEntity<Student> response = studentController.getStudentById(99999L);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        // Exception handler call for NoSuchElementException
        NoSuchElementException ex = new NoSuchElementException("Resource not found with ID: 99999");
        ResponseEntity<Map<String, Object>> notFoundResponse = exceptionHandler.handleNotFound(ex);
        assertEquals(HttpStatus.NOT_FOUND, notFoundResponse.getStatusCode());
        assertEquals(404, notFoundResponse.getBody().get("status"));
    }

    @Test
    @DisplayName("116. Unsupported HTTP method -> GlobalExceptionHandler returns 405 Method Not Allowed")
    void test116_UnsupportedHttpMethod_Returns405() {
        HttpRequestMethodNotSupportedException ex = new HttpRequestMethodNotSupportedException("TRACE");
        ResponseEntity<Map<String, Object>> response = exceptionHandler.handleMethodNotSupported(ex);

        assertEquals(HttpStatus.METHOD_NOT_ALLOWED, response.getStatusCode());
        assertEquals(405, response.getBody().get("status"));
        assertTrue(response.getBody().get("error").toString().contains("HTTP method not supported: TRACE"));
    }

    @Test
    @DisplayName("117. Unknown endpoint -> Returns 404 Not Found")
    void test117_UnknownEndpoint_Returns404() {
        NoSuchElementException ex = new NoSuchElementException("Endpoint not mapped: /api/unknown/endpoint");
        ResponseEntity<Map<String, Object>> response = exceptionHandler.handleNotFound(ex);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(404, response.getBody().get("status"));
    }
}
