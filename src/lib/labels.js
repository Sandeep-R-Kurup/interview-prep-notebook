export const LEVELS = ['basic', 'intermediate', 'advanced'];
export const LEVEL_LABEL = { basic: 'Basic', intermediate: 'Intermediate', advanced: 'Advanced' };

export const PRIORITIES = ['must', 'good', 'rare'];
export const PRIORITY_LABEL = { must: 'Must know', good: 'Good to know', rare: 'Rare' };

export const FREQUENCY_LABEL = {
  'very common': 'Asked very often',
  common: 'Asked often',
  occasional: 'Asked occasionally',
};

export const topicKey = (stackId, topicId) => `${stackId}/${topicId}`;
