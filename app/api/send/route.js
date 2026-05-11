export async function POST(request) {
  const { phone, message } = await request.json();
  
  // Fix 1: Number එක 94 format එකට හදනවා
  let cleanNumber = phone.replace(/\s|-/g, ''); 
  if (cleanNumber.startsWith('0')) {
    cleanNumber = '94' + cleanNumber.substring(1);
  }

  // Fix 2: Sender ID අයින් කරනවා
  const res = await fetch('https://api.text.lk/v1/sms/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.TEXTLK_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      to: cleanNumber, // 94742952930 වෙනවා
      message: message
      // sender_id: "CN-SOLUTIONS" <- මේ Line එක Delete කරපන්
    })
  });

  const data = await res.json();
  return Response.json(data);
}
