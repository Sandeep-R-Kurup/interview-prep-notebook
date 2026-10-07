// Architecture stack. Topics are auto-sorted Basic -> Intermediate -> Advanced by the registry.

const architecture = {
  name: 'Architecture',
  intro: 'System design concepts and six full walkthroughs. Learn the building blocks first, then practise saying a design out loud in 30 to 45 minutes, trade-offs included.',
  topics: [
    {
      id: 'system-design-framework',
      title: 'How to approach a system design interview',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'A fixed order of steps: requirements, estimates, API, data model, high-level design, deep dives, trade-offs.',
      what: [
        "A system design interview is a 45 to 60 minute conversation where you design something like a URL shortener or a chat app. There is no single right answer. The interviewer is watching how you think: do you ask questions, make sensible choices, and explain trade-offs?",
        "Use the same seven steps every time: (1) clarify requirements, (2) rough estimates, (3) API, (4) data model, (5) high-level design (boxes and arrows), (6) deep dives into the hard parts, (7) trade-offs, bottlenecks and what you would do next.",
      ],
      deeper: [
        "**Requirements** come in two kinds. Functional: what the system does ('users can shorten a URL and get redirected'). Non-functional: how well it does it (latency, availability, consistency, scale, cost). Write both on the board and agree on what is out of scope.",
        "**Estimates** are back-of-the-envelope, not exact. Useful numbers: 1 day is about 86,400 seconds (round to 100k), so 1 million requests a day is about 12 per second on average; peak is often 2 to 10 times the average. Estimate storage per year (rows x bytes x 365) and say whether it fits on one machine. The point is to decide if you need caching, sharding or queues, not to get the arithmetic perfect.",
        "**Deep dives** are where you earn the grade. Pick the one or two hardest parts (the hot read path, the consistency problem, the failure case) and go deep. Mention monitoring and failure handling without being asked.",
        "For a 3-year engineer, interviewers expect a working, sensible design with clear reasoning. They do not expect you to know Google-scale internals. Saying 'I would start simple with one Postgres or MongoDB cluster, and here is when I would shard' is a strong answer.",
      ],
      why: "Without a structure, people jump straight to drawing Kafka and Redis, miss the actual requirement, and run out of time. The framework keeps you calm, covers what the interviewer scores, and gives them natural places to steer you.",
      analogy: "An architect designing a house asks how many people will live there and what the budget is before drawing rooms. Requirements and estimates are that first conversation; the floor plan comes after.",
      code: {
        lang: 'text',
        title: 'A 45-minute plan you can write in the corner of the whiteboard',
        source: `0-5 min    REQUIREMENTS
           Functional: what must it do? (3-5 bullets)
           Non-functional: users, read/write ratio, latency, availability vs consistency
           Out of scope: say it out loud

5-10 min   ESTIMATES (rough)
           1M req/day ~ 12 req/s avg, peak x5 ~ 60 req/s
           storage = items/day x bytes x 365 x years

10-15 min  API             POST /urls  { longUrl } -> { code }
           DATA MODEL      tables / collections, keys, indexes

15-30 min  HIGH-LEVEL DESIGN
           client -> LB -> stateless API -> cache -> DB
                                      \\-> queue -> workers

30-40 min  DEEP DIVES (pick 1-2 hard parts)
           hot keys, consistency, failure handling, scaling the DB

40-45 min  TRADE-OFFS + NEXT STEPS
           bottlenecks, monitoring, what changes at 10x`,
      },
      output: "Following this plan, you have agreed the scope in the first five minutes, have numbers that justify each component, and leave time for the deep dives where most of the marks are. The interviewer sees a clear thinker, not someone listing technologies.",
      questions: [
        { q: 'What should you do in the first five minutes of a system design interview?', a: "Clarify requirements. Ask who the users are, what the core features are, the expected scale, the read/write ratio, and whether consistency or availability matters more. Write the functional and non-functional requirements down and agree what is out of scope." },
        { q: 'Why do back-of-the-envelope estimates matter?', a: "They decide the design. 12 requests per second fits on one server; 50,000 needs caching, horizontal scaling and maybe sharding. Rough numbers like '1 million a day is about 12 per second' are enough." },
        { q: 'What is the difference between functional and non-functional requirements?', a: "Functional requirements say what the system does, like 'send a message'. Non-functional requirements say how well it does it: latency, availability, durability, consistency, security and cost." },
        { q: 'How do you handle a design question you have never seen before?', a: "Use the same framework. Clarify, estimate, define the API and data, draw a simple version that works, then improve the bottleneck. Most systems are a mix of the same blocks: load balancer, stateless services, cache, database, queue, workers and object storage." },
      ],
      answer30: "I follow a fixed order. First I clarify functional and non-functional requirements and what's out of scope. Then rough estimates, like requests per second and storage per year, so the numbers justify my choices. Then the API and data model, then a simple high-level design: load balancer, stateless services, cache, database, queue. I spend most of the time on deep dives into the one or two hardest parts, and I finish with trade-offs, bottlenecks and what I'd change at 10x scale.",
      mistakes: [
        "Drawing boxes before asking a single question. You may design the wrong system.",
        "Adding Kafka, Redis, Kubernetes and microservices for 100 users. Over-engineering is marked down as much as under-engineering.",
        "Staying silent while thinking. Talk through your reasoning so the interviewer can follow and help.",
        "Trap: 'Is your design perfect?' No design is. Name its weak points yourself (single region, hot partitions, eventual consistency) and say how you would fix them.",
      ],
      takeaway: 'Requirements, estimates, API, data, boxes, deep dives, trade-offs: same order every time, and talk while you go.',
    },

    {
      id: 'monolith-vs-microservices',
      title: 'Monolith vs microservices',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'One deployable app vs many small services; microservices buy independent scaling and deploys at the cost of network and operational complexity.',
      what: [
        "A monolith is one application, deployed as one unit, usually with one database. All features (users, billing, interviews) live in one codebase and call each other as normal function calls.",
        "Microservices split the system into small services that each own one business area and its own data. They talk over the network, by HTTP/gRPC calls or by events on a queue, and each can be deployed and scaled on its own.",
      ],
      deeper: [
        "**Monolith pros:** simple to build, test, debug and deploy; function calls are fast and can share one database transaction. **Cons:** one big deploy, one slow module can affect all, and the whole thing scales as one block. Big teams step on each other.",
        "**Microservices pros:** teams deploy independently, each service scales separately (scale the video processor without scaling login), a crash in one service doesn't have to take down the others, and each can pick its own tech. **Cons:** network calls fail and add latency, no cross-service transactions (you need sagas and eventual consistency), harder debugging (you need distributed tracing), and much more infrastructure.",
        "A **modular monolith** is the common middle ground: one deployable, but strict module boundaries inside (separate folders, no reaching into another module's tables). It lets you split a module out later when there's a real reason, like very different scaling needs or a separate team.",
        "Rule of thumb you can say: start with a modular monolith, and extract a service when a module has a clear boundary and a real need to scale, deploy, or fail independently.",
      ],
      why: "Interviewers ask this to see if you choose architecture from needs, not hype. Many teams split too early and spend their time on network failures and deploy pipelines instead of features.",
      analogy: "A monolith is one big restaurant kitchen: everyone shares the space, communication is shouting across the room. Microservices are a food court: each stall has its own kitchen and staff, can open late or hire more cooks alone, but orders across stalls need coordination.",
      code: {
        lang: 'text',
        title: 'Same features, two shapes',
        source: `MONOLITH (one deploy, one DB)
  [ API app: auth | jobs | candidates | interviews | billing ] --> [ MongoDB ]
  candidates.score() calls interviews.getResult() as a function call

MICROSERVICES (many deploys, DB per service)
  client -> API gateway
              |-> auth-service        -> users DB
              |-> candidate-service   -> candidates DB
              |-> interview-service   -> interviews DB
              |-> billing-service     -> billing DB
  interview-service publishes "InterviewCompleted" -> queue -> candidate-service updates score

MODULAR MONOLITH (one deploy, strict internal boundaries)
  src/modules/candidates/{routes,service,repo}
  src/modules/interviews/{routes,service,repo}
  rule: modules talk through each other's service interface, never each other's tables`,
      },
      output: "In the monolith, scoring a candidate is one function call and one DB transaction. In microservices, the same flow becomes an event on a queue, handled later by another service, so the score is eventually consistent but the services are decoupled and scale separately.",
      questions: [
        { q: 'When would you choose microservices over a monolith?', a: "When parts of the system have clearly different scaling or deploy needs, separate teams own them, and the boundaries are stable. For a small team or a new product, a modular monolith is usually faster and safer." },
        { q: 'What is a modular monolith?', a: "One deployable application with strict internal module boundaries: each module has its own routes, service and data access, and other modules call it only through its public interface. It keeps deploys simple and makes later extraction into a service easy." },
        { q: 'How do you handle a transaction that spans two microservices?', a: "You can't use one DB transaction, so you use a saga: a sequence of local transactions, each publishing an event, with compensating actions to undo earlier steps if a later one fails. The result is eventually consistent." },
        { q: 'What new problems do microservices introduce?', a: "Network failures and latency, data consistency across services, distributed debugging (needs tracing), versioning of APIs between services, and much more deployment and monitoring infrastructure." },
      ],
      answer30: "A monolith is one deployable app, usually with one database; microservices are small services that each own a business area and its data and talk over the network. Microservices give independent deploys and scaling and fault isolation, but cost you network failures, no cross-service transactions, and harder debugging. I'd start with a modular monolith with strict boundaries, and pull a module out only when it has a real reason, like very different scaling needs.",
      mistakes: [
        "Sharing one database between microservices. That couples them again and you get the costs of both styles.",
        "Splitting by technical layer (a 'database service', a 'validation service') instead of by business capability.",
        "Chains of synchronous calls (A calls B calls C calls D). One slow service makes all of them slow; use events where you can.",
        "Trap: 'Is microservices always more scalable?' No. A stateless monolith behind a load balancer scales horizontally fine. Microservices help you scale parts independently and scale teams.",
        "On your resume: Octagnt keeps a core API but runs 35+ AI agents behind a gateway. That's a good real example of splitting only where scaling and deploys differ.",
      ],
      takeaway: 'Start with a modular monolith; split a service out when it has a real reason to scale, deploy, or fail on its own.',
    },

    {
      id: 'scalability-basics',
      title: 'Scalability: vertical, horizontal, and stateless services',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Vertical = a bigger machine; horizontal = more machines. Horizontal needs stateless services that keep state in shared stores.',
      what: [
        "Scalability is how well a system handles more load. **Vertical scaling** (scale up) means giving one server more CPU and RAM. **Horizontal scaling** (scale out) means adding more servers and splitting traffic between them.",
        "To scale horizontally, servers must be **stateless**: any server can handle any request because nothing important lives in one server's memory. Sessions, uploads and caches live in shared places like Redis, the database, or S3.",
      ],
      deeper: [
        "Vertical scaling is simple (no code changes) but has a ceiling, gets expensive at the top end, and leaves one machine as a single point of failure. Horizontal scaling has no hard ceiling and gives redundancy, but needs a load balancer and stateless design.",
        "Things that make a Node service stateful by accident: in-memory sessions (`express-session` with the default MemoryStore), files written to local disk, in-process caches that must be consistent, WebSocket connections, and cron jobs that would run once per instance. Fixes: JWT or Redis-backed sessions, S3 for files, Redis for shared cache, a pub/sub layer for sockets, and a single scheduler or a distributed lock for jobs.",
        "In Node specifically, one process uses one main thread, so on a multi-core box you run several processes (Node `cluster`, PM2, or one container per core). That's already horizontal scaling on one machine.",
        "The database is usually the hardest part to scale horizontally. Stateless app servers just push the problem down, which is why caching, read replicas and sharding come next.",
      ],
      why: "Traffic grows and spikes. A stateless design lets you add servers in minutes (or let autoscaling do it) and survive a server dying without losing users' sessions.",
      analogy: "Vertical scaling is hiring one superhuman chef. Horizontal scaling is hiring more normal chefs. That only works if recipes and orders are on a shared board (stateless), not in one chef's head.",
      code: {
        lang: 'js',
        title: 'Stateful by accident vs stateless',
        source: `// STATEFUL: breaks with 2+ instances behind a load balancer
const sessions = {};                       // lives in this process only
app.post('/login', (req, res) => {
  sessions[req.body.userId] = { loggedIn: true };
});
app.post('/upload', upload.single('cv'), (req, res) => {
  fs.writeFileSync('/tmp/' + req.file.originalname, req.file.buffer); // local disk
});

// STATELESS: any instance can serve any request
app.post('/login', async (req, res) => {
  const token = signJwt({ sub: user.id, tenantId: user.tenantId }); // state in the token
  res.cookie('access', token, { httpOnly: true, secure: true, sameSite: 'lax' });
});
app.post('/upload', async (req, res) => {
  const url = await presignS3Put(\`\${req.tenantId}/cvs/\${randomUUID()}.pdf\`); // state in S3
  res.json({ uploadUrl: url });
});`,
      },
      output: "With the stateful version, a user who logs in on instance A and whose next request lands on instance B looks logged out, and uploaded files exist on only one machine. With the stateless version, any instance can serve every request, so you can add or remove instances freely.",
      questions: [
        { q: 'Vertical vs horizontal scaling?', a: "Vertical means a bigger machine: easy but limited and still a single point of failure. Horizontal means more machines behind a load balancer: no hard ceiling and better availability, but it needs stateless services." },
        { q: 'What does stateless mean for an API server?', a: "The server keeps no client data in its own memory or disk between requests. Each request carries what it needs (like a JWT), and shared state lives in a database, Redis or S3, so any instance can handle any request." },
        { q: 'What are sticky sessions and why avoid them?', a: "The load balancer always sends a user to the same server, so in-memory state works. It causes uneven load, and users lose their session if that server dies. Making the service stateless is better." },
        { q: 'How do you use all CPU cores in Node.js?', a: "Run several Node processes, one per core, using the `cluster` module, PM2, or several containers. Each process has its own event loop, and a load balancer or the OS spreads connections across them." },
      ],
      answer30: "Vertical scaling means a bigger machine; it's simple but has a ceiling and is a single point of failure. Horizontal scaling means more machines behind a load balancer, which needs stateless services: no sessions or files in one server's memory or disk. I keep auth in JWTs or Redis, files in S3, shared cache in Redis, so any instance can serve any request and autoscaling can add or remove instances safely. After that, the database is usually the next bottleneck.",
      mistakes: [
        "Using in-memory sessions or local file storage and then adding a second instance.",
        "Running a cron job inside every API instance, so it fires N times.",
        "Thinking stateless app servers solve everything. The database then becomes the bottleneck.",
        "Trap: 'Is a JWT-based app fully stateless?' Mostly, but logout and revocation need some shared state, like a deny-list or short-lived tokens plus refresh tokens stored server-side.",
      ],
      takeaway: 'Scale out with stateless services; push state into shared stores, then deal with the database.',
    },

    {
      id: 'load-balancing',
      title: 'Load balancing',
      level: 'basic',
      priority: 'must',
      frequency: 'common',
      summary: 'A load balancer spreads requests across healthy servers using an algorithm like round robin or least connections.',
      what: [
        "A load balancer sits in front of several servers and decides which one handles each request. It spreads the load, and it stops sending traffic to servers that fail health checks.",
        "Common algorithms: **round robin** (take turns), **least connections** (pick the least busy), **weighted** (bigger servers get more), and **hash-based** (the same client or key always goes to the same server).",
      ],
      deeper: [
        "**Layer 4 vs layer 7.** An L4 balancer routes by IP and port and doesn't look inside the request; it's very fast (AWS Network Load Balancer). An L7 balancer understands HTTP: it can route by path or host (`/api` to one group, `/agents` to another), terminate TLS, and add headers (AWS Application Load Balancer, Nginx, Envoy).",
        "**Health checks:** the balancer calls something like `GET /health` every few seconds and removes servers that fail. Keep health checks cheap, and decide whether they should check dependencies (a DB outage would then mark every server unhealthy at once).",
        "**Avoiding a single point of failure:** managed balancers (ALB) are already redundant across availability zones. Above them, DNS and global routing (Route 53, a CDN) spread traffic across regions.",
        "**Graceful shutdown:** when a server is removed (deploy, scale-in), it should stop accepting new connections, finish in-flight requests, then exit. In Node, handle `SIGTERM`, call `server.close()`, and close DB connections.",
      ],
      why: "One server can't handle unlimited traffic and will eventually fail. A load balancer turns many servers into one reliable address and makes rolling deploys and autoscaling possible.",
      analogy: "A host at a busy restaurant seating guests: they spread people across waiters, skip the waiter on a break (failed health check), and give the big tables to the most experienced waiter (weighted).",
      code: {
        lang: 'js',
        title: 'Health check and graceful shutdown in Express',
        source: `let shuttingDown = false;

app.get('/health', (req, res) => {
  if (shuttingDown) return res.status(503).send('draining'); // LB stops sending traffic
  res.send('ok');                                           // cheap: no DB call
});

const server = app.listen(3000);

process.on('SIGTERM', () => {           // sent by ECS / Kubernetes before stopping
  shuttingDown = true;
  server.close(async () => {            // stop new connections, wait for in-flight ones
    await mongoose.connection.close();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref(); // hard stop if something hangs
});`,
      },
      output: "During a deploy, the old instance gets SIGTERM, starts failing its health check so the load balancer drains it, finishes the requests it already has, closes the DB connection and exits. Users see no errors.",
      questions: [
        { q: 'Round robin vs least connections?', a: "Round robin sends requests to servers in turn, which is fine when requests cost about the same. Least connections sends each request to the server with the fewest open connections, which works better when some requests are long or slow." },
        { q: 'What is the difference between an L4 and L7 load balancer?', a: "L4 routes by IP and port without reading the request, so it's very fast. L7 reads HTTP, so it can route by path, host or header, terminate TLS, and do things like rate limiting. AWS NLB is L4, ALB is L7." },
        { q: 'Why do health checks matter?', a: "They let the load balancer stop sending traffic to a server that is down or still starting. Without them, a crashed instance would keep receiving and failing a share of requests." },
        { q: 'How do you deploy without dropping requests?', a: "Rolling deploys behind the load balancer plus graceful shutdown: on SIGTERM, fail the health check, stop accepting new connections, finish in-flight requests, close resources, then exit." },
      ],
      answer30: "A load balancer spreads requests across a pool of servers and removes unhealthy ones using health checks. Algorithms include round robin, least connections, weighted, and hash-based for affinity. L4 balancers route by IP and port and are very fast; L7 balancers understand HTTP, so they can route by path, terminate TLS, and add headers. With graceful shutdown on SIGTERM, it also lets me do rolling deploys with zero downtime.",
      mistakes: [
        "Health checks that call the database, so one DB blip marks every instance unhealthy and takes the whole site down.",
        "No graceful shutdown, so every deploy cuts off in-flight requests.",
        "Forgetting WebSockets: long-lived connections pile up on old instances; least connections or reconnect logic helps.",
        "Trap: 'Isn't the load balancer itself a single point of failure?' Managed ones are run redundantly across zones; self-hosted ones use a pair with a floating IP, plus DNS across regions.",
      ],
      takeaway: 'Load balancer = one address, many healthy servers; add health checks and graceful shutdown.',
    },

    {
      id: 'caching',
      title: 'Caching layers and cache invalidation',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Keep hot data closer and faster (browser, CDN, Redis); the hard part is keeping it fresh.',
      what: [
        "A cache stores a copy of data somewhere faster so you don't redo slow work. There are layers: the **browser** cache, a **CDN** near the user, an **application cache** like Redis, and the **database's own** buffer cache.",
        "The most common pattern is **cache-aside**: the app checks the cache first; on a miss it reads the database, stores the result in the cache with a TTL (time to live), and returns it.",
      ],
      deeper: [
        "**Write patterns.** Cache-aside (lazy loading): fill on read, delete on write; the default choice. **Write-through:** write to the cache and DB together, so the cache is always fresh but every write is slower. **Write-behind (write-back):** write to the cache and flush to the DB later; fast but you can lose data. **Read-through:** the cache library itself loads from the DB on a miss.",
        "**Invalidation.** On update, write the DB first, then **delete** the cache key (not overwrite it). Deleting avoids races where two writers leave an old value in the cache. Always set a TTL as a safety net so a missed delete only causes stale data for a bounded time.",
        "**Cache stampede (thundering herd):** a hot key expires and thousands of requests hit the DB at once. Fixes: a lock so only one request rebuilds the key, serving the stale value while one request refreshes it, and adding random jitter to TTLs so keys don't all expire together.",
        "**Eviction:** when memory is full, Redis evicts by policy, often LRU (least recently used) or LFU (least frequently used). **What to cache:** data that is read often, changes rarely, and is expensive to compute. In a multi-tenant app, put the tenant id in every key (`tenant:acme:job:j1`) so data never leaks between tenants.",
      ],
      why: "Reads usually far outnumber writes. A cache cuts latency from tens of milliseconds to under a millisecond and protects the database from load it could never handle alone.",
      analogy: "Keeping the spices you use every day on the counter instead of in the basement. Fast to grab, but if you buy a new jar, you have to swap out the old one on the counter too.",
      code: {
        lang: 'js',
        title: 'Cache-aside with TTL and delete-on-write (a Map stands in for Redis)',
        source: `const cache = new Map();
const db = { jobs: { j1: { id: 'j1', title: 'Backend Engineer' } }, reads: 0 };

async function dbFindJob(id) { db.reads++; return structuredClone(db.jobs[id]); }

async function getJob(id, ttlMs = 60_000) {
  const key = 'job:' + id;
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.value;     // 1. cache hit
  const value = await dbFindJob(id);                         // 2. miss: read the DB
  cache.set(key, { value, expires: Date.now() + ttlMs });    // 3. fill the cache
  return value;
}

async function updateJob(id, patch) {
  Object.assign(db.jobs[id], patch);                         // 1. write the DB first
  cache.delete('job:' + id);                                 // 2. then delete (not update) the cache key
}

await getJob('j1'); await getJob('j1'); await getJob('j1');
console.log('DB reads after 3 gets:', db.reads);
await updateJob('j1', { title: 'Senior Backend Engineer' });
console.log((await getJob('j1')).title, '| DB reads:', db.reads);`,
      },
      output: "Prints 'DB reads after 3 gets: 1' because only the first call misses. After the update deletes the key, the next read misses again and prints 'Senior Backend Engineer | DB reads: 2', so the cache never serves the old title.",
      questions: [
        { q: 'What is the cache-aside pattern?', a: "The application checks the cache first. On a miss it reads the database, writes the result into the cache with a TTL, and returns it. On updates it writes the database and deletes the cache key." },
        { q: 'Why delete the cache key on update instead of setting the new value?', a: "Two concurrent writers can finish in a different order in the DB and the cache, leaving an old value cached for a long time. Deleting means the next read loads the current value from the DB." },
        { q: 'What is a cache stampede and how do you prevent it?', a: "When a hot key expires, many requests miss at once and all hit the database. Prevent it with a lock so one request rebuilds the value, by serving stale data while refreshing in the background, and by adding jitter to TTLs." },
        { q: 'Write-through vs write-behind?', a: "Write-through writes to the cache and the database together, so reads are always fresh but writes are slower. Write-behind writes to the cache and flushes to the DB later, so writes are fast but data can be lost if the cache fails." },
        { q: 'Where can you cache in a web app?', a: "In the browser (HTTP cache headers), at a CDN for static and some API responses, in an application cache like Redis, and in the database's own memory. Each layer closer to the user saves more time." },
      ],
      answer30: "Caching keeps a copy of hot data somewhere faster: browser, CDN, Redis. My default is cache-aside: read the cache, on a miss load from the DB and set it with a TTL, and on writes update the DB and delete the key. The hard part is invalidation, so I always set TTLs as a safety net, add jitter, and protect hot keys from stampedes with a lock or stale-while-revalidate. In multi-tenant apps the tenant id goes into every cache key.",
      mistakes: [
        "No TTL at all, so one missed invalidation leaves stale data forever.",
        "Caching per-user or per-tenant data under a shared key and leaking it to other users.",
        "Caching everything. Data that changes constantly or is rarely read just wastes memory and adds bugs.",
        "Trap: 'Cache first or DB first on write?' Write the DB first, then delete the cache. Deleting the cache first lets a reader refill it with the old value before the DB write lands.",
      ],
      takeaway: 'Cache-aside, delete on write, TTL always, and watch for stampedes on hot keys.',
    },

    {
      id: 'cap-consistency',
      title: 'CAP theorem and consistency models',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'During a network partition you must choose consistency or availability; most systems pick a consistency level per operation.',
      what: [
        "CAP says a distributed data system can't guarantee all three of **Consistency** (every read sees the latest write), **Availability** (every request gets a non-error answer) and **Partition tolerance** (it keeps working when the network between nodes breaks) at the same time.",
        "Network partitions will happen, so the real choice is: when nodes can't talk, do you refuse some requests to stay correct (**CP**), or keep answering and risk stale data (**AP**)?",
      ],
      deeper: [
        "**Consistency models**, from strongest to weakest: **strong / linearizable** (reads always see the latest write), **read-your-writes** (you always see your own changes, others may lag), **monotonic reads** (you never see data go back in time), **eventual consistency** (if writes stop, all replicas agree eventually).",
        "**PACELC** extends CAP: if there's a Partition, choose A or C; Else (normal operation), choose Latency or Consistency. This is more useful day to day, because even without failures, waiting for replicas to confirm costs latency.",
        "**MongoDB example:** with a replica set, `writeConcern: 'majority'` waits until most members have the write, and `readConcern: 'majority'` reads only majority-committed data, which is closer to CP. Reading from secondaries (`readPreference: 'secondary'`) is faster and spreads load but can return stale data. During an election there is a short time with no primary, so writes fail briefly. DynamoDB offers eventually consistent reads by default and strongly consistent reads as an option.",
        "**Pick per feature, not per system:** payments, inventory and permissions need strong consistency. Like counts, feeds, analytics and search results can be eventually consistent.",
      ],
      why: "Every design with replicas, caches or multiple services has to decide how stale data may be. Interviewers want to hear you make that call per feature with a reason.",
      analogy: "Two bank branches lose their phone line. They can stop all withdrawals until the line is back (consistent, not available), or keep serving customers and reconcile later, risking an overdraft (available, not consistent).",
      code: {
        lang: 'js',
        title: 'Choosing consistency per operation in MongoDB (Node driver)',
        source: `// Strong-ish: a payment status must not be lost or read stale
await payments.updateOne(
  { _id: paymentId, tenantId },
  { $set: { status: 'paid' } },
  { writeConcern: { w: 'majority' } }            // wait for most replica set members
);
const p = await payments.findOne(
  { _id: paymentId, tenantId },
  { readConcern: { level: 'majority' }, readPreference: 'primary' }
);

// Eventual is fine: a dashboard count can be a few seconds old
const total = await candidates.countDocuments(
  { tenantId },
  { readPreference: 'secondaryPreferred' }       // offload reads to replicas
);`,
      },
      output: "The payment write is acknowledged only after a majority of replicas have it, so it survives a primary failover, and the read comes from the primary. The dashboard count may lag by a moment but takes load off the primary.",
      questions: [
        { q: 'Explain the CAP theorem simply.', a: "When the network between database nodes breaks, a system must choose between consistency (refuse or delay requests so nobody sees stale data) and availability (keep answering, maybe with stale data). You can't have both during a partition." },
        { q: 'What is eventual consistency?', a: "Replicas may disagree for a short time after a write, but if no new writes happen they all converge to the same value. It's fine for things like likes, feeds and analytics, not for balances or permissions." },
        { q: 'Is MongoDB CP or AP?', a: "With default settings and reads from the primary, it behaves like CP: during an election there's briefly no primary and writes fail. If you read from secondaries you trade consistency for availability and lower load. It's configurable per operation with read and write concerns." },
        { q: 'What is read-your-writes consistency?', a: "A guarantee that after you write something, your own later reads see it, even if other users still see the old value. A common fix is to read from the primary for a short time after a user's write." },
      ],
      answer30: "CAP says that during a network partition a distributed store must choose consistency or availability. Since partitions happen, the real question is per feature: payments and permissions need strong consistency, so I use majority writes and primary reads. Feeds, counts and analytics can be eventually consistent, so I can read from replicas or caches. PACELC adds that even without failures, stronger consistency costs latency.",
      mistakes: [
        "Saying 'we chose CA'. In a distributed system you can't opt out of partitions.",
        "Reading from replicas right after a write and showing users their own change missing.",
        "Treating consistency as one global setting instead of a per-operation choice.",
        "Trap: 'Is the C in CAP the same as the C in ACID?' No. ACID's C means the data obeys the rules and constraints; CAP's C means every read sees the latest write.",
      ],
      takeaway: 'Partitions force C or A; pick strong consistency for money and permissions, eventual for the rest.',
    },

    {
      id: 'message-queues-events',
      title: 'Message queues and event-driven architecture',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Put slow or cross-service work on a queue so producers return fast and consumers process it reliably, with retries.',
      what: [
        "A message queue is a buffer between a producer (who sends a job) and a consumer (who processes it). The producer drops a message and returns at once; workers pick messages up when they are ready.",
        "In event-driven architecture, services publish **events** ('CandidateUploaded') instead of calling each other directly. Any number of other services can react, and the publisher doesn't need to know about them.",
      ],
      deeper: [
        "**Queue vs pub/sub vs log.** A queue (SQS, RabbitMQ) gives each message to one consumer. Pub/sub (SNS, Redis pub/sub) copies each message to every subscriber. A log (Kafka, Kinesis) keeps an ordered, replayable stream that many consumer groups read at their own pace. SNS fanning out to several SQS queues is the common AWS combo.",
        "**Delivery guarantees.** Most systems give **at-least-once** delivery: a message can arrive twice (e.g. a worker crashes after doing the work but before deleting the message). So consumers must be **idempotent**. 'Exactly-once' is really at-least-once plus deduplication.",
        "**SQS details worth knowing:** a received message becomes invisible for the **visibility timeout**; if the worker doesn't delete it in time, it reappears for another worker. After a set number of failed receives it moves to a **dead-letter queue (DLQ)** for inspection. Standard queues are near-unlimited throughput but unordered with possible duplicates; FIFO queues keep order per message group and deduplicate within a 5-minute window, with lower throughput.",
        "**Outbox pattern:** saving to the DB and publishing an event are two separate systems, so one can fail. Write the event into an `outbox` table in the same DB transaction, and a separate process publishes it. **Backpressure:** queue depth is the signal to autoscale workers.",
      ],
      why: "Queues decouple services, absorb traffic spikes, keep HTTP requests fast, and add retries for free. If a consumer is down, messages wait instead of being lost.",
      analogy: "A restaurant ticket rail. Waiters (producers) pin orders and go back to customers; cooks (consumers) take tickets when free. During a rush the rail fills up, but no order is forgotten, and you can add cooks.",
      code: {
        lang: 'js',
        title: 'SQS producer and idempotent worker (AWS SDK v3, simplified)',
        source: `import { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
const sqs = new SQSClient({});

// Producer: inside the API request, return immediately
export async function enqueueCvParse({ tenantId, batchId, fileKey }) {
  await sqs.send(new SendMessageCommand({
    QueueUrl: process.env.CV_QUEUE_URL,
    MessageBody: JSON.stringify({ tenantId, batchId, fileKey }),
  }));
}

// Consumer: a separate worker process
export async function pollOnce() {
  const { Messages = [] } = await sqs.send(new ReceiveMessageCommand({
    QueueUrl: process.env.CV_QUEUE_URL, MaxNumberOfMessages: 10, WaitTimeSeconds: 20, // long polling
  }));
  for (const m of Messages) {
    const job = JSON.parse(m.Body);
    // Idempotent: the same fileKey processed twice gives the same single result
    const done = await Results.findOne({ tenantId: job.tenantId, fileKey: job.fileKey });
    if (!done) await parseAndSave(job);
    await sqs.send(new DeleteMessageCommand({ QueueUrl: process.env.CV_QUEUE_URL, ReceiptHandle: m.ReceiptHandle }));
    // If we crash before this delete, the message reappears after the visibility timeout
  }
}`,
      },
      output: "The API responds in milliseconds after enqueueing. Workers process files in the background; a crashed worker's message reappears and is retried, and the idempotency check stops a file from being parsed and saved twice. After repeated failures the message lands in the DLQ.",
      questions: [
        { q: 'Why use a message queue?', a: "To decouple producers from consumers, keep requests fast by moving slow work to the background, absorb traffic spikes, and get retries and durability if a consumer is down." },
        { q: 'What does at-least-once delivery mean for your code?', a: "The same message can be delivered more than once, so the consumer must be idempotent: processing it twice must have the same effect as once, for example by checking a unique key or using an upsert." },
        { q: 'What is a dead-letter queue?', a: "A separate queue where messages go after failing a set number of times. It stops a 'poison' message from being retried forever and lets you inspect, fix and replay it." },
        { q: 'Queue vs pub/sub vs Kafka?', a: "A queue delivers each message to one consumer. Pub/sub copies each message to every subscriber. Kafka is a durable, ordered log that many consumer groups read independently and can replay." },
        { q: 'What is the outbox pattern?', a: "Write the business change and an 'event to publish' row in the same database transaction, then a separate process reads the outbox and publishes. It prevents saving the data but losing the event, or the reverse." },
      ],
      answer30: "A queue sits between a producer and consumers, so the API can return immediately while workers do slow work in the background. It absorbs spikes, adds retries, and lets me scale workers on queue depth. Delivery is usually at-least-once, so consumers must be idempotent, and repeatedly failing messages go to a dead-letter queue. For events that several services care about, I'd use SNS fan-out to SQS or Kafka, and the outbox pattern to publish reliably.",
      mistakes: [
        "Non-idempotent consumers, so a redelivered message charges twice or creates duplicates.",
        "Visibility timeout shorter than processing time, so the same message is processed by two workers at once.",
        "No DLQ, so one bad message blocks or loops forever.",
        "Trap: 'Does SQS FIFO give exactly-once?' It deduplicates sends within a 5-minute window and keeps order per group, but your consumer can still see a message again if it fails to delete it. Stay idempotent.",
        "On your resume: the Octagnt bulk upload pipeline (S3 + SQS, background workers, status polling) is exactly this pattern.",
      ],
      takeaway: 'Queue the slow work, make consumers idempotent, and always have a DLQ.',
    },

    {
      id: 'resilience-patterns',
      title: 'Idempotency, retries, exponential backoff, and circuit breakers',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Retry transient failures with backoff and jitter, make retries safe with idempotency keys, and stop calling dead services with a circuit breaker.',
      what: [
        "Calls over the network fail. **Retries** try again for temporary errors (timeouts, 503). **Exponential backoff** waits longer each time (100 ms, 200 ms, 400 ms...) and **jitter** adds randomness so many clients don't retry in sync.",
        "Retries are only safe if the operation is **idempotent**: doing it twice has the same effect as once. An **idempotency key** sent by the client makes even 'create payment' safe to retry. A **circuit breaker** stops calling a service that keeps failing, so you fail fast instead of piling up waiting requests.",
      ],
      deeper: [
        "**What to retry:** network errors, timeouts, 429 and 5xx. **What not to retry:** 400, 401, 403, 404, validation errors; they will fail again. Cap the number of attempts, cap the delay, and respect a `Retry-After` header.",
        "**Retry storms:** if every layer retries 3 times, one failing call deep in the stack can become 27 or more calls. Retry at one layer only, usually the outermost or the one closest to the failure.",
        "**Idempotency keys:** the client generates a unique key per logical operation and sends it on every retry. The server stores the key with the result (unique index) and returns the saved result on repeats. Stripe's API works this way. GET, PUT and DELETE are idempotent by HTTP definition; POST is not unless you add a key.",
        "**Circuit breaker states:** CLOSED (normal), OPEN (fail fast without calling, after N failures), HALF_OPEN (after a cool-down, let one trial call through; success closes it, failure reopens it). Pair with **timeouts** on every outbound call and a **fallback** (cached data, a default, or a clear error). In Node, the `opossum` library implements this.",
      ],
      why: "Without these, a single slow dependency can exhaust your connections and take down your whole service (a cascading failure), and naive retries can double-charge customers.",
      analogy: "Calling a friend who doesn't pick up: you wait a bit longer between each try (backoff). After five tries you stop for an hour (circuit open). And you say 'about the dinner booking, ref 42' so they don't book twice (idempotency key).",
      code: {
        lang: 'js',
        title: 'Retry with backoff and jitter, plus a minimal circuit breaker',
        source: `const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function withRetry(fn, { retries = 4, baseMs = 100, capMs = 2000 } = {}) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn(attempt);
    } catch (err) {
      if (attempt >= retries || !err.retryable) throw err;   // give up, or don't retry 4xx
      const backoff = Math.min(capMs, baseMs * 2 ** attempt); // 100, 200, 400, 800...
      const wait = Math.random() * backoff;                   // "full jitter"
      console.log(\`attempt \${attempt + 1} failed, retrying (max wait \${backoff} ms)\`);
      await sleep(wait);
    }
  }
}

class CircuitBreaker {
  constructor(fn, { failureThreshold = 3, resetMs = 1000 } = {}) {
    Object.assign(this, { fn, failureThreshold, resetMs, failures: 0, state: 'CLOSED', openedAt: 0 });
  }
  async call(...args) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.openedAt < this.resetMs) throw new Error('circuit open: failing fast');
      this.state = 'HALF_OPEN';                     // let one trial request through
    }
    try {
      const result = await this.fn(...args);
      this.failures = 0; this.state = 'CLOSED';
      return result;
    } catch (err) {
      this.failures++;
      if (this.state === 'HALF_OPEN' || this.failures >= this.failureThreshold) {
        this.state = 'OPEN'; this.openedAt = Date.now();
      }
      throw err;
    }
  }
}

// Demo 1: a flaky call that succeeds on the third attempt
const flaky = async (attempt) => {
  if (attempt < 2) throw Object.assign(new Error('503'), { retryable: true });
  return 'ok on attempt ' + (attempt + 1);
};
console.log(await withRetry(flaky));

// Demo 2: a dead dependency trips the breaker
const breaker = new CircuitBreaker(async () => { throw new Error('timeout'); }, { failureThreshold: 3 });
for (let i = 1; i <= 5; i++) {
  try { await breaker.call(); } catch (e) { console.log(i, breaker.state, e.message); }
}`,
      },
      output: "Demo 1 logs 'attempt 1 failed, retrying (max wait 100 ms)', 'attempt 2 failed, retrying (max wait 200 ms)', then 'ok on attempt 3'. Demo 2 logs '1 CLOSED timeout', '2 CLOSED timeout', '3 OPEN timeout', then '4 OPEN circuit open: failing fast' and '5 OPEN circuit open: failing fast': after three failures the breaker stops calling the dead service.",
      questions: [
        { q: 'Why add jitter to exponential backoff?', a: "Without jitter, all clients that failed at the same moment retry at the same moments too, hitting the recovering service in synchronized waves. Random jitter spreads the retries out." },
        { q: 'What is idempotency and why does it matter for retries?', a: "An operation is idempotent if doing it several times has the same effect as doing it once. Retries and at-least-once queues will repeat requests, so non-idempotent operations like 'charge card' need an idempotency key to avoid duplicates." },
        { q: 'How does an idempotency key work?', a: "The client creates a unique key per logical action and sends it with every retry. The server stores the key and the result under a unique index; if the key is seen again, it returns the stored result instead of doing the work again." },
        { q: 'Explain the three states of a circuit breaker.', a: "Closed: calls go through and failures are counted. Open: after too many failures, calls fail immediately without hitting the service. Half-open: after a cool-down, one trial call is allowed; success closes the breaker, failure opens it again." },
        { q: 'Which errors should you retry?', a: "Transient ones: network errors, timeouts, 429 Too Many Requests and 5xx. Not client errors like 400, 401, 403 or 404, because they will fail the same way again." },
      ],
      answer30: "Network calls fail, so I put a timeout on every outbound call and retry only transient errors, with exponential backoff, jitter, and a cap on attempts. Retries are only safe if the operation is idempotent, so for creates and payments the client sends an idempotency key that the server stores with the result. And if a dependency keeps failing, a circuit breaker opens and fails fast, then lets a trial call through after a cool-down, which stops one bad service from taking down everything.",
      mistakes: [
        "Retrying POST requests without an idempotency key and creating duplicate orders.",
        "Retrying at every layer, multiplying load on a service that is already struggling.",
        "No timeout on outbound calls. A hung dependency then holds sockets and memory until the process falls over.",
        "Trap: 'Is PUT idempotent? Is PATCH?' PUT is by definition (same full replacement each time). PATCH may or may not be: 'set name to X' is, 'increment count' is not.",
      ],
      takeaway: 'Timeout everything, retry transient errors with backoff and jitter, make writes idempotent, and break the circuit on a dead dependency.',
    },

    {
      id: 'database-scaling',
      title: 'Database scaling: replication, sharding, and partitioning',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Replicas scale reads and add failover; sharding splits data across machines to scale writes; partitioning splits a big table.',
      what: [
        "**Replication** keeps copies of the same data on several servers. One primary takes writes; replicas copy it and can serve reads. If the primary dies, a replica is promoted.",
        "**Sharding** splits the data itself across servers: tenants A to M on one shard, N to Z on another. Each shard holds part of the data, so writes and storage scale too. **Partitioning** is the same idea inside one database: one huge table split into smaller pieces, often by date.",
      ],
      deeper: [
        "**Order of steps you can say in an interview:** fix queries and add the right indexes first, then cache, then add read replicas, then scale vertically, and only then shard. Sharding adds a lot of complexity, so it comes last.",
        "**Replication lag:** replicas are a little behind, so reading from them right after a write can show old data. Send reads that must be fresh to the primary.",
        "**Choosing a shard key** is the key decision. It should spread data and traffic evenly (high cardinality), and most queries should include it so they hit one shard. Bad keys cause **hot shards** (e.g. sharding by date sends all of today's writes to one shard). For a multi-tenant SaaS, `tenantId` (often combined with another field) is the natural key, but one huge tenant can still become a hotspot.",
        "**Range vs hash sharding.** Range (by id or date ranges) keeps related data together and makes range queries cheap but can create hotspots. Hash sharding spreads evenly but range queries hit every shard. **Consistent hashing** places shards on a ring so adding a shard moves only about 1/N of the keys instead of nearly all of them with `hash % N`. MongoDB supports both ranged and hashed shard keys and moves chunks between shards for you.",
        "**Costs of sharding:** cross-shard queries and joins are slow (scatter-gather), cross-shard transactions are hard, and changing the shard key later is painful.",
      ],
      why: "One database server eventually runs out of CPU, memory, disk or write throughput. Interviewers want to hear that you reach for the simple fixes first and understand what sharding costs.",
      analogy: "A library. Replication is buying extra copies of popular books so more people can read at once. Sharding is splitting the collection across several buildings by subject: each building is smaller, but you need to know which building to go to.",
      code: {
        lang: 'js',
        title: 'Why consistent hashing: how many keys move when you add a 5th shard?',
        source: `import { createHash } from 'node:crypto';

const hash = (s) => createHash('md5').update(s).digest().readUInt32BE(0);

// 1. Naive: shard = hash(key) % N
const modShard = (key, n) => hash(key) % n;

// 2. Consistent hashing: nodes sit on a ring (with virtual nodes); a key goes to the next node clockwise
function makeRing(nodes, vnodes = 100) {
  const ring = [];
  for (const node of nodes)
    for (let v = 0; v < vnodes; v++) ring.push({ point: hash(node + '#' + v), node });
  ring.sort((a, b) => a.point - b.point);
  return (key) => {
    const h = hash(key);
    const hit = ring.find((r) => r.point >= h) ?? ring[0]; // wrap around the ring
    return hit.node;
  };
}

const keys = Array.from({ length: 10000 }, (_, i) => 'tenant-' + i);

const movedMod = keys.filter((k) => modShard(k, 4) !== modShard(k, 5)).length;
const ring4 = makeRing(['db1', 'db2', 'db3', 'db4']);
const ring5 = makeRing(['db1', 'db2', 'db3', 'db4', 'db5']);
const movedRing = keys.filter((k) => ring4(k) !== ring5(k)).length;

console.log('hash % N, 4 -> 5 shards, keys moved:', (movedMod / 100).toFixed(0) + '%');
console.log('consistent hashing, 4 -> 5 shards, keys moved:', (movedRing / 100).toFixed(0) + '%');`,
      },
      output: "Prints 'hash % N, 4 -> 5 shards, keys moved: 80%' and 'consistent hashing, 4 -> 5 shards, keys moved: 20%'. With modulo, almost every key changes shard and must be migrated; with a ring, only about 1/5 of keys move, to the new shard.",
      questions: [
        { q: 'Replication vs sharding?', a: "Replication copies the same data to several servers, which scales reads and gives failover. Sharding splits different data across servers, which scales writes and storage. Big systems use both: each shard is itself a replica set." },
        { q: 'How do you choose a shard key?', a: "Pick a field with many distinct values that spreads writes evenly and that most queries include, so they hit one shard. Avoid monotonically increasing keys like timestamps, which send all new writes to one shard. In multi-tenant apps, tenantId is the usual starting point." },
        { q: 'What would you do before sharding?', a: "Check slow queries and add proper indexes, add caching, add read replicas for read-heavy load, archive old data, and scale the machine up. Sharding comes last because it adds lasting complexity." },
        { q: 'What is replication lag and how does it affect users?', a: "Replicas apply the primary's writes slightly later. A user who saves something and then reads from a replica may not see their change. Read from the primary when freshness matters, such as right after a user's own write." },
        { q: 'What problem does consistent hashing solve?', a: "With hash modulo N, changing the number of shards remaps almost every key. Consistent hashing puts nodes on a ring, so adding or removing a node only moves the keys in its neighbourhood, about 1/N of them." },
      ],
      answer30: "First I'd fix the basics: indexes, query shapes, caching, and maybe a bigger machine. For read-heavy load I'd add read replicas, keeping in mind replication lag. When writes or data size outgrow one primary, I'd shard, and the key decision is the shard key: high cardinality, evenly spread, and present in most queries, like tenantId in a SaaS. Hash or consistent hashing spreads load evenly, range keeps related data together, and cross-shard queries are the cost.",
      mistakes: [
        "Jumping to sharding before adding indexes or a cache.",
        "Sharding on a timestamp or auto-increment id, creating one hot shard for all new writes.",
        "Ignoring replication lag and reading a user's own write from a replica.",
        "Trap: 'What happens to a query without the shard key?' It goes to every shard (scatter-gather), which gets slower as you add shards.",
      ],
      takeaway: 'Indexes, cache, replicas, bigger box, then shard on a key that spreads load and matches your queries.',
    },

    {
      id: 'rate-limiting-algorithms',
      title: 'Rate limiting algorithms: token bucket and sliding window',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Limit how many requests a client can make; token bucket allows bursts, sliding window enforces a smooth limit.',
      what: [
        "Rate limiting caps how many requests a user, API key, IP or tenant can make in a time period, like 100 requests per minute. Extra requests get `429 Too Many Requests`.",
        "The common algorithms are **fixed window**, **sliding window log**, **sliding window counter**, **token bucket** and **leaky bucket**.",
      ],
      deeper: [
        "**Fixed window:** count requests per calendar minute. Simple and cheap, but a client can send 100 at 0:59 and 100 at 1:00, so 200 in two seconds.",
        "**Sliding window log:** store each request's timestamp and count the ones in the last 60 s. Exact, but stores one entry per request. **Sliding window counter:** keep the current and previous window counts and weight the previous one by how much of it overlaps; close to exact with only two numbers.",
        "**Token bucket:** a bucket holds up to N tokens and refills at a steady rate; each request takes one token. It allows short bursts up to N while enforcing the average rate. Used by AWS API Gateway and many APIs. **Leaky bucket:** requests enter a queue that drains at a fixed rate, smoothing output; good for protecting a fragile downstream.",
        "**In production:** with many API instances, the counters must be shared, usually in Redis, using atomic operations (`INCR` + `EXPIRE`, or a Lua script for token bucket) so two instances don't both allow the last request. Return headers like `Retry-After` and `RateLimit-Remaining`. Libraries: `express-rate-limit` with a Redis store, or limits at the API gateway or WAF.",
      ],
      why: "Rate limits protect your service from abuse, runaway scripts and one noisy tenant hogging resources, and they control the cost of expensive calls like LLM requests.",
      analogy: "Token bucket is an arcade card that refills one credit every second, up to a max of three. You can play three games quickly, then you have to wait for credits. Sliding window is a bouncer who counts how many people entered in the last hour, at any moment.",
      code: {
        lang: 'js',
        title: 'Token bucket vs sliding window log on the same requests',
        source: `// Token bucket: capacity 3, refills 1 token per second
class TokenBucket {
  constructor(capacity, refillPerSec, now = Date.now()) {
    this.capacity = capacity;
    this.refillPerSec = refillPerSec;
    this.tokens = capacity;          // start full, so short bursts are allowed
    this.last = now;
  }
  allow(now = Date.now()) {
    const elapsedSec = (now - this.last) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsedSec * this.refillPerSec);
    this.last = now;
    if (this.tokens >= 1) { this.tokens -= 1; return true; }
    return false;
  }
}

// Sliding window log: at most 3 requests in any 1000 ms window
function slidingWindow(limit, windowMs) {
  const log = [];
  return (now) => {
    while (log.length && log[0] <= now - windowMs) log.shift(); // drop old entries
    if (log.length < limit) { log.push(now); return true; }
    return false;
  };
}

const bucket = new TokenBucket(3, 1, 0);
const times = [0, 0, 0, 0, 500, 1000, 1000, 3000];   // fake clock in ms
console.log('bucket :', times.map((t) => (bucket.allow(t) ? 'ok' : '429')).join(' '));

const allow = slidingWindow(3, 1000);
console.log('sliding:', times.map((t) => (allow(t) ? 'ok' : '429')).join(' '));`,
      },
      output: "Prints 'bucket : ok ok ok 429 429 ok 429 ok' and 'sliding: ok ok ok 429 429 ok ok ok'. Both allow the burst of 3 at time 0. At 1000 ms the bucket has refilled only one token, so it allows one request; the sliding window has fully moved past time 0, so it allows a new burst of up to 3.",
      questions: [
        { q: 'Token bucket vs fixed window?', a: "A fixed window counts requests per clock window and can let through double the limit around the window boundary. A token bucket refills tokens at a steady rate and allows bursts up to its capacity, so it enforces a smooth average rate." },
        { q: 'How do you rate limit across many server instances?', a: "Keep the counters in a shared store like Redis and update them atomically, with INCR plus EXPIRE for windows or a Lua script for token bucket, so all instances enforce one limit." },
        { q: 'What should the API return when a client is rate limited?', a: "HTTP 429 Too Many Requests, ideally with a Retry-After header and rate limit headers showing the limit and how many requests remain, so well-behaved clients can back off." },
        { q: 'What do you rate limit by?', a: "Whatever identifies the caller fairly: API key or user id for logged-in traffic, IP for anonymous traffic, and tenant id in a SaaS so one customer can't starve others. Expensive endpoints like login or AI calls get their own stricter limits." },
      ],
      answer30: "Rate limiting caps requests per client per time period and returns 429 with Retry-After when exceeded. Fixed window is simplest but allows bursts at boundaries. Sliding window log or counter is smoother. Token bucket refills at a steady rate and allows short bursts up to the bucket size, which is what most APIs use. Across many instances I keep the counters in Redis with atomic operations, and I limit by API key, user, IP or tenant depending on the endpoint.",
      mistakes: [
        "Keeping counters in each instance's memory, so the real limit is N times the intended one.",
        "Non-atomic read-then-write in Redis, so concurrent requests slip past the limit.",
        "Limiting only by IP. Many users behind one office NAT get blocked, and attackers rotate IPs.",
        "Trap: 'Where do you put the rate limiter?' As early as possible: at the gateway or edge for coarse limits, and in the app for per-tenant or per-feature business limits.",
      ],
      takeaway: 'Token bucket for bursts with a steady average, shared atomic counters in Redis, 429 plus Retry-After.',
    },

    {
      id: 'multi-tenancy-patterns',
      title: 'Multi-tenancy patterns',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Shared database with a tenantId column, schema or database per tenant, or fully separate stacks: a trade-off between cost and isolation.',
      what: [
        "A multi-tenant app serves many customer companies (tenants) from one system. The core rule: one tenant must never see or affect another tenant's data.",
        "Three main patterns: **shared everything** (one database, every row has a `tenantId`), **schema or database per tenant** (same server, separate schemas or databases), and **silo** (a separate stack per tenant).",
      ],
      deeper: [
        "**Shared DB with tenantId (pool model):** cheapest and easiest to run, one migration for all. Risk: a single missing filter leaks data. Defend in depth: take `tenantId` only from the verified token, never from the request body; enforce it in a repository layer or ORM middleware so developers can't forget; start compound indexes with `tenantId`; and test for cross-tenant access. PostgreSQL's row-level security can enforce it inside the DB.",
        "**Database per tenant (bridge model):** stronger isolation, easy per-tenant backup, restore and deletion, and you can move a big tenant to its own hardware. Costs: thousands of connections and migrations to run, and cross-tenant reporting is harder.",
        "**Silo:** separate infrastructure per tenant, for big enterprise or regulated customers who require it. Most expensive. Many SaaS products mix models: pool for small tenants, silo for the largest.",
        "**Noisy neighbour:** one tenant's heavy usage slows everyone. Fixes: per-tenant rate limits and quotas, per-tenant queues or fair scheduling for workers, and moving heavy tenants to dedicated resources. Also scope caches, file paths (`s3://bucket/<tenantId>/...`), logs and metrics by tenant.",
      ],
      why: "SaaS economics depend on sharing infrastructure, but a data leak between customers is one of the worst possible bugs. Interviewers ask how you'd guarantee isolation, not just which pattern you'd pick.",
      analogy: "An apartment building. Shared DB is one big flat with labelled shelves for each family: cheap, but someone might grab the wrong shelf. Database per tenant is separate flats in one building. Silo is separate houses.",
      code: {
        lang: 'ts',
        title: 'Tenant comes from the token; the repository always adds it',
        source: `// Middleware: tenantId is taken from the verified JWT, never from req.body or query
export function tenantContext(req: Request, res: Response, next: NextFunction) {
  const tenantId = req.user?.tenantId;            // set by the auth middleware
  if (!tenantId) return res.status(401).end();
  req.tenantId = tenantId;
  next();
}

// Repository: every query is scoped, so a developer can't forget the filter
export class CandidateRepo {
  constructor(private tenantId: string) {}

  find(filter: Record<string, unknown> = {}) {
    return Candidates.find({ ...filter, tenantId: this.tenantId }); // tenantId wins
  }
  updateOne(id: string, patch: Record<string, unknown>) {
    return Candidates.updateOne({ _id: id, tenantId: this.tenantId }, { $set: patch });
  }
}

// Index that matches the access pattern (MongoDB)
// db.candidates.createIndex({ tenantId: 1, jobId: 1, createdAt: -1 })`,
      },
      output: "Even if a request asks for another tenant's candidate id, the query includes the caller's tenantId, so it finds nothing and the API returns 404. The compound index starting with tenantId keeps each tenant's queries fast.",
      questions: [
        { q: 'What are the main multi-tenancy patterns?', a: "Shared database with a tenantId on every row (cheapest, weakest isolation), schema or database per tenant (stronger isolation, more operations work), and a fully separate stack per tenant (strongest isolation, most expensive). Many products mix them by customer size." },
        { q: 'How do you prevent data leaks in a shared-database model?', a: "Take tenantId only from the verified token, enforce the filter centrally in a repository or ORM plugin, scope caches and file paths by tenant, index on tenantId, and write tests that try cross-tenant access." },
        { q: 'What is the noisy neighbour problem?', a: "One tenant uses so much CPU, DB or queue capacity that other tenants slow down. Fix it with per-tenant rate limits and quotas, fair queuing for background jobs, and dedicated resources for the heaviest tenants." },
        { q: 'When would you give a tenant its own database?', a: "When they need strong isolation for compliance, data residency in a specific region, independent backup and restore, or when they are big enough to cause noisy neighbour problems in the shared database." },
      ],
      answer30: "There are three main models: shared database with tenantId on every row, database or schema per tenant, and a separate stack per tenant. Shared is cheapest but relies on never missing a filter, so I take tenantId only from the verified token and enforce it in the repository layer, with compound indexes starting with tenantId, and tenant-scoped cache keys and S3 paths. For noisy neighbours I use per-tenant rate limits and queues, and the biggest or regulated tenants can move to dedicated resources.",
      mistakes: [
        "Reading tenantId from the request body or a header the client controls.",
        "Scoping database queries but forgetting caches, S3 keys, search indexes or background jobs.",
        "Indexes that don't start with tenantId, so every tenant's query scans other tenants' data.",
        "Trap: 'Isn't a missing filter just a 404 bug?' No, it's a data breach. That's why the filter is enforced centrally and tested, not left to each developer.",
        "On your resume: Octagnt's multi-tenant APIs with tenant isolation on every query, and Skillkeepr as an HR SaaS, both use this pattern.",
      ],
      takeaway: 'Pick the model by cost vs isolation; enforce tenantId centrally from the token, everywhere data lives.',
    },

    {
      id: 'observability',
      title: 'Observability: logs, metrics, and traces',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Logs say what happened, metrics say how much and how often, traces show one request across services.',
      what: [
        "Observability is being able to tell what's wrong inside a system from what it outputs. It rests on three pillars. **Logs:** timestamped records of events ('payment failed for order 42'). **Metrics:** numbers over time (requests per second, error rate, p95 latency). **Traces:** the path and timing of one request as it moves through services.",
      ],
      deeper: [
        "**Structured logs:** write JSON, not free text, so you can search by field (`tenantId`, `requestId`, `level`). Use a fast logger like `pino`. Never log passwords, tokens or personal data; redact them. Attach a **correlation / request id** to every log line and pass it to downstream services in a header.",
        "**Metrics to watch:** the **RED** method for services (Rate, Errors, Duration) and **USE** for resources (Utilization, Saturation, Errors). Track latency as percentiles (p50, p95, p99), not averages, because averages hide slow outliers. Also business metrics like uploads per hour.",
        "**Tracing:** OpenTelemetry is the standard. Each request gets a trace id; each step (HTTP call, DB query, queue message) is a span with a start time and duration. A trace view shows exactly which hop was slow. Backends include Jaeger, AWS X-Ray, Datadog, Grafana Tempo.",
        "**Alerting:** alert on symptoms users feel (error rate, latency against an SLO) rather than every CPU spike, and link alerts to dashboards and runbooks. An **SLO** is a target like '99.9% of requests under 500 ms over 30 days'.",
      ],
      why: "In production you can't attach a debugger. When a customer says 'uploads are slow', good observability lets you find the slow service, the tenant affected and the exact error in minutes instead of hours.",
      analogy: "A car dashboard (metrics) tells you speed and engine temperature, the trip log (logs) records events, and a GPS track (trace) shows the exact route of one journey and where you got stuck in traffic.",
      code: {
        lang: 'js',
        title: 'Request id on every log line with AsyncLocalStorage, plus a tiny latency histogram',
        source: `import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';

const als = new AsyncLocalStorage();

// One structured (JSON) log line; the request id is added automatically
function log(level, msg, fields = {}) {
  const ctx = als.getStore() ?? {};
  console.log(JSON.stringify({ level, msg, requestId: ctx.requestId, tenantId: ctx.tenantId, ...fields }));
}

// What an Express middleware would do: reuse the caller's id or create one
function handleRequest(headers, handler) {
  const requestId = headers['x-request-id'] ?? randomUUID();
  return als.run({ requestId, tenantId: headers['x-tenant'] }, handler);
}

// Metric: a tiny latency histogram (in production: Prometheus / CloudWatch)
const buckets = { '<100ms': 0, '<500ms': 0, '>=500ms': 0 };
const observe = (ms) => buckets[ms < 100 ? '<100ms' : ms < 500 ? '<500ms' : '>=500ms']++;

await handleRequest({ 'x-request-id': 'req-1', 'x-tenant': 'acme' }, async () => {
  const start = performance.now();
  log('info', 'upload started', { files: 3 });
  await new Promise((r) => setTimeout(r, 20));           // pretend to call S3
  log('error', 'agent call failed', { agent: 'cv-parser', status: 503 });
  observe(performance.now() - start);
});
console.log(buckets);`,
      },
      output: "Prints two JSON lines that both carry requestId 'req-1' and tenantId 'acme', even across the await, without passing them as arguments: '{\"level\":\"info\",\"msg\":\"upload started\",...,\"files\":3}' and the error line with agent 'cv-parser'. Then '{ '<100ms': 1, '<500ms': 0, '>=500ms': 0 }' because the request took about 20 ms.",
      questions: [
        { q: 'What are the three pillars of observability?', a: "Logs (detailed records of events), metrics (numeric measurements over time like error rate and latency), and traces (the end-to-end path and timing of one request across services)." },
        { q: 'Why use p95 or p99 latency instead of the average?', a: "Averages hide the slow tail. If 5% of requests take 5 seconds, the average can still look fine, but those users are having a bad time. Percentiles show what the slowest users experience." },
        { q: 'What is a correlation or request id?', a: "A unique id given to each incoming request and attached to every log line and every downstream call. It lets you search all logs and services for everything that happened in that one request." },
        { q: 'What is distributed tracing?', a: "Each request gets a trace id that is passed between services; every operation records a span with timings. A trace viewer then shows the whole request as a timeline, so you can see which service or query was slow. OpenTelemetry is the standard way to instrument it." },
      ],
      answer30: "Observability has three pillars. Structured JSON logs with a request id and tenant id on every line, and sensitive fields redacted. Metrics like rate, errors and p95 or p99 latency, plus business metrics, on dashboards with alerts tied to SLOs. And distributed tracing with OpenTelemetry, so one request's path across services and queues shows where time went. Together they let me go from 'it's slow' to the exact service and query quickly.",
      mistakes: [
        "Free-text logs with no request id, so you can't follow one request.",
        "Logging tokens, passwords or candidate personal data.",
        "Alerting on every CPU spike, so the team learns to ignore alerts.",
        "Trap: 'Logs or metrics for alerting?' Metrics. They're cheap to store and query over time; logs are for digging into the details after an alert fires.",
        "On your resume: Skillkeepr's audit and usage logging service (non-blocking, redacts sensitive data) is a real example of structured logging done carefully.",
      ],
      takeaway: 'Structured logs with request ids, RED metrics with percentiles, and traces across services.',
    },

    {
      id: 'solid-clean-architecture',
      title: 'SOLID and clean architecture in Node.js',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Keep business logic independent of Express and the database by depending on interfaces, so it is easy to test and change.',
      what: [
        "**SOLID** is five design principles: **S**ingle responsibility (one reason to change), **O**pen/closed (extend without editing), **L**iskov substitution (subtypes must work wherever the parent works), **I**nterface segregation (small, focused interfaces), **D**ependency inversion (depend on abstractions, not concrete classes).",
        "**Clean architecture** (also called hexagonal or ports and adapters) puts business rules in the centre. Frameworks, databases and external APIs sit at the edges and plug in through interfaces. Dependencies point inwards: the core never imports Express or Mongoose.",
      ],
      deeper: [
        "A practical Node layering: **routes/controllers** (HTTP only: parse input, call a service, shape the response) -> **services / use cases** (business rules) -> **repositories** (data access) -> database. Plus **adapters** for external systems like S3, SQS, email or AI agents.",
        "**Dependency injection** in Node is usually just passing dependencies into a constructor or factory function. A **composition root** (often `app.ts`) wires real implementations; tests wire fakes. Libraries like `tsyringe` or `awilix` exist but are optional.",
        "**Don't overdo it.** For a small CRUD service, three layers are enough. Interfaces for everything, deep inheritance trees and abstract factories make code harder to read. Apply the principles where change is likely, like swapping an email provider or an AI vendor.",
      ],
      why: "When business logic is mixed into route handlers and Mongoose calls, every change is risky and unit tests need a real database. Clean boundaries make code testable, and let you swap infrastructure without rewriting rules.",
      analogy: "A laptop with USB ports. The laptop (business logic) doesn't care which brand of mouse you plug in, as long as it speaks USB (the interface). You can swap the mouse without opening the laptop.",
      code: {
        lang: 'ts',
        title: 'Use case depends on interfaces; adapters are swapped at the composition root',
        source: `// Domain: plain types and an interface (a "port"). No Express, no Mongo here.
interface Candidate { id: string; tenantId: string; email: string; score?: number }

interface CandidateRepo {
  findById(tenantId: string, id: string): Promise<Candidate | null>;
  save(c: Candidate): Promise<void>;
}

interface Notifier { send(to: string, msg: string): Promise<void> }

// Use case (service): depends on interfaces, not on MongoDB or SES
class ScoreCandidate {
  constructor(private repo: CandidateRepo, private notifier: Notifier) {}

  async run(tenantId: string, id: string, score: number) {
    const c = await this.repo.findById(tenantId, id);
    if (!c) throw new Error('Candidate not found');
    c.score = score;
    await this.repo.save(c);
    if (score >= 70) await this.notifier.send(c.email, 'You are shortlisted');
    return c;
  }
}

// Adapters: swap these without touching ScoreCandidate (Mongo in prod, in-memory in tests)
class InMemoryRepo implements CandidateRepo {
  private rows = new Map<string, Candidate>();
  async findById(t: string, id: string) {
    const c = this.rows.get(id);
    return c && c.tenantId === t ? c : null;
  }
  async save(c: Candidate) { this.rows.set(c.id, c); }
}
const sent: string[] = [];
const fakeNotifier: Notifier = { send: async (to) => { sent.push(to); } };

// Composition root: the only place that knows which adapters are used
const repo = new InMemoryRepo();
await repo.save({ id: 'c1', tenantId: 'acme', email: 'asha@example.com' });
const useCase = new ScoreCandidate(repo, fakeNotifier);
console.log(await useCase.run('acme', 'c1', 82));
console.log('emails sent to:', sent);`,
      },
      output: "Prints '{ id: 'c1', tenantId: 'acme', email: 'asha@example.com', score: 82 }' and 'emails sent to: [ 'asha@example.com' ]'. The use case ran with no database and no email service, because it only knows the interfaces. In production the same class gets a Mongo repository and an SES notifier.",
      questions: [
        { q: 'Explain the Dependency Inversion Principle.', a: "High-level business code should depend on abstractions (interfaces), not on concrete low-level details like a specific database or email client. The concrete implementations are passed in, so they can be swapped or faked in tests." },
        { q: 'How do you structure a Node.js/Express backend?', a: "Routes and controllers handle only HTTP, services hold the business rules, repositories handle data access, and adapters wrap external systems. Dependencies are passed in from one composition root, so services can be unit tested with fakes." },
        { q: 'What is the Single Responsibility Principle?', a: "A module should have one reason to change. A controller that validates input, applies business rules, queries MongoDB and sends email has four reasons to change; splitting them makes each part simpler and testable." },
        { q: 'Can you over-apply SOLID?', a: "Yes. Interfaces for everything and deep abstractions make small services hard to read. Add abstraction where change is likely or testing needs it, like external providers, and keep simple CRUD simple." },
      ],
      answer30: "SOLID is five principles; the ones I use most are single responsibility and dependency inversion. In Node I layer controllers for HTTP, services for business rules, and repositories and adapters for the database and external APIs. Services depend on interfaces and get real implementations injected at a composition root, so I can unit test them with fakes and swap a provider without touching the rules. I keep it pragmatic and don't add abstractions where nothing will change.",
      mistakes: [
        "Business logic inside Express route handlers, so it can't be reused or tested without HTTP.",
        "Services that import Mongoose models directly, so every unit test needs a database.",
        "Adding interfaces, factories and inheritance for code that will never have a second implementation.",
        "Trap: 'Give an example of Liskov substitution being broken.' A `ReadOnlyRepo` that extends `Repo` but throws on `save()`. Code that expects a `Repo` breaks when given it.",
      ],
      takeaway: 'Keep business rules in the centre, depend on interfaces, wire real adapters in one place.',
    },

    {
      id: 'frontend-architecture',
      title: 'Frontend architecture: micro-frontends and state boundaries',
      level: 'intermediate',
      priority: 'good',
      frequency: 'occasional',
      summary: 'Organise a big frontend by feature, keep each kind of state in the right place, and only use micro-frontends when separate teams truly need independent deploys.',
      what: [
        "Frontend architecture is how you organise a large UI so it stays fast to change: folder structure, where state lives, how features talk to each other, and how the app is built and deployed.",
        "**Micro-frontends** split one web app into parts owned and deployed by different teams, combined at runtime (for example the dashboard from one team, billing from another). They are the frontend version of microservices.",
      ],
      deeper: [
        "**State boundaries.** Separate kinds of state: **server state** (data from the API: use TanStack Query, RTK Query or SWR for caching, refetching and deduplication), **global client state** (current user, theme: Context or a small store like Zustand or Redux Toolkit), **local UI state** (open modals, form inputs: `useState`), and **URL state** (filters, page, selected tab: the query string, so it's shareable). Most 'Redux is messy' problems come from putting server data in a global store by hand.",
        "**Feature-based folders:** `features/candidates/{components,hooks,api}` instead of one global `components/` folder. Shared design-system components live in their own package or folder. Features import from each other only through a public `index.ts`.",
        "**Micro-frontend techniques:** Webpack/Rspack Module Federation, single-spa, iframes, or build-time packages. **Costs:** duplicated dependencies and bigger bundles, inconsistent UI, shared state and routing headaches, and harder testing. Worth it for many large independent teams; usually not for a team of five. A monorepo with separate packages often gives most of the benefit.",
        "**Rendering choices** are architecture too: client-side SPA, server-side rendering, static generation, or a mix (for example Next.js App Router with server components).",
      ],
      why: "Large frontends become slow to change when every feature reaches into one global store and one shared folder. Clear boundaries let teams work in parallel and keep bugs local.",
      analogy: "A shopping mall. Each shop (feature or micro-frontend) runs itself, but they share corridors, signage and security (the shell, design system and auth). Shops don't walk into each other's stockrooms.",
      code: {
        lang: 'text',
        title: 'Feature folders and where each kind of state lives',
        source: `src/
  app/                    shell: routing, layout, providers, auth guard
  shared/ui/              design system: Button, Modal, Table
  features/
    candidates/
      api.ts              useCandidates() -> TanStack Query (server state)
      components/         CandidateTable, CandidateFilters
      hooks/              useCandidateFilters() -> reads/writes URL ?status=&page=
      index.ts            public exports only
    interviews/
      ...
  store/session.ts        current user, tenant, role (global client state)

Rules
  server data      -> query cache, not Redux by hand
  filters/pages    -> URL, so links are shareable
  modal open       -> local useState
  cross-feature    -> import from features/x/index.ts only`,
      },
      output: "Each feature can be changed and tested mostly on its own. A recruiter can share a link that reopens the same filtered candidate list, and API data is cached and refetched automatically instead of being copied into a global store.",
      questions: [
        { q: 'What are micro-frontends and when would you use them?', a: "Splitting a web app into parts owned and deployed independently by different teams, combined at runtime with tools like Module Federation. Use them when many teams need independent releases; for a single small team they add bundle size and complexity for little gain." },
        { q: 'How do you decide where state should live in a React app?', a: "Server data goes in a query cache like TanStack Query, values that belong in a shareable link go in the URL, truly global client values like the current user go in Context or a small store, and everything else stays local in the component." },
        { q: 'Why not put all API data in Redux?', a: "You end up hand-writing caching, loading flags, refetching and invalidation. Server-state libraries do that for you and keep data fresh, which removes a lot of boilerplate and stale-data bugs." },
        { q: 'How do you structure a large React codebase?', a: "By feature rather than by file type, with a shared design system, an app shell for routing and providers, and features that expose a small public API through an index file instead of importing each other's internals." },
      ],
      answer30: "I organise a big frontend by feature, with a shared design system and an app shell. The biggest win is state boundaries: server data in a query cache like TanStack Query, shareable things like filters in the URL, truly global client state like the user in Context or a small store, and the rest local. Micro-frontends let separate teams deploy parts independently, but they cost bundle size and consistency, so I'd use them only when team structure really needs it.",
      mistakes: [
        "One giant global store holding server data, form state and UI flags together.",
        "Choosing micro-frontends for a small team, then fighting duplicated React copies and shared routing.",
        "Filters and pagination in component state, so refresh or sharing a link loses them.",
        "Trap: 'Context or Redux?' Context passes a value down; it isn't a state manager with selectors, so frequently changing values in one big Context re-render every consumer. Split contexts or use a store for those.",
      ],
      takeaway: 'Organise by feature, put each kind of state in its right home, and treat micro-frontends as an org-scaling tool.',
    },

    {
      id: 'design-url-shortener',
      title: 'Design walkthrough: URL shortener',
      level: 'advanced',
      priority: 'must',
      frequency: 'very common',
      summary: 'A read-heavy key-value service: generate unique short codes, store code -> URL, and serve redirects from cache.',
      what: [
        "Design a service like bit.ly: a user submits a long URL and gets a short one like `sho.rt/aZ3kQ9x`; visiting it redirects to the original. Optional extras: custom aliases, expiry, click analytics.",
        "It's the classic warm-up because it's small but touches IDs, storage, caching and scale. The heart of it is how you generate short codes that never collide.",
      ],
      deeper: [
        "**Requirements and estimates.** Say 100 million new URLs a month and a 100:1 read/write ratio. Writes: 100M / (30 x 86,400) is about 40 per second. Reads: about 4,000 per second, peak maybe 20,000. Storage: 100M x 12 months x 5 years x about 500 bytes is about 3 TB. Reads dominate, so caching matters most.",
        "**Code generation options.** (1) **Counter + base62:** a global counter gives a unique number; encode it in base62 (`0-9a-zA-Z`). 7 characters give 62^7, about 3.5 trillion codes. To avoid one counter bottleneck, each app server grabs a **range** of ids (e.g. 1,000 at a time) from a coordinator like Redis `INCRBY` or a DB sequence. Downside: codes are guessable in order. (2) **Random code** + check for collision with a unique index, retry on clash; not guessable. (3) **Hash** of the URL (truncated); same URL gives same code, but collisions must still be handled.",
        "**Redirect:** `301` (permanent) lets browsers cache it, so less load but you lose click counts. `302` (temporary) sends every click through you, which you need for analytics. Most shorteners use 302 for that reason.",
        "**Storage and read path:** a simple key-value table `code -> { longUrl, ownerId, createdAt, expiresAt }`. DynamoDB, Cassandra or MongoDB sharded by `code` (a hash key spreads evenly). Hot links are served from Redis and a CDN. Analytics: the redirect handler publishes a click event to a queue or stream (Kinesis/Kafka) and returns at once; consumers aggregate counts, so analytics never slow redirects.",
        "**Abuse and safety:** rate limit creation per user and IP, scan URLs against malware/phishing lists, and support takedowns.",
      ],
      why: "It tests whether you can turn vague requirements into numbers, choose an ID strategy with trade-offs, and design a fast, cache-heavy read path.",
      analogy: "A coat check. You hand over a long coat (URL) and get a small numbered ticket (code). Tickets come from a pre-printed roll (counter ranges), so two people never get the same number, and the attendant keeps the most-collected coats near the front (cache).",
      code: [
        {
          lang: 'text',
          title: 'API, data model, and architecture',
          source: `API
  POST /api/urls        { longUrl, customAlias?, expiresAt? }  -> 201 { code, shortUrl }
  GET  /:code           -> 302 Location: <longUrl>   (404 if missing, 410 if expired)
  GET  /api/urls/:code/stats -> { clicks, byDay[] }

DATA (key-value, sharded by code)
  urls:   code (PK) | longUrl | ownerId | createdAt | expiresAt
  clicks: aggregated per code per day (written by the analytics consumer)

ARCHITECTURE
  client -> CDN -> LB -> stateless API
                           |  write: get id from local range -> base62 -> insert
                           |  read : Redis (code -> longUrl) -> on miss, DB -> set cache
                           |
                           +--> click event -> Kinesis/Kafka/SQS -> analytics workers -> clicks table
  id ranges: API instance asks Redis INCRBY counter 1000 -> uses ids locally until exhausted`,
        },
        {
          lang: 'js',
          title: 'Base62 encoding of a numeric id',
          source: `const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function toBase62(num) {
  if (num === 0) return '0';
  let out = '';
  while (num > 0) {
    out = ALPHABET[num % 62] + out;
    num = Math.floor(num / 62);
  }
  return out;
}

function fromBase62(str) {
  return [...str].reduce((n, ch) => n * 62 + ALPHABET.indexOf(ch), 0);
}

console.log(toBase62(125));            // small id -> short code
console.log(toBase62(1_000_000_000));  // 1 billion -> still 6 chars
console.log(fromBase62(toBase62(1_000_000_000)));
console.log('7 chars can hold', (62 ** 7).toLocaleString('en-US'), 'codes');`,
        },
      ],
      output: "The script prints '21', then '15FTGg' (one billion fits in 6 characters), then '1000000000' (decoding round-trips), then '7 chars can hold 3,521,614,606,208 codes'. In the full system, a redirect is usually one Redis lookup and a 302, while click events are processed asynchronously.",
      questions: [
        { q: 'How do you generate unique short codes at scale?', a: "Give each app server a block of ids from a central counter (for example Redis INCRBY 1000) and base62-encode them; no collisions and no per-request coordination. Alternatively, generate random codes and rely on a unique index, retrying on the rare collision, which also makes codes unguessable." },
        { q: '301 or 302 for the redirect?', a: "301 is permanent, so browsers cache it and later clicks never reach your servers, which saves load but loses analytics. 302 is temporary, so every click goes through you and can be counted. Use 302 if analytics matter." },
        { q: 'How do you keep redirects fast at 20,000 reads per second?', a: "Cache code-to-URL mappings in Redis (and at a CDN edge for very hot links), keep the API stateless and horizontally scaled, use a key-value store sharded by code, and push click tracking to a queue so it never blocks the redirect." },
        { q: 'How long should the code be?', a: "Base62 with 7 characters gives about 3.5 trillion codes, far more than billions of URLs over many years. Even 6 characters give about 57 billion." },
        { q: 'How would you add click analytics without slowing redirects?', a: "The redirect handler publishes a small click event to a stream or queue and returns immediately. Separate consumers aggregate counts per code per day into an analytics table." },
      ],
      answer30: "It's a read-heavy key-value system. I'd estimate around 40 writes and 4,000 reads per second, so caching drives the design. Each API server takes blocks of ids from a central counter and base62-encodes them, so 7 characters give trillions of codes without collisions. The mapping lives in a key-value store sharded by code, hot codes in Redis. Redirects use 302 so we can count clicks, and click events go to a queue so analytics never slow the redirect. I'd add rate limiting and malicious-URL checks on creation.",
      mistakes: [
        "Using one auto-increment DB counter for every request, creating a write bottleneck and a single point of failure.",
        "Hashing the URL and ignoring collisions.",
        "Writing analytics synchronously in the redirect path.",
        "Trap: 'Same long URL submitted twice, same code?' It depends on requirements. Per-user dedup needs an index on (ownerId, longUrl); global dedup leaks that someone else shortened it. Ask.",
      ],
      takeaway: 'Counter ranges + base62 for codes, key-value store + Redis for reads, 302 + async events for analytics.',
    },

    {
      id: 'design-notification-service',
      title: 'Design walkthrough: notification service',
      level: 'advanced',
      priority: 'must',
      frequency: 'common',
      summary: 'Accept notification requests, apply user preferences, fan out through queues to email, SMS and push providers, with retries and dedup.',
      what: [
        "Design a service that other services call to notify users by email, SMS, push or in-app message. For example: 'interview scheduled', 'you are shortlisted', 'password reset'.",
        "The core ideas: accept requests quickly, check user preferences, render a template, send through the right channel via a queue, retry failures, never send duplicates, and track delivery status.",
      ],
      deeper: [
        "**Requirements.** Channels: email, SMS, push, in-app. Priorities: transactional (OTP, password reset) must be fast; marketing can be slow and batched. Respect opt-outs and quiet hours. Scale example: 10 million notifications a day, about 115 per second average, with spikes during campaigns.",
        "**Flow.** (1) Caller sends `POST /notifications` with `{ userId, type, data, idempotencyKey }`. (2) The API validates, stores a record with status `PENDING`, and publishes to a queue. (3) A preference worker checks opt-outs and channels, renders templates, and publishes one message per channel to a **separate queue per channel** (and per priority). (4) Channel workers call providers (SES, SNS/Twilio, FCM/APNs) and update status. (5) Provider webhooks report delivered, bounced or failed.",
        "**Why separate queues:** a slow or failing SMS provider shouldn't block emails, and OTPs shouldn't wait behind a million marketing emails. Each queue scales its workers independently and has its own DLQ.",
        "**Reliability.** Idempotency key per notification so caller retries don't double-send. Workers check status before sending (at-least-once queues). Retries with backoff for provider 5xx/429; no retry on invalid numbers. Per-provider rate limits (providers throttle you). Optional failover to a second provider.",
        "**In-app notifications:** store in a `notifications` collection per user (`userId, read, createdAt` index) and push live via WebSocket or SSE when the user is online.",
      ],
      why: "Almost every product needs notifications, and the design shows how you use queues, idempotency, prioritisation and third-party failure handling together.",
      analogy: "A post office sorting room. Letters come in at the counter (API), get sorted by delivery type (preferences and routing), go into separate bags for air mail, courier and local post (channel queues), and express mail skips the line.",
      code: {
        lang: 'text',
        title: 'Architecture and data model',
        source: `services --POST /notifications {userId,type,data,idempotencyKey}--> Notification API
                                                     | store PENDING (unique idempotencyKey)
                                                     v
                                               [ incoming queue ]
                                                     v
                                  Preference + template worker
                                  (opt-outs, quiet hours, channel choice, render)
                     |                 |                  |                 |
              [email-high]      [email-bulk]          [sms]             [push]       (each has a DLQ)
                     v                 v                  v                 v
               email worker      email worker        sms worker        push worker
                     v                 v                  v                 v
                   SES               SES            SNS / Twilio       FCM / APNs
                     \\________________ delivery webhooks __________________/
                                         v
                              status updates: SENT / DELIVERED / FAILED

notifications: _id | userId | tenantId | type | channel | status | idempotencyKey (unique) | attempts | createdAt
preferences:   userId | channel -> enabled | quietHours | locale
templates:     type | channel | locale | subject | body (with {{placeholders}})`,
      },
      output: "A 'shortlisted' event becomes one stored notification and, after preferences, an email and an in-app message. If SES is slow, only the email queue backs up; push and SMS continue. A caller retrying the same request gets the same notification back instead of a second email.",
      questions: [
        { q: 'Why use a queue per channel?', a: "So channels are isolated: a slow or failing SMS provider doesn't block email, each channel scales its workers separately, and each can respect its provider's rate limits and have its own dead-letter queue." },
        { q: 'How do you avoid sending duplicate notifications?', a: "Require an idempotency key from the caller and store it under a unique index; repeated requests return the existing record. Workers also check the notification's status before sending, because queues can deliver a message more than once." },
        { q: 'How do you make OTPs fast while a marketing campaign is sending?', a: "Use separate high-priority queues and workers for transactional messages, so they never wait behind bulk sends. Bulk messages are rate limited and can be batched." },
        { q: 'What happens when the email provider is down?', a: "Workers retry with exponential backoff, a circuit breaker stops hammering the provider, messages wait safely in the queue, and repeated failures go to a DLQ. Optionally, fail over to a second provider." },
      ],
      answer30: "Callers post a notification with a user, a type, data and an idempotency key. The API stores it as pending and queues it. A worker applies preferences and opt-outs, renders templates, and fans out to a separate queue per channel and priority, so OTPs never wait behind marketing and a failing SMS provider doesn't block email. Channel workers call SES, Twilio or FCM with retries, backoff and DLQs, check status first to avoid duplicates, and provider webhooks update delivery status.",
      mistakes: [
        "Sending synchronously inside the caller's request.",
        "One shared queue for every channel and priority.",
        "Ignoring user opt-outs, unsubscribe links and quiet hours (also a legal issue for marketing messages).",
        "Trap: 'How do you guarantee exactly one email?' You can't fully, because the provider may send but the ack can be lost. You get close with idempotency keys, status checks, and provider-side idempotency where supported.",
      ],
      takeaway: 'Store, queue, apply preferences, fan out per channel and priority, retry safely, never double-send.',
    },

    {
      id: 'design-realtime-chat',
      title: 'Design walkthrough: real-time chat',
      level: 'advanced',
      priority: 'must',
      frequency: 'common',
      summary: 'WebSocket gateways hold connections, a pub/sub layer routes messages between servers, and a write-optimised store keeps history ordered per conversation.',
      what: [
        "Design a chat app like WhatsApp or Slack: one-to-one and group messages, delivered in real time, with history, online status and read receipts.",
        "The key problem: users are connected to different servers, so a message received on server A has to reach a recipient connected to server B, instantly and in the right order.",
      ],
      deeper: [
        "**Connections.** Clients keep a **WebSocket** open to a chat gateway server. HTTP polling is wasteful; SSE is one-way only. A gateway can hold tens of thousands of mostly idle connections. A **presence/session store** (Redis) maps `userId -> gatewayId`.",
        "**Routing between servers.** When server A receives a message for a user on server B, it publishes to a pub/sub channel (Redis pub/sub, or Kafka/NATS at bigger scale). Server B is subscribed and pushes it down the socket. Socket.IO's Redis adapter does exactly this for Node.",
        "**Send flow.** Client sends `{ clientMsgId, conversationId, text }` -> gateway -> persist to the message store (assign a server sequence number per conversation) -> ack to the sender -> publish to recipients' gateways -> deliver. If a recipient is offline, queue a push notification. `clientMsgId` makes resends idempotent.",
        "**Storage.** Messages are write-heavy and read by conversation in time order. Partition by `conversationId`, sort by sequence or time: Cassandra/ScyllaDB or DynamoDB fit well, or MongoDB with an index on `{ conversationId: 1, seq: -1 }`. Paginate history with a cursor (`before seq`), not offset.",
        "**Ordering:** within a conversation use the server-assigned sequence, not client clocks. **Groups:** small groups fan out to each member; for huge channels, fan out on read (members fetch from the channel) instead of writing a copy per member. **Reconnects:** the client sends its last seen sequence and fetches what it missed.",
      ],
      why: "It's a favourite because it mixes stateful connections with stateless scaling, pub/sub, ordering, offline delivery and storage choice, all in one product everyone understands.",
      analogy: "A hotel switchboard. Each operator (gateway) has phone lines to some guests. When a call comes in for a guest on another operator's board, it goes over the internal intercom (pub/sub) to that operator, and if the guest is out, a note goes under the door (push notification).",
      code: {
        lang: 'text',
        title: 'Architecture and message flow',
        source: `client A ==ws==> Gateway 1 --+                        +--> Gateway 2 ==ws==> client B
                              |                        |
                              v                        |
                        Chat service  -- publish to "user:B" -->  Pub/Sub (Redis / Kafka / NATS)
                              |
                              v
                 Message store (partition: conversationId, sort: seq)
                              |
                       offline? --> push queue --> FCM / APNs

Presence (Redis):  user:B -> { gateway: "gw-2", lastSeen }   (TTL refreshed by heartbeats)

SEND
 1. A -> gw1: { clientMsgId: "a-77", conversationId: "c9", text: "hi" }
 2. chat service: dedupe on clientMsgId, seq = INCR conv:c9:seq, save message
 3. ack to A: { clientMsgId: "a-77", seq: 1042, status: "sent" }
 4. publish to each member's channel -> their gateway pushes it -> client acks -> "delivered"

RECONNECT
 client: GET /conversations/c9/messages?after=1039  -> fills the gap`,
      },
      output: "A sends 'hi', gets an ack with sequence 1042, and B's gateway receives it through pub/sub and pushes it within milliseconds. If B was offline, B gets a push notification and, on reconnect, fetches everything after the last sequence it saw, in order.",
      questions: [
        { q: 'Why WebSockets for chat instead of polling?', a: "WebSockets keep one open, two-way connection, so the server can push messages instantly with little overhead. Polling sends constant requests that are mostly empty and adds delay; SSE is server-to-client only." },
        { q: 'How does a message reach a user connected to a different server?', a: "Gateways subscribe to a pub/sub system like Redis or Kafka. The server that receives the message publishes it to the recipient's channel, and the gateway holding that user's socket pushes it down." },
        { q: 'How do you keep messages in order?', a: "Assign a sequence number per conversation on the server when saving the message, and have clients sort and detect gaps by that sequence. Client timestamps can't be trusted because clocks differ." },
        { q: 'Which database would you use for messages?', a: "Something good at high write volume and reading by key in order, like Cassandra or DynamoDB with conversationId as the partition key and the sequence as the sort key. MongoDB with a compound index on conversationId and seq also works at moderate scale." },
        { q: 'How do you handle users who are offline?', a: "Messages are always stored first. If the presence store shows no live connection, send a push notification. When the user reconnects, the client asks for messages after its last seen sequence." },
      ],
      answer30: "Clients hold WebSocket connections to stateless-ish gateway servers, and Redis tracks which gateway each user is on. When a message arrives, the chat service dedupes it by a client message id, assigns a per-conversation sequence number, stores it in a store partitioned by conversation, acks the sender, and publishes it through pub/sub to the recipients' gateways. Offline users get a push notification and catch up on reconnect by asking for messages after their last sequence.",
      mistakes: [
        "Keeping all routing in one server's memory, so it can't scale past one instance.",
        "Ordering by client timestamps.",
        "Writing a copy of every message into each member's inbox for huge groups.",
        "Trap: 'How does the load balancer handle WebSockets?' It must support upgrades and long-lived connections; on deploys, gateways drain and clients reconnect with backoff and jitter to avoid a reconnect storm.",
      ],
      takeaway: 'WebSocket gateways, presence in Redis, pub/sub between servers, per-conversation sequence numbers, store first then deliver.',
    },

    {
      id: 'design-upload-pipeline',
      title: 'Design walkthrough: file and video upload and processing pipeline',
      level: 'advanced',
      priority: 'must',
      frequency: 'common',
      summary: 'Upload straight to S3 with presigned URLs, trigger processing through events and queues, track status per file, and serve results through a CDN.',
      what: [
        "Design a system where users upload files (CVs, videos) that then need processing: virus scan, transcoding a video into several resolutions, extracting text, creating thumbnails, running AI analysis.",
        "Key idea: the API server never handles the file bytes. The client uploads directly to object storage using a short-lived **presigned URL**, and the processing happens asynchronously in workers.",
      ],
      deeper: [
        "**Upload.** (1) Client calls `POST /uploads` with file name, size and type. (2) API validates (allowed types, size limit, quota), creates an `upload` record with status `PENDING`, and returns a presigned PUT URL scoped to one S3 key, valid for minutes. (3) Client uploads to S3 directly. Large files (videos) use **S3 multipart upload**: chunks upload in parallel and failed chunks retry alone, so a dropped connection doesn't restart a 2 GB upload.",
        "**Trigger processing.** S3 sends an `ObjectCreated` event to SQS or EventBridge (or the client calls `POST /uploads/:id/complete`). Workers pick up the job, set status `PROCESSING`, run the steps, write outputs to another S3 prefix, then mark `READY` or `FAILED`.",
        "**Video specifics.** Transcode with FFmpeg on worker containers, or a managed service like AWS Elemental MediaConvert, into HLS (or DASH) at several bitrates for adaptive streaming. Serve through CloudFront with signed URLs or cookies for private content.",
        "**Reliability.** Idempotent workers keyed by object key (events can repeat), DLQ for files that keep failing, visibility timeouts longer than processing time (or extend them while working), and status a client can poll or receive via WebSocket/SSE. Lifecycle rules delete abandoned multipart uploads and temp files.",
        "**Security.** Validate the real file type after upload (magic bytes, not just the extension), virus scan before anyone downloads it, keep the bucket private, scope keys by tenant (`<tenantId>/<uploadId>/...`), and make presigned URLs short-lived and single-purpose.",
      ],
      why: "Streaming big files through your API ties up servers, hits request timeouts and costs bandwidth. Direct-to-S3 plus async processing keeps the API fast and lets processing scale separately.",
      analogy: "A photo lab. You get a ticket at the counter (presigned URL), drop the film in a secure slot yourself (S3), the lab develops it in the back room at its own pace (workers), and you check your ticket number on a screen until it says 'ready' (status polling).",
      code: {
        lang: 'text',
        title: 'Flow and status model',
        source: `1. client --POST /uploads {name,size,type}--> API
       API: validate type/size/quota, create upload {status: PENDING}
       API --> client: { uploadId, presignedUrl (PUT, 10 min, key = tenant/uploadId/original.mp4) }

2. client ==PUT bytes (multipart for big files)==> S3 (private bucket)

3. S3 ObjectCreated --> SQS (or EventBridge) --> worker
       worker: status PROCESSING
         - check magic bytes, virus scan
         - video: FFmpeg / MediaConvert -> HLS 1080p/720p/480p + thumbnail
         - CV:    text extraction -> AI parsing agent
       outputs --> S3 tenant/uploadId/processed/...
       status READY (or FAILED after N tries -> DLQ)

4. client --GET /uploads/:id--> { status, progress, outputs[] }   (poll, or SSE/WebSocket)
5. playback/download via CloudFront signed URL

uploads: _id | tenantId | ownerId | key | size | mime | status | attempts | error | outputs[] | createdAt`,
      },
      output: "A candidate uploads a 500 MB interview video straight to S3 without touching the API servers. Within seconds the status flips to PROCESSING; when transcoding finishes it becomes READY and the recruiter can stream it through the CDN at a quality that fits their connection.",
      questions: [
        { q: 'Why use presigned URLs instead of uploading through the API?', a: "The file goes straight from the client to S3, so the API doesn't hold big request bodies, hit timeouts or pay for the bandwidth twice. The URL is short-lived and scoped to one key, so the client can't write anywhere else." },
        { q: 'How do you handle very large uploads?', a: "Use S3 multipart upload: split the file into parts, upload them in parallel, retry only failed parts, then complete the upload. Add a lifecycle rule to clean up incomplete multipart uploads." },
        { q: 'How does processing get triggered?', a: "An S3 ObjectCreated event goes to SQS or EventBridge, and workers consume it. Alternatively the client calls a 'complete' endpoint. Either way processing is asynchronous and workers must be idempotent because events can be delivered twice." },
        { q: 'How does the user know when processing is done?', a: "Store a status per upload (pending, processing, ready, failed) and let the client poll a status endpoint, or push updates over SSE or WebSockets. For long jobs, include progress." },
        { q: 'What security checks do you add?', a: "Limit size and type before issuing the URL, verify the real type from the file's magic bytes after upload, virus scan before anyone can download, keep the bucket private, scope keys by tenant, and serve via short-lived signed URLs." },
      ],
      answer30: "The client asks the API for an upload; the API validates type, size and quota, records it as pending, and returns a short-lived presigned URL scoped to one S3 key. The client uploads directly to S3, using multipart for big videos. An S3 event lands in SQS, and idempotent workers scan, transcode to HLS or extract text, write outputs back to S3 and update the status, with retries and a DLQ. The client polls or gets SSE updates, and playback goes through CloudFront signed URLs.",
      mistakes: [
        "Streaming uploads through Express into memory with no size limits.",
        "Trusting the file extension or the client-provided MIME type.",
        "Long-lived or broadly scoped presigned URLs.",
        "Trap: 'What if S3 fires the event twice?' Events are at-least-once, so the worker checks the upload's status or uses a conditional update before doing the work.",
        "On your resume: Octagnt's public token-based API for direct-to-S3 candidate video uploads and the SQS bulk-upload pipeline are exactly this design, so describe your real version.",
      ],
      takeaway: 'Presigned direct-to-S3 upload, event to queue, idempotent workers, status per file, CDN for delivery.',
    },

    {
      id: 'design-ai-hiring-platform',
      title: 'Design walkthrough: AI interview and hiring platform at scale',
      level: 'advanced',
      priority: 'must',
      frequency: 'common',
      summary: 'A multi-tenant platform where candidates flow through AI-driven pipeline steps; the core is a durable orchestrator, async workers, and cost and rate control for LLM calls.',
      note: "This is a design exercise built from the public shape of your resume (Octagnt.ai), scaled up. It is not a description of your company's real system. When you answer, say clearly which parts you built and which are 'how I would scale it'.",
      what: [
        "Design a platform like Octagnt.ai: companies (tenants) post jobs, candidates apply or are uploaded in bulk, and AI agents parse CVs, match them to the job, run voice or video interviews, score answers, and produce a shortlist for recruiters.",
        "The hard parts are not the AI model calls themselves. They are: running long, multi-step workflows reliably, isolating tenants, controlling LLM cost and rate limits, handling large media files, and keeping decisions auditable and fair.",
      ],
      deeper: [
        "**Requirements.** Functional: create jobs, ingest candidates (bulk upload, ATS sync), configurable pipelines per job (screen -> assessment -> AI interview -> score), recruiter dashboard, candidate notifications. Non-functional: strict tenant isolation, steps can take seconds to minutes, many candidates per job, audit trail for every AI decision, personal data protection. Example scale: 1,000 tenants, 2 million candidates a month, about 10 AI calls each, so about 20 million LLM calls a month (about 8 per second average, with big spikes when a large job opens).",
        "**Orchestration.** Each candidate's progress is a **pipeline run**: a durable state machine stored in the database (`runId, candidateId, step, status, attempts, outputs`). The orchestrator reads the job's pipeline config, enqueues the next step, and moves on when a worker reports the result. Each step is retried on its own, so a failure at step 3 doesn't redo steps 1 and 2. At scale, a workflow engine like Temporal or AWS Step Functions gives durable timers, retries and visibility for free.",
        "**Agent layer.** Agents sit behind one gateway that adds auth, timeouts, request ids and per-tenant quotas. Workers call agents through **per-agent queues**, so a slow transcription agent doesn't block CV parsing. LLM calls go through an **LLM gateway** that handles provider rate limits (token bucket per provider and per tenant), retries with backoff, model fallback, prompt and response logging for audit, caching of identical requests (for example parsing the same CV twice), and cost tracking per tenant.",
        "**Data.** MongoDB (or Postgres) for tenants, jobs, candidates, pipeline runs, with `tenantId` on everything and indexes starting with it; shard by `tenantId` when one cluster isn't enough. S3 for CVs, recordings and transcripts, keyed by tenant. A search index (OpenSearch) or vector store for candidate search and matching. Events (`StepCompleted`, `CandidateScored`) feed notifications, analytics and the ATS sync.",
        "**Interviews.** Voice/video sessions use a realtime connection (WebRTC or WebSocket) to a session service that streams audio to speech-to-text and the interviewer agent. Recordings upload to S3 and are processed asynchronously. One-sided video interviews use presigned uploads.",
        "**Trust and fairness.** Store which model, prompt version and inputs produced every score, so recruiters can see why a candidate was rejected and decisions can be audited. Keep a human in the loop for final decisions; hiring is a regulated, high-risk use of AI in some regions (for example the EU AI Act and New York City's rules on automated hiring tools).",
      ],
      why: "Interviewers love asking you to design something close to your own product: it shows whether you understand the system beyond your tickets. It's also a strong way to steer the interview onto ground you know well.",
      analogy: "An airport for candidates. Each candidate has a boarding pass (pipeline run) listing their flights (steps). The control tower (orchestrator) dispatches each leg to the right gate (agent queue), handles delays (retries) without sending them back to check-in, and every airline (tenant) has its own lounge that others can't enter.",
      code: {
        lang: 'text',
        title: 'Architecture at scale',
        source: `Recruiter UI / Candidate UI
     |  (cookie JWT, RBAC, tenant from token)
     v
API gateway / LB --> Core API (stateless, multi-tenant)
                         | jobs, candidates, pipeline configs      --> MongoDB (sharded by tenantId)
                         | presigned uploads                       --> S3 (tenant/...)
                         | ATS sync (idempotent upserts)
                         v
                 Orchestrator (durable state machine / Temporal / Step Functions)
                         | pipeline_runs: runId | tenantId | candidateId | step | status | attempts | outputs
                         | enqueue next step
        +----------------+-----------------+------------------+
        v                v                 v                  v
   [q:cv-parse]     [q:jd-match]     [q:interview]      [q:scoring]        (per-agent queues + DLQs)
        v                v                 v                  v
                 Agent gateway (auth, timeouts, request ids, per-tenant quotas)
                         v
                 LLM gateway (rate limits per provider + tenant, retries, fallback, cache, cost, audit log)
                         v
                 LLM / speech-to-text providers

Events: StepCompleted, CandidateScored --> notifications, analytics, ATS writeback, recruiter UI (SSE)
Observability: trace id per pipeline run across API -> queue -> agent -> LLM`,
      },
      output: "A recruiter opens a job and 5,000 candidates arrive. The API returns immediately; pipeline runs are created and steps flow through per-agent queues at the rate the LLM providers and the tenant's quota allow. Each candidate's run survives worker crashes, the dashboard updates live as scores arrive, and every score is traceable to its model, prompt and inputs.",
      questions: [
        { q: 'How would you make a multi-step AI pipeline reliable?', a: "Model each candidate's progress as a durable state machine stored in the database or a workflow engine like Temporal or Step Functions. Each step runs from a queue with its own retries, timeouts and DLQ, and saves its output, so a failure retries only that step instead of the whole pipeline." },
        { q: 'How do you handle LLM provider rate limits and costs at scale?', a: "Route all model calls through one LLM gateway that applies token-bucket limits per provider and per tenant, retries 429s with backoff, falls back to another model, caches repeat requests, and records tokens and cost per tenant. Queues absorb spikes so workers only pull as fast as the limits allow." },
        { q: 'How do you stop one big tenant from slowing everyone else?', a: "Per-tenant quotas at the gateway, fair scheduling or per-tenant partitions in the queues so one tenant's 50,000 candidates don't starve others, and dedicated workers or capacity for the biggest tenants." },
        { q: 'How do you make AI hiring decisions auditable?', a: "Store the model, prompt version, inputs and raw outputs for every score along with the final decision, show recruiters the reasons, keep a human in the loop for final decisions, and monitor score distributions for bias." },
        { q: 'What would you change first if traffic grew 100x?', a: "Move orchestration to a managed workflow engine, shard the database by tenantId, autoscale workers per queue on depth, add a cache and batching in the LLM gateway, and add tracing per pipeline run so failures are easy to debug." },
      ],
      answer30: "Tenants create jobs with configurable pipelines. Each candidate gets a durable pipeline run, a state machine the orchestrator advances step by step through per-agent queues, so failures retry only one step. Agents sit behind a gateway, and all model calls go through an LLM gateway that handles provider and per-tenant rate limits, retries, fallback, caching and cost tracking. Data is tenant-scoped in MongoDB and S3, events drive notifications and live dashboards, and every AI decision stores its model, prompt and inputs for audit, with a human making the final call.",
      mistakes: [
        "Calling LLMs synchronously inside HTTP requests, so a slow model call times out the user's request.",
        "One shared queue for all agents, so one slow agent backs everything up.",
        "No record of which prompt and model produced a score, so rejections can't be explained.",
        "Trap: 'Is this exactly how your company built it?' Be honest: separate what you built (for example the orchestrator, gateway and SQS pipeline on your resume) from how you'd evolve it at 100x.",
        "On your resume: multi-tenant APIs, the orchestrator over 35+ agents behind a gateway, SQS + S3 bulk uploads, and the weighted decision engine are all pieces of this design.",
      ],
      takeaway: 'Durable per-candidate state machines, per-agent queues, an LLM gateway for limits and cost, tenant isolation everywhere, and an audit trail for every AI decision.',
    },

    {
      id: 'design-rate-limiter-gateway',
      title: 'Design walkthrough: distributed rate limiter and API gateway',
      level: 'advanced',
      priority: 'good',
      frequency: 'common',
      summary: 'A gateway that authenticates, routes and rate limits every request, with limits enforced atomically in Redis and rules loaded from config.',
      what: [
        "Design an API gateway: one entry point in front of many backend services that handles cross-cutting work like authentication, routing, rate limiting, request ids, logging and timeouts. Then design the rate limiter inside it so limits hold across many gateway instances.",
      ],
      deeper: [
        "**Gateway responsibilities.** TLS termination, auth (verify JWT or API key once), routing by path/host to services, rate limiting and quotas, request/response size limits, timeouts and retries, CORS, request ids and tracing headers, and sometimes response caching or aggregation. Off-the-shelf options: AWS API Gateway, Kong, Envoy, NGINX, Apigee.",
        "**Rate limiter requirements.** Limit by API key, user, IP or tenant; different rules per endpoint and plan (free 60/min, pro 600/min). Must add only about 1 ms of latency, work across many gateway instances, and fail sensibly if Redis is down.",
        "**Algorithm and storage.** Token bucket (allows bursts) or sliding window counter (smooth). Store state in Redis, keyed like `rl:{tenant}:{route}`. Make check-and-update **atomic** with a Lua script (Redis runs it as one step), so two gateways can't both take the last token. Set TTLs so idle keys expire. Use Redis Cluster for scale; keys spread by hash slot.",
        "**Rules** live in config (YAML or a DB) and are cached in each gateway with periodic reload, so changing a limit doesn't need a deploy.",
        "**Failure modes.** If Redis is unreachable: **fail open** (allow traffic, risk overload) for most APIs, **fail closed** for sensitive ones like login or OTP. A local in-memory limiter can act as a rough backup. For very high traffic, gateways can count locally and sync to Redis in batches, trading exactness for speed.",
        "**Responses:** `429 Too Many Requests` with `Retry-After`, and headers showing limit and remaining so clients can back off.",
      ],
      why: "It combines a concrete algorithm with distributed-systems problems: shared state, atomicity, latency budgets and failure behaviour. It's also directly relevant if you've built a gateway in front of services.",
      analogy: "Security gates at a stadium. Every gate (gateway instance) checks tickets (auth) and directs people to the right stand (routing). A shared live counter for each section (Redis) makes sure no section overfills, no matter which gate people use.",
      code: [
        {
          lang: 'text',
          title: 'Architecture',
          source: `client --> DNS / CDN / WAF --> LB --> Gateway instances (stateless, N of them)
                                        | 1. TLS, request id
                                        | 2. auth: verify JWT / API key -> tenant, plan
                                        | 3. rate limit: Lua script on Redis (atomic)
                                        |      -> 429 + Retry-After if empty
                                        | 4. route by path: /api/* -> core, /agents/* -> agents
                                        | 5. timeout, retry (idempotent only), log, metrics
                                        v
                              backend services
Redis Cluster: rl:{tenantId}:{route} -> { tokens, ts }   TTL 2x window
Rules: free: 60/min, pro: 600/min, POST /login: 5/min per IP  (config, cached, hot-reloaded)
Redis down: fail open for normal APIs, fail closed for login/OTP`,
        },
        {
          lang: 'js',
          title: 'Atomic token bucket in Redis with a Lua script (ioredis)',
          source: `// KEYS[1] = bucket key, ARGV = capacity, refill per second, now in ms
const TOKEN_BUCKET_LUA = \`
local b = redis.call('HMGET', KEYS[1], 'tokens', 'ts')
local capacity, rate, now = tonumber(ARGV[1]), tonumber(ARGV[2]), tonumber(ARGV[3])
local tokens = tonumber(b[1]) or capacity
local ts = tonumber(b[2]) or now
tokens = math.min(capacity, tokens + (now - ts) / 1000 * rate)
local allowed = 0
if tokens >= 1 then tokens = tokens - 1; allowed = 1 end
redis.call('HSET', KEYS[1], 'tokens', tokens, 'ts', now)
redis.call('PEXPIRE', KEYS[1], math.ceil(capacity / rate * 1000) * 2)
return { allowed, math.floor(tokens) }
\`;

export function rateLimit({ redis, capacity, perSec, keyFn }) {
  return async (req, res, next) => {
    try {
      const [allowed, remaining] = await redis.eval(
        TOKEN_BUCKET_LUA, 1, keyFn(req), capacity, perSec, Date.now()
      );
      res.set('RateLimit-Remaining', String(remaining));
      if (!allowed) return res.set('Retry-After', String(Math.ceil(1 / perSec))).status(429).end();
      next();
    } catch {
      next(); // Redis down: fail open for normal routes
    }
  };
}

// app.use('/api', rateLimit({ redis, capacity: 100, perSec: 10, keyFn: (r) => 'rl:' + r.tenantId }));`,
        },
      ],
      output: "Every gateway instance runs the same Lua script against the same Redis key, so a tenant's limit holds no matter which instance serves the request. When the bucket is empty the client gets 429 with Retry-After; if Redis fails, normal routes keep working.",
      questions: [
        { q: 'What does an API gateway do?', a: "It's the single entry point in front of backend services. It handles cross-cutting concerns once: TLS, authentication, routing, rate limiting, timeouts, request ids, logging and metrics, so each service doesn't reimplement them." },
        { q: 'How do you make a rate limiter work across many gateway instances?', a: "Store the counters or buckets in a shared store like Redis and update them atomically with a Lua script or atomic commands, so concurrent requests on different instances can't both take the last token." },
        { q: 'What happens if Redis goes down?', a: "Decide per route. Fail open for normal APIs so an outage in the limiter doesn't become a full outage, and fail closed for sensitive endpoints like login or OTP. A local in-memory limiter can act as a rough fallback." },
        { q: 'Why use a Lua script instead of GET then SET?', a: "GET then SET is two round trips, and another instance can change the value in between, so both requests pass. Redis runs a Lua script atomically, so read, compute and write happen as one step." },
      ],
      answer30: "The gateway is a stateless layer in front of all services that terminates TLS, authenticates once, routes by path, applies rate limits and timeouts, and adds request ids and metrics. For limits I'd use a token bucket per tenant, user or IP and route, stored in Redis and updated atomically by a Lua script so all instances share one limit. Rules come from config and hot-reload. Over the limit returns 429 with Retry-After, and if Redis is down I fail open for normal routes and closed for login.",
      mistakes: [
        "Per-instance in-memory counters, so the real limit grows with the number of gateway instances.",
        "Putting business logic in the gateway. It should stay thin and generic.",
        "Retrying non-idempotent requests at the gateway.",
        "Trap: 'Isn't the gateway a single point of failure and a bottleneck?' It's stateless and horizontally scaled behind a load balancer, and the limiter adds about one Redis round trip, which is why that call must be cheap.",
        "On your resume: the Octagnt gateway with path-based routing in front of 35+ agents is a real gateway you can talk about.",
      ],
      takeaway: 'Thin stateless gateway for cross-cutting concerns; token buckets in Redis via atomic Lua; decide fail-open vs fail-closed per route.',
    },
  ],
  rapidFire: [
    { q: 'First step in a system design interview?', a: 'Clarify functional and non-functional requirements and the scale.' },
    { q: '1 million requests a day is roughly how many per second?', a: 'About 12 per second on average (86,400 seconds in a day).' },
    { q: 'Vertical vs horizontal scaling?', a: 'Bigger machine vs more machines.' },
    { q: 'What makes horizontal scaling possible?', a: 'Stateless services, with state in a DB, Redis or S3.' },
    { q: 'L4 vs L7 load balancer?', a: 'L4 routes by IP/port; L7 understands HTTP and can route by path or host.' },
    { q: 'Default caching pattern?', a: 'Cache-aside: read cache, on miss load DB and set with TTL; delete on write.' },
    { q: 'What is a cache stampede?', a: 'Many requests missing an expired hot key at once and all hitting the DB.' },
    { q: 'CAP in one line?', a: 'During a network partition, choose consistency or availability.' },
    { q: 'Eventual consistency?', a: 'Replicas may differ briefly but converge if writes stop.' },
    { q: 'Why must queue consumers be idempotent?', a: 'Delivery is usually at-least-once, so messages can repeat.' },
    { q: 'What is a DLQ?', a: 'A queue for messages that failed too many times, for inspection and replay.' },
    { q: 'What is the outbox pattern?', a: 'Save the event in the same DB transaction as the data, publish it separately.' },
    { q: 'Why add jitter to backoff?', a: 'So clients do not retry in synchronized waves.' },
    { q: 'Circuit breaker states?', a: 'Closed, open, half-open.' },
    { q: 'Replication vs sharding?', a: 'Replication copies data (scales reads); sharding splits data (scales writes and storage).' },
    { q: 'Bad shard key example?', a: 'A timestamp or auto-increment id: all new writes hit one shard.' },
    { q: 'Token bucket in one line?', a: 'Tokens refill at a steady rate; each request spends one; bursts up to capacity.' },
    { q: 'HTTP status for rate limited?', a: '429 Too Many Requests, with Retry-After.' },
    { q: 'Safest place to get tenantId from?', a: 'The verified auth token, never the request body.' },
    { q: 'Three pillars of observability?', a: 'Logs, metrics, traces.' },
    { q: 'Dependency inversion in one line?', a: 'Business code depends on interfaces; concrete adapters are injected.' },
    { q: '301 or 302 for a URL shortener with analytics?', a: '302, so every click reaches your server.' },
    { q: 'How do chat servers route messages between each other?', a: 'Pub/sub, such as Redis pub/sub or Kafka.' },
    { q: 'How should big files reach S3?', a: 'Directly from the client via a short-lived presigned URL, multipart for large files.' },
  ],
};

export default architecture;
