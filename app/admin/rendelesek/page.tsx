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

export default function Rendelesek() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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
                <th className="text-left px-6 py-3">E-mail</th>
                <th className="text-left px-6 py-3">Összeg</th>
                <th className="text-left px-6 py-3">Státusz</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-fennel">
                  <td className="px-6 py-4 text-dark/60">{new Date(order.created_at).toLocaleDateString('hu-HU')}</td>
                  <td className="px-6 py-4 font-semibold">{order.product_name}</td>
                  <td className="px-6 py-4 text-dark/60">{order.email}</td>
                  <td className="px-6 py-4">{(order.amount / 100).toLocaleString('hu-HU')} Ft</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'paid' ? 'bg-fern/20 text-fern' : 'bg-honey/40 text-dark'
                    }`}>
                      {order.status === 'paid' ? 'Fizetve' : order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
