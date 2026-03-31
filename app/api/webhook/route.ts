import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function sendDownloadEmail(email: string, productName: string, downloadUrl: string) {
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
          <p>Köszönöm, hogy megvásároltad a <strong>${productName}</strong> illusztrációt.</p>
          <p>Az alábbi gombra kattintva letöltheted a fájlodat:</p>
          <p style="text-align: center; margin: 32px 0;">
            <a href="${downloadUrl}" style="background-color: #768E78; color: white; padding: 14px 28px; border-radius: 50px; text-decoration: none; font-weight: bold;">
              Letöltés
            </a>
          </p>
          <p style="font-size: 13px; color: #999;">Ha a gomb nem működik, másold be ezt a linket a böngésződbe:<br/>${downloadUrl}</p>
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
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature error:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email ?? '';
    const productId = session.metadata?.productId ?? '';
    const productName = session.metadata?.productName ?? '';

    await supabase.from('orders').insert({
      email,
      product_name: productName,
      amount: session.amount_total ?? 0,
      status: 'paid',
    });

    if (productId && email) {
      const { data: product } = await supabase
        .from('products')
        .select('file_url')
        .eq('id', productId)
        .single();

      if (product?.file_url) {
        const { data: signedUrl } = await supabase.storage
          .from('product-files')
          .createSignedUrl(product.file_url, 60 * 60 * 24 * 7); // 7 days

        if (signedUrl?.signedUrl) {
          await sendDownloadEmail(email, productName, signedUrl.signedUrl);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
