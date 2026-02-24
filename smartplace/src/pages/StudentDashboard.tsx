import { supabase } from '../lib/supabase'

export default function StudentDashboard({ user }: { user: any }) {
  const handleLogout = () => supabase.auth.signOut()

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Student Dashboard</h1>
      <p>Welcome, {user.email} (Student)</p>
      <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
        <h3>Your Applications</h3>
        <ul>
          <li>Google - Pending</li>
          <li>Microsoft - Rejected</li>
          <li>TCS - Selected</li>
        </ul>
      </div>
      <button onClick={handleLogout} style={{ marginTop: '2rem' }}>Logout</button>
    </div>
  )
}
