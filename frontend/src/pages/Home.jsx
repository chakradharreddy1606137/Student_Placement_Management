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
        padding: '20px',
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
        <h1
          style={{
            margin: '0 0 12px 0',
            fontSize: '28px',
            fontWeight: '800',
            color: '#f8fafc',
            lineHeight: 1.3,
          }}
        >
          🎓 Student Placement Management
        </h1>
        <p style={{ margin: '0 0 32px 0', fontSize: '15px', color: '#94a3b8' }}>
          Connect students, top companies, and placement administrators.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Link to="/login/student" style={{ textDecoration: 'none' }}>
            <button
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.1s',
              }}
            >
              👨‍🎓 Student Portal
            </button>
          </Link>

          <Link to="/login/company" style={{ textDecoration: 'none' }}>
            <button
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.1s',
              }}
            >
              🏢 Company Portal
            </button>
          </Link>

          <Link to="/login/admin" style={{ textDecoration: 'none' }}>
            <button
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.1s',
              }}
            >
              🔑 Admin Portal
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home

