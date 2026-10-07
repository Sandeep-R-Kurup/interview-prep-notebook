// Machine Coding Round (React) stack. Topics are auto-sorted Basic -> Intermediate -> Advanced by the registry.
// Every solution is a complete, working component you can paste into a fresh Vite + React app.

const machineCoding = {
  name: 'Machine Coding Round (React)',
  intro: 'Build-it-live React problems: a working solution for each, the approach to say out loud, and the follow-ups interviewers ask once it works. Practise typing each one from scratch in under 30 minutes.',
  topics: [
    {
      id: 'how-to-approach',
      title: 'How to approach a machine coding round',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Clarify, plan state, build the happy path, then polish: a working simple app beats a half-finished clever one.',
      what: [
        "In a machine coding round you get 45 to 90 minutes to build a small working feature, like a todo app, an autocomplete, or a file explorer, usually in React and often in an online editor like CodeSandbox or StackBlitz.",
        "The interviewer is not only checking whether it works. They watch how you break the problem down, how you name and shape state, how clean the components are, and how you talk while you code.",
      ],
      deeper: [
        "What is graded, roughly in order: (1) a working core feature, (2) sensible state design (minimal state, derived values computed during render), (3) component breakdown and readable code, (4) edge cases (empty input, loading, errors, double clicks), (5) accessibility and keyboard support, (6) performance only where it matters (debounce, memo, cleanup).",
        "Time plan for 60 minutes: 5 minutes clarifying requirements and writing them down as a checklist, 5 minutes sketching state and components, 30 minutes building the happy path end to end, 10 minutes on edge cases and styling, 10 minutes for walkthrough and follow-ups. Keep the app runnable at every step; commit to plain CSS or inline styles instead of fighting a UI library.",
        "Talk in decisions: 'I'll keep todos in one array and derive the filtered list, so there's only one source of truth.' Interviewers can only give credit for reasoning they hear.",
      ],
      why: "Many candidates who know React well still fail this round because they spend 40 minutes on styling or an over-engineered structure and end with nothing working. A repeatable plan prevents that.",
      analogy: "It's like a cooking competition with a timer. Judges want a complete, tasty plate first. Garnish only after the dish is done, and explain your choices as you cook.",
      code: [
        {
          lang: 'text',
          title: 'Checklist to write at the top of the file',
          source: `REQUIREMENTS (confirm with interviewer)
  [ ] Core: add, toggle, delete, filter All/Active/Done
  [ ] Persist? (localStorage)   [ ] Edit inline?   [ ] Styling expectations?
  [ ] Any API? Mock it or real endpoint?

STATE (minimal)
  todos: [{ id, text, done }]
  filter: 'all' | 'active' | 'done'
  derived (not state): visibleTodos, remainingCount

COMPONENTS
  App -> AddTodoForm, FilterBar, TodoList -> TodoItem

TIME (60 min)
  0-5   clarify + checklist
  5-10  state + component sketch
  10-40 happy path, runnable all the time
  40-50 edge cases, a11y, empty/loading/error states
  50-60 walkthrough, follow-ups`,
        },
        {
          lang: 'jsx',
          title: 'Starting skeleton: get something on screen in 2 minutes',
          source: `import { useState } from 'react';

export default function App() {
  const [items, setItems] = useState([]);

  return (
    <main style={{ maxWidth: 480, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Feature name</h1>
      {items.length === 0 ? <p>Nothing yet.</p> : <pre>{JSON.stringify(items, null, 2)}</pre>}
    </main>
  );
}`,
        },
      ],
      output: "The checklist keeps you and the interviewer aligned on scope. The skeleton renders 'Feature name' and 'Nothing yet.' immediately, so you build on a running app instead of debugging a blank screen at minute 40.",
      questions: [
        { q: 'What do interviewers grade in a machine coding round?', a: 'A working core feature first, then state design, component structure and readability, edge cases, accessibility, and finally performance. Communication runs through all of it: they credit decisions you explain out loud.' },
        { q: 'What should you ask before you start coding?', a: 'Scope questions: which features are must-have, whether to call a real API or mock it, whether data should persist, whether styling matters, and which browsers or devices count. Write the answers down as a checklist.' },
        { q: 'You are running out of time. What do you do?', a: 'Say so, finish the smallest working version of the core feature, and describe the rest in words: what you would add and how. A working subset with a clear plan beats a broken complete attempt.' },
        { q: 'Should you use a library like Redux or a UI kit?', a: 'Usually no. Plain `useState`/`useReducer` and simple CSS are faster and show your fundamentals. Ask first; some rounds forbid libraries, and setup time is wasted time.' },
        { q: 'How do you decide what goes in state?', a: 'Store the minimum that cannot be calculated from anything else. Filtered lists, counts and validity are derived during render, which avoids sync bugs between two pieces of state.' },
      ],
      answer30: "I start by clarifying requirements and writing them as a checklist, then I sketch the minimal state and the component tree. I build the happy path end to end and keep the app running the whole time. Once the core works, I handle edge cases like empty input, loading and errors, add keyboard and screen-reader support, and only then polish. I talk through my decisions as I go, because the interviewer grades reasoning as much as the result.",
      mistakes: [
        'Styling first and leaving the logic until the last 10 minutes.',
        'Duplicating state, for example storing both `todos` and `filteredTodos`, then forgetting to update one of them.',
        'Coding in silence. The interviewer cannot credit decisions you never mention.',
        "Trap: 'Can you make it production ready?' Don't rewrite everything. List what you'd add (tests, error boundary, a11y audit, persistence, virtualization for big lists) and implement the one with the most value.",
      ],
      takeaway: 'Clarify, plan minimal state, ship the happy path, then edge cases and polish, talking the whole way.',
    },

    {
      id: 'todo-app-filters',
      title: 'Todo app with filters',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'One `todos` array plus a `filter` value; the visible list and the counter are derived during render.',
      what: [
        "The classic warm-up: add a todo, mark it done, delete it, and filter by All, Active, or Done, with an 'items left' counter.",
        "Approach: keep two pieces of state, the `todos` array and the current `filter`. Everything else (the visible list, the remaining count) is calculated from them on every render.",
      ],
      deeper: [
        "Every update is immutable: add with spread, toggle with `map`, delete with `filter`. Use the updater form `setTodos(prev => ...)` so rapid clicks never read stale state.",
        "Use a stable id (`crypto.randomUUID()` or an incrementing counter), never the array index, as the key. With a filter active, the index of an item changes, and index keys would attach checkbox state to the wrong row.",
        "Wrapping the input in a `<form>` gives you Enter-to-submit for free. Trim the text and ignore empty input; that's the first edge case interviewers try.",
      ],
      why: "It tests the fundamentals in 20 minutes: controlled inputs, immutable updates, keys, derived state, and splitting a list into a parent and item component.",
      analogy: "The todo array is the full filing cabinet. The filter is just which drawer label you're reading; you never copy files into a second cabinet.",
      code: {
        lang: 'jsx',
        source: `import { useState } from 'react';

const FILTERS = {
  all: () => true,
  active: (t) => !t.done,
  done: (t) => t.done,
};

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('all');

  // Derived values: computed every render, never stored in state
  const visible = todos.filter(FILTERS[filter]);
  const remaining = todos.filter((t) => !t.done).length;

  function addTodo(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return; // ignore empty or whitespace-only input
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text: trimmed, done: false }]);
    setText('');
  }

  const toggle = (id) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id) => setTodos((prev) => prev.filter((t) => t.id !== id));
  const clearDone = () => setTodos((prev) => prev.filter((t) => !t.done));

  return (
    <main style={{ maxWidth: 420, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Todos</h1>
      <form onSubmit={addTodo}>
        <input
          aria-label="New todo"
          placeholder="What needs doing?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <div role="group" aria-label="Filter todos">
        {Object.keys(FILTERS).map((name) => (
          <button key={name} aria-pressed={filter === name} onClick={() => setFilter(name)}>
            {name}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p>No todos here.</p>
      ) : (
        <ul>
          {visible.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onToggle={toggle} onDelete={remove} />
          ))}
        </ul>
      )}

      <footer>
        <span>{remaining} {remaining === 1 ? 'item' : 'items'} left</span>
        <button onClick={clearDone} disabled={remaining === todos.length}>
          Clear completed
        </button>
      </footer>
    </main>
  );
}

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li>
      <label style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
        <input type="checkbox" checked={todo.done} onChange={() => onToggle(todo.id)} />
        {todo.text}
      </label>
      <button aria-label={'Delete ' + todo.text} onClick={() => onDelete(todo.id)}>
        x
      </button>
    </li>
  );
}`,
      },
      output: "Typing 'Buy milk' and pressing Enter adds it and clears the input; whitespace-only input is ignored. Ticking it strikes it through and the footer changes from '1 item left' to '0 items left'. With the 'active' filter on, it disappears from the list but still exists in `todos`. 'Clear completed' is disabled until something is done.",
      questions: [
        { q: 'Why not store `filteredTodos` in state?', a: 'It can be computed from `todos` and `filter`, so storing it creates two sources of truth that can drift apart. Deriving it during render is simpler and always correct; add `useMemo` only if the list is huge.' },
        { q: 'How would you add inline editing?', a: 'Keep an `editingId` in state. The item with that id renders an input pre-filled with its text; Enter or blur saves with a `map` update, Escape cancels by clearing `editingId`. Only one item edits at a time, which keeps the state simple.' },
        { q: 'How would you persist todos across reloads?', a: 'Swap `useState` for a `useLocalStorage` hook that reads the saved JSON in a lazy initializer and writes back in an effect whenever todos change. Wrap `JSON.parse` in try/catch for corrupted data.' },
        { q: 'The list has 10,000 todos and typing feels slow. What do you do?', a: "First check what re-renders: wrap `TodoItem` in `React.memo` and keep `toggle`/`remove` stable with `useCallback`, so typing in the input doesn't re-render every row. For really long lists, virtualize with a library like react-window so only visible rows mount." },
        { q: 'Why use the updater form in `toggle`?', a: 'It always receives the latest todos, even if several updates are queued in the same event or the function was captured by an older render. Reading `todos` directly can apply an update to a stale array.' },
      ],
      answer30: "I keep two pieces of state: the todos array and the current filter. The visible list and the 'items left' count are derived during render, so there's one source of truth. Updates are immutable: spread to add, map to toggle, filter to delete, all through the updater form. Each todo has a stable id used as the key, the input is inside a form so Enter submits, and I trim and ignore empty input.",
      mistakes: [
        'Using the array index as the key, which breaks once filtering or deleting changes positions.',
        'Mutating with `todos.push(...)` or `todo.done = !todo.done`, so React may not re-render.',
        'Storing filtered todos or the counter in state and letting them drift out of sync.',
        "Trap: 'Why does Enter reload the page?' A form submit does a full page navigation unless you call `e.preventDefault()`.",
      ],
      takeaway: 'Minimal state (todos + filter), everything else derived, immutable updates, stable keys.',
    },

    {
      id: 'tabs-and-accordion',
      title: 'Tabs and accordion',
      level: 'basic',
      priority: 'must',
      frequency: 'common',
      summary: 'Tabs: one active index plus ARIA roles and arrow keys. Accordion: a Set of open sections, single or multi-open.',
      what: [
        "Tabs show one panel at a time; clicking a tab switches the panel. An accordion is a list of headers that expand and collapse their content.",
        "Approach: tabs need one number in state (the active index). An accordion needs to know which sections are open; a `Set` of indexes handles both 'only one open' and 'many open' modes.",
      ],
      deeper: [
        "Accessibility is what separates a good answer. Tabs use `role='tablist'`, `role='tab'` with `aria-selected` and `aria-controls`, and `role='tabpanel'`. Only the active tab is in the tab order (`tabIndex` 0, others -1, called roving tabindex) and arrow keys move between tabs.",
        "Accordion headers are real `<button>`s with `aria-expanded`, inside a heading. Hidden content uses the `hidden` attribute, so screen readers skip it too.",
        "`useId` generates ids that are unique per component instance, so two Tabs on one page don't clash and server rendering stays consistent.",
      ],
      why: "These are reusable building blocks in every dashboard, and they're short enough that interviewers expect the accessible version, not just the click behaviour.",
      analogy: "Tabs are folder dividers in a binder: you see one section at a time. An accordion is a set of drawers: you can pull out one or several.",
      code: {
        lang: 'jsx',
        source: `import { useId, useRef, useState } from 'react';

export function Tabs({ tabs }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef([]);
  const id = useId();

  function onKeyDown(e) {
    const last = tabs.length - 1;
    const keys = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    setActive(keys[e.key]);
    tabRefs.current[keys[e.key]].focus(); // move focus with selection
  }

  return (
    <div>
      <div role="tablist" aria-label="Sections" onKeyDown={onKeyDown}>
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            ref={(el) => (tabRefs.current[i] = el)}
            role="tab"
            id={id + '-tab-' + i}
            aria-selected={i === active}
            aria-controls={id + '-panel-' + i}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, i) => (
        <div
          key={tab.label}
          role="tabpanel"
          id={id + '-panel-' + i}
          aria-labelledby={id + '-tab-' + i}
          hidden={i !== active}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}

export function Accordion({ items, allowMultiple = false }) {
  const [open, setOpen] = useState(() => new Set());
  const id = useId();

  function toggle(i) {
    setOpen((prev) => {
      const next = new Set(allowMultiple ? prev : []); // single mode: start empty
      if (prev.has(i)) next.delete(i);
      else next.add(i);
      return next; // always a new Set, so React sees the change
    });
  }

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = open.has(i);
        return (
          <div key={item.title}>
            <h3>
              <button aria-expanded={isOpen} aria-controls={id + '-section-' + i} onClick={() => toggle(i)}>
                {isOpen ? '- ' : '+ '}
                {item.title}
              </button>
            </h3>
            <div id={id + '-section-' + i} role="region" hidden={!isOpen}>
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const sections = [
    { label: 'Profile', title: 'Profile', content: 'Name and photo' },
    { label: 'Billing', title: 'Billing', content: 'Cards and invoices' },
    { label: 'Security', title: 'Security', content: 'Password and 2FA' },
  ];
  return (
    <main style={{ fontFamily: 'sans-serif' }}>
      <Tabs tabs={sections} />
      <Accordion items={sections} />
    </main>
  );
}`,
      },
      output: "Tabs start on 'Profile'. Clicking 'Billing' or pressing ArrowRight shows 'Cards and invoices' and moves focus to the Billing tab; ArrowRight on 'Security' wraps to 'Profile'. In the accordion (single mode), opening 'Billing' closes 'Profile'; clicking an open header closes it. With `allowMultiple`, several stay open.",
      questions: [
        { q: 'Why store open accordion sections in a Set, and why create a new Set on every toggle?', a: "A Set gives fast `has` checks and supports both single and multi-open modes with the same code. React compares state by reference, so mutating the old Set with `add` would not trigger a re-render; returning a new Set does." },
        { q: 'What is roving tabindex?', a: 'In a widget like a tablist, only the active item has `tabIndex={0}` and the rest have -1. Tab moves into and out of the widget in one stop, and arrow keys move between items inside it, which is what keyboard users expect.' },
        { q: 'Should inactive tab panels be unmounted or hidden?', a: 'Hidden keeps their state (like a half-filled form) and makes switching instant, but all panels mount up front. Unmounting saves work for heavy panels but loses state. Choose per case; for expensive panels, mount on first visit and keep them after.' },
        { q: 'How would you make Tabs controlled from the parent?', a: 'Accept optional `value` and `onChange` props. If `value` is provided, use it instead of internal state and call `onChange` on click; otherwise fall back to internal state. This is the controlled/uncontrolled pattern used by most component libraries.' },
        { q: 'How would you sync the active tab with the URL?', a: 'Read the tab from a query param like `?tab=billing` (for example with React Router\'s `useSearchParams`) and write it on change. Then refresh and shared links open the same tab, and the back button works.' },
      ],
      answer30: "For tabs I keep one active index and render tab buttons plus panels, with tablist, tab and tabpanel roles, aria-selected and aria-controls, and a roving tabindex so arrow keys move between tabs. For the accordion I keep a Set of open indexes; in single mode the toggle starts from an empty Set, in multi mode from a copy. I always return a new Set so React re-renders, and headers are real buttons with aria-expanded.",
      mistakes: [
        'Using clickable `<div>`s instead of buttons, which breaks keyboard and screen-reader access.',
        'Mutating the Set (`open.add(i)`) and passing the same reference back, so nothing re-renders.',
        'Hard-coding ids, so two instances on the same page get duplicate ids. Use `useId`.',
        "Trap: 'Make the accordion animate open.' `hidden` can't animate. Use a wrapper with `grid-template-rows: 0fr` to `1fr` and a CSS transition, or measure height with a ref.",
      ],
      takeaway: 'One index for tabs, a Set for accordion, real buttons, ARIA roles, and arrow keys.',
    },

    {
      id: 'star-rating',
      title: 'Star rating component',
      level: 'basic',
      priority: 'good',
      frequency: 'common',
      summary: 'A controlled component with `value` from the parent and a local `hover` state for the preview.',
      what: [
        "Show five stars. Hovering previews a rating, clicking sets it, and leaving the stars restores the saved rating. Often the follow-up is half stars or a read-only mode.",
        "Approach: the saved rating belongs to the parent (controlled `value` + `onChange`). The component only owns the temporary `hover` value. What you display is `hover || value`.",
      ],
      deeper: [
        "Making it controlled means the parent can submit, reset, or pre-fill the rating. The component is reusable in a review form, a filter, or a read-only list.",
        "Accessibility: it's semantically a radio group. Each star is a `role='radio'` button with `aria-checked` and a label like '3 stars'. Arrow keys change the value, which keyboard users expect from a radio group.",
        "Clicking the current value again resets to 0, a common requirement to allow 'no rating'. Confirm it with the interviewer.",
      ],
      why: "It's a small problem that shows whether you understand controlled components, derived display state, and event handling (hover vs click) without overcomplicating.",
      analogy: "Hovering is pointing at a price on a menu; clicking is ordering. Pointing doesn't change your order, and when you look away the order is still what you chose.",
      code: {
        lang: 'jsx',
        source: `import { useState } from 'react';

export function StarRating({ max = 5, value, onChange, readOnly = false }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value; // preview while hovering, else the saved value

  function onKeyDown(e) {
    if (readOnly) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') onChange(Math.min(max, value + 1));
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') onChange(Math.max(1, value - 1));
  }

  return (
    <div role="radiogroup" aria-label="Rating" onMouseLeave={() => setHover(0)} onKeyDown={onKeyDown}>
      {Array.from({ length: max }, (_, i) => {
        const star = i + 1;
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={star + (star === 1 ? ' star' : ' stars')}
            disabled={readOnly}
            onClick={() => onChange(star === value ? 0 : star)} // click again to clear
            onMouseEnter={() => !readOnly && setHover(star)}
            style={{
              fontSize: 28,
              background: 'none',
              border: 'none',
              cursor: readOnly ? 'default' : 'pointer',
              color: star <= shown ? '#f5a623' : '#ccc',
            }}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

export default function App() {
  const [rating, setRating] = useState(3);
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <StarRating value={rating} onChange={setRating} />
      <p>Rating: {rating} / 5</p>
      <StarRating value={4} readOnly onChange={() => {}} />
    </div>
  );
}`,
      },
      output: "It starts with 3 gold stars and 'Rating: 3 / 5'. Hovering the 5th star lights all five; moving the mouse away returns to three. Clicking the 4th sets 'Rating: 4 / 5'; clicking it again resets to 0. ArrowRight raises the value by one up to 5. The second, read-only row always shows 4 and ignores input.",
      questions: [
        { q: 'Why keep `hover` inside the component but `value` in the parent?', a: 'Hover is temporary UI state that nobody outside cares about. The selected value is real data the parent needs to save or submit, so the parent owns it and passes it down as a controlled prop.' },
        { q: 'How would you support half stars?', a: 'Render each star as two halves, or check the mouse position within the star with `e.nativeEvent.offsetX < width / 2`. Values become 0.5 steps, and the fill is drawn with a clipped overlay or a CSS linear-gradient at 50%.' },
        { q: 'How do you make it accessible?', a: "Treat it as a radio group: `role='radiogroup'`, each star `role='radio'` with `aria-checked` and a text label like '3 stars', and arrow keys to change the value. Never rely on colour alone; the label says the value." },
        { q: 'Why `hover || value` and not a separate effect to sync them?', a: 'The displayed value is derived from two existing values, so it is computed during render. An effect would add an extra render and a chance of being out of sync.' },
      ],
      answer30: "I make it a controlled component: the parent owns the rating through value and onChange. Inside, I keep only a hover state for the preview, and display hover or value. Mouse enter sets hover, mouse leave on the group clears it, and click calls onChange, with a second click on the same star resetting to zero. For accessibility it's a radio group with aria-checked, labels like '3 stars', and arrow key support.",
      mistakes: [
        'Keeping the selected rating only in local state, so the parent form cannot read or reset it.',
        'Clearing hover on each star\'s mouse leave instead of the group, which makes stars flicker between them.',
        'Using `<span>` stars with onClick, which are not focusable or announced.',
        "Trap: 'Render 10 stars.' If you hard-coded five elements, you have to rewrite. `Array.from({ length: max })` makes it a prop.",
      ],
      takeaway: 'Parent owns value, component owns hover, display `hover || value`.',
    },

    {
      id: 'image-carousel',
      title: 'Image carousel with autoplay',
      level: 'basic',
      priority: 'good',
      frequency: 'common',
      summary: 'One index with modulo wrap-around, an interval in useEffect with cleanup, and pause on hover.',
      what: [
        "Show one image at a time with previous/next buttons, dots to jump to a slide, wrap-around at the ends, and autoplay that pauses when the user hovers.",
        "Approach: state is just `index` and `paused`. Next is `(i + 1) % count`, previous is `(i - 1 + count) % count`. Autoplay is a `setInterval` inside `useEffect` that is cleared when paused or unmounted.",
      ],
      deeper: [
        "The slide animation is a flex row of all images moved with `transform: translateX(-index * 100%)` and a CSS transition. Transform animations run on the GPU and don't cause layout work.",
        "Use the updater form `setIndex(i => ...)` inside the interval. A plain `setIndex(index + 1)` would capture the index from the render that created the interval and get stuck (stale closure).",
        "Lazy-load images after the first with `loading='lazy'`, give each a real `alt`, and announce 'Slide 2 of 3' in an `aria-live` region so screen-reader users know something changed.",
      ],
      why: "It tests effects with cleanup, stale closures in timers, modulo arithmetic for wrap-around, and basic animation, all in one small component.",
      analogy: "A slide projector with a timer. The carousel holds the whole tray; the index is which slide is in front, and the timer pushes the next one unless someone has their hand on the button.",
      code: {
        lang: 'jsx',
        source: `import { useCallback, useEffect, useState } from 'react';

const IMAGES = [
  { src: 'https://picsum.photos/id/1015/800/400', alt: 'River between mountains' },
  { src: 'https://picsum.photos/id/1016/800/400', alt: 'Canyon at sunset' },
  { src: 'https://picsum.photos/id/1018/800/400', alt: 'Green hills under clouds' },
];

export function Carousel({ images, interval = 3000 }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = images.length;

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  useEffect(() => {
    if (paused || count < 2) return;
    const id = setInterval(next, interval);
    return () => clearInterval(id); // stop on pause, unmount, or prop change
  }, [paused, next, interval, count]);

  if (count === 0) return <p>No images.</p>;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Photos"
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
      }}
      style={{ position: 'relative', width: 800, maxWidth: '100%', overflow: 'hidden' }}
    >
      <div
        style={{
          display: 'flex',
          transform: 'translateX(-' + index * 100 + '%)',
          transition: 'transform 0.4s ease',
        }}
      >
        {images.map((img, i) => (
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            aria-hidden={i !== index}
            loading={i === 0 ? 'eager' : 'lazy'}
            style={{ width: '100%', flexShrink: 0 }}
          />
        ))}
      </div>

      <button aria-label="Previous slide" onClick={prev} style={{ position: 'absolute', left: 8, top: '45%' }}>
        {'<'}
      </button>
      <button aria-label="Next slide" onClick={next} style={{ position: 'absolute', right: 8, top: '45%' }}>
        {'>'}
      </button>

      <div style={{ textAlign: 'center' }}>
        {images.map((img, i) => (
          <button
            key={img.src}
            aria-label={'Go to slide ' + (i + 1)}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            style={{ width: 12, height: 12, margin: 4, borderRadius: '50%', background: i === index ? '#333' : '#bbb' }}
          />
        ))}
      </div>
      <p aria-live="polite">Slide {index + 1} of {count}</p>
    </section>
  );
}

export default function App() {
  return <Carousel images={IMAGES} interval={3000} />;
}`,
      },
      output: "It shows the river photo and 'Slide 1 of 3'. Every 3 seconds it slides to the next image, and after the third it wraps back to the first. Hovering stops autoplay; leaving restarts it. Clicking '<' on slide 1 goes to slide 3. Clicking the second dot jumps straight to 'Slide 2 of 3'.",
      questions: [
        { q: 'Why `setIndex(i => (i + 1) % count)` instead of `setIndex(index + 1)` in the interval?', a: 'The interval callback is created once per effect run and captures the `index` from that render. With the plain form it keeps setting the same value (a stale closure). The updater form always reads the latest index.' },
        { q: 'Why must the effect return a cleanup function?', a: 'Without `clearInterval`, every pause/unpause or re-run would start another interval, so slides would speed up, and the timer would keep running after unmount. The cleanup stops the old one before a new one starts.' },
        { q: 'How would you add swipe support on mobile?', a: 'Record `touches[0].clientX` on `touchstart`, compare it on `touchend`, and call `next` or `prev` if the distance passes a threshold like 50px. Pause autoplay while the finger is down.' },
        { q: 'How would you make an infinite loop without the jump back from last to first?', a: 'Clone the first slide at the end. When the transition onto the clone finishes (`transitionend`), switch to the real first slide with the transition turned off, so the jump is invisible.' },
        { q: 'What accessibility concerns does autoplay create?', a: "Moving content can distract users and is hard to read. Provide a visible pause button, pause on hover and focus, respect `prefers-reduced-motion`, and announce slide changes politely with `aria-live`." },
      ],
      answer30: "State is the current index and a paused flag. Next and previous use modulo so they wrap around. Autoplay is a setInterval in useEffect that depends on paused, and its cleanup clears the interval, so hover-to-pause and unmount both stop it. I use the updater form inside the interval to avoid a stale closure. The slide effect is a flex row moved with translateX and a CSS transition, and images have alt text with an aria-live 'Slide 2 of 3' message.",
      mistakes: [
        'Forgetting the interval cleanup, so slides speed up after each pause/unpause.',
        'Using `index - 1` without `+ count`, which gives -1 on the first slide because `%` keeps the sign in JavaScript.',
        'Autoplaying with no way to pause, which fails accessibility guidelines.',
        "Trap: 'What if images is empty?' `% 0` gives NaN. Guard with an early return and skip the interval when there are fewer than two images.",
      ],
      takeaway: 'Index + modulo, interval in an effect with cleanup, updater form, pause on hover.',
    },

    {
      id: 'custom-hooks',
      title: 'Custom hooks: useDebounce, useFetch, useLocalStorage',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Pull reusable stateful logic into `use...` functions; each call gets its own state.',
      note: "On your resume: the Octagnt React dashboard polls the bulk-upload status endpoint. A polling hook follows the same pattern as useFetch (timer in an effect, abort and clear on cleanup, stop when the batch finishes). Only call it your own work if you wrote that part.",
      what: [
        "A custom hook is a function whose name starts with `use` and that calls other hooks. It lets you reuse stateful logic, like 'debounce this value' or 'fetch this URL', across components.",
        "Interviewers often say 'now extract that into a hook'. The three classics are `useDebounce` (delay a fast-changing value), `useFetch` (data, loading, error for a URL), and `useLocalStorage` (state that survives reloads).",
      ],
      deeper: [
        "Hooks share logic, not state. Two components calling `useFetch` each get their own independent state. To share data, lift it up, use context, or use a cache library like TanStack Query.",
        "`useFetch` must handle three things beginners miss: a non-2xx response is not a rejection in `fetch` (check `res.ok`), the request must be aborted when the URL changes or the component unmounts, and an `AbortError` must not be shown as an error.",
        "`useLocalStorage` reads in a lazy initializer (once, not every render) and writes in an effect. `JSON.parse` and `setItem` can throw (corrupted data, storage full, some private modes), so both are in try/catch.",
      ],
      why: "Without hooks, the same effect-plus-state code is copied into every component and each copy gets its own bugs. One tested hook fixes them everywhere.",
      analogy: "A custom hook is a recipe card. Every cook who follows it gets their own dish (state); they don't share one plate.",
      code: {
        lang: 'jsx',
        source: `import { useCallback, useEffect, useState } from 'react';

export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id); // a new value cancels the pending update
  }, [value, delay]);
  return debounced;
}

export function useFetch(url) {
  const [state, setState] = useState({ data: null, error: null, loading: Boolean(url) });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('HTTP ' + res.status); // fetch does not reject on 404/500
        return res.json();
      })
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((err) => {
        if (err.name === 'AbortError') return; // URL changed or unmounted: ignore
        setState({ data: null, error: err, loading: false });
      });

    return () => controller.abort();
  }, [url, reloadKey]);

  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);
  return { ...state, refetch };
}

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue; // corrupted JSON or storage blocked
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full or unavailable: keep working in memory
    }
  }, [key, value]);

  return [value, setValue];
}

// Using all three together
export default function UserSearch() {
  const [query, setQuery] = useLocalStorage('user-search', '');
  const debouncedQuery = useDebounce(query.trim(), 400);
  const url = debouncedQuery
    ? 'https://dummyjson.com/users/search?q=' + encodeURIComponent(debouncedQuery)
    : null;
  const { data, error, loading, refetch } = useFetch(url);

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <input aria-label="Search users" value={query} onChange={(e) => setQuery(e.target.value)} />
      {loading && <p>Loading...</p>}
      {error && (
        <p role="alert">
          {error.message} <button onClick={refetch}>Retry</button>
        </p>
      )}
      {data && !loading && (
        <ul>
          {data.users.map((u) => (
            <li key={u.id}>{u.firstName} {u.lastName}</li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
      },
      output: "Typing 'emi' quickly fires one request 400 ms after the last keystroke, not one per letter. While it runs, 'Loading...' shows; then matching users are listed. A 500 response shows 'HTTP 500' with a Retry button. Reloading the page restores the last query from localStorage and searches it again.",
      questions: [
        { q: 'Do two components that call the same custom hook share state?', a: 'No. Each call has its own state and effects, exactly as if the hook code were pasted into each component. To share data, lift state up, use context, or use a cache like TanStack Query.' },
        { q: 'Why check `res.ok` in useFetch?', a: '`fetch` only rejects on network failure or abort. A 404 or 500 still resolves, so without checking `res.ok` you would try to parse an error page as data and show it as success.' },
        { q: 'What happens if you pass an options object to useFetch and put it in the dependency array?', a: 'A new object literal is created every render, so the effect re-runs every render and can loop forever. Fix it by having the caller memoize the object with `useMemo`, depending on primitive values, or serializing it with `JSON.stringify` for the dependency.' },
        { q: 'How would you sync useLocalStorage across browser tabs?', a: "Listen to the `storage` event on window, which fires in other tabs when a key changes. If `e.key` matches, parse `e.newValue` and update state. Remove the listener in the effect cleanup." },
        { q: 'When would you not write your own useFetch?', a: 'In a real app with caching, retries, deduplication, background refresh, and pagination needs. TanStack Query or SWR solve those well. In an interview, writing useFetch shows you understand what those libraries do.' },
      ],
      answer30: "A custom hook is a function starting with use that calls other hooks, so I can reuse stateful logic. useDebounce stores the value after a setTimeout and clears the timer when the value changes. useFetch tracks data, loading and error, checks res.ok because fetch doesn't reject on HTTP errors, and aborts the request in the cleanup so a stale response never overwrites a newer one. useLocalStorage reads once in a lazy initializer and writes in an effect, with try/catch around parse and setItem.",
      mistakes: [
        "Calling hooks conditionally or inside loops. Hooks must be called in the same order every render.",
        'Forgetting to clear the timeout in useDebounce, so every keystroke still fires.',
        'Reading localStorage on every render with `useState(JSON.parse(localStorage.getItem(k)))` instead of a lazy initializer.',
        "Trap: 'What does useFetch do under React StrictMode in development?' The effect mounts, cleans up, and mounts again, so the first request is aborted and a second one is sent. That's expected and harmless because of the abort.",
      ],
      takeaway: 'Custom hooks reuse logic, not state; handle cleanup, `res.ok`, and abort errors.',
    },

    {
      id: 'debounced-autocomplete',
      title: 'Debounced search / autocomplete',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Debounce the input, abort stale requests, cache results, and support arrow keys with combobox ARIA.',
      what: [
        "Build a search box that suggests results from an API as you type, like a product or user search. It should not call the API on every keystroke, must never show results for an old query, and should be usable with the keyboard.",
        "Approach: one effect keyed on `query`. It waits 300 ms (debounce), then fetches with an `AbortController`. The cleanup clears the timer and aborts the request, so only the latest query can update state.",
      ],
      deeper: [
        "The race condition: you type 'ph', then 'phone'. If the 'ph' response arrives last, it overwrites the 'phone' results. Aborting in the effect cleanup cancels the old request, and the `signal.aborted` check after `await` covers a response that resolved just before the abort.",
        "A `Map` cache keyed by query makes backspacing instant and saves API calls. In production you would cap its size or add expiry.",
        "Keyboard support: ArrowDown/ArrowUp move an `activeIndex`, Enter selects, Escape closes. The input has `role='combobox'`, `aria-expanded`, `aria-controls`, and `aria-activedescendant` pointing at the highlighted option, so focus stays in the input while screen readers announce the option.",
        "`onMouseDown={e => e.preventDefault()}` on options stops the input from blurring before the click registers. Without it, `onBlur` closes the list and the click lands on nothing.",
      ],
      why: "It's probably the most asked React machine coding problem because it combines debouncing, async effects, race conditions, caching, and accessibility in about 80 lines.",
      analogy: "Like a waiter who waits until you stop changing your mind before sending the order to the kitchen, and who throws away the dish if you changed the order while it was cooking.",
      code: {
        lang: 'jsx',
        source: `import { useEffect, useId, useState } from 'react';

const cache = new Map(); // query -> results, shared by all instances

async function searchProducts(query, signal) {
  if (cache.has(query)) return cache.get(query);
  const res = await fetch(
    'https://dummyjson.com/products/search?limit=8&q=' + encodeURIComponent(query),
    { signal }
  );
  if (!res.ok) throw new Error('Request failed: ' + res.status);
  const data = await res.json();
  cache.set(query, data.products);
  return data.products;
}

function Highlight({ text, query }) {
  const start = text.toLowerCase().indexOf(query.toLowerCase());
  if (!query || start === -1) return text;
  const end = start + query.length;
  return (
    <>
      {text.slice(0, start)}
      <mark>{text.slice(start, end)}</mark>
      {text.slice(end)}
    </>
  );
}

export default function Autocomplete({ onSelect = () => {} }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [activeIndex, setActiveIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const listId = useId();
  const trimmed = query.trim();

  useEffect(() => {
    if (trimmed.length < 2) {
      setResults([]);
      setStatus('idle');
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setStatus('loading');
      try {
        const items = await searchProducts(trimmed, controller.signal);
        if (controller.signal.aborted) return; // a newer query took over
        setResults(items);
        setActiveIndex(-1);
        setStatus('success');
      } catch (err) {
        if (err.name === 'AbortError') return;
        setStatus('error');
      }
    }, 300);

    return () => {
      clearTimeout(timer); // debounce: cancel the pending search
      controller.abort(); // race: cancel the in-flight request
    };
  }, [trimmed]);

  function choose(item) {
    setQuery(item.title);
    setOpen(false);
    onSelect(item);
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') return setOpen(false);
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      choose(results[activeIndex]);
    }
  }

  const showList = open && trimmed.length >= 2;

  return (
    <div style={{ position: 'relative', width: 320, fontFamily: 'sans-serif' }}>
      <input
        role="combobox"
        aria-label="Search products"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={activeIndex >= 0 ? listId + '-' + activeIndex : undefined}
        placeholder="Search products"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
        onBlur={() => setOpen(false)}
        style={{ width: '100%' }}
      />
      {showList && (
        <ul id={listId} role="listbox" style={{ position: 'absolute', width: '100%', margin: 0, padding: 0, listStyle: 'none', border: '1px solid #ccc', background: '#fff' }}>
          {status === 'loading' && <li>Loading...</li>}
          {status === 'error' && <li role="alert">Something went wrong. Keep typing to retry.</li>}
          {status === 'success' && results.length === 0 && <li>No results</li>}
          {status === 'success' &&
            results.map((item, i) => (
              <li
                key={item.id}
                id={listId + '-' + i}
                role="option"
                aria-selected={i === activeIndex}
                onMouseDown={(e) => e.preventDefault()} // keep focus in the input
                onClick={() => choose(item)}
                style={{ padding: 6, cursor: 'pointer', background: i === activeIndex ? '#eef' : '#fff' }}
              >
                <Highlight text={item.title} query={trimmed} />
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}`,
      },
      output: "Typing 'pho' quickly sends one request about 300 ms after the last key. 'Loading...' shows, then up to 8 products with 'pho' highlighted. ArrowDown highlights the first, Enter fills the input with its title and closes the list. If an older request is slow, it is aborted and never overwrites newer results. Deleting back to 'pho' later is instant from the cache.",
      questions: [
        { q: 'What is the race condition in autocomplete and how do you prevent it?', a: "Responses can arrive out of order, so results for an old query ('ph') can overwrite results for the current one ('phone'). Abort the previous request in the effect cleanup with AbortController, and check `signal.aborted` (or compare a request id) before setting state." },
        { q: 'Debounce vs throttle for a search box?', a: 'Debounce: wait until the user pauses, then send one request. Throttle: send at most one request per interval while they type. Search boxes usually debounce because only the final query matters.' },
        { q: 'Why `onMouseDown` preventDefault on the options?', a: "Mouse down on an option blurs the input before click fires. The input's onBlur closes the list, so the click lands on nothing. Preventing the default on mousedown keeps focus in the input, so the click works." },
        { q: 'What ARIA attributes does an accessible autocomplete need?', a: "The input gets `role='combobox'`, `aria-expanded`, `aria-controls` pointing at the listbox, and `aria-activedescendant` for the highlighted option. The list is `role='listbox'` with `role='option'` items and `aria-selected`." },
        { q: 'How would you improve the cache?', a: 'Limit it to the last N queries (an LRU using Map insertion order), add a time-to-live so data refreshes, and share it across components. In a real app, TanStack Query gives caching, deduplication and staleness out of the box.' },
      ],
      answer30: "I keep the query in state and run one effect keyed on the trimmed query. Inside, a 300 ms setTimeout debounces, then I fetch with an AbortController signal. The cleanup clears the timer and aborts the request, so only the latest query can ever set results, which solves the out-of-order race. I cache results in a Map, handle loading, error and empty states, and support ArrowUp, ArrowDown, Enter and Escape with combobox and listbox ARIA.",
      mistakes: [
        'Calling the API on every keystroke with no debounce.',
        'Ignoring the race condition, so slow old responses overwrite newer results.',
        "Showing an AbortError to the user as 'Something went wrong'.",
        "Trap: 'Why use `lodash.debounce` inside the component?' If you create it in the render body, you get a new debounced function every render and it never actually debounces. Create it once with `useMemo`/`useRef`, or debounce inside an effect as shown.",
      ],
      takeaway: 'Debounce in the effect, abort in the cleanup, cache by query, and make it keyboard-friendly.',
    },

    {
      id: 'infinite-scroll',
      title: 'Infinite scroll and pagination',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Watch a sentinel element with IntersectionObserver and load the next page when it becomes visible.',
      what: [
        "Infinite scroll loads more items when the user nears the bottom of the list, like a social feed. Pagination splits data into numbered pages or a 'Load more' button.",
        "Approach: state holds `items`, `page`, `hasMore`, `loading`, and `error`. An empty `<div>` (the sentinel) sits after the list. An IntersectionObserver watches it; when it becomes visible, increment `page`, and an effect fetches that page and appends the results.",
      ],
      deeper: [
        "IntersectionObserver is better than a scroll listener: the browser tells you when the element enters the viewport, with no work on every scroll event and no `getBoundingClientRect` math. `rootMargin: '200px'` starts loading before the user actually hits the bottom.",
        "Avoid duplicate loads: only attach the observer when not loading, there is more data, and there's no error. Each new observer fires once immediately if the sentinel is already visible, which naturally keeps loading until the screen is full.",
        "Offset pagination (`skip`/`limit`) is simple but can show duplicates or skip items if rows are inserted while scrolling. Cursor pagination (`after=lastId`) is stable, which is why most real feeds use it.",
        "With thousands of items, the DOM grows huge. Virtualization (react-window, TanStack Virtual) renders only the visible rows.",
      ],
      why: "It's a real feature in most products and tests effects, cleanup, refs, browser APIs, and pagination design together.",
      analogy: "A trip wire near the end of the hallway. When you step on it, someone quietly adds another stretch of hallway before you reach the wall.",
      code: {
        lang: 'jsx',
        source: `import { useEffect, useRef, useState } from 'react';

const PAGE_SIZE = 20;

async function fetchPage(page, signal) {
  const url =
    'https://dummyjson.com/products?select=title,price&limit=' + PAGE_SIZE + '&skip=' + page * PAGE_SIZE;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error('Request failed: ' + res.status);
  return res.json(); // { products, total, skip, limit }
}

export default function ProductFeed() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true); // page 0 starts loading on mount
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0); // bump to retry the same page
  const sentinelRef = useRef(null);

  // 1. Fetch whenever the page (or a retry) changes
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetchPage(page, controller.signal)
      .then((data) => {
        setItems((prev) => [...prev, ...data.products]);
        setHasMore(data.skip + data.products.length < data.total);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort(); // StrictMode double-run and unmount safe
  }, [page, attempt]);

  // 2. Observe the sentinel only when another page can be loaded
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || loading || !hasMore || error) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setPage((p) => p + 1);
      },
      { rootMargin: '200px' } // start loading a bit before the bottom
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loading, hasMore, error]);

  return (
    <main style={{ maxWidth: 480, margin: '0 auto', fontFamily: 'sans-serif' }}>
      <ul>
        {items.map((p) => (
          <li key={p.id} style={{ padding: '24px 0', borderBottom: '1px solid #eee' }}>
            {p.title}: \${p.price}
          </li>
        ))}
      </ul>
      {loading && <p>Loading...</p>}
      {error && (
        <p role="alert">
          {error} <button onClick={() => setAttempt((a) => a + 1)}>Retry</button>
        </p>
      )}
      {!hasMore && <p>You have reached the end.</p>}
      <div ref={sentinelRef} aria-hidden="true" style={{ height: 1 }} />
    </main>
  );
}`,
      },
      output: "The first 20 products load. As you scroll within 200px of the bottom, the next 20 are appended (skip=20, then 40, ...). Only one request is in flight at a time. If a request fails, 'Retry' refetches the same page. When `skip + products.length` reaches `total`, the observer stops and 'You have reached the end.' shows.",
      questions: [
        { q: 'Why IntersectionObserver instead of a scroll event listener?', a: 'A scroll listener fires dozens of times per second and needs manual position math, which costs performance. IntersectionObserver lets the browser tell you once when the sentinel becomes visible, with no work during scrolling.' },
        { q: 'How do you prevent the same page from loading twice?', a: 'Only attach the observer when not loading, there are more items, and there is no error. In the fetch effect, abort on cleanup so StrictMode double-mounting or unmounting never appends the same page twice.' },
        { q: 'Offset vs cursor pagination?', a: 'Offset (`skip=40&limit=20`) is simple and allows jumping to page N, but new inserts shift rows, causing duplicates or gaps. Cursor (`after=<lastId>`) continues from a stable point, so it is correct for live feeds, but you cannot jump to an arbitrary page.' },
        { q: 'The list now has 5,000 items and scrolling is slow. What next?', a: 'Virtualize it with react-window or TanStack Virtual so only the visible rows are in the DOM. Also make sure rows are memoized and keys are stable ids.' },
        { q: 'How do you restore scroll position when the user comes back from a detail page?', a: 'Keep the loaded items and scroll position outside the component, in a cache (like TanStack Query\'s infinite query) or in history state, and restore them on mount. Otherwise the list refetches from page one and the user loses their place.' },
      ],
      answer30: "State holds items, page, hasMore, loading and error. One effect fetches whenever page changes, appends the results, and computes hasMore from the total; it aborts on cleanup. A second effect attaches an IntersectionObserver to an empty sentinel div below the list, only when not loading and there's more to load, and increments page when the sentinel is visible, with a rootMargin so loading starts early. I show loading, error with retry, and end-of-list states.",
      mistakes: [
        'Using a raw scroll listener without throttling, which runs on every frame.',
        'Not guarding with `loading`, so the observer fires several times and the same page is fetched repeatedly.',
        'Replacing items instead of appending, or appending without checking duplicates when the API can shift.',
        "Trap: 'What if the first page doesn't fill the screen?' The sentinel is still visible, so the observer fires again after loading finishes and keeps loading until the screen fills or `hasMore` is false.",
      ],
      takeaway: 'Sentinel + IntersectionObserver, guard with loading/hasMore, abort on cleanup, virtualize huge lists.',
    },

    {
      id: 'accessible-modal',
      title: 'Accessible modal dialog',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Portal to body, close on Escape and backdrop click, trap focus inside, and restore focus on close.',
      what: [
        "A modal is a dialog box that sits on top of the page and blocks interaction with everything behind it until it's closed, like a 'Delete account?' confirmation.",
        "Approach: the parent owns `open`. The Modal renders into `document.body` with `createPortal`, so no parent's `overflow: hidden` or `z-index` can clip it. An effect, active only while open, moves focus in, listens for Escape and Tab, locks body scroll, and restores focus when it closes.",
      ],
      deeper: [
        "The four accessibility requirements interviewers check: `role='dialog'` with `aria-modal='true'` and `aria-labelledby` pointing at the title; focus moves into the dialog on open; Tab and Shift+Tab are trapped inside; focus returns to the button that opened it on close.",
        "The `onClose` prop is often an inline arrow that changes every render. Putting it in the effect's dependencies would re-run the effect on every parent render, stealing focus. Storing it in a ref keeps the effect tied only to `open`.",
        "Backdrop clicks use `onMouseDown` with `e.target === e.currentTarget`, so a click that starts inside the dialog (like selecting text) and ends on the backdrop doesn't close it.",
        "Modern alternative: the native `<dialog>` element with `showModal()` gives a top layer, a backdrop, Escape to close, and makes the rest of the page inert. It is supported in all current major browsers. Interviewers often still want the manual version to see you understand focus management.",
      ],
      why: "Modals are everywhere, and a broken one traps keyboard users or lets them tab into the page behind. It's a direct test of whether you think about accessibility, portals and effect cleanup.",
      analogy: "A modal is a receptionist who stands in front of the office door. You must deal with them first, you can't walk around them, and when you're done they send you back to exactly where you came from.",
      code: {
        lang: 'jsx',
        source: `import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({ open, onClose, title, children }) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();

  useEffect(() => {
    onCloseRef.current = onClose; // always call the latest onClose
  });

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement;
    const dialog = dialogRef.current;
    (dialog.querySelector(FOCUSABLE) ?? dialog).focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; // lock background scroll

    function onKeyDown(e) {
      if (e.key === 'Escape') return onCloseRef.current();
      if (e.key !== 'Tab') return;
      const nodes = dialog.querySelectorAll(FOCUSABLE);
      if (nodes.length === 0) return e.preventDefault();
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus(); // give focus back to the opener
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose(); // backdrop only, not the dialog
      }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center' }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 300 }}
      >
        <h2 id={titleId}>{title}</h2>
        {children}
      </div>
    </div>,
    document.body
  );
}

