// My Resume and Projects.
// Grounded in the uploaded resumes (Octagnt.ai Feb 2026 - present, Skillkeepr Jun 2023 - Feb 2026).
// Anything from the study-guide brief that is NOT on the resume is marked with a `note`.
// Rule for every answer here: only say what you really did. Change numbers and details to match reality.

const projects = {
  name: 'My Resume and Projects',
  intro:
    'Sample first-person answers about your own work. Read them, then rewrite them in your own words. Interviewers dig into what is on your resume, so every claim here should be something you can explain for five minutes.',
  topics: [
    // ------------------------------------------------------------------ 1
    {
      id: 'walk-me-through-projects',
      title: 'Walk me through your projects',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'A 60-second story of your two products, Octagnt.ai and Skillkeepr, told as one career arc.',
      what: [
        "This is the most common opening question after 'tell me about yourself'. The interviewer wants a short map of your work so they can choose what to dig into.",
        "You have one company (Haspaces Technology Solutions) and two products. Skillkeepr (June 2023 to February 2026) is an HR and recruitment SaaS. Octagnt.ai (February 2026 onward) is an agentic AI platform that shortlists candidates. The story is: on Skillkeepr I learned to build reliable backend services; on Octagnt I designed bigger pieces myself.",
      ],
      deeper: [
        "Give each project three things: what the product does for the customer, your role, and one or two things you owned. Then stop and let them choose. A short map plus 'happy to go deeper on any of these' is better than a five-minute monologue.",
        "Pick hooks you are ready to defend. Good hooks from your resume: multi-tenant isolation, the SQS bulk-upload pipeline, the orchestrator for 35+ AI agents, the audit logging service, and the TypeScript migration.",
      ],
      why: "It sets the agenda for the rest of the interview. If you name topics you know well, the interviewer will usually follow you there. If you are vague, they pick topics for you.",
      analogy: "It's like the table of contents of a book. Nobody reads the whole book in the first minute, but a good table of contents makes them want to open certain chapters.",
      code: {
        lang: 'text',
        title: 'Your story on one card',
        source: `Company: Haspaces Technology Solutions (3+ years, Trivandrum)

Skillkeepr (Jun 2023 - Feb 2026) -- HR and recruitment SaaS
  - Audit and usage logging service (non-blocking, redacts sensitive data)
  - Led the TypeScript migration
  - Configurable multi-level interview workflows
  - Jest coverage -> about 30% fewer regression bugs
  - Node.js v18 -> v20 upgrade, LaunchDarkly feature flags

Octagnt.ai (Feb 2026 - present) -- agentic AI candidate shortlisting
  - Multi-tenant REST APIs (Node, Express, TypeScript, MongoDB)
  - Cookie JWT auth with auto-renewal, RBAC: 4 roles x 8 modules
  - Orchestrator over 35+ AI agents behind one gateway
  - SQS + S3 pipeline for bulk uploads of 50+ files
  - Public token-based upload API for candidate videos`,
      },
      output: "When you say this out loud, it takes about 60 seconds. The interviewer now knows your stack (Node, TypeScript, MongoDB, AWS, React), your level (you own designs), and five topics they can ask about. Each of those topics has its own page in this stack.",
      questions: [
        {
          q: "Which project are you most proud of, and why?",
          a: "Pick one and give a concrete reason. Example: 'The SQS bulk-upload pipeline on Octagnt. Before it, a big upload kept the HTTP request open and timed out. I moved the slow work to a queue, added status polling, and handled partial failures. Users could upload 50+ files and see progress instead of errors.'",
        },
        {
          q: "What was your exact role? Were you leading or contributing?",
          a: "Be honest and specific. Example: 'On Octagnt I led the low-level design of schemas and API contracts for the features I owned and built them end to end. On Skillkeepr I led the TypeScript migration and owned the audit logging service. Other features I built inside a team.'",
        },
        {
          q: "Your title says Full Stack, but your work looks backend-heavy. Which are you?",
          a: "'Backend-focused full stack. Most of my time is in Node, TypeScript, MongoDB, and AWS. I also wire those APIs into the React frontend and fix state and rendering bugs, so I can ship a feature end to end.'",
        },
        {
          q: "How big was the team?",
          a: "Answer with the real number and how work was split. If you don't know exact numbers, say 'a small team of around N engineers'. Never inflate it.",
        },
      ],
      answer30:
        "I've spent 3+ years at Haspaces Technology Solutions on two products. On Skillkeepr, an HR and recruitment SaaS, I built a non-blocking audit logging service, led our TypeScript migration, and added Jest coverage that cut regression bugs by about 30%. Now on Octagnt.ai, an agentic AI platform for shortlisting candidates, I design multi-tenant APIs in Node and TypeScript, built cookie-based JWT auth with RBAC, an orchestrator over 35+ AI agents, and an SQS pipeline for bulk uploads. Happy to go deeper on any of these.",
      mistakes: [
        "Talking for five minutes without stopping. Stop after 60 to 90 seconds and offer to go deeper.",
        "Saying 'we' for everything. Say 'I' for the parts you did, so they can see your contribution.",
        "Naming a technology you can't explain. If it's in your story, expect a follow-up on it.",
        "Your three resume versions word things differently (for example 'AI agents' vs 'specialized services'). Use the wording of the resume you sent to that company.",
      ],
      takeaway: 'Give a short map, name topics you can defend, then let the interviewer choose.',
    },

    // ------------------------------------------------------------------ 2
    {
      id: 'octagnt-architecture',
      title: 'Octagnt.ai: 60-second explanation and architecture',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'An agentic AI platform for shortlisting candidates, built as multi-tenant Node/TypeScript APIs, an agent orchestrator, and async AWS pipelines.',
      note:
        "Check the architecture below against what you really built and fix anything that's different. It's a sensible reconstruction from your resume, not a copy of your company's design.",
      what: [
        "Octagnt.ai helps companies shortlist job candidates using AI. A recruiter creates a job, candidates come in (uploaded in bulk, or synced from an ATS, which is an applicant tracking system), and AI agents assess them through steps like assessments, voice screening, and one-sided video interviews. A scoring engine then decides who qualifies.",
        "Many client companies (tenants) use the same system, so every piece of data belongs to one tenant and must never leak to another.",
      ],
      deeper: [
        "Architecture in plain words. (1) A React frontend has candidate and recruiter dashboards. (2) The core API is Node.js + Express + TypeScript on MongoDB. Every request carries a tenant, and every query is filtered by it. (3) Auth uses JWTs in cookies with automatic renewal, and RBAC with 4 roles and 8 permission modules. (4) An orchestrator runs configurable multi-step pipelines across 35+ specialized AI agents. All agents sit behind one gateway that routes by path, so callers have one stable entry point. (5) Slow work, like processing 50+ uploaded files, goes through AWS SQS queues. Files live in S3. Workers process them in the background and the UI polls for status. (6) A public token-scoped API lets external candidates upload interview videos straight to S3.",
        "Local development uses Docker Compose with LocalStack, which fakes S3 and SQS on your laptop. Tests use Jest and Supertest with mocked repositories.",
      ],
      why: "Recruiters waste hours reading CVs and running first-round screens. The platform automates the repetitive first steps so recruiters spend their time on the best candidates. The engineering challenge is doing that safely for many companies at once, and keeping slow AI work from blocking the app.",
      analogy: "Think of a hiring agency with many client companies in one office. Each client has its own locked filing cabinet (tenant isolation). A front desk (the gateway) sends each task to the right specialist (an AI agent). Big jobs go into an inbox tray (the queue) so the front desk never stops to do them itself.",
      code: {
        lang: 'text',
        title: 'Request flow, simplified',
        source: `React dashboard
   |  cookie with JWT (auto-renewed)
   v
Express API (TypeScript)
   |  auth -> tenant context -> RBAC check -> controller -> service -> repository
   |                                                         |
   |                                                    MongoDB (every query has tenantId)
   |
   +--> Orchestrator --> Gateway (/agents/<name>/...) --> 35+ AI agents
   |
   +--> S3 (files) + SQS (jobs) --> background workers --> callback --> status updated
                                                                   ^
React polls  GET /uploads/:batchId/status  ------------------------+`,
      },
      output: "A recruiter clicks 'upload 50 CVs'. The API stores the files in S3, puts one job per file on SQS, and returns a batch id at once. Workers pick up jobs, call the extraction agent, and save results under that tenant. The dashboard polls the batch status and fills in candidates as they finish.",
      questions: [
        {
          q: "Why Node.js and MongoDB for this?",
          a: "'Most of the work is I/O: calling AI agents, S3, queues, and the database. Node handles lots of waiting work well with one thread. Candidate and assessment data has varied, nested shapes, so MongoDB documents fit well. And the whole team uses TypeScript front to back, which keeps types shared and hiring simple.'",
        },
        {
          q: "Why a queue instead of processing uploads in the request?",
          a: "'Processing 50 files with AI extraction can take minutes. HTTP requests time out, and if the server restarts, the work is lost. A queue gives retries, lets us scale workers separately from the API, and the user gets an instant response plus a progress view.'",
        },
        {
          q: "How would this scale to 100x more tenants?",
          a: "'The API is stateless, so add more instances behind a load balancer. Scale queue workers on queue depth. In MongoDB, make sure every hot query has an index that starts with tenantId, and later shard by tenantId if one cluster isn't enough. Large tenants could get dedicated workers so they don't slow down small ones (the noisy neighbour problem).'",
        },
        {
          q: "What would you improve?",
          a: "Choose real ones. Good options: 'Add distributed tracing across the orchestrator and agents so one candidate's journey is easy to debug. Add a dead-letter queue dashboard for failed jobs. Move from polling to server-sent events for upload status.'",
        },
      ],
      answer30:
        "Octagnt.ai is an agentic AI platform that helps companies shortlist candidates. The backend is multi-tenant Node, Express, and TypeScript on MongoDB, with tenant isolation on every query. Auth is cookie-based JWT with auto-renewal and RBAC across 4 roles. An orchestrator runs multi-step pipelines across 35+ AI agents behind one gateway, and slow work like bulk uploads goes through SQS and S3 with background workers, so the API stays fast. I own the low-level design for the features I build, plus tests with Jest and Supertest.",
      mistakes: [
        "Describing the product but not your part. Always add 'I designed...' or 'I built...'.",
        "Claiming you built all 35+ agents. Your resume says you designed the orchestrator and gateway that run them. Be exact.",
        "Not knowing basic numbers: how many tenants, requests, or files. Have rough, honest numbers ready, or say 'I don't have the exact figure, but roughly...'.",
        "Trap: 'Why not microservices for everything?' Answer that you split where there's a real reason (agents scale and deploy separately) and keep the core API simpler.",
      ],
      takeaway: 'Octagnt = multi-tenant APIs + agent orchestrator + async AWS pipelines, and you can say which part you built.',
    },

    // ------------------------------------------------------------------ 3
    {
      id: 'multi-tenant-isolation',
      title: 'Multi-tenant APIs and tenant isolation',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Many companies share one database, and every query is forced to include the tenant id so data never leaks.',
      what: [
        "Multi-tenant means one app and one database serve many customer companies. Each company is a tenant. Isolation means company A can never see company B's data.",
        "On Octagnt I built tenant-scoped REST APIs where isolation is enforced on every MongoDB query and every endpoint.",
      ],
      deeper: [
        "There are three common models: a shared database with a tenantId field on every document (cheapest, most common), a separate database per tenant, or a separate deployment per tenant (strongest isolation, most expensive).",
        "With a shared database, the danger is a developer forgetting `tenantId` in one query. So you don't rely on memory. The tenant comes from the verified JWT, never from the request body. Then a repository layer or Mongoose middleware adds the tenant filter automatically, and tests check that cross-tenant access returns 404.",
      ],
      why: "A data leak between customers in an HR product is a serious breach: candidate personal data, salaries, interview notes. It can lose every enterprise client at once. Isolation also lets you sell to large companies who ask about it in security reviews.",
      analogy: "An apartment building. Everyone shares the same building (database), but each flat has its own key. The building's door system (middleware) checks your key and only ever opens your own flat, even if you press another flat's number.",
      code: {
        lang: 'ts',
        title: 'Tenant comes from the token, and the repository always adds it',
        source: `// 1) Middleware: read tenant from the VERIFIED token, never from req.body
function tenantContext(req, res, next) {
  const tenantId = req.user?.tenantId; // set by the auth middleware after jwt.verify
  if (!tenantId) return res.status(401).json({ error: 'No tenant' });
  req.tenantId = tenantId;
  next();
}

// 2) Repository: every query is scoped. Controllers can't forget it.
class CandidateRepo {
  constructor(private tenantId: string) {}

  findById(id: string) {
    return Candidate.findOne({ _id: id, tenantId: this.tenantId }).lean();
  }

  list(filter: object = {}) {
    // tenantId is applied LAST, so a caller can't override it
    return Candidate.find({ ...filter, tenantId: this.tenantId }).lean();
  }
}

// 3) Route
app.get('/candidates/:id', auth, tenantContext, async (req, res) => {
  const repo = new CandidateRepo(req.tenantId);
  const candidate = await repo.findById(req.params.id);
  if (!candidate) return res.status(404).end(); // 404, not 403: don't reveal it exists
  res.json(candidate);
});`,
      },
      output: "A recruiter from company A asks for a candidate id that belongs to company B. The query looks for that id AND company A's tenantId, finds nothing, and returns 404. Company A never learns the record exists.",
      questions: [
        {
          q: "Shared database or database per tenant? Why?",
          a: "'Shared database with a tenantId on every document. It's cheaper, simpler to migrate, and easy to query across tenants for internal analytics. The risk is a missed filter, so I enforced it in one layer instead of in every controller. If a big client needed hard isolation for compliance, we could move just that tenant to its own database.'",
        },
        {
          q: "How do you make sure no developer forgets the tenant filter?",
          a: "'The tenant comes only from the verified token. Data access goes through repositories that add tenantId automatically. Indexes start with tenantId, so a query without it also shows up as slow. And we have tests that call endpoints with tenant A's token and tenant B's ids and expect 404.'",
        },
        {
          q: "Why return 404 instead of 403 for another tenant's record?",
          a: "'403 tells the attacker the record exists, which leaks information. 404 tells them nothing.'",
        },
        {
          q: "How do indexes work with multi-tenancy?",
          a: "'Compound indexes that start with tenantId, like { tenantId: 1, jobId: 1, createdAt: -1 }. Every query includes tenantId, so the index narrows to one tenant first. Without that, queries scan other tenants' data.'",
        },
        {
          q: "What about aggregation pipelines?",
          a: "'Mongoose query middleware doesn't cover everything the same way, so for aggregations the first stage is always { $match: { tenantId } }. I put that in a helper so it's never skipped.'",
        },
      ],
      answer30:
        "On Octagnt the APIs serve many enterprise clients from one MongoDB, so every document has a tenantId. The tenant comes only from the verified JWT, never from the request body. Data access goes through a repository layer that always adds the tenant filter, aggregations always start with a tenant match, and indexes start with tenantId. A request for another tenant's record returns 404, so nothing leaks, and we test that cross-tenant case directly.",
      mistakes: [
        "Taking tenantId from the request body or a query parameter. Anyone can change those. It must come from the verified token.",
        "Spreading the caller's filter after tenantId: `{ tenantId, ...filter }` lets `filter.tenantId` overwrite it. Put tenantId last.",
        "Forgetting background jobs. Queue workers have no HTTP request, so the job message must carry tenantId and the worker must use it.",
        "Trap: 'What about caches?' Cache keys must include the tenant, like `t:123:candidate:456`, or one tenant can read another's cached data.",
        "Trap: 'What about file storage?' S3 keys should be prefixed by tenant, and presigned URLs only generated after a tenant check.",
      ],
      takeaway: 'Tenant comes from the token, one layer adds it to every query, and you test the cross-tenant case.',
    },

    // ------------------------------------------------------------------ 4
    {
      id: 'jwt-cookie-auth-rbac',
      title: 'Cookie-based JWT auth with auto-renewal, and RBAC',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Short-lived access token plus a refresh token, both in httpOnly cookies, and a permission check per module for 4 roles.',
      what: [
        "Authentication answers 'who are you?'. Authorization answers 'what are you allowed to do?'.",
        "On Octagnt I built cookie-based JWT authentication with automatic token renewal, and RBAC (role-based access control) with 4 roles across 8 permission modules. I also built a Dropbox OAuth handshake so users could connect Dropbox to bring in documents.",
      ],
      deeper: [
        "A JWT is a signed token holding claims like userId, tenantId, and role. The server can verify the signature without a database lookup. The access token lives a short time (minutes). The refresh token lives longer (days) and is only used to get a new access token.",
        "Both sit in httpOnly cookies, so JavaScript in the page can't read them, which protects them from XSS. Because browsers send cookies automatically, you add SameSite and CSRF protection. When the access token expires, the API returns 401, the frontend calls /auth/refresh once, gets a new cookie, and retries the original request. Users never notice.",
        "RBAC is a table: role -> module -> allowed actions. A middleware checks it before the controller runs.",
      ],
      why: "Short access tokens limit damage if one is stolen. Refresh tokens keep users logged in without asking for passwords again. Cookies keep tokens away from page JavaScript. RBAC lets an HR admin, a recruiter, and a viewer see different things without writing if-statements all over the code.",
      analogy: "A hotel. The key card (access token) only works for one day. The front desk (refresh endpoint) gives you a new card if you show your booking (refresh token). Your card type decides which floors open: a guest card opens your floor, a staff card opens the service rooms (RBAC).",
      code: [
        {
          lang: 'ts',
          title: 'Server: set cookies and check permissions',
          source: `const cookieOpts = { httpOnly: true, secure: true, sameSite: 'lax' as const };

function issueTokens(res, user) {
  const claims = { sub: user.id, tenantId: user.tenantId, role: user.role };
  const access = jwt.sign(claims, ACCESS_SECRET, { expiresIn: '15m' });
  const refresh = jwt.sign({ sub: user.id }, REFRESH_SECRET, { expiresIn: '7d' });
  res.cookie('access', access, { ...cookieOpts, maxAge: 15 * 60 * 1000 });
  res.cookie('refresh', refresh, { ...cookieOpts, path: '/auth/refresh', maxAge: 7 * 864e5 });
}

// RBAC: role -> module -> actions
const PERMISSIONS = {
  admin:     { jobs: ['read', 'write', 'delete'], candidates: ['read', 'write', 'delete'] },
  recruiter: { jobs: ['read', 'write'],           candidates: ['read', 'write'] },
  viewer:    { jobs: ['read'],                    candidates: ['read'] },
};

const can = (module, action) => (req, res, next) =>
  PERMISSIONS[req.user.role]?.[module]?.includes(action)
    ? next()
    : res.status(403).json({ error: 'Not allowed' });

app.delete('/jobs/:id', auth, can('jobs', 'delete'), deleteJob);`,
        },
        {
          lang: 'js',
          title: 'Frontend: refresh once on 401, then retry',
          source: `let refreshing = null; // share ONE refresh call between parallel requests

async function api(url, options = {}) {
  const opts = { ...options, credentials: 'include' }; // send cookies
  let res = await fetch(url, opts);
  if (res.status !== 401) return res;

  refreshing ??= fetch('/auth/refresh', { method: 'POST', credentials: 'include' })
    .finally(() => { refreshing = null; });
  const r = await refreshing;
  if (!r.ok) { window.location.href = '/login'; return res; }

  return fetch(url, opts); // retry the original request once
}`,
        },
      ],
      output: "A recruiter works for 20 minutes. At minute 15 the access token expires. Their next request gets 401, the frontend calls /auth/refresh, gets a fresh cookie, and retries. The recruiter sees nothing. If they try to delete a job, `can('jobs', 'delete')` finds no 'delete' for recruiters and returns 403.",
      questions: [
        {
          q: "Why cookies instead of localStorage for tokens?",
          a: "'Any script on the page can read localStorage, so one XSS bug can steal the token. httpOnly cookies can't be read by JavaScript. The trade-off is CSRF, because browsers send cookies automatically, so we use SameSite cookies and CSRF protection on state-changing requests.'",
        },
        {
          q: "How does auto-renewal work, and what if 5 requests fail with 401 at once?",
          a: "'On 401 the client calls the refresh endpoint and retries. If five requests fail together, I don't want five refresh calls, so they all wait on one shared refresh promise, then retry.'",
        },
        {
          q: "How do you log a user out or revoke a token if JWTs are stateless?",
          a: "'Access tokens are short, so they die soon anyway. Refresh tokens are the real control: store them (or a token version on the user) server-side, and on logout or password change, delete or bump it. Then the next refresh fails.' Adjust this to what you actually did.",
        },
        {
          q: "Why 4 roles and 8 modules instead of per-user permissions?",
          a: "'Roles are easy to reason about and audit. Per-user permissions get messy fast. Modules map to product areas like jobs, candidates, assessments, so adding a feature means adding one module row, not touching every role check.'",
        },
        {
          q: "What did the Dropbox OAuth handshake involve?",
          a: "'The user clicks Connect Dropbox, we redirect them to Dropbox with our client id and a random state value. They approve, Dropbox redirects back with a code. Our server checks the state, exchanges the code for tokens server-side, and stores them encrypted for that tenant. Then we can fetch their documents.'",
        },
      ],
      answer30:
        "On Octagnt I built cookie-based JWT auth. A short-lived access token and a longer refresh token both live in httpOnly cookies, so page JavaScript can't steal them. When the access token expires, the client gets a 401, calls refresh once, even if several requests failed together, and retries, so the user never sees it. Authorization is RBAC: 4 roles across 8 permission modules, checked in a middleware before any controller runs. I also built a Dropbox OAuth flow for importing documents.",
      mistakes: [
        "Saying JWTs are encrypted. Normal JWTs are only signed. Anyone can decode and read the payload, so never put secrets in it.",
        "Checking roles only in the frontend. Hiding a button is UX. The server must check every request.",
        "Forgetting CSRF when you switch to cookies.",
        "Trap: 'What if the refresh token is stolen?' Mention refresh token rotation: each refresh gives a new refresh token and invalidates the old one, so reuse of an old token is detected.",
        "Trap: 'Where does RBAC data live?' If it's in the token, a role change only applies after the next refresh. Say whether you accepted that delay.",
      ],
      takeaway: 'Short access token, refresh token, both httpOnly; renewal is invisible; permissions are checked on the server by role and module.',
    },

    // ------------------------------------------------------------------ 5
    {
      id: 'public-upload-api',
      title: 'Public token-based API for direct-to-S3 video uploads',
      level: 'advanced',
      priority: 'must',
      frequency: 'common',
      summary: 'External candidates get a scoped token and upload videos straight to S3 with presigned URLs, without ever touching tenant data.',
      what: [
        "Candidates are not logged-in users. They get a link to record a one-sided video interview. I built public endpoints, authenticated with a special token, that let them upload videos directly to S3. The system also tracks anti-cheat signals and triggers an automated AI evaluation.",
        "The hard part: open a door to the outside world without weakening tenant isolation.",
      ],
      deeper: [
        "A presigned URL is a temporary URL that S3 creates. It allows one action (like uploading one file to one exact key) until it expires. The browser uploads straight to S3, so big video files never pass through our Node server.",
        "The candidate token is scoped: it encodes one tenant, one candidate, one interview, and an expiry. The public endpoints only accept that token and only ever touch that one interview. They can't list, search, or read anything else.",
      ],
      why: "Video files are large. Streaming them through Node uses memory, bandwidth, and server time. Direct-to-S3 is faster and cheaper. A scoped token means even if a link is shared or stolen, it only allows uploading to that one interview, for a short time.",
      analogy: "A delivery locker. The courier gets a one-time code that opens one locker, once, today. They never get a key to the building. The building's staff (your API) never has to carry the parcel themselves.",
      code: {
        lang: 'ts',
        title: 'Issue a presigned upload URL for one scoped interview',
        source: `import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({ region: process.env.AWS_REGION });

// Candidate token payload: { tenantId, candidateId, interviewId, scope: 'interview-upload' }
app.post('/public/interviews/upload-url', verifyCandidateToken, async (req, res) => {
  const { tenantId, interviewId } = req.candidate;          // from the token only
  const { questionNo, contentType } = req.body;

  if (!['video/webm', 'video/mp4'].includes(contentType)) {
    return res.status(400).json({ error: 'Unsupported video type' });
  }

  const key = \`\${tenantId}/interviews/\${interviewId}/q\${Number(questionNo)}.webm\`;
  const url = await getSignedUrl(
    s3,
    new PutObjectCommand({ Bucket: process.env.VIDEO_BUCKET, Key: key, ContentType: contentType }),
    { expiresIn: 300 } // 5 minutes
  );
  res.json({ url, key });
});

// Browser: await fetch(url, { method: 'PUT', body: videoBlob, headers: { 'Content-Type': contentType } });`,
      },
      output: "The candidate's browser asks for an upload URL, gets one that only works for 5 minutes and only for that exact file path, and uploads the video straight to S3. Our server never sees the video bytes. After upload, the app tells the API the question is done, and an AI evaluation job starts.",
      questions: [
        {
          q: "How did you keep a public endpoint from breaking tenant isolation?",
          a: "'The candidate token is scoped to one tenant, one candidate, and one interview, with an expiry. The public routes are a separate router that only accepts that token type, and the S3 key is built on the server from the token, never from user input. So the worst a stolen link can do is upload to that one interview.'",
        },
        {
          q: "Why presigned URLs instead of uploading through the API?",
          a: "'Videos are big. Through Node, each upload holds memory and bandwidth, and slow uploads tie up the server. With presigned URLs, S3 does the heavy lifting, uploads scale automatically, and our API only does small JSON calls.'",
        },
        {
          q: "How do you know the upload finished?",
          a: "Two common ways. 'The client calls a complete endpoint after the PUT succeeds, and we confirm the object exists with a HEAD request.' Or 'an S3 event notification triggers processing.' Say which one you used.",
        },
        {
          q: "What anti-cheat tracking did you do?",
          a: "Describe only what you built. Typical signals are tab switches, window focus loss, copy-paste events, and full-screen exits, sent as events with timestamps and stored with the interview. Mention that these are signals for a human to review, not automatic proof of cheating.",
        },
        {
          q: "How would you handle very large videos or bad networks?",
          a: "'Use S3 multipart upload: split the file into parts, upload them in parallel, and retry only failed parts. Or record per question so each file stays small.'",
        },
      ],
      answer30:
        "Candidates on Octagnt aren't logged-in users, so I built public endpoints authenticated by a scoped token tied to one tenant, one candidate, and one interview. The API returns a short-lived S3 presigned URL with a key built on the server, and the browser uploads the video straight to S3, so large files never go through Node. After upload we record anti-cheat signals and start an automated AI evaluation. The design opens one narrow door without weakening tenant isolation.",
      mistakes: [
        "Letting the client choose the S3 key. Then they could overwrite another candidate's file. Build the key on the server.",
        "Long expiry on presigned URLs. Keep it to minutes.",
        "Forgetting CORS on the S3 bucket. The browser PUT will fail without a CORS rule allowing your origin and the PUT method.",
        "Trap: 'Can someone upload a 10 GB file?' A presigned PUT can't enforce size. Mention presigned POST with a content-length-range condition, or checking size after upload and deleting oversized files.",
      ],
      takeaway: 'Scoped token in, short-lived presigned URL out, key built on the server, bytes never touch Node.',
    },

    // ------------------------------------------------------------------ 6
    {
      id: 'agent-orchestrator-gateway',
      title: 'Orchestrator and gateway for 35+ AI agents',
      level: 'advanced',
      priority: 'must',
      frequency: 'common',
      summary: 'One gateway with path-based routing in front of many agents, and an orchestrator that runs configurable multi-step pipelines.',
      what: [
        "Octagnt has 35+ specialized AI agents, each doing one job, like parsing a CV, generating questions, or scoring an answer. I designed an orchestrator that runs configurable multi-step pipelines across them, behind one gateway that routes by URL path.",
        "Callers talk to one address. The gateway forwards `/agents/cv-parser/...` to the CV parser, and so on. Adding a new agent doesn't change the contract for existing callers.",
      ],
      deeper: [
        "The pipeline is data, not code. A config lists the steps in order: which agent, what input it takes from previous steps, timeouts, retries. The orchestrator reads that config, runs each step, saves the result of each step, and moves on. If step 3 fails, it can retry step 3 only, instead of starting over.",
        "The gateway gives one place for cross-cutting work: auth between services, timeouts, logging, and request ids for tracing.",
      ],
      why: "Without a gateway, every caller needs to know 35 addresses, and every agent change ripples through the code. Without an orchestrator, each workflow is hard-coded, so a client who wants a different order of steps needs a code change. Config-driven pipelines let product teams change flows safely.",
      analogy: "An airport. Passengers enter through one terminal (gateway). Signs send them to the right gate by flight number (path-based routing). The flight plan (pipeline config) decides the stops, and the control tower (orchestrator) makes sure each leg finishes before the next one starts.",
      code: {
        lang: 'ts',
        title: 'A config-driven pipeline runner (simplified)',
        source: `type Step = { agent: string; input: (ctx: any) => any; retries?: number; timeoutMs?: number };

const screeningPipeline: Step[] = [
  { agent: 'cv-parser',      input: (c) => ({ fileKey: c.fileKey }) },
  { agent: 'jd-matcher',     input: (c) => ({ profile: c['cv-parser'], jobId: c.jobId }) },
  { agent: 'question-maker', input: (c) => ({ gaps: c['jd-matcher'].gaps }), retries: 2 },
];

async function callAgent(agent: string, body: unknown, timeoutMs = 30_000) {
  // Every agent sits behind one gateway: /agents/<name>/run
  const res = await fetch(\`\${GATEWAY_URL}/agents/\${agent}/run\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) throw new Error(\`\${agent} failed: \${res.status}\`);
  return res.json();
}

async function runPipeline(steps: Step[], ctx: Record<string, any>) {
  for (const step of steps) {
    if (ctx[step.agent]) continue; // already done (lets us resume after a crash)
    let attempt = 0;
    while (true) {
      try {
        ctx[step.agent] = await callAgent(step.agent, step.input(ctx), step.timeoutMs);
        await saveProgress(ctx); // persist after every step
        break;
      } catch (err) {
        if (++attempt > (step.retries ?? 0)) throw err;
      }
    }
  }
  return ctx;
}`,
      },
      output: "The orchestrator runs cv-parser, saves its output, passes it to jd-matcher, saves again, then question-maker (retrying up to twice). If the process crashes after step 2, the next run skips the first two steps because their results are already saved.",
      questions: [
        {
          q: "Why path-based routing behind one gateway?",
          a: "'One stable entry point. Callers don't know or care where an agent runs. We can move, scale, or replace an agent and only update the gateway's routing. Cross-cutting concerns like auth, timeouts, and logging live in one place.'",
        },
        {
          q: "What happens when one agent is slow or down?",
          a: "'Each call has a timeout and limited retries with backoff. Each step's result is saved, so a retry resumes from the failed step. If an agent keeps failing, a circuit breaker can stop calling it for a while and mark the pipeline as waiting instead of hammering it.' Only claim the parts you built.",
        },
        {
          q: "Did you consider a workflow engine like Temporal or AWS Step Functions?",
          a: "A good honest answer: 'For our scale a small orchestrator with saved step state was enough and easy for the team to understand. If pipelines got long-running with many branches and human approvals, a dedicated workflow engine would be worth it.'",
        },
        {
          q: "How did you keep contracts stable as agents were added?",
          a: "'Every agent follows the same request and response shape through the gateway, like POST /agents/<name>/run with a JSON body. New agents are new paths, so nothing existing changes. Breaking changes would get a new version path.'",
        },
      ],
      answer30:
        "Octagnt has 35+ specialized AI agents. I designed an orchestrator that runs configurable multi-step pipelines across them, behind one gateway with path-based routing. The pipeline is config, not code: each step names an agent, its input, timeout, and retries, and the result of every step is saved, so a failure resumes from that step instead of starting over. Callers only ever talk to the gateway, so we could add agents without breaking existing contracts.",
      mistakes: [
        "Running steps without saving progress. Then a crash at step 9 means redoing expensive AI calls 1 to 8.",
        "Retrying forever. Always cap retries and add backoff.",
        "No request id across services. Debugging a pipeline across 35 agents without a shared id in the logs is painful.",
        "Trap: 'Is the gateway a single point of failure?' Run several instances behind a load balancer; it should be stateless.",
      ],
      takeaway: 'One gateway, config-driven steps, saved progress after each step, capped retries.',
    },

    // ------------------------------------------------------------------ 7
    {
      id: 'sqs-bulk-pipeline',
      title: 'SQS pipeline for bulk uploads of 50+ files',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Upload to S3, one queue message per file, background workers, idempotent writes, status polling, and partial-failure handling.',
      what: [
        "Recruiters upload many CVs at once, 50 or more. Each file needs AI entity extraction, which is slow. I built an AWS SQS-based pipeline: files go to S3, one message per file goes on a queue, workers process them in the background, and the frontend polls for status.",
        "SQS is AWS's message queue. A producer puts messages in; consumers take them out and process them. If a consumer crashes, the message becomes visible again and is retried.",
      ],
      deeper: [
        "Key ideas: (1) The API responds right away with a batch id, so the request is fast. (2) Each file is its own job, so one bad file doesn't fail the batch (partial failure). (3) SQS standard queues deliver at least once, so a message can arrive twice. That's why writes are idempotent: processing the same file twice gives the same result, not two candidates. (4) Messages that fail many times go to a dead-letter queue (DLQ) for inspection. (5) Extraction finishes through a callback, which updates the file's status. A background monitor finds jobs stuck too long.",
      ],
      why: "Doing 50 slow AI calls inside one HTTP request causes timeouts, ties up the server, and loses all progress if anything fails. A queue moves long-running work off the request path, adds automatic retries, and lets you scale workers independently.",
      analogy: "A restaurant kitchen. The waiter (API) takes your order, gives you a table number (batch id), and goes back to other customers. Order tickets (messages) go on the rail (queue). Cooks (workers) take tickets one at a time. You can look over to see which dishes are ready (polling).",
      code: {
        lang: 'ts',
        title: 'Producer, idempotent worker, and status endpoint',
        source: `import { SQSClient, SendMessageBatchCommand } from '@aws-sdk/client-sqs';
const sqs = new SQSClient({});

// 1) API: files already in S3. Create a batch and enqueue one message per file.
app.post('/uploads', auth, tenantContext, async (req, res) => {
  const { fileKeys } = req.body;
  const batch = await Batch.create({ tenantId: req.tenantId, total: fileKeys.length, done: 0, failed: 0 });
  await UploadItem.insertMany(fileKeys.map((key) => ({ batchId: batch._id, tenantId: req.tenantId, key, status: 'queued' })));

  // SQS allows max 10 messages per batch call
  for (let i = 0; i < fileKeys.length; i += 10) {
    await sqs.send(new SendMessageBatchCommand({
      QueueUrl: QUEUE_URL,
      Entries: fileKeys.slice(i, i + 10).map((key, j) => ({
        Id: String(i + j),
        MessageBody: JSON.stringify({ batchId: batch._id, tenantId: req.tenantId, key }),
      })),
    }));
  }
  res.status(202).json({ batchId: batch._id }); // 202 Accepted: work continues later
});

// 2) Worker: safe to run twice for the same file
async function handle(msg) {
  const { batchId, tenantId, key } = JSON.parse(msg.Body);
  // Only claim items that are still 'queued' -> a duplicate message does nothing
  const item = await UploadItem.findOneAndUpdate(
    { batchId, tenantId, key, status: 'queued' },
    { status: 'processing' },
    { new: true }
  );
  if (!item) return; // already handled
  await startExtraction(item); // the extraction service calls back when done
}

// 3) Frontend polls this
app.get('/uploads/:batchId/status', auth, tenantContext, async (req, res) => {
  const counts = await UploadItem.aggregate([
    { $match: { tenantId: req.tenantId, batchId: toObjectId(req.params.batchId) } },
    { $group: { _id: '$status', n: { $sum: 1 } } },
  ]);
  res.json(counts);
});`,
      },
      output: "The recruiter uploads 50 CVs and gets a batch id in under a second. Fifty messages land on SQS. Workers pick them up in parallel. If SQS delivers a message twice, the second worker finds the item is no longer 'queued' and does nothing. The UI polls status and shows, for example, 46 done, 3 processing, 1 failed, with a retry button for the failed one.",
      questions: [
        {
          q: "SQS delivers at least once. How did you handle duplicates?",
          a: "'Idempotent writes. The worker only claims an item if its status is still queued, using one atomic findOneAndUpdate. A duplicate message finds nothing to claim and exits. Unique indexes stop duplicate candidates too.'",
        },
        {
          q: "What is the visibility timeout and how did you set it?",
          a: "'When a worker receives a message, SQS hides it for the visibility timeout. If the worker doesn't delete it in time, it reappears and someone else processes it. Set it longer than your normal processing time, or the same message gets processed twice while still running.'",
        },
        {
          q: "How do you handle a file that always fails?",
          a: "'After a set number of receives, SQS moves it to a dead-letter queue. We mark the item as failed, the batch shows partial failure, and the user can retry or fix the file. The rest of the batch is not affected.'",
        },
        {
          q: "Why polling instead of WebSockets?",
          a: "'Polling every few seconds is simple, works through any proxy, and costs little for a short-lived batch. If we needed many live updates, I'd move to server-sent events.'",
        },
        {
          q: "Why SQS and not Kafka or RabbitMQ?",
          a: "'We were already on AWS, SQS is fully managed with nothing to run, and we needed a work queue, not an event log for replay. Kafka shines when many consumers read the same stream or you need ordering and replay at high volume.'",
        },
      ],
      answer30:
        "Bulk uploads of 50+ CVs were too slow to process inside one request, so I built an SQS pipeline. Files go to S3, the API creates a batch and enqueues one message per file, then returns 202 with a batch id. Workers process files in parallel. Since SQS can deliver a message twice, workers claim items atomically, so processing is idempotent. Failures go to a dead-letter queue without failing the whole batch, and the UI polls a status endpoint to show progress.",
      mistakes: [
        "Saying SQS standard queues deliver exactly once. They are at-least-once and not strictly ordered. FIFO queues add ordering and deduplication within a 5-minute window, at lower throughput.",
        "Deleting the message before the work finishes. If the worker crashes, the job is lost. Delete only after success.",
        "Visibility timeout shorter than the processing time, which causes double processing.",
        "Forgetting the 256 KB message size limit. Put the file in S3 and only send the key in the message.",
        "Trap: 'What if the callback never comes?' That's why there's a background monitor that finds items stuck in 'processing' too long and retries or fails them.",
      ],
      takeaway: 'Respond fast, one message per file, idempotent workers, DLQ for poison messages, poll for status.',
    },

    // ------------------------------------------------------------------ 8
    {
      id: 'ats-sync-dedup',
      title: 'ATS synchronization with deduplication',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: "Pulling candidates and applications from clients' applicant tracking systems without creating duplicates.",
      what: [
        "An ATS (applicant tracking system) is the software a company already uses to manage hiring. Enterprise clients wanted their ATS data inside Octagnt, so I built a sync for applications and candidates, with deduplication and linking each application to the right job description.",
        "Deduplication means the same person, seen twice, becomes one candidate, not two.",
      ],
      deeper: [
        "Sync safely with three ideas. (1) Store the external id from the ATS and put a unique index on { tenantId, source, externalId }. Then you upsert: update if it exists, insert if not. Running the sync twice gives the same result. (2) When there's no external id match, match on normalized fields like lower-cased, trimmed email. (3) Sync incrementally using an 'updated since' timestamp, and respect the ATS's rate limits.",
      ],
      why: "Duplicate candidates confuse recruiters, double-count metrics, and can lead to a person being contacted twice. Clients won't adopt a tool that makes their data messy.",
      analogy: "Merging two phone contact lists. If two entries have the same phone number, you keep one contact and merge the details, instead of having 'Ravi' twice.",
      code: {
        lang: 'ts',
        title: 'Idempotent upsert with a unique key',
        source: `// Unique index: one candidate per tenant per ATS record
candidateSchema.index({ tenantId: 1, source: 1, externalId: 1 }, { unique: true });

async function syncCandidate(tenantId: string, atsRecord: any) {
  const email = atsRecord.email?.trim().toLowerCase();

  // 1) Same ATS record seen before? Update it.
  // 2) Otherwise, same email already in this tenant (e.g. uploaded manually)? Link it.
  const existing =
    (await Candidate.findOne({ tenantId, source: 'ats', externalId: atsRecord.id })) ??
    (email ? await Candidate.findOne({ tenantId, email }) : null);

  const data = { tenantId, source: 'ats', externalId: atsRecord.id, email, name: atsRecord.name };

  return existing
    ? Candidate.updateOne({ _id: existing._id }, { $set: data })
    : Candidate.create(data);
}`,
      },
      output: "The sync runs every hour. A candidate already synced is updated, not copied. A candidate who was uploaded by hand and later appears in the ATS gets linked to the same record by email. Running the same sync twice changes nothing.",
      questions: [
        {
          q: "How did you decide two records are the same person?",
          a: "'First by the ATS's own id. If that's missing, by normalized email inside the same tenant. I avoided fuzzy name matching for automatic merges, because merging two different people is worse than leaving a duplicate.'",
        },
        {
          q: "What if two sync jobs run at the same time?",
          a: "'The unique index is the final safety net. If two jobs try to insert the same record, one fails with a duplicate key error, and we catch that and update instead.'",
        },
        {
          q: "How do you handle different clients' custom needs?",
          a: "'Keep a core mapping and add per-tenant field mappings in config, so one client's custom field doesn't need a code change.' Describe what you actually did.",
        },
      ],
      answer30:
        "Enterprise clients wanted their ATS data in Octagnt, so I built a sync for candidates and applications. Each record stores the ATS's external id with a unique index per tenant, so the sync upserts and is safe to rerun. If there's no id match, I match on normalized email within the tenant. Applications get linked to the right job description. I chose to leave a possible duplicate rather than auto-merge on fuzzy matches, because a wrong merge is worse.",
      mistakes: [
        "Find-then-insert without a unique index. Two parallel syncs can both find nothing and both insert.",
        "Comparing emails without normalizing case and spaces.",
        "Deduplicating across tenants. The same person applying to two client companies must stay as two separate records.",
      ],
      takeaway: 'External id + unique index + upsert makes a sync safe to rerun.',
    },

    // ------------------------------------------------------------------ 9
    {
      id: 'decision-engine',
      title: 'Weighted decision engine (D1 to D9)',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Scores candidates on nine weighted dimensions, with qualification gates that decide who moves to the next phase.',
      what: [
        "I built a weighted decision engine that scores candidates on nine dimensions, D1 to D9. Each dimension has a weight. Automated qualification gates then decide whether a candidate moves to the next phase: assessment, voice screening, or a one-sided interview.",
      ],
      deeper: [
        "A weighted score is: multiply each dimension's score by its weight, add them up, and divide by the total weight. A gate is a rule that must pass regardless of the total, like 'D3 must be at least 60'. Gates stop a candidate who is great on eight dimensions but fails a must-have one.",
        "Keep the engine as a pure function: same inputs always give the same output, no database calls inside. That makes it easy to test and to explain to a recruiter why a candidate was rejected.",
      ],
      why: "Recruiters need consistent, explainable decisions. A single 'AI score' is a black box. Named dimensions with weights and gates can be tuned per job and explained to a client.",
      analogy: "A school report card. Each subject has a mark and some subjects count more (weights). But to pass the year you must also pass maths, no matter how good the other marks are (a gate).",
      code: {
        lang: 'js',
        title: 'Pure scoring function with gates',
        source: `function evaluate(scores, config) {
  // scores: { D1: 80, D2: 65, ... }   config.weights: { D1: 2, D2: 1, ... }
  let total = 0, weightSum = 0;
  for (const [dim, weight] of Object.entries(config.weights)) {
    total += (scores[dim] ?? 0) * weight;
    weightSum += weight;
  }
  const finalScore = Math.round(total / weightSum);

  const failedGates = config.gates.filter((g) => (scores[g.dim] ?? 0) < g.min);
  const qualified = failedGates.length === 0 && finalScore >= config.passMark;

  return { finalScore, qualified, failedGates }; // failedGates explains the decision
}

console.log(evaluate(
  { D1: 90, D2: 80, D3: 40 },
  { weights: { D1: 2, D2: 1, D3: 1 }, gates: [{ dim: 'D3', min: 60 }], passMark: 70 }
));
// { finalScore: 75, qualified: false, failedGates: [ { dim: 'D3', min: 60 } ] }`,
      },
      output: "The candidate's weighted score is 75, above the pass mark of 70, but they fail the D3 gate, so they don't qualify. The result includes the failed gate, so the recruiter can see the reason.",
      questions: [
        {
          q: "How do you make AI-based scoring fair and explainable?",
          a: "'Break it into named dimensions, return the reason for every decision, keep humans able to override, and store the inputs and config version used, so any decision can be reproduced later.'",
        },
        {
          q: "How did you test it?",
          a: "'It's a pure function, so unit tests with tables of inputs and expected outputs, including edge cases like missing dimensions, all-zero weights, and scores exactly on the gate value.'",
        },
        {
          q: "What if a client wants different weights?",
          a: "'Weights, gates, and pass marks are config per job or per tenant. We store which config version scored each candidate.'",
        },
      ],
      answer30:
        "I built a weighted decision engine that scores candidates on nine dimensions, D1 to D9. Each has a configurable weight, and qualification gates enforce must-haves, so a candidate can't pass on a high total while failing a critical dimension. It's a pure function that returns the score, the decision, and the reasons, which makes it easy to test and to explain to recruiters. It drives the multi-phase flow across assessment, voice screening, and one-sided interviews.",
      mistakes: [
        "Dividing by zero when all weights are zero. Validate config.",
        "Treating a missing score as a pass. Decide explicitly (here, missing = 0).",
        "Trap: 'Isn't automated rejection risky?' Agree, and say gates flag candidates and humans can review or override. Hiring decisions can have legal and fairness implications.",
      ],
      takeaway: 'Weights give the total, gates enforce must-haves, and every decision carries its reasons.',
    },

    // ------------------------------------------------------------------ 10
    {
      id: 'ai-features-voice-agent',
      title: 'AI features: JD generation and the voice interview agent',
      level: 'advanced',
      priority: 'must',
      frequency: 'common',
      summary: 'OpenAI-generated job descriptions, and a voice screening agent built from telephony, speech-to-text, an LLM, and text-to-speech.',
      note:
        "These two items come from your study brief (OpenAI JD generation with about 70% less effort; a standalone voice agent on GCP with Twilio, Google STT/TTS, and xAI Grok Voice). They are not on the three resumes you uploaded, which only mention 'voice screening'. If you did this work, consider adding it to your resume. If you mention it, be ready for deep follow-ups, and only say the parts you built.",
      what: [
        "Two AI features. First, job description generation: a recruiter enters a few details (title, skills, seniority) and the app uses the OpenAI API to write a full JD, which the recruiter edits. Second, an AI voice interview agent: a separate microservice on GCP that calls the candidate through Twilio, turns their speech into text (STT), sends it to an LLM to decide what to say, turns that into speech (TTS), and plays it back.",
      ],
      deeper: [
        "The voice loop: Twilio streams the call's audio over a WebSocket to our service. Voice activity detection notices when the candidate stops speaking. The audio goes to speech-to-text. The text goes to the LLM with the interview context. The reply goes to text-to-speech, and the audio streams back to Twilio. Latency is the main enemy: every stage adds delay, and a pause longer than about a second feels unnatural. Barge-in means if the candidate starts talking while the agent is speaking, the agent stops.",
        "It was a standalone microservice because it holds long-lived WebSocket connections, needs different scaling, and shouldn't affect the main API if it misbehaves.",
      ],
      why: "Writing JDs from scratch is slow and repetitive. First-round phone screens take recruiters hours per day. Both are repetitive, language-heavy tasks where an LLM gives a good first draft or first pass, and a human makes the final call.",
      analogy: "The voice agent is like a relay race with four runners: the phone line hands audio to the listener (STT), who hands words to the thinker (LLM), who hands an answer to the speaker (TTS), who hands audio back to the phone. The race is only as fast as the total of all handoffs.",
      code: {
        lang: 'js',
        title: 'JD generation with structured output (OpenAI Node SDK)',
        source: `import OpenAI from 'openai';
const openai = new OpenAI(); // reads OPENAI_API_KEY from the environment

async function generateJD({ title, skills, seniority }) {
  const completion = await openai.chat.completions.create({
    model: process.env.JD_MODEL, // keep the model name in config, not in code
    temperature: 0.4,           // fairly consistent, a little variety
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'You write clear, inclusive job descriptions. Reply only with JSON: {"summary": string, "responsibilities": string[], "requirements": string[]}. Do not invent salary or benefits.' },
      { role: 'user', content: JSON.stringify({ title, skills, seniority }) },
    ],
  });
  return JSON.parse(completion.choices[0].message.content); // validate before saving
}`,
      },
      output: "The recruiter types 'Senior Node.js Engineer, skills: Node, AWS, MongoDB'. The API returns a JSON object with a summary, responsibilities, and requirements. The UI fills an editable form, and the recruiter tweaks it before publishing. Because the output is JSON with a fixed shape, the UI can render it reliably.",
      questions: [
        {
          q: "How did you measure the '70% less manual effort' claim?",
          a: "Only use a number you can explain. Example: 'Recruiters used to spend about N minutes writing a JD; with generation plus editing it took about N minutes, measured on a sample of jobs.' If it was an estimate, say it was an estimate.",
        },
        {
          q: "How do you stop the LLM from inventing things?",
          a: "'Give it only the facts it needs, tell it not to invent salary or benefits, ask for structured output, validate the shape, and keep a human editing step before anything is published.'",
        },
        {
          q: "What was the hardest part of the voice agent?",
          a: "Likely latency and interruptions. 'Every stage adds delay. We streamed everything instead of waiting for full responses, started TTS on the first sentence of the LLM reply, and handled barge-in by stopping playback as soon as the candidate spoke.' Describe your real solution.",
        },
        {
          q: "Why a separate microservice for voice?",
          a: "'It keeps long-lived WebSocket connections and real-time audio, which scales differently from a REST API. Isolating it means a spike in calls can't slow down the main platform, and we can deploy it on its own.'",
        },
        {
          q: "How do you handle prompt injection from candidate answers?",
          a: "'Treat candidate speech as data, not instructions. Keep instructions in the system prompt, wrap candidate text clearly, limit what the model can do (no tools that change data), and check outputs before acting on them.'",
        },
      ],
      answer30:
        "I worked on two AI features. For job descriptions, recruiters enter a few details and we call the OpenAI API with a structured JSON output, so the UI can render an editable draft; a human always reviews before publishing. The voice interview agent is a separate microservice: Twilio streams call audio over a WebSocket, we run speech-to-text, send the text to an LLM, convert the reply with text-to-speech, and stream it back. The main challenge was keeping latency low and handling interruptions, so we streamed every stage.",
      mistakes: [
        "Quoting a percentage you can't explain. Interviewers love to ask 'how did you measure that?'.",
        "Hard-coding model names. Models change often; keep them in config.",
        "Parsing LLM JSON without validation. Even with JSON mode, check the shape before saving.",
        "Trap: 'Is it legal to record and assess candidates with AI?' Mention consent, telling candidates an AI is involved, and following local rules. Say your company's legal or product team owned the policy if that's true.",
      ],
      takeaway: 'LLMs draft, humans decide; for voice, every stage streams because latency adds up.',
    },

    // ------------------------------------------------------------------ 11
    {
      id: 'localstack-testing',
      title: 'LocalStack, Docker Compose, and testing with Jest and Supertest',
      level: 'basic',
      priority: 'must',
      frequency: 'common',
      summary: 'A local copy of S3 and SQS in Docker, plus endpoint and unit tests with mocked repositories.',
      what: [
        "LocalStack is a tool that pretends to be AWS on your laptop. I set up LocalStack with Docker Compose so every developer could run S3 and SQS locally, matching the cloud setup. I also wrote endpoint tests with Supertest and unit tests with Jest, using mocked repositories.",
        "Supertest sends fake HTTP requests to your Express app without starting a real server. A mocked repository is a fake data layer that returns what the test wants, so tests don't need a real database.",
      ],
      why: "Without LocalStack, developers test against real AWS (costly, shared, risky) or not at all. Without tests, every change risks breaking something. Mocking the repository layer keeps unit tests fast and focused on business logic.",
      analogy: "LocalStack is a flight simulator. Pilots practise on the ground with the same controls as the real plane, and crashing costs nothing.",
      code: [
        {
          lang: 'yaml',
          title: 'docker-compose.yml',
          source: `services:
  localstack:
    image: localstack/localstack
    ports: ["4566:4566"]          # one port for all AWS services
    environment:
      - SERVICES=s3,sqs
  mongo:
    image: mongo:7
    ports: ["27017:27017"]
  api:
    build: .
    depends_on: [localstack, mongo]
    environment:
      - AWS_ENDPOINT_URL=http://localstack:4566   # point the AWS SDK at LocalStack
      - AWS_REGION=us-east-1
      - AWS_ACCESS_KEY_ID=test
      - AWS_SECRET_ACCESS_KEY=test
      - MONGO_URL=mongodb://mongo:27017/app`,
        },
        {
          lang: 'js',
          title: 'Endpoint test with Supertest and a mocked repository',
          source: `const request = require('supertest');
const { buildApp } = require('../app');

test('GET /candidates/:id returns 404 for another tenant', async () => {
  const repo = { findById: jest.fn().mockResolvedValue(null) }; // fake data layer
  const app = buildApp({ candidateRepo: () => repo, auth: fakeAuth({ tenantId: 't1' }) });

  const res = await request(app).get('/candidates/abc');

  expect(res.status).toBe(404);
  expect(repo.findById).toHaveBeenCalledWith('abc');
});`,
        },
      ],
      output: "`docker compose up` starts fake S3, fake SQS, and MongoDB. The API's AWS SDK talks to LocalStack instead of real AWS, so uploads and queue messages work offline. The Supertest test calls the endpoint in memory, the fake repository returns null, and the test confirms a 404.",
      questions: [
        {
          q: "Why mock repositories instead of using a real database in tests?",
          a: "'Unit tests should be fast and test one thing: the business logic. A mocked repository makes them run in milliseconds. For confidence that queries really work, integration tests can run against a real MongoDB, for example mongodb-memory-server or a Docker container.'",
        },
        {
          q: "What is the downside of LocalStack?",
          a: "'It's very close to AWS but not identical. IAM permissions, some limits, and edge cases can behave differently. So we still test in a real staging environment before production.'",
        },
        {
          q: "How did you make the app testable?",
          a: "'Dependency injection. The app is built by a function that receives its repositories and services, so a test can pass fakes. The app is exported without calling listen(), so Supertest can use it directly.'",
        },
      ],
      answer30:
        "I set up LocalStack with Docker Compose so every developer could run S3 and SQS locally, matching our cloud setup without touching real AWS. For testing, I wrote Jest unit tests and Supertest endpoint tests. The app receives its repositories through dependency injection, so tests pass in mocked repositories and run fast, while integration tests cover real queries. On Skillkeepr, adding Jest coverage across backend modules cut regression bugs by about 30%.",
      mistakes: [
        "Calling `app.listen()` in the file tests import. Export the app and start the server in a separate file.",
        "Only mocking, never integration testing. Mocks can hide broken queries.",
        "Trap: 'How did you measure 30% fewer regressions?' Know the source, for example bug tickets labelled 'regression' per release before and after.",
      ],
      takeaway: 'LocalStack gives cloud parity locally; dependency injection makes mocking easy; integration tests catch what mocks hide.',
    },

    // ------------------------------------------------------------------ 12
    {
      id: 'skillkeepr-architecture',
      title: 'Skillkeepr: 60-second explanation and architecture',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'HR and recruitment SaaS where you built audit logging, interview workflows, notifications, and led the TypeScript migration.',
      note:
        "Your brief also lists Stripe subscriptions, a Boolean search engine, Jitsi live interviews, and a Node 16 to 18 migration for Skillkeepr. Your uploaded resumes don't mention these, and they say Node 18 to 20. Interviewers read your resume, so match it. Stripe and Boolean search have their own pages below in case you did that work.",
      what: [
        "Skillkeepr is an HR and recruitment SaaS. Companies use it to manage talent and run hiring processes. I worked there from June 2023 to February 2026 as a full stack developer.",
        "My main work: a compliance-grade audit and usage logging service, configurable multi-level interview workflows, WhatsApp and SMS notifications, the TypeScript migration, Jest test coverage, the Node.js 18 to 20 upgrade, LaunchDarkly feature flags, and React integration for the bulk user and talent modules.",
      ],
      deeper: [
        "Architecture in plain words: a React single-page app talks to Node.js services in a microservices setup. Services own their own data. Feature flags (LaunchDarkly) control which users see new features. An audit service records who did what, with its own database. Notifications go out through WhatsApp and SMS provider APIs.",
        "The interview workflow engine stores each hiring process as configuration: a list of stages (like screening, technical round, HR round), who approves each one, and what happens next. Big organizations can design their own process without code changes.",
      ],
      why: "HR teams need traceability (who changed a candidate's status, and when), flexible hiring processes that match their org, and fast communication with candidates. Those needs drove the features you built.",
      analogy: "Skillkeepr is like a company's HR office in software: the logbook at the front desk (audit logs), the hiring checklist that each department can customise (workflows), and the messenger who calls candidates (notifications).",
      code: {
        lang: 'json',
        title: 'A configurable interview workflow (example shape)',
        source: `{
  "workflowId": "engineering-hiring",
  "stages": [
    { "key": "screening", "type": "review",    "approvers": ["recruiter"] },
    { "key": "tech-1",    "type": "interview", "approvers": ["tech-lead"], "onReject": "end" },
    { "key": "tech-2",    "type": "interview", "approvers": ["eng-manager"] },
    { "key": "hr",        "type": "interview", "approvers": ["hr"], "notify": ["whatsapp", "sms"] }
  ]
}`,
      },
      output: "When a candidate passes 'tech-1', the engine reads the config, moves them to 'tech-2', and notifies the engineering manager. If they're rejected at 'tech-1', 'onReject: end' closes the process. A different company can define three stages or seven, with no code change.",
      questions: [
        {
          q: "How did the workflow engine stay flexible but safe?",
          a: "'Stages are data with a fixed schema. We validated each workflow config when it was saved: unique stage keys, valid approver roles, no dead ends. The engine just reads the config and moves candidates through it.'",
        },
        {
          q: "How did you integrate WhatsApp and SMS?",
          a: "'Through provider APIs. Sending was done asynchronously so a slow provider didn't slow the user's request, with retries for temporary failures and logs of delivery status.' Name the provider if you can.",
        },
        {
          q: "What would you improve on Skillkeepr?",
          a: "Real examples are best. Options: 'More integration tests across services', 'contract tests between microservices', 'better dashboards on notification delivery rates'.",
        },
      ],
      answer30:
        "Skillkeepr is an HR and recruitment SaaS, where I worked from 2023 to early 2026. I built a compliance-grade audit logging service with buffered, non-blocking writes and sensitive-data redaction, and a configurable multi-level interview workflow engine for large organizations. I integrated WhatsApp and SMS notifications, led the migration to modern TypeScript, upgraded Node from 18 to 20, added Jest coverage that cut regressions by about 30%, and used LaunchDarkly feature flags for safe rollouts.",
      mistakes: [
        "Mixing up which feature belongs to which product. Keep Skillkeepr and Octagnt work clearly separate.",
        "Claiming items from an older resume version that this company never saw, then contradicting the resume they hold.",
        "Trap: 'Microservices for an HR app, wasn't that overkill?' Have a view: separate deployment, team ownership, and isolating heavy modules, but also the cost of more moving parts.",
      ],
      takeaway: 'Skillkeepr = audit logging, workflow engine, notifications, TypeScript migration, tests, safe rollouts.',
    },

    // ------------------------------------------------------------------ 13
    {
      id: 'audit-logging-service',
      title: 'Audit and usage logging with buffered, non-blocking writes',
      level: 'advanced',
      priority: 'must',
      frequency: 'common',
      summary: 'Middleware captures every API action, redacts sensitive fields, buffers in memory, and writes in batches to a separate database.',
      what: [
        "An audit log is a record of who did what and when, like 'user 42 changed candidate 9's status from screening to rejected at 10:05'. I built a compliance-grade audit logging system for Skillkeepr with a dedicated database, auto-capture middleware, buffered non-blocking writes, and sensitive-data redaction.",
      ],
      deeper: [
        "Four parts. (1) Auto-capture middleware runs on every request and collects user, tenant, route, method, status, and duration when the response finishes. (2) Redaction removes or masks sensitive fields (passwords, tokens, personal data) before anything is stored. (3) A buffer keeps entries in memory and flushes them with one bulk insert every N entries or every few seconds. (4) A dedicated database keeps audit traffic away from the main database.",
        "Non-blocking means the user's response never waits for the log write. The trade-off: if the process crashes, entries still in the buffer can be lost. You reduce that by flushing on shutdown, keeping the buffer small, or sending to a queue first for stronger guarantees.",
      ],
      why: "HR data needs traceability for compliance and customer trust. But writing a log entry synchronously on every request adds latency and load. Batching gives full traceability without slowing users down. Redaction stops the audit log itself from becoming a data leak.",
      analogy: "A shop cashier who writes each sale on a sticky note and, every few minutes, copies the whole stack into the ledger at once. Customers never wait for the ledger. Card numbers are never written down, only the last four digits.",
      code: {
        lang: 'ts',
        title: 'Middleware + redaction + buffered bulk writes',
        source: `const SENSITIVE = ['password', 'token', 'authorization', 'otp', 'aadhaar', 'pan'];

function redact(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(redact);
  return Object.fromEntries(Object.entries(obj).map(([k, v]) =>
    SENSITIVE.some((s) => k.toLowerCase().includes(s)) ? [k, '[REDACTED]'] : [k, redact(v)]
  ));
}

const buffer: object[] = [];
async function flush() {
  if (!buffer.length) return;
  const batch = buffer.splice(0, buffer.length);   // take everything, empty the buffer
  try { await AuditLog.insertMany(batch, { ordered: false }); }
  catch (err) { console.error('audit flush failed', err); } // never crash the app
}
setInterval(flush, 2000).unref();                  // flush every 2s; don't keep process alive
process.on('SIGTERM', async () => { await flush(); process.exit(0); });

export function auditMiddleware(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {                          // after the response is sent
    buffer.push({
      at: new Date(), tenantId: req.tenantId, userId: req.user?.id,
      method: req.method, path: req.route?.path ?? req.path,
      status: res.statusCode, ms: Date.now() - start, body: redact(req.body),
    });
    if (buffer.length >= 500) void flush();         // flush early when busy
  });
  next();
}`,
      },
      output: "A user updates a candidate. The response goes back immediately. On 'finish', an entry is added to the in-memory buffer with the password field replaced by [REDACTED]. Every 2 seconds, or when 500 entries pile up, all buffered entries are saved with one insertMany call to the audit database.",
      questions: [
        {
          q: "What happens to buffered logs if the server crashes?",
          a: "'On a graceful shutdown we flush the buffer. On a hard crash, the last couple of seconds can be lost. That was an accepted trade-off for latency. If we needed zero loss, I'd write entries to a durable queue like SQS first and have a consumer store them.'",
        },
        {
          q: "Why a dedicated database for audit logs?",
          a: "'Audit logs are write-heavy and grow forever. Keeping them separate protects the main database's performance, lets us set different retention and backup rules, and lets us restrict access to them.'",
        },
        {
          q: "How do you make audit logs tamper-resistant?",
          a: "'Append-only access for the app (no update or delete permissions), restricted read access, and for stronger guarantees, hashing each entry with the previous one so any change breaks the chain.' Only claim what you built.",
        },
        {
          q: "How do you stop logs from growing forever?",
          a: "'A retention policy, for example a TTL index to delete after N months, or archiving old logs to cheaper storage like S3.'",
        },
      ],
      answer30:
        "On Skillkeepr I built a compliance-grade audit logging service. A middleware auto-captures every API action after the response finishes, redacts sensitive fields like passwords and tokens, and pushes the entry into an in-memory buffer. The buffer flushes in bulk every couple of seconds, or sooner when busy, to a dedicated database. So we got full traceability without adding request latency. The trade-off is a small loss window on a hard crash, which we limited by flushing on shutdown.",
      mistakes: [
        "Logging the raw request body. You'll store passwords and personal data in your audit log.",
        "Awaiting the log write inside the request. That adds latency to every call.",
        "Letting a logging failure crash the app or fail the request.",
        "Trap: 'Doesn't each server instance have its own buffer?' Yes, that's fine: each flushes independently. Mention it before they do.",
      ],
      takeaway: 'Capture after response, redact first, buffer and bulk-insert to a separate store.',
    },

    // ------------------------------------------------------------------ 14
    {
      id: 'typescript-migration-node-upgrade',
      title: 'Leading the TypeScript migration and the Node.js 18 to 20 upgrade',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Migrating a codebase step by step without stopping feature work, and upgrading the runtime safely.',
      note:
        "Your brief says 'Node 16 to 18 migration'; your resume says 'Node.js v18 to v20'. Use whichever is true and matches the resume you sent. The approach below works for both. The Node stack in this app covers version-specific details.",
      what: [
        "A TypeScript migration means converting JavaScript code to TypeScript so the compiler catches type mistakes before runtime. I led the full migration of Skillkeepr's codebase to modern TypeScript standards. I also upgraded Node.js from v18 to v20 across services and fixed the dependency and compatibility issues that came with it.",
      ],
      deeper: [
        "A safe migration is incremental. Turn on `allowJs` so JS and TS files live together. Convert the shared, most-used code first (models, utilities, API types), because every later file benefits. Start with a loose config and tighten `strict` options over time. Never mix a migration with behaviour changes in the same pull request.",
        "A safe runtime upgrade: read the release notes for breaking changes, update the Node version in one place (Dockerfile, `.nvmrc`, CI), upgrade dependencies that don't support the new version, run the full test suite, deploy to staging, watch error rates and memory, then roll out service by service.",
      ],
      why: "TypeScript catches whole classes of bugs (undefined properties, wrong argument types) at build time and makes refactoring safer. Old Node versions reach end of life and stop getting security fixes, so staying current is a security requirement, not a nice-to-have.",
      analogy: "Renovating a house while living in it. You do one room at a time, keep the water running, and never knock down a wall without checking whether it holds up the roof.",
      code: {
        lang: 'json',
        title: 'tsconfig.json for an incremental migration',
        source: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "outDir": "dist",
    "allowJs": true,            // JS and TS can live side by side during migration
    "checkJs": false,           // don't type-check old JS files yet
    "strict": false,            // start loose...
    "noImplicitAny": true,      // ...but turn strict checks on one at a time
    "strictNullChecks": false,  // next step: enable and fix errors module by module
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}`,
      },
      output: "The project builds with a mix of .js and .ts files. Each pull request converts one module and fixes its type errors. Once most files are converted, `strictNullChecks` is enabled, which surfaces places where values might be null or undefined. Feature work continues the whole time.",
      questions: [
        {
          q: "How did you migrate without stopping feature development?",
          a: "'Incrementally. allowJs let old and new code coexist. We converted shared types and models first, then one module per pull request, and new code had to be TypeScript. Migration PRs had no behaviour changes, which kept reviews simple.'",
        },
        {
          q: "What kinds of bugs did TypeScript catch?",
          a: "Have one real example ready, like 'a function that sometimes returned undefined, which callers assumed was always an object' or 'a misspelled property in an API response'.",
        },
        {
          q: "What broke when upgrading Node, and how did you find it?",
          a: "Describe your real issues. Common ones: native modules that needed rebuilding or newer versions, packages that didn't support the new version, and changed default behaviour. 'We found them by running the full test suite on the new version in CI and deploying to staging first.'",
        },
        {
          q: "How did you roll the upgrade out safely?",
          a: "'Service by service, staging first, watching error rates, latency, and memory after each deploy, with the old image ready for a quick rollback.'",
        },
      ],
      answer30:
        "I led Skillkeepr's migration to modern TypeScript. We did it incrementally: allowJs so JS and TS lived together, shared types and models first, one module per pull request with no behaviour changes, and tighter strict options over time, so feature work never stopped. I also upgraded Node from 18 to 20 across services: updated the version in one place, fixed incompatible dependencies, ran the full test suite, deployed to staging, and rolled out service by service while watching errors and memory.",
      mistakes: [
        "Turning on `strict: true` on day one of a big migration. You get thousands of errors and the team gives up.",
        "Using `any` everywhere to make errors go away. That's a migration in name only. Prefer `unknown` and narrow it.",
        "Upgrading Node and twenty dependencies in one giant change. When something breaks you can't tell what caused it.",
        "Trap: 'Does TypeScript make code faster?' No. Types are removed at build time. Your resume says it improved 'performance': be ready to explain that as developer productivity, or a specific change you made during the migration.",
      ],
      takeaway: 'Migrate in small, behaviour-free steps; upgrade runtimes with tests, staging, and gradual rollout.',
    },

    // ------------------------------------------------------------------ 15
    {
      id: 'feature-flags-microservices',
      title: 'Feature flags with LaunchDarkly for safe rollouts',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Ship code turned off, then turn it on for some users, measure, and turn it off instantly if something breaks.',
      what: [
        "A feature flag is an on/off switch for a feature, controlled from outside the code. On Skillkeepr we used LaunchDarkly feature flags inside our microservices for incremental deployments and A/B testing.",
      ],
      deeper: [
        "Deploying (putting code on servers) and releasing (letting users see it) become two separate steps. You can release to 5% of users, or to one tenant, watch metrics, then increase. If errors rise, you switch the flag off with no redeploy. A/B testing uses flags to show two versions to different users and compare results.",
        "Flags have a cost: each one is a branch in the code. Remove a flag once the feature is fully rolled out, or the code fills up with dead paths.",
      ],
      why: "Big-bang releases are risky. With flags, a bad feature is a switch-off away, not a rollback away. You also test with real users in production, safely.",
      analogy: "A dimmer switch instead of a light switch. You turn the new light up slowly and watch whether anything flickers. If it does, you turn it back down instantly.",
      code: {
        lang: 'js',
        title: 'Checking a flag per user (LaunchDarkly Node server SDK, simplified)',
        source: `const ld = require('@launchdarkly/node-server-sdk');
const client = ld.init(process.env.LD_SDK_KEY);

async function getWorkflowEngine(user) {
  await client.waitForInitialization({ timeout: 5 });
  const context = { kind: 'user', key: user.id, tenantId: user.tenantId };

  // Third argument = default value if LaunchDarkly can't be reached
  const useNewEngine = await client.variation('new-workflow-engine', context, false);
  return useNewEngine ? newEngine : oldEngine;
}`,
      },
      output: "In the LaunchDarkly dashboard the flag 'new-workflow-engine' targets 10% of users. Those users get the new engine; others keep the old one. If LaunchDarkly is unreachable, everyone safely gets `false`, the old engine.",
      questions: [
        {
          q: "Deployment vs release: what's the difference?",
          a: "'Deployment puts code on servers. Release exposes it to users. Flags separate them, so we can deploy anytime and release gradually.'",
        },
        {
          q: "What's the risk of feature flags?",
          a: "'Flag debt: old flags nobody removes, which makes code hard to read and test. We removed flags after full rollout. Also, always choose a safe default in case the flag service is down.'",
        },
        {
          q: "How did you test code behind a flag?",
          a: "'Tests for both values of the flag, by mocking the flag client to return true and false.'",
        },
      ],
      answer30:
        "On Skillkeepr we used LaunchDarkly feature flags across our microservices. They separate deploying code from releasing it: we deploy with the feature off, enable it for a small percentage of users or one tenant, watch metrics, and widen the rollout. If something breaks, we switch it off instantly with no redeploy. We also used flags for A/B tests. Every flag has a safe default, and we remove flags after full rollout to avoid flag debt.",
      mistakes: [
        "Unsafe defaults: if the flag service is down, the default should be the old, safe behaviour.",
        "Never removing flags.",
        "Trap: 'Flags evaluated in the frontend only?' Anything security-related must be checked on the server too.",
      ],
      takeaway: 'Flags split deploy from release; roll out gradually, keep safe defaults, delete old flags.',
    },

    // ------------------------------------------------------------------ 16
    {
      id: 'stripe-subscriptions-usage',
      title: 'Stripe subscriptions, webhooks, and plan-based limits',
      level: 'advanced',
      priority: 'good',
      frequency: 'common',
      summary: 'Stripe handles payments; your webhooks keep your database in sync; your API enforces plan limits.',
      note:
        "This comes from your study brief, not your uploaded resumes. Only talk about it as your work if you really built it. The full Stripe deep-dive will be in the Integrations and AI stack.",
      what: [
        "Stripe is a payment platform. For a SaaS, you create products and prices in Stripe, and customers subscribe. Stripe charges them every month or year. Your app listens to Stripe webhooks (HTTP calls Stripe sends to your server when something happens) and updates the customer's plan in your database. Your API then checks the plan before allowing actions, like 'max 5 job posts on the Basic plan'.",
      ],
      deeper: [
        "Rules that matter: (1) Never trust the browser to say 'payment succeeded'. Trust signed webhooks. (2) Verify every webhook's signature with your webhook secret. (3) Webhooks can arrive more than once and out of order, so store processed event ids and make handlers idempotent. (4) Upgrades mid-cycle use proration: Stripe charges or credits the difference for the remaining days. (5) Usage limits are checked in your API using counters per billing period.",
      ],
      why: "Billing mistakes cost money and trust. Webhooks are the only reliable way to know what happened in Stripe, including renewals and failed payments that happen when the user isn't on your site.",
      analogy: "Stripe is your accountant. The accountant sends you a signed letter whenever money moves (webhook). You only update your records from signed letters, never from what a customer tells you at the door.",
      code: {
        lang: 'js',
        title: 'Verified, idempotent webhook handler (Express)',
        source: `const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Raw body is required for signature verification
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return res.status(400).send('Bad signature');
  }

  // Idempotency: ignore events we've already processed (unique index on eventId)
  const firstTime = await ProcessedEvent.create({ eventId: event.id }).then(() => true, () => false);
  if (!firstTime) return res.json({ received: true });

  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.created') {
    const sub = event.data.object;
    await Tenant.updateOne(
      { stripeCustomerId: sub.customer },
      { plan: sub.items.data[0].price.lookup_key, status: sub.status }
    );
  }
  res.json({ received: true }); // respond fast; Stripe retries on errors
});`,
      },
      output: "A customer upgrades. Stripe sends `customer.subscription.updated`. The handler checks the signature, records the event id, and updates the tenant's plan. If Stripe sends the same event again, the insert fails on the unique index and the handler skips it.",
      questions: [
        {
          q: "Why use webhooks instead of the success page redirect?",
          a: "'The user can close the tab before the redirect, and renewals or failed payments happen with no user present. Webhooks are signed and retried by Stripe, so they're the source of truth.'",
        },
        {
          q: "How do you handle duplicate or out-of-order webhooks?",
          a: "'Store event ids to skip duplicates. For ordering, don't trust the order of arrival: re-read the latest subscription from Stripe's API when it matters, or compare timestamps before overwriting.'",
        },
        {
          q: "How did you enforce plan-based usage limits?",
          a: "'Each plan defines limits. Usage counters are stored per tenant per billing period. A middleware checks the counter before allowing the action, and increments it atomically, so two parallel requests can't both slip past the limit.'",
        },
      ],
      answer30:
        "For subscriptions, Stripe owns payments and our database follows Stripe through webhooks. Every webhook's signature is verified using the raw request body, and processed event ids are stored so duplicate deliveries are ignored. Subscription events update the tenant's plan and status. Plan limits are enforced in our API with per-period usage counters that are checked and incremented atomically. We never trust the browser to say a payment succeeded.",
      mistakes: [
        "Using `express.json()` before the webhook route. Signature verification needs the raw body.",
        "Doing slow work before responding. Stripe expects a quick 2xx; do heavy work asynchronously.",
        "Granting access on the checkout success page instead of on the webhook.",
      ],
      takeaway: 'Stripe is the source of truth; verified, idempotent webhooks keep your database in sync.',
    },

    // ------------------------------------------------------------------ 17
    {
      id: 'boolean-search-engine',
      title: 'Boolean search engine with MongoDB aggregation',
      level: 'advanced',
      priority: 'good',
      frequency: 'occasional',
      summary: 'Turning queries like (react AND node) NOT php into MongoDB filters, with compound indexes for speed.',
      note:
        "From your study brief, not your uploaded resumes. Use it only if you built it. The MongoDB stack will cover indexes and the ESR rule in depth.",
      what: [
        "Recruiters search candidates with Boolean queries: AND, OR, NOT, brackets, and field filters, like `skills:(react AND node) NOT location:delhi`. A Boolean search engine parses that text into a tree, then turns the tree into a MongoDB query.",
      ],
      deeper: [
        "Three steps. (1) Parse: turn the string into a tree. AND and OR are nodes with children; NOT wraps one child; leaves are terms, optionally with a field. (2) Compile: walk the tree. AND becomes `$and`, OR becomes `$or`, NOT becomes `$nor`, a leaf becomes a field match. (3) Run it in an aggregation that starts with `$match` on tenantId, so a compound index is used, then sorts and paginates.",
        "Performance: put equality filters (tenantId, jobId) first in compound indexes. For free-text words, a text index or an exact-match field (like a normalized skills array) is far faster than regex.",
      ],
      why: "Recruiters are used to Boolean search from LinkedIn and job boards. Simple keyword search returns too many results. Precise search saves hours.",
      analogy: "A library catalogue where you can say 'books by this author AND about cooking, but NOT desserts'. The librarian (the parser) turns your sentence into exact shelf instructions.",
      code: {
        lang: 'js',
        title: 'Compiling a parsed Boolean tree into a MongoDB filter',
        source: `// Tree for: skills:(react AND node) NOT location:delhi
