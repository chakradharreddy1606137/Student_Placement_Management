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
    return <div>Loading profile...</div>;
  }

  if (error) {
    return (
      <div>
        <h1>Company Profile</h1>
        <p style={{ color: 'red' }}>{error}</p>
        <br />
        <Link to="/company/dashboard">
          <button>Back to Dashboard</button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Company Profile</h1>

      {company && (
        <div>
          <p><strong>Company Name:</strong> {company.companyName || 'N/A'}</p>
          <p><strong>Email:</strong> {company.user?.email || 'N/A'}</p>
          <p><strong>Description:</strong> {company.description || 'N/A'}</p>
          <p>
            <strong>Website:</strong>{' '}
            {company.website ? (
              <a href={company.website} target="_blank" rel="noreferrer">
                {company.website}
              </a>
            ) : (
              'N/A'
            )}
          </p>
          <p><strong>Location:</strong> {company.location || 'N/A'}</p>
        </div>
      )}

      <br />
      <Link to="/company/dashboard">
        <button>Back to Dashboard</button>
      </Link>
    </div>
  );
};

export default CompanyProfile;
