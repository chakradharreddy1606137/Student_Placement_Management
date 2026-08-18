-- Main Production Dataset for Student Placement Management System

-- 1. Users
-- Passwords: admin -> chakri123 / password123, recruiters -> name123 / password123, students -> name123 / password123
INSERT INTO users (id, name, email, password, role) VALUES
(1, 'Chakri', 'chakri@gmail.com', '$2a$10$7Q9hM4d7O5f9N4W7w/Oq..E1K2fP3d4v5a6b7c8d9e0f1g2h3i4j', 'ADMIN'),
(2, 'Harsha', 'harsha@gmail.com', '$2a$10$7Q9hM4d7O5f9N4W7w/Oq..E1K2fP3d4v5a6b7c8d9e0f1g2h3i4j', 'COMPANY'),
(3, 'Sai Charan', 'saicharan@gmail.com', '$2a$10$7Q9hM4d7O5f9N4W7w/Oq..E1K2fP3d4v5a6b7c8d9e0f1g2h3i4j', 'COMPANY'),
(4, 'Indra', 'indra@gmail.com', '$2a$10$7Q9hM4d7O5f9N4W7w/Oq..E1K2fP3d4v5a6b7c8d9e0f1g2h3i4j', 'COMPANY'),
(5, 'Rishitha', 'rishitha@gmail.com', '$2a$10$7Q9hM4d7O5f9N4W7w/Oq..E1K2fP3d4v5a6b7c8d9e0f1g2h3i4j', 'STUDENT'),
(6, 'Nitya', 'nitya@gmail.com', '$2a$10$7Q9hM4d7O5f9N4W7w/Oq..E1K2fP3d4v5a6b7c8d9e0f1g2h3i4j', 'STUDENT'),
(7, 'Bhargav', 'bhargav@gmail.com', '$2a$10$7Q9hM4d7O5f9N4W7w/Oq..E1K2fP3d4v5a6b7c8d9e0f1g2h3i4j', 'STUDENT'),
(8, 'Srujan', 'srujan@gmail.com', '$2a$10$7Q9hM4d7O5f9N4W7w/Oq..E1K2fP3d4v5a6b7c8d9e0f1g2h3i4j', 'STUDENT'),
(9, 'Anurag', 'anurag@gmail.com', '$2a$10$7Q9hM4d7O5f9N4W7w/Oq..E1K2fP3d4v5a6b7c8d9e0f1g2h3i4j', 'STUDENT')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Students
INSERT INTO students (id, user_id, college, degree, branch, graduation_year, cgpa, phone, resume_url) VALUES
(1, 5, 'National Institute of Technology', 'B.Tech', 'Computer Science & Engineering', 2026, 9.40, '+91 98765 43210', 'https://example.com/rishitha_resume.pdf'),
(2, 6, 'National Institute of Technology', 'B.Tech', 'Computer Science & Engineering', 2026, 9.10, '+91 98765 43211', 'https://example.com/nitya_resume.pdf'),
(3, 7, 'National Institute of Technology', 'B.Tech', 'Computer Science & Engineering', 2026, 8.80, '+91 98765 43212', 'https://example.com/bhargav_resume.pdf'),
(4, 8, 'National Institute of Technology', 'B.Tech', 'Information Technology', 2026, 8.70, '+91 98765 43213', 'https://example.com/srujan_resume.pdf'),
(5, 9, 'National Institute of Technology', 'B.Tech', 'Electronics & Communication', 2026, 8.90, '+91 98765 43214', 'https://example.com/anurag_resume.pdf')
ON DUPLICATE KEY UPDATE college=VALUES(college);

-- 3. Companies
INSERT INTO companies (id, user_id, company_name, description, website, location) VALUES
(1, 2, 'Google Cloud', 'Global tech leader in cloud computing, AI, and distributed systems.', 'https://careers.google.com', 'Bengaluru / Hyderabad'),
(2, 3, 'Microsoft', 'Empowering every person and organization on the planet to achieve more.', 'https://careers.microsoft.com', 'Hyderabad, India'),
(3, 4, 'Amazon AWS', 'Pioneering cloud computing infrastructure and global distributed tech.', 'https://amazon.jobs', 'Bengaluru, India')
ON DUPLICATE KEY UPDATE company_name=VALUES(company_name);

-- 4. Skills
INSERT INTO skills (id, name) VALUES
(1, 'Java'),
(2, 'Spring Boot'),
(3, 'React'),
(4, 'MySQL'),
(5, 'Docker'),
(6, 'AWS / Cloud')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 5. Jobs
INSERT INTO jobs (id, company_id, title, description, location, salary, job_type, minimum_cgpa, experience_required, deadline) VALUES
(1, 1, 'Software Development Engineer (SDE-1)', 'Build high-performance distributed backend services using Java, Spring Boot, and React.', 'Bengaluru, India', 2400000.00, 'FULL_TIME', 7.50, 'Fresher', '2026-11-30'),
(2, 2, 'Cloud Solutions Engineer', 'Design and build scalable Azure enterprise cloud architectures.', 'Hyderabad, India', 2100000.00, 'FULL_TIME', 7.00, 'Fresher', '2026-12-15'),
(3, 3, 'AWS DevOps & Backend Engineer', 'Develop high-scale cloud services, CI/CD automation, and microservices.', 'Bengaluru, India', 2250000.00, 'FULL_TIME', 8.00, '0-1 Year', '2026-10-31')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 6. Applications
INSERT INTO applications (id, student_id, job_id, status) VALUES
(1, 1, 1, 'SELECTED'),
(2, 2, 2, 'SHORTLISTED'),
(3, 3, 3, 'PENDING')
ON DUPLICATE KEY UPDATE status=VALUES(status);
