import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { email, productName } = await req.json();

  // Termék keresése név alapján
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

  const fileLinks = downloadUrls.map(f =>
    `<p style="margin: 8px 0;"><a href="${f.url}" style="color: #768E78; font-weight: bold;">${f.name} – Letöltés</a></p>`
  ).join('');

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
      htmlContent: `
        <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; color: #2C2C2C;">
          <h2 style="color: #768E78;">Köszönöm a vásárlást! 🌿</h2>
          <p>Kedves Vásárló,</p>
          <p>Köszönöm, hogy vásárlásoddal támogatod a vállalkozásomat! Remélem örömöd leled a rajzokban!</p>
          <p><strong>${productName}</strong></p>
          <p>Az alábbi linkekre kattintva letöltheted a fájlokat:</p>
          <div style="margin: 24px 0;">${fileLinks}</div>
          <p style="font-size: 13px; color: #999;">A letöltési linkek 7 napig érvényesek.</p>
          <p>Szeretettel,<br/>Réka</p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
