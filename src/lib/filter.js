import { topicKey } from './labels';

export function applyFilters(stackId, topics, filters, learned) {
  return topics.filter((t) => {
    if (filters.level !== 'all' && t.level !== filters.level) return false;
    if (filters.priority !== 'all' && t.priority !== filters.priority) return false;
    const isLearned = !!learned[topicKey(stackId, t.id)];
    if (filters.status === 'learned' && !isLearned) return false;
    if (filters.status === 'not-learned' && isLearned) return false;
    return true;
  });
}

export const filtersActive = (f) => f.level !== 'all' || f.priority !== 'all' || f.status !== 'all';
