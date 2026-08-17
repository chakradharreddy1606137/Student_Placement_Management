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
    <div className="page-container">
      <div className="center-card" style={{ maxWidth: '1050px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '16px' }}>
          <div>
            <h1 style={{ margin: 0 }}>👨‍🎓 Manage Students</h1>
            <p style={{ margin: '4px 0 0 0' }}>View, inspect and manage student accounts</p>
          </div>
          <Link to="/admin/dashboard" style={{ textDecoration: 'none' }}>
            <button style={{ backgroundColor: '#475569', fontSize: '13px' }}>← Dashboard</button>
          </Link>
        </div>
        {error && <p style={{ color: '#f87171', fontWeight: 'bold' }}>{error}</p>}
        
        <table>
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
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={() => setSelectedStudent(null)}
        >
          <div
            style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              padding: '28px',
              borderRadius: '12px',
              maxWidth: '520px',
              width: '90%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.7)',
              position: 'relative',
              color: '#f8fafc',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '12px', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#f8fafc' }}>
                Student Details (ID: #{selectedStudent.id})
              </h2>
              <button
                onClick={() => setSelectedStudent(null)}
                style={{ backgroundColor: '#334155', padding: '4px 10px', fontSize: '13px', color: '#cbd5e1' }}
              >
                ✕
              </button>
            </div>

            <div style={{ lineHeight: '1.9', fontSize: '14px', color: '#cbd5e1' }}>
              <p style={{ margin: '6px 0' }}><strong style={{ color: '#f8fafc' }}>Name:</strong> {selectedStudent.user?.name || selectedStudent.name || 'N/A'}</p>
              <p style={{ margin: '6px 0' }}><strong style={{ color: '#f8fafc' }}>Email:</strong> {selectedStudent.user?.email || selectedStudent.email || 'N/A'}</p>
              <p style={{ margin: '6px 0' }}><strong style={{ color: '#f8fafc' }}>Phone:</strong> {selectedStudent.phone || 'N/A'}</p>
              <p style={{ margin: '6px 0' }}><strong style={{ color: '#f8fafc' }}>College:</strong> {selectedStudent.college || 'N/A'}</p>
              <p style={{ margin: '6px 0' }}><strong style={{ color: '#f8fafc' }}>Degree & Branch:</strong> {selectedStudent.degree || ''} {selectedStudent.branch ? `- ${selectedStudent.branch}` : ''}</p>
              <p style={{ margin: '6px 0' }}><strong style={{ color: '#f8fafc' }}>Graduation Year:</strong> {selectedStudent.graduationYear || 'N/A'}</p>
              <p style={{ margin: '6px 0' }}><strong style={{ color: '#f8fafc' }}>CGPA:</strong> <span style={{ color: '#34d399', fontWeight: 'bold' }}>{selectedStudent.cgpa != null ? selectedStudent.cgpa : 'N/A'}</span></p>
              <p style={{ margin: '6px 0' }}>
                <strong style={{ color: '#f8fafc' }}>Resume:</strong>{' '}
                {selectedStudent.resumeUrl ? (
                  <a href={selectedStudent.resumeUrl} target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>
                    📄 View Resume
                  </a>
                ) : (
                  'Not uploaded'
                )}
              </p>
            </div>

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <button
                onClick={() => setSelectedStudent(null)}
                style={{
                  padding: '8px 20px',
                  backgroundColor: '#475569',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
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

      </div>
    </div>
  );
};

export default ManageStudents;
