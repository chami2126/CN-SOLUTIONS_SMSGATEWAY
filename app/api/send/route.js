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

    const res = await fetch('https://app.text.lk/api/http/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        api_key: process.env.TEXTLK_API_KEY, // ← api_token නෙමෙයි, api_key
        recipient: cleanNumber,
        sender_id: 'TextLK', // දැන් Approved Sender ID එකක් ඕන. TextLK Try කරමු
        message: message
      })
    });

    const data = await res.json();
    
    if (data.status === 'success' || data.status_code === 200) {
      return Response.json({ success: true, data });
    } else {
      return Response.json({ error: `TextLK: ${JSON.stringify(data)}` }, { status: 400 });
    }

  } catch (error) {
    return Response.json({ error: `Server: ${error.message}` }, { status: 500 });
  }
}
