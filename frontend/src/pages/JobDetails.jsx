import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const JobDetails = () => {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return <p>Loading job details...</p>;
  }

  if (error) {
    return (
      <div>
        <h1>Job Details</h1>
        <p style={{ color: 'red' }}>{error}</p>
        <Link to="/student/jobs">
          <button>Back to Jobs</button>
        </Link>
      </div>
    );
  }

  const companyName =
    job.company?.companyName || job.company || 'N/A';

  const experience =
    job.experienceRequired || job.experience || 'N/A';

  return (
    <div>
      <h1>Job Details</h1>

      <h2>{job.title}</h2>

      <p>
        <strong>Company:</strong> {companyName}
      </p>

      <p>
        <strong>Location:</strong> {job.location || 'N/A'}
      </p>

      <p>
        <strong>Salary:</strong>{' '}
        {job.salary
          ? `₹${Number(job.salary).toLocaleString('en-IN')}`
          : 'Not Disclosed'}
      </p>

      <p>
        <strong>Experience:</strong> {experience}
      </p>

      <p>
        <strong>Job Type:</strong> {job.jobType || 'N/A'}
      </p>

      <p>
        <strong>Minimum CGPA:</strong> {job.minimumCgpa ?? 'N/A'}
      </p>

      <p>
        <strong>Deadline:</strong> {job.deadline || 'N/A'}
      </p>

      <p>
        <strong>Description:</strong> {job.description || 'N/A'}
      </p>

      <Link to={`/student/jobs/${id}/apply`}>
        <button style={{ marginRight: '10px' }}>
          Apply for Job
        </button>
      </Link>

      <Link to="/student/jobs">
        <button>Back to Jobs</button>
      </Link>
    </div>
  );
};

export default JobDetails;
