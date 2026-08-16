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
    <div>
      <h1>My Posted Jobs</h1>

      {loading && <p>Loading your jobs...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && jobs.length === 0 && (
        <p>You have not posted any jobs yet.</p>
      )}

      {!loading && !error && jobs.length > 0 && (
        <div>
          {jobs.map((job) => (
            <div
              key={job.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
                maxWidth: '450px',
              }}
            >
              <h3>{job.title}</h3>
              <p><strong>Location:</strong> {job.location || 'N/A'}</p>
              <p><strong>Salary:</strong> ₹{formatCurrency(job.salary)}</p>
              <p><strong>Job Type:</strong> {job.jobType}</p>
              <p><strong>Minimum CGPA:</strong> {job.minimumCgpa ?? job.minCgpa}</p>
              <p><strong>Deadline:</strong> {job.deadline}</p>
              <Link to={`/company/jobs/${job.id}/applications`}>
                <button style={{ marginRight: '10px' }}>View Applications</button>
              </Link>
            </div>
          ))}
        </div>
      )}

      <br />
      <Link to="/company/dashboard">
        <button>Back to Dashboard</button>
      </Link>
    </div>
  );
};

export default MyJobs;
