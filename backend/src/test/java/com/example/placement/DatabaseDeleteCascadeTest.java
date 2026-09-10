package com.example.placement;

import com.example.placement.model.Application;
import com.example.placement.model.Company;
import com.example.placement.model.Job;
import com.example.placement.model.Student;
import com.example.placement.model.User;
import com.example.placement.repository.ApplicationRepository;
import com.example.placement.repository.CompanyRepository;
import com.example.placement.repository.JobRepository;
import com.example.placement.repository.StudentRepository;
import com.example.placement.service.CompanyService;
import com.example.placement.service.StudentService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Proxy;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

public class DatabaseDeleteCascadeTest {

    private StudentService studentService;
    private CompanyService companyService;

    private StudentRepository studentRepository;
    private CompanyRepository companyRepository;
    private JobRepository jobRepository;
    private ApplicationRepository applicationRepository;

    private final Map<Long, Student> studentStore = new HashMap<>();
    private final Map<Long, Company> companyStore = new HashMap<>();
    private final Map<Long, Job> jobStore = new HashMap<>();
    private final Map<Long, Application> appStore = new HashMap<>();

    @BeforeEach
    void setUp() {
        studentStore.clear();
        companyStore.clear();
        jobStore.clear();
        appStore.clear();

        // 1. Repositories
        studentRepository = (StudentRepository) Proxy.newProxyInstance(
                StudentRepository.class.getClassLoader(),
                new Class<?>[]{StudentRepository.class},
                (proxy, method, args) -> {
                    if ("findById".equals(method.getName())) {
                        Long id = (Long) args[0];
                        return Optional.ofNullable(studentStore.get(id));
                    }
                    if ("saveAndFlush".equals(method.getName())) {
                        Student s = (Student) args[0];
                        studentStore.put(s.getId(), s);
                        return s;
                    }
                    if ("delete".equals(method.getName())) {
                        Student s = (Student) args[0];
                        studentStore.remove(s.getId());
                        return null;
                    }
                    return null;
                }
        );

        companyRepository = (CompanyRepository) Proxy.newProxyInstance(
                CompanyRepository.class.getClassLoader(),
                new Class<?>[]{CompanyRepository.class},
                (proxy, method, args) -> {
                    if ("findById".equals(method.getName())) {
                        Long id = (Long) args[0];
                        return Optional.ofNullable(companyStore.get(id));
                    }
                    if ("delete".equals(method.getName())) {
                        Company c = (Company) args[0];
                        companyStore.remove(c.getId());
                        return null;
                    }
                    return null;
                }
        );

        jobRepository = (JobRepository) Proxy.newProxyInstance(
                JobRepository.class.getClassLoader(),
                new Class<?>[]{JobRepository.class},
                (proxy, method, args) -> {
                    if ("findByCompanyId".equals(method.getName())) {
                        Long companyId = (Long) args[0];
                        return jobStore.values().stream()
                                .filter(j -> j.getCompany() != null && companyId.equals(j.getCompany().getId()))
                                .toList();
                    }
                    if ("saveAndFlush".equals(method.getName())) {
                        Job j = (Job) args[0];
                        jobStore.put(j.getId(), j);
                        return j;
                    }
                    if ("delete".equals(method.getName())) {
                        Job j = (Job) args[0];
                        jobStore.remove(j.getId());
                        return null;
                    }
                    return null;
                }
        );

        applicationRepository = (ApplicationRepository) Proxy.newProxyInstance(
                ApplicationRepository.class.getClassLoader(),
                new Class<?>[]{ApplicationRepository.class},
                (proxy, method, args) -> {
                    if ("findByStudentId".equals(method.getName())) {
                        Long studentId = (Long) args[0];
                        return appStore.values().stream()
                                .filter(a -> a.getStudent() != null && studentId.equals(a.getStudent().getId()))
                                .toList();
                    }
                    if ("findByJobId".equals(method.getName())) {
                        Long jobId = (Long) args[0];
                        return appStore.values().stream()
                                .filter(a -> a.getJob() != null && jobId.equals(a.getJob().getId()))
                                .toList();
                    }
                    if ("deleteAllInBatch".equals(method.getName())) {
                        @SuppressWarnings("unchecked")
                        Iterable<Application> entities = (Iterable<Application>) args[0];
                        for (Application a : entities) {
                            appStore.remove(a.getId());
                        }
                        return null;
                    }
                    return null;
                }
        );

        studentService = new StudentService(studentRepository, applicationRepository);
        companyService = new CompanyService(companyRepository, jobRepository, applicationRepository);
    }

    @AfterEach
    void tearDown() {
        studentStore.clear();
        companyStore.clear();
        jobStore.clear();
        appStore.clear();
    }

    @Test
    @DisplayName("89. Delete student with applications -> Safe cascade execution")
    void test89_DeleteStudentWithApplications_SafeCascade() {
        // Setup student and job
        Student student = new Student();
        student.setId(10L);
        student.setCollege("VNIT Nagpur");
        studentStore.put(10L, student);

        Job job = new Job();
        job.setId(200L);
        jobStore.put(200L, job);

        Application app1 = new Application();
        app1.setId(1L);
        app1.setStudent(student);
        app1.setJob(job);
        appStore.put(1L, app1);

        Application app2 = new Application();
        app2.setId(2L);
        app2.setStudent(student);
        app2.setJob(job);
        appStore.put(2L, app2);

        assertEquals(2, appStore.size());
        assertNotNull(studentStore.get(10L));

        // Execute Delete
        assertDoesNotThrow(() -> studentService.deleteStudent(10L));
        assertNull(studentStore.get(10L));
    }

