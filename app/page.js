'use client'
import { useState } from 'react'

export default function Home() {
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const sendSMS = async () => {
    setLoading(true)
    setStatus('Sending...')
    
    try {
      const res = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, message })
      })
      
      const data = await res.json()
      console.log('API Response:', data) // Browser console එකේ බලන්න
      
      if (data.success === true) {
        setStatus('✅ SMS Sent!')
        setPhone('')
        setMessage('')
      } else {
        setStatus(`❌ Error: ${data.error || 'Unknown error'}`)
      }
      
    } catch (error) {
      setStatus(`❌ Network Error: ${error.message}`)
      console.error(error)
    }
    
    setLoading(false)
  }

  return (
    <div style={{padding: '50px', maxWidth: '500px', margin: '0 auto', fontFamily: 'Arial'}}>
      <h1>CNSMS Sender</h1>
      
      <input
        type="text"
        placeholder="0771234567"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{width: '100%', padding: '10px', marginBottom: '10px', fontSize: '16px'}}
      />
      
      <textarea
        placeholder="Your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{width: '100%', padding: '10px', marginBottom: '10px', fontSize: '16px', minHeight: '100px'}}
      />
      
      <button 
        onClick={sendSMS} 
        disabled={loading}
        style={{
          width: '100%', 
          padding: '15px', 
          background: loading ? '#ccc' : '#0070f3', 
          color: 'white', 
          border: 'none', 
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Sending...' : 'Send SMS'}
      </button>
      
      {status && (
        <div style={{
          marginTop: '20px', 
          padding: '15px', 
          background: status.includes('✅') ? '#d4edda' : '#f8d7da',
          border: `1px solid ${status.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '5px',
          fontSize: '14px',
          wordBreak: 'break-word'
        }}>
          {status}
        </div>
      )}
    </div>
  )
}
