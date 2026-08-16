import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const JobApplications = () => {
  const { id } = useParams(); // optional job ID from route
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  // Fetch job details and applications
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get job details if ID is present
        if (id) {
          const jobResponse = await axiosInstance.get(`/api/jobs/${id}`);
          setJob(jobResponse.data);
        }

        // Get all applications for this company
        const appsResponse = await axiosInstance.get('/api/applications');
        let filtered = appsResponse.data;
        if (id) {
          filtered = appsResponse.data.filter(
            (app) => app.job && Number(app.job.id) === Number(id)
          );
        }
        setApplications(filtered);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('Job not found.');
        } else {
          setError('Failed to load applications.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      setActionMessage('');
      const response = await axiosInstance.patch(`/api/applications/${appId}/status`, {
        status: newStatus,
      });
      setApplications((prev) =>
        prev.map((app) => (app.id === appId ? response.data : app))
      );
      setActionMessage(`Application #${appId} status updated to ${newStatus}`);
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to update application status';
      setError(msg);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SELECTED':
        return 'green';
      case 'REJECTED':
        return 'red';
      case 'PENDING':
      default:
        return 'orange';
    }
  };

  if (loading) {
    return <div><p>Loading applications...</p></div>;
  }

  if (error) {
    return (
      <div>
        <p style={{ color: 'red' }}>{error}</p>
        <Link to="/company/dashboard">
          <button>Back to Dashboard</button>
        </Link>
      </div>
    );
  }

  const titleText = id && job?.title
    ? `Applications for Job "${job.title}"`
    : 'All Job Applications';

  return (
    <div>
      <h1>{titleText}</h1>

      {actionMessage && (
        <p style={{ color: 'green', fontWeight: 'bold' }}>{actionMessage}</p>
      )}

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{ borderCollapse: 'collapse', width: '100%', maxWidth: '950px' }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th>ID</th>
              <th>Student Name</th>
              <th>Email</th>
              <th>CGPA</th>
              <th>Branch / College</th>
              <th>Job</th>
              <th>Resume</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.id}</td>
                <td>{app.student?.user?.name || app.student?.name || 'N/A'}</td>
                <td>{app.student?.user?.email || app.student?.email || 'N/A'}</td>
                <td>{app.student?.cgpa ?? 'N/A'}</td>
                <td>
                  {app.student?.branch || 'N/A'}
                  {app.student?.college ? ` (${app.student.college})` : ''}
                </td>
                <td>{app.job?.title || 'N/A'}</td>
                <td>
                  {app.student?.resumeUrl ? (
                    <a href={app.student.resumeUrl} target="_blank" rel="noreferrer">
                      View Resume
                    </a>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td style={{ color: getStatusColor(app.status), fontWeight: 'bold' }}>
                  {app.status}
                </td>
                <td>
                  <select
                    value={app.status || 'PENDING'}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="SELECTED">SELECTED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <br />
      <div style={{ display: 'flex', gap: '10px' }}>
        {id && (
          <Link to="/company/jobs">
            <button>Back to My Jobs</button>
          </Link>
        )}
        <Link to="/company/dashboard">
          <button>Back to Dashboard</button>
        </Link>
      </div>
    </div>
  );
};

export default JobApplications;
