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
    return (
      <div className="page-container">
        <div className="center-card" style={{ textAlign: 'center', maxWidth: '600px' }}>
          <p>Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="center-card" style={{ textAlign: 'center', maxWidth: '600px' }}>
          <p style={{ color: '#f87171' }}>{error}</p>
          <Link to="/company/dashboard">
            <button style={{ marginTop: '10px' }}>Back to Dashboard</button>
          </Link>
        </div>
      </div>
    );
  }

  const titleText = id && job?.title
    ? `Applications for "${job.title}"`
    : 'All Candidate Applications';

  return (
    <div className="page-container">
      <div className="center-card" style={{ maxWidth: '1100px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #334155', paddingBottom: '16px' }}>
          <div>
            <h1 style={{ margin: 0 }}>📥 {titleText}</h1>
            <p style={{ margin: '4px 0 0 0' }}>Review candidates and update recruitment status</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {id && (
              <Link to="/company/jobs" style={{ textDecoration: 'none' }}>
                <button style={{ backgroundColor: '#475569', fontSize: '13px' }}>← My Jobs</button>
              </Link>
            )}
            <Link to="/company/dashboard" style={{ textDecoration: 'none' }}>
              <button style={{ backgroundColor: '#334155', fontSize: '13px' }}>Dashboard</button>
            </Link>
          </div>
        </div>

        {actionMessage && (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px' }}>
            {actionMessage}
          </div>
        )}

        {applications.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '30px 0' }}>No applications found for this posting.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Email</th>
                <th>CGPA</th>
                <th>Branch & College</th>
                <th>Resume</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>#{app.id}</td>
                  <td style={{ fontWeight: '600' }}>{app.student?.user?.name || app.student?.name || 'N/A'}</td>
                  <td>{app.student?.user?.email || app.student?.email || 'N/A'}</td>
                  <td>{app.student?.cgpa ?? 'N/A'}</td>
                  <td>
                    {app.student?.branch || 'N/A'}
                    {app.student?.college ? ` (${app.student.college})` : ''}
                  </td>
                  <td>
                    {app.student?.resumeUrl ? (
                      <a href={app.student.resumeUrl} target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>
                        📄 View Resume
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '700',
                        backgroundColor:
                          app.status === 'SELECTED' || app.status === 'ACCEPTED'
                            ? 'rgba(16, 185, 129, 0.2)'
                            : app.status === 'REJECTED'
                            ? 'rgba(239, 68, 68, 0.2)'
                            : 'rgba(245, 158, 11, 0.2)',
                        color:
                          app.status === 'SELECTED' || app.status === 'ACCEPTED'
                            ? '#34d399'
                            : app.status === 'REJECTED'
                            ? '#f87171'
                            : '#fbbf24',
                      }}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={app.status || 'PENDING'}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      style={{ padding: '6px 10px', fontSize: '13px' }}
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
      </div>
    </div>
  );
};

export default JobApplications;
