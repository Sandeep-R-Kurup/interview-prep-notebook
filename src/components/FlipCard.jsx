import { useState, useEffect } from 'react';

// Front: topic title + one-line summary. Back: the 30-second answer.
export default function FlipCard({ front, sub, back, resetKey }) {
  const [flipped, setFlipped] = useState(false);
  useEffect(() => setFlipped(false), [resetKey]);

  return (
    <button onClick={() => setFlipped((f) => !f)} className="flip w-full text-left" aria-label={flipped ? 'Show question side' : 'Show answer side'}>
      <div className={`flip-inner min-h-[22rem] ${flipped ? 'is-flipped' : ''}`}>
        <div className="flip-face h-full min-h-[22rem] rounded-xl border border-rule dark:border-rule-dark bg-sheet dark:bg-sheet-dark p-8 flex flex-col justify-center">
          <h2 className="font-serif text-3xl font-semibold leading-tight">{front}</h2>
          <p className="mt-4 font-serif text-lg text-ink-soft dark:text-ink-darksoft">{sub}</p>
          <span className="mt-8 text-xs text-ink-soft dark:text-ink-darksoft">Click or press Space to see the 30-second answer</span>
        </div>
        <div className="flip-face flip-back rounded-xl border border-pen/50 bg-sheet dark:bg-sheet-dark p-8 overflow-auto">
          <span className="text-xs text-pen dark:text-pen-dark font-medium">Say this out loud</span>
          <p className="mt-3 font-serif text-lg leading-relaxed">{back}</p>
        </div>
      </div>
    </button>
  );
}
