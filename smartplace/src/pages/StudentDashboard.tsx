import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import '../styles/Dashboard.css';

export default function StudentDashboard({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState('overview');

  const sidebarItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'applications', label: 'Applications' },
    { id: 'profile', label: 'Profile' },
  ];

  const applications = [
    { id: 1, company: 'Google', status: 'pending', date: '2023-10-15' },
    { id: 2, company: 'Microsoft', status: 'rejected', date: '2023-09-20' },
    { id: 3, company: 'TCS', status: 'selected', date: '2023-11-01' },
    { id: 4, company: 'Amazon', status: 'pending', date: '2023-11-05' },
  ];

  return (
    <DashboardLayout
      user={user}
      sidebarItems={sidebarItems}
      activeItem={activeTab}
      onSidebarChange={setActiveTab}
      title="Student Portal"
    >
      <header className="page-header">
        <h1 className="page-title">
          {activeTab === 'overview' ? 'Dashboard Overview' : 
           activeTab === 'applications' ? 'My Applications' : 'Profile Settings'}
        </h1>
        <p className="page-subtitle">Welcome back, {user.email}</p>
      </header>

      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <section className="content-card">
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Application Status</h3>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 3).map(app => (
                    <tr key={app.id}>
                      <td style={{ fontWeight: 500 }}>{app.company}</td>
                      <td>
                        <span className={`status-badge ${app.status}`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: '1rem', textAlign: 'right' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => setActiveTab('applications')}
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              >
                View All
              </button>
            </div>
          </section>

          <section className="content-card">
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
                📄 Update Resume
              </button>
              <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                🔍 Search New Jobs
              </button>
              <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                👤 Edit Profile
              </button>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'applications' && (
        <section className="content-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Date Applied</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id}>
                    <td>
                      <div className="user-details">
                        <span className="user-email-text">{app.company}</span>
                      </div>
                    </td>
                    <td>Software Engineer Intern</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{app.date}</td>
                    <td>
                      <span className={`status-badge ${app.status}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'profile' && (
        <section className="content-card">
          <p style={{ color: 'var(--text-secondary)', padding: '2rem', textAlign: 'center' }}>
            Profile settings module coming soon.
          </p>
        </section>
      )}
    </DashboardLayout>
  );
}
