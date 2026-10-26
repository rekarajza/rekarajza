'use client';

export default function ArajanlatPage() {
  return (
    <div>
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl mb-1">Árajánlat sablon</h1>
          <p className="text-dark/50 text-sm">Könyvillusztráció-ajánlat kitöltése és nyomtatása</p>
        </div>
        <a
          href="/arajanlatx.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-fern text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-fern/90 transition-colors"
        >
          Megnyitás és kitöltés ↗
        </a>
      </div>

      <div className="bg-white rounded-2xl border border-fennel p-6 max-w-lg">
        <p className="font-semibold text-dark mb-3">Hogyan használd:</p>
        <ol className="text-sm text-dark/70 flex flex-col gap-2 list-decimal list-inside">
          <li>Kattints a <strong>Megnyitás és kitöltés</strong> gombra – új lapon nyílik meg a sablon</li>
          <li>Töltsd ki a projekt adatait és árakat</li>
          <li>Az illusztráció-típusoknál kattints a képhelyre a példakép feltöltéséhez</li>
          <li>Nyomtatáshoz: <strong>Ctrl+P</strong> → Mentés PDF-ként</li>
        </ol>
        <p className="text-xs text-dark/40 mt-4">A feltöltött képek és kitöltött mezők a böngésződben maradnak, legközelebb is ott lesznek.</p>
      </div>
    </div>
  );
}
