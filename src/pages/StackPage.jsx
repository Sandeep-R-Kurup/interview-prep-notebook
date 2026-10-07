import { Link, useParams } from 'react-router-dom';
import { getStack } from '../data';
import { useStudy } from '../context/StudyContext';
import { applyFilters, filtersActive } from '../lib/filter';
import { LEVELS, LEVEL_LABEL, topicKey } from '../lib/labels';
import { PriorityBadge, FrequencyNote } from '../components/Badges';
import ProgressBar from '../components/ProgressBar';
import NotFound from './NotFound';

export default function StackPage() {
  const { stackId } = useParams();
  const stack = getStack(stackId);
  const { learned, bookmarks, filters, resetFilters } = useStudy();
  if (!stack || stack.pending) return <NotFound />;

  const visible = applyFilters(stack.id, stack.topics, filters, learned);
  const done = stack.topics.filter((t) => learned[topicKey(stack.id, t.id)]).length;

  return (
    <div className="px-5 sm:px-8 py-12">
      <div className="max-w-read mx-auto">
        <h1 className="font-serif text-[2.4rem] font-semibold leading-tight tracking-tight">{stack.name}</h1>
        {stack.intro && <p className="mt-3 font-serif text-lg text-ink-soft dark:text-ink-darksoft leading-relaxed">{stack.intro}</p>}
        <div className="mt-5"><ProgressBar value={done} total={stack.topics.length} label="This stack" /></div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link to={`/stack/${stack.id}/cards`} className="rounded-md bg-pen text-white dark:bg-pen-dark dark:text-ink px-4 py-2 text-sm font-medium">Swipe Q&amp;A cards</Link>
          <Link to={`/stack/${stack.id}/revise`} className="rounded-md border border-rule dark:border-rule-dark px-4 py-2 text-sm font-medium">Quick revise with flip cards</Link>
          {stack.rapidFire.length > 0 && (
            <Link to={`/stack/${stack.id}/rapid`} className="rounded-md border border-rule dark:border-rule-dark px-4 py-2 text-sm font-medium">Rapid-fire Q&amp;A ({stack.rapidFire.length})</Link>
          )}
        </div>

        {filtersActive(filters) && (
          <p className="mt-6 text-sm text-ink-soft dark:text-ink-darksoft">
            Showing {visible.length} of {stack.topics.length} topics because filters are on.{' '}
            <button onClick={resetFilters} className="text-pen dark:text-pen-dark underline">Clear filters</button>
          </p>
        )}

        {LEVELS.map((level) => {
          const list = visible.filter((t) => t.level === level);
          if (!list.length) return null;
          return (
            <section key={level} className="mt-10">
              <h2 className="font-sans text-sm font-semibold text-ink-soft dark:text-ink-darksoft">{LEVEL_LABEL[level]}</h2>
              <ul className="mt-2 divide-y divide-rule dark:divide-rule-dark border-y border-rule dark:border-rule-dark">
                {list.map((t) => {
                  const k = topicKey(stack.id, t.id);
                  return (
                    <li key={t.id}>
                      <Link to={`/stack/${stack.id}/${t.id}`} className="flex gap-3 py-3 group">
                        <span aria-label={learned[k] ? 'Learned' : 'Not learned'} className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${learned[k] ? 'bg-done dark:bg-done-dark' : 'border border-ink-soft/60'}`} />
                        <span className="flex-1">
                          <span className="block font-medium group-hover:text-pen dark:group-hover:text-pen-dark">
                            {t.title}{bookmarks[k] && <span className="ml-2 text-[#C9A227]" aria-label="Saved to revise later">★</span>}
                          </span>
                          <span className="block text-sm text-ink-soft dark:text-ink-darksoft leading-snug mt-0.5">{t.summary}</span>
                          <span className="mt-1.5 flex flex-wrap items-center gap-2"><PriorityBadge priority={t.priority} /><FrequencyNote frequency={t.frequency} /></span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
