'use client'
import { useState } from 'react'

export default function Home() {
  const [to, setTo] = useState('')
  const [msg, setMsg] = useState('')
  const [res, setRes] = useState('')
  const [load, setLoad] = useState(false)

  const send = async () => {
    setLoad(true)
    const r = await fetch('/api/send', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ to, message: msg })
    })
    const d = await r.json()
    setRes(d.success? '✅ SMS Sent!' : '❌ Failed: Check API Key')
    setLoad(false)
  }

  return (
    <div style={{padding:20,maxWidth:400,margin:'0 auto',fontFamily:'sans-serif'}}>
      <h1>CN-SOLUTIONS SMS</h1>
      <p>Balance: Rs.500 = 833 SMS</p>
      <input placeholder="0771234567" value={to} onChange={e=>setTo(e.target.value)} style={{width:'100%',padding:12,margin:'8px 0',background:'#222',color:'#fff',border:'1px solid #444',borderRadius:4}}/>
      <textarea placeholder="Message" value={msg} onChange={e=>setMsg(e.target.value)} style={{width:'100%',padding:12,margin:'8px 0',background:'#222',color:'#fff',border:'1px solid #444',borderRadius:4}}/>
      <button onClick={send} disabled={load} style={{width:'100%',padding:12,background:'#0066ff',color:'#fff',border:0,borderRadius:4,fontWeight:'bold'}}>{load? 'Sending...' : 'Send SMS Rs.0.60'}</button>
      <p style={{textAlign:'center',marginTop:10}}>{res}</p>
    </div>
  )
}
