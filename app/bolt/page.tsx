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

const TIP_OPTIONS = [
  { label: '0%', value: 0 },
  { label: '5%', value: 5 },
  { label: '10%', value: 10 },
  { label: '15%', value: 15 },
];

export default function Bolt() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Product | null>(null);
  const [buying, setBuying] = useState(false);
  const [tipPercent, setTipPercent] = useState(0);
  const [customTip, setCustomTip] = useState('');
  const [showCustom, setShowCustom] = useState(false);

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

  const openModal = (product: Product) => {
    setSelected(product);
    setTipPercent(0);
    setCustomTip('');
    setShowCustom(false);
  };

  const tipAmount = selected
    ? showCustom
      ? Math.round(Number(customTip) || 0)
      : Math.round(selected.price * tipPercent / 100)
    : 0;

  const totalAmount = selected ? selected.price + tipAmount : 0;

  const handleBuy = async (productId: string) => {
    setBuying(true);
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, tipAmount }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('Hiba történt. Kérlek próbáld újra.');
      setBuying(false);
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
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col cursor-pointer"
                onClick={() => openModal(product)}
              >
                <div className="aspect-square bg-fennel overflow-hidden">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
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
                    onClick={(e) => { e.stopPropagation(); openModal(product); }}
                    className="mt-auto w-full py-2 bg-fern text-white rounded-full text-sm font-semibold hover:bg-fern/80 transition-colors"
                  >
                    Kosárba
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Product detail modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-dark/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="md:w-1/2 bg-fennel min-h-64 md:min-h-0">
              {selected.image_url ? (
                <img src={selected.image_url} alt={selected.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-dark/30 text-sm">Nincs kép</span>
                </div>
              )}
            </div>
            <div className="md:w-1/2 p-10 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-3xl font-semibold text-dark">{selected.name}</h2>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-dark/30 hover:text-dark text-2xl leading-none ml-4 shrink-0"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-fern font-bold text-2xl mb-6">{selected.price.toLocaleString('hu-HU')} Ft</p>

                {selected.description && (
                  <div className="text-dark/70 text-sm leading-relaxed space-y-3 mb-8">
                    {selected.description.split('\n').map((line, i) => {
                      if (!line.trim()) return null;
                      const regex = /(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*)/g;
                      const result: React.ReactNode[] = [];
                      let last = 0, match;
                      while ((match = regex.exec(line)) !== null) {
                        if (match.index > last) result.push(line.slice(last, match.index));
                        const m = match[0];
                        if (m.startsWith('***')) result.push(<strong key={match.index}><em>{m.slice(3,-3)}</em></strong>);
                        else if (m.startsWith('**')) result.push(<strong key={match.index}>{m.slice(2,-2)}</strong>);
                        else result.push(<em key={match.index}>{m.slice(1,-1)}</em>);
                        last = regex.lastIndex;
                      }
                      if (last < line.length) result.push(line.slice(last));
                      return <p key={i}>{result}</p>;
                    })}
                  </div>
                )}

                {/* Tip section */}
                <div className="border-t border-fennel pt-6 mb-6">
                  <p className="text-sm font-semibold text-dark mb-1">☕ Meghívod Rékát egy kávéra?</p>
                  <p className="text-xs text-dark/40 mb-3">Teljesen opcionális, de nagyon örülök neki!</p>
                  <div className="flex gap-2 flex-wrap mb-3">
                    {TIP_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setTipPercent(opt.value); setShowCustom(false); setCustomTip(''); }}
                        className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                          !showCustom && tipPercent === opt.value
                            ? 'bg-fern text-white border-fern'
                            : 'border-fennel text-dark/60 hover:border-fern'
                        }`}
                      >
                        {opt.value === 0 ? 'Nem most' : `${opt.label} (${Math.round(selected.price * opt.value / 100).toLocaleString('hu-HU')} Ft)`}
                      </button>
                    ))}
                    <button
                      onClick={() => { setShowCustom(true); setTipPercent(0); }}
                      className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                        showCustom
                          ? 'bg-fern text-white border-fern'
                          : 'border-fennel text-dark/60 hover:border-fern'
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
                        className="border border-fennel rounded-xl px-4 py-2 text-sm outline-none focus:border-fern w-36"
                      />
                      <span className="text-sm text-dark/50">Ft</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-dark/50">Termék ára</span>
                  <span>{selected.price.toLocaleString('hu-HU')} Ft</span>
                </div>
                {tipAmount > 0 && (
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-dark/50">☕ Kávé</span>
                    <span>{tipAmount.toLocaleString('hu-HU')} Ft</span>
                  </div>
                )}
                <div className="flex justify-between items-center font-bold text-dark border-t border-fennel pt-2">
                  <span>Összesen</span>
                  <span>{totalAmount.toLocaleString('hu-HU')} Ft</span>
                </div>
              </div>

              <button
                onClick={() => handleBuy(selected.id)}
                disabled={buying}
                className="w-full py-4 bg-fern text-white rounded-full font-semibold text-lg hover:bg-fern/80 transition-colors disabled:opacity-50 mt-6"
              >
                {buying ? 'Töltés...' : 'Kosárba'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
