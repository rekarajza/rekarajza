'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Message = {
  id: string;
  nev: string;
  email: string;
  uzenet: string;
  created_at: string;
};

export default function Uzenetek() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  useEffect(() => {
    supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setMessages(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="text-3xl mb-8">Üzenetek</h1>
      {loading ? (
        <p className="text-dark/50">Betöltés...</p>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center text-dark/40">
          Még nincsenek beérkezett üzenetek.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => setSelected(msg)}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-dark">{msg.nev}</span>
                    <span className="text-sm text-dark/40">{msg.email}</span>
                  </div>
                  <p className="text-sm text-dark/60 truncate">{msg.uzenet}</p>
                </div>
                <div className="text-xs text-dark/30 whitespace-nowrap">
                  {new Date(msg.created_at).toLocaleDateString('hu-HU')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 bg-dark/40 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-semibold">Üzenet</h2>
              <button onClick={() => setSelected(null)} className="text-dark/30 hover:text-dark text-xl">✕</button>
            </div>
            <div className="flex flex-col gap-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-dark/50">Dátum</span>
                <span>{new Date(selected.created_at).toLocaleDateString('hu-HU')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark/50">Név</span>
                <span className="font-semibold">{selected.nev}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark/50">E-mail</span>
                <a href={`mailto:${selected.email}`} className="text-fern hover:underline">{selected.email}</a>
              </div>
            </div>
            <div className="bg-fennel/40 rounded-xl p-4 text-sm text-dark leading-relaxed whitespace-pre-wrap mb-6">
              {selected.uzenet}
            </div>
            <a
              href={`mailto:${selected.email}?subject=Re: Üzenet a rekarajza.hu weboldalról`}
              className="block w-full text-center bg-fern text-white py-3 rounded-xl font-semibold hover:bg-fern/80 transition-colors"
            >
              ✉ Válasz küldése
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
