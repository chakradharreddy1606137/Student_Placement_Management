import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axiosInstance.get('/api/jobs');
        setJobs(response.data);
      } catch (err) {
        setError('Failed to fetch jobs.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="page-container">
      <div className="center-card" style={{ maxWidth: '900px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #334155', paddingBottom: '16px' }}>
          <div>
            <h1 style={{ margin: 0 }}>💼 Available Jobs</h1>
            <p style={{ margin: '4px 0 0 0' }}>Explore opportunities and apply</p>
          </div>
          <Link to="/student/dashboard">
            <button style={{ backgroundColor: '#475569', fontSize: '13px' }}>← Dashboard</button>
          </Link>
        </div>

        {loading && <p>Loading available jobs...</p>}
        {error && <p style={{ color: '#f87171' }}>{error}</p>}

        {!loading && !error && jobs.length === 0 && (
          <p style={{ textAlign: 'center', padding: '30px 0' }}>No jobs available at the moment.</p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {jobs.map((job) => (
            <div
              key={job.id}
              style={{
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h3 style={{ margin: '0 0 8px 0', color: '#f8fafc', fontSize: '18px' }}>{job.title}</h3>
                <p style={{ margin: '0 0 4px 0', color: '#94a3b8', fontSize: '13px' }}>
                  🏢 {job.company?.companyName || job.company || 'N/A'}
                </p>
                <p style={{ margin: '0 0 4px 0', color: '#94a3b8', fontSize: '13px' }}>
                  📍 {job.location || 'N/A'}
                </p>
                <p style={{ margin: '0 0 16px 0', color: '#34d399', fontSize: '14px', fontWeight: '600' }}>
                  💰 {job.salary ? `₹${Number(job.salary).toLocaleString('en-IN')}` : 'Not Disclosed'}
                </p>
              </div>
              <Link to={`/student/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
                <button style={{ width: '100%' }}>View Details</button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
