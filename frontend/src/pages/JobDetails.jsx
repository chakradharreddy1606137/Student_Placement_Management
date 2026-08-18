import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const JobDetails = () => {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
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
          setAlreadyApplied(isApplied);
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

  if (loading) {
    return (
      <div className="page-container">
        <div className="center-card" style={{ textAlign: 'center', maxWidth: '600px' }}>
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="center-card" style={{ textAlign: 'center', maxWidth: '600px' }}>
          <h1 style={{ margin: '0 0 10px 0' }}>Job Details</h1>
          <p style={{ color: '#f87171' }}>{error}</p>
          <Link to="/student/jobs">
            <button style={{ marginTop: '15px' }}>Back to Jobs</button>
          </Link>
        </div>
      </div>
    );
  }

  const companyName = job.company?.companyName || job.company || 'N/A';
  const experience = job.experienceRequired || job.experience || 'N/A';

  return (
    <div className="page-container">
      <div className="center-card" style={{ maxWidth: '750px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '16px' }}>
          <div>
            <h1 style={{ margin: 0 }}>{job.title}</h1>
            <p style={{ margin: '4px 0 0 0', color: '#38bdf8' }}>🏢 {companyName}</p>
          </div>
          <Link to="/student/jobs" style={{ textDecoration: 'none' }}>
            <button style={{ backgroundColor: '#475569', fontSize: '13px' }}>← Back to Jobs</button>
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '14px' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#94a3b8' }}>LOCATION</p>
            <h4 style={{ margin: 0, color: '#f8fafc' }}>📍 {job.location || 'N/A'}</h4>
          </div>

          <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '14px' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#94a3b8' }}>OFFERED CTC</p>
            <h4 style={{ margin: 0, color: '#34d399' }}>💰 {job.salary ? `₹${Number(job.salary).toLocaleString('en-IN')}` : 'Not Disclosed'}</h4>
          </div>

          <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '14px' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#94a3b8' }}>JOB TYPE</p>
            <h4 style={{ margin: 0, color: '#f8fafc' }}>🏷️ {job.jobType || 'N/A'}</h4>
          </div>

          <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '14px' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#94a3b8' }}>MINIMUM CGPA</p>
            <h4 style={{ margin: 0, color: '#fbbf24' }}>🎓 {job.minimumCgpa ?? 'N/A'}</h4>
          </div>

          <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '14px' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#94a3b8' }}>EXPERIENCE</p>
            <h4 style={{ margin: 0, color: '#f8fafc' }}>⏱️ {experience}</h4>
          </div>

          <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '14px' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#94a3b8' }}>APPLICATION DEADLINE</p>
            <h4 style={{ margin: 0, color: '#f87171' }}>⏰ {job.deadline || 'N/A'}</h4>
          </div>
        </div>

        <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#f8fafc', fontSize: '16px' }}>📝 Role Description</h3>
          <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.6 }}>{job.description || 'No detailed description provided.'}</p>
        </div>

        {/* About Company Card */}
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🏢 About {companyName}
            </h3>
            <span style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', fontSize: '12px', padding: '3px 8px', borderRadius: '12px' }}>
              Corporate Partner
            </span>
          </div>
          <p style={{ margin: '0 0 12px 0', color: '#cbd5e1', lineHeight: 1.6, fontSize: '14px' }}>
            {job.company?.description ||
              `${companyName} is an industry-leading hiring partner offering comprehensive training, competitive compensations, modern engineering stacks, and clear career trajectories for fresh graduates.`}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '13px', color: '#94a3b8' }}>
            <span>📍 <strong>HQ:</strong> {job.company?.location || job.location || 'India'}</span>
            {job.company?.website && (
              <span>
                🌐 <a href={job.company.website} target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>{job.company.website}</a>
              </span>
            )}
          </div>
        </div>

        {alreadyApplied ? (
          <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'rgba(52, 211, 153, 0.1)', border: '1px solid #059669', borderRadius: '8px' }}>
            <p style={{ margin: 0, color: '#34d399', fontWeight: 'bold', fontSize: '15px' }}>
              ✓ You have already applied for this position
            </p>
          </div>
        ) : (
          <Link to={`/student/jobs/${id}/apply`} style={{ textDecoration: 'none' }}>
            <button style={{ width: '100%', padding: '14px', fontSize: '16px', backgroundColor: '#10b981' }}>
              🚀 Apply for this Position
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
