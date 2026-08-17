package com.example.placement.service;

import com.example.placement.model.User;
import com.example.placement.repository.CompanyRepository;
import com.example.placement.repository.StudentRepository;
import com.example.placement.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final StudentService studentService;
    private final CompanyService companyService;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       StudentRepository studentRepository,
                       CompanyRepository companyRepository,
                       StudentService studentService,
                       CompanyService companyService,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
        this.studentService = studentService;
        this.companyService = companyService;
        this.passwordEncoder = passwordEncoder;
    }

    public User saveUser(User user) {
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (user.getId() == null && userRepository.findByEmail(user.getEmail().trim()).isPresent()) {
            throw new IllegalArgumentException("Email already exists: " + user.getEmail());
        }
        if (user.getPassword() != null && !user.getPassword().startsWith("$2a$")) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Transactional
    public void deleteUser(Long id) {
        studentRepository.findByUserId(id).ifPresent(s -> studentService.deleteStudent(s.getId()));
        companyRepository.findByUserId(id).ifPresent(c -> companyService.deleteCompany(c.getId()));
        userRepository.deleteById(id);
    }
}

