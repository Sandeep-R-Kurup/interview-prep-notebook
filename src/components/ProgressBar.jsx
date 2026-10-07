export default function ProgressBar({ value, total, label, compact = false }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className={compact ? '' : 'w-full'}>
      {label && (
        <div className="flex justify-between text-xs text-ink-soft dark:text-ink-darksoft mb-1">
          <span>{label}</span>
          <span>{value} of {total} learned</span>
        </div>
      )}
      <div
        className={`${compact ? 'h-1' : 'h-1.5'} w-full rounded-full bg-rule dark:bg-rule-dark overflow-hidden`}
        role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label || 'Progress'}
      >
        <div className="h-full bg-done dark:bg-done-dark transition-[width] duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
