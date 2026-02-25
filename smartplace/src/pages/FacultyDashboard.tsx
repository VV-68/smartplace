import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import '../styles/Dashboard.css';

export default function FacultyDashboard({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState('classes');

  const sidebarItems = [
    { id: 'classes', label: 'My Classes' },
    { id: 'students', label: 'Student Progress' },
    { id: 'reports', label: 'Reports' },
  ];

  const classes = [
    { id: 'cs101', name: 'Intro to CS', students: 50, schedule: 'Mon/Wed 10:00 AM' },
    { id: 'cs202', name: 'Data Structures', students: 45, schedule: 'Tue/Thu 2:00 PM' },
    { id: 'cs305', name: 'Algorithms', students: 30, schedule: 'Fri 10:00 AM' },
  ];

  return (
    <DashboardLayout
      user={user}
      sidebarItems={sidebarItems}
      activeItem={activeTab}
      onSidebarChange={setActiveTab}
      title="Faculty Portal"
    >
      <header className="page-header">
        <h1 className="page-title">Faculty Dashboard</h1>
        <p className="page-subtitle">Manage your classes and students</p>
      </header>

      {activeTab === 'classes' && (
        <section className="content-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Class Name</th>
                  <th>Students Enrolled</th>
                  <th>Schedule</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {classes.map(cls => (
                  <tr key={cls.id}>
                    <td>
                      <div className="user-details">
                        <span className="user-email-text">{cls.name}</span>
                        <span className="user-id-text">Code: {cls.id.toUpperCase()}</span>
                      </div>
                    </td>
                    <td>{cls.students}</td>
                    <td>{cls.schedule}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-secondary">View Students</button>
                        <button className="btn btn-secondary">Attendance</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab !== 'classes' && (
        <section className="content-card">
          <p className="loading-text">Module under development.</p>
        </section>
      )}
    </DashboardLayout>
  );
}
