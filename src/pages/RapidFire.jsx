import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getStack } from '../data';
import NotFound from './NotFound';
import { RichInline } from '../components/Rich';

export default function RapidFire() {
  const { stackId } = useParams();
  const stack = getStack(stackId);
  const [shown, setShown] = useState({});
  const [all, setAll] = useState(false);
  if (!stack || stack.pending) return <NotFound />;

  return (
    <div className="px-5 sm:px-8 py-12">
      <div className="max-w-read mx-auto">
        <Link to={`/stack/${stack.id}`} className="text-sm text-pen dark:text-pen-dark underline">{stack.name}</Link>
        <h1 className="mt-2 font-serif text-[2.4rem] font-semibold leading-tight tracking-tight">Rapid-fire</h1>
        <p className="mt-2 font-serif text-lg text-ink-soft dark:text-ink-darksoft">Say the answer in your head first, then reveal it.</p>
        <button onClick={() => { setAll(!all); setShown({}); }} className="mt-5 rounded-md border border-rule dark:border-rule-dark px-4 py-2 text-sm">
          {all ? 'Hide all answers' : 'Show all answers'}
        </button>
        <ol className="mt-8 space-y-1">
          {stack.rapidFire.map((x, i) => {
            const open = all || shown[i];
            return (
              <li key={i} className="border-b border-rule dark:border-rule-dark">
                <button onClick={() => setShown((s) => ({ ...s, [i]: !s[i] }))} aria-expanded={!!open} className="w-full text-left py-3 flex gap-3">
                  <span className="tabular-nums text-sm text-ink-soft dark:text-ink-darksoft w-6 shrink-0 pt-0.5">{i + 1}</span>
                  <span className="flex-1">
                    <span className="block font-medium"><RichInline text={x.q} /></span>
                    {open && <span className="block mt-1.5 font-serif text-[1.05rem] leading-relaxed text-ink-soft dark:text-ink-darksoft"><RichInline text={x.a} /></span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
