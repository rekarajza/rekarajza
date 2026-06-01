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
  const fileButtons = downloadUrls.map(f =>
    `<a href="${f.url}" style="display:block;background:#768E78;color:#ffffff;text-decoration:none;padding:14px 24px;border-radius:10px;font-weight:bold;margin-bottom:10px;text-align:center;font-family:Georgia,serif;">${f.name} – Letöltés ↓</a>`
  ).join('');

  return `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">
      <div style="background:#768E78;padding:32px 40px;text-align:center;">
        <p style="color:#ffffff;font-size:22px;font-weight:bold;margin:0;letter-spacing:1px;">Réka rajza</p>
        <p style="color:rgba(255,255,255,0.75);font-size:13px;margin:6px 0 0;">rekarajza.hu</p>
      </div>
      <div style="padding:40px;">
        <h2 style="color:#2C2C2C;font-size:20px;margin:0 0 20px;">Köszönöm a vásárlást! 🌿</h2>
        <p style="color:#555;line-height:1.7;margin:0 0 12px;">Kedves ${firstName},</p>
        <p style="color:#555;line-height:1.7;margin:0 0 28px;">Köszönöm, hogy vásárlásoddal támogatod a vállalkozásomat! Remélem örömöd leled a rajzokban.</p>
        <div style="background:#f5f0e8;border-radius:10px;padding:16px 20px;margin-bottom:28px;">
          <p style="margin:0;font-size:12px;color:#aaa;text-transform:uppercase;letter-spacing:0.5px;">Vásárolt termék</p>
          <p style="margin:6px 0 0;font-weight:bold;color:#2C2C2C;font-size:16px;">${productName}</p>
        </div>
        <p style="color:#555;margin:0 0 16px;">Kattints a gombra a letöltéshez:</p>
        ${fileButtons}
        <p style="font-size:12px;color:#ccc;margin-top:28px;">A letöltési linkek 7 napig érvényesek.</p>
      </div>
      <div style="background:#f9f7f4;padding:24px 40px;text-align:center;border-top:1px solid #ede9e0;">
        <p style="margin:0;color:#aaa;font-size:13px;">Szeretettel,</p>
        <p style="margin:6px 0 0;color:#768E78;font-weight:bold;font-size:16px;">Réka</p>
      </div>
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
