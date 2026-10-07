import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { load, save } from '../lib/storage';

const StudyContext = createContext(null);

const DEFAULT_FILTERS = { level: 'all', priority: 'all', status: 'all' };

export function StudyProvider({ children }) {
  const [learned, setLearned] = useState(() => load('ipg-learned', {}));
  const [bookmarks, setBookmarks] = useState(() => load('ipg-bookmarks', {}));
  const [filters, setFilters] = useState(() => load('ipg-filters', DEFAULT_FILTERS));
  const [theme, setTheme] = useState(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );

  useEffect(() => save('ipg-learned', learned), [learned]);
  useEffect(() => save('ipg-bookmarks', bookmarks), [bookmarks]);
  useEffect(() => save('ipg-filters', filters), [filters]);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem('ipg-theme', theme); } catch { /* ignore */ }
  }, [theme]);

  const value = useMemo(() => {
    const toggle = (setter) => (key) =>
      setter((prev) => {
        const next = { ...prev };
        if (next[key]) delete next[key];
        else next[key] = Date.now();
        return next;
      });
    return {
      learned,
      bookmarks,
      filters,
      theme,
      toggleLearned: toggle(setLearned),
      toggleBookmark: toggle(setBookmarks),
      setFilter: (name, val) => setFilters((f) => ({ ...f, [name]: val })),
      resetFilters: () => setFilters(DEFAULT_FILTERS),
      toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
      resetProgress: () => setLearned({}),
    };
  }, [learned, bookmarks, filters, theme]);

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export function useStudy() {
  const ctx = useContext(StudyContext);
  if (!ctx) throw new Error('useStudy must be used inside <StudyProvider>');
  return ctx;
}
