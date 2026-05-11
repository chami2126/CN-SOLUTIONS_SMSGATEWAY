import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, message } = body;

    let cleanNumber = phone?.replace(/\\s|-/g, '') || '';
    if (cleanNumber.startsWith('0')) {
      cleanNumber = '94' + cleanNumber.substring(1);
    }

    if (!cleanNumber || !message) {
      return NextResponse.json(
        { success: false, error: "Phone and message required" }, 
        { status: 400 }
      );
    }

    // හරි URL එක v3 තමයි
    const res = await fetch('https://app.text.lk/api/v3/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.TEXTLK_TOKEN}`
      },
      body: JSON.stringify({
        recipient: cleanNumber,
        sender_id: 'CNSMS', // TextLKDemo නෙමෙයි, CNSMS
        message: message
      })
    });

    const data = await res.json();
    
    if (res.ok && data.status === 'success') {
      return NextResponse.json({ 
        success: true, 
        message: 'SMS Sent!', 
        data: data 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: data.message || 'TextLK API Error',
        full_response: data 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Function Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
