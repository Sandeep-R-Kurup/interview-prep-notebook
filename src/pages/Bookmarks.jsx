import { Link } from 'react-router-dom';
import { ALL_TOPICS } from '../data';
import { useStudy } from '../context/StudyContext';
import { topicKey } from '../lib/labels';
import { LevelBadge, PriorityBadge } from '../components/Badges';

export default function Bookmarks() {
  const { bookmarks, toggleBookmark, learned } = useStudy();
  const list = ALL_TOPICS.filter((t) => bookmarks[topicKey(t.stackId, t.id)])
    .sort((a, b) => bookmarks[topicKey(b.stackId, b.id)] - bookmarks[topicKey(a.stackId, a.id)]);

  return (
    <div className="px-5 sm:px-8 py-12">
      <div className="max-w-read mx-auto">
        <h1 className="font-serif text-[2.4rem] font-semibold leading-tight tracking-tight">Revise later</h1>
        {list.length === 0 ? (
          <p className="mt-4 font-serif text-lg text-ink-soft dark:text-ink-darksoft">
            Nothing saved yet. On any topic, press "Revise later" and it will show up here.
          </p>
        ) : (
          <ul className="mt-8 divide-y divide-rule dark:divide-rule-dark border-y border-rule dark:border-rule-dark">
            {list.map((t) => {
              const k = topicKey(t.stackId, t.id);
              return (
                <li key={k} className="flex items-start gap-3 py-4">
                  <Link to={`/stack/${t.stackId}/${t.id}`} className="flex-1 group">
                    <span className="block text-xs text-ink-soft dark:text-ink-darksoft">{t.stackName}{learned[k] ? ', learned' : ''}</span>
                    <span className="block font-medium group-hover:text-pen dark:group-hover:text-pen-dark">{t.title}</span>
                    <span className="mt-1.5 flex gap-2"><LevelBadge level={t.level} /><PriorityBadge priority={t.priority} /></span>
                  </Link>
                  <button onClick={() => toggleBookmark(k)} className="text-sm text-ink-soft dark:text-ink-darksoft hover:text-ink dark:hover:text-ink-dark underline">Remove</button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
