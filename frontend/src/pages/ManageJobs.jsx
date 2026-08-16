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

  if (loading) return <p style={{ padding: '20px' }}>Loading jobs...</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Manage Jobs</h1>
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      <table
        border="1"
        cellPadding="10"
        style={{ borderCollapse: 'collapse', width: '100%', maxWidth: '950px', marginTop: '15px' }}
      >
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
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={() => setSelectedJob(null)}
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
              Job Details: {selectedJob.title}
            </h2>

            <div style={{ lineHeight: '1.8', fontSize: '15px' }}>
              <p><strong>Job ID:</strong> #{selectedJob.id}</p>
              <p><strong>Company:</strong> {selectedJob.company?.companyName || selectedJob.company?.name || selectedJob.company || 'N/A'}</p>
              <p><strong>Location:</strong> {selectedJob.location}</p>
              <p><strong>Job Type:</strong> {selectedJob.jobType}</p>
              <p><strong>Salary / CTC:</strong> ₹{selectedJob.salary ? Number(selectedJob.salary).toLocaleString('en-IN') : 'N/A'}</p>
              <p><strong>Minimum CGPA:</strong> {selectedJob.minimumCgpa}</p>
              <p><strong>Deadline:</strong> {selectedJob.deadline}</p>
              <p><strong>Description:</strong> {selectedJob.description || 'No description provided'}</p>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button
                onClick={() => setSelectedJob(null)}
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

export default ManageJobs;
