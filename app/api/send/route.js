export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, message } = body;

    let cleanNumber = phone?.replace(/\s|-/g, '') || ''; 
    if (cleanNumber.startsWith('0')) {
      cleanNumber = '94' + cleanNumber.substring(1);
    }

    if (!cleanNumber || !message) {
      return Response.json({ error: "Phone and message required" }, { status: 400 });
    }

    // TextLK HTTP API - Sender ID Fix
    const res = await fetch('https://app.text.lk/api/http/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        api_token: process.env.TEXTLK_API_KEY,
        recipient: cleanNumber,
        sender_id: '94742952930', // ← මේක තමයි වෙනස. උඹේ Number එක
        message: message
      })
    });

    const data = await res.json();
    
    if (data.status === 'success' || data.status_code === 200) {
      return Response.json({ success: true, data });
    } else {
      return Response.json({ error: `TextLK Response: ${JSON.stringify(data)}` }, { status: 400 });
    }

  } catch (error) {
    console.error("SMS Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