export default function App() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  return (
    <main style={{ fontFamily: 'sans-serif' }}>
      <button onClick={() => setOpen(true)}>Delete account</button>
      <p>{message}</p>
      <Modal open={open} onClose={() => setOpen(false)} title="Delete account?">
        <p>This cannot be undone.</p>
        <button onClick={() => setOpen(false)}>Cancel</button>
        <button
          onClick={() => {
            setMessage('Account deleted');
            setOpen(false);
          }}
        >
          Delete
        </button>
      </Modal>
    </main>
  );
}`,
      },
      output: "Clicking 'Delete account' opens the dialog over a dark backdrop, focuses 'Cancel', and stops the page behind from scrolling. Tab moves Cancel -> Delete -> back to Cancel; Shift+Tab wraps the other way. Escape, a backdrop click, or Cancel closes it and focus returns to 'Delete account'. 'Delete' closes it and shows 'Account deleted'.",
      questions: [
        { q: 'Why render a modal through a portal?', a: "A portal puts the DOM node under `document.body`, so ancestors with `overflow: hidden`, `transform`, or a low `z-index` can't clip or hide it. React events still bubble through the React tree, so handlers in parents keep working." },
        { q: 'What makes a modal accessible?', a: "`role='dialog'`, `aria-modal='true'`, and `aria-labelledby` for the title; focus moves inside on open; Tab is trapped inside; Escape closes it; focus returns to the trigger on close; and the background can't be scrolled or reached." },
        { q: 'Why store onClose in a ref?', a: 'Parents usually pass an inline arrow, which is a new function every render. If it were an effect dependency, the effect would re-run on every parent render and keep moving focus. A ref always holds the latest function while the effect depends only on `open`.' },
        { q: 'Would you use the native <dialog> element?', a: "Yes in production: `showModal()` gives a top layer, a `::backdrop`, Escape handling, and makes the rest of the page inert. It's supported in all current major browsers. I'd still add `aria-labelledby` and restore focus if the browser doesn't." },
        { q: 'How would you build a confirm() style API, like `await confirm(\"Delete?\")`?', a: 'Create a provider that renders one Modal and exposes a function returning a Promise. The function stores the resolve callback in state or a ref and opens the modal; the buttons call resolve(true) or resolve(false) and close it.' },
      ],
      answer30: "The parent owns the open state. The modal renders through createPortal into document.body so nothing clips it, with role dialog, aria-modal and aria-labelledby. While open, an effect saves the previously focused element, focuses the first focusable element, locks body scroll, closes on Escape, and traps Tab by wrapping from last to first. The cleanup removes the listener, restores scroll and returns focus to the trigger. Backdrop clicks close it only when the target is the backdrop itself.",
      mistakes: [
        'No focus management, so keyboard users tab into the page behind the modal.',
        'Closing on any click inside the overlay, including clicks inside the dialog, because of event bubbling.',
        'Forgetting to remove the keydown listener or restore body overflow on close.',
        "Trap: 'Does a portal stop click events reaching the parent?' No. React events bubble through the React component tree, not the DOM tree, so a parent `onClick` still fires for clicks inside the portal.",
      ],
      takeaway: 'Portal, dialog ARIA, focus in, focus trapped, Escape closes, focus restored.',
    },

    {
      id: 'form-validation',
      title: 'Form with validation',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'One `values` object, errors derived by a pure `validate` function, shown after blur or a submit attempt.',
      what: [
        "Build a signup form (name, email, password, confirm password, accept terms) that shows helpful errors, blocks invalid submits, disables the button while submitting, and shows server errors like 'Email already registered'.",
        "Approach: keep all field values in one object and update them with one `handleChange` using the input's `name`. Errors are not state: a pure `validate(values)` function computes them every render. A `touched` map decides when to show each error, so users aren't shouted at before they type.",
      ],
      deeper: [
        "Show an error when the field is touched (blurred once) or after the first submit attempt. That's the UX most interviewers expect: no red text on page load, but full feedback once the user tries.",
        "Accessibility: every input has a `<label htmlFor>`, invalid inputs get `aria-invalid`, and the error text is linked with `aria-describedby` so screen readers read it with the field. On a failed submit, focus the first invalid field.",
        "Client validation is for UX only; the server must validate again. Server errors (409 email taken) go into separate state and are shown near the submit button or the related field.",
        "In a real app, React Hook Form plus a schema library like Zod gives the same behaviour with less code and fewer re-renders, because it uses uncontrolled inputs. Writing it by hand shows you understand what those libraries do.",
      ],
      why: "Every product has forms. This problem shows controlled inputs, derived state, async submit handling, and accessibility in one go.",
      analogy: "A pure `validate` function is a checklist an inspector runs over the whole form each time. `touched` decides whether the inspector speaks up yet or politely waits until you've finished with that box.",
      code: {
        lang: 'jsx',
        source: `import { useState } from 'react';

const initialValues = { name: '', email: '', password: '', confirm: '', terms: false };

// Pure function: easy to unit test, runs on every render
export function validate(v) {
  const errors = {};
  if (!v.name.trim()) errors.name = 'Name is required';
  if (!v.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v.email)) errors.email = 'Enter a valid email';
  if (v.password.length < 8) errors.password = 'Use at least 8 characters';
  else if (!/\\d/.test(v.password) || !/[a-z]/i.test(v.password)) errors.password = 'Use letters and numbers';
  if (v.confirm !== v.password) errors.confirm = 'Passwords do not match';
  if (!v.terms) errors.terms = 'Please accept the terms';
  return errors;
}

// Fake API so the example runs anywhere
function registerUser(values) {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (values.email === 'taken@example.com') reject(new Error('Email already registered'));
      else resolve({ id: 1 });
    }, 800)
  );
}

function Field({ label, name, type = 'text', value, error, onChange, onBlur }) {
  const id = 'field-' + name;
  return (
    <div style={{ marginBottom: 12 }}>
      <label htmlFor={id}>{label}</label>
      <br />
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? id + '-error' : undefined}
      />
      {error && (
        <p id={id + '-error'} style={{ color: 'crimson', margin: 0 }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function SignupForm() {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | submitting | success
  const [serverError, setServerError] = useState('');

  const errors = validate(values); // derived, never stored
  const visibleError = (field) => ((touched[field] || attempted) ? errors[field] : undefined);

  function handleChange(e) {
    const { name, type, value, checked } = e.target;
    setValues((v) => ({ ...v, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleBlur(e) {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setAttempted(true);
    setServerError('');
    const firstInvalid = Object.keys(errors)[0];
    if (firstInvalid) {
      e.currentTarget.elements[firstInvalid].focus(); // take the user to the problem
      return;
    }
    setStatus('submitting');
    try {
      await registerUser(values);
      setStatus('success');
    } catch (err) {
      setServerError(err.message);
      setStatus('idle');
    }
  }

  if (status === 'success') return <p>Welcome, {values.name.trim()}!</p>;

  const field = { onChange: handleChange, onBlur: handleBlur };
  return (
    <form onSubmit={handleSubmit} noValidate style={{ fontFamily: 'sans-serif', maxWidth: 320 }}>
      <Field label="Name" name="name" value={values.name} error={visibleError('name')} {...field} />
      <Field label="Email" name="email" type="email" value={values.email} error={visibleError('email')} {...field} />
      <Field label="Password" name="password" type="password" value={values.password} error={visibleError('password')} {...field} />
      <Field label="Confirm password" name="confirm" type="password" value={values.confirm} error={visibleError('confirm')} {...field} />
      <label>
        <input type="checkbox" name="terms" checked={values.terms} {...field} /> I accept the terms
      </label>
      {visibleError('terms') && <p style={{ color: 'crimson', margin: 0 }}>{visibleError('terms')}</p>}
      {serverError && <p role="alert">{serverError}</p>}
      <button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Creating account...' : 'Sign up'}
      </button>
    </form>
  );
}`,
      },
      output: "On load, no errors show. Clicking 'Sign up' immediately shows every error ('Name is required', 'Email is required', ...) and focuses the Name input. Typing 'asha@' then leaving the field shows 'Enter a valid email'. With valid input, the button reads 'Creating account...' and is disabled for 0.8 s, then 'Welcome, Asha!'. Using taken@example.com shows 'Email already registered' and re-enables the button.",
      questions: [
        { q: 'Why not store errors in state?', a: 'Errors are fully determined by the current values, so they can be computed during render with a pure function. Storing them means remembering to update them on every change, which leads to stale errors.' },
        { q: 'When should a field show its error?', a: 'After the user has left the field once (touched) or after a submit attempt. Showing errors on page load or on the first keystroke feels hostile; waiting until submit only is frustrating on long forms.' },
        { q: 'Controlled vs uncontrolled inputs for forms?', a: 'Controlled inputs keep the value in React state, so validation and conditional UI are easy, but every keystroke re-renders. Uncontrolled inputs keep the value in the DOM, read via refs or FormData, which is faster for big forms. React Hook Form uses uncontrolled inputs for that reason.' },
        { q: 'How do you prevent double submission?', a: 'Track a submitting status, disable the button while it is set, and return early from the handler if already submitting. On the server, idempotency keys or unique constraints protect against duplicates that still slip through.' },
        { q: 'Is client-side validation enough?', a: 'No. Anyone can bypass the browser and call the API directly. Client validation is for user experience; the server must validate everything again, for example with a shared Zod schema.' },
      ],
      answer30: "I keep all values in one object with one change handler keyed by the input's name. Errors come from a pure validate function on every render, not from state. A touched map plus a submit-attempted flag decide when each error is visible. On submit I prevent the default, focus the first invalid field if there are errors, otherwise set a submitting status that disables the button, call the API, and show server errors separately. Labels, aria-invalid and aria-describedby make the errors accessible.",
      mistakes: [
        'Validating only on submit, or showing every error before the user has typed anything.',
        'Storing errors in state and forgetting to clear them when the value becomes valid.',
        "Not disabling the submit button, so a double click creates two accounts.",
        "Trap: 'Why does my regex let everything through?' Inside a JS string or template literal, `\\\\s` must be written with two backslashes; a single backslash is silently dropped and the regex changes meaning.",
      ],
      takeaway: 'One values object, errors derived by a pure function, shown after touch or submit, server checks again.',
    },

    {
      id: 'otp-input',
      title: 'OTP input',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'An array of digits and an array of refs: auto-advance on type, go back on Backspace, fill all boxes on paste.',
      what: [
        "Build a 6-box one-time-password input. Typing a digit moves to the next box, Backspace clears and moves back, arrow keys move between boxes, pasting '123456' fills every box, and a callback fires when all boxes are filled.",
        "Approach: state is an array of single characters. A `useRef([])` holds the input elements so you can call `.focus()` on any box. One `fill(start, text)` helper handles typing, pasting, and SMS autofill.",
      ],
      deeper: [
        "Selecting the box's content on focus means a new keystroke replaces the old digit, instead of producing two characters in one box.",
        "`autoComplete='one-time-code'` on the first box lets iOS and Android offer the code from an SMS. The browser puts the whole code into that one input, so `onChange` must handle a multi-character value, which `fill` does.",
        "`inputMode='numeric'` shows the number keyboard on phones without the quirks of `type='number'` (spinners, 'e' allowed, leading zeros dropped). Non-digits are stripped with `/\\D/g`.",
        "Index keys are fine here: the boxes never reorder, get inserted or removed.",
      ],
      why: "It tests refs and focus management, keyboard events, paste handling, and immutable array updates, which all come up in real login and checkout flows.",
      analogy: "Six parking spaces with an attendant. Each car (digit) goes into the next free space and the attendant waves you on; if you back out, they wave you back one space.",
      code: {
        lang: 'jsx',
        source: `import { useRef, useState } from 'react';

export function OtpInput({ length = 6, onComplete }) {
  const [digits, setDigits] = useState(() => Array(length).fill(''));
  const inputs = useRef([]);

  const focus = (i) => inputs.current[Math.max(0, Math.min(length - 1, i))]?.focus();

  function update(next) {
    setDigits(next);
    if (next.every((d) => d !== '')) onComplete?.(next.join(''));
  }

  // Writes text into the boxes starting at \`start\`: typing, paste and SMS autofill
  function fill(start, text) {
    if (!text) return;
    const next = [...digits];
    for (let k = 0; k < text.length && start + k < length; k++) next[start + k] = text[k];
    update(next);
    focus(start + text.length);
  }

  function handleChange(i, e) {
    let value = e.target.value.replace(/\\D/g, '');
    // Typed next to an existing digit: keep only the new one
    if (digits[i] && value.length === 2) value = value[0] === digits[i] ? value[1] : value[0];
    fill(i, value);
  }

  function handleKeyDown(i, e) {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const next = [...digits];
      if (next[i]) {
        next[i] = ''; // clear this box, stay here
      } else if (i > 0) {
        next[i - 1] = ''; // empty box: clear the previous one and move back
        focus(i - 1);
      }
      setDigits(next);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focus(i - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      focus(i + 1);
    }
  }

  function handlePaste(i, e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\\D/g, '').slice(0, length);
    fill(pasted.length === length ? 0 : i, pasted); // a full code always starts at box 1
  }

  return (
    <div role="group" aria-label="One-time code" style={{ display: 'flex', gap: 8 }}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          value={d}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          aria-label={'Digit ' + (i + 1)}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => handlePaste(i, e)}
          onFocus={(e) => e.target.select()}
          style={{ width: 40, height: 48, textAlign: 'center', fontSize: 24 }}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [code, setCode] = useState('');
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <h2>Enter the code we sent you</h2>
      <OtpInput length={6} onComplete={setCode} />
      {code && <p>Verifying {code}...</p>}
    </div>
  );
}`,
      },
      output: "Typing 4, 2, 7 fills the first three boxes and focus jumps to box 4 each time; letters are ignored. Backspace in empty box 4 clears box 3 and moves focus there. Pasting '123-456' anywhere fills all six boxes with 1 2 3 4 5 6, focuses the last box, and shows 'Verifying 123456...'.",
      questions: [
        { q: 'Why keep refs to the inputs?', a: 'Moving focus is an imperative DOM action; React state cannot focus an element. A ref array lets you call `inputs.current[i].focus()` for the next or previous box.' },
        { q: 'Why `inputMode="numeric"` instead of `type="number"`?', a: "`type='number'` allows 'e', '+' and '-', shows spinner arrows, drops leading zeros, and doesn't support `select()` in some browsers. `inputMode='numeric'` just shows the number keyboard while keeping a normal text input." },
        { q: 'How do you support SMS autofill?', a: "Set `autoComplete='one-time-code'` on the first input. The phone pastes the full code into that box, so `onChange` must split a multi-digit value across all boxes, which the `fill` helper does." },
        { q: 'Is using the index as the key OK here?', a: 'Yes. Index keys only cause bugs when items are reordered, inserted or removed. The OTP boxes are a fixed-length list that never changes order.' },
        { q: 'How would you add a resend timer?', a: "Add a countdown (for example 30 seconds) with an end timestamp and setInterval in an effect. Disable 'Resend code' until it reaches zero, then reset the boxes and the timer when it's clicked." },
      ],
      answer30: "State is an array of digits, and a ref array holds the input elements so I can move focus. A single fill helper writes characters starting at an index and focuses the box after the last one, which covers typing, paste and SMS autofill. Backspace clears the current box, or the previous one if it's empty and moves back. Arrow keys move focus. Inputs strip non-digits, select their content on focus, use inputMode numeric, and onComplete fires when every box has a digit.",
      mistakes: [
        'Using `maxLength={1}`, which blocks typing a new digit into a filled box and breaks paste into one box.',
        'Mutating the digits array (`digits[i] = v`) before setting it, so React may not re-render.',
        "Forgetting paste, which is how most users actually enter codes from email.",
        "Trap: 'Why does Backspace move two boxes?' If you clear the value and also let the browser's default Backspace run, the change and keydown handlers both act. Call `e.preventDefault()` in keydown.",
      ],
      takeaway: 'Digits array + refs for focus, one fill helper for typing, paste and autofill.',
    },

    {
      id: 'timer-stopwatch',
      title: 'Countdown timer and stopwatch',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Compute time from `Date.now()` timestamps, not by counting ticks; run the interval in an effect keyed on `running`.',
      what: [
        "A stopwatch counts up with start, stop, lap and reset. A countdown counts down from a set time with start, pause, resume and reset, and shows 'Time's up!' at zero.",
        "Approach: don't add 10 ms on every tick, because timers drift and browsers slow them in background tabs. Store a reference timestamp in a ref (the start time, or the end time for a countdown) and calculate elapsed or remaining time from `Date.now()` on each tick. The interval only decides how often the screen updates.",
      ],
      deeper: [
        "The interval lives in a `useEffect` that depends on `running`. When `running` becomes false, the cleanup clears it. Start and pause set the reference timestamp in event handlers, which keeps the effect simple and its dependency list honest.",
        "Pause and resume: on pause, save the current elapsed or remaining time in state. On resume, set the reference timestamp from it again (`start = now - elapsed`, `end = now + remaining`).",
        "For smooth animation, `requestAnimationFrame` matches the display refresh rate and pauses in hidden tabs. A 30 to 100 ms interval is fine for a text display.",
      ],
      why: "Timers test whether you understand effect cleanup, stale closures, refs for mutable values, and real-world timer drift, which is a common bug in production countdowns like OTP resend or quiz timers.",
      analogy: "Don't count your own heartbeats to measure an hour. Note the clock time when you start and look at the clock again; your counting can drift, the clock can't.",
      code: {
        lang: 'jsx',
        source: `import { useEffect, useRef, useState } from 'react';

const pad = (n) => String(n).padStart(2, '0');

export function formatMs(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centis = Math.floor((ms % 1000) / 10);
  return pad(minutes) + ':' + pad(seconds) + '.' + pad(centis);
}

export function Stopwatch() {
  const [elapsed, setElapsed] = useState(0); // ms
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const startRef = useRef(0); // Date.now() minus time already elapsed

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed(Date.now() - startRef.current), 30);
    return () => clearInterval(id);
  }, [running]);

  function start() {
    startRef.current = Date.now() - elapsed; // resume from where we stopped
    setRunning(true);
  }
  function stop() {
    setElapsed(Date.now() - startRef.current); // exact value, not the last tick
    setRunning(false);
  }
  function reset() {
    setRunning(false);
    setElapsed(0);
    setLaps([]);
  }

  return (
    <section>
      <h2>Stopwatch</h2>
      <p style={{ fontSize: 32, fontVariantNumeric: 'tabular-nums' }}>{formatMs(elapsed)}</p>
      {running ? <button onClick={stop}>Stop</button> : <button onClick={start}>Start</button>}
      <button onClick={() => setLaps((l) => [elapsed, ...l])} disabled={!running}>Lap</button>
      <button onClick={reset}>Reset</button>
      <ol reversed>
        {laps.map((t, i) => (
          <li key={laps.length - i}>{formatMs(t)}</li>
        ))}
      </ol>
    </section>
  );
}

export function Countdown({ seconds = 10 }) {
  const [remaining, setRemaining] = useState(seconds * 1000);
  const [running, setRunning] = useState(false);
  const endRef = useRef(0); // timestamp when the countdown hits zero

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const left = Math.max(0, endRef.current - Date.now());
      setRemaining(left);
      if (left === 0) setRunning(false);
    }, 100);
    return () => clearInterval(id);
  }, [running]);

  function start() {
    if (remaining === 0) return;
    endRef.current = Date.now() + remaining;
    setRunning(true);
  }
  function pause() {
    setRemaining(Math.max(0, endRef.current - Date.now()));
    setRunning(false);
  }
  function reset() {
    setRunning(false);
    setRemaining(seconds * 1000);
  }

  const shown = Math.ceil(remaining / 1000); // 9.2 s left shows as 10
  return (
    <section>
      <h2>Countdown</h2>
      <p style={{ fontSize: 32 }} aria-live="off">
        {pad(Math.floor(shown / 60))}:{pad(shown % 60)}
      </p>
      {remaining === 0 && <p role="alert">Time's up!</p>}
      {running ? (
        <button onClick={pause}>Pause</button>
      ) : (
        <button onClick={start} disabled={remaining === 0}>
          {remaining > 0 && remaining < seconds * 1000 ? 'Resume' : 'Start'}
        </button>
      )}
      <button onClick={reset}>Reset</button>
    </section>
  );
}

export default function App() {
  return (
    <main style={{ fontFamily: 'sans-serif' }}>
      <Stopwatch />
      <Countdown seconds={90} />
    </main>
  );
}`,
      },
      output: "The stopwatch shows 00:00.00, counts up on Start, freezes on Stop, and continues from the same value on the next Start; Lap records the current time at the top of the list. The countdown shows 01:30, ticks down after Start, keeps its value on Pause (the button becomes 'Resume'), and at 00:00 stops itself and shows 'Time's up!'. Both stay accurate even if the tab was in the background.",
      questions: [
        { q: 'Why calculate from Date.now() instead of incrementing a counter each tick?', a: 'setInterval is not precise: callbacks run late when the main thread is busy, and browsers throttle timers in background tabs to once per second or less. Counting ticks drifts; subtracting timestamps is always correct.' },
        { q: 'Why is the start time in a ref and not in state?', a: 'The interval needs to read it, but changing it should not cause a re-render. A ref is a mutable box that survives renders without triggering them, which is exactly right for a timestamp.' },
        { q: 'What happens if you forget the effect cleanup?', a: 'Every start creates a new interval while the old one keeps running, so the display updates multiple times per tick and stopping does nothing. The timer also keeps running after the component unmounts.' },
        { q: 'How do you stop a countdown at zero without going negative?', a: 'Clamp with `Math.max(0, end - Date.now())`, and when it reaches 0 set running to false, which makes the effect cleanup clear the interval.' },
        { q: 'How would you make the timer survive a page refresh?', a: 'Save the end timestamp (and paused remaining time) in localStorage. On load, compute the remaining time from the saved end timestamp; if it is in the past, show the finished state.' },
      ],
      answer30: "I keep the displayed time and a running flag in state, and a reference timestamp in a ref: the start time for a stopwatch, the end time for a countdown. An effect keyed on running starts a setInterval that recalculates from Date.now on each tick, and its cleanup clears it. Start and pause handlers set the timestamp and save the current value, so pause and resume work. Calculating from timestamps avoids drift and background-tab throttling, and the countdown clamps at zero and stops itself.",
      mistakes: [
        'Doing `setTime(time + 1)` inside setInterval, which captures a stale `time` and gets stuck at 1.',
        'Counting ticks instead of using timestamps, so the timer drifts or freezes in background tabs.',
        'Not clearing the interval, which creates duplicate intervals on every start.',
        "Trap: 'Why does the countdown show 10 for a moment after starting at 10?' Rounding. Use `Math.ceil` so 9.9 s shows as 10 and it changes to 9 only when 9 seconds remain, which is what users expect.",
      ],
      takeaway: 'Timestamps in a ref, interval in an effect keyed on running, always clean up.',
    },

    {
      id: 'file-explorer',
      title: 'File explorer (recursive tree)',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'A component that renders itself for each child folder, with pure recursive helpers to add and delete nodes immutably.',
      what: [
        "Render a nested folder structure, like VS Code's sidebar. Folders expand and collapse, and you can add a file or folder inside any folder, or delete any item.",
        "Approach: the data is a tree of `{ id, name, isFolder, children }`. A `TreeNode` component renders one node and, for folders, maps over its children rendering `TreeNode` again: that's the recursion. The tree lives in the top component, and pure helper functions return a new tree for each change.",
      ],
      deeper: [
        "Where state lives: the tree data is in the root so every change is one immutable update. UI-only state (is this folder expanded, is it showing the 'new file' input) lives inside each `TreeNode`, because nobody else needs it.",
        "Immutable recursive update: `insertNode` copies only the path from the root to the changed folder; untouched branches keep their references. That's also what lets `React.memo` skip unchanged subtrees.",
        "For large trees, a normalized shape is better: `{ byId: { [id]: node }, childIds }`. Updates become O(1) lookups instead of walking the whole tree, and moving a node is just changing two `childIds` arrays.",
      ],
      why: "Recursion in components is a favourite interview topic, and file trees appear in real products (document managers, nested comments, org charts, category menus).",
      analogy: "Russian nesting dolls. Each doll (folder) knows how to open itself and show the dolls inside, which open the same way, however deep it goes.",
      code: {
        lang: 'jsx',
        source: `import { useState } from 'react';

const initialTree = {
  id: 'root',
  name: 'project',
  isFolder: true,
  children: [
    {
      id: '1',
      name: 'src',
      isFolder: true,
      children: [
        { id: '2', name: 'App.jsx', isFolder: false },
        { id: '3', name: 'components', isFolder: true, children: [{ id: '4', name: 'Button.jsx', isFolder: false }] },
      ],
    },
    { id: '5', name: 'package.json', isFolder: false },
  ],
};

// Pure recursive helpers: return a new tree, never mutate
export function insertNode(node, parentId, newNode) {
  if (node.id === parentId) return { ...node, children: [...node.children, newNode] };
  if (!node.isFolder) return node;
  return { ...node, children: node.children.map((child) => insertNode(child, parentId, newNode)) };
}

export function deleteNode(node, id) {
  if (!node.isFolder) return node;
  return {
    ...node,
    children: node.children.filter((child) => child.id !== id).map((child) => deleteNode(child, id)),
  };
}

// Folders first, then alphabetical
const sortNodes = (nodes) =>
  [...nodes].sort((a, b) => Number(b.isFolder) - Number(a.isFolder) || a.name.localeCompare(b.name));

function TreeNode({ node, depth, onAdd, onDelete }) {
  const [expanded, setExpanded] = useState(depth === 0);
  const [adding, setAdding] = useState(null); // null | 'file' | 'folder'
  const [name, setName] = useState('');
  const indent = { paddingLeft: depth * 16 };

  if (!node.isFolder) {
    return (
      <li role="treeitem" style={indent}>
        {node.name}{' '}
        <button aria-label={'Delete ' + node.name} onClick={() => onDelete(node.id)}>x</button>
      </li>
    );
  }

  function startAdding(type) {
    setExpanded(true);
    setAdding(type);
  }

  function submitNew(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) {
      const isFolder = adding === 'folder';
      onAdd(node.id, { id: crypto.randomUUID(), name: trimmed, isFolder, ...(isFolder && { children: [] }) });
    }
    setAdding(null);
    setName('');
  }

  return (
    <li role="treeitem" aria-expanded={expanded}>
      <div style={indent}>
        <button onClick={() => setExpanded((x) => !x)}>
          {expanded ? 'v' : '>'} {node.name}/
        </button>
        <button onClick={() => startAdding('file')}>+ File</button>
        <button onClick={() => startAdding('folder')}>+ Folder</button>
        {depth > 0 && (
          <button aria-label={'Delete ' + node.name} onClick={() => onDelete(node.id)}>x</button>
        )}
      </div>
      {expanded && (
        <ul role="group" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {adding && (
            <li style={{ paddingLeft: (depth + 1) * 16 }}>
              <form onSubmit={submitNew}>
                <input
                  autoFocus
                  aria-label={'New ' + adding + ' name'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setAdding(null)}
                  onKeyDown={(e) => e.key === 'Escape' && setAdding(null)}
                />
              </form>
            </li>
          )}
          {sortNodes(node.children).map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} onAdd={onAdd} onDelete={onDelete} />
          ))}
          {node.children.length === 0 && !adding && <li style={{ paddingLeft: (depth + 1) * 16 }}>(empty)</li>}
        </ul>
      )}
    </li>
  );
}

export default function FileExplorer() {
  const [tree, setTree] = useState(initialTree);
  const add = (parentId, newNode) => setTree((t) => insertNode(t, parentId, newNode));
  const remove = (id) => setTree((t) => deleteNode(t, id));

  return (
    <ul role="tree" aria-label="Files" style={{ listStyle: 'none', padding: 0, fontFamily: 'monospace' }}>
      <TreeNode node={tree} depth={0} onAdd={add} onDelete={remove} />
    </ul>
  );
}`,
      },
      output: "It shows 'project/' expanded with 'src/' (collapsed) first and 'package.json' after it. Clicking 'src/' reveals 'components/' then 'App.jsx'. Clicking '+ File' on components, typing 'Card.jsx' and pressing Enter adds it under components, sorted after Button.jsx. Deleting 'src' removes it and everything inside it. Escape or clicking away cancels the new-item input.",
      questions: [
        { q: 'How does recursion work in a React component?', a: 'A component renders itself for each child: `TreeNode` maps over `node.children` and renders `<TreeNode node={child} />`. The base case is a file (or an empty folder), which renders without recursing.' },
        { q: 'Where should the expanded state live?', a: "Inside each TreeNode, because it's UI state that only that node uses. The tree data lives at the top because adds and deletes must update one shared structure. Move expanded state up only if you need 'expand all' or to persist it." },
        { q: 'How do you update a deeply nested node immutably?', a: 'Recursively copy along the path: at each level, return a new object with a new children array, mapping into the child that contains the target. Untouched branches keep their old references, which keeps memoized subtrees from re-rendering.' },
        { q: 'How would you scale this to 50,000 files?', a: 'Normalize the data into a flat `byId` map with `childIds`, so updates are O(1). Load folder contents lazily from the API when a folder is first expanded. Flatten the visible nodes into a list and virtualize it so only on-screen rows render.' },
        { q: 'How would you add rename?', a: 'Add an `updateNode(tree, id, changes)` recursive helper like insert, and give each node an `editing` state that swaps the name for an input. Validate that the new name is not empty and not a duplicate among its siblings.' },
      ],
      answer30: "The data is a tree of nodes with id, name, isFolder and children, stored in the root component. A TreeNode component renders one node; for folders it maps over the children and renders TreeNode again, which is the recursion, with files as the base case. Expanded and 'adding' state live inside each node because they're local UI state. Adds and deletes go through pure recursive helpers that copy the path to the changed node and return a new tree, so updates are immutable.",
      mistakes: [
        'Mutating the nested node (`folder.children.push(...)`) and calling `setTree(tree)` with the same reference.',
        'Putting every folder\'s expanded flag in the tree data when only the UI needs it.',
        'Using the array index as the key, which breaks when items are sorted, added or deleted.',
        "Trap: 'What is the time complexity of your insert?' O(n) in the worst case, because it walks the tree. A normalized byId map makes it O(1) plus copying the parent's children array.",
      ],
      takeaway: 'Component renders itself for children; tree data at the top, UI state per node, immutable recursive updates.',
    },

    {
      id: 'kanban-drag-drop',
      title: 'Kanban board with drag and drop',
      level: 'advanced',
      priority: 'good',
      frequency: 'occasional',
      summary: 'One flat array of cards with a `status`; native HTML5 drag events move a card to a column or before another card.',
      what: [
        "Build a Trello-style board with To do, In progress and Done columns. Cards can be dragged between columns and reordered, and there should be a non-drag way to move cards for keyboard users.",
        "Approach: store all cards in one flat array, each with a `status`. A column shows `cards.filter(c => c.status === column.id)`. Dragging uses the native HTML5 API: `draggable` on cards, `onDragStart` saves the card id, `onDragOver` with `preventDefault()` marks a valid drop target, and `onDrop` calls a pure `moveCard` function.",
      ],
      deeper: [
        "A flat array beats one array per column: moving a card is one update (change status, reposition), and the order inside a column is simply the order in the array.",
        "The single most common bug: forgetting `e.preventDefault()` in `onDragOver`. By default elements refuse drops, so `onDrop` never fires.",
        "A drop on a card bubbles up to its column, so the card's drop handler calls `e.stopPropagation()`; otherwise the column handler runs second and moves the card to the end.",
        "Native drag and drop doesn't work on most touch devices and has no keyboard support. Production boards use a library like dnd-kit, which adds pointer, touch and keyboard sensors plus screen-reader announcements. In the interview, buttons to move a card left or right cover accessibility.",
      ],
      why: "It's a senior-flavoured machine coding problem: data modelling, browser drag events, event bubbling, and accessibility trade-offs.",
      analogy: "Sticky notes on a whiteboard. Each note has the name of its column written on it; moving it means rewriting that label and sticking it in a new spot in the line.",
      code: {
        lang: 'jsx',
        source: `import { useState } from 'react';

const COLUMNS = [
  { id: 'todo', title: 'To do' },
  { id: 'doing', title: 'In progress' },
  { id: 'done', title: 'Done' },
];

const initialCards = [
  { id: 'c1', title: 'Design schema', status: 'todo' },
  { id: 'c2', title: 'Build API', status: 'todo' },
  { id: 'c3', title: 'Write tests', status: 'doing' },
  { id: 'c4', title: 'Set up CI', status: 'done' },
];

// Pure: move a card to a column, before another card or at the end
export function moveCard(cards, cardId, toStatus, beforeId = null) {
  const card = cards.find((c) => c.id === cardId);
  if (!card || cardId === beforeId) return cards;
  const rest = cards.filter((c) => c.id !== cardId);
  const moved = { ...card, status: toStatus };
  const index = beforeId ? rest.findIndex((c) => c.id === beforeId) : -1;
  if (index === -1) return [...rest, moved]; // end of the array = end of its column
  return [...rest.slice(0, index), moved, ...rest.slice(index)];
}

export default function KanbanBoard() {
  const [cards, setCards] = useState(initialCards);
  const [dragId, setDragId] = useState(null);
  const [overColumn, setOverColumn] = useState(null);

  function handleDrop(e, status, beforeId = null) {
    e.preventDefault();
    e.stopPropagation(); // a drop on a card must not also run the column's drop
    const id = e.dataTransfer.getData('text/plain') || dragId;
    setCards((prev) => moveCard(prev, id, status, beforeId));
    setDragId(null);
    setOverColumn(null);
  }

  function moveBy(card, step) {
    const target = COLUMNS[COLUMNS.findIndex((c) => c.id === card.status) + step];
    if (target) setCards((prev) => moveCard(prev, card.id, target.id));
  }

  return (
    <div style={{ display: 'flex', gap: 16, fontFamily: 'sans-serif' }}>
      {COLUMNS.map((col, colIndex) => {
        const colCards = cards.filter((c) => c.status === col.id);
        return (
          <section
            key={col.id}
            aria-label={col.title}
            onDragOver={(e) => {
              e.preventDefault(); // required, or drop never fires
              setOverColumn(col.id);
            }}
            onDrop={(e) => handleDrop(e, col.id)}
            style={{ flex: 1, minHeight: 240, padding: 8, borderRadius: 8, background: overColumn === col.id ? '#dbe7ff' : '#f1f2f4' }}
          >
            <h2 style={{ fontSize: 16 }}>
              {col.title} ({colCards.length})
            </h2>
            {colCards.map((card) => (
              <article
                key={card.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', card.id);
                  e.dataTransfer.effectAllowed = 'move';
                  setDragId(card.id);
                }}
                onDragEnd={() => {
                  setDragId(null);
                  setOverColumn(null);
                }}
                onDrop={(e) => handleDrop(e, col.id, card.id)}
                style={{ background: '#fff', padding: 8, marginBottom: 8, borderRadius: 6, cursor: 'grab', opacity: dragId === card.id ? 0.4 : 1 }}
              >
                <p style={{ margin: 0 }}>{card.title}</p>
                <button aria-label={'Move ' + card.title + ' left'} disabled={colIndex === 0} onClick={() => moveBy(card, -1)}>
                  {'<'}
                </button>
                <button aria-label={'Move ' + card.title + ' right'} disabled={colIndex === COLUMNS.length - 1} onClick={() => moveBy(card, 1)}>
                  {'>'}
                </button>
              </article>
            ))}
          </section>
        );
      })}
    </div>
  );
}`,
      },
      output: "The board shows 'To do (2)', 'In progress (1)', 'Done (1)'. Dragging 'Build API' onto the Done column highlights it and drops the card at the bottom: 'To do (1)', 'Done (2)'. Dropping 'Set up CI' onto 'Build API' places it just above that card. The '>' button on 'Design schema' moves it to In progress without dragging.",
      questions: [
        { q: 'Why does my onDrop handler never fire?', a: 'Elements reject drops by default. You must call `e.preventDefault()` in the `onDragOver` handler of the drop target to say a drop is allowed; only then does `onDrop` fire.' },
        { q: 'Why one flat array of cards instead of an array per column?', a: 'A move becomes a single immutable update: change the status and reposition the card. Per-column arrays need removing from one and inserting into another, which is easy to get wrong. Order within a column is just array order.' },
        { q: 'Why `stopPropagation` in the card drop handler?', a: "Drop events bubble. Without it, dropping on a card first inserts it before that card, then the column's handler runs and moves it to the end of the column." },
        { q: 'How would you persist the board and keep it in sync with a server?', a: 'Update the UI optimistically, then send a PATCH with the card id, new status and new position. Store order as a sortable value (like fractional indexes) so one move updates one row. If the request fails, roll back to the previous array and show an error.' },
        { q: 'What does native drag and drop lack, and what would you use instead?', a: 'It does not work well on touch devices, has no keyboard support, and is hard to style or animate. dnd-kit (or similar) adds pointer, touch and keyboard sensors, collision detection, and screen-reader announcements.' },
      ],
      answer30: "I store all cards in one flat array with a status, and each column filters by its id. Cards are draggable; dragStart puts the card id in dataTransfer, the column's dragOver calls preventDefault so drops are allowed, and drop calls a pure moveCard function that removes the card and reinserts it with the new status, either before the card it was dropped on or at the end. The card's drop handler stops propagation so the column handler doesn't run too. For accessibility I add left and right move buttons, and in production I'd use dnd-kit for touch and keyboard.",
      mistakes: [
        'Forgetting `preventDefault` in `onDragOver`, so nothing can be dropped.',
        'Mutating the dragged card or column arrays in place.',
        'Relying on drag only, leaving keyboard and touch users unable to move cards.',
        "Trap: 'Can you read dataTransfer data during dragover?' No. For security, browsers only expose the data in the drop event; during dragover you can see only the types. Keep the dragged id in state if you need it earlier.",
      ],
      takeaway: 'Flat cards array with status, pure moveCard, preventDefault on dragover, buttons for accessibility.',
    },
  ],
  rapidFire: [
    { q: 'First thing to do in a machine coding round?', a: 'Clarify requirements and write them as a checklist before typing code.' },
    { q: 'What do you build first?', a: 'The happy path end to end, keeping the app runnable at every step.' },
    { q: 'Should filtered lists live in state?', a: 'No. Derive them from the source state during render.' },
    { q: 'Why not use the index as a key?', a: 'Reordering, filtering or deleting attaches state to the wrong item. Use a stable id.' },
    { q: 'How do you avoid stale state in setInterval?', a: 'Use the updater form `setX(prev => ...)` or read from a ref.' },
    { q: 'What must every interval or listener effect return?', a: 'A cleanup that clears the interval or removes the listener.' },
    { q: 'Debounce in one line?', a: 'Wait until the input stops changing for N ms, then act once.' },
    { q: 'How do you stop old search responses overwriting new ones?', a: 'Abort the previous request in the effect cleanup with AbortController.' },
    { q: 'Does fetch reject on a 404?', a: 'No. Check `res.ok` and throw yourself.' },
    { q: 'Best API for infinite scroll?', a: 'IntersectionObserver on a sentinel element below the list.' },
    { q: 'Why render a modal in a portal?', a: 'So parent `overflow` or `z-index` cannot clip or hide it.' },
    { q: 'Four must-haves for an accessible modal?', a: 'Dialog role and label, focus moved in, focus trapped, focus restored on close.' },
    { q: 'Why `e.preventDefault()` in onDragOver?', a: 'Elements reject drops by default; without it onDrop never fires.' },
    { q: 'How do you move focus between OTP boxes?', a: 'Keep an array of input refs and call `.focus()` on the target box.' },
    { q: 'Why compute timers from Date.now()?', a: 'Interval ticks drift and are throttled in background tabs; timestamps stay accurate.' },
    { q: 'Where do validation errors come from?', a: 'A pure `validate(values)` function run during render, not state.' },
    { q: 'How do you update a nested tree immutably?', a: 'Recursively copy the path to the changed node and reuse untouched branches.' },
    { q: 'Do two components using one custom hook share state?', a: 'No. Each call gets its own state; share via lifted state, context or a cache.' },
  ],
};

export default machineCoding;
