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

-- 2. Students
INSERT INTO students (id, user_id, college, degree, branch, graduation_year, cgpa, phone, resume_url) VALUES
(1, 6, 'VNIT Nagpur', 'B.Tech', 'CSE', 2025, 8.50, '6300373746', 'https://Nitya.com'),
(2, 8, 'NIT Trichy', 'B.Tech', 'ECE', 2026, 7.15, '9177323879', 'https://srujan.com'),
(3, 7, 'NIT Surat', 'B.Tech', 'ECE', 2026, 8.29, '8106821142', 'https://Bhargav.com'),
(4, 9, 'NIT Warangal', 'BTech', 'CSE', 2026, 7.50, '9063443206', 'https://Anurag.com'),
(5, 5, 'VNIT Nagpur', 'B.Tech', 'CSE', 2025, 9.00, '8125622401', 'https://rishitha.com')
ON DUPLICATE KEY UPDATE college=VALUES(college), phone=VALUES(phone), cgpa=VALUES(cgpa), resume_url=VALUES(resume_url);

-- 3. Companies
INSERT INTO companies (id, user_id, company_name, description, website, location) VALUES
(1, 2, 'Microsoft', 'Software development company', 'https://www.microsoft.com/en-in/', 'Hyderabad'),
(2, 3, 'Perficient', 'Associate Technical Consultant', 'https://www.perficient.com/', 'Nagpur'),
(3, 4, 'Accenture', 'AI Engineer', 'https://www.accenture.com/in-en', 'Bangalore')
ON DUPLICATE KEY UPDATE company_name=VALUES(company_name), location=VALUES(location);

-- 4. Jobs (All 15 Jobs from MySQL Workbench)
INSERT INTO jobs (id, company_id, title, description, location, salary, job_type, minimum_cgpa, experience_required, deadline) VALUES
(1, 1, 'Java Backend Developer', 'Design and develop scalable microservices, REST APIs, and distributed architectures.', 'Hyderabad', 1450000.00, 'FULL_TIME', 7.50, '0-2 years', '2026-09-30'),
(2, 1, 'React Frontend Developer', 'Build modern, responsive, and high-performance UI components with React.', 'Hyderabad', 1300000.00, 'FULL_TIME', 7.00, '0-2 years', '2026-08-30'),
(3, 1, 'Full Stack Developer', 'Develop end-to-end web applications combining Spring Boot backends and React frontends.', 'Hyderabad', 1600000.00, 'FULL_TIME', 8.00, '0-2 years', '2026-08-30'),
(4, 1, 'Python Developer', 'Create data-driven backends, automation pipelines, and scalable microservices.', 'Hyderabad', 1350000.00, 'FULL_TIME', 7.50, '0-2 years', '2026-08-10'),
(5, 1, 'Software Engineer', 'Write clean, efficient, and maintainable software for high-scale enterprise systems.', 'Hyderabad', 1500000.00, 'FULL_TIME', 8.00, '0-2 years', '2026-08-30'),
(6, 1, 'Data Analyst', 'Extract, transform, and visualize complex business datasets with SQL and BI dashboards.', 'Hyderabad', 1150000.00, 'FULL_TIME', 7.00, '0-2 years', '2026-08-10'),
(7, 1, 'Machine Learning Engineer', 'Design, train, and deploy predictive ML models and neural architectures.', 'Hyderabad', 2100000.00, 'FULL_TIME', 8.50, '0-2 years', '2026-08-30'),
(8, 1, 'DevOps Engineer', 'Manage CI/CD pipelines, container orchestration with Docker/K8s, and cloud infra.', 'Bengaluru', 1750000.00, 'FULL_TIME', 7.50, '0-2 years', '2026-08-10'),
(9, 1, 'Cloud Engineer', 'Architect, deploy, and maintain secure, highly available Azure cloud infrastructure.', 'Hyderabad', 1800000.00, 'FULL_TIME', 8.00, '0-2 years', '2026-08-30'),
(10, 2, 'Database Administrator', 'Optimize relational database performance, manage high-availability clusters and backups.', 'Hyd', 1200000.00, 'FULL_TIME', 7.00, '0', '2026-09-05'),
(11, 3, 'QA Automation Engineer', 'Develop automated testing frameworks using Selenium, JUnit, and Cypress.', 'Hyd', 1050000.00, 'FULL_TIME', 6.50, '0', '2026-09-05'),
(12, 3, 'Cybersecurity Analyst', 'Perform vulnerability assessments, network security audits, and penetration testing.', 'Hyd', 1900000.00, 'FULL_TIME', 8.00, '0', '2026-08-14'),
(13, 3, 'Mobile App Developer', 'Build native and cross-platform mobile applications using Flutter and React Native.', 'Hyd', 1400000.00, 'FULL_TIME', 7.50, '0', '2026-09-05'),
(14, 3, 'UI/UX Designer', 'Create wireframes, user journeys, interactive prototypes, and design systems in Figma.', 'Hyd', 1100000.00, 'FULL_TIME', 6.50, '0', '2026-09-05'),
(15, 3, 'System Engineer', 'Configure, maintain, and monitor enterprise server infrastructure and networks.', 'Hyd', 1250000.00, 'FULL_TIME', 7.00, '0', '2026-09-05')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 5. Applications
INSERT INTO applications (id, student_id, job_id, status) VALUES
(1, 1, 1, 'SELECTED'),
(2, 1, 3, 'SHORTLISTED'),
(3, 2, 8, 'SELECTED'),
(4, 3, 4, 'PENDING'),
(5, 4, 14, 'SHORTLISTED'),
(6, 5, 1, 'PENDING')
ON DUPLICATE KEY UPDATE status=VALUES(status);
