'use client';

import { useState } from 'react';
import { products } from '@/lib/products';

export default function Bolt() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleBuy = async (productId: string) => {
    setLoading(productId);
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
      setLoading(null);
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
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="aspect-square bg-fennel flex items-center justify-center">
                <span className="text-dark/30 text-sm">Hamarosan...</span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-semibold text-dark mb-1">{product.name}</h3>
                <p className="text-dark/50 text-sm mb-2">Digitális letöltés · JPG + PDF</p>
                <p className="text-fern font-bold text-lg mb-4">3 500 Ft</p>
                <button
                  onClick={() => handleBuy(product.id)}
                  disabled={loading === product.id}
                  className="mt-auto w-full py-2 bg-fern text-white rounded-full text-sm font-semibold hover:bg-fern/80 transition-colors disabled:opacity-50"
                >
                  {loading === product.id ? 'Töltés...' : 'Kosárba'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
