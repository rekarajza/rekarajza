import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { items, tipAmount } = await req.json();

  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'Üres kosár.' }, { status: 400 });
  }

  const { data: products } = await supabase
    .from('products')
    .select('id, name, price, sale_price, image_url')
    .in('id', items)
    .eq('active', true);

  if (!products || products.length === 0) {
    return NextResponse.json({ error: 'Termékek nem találhatók.' }, { status: 404 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = products.map(product => ({
    price_data: {
      currency: 'huf',
      product_data: {
        name: product.name,
        ...(product.image_url ? { images: [product.image_url] } : {}),
      },
      unit_amount: (product.sale_price ?? product.price) * 100,
    },
    quantity: 1,
  }));

  if (tipAmount && tipAmount > 0) {
    lineItems.push({
      price_data: {
        currency: 'huf',
        product_data: {
          name: '☕ Kávé Rékának',
          description: 'Köszönöm szépen!',
        },
        unit_amount: Math.round(tipAmount) * 100,
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    billing_address_collection: 'required',
    success_url: `${baseUrl}/bolt/sikeres?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/bolt`,
    metadata: {
      productIds: JSON.stringify(products.map(p => p.id)),
      productNames: products.map(p => p.name).join(', '),
      tipAmount: tipAmount ?? 0,
    },
  });

  return NextResponse.json({ url: session.url });
}
