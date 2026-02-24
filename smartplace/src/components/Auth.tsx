import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    setLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Sign up the user
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          role: role // Store role in metadata too (optional but handy)
        }
      }
    })
    
    if (error) {
      alert(error.message)
    } else if (data.user) {
      // Create a profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: data.user.id, role: role }])
      
      if (profileError) {
        console.error('Error creating profile:', profileError.message)
      }
      alert('Check your email for the confirmation link!')
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Login or Sign Up</h2>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '0.5rem' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '0.5rem' }}
        />
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="role">Select Role (for Sign Up):</label>
          <select 
            id="role" 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            style={{ padding: '0.5rem' }}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="placement_officer">Placement Officer</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button type="button" onClick={handleLogin} disabled={loading} style={{ flex: 1, padding: '0.5rem' }}>
            {loading ? 'Processing...' : 'Login'}
          </button>
          <button type="button" onClick={handleSignUp} disabled={loading} style={{ flex: 1, padding: '0.5rem' }}>
            Sign Up
          </button>
        </div>
      </form>
    </div>
  )
}
