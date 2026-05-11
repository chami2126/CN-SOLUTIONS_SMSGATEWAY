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

    // TextLK v3 HTTP API - හරිම Format එක
    const res = await fetch('https://app.text.lk/api/http/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        api_token: process.env.TEXTLK_API_KEY,  // Bearer නෙමෙයි, Body එකේ
        recipient: cleanNumber,
        sender_id: 'TextLK',
        message: message
      })
    });

    const data = await res.json();
    
    if (data.status === 'success' || data.status === 'queued') {
      return Response.json({ success: true, data });
    } else {
      return Response.json({ error: data.message || 'Failed' }, { status: 400 });
    }

  } catch (error) {
    console.error("SMS Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
