// JavaScript Coding and Output Questions stack. Topics are auto-sorted Basic -> Intermediate -> Advanced by the registry.
// Every snippet was run with Node 20+ as an ES module (strict mode) unless its title says otherwise.

const jsOutput = {
  name: 'JavaScript Coding and Output Questions',
  intro: 'The "what does this print?" puzzles and "write it by hand" functions that show up in almost every JavaScript round. Predict the output first, then read why.',
  topics: [
    {
      id: 'output-hoisting-tdz',
      title: 'Output: hoisting and the TDZ',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: '`var` is hoisted as `undefined`, `let`/`const` throw before their line, function declarations are hoisted whole.',
      what: [
        "Before any code runs, JavaScript scans each scope and registers every declaration. That is called hoisting. What you get before the declaration line depends on the keyword.",
        "`var` exists and holds `undefined`. `let` and `const` exist but are locked in the temporal dead zone (TDZ): touching them throws a `ReferenceError`. A function declaration is hoisted with its body, so you can call it early. A function expression stored in a `var` is just a `var`: it is `undefined` until its line runs.",
      ],
      deeper: [
        "The trick in most puzzles is a local declaration that shadows an outer one. Inside the function, the local `var x` is hoisted to the top of the function, so the outer `x` is hidden even on lines above the local declaration.",
        "`typeof` on a name that was never declared returns `'undefined'` safely, but `typeof` on a `let` in its TDZ still throws. That surprises people who think `typeof` is always safe.",
      ],
      why: "Hoisting puzzles are the most common warm-up in JS rounds. They check whether you know how scopes are built, not just syntax.",
      analogy: "A teacher reads the class list before the lesson. `var` students are marked present but empty-handed (`undefined`). `let`/`const` students are on the list but not allowed to speak until they arrive (TDZ). Function declarations arrive early with their homework done.",
      code: [
        {
          lang: 'js',
          title: 'Snippet 1',
          source: `function demo() {
  console.log(a);
  var a = 1;
  console.log(a);
}
demo();`,
        },
        {
          lang: 'js',
          title: 'Snippet 2',
          source: `function demo() {
  try {
    console.log(b);
    let b = 2;
  } catch (err) {
    console.log(err.name);
  }
}
demo();`,
        },
        {
          lang: 'js',
          title: 'Snippet 3',
          source: `console.log(typeof foo, typeof bar);
function foo() {}
var bar = function () {};`,
        },
        {
          lang: 'js',
          title: 'Snippet 4',
          source: `var x = 1;
function f() {
  console.log(x);
  var x = 2;
}
f();`,
        },
        {
          lang: 'js',
          title: 'Snippet 5',
          source: `console.log(typeof notDeclared);
try {
  console.log(typeof later);
} catch (err) {
  console.log(err.name);
}
let later = 'ready';`,
        },
      ],
      output: "Snippet 1: `undefined` then `1`. Snippet 2: `ReferenceError`. Snippet 3: `function undefined`. Snippet 4: `undefined`. Snippet 5: `undefined` then `ReferenceError`.",
      questions: [
        { q: 'What does snippet 1 print?', a: "`undefined`, then `1`. `var a` is hoisted to the top of `demo` and starts as `undefined`; only the assignment `a = 1` stays on its line." },
        { q: 'What does snippet 2 print?', a: "`ReferenceError`. `let b` is hoisted but sits in the temporal dead zone until its line runs, so reading it earlier throws." },
        { q: 'What does snippet 3 print?', a: "`function undefined`. The function declaration `foo` is hoisted with its body. `bar` is a `var`, so it exists but is `undefined` until the assignment runs." },
        { q: 'What does snippet 4 print?', a: "`undefined`, not `1`. The local `var x` inside `f` is hoisted to the top of `f` and shadows the outer `x`, and it has no value yet." },
        { q: 'What does snippet 5 print?', a: "`undefined`, then `ReferenceError`. `typeof` on a never-declared name is safe, but `typeof` on a `let` that is still in its TDZ throws." },
      ],
      answer30: "All declarations are registered before code runs. A var starts as undefined, so reading it early gives undefined. let and const are in the temporal dead zone until their line, so reading them early throws a ReferenceError. Function declarations are hoisted with their body. The common trick is a local var that shadows an outer variable: inside the function, the local one wins from the very first line.",
      mistakes: [
        "Saying `let` and `const` are not hoisted. They are hoisted; they are just not initialised (TDZ).",
        "Thinking a function expression assigned to `var` can be called early. Calling it gives `TypeError: bar is not a function`.",
        "Forgetting that an inner `var` hides the outer variable on lines above it too.",
        "Trap: 'Is `typeof` always safe?' Not for a `let`/`const`/`class` in its TDZ; that still throws.",
      ],
      takeaway: 'var: undefined early. let/const: ReferenceError early. Function declarations: usable early.',
    },

    {
      id: 'output-closures-loops',
      title: 'Output: closures in loops (var vs let)',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: '`var` gives one shared loop variable, `let` gives a fresh one per iteration; closures keep variables, not values.',
      what: [
        "A closure is a function that remembers the variables around it. It remembers the variable itself, not a copy of the value at that moment.",
        "With `var`, a `for` loop has one variable for the whole loop. Every callback created in the loop shares it, so they all see the final value. With `let`, each iteration gets its own new binding, so each callback sees its own value.",
      ],
      deeper: [
        "The classic `setTimeout` in a loop puzzle works because the callbacks run after the loop has finished. By then the single `var i` is already 3.",
        "Before `let`, the fix was an IIFE (immediately invoked function) that takes `i` as a parameter, creating a new scope per iteration. Today `let` does this for you. Each call to a factory function (like `counter()`) also gets its own private variables.",
      ],
      why: "This is probably the single most asked output question. It also explains real bugs in event handlers and React effects that read stale values.",
      analogy: "With `var`, all the kids share one whiteboard; by the time they look, it shows the last number. With `let`, each kid gets their own sticky note written at that moment.",
      code: [
        {
          lang: 'js',
          title: 'Snippet 1',
          source: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`,
        },
        {
          lang: 'js',
          title: 'Snippet 2',
          source: `for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`,
        },
        {
          lang: 'js',
          title: 'Snippet 3',
          source: `for (var i = 0; i < 3; i++) {
  ((n) => setTimeout(() => console.log(n), 0))(i);
}`,
        },
        {
          lang: 'js',
          title: 'Snippet 4',
          source: `function counter() {
  let count = 0;
  return { inc: () => ++count, get: () => count };
}
const c1 = counter();
const c2 = counter();
c1.inc();
c1.inc();
c2.inc();
console.log(c1.get(), c2.get());`,
        },
        {
          lang: 'js',
          title: 'Snippet 5',
          source: `let x = 1;
const show = () => x;
x = 2;
console.log(show());`,
        },
      ],
      output: "Snippet 1: `3`, `3`, `3`. Snippet 2: `0`, `1`, `2`. Snippet 3: `0`, `1`, `2`. Snippet 4: `2 1`. Snippet 5: `2`.",
      questions: [
        { q: 'What does snippet 1 print?', a: "`3`, `3`, `3` on separate lines. There is only one `var i` for the whole loop, and the callbacks run after the loop ends, when `i` is 3." },
        { q: 'What does snippet 2 print?', a: "`0`, `1`, `2`. `let` in a `for` loop creates a new binding for each iteration, so each callback closes over its own `i`." },
        { q: 'What does snippet 3 print?', a: "`0`, `1`, `2`. The IIFE receives the current `i` as parameter `n`, and each call has its own `n`. This was the pre-ES6 fix." },
        { q: 'What does snippet 4 print?', a: "`2 1`. Each call to `counter()` creates a separate `count` variable, so `c1` and `c2` do not share state." },
        { q: 'What does snippet 5 print?', a: "`2`. A closure captures the variable, not its value at creation time, so it reads whatever `x` holds when it is called." },
      ],
      answer30: "A closure remembers variables, not values. With var, a for loop has one shared variable, so callbacks that run later all see the final value, like 3, 3, 3. With let, each iteration gets a fresh binding, so you get 0, 1, 2. The old fix was an IIFE that passes i in as a parameter. And each call to a factory function creates new private variables, which is how closures give you encapsulation.",
      mistakes: [
        "Saying the closure 'copies' the value. It keeps a live reference to the variable.",
        "Fixing the var loop by moving `setTimeout` delay to `i * 1000`. That changes timing, not the shared variable.",
        "Thinking two calls of the same factory share variables. Each call has its own scope.",
        "Trap: 'Does `let` fix it in a `while` loop too?' Only if the `let` is declared inside the loop body; a `let` declared outside the loop is still one shared variable.",
      ],
      takeaway: 'var loop = one shared variable; let loop = one per iteration.',
    },

    {
      id: 'output-this-binding',
      title: 'Output: this binding',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: '`this` is decided by how a function is called; arrows take `this` from where they were written.',
      note: "These snippets assume strict mode (ES modules and classes are always strict). In a sloppy browser script, a plain call gets `this === window` instead of `undefined`, so some lines would print differently.",
      what: [
        "For a regular function, `this` is set at call time. Called as `obj.method()`, `this` is `obj`. Called as a plain `fn()`, `this` is `undefined` in strict mode. Called with `new`, `this` is the new object. `call`, `apply` and `bind` set it explicitly.",
        "Arrow functions have no `this` of their own. They use the `this` of the surrounding code where they were written, and `call`/`bind` cannot change it.",
      ],
      deeper: [
        "Precedence, highest first: `new`, then explicit binding (`bind`, `call`, `apply`), then implicit (`obj.method()`), then default (`undefined` or the global object). A function returned by `bind` is locked: calling `bind` or `call` on it again does not change `this`.",
        "Pulling a method off an object (`const f = obj.method`) loses the object, because the call is now a plain `f()`. The same thing happens when you pass a method as a callback. Class bodies are strict, so a lost `this` there is `undefined` and accessing a property throws.",
        "For the nested case `a.b.c()`, only the object right before the last dot counts: `this` is `a.b`.",
      ],
      why: "Lost `this` is a real bug source: event handlers, callbacks, and old React class components. Interviewers use these puzzles to check you understand call-site binding.",
      analogy: "`this` is like the word 'here'. It means wherever the speaker is standing when they say it (regular function). An arrow function is a recorded message: 'here' means where it was recorded, no matter where you play it.",
      code: [
        {
          lang: 'js',
          title: 'Snippet 1',
          source: `const user = {
  name: 'Asha',
  greet() {
    return this.name;
  },
};
console.log(user.greet());
const greet = user.greet;
try {
  console.log(greet());
} catch (err) {
  console.log(err.constructor.name);
}`,
        },
        {
          lang: 'js',
          title: 'Snippet 2',
          source: `function makeUser() {
  return {
    name: 'inner',
    arrow: () => this.name,
    regular() {
      return this.name;
    },
  };
}
const u = makeUser.call({ name: 'outer' });
console.log(u.arrow(), u.regular());`,
        },
        {
          lang: 'js',
          title: 'Snippet 3',
          source: `function who() {
  return this.name;
}
const bound = who.bind({ name: 'Ravi' });
console.log(bound.call({ name: 'Meera' }));
console.log(bound.bind({ name: 'Zara' })());`,
        },
        {
          lang: 'js',
          title: 'Snippet 4',
          source: `class Counter {
  count = 0;
  incAll(items) {
    items.forEach(function () {
      try {
        this.count++;
      } catch (err) {
        console.log('regular:', err.constructor.name);
      }
    });
    items.forEach(() => this.count++);
    console.log('count:', this.count);
  }
}
new Counter().incAll([1, 2]);`,
        },
        {
          lang: 'js',
          title: 'Snippet 5',
          source: `function Person(name) {
  this.name = name;
}
const p = new Person('Asha');
console.log(p.name);

const outer = {
  name: 'outer',
  inner: { name: 'inner', get() { return this.name; } },
};
console.log(outer.inner.get());`,
        },
      ],
      output: "Snippet 1: `Asha` then `TypeError`. Snippet 2: `outer inner`. Snippet 3: `Ravi` then `Ravi`. Snippet 4: `regular: TypeError` twice, then `count: 2`. Snippet 5: `Asha` then `inner`.",
      questions: [
        { q: 'What does snippet 1 print?', a: "`Asha`, then `TypeError`. `user.greet()` has `user` as `this`. `greet()` is a plain call, so in strict mode `this` is `undefined` and reading `.name` throws." },
        { q: 'What does snippet 2 print?', a: "`outer inner`. The arrow takes `this` from `makeUser`, which was called with `{ name: 'outer' }`. The regular method is called as `u.regular()`, so its `this` is `u`." },
        { q: 'What does snippet 3 print?', a: "`Ravi` and `Ravi`. A bound function's `this` is fixed forever; `call` and a second `bind` cannot override it (only `new` can)." },
        { q: 'What does snippet 4 print?', a: "`regular: TypeError` twice, then `count: 2`. The regular callback is called by `forEach` with no `this`, and class code is strict, so `this` is `undefined`. The arrow uses the method's `this`, so it increments `count` twice." },
        { q: 'What does snippet 5 print?', a: "`Asha`, then `inner`. `new` binds `this` to the new object. In `outer.inner.get()`, `this` is the object just before the last dot, which is `inner`." },
      ],
      answer30: "For normal functions, this depends on the call site: obj.method() gives obj, a plain call gives undefined in strict mode, new gives the new object, and call, apply, and bind set it explicitly. A bound function can't be rebound. Arrow functions don't have their own this; they use the this of the code around them. So the classic bug is passing a method as a callback and losing this, and the fix is an arrow or bind.",
      mistakes: [
        "Using an arrow function as an object method and expecting `this` to be the object.",
        "Passing `obj.method` as a callback (to `setTimeout`, `forEach`, an event listener) and losing `this`.",
        "Thinking `call` can override a bound function.",
        "Trap: 'What is `this` in a `setTimeout` callback?' In browsers a regular callback gets `window` (or `undefined` in strict code); in Node it is the `Timeout` object. Use an arrow so you never depend on it.",
      ],
      takeaway: 'Regular function: this comes from the call. Arrow: this comes from where it was written.',
    },

    {
      id: 'output-event-loop',
      title: 'Output: event loop ordering',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Sync code first, then all microtasks (promises, await), then one macrotask (setTimeout), repeat.',
      what: [
        "To predict the order: (1) run all synchronous lines top to bottom. (2) run every queued microtask: `.then` callbacks, code after `await`, `queueMicrotask`. (3) run the next macrotask, like a `setTimeout` callback. (4) run all microtasks again, and so on.",
        "A `new Promise` executor runs synchronously. An `async` function runs synchronously until its first `await`.",
      ],
      deeper: [
        "Microtasks added while draining the microtask queue are run in the same drain, before any timer. A `setTimeout` scheduled from inside a microtask goes to the back of the timer queue, after timers that were already waiting.",
        "In Node, `process.nextTick` callbacks have their own queue that normally drains before promise callbacks. But in an ES module, the top-level code itself runs inside a promise job, so a promise `.then` scheduled at the top level can run before a `nextTick`. That is why snippet 5 is marked CommonJS.",
      ],
      why: "Event loop ordering is the most famous JS output question. Getting it right shows you understand async code, which matters for every Node and React engineer.",
      analogy: "A cashier finishes the current customer (sync code), then serves everyone in the express lane, including people who join it meanwhile (microtasks), then calls one person from the normal queue (macrotask), then checks the express lane again.",
      code: [
        {
          lang: 'js',
          title: 'Snippet 1',
          source: `console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');`,
        },
        {
          lang: 'js',
          title: 'Snippet 2',
          source: `setTimeout(() => console.log('t1'), 0);
Promise.resolve().then(() => {
  console.log('p1');
  setTimeout(() => console.log('t2'), 0);
  Promise.resolve().then(() => console.log('p2'));
});
setTimeout(() => console.log('t3'), 0);`,
        },
        {
          lang: 'js',
          title: 'Snippet 3',
          source: `const p = new Promise((resolve) => {
  console.log('executor');
  resolve('done');
  console.log('after resolve');
});
p.then((v) => console.log(v));
console.log('sync');`,
        },
        {
          lang: 'js',
          title: 'Snippet 4',
          source: `async function a1() {
  console.log('a1 start');
  await a2();
  console.log('a1 end');
}
async function a2() {
  console.log('a2');
}
console.log('script start');
setTimeout(() => console.log('timeout'), 0);
a1();
new Promise((resolve) => {
  console.log('p1');
  resolve();
}).then(() => console.log('p2'));
console.log('script end');`,
        },
        {
          lang: 'js',
          title: 'Snippet 5 (Node, CommonJS file)',
          source: `Promise.resolve().then(() => console.log('promise'));
process.nextTick(() => console.log('nextTick'));
setTimeout(() => console.log('timeout'), 0);
console.log('sync');`,
        },
      ],
      output: "Snippet 1: A, D, C, B. Snippet 2: p1, p2, t1, t3, t2. Snippet 3: executor, after resolve, sync, done. Snippet 4: script start, a1 start, a2, p1, script end, a1 end, p2, timeout. Snippet 5 (CommonJS): sync, nextTick, promise, timeout.",
      questions: [
        { q: 'What does snippet 1 print?', a: "`A`, `D`, `C`, `B`. A and D are synchronous. C is a microtask, so it runs as soon as the sync code ends. B is a timer (macrotask), so it runs last." },
        { q: 'What does snippet 2 print?', a: "`p1`, `p2`, `t1`, `t3`, `t2`. The microtask runs first and queues another microtask (p2), which runs in the same drain. t2 was scheduled after t1 and t3 were already waiting, so it is last." },
        { q: 'What does snippet 3 print?', a: "`executor`, `after resolve`, `sync`, `done`. The Promise executor runs synchronously, and `resolve` does not stop it. The `.then` callback is a microtask, so it runs after the sync code." },
        { q: 'What does snippet 4 print?', a: "`script start`, `a1 start`, `a2`, `p1`, `script end`, `a1 end`, `p2`, `timeout`. Everything before the first `await` and inside the Promise executor is sync. `a1 end` was queued before `p2`, and the timer runs after all microtasks." },
        { q: 'What does snippet 5 print in a CommonJS file?', a: "`sync`, `nextTick`, `promise`, `timeout`. Node drains the `nextTick` queue before promise microtasks. In an `.mjs` file the order of `nextTick` and `promise` flips, because module code itself runs inside a promise job." },
      ],
      answer30: "I go in three passes. First all synchronous code, which includes Promise executors and the part of an async function before its first await. Then all microtasks in the order they were queued, including new ones added during the drain: then-callbacks and the rest of async functions after await. Then one macrotask like a setTimeout callback, then microtasks again. In Node, process.nextTick normally runs before promise callbacks.",
      mistakes: [
        "Thinking the Promise executor is asynchronous. Only `.then`/`.catch`/`.finally` callbacks are.",
        "Thinking `resolve()` ends the executor. Code after it still runs.",
        "Running all timers before nested microtasks. Microtasks always drain fully between macrotasks.",
        "Trap: 'Is nextTick always before promises?' In CommonJS yes, at the top level. In an ES module the top-level promise callback can run first.",
      ],
      takeaway: 'Sync, then every microtask, then one timer, repeat.',
    },

    {
      id: 'output-type-coercion',
      title: 'Output: type coercion',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: '`+` with a string concatenates; other math operators convert to numbers; objects go through `valueOf`/`toString`.',
      what: [
        "Coercion is JavaScript quietly converting a value to another type. The rules most puzzles test are few: if either side of `+` is a string (after converting objects), `+` joins strings. Every other arithmetic operator (`-`, `*`, `/`) converts both sides to numbers.",
        "Unary `+x` converts to a number. Empty or whitespace-only strings become `0`; anything that isn't a clean number becomes `NaN`. Comparisons with `<` and `>` compare strings letter by letter if both sides are strings, otherwise as numbers.",
      ],
      deeper: [
        "Objects and arrays are first turned into primitives. For `+` and `==`, JavaScript calls `valueOf()` first and falls back to `toString()` (unless the object defines `Symbol.toPrimitive`). An array's `toString` joins its items with commas, so `[]` becomes `''` and `[1,2]` becomes `'1,2'`. A plain object becomes `'[object Object]'`. Template literals and `String()` ask for a string, so they call `toString()` first.",
        "`parseInt` is different from `Number`: it converts its argument to a string and reads digits until the first invalid character. That is why `parseInt(0.0000005)` is `5`: the number prints as `'5e-7'`.",
      ],
      why: "Coercion bugs hide in form inputs and query strings, which are always strings. `'5' + 1` giving `'51'` is a real production bug.",
      analogy: "`+` is a polite host: if one guest speaks only text, everyone switches to text. `-`, `*` and `/` are strict math teachers: everything gets turned into a number first.",
      code: [
        {
          lang: 'js',
          title: 'Snippet 1',
          source: `console.log(1 + '2');
console.log('3' - 1);
console.log('3' * '4');
console.log(true + 1);
console.log([] + []);
console.log([] + {});`,
        },
        {
          lang: 'js',
          title: 'Snippet 2',
          source: `console.log(+'');
console.log(+' 42 ');
console.log(+'4px');
console.log(Number(null), Number(undefined));
console.log(parseInt('4px'), parseInt(0.0000005));`,
        },
        {
          lang: 'js',
          title: 'Snippet 3',
          source: `console.log(1 < 2 < 3);
console.log(3 > 2 > 1);
console.log('10' < '9');
console.log(10 < '9');`,
        },
        {
          lang: 'js',
          title: 'Snippet 4',
          source: `console.log(Boolean('0'), Boolean(''), Boolean([]), Boolean({}));
console.log(!!NaN, !!-0, !!'false');`,
        },
        {
          lang: 'js',
          title: 'Snippet 5',
          source: `const price = {
  valueOf() { return 42; },
  toString() { return 'price'; },
};
console.log(price + 1);
console.log(\`\${price}\`);
console.log(String(price));`,
        },
      ],
      output: "Snippet 1: `12`, `2`, `12`, `2`, an empty line, `[object Object]`. Snippet 2: `0`, `42`, `NaN`, `0 NaN`, `4 5`. Snippet 3: `true`, `false`, `true`, `false`. Snippet 4: `true false true true`, then `false false true`. Snippet 5: `43`, `price`, `price`.",
      questions: [
        { q: 'What does snippet 1 print?', a: "`12`, `2`, `12`, `2`, an empty line, then `[object Object]`. `+` with a string concatenates; `-` and `*` convert to numbers; `true` is `1`; `[]` becomes `''` and `{}` becomes `'[object Object]'`." },
        { q: 'What does snippet 2 print?', a: "`0`, `42`, `NaN`, `0 NaN`, `4 5`. Empty and space-padded numeric strings convert cleanly, `'4px'` does not. `null` is `0` but `undefined` is `NaN`. `parseInt` reads leading digits, and `0.0000005` becomes the string `'5e-7'`, so it reads `5`." },
        { q: 'What does snippet 3 print?', a: "`true`, `false`, `true`, `false`. Comparisons run left to right: `3 > 2` is `true`, and `true > 1` is `1 > 1`, which is false. Two strings compare by character, so `'10' < '9'`; a number and a string compare as numbers." },
        { q: 'What does snippet 4 print?', a: "`true false true true`, then `false false true`. Only `''`, `0`, `-0`, `0n`, `NaN`, `null`, `undefined` and `false` are falsy. Any non-empty string (even `'0'` or `'false'`), and every array and object, are truthy." },
        { q: 'What does snippet 5 print?', a: "`43`, `price`, `price`. `+` asks for a default primitive, so `valueOf` wins and gives 42. A template literal and `String()` ask for a string, so `toString` wins." },
      ],
      answer30: "Plus is the special one: if either side becomes a string, it concatenates. Minus, times, and divide always convert to numbers. Objects are first turned into primitives with valueOf or toString; arrays join with commas, so an empty array is an empty string. Comparisons between two strings are alphabetical, otherwise numeric. In real code I avoid all this by converting explicitly with Number() or String() at the boundary, like when reading query params.",
      mistakes: [
        "Adding numbers read from inputs or query strings without converting: `'5' + 1` is `'51'`.",
        "Using `parseInt` without a radix or on non-strings. Prefer `Number()` for full-string conversion.",
        "Comparing numeric strings with `<`: `'10' < '9'` is true.",
        "Trap: 'Is `[] + {}` the same as `{} + []`?' When `{}` starts a statement (for example `eval('{} + []')`), it is parsed as an empty block, so what's left is `+[]`, which is `0`. Inside an expression like `console.log({} + [])`, both give `'[object Object]'`.",
      ],
      takeaway: 'String plus anything concatenates; other math converts to numbers; convert explicitly at the edges.',
    },

    {
      id: 'output-equality-nan',
      title: 'Output: equality and NaN',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: '`===` checks type and value, `==` coerces; `NaN` is never equal to itself; objects compare by reference.',
      what: [
        "`===` (strict equality) is true only if both type and value match. `==` (loose equality) converts types first using a set of rules, which gives surprising results.",
        "`NaN` is not equal to anything, including itself. Use `Number.isNaN(x)` to test for it. Objects and arrays are compared by reference: two separate objects are never equal, even with the same contents.",
      ],
      deeper: [
        "The `==` rules: `null == undefined` is true and neither equals anything else. Booleans are converted to numbers first. A string compared with a number becomes a number. An object compared with a primitive is converted to a primitive. That is why `[] == false`: `false` becomes `0`, `[]` becomes `''`, then `0`.",
        "Relational operators (`>=`) don't follow the `==` null rule: `null >= 0` converts `null` to `0`, so it is true, while `null == 0` is false.",
        "`Object.is` is like `===` except `Object.is(NaN, NaN)` is true and `Object.is(0, -0)` is false. `includes` uses that same NaN-aware comparison (SameValueZero), while `indexOf` uses `===`, so `indexOf(NaN)` is always -1.",
      ],
      why: "Equality questions test whether you know why teams ban `==`, and the NaN/reference cases cause real bugs in filters, dedup logic and React dependency arrays.",
      analogy: "`===` is a passport check: same person, same document. `==` is a bouncer who squints and lets close-enough in. `NaN` is the guest who doesn't recognise themselves in the mirror.",
      code: [
        {
          lang: 'js',
          title: 'Snippet 1',
          source: `console.log(0 == '');
console.log(0 == '0');
console.log('' == '0');
console.log(null == undefined, null === undefined);
console.log(null == 0, null >= 0);`,
        },
        {
          lang: 'js',
          title: 'Snippet 2',
          source: `console.log(NaN === NaN);
console.log(Number.isNaN(NaN), isNaN('hello'), Number.isNaN('hello'));
console.log([NaN].includes(NaN), [NaN].indexOf(NaN));
console.log(Object.is(NaN, NaN), Object.is(0, -0), 0 === -0);`,
        },
        {
          lang: 'js',
          title: 'Snippet 3',
          source: `console.log([] == false);
console.log([] == ![]);
console.log([0] == false);
console.log([1, 2] == '1,2');`,
        },
        {
          lang: 'js',
          title: 'Snippet 4',
          source: `console.log({} === {});
const a = { id: 1 };
const b = a;
console.log(a === b);
console.log([1, 2] === [1, 2]);
console.log(0.1 + 0.2 === 0.3, 0.1 + 0.2);`,
        },
      ],
      output: "Snippet 1: `true`, `true`, `false`, `true false`, `false true`. Snippet 2: `false`, `true true false`, `true -1`, `true false true`. Snippet 3: `true` four times. Snippet 4: `false`, `true`, `false`, `false 0.30000000000000004`.",
      questions: [
        { q: 'What does snippet 1 print?', a: "`true`, `true`, `false`, `true false`, `false true`. Strings compared with numbers become numbers, but two strings compare as strings. `null` only loosely equals `undefined`, yet `>=` converts `null` to `0`." },
        { q: 'What does snippet 2 print?', a: "`false`, `true true false`, `true -1`, `true false true`. NaN never equals itself. Global `isNaN` coerces first, `Number.isNaN` doesn't. `includes` finds NaN, `indexOf` can't. `Object.is` treats NaN as equal and separates 0 from -0." },
        { q: 'What does snippet 3 print?', a: "`true` four times. `false` becomes `0` and arrays become strings (`''`, `'0'`, `'1,2'`). In `[] == ![]`, `![]` is `false` because arrays are truthy, so it is `'' == 0`, which is true." },
        { q: 'What does snippet 4 print?', a: "`false`, `true`, `false`, `false 0.30000000000000004`. Objects and arrays compare by reference. Floating point can't represent 0.1 and 0.2 exactly, so compare with a tolerance like `Math.abs(x - y) < Number.EPSILON`." },
      ],
      answer30: "I use triple equals everywhere because double equals coerces types with rules nobody remembers, like an empty array equalling false. The one exception some teams allow is x == null, which catches both null and undefined. NaN isn't equal to itself, so I use Number.isNaN. Objects and arrays are compared by reference, not content, so two identical-looking objects are not equal, which matters for React dependencies and dedup logic.",
      mistakes: [
        "Checking `x === NaN`. It is always false; use `Number.isNaN(x)`.",
        "Using global `isNaN('hello')`, which coerces and returns true for any non-numeric string.",
        "Comparing arrays or objects with `===` and expecting a content comparison.",
        "Trap: '`null >= 0` is true and `null == 0` is false. Why?' Relational operators convert `null` to `0`; `==` has a special rule that `null` only equals `undefined`.",
      ],
      takeaway: 'Use `===`, test NaN with `Number.isNaN`, and remember objects compare by reference.',
    },

    {
      id: 'output-references-copying',
      title: 'Output: object references and copying',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Variables hold references to objects; spread copies one level; `structuredClone` copies deeply; `const` and `freeze` are shallow.',
      what: [
        "Primitives (numbers, strings, booleans) are copied by value. Objects and arrays are not: a variable holds a reference (an address), and `b = a` copies the address, so both names point at the same object.",
        "Changing a property through one name is visible through the other. Reassigning one name to a new object breaks the link without touching the original.",
      ],
      deeper: [
        "JavaScript passes arguments by value, but for objects that value is the reference. A function can mutate the caller's object, but reassigning the parameter does nothing to the caller.",
        "Spread `{ ...obj }` and `Object.assign` make a shallow copy: nested objects are still shared. `structuredClone` makes a deep copy and keeps `Date`, `Map`, `Set` and cycles, but throws a `DataCloneError` on functions. `JSON.parse(JSON.stringify(x))` drops `undefined` and functions, turns Dates into strings and Maps/Sets into `{}`.",
        "`Object.freeze` is shallow too: nested objects stay writable. Writing to a frozen property silently fails in sloppy mode and throws a `TypeError` in strict mode.",
      ],
      why: "Accidental shared references cause some of the most common bugs in React state and Redux reducers, and in Node when a shared config or cache object is mutated.",
      analogy: "An object is a house; a variable holds its address on a note. Copying the note doesn't build a new house. A shallow copy builds a new house but shares the same garden shed (nested objects).",
      code: [
        {
          lang: 'js',
          title: 'Snippet 1',
          source: `const a = { n: 1 };
const b = a;
b.n = 2;
console.log(a.n);
let c = a;
c = { n: 3 };
console.log(a.n);`,
        },
        {
          lang: 'js',
          title: 'Snippet 2',
          source: `function mutate(obj) { obj.n = 10; }
function reassign(obj) { obj = { n: 20 }; }
const o = { n: 1 };
mutate(o);
reassign(o);
console.log(o.n);`,
        },
        {
          lang: 'js',
          title: 'Snippet 3',
          source: `const original = { name: 'Asha', address: { city: 'Kochi' } };
const copy = { ...original };
copy.name = 'Ravi';
copy.address.city = 'Pune';
console.log(original.name, original.address.city);`,
        },
        {
          lang: 'js',
          title: 'Snippet 4',
          source: `const data = { when: new Date(0), tags: new Set(['a']), skip: undefined };
console.log(JSON.parse(JSON.stringify(data)));
const clone = structuredClone(data);
console.log(clone.when instanceof Date, clone.tags.has('a'), clone.tags === data.tags);
try {
  structuredClone({ fn: () => 1 });
} catch (err) {
  console.log(err.name);
}`,
        },
        {
          lang: 'js',
          title: 'Snippet 5',
          source: `const config = Object.freeze({ port: 3000, db: { host: 'localhost' } });
try {
  config.port = 8080;
} catch (err) {
  console.log(err.name);
}
config.db.host = 'prod';
console.log(config.port, config.db.host);`,
        },
      ],
      output: "Snippet 1: `2`, `2`. Snippet 2: `10`. Snippet 3: `Asha Pune`. Snippet 4: `{ when: '1970-01-01T00:00:00.000Z', tags: {} }`, `true true false`, `DataCloneError`. Snippet 5: `TypeError`, `3000 prod`.",
      questions: [
        { q: 'What does snippet 1 print?', a: "`2`, then `2`. `b` points at the same object as `a`, so `b.n = 2` changes it. `c = { n: 3 }` only points `c` at a new object; `a` is untouched." },
        { q: 'What does snippet 2 print?', a: "`10`. The function gets a copy of the reference, so mutating `obj.n` changes the caller's object, but reassigning `obj` only changes the local parameter." },
        { q: 'What does snippet 3 print?', a: "`Asha Pune`. Spread copies the top level, so `name` is independent, but `address` is the same nested object in both, so the city change leaks into `original`." },
        { q: 'What does snippet 4 print?', a: "`{ when: '1970-01-01T00:00:00.000Z', tags: {} }`, then `true true false`, then `DataCloneError`. JSON turns the Date into a string, the Set into `{}`, and drops `undefined`. `structuredClone` keeps Date and Set as new copies but cannot clone functions." },
        { q: 'What does snippet 5 print?', a: "`TypeError`, then `3000 prod`. In strict mode writing to a frozen property throws (in sloppy mode it silently fails). `freeze` is shallow, so the nested `db` object can still change." },
      ],
      answer30: "Objects are held by reference, so assigning one variable to another shares the same object, and functions can mutate objects passed to them, though reassigning a parameter doesn't affect the caller. Spread and Object.assign are shallow copies, so nested objects are still shared. For a real deep copy I use structuredClone, which handles Dates, Maps, Sets, and cycles, but not functions. JSON stringify and parse is lossy. Object.freeze and const are both shallow.",
      mistakes: [
        "Treating `{ ...state }` as a deep copy and then mutating nested state in React.",
        "Using `JSON.parse(JSON.stringify(x))` on data with Dates, Maps, `undefined` or functions.",
        "Thinking `const` makes an object immutable. It only blocks reassigning the variable.",
        "Trap: 'Is JavaScript pass-by-reference?' No. It is pass-by-value, where the value of an object variable is a reference. That's why reassigning a parameter doesn't affect the caller.",
      ],
      takeaway: 'Assignment shares, spread copies one level, structuredClone copies deep, freeze is shallow.',
    },

    {
      id: 'output-array-gotchas',
      title: 'Output: array method gotchas',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: '`map(parseInt)`, default `sort`, `length` tricks, holes, and `fill` with a shared object.',
      what: [
        "Array methods have a few traps that interviewers love. `map` passes three arguments (value, index, array), so passing a function that takes a second parameter can break. `sort()` with no comparator sorts as strings and changes the original array.",
        "Arrays can have holes (empty slots). Setting `length` truncates or extends an array, and `delete arr[i]` leaves a hole instead of removing the item.",
      ],
      deeper: [
        "`parseInt(string, radix)` treats the index from `map` as a radix. Radix 0 means 'guess', radix 1 is invalid, and `'3'` is not a digit in base 2, so `['1','2','3'].map(parseInt)` is `[1, NaN, NaN]`.",
        "`sort`, `reverse` and `splice` mutate. ES2023 added non-mutating versions: `toSorted`, `toReversed`, `toSpliced` and `with` (Node 20+, modern browsers). `fill(obj)` puts the same object reference in every slot. `reduce` with no initial value on an empty array throws a `TypeError`. `forEach` always returns `undefined` and doesn't wait for async callbacks.",
      ],
      why: "These are everyday bugs: sorting numbers as strings, mutating React state with `sort()`, and a grid built with `fill([])` where every row is the same array.",
      analogy: "`fill([])` is like giving every student a photocopy of the same locker key. They all open one locker.",
      code: [
        {
          lang: 'js',
          title: 'Snippet 1',
          source: `console.log(['1', '2', '3'].map(parseInt));
console.log(['1', '2', '3'].map(Number));`,
        },
        {
          lang: 'js',
          title: 'Snippet 2',
          source: `console.log([10, 1, 5, 100].sort());
console.log([10, 1, 5, 100].sort((a, b) => a - b));
const nums = [3, 1, 2];
const sorted = nums.sort();
console.log(nums === sorted, nums);
const fresh = [3, 1, 2];
console.log(fresh.toSorted(), fresh);`,
        },
        {
          lang: 'js',
          title: 'Snippet 3',
          source: `const arr = [1, 2, 3];
arr.length = 1;
console.log(arr);
const holes = [1, , 3];
console.log(holes.length, holes.map((x) => x * 2));
const big = [];
big[5] = 'x';
console.log(big.length);`,
        },
        {
          lang: 'js',
          title: 'Snippet 4',
          source: `console.log([].reduce((a, b) => a + b, 0));
try {
  [].reduce((a, b) => a + b);
} catch (err) {
  console.log(err.name);
}
console.log([1, 2, 3].forEach((x) => x * 2));
console.log(Array(3).fill([]).map((row, i) => { row.push(i); return row.length; }));`,
        },
        {
          lang: 'js',
          title: 'Snippet 5',
          source: `const list = ['a', 'b', 'c'];
delete list[1];
console.log(list, list.length);
console.log([1, 2, 3].includes('2'));
console.log([1, [2, [3, [4]]]].flat(), [1, [2, [3, [4]]]].flat(Infinity));`,
        },
      ],
      output: "Snippet 1: `[ 1, NaN, NaN ]`, `[ 1, 2, 3 ]`. Snippet 2: `[ 1, 10, 100, 5 ]`, `[ 1, 5, 10, 100 ]`, `true [ 1, 2, 3 ]`, `[ 1, 2, 3 ] [ 3, 1, 2 ]`. Snippet 3: `[ 1 ]`, `3 [ 2, <1 empty item>, 6 ]`, `6`. Snippet 4: `0`, `TypeError`, `undefined`, `[ 1, 2, 3 ]`. Snippet 5: `[ 'a', <1 empty item>, 'c' ] 3`, `false`, `[ 1, 2, [ 3, [ 4 ] ] ] [ 1, 2, 3, 4 ]`.",
      questions: [
        { q: 'What does snippet 1 print?', a: "`[ 1, NaN, NaN ]`, then `[ 1, 2, 3 ]`. `map` passes the index as `parseInt`'s radix: `parseInt('2', 1)` is invalid and `'3'` isn't a base-2 digit. `Number` takes only one argument, so it works." },
        { q: 'What does snippet 2 print?', a: "`[ 1, 10, 100, 5 ]`, `[ 1, 5, 10, 100 ]`, `true [ 1, 2, 3 ]`, `[ 1, 2, 3 ] [ 3, 1, 2 ]`. Default `sort` compares strings. `sort` mutates and returns the same array; `toSorted` returns a new one and leaves the original alone." },
        { q: 'What does snippet 3 print in Node?', a: "`[ 1 ]`, then `3 [ 2, <1 empty item>, 6 ]`, then `6`. Setting `length` truncates. `map` skips holes and keeps them. Assigning index 5 makes `length` 6 with five empty slots." },
        { q: 'What does snippet 4 print?', a: "`0`, `TypeError`, `undefined`, `[ 1, 2, 3 ]`. `reduce` on an empty array needs an initial value. `forEach` always returns `undefined`. `fill([])` puts the same array in every slot, so each push grows that one shared array." },
        { q: 'What does snippet 5 print in Node?', a: "`[ 'a', <1 empty item>, 'c' ] 3`, then `false`, then `[ 1, 2, [ 3, [ 4 ] ] ] [ 1, 2, 3, 4 ]`. `delete` leaves a hole and keeps the length (use `splice` to remove). `includes` uses strict comparison. `flat()` goes one level deep by default." },
      ],
      answer30: "The usual array traps: map passes value, index, and array, so map(parseInt) misuses the index as a radix. sort with no comparator sorts as strings and mutates the original, so for numbers I pass a minus b, and for React state I use toSorted or copy first. delete leaves a hole, so I use splice or filter. fill with an object shares one reference, so for a 2D grid I use Array.from with a factory. And reduce on a possibly empty array needs an initial value.",
      mistakes: [
        "Calling `items.sort()` on React state or props, which mutates them in place.",
        "Building a grid with `Array(n).fill([])`. Use `Array.from({ length: n }, () => [])`.",
        "Using `forEach` with an `async` callback and expecting it to wait. Use `for...of` with `await`, or `Promise.all(arr.map(...))`.",
        "Trap: 'How do you sort strings with accents or mixed case properly?' Use `a.localeCompare(b)` or `Intl.Collator` in the comparator.",
      ],
      takeaway: 'Pass a comparator to sort, never pass parseInt straight to map, and remember which methods mutate.',
    },

    {
      id: 'output-scope-shadowing',
      title: 'Output: scope and shadowing',
      level: 'basic',
      priority: 'good',
      frequency: 'common',
      summary: 'Scope is decided by where code is written (lexical), inner names shadow outer ones, and `var` ignores blocks.',
      what: [
        "Scope is where a variable can be seen. JavaScript uses lexical scope: a function sees the variables of the place where it was written, not the place where it is called.",
        "Shadowing is when an inner scope declares a variable with the same name as an outer one. Inside, the inner one wins; the outer one is untouched.",
      ],
      deeper: [
        "`let` and `const` are block-scoped: a `{ }` block makes a new scope. `var` is function-scoped, so a `var` inside a block is the same variable as a `var` of that name outside the block (in the same function).",
        "Assigning to an undeclared name creates an accidental global in sloppy mode, but throws a `ReferenceError` in strict mode (ES modules, classes, `'use strict'`). Function parameters are local variables too, so changing a primitive parameter doesn't change the caller's variable.",
      ],
      why: "Scope puzzles check that you can trace which variable a line refers to. That same skill is what you use to debug closures, stale values and naming collisions.",
      analogy: "Lexical scope is your home address: a function always looks for things in the house where it was built, even when it is visiting someone else. Shadowing is having a sibling with the same name as your cousin: inside your house, the name means your sibling.",
      code: [
        {
          lang: 'js',
          title: 'Snippet 1',
          source: `let name = 'global';
function outer() {
  let name = 'outer';
  function inner() {
    console.log(name);
  }
  return inner;
}
outer()();`,
        },
        {
          lang: 'js',
          title: 'Snippet 2',
          source: `const value = 'module';
function read() {
  return value;
}
function caller() {
  const value = 'caller';
  return read();
}
console.log(caller());`,
        },
        {
          lang: 'js',
          title: 'Snippet 3',
          source: `var x = 'var outer';
let y = 'let outer';
{
  var x = 'var inner';
  let y = 'let inner';
}
console.log(x, '|', y);`,
        },
        {
          lang: 'js',
          title: 'Snippet 4',
          source: `function leak() {
  try {
    oops = 5;
    console.log('created a global');
  } catch (err) {
    console.log(err.name);
  }
}
leak();`,
        },
        {
          lang: 'js',
          title: 'Snippet 5',
          source: `let count = 1;
function bump(count) {
  count = count + 10;
  return count;
}
console.log(bump(count), count);`,
        },
      ],
      output: "Snippet 1: `outer`. Snippet 2: `module`. Snippet 3: `var inner | let outer`. Snippet 4: `ReferenceError` (strict mode). Snippet 5: `11 1`.",
      questions: [
        { q: 'What does snippet 1 print?', a: "`outer`. `inner` was written inside `outer`, so it sees `outer`'s `name`, which shadows the global one. It still works after `outer` returns because of the closure." },
        { q: 'What does snippet 2 print?', a: "`module`. Scope is lexical: `read` was written at the top level, so it sees the top-level `value`, not the one inside `caller`, even though `caller` calls it." },
        { q: 'What does snippet 3 print?', a: "`var inner | let outer`. `var` ignores blocks, so the inner `var x` is the same variable and overwrites it. `let y` inside the block is a separate variable that disappears after the block." },
        { q: 'What does snippet 4 print?', a: "`ReferenceError` in strict mode (ES modules, classes). In a sloppy script it prints `created a global`, because assigning to an undeclared name silently creates a global variable." },
        { q: 'What does snippet 5 print?', a: "`11 1`. The parameter `count` shadows the outer `count` and is a local copy of the number, so changing it doesn't affect the outer variable." },
      ],
      answer30: "JavaScript scope is lexical: a function looks up variables based on where it's written, not where it's called. When an inner scope declares the same name, it shadows the outer one inside that scope. let and const are block-scoped while var is function-scoped, so a var inside an if block leaks out. In strict mode, assigning to an undeclared variable throws instead of creating a global, which is one reason I always use modules or strict mode.",
      mistakes: [
        "Assuming a function sees the variables of whoever calls it (that would be dynamic scope).",
        "Declaring `var` inside a block and expecting it to stay there.",
        "Forgetting a `let`/`const` and creating an accidental global in sloppy scripts.",
        "Trap: 'Can you redeclare a `let` with `var` in the same scope?' No, that's a `SyntaxError`, and the whole file fails to run.",
      ],
      takeaway: 'Look up names where the code is written; inner names win; var ignores blocks.',
    },

    {
      id: 'output-prototypes',
      title: 'Output: prototypes and classes',
      level: 'advanced',
      priority: 'good',
      frequency: 'common',
      summary: 'Property lookup walks the prototype chain; shared prototype data is shared by every instance; classes are sugar over prototypes.',
      what: [
        "Every object has a hidden link to another object, its prototype. When you read a property that the object doesn't have, JavaScript looks on the prototype, then the prototype's prototype, until it reaches `null`. That path is the prototype chain.",
        "`new Fn()` creates an object whose prototype is `Fn.prototype`. Methods are put on the prototype so all instances share one copy. `class` syntax does the same thing with nicer syntax.",
      ],
      deeper: [
        "Reading walks the chain, but writing does not: `obj.x = 1` always creates or updates an own property on `obj`, shadowing the prototype's `x`. Mutating a shared object found on the prototype (like `this.list.push()`) changes it for every instance, because nothing new is created.",
        "`instanceof` checks whether `Fn.prototype` is anywhere in the object's chain right now. Replacing `Fn.prototype` with a new object later breaks `instanceof` for old instances. `class B extends A` links both `B.prototype` to `A.prototype` (for methods) and `B` to `A` (for static methods). `Object.create(null)` makes an object with no prototype at all, which is useful for safe dictionaries.",
      ],
      why: "Prototype questions check whether you understand what `class` really does. They also explain bugs where an array or object defined on a prototype or as a shared default leaks state between instances.",
      analogy: "The prototype chain is asking your parent, then your grandparent, for something you don't have. But when you buy something new, you put it in your own room, not theirs.",
      code: [
        {
          lang: 'js',
          title: 'Snippet 1',
          source: `function Dog(name) {
  this.name = name;
}
Dog.prototype.speak = function () {
  return this.name + ' barks';
};
const d = new Dog('Rex');
console.log(d.speak());
console.log(Object.getPrototypeOf(d) === Dog.prototype, Object.hasOwn(d, 'speak'));`,
        },
        {
          lang: 'js',
          title: 'Snippet 2',
          source: `function Team() {}
Team.prototype.members = [];
const t1 = new Team();
const t2 = new Team();
t1.members.push('Asha');
console.log(t2.members);
t1.members = ['Ravi'];
console.log(t1.members, t2.members);`,
        },
        {
          lang: 'js',
          title: 'Snippet 3',
          source: `class Animal {
  constructor(name) { this.name = name; }
  speak() { return this.name + ' makes a sound'; }
}
class Cat extends Animal {
  speak() { return super.speak() + ' (meow)'; }
}
const c = new Cat('Tom');
console.log(c.speak());
console.log(c instanceof Animal, typeof Cat, Object.getPrototypeOf(Cat) === Animal);`,
        },
        {
          lang: 'js',
          title: 'Snippet 4',
          source: `function User() {}
const before = new User();
User.prototype.hello = () => 'hi';
console.log(before.hello());
User.prototype = { bye: () => 'bye' };
const after = new User();
console.log(typeof before.bye, after.bye(), before instanceof User);`,
        },
        {
          lang: 'js',
          title: 'Snippet 5',
          source: `const plain = {};
const bare = Object.create(null);
console.log(typeof plain.toString, typeof bare.toString);
console.log(Object.getPrototypeOf(Object.prototype));`,
        },
      ],
      output: "Snippet 1: `Rex barks`, `true false`. Snippet 2: `[ 'Asha' ]`, `[ 'Ravi' ] [ 'Asha' ]`. Snippet 3: `Tom makes a sound (meow)`, `true function true`. Snippet 4: `hi`, `undefined bye false`. Snippet 5: `function undefined`, `null`.",
      questions: [
        { q: 'What does snippet 1 print?', a: "`Rex barks`, then `true false`. `speak` lives on `Dog.prototype`, not on `d` itself, and `d` finds it through its prototype link." },
        { q: 'What does snippet 2 print?', a: "`[ 'Asha' ]`, then `[ 'Ravi' ] [ 'Asha' ]`. `push` mutates the one array on the prototype, which every instance shares. Assigning `t1.members` creates an own property on `t1` that shadows the prototype's array." },
        { q: 'What does snippet 3 print?', a: "`Tom makes a sound (meow)`, then `true function true`. `super.speak()` calls the parent method with the same `this`. A class is a function, and `extends` also links `Cat` to `Animal` so static members are inherited." },
        { q: 'What does snippet 4 print?', a: "`hi`, then `undefined bye false`. Adding a method to the existing prototype object reaches old instances. Replacing `User.prototype` with a new object doesn't: `before` still points at the old one, so it isn't an `instanceof User` any more." },
        { q: 'What does snippet 5 print?', a: "`function undefined`, then `null`. A normal object inherits `toString` from `Object.prototype`; `Object.create(null)` has no prototype at all. `Object.prototype` is the end of the chain, so its prototype is `null`." },
      ],
      answer30: "Every object links to a prototype. When a property isn't found on the object, JavaScript walks up that chain until it reaches null. Constructor functions and classes put methods on the prototype so all instances share one copy; class is mostly syntax sugar over that. Reads walk the chain but writes create own properties. The classic bug is putting a mutable array on the prototype, where every instance ends up sharing it.",
      mistakes: [
        "Putting mutable data (arrays, objects) on a prototype or as a class's shared static, then mutating it per instance.",
        "Using `obj.hasOwnProperty(k)` on objects that may have no prototype. Prefer `Object.hasOwn(obj, k)`.",
        "Thinking `class` creates a new kind of inheritance. It's the same prototype chain.",
        "Trap: 'What's the difference between `__proto__` and `prototype`?' `prototype` is a property of constructor functions; `__proto__` (better: `Object.getPrototypeOf`) is the actual link every object has to its prototype.",
      ],
      takeaway: 'Reads walk the chain, writes stay on the object, and shared prototype data is shared by everyone.',
    },

    {
      id: 'output-destructuring-getters',
      title: 'Output: destructuring defaults and getters',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Defaults kick in only for `undefined`, destructuring `null` throws, getters run on every read, and spread copies the getter\'s value.',
      what: [
        "A destructuring default (`const { a = 10 } = obj`) is used only when the value is `undefined`. `null`, `0` and `''` are real values, so the default is skipped. Default function parameters follow the same rule.",
        "A getter (`get total() {}`) looks like a property but runs a function each time you read it.",
      ],
      deeper: [
        "Destructuring `null` or `undefined` throws a `TypeError`. That's why `function f({ a } = {})` is a common pattern: the `= {}` covers a missing argument, but an explicit `null` still throws.",
        "Default parameter expressions are evaluated at call time, each time the default is needed, not once when the function is defined. Spread (`{ ...obj }`) reads each getter once and stores the result as a plain data property, so the copy has no getter.",
      ],
      why: "These rules show up in real React props and API handlers: `null` from the database skipping your default, or destructuring a missing request body crashing the handler.",
      analogy: "A default is a spare key under the mat: you only use it when the key is missing (`undefined`), not when someone left a broken key (`null`). A getter is a vending machine: every press runs the machine again. Spreading it takes one snack out, and the copy is just the snack.",
      code: [
        {
          lang: 'js',
          title: 'Snippet 1',
          source: `const { a = 10, b = 20, c = 30 } = { a: undefined, b: null };
console.log(a, b, c);`,
        },
        {
          lang: 'js',
          title: 'Snippet 2',
          source: `function greet({ name = 'Guest', role = 'User' } = {}) {
  return name + ' (' + role + ')';
}
console.log(greet());
console.log(greet({ name: 'Asha' }));
try {
  greet(null);
} catch (err) {
  console.log(err.name);
}`,
        },
        {
          lang: 'js',
          title: 'Snippet 3',
          source: `let calls = 0;
const stats = {
  values: [1, 2, 3],
  get total() {
    calls++;
    return this.values.reduce((sum, v) => sum + v, 0);
  },
};
stats.values.push(4);
console.log(stats.total, stats.total, calls);
const copy = { ...stats };
stats.values.push(5);
console.log(copy.total, stats.total, Object.getOwnPropertyDescriptor(copy, 'total').get);`,
        },
        {
          lang: 'js',
          title: 'Snippet 4',
          source: `let x = 1;
let y = 2;
[x, y] = [y, x];
console.log(x, y);
const [first, , third = 'none', ...rest] = ['a', 'b'];
console.log(first, third, rest);
const { user: { id } = { id: 'anon' } } = {};
console.log(id);`,
        },
        {
          lang: 'js',
          title: 'Snippet 5',
          source: `let n = 0;
function next(value = ++n) {
  return value;
}
console.log(next(), next(), next(undefined), next(null), n);`,
        },
      ],
      output: "Snippet 1: `10 null 30`. Snippet 2: `Guest (User)`, `Asha (User)`, `TypeError`. Snippet 3: `10 10 2`, `10 15 undefined`. Snippet 4: `2 1`, `a none []`, `anon`. Snippet 5: `1 2 3 null 3`.",
      questions: [
        { q: 'What does snippet 1 print?', a: "`10 null 30`. Defaults apply only to `undefined`: `a` is explicitly `undefined` and `c` is missing, so both get defaults, but `null` is kept." },
        { q: 'What does snippet 2 print?', a: "`Guest (User)`, `Asha (User)`, `TypeError`. The `= {}` default covers a missing argument, and inner defaults fill missing fields. `null` is not `undefined`, so the `= {}` default is skipped and destructuring `null` throws." },
        { q: 'What does snippet 3 print?', a: "`10 10 2`, then `10 15 undefined`. The getter runs on every read. Spread reads it once (value 10) and stores a plain property, so `copy.total` stays 10 and has no getter, while `stats.total` recomputes to 15." },
        { q: 'What does snippet 4 print?', a: "`2 1`, `a none []`, `anon`. Array destructuring swaps without a temp variable. A missing third item uses its default and rest collects nothing. The nested default object is used because `user` is `undefined`." },
        { q: 'What does snippet 5 print?', a: "`1 2 3 null 3`. The default expression runs on each call that needs it, so `++n` runs for the three calls with no value or `undefined`. `null` is a real value, so the default is skipped and `n` stays 3." },
      ],
      answer30: "Destructuring and parameter defaults only apply when the value is undefined; null, zero, and empty string are kept. Destructuring null or undefined itself throws, so for an options object I write = {} as the parameter default. Default expressions are evaluated fresh on every call. Getters run every time they're read, and spreading an object with a getter copies the current value, not the getter.",
      mistakes: [
        "Expecting a default to replace `null` from an API or database. Use `?? fallback` when `null` should also fall back.",
        "Destructuring a request body or props object that may be missing, without a `= {}` default.",
        "Doing expensive work in a getter that is read in a loop or on every render.",
        "Trap: 'What's the difference between `a || b` and `a ?? b`?' `||` falls back on any falsy value (including `0` and `''`); `??` only on `null` or `undefined`.",
      ],
      takeaway: 'Defaults only fire for undefined; getters run on every read; spread freezes their value.',
    },

    {
      id: 'implement-debounce-throttle-once-memoize',
      title: 'Implement: debounce, throttle, once, memoize',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Four small higher-order functions built on closures and timers that you should be able to write from memory.',
      what: [
        "Each of these takes a function and returns a new wrapped function. A closure keeps private state between calls: a timer id, a timestamp, a flag, or a cache.",
        "**debounce** waits until calls stop for `wait` ms, then runs once with the last arguments (search boxes). **throttle** runs at most once every `wait` ms (scroll, resize). **once** runs the function the first time and returns the cached result after that. **memoize** caches results by arguments.",
      ],
      deeper: [
        "Use a regular `function` for the wrapper and call `fn.apply(this, args)` so the wrapped function keeps the caller's `this` (it matters when the result is used as an object method).",
        "Common follow-ups: add `cancel()` to debounce, a `leading` option (fire on the first call, then ignore until quiet), or trailing calls for throttle so the last event isn't lost. For memoize, the key function matters: `JSON.stringify(args)` is fine for primitives but slow for big objects; a `Map` with one argument as key, or a `WeakMap` for object keys, avoids that. Unbounded caches leak memory, so mention an LRU limit.",
      ],
      why: "Debounce and throttle are the most commonly requested hand-written functions in frontend rounds, and memoize/once show you understand closures and caching.",
      analogy: "Debounce is a lift that waits until people stop walking in before closing its doors. Throttle is a turnstile that lets one person through per second no matter how many push.",
      code: [
        {
          lang: 'js',
          title: 'debounce and throttle',
          source: `function debounce(fn, wait) {
  let timer;
  function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  }
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}

function throttle(fn, wait) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    }
  };
}

const search = debounce((q) => console.log('search:', q), 50);
search('r');
search('re');
search('react'); // only this one runs, 50ms after the last call

const onScroll = throttle((i) => console.log('scroll handled:', i), 1000);
for (let i = 1; i <= 5; i++) onScroll(i); // only the first runs inside the 1s window`,
        },
        {
          lang: 'js',
          title: 'once and memoize',
          source: `function once(fn) {
  let called = false;
  let result;
  return function (...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}

function memoize(fn, keyFn = (...args) => JSON.stringify(args)) {
  const cache = new Map();
  return function (...args) {
    const key = keyFn(...args);
    if (cache.has(key)) return cache.get(key);
    const value = fn.apply(this, args);
    cache.set(key, value);
    return value;
  };
}

const init = once(() => {
  console.log('connecting...');
  return 'db';
});
console.log(init(), init());

let work = 0;
const slowSquare = memoize((n) => {
  work++;
  return n * n;
});
console.log(slowSquare(4), slowSquare(4), slowSquare(5), 'computed', work, 'times');`,
        },
      ],
      output: "Block 1 prints `scroll handled: 1` right away, then about 50ms later `search: react`. Block 2 prints `connecting...`, then `db db`, then `16 16 25 computed 2 times`.",
      questions: [
        { q: 'What is the difference between debounce and throttle?', a: "Debounce waits for a pause and runs once after the calls stop, which suits search inputs and autosave. Throttle runs at most once per interval while calls keep coming, which suits scroll, resize and mouse-move handlers." },
        { q: 'Why use `fn.apply(this, args)` instead of `fn(...args)`?', a: "So the wrapped function gets the same `this` the wrapper was called with. If you debounce an object method, `fn(...args)` would lose the object." },
        { q: 'How would you add a leading-edge option to debounce?', a: "Fire immediately if no timer is pending, then start the timer; further calls only reset the timer and don't fire. When the timer ends, clear it so the next call fires immediately again." },
        { q: 'What are the risks of memoize?', a: "The cache grows forever unless you cap it (for example with an LRU), and the key function must uniquely represent the arguments. It only makes sense for pure functions: same inputs, same output, no side effects." },
        { q: 'How do you use debounce correctly in React?', a: "Create the debounced function once with `useMemo` or `useRef`, not on every render, otherwise each render gets a new timer and nothing is debounced. Cancel it in the effect cleanup on unmount." },
      ],
      answer30: "All four are higher-order functions that keep private state in a closure. Debounce clears and resets a timer on every call, so it only runs after the calls stop. Throttle stores the last run time and skips calls inside the window. Once keeps a flag and the first result. Memoize keeps a Map from a key built from the arguments to the result. I use apply with this so methods still work, and I mention cancel, leading/trailing options, and cache limits as follow-ups.",
      mistakes: [
        "Creating a new debounced function on every React render, so it never actually debounces.",
        "Using an arrow function as the wrapper and losing the caller's `this`.",
        "Memoizing impure functions (ones that read time, random values or external state).",
        "Trap: 'Your throttle drops the last call. Is that a problem?' For scroll position it can be: the final position is never handled. Add a trailing call with a timer that fires with the latest arguments at the end of the window.",
      ],
      takeaway: 'Debounce waits for quiet, throttle limits the rate, once caches the first result, memoize caches by arguments.',
    },

    {
      id: 'implement-deep-clone-flatten-curry',
      title: 'Implement: deep clone, flatten, curry',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Recursive deep clone with cycle handling, array flatten with a depth, and curry using `fn.length`.',
      what: [
        "**Deep clone** copies an object and everything inside it, so the copy shares nothing with the original. **Flatten** turns nested arrays into one flat array, optionally only up to a certain depth. **Curry** turns `f(a, b, c)` into `f(a)(b)(c)`, also allowing `f(a, b)(c)`.",
        "All three are recursion questions in disguise. Say your base case out loud first.",
      ],
      deeper: [
        "Deep clone: primitives and functions are returned as-is. Use a `WeakMap` of already-copied objects to handle circular references, otherwise you recurse forever. Handle `Date`, `Map`, `Set` and arrays explicitly. In real code, `structuredClone` does all this natively.",
        "Flatten: recursion with `reduce` and a depth counter, or an iterative version with a stack to avoid stack overflows on very deep input. Built-in: `arr.flat(depth)`.",
        "Curry: `fn.length` is the number of declared parameters (not counting defaults or rest params). Collect arguments until you have that many, then call the original. The 'infinite sum' variant `sum(1)(2)(3)()` stops when called with no arguments.",
      ],
      why: "These show you can write clean recursion, think about edge cases (cycles, depth, special objects), and explain closures.",
      analogy: "Deep clone is photocopying a folder, including every page in every sub-folder, and noting which ones you've already copied so a page that refers back doesn't send you in circles.",
      code: [
        {
          lang: 'js',
          title: 'deepClone',
          source: `function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value; // primitives and functions
  if (seen.has(value)) return seen.get(value); // circular reference
  if (value instanceof Date) return new Date(value);
  if (value instanceof Map) {
    const copy = new Map();
    seen.set(value, copy);
    value.forEach((v, k) => copy.set(k, deepClone(v, seen)));
    return copy;
  }
  if (value instanceof Set) {
    const copy = new Set();
    seen.set(value, copy);
    value.forEach((v) => copy.add(deepClone(v, seen)));
    return copy;
  }
  const copy = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value));
  seen.set(value, copy);
  for (const key of Reflect.ownKeys(value)) copy[key] = deepClone(value[key], seen);
  return copy;
}

const original = { user: { name: 'Asha' }, tags: ['a'], at: new Date(0), roles: new Set(['admin']) };
original.self = original; // circular
const clone = deepClone(original);
clone.user.name = 'Ravi';
clone.tags.push('b');
console.log(original.user.name, original.tags);
console.log(clone.self === clone, clone.at instanceof Date, clone.roles.has('admin'));`,
        },
        {
          lang: 'js',
          title: 'flatten',
          source: `function flatten(arr, depth = Infinity) {
  return arr.reduce((acc, item) => {
    if (Array.isArray(item) && depth > 0) acc.push(...flatten(item, depth - 1));
    else acc.push(item);
    return acc;
  }, []);
}

// Iterative version: no recursion, so no stack overflow on very deep input
function flattenIterative(arr) {
  const stack = [...arr];
  const result = [];
  while (stack.length) {
    const item = stack.pop();
    if (Array.isArray(item)) stack.push(...item);
    else result.push(item);
  }
  return result.reverse();
}

const nested = [1, [2, [3, [4]]], 5];
console.log(flatten(nested));
console.log(flatten(nested, 1));
console.log(flattenIterative(nested));`,
        },
        {
          lang: 'js',
          title: 'curry and infinite sum',
          source: `function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args);
    return (...more) => curried.apply(this, [...args, ...more]);
  };
}

const add3 = (a, b, c) => a + b + c;
const curriedAdd = curry(add3);
console.log(curriedAdd(1)(2)(3), curriedAdd(1, 2)(3), curriedAdd(1)(2, 3));

// sum(1)(2)(3)() -> 6: keep collecting until called with no argument
function sum(a) {
  return (b) => (b === undefined ? a : sum(a + b));
}
console.log(sum(1)(2)(3)());`,
        },
      ],
      output: "deepClone prints `Asha [ 'a' ]` then `true true true`: the original is untouched and the cycle is preserved inside the copy. flatten prints `[ 1, 2, 3, 4, 5 ]`, `[ 1, 2, [ 3, [ 4 ] ], 5 ]`, `[ 1, 2, 3, 4, 5 ]`. curry prints `6 6 6` then `6`.",
      questions: [
        { q: 'How does your deep clone handle circular references?', a: "It keeps a `WeakMap` from each original object to its copy. Before copying an object it checks the map; if the object was already copied, it returns that copy instead of recursing forever." },
        { q: 'What does your deep clone not handle, and what would you use in production?', a: "Class instances with private fields, `RegExp`, typed arrays, DOM nodes and so on would need extra cases. In production I'd use `structuredClone`, which handles Dates, Maps, Sets, typed arrays and cycles natively (but not functions)." },
        { q: 'Why might you prefer an iterative flatten?', a: "Recursion uses the call stack, so extremely deep nesting can throw `RangeError: Maximum call stack size exceeded`. A manual stack in a loop has no such limit." },
        { q: 'How does curry know when to call the original function?', a: "It compares the number of collected arguments with `fn.length`, the count of declared parameters. Note that `fn.length` ignores parameters with defaults and rest parameters, so curry doesn't work well with those." },
        { q: 'What is currying useful for in real code?', a: "Creating specialised functions from general ones, like `const logError = log('error')`, or configuring middleware and selectors once and reusing them. It's closely related to partial application." },
      ],
      answer30: "For deep clone, I return primitives directly, handle Dates, Maps, Sets, and arrays, recurse into own keys, and use a WeakMap of seen objects so circular references don't loop forever; in production I'd just use structuredClone. Flatten is reduce plus recursion with a depth counter, or an explicit stack if the nesting can be very deep. Curry collects arguments in a closure until it has fn.length of them, then calls the original.",
      mistakes: [
        "Forgetting the circular reference case in deep clone.",
        "Treating `typeof null === 'object'` as an object and crashing on `null`.",
        "Using `fn.length` on functions with default or rest parameters, where it undercounts.",
        "Trap: 'Is `JSON.parse(JSON.stringify())` a deep clone?' Only for plain JSON data. It loses Dates, `undefined`, functions, Maps, Sets, and throws on circular references.",
      ],
      takeaway: 'State the base case, then handle the edge cases: cycles for clone, depth for flatten, arity for curry.',
    },

    {
      id: 'implement-promise-all-retry-emitter',
      title: 'Implement: Promise.all, retry with backoff, EventEmitter',
      level: 'advanced',
      priority: 'must',
      frequency: 'common',
      summary: 'Promise.all keeps order and fails fast; retry waits longer after each failure; EventEmitter is a map of event names to listener arrays.',
      what: [
        "**Promise.all** takes many promises and resolves with an array of results in the same order, or rejects as soon as any one rejects. **retry with backoff** calls an async function again after a failure, waiting longer each time (100ms, 200ms, 400ms...). **EventEmitter** lets code subscribe to named events with `on` and trigger them with `emit`.",
      ],
      deeper: [
        "Promise.all: store each result by index (not with `push`), count how many are done, resolve when the count reaches the length, and resolve immediately for an empty input. Wrap each item with `Promise.resolve` so plain values work too. Related: `allSettled` never rejects, `race` settles with the first to settle, `any` resolves with the first success.",
        "Retry: cap the number of attempts, use exponential backoff (`base * 2 ** attempt`), and add random jitter so many clients don't retry at the same moment. Only retry errors that can succeed later (timeouts, 5xx, 429), not 400s. Retried operations should be idempotent.",
        "EventEmitter: `once` wraps the listener so it removes itself before running. Copy the listener array before emitting so a listener removing itself doesn't skip the next one. Node's real `EventEmitter` also throws on an `'error'` event with no listener.",
      ],
      why: "These test async control flow, which is everyday work for a Node engineer. Retry with backoff is also a real reliability pattern you can talk about from production.",
      analogy: "Promise.all is a group order: food comes when every dish is ready, in the order you asked, and if one dish fails the whole order is sent back. Backoff is calling a busy friend: wait a minute, then two, then four, instead of redialling non-stop.",
      note: "On your resume: the Octagnt.ai orchestrator description mentions per-step timeouts and retries; retry with backoff is the general pattern behind that. Only claim the exact parts you built.",
      code: [
        {
          lang: 'js',
          title: 'promiseAll',
          source: `function promiseAll(iterable) {
  const items = Array.from(iterable);
  return new Promise((resolve, reject) => {
    const results = new Array(items.length);
    let remaining = items.length;
    if (remaining === 0) return resolve(results);
    items.forEach((item, i) => {
      Promise.resolve(item).then((value) => {
        results[i] = value; // keep input order, not finish order
        remaining -= 1;
        if (remaining === 0) resolve(results);
      }, reject); // first rejection wins
    });
  });
}

const wait = (ms, value) => new Promise((r) => setTimeout(() => r(value), ms));
promiseAll([wait(30, 'slow'), 'plain', wait(10, 'fast')]).then((r) => console.log('ok:', r));
promiseAll([wait(10, 'a'), Promise.reject(new Error('boom'))]).catch((e) => console.log('failed:', e.message));
promiseAll([]).then((r) => console.log('empty:', r));`,
        },
        {
          lang: 'js',
          title: 'retry with exponential backoff',
          source: `const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function retry(fn, { retries = 3, baseMs = 100 } = {}) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn(attempt);
    } catch (err) {
      if (attempt >= retries) throw err; // out of attempts
      const delay = baseMs * 2 ** attempt + Math.random() * baseMs; // backoff + jitter
      console.log('attempt ' + (attempt + 1) + ' failed: ' + err.message + ', retrying');
      await sleep(delay);
    }
  }
}

let calls = 0;
const flaky = async () => {
  calls++;
  if (calls < 3) throw new Error('timeout');
  return 'ok on call ' + calls;
};

retry(flaky, { retries: 3, baseMs: 10 })
  .then((v) => console.log(v))
  .then(() => retry(async () => { throw new Error('down'); }, { retries: 1, baseMs: 10 }))
  .catch((err) => console.log('gave up:', err.message));`,
        },
        {
          lang: 'js',
          title: 'EventEmitter',
          source: `class EventEmitter {
  #listeners = new Map();

  on(event, fn) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, []);
    this.#listeners.get(event).push(fn);
    return () => this.off(event, fn); // handy unsubscribe
  }

  off(event, fn) {
    const list = this.#listeners.get(event) || [];
    this.#listeners.set(event, list.filter((l) => l !== fn && l.original !== fn));
  }

  once(event, fn) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      fn(...args);
    };
    wrapper.original = fn; // so off(event, fn) also removes it
    return this.on(event, wrapper);
  }

  emit(event, ...args) {
    const list = this.#listeners.get(event);
    if (!list || list.length === 0) return false;
    [...list].forEach((fn) => fn(...args)); // copy: listeners may remove themselves
    return true;
  }
}

const bus = new EventEmitter();
const unsubscribe = bus.on('upload', (file) => console.log('on:', file));
bus.once('upload', (file) => console.log('once:', file));
bus.emit('upload', 'cv.pdf');
bus.emit('upload', 'jd.pdf');
unsubscribe();
console.log(bus.emit('upload', 'x.pdf'));`,
        },
      ],
      output: "promiseAll prints `empty: []`, then `failed: boom`, then `ok: [ 'slow', 'plain', 'fast' ]` (results in input order even though 'fast' finished first). retry prints `attempt 1 failed: timeout, retrying`, `attempt 2 failed: timeout, retrying`, `ok on call 3`, then `attempt 1 failed: down, retrying`, `gave up: down`. EventEmitter prints `on: cv.pdf`, `once: cv.pdf`, `on: jd.pdf`, `false`.",
      questions: [
        { q: 'Why store results by index instead of pushing them in Promise.all?', a: "Promises finish in any order. Pushing would give finish order; `results[i] = value` keeps the input order, which is what `Promise.all` guarantees." },
        { q: 'What does your Promise.all do with an empty array or plain values?', a: "An empty array resolves immediately with `[]`, because no callback would ever fire to resolve it. Plain values are wrapped with `Promise.resolve`, so they count as already resolved." },
        { q: 'Why add jitter to exponential backoff?', a: "If many clients fail at the same moment, pure exponential backoff makes them all retry at the same moments too, hammering the server in waves. Random jitter spreads the retries out." },
        { q: 'Which errors should you retry?', a: "Temporary ones: timeouts, network errors, 5xx and 429 (respecting `Retry-After`). Not 4xx validation or auth errors, which will fail the same way every time. And the operation should be idempotent, so a retry after a lost response doesn't do the work twice." },
        { q: 'Why does `emit` copy the listener array before looping?', a: "A `once` listener removes itself while the loop is running. Looping over a copy means removals don't shift the array and cause the next listener to be skipped." },
      ],
      answer30: "For Promise.all I return a new Promise, wrap every item with Promise.resolve, store each result at its index, count completions, resolve when the count hits the length, reject on the first failure, and resolve immediately for an empty input. Retry is a loop with try/catch, a capped number of attempts, and a sleep of base times two to the attempt plus jitter, retrying only temporary errors. EventEmitter is a Map from event name to an array of listeners, with once implemented as a self-removing wrapper.",
      mistakes: [
        "Using `results.push` in Promise.all, which returns results in finish order.",
        "Forgetting the empty-array case, so the promise never resolves.",
        "Retrying forever, without a cap or backoff, or retrying non-idempotent operations like a payment.",
        "Trap: 'Does Promise.all cancel the other promises when one fails?' No. It rejects immediately, but the other operations keep running; you need an `AbortController` to actually cancel them.",
      ],
      takeaway: 'Keep order by index, back off exponentially with jitter, and copy listener lists before emitting.',
    },
  ],
  rapidFire: [
    { q: '`typeof null`?', a: "`'object'`, a historic bug that can't be fixed." },
    { q: '`typeof NaN`?', a: "`'number'`." },
    { q: '`typeof function(){}` and `typeof class {}`?', a: "Both `'function'`." },
    { q: '`0.1 + 0.2 === 0.3`?', a: 'false; it is `0.30000000000000004`.' },
    { q: '`[] + []`?', a: "`''` (empty string)." },
    { q: "`'5' - 2` and `'5' + 2`?", a: "`3` and `'52'`." },
    { q: '`NaN === NaN`?', a: 'false; use `Number.isNaN`.' },
    { q: '`null == undefined`?', a: 'true (but `null === undefined` is false).' },
    { q: "`['1','2','3'].map(parseInt)`?", a: '`[1, NaN, NaN]`, because the index is passed as the radix.' },
    { q: '`[10, 1, 2].sort()`?', a: '`[1, 10, 2]`, sorted as strings.' },
    { q: 'var loop + setTimeout logging i (0..2)?', a: '3, 3, 3. With let: 0, 1, 2.' },
    { q: 'Promise.then vs setTimeout 0: which first?', a: 'The promise callback (microtask).' },
    { q: 'Is a Promise executor sync or async?', a: 'Sync; only then/catch/finally callbacks are async.' },
    { q: 'Arrow function `this`?', a: 'Taken from the surrounding scope; call/bind cannot change it.' },
    { q: 'Can you rebind a bound function?', a: 'No; only `new` overrides it.' },
    { q: 'Does spread deep-copy?', a: 'No, one level only. Use `structuredClone` for deep.' },
    { q: 'Does `Object.freeze` freeze nested objects?', a: 'No, it is shallow.' },
    { q: 'When does a destructuring default apply?', a: 'Only when the value is `undefined`, not `null`.' },
    { q: '`[1, 2, 3].forEach(...)` returns?', a: '`undefined`, always.' },
    { q: '`Array(3).fill([])`: how many arrays?', a: 'One, shared by all three slots.' },
    { q: 'Debounce vs throttle in one line?', a: 'Debounce runs after calls stop; throttle runs at most once per interval.' },
    { q: 'Promise.all vs allSettled?', a: 'all rejects on the first failure; allSettled always resolves with every outcome.' },
  ],
};

export default jsOutput;
