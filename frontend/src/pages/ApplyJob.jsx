import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const ApplyJob = () => {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axiosInstance.get(`/api/jobs/${id}`);
        setJob(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Job not found.');
        } else {
          setError('Failed to fetch job details.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();

    setError('');
    setApplying(true);

    try {
      const storedUser = localStorage.getItem('user');

      if (!storedUser) {
        setError('Please login before applying.');
        setApplying(false);
        return;
      }

      const user = JSON.parse(storedUser);

      if (!user.userId) {
        setError('User session is invalid. Please login again.');
        setApplying(false);
        return;
      }

      await axiosInstance.post('/api/applications', {
        job: {
          id: Number(id),
        },
      });

      setApplied(true);
    } catch (err) {
      const backendError =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Failed to submit application.';
      setError(backendError);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <p>Loading job details...</p>;
  }

  const companyName = job?.company?.companyName || job?.company || 'N/A';

  return (
    <div>
      <h1>Apply for Job</h1>

      {job && (
        <>
          <h2>{job.title}</h2>
          <p><strong>Company:</strong> {companyName}</p>
          <p><strong>Location:</strong> {job.location || 'N/A'}</p>
          <p><strong>Salary:</strong> {job.salary ? `₹${Number(job.salary).toLocaleString('en-IN')}` : 'Not Disclosed'}</p>
        </>
      )}

      {error && (
        <div style={{ color: 'red', margin: '15px 0', padding: '10px', border: '1px solid red', borderRadius: '4px', maxWidth: '400px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {applied ? (
        <div style={{ color: 'green', margin: '20px 0' }}>
          <h3>Application Submitted Successfully!</h3>
          <p>Your application for {job?.title} at {companyName} has been received.</p>
          <Link to="/student/dashboard">
            <button>Back to Dashboard</button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleApply} style={{ marginTop: '20px' }}>
          <p>Click below to confirm and submit your job application.</p>
          <button type="submit" disabled={applying || !job} style={{ marginRight: '10px' }}>
            {applying ? 'Submitting...' : 'Confirm & Apply'}
          </button>
          <Link to={`/student/jobs/${id}`}>
            <button type="button">Cancel</button>
          </Link>
        </form>
      )}
    </div>
  );
};

export default ApplyJob;
