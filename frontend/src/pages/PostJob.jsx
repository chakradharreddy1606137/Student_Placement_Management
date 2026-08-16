import { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    jobType: 'FULL_TIME',
    minCgpa: '',
    experienceRequired: '',
    deadline: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (!user || !user.userId) {
        setError('Invalid session. Please log in as a Company.');
        setLoading(false);
        return;
      }

      // Strict company identity lookup: find company associated with logged-in user
      const companiesRes = await axiosInstance.get('/api/companies');
      const myCompany = companiesRes.data.find(
        (c) => c.user?.id === user.userId || c.user?.email === user.email
      );

      if (!myCompany || !myCompany.id) {
        setError('No associated Company profile found for your account. Please create or update your profile first.');
        setLoading(false);
        return;
      }

      const jobPayload = {
        company: { id: myCompany.id },
        title: formData.title,
        description: formData.description,
        location: formData.location,
        salary: formData.salary ? Number(formData.salary) : null,
        jobType: formData.jobType,
        minimumCgpa: formData.minCgpa ? Number(formData.minCgpa) : null,
        experienceRequired: formData.experienceRequired,
        deadline: formData.deadline || null,
      };

      await axiosInstance.post('/api/jobs', jobPayload);
      setSubmitted(true);
    } catch (err) {
      const backendError =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to post job. Please try again.';
      setError(backendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Post a Job</h1>

      {error && (
        <div style={{ color: 'red', margin: '15px 0', padding: '10px', border: '1px solid red', borderRadius: '4px', maxWidth: '500px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {submitted ? (
        <div style={{ color: 'green', margin: '20px 0' }}>
          <h3>Job posted successfully!</h3>
          <p>
            The job opening for <strong>{formData.title}</strong> has been created.
          </p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  title: '',
                  description: '',
                  location: '',
                  salary: '',
                  jobType: 'FULL_TIME',
                  minCgpa: '',
                  experienceRequired: '',
                  deadline: '',
                });
              }}
            >
              Post Another Job
            </button>
            <Link to="/company/dashboard">
              <button>Back to Dashboard</button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
          <div style={{ marginBottom: '10px' }}>
            <label>Job Title:</label>
            <br />
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Full Stack Cloud Engineer"
              required
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Description:</label>
            <br />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g. Build modern cloud and microservices applications"
              rows={3}
              required
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Location:</label>
            <br />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Bengaluru"
              required
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Salary (₹):</label>
            <br />
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g. 1200000"
              required
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Job Type:</label>
            <br />
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              style={{ width: '100%' }}
            >
              <option value="FULL_TIME">FULL_TIME</option>
              <option value="PART_TIME">PART_TIME</option>
              <option value="INTERNSHIP">INTERNSHIP</option>
            </select>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Minimum CGPA:</label>
            <br />
            <input
              type="number"
              step="0.1"
              name="minCgpa"
              value={formData.minCgpa}
              onChange={handleChange}
              placeholder="e.g. 7.5"
              required
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Experience Required:</label>
            <br />
            <input
              type="text"
              name="experienceRequired"
              value={formData.experienceRequired}
              onChange={handleChange}
              placeholder="e.g. 1-3 years"
              required
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Deadline:</label>
            <br />
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              style={{ width: '100%' }}
            />
          </div>

          <button type="submit" disabled={loading} style={{ marginRight: '10px' }}>
            {loading ? 'Posting...' : 'Post Job'}
          </button>
          <Link to="/company/dashboard">
            <button type="button">Back to Dashboard</button>
          </Link>
        </form>
      )}
    </div>
  );
};

export default PostJob;
