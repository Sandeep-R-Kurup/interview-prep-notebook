import { Link } from 'react-router-dom';
import { STACKS } from '../data';
import { useStudy } from '../context/StudyContext';
import { topicKey } from '../lib/labels';
import ProgressBar from '../components/ProgressBar';

export default function Home() {
  const { learned, bookmarks } = useStudy();
  const written = STACKS.filter((s) => !s.pending);
  const total = written.reduce((n, s) => n + s.topics.length, 0);
  const done = written.reduce((n, s) => n + s.topics.filter((t) => learned[topicKey(s.id, t.id)]).length, 0);

  // Next suggested topic: first "Must know" topic not learned yet, in priority order.
  let nextUp = null;
  for (const s of written) {
    const t = s.topics.find((t) => t.priority === 'must' && !learned[topicKey(s.id, t.id)]);
    if (t) { nextUp = { s, t }; break; }
  }

  return (
    <div className="px-5 sm:px-8 py-12">
      <div className="max-w-read mx-auto">
        <h1 className="font-serif text-[2.6rem] sm:text-[3.2rem] font-semibold leading-[1.05] tracking-tight">
          Learn it simply. Say it clearly.
        </h1>
        <p className="mt-4 font-serif text-xl text-ink-soft dark:text-ink-darksoft leading-snug">
          {done} of {total} topics learned across {written.length} stacks.
          {Object.keys(bookmarks).length > 0 && ` ${Object.keys(bookmarks).length} saved to revise later.`}
        </p>
        <div className="mt-5"><ProgressBar value={done} total={total} /></div>

        {nextUp && (
          <Link to={`/stack/${nextUp.s.id}/${nextUp.t.id}`}
            className="mt-10 block rounded-xl border border-pen/40 bg-sheet dark:bg-sheet-dark px-6 py-5 hover:border-pen">
            <span className="text-sm text-pen dark:text-pen-dark font-medium">Study next</span>
            <span className="mt-1 block font-serif text-2xl font-semibold leading-tight">{nextUp.t.title}</span>
            <span className="mt-1 block text-sm text-ink-soft dark:text-ink-darksoft">{nextUp.s.name}</span>
          </Link>
        )}

        <h2 className="mt-12 font-sans text-sm font-semibold text-ink-soft dark:text-ink-darksoft">Swipe through questions</h2>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {written.map((s) => {
            const cards = s.topics.reduce((n, t) => n + t.questions.length + (t.answer30 ? 1 : 0), 0);
            return (
              <Link key={s.id} to={`/stack/${s.id}/cards`}
                className="group rounded-xl border border-rule dark:border-rule-dark bg-sheet dark:bg-sheet-dark px-4 py-4 shadow-sm hover:border-pen dark:hover:border-pen-dark active:scale-[0.98] transition">
                <span className="block font-semibold group-hover:text-pen dark:group-hover:text-pen-dark">{s.name}</span>
                <span className="mt-1 block text-sm text-ink-soft dark:text-ink-darksoft">{cards} cards · tap, then swipe</span>
              </Link>
            );
          })}
        </div>

        <h2 className="mt-14 font-sans text-sm font-semibold text-ink-soft dark:text-ink-darksoft">Stacks</h2>
        <ul className="mt-3 divide-y divide-rule dark:divide-rule-dark border-y border-rule dark:border-rule-dark">
          {STACKS.map((s) => {
            const d = s.topics.filter((t) => learned[topicKey(s.id, t.id)]).length;
            return (
              <li key={s.id}>
                {s.pending ? (
                  <div className="flex items-center justify-between py-3 text-ink-soft dark:text-ink-darksoft">
                    <span>{s.name}</span><span className="text-xs">Being written</span>
                  </div>
                ) : (
                  <Link to={`/stack/${s.id}`} className="flex items-center gap-4 py-3 hover:text-pen dark:hover:text-pen-dark">
                    <span className="flex-1 font-medium">{s.name}</span>
                    <span className="w-28 hidden sm:block"><ProgressBar value={d} total={s.topics.length} compact /></span>
                    <span className="text-xs text-ink-soft dark:text-ink-darksoft w-12 text-right">{d}/{s.topics.length}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
