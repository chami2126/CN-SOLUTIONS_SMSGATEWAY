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

    const res = await fetch('https://api.text.lk/v1/sms/send', {
      method: 'POST',
      headers: {
        'apikey': process.env.TEXTLK_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: cleanNumber,
        message: message
      })
    });

    const data = await res.json();
    return Response.json(data);

  } catch (error) {
    console.error("SMS Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
