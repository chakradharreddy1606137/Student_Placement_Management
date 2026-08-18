import axios from 'axios'
import { MockStore } from './mockData'

const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

const API_BASE_URL =
  import.meta.env.VITE_API_URL || (isLocalhost ? 'http://localhost:8083' : '')

const axiosInstance = axios.create({
  baseURL: API_BASE_URL || undefined,
  timeout: 4000,
})

axiosInstance.interceptors.request.use(
  (config) => {
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
  const url = config.url || ''
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
  if (url.includes('/api/auth/login') && method === 'post') {
    const users = MockStore.getUsers()
    const foundUser =
      users.find((u) => u.email.toLowerCase() === (data?.email || '').toLowerCase()) || {
        id: Date.now(),
        name: data?.email?.split('@')[0] || 'Demo User',
        email: data?.email,
        role: data?.role || (data?.email?.includes('company') ? 'COMPANY' : data?.email?.includes('admin') ? 'ADMIN' : 'STUDENT'),
        token: `demo-token-${Date.now()}`,
      }
    return { data: foundUser, status: 200 }
  }

  // 2. Student Endpoints
  if (url === '/api/students/me' && method === 'get') {
    const students = MockStore.getStudents()
    const student =
      students.find((s) => s.user?.email === currentUser?.email || s.userId === currentUser?.id) ||
      students[0]
    return { data: student, status: 200 }
  }

  if (url === '/api/students' && method === 'get') {
    return { data: MockStore.getStudents(), status: 200 }
  }

  if (url.startsWith('/api/students/') && method === 'delete') {
    const id = parseInt(url.split('/api/students/')[1], 10)
    const students = MockStore.getStudents().filter((s) => s.id !== id)
    MockStore.saveStudents(students)
    return { data: { message: 'Student deleted successfully' }, status: 200 }
  }

  // 3. Company Endpoints
  if (url === '/api/companies/me' && method === 'get') {
    const companies = MockStore.getCompanies()
    const company =
      companies.find((c) => c.user?.email === currentUser?.email || c.userId === currentUser?.id) ||
      companies[0]
    return { data: company, status: 200 }
  }

  if (url === '/api/companies' && method === 'get') {
    return { data: MockStore.getCompanies(), status: 200 }
  }

  if (url === '/api/companies' && method === 'post') {
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

  if (url.startsWith('/api/companies/') && method === 'delete') {
    const id = parseInt(url.split('/api/companies/')[1], 10)
    const companies = MockStore.getCompanies().filter((c) => c.id !== id)
    MockStore.saveCompanies(companies)
    return { data: { message: 'Company deleted successfully' }, status: 200 }
  }

  // 4. Job Endpoints
  if (url === '/api/jobs' && method === 'get') {
    return { data: MockStore.getJobs(), status: 200 }
  }

  if (url.startsWith('/api/jobs/') && !url.includes('/applications') && method === 'get') {
    const id = parseInt(url.split('/api/jobs/')[1], 10)
    const job = MockStore.getJobs().find((j) => j.id === id) || MockStore.getJobs()[0]
    return { data: job, status: 200 }
  }

  if (url === '/api/jobs' && method === 'post') {
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

  if (url.startsWith('/api/jobs/') && method === 'delete') {
    const id = parseInt(url.split('/api/jobs/')[1], 10)
    const jobs = MockStore.getJobs().filter((j) => j.id !== id)
    MockStore.saveJobs(jobs)
    return { data: { message: 'Job deleted successfully' }, status: 200 }
  }

  // 5. Application Endpoints
  if (url === '/api/applications/my' && method === 'get') {
    const apps = MockStore.getApplications()
    return { data: apps, status: 200 }
  }

  if (url === '/api/applications' && method === 'get') {
    return { data: MockStore.getApplications(), status: 200 }
  }

  if (url === '/api/applications' && method === 'post') {
    const apps = MockStore.getApplications()
    const jobId = data.jobId || data.job_id
    const job = MockStore.getJobs().find((j) => j.id === jobId) || MockStore.getJobs()[0]
    const student = MockStore.getStudents()[0]
    const newApp = {
      id: Date.now(),
      studentId: student.id,
      student,
      jobId: job.id,
      job,
      status: 'PENDING',
      appliedAt: new Date().toISOString(),
    }
    apps.unshift(newApp)
    MockStore.saveApplications(apps)
    return { data: newApp, status: 201 }
  }

  if (url.includes('/api/applications/') && url.endsWith('/status') && (method === 'patch' || method === 'put')) {
    const idStr = url.split('/api/applications/')[1].split('/status')[0]
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

  if (url.startsWith('/api/applications/') && method === 'delete') {
    const id = parseInt(url.split('/api/applications/')[1], 10)
    const apps = MockStore.getApplications().filter((a) => a.id !== id)
    MockStore.saveApplications(apps)
    return { data: { message: 'Application deleted successfully' }, status: 200 }
  }

  return { data: [], status: 200 }
}

// Interceptor: Fallback to interactive MockStore if real backend is unreachable or not configured
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend is not available (network error, CORS, 404, or refused connection)
    if (
      !API_BASE_URL ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      !error.response ||
      error.response.status === 404 ||
      error.response.status >= 500
    ) {
      console.warn('Backend server unreachable. Using interactive Demo Mode mock data.')
      try {
        const mockResponse = handleMockRequest(error.config)
        return Promise.resolve(mockResponse)
      } catch (mockErr) {
        console.error('Mock handler error', mockErr)
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
