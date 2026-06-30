import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { CUSTOM_TIER_OPTIONS } from '@/lib/customProduct';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function sendNotificationEmail(
  customerEmail: string,
  productNames: string,
  amount: number,
  custom: { tierLabel: string; size: string; description: string } | null
) {
  const customBlock = custom
    ? `
        <div style="background:#FFF3E0;border-radius:10px;padding:16px 20px;margin-top:16px;">
          <p style="margin:0 0 6px;font-weight:bold;color:#2C2C2C;">🎨 Egyedi kép kérés</p>
          <p style="margin:0 0 4px;"><strong>Karakterek:</strong> ${custom.tierLabel}</p>
          <p style="margin:0 0 4px;"><strong>Méret:</strong> ${custom.size}</p>
          <p style="margin:0;white-space:pre-wrap;"><strong>Leírás:</strong> ${custom.description}</p>
        </div>
      `
    : '';

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
          ${customBlock}
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
    <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:600px;margin:0 auto;padding:40px 32px;color:#2C2C2C;">
      <div style="text-align:center;margin-bottom:32px;">
        <img src="https://rekarajza.hu/logo.png" alt="Réka rajza" style="height:100px;width:auto;" />
      </div>
      <p style="font-size:17px;font-weight:bold;margin:0 0 16px;">Köszönöm a vásárlást! 🌿</p>
      <p style="line-height:1.8;margin:0 0 8px;color:#333;">Kedves ${firstName},</p>
      <p style="line-height:1.8;margin:0 0 24px;color:#333;">Köszönöm, hogy vásárlásoddal támogatod a munkámat! Remélem, örömöd leled a rajzokban.</p>
      <p style="line-height:1.8;margin:0 0 16px;color:#333;">A <strong>${productName}</strong> letöltéséhez kattints az alábbi gombra:</p>
      <div style="margin-bottom:28px;">${fileLinks}</div>
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

function buildCustomOrderEmailHtml(firstName: string, tierLabel: string, size: string) {
  return `
    <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:600px;margin:0 auto;padding:40px 32px;color:#2C2C2C;">
      <div style="text-align:center;margin-bottom:32px;">
        <img src="https://rekarajza.hu/logo.png" alt="Réka rajza" style="height:100px;width:auto;" />
      </div>
      <p style="font-size:17px;font-weight:bold;margin:0 0 16px;">Megkaptam az egyedi kép kérésed! 🎨</p>
      <p style="line-height:1.8;margin:0 0 8px;color:#333;">Kedves ${firstName},</p>
      <p style="line-height:1.8;margin:0 0 24px;color:#333;">Köszönöm a részletes leírást! Hamarosan elkészítem a fekete-fehér vázlatot (${tierLabel}, ${size}), és emailben elküldöm jóváhagyásra.</p>
      <p style="line-height:1.8;color:#333;margin:0;">Szeretettel,</p>
      <p style="color:#768E78;font-weight:bold;margin:4px 0 0;">Réka</p>
    </div>
  `;
}

async function sendCustomOrderEmail(email: string, customerName: string | undefined, tierLabel: string, size: string) {
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
      subject: 'Megkaptam az egyedi kép kérésed! 🎨',
      htmlContent: buildCustomOrderEmailHtml(firstName, tierLabel, size),
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

    // Egyedi kép kérés adatainak lekérése, ha van
    const customRequestIds: Record<string, string> = session.metadata?.customRequestIds
      ? JSON.parse(session.metadata.customRequestIds)
      : {};

    let customTier: string | null = null;
    let customSize: string | null = null;
    let customDescription: string | null = null;

    const requestIdList = Object.values(customRequestIds);
    if (requestIdList.length > 0) {
      const { data: requests } = await supabase
        .from('custom_requests')
        .select('tier, size, description')
        .in('id', requestIdList);
      if (requests && requests.length > 0) {
        customTier = requests[0].tier;
        customSize = requests[0].size;
        customDescription = requests[0].description;
      }
    }

    const tipAmount = Number(session.metadata?.tipAmount ?? 0) || 0;

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
      custom_tier: customTier,
      custom_size: customSize,
      custom_description: customDescription,
      tip_amount: tipAmount,
    }).select('id').single();

    const tierLabel = customTier
      ? CUSTOM_TIER_OPTIONS.find((t) => t.key === customTier)?.label ?? customTier
      : null;

    await sendNotificationEmail(
      email,
      productNames,
      session.amount_total ?? 0,
      customDescription && tierLabel && customSize
        ? { tierLabel, size: customSize, description: customDescription }
        : null
    );

    if (customDescription && tierLabel && customSize) {
      await sendCustomOrderEmail(email, session.customer_details?.name ?? undefined, tierLabel, customSize);
    }

    if (productIds.length > 0 && email) {
      const { data: products } = await supabase
        .from('products')
        .select('name, file_url')
        .in('id', productIds);

      if (products && products.length > 0 && newOrder?.id) {
        const downloadUrls: { name: string; url: string }[] = products
          .filter((p): p is typeof p & { file_url: string } => Boolean(p.file_url))
          .map((p) => ({
            name: p.name,
            url: `https://rekarajza.hu/api/download?order=${newOrder.id}&path=${encodeURIComponent(p.file_url)}`,
          }));

        if (downloadUrls.length > 0) {
          await sendDownloadEmail(email, productNames, downloadUrls, session.customer_details?.name ?? '');
          await supabase.from('orders').update({ email_sent: true }).eq('id', newOrder.id);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
