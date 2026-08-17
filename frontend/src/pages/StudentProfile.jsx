import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/api/students/me');
        setStudent(response.data);
      } catch (err) {
        if (err.response && err.response.status === 403) {
          setError('Access denied: insufficient permissions');
        } else {
          setError('Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="center-card" style={{ textAlign: 'center', maxWidth: '600px' }}>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="center-card" style={{ textAlign: 'center', maxWidth: '600px' }}>
          <h1 style={{ margin: '0 0 10px 0' }}>👤 Student Profile</h1>
          <p style={{ color: '#f87171' }}>{error}</p>
          <Link to="/student/dashboard">
            <button style={{ marginTop: '15px' }}>Back to Dashboard</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="center-card" style={{ maxWidth: '680px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #334155', paddingBottom: '16px' }}>
          <div>
            <h1 style={{ margin: 0 }}>👤 Student Profile</h1>
            <p style={{ margin: '4px 0 0 0' }}>Your personal and academic details</p>
          </div>
          <Link to="/student/dashboard" style={{ textDecoration: 'none' }}>
            <button style={{ backgroundColor: '#475569', fontSize: '13px' }}>← Dashboard</button>
          </Link>
        </div>

        {student && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '16px' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#94a3b8' }}>FULL NAME</p>
              <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '16px' }}>{student.user?.name || 'N/A'}</h4>
            </div>

            <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '16px' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#94a3b8' }}>EMAIL ADDRESS</p>
              <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '16px' }}>{student.user?.email || 'N/A'}</h4>
            </div>

            <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '16px' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#94a3b8' }}>COLLEGE / UNIVERSITY</p>
              <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '16px' }}>{student.college || 'N/A'}</h4>
            </div>

            <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '16px' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#94a3b8' }}>DEGREE & BRANCH</p>
              <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '16px' }}>{student.degree || ''} {student.branch ? `- ${student.branch}` : ''}</h4>
            </div>

            <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '16px' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#94a3b8' }}>GRADUATION YEAR</p>
              <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '16px' }}>{student.graduationYear || 'N/A'}</h4>
            </div>

            <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '16px' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#94a3b8' }}>CGPA</p>
              <h4 style={{ margin: 0, color: '#34d399', fontSize: '18px' }}>{student.cgpa !== null && student.cgpa !== undefined ? student.cgpa : 'N/A'}</h4>
            </div>

            <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '16px' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#94a3b8' }}>PHONE NUMBER</p>
              <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '16px' }}>{student.phone || 'N/A'}</h4>
            </div>

            <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '16px' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#94a3b8' }}>RESUME</p>
              {student.resumeUrl ? (
                <a href={student.resumeUrl} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', fontWeight: '600' }}>
                  📄 View Resume
                </a>
              ) : (
                <span style={{ color: '#94a3b8' }}>Not provided</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
