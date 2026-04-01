'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookie_consent');
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-dark text-cream px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
      <p className="text-sm text-center sm:text-left">
        Ez a weboldal sütiket (cookie-kat) használ a működéshez. Részletek az{' '}
        <Link href="/adatkezeles" className="underline hover:text-honey transition-colors">
          Adatkezelési tájékoztatóban
        </Link>
        .
      </p>
      <button
        onClick={accept}
        className="shrink-0 px-6 py-2 bg-fern text-white rounded-full text-sm font-semibold hover:bg-fern/80 transition-colors"
      >
        Elfogadom
      </button>
    </div>
  );
}
