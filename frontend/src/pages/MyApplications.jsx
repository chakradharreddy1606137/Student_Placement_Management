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
    <div>
      <h1>My Applications</h1>

      {loading && <p>Loading your applications...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && applications.length === 0 && (
        <p>You have not applied to any jobs yet.</p>
      )}

      {!loading && !error && applications.length > 0 && (
        <table
          border="1"
          cellPadding="10"
          style={{ borderCollapse: 'collapse', width: '100%', maxWidth: '700px' }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th>Job</th>
              <th>Company</th>
              <th>Location</th>
              <th>Applied Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.job?.title || 'N/A'}</td>
                <td>{app.job?.company?.companyName || app.job?.company || 'N/A'}</td>
                <td>{app.job?.location || 'N/A'}</td>
                <td>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'N/A'}</td>
                <td style={{ color: getStatusColor(app.status), fontWeight: 'bold' }}>
                  {app.status || 'PENDING'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <br />
      <Link to="/student/dashboard">
        <button>Back to Dashboard</button>
      </Link>
    </div>
  );
};

export default MyApplications;
