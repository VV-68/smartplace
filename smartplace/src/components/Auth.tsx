import { useState } from 'react';
import { supabase } from '../lib/supabase';
import '../styles/Auth.css';

type AuthProps = {
  onBack?: () => void;
};

export default function Auth({ onBack }: AuthProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Sign up the user
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          role: role // Store role in metadata too
        }
      }
    });
    
    if (error) {
      alert(error.message);
    } else if (data.user) {
      // Create a profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: data.user.id, role: role }]);
      
      if (profileError) {
        // If 'profiles' table doesn't exist or fails, just log it. 
        // Supabase might have triggers, or the table might be named 'users'.
        console.warn('Error creating profile entry:', profileError.message);
      }
      alert('Check your email for the confirmation link!');
    }
    setLoading(false);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <button
          type="button"
          className="auth-back"
          onClick={handleBack}
          aria-label="Back to home"
        >
          <span className="auth-back-icon" aria-hidden="true">←</span>
        </button>
        <h2 className="auth-title">Welcome to SmartPlace</h2>
      </div>
      
      <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            className="form-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">I am a...</label>
          <select 
            className="form-select"
            value={role} 
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty Member</option>
            <option value="admin">Admin / Placement Officer</option>
            <option value="alumni">Alumni</option>
            <option value="company">Company Recruiter</option>
          </select>
        </div>

        <div className="auth-actions">
          <button 
            type="button" 
            className="auth-btn auth-btn-primary" 
            onClick={handleLogin} 
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Login'}
          </button>
          <button 
            type="button" 
            className="auth-btn auth-btn-secondary" 
            onClick={handleSignUp} 
            disabled={loading}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}
