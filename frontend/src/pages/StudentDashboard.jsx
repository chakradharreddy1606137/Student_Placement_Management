import { Link } from 'react-router-dom';
import { logout } from '../utils/auth';

const StudentDashboard = () => {
  return (
    <div>
      <h1>Student Dashboard</h1>

      <p>Welcome, Student!</p>

      <Link to="/student/jobs">
        <button>View Jobs</button>
      </Link>
      <Link to="/student/applications">
        <button>My Applications</button>
      </Link>
      <Link to="/student/profile">
        <button>My Profile</button>
      </Link>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default StudentDashboard;
