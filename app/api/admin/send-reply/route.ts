import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { to, toName, subject, message } = await req.json();

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Réka rajza', email: 'rekarajza@gmail.com' },
      to: [{ email: to, name: toName }],
      subject,
      htmlContent: `<div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:600px;margin:0 auto;padding:40px 32px;color:#2C2C2C;">
        ${message.replace(/\n/g, '<br/>')}
        <br/><br/>
        <p style="color:#768E78;font-weight:bold;">Réka</p>
        <p style="color:#aaa;font-size:12px;"><a href="https://rekarajza.hu" style="color:#aaa;text-decoration:none;">rekarajza.hu</a></p>
      </div>`,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
