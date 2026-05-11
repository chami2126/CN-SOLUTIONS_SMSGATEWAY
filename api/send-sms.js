export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, password, number, message } = req.body;

  if (username !== process.env.ADMIN_USER || password !== process.env.ADMIN_PASS) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  try {
    const dialogRes = await fetch('https://e-sms.dialog.lk/api/v1/sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DIALOG_TOKEN}`
      },
      body: JSON.stringify({ msisdn: number, message })
    });
    const data = await dialogRes.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'SMS failed' });
  }
}
