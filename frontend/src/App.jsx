import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import StudentDashboard from './pages/StudentDashboard'
import StudentProfile from './pages/StudentProfile'
import Jobs from './pages/Jobs'
import JobDetails from './pages/JobDetails'
import ApplyJob from './pages/ApplyJob'
import MyApplications from './pages/MyApplications'
import CompanyDashboard from './pages/CompanyDashboard'
import CompanyProfile from './pages/CompanyProfile'
import PostJob from './pages/PostJob'
import MyJobs from './pages/MyJobs'
import JobApplications from './pages/JobApplications'
import AdminDashboard from './pages/AdminDashboard'
import ManageStudents from './pages/ManageStudents'
import ManageCompanies from './pages/ManageCompanies'
import ManageJobs from './pages/ManageJobs'
import ManageApplications from './pages/ManageApplications'
import ProtectedRoute from './pages/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/student" element={<Login role="Student" />} />
        <Route path="/login/company" element={<Login role="Company" />} />
        <Route path="/login/admin" element={<Login role="Admin" />} />
        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/jobs"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <Jobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/jobs/:id"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <JobDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/jobs/:id/apply"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <ApplyJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/applications"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <MyApplications />
            </ProtectedRoute>
          }
        />

        {/* Company Routes */}
        <Route
          path="/company/dashboard"
          element={
            <ProtectedRoute allowedRole="COMPANY">
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/profile"
          element={
            <ProtectedRoute allowedRole="COMPANY">
              <CompanyProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/jobs/create"
          element={
            <ProtectedRoute allowedRole="COMPANY">
              <PostJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/jobs"
          element={
            <ProtectedRoute allowedRole="COMPANY">
              <MyJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/jobs/:id/applications"
          element={
            <ProtectedRoute allowedRole="COMPANY">
              <JobApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/applications"
          element={
            <ProtectedRoute allowedRole="COMPANY">
              <JobApplications />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <ManageStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/companies"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <ManageCompanies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <ManageJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/applications"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <ManageApplications />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
