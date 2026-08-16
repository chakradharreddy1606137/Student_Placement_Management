import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, allowedRole }) => {
  const storedUser = localStorage.getItem('user')

  if (!storedUser) {
    return <Navigate to="/" replace />
  }

  const user = JSON.parse(storedUser)

  if (allowedRole && user.role?.toUpperCase() !== allowedRole.toUpperCase()) {
    if (user.role?.toUpperCase() === 'STUDENT') {
      return <Navigate to="/student/dashboard" replace />
    }

    if (user.role?.toUpperCase() === 'COMPANY') {
      return <Navigate to="/company/dashboard" replace />
    }

    if (user.role?.toUpperCase() === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />
    }

    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
