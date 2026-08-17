import { Link } from 'react-router-dom';
import { logout } from '../utils/auth';

const CompanyDashboard = () => {
  return (
    <div className="page-container">
      <div className="center-card" style={{ maxWidth: '720px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #334155', paddingBottom: '16px' }}>
          <div>
            <h1 style={{ margin: 0 }}>🏢 Company Dashboard</h1>
            <p style={{ margin: '4px 0 0 0' }}>Manage job listings and candidates</p>
          </div>
          <button 
            onClick={logout} 
            style={{ backgroundColor: '#ef4444', padding: '8px 16px', fontSize: '13px' }}
          >
            Logout
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginTop: '20px' }}>
          <Link to="/company/jobs/create" style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '20px 14px', textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>➕</div>
              <h3 style={{ margin: '0 0 4px 0', color: '#f8fafc', fontSize: '15px' }}>Post a Job</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>New vacancy</p>
            </div>
          </Link>

          <Link to="/company/jobs" style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '20px 14px', textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>📋</div>
              <h3 style={{ margin: '0 0 4px 0', color: '#f8fafc', fontSize: '15px' }}>My Jobs</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>View postings</p>
            </div>
          </Link>

          <Link to="/company/applications" style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '20px 14px', textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>📥</div>
              <h3 style={{ margin: '0 0 4px 0', color: '#f8fafc', fontSize: '15px' }}>Applications</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Review applicants</p>
            </div>
          </Link>

          <Link to="/company/profile" style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '20px 14px', textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🏢</div>
              <h3 style={{ margin: '0 0 4px 0', color: '#f8fafc', fontSize: '15px' }}>Company Profile</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Edit info</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;

