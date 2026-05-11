import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

export const handler = async (event) => {
  const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS' }
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' }
  
  try {
    const path = event.path.replace('/.netlify/functions/api', '')
    
    if (path === '/login' && event.httpMethod === 'POST') {
      const { username, password } = JSON.parse(event.body)
      if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
        return { statusCode: 200, headers, body: JSON.stringify({ success: true }) }
      }
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'Invalid credentials' }) }
    }
    
    if (path === '/numbers' && event.httpMethod === 'GET') {
      const { data, error } = await supabase.from('allowed_numbers').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return { statusCode: 200, headers, body: JSON.stringify(data) }
    }
    
    if (path === '/numbers' && event.httpMethod === 'POST') {
      const { phone_number, sender_id } = JSON.parse(event.body)
      const { data, error } = await supabase.from('allowed_numbers').insert([{ phone_number, sender_id }]).select()
      if (error) throw error
      return { statusCode: 200, headers, body: JSON.stringify(data[0]) }
    }
    
    if (path === '/numbers' && event.httpMethod === 'DELETE') {
      const { id } = JSON.parse(event.body)
      const { error } = await supabase.from('allowed_numbers').delete().eq('id', id)
      if (error) throw error
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) }
    }
    
    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) }
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) }
