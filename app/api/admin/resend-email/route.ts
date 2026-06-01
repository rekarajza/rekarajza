import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function buildDownloadEmailHtml(firstName: string, productName: string, downloadUrls: { name: string; url: string }[]) {
  const fileLinks = downloadUrls.map(f =>
    `<a href="${f.url}" style="display:inline-block;color:#ffffff;background:#768E78;text-decoration:none;padding:10px 24px;border-radius:6px;font-size:14px;font-weight:bold;margin-bottom:8px;">⬇ ${f.name} letöltése</a>`
  ).join('<br/>');

  return `
    <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;color:#2C2C2C;">
      <div style="text-align:center;margin-bottom:32px;">
        <img src="https://rekarajza.hu/logo.png" alt="Réka rajza" style="height:100px;width:auto;" />
      </div>
      <p style="font-size:17px;font-weight:bold;margin:0 0 16px;">Köszönöm a vásárlást! 🌿</p>
      <p style="line-height:1.8;margin:0 0 8px;color:#333;">Kedves ${firstName},</p>
      <p style="line-height:1.8;margin:0 0 24px;color:#333;">Köszönöm, hogy vásárlásoddal támogatod a munkámat! Remélem, örömöd leled a rajzokban.</p>
      <p style="line-height:1.8;margin:0 0 16px;color:#333;">A <strong>${productName}</strong> letöltéséhez kattints az alábbi gombra:</p>
      <div style="margin-bottom:28px;">${fileLinks}</div>
      <p style="font-size:12px;color:#aaa;margin:0 0 32px;">A letöltési link 7 napig érvényes.</p>
      <p style="line-height:1.8;color:#333;margin:0;">Szeretettel,</p>
      <p style="color:#768E78;font-weight:bold;margin:4px 0 0;">Réka</p>
    </div>
  `;
}

export async function POST(req: NextRequest) {
  const { email, productName, customerName, orderId } = await req.json();
  const rawName = (customerName as string | undefined)?.trim() ?? '';
  const firstName = rawName.length > 0 ? rawName.split(' ').pop()! : 'Vásárló';

  const { data: products } = await supabase
    .from('products')
    .select('name, file_url')
    .ilike('name', `%${productName}%`);

  if (!products || products.length === 0) {
    return NextResponse.json({ error: 'Termék nem található' }, { status: 404 });
  }

  const downloadUrls: { name: string; url: string }[] = [];

  for (const product of products) {
    if (product.file_url) {
      const { data: signedUrl } = await supabase.storage
        .from('product-files')
        .createSignedUrl(product.file_url, 60 * 60 * 24 * 7);
      if (signedUrl?.signedUrl) {
        downloadUrls.push({ name: product.name, url: signedUrl.signedUrl });
      }
    }
  }

  if (downloadUrls.length === 0) {
    return NextResponse.json({ error: 'Nincs letölthető fájl' }, { status: 404 });
  }

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Réka rajza', email: 'rekarajza@gmail.com' },
      to: [{ email }],
      subject: `A letöltésed itt van – ${productName}`,
      htmlContent: buildDownloadEmailHtml(firstName, productName, downloadUrls),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: 500 });
  }

  if (orderId) {
    await supabase.from('orders').update({ email_sent: true }).eq('id', orderId);
  }

  return NextResponse.json({ ok: true });
}
