// Interactive Mock Storage for Live GitHub Pages Demo Mode

const STORAGE_KEYS = {
  USERS: 'spm_demo_users',
  STUDENTS: 'spm_demo_students',
  COMPANIES: 'spm_demo_companies',
  JOBS: 'spm_demo_jobs',
  APPLICATIONS: 'spm_demo_applications',
}

const DEFAULT_USERS = [
  { id: 1, name: 'Chakri (Admin)', email: 'chakri@gmail.com', role: 'ADMIN', token: 'demo-admin-jwt-token' },
  { id: 2, name: 'Harsha (Google Recruiter)', email: 'harsha@gmail.com', role: 'COMPANY', token: 'demo-harsha-jwt-token' },
  { id: 3, name: 'Sai Charan (Microsoft Recruiter)', email: 'saicharan@gmail.com', role: 'COMPANY', token: 'demo-saicharan-jwt-token' },
  { id: 4, name: 'Indra (Amazon Recruiter)', email: 'indra@gmail.com', role: 'COMPANY', token: 'demo-indra-jwt-token' },
  { id: 5, name: 'Rishitha (Student)', email: 'rishitha@gmail.com', role: 'STUDENT', token: 'demo-rishitha-jwt-token' },
  { id: 6, name: 'Nitya (Student)', email: 'nitya@gmail.com', role: 'STUDENT', token: 'demo-nitya-jwt-token' },
  { id: 7, name: 'Bhargav (Student)', email: 'bhargav@gmail.com', role: 'STUDENT', token: 'demo-bhargav-jwt-token' },
  { id: 8, name: 'Srujan (Student)', email: 'srujan@gmail.com', role: 'STUDENT', token: 'demo-srujan-jwt-token' },
  { id: 9, name: 'Anurag (Student)', email: 'anurag@gmail.com', role: 'STUDENT', token: 'demo-anurag-jwt-token' },
]

const DEFAULT_STUDENTS = [
  {
    id: 1,
    userId: 5,
    user: { id: 5, name: 'Rishitha', email: 'rishitha@gmail.com' },
    college: 'National Institute of Technology',
    degree: 'B.Tech',
    branch: 'Computer Science & Engineering',
    graduationYear: 2026,
    cgpa: 9.4,
    phone: '+91 98765 43210',
    resumeUrl: 'https://example.com/rishitha_resume.pdf',
  },
  {
    id: 2,
    userId: 6,
    user: { id: 6, name: 'Nitya', email: 'nitya@gmail.com' },
    college: 'National Institute of Technology',
    degree: 'B.Tech',
    branch: 'Computer Science & Engineering',
    graduationYear: 2026,
    cgpa: 9.1,
    phone: '+91 98765 43211',
    resumeUrl: 'https://example.com/nitya_resume.pdf',
  },
  {
    id: 3,
    userId: 7,
    user: { id: 7, name: 'Bhargav', email: 'bhargav@gmail.com' },
    college: 'National Institute of Technology',
    degree: 'B.Tech',
    branch: 'Computer Science & Engineering',
    graduationYear: 2026,
    cgpa: 8.8,
    phone: '+91 98765 43212',
    resumeUrl: 'https://example.com/bhargav_resume.pdf',
  },
  {
    id: 4,
    userId: 8,
    user: { id: 8, name: 'Srujan', email: 'srujan@gmail.com' },
    college: 'National Institute of Technology',
    degree: 'B.Tech',
    branch: 'Information Technology',
    graduationYear: 2026,
    cgpa: 8.7,
    phone: '+91 98765 43213',
    resumeUrl: 'https://example.com/srujan_resume.pdf',
  },
  {
    id: 5,
    userId: 9,
    user: { id: 9, name: 'Anurag', email: 'anurag@gmail.com' },
    college: 'National Institute of Technology',
    degree: 'B.Tech',
    branch: 'Electronics & Communication',
    graduationYear: 2026,
    cgpa: 8.9,
    phone: '+91 98765 43214',
    resumeUrl: 'https://example.com/anurag_resume.pdf',
  },
]

const DEFAULT_COMPANIES = [
  {
    id: 1,
    userId: 2,
    companyName: 'Google Cloud',
    user: { id: 2, name: 'Harsha', email: 'harsha@gmail.com' },
    location: 'Bengaluru / Hyderabad',
    website: 'https://careers.google.com',
    description: 'Global technology leader in cloud computing, artificial intelligence, and high-scale distributed systems.',
  },
  {
    id: 2,
    userId: 3,
    companyName: 'Microsoft',
    user: { id: 3, name: 'Sai Charan', email: 'saicharan@gmail.com' },
    location: 'Hyderabad, India',
    website: 'https://careers.microsoft.com',
    description: 'Empowering every person and organization on the planet to achieve more with modern software & AI.',
  },
  {
    id: 3,
    userId: 4,
    companyName: 'Amazon AWS',
    user: { id: 4, name: 'Indra', email: 'indra@gmail.com' },
    location: 'Bengaluru, India',
    website: 'https://amazon.jobs',
    description: 'Pioneering cloud computing infrastructure and global e-commerce technologies.',
  },
]