const tree = {
  op: 'AND',
  children: [
    { field: 'skills', term: 'react' },
    { field: 'skills', term: 'node' },
    { op: 'NOT', child: { field: 'location', term: 'delhi' } },
  ],
};

function compile(node) {
  if (node.op === 'AND') return { $and: node.children.map(compile) };
  if (node.op === 'OR') return { $or: node.children.map(compile) };
  if (node.op === 'NOT') return { $nor: [compile(node.child)] };
  return { [node.field]: node.term.toLowerCase() }; // skills is a normalized lowercase array
}

const pipeline = (tenantId) => [
  { $match: { tenantId, ...compile(tree) } }, // tenant first, so the compound index is used
  { $sort: { updatedAt: -1 } },
  { $limit: 20 },
];
console.log(JSON.stringify(compile(tree)));`,
      },
      output: "The tree becomes `{\"$and\":[{\"skills\":\"react\"},{\"skills\":\"node\"},{\"$nor\":[{\"location\":\"delhi\"}]}]}`. MongoDB returns candidates whose skills array contains both react and node and whose location isn't delhi, for this tenant only, newest first.",
      questions: [
        {
          q: "Why not just use regex for search?",
          a: "'Unanchored or case-insensitive regex usually can't use an index well, so it scans many documents. Normalized fields with exact matches, or a text index, are much faster.'",
        },
        {
          q: "How did you protect against injection through the search box?",
          a: "'The user's text never becomes raw MongoDB operators. The parser only produces a fixed set of node types, and only whitelisted fields can be searched.'",
        },
        {
          q: "When would you move to Elasticsearch or Atlas Search?",
          a: "'When we need relevance ranking, typo tolerance, synonyms, or very large data. MongoDB queries are fine for exact, structured filters.'",
        },
      ],
      answer30:
        "Recruiters wanted Boolean search: AND, OR, NOT, brackets, and field filters. I parsed the query into a tree and compiled it into a MongoDB filter: AND to $and, OR to $or, NOT to $nor, leaves to field matches on normalized fields. The aggregation starts with a tenant match so compound indexes are used. Only whitelisted fields can be searched, so user input never becomes raw MongoDB operators.",
      mistakes: [
        "Passing user input straight into a query object, which allows NoSQL injection like `{\"$gt\": \"\"}`.",
        "Using `$not` where `$nor` is needed. `$not` works on a single field's operator expression; `$nor` negates whole conditions.",
        "Trap: 'What's the ESR rule?' Equality, Sort, Range: order compound index fields that way.",
      ],
      takeaway: 'Parse to a tree, compile to whitelisted MongoDB operators, filter by tenant first.',
    },

    // ------------------------------------------------------------------ 18
    {
      id: 'production-incident-and-improvements',
      title: 'Fixing a production issue fast, and what you would improve',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'A calm, structured incident story: stop the bleeding, find the cause, fix it, prevent it next time.',
      note:
        "Use a real incident from your work. The steps and the template below are the structure; fill them with your true story and real timings. Your brief mentions fixing critical production issues within 24 hours.",
      what: [
        "Interviewers often ask 'tell me about a production issue you fixed' or 'what would you improve in your project?'. They test how you think under pressure and whether you learn from problems.",
        "A good incident story has five steps: detect, contain (stop the damage), find the root cause, fix, and prevent (so it doesn't happen again).",
      ],
      deeper: [
        "Contain before you fix. A rollback or a feature-flag switch-off at minute 10 is better than a perfect fix at hour 6. Then find the root cause with logs, metrics, and a reproduction. After the fix, add a test that would have caught it, and an alert that would have warned you earlier. That last step is what separates a senior answer from a junior one.",
      ],
      why: "Every system breaks. Companies want people who stay calm, communicate clearly, and leave the system better than before.",
      analogy: "A doctor in an emergency room: first stop the bleeding, then find what caused it, then treat it, then advise how to avoid it next time.",
      code: {
        lang: 'text',
        title: 'STAR template for an incident',
        source: `Situation: What broke, who was affected, how you found out.
  "On <date>, recruiters on <product> couldn't <action>. We saw it from <alerts / support tickets>."

Task: Your responsibility.
  "I was on call / I owned that service, so I had to restore it fast."

Action: Contain -> diagnose -> fix -> prevent.
  "I <rolled back / disabled the flag> to stop the impact. Logs showed <error>.
   The cause was <root cause>. I fixed it by <fix>, added a test for <case>,
   and an alert on <metric>."

Result: Numbers and learning.
  "Service restored in <time>, fix shipped within 24 hours, no recurrence since.
   We also changed <process> so this class of bug is caught in CI."`,
      },
      output: "Spoken out loud, this takes about 90 seconds. It shows you protect users first, debug with evidence, and prevent repeats.",
      questions: [
        {
          q: "Tell me about a production issue you fixed.",
          a: "Use the template with a real story. If you don't have a dramatic one, a small one told well is fine: a failing bulk upload, a slow query that needed an index, a dependency issue after the Node upgrade.",
        },
        {
          q: "How do you debug an issue you can't reproduce locally?",
          a: "'Logs with request ids, metrics around the time it started, what changed recently (deploys, config, traffic), and comparing a failing request with a working one. Then I try to reproduce with production-like data in staging.'",
        },
        {
          q: "What would you improve in your current project?",
          a: "Pick 2 or 3 real, specific items: 'distributed tracing across agents', 'a DLQ dashboard and replay tool', 'contract tests between services', 'SSE instead of polling'. Explain why each matters.",
        },
        {
          q: "Who did you inform during the incident?",
          a: "'I posted updates in the team channel: what's affected, what we're doing, next update time. After the fix I wrote a short blameless post-mortem.' Say what really happened.",
        },
      ],
      answer30:
        "When something breaks in production, I contain it first, by rolling back or switching off the feature flag, so users stop being affected. Then I find the root cause with logs, metrics, and what changed recently, fix it, and add a test and an alert so the same bug can't come back quietly. I keep the team updated during the incident and write a short post-mortem afterwards.",
      mistakes: [
        "Blaming a teammate. Use blameless language: what failed, not who.",
        "Jumping to the fix without containing the damage first.",
        "No result or learning at the end of the story.",
        "Making up an incident. Follow-up questions will expose it quickly.",
      ],
      takeaway: 'Contain, diagnose, fix, prevent, and communicate throughout.',
    },
  ],

  rapidFire: [
    { q: 'What does Octagnt.ai do?', a: 'Agentic AI platform that helps companies shortlist candidates through assessments, voice screening, and one-sided interviews.' },
    { q: 'What does Skillkeepr do?', a: 'HR and recruitment SaaS for managing talent and running configurable hiring workflows.' },
    { q: 'How is tenant isolation enforced?', a: 'tenantId comes from the verified JWT, a repository layer adds it to every query, aggregations start with a tenant $match, cross-tenant access returns 404.' },
    { q: 'Where do tokens live?', a: 'In httpOnly cookies: short access token, longer refresh token. SameSite and CSRF protection added.' },
    { q: 'How does token renewal work?', a: 'On 401 the client calls /auth/refresh once (shared promise for parallel requests), then retries the original request.' },
    { q: 'RBAC size?', a: '4 roles across 8 permission modules, checked in middleware before controllers.' },
    { q: 'How do candidate videos upload?', a: 'Scoped candidate token, server-built S3 key, short-lived presigned URL, browser uploads straight to S3.' },
    { q: 'What does the gateway do?', a: 'One entry point with path-based routing to 35+ agents; handles auth, timeouts, logging.' },
    { q: 'Why save each pipeline step?', a: 'So a failure resumes from that step instead of redoing earlier expensive AI calls.' },
    { q: 'Why SQS for bulk upload?', a: 'Moves slow work off the request path, gives retries, scales workers separately, user gets 202 + batch id.' },
    { q: 'How are duplicate SQS messages handled?', a: "Workers claim items atomically (status 'queued' -> 'processing'), so a duplicate finds nothing to claim." },
    { q: 'What is a DLQ?', a: 'Dead-letter queue: where messages go after failing too many times, for inspection without blocking the rest.' },
    { q: 'How does ATS sync avoid duplicates?', a: 'Unique index on tenantId + source + externalId, upsert, fallback match on normalized email.' },
    { q: 'What is a gate in the decision engine?', a: 'A must-pass rule on one dimension, regardless of the weighted total.' },
    { q: 'Why LocalStack?', a: 'Fake S3 and SQS locally in Docker for cloud parity without real AWS cost or risk.' },
    { q: 'How are audit logs non-blocking?', a: 'Captured on response finish, buffered in memory, bulk-inserted every few seconds to a dedicated DB.' },
    { q: 'What is redacted in audit logs?', a: 'Passwords, tokens, auth headers, OTPs, and personal identifiers before storing.' },
    { q: 'How did you migrate to TypeScript safely?', a: 'allowJs, shared types first, one module per PR, no behaviour changes, tighten strict flags gradually.' },
    { q: 'Which Node upgrade is on your resume?', a: 'v18 to v20 across services.' },
    { q: 'Deploy vs release?', a: 'Deploy puts code on servers; release shows it to users. Feature flags separate them.' },
    { q: 'Regression bug reduction from tests?', a: 'About 30% fewer regression bugs after adding Jest coverage across backend modules.' },
    { q: 'Incident steps?', a: 'Detect, contain, root cause, fix, prevent (test + alert), communicate.' },
  ],
};

export default projects;
