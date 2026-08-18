import { Link } from 'react-router-dom'

function Home() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '24px 16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '16px',
          padding: '40px 32px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid #3b82f6',
            borderRadius: '20px',
            padding: '5px 14px',
            marginBottom: '16px',
          }}
        >
          <span style={{ fontSize: '13px' }}>✨</span>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#93c5fd', letterSpacing: '0.5px' }}>
            CAMPUS RECRUITMENT SUITE
          </span>
        </div>

        <h1
          style={{
            margin: '0 0 10px 0',
            fontSize: '30px',
            fontWeight: '800',
            color: '#f8fafc',
            lineHeight: 1.2,
          }}
        >
          🎓 Student Placement Management
        </h1>
        <p style={{ margin: '0 0 32px 0', fontSize: '14px', color: '#94a3b8', lineHeight: 1.5 }}>
          Role-based placement portal connecting students, corporate recruiters, and university placement administrators.
        </p>

        {/* Portal Login Navigation Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Link to="/login/student" style={{ textDecoration: 'none' }}>
            <button
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              }}
            >
              <span style={{ fontSize: '20px' }}>👨‍🎓</span>
              <span>Student Login</span>
            </button>
          </Link>

          <Link to="/login/company" style={{ textDecoration: 'none' }}>
            <button
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              }}
            >
              <span style={{ fontSize: '20px' }}>🏢</span>
              <span>Company Login</span>
            </button>
          </Link>

          <Link to="/login/admin" style={{ textDecoration: 'none' }}>
            <button
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              }}
            >
              <span style={{ fontSize: '20px' }}>🔑</span>
              <span>Admin Login</span>
            </button>
          </Link>
        </div>

        <div style={{ marginTop: '28px', borderTop: '1px solid #334155', paddingTop: '16px' }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
            Placement Management System &bull; Secure Authentication &bull; Real-time Database
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home
