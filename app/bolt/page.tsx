'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
};

export default function Bolt() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('products')
      .select('id, name, description, price, image_url')
      .eq('active', true)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setProducts(data ?? []);
        setLoading(false);
      });
  }, []);

  const handleBuy = async (productId: string) => {
    setBuying(productId);
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('Hiba történt. Kérlek próbáld újra.');
      setBuying(null);
    }
  };

  return (
    <div>
      <section className="bg-fennel py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl mb-4">Bolt</h1>
        <p className="text-dark/60 text-lg max-w-xl mx-auto">
          Digitális termékek – vásárlás után azonnal letölthető illusztrációk.
        </p>
      </section>

      <section className="bg-cream py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {loading ? (
            <p className="text-dark/50 col-span-4">Betöltés...</p>
          ) : products.length === 0 ? (
            <p className="text-dark/40 col-span-4 text-center">Hamarosan érkeznek a termékek.</p>
          ) : (
            products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="aspect-square bg-fennel overflow-hidden">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-dark/30 text-sm">Hamarosan...</span>
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-semibold text-dark mb-1">{product.name}</h3>
                  <p className="text-dark/50 text-sm mb-2">Digitális letöltés</p>
                  <p className="text-fern font-bold text-lg mb-4">{product.price.toLocaleString('hu-HU')} Ft</p>
                  <button
                    onClick={() => handleBuy(product.id)}
                    disabled={buying === product.id}
                    className="mt-auto w-full py-2 bg-fern text-white rounded-full text-sm font-semibold hover:bg-fern/80 transition-colors disabled:opacity-50"
                  >
                    {buying === product.id ? 'Töltés...' : 'Kosárba'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
