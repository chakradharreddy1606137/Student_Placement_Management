import { Link } from 'react-router-dom';
import { logout } from '../utils/auth';

const CompanyDashboard = () => {
  return (
    <div>
      <h1>Company Dashboard</h1>

      <p>Welcome, Company!</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '200px' }}>
        <Link to="/company/jobs/create">
          <button style={{ width: '100%' }}>Post a Job</button>
        </Link>
        <Link to="/company/jobs">
          <button style={{ width: '100%' }}>My Jobs</button>
        </Link>
        <Link to="/company/applications">
          <button style={{ width: '100%' }}>Applications</button>
        </Link>
        <Link to="/company/profile">
          <button style={{ width: '100%' }}>My Profile</button>
        </Link>
        <button onClick={logout} style={{ width: '100%' }}>Logout</button>
      </div>
    </div>
  );
};

export default CompanyDashboard;
