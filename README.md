# Interview Prep Notebook

A personal interview study guide. React + Vite + Tailwind, no backend. Progress and bookmarks are saved in your browser (localStorage).

## Run it

```bash
npm install
npm run dev        # open the URL it prints (usually http://localhost:5173)
```

Other commands:

```bash
npm run check      # validates every topic has all 9 sections, valid tags, unique ids
npm run build      # production build into dist/
npm run preview    # serve the production build
```

Needs Node.js 18 or newer.

## Deploy free on GitHub Pages

1. Create a new repo on GitHub (public, for free Pages).
2. Push this folder to its `main` branch.
3. In the repo: Settings, Pages, Source: **GitHub Actions**.

Every push to `main` then builds and publishes the site via `.github/workflows/deploy.yml`. The URL is `https://<your-username>.github.io/<repo-name>/`.

## What's in the app

- Swipe cards: every interview question (plus the 30-second answer) per topic as a card. Tap to reveal, swipe right if you know it, left to see it again later. Per stack or per topic.
- On a phone, swipe left or right on a topic page to go to the next or previous topic.

- Sidebar with every stack. Click a stack to expand its topics (ordered Basic, Intermediate, Advanced).
- One topic per page with Previous / Next (or the left and right arrow keys).
- Search across all stacks (title, summary, body, questions).
- "Mark as learned" per topic, with progress per stack and overall.
- "Revise later" star, and a Revise later page listing them.
- Filters by level, priority, and learned / not learned (they apply to the sidebar, stack pages, and Quick Revise).
- Quick Revise: flip cards (summary on the front, 30-second answer on the back).
- Rapid-fire: one-line Q&A for a whole stack.
- Light and dark mode, mobile layout, code highlighting with a Copy button.

## Project structure

```
src/
  data/
    index.js          stack registry and sidebar order (auto-loads every file here)
    projects.js       one file per stack (23 stacks)
    react.js, javascript.js, node.js, ...
  components/         Sidebar, TopicCard, CodeBlock, ProgressBar, FlipCard, SearchBar, Badges, Rich, Layout
  pages/              Home, StackPage, TopicPage, SwipeCards, QuickRevise, RapidFire, Bookmarks, NotFound
  context/StudyContext.jsx   learned, bookmarks, filters, theme (saved to localStorage)
scripts/check-data.mjs       content validator
```

## Add a new topic

Open the stack's file, for example `src/data/react.js`, and add an object to `topics`. The order inside a level is the order you write them; levels are sorted automatically.

```js
{
  id: 'use-ref',                       // unique in this stack, used in the URL. Not 'revise', 'rapid' or 'cards'.
  title: 'useRef',
  level: 'intermediate',               // 'basic' | 'intermediate' | 'advanced'
  priority: 'must',                    // 'must' | 'good' | 'rare'
  frequency: 'common',                 // 'very common' | 'common' | 'occasional'
  summary: 'One line, shown on flip cards and lists.',
  note: 'Optional yellow warning box (version caveats, resume notes).',
  what: ['Paragraph one.', 'Paragraph two.'],        // 1. What is it?  (string or array of paragraphs)
  deeper: ['Optional deeper layer.'],                // shown under "The deeper version"
  why: 'The problem it solves.',                     // 2.
  analogy: 'Real-life comparison.',                  // 3.
  code: { lang: 'jsx', title: 'Optional', source: `...` },  // 4. or an array of these
  output: 'What happens, in plain words.',           // 5.
  questions: [{ q: 'Question?', a: 'Short answer.' }],       // 6. aim for 3-5
  answer30: 'What you say out loud in 30 seconds.',  // 7.
  mistakes: ['Mistake or follow-up trap.'],          // 8.
  takeaway: 'One line.',                             // 9.
}
```

Text tips: wrap inline code in backticks, `**bold**` for bold. Write text in double quotes so backticks don't need escaping. Inside `code.source` (a template literal), escape backticks and `${` as `` \` `` and `\${`.

Code languages: js, jsx, ts, tsx, json, bash, css, html, sql, yaml, text.

Then run `npm run check`.

## Add a new stack

1. Create `src/data/<stack-id>.js` with the same shape as `react.js` (`name`, `intro`, `topics`, `rapidFire`).
2. Make sure `<stack-id>` is listed in `ORDER` in `src/data/index.js` (it controls the sidebar order). Files are picked up automatically.
3. Run `npm run check` (or `node scripts/check-data.mjs <stack-id>.js` for one file).

## Reset progress

Progress lives in your browser under the keys `ipg-learned`, `ipg-bookmarks`, `ipg-filters`, and `ipg-theme`. Clear them in DevTools (Application, Local Storage) to start over.
