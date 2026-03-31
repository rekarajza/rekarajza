'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Hibás e-mail vagy jelszó.');
      setLoading(false);
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-fennel flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-sm p-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="Réka rajza" width={100} height={50} className="object-contain mx-auto mb-4" />
          <h1 className="text-2xl font-semibold">Admin belépés</h1>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-pistachio focus:outline-none focus:border-fern transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Jelszó</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-pistachio focus:outline-none focus:border-fern transition-colors"
            />
          </div>
          {error && <p className="text-peony text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-fern text-white rounded-full font-semibold hover:bg-fern/80 transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Belépés...' : 'Belépés'}
          </button>
        </form>
      </div>
    </div>
  );
}
