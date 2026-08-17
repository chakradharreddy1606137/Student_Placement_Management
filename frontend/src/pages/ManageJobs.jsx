import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchJobs = async () => {
    try {
      const response = await axiosInstance.get('/api/jobs');
      setJobs(response.data);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError('Access denied: insufficient permissions');
      } else {
        setError('Failed to load jobs');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete job #${id}?`)) return;
    try {
      await axiosInstance.delete(`/api/jobs/${id}`);
      setJobs((prev) => prev.filter((job) => job.id !== id));
      if (selectedJob?.id === id) {
        setSelectedJob(null);
      }
    } catch (err) {
      setError('Delete failed');
    }
  };

  const handleView = (job) => {
    setSelectedJob(job);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="center-card" style={{ textAlign: 'center', maxWidth: '600px' }}>
          <p>Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="center-card" style={{ maxWidth: '1050px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '16px' }}>
          <div>
            <h1 style={{ margin: 0 }}>💼 Manage Jobs</h1>
            <p style={{ margin: '4px 0 0 0' }}>View, inspect and manage all active job postings</p>
          </div>
          <Link to="/admin/dashboard" style={{ textDecoration: 'none' }}>
            <button style={{ backgroundColor: '#475569', fontSize: '13px' }}>← Dashboard</button>
          </Link>
        </div>
        {error && <p style={{ color: '#f87171', fontWeight: 'bold' }}>{error}</p>}

        <table>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>Job ID</th>
            <th>Title</th>
            <th>Company</th>
            <th>Location</th>
            <th>Salary</th>
            <th>Min CGPA</th>
            <th>Deadline</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job.id}</td>
              <td>{job.title}</td>
              <td>{job.company?.companyName || job.company?.name || job.company || 'N/A'}</td>
              <td>{job.location}</td>
              <td>₹{job.salary ? Number(job.salary).toLocaleString('en-IN') : 'N/A'}</td>
              <td>{job.minimumCgpa}</td>
              <td>{job.deadline}</td>
              <td>{job.jobType}</td>
              <td>
                <button 
                  onClick={() => handleView(job)} 
                  style={{ marginRight: '8px', cursor: 'pointer', padding: '5px 10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}
                >
                  View
                </button>
                <button 
                  onClick={() => handleDelete(job.id)} 
                  style={{ cursor: 'pointer', padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Job Details Modal */}
      {selectedJob && (
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
          onClick={() => setSelectedJob(null)}
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
                Job Details: {selectedJob.title}
              </h2>
              <button
                onClick={() => setSelectedJob(null)}
                style={{ backgroundColor: '#334155', padding: '4px 10px', fontSize: '13px', color: '#cbd5e1' }}
              >
                ✕
              </button>
            </div>

            <div style={{ lineHeight: '1.9', fontSize: '14px', color: '#cbd5e1' }}>
              <p style={{ margin: '6px 0' }}><strong style={{ color: '#f8fafc' }}>Job ID:</strong> #{selectedJob.id}</p>
              <p style={{ margin: '6px 0' }}><strong style={{ color: '#f8fafc' }}>Company:</strong> {selectedJob.company?.companyName || selectedJob.company?.name || selectedJob.company || 'N/A'}</p>
              <p style={{ margin: '6px 0' }}><strong style={{ color: '#f8fafc' }}>Location:</strong> 📍 {selectedJob.location}</p>
              <p style={{ margin: '6px 0' }}><strong style={{ color: '#f8fafc' }}>Job Type:</strong> <span style={{ color: '#38bdf8' }}>{selectedJob.jobType}</span></p>
              <p style={{ margin: '6px 0' }}><strong style={{ color: '#f8fafc' }}>Salary / CTC:</strong> <span style={{ color: '#34d399', fontWeight: 'bold' }}>₹{selectedJob.salary ? Number(selectedJob.salary).toLocaleString('en-IN') : 'N/A'}</span></p>
              <p style={{ margin: '6px 0' }}><strong style={{ color: '#f8fafc' }}>Minimum CGPA:</strong> {selectedJob.minimumCgpa}</p>
              <p style={{ margin: '6px 0' }}><strong style={{ color: '#f8fafc' }}>Deadline:</strong> {selectedJob.deadline}</p>
              <p style={{ margin: '6px 0' }}><strong style={{ color: '#f8fafc' }}>Description:</strong> {selectedJob.description || 'No description provided'}</p>
            </div>

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <button
                onClick={() => setSelectedJob(null)}
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

export default ManageJobs;
