import { LEVEL_LABEL, PRIORITY_LABEL, FREQUENCY_LABEL } from '../lib/labels';

const LEVEL_STYLE = {
  basic: 'text-done dark:text-done-dark border-done/40',
  intermediate: 'text-pen dark:text-pen-dark border-pen/40',
  advanced: 'text-[#8A3B6E] dark:text-[#E099C8] border-[#8A3B6E]/40',
};

export function LevelBadge({ level }) {
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full border ${LEVEL_STYLE[level]}`}>
      {LEVEL_LABEL[level]}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const strong = priority === 'must';
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${strong ? 'bg-ink text-white dark:bg-ink-dark dark:text-ink' : 'bg-rule dark:bg-rule-dark text-ink-soft dark:text-ink-darksoft'}`}>
      {PRIORITY_LABEL[priority]}
    </span>
  );
}

export function FrequencyNote({ frequency }) {
  return <span className="text-xs text-ink-soft dark:text-ink-darksoft">{FREQUENCY_LABEL[frequency] || frequency}</span>;
}
