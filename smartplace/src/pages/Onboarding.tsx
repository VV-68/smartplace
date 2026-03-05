import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

interface OnboardingProps {
  user: any;
  role: string;
  accessToken: string;
  onComplete: () => void;
}

interface Advisor {
  user_id: string;
  fname: string;
  lname: string;
  department: string;
}

export default function Onboarding({ user, role, accessToken, onComplete }: OnboardingProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);

  // Student Form State
  const [studentForm, setStudentForm] = useState({
    department: '',
    graduation_year: '',
    cgpa: '',
    advisor_id: ''
  });

  // Company Form State
  const [companyForm, setCompanyForm] = useState({
    company_name: '',
    website: '',
    industry: '',
    description: '',
    contact_person: ''
  });

  const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/${role}`,
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  useEffect(() => {
    if (role === 'student') {
      const fetchAdvisors = async () => {
        try {
          const res = await api.get('/advisors');
          setAdvisors(res.data);
        } catch (err) {
          console.error("Failed to fetch advisors");
        }
      };
      fetchAdvisors();
    }
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = role === 'student' ? studentForm : companyForm;
      await api.put('/profile', data);
      onComplete();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'var(--bg-primary)', zIndex: 9999,
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      padding: '2rem'
    }}>
      <div className="content-card" style={{ maxWidth: '600px', width: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome to SmartPlace!</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Let's get your {role} profile set up to get started.
          </p>
        </header>

        {error && <div className="error-banner" style={{ marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="onboarding-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {role === 'student' ? (
            <>
              <div className="form-group">
                <label>Department</label>
                <input 
                  type="text" className="form-input" required placeholder="e.g. Computer Science"
                  value={studentForm.department}
                  onChange={e => setStudentForm({...studentForm, department: e.target.value})}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group flex-1">
                  <label>Graduation Year</label>
                  <input 
                    type="number" className="form-input" required placeholder="2026"
                    value={studentForm.graduation_year}
                    onChange={e => setStudentForm({...studentForm, graduation_year: e.target.value})}
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Current CGPA</label>
                  <input 
                    type="number" step="0.01" min="0" max="10" className="form-input" required placeholder="9.2"
                    value={studentForm.cgpa}
                    onChange={e => setStudentForm({...studentForm, cgpa: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Select Staff Advisor</label>
                <select 
                  className="form-input" required
                  value={studentForm.advisor_id}
                  onChange={e => setStudentForm({...studentForm, advisor_id: e.target.value})}
                >
                  <option value="">-- Choose your advisor --</option>
                  {advisors.map(adv => (
                    <option key={adv.user_id} value={adv.user_id}>
                      {adv.fname} {adv.lname} ({adv.department})
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Company Name</label>
                <input 
                  type="text" className="form-input" required placeholder="e.g. TechCorp Solutions"
                  value={companyForm.company_name}
                  onChange={e => setCompanyForm({...companyForm, company_name: e.target.value})}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group flex-1">
                  <label>Industry</label>
                  <input 
                    type="text" className="form-input" required placeholder="Software / Finance"
                    value={companyForm.industry}
                    onChange={e => setCompanyForm({...companyForm, industry: e.target.value})}
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Website</label>
                  <input 
                    type="url" className="form-input" placeholder="https://example.com"
                    value={companyForm.website}
                    onChange={e => setCompanyForm({...companyForm, website: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Contact Person</label>
                <input 
                  type="text" className="form-input" required placeholder="Name of HR / Recruiter"
                  value={companyForm.contact_person}
                  onChange={e => setCompanyForm({...companyForm, contact_person: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Company Description</label>
                <textarea 
                  className="form-input" style={{ height: '80px' }} placeholder="Tell us about your company..."
                  value={companyForm.description}
                  onChange={e => setCompanyForm({...companyForm, description: e.target.value})}
                />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} disabled={loading}>
            {loading ? 'Saving Profile...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}
