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
    <div>
      <h1>{role ? `${role} Login` : 'Login'}</h1>

      {error && (
        <div style={{ color: 'red', marginBottom: '15px', maxWidth: '350px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />
        </div>
        <br />
        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <br />
      <Link to="/">Back to Home</Link>
    </div>
  )
}

export default Login
