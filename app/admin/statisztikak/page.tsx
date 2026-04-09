'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Order = {
  id: string;
  email: string;
  product_name: string;
  amount: number;
  status: string;
  created_at: string;
};

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <p className="text-sm text-dark/50 mb-1">{label}</p>
      <p className="text-3xl font-bold text-dark">{value}</p>
      {sub && <p className="text-xs text-dark/40 mt-1">{sub}</p>}
    </div>
  );
}

export default function Statisztikak() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'het' | 'honap' | 'ev' | 'osszes'>('honap');

  useEffect(() => {
    supabase
      .from('orders')
      .select('*')
      .eq('status', 'paid')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders(data ?? []);
        setLoading(false);
      });
  }, []);

  const now = new Date();
  const filtered = orders.filter(o => {
    const d = new Date(o.created_at);
    if (period === 'het') return (now.getTime() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
    if (period === 'honap') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    if (period === 'ev') return d.getFullYear() === now.getFullYear();
    return true;
  });

  const totalRevenue = filtered.reduce((sum, o) => sum + (o.amount / 100), 0);
  const avgOrder = filtered.length > 0 ? totalRevenue / filtered.length : 0;

  // Top termékek
  const productCounts: Record<string, number> = {};
  filtered.forEach(o => {
    o.product_name.split(', ').forEach(name => {
      productCounts[name] = (productCounts[name] ?? 0) + 1;
    });
  });
  const topProducts = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Napi bontás (utolsó 14 nap)
  const dailyRevenue: Record<string, number> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' });
    dailyRevenue[key] = 0;
  }
  orders.filter(o => (now.getTime() - new Date(o.created_at).getTime()) < 14 * 24 * 60 * 60 * 1000)
    .forEach(o => {
      const key = new Date(o.created_at).toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' });
      if (key in dailyRevenue) dailyRevenue[key] += o.amount / 100;
    });

  const maxDaily = Math.max(...Object.values(dailyRevenue), 1);

  const periodLabels = { het: 'Utolsó 7 nap', honap: 'Ez a hónap', ev: 'Ez az év', osszes: 'Összes' };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl">Statisztikák</h1>
        <div className="flex gap-2">
          {(['het', 'honap', 'ev', 'osszes'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                period === p ? 'bg-fern text-white' : 'bg-white text-dark/60 hover:bg-fennel border border-fennel'
              }`}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-dark/50">Betöltés...</p>
      ) : (
        <>
          {/* Stat kártyák */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Rendelések" value={filtered.length.toString()} sub={periodLabels[period]} />
            <StatCard label="Bevétel" value={`${totalRevenue.toLocaleString('hu-HU')} Ft`} sub={periodLabels[period]} />
            <StatCard label="Átlag rendelés" value={avgOrder > 0 ? `${Math.round(avgOrder).toLocaleString('hu-HU')} Ft` : '—'} />
            <StatCard label="Összes rendelés" value={orders.length.toString()} sub="minden idők" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Napi bevétel grafikon */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-sm font-semibold text-dark/50 mb-4">Napi bevétel (utolsó 14 nap)</p>
              <div className="flex items-end gap-1 h-32">
                {Object.entries(dailyRevenue).map(([day, amount]) => (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-fern/70 rounded-t-md transition-all"
                      style={{ height: `${(amount / maxDaily) * 100}%`, minHeight: amount > 0 ? '4px' : '0' }}
                      title={`${amount.toLocaleString('hu-HU')} Ft`}
                    />
                    <p className="text-dark/30 rotate-45 origin-left" style={{ fontSize: '8px' }}>{day}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top termékek */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-sm font-semibold text-dark/50 mb-4">Legnépszerűbb termékek ({periodLabels[period]})</p>
              {topProducts.length === 0 ? (
                <p className="text-dark/30 text-sm">Nincs adat ebben az időszakban.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {topProducts.map(([name, count]) => (
                    <div key={name} className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-dark truncate">{name}</p>
                        <div className="mt-1 h-1.5 bg-fennel rounded-full overflow-hidden">
                          <div
                            className="h-full bg-fern rounded-full"
                            style={{ width: `${(count / topProducts[0][1]) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-bold text-fern shrink-0">{count}×</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Vercel Analytics megjegyzés */}
          <div className="mt-6 bg-pistachio/30 rounded-2xl p-5">
            <p className="text-sm font-semibold text-dark mb-1">🌐 Látogatói statisztikák</p>
            <p className="text-sm text-dark/60">A részletes látogatói adatokat (oldalmegtekintések, egyedi látogatók, források) a <a href="https://vercel.com/analytics" target="_blank" rel="noopener noreferrer" className="text-fern underline">Vercel Analytics</a> felületen találod — ez automatikusan gyűjti az adatokat a deploy után.</p>
          </div>
        </>
      )}
    </div>
  );
}
