import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);

  const fetchApplications = async () => {
    try {
      const response = await axiosInstance.get('/api/applications');
      setApplications(response.data);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 403) {
          setError('Access denied: insufficient permissions');
        } else if (err.response.status === 404) {
          setError('No applications found');
        } else {
          setError('Failed to load applications');
        }
      } else {
        setError('Network error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete application #${id}?`)) return;
    try {
      await axiosInstance.delete(`/api/applications/${id}`);
      setApplications((prev) => prev.filter((app) => app.id !== id));
      if (selectedApp?.id === id) {
        setSelectedApp(null);
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError('Access denied: cannot delete this application');
      } else {
        setError('Delete failed');
      }
    }
  };

  const handleView = (app) => {
    setSelectedApp(app);
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

  if (loading) return <p style={{ padding: '20px' }}>Loading applications...</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Manage Applications</h1>
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      <table
        border="1"
        cellPadding="10"
        style={{ borderCollapse: 'collapse', width: '100%', maxWidth: '950px', marginTop: '15px' }}
      >
        <thead>
          <tr style={{ backgroundColor: '#f2f2f0' }}>
            <th>Application ID</th>
            <th>Student Name</th>
            <th>Job</th>
            <th>Company</th>
            <th>Applied Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td>{app.id}</td>
              <td>{app.student?.user?.name || app.student?.name || app.studentName || 'N/A'}</td>
              <td>{app.job?.title || app.job || 'N/A'}</td>
              <td>{app.job?.company?.companyName || app.job?.company?.name || app.company || 'N/A'}</td>
              <td>{app.appliedDate || (app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'N/A')}</td>
              <td style={{ color: getStatusColor(app.status), fontWeight: 'bold' }}>{app.status}</td>
              <td>
                <button 
                  onClick={() => handleView(app)} 
                  style={{ marginRight: '8px', cursor: 'pointer', padding: '5px 10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}
                >
                  View
                </button>
                <button 
                  onClick={() => handleDelete(app.id)} 
                  style={{ cursor: 'pointer', padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Application Details Modal */}
      {selectedApp && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={() => setSelectedApp(null)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '25px',
              borderRadius: '8px',
              maxWidth: '550px',
              width: '90%',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0, borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
              Application Details (ID: #{selectedApp.id})
            </h2>

            <div style={{ lineHeight: '1.8', fontSize: '15px' }}>
              <p><strong>Student:</strong> {selectedApp.student?.user?.name || selectedApp.student?.name || selectedApp.studentName || 'N/A'}</p>
              <p><strong>Student Email:</strong> {selectedApp.student?.user?.email || selectedApp.student?.email || 'N/A'}</p>
              <p><strong>Student CGPA:</strong> {selectedApp.student?.cgpa ?? 'N/A'}</p>
              <p><strong>Job Applied:</strong> {selectedApp.job?.title || selectedApp.job || 'N/A'}</p>
              <p><strong>Company:</strong> {selectedApp.job?.company?.companyName || selectedApp.job?.company?.name || selectedApp.company || 'N/A'}</p>
              <p><strong>Applied Date:</strong> {selectedApp.appliedDate || (selectedApp.appliedAt ? new Date(selectedApp.appliedAt).toLocaleDateString() : 'N/A')}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span style={{ color: getStatusColor(selectedApp.status), fontWeight: 'bold' }}>
                  {selectedApp.status}
                </span>
              </p>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button
                onClick={() => setSelectedApp(null)}
                style={{
                  padding: '8px 18px',
                  backgroundColor: '#6c757d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <br />
      <Link to="/admin/dashboard">
        <button style={{ padding: '8px 15px', cursor: 'pointer' }}>Back to Dashboard</button>
      </Link>
    </div>
  );
};

export default ManageApplications;
