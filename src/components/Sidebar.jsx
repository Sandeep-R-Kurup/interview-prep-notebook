import { useState, useEffect } from 'react';
import { NavLink, useMatch, Link } from 'react-router-dom';
import { STACKS } from '../data';
import { useStudy } from '../context/StudyContext';
import { applyFilters, filtersActive } from '../lib/filter';
import { LEVELS, LEVEL_LABEL, PRIORITIES, PRIORITY_LABEL, topicKey } from '../lib/labels';
import ProgressBar from './ProgressBar';
import SearchBar from './SearchBar';

function Select({ label, value, onChange, options }) {
  return (
    <label className="block text-xs text-ink-soft dark:text-ink-darksoft">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-rule dark:border-rule-dark bg-sheet dark:bg-sheet-dark px-2 py-1.5 text-sm text-ink dark:text-ink-dark">
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}

export default function Sidebar({ onNavigate }) {
  // Sidebar lives in the layout route, so read the stack from the URL directly.
  const match = useMatch('/stack/:stackId/*');
  const stackId = match?.params.stackId;
  const { learned, filters, setFilter, resetFilters, theme, toggleTheme } = useStudy();
  const [open, setOpen] = useState(() => (stackId ? { [stackId]: true } : { projects: true }));
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { if (stackId) setOpen((o) => ({ ...o, [stackId]: true })); }, [stackId]);

  const totalTopics = STACKS.reduce((n, s) => n + s.topics.length, 0);
  const totalLearned = STACKS.reduce((n, s) => n + s.topics.filter((t) => learned[topicKey(s.id, t.id)]).length, 0);
  const active = filtersActive(filters);

  const navCls = ({ isActive }) =>
    `block rounded-md px-2 py-1.5 text-sm ${isActive ? 'bg-rule/70 dark:bg-rule-dark font-medium' : 'hover:bg-rule/40 dark:hover:bg-rule-dark/60'}`;

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 pt-5 pb-3 space-y-3 border-b border-rule dark:border-rule-dark">
        <div className="flex items-center justify-between">
          <Link to="/" onClick={onNavigate} className="font-serif text-xl font-semibold leading-none">Interview notebook</Link>
          <button onClick={toggleTheme} className="rounded-md px-2 py-1 text-xs border border-rule dark:border-rule-dark hover:bg-rule/40 dark:hover:bg-rule-dark"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
        <ProgressBar value={totalLearned} total={totalTopics} label="Overall" />
        <SearchBar onNavigate={onNavigate} />
        <nav className="flex flex-wrap gap-1 whitespace-nowrap">
          <NavLink to="/" end onClick={onNavigate} className={navCls}>Home</NavLink>
          <NavLink to="/bookmarks" onClick={onNavigate} className={navCls}>Revise later</NavLink>
          <button onClick={() => setShowFilters((s) => !s)} aria-expanded={showFilters}
            className={`rounded-md px-2 py-1.5 text-sm text-left ${active ? 'text-pen dark:text-pen-dark font-medium' : ''} hover:bg-rule/40 dark:hover:bg-rule-dark/60`}>
            Filters{active ? ' on' : ''}
          </button>
        </nav>
        {showFilters && (
          <div className="space-y-2 pb-1">
            <Select label="Level" value={filters.level} onChange={(v) => setFilter('level', v)}
              options={[['all', 'All levels'], ...LEVELS.map((l) => [l, LEVEL_LABEL[l]])]} />
            <Select label="Priority" value={filters.priority} onChange={(v) => setFilter('priority', v)}
              options={[['all', 'All priorities'], ...PRIORITIES.map((p) => [p, PRIORITY_LABEL[p]])]} />
            <Select label="Status" value={filters.status} onChange={(v) => setFilter('status', v)}
              options={[['all', 'Learned and not learned'], ['learned', 'Learned only'], ['not-learned', 'Not learned yet']]} />
            {active && <button onClick={resetFilters} className="text-xs text-pen dark:text-pen-dark underline">Clear filters</button>}
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Stacks">
        {STACKS.map((s) => {
          const done = s.topics.filter((t) => learned[topicKey(s.id, t.id)]).length;
          const visible = applyFilters(s.id, s.topics, filters, learned);
          const isOpen = !!open[s.id];
          return (
            <div key={s.id} className="mb-0.5">
              <button onClick={() => setOpen((o) => ({ ...o, [s.id]: !o[s.id] }))} aria-expanded={isOpen}
                className={`w-full rounded-md px-2 py-2 text-left hover:bg-rule/40 dark:hover:bg-rule-dark/60 ${stackId === s.id ? 'font-semibold' : ''}`}>
                <span className="flex items-center justify-between gap-2 text-sm">
                  <span className={s.pending ? 'text-ink-soft dark:text-ink-darksoft' : ''}>{s.name}</span>
                  <span className="text-xs text-ink-soft dark:text-ink-darksoft shrink-0">
                    {s.pending ? 'Being written' : `${done}/${s.topics.length}`}
                  </span>
                </span>
                {!s.pending && <span className="block mt-1.5"><ProgressBar value={done} total={s.topics.length} compact /></span>}
              </button>
              {isOpen && (
                <div className="ml-2 border-l border-rule dark:border-rule-dark pl-2 py-1">
                  {s.pending ? (
                    <p className="px-2 py-1 text-xs text-ink-soft dark:text-ink-darksoft">Not written yet. See PROGRESS.md.</p>
                  ) : (
                    <>
                      <NavLink to={`/stack/${s.id}`} end onClick={onNavigate} className={navCls}>Overview and revision modes</NavLink>
                      {visible.length === 0 && <p className="px-2 py-1 text-xs text-ink-soft dark:text-ink-darksoft">No topics match the filters.</p>}
                      {visible.map((t) => {
                        const k = topicKey(s.id, t.id);
                        return (
                          <NavLink key={t.id} to={`/stack/${s.id}/${t.id}`} onClick={onNavigate}
                            className={({ isActive }) => `flex items-start gap-2 rounded-md px-2 py-1.5 text-sm ${isActive ? 'bg-rule/70 dark:bg-rule-dark font-medium' : 'hover:bg-rule/40 dark:hover:bg-rule-dark/60'}`}>
                            <span aria-hidden className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${learned[k] ? 'bg-done dark:bg-done-dark' : 'border border-ink-soft/50'}`} />
                            <span className="leading-snug">{t.title}</span>
                          </NavLink>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
