package com.example.placement;

import com.example.placement.controller.ApplicationController;
import com.example.placement.model.Application;
import com.example.placement.model.Company;
import com.example.placement.model.Job;
import com.example.placement.model.Student;
import com.example.placement.model.User;
import com.example.placement.repository.ApplicationRepository;
import com.example.placement.repository.JobRepository;
import com.example.placement.repository.StudentRepository;
import com.example.placement.service.ApplicationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.lang.reflect.Proxy;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

public class ApplicationConcurrencyTest {

    private ApplicationController applicationController;
    private ApplicationService applicationService;

    private ApplicationRepository applicationRepository;
    private StudentRepository studentRepository;
    private JobRepository jobRepository;

    private Authentication studentAuth;
    private Student testStudent;
    private Job testJob;

    private final Map<Long, Application> appStore = new ConcurrentHashMap<>();
    private final Set<String> uniqueStudentJobPairs = Collections.synchronizedSet(new HashSet<>());

    @BeforeEach
    void setUp() {
        appStore.clear();
        uniqueStudentJobPairs.clear();

        studentAuth = new UsernamePasswordAuthenticationToken(
                "nitya@gmail.com",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_STUDENT"))
        );

        User studentUser = new User();
        studentUser.setId(10L);
        studentUser.setName("Nitya");
        studentUser.setEmail("nitya@gmail.com");
        studentUser.setRole("STUDENT");

        testStudent = new Student();
        testStudent.setId(1L);
        testStudent.setUser(studentUser);
        testStudent.setCollege("VNIT Nagpur");
        testStudent.setCgpa(new BigDecimal("8.50"));

        User recruiterUser = new User();
        recruiterUser.setId(3L);
        recruiterUser.setName("Harsha");
        recruiterUser.setEmail("harsha@gmail.com");

        Company company = new Company();
        company.setId(1L);
        company.setCompanyName("Microsoft");
        company.setUser(recruiterUser);

        testJob = new Job();
        testJob.setId(101L);
        testJob.setTitle("Software Engineer");
        testJob.setCompany(company);
        testJob.setMinimumCgpa(new BigDecimal("7.00"));
        testJob.setDeadline(LocalDate.now().plusDays(30));

        studentRepository = (StudentRepository) Proxy.newProxyInstance(
                StudentRepository.class.getClassLoader(),
                new Class<?>[]{StudentRepository.class},
                (proxy, method, args) -> {
                    if ("findByUserEmail".equals(method.getName())) {
                        return Optional.of(testStudent);
                    }
                    if ("findById".equals(method.getName())) {
                        return Optional.of(testStudent);
                    }
                    return null;
                }
        );

        jobRepository = (JobRepository) Proxy.newProxyInstance(
                JobRepository.class.getClassLoader(),
                new Class<?>[]{JobRepository.class},
                (proxy, method, args) -> {
                    if ("findById".equals(method.getName())) {
                        return Optional.of(testJob);
                    }
                    return null;
                }
        );

        applicationRepository = (ApplicationRepository) Proxy.newProxyInstance(
                ApplicationRepository.class.getClassLoader(),
                new Class<?>[]{ApplicationRepository.class},
                (proxy, method, args) -> {
                    if ("existsByStudentIdAndJobId".equals(method.getName())) {
                        Long sId = (Long) args[0];
                        Long jId = (Long) args[1];
                        return uniqueStudentJobPairs.contains(sId + "_" + jId);
                    }
                    if ("save".equals(method.getName())) {
                        Application a = (Application) args[0];
                        Long sId = a.getStudent().getId();
                        Long jId = a.getJob().getId();
                        String pairKey = sId + "_" + jId;

                        synchronized (uniqueStudentJobPairs) {
                            if (uniqueStudentJobPairs.contains(pairKey)) {
                                throw new DataIntegrityViolationException("Unique constraint violation: duplicate student-job application");
                            }
                            uniqueStudentJobPairs.add(pairKey);
                        }

                        if (a.getId() == null) {
                            a.setId((long) (appStore.size() + 1));
                        }
                        appStore.put(a.getId(), a);
                        return a;
                    }
                    return null;
                }
        );

        applicationService = new ApplicationService(applicationRepository, studentRepository, jobRepository);
        applicationController = new ApplicationController(applicationService);
    }

    @Test
    @DisplayName("118. Duplicate application race condition -> Exactly 1 succeeds, concurrent duplicate rejected")
    void test118_ConcurrentDuplicateApplicationRaceCondition() throws Exception {
        int numberOfConcurrentRequests = 10;
        ExecutorService executorService = Executors.newFixedThreadPool(numberOfConcurrentRequests);
        CountDownLatch readyLatch = new CountDownLatch(numberOfConcurrentRequests);
        CountDownLatch startLatch = new CountDownLatch(1);

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger rejectedCount = new AtomicInteger(0);

        List<Future<?>> futures = new ArrayList<>();

        for (int i = 0; i < numberOfConcurrentRequests; i++) {
            futures.add(executorService.submit(() -> {
                readyLatch.countDown();
                try {
                    startLatch.await(); // Simultaneous release of all parallel threads
                    Application app = new Application();
                    app.setJob(testJob);

                    ResponseEntity<Application> res = applicationController.createApplication(app, studentAuth);
                    if (res.getStatusCode() == HttpStatus.CREATED) {
                        successCount.incrementAndGet();
                    }
                } catch (IllegalArgumentException | DataIntegrityViolationException ex) {
                    rejectedCount.incrementAndGet();
                } catch (Exception ex) {
                    if (ex.getCause() instanceof IllegalArgumentException || ex.getCause() instanceof DataIntegrityViolationException) {
                        rejectedCount.incrementAndGet();
                    }
                }
            }));
        }

        readyLatch.await(); // Wait for all threads to be primed
        startLatch.countDown(); // Fire all requests simultaneously!

        for (Future<?> f : futures) {
            f.get();
        }

        executorService.shutdown();

        // Verification
        assertEquals(1, successCount.get(), "Exactly ONE application must succeed under concurrent race conditions");
        assertEquals(numberOfConcurrentRequests - 1, rejectedCount.get(), "All other concurrent duplicate requests must be rejected");
        assertEquals(1, appStore.size(), "Only 1 application record must exist in the database");
    }
}
