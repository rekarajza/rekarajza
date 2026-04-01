'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart';
import { useRouter } from 'next/navigation';

const TIP_OPTIONS = [
  { label: 'Most nem', value: 0 },
  { label: '5%', value: 5 },
  { label: '10%', value: 10 },
  { label: '15%', value: 15 },
];

export default function CartDrawer() {
  const { items, removeItem, clearCart, isOpen, closeCart } = useCart();
  const [tipPercent, setTipPercent] = useState(0);
  const [customTip, setCustomTip] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [buying, setBuying] = useState(false);
  const router = useRouter();

  const subtotal = items.reduce((sum, i) => sum + i.price, 0);
  const tipAmount = showCustom
    ? Math.round(Number(customTip) || 0)
    : Math.round(subtotal * tipPercent / 100);
  const total = subtotal + tipAmount;

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setBuying(true);
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: items.map(i => i.id), tipAmount }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('Hiba történt. Kérlek próbáld újra.');
      setBuying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-dark/40 z-50" onClick={closeCart} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-fennel">
          <h2 className="text-xl font-semibold">Kosár</h2>
          <button onClick={closeCart} className="text-dark/40 hover:text-dark text-2xl">✕</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <p className="text-dark/40 text-center mt-12">A kosár üres.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-fennel overflow-hidden shrink-0">
                    {item.image_url
                      ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full" />
                    }
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-dark text-sm">{item.name}</p>
                    <p className="text-fern font-bold">{item.price.toLocaleString('hu-HU')} Ft</p>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-dark/30 hover:text-peony transition-colors text-lg">✕</button>
                </div>
              ))}
            </div>
          )}

          {/* Tip section */}
          {items.length > 0 && (
            <div className="mt-8 pt-6 border-t border-fennel">
              <p className="text-sm font-semibold text-dark mb-1">☕ Meghívod Rékát egy kávéra?</p>
              <p className="text-xs text-dark/40 mb-3">Teljesen opcionális, de nagyon örülök neki!</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {TIP_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setTipPercent(opt.value); setShowCustom(false); setCustomTip(''); }}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      !showCustom && tipPercent === opt.value
                        ? 'bg-fern text-white border-fern'
                        : 'border-fennel text-dark/60 hover:border-fern'
                    }`}
                  >
                    {opt.value === 0 ? 'Most nem' : `${opt.label} (${Math.round(subtotal * opt.value / 100).toLocaleString('hu-HU')} Ft)`}
                  </button>
                ))}
                <button
                  onClick={() => { setShowCustom(true); setTipPercent(0); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    showCustom ? 'bg-fern text-white border-fern' : 'border-fennel text-dark/60 hover:border-fern'
                  }`}
                >
                  Egyéb
                </button>
              </div>
              {showCustom && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="pl. 500"
                    value={customTip}
                    onChange={e => setCustomTip(e.target.value)}
                    className="border border-fennel rounded-xl px-3 py-2 text-sm outline-none focus:border-fern w-32"
                  />
                  <span className="text-sm text-dark/50">Ft</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-fennel">
            <div className="flex justify-between text-sm text-dark/60 mb-1">
              <span>Termékek</span>
              <span>{subtotal.toLocaleString('hu-HU')} Ft</span>
            </div>
            {tipAmount > 0 && (
              <div className="flex justify-between text-sm text-dark/60 mb-1">
                <span>☕ Kávé</span>
                <span>{tipAmount.toLocaleString('hu-HU')} Ft</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-dark text-lg mb-4">
              <span>Összesen</span>
              <span>{total.toLocaleString('hu-HU')} Ft</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={buying}
              className="w-full py-4 bg-fern text-white rounded-full font-semibold text-lg hover:bg-fern/80 transition-colors disabled:opacity-50"
            >
              {buying ? 'Töltés...' : 'Fizetés'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
