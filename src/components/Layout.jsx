import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  const [drawer, setDrawer] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { window.scrollTo(0, 0); document.getElementById('main')?.scrollTo(0, 0); }, [pathname]);

  return (
    <div className="flex h-full">
      <aside className="hidden lg:block w-80 shrink-0 border-r border-rule dark:border-rule-dark bg-paper dark:bg-paper-dark h-full">
        <Sidebar />
      </aside>

      {drawer && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawer(false)} />
          <aside className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-paper dark:bg-paper-dark shadow-xl">
            <Sidebar onNavigate={() => setDrawer(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col h-full">
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-rule dark:border-rule-dark bg-paper dark:bg-paper-dark">
          <button onClick={() => setDrawer(true)} className="rounded-md border border-rule dark:border-rule-dark px-3 py-1.5 text-sm">Topics</button>
          <span className="font-serif font-semibold">Interview notebook</span>
        </header>
        <main id="main" className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
