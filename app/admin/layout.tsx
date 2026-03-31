'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login');
      } else {
        setChecking(false);
      }
    });
  }, [pathname, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') return <>{children}</>;
  if (checking) return <div className="min-h-screen bg-fennel flex items-center justify-center"><p className="text-dark/50">Betöltés...</p></div>;

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-fennel flex flex-col">
        <div className="p-6 border-b border-fennel">
          <p className="text-sm font-bold text-dark">Admin</p>
          <p className="text-xs text-dark/50">Réka rajza</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {[
            { href: '/admin', label: 'Áttekintés' },
            { href: '/admin/termekek', label: 'Termékek' },
            { href: '/admin/rendelesek', label: 'Rendelések' },
            { href: '/admin/uzenetek', label: 'Üzenetek' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                pathname === href ? 'bg-fennel text-dark' : 'text-dark/60 hover:bg-fennel/50'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-fennel">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm text-dark/50 hover:text-peony transition-colors text-left"
          >
            Kijelentkezés
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
