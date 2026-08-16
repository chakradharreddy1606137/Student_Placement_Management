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
    <div>
      <h1>Available Jobs</h1>

      {loading && <p>Loading available jobs...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && jobs.length === 0 && (
        <p>No jobs available at the moment.</p>
      )}

      <div>
        {jobs.map((job) => (
          <div
            key={job.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px',
              maxWidth: '400px',
            }}
          >
            <h3>{job.title}</h3>
            <p><strong>Company:</strong> {job.company?.companyName || job.company || 'N/A'}</p>
            <p><strong>Location:</strong> {job.location || 'N/A'}</p>
            <p><strong>Salary:</strong> {job.salary ? `₹${Number(job.salary).toLocaleString('en-IN')}` : 'Not Disclosed'}</p>
            <Link to={`/student/jobs/${job.id}`}>
              <button>View Details</button>
            </Link>
          </div>
        ))}
      </div>

      <br />
      <Link to="/student/dashboard">
        <button>Back to Dashboard</button>
      </Link>
    </div>
  );
};

export default Jobs;
