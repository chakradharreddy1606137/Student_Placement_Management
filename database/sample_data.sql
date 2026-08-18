-- Sample Seed Data for Student Placement Management System
-- Use this file to populate initial records into your MySQL database

-- 1. Users (Default password is 'password123' - BCrypt hashed)
-- PasswordAutoEncoderRunner will also auto-hash if plain text is inserted
INSERT INTO users (id, name, email, password, role) VALUES
(1, 'Alex Sharma', 'student@example.com', '$2a$10$7Q9hM4d7O5f9N4W7w/Oq..E1K2fP3d4v5a6b7c8d9e0f1g2h3i4j', 'STUDENT'),
(2, 'Google Campus Recruiter', 'recruiter@google.com', '$2a$10$7Q9hM4d7O5f9N4W7w/Oq..E1K2fP3d4v5a6b7c8d9e0f1g2h3i4j', 'COMPANY'),
(3, 'Placement Officer', 'admin@example.com', '$2a$10$7Q9hM4d7O5f9N4W7w/Oq..E1K2fP3d4v5a6b7c8d9e0f1g2h3i4j', 'ADMIN'),
(4, 'Priya Patel', 'priya@example.com', '$2a$10$7Q9hM4d7O5f9N4W7w/Oq..E1K2fP3d4v5a6b7c8d9e0f1g2h3i4j', 'STUDENT'),
(5, 'Microsoft Talent Team', 'recruiter@microsoft.com', '$2a$10$7Q9hM4d7O5f9N4W7w/Oq..E1K2fP3d4v5a6b7c8d9e0f1g2h3i4j', 'COMPANY')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Students
INSERT INTO students (id, user_id, college, degree, branch, graduation_year, cgpa, phone, resume_url) VALUES
(1, 1, 'National Institute of Technology', 'B.Tech', 'Computer Science & Engineering', 2026, 8.90, '+91 98765 43210', 'https://example.com/alex_resume.pdf'),
(2, 4, 'IIT Bombay', 'B.Tech', 'Information Technology', 2026, 9.40, '+91 98765 43211', 'https://example.com/priya_resume.pdf')
ON DUPLICATE KEY UPDATE college=VALUES(college);

-- 3. Companies
INSERT INTO companies (id, user_id, company_name, description, website, location) VALUES
(1, 2, 'Google Cloud', 'Global technology leader in cloud computing, artificial intelligence, and high-scale distributed systems.', 'https://careers.google.com', 'Bengaluru / Hyderabad'),
(2, 5, 'Microsoft', 'Empowering every person and organization on the planet to achieve more with modern software & AI.', 'https://careers.microsoft.com', 'Hyderabad, India')
ON DUPLICATE KEY UPDATE company_name=VALUES(company_name);

-- 4. Skills
INSERT INTO skills (id, name) VALUES
(1, 'Java'),
(2, 'Spring Boot'),
(3, 'React'),
(4, 'MySQL'),
(5, 'Docker'),
(6, 'Python'),
(7, 'Cloud Architecture')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 5. Jobs
INSERT INTO jobs (id, company_id, title, description, location, salary, job_type, minimum_cgpa, experience_required, deadline) VALUES
(1, 1, 'Software Development Engineer (SDE-1)', 'Design and build high-throughput backend microservices in Java/Spring Boot and modern React frontend architectures.', 'Bengaluru, India', 2200000.00, 'FULL_TIME', 7.50, '0-1 Year (Fresher)', '2026-11-30'),
(2, 1, 'Cloud Solutions Associate', 'Collaborate with enterprise clients to architect scalable Google Cloud Platform infrastructures and Kubernetes pipelines.', 'Hyderabad, India', 1850000.00, 'FULL_TIME', 7.00, 'Fresher', '2026-12-15'),
(3, 2, 'Full Stack Engineer', 'Develop end-to-end cloud products using TypeScript, React, Spring Boot, and Azure microservices.', 'Hyderabad, India', 2000000.00, 'FULL_TIME', 8.00, '0-2 Years', '2026-10-31')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 6. Applications
INSERT INTO applications (id, student_id, job_id, status) VALUES
(1, 1, 1, 'SHORTLISTED'),
(2, 1, 2, 'PENDING'),
(3, 2, 1, 'SELECTED')
ON DUPLICATE KEY UPDATE status=VALUES(status);
