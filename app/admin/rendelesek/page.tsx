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
  email_sent: boolean;
  downloaded: boolean;
  downloaded_at: string | null;
  invoice_sent: boolean;
  custom_tier: string | null;
  custom_size: string | null;
  custom_description: string | null;
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
  const [resending, setResending] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const resendEmail = async (order: Order) => {
    setResending(order.id);
    const res = await fetch('/api/admin/resend-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: order.email,
        productName: order.product_name,
        customerName: order.billing_name,
        orderId: order.id,
      }),
    });
    if (res.ok) {
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, email_sent: true } : o));
    }
    setResending(null);
  };

  const toggleInvoice = async (order: Order) => {
    const newValue = !order.invoice_sent;
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, invoice_sent: newValue } : o));
    await supabase.from('orders').update({ invoice_sent: newValue }).eq('id', order.id);
  };

  const deleteOrder = async (id: string) => {
    setDeleting(id);
    await supabase.from('orders').delete().eq('id', id);
    setOrders(prev => prev.filter(o => o.id !== id));
    setDeleteConfirm(null);
    setDeleting(null);
  };

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
                <th className="text-left px-6 py-3">Számla</th>
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
                    <div className="flex flex-col gap-1.5">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold w-fit ${
                        order.status === 'paid' ? 'bg-fern/20 text-fern' : 'bg-honey/40 text-dark'
                      }`}>
                        {order.status === 'paid' ? 'Fizetve' : order.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold w-fit ${
                        order.email_sent ? 'bg-fern/20 text-fern' : 'bg-peony/10 text-peony'
                      }`}>
                        {order.email_sent ? '📧 Email elküldve' : '📧 Email nem ment'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold w-fit ${
                        order.downloaded ? 'bg-fern/20 text-fern' : 'bg-dark/10 text-dark/50'
                      }`}>
                        {order.downloaded ? '⬇ Letöltve' : '⬇ Nem töltötte le'}
                      </span>
                      {order.custom_description && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold w-fit bg-honey/50 text-dark">
                          🎨 Egyedi rendelés
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={order.invoice_sent}
                        onChange={() => toggleInvoice(order)}
                        className="w-4 h-4 accent-fern cursor-pointer"
                      />
                      <span className={`text-xs ${order.invoice_sent ? 'text-fern font-semibold' : 'text-dark/40'}`}>
                        {order.invoice_sent ? 'Kiküldve' : 'Nincs kiküldve'}
                      </span>
                    </label>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelected(order)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-fennel text-dark hover:bg-fern/20 transition-colors"
                      >
                        Részletek
                      </button>
                      <button
                        onClick={() => resendEmail(order)}
                        disabled={resending === order.id}
                        className="text-xs px-3 py-1.5 rounded-lg bg-fern/10 text-fern hover:bg-fern/20 transition-colors disabled:opacity-50"
                        title="Letöltési email újraküldése"
                      >
                        {resending === order.id ? '...' : '📧 Újraküld'}
                      </button>
                      {deleteConfirm === order.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => deleteOrder(order.id)}
                            disabled={deleting === order.id}
                            className="text-xs px-3 py-1.5 rounded-lg bg-peony text-white hover:bg-peony/80 transition-colors disabled:opacity-50"
                          >
                            {deleting === order.id ? '...' : 'Biztos?'}
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="text-xs px-2 py-1.5 rounded-lg text-dark/40 hover:text-dark transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(order.id)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-peony/10 text-peony hover:bg-peony/20 transition-colors"
                          title="Rendelés törlése"
                        >
                          Törlés
                        </button>
                      )}
                    </div>
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
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
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
              <div className="flex justify-between">
                <span className="text-dark/50">Letöltve</span>
                <span>{selected.downloaded && selected.downloaded_at ? new Date(selected.downloaded_at).toLocaleString('hu-HU') : 'Még nem'}</span>
              </div>
              {selected.custom_description && (
                <div className="border-t border-fennel pt-3 mt-1">
                  <p className="text-dark/50 mb-2 font-semibold">🎨 Egyedi kép kérés</p>
                  <p><span className="text-dark/50">Karakterek: </span>{selected.custom_tier}</p>
                  <p><span className="text-dark/50">Méret: </span>{selected.custom_size}</p>
                  <div className="mt-2 bg-fennel/40 rounded-xl p-3 text-dark leading-relaxed whitespace-pre-wrap">
                    {selected.custom_description}
                  </div>
                </div>
              )}
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
