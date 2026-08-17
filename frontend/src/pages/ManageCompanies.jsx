import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const ManageCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);

  const fetchCompanies = async () => {
    try {
      const response = await axiosInstance.get('/api/companies');
      setCompanies(response.data);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError('Access denied: insufficient permissions');
      } else {
        setError('Failed to load companies');
      }
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete company #${id}?`)) return;
    try {
      await axiosInstance.delete(`/api/companies/${id}`);
      setCompanies((prev) => prev.filter((company) => company.id !== id));
      if (selectedCompany?.id === id) {
        setSelectedCompany(null);
      }
    } catch (err) {
      setError('Delete failed');
    }
  };

  const handleView = (company) => {
    setSelectedCompany(company);
  };

  return (
    <div className="page-container">
      <div className="center-card" style={{ maxWidth: '1050px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '16px' }}>
          <div>
            <h1 style={{ margin: 0 }}>🏢 Manage Companies</h1>
            <p style={{ margin: '4px 0 0 0' }}>View, inspect and manage registered company partners</p>
          </div>
          <Link to="/admin/dashboard" style={{ textDecoration: 'none' }}>
            <button style={{ backgroundColor: '#475569', fontSize: '13px' }}>← Dashboard</button>
          </Link>
        </div>
        {error && <p style={{ color: '#f87171', fontWeight: 'bold' }}>{error}</p>}
        
        <table>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>Company ID</th>
            <th>Company Name</th>
            <th>Email</th>
            <th>Location</th>
            <th>Website</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id}>
              <td>{company.id}</td>
              <td>{company.companyName || company.name || 'N/A'}</td>
              <td>{company.user?.email || company.email || 'N/A'}</td>
              <td>{company.location || 'N/A'}</td>
              <td>
                {company.website ? (
                  <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noreferrer" style={{ color: '#007bff' }}>
                    {company.website}
                  </a>
                ) : 'N/A'}
              </td>
              <td>
                <button 
                  onClick={() => handleView(company)} 
                  style={{ marginRight: '8px', cursor: 'pointer', padding: '5px 10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}
                >
                  View
                </button>
                <button 
                  onClick={() => handleDelete(company.id)} 
                  style={{ cursor: 'pointer', padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Company Details Modal */}
      {selectedCompany && (
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
          onClick={() => setSelectedCompany(null)}
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
                Company Details (ID: #{selectedCompany.id})
              </h2>
              <button
                onClick={() => setSelectedCompany(null)}
                style={{ backgroundColor: '#334155', padding: '4px 10px', fontSize: '13px', color: '#cbd5e1' }}
              >
                ✕
              </button>
            </div>

            <div style={{ lineHeight: '1.9', fontSize: '14px', color: '#cbd5e1' }}>
              <p style={{ margin: '6px 0' }}><strong style={{ color: '#f8fafc' }}>Company Name:</strong> {selectedCompany.companyName || selectedCompany.name || 'N/A'}</p>
              <p style={{ margin: '6px 0' }}><strong style={{ color: '#f8fafc' }}>Contact Email:</strong> {selectedCompany.user?.email || selectedCompany.email || 'N/A'}</p>
              <p style={{ margin: '6px 0' }}><strong style={{ color: '#f8fafc' }}>Location:</strong> {selectedCompany.location || 'N/A'}</p>
              <p style={{ margin: '6px 0' }}>
                <strong style={{ color: '#f8fafc' }}>Website:</strong>{' '}
                {selectedCompany.website ? (
                  <a href={selectedCompany.website.startsWith('http') ? selectedCompany.website : `https://${selectedCompany.website}`} target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>
                    🌐 {selectedCompany.website}
                  </a>
                ) : 'N/A'}
              </p>
              <p style={{ margin: '6px 0' }}><strong style={{ color: '#f8fafc' }}>Description:</strong> {selectedCompany.description || 'No description provided'}</p>
            </div>

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <button
                onClick={() => setSelectedCompany(null)}
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

export default ManageCompanies;
