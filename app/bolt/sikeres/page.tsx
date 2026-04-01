'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useCart } from '@/lib/cart';

export default function Sikeres() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div>
      <section className="bg-cream min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="text-5xl mb-6">🎉</div>
        <h1 className="text-4xl mb-4">Köszönöm a vásárlást!</h1>
        <p className="text-dark/60 text-lg max-w-md mb-4">
          A fizetés sikeresen megtörtént. Hamarosan e-mailben megkapod a letöltési linket.
        </p>
        <p className="text-dark/50 text-sm mb-10">
          Ha nem érkezik meg 10 percen belül, kérlek írj a kapcsolat oldalon.
        </p>
        <div className="flex gap-4">
          <Link
            href="/bolt"
            className="px-8 py-3 bg-fern text-white rounded-full font-semibold hover:bg-fern/80 transition-colors"
          >
            Vissza a boltba
          </Link>
          <Link
            href="/kapcsolat"
            className="px-8 py-3 border-2 border-fern text-fern rounded-full font-semibold hover:bg-fern hover:text-white transition-colors"
          >
            Kapcsolat
          </Link>
        </div>
      </section>
    </div>
  );
}
