// Express.js stack. Topics are auto-sorted Basic -> Intermediate -> Advanced by the registry.
// Examples target Express 5 (npm "latest" since 2025; 5.2.x in October 2026) and were run with Supertest where they claim output.

const express = {
  name: 'Express.js',
  intro: 'The framework behind most Node APIs, including yours. Know the middleware pipeline cold, then the production details: errors, validation, auth, security headers, structure, logging, and tests.',
  topics: [
    {
      id: 'what-is-express',
      title: 'What Express is',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'A small, unopinionated web framework on top of Node\'s http module: routing plus a chain of middleware functions.',
      what: [
        "Express is a minimal web framework for Node.js. Node's built-in `http` module can already run a server, but you'd have to parse URLs, match routes, read bodies and set headers yourself. Express adds the convenient parts: **routing** (`app.get('/users/:id', ...)`), **middleware** (functions that run on each request), and helpers like `res.json()` and `req.params`.",
        "It's **unopinionated**: it doesn't tell you how to structure folders, which database to use, or how to validate input. You choose and plug in what you need. That makes it flexible, and also means a large Express app needs conventions you set yourself.",
      ],
      deeper: [
        "At its core, an Express app is a request handler function `(req, res)` that you pass to `http.createServer`; `app.listen()` does exactly that. `req` and `res` are Node's own objects with extra methods added.",
        "Everything in Express is middleware: body parsers, auth checks, route handlers and error handlers are all functions in one ordered pipeline. Understanding that pipeline is most of understanding Express.",
        "Versions: **Express 5** became the npm `latest` release in 2025 (5.0 shipped in September 2024 after a decade in development) and needs Node 18+. Its headline change is that rejected promises in async handlers are passed to error middleware automatically. Express 4 is still maintained, so you'll meet both in real codebases.",
        "Alternatives you might be asked about: **Fastify** (faster, schema-based validation and serialisation, plugin system), **NestJS** (opinionated, Angular-style modules and decorators, often runs on Express under the hood), **Koa** (from the Express authors, async-first, even smaller), and **Hono** (tiny, runs on edge runtimes too).",
      ],
      why: "Express is the most widely used Node framework, so most job descriptions that mention Node mean Node + Express. Interviewers expect you to explain why you'd use it and what it doesn't give you out of the box.",
      analogy: "Node's http module is a plot of land with water and electricity. Express is a simple, flexible house frame on top: walls and doors (routing and middleware) are there, but you choose the furniture (database, validation, auth) yourself.",
      code: {
        lang: 'js',
        title: 'Smallest useful Express app',
        source: `import express from 'express';

const app = express();
app.use(express.json()); // parse JSON request bodies

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id, tab: req.query.tab ?? 'profile' });
});

app.listen(3000, () => console.log('API on http://localhost:3000'));`,
      },
      output: "GET /health returns {\"status\":\"ok\"}. GET /users/42?tab=jobs returns {\"id\":\"42\",\"tab\":\"jobs\"}. Any other path gets Express's default 404 response.",
      questions: [
        { q: 'What is Express.js?', a: 'A minimal, unopinionated web framework for Node.js. It adds routing, a middleware pipeline, and request/response helpers on top of Node\'s http module.' },
        { q: 'Why use Express instead of the plain http module?', a: 'With plain http you must parse URLs and bodies, match routes and set headers by hand. Express gives you routing, middleware, and helpers like res.json and req.params, plus a huge ecosystem of middleware for auth, CORS, logging and more.' },
        { q: 'What does unopinionated mean for Express?', a: 'It does not dictate folder structure, database, validation or architecture. That gives flexibility but means the team must set its own conventions, especially as the app grows.' },
        { q: 'Express vs NestJS vs Fastify?', a: 'Express is minimal and flexible with the biggest ecosystem. Fastify is faster and uses JSON schemas for validation and serialisation. NestJS is an opinionated framework with modules, dependency injection and decorators, and usually runs on Express or Fastify underneath.' },
      ],
      answer30: "Express is a minimal web framework on top of Node's http module. It gives me routing, a middleware pipeline, and helpers like res.json and req.params, and leaves everything else, like database, validation and structure, up to me. Every piece of an Express app is middleware running in order: parsers, auth, route handlers, error handlers. Express 5 is now the current version; its biggest practical change is that errors in async handlers reach the error middleware automatically.",
      mistakes: [
        "Calling Express a 'server'. Node's http module is the server; Express is the request handler and framework on top.",
        "Thinking Express validates input or handles security by default. It doesn't; you add those.",
        "Assuming every codebase is on Express 5. Many are still on 4, where async errors need manual handling.",
        "Trap: 'Is Express slow?' It's slower than Fastify in raw benchmarks, but in real APIs the database and network dominate. Choose Express for ecosystem and familiarity, Fastify when raw throughput really matters.",
      ],
      takeaway: 'Express = routing + middleware pipeline + helpers on top of Node http; everything else is your choice.',
      note: "On your resume: both Skillkeepr and Octagnt APIs are Express + TypeScript. Check which Express major version they used before you talk about async error handling.",
    },

    {
      id: 'routing-and-router',
      title: 'Routing and express.Router',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Routes match an HTTP method and path to handlers; Router groups related routes into mountable mini-apps.',
      what: [
        "A **route** connects an HTTP method and a path to one or more handler functions: `app.get('/jobs', listJobs)`, `app.post('/jobs', createJob)`. Express checks routes in the order you registered them and runs the first that matches.",
        "Data comes in three places: **route params** from the path (`/jobs/:id` gives `req.params.id`), the **query string** (`/jobs?page=2` gives `req.query.page`), and the **body** (`req.body`, after a body parser).",
        "**`express.Router()`** creates a mini-app with its own routes and middleware. You build one per feature (jobs, candidates, auth) and mount it on a path with `app.use('/api/v1/jobs', jobsRouter)`.",
      ],
      deeper: [
        "Order matters: `/jobs/new` must be registered before `/jobs/:id`, or `:id` will catch 'new'. `app.route('/jobs').get(...).post(...)` chains handlers for one path.",
        "Nested routers don't see the parent's params by default. Use `express.Router({ mergeParams: true })` for something like `/jobs/:jobId/applications`.",
        "**Express 5 changed path syntax** (it uses path-to-regexp v8). Wildcards must be named: `/*` becomes `/*splat` (and `req.params.splat` is an array of segments). Optional parts use braces: `/:file.:ext?` becomes `/:file{.:ext}`. Regular-expression characters inside path strings are no longer supported; use an array of paths or a real RegExp.",
        "`req.params` and `req.query` values are always strings (or arrays of strings), so validate and convert them. In Express 5 the default query parser is 'simple', so `?a[b]=1` no longer becomes a nested object unless you opt in with `app.set('query parser', 'extended')`.",
        "Version your API in the path (`/api/v1`) so you can change shapes later without breaking clients.",
      ],
      why: "Routing is the first thing you write in any API. Routers keep a growing codebase organised by feature, and the Express 5 path changes are a common surprise during upgrades.",
      analogy: "A large office building. The reception (app) sends visitors to the right floor (router mounted at /jobs), and each floor has its own room numbers (routes like /:id). Floors can even have their own security desk (router-level middleware).",
      code: {
        lang: 'js',
        title: 'routes/jobs.js and nested routers (Express 5)',
        source: `import express from 'express';

const jobs = express.Router();
jobs.get('/', (req, res) => res.json({ list: 'all jobs', page: req.query.page ?? '1' }));
jobs.get('/:jobId', (req, res) => res.json({ jobId: req.params.jobId }));

// nested router: mergeParams lets it read :jobId from the parent path
const applications = express.Router({ mergeParams: true });
applications.get('/', (req, res) => res.json({ applicationsFor: req.params.jobId }));
jobs.use('/:jobId/applications', applications);

const app = express();
app.use('/api/v1/jobs', jobs);

// Express 5 path syntax
app.get('/files/*filepath', (req, res) => res.json({ filepath: req.params.filepath })); // named wildcard
app.get('/docs/:slug{.:ext}', (req, res) => res.json(req.params));                       // optional part`,
      },
      output: "GET /api/v1/jobs?page=2 -> {\"list\":\"all jobs\",\"page\":\"2\"}. GET /api/v1/jobs/7 -> {\"jobId\":\"7\"}. GET /api/v1/jobs/7/applications -> {\"applicationsFor\":\"7\"}. GET /files/a/b/c.pdf -> {\"filepath\":[\"a\",\"b\",\"c.pdf\"]}. GET /docs/intro -> {\"slug\":\"intro\"} and GET /docs/intro.md -> {\"slug\":\"intro\",\"ext\":\"md\"}.",
      questions: [
        { q: 'What is the difference between req.params, req.query and req.body?', a: 'req.params holds named parts of the path, like id in /users/:id. req.query holds the query string, like page in ?page=2. req.body holds the parsed request body and is only filled after a body parser like express.json() runs. All of them come from the client, so validate them.' },
        { q: 'What is express.Router and why use it?', a: 'A mini-application with its own routes and middleware that you mount on a path with app.use. It lets you split a big API into feature modules like jobs and auth, each in its own file.' },
        { q: 'Why does route order matter?', a: 'Express checks routes in registration order and runs the first match. A general route like /jobs/:id registered before /jobs/new will capture "new" as an id.' },
        { q: 'What changed in route paths in Express 5?', a: 'Wildcards must be named (/*splat instead of /*), optional segments use braces (/:file{.:ext} instead of ?), and regex characters in path strings are no longer allowed. Wildcard params are now arrays of path segments.' },
      ],
      answer30: "A route maps a method and path to handlers, and Express runs the first match in registration order. Inputs come from req.params for path segments, req.query for the query string, and req.body after a body parser, all untrusted strings until validated. I group routes per feature with express.Router and mount them under a versioned prefix like /api/v1/jobs, using mergeParams for nested routes. In Express 5, path syntax changed: wildcards are named, like /*splat, and optional parts use braces.",
      mistakes: [
        "Registering `/:id` before a fixed path like `/new` or `/me`.",
        "Treating `req.params.id` as a number without converting and validating it.",
        "Copying Express 4 wildcard routes (`app.get('*', ...)`) into an Express 5 app, which throws at startup.",
        "Trap: 'What does app.use(\"/api\", fn) match?' Every path that starts with /api, for every HTTP method. Inside fn, req.url has the /api prefix stripped (req.originalUrl keeps it).",
      ],
      takeaway: 'Routes match in order; split features into Routers; params and query are untrusted strings; Express 5 wildcards are named.',
    },

    {
      id: 'middleware',
      title: 'Middleware: order, next(), and types',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Middleware are functions (req, res, next) that run in order; each one either ends the response or calls next() to pass control on.',
      what: [
        "A middleware is a function with the signature `(req, res, next)`. Express runs middleware **in the order you register them**. Each one can read or change `req` and `res`, then must do one of two things: **send a response** (which ends the chain) or **call `next()`** to hand over to the next function.",
        "Types of middleware: **application-level** (`app.use(fn)`, runs for every request), **router-level** (`router.use(fn)`, only for that router), **route-level** (passed to a single route: `app.post('/jobs', requireAuth, createJob)`), **built-in** (`express.json()`, `express.static()`), **third-party** (`cors`, `helmet`, `cookie-parser`), and **error-handling** (four arguments: `(err, req, res, next)`).",
      ],
      deeper: [
        "If a middleware neither responds nor calls `next()`, the request **hangs** until the client times out. If it calls `next()` **and** responds, or responds twice, you get 'Cannot set headers after they are sent to the client'. Use `return res.status(...).json(...)` to stop the function after responding.",
        "`next(err)` (with an argument) skips all normal middleware and jumps to the next error-handling middleware. `next('route')` skips the remaining handlers of the current route; `next('router')` exits the current router.",
        "Typical order in a real app: security headers (helmet) -> CORS -> request id and logging -> body parsers with size limits -> cookie parser -> rate limiting -> routes (with auth and validation per route) -> 404 handler -> error handler. The 404 and error handlers go **last**.",
        "Middleware is just a function, so a middleware factory (a function that returns middleware) is the standard way to make configurable ones, like `requireRole('admin')` or `validate(schema)`.",
      ],
      why: "Middleware is how Express does everything: auth, validation, logging, CORS, error handling. 'Explain middleware' and 'what happens if you forget next()' are among the most asked Express questions.",
      analogy: "An airport. You pass through check-in, security, passport control, then the gate, in that order. Each desk can let you through (next) or stop you right there (send a response). If a desk does neither, you're stuck in the queue forever.",
      code: {
        lang: 'js',
        title: 'Middleware order and next()',
        source: `import express from 'express';

const app = express();

app.use((req, res, next) => {            // 1. application-level: every request
  console.log('A logger:', req.method, req.url);
  next();
});

app.use(express.json());                  // 2. built-in: fills req.body

function requireApiKey(req, res, next) {  // 3. route-level
  if (req.get('x-api-key') !== 'secret') {
    console.log('B auth: rejected');
    return res.status(401).json({ error: 'Missing or bad API key' }); // ends the chain
  }
  console.log('B auth: ok');
  next();
}

app.post('/orders', requireApiKey, (req, res) => {
  console.log('C handler, body =', req.body);
  res.status(201).json({ id: 1, ...req.body });
});

app.use((req, res) => res.status(404).json({ error: 'Not found' })); // 4. nothing matched`,
      },
      output: "POST /orders without the key logs 'A logger: POST /orders' and 'B auth: rejected' and returns 401; the handler never runs. With the header x-api-key: secret it logs A, 'B auth: ok', and 'C handler, body = { item: 'pen' }', and returns 201 {\"id\":1,\"item\":\"pen\"}. GET /nope logs A and returns 404 {\"error\":\"Not found\"}.",
      questions: [
        { q: 'What is middleware in Express?', a: 'A function with (req, res, next) that runs during the request. It can read or modify req and res, end the request by sending a response, or call next() to pass control to the next middleware in order.' },
        { q: 'What happens if a middleware does not call next() or send a response?', a: 'The request hangs. The client waits until it times out because nothing ever finishes the response.' },
        { q: 'What does next(err) do?', a: 'It skips all remaining normal middleware and route handlers and goes straight to the next error-handling middleware, the ones with four arguments (err, req, res, next).' },
        { q: 'What are the types of middleware?', a: 'Application-level (app.use), router-level (router.use), route-level (passed to a specific route), built-in (express.json, express.static), third-party (cors, helmet), and error-handling middleware with four arguments.' },
        { q: 'Why does the error handler have to be registered last?', a: 'Middleware runs in registration order, and next(err) only searches forward. An error handler registered before the routes would never receive their errors.' },
      ],
      answer30: "Middleware is a function that takes req, res and next and runs in the order it's registered. Each one either sends a response, which ends the chain, or calls next to pass control on. Forget both and the request hangs; do both and you get 'headers already sent'. Calling next with an error jumps to the error-handling middleware, which has four arguments and goes last. I use app-level middleware for things like helmet, CORS, logging and body parsing, and route-level middleware for auth and validation.",
      mistakes: [
        "Forgetting `return` after `res.json(...)`, so the code continues and calls `next()` or responds again.",
        "Registering the error handler or 404 handler before the routes.",
        "Putting `express.json()` after the routes that need `req.body`.",
        "Trap: 'Is middleware order the same as file order?' It's the order of `app.use`/route calls at runtime. Importing a router file doesn't register anything until you mount it.",
      ],
      takeaway: 'Middleware runs in order; each one responds or calls next(); errors jump to 4-argument handlers registered last.',
    },

    {
      id: 'request-response-lifecycle',
      title: 'The request/response lifecycle',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'A request flows through the middleware stack in order until something sends exactly one response; res events tell you when it finished.',
      what: [
        "When a request arrives, Node's http server creates `req` (an incoming message stream) and `res` (a writable response). Express adds helpers to both, then walks the request through every middleware and route that matches, in order.",
        "Somewhere along the way, one function must send **exactly one** response: `res.json()`, `res.send()`, `res.status(204).end()`, `res.redirect()`, `res.sendFile()` or similar. After that the response is finished; trying to set headers or send again throws an error.",
      ],
      deeper: [
        "Step by step: TCP connection (often kept alive and reused) -> Node parses the request line and headers -> Express matches middleware by path and method -> body parsers read the body stream (it's only read when a parser runs) -> handlers run -> `res` writes status, headers and body -> `res` emits `'finish'` when the last byte is handed to the OS. If the client disconnects early, `'close'` fires without a normal finish.",
        "`res.on('finish')` is where access logs, metrics and audit middleware record the status code and duration, because by then the final status is known. `res.headersSent` tells you whether it's too late to change headers (useful in error handlers).",
        "`res.json(obj)` sets `Content-Type: application/json`, stringifies the object, sets an ETag, and ends the response. `res.send` picks the type from what you pass. `res.status()` only sets the code; it doesn't send anything.",
        "The request also has a lifetime limit: Node 18+ HTTP servers have `requestTimeout` (300 seconds by default) and `headersTimeout`, and load balancers have their own idle timeouts (60 seconds by default on AWS ALB). Long work should not live inside a request at all.",
      ],
      why: "It explains real bugs: 'headers already sent', hanging requests, missing logs, and timeouts behind a load balancer. It's also how audit and logging middleware know the final status of a request.",
      analogy: "A parcel on a conveyor belt through a sorting centre. Each station can inspect it, add a label, or pull it off the belt and ship it. Once shipped, it's gone; you can't add another label. The 'finish' event is the delivery receipt.",
      code: {
        lang: 'ts',
        title: 'Timing middleware using the finish and close events',
        source: `import type { Request, Response, NextFunction } from 'express';

export function timing(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();

  res.on('finish', () => {                          // response fully handed to the OS
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    console.log(\`\${req.method} \${req.originalUrl} \${res.statusCode} \${ms.toFixed(1)}ms\`);
  });

  res.on('close', () => {
    if (!res.writableFinished) console.warn('client disconnected before the response finished');
  });

  next(); // the timer keeps running while later middleware and the handler work
}

// app.use(timing) near the top, so it wraps everything after it`,
      },
      output: "Every request logs one line such as 'GET /api/v1/jobs 200 12.4ms' after the response is sent, with the final status code even if an error handler changed it. If the client gives up early, the warning is logged instead.",
      questions: [
        { q: 'Walk through what happens when a request hits an Express app.', a: 'Node parses the request and creates req and res. Express runs each matching middleware and route handler in registration order: security headers, CORS, logging, body parsing, auth, validation, then the handler. One function sends the response; if anything calls next(err), the error middleware sends it instead. The response emits finish when done.' },
        { q: 'What causes "Cannot set headers after they are sent to the client"?', a: 'Sending a response twice, or setting headers after the response was sent. Usually a missing return after res.json, calling next() after responding, or both a callback and a promise responding.' },
        { q: 'How do you log the status code and duration of every request?', a: 'Use a middleware near the top that records the start time and listens for res.on("finish"), where the final status code is known. Libraries like pino-http or morgan do exactly this.' },
        { q: 'What is the difference between res.send, res.json and res.end?', a: 'res.json stringifies an object and sets the JSON content type. res.send handles strings, buffers or objects and sets a suitable content type. res.end ends the response with no extra processing, often after res.status(204).' },
      ],
      answer30: "A request comes in, Node parses it, and Express runs every matching middleware and handler in order: headers, CORS, logging, body parsing, auth, validation, then the route. Exactly one function must send the response; after that headers are locked, which is where 'headers already sent' errors come from. If anything calls next with an error, the error middleware responds instead. When the response is done, res emits finish, which is where I record status and duration for logs and audit trails.",
      mistakes: [
        "Responding in both a try block and a catch block without returning.",
        "Logging the status code at the start of the request instead of on 'finish'.",
        "Doing multi-minute work inside a request and hitting load balancer timeouts (504s).",
        "Trap: 'Does res.status(404) send the response?' No. It only sets the status code; you still need res.json(), res.send() or res.end().",
      ],
      takeaway: 'Middleware in order, exactly one response, and res "finish" is where you measure and log.',
      note: "On your resume: the Skillkeepr audit logging middleware captures user, route, status and duration when the response finishes (see 'audit-logging-service' in the projects stack).",
    },

    {
      id: 'error-handling-async',
      title: 'Error-handling middleware and async errors (Express 4 vs 5)',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Error middleware has 4 arguments and goes last. Express 5 forwards rejected promises to it automatically; Express 4 needs try/catch, next(err), or a wrapper.',
      what: [
        "An error-handling middleware is a function with **four** arguments: `(err, req, res, next)`. Express recognises it by the argument count. You register it **after** all routes, and it becomes the single place that turns errors into HTTP responses.",
        "How errors reach it: throwing inside a synchronous handler, calling `next(err)`, or (in **Express 5**) throwing or rejecting inside an `async` handler. Express 5 sees the returned promise and calls `next(err)` for you.",
        "In **Express 4**, a rejected promise in an async handler is **not** caught. The request hangs, and the rejection becomes an `unhandledRejection` that crashes the process on Node 15+. You had to wrap every async handler in try/catch, use a helper like `asyncHandler`, or the `express-async-errors` package.",
      ],
      deeper: [
        "A good error handler: maps known errors (validation, not found, unauthorised, conflicts) to proper status codes and safe messages; logs unexpected errors with the request id and stack; returns a generic 500 message in production without stack traces; and checks `res.headersSent` (if headers are already sent, call `next(err)` so Express closes the connection).",
        "Create custom error classes, like `class AppError extends Error { constructor(status, message) ... }` or `NotFoundError`, and throw them from services. The error middleware is then the only place that knows about HTTP status codes for errors.",
        "Errors from callbacks or timers inside a handler (`setTimeout(() => { throw err })`) are not caught by either version; they escape to `uncaughtException`. Promisify callback APIs so errors flow through `await`.",
        "Also add a 404 handler (a normal middleware with no path) just before the error handler, so unknown routes return your JSON format instead of Express's default HTML page.",
      ],
      why: "Unhandled async errors are the classic Express bug: hanging requests, crashed processes and leaked stack traces. 'How do you handle errors in Express?' is asked in almost every Node interview, and the Express 5 change is a great detail to mention.",
      analogy: "A hospital's emergency department. Any ward (route) can send a patient there (next(err)). In Express 5, a patient who collapses in an async ward is brought down automatically; in Express 4, someone had to remember to carry them.",
      code: [
        {
          lang: 'js',
          title: 'Express 5: async errors reach the error handler automatically',
          source: `import express from 'express';

class AppError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

const users = new Map([['1', { id: '1', name: 'Asha' }]]);
const findUser = async (id) => users.get(id) ?? null; // pretend DB call

const app = express();

app.get('/users/:id', async (req, res) => {
  const user = await findUser(req.params.id);
  if (!user) throw new AppError(404, 'User not found'); // no try/catch needed in Express 5
  res.json(user);
});

app.get('/boom', async () => {
  JSON.parse('{bad json'); // a bug: unexpected error
});

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// Error-handling middleware: 4 arguments, registered last
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.status ?? 500;
  if (status >= 500) console.error('unexpected:', err.message); // log real bugs (with request id in real code)
  res.status(status).json({ error: status >= 500 ? 'Internal server error' : err.message });
});`,
        },
        {
          lang: 'js',
          title: 'Express 4: the wrapper you needed',
          source: `// Express 4 does not catch rejected promises: this request would hang
// and the rejection would crash the process (Node 15+).
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await findUser(req.params.id);
  if (!user) throw new AppError(404, 'User not found');
  res.json(user);
}));`,
        },
      ],
      output: "With Express 5: GET /users/1 returns 200 {\"id\":\"1\",\"name\":\"Asha\"}. GET /users/2 returns 404 {\"error\":\"User not found\"}. GET /boom logs 'unexpected: Expected property name or '}' in JSON...' on the server and returns 500 {\"error\":\"Internal server error\"} without leaking the details.",
      questions: [
        { q: 'How do you handle errors in Express?', a: 'Throw or pass errors with next(err) and handle them centrally in error-handling middleware with four arguments (err, req, res, next), registered after all routes. It maps known errors to status codes, logs unexpected ones, and returns a safe message without stack traces in production.' },
        { q: 'How are async errors handled differently in Express 4 and 5?', a: 'In Express 5, if an async handler throws or returns a rejected promise, Express calls next(err) automatically. In Express 4 it does not: the request hangs and the rejection is unhandled, so you needed try/catch with next(err), an asyncHandler wrapper, or express-async-errors.' },
        { q: 'How does Express know a middleware is an error handler?', a: 'By its number of declared arguments: exactly four (err, req, res, next). Even if you do not use next, you must declare it, or Express treats it as normal middleware.' },
        { q: 'What should the error handler return to the client?', a: 'A consistent JSON shape with a proper status code. For expected errors, a useful message; for unexpected 500 errors, a generic message and maybe a request id, never the stack trace or internal details.' },
      ],
      answer30: "I handle errors centrally. Services throw typed errors like NotFoundError or ValidationError, and one error-handling middleware with four arguments, registered last, maps them to status codes and a consistent JSON shape. Unexpected errors are logged with the request id and the client gets a generic 500 with no stack trace. In Express 5, async handlers that throw or reject are forwarded to that middleware automatically. In Express 4 they weren't, so I wrapped async handlers with an asyncHandler helper that catches and calls next.",
      mistakes: [
        "Writing the error handler with three arguments, so Express never treats it as one.",
        "In Express 4: async handlers without try/catch or a wrapper.",
        "Sending `err.stack` or raw database messages to the client.",
        "Trap: 'Does Express 5 catch an error thrown inside a setTimeout or an event callback in my handler?' No. Only errors thrown in the handler itself or its returned promise are caught. Callback-based errors must be passed to next(err) or promisified.",
      ],
      takeaway: 'One 4-argument error handler, last; typed errors from services; Express 5 forwards async rejections, Express 4 needs a wrapper.',
    },

    {
      id: 'body-parsing-validation',
      title: 'Body parsing and validation (zod, joi)',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Parse bodies with size limits, then validate every input against a schema in middleware before it reaches your business logic.',
      what: [
        "The request body arrives as a stream of bytes. **Body parsers** read it and put the result on `req.body`: `express.json()` for JSON, `express.urlencoded()` for HTML forms, and libraries like multer for `multipart/form-data` (file uploads). If no parser handled the request (no parser registered, or the Content-Type didn't match), `req.body` is `undefined` in Express 5; in Express 4 a registered parser that skipped the request left it as `{}`.",
        "**Validation** checks that the data has the shape you expect: required fields present, correct types, sensible lengths and ranges, no unexpected fields. Schema libraries make this declarative. **zod** is TypeScript-first and gives you static types from the same schema; **joi** is the older, very mature option; express-validator and ajv (JSON Schema) are also common.",
      ],
      deeper: [
        "Always set a size limit: `express.json({ limit: '100kb' })` (the default is 100 KB; raise it only where needed). Oversized bodies get a 413 error, and malformed JSON gets a 400 from the parser, so your error handler should map those cleanly.",
        "Validate params and query too, not just the body. They're strings, so coerce numbers (`z.coerce.number()`), and whitelist allowed sort fields and filters.",
        "Use the **parsed output**, not the raw input: the schema can trim strings, apply defaults, coerce types and strip or reject unknown keys. Rejecting unknown keys (`.strict()` in zod) stops mass-assignment bugs like a client sending `role: 'admin'` or `tenantId` in the body.",
        "In Express 5, `req.query` is a getter, so you can't reassign it in middleware; store validated values on another property (like `req.validated` or `res.locals`).",
        "Validation at the edge doesn't replace database constraints (unique indexes, required fields in the schema). You want both.",
      ],
      why: "Invalid input causes crashes, bad data, and security holes (NoSQL injection, mass assignment, DoS with huge payloads). Interviewers want to hear that you validate every input in one consistent way and return clear 400 errors.",
      analogy: "A form at a government office. The clerk (validation middleware) checks it before it goes to the back office (your service): every required box filled, dates in the right format, no extra pages stapled on. Incomplete forms go straight back with a note saying what to fix.",
      code: {
        lang: 'js',
        title: 'A reusable validate(schema) middleware with zod',
        source: `import express from 'express';
import { z } from 'zod';

const validate = (schema, where = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[where]);
  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: result.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    });
  }
  req.validated = result.data; // use the cleaned, typed data from here on
  next();
};

const CreateCandidate = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email(),
  experienceYears: z.coerce.number().int().min(0).max(50),
  skills: z.array(z.string()).max(30).default([]),
}).strict(); // unknown keys (like isAdmin) are rejected

const app = express();
app.use(express.json({ limit: '100kb' }));
app.post('/candidates', validate(CreateCandidate), (req, res) => {
  res.status(201).json(req.validated);
});`,
      },
      output: "Posting { name: ' Asha ', email: 'asha@example.com', experienceYears: '3' } returns 201 with {\"name\":\"Asha\",\"email\":\"asha@example.com\",\"experienceYears\":3,\"skills\":[]}: trimmed, coerced to a number, default applied. Posting { name: 'A', email: 'nope', experienceYears: 3, isAdmin: true } returns 400 with three details: name too short, invalid email, and unrecognized key isAdmin (messages shown are zod 4's).",
      questions: [
        { q: 'Why is req.body undefined in my route?', a: 'No body parser ran before the route, or the client did not send the matching Content-Type (express.json only parses application/json). Add express.json() before the routes and check the header. In Express 5 an unparsed body is undefined; in Express 4 it was often an empty object, which hid the problem.' },
        { q: 'How do you validate requests in Express?', a: 'With a schema library like zod or joi, inside a reusable middleware that validates body, params and query, returns a 400 with clear details on failure, and passes the cleaned data on. With zod in TypeScript, the same schema also gives you the type.' },
        { q: 'What is mass assignment and how do you prevent it?', a: 'When a handler saves req.body directly, so a client can set fields it should not, like role or tenantId. Prevent it by validating with a strict schema that only allows known fields and by setting sensitive fields on the server.' },
        { q: 'zod vs joi?', a: 'Both describe and validate data shapes. zod is TypeScript-first and infers static types from the schema, so validation and types never drift apart. joi is older, very mature, and JavaScript-first. Either is fine; consistency matters more.' },
      ],
      answer30: "I parse bodies with express.json and an explicit size limit, then validate every input, body, params and query, with a schema in a reusable middleware. I use zod because the same schema gives TypeScript types. The middleware returns a 400 with field-level details on failure and passes the cleaned data on, with strings trimmed, numbers coerced and unknown keys rejected, which also stops mass assignment of fields like role or tenantId. Database constraints stay as a second line of defence.",
      mistakes: [
        "Saving `req.body` straight into the database.",
        "Validating the body but trusting `req.params` and `req.query`.",
        "Validating, then using the raw `req.body` instead of the parsed result, so trimming and coercion are lost.",
        "Trap: 'Isn't TypeScript enough to validate input?' No. Types disappear at runtime. A request body typed as `CreateCandidateDto` can contain anything; only runtime validation checks it.",
      ],
      takeaway: 'Parse with limits, validate every input with a schema, use the parsed output, and reject unknown fields.',
    },

    {
      id: 'auth-middleware-jwt-cookies',
      title: 'Auth middleware: JWT, cookies, and RBAC',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'An auth middleware verifies the token (from an httpOnly cookie or Authorization header), puts the user on req, and a second middleware checks permissions.',
      what: [
        "**Authentication** answers 'who are you?'; **authorization** answers 'what are you allowed to do?'. In Express both are middleware that run before the route handler.",
        "With JWTs, login returns a signed token containing claims like user id, tenant id and role. On each request, the auth middleware reads the token, **verifies its signature and expiry** with the secret or public key, and attaches the user to `req.user`. If it's missing or invalid, it responds 401.",
        "Where the token lives: in an **httpOnly cookie** (the browser sends it automatically; page JavaScript can't read it, which protects against XSS stealing it) or in the **`Authorization: Bearer <token>` header** (common for mobile apps and service-to-service calls).",
      ],
      deeper: [
        "Use a short-lived access token (minutes) plus a longer-lived refresh token (days) that is only sent to the refresh endpoint and can be revoked server-side (store a token id or version in the database). When the access token expires, the client calls /auth/refresh and retries.",
        "Cookies need `httpOnly`, `secure`, and `sameSite` (`lax` or `strict`). Because browsers send cookies automatically, cookie auth needs **CSRF protection**: SameSite cookies cover most cases; add a CSRF token or check the Origin header for sensitive state-changing requests.",
        "Always pin the algorithm when verifying (`jwt.verify(token, key, { algorithms: ['HS256'] })`), keep secrets long and in a secret manager, and never put sensitive data in the payload: JWTs are signed, not encrypted, and anyone can decode them.",
        "**Authorization** is a separate middleware: `requirePermission('candidates', 'delete')` checks the role against a permission table. In multi-tenant apps, take the tenant id from the verified token, never from the request body or query.",
      ],
      why: "Every real API needs auth, and it's where security interviews start. The cookie vs header choice, refresh flow, CSRF, and 401 vs 403 are standard follow-ups.",
      analogy: "A concert. The wristband (JWT) is checked at every gate (auth middleware); it proves who you are without the staff phoning the ticket office each time. The colour of the wristband (role) decides whether you get into the VIP area (authorization).",
      code: {
        lang: 'ts',
        title: 'requireAuth and requirePermission middleware',
        source: `import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

type Claims = { sub: string; tenantId: string; role: 'owner' | 'admin' | 'recruiter' | 'viewer' };
declare global { namespace Express { interface Request { user?: Claims } } }

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // httpOnly cookie for the browser app (needs cookie-parser), Bearer header for API clients
  const token = req.cookies?.access ?? req.get('authorization')?.replace(/^Bearer /, '');
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    req.user = jwt.verify(token, process.env.ACCESS_SECRET!, { algorithms: ['HS256'] }) as Claims;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' }); // client then calls /auth/refresh
  }
}

const PERMISSIONS: Record<Claims['role'], Record<string, string[]>> = {
  owner: { candidates: ['read', 'write', 'delete'], billing: ['read', 'write'] },
  admin: { candidates: ['read', 'write', 'delete'], billing: ['read'] },
  recruiter: { candidates: ['read', 'write'] },
  viewer: { candidates: ['read'] },
};

export const requirePermission = (module: string, action: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    const allowed = PERMISSIONS[req.user!.role]?.[module]?.includes(action);
    if (!allowed) return res.status(403).json({ error: 'Forbidden' });
    next();
  };

// router.delete('/candidates/:id', requireAuth, requirePermission('candidates', 'delete'), deleteCandidate);`,
      },
      output: "No token or an expired token gives 401. A valid token for a recruiter calling DELETE /candidates/:id gives 403. An admin's request reaches deleteCandidate with req.user filled in, including tenantId to scope the database query.",
      questions: [
        { q: 'How do you implement JWT authentication in Express?', a: 'On login, verify the password and sign a short-lived access token with the user id, tenant and role. An auth middleware reads the token from an httpOnly cookie or the Authorization header, verifies signature and expiry with a pinned algorithm, and sets req.user, or returns 401. A refresh token gets new access tokens.' },
        { q: 'Cookie or Authorization header for JWTs?', a: 'For browser apps, httpOnly secure cookies keep the token away from JavaScript, which protects against XSS theft, but you need SameSite and CSRF protection. Headers suit mobile apps and service-to-service calls, but the browser code must store the token somewhere it can read.' },
        { q: 'What is the difference between 401 and 403?', a: '401 Unauthorized means not authenticated: no valid credentials, so log in or refresh. 403 Forbidden means authenticated but not allowed to do this action.' },
        { q: 'How do you log a user out if JWTs are stateless?', a: 'Clear the cookies and revoke the refresh token on the server, for example by deleting its record or bumping a token version on the user. The short-lived access token expires within minutes; for instant revocation you need a denylist checked on each request.' },
      ],
      answer30: "Auth in Express is two middlewares. requireAuth reads the access token from an httpOnly cookie or the Bearer header, verifies the signature, expiry and algorithm, and sets req.user, otherwise it returns 401. requirePermission checks the user's role against a permission table and returns 403 if the action isn't allowed. Access tokens are short-lived, a refresh token renews them and can be revoked on the server, cookies are httpOnly, secure and SameSite, and the tenant id always comes from the verified token, never from the request.",
      mistakes: [
        "Using `jwt.decode` (no verification) instead of `jwt.verify`.",
        "Long-lived access tokens with no way to revoke them.",
        "Putting sensitive data in the JWT payload, which is only base64-encoded.",
        "Trap: 'If we use httpOnly cookies, are we safe from XSS?' Safer, not safe. XSS can't read the token, but malicious script running in your page can still make authenticated requests, because the browser attaches the cookie. You still need to prevent XSS.",
      ],
      takeaway: 'Verify the token, attach req.user, then check permissions; 401 is who-are-you, 403 is not-allowed.',
      note: "On your resume: cookie-based JWT auth with auto-renewal and RBAC across 4 roles and 8 modules on Octagnt (see 'jwt-cookie-auth-rbac' in the projects stack). The roles in this example are illustrative; use your real ones.",
    },

    {
      id: 'cors',
      title: 'CORS',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'CORS headers tell the browser which other origins may read your API\'s responses; it is a browser rule, not server-side protection.',
      what: [
        "Browsers follow the **same-origin policy**: JavaScript on `https://app.example.com` can't read responses from `https://api.example.com` (a different origin: scheme + host + port) unless that API allows it. **CORS** (Cross-Origin Resource Sharing) is how the API says 'this origin is allowed', using response headers like `Access-Control-Allow-Origin`.",
        "For 'non-simple' requests (methods like PUT or DELETE, JSON content type, custom headers like Authorization), the browser first sends a **preflight** `OPTIONS` request asking permission. Your server must answer it with the allowed origin, methods and headers before the real request is sent.",
        "In Express you use the `cors` middleware: `app.use(cors({ origin: ['https://app.example.com'], credentials: true }))`.",
      ],
      deeper: [
        "**Credentials** (cookies): if your frontend sends cookies (`fetch(url, { credentials: 'include' })`), the server must reply with `Access-Control-Allow-Credentials: true` and a **specific** origin. The wildcard `*` is not allowed with credentials.",
        "Use an allow-list of exact origins, per environment, from config. Reflecting any incoming Origin back (`origin: true`) together with `credentials: true` effectively lets any website make authenticated requests and read the responses.",
        "**CORS is not access control.** It's enforced by browsers only. curl, Postman, servers and attackers' scripts ignore it entirely. Your API still needs authentication and authorization; CORS only controls what other websites' JavaScript running in a user's browser can read.",
        "Preflights add a round trip; `maxAge` lets the browser cache the preflight result. Same-site setups (frontend and API under one domain via a reverse proxy or CloudFront path routing) avoid CORS entirely.",
      ],
      why: "'Blocked by CORS policy' is one of the most common errors full-stack developers debug, and interviewers love asking why it happens and why CORS doesn't protect your API.",
      analogy: "A guest list at a party held in your house (the browser). The API's bouncer tells the house which friends' (origins') messages may be passed inside. But it only works because the house follows the rule; someone shouting through the window from the street (curl) was never stopped by the guest list.",
      code: {
        lang: 'js',
        title: 'CORS with credentials and an allow-list',
        source: `import express from 'express';
import cors from 'cors';

const allowed = (process.env.CORS_ORIGINS ?? 'https://app.example.com').split(',');

const app = express();
app.use(cors({
  origin: allowed,          // exact origins, never '*' when using cookies
  credentials: true,        // allow cookies; sends Access-Control-Allow-Credentials: true
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  maxAge: 600,              // browser may cache the preflight for 10 minutes
}));

app.post('/auth/login', (req, res) => res.json({ ok: true }));`,
      },
      output: "A preflight OPTIONS from https://app.example.com gets 204 with Access-Control-Allow-Origin: https://app.example.com and Access-Control-Allow-Credentials: true, so the browser sends the real request. A preflight from https://evil.example also gets 204 but with no Access-Control-Allow-Origin header, so the browser refuses to send the request. curl can still call the endpoint directly, which is why auth is still required.",
      questions: [
        { q: 'What is CORS?', a: 'A browser mechanism that lets a server say which other origins may read its responses, using headers like Access-Control-Allow-Origin. Without it, the same-origin policy blocks frontend JavaScript from reading cross-origin responses.' },
        { q: 'What is a preflight request?', a: 'An automatic OPTIONS request the browser sends before a non-simple cross-origin request, for example one with PUT, a JSON content type or an Authorization header. The server must reply with the allowed origin, methods and headers, or the browser blocks the real request.' },
        { q: 'Why can\'t you use Access-Control-Allow-Origin: * with cookies?', a: 'Browsers forbid the wildcard when credentials are included, because it would let any website make authenticated requests and read the results. You must return the specific origin and Access-Control-Allow-Credentials: true.' },
        { q: 'Does CORS protect your API from attackers?', a: 'No. CORS is enforced only by browsers. Tools like curl or a backend script ignore it. It only limits what other websites\' JavaScript can read; you still need authentication, authorization and CSRF protection.' },
      ],
      answer30: "CORS is the browser's way of letting a server relax the same-origin policy. The API sends Access-Control-Allow-Origin for origins it trusts, and for non-simple requests the browser sends a preflight OPTIONS first. In Express I use the cors middleware with an exact allow-list per environment, and credentials true because we use cookies, which also means no wildcard. The key point is that CORS isn't security for the API itself: curl ignores it, so auth and authorization still have to be enforced on the server.",
      mistakes: [
        "Using `origin: '*'` or reflecting every origin with `credentials: true`.",
        "Trying to 'fix' a CORS error from the frontend code. The fix is always on the server (or a proxy).",
        "Forgetting that the preflight must succeed too: auth middleware that rejects OPTIONS requests breaks it. Put `cors()` before auth.",
        "Trap: 'The request shows up in my server logs but the browser says CORS error. Did it run?' For simple requests, yes: the server processed it, the browser just hid the response. That's why CORS can't protect state-changing endpoints from CSRF.",
      ],
      takeaway: 'CORS lets browsers read cross-origin responses; allow-list exact origins, no wildcard with cookies, and it is not API security.',
    },

    {
      id: 'helmet-security-headers',
      title: 'helmet and security headers',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'helmet sets safe HTTP response headers (CSP, HSTS, nosniff, frame options and more) in one line; also hide x-powered-by.',
      what: [
        "Browsers have built-in protections that a server switches on with **response headers**. `helmet` is a middleware that sets a sensible group of them with one line: `app.use(helmet())`.",
        "Important ones: **Content-Security-Policy** (which scripts, styles and images a page may load, a strong defence against XSS), **Strict-Transport-Security** (HSTS: always use HTTPS for this domain), **X-Content-Type-Options: nosniff** (don't guess file types), **X-Frame-Options** / CSP `frame-ancestors` (block clickjacking via iframes), and **Referrer-Policy** (don't leak full URLs to other sites).",
      ],
      deeper: [
        "helmet also removes the `X-Powered-By: Express` header. You can do that alone with `app.disable('x-powered-by')`. It doesn't stop a determined attacker, but there's no reason to advertise your stack.",
        "CSP matters most when Express serves HTML. For a pure JSON API, the headers still help (for example `nosniff` and `frame-ancestors`), but the frontend's CSP is usually set by whatever serves the frontend (CloudFront, Vercel, Nginx).",
        "HSTS only takes effect over HTTPS, and once a browser has seen it, it refuses plain HTTP for `max-age` seconds, so test on a subdomain before enabling `includeSubDomains` and `preload`.",
        "Headers are one layer. They don't replace input validation, output encoding, auth, rate limits or keeping dependencies updated.",
      ],
      why: "Security scanners and penetration tests flag missing headers immediately, and 'how do you secure an Express app?' usually expects helmet in the first sentence, followed by the real work.",
      analogy: "Locks and alarm stickers on a house. helmet installs a standard set of locks on every door and window in one go. It doesn't make the house unbreakable, but leaving them off is just careless.",
      code: {
        lang: 'js',
        source: `import express from 'express';
import helmet from 'helmet';

const app = express();
app.disable('x-powered-by'); // helmet removes it too; harmless to be explicit

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https://my-bucket.s3.amazonaws.com'],
      frameAncestors: ["'none'"],   // nobody may iframe us (clickjacking)
    },
  },
  strictTransportSecurity: { maxAge: 31536000, includeSubDomains: true }, // one year of HTTPS-only
}));

app.get('/health', (req, res) => res.json({ ok: true }));`,
      },
      output: "Every response now includes content-security-policy, strict-transport-security, x-content-type-options: nosniff, x-frame-options, referrer-policy and a few more, and no x-powered-by header.",
      questions: [
        { q: 'What does helmet do?', a: 'It is Express middleware that sets a group of security-related HTTP response headers, like Content-Security-Policy, Strict-Transport-Security, X-Content-Type-Options and X-Frame-Options, and removes X-Powered-By.' },
        { q: 'What is Content-Security-Policy?', a: 'A header that tells the browser which sources of scripts, styles, images and frames a page may use. Even if an attacker injects a script tag, the browser refuses to run it if its source is not allowed, which greatly limits XSS.' },
        { q: 'What is HSTS?', a: 'Strict-Transport-Security tells browsers to only use HTTPS for your domain for a set time, which prevents downgrade attacks and accidental plain-HTTP requests.' },
        { q: 'Is helmet enough to secure an Express app?', a: 'No. It sets headers only. You still need input validation, authentication and authorization, rate limiting, safe error handling, HTTPS, secrets management and dependency updates.' },
      ],
      answer30: "helmet is a one-line middleware that sets safe security headers: Content-Security-Policy to limit where scripts can load from, HSTS to force HTTPS, nosniff, frame protections against clickjacking, and a strict referrer policy, and it removes X-Powered-By. I add it at the top of the middleware stack and tune the CSP for whatever we actually load. It's a baseline, not the whole story: validation, auth, rate limiting and safe errors are still where most of the security work is.",
      mistakes: [
        "Adding helmet and calling the app 'secure'.",
        "Copying a CSP with `'unsafe-inline'` everywhere, which removes most of its XSS protection.",
        "Enabling HSTS `preload` without understanding it is hard to undo.",
        "Trap: 'Why does my page break after adding helmet?' Usually the default CSP blocks inline scripts or third-party resources. Fix the CSP directives for what you really load, rather than turning CSP off.",
      ],
      takeaway: 'app.use(helmet()) for safe headers, tune the CSP, and remember headers are only one layer.',
    },

    {
      id: 'rate-limiting',
      title: 'Rate limiting',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Limit how many requests a client can make in a time window, with stricter limits on login and expensive endpoints, and a shared store when you run several instances.',
      what: [
        "Rate limiting caps how many requests one client (by IP, user id, API key or tenant) can make in a time window, for example 100 requests per 15 minutes. Over the limit, the API responds **429 Too Many Requests**, ideally with a `Retry-After` header.",
        "It protects against brute-force login attempts, scraping, abusive clients, accidental retry storms, and runaway costs on expensive endpoints (like AI calls). In Express the common package is `express-rate-limit`.",
      ],
      deeper: [
        "Use different limits per route: strict on `/auth/login`, `/auth/forgot-password` and OTP endpoints; looser on normal reads; per-tenant or per-plan quotas for paid APIs.",
        "**Store**: the default store is in-process memory, so with several instances (cluster, ECS tasks) each has its own counter and the real limit is multiplied. Use a shared store like Redis (`rate-limit-redis`) in production.",
        "**Behind a proxy or load balancer** every request seems to come from the proxy's IP. Set `app.set('trust proxy', 1)` (the number of proxies in front of you) so `req.ip` is the real client IP from `X-Forwarded-For`. Don't set `trust proxy` to `true` blindly, or clients can spoof their IP.",
        "Algorithms: fixed window (simple; allows bursts at window edges), sliding window, and token bucket (allows short bursts but caps the average). Edge layers like AWS WAF rate-based rules or API Gateway throttling can stop floods before they ever reach Node.",
      ],
      why: "Without rate limits, one script can brute-force passwords or knock over your database. Interviewers expect it in any 'how would you secure this API?' answer, plus the multi-instance and proxy gotchas.",
      analogy: "A ticket machine that lets each person take only 5 tickets an hour. If there are several machines, they need to share one list of who took what (Redis), or a person just walks to the next machine.",
      code: {
        lang: 'js',
        source: `import express from 'express';
import { rateLimit } from 'express-rate-limit';

const app = express();
app.set('trust proxy', 1); // behind one load balancer: req.ip = real client IP

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 300,               // per IP per window
  standardHeaders: 'draft-8', // RateLimit headers so clients can back off
  legacyHeaders: false,
  // store: new RedisStore({ ... }) in production, so all instances share counts
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 3,                 // tiny, to make the demo obvious; 5-10 is typical
  message: { error: 'Too many login attempts, try again later' },
});

app.use('/api', apiLimiter);
app.post('/auth/login', loginLimiter, (req, res) => res.json({ ok: true }));`,
      },
      output: "The first three POST /auth/login requests from one IP in 15 minutes return 200; the fourth returns 429 with the error message and a Retry-After: 900 header (seconds). Routes under /api use the general limiter, whose draft-8 RateLimit header (like '\"300-in-15min\"; r=299; t=900') tells clients how many requests remain and when the window resets.",
      questions: [
        { q: 'Why add rate limiting to an API?', a: 'To stop brute-force attacks on login and OTP endpoints, scraping and abuse, accidental retry storms, and runaway costs on expensive endpoints. Over the limit, the API returns 429 Too Many Requests.' },
        { q: 'Why does an in-memory rate limiter break with multiple instances?', a: 'Each instance keeps its own counters and the load balancer spreads requests, so a client effectively gets the limit times the number of instances. Use a shared store such as Redis.' },
        { q: 'Why does every user hit the rate limit at once behind a load balancer?', a: 'Without trust proxy, Express sees the load balancer\'s IP for every request, so all users share one counter. Set app.set("trust proxy", n) to the number of proxies so req.ip comes from X-Forwarded-For.' },
        { q: 'What status code and headers should a rate-limited response use?', a: '429 Too Many Requests, with Retry-After and RateLimit headers so well-behaved clients know when to try again.' },
      ],
      answer30: "I rate limit at two levels: a general per-IP or per-user limit on the whole API and much stricter limits on login, password reset and OTP endpoints, plus per-tenant quotas on expensive things like AI calls. Over the limit the API returns 429 with Retry-After. In production the counters live in Redis so all instances share them, and I set trust proxy correctly behind the load balancer so req.ip is the real client. For big floods, a WAF rate rule in front stops traffic before it reaches Node.",
      mistakes: [
        "Using the default memory store across several instances.",
        "Forgetting `trust proxy`, so everyone shares the load balancer's IP and gets blocked together.",
        "Setting `trust proxy` to `true` when only one proxy is in front, letting clients spoof `X-Forwarded-For`.",
        "Trap: 'Is rate limiting by IP enough for login?' Not fully: attackers rotate IPs. Add per-account limits or lockouts with care, CAPTCHA after failures, and alerting.",
      ],
      takeaway: 'Strict limits on auth, shared Redis store, correct trust proxy, 429 with Retry-After.',
    },

    {
      id: 'file-uploads',
      title: 'File uploads: multer vs presigned S3 URLs',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'multer parses multipart uploads through your server; for big files, let the browser upload straight to S3 with a presigned URL instead.',
      what: [
        "File uploads from a browser form use `multipart/form-data`, which `express.json()` can't read. **multer** is the standard Express middleware for it: it parses the upload and gives you `req.file` (or `req.files`) plus the other form fields in `req.body`.",
        "multer can keep the file in memory (`memoryStorage`, a Buffer) or write it to disk. Either way, the file travels **through your Node server**: the server receives every byte, then usually forwards it to S3.",
        "The better pattern for large files is a **presigned URL**: the API checks permissions and asks S3 for a temporary signed URL that allows uploading one object to one key. The browser uploads directly to S3, and your server never touches the file bytes.",
      ],
      deeper: [
        "With multer, always set `limits` (`fileSize`, `files`) and a `fileFilter`. `memoryStorage` with no size limit lets one client exhaust your memory. Don't trust the client's file name or MIME type: generate the storage key yourself, and check the real type from the file's first bytes if it matters.",
        "Presigned flow: (1) client asks `POST /uploads` with file name, type and size; (2) API validates, builds a key like `tenantId/candidateId/uuid.mp4`, and returns a presigned PUT URL (expires in minutes); (3) browser PUTs the file to S3; (4) client tells the API it's done, or an S3 event (to SQS or Lambda) triggers processing.",
        "A presigned PUT can't enforce a maximum size by itself. Use a presigned **POST** with a `content-length-range` condition, or validate the object's size after upload (S3 event) and delete oversized files. Very large files can use multipart uploads, with a presigned URL per part.",
        "Malware scanning, thumbnailing and transcoding happen asynchronously after upload (S3 event -> SQS -> worker), not inside the request.",
      ],
      why: "Uploads through Node use memory, bandwidth and request time, and can block your API under load. Direct-to-S3 is faster, cheaper and scales without touching your servers, which is why interviewers expect you to suggest it for anything larger than small images.",
      analogy: "multer is the receptionist accepting every parcel, carrying it to the store room, and holding up the queue meanwhile. A presigned URL is giving the courier a one-time code to the store room door, so they deliver it straight there.",
      code: [
        {
          lang: 'ts',
          title: 'Small files through the API with multer (with limits)',
          source: `import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024, files: 1 }, // 2 MB, one file
  fileFilter: (req, file, cb) => cb(null, ['image/png', 'image/jpeg'].includes(file.mimetype)),
});

router.post('/me/avatar', requireAuth, upload.single('avatar'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'PNG or JPEG required' });
  const key = \`\${req.user!.tenantId}/avatars/\${req.user!.sub}.\${req.file.mimetype === 'image/png' ? 'png' : 'jpg'}\`;
  await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: req.file.buffer, ContentType: req.file.mimetype }));
  res.status(201).json({ key });
});`,
        },
        {
          lang: 'ts',
          title: 'Large files direct to S3 with a presigned URL',
          source: `import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'node:crypto';

const s3 = new S3Client({ region: process.env.AWS_REGION });

router.post('/uploads/presign', requireAuth, validate(PresignBody), async (req, res) => {
  const { contentType } = req.validated;              // e.g. 'video/mp4', checked by the schema
  const key = \`\${req.user!.tenantId}/videos/\${randomUUID()}.mp4\`; // server builds the key, never the client
  const url = await getSignedUrl(
    s3,
    new PutObjectCommand({ Bucket: process.env.UPLOAD_BUCKET, Key: key, ContentType: contentType }),
    { expiresIn: 300 },                               // valid for 5 minutes
  );
  res.json({ url, key }); // browser: fetch(url, { method: 'PUT', body: file, headers: { 'Content-Type': contentType } })
});`,
        },
      ],
      output: "The avatar route accepts one PNG or JPEG up to 2 MB and stores it in S3 under a key the server chose; anything bigger fails with a multer LIMIT_FILE_SIZE error that the error handler should turn into a 413. The presign route returns a URL valid for 5 minutes; the browser uploads the video straight to S3 and the Node server never handles the video bytes. The S3 bucket also needs a CORS rule allowing PUT from the frontend's origin.",
      questions: [
        { q: 'How do you handle file uploads in Express?', a: 'For small files, multer parses multipart/form-data with size limits and a file filter, then the server stores the file, usually in S3. For large files, the API returns a presigned S3 URL and the browser uploads directly to S3, so the file never passes through Node.' },
        { q: 'What is a presigned URL?', a: 'A temporary URL signed with the server\'s AWS credentials that allows one specific action, like uploading to one exact key, until it expires. The client can use it without having AWS credentials.' },
        { q: 'Why not stream all uploads through the Node server?', a: 'Big files use the server\'s memory, bandwidth and request time, tie up connections, and hit load balancer timeouts and body limits. Direct-to-S3 uploads are faster, cheaper, and scale without your servers.' },
        { q: 'How do you keep presigned uploads safe?', a: 'Authenticate and authorize before signing, build the key on the server with a tenant prefix, keep expiry short, restrict content type, enforce size with a presigned POST policy or a post-upload check, and process or scan files asynchronously after the S3 event.' },
      ],
      answer30: "For small files like avatars, I use multer with strict limits on size, file count and type, and then store the file in S3 under a key I generate. For anything large, like videos or bulk documents, the API only authorizes and returns a short-lived presigned URL with a server-built, tenant-prefixed key, and the browser uploads straight to S3. That keeps big files off the Node servers entirely. Processing like scanning or transcoding is triggered asynchronously from the S3 event.",
      mistakes: [
        "multer with `memoryStorage` and no `fileSize` limit.",
        "Using the client's file name as the S3 key or a disk path.",
        "Letting the client choose the S3 key in a presigned flow, so it can overwrite other tenants' files.",
        "Trap: 'Does a presigned PUT URL limit the file size?' Not by itself. Use a presigned POST with a content-length-range condition or check the size after upload.",
      ],
      takeaway: 'multer with limits for small files; presigned S3 URLs with server-built keys for big ones.',
      note: "On your resume: Octagnt's public token-based API for direct-to-S3 video uploads, and the SQS + S3 bulk-upload pipeline (see 'public-upload-api' and 'sqs-bulk-pipeline' in the projects stack).",
    },

    {
      id: 'structuring-large-app',
      title: 'Structuring a large Express app (controllers, services, repositories)',
      level: 'advanced',
      priority: 'must',
      frequency: 'common',
      summary: 'Split by feature, and inside each feature separate HTTP (routes/controllers), business rules (services), and data access (repositories).',
      what: [
        "Small Express apps put everything in the route handler: read the request, run business rules, query MongoDB, send the response. In a large app that becomes impossible to test and change. The usual fix is **layers**:",
        "**Routes** map URLs to middleware and controllers. **Controllers** deal with HTTP only: read validated input from `req`, call a service, send the response. **Services** hold the business logic (rules, workflows, calls to other services) and know nothing about `req` or `res`. **Repositories** (or data-access modules) are the only code that talks to the database.",
        "Organise folders **by feature** (`modules/candidates`, `modules/jobs`, `modules/auth`), each with its routes, controller, service, repository and schemas, rather than one giant `controllers/` folder for everything.",
      ],
      deeper: [
        "Why layers pay off: services can be unit-tested with fake repositories, the same service can be called from an HTTP route, a queue worker and a cron job, and swapping a database query doesn't touch business rules.",
        "**Dependency injection** keeps it testable: build the app with a factory, `createApp({ candidateRepo, mailer })`, or a small composition root that wires real implementations in production and fakes in tests. Don't import singletons like the DB client deep inside services.",
        "Keep `app` (the configured Express app) separate from `server` (the file that calls `listen`). Tests import the app; only `server.ts` opens a port and handles shutdown.",
        "Cross-cutting concerns live in shared middleware: auth, tenant context, validation, request ids, error handling. Configuration is loaded and validated once in a `config` module.",
        "Don't over-engineer: a 10-route service doesn't need interfaces for everything. The goal is clear boundaries, not ceremony. If you want a framework to enforce structure, that's what NestJS offers.",
      ],
      why: "Interviewers ask 'how is your project structured and why?' to see whether you can keep a growing codebase maintainable and testable. Clear layers are also what make migrations (like moving to TypeScript) and team growth manageable.",
      analogy: "A restaurant. The waiter (controller) takes the order and serves the plate but doesn't cook. The chef (service) decides how the dish is made. The store-room keeper (repository) is the only one who goes into the store room. Each can be replaced without retraining the others.",
      code: [
        {
          lang: 'text',
          title: 'Feature-based folder layout',
          source: `src/
  app.ts                  # builds the Express app (middleware, routers, error handler); no listen()
  server.ts               # reads config, connects DB, app.listen(), graceful shutdown
  config.ts               # validated env config
  middleware/             # requireAuth, requirePermission, validate, requestId, errorHandler
  modules/
    candidates/
      candidates.routes.ts      # URL -> middleware -> controller
      candidates.controller.ts  # HTTP in/out only
      candidates.service.ts     # business rules, no req/res
      candidates.repository.ts  # all MongoDB queries for candidates
      candidates.schemas.ts     # zod schemas + inferred types
      candidates.test.ts
    jobs/ ...
  workers/
    bulk-upload.worker.ts  # reuses the same services from a queue consumer`,
        },
        {
          lang: 'ts',
          title: 'One request through the layers',
          source: `// candidates.repository.ts: the only place that knows about MongoDB
export const candidateRepo = {
  findById: (tenantId: string, id: string) => Candidate.findOne({ _id: id, tenantId }).lean(),
  updateStatus: (tenantId: string, id: string, status: string) =>
    Candidate.updateOne({ _id: id, tenantId }, { $set: { status } }),
};

// candidates.service.ts: business rules, no req/res
export function makeCandidateService(repo = candidateRepo, events = eventBus) {
  return {
    async moveToStage(tenantId: string, id: string, stage: string) {
      const c = await repo.findById(tenantId, id);
      if (!c) throw new NotFoundError('Candidate not found');
      if (c.status === 'hired') throw new ConflictError('Hired candidates cannot move stage');
      await repo.updateStatus(tenantId, id, stage);
      events.emit('candidate.stageChanged', { tenantId, id, from: c.status, to: stage });
    },
  };
}

// candidates.controller.ts: HTTP only
export const makeCandidateController = (service = makeCandidateService()) => ({
  moveStage: async (req: Request, res: Response) => {
    await service.moveToStage(req.user!.tenantId, req.params.id, req.validated.stage);
    res.status(204).end(); // errors thrown above go to the error middleware (Express 5)
  },
});

// candidates.routes.ts
// router.patch('/:id/stage', requireAuth, requirePermission('candidates', 'write'),
//   validate(MoveStageBody), controller.moveStage);`,
        },
      ],
      output: "A PATCH request passes through auth, permission and validation middleware, then the controller calls the service, the service applies the business rule using the repository, and the controller sends 204. NotFoundError and ConflictError thrown by the service become 404 and 409 in the central error handler. The same service can be reused by a queue worker.",
      questions: [
        { q: 'How do you structure a large Express application?', a: 'By feature modules, and inside each a layered split: routes, controllers for HTTP only, services for business logic, and repositories for database access, plus shared middleware, a validated config module, and a central error handler. app.ts builds the app and server.ts starts it.' },
        { q: 'What is the difference between a controller and a service?', a: 'A controller handles HTTP: reads validated input from req, calls services, and shapes the response. A service holds business rules and knows nothing about req or res, so it can be reused by workers and tested without HTTP.' },
        { q: 'Why use a repository layer?', a: 'It puts all database queries in one place, so services can be tested with a fake repository, queries can be optimised or changed without touching business logic, and rules like always filtering by tenantId are enforced in one spot.' },
        { q: 'Why separate app.ts from server.ts?', a: 'So tests can import the configured app and call it with Supertest without opening a port, and so startup concerns like DB connections and graceful shutdown stay in one file.' },
      ],
      answer30: "I organise by feature, like candidates, jobs and auth, and inside each feature I separate layers. Routes wire URLs to middleware and controllers. Controllers only deal with HTTP: they read validated input and send responses. Services hold business rules and know nothing about Express, so the same service runs from an API route or a queue worker. Repositories are the only code that touches MongoDB, which is also where I enforce tenant filters. Dependencies are injected through factories, so tests swap in fakes, and app.ts is separate from server.ts.",
      mistakes: [
        "Passing `req` and `res` into services, which ties business logic to Express.",
        "Database queries scattered across controllers and middleware.",
        "Folders split only by technical type (`controllers/`, `models/`) in a big app, so one feature change touches ten folders.",
        "Trap: 'Isn't this over-engineering for a small API?' It can be. Scale the structure to the app: a few routes can live in one file; layers earn their keep once there are several features, workers and a team.",
      ],
      takeaway: 'Feature folders; routes -> controllers (HTTP) -> services (rules) -> repositories (DB); inject dependencies.',
      note: "On your resume: your Octagnt testing setup used Supertest with mocked repositories (see 'octagnt-architecture' and 'localstack-testing' in the projects stack), which only works because of this layering.",
    },

    {
      id: 'logging-request-ids',
      title: 'Logging and request IDs',
      level: 'advanced',
      priority: 'good',
      frequency: 'common',
      summary: 'Log structured JSON with a request ID on every line, propagate the ID across services, and use AsyncLocalStorage so deep code can log it without passing req around.',
      what: [
        "In production you read logs in a search tool (CloudWatch Logs Insights, Datadog, ELK), not a terminal. **Structured logging** means every log line is JSON with consistent fields (level, time, message, requestId, userId, tenantId, route, status, duration), so you can filter and aggregate.",
        "A **request ID** (or correlation ID) is a unique id given to each incoming request. Every log line produced while handling that request includes it, and it's returned in a response header (like `x-request-id`). When a user reports an error, one id finds every related log line, even across services.",
        "Popular libraries: **pino** with **pino-http** (very fast, JSON by default) and **winston** (flexible, many transports). `morgan` writes simple access logs.",
      ],
      deeper: [
        "Reuse an incoming id if a trusted upstream set one (load balancer, API gateway, another service), otherwise generate one with `crypto.randomUUID()`. Pass it on in headers when calling other services, and in queue message attributes for workers, so a whole workflow can be traced. OpenTelemetry does this with standard trace ids.",
        "**AsyncLocalStorage** (`node:async_hooks`) keeps a per-request store that follows the async call chain. Set it once in middleware, and any function deeper in the code can read the request id or tenant id without receiving `req`.",
        "Log levels: `error` (something failed and needs attention), `warn`, `info` (business events, one access line per request), `debug` (off in production). Log once per error, at the boundary (the error handler), not at every layer.",
        "**Never log secrets or personal data**: passwords, tokens, cookies, full card numbers, or sensitive candidate details. Use redaction (pino's `redact` option) for headers like `authorization` and `cookie`.",
        "Logging is I/O; synchronous `console.log` to a slow destination can block. pino writes asynchronously and can offload formatting to a worker thread with transports.",
      ],
      why: "When something breaks in production, logs are your only witness. Interviewers ask how you'd debug a single failing request among millions; 'search by request id in structured logs' is the answer they want to hear.",
      analogy: "A parcel tracking number. Every depot that handles the parcel scans the same number, so when it goes missing you can see exactly where it has been. Without it you'd be searching every depot's diary by hand.",
      code: {
        lang: 'js',
        title: 'Request ID middleware with AsyncLocalStorage',
        source: `import express from 'express';
import { randomUUID } from 'node:crypto';
import { AsyncLocalStorage } from 'node:async_hooks';

const als = new AsyncLocalStorage();

// tiny structured logger: every line is JSON and carries the current request id
const log = (msg, extra = {}) =>
  console.log(JSON.stringify({ level: 'info', msg, requestId: als.getStore()?.requestId, ...extra }));

const app = express();

app.use((req, res, next) => {
  const requestId = req.get('x-request-id') ?? randomUUID(); // reuse the upstream id if present
  res.set('x-request-id', requestId);                        // clients can quote it in bug reports
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const ms = Math.round(Number(process.hrtime.bigint() - start) / 1e6);
    als.run({ requestId }, () =>
      log('request completed', { method: req.method, url: req.originalUrl, status: res.statusCode, ms }));
  });
  als.run({ requestId }, next); // everything after this sees the same store
});

async function chargeCard() {
  await new Promise((r) => setTimeout(r, 20));
  log('payment provider called'); // deep in a service: no req passed in, id still there
}

app.post('/checkout', async (req, res) => {
  await chargeCard();
  res.status(201).json({ ok: true });
});`,
      },
      output: "A POST /checkout sent with x-request-id: abc-123 logs {\"level\":\"info\",\"msg\":\"payment provider called\",\"requestId\":\"abc-123\"} and then {\"level\":\"info\",\"msg\":\"request completed\",\"requestId\":\"abc-123\",\"method\":\"POST\",\"url\":\"/checkout\",\"status\":201,\"ms\":24} (the duration varies), and the response carries the header x-request-id: abc-123. In real code, pino-http does the same with less code.",
      questions: [
        { q: 'What is a request ID and why use one?', a: 'A unique id attached to each incoming request, included in every log line for that request and returned in a response header. It lets you find all logs for one failing request, and when passed to other services and queues, trace it across the whole system.' },
        { q: 'What is structured logging?', a: 'Writing logs as JSON objects with consistent fields like level, timestamp, message, requestId and userId, instead of free text. Log tools can then filter, search and aggregate them.' },
        { q: 'How can deep service code log the request id without receiving req?', a: 'With AsyncLocalStorage from node:async_hooks. Middleware starts a store for each request containing the id, and any code in the same async chain can read it, so the logger adds it automatically.' },
        { q: 'What should you never log?', a: 'Passwords, tokens, cookies, API keys, full payment details and sensitive personal data. Use the logger\'s redaction feature for headers like authorization and cookie.' },
      ],
      answer30: "I log structured JSON with pino, one access line per request plus business events, with consistent fields: level, request id, tenant, user, route, status and duration. Each request gets an id, reused from the load balancer if present, returned in an x-request-id header, and passed to downstream services and queue messages. AsyncLocalStorage carries it through async code so the logger adds it without passing req around. Sensitive fields are redacted, and errors are logged once, in the error handler.",
      mistakes: [
        "Free-text `console.log` lines that can't be searched or correlated.",
        "Logging the same error in the repository, the service and the controller.",
        "Logging request bodies or headers with passwords and tokens.",
        "Trap: 'Why not just use the user id instead of a request id?' One user makes many requests; the request id identifies one specific request (and its downstream calls), which is what you need to debug one failure.",
      ],
      takeaway: 'JSON logs, a request id on every line and every hop, AsyncLocalStorage to carry it, and redact secrets.',
      note: "On your resume: the Skillkeepr audit logging service (buffered, redacted, non-blocking) is a related but different thing: audit logs record who did what for compliance, while application logs are for debugging. Be ready to explain both.",
    },

    {
      id: 'testing-supertest',
      title: 'Testing Express with Supertest',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Supertest sends real HTTP requests to your app in memory; combine it with Jest and fake repositories (or a test database) for fast, reliable API tests.',
      what: [
        "**Supertest** lets a test call your Express app like a real client: `await request(app).get('/candidates/42').expect(200)`. You pass the app object, and Supertest starts it on a temporary port for you, so you don't need a running server.",
        "It tests the whole HTTP path: routing, middleware, validation, status codes, headers and JSON shape. It's usually paired with **Jest** (or Vitest or node:test) for `describe`, `it`, `expect` and mocks.",
      ],
      deeper: [
        "Two common styles. **With fakes**: build the app with fake repositories (`jest.fn()`), so tests are fast and need no database; good for checking HTTP behaviour and error mapping. **With a real test database**: use `mongodb-memory-server` or a Docker/LocalStack setup and seed data per test; slower but catches query and index bugs. Most teams use both.",
        "Testability depends on structure: export `createApp(deps)` from `app.ts` without calling `listen`, and inject repositories and clients. Then each test builds an app with exactly the fakes it needs.",
        "For authenticated routes, sign a test JWT with a test secret and send it as a cookie or header, or inject a fake auth middleware. Test the auth middleware itself separately (missing token -> 401, wrong role -> 403).",
        "Keep tests isolated: reset mocks in `beforeEach`, never depend on test order, clean the database between tests, and close DB connections in `afterAll` so Jest exits.",
      ],
      why: "API tests catch the bugs users actually see: wrong status codes, broken validation, missing auth checks. Interviewers ask how you test your APIs and how you avoid slow, flaky tests that depend on real services.",
      analogy: "A flight simulator. The pilot (your app) goes through a full take-off and landing (a real HTTP request), but the weather and the other planes (database, AWS) are simulated, so you can test emergencies safely and repeatably.",
      code: [
        {
          lang: 'js',
          title: 'app.js: a factory with injected dependencies',
          source: `const express = require('express');

function createApp({ candidateRepo }) {
  const app = express();
  app.use(express.json());

  app.get('/candidates/:id', async (req, res) => {
    const candidate = await candidateRepo.findById(req.params.id);
    if (!candidate) return res.status(404).json({ error: 'Not found' });
    res.json(candidate);
  });

  app.post('/candidates', async (req, res) => {
    if (!req.body?.email) return res.status(400).json({ error: 'email is required' });
    res.status(201).json(await candidateRepo.create(req.body));
  });

  app.use((err, req, res, next) => res.status(500).json({ error: 'Internal server error' }));
  return app; // no listen() here: server.js does that
}

module.exports = { createApp };`,
        },
        {
          lang: 'js',
          title: 'candidates.test.js (Jest + Supertest)',
          source: `const request = require('supertest');
const { createApp } = require('./app');

describe('candidates API', () => {
  let repo;
  let app;

  beforeEach(() => {
    repo = { findById: jest.fn(), create: jest.fn() }; // fake repository: no database
    app = createApp({ candidateRepo: repo });
  });

  it('returns a candidate', async () => {
    repo.findById.mockResolvedValue({ id: '42', name: 'Asha' });
    const res = await request(app).get('/candidates/42').expect(200);
    expect(res.body).toEqual({ id: '42', name: 'Asha' });
    expect(repo.findById).toHaveBeenCalledWith('42');
  });

  it('returns 404 when missing', async () => {
    repo.findById.mockResolvedValue(null);
    await request(app).get('/candidates/7').expect(404, { error: 'Not found' });
  });

  it('validates the body', async () => {
    await request(app).post('/candidates').send({ name: 'No email' }).expect(400);
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('turns repository errors into a 500', async () => {
    repo.findById.mockRejectedValue(new Error('Mongo down'));
    await request(app).get('/candidates/1').expect(500); // Express 5 forwards the rejection
  });
});`,
        },
      ],
      output: "Running npx jest prints 'Tests: 4 passed, 4 total' in well under a second, with no database or open port needed. The last test passes only on Express 5; on Express 4 the rejected promise isn't forwarded, so the request hangs and the test times out.",
      questions: [
        { q: 'What is Supertest?', a: 'A library for testing HTTP servers. You pass it your Express app and it sends real HTTP requests to it on a temporary port, letting you assert on status codes, headers and bodies without starting the server yourself.' },
        { q: 'How do you test Express routes without a real database?', a: 'Build the app with injected dependencies and pass fake repositories (jest.fn mocks) in tests. Or use an in-memory database like mongodb-memory-server for tests that need real queries.' },
        { q: 'Why should app.js not call app.listen?', a: 'So tests can import the app and give it to Supertest without opening a fixed port. Only server.js listens, which avoids port clashes and lets each test build its own app.' },
        { q: 'How do you test authenticated endpoints?', a: 'Sign a test JWT with a test secret and send it as a cookie or Authorization header, or inject a fake auth middleware for route tests. Test the real auth middleware separately for the 401 and 403 cases.' },
        { q: 'Unit tests vs integration tests for an API?', a: 'Unit tests check one function or service in isolation with fakes. Integration tests check pieces working together, like a request through routing, middleware, service and a real or in-memory database. Supertest is mostly used for integration-style API tests.' },
      ],
      answer30: "I test Express APIs with Jest and Supertest. app.ts exports a factory that builds the app with injected dependencies and never calls listen, so each test creates an app with fake repositories and Supertest sends real HTTP requests to it. That checks routing, middleware, validation, status codes and error mapping in milliseconds. For query logic I add integration tests against an in-memory or containerised database, and for auth I sign test tokens. Mocks are reset before each test so tests never depend on order.",
      mistakes: [
        "Calling `app.listen()` in the module the tests import, leading to 'address already in use' and open handles.",
        "Tests that share state and pass or fail depending on run order.",
        "Only testing the happy path: no tests for 400, 401, 403, 404 and 500 responses.",
        "Trap: 'If every repository is mocked, do these tests prove the database query works?' No. They test HTTP behaviour and business rules. You still need some tests against a real (or in-memory) database for the queries themselves.",
      ],
      takeaway: 'Export an app factory, inject fakes, hit it with Supertest, and cover the error status codes too.',
      note: "On your resume: Jest coverage that cut regression bugs by about 30% on Skillkeepr, and Supertest with mocked repositories on Octagnt (see the projects stack). Use your real numbers and setup when you talk about them.",
    },

    {
      id: 'express-4-vs-5',
      title: 'Express 4 vs Express 5: what changed',
      level: 'intermediate',
      priority: 'good',
      frequency: 'occasional',
      summary: 'Express 5 forwards async errors automatically, uses stricter path syntax, removes old method signatures, and needs Node 18+.',
      note: "Status checked in October 2026: Express 5.2.x is the npm 'latest' tag, and 4.x is still maintained under the 'latest-4' tag. Check expressjs.com/en/support before an interview in case this changes.",
      what: [
        "Express 5.0 was released in September 2024, about ten years after 4.0, and became the default (`npm install express` installs it) in 2025. It's mostly a clean-up release: the API you use every day (`app.get`, `req`, `res`, middleware) is the same.",
        "The changes you'll be asked about: **async error handling** (rejected promises from handlers go to error middleware automatically), **path syntax** (named wildcards like `/*splat`, braces for optional parts, no regex characters in strings), **removed old signatures** (`res.send(status, body)`, `res.json(obj, status)`, `app.del`, `req.param()`), and **Node 18 or newer** required.",
      ],
      deeper: [
        "Other behaviour changes: `req.body` is `undefined` when no parser handled the request; `express.urlencoded()` defaults to `extended: false`; `req.query` is a read-only getter and uses the 'simple' parser (no nested objects by default); `express.static` ignores dotfiles by default; `res.status()` only accepts integer codes 100-999; `res.redirect('back')` was removed (use `req.get('Referrer') || '/'`); wildcard params are arrays.",
        "Old to new: `res.send(404, 'x')` -> `res.status(404).send('x')`; `res.json(obj, 201)` -> `res.status(201).json(obj)`; `res.redirect(url, 301)` -> `res.redirect(301, url)`; `res.sendfile` -> `res.sendFile`; `app.del` -> `app.delete`; `app.get('*', ...)` -> `app.get('/*splat', ...)` (or `'/{*splat}'` to also match the root).",
        "Migration approach: upgrade Node first (18+), run the official codemods (`npx codemod@latest @expressjs/v5-migration-recipe`), search for wildcard and optional routes, remove async wrappers like `express-async-errors` once on 5 (they become unnecessary), and rely on the test suite, especially tests for 404s and error responses.",
      ],
      why: "Many codebases are mid-migration, and 'how do you handle async errors in Express?' now has two correct answers depending on version. Knowing the differences shows you keep up and can upgrade safely.",
      analogy: "A new edition of a well-known textbook. Most chapters are the same, a few outdated sections were cut, some notation changed (route paths), and one big improvement was added (async errors). Students with the old edition can still follow along, but the page numbers don't all match.",
      code: {
        lang: 'js',
        title: 'Common Express 4 code and its Express 5 version',
        source: `// Express 4                                   // Express 5
// res.send(404, 'Not found')                    res.status(404).send('Not found')
// res.json(user, 201)                           res.status(201).json(user)
// res.redirect('/login', 301)                   res.redirect(301, '/login')
// app.del('/jobs/:id', h)                       app.delete('/jobs/:id', h)
// req.param('id')                               req.params.id / req.query.id / req.body.id
// app.get('*', spaFallback)                     app.get('/{*splat}', spaFallback)
// app.get('/:file.:ext?', h)                    app.get('/:file{.:ext}', h)

// Express 4: needed a wrapper or try/catch for every async handler
// app.get('/jobs/:id', asyncHandler(async (req, res) => { ... }));

// Express 5: just write async handlers
app.get('/jobs/:id', async (req, res) => {
  const job = await jobService.get(req.params.id); // a rejection goes to the error middleware
  res.json(job);
});`,
      },
      output: "After the migration, the routes behave as before, the async wrapper is gone, and an unnamed wildcard like app.get('*') (which would throw 'Missing parameter name' at startup on Express 5) is replaced by a named one.",
      questions: [
        { q: 'What is the biggest practical change in Express 5?', a: 'Async error handling: if a route handler or middleware returns a rejected promise or throws inside an async function, Express 5 passes the error to the error-handling middleware automatically. In Express 4 you needed try/catch with next(err) or a wrapper.' },
        { q: 'What changed in route paths in Express 5?', a: 'It uses a newer path-to-regexp. Wildcards must be named (/*splat), optional segments use braces (/:file{.:ext}), and regex-like characters in path strings are not supported. app.get("*") throws at startup.' },
        { q: 'Which Express 4 methods were removed or changed?', a: 'app.del (use app.delete), req.param() (use params, query or body), res.send and res.json with a status argument (use res.status().json()), res.sendfile (use sendFile), and res.redirect("back").' },
        { q: 'How would you migrate an app from Express 4 to 5?', a: 'Make sure Node is 18+, run the official Express codemods, fix wildcard and optional routes, update removed method signatures, remove async-error wrappers, and rely on the test suite plus a staging deploy before rolling out.' },
      ],
      answer30: "Express 5 is now the default version. Day-to-day code is the same, but there are a few important changes. Async handlers that throw or reject now go to the error middleware automatically, so wrappers like express-async-errors aren't needed. Route path syntax is stricter: wildcards are named, like /*splat, and optional parts use braces. Old signatures like res.json(obj, status) and app.del are gone, req.body is undefined without a parser, and it needs Node 18 or newer. I'd migrate with the official codemods and the test suite.",
      mistakes: [
        "Saying 'Express 5 is still in beta'. It has been stable since 2024 and the default since 2025.",
        "Upgrading Express without checking wildcard routes, which then throw at startup.",
        "Keeping `express-async-errors` after moving to 5, which patches internals that changed.",
        "Trap: 'Do you still need try/catch in Express 5?' Only where you want to handle an error locally (retry, fallback, a specific message). For simply reporting it, letting it propagate to the error middleware is enough.",
      ],
      takeaway: 'Express 5: automatic async error forwarding, named wildcards, removed legacy signatures, Node 18+.',
    },

    {
      id: 'performance-production',
      title: 'Performance and production setup',
      level: 'advanced',
      priority: 'good',
      frequency: 'common',
      summary: 'NODE_ENV=production, a reverse proxy or load balancer in front, compression and TLS at the edge, health checks, timeouts, graceful shutdown, and no blocking work in handlers.',
      what: [
        "Running Express in production is more than `node server.js`. A typical setup: the app runs in a container (ECS, Kubernetes) or under PM2, behind a **load balancer or reverse proxy** (AWS ALB, Nginx, CloudFront) that handles TLS, and with `NODE_ENV=production`.",
        "The app itself needs: **health checks** (a cheap `/health` for liveness, and a readiness check that verifies the DB connection), **security middleware** (helmet, CORS, rate limits), **structured logging** with request ids, **timeouts**, and **graceful shutdown** on SIGTERM.",
      ],
      deeper: [
        "`NODE_ENV=production` makes Express cache view templates and send less detailed error pages; many libraries also switch off development checks. It's cheap and expected.",
        "**Do expensive generic work at the edge**: TLS, gzip/brotli compression, static files and caching are better handled by the load balancer, CDN or Nginx than by Node's single thread. If you must compress in Node, the `compression` middleware works.",
        "**Behind a proxy**, set `app.set('trust proxy', n)` so `req.ip`, `req.protocol` and secure cookies work correctly.",
        "**Timeouts**: Node's server `keepAliveTimeout` (5 seconds by default) should be **longer** than the load balancer's idle timeout (60 seconds on ALB by default), otherwise Node may close a connection the load balancer is about to reuse, causing random 502s. Set `server.keepAliveTimeout = 65_000` and `server.headersTimeout` slightly higher. Also set timeouts on outgoing calls (DB, fetch).",
        "**Performance**: keep handlers async and light, paginate and index queries, use `.lean()` for read-only Mongoose queries, cache hot reads (Redis, HTTP caching with ETag/Cache-Control), use `Promise.all` for independent calls, stream large responses, and move slow work to queues. Order middleware so cheap rejections (rate limits, auth) happen before expensive work, and mount heavy parsers only on routes that need them.",
        "**Observability**: metrics (latency percentiles, error rate, event loop delay, memory), tracing (OpenTelemetry), and alerts. Run one process per container and let the platform scale on CPU or latency.",
      ],
      why: "'How would you deploy and run this in production?' is a common senior-leaning question, and the ALB keep-alive 502 bug and trust proxy are classic real-world issues that show hands-on experience.",
      analogy: "Opening a shop on a busy high street versus a market stall. You need a front door with security (load balancer, TLS), opening and closing procedures (health checks, graceful shutdown), CCTV (logs and metrics), and staff who don't spend ten minutes on one customer while the queue grows (non-blocking handlers, queues).",
      code: {
        lang: 'ts',
        title: 'server.ts: production essentials',
        source: `import { createApp } from './app';
import { config } from './config';
import { connectDb, disconnectDb, isDbReady } from './db';

await connectDb(config.MONGO_URI);

// app.ts mounts these before its 404 and error handlers:
//   app.get('/health', (req, res) => res.json({ ok: true }));                               // liveness: cheap
//   app.get('/ready', (req, res) => (isDbReady() ? res.json({ ok: true }) : res.status(503).end())); // readiness
const app = createApp({ isDbReady });
app.set('trust proxy', 1);                         // behind one ALB: real client IP and protocol

const server = app.listen(config.PORT, () => console.log(\`listening on \${config.PORT}\`));

// Keep-alive longer than the ALB idle timeout (60s) to avoid random 502s
server.keepAliveTimeout = 65_000;
server.headersTimeout = 66_000;
server.requestTimeout = 30_000;                    // no request may take longer than 30s

process.on('SIGTERM', () => {
  server.close(async () => {                       // finish in-flight requests first
    await disconnectDb();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 25_000).unref(); // forced exit before SIGKILL
});

// Dockerfile: FROM node:24-alpine ... ENV NODE_ENV=production ... USER node ... CMD ["node", "dist/server.js"]`,
      },
      output: "The service starts only after the database connects, exposes liveness and readiness endpoints for the load balancer, avoids keep-alive race 502s behind an ALB, caps request time at 30 seconds, and drains in-flight requests on deploys. Running as the non-root node user and starting node directly (not npm start) means SIGTERM reaches the process.",
      questions: [
        { q: 'How do you run an Express app in production?', a: 'In containers or under PM2, behind a load balancer that terminates TLS, with NODE_ENV=production, helmet and rate limits, structured logs with request ids, health and readiness endpoints, timeouts, graceful shutdown on SIGTERM, and metrics and alerts.' },
        { q: 'Why might you see random 502 errors behind an AWS ALB?', a: 'Node\'s default keepAliveTimeout is 5 seconds, shorter than the ALB\'s 60-second idle timeout. Node closes idle connections that the ALB still thinks are open, and the next request on them fails. Set keepAliveTimeout above the ALB timeout and headersTimeout slightly higher.' },
        { q: 'Should Express handle compression and static files?', a: 'Usually not in production. A CDN, load balancer or Nginx does compression, TLS and static files more efficiently, leaving Node\'s single thread for application logic. The compression middleware and express.static are fine for small setups.' },
        { q: 'What is the difference between liveness and readiness checks?', a: 'Liveness says the process is alive and should not be restarted; it should be cheap. Readiness says the instance can serve traffic, for example that the database is connected; the load balancer only sends requests to ready instances.' },
        { q: 'How do you make Express endpoints faster?', a: 'Measure first, then fix database access (indexes, projections, pagination, lean), run independent calls in parallel, cache hot reads, stream large responses, keep CPU work off the event loop, and move slow jobs to queues.' },
      ],
      answer30: "In production I run one Node process per container behind a load balancer that handles TLS, with NODE_ENV=production and trust proxy set. The app has a cheap liveness endpoint and a readiness endpoint that checks the database, helmet, CORS and rate limits, structured logs with request ids, and graceful shutdown on SIGTERM. I set keepAliveTimeout above the ALB's idle timeout to avoid random 502s, and timeouts on every outgoing call. Compression, static files and caching live at the edge, and slow work goes to queues so handlers stay fast.",
      mistakes: [
        "Leaving Node's default 5-second keep-alive behind a 60-second ALB idle timeout.",
        "A `/health` endpoint that runs heavy database queries on every probe.",
        "Starting the container with `npm start`, so SIGTERM may never reach Node.",
        "Trap: 'Should the health check fail when the database is down?' Readiness should (stop sending traffic), but liveness usually shouldn't, or the orchestrator restarts every instance in a loop during a database outage.",
      ],
      takeaway: 'Proxy in front, NODE_ENV=production, trust proxy, health/readiness, correct timeouts, graceful shutdown, slow work in queues.',
    },
  ],
  rapidFire: [
    { q: 'What is Express?', a: 'A minimal, unopinionated web framework for Node: routing, middleware, and request/response helpers.' },
    { q: 'Middleware signature?', a: '(req, res, next).' },
    { q: 'Error-handling middleware signature?', a: '(err, req, res, next): exactly four arguments, registered last.' },
    { q: 'Forget next() and never respond?', a: 'The request hangs until the client times out.' },
    { q: 'What does next(err) do?', a: 'Skips normal middleware and jumps to the next error handler.' },
    { q: 'req.params vs req.query?', a: 'Path segments like /users/:id vs the ?key=value query string.' },
    { q: 'Why is req.body undefined?', a: 'No body parser ran, or the Content-Type did not match it.' },
    { q: 'Default express.json() size limit?', a: '100kb.' },
    { q: 'Async errors in Express 5?', a: 'Rejected promises from handlers go to error middleware automatically.' },
    { q: 'Async errors in Express 4?', a: 'Not caught: use try/catch with next(err) or an asyncHandler wrapper.' },
    { q: 'Wildcard route in Express 5?', a: 'Named: /*splat, or /{*splat} to also match the root.' },
    { q: 'Minimum Node version for Express 5?', a: 'Node 18.' },
    { q: 'What is express.Router()?', a: 'A mountable mini-app for grouping routes and middleware by feature.' },
    { q: 'Nested router needs parent params?', a: 'Create it with express.Router({ mergeParams: true }).' },
    { q: '401 vs 403?', a: '401 is not authenticated; 403 is authenticated but not allowed.' },
    { q: 'CORS wildcard with cookies?', a: 'Not allowed: return the exact origin plus Allow-Credentials: true.' },
    { q: 'Does CORS protect your API from curl?', a: 'No, it is enforced only by browsers.' },
    { q: 'What does helmet do?', a: 'Sets security headers like CSP, HSTS and nosniff, and removes X-Powered-By.' },
    { q: 'Rate limiter across many instances?', a: 'Use a shared store like Redis, not in-memory counters.' },
    { q: 'Why set trust proxy?', a: 'So req.ip and req.protocol come from X-Forwarded-* behind a load balancer.' },
    { q: 'Large file uploads?', a: 'Presigned S3 URLs so files go straight from the browser to S3.' },
    { q: 'Test Express without a port?', a: 'Pass the app to Supertest: request(app).get(...).' },
    { q: 'Random 502s behind an ALB?', a: 'Set keepAliveTimeout above the ALB idle timeout (60s).' },
  ],
};

export default express;
