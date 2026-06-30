import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get('order');
  const path = req.nextUrl.searchParams.get('path');

  if (!path) {
    return NextResponse.json({ error: 'Hiányzó fájl útvonal' }, { status: 400 });
  }

  const { data: signedUrl, error } = await supabase.storage
    .from('product-files')
    .createSignedUrl(path, 60 * 60);

  if (error || !signedUrl?.signedUrl) {
    return NextResponse.json({ error: 'A fájl nem található' }, { status: 404 });
  }

  if (orderId) {
    await supabase
      .from('orders')
      .update({ downloaded: true, downloaded_at: new Date().toISOString() })
      .eq('id', orderId);
  }

  return NextResponse.redirect(signedUrl.signedUrl);
}
