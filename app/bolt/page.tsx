'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useCart } from '@/lib/cart';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  sale_price: number | null;
  image_url: string | null;
  tags: string[];
};

export default function Bolt() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState('Összes');
  const [lightbox, setLightbox] = useState<string | null>(null);
  const { addItem, items } = useCart();

  useEffect(() => {
    supabase
      .from('products')
      .select('id, name, description, price, sale_price, image_url, tags')
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        setProducts(data ?? []);
        setLoading(false);
      });
  }, []);

  const isInCart = (id: string) => items.some(i => i.id === id);

  const categories = ['Összes', ...Array.from(new Set(products.flatMap(p => p.tags ?? [])))];
  const filtered = activeCategory === 'Összes' ? products : products.filter(p => (p.tags ?? []).includes(activeCategory));

  return (
    <div>
      <section className="bg-honey py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl mb-4">Bolt</h1>
        <p className="text-dark/60 text-lg max-w-xl mx-auto">
          Digitális termékek – vásárlás után azonnal letölthető illusztrációk.
        </p>
      </section>

      <section className="bg-cream py-16 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Kategória szűrők */}
          {!loading && categories.length > 2 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                    activeCategory === cat
                      ? 'bg-fern text-white'
                      : 'bg-fennel text-dark hover:bg-pistachio'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {loading ? (
            <p className="text-dark/50 col-span-4">Betöltés...</p>
          ) : products.length === 0 ? (
            <p className="text-dark/40 col-span-4 text-center">Hamarosan érkeznek a termékek.</p>
          ) : (
            filtered.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col cursor-pointer"
                onClick={() => setSelected(product)}
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
                  <div className="mb-4 flex items-center gap-2 flex-wrap">
                    {product.sale_price ? (
                      <>
                        <span className="bg-peony text-white font-bold text-sm px-3 py-1 rounded-full">{product.sale_price.toLocaleString('hu-HU')} Ft</span>
                        <span className="text-dark/40 text-sm line-through">{product.price.toLocaleString('hu-HU')} Ft</span>
                      </>
                    ) : (
                      <span className="bg-honey text-dark font-bold text-sm px-3 py-1 rounded-full">{product.price.toLocaleString('hu-HU')} Ft</span>
                    )}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); addItem(product); }}
                    className={`mt-auto w-full py-2 rounded-full text-sm font-semibold transition-colors ${
                      isInCart(product.id)
                        ? 'bg-fennel text-dark/60'
                        : 'bg-fern text-white hover:bg-fern/80'
                    }`}
                  >
                    {isInCart(product.id) ? '✓ Kosárban' : 'Kosárba'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
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
            <div className="md:w-1/2 bg-fennel min-h-64 md:min-h-0 overflow-hidden cursor-zoom-in relative group"
              onClick={() => selected.image_url && setLightbox(selected.image_url)}
            >
              {selected.image_url ? (
                <>
                  <img
                    src={selected.image_url}
                    alt={selected.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125"
                  />
                  <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span className="bg-dark/60 text-white text-xs px-3 py-1 rounded-full">🔍 Kattints a nagyításhoz</span>
                  </div>
                </>
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
                <div className="mb-6 flex items-center gap-3 flex-wrap">
                  {selected.sale_price ? (
                    <>
                      <span className="bg-peony text-white font-bold text-xl px-4 py-1.5 rounded-full">{selected.sale_price.toLocaleString('hu-HU')} Ft</span>
                      <span className="text-dark/40 text-lg line-through">{selected.price.toLocaleString('hu-HU')} Ft</span>
                    </>
                  ) : (
                    <span className="bg-honey text-dark font-bold text-xl px-4 py-1.5 rounded-full">{selected.price.toLocaleString('hu-HU')} Ft</span>
                  )}
                </div>
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
              </div>
              <button
                onClick={() => { addItem(selected); setSelected(null); }}
                className={`w-full py-4 rounded-full font-semibold text-lg transition-colors ${
                  isInCart(selected.id)
                    ? 'bg-fennel text-dark/60'
                    : 'bg-fern text-white hover:bg-fern/80'
                }`}
              >
                {isInCart(selected.id) ? '✓ Kosárban van' : 'Kosárba'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-dark/90 flex items-center justify-center z-[60] p-4 cursor-zoom-out"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl leading-none"
            onClick={() => setLightbox(null)}
          >✕</button>
          <img
            src={lightbox}
            alt=""
            className="max-w-full max-h-full object-contain rounded-xl"
            style={{ touchAction: 'pinch-zoom' }}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
