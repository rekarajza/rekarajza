'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminDashboard() {
  const [orders, setOrders] = useState(0);
  const [messages, setMessages] = useState(0);

  useEffect(() => {
    supabase.from('orders').select('id', { count: 'exact', head: true }).then(({ count }) => setOrders(count ?? 0));
    supabase.from('contact_messages').select('id', { count: 'exact', head: true }).then(({ count }) => setMessages(count ?? 0));
  }, []);

  return (
    <div>
      <h1 className="text-3xl mb-8">Áttekintés</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-dark/50 text-sm mb-2">Rendelések</p>
          <p className="text-4xl font-bold text-fern">{orders}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-dark/50 text-sm mb-2">Üzenetek</p>
          <p className="text-4xl font-bold text-peony">{messages}</p>
        </div>
      </div>
    </div>
  );
}
