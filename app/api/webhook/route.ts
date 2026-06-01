import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function sendNotificationEmail(customerEmail: string, productNames: string, amount: number) {
  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Réka rajza', email: 'rekarajza@gmail.com' },
      to: [{ email: 'rekarajza@gmail.com' }],
      subject: `🛍️ Új rendelés érkezett!`,
      htmlContent: `
        <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; color: #2C2C2C;">
          <h2 style="color: #768E78;">Új rendelés érkezett! 🎉</h2>
          <p><strong>Vevő:</strong> ${customerEmail}</p>
          <p><strong>Termék(ek):</strong> ${productNames}</p>
          <p><strong>Összeg:</strong> ${(amount / 100).toLocaleString('hu-HU')} Ft</p>
          <p style="font-size: 13px; color: #999;">A rendelés részleteit az admin felületen tekintheted meg: rekarajza.hu/admin/rendelesek</p>
        </div>
      `,
    }),
  });
}

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

async function sendDownloadEmail(email: string, productName: string, downloadUrls: { name: string; url: string }[], customerName?: string) {
  const rawName = customerName?.trim() ?? '';
  const firstName = rawName.length > 0 ? rawName.split(' ').pop()! : 'Vásárló';

  await fetch('https://api.brevo.com/v3/smtp/email', {
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
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature error:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email ?? '';
    const productNames = session.metadata?.productNames ?? '';
    const productIds: string[] = JSON.parse(session.metadata?.productIds ?? '[]');

    // Duplikátum ellenőrzés — ugyanaz a session ID ne kerüljön be kétszer
    const { data: existing } = await supabase
      .from('orders')
      .select('id')
      .eq('stripe_session_id', session.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ received: true, skipped: 'duplicate' });
    }

    const billing = session.customer_details;
    const { data: newOrder } = await supabase.from('orders').insert({
      email,
      product_name: productNames,
      amount: session.amount_total ?? 0,
      status: 'paid',
      stripe_session_id: session.id,
      email_sent: false,
      billing_name: billing?.name ?? '',
      billing_address: billing?.address?.line1 ?? '',
      billing_city: billing?.address?.city ?? '',
      billing_zip: billing?.address?.postal_code ?? '',
      billing_country: billing?.address?.country ?? '',
    }).select('id').single();

    await sendNotificationEmail(email, productNames, session.amount_total ?? 0);

    if (productIds.length > 0 && email) {
      const { data: products } = await supabase
        .from('products')
        .select('name, file_url')
        .in('id', productIds);

      if (products && products.length > 0) {
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

        if (downloadUrls.length > 0) {
          await sendDownloadEmail(email, productNames, downloadUrls, session.customer_details?.name ?? '');
          if (newOrder?.id) {
            await supabase.from('orders').update({ email_sent: true }).eq('id', newOrder.id);
          }
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
