import { Link } from 'react-router-dom';
import { logout } from '../utils/auth';

const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>

      <p>Welcome, Admin!</p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '220px',
        }}
      >
        <Link to="/admin/students">
          <button style={{ width: '100%' }}>Manage Students</button>
        </Link>

        <Link to="/admin/companies">
          <button style={{ width: '100%' }}>Manage Companies</button>
        </Link>

        <Link to="/admin/jobs">
          <button style={{ width: '100%' }}>Manage Jobs</button>
        </Link>

        <Link to="/admin/applications">
          <button style={{ width: '100%' }}>Manage Applications</button>
        </Link>

        <button onClick={logout} style={{ width: '100%' }}>Logout</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
