import axios from 'axios'
export async function POST(req) {
  const { to, message } = await req.json()
  try {
    await axios.post('https://api.text.lk/v1/sms/send', {
      recipient: to, sender_id: 'CNSMS', message
    }, {
      headers: { Authorization: `Bearer ${process.env.TEXTLK_API_KEY}` }
    })
    return Response.json({ success: true })
  } catch (e) {
    return Response.json({ success: false })
  }
}
