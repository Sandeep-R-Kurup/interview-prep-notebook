import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getStack } from '../data';
import { useStudy } from '../context/StudyContext';
import { applyFilters } from '../lib/filter';
import { topicKey } from '../lib/labels';
import FlipCard from '../components/FlipCard';
import NotFound from './NotFound';

export default function QuickRevise() {
  const { stackId } = useParams();
  const stack = getStack(stackId);
  const { learned, filters, toggleLearned } = useStudy();
  const [i, setI] = useState(0);
  const [cards, setCards] = useState([]);

  // Snapshot the deck when the page opens so marking "learned" doesn't reshuffle it.
  useEffect(() => {
    if (!stack) return;
    const list = applyFilters(stack.id, stack.topics, filters, learned);
    setCards(list.length ? list : stack.topics);
    setI(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stackId]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') setI((x) => Math.min(x + 1, cards.length - 1));
      if (e.key === 'ArrowLeft') setI((x) => Math.max(x - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cards.length]);

  if (!stack || stack.pending) return <NotFound />;
  const t = cards[i];
  if (!t) return null;
  const k = topicKey(stack.id, t.id);

  return (
    <div className="px-5 sm:px-8 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between text-sm">
          <Link to={`/stack/${stack.id}`} className="text-pen dark:text-pen-dark underline">{stack.name}</Link>
          <span className="text-ink-soft dark:text-ink-darksoft tabular-nums">Card {i + 1} of {cards.length}</span>
        </div>
        <div className="mt-6">
          <FlipCard front={t.title} sub={t.summary} back={t.answer30} resetKey={t.id} />
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button disabled={i === 0} onClick={() => setI(i - 1)} className="rounded-md border border-rule dark:border-rule-dark px-4 py-2 text-sm disabled:opacity-40">Previous card</button>
          <div className="flex gap-2">
            <button onClick={() => toggleLearned(k)} className={`rounded-md px-4 py-2 text-sm border ${learned[k] ? 'border-done text-done dark:border-done-dark dark:text-done-dark' : 'border-rule dark:border-rule-dark'}`}>
              {learned[k] ? 'Learned' : 'I know this'}
            </button>
            <Link to={`/stack/${stack.id}/${t.id}`} className="rounded-md border border-rule dark:border-rule-dark px-4 py-2 text-sm">Open full topic</Link>
          </div>
          <button disabled={i === cards.length - 1} onClick={() => setI(i + 1)} className="rounded-md bg-ink text-white dark:bg-ink-dark dark:text-ink px-4 py-2 text-sm disabled:opacity-40">Next card</button>
        </div>
      </div>
    </div>
  );
}
