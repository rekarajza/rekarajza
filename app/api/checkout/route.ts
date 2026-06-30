import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { CUSTOM_TIER_OPTIONS } from '@/lib/customProduct';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type CheckoutItem = {
  id: string;
  customRequest?: { tier: string; size: string; description: string };
};

export async function POST(req: NextRequest) {
  const { items, tipAmount }: { items: CheckoutItem[]; tipAmount?: number } = await req.json();

  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'Üres kosár.' }, { status: 400 });
  }

  const { data: products } = await supabase
    .from('products')
    .select('id, name, price, sale_price, image_url, requires_description')
    .in('id', items.map((i) => i.id))
    .eq('active', true);

  if (!products || products.length === 0) {
    return NextResponse.json({ error: 'Termékek nem találhatók.' }, { status: 404 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';

  const customRequestIds: Record<string, string> = {};
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  for (const product of products) {
    if (product.requires_description) {
      const submitted = items.find((i) => i.id === product.id);
      const tierInfo = CUSTOM_TIER_OPTIONS.find((t) => t.key === submitted?.customRequest?.tier);
      const description = submitted?.customRequest?.description?.trim();
      const size = submitted?.customRequest?.size?.trim();

      if (!tierInfo || !description || description.length < 15 || !size) {
        return NextResponse.json({ error: 'Hiányos egyedi kép adatok.' }, { status: 400 });
      }

      const { data: requestRow } = await supabase
        .from('custom_requests')
        .insert({ product_id: product.id, tier: tierInfo.key, size, description })
        .select('id')
        .single();

      if (requestRow?.id) {
        customRequestIds[product.id] = requestRow.id;
      }

      lineItems.push({
        price_data: {
          currency: 'huf',
          product_data: {
            name: `${product.name} (${tierInfo.label}, ${size})`,
            ...(product.image_url ? { images: [product.image_url] } : {}),
          },
          unit_amount: tierInfo.price * 100,
        },
        quantity: 1,
      });
    } else {
      lineItems.push({
        price_data: {
          currency: 'huf',
          product_data: {
            name: product.name,
            ...(product.image_url ? { images: [product.image_url] } : {}),
          },
          unit_amount: (product.sale_price ?? product.price) * 100,
        },
        quantity: 1,
      });
    }
  }

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
      productIds: JSON.stringify(products.map((p) => p.id)),
      productNames: products.map((p) => p.name).join(', '),
      tipAmount: tipAmount ?? 0,
      ...(Object.keys(customRequestIds).length > 0
        ? { customRequestIds: JSON.stringify(customRequestIds) }
        : {}),
    },
  });

  return NextResponse.json({ url: session.url });
}
