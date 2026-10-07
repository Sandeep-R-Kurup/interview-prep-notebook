// JavaScript stack. Every code example runs in Node 18+ or a browser console
// (a few newer methods, like toSorted and Set.intersection, need Node 20/22+; the text says so).

const javascript = {
  name: 'JavaScript',
  intro: 'The language underneath everything else you use. Most React and Node interview traps are really JavaScript questions.',
  topics: [
    {
      id: 'var-let-const-hoisting',
      title: 'var, let, const, and hoisting',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'var is function-scoped and hoisted as undefined; let and const are block-scoped and locked until their line runs.',
      what: [
        "`var`, `let`, and `const` all declare variables. `let` and `const` (added in 2015) are block-scoped: they only exist inside the nearest `{ }`. `var` is function-scoped: it ignores blocks like `if` and `for`.",
        "`const` means the variable can't be reassigned. It does not make objects frozen: you can still change an object's properties.",
        "Hoisting means JavaScript knows about declarations before running the code line by line.",
      ],
      deeper: [
        "Before running a scope, the engine sets up all its declarations. `var` variables are created and set to `undefined`, so reading them early gives `undefined`. `let` and `const` are created but not initialized. Reading them before their line throws a ReferenceError. That gap is called the temporal dead zone (TDZ).",
        "Function declarations (`function f() {}`) are fully hoisted, so you can call them before they appear. Function expressions (`const f = () => {}`) follow the rules of `const`.",
      ],
      why: "`var`'s loose scoping caused many bugs, like loop variables leaking out of the loop. `let` and `const` make scope predictable. Using `const` by default also tells readers 'this name won't be reassigned'.",
      analogy: "Hoisting is a teacher reading the class register before the lesson. With var, every name is called and marked 'present but empty'. With let and const, the names are on the list, but you can't talk to that student until they actually walk in (their line runs).",
      code: {
        lang: 'js',
        source: `console.log(a); // undefined  (var is hoisted and set to undefined)
var a = 1;

try {
  console.log(b); // ReferenceError: Cannot access 'b' before initialization (TDZ)
} catch (e) { console.log(e.name); }
let b = 2;

sayHi(); // works: function declarations are fully hoisted
function sayHi() { console.log('hi'); }

if (true) { var leaky = 'I escape the block'; let safe = 'I stay inside'; }
console.log(leaky);          // 'I escape the block'
console.log(typeof safe);    // 'undefined' (not defined out here)

const user = { name: 'Asha' };
user.name = 'Ravi';          // allowed: we changed a property
// user = {};                // TypeError: Assignment to constant variable
console.log(user.name);      // 'Ravi'`,
      },
      output: "The log shows: undefined, ReferenceError, hi, I escape the block, undefined, Ravi. var leaks out of the if block; let doesn't. const blocked reassignment but allowed changing a property.",
      questions: [
        { q: 'Difference between var, let, and const?', a: 'var is function-scoped, can be redeclared, and is hoisted as undefined. let and const are block-scoped and in the TDZ until declared. const can\'t be reassigned.' },
        { q: 'What is the temporal dead zone?', a: 'The time between entering a scope and the line where a let or const is declared. Accessing the variable then throws a ReferenceError.' },
        { q: 'Is let hoisted?', a: 'Yes, the declaration is hoisted, but it isn\'t initialized, which is why you get a ReferenceError instead of undefined.' },
        { q: 'Does const make an object immutable?', a: 'No. It only stops reassigning the variable. Use Object.freeze for shallow immutability.' },
      ],
      answer30: "var is function-scoped and hoisted with the value undefined, so you can read it before its line. let and const are block-scoped; they're hoisted too, but stay uninitialized in the temporal dead zone until their line runs, so early access throws a ReferenceError. const prevents reassignment, but object properties can still change. I use const by default, let when I need to reassign, and avoid var.",
      mistakes: ["Saying let and const aren't hoisted at all.", 'Thinking const objects are immutable.', 'Using var in loops with callbacks (see the closures topic).', "Trap: `typeof undeclaredVar` gives 'undefined', but `typeof x` inside x's TDZ throws."],
      takeaway: 'Use const by default, let to reassign; var leaks out of blocks and reads as undefined early.',
    },

    {
      id: 'scope-closures',
      title: 'Scope and closures',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'A closure is a function that remembers the variables from where it was created, even after that place has finished running.',
      what: [
        "Scope is where a variable can be seen. Inner functions can see variables of outer functions, but not the other way round.",
        "A closure happens when a function keeps access to variables from its outer function, even after the outer function has returned.",
      ],
      deeper: [
        "JavaScript uses lexical scope: what a function can see is decided by where it's written, not where it's called. When a function is created, it keeps a reference to its surrounding scope. As long as the inner function exists, those variables stay alive in memory.",
        "Closures power many patterns: private variables, function factories, debounce and throttle, memoization, React hooks, and event handlers. They also cause a classic bug with `var` in loops, and can cause memory leaks if a long-lived closure holds large data.",
      ],
      why: "Closures let you keep private state without classes or global variables, and let callbacks remember the context they were created in.",
      analogy: "A backpack. When a function leaves the place it was born, it carries a backpack with the variables it needs. It can open the backpack whenever it runs, even far away.",
      code: {
        lang: 'js',
        source: `function makeCounter() {
  let count = 0; // private: nothing outside can touch it directly
  return {
    increment: () => ++count,
    get: () => count,
  };
}
const c = makeCounter();
c.increment(); c.increment();
console.log(c.get()); // 2

// Classic interview bug: var in a loop
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log('var', i), 0);
}
// Fix: let creates a new i for every iteration
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log('let', j), 0);
}`,
      },
      output: "First 2 is logged. Then 'var 3' three times, because all three callbacks share one `i`, which is 3 when they run. Then 'let 0', 'let 1', 'let 2', because each iteration has its own `j`.",
      questions: [
        { q: 'What is a closure?', a: 'A function together with the variables from the scope where it was created. It can use them even after the outer function has returned.' },
        { q: 'Why does the var loop print 3, 3, 3?', a: 'var creates one shared variable for the whole loop. The callbacks run after the loop ends, when i is 3. let creates a new binding each iteration.' },
        { q: 'Give real uses of closures.', a: 'Private state (module pattern), debounce and throttle timers, memoize caches, function factories, and React hooks remembering values per render.' },
        { q: 'Can closures cause memory leaks?', a: 'Yes, if a long-lived function (like an event listener that\'s never removed) keeps a reference to large data it no longer needs.' },
      ],
      answer30: "A closure is a function that remembers the variables from the scope where it was created, even after that outer function has returned. JavaScript uses lexical scope, so what a function can see depends on where it's written. I use closures for private state, debounce and throttle, and memoization. The classic trap is var in a loop with setTimeout: all callbacks share one variable, so you get the final value; let fixes it by creating a new binding per iteration.",
      mistakes: ['Thinking a closure copies values. It keeps a live reference, so it sees later changes.', 'Forgetting that stale closures in React come from the same idea: a callback remembers the state from the render it was created in.', 'Keeping closures alive forever (listeners, intervals) and leaking memory.'],
      takeaway: 'A function carries its birthplace variables with it, by reference.',
    },

    {
      id: 'equality-coercion-truthy',
      title: '== vs ===, type coercion, and truthy/falsy',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: '=== compares without converting types; == converts types first, which leads to surprises.',
      what: [
        "`===` (strict equality) is true only if both type and value are the same. `==` (loose equality) first tries to convert both sides to the same type, then compares.",
        "Type coercion is JavaScript automatically converting a value from one type to another. Truthy and falsy describe what a value becomes when used as a boolean, like in an `if`.",
      ],
      deeper: [
        "There are only a few falsy values: `false`, `0`, `-0`, `0n`, `''`, `null`, `undefined`, and `NaN`. Everything else is truthy, including `'0'`, `'false'`, `[]`, and `{}`.",
        "`null == undefined` is true, and neither is loosely equal to anything else. That's the one common, deliberate use of `==`: `x == null` checks for both null and undefined. `NaN` is not equal to anything, even itself; use `Number.isNaN()`.",
      ],
      why: "Coercion rules are complicated. `===` makes comparisons predictable. Knowing truthy/falsy prevents bugs where a valid 0 or empty string is treated as 'missing'.",
      analogy: "=== is a strict passport check: name and nationality must both match. == is a friendly guard who says 'close enough' and translates your documents first, sometimes wrongly.",
      code: {
        lang: 'js',
        source: `console.log(1 === '1');        // false (different types)
console.log(1 == '1');         // true  ('1' converted to 1)
console.log(0 == '');          // true  ('' becomes 0)
console.log(null == undefined);// true
console.log(null == 0);        // false
console.log(NaN === NaN);      // false
console.log(Number.isNaN(NaN));// true

console.log(Boolean([]), Boolean('0')); // true true (both truthy)

const qty = 0;
console.log(qty || 10);  // 10  (|| treats 0 as missing: bug!)
console.log(qty ?? 10);  // 0   (?? only replaces null/undefined)

console.log('5' + 1, '5' - 1); // '51' 4 (+ joins strings, - converts to number)`,
      },
      output: "The logs show how == converts types, that NaN never equals itself, that empty arrays are truthy, that || wrongly replaces a valid 0 while ?? keeps it, and that + with a string joins while - converts to a number.",
      questions: [
        { q: '== vs ===?', a: '=== compares type and value with no conversion. == converts types first. Use === except for the deliberate `x == null` check.' },
        { q: 'List the falsy values.', a: 'false, 0, -0, 0n, empty string, null, undefined, NaN.' },
        { q: '|| vs ??', a: '|| falls back on any falsy value (including 0 and empty string). ?? falls back only on null or undefined.' },
        { q: 'What is `[] + {}`?', a: "'[object Object]': both are converted to strings ('' and '[object Object]') and joined." },
      ],
      answer30: "=== checks type and value with no conversion; == converts types first, which gives surprises like 0 == '' being true. I always use ===, except x == null to check for null or undefined together. Falsy values are false, 0, -0, 0n, empty string, null, undefined, and NaN; everything else, even an empty array, is truthy. For defaults I use ?? instead of ||, so valid zeros and empty strings aren't replaced.",
      mistakes: ['Using || for defaults when 0 or empty string is valid.', 'Checking `if (arr)` to see if an array is empty. Use `arr.length`.', 'Comparing with NaN using ===.'],
      takeaway: 'Use === and ??; remember the short list of falsy values.',
    },

    {
      id: 'this-call-apply-bind',
      title: 'this, call, apply, and bind',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: '`this` is decided by how a function is called; arrow functions take `this` from where they are written.',
      what: [
        "`this` is a special word that refers to an object. For normal functions, which object depends on how the function is called, not where it's written.",
        "`call`, `apply`, and `bind` let you choose `this` yourself.",
      ],
      deeper: [
        "Rules, from strongest to weakest: (1) called with `new` -> `this` is the new object. (2) called with call/apply/bind -> `this` is what you passed. (3) called as `obj.method()` -> `this` is obj. (4) called plainly as `fn()` -> `undefined` in strict mode (and in modules and classes), or the global object in sloppy mode.",
        "Arrow functions don't have their own `this`. They use the `this` of the surrounding code, and call/apply/bind can't change it. That's why arrows are great for callbacks inside methods, but bad as object methods.",
        "`call(thisArg, a, b)` calls now with separate arguments. `apply(thisArg, [a, b])` calls now with an array. `bind(thisArg, a)` doesn't call; it returns a new function with `this` fixed.",
      ],
      why: "`this` lets one function work on many objects. Knowing the rules fixes the common bug where a method loses its object when passed as a callback.",
      analogy: "The word 'me' in a sentence. Who 'me' means depends on who says it (how the function is called). An arrow function is like a recorded message: 'me' always means the person who recorded it.",
      code: {
        lang: 'js',
        source: `'use strict';
const user = {
  name: 'Asha',
  greet() { return 'Hi ' + this.name; },
  greetLater() {
    setTimeout(() => console.log('arrow:', this.name), 0); // arrow uses greetLater's this
  },
};

console.log(user.greet());          // Hi Asha   (rule 3: obj.method())
const loose = user.greet;
try { loose(); } catch (e) { console.log('lost this:', e.constructor.name); } // TypeError

const other = { name: 'Ravi' };
console.log(user.greet.call(other));   // Hi Ravi
console.log(user.greet.apply(other));  // Hi Ravi
const bound = user.greet.bind(other);
console.log(bound());                  // Hi Ravi

function intro(city, role) { return this.name + ' from ' + city + ', ' + role; }
console.log(intro.call(user, 'Kochi', 'dev'));
console.log(intro.apply(user, ['Kochi', 'dev']));
user.greetLater();                     // arrow: Asha`,
      },
      output: "user.greet() works. Copying the method into `loose` and calling it plainly makes `this` undefined in strict mode, so reading `this.name` throws a TypeError. call, apply, and bind all set `this` to `other`. The arrow function in setTimeout keeps greetLater's `this`, so it logs Asha.",
      questions: [
        { q: 'How is `this` decided?', a: 'By the call: new, then explicit binding (call/apply/bind), then the object before the dot, then default (undefined in strict mode). Arrow functions take this from the surrounding scope.' },
        { q: 'call vs apply vs bind?', a: 'call and apply invoke immediately; call takes arguments one by one, apply takes an array. bind returns a new function with this fixed.' },
        { q: 'Why do class methods lose `this` when passed as callbacks?', a: 'Because they\'re called later as plain functions, without the object in front. Fix with bind in the constructor or an arrow function class field.' },
        { q: 'Can you rebind an arrow function or a bound function?', a: 'No. Arrows have no own this; a bound function\'s this is fixed. (Using `new` on a bound function is the one exception.)' },
      ],
      answer30: "this depends on how a function is called. With new, it's the new object; with call, apply, or bind, it's what you pass; with obj.method(), it's obj; with a plain call, it's undefined in strict mode. Arrow functions don't have their own this; they use the surrounding one, which makes them great for callbacks inside methods. call and apply invoke immediately, with separate arguments or an array, while bind returns a new function with this locked.",
      mistakes: ['Using arrow functions as object methods, then wondering why this is wrong.', 'Passing `obj.method` as a callback and losing this.', "Trap: forgetting that classes and ES modules run in strict mode automatically."],
      takeaway: '`this` = how it\'s called; arrows borrow it from where they\'re written.',
    },

    {
      id: 'promises-async-await',
      title: 'Promises and async/await',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'A promise is a placeholder for a future result; async/await lets you write promise code that reads top to bottom.',
      what: [
        "A promise represents a value that will arrive later, like an API response. It starts as pending, then becomes fulfilled (with a value) or rejected (with an error). It never changes after that.",
        "`async` makes a function always return a promise. `await` pauses that function until a promise settles, then gives you the value, or throws the error.",
      ],
      deeper: [
        "`.then` callbacks always run asynchronously, as microtasks, even if the promise is already resolved. `await` works the same way.",
        "Sequential vs parallel: `await a(); await b();` waits for a before starting b. If they don't depend on each other, start both and use `Promise.all` to wait for both. `Promise.all` rejects as soon as one fails. `Promise.allSettled` waits for all and reports each result. `Promise.race` settles with the first to settle. `Promise.any` resolves with the first success.",
        "An unhandled rejected promise is a bug. In Node 15+, it crashes the process by default.",
      ],
      why: "Callbacks nested inside callbacks ('callback hell') are hard to read and handle errors in. Promises chain cleanly, and async/await reads like normal code with normal try/catch.",
      analogy: "Ordering at a food court. You get a buzzer (promise) right away. You can do other things. When it buzzes, your food is ready (fulfilled) or they tell you they ran out (rejected). `await` is standing at the counter until it buzzes.",
      code: {
        lang: 'js',
        source: `const wait = (ms, value, fail = false) =>
  new Promise((resolve, reject) => setTimeout(() => (fail ? reject(new Error(value)) : resolve(value)), ms));

async function main() {
  // Sequential: about 200 ms total
  let t = Date.now();
  const a = await wait(100, 'A');
  const b = await wait(100, 'B');
  console.log(a, b, 'sequential ~', Date.now() - t, 'ms');

  // Parallel: about 100 ms total
  t = Date.now();
  const [c, d] = await Promise.all([wait(100, 'C'), wait(100, 'D')]);
  console.log(c, d, 'parallel ~', Date.now() - t, 'ms');

  // Error handling
  try {
    await wait(50, 'boom', true);
  } catch (err) {
    console.log('caught:', err.message);
  }

  const results = await Promise.allSettled([wait(10, 'ok'), wait(10, 'bad', true)]);
  console.log(results.map((r) => r.status)); // [ 'fulfilled', 'rejected' ]
}
main();`,
      },
      output: "The sequential version takes about 200 ms because B waits for A. The parallel version takes about 100 ms because both timers run at once. The rejected promise is caught by try/catch. allSettled reports one fulfilled and one rejected without throwing.",
      questions: [
        { q: 'What are the three states of a promise?', a: 'Pending, fulfilled, rejected. Once fulfilled or rejected (settled), it never changes.' },
        { q: 'Promise.all vs allSettled vs race vs any?', a: 'all: all succeed or fail fast on the first error. allSettled: wait for all, report each. race: first to settle, success or failure. any: first success; rejects only if all fail.' },
        { q: 'How do you run awaits in parallel?', a: 'Start the promises first, then await Promise.all([...]). Writing await one after another runs them in sequence.' },
        { q: 'Does await block the whole program?', a: 'No. It pauses only that async function. The event loop keeps running other work.' },
        { q: 'What happens if you forget to catch a rejection?', a: 'An unhandled rejection warning in browsers; in Node 15+ the process crashes by default.' },
      ],
      answer30: "A promise is a placeholder for a future value that's pending, then fulfilled or rejected. async functions always return a promise, and await pauses just that function until the promise settles, so I can use normal try/catch. If tasks don't depend on each other, I start them together and use Promise.all, or allSettled when I want every result even if some fail. And I always handle rejections, because in Node an unhandled one crashes the process.",
      mistakes: ['await in a loop when the calls could run in parallel.', 'forEach with async callbacks: forEach doesn\'t wait. Use for...of or Promise.all with map.', 'Forgetting to return a promise inside .then, breaking the chain.', 'Mixing .then and await carelessly so errors escape the try/catch.'],
      takeaway: 'Await in sequence only when you must; otherwise Promise.all, and always catch.',
    },

    {
      id: 'event-loop',
      title: 'Event loop, microtasks, and macrotasks',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Run all synchronous code, then all microtasks, then one macrotask, and repeat.',
      what: [
        "JavaScript runs on one thread, so it does one thing at a time. The event loop is how it handles waiting work (timers, network, clicks) without freezing.",
        "Slow work like a timer or a fetch is handed to the browser or Node. When it's done, its callback waits in a queue. The event loop moves callbacks onto the call stack when the stack is empty.",
      ],
      deeper: [
        "There are two main queues. Microtasks: promise callbacks (`.then`, code after `await`) and `queueMicrotask`. Macrotasks (tasks): `setTimeout`, `setInterval`, I/O, UI events.",
        "The order: (1) run the current synchronous code until the stack is empty. (2) run ALL microtasks, including new ones added along the way. (3) the browser may render. (4) take ONE macrotask, run it, and go back to step 2.",
        "That's why a promise callback always runs before a `setTimeout(fn, 0)` scheduled at the same time. In Node, `process.nextTick` runs even before promise microtasks.",
      ],
      why: "It explains output-order questions, why the UI freezes during long loops, and why heavy work should be split up or moved to a Web Worker or worker thread.",
      analogy: "A chef with one pair of hands. They finish the dish in front of them (sync code), then handle every urgent note from the waiters (microtasks), then take the next order ticket from the rail (one macrotask), and check the urgent notes again.",
      code: {
        lang: 'js',
        source: `console.log('1 sync start');

setTimeout(() => console.log('5 timeout (macrotask)'), 0);

Promise.resolve()
  .then(() => console.log('3 promise then (microtask)'))
  .then(() => console.log('4 second then (microtask)'));

queueMicrotask(() => console.log('3b queueMicrotask'));

(async () => {
  console.log('2 inside async, before await (sync)');
  await null;
  console.log('3c after await (microtask)');
})();

console.log('2b sync end');`,
      },
      output: "Order: '1 sync start', '2 inside async, before await', '2b sync end' (all synchronous). Then microtasks in the order they were queued: '3 promise then', '3b queueMicrotask', '3c after await', then '4 second then' (queued when the first then ran). Last, '5 timeout', the macrotask.",
      questions: [
        { q: 'Why does a resolved promise callback run before setTimeout 0?', a: 'Promise callbacks are microtasks, and all microtasks run before the next macrotask.' },
        { q: 'Is code before the first await synchronous?', a: 'Yes. An async function runs synchronously until its first await.' },
        { q: 'Can microtasks freeze the page?', a: 'Yes. If microtasks keep adding more microtasks forever, the loop never reaches rendering or macrotasks.' },
        { q: 'Does setTimeout(fn, 0) run immediately?', a: 'No. It runs after the current code and all microtasks, and only when its turn comes. The delay is a minimum, not a guarantee.' },
      ],
      answer30: "JavaScript is single-threaded, and the event loop lets it handle async work. Slow operations are handed to the browser or Node, and their callbacks wait in queues. After the current synchronous code finishes, the loop runs every microtask, like promise callbacks and code after await, then one macrotask, like a setTimeout callback, then all microtasks again. That's why a promise's then always runs before a setTimeout with zero delay.",
      mistakes: ['Thinking setTimeout 0 runs before promises.', 'Forgetting that code before the first await runs synchronously.', 'Long synchronous loops that block clicks and rendering.', "Trap: in Node, the order of setTimeout 0 vs setImmediate in the main module isn't guaranteed; inside an I/O callback, setImmediate runs first."],
      takeaway: 'Sync first, then every microtask, then one macrotask, repeat.',
    },

    {
      id: 'destructuring-spread-rest',
      title: 'Destructuring, spread, and rest',
      level: 'basic',
      priority: 'must',
      frequency: 'common',
      summary: 'Pull values out of objects and arrays, copy or merge them with `...`, and collect leftovers with `...`.',
      what: [
        "Destructuring unpacks values from arrays or objects into variables in one line. Spread (`...` in a value position) expands an array or object into its items. Rest (`...` in a variable or parameter position) collects the remaining items into one array or object.",
      ],
      deeper: [
        "Spread makes a shallow copy. Top-level values are copied, but nested objects are still shared. Changing a nested object in the copy changes the original too. For a deep copy use `structuredClone`.",
        "In object spread, later properties win: `{ ...defaults, ...options }` lets options override defaults.",
      ],
      why: "Cleaner code, easy defaults, and immutable updates, which React state and Redux depend on.",
      analogy: "Unpacking a suitcase: destructuring takes out exactly the items you name, spread empties everything into a new suitcase, and rest puts 'everything else' into one bag.",
      code: {
        lang: 'js',
        source: `const user = { name: 'Asha', role: 'dev', address: { city: 'Kochi' } };

const { name, role: job = 'none', ...others } = user; // rename + default + rest
console.log(name, job, others); // Asha dev { address: { city: 'Kochi' } }

const [first, , third = 'x'] = [10, 20]; // skip an item, default for a missing one
console.log(first, third); // 10 x

const copy = { ...user, role: 'lead' };  // later key wins
copy.address.city = 'Trivandrum';         // nested object is SHARED (shallow copy)
console.log(user.address.city);           // Trivandrum (original changed too)

const deep = structuredClone(user);
deep.address.city = 'Delhi';
console.log(user.address.city);           // still Trivandrum

const sum = (...nums) => nums.reduce((a, b) => a + b, 0); // rest parameter
console.log(sum(1, 2, 3), Math.max(...[4, 9, 2]));         // 6 9`,
      },
      output: "Destructuring pulls out name and role (renamed to job), and others collects the rest. The array example skips the second item and uses a default for the missing third. The spread copy shares the nested address, so changing it changes the original. structuredClone makes a real deep copy. Rest collects function arguments into an array.",
      questions: [
        { q: 'Spread vs rest?', a: 'Same `...` syntax. Spread expands values (in calls, arrays, objects). Rest collects values (in parameters and destructuring).' },
        { q: 'Is spread a deep copy?', a: 'No, it\'s shallow. Nested objects are shared. Use structuredClone for a deep copy.' },
        { q: 'When does a destructuring default apply?', a: 'Only when the value is undefined, not when it\'s null.' },
      ],
      answer30: "Destructuring unpacks values from objects or arrays into variables, with renaming and defaults. The three-dot syntax is spread when it expands values, like copying or merging objects, and rest when it collects values, like remaining function arguments. Spread only makes a shallow copy, so nested objects are shared; for a real deep copy I use structuredClone.",
      mistakes: ['Assuming spread deep-copies.', 'Expecting a default to replace null.', 'Destructuring from undefined, which throws. Use a default: `const { a } = obj ?? {}`.'],
      takeaway: 'Spread copies one level deep; rest collects; defaults only replace undefined.',
    },

    {
      id: 'debounce-throttle',
      title: 'Debounce and throttle',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Debounce waits until calls stop; throttle allows at most one call per time window.',
      what: [
        "Both limit how often a function runs when an event fires many times. Debounce runs the function only after the events stop for a set time, like a search box that searches after you stop typing. Throttle runs the function at most once every set time, like updating scroll position every 200 ms while scrolling.",
      ],
      deeper: [
        "Both are built with closures: the returned function remembers a timer id (debounce) or the last run time (throttle) between calls.",
        "Variants: leading debounce runs on the first call and then ignores calls until things go quiet. Throttle can also fire a final trailing call so the last event isn't lost. Libraries like lodash support these options.",
      ],
      why: "Events like keyup, scroll, and resize can fire dozens of times per second. Running an API call or heavy work on each one wastes requests and makes the page slow.",
      analogy: "Debounce is a lift door: it closes only after people stop walking in. Throttle is a turnstile that lets one person through every few seconds, no matter how many are waiting.",
      code: {
        lang: 'js',
        source: `function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);                       // cancel the previous plan
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function throttle(fn, interval) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= interval) {             // enough time passed?
      last = now;
      fn.apply(this, args);
    }
  };
}

const search = debounce((q) => console.log('search:', q), 300);
search('r'); search('re'); search('rea'); search('react'); // only 'react' is searched

const log = throttle((n) => console.log('throttled:', n), 1000);
for (let i = 1; i <= 5; i++) log(i);         // only 1 runs (all calls within 1 second)`,
      },
      output: "After 300 ms, 'search: react' is logged once, because each call cancelled the previous timer. The throttled function logs 'throttled: 1' once; calls 2 to 5 arrive within the same second and are ignored.",
      questions: [
        { q: 'Debounce vs throttle, with examples?', a: 'Debounce: run after activity stops (search input, autosave, window resize end). Throttle: run at a steady maximum rate during activity (scroll position, mouse move, button spam protection).' },
        { q: 'Why `fn.apply(this, args)`?', a: 'To pass along the original arguments and `this`, so the wrapped function behaves like the original.' },
        { q: 'How do you debounce in React?', a: 'Keep the debounced function stable with useMemo or useRef, or debounce the value with a custom useDebounce hook, and clean up timers on unmount.' },
      ],
      answer30: "Both control how often a function runs during rapid events. Debounce waits until events stop for a set delay and then runs once, which is perfect for search-as-you-type. Throttle runs at most once per interval while events keep coming, which suits scroll or resize handlers. Both are closures: debounce remembers a timer to clear and reset, throttle remembers the last run time.",
      mistakes: ['Creating a new debounced function on every React render, so nothing is ever debounced.', 'Losing `this` and arguments by not forwarding them.', 'Forgetting to clear the timer on unmount, calling setState on an unmounted component.'],
      takeaway: 'Debounce = after it goes quiet; throttle = at most once per window.',
    },

    {
      id: 'data-types-coercion',
      title: 'Data types, typeof, and type conversion',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Seven primitive types are copied by value; everything else is an object, shared by reference. JavaScript converts between types with a small set of rules.',
      what: [
        "JavaScript has 7 primitive types: `string`, `number`, `bigint`, `boolean`, `undefined`, `null`, and `symbol`. Everything else (arrays, functions, dates, plain objects) is an `object`.",
        "Primitives are copied by value: copying a number gives you an independent number. Objects are copied by reference: two variables can point to the same object, so a change through one is seen through the other.",
        "Type conversion (coercion) is turning one type into another. Explicit conversion is when you call `Number()`, `String()`, or `Boolean()` yourself. Implicit conversion is when an operator like `+`, `*`, or `==` does it for you.",
      ],
      deeper: [
        "`typeof` has two famous quirks: `typeof null` is `'object'` (a bug from the first version that can never be fixed), and `typeof` a function is `'function'` even though functions are objects. Use `Array.isArray()` for arrays and `x === null` for null.",
        "When an object meets an operator, JavaScript turns it into a primitive first (ToPrimitive). It calls `Symbol.toPrimitive` if present, otherwise `valueOf()` then `toString()` (for a string hint, `toString()` first). That's why `[] + []` is `''` and `[1] == 1` is true: `[1]` becomes `'1'`, then `1`.",
        "`+` joins if either side is a string after conversion; `-`, `*`, `/` always convert to numbers. `Number('')` is `0`, `Number('42px')` is `NaN`, but `parseInt('42px')` is `42` because it reads digits until it hits something else.",
        "All numbers are 64-bit floating point, so `0.1 + 0.2 !== 0.3` and integers are only exact up to `Number.MAX_SAFE_INTEGER` (2^53 - 1). Use `BigInt` (`10n`) for bigger integers, and integer cents for money.",
      ],
      why: "Most 'weird JavaScript' interview questions are really conversion questions. Knowing primitive vs reference also explains why React state updates need new objects and why a function can change an object you passed in.",
      analogy: "A primitive is a photocopy: you can scribble on your copy and the original is untouched. An object is a shared Google Doc link: everyone with the link edits the same document.",
      code: {
        lang: 'js',
        source: `console.log(typeof 42, typeof 'hi', typeof true, typeof undefined); // number string boolean undefined
console.log(typeof 10n, typeof Symbol('id'));   // bigint symbol
console.log(typeof null);                       // object (a historic bug)
console.log(typeof [], Array.isArray([]));      // object true
console.log(typeof function () {});            // function

// Primitives copy the value, objects copy the reference
let a = 1; let b = a; b = 2;
console.log(a);                                 // 1
const o1 = { n: 1 }; const o2 = o1; o2.n = 2;
console.log(o1.n);                              // 2

// Explicit conversion
console.log(Number('42'), Number(''), Number('42px'), parseInt('42px')); // 42 0 NaN 42
console.log(String(null), String([1, 2]), String({}));                  // null 1,2 [object Object]

// Implicit conversion
console.log('3' * '4', true + 1, [] + [], [1] == 1); // 12 2 (empty string) true

// Objects become primitives through valueOf / toString
const price = { valueOf() { return 99; }, toString() { return 'Rs 99'; } };
console.log(price + 1, \`\${price}\`);             // 100 Rs 99

console.log(0.1 + 0.2 === 0.3, Number.MAX_SAFE_INTEGER); // false 9007199254740991`,
      },
      output: "Prints: `number string boolean undefined`, `bigint symbol`, `object`, `object true`, `function`, then `1` (the primitive copy is independent) and `2` (both names share one object). Conversions give `42 0 NaN 42` and `null 1,2 [object Object]`. Implicit ones give `12 2  true` (the empty string from `[] + []` shows as a blank). `price + 1` uses valueOf (100) while the template literal uses toString (Rs 99). Last line: `false 9007199254740991`.",
      questions: [
        { q: 'What are the primitive types in JavaScript?', a: "string, number, bigint, boolean, undefined, null, and symbol. Everything else, including arrays and functions, is an object." },
        { q: "Why is typeof null 'object'?", a: "It's a bug from the very first JavaScript engine, kept forever so old code doesn't break. Check for null with `x === null`." },
        { q: 'Primitive vs reference: what is the difference?', a: "Primitives are copied by value, so a copy is independent. Objects are copied by reference, so two variables can point to the same object and see each other's changes." },
        { q: "Why is '5' + 1 '51' but '5' - 1 is 4?", a: "`+` joins strings if either side is a string. `-` only works on numbers, so it converts '5' to 5 first." },
        { q: 'Why is 0.1 + 0.2 not equal to 0.3?', a: "Numbers are 64-bit binary floating point, and 0.1 can't be stored exactly. Compare with a small tolerance (`Number.EPSILON`) or work in integer units like cents." },
      ],
      answer30: "JavaScript has seven primitive types: string, number, bigint, boolean, undefined, null, and symbol; everything else is an object. Primitives are copied by value and objects by reference, which is why mutating an object you passed in changes the caller's copy. typeof is handy but has quirks: null gives 'object' and arrays give 'object', so I use `=== null` and Array.isArray. For conversion, plus joins strings while other math operators convert to numbers, and objects are turned into primitives through valueOf and toString. I prefer explicit conversion with Number() or String() so the code says what it means.",
      mistakes: [
        "Using `typeof x === 'object'` to detect objects and forgetting it is also true for null and arrays.",
        "Using `parseInt` without thinking: it silently ignores trailing junk like 'px', while `Number` gives NaN.",
        "Storing money as floats and getting rounding errors.",
        "Trap: `typeof NaN` is `'number'`. NaN is a number value that means 'not a valid number'.",
      ],
      takeaway: "Seven primitives by value, objects by reference; + joins strings, other operators convert to numbers.",
    },

    {
      id: 'prototypes-inheritance',
      title: 'Prototypes and prototypal inheritance',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Every object has a hidden link to another object, its prototype. If a property is missing, JavaScript looks it up along that chain.',
      what: [
        "Every object has an internal link called its prototype (`[[Prototype]]`). When you read a property that the object doesn't have, JavaScript looks for it on the prototype, then on the prototype's prototype, and so on until it reaches `null`. This is the prototype chain.",
        "That's how `[1, 2].map` works: `map` isn't on your array, it's on `Array.prototype`, which every array links to.",
        "Prototypal inheritance means objects inherit directly from other objects. JavaScript `class` syntax is built on top of this; it doesn't replace it.",
      ],
      deeper: [
        "Two things with similar names: `obj.__proto__` (or better, `Object.getPrototypeOf(obj)`) is the object's actual prototype. `Fn.prototype` is a normal property on functions; it becomes the prototype of objects created with `new Fn()`.",
        "What `new Fn(args)` does: (1) creates an empty object whose prototype is `Fn.prototype`, (2) runs `Fn` with `this` set to that object, (3) returns the object (unless Fn returns its own object).",
        "Methods should live on the prototype so all instances share one copy. Writing a property on an instance never changes the prototype; it creates an own property that shadows (hides) the inherited one.",
        "`Object.create(proto)` makes an object with a chosen prototype. `Object.create(null)` makes an object with no prototype at all, which is a safe dictionary with no inherited keys like `toString`.",
      ],
      why: "Interviewers use it to check you understand how classes, `instanceof`, method sharing, and built-in methods really work. It also explains prototype pollution bugs in Node apps.",
      analogy: "Asking a question in a family. If you don't know the answer, you ask your parent; if they don't know, they ask theirs. The first person up the family line who knows answers. If nobody knows, the answer is undefined.",
      code: {
        lang: 'js',
        source: `const animal = { eats: true, describe() { return this.name + ' eats: ' + this.eats; } };
const dog = Object.create(animal);            // dog's prototype is animal
dog.name = 'Bruno';
console.log(dog.describe());                  // Bruno eats: true (found on the prototype)
console.log(Object.hasOwn(dog, 'eats'));      // false
console.log(Object.getPrototypeOf(dog) === animal); // true

// Constructor function: methods live on Person.prototype, shared by all instances
function Person(name) { this.name = name; }
Person.prototype.greet = function () { return 'Hi, ' + this.name; };
const p = new Person('Asha');
console.log(p.greet(), Object.getPrototypeOf(p) === Person.prototype); // Hi, Asha true
console.log(p.greet === new Person('Ravi').greet);                     // true (one shared copy)

// Inheritance by hand (what "class Dev extends Person" does for you)
function Dev(name, lang) { Person.call(this, name); this.lang = lang; }
Object.setPrototypeOf(Dev.prototype, Person.prototype);
Dev.prototype.code = function () { return this.name + ' writes ' + this.lang; };
const d = new Dev('Ravi', 'JS');
console.log(d.greet(), '|', d.code());        // Hi, Ravi | Ravi writes JS
console.log(d instanceof Person);             // true

// Shadowing: an own property hides the inherited one
dog.eats = false;
console.log(dog.describe(), animal.eats);     // Bruno eats: false true`,
      },
      output: "`Bruno eats: true` (eats comes from animal), `false`, `true`. Then `Hi, Asha true` and `true` because both people share one greet function. The Dev instance can call both greet (from Person.prototype) and code: `Hi, Ravi | Ravi writes JS`, and `instanceof Person` is `true`. Finally `Bruno eats: false true`: setting `dog.eats` created an own property and left animal unchanged.",
      questions: [
        { q: 'What is the prototype chain?', a: "Each object links to a prototype object. When a property isn't found on the object, JavaScript looks up that chain of links until it finds it or reaches null, and then returns undefined." },
        { q: '__proto__ vs prototype?', a: "`__proto__` (or `Object.getPrototypeOf`) is an object's actual prototype. `prototype` is a property on constructor functions; it becomes the `__proto__` of objects created with `new`." },
        { q: 'What does the new keyword do?', a: "It creates a new object linked to `Fn.prototype`, runs the function with `this` set to that object, and returns it unless the function returns its own object." },
        { q: 'How does instanceof work?', a: "`a instanceof B` checks whether `B.prototype` appears anywhere in a's prototype chain. It doesn't look at how the object was actually built." },
        { q: 'Why put methods on the prototype instead of in the constructor?', a: "Methods on the prototype are shared by every instance, so there's one copy in memory. Methods created inside the constructor are new functions for every object." },
      ],
      answer30: "Every object has a hidden link to a prototype object. When I read a property the object doesn't have, JavaScript walks up that prototype chain until it finds it or hits null. Constructor functions have a prototype property, and new links each created object to it, so all instances share the same methods. Classes are mostly nicer syntax over this: extends just links one prototype to another. instanceof works by checking whether the constructor's prototype is in the object's chain.",
      mistakes: [
        "Saying JavaScript classes work like Java classes. They're syntax over prototypes.",
        "Mixing up `__proto__` and `prototype`.",
        "Changing built-in prototypes like `Array.prototype` in app code; it can clash with libraries and future features.",
        "Trap: merging untrusted JSON with a deep-merge helper can set `__proto__` keys and pollute `Object.prototype` for the whole app (prototype pollution).",
      ],
      takeaway: "Missing property? JavaScript asks the prototype, then its prototype, up to null.",
    },

    {
      id: 'classes',
      title: 'Classes: constructor, extends, super, static, and private fields',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Classes are cleaner syntax over prototypes, plus real extras: private #fields, static members, and strict mode by default.',
      what: [
        "A class is a template for creating objects. The `constructor` runs when you call `new`. Methods written in the class body go on the prototype, so all instances share them.",
        "`extends` makes one class inherit from another. `super(...)` calls the parent constructor, and `super.method()` calls the parent's version of a method.",
        "`static` members belong to the class itself, not to instances. Fields starting with `#` are truly private: code outside the class can't read them at all.",
      ],
      deeper: [
        "In a child class, you must call `super()` before using `this`, or you get a ReferenceError. If the child has no constructor, one that passes all arguments to `super` is added for you.",
        "Class bodies always run in strict mode. Classes are not hoisted like functions: they're in the temporal dead zone until their line runs. Calling a class without `new` throws a TypeError.",
        "Getters and setters (`get balance()`) let you read a computed value like a property. Arrow functions in class fields (`onClick = () => {...}`) are created per instance and keep `this` bound, which is why React class components used them for handlers.",
        "`#private` fields are enforced by the language (unlike the old `_name` convention), are not visible to `Object.keys` or JSON.stringify, and `#x in obj` checks if an object has one.",
      ],
      why: "Classes show up in Node services, error types, SDKs, and older React code. Interviewers check that you know what they compile down to and the traps around `this` and `super`.",
      analogy: "A class is a cookie cutter, and each instance is a cookie. A subclass is a cutter made by taking the old one and adding sprinkles. A static member is the label on the cutter itself, not on any cookie.",
      code: {
        lang: 'js',
        source: `class Account {
  static count = 0;          // on the class, not on instances
  #balance = 0;              // truly private
  constructor(owner) { this.owner = owner; Account.count++; }
  deposit(amount) {
    if (amount <= 0) throw new RangeError('Amount must be positive');
    this.#balance += amount;
    return this;             // returning this allows chaining
  }
  get balance() { return this.#balance; } // read like a property
  toString() { return \`\${this.owner}: \${this.#balance}\`; }
}

class Savings extends Account {
  constructor(owner, rate) {
    super(owner);            // must run before using this
    this.rate = rate;
  }
  addInterest() { return this.deposit(this.balance * this.rate); }
  toString() { return super.toString() + ' (savings)'; }
}

const s = new Savings('Asha', 0.1);
s.deposit(1000).addInterest();
console.log(String(s));                       // Asha: 1100 (savings)
console.log(s.balance, Object.keys(s));       // 1100 [ 'owner', 'rate' ]  (no #balance)
console.log(Account.count, typeof Account);   // 1 function
console.log(Object.getPrototypeOf(Savings.prototype) === Account.prototype); // true
try { Account('x'); } catch (e) { console.log(e.constructor.name); }      // TypeError

// Arrow class field keeps this; a normal method loses it when pulled off
class Button {
  label = 'Save';
  onClick = () => this.label;
  method() { return this?.label; }
}
const { onClick, method } = new Button();
console.log(onClick(), method());             // Save undefined`,
      },
      output: "`Asha: 1100 (savings)`: the deposit of 1000 plus 10% interest, and the child's toString added ' (savings)' to the parent's result. `1100 [ 'owner', 'rate' ]`: the private field is invisible to Object.keys. `1 function`: a class is a function under the hood. `true` shows extends linked the prototypes. Calling a class without new throws a `TypeError`. Last line `Save undefined`: the arrow field kept `this`, the pulled-off method lost it.",
      questions: [
        { q: 'Are JavaScript classes real classes?', a: "They're mostly syntax over constructor functions and prototypes: methods go on the prototype and extends links prototypes. They do add real features, like private #fields, strict mode, and a TypeError if called without new." },
        { q: 'Why must super() be called before this in a subclass?', a: "In a derived class, the parent constructor is the one that creates the object. Until super() runs, `this` doesn't exist yet, so using it throws a ReferenceError." },
        { q: '#private fields vs the _underscore convention?', a: "`_name` is only a naming hint; anyone can still read it. `#name` is enforced by the language: it can't be accessed from outside the class at all." },
        { q: 'What is a static method used for?', a: "Behaviour that belongs to the class, not to one instance: factory methods like `User.fromJSON()`, counters, or helpers like `Array.isArray`." },
      ],
      answer30: "Classes are a cleaner way to write constructor functions and prototypes: methods go on the prototype, and extends links a child prototype to the parent's. In a subclass I call super before using this, because the parent builds the object. Static members live on the class itself, and #private fields are truly private, unlike the underscore convention. Class bodies run in strict mode, so a method passed as a callback loses this; I bind it or use an arrow-function class field.",
      mistakes: [
        "Forgetting `super()` in a child constructor, or using `this` before it.",
        "Passing `this.method` as a callback and losing `this`.",
        "Expecting classes to be hoisted like function declarations.",
        "Trap: arrow-function fields are created per instance, so they use more memory than prototype methods and can't be called with `super.handler()` from a subclass.",
      ],
      takeaway: "Class = prototype syntax plus #private, static, and strict mode; call super() first.",
    },

    {
      id: 'arrow-functions',
      title: 'Arrow functions in depth',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: "Arrow functions are short and have no own this, arguments, prototype, or new; they borrow this from where they're written.",
      what: [
        "An arrow function is a shorter way to write a function: `(a, b) => a + b`. With no curly braces, the expression is returned automatically (implicit return).",
        "Arrows don't get their own `this`. They use the `this` of the code around them. This makes them ideal for callbacks inside methods.",
      ],
      deeper: [
        "What arrows don't have: their own `this`, `arguments`, `super`, `new.target`, and a `prototype`. So they can't be used as constructors (`new` throws), and `call`/`apply`/`bind` can't change their `this`.",
        "To return an object literal, wrap it in parentheses: `() => ({ id: 1 })`. Without them, the braces are read as a function body and the function returns undefined.",
        "When not to use arrows: object methods that need `this`, prototype methods, constructors, and DOM handlers where you want `this` to be the element. When to use them: array callbacks, promise chains, timers inside methods, React components and handlers.",
        "Arrow functions are always expressions, so they follow `const` rules: they can't be called before their line (TDZ).",
      ],
      why: "Arrows are everywhere in modern code. Interviewers ask about them to check you understand `this`, and because the wrong choice causes real bugs.",
      analogy: "A normal function is a new employee who asks 'who am I working for?' each time they're called. An arrow function is a contractor who always works for whoever hired them, no matter who calls.",
      code: {
        lang: 'js',
        source: `const add = (a, b) => a + b;          // implicit return
const makeUser = (name) => ({ name }); // parentheses needed to return an object
const broken = (name) => { name };     // braces = function body, returns undefined
console.log(add(2, 3), makeUser('Asha'), broken('Asha')); // 5 { name: 'Asha' } undefined

function regular() { return arguments.length; }
const arrow = (...args) => args.length; // no own arguments: use rest parameters
console.log(regular(1, 2, 3), arrow(1, 2, 3)); // 3 3

const Arrow = () => {};
try { new Arrow(); } catch (e) { console.log(e.message); } // Arrow is not a constructor
console.log(Arrow.prototype);          // undefined

const timer = {
  seconds: 0,
  start() {
    [1, 2, 3].forEach(() => this.seconds++); // arrow uses start()'s this (timer)
    return this.seconds;
  },
  broken: () => typeof this?.seconds,  // arrow as a method: this is NOT timer
};
console.log(timer.start(), timer.broken()); // 3 undefined

const getThis = () => this;
console.log(getThis.call(timer) === timer); // false: call can't change an arrow's this`,
      },
      output: "`5 { name: 'Asha' } undefined`: the braces in `broken` made a body, not an object. `3 3`: the arrow used rest parameters instead of arguments. `new Arrow()` throws 'Arrow is not a constructor', and its prototype is `undefined`. `3 undefined`: the arrow inside start() saw timer, but the arrow method did not. The last line is `false`: call couldn't rebind the arrow.",
      questions: [
        { q: 'Arrow function vs regular function?', a: "Arrows are shorter and have no own this, arguments, prototype, or super. They take this from the surrounding code and can't be used with new." },
        { q: 'When should you NOT use an arrow function?', a: "As an object or prototype method that needs `this`, as a constructor, and as a DOM handler where you need `this` to be the element. Use a normal function there." },
        { q: 'How do you return an object from an arrow function in one line?', a: "Wrap it in parentheses: `() => ({ id: 1 })`. Without them, the braces are treated as the function body." },
        { q: 'Can bind change the this of an arrow function?', a: "No. bind, call, and apply ignore the this you pass to an arrow; only the arguments are used." },
      ],
      answer30: "Arrow functions are a short syntax with an implicit return, but the real difference is that they don't have their own this, arguments, or prototype. They use this from the code around them, which makes them great for callbacks inside methods, like a setTimeout or a forEach, and bind or call can't change it. They can't be constructors. I avoid them for object methods that need this, and I remember to wrap object literals in parentheses when returning them.",
      mistakes: [
        "Using an arrow as an object method and getting the wrong `this`.",
        "Writing `() => { id: 1 }` and getting undefined.",
        "Using `arguments` inside an arrow, which silently reads the outer function's arguments.",
        "Trap: in a DOM listener, `function () { this }` is the element, but an arrow's `this` is the outer scope. Use `event.currentTarget` in arrows.",
      ],
      takeaway: "Arrows borrow this from where they're written; wrap returned objects in ().",
    },

    {
      id: 'array-methods',
      title: 'Array methods: map, filter, reduce, find, some, every, flat',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'map transforms, filter selects, reduce combines, find returns the first match, some/every test, flat un-nests.',
      what: [
        "`map` returns a new array with each item transformed. `filter` returns a new array with only the items that pass a test. `reduce` combines all items into one value (a sum, an object, anything).",
        "`find` returns the first item that matches (or undefined); `findIndex` returns its index (or -1). `some` is true if at least one item passes; `every` is true if all pass. `includes` checks if a value is in the array.",
        "`flat` removes levels of nesting; `flatMap` maps and then flattens one level.",
      ],
      deeper: [
        "Mutating vs non-mutating: `push`, `pop`, `splice`, `sort`, `reverse` change the original array. `map`, `filter`, `slice`, `concat` return new ones. Newer copies (Node 20+, modern browsers): `toSorted`, `toReversed`, `toSpliced`, `with`.",
        "`sort()` with no comparator sorts as strings, so `[10, 1, 2].sort()` gives `[1, 10, 2]`. Always pass `(a, b) => a - b` for numbers.",
        "`some`, `every`, `find`, and `findIndex` stop early as soon as they know the answer. `forEach` can't be stopped (except by throwing) and ignores returned promises.",
        "Always give `reduce` an initial value. Without one, it uses the first item, and on an empty array it throws a TypeError. `Object.groupBy` (Node 21+) now covers the common 'group by key' reduce.",
      ],
      why: "These are used every day in React rendering and API data shaping, and interviewers ask you to chain them or implement them yourself.",
      analogy: "A factory line. map is a station that changes every item, filter is a quality checker who removes bad items, and reduce is the packer who puts everything into one box at the end.",
      code: {
        lang: 'js',
        source: `const orders = [
  { id: 1, user: 'asha', total: 250, paid: true },
  { id: 2, user: 'ravi', total: 90, paid: false },
  { id: 3, user: 'asha', total: 400, paid: true },
];

const paidTotals = orders.filter((o) => o.paid).map((o) => o.total);
console.log(paidTotals);                                  // [ 250, 400 ]
console.log(orders.reduce((sum, o) => sum + o.total, 0)); // 740

const idsByUser = orders.reduce((acc, o) => {
  (acc[o.user] ??= []).push(o.id);
  return acc;
}, {});
console.log(idsByUser);                                   // { asha: [ 1, 3 ], ravi: [ 2 ] }

console.log(orders.find((o) => o.total > 100)?.id, orders.findIndex((o) => o.id === 9)); // 1 -1
console.log(orders.some((o) => !o.paid), orders.every((o) => o.total > 50));            // true true

const nested = [1, [2, [3, [4]]]];
console.log(nested.flat(), nested.flat(Infinity));        // [ 1, 2, [ 3, [ 4 ] ] ] [ 1, 2, 3, 4 ]
console.log(['a b', 'c'].flatMap((s) => s.split(' ')));   // [ 'a', 'b', 'c' ]

console.log([10, 1, 2].sort(), [10, 1, 2].sort((a, b) => a - b)); // [ 1, 10, 2 ] [ 1, 2, 10 ]
console.log(['1', '2', '3'].map(parseInt));               // [ 1, NaN, NaN ]

const nums = [3, 1, 2];
const sorted = nums.toSorted();                           // copy, original untouched
console.log(nums, sorted);                                // [ 3, 1, 2 ] [ 1, 2, 3 ]`,
      },
      output: "`[ 250, 400 ]` and `740`. The grouping reduce gives `{ asha: [ 1, 3 ], ravi: [ 2 ] }`. `1 -1` from find and findIndex. `true true` from some and every. flat() removes one level, flat(Infinity) removes all. flatMap gives `[ 'a', 'b', 'c' ]`. Default sort gives `[ 1, 10, 2 ]` (string order), the comparator fixes it. `map(parseInt)` gives `[ 1, NaN, NaN ]` because parseInt receives the index as its radix. toSorted leaves `nums` as `[ 3, 1, 2 ]`.",
      questions: [
        { q: 'map vs forEach?', a: "map returns a new array of the returned values. forEach returns undefined and is only for side effects. Use map when you need the result, like rendering a list in React." },
        { q: 'Why does [10, 1, 2].sort() give [1, 10, 2]?', a: "With no comparator, sort converts items to strings and compares them as text. For numbers, pass `(a, b) => a - b`." },
        { q: "Why does ['1','2','3'].map(parseInt) give [1, NaN, NaN]?", a: "map passes (value, index, array). parseInt takes (string, radix), so it gets radix 0, 1, and 2. Radix 1 is invalid, and '3' isn't a valid digit in base 2. Use `map(Number)` or `map((s) => parseInt(s, 10))`." },
        { q: 'find vs filter?', a: "find returns the first matching item (or undefined) and stops early. filter returns an array of all matches and always checks every item." },
        { q: 'Which array methods mutate the original?', a: "push, pop, shift, unshift, splice, sort, reverse, and fill. In React state, use non-mutating versions like map, filter, slice, spread, or toSorted." },
      ],
      answer30: "map transforms every item into a new array, filter keeps the items that pass a test, and reduce folds everything into a single value like a total or a grouped object. find returns the first match, some and every return booleans and stop early, and flat removes nesting. None of those change the original array, which is why I use them for React state. The traps I watch for are sort without a comparator sorting as strings, sort mutating the array, and reduce without an initial value throwing on an empty array.",
      mistakes: [
        "Using map just to loop, ignoring the returned array (use forEach or for...of).",
        "Calling `sort()` on React state directly; it mutates. Use `toSorted()` or `[...arr].sort()`.",
        "Leaving out reduce's initial value.",
        "Trap: `async` callbacks in map return promises. Wrap with `await Promise.all(arr.map(async ...))`.",
      ],
      takeaway: "map changes, filter selects, reduce combines; sort mutates and compares as strings by default.",
    },

    {
      id: 'es-modules-commonjs',
      title: 'ES modules vs CommonJS',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'CommonJS uses require/module.exports and loads synchronously; ES modules use import/export, are static, async-friendly, and export live bindings.',
      what: [
        "A module is a file with its own scope that shares only what it exports. JavaScript has two module systems.",
        "CommonJS (CJS) is Node's original system: `const x = require('./x')` and `module.exports = ...`. ES modules (ESM) are the official standard used by browsers and modern Node: `import x from './x.js'` and `export ...`.",
        "In Node, a file is ESM if it ends in `.mjs`, or ends in `.js` with `\"type\": \"module\"` in package.json. `.cjs` files, and `.js` files without that setting, are CommonJS.",
      ],
      deeper: [
        "`require` runs when that line is reached, can be called anywhere (inside an `if`), and returns a copy of whatever `module.exports` was at that moment. `import` declarations are static: they must be at the top level, are found before the code runs, and enable tree-shaking in bundlers.",
        "ESM exports are live bindings: if the exporting module changes an exported `let`, importers see the new value. CommonJS gives you the value at require time.",
        "ESM supports top-level `await` and dynamic `import()` (which returns a promise and works in both systems). ESM runs in strict mode and has no `__dirname`, `__filename`, or `require`; use `import.meta.dirname` / `import.meta.filename` (Node 20.11+) or `import.meta.url`.",
        "Interop: ESM can import CommonJS (you get `module.exports` as the default export). CommonJS can `require()` an ES module in recent Node (unflagged in 22.12+ and 20.19+) as long as that module has no top-level await; in older Node you had to use `await import()`. ESM relative imports need the file extension.",
      ],
      why: "Mixing the two is a common source of 'Cannot use import statement outside a module' and 'require is not defined' errors, especially when upgrading Node or migrating to TypeScript. On your resume: the TypeScript migration and the Node 18 to 20 upgrade are good places to say how you handled module settings.",
      analogy: "CommonJS is ordering takeaway: you get a snapshot of the food when you pick it up. ES modules are a live kitchen window: you see the dish as the chef changes it.",
      code: [
        {
          lang: 'js',
          title: 'counter.cjs and app.cjs (CommonJS)',
          source: `// counter.cjs
let count = 0;
function inc() { count++; }
module.exports = { count, inc };

// app.cjs
const counter = require('./counter.cjs');
counter.inc();
console.log('cjs count:', counter.count); // 0  (copied when module.exports was built)`,
        },
        {
          lang: 'js',
          title: 'counter.mjs and app.mjs (ES modules)',
          source: `// counter.mjs
export let count = 0;
export function inc() { count++; }
export default function hello() { return 'hi'; }

// app.mjs
import hello, { count, inc } from './counter.mjs'; // extension required
inc();
console.log('esm count:', count, hello());          // 1 hi  (live binding)

const mod = await import('./counter.mjs');          // dynamic import + top-level await
console.log(mod.default === hello, mod.count);      // true 1 (same module instance)`,
        },
        {
          lang: 'json',
          title: 'package.json: make .js files ESM',
          source: `{
  "type": "module",
  "exports": {
    "import": "./dist/index.js",
    "require": "./dist/index.cjs"
  }
}`,
        },
      ],
      output: "The CommonJS app prints `cjs count: 0`, because module.exports captured the value 0 when it was created. The ES module app prints `esm count: 1 hi`, because imports are live bindings to the exporting module's variables. The dynamic import returns the same cached module, so it prints `true 1`.",
      questions: [
        { q: 'Main differences between CommonJS and ES modules?', a: "CommonJS uses require and module.exports, loads synchronously, and can require anywhere. ESM uses import and export, is static and analysable (tree-shaking), supports top-level await, exports live bindings, and is the browser standard." },
        { q: 'How does Node decide whether a file is ESM or CommonJS?', a: "`.mjs` is always ESM and `.cjs` is always CommonJS. For `.js`, the nearest package.json decides: `\"type\": \"module\"` means ESM, otherwise CommonJS." },
        { q: 'What is a live binding?', a: "An ES module import is a read-only view of the exporter's variable, not a copy. If the exporting module changes the value, importers see the change. CommonJS copies values at require time." },
        { q: 'How do you get __dirname in an ES module?', a: "Use `import.meta.dirname` in Node 20.11+, or build it from `import.meta.url` with `fileURLToPath` and `path.dirname`." },
        { q: 'Can CommonJS load an ES module?', a: "With dynamic `import()`, always. With plain `require()`, only in recent Node (22.12+ and 20.19+), and only if the module has no top-level await." },
      ],
      answer30: "CommonJS is Node's original system with require and module.exports; it's synchronous, can be called anywhere, and copies exported values. ES modules are the standard: import and export are static, so bundlers can tree-shake, they support top-level await, and imports are live bindings. In Node, .mjs is ESM, .cjs is CommonJS, and .js depends on the type field in package.json. ESM has no __dirname or require, so I use import.meta, and I remember that ESM needs file extensions in relative imports.",
      mistakes: [
        "Leaving out the `.js` extension in ESM relative imports.",
        "Using `__dirname` or `require` in an ES module.",
        "Mixing `module.exports` and `export` in the same file.",
        "Trap: the tsconfig `module` setting changes what TypeScript emits. With `NodeNext`, TypeScript follows Node's rules, including the extension requirement.",
      ],
      takeaway: "require copies at call time; import is static and live. package.json 'type' decides .js files.",
    },

    {
      id: 'error-handling',
      title: 'Error handling: try/catch, custom errors, and async errors',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: "Throw Error objects, catch only what you can handle, give errors names and causes, and remember try/catch only catches what you await.",
      what: [
        "`throw` stops the current function and jumps to the nearest `catch`. `finally` always runs, whether there was an error or not, which makes it the place for cleanup.",
        "Built-in error types include `Error`, `TypeError`, `RangeError`, `ReferenceError`, and `SyntaxError`. You can create your own by extending `Error`.",
        "For async code, `try/catch` around an `await` catches a rejected promise. Without `await`, the error escapes.",
      ],
      deeper: [
        "Custom errors: extend `Error`, call `super(message)`, set `this.name`, and add fields like `status` or `field`. Then check with `instanceof` and rethrow anything you didn't expect, so real bugs aren't swallowed.",
        "Error cause (ES2022): `new Error('Config load failed', { cause: err })` wraps a low-level error without losing it. Logs and debuggers show both.",
        "try/catch can't catch errors thrown later inside a callback, like inside `setTimeout`, because that code runs after the try block has finished. For promises, catch with `await` inside try, or `.catch()`. Unhandled rejections crash Node 15+.",
        "In Express 4, errors in async route handlers must be passed to `next(err)` (or caught by a wrapper). Express 5 forwards rejected promises from handlers to the error middleware automatically.",
      ],
      why: "Good error handling decides whether a bug becomes a clear 400 response and a useful log, or a crashed process and a vague 500. Interviewers ask how you structure it in a real API.",
      analogy: "A safety net under a trapeze. try is the act, catch is the net, and finally is the crew sweeping the stage either way. But the net only covers the act happening now; it can't catch someone who falls in tomorrow's show (a callback that runs later).",
      code: {
        lang: 'js',
        source: `class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}
class NotFoundError extends Error {
  name = 'NotFoundError';
  status = 404;
}

function parseAge(input) {
  const age = Number(input);
  if (Number.isNaN(age)) throw new ValidationError('age', 'Age must be a number');
  return age;
}

try {
  parseAge('abc');
} catch (err) {
  if (err instanceof ValidationError) console.log(err.name, err.field, err.message);
  else throw err;                    // rethrow what you don't know how to handle
} finally {
  console.log('finally always runs');
}

// Wrap a low-level error without losing it
try {
  try { JSON.parse('{bad'); } catch (e) { throw new Error('Config load failed', { cause: e }); }
} catch (err) {
  console.log(err.message, '<-', err.cause.name);
}

// Async: try/catch only catches what you await
async function loadUser() { throw new NotFoundError('User not found'); }
async function main() {
  try { await loadUser(); } catch (e) { console.log('awaited:', e.name, e.status); }
  loadUser().catch((e) => console.log('.catch:', e.message));
}
main();`,
      },
      output: "`ValidationError age Age must be a number`, then `finally always runs`. Then `Config load failed <- SyntaxError`: the original JSON error is kept as the cause. Then `awaited: NotFoundError 404` and `.catch: User not found`, both from rejected promises that were handled.",
      questions: [
        { q: 'How do you create a custom error?', a: "Extend Error, call super(message), set this.name, and add useful fields like status or code. Callers can then check it with instanceof." },
        { q: 'Why does try/catch not catch an error thrown inside setTimeout?', a: "The callback runs later, after the try block has already finished. The error is thrown on a different turn of the event loop, so the catch is no longer active." },
        { q: 'How do you handle errors with async/await?', a: "Put the await inside try/catch, or attach .catch() to the promise. If you call an async function without awaiting or catching it, a rejection becomes an unhandled rejection." },
        { q: 'What is finally used for?', a: "Cleanup that must always happen, like closing a file, releasing a lock, or hiding a spinner. It runs after try or catch, even if they return or throw." },
        { q: 'What is error.cause?', a: "An option added in ES2022: `new Error(msg, { cause })` keeps the original error attached when you wrap it in a higher-level one, so you don't lose the root cause." },
      ],
      answer30: "I throw Error objects, never strings, and create custom classes like ValidationError or NotFoundError that extend Error, set a name, and carry a status. I catch only where I can do something useful, check with instanceof, and rethrow the rest. When wrapping a low-level error I pass it as cause. For async code, try/catch only works around an await, so every promise is either awaited or has a .catch. In Express, one error middleware maps error types to status codes.",
      mistakes: [
        "Empty catch blocks that hide bugs.",
        "Throwing strings, which have no stack trace.",
        "Forgetting to await inside try, so the rejection escapes.",
        "Trap: `return promise` inside try doesn't catch its rejection, but `return await promise` does.",
      ],
      takeaway: "Throw real Error subclasses, catch only what you can handle, and await inside try.",
    },

    {
      id: 'memory-leaks-gc',
      title: 'Memory leaks and garbage collection',
      level: 'advanced',
      priority: 'good',
      frequency: 'common',
      summary: 'The garbage collector frees anything that can no longer be reached; a leak is memory you no longer need but still reach by accident.',
      what: [
        "JavaScript frees memory automatically. The garbage collector (GC) starts from 'roots' (global variables, the current call stack) and marks every object it can reach. Anything not reached is freed. This is called mark-and-sweep.",
        "A memory leak happens when you still hold a reference to something you don't need anymore, so the GC can't free it. Memory grows until the tab slows down or the Node process crashes with 'heap out of memory'.",
      ],
      deeper: [
        "Common leaks: (1) caches or arrays that only grow, (2) event listeners and `setInterval` that are never removed, (3) closures that capture large objects, (4) removed DOM nodes still stored in a variable (detached DOM), (5) accidental globals in sloppy mode.",
        "V8 uses a generational collector: most objects die young, so new objects live in a small 'young generation' that is cleaned often and cheaply. Survivors move to the 'old generation', which is cleaned less often.",
        "Tools: Chrome DevTools Memory tab (take two heap snapshots and compare, look for 'Detached' nodes). In Node: `process.memoryUsage()`, `node --inspect` with heap snapshots, and `--max-old-space-size` to change the heap limit.",
        "`WeakMap`, `WeakSet`, and `WeakRef` hold objects weakly, so they don't keep them alive. That's useful for per-object metadata and caches.",
      ],
      why: "Leaks in a long-running Node server slowly increase memory until it restarts; in single-page apps they make tabs sluggish. Interviewers want you to name causes and how you'd find them.",
      analogy: "A cloakroom. Staff throw away any coat whose ticket nobody holds. A leak is keeping tickets in your pocket for coats you'll never collect: the cloakroom fills up even though nobody wears them.",
      code: {
        lang: 'js',
        source: `// Leak 1: a cache that only grows
const cache = new Map();
function getUserLeaky(id) {
  if (!cache.has(id)) cache.set(id, { id, data: new Array(1000).fill('x') });
  return cache.get(id);
}

// Fix: a bounded LRU cache (Map keeps insertion order)
class LRU {
  constructor(limit) { this.limit = limit; this.map = new Map(); }
  get(key) {
    if (!this.map.has(key)) return undefined;
    const value = this.map.get(key);
    this.map.delete(key); this.map.set(key, value);  // mark as newest
    return value;
  }
  set(key, value) {
    this.map.delete(key); this.map.set(key, value);
    if (this.map.size > this.limit) this.map.delete(this.map.keys().next().value); // drop oldest
  }
}

for (let i = 0; i < 10_000; i++) getUserLeaky(i);
const lru = new LRU(100);
for (let i = 0; i < 10_000; i++) lru.set(i, { id: i });
console.log('leaky size:', cache.size, '| lru size:', lru.map.size);

// Leak 2: listeners and timers that are never removed
const { EventEmitter } = require('node:events');
const bus = new EventEmitter();
function subscribe() {
  const big = new Array(100_000).fill('*');         // kept alive by the closure below
  const onMessage = () => big.length;
  bus.on('message', onMessage);
  const timer = setInterval(() => {}, 1000);
  return () => { bus.off('message', onMessage); clearInterval(timer); }; // cleanup
}
const unsubscribe = subscribe();
console.log('listeners:', bus.listenerCount('message'));
unsubscribe();
console.log('after cleanup:', bus.listenerCount('message'));`,
      },
      output: "`leaky size: 10000 | lru size: 100`: the plain Map keeps all 10,000 entries forever, while the LRU keeps only the newest 100. Then `listeners: 1` and `after cleanup: 0`. Once the listener and timer are removed, nothing references `big`, so the GC can free it, and the process exits because no interval is left.",
      questions: [
        { q: 'How does garbage collection work in JavaScript?', a: "Mostly mark-and-sweep: starting from roots like globals and the call stack, the GC marks every reachable object and frees the rest. V8 also splits objects into young and old generations because most objects die young." },
        { q: 'Name common causes of memory leaks.', a: "Caches or arrays that only grow, event listeners and intervals never removed, closures holding big objects, references to removed DOM nodes, and accidental globals." },
        { q: 'How would you find a memory leak?', a: "Reproduce it, then take heap snapshots before and after in Chrome DevTools (or Node with --inspect) and compare which objects keep growing and what retains them. In Node, watch process.memoryUsage().heapUsed over time." },
        { q: 'How do React effects prevent leaks?', a: "The cleanup function returned from useEffect removes listeners, clears timers, and aborts requests when the component unmounts or the effect re-runs." },
      ],
      answer30: "JavaScript uses garbage collection, mainly mark-and-sweep: anything that can't be reached from roots like globals and the stack gets freed. A leak is memory I still reference by accident, so it can't be freed. The usual causes are unbounded caches, listeners and intervals that are never removed, closures capturing large data, and detached DOM nodes. I prevent them with cleanup functions and bounded caches or WeakMaps, and I debug them by comparing heap snapshots.",
      mistakes: [
        "Thinking garbage collection means leaks can't happen.",
        "Using a plain object or Map as a cache with no size limit or expiry in a server.",
        "Adding a listener in a React effect without returning a cleanup.",
        "Trap: setting a variable to null doesn't free memory if something else, like a listener or a closure, still references the object.",
      ],
      takeaway: "Reachable stays, unreachable goes; leaks are forgotten references, so clean up and bound caches.",
    },

    {
      id: 'currying-hof',
      title: 'Currying and higher-order functions',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'A higher-order function takes or returns a function. Currying turns f(a, b, c) into f(a)(b)(c) so you can pre-fill arguments.',
      what: [
        "Functions in JavaScript are values: you can pass them in, return them, and store them. A higher-order function (HOF) is one that takes a function as an argument or returns one. `map`, `filter`, `setTimeout`, and `debounce` are all HOFs.",
        "Currying transforms a function that takes several arguments into a chain of functions that each take one: `add(1, 2)` becomes `add(1)(2)`. Partial application means pre-filling some arguments to get a more specific function.",
      ],
      deeper: [
        "A generic `curry` helper uses `fn.length` (the number of declared parameters) and a closure that collects arguments until it has enough, then calls the original function.",
        "`fn.length` ignores rest parameters and parameters with defaults, so a generic curry doesn't work on `(...args) => ...`. That's why the infinite-sum puzzle `sum(1)(2)(3)()` uses an empty call to signal 'done'.",
        "Composition joins small functions into a pipeline. `pipe(f, g, h)(x)` runs left to right, `compose(f, g, h)(x)` runs right to left. Both are a one-line `reduce`.",
        "Real uses: Express middleware factories (`requireRole('admin')` returns a middleware), Redux `connect`, HOCs in React, event handler factories (`onChange(field)`), and logging or retry wrappers.",
      ],
      why: "Interviewers often ask you to write `curry` or `sum(1)(2)(3)`, and HOFs explain middleware, decorators, and React patterns you use every day.",
      analogy: "Currying is a coffee machine that asks one question at a time: size, then milk, then sugar. You can stop after 'large, oat milk', save that as your usual, and only answer the sugar question each morning.",
      code: {
        lang: 'js',
        source: `// A higher-order function: takes a function, returns a new one
const withLogging = (fn) => (...args) => {
  const result = fn(...args);
  console.log(\`\${fn.name}(\${args.join(', ')}) = \${result}\`);
  return result;
};
const add = (a, b) => a + b;
withLogging(add)(2, 3);                         // add(2, 3) = 5

// Manual currying / partial application
const discount = (pct) => (price) => price - (price * pct) / 100;
const tenOff = discount(10);
console.log([100, 250].map(tenOff));           // [ 90, 225 ]

// Generic curry
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args);
    return (...more) => curried.apply(this, [...args, ...more]);
  };
}
const volume = (l, w, h) => l * w * h;
const cv = curry(volume);
console.log(cv(2)(3)(4), cv(2, 3)(4), cv(2)(3, 4)); // 24 24 24

// Infinite currying: an empty call means "done"
const sum = (a) => (b) => (b === undefined ? a : sum(a + b));
console.log(sum(1)(2)(3)());                   // 6

// Composition with reduce
const pipe = (...fns) => (x) => fns.reduce((value, f) => f(value), x);
const slugify = pipe((s) => s.trim(), (s) => s.toLowerCase(), (s) => s.replace(/\\s+/g, '-'));
console.log(slugify('  Hello World JS '));     // hello-world-js`,
      },
      output: "`add(2, 3) = 5` from the logging wrapper. `[ 90, 225 ]` from the pre-filled discount. `24 24 24`: the generic curry accepts the arguments in any grouping. `6` from the infinite sum. `hello-world-js` from the pipe.",
      questions: [
        { q: 'What is a higher-order function?', a: "A function that takes a function as an argument, returns a function, or both. Examples: map, filter, setTimeout, debounce, and Express middleware factories." },
        { q: 'What is currying?', a: "Turning a function of several arguments into a chain of one-argument functions: f(a, b, c) becomes f(a)(b)(c). It relies on closures to remember earlier arguments." },
        { q: 'Currying vs partial application?', a: "Currying always splits into single-argument steps. Partial application pre-fills some arguments and returns a function for the rest, like `bind(null, 10)` or `discount(10)`." },
        { q: 'How does a generic curry know when to call the function?', a: "It compares the collected arguments with fn.length, the number of declared parameters. When it has enough, it calls the original; otherwise it returns a function that collects more." },
        { q: 'How do you implement sum(1)(2)(3)()?', a: "Return a function that takes the next number. If it's called with no argument, return the total; otherwise return sum(total + next): `const sum = (a) => (b) => (b === undefined ? a : sum(a + b))`." },
      ],
      answer30: "A higher-order function takes or returns another function; map, filter, debounce, and middleware factories are everyday examples. Currying turns f(a, b, c) into f(a)(b)(c), using closures to remember each argument, which lets me pre-fill arguments to build specific functions, like a discount(10) that I can pass straight to map. A generic curry checks fn.length to know when it has all arguments. Composition, like pipe, chains small functions with reduce.",
      mistakes: [
        "Relying on `fn.length` for functions with default or rest parameters (they aren't counted).",
        "Losing `this` in a wrapper: forward it with `fn.apply(this, args)` when the function needs it.",
        "Over-currying simple code until nobody can read it.",
        "Trap: `pipe` runs left to right and `compose` right to left. Say which one you're writing.",
      ],
      takeaway: "Functions are values: pass them, return them, pre-fill them with closures.",
    },

    {
      id: 'deep-shallow-copy',
      title: 'Deep vs shallow copy (structuredClone)',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'A shallow copy duplicates only the top level; nested objects are still shared. structuredClone makes a real deep copy.',
      what: [
        "A shallow copy creates a new outer object, but nested objects and arrays inside it are still the same ones as in the original. Spread (`{ ...obj }`, `[...arr]`), `Object.assign`, `Array.from`, and `slice` all make shallow copies.",
        "A deep copy duplicates everything, at every level, so the copy shares nothing with the original. The modern way is `structuredClone(obj)`, built into browsers and Node 17+.",
      ],
      deeper: [
        "`JSON.parse(JSON.stringify(obj))` is the old deep-copy trick, but it breaks things: Dates become strings, `undefined` and functions disappear, Map and Set become `{}`, `NaN` and `Infinity` become `null`, and circular references throw.",
        "`structuredClone` handles Dates, Maps, Sets, RegExps, typed arrays, nested and circular references. It can't clone functions, DOM nodes, or class behaviour: it throws a `DataCloneError` for functions, and class instances come back as plain objects (the prototype is lost). Getters are read once and copied as values.",
        "For React and Redux state you usually don't need a deep copy: copy only the path you change (`{ ...state, user: { ...state.user, name } }`) and share the rest. This is called structural sharing and keeps updates fast. Libraries like Immer do it for you.",
      ],
      why: "Accidentally sharing nested objects causes bugs where changing 'a copy' changes the original, including React state that doesn't re-render or updates in the wrong place.",
      analogy: "A shallow copy is copying a folder's index page: new index, but it still points to the same documents. A deep copy photocopies every document inside too.",
      code: {
        lang: 'js',
        source: `const original = {
  name: 'Asha',
  skills: ['js', 'node'],
  joined: new Date('2023-06-01'),
  meta: new Map([['team', 'core']]),
};

const spread = { ...original };
const assigned = Object.assign({}, original);
spread.skills.push('react');                      // changes the SHARED array
console.log(original.skills, assigned.skills === original.skills); // [ 'js', 'node', 'react' ] true

const viaJson = JSON.parse(JSON.stringify(original));
console.log(typeof viaJson.joined, viaJson.meta);  // string {}  (Date and Map are lost)

const deep = structuredClone(original);
deep.skills.push('aws');
console.log(original.skills.length, deep.skills.length);       // 3 4
console.log(deep.joined instanceof Date, deep.meta.get('team')); // true core

// Circular references: JSON throws, structuredClone copes
const node = { name: 'a' };
node.self = node;
try { JSON.stringify(node); } catch (e) { console.log('JSON:', e.constructor.name); }
const cloned = structuredClone(node);
console.log(cloned.self === cloned, cloned !== node); // true true

// Functions can't be cloned
try { structuredClone({ run() {} }); } catch (e) { console.log(e.name); } // DataCloneError`,
      },
      output: "`[ 'js', 'node', 'react' ] true`: pushing to the spread copy changed the original, and Object.assign shares the same array. The JSON copy turned the Date into a `string` and the Map into `{}`. structuredClone gives `3 4` (independent arrays) and `true core` (Date and Map kept). JSON.stringify throws a `TypeError` on the circular object, while the clone keeps the loop: `true true`. Cloning a function throws `DataCloneError`.",
      questions: [
        { q: 'Shallow copy vs deep copy?', a: "A shallow copy makes a new top-level object but shares nested objects with the original. A deep copy duplicates every level, so nothing is shared." },
        { q: 'How do you deep copy an object in modern JavaScript?', a: "`structuredClone(obj)`. It's built into browsers and Node 17+, and handles Dates, Maps, Sets, and circular references." },
        { q: "What's wrong with JSON.parse(JSON.stringify(obj))?", a: "It loses Dates (become strings), undefined and functions (dropped), Map and Set (become {}), turns NaN and Infinity into null, and throws on circular references." },
        { q: 'What can structuredClone not copy?', a: "Functions and DOM nodes (it throws DataCloneError), and class prototypes: a class instance comes back as a plain object without its methods." },
      ],
      answer30: "A shallow copy, like spread or Object.assign, creates a new outer object but nested objects are still shared, so changing a nested value in the copy changes the original. A deep copy duplicates every level. Today I use structuredClone for that: it keeps Dates, Maps, Sets, and circular references. The old JSON trick loses Dates, undefined, functions, and Maps. For React state I usually don't deep copy at all; I copy just the path I'm changing.",
      mistakes: [
        "Thinking spread is a deep copy.",
        "Using the JSON trick on data with Dates or Maps.",
        "Deep-cloning large state on every update when copying one path would do.",
        "Trap: structuredClone drops the prototype, so a cloned class instance loses its methods.",
      ],
      takeaway: "Spread copies one level; structuredClone copies all levels (but not functions or prototypes).",
    },

    {
      id: 'event-propagation-delegation',
      title: 'Event bubbling, capturing, and delegation',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'A DOM event travels down to the target (capture), then back up (bubble). Delegation puts one listener on a parent and uses event.target.',
      what: [
        "When you click an element, the event doesn't only fire on that element. It travels in three phases: capturing (from `window` down to the target), target (on the element itself), and bubbling (from the target back up to `window`).",
        "By default, `addEventListener` listens in the bubbling phase. Pass `{ capture: true }` to listen on the way down.",
        "Event delegation means attaching one listener to a parent and checking `event.target` to see which child was clicked, instead of adding a listener to every child.",
      ],
      deeper: [
        "`event.target` is the element that was actually clicked (it could be an icon inside your button). `event.currentTarget` is the element whose listener is running. In delegation, use `event.target.closest('selector')` to find the element you care about.",
        "`stopPropagation()` stops the event from moving to further elements. `stopImmediatePropagation()` also stops other listeners on the same element. `preventDefault()` is different: it cancels the browser's default action (following a link, submitting a form) but does not stop propagation.",
        "Some events don't bubble, like `focus`, `blur`, `mouseenter`, and `mouseleave`. Use `focusin`/`focusout` or capture for delegation with them.",
        "React attaches its listeners at the root container (since React 17) and uses delegation internally, so `e.stopPropagation()` in React stops React handlers but native listeners on document may still have run first.",
      ],
      why: "Delegation means fewer listeners, less memory, and it works for items added later, like rows in a growing list. Interviewers often ask you to code it.",
      analogy: "A letter delivered in an office building goes down through security, the floor, and the department to the person (capture), then the reply goes back up the same way (bubble). Delegation is the front desk handling mail for everyone instead of giving each employee their own mailbox.",
      code: [
        {
          lang: 'html',
          title: 'Markup',
          source: `<ul id="todo-list">
  <li data-id="1">Buy milk <button class="delete">x</button></li>
  <li data-id="2">Write tests <button class="delete">x</button></li>
</ul>
<div id="outer"><button id="inner">Click me</button></div>`,
        },
        {
          lang: 'js',
          title: 'Delegation and phases (browser)',
          source: `// Delegation: ONE listener on the parent handles every item, even future ones
const list = document.querySelector('#todo-list');
list.addEventListener('click', (event) => {
  const button = event.target.closest('button.delete'); // clicked element or its ancestor
  if (!button || !list.contains(button)) return;         // click wasn't on a delete button
  const item = button.closest('li');
  console.log('delete todo', item.dataset.id);
  item.remove();
});
list.insertAdjacentHTML('beforeend', '<li data-id="3">Deploy <button class="delete">x</button></li>');
// The new item's button works without adding a listener

// Phases: capture (down), target, bubble (up)
const outer = document.querySelector('#outer');
const inner = document.querySelector('#inner');
outer.addEventListener('click', () => console.log('outer capture'), { capture: true });
outer.addEventListener('click', () => console.log('outer bubble'));
inner.addEventListener('click', (e) => {
  console.log('inner target');
  // e.stopPropagation(); // uncomment and 'outer bubble' no longer logs
});`,
        },
      ],
      output: "Clicking a delete button logs 'delete todo 1' (or 2, or 3 for the item added later) and removes that row, all from one listener. Clicking 'Click me' logs 'outer capture', then 'inner target', then 'outer bubble'. With stopPropagation uncommented, 'outer bubble' is skipped, but 'outer capture' still logs because it ran on the way down.",
      questions: [
        { q: 'What are the phases of a DOM event?', a: "Capturing (from window down to the target), target, and bubbling (from the target back up). Listeners run in the bubbling phase unless you pass { capture: true }." },
        { q: 'What is event delegation and why use it?', a: "Putting one listener on a parent and using event.target to find which child was clicked. It uses fewer listeners and automatically works for children added later." },
        { q: 'event.target vs event.currentTarget?', a: "target is the element where the event started (what was actually clicked). currentTarget is the element whose listener is running right now." },
        { q: 'stopPropagation vs preventDefault?', a: "stopPropagation stops the event from reaching other elements. preventDefault cancels the browser's default action, like submitting a form, but the event still propagates." },
        { q: 'Which events do not bubble?', a: "focus, blur, mouseenter, mouseleave, and a few others like load. For delegation use focusin and focusout, or listen in the capture phase." },
      ],
      answer30: "A DOM event first travels down from the window to the target, which is capturing, then back up, which is bubbling. Listeners fire during bubbling by default. Event delegation uses that: I put one listener on a parent and use event.target.closest to find the child that was clicked, so I don't need a listener per item, and new items work automatically. target is what was clicked, currentTarget is where the listener is. stopPropagation stops the travel; preventDefault only cancels the default action.",
      mistakes: [
        "Using `event.target` directly when the click landed on an icon inside the button; use `closest()`.",
        "Confusing stopPropagation with preventDefault.",
        "Adding a listener to every row of a large list.",
        "Trap: stopPropagation in a bubbling listener can't stop capture listeners on ancestors; they've already run.",
      ],
      takeaway: "Events go down then up; delegate with one parent listener and event.target.closest().",
    },

    {
      id: 'dom-manipulation',
      title: 'DOM manipulation basics',
      level: 'basic',
      priority: 'good',
      frequency: 'common',
      summary: 'Select with querySelector, create with createElement, set text with textContent, and batch changes to avoid layout thrashing.',
      what: [
        "The DOM (Document Object Model) is the browser's tree of objects representing the HTML page. JavaScript changes the page by changing this tree.",
        "Common tasks: select elements (`querySelector`, `querySelectorAll`), create them (`createElement`), add them (`append`, `prepend`, `before`, `after`), remove them (`remove()`), and change text, classes, attributes, and styles.",
      ],
      deeper: [
        "`textContent` sets plain text and is safe. `innerHTML` parses HTML, so putting user input into it allows XSS (cross-site scripting). Escape it, use `textContent`, or sanitize with a library like DOMPurify.",
        "`querySelectorAll` returns a static NodeList (a snapshot). `getElementsByClassName` returns a live HTMLCollection that updates as the DOM changes.",
        "Layout thrashing: reading a layout value (`offsetHeight`, `getBoundingClientRect`) right after writing styles forces the browser to recalculate layout immediately. Doing that in a loop is slow. Batch all reads, then all writes, and insert many nodes at once with a `DocumentFragment` or a single `append(...nodes)`.",
        "`dataset` reads and writes `data-*` attributes. `classList` has `add`, `remove`, `toggle`, and `contains`.",
      ],
      why: "Even React developers get asked to build a small widget in plain JS, and knowing what React does for you (batched DOM updates, escaping text) is part of senior-level answers.",
      analogy: "The DOM is a family tree drawn on a whiteboard. JavaScript can find a person (select), add a new child (create and append), erase someone (remove), or change their name tag (textContent).",
      code: {
        lang: 'js',
        title: 'Browser console',
        source: `const app = document.querySelector('#app');            // first match or null
const items = document.querySelectorAll('.item');      // static NodeList
items.forEach((el) => el.classList.add('seen'));

const userInput = '<img src=x onerror=alert(1)>';
const card = document.createElement('div');
card.className = 'card';
card.textContent = userInput;          // safe: shown as text, not run as HTML
card.dataset.userId = '42';            // sets data-user-id="42"
card.classList.toggle('active');
card.setAttribute('aria-label', 'User card');
card.style.setProperty('--accent', 'teal');
app.append(card);

// card.innerHTML = userInput;         // DANGER: would run the onerror script (XSS)

// Batch inserts: one DOM update instead of 1000
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li');
  li.textContent = \`Row \${i}\`;
  fragment.append(li);
}
document.querySelector('#list').append(fragment);

// Layout thrashing: read, write, read, write... forces layout every time
const boxes = [...document.querySelectorAll('.box')];
// Bad:  boxes.forEach((b) => { b.style.height = b.offsetWidth + 'px'; });
const widths = boxes.map((b) => b.offsetWidth);            // all reads first
boxes.forEach((b, i) => { b.style.height = widths[i] + 'px'; }); // then all writes

card.remove();                         // remove from the page`,
      },
      output: "The card shows the text '<img src=x onerror=alert(1)>' literally instead of running it, gets the attribute data-user-id=\"42\", and appears inside #app. The list gets 1000 rows in a single DOM insert. The box heights are set after reading every width first, so layout is calculated once instead of once per box. Finally the card is removed.",
      questions: [
        { q: 'textContent vs innerHTML?', a: "textContent sets or reads plain text and is safe for user input. innerHTML parses a string as HTML, so untrusted input can inject scripts (XSS)." },
        { q: 'querySelectorAll vs getElementsByClassName?', a: "querySelectorAll takes any CSS selector and returns a static NodeList snapshot. getElementsByClassName returns a live HTMLCollection that updates automatically when the DOM changes." },
        { q: 'What is layout thrashing and how do you avoid it?', a: "Alternating DOM writes and layout reads (like offsetHeight) forces the browser to recalculate layout again and again. Batch all reads first, then all writes, or use requestAnimationFrame." },
        { q: 'How do you add many elements efficiently?', a: "Build them in a DocumentFragment (or an array) and insert once with append, so the browser updates the page one time." },
      ],
      answer30: "I select elements with querySelector and querySelectorAll, create them with createElement, and insert them with append or before. For text I use textContent, never innerHTML with user input, because that's an XSS hole. I toggle classes with classList and use dataset for data attributes. For performance I batch: build many nodes in a DocumentFragment and insert once, and I group layout reads before style writes to avoid layout thrashing.",
      mistakes: [
        "Putting user input into innerHTML.",
        "Calling querySelector in a loop for the same element instead of saving it.",
        "Reading offsetHeight after every style change in a loop.",
        "Trap: querySelector returns null when nothing matches, so `document.querySelector('#x').textContent` throws if #x is missing.",
      ],
      takeaway: "querySelector to find, textContent for safety, batch writes to keep it fast.",
    },

    {
      id: 'map-set-weakmap-weakset',
      title: 'Map, Set, WeakMap, and WeakSet',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Map is a key-value store with any key type; Set holds unique values. The Weak versions hold object keys without keeping them alive.',
      what: [
        "`Map` stores key-value pairs like an object, but keys can be any type (objects, functions, numbers), it remembers insertion order, and it has a `.size`.",
        "`Set` stores unique values: adding a value twice keeps one copy. `[...new Set(arr)]` is the classic one-line de-duplicate.",
        "`WeakMap` and `WeakSet` only accept objects as keys, and hold them weakly: if nothing else references the object, it can be garbage collected and its entry disappears.",
      ],
      deeper: [
        "Map vs object: plain object keys are always strings or symbols (an object key becomes '[object Object]'), objects inherit keys like `toString` from the prototype, and they're less optimised for frequent adds and deletes. Use Map for dynamic dictionaries and caches; use objects for fixed-shape records and JSON.",
        "Sets compare with SameValueZero: like `===`, except `NaN` equals `NaN`. Two different objects with the same content are two different entries.",
        "Weak collections can't be iterated and have no `size`, because their contents can change at any time when the GC runs. Use them for private data or metadata attached to objects you don't own (like DOM nodes) without causing leaks.",
        "New Set methods (Node 22+, modern browsers): `union`, `intersection`, `difference`, `symmetricDifference`, `isSubsetOf`.",
      ],
      why: "Interviewers ask when to use Map over an object, how to dedupe, and what Weak collections are for. They also come up in LRU caches and memory-leak answers.",
      analogy: "A Map is a coat-check where your ticket can be anything, even your car keys. A Set is a guest list where each name appears once. A WeakMap is a sticky note on someone's coat: when the coat is thrown away, the note goes with it.",
      code: {
        lang: 'js',
        source: `const user = { id: 1 };
const visits = new Map();
visits.set(user, 3).set('guest', 1);       // any key type, insertion order kept
console.log(visits.get(user), visits.size); // 3 2

const plain = {};
plain[user] = 'x';                          // object key turned into a string
console.log(Object.keys(plain));            // [ '[object Object]' ]

const tags = new Set(['js', 'node', 'js']);
console.log(tags.size, [...tags]);          // 2 [ 'js', 'node' ]
console.log([...new Set([3, 1, 3, 2, 1])]); // [ 3, 1, 2 ]  dedupe, keeps first-seen order
console.log(new Set([NaN, NaN, {}, {}]).size); // 3 (NaN once, two different objects)

const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);
console.log(a.intersection(b), a.difference(b)); // Set(2) { 2, 3 } Set(1) { 1 }  (Node 22+)

// WeakMap: metadata per object, no leak
const meta = new WeakMap();
let button = { label: 'save' };
meta.set(button, { clicks: 0 });
meta.get(button).clicks++;
console.log(meta.get(button));              // { clicks: 1 }
button = null;                              // the entry can now be garbage collected
console.log(typeof meta.size, typeof meta.keys); // undefined undefined (not iterable)
try { meta.set('str', 1); } catch (e) { console.log(e.constructor.name); } // TypeError

const seen = new WeakSet();
const req = {};
seen.add(req);
console.log(seen.has(req), seen.has({}));   // true false`,
      },
      output: "`3 2` from the Map. The plain object turned the object key into `[ '[object Object]' ]`. The Set gives `2 [ 'js', 'node' ]`, de-duplication gives `[ 3, 1, 2 ]`, and `3` shows NaN counted once but two separate `{}`. Set methods print `Set(2) { 2, 3 } Set(1) { 1 }`. The WeakMap logs `{ clicks: 1 }`, has no size or keys (`undefined undefined`), and rejects a string key with a `TypeError`. The WeakSet gives `true false`.",
      questions: [
        { q: 'When would you use a Map instead of an object?', a: "When keys aren't strings (objects, numbers you don't want converted), when you add and delete keys often, when you need .size or reliable insertion order, or to avoid inherited keys like toString." },
        { q: 'How do you remove duplicates from an array?', a: "`[...new Set(arr)]`. It keeps the first occurrence order. For arrays of objects, dedupe by a key with a Map instead." },
        { q: 'What is a WeakMap and when do you use it?', a: "A map whose keys must be objects and are held weakly: when the key object is no longer referenced elsewhere, the entry can be garbage collected. Use it for private data or metadata attached to objects, like DOM nodes, without leaking memory." },
        { q: 'Why can you not iterate a WeakMap?', a: "Its entries can disappear whenever the garbage collector runs, so listing them or reporting a size would give unpredictable results." },
      ],
      answer30: "Map is a key-value collection where keys can be any type, it keeps insertion order, and it has size, so I use it for caches and dynamic lookups instead of plain objects. Set stores unique values, which makes deduping a one-liner. WeakMap and WeakSet only take object keys and don't keep them alive, so when the object is gone, the entry goes too; that's useful for attaching metadata to objects without memory leaks. The trade-off is they can't be iterated and have no size.",
      mistakes: [
        "Using objects as keys in a plain object and getting '[object Object]'.",
        "Expecting Set to dedupe objects with the same content.",
        "Trying to loop over a WeakMap or read its size.",
        "Trap: `JSON.stringify(new Map([['a', 1]]))` is `'{}'`. Convert with `Object.fromEntries(map)` first.",
      ],
      takeaway: "Map for any-key lookups, Set for uniqueness, Weak versions for per-object data without leaks.",
    },

    {
      id: 'symbol',
      title: 'Symbol and well-known symbols',
      level: 'advanced',
      priority: 'good',
      frequency: 'occasional',
      summary: 'A Symbol is a unique primitive used as a hidden-ish property key; well-known symbols let your objects hook into built-in behaviour.',
      what: [
        "`Symbol('description')` creates a brand-new, unique value. Two symbols with the same description are still different. Symbols are mostly used as object property keys that can never clash with other keys.",
        "Symbol-keyed properties are skipped by `for...in`, `Object.keys`, and `JSON.stringify`, so they work well for metadata that shouldn't leak into normal code.",
      ],
      deeper: [
        "Symbol keys are not truly private: `Object.getOwnPropertySymbols` and `Reflect.ownKeys` still find them. Use `#private` fields for real privacy.",
        "`Symbol.for('key')` uses a global registry: the same string always returns the same symbol, even across files or iframes.",
        "Well-known symbols customise language behaviour: `Symbol.iterator` makes an object work with `for...of` and spread, `Symbol.asyncIterator` with `for await`, `Symbol.toPrimitive` controls conversion to a number or string, `Symbol.toStringTag` changes `Object.prototype.toString` output, and `Symbol.hasInstance` changes `instanceof`.",
        "Symbols can't be implicitly converted to strings: `'id: ' + sym` throws a TypeError. Use `String(sym)` or `sym.description`.",
      ],
      why: "It's less common in interviews, but it explains how iterables and `for...of` work, and libraries use symbols to tag objects without clashing with user keys.",
      analogy: "A symbol is a key cut for one lock only. Even if two keys have the same label written on them, only the exact one opens its door.",
      code: {
        lang: 'js',
        source: `const id = Symbol('id');
const user = { name: 'Asha', [id]: 101 };
console.log(user[id], Symbol('id') === Symbol('id')); // 101 false
console.log(Object.keys(user), JSON.stringify(user)); // [ 'name' ] {"name":"Asha"}
console.log(Object.getOwnPropertySymbols(user));      // [ Symbol(id) ]  (not truly private)
console.log(Symbol.for('app') === Symbol.for('app')); // true (global registry)
try { 'key: ' + id; } catch (e) { console.log(e.constructor.name); } // TypeError
console.log(id.description);                          // id

// Well-known symbols hook into built-in behaviour
class Range {
  constructor(from, to) { this.from = from; this.to = to; }
  *[Symbol.iterator]() { for (let i = this.from; i <= this.to; i++) yield i; }
  get [Symbol.toStringTag]() { return 'Range'; }
  [Symbol.toPrimitive](hint) {
    return hint === 'number' ? this.to - this.from : \`\${this.from}..\${this.to}\`;
  }
}
const r = new Range(1, 4);
console.log([...r], String(r), +r);           // [ 1, 2, 3, 4 ] 1..4 3
console.log(Object.prototype.toString.call(r)); // [object Range]`,
      },
      output: "`101 false`: same description, different symbols. `[ 'name' ] {\"name\":\"Asha\"}`: the symbol key is hidden from keys and JSON. getOwnPropertySymbols still finds it: `[ Symbol(id) ]`. `Symbol.for` returns the same symbol: `true`. Joining a symbol to a string throws a `TypeError`; `.description` gives `id`. The Range spreads to `[ 1, 2, 3, 4 ]`, converts to the string `1..4` and the number `3`, and reports `[object Range]`.",
      questions: [
        { q: 'What is a Symbol used for?', a: "As a unique property key that can't clash with any other key, often for metadata or library hooks. Symbol keys are skipped by Object.keys, for...in, and JSON.stringify." },
        { q: 'Are symbol properties private?', a: "No. Object.getOwnPropertySymbols and Reflect.ownKeys can list them. For real privacy, use #private class fields or closures." },
        { q: 'Symbol() vs Symbol.for()?', a: "Symbol() always creates a new unique symbol. Symbol.for('key') looks up a global registry and returns the same symbol for the same key every time." },
        { q: 'What is Symbol.iterator?', a: "A well-known symbol. An object with a [Symbol.iterator] method that returns an iterator works with for...of, spread, Array.from, and destructuring." },
      ],
      answer30: "A Symbol is a primitive that's guaranteed unique, mainly used as an object key that won't collide with anyone else's keys. Symbol keys don't show up in Object.keys, for...in, or JSON, though they aren't truly private. Symbol.for gives shared symbols from a global registry. The most useful part is the well-known symbols: Symbol.iterator makes an object iterable with for...of and spread, and Symbol.toPrimitive controls how it converts to strings and numbers.",
      mistakes: [
        "Thinking symbol properties are private.",
        "Calling `new Symbol()`, which throws a TypeError.",
        "Concatenating a symbol into a string without `String()` or `.description`.",
        "Trap: symbol keys are dropped by `JSON.stringify` and by `Object.keys`, so they silently vanish from API responses and spreads into logs.",
      ],
      takeaway: "Symbols are unique keys; well-known symbols let your objects plug into the language.",
    },

    {
      id: 'generators-iterators',
      title: 'Generators and iterators',
      level: 'advanced',
      priority: 'good',
      frequency: 'occasional',
      summary: 'An iterator hands out values one at a time with next(); a generator function (function*) is the easy way to write one, pausing at each yield.',
      what: [
        "An iterator is an object with a `next()` method that returns `{ value, done }`. An iterable is anything with a `[Symbol.iterator]()` method that returns an iterator. Arrays, strings, Maps, and Sets are iterables, which is why `for...of` and spread work on them.",
        "A generator function (`function*`) returns an iterator. Each `yield` hands out a value and pauses the function; the next `next()` call resumes it from that exact spot.",
      ],
      deeper: [
        "Generators are lazy: they only compute the next value when asked. That makes infinite sequences possible, and lets you chain filter/take steps without building big intermediate arrays.",
        "Two-way communication: `next(value)` resumes the generator and makes the paused `yield` expression evaluate to `value`. The first `next()` call's argument is ignored because there's no yield waiting yet.",
        "`return()` ends a generator early (and runs its `finally`); `for...of` calls it for you on `break`. `throw(err)` throws an error at the paused yield.",
        "Async generators (`async function*`) yield promises' results and are consumed with `for await...of`. They're great for paginated APIs and streams. Node's readable streams are async iterables. Redux-Saga is built on generators.",
      ],
      why: "They explain how `for...of` and spread work under the hood, and async generators are a clean way to page through an API. Interviewers at product companies sometimes ask you to write a custom iterable.",
      analogy: "A generator is a Netflix series instead of a movie: each next() plays one episode and pauses. Nothing is produced until you press play, and the show can be endless.",
      code: {
        lang: 'js',
        source: `function* idGenerator() {
  let id = 1;
  while (true) {
    const reset = yield id++;  // pause here; next(value) resumes with value
    if (reset) id = 1;
  }
}
const ids = idGenerator();
console.log(ids.next().value, ids.next().value, ids.next(true).value); // 1 2 1

// Iterator protocol by hand
const countdown = {
  from: 3,
  [Symbol.iterator]() {
    let n = this.from;
    return { next: () => (n > 0 ? { value: n--, done: false } : { value: undefined, done: true }) };
  },
};
console.log([...countdown]);   // [ 3, 2, 1 ]

// Lazy pipeline over an infinite sequence
function* naturals() { let n = 1; while (true) yield n++; }
function* filter(iter, test) { for (const x of iter) if (test(x)) yield x; }
function* take(iter, count) {
  if (count <= 0) return;
  for (const x of iter) { yield x; if (--count === 0) return; }
}
console.log([...take(filter(naturals(), (n) => n % 2 === 0), 3)]); // [ 2, 4, 6 ]

// Async generator: page through an API
async function* fetchPages() {
  for (let page = 1; page <= 3; page++) {
    await new Promise((r) => setTimeout(r, 10)); // pretend network call
    yield [\`item-\${page}a\`, \`item-\${page}b\`];
  }
}
(async () => {
  for await (const batch of fetchPages()) console.log(batch);
})();`,
      },
      output: "`1 2 1`: the third call passed `true`, which reset the counter. The hand-written iterable spreads to `[ 3, 2, 1 ]`. The lazy pipeline finds the first three even numbers from an infinite sequence: `[ 2, 4, 6 ]`. The async generator then logs `[ 'item-1a', 'item-1b' ]`, `[ 'item-2a', 'item-2b' ]`, `[ 'item-3a', 'item-3b' ]`, about 10 ms apart.",
      questions: [
        { q: 'What is the difference between an iterable and an iterator?', a: "An iterable has a [Symbol.iterator]() method. Calling it returns an iterator, an object with next() that returns { value, done }. for...of and spread ask the iterable for a fresh iterator." },
        { q: 'What does yield do?', a: "It hands a value out to whoever called next() and pauses the generator. The next call to next() resumes from that spot, and the value passed to next() becomes the result of the yield expression." },
        { q: 'Why are generators called lazy?', a: "They compute values only when next() is called, so you can model infinite sequences and avoid building large arrays in memory." },
        { q: 'Real-world use for async generators?', a: "Paginating an API or reading a stream: each loop iteration awaits the next page or chunk, consumed with for await...of." },
      ],
      answer30: "An iterator is an object with a next method that returns value and done; an iterable is anything with a Symbol.iterator method, which is what for...of and spread use. A generator function, written with function star, is the easy way to build one: each yield hands out a value and pauses, and next resumes it. Because they're lazy, generators can model infinite sequences. Async generators with for await are a clean way to consume paginated APIs or streams.",
      mistakes: [
        "Expecting a generator to run when you call it. It only creates the iterator; nothing runs until next().",
        "Trying to reuse a finished generator; create a new one.",
        "Spreading an infinite generator, which never finishes.",
        "Trap: the argument to the first `next()` is ignored because no yield is waiting yet.",
      ],
      takeaway: "Iterators hand out values on demand; generators write them with yield and pause between values.",
    },

    {
      id: 'proxy-reflect',
      title: 'Proxy and Reflect',
      level: 'advanced',
      priority: 'good',
      frequency: 'occasional',
      summary: 'A Proxy wraps an object and intercepts operations like get and set; Reflect performs the default version of each operation.',
      what: [
        "`new Proxy(target, handler)` creates a stand-in for an object. The handler can define 'traps', functions like `get`, `set`, `has`, and `deleteProperty`, that run whenever someone reads, writes, checks, or deletes a property on the proxy.",
        "`Reflect` is a built-in object with one method per operation (`Reflect.get`, `Reflect.set`, `Reflect.has`, ...). Inside a trap, you usually call the matching Reflect method to do the normal behaviour after your custom logic.",
      ],
      deeper: [
        "Why Reflect instead of `target[prop]`: Reflect methods take a `receiver` argument, so getters and setters run with the proxy as `this`, and they return booleans (`Reflect.set` returns false) instead of throwing, which is exactly what traps must return.",
        "A `set` trap must return true for success. Returning false makes the assignment fail silently in sloppy mode and throw a TypeError in strict mode.",
        "Real uses: validation, default values, logging and tracing, hiding fields, read-only views, and reactivity. Vue 3 and MobX track reads and writes with Proxies to know what to re-render.",
        "Limits: proxies have a performance cost, `proxy !== target`, and objects with internal slots (Map, Set, Date, private #fields) break when their methods run with the proxy as `this` unless you bind them to the target.",
      ],
      why: "It comes up in senior interviews and when discussing how frameworks like Vue track state. It's also a neat answer to 'how would you validate or log every property change?'",
      analogy: "A Proxy is a personal assistant in front of a manager. Every request goes through them: they can answer some questions themselves, refuse others, or log them, and then pass the rest to the manager (Reflect).",
      code: {
        lang: 'js',
        source: `const user = { name: 'Asha', age: 30, password: 'secret' };

const safeUser = new Proxy(user, {
  get(target, prop, receiver) {
    if (prop === 'password') return '***';
    return Reflect.get(target, prop, receiver);
  },
  set(target, prop, value, receiver) {
    if (prop === 'age' && !Number.isInteger(value)) throw new TypeError('age must be an integer');
    console.log(\`set \${String(prop)} =\`, value);
    return Reflect.set(target, prop, value, receiver);
  },
  has(target, prop) {
    return prop !== 'password' && Reflect.has(target, prop);
  },
});

console.log(safeUser.name, safeUser.password);   // Asha ***
safeUser.age = 31;                               // set age = 31
try { safeUser.age = 'old'; } catch (e) { console.log(e.message); }
console.log('password' in safeUser, user.age);   // false 31

// A tiny reactivity system (the idea behind Vue 3)
function reactive(obj, onChange) {
  return new Proxy(obj, {
    set(target, key, value, receiver) {
      const ok = Reflect.set(target, key, value, receiver);
      onChange(key, value);
      return ok;
    },
  });
}
const state = reactive({ count: 0 }, (key, value) => console.log(\`re-render: \${key} -> \${value}\`));
state.count++;

// Reflect returns booleans instead of throwing
const frozen = Object.freeze({ x: 1 });
console.log(Reflect.set(frozen, 'x', 2), Reflect.ownKeys({ a: 1, [Symbol('s')]: 2 }));`,
      },
      output: "`Asha ***`: the get trap hid the password. `set age = 31` from the set trap. Assigning 'old' throws 'age must be an integer'. `false 31`: the has trap hides password from `in`, and the real object was updated. The reactive proxy logs `re-render: count -> 1`. Last line: `false [ 'a', Symbol(s) ]`: Reflect.set reports failure on a frozen object instead of throwing.",
      questions: [
        { q: 'What is a Proxy?', a: "A wrapper around an object that lets you intercept operations like reading, writing, deleting, or checking properties, through trap functions in a handler." },
        { q: 'Why use Reflect inside proxy traps?', a: "Reflect does the default behaviour of each operation, passes the receiver so getters and setters get the right this, and returns booleans like traps are expected to." },
        { q: 'Give real uses of Proxy.', a: "Validation on assignment, default values for missing keys, logging or auditing property access, read-only or redacted views, and reactivity systems like Vue 3 and MobX." },
        { q: 'What happens if a set trap returns false?', a: "The assignment is treated as failed: it is silently ignored in sloppy mode and throws a TypeError in strict mode." },
      ],
      answer30: "A Proxy wraps an object and lets me intercept operations like get, set, has, and delete through traps. Inside a trap I do my custom logic, like validation, logging, or hiding a field, then call the matching Reflect method to do the default behaviour, because Reflect passes the receiver correctly and returns a boolean. This is how Vue 3 implements reactivity. I'd use it carefully since it adds overhead and doesn't work well with built-ins like Map or private fields.",
      mistakes: [
        "Forgetting to return true from a set trap, which throws in strict mode.",
        "Using `target[prop]` instead of Reflect.get, which breaks getters that rely on `this`.",
        "Wrapping a Map in a Proxy and getting 'incompatible receiver' errors.",
        "Trap: a proxy is a different object, so `proxy === target` is false and identity-based checks (Set membership, WeakMap keys) don't match.",
      ],
      takeaway: "Proxy intercepts object operations; Reflect does the default version of each.",
    },

    {
      id: 'optional-chaining-nullish',
      title: 'Optional chaining (?.) and nullish coalescing (??)',
      level: 'basic',
      priority: 'must',
      frequency: 'common',
      summary: '?. stops and returns undefined when something is null or undefined; ?? gives a fallback only for null or undefined.',
      what: [
        "Optional chaining `a?.b` reads `b` only if `a` is not null or undefined; otherwise the whole expression is `undefined` instead of throwing. It also works for calls (`fn?.()`) and brackets (`arr?.[0]`).",
        "Nullish coalescing `a ?? b` returns `b` only when `a` is null or undefined. Unlike `||`, it keeps valid falsy values like `0`, `''`, and `false`.",
      ],
      deeper: [
        "Short-circuiting: if `a` is nullish in `a?.b.c.d()`, the entire rest of the chain is skipped, not just `.b`. So `res.profile?.avatar.url` doesn't throw when profile is missing.",
        "Logical assignment operators: `x ??= y` assigns only if x is nullish, `x ||= y` only if x is falsy, `x &&= y` only if x is truthy.",
        "You can't mix `??` with `||` or `&&` without parentheses: `a || b ?? c` is a SyntaxError. You also can't assign through `?.`: `obj?.a = 1` is a SyntaxError.",
        "Don't scatter `?.` everywhere. If a value should always exist, a crash points to a real bug; optional chaining would hide it and push the `undefined` somewhere harder to debug.",
      ],
      why: "API responses and config objects often have missing fields. These operators replace long `a && a.b && a.b.c` chains and fix the classic `||` bug where a real 0 or empty string is replaced.",
      analogy: "?. is checking each door before walking through: if a door is missing, you stop and report 'nothing here' instead of walking into a wall. ?? is a spare tyre used only when the tyre is actually missing, not when it's just low.",
      code: {
        lang: 'js',
        source: `const res = {
  user: { name: 'Asha', address: null, tags: [], getRole() { return 'admin'; } },
};
console.log(res.user?.address?.city);         // undefined (stops at null, no throw)
console.log(res.profile?.avatar.url);         // undefined (whole chain short-circuits)
console.log(res.user.tags?.[0]);              // undefined
console.log(res.user.getRole?.(), res.user.logout?.()); // admin undefined

const settings = { volume: 0, theme: '', retries: null };
console.log(settings.volume || 50, settings.volume ?? 50); // 50 0
console.log(settings.theme || 'dark', JSON.stringify(settings.theme ?? 'dark')); // dark ""
console.log(settings.retries ?? 3);           // 3

settings.retries ??= 5;   // only if null/undefined
settings.volume ||= 10;   // only if falsy
settings.theme &&= 'light'; // only if truthy ('' is falsy, so unchanged)
console.log(settings);    // { volume: 10, theme: '', retries: 5 }

// const x = null || undefined ?? 'a';  // SyntaxError: needs parentheses
console.log((null || undefined) ?? 'fallback'); // fallback`,
      },
      output: "The first four lines print `undefined`, `undefined`, `undefined`, and `admin undefined`, with no errors even though address is null, profile is missing, and logout doesn't exist. `50 0`: || replaced the valid 0, ?? kept it. `dark \"\"`: || replaced the empty theme, ?? kept it. `3` for the null retries. After the logical assignments: `{ volume: 10, theme: '', retries: 5 }`. Last: `fallback`.",
      questions: [
        { q: 'What does optional chaining do?', a: "`a?.b` returns undefined instead of throwing when a is null or undefined, and skips the rest of the chain. It also works for calls `fn?.()` and brackets `a?.[i]`." },
        { q: '?? vs ||?', a: "|| falls back for any falsy value, including 0, empty string, and false. ?? falls back only for null or undefined, so valid zeros and empty strings are kept." },
        { q: 'What do ??=, ||=, and &&= do?', a: "They assign only when needed: ??= if the left side is null or undefined, ||= if it is falsy, &&= if it is truthy." },
        { q: 'Can you overuse optional chaining?', a: "Yes. If a value must exist, using ?. hides the bug and passes undefined further along. Use it only where missing data is actually expected." },
      ],
      answer30: "Optional chaining, ?., safely reads a property, calls a method, or indexes into something that might be null or undefined; if it is, the whole chain returns undefined instead of throwing. Nullish coalescing, ??, gives a default only for null or undefined, unlike ||, which also replaces 0, empty string, and false. I use them for API data and config, plus ??= for defaults. I don't sprinkle ?. on values that must exist, because it hides real bugs.",
      mistakes: [
        "Using || for defaults where 0 or '' is valid.",
        "Adding ?. everywhere, hiding bugs.",
        "Trying to assign with `obj?.prop = value` (SyntaxError).",
        "Trap: `a?.b` only protects `a`; `a?.b.c` still throws if `a` exists but `b` is undefined.",
      ],
      takeaway: "?. stops safely at null/undefined; ?? defaults only for null/undefined.",
    },

    {
      id: 'promise-combinators',
      title: 'Promise combinators in depth: all, allSettled, race, any',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'all fails fast, allSettled reports everything, race takes the first to finish, any takes the first success; plus timeouts and concurrency limits.',
      what: [
        "All four take an iterable of promises (or plain values) and return one promise.",
        "`Promise.all`: resolves with an array of values in input order when all succeed; rejects as soon as one rejects. `Promise.allSettled`: always resolves, with `{ status, value }` or `{ status, reason }` for each. `Promise.race`: settles like the first promise to settle, success or failure. `Promise.any`: resolves with the first success; rejects with an `AggregateError` only if all fail.",
      ],
      deeper: [
        "Fail fast does not cancel anything. When `Promise.all` rejects, the other operations keep running; promises have no built-in cancellation. To actually stop requests, pass an `AbortSignal`.",
        "Results keep input order, not finish order. Plain values are treated as already-resolved promises.",
        "Empty input: `Promise.all([])` and `allSettled([])` resolve to `[]`. `Promise.any([])` rejects with an AggregateError. `Promise.race([])` stays pending forever.",
        "Common patterns: a timeout with `race` (or `AbortSignal.timeout` for fetch), fallback mirrors with `any`, batch jobs with `allSettled` so one failure doesn't hide the rest, and a concurrency limit so you don't fire 1,000 requests at once.",
      ],
      why: "These come up constantly: dashboards that load several APIs, bulk jobs, and timeouts. Interviewers ask the differences and often ask you to implement one (see polyfills).",
      analogy: "Four ways to wait for friends. all: dinner starts when everyone arrives, cancelled if anyone drops out. allSettled: wait until everyone has arrived or cancelled, then see who came. race: whoever calls first, with good or bad news, decides. any: the first friend who actually shows up gets the table.",
      code: {
        lang: 'js',
        source: `const wait = (ms, value, fail = false) =>
  new Promise((resolve, reject) => setTimeout(() => (fail ? reject(new Error(value)) : resolve(value)), ms));

async function main() {
  // all: fails fast with the first rejection
  try { await Promise.all([wait(50, 'a'), wait(10, 'b failed', true), wait(30, 'c')]); }
  catch (e) { console.log('all rejected:', e.message); }

  // allSettled: every outcome, never rejects
  const results = await Promise.allSettled([wait(10, 'ok'), wait(20, 'service down', true)]);
  for (const r of results) console.log(r.status, r.status === 'fulfilled' ? r.value : r.reason.message);

  // race: timeout pattern
  const withTimeout = (p, ms) => Promise.race([p, wait(ms, \`timeout after \${ms}ms\`, true)]);
  try { await withTimeout(wait(200, 'slow'), 50); } catch (e) { console.log(e.message); }

  // any: first success wins; AggregateError if all fail
  console.log(await Promise.any([wait(30, 'mirror-1'), wait(10, 'x', true), wait(20, 'mirror-2')]));
  try { await Promise.any([wait(5, 'e1', true), wait(5, 'e2', true)]); }
  catch (e) { console.log(e.constructor.name, e.errors.map((x) => x.message)); }

  console.log(await Promise.all([1, wait(5, 2)]), await Promise.allSettled([])); // [ 1, 2 ] []

  // Concurrency limit: at most \`limit\` tasks run at the same time
  async function mapLimit(items, limit, fn) {
    const out = new Array(items.length);
    let next = 0;
    async function worker() {
      while (next < items.length) { const i = next++; out[i] = await fn(items[i]); }
    }
    await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
    return out;
  }
  let active = 0, peak = 0;
  const doubled = await mapLimit([1, 2, 3, 4, 5, 6], 2, async (n) => {
    active++; peak = Math.max(peak, active);
    await wait(10); active--;
    return n * 2;
  });
  console.log(doubled, 'peak concurrency:', peak);
}
main();`,
      },
      output: "`all rejected: b failed` after about 10 ms. allSettled prints `fulfilled ok` and `rejected service down`. The race prints `timeout after 50ms`. any prints `mirror-2` (the first success; the 10 ms one failed), then `AggregateError [ 'e1', 'e2' ]` when everything fails. `[ 1, 2 ] []` shows plain values are allowed and empty input resolves to `[]`. The limited map prints `[ 2, 4, 6, 8, 10, 12 ] peak concurrency: 2`.",
      questions: [
        { q: 'Compare Promise.all, allSettled, race, and any.', a: "all: resolves with every value or rejects on the first failure. allSettled: waits for everything and reports each status. race: settles like the first one to settle. any: resolves with the first success, rejects with AggregateError only if all fail." },
        { q: 'Does Promise.all cancel the other promises when one fails?', a: "No. The returned promise rejects, but the other operations keep running. Use an AbortController to actually cancel requests." },
        { q: 'When would you use allSettled over all?', a: "When the tasks are independent and you want every result even if some fail, like sending notifications or loading optional dashboard widgets." },
        { q: 'How do you add a timeout to a promise?', a: "Promise.race between the real promise and one that rejects after N ms. For fetch, prefer `AbortSignal.timeout(ms)` so the request is actually aborted." },
        { q: 'How do you limit concurrency, say 5 requests at a time?', a: "Start N workers that each pull the next item from a shared index until none are left, and await all workers with Promise.all. Libraries like p-limit do the same." },
      ],
      answer30: "Promise.all gives me all values in input order but rejects on the first failure, and it doesn't cancel the rest. allSettled waits for everything and tells me each status, which I use when tasks are independent. race settles with whichever finishes first, which is the classic timeout pattern, and any resolves with the first success and only rejects, with an AggregateError, if all fail. For large batches I limit concurrency with a small worker pool instead of firing everything at once.",
      mistakes: [
        "Thinking Promise.all cancels the losers.",
        "Using all for independent tasks and losing every result because one failed.",
        "Using race for a fetch timeout without aborting the request, so it keeps running.",
        "Trap: `Promise.race([])` never settles, and `Promise.any([])` rejects immediately.",
      ],
      takeaway: "all = all or nothing, allSettled = report card, race = first to finish, any = first success.",
    },

    {
      id: 'fetch-abortcontroller',
      title: 'fetch and AbortController',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: "fetch returns a promise for a Response and only rejects on network errors; check res.ok yourself and cancel with an AbortSignal.",
      what: [
        "`fetch(url, options)` makes an HTTP request and returns a promise for a `Response`. You then read the body with `res.json()`, `res.text()`, or `res.blob()`, which also return promises.",
        "`AbortController` lets you cancel a request: pass `controller.signal` to fetch, and call `controller.abort()` to stop it. The fetch promise then rejects with an `AbortError`.",
      ],
      deeper: [
        "fetch does not reject on HTTP errors like 404 or 500. It only rejects when the request couldn't complete (network failure, CORS block, abort). Always check `res.ok` (status 200-299) or `res.status`.",
        "For POST with JSON, set `method: 'POST'`, `headers: { 'Content-Type': 'application/json' }`, and `body: JSON.stringify(data)`. Cookies are sent to the same origin by default; for cross-origin requests you need `credentials: 'include'` and a server that allows it with CORS.",
        "`AbortSignal.timeout(ms)` creates a signal that aborts after a delay (the error name is `TimeoutError`), and `AbortSignal.any([a, b])` combines signals. One controller can cancel many requests at once.",
        "fetch is built into browsers and into Node 18+ (based on undici). In React, abort in the useEffect cleanup so a slow old response can't overwrite a newer one.",
      ],
      why: "Every frontend calls APIs. Interviewers check that you handle non-2xx responses, timeouts, and race conditions like a search box where old responses arrive after new ones. On your resume: the cookie-based JWT auth with a refresh-once-on-401 retry is built on exactly these fetch details.",
      analogy: "fetch is posting a letter and getting a reply envelope back. The envelope arriving doesn't mean good news; you still have to open it and read whether it says 404. AbortController is a 'cancel delivery' button.",
      code: {
        lang: 'js',
        title: 'Runs in Node 18+ (uses a tiny local server)',
        source: `import http from 'node:http';

const server = http.createServer((req, res) => {
  const delay = req.url === '/slow' ? 500 : 10;
  setTimeout(() => {
    if (req.url === '/missing') { res.statusCode = 404; return res.end('{"error":"not found"}'); }
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ ok: true, path: req.url }));
  }, delay);
});
await new Promise((resolve) => server.listen(0, resolve));
const base = \`http://localhost:\${server.address().port}\`;

async function getJson(url, { signal } = {}) {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`); // fetch does NOT reject on 404/500
  return res.json();
}

console.log(await getJson(\`\${base}/users\`));          // { ok: true, path: '/users' }
try { await getJson(\`\${base}/missing\`); } catch (e) { console.log(e.message); } // HTTP 404

// Timeout
try { await getJson(\`\${base}/slow\`, { signal: AbortSignal.timeout(100) }); }
catch (e) { console.log(e.name); }                         // TimeoutError

// Manual cancel, e.g. the user typed a new search term
const controller = new AbortController();
const pending = getJson(\`\${base}/slow\`, { signal: controller.signal });
controller.abort();
try { await pending; } catch (e) { console.log(e.name); } // AbortError

server.close();`,
      },
      output: "`{ ok: true, path: '/users' }` for the good request. `HTTP 404`: fetch resolved normally, and our `res.ok` check turned it into an error. `TimeoutError` when the 100 ms timeout signal fired before the 500 ms response. `AbortError` when the controller cancelled the request.",
      questions: [
        { q: 'Does fetch reject on a 404 or 500?', a: "No. fetch only rejects on network failures, CORS blocks, or aborts. For HTTP errors it resolves normally, so check res.ok or res.status yourself." },
        { q: 'How do you cancel a fetch request?', a: "Create an AbortController, pass controller.signal in the fetch options, and call controller.abort(). The fetch promise rejects with an AbortError." },
        { q: 'How do you add a timeout to fetch?', a: "Pass `signal: AbortSignal.timeout(ms)`. The request is aborted and rejects with a TimeoutError. Combine it with a user cancel signal using AbortSignal.any." },
        { q: 'How do you prevent race conditions in a search box?', a: "Abort the previous request when a new search starts (or in the useEffect cleanup), so an older, slower response can never overwrite the newer one." },
        { q: 'How do you send cookies with a cross-origin fetch?', a: "Set `credentials: 'include'`, and the server must respond with Access-Control-Allow-Credentials: true and a specific (non-wildcard) allowed origin." },
      ],
      answer30: "fetch returns a promise for a Response, and the key gotcha is that it only rejects on network errors, not on 404 or 500, so I always check res.ok and throw myself. I read the body with res.json. To cancel, I pass an AbortController's signal and call abort, which I do in React effect cleanups and in search boxes so old responses can't overwrite new ones. For timeouts I use AbortSignal.timeout. For cross-origin cookies I set credentials include.",
      mistakes: [
        "Assuming fetch throws on 4xx and 5xx.",
        "Forgetting the Content-Type header and JSON.stringify for a JSON body.",
        "Not aborting stale requests, so an old response overwrites newer data.",
        "Trap: the body can only be read once. Calling `res.json()` after `res.text()` throws; use `res.clone()` if you need it twice.",
      ],
      takeaway: "Check res.ok yourself; cancel and time out with AbortSignal.",
    },

    {
      id: 'web-storage-cookies',
      title: 'localStorage, sessionStorage, and cookies',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'localStorage persists per origin, sessionStorage lasts for one tab, and cookies travel to the server with every request (and can be HttpOnly).',
      what: [
        "`localStorage` stores string key-value pairs in the browser with no expiry. It's shared by all tabs of the same origin and survives restarts.",
        "`sessionStorage` has the same API, but each tab has its own copy, and it's cleared when the tab closes.",
        "Cookies are small pieces of data (about 4 KB each) that the browser automatically sends to the server with every matching request. The server sets them with the `Set-Cookie` header; JavaScript can read and write non-HttpOnly cookies through `document.cookie`.",
      ],
      deeper: [
        "Storage only holds strings. Objects must be `JSON.stringify`'d and parsed back; numbers come back as strings. Limits are roughly 5 MB per origin. The API is synchronous, so large reads block the main thread.",
        "Security: any script on the page (including an XSS payload or a compromised npm package) can read localStorage. That's why auth tokens are often kept in HttpOnly cookies, which JavaScript can't read at all.",
        "Cookie flags: `HttpOnly` (hidden from JS), `Secure` (HTTPS only), `SameSite=Strict|Lax|None` (controls cross-site sending; helps against CSRF; `None` requires `Secure`), `Max-Age`/`Expires` (otherwise it's a session cookie), `Domain`, and `Path`.",
        "The `storage` event fires in other tabs of the same origin when localStorage changes, which you can use to sync logout across tabs. For larger or structured data, use IndexedDB.",
      ],
      why: "Interviewers ask 'where do you store the JWT and why'. The right answer involves XSS vs CSRF trade-offs. On your resume: Octagnt.ai uses cookie-based JWT auth with auto-renewal, so explain why HttpOnly cookies were chosen over localStorage.",
      analogy: "localStorage is a locker at your gym: your stuff stays until you clear it. sessionStorage is a tray at airport security: gone when you leave. A cookie is a wristband: the venue sees it every time you walk in, and an HttpOnly one is sewn on so you can't even take it off yourself.",
      code: [
        {
          lang: 'js',
          title: 'Browser',
          source: `localStorage.setItem('theme', 'dark');
localStorage.setItem('prefs', JSON.stringify({ lang: 'en', compact: true })); // strings only
const prefs = JSON.parse(localStorage.getItem('prefs') ?? '{}');
localStorage.setItem('count', 5);
console.log(typeof localStorage.getItem('count')); // 'string' (numbers come back as strings)
localStorage.removeItem('theme');

sessionStorage.setItem('draft', 'Hello');         // only this tab, cleared on close

// Fires in OTHER tabs of the same origin, e.g. to sync a logout
window.addEventListener('storage', (e) => {
  if (e.key === 'logout') location.assign('/login');
});

// Readable cookie (not HttpOnly)
document.cookie = 'lang=en; Max-Age=86400; Path=/; SameSite=Lax; Secure';
console.log(document.cookie); // 'lang=en' -- HttpOnly cookies never appear here`,
        },
        {
          lang: 'js',
          title: 'Express: set an auth cookie JavaScript cannot read',
          source: `res.cookie('access_token', token, {
  httpOnly: true,                 // not readable by document.cookie (limits XSS theft)
  secure: true,                   // HTTPS only
  sameSite: 'strict',             // not sent on cross-site requests (helps against CSRF)
  maxAge: 15 * 60 * 1000,         // 15 minutes; renew with a refresh token
});`,
        },
      ],
      output: "localStorage keeps 'prefs' as a JSON string that is parsed back into an object, and the number 5 comes back as the string '5'. The draft lives only in this tab. document.cookie shows 'lang=en' (plus any other readable cookies) but never the HttpOnly access_token, which the browser still sends to the server automatically.",
      questions: [
        { q: 'localStorage vs sessionStorage vs cookies?', a: "localStorage persists until cleared and is shared across tabs. sessionStorage is per tab and cleared when the tab closes. Cookies are small, can expire, and are sent to the server with every matching request." },
        { q: 'Where should you store a JWT?', a: "Usually in an HttpOnly, Secure, SameSite cookie, so JavaScript (and XSS) can't read it; add CSRF protection where needed. localStorage is simpler but any injected script can steal the token." },
        { q: 'What do HttpOnly, Secure, and SameSite do?', a: "HttpOnly hides the cookie from JavaScript. Secure sends it only over HTTPS. SameSite controls whether it's sent on cross-site requests, which helps prevent CSRF." },
        { q: 'Can localStorage store objects?', a: "Only strings. Use JSON.stringify to save and JSON.parse to read, and handle null when the key is missing." },
        { q: 'How can you sync state across tabs?', a: "Listen for the storage event, which fires in other tabs when localStorage changes, or use a BroadcastChannel." },
      ],
      answer30: "localStorage keeps strings per origin with no expiry and is shared across tabs; sessionStorage has the same API but is per tab and cleared on close; both are readable by any script on the page. Cookies are small and sent to the server automatically, and the server can mark them HttpOnly so JavaScript can't read them, Secure for HTTPS only, and SameSite to limit cross-site sending. For auth tokens I prefer HttpOnly cookies to protect against XSS, and I handle CSRF with SameSite and, if needed, a CSRF token.",
      mistakes: [
        "Storing tokens or personal data in localStorage without considering XSS.",
        "Forgetting to JSON.stringify objects (you get '[object Object]').",
        "Calling JSON.parse on a missing key without a fallback.",
        "Trap: SameSite=None cookies are rejected unless they are also Secure.",
      ],
      takeaway: "localStorage = persistent, sessionStorage = per tab, HttpOnly cookie = server-only and safest for tokens.",
    },

    {
      id: 'strict-mode',
      title: "Strict mode ('use strict')",
      level: 'basic',
      priority: 'good',
      frequency: 'occasional',
      summary: 'Strict mode turns silent mistakes into errors, makes this undefined in plain calls, and bans a few confusing features.',
      what: [
        "Strict mode is a stricter version of JavaScript that you turn on with the string `'use strict'` at the top of a file or function.",
        "ES modules and class bodies are always strict, so most modern code (React apps, ESM Node code, TypeScript output targeting ESM) already runs in strict mode without writing the directive.",
      ],
      deeper: [
        "What changes: assigning to an undeclared variable throws a ReferenceError instead of creating a global; `this` is `undefined` in a plain function call instead of the global object; writing to a read-only or frozen property, or deleting an undeletable one, throws a TypeError instead of failing silently.",
        "Banned syntax (SyntaxError at parse time): `with` statements, duplicate parameter names, legacy octal literals like `010`, and using reserved words such as `implements` or `package` as variable names. `eval` also gets its own scope, so it can't create variables in the surrounding code.",
        "CommonJS files and classic `<script>` tags are sloppy by default. A `'use strict'` inside a function applies only to that function.",
      ],
      why: "It explains several 'this is undefined' bugs and why writes to frozen objects sometimes throw and sometimes don't. It's also asked as a quick check that you know modules are strict by default.",
      analogy: "Sloppy mode is a teacher who quietly fixes your spelling. Strict mode is one who marks every mistake in red, so you notice it before the exam.",
      code: {
        lang: 'js',
        title: 'Run as a classic script or CommonJS file (sloppy by default)',
        source: `function sloppy() {
  undeclared = 5;              // silently creates a global variable
  return typeof this;          // 'object': this is the global object
}
console.log(sloppy(), globalThis.undeclared); // object 5

function strict() {
  'use strict';
  try { alsoUndeclared = 5; } catch (e) { console.log(e.name + ': ' + e.message); }
  return this;                 // undefined in a plain call
}
console.log(strict());         // undefined

(function () {
  'use strict';
  const frozen = Object.freeze({ x: 1 });
  try { frozen.x = 2; } catch (e) { console.log('write to frozen:', e.constructor.name); }
  try { delete Object.prototype; } catch (e) { console.log('delete:', e.constructor.name); }
  // function f(a, a) {}   -> SyntaxError
  // with (obj) {}          -> SyntaxError
})();

const frozenSloppy = Object.freeze({ x: 1 });
frozenSloppy.x = 2;            // sloppy mode: ignored, no error
console.log(frozenSloppy.x);   // 1`,
      },
      output: "`object 5`: in sloppy mode the typo created a global and `this` was the global object. The strict function logs `ReferenceError: alsoUndeclared is not defined`, then `undefined` for `this`. Inside the strict IIFE, writing to a frozen object and deleting Object.prototype both throw `TypeError`. Outside strict mode, the same frozen write is silently ignored, so `1` is printed.",
      questions: [
        { q: 'What does strict mode change?', a: "Assigning to undeclared variables throws, this is undefined in plain function calls, silent failures (writing to read-only properties, deleting undeletable ones) throw TypeErrors, and features like with and duplicate parameter names are banned." },
        { q: 'Do you need to write use strict in ES modules?', a: "No. ES modules and class bodies are always in strict mode. CommonJS files and classic scripts are sloppy unless you add the directive." },
        { q: 'What is this inside a plain function call in strict mode?', a: "undefined. In sloppy mode it would be the global object (window or globalThis)." },
        { q: 'Why does writing to a frozen object sometimes not throw?', a: "In sloppy mode the write is silently ignored. Only strict mode throws a TypeError." },
      ],
      answer30: "Strict mode makes JavaScript throw on mistakes it would otherwise ignore. Assigning to an undeclared variable throws instead of creating a global, this is undefined in a plain function call, and writes to frozen or read-only properties throw. It also bans confusing features like with and duplicate parameter names. ES modules and classes are strict automatically, so most modern code already runs this way; CommonJS and classic scripts need the 'use strict' directive.",
      mistakes: [
        "Putting `'use strict'` after other statements; it must be the first statement to count.",
        "Assuming CommonJS files are strict.",
        "Relying on `this` being the global object in a callback.",
        "Trap: a function with default, rest, or destructured parameters can't contain its own `'use strict'` (SyntaxError).",
      ],
      takeaway: "Strict mode turns silent mistakes into errors; modules and classes are always strict.",
    },

    {
      id: 'iife-module-pattern',
      title: 'IIFE and the module pattern',
      level: 'basic',
      priority: 'good',
      frequency: 'occasional',
      summary: 'An IIFE is a function that runs immediately, creating a private scope. Before ES modules, it was how code kept variables out of the global scope.',
      what: [
        "IIFE stands for Immediately Invoked Function Expression: `(function () { ... })()`. You define a function and call it in the same breath.",
        "Variables inside it are private to that function, so they don't pollute the global scope or clash with other scripts.",
        "The module pattern returns an object from an IIFE. The object's methods can use the private variables (through closures), but outside code can't reach them directly.",
      ],
      deeper: [
        "Why the parentheses: `function () {}()` at the start of a line is parsed as a function declaration, which can't be called immediately. Wrapping it in `( )` makes it an expression. `!function () {}()` and `void function () {}()` also work.",
        "Before ES modules and bundlers, libraries like jQuery were wrapped in IIFEs. Bundlers like webpack still wrap modules in functions in their output, and libraries ship IIFE builds for `<script>` tags.",
        "Async IIFE: `(async () => { await ... })()` lets you use await where top-level await isn't available, such as CommonJS files.",
        "Before `let` existed, an IIFE inside a loop created a new scope per iteration to fix the var-in-loop closure bug.",
      ],
      why: "It's a classic closure question and still appears in older codebases, bundler output, and async startup code.",
      analogy: "An IIFE is a pop-up tent: you set it up, do your work inside where nobody can see, and pack it away. The module pattern is a shop counter: customers use the counter (public methods), but the stockroom (private variables) stays behind it.",
      code: {
        lang: 'js',
        source: `(function () {
  var secret = 'hidden';
  console.log('IIFE ran, secret is', secret);
})();
console.log(typeof secret);                  // undefined: it never leaked out

// Module pattern: private state, public API
const counter = (function () {
  let count = 0;
  function change(by) { count += by; }
  return { inc: () => change(1), dec: () => change(-1), value: () => count };
})();
counter.inc(); counter.inc(); counter.dec();
console.log(counter.value(), counter.count); // 1 undefined

// Async IIFE: await where top-level await is not allowed (e.g. CommonJS)
(async () => {
  const config = await Promise.resolve({ ok: true });
  console.log('async IIFE:', config);
})();

// The pre-let fix for the var-in-loop bug
for (var i = 0; i < 3; i++) {
  (function (j) { setTimeout(() => console.log('loop', j), 0); })(i);
}

// ASI trap: without the leading semicolon, the line above would be called as a function
const a = 1
;(function () { console.log('leading semicolon keeps this IIFE safe') })()`,
      },
      output: "'IIFE ran, secret is hidden', then `undefined` because secret stayed inside. `1 undefined`: the count is only reachable through the methods. Then 'leading semicolon keeps this IIFE safe' (still synchronous), then 'async IIFE: { ok: true }' after the await, and finally 'loop 0', 'loop 1', 'loop 2' from the timers, each IIFE having captured its own `j`.",
      questions: [
        { q: 'What is an IIFE and why use it?', a: "A function expression that runs immediately: `(function () {})()`. It creates a private scope so variables don't leak into the global scope. Today it's mostly used for async startup code and library builds." },
        { q: 'Why are the wrapping parentheses needed?', a: "Without them, a line starting with `function` is parsed as a declaration, which can't be invoked directly. The parentheses turn it into an expression that can be called." },
        { q: 'What is the module pattern?', a: "An IIFE that returns an object of public methods. Those methods close over private variables inside the IIFE, giving encapsulation without classes or ES modules." },
        { q: 'Do we still need IIFEs?', a: "Less often, because ES modules and block scope give privacy. They're still used for async code where top-level await isn't available, and in bundler and library output." },
      ],
      answer30: "An IIFE is a function expression that's called immediately. Its main job was to create a private scope so variables wouldn't leak into globals, which mattered before ES modules and let. The module pattern builds on it: the IIFE returns an object of public methods that close over private variables. Today ES modules and block scope cover most of that, but I still use an async IIFE for startup code in CommonJS, and you see IIFEs in bundler output.",
      mistakes: [
        "Forgetting the wrapping parentheses and getting a SyntaxError.",
        "Starting a line with `(` after a line with no semicolon, so the IIFE is treated as a call on the previous value.",
        "Using IIFEs for privacy in modern ESM code where the module itself is already private.",
        "Trap: an arrow IIFE must be wrapped before calling: `(() => {})()` works, but `() => {}()` is a SyntaxError.",
      ],
      takeaway: "IIFE = instant private scope; module pattern = IIFE returning a public API over private state.",
    },

    {
      id: 'immutability-freeze',
      title: 'Immutability and Object.freeze',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Object.freeze makes one level read-only; real immutability means creating new objects instead of changing old ones.',
      what: [
        "Immutable data is data you never change after creating it. To 'update' it, you create a new copy with the change.",
        "`Object.freeze(obj)` stops adding, removing, or changing the object's own properties. `Object.seal(obj)` allows changing existing values but not adding or removing keys. `Object.preventExtensions(obj)` only stops adding new keys.",
      ],
      deeper: [
        "freeze is shallow: nested objects and arrays are still changeable. For full protection, write a recursive `deepFreeze`, or use TypeScript's `readonly` / `as const` for compile-time checks only.",
        "Writes to a frozen object fail silently in sloppy mode and throw a TypeError in strict mode (modules, classes).",
        "In practice, immutability is a habit more than freeze: use spread, `map`, `filter`, and the new non-mutating array methods (`toSorted`, `toReversed`, `toSpliced`, `with`, Node 20+). Copy only the path you change and share the rest (structural sharing).",
        "Why React cares: React compares state by reference (`Object.is`). If you mutate an object and pass the same reference, React thinks nothing changed and may skip the re-render. Redux and memoization rely on the same rule.",
      ],
      why: "Immutable updates make state changes predictable, easy to compare, and safe to share. Interviewers ask about freeze vs const, shallow vs deep, and why React needs new references.",
      analogy: "Immutability is editing a document with 'Save As' instead of 'Save': the old version stays intact, and anyone holding it isn't surprised. freeze is laminating the top page only; the pages stapled behind it can still be scribbled on.",
      code: {
        lang: 'js',
        source: `'use strict';
const config = Object.freeze({ env: 'prod', db: { host: 'a.example.com' } });
try { config.env = 'dev'; } catch (e) { console.log(e.constructor.name); } // TypeError
config.db.host = 'b.example.com';             // nested object is NOT frozen
console.log(config.env, config.db.host, Object.isFrozen(config.db)); // prod b.example.com false

function deepFreeze(obj) {
  for (const value of Object.values(obj)) {
    if (value && typeof value === 'object') deepFreeze(value);
  }
  return Object.freeze(obj);
}
const safe = deepFreeze({ db: { host: 'a' }, ports: [80, 443] });
try { safe.ports.push(8080); } catch (e) { console.log('push:', e.message); }

const sealed = Object.seal({ a: 1 });
sealed.a = 2;                                  // allowed: change an existing key
try { sealed.b = 3; } catch (e) { console.log('seal add:', e.constructor.name); }
console.log(sealed, Object.isSealed(sealed));  // { a: 2 } true

// Immutable update with structural sharing
const state = { user: { name: 'Asha' }, todos: ['write tests'] };
const next = { ...state, todos: [...state.todos, 'deploy'] };
console.log(state.todos, next.todos, next.user === state.user); // unchanged, new, true

const nums = [3, 1, 2];
console.log(nums.toSorted(), nums.with(0, 9), nums); // [ 1, 2, 3 ] [ 9, 1, 2 ] [ 3, 1, 2 ]`,
      },
      output: "`TypeError` for the frozen write (strict mode). Then `prod b.example.com false`: the nested db object was changed because freeze is shallow. deepFreeze makes the push fail with 'Cannot add property 2, object is not extensible'. The sealed object accepts a change but not a new key: `seal add: TypeError`, then `{ a: 2 } true`. The immutable update leaves `state.todos` as `[ 'write tests' ]`, gives next a new array with 'deploy', and shares the untouched user object (`true`). The last line shows copies, with `nums` unchanged.",
      questions: [
        { q: 'const vs Object.freeze?', a: "const stops the variable from being reassigned but the object can still change. Object.freeze stops the object's own properties from changing, but only one level deep." },
        { q: 'Is Object.freeze deep?', a: "No, it's shallow. Nested objects and arrays can still be changed. Use a recursive deepFreeze, or rely on TypeScript readonly types for compile-time checks." },
        { q: 'freeze vs seal vs preventExtensions?', a: "freeze: no adding, removing, or changing. seal: no adding or removing, but existing values can change. preventExtensions: only adding new keys is blocked." },
        { q: 'Why does React need immutable state updates?', a: "React checks whether state changed by comparing references. Mutating an object keeps the same reference, so React may skip the re-render and memoized children won't update." },
      ],
      answer30: "Immutability means never changing existing data; to update, I create a new object with the change. Object.freeze helps by making an object's own properties read-only, but it's shallow, and in sloppy mode the failed writes are silent. Seal is weaker: values can change but keys can't be added or removed. In day-to-day code I get immutability with spread, map, filter, and toSorted, copying just the path I change. That matters for React, which detects changes by reference.",
      mistakes: [
        "Thinking const makes an object immutable.",
        "Expecting freeze to protect nested objects.",
        "Mutating state and then calling setState with the same reference.",
        "Trap: `sort()` and `reverse()` mutate in place even inside an otherwise immutable update; use `toSorted()` or copy first.",
      ],
      takeaway: "freeze is shallow and silent in sloppy mode; real immutability is creating new objects.",
    },

    {
      id: 'web-workers',
      title: 'Web Workers',
      level: 'advanced',
      priority: 'good',
      frequency: 'occasional',
      summary: 'A Web Worker runs JavaScript on a separate background thread, so heavy work does not freeze the page. It talks to the page only through messages.',
      what: [
        "JavaScript on a page runs on one main thread, which also handles clicks and rendering. A long calculation there freezes the UI.",
        "A Web Worker runs a script on another thread. The page sends it data with `postMessage`, the worker does the heavy work, and sends the result back with its own `postMessage`. Each side listens with `onmessage`.",
      ],
      deeper: [
        "Workers have no access to the DOM, `window`, or `document`. They do have `fetch`, timers, IndexedDB, and `self`.",
        "Data sent with postMessage is copied using the structured clone algorithm (the same as `structuredClone`), so functions can't be sent. Large `ArrayBuffer`s can be transferred instead of copied by listing them as transferables: `postMessage(buf, [buf])`. After the transfer, the sender can no longer use the buffer.",
        "Types: dedicated workers (one page), shared workers (shared between tabs of the same origin), and service workers (a special worker that sits between the page and the network for caching, offline support, and push notifications).",
        "Node's equivalent is the `worker_threads` module, used for CPU-heavy tasks like image processing or hashing, so the event loop stays free for requests.",
      ],
      why: "It's the answer to 'how would you keep the UI responsive while processing a big file or doing a heavy calculation?' and connects to the event loop topic.",
      analogy: "The main thread is a waiter who must keep serving tables. A Web Worker is a cook in the back kitchen: the waiter passes an order slip (message), keeps serving, and gets a plate back when it's ready. The cook can't walk into the dining room (no DOM).",
      code: [
        {
          lang: 'js',
          title: 'main.js (browser page)',
          source: `const worker = new Worker(new URL('./prime-worker.js', import.meta.url), { type: 'module' });

worker.onmessage = (event) => {
  console.log('primes found:', event.data.count);
  worker.terminate();                 // free the thread when done
};
worker.onerror = (event) => console.error('worker failed:', event.message);

worker.postMessage({ limit: 100_000 }); // returns immediately; the UI stays responsive
console.log('main thread is free');`,
        },
        {
          lang: 'js',
          title: 'prime-worker.js',
          source: `self.onmessage = (event) => {
  const { limit } = event.data;
  let count = 0;
  for (let n = 2; n < limit; n++) {
    let isPrime = true;
    for (let d = 2; d * d <= n; d++) if (n % d === 0) { isPrime = false; break; }
    if (isPrime) count++;
  }
  self.postMessage({ count });        // no DOM access here, only messages
};`,
        },
        {
          lang: 'js',
          title: 'Node equivalent with worker_threads (one file)',
          source: `const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename, { workerData: { limit: 100_000 } });
  worker.on('message', (msg) => console.log('primes found:', msg.count));
  console.log('main thread is free');
} else {
  let count = 0;
  for (let n = 2; n < workerData.limit; n++) {
    let isPrime = true;
    for (let d = 2; d * d <= n; d++) if (n % d === 0) { isPrime = false; break; }
    if (isPrime) count++;
  }
  parentPort.postMessage({ count });
}`,
        },
      ],
      output: "'main thread is free' prints first, because postMessage returns immediately. When the worker finishes, 'primes found: 9592' prints (there are 9,592 primes below 100,000). The Node version prints the same two lines in the same order.",
      questions: [
        { q: 'What is a Web Worker?', a: "A script that runs on a separate background thread. It communicates with the page only through postMessage and onmessage, so heavy work doesn't block the UI." },
        { q: 'Can a Web Worker access the DOM?', a: "No. Workers have no window or document. They compute and send results back; the main thread updates the DOM." },
        { q: 'How is data passed to a worker?', a: "postMessage copies it using the structured clone algorithm, so functions can't be sent. Big ArrayBuffers can be transferred instead of copied, which is faster but makes them unusable on the sending side." },
        { q: 'Web Worker vs Service Worker?', a: "A Web Worker runs heavy computation for a page. A Service Worker acts as a network proxy for the whole site, handling caching, offline support, and push notifications, and can run when no page is open." },
        { q: 'What is the Node.js equivalent?', a: "The worker_threads module. It's used for CPU-heavy work so the event loop stays free to handle requests." },
      ],
      answer30: "A Web Worker runs JavaScript on a separate thread so heavy work, like parsing a large file or a big calculation, doesn't freeze the UI. The page and the worker only talk through postMessage; data is copied with structured clone, or large buffers can be transferred. Workers can't touch the DOM, so the main thread applies the results. Service workers are a different kind used for caching and offline support. In Node, worker_threads does the same job for CPU-heavy tasks.",
      mistakes: [
        "Trying to use document or window inside a worker.",
        "Using a worker for async I/O like fetch, which already doesn't block the main thread.",
        "Sending huge objects back and forth on every message instead of transferring buffers.",
        "Trap: creating a worker has a start-up cost, so spawning one per tiny task is slower than doing the work inline. Reuse a worker or a pool.",
      ],
      takeaway: "Workers move CPU-heavy work off the main thread; they talk only through messages and can't touch the DOM.",
    },

    {
      id: 'json-edge-cases',
      title: 'JSON.stringify and JSON.parse edge cases',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'stringify drops undefined, functions, and symbols, turns NaN into null and Dates into strings, throws on BigInt and cycles; replacer, toJSON, and reviver let you control it.',
      what: [
        "`JSON.stringify(value)` turns a value into a JSON string. `JSON.parse(text)` turns a JSON string back into a value.",
        "JSON only knows strings, numbers, booleans, null, arrays, and plain objects. Anything else is converted or dropped, often silently.",
      ],
      deeper: [
        "stringify rules: object properties that are `undefined`, functions, or symbols are skipped; in arrays they become `null`. `NaN` and `Infinity` become `null`. Dates become ISO strings (through their `toJSON` method). Map and Set become `{}`. BigInt throws a TypeError, and circular references throw a TypeError.",
        "Second argument, the replacer: a function `(key, value) => newValue` (return undefined to drop a key) or an array of keys to keep. Third argument: indentation, like `2`, for pretty printing.",
        "If an object has a `toJSON()` method, stringify uses its return value. That's how Date works, and you can add one to your own classes.",
        "parse is strict: no single quotes, no trailing commas, no comments, and keys must be quoted. It throws a SyntaxError, so wrap untrusted input in try/catch. The second argument, the reviver, transforms values while parsing, for example turning ISO strings back into Dates. Parsed numbers beyond 2^53 lose precision.",
      ],
      why: "APIs, logs, localStorage, and caches all go through JSON. Lost Dates, vanished undefined fields, and BigInt crashes are common real bugs. On your resume: the Skillkeepr audit logging service redacts sensitive fields before storing them, and a stringify replacer is one simple way to do that kind of masking.",
      analogy: "JSON is a fax machine. Text and numbers come through fine, but a photo (Date) arrives as a description, a voice note (function) doesn't come through at all, and a page that refers to itself (circular) jams the machine.",
      code: {
        lang: 'js',
        source: `const data = {
  name: 'Asha', age: undefined, greet() {}, id: Symbol('x'),
  score: NaN, limit: Infinity,
  joined: new Date('2024-01-15T10:00:00Z'),
  tags: new Set(['a']),
  list: [undefined, () => {}, 1],
};
console.log(JSON.stringify(data));

try { JSON.stringify({ n: 10n }); } catch (e) { console.log(e.message); }

// Replacer function: mask sensitive fields
const masked = JSON.stringify({ user: 'asha', password: 'p@ss', token: 'abc' },
  (key, value) => (['password', 'token'].includes(key) ? '[REDACTED]' : value));
console.log(masked);
console.log(JSON.stringify({ a: 1, b: 2, c: 3 }, ['a', 'c'])); // replacer array: keep only these keys
console.log(JSON.stringify({ a: [1] }, null, 2));              // pretty print

// toJSON controls how your own objects are serialised
class Money { constructor(cents) { this.cents = cents; } toJSON() { return (this.cents / 100).toFixed(2); } }
console.log(JSON.stringify({ price: new Money(1999) }));       // {"price":"19.99"}

// Reviver: turn ISO strings back into Dates
const parsed = JSON.parse('{"at":"2024-01-15T10:00:00.000Z"}', (k, v) => (k === 'at' ? new Date(v) : v));
console.log(parsed.at instanceof Date);                         // true

for (const bad of ["{'a':1}", '{"a":1,}', 'undefined']) {
  try { JSON.parse(bad); } catch (e) { console.log('invalid:', bad, '->', e.name); }
}
console.log(JSON.parse('"hi"'), JSON.parse('null'), JSON.stringify(undefined)); // hi null undefined`,
      },
      output: "The first line prints `{\"name\":\"Asha\",\"score\":null,\"limit\":null,\"joined\":\"2024-01-15T10:00:00.000Z\",\"tags\":{},\"list\":[null,null,1]}`: age, greet, and id vanished, NaN and Infinity became null, the Date became a string, the Set became {}, and array holes became null. BigInt throws 'Do not know how to serialize a BigInt'. The replacer prints password and token as [REDACTED]; the key array keeps only a and c; the indent pretty-prints. Money becomes \"19.99\". The reviver gives a real Date (`true`). All three bad inputs throw `SyntaxError`. Last line: `hi null undefined` (stringify of undefined returns undefined, not a string).",
      questions: [
        { q: 'What does JSON.stringify drop or change?', a: "It drops undefined, functions, and symbol values in objects (they become null in arrays), turns NaN and Infinity into null, Dates into ISO strings, Maps and Sets into {}, and throws on BigInt and circular references." },
        { q: 'What are the second and third arguments of JSON.stringify?', a: "The second is a replacer: a function to transform or drop values, or an array of keys to keep. The third is indentation for pretty printing, like 2." },
        { q: 'What is toJSON?', a: "If an object has a toJSON method, JSON.stringify serialises its return value instead of the object. Date uses this to output an ISO string." },
        { q: 'Why do Dates come back as strings after JSON.parse, and how do you fix it?', a: "JSON has no date type, so they're stored as strings. Use a reviver function in JSON.parse, or convert specific fields after parsing (or validate with a schema library like zod)." },
        { q: 'How do you safely parse untrusted JSON?', a: "Wrap JSON.parse in try/catch because invalid input throws a SyntaxError, then validate the shape before trusting it." },
      ],
      answer30: "JSON only supports strings, numbers, booleans, null, arrays, and plain objects, so stringify loses things: undefined, functions, and symbols disappear from objects, NaN and Infinity become null, Dates become strings, Maps become empty objects, and BigInt or circular references throw. I use the replacer to mask or drop fields and toJSON to control how my own classes serialise. On the way back, JSON.parse throws on invalid input, so I wrap it in try/catch, and a reviver can turn date strings back into Dates.",
      mistakes: [
        "Expecting Dates to survive a JSON round trip.",
        "Not wrapping JSON.parse of external input in try/catch.",
        "Sending BigInt IDs in a response without converting them to strings.",
        "Trap: a field set to undefined disappears completely, so a PATCH body meant to 'clear' a field sends nothing. Send null instead.",
      ],
      takeaway: "JSON keeps only plain data; use replacer and toJSON going out, reviver and try/catch coming in.",
    },

    {
      id: 'tagged-templates',
      title: 'Template literals and tagged templates',
      level: 'advanced',
      priority: 'rare',
      frequency: 'occasional',
      summary: 'A tag is a function placed before a template literal; it receives the fixed string parts and the inserted values separately, so it can escape or transform them.',
      what: [
        "Template literals use backticks and `${expression}` to insert values, and can span multiple lines.",
        "A tagged template puts a function name right before the opening backtick, with no parentheses (for example `html` followed directly by a template literal). Instead of building the string, JavaScript calls the function with an array of the fixed string parts and then each inserted value as separate arguments.",
      ],
      deeper: [
        "The strings array always has one more item than the values (it may start or end with an empty string). It also has a `.raw` property with the unprocessed text, where `\\n` stays as two characters.",
        "`String.raw` is a built-in tag that returns the raw text, handy for Windows paths and regular expressions.",
        "Because values arrive separately, a tag can escape them safely. Real examples: `sql` tags in libraries like `postgres` and Prisma's `$queryRaw` turn values into query parameters (preventing SQL injection), `styled-components` and Emotion use `styled.div` tags for CSS, `gql` parses GraphQL, and `html` tags in lit escape HTML.",
        "A tag doesn't have to return a string; it can return an object, like a query with text and values.",
      ],
      why: "You use them through libraries (styled-components, gql, SQL clients) and interviewers sometimes ask how they prevent injection.",
      analogy: "A fill-in-the-blanks form. Normally JavaScript fills the blanks itself. With a tag, it hands the form and the answers to a checker (the tag function), who can clean each answer before writing it in.",
      code: {
        lang: 'js',
        source: `function inspect(strings, ...values) {
  console.log(strings, values);
  return strings.reduce((out, str, i) => out + str + (i < values.length ? \`[\${values[i]}]\` : ''), '');
}
const name = 'Asha', role = 'dev';
console.log(inspect\`User \${name} is a \${role}.\`);

// Escape HTML in every inserted value
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
function html(strings, ...values) {
  return strings.reduce((out, str, i) => out + str + (i < values.length ? escapeHtml(values[i]) : ''), '');
}
const comment = '<img src=x onerror=alert(1)>';
console.log(html\`<p>\${comment}</p>\`);

// SQL-style tag: keep values out of the query text (parameterised query)
function sql(strings, ...values) {
  return { text: strings.reduce((query, str, i) => query + '$' + i + str), values };
}
const tenantId = 7, email = "x' OR '1'='1";
console.log(sql\`SELECT * FROM users WHERE tenant_id = \${tenantId} AND email = \${email}\`);

console.log(String.raw\`C:\\new\\folder\`);   // backslashes kept as typed`,
      },
      output: "`inspect` logs `[ 'User ', ' is a ', '.' ] [ 'Asha', 'dev' ]` (three string parts, two values), then returns `User [Asha] is a [dev].`. The html tag prints `<p>&lt;img src=x onerror=alert(1)&gt;</p>`, so the payload is shown as text. The sql tag returns `{ text: 'SELECT * FROM users WHERE tenant_id = $1 AND email = $2', values: [ 7, \"x' OR '1'='1\" ] }`, so the injection attempt stays a harmless value. `String.raw` prints `C:\\new\\folder` with the backslashes intact.",
      questions: [
        { q: 'What is a tagged template?', a: "A function placed before a template literal. It's called with an array of the fixed string parts and the inserted values as separate arguments, and returns whatever it wants." },
        { q: 'How do tagged templates help prevent SQL injection?', a: "The tag receives values separately from the query text, so it can send them as bound parameters ($1, $2) instead of pasting them into the SQL. Libraries like postgres and Prisma's $queryRaw work this way." },
        { q: 'Where have you seen tagged templates?', a: "styled-components and Emotion (`styled.div` followed by a template of CSS), gql for GraphQL queries, sql tags in database clients, html in lit, and String.raw." },
        { q: 'What is String.raw?', a: "A built-in tag that returns the string without processing escape sequences, so `\\n` stays as a backslash and n. Useful for file paths and regex patterns." },
      ],
      answer30: "A tagged template is a function placed right before a template literal. Instead of joining the string, JavaScript calls the function with the fixed text parts as an array and the inserted values as separate arguments. That separation is the point: the tag can escape HTML, or turn values into query parameters so a SQL tag prevents injection. I've seen it in styled-components, gql, and SQL clients, and String.raw is a built-in one.",
      mistakes: [
        "Thinking the strings array and values have the same length; strings has one more.",
        "Building SQL with a plain template literal instead of a tag or parameters (SQL injection).",
        "Forgetting that a tag can return a non-string value.",
        "Trap: Prisma's `$queryRaw` with a tagged template is parameterised, but `$queryRawUnsafe` with string concatenation is not.",
      ],
      takeaway: "A tag gets the text parts and the values separately, so it can escape values safely.",
    },

    {
      id: 'polyfills',
      title: 'Writing polyfills: bind, map, reduce, Promise.all',
      level: 'advanced',
      priority: 'must',
      frequency: 'very common',
      summary: 'A polyfill re-implements a built-in feature with older JavaScript. Interviewers ask for bind, map, reduce, and Promise.all to test this, arrays, and promises.',
      what: [
        "A polyfill is code that adds a missing built-in feature, so newer code can run in older environments. In interviews, 'write a polyfill for X' means 'show you understand exactly how X behaves'.",
        "Inside an `Array.prototype` method, `this` is the array it was called on. Inside a `Function.prototype` method, `this` is the function.",
      ],
      deeper: [
        "bind: return a new function that calls the original with the fixed `this` and any preset arguments, plus later arguments. When the bound function is called with `new`, native bind ignores the bound `this`; check `new.target` to match that.",
        "map: create a result array of the same length, call the callback with `(item, index, array)` and `thisArg`, and skip holes (`i in this`) like the native one does.",
        "reduce: if no initial value is given, start from the first existing item; on an empty array with no initial value, throw a TypeError. Use rest parameters to tell 'no initial value' apart from 'initial value is undefined'.",
        "Promise.all: return a new promise; wrap each item with `Promise.resolve` (so plain values work); store each result at its original index; resolve when a counter reaches zero; reject on the first rejection; resolve immediately for an empty input.",
        "Real polyfills check first (`if (!Array.prototype.flat)`) and add methods with `Object.defineProperty` so they're non-enumerable and don't show up in `for...in`. In production, tools like core-js with Babel do this for you.",
      ],
      why: "It's one of the most common machine-coding rounds for frontend and full-stack roles, because it tests this, closures, arrays, and promises in one go.",
      analogy: "Building a spare part for an old car from the manufacturer's spec sheet. If your part matches the spec exactly, including the weird edge cases, the car can't tell the difference.",
      code: {
        lang: 'js',
        source: `// 1. Function.prototype.bind
Function.prototype.myBind = function (thisArg, ...preset) {
  const fn = this;
  if (typeof fn !== 'function') throw new TypeError('myBind must be called on a function');
  return function bound(...later) {
    if (new.target) return new fn(...preset, ...later); // like native: new ignores thisArg
    return fn.apply(thisArg, [...preset, ...later]);
  };
};

// 2. Array.prototype.map
Array.prototype.myMap = function (callback, thisArg) {
  if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');
  const result = new Array(this.length);
  for (let i = 0; i < this.length; i++) {
    if (i in this) result[i] = callback.call(thisArg, this[i], i, this); // skip holes
  }
  return result;
};

// 3. Array.prototype.reduce
Array.prototype.myReduce = function (callback, ...init) {
  let i = 0;
  let acc;
  if (init.length) {
    acc = init[0];
  } else {
    while (i < this.length && !(i in this)) i++;
    if (i >= this.length) throw new TypeError('Reduce of empty array with no initial value');
    acc = this[i++];
  }
  for (; i < this.length; i++) if (i in this) acc = callback(acc, this[i], i, this);
  return acc;
};

// 4. Promise.all
function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const items = Array.from(iterable);
    const results = new Array(items.length);
    let remaining = items.length;
    if (remaining === 0) return resolve(results);
    items.forEach((item, i) => {
      Promise.resolve(item).then((value) => {
        results[i] = value;                  // keep input order, not finish order
        if (--remaining === 0) resolve(results);
      }, reject);                            // first rejection wins
    });
  });
}

// Tests
const user = { name: 'Asha' };
function greet(greeting, punct) { return \`\${greeting}, \${this.name}\${punct}\`; }
console.log(greet.myBind(user, 'Hi')('!'));                    // Hi, Asha!
function Point(x, y) { this.x = x; this.y = y; }
const BoundPoint = Point.myBind(null, 1);
console.log(new BoundPoint(2));                                // Point { x: 1, y: 2 }

console.log([1, 2, 3].myMap((x) => x * 2), [1, , 3].myMap((x) => x * 2));
console.log([1, 2, 3, 4].myReduce((a, b) => a + b), [].myReduce((a, b) => a + b, 10)); // 10 10
try { [].myReduce((a, b) => a + b); } catch (e) { console.log(e.message); }

const delay = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));
promiseAll([delay(30, 'slow'), 42, delay(10, 'fast')]).then((r) => console.log(r));
promiseAll([delay(10, 'ok'), Promise.reject(new Error('fail'))]).catch((e) => console.log('rejected:', e.message));
promiseAll([]).then((r) => console.log('empty:', r));`,
      },
      output: "`Hi, Asha!` (this fixed, 'Hi' preset, '!' added later). `Point { x: 1, y: 2 }`: with new, the bound function builds a real Point. myMap prints `[ 2, 4, 6 ] [ 2, <1 empty item>, 6 ]`, keeping the hole like native map. myReduce prints `10 10`, then 'Reduce of empty array with no initial value'. The promise tests print `empty: []` and `rejected: fail` first (they settle soonest), then `[ 'slow', 42, 'fast' ]` in input order even though 'fast' finished first.",
      questions: [
        { q: 'How do you implement Function.prototype.bind?', a: "Return a new function that calls the original with fn.apply(thisArg, [...presetArgs, ...laterArgs]). For full accuracy, if it's called with new (new.target is set), construct the original instead and ignore thisArg." },
        { q: 'What edge cases matter in a map polyfill?', a: "Validate that the callback is a function, pass (item, index, array) and thisArg, return a new array of the same length, and skip holes in sparse arrays." },
        { q: 'How does reduce behave without an initial value?', a: "It uses the first element as the accumulator and starts from the second. On an empty array with no initial value it throws a TypeError." },
        { q: 'Walk through a Promise.all polyfill.', a: "Return a new promise. Wrap each item in Promise.resolve, store each value at its index, and decrement a counter; resolve when it reaches zero. Reject on the first rejection, and resolve immediately with [] for empty input." },
        { q: 'Why use Object.defineProperty for real polyfills?', a: "Assigning to a prototype creates an enumerable property, which shows up in for...in loops over every array. defineProperty with enumerable: false matches native methods." },
      ],
      answer30: "A polyfill re-creates a built-in so it runs where it's missing, and in interviews it proves I know the exact behaviour. For bind I return a function that applies the original with the saved this and preset arguments, and handle new. For map and reduce, this is the array; I pass index and array to the callback, skip holes, and for reduce without an initial value I start from the first item and throw on an empty array. For Promise.all I store results by index, count down to resolve, reject on the first error, and resolve an empty input right away.",
      mistakes: [
        "Pushing results in finish order in Promise.all instead of storing by index.",
        "Forgetting the empty-array case in Promise.all (it never resolves) or reduce (it should throw).",
        "Using an arrow function for the polyfill method, so `this` isn't the array or function.",
        "Trap: assigning `Array.prototype.myMap = ...` makes it enumerable, so `for...in` over any array now lists 'myMap'. Real polyfills use Object.defineProperty and check if the method already exists.",
      ],
      takeaway: "Match the spec: right this, right arguments, input order, and the empty-input edge cases.",
    },
  ],

  rapidFire: [
    { q: 'Scope of var vs let?', a: 'var: function. let/const: block.' },
    { q: 'What is the TDZ?', a: 'The period before a let/const declaration runs; accessing it throws ReferenceError.' },
    { q: 'Are function declarations hoisted?', a: 'Yes, fully, so they can be called before their line.' },
    { q: 'Does const freeze objects?', a: 'No, it only blocks reassignment.' },
    { q: 'What is a closure?', a: 'A function plus a live reference to the variables where it was created.' },
    { q: 'Fix for var-in-loop setTimeout bug?', a: 'Use let, which creates a new binding per iteration.' },
    { q: 'Falsy values?', a: 'false, 0, -0, 0n, empty string, null, undefined, NaN.' },
    { q: '|| vs ??', a: '|| replaces any falsy value; ?? replaces only null or undefined.' },
    { q: 'NaN === NaN?', a: 'false. Use Number.isNaN.' },
    { q: 'this in a plain function call in strict mode?', a: 'undefined.' },
    { q: 'Do arrow functions have their own this?', a: 'No, they use the surrounding this.' },
    { q: 'call vs apply vs bind?', a: 'call: args listed; apply: args array; bind: returns new function.' },
    { q: 'Promise states?', a: 'Pending, fulfilled, rejected.' },
    { q: 'Run two independent awaits in parallel?', a: 'await Promise.all([a(), b()]).' },
    { q: 'Promise.any rejects when?', a: 'Only when all promises reject (AggregateError).' },
    { q: 'Microtask examples?', a: 'Promise then/catch/finally, code after await, queueMicrotask.' },
    { q: 'Macrotask examples?', a: 'setTimeout, setInterval, I/O callbacks, UI events.' },
    { q: 'Order: sync, microtasks, macrotasks?', a: 'All sync, then all microtasks, then one macrotask, repeat.' },
    { q: 'Spread copy depth?', a: 'Shallow. Use structuredClone for deep.' },
    { q: 'Debounce vs throttle?', a: 'Debounce runs after calls stop; throttle runs at most once per interval.' },
    { q: 'typeof null?', a: "'object', a historic bug. Check with x === null." },
    { q: 'How many primitive types?', a: 'Seven: string, number, bigint, boolean, undefined, null, symbol.' },
    { q: 'What does new do?', a: 'Creates an object linked to Fn.prototype, runs Fn with this as that object, returns it.' },
    { q: 'How does instanceof work?', a: "Checks if Ctor.prototype is anywhere in the object's prototype chain." },
    { q: 'Must call before this in a subclass constructor?', a: 'super().' },
    { q: 'Can arrow functions be used with new?', a: 'No, they have no prototype and throw a TypeError.' },
    { q: 'Default sort order of [10, 1, 2].sort()?', a: '[1, 10, 2]: compared as strings. Pass (a, b) => a - b.' },
    { q: 'reduce on an empty array with no initial value?', a: 'Throws a TypeError.' },
    { q: 'Are ES module imports copies?', a: 'No, live read-only bindings. CommonJS require gives a snapshot.' },
    { q: '__dirname in ESM?', a: 'import.meta.dirname (Node 20.11+) or derive it from import.meta.url.' },
    { q: 'Does try/catch catch an un-awaited rejected promise?', a: 'No. await it inside try, or use .catch().' },
    { q: 'Main GC algorithm?', a: 'Mark-and-sweep from roots (globals, call stack), generational in V8.' },
    { q: 'Deep copy in modern JS?', a: 'structuredClone(obj).' },
    { q: 'event.target vs event.currentTarget?', a: 'target: where the event started. currentTarget: where the listener is attached.' },
    { q: 'Default event phase for addEventListener?', a: 'Bubbling. Pass { capture: true } for capturing.' },
    { q: 'Safe way to insert user text into the DOM?', a: 'textContent, never innerHTML.' },
    { q: 'Dedupe an array?', a: '[...new Set(arr)].' },
    { q: 'Can you iterate a WeakMap?', a: 'No. No size, no keys; entries can vanish on GC.' },
    { q: 'Promise.all rejects when?', a: 'On the first rejection; it does not cancel the others.' },
    { q: 'Does fetch reject on a 404?', a: 'No. Only on network errors or abort. Check res.ok.' },
    { q: 'Add a timeout to fetch?', a: 'signal: AbortSignal.timeout(ms).' },
    { q: 'Best place for a JWT in the browser?', a: 'HttpOnly, Secure, SameSite cookie.' },
    { q: 'Is Object.freeze deep?', a: 'No, shallow. Nested objects can still change.' },
    { q: 'JSON.stringify of { a: undefined }?', a: "'{}': undefined properties are dropped." },
    { q: 'Can a Web Worker touch the DOM?', a: 'No. It only talks to the page with postMessage.' },
    { q: 'Generator function syntax?', a: 'function* with yield; calling it returns an iterator.' },
  ],
};

export default javascript;
