'use client';

import { useState } from 'react';

export default function Kapcsolat() {
  const [form, setForm] = useState({ nev: '', email: '', uzenet: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (res.ok) {
      setSent(true);
    } else {
      setError('Valami hiba történt. Kérlek próbáld újra.');
    }
  };

  return (
    <div>
      <section className="bg-fennel py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl">Kapcsolat</h1>
      </section>

      <section className="bg-cream py-20 px-6">
        <div className="max-w-xl mx-auto">
          {sent ? (
            <div className="text-center py-16">
              <p className="text-2xl text-fern font-semibold mb-4">Köszönöm az üzeneted!</p>
              <p className="text-dark/60">Hamarosan visszajelzek.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Neved</label>
                <input
                  type="text"
                  required
                  value={form.nev}
                  onChange={(e) => setForm({ ...form, nev: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-pistachio bg-white focus:outline-none focus:border-fern transition-colors"
                  placeholder="Például: Kovács Anna"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">E-mail címed</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-pistachio bg-white focus:outline-none focus:border-fern transition-colors"
                  placeholder="pelda@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Üzeneted</label>
                <textarea
                  required
                  rows={5}
                  value={form.uzenet}
                  onChange={(e) => setForm({ ...form, uzenet: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-pistachio bg-white focus:outline-none focus:border-fern transition-colors resize-none"
                  placeholder="Miben segíthetek?"
                />
              </div>
              {error && <p className="text-peony text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-fern text-white rounded-full font-semibold hover:bg-fern/80 transition-colors disabled:opacity-50"
              >
                {loading ? 'Küldés...' : 'Küldés'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
