import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function sendDownloadEmail(email: string, productName: string, downloadUrls: { name: string; url: string }[]) {
  const fileLinks = downloadUrls.map(f =>
    `<p style="margin: 8px 0;"><a href="${f.url}" style="color: #768E78; font-weight: bold;">${f.name} – Letöltés</a></p>`
  ).join('');

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
      htmlContent: `
        <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; color: #2C2C2C;">
          <h2 style="color: #768E78;">Köszönöm a vásárlást! 🌿</h2>
          <p>Kedves Vásárló,</p>
          <p>Köszönöm, hogy megvásároltad az alábbi illusztrációt/illusztrációkat:</p>
          <p><strong>${productName}</strong></p>
          <p>Az alábbi linkekre kattintva letöltheted a fájlokat:</p>
          <div style="margin: 24px 0;">
            ${fileLinks}
          </div>
          <p style="font-size: 13px; color: #999;">A letöltési linkek 7 napig érvényesek.</p>
          <p>Szeretettel,<br/>Réka</p>
        </div>
      `,
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

    const billing = session.customer_details;
    await supabase.from('orders').insert({
      email,
      product_name: productNames,
      amount: session.amount_total ?? 0,
      status: 'paid',
      billing_name: billing?.name ?? '',
      billing_address: billing?.address?.line1 ?? '',
      billing_city: billing?.address?.city ?? '',
      billing_zip: billing?.address?.postal_code ?? '',
      billing_country: billing?.address?.country ?? '',
    });

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
          await sendDownloadEmail(email, productNames, downloadUrls);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
