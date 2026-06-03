'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login');
      } else {
        setChecking(false);
        fetchUnreadCount();
      }
    });
  }, [pathname, router]);

  const fetchUnreadCount = async () => {
    const { count } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('read', false);
    setUnreadCount(count ?? 0);
  };

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
            { href: '/admin/uzenetek', label: 'Üzenetek', badge: unreadCount },
            { href: '/admin/statisztikak', label: 'Statisztikák' },
          ].map(({ href, label, badge }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
                pathname === href ? 'bg-fennel text-dark' : 'text-dark/60 hover:bg-fennel/50'
              }`}
            >
              {label}
              {badge ? (
                <span className="bg-peony text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {badge > 9 ? '9+' : badge}
                </span>
              ) : null}
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
