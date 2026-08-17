import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const CompanyProfile = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    companyName: '',
    description: '',
    location: '',
    website: '',
  });
  const [saveSuccess, setSaveSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/api/companies/me');
        setCompany(response.data);
        if (response.data) {
          setEditData({
            companyName: response.data.companyName || '',
            description: response.data.description || '',
            location: response.data.location || '',
            website: response.data.website || '',
          });
        }
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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveSuccess('');
    setError('');
    try {
      const payload = {
        ...company,
        companyName: editData.companyName,
        description: editData.description,
        location: editData.location,
        website: editData.website,
      };
      const response = await axiosInstance.post('/api/companies', payload);
      setCompany(response.data);
      setIsEditing(false);
      setSaveSuccess('Company profile updated successfully!');
    } catch (err) {
      setError('Failed to update company profile.');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="center-card" style={{ textAlign: 'center', maxWidth: '600px' }}>
          <p>Loading company profile...</p>
        </div>
      </div>
    );
  }

  if (error && !company) {
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
      <div className="center-card" style={{ maxWidth: '850px' }}>
        {/* Header Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #334155', paddingBottom: '16px' }}>
          <div>
            <h1 style={{ margin: 0 }}>🏢 Company Profile & Overview</h1>
            <p style={{ margin: '4px 0 0 0' }}>Manage corporate brand, story, and recruitment profile</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                style={{ backgroundColor: '#3b82f6', fontSize: '13px' }}
              >
                ✏️ Edit Profile
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                style={{ backgroundColor: '#475569', fontSize: '13px' }}
              >
                Cancel
              </button>
            )}
            <Link to="/company/dashboard" style={{ textDecoration: 'none' }}>
              <button style={{ backgroundColor: '#1e293b', border: '1px solid #475569', fontSize: '13px' }}>
                Dashboard
              </button>
            </Link>
          </div>
        </div>

        {saveSuccess && (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
            {saveSuccess}
          </div>
        )}

        {isEditing ? (
          /* Edit Form */
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label>Company Name</label>
              <input
                type="text"
                value={editData.companyName}
                onChange={(e) => setEditData({ ...editData, companyName: e.target.value })}
                required
                style={{ width: '100%', marginTop: '6px' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label>Headquarters / Location</label>
                <input
                  type="text"
                  value={editData.location}
                  onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                  placeholder="e.g. Hyderabad, India"
                  style={{ width: '100%', marginTop: '6px' }}
                />
              </div>
              <div>
                <label>Website URL</label>
                <input
                  type="text"
                  value={editData.website}
                  onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                  placeholder="e.g. https://company.com"
                  style={{ width: '100%', marginTop: '6px' }}
                />
              </div>
            </div>
            <div>
              <label>About Company (Vision, Culture & Description)</label>
              <textarea
                rows={5}
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                placeholder="Describe your company's mission, values, domain and tech stack..."
                style={{ width: '100%', marginTop: '6px' }}
              />
            </div>
            <button type="submit" style={{ backgroundColor: '#10b981', padding: '12px', fontSize: '15px' }}>
              💾 Save Profile Updates
            </button>
          </form>
        ) : (
          /* View Mode */
          <div>
            {/* Company Hero Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
                border: '1px solid #4338ca',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '16px',
                  backgroundColor: '#312e81',
                  border: '2px solid #6366f1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '34px',
                }}
              >
                🏢
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ margin: 0, fontSize: '24px', color: '#f8fafc' }}>
                    {company?.companyName || 'Corporate Partner'}
                  </h2>
                  <span
                    style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.2)',
                      color: '#34d399',
                      fontSize: '12px',
                      fontWeight: '700',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      border: '1px solid #10b981',
                    }}
                  >
                    ✓ Verified Recruiter
                  </span>
                </div>
                <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>
                  📍 {company?.location || 'India'} &nbsp;|&nbsp; ✉️ {company?.user?.email || 'N/A'}
                  {company?.website && (
                    <>
                      &nbsp;|&nbsp;{' '}
                      <a href={company.website} target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>
                        🌐 {company.website}
                      </a>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* About Company Section */}
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#f8fafc', fontSize: '17px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📖 About Our Organization
              </h3>
              <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.7, fontSize: '14px' }}>
                {company?.description ||
                  'We are an industry-leading technology enterprise dedicated to engineering innovative solutions, building scalable cloud architectures, and nurturing young engineering talent.'}
              </p>
            </div>

            {/* Culture & Perks Grid */}
            <h3 style={{ margin: '0 0 14px 0', color: '#f8fafc', fontSize: '17px' }}>
              ✨ Why Work With Us
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '16px' }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>🚀</div>
                <h4 style={{ margin: '0 0 4px 0', color: '#f8fafc', fontSize: '14px' }}>Rapid Career Growth</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Structured mentorship & fast-track promotion paths for campus recruits.</p>
              </div>

              <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '16px' }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>💻</div>
                <h4 style={{ margin: '0 0 4px 0', color: '#f8fafc', fontSize: '14px' }}>Modern Tech Stack</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Work with Java, Spring Boot, React, AWS, Microservices & AI tools.</p>
              </div>

              <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '16px' }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>🎁</div>
                <h4 style={{ margin: '0 0 4px 0', color: '#f8fafc', fontSize: '14px' }}>Competitive Benefits</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Comprehensive health coverage, performance incentives, and wellness days.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;

