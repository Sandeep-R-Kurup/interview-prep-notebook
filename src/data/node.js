// Node.js stack. Topics are auto-sorted Basic -> Intermediate -> Advanced by the registry.
// Runnable examples were checked on Node 26. Version facts are as of October 2026.

const node = {
  name: 'Node.js',
  intro: 'How the runtime under your Express APIs really works: the event loop, the thread pool, streams, processes, and the version upgrades you have done. Read the simple version first; the deeper version is what interviewers probe.',
  topics: [
    {
      id: 'what-is-node',
      title: 'What Node.js is (V8 + libuv)',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Node is a JavaScript runtime: Google\'s V8 engine runs your code, and libuv handles I/O, timers, and the event loop.',
      what: [
        "Node.js lets you run JavaScript outside the browser, mostly to build servers, CLIs, and background workers. It is not a language and not a framework: it is a runtime, the program that executes your JavaScript.",
        "Node has two main parts. **V8** (the engine from Chrome) turns JavaScript into machine code and runs it. **libuv** (a C library) gives Node the event loop, async file and network I/O, timers, and a small thread pool. On top sit Node's built-in modules like `fs`, `http`, `crypto`, and `stream`.",
        "Your JavaScript runs on **one main thread**. Node stays fast because it never waits for slow things like the database or disk: it starts the work, moves on, and runs your callback when the result is ready.",
      ],
      deeper: [
        "Network I/O uses the operating system's own async APIs (epoll on Linux, kqueue on macOS, IOCP on Windows), so thousands of sockets need no extra threads. Work the OS can't do asynchronously (most file system calls, DNS `lookup`, some `crypto` and `zlib` calls) goes to libuv's thread pool, 4 threads by default.",
        "Browsers and Node share V8 and the language, but not the environment. Node has no `window` or DOM; the browser has no `fs` or `process`. Modern Node also ships many web APIs (`fetch`, `URL`, `AbortController`, Web Streams, `structuredClone`) so the same code often runs in both.",
        "Single-threaded JavaScript is a strength for I/O-heavy APIs (no locks, no race conditions on shared variables) and a weakness for CPU-heavy work: a long calculation blocks every other request. That trade-off drives most Node architecture questions.",
      ],
      why: "Before Node, servers usually used one thread per connection, which wastes memory while threads sit waiting on the database. Node's event-driven model handles many concurrent connections with little memory, and lets teams use one language on the frontend and backend.",
      analogy: "A restaurant with one very fast waiter (the main thread). The waiter takes an order, hands it to the kitchen (libuv and the OS), and serves other tables instead of standing at the kitchen door. When a dish is ready, the kitchen rings a bell (a callback) and the waiter delivers it.",
      code: {
        lang: 'js',
        title: 'One thread, but I/O does not block it',
        source: `const fs = require('node:fs');

console.log('1. start reading file');

fs.readFile(__filename, 'utf8', (err, text) => {
  // runs later, when libuv has the file contents
  console.log('3. file read done,', text.length, 'characters');
});

console.log('2. not waiting: serving other work meanwhile');`,
      },
      output: "Logs '1. start reading file', then '2. not waiting...', then '3. file read done, N characters'. The read happens in the background, so line 2 runs before the callback.",
      questions: [
        { q: 'What is Node.js?', a: 'A JavaScript runtime built on the V8 engine and the libuv library. It runs JavaScript outside the browser and uses an event-driven, non-blocking I/O model, which suits APIs and real-time servers.' },
        { q: 'Is Node.js single-threaded?', a: 'Your JavaScript runs on a single main thread with one event loop. But Node itself uses more threads: libuv has a thread pool (4 by default) for file system, DNS and some crypto work, and V8 uses background threads for garbage collection.' },
        { q: 'What are V8 and libuv?', a: 'V8 is the JavaScript engine from Chrome that compiles and runs your code. libuv is a C library that provides the event loop, async I/O, timers and the thread pool.' },
        { q: 'When is Node a bad choice?', a: 'For CPU-heavy work like video encoding, big image processing, or heavy number crunching in the request path, because it blocks the one thread that serves everyone. You would move that work to worker threads, a separate service, or a language better suited to it.' },
      ],
      answer30: "Node.js is a JavaScript runtime, not a framework. V8 runs the JavaScript, and libuv provides the event loop, async I/O and a small thread pool. My code runs on one main thread, but it never waits for I/O: it starts a database or file call, moves on, and the callback runs when the result is ready. That makes Node great for I/O-heavy APIs with many concurrent connections, and a poor fit for CPU-heavy work in the request path, which I would move to worker threads or a separate service.",
      mistakes: [
        "Saying 'Node is a framework' or 'Node is a language'. It's a runtime; Express is the framework.",
        "Saying Node is 'fully single-threaded'. Your JavaScript is, but libuv and V8 use extra threads.",
        "Running CPU-heavy loops (big JSON transforms, sync hashing) inside request handlers and wondering why every request slows down.",
        "Trap: 'If Node is single-threaded, how does it handle 10,000 connections?' The OS notifies Node when sockets have data (epoll/kqueue), so one thread can juggle many idle connections; it only spends CPU time when there is actual work.",
      ],
      takeaway: 'Node = V8 (runs JS) + libuv (event loop, async I/O, thread pool): great for I/O, careful with CPU.',
    },

    {
      id: 'event-loop-phases',
      title: 'The event loop and its phases',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'The event loop cycles through phases (timers, poll, check, close), running ready callbacks from each phase\'s queue.',
      what: [
        "The event loop is the loop that keeps a Node process alive. While there is pending work (timers, open sockets, file reads), it keeps going round, picking up callbacks that are ready and running them one at a time on the main thread.",
        "Each round (a 'tick' of the loop) goes through fixed **phases**, and each phase has its own queue of callbacks:",
        "1. **timers**: callbacks from `setTimeout` and `setInterval` whose time has passed. 2. **pending callbacks**: some system-level callbacks deferred from the last round (like certain TCP errors). 3. **idle/prepare**: internal only. 4. **poll**: get new I/O events and run their callbacks (file reads, incoming requests, socket data). 5. **check**: `setImmediate` callbacks. 6. **close callbacks**: things like `socket.on('close')`.",
      ],
      deeper: [
        "The **poll** phase is where Node spends most of its idle time. If nothing else is scheduled, it blocks here waiting for I/O, but only until the nearest timer is due. If `setImmediate` callbacks are queued, it doesn't wait at all and moves on to the check phase.",
        "Between every single callback (not just between phases), Node drains the **`process.nextTick` queue** and then the **promise microtask queue**. So a `.then` scheduled inside a timer callback runs before the next timer callback. This has been true since Node 11; before that, microtasks only ran between phases.",
        "A timer's delay is a minimum, not a promise. `setTimeout(fn, 100)` runs fn at the first timers phase after 100 ms have passed, which may be much later if a slow callback is hogging the thread.",
        "Event loop delay (lag) is the key health metric: how long a ready callback waits before it runs. Measure it with `perf_hooks.monitorEventLoopDelay()`; consistently high values mean something is blocking the thread.",
      ],
      why: "Interviewers use the event loop to check whether you really understand why Node is fast, why one slow function slows every request, and in what order your async code runs. Debugging 'why did this log before that?' needs this model.",
      analogy: "A security guard doing rounds of a building in a fixed order: the clock room (timers), the mailroom (poll, new I/O), the 'do right after' tray (check, setImmediate), and the exit doors (close). Between every single task, the guard first clears the urgent sticky notes on their clipboard (nextTick, then promises).",
      code: {
        lang: 'js',
        title: 'Seeing the phases and measuring loop delay',
        source: `const fs = require('node:fs');
const { monitorEventLoopDelay } = require('node:perf_hooks');

const h = monitorEventLoopDelay({ resolution: 10 });
h.enable();

fs.readFile(__filename, () => {            // poll phase: I/O callback
  setTimeout(() => console.log('timers phase (next round)'), 0);
  setImmediate(() => console.log('check phase (same round)'));
});

// Simulate a blocking request handler: 200 ms of pure CPU
setTimeout(() => {
  const end = Date.now() + 200;
  while (Date.now() < end) {}             // nothing else can run during this
}, 50);

setTimeout(() => {
  h.disable();
  console.log('max loop delay ms:', Math.round(h.max / 1e6)); // ns -> ms
}, 400);`,
      },
      output: "Prints 'check phase (same round)' before 'timers phase (next round)', because after an I/O callback the loop reaches the check phase before it wraps around to timers. The last line reports a max loop delay of roughly 200 ms: the busy loop blocked everything for that long.",
      questions: [
        { q: 'What are the phases of the Node.js event loop?', a: 'Timers (setTimeout/setInterval), pending callbacks, idle/prepare (internal), poll (new I/O events and their callbacks), check (setImmediate), and close callbacks. The loop repeats while there is pending work.' },
        { q: 'What happens in the poll phase?', a: 'Node collects finished I/O events and runs their callbacks. If there is nothing to do, it waits here for new I/O, but only until the next timer is due, or not at all if setImmediate callbacks are waiting.' },
        { q: 'When do promise callbacks run relative to the phases?', a: 'Between every callback. After each callback finishes, Node drains the process.nextTick queue and then the promise microtask queue before running the next callback, in any phase.' },
        { q: 'Does setTimeout(fn, 100) run exactly after 100 ms?', a: 'No. 100 ms is a minimum. The callback runs in the first timers phase after the delay has passed, so a blocked event loop delays it further.' },
        { q: 'How do you know if the event loop is blocked in production?', a: 'Measure event loop delay with perf_hooks.monitorEventLoopDelay or an APM tool, and watch p99 latency. Spikes usually point to synchronous CPU work, big JSON.parse/stringify, or sync fs calls in hot paths.' },
      ],
      answer30: "The event loop is what lets single-threaded Node handle many things at once. Each round goes through phases: timers for setTimeout and setInterval, pending callbacks, poll where I/O callbacks run and where Node waits for new events, check for setImmediate, and close callbacks. Between every callback, Node drains process.nextTick and then promise microtasks. The practical lesson is that any callback that runs too long blocks everything else, so in production I watch event loop delay and keep CPU-heavy work off the main thread.",
      mistakes: [
        "Mixing up the browser event loop and Node's. The browser has tasks, microtasks and rendering; Node has libuv phases plus the nextTick queue.",
        "Thinking microtasks only run 'at the end of a phase'. Since Node 11 they run after every individual callback.",
        "Using `setTimeout(fn, 0)` and assuming it runs 'immediately'. It waits for the next timers phase, at least 1 ms.",
        "Trap: 'Which runs first at the top level of a script, setTimeout 0 or setImmediate?' It's not guaranteed; it depends on how fast the process starts. Inside an I/O callback, setImmediate always wins.",
      ],
      takeaway: 'Timers -> poll -> check -> close, with nextTick and promises drained after every callback; never block the loop.',
    },

    {
      id: 'nexttick-microtasks-setimmediate',
      title: 'process.nextTick vs promises vs setImmediate vs setTimeout',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Order in CommonJS: sync code, nextTick queue, promise microtasks, then event loop phases (timers, I/O, setImmediate).',
      what: [
        "Node has several ways to say 'run this later', and they run in a fixed order:",
        "1. **Synchronous code** always finishes first. 2. **`process.nextTick`** callbacks run as soon as the current operation finishes. 3. **Promise callbacks** (`.then`, `await` continuations, `queueMicrotask`) run next. 4. Then the event loop continues: **`setTimeout`/`setInterval`** in the timers phase, I/O callbacks in poll, **`setImmediate`** in the check phase.",
      ],
      deeper: [
        "`process.nextTick` is not part of the event loop phases at all. It has its own queue that Node drains before the promise microtask queue, after every callback. Because of that, a recursive `nextTick` (or a promise chain that never ends) can starve the event loop: I/O and timers never get a turn.",
        "**ES modules change the first step.** In an `.mjs` file (or `\"type\": \"module\"`), the module body itself runs inside a promise job. So at the top level of an ES module, promise callbacks print **before** `nextTick` callbacks. Inside later callbacks (timers, I/O), the normal order (nextTick first) applies again. This is a favourite trick question.",
        "setTimeout(0) vs setImmediate: at the top level of the main script the order is not guaranteed (it depends on whether 1 ms has passed when the loop starts). Inside an I/O callback, `setImmediate` always runs first because the check phase comes right after poll.",
        "Rule of thumb from the Node docs: prefer `setImmediate` (or `queueMicrotask`) over `nextTick` for deferring work. Use `nextTick` mainly in library code, for example to emit an event after the caller has had a chance to attach listeners.",
      ],
      why: "'What is the output of this snippet?' is one of the most common Node interview questions. It also matters in real code: misusing nextTick can freeze a server, and knowing that an `await` continuation is a microtask explains many ordering bugs.",
      analogy: "A doctor's clinic. Sync code is the patient in the room now. nextTick is 'one more thing before you go'. Promises are patients already waiting in the corridor. Timers and setImmediate are people who booked appointments for the next round of the schedule.",
      code: {
        lang: 'js',
        title: 'order.cjs (run with node order.cjs)',
        source: `const fs = require('node:fs');

console.log('1 sync start');

process.nextTick(() => console.log('3 nextTick'));
Promise.resolve().then(() => console.log('4 promise.then'));
queueMicrotask(() => console.log('5 queueMicrotask'));

fs.readFile(__filename, () => {
  console.log('6 readFile callback (poll phase)');
  setTimeout(() => console.log('9 setTimeout 0 (next round, timers phase)'), 0);
  setImmediate(() => console.log('8 setImmediate (check phase, same round)'));
  process.nextTick(() => console.log('7 nextTick inside callback'));
});

console.log('2 sync end');`,
      },
      output: "Prints 1 to 9 in order, every time: 1 sync start, 2 sync end, 3 nextTick, 4 promise.then, 5 queueMicrotask, 6 readFile callback, 7 nextTick inside callback, 8 setImmediate, 9 setTimeout. If you save the same code as an .mjs file (ES module), lines 4 and 5 print before line 3, because an ES module's body runs inside a promise job.",
      questions: [
        { q: 'What is the difference between process.nextTick and setImmediate?', a: 'process.nextTick runs right after the current operation, before promises and before the event loop moves on. setImmediate runs in the check phase of the event loop, after I/O callbacks. Despite the names, nextTick is the more immediate one.' },
        { q: 'Which runs first: process.nextTick or Promise.then?', a: 'In CommonJS code and inside callbacks, nextTick runs first because Node drains the nextTick queue before the microtask queue. At the top level of an ES module, promises run first, because the module body is itself evaluated inside a promise job.' },
        { q: 'Which runs first: setTimeout(fn, 0) or setImmediate(fn)?', a: 'At the top level of the main script it is not guaranteed. Inside an I/O callback, setImmediate always runs first because the check phase comes straight after the poll phase.' },
        { q: 'How can process.nextTick starve the event loop?', a: 'Node drains the whole nextTick queue before continuing. If a nextTick callback keeps scheduling another nextTick, the queue never empties, so timers and I/O never run and the server stops responding.' },
      ],
      answer30: "Synchronous code runs first. Then Node drains the process.nextTick queue, then promise microtasks like .then, await continuations and queueMicrotask. Only then does the event loop move on: timers for setTimeout, poll for I/O callbacks, and the check phase for setImmediate. Inside an I/O callback, setImmediate always beats setTimeout 0. One twist: at the top level of an ES module, promises run before nextTick. In practice I avoid nextTick and use setImmediate or queueMicrotask, because recursive nextTick can starve I/O.",
      mistakes: [
        "Assuming `setImmediate` runs before `nextTick` because of the name. It's the opposite.",
        "Answering the ordering question without asking (or stating) whether the file is CommonJS or an ES module.",
        "Using recursive `process.nextTick` to 'yield' during a long job. It never yields to I/O. Use `setImmediate` to let I/O breathe between chunks.",
        "Trap: 'Is code after `await` synchronous?' No. Everything after an `await` is a microtask continuation, so it runs after the current synchronous code, even if the awaited value is already resolved.",
      ],
      takeaway: 'sync -> nextTick -> promises -> timers / I/O / setImmediate; ES modules flip nextTick and promises at the top level.',
    },

    {
      id: 'non-blocking-io-thread-pool',
      title: 'Non-blocking I/O and the libuv thread pool',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Network I/O uses OS async APIs; file system, DNS lookup, and some crypto/zlib work run on a 4-thread pool you can resize.',
      what: [
        "Non-blocking I/O means Node starts a slow operation (read a file, query a database, call an API) and doesn't wait for it. The main thread keeps handling other requests, and a callback or promise delivers the result later.",
        "Behind the scenes, libuv uses two strategies. **Network sockets** (HTTP, database connections) use the operating system's async notification APIs, so no extra threads are needed. Work the OS can't do asynchronously goes to the **libuv thread pool**, which has 4 threads by default.",
      ],
      deeper: [
        "What uses the thread pool: most async `fs` calls, `dns.lookup` (used by `http.get('example.com')` by default), and async `crypto` functions like `pbkdf2`, `scrypt`, `randomBytes` and `randomFill`, and async `zlib`. What does not: TCP/UDP sockets, HTTP, `dns.resolve*` (which uses c-ares over the network).",
        "With only 4 threads, 4 slow tasks occupy the whole pool and the 5th waits. Classic symptom: password hashing with async `bcrypt` or `crypto.scrypt` under load makes unrelated file reads slow. Fix: set `UV_THREADPOOL_SIZE` (max 1024) before the pool is first used, ideally as an environment variable at startup.",
        "Sync APIs (`fs.readFileSync`, `crypto.pbkdf2Sync`, `zlib.gzipSync`) do the work on the main thread and block everything. They are fine at startup (loading config) but never in request handlers.",
      ],
      why: "It explains real production surprises: why bcrypt slows down file uploads, why DNS can be a bottleneck, and why 'just use async' doesn't make CPU work free.",
      analogy: "The waiter (main thread) can phone suppliers and get called back (network I/O) without any helpers. But some jobs need hands, like peeling potatoes (file reads, hashing), so the kitchen has 4 helpers. If 6 sacks arrive at once, 2 sacks wait for a free helper.",
      code: {
        lang: 'js',
        title: 'threadpool.cjs: 6 hashes, 4 threads',
        source: `const crypto = require('node:crypto');

const start = Date.now();
for (let i = 1; i <= 6; i++) {
  // async pbkdf2 runs on the libuv thread pool (default size 4)
  crypto.pbkdf2('secret', 'salt', 500_000, 64, 'sha512', () => {
    console.log(\`hash \${i} done after \${Date.now() - start} ms\`);
  });
}
console.log('main thread is free while hashing');

// Try: UV_THREADPOOL_SIZE=6 node threadpool.cjs`,
      },
      output: "'main thread is free while hashing' prints first. Then four hashes finish at about the same time (around 150 ms on a laptop), and the last two finish at roughly double that, because they had to wait for a free thread. With UV_THREADPOOL_SIZE=6, all six finish together (if you have enough CPU cores). Exact numbers depend on the machine.",
      questions: [
        { q: 'What does non-blocking I/O mean in Node?', a: 'Node starts an I/O operation and continues running other code instead of waiting. When the operation finishes, its callback or promise is queued and runs on the event loop.' },
        { q: 'What is the libuv thread pool used for?', a: 'For work the OS cannot do asynchronously: most fs operations, dns.lookup, async crypto like pbkdf2 and scrypt, and async zlib. It has 4 threads by default, configurable with UV_THREADPOOL_SIZE.' },
        { q: 'Do HTTP requests or database queries use the thread pool?', a: 'No. Network sockets use the operating system\'s async APIs (epoll, kqueue, IOCP). The exception is the DNS lookup before connecting, which uses dns.lookup on the thread pool by default.' },
        { q: 'Your API gets slow whenever many users log in at once. Why might that be?', a: 'Async password hashing (bcrypt, scrypt, pbkdf2) can fill the 4-thread pool, so file reads and DNS lookups queue behind it. Increase UV_THREADPOOL_SIZE, tune hashing cost, or move hashing to a separate service. A sync hash function would be worse: it blocks the main thread.' },
      ],
      answer30: "Node doesn't wait for I/O; it starts the operation and moves on. Network I/O uses the OS's async APIs, so one thread can handle thousands of sockets. Things the OS can't do asynchronously, like most file system calls, dns.lookup, and async crypto such as pbkdf2, run on libuv's thread pool, which has four threads by default. If that pool is saturated, for example by password hashing under load, unrelated file operations queue up, so I'd raise UV_THREADPOOL_SIZE or move the work elsewhere. And I never use Sync APIs inside request handlers.",
      mistakes: [
        "Saying 'all async operations use the thread pool'. Network I/O doesn't.",
        "Setting `process.env.UV_THREADPOOL_SIZE` deep inside the app after the pool has already been used. It must be set before first use; safest is the environment at startup.",
        "Using `readFileSync` or `bcrypt.hashSync` in a route handler.",
        "Trap: 'Does async make CPU-heavy code non-blocking?' No. Wrapping a CPU loop in a Promise or async function still runs it on the main thread. Only real offloading (thread pool, worker threads, another process) helps.",
      ],
      takeaway: 'Sockets are async via the OS; fs, dns.lookup, crypto and zlib use a 4-thread pool; async does not make CPU work free.',
    },

    {
      id: 'commonjs-vs-esm',
      title: 'Modules: CommonJS vs ES modules in Node',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'CommonJS uses require/module.exports and loads synchronously; ES modules use import/export, are static, and support top-level await.',
      what: [
        "A module is one file with its own scope. Node supports two module systems. **CommonJS (CJS)** is Node's original system: `require()` to load, `module.exports` to share. **ES modules (ESM)** are the JavaScript standard: `import` and `export`, the same syntax browsers use.",
        "Node decides which system a file uses by its extension and `package.json`: `.cjs` is always CommonJS, `.mjs` is always ESM, and `.js` follows the nearest package.json `\"type\"` field (`\"module\"` or `\"commonjs\"`, which is the default).",
      ],
      deeper: [
        "Key differences. `require` is a normal function: it runs synchronously, can be called conditionally, and returns a copy of the exported value. ESM `import` is static: imports are resolved before the code runs, which enables tree-shaking, live bindings (you see the exporter's updated value), and **top-level `await`**. ESM always runs in strict mode.",
        "In ESM there is no `__dirname`, `__filename`, `require`, or `module`. Use `import.meta.dirname` and `import.meta.filename` (Node 20.11+), or `createRequire(import.meta.url)` when you really need `require`. Relative imports in ESM need the full file extension: `import './db.js'`, not `'./db'`.",
        "Interop: ESM can `import` CommonJS packages (you get `module.exports` as the default export, plus detected named exports). For years CommonJS could not `require()` ESM and had to use dynamic `import()`. Since Node 22.12 and 20.19, `require(esm)` works without a flag, as long as the ES module has no top-level `await`. This removed most of the 'ERR_REQUIRE_ESM' pain from ESM-only packages.",
        "Packages publish both formats with the `\"exports\"` field in package.json (conditional exports for `import` and `require`). TypeScript projects choose the output with `module` / `moduleResolution` (`nodenext` is the safe setting for Node).",
      ],
      why: "Mixing the two systems is one of the most common sources of Node errors ('require is not defined in ES module scope', 'Cannot use import statement outside a module', ERR_REQUIRE_ESM). The ecosystem is moving to ESM, so you need to know both.",
      analogy: "CommonJS is ordering food at the counter: you ask when you need it, and you get it right then. ESM is a pre-ordered set menu: the kitchen knows every dish in advance, so it can plan, skip unused dishes, and serve courses that are cooking in parallel.",
      code: [
        {
          lang: 'js',
          title: 'math.cjs (CommonJS)',
          source: `function add(a, b) { return a + b; }
module.exports = { add };`,
        },
        {
          lang: 'js',
          title: 'main.mjs (ES module)',
          source: `import { add } from './math.cjs';               // ESM can import CommonJS
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url); // a require() inside ESM when you need one
const pkg = require('./package.json');

console.log(add(2, 3), pkg.name);
console.log(typeof __dirname);                  // not defined in ESM
console.log(import.meta.dirname);               // the ESM replacement (Node 20.11+)

const config = await import('./config.mjs');    // dynamic import; top-level await is fine in ESM`,
        },
      ],
      output: "main.mjs prints 5 and the package name, then 'undefined' for typeof __dirname, then the folder path from import.meta.dirname. The dynamic import loads config.mjs only when that line runs.",
      questions: [
        { q: 'What is the difference between require and import?', a: 'require is CommonJS: a synchronous function call that can run anywhere in the code. import is ES modules: static declarations resolved before the code runs, which enables tree-shaking, live bindings and top-level await. Dynamic import() returns a promise and works in both systems.' },
        { q: 'How does Node decide whether a file is CommonJS or ESM?', a: '.mjs files are ESM and .cjs files are CommonJS. A .js file follows the "type" field of the nearest package.json: "module" means ESM, and "commonjs" or no field means CommonJS.' },
        { q: 'Can CommonJS code use an ESM-only package?', a: 'Yes. Dynamic import() always works. And since Node 22.12 and 20.19, require() can load an ES module synchronously as long as it has no top-level await.' },
        { q: 'How do you get __dirname in an ES module?', a: 'Use import.meta.dirname (Node 20.11+), or on older versions path.dirname(fileURLToPath(import.meta.url)).' },
      ],
      answer30: "Node has two module systems. CommonJS uses require and module.exports; require is a synchronous function, so you can call it conditionally. ES modules use import and export; they're static, so tools can tree-shake them, and they support top-level await. Node picks the system from the extension, .mjs or .cjs, or from the type field in package.json. ESM can import CommonJS, and in recent Node versions require can load ES modules too, as long as they don't use top-level await. In ESM I use import.meta.dirname instead of __dirname.",
      mistakes: [
        "Leaving off the extension in ESM imports (`import './utils'`). Node's ESM loader needs `./utils.js`.",
        "Using `__dirname` or `require` in an ES module and getting 'not defined' errors.",
        "Mixing `export default` on one side with `require()` on the other and getting `{ default: ... }` instead of the value you expected.",
        "Trap: 'Are CommonJS exports live?' No. require returns the value of module.exports at that moment. ESM imports are live bindings: if the exporting module reassigns an exported `let`, importers see the new value.",
      ],
      takeaway: 'CJS: require, sync, dynamic. ESM: import, static, top-level await. Extension or package.json "type" decides.',
    },

    {
      id: 'streams-backpressure',
      title: 'Streams and backpressure',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Streams process data in small chunks instead of loading it all into memory; backpressure stops a fast producer from flooding a slow consumer.',
      what: [
        "A stream is data that arrives (or leaves) a piece at a time. Instead of reading a 2 GB file into memory, you read it in chunks of 64 KB and handle each chunk as it comes.",
        "Node has four kinds: **Readable** (you read from it: `fs.createReadStream`, an incoming HTTP request), **Writable** (you write to it: `fs.createWriteStream`, an HTTP response), **Duplex** (both: a TCP socket), and **Transform** (a duplex that changes data as it passes: gzip, encryption, CSV parsing).",
        "**Backpressure** is what happens when the reader is faster than the writer. If nothing slowed the reader down, chunks would pile up in memory. Streams solve this automatically when you connect them properly.",
      ],
      deeper: [
        "How backpressure works: every stream has a buffer limit, `highWaterMark` (64 KB for byte streams since Node 22; it was 16 KB before, and 64 KB for fs read streams). `writable.write(chunk)` returns `false` when the buffer is over that limit. A well-behaved producer then stops and waits for the `'drain'` event before writing more.",
        "Use `pipeline` from `node:stream/promises` to connect streams. It wires up backpressure, forwards errors from any stage, and destroys all streams on failure. The older `a.pipe(b)` handles backpressure but not errors: if one stream fails, the others can stay open and leak file descriptors.",
        "Readable streams are async iterables, so `for await (const chunk of stream)` is a clean way to consume them, and it respects backpressure too. Node also supports the web-standard `ReadableStream` (what `fetch` returns) and can convert between the two with `Readable.fromWeb` and `Readable.toWeb`.",
      ],
      why: "Streams keep memory flat no matter how big the data is. They are how you serve large downloads, process big CSV uploads, proxy files to and from S3, and pipe a database cursor to a response. Without them, one big file can crash a server with an out-of-memory error.",
      analogy: "Filling a bucket from a tap while someone carries the water away in cups. If the tap is faster than the cups, the bucket overflows. Backpressure is turning the tap down whenever the bucket is nearly full and opening it again when it drains.",
      code: [
        {
          lang: 'js',
          title: 'Filter, gzip, and save a big log file with pipeline',
          source: `import { createReadStream, createWriteStream, writeFileSync, statSync } from 'node:fs';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';

writeFileSync('big.log', 'info: ok\\nerror: db timeout\\n'.repeat(200_000)); // ~5 MB test file

// Keep only error lines (simplified: assumes a line never splits across chunks)
const onlyErrors = new Transform({
  transform(chunk, _enc, done) {
    const lines = chunk.toString().split('\\n').filter((l) => l.startsWith('error'));
    done(null, lines.length ? lines.join('\\n') + '\\n' : '');
  },
});

await pipeline(
  createReadStream('big.log'),       // reads 64 KB chunks
  onlyErrors,
  createGzip(),
  createWriteStream('errors.log.gz'),
); // handles backpressure, errors, and cleanup for every stage

console.log('input MB:', (statSync('big.log').size / 1e6).toFixed(1));
console.log('output KB:', (statSync('errors.log.gz').size / 1e3).toFixed(1));`,
        },
        {
          lang: 'js',
          title: 'Backpressure by hand: write() returns false, wait for drain',
          source: `import { Writable } from 'node:stream';

const slowDisk = new Writable({
  highWaterMark: 16,                               // tiny buffer (16 bytes) to show backpressure
  write(chunk, _enc, done) { setTimeout(done, 5); }, // each write is slow
});

let i = 0;
function writeMore() {
  while (i < 5) {
    const ok = slowDisk.write(\`line \${i++}\\n\`);
    console.log(\`wrote line \${i - 1}, ok = \${ok}\`);
    if (!ok) {
      console.log('buffer full -> pause until drain');
      slowDisk.once('drain', writeMore);
      return;
    }
  }
  slowDisk.end(() => console.log('all written'));
}
writeMore();`,
        },
      ],
      output: "The first script prints 'input MB: 5.4' and 'output KB:' around 9: the 5 MB file was processed in chunks and never fully loaded into memory. The second prints 'ok = true' for lines 0 and 1, 'ok = false' for line 2 and 'buffer full -> pause until drain', then lines 3 and 4 with ok = true after the drain, and finally 'all written'.",
      questions: [
        { q: 'What are streams and why use them?', a: 'Streams process data in chunks as it arrives instead of loading it all into memory. They keep memory use flat for large files or responses, and let you start processing before all the data has arrived.' },
        { q: 'What are the four types of streams?', a: 'Readable (source, like fs.createReadStream or an HTTP request), Writable (destination, like an HTTP response), Duplex (both directions, like a TCP socket), and Transform (a Duplex that modifies data, like gzip).' },
        { q: 'What is backpressure?', a: 'When a consumer is slower than the producer, data builds up in memory. Node signals it by write() returning false once the buffer passes highWaterMark; the producer should pause until the drain event. pipe and pipeline do this automatically.' },
        { q: 'Why prefer stream.pipeline over .pipe()?', a: 'pipeline forwards an error from any stage, destroys all the streams on failure, and gives you a promise or callback when everything is finished. With .pipe(), errors are not forwarded and a failed stream can leave the others open, leaking memory and file handles.' },
      ],
      answer30: "Streams let Node handle data in chunks instead of loading everything into memory, so a 2 GB file uses about the same memory as a 2 KB one. There are Readable, Writable, Duplex and Transform streams. Backpressure is the flow control: when the writable side's buffer passes its highWaterMark, write returns false and the producer should wait for drain. I connect streams with stream/promises pipeline, which handles backpressure, error propagation and cleanup, rather than plain .pipe().",
      mistakes: [
        "Ignoring the return value of `write()` in a loop, so memory grows until the process crashes.",
        "Using `.pipe()` without error handling on every stream.",
        "Calling `fs.readFile` on user uploads or exports of unknown size instead of streaming them.",
        "Trap: 'If I use streams, do I still need to worry about memory?' Yes, if you collect chunks into an array or string (`data += chunk`) you've rebuilt the whole file in memory and lost the benefit.",
      ],
      takeaway: 'Stream big data in chunks, connect with pipeline, and respect write() returning false.',
    },

    {
      id: 'buffers',
      title: 'Buffers and binary data',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'A Buffer is a fixed-size chunk of raw bytes; Node uses it for files, sockets, images, and encodings like base64.',
      what: [
        "JavaScript strings are text. A **Buffer** holds raw bytes, which is what files, network packets, images and encrypted data really are. Buffers are a subclass of `Uint8Array`, so each item is a number from 0 to 255.",
        "You create them with `Buffer.from(...)` (from a string, array or another buffer) or `Buffer.alloc(size)` (zero-filled), and turn them back into text with `buf.toString('utf8')`, `'base64'`, `'hex'` and so on.",
      ],
      deeper: [
        "`buf.length` is the number of **bytes**, not characters. `'é'` is 2 bytes in UTF-8, so `Buffer.from('héllo').length` is 6 while `'héllo'.length` is 5. This matters for `Content-Length` headers and size limits.",
        "`Buffer.allocUnsafe(n)` is faster but may contain old memory from your process. Only use it if you overwrite every byte. The old `new Buffer()` constructor is deprecated for this reason.",
        "`buf.subarray()` (and the deprecated `buf.slice()`) return a **view** on the same memory, not a copy. Changing the view changes the original. Use `Buffer.from(buf)` or `Uint8Array.prototype.slice` when you need a copy.",
        "Buffers live outside the V8 heap (in 'external' memory), so `process.memoryUsage().heapUsed` doesn't show large buffers. Check `external` and `arrayBuffers` too when investigating memory.",
      ],
      why: "Any time you touch files, crypto, images, webhooks with signatures, or base64 payloads (like data URLs or AWS responses), you're working with bytes. Mixing up bytes and characters causes broken uploads, wrong signatures, and corrupted text.",
      analogy: "A string is a sentence you can read. A buffer is the same sentence as a row of numbered beads, one bead per byte. Some letters (like é) need two beads.",
      code: {
        lang: 'js',
        source: `const a = Buffer.from('héllo', 'utf8');
console.log(a);                  // raw bytes
console.log(a.length);           // bytes, not characters
console.log('héllo'.length);     // characters
console.log(a.toString('base64'));
console.log(Buffer.from('aMOpbGxv', 'base64').toString('utf8'));

const b = Buffer.alloc(4);       // zero-filled
b.writeUInt32BE(258);            // 258 = 0x00000102
console.log(b);

const view = a.subarray(0, 1);   // shares memory with a
view[0] = 0x48;                  // 'H'
console.log(a.toString());       // the original changed too`,
      },
      output: "Prints <Buffer 68 c3 a9 6c 6c 6f>, then 6 (bytes), 5 (characters), aMOpbGxv, héllo, <Buffer 00 00 01 02>, and finally Héllo, showing the subarray shared memory with the original.",
      questions: [
        { q: 'What is a Buffer in Node.js?', a: 'A fixed-length sequence of raw bytes, implemented as a subclass of Uint8Array. Node uses buffers for file contents, network data, crypto and any binary data.' },
        { q: 'Why can buf.length differ from string.length?', a: 'buf.length counts bytes and string.length counts UTF-16 code units. Non-ASCII characters take more than one byte in UTF-8, so the byte count is larger.' },
        { q: 'Buffer.alloc vs Buffer.allocUnsafe?', a: 'alloc zero-fills the memory, so it is safe. allocUnsafe skips that step for speed, so it may contain leftover data from your process; only use it when you overwrite every byte.' },
        { q: 'Does buf.subarray() copy the data?', a: 'No, it returns a view on the same memory, so changes are visible in both. Use Buffer.from(buf) when you need an independent copy.' },
      ],
      answer30: "A Buffer is Node's type for raw bytes, a subclass of Uint8Array. Files, sockets and crypto all work with buffers. I create them with Buffer.from or Buffer.alloc and convert with toString, using encodings like utf8, base64 or hex. Two things to remember: length is in bytes, not characters, so non-ASCII text is longer than it looks, and subarray returns a view on the same memory, not a copy. Buffers are also stored outside the V8 heap, which matters when debugging memory.",
      mistakes: [
        "Using `new Buffer(...)`, which is deprecated and was a security risk.",
        "Setting `Content-Length` to `string.length` instead of `Buffer.byteLength(string)`.",
        "Building binary data with string concatenation (`data += chunk`), which corrupts multi-byte characters split across chunks. Collect buffers and use `Buffer.concat`, or set the stream's encoding.",
        "Trap: 'Is base64 encryption?' No. It's just an encoding that makes bytes safe to put in text. Anyone can decode it.",
      ],
      takeaway: 'Buffers are bytes: length is bytes, subarray shares memory, base64 is encoding not encryption.',
    },

    {
      id: 'event-emitter',
      title: 'EventEmitter',
      level: 'basic',
      priority: 'must',
      frequency: 'common',
      summary: 'EventEmitter lets an object announce events by name and lets any number of listeners react; emit runs listeners synchronously.',
      what: [
        "`EventEmitter` (from `node:events`) is Node's built-in publish/subscribe tool. An object calls `emit('name', data)`, and every function registered with `on('name', fn)` runs with that data.",
        "Much of Node is built on it: HTTP servers emit `'request'`, streams emit `'data'` and `'end'`, and `process` emits `'exit'` and `'SIGTERM'`.",
      ],
      deeper: [
        "`emit()` is **synchronous**: listeners run immediately, in the order they were added, before `emit()` returns. If a listener throws, the error goes back to whoever called emit. If a listener starts async work, emit doesn't wait for it.",
        "`'error'` is special. Emitting `'error'` with no error listener throws the error and, if nothing catches it, crashes the process. Always add an `'error'` listener on emitters you own (streams, sockets, custom emitters).",
        "`once()` registers a listener that removes itself after the first call. `events.once(emitter, 'name')` returns a promise, which is handy in async code. `on(emitter, 'name')` returns an async iterator.",
        "Node warns ('MaxListenersExceededWarning') when more than 10 listeners are added for one event. It's usually a leak: a listener added on every request and never removed. Remove listeners with `off()` when the subscriber goes away.",
      ],
      why: "It decouples code. The order service doesn't need to know about emails, analytics or audit logs; it just announces 'order placed' and other modules subscribe. Interviewers also use it to test whether you know emit is synchronous.",
      analogy: "A radio station. The station broadcasts on a channel (the event name), and anyone tuned in (listeners) hears it at the same moment. The station doesn't know or care who is listening.",
      code: {
        lang: 'js',
        source: `import { EventEmitter, once } from 'node:events';

class OrderService extends EventEmitter {
  place(order) {
    // ...save the order...
    this.emit('placed', order);
  }
}

const orders = new OrderService();
orders.on('placed', (o) => console.log('email sent for', o.id));
orders.once('placed', (o) => console.log('first order ever:', o.id));
orders.on('error', (err) => console.log('handled:', err.message));

console.log('before emit');
orders.place({ id: 1 });
orders.place({ id: 2 });
console.log('after emit');
console.log('listeners:', orders.listenerCount('placed'));

orders.emit('error', new Error('SMTP down')); // safe: we have an error listener

setTimeout(() => orders.place({ id: 3 }), 10);
const [o] = await once(orders, 'placed');    // promise version
console.log('awaited order', o.id);`,
      },
      output: "Prints: before emit, email sent for 1, first order ever: 1, email sent for 2, after emit, listeners: 1, handled: SMTP down, email sent for 3, awaited order 3. All listeners ran before 'after emit' because emit is synchronous, and the once listener ran only for the first order.",
      questions: [
        { q: 'Is EventEmitter.emit synchronous or asynchronous?', a: 'Synchronous. All listeners run one after another, in the order they were registered, before emit returns. If a listener does async work, emit does not wait for it.' },
        { q: 'What happens if you emit an error event with no listener?', a: 'Node throws the error. If nothing catches it, the process crashes with an uncaught exception. Always attach an error listener to streams and custom emitters.' },
        { q: 'What does MaxListenersExceededWarning mean?', a: 'More than 10 listeners were added for one event on one emitter. It is usually a memory leak, like adding a listener on every request without removing it. Fix the leak instead of just raising the limit.' },
        { q: 'When would you use EventEmitter in an Express app?', a: 'To decouple side effects, for example emitting user.registered so email, analytics and audit modules can react without the signup code knowing about them. For work that must not be lost, use a real queue like SQS instead, since in-memory events vanish if the process crashes.' },
      ],
      answer30: "EventEmitter is Node's built-in pub/sub. An object calls emit with an event name and data, and every listener registered with on runs. Streams, HTTP servers and process are all EventEmitters. Two important details: emit is synchronous, so listeners run before emit returns, and an error event with no listener crashes the process. I use it to decouple side effects inside one process, but for work that must survive a crash I use a queue.",
      mistakes: [
        "Assuming emit is async and that the code after it runs before the listeners.",
        "Forgetting an `'error'` listener on a stream or socket.",
        "Adding listeners inside a request handler and never removing them (a slow memory leak).",
        "Trap: 'Is EventEmitter a message queue?' No. It's in-memory and in-process. If the process restarts, events are lost, and other servers never see them.",
      ],
      takeaway: 'emit is synchronous, always handle "error", and remove listeners you add per request.',
    },

    {
      id: 'fs-and-path',
      title: 'fs and path',
      level: 'basic',
      priority: 'good',
      frequency: 'common',
      summary: 'Use fs/promises for async file work and path to build paths safely across operating systems, and never trust user-supplied file names.',
      what: [
        "`fs` is Node's file system module. It comes in three styles: callbacks (`fs.readFile(path, cb)`), promises (`import { readFile } from 'node:fs/promises'`), and synchronous (`fs.readFileSync`). In modern code, use the promise API with `await`.",
        "`path` builds and inspects file paths. `path.join` glues pieces with the right separator (`/` on Linux and macOS, `\\` on Windows), `path.resolve` gives an absolute path, and `path.extname` / `path.basename` / `path.dirname` pick paths apart.",
      ],
      deeper: [
        "Relative paths in `fs` are resolved against `process.cwd()` (where the process was started), not against the file that contains the code. Build paths from the module's folder (`__dirname` or `import.meta.dirname`) when you mean 'next to this file'.",
        "Sync functions block the event loop. They're fine at startup (reading config, loading certificates), never in request handlers. For large files, use streams instead of `readFile`, which loads everything into memory.",
        "Path traversal is the classic security bug: a user asks for `../../etc/passwd`. Resolve the final path and check it is still inside the allowed folder before touching the disk. Better still, never use user input as a file name: generate your own (a UUID) and store the original name in the database.",
        "Useful newer APIs: `fs.mkdir(dir, { recursive: true })`, `fs.rm(dir, { recursive: true, force: true })`, `fs.cp` for recursive copy, `fs.glob` (added in Node 22), and `fs.watch` for watching changes.",
      ],
      why: "Uploads, exports, logs, config files and temp files are everyday backend work. Getting paths wrong breaks the app when it's started from another folder or deployed to Linux from a Windows laptop, and getting them unsafe exposes the server's files.",
      analogy: "`path` is writing a postal address in the right format for the country. `fs` is the postal worker who actually delivers to that address. The traversal check is the mail room refusing any parcel addressed outside the building.",
      code: {
        lang: 'js',
        title: 'paths.mjs',
        source: `import path from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';

console.log(path.join('/srv/app', 'uploads', '../logs', 'a.txt'));
console.log(path.extname('resume.final.pdf'), path.basename('/x/y/resume.pdf', '.pdf'));
console.log(import.meta.dirname === path.dirname(import.meta.filename));

// Never trust a user-supplied file name
const UPLOAD_DIR = path.resolve('uploads');
function safePath(userName) {
  const full = path.resolve(UPLOAD_DIR, userName);
  if (!full.startsWith(UPLOAD_DIR + path.sep)) throw new Error('path traversal blocked');
  return full;
}

await mkdir(UPLOAD_DIR, { recursive: true });
await writeFile(safePath('note.txt'), 'hello');
console.log(await readFile(safePath('note.txt'), 'utf8'));
try { safePath('../../etc/passwd'); } catch (e) { console.log(e.message); }`,
      },
      output: "Prints /srv/app/logs/a.txt (join normalised the ..), then '.pdf resume', then true, then hello, then 'path traversal blocked'.",
      questions: [
        { q: 'What is the difference between path.join and path.resolve?', a: 'path.join simply joins segments and normalises the result, which may stay relative. path.resolve works right to left until it builds an absolute path, using the current working directory if needed.' },
        { q: 'readFile vs readFileSync vs createReadStream?', a: 'readFile is async and loads the whole file into memory. readFileSync does the same but blocks the event loop. createReadStream reads in chunks, which is right for large files or for piping to a response.' },
        { q: 'How do you prevent path traversal?', a: 'Resolve the requested path and check it still starts with the allowed base directory, or avoid user-supplied names entirely by generating your own file names and storing the original name in the database.' },
        { q: 'Relative paths in fs are relative to what?', a: 'To process.cwd(), the directory the process was started from, not to the source file. Use __dirname or import.meta.dirname to build paths relative to the code.' },
      ],
      answer30: "fs is the file system module; I use the fs/promises API with await, Sync calls only at startup, and streams for anything large. path builds paths safely across operating systems: join to combine, resolve for absolute paths, extname and basename to pick them apart. Relative fs paths resolve from the current working directory, so I build them from import.meta.dirname. For anything user-supplied, I guard against path traversal, or better, generate my own file names.",
      mistakes: [
        "Building paths with string concatenation (`dir + '/' + file`), which breaks on Windows and with stray slashes.",
        "Using `readFileSync` in a request handler.",
        "Checking `fs.existsSync` and then opening the file (a race condition). Just try the operation and handle `ENOENT`.",
        "Trap: 'Is `path.normalize` enough to stop traversal?' No. Normalising `../../etc/passwd` still gives a path outside your folder. You must compare against the allowed base directory.",
      ],
      takeaway: 'fs/promises for files, path for building paths, streams for big files, and validate every user-supplied path.',
    },

    {
      id: 'process-and-env',
      title: 'process, environment variables, and config',
      level: 'basic',
      priority: 'must',
      frequency: 'common',
      summary: 'process is the global object for the running program; read config from process.env, validate it once at startup, and keep secrets out of code.',
      what: [
        "`process` is a global object describing the running Node program: `process.env` (environment variables), `process.argv` (command line arguments), `process.cwd()`, `process.pid`, `process.memoryUsage()`, `process.exit()`, and events like `'SIGTERM'` and `'uncaughtException'`.",
        "**Environment variables** are key-value settings given to the process from outside, like `PORT=3000` or `DATABASE_URL=...`. They let the same code run in development, staging and production with different settings, and keep secrets out of the repository.",
      ],
      deeper: [
        "Every value in `process.env` is a **string** (or undefined). `process.env.ENABLE_X = false` stores `'false'`, which is truthy. Parse and validate all config once at startup (with zod or envalid), and fail fast if something required is missing.",
        "Loading `.env` files: since Node 20.6 you can run `node --env-file=.env app.js` (and `--env-file-if-exists` in newer versions), or call `process.loadEnvFile()` (Node 20.12+/21.7+), so the `dotenv` package is often no longer needed. Never commit `.env`; commit a `.env.example`.",
        "In production, secrets should come from a secret manager (AWS Secrets Manager, SSM Parameter Store) injected at deploy time, not from a file baked into the Docker image.",
        "`NODE_ENV=production` is a convention many libraries check (Express caches view templates and hides stack traces in error pages). Set it in production; Node itself doesn't change behaviour based on it.",
        "Prefer `process.exitCode = 1` and letting the process end naturally over `process.exit(1)`, which kills the process immediately and can cut off pending log writes.",
      ],
      why: "Twelve-factor apps keep config in the environment. Interviewers check that you don't hardcode secrets, that you know env values are strings, and that a missing variable fails the deploy instead of failing at 3 a.m. on the first request that needs it.",
      analogy: "process.env is the instruction note left for a house-sitter. The house (your code) is the same; each house-sitter (environment) gets a different note with different codes and phone numbers.",
      code: {
        lang: 'ts',
        title: 'config.ts: validate env once, fail fast',
        source: `import { z } from 'zod';

// Run with: node --env-file=.env dist/server.js  (Node 20.6+), or inject env vars in Docker/ECS
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().default(3000),        // env values are strings: coerce
  MONGO_URI: z.string().url(),
  JWT_SECRET: z.string().min(32),
  ENABLE_AUDIT_LOG: z.enum(['true', 'false']).default('true').transform((v) => v === 'true'),
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment config:', parsed.error.flatten().fieldErrors);
  process.exit(1); // crash at startup, not on the first request
}

export const config = parsed.data; // typed: config.PORT is a number`,
      },
      output: "If MONGO_URI is missing or JWT_SECRET is too short, the server refuses to start and prints exactly which variables are wrong. Otherwise the rest of the app imports a typed `config` object where PORT is a number and ENABLE_AUDIT_LOG is a real boolean.",
      questions: [
        { q: 'What is the process object?', a: 'A global object that represents the running Node process. It gives you env variables, command line arguments, the working directory, memory usage, exit codes, and events like SIGTERM and uncaughtException.' },
        { q: 'What type are values in process.env?', a: 'Always strings, or undefined if not set. So "false" is truthy and "3000" must be converted to a number. Parse and validate them once at startup.' },
        { q: 'How do you manage secrets in a Node app?', a: 'Read them from environment variables, never hardcode or commit them. Locally use a git-ignored .env file; in production inject them from a secret manager like AWS Secrets Manager or SSM Parameter Store at deploy time.' },
        { q: 'Do you still need the dotenv package?', a: 'Often not. Node 20.6+ supports node --env-file=.env, and process.loadEnvFile() exists in Node 20.12+ and 21.7+. dotenv is still fine, especially on older versions or for extra features.' },
      ],
      answer30: "process is the global object for the running program; I mostly use process.env for config, plus signal events for graceful shutdown. Environment variables let the same build run in every environment and keep secrets out of git. Every env value is a string, so I parse and validate them once at startup with a schema like zod and crash early if something is missing. Locally I use a .env file, now loadable natively with node --env-file; in production secrets come from a secret manager.",
      mistakes: [
        "Hardcoding secrets or committing `.env` files.",
        "Treating `process.env.FLAG` as a boolean: `'false'` is truthy.",
        "Reading `process.env` all over the codebase instead of in one validated config module.",
        "Trap: 'Is it safe to log process.env when debugging?' No, it contains secrets, and logs are often shipped to third-party tools.",
      ],
      takeaway: 'Config comes from env, env values are strings, validate once at startup and never commit secrets.',
    },

    {
      id: 'process-error-handling',
      title: 'Error handling: uncaughtException and unhandledRejection',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Handle errors where they happen; use process-level handlers only to log and exit cleanly, because the process state may be corrupt.',
      what: [
        "Errors in Node come in a few shapes: thrown errors in synchronous code (caught by `try/catch`), rejected promises (caught by `await` inside `try/catch` or `.catch()`), error-first callbacks (`(err, data) => ...`), and `'error'` events on emitters and streams.",
        "When an error escapes all of that, Node raises a process-level event. A thrown error nobody caught triggers **`uncaughtException`**. A rejected promise nobody handled triggers **`unhandledRejection`**. Since Node 15, an unhandled rejection crashes the process by default, just like an uncaught exception.",
      ],
      deeper: [
        "Separate **operational errors** (expected failures: invalid input, a timeout, a 404 from another service; handle them and respond) from **programmer errors** (bugs: reading a property of undefined; the code is wrong). For programmer errors the safe move is to crash and let a supervisor (ECS, Kubernetes, PM2) restart a clean process.",
        "`process.on('uncaughtException')` is a last-resort logger, not a way to keep going. After an unknown exception, the process may hold half-finished state (open transactions, locked resources), so log it, try to flush, and exit with a non-zero code.",
        "An `unhandledRejection` handler that only logs (and doesn't exit) hides bugs. A common pattern is to rethrow inside it so both kinds of failure go through one exit path, as in the example.",
        "Other tools: `AbortController` and `AbortSignal.timeout(ms)` to cancel slow work, `Error.cause` (`new Error('Save failed', { cause: err })`) to wrap errors without losing the original, and custom error classes with an HTTP status for an API's error middleware.",
      ],
      why: "A silently swallowed error leaves users with hanging requests and corrupt data; a crash loop takes the whole service down. Interviewers want to hear a deliberate strategy: handle what you expect, crash on what you don't, and make sure crashes are logged and restarted.",
      analogy: "A kitchen fire. Small expected problems (a burnt toast) you handle on the spot. A fire you didn't expect means you don't keep cooking in a smoky kitchen: you note what happened, evacuate cleanly, and a fresh shift (a restarted process) takes over.",
      code: {
        lang: 'js',
        title: 'errors.cjs',
        source: `process.on('unhandledRejection', (reason) => {
  console.log('unhandledRejection:', reason.message);
  throw reason; // rethrow so every fatal error goes through one exit path
});

process.on('uncaughtException', (err, origin) => {
  console.log(\`uncaughtException (\${origin}):\`, err.message);
  // log to your logger, flush, then exit: the process state may be corrupt
  process.exitCode = 1;
});

async function loadUser() { throw new Error('DB connection lost'); }

loadUser(); // bug: no await and no .catch()
console.log('this line still runs first');`,
      },
      output: "Prints 'this line still runs first', then 'unhandledRejection: DB connection lost', then 'uncaughtException (uncaughtException): DB connection lost', and the process exits with code 1. Without any handlers, Node prints the error with its stack trace and also exits with code 1.",
      questions: [
        { q: 'What is the difference between uncaughtException and unhandledRejection?', a: 'uncaughtException fires when a thrown error is not caught by any try/catch. unhandledRejection fires when a promise is rejected and no .catch() or await handles it. Since Node 15, both crash the process by default.' },
        { q: 'Should you keep the server running after an uncaughtException?', a: 'No. The process may be in an unknown state, with half-finished operations or leaked resources. Log the error, flush logs, close what you can, exit with a non-zero code, and let the supervisor (ECS, Kubernetes, PM2) restart it.' },
        { q: 'What are operational vs programmer errors?', a: 'Operational errors are expected failures in a correct program, like invalid input, timeouts or a downstream 503; you handle them and return a proper response. Programmer errors are bugs, like calling a method on undefined; the fix is to crash, restart, and fix the code.' },
        { q: 'How do you handle errors in async/await code?', a: 'Wrap awaits in try/catch where you can actually do something about the error, otherwise let it propagate to a central handler, such as Express error middleware. Never leave a promise without await or .catch().' },
      ],
      answer30: "I handle errors at the right level: try/catch around awaits where I can recover, error listeners on streams, and a central error handler in Express that maps known errors to status codes. I split errors into operational ones, like bad input or a timeout, which I handle, and programmer errors, which are bugs. For anything that escapes, uncaughtException and unhandledRejection are last-resort hooks: I log, flush, and exit with a non-zero code, and the orchestrator restarts a clean process. Since Node 15, unhandled rejections crash the process by default.",
      mistakes: [
        "Using `process.on('uncaughtException')` to log and carry on as if nothing happened.",
        "Fire-and-forget promises (`sendEmail(user)` with no await or catch) that later crash the process.",
        "`catch (e) {}`: swallowing errors silently.",
        "Trap: 'Does try/catch catch an error thrown inside a setTimeout callback?' No. The callback runs later on a different call stack, after the try block has finished. Handle errors inside the callback, or use promises with await.",
      ],
      takeaway: 'Handle expected errors locally, centralise the rest, and treat process-level handlers as log-and-exit, not recovery.',
    },

    {
      id: 'graceful-shutdown',
      title: 'Graceful shutdown',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'On SIGTERM, stop taking new requests, finish in-flight work, close DB and queue connections, then exit, with a timeout as a safety net.',
      what: [
        "When you deploy or scale down, the platform (Docker, ECS, Kubernetes, PM2) sends your process a **SIGTERM** signal, waits a grace period (ECS and Kubernetes default to 30 seconds), and then force-kills it with SIGKILL.",
        "Graceful shutdown means using that grace period well: stop accepting new connections, let requests that are already running finish, close database and queue connections, flush logs and buffers, and then exit.",
      ],
      deeper: [
        "`server.close()` stops accepting new connections and calls back once existing ones have ended. Since Node 19, it also closes idle keep-alive connections; on Node 18 call `server.closeIdleConnections()` yourself. `server.closeAllConnections()` is the forceful version.",
        "Add a forced-exit timer slightly shorter than the platform's grace period, and `unref()` it so the timer itself doesn't keep the process alive.",
        "Behind a load balancer, fail the readiness/health check first so the balancer stops sending new traffic, then close the server. Queue workers should stop polling, finish (or release) the current message, and only then exit, so the message isn't processed twice or lost.",
        "Docker gotcha: if your container runs `npm start`, npm may not forward SIGTERM to Node, so the app is SIGKILLed after the timeout. Use `CMD [\"node\", \"dist/server.js\"]` directly, or an init process (`docker run --init`, tini).",
      ],
      why: "Without it, every deploy drops in-flight requests (users see 502s), interrupts half-written database work, and loses buffered logs. It matters even more for background workers processing queue messages.",
      analogy: "A shop closing for the night. You flip the sign to 'Closed' (no new customers), serve the people already inside, cash up the till (flush buffers), lock the doors (close connections), and only then go home. If it takes too long, security locks up anyway (SIGKILL).",
      code: {
        lang: 'js',
        title: 'shutdown.mjs',
        source: `import http from 'node:http';

const server = http.createServer((req, res) => {
  setTimeout(() => res.end('slow response finished\\n'), 500); // an in-flight request
});
server.listen(3000);

let shuttingDown = false;
function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(\`\${signal} received: stop accepting new connections\`);

  const force = setTimeout(() => { console.error('forced exit'); process.exit(1); }, 25_000);
  force.unref(); // don't let this timer keep the process alive

  server.close(async () => {          // waits for in-flight requests to finish
    // await mongoose.disconnect(); await sqsConsumer.stop(); await auditBuffer.flush();
    console.log('closed cleanly');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM')); // Docker / ECS / Kubernetes
process.on('SIGINT', () => shutdown('SIGINT'));   // Ctrl+C locally`,
      },
      output: "If a request is in progress when SIGTERM arrives, the client still receives 'slow response finished', and only then does the process log 'closed cleanly' and exit with code 0. New connections are refused as soon as the signal arrives. If cleanup hangs, the forced-exit timer exits with code 1 before the platform's SIGKILL.",
      questions: [
        { q: 'What is graceful shutdown?', a: 'Handling SIGTERM by stopping new requests, letting in-flight requests finish, closing database and queue connections, flushing logs, and then exiting, instead of dying mid-request.' },
        { q: 'What does server.close() do?', a: 'It stops the server accepting new connections and runs its callback once all existing connections have closed. In Node 19+ it also closes idle keep-alive connections; on Node 18 you call closeIdleConnections() yourself.' },
        { q: 'Why add a timeout to graceful shutdown?', a: 'A hung request or connection could keep the process alive forever. A forced exit just under the platform\'s grace period (30 seconds by default on ECS and Kubernetes) makes sure you exit on your own terms, with logs, before SIGKILL.' },
        { q: 'Why might your Node app in Docker never receive SIGTERM?', a: 'If the container starts with npm start or a shell script, the signal may go to npm or the shell instead of Node. Run node directly as the container command, or use an init like tini or docker run --init.' },
      ],
      answer30: "When a container is stopped, the platform sends SIGTERM and later SIGKILL. I listen for SIGTERM, mark the service as not ready, call server.close so no new connections come in while in-flight requests finish, then close Mongo, stop queue consumers, flush any buffered logs, and exit with code 0. A forced-exit timer just under the grace period is the safety net. In Docker I run node directly, not through npm, so the signal actually reaches the process.",
      mistakes: [
        "No SIGTERM handler at all, so every deploy cuts off in-flight requests.",
        "Calling `process.exit()` immediately inside the handler, which defeats the purpose.",
        "Forgetting background workers: they need to stop polling and finish the current job too.",
        "Trap: 'Can you catch SIGKILL?' No. SIGKILL can't be caught or handled; that's exactly why you must finish within the SIGTERM grace period.",
      ],
      takeaway: 'SIGTERM -> stop new work -> finish in-flight -> close resources -> exit, with a timeout as backup.',
    },

    {
      id: 'worker-threads-child-process-cluster',
      title: 'worker_threads vs child_process vs cluster',
      level: 'advanced',
      priority: 'must',
      frequency: 'common',
      summary: 'worker_threads run CPU work on extra threads in one process; child_process runs separate programs; cluster runs copies of your server sharing one port.',
      what: [
        "Node gives you three ways to use more than one CPU core or run work outside the main thread:",
        "**worker_threads**: extra JavaScript threads inside the same process. Each has its own V8 instance and event loop. Use them for CPU-heavy work (image resizing, PDF parsing, big calculations) so the main thread stays free.",
        "**child_process**: start a completely separate program (`spawn`, `exec`, `execFile`, `fork`). Use it to run other tools (ffmpeg, git, a Python script) or isolate risky work in its own memory.",
        "**cluster**: start several copies of your Node server (workers) that share the same port. The primary process hands incoming connections to workers. It's for using all CPU cores to serve more HTTP traffic.",
      ],
      deeper: [
        "Workers communicate by messages (`postMessage`), which copies data with the structured clone algorithm. To avoid copying big data, transfer an `ArrayBuffer` (ownership moves to the other thread) or use `SharedArrayBuffer` with `Atomics`. Starting a worker has a cost (tens of milliseconds and some memory), so use a **pool** (like `piscina`) for repeated tasks instead of a new worker per request.",
        "child_process: `spawn` streams output and is right for long-running or chatty commands. `exec` buffers the whole output and runs through a shell, so never pass user input to it (command injection). `execFile` skips the shell. `fork` starts another Node script with a built-in message channel.",
        "cluster: each worker is a full process with its own memory, so in-memory state (sessions, caches, rate-limit counters) is **not shared**. Keep that state in Redis or the database. In containers, many teams skip cluster and run one Node process per container, scaling the number of containers instead.",
        "Worker threads don't help I/O-bound code. If your API is slow because of database queries, more threads won't fix it; better queries, indexes or caching will.",
      ],
      why: "It's the standard follow-up to 'Node is single-threaded'. Interviewers want to see you pick the right tool: worker threads for CPU work, child processes for external programs and isolation, cluster or more containers for throughput.",
      analogy: "worker_threads are extra cooks in the same kitchen, sharing the building but each with their own station. child_process is hiring a separate catering company for one job. cluster is opening several identical branches of the restaurant under one phone number.",
      code: {
        lang: 'js',
        title: 'worker.mjs: CPU work off the main thread',
        source: `import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';

function fib(n) { return n < 2 ? n : fib(n - 1) + fib(n - 2); } // deliberately CPU-heavy

if (isMainThread) {
  const ticker = setInterval(() => console.log('main thread still responsive'), 200);
  const worker = new Worker(new URL(import.meta.url), { workerData: 40 }); // same file
  worker.on('message', (result) => {
    console.log('fib(40) from worker =', result);
    clearInterval(ticker);
  });
  worker.on('error', (err) => console.error('worker failed', err));
} else {
  parentPort.postMessage(fib(workerData)); // runs on its own thread and event loop
}`,
      },
      output: "'main thread still responsive' prints every 200 ms while the worker computes, then 'fib(40) from worker = 102334155'. If you call fib(40) directly on the main thread instead, nothing else can print until it finishes.",
      questions: [
        { q: 'When would you use worker_threads?', a: 'For CPU-bound work like image processing, parsing big files, encryption or heavy calculations, so the main event loop keeps serving requests. Use a worker pool for repeated tasks. They do not help with I/O-bound work.' },
        { q: 'What is the difference between worker_threads and cluster?', a: 'Worker threads run inside one process and are for offloading CPU tasks; they can share memory via SharedArrayBuffer. Cluster forks multiple processes that each run the whole server and share a port, to use all CPU cores for handling requests. Cluster workers share no memory.' },
        { q: 'spawn vs exec in child_process?', a: 'spawn starts a process and streams its output, good for long-running commands or large output. exec runs the command through a shell and buffers the whole output, so it has a size limit and is dangerous with user input.' },
        { q: 'With cluster, why does an in-memory rate limiter or session store break?', a: 'Each cluster worker is a separate process with its own memory, and the load is spread between them, so each worker only sees part of the traffic. Shared state must live in Redis or a database.' },
      ],
      answer30: "worker_threads give me extra JavaScript threads in the same process, each with its own event loop, for CPU-heavy work like parsing or image processing, ideally through a pool. child_process starts separate programs, like ffmpeg or a Python script; I prefer spawn or execFile and never pass user input to exec. cluster forks several copies of the whole server sharing one port to use every core. Cluster workers share no memory, so sessions and rate limits go to Redis. In containers I usually run one process per container and scale containers instead.",
      mistakes: [
        "Using worker threads to 'speed up' database calls. They're I/O-bound; threads don't help.",
        "Creating a new Worker per request instead of reusing a pool.",
        "Passing user input to `exec` (command injection).",
        "Trap: 'Do worker threads share variables with the main thread?' No. Each has its own isolated heap; only messages, transferred ArrayBuffers and SharedArrayBuffer cross between them.",
      ],
      takeaway: 'CPU work -> worker_threads; other programs -> child_process; more throughput -> cluster or more containers.',
    },

    {
      id: 'scaling-node',
      title: 'Scaling Node: cluster, PM2, and horizontal scaling',
      level: 'advanced',
      priority: 'good',
      frequency: 'common',
      summary: 'Use every core (cluster/PM2 or one container per core), scale out behind a load balancer, keep servers stateless, and move slow work to queues.',
      what: [
        "One Node process uses roughly one CPU core for your JavaScript. To handle more traffic you scale in two directions: **use every core on a machine** (several Node processes) and **add more machines or containers** behind a load balancer (horizontal scaling).",
        "**PM2** is a process manager for running Node on a server or VM: it restarts crashed processes, runs cluster mode across all cores (`pm2 start app.js -i max`), does zero-downtime reloads, and collects logs. On container platforms like ECS or Kubernetes, the platform does those jobs, so you usually run plain `node` in each container.",
      ],
      deeper: [
        "**Stateless servers** are the key to horizontal scaling: any request can go to any instance. That means no sessions in memory (use JWTs or a Redis session store), no uploads saved to local disk (use S3), and no in-memory caches that must be consistent (use Redis).",
        "**Move slow work out of the request.** Long jobs (bulk imports, emails, AI calls, reports) go onto a queue (SQS, BullMQ), and separate worker processes handle them. The API returns quickly with a job id, and workers scale independently based on queue depth.",
        "Find the real bottleneck before adding servers. It's usually the database (missing indexes, too many connections), not Node. Each instance has its own DB connection pool, so 20 instances with pools of 10 means 200 connections; size pools accordingly.",
        "WebSockets and other sticky connections need either sticky sessions at the load balancer or a shared pub/sub (like the Socket.IO Redis adapter) so messages reach users connected to other instances.",
        "Auto-scaling signals: CPU, request latency, event loop delay, or queue depth for workers.",
      ],
      why: "'How would you scale this?' follows almost every system design or project discussion. A good answer shows you know the order: measure, remove the bottleneck, make the app stateless, then scale out.",
      analogy: "A busy coffee shop. First make sure each barista works efficiently (no blocking), then add baristas at the same counter (cluster), then open more counters with a host directing customers (load balancer). Any counter must be able to serve any customer, so orders aren't kept in one barista's head (stateless).",
      code: [
        {
          lang: 'js',
          title: 'ecosystem.config.cjs for PM2 on a VM',
          source: `module.exports = {
  apps: [
    {
      name: 'api',
      script: 'dist/server.js',
      instances: 'max',          // one process per CPU core
      exec_mode: 'cluster',      // share port 3000 across processes
      max_memory_restart: '512M',
      env: { NODE_ENV: 'production', PORT: 3000 },
    },
    {
      name: 'bulk-upload-worker', // queue consumer scaled separately from the API
      script: 'dist/worker.js',
      instances: 2,
    },
  ],
};
// pm2 start ecosystem.config.cjs  |  pm2 reload api (zero-downtime)  |  pm2 logs`,
        },
      ],
      output: "PM2 starts one API process per CPU core, all sharing port 3000, plus two queue-worker processes. Crashed processes restart automatically, `pm2 reload api` restarts them one at a time without downtime, and a process using more than 512 MB is restarted.",
      questions: [
        { q: 'How do you scale a Node.js application?', a: 'First fix bottlenecks (usually the database and blocking code). Then use all CPU cores with cluster or PM2, or one process per container, and scale horizontally behind a load balancer. Keep servers stateless and move long jobs to queues with separate workers.' },
        { q: 'What does PM2 do?', a: 'It is a production process manager: it restarts crashed processes, runs cluster mode across cores, does zero-downtime reloads, restarts on memory limits, and manages logs. On ECS or Kubernetes those jobs are usually done by the platform instead.' },
        { q: 'What does stateless mean and why does it matter?', a: 'No user-specific data lives in a single server\'s memory or disk between requests. Sessions, files and caches go to Redis, S3 or the database. Then the load balancer can send any request to any instance, and instances can be added or removed freely.' },
        { q: 'Your API is slow because of a 2-minute report job. How do you fix it?', a: 'Move it out of the request: put a job on a queue like SQS, return 202 with a job id, process it in a separate worker, and let the client poll or get notified. The workers can then scale on queue depth.' },
      ],
      answer30: "I scale Node in layers. First I make sure the event loop isn't blocked and the database isn't the bottleneck. Then I use every core, with PM2 cluster mode on a VM, or one process per container on ECS. Then I scale horizontally behind a load balancer, which only works if the app is stateless: sessions in JWTs or Redis, files in S3. Slow work like bulk uploads goes onto a queue such as SQS, with workers that scale on queue depth, so the API stays fast.",
      mistakes: [
        "Adding servers before checking whether the database is the real bottleneck.",
        "Keeping sessions, rate-limit counters or uploaded files in local memory or disk, then scaling out.",
        "Running PM2 cluster mode inside every container on ECS/Kubernetes without thinking: it doubles up process management and makes CPU limits confusing.",
        "Trap: 'Does cluster share memory between workers?' No. Each worker is a separate process; anything shared must go through Redis, a database, or messages to the primary.",
      ],
      takeaway: 'Fix the bottleneck, use all cores, go stateless, scale out, and push slow work to queues.',
      note: "On your resume: the SQS + S3 bulk-upload pipeline on Octagnt (see the projects stack, 'sqs-bulk-pipeline') is a concrete example of moving slow work out of the request and scaling workers separately.",
    },

    {
      id: 'memory-leaks-profiling',
      title: 'Memory leaks and profiling',
      level: 'advanced',
      priority: 'good',
      frequency: 'common',
      summary: 'A leak is memory that stays reachable by mistake; find it with memory metrics, heap snapshots compared over time, and CPU profiles for slowness.',
      what: [
        "JavaScript has a garbage collector: memory is freed when nothing references it any more. A **memory leak** happens when your code keeps a reference to data it no longer needs, so the garbage collector can't free it. Memory grows slowly until the process crashes with 'JavaScript heap out of memory' or the container is killed.",
        "Common causes: a global or module-level cache with no size limit or expiry, event listeners added on every request and never removed, timers (`setInterval`) that are never cleared, closures that capture big objects, and arrays used as 'temporary' buffers that never get emptied.",
      ],
      deeper: [
        "Detect: watch memory over time (`process.memoryUsage()`: `rss`, `heapUsed`, `external`), in your APM or CloudWatch. A sawtooth pattern that returns to the same baseline is normal GC; a baseline that keeps climbing under steady traffic is a leak.",
        "Find: take **heap snapshots** (Chrome DevTools via `node --inspect`, `v8.writeHeapSnapshot()`, or `--heapsnapshot-signal=SIGUSR2`), run traffic, take another, and use the 'Comparison' view to see which object types grew and what retains them (the retainers chain).",
        "Slowness is a different tool: **CPU profiles** (`node --cpu-prof`, DevTools Performance tab, clinic.js, 0x flame graphs) show which functions use the CPU. Event loop delay tells you whether something is blocking.",
        "`--max-old-space-size` sets the V8 heap limit (in MB). Node picks a default heap limit from the memory it can see, and how well that respects container limits has varied by version, so in containers many teams set it explicitly to roughly 75% of the container's memory. Raising it only delays a real leak.",
        "Bounded caches: use an LRU with a max size and TTL (like `lru-cache`), or Redis. `WeakMap` and `WeakRef` hold objects without preventing garbage collection, useful for per-object metadata.",
      ],
      why: "Leaks show up only after hours or days in production, as restarts or slowly rising latency, which makes them hard to reproduce. Interviewers want a calm, methodical process, not guesses.",
      analogy: "A desk where you keep every paper 'just in case'. Each paper is small, but after a month you have no room to work. The cleaner (garbage collector) only throws away papers that nobody is holding, so as long as you keep holding them, they stay.",
      code: {
        lang: 'js',
        title: 'leak.mjs (run with node --expose-gc leak.mjs)',
        source: `const cache = new Map(); // module-level: lives as long as the process

function handleRequest(id) {
  // BUG: every request adds an entry and nothing ever removes it
  cache.set(\`req-\${id}\`, { id, payload: 'x'.repeat(10_000) });
}

const mb = () => (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(0) + ' MB';
console.log('start', mb());
for (let round = 1; round <= 3; round++) {
  for (let i = 0; i < 10_000; i++) handleRequest(\`\${round}-\${i}\`);
  globalThis.gc?.(); // force GC: anything still growing is really retained
  console.log(\`after round \${round}:\`, mb(), \`(\${cache.size} entries)\`);
}
// Fix: an LRU cache with max size and TTL, e.g. new LRUCache({ max: 1000, ttl: 60_000 })`,
      },
      output: "heapUsed climbs every round (on Node 26 roughly 4 MB at the start, then about 10, 15 and 21 MB) and the cache reports 10000, 20000 and 30000 entries. Even after a forced garbage collection the memory doesn't come back, because the Map still references every entry. Exact numbers vary by machine and version.",
      questions: [
        { q: 'What causes memory leaks in Node.js?', a: 'Data that stays referenced when it is no longer needed: unbounded global caches or arrays, event listeners and timers that are never removed, and closures holding large objects. The garbage collector can only free memory nothing points to.' },
        { q: 'How would you find a memory leak in production?', a: 'Confirm it with memory metrics over time under steady load. Then take two or three heap snapshots some time apart (DevTools, v8.writeHeapSnapshot or --heapsnapshot-signal), compare them to see which objects grow, and follow the retainers to the code holding them.' },
        { q: 'What is the difference between heapUsed and rss?', a: 'heapUsed is memory used by JavaScript objects on the V8 heap. rss (resident set size) is the total memory the process holds, including the heap, buffers, native code and stacks. Large buffers show in external and rss but not heapUsed.' },
        { q: 'Does increasing --max-old-space-size fix a leak?', a: 'No, it only delays the crash. It is right when the app legitimately needs more memory, but a leak keeps growing whatever the limit.' },
      ],
      answer30: "A memory leak in Node is memory that's still referenced, so the garbage collector can't free it: unbounded caches, listeners added per request, intervals never cleared, closures holding big objects. I spot it as a baseline that keeps rising in memory graphs under steady load. To find it, I take heap snapshots some time apart, compare them in Chrome DevTools, and follow the retainer chain to the code. For slowness rather than memory, I use CPU profiles and flame graphs. The usual fix is bounding things: LRU caches with TTLs and cleaning up listeners and timers.",
      mistakes: [
        "Raising `--max-old-space-size` and calling the leak fixed.",
        "Using a plain object or Map as a cache with no limit or expiry.",
        "Taking a single heap snapshot. You need at least two to compare what grew.",
        "Trap: 'Memory goes up and down all day: is that a leak?' Not necessarily. A sawtooth that returns to the same baseline is normal garbage collection. A leak is a rising baseline.",
      ],
      takeaway: 'Leaks are forgotten references; prove them with metrics, find them with compared heap snapshots, fix them by bounding.',
    },

    {
      id: 'npm-package-json-semver',
      title: 'npm, package.json, semver, and lockfiles',
      level: 'basic',
      priority: 'must',
      frequency: 'common',
      summary: 'package.json declares dependencies with semver ranges; the lockfile pins exact versions; npm ci installs exactly what the lockfile says.',
      what: [
        "`package.json` describes a project: its name, scripts (`npm run build`), dependencies, and settings like `\"type\": \"module\"` and `\"engines\"`. **dependencies** are needed at runtime; **devDependencies** are only for development and builds (TypeScript, Jest, ESLint).",
        "**Semantic versioning (semver)** is `MAJOR.MINOR.PATCH`: patch for bug fixes, minor for new backwards-compatible features, major for breaking changes. `^1.4.2` allows `1.x.x` from 1.4.2 up (not 2.0.0). `~1.4.2` allows only patch updates (`1.4.x`). `1.4.2` means exactly that version.",
        "The **lockfile** (`package-lock.json`) records the exact version of every package in the tree, including dependencies of dependencies, so every machine installs the same thing.",
      ],
      deeper: [
        "`npm install` resolves ranges and may update the lockfile. `npm ci` deletes `node_modules`, installs exactly what the lockfile says, and fails if `package.json` and the lockfile disagree. Use `npm ci` in CI and Docker builds; always commit the lockfile for applications.",
        "Caret on `0.x` versions is stricter: `^0.3.1` allows only `0.3.x`, because in 0.x a minor bump may be breaking.",
        "`npx` runs a package's binary without installing it globally. `peerDependencies` declare 'I need the host app to provide this' (a React component library and React). `overrides` force a version deep in the tree, often to patch a vulnerable sub-dependency.",
        "Supply-chain safety: review new dependencies, run `npm audit` (or Dependabot/Snyk), use `npm ci`, and be careful with install scripts. Several popular npm packages have been hijacked to publish malicious versions, which is exactly why lockfiles and pinned CI installs matter.",
        "The `\"engines\"` field documents which Node versions you support; pair it with `.nvmrc` and the Docker base image so local, CI and production all match.",
      ],
      why: "'Works on my machine' bugs often come from different dependency versions. Understanding ranges and lockfiles is how you get reproducible builds and safe upgrades, which matters during runtime upgrades like Node 18 to 20.",
      analogy: "package.json is a shopping list that says 'milk, any brand under 2 litres'. The lockfile is the receipt: the exact brand and size you bought last time, so the next shop matches it.",
      code: {
        lang: 'json',
        title: 'package.json for an Express + TypeScript API',
        source: `{
  "name": "candidate-api",
  "version": "2.3.0",
  "private": true,
  "type": "commonjs",
  "engines": { "node": ">=22" },
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/server.js",
    "test": "jest --coverage"
  },
  "dependencies": {
    "express": "^5.1.0",
    "mongoose": "^8.9.0",
    "zod": "~3.24.1"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "jest": "^29.7.0",
    "supertest": "^7.0.0"
  }
}`,
      },
      output: "`npm ci` installs exactly the versions in package-lock.json. On `npm install`, express can move to any 5.x at or above 5.1.0, zod only to newer 3.24.x patches, and nothing can jump a major version. Dev tools are skipped with `npm ci --omit=dev` in a production image.",
      questions: [
        { q: 'What is the difference between ^ and ~ in package.json?', a: 'Caret (^1.2.3) allows minor and patch updates within the same major version, so up to but not including 2.0.0. Tilde (~1.2.3) allows only patch updates, so 1.2.x. For 0.x versions, caret only allows patch updates.' },
        { q: 'npm install vs npm ci?', a: 'npm install resolves version ranges and can update the lockfile. npm ci removes node_modules and installs exactly what the lockfile says, failing if it does not match package.json. Use npm ci in CI and Docker builds for reproducible installs.' },
        { q: 'Should you commit package-lock.json?', a: 'Yes, for applications. It guarantees every developer, CI run and production build gets the same dependency tree. Libraries also commit it for their own development, but consumers ignore it.' },
        { q: 'dependencies vs devDependencies?', a: 'dependencies are needed when the app runs, like Express and Mongoose. devDependencies are only needed for development, testing or building, like TypeScript, Jest and ESLint, and can be left out of production images.' },
      ],
      answer30: "package.json lists scripts and dependencies with semver ranges: caret allows minor and patch updates, tilde only patches. The lockfile pins the exact version of every package in the tree, so I always commit it. In CI and Docker I use npm ci, which installs exactly the lockfile and fails if it's out of sync. I keep build tools in devDependencies and omit them in production images, run npm audit or Dependabot for vulnerabilities, and pin the Node version with engines, .nvmrc and the Docker base image.",
      mistakes: [
        "Not committing the lockfile, or deleting it to 'fix' install errors.",
        "Using `npm install` in CI, so builds can silently pick up new versions.",
        "Putting TypeScript or Jest in `dependencies`, bloating production images.",
        "Trap: 'Does `^1.2.3` protect you from breaking changes?' Only if the package author follows semver correctly. Many breaking changes have shipped in minor versions, which is why the lockfile and tests matter.",
      ],
      takeaway: 'Ranges in package.json, exact versions in the lockfile, npm ci for reproducible builds.',
      note: "Version numbers in the sample package.json are illustrative. Check the latest releases before copying them.",
    },

    {
      id: 'node-security-basics',
      title: 'Security basics for Node.js',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Validate every input, prevent injection, keep secrets and dependencies safe, never block the loop on user input, and run with least privilege.',
      what: [
        "Most Node security problems come from trusting input. Anything from the client (body, query, params, headers, cookies, uploaded files) can be crafted by an attacker. Validate its shape and size, and never pass it straight into a database query, a shell command, a file path, or `eval`.",
        "The main risks to know: **injection** (NoSQL/SQL injection, command injection), **path traversal**, **prototype pollution**, **ReDoS** (regular expressions that take forever on crafted input), **leaked secrets**, and **vulnerable or malicious dependencies**.",
      ],
      deeper: [
        "**NoSQL injection** in MongoDB: if a login handler does `User.findOne({ email, password: req.body.password })` and the attacker sends `{ \"password\": { \"$ne\": null } }`, the query matches any user. Validate types with a schema (zod/joi) so a string field can't become an object, and enable Mongoose `sanitizeFilter` or strip keys starting with `$`.",
        "**Prototype pollution**: merging user JSON into objects can set `__proto__` and add properties to every object in the process. Use schema validation, `Object.create(null)` or `Map` for user-keyed data, and keep libraries like lodash updated.",
        "**DoS on a single thread**: one huge JSON body, a catastrophic regex, or a sync hash on user input blocks every request. Limit body size (`express.json({ limit: '100kb' })`), add rate limits, and set timeouts.",
        "**Secrets and errors**: secrets come from env vars or a secret manager, never the repo. Don't return stack traces to clients in production.",
        "**Dependencies**: commit the lockfile, use `npm ci`, run `npm audit` or Dependabot, and think twice about tiny packages with install scripts. **Least privilege**: run containers as a non-root user, and know that Node 20 added an experimental permission model (`--experimental-permission`), which became stable as `--permission` in Node 22.13 and 23.5, to restrict file system, child process and worker access.",
      ],
      why: "A Node API usually sits in front of your most sensitive data. Interviewers for full-stack roles expect you to name concrete risks and the concrete fix for each, not just 'we use HTTPS'.",
      analogy: "A building's security desk. You check every visitor's ID (validation), never let them write on the master key list (injection), limit how long anyone can block the front door (rate limits and size limits), and give staff keys only to the rooms they need (least privilege).",
      code: {
        lang: 'ts',
        title: 'Blocking NoSQL injection with schema validation',
        source: `import { z } from 'zod';

const LoginBody = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(128), // must be a string: blocks { "$ne": null }
});

app.post('/login', express.json({ limit: '10kb' }), async (req, res) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });

  const { email, password } = parsed.data;
  const user = await User.findOne({ email }).select('+passwordHash');
  const ok = user && (await bcrypt.compare(password, user.passwordHash)); // never query by password
  if (!ok) return res.status(401).json({ error: 'Invalid email or password' }); // same message either way

  // ...issue JWT in an httpOnly cookie...
  res.sendStatus(204);
});`,
      },
      output: "A normal login works. A body like { \"email\": \"a@b.com\", \"password\": { \"$ne\": null } } is rejected with 400 before it reaches MongoDB, because password must be a string. Bodies over 10 KB are rejected with 413, and wrong credentials get the same 401 message whether the email exists or not.",
      questions: [
        { q: 'What is NoSQL injection and how do you prevent it?', a: 'An attacker sends query operators like {"$ne": null} instead of plain values, changing what a MongoDB query matches. Prevent it by validating input types with a schema so strings stay strings, stripping keys that start with $, and never building queries directly from req.body.' },
        { q: 'What is prototype pollution?', a: 'An attack where user-controlled keys like __proto__ are merged into an object, adding properties to Object.prototype and so to every object in the process. Prevent it with schema validation, safe merge functions, and Map or Object.create(null) for user-keyed data.' },
        { q: 'Why is ReDoS especially dangerous in Node?', a: 'A badly written regular expression can take seconds or minutes on crafted input, and because JavaScript runs on one thread, that blocks every other request. Avoid nested quantifiers, limit input length, and use vetted validators.' },
        { q: 'How do you keep dependencies secure?', a: 'Commit the lockfile and install with npm ci, run npm audit or Dependabot, update regularly, keep the dependency count low, and review new packages, especially ones with install scripts.' },
      ],
      answer30: "For Node security I start with input: validate everything with a schema, with size limits, so a password field can't become a MongoDB operator object. I prevent injection by never building queries, shell commands or file paths from raw input. Because Node is single-threaded, I protect the event loop from DoS with body limits, rate limiting and safe regexes. Secrets live in a secret manager, errors don't leak stack traces, dependencies are locked and audited, and the container runs as a non-root user.",
      mistakes: [
        "Trusting `req.body` types because the frontend 'always sends strings'.",
        "Returning different error messages for 'no such user' and 'wrong password' (user enumeration).",
        "No body size limit, so one huge payload blocks the event loop parsing JSON.",
        "Trap: 'We use Mongoose, so we're safe from injection, right?' Not fully. Mongoose casts values to the schema type for many queries, but query filters built from user objects can still carry operators, which is why `sanitizeFilter` and input validation exist.",
      ],
      takeaway: 'Validate shape and size, never build queries/commands/paths from raw input, protect the single thread, lock dependencies.',
      note: "On your resume: JWT cookie auth with RBAC and tenant isolation (see 'jwt-cookie-auth-rbac' and 'multi-tenant-isolation' in the projects stack) are where interviewers will push on these points.",
    },

    {
      id: 'node-performance-tips',
      title: 'Performance tips for Node APIs',
      level: 'advanced',
      priority: 'good',
      frequency: 'common',
      summary: 'Measure first, keep the event loop free, make I/O parallel and cheap, cache, stream, and tune the database before the runtime.',
      what: [
        "Most Node APIs are slow for boring reasons: slow database queries, too many sequential calls, big payloads, or something blocking the event loop. Measure before changing anything: p95/p99 latency, event loop delay, CPU, memory, and per-query timings.",
        "Common wins: run independent awaits in parallel with `Promise.all`, add the right database indexes, select only the fields you need, paginate, cache hot reads, compress or stream large responses, and move slow work to background queues.",
      ],
      deeper: [
        "**Keep the loop free**: no Sync APIs in handlers, no huge `JSON.parse`/`JSON.stringify` of multi-MB objects on hot paths (stream, paginate, or use worker threads), no CPU loops over big arrays per request.",
        "**Reuse connections**: one MongoDB client per process with a sensible pool size; keep-alive for outgoing HTTP (on by default for the global agent since Node 19, and `fetch`/undici pools connections). Creating a new DB connection per request is a classic mistake.",
        "**Parallel, but bounded**: `Promise.all` over 10,000 items can overload the database or a third-party API. Limit concurrency (p-limit, batching) and use `Promise.allSettled` when partial failure is OK.",
        "**Cheaper logging**: synchronous `console.log` in hot paths adds up; structured async loggers like pino are much faster. **Compression** is often better done at the load balancer or CDN than in Node.",
        "**Profile**: `node --cpu-prof`, clinic.js, flame graphs, and APM traces show where time really goes. Load test (autocannon, k6) before and after a change so you can prove it helped.",
      ],
      why: "'How would you make this API faster?' is a common practical question. A strong answer starts with measurement and covers the database and I/O before micro-optimising JavaScript.",
      analogy: "Speeding up a restaurant. You don't buy a faster stove first; you find out where orders wait. Usually it's one slow station (the database), or a waiter making three trips when one would do (sequential awaits), or someone blocking the pass (sync work on the loop).",
      code: {
        lang: 'ts',
        title: 'Sequential vs parallel, and lean queries',
        source: `// Slow: three independent calls run one after another (~ sum of all three)
const user = await User.findById(id);
const jobs = await Job.find({ ownerId: id });
const stats = await statsService.get(id);

// Faster: run independent I/O in parallel (~ the slowest one)
const [user2, jobs2, stats2] = await Promise.all([
  User.findById(id).select('name email role').lean(), // only needed fields, plain objects
  Job.find({ ownerId: id }).sort({ createdAt: -1 }).limit(20).lean(), // paginate; index { ownerId: 1, createdAt: -1 }
  statsService.get(id),
]);

// Bounded concurrency for big batches instead of Promise.all over 10,000 items
import pLimit from 'p-limit';
const limit = pLimit(10);
await Promise.all(candidateIds.map((cid) => limit(() => scoreCandidate(cid))));`,
      },
      output: "The parallel version takes about as long as the slowest of the three calls instead of their sum. `.lean()` returns plain objects instead of full Mongoose documents, and the limit keeps at most 10 scoring calls in flight at once.",
      questions: [
        { q: 'How would you find why a Node API endpoint is slow?', a: 'Measure first: APM traces or timing logs per step, database query explain plans, event loop delay, and a CPU profile if CPU is high. Usually the cause is a slow or unindexed query, sequential calls, or blocking work on the event loop.' },
        { q: 'When should you use Promise.all?', a: 'When several async operations are independent of each other, so they can run at the same time. For very large lists, limit concurrency so you do not overload the database or an external API, and use Promise.allSettled when some failures are acceptable.' },
        { q: 'What blocks the event loop in real APIs?', a: 'Sync fs or crypto calls, parsing or stringifying very large JSON, heavy loops or regexes over big inputs, and synchronous logging in hot paths. Each one delays every other request on that process.' },
        { q: 'How can caching help, and what is the risk?', a: 'Caching hot reads in memory or Redis avoids repeated database work and cuts latency. The risk is stale or inconsistent data, so you need TTLs and invalidation on writes, and in-memory caches must be bounded and are per-instance.' },
      ],
      answer30: "I start by measuring: p99 latency, traces, slow query logs and event loop delay. The usual fixes are on the I/O side: add indexes, select only needed fields, paginate, and run independent calls in parallel with Promise.all, with a concurrency limit for big batches. I keep the event loop free of sync work and huge JSON, reuse database and HTTP connections, cache hot reads in Redis with TTLs, stream large responses, and push slow jobs to queues. Then I load test to prove the change actually helped.",
      mistakes: [
        "Optimising JavaScript loops when the time is spent in an unindexed query.",
        "Awaiting independent calls one by one.",
        "Opening a new database connection per request.",
        "Trap: 'Will Promise.all over 5,000 API calls make it faster?' It may make it fail instead: rate limits, exhausted connection pools, memory spikes. Bound the concurrency.",
      ],
      takeaway: 'Measure, fix the database and I/O first, parallelise with limits, keep the loop free, and prove it with a load test.',
    },

    {
      id: 'test-runner-and-fetch',
      title: 'Built-in test runner and fetch',
      level: 'intermediate',
      priority: 'good',
      frequency: 'occasional',
      summary: 'Modern Node ships node:test (stable since Node 20) and a global fetch (stable since Node 21), so simple projects need no Jest or axios.',
      what: [
        "**`node:test`** is Node's built-in testing framework: `test`, `describe`/`it`, hooks like `before` and `after`, mocking with `mock.fn()` and `mock.method()`, and assertions from `node:assert`. Run it with `node --test`. It appeared in Node 18 and became stable in Node 20.",
        "**`fetch`** is the same API as in browsers, available globally: `const res = await fetch(url); const data = await res.json();`. It shipped (experimental, no flag needed) in Node 18 and was marked stable in Node 21. It's built on undici, Node's own HTTP client.",
      ],
      deeper: [
        "node:test extras: `--watch`, `--test-only`, coverage with `--experimental-test-coverage`, snapshot testing in newer versions, and mock timers (`mock.timers`). It's fast and has zero dependencies. Jest and Vitest still have richer ecosystems (module mocking, snapshot tooling, large plugin sets), so many existing projects keep them.",
        "fetch gotchas: it does **not** throw on 404 or 500, only on network errors, so always check `res.ok`. It has no default timeout; pass `signal: AbortSignal.timeout(5000)`. You must read the body once (`res.json()` or `res.text()`), and unread bodies can hold connections. Errors arrive as `TypeError: fetch failed` with the real reason in `err.cause`.",
        "Compared to axios: axios rejects on non-2xx, has interceptors, and automatic JSON handling. fetch is built in and web-standard. For a backend that calls a few APIs, fetch plus a small wrapper is usually enough.",
      ],
      why: "Interviewers ask 'what's new in Node' and 'do you still need axios/Jest?'. Knowing that these are built in, and their gotchas (fetch doesn't throw on HTTP errors), shows you keep up with the platform.",
      analogy: "A new flat that comes with a fridge and a washing machine already installed. You can still buy fancier ones (Jest, axios), but for many people the built-ins are enough.",
      code: {
        lang: 'js',
        title: 'api.test.mjs (run with node --test)',
        source: `import { test, describe, mock } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';

describe('helpers', () => {
  test('mocks a function', () => {
    const send = mock.fn(() => 'sent');
    send('hi');
    assert.equal(send.mock.callCount(), 1);
    assert.deepEqual(send.mock.calls[0].arguments, ['hi']);
  });
});

test('global fetch against a local server', async (t) => {
  const server = http.createServer((req, res) => {
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ ok: true, path: req.url }));
  });
  await new Promise((resolve) => server.listen(0, resolve)); // port 0 = any free port
  t.after(() => server.close());

  const res = await fetch(\`http://localhost:\${server.address().port}/health\`, {
    signal: AbortSignal.timeout(2000), // fetch has no default timeout
  });
  assert.equal(res.ok, true);          // fetch does NOT throw on 404/500: check res.ok
  assert.deepEqual(await res.json(), { ok: true, path: '/health' });
});`,
      },
      output: "node --test reports both tests passing (a 'helpers' suite with 'mocks a function', and 'global fetch against a local server'), with a summary of tests 2, pass 2, fail 0. No npm packages are needed.",
      questions: [
        { q: 'Does Node have a built-in test runner?', a: 'Yes, node:test. It was added in Node 18 and became stable in Node 20. It supports describe/it, hooks, mocking, watch mode and coverage, and you run it with node --test.' },
        { q: 'Is fetch available in Node?', a: 'Yes, globally. It arrived in Node 18 as experimental without a flag and was marked stable in Node 21. It is built on undici.' },
        { q: 'Does fetch throw on a 404 or 500 response?', a: 'No. fetch only rejects on network failures, like DNS errors or a refused connection. You must check res.ok or res.status yourself.' },
        { q: 'How do you add a timeout to fetch?', a: 'Pass an abort signal: fetch(url, { signal: AbortSignal.timeout(5000) }). When the time is up, the request is aborted and the promise rejects with a TimeoutError.' },
      ],
      answer30: "Modern Node has a built-in test runner, node:test, stable since Node 20, with describe and it, hooks, mocking and watch mode, run with node --test. It also has a global fetch, built on undici, stable since Node 21. For small services that removes the need for Jest or axios, though larger projects often keep Jest or Vitest for their ecosystem. The fetch gotchas I watch for: it doesn't throw on HTTP errors, so I check res.ok, and it has no default timeout, so I pass AbortSignal.timeout.",
      mistakes: [
        "Assuming fetch throws on 4xx/5xx like axios does.",
        "No timeout on outgoing fetch calls, so one slow dependency hangs your requests.",
        "Claiming node:test is 'experimental'. That was true in Node 18; it's stable since Node 20.",
        "Trap: 'Should we migrate our Jest suite to node:test?' Not automatically. It's a cost with little user benefit; choose node:test for new small projects and keep what works for big suites.",
      ],
      takeaway: 'node:test and fetch are built in; check res.ok and always set a fetch timeout.',
    },

    {
      id: 'node-version-migrations',
      title: 'Upgrading Node: 16 to 18, and 18 to 20 (and beyond)',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: '16->18 brought global fetch, node:test, OpenSSL 3 and new DNS ordering; 18->20 brought a stable test runner, the permission model, --env-file and off-thread ESM hooks.',
      note: "On your resume: you upgraded Skillkeepr from Node.js v18 to v20 (see 'typescript-migration-node-upgrade' in the projects stack). Only describe the breakages you really hit; the lists below are what commonly changes, not what happened in your project.",
      what: [
        "Node releases a new major version regularly, and each **LTS** (long-term support) line gets about 30 months of fixes before end of life. Upgrading keeps you on supported, patched versions: Node 16 reached end of life in September 2023, Node 18 in April 2025, and Node 20 on 30 April 2026.",
        "**Node 16 to 18** (18 became LTS in October 2022): global `fetch`, `FormData`, `Headers`, `Request`, `Response` (experimental); the `node:test` runner (experimental); Web Streams and `Blob`/`BroadcastChannel` as globals; V8 10.1 (which adds `Array.prototype.findLast`); and **OpenSSL 3** as the crypto library. `node --watch` arrived in 18.11.",
        "**Node 18 to 20** (20 became LTS in October 2023): the test runner became **stable**; an experimental **permission model** (`--experimental-permission`, `--allow-fs-read`, `--allow-fs-write`); custom ESM loader hooks moved off the main thread and `import.meta.resolve()` became synchronous; V8 11.3 (array methods like `toSorted`, `toReversed`, `with`); single executable apps (experimental); later 20.x minors added `--env-file` (20.6), `import.meta.dirname`/`filename` (20.11) and `require(esm)` without a flag (20.19).",
      ],
      deeper: [
        "Breakages people actually hit going **16 -> 18**: (1) OpenSSL 3 rejects old algorithms, so tools like webpack 4 that hash with MD4 fail with `ERR_OSSL_EVP_UNSUPPORTED`; the real fix is upgrading the tool (`--openssl-legacy-provider` is only a stopgap). (2) Since Node 17, DNS results are no longer reordered to put IPv4 first, so `localhost` may resolve to `::1` and connecting to a server that only listens on `127.0.0.1` fails with `ECONNREFUSED ::1`. Fix by using `127.0.0.1` or binding both. (3) Official Node 18 binaries need glibc 2.28+, so very old base images (CentOS 7, Amazon Linux 2) can't run them. (4) Native addons (bcrypt, sharp) must be rebuilt or upgraded.",
        "Things to check going **18 -> 20**: native modules again (new ABI), packages with strict `engines` ranges, custom loaders (`--experimental-loader`) that relied on running on the main thread, and test or HTTP-client code affected by Node 19's change that turned **HTTP keep-alive on by default** for the global agent (sockets now stay open between requests, which can surprise tests that expect the process to exit or servers with short idle timeouts). Also: `node:test` changed a lot while experimental in 18, so tests written against 18's runner may need small updates.",
        "**Beyond 20** (useful if asked 'what's new'): Node 22 made `require(esm)` default (22.12), added a global `WebSocket` client, `node --run` for package scripts, `fs.glob`, stable `--watch`, and raised the default stream `highWaterMark` to 64 KB. Node 22.6 added TypeScript type stripping behind a flag; it became unflagged in 23.6 and 22.18, so `node file.ts` runs simple TS (types are stripped, not checked). Node 24 ships npm 11, a global `URLPattern`, and the stable `--permission` flag (stabilised in 22.13/23.5).",
        "A safe upgrade process: read the changelogs for each major you skip, bump the version in one place (`.nvmrc`, `engines`, Dockerfile base image, CI matrix, Lambda runtime), reinstall to rebuild native modules, run the full test suite, run in staging and compare error rates, latency and memory, then roll out service by service with the old image ready for rollback.",
      ],
      why: "It's on your resume, so expect 'what changed and what broke?'. Interviewers also want to see that you treat runtime upgrades as routine security hygiene, done carefully, not as a scary one-off.",
      analogy: "Moving house to a newer building in the same city. Most furniture fits, but some old plugs don't match the new sockets (native modules, OpenSSL), and the street numbering changed (DNS ordering). You check each room, move in stages, and keep the old keys until you're sure.",
      code: [
        {
          lang: 'bash',
          title: 'Upgrade checklist as commands',
          source: `# 1. Pin the target version everywhere
echo "20" > .nvmrc
# Dockerfile:  FROM node:20-alpine     package.json: "engines": { "node": ">=20" }

# 2. Fresh install so native addons (bcrypt, sharp) rebuild for the new ABI
nvm use 20 && rm -rf node_modules && npm ci

# 3. Find packages that don't support the new version
npm ls --all 2>&1 | grep -i "invalid\\|unmet" ; npm outdated

# 4. Run everything
npm run build && npm test

# 5. Typical 16->18 fixes
#   ERR_OSSL_EVP_UNSUPPORTED  -> upgrade the tool (e.g. webpack 5); --openssl-legacy-provider is a stopgap
#   connect ECONNREFUSED ::1  -> use 127.0.0.1, or bind the server to both IPv4 and IPv6`,
        },
        {
          lang: 'js',
          title: 'Things you can delete after upgrading',
          source: `// Before (Node 16): extra packages for things Node now has built in
// const fetch = require('node-fetch');
// require('dotenv').config();

// After (Node 20+):
const res = await fetch('https://api.example.com/health', { signal: AbortSignal.timeout(3000) });
// node --env-file=.env dist/server.js   (Node 20.6+)
// node --test                           (stable test runner in Node 20)
// node --watch src/server.js            (restart on change, no nodemon)`,
        },
      ],
      output: "The checklist ends with a build and test run on the new version; failures there point to the dependencies or code paths to fix before staging. After upgrading, node-fetch, dotenv and nodemon can often be removed, because fetch, --env-file and --watch are built in.",
      questions: [
        { q: 'What changed between Node 16 and Node 18?', a: 'Node 18 added a global fetch (experimental, built on undici), the node:test runner (experimental), web streams and Blob as globals, V8 10.1, and moved to OpenSSL 3. It became LTS in October 2022. Common breakages were OpenSSL 3 rejecting old hash algorithms (ERR_OSSL_EVP_UNSUPPORTED) and localhost resolving to IPv6 first.' },
        { q: 'What changed between Node 18 and Node 20?', a: 'Node 20 made the test runner stable, added an experimental permission model, moved custom ESM loader hooks off the main thread with a synchronous import.meta.resolve, upgraded V8 to 11.3, and added experimental single executable apps. Later 20.x releases added --env-file, import.meta.dirname and require(esm).' },
        { q: 'Why did localhost connections break after upgrading Node?', a: 'Since Node 17, DNS results keep the order the OS returns, instead of putting IPv4 first. localhost can resolve to ::1, so a client fails to reach a server that only listens on 127.0.0.1. Use 127.0.0.1 explicitly or make the server listen on both.' },
        { q: 'How do you upgrade Node safely in production?', a: 'Read the changelogs, change the version in one place (nvmrc, engines, Docker image, CI), reinstall to rebuild native modules, run the full test suite, deploy to staging and compare error rates, latency and memory, then roll out gradually with a quick rollback path.' },
        { q: 'Why upgrade at all if the app works?', a: 'Old versions reach end of life and stop getting security patches; Node 18 ended in April 2025 and Node 20 in April 2026. Newer versions also bring performance improvements and built-ins that let you drop dependencies.' },
      ],
      answer30: "I upgraded our services from Node 18 to 20. Node 20 made the built-in test runner stable, added the experimental permission model, moved ESM loader hooks off the main thread, and later minors added --env-file and import.meta.dirname. The 16 to 18 jump is the one with more famous breakages: OpenSSL 3 rejecting old algorithms, and localhost resolving to IPv6 first. My process was to pin the version in one place, rebuild native modules, run the full test suite, go through staging while watching errors and memory, then roll out service by service with a rollback ready.",
      mistakes: [
        "Upgrading Node and many dependencies in one giant change, so you can't tell what broke.",
        "Forgetting a place where the version is pinned (CI image, Lambda runtime, Dockerfile), so environments silently differ.",
        "Fixing `ERR_OSSL_EVP_UNSUPPORTED` permanently with `--openssl-legacy-provider` instead of upgrading the tool.",
        "Trap: 'Was fetch stable in Node 18?' No. It was available without a flag but still experimental; it was marked stable in Node 21. Saying 'Node 18 added global fetch' is fine; 'stable fetch in 18' is not.",
      ],
      takeaway: '16->18: fetch, test runner, OpenSSL 3, IPv6-first localhost. 18->20: stable test runner, permission model, off-thread ESM hooks. Upgrade in small, tested steps.',
    },

    {
      id: 'node-lts-release-schedule',
      title: 'Node.js release lines and LTS status (2026)',
      level: 'basic',
      priority: 'good',
      frequency: 'occasional',
      summary: 'Use an LTS version in production. As of October 2026: Node 24 is Active LTS, Node 22 is Maintenance LTS, Node 26 becomes LTS on 28 October 2026, and Node 20 is end of life.',
      note: "Dates checked against the official nodejs/Release schedule in October 2026. Release dates can shift, so check nodejs.org/en/about/previous-releases before an interview.",
      what: [
        "Node has **Current** releases (the newest features) and **LTS** (Long-Term Support) releases, which get bug and security fixes for about 30 months. Production apps should run an LTS version.",
        "Until now, a new major came out every six months: even numbers in April, odd numbers in October. Only even-numbered versions became LTS, each October. An LTS line spends about 12 months in **Active LTS** and then 18 months in **Maintenance LTS** (security and critical fixes only), then reaches **end of life (EOL)**.",
        "Status as of October 2026: **Node 24** (Krypton) is Active LTS until 20 October 2026, then Maintenance until April 2028. **Node 22** (Jod) is Maintenance LTS until 30 April 2027. **Node 26** is Current and is scheduled to become LTS on 28 October 2026. **Node 20** reached end of life on 30 April 2026, and **Node 18** on 30 April 2025.",
      ],
      deeper: [
        "**The schedule is changing.** In March 2026 the Node project announced that from **Node 27** there will be one major release per year instead of two, and **every** release will become LTS (no more odd-number releases that never get LTS). Version numbers will follow the calendar year (27 in 2027, 28 in 2028). A new **Alpha** channel (October to March; the Node 27 alpha starts in October 2026) replaces the role odd-numbered releases used to play for early testing, followed by six months as Current (27.0.0 in April 2027) and then 30 months of LTS (Node 27 enters LTS in October 2027). If you only use LTS versions, little changes beyond the numbering.",
        "Practical policy for a team: run the newest Active LTS for new services, upgrade before your line reaches EOL (ideally when the next LTS is a few months old and the ecosystem has caught up), and pin the version in `.nvmrc`, `engines`, the Docker image and CI so every environment matches.",
        "Managed platforms follow the same lines: AWS Lambda, for example, offers runtimes per LTS version and deprecates them after the Node EOL date, so an unmaintained function eventually blocks deploys.",
      ],
      why: "Interviewers ask 'which Node version do you use and why?'. The right answer is 'an Active LTS version, upgraded before EOL', and knowing the current lines shows you keep your services patched.",
      analogy: "Phone software updates. The newest beta (Current) has the shiny features. The stable version (LTS) gets security patches for a few years. When your version stops getting patches (EOL), you upgrade, or you are running an unprotected phone.",
      code: {
        lang: 'text',
        title: 'Node.js release lines, October 2026',
        source: `Version   Status (Oct 2026)        Active LTS from   Maintenance from   End of life
--------  -----------------------  ----------------  -----------------  -----------
26.x      Current -> LTS 28 Oct 26  2026-10-28        2027-10-20         2029-04-30
24.x      Active LTS (Krypton)      2025-10-28        2026-10-20         2028-04-30
22.x      Maintenance LTS (Jod)     2024-10-29        2025-10-21         2027-04-30
20.x      End of life               -                 -                  2026-04-30
18.x      End of life               -                 -                  2025-04-30

From 27.x (2027): one major per year, every release becomes LTS,
Alpha (~Oct-Mar) -> Current (~Apr-Oct) -> LTS (~30 months).`,
      },
      output: "For a new production service in October 2026, choose Node 24 (Active LTS), or Node 26 once it enters LTS at the end of October. Services still on Node 20 or 18 are running without security patches and should be upgraded.",
      questions: [
        { q: 'What is an LTS release of Node.js?', a: 'A Long-Term Support release line that gets bug and security fixes for about 30 months: roughly 12 months of Active LTS and 18 months of Maintenance LTS. Production apps should run an LTS version.' },
        { q: 'Which Node.js versions are supported as of late 2026?', a: 'Node 24 is the Active LTS line (moving to Maintenance on 20 October 2026), Node 22 is in Maintenance until April 2027, and Node 26 becomes LTS on 28 October 2026. Node 20 reached end of life in April 2026.' },
        { q: 'Why are only even-numbered Node versions LTS?', a: 'Under the schedule used up to Node 26, even versions released in April were promoted to LTS in October, while odd versions were short-lived Current releases. From Node 27 that changes: one release per year and every release becomes LTS.' },
        { q: 'Which Node version would you choose for a new service?', a: 'The newest Active LTS version, pinned in .nvmrc, package.json engines, the Docker base image and CI, with a plan to upgrade before it reaches end of life.' },
      ],
      answer30: "In production I always run an LTS version. As of October 2026, Node 24 is the Active LTS line, Node 22 is in maintenance until April 2027, Node 26 is about to become LTS at the end of October, and Node 20 hit end of life in April 2026. LTS lines get about 30 months of fixes. The schedule is changing from Node 27: one major release per year, and every release becomes LTS, with an alpha channel for early testing. I pin the version everywhere and upgrade before end of life.",
      mistakes: [
        "Running an odd-numbered Current release (like 25) in production.",
        "Waiting until after EOL to start an upgrade.",
        "Pinning the Node version in only one place, so CI, Docker and laptops differ.",
        "Trap: 'Is Node 20 still a safe choice?' Not any more. It reached end of life on 30 April 2026 and no longer gets security fixes.",
      ],
      takeaway: 'Run Active LTS (Node 24 now, Node 26 from late October 2026), upgrade before EOL, and from Node 27 every yearly release is LTS.',
    },
  ],
  rapidFire: [
    { q: 'What is Node.js?', a: 'A JavaScript runtime built on V8 and libuv, with event-driven, non-blocking I/O.' },
    { q: 'Is Node single-threaded?', a: 'Your JavaScript runs on one main thread; libuv and V8 use extra threads behind the scenes.' },
    { q: 'Default libuv thread pool size?', a: '4 threads, configurable with UV_THREADPOOL_SIZE (max 1024).' },
    { q: 'Event loop phases in order?', a: 'Timers, pending callbacks, idle/prepare, poll, check, close callbacks.' },
    { q: 'Which phase runs setImmediate?', a: 'The check phase, right after poll.' },
    { q: 'nextTick or Promise.then first (CommonJS)?', a: 'process.nextTick, then promise microtasks.' },
    { q: 'setTimeout 0 vs setImmediate inside an I/O callback?', a: 'setImmediate always runs first there.' },
    { q: 'What does the poll phase do?', a: 'Runs I/O callbacks and waits for new I/O when nothing else is scheduled.' },
    { q: 'What runs on the thread pool?', a: 'Most fs calls, dns.lookup, async crypto (pbkdf2, scrypt) and async zlib.' },
    { q: 'How does Node pick CJS vs ESM for a .js file?', a: 'The "type" field of the nearest package.json; default is CommonJS.' },
    { q: '__dirname in ESM?', a: 'import.meta.dirname (Node 20.11+).' },
    { q: 'Can require() load an ES module?', a: 'Yes since Node 22.12 and 20.19, if the module has no top-level await.' },
    { q: 'Four stream types?', a: 'Readable, Writable, Duplex, Transform.' },
    { q: 'What signals backpressure?', a: 'writable.write() returns false; wait for the drain event.' },
    { q: 'pipe or pipeline?', a: 'pipeline: it propagates errors and cleans up every stream.' },
    { q: 'Is EventEmitter.emit async?', a: 'No, listeners run synchronously in registration order.' },
    { q: 'Emit "error" with no listener?', a: 'The error is thrown and crashes the process if uncaught.' },
    { q: 'Type of process.env values?', a: 'Always strings (or undefined).' },
    { q: 'Unhandled rejection default since Node 15?', a: 'It crashes the process (throws as an uncaught exception).' },
    { q: 'Signal sent on container stop?', a: 'SIGTERM, then SIGKILL after the grace period.' },
    { q: 'CPU-heavy task in Node?', a: 'Move it to worker_threads (a pool) or a separate service.' },
    { q: 'Do cluster workers share memory?', a: 'No, they are separate processes; share state through Redis or a DB.' },
    { q: '^1.2.3 vs ~1.2.3?', a: 'Caret allows minor and patch updates; tilde allows patch only.' },
    { q: 'npm ci vs npm install?', a: 'npm ci installs exactly the lockfile and fails if it is out of sync.' },
    { q: 'Does fetch reject on a 500?', a: 'No, only on network errors; check res.ok.' },
    { q: 'Built-in test runner stable since?', a: 'Node 20 (added experimentally in Node 18).' },
    { q: 'Active LTS in October 2026?', a: 'Node 24; Node 26 becomes LTS on 28 October 2026, and Node 20 is end of life.' },
  ],
};

export default node;
