import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { productId, tipAmount } = await req.json();

  const { data: product } = await supabase
    .from('products')
    .select('id, name, description, price')
    .eq('id', productId)
    .eq('active', true)
    .single();

  if (!product) {
    return NextResponse.json({ error: 'Termék nem található.' }, { status: 404 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price_data: {
        currency: 'huf',
        product_data: {
          name: product.name,
          description: product.description,
        },
        unit_amount: product.price * 100,
      },
      quantity: 1,
    },
  ];

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
    success_url: `${baseUrl}/bolt/sikeres?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/bolt`,
    metadata: { productId: product.id, productName: product.name, tipAmount: tipAmount ?? 0 },
  });

  return NextResponse.json({ url: session.url });
}
