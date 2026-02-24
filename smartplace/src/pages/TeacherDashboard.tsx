import { supabase } from '../lib/supabase'

export default function TeacherDashboard({ user }: { user: any }) {
  const handleLogout = () => supabase.auth.signOut()

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Teacher/Coordinator Dashboard</h1>
      <p>Welcome, {user.email} (Teacher)</p>
      <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
        <h3>Manage Classes</h3>
        <ul>
          <li>CS101 - 50 Students</li>
          <li>CS202 - 45 Students</li>
        </ul>
      </div>
      <button onClick={handleLogout} style={{ marginTop: '2rem' }}>Logout</button>
    </div>
  )
}
