import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getStack } from '../data';
import TopicCard from '../components/TopicCard';
import useSwipe from '../lib/useSwipe';
import NotFound from './NotFound';

export default function TopicPage() {
  const { stackId, topicId } = useParams();
  const navigate = useNavigate();
  const stack = getStack(stackId);
  const index = stack ? stack.topics.findIndex((t) => t.id === topicId) : -1;
  const prev = index > 0 ? stack.topics[index - 1] : null;
  const next = stack && index < stack.topics.length - 1 ? stack.topics[index + 1] : null;

  // Keyboard: left/right arrows move between topics (ignored while typing).
  useEffect(() => {
    const onKey = (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowLeft' && prev) navigate(`/stack/${stackId}/${prev.id}`);
      if (e.key === 'ArrowRight' && next) navigate(`/stack/${stackId}/${next.id}`);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, stackId, navigate]);

  // Touch: swipe left for the next topic, right for the previous one.
  const swipe = useSwipe({
    onLeft: () => next && navigate(`/stack/${stackId}/${next.id}`),
    onRight: () => prev && navigate(`/stack/${stackId}/${prev.id}`),
  });

  if (index === -1) return <NotFound />;
  const topic = stack.topics[index];

  return (
    <div className="px-5 sm:px-8 py-10 min-h-full" {...swipe}>
      <TopicCard topic={topic} stackId={stack.id} stackName={stack.name} />
      <nav className="max-w-read mx-auto mt-14 pt-6 border-t border-rule dark:border-rule-dark grid grid-cols-2 gap-4" aria-label="Topic navigation">
        <div>
          {prev && (
            <Link to={`/stack/${stackId}/${prev.id}`} className="block rounded-md p-3 hover:bg-rule/40 dark:hover:bg-rule-dark/60">
              <span className="block text-xs text-ink-soft dark:text-ink-darksoft">Previous</span>
              <span className="block font-medium leading-snug">{prev.title}</span>
            </Link>
          )}
        </div>
        <div className="text-right">
          {next ? (
            <Link to={`/stack/${stackId}/${next.id}`} className="block rounded-md p-3 hover:bg-rule/40 dark:hover:bg-rule-dark/60">
              <span className="block text-xs text-ink-soft dark:text-ink-darksoft">Next</span>
              <span className="block font-medium leading-snug">{next.title}</span>
            </Link>
          ) : (
            <Link to={`/stack/${stackId}/revise`} className="block rounded-md p-3 hover:bg-rule/40 dark:hover:bg-rule-dark/60">
              <span className="block text-xs text-ink-soft dark:text-ink-darksoft">End of stack</span>
              <span className="block font-medium">Quick revise this stack</span>
            </Link>
          )}
        </div>
      </nav>
      <p className="max-w-read mx-auto mt-3 text-xs text-ink-soft dark:text-ink-darksoft text-center">
        Topic {index + 1} of {stack.topics.length}. Swipe left or right (or use the arrow keys) to move.
      </p>
    </div>
  );
}
