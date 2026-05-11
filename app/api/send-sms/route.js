import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, message } = body;

    // 1. Phone number clean කරනවා
    let cleanNumber = phone?.replace(/\\s|-/g, '') || '';
    if (cleanNumber.startsWith('0')) {
      cleanNumber = '94' + cleanNumber.substring(1);
    }

    // 2. Validation
    if (!cleanNumber || !message) {
      return NextResponse.json(
        { success: false, error: "Phone and message required" }, 
        { status: 400 }
      );
    }

    // 3. TextLK API එකට Call කරනවා - v1 Endpoint
    const res = await fetch('https://app.text.lk/api/v1/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.TEXTLK_TOKEN}`
      },
      body: JSON.stringify({
        recipient: cleanNumber,
        sender_id: 'CNSMS', // TextLKDemo වෙනුවට CNSMS
        message: message
      })
    });

    const data = await res.json();
    
    // 4. TextLK Response එක Check කරනවා
    if (res.ok && data.status === 'success') {
      return NextResponse.json({ 
        success: true, 
        message: 'SMS Sent!', 
        data: data 
      });
    } else {
      // TextLK එකෙන් Error එකක් ආවොත්
      return NextResponse.json({ 
        success: false, 
        error: data.message || 'TextLK API Error',
        full_response: data 
      }, { status: 400 });
    }

  } catch (error) {
    // Code එකේම Error එකක් ආවොත්
    console.error('Function Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
