import { useMemo, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALL_TOPICS } from '../data';

// Searches title, summary, and the main text of every topic in every stack.
function score(topic, q) {
  const title = topic.title.toLowerCase();
  if (title === q) return 100;
  if (title.startsWith(q)) return 80;
  if (title.includes(q)) return 60;
  if ((topic.summary || '').toLowerCase().includes(q)) return 40;
  const body = [topic.what, topic.why, ...(topic.questions || []).map((x) => x.q)].join(' ').toLowerCase();
  return body.includes(q) ? 20 : 0;
}

export default function SearchBar({ onNavigate }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const boxRef = useRef(null);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (query.length < 2) return [];
    return ALL_TOPICS.map((t) => ({ t, s: score(t, query) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 10)
      .map((x) => x.t);
  }, [q]);

  useEffect(() => {
    const close = (e) => boxRef.current && !boxRef.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  function go(t) {
    navigate(`/stack/${t.stackId}/${t.id}`);
    setQ('');
    setOpen(false);
    onNavigate?.();
  }

  function onKey(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    if (e.key === 'Enter' && results[active]) go(results[active]);
    if (e.key === 'Escape') setOpen(false);
  }

  return (
    <div className="relative" ref={boxRef}>
      <input
        type="search" value={q} placeholder="Search all topics"
        onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(0); }}
        onFocus={() => setOpen(true)} onKeyDown={onKey}
        className="w-full rounded-md border border-rule dark:border-rule-dark bg-sheet dark:bg-sheet-dark px-3 py-2 text-sm placeholder:text-ink-soft/70"
        aria-label="Search all topics"
      />
      {open && q.trim().length >= 2 && (
        <div className="absolute z-30 mt-1 w-full max-h-80 overflow-auto rounded-md border border-rule dark:border-rule-dark bg-sheet dark:bg-sheet-dark shadow-lg">
          {results.length === 0 ? (
            <p className="px-3 py-3 text-sm text-ink-soft dark:text-ink-darksoft">No topics match "{q}". Try a shorter word.</p>
          ) : (
            results.map((t, i) => (
              <button key={`${t.stackId}/${t.id}`} onMouseDown={(e) => e.preventDefault()} onClick={() => go(t)}
                className={`block w-full text-left px-3 py-2 text-sm ${i === active ? 'bg-paper dark:bg-paper-dark' : ''}`}>
                <span className="block font-medium">{t.title}</span>
                <span className="block text-xs text-ink-soft dark:text-ink-darksoft">{t.stackName}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
