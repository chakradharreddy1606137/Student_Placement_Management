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
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Manage Companies</h1>
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      
      <table
        border="1"
        cellPadding="10"
        style={{ borderCollapse: 'collapse', width: '100%', maxWidth: '900px', marginTop: '15px' }}
      >
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
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={() => setSelectedCompany(null)}
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
              Company Details (ID: #{selectedCompany.id})
            </h2>

            <div style={{ lineHeight: '1.8', fontSize: '15px' }}>
              <p><strong>Company Name:</strong> {selectedCompany.companyName || selectedCompany.name || 'N/A'}</p>
              <p><strong>Contact Email:</strong> {selectedCompany.user?.email || selectedCompany.email || 'N/A'}</p>
              <p><strong>Location:</strong> {selectedCompany.location || 'N/A'}</p>
              <p>
                <strong>Website:</strong>{' '}
                {selectedCompany.website ? (
                  <a href={selectedCompany.website.startsWith('http') ? selectedCompany.website : `https://${selectedCompany.website}`} target="_blank" rel="noreferrer" style={{ color: '#007bff' }}>
                    {selectedCompany.website}
                  </a>
                ) : 'N/A'}
              </p>
              <p><strong>Description:</strong> {selectedCompany.description || 'No description provided'}</p>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button
                onClick={() => setSelectedCompany(null)}
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

export default ManageCompanies;
