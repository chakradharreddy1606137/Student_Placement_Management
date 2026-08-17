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

  if (loading) {
    return (
      <div className="page-container">
        <div className="center-card" style={{ textAlign: 'center', maxWidth: '600px' }}>
          <p>Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="center-card" style={{ maxWidth: '1050px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '16px' }}>
          <div>
            <h1 style={{ margin: 0 }}>📋 Manage Applications</h1>
            <p style={{ margin: '4px 0 0 0' }}>Review and manage application records system-wide</p>
          </div>
          <Link to="/admin/dashboard" style={{ textDecoration: 'none' }}>
            <button style={{ backgroundColor: '#475569', fontSize: '13px' }}>← Dashboard</button>
          </Link>
        </div>
        {error && <p style={{ color: '#f87171', fontWeight: 'bold' }}>{error}</p>}

        <table>
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
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={() => setSelectedApp(null)}
        >
          <div
            style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              padding: '28px',
              borderRadius: '12px',
              maxWidth: '550px',
              width: '90%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.7)',
              position: 'relative',
              color: '#f8fafc',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '12px', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#f8fafc' }}>
                Application Details (ID: #{selectedApp.id})
              </h2>
              <button
                onClick={() => setSelectedApp(null)}
                style={{ backgroundColor: '#334155', padding: '4px 10px', fontSize: '13px', color: '#cbd5e1' }}
              >
                ✕
              </button>
            </div>

            <div style={{ lineHeight: '1.9', fontSize: '14px', color: '#cbd5e1' }}>
              <p style={{ margin: '6px 0' }}><strong style={{ color: '#f8fafc' }}>Student:</strong> {selectedApp.student?.user?.name || selectedApp.student?.name || selectedApp.studentName || 'N/A'}</p>
              <p style={{ margin: '6px 0' }}><strong style={{ color: '#f8fafc' }}>Student Email:</strong> {selectedApp.student?.user?.email || selectedApp.student?.email || 'N/A'}</p>
              <p style={{ margin: '6px 0' }}><strong style={{ color: '#f8fafc' }}>Student CGPA:</strong> {selectedApp.student?.cgpa ?? 'N/A'}</p>
              <p style={{ margin: '6px 0' }}><strong style={{ color: '#f8fafc' }}>Job Applied:</strong> <span style={{ color: '#38bdf8' }}>{selectedApp.job?.title || selectedApp.job || 'N/A'}</span></p>
              <p style={{ margin: '6px 0' }}><strong style={{ color: '#f8fafc' }}>Company:</strong> {selectedApp.job?.company?.companyName || selectedApp.job?.company?.name || selectedApp.company || 'N/A'}</p>
              <p style={{ margin: '6px 0' }}><strong style={{ color: '#f8fafc' }}>Applied Date:</strong> {selectedApp.appliedDate || (selectedApp.appliedAt ? new Date(selectedApp.appliedAt).toLocaleDateString() : 'N/A')}</p>
              <p style={{ margin: '6px 0' }}>
                <strong style={{ color: '#f8fafc' }}>Status:</strong>{' '}
                <span
                  style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '700',
                    backgroundColor:
                      selectedApp.status?.toUpperCase() === 'ACCEPTED' || selectedApp.status?.toUpperCase() === 'SELECTED'
                        ? 'rgba(16, 185, 129, 0.2)'
                        : selectedApp.status?.toUpperCase() === 'REJECTED'
                        ? 'rgba(239, 68, 68, 0.2)'
                        : 'rgba(245, 158, 11, 0.2)',
                    color:
                      selectedApp.status?.toUpperCase() === 'ACCEPTED' || selectedApp.status?.toUpperCase() === 'SELECTED'
                        ? '#34d399'
                        : selectedApp.status?.toUpperCase() === 'REJECTED'
                        ? '#f87171'
                        : '#fbbf24',
                  }}
                >
                  {selectedApp.status}
                </span>
              </p>
            </div>

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <button
                onClick={() => setSelectedApp(null)}
                style={{
                  padding: '8px 20px',
                  backgroundColor: '#475569',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
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

      </div>
    </div>
  );
};

export default ManageApplications;
