-- Exact Production Dataset matching MySQL Workbench

-- 1. Users
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

-- 2. Students (Exact records from Workbench)
INSERT INTO students (id, user_id, college, degree, branch, graduation_year, cgpa, phone, resume_url) VALUES
(1, 6, 'VNIT Nagpur', 'B.Tech', 'CSE', 2025, 8.50, '6300373746', 'https://Nitya.com'),
(2, 8, 'NIT Trichy', 'B.Tech', 'ECE', 2026, 7.15, '9177323879', 'https://srujan.com'),
(3, 7, 'NIT Surat', 'B.Tech', 'ECE', 2026, 8.29, '8106821142', 'https://Bhargav.com'),
(4, 9, 'NIT Warangal', 'BTech', 'CSE', 2026, 7.50, '9063443206', 'https://Anurag.com'),
(5, 5, 'VNIT Nagpur', 'B.Tech', 'CSE', 2025, 9.00, '8125622401', 'https://rishitha.com')
ON DUPLICATE KEY UPDATE college=VALUES(college), phone=VALUES(phone), cgpa=VALUES(cgpa), resume_url=VALUES(resume_url);

-- 3. Companies (Exact records from Workbench)
INSERT INTO companies (id, user_id, company_name, description, website, location) VALUES
(1, 2, 'Microsoft', 'Software development company', 'https://www.microsoft.com/en-in/', 'Hyderabad'),
(2, 3, 'Perficient', 'Associate Technical Consultant', 'https://www.perficient.com/', 'Nagpur'),
(3, 4, 'Accenture', 'AI Engineer', 'https://www.accenture.com/in-en', 'Bangalore')
ON DUPLICATE KEY UPDATE company_name=VALUES(company_name), location=VALUES(location);

-- 4. Jobs
INSERT INTO jobs (id, company_id, title, description, location, salary, job_type, minimum_cgpa, experience_required, deadline) VALUES
(1, 1, 'Software Development Engineer (SDE-1)', 'Build high-performance distributed backend services using Java, Spring Boot, and React.', 'Hyderabad', 2400000.00, 'FULL_TIME', 7.50, 'Fresher', '2026-11-30'),
(2, 2, 'Associate Technical Consultant', 'Design, develop, and deliver client-facing cloud software systems.', 'Nagpur', 1600000.00, 'FULL_TIME', 7.00, 'Fresher', '2026-12-15'),
(3, 3, 'AI Engineer', 'Develop generative AI pipelines, microservices, and deep learning algorithms.', 'Bangalore', 2200000.00, 'FULL_TIME', 8.00, '0-1 Year', '2026-10-31')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 5. Applications
INSERT INTO applications (id, student_id, job_id, status) VALUES
(1, 1, 1, 'SELECTED'),
(2, 2, 2, 'SHORTLISTED'),
(3, 3, 3, 'PENDING')
ON DUPLICATE KEY UPDATE status=VALUES(status);
