import axios from 'axios'
import { MockStore } from './mockData'

export const getActiveApiUrl = () => {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('spm_custom_api_url')
    if (custom) return custom.trim().replace(/\/+$/, '')
  }
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.trim().replace(/\/+$/, '')
  }
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    return 'http://localhost:8083'
  }
  return ''
}

const axiosInstance = axios.create({
  baseURL: getActiveApiUrl() || undefined,
  timeout: 5000,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const currentBaseUrl = getActiveApiUrl()
    if (currentBaseUrl) {
      config.baseURL = currentBaseUrl
    }

    const storedUser = localStorage.getItem('user')

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`
        }
      } catch (e) {
        console.error('Error parsing stored user', e)
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Mock Response Handler for Live Demo Mode / Offline Backend
function handleMockRequest(config) {
  const rawUrl = (config.url || '').toLowerCase()
  const cleanUrl = rawUrl.split('?')[0].replace(/^https?:\/\/[^\/]+/, '')
  const method = (config.method || 'get').toLowerCase()
  let data = config.data

  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      // keep as string
    }
  }

  const storedUserStr = localStorage.getItem('user')
  const currentUser = storedUserStr ? JSON.parse(storedUserStr) : null

  // 1. Auth Login
  if (cleanUrl.includes('/api/auth/login') && method === 'post') {
    const emailLower = (data?.email || '').trim().toLowerCase()
    const passwordInput = (data?.password || '').trim()

    const users = MockStore.getUsers()
    const foundUser = users.find((u) => u.email.toLowerCase() === emailLower)

    if (!foundUser) {
      const err = new Error('Invalid email or password. Access is restricted to registered accounts only.')
      err.response = {
        status: 401,
        data: { message: 'Invalid email or password. Access is restricted to authorized accounts only.' },
      }
      throw err
    }

    // Strictly enforce password requirement and exact match against user's own password
    if (!passwordInput || !foundUser.password || foundUser.password !== passwordInput) {
      const err = new Error('Invalid email or password.')
      err.response = {
        status: 401,
        data: { message: 'Invalid email or password. Please verify your credentials.' },
      }
      throw err
    }

    // Strictly enforce portal role restriction if requestedRole is provided
    const requestedRole = (data?.role || data?.requestedRole || '').trim().toUpperCase()
    if (requestedRole && foundUser.role.toUpperCase() !== requestedRole) {
      const err = new Error(`Access Denied: This portal is strictly restricted to ${requestedRole} accounts only.`)
      err.response = {
        status: 403,
        data: {
          message: `Access Denied: This portal is strictly restricted to ${requestedRole} accounts only. Your account role is ${foundUser.role}.`,
        },
      }
      throw err
    }

    return {
      data: {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        token: foundUser.token || `demo-token-${foundUser.id}`,
      },
      status: 200,
    }
  }

  // 2. Student Endpoints
  if ((cleanUrl === '/api/students/me' || cleanUrl.startsWith('/api/students/me')) && method === 'get') {
    const students = MockStore.getStudents()
    const student = students.find(
      (s) =>
        s.user?.email?.toLowerCase() === currentUser?.email?.toLowerCase() ||
        s.userId === currentUser?.id
    )
    if (!student) {
      const err = new Error('Student profile not found.')
      err.response = { status: 404, data: { message: 'Student profile not found. Please log in with a valid student account.' } }
      throw err
    }
    return { data: student, status: 200 }
  }

  if ((cleanUrl === '/api/students' || cleanUrl === '/api/students/') && method === 'get') {
    return { data: MockStore.getStudents(), status: 200 }
  }

  if (cleanUrl.startsWith('/api/students/') && method === 'delete') {
    const id = parseInt(cleanUrl.split('/api/students/')[1], 10)
    const students = MockStore.getStudents().filter((s) => s.id !== id)
    MockStore.saveStudents(students)
    return { data: { message: 'Student deleted successfully' }, status: 200 }
  }

  // 3. Company Endpoints
  if ((cleanUrl === '/api/companies/me' || cleanUrl.startsWith('/api/companies/me')) && method === 'get') {
    const companies = MockStore.getCompanies()
    const company = companies.find(
      (c) =>
        c.user?.email?.toLowerCase() === currentUser?.email?.toLowerCase() ||
        c.userId === currentUser?.id
    )
    if (!company) {
      const err = new Error('Company profile not found.')
      err.response = { status: 404, data: { message: 'Company profile not found. Please log in with a valid company account.' } }
      throw err
    }
    return { data: company, status: 200 }
  }

  if ((cleanUrl === '/api/companies' || cleanUrl === '/api/companies/') && method === 'get') {
    return { data: MockStore.getCompanies(), status: 200 }
  }

  if ((cleanUrl === '/api/companies' || cleanUrl === '/api/companies/') && method === 'post') {
    const companies = MockStore.getCompanies()
    let updatedCompany = data
    const existingIndex = companies.findIndex((c) => c.id === data.id || c.companyName === data.companyName)
    if (existingIndex >= 0) {
      companies[existingIndex] = { ...companies[existingIndex], ...data }
      updatedCompany = companies[existingIndex]
    } else {
      updatedCompany = { ...data, id: Date.now() }
      companies.push(updatedCompany)
    }
    MockStore.saveCompanies(companies)
    return { data: updatedCompany, status: 200 }
  }

  if (cleanUrl.startsWith('/api/companies/') && method === 'delete') {
    const id = parseInt(cleanUrl.split('/api/companies/')[1], 10)
    const companies = MockStore.getCompanies().filter((c) => c.id !== id)
    MockStore.saveCompanies(companies)
    return { data: { message: 'Company deleted successfully' }, status: 200 }
  }

  // 4. Job Endpoints
  if ((cleanUrl === '/api/jobs' || cleanUrl === '/api/jobs/') && method === 'get') {
    return { data: MockStore.getJobs(), status: 200 }
  }

  if (cleanUrl.startsWith('/api/jobs/') && !cleanUrl.includes('/applications') && method === 'get') {
    const id = parseInt(cleanUrl.split('/api/jobs/')[1], 10)
    const job = MockStore.getJobs().find((j) => j.id === id)
    if (!job) {
      const err = new Error('Job not found')
      err.response = { status: 404, data: { message: 'Job not found' } }
      throw err
    }
    return { data: job, status: 200 }
  }

  if ((cleanUrl === '/api/jobs' || cleanUrl === '/api/jobs/') && method === 'post') {
    const jobs = MockStore.getJobs()
    const newJob = {
      id: Date.now(),
      title: data.title,
      description: data.description,
      location: data.location,
      salary: data.salary,
      jobType: data.jobType || 'FULL_TIME',
      minimumCgpa: data.minimumCgpa || 6.0,
      experienceRequired: data.experienceRequired || 'Fresher',
      deadline: data.deadline,
      companyId: data.companyId || 1,
      company: MockStore.getCompanies().find((c) => c.id === data.companyId) || MockStore.getCompanies()[0],
      createdAt: new Date().toISOString(),
    }
    jobs.unshift(newJob)
    MockStore.saveJobs(jobs)
    return { data: newJob, status: 201 }
  }

  if (cleanUrl.startsWith('/api/jobs/') && method === 'delete') {
    const id = parseInt(cleanUrl.split('/api/jobs/')[1], 10)
    const jobs = MockStore.getJobs().filter((j) => j.id !== id)
    MockStore.saveJobs(jobs)
    return { data: { message: 'Job deleted successfully' }, status: 200 }
  }

  // 5. Application Endpoints
  if ((cleanUrl === '/api/applications/my' || cleanUrl.startsWith('/api/applications/my')) && method === 'get') {
    const apps = MockStore.getApplications()
    const currentStudent = MockStore.getStudents().find(
      (s) =>
        s.user?.email?.toLowerCase() === currentUser?.email?.toLowerCase() ||
        s.userId === currentUser?.id ||
        s.user?.name?.toLowerCase() === currentUser?.name?.toLowerCase()
    )

    if (!currentStudent) {
      return { data: [], status: 200 }
    }

    const myApps = apps.filter(
      (a) =>
        a.studentId === currentStudent?.id ||
        a.student?.id === currentStudent?.id ||
        a.student?.user?.email?.toLowerCase() === currentUser?.email?.toLowerCase()
    )
    return { data: myApps, status: 200 }
  }

  if ((cleanUrl === '/api/applications' || cleanUrl === '/api/applications/') && method === 'get') {
    return { data: MockStore.getApplications(), status: 200 }
  }

  if ((cleanUrl === '/api/applications' || cleanUrl === '/api/applications/') && method === 'post') {
    const apps = MockStore.getApplications()
    const jobId = data.jobId || data.job_id || data.job?.id
    const job = MockStore.getJobs().find((j) => j.id === jobId)
    if (!job) {
      const err = new Error('Job not found')
      err.response = { status: 404, data: { message: 'Job not found' } }
      throw err
    }

    const currentStudent = MockStore.getStudents().find(
      (s) =>
        s.user?.email?.toLowerCase() === currentUser?.email?.toLowerCase() ||
        s.userId === currentUser?.id ||
        s.user?.name?.toLowerCase() === currentUser?.name?.toLowerCase()
    )

    if (!currentStudent) {
      const err = new Error('Only registered students can apply for jobs.')
      err.response = { status: 403, data: { message: 'Only registered students can apply for jobs.' } }
      throw err
    }

    // Check CGPA eligibility
    if (job.minimumCgpa && currentStudent.cgpa < job.minimumCgpa) {
      const err = new Error(`CGPA requirement not met (Requires: ${job.minimumCgpa}, Your CGPA: ${currentStudent.cgpa})`)
      err.response = {
        status: 400,
        data: { message: `CGPA requirement not met (Requires: ${job.minimumCgpa}, Your CGPA: ${currentStudent.cgpa})` },
      }
      throw err
    }

    // Prevent duplicate application to same job
    const alreadyApplied = apps.some(
      (a) =>
        (a.studentId === currentStudent?.id || a.student?.id === currentStudent?.id) &&
        (a.jobId === job.id || a.job?.id === job.id)
    )

    if (alreadyApplied) {
      const err = new Error('You have already applied for this position.')
      err.response = {
        status: 400,
        data: { message: 'You have already applied for this position.' },
      }
      throw err
    }

    const newApp = {
      id: Date.now(),
      studentId: currentStudent.id,
      student: currentStudent,
      jobId: job.id,
      job,
      status: 'PENDING',
      appliedAt: new Date().toISOString(),
    }
    apps.unshift(newApp)
    MockStore.saveApplications(apps)
    return { data: newApp, status: 201 }
  }

  if (cleanUrl.includes('/api/applications/') && cleanUrl.endsWith('/status') && (method === 'patch' || method === 'put')) {
    const idStr = cleanUrl.split('/api/applications/')[1].split('/status')[0]
    const id = parseInt(idStr, 10)
    const apps = MockStore.getApplications()
    const app = apps.find((a) => a.id === id)
    if (app) {
      app.status = data.status || app.status
      MockStore.saveApplications(apps)
      return { data: app, status: 200 }
    }
    return { data: { message: 'Application status updated' }, status: 200 }
  }

  if (cleanUrl.startsWith('/api/applications/') && method === 'delete') {
    const id = parseInt(cleanUrl.split('/api/applications/')[1], 10)
    const apps = MockStore.getApplications().filter((a) => a.id !== id)
    MockStore.saveApplications(apps)
    return { data: { message: 'Application deleted successfully' }, status: 200 }
  }

  if (cleanUrl.startsWith('/api/jobs/') && (method === 'put' || method === 'patch')) {
    const id = parseInt(cleanUrl.split('/api/jobs/')[1], 10)
    const jobs = MockStore.getJobs()
    const jobIdx = jobs.findIndex((j) => j.id === id)
    if (jobIdx >= 0) {
      jobs[jobIdx] = { ...jobs[jobIdx], ...data }
      MockStore.saveJobs(jobs)
      return { data: jobs[jobIdx], status: 200 }
    }
    return { data: { message: 'Job updated' }, status: 200 }
  }

  // 6. User Endpoints
  if ((cleanUrl === '/api/users' || cleanUrl === '/api/users/') && method === 'get') {
    return { data: MockStore.getUsers(), status: 200 }
  }

  if (cleanUrl.startsWith('/api/users/') && method === 'delete') {
    const id = parseInt(cleanUrl.split('/api/users/')[1], 10)
    const users = MockStore.getUsers().filter((u) => u.id !== id)
    MockStore.saveUsers(users)
    return { data: { message: 'User deleted successfully' }, status: 200 }
  }

  return { data: [], status: 200 }
}

// Interceptor: Fallback to interactive MockStore only if real backend is unreachable
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token is expired / 401 Unauthorized on a protected endpoint, clear session and redirect
    if (error.response && error.response.status === 401 && !error.config?.url?.includes('/api/auth/login')) {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      if (typeof window !== 'undefined' && !window.location.hash.includes('/login')) {
        window.location.href = '#/'
      }
      return Promise.reject(error)
    }

    // If backend returned explicit HTTP 400, 401 (login), or 403 auth/business errors, propagate directly to UI
    if (error.response && (error.response.status === 400 || error.response.status === 401 || error.response.status === 403)) {
      return Promise.reject(error)
    }

    // Only fallback to interactive MockStore if backend is offline/network error/unreachable (e.g. GitHub Pages)
    if (
      !getActiveApiUrl() ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      !error.response ||
      error.response.status === 404 ||
      error.response.status >= 500
    ) {
      try {
        const mockResponse = handleMockRequest(error.config)
        return Promise.resolve(mockResponse)
      } catch (mockErr) {
        return Promise.reject(mockErr)
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
