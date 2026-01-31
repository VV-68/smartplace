import { useEffect, useState } from 'react'

function App() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    // We use localhost:3000 because your BROWSER is making the call
    fetch('http://localhost:3000/')
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(err => setMessage('Error connecting to backend'))
  }, [])

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>SmartPlace Project</h1>
      <h2>Shan Romio-Contributor<h2>
      <div className="card">
        <p>Status from Backend:</p>
        <code style={{ background: '#333', padding: '10px', borderRadius: '5px' }}>
          {message}
        </code>
      </div>
    </div>
  )
}

export default App
