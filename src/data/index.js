// The stack registry.
// To add a new stack: create src/data/<stack-id>.js (copy the shape of an existing file) and make
// sure <stack-id> is listed in ORDER below. Files are picked up automatically; stacks without a
// file show as "Being written".
const files = import.meta.glob(['./*.js', '!./index.js'], { eager: true });
const written = Object.fromEntries(
  Object.entries(files).map(([path, mod]) => [path.slice(2, -3), mod.default])
);

// Order here = order in the sidebar (your study priority order).
const ORDER = [
  ['projects', 'My Resume and Projects'],
  ['react', 'React.js'],
  ['javascript', 'JavaScript'],
  ['node', 'Node.js'],
  ['express', 'Express.js'],
  ['databases', 'Databases'],
  ['typescript', 'TypeScript'],
  ['nextjs', 'Next.js'],
  ['api', 'API Design and Communication'],
  ['redux', 'Redux and Redux-Saga'],
  ['html-css', 'HTML5, CSS3, SCSS'],
  ['ui-libraries', 'UI Libraries'],
  ['cloud', 'Cloud and DevOps'],
  ['architecture', 'Architecture'],
  ['integrations-ai', 'Integrations and AI'],
  ['testing', 'Testing and Quality'],
  ['tools', 'Tools and Workflow'],
  ['security', 'Security'],
  ['web-perf', 'Web Performance and Browser Internals'],
  ['machine-coding', 'Machine Coding Round (React)'],
  ['js-output', 'JavaScript Coding and Output Questions'],
  ['dsa', 'DSA and Problem Solving'],
  ['hr', 'HR and Behavioral'],
];

const LEVEL_RANK = { basic: 0, intermediate: 1, advanced: 2 };

export const STACKS = ORDER.map(([id, name]) => {
  const data = written[id];
  if (!data) return { id, name, topics: [], rapidFire: [], pending: true };
  // Keep topics ordered BASIC -> INTERMEDIATE -> ADVANCED, stable within a level.
  const topics = data.topics
    .map((t, i) => ({ ...t, _i: i }))
    .sort((a, b) => LEVEL_RANK[a.level] - LEVEL_RANK[b.level] || a._i - b._i);
  return { id, name: data.name || name, intro: data.intro, topics, rapidFire: data.rapidFire || [], pending: false };
});

export const getStack = (id) => STACKS.find((s) => s.id === id);

export const ALL_TOPICS = STACKS.flatMap((s) =>
  s.topics.map((t) => ({ ...t, stackId: s.id, stackName: s.name }))
);
