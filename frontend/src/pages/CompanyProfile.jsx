import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const CompanyProfile = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/api/companies/me');
        setCompany(response.data);
      } catch (err) {
        if (err.response && err.response.status === 403) {
          setError('Access denied: insufficient permissions');
        } else {
          setError('Failed to load company profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="center-card" style={{ textAlign: 'center', maxWidth: '600px' }}>
          <p>Loading company profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="center-card" style={{ textAlign: 'center', maxWidth: '600px' }}>
          <h1 style={{ margin: '0 0 10px 0' }}>🏢 Company Profile</h1>
          <p style={{ color: '#f87171' }}>{error}</p>
          <Link to="/company/dashboard">
            <button style={{ marginTop: '15px' }}>Back to Dashboard</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="center-card" style={{ maxWidth: '680px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #334155', paddingBottom: '16px' }}>
          <div>
            <h1 style={{ margin: 0 }}>🏢 Company Profile</h1>
            <p style={{ margin: '4px 0 0 0' }}>Manage corporate identity and recruitment info</p>
          </div>
          <Link to="/company/dashboard" style={{ textDecoration: 'none' }}>
            <button style={{ backgroundColor: '#475569', fontSize: '13px' }}>← Dashboard</button>
          </Link>
        </div>

        {company && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '16px' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#94a3b8' }}>COMPANY NAME</p>
              <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '18px' }}>{company.companyName || 'N/A'}</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '16px' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#94a3b8' }}>EMAIL</p>
                <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '15px' }}>{company.user?.email || 'N/A'}</h4>
              </div>

              <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '16px' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#94a3b8' }}>HEADQUARTERS / LOCATION</p>
                <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '15px' }}>{company.location || 'N/A'}</h4>
              </div>
            </div>

            <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '16px' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#94a3b8' }}>OFFICIAL WEBSITE</p>
              {company.website ? (
                <a href={company.website} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', fontWeight: '600' }}>
                  🌐 {company.website}
                </a>
              ) : (
                <span style={{ color: '#94a3b8' }}>Not provided</span>
              )}
            </div>

            <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '16px' }}>
              <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#94a3b8' }}>ABOUT COMPANY</p>
              <p style={{ margin: 0, color: '#e2e8f0', fontSize: '14px', lineHeight: 1.5 }}>
                {company.description || 'No description provided.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;
