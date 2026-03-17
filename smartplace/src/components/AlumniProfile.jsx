import React, { useState } from 'react';
import axios from 'axios';

export default function AlumniProfile({ user, profile, accessToken, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: profile?.company || '',
    graduation_year: profile?.graduation_year || new Date().getFullYear() - 1
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/alumni/profile`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Alumni Profile</h2>
      
      {message.text && (
        <div style={{
          padding: '1rem',
          marginBottom: '1.5rem',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: message.type === 'success' ? 'var(--success-color)' : 'var(--danger-color)',
          border: `1px solid ${message.type === 'success' ? 'var(--success-color)' : 'var(--danger-color)'}`
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Full Name</label>
          <input 
            type="text" 
            defaultValue={user?.user_metadata?.full_name || ''} 
            disabled
            style={{
              padding: '0.75rem',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)',
              cursor: 'not-allowed'
            }}
          />
        </div>
        
        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email</label>
          <input 
            type="email" 
            defaultValue={user?.email || ''} 
            disabled
            style={{
              padding: '0.75rem',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)',
              cursor: 'not-allowed'
            }}
          />
        </div>

        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Current Company</label>
          <input 
            type="text" 
            required
            value={formData.company} 
            onChange={e => setFormData({...formData, company: e.target.value})}
            style={{
              padding: '0.75rem',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)'
            }}
          />
        </div>

        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Graduation Year</label>
          <input 
            type="number" 
            required
            value={formData.graduation_year} 
            onChange={e => setFormData({...formData, graduation_year: e.target.value})}
            style={{
              padding: '0.75rem',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)'
            }}
          />
        </div>

        <button 
          className="btn btn-primary" 
          type="submit" 
          disabled={loading}
          style={{ marginTop: '1rem', padding: '0.75rem' }}
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
