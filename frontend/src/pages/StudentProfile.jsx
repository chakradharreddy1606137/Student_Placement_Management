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
    return <div>Loading profile...</div>;
  }

  if (error) {
    return (
      <div>
        <h1>Student Profile</h1>
        <p style={{ color: 'red' }}>{error}</p>
        <br />
        <Link to="/student/dashboard">
          <button>Back to Dashboard</button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Student Profile</h1>

      {student && (
        <div>
          <p><strong>Name:</strong> {student.user?.name || 'N/A'}</p>
          <p><strong>Email:</strong> {student.user?.email || 'N/A'}</p>
          <p><strong>College:</strong> {student.college || 'N/A'}</p>
          <p><strong>Degree:</strong> {student.degree || 'N/A'}</p>
          <p><strong>Branch:</strong> {student.branch || 'N/A'}</p>
          <p><strong>Graduation Year:</strong> {student.graduationYear || 'N/A'}</p>
          <p><strong>CGPA:</strong> {student.cgpa !== null && student.cgpa !== undefined ? student.cgpa : 'N/A'}</p>
          <p><strong>Phone:</strong> {student.phone || 'N/A'}</p>
          <p>
            <strong>Resume:</strong>{' '}
            {student.resumeUrl ? (
              <a href={student.resumeUrl} target="_blank" rel="noreferrer">
                View Resume
              </a>
            ) : (
              'Not provided'
            )}
          </p>
          {student.skills && student.skills.length > 0 && (
            <div>
              <p><strong>Skills:</strong></p>
              <ul>
                {student.skills.map((skill) => (
                  <li key={skill.id || skill.name}>{skill.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <br />
      <Link to="/student/dashboard">
        <button>Back to Dashboard</button>
      </Link>
    </div>
  );
};

export default StudentProfile;
