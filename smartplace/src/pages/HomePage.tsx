import './styles/HomePage.css'

export default function HomePage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="lp-root">
      {/* Navbar */}
      <header className="lp-header">
        <div className="lp-logo">
          <span className="lp-logo-text">SmartPlace</span>
        </div>
        <nav className="lp-nav-links">
          <a href="#features">Features</a>
          <a href="#workflow">Workflow</a>
          <a href="#about">About</a>
        </nav>
        <button className="lp-btn-outline" onClick={onEnter}>
          Sign In
        </button>
      </header>

      {/* Hero Section */}
      <main className="lp-hero">
        <div className="lp-hero-inner">
          <div className="lp-eyebrow">The Professional Standard</div>
          <h1 className="lp-heading">
            Campus Recruitment<br />
            <span className="lp-heading-sub">Reimagined.</span>
          </h1>
          <p className="lp-subtext">
            A high-performance placement ecosystem connecting elite talent with industry leaders through a unified, minimal interface.
          </p>
          <div className="lp-hero-actions">
            <button className="lp-btn-primary" onClick={onEnter}>
              Get Started
            </button>
            <button className="lp-btn-secondary" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              Learn More
            </button>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="lp-section">
        <div className="lp-section-header">
          <h2 className="lp-section-title">Core Capabilities</h2>
          <p className="lp-section-desc">Designed for every stakeholder in the placement lifecycle.</p>
        </div>
        <div className="lp-grid">
          <div className="lp-card">
            <div className="lp-card-icon">01</div>
            <h3 className="lp-card-title">Centralized Management</h3>
            <p className="lp-card-text">Administer the entire placement drive from a single command center with granular control.</p>
          </div>
          <div className="lp-card">
            <div className="lp-card-icon">02</div>
            <h3 className="lp-card-title">Real-time Analytics</h3>
            <p className="lp-card-text">Track application statuses, interview schedules, and selection rates as they happen.</p>
          </div>
          <div className="lp-card">
            <div className="lp-card-icon">03</div>
            <h3 className="lp-card-title">Unified Profiles</h3>
            <p className="lp-card-text">Comprehensive student portfolios featuring verified academic records and skill assessments.</p>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="lp-section lp-section-alt">
        <div className="lp-section-header">
          <h2 className="lp-section-title">System Workflow</h2>
        </div>
        <div className="lp-workflow-steps">
          <div className="lp-step">
            <div className="lp-step-number">I</div>
            <div className="lp-step-content">
              <h4>Institutional Onboarding</h4>
              <p>Setup departments, faculty coordinators, and batch details.</p>
            </div>
          </div>
          <div className="lp-step">
            <div className="lp-step-number">II</div>
            <div className="lp-step-content">
              <h4>Opportunity Posting</h4>
              <p>Companies list job profiles, eligibility criteria, and selection rounds.</p>
            </div>
          </div>
          <div className="lp-step">
            <div className="lp-step-number">III</div>
            <div className="lp-step-content">
              <h4>Automated Matching</h4>
              <p>System identifies and notifies eligible students based on set criteria.</p>
            </div>
          </div>
          <div className="lp-step">
            <div className="lp-step-number">IV</div>
            <div className="lp-step-content">
              <h4>Final Selection</h4>
              <p>Seamless management of interview results and offer letter distribution.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="lp-stats-strip">
        <div className="lp-stat-item">
          <span className="lp-stat-num">50k+</span>
          <span className="lp-stat-lab">Placements</span>
        </div>
        <div className="lp-stat-item">
          <span className="lp-stat-num">200+</span>
          <span className="lp-stat-lab">Partner Colleges</span>
        </div>
        <div className="lp-stat-item">
          <span className="lp-stat-num">1.2k</span>
          <span className="lp-stat-lab">Hiring Partners</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <div className="lp-footer-grid">
          <div className="lp-footer-brand">
            <h3 className="lp-logo-text">SmartPlace</h3>
            <p>Elevating campus recruitment for the modern age.</p>
          </div>
          <div className="lp-footer-links">
            <div className="lp-link-group">
              <h5>Platform</h5>
              <a href="#">Solutions</a>
              <a href="#">Features</a>
              <a href="#">Security</a>
            </div>
            <div className="lp-link-group">
              <h5>Company</h5>
              <a href="#">About</a>
              <a href="#">Contact</a>
              <a href="#">Privacy</a>
            </div>
          </div>
        </div>
        <div className="lp-footer-bottom">
          © {new Date().getFullYear()} SmartPlace. Defined by precision.
        </div>
      </footer>
    </div>
  )
}
