import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { nev, email, uzenet } = await req.json();

  if (!nev || !email || !uzenet) {
    return NextResponse.json({ error: 'Minden mező kitöltése kötelező.' }, { status: 400 });
  }

  // Save to Supabase
  const { error: dbError } = await supabase
    .from('contact_messages')
    .insert({ nev, email, uzenet });

  if (dbError) {
    console.error('Supabase error:', dbError);
    return NextResponse.json({ error: 'Adatbázis hiba.' }, { status: 500 });
  }

  // Send email via Brevo
  const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY!,
    },
    body: JSON.stringify({
      sender: { name: 'Réka rajza weboldal', email: 'rekarajza@gmail.com' },
      to: [{ email: 'rekarajza@gmail.com', name: 'Réka' }],
      subject: `Új üzenet a weboldalról – ${nev}`,
      htmlContent: `
        <h2>Új kapcsolatfelvétel</h2>
        <p><strong>Név:</strong> ${nev}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Üzenet:</strong></p>
        <p>${uzenet.replace(/\n/g, '<br/>')}</p>
      `,
    }),
  });

  if (!brevoRes.ok) {
    const err = await brevoRes.text();
    console.error('Brevo error:', err);
    // Still return success — message was saved to DB
  }

  return NextResponse.json({ success: true });
}
