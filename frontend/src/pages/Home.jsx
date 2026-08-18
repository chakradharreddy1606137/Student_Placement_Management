import { Link, useNavigate } from 'react-router-dom'
import { MockStore } from '../utils/mockData'

function Home() {
  const navigate = useNavigate()

  const handleInstantDemoLogin = (role) => {
    let user
    if (role === 'STUDENT') {
      user = {
        id: 1,
        name: 'Alex Sharma (Demo Student)',
        email: 'student@example.com',
        role: 'STUDENT',
        token: 'demo-student-token-123',
      }
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', user.token)
      localStorage.setItem('role', user.role)
      navigate('/student/dashboard')
    } else if (role === 'COMPANY') {
      user = {
        id: 2,
        name: 'Google Campus Team (Demo)',
        email: 'recruiter@google.com',
        role: 'COMPANY',
        token: 'demo-company-token-123',
      }
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', user.token)
      localStorage.setItem('role', user.role)
      navigate('/company/dashboard')
    } else if (role === 'ADMIN') {
      user = {
        id: 3,
        name: 'Placement Officer (Demo Admin)',
        email: 'admin@example.com',
        role: 'ADMIN',
        token: 'demo-admin-token-123',
      }
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', user.token)
      localStorage.setItem('role', user.role)
      navigate('/admin/dashboard')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '24px 16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '16px',
          padding: '36px 30px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', borderRadius: '20px', padding: '4px 12px', marginBottom: '14px' }}>
          <span style={{ fontSize: '12px' }}>✨</span>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#93c5fd', letterSpacing: '0.5px' }}>CAMPUS RECRUITMENT SUITE</span>
        </div>

        <h1
          style={{
            margin: '0 0 10px 0',
            fontSize: '28px',
            fontWeight: '800',
            color: '#f8fafc',
            lineHeight: 1.25,
          }}
        >
          🎓 Student Placement Management
        </h1>
        <p style={{ margin: '0 0 28px 0', fontSize: '14px', color: '#94a3b8', lineHeight: 1.5 }}>
          Unified recruitment platform connecting students, hiring companies, and university placement administrators.
        </p>

        {/* Standard Portals Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
          <Link to="/login/student" style={{ textDecoration: 'none' }}>
            <button
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.1s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>👨‍🎓</span>
              <span>Student Login</span>
            </button>
          </Link>

          <Link to="/login/company" style={{ textDecoration: 'none' }}>
            <button
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.1s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>🏢</span>
              <span>Company Login</span>
            </button>
          </Link>

          <Link to="/login/admin" style={{ textDecoration: 'none' }}>
            <button
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.1s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>🔑</span>
              <span>Admin Login</span>
            </button>
          </Link>
        </div>

        {/* 1-Click Instant Demo Experience Section */}
        <div
          style={{
            backgroundColor: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🚀</span> 1-Click Live Preview Portals
            </h3>
            <span
              style={{
                fontSize: '11px',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                padding: '2px 8px',
                borderRadius: '6px',
                fontWeight: '600',
              }}
            >
              Instant Access
            </span>
          </div>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#94a3b8' }}>
            Exploring online? Jump straight into any role dashboard without entering credentials:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleInstantDemoLogin('STUDENT')}
              style={{
                padding: '10px 6px',
                backgroundColor: '#1e293b',
                color: '#93c5fd',
                border: '1px solid #3b82f6',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              👨‍🎓 Demo Student
            </button>

            <button
              type="button"
              onClick={() => handleInstantDemoLogin('COMPANY')}
              style={{
                padding: '10px 6px',
                backgroundColor: '#1e293b',
                color: '#6ee7b7',
                border: '1px solid #10b981',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              🏢 Demo Company
            </button>

            <button
              type="button"
              onClick={() => handleInstantDemoLogin('ADMIN')}
              style={{
                padding: '10px 6px',
                backgroundColor: '#1e293b',
                color: '#a5b4fc',
                border: '1px solid #6366f1',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              🔑 Demo Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
