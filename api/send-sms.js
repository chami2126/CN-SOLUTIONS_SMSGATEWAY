export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get data from request
  const { username, password, number, message, action } = req.body;

  // 1. Login Check
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  if (username !== process.env.ADMIN_USER || password !== process.env.ADMIN_PASS) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // 2. Login Action - Login විතරක් නම් මෙතනින් නවත්තනවා
  if (action === 'login') {
    return res.status(200).json({ 
      success: true, 
      message: 'Login successful' 
    });
  }

  // 3. SMS Action - SMS යවන්න
  if (action === 'sms') {
    if (!number || !message) {
      return res.status(400).json({ error: 'Phone number and message required' });
    }

    // Dialog E-SMS API Call
    try {
      const dialogResponse = await fetch('https://e-sms.dialog.lk/api/v1/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DIALOG_TOKEN}`
        },
        body: JSON.stringify({
          msisdn: number,
          message: message
        })
      });

      const data = await dialogResponse.json();

      // Dialog API Error Check
      if (!dialogResponse.ok) {
        return res.status(dialogResponse.status).json({ 
          error: data.message || 'Dialog API error' 
        });
      }

      return res.status(200).json({
        success: true,
        message: 'SMS sent successfully',
        data: data
      });

    } catch (error) {
      return res.status(500).json({ 
        error: 'Failed to send SMS: ' + error.message 
      });
    }
  }

  // 4. Invalid Action
  return res.status(400).json({ error: 'Invalid action' });
}
