import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const ApplyJob = () => {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axiosInstance.get(`/api/jobs/${id}`);
        setJob(response.data);

        // Check if student already applied
        try {
          const appsRes = await axiosInstance.get('/api/applications/my');
          const isApplied = (appsRes.data || []).some(
            (a) => a.jobId === Number(id) || a.job?.id === Number(id)
          );
          if (isApplied) {
            setAlreadyApplied(true);
          }
        } catch (e) {
          // ignore
        }
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

      if (!user || (!user.userId && !user.id && !user.email)) {
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
    return (
      <div className="page-container">
        <div className="center-card" style={{ textAlign: 'center', maxWidth: '600px' }}>
          <p>Loading application form...</p>
        </div>
      </div>
    );
  }

  const companyName = job?.company?.companyName || job?.company || 'N/A';

  return (
    <div className="page-container">
      <div className="center-card" style={{ maxWidth: '640px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '16px' }}>
          <div>
            <h1 style={{ margin: 0 }}>🚀 Apply for Position</h1>
            <p style={{ margin: '4px 0 0 0' }}>Confirm application details</p>
          </div>
          <Link to={`/student/jobs/${id}`} style={{ textDecoration: 'none' }}>
            <button style={{ backgroundColor: '#475569', fontSize: '13px' }}>← Cancel</button>
          </Link>
        </div>

        {job && (
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <h2 style={{ margin: '0 0 8px 0', color: '#f8fafc', fontSize: '20px' }}>{job.title}</h2>
            <p style={{ margin: '0 0 4px 0', color: '#94a3b8' }}>🏢 <strong>Company:</strong> {companyName}</p>
            <p style={{ margin: '0 0 4px 0', color: '#94a3b8' }}>📍 <strong>Location:</strong> {job.location || 'N/A'}</p>
            <p style={{ margin: 0, color: '#34d399', fontWeight: '600' }}>
              💰 <strong>Offered CTC:</strong> {job.salary ? `₹${Number(job.salary).toLocaleString('en-IN')}` : 'Not Disclosed'}
            </p>
          </div>
        )}

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', margin: '15px 0', padding: '12px', border: '1px solid #ef4444', borderRadius: '8px' }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {applied ? (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '12px', padding: '24px', textAlign: 'center', margin: '20px 0' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>🎉</div>
            <h3 style={{ color: '#34d399', margin: '0 0 8px 0' }}>Application Submitted Successfully!</h3>
            <p style={{ color: '#cbd5e1', margin: '0 0 20px 0' }}>Your application for <strong>{job?.title}</strong> at <strong>{companyName}</strong> has been received.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <Link to="/student/applications">
                <button style={{ backgroundColor: '#3b82f6' }}>Track My Applications</button>
              </Link>
              <Link to="/student/dashboard">
                <button style={{ backgroundColor: '#475569' }}>Back to Dashboard</button>
              </Link>
            </div>
          </div>
        ) : alreadyApplied ? (
          <div style={{ backgroundColor: 'rgba(251, 191, 36, 0.15)', border: '1px solid #f59e0b', borderRadius: '12px', padding: '24px', textAlign: 'center', margin: '20px 0' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>📋</div>
            <h3 style={{ color: '#fbbf24', margin: '0 0 8px 0' }}>Already Applied</h3>
            <p style={{ color: '#cbd5e1', margin: '0 0 20px 0' }}>You have already submitted an application for <strong>{job?.title}</strong> at <strong>{companyName}</strong>.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <Link to="/student/applications">
                <button style={{ backgroundColor: '#3b82f6' }}>Track My Applications</button>
              </Link>
              <Link to="/student/jobs">
                <button style={{ backgroundColor: '#475569' }}>Browse Other Jobs</button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleApply} style={{ marginTop: '20px' }}>
            <p style={{ color: '#cbd5e1', marginBottom: '20px' }}>
              Your profile information, academic records, and resume will be shared with <strong>{companyName}</strong>.
            </p>
            <button
              type="submit"
              disabled={applying || !job}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                backgroundColor: '#10b981',
              }}
            >
              {applying ? 'Submitting Application...' : 'Confirm & Submit Application'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ApplyJob;