const DEFAULT_JOBS = [
  {
    id: 1,
    companyId: 1,
    company: DEFAULT_COMPANIES[0],
    title: 'Software Development Engineer (SDE-1)',
    description: 'Design and build high-throughput backend microservices in Java/Spring Boot and modern React frontend architectures.',
    location: 'Bengaluru, India',
    salary: 2200000,
    jobType: 'FULL_TIME',
    minimumCgpa: 7.5,
    experienceRequired: '0-1 Year (Fresher)',
    deadline: '2026-11-30',
    createdAt: '2026-08-01T10:00:00',
  },
  {
    id: 2,
    companyId: 1,
    company: DEFAULT_COMPANIES[0],
    title: 'Cloud Infrastructure Engineer',
    description: 'Build automated CI/CD pipelines, Kubernetes container orchestration, and multi-region AWS/GCP deployments.',
    location: 'Hyderabad, India',
    salary: 1800000,
    jobType: 'FULL_TIME',
    minimumCgpa: 7.0,
    experienceRequired: 'Fresher',
    deadline: '2026-11-15',
    createdAt: '2026-08-05T12:00:00',
  },
  {
    id: 3,
    companyId: 2,
    company: DEFAULT_COMPANIES[1],
    title: 'Frontend React / Full-Stack Engineer',
    description: 'Develop intuitive, high-performance web applications using React, TypeScript, and state-of-the-art UI design principles.',
    location: 'Remote / Bengaluru',
    salary: 1650000,
    jobType: 'FULL_TIME',
    minimumCgpa: 6.5,
    experienceRequired: 'Fresher',
    deadline: '2026-10-25',
    createdAt: '2026-08-10T14:30:00',
  },
  {
    id: 4,
    companyId: 3,
    company: DEFAULT_COMPANIES[2],
    title: 'Summer Tech Intern 2026',
    description: 'Exciting 6-month full-time internship with hands-on exposure to distributed caching, database indexing, and REST APIs.',
    location: 'Hyderabad, India',
    salary: 850000,
    jobType: 'INTERNSHIP',
    minimumCgpa: 8.0,
    experienceRequired: 'Final Year / Pre-Final Year',
    deadline: '2026-09-30',
    createdAt: '2026-08-12T09:00:00',
  },
]

const DEFAULT_APPLICATIONS = [
  {
    id: 1,
    studentId: 1,
    student: DEFAULT_STUDENTS[0],
    jobId: 1,
    job: DEFAULT_JOBS[0],
    status: 'PENDING',
    appliedAt: '2026-08-15T10:30:00',
  },
  {
    id: 2,
    studentId: 1,
    student: DEFAULT_STUDENTS[0],
    jobId: 3,
    job: DEFAULT_JOBS[2],
    status: 'ACCEPTED',
    appliedAt: '2026-08-10T14:15:00',
  },
  {
    id: 3,
    studentId: 2,
    student: DEFAULT_STUDENTS[1],
    jobId: 1,
    job: DEFAULT_JOBS[0],
    status: 'SELECTED',
    appliedAt: '2026-08-12T09:00:00',
  },
  {
    id: 4,
    studentId: 3,
    student: DEFAULT_STUDENTS[2],
    jobId: 2,
    job: DEFAULT_JOBS[1],
    status: 'PENDING',
    appliedAt: '2026-08-14T16:00:00',
  },
]

function getFromStorage(key, fallback) {
  try {
    const item = localStorage.getItem(key)
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback))
      return fallback
    }
    return JSON.parse(item)
  } catch (e) {
    return fallback
  }
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save to storage', e)
  }
}

export const MockStore = {
  getUsers: () => getFromStorage(STORAGE_KEYS.USERS, DEFAULT_USERS),
  getStudents: () => getFromStorage(STORAGE_KEYS.STUDENTS, DEFAULT_STUDENTS),
  saveStudents: (data) => saveToStorage(STORAGE_KEYS.STUDENTS, data),
  getCompanies: () => getFromStorage(STORAGE_KEYS.COMPANIES, DEFAULT_COMPANIES),
  saveCompanies: (data) => saveToStorage(STORAGE_KEYS.COMPANIES, data),
  getJobs: () => getFromStorage(STORAGE_KEYS.JOBS, DEFAULT_JOBS),
  saveJobs: (data) => saveToStorage(STORAGE_KEYS.JOBS, data),
  getApplications: () => getFromStorage(STORAGE_KEYS.APPLICATIONS, DEFAULT_APPLICATIONS),
  saveApplications: (data) => saveToStorage(STORAGE_KEYS.APPLICATIONS, data),
  resetDemoData: () => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS))
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(DEFAULT_STUDENTS))
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(DEFAULT_COMPANIES))
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(DEFAULT_JOBS))
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(DEFAULT_APPLICATIONS))
  },
}
