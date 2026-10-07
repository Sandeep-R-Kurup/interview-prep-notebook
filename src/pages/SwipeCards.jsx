import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { getStack } from '../data';
import { useStudy } from '../context/StudyContext';
import { applyFilters } from '../lib/filter';
import { topicKey } from '../lib/labels';
import Rich, { RichInline } from '../components/Rich';
import NotFound from './NotFound';

const SWIPE_OUT = 110; // px of drag needed to count as a swipe
const EXIT_MS = 220;

// Every interview question in a topic becomes a card, plus one "say it in 30 seconds" card.
function buildDeck(topics) {
  return topics.flatMap((t) => [
    ...t.questions.map((x, i) => ({ id: `${t.id}#${i}`, topicId: t.id, topicTitle: t.title, q: x.q, a: x.a })),
    ...(t.answer30 ? [{ id: `${t.id}#30`, topicId: t.id, topicTitle: t.title, q: `Explain "${t.title}" in 30 seconds.`, a: t.answer30, say: true }] : []),
  ]);
}

function shuffled(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SwipeCards() {
  const { stackId } = useParams();
  const [params] = useSearchParams();
  const onlyTopic = params.get('topic');
  const stack = getStack(stackId);
  const { learned, filters, toggleLearned } = useStudy();

  // Snapshot the topic list when the page opens so marking "learned" doesn't rebuild the deck.
  const topics = useMemo(() => {
    if (!stack || stack.pending) return [];
    if (onlyTopic) return stack.topics.filter((t) => t.id === onlyTopic);
    const list = applyFilters(stack.id, stack.topics, filters, learned);
    return list.length ? list : stack.topics;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stackId, onlyTopic]);
  const deck = useMemo(() => buildDeck(topics), [topics]);

  const [queue, setQueue] = useState(deck);
  const [known, setKnown] = useState({}); // card id -> true
  const [again, setAgain] = useState({}); // card id -> times sent back
  const [history, setHistory] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [drag, setDrag] = useState({ dx: 0, dy: 0, active: false });
  const [exit, setExit] = useState(null); // 'left' | 'right' while the card flies off
  const [shuffle, setShuffle] = useState(false);
  const pointer = useRef(null);

  const restart = useCallback((list = deck) => {
    setQueue(shuffle ? shuffled(list) : list);
    setKnown({});
    setAgain({});
    setHistory([]);
    setRevealed(false);
    setExit(null);
  }, [deck, shuffle]);

  useEffect(() => { restart(); }, [deck, shuffle]); // eslint-disable-line react-hooks/exhaustive-deps

  const card = queue[0];

  const decide = useCallback((dir) => {
    if (!card || exit) return;
    setExit(dir);
    setTimeout(() => {
      setHistory((h) => [...h, { queue, known, again }]);
      if (dir === 'right') {
        setKnown((k) => ({ ...k, [card.id]: true }));
        setQueue((q) => q.slice(1));
      } else {
        setAgain((a) => ({ ...a, [card.id]: (a[card.id] || 0) + 1 }));
        setQueue((q) => [...q.slice(1), q[0]]);
      }
      setRevealed(false);
      setExit(null);
      setDrag({ dx: 0, dy: 0, active: false });
    }, EXIT_MS);
  }, [card, exit, queue, known, again]);

  const undo = useCallback(() => {
    if (!history.length || exit) return;
    const prev = history[history.length - 1];
    setQueue(prev.queue);
    setKnown(prev.known);
    setAgain(prev.again);
    setHistory((h) => h.slice(0, -1));
    setRevealed(false);
  }, [history, exit]);

  useEffect(() => {
    const onKey = (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowRight') decide('right');
      else if (e.key === 'ArrowLeft') decide('left');
      else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setRevealed((r) => !r); }
      else if (e.key === 'z' || e.key === 'Backspace') undo();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [decide, undo]);

  // Pointer drag (mouse and touch). touch-action: pan-y keeps vertical scrolling inside long answers.
  const onPointerDown = (e) => {
    if (exit || e.button > 0) return;
    pointer.current = { x: e.clientX, y: e.clientY, id: e.pointerId, moved: false };
  };
  const onPointerMove = (e) => {
    const p = pointer.current;
    if (!p || p.id !== e.pointerId) return;
    const dx = e.clientX - p.x;
    if (!p.moved && Math.abs(dx) > 8) {
      p.moved = true;
      e.currentTarget.setPointerCapture?.(e.pointerId);
    }
    if (p.moved) setDrag({ dx, dy: (e.clientY - p.y) * 0.2, active: true });
  };
  const onPointerUp = (e) => {
    const p = pointer.current;
    pointer.current = null;
    if (!p) return;
    if (!p.moved) {
      if (!e.target.closest('a, button')) setRevealed((r) => !r);
      return;
    }
    if (drag.dx > SWIPE_OUT) decide('right');
    else if (drag.dx < -SWIPE_OUT) decide('left');
    else setDrag({ dx: 0, dy: 0, active: false });
  };
  const onPointerCancel = () => {
    pointer.current = null;
    setDrag({ dx: 0, dy: 0, active: false });
  };

  if (!stack || stack.pending || !deck.length) return <NotFound />;

  const total = deck.length;
  const knownCount = Object.keys(known).length;
  const backTo = onlyTopic ? `/stack/${stack.id}/${onlyTopic}` : `/stack/${stack.id}`;
  const backLabel = onlyTopic ? topics[0]?.title : stack.name;

  // Card position: follow the finger while dragging, fly off when decided.
  const dx = exit === 'right' ? window.innerWidth : exit === 'left' ? -window.innerWidth : drag.dx;
  const style = {
    transform: `translate(${dx}px, ${exit ? 0 : drag.dy}px) rotate(${dx / 18}deg)`,
    transition: drag.active && !exit ? 'none' : `transform ${EXIT_MS}ms ease-out`,
  };
  const knowOpacity = Math.max(0, Math.min(1, dx / SWIPE_OUT));
  const againOpacity = Math.max(0, Math.min(1, -dx / SWIPE_OUT));

  return (
    <div className="h-full flex flex-col px-4 sm:px-8 pt-4 pb-5 select-none">
      <div className="w-full max-w-xl mx-auto flex items-center justify-between gap-3 text-sm">
        <Link to={backTo} className="text-pen dark:text-pen-dark underline truncate">{backLabel}</Link>
        <label className="flex items-center gap-1.5 text-ink-soft dark:text-ink-darksoft shrink-0">
          <input type="checkbox" checked={shuffle} onChange={(e) => setShuffle(e.target.checked)} className="accent-[#2F5D9A]" />
          Shuffle
        </label>
      </div>

      <div className="w-full max-w-xl mx-auto mt-3">
        <div className="flex justify-between text-xs text-ink-soft dark:text-ink-darksoft tabular-nums">
          <span>{knownCount} of {total} known</span>
          <span>{queue.length} left</span>
        </div>
        <div className="mt-1.5 h-2 rounded-full bg-rule dark:bg-rule-dark overflow-hidden">
          <div className="h-full rounded-full bg-done dark:bg-done-dark transition-[width] duration-300" style={{ width: `${(knownCount / total) * 100}%` }} />
        </div>
      </div>

      {card ? (
        <>
          <div className="relative flex-1 min-h-0 w-full max-w-xl mx-auto mt-5">
            {/* The next card peeking out behind, so it feels like a deck */}
            {queue[1] && (
              <div aria-hidden className="absolute inset-0 translate-y-3 scale-[0.95] rounded-2xl border border-rule dark:border-rule-dark bg-sheet dark:bg-sheet-dark opacity-70" />
            )}

            <div
              key={card.id + (again[card.id] || 0)}
              style={style}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerCancel}
              className="swipe-card absolute inset-0 rounded-2xl border border-rule dark:border-rule-dark bg-sheet dark:bg-sheet-dark shadow-lg shadow-ink/10 flex flex-col overflow-hidden cursor-grab active:cursor-grabbing"
            >
              <span style={{ opacity: knowOpacity }} className="pointer-events-none absolute left-5 top-16 z-10 rotate-[-12deg] rounded-md border-2 border-done dark:border-done-dark px-3 py-1 text-lg font-bold text-done dark:text-done-dark bg-sheet/80 dark:bg-sheet-dark/80">KNOW IT</span>
              <span style={{ opacity: againOpacity }} className="pointer-events-none absolute right-5 top-16 z-10 rotate-[12deg] rounded-md border-2 border-[#C2412D] px-3 py-1 text-lg font-bold text-[#C2412D] bg-sheet/80 dark:bg-sheet-dark/80">AGAIN</span>

              <div className="px-5 pt-5 flex items-center justify-between gap-2 text-xs">
                <span className="rounded-full bg-pen/10 dark:bg-pen-dark/15 text-pen dark:text-pen-dark px-2.5 py-1 font-medium truncate">{card.topicTitle}</span>
                {again[card.id] > 0 && <span className="shrink-0 text-[#C2412D]">Seen {again[card.id] + 1}x</span>}
              </div>

              <div className="flex-1 overflow-y-auto px-5 sm:px-7 pb-6">
                <h2 className={`font-serif font-semibold leading-snug ${revealed ? 'mt-4 text-xl' : 'mt-[18%] text-2xl sm:text-[1.75rem]'}`}>
                  <RichInline text={card.q} />
                </h2>
                {revealed ? (
                  <div className="mt-4 pt-4 border-t border-rule dark:border-rule-dark reveal">
                    <p className="text-xs font-medium text-pen dark:text-pen-dark mb-2">{card.say ? 'Say this out loud' : 'Answer'}</p>
                    <Rich text={card.a} className="prose-read" />
                  </div>
                ) : (
                  <p className="mt-6 text-sm text-ink-soft dark:text-ink-darksoft">Answer it in your head, then tap the card to check.</p>
                )}
              </div>
            </div>
          </div>

          <div className="w-full max-w-xl mx-auto mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <button onClick={() => decide('left')} className="rounded-xl border-2 border-[#C2412D]/70 text-[#C2412D] py-3 font-semibold active:scale-95 transition-transform">
              ← Again
            </button>
            <button onClick={undo} disabled={!history.length} aria-label="Undo last swipe"
              className="h-11 w-11 rounded-full border border-rule dark:border-rule-dark text-lg disabled:opacity-30 active:scale-95 transition-transform">
              ↺
            </button>
            <button onClick={() => decide('right')} className="rounded-xl bg-done dark:bg-done-dark text-white dark:text-ink py-3 font-semibold active:scale-95 transition-transform">
              Know it →
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-ink-soft dark:text-ink-darksoft hidden sm:block">
            Space to reveal · → know it · ← again · Z to undo
          </p>
        </>
      ) : (
        <Finished stack={stack} topics={topics} deck={deck} again={again} learned={learned} toggleLearned={toggleLearned} onRestart={() => restart()}
          onRetryHard={() => restart(deck.filter((c) => again[c.id]))} backTo={backTo} />
      )}
    </div>
  );
}

function Finished({ stack, topics, deck, again, learned, toggleLearned, onRestart, onRetryHard, backTo }) {
  const hard = deck.filter((c) => again[c.id]);
  // A topic is "nailed" when none of its cards had to be sent back.
  const nailed = topics.filter((t) => !hard.some((c) => c.topicId === t.id));
  const toMark = nailed.filter((t) => !learned[topicKey(stack.id, t.id)]);

  return (
    <div className="flex-1 w-full max-w-xl mx-auto mt-8 text-center reveal">
      <p className="text-5xl" aria-hidden>🎉</p>
      <h2 className="mt-4 font-serif text-3xl font-semibold">Deck done</h2>
      <p className="mt-2 text-ink-soft dark:text-ink-darksoft">
        {deck.length - hard.length} of {deck.length} cards right first time.
        {hard.length > 0 && ` ${hard.length} needed another look.`}
      </p>

      <div className="mt-8 flex flex-col gap-3">
        {toMark.length > 0 && (
          <button onClick={() => toMark.forEach((t) => toggleLearned(topicKey(stack.id, t.id)))}
            className="rounded-xl bg-done dark:bg-done-dark text-white dark:text-ink py-3 font-semibold">
            Mark {toMark.length} topic{toMark.length > 1 ? 's' : ''} as learned
          </button>
        )}
        {hard.length > 0 && (
          <button onClick={onRetryHard} className="rounded-xl border-2 border-[#C2412D]/70 text-[#C2412D] py-3 font-semibold">
            Practise the {hard.length} tricky card{hard.length > 1 ? 's' : ''} again
          </button>
        )}
        <button onClick={onRestart} className="rounded-xl border border-rule dark:border-rule-dark py-3 font-medium">Start the whole deck again</button>
        <Link to={backTo} className="py-2 text-sm text-pen dark:text-pen-dark underline">Back</Link>
      </div>
    </div>
  );
}
