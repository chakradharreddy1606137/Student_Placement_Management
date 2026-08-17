import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;

        const response = await axiosInstance.get('/api/jobs');
        const allJobs = response.data;

        if (user && user.userId) {
          const myJobs = allJobs.filter(
            (job) =>
              job.company?.user?.id === user.userId ||
              job.company?.user?.email === user.email ||
              job.company?.id === user.userId
          );
          setJobs(myJobs);
        } else {
          setJobs([]);
        }
      } catch (err) {
        setError('Failed to load your jobs.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const formatCurrency = (value) => {
    return Number(value).toLocaleString('en-IN');
  };

  return (
    <div className="page-container">
      <div className="center-card" style={{ maxWidth: '960px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #334155', paddingBottom: '16px' }}>
          <div>
            <h1 style={{ margin: 0 }}>📋 My Posted Jobs</h1>
            <p style={{ margin: '4px 0 0 0' }}>Manage openings and review candidate applications</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/company/jobs/create" style={{ textDecoration: 'none' }}>
              <button style={{ backgroundColor: '#10b981', fontSize: '13px' }}>➕ Post New Job</button>
            </Link>
            <Link to="/company/dashboard" style={{ textDecoration: 'none' }}>
              <button style={{ backgroundColor: '#475569', fontSize: '13px' }}>← Dashboard</button>
            </Link>
          </div>
        </div>

        {loading && <p>Loading your jobs...</p>}
        {error && <p style={{ color: '#f87171' }}>{error}</p>}

        {!loading && !error && jobs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p>You have not posted any jobs yet.</p>
            <Link to="/company/jobs/create">
              <button style={{ marginTop: '10px' }}>Post Your First Job</button>
            </Link>
          </div>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
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
                  <h3 style={{ margin: '0 0 10px 0', color: '#f8fafc', fontSize: '18px' }}>{job.title}</h3>
                  <p style={{ margin: '0 0 6px 0', color: '#94a3b8', fontSize: '13px' }}>
                    📍 <strong>Location:</strong> {job.location || 'N/A'}
                  </p>
                  <p style={{ margin: '0 0 6px 0', color: '#34d399', fontSize: '14px', fontWeight: '600' }}>
                    💰 <strong>Salary:</strong> ₹{formatCurrency(job.salary)}
                  </p>
                  <p style={{ margin: '0 0 6px 0', color: '#94a3b8', fontSize: '13px' }}>
                    🏷️ <strong>Type:</strong> <span style={{ color: '#38bdf8' }}>{job.jobType}</span>
                  </p>
                  <p style={{ margin: '0 0 6px 0', color: '#94a3b8', fontSize: '13px' }}>
                    🎓 <strong>Min CGPA:</strong> {job.minimumCgpa ?? job.minCgpa ?? 'N/A'}
                  </p>
                  <p style={{ margin: '0 0 16px 0', color: '#94a3b8', fontSize: '13px' }}>
                    ⏰ <strong>Deadline:</strong> {job.deadline || 'N/A'}
                  </p>
                </div>
                <Link to={`/company/jobs/${job.id}/applications`} style={{ textDecoration: 'none' }}>
                  <button style={{ width: '100%' }}>View Applications</button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
