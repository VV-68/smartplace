import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import './HomePage.css'

interface HomePageProps {
  user: any
}

interface StatCard {
  label: string
  value: string
  icon: string
  color: string
}

export default function HomePage({ user }: HomePageProps) {
  const [message, setMessage] = useState('Loading...')
  const [result, setResult] = useState('Loading...')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeNav, setActiveNav] = useState('dashboard')
  const [statusOk, setStatusOk] = useState<boolean | null>(null)

  const stats: StatCard[] = [
    { label: 'Registered Students', value: '1,248', icon: '🎓', color: 'blue' },
    { label: 'Active Job Postings', value: '34', icon: '💼', color: 'green' },
    { label: 'Offers This Year', value: '512', icon: '🏆', color: 'orange' },
    { label: 'Companies On-Board', value: '87', icon: '🏢', color: 'purple' },
  ]

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
    { id: 'students', label: 'Students', icon: '🎓' },
    { id: 'companies', label: 'Companies', icon: '🏢' },
    { id: 'jobs', label: 'Job Postings', icon: '💼' },
    { id: 'drives', label: 'Placement Drives', icon: '📅' },
    { id: 'offers', label: 'Offer Letters', icon: '📄' },
    { id: 'reports', label: 'Reports', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙' },
  ]

  const recentActivity = [
    { event: 'Google LLC submitted JD for SWE 2025', time: '10 min ago', type: 'info' },
    { event: 'Riya Sharma accepted offer from Infosys', time: '1 hr ago', type: 'success' },
    { event: 'Placement drive for TCS scheduled on Mar 4', time: '3 hr ago', type: 'warning' },
    { event: 'New student batch (2025) registered', time: '1 day ago', type: 'info' },
    { event: 'Amazon offer letter uploaded for 12 students', time: '2 days ago', type: 'success' },
  ]

  useEffect(() => {
    fetch('http://localhost:3000/')
      .then(res => res.text())
      .then(data => { setMessage(data); setStatusOk(true) })
      .catch(() => { setMessage('Error connecting to backend'); setStatusOk(false) })

    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        fetch('http://localhost:3000/db', {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        })
          .then(res => {
            if (res.status === 401) throw new Error('Unauthorized')
            return res.json()
          })
          .then(data => setResult(JSON.stringify(data, null, 2)))
          .catch(err => setResult('Error: ' + err.message))
      }
    }
    fetchData()
  }, [user])

  const handleLogout = () => supabase.auth.signOut()

  const userInitials = user?.email
    ? user.email.split('@')[0].slice(0, 2).toUpperCase()
    : 'U'

  return (
    <div className="sp-root">
      {/* ── Top Navbar ── */}
      <header className="sp-navbar">
        <div className="sp-navbar-left">
          <button
            className="sp-sidebar-toggle"
            onClick={() => setSidebarOpen(o => !o)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <div className="sp-brand">
            <span className="sp-brand-icon">🎯</span>
            <span className="sp-brand-name">SmartPlace</span>
          </div>
          <div className="sp-breadcrumb">
            <span className="sp-breadcrumb-sep">/</span>
            <span className="sp-breadcrumb-current">Dashboard</span>
          </div>
        </div>

        <div className="sp-navbar-right">
          <button className="sp-icon-btn" title="Search">🔍</button>
          <button className="sp-icon-btn" title="Notifications">
            🔔
            <span className="sp-badge">3</span>
          </button>
          <div className="sp-avatar-wrap">
            <div className="sp-avatar">{userInitials}</div>
            <div className="sp-user-info">
              <span className="sp-user-email">{user.email}</span>
              <span className="sp-user-role">Placement Officer</span>
            </div>
          </div>
          <button className="sp-btn sp-btn-ghost sp-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="sp-layout">
        {/* ── Sidebar ── */}
        <aside className={`sp-sidebar ${sidebarOpen ? 'sp-sidebar--open' : 'sp-sidebar--closed'}`}>
          <nav className="sp-nav">
            {navItems.map(item => (
              <button
                key={item.id}
                className={`sp-nav-item ${activeNav === item.id ? 'sp-nav-item--active' : ''}`}
                onClick={() => setActiveNav(item.id)}
              >
                <span className="sp-nav-icon">{item.icon}</span>
                {sidebarOpen && <span className="sp-nav-label">{item.label}</span>}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── Main Content ── */}
        <main className="sp-main">
          {/* Page Header */}
          <div className="sp-page-header">
            <div>
              <h1 className="sp-page-title">Dashboard</h1>
              <p className="sp-page-subtitle">Placement Cell — Academic Year 2024–25</p>
            </div>
            <div className="sp-page-actions">
              <button className="sp-btn sp-btn-secondary">Export Report</button>
              <button className="sp-btn sp-btn-primary">+ New Drive</button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="sp-stat-grid">
            {stats.map((s, i) => (
              <div key={i} className={`sp-stat-card sp-stat-card--${s.color}`}>
                <div className="sp-stat-icon">{s.icon}</div>
                <div className="sp-stat-body">
                  <div className="sp-stat-value">{s.value}</div>
                  <div className="sp-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Two-column row */}
          <div className="sp-grid-2">
            {/* System Status Card */}
            <div className="sp-card">
              <div className="sp-card-header">
                <h3 className="sp-card-title">System Status</h3>
                <span className={`sp-status-dot ${statusOk === true ? 'sp-status-dot--green' : statusOk === false ? 'sp-status-dot--red' : 'sp-status-dot--yellow'}`} />
              </div>
              <div className="sp-card-body">
                <div className="sp-status-row">
                  <span className="sp-status-label">API Server</span>
                  <span className={`sp-tag ${statusOk ? 'sp-tag--success' : 'sp-tag--danger'}`}>
                    {statusOk ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div className="sp-status-row">
                  <span className="sp-status-label">Database</span>
                  <span className="sp-tag sp-tag--success">Connected</span>
                </div>
                <div className="sp-status-row">
                  <span className="sp-status-label">Auth Service</span>
                  <span className="sp-tag sp-tag--success">Active</span>
                </div>
                <div className="sp-code-block">{message}</div>
              </div>
            </div>

            {/* Recent Activity Card */}
            <div className="sp-card">
              <div className="sp-card-header">
                <h3 className="sp-card-title">Recent Activity</h3>
                <button className="sp-link-btn">View All</button>
              </div>
              <div className="sp-card-body sp-no-pad">
                <ul className="sp-activity-list">
                  {recentActivity.map((a, i) => (
                    <li key={i} className="sp-activity-item">
                      <span className={`sp-activity-dot sp-activity-dot--${a.type}`} />
                      <div className="sp-activity-content">
                        <span className="sp-activity-event">{a.event}</span>
                        <span className="sp-activity-time">{a.time}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Database Records */}
          <div className="sp-card">
            <div className="sp-card-header">
              <h3 className="sp-card-title">Database Records <span className="sp-tag sp-tag--info">Protected</span></h3>
              <button className="sp-link-btn">Refresh</button>
            </div>
            <div className="sp-card-body">
              <pre className="sp-pre">{result}</pre>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
