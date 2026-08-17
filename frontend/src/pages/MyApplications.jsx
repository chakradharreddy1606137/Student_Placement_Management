import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axiosInstance.get('/api/applications/my');
        setApplications(response.data);
      } catch (err) {
        setError('Failed to load applications.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'SELECTED':
      case 'ACCEPTED':
        return 'green';
      case 'REJECTED':
        return 'red';
      case 'PENDING':
      default:
        return 'orange';
    }
  };

  return (
    <div className="page-container">
      <div className="center-card" style={{ maxWidth: '850px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ margin: 0 }}>📄 My Applications</h1>
            <p style={{ margin: '4px 0 0 0' }}>Track all your job applications</p>
          </div>
          <Link to="/student/dashboard">
            <button style={{ backgroundColor: '#475569', fontSize: '13px' }}>← Dashboard</button>
          </Link>
        </div>

        {loading && <p>Loading your applications...</p>}
        {error && <p style={{ color: '#f87171' }}>{error}</p>}

        {!loading && !error && applications.length === 0 && (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <p>You have not applied to any jobs yet.</p>
            <Link to="/student/jobs">
              <button style={{ marginTop: '10px' }}>Browse Open Jobs</button>
            </Link>
          </div>
        )}

        {!loading && !error && applications.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Applied Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td style={{ fontWeight: '600' }}>{app.job?.title || 'N/A'}</td>
                  <td>{app.job?.company?.companyName || app.job?.company || 'N/A'}</td>
                  <td>{app.job?.location || 'N/A'}</td>
                  <td>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '700',
                        backgroundColor:
                          app.status?.toUpperCase() === 'ACCEPTED' || app.status?.toUpperCase() === 'SELECTED'
                            ? 'rgba(16, 185, 129, 0.2)'
                            : app.status?.toUpperCase() === 'REJECTED'
                            ? 'rgba(239, 68, 68, 0.2)'
                            : 'rgba(245, 158, 11, 0.2)',
                        color:
                          app.status?.toUpperCase() === 'ACCEPTED' || app.status?.toUpperCase() === 'SELECTED'
                            ? '#34d399'
                            : app.status?.toUpperCase() === 'REJECTED'
                            ? '#f87171'
                            : '#fbbf24',
                      }}
                    >
                      {app.status || 'PENDING'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
