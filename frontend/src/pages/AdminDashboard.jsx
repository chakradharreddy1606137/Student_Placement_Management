import { Link } from 'react-router-dom';
import { logout } from '../utils/auth';

const AdminDashboard = () => {
  return (
    <div className="page-container">
      <div className="center-card" style={{ maxWidth: '720px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #334155', paddingBottom: '16px' }}>
          <div>
            <h1 style={{ margin: 0 }}>🔑 Admin Dashboard</h1>
            <p style={{ margin: '4px 0 0 0' }}>System administration and control</p>
          </div>
          <button 
            onClick={logout} 
            style={{ backgroundColor: '#ef4444', padding: '8px 16px', fontSize: '13px' }}
          >
            Logout
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginTop: '20px' }}>
          <Link to="/admin/students" style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '20px 14px', textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>👨‍🎓</div>
              <h3 style={{ margin: '0 0 4px 0', color: '#f8fafc', fontSize: '15px' }}>Students</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Manage records</p>
            </div>
          </Link>

          <Link to="/admin/companies" style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '20px 14px', textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🏢</div>
              <h3 style={{ margin: '0 0 4px 0', color: '#f8fafc', fontSize: '15px' }}>Companies</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Manage partners</p>
            </div>
          </Link>

          <Link to="/admin/jobs" style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '20px 14px', textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>💼</div>
              <h3 style={{ margin: '0 0 4px 0', color: '#f8fafc', fontSize: '15px' }}>Jobs</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>All postings</p>
            </div>
          </Link>

          <Link to="/admin/applications" style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '20px 14px', textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>📋</div>
              <h3 style={{ margin: '0 0 4px 0', color: '#f8fafc', fontSize: '15px' }}>Applications</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>All submissions</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

