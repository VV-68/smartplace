import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import HomePage from './pages/HomePage'
import StudentDashboard from './pages/StudentDashboard'
import FacultyDashboard from './pages/FacultyDashboard'
import AdminDashboard from './pages/AdminDashboard.tsx'
import AlumniDashboard from './pages/AlumniDashboard.tsx'

function App() {
  const [session, setSession] = useState<any>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const[showAuth, setShowAuth] = useState(false);


  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        fetchRole(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        fetchRole(session.user.id)
      } else {
        setRole(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchRole = async (userId: string) => {
    try {
      // We assume there's a 'profiles' table with a 'role' column
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.warn('Error fetching role, defaulting to student:', error.message)
        setRole('student') // Default fallback
      } else {
        setRole(data?.role || 'student')
      }
    } catch (err) {
      console.error('Role fetch failed:', err)
      setRole('student')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '5rem' }}>Loading application...</div>
  }

  if (!session) {
    if (showAuth) return <Auth onBack={() => setShowAuth(false)} />
    return <HomePage onEnter={() => setShowAuth(true)} />
  }

  const renderPage = () => {
    // Role-based routing
    switch (role) {
      case 'student':
        return <StudentDashboard user={session.user} />
      case 'faculty':
        return <FacultyDashboard user={session.user} />
      case 'alumni':
        return <AlumniDashboard user={session.user} />
      case 'admin':
        return <AdminDashboard user={session.user} />
      default:
        return <StudentDashboard user={session.user} />
    }
  }

  return (
    <div>
      {renderPage()}
    </div>
  )

}

export default App
