import { Link } from 'react-router-dom';
import { logout } from '../utils/auth';

const StudentDashboard = () => {
  return (
    <div className="page-container">
      <div className="center-card" style={{ maxWidth: '680px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #334155', paddingBottom: '16px' }}>
          <div>
            <h1 style={{ margin: 0 }}>👨‍🎓 Student Dashboard</h1>
            <p style={{ margin: '4px 0 0 0' }}>Welcome to your placement portal</p>
          </div>
          <button 
            onClick={logout} 
            style={{ backgroundColor: '#ef4444', padding: '8px 16px', fontSize: '13px' }}
          >
            Logout
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginTop: '20px' }}>
          <Link to="/student/jobs" style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '24px 16px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>💼</div>
              <h3 style={{ margin: '0 0 6px 0', color: '#f8fafc', fontSize: '16px' }}>View Jobs</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>Browse openings</p>
            </div>
          </Link>

          <Link to="/student/applications" style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '24px 16px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>📄</div>
              <h3 style={{ margin: '0 0 6px 0', color: '#f8fafc', fontSize: '16px' }}>My Applications</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>Track status</p>
            </div>
          </Link>

          <Link to="/student/profile" style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '24px 16px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>👤</div>
              <h3 style={{ margin: '0 0 6px 0', color: '#f8fafc', fontSize: '16px' }}>My Profile</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>Manage profile</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

