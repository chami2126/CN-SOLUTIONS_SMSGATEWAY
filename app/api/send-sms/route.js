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
      return NextResponse.json({ error: "Phone and message required" }, { status: 400 });
    }

    // TextLK v3 API - OAuth 2.0
    const res = await fetch('https://app.text.lk/api/v3/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.TEXTLK_TOKEN}` // TEXTLK_TOKEN තමයි හරි
      },
      body: JSON.stringify({
        recipient: cleanNumber,
        sender_id: 'TextLKDemo', // Active Sender ID
        message: message
      })
    });

    const data = await res.json();

    if (data.status === 'success') {
      return NextResponse.json({ success: true, message: 'SMS Sent!', data });
    } else {
      return NextResponse.json({ success: false, error: data.message || JSON.stringify(data) }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 hereafter 
