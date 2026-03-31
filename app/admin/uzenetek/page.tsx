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
          Még nincsenek üzenetek.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-dark">{msg.nev}</p>
                  <a href={`mailto:${msg.email}`} className="text-sm text-fern hover:underline">{msg.email}</a>
                </div>
                <p className="text-xs text-dark/40">{new Date(msg.created_at).toLocaleDateString('hu-HU')}</p>
              </div>
              <p className="text-dark/70 leading-relaxed whitespace-pre-wrap">{msg.uzenet}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
