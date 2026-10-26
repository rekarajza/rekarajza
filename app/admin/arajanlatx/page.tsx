'use client';

import { useEffect, useState } from 'react';

interface SavedQuote {
  id: string;
  name: string;
  savedAt: string;
}

export default function ArajanlatPage() {
  const [quotes, setQuotes] = useState<SavedQuote[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('rr_quotes');
      if (saved) setQuotes(JSON.parse(saved));
    } catch {}
  }, []);

  const deleteQuote = (id: string) => {
    if (!confirm('Biztosan törlöd ezt az árajánlatot?')) return;
    const updated = quotes.filter(q => q.id !== id);
    setQuotes(updated);
    try { localStorage.setItem('rr_quotes', JSON.stringify(updated)); } catch {}
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl mb-1">Árajánlatok</h1>
          <p className="text-dark/50 text-sm">Könyvillusztráció-ajánlatok készítése és kezelése</p>
        </div>
        <a
          href="/arajanlatx.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-fern text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-fern/90 transition-colors"
        >
          + Új árajánlat
        </a>
      </div>

      {quotes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-fennel p-8 text-center max-w-lg">
          <p className="text-dark/40 text-sm mb-1">Még nincs mentett árajánlat.</p>
          <p className="text-dark/30 text-xs">Nyisd meg az árajánlat sablont, töltsd ki, majd nyomj <strong>Mentés</strong> gombot.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-w-2xl">
          {quotes.map(q => (
            <div key={q.id} className="bg-white rounded-2xl border border-fennel px-5 py-4 flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-dark truncate">{q.name}</p>
                <p className="text-xs text-dark/40 mt-0.5">Mentve: {q.savedAt}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <a
                  href={`/arajanlatx.html?load=${q.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-semibold bg-fennel text-fern rounded-lg hover:bg-fennel/70 transition-colors"
                >
                  Megnyitás
                </a>
                <a
                  href={`/arajanlatx.html?load=${q.id}&print=1`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-semibold bg-fern text-white rounded-lg hover:bg-fern/85 transition-colors"
                >
                  🖨 Exportálás
                </a>
                <button
                  onClick={() => deleteQuote(q.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-dark/40 hover:text-peony transition-colors"
                >
                  Törlés
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 bg-white rounded-2xl border border-fennel p-5 max-w-lg">
        <p className="font-semibold text-dark text-sm mb-2">Hogyan működik:</p>
        <ol className="text-sm text-dark/60 flex flex-col gap-1.5 list-decimal list-inside">
          <li>Kattints az <strong>+ Új árajánlat</strong> gombra</li>
          <li>Töltsd ki a sablon mezőit és az árakat</li>
          <li>Nyomj <strong>💾 Mentés</strong> gombot a sablonban – megjelenik a listában</li>
          <li>A listából <strong>Megnyitás</strong> = szerkesztés, <strong>Exportálás</strong> = PDF nyomtatás</li>
        </ol>
      </div>
    </div>
  );
}
