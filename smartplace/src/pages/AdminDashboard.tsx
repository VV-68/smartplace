import { supabase } from '../lib/supabase'
import { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import DashboardLayout from '../components/layout/DashboardLayout';

type UserRole = 'students' | 'faculties' | 'companies';

interface DashboardUser {
  id: string;
  email: string;
  is_verified: boolean;
  status: 'active' | 'banned';
}

export default function AdminDashboard({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<UserRole>('students');
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Mapping tabs to endpoints if they exist, or just using student_list as a placeholder
        // const endpoint = activeTab === 'students' ? 'student_list' : 
        //                  activeTab === 'faculties' ? 'faculty_list' : 'company_list';
        
        try {
          // In a real app, you'd fetch from your API here
          // const res = await fetch(`http://localhost:3000/${endpoint}`, ...);
          
          // Simulating network delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Mock data generation based on tab
          const mockUsers = Array.from({ length: 5 }, (_, i) => ({
            id: `${activeTab}-${i + 1}`,
            email: `${activeTab}_user_${i + 1}@example.com`,
            is_verified: i % 2 === 0,
            status: (i % 3 === 0 ? 'banned' : 'active') as 'active' | 'banned'
          }));
          
          setUsers(mockUsers);
        } catch (err: any) {
          console.error('Error fetching data:', err.message);
          setUsers([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [activeTab]);

  const toggleVerification = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, is_verified: !u.is_verified } : u
    ));
  };

  const toggleBan = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: u.status === 'active' ? 'banned' : 'active' } : u
    ));
  };

  const sidebarItems = [
    { id: 'students', label: 'Students' },
    { id: 'faculties', label: 'Faculties' },
    { id: 'companies', label: 'Companies' },
  ];

  return (
    <DashboardLayout
      user={user}
      sidebarItems={sidebarItems}
      activeItem={activeTab}
      onSidebarChange={(id) => setActiveTab(id as UserRole)}
      title="Admin Panel"
    >
      <header className="page-header">
        <h1 className="page-title">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h1>
        <p className="page-subtitle">Managing {users.length} {activeTab} in the system</p>
      </header>

      <section className="content-card">
        {loading ? (
          <p className="loading-text">Loading data...</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User Info</th>
                  <th>Verification</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? users.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div className="user-details">
                        <span className="user-email-text">{u.email}</span>
                        <span className="user-id-text">ID: {u.id}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${u.is_verified ? 'verified' : 'unverified'}`}>
                        {u.is_verified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td>
                      <span className="status-text" style={{ color: u.status === 'banned' ? 'var(--danger-color)' : 'inherit' }}>
                        {u.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn btn-secondary"
                          onClick={() => toggleVerification(u.id)}
                        >
                          {u.is_verified ? 'Unverify' : 'Verify'}
                        </button>
                        <button 
                          className="btn btn-danger"
                          onClick={() => toggleBan(u.id)}
                        >
                          {u.status === 'active' ? 'Ban' : 'Unban'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                      No {activeTab} found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
