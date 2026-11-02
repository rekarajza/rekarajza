import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);

  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, billing_name, email, product_name, amount, created_at')
    .eq('invoice_sent', false)
    .gte('created_at', fourDaysAgo.toISOString())
    .lte('created_at', threeDaysAgo.toISOString());

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!orders || orders.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  const orderRows = orders.map(o => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">${new Date(o.created_at).toLocaleDateString('hu-HU')}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">${o.billing_name || '—'}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">${o.product_name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">${(o.amount / 100).toLocaleString('hu-HU')} Ft</td>
    </tr>
  `).join('');

  const htmlContent = `
    <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:600px;margin:0 auto;padding:40px 32px;color:#2C2C2C;">
      <div style="text-align:center;margin-bottom:32px;">
        <img src="https://rekarajza.hu/logo.png" alt="Réka rajza" style="height:80px;width:auto;" />
      </div>
      <p style="font-size:17px;font-weight:bold;margin:0 0 16px;">⚠️ Számla emlékeztető</p>
      <p style="line-height:1.8;margin:0 0 16px;color:#333;">
        Az alábbi rendeléseknél még nem lett bejelölve a <strong>„Számla kiküldve"</strong> jelölőnégyzet,
        és már több mint 3 napja megtörtént a vásárlás:
      </p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px;">
        <thead>
          <tr style="background:#f0f4f0;">
            <th style="padding:8px 12px;text-align:left;">Dátum</th>
            <th style="padding:8px 12px;text-align:left;">Vásárló</th>
            <th style="padding:8px 12px;text-align:left;">Termék</th>
            <th style="padding:8px 12px;text-align:left;">Összeg</th>
          </tr>
        </thead>
        <tbody>${orderRows}</tbody>
      </table>
      <p style="margin:0 0 24px;">
        <a href="https://rekarajza.hu/admin/rendelesek" style="display:inline-block;color:#ffffff;background:#768E78;text-decoration:none;padding:10px 24px;border-radius:6px;font-size:14px;font-weight:bold;">
          → Megnyitom a rendeléseket
        </a>
      </p>
      <p style="color:#999;font-size:12px;margin:0;">Ez egy automatikus értesítő a rekarajza.hu admin rendszerétől.</p>
    </div>
  `;

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Réka rajza Admin', email: 'rekarajza@gmail.com' },
      to: [{ email: 'rekarajza@gmail.com' }],
      subject: `⚠️ ${orders.length} rendelésnél hiányzik a számla kiküldve jelölés`,
      htmlContent,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: 500 });
  }

  return NextResponse.json({ ok: true, sent: orders.length });
}
