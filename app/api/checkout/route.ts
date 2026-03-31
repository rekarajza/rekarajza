import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { products } from '@/lib/products';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { productId } = await req.json();

  const product = products.find((p) => p.id === productId);
  if (!product) {
    return NextResponse.json({ error: 'Termék nem található.' }, { status: 404 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: product.currency,
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.price,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${baseUrl}/bolt/sikeres?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/bolt`,
    metadata: { productId: product.id, productName: product.name },
  });

  return NextResponse.json({ url: session.url });
}