    @Test
    @DisplayName("90. Verify student's applications removed upon student deletion")
    void test90_VerifyStudentApplicationsRemoved() {
        Student student = new Student();
        student.setId(15L);
        studentStore.put(15L, student);

        Job job = new Job();
        job.setId(201L);
        jobStore.put(201L, job);

        Application app = new Application();
        app.setId(101L);
        app.setStudent(student);
        app.setJob(job);
        appStore.put(101L, app);

        studentService.deleteStudent(15L);

        // Verify application was removed
        assertNull(appStore.get(101L));
        assertEquals(0, appStore.size());
    }

    @Test
    @DisplayName("91. Delete company with jobs -> Safe cascade execution")
    void test91_DeleteCompanyWithJobs_SafeCascade() {
        Company company = new Company();
        company.setId(5L);
        company.setCompanyName("Tech Corp");
        companyStore.put(5L, company);

        Job job1 = new Job();
        job1.setId(301L);
        job1.setCompany(company);
        jobStore.put(301L, job1);

        Job job2 = new Job();
        job2.setId(302L);
        job2.setCompany(company);
        jobStore.put(302L, job2);

        assertDoesNotThrow(() -> companyService.deleteCompany(5L));
        assertNull(companyStore.get(5L));
        assertNull(jobStore.get(301L));
        assertNull(jobStore.get(302L));
    }

    @Test
    @DisplayName("92. Company has jobs with applications -> delete company -> Safe cascade execution")
    void test92_CompanyWithJobsAndApplications_SafeCascade() {
        Company company = new Company();
        company.setId(8L);
        company.setCompanyName("Global Solutions");
        companyStore.put(8L, company);

        Student student = new Student();
        student.setId(50L);
        studentStore.put(50L, student);

        Job job = new Job();
        job.setId(401L);
        job.setCompany(company);
        jobStore.put(401L, job);

        Application app = new Application();
        app.setId(501L);
        app.setJob(job);
        app.setStudent(student);
        appStore.put(501L, app);

        assertDoesNotThrow(() -> companyService.deleteCompany(8L));
        assertNull(companyStore.get(8L));
    }

    @Test
    @DisplayName("93. Verify jobs removed when company is deleted")
    void test93_VerifyJobsRemoved() {
        Company company = new Company();
        company.setId(12L);
        companyStore.put(12L, company);

        Job job1 = new Job();
        job1.setId(601L);
        job1.setCompany(company);
        jobStore.put(601L, job1);

        Job job2 = new Job();
        job2.setId(602L);
        job2.setCompany(company);
        jobStore.put(602L, job2);

        assertEquals(2, jobStore.size());
        companyService.deleteCompany(12L);

        assertEquals(0, jobStore.size());
        assertNull(jobStore.get(601L));
        assertNull(jobStore.get(602L));
    }

    @Test
    @DisplayName("94. Verify applications removed when parent company/job is deleted")
    void test94_VerifyApplicationsRemoved() {
        Company company = new Company();
        company.setId(20L);
        companyStore.put(20L, company);

        Student student = new Student();
        student.setId(70L);
        studentStore.put(70L, student);

        Job job = new Job();
        job.setId(701L);
        job.setCompany(company);
        jobStore.put(701L, job);

        Application app1 = new Application();
        app1.setId(801L);
        app1.setJob(job);
        app1.setStudent(student);
        appStore.put(801L, app1);

        Application app2 = new Application();
        app2.setId(802L);
        app2.setJob(job);
        app2.setStudent(student);
        appStore.put(802L, app2);

        assertEquals(2, appStore.size());
        companyService.deleteCompany(20L);

        assertEquals(0, appStore.size());
        assertNull(appStore.get(801L));
        assertNull(appStore.get(802L));
    }

    @Test
    @DisplayName("95. No orphan records remain in database after cascade deletions")
    void test95_NoOrphanRecordsRemain() {
        // Setup 2 companies, 2 students, 3 jobs, 4 applications
        Company c1 = new Company(); c1.setId(100L); companyStore.put(100L, c1);
        Company c2 = new Company(); c2.setId(200L); companyStore.put(200L, c2);

        Student s1 = new Student(); s1.setId(1L); studentStore.put(1L, s1);
        Student s2 = new Student(); s2.setId(2L); studentStore.put(2L, s2);

        Job j1 = new Job(); j1.setId(11L); j1.setCompany(c1); jobStore.put(11L, j1);
        Job j2 = new Job(); j2.setId(22L); j2.setCompany(c1); jobStore.put(22L, j2);
        Job j3 = new Job(); j3.setId(33L); j3.setCompany(c2); jobStore.put(33L, j3);

        Application a1 = new Application(); a1.setId(10L); a1.setJob(j1); a1.setStudent(s1); appStore.put(10L, a1);
        Application a2 = new Application(); a2.setId(20L); a2.setJob(j2); a2.setStudent(s1); appStore.put(20L, a2);
        Application a3 = new Application(); a3.setId(30L); a3.setJob(j3); a3.setStudent(s1); appStore.put(30L, a3);
        Application a4 = new Application(); a4.setId(40L); a4.setJob(j3); a4.setStudent(s2); appStore.put(40L, a4);

        // Delete Company 1 (owns j1 and j2, and a1 and a2)
        companyService.deleteCompany(100L);

        // Verify remaining applications are only for Job 3 (belonging to Company 2)
        assertEquals(2, appStore.size());
        assertTrue(appStore.containsKey(30L));
        assertTrue(appStore.containsKey(40L));

        // Delete Student 1
        studentService.deleteStudent(1L);

        // Verify Application 3 (s1 on j3) removed, only Application 4 (s2 on j3) remains
        assertEquals(1, appStore.size());
        assertTrue(appStore.containsKey(40L));
        assertEquals(2L, appStore.get(40L).getStudent().getId());
        assertEquals(33L, appStore.get(40L).getJob().getId());
    }
}
