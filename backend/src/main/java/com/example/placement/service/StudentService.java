package com.example.placement.service;

import com.example.placement.model.Student;
import com.example.placement.repository.ApplicationRepository;
import com.example.placement.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final ApplicationRepository applicationRepository;

    public StudentService(StudentRepository studentRepository, ApplicationRepository applicationRepository) {
        this.studentRepository = studentRepository;
        this.applicationRepository = applicationRepository;
    }

    public Student saveStudent(Student student) {
        if (student.getCgpa() != null) {
            BigDecimal cgpa = student.getCgpa();
            if (cgpa.compareTo(BigDecimal.ZERO) < 0 || cgpa.compareTo(BigDecimal.valueOf(10.0)) > 0) {
                throw new IllegalArgumentException("CGPA must be between 0.0 and 10.0");
            }
        }
        return studentRepository.save(student);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    public Optional<Student> getStudentByEmail(String email) {
        return studentRepository.findByUserEmail(email);
    }

    @Transactional
    public void deleteStudent(Long id) {
        studentRepository.findById(id).ifPresent(student -> {
            var apps = applicationRepository.findByStudentId(id);
            if (!apps.isEmpty()) {
                applicationRepository.deleteAllInBatch(apps);
            }
            student.getSkills().clear();
            studentRepository.saveAndFlush(student);
            studentRepository.delete(student);
        });
    }
}

