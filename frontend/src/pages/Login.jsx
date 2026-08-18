import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'

function Login({ role }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axiosInstance.post('/api/auth/login', {
        email,
        password,
      })

      const user = response.data

      // Validate role match if role prop is passed
      if (role && user.role.toUpperCase() !== role.toUpperCase()) {
        setError(`Access Denied: This login page is only for ${role}s. Your role is ${user.role}.`)
        setLoading(false)
        return
      }

      // Save user session in localStorage
      localStorage.setItem('user', JSON.stringify(user))
      if (user.token) {
        localStorage.setItem('token', user.token)
      }
      if (user.role) {
        localStorage.setItem('role', user.role)
      }

      // Redirect based on role
      const userRole = user.role.toUpperCase()
      if (userRole === 'STUDENT') {
        navigate('/student/dashboard')
      } else if (userRole === 'COMPANY') {
        navigate('/company/dashboard')
      } else if (userRole === 'ADMIN') {
        navigate('/admin/dashboard')
      } else {
        navigate('/')
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError('Invalid email or password. Please try again.')
      }
    } finally {
      setLoading(false)
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
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '36px 32px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1
            style={{
              margin: '0 0 8px 0',
              fontSize: '26px',
              fontWeight: '700',
              color: '#f8fafc',
            }}
          >
            {role ? `${role} Login` : 'Welcome Back'}
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>
            Please enter your credentials to sign in
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              color: '#fca5a5',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '14px',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '18px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#cbd5e1',
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@example.com"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                backgroundColor: '#0f172a',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#cbd5e1',
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                backgroundColor: '#0f172a',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'background-color 0.2s, transform 0.1s',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Quick Fill for Live GitHub Pages Visitors */}
        <div
          style={{
            marginTop: '20px',
            padding: '14px',
            backgroundColor: '#0f172a',
            border: '1px dashed #475569',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>
            ⚡ Live Demo Visitor? Fill test credentials:
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => {
                const targetEmail =
                  role?.toUpperCase() === 'COMPANY'
                    ? 'recruiter@google.com'
                    : role?.toUpperCase() === 'ADMIN'
                    ? 'admin@example.com'
                    : 'rishitha@gmail.com'
                const targetPassword =
                  role?.toUpperCase() === 'STUDENT' || !role
                    ? 'rishitha123'
                    : 'password123'
                setEmail(targetEmail)
                setPassword(targetPassword)
              }}
              style={{
                backgroundColor: '#334155',
                color: '#f8fafc',
                border: '1px solid #475569',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Fill {role || 'Demo'} Credentials
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link
            to="/"
            style={{
              color: '#94a3b8',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'color 0.2s',
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
