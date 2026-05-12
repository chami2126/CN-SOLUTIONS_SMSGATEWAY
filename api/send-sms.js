export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, password, number, message, action } = req.body;

  // Login Check
  if (username !== process.env.ADMIN_USER || password !== process.env.ADMIN_PASS) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (action === 'login') {
    return res.status(200).json({ success: true, message: 'Login successful' });
  }

  // Text.lk SMS API Call - Fixed Version
  if (action === 'sms') {
    if (!number || !message) {
      return res.status(400).json({ error: 'Phone number and message required' });
    }

    try {
      const textlkRes = await fetch('https://app.text.lk/api/v3/sms/send', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': process.env.DIALOG_TOKEN // Bearer නැතුව දාපන්
        },
        body: JSON.stringify({
          recipient: number,
          sender_id: 'TextLK',
          type: 'plain',
          message: message
        })
      });

      const data = await textlkRes.json();

      if (data.status === 'success' || data.status === 200) {
        return res.status(200).json({
          success: true,
          message: 'SMS sent successfully',
          data: data
        });
      } else {
        return res.status(400).json({ 
          error: data.message || 'Text.lk API error: ' + JSON.stringify(data)
        });
      }

    } catch (error) {
      return res.status(500).json({ 
        error: 'Failed to send SMS: ' + error.message 
      });
    }
  }

  return res.status(400).json({ error: 'Invalid action' });
}
