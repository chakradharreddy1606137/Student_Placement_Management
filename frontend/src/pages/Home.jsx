import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MockStore } from '../utils/mockData'
import axiosInstance, { getActiveApiUrl } from '../utils/axiosInstance'

function Home() {
  const navigate = useNavigate()
  const [backendStatus, setBackendStatus] = useState('checking') // 'online' | 'demo' | 'checking'
  const [backendData, setBackendData] = useState(null)
  const [showConfig, setShowConfig] = useState(false)
  const [customApiUrl, setCustomApiUrl] = useState(localStorage.getItem('spm_custom_api_url') || '')

  useEffect(() => {
    checkBackendHealth()
  }, [])

  const checkBackendHealth = async () => {
    setBackendStatus('checking')
    try {
      const res = await axiosInstance.get('/api/health')
      if (res.data && res.data.status === 'UP') {
        setBackendStatus('online')
        setBackendData(res.data)
      } else {
        setBackendStatus('demo')
      }
    } catch {
      setBackendStatus('demo')
    }
  }

  const handleSaveApiUrl = (e) => {
    e.preventDefault()
    if (customApiUrl.trim()) {
      localStorage.setItem('spm_custom_api_url', customApiUrl.trim())
    } else {
      localStorage.removeItem('spm_custom_api_url')
    }
    checkBackendHealth()
  }

  const handleInstantDemoLogin = (role) => {
    let user
    if (role === 'STUDENT') {
      user = {
        id: 5,
        name: 'Rishitha (Student)',
        email: 'rishitha@gmail.com',
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
        name: 'Harsha (Google Recruiter)',
        email: 'harsha@gmail.com',
        role: 'COMPANY',
        token: 'demo-company-token-123',
      }
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', user.token)
      localStorage.setItem('role', user.role)
      navigate('/company/dashboard')
    } else if (role === 'ADMIN') {
      user = {
        id: 1,
        name: 'Chakri (Placement Admin)',
        email: 'chakri@gmail.com',
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
          maxWidth: '620px',
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
        <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#94a3b8', lineHeight: 1.5 }}>
          Full-Stack placement portal connecting students, recruiters, and placement administrators.
        </p>

        {/* Live Architecture Status Bar */}
        <div
          style={{
            backgroundColor: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '10px',
            padding: '12px 14px',
            marginBottom: '22px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            fontSize: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>🌐 Frontend:</span>
            <span style={{ color: '#34d399', backgroundColor: 'rgba(52, 211, 153, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
              ● Live (GitHub Pages)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#a78bfa', fontWeight: 'bold' }}>⚙️ API:</span>
            {backendStatus === 'online' ? (
              <span style={{ color: '#34d399', backgroundColor: 'rgba(52, 211, 153, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                ● Cloud Live {backendData?.database === 'CONNECTED' ? '(MySQL Connected)' : ''}
              </span>
            ) : backendStatus === 'checking' ? (
              <span style={{ color: '#fbbf24', backgroundColor: 'rgba(251, 191, 36, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                ● Checking API...
              </span>
            ) : (
              <span style={{ color: '#93c5fd', backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                ● Interactive Demo Mode
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            style={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              color: '#cbd5e1',
              padding: '4px 8px',
              fontSize: '11px',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            ⚙️ Setup
          </button>
        </div>

        {/* Dynamic Backend URL Config Drawer */}
        {showConfig && (
          <div
            style={{
              backgroundColor: '#0b1120',
              border: '1px solid #3b82f6',
              borderRadius: '10px',
              padding: '16px',
              marginBottom: '20px',
              textAlign: 'left',
              fontSize: '13px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <strong style={{ color: '#93c5fd' }}>🔌 Cloud Backend API Connection</strong>
              <button
                type="button"
                onClick={() => setShowConfig(false)}
                style={{ backgroundColor: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer', fontSize: '14px' }}
              >
                ✕
              </button>
            </div>
            <p style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '12px' }}>
              Connect this live frontend to your live Java Spring Boot backend (Render, Railway, or AWS):
            </p>
            <form onSubmit={handleSaveApiUrl} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="e.g. https://your-backend.onrender.com"
                value={customApiUrl}
                onChange={(e) => setCustomApiUrl(e.target.value)}
                style={{ flex: 1, padding: '8px 10px', fontSize: '12px' }}
              />
              <button type="submit" style={{ padding: '8px 14px', fontSize: '12px', whiteSpace: 'nowrap' }}>
                Save & Test
              </button>
            </form>
            <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '11px' }}>
              Active Endpoint: {getActiveApiUrl() || 'Interactive Demo Mode (Fallback)'}
            </p>
          </div>
        )}

        {/* Standard Portals Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
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
      </div>
    </div>
  )
}

export default Home

