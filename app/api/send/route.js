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

    // TextLK HTTP API - හරිම හරිම Format එක
    const url = `https://app.text.lk/api/http/sms/send?token=${process.env.TEXTLK_API_KEY}&to=${cleanNumber}&message=${encodeURIComponent(message)}`;
    
    const res = await fetch(url, {
      method: 'GET'  // HTTP API එක GET Method එකක්!
    });

    const data = await res.json();
    
    if (data.status === 'success' || data.status_code === 200) {
      return Response.json({ success: true, data });
    } else {
      return Response.json({ error: data.message || 'Failed' }, { status: 400 });
    }

  } catch (error) {
    console.error("SMS Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
