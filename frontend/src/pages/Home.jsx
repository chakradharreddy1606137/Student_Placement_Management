import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      <h1>Student Placement Management System</h1>
      <p>Welcome to the Student Placement Management System.</p>
      <Link to="/login/student">
        <button>Student Login</button>
      </Link>
      <Link to="/login/company">
        <button>Company Login</button>
      </Link>
      <Link to="/login/admin">
        <button>Admin Login</button>
      </Link>
    </div>
  )
}

export default Home
