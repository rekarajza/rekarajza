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
  billing_name: string;
  billing_address: string;
  billing_city: string;
  billing_zip: string;
  billing_country: string;
};

export default function Rendelesek() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);

  useEffect(() => {
    supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="text-3xl mb-8">Rendelések</h1>
      {loading ? (
        <p className="text-dark/50">Betöltés...</p>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center text-dark/40">
          Még nincsenek rendelések.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-fennel text-dark/60">
              <tr>
                <th className="text-left px-6 py-3">Dátum</th>
                <th className="text-left px-6 py-3">Termék</th>
                <th className="text-left px-6 py-3">Név</th>
                <th className="text-left px-6 py-3">E-mail</th>
                <th className="text-left px-6 py-3">Összeg</th>
                <th className="text-left px-6 py-3">Státusz</th>
                <th className="text-left px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-fennel hover:bg-fennel/20 transition-colors">
                  <td className="px-6 py-4 text-dark/60">{new Date(order.created_at).toLocaleDateString('hu-HU')}</td>
                  <td className="px-6 py-4 font-semibold">{order.product_name}</td>
                  <td className="px-6 py-4">{order.billing_name || '—'}</td>
                  <td className="px-6 py-4 text-dark/60">{order.email}</td>
                  <td className="px-6 py-4">{(order.amount / 100).toLocaleString('hu-HU')} Ft</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'paid' ? 'bg-fern/20 text-fern' : 'bg-honey/40 text-dark'
                    }`}>
                      {order.status === 'paid' ? 'Fizetve' : order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => setSelected(order)} className="text-xs text-fern hover:underline">Részletek</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-dark/40 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-semibold">Rendelés részletei</h2>
              <button onClick={() => setSelected(null)} className="text-dark/30 hover:text-dark text-xl">✕</button>
            </div>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-dark/50">Dátum</span>
                <span>{new Date(selected.created_at).toLocaleDateString('hu-HU')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark/50">Termék</span>
                <span className="font-semibold text-right max-w-[60%]">{selected.product_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark/50">Összeg</span>
                <span className="font-bold text-fern">{(selected.amount / 100).toLocaleString('hu-HU')} Ft</span>
              </div>
              <div className="border-t border-fennel pt-3 mt-1">
                <p className="text-dark/50 mb-2 font-semibold">Számlázási adatok</p>
                <p><span className="text-dark/50">Név: </span>{selected.billing_name || '—'}</p>
                <p><span className="text-dark/50">E-mail: </span>{selected.email}</p>
                <p><span className="text-dark/50">Cím: </span>{selected.billing_address || '—'}</p>
                <p><span className="text-dark/50">Város: </span>{selected.billing_city || '—'}</p>
                <p><span className="text-dark/50">Irányítószám: </span>{selected.billing_zip || '—'}</p>
                <p><span className="text-dark/50">Ország: </span>{selected.billing_country || '—'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
