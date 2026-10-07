// API Design and Communication stack. Topics are auto-sorted Basic -> Intermediate -> Advanced by the registry.
// Every runnable JS example runs in Node 20+ (node file.mjs) and its output was checked.

const api = {
  name: 'API Design and Communication',
  intro: 'How services talk to each other: REST done properly, the HTTP details interviewers love, auth, reliability patterns like idempotency and webhooks, and when to reach for GraphQL, gRPC, or real-time channels.',
  topics: [
    {
      id: 'rest-principles-naming',
      title: 'REST principles and resource naming',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Model your API as resources (nouns) at stable URLs, and use HTTP methods (verbs) and status codes to act on them.',
      what: [
        "REST (Representational State Transfer) is a style for designing web APIs. You expose **resources**, like jobs or candidates, each at its own URL, and use standard HTTP methods to read or change them: `GET /jobs`, `POST /jobs`, `PATCH /jobs/42`.",
        "URLs are nouns, usually plural, and the method is the verb. So it's `DELETE /jobs/42`, not `POST /deleteJob?id=42`.",
      ],
      deeper: [
        "Core REST constraints: client-server separation; **statelessness** (each request carries everything needed, like the auth token, so any server can handle it); cacheability (responses say whether they can be cached); a uniform interface (methods, status codes, media types); and a layered system (proxies, CDNs, and gateways can sit in between).",
        "Naming rules that interviewers check: plural nouns (`/candidates`), lowercase with hyphens (`/job-postings`), nesting only for real ownership and only one level deep (`/jobs/42/applications`), query strings for filtering (`/candidates?stage=interview`), and no verbs in paths. For actions that aren't simple CRUD, either model them as a sub-resource (`POST /interviews/9/cancellation`) or accept a pragmatic verb (`POST /jobs/42/publish`) and be consistent.",
        "Most 'REST' APIs in practice are 'RESTful JSON over HTTP' and skip HATEOAS (links in responses telling the client what it can do next). That's fine to say in an interview; just know the term.",
      ],
      why: "A predictable API is easier to learn, document, cache, and secure. When every resource follows the same pattern, a new client developer can guess the next endpoint correctly.",
      analogy: "A library catalogue. Every book (resource) has a shelf address (URL). You don't have a separate desk for 'borrow-book' and 'return-book-form'; you go to the book's address and say what you want to do with it (the method).",
      code: {
        lang: 'text',
        title: 'Good vs bad endpoint design',
        source: `Bad (verbs, inconsistent)          Good (resources + methods)
-------------------------------    ----------------------------------------
GET  /getAllJobs                   GET    /jobs?status=open&sort=-createdAt
POST /createJob                    POST   /jobs
GET  /job?id=42                    GET    /jobs/42
POST /updateJobTitle               PATCH  /jobs/42
POST /deleteJob?id=42              DELETE /jobs/42
GET  /getCandidatesForJob/42       GET    /jobs/42/applications
POST /jobs/42/doPublish            POST   /jobs/42/publish   (pragmatic action, used consistently)`,
      },
      output: "The right column is guessable: once you know `/jobs`, you can predict how to read, create, update, or delete any job, and filters live in the query string.",
      questions: [
        { q: 'What makes an API RESTful?', a: 'Resources identified by URLs, standard HTTP methods to act on them, stateless requests that carry their own auth, meaningful status codes, and cacheable responses.' },
        { q: 'What does stateless mean in REST?', a: 'The server keeps no client session between requests; every request includes what\'s needed, like the token. That lets any server instance handle any request, which makes horizontal scaling easy.' },
        { q: 'How do you name endpoints?', a: 'Plural nouns, lowercase, hyphens for multiple words, nesting only one level for real ownership, and query parameters for filtering and sorting. No verbs in the path.' },
        { q: 'How do you handle an action like "publish a job" in REST?', a: 'Either update state (`PATCH /jobs/42` with `{ "status": "published" }`) or use a clear action sub-resource like `POST /jobs/42/publish`. Pick one style and use it consistently.' },
      ],
      answer30: "REST models the API as resources at stable URLs, like /jobs and /jobs/42, and uses HTTP methods as the verbs: GET to read, POST to create, PUT or PATCH to update, DELETE to remove. Requests are stateless, so each carries its own auth and any server can handle it. I use plural nouns, keep nesting shallow, put filters and sorting in the query string, and return proper status codes. For non-CRUD actions I use a clear sub-resource and stay consistent.",
      mistakes: [
        "Verbs in URLs, like `/createUser`.",
        "Deep nesting like `/tenants/1/jobs/42/applications/7/notes/3`. Give deep resources their own top-level path.",
        "Returning 200 with `{ success: false }` for errors instead of a real status code.",
        "Trap: 'Is a JSON API over HTTP automatically REST?' No. If every call is `POST /api` with an action name in the body, that's RPC, not REST.",
      ],
      takeaway: 'Nouns in URLs, verbs as methods, stateless requests, real status codes.',
    },

    {
      id: 'http-methods-idempotency-safety',
      title: 'HTTP methods, safety, and idempotency',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Safe methods don\'t change anything; idempotent methods give the same result no matter how many times you repeat them. POST and PATCH are neither by default.',
      what: [
        "**GET** reads, **POST** creates (or triggers an action), **PUT** replaces a whole resource, **PATCH** changes part of it, and **DELETE** removes it. HEAD and OPTIONS are for metadata and CORS preflight.",
        "A **safe** method doesn't change server state (GET, HEAD, OPTIONS). An **idempotent** method can be repeated and the end state is the same as doing it once (GET, PUT, DELETE, plus the safe ones).",
      ],
      deeper: [
        "POST is not idempotent: sending `POST /payments` twice can charge twice. PATCH is not guaranteed idempotent: `{ \"op\": \"increment\" }` changes the result each time, though a PATCH that sets fields to fixed values happens to be idempotent.",
        "Idempotency is about the **state**, not the response. `DELETE /jobs/42` might return 204 the first time and 404 the second, but the job is gone either way, so it's still idempotent.",
        "Why it matters: networks fail. If a client times out, it doesn't know whether the request reached the server. Idempotent requests can be retried safely by clients, proxies, and load balancers. For POST, you add an **idempotency key** so retries are safe too.",
        "PUT vs PATCH: PUT sends the full resource and missing fields are cleared or reset; PATCH sends only the changes (as a JSON merge patch or JSON Patch operations).",
      ],
      why: "Retries are everywhere: browsers, SDKs, queues, and gateways all retry. Knowing which methods are safe to retry prevents double charges and duplicate records.",
      analogy: "A lift button. Pressing 'floor 5' ten times still takes you to floor 5 (idempotent). Putting a coin in a vending machine ten times buys ten drinks (POST). Looking at the floor display changes nothing at all (safe).",
      code: {
        lang: 'text',
        title: 'Method cheat sheet',
        source: `Method   Purpose                    Safe  Idempotent  Typical success code
------   -------------------------  ----  ----------  --------------------
GET      read                       yes   yes         200
HEAD     headers only               yes   yes         200
OPTIONS  allowed methods / CORS     yes   yes         204
PUT      replace whole resource     no    yes         200 / 204 (201 if created)
DELETE   remove                     no    yes         204
PATCH    partial update             no    not always  200 / 204
POST     create / trigger action    no    no          201 (with Location) / 202

PUT  /jobs/42  { "title": "Node Engineer", "location": "Pune", "status": "open" }  -> whole object
PATCH /jobs/42 { "status": "closed" }                                              -> only what changed`,
      },
      output: "Repeating the PUT gives the same job every time. Repeating the PATCH that sets status to closed also ends in the same state. Repeating a POST to /jobs would create duplicate jobs unless you add an idempotency key.",
      questions: [
        { q: 'What is the difference between safe and idempotent?', a: 'Safe means the request doesn\'t change server state, like GET. Idempotent means repeating it leaves the same state as doing it once, like PUT or DELETE. All safe methods are idempotent, but not the other way round.' },
        { q: 'Is DELETE idempotent if the second call returns 404?', a: 'Yes. Idempotency is about the resulting server state, not the response code. After one or ten deletes, the resource is gone.' },
        { q: 'PUT vs PATCH?', a: 'PUT replaces the whole resource with what you send; PATCH applies a partial change. PUT is idempotent; PATCH may or may not be, depending on the operation.' },
        { q: 'Why is POST not idempotent and how do you make retries safe?', a: 'Each POST may create a new resource or trigger a new action. To make retries safe, the client sends an Idempotency-Key header and the server returns the stored result for repeated keys.' },
      ],
      answer30: "GET reads, POST creates, PUT replaces, PATCH partially updates, DELETE removes. Safe methods like GET don't change state; idempotent methods like PUT and DELETE leave the same state however many times you repeat them. POST isn't idempotent, so a retry after a timeout could create a duplicate, which is why payment-style endpoints accept an idempotency key. Idempotency is about state, not the response, so a second DELETE returning 404 is still idempotent.",
      mistakes: [
        "Using GET for actions that change data, like `GET /jobs/42/delete`. Crawlers and prefetchers will trigger it.",
        "Saying PATCH is always idempotent.",
        "Sending a partial body to PUT and accidentally wiping the other fields.",
        "Trap: 'Can a GET have a body?' The spec doesn't define meaning for it, and many proxies and libraries drop it. Use query parameters, or POST for complex searches.",
      ],
      takeaway: 'Safe = no change; idempotent = repeat-safe; POST needs an idempotency key to be retry-safe.',
    },

    {
      id: 'http-status-codes',
      title: 'HTTP status codes that matter',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: '2xx success, 3xx redirect, 4xx the client did something wrong, 5xx the server failed. Pick the most specific code you can.',
      what: [
        "Every HTTP response has a three-digit status code. The first digit is the category: **2xx** worked, **3xx** go somewhere else, **4xx** the client's request is wrong, **5xx** the server broke.",
        "Clients, monitoring tools, caches, and retry logic all read the status code before the body, so it must be accurate.",
      ],
      deeper: [
        "Success: **200** OK, **201** Created (add a `Location` header to the new resource), **202** Accepted (work will finish later, return a status URL), **204** No Content (success with no body, common for DELETE).",
        "Client errors: **400** malformed request; **401** not authenticated (missing or bad token); **403** authenticated but not allowed; **404** not found; **405** method not allowed; **409** conflict (duplicate, version mismatch); **412** precondition failed (If-Match didn't match); **415** unsupported media type; **422** validation failed on a well-formed body; **429** too many requests (add `Retry-After`).",
        "Server errors: **500** unexpected error, **502** bad gateway (upstream sent a bad response), **503** service unavailable (overloaded or in maintenance, may include `Retry-After`), **504** gateway timeout (upstream too slow).",
        "Redirects: **301/308** permanent, **302/307** temporary; 307 and 308 keep the original method and body. **304** Not Modified is for cache revalidation.",
        "For multi-tenant APIs, returning **404** instead of 403 for another tenant's resource avoids revealing that it exists.",
        "On your resume: the bulk upload API at Octagnt returns 202 with a batch id and the frontend polls for status (see the Projects stack, 'SQS pipeline for bulk uploads of 50+ files').",
      ],
      why: "Retries, alerts, and client logic depend on codes. A 500 triggers on-call alerts and retries; a 400 shouldn't be retried at all. Wrong codes cause wasted retries, missed alerts, and confusing client bugs.",
      analogy: "Postal return stamps. 'Delivered' (2xx), 'moved, forwarding address attached' (3xx), 'address incomplete, check what you wrote' (4xx), 'our sorting office is on fire' (5xx).",
      code: {
        lang: 'js',
        title: 'Express handlers returning precise codes',
        source: `app.post('/jobs', auth, async (req, res) => {
  const errors = validateJob(req.body);
  if (errors.length) return res.status(422).json({ errors });        // body understood, values invalid

  const exists = await Job.exists({ tenantId: req.user.tenantId, slug: req.body.slug });
  if (exists) return res.status(409).json({ error: 'Slug already used' }); // conflict

  const job = await Job.create({ ...req.body, tenantId: req.user.tenantId });
  res.status(201).location(\`/jobs/\${job.id}\`).json(job);           // created + where to find it
});

app.get('/jobs/:id', auth, async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, tenantId: req.user.tenantId });
  if (!job) return res.status(404).end(); // also for other tenants' jobs: don't reveal existence
  res.json(job);                          // 200
});

app.delete('/jobs/:id', auth, can('jobs', 'delete'), async (req, res) => {
  await Job.deleteOne({ _id: req.params.id, tenantId: req.user.tenantId });
  res.status(204).end();                  // success, nothing to return
});`,
      },
      output: "Creating a job with a missing title gets 422; a duplicate slug gets 409; a valid one gets 201 with a Location header. Reading another tenant's job returns 404. A recruiter without delete permission gets 403 from `can()`, and a missing token gets 401 from `auth`.",
      questions: [
        { q: '401 vs 403?', a: '401 means the server doesn\'t know who you are: the token is missing, invalid, or expired. 403 means it knows who you are, but you aren\'t allowed to do this.' },
        { q: '400 vs 422?', a: '400 is for a malformed request, like invalid JSON. 422 is for a well-formed body whose values fail validation. Many APIs use 400 for both; just be consistent.' },
        { q: 'When do you return 202?', a: 'When the request is accepted but the work happens later, like a bulk upload processed by a queue. Return a job or batch id and a URL to check status.' },
        { q: '502 vs 503 vs 504?', a: '502: a gateway got an invalid response from the upstream. 503: the service is temporarily unavailable or overloaded. 504: the gateway waited too long for the upstream.' },
        { q: 'Which status codes should a client retry?', a: 'Usually 429 and 503 (respecting Retry-After), plus 502, 504, and network errors for idempotent requests, with exponential backoff. Never blindly retry 4xx like 400, 401, 403, or 422.' },
      ],
      answer30: "2xx means success: 200 OK, 201 Created with a Location header, 202 Accepted for async work, 204 for no body. 4xx is the client's fault: 400 malformed, 401 not authenticated, 403 not allowed, 404 not found, 409 conflict, 422 validation, 429 rate limited. 5xx is the server's fault: 500, 502 bad gateway, 503 unavailable, 504 timeout. In my multi-tenant work, another tenant's record returns 404 rather than 403, so we don't leak that it exists.",
      mistakes: [
        "Returning 200 with an error in the body.",
        "Using 401 when the user is logged in but lacks permission (that's 403).",
        "Returning 500 for validation errors, which pages the on-call engineer for a user typo.",
        "Trap: 'Is 404 or 403 better for a resource the user can't access?' 403 if existence isn't secret; 404 when revealing existence leaks information, like another tenant's records.",
      ],
      takeaway: 'Be specific: 201/202/204 for success shapes, 401 vs 403 for auth, 409/422/429 for client issues, 5xx only for real server faults.',
    },

    {
      id: 'api-versioning',
      title: 'API versioning',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Version only for breaking changes; URL versions (`/v1`) are simplest, header or date-based versions are more flexible.',
      what: [
        "Once other teams or customers use your API, you can't change it freely. Versioning lets you release breaking changes in a new version while old clients keep working on the old one.",
        "A **breaking change** is anything that can break an existing client: removing or renaming a field, changing a type, adding a required parameter, or changing error formats. Adding an optional field or a new endpoint is usually not breaking.",
      ],
      deeper: [
        "Strategies: **URL path** (`/v1/jobs`): very visible, easy to route and cache, the most common. **Header** (`Api-Version: 2` or a custom media type in `Accept`): cleaner URLs, harder to test in a browser. **Query parameter** (`?version=2`): easy but messy. **Date-based** (Stripe style, `Stripe-Version: 2025-xx-xx`): each account is pinned to the version it started with, and the server transforms responses for older versions.",
        "Prefer evolving without breaking: add fields instead of changing them, make new parameters optional, and tell clients to ignore unknown fields (the 'tolerant reader' rule).",
        "When you deprecate, communicate: a changelog, a deprecation date, and response headers like `Deprecation` and `Sunset` so client teams get warnings automatically. Track which clients still call the old version before switching it off.",
        "Internal APIs between services you own often skip versions and use contract tests or coordinated deploys instead.",
      ],
      why: "Mobile apps and partner integrations can't all update the same day. Without versioning, any breaking change breaks someone in production.",
      analogy: "Phone chargers. When a new connector arrives, shops keep selling adapters and old cables for a while, and announce when the old type will stop being sold.",
      code: {
        lang: 'js',
        title: 'URL versioning in Express with a deprecation header',
        source: `const v1 = express.Router();
const v2 = express.Router();

// v1: returns "name"
v1.get('/candidates/:id', async (req, res) => {
  const c = await getCandidate(req);
  res.set('Deprecation', 'true');
  res.set('Sunset', 'Wed, 31 Mar 2027 23:59:59 GMT'); // when v1 stops working
  res.json({ id: c.id, name: \`\${c.firstName} \${c.lastName}\` });
});

// v2: breaking change, split name into two fields
v2.get('/candidates/:id', async (req, res) => {
  const c = await getCandidate(req);
  res.json({ id: c.id, firstName: c.firstName, lastName: c.lastName });
});

app.use('/v1', v1);
app.use('/v2', v2);`,
      },
      output: "Old clients calling `/v1/candidates/7` still get `name` plus Deprecation and Sunset headers warning them. New clients use `/v2` and get the split fields. Both share the same data layer.",
      questions: [
        { q: 'What counts as a breaking change?', a: 'Removing or renaming fields, changing a field\'s type or meaning, adding a required input, changing auth or error formats. Adding optional fields or new endpoints usually isn\'t breaking.' },
        { q: 'URL versioning vs header versioning?', a: 'URL versioning is explicit, easy to route, test, and cache. Header versioning keeps URLs stable and lets resources keep one identity, but it\'s less visible and easy to forget in clients.' },
        { q: 'How do you retire an old version?', a: 'Announce a deprecation date, add Deprecation and Sunset headers, monitor which clients still use it, contact them, and only switch it off when traffic is near zero.' },
        { q: 'How do you avoid needing new versions?', a: 'Design for additive change: new optional fields, new endpoints, and clients that ignore unknown fields.' },
      ],
      answer30: "I version only for breaking changes, like removing or renaming fields or changing types; additive changes don't need a new version. For public APIs I like URL versioning, /v1, because it's explicit and easy to route and cache. Header or Stripe-style date versioning is cleaner for large APIs. When retiring a version I add Deprecation and Sunset headers, publish a timeline, and watch usage before turning it off.",
      mistakes: [
        "Creating v2 for an additive change.",
        "Versioning each endpoint differently so clients mix `/v1/jobs` and `/v3/candidates`.",
        "Switching off a version without measuring who still uses it.",
        "Trap: 'Do internal microservices need versions?' Not always. If you own both sides, contract tests and backward-compatible deploys (expand, then contract) are often enough.",
      ],
      takeaway: 'Avoid breaking changes; when you must, version clearly and deprecate with dates and headers.',
    },

    {
      id: 'pagination-filtering-sorting',
      title: 'Pagination, filtering, and sorting',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Offset pagination is simple but slow and unstable on large or changing data; cursor (keyset) pagination is fast and consistent.',
      what: [
        "List endpoints should never return everything. **Pagination** returns a page at a time. **Filtering** (`?status=open`) narrows results, and **sorting** (`?sort=-createdAt`) orders them.",
        "**Offset pagination** uses `?page=3&limit=20` (skip 40, take 20). **Cursor pagination** uses `?cursor=abc&limit=20`, where the cursor marks the last item you saw, and the server returns items after it.",
      ],
      deeper: [
        "Offset problems: (1) `skip(100000)` still makes the database walk past 100,000 rows, so deep pages get slow. (2) If a new item is inserted while the user pages, items shift and the user sees duplicates or misses some.",
        "Cursor (keyset) pagination uses an indexed, unique sort key: 'give me 20 jobs with `createdAt` less than X'. It's fast at any depth and stable under inserts. Downsides: no 'jump to page 37' and the total count is a separate (often expensive) query. Use a tie-breaker (like `_id`) when the sort field isn't unique, and make the cursor opaque (base64) so clients don't depend on its contents.",
        "Filtering and sorting: whitelist allowed fields and operators (`?createdAfter=`, `?stage=interview`) instead of passing query objects to the database, which risks NoSQL injection and unindexed scans. Cap `limit` (for example max 100). Add compound indexes that match common filter + sort combinations.",
        "Response shape: `{ data: [...], nextCursor: '...' }` or a `Link` header. Infinite scroll and feeds fit cursors; admin tables with page numbers often fit offset.",
      ],
      why: "Unbounded lists kill memory and response time. The pagination style you pick decides whether page 500 takes 5 ms or 5 seconds, and whether users see duplicates when data changes.",
      analogy: "Reading a long book. Offset is 'go to page 300' by counting every page from the start. A cursor is a bookmark: you open straight to where you stopped, even if someone added pages earlier in the book.",
      code: {
        lang: 'js',
        title: 'Cursor pagination with an opaque cursor (runs in Node)',
        source: `// Cursor (keyset) pagination over a sorted list. In a real API this is a DB query:
// find({ createdAt: { $lt: cursor.createdAt } }).sort({ createdAt: -1, _id: -1 }).limit(limit + 1)
const jobs = Array.from({ length: 7 }, (_, i) => ({ id: 'j' + (7 - i), createdAt: 1700000000 + (7 - i) }));

const encode = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
const decode = (str) => JSON.parse(Buffer.from(str, 'base64url').toString());

function listJobs({ limit = 3, cursor } = {}) {
  const after = cursor ? decode(cursor) : null;
  const rows = jobs
    .filter((j) => !after || j.createdAt < after.createdAt) // "older than the last one I saw"
    .slice(0, limit + 1);                                    // fetch one extra to know if there's more
  const hasMore = rows.length > limit;
  const page = rows.slice(0, limit);
  const last = page[page.length - 1];
  return {
    data: page.map((j) => j.id),
    nextCursor: hasMore ? encode({ createdAt: last.createdAt }) : null,
  };
}

let res = listJobs();
console.log(res.data, res.nextCursor);
res = listJobs({ cursor: res.nextCursor });
console.log(res.data);
res = listJobs({ cursor: res.nextCursor });
console.log(res.data, res.nextCursor);`,
      },
      output: "Prints `[ 'j7', 'j6', 'j5' ] eyJjcmVhdGVkQXQiOjE3MDAwMDAwMDV9`, then `[ 'j4', 'j3', 'j2' ]`, then `[ 'j1' ] null`. Fetching one extra row tells the server whether another page exists without a count query; `null` means the end.",
      questions: [
        { q: 'Offset vs cursor pagination?', a: 'Offset (`page`, `limit`) is simple and supports jumping to a page, but gets slow on deep pages and shows duplicates when data changes. Cursor pagination continues from the last seen item using an index, so it\'s fast at any depth and stable, but can\'t jump to arbitrary pages.' },
        { q: 'Why is a deep offset slow?', a: 'The database still has to read and discard all the skipped rows before returning the page, so cost grows with the offset.' },
        { q: 'Why make the cursor opaque?', a: 'So clients treat it as a token and don\'t build logic on its contents. You can change the sort key or format later without breaking them.' },
        { q: 'How do you make filtering safe?', a: 'Whitelist filterable fields and operators, validate types, cap the page size, and back common filter and sort combinations with indexes. Never pass raw query objects to the database.' },
      ],
      answer30: "For large or changing lists I use cursor pagination: the client sends an opaque cursor for the last item it saw, and the server queries 'items after this key' on an index, fetching one extra row to know if there's more. It's fast at any depth and doesn't produce duplicates when new items arrive. Offset pagination is fine for small admin tables that need page numbers. Filters and sorts are whitelisted, limits are capped, and indexes match the common combinations.",
      mistakes: [
        "No max `limit`, so a client asks for 100,000 rows.",
        "Cursor on a non-unique field without a tie-breaker, so items with equal timestamps get skipped.",
        "Running an expensive `count()` on every page request.",
        "Trap: 'How do you show total pages with cursors?' You usually don't; show 'Load more', or return an approximate or cached total separately.",
      ],
      takeaway: 'Cursor for feeds and big data, offset for small page-numbered tables; always whitelist filters and cap the limit.',
    },

    {
      id: 'error-response-format',
      title: 'Error response format',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Return one consistent error shape everywhere, with a machine-readable code, a human message, field details, and a request id; RFC 9457 Problem Details is the standard option.',
      what: [
        "When something fails, the status code says the category, and the body should say exactly what went wrong in a format clients can rely on. Every endpoint should use the **same** error shape.",
        "A good error has: a stable machine-readable `code` (like `JOB_SLUG_TAKEN`), a human-readable `message`, optional per-field `errors` for validation, and a `requestId` that support can search logs for.",
      ],
      deeper: [
        "**RFC 9457 Problem Details** (it replaced RFC 7807 in 2023) is a standard JSON shape with `type` (a URI identifying the error kind), `title`, `status`, `detail`, and `instance`, served with `Content-Type: application/problem+json`. You can add your own fields like `errors` or `code`.",
        "Clients should branch on `code` or `type`, never on the message text, so you can reword messages or translate them without breaking anyone.",
        "Never leak internals: no stack traces, SQL or Mongo errors, or file paths in production responses. Log the details server-side with the request id and return a generic message for 500s.",
        "In Express, centralize this in one error-handling middleware (the four-argument `(err, req, res, next)` function) so controllers just throw typed errors.",
      ],
      why: "Inconsistent errors force every client to write special cases per endpoint. A stable code makes errors testable and translatable, and a request id turns 'it broke' into a five-minute log search.",
      analogy: "A car's dashboard warning lights. Each light has a fixed symbol (code) the mechanic recognizes, a manual entry explaining it (message), and the garage can read the exact fault log (request id) from the car's computer.",
      code: {
        lang: 'js',
        title: 'Central Express error handler producing Problem Details',
        source: `class AppError extends Error {
  constructor(status, code, message, errors) {
    super(message);
    Object.assign(this, { status, code, errors });
  }
}

// In a controller
if (await Job.exists({ tenantId, slug })) {
  throw new AppError(409, 'JOB_SLUG_TAKEN', 'A job with this slug already exists.');
}

// One error middleware for the whole app (registered last)
app.use((err, req, res, next) => {
  const known = err instanceof AppError;
  if (!known) req.log.error({ err, requestId: req.id }); // full details stay in logs
  res
    .status(known ? err.status : 500)
    .type('application/problem+json')
    .json({
      type: \`https://api.example.com/errors/\${known ? err.code : 'INTERNAL'}\`,
      title: known ? err.message : 'Something went wrong.',
      status: known ? err.status : 500,
      code: known ? err.code : 'INTERNAL',
      errors: known ? err.errors : undefined,    // e.g. [{ field: 'title', message: 'Required' }]
      requestId: req.id,
    });
});`,
      },
      output: "A duplicate slug returns 409 with `code: 'JOB_SLUG_TAKEN'` and the request id. An unexpected crash returns 500 with a generic title and `code: 'INTERNAL'`, while the stack trace goes only to the server logs under the same request id.",
      questions: [
        { q: 'What should an API error response contain?', a: 'A correct status code plus a consistent body: a stable machine-readable code, a human message, field-level details for validation errors, and a request or trace id.' },
        { q: 'What is RFC 9457?', a: 'Problem Details for HTTP APIs, a standard JSON error format with type, title, status, detail, and instance, using the `application/problem+json` media type. It replaced RFC 7807.' },
        { q: 'Why include a machine-readable error code?', a: 'Clients can branch on it reliably, and you can change or translate the message text without breaking them.' },
        { q: 'What should never appear in an error response?', a: 'Stack traces, raw database errors, internal hostnames, file paths, or secrets. Log them server-side and return a generic message.' },
      ],
      answer30: "Every endpoint returns the same error shape: the right status code, a stable machine-readable code, a human message, field-level details for validation, and a request id that matches our logs. RFC 9457 Problem Details is the standard format and I'm happy to follow it. In Express I throw typed errors and handle them in one error middleware, so 500s return a generic message while the stack trace goes to logs only.",
      mistakes: [
        "Different error shapes per endpoint or per team.",
        "Clients parsing the message string to decide what happened.",
        "Leaking stack traces or Mongo error text in production.",
        "Trap: 'Should validation return all errors or the first one?' All field errors at once, so the user can fix the form in one go.",
      ],
      takeaway: 'One error shape everywhere: status + stable code + message + field errors + request id; no internals.',
    },

    {
      id: 'api-authentication',
      title: 'API authentication: sessions, JWT, OAuth 2.0 / OIDC, API keys',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Sessions keep state on the server, JWTs carry signed claims, OAuth 2.0 delegates access, OIDC adds login on top, and API keys identify machines.',
      what: [
        "**Session auth:** after login the server stores a session and gives the browser a random session id in a cookie. Each request sends the cookie; the server looks it up.",
        "**JWT (JSON Web Token):** the server gives the client a signed token containing claims (user id, role, expiry). The server verifies the signature without a database lookup.",
        "**OAuth 2.0** lets a user give an app limited access to their data on another service (like 'connect your Dropbox') without sharing their password. **OpenID Connect (OIDC)** sits on top of OAuth and adds identity: 'Sign in with Google'. **API keys** are long secrets that identify a calling program, common for server-to-server and public developer APIs.",
      ],
      deeper: [
        "Sessions vs JWT: sessions are easy to revoke (delete the row) but need a shared store like Redis when you run many servers. JWTs scale without shared state but are hard to revoke before expiry, so keep access tokens short (minutes) and use a refresh token that the server can revoke.",
        "OAuth flows to know: **Authorization Code + PKCE** for web, mobile, and single-page apps (the app gets a code via redirect, then swaps it for tokens; PKCE stops a stolen code from being used). **Client Credentials** for machine-to-machine with no user. The implicit flow and the password grant are deprecated in OAuth 2.0 security best practices and dropped from the OAuth 2.1 draft.",
        "OAuth gives an **access token** (permission to call an API, with scopes). OIDC adds an **ID token**, a JWT describing who the user is. Don't use an ID token to call APIs, and don't treat a plain OAuth access token as proof of identity.",
        "API keys: show the key once, store only a hash (like a password), give it scopes and an owner, allow rotation (two active keys during a switch), and send it in a header, never in the URL where it ends up in logs.",
        "On your resume: at Octagnt you built cookie-based JWT auth with auto-renewal and RBAC, a Dropbox OAuth handshake, and scoped candidate tokens for the public upload API (see the Projects stack: 'Cookie-based JWT auth with auto-renewal, and RBAC' and 'Public token-based API for direct-to-S3 video uploads').",
      ],
      why: "Each method solves a different problem: a browser user, a third-party app acting for a user, or a backend service. Picking the wrong one leads to tokens you can't revoke, passwords shared with third parties, or secrets leaking in logs.",
      analogy: "Session: a cloakroom ticket; the venue keeps your coat and checks the ticket against its list. JWT: a signed wristband; staff trust the signature without checking a list. OAuth: a valet key that opens the car but not the boot. API key: a company badge for a delivery robot.",
      code: [
        {
          lang: 'js',
          title: 'Express: verify a JWT from an httpOnly cookie or an API key header',
          source: `const jwt = require('jsonwebtoken');
const crypto = require('node:crypto');

async function authenticate(req, res, next) {
  // 1) Browser users: short-lived access token in an httpOnly cookie
  const token = req.cookies?.access_token;
  if (token) {
    try {
      const claims = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
      req.user = { id: claims.sub, tenantId: claims.tenantId, role: claims.role };
      return next();
    } catch {
      return res.status(401).json({ code: 'TOKEN_INVALID' }); // expired or tampered -> client refreshes
    }
  }

  // 2) Server-to-server: API key in a header, stored hashed in the DB
  const apiKey = req.get('x-api-key');
  if (apiKey) {
    const hash = crypto.createHash('sha256').update(apiKey).digest('hex');
    const key = await ApiKey.findOne({ hash, revokedAt: null });
    if (key) { req.client = { tenantId: key.tenantId, scopes: key.scopes }; return next(); }
  }

  res.status(401).json({ code: 'UNAUTHENTICATED' });
}`,
        },
        {
          lang: 'text',
          title: 'OAuth 2.0 Authorization Code + PKCE (e.g. "Connect Dropbox")',
          source: `1. App creates code_verifier (random) and code_challenge = SHA256(verifier)
2. Browser -> provider /authorize?client_id&redirect_uri&scope&state&code_challenge
3. User logs in at the provider and approves the scopes
4. Provider -> redirect_uri?code=XYZ&state=...   (app checks state matches)
5. App server -> provider /token with code + code_verifier (+ client secret if confidential)
6. Provider -> { access_token, refresh_token, expires_in }   (+ id_token if OIDC)
7. App calls the provider's API with Authorization: Bearer <access_token>`,
        },
      ],
      output: "A browser request with a valid cookie gets `req.user` from the token claims with no database hit; an expired token gets 401 and the frontend refreshes. A partner server sending a valid `x-api-key` is identified by the hash lookup. In the OAuth flow, the app never sees the user's Dropbox password; it only gets scoped tokens.",
      questions: [
        { q: 'Session vs JWT authentication?', a: 'Sessions store state on the server and send a random id in a cookie, so revoking is easy but you need a shared session store at scale. JWTs carry signed claims and are verified without a lookup, so they scale easily but are hard to revoke, which is why access tokens are kept short-lived with a revocable refresh token.' },
        { q: 'OAuth 2.0 vs OpenID Connect?', a: 'OAuth 2.0 is for authorization: letting an app access an API on a user\'s behalf with scoped access tokens. OIDC adds authentication on top, with an ID token that says who the user is, for "Sign in with Google".' },
        { q: 'What is PKCE and why use it?', a: 'Proof Key for Code Exchange. The app sends a hash of a random secret when starting the flow and the secret itself when exchanging the code, so an intercepted authorization code is useless to an attacker. It\'s recommended for all clients now, not just mobile.' },
        { q: 'Where should a browser app keep tokens?', a: 'In httpOnly, Secure, SameSite cookies so JavaScript (and XSS) can\'t read them, with CSRF protection. localStorage is readable by any script on the page.' },
        { q: 'How should you store API keys?', a: 'Show the key to the user once and store only a hash, with scopes, an owner, and a revoked flag. Support rotation and never put keys in URLs.' },
      ],
      answer30: "Sessions keep state on the server and are easy to revoke; JWTs carry signed claims and scale without lookups, so I keep access tokens short-lived with a revocable refresh token, both in httpOnly cookies. OAuth 2.0 is for delegated access, like letting our app read a user's Dropbox, using the authorization code flow with PKCE; OIDC adds an ID token for sign-in. For server-to-server I use hashed, scoped API keys or the client credentials flow. At Octagnt I built the cookie JWT auth with auto-renewal, RBAC, and the Dropbox OAuth handshake.",
      mistakes: [
        "Storing sensitive data in a JWT payload. It's only base64-encoded and anyone can read it.",
        "Not pinning the algorithm in `jwt.verify`, which historically allowed `alg: none` and key-confusion attacks.",
        "Long-lived access tokens with no revocation strategy.",
        "Using the ID token as an API access token.",
        "Trap: 'Is a JWT encrypted?' A standard signed JWT (JWS) is not encrypted; it's tamper-proof, not secret. Encrypted JWTs (JWE) exist but are less common.",
      ],
      takeaway: 'Sessions = revocable state; JWT = signed claims, keep short; OAuth = delegated access with PKCE; OIDC = login; API keys = hashed and scoped.',
    },

    {
      id: 'idempotency-keys',
      title: 'Idempotency keys',
      level: 'advanced',
      priority: 'good',
      frequency: 'common',
      summary: 'The client sends a unique key with a POST; the server stores the result under that key and replays it for retries, so the action happens once.',
      what: [
        "A client sends `POST /payments`, the network times out, and the client doesn't know if the payment happened. Retrying might charge twice. An **idempotency key** fixes this.",
        "The client generates a unique id (like a UUID) per logical operation and sends it in an `Idempotency-Key` header. The server remembers the first result for that key. A retry with the same key gets the same response, without repeating the action.",
      ],
      deeper: [
        "Server steps: (1) look up the key, scoped to the client or tenant. (2) If it's new, store it as 'in progress' **atomically** (a unique index or Redis `SET NX`) so two parallel retries can't both proceed. (3) Do the work. (4) Save the response under the key. (5) A repeat with the same key and body replays the saved response; one still in progress gets 409; the same key with a different body gets 422.",
        "Keys expire after a window (Stripe keeps them for 24 hours). Store a hash (fingerprint) of the request body to detect key reuse with different data.",
        "Ideally the side effect and saving the key happen in one database transaction. When the side effect is external (an email, a third-party API), pass the same key downstream if that API supports it, or record progress steps so a retry can resume.",
        "The same idea applies to queue consumers: SQS standard queues deliver at least once, so workers use the message or file id as a natural idempotency key. On your resume: the Octagnt SQS bulk upload workers only claim items still in 'queued' state, so a duplicate message does nothing (see the Projects stack, 'SQS pipeline for bulk uploads of 50+ files').",
      ],
      why: "Retries are the only way to survive network failures, but retrying non-idempotent operations creates duplicates: double charges, two candidates, two emails. Idempotency keys make retries safe for POST.",
      analogy: "A cheque number. If the bank sees cheque #1042 twice, it pays it once and tells you it was already cashed. The number, not the amount, identifies the operation.",
      code: {
        lang: 'js',
        title: 'Idempotent payment creation (runs in Node; Map stands in for Redis/DB)',
        source: `// Idempotency keys: the same key + same body returns the stored result instead of charging twice.
import { createHash } from 'node:crypto';

const store = new Map(); // in production: Redis or a DB table with a unique index and a TTL
let charges = 0;

async function createPayment(idempotencyKey, body) {
  const fingerprint = createHash('sha256').update(JSON.stringify(body)).digest('hex');
  const saved = store.get(idempotencyKey);
  if (saved) {
    if (saved.fingerprint !== fingerprint) return { status: 422, body: { error: 'Key reused with a different body' } };
    if (saved.inProgress) return { status: 409, body: { error: 'Request still in progress' } };
    return { ...saved.response, replayed: true };
  }
  store.set(idempotencyKey, { fingerprint, inProgress: true }); // claim the key first
  charges++;                                                    // the real side effect
  const response = { status: 201, body: { paymentId: 'pay_' + charges, amount: body.amount } };
  store.set(idempotencyKey, { fingerprint, inProgress: false, response });
  return response;
}

console.log(await createPayment('key-123', { amount: 500 }));
console.log(await createPayment('key-123', { amount: 500 })); // client retried after a timeout
console.log(await createPayment('key-123', { amount: 900 }));
console.log('charges made:', charges);`,
      },
      output: "First call: `{ status: 201, body: { paymentId: 'pay_1', amount: 500 } }`. The retry returns the same 201 and `pay_1` with `replayed: true`. Reusing the key with amount 900 returns 422. The final line prints `charges made: 1`.",
      questions: [
        { q: 'What is an idempotency key?', a: 'A unique id the client sends with a non-idempotent request, usually in an Idempotency-Key header. The server stores the result under it and returns the same result for retries, so the action happens only once.' },
        { q: 'Who generates the key, client or server?', a: 'The client, once per logical operation, and it reuses the same key for every retry of that operation. If the server generated it, a lost response would leave the client without the key.' },
        { q: 'How do you handle two retries arriving at the same time?', a: 'Claim the key atomically before doing the work, with a unique index or Redis SET NX. The second request sees "in progress" and gets 409, or waits.' },
        { q: 'What if the same key comes with a different body?', a: 'Reject it, typically with 422, by comparing a stored hash of the original request body. It\'s a client bug.' },
      ],
      answer30: "For non-idempotent operations like payments, the client generates an idempotency key per operation and sends it in a header. The server atomically claims the key, does the work, and stores the response under it. Retries with the same key replay the stored response instead of charging again; a parallel duplicate gets 409, and the same key with a different body gets 422. Keys expire after a day or so. I used the same principle in our SQS workers, where the file id made processing safe to repeat.",
      mistakes: [
        "Checking then inserting in two steps, which lets two parallel retries both pass the check.",
        "Not scoping keys per client or tenant, so two clients' keys can collide.",
        "Storing the key only after the work, so a crash mid-way allows a duplicate on retry.",
        "Trap: 'Doesn't a unique index on the order number already solve it?' For that case, yes, a natural key works. Idempotency keys are the general solution when there's no natural unique field.",
      ],
      takeaway: 'Client-generated key + atomic claim + stored response = POST that is safe to retry.',
    },

    {
      id: 'rate-limiting',
      title: 'Rate limiting',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Limit how many requests each client can make in a time window, return 429 with Retry-After, and keep counters in a shared store like Redis.',
      what: [
        "Rate limiting caps how many requests a client (by user, API key, tenant, or IP) can make in a period, like 100 per minute. Requests over the limit get **429 Too Many Requests**.",
        "It protects your service from abuse and accidental floods (a buggy loop in a client), keeps usage fair between tenants, and protects expensive endpoints like login or AI calls.",
      ],
      deeper: [
        "Algorithms: **Fixed window** (count per calendar minute; simple, but allows a burst of 2x at the window edge). **Sliding window** (log or weighted counter; smoother). **Token bucket** (a bucket refills at a steady rate and each request spends a token; allows short bursts up to the bucket size and is the most common). **Leaky bucket** (processes at a fixed rate, smoothing output).",
        "With several API instances, counters must live in a shared store, usually Redis with `INCR` + `EXPIRE` or a Lua script for atomic token buckets. Per-instance memory limits multiply by the number of instances.",
        "Tell clients what's happening: `429` with `Retry-After`, and headers showing the limit and remaining quota (commonly `X-RateLimit-Limit` / `X-RateLimit-Remaining`; an IETF draft standardizes `RateLimit` and `RateLimit-Policy` headers). Clients should back off exponentially with jitter.",
        "Layers: an API gateway or CDN/WAF (AWS API Gateway throttling, AWS WAF rate rules) for coarse IP limits, plus app-level limits per user, tenant, or plan. Stricter limits on login and password reset slow down brute force. Plan-based limits tie into billing.",
        "On your resume: when syncing from external ATS systems at Octagnt you had to respect their rate limits (see the Projects stack, 'ATS synchronization with deduplication'). That's the client side of rate limiting: back off on 429.",
      ],
      why: "Without limits, one misbehaving client or attacker can exhaust your database, run up AI costs, or take the service down for everyone else.",
      analogy: "A coffee shop loyalty card that allows five free refills, refilled one per hour. You can use several at once (burst), but once they're gone you wait. Everyone has their own card, so one heavy drinker doesn't empty the pot for others.",
      code: {
        lang: 'js',
        title: 'Token bucket per client key (runs in Node; Redis in production)',
        source: `// Token bucket: capacity 5, refills 1 token per second. Each request costs one token.
function createLimiter({ capacity, refillPerSec }) {
  const buckets = new Map(); // key -> { tokens, last }
  return function allow(key, now) {
    const b = buckets.get(key) ?? { tokens: capacity, last: now };
    const elapsed = (now - b.last) / 1000;
    b.tokens = Math.min(capacity, b.tokens + elapsed * refillPerSec); // refill since last call
    b.last = now;
    const ok = b.tokens >= 1;
    if (ok) b.tokens -= 1;
    buckets.set(key, b);
    return { ok, remaining: Math.floor(b.tokens) };
  };
}

const allow = createLimiter({ capacity: 5, refillPerSec: 1 });
const t0 = 0;
const burst = Array.from({ length: 7 }, () => allow('api-key-A', t0).ok);
console.log('burst of 7 at t=0s:', burst.join(' '));
console.log('t=2s:', allow('api-key-A', t0 + 2000));
console.log('other client:', allow('api-key-B', t0));

// In Express: if (!result.ok) return res.status(429).set('Retry-After', '1').json({ code: 'RATE_LIMITED' });`,
      },
      output: "Prints `burst of 7 at t=0s: true true true true true false false`: five requests use the bucket, the next two are rejected. At t=2s two tokens have refilled, so the request passes with `remaining: 1`. Client B has its own bucket: `{ ok: true, remaining: 4 }`.",
      questions: [
        { q: 'What status code and headers for rate limiting?', a: '429 Too Many Requests with a Retry-After header, and ideally headers showing the limit and remaining quota so clients can slow down before hitting it.' },
        { q: 'Token bucket vs fixed window?', a: 'Fixed window counts requests per period and can allow a double burst at window edges. Token bucket refills at a steady rate and allows bursts up to the bucket size, giving smoother, fairer limiting.' },
        { q: 'How do you rate limit across multiple servers?', a: 'Keep counters in a shared store like Redis with atomic operations (INCR with EXPIRE, or a Lua script), or enforce limits at the gateway in front of all instances.' },
        { q: 'What should you rate limit by?', a: 'The most specific identity available: API key, user, or tenant for authenticated calls, IP for anonymous ones, with tighter limits on sensitive endpoints like login.' },
        { q: 'How should a client react to 429?', a: 'Wait for Retry-After if given, otherwise retry with exponential backoff and jitter, and cap the number of retries.' },
      ],
      answer30: "Rate limiting caps requests per client per time period and returns 429 with Retry-After when exceeded. I prefer a token bucket because it allows short bursts but enforces a steady average. Counters live in Redis so all instances share them, and coarse IP limits sit at the gateway or WAF. I limit by API key, user, or tenant, with stricter limits on login and expensive AI endpoints. As a client, for example when syncing from an ATS, I back off with jitter on 429.",
      mistakes: [
        "In-memory counters on each instance behind a load balancer.",
        "Limiting only by IP, which punishes whole offices behind one NAT and misses attackers with many IPs.",
        "Returning 503 or 500 instead of 429.",
        "Clients retrying immediately in a tight loop, making the overload worse.",
        "Trap: 'Is rate limiting enough to stop DDoS?' No. App-level limits still spend resources per request; large attacks are handled upstream by a CDN, WAF, or AWS Shield.",
      ],
      takeaway: '429 + Retry-After, token bucket in Redis, limit by key/user/tenant, and clients back off with jitter.',
    },

    {
      id: 'graphql-vs-rest',
      title: 'GraphQL vs REST (N+1 and DataLoader)',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'GraphQL lets the client ask for exactly the fields it needs from one endpoint; it fixes over- and under-fetching but brings N+1 queries, harder caching, and query-cost risks.',
      what: [
        "In REST, the server decides the response shape for each URL. In **GraphQL**, there's one endpoint (usually `POST /graphql`) and a typed **schema**; the client sends a query naming exactly the fields it wants, and gets back JSON in that shape.",
        "This fixes **over-fetching** (getting 40 fields when you need 3) and **under-fetching** (calling `/jobs`, then `/jobs/1/candidates`, then `/users/7` to build one screen).",
      ],
      deeper: [
        "Each field has a **resolver** function. Naively, resolving `posts { author { name } }` runs one query for posts and then one author query per post: the **N+1 problem**. **DataLoader** fixes it by collecting all the ids requested in the same tick, running one batched query (`WHERE id IN (...)`), and caching per request. Create a new DataLoader per request so users never share cached data.",
        "Trade-offs vs REST: HTTP caching is harder because queries go through POST to one URL (persisted queries with GET help); clients can send very deep or expensive queries, so you need depth limits, cost analysis, and timeouts; errors usually return 200 with an `errors` array; and file uploads need extra conventions.",
        "Strengths: strong typing and introspection (great tooling and codegen), one round trip per screen, and schema evolution by deprecating fields instead of versioning.",
        "Rule of thumb: REST for public, cacheable, resource-style APIs and simple CRUD; GraphQL when many different clients (web, mobile) need different shapes of deeply related data, often as a backend-for-frontend layer.",
      ],
      why: "Interviewers want to hear trade-offs, not hype. GraphQL solves real client problems but shifts complexity to the server, and the N+1 problem is the classic follow-up.",
      analogy: "REST is a set menu: each dish (endpoint) comes as the kitchen designed it. GraphQL is ordering à la carte: you list exactly what you want on one order. The kitchen must then avoid running to the store separately for each ingredient (N+1) by batching the shopping list (DataLoader).",
      code: [
        {
          lang: 'text',
          title: 'A GraphQL query and its response shape',
          source: `query {
  job(id: "42") {
    title
    applications(first: 2) {
      candidate { name }
      stage
    }
  }
}

# -> { "data": { "job": { "title": "Node Engineer",
#        "applications": [ { "candidate": { "name": "Asha" }, "stage": "INTERVIEW" },
#                          { "candidate": { "name": "Ravi" }, "stage": "SCREEN" } ] } } }`,
        },
        {
          lang: 'js',
          title: 'N+1 vs a minimal DataLoader-style batcher (runs in Node)',
          source: `// The N+1 problem and how a DataLoader-style batcher fixes it.
let queries = 0;
const users = { u1: 'Asha', u2: 'Ravi', u3: 'Meera' };
const db = {
  findUserById: async (id) => { queries++; return { id, name: users[id] }; },
  findUsersByIds: async (ids) => { queries++; return ids.map((id) => ({ id, name: users[id] })); },
};
const posts = [
  { id: 'p1', authorId: 'u1' }, { id: 'p2', authorId: 'u2' },
  { id: 'p3', authorId: 'u1' }, { id: 'p4', authorId: 'u3' },
];

// Naive resolver: 1 query for posts + 1 per post for the author = N+1
queries = 1; // the posts query
await Promise.all(posts.map((p) => db.findUserById(p.authorId)));
console.log('naive queries:', queries);

// Minimal DataLoader: collect keys during this tick, then run one batched query
function createLoader(batchFn) {
  let pending = null;
  const cache = new Map();
  return {
    load(key) {
      if (cache.has(key)) return cache.get(key);          // per-request cache dedupes u1
      if (!pending) {
        pending = { keys: [], resolvers: [] };
        queueMicrotask(async () => {
          const { keys, resolvers } = pending;
          pending = null;
          const rows = await batchFn(keys);
          rows.forEach((row, i) => resolvers[i](row));     // results in the same order as keys
        });
      }
      const promise = new Promise((resolve) => { pending.keys.push(key); pending.resolvers.push(resolve); });
      cache.set(key, promise);
      return promise;
    },
  };
}

queries = 1;
const userLoader = createLoader((ids) => db.findUsersByIds(ids)); // create one per request
const authors = await Promise.all(posts.map((p) => userLoader.load(p.authorId)));
console.log('batched queries:', queries);
console.log(authors.map((a) => a.name).join(', '));`,
        },
      ],
      output: "Prints `naive queries: 5` (1 for posts + 4 author lookups), then `batched queries: 2` (1 for posts + 1 batched lookup for u1, u2, u3; the second u1 is served from the per-request cache), then `Asha, Ravi, Asha, Meera`.",
      questions: [
        { q: 'GraphQL vs REST: when would you choose each?', a: 'REST for simple, resource-oriented, cacheable public APIs. GraphQL when several clients need different shapes of deeply related data and you want one round trip per screen, accepting more server complexity.' },
        { q: 'What is the N+1 problem in GraphQL?', a: 'Resolving a list and then a related field per item runs one query for the list plus one query per item. With 100 items that\'s 101 database calls.' },
        { q: 'How does DataLoader solve N+1?', a: 'It collects all keys requested during the same tick of the event loop, calls a batch function once with all of them (one IN query), and caches results for the rest of the request.' },
        { q: 'Why is caching harder in GraphQL?', a: 'Queries usually go to one URL via POST, so CDNs and browser HTTP caches can\'t key on the URL. You use persisted queries over GET or client-side normalized caches like Apollo\'s.' },
        { q: 'How do you protect a GraphQL API from expensive queries?', a: 'Limit query depth and complexity, cap list sizes, use timeouts, allow only persisted queries in production, and rate limit by cost instead of request count.' },
      ],
      answer30: "REST exposes fixed resource shapes at many URLs; GraphQL exposes one typed schema where clients ask for exactly the fields they need, which removes over- and under-fetching. The cost is server complexity: the N+1 problem, where resolving a related field per item fires one query each, which DataLoader fixes by batching keys per tick and caching per request; harder HTTP caching; and the need for depth and cost limits. I'd pick REST for public CRUD APIs and GraphQL when many clients need varied, nested data.",
      mistakes: [
        "Sharing one DataLoader instance across requests, which leaks cached data between users.",
        "Batch function returning results in a different order from the keys.",
        "No depth or cost limits on a public GraphQL endpoint.",
        "Trap: 'Does GraphQL make the backend faster?' Not by itself. It reduces round trips for the client, but the server still has to resolve every field efficiently.",
      ],
      takeaway: 'GraphQL = client-shaped responses from one schema; watch N+1 (DataLoader), caching, and query cost.',
    },

    {
      id: 'grpc-basics',
      title: 'gRPC basics',
      level: 'advanced',
      priority: 'rare',
      frequency: 'occasional',
      summary: 'A fast RPC framework that uses Protocol Buffers contracts and HTTP/2, mostly for service-to-service calls.',
      what: [
        "gRPC lets one service call a function on another service as if it were local. You define the service and messages in a `.proto` file, and tools generate typed client and server code in many languages.",
        "Messages are encoded as **Protocol Buffers** (protobuf), a compact binary format, and sent over **HTTP/2**.",
      ],
      deeper: [
        "Four call types: unary (one request, one response), server streaming, client streaming, and bidirectional streaming, all over one HTTP/2 connection.",
        "Strengths: smaller payloads and faster parsing than JSON, a strict shared contract with code generation, built-in deadlines and cancellation, and streaming. Fields are identified by numbers, so you can add fields without breaking old clients, but never reuse or renumber a field.",
        "Weaknesses: browsers can't call gRPC directly (you need gRPC-Web or Connect through a proxy), payloads aren't human-readable, so debugging needs tools, and HTTP caching doesn't apply. Load balancing needs care because HTTP/2 keeps long-lived connections, so a simple L4 load balancer can pin all traffic to one backend.",
        "Typical setup: REST or GraphQL at the edge for browsers and partners, gRPC between internal microservices where latency and contracts matter.",
      ],
      why: "In a microservice system with many chatty internal calls, JSON parsing and loose contracts add latency and bugs. gRPC gives speed and type-safe contracts across languages.",
      analogy: "REST with JSON is sending letters in plain English that anyone can read. gRPC is two engineers using a shared, numbered form in shorthand: much faster, but you need the form's key (the .proto file) to understand it.",
      code: {
        lang: 'text',
        title: 'scoring.proto: a contract both services generate code from',
        source: `syntax = "proto3";

package scoring.v1;

service ScoringService {
  rpc ScoreCandidate (ScoreRequest) returns (ScoreReply);                 // unary
  rpc StreamScores (BatchRequest) returns (stream ScoreReply);            // server streaming
}

message ScoreRequest {
  string tenant_id = 1;
  string candidate_id = 2;
  repeated string skills = 3;
}

message ScoreReply {
  string candidate_id = 1;
  double total = 2;
  bool qualified = 3;
  // field numbers are the wire identity: add new ones, never reuse old ones
}

message BatchRequest { repeated string candidate_ids = 1; }`,
      },
      output: "Running `protoc` (or `buf generate`) produces a typed client for the calling service and a server interface for the scoring service. A call like `ScoreCandidate` sends a compact binary message over HTTP/2 and returns a typed `ScoreReply`.",
      questions: [
        { q: 'What is gRPC?', a: 'A remote procedure call framework that uses Protocol Buffers for the contract and binary encoding, and HTTP/2 for transport, with generated typed clients and servers.' },
        { q: 'gRPC vs REST?', a: 'gRPC is faster and strictly typed, supports streaming, and suits internal service-to-service calls. REST with JSON is human-readable, cacheable, and works natively in browsers, so it suits public APIs.' },
        { q: 'Can a browser call gRPC directly?', a: 'Not natively, because browsers don\'t expose the HTTP/2 control gRPC needs. You use gRPC-Web or Connect, usually through a proxy like Envoy.' },
        { q: 'How do you evolve a protobuf schema safely?', a: 'Add new fields with new numbers, never change or reuse an existing field number, and mark removed fields as reserved.' },
      ],
      answer30: "gRPC is an RPC framework where you define services and messages in a .proto file and generate typed clients and servers. It sends compact protobuf binary over HTTP/2, supports streaming in both directions, and has deadlines built in. It's great for internal microservice calls where latency and strict contracts matter. For browsers and public partners I'd still expose REST or GraphQL, since gRPC isn't browser-native and isn't human-readable.",
      mistakes: [
        "Reusing a removed field number, which makes old and new clients misread data.",
        "Exposing gRPC directly to browsers without gRPC-Web or Connect.",
        "No deadlines on calls, so one slow service ties up callers.",
        "Trap: 'Is gRPC always faster?' For small, infrequent calls the difference is minor; the bigger wins are contracts, streaming, and fewer parsing costs at high volume.",
      ],
      takeaway: 'gRPC = protobuf contract + HTTP/2 + codegen; great inside the system, REST/GraphQL at the edge.',
    },

    {
      id: 'realtime-websockets-sse-polling',
      title: 'WebSockets vs SSE vs long polling',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Polling asks repeatedly, long polling waits for news, SSE streams server-to-client over HTTP, and WebSockets are a two-way channel.',
      what: [
        "**Short polling:** the client calls `GET /status` every few seconds. Simple, but wasteful and delayed.",
        "**Long polling:** the client calls, and the server holds the request open until there's news (or a timeout), then the client immediately calls again.",
        "**Server-Sent Events (SSE):** one long HTTP response where the server keeps sending text events. One-way, server to client. **WebSockets:** an HTTP connection upgraded to a persistent, two-way channel where both sides can send messages anytime.",
      ],
      deeper: [
        "SSE uses the browser's `EventSource`, reconnects automatically, and resumes with the `Last-Event-ID` header. It's plain HTTP, so it works with normal auth, proxies, and HTTP/2. It's the usual choice for streaming LLM output token by token. Limits: text only, one direction, and over HTTP/1.1 browsers allow only about 6 connections per domain.",
        "WebSockets fit chat, collaborative editing, multiplayer, and real-time audio. Costs: each server holds many open connections, so scaling needs sticky sessions or a pub/sub layer (like Redis) to fan messages out across instances, plus heartbeats (ping/pong), reconnection logic, and auth at connect time.",
        "Choose by direction and frequency: rare updates or simple progress -> polling; frequent server-to-client updates -> SSE; frequent messages both ways or very low latency -> WebSockets.",
        "On your resume: the Octagnt bulk upload status view uses polling, which was enough for minutes-long jobs, while the voice interview agent receives Twilio call audio over a WebSocket because it's continuous, two-way, and latency-sensitive (see the Projects stack: 'SQS pipeline for bulk uploads of 50+ files' and 'AI features: JD generation and the voice interview agent').",
      ],
      why: "Users expect live updates for progress, notifications, chat, and AI streaming. Picking the simplest channel that meets the need saves a lot of infrastructure work.",
      analogy: "Polling is a child asking 'are we there yet?' every minute. Long polling is asking once and the driver answering only when you arrive. SSE is a radio broadcast you tune into. WebSockets are a phone call: both people can talk at any time.",
      code: [
        {
          lang: 'js',
          title: 'SSE endpoint in Express and the browser client',
          source: `// Server: stream progress events for one batch
app.get('/batches/:id/events', auth, (req, res) => {
  res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
  res.flushHeaders();

  const send = (event) => res.write(\`id: \${event.seq}\\nevent: progress\\ndata: \${JSON.stringify(event)}\\n\\n\`);
  const unsubscribe = batchEvents.subscribe(req.params.id, send); // e.g. Redis pub/sub
  const heartbeat = setInterval(() => res.write(': ping\\n\\n'), 25000); // keep proxies from closing it

  req.on('close', () => { clearInterval(heartbeat); unsubscribe(); });
});

// Browser
const source = new EventSource('/batches/b42/events', { withCredentials: true });
source.addEventListener('progress', (e) => {
  const { done, total } = JSON.parse(e.data);
  console.log(\`\${done}/\${total} files processed\`);
});`,
        },
        {
          lang: 'js',
          title: 'WebSocket server with the ws library (two-way)',
          source: `import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (socket, req) => {
  // authenticate during the upgrade (cookie or short-lived token), close if invalid
  socket.on('message', (data) => {
    const msg = JSON.parse(data);
    if (msg.type === 'typing') broadcastToRoom(msg.room, { type: 'typing', user: msg.user });
  });
  socket.send(JSON.stringify({ type: 'welcome' }));
});`,
        },
      ],
      output: "With SSE the browser logs '3/50 files processed', '4/50 files processed', and so on as the server pushes events, and reconnects automatically if the connection drops. With WebSockets, both sides send messages whenever they like, such as typing indicators.",
      questions: [
        { q: 'SSE vs WebSockets?', a: 'SSE is one-way (server to client) over plain HTTP, with automatic reconnection and simple auth; ideal for notifications, progress, and streaming AI output. WebSockets are full-duplex, for chat, collaboration, games, and real-time audio, but need more infrastructure.' },
        { q: 'What is long polling?', a: 'The client makes a request and the server holds it open until there\'s new data or a timeout, then the client immediately sends another. It simulates push over plain HTTP.' },
        { q: 'How do you scale WebSockets across multiple servers?', a: 'Use a pub/sub layer like Redis so a message published on one instance reaches clients connected to others, plus sticky sessions or connection-aware load balancing, heartbeats, and reconnection logic.' },
        { q: 'Why is SSE common for LLM streaming?', a: 'Tokens flow only from server to client, SSE is plain HTTP so it works with existing auth and proxies, and the browser handles reconnection.' },
        { q: 'When is plain polling good enough?', a: 'When updates are infrequent or a few seconds of delay is fine, like checking a long-running job\'s status. It\'s the simplest to build, cache, and scale.' },
      ],
      answer30: "Short polling asks repeatedly; long polling holds the request until there's news; SSE keeps one HTTP response open and pushes events server to client with automatic reconnection; WebSockets upgrade to a full two-way channel. I start with the simplest that works: polling for slow job status, which is what our bulk upload progress uses, SSE for notifications and streaming AI output, and WebSockets for two-way, low-latency traffic like the voice agent's call audio. Scaling WebSockets needs pub/sub across instances and heartbeats.",
      mistakes: [
        "Reaching for WebSockets when updates only flow one way.",
        "No heartbeat, so proxies and load balancers silently drop idle connections.",
        "Keeping WebSocket state in one instance's memory, so users on other instances miss messages.",
        "Opening many SSE streams per tab over HTTP/1.1 and hitting the browser's per-domain connection limit.",
        "Trap: 'Does SSE work through load balancers?' Yes, it's plain HTTP, but set long idle timeouts and disable response buffering in proxies like nginx.",
      ],
      takeaway: 'Polling for slow updates, SSE for server push, WebSockets for true two-way real time.',
    },

    {
      id: 'webhooks-design',
      title: 'Webhooks: signing, retries, and idempotent handlers',
      level: 'advanced',
      priority: 'must',
      frequency: 'common',
      summary: 'A webhook is an HTTP POST your system sends (or receives) when an event happens; sign it, retry with backoff, and make receivers idempotent.',
      what: [
        "A webhook is a 'reverse API': instead of a client polling 'did anything happen?', the provider calls the client's URL with an HTTP POST when an event occurs, like `payment.succeeded` or `interview.completed`.",
        "Because anyone on the internet can POST to a URL, webhooks are **signed**: the sender computes an HMAC of the body with a shared secret, and the receiver recomputes it to prove the message is genuine and unchanged.",
      ],
      deeper: [
        "**Receiver rules:** (1) verify the signature on the **raw** body before parsing. (2) Check the timestamp is recent (for example 5 minutes) to block replays. (3) Respond 2xx fast and do the real work in a queue. (4) Expect duplicates and out-of-order delivery: store processed event ids and make handlers idempotent; for state, fetch the latest from the provider's API or compare versions instead of trusting arrival order.",
        "**Sender rules:** include an event id, type, timestamp, and API version; sign with a per-endpoint secret; retry non-2xx responses with exponential backoff over hours or days; disable endpoints that fail for too long and alert the owner; offer a dashboard or API to replay events; and support secret rotation by sending two signatures during the switch.",
        "Compare signatures with a constant-time function (`crypto.timingSafeEqual`), not `===`, to avoid timing attacks.",
        "On your resume: in Octagnt's bulk pipeline, the extraction service calls back to your API when a file is done, and a background monitor catches callbacks that never arrive (see the Projects stack, 'SQS pipeline for bulk uploads of 50+ files'). The Stripe webhook handler in the Projects stack ('Stripe subscriptions, webhooks, and plan-based limits') shows signature verification and idempotency, but its note says it came from your study brief, so only claim it if you built it.",
      ],
      why: "Polling an external service for changes is slow and wasteful. Webhooks deliver events in near real time, but they come over the public internet with at-least-once delivery, so security and idempotency are mandatory.",
      analogy: "A courier delivering sealed letters. The wax seal (signature) proves who sent it and that nobody opened it. The postmark (timestamp) stops someone resending an old letter. If you weren't home, the courier tries again later, so you might get the same letter twice; you check the letter number before acting on it.",
      code: {
        lang: 'js',
        title: 'Signing and verifying with HMAC-SHA256 and a timestamp (runs in Node)',
        source: `import { createHmac, timingSafeEqual } from 'node:crypto';

const SECRET = 'whsec_test_123'; // shared once with the receiver, kept in env vars

// Sender: sign "timestamp.body" so a captured request can't be replayed later
function sign(rawBody, timestamp) {
  const sig = createHmac('sha256', SECRET).update(\`\${timestamp}.\${rawBody}\`).digest('hex');
  return \`t=\${timestamp},v1=\${sig}\`;
}

// Receiver: recompute and compare in constant time, and reject old timestamps
function verify(rawBody, header, nowSec, toleranceSec = 300) {
  const parts = Object.fromEntries(header.split(',').map((p) => p.split('=')));
  const t = Number(parts.t);
  if (Math.abs(nowSec - t) > toleranceSec) return 'rejected: too old';
  const expected = createHmac('sha256', SECRET).update(\`\${t}.\${rawBody}\`).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(parts.v1 ?? '');
  return a.length === b.length && timingSafeEqual(a, b) ? 'valid' : 'rejected: bad signature';
}

const body = JSON.stringify({ id: 'evt_1', type: 'interview.completed', data: { interviewId: 'int_9' } });
const now = 1760000000;
const header = sign(body, now);

console.log(verify(body, header, now + 10));
console.log(verify(body.replace('int_9', 'int_8'), header, now + 10));
console.log(verify(body, header, now + 3600));

// Express receiver: app.post('/webhooks/x', express.raw({ type: 'application/json' }), handler)
// -> verify(req.body.toString(), req.get('X-Signature'), nowSec)
// -> if already processed event.id: return 200; else enqueue job, save event.id, return 200`,
      },
      output: "Prints `valid` for the untouched body, `rejected: bad signature` when one character of the body changes, and `rejected: too old` when the same signed request is replayed an hour later.",
      questions: [
        { q: 'How do you secure a webhook endpoint?', a: 'Verify an HMAC signature computed over the raw body with a shared secret, compare in constant time, reject old timestamps to block replays, use HTTPS, and keep the secret in a secrets manager.' },
        { q: 'Why must webhook handlers be idempotent?', a: 'Providers deliver at least once and retry on timeouts or errors, so the same event can arrive several times. Store processed event ids and skip duplicates.' },
        { q: 'Why respond quickly and process later?', a: 'Providers time out after a few seconds and retry, which causes duplicates. Acknowledge with 2xx after verifying and saving the event, then process it from a queue.' },
        { q: 'How should a webhook sender handle failures?', a: 'Retry non-2xx responses with exponential backoff over a long window, log every attempt, let customers replay events, and disable and alert on endpoints that keep failing.' },
        { q: 'What about events arriving out of order?', a: 'Don\'t assume order. Use timestamps or version numbers to ignore older updates, or fetch the current state from the provider\'s API when an event arrives.' },
      ],
      answer30: "A webhook is the provider POSTing to my URL when an event happens. On the receiving side I verify the HMAC signature over the raw body with a constant-time compare, reject stale timestamps, store the event id to ignore duplicates, return 2xx quickly, and do the work in a queue, since delivery is at-least-once and can be out of order. When sending webhooks I sign each payload, include an event id and timestamp, retry with exponential backoff, and let customers replay events.",
      mistakes: [
        "Parsing JSON before verification; re-serialized JSON won't match the signature.",
        "Comparing signatures with `===`.",
        "Doing slow work before responding, causing timeouts and duplicate deliveries.",
        "Trusting the event payload for critical state like payment status without verifying, or without fetching the latest object.",
        "Trap: 'Is checking the sender's IP address enough?' No. IPs change and can sit behind shared infrastructure; signatures are the real proof. IP allowlists are an extra layer at most.",
      ],
      takeaway: 'Verify the HMAC on the raw body, reject stale timestamps, dedupe by event id, ack fast, process async.',
    },

    {
      id: 'cors',
      title: 'CORS (Cross-Origin Resource Sharing)',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Browsers block JavaScript from reading cross-origin responses unless the server sends Access-Control-Allow-* headers; non-simple requests get an OPTIONS preflight first.',
      what: [
        "An **origin** is scheme + host + port: `https://app.example.com` and `https://api.example.com` are different origins. By default the browser's **same-origin policy** stops JavaScript on one origin from reading responses from another.",
        "**CORS** is how a server says 'I allow this other origin to read my responses', using headers like `Access-Control-Allow-Origin`. It's enforced by the **browser**, not the server.",
      ],
      deeper: [
        "**Simple requests** (GET/HEAD/POST with basic headers and form-like content types) are sent directly; the browser then checks the response headers. Anything else, such as `PUT`, `DELETE`, `Content-Type: application/json`, or an `Authorization` header, triggers a **preflight**: an `OPTIONS` request asking which methods and headers are allowed. `Access-Control-Max-Age` lets the browser cache the preflight answer.",
        "Cookies cross origins only with `credentials: 'include'` on the client and `Access-Control-Allow-Credentials: true` on the server, and then `Access-Control-Allow-Origin` must be the exact origin, not `*`. Add `Vary: Origin` when you echo the origin so caches don't mix responses.",
        "CORS is not an auth or security wall for your API: curl, Postman, and servers ignore it. It protects users' browsers from malicious sites reading data with their cookies. You still need auth, and CSRF protection for cookie-based APIs.",
        "On your resume: in the public upload API, the candidate's browser PUTs video straight to S3 with a presigned URL (see the Projects stack, 'Public token-based API for direct-to-S3 video uploads'). That cross-origin PUT only works if the S3 bucket's CORS configuration allows your app's origin, the PUT method, and the Content-Type header.",
      ],
      why: "Almost every SPA or Next.js app talks to an API on a different subdomain or port, so CORS errors are one of the most common things a full-stack engineer debugs.",
      analogy: "A guest list at a private party. The bouncer (browser) checks whether the host (server) put your name (origin) on the list before letting you in. Someone climbing over the back wall (curl) never meets the bouncer, so the guest list isn't the house's only security.",
      code: [
        {
          lang: 'js',
          title: 'Express: allow a specific frontend origin with cookies',
          source: `import cors from 'cors';

const allowed = ['https://app.example.com', 'http://localhost:3000'];

app.use(cors({
  origin(origin, cb) {
    // no Origin header = same-origin or a non-browser client like curl
    if (!origin || allowed.includes(origin)) return cb(null, true);
    cb(new Error('Origin not allowed'));
  },
  credentials: true,                      // Access-Control-Allow-Credentials: true
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key'],
  maxAge: 600,                            // cache preflight for 10 minutes
}));`,
        },
        {
          lang: 'json',
          title: 'S3 bucket CORS rule for browser uploads via presigned URLs',
          source: `[
  {
    "AllowedOrigins": ["https://app.example.com"],
    "AllowedMethods": ["PUT"],
    "AllowedHeaders": ["Content-Type"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]`,
        },
      ],
      output: "A `fetch` with JSON from app.example.com first sends an OPTIONS preflight; the API answers with the allowed origin, methods, and headers, and the real request proceeds with cookies. A request from evil.example gets no CORS headers, so the browser blocks the page from reading the response. The S3 rule lets the browser PUT a video directly to the bucket.",
      questions: [
        { q: 'What is CORS?', a: 'A browser mechanism that lets a server allow specific other origins to read its responses, using Access-Control-Allow-* headers. Without them, the same-origin policy blocks JavaScript from reading cross-origin responses.' },
        { q: 'What triggers a preflight request?', a: 'Any non-simple request: methods other than GET, HEAD, or POST, custom headers like Authorization, or a Content-Type like application/json. The browser sends OPTIONS first to ask permission.' },
        { q: 'Why can\'t you use `*` with credentials?', a: 'The spec forbids it: with cookies, the server must echo the exact allowed origin, so a wildcard can\'t accidentally expose logged-in users\' data to every site.' },
        { q: 'Does CORS protect your API from attackers?', a: 'No. It\'s enforced only by browsers. Scripts, servers, and curl ignore it, so you still need authentication, authorization, and CSRF protection.' },
        { q: 'A request works in Postman but fails in the browser. Why?', a: 'Probably CORS: Postman doesn\'t enforce it, while the browser blocks the response or the preflight fails because the server doesn\'t return the right Access-Control headers.' },
      ],
      answer30: "CORS is how a server tells the browser which other origins may read its responses. Simple requests go straight through and the browser checks the headers; anything with JSON, custom headers, or methods like PUT triggers an OPTIONS preflight first. For cookie-based auth, the server must return the exact origin plus Allow-Credentials, never a wildcard. It's enforced only by browsers, so it's not a replacement for auth. A real example: direct browser uploads to S3 with presigned URLs need a CORS rule on the bucket.",
      mistakes: [
        "Setting `Access-Control-Allow-Origin: *` with credentials. Browsers reject it.",
        "Reflecting any incoming Origin with credentials enabled, which lets every site read users' data.",
        "Fixing a CORS error in the frontend code. It's fixed by the server's response headers (or a same-origin proxy).",
        "Forgetting to handle `OPTIONS`, so preflights fail with 404 or 401.",
        "Trap: 'Is a CORS error a server error?' The server may have processed the request fine; the browser simply refused to let your JavaScript read the response. That matters for non-idempotent requests.",
      ],
      takeaway: 'CORS = browser-enforced permission headers; preflight for non-simple requests; exact origin with credentials; not a security wall.',
    },

    {
      id: 'openapi-documentation',
      title: 'API documentation with OpenAPI',
      level: 'basic',
      priority: 'good',
      frequency: 'common',
      summary: 'OpenAPI is a standard YAML/JSON description of your HTTP API that drives docs, client SDKs, mocks, validation, and contract tests.',
      what: [
        "OpenAPI (formerly Swagger) is a standard file that describes every endpoint: paths, methods, parameters, request bodies, responses, error shapes, and auth. Tools turn that one file into interactive docs (Swagger UI, Redoc, Scalar), client SDKs, and mock servers.",
        "Swagger is the older name and now refers to the tooling; the specification itself is called OpenAPI.",
      ],
      deeper: [
        "Two approaches: **design-first** (write the spec, review it with frontend and partner teams, then implement) or **code-first** (generate the spec from code annotations or schemas, for example from Zod or NestJS decorators). Design-first catches API design problems before code exists; code-first keeps docs in sync automatically.",
        "OpenAPI 3.1 aligned its schemas with JSON Schema; 3.2 was released in 2025. Shared pieces (like the error format or pagination) go under `components` and are reused with `$ref`.",
        "Make the spec useful beyond docs: validate requests against it with middleware, run contract tests in CI so the implementation can't drift, lint it (for example with Spectral) for naming rules, and generate typed TypeScript clients so the frontend gets compile errors when the API changes.",
        "Good docs also include auth instructions, examples for every endpoint, error codes, rate limits, and a changelog. For GraphQL the schema itself is the contract; for gRPC it's the .proto file; for events, AsyncAPI plays the same role.",
      ],
      why: "An API is only as usable as its documentation. A machine-readable contract stops docs going stale and lets frontend and backend work in parallel against an agreed shape.",
      analogy: "An architect's blueprint. Builders, electricians, and inspectors all work from the same drawing, and you can check the finished building against it.",
      code: {
        lang: 'yaml',
        title: 'A small OpenAPI 3.1 document',
        source: `openapi: 3.1.0
info:
  title: Jobs API
  version: 1.0.0
servers:
  - url: https://api.example.com/v1
paths:
  /jobs/{id}:
    get:
      summary: Get a job
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string }
      responses:
        '200':
          description: The job
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Job' }
        '404':
          description: Not found
          content:
            application/problem+json:
              schema: { $ref: '#/components/schemas/Problem' }
components:
  securitySchemes:
    bearerAuth: { type: http, scheme: bearer, bearerFormat: JWT }
  schemas:
    Job:
      type: object
      required: [id, title, status]
      properties:
        id: { type: string }
        title: { type: string }
        status: { type: string, enum: [draft, open, closed] }
    Problem:
      type: object
      properties:
        type: { type: string }
        title: { type: string }
        status: { type: integer }
        code: { type: string }`,
      },
      output: "Loading this file into Swagger UI or Redoc shows an interactive page for `GET /jobs/{id}` with a 'Try it out' button, the bearer auth requirement, and example 200 and 404 responses. A generator can produce a typed `getJob(id)` client from it.",
      questions: [
        { q: 'What is OpenAPI?', a: 'A standard, machine-readable description of an HTTP API (paths, parameters, schemas, responses, auth) in YAML or JSON, used to generate docs, clients, mocks, and tests.' },
        { q: 'Swagger vs OpenAPI?', a: 'OpenAPI is the specification; Swagger was its original name and is now the brand of tools around it, like Swagger UI and Swagger Editor.' },
        { q: 'Design-first vs code-first?', a: 'Design-first writes and reviews the spec before coding, catching design issues early and letting teams work in parallel. Code-first generates the spec from the code, keeping it in sync automatically.' },
        { q: 'How do you stop documentation drifting from the implementation?', a: 'Generate the spec from code or validate requests and responses against it in middleware and contract tests in CI, so any mismatch fails the build.' },
      ],
      answer30: "OpenAPI is the standard machine-readable contract for an HTTP API: paths, parameters, request and response schemas, errors, and auth in YAML or JSON. From it we get interactive docs, typed client SDKs, mock servers, and request validation. I prefer reviewing the spec before building new public endpoints, then keeping it honest with contract tests in CI, and reusing shared components like the error format and pagination.",
      mistakes: [
        "Docs written by hand in a wiki that drift from reality.",
        "Documenting only success responses, not errors and auth.",
        "No examples, so client developers guess payloads.",
        "Trap: 'Is the Swagger UI page the API documentation?' It's a view of the spec. Good docs also explain auth setup, rate limits, error codes, and versioning policy.",
      ],
      takeaway: 'One OpenAPI contract drives docs, clients, mocks, and tests; keep it in CI so it never drifts.',
    },

    {
      id: 'http-caching',
      title: 'HTTP caching: Cache-Control and ETag',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Cache-Control says who may cache a response and for how long; ETag lets clients revalidate cheaply and get a 304 when nothing changed.',
      what: [
        "HTTP caching lets browsers, CDNs, and proxies reuse a response instead of asking the server again. The server controls it with response headers.",
        "`Cache-Control: max-age=3600` means 'reuse this for an hour without asking'. An **ETag** is a fingerprint of the response; the client later asks 'still `\"abc\"`?' with `If-None-Match`, and the server answers **304 Not Modified** with no body if it hasn't changed.",
      ],
      deeper: [
        "Key directives: `public` (any cache, including CDNs), `private` (only the user's browser; use for personalized data), `no-cache` (may store, but must revalidate before every use), `no-store` (never store; for sensitive data), `max-age` (browser lifetime), `s-maxage` (shared cache/CDN lifetime), `stale-while-revalidate` (serve stale while refreshing in the background), and `immutable` (for fingerprinted assets like `app.3f9a.js`).",
        "Validators: `ETag` + `If-None-Match` (preferred), or `Last-Modified` + `If-Modified-Since` (second precision). A 304 still costs a round trip but saves bandwidth and serialization.",
        "ETags also prevent **lost updates**: the client sends `If-Match: \"abc\"` with a PUT, and the server returns **412 Precondition Failed** if someone else changed the resource in between. That's optimistic concurrency over HTTP.",
        "`Vary` tells caches which request headers change the response (like `Accept-Encoding` or `Origin`). Authenticated API responses are usually `private, no-cache` or `no-store`; public, rarely changing data can use CDN caching with `s-maxage` and purge on change.",
      ],
      why: "The fastest request is the one never sent. Correct caching cuts latency and server load; wrong caching serves stale or, worse, one user's private data to another.",
      analogy: "Milk in the fridge with a best-before date (max-age): you drink it without asking until the date passes. After that you check the dairy's batch number (ETag); if it's the same batch, you keep what you have (304) instead of buying new milk.",
      code: {
        lang: 'js',
        title: 'ETag revalidation (runs in Node)',
        source: `import { createHash } from 'node:crypto';

const job = { id: 'j1', title: 'Node Engineer', updatedAt: '2026-10-01T10:00:00Z' };

function handleGet(resource, ifNoneMatch) {
  const body = JSON.stringify(resource);
  const etag = '"' + createHash('sha1').update(body).digest('base64url').slice(0, 16) + '"';
  if (ifNoneMatch === etag) return { status: 304, headers: { ETag: etag }, body: '' }; // nothing to resend
  return { status: 200, headers: { ETag: etag, 'Cache-Control': 'private, no-cache' }, body };
}

const first = handleGet(job);
console.log(first.status, first.body.length, 'bytes');
const second = handleGet(job, first.headers.ETag);   // browser revalidates with If-None-Match
console.log(second.status, second.body.length, 'bytes');
job.title = 'Senior Node Engineer';                   // resource changed
const third = handleGet(job, first.headers.ETag);
console.log(third.status, third.headers.ETag !== first.headers.ETag);

// Express does this for you: res.json() sets a weak ETag and answers 304 automatically.`,
      },
      output: "Prints `200 70 bytes`, then `304 0 bytes` because the fingerprint matches, then `200 true` after the title changes: a new ETag and the full body.",
      questions: [
        { q: 'no-cache vs no-store?', a: '`no-cache` allows storing but requires revalidation with the server before each use. `no-store` forbids storing at all, for sensitive data.' },
        { q: 'What is an ETag?', a: 'A version identifier for a response. The client sends it back in If-None-Match, and the server returns 304 Not Modified with no body if the resource hasn\'t changed.' },
        { q: 'public vs private in Cache-Control?', a: '`public` lets shared caches like CDNs store the response. `private` restricts it to the user\'s own browser, which you need for personalized or authenticated data.' },
        { q: 'How do ETags help with concurrent updates?', a: 'The client sends If-Match with the ETag it last saw. If the resource changed since, the server returns 412 Precondition Failed instead of overwriting someone else\'s change.' },
        { q: 'How do you cache static assets forever but still deploy updates?', a: 'Put a content hash in the filename and serve with `max-age=31536000, immutable`. A new build produces new filenames, so HTML points to the new files.' },
      ],
      answer30: "Cache-Control decides who can cache a response and for how long: public or private, max-age for browsers, s-maxage for CDNs, no-cache to always revalidate, no-store for sensitive data. ETags let clients revalidate: they send If-None-Match and get a 304 with no body if nothing changed. The same ETag with If-Match gives optimistic concurrency, returning 412 if someone else updated the resource. Static assets get hashed filenames and long immutable caching; authenticated API data stays private.",
      mistakes: [
        "Caching authenticated responses as `public` on a CDN, leaking one user's data to others.",
        "Using `no-cache` when you meant `no-store` for sensitive data.",
        "Long `max-age` on files without hashed names, so users keep old JavaScript after a deploy.",
        "Trap: 'Does a 304 mean no request was made?' No, the browser still made a request to revalidate; only the body was skipped. A fresh `max-age` hit makes no request at all.",
      ],
      takeaway: 'Cache-Control sets who and how long; ETag + If-None-Match gives cheap 304s; If-Match prevents lost updates.',
    },

    {
      id: 'http-versions',
      title: 'HTTP/1.1 vs HTTP/2 vs HTTP/3',
      level: 'intermediate',
      priority: 'good',
      frequency: 'occasional',
      summary: 'HTTP/1.1 sends one request at a time per connection, HTTP/2 multiplexes many over one TCP connection, and HTTP/3 runs over QUIC on UDP to avoid TCP head-of-line blocking.',
      what: [
        "**HTTP/1.1** (1997) is text-based. Each connection handles one request at a time, so browsers open about 6 connections per domain to load pages faster.",
        "**HTTP/2** (2015) is binary and **multiplexes** many requests as streams over a single connection, compresses headers (HPACK), and supports priorities. **HTTP/3** (2022) keeps the same ideas but runs over **QUIC**, a transport built on UDP, instead of TCP.",
      ],
      deeper: [
        "Head-of-line blocking: in HTTP/1.1 a slow response blocks the next one on that connection. HTTP/2 fixes this at the HTTP layer, but all streams share one TCP connection, so one lost packet stalls every stream until it's retransmitted (TCP head-of-line blocking). QUIC handles loss per stream, so HTTP/3 doesn't have that problem.",
        "QUIC also combines the transport and TLS 1.3 handshakes (fewer round trips, and 0-RTT resumption for repeat visits) and supports **connection migration**: switching from Wi-Fi to mobile data doesn't drop the connection, because it's identified by a connection id, not the IP and port.",
        "HTTP/2 server push existed but was rarely useful and browsers like Chrome removed support; `103 Early Hints` is the modern alternative. Old HTTP/1.1 tricks like domain sharding and bundling everything into one file matter less with HTTP/2+.",
        "In practice, CDNs and load balancers (CloudFront, Cloudflare, AWS ALB for HTTP/2) terminate HTTP/2 or HTTP/3 for clients and often talk HTTP/1.1 to your Node servers behind them. gRPC requires HTTP/2.",
      ],
      why: "Protocol choice affects page load, mobile performance, and what's possible (gRPC, streaming). Interviewers ask it to check you understand what happens below fetch().",
      analogy: "HTTP/1.1 is a single-lane road per car: you open a few roads to move more cars. HTTP/2 is one multi-lane highway, but if one lane has an accident, the whole highway stops (TCP). HTTP/3 gives each lane its own road surface, so an accident in one lane doesn't stop the others.",
      code: {
        lang: 'bash',
        title: 'Checking which protocol a site uses',
        source: `# Negotiated protocol for a request (curl built with HTTP/2 and HTTP/3 support)
curl -sI --http2 https://www.cloudflare.com -o /dev/null -w '%{http_version}\\n'   # 2
curl -sI --http3 https://www.cloudflare.com -o /dev/null -w '%{http_version}\\n'   # 3 (if your curl supports it)

# Servers advertise HTTP/3 with the Alt-Svc response header
curl -sI https://www.cloudflare.com | grep -i alt-svc
# alt-svc: h3=":443"; ma=86400

# In the browser: DevTools > Network > right-click the column header > enable "Protocol" (h2, h3)`,
      },
      output: "The first command prints `2`, and the second prints `3` when your curl has HTTP/3 support. The `alt-svc` header tells browsers they can switch to HTTP/3 on port 443 for the next requests. Exact results depend on the site and your curl build.",
      questions: [
        { q: 'What did HTTP/2 improve over HTTP/1.1?', a: 'Multiplexing many requests over one connection, binary framing, header compression with HPACK, and stream prioritization, removing the need for many parallel connections.' },
        { q: 'What problem does HTTP/3 solve that HTTP/2 doesn\'t?', a: 'TCP head-of-line blocking: in HTTP/2, one lost packet stalls all streams on the connection. HTTP/3 uses QUIC over UDP, which handles loss per stream.' },
        { q: 'What is QUIC?', a: 'A transport protocol over UDP with built-in TLS 1.3, independent streams, faster handshakes, and connection migration across networks. HTTP/3 runs on it.' },
        { q: 'Do you need to change your Node API for HTTP/2 or HTTP/3?', a: 'Usually not. A CDN or load balancer terminates HTTP/2 or HTTP/3 with clients and forwards to Node over HTTP/1.1. You only enable HTTP/2 in Node for things like gRPC.' },
      ],
      answer30: "HTTP/1.1 handles one request at a time per connection, so browsers open several connections. HTTP/2 multiplexes many streams over one TCP connection with binary framing and header compression, but a lost packet still stalls every stream because of TCP. HTTP/3 runs over QUIC on UDP, so loss only affects one stream, handshakes are faster with built-in TLS 1.3, and connections survive network switches. In practice the CDN or load balancer speaks HTTP/2 or 3 to clients while Node behind it often uses HTTP/1.1.",
      mistakes: [
        "Saying HTTP/2 completely solved head-of-line blocking. It solved it at the HTTP layer, not the TCP layer.",
        "Keeping domain sharding with HTTP/2, which defeats the single multiplexed connection.",
        "Recommending server push as a modern optimization.",
        "Trap: 'Is HTTP/3 always faster?' It helps most on lossy or mobile networks. On a clean wired connection the difference can be small, and some networks block UDP, so browsers fall back to HTTP/2.",
      ],
      takeaway: '1.1 = one at a time; 2 = multiplexed over TCP; 3 = multiplexed over QUIC/UDP, no TCP head-of-line blocking.',
    },
  ],

  rapidFire: [
    { q: 'Should REST URLs contain verbs?', a: 'No. Use nouns for resources and HTTP methods as verbs.' },
    { q: 'Which HTTP methods are idempotent?', a: 'GET, HEAD, OPTIONS, PUT, and DELETE. POST is not; PATCH isn\'t guaranteed.' },
    { q: 'Safe vs idempotent?', a: 'Safe = no state change; idempotent = repeating leaves the same state.' },
    { q: 'PUT vs PATCH?', a: 'PUT replaces the whole resource; PATCH changes part of it.' },
    { q: '401 vs 403?', a: '401 = not authenticated; 403 = authenticated but not allowed.' },
    { q: 'Status for an accepted async job?', a: '202 Accepted, with a status URL or job id.' },
    { q: 'Status for a successful create?', a: '201 Created with a Location header.' },
    { q: 'Status for rate limited?', a: '429 Too Many Requests with Retry-After.' },
    { q: 'Offset vs cursor pagination in one line?', a: 'Offset can jump pages but slows and shifts on big data; cursor is fast and stable.' },
    { q: 'Standard JSON error format?', a: 'RFC 9457 Problem Details (`application/problem+json`).' },
    { q: 'Is a JWT encrypted?', a: 'No, a standard JWT is signed, not encrypted; anyone can read the payload.' },
    { q: 'OAuth 2.0 vs OIDC?', a: 'OAuth = delegated authorization (access token); OIDC adds login identity (ID token).' },
    { q: 'Recommended OAuth flow for web and mobile apps?', a: 'Authorization Code with PKCE.' },
    { q: 'OAuth flow for machine-to-machine?', a: 'Client Credentials.' },
    { q: 'How do you store API keys?', a: 'Hashed, scoped, revocable, shown to the user only once.' },
    { q: 'What makes a POST safe to retry?', a: 'An Idempotency-Key header with the stored response replayed for repeats.' },
    { q: 'Most common rate limiting algorithm?', a: 'Token bucket, with counters in Redis.' },
    { q: 'What is the N+1 problem?', a: 'One query for a list plus one query per item for related data.' },
    { q: 'What fixes N+1 in GraphQL?', a: 'DataLoader: batch keys per tick and cache per request.' },
    { q: 'gRPC uses which format and transport?', a: 'Protocol Buffers over HTTP/2.' },
    { q: 'SSE vs WebSocket direction?', a: 'SSE is server to client only; WebSockets are two-way.' },
    { q: 'How do you verify a webhook?', a: 'HMAC of the raw body with a shared secret, constant-time compare, and a timestamp check.' },
    { q: 'Who enforces CORS?', a: 'The browser. curl and servers ignore it.' },
    { q: 'no-cache vs no-store?', a: 'no-cache = store but revalidate; no-store = never store.' },
    { q: 'What does HTTP/3 run on?', a: 'QUIC over UDP.' },
  ],
};

export default api;
