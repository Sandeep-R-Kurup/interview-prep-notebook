// Redux and Redux-Saga stack. Topics are auto-sorted Basic -> Intermediate -> Advanced by the registry.
// Every runnable example was executed with @reduxjs/toolkit 2.x and redux-saga 1.x in Node.

const redux = {
  name: 'Redux and Redux-Saga',
  intro: 'Global state with Redux Toolkit, side effects with thunks, RTK Query and sagas, and how to defend your choice against Context, Zustand and TanStack Query.',
  topics: [
    {
      id: 'why-redux',
      title: 'Why Redux, and when not to use it',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Redux keeps shared app state in one store that only changes through dispatched actions, which makes changes predictable and traceable.',
      note: "Your resume doesn't name a state library. If an interviewer asks what Skillkeepr or Octagnt used, say what was really there, and use this stack to explain the trade-offs.",
      what: [
        "Redux is a library for managing state that many parts of an app need, like the logged-in user, a cart, or filters. All of that state lives in one JavaScript object called the store.",
        "Components never change the store directly. They dispatch an action, a plain object that says what happened (`{ type: 'cart/added', payload: item }`). A reducer function reads the action and returns the new state. Every component that reads that part of the store then updates.",
      ],
      deeper: [
        "The three principles: a single source of truth (one store), state is read-only (only actions change it), and changes are made with pure functions (reducers). Because every change is an action object, you can log it, replay it, and inspect it in Redux DevTools with time travel.",
        "Since about 2020 the official advice is: write Redux with Redux Toolkit (RTK), and use RTK Query or TanStack Query for server data. A lot of what old apps kept in Redux (API responses with loading flags) is really server cache, which those tools handle better.",
        "When not to use it: small apps, state that only one component or one subtree needs (use `useState` or Context), or apps whose 'global state' is mostly fetched data (use a server-state library). Redux adds a store, actions and reducers; that structure pays off in large apps with many people and complex client-side state.",
      ],
      why: "As apps grow, many components read and change the same data. Passing it through props gets messy, and changes from many places become hard to trace. Redux gives one place where state lives and one path by which it changes.",
      analogy: "A bank ledger. You can't walk into the vault and change your balance. You submit a transaction slip (action), the teller applies the bank's rules (reducer), and a new balance is recorded. Every slip is kept, so you can always see how you got here.",
      code: {
        lang: 'js',
        title: 'The whole idea in 15 lines (a toy createStore)',
        source: `function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = [];
  return {
    getState: () => state,
    dispatch(action) {
      state = reducer(state, action);      // the ONLY way state changes
      listeners.forEach((fn) => fn());     // tell subscribers (the UI)
    },
    subscribe(fn) {
      listeners.push(fn);
      return () => listeners.splice(listeners.indexOf(fn), 1);
    },
  };
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'cart/added':
      return { ...state, items: [...state.items, action.payload] };
    case 'cart/cleared':
      return { ...state, items: [] };
    default:
      return state; // unknown action: return the same state
  }
}

const store = createStore(cartReducer, { items: [] });
store.subscribe(() => console.log('UI sees:', store.getState().items));

store.dispatch({ type: 'cart/added', payload: 'Keyboard' });
store.dispatch({ type: 'cart/added', payload: 'Mouse' });
store.dispatch({ type: 'cart/cleared' });`,
      },
      output: "It logs `UI sees: [ 'Keyboard' ]`, then `UI sees: [ 'Keyboard', 'Mouse' ]`, then `UI sees: []`. Each dispatch runs the reducer, replaces the state, and notifies the subscriber. The real Redux store works the same way, plus middleware and dev checks.",
      questions: [
        { q: 'What problem does Redux solve?', a: 'It gives shared client state one home (the store) and one way to change it (dispatching actions to reducers). That makes changes predictable, easy to trace in DevTools, and avoids prop drilling across distant components.' },
        { q: 'What are the three principles of Redux?', a: 'A single source of truth, state is read-only and changes only through actions, and changes are made by pure reducer functions.' },
        { q: 'When would you not use Redux?', a: 'In small apps, for state used by one component or subtree, and for server data, which a tool like RTK Query or TanStack Query caches better. Redux pays off when lots of client state is shared and changed from many places.' },
        { q: 'Is Redux tied to React?', a: 'No. Redux is a plain JavaScript library. `react-redux` is the separate binding that connects a store to React components.' },
      ],
      answer30: "Redux keeps shared client state in one store. Components can't change it directly; they dispatch actions, plain objects describing what happened, and pure reducer functions compute the next state. That one-way flow makes changes predictable and easy to debug with DevTools. Today I'd write it with Redux Toolkit, and keep server data in RTK Query or TanStack Query. For small apps or local state, useState and Context are enough.",
      mistakes: [
        'Putting every piece of state in Redux, including form inputs and modal toggles that only one component uses.',
        'Storing API responses with hand-written loading and error flags, when a server-state tool would handle caching and refetching.',
        'Still writing classic Redux (switch statements, action type constants) for new code instead of Redux Toolkit.',
        "Trap: 'Is Redux dead?' No. It's less often the default for small apps, but Redux Toolkit is widely used in large codebases, and many existing apps you'll join use it.",
      ],
      takeaway: 'One store, changed only by actions through pure reducers; use it when shared client state is genuinely complex.',
    },

    {
      id: 'store-actions-reducers',
      title: 'Store, actions, reducers, and pure functions',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Actions describe what happened, reducers compute the next state as pure functions, and the store holds the result.',
      what: [
        "An **action** is a plain object with a `type` string, and usually a `payload` with the data: `{ type: 'todos/added', payload: { text: 'Buy milk' } }`. An **action creator** is just a function that builds one.",
        "A **reducer** is a function `(state, action) => newState`. It looks at the action and returns the next state. The **store** holds the current state, runs the reducer on every `dispatch`, and notifies subscribers.",
        "Reducers must be **pure**: the same inputs always give the same output, and they don't change anything outside themselves. No API calls, no `Math.random()`, no `Date.now()`, and no mutating the old state.",
      ],
      deeper: [
        "Why purity matters: react-redux decides what changed by comparing references (`prev === next`). If a reducer mutates the old object, the reference is the same, so the UI may not update. Purity is also what makes time-travel debugging and replaying actions possible.",
        "An unknown action must return the existing state object unchanged. Redux sends every action to every reducer, so each slice ignores what it doesn't handle. When the store starts, Redux dispatches an internal init action with `state` undefined, which is why reducers use a default parameter for initial state.",
        "Large apps split state into slices and combine them with `combineReducers({ user, cart })`. Each slice reducer only sees its own part of the state.",
      ],
      why: "Keeping all changes in pure functions means you can test them with plain inputs and outputs, reason about every state change, and trust that nothing else changed the state behind your back.",
      analogy: "A reducer is a calculator, not a person. Give it the same numbers and the same button, and it gives the same answer every time. It never phones anyone, and it never scribbles on your old receipt; it prints a new one.",
      code: {
        lang: 'js',
        source: `const initialState = { todos: [], filter: 'all' };

// Pure: same input -> same output, no side effects, no mutation
function todosReducer(state = initialState, action) {
  switch (action.type) {
    case 'todos/added':
      return { ...state, todos: [...state.todos, { id: action.payload.id, text: action.payload.text, done: false }] };
    case 'todos/toggled':
      return {
        ...state,
        todos: state.todos.map((t) => (t.id === action.payload ? { ...t, done: !t.done } : t)),
      };
    case 'filter/changed':
      return { ...state, filter: action.payload };
    default:
      return state;
  }
}

// Action creators: functions that build action objects
const addTodo = (id, text) => ({ type: 'todos/added', payload: { id, text } });
const toggleTodo = (id) => ({ type: 'todos/toggled', payload: id });

// A reducer is just (state, action) => newState, so Array.reduce can drive it
const actions = [addTodo(1, 'Learn reducers'), addTodo(2, 'Learn sagas'), toggleTodo(1)];
const finalState = actions.reduce(todosReducer, undefined);
console.log(JSON.stringify(finalState));

const before = todosReducer(undefined, { type: '@@init' });
const after = todosReducer(before, { type: 'unknown/action' });
console.log(before === after); // true: unknown action returns the same object`,
      },
      output: "It prints `{\"todos\":[{\"id\":1,\"text\":\"Learn reducers\",\"done\":true},{\"id\":2,\"text\":\"Learn sagas\",\"done\":false}],\"filter\":\"all\"}` and then `true`. Running a list of actions through `Array.reduce` gives the final state, which is exactly what Redux does over time. An unknown action returns the same object, so nothing re-renders.",
      questions: [
        { q: 'What is a pure function, and why must reducers be pure?', a: 'A pure function returns the same output for the same input and has no side effects. Reducers must be pure so state changes are predictable, testable, and replayable, and so reference checks can detect changes.' },
        { q: 'What can you not do inside a reducer?', a: 'No API calls, timers, random values, `Date.now()`, dispatching other actions, or mutating the existing state. Those belong in middleware, thunks or sagas.' },
        { q: 'Why does a reducer return the same state for unknown actions?', a: 'Every action reaches every reducer. Returning the same reference tells Redux and react-redux that nothing changed, so no component re-renders.' },
        { q: 'What does combineReducers do?', a: 'It builds one root reducer from slice reducers, giving each one only its own key of the state, like `state.user` or `state.cart`.' },
        { q: 'Why is it called a reducer?', a: 'It has the same shape as the callback to `Array.prototype.reduce`: it takes an accumulator (state) and an item (action) and returns the next accumulator.' },
      ],
      answer30: "An action is a plain object with a type and a payload describing what happened. A reducer is a pure function that takes the current state and an action and returns the next state, without mutating the old one or doing side effects. The store holds the state, runs the reducer on each dispatch, and notifies subscribers. Purity matters because Redux and react-redux detect changes by reference, and it makes reducers trivial to test.",
      mistakes: [
        "Mutating state in a hand-written reducer, like `state.todos.push(x); return state;`. The reference doesn't change, so the UI may not update.",
        'Making API calls or generating ids with `Math.random()` inside the reducer. Do that before dispatching, in the action creator or a thunk.',
        'Forgetting the `default: return state` case, which makes the reducer return undefined.',
        "Trap: 'Can a reducer dispatch an action?' No. Redux throws an error if you dispatch while a reducer is running.",
      ],
      takeaway: 'Actions say what happened; reducers are pure (state, action) => newState functions; never mutate.',
    },

    {
      id: 'redux-toolkit',
      title: 'Redux Toolkit: configureStore, createSlice, and Immer',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'RTK is the official way to write Redux: createSlice generates actions and reducers, Immer lets you write "mutating" code safely.',
      what: [
        "Redux Toolkit (RTK, the `@reduxjs/toolkit` package) is the official, recommended way to write Redux. It removes most of the boilerplate of classic Redux.",
        "`createSlice` takes a name, an initial state and reducer functions, and generates the action creators and action types for you. `configureStore` creates the store with good defaults: the thunk middleware, Redux DevTools, and development checks that catch mutations and non-serializable values.",
        "Inside `createSlice` reducers you can write code that looks like mutation (`state.items.push(x)`). RTK uses a library called Immer, which records those changes on a draft and produces a new immutable state for you.",
      ],
      deeper: [
        "Immer wraps the current state in a Proxy (the draft). Your 'mutations' are recorded, and Immer builds a new object only along the changed path. Unchanged branches keep their old references, so memoized selectors and `React.memo` still work.",
        "Rule of Immer: either mutate the draft or return a new value, not both. `state.value = 5` and `return { ...state, value: 5 }` are both fine; mutating and then returning a different object throws an error. Note that an arrow function like `(s) => s.value = 5` returns the assignment, so wrap it in braces.",
        "`extraReducers` lets a slice respond to actions it didn't define, like `createAsyncThunk` lifecycle actions or another slice's actions. RTK 2 requires the builder callback form: `extraReducers: (builder) => builder.addCase(...)`.",
      ],
      why: "Classic Redux needed action type constants, action creators, and long switch statements with careful spreading for every update. RTK cuts that by more than half and makes the most common bug, accidental mutation, almost impossible.",
      analogy: "Immer is editing a document with track changes on. You scribble directly on the draft; when you're done, a clean new copy is printed and the original is left untouched in the drawer.",
      code: {
        lang: 'js',
        source: `import { configureStore, createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], total: 0 },
  reducers: {
    // Looks like mutation, but Immer turns it into a safe immutable update
    itemAdded(state, action) {
      state.items.push(action.payload);
      state.total += action.payload.price;
    },
    itemRemoved(state, action) {
      const i = state.items.findIndex((it) => it.id === action.payload);
      if (i !== -1) {
        state.total -= state.items[i].price;
        state.items.splice(i, 1);
      }
    },
    cartCleared() {
      return { items: [], total: 0 }; // or return a brand-new state
    },
  },
});

export const { itemAdded, itemRemoved, cartCleared } = cartSlice.actions;

const store = configureStore({ reducer: { cart: cartSlice.reducer } });

console.log(itemAdded({ id: 1, name: 'Pen', price: 20 }));
const s0 = store.getState();
store.dispatch(itemAdded({ id: 1, name: 'Pen', price: 20 }));
store.dispatch(itemAdded({ id: 2, name: 'Book', price: 300 }));
store.dispatch(itemRemoved(1));
const s1 = store.getState();
console.log(s1.cart);
console.log('old state untouched:', s0.cart.items.length, '| new object:', s0 !== s1);`,
      },
      output: "First it logs the generated action: `{ type: 'cart/itemAdded', payload: { id: 1, name: 'Pen', price: 20 } }`. After the three dispatches the cart is `{ items: [ { id: 2, name: 'Book', price: 300 } ], total: 300 }`. The last line prints `old state untouched: 0 | new object: true`: the 'mutating' code never touched the old state.",
      questions: [
        { q: 'What does createSlice give you?', a: 'A reducer plus an action creator for each case reducer, with action types like `cart/itemAdded` generated from the slice name. You write the logic once instead of constants, creators and a switch.' },
        { q: 'How can RTK reducers "mutate" state safely?', a: 'RTK runs them through Immer. Immer gives you a Proxy draft, records the changes you make, and produces a new immutable state, reusing references for anything you did not change.' },
        { q: 'What does configureStore add over the old createStore?', a: 'It combines slice reducers, adds the thunk middleware, connects Redux DevTools, and in development adds checks that warn about state mutations and non-serializable values in actions or state.' },
        { q: 'What is extraReducers for?', a: 'Handling actions defined outside the slice, such as `createAsyncThunk` pending, fulfilled and rejected actions, or actions from another slice. In RTK 2 you must use the builder callback form.' },
      ],
      answer30: "Redux Toolkit is the official way to write Redux. createSlice takes a name, initial state and reducer functions and generates the action creators and types. configureStore sets up the store with thunk, DevTools and development checks for mutations and non-serializable values. Inside slice reducers I can write mutating-style code because Immer records changes on a draft and returns a new immutable state, keeping unchanged references so memoization still works.",
      mistakes: [
        'Mutating the draft and also returning a new object from the same reducer. Immer throws; do one or the other.',
        "Writing `(state) => state.count = 0` as an arrow with no braces. It returns the assignment; use braces or return a whole new state.",
        "Reassigning the draft, `state = initial`. That only changes the local variable. Return the new state instead.",
        "Putting non-serializable values (class instances, Promises, functions, Date objects) in state or actions. The dev check warns, and DevTools can't show them properly.",
        "Trap: 'Does Immer mean state is mutable?' No. Immer produces a new immutable object and freezes it, so an accidental mutation outside a reducer throws a TypeError in strict-mode code (ES modules are strict).",
      ],
      takeaway: 'Use RTK: createSlice for reducers and actions, configureStore for setup, and let Immer handle immutability.',
    },

    {
      id: 'react-redux-hooks',
      title: 'react-redux hooks: useSelector, useDispatch, and re-renders',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'useSelector reads from the store and re-renders only when its selected value changes by reference; useDispatch sends actions.',
      what: [
        "You wrap the app in `<Provider store={store}>`. Then any component can read store data with `useSelector(state => state.cart.items)` and get the `dispatch` function with `useDispatch()`.",
        "`useSelector` subscribes the component to the store. After every dispatched action it runs your selector again and compares the result with the last one using `===`. If it's different, the component re-renders. If it's the same, nothing happens.",
      ],
      deeper: [
        "This is why selectors that build new objects or arrays are a performance bug: `useSelector(s => s.todos.filter(t => t.done))` returns a new array on every action, so the component re-renders on every single dispatch in the app, even unrelated ones. Fix it with a memoized selector (`createSelector`), by selecting smaller primitive values, or by passing `shallowEqual` as the second argument.",
        "react-redux v9 adds development-only warnings for selectors that return a different reference when called twice with the same state, which catches exactly that bug.",
        "Compared with Context: a Context value change re-renders every consumer. react-redux subscribes each component separately and only re-renders components whose selected value actually changed, which is why it scales better for frequently changing state.",
        "In TypeScript, define typed hooks once: `useAppSelector = useSelector.withTypes<RootState>()` and `useAppDispatch = useDispatch.withTypes<AppDispatch>()` (react-redux 9.1+).",
      ],
      why: "Components need to read shared state and trigger changes without passing props through every level, and without re-rendering the whole tree when one slice changes.",
      analogy: "useSelector is a news alert for one keyword. Lots of news happens (actions), but you only get pinged when the story about your keyword actually changes. A badly written selector is an alert that pings you for every headline.",
      code: {
        lang: 'tsx',
        source: `import { Provider, useDispatch, useSelector, shallowEqual } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { store, type RootState, type AppDispatch } from './store';
import { itemAdded } from './cartSlice';

// Typed hooks, defined once (react-redux 9.1+)
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

const selectItems = (s: RootState) => s.cart.items;
const selectExpensive = createSelector([selectItems], (items) => items.filter((i) => i.price > 100));

function CartBadge() {
  const count = useAppSelector((s) => s.cart.items.length); // primitive: re-renders only when the number changes
  return <span>{count}</span>;
}

function ExpensiveList() {
  // BAD: useAppSelector(s => s.cart.items.filter(...)) -> new array every action -> re-render every action
  const items = useAppSelector(selectExpensive); // memoized: same array until items change
  return <ul>{items.map((i) => <li key={i.id}>{i.name}</li>)}</ul>;
}

function UserCard() {
  // Picking several fields into an object? Compare shallowly
  const { name, role } = useAppSelector((s) => ({ name: s.user.name, role: s.user.role }), shallowEqual);
  return <p>{name} ({role})</p>;
}

function AddButton() {
  const dispatch = useAppDispatch();
  return <button onClick={() => dispatch(itemAdded({ id: 3, name: 'Lamp', price: 900 }))}>Add</button>;
}

export default function App() {
  return (
    <Provider store={store}>
      <CartBadge /> <ExpensiveList /> <UserCard /> <AddButton />
    </Provider>
  );
}`,
      },
      output: "Clicking Add dispatches one action. CartBadge re-renders because the count changed, and ExpensiveList re-renders because the items array changed and the memoized selector recomputed. UserCard does not re-render: the shallow comparison sees the same name and role. With the unmemoized `filter` selector, ExpensiveList would re-render on every action anywhere in the app.",
      questions: [
        { q: 'How does useSelector decide whether to re-render?', a: 'After every dispatch it runs the selector and compares the new result with the previous one using strict equality (`===`). Only a different reference or value causes a re-render.' },
        { q: 'Why is `useSelector(s => s.items.filter(...))` a problem?', a: 'filter returns a new array every time, so the comparison always fails and the component re-renders on every action in the app. Use createSelector to memoize it, or select primitives.' },
        { q: 'useSelector vs connect?', a: '`connect` is the older higher-order component API with mapStateToProps. Hooks are the recommended API now: less code and easier typing. connect still works and is still found in older codebases.' },
        { q: 'Why does react-redux scale better than Context for frequently changing state?', a: 'A Context value change re-renders every consumer. react-redux subscribes each component to the store and re-renders only those whose selected value changed.' },
        { q: 'Should you call useSelector once with the whole state?', a: 'No. Selecting the whole state or a big object makes the component re-render on any change. Select the smallest piece you need, and call useSelector several times if needed.' },
      ],
      answer30: "I wrap the app in a Provider, read data with useSelector and send actions with useDispatch. useSelector runs my selector after every dispatch and compares the result with the previous one by reference, re-rendering only if it changed. So I select the smallest values I need, and anything derived, like a filtered list, goes through a memoized createSelector; otherwise a new array each time re-renders the component on every action. For several fields I can pass shallowEqual.",
      mistakes: [
        'Returning new arrays or objects from a selector without memoization.',
        'Selecting the entire state, or a large parent object, in one component.',
        "Destructuring many fields into an object without `shallowEqual`.",
        "Trap: 'Does dispatch need to be in useEffect or useCallback dependencies?' It's stable for the store's lifetime, so including it is harmless and lint-friendly, but it never changes.",
      ],
      takeaway: 'useSelector re-renders on reference change; select small values and memoize derived data.',
    },

    {
      id: 'selectors-reselect',
      title: 'Selectors and Reselect memoization',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Selectors are functions that read and derive data from state; createSelector caches the result until its inputs change.',
      what: [
        "A selector is a function that takes the whole state and returns some piece of it: `const selectUser = (state) => state.user`. Keeping these in one place means components don't need to know the shape of the state.",
        "Some data is derived: a filtered list, a total, a sorted view. `createSelector` (from Reselect, re-exported by RTK) builds a memoized selector. It recomputes only when its input selectors return new values; otherwise it returns the cached result, the same reference.",
      ],
      deeper: [
        "createSelector takes input selectors and a result function. On each call it runs the input selectors, compares their results with the last call using `===`, and only runs the result function if any input changed.",
        "By default the cache in Reselect 5 uses `weakMapMemoize`, which can remember results for different arguments. Older versions kept only the last result, so a selector shared by several components with different props kept missing the cache. A common fix in older code was to create one selector instance per component with `useMemo`.",
        "Don't memoize trivial lookups like `s => s.user.name`; they're already cheap and stable. Memoize when the result function creates a new object or array, or does real work.",
        "Store the minimal state, derive the rest. Keeping `items` and also `total` in state means you must keep them in sync. Derive `total` with a selector instead.",
      ],
      why: "Derived data computed inside useSelector produces a new reference every time, causing re-renders on every action and repeated expensive work. Memoized selectors fix both.",
      analogy: "A cached exam result. If neither your answers nor the marking scheme changed, the examiner hands you the same result slip without re-marking the paper.",
      code: {
        lang: 'js',
        source: `import { createSelector } from '@reduxjs/toolkit'; // re-exported from reselect

const state1 = {
  todos: [
    { id: 1, text: 'Write tests', done: true },
    { id: 2, text: 'Fix bug', done: false },
  ],
  filter: 'done',
  theme: 'dark',
};

// Input selectors: plain, cheap lookups
const selectTodos = (state) => state.todos;
const selectFilter = (state) => state.filter;

let runs = 0;
// Memoized selector: recomputes only when todos or filter change
const selectVisibleTodos = createSelector([selectTodos, selectFilter], (todos, filter) => {
  runs++;
  return filter === 'done' ? todos.filter((t) => t.done) : todos;
});

const a = selectVisibleTodos(state1);
const b = selectVisibleTodos({ ...state1, theme: 'light' }); // unrelated change
console.log('same array?', a === b, '| runs:', runs);

const state2 = { ...state1, todos: [...state1.todos, { id: 3, text: 'Ship', done: true }] };
const c = selectVisibleTodos(state2);
console.log(c.map((t) => t.text), '| runs:', runs);

// Without memoization, .filter returns a NEW array every call
const selectVisibleNaive = (s) => s.todos.filter((t) => t.done);
console.log('naive same array?', selectVisibleNaive(state1) === selectVisibleNaive(state1));`,
      },
      output: "It prints `same array? true | runs: 1`: changing the theme didn't change todos or filter, so the cached array came back. Then `[ 'Write tests', 'Ship' ] | runs: 2`, because todos changed. Finally `naive same array? false`: the plain filter gives a new array every time, which would re-render a useSelector component on every action.",
      questions: [
        { q: 'What is a selector?', a: 'A function that takes the Redux state and returns some part of it or something derived from it. It hides the state shape from components.' },
        { q: 'How does createSelector decide whether to recompute?', a: 'It runs the input selectors and compares their results with the previous ones by reference. If all are the same, it returns the cached result without calling the result function.' },
        { q: 'Why does memoization matter with useSelector?', a: 'useSelector re-renders when the selected value changes by reference. A memoized selector returns the same reference until inputs change, so components skip needless re-renders.' },
        { q: 'Should you store derived data in Redux?', a: 'Usually not. Store the minimal source data and derive totals, filtered lists and counts with selectors, so nothing can go out of sync.' },
      ],
      answer30: "Selectors are functions that read data from state, so components don't depend on its shape. For derived data like filtered lists I use createSelector: it takes input selectors and a result function, and only recomputes when an input changes by reference; otherwise it returns the cached result. That avoids repeated work and, more importantly, keeps the same reference, so useSelector doesn't re-render the component on every unrelated action.",
      mistakes: [
        'Using an input selector that itself returns a new object, like `s => ({ ...s.user })`. The cache never hits.',
        'Memoizing trivial lookups, which adds overhead and no benefit.',
        'Mutating state so the reference stays the same, which makes memoized selectors return stale data.',
        "Trap: 'Is createSelector's result function an identity function okay?' No. `createSelector([selectTodos], todos => todos)` is pointless; Reselect 5 warns about it in development.",
      ],
      takeaway: 'Keep state minimal, derive with selectors, and memoize derived arrays and objects with createSelector.',
    },

    {
      id: 'redux-middleware',
      title: 'Middleware: the concept',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Middleware sits between dispatch and the reducer, so it can log, block, transform, or start side effects for any action.',
      what: [
        "Reducers can't do side effects. Middleware is where that work goes. Every dispatched action passes through a chain of middleware functions before it reaches the reducers.",
        "Each middleware can look at the action, pass it on with `next(action)`, change it, stop it, dispatch other actions, or start async work. Logging, analytics, crash reporting, thunks, sagas and RTK Query are all middleware.",
      ],
      deeper: [
        "The signature is three nested functions: `store => next => action => { ... }`. `store` gives `getState` and `dispatch`; `next` calls the next middleware in the chain (or the reducer at the end). Calling `store.dispatch` instead of `next` sends the action back to the start of the chain.",
        "Thunk middleware is tiny: if the action is a function, call it with `(dispatch, getState)` instead of passing it on. That's how `dispatch(asyncFunction)` works.",
        "In RTK, `configureStore` has default middleware (thunk, plus immutability and serializability checks in development). To add yours, use the callback: `middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)`. Passing a plain array replaces the defaults, so you lose thunk and the checks.",
        "RTK also has `createListenerMiddleware`, a lighter built-in alternative to sagas for 'when action X happens, run this async logic'.",
      ],
      why: "It gives one central place for cross-cutting behaviour, so you don't scatter logging, auth handling, or async logic across components.",
      analogy: "Airport security lanes between check-in and the plane. Every passenger (action) walks through them in order. One lane scans, one checks passports, one may turn you away. Only then do you board (reach the reducer).",
      code: {
        lang: 'js',
        source: `import { configureStore, createSlice } from '@reduxjs/toolkit';

const counter = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: { incremented: (s) => { s.value += 1; } },
});

// Middleware signature: store => next => action => result
const logger = (store) => (next) => (action) => {
  console.log('before', action.type, store.getState().counter.value);
  const result = next(action); // pass to the next middleware / reducer
  console.log('after ', action.type, store.getState().counter.value);
  return result;
};

// Blocks actions marked read-only
const readOnlyGuard = (store) => (next) => (action) => {
  if (action.meta?.readOnly) {
    console.log('blocked', action.type);
    return; // never reaches the reducer
  }
  return next(action);
};

const store = configureStore({
  reducer: { counter: counter.reducer },
  // keep RTK's defaults (thunk + dev checks) and add ours
  middleware: (getDefault) => getDefault().concat(readOnlyGuard, logger),
});

store.dispatch(counter.actions.incremented());
store.dispatch({ type: 'counter/incremented', meta: { readOnly: true } });
console.log('final', store.getState().counter.value);`,
      },
      output: "It logs `before counter/incremented 0`, `after  counter/incremented 1`, then `blocked counter/incremented`, then `final 1`. The first action went through both middleware to the reducer. The second was stopped by the guard, so the logger and the reducer never saw it.",
      questions: [
        { q: 'What is Redux middleware?', a: 'A function in a chain between `dispatch` and the reducers. It can inspect, change, block or delay actions and run side effects. Thunks, sagas and RTK Query are all built as middleware.' },
        { q: 'Explain the `store => next => action` signature.', a: '`store` gives getState and dispatch, `next` passes the action to the next middleware or the reducer, and the innermost function runs for each action. The currying lets Redux build the chain once.' },
        { q: 'next(action) vs store.dispatch(action) inside middleware?', a: '`next` continues down the chain from this point. `store.dispatch` restarts the action at the top, through every middleware again. Using dispatch for the same action causes an infinite loop.' },
        { q: 'How do you add custom middleware with configureStore without losing the defaults?', a: 'Use the callback form: `middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(myMiddleware)`. A plain array replaces the defaults, including thunk.' },
      ],
      answer30: "Middleware sits between dispatch and the reducers. Every action passes through the chain, and each middleware can log it, change it, block it, dispatch more actions, or start async work, which reducers aren't allowed to do. The signature is store, then next, then action. Thunk, saga and RTK Query are all middleware. In RTK I add mine with getDefaultMiddleware().concat so I keep thunk and the dev checks.",
      mistakes: [
        'Forgetting to call `next(action)`, which silently swallows every action.',
        'Calling `store.dispatch(action)` with the same action inside middleware, causing an infinite loop.',
        'Passing a plain array to `middleware` in configureStore and losing thunk and the dev checks.',
        "Trap: 'Is a thunk middleware?' The thunk function itself isn't; redux-thunk is the middleware that lets you dispatch functions.",
      ],
      takeaway: 'Middleware is the chain between dispatch and reducers where side effects and cross-cutting logic live.',
    },

    {
      id: 'create-async-thunk',
      title: 'Async logic with thunks and createAsyncThunk',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'A thunk is a function you dispatch to run async code; createAsyncThunk wraps a promise and dispatches pending, fulfilled and rejected actions.',
      what: [
        "Reducers must be synchronous and pure, so API calls go somewhere else. The simplest place is a **thunk**: a function you dispatch instead of an action. The thunk middleware calls it with `dispatch` and `getState`, so it can await an API and then dispatch normal actions.",
        "`createAsyncThunk` is RTK's helper for the common pattern 'call an API, track loading, store the result or the error'. You give it a type prefix and an async function. It automatically dispatches `pending` before, then `fulfilled` with the result or `rejected` with the error.",
      ],
      deeper: [
        "You handle those three actions in a slice's `extraReducers`. A common state shape is `status: 'idle' | 'loading' | 'succeeded' | 'failed'` plus `error`, which avoids impossible combinations like `loading: true, error: 'x'`.",
        "Use `rejectWithValue(value)` to return a clean error payload (like the server's message) instead of the serialized Error. `dispatch(thunk()).unwrap()` returns a promise that resolves to the payload or throws, which is handy in a component for showing a toast or navigating.",
        "The thunk receives `{ signal }`; pass it to `fetch` so `promise.abort()` cancels the request. The `condition` option can skip a fetch if data is already loading. Thunks are fine for simple flows; for caching, refetching and deduplication of server data, RTK Query is usually better.",
      ],
      why: "Every app talks to APIs. createAsyncThunk standardizes the loading, success and error lifecycle so you don't hand-write three action types and their logic for every request.",
      analogy: "Ordering food delivery. The app shows 'order placed' (pending), then either 'delivered' (fulfilled) or 'cancelled, here's why' (rejected). You don't stand at the restaurant; you get status updates.",
      code: {
        lang: 'js',
        source: `import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fake API so this runs in Node
const api = {
  getUser: (id) =>
    new Promise((resolve, reject) =>
      setTimeout(() => (id > 0 ? resolve({ id, name: 'Asha' }) : reject(new Error('Not found'))), 50)),
};

export const fetchUser = createAsyncThunk('user/fetch', async (id, { rejectWithValue }) => {
  try {
    return await api.getUser(id); // becomes action.payload of 'fulfilled'
  } catch (err) {
    return rejectWithValue(err.message); // becomes action.payload of 'rejected'
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: { data: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(fetchUser.fulfilled, (s, a) => { s.status = 'succeeded'; s.data = a.payload; })
      .addCase(fetchUser.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload; });
  },
});

const store = configureStore({ reducer: { user: userSlice.reducer } });
store.subscribe(() => console.log(store.getState().user.status));

const ok = await store.dispatch(fetchUser(7));
console.log(ok.type, store.getState().user.data);

const bad = await store.dispatch(fetchUser(-1));
console.log(bad.type, store.getState().user.error);

// .unwrap() gives the payload or throws, handy in components
try { await store.dispatch(fetchUser(-1)).unwrap(); } catch (e) { console.log('unwrap threw:', e); }`,
      },
      output: "The log reads: `loading`, `succeeded`, `user/fetch/fulfilled { id: 7, name: 'Asha' }`, then `loading`, `failed`, `user/fetch/rejected Not found`, then `loading`, `failed`, `unwrap threw: Not found`. Each dispatch produced a pending action and then a fulfilled or rejected one. Note that awaiting `dispatch(thunk)` never throws by itself; only `.unwrap()` does.",
      questions: [
        { q: 'What is a thunk in Redux?', a: 'A function you dispatch instead of an action object. The thunk middleware calls it with dispatch and getState, so it can run async code and dispatch real actions when done.' },
        { q: 'What actions does createAsyncThunk dispatch?', a: 'Three, named from the prefix: `prefix/pending` before the call, then `prefix/fulfilled` with the returned value or `prefix/rejected` with the error.' },
        { q: 'Why use rejectWithValue?', a: 'To put a meaningful, serializable error (like the API error message or validation errors) in `action.payload` instead of the generic serialized Error in `action.error`.' },
        { q: 'What does .unwrap() do?', a: 'Awaiting a dispatched async thunk always resolves to the final action. `.unwrap()` instead resolves to the payload or throws on rejection, so you can use try/catch in a component.' },
        { q: 'When would you pick RTK Query over createAsyncThunk?', a: 'For fetching and caching server data: RTK Query handles caching, deduplication, refetching and invalidation automatically. createAsyncThunk suits one-off async workflows that aren\'t just cache reads.' },
      ],
      answer30: "Reducers can't be async, so API calls go in thunks: functions you dispatch that get dispatch and getState. createAsyncThunk wraps that pattern. I give it a type and an async function, and it dispatches pending, then fulfilled with the result or rejected with the error. I handle those in extraReducers with a status field. I use rejectWithValue for clean error payloads and unwrap in components when I need try/catch. For plain data fetching I'd prefer RTK Query.",
      mistakes: [
        "Using separate `loading` and `error` booleans that can contradict each other. A single `status` string is clearer.",
        "Expecting `await dispatch(fetchUser())` to throw on failure. It resolves with a rejected action; use `.unwrap()`.",
        'Putting the API call in the reducer or in a component and dispatching raw data with no loading or error state.',
        "Trap: 'Is the order of responses guaranteed?' No. Two quick dispatches can resolve out of order; abort the old one via `promise.abort()` and `signal`, or use RTK Query or takeLatest in sagas.",
      ],
      takeaway: 'Thunks run async code; createAsyncThunk gives you pending, fulfilled and rejected for free.',
    },

    {
      id: 'rtk-query',
      title: 'RTK Query',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'RTK Query is a data-fetching and caching layer built into Redux Toolkit that generates hooks from API endpoint definitions.',
      what: [
        "RTK Query is part of Redux Toolkit. You describe your API's endpoints once with `createApi`, and it generates React hooks like `useGetJobsQuery` and `useCreateJobMutation`.",
        "The hooks handle loading and error state, cache the results, share one request when several components ask for the same data, and refetch when data is marked stale. You stop writing thunks, loading flags and 'store the response' reducers for server data.",
      ],
      deeper: [
        "Cache entries are keyed by endpoint plus arguments. When no component uses an entry any more, it's kept for `keepUnusedDataFor` (60 seconds by default) and then removed.",
        "Invalidation uses tags. A query says what it `providesTags` (for example `[{ type: 'Job', id: 'LIST' }]`); a mutation says what it `invalidatesTags`. After the mutation succeeds, every query with a matching tag refetches automatically.",
        "Other features: `pollingInterval`, `refetchOnFocus` and `refetchOnReconnect` (these two need `setupListeners(store.dispatch)`), `skip` to delay a query, optimistic updates with `onQueryStarted` and `updateQueryData`, and `baseQuery` wrappers for adding auth headers or refreshing tokens on 401.",
        "It's very similar in purpose to TanStack Query. RTK Query fits teams already on Redux, since cache state is visible in Redux DevTools. TanStack Query has no Redux dependency.",
      ],
      why: "Most 'global state' in typical apps is just server data. Hand-writing fetch, loading, error, caching and refetching logic for each endpoint is repetitive and buggy. RTK Query does it from one definition.",
      analogy: "A smart library desk. You ask for a book (query); if someone just checked it out, you get a copy from the shelf instead of a new order. When the publisher sends a new edition (mutation invalidates tags), the desk swaps out every stale copy automatically.",
      code: {
        lang: 'tsx',
        source: `import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type Job = { id: string; title: string };

export const jobsApi = createApi({
  reducerPath: 'jobsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api', credentials: 'include' }), // send cookies
  tagTypes: ['Job'],
  endpoints: (build) => ({
    getJobs: build.query<Job[], void>({
      query: () => '/jobs',
      providesTags: (result) =>
        result
          ? [...result.map((j) => ({ type: 'Job' as const, id: j.id })), { type: 'Job', id: 'LIST' }]
          : [{ type: 'Job', id: 'LIST' }],
    }),
    createJob: build.mutation<Job, Partial<Job>>({
      query: (body) => ({ url: '/jobs', method: 'POST', body }),
      invalidatesTags: [{ type: 'Job', id: 'LIST' }], // refetch the list afterwards
    }),
  }),
});

export const { useGetJobsQuery, useCreateJobMutation } = jobsApi;

// store.ts: add the reducer AND the middleware
// configureStore({
//   reducer: { [jobsApi.reducerPath]: jobsApi.reducer },
//   middleware: (gdm) => gdm().concat(jobsApi.middleware),
// });

export function JobList() {
  const { data = [], isLoading, isError } = useGetJobsQuery();
  const [createJob, { isLoading: saving }] = useCreateJobMutation();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Could not load jobs.</p>;
  return (
    <>
      <button disabled={saving} onClick={() => createJob({ title: 'Node.js Engineer' })}>Add job</button>
      <ul>{data.map((j) => <li key={j.id}>{j.title}</li>)}</ul>
    </>
  );
}`,
      },
      output: "On mount, JobList shows 'Loading...', then the list. If two components call `useGetJobsQuery()` at once, only one request is sent. Clicking 'Add job' posts the new job; on success the 'LIST' tag is invalidated, so the jobs query refetches and the new job appears without any manual state update.",
      questions: [
        { q: 'What is RTK Query?', a: 'A data-fetching and caching tool included in Redux Toolkit. You define endpoints with createApi and get generated hooks that manage loading, errors, caching, deduplication and refetching.' },
        { q: 'How does cache invalidation work in RTK Query?', a: 'Queries declare tags with providesTags and mutations declare invalidatesTags. When a mutation succeeds, any cached query with a matching tag is refetched.' },
        { q: 'What two things must you add to the store?', a: 'The API slice reducer under its `reducerPath`, and its middleware with `getDefaultMiddleware().concat(api.middleware)`. Without the middleware, caching lifetimes, invalidation and polling do not work.' },
        { q: 'RTK Query vs createAsyncThunk?', a: 'RTK Query is for server state: it caches and syncs data automatically. createAsyncThunk is a lower-level tool for one-off async workflows where you manage the state yourself.' },
      ],
      answer30: "RTK Query is the data-fetching layer in Redux Toolkit. I define endpoints with createApi, and it generates hooks like useGetJobsQuery that handle loading, errors, caching and request deduplication. Mutations invalidate tags that queries provide, so related lists refetch automatically after a create or update. I add its reducer and middleware to the store. It replaces most hand-written thunks and loading flags for server data.",
      mistakes: [
        'Forgetting to add `api.middleware` to the store.',
        'Copying query results into a separate slice, which creates two sources of truth.',
        "Forgetting tags, then wondering why a list doesn't update after a mutation.",
        "Trap: 'Does refetchOnFocus work out of the box?' Only after calling `setupListeners(store.dispatch)` once.",
      ],
      takeaway: 'Define endpoints once, get cached hooks, and let tags handle refetching after mutations.',
    },

    {
      id: 'redux-saga-basics',
      title: 'Redux-Saga basics: generators and effects',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Sagas are generator functions run by middleware; they yield effect objects like call, put, take and fork that describe side effects.',
      what: [
        "Redux-Saga is middleware for complex side effects. A saga is a generator function (`function*`) that listens for actions and runs async work, like API calls, in response.",
        "Instead of doing the work directly, a saga **yields effects**: plain objects that describe what to do. `call(fn, ...args)` means 'call this function and wait for its result'. `put(action)` means 'dispatch this action'. `take(type)` means 'pause until this action is dispatched'. `fork(saga)` means 'start this saga in the background'. The saga middleware reads each effect, performs it, and resumes the generator with the result.",
      ],
      deeper: [
        "Generators can pause at `yield` and be resumed with a value from outside (`gen.next(value)`). That's what lets sagas look like synchronous code while waiting on promises, and what makes them easy to test: you can step through and check each yielded effect without running anything.",
        "The usual structure is **watcher** sagas that wait for actions and **worker** sagas that do the job. A root saga starts all watchers with `all([...])` or `fork`. `select(selector)` reads current state.",
        "`call` is blocking: the saga waits. `fork` is non-blocking and **attached**: the parent waits for forked children before finishing, an error in a child bubbles up to the parent, and cancelling the parent cancels its children. `spawn` creates a **detached** task that does neither.",
        "Effects run after the reducers: a saga sees an action after the reducers have already processed it.",
      ],
      why: "Thunks get messy for long-running or coordinated flows: background polling, cancelling stale requests, timeouts, retries, websockets, multi-step wizards. Sagas handle these with readable, testable code.",
      analogy: "A film director with a script. The saga writes instructions ('call the API', 'dispatch success'); the crew (middleware) carries them out and reports back. Because it's only instructions, you can review the script without filming anything.",
      code: {
        lang: 'js',
        source: `import { configureStore, createSlice } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { call, put, take, fork, select } from 'redux-saga/effects';

const api = { fetchJobs: (tenant) => new Promise((r) => setTimeout(() => r([\`\${tenant}-job-1\`, \`\${tenant}-job-2\`]), 50)) };

const jobs = createSlice({
  name: 'jobs',
  initialState: { list: [], loading: false, tenant: 'acme' },
  reducers: {
    fetchRequested: (s) => { s.loading = true; },
    fetchSucceeded: (s, a) => { s.loading = false; s.list = a.payload; },
  },
});
const { fetchRequested, fetchSucceeded } = jobs.actions;

// Worker saga: does the actual work for one action
function* loadJobs() {
  const tenant = yield select((s) => s.jobs.tenant); // read from the store
  const list = yield call(api.fetchJobs, tenant);    // call a function (async ok)
  yield put(fetchSucceeded(list));                    // dispatch an action
}

// Watcher saga: waits for actions, forks a worker for each
function* watchJobs() {
  while (true) {
    yield take(fetchRequested.type); // pause until this action is dispatched
    console.log('saga saw', fetchRequested.type);
    yield fork(loadJobs);            // start worker, don't block the loop
  }
}

function* rootSaga() {
  yield fork(watchJobs);
}

const sagaMiddleware = createSagaMiddleware();
const store = configureStore({
  reducer: { jobs: jobs.reducer },
  middleware: (getDefault) => getDefault({ thunk: false }).concat(sagaMiddleware),
});
sagaMiddleware.run(rootSaga); // after the store is created

store.dispatch(fetchRequested());
console.log('loading?', store.getState().jobs.loading);
setTimeout(() => console.log('after 100ms:', store.getState().jobs), 100);

// Effects are just plain objects describing what to do
console.log(call(api.fetchJobs, 'acme').type, put(fetchSucceeded([])).type);`,
      },
      output: "It logs `saga saw jobs/fetchRequested`, `loading? true`, `CALL PUT` (effects are plain objects with a type), and after 100ms `after 100ms: { list: [ 'acme-job-1', 'acme-job-2' ], loading: false, tenant: 'acme' }`. The reducer set loading first; the saga then read the tenant, called the API and dispatched the result.",
      questions: [
        { q: 'What is Redux-Saga?', a: 'Middleware that runs generator functions (sagas) to handle side effects. Sagas listen for actions and yield effect objects like call, put and take, which the middleware executes.' },
        { q: 'Why generators?', a: 'A generator can pause at each yield and be resumed with a result. That lets sagas write async flows like synchronous code, and lets tests step through the yielded effects without running real API calls.' },
        { q: 'call vs fork?', a: '`call` is blocking: the saga waits for the result. `fork` starts a task in the background and continues immediately. Forked tasks are attached, so errors bubble to the parent and cancelling the parent cancels them.' },
        { q: 'fork vs spawn?', a: '`fork` creates an attached child: errors propagate up and cancellation flows down. `spawn` creates a detached task with its own lifecycle, so its failure does not kill the parent.' },
        { q: 'What does put do?', a: 'It describes dispatching an action. The middleware dispatches it to the store, just like `store.dispatch`.' },
      ],
      answer30: "Redux-Saga is middleware that runs generator functions. A saga yields effects, which are plain objects describing work: call to run a function and wait, put to dispatch, take to wait for an action, fork to start a background task, select to read state. The middleware executes each effect and resumes the generator with the result. I structure it as watchers that listen for actions and workers that do the job. Because effects are just objects, sagas are easy to test step by step.",
      mistakes: [
        "Calling the API directly, `yield api.fetch()`, instead of `yield call(api.fetch)`. It works, but you lose testability, since the test now runs the real function.",
        'Forgetting `sagaMiddleware.run(rootSaga)` after creating the store, so nothing listens.',
        'Using `call` where you meant `fork` in a watcher loop, so it blocks and misses actions dispatched during the call.',
        "Trap: 'Does a saga see an action before the reducer?' No. Reducers run first; the saga sees the action after state is updated.",
      ],
      takeaway: 'Sagas are generators that yield effect descriptions; the middleware runs them, which makes complex async flows readable and testable.',
    },

    {
      id: 'saga-take-helpers',
      title: 'takeEvery vs takeLatest vs takeLeading',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'takeEvery runs a worker for every action, takeLatest cancels the previous one, takeLeading ignores new ones while one is running.',
      what: [
        "These are helper effects that start a worker saga when an action is dispatched. They differ in what happens when the same action arrives again while the previous worker is still running.",
        "**takeEvery**: start a new worker for every action; they run in parallel. **takeLatest**: cancel the running worker and start a new one, so only the latest finishes. **takeLeading**: run the first one and ignore new actions until it finishes.",
      ],
      deeper: [
        "Typical uses: takeEvery for independent work like logging or 'add to cart' for different items. takeLatest for search-as-you-type, filters, or switching tabs, where only the newest request matters. takeLeading for 'Submit' or 'Pay' buttons, where double clicks must not create duplicates.",
        "takeLatest cancels the saga, which stops it at its current yield so it won't `put` stale results. It doesn't abort the underlying network request unless you wire that up: catch cancellation with `cancelled()` in `finally` and call `controller.abort()`.",
        "Under the hood they're built from `take` and `fork` in a loop. Other related helpers: `throttle(ms, pattern, worker)` and `debounce(ms, pattern, worker)`.",
      ],
      why: "Rapid repeated actions are normal: typing, double clicks, fast tab switches. Picking the right helper prevents race conditions (old results overwriting new ones) and duplicate submissions without extra code.",
      analogy: "A taxi dispatcher. takeEvery sends a taxi for every call. takeLatest cancels the previous taxi when you call again with a new address. takeLeading says 'your taxi is already on its way' and ignores repeat calls.",
      code: {
        lang: 'js',
        source: `import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { takeEvery, takeLatest, takeLeading, delay, all } from 'redux-saga/effects';

const log = [];
function makeWorker(name) {
  return function* (action) {
    yield delay(100); // pretend API call
    log.push(\`\${name} finished \${action.payload}\`);
  };
}

function* rootSaga() {
  yield all([
    takeEvery('EVERY', makeWorker('every')),       // runs all of them in parallel
    takeLatest('LATEST', makeWorker('latest')),    // cancels the older running one
    takeLeading('LEADING', makeWorker('leading')), // ignores new ones while busy
  ]);
}

const sagaMiddleware = createSagaMiddleware();
const store = configureStore({
  reducer: (s = {}) => s,
  middleware: (getDefault) => getDefault().concat(sagaMiddleware),
});
sagaMiddleware.run(rootSaga);

for (const type of ['EVERY', 'LATEST', 'LEADING']) {
  ['a', 'ab', 'abc'].forEach((q) => store.dispatch({ type, payload: q })); // 3 quick keystrokes or clicks
}

setTimeout(() => console.log(log.join('\\n')), 300);`,
      },
      output: "It prints `every finished a`, `every finished ab`, `every finished abc`, `latest finished abc`, `leading finished a`. takeEvery ran all three; takeLatest cancelled 'a' and 'ab' and finished only 'abc'; takeLeading finished only the first and ignored the other two.",
      questions: [
        { q: 'takeEvery vs takeLatest?', a: 'takeEvery forks a new worker for every matching action, all running in parallel. takeLatest cancels any running worker and keeps only the newest, so stale results never land.' },
        { q: 'When would you use takeLeading?', a: 'For actions that must not run twice at once, like form submit or payment. While the first worker runs, repeated actions are ignored.' },
        { q: 'Which helper for search-as-you-type?', a: 'takeLatest, often combined with debounce. Only the latest query should update the results, and earlier requests are cancelled.' },
        { q: 'Does takeLatest abort the HTTP request?', a: 'It cancels the saga, so it never dispatches the stale result. The network request itself keeps going unless you abort it, for example with an AbortController in a `finally` block that checks `cancelled()`.' },
      ],
      answer30: "All three start a worker saga when an action arrives; they differ when it arrives again while a worker is running. takeEvery runs every one in parallel, good for independent work. takeLatest cancels the previous worker and keeps only the newest, which is what I want for search or filters so stale responses never overwrite fresh ones. takeLeading runs the first and ignores the rest until it finishes, which prevents double submits.",
      mistakes: [
        'Using takeEvery for search or filters, so responses can arrive out of order and show stale data.',
        'Using takeLatest for submit buttons; a second click cancels the first saga even though the request may already have reached the server.',
        "Assuming cancellation aborts the fetch. It only stops the saga.",
        "Trap: 'What if the actions carry different ids, like loading two different users?' takeLatest would cancel one of them. Use takeEvery, or key the work per id.",
      ],
      takeaway: 'takeEvery = all in parallel, takeLatest = only the newest, takeLeading = only the first until it finishes.',
    },

    {
      id: 'saga-cancellation-race-debounce',
      title: 'Saga cancellation, race, and debouncing',
      level: 'advanced',
      priority: 'good',
      frequency: 'occasional',
      summary: 'Sagas can be cancelled from outside, raced against each other or a timeout, and debounced, which makes polling and timeouts simple.',
      note: "On your resume: the bulk-upload screen polls a status endpoint. This is how you'd build that poller with sagas; only describe it as your implementation if that's how yours worked.",
      what: [
        "A forked saga returns a **task**. You can stop it later with `cancel(task)`. The saga stops at its current `yield`, and its `finally` block runs, where `yield cancelled()` tells you it was cancelled rather than finished normally.",
        "`race({ a: effectA, b: effectB })` runs effects at the same time and returns as soon as the first one finishes. The losers are cancelled automatically. That's how you add a timeout or a 'Cancel' button to a request.",
        "`debounce(ms, pattern, worker)` waits until no matching action has arrived for `ms` milliseconds, then runs the worker with the last action. Perfect for search-as-you-type.",
      ],
      deeper: [
        "A common pattern is start/stop polling: wait for `POLL_START`, fork the polling loop, wait for `POLL_STOP` (or a race between stop and 'job finished'), then cancel the task. Cancellation flows down through all attached forks, so children stop too.",
        "In the `finally` block you clean up: abort the fetch, close a websocket channel, or dispatch a 'stopped' action. Without it, a cancelled saga just silently stops.",
        "`all([...])` runs effects in parallel and waits for all of them; if one fails, the others are cancelled. `race` waits for the first. Together with `delay`, these replace most hand-written timer and Promise.race logic.",
      ],
      why: "Real flows need to stop: leaving a page should stop polling, a slow request should time out, and typing should not fire a request per keystroke. Sagas make these first-class instead of a tangle of timers and flags.",
      analogy: "race is a relay of two runners where the first to cross the line wins and the other is told to stop running. cancel is the referee's whistle: the player stops where they are and walks off (the finally block).",
      code: {
        lang: 'js',
        source: `import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { call, take, fork, cancel, cancelled, race, delay, debounce, all } from 'redux-saga/effects';

const log = (...m) => console.log(...m);
const slowApi = (ms, value) => new Promise((r) => setTimeout(() => r(value), ms));

// 1) Polling that can be stopped: fork + cancel + cancelled()
function* pollStatus() {
  try {
    while (true) {
      const s = yield call(slowApi, 30, 'processing');
      log('poll:', s);
      yield delay(30);
    }
  } finally {
    if (yield cancelled()) log('poll: cancelled, cleaning up');
  }
}
function* watchPolling() {
  yield take('POLL_START');
  const task = yield fork(pollStatus);
  yield take('POLL_STOP');
  yield cancel(task); // runs the finally block in pollStatus
}

// 2) Timeout with race: whichever finishes first wins, the loser is cancelled
function* fetchWithTimeout() {
  yield take('FETCH');
  const { data, timeout } = yield race({
    data: call(slowApi, 200, 'report ready'),
    timeout: delay(80),
  });
  log(timeout ? 'race: timed out' : \`race: \${data}\`);
}

// 3) Debounce: run only after 50ms of silence
function* search(action) { log('search for:', action.payload); }

function* rootSaga() {
  yield all([fork(watchPolling), fork(fetchWithTimeout), debounce(50, 'SEARCH', search)]);
}

const sagaMiddleware = createSagaMiddleware();
const store = configureStore({ reducer: (s = {}) => s, middleware: (gd) => gd().concat(sagaMiddleware) });
sagaMiddleware.run(rootSaga);

store.dispatch({ type: 'POLL_START' });
setTimeout(() => store.dispatch({ type: 'POLL_STOP' }), 140);
store.dispatch({ type: 'FETCH' });
['r', 're', 'rea', 'react'].forEach((q, i) => setTimeout(() => store.dispatch({ type: 'SEARCH', payload: q }), i * 10));`,
      },
      output: "It logs `poll: processing`, `race: timed out`, `search for: react`, `poll: processing`, `poll: cancelled, cleaning up`. The poller ran twice before POLL_STOP cancelled it and its finally block ran. The 80ms timeout beat the 200ms API in the race. Four quick searches produced one search, for the last value.",
      questions: [
        { q: 'How do you cancel a running saga?', a: 'Keep the task returned by `fork` and later `yield cancel(task)`. The saga stops at its current yield and its finally block runs; `yield cancelled()` there tells you it was cancelled.' },
        { q: 'How would you add a timeout to an API call in a saga?', a: '`yield race({ data: call(api), timeout: delay(5000) })`. Whichever finishes first wins and the other effect is cancelled automatically.' },
        { q: 'How do you start and stop polling with sagas?', a: 'Wait for a start action, fork a loop of call plus delay, wait for a stop action, then cancel the forked task. Cleanup goes in the loop\'s finally block.' },
        { q: 'race vs all?', a: '`all` runs effects in parallel and waits for all to finish, failing fast if one throws. `race` returns as soon as the first finishes and cancels the rest.' },
        { q: 'debounce vs throttle in sagas?', a: 'debounce runs the worker once activity stops for the given time, using the last action. throttle runs at most once per time window, ignoring actions in between.' },
      ],
      answer30: "A forked saga returns a task that I can cancel. Cancellation stops the saga at its current yield and runs its finally block, where cancelled() lets me clean up, like aborting a request. That's how I'd build start/stop polling. race runs effects together and keeps the first to finish, cancelling the others, so a timeout is just a race against delay. And debounce runs the worker only after the actions stop, which suits search-as-you-type.",
      mistakes: [
        "Not using try/finally in long-running sagas, so cancellation can't clean up.",
        'Polling with a forked loop that is never cancelled when the user leaves the page.',
        'Writing your own timers and flags for timeouts when `race` with `delay` does it.',
        "Trap: 'If race cancels the losing call, is the HTTP request aborted?' Only if that saga aborts it in its finally block; otherwise the request completes and the result is ignored.",
      ],
      takeaway: 'fork returns a cancellable task; race picks the first finisher; debounce waits for quiet. Clean up in finally.',
    },

    {
      id: 'saga-error-handling',
      title: 'Error handling in sagas',
      level: 'advanced',
      priority: 'good',
      frequency: 'occasional',
      summary: 'Wrap worker sagas in try/catch and dispatch failure actions; an uncaught error bubbles up and can kill the root saga and every watcher.',
      what: [
        "When a `call` effect rejects, the error is thrown back into the saga at that `yield`. You catch it with normal `try/catch` and usually `put` a failure action so the UI can show it.",
        "If you don't catch it, the error bubbles up through attached forks to the parent. In a root saga built with `all([...])` or `fork`, that kills the root saga and every other watcher. From then on, sagas stop responding to actions, and the app looks frozen with no obvious error.",
      ],
      deeper: [
        "Best practice: put try/catch in every worker saga. The `takeEvery` and `takeLatest` helpers fork workers as attached children of the watcher, so an uncaught worker error kills the watcher and then the root.",
        "Use `retry(maxTries, delayMs, fn, ...args)` for flaky calls. For extra safety some teams start each watcher with `spawn` in a loop that restarts it after a crash, but that hides bugs; catching in workers is the main defence.",
        "`createSagaMiddleware({ onError })` is the last-chance hook for uncaught errors; send them to your error tracker there.",
      ],
      why: "A single unhandled API error should show a toast, not silently disable every saga in the app. Knowing how errors propagate through forks is what prevents that.",
      analogy: "Attached forks are climbers on one rope. If one falls and nobody catches them (try/catch), they pull the whole team down. Catching the fall at each climber keeps the rest climbing.",
      code: [
        {
          lang: 'js',
          title: 'Catch in workers, retry flaky calls',
          source: `import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { call, put, takeLatest, retry, all } from 'redux-saga/effects';

let attempts = 0;
const flakyApi = async () => {
  attempts++;
  if (attempts < 3) throw new Error(\`503 on attempt \${attempts}\`);
  return { saved: true };
};
const brokenApi = async () => { throw new Error('500 Internal Server Error'); };

function* saveProfile() {
  try {
    const res = yield retry(3, 10, flakyApi); // up to 3 tries, 10ms apart
    yield put({ type: 'profile/saveSucceeded', payload: res });
  } catch (err) {
    yield put({ type: 'profile/saveFailed', error: err.message });
  }
}

function* deleteAccount() {
  try {
    yield call(brokenApi);
  } catch (err) {
    yield put({ type: 'account/deleteFailed', error: err.message });
  }
}

function* rootSaga() {
  yield all([takeLatest('profile/save', saveProfile), takeLatest('account/delete', deleteAccount)]);
}

const seen = () => (next) => (action) => {
  if (!action.type.startsWith('@@')) console.log('action:', action.type, action.error ?? '');
  return next(action);
};
const sagaMiddleware = createSagaMiddleware();
const store = configureStore({ reducer: (s = {}) => s, middleware: (gd) => gd().concat(seen, sagaMiddleware) });
sagaMiddleware.run(rootSaga);

store.dispatch({ type: 'profile/save' });
store.dispatch({ type: 'account/delete' });
setTimeout(() => console.log('attempts:', attempts), 100);`,
        },
        {
          lang: 'js',
          title: 'What happens without try/catch',
          source: `import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { call, takeEvery, all } from 'redux-saga/effects';

const brokenApi = async () => { throw new Error('boom'); };

function* exportReport() {
  yield call(brokenApi); // no try/catch!
}
function* sayHi() { console.log('hi saga still alive'); }

function* rootSaga() {
  yield all([takeEvery('report/export', exportReport), takeEvery('hi', sayHi)]);
}

const sagaMiddleware = createSagaMiddleware({ onError: (e) => console.log('onError:', e.message) });
const store = configureStore({ reducer: (s = {}) => s, middleware: (gd) => gd().concat(sagaMiddleware) });
sagaMiddleware.run(rootSaga);

store.dispatch({ type: 'hi' });
store.dispatch({ type: 'report/export' });
setTimeout(() => { store.dispatch({ type: 'hi' }); console.log('second hi dispatched'); }, 50);`,
        },
      ],
      output: "First snippet: `action: profile/save`, `action: account/delete`, `action: account/deleteFailed 500 Internal Server Error`, `action: profile/saveSucceeded`, then `attempts: 3`. The delete failed cleanly into an action; the save succeeded on the third try. Second snippet: `hi saga still alive`, `onError: boom`, `second hi dispatched`, and nothing else. The uncaught error killed the root saga, so the second 'hi' was never handled, even though the 'hi' saga had nothing to do with the error.",
      questions: [
        { q: 'How do you handle API errors in a saga?', a: 'Wrap the worker in try/catch. A rejected `call` throws at that yield; in catch, `put` a failure action with a useful message so the reducer and UI can react.' },
        { q: 'What happens to an uncaught error in a saga?', a: 'It bubbles up through attached forks to the parent. With a typical root saga, the root and all watchers die, so the app stops responding to saga actions.' },
        { q: 'How would you retry a flaky API call?', a: 'Use `retry(maxTries, delayMs, fn, ...args)`, or a loop with `call` and `delay` for exponential backoff. Still wrap it in try/catch for the final failure.' },
        { q: 'What is onError on the saga middleware?', a: 'A callback for errors that escaped every saga. Use it to report to an error tracker; by then the failing saga tree has already stopped.' },
      ],
      answer30: "Errors from a call effect are thrown back into the saga, so I wrap every worker in try/catch and put a failure action. That matters because forks are attached: an uncaught error in a worker bubbles to its watcher and up to the root saga, killing every watcher, and the app silently stops reacting. For flaky calls I use the retry effect. And I set onError on the middleware to report anything that still escapes.",
      mistakes: [
        'No try/catch in workers, so one failed request disables all sagas.',
        "Swallowing errors in catch without dispatching anything, so the UI shows a spinner forever.",
        'Wrapping the watcher instead of the worker; the watcher still dies because the error bubbles from the forked worker.',
        "Trap: 'Why didn't anything crash visibly?' The error went to onError (or the console) once, and after that the sagas were simply gone.",
      ],
      takeaway: 'try/catch in every worker and put a failure action; uncaught errors kill the whole saga tree.',
    },

    {
      id: 'testing-redux',
      title: 'Testing reducers, thunks, and sagas',
      level: 'intermediate',
      priority: 'good',
      frequency: 'occasional',
      summary: 'Reducers are pure functions you test with inputs and outputs; sagas can be tested step by step on effects or run end to end with runSaga.',
      what: [
        "Reducers are the easiest code in the app to test: call `reducer(state, action)` and check the result. No store, no mocks.",
        "Sagas have two styles. **Unit (step-by-step)**: call the generator, then check each `gen.next()` value equals the expected effect, like `call(api.getUsers)`. You feed fake results back in with `gen.next(fakeData)` or errors with `gen.throw(err)`. **Integration**: run the saga with `runSaga` (or a real store) and assert on what was dispatched or what the final state is.",
      ],
      deeper: [
        "Step-by-step tests are precise but brittle: reordering two harmless effects breaks the test. Integration tests check behaviour, so they survive refactors. The Redux docs now favour integration-style tests, and for components, testing with a real store and React Testing Library over testing slices in isolation.",
        "For thunks, dispatch them against a real `configureStore` and mock the API (Jest mocks, or MSW at the network level), then assert on state. For RTK Query, MSW is the usual tool.",
        "The library `redux-saga-test-plan` adds a fluent API for both styles (`expectSaga(...).provide(...).put(...).run()`). The example below uses Node's built-in test runner; in Jest you'd swap `assert.deepEqual` for `expect().toEqual`.",
      ],
      why: "State logic is the core of the app. Pure reducers and effect-based sagas are designed to be tested without a browser or server, so there is little excuse not to.",
      analogy: "Testing a saga step by step is reading a recipe line by line to check the instructions. Running it with runSaga is actually cooking it and tasting the dish.",
      code: {
        lang: 'js',
        title: 'node --test redux.test.mjs',
        source: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSlice } from '@reduxjs/toolkit';
import { runSaga } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

// ---- code under test ----
const users = createSlice({
  name: 'users',
  initialState: { list: [], error: null },
  reducers: {
    loaded: (s, a) => { s.list = a.payload; },
    failed: (s, a) => { s.error = a.payload; },
  },
});
const api = { getUsers: async () => [{ id: 1 }] };
function* loadUsers() {
  try {
    const list = yield call(api.getUsers);
    yield put(users.actions.loaded(list));
  } catch (e) {
    yield put(users.actions.failed(e.message));
  }
}

// 1) reducer: plain function, no store needed
test('reducer stores loaded users', () => {
  const next = users.reducer(undefined, users.actions.loaded([{ id: 1 }]));
  assert.deepEqual(next, { list: [{ id: 1 }], error: null });
});

// 2) saga, step by step: assert on effect objects
test('saga yields call then put', () => {
  const gen = loadUsers();
  assert.deepEqual(gen.next().value, call(api.getUsers));                   // no real API call happens
  const fake = [{ id: 9 }];
  assert.deepEqual(gen.next(fake).value, put(users.actions.loaded(fake)));  // we feed the "response"
  assert.equal(gen.next().done, true);
});

test('saga error path', () => {
  const gen = loadUsers();
  gen.next();
  assert.deepEqual(gen.throw(new Error('500')).value, put(users.actions.failed('500')));
});

// 3) saga as a whole: runSaga with a fake store
test('runSaga records dispatched actions', async () => {
  const dispatched = [];
  const original = api.getUsers;
  api.getUsers = async () => [{ id: 42 }]; // mock (jest.spyOn in Jest)
  await runSaga({ dispatch: (a) => dispatched.push(a), getState: () => ({}) }, loadUsers).toPromise();
  api.getUsers = original;
  assert.deepEqual(dispatched, [users.actions.loaded([{ id: 42 }])]);
});`,
      },
      output: "All four tests pass (`tests 4`, `pass 4`). The step-by-step tests never call the API: they compare effect objects and feed in fake results or errors. The runSaga test runs the real saga against a fake dispatch and checks the one action it sent.",
      questions: [
        { q: 'How do you test a reducer?', a: 'Call it directly with a starting state and an action, then assert on the returned state. It is a pure function, so no store or mocks are needed.' },
        { q: 'How do you unit test a saga without calling the API?', a: 'Create the generator, and check each `gen.next().value` against the expected effect, such as `call(api.getUsers)`. Feed fake responses with `gen.next(data)` and errors with `gen.throw(err)`.' },
        { q: 'What is the downside of step-by-step saga tests?', a: 'They test implementation order, so harmless refactors break them. Integration tests with runSaga or a real store check behaviour and are more robust.' },
        { q: 'How would you test a thunk?', a: 'Create a real store with configureStore, mock the API (Jest mock or MSW), dispatch the thunk, await it, and assert on the resulting state.' },
      ],
      answer30: "Reducers are pure, so I call them with a state and an action and check the output. For sagas there are two styles. Step by step, I drive the generator with next and compare each yielded effect, feeding in fake responses or throwing errors, so no API is called. Or I run the whole saga with runSaga or a real store, mock the API, and assert on dispatched actions or final state. I prefer the integration style because it survives refactors.",
      mistakes: [
        'Testing that a reducer was called instead of testing the state it returns.',
        'Only testing the happy path; use `gen.throw()` or a failing mock to cover the catch block.',
        'Over-relying on step-by-step tests that break when effect order changes.',
        "Trap: 'Why does `deepEqual` on a call effect work?' Effects are plain objects, so two `call(fn, arg)` effects with the same function and arguments are deeply equal.",
      ],
      takeaway: 'Reducers: input/output tests. Sagas: step through effects for precision, runSaga for behaviour.',
    },

    {
      id: 'state-management-comparison',
      title: 'Redux vs Context vs Zustand vs TanStack Query',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Split state by kind: server state to TanStack Query or RTK Query, local UI state to useState, shared client state to Context, Zustand or Redux.',
      what: [
        "These tools solve different problems. **Server state** (data from your API) needs caching, refetching and invalidation: TanStack Query or RTK Query. **Client state** (theme, modal open, cart before checkout, wizard steps) needs a place to live: `useState`, Context, Zustand or Redux.",
        "**Context** passes a value down the tree without props. It's not a state manager by itself, and every consumer re-renders when the value changes. **Zustand** is a tiny store with hooks and selectors, almost no boilerplate. **Redux Toolkit** is the most structured: actions, DevTools, middleware, conventions for big teams.",
      ],
      deeper: [
        "Rules of thumb: rarely changing global values (theme, current user, locale) suit Context. Frequently changing shared client state in a medium app suits Zustand. Large apps with many developers, complex state transitions, or a need for action logs, middleware and time-travel debugging suit Redux Toolkit.",
        "Re-render behaviour is the key technical difference. Context re-renders all consumers on any change unless you split contexts or memoize. Zustand and react-redux let each component subscribe with a selector and re-render only when its slice changes.",
        "In Zustand v5, a selector that returns a new object every time (`s => ({ a: s.a, b: s.b })`) can cause an infinite render loop; wrap it in `useShallow`. TanStack Query v5 uses a single object argument: `useQuery({ queryKey, queryFn })`.",
        "Many modern apps combine them: TanStack Query for server data plus a little Zustand or Context for client state, and no Redux at all. Existing Redux apps often move server data to RTK Query and keep slices for true client state.",
      ],
      why: "'Which state library?' is a design question interviewers use to see if you understand trade-offs. The strongest answer separates server state from client state first.",
      analogy: "Server state is a library book: you borrow a copy, and it can go stale, so someone has to check for new editions (TanStack Query). Client state is your own notebook: you just need a sensible place to keep it, from a sticky note (useState) to a filing cabinet with an index (Redux).",
      code: {
        lang: 'tsx',
        source: `// 1) Server state: TanStack Query v5
import { useQuery } from '@tanstack/react-query';
function Jobs() {
  const { data, isPending } = useQuery({
    queryKey: ['jobs', 'open'],
    queryFn: () => fetch('/api/jobs?status=open').then((r) => r.json()),
    staleTime: 30_000,
  });
  return isPending ? <p>Loading...</p> : <p>{data.length} open jobs</p>;
}

// 2) Shared client state: Zustand v5
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
type UIState = { sidebarOpen: boolean; theme: 'light' | 'dark'; toggleSidebar: () => void };
const useUI = create<UIState>()((set) => ({
  sidebarOpen: true,
  theme: 'light',
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
function Header() {
  const open = useUI((s) => s.sidebarOpen); // re-renders only when this changes
  const { theme, toggleSidebar } = useUI(useShallow((s) => ({ theme: s.theme, toggleSidebar: s.toggleSidebar })));
  return <button className={theme} onClick={toggleSidebar}>{open ? 'Hide' : 'Show'} menu</button>;
}

// 3) Rarely changing value: Context
import { createContext, useContext } from 'react';
const LocaleContext = createContext('en-IN');
function Price({ amount }: { amount: number }) {
  const locale = useContext(LocaleContext);
  return <span>{amount.toLocaleString(locale, { style: 'currency', currency: 'INR' })}</span>;
}

// 4) Redux Toolkit: same idea as Zustand, with actions, middleware and DevTools
//    (see the redux-toolkit topic)`,
      },
      output: "Jobs fetches once, caches for 30 seconds, and shares the cache with any other component using the same key. Header re-renders only when sidebarOpen, theme or the action reference changes. Price reads the locale from Context and re-renders only if the provider value changes.",
      questions: [
        { q: 'Redux vs Context?', a: 'Context is a way to pass a value down the tree, and every consumer re-renders when it changes. Redux is a full state manager with selectors that limit re-renders, middleware, and DevTools. Context suits rarely changing values; Redux suits complex, frequently changing shared state.' },
        { q: 'Why might you choose Zustand over Redux?', a: 'Much less boilerplate: a store is one function with state and actions, and components subscribe with selectors. It suits small and medium apps. Redux gives more structure, middleware and tooling for large teams.' },
        { q: 'What is the difference between server state and client state?', a: 'Server state lives on the backend; the client holds a cached copy that can go stale and needs refetching. Client state lives only in the browser, like UI toggles. Server state belongs in TanStack Query or RTK Query, not hand-managed in a store.' },
        { q: 'Can TanStack Query replace Redux?', a: 'For the server-data part, often yes, and that is most of what many apps kept in Redux. You still need something small for real client state, like useState, Context or Zustand.' },
      ],
      answer30: "I first split state by kind. Server data goes in TanStack Query or RTK Query, because it needs caching, refetching and invalidation. Local UI state stays in useState. For shared client state: Context for rarely changing values like theme or user, since every consumer re-renders on change; Zustand when I want a light store with selector-based subscriptions; and Redux Toolkit for large apps where structure, middleware and DevTools matter.",
      mistakes: [
        'Calling Context a state management library and putting fast-changing state in one big context.',
        'Storing server responses in Redux or Zustand and hand-writing cache logic.',
        'Choosing Redux for a small app by default, or rejecting it for a large one on fashion alone.',
        "Trap: 'Does Zustand need a Provider?' No. The store is a hook created at module level; that's also why you must reset it between tests.",
      ],
      takeaway: 'Server state to a query library; client state to the lightest tool that fits: useState, Context, Zustand, then Redux.',
    },
  ],

  rapidFire: [
    { q: 'Three principles of Redux?', a: 'Single source of truth, state is read-only, changes are made by pure reducers.' },
    { q: 'What is an action?', a: 'A plain object with a `type` and usually a `payload`, describing what happened.' },
    { q: 'What is a reducer?', a: 'A pure function `(state, action) => newState`.' },
    { q: 'Can a reducer make an API call?', a: 'No. Side effects go in thunks, sagas, listeners or RTK Query.' },
    { q: 'What does a reducer return for an unknown action?', a: 'The same state object, unchanged.' },
    { q: 'Why can RTK reducers mutate?', a: 'Immer records changes on a draft and returns a new immutable state.' },
    { q: 'What does createSlice generate?', a: 'A reducer plus action creators and action types.' },
    { q: 'What does configureStore add by default?', a: 'Thunk middleware, DevTools, and dev checks for mutation and serializability.' },
    { q: 'How does useSelector decide to re-render?', a: 'It compares the new selected value with the old one by `===`.' },
    { q: 'Why memoize selectors?', a: 'So derived arrays and objects keep the same reference and avoid needless re-renders.' },
    { q: 'Middleware signature?', a: '`store => next => action => result`.' },
    { q: 'What is a thunk?', a: 'A function you dispatch that receives dispatch and getState, used for async logic.' },
    { q: 'createAsyncThunk lifecycle actions?', a: 'pending, fulfilled, rejected.' },
    { q: 'What does .unwrap() do on a thunk result?', a: 'Returns the payload or throws the error.' },
    { q: 'RTK Query cache invalidation?', a: 'Queries providesTags, mutations invalidatesTags; matching queries refetch.' },
    { q: 'What is a saga?', a: 'A generator function run by redux-saga middleware that yields effect objects.' },
    { q: 'call vs fork?', a: 'call blocks and waits; fork starts a background task and continues.' },
    { q: 'fork vs spawn?', a: 'fork is attached (errors bubble, cancel cascades); spawn is detached.' },
    { q: 'takeLatest is best for?', a: 'Search and filters, where only the newest request matters.' },
    { q: 'takeLeading is best for?', a: 'Submit or pay buttons, to ignore double clicks.' },
    { q: 'How to time out a saga call?', a: '`race({ data: call(api), timeout: delay(ms) })`.' },
    { q: 'What happens to an uncaught saga error?', a: 'It bubbles up and kills the root saga and all watchers.' },
    { q: 'Context vs Redux in one line?', a: 'Context passes a value and re-renders all consumers; Redux manages state with selective subscriptions.' },
  ],
};

export default redux;
