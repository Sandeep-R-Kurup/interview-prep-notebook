import CodeBlock from './CodeBlock';
import Rich, { RichInline } from './Rich';
import { LevelBadge, PriorityBadge, FrequencyNote } from './Badges';
import { Link } from 'react-router-dom';
import { useStudy } from '../context/StudyContext';
import { topicKey } from '../lib/labels';

// Numbered because the content structure is a fixed sequence (1 -> 9) on every topic.
function Section({ n, title, children }) {
  return (
    <section className="mt-10">
      <h2 className="flex items-baseline gap-3 font-sans text-sm font-semibold text-pen dark:text-pen-dark">
        <span className="tabular-nums text-ink-soft/70 dark:text-ink-darksoft/70">{n}</span>
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default function TopicCard({ topic, stackId, stackName }) {
  const { learned, bookmarks, toggleLearned, toggleBookmark } = useStudy();
  const key = topicKey(stackId, topic.id);
  const isLearned = !!learned[key];
  const isMarked = !!bookmarks[key];

  return (
    <article className="max-w-read mx-auto">
      <p className="text-sm text-ink-soft dark:text-ink-darksoft">{stackName}</p>
      <h1 className="mt-1 font-serif text-[2.1rem] sm:text-[2.6rem] font-semibold leading-[1.1] tracking-tight">{topic.title}</h1>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <LevelBadge level={topic.level} />
        <PriorityBadge priority={topic.priority} />
        <FrequencyNote frequency={topic.frequency} />
      </div>
      {topic.summary && <p className="mt-5 font-serif text-xl leading-snug text-ink-soft dark:text-ink-darksoft">{topic.summary}</p>}

      <div className="mt-6 flex flex-wrap gap-2">
        <label className={`inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-sm ${isLearned ? 'border-done text-done dark:border-done-dark dark:text-done-dark' : 'border-rule dark:border-rule-dark'}`}>
          <input type="checkbox" checked={isLearned} onChange={() => toggleLearned(key)} className="accent-[#2E7D5B]" />
          {isLearned ? 'Learned' : 'Mark as learned'}
        </label>
        <button onClick={() => toggleBookmark(key)} aria-pressed={isMarked}
          className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm ${isMarked ? 'border-[#C9A227] bg-marker/30 dark:bg-marker/15' : 'border-rule dark:border-rule-dark'}`}>
          <span aria-hidden>{isMarked ? '★' : '☆'}</span>
          {isMarked ? 'Saved to revise later' : 'Revise later'}
        </button>
      </div>

      {topic.note && (
        <div className="mt-6 rounded-md border-l-4 border-[#C9A227] bg-marker/20 dark:bg-marker/10 px-4 py-3 text-sm leading-relaxed">
          <RichInline text={topic.note} />
        </div>
      )}

      <Section n="1" title="What is it?">
        <Rich text={topic.what} className="prose-read" />
        {topic.deeper && (
          <div className="mt-5 border-l-2 border-pen/40 pl-4">
            <p className="text-xs font-medium text-pen dark:text-pen-dark mb-1">The deeper version</p>
            <Rich text={topic.deeper} className="prose-read" />
          </div>
        )}
      </Section>

      <Section n="2" title="Why do we use it?"><Rich text={topic.why} className="prose-read" /></Section>
      <Section n="3" title="Real-life analogy"><Rich text={topic.analogy} className="prose-read italic" /></Section>

      <Section n="4" title="Practical example">
        {(Array.isArray(topic.code) ? topic.code : [topic.code]).filter(Boolean).map((c, i) => (
          <CodeBlock key={i} code={c.source} lang={c.lang} title={c.title} />
        ))}
      </Section>

      <Section n="5" title="What happens, in plain words"><Rich text={topic.output} className="prose-read" /></Section>

      <Section n="6" title="Common interview questions">
        <Link to={`/stack/${stackId}/cards?topic=${topic.id}`}
          className="mb-5 flex items-center justify-between gap-3 rounded-xl bg-pen text-white dark:bg-pen-dark dark:text-ink px-4 py-3">
          <span>
            <span className="block font-semibold">Practise these as swipe cards</span>
            <span className="block text-xs opacity-80">{topic.questions.length + (topic.answer30 ? 1 : 0)} cards · swipe right if you know it</span>
          </span>
          <span aria-hidden className="text-xl">→</span>
        </Link>
        <dl className="space-y-5">
          {topic.questions.map((x, i) => (
            <div key={i}>
              <dt className="font-sans font-semibold leading-snug"><RichInline text={x.q} /></dt>
              <dd className="mt-1.5"><Rich text={x.a} className="prose-read" /></dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section n="7" title="Your 30-second answer">
        <blockquote className="rounded-lg bg-sheet dark:bg-sheet-dark border border-rule dark:border-rule-dark px-5 py-4">
          <Rich text={topic.answer30} className="prose-read" />
        </blockquote>
      </Section>

      <Section n="8" title="Common mistakes and follow-up traps">
        <ul className="space-y-3 prose-read">
          {topic.mistakes.map((m, i) => (
            <li key={i} className="pl-5 relative before:content-[''] before:absolute before:left-0 before:top-[0.75em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-ink-soft dark:before:bg-ink-darksoft">
              <RichInline text={m} />
            </li>
          ))}
        </ul>
      </Section>

      <Section n="9" title="Key takeaway">
        <p className="font-serif text-xl leading-relaxed"><span className="marker">{topic.takeaway}</span></p>
      </Section>
    </article>
  );
}
