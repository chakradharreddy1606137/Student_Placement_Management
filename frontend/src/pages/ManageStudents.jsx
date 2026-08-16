import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = async () => {
    try {
      const response = await axiosInstance.get('/api/students');
      setStudents(response.data);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError('Access denied: insufficient permissions');
      } else {
        setError('Failed to load students');
      }
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete student #${id}?`)) return;
    try {
      await axiosInstance.delete(`/api/students/${id}`);
      setStudents((prev) => prev.filter((student) => student.id !== id));
      if (selectedStudent?.id === id) {
        setSelectedStudent(null);
      }
    } catch (err) {
      setError('Delete failed');
    }
  };

  const handleView = (student) => {
    setSelectedStudent(student);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Manage Students</h1>
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      
      <table
        border="1"
        cellPadding="10"
        style={{ borderCollapse: 'collapse', width: '100%', maxWidth: '900px', marginTop: '15px' }}
      >
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>Student ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>College</th>
            <th>Branch</th>
            <th>CGPA</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.user?.name || student.name || 'N/A'}</td>
              <td>{student.user?.email || student.email || 'N/A'}</td>
              <td>{student.college || 'N/A'}</td>
              <td>{student.branch || 'N/A'}</td>
              <td>{student.cgpa ?? 'N/A'}</td>
              <td>
                <button 
                  onClick={() => handleView(student)} 
                  style={{ marginRight: '8px', cursor: 'pointer', padding: '5px 10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(student.id)}
                  style={{ cursor: 'pointer', padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={() => setSelectedStudent(null)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '25px',
              borderRadius: '8px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0, borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
              Student Details (ID: #{selectedStudent.id})
            </h2>

            <div style={{ lineHeight: '1.8', fontSize: '15px' }}>
              <p><strong>Name:</strong> {selectedStudent.user?.name || selectedStudent.name || 'N/A'}</p>
              <p><strong>Email:</strong> {selectedStudent.user?.email || selectedStudent.email || 'N/A'}</p>
              <p><strong>Phone:</strong> {selectedStudent.phone || 'N/A'}</p>
              <p><strong>College:</strong> {selectedStudent.college || 'N/A'}</p>
              <p><strong>Degree:</strong> {selectedStudent.degree || 'N/A'}</p>
              <p><strong>Branch:</strong> {selectedStudent.branch || 'N/A'}</p>
              <p><strong>Graduation Year:</strong> {selectedStudent.graduationYear || 'N/A'}</p>
              <p><strong>CGPA:</strong> {selectedStudent.cgpa != null ? selectedStudent.cgpa : 'N/A'}</p>
              <p>
                <strong>Resume:</strong>{' '}
                {selectedStudent.resumeUrl ? (
                  <a href={selectedStudent.resumeUrl} target="_blank" rel="noreferrer" style={{ color: '#007bff' }}>
                    View Resume
                  </a>
                ) : (
                  'Not uploaded'
                )}
              </p>
              <p>
                <strong>Skills:</strong>{' '}
                {selectedStudent.skills && selectedStudent.skills.length > 0
                  ? Array.from(selectedStudent.skills).map((s) => s.name || s).join(', ')
                  : 'None'}
              </p>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button
                onClick={() => setSelectedStudent(null)}
                style={{
                  padding: '8px 18px',
                  backgroundColor: '#6c757d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <br />
      <Link to="/admin/dashboard">
        <button style={{ padding: '8px 15px', cursor: 'pointer' }}>Back to Dashboard</button>
      </Link>
    </div>
  );
};

export default ManageStudents;
