// Next.js stack. Topics are auto-sorted Basic -> Intermediate -> Advanced by the registry.
// Written against Next.js 16.x (16.4 is current as of October 2026), App Router first.

const nextjs = {
  name: 'Next.js',
  intro: 'The React framework most full-stack roles expect you to know. App Router first, written for Next.js 16; the Pages Router appears only where interviewers still compare the two.',
  topics: [
    {
      id: 'why-nextjs',
      title: 'Why Next.js (and what it adds to React)',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'React is a UI library; Next.js is a full-stack framework around it with routing, server rendering, data fetching, and a build pipeline.',
      what: [
        "React only knows how to turn state into UI. It doesn't decide how URLs map to pages, how data is fetched on the server, how the app is bundled, or how it's deployed. Next.js is a framework that makes those decisions for you.",
        "Out of the box you get file-based routing, server rendering and static generation, React Server Components, API endpoints (route handlers), Server Actions for form submissions, and built-in image, font, and script optimization.",
      ],
      deeper: [
        "A plain Vite + React app is a single-page app (SPA): the server sends an almost empty HTML file and the browser builds the page with JavaScript. That's fine for dashboards behind a login, but bad for first-load speed and SEO on public pages. Next.js can send real HTML from the server, then hydrate it, so users and search engines see content immediately.",
        "Next.js 16 uses Turbopack as the default bundler, React 19.x, and requires Node.js 20.9+. The React team itself recommends starting new apps with a framework like Next.js rather than a bare bundler.",
        "Trade-offs: more concepts to learn (server vs client, caching), a heavier runtime than a static SPA, and some features work best on Vercel, though self-hosting is fully supported.",
      ],
      why: "Every serious React app ends up rebuilding the same things: a router, code splitting, server rendering for SEO, an API layer, and image handling. Next.js gives you those as one tested, consistent system.",
      analogy: "React is a powerful engine. Next.js is the whole car: engine plus chassis, steering, brakes, and a dashboard, already wired together.",
      code: {
        lang: 'bash',
        title: 'Starting a new app (App Router, TypeScript, Tailwind by default)',
        source: `npx create-next-app@latest my-app
cd my-app
npm run dev        # next dev  (Turbopack)  -> http://localhost:3000
npm run build      # next build: compiles, prerenders static routes
npm run start      # next start: runs the production Node server`,
      },
      output: "You get an `app/` folder with `layout.tsx` and `page.tsx`. Visiting `/` renders `app/page.tsx` on the server and sends real HTML. `next build` prints which routes are static and which are dynamic.",
      questions: [
        { q: 'What does Next.js add on top of React?', a: 'Routing from the file system, server-side rendering and static generation, React Server Components, API route handlers, Server Actions, and optimizations for images, fonts, and scripts, plus a production build setup.' },
        { q: 'When would you NOT use Next.js?', a: 'For a purely internal dashboard behind a login where SEO and first-load HTML don\'t matter, a Vite SPA is simpler and cheaper to host as static files. Also when the backend is already separate and the team doesn\'t want a Node server for the frontend.' },
        { q: 'Is Next.js a backend framework?', a: 'Partly. Route handlers and Server Actions let it serve APIs and run server code, so small apps can be fully full-stack. Larger systems often keep a separate backend (like an Express API) and use Next.js as the web layer.' },
        { q: 'What is the difference between a library and a framework here?', a: 'You call a library (React renders what you give it). A framework calls your code (Next.js decides when your page component runs, on the server or client, based on where the file sits).' },
      ],
      answer30: "React is a UI library; Next.js is a full-stack framework built on it. It gives me file-based routing, server rendering and static generation for fast first loads and SEO, React Server Components so less JavaScript ships to the browser, route handlers for APIs, Server Actions for mutations, and built-in image and font optimization. For a public, content-heavy site I'd pick Next.js; for an internal dashboard, a Vite SPA can be simpler.",
      mistakes: [
        "Saying Next.js is 'just for SEO'. It's also about performance, less client JavaScript, and colocating server code.",
        "Thinking every Next.js page is server-rendered on every request. Many routes are prerendered at build time.",
        "Assuming you must deploy to Vercel. `next start` runs anywhere Node runs, and a Docker image is a common setup.",
        "Trap: 'Why not just use Create React App?' CRA is deprecated (React's team announced it in 2025). The alternatives are a framework like Next.js or a build tool like Vite.",
      ],
      takeaway: 'React draws the UI; Next.js decides routing, rendering location, data fetching, and builds it for production.',
    },

    {
      id: 'app-router-vs-pages-router',
      title: 'App Router vs Pages Router',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'The App Router (`app/`) is the modern default built on Server Components; the Pages Router (`pages/`) is the older, still-supported model.',
      what: [
        "Next.js has two routing systems. The **Pages Router** lives in `pages/`: every file is a page, and you fetch data with special functions like `getServerSideProps` and `getStaticProps`. Every component is a client component.",
        "The **App Router** lives in `app/` (since Next.js 13.4, stable). Folders define routes, a `page.tsx` makes a route public, and components are **Server Components by default**. Data is fetched by simply `await`ing inside the component.",
      ],
      deeper: [
        "The App Router adds nested layouts that don't re-render on navigation, streaming with Suspense, `loading.tsx` and `error.tsx` per route segment, Server Actions, and the newer caching model (`'use cache'`, Cache Components). None of these exist in the Pages Router.",
        "Both can live in the same project during a migration. If the same path exists in both, that's a build error. The Pages Router is still maintained, but new features land in the App Router, and `create-next-app` defaults to it.",
        "Pages Router data functions map roughly like this: `getStaticProps` -> a cached fetch or `'use cache'`; `getServerSideProps` -> a dynamic server component that reads request data; `getStaticPaths` -> `generateStaticParams`; `pages/api/*` -> `app/**/route.ts` route handlers.",
      ],
      why: "Interviewers ask this to see whether you know modern Next.js or only older tutorials, and whether you could migrate an existing Pages Router app.",
      analogy: "The Pages Router is a building where every room is a separate flat with its own front door. The App Router is a building with shared corridors (layouts): you walk between rooms without leaving the corridor, and only the room changes.",
      code: [
        {
          lang: 'tsx',
          title: 'Pages Router: data comes from a special exported function',
          source: `// pages/jobs/[id].tsx
export async function getServerSideProps({ params }) {
  const job = await fetch(\`https://api.example.com/jobs/\${params.id}\`).then((r) => r.json());
  return { props: { job } };
}

export default function JobPage({ job }) {
  return <h1>{job.title}</h1>;
}`,
        },
        {
          lang: 'tsx',
          title: 'App Router: the component itself is async and runs on the server',
          source: `// app/jobs/[id]/page.tsx
export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // params is a Promise in Next.js 15+
  const job = await fetch(\`https://api.example.com/jobs/\${id}\`).then((r) => r.json());
  return <h1>{job.title}</h1>;
}`,
        },
      ],
      output: "Both render the job title as HTML on the server. In the App Router version the component code never ships to the browser, because it's a Server Component, so the page sends less JavaScript.",
      questions: [
        { q: 'What is the main difference between the App Router and the Pages Router?', a: 'The App Router uses React Server Components by default, nested layouts, streaming, and data fetching with plain `await` in components. The Pages Router uses client components and page-level functions like `getServerSideProps`.' },
        { q: 'Can you use both routers in one app?', a: 'Yes, they can coexist, which allows incremental migration route by route. The same URL can\'t be defined in both.' },
        { q: 'What replaces getStaticPaths in the App Router?', a: '`generateStaticParams`, exported from a dynamic route segment, returns the list of params to prerender at build time.' },
        { q: 'Is the Pages Router deprecated?', a: 'No, it is still supported and maintained, but new features target the App Router and new projects default to it.' },
      ],
      answer30: "The Pages Router is the older model: files in pages, everything is a client component, and data comes from getServerSideProps or getStaticProps. The App Router, in the app folder, is the modern default: components are Server Components unless marked 'use client', you fetch by awaiting inside the component, layouts nest and persist across navigation, and you get streaming, loading and error files, and Server Actions. Both can coexist, so you can migrate one route at a time.",
      mistakes: [
        "Using `getServerSideProps` inside `app/`. It does nothing there.",
        "Saying the App Router is 'server-side only'. Client Components still exist; you opt in with `'use client'`.",
        "Forgetting that in Next.js 15+ `params` and `searchParams` are Promises and must be awaited.",
        "Trap: 'Does a layout re-render when you navigate between its child pages?' No. Layouts keep their state; only the page segment changes. That's why reading the current path in a layout needs a Client Component with `usePathname`.",
      ],
      takeaway: 'App Router = Server Components, nested layouts, streaming; Pages Router = older, client-first, page-level data functions.',
    },

    {
      id: 'routing-layouts-special-files',
      title: 'File-based routing, layouts, loading and error files',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Folders become URL segments; special files like `page`, `layout`, `loading`, `error`, and `not-found` define what each segment shows.',
      what: [
        "In the App Router, each folder inside `app/` is a URL segment. A folder only becomes a visitable page when it contains a `page.tsx`. So `app/jobs/new/page.tsx` serves `/jobs/new`.",
        "Special files give each segment behavior: `layout.tsx` wraps child pages and persists between them, `loading.tsx` shows while the page loads, `error.tsx` catches errors, and `not-found.tsx` handles 404s.",
      ],
      deeper: [
        "The root `app/layout.tsx` is required and must render `<html>` and `<body>`. Nested layouts wrap their children, so a `/dashboard` layout with a sidebar stays mounted while you move between `/dashboard/jobs` and `/dashboard/settings`.",
        "`loading.tsx` is sugar for a React `<Suspense>` boundary around the page, enabling streaming: the layout appears instantly, the fallback shows, then the page streams in. `error.tsx` is a React error boundary and must be a Client Component (`'use client'`); it receives the `error` and a function to retry. It doesn't catch errors in the layout of the same segment; put an `error.tsx` one level up, or `global-error.tsx` for the root layout.",
        "Other conventions: route groups `(marketing)` organise files without changing the URL, private folders `_components` are ignored by routing, `template.tsx` is like a layout but remounts on every navigation, and parallel routes `@slot` render several pages in one layout (each slot needs a `default.tsx` in Next.js 16).",
      ],
      why: "Routing by convention means no route config file to keep in sync, and loading and error states are designed per section instead of one global spinner.",
      analogy: "A set of nested picture frames. The outer frame (root layout) never changes; inner frames (nested layouts) hold for a whole section; the picture (page) is the only thing you swap. Loading and error files are the 'coming soon' and 'damaged, try again' cards you slip into a frame.",
      code: [
        {
          lang: 'text',
          title: 'Folder structure and the URLs it creates',
          source: `app/
  layout.tsx              -> wraps every page (html, body)
  page.tsx                -> /
  (marketing)/about/page.tsx  -> /about   (group name not in URL)
  dashboard/
    layout.tsx            -> sidebar, stays mounted under /dashboard/*
    loading.tsx           -> fallback while a dashboard page loads
    error.tsx             -> catches errors in dashboard pages
    page.tsx              -> /dashboard
    jobs/page.tsx         -> /dashboard/jobs
    _components/Chart.tsx -> private, not a route`,
        },
        {
          lang: 'tsx',
          title: 'Layout and error boundary',
          source: `// app/dashboard/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid">
      <nav>Jobs | Candidates | Settings</nav>
      <main>{children}</main>
    </div>
  );
}

// app/dashboard/error.tsx
'use client'; // error boundaries must be Client Components

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <p>Something went wrong loading this section.</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}`,
        },
      ],
      output: "Going from /dashboard to /dashboard/jobs keeps the nav mounted and swaps only `main`. While the jobs page fetches data, `loading.tsx` shows. If the jobs page throws, the error card replaces just the `main` area and the nav still works.",
      questions: [
        { q: 'How does a folder become a route in the App Router?', a: 'Each folder is a URL segment, but it\'s only publicly reachable when it contains a `page.tsx` (or a `route.ts` for an API).' },
        { q: 'Why must error.tsx be a Client Component?', a: 'It\'s a React error boundary, and it needs client-side interactivity like the `reset` retry button. Error boundaries are a client feature.' },
        { q: 'What does loading.tsx do under the hood?', a: 'It wraps the page in a React Suspense boundary, so the layout renders immediately with the loading UI, and the page streams in when its data is ready.' },
        { q: 'Layout vs template?', a: 'A layout persists across navigations and keeps its state. A template creates a new instance on every navigation, useful when you want effects or animations to rerun.' },
        { q: 'What is a route group?', a: 'A folder in parentheses, like `(auth)`, that groups routes or gives them a separate layout without adding a URL segment.' },
      ],
      answer30: "In the App Router, folders map to URL segments and a page.tsx makes a segment visitable. layout.tsx wraps children and stays mounted across navigation, which is perfect for sidebars. loading.tsx is a Suspense boundary that shows a fallback while the page streams in, and error.tsx is a client-side error boundary with a reset function. I also use route groups in parentheses to organise sections without changing URLs.",
      mistakes: [
        "Forgetting `'use client'` in `error.tsx`. The build fails.",
        "Expecting `error.tsx` to catch errors thrown in the layout of the same folder. It wraps the page, not its sibling layout.",
        "Putting data that changes per page in a layout and expecting it to refresh on navigation. Layouts don't re-render between child pages.",
        "Trap: 'Is every file in app/ a route?' No. Only `page` and `route` files are public; components can be colocated safely.",
      ],
      takeaway: 'Folders are segments, `page` makes them public, layouts persist, `loading` = Suspense, `error` = client error boundary.',
    },

    {
      id: 'server-vs-client-components',
      title: "Server Components vs Client Components ('use client')",
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: "In the App Router everything is a Server Component unless a file starts with 'use client'; push that boundary as far down the tree as you can.",
      what: [
        "**Server Components** run only on the server. They can be `async`, read the database or secrets directly, and their code is never sent to the browser. They cannot use state, effects, or browser events.",
        "**Client Components** are marked with `'use client'` at the top of the file. They are still rendered to HTML on the server first, then hydrated in the browser so they can use `useState`, `useEffect`, `onClick`, and browser APIs.",
      ],
      deeper: [
        "`'use client'` marks a boundary, not a single component: that file and everything it imports become part of the client bundle. So keep it on small leaf components (a like button, a search box), not on a whole page.",
        "Server Components can render Client Components and pass them props, but props must be serializable (plain data, Dates, Promises, JSX). You can't pass a normal function, except a Server Action. A Client Component can't import a Server Component, but it can receive one as `children` (the 'donut' pattern), which is how you wrap server content in a client provider.",
        "Protect server-only modules with `import 'server-only'`: if a Client Component ever imports them, the build fails. Context providers must be Client Components, so you wrap them in a small `'use client'` file and render it in the root layout.",
      ],
      why: "Most UI is static content that doesn't need JavaScript in the browser. Rendering it on the server cuts bundle size, keeps secrets off the client, and lets you fetch data close to the database with no extra API layer.",
      analogy: "A restaurant. The kitchen (server) prepares the dish and you never see the recipe. The table-side items (client) are things you interact with yourself, like the salt shaker. You want most of the work in the kitchen and only the salt shaker on the table.",
      code: {
        lang: 'tsx',
        title: 'Server page with a small client island',
        source: `// app/jobs/[id]/page.tsx  (Server Component: no directive needed)
import { db } from '@/lib/db';          // server-only module, never shipped to the browser
import SaveButton from './SaveButton';

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await db.job.findUnique({ where: { id } }); // direct DB access
  return (
    <article>
      <h1>{job.title}</h1>
      <p>{job.description}</p>
      <SaveButton jobId={job.id} />  {/* serializable prop: a string */}
    </article>
  );
}

// app/jobs/[id]/SaveButton.tsx
'use client';
import { useState } from 'react';

export default function SaveButton({ jobId }: { jobId: string }) {
  const [saved, setSaved] = useState(false);
  return <button onClick={() => setSaved(true)}>{saved ? 'Saved' : 'Save job'}</button>;
}`,
      },
      output: "The browser receives HTML for the whole article, but only the JavaScript for `SaveButton`. The database client and the page's code stay on the server. Clicking the button works after hydration.",
      questions: [
        { q: 'What is the default component type in the App Router?', a: 'Server Component. You opt into a Client Component by putting `\'use client\'` at the top of the file.' },
        { q: 'Are Client Components rendered on the server?', a: 'Yes. They are prerendered to HTML on the server for the first load, then hydrated in the browser. `\'use client\'` means "also runs on the client", not "only on the client".' },
        { q: 'Can a Client Component render a Server Component?', a: 'It can\'t import one, but it can receive one as `children` or another prop from a Server Component parent. That\'s how providers wrap server-rendered pages.' },
        { q: 'When do you need a Client Component?', a: 'When you need state, effects, event handlers, browser APIs like `localStorage`, or hooks-based libraries.' },
        { q: 'Why push \'use client\' down the tree?', a: 'Everything imported by a client file joins the client bundle. Marking only the interactive leaf keeps the rest as server code, so less JavaScript ships.' },
      ],
      answer30: "In the App Router, components are Server Components by default. They run only on the server, can be async, can read the database or secrets directly, and ship no JavaScript. When I need state, effects, or event handlers, I add 'use client' to a small leaf component. Client Components still render to HTML on the server and then hydrate. Props crossing the boundary must be serializable, and I use the server-only package so secrets can't leak into the client bundle.",
      mistakes: [
        "Putting `'use client'` at the top of a whole page just to use one `useState`. Extract the interactive part instead.",
        "Passing a function like `onSave={() => ...}` from a Server Component to a Client Component. Functions aren't serializable (Server Actions are the exception).",
        "Thinking Client Components only render in the browser, then using `window` during render and getting a server error.",
        "Trap: 'Do Server Components replace SSR?' No. SSR renders HTML for the first load; Server Components decide where component code runs. They work together.",
      ],
      takeaway: "Server by default; add 'use client' only to interactive leaves; only serializable props cross the boundary.",
    },

    {
      id: 'data-fetching-caching',
      title: 'Data fetching, caching, and revalidation',
      level: 'advanced',
      priority: 'must',
      frequency: 'very common',
      summary: "Fetch with plain `await` in Server Components; since v15 nothing is cached unless you opt in, and Next.js 16's Cache Components make caching explicit with `'use cache'`.",
      note: "Version-sensitive. Next.js 14 cached `fetch` by default; Next.js 15 flipped that to uncached. Next.js 16 added Cache Components (`cacheComponents: true`), and since 16.4 new `create-next-app` projects enable it by default; the team says it becomes the default for all apps in Next.js 17. Older apps without the flag still use the v15 model with `revalidate` and `fetch` options. Say which model you mean in an interview.",
      what: [
        "In the App Router you fetch data by making a Server Component `async` and `await`ing a `fetch` call or a database query. No `useEffect`, no loading flags for the first render.",
        "Caching decides whether that result is reused or fetched again. **Revalidation** is how a cached result gets refreshed: after a time (time-based) or when you tell Next.js the data changed (on-demand, by tag or path).",
      ],
      deeper: [
        "**Next.js 15 model (no Cache Components):** `fetch` is not cached by default. Opt in per request with `fetch(url, { next: { revalidate: 3600, tags: ['jobs'] } })` or `cache: 'force-cache'`, or per route with `export const revalidate = 3600`. A route that uses no request-time APIs (`cookies()`, `headers()`, `searchParams`) can still be prerendered at build time. GET route handlers are also uncached by default.",
        "**Cache Components model (Next.js 16):** with `cacheComponents: true`, all code runs at request time unless you mark a page, component, or function with `'use cache'`. You set lifetime with `cacheLife('hours')` and label entries with `cacheTag('jobs')`. Request-time data that isn't cached must sit inside a `<Suspense>` boundary, so Next.js can prerender a static shell and stream the dynamic parts (this is Partial Prerendering). The older `dynamic`, `revalidate`, and `fetchCache` route segment options don't apply in this mode.",
        "**Invalidation APIs:** `revalidateTag('jobs', 'max')` marks tagged entries stale with stale-while-revalidate behavior (the single-argument form is deprecated in v16). `updateTag('jobs')`, only inside Server Actions, expires and re-reads immediately so the user sees their own write. `revalidatePath('/jobs')` invalidates a route. `refresh()` re-renders uncached data without touching the cache.",
        "Avoid waterfalls: start independent requests together with `Promise.all`, and wrap slow parts in Suspense so the fast parts show first. React's `cache()` deduplicates the same function call within one request (for example, `getUser()` called in a layout and a page).",
      ],
      why: "Hitting the database or an external API on every request is slow and expensive; caching forever shows stale data. You need explicit control over what's cached, for how long, and how to refresh it after a write.",
      analogy: "A newspaper stand. 'use cache' is printing copies in advance; cacheLife is how long a copy is valid; cacheTag is the section label ('jobs'). When news breaks, revalidateTag tells the stand 'the jobs section is stale, reprint in the background', while updateTag says 'reprint right now, this reader is waiting'.",
      code: [
        {
          lang: 'tsx',
          title: "Next.js 16 with Cache Components: explicit 'use cache'",
          source: `// next.config.ts -> const nextConfig = { cacheComponents: true };

// lib/jobs.ts
import { cacheLife, cacheTag } from 'next/cache';

export async function getOpenJobs(tenantId: string) {
  'use cache';
  cacheLife('hours');          // built-in profile
  cacheTag(\`jobs-\${tenantId}\`);  // label for on-demand invalidation
  return db.job.findMany({ where: { tenantId, status: 'open' } });
}

// app/jobs/page.tsx
import { Suspense } from 'react';
import { cookies } from 'next/headers';

export default function JobsPage() {
  return (
    <>
      <h1>Open jobs</h1>                 {/* static shell, prerendered */}
      <Suspense fallback={<p>Loading jobs...</p>}>
        <JobList />                      {/* request-time part, streamed */}
      </Suspense>
    </>
  );
}

async function JobList() {
  const tenantId = (await cookies()).get('tenant')?.value ?? 'demo';
  const jobs = await getOpenJobs(tenantId);   // served from cache when fresh
  return <ul>{jobs.map((j) => <li key={j.id}>{j.title}</li>)}</ul>;
}

// app/jobs/actions.ts
'use server';
import { updateTag } from 'next/cache';

export async function closeJob(tenantId: string, jobId: string) {
  await db.job.update({ where: { id: jobId }, data: { status: 'closed' } });
  updateTag(\`jobs-\${tenantId}\`); // read-your-writes: next render gets fresh data
}`,
        },
        {
          lang: 'tsx',
          title: 'Next.js 15 model (no Cache Components): fetch options and route config',
          source: `// Revalidate this fetch at most once an hour, and tag it
const res = await fetch('https://api.example.com/jobs', {
  next: { revalidate: 3600, tags: ['jobs'] },
});

// Or for the whole route segment
export const revalidate = 3600;

// Somewhere after a write (Server Action or route handler)
import { revalidateTag } from 'next/cache';
revalidateTag('jobs', 'max'); // Next.js 16 signature: tag + cacheLife profile`,
        },
      ],
      output: "The page heading is prerendered and sent instantly. The job list streams in; repeat visits within the hour hit the cache instead of the database. When a recruiter closes a job, `updateTag` expires that tenant's entry and their next render shows the change immediately.",
      questions: [
        { q: 'Is fetch cached by default in the App Router?', a: 'Not since Next.js 15. Next.js 14 cached fetch by default; 15 made it opt-in with `cache: \'force-cache\'` or `next.revalidate`. With Next.js 16 Cache Components, you cache explicitly with `\'use cache\'`.' },
        { q: "What does 'use cache' do?", a: 'It marks a page, component, or async function as cacheable. Next.js builds the cache key from its arguments and closed-over values, and you control lifetime with `cacheLife` and invalidation with `cacheTag`.' },
        { q: 'revalidateTag vs updateTag?', a: '`revalidateTag(tag, profile)` marks entries stale and refreshes in the background (stale-while-revalidate), fine for content. `updateTag(tag)` works only in Server Actions and expires immediately, so the user who made the change sees it on the next render.' },
        { q: 'How do you avoid request waterfalls in Server Components?', a: 'Start independent fetches at the same time with `Promise.all`, and split slow sections into their own components inside Suspense so they stream without blocking the rest.' },
        { q: 'What is the danger of caching per-user data?', a: 'If the cache key doesn\'t include the user or tenant, one user can be served another\'s data. Pass the user or tenant id as an argument so it becomes part of the key, or don\'t cache it.' },
      ],
      answer30: "In the App Router I fetch by awaiting directly in Server Components. Since Next.js 15, nothing is cached unless I opt in. On Next.js 16 with Cache Components, I mark functions or components with 'use cache', set lifetime with cacheLife, and tag them with cacheTag. Request-specific parts go inside Suspense so the static shell is prerendered and the rest streams. After a write, I call updateTag in the Server Action for read-your-writes, or revalidateTag with a profile for background refresh.",
      mistakes: [
        "Quoting Next.js 14 behavior ('fetch is cached forever by default') as current.",
        "Calling `revalidateTag('jobs')` with one argument in Next.js 16. It's deprecated; pass a profile like `'max'`, or use `updateTag` in Actions.",
        "Caching a function that reads `cookies()` inside it. Read request data outside, and pass the value in as an argument.",
        "Sequential awaits for independent data, causing a waterfall.",
        "Trap: 'Why does my page show old data after a deploy-free DB change?' It was prerendered or cached and nothing invalidated it. Add a tag and revalidate on write, or make that part request-time.",
      ],
      takeaway: "Since v15 caching is opt-in; in v16 use 'use cache' + cacheLife + cacheTag, and invalidate with updateTag or revalidateTag.",
    },

    {
      id: 'rendering-strategies',
      title: 'Rendering strategies: SSR, SSG, ISR, CSR, streaming, PPR',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Where and when HTML is produced: at build time (SSG), per request (SSR), rebuilt in the background (ISR), in the browser (CSR), or a mix streamed in pieces.',
      what: [
        "**SSG (static generation):** HTML is built once at build time and served from a CDN. Fastest, but content is fixed until the next build or revalidation.",
        "**SSR (server-side rendering):** HTML is built on the server for every request. Always fresh and can be personalized, but each request costs server time.",
        "**ISR (incremental static regeneration):** static pages that get rebuilt in the background after a time limit or an on-demand trigger. **CSR (client-side rendering):** the browser fetches data and renders, like a classic SPA.",
      ],
      deeper: [
        "In the App Router you rarely pick a mode by name. Next.js decides per route: if a route uses no request-time data (cookies, headers, searchParams, uncached data), it's prerendered (static). If it does, it's rendered at request time (dynamic). Adding `revalidate` or `cacheLife` turns static into ISR-style behavior.",
        "**Streaming** sends HTML in chunks: the layout and the parts that are ready go first, and each `<Suspense>` boundary streams in when its data resolves. Users see content sooner and the slowest query doesn't block the whole page.",
        "**Partial Prerendering (PPR)** combines both in one route: a static shell from the CDN plus dynamic holes streamed in the same response. In Next.js 16 it's delivered through Cache Components. `next build` output marks each route as static, dynamic, or partially prerendered.",
        "CSR still has a place in Next.js: inside Client Components for highly interactive, user-specific widgets (with a library like SWR or TanStack Query), where SEO doesn't matter.",
      ],
      why: "Different pages have different needs. A marketing page should be static and instant; a recruiter's inbox must be fresh and personal; a product list can be a few minutes stale. Choosing per route balances speed, freshness, and server cost.",
      analogy: "A bakery. SSG is bread baked before opening. SSR is baking each loaf when a customer orders. ISR is baked bread that's swapped for a fresh batch every hour. CSR is handing over a bread kit to bake at home. Streaming is serving the starter while the main course is still in the oven.",
      code: {
        lang: 'tsx',
        title: 'How each strategy looks in the App Router',
        source: `// SSG: no request data -> prerendered at build
export default async function AboutPage() {
  return <h1>About us</h1>;
}

// ISR (v15-style): static, rebuilt at most every 10 minutes
export const revalidate = 600;
export default async function PricingPage() {
  const plans = await fetch('https://api.example.com/plans', { next: { revalidate: 600 } }).then((r) => r.json());
  return <PlanTable plans={plans} />;
}

// SSR: reads request-time data -> dynamic
import { cookies } from 'next/headers';
export default async function InboxPage() {
  const session = (await cookies()).get('session')?.value;
  const messages = await getMessages(session);
  return <MessageList messages={messages} />;
}

// Streaming: fast parts first, slow part streams when ready
import { Suspense } from 'react';
export default function CandidatePage() {
  return (
    <>
      <CandidateHeader />
      <Suspense fallback={<p>Scoring...</p>}>
        <AiScoreCard />  {/* slow AI call */}
      </Suspense>
    </>
  );
}`,
      },
      output: "`next build` lists /about as static, /pricing as static with a 10 minute revalidate, and /inbox as dynamic. On the candidate page the header appears immediately and the score card replaces 'Scoring...' when the AI call finishes.",
      questions: [
        { q: 'SSR vs SSG?', a: 'SSG builds HTML once at build time and serves it from a CDN; SSR builds HTML on every request. SSG is faster and cheaper; SSR is always fresh and can be personalized.' },
        { q: 'What is ISR?', a: 'Incremental Static Regeneration: a static page that is regenerated in the background after a revalidate time or an on-demand trigger, so users get static speed with reasonably fresh data.' },
        { q: 'How does Next.js decide if an App Router route is static or dynamic?', a: 'If rendering uses request-time data like cookies, headers, searchParams, or uncached data, it\'s dynamic. Otherwise it\'s prerendered at build time.' },
        { q: 'What is streaming and why does it help?', a: 'Sending HTML in chunks as each Suspense boundary resolves. The user sees the shell and fast content right away instead of waiting for the slowest query.' },
        { q: 'What is Partial Prerendering?', a: 'A static shell prerendered and served instantly, with dynamic sections streamed into it in the same response. In Next.js 16 it comes through Cache Components.' },
      ],
      answer30: "SSG renders HTML at build time and serves it from a CDN; SSR renders on every request for fresh, personalized pages; ISR is static plus background regeneration after a time or on demand; CSR renders in the browser. In the App Router, Next.js picks static or dynamic per route based on whether you use request-time data. Streaming with Suspense sends the fast parts first, and Partial Prerendering in Next.js 16 mixes a static shell with dynamic holes in one response.",
      mistakes: [
        "Reading `cookies()` in the root layout, which makes every route dynamic.",
        "Treating SSR as always better for SEO. Static pages are just as crawlable and faster.",
        "Choosing SSR for content that only changes daily. ISR or caching is cheaper.",
        "Trap: 'Is CSR bad for SEO?' Google can render JavaScript, but slower and less reliably, and other crawlers and link previews may not. For public pages, send HTML.",
      ],
      takeaway: 'Static when you can, dynamic when you must, stream the slow parts; ISR and PPR sit in between.',
    },

    {
      id: 'server-actions',
      title: 'Server Actions',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: "Async functions marked 'use server' that the client can call like a function; Next.js turns them into POST endpoints for you.",
      what: [
        "A Server Action is an async function with the `'use server'` directive. You can pass it to a form's `action` prop or call it from a Client Component. Next.js handles the network request; you just write the function.",
        "They are meant for **mutations**: creating, updating, deleting. After the change, you revalidate cached data or redirect.",
      ],
      deeper: [
        "Under the hood each action gets an id and becomes a POST endpoint. A `<form action={createJob}>` works even before JavaScript loads (progressive enhancement); the action receives `FormData`.",
        "In React 19, `useActionState` gives you the action's returned state (for validation errors) and a pending flag, and `useFormStatus` lets a submit button show 'Saving...'.",
        "**Security:** every Server Action is a public HTTP endpoint, even if no page shows its button. Always check authentication and authorization inside the action, and validate input (for example with Zod). Next.js encrypts closed-over values and uses unguessable action ids, and checks the Origin header, but that's not a substitute for auth checks. The default request body limit is 1 MB (`serverActions.bodySizeLimit`).",
        "Use route handlers instead when someone other than your own UI calls the endpoint: webhooks, mobile apps, or third parties.",
      ],
      why: "Before Server Actions, a form needed an API route, a fetch call, JSON parsing, loading state, and manual cache refreshing. Actions collapse that into one typed function next to the UI.",
      analogy: "A pneumatic tube in a bank. You put the form in the tube at the counter, it lands straight at the back office, and the clerk does the work. You never walk to the back office yourself, but the back office still checks your ID.",
      code: {
        lang: 'tsx',
        title: 'Form with validation, auth check, and read-your-writes',
        source: `// app/jobs/new/actions.ts
'use server';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { updateTag } from 'next/cache';
import { getSession } from '@/lib/auth';

const JobSchema = z.object({ title: z.string().min(3), location: z.string().min(2) });

export async function createJob(prevState: { error?: string }, formData: FormData) {
  const session = await getSession();                 // 1) authenticate
  if (!session || session.role !== 'recruiter') return { error: 'Not allowed' }; // 2) authorize

  const parsed = JobSchema.safeParse(Object.fromEntries(formData)); // 3) validate
  if (!parsed.success) return { error: 'Title and location are required' };

  const job = await db.job.create({ data: { ...parsed.data, tenantId: session.tenantId } });
  updateTag(\`jobs-\${session.tenantId}\`);             // 4) refresh cached lists
  redirect(\`/jobs/\${job.id}\`);                        // 5) navigate
}

// app/jobs/new/page.tsx
'use client';
import { useActionState } from 'react';
import { createJob } from './actions';

export default function NewJobPage() {
  const [state, formAction, pending] = useActionState(createJob, {});
  return (
    <form action={formAction}>
      <input name="title" placeholder="Job title" />
      <input name="location" placeholder="Location" />
      {state.error && <p role="alert">{state.error}</p>}
      <button disabled={pending}>{pending ? 'Saving...' : 'Create job'}</button>
    </form>
  );
}`,
      },
      output: "Submitting an empty title shows 'Title and location are required' without a page reload. A valid submit creates the job for the recruiter's tenant, expires the tenant's cached job list, and redirects to the new job page.",
      questions: [
        { q: 'What is a Server Action?', a: "An async function marked `'use server'` that runs on the server but can be called from a form or Client Component. Next.js turns it into a POST endpoint behind the scenes." },
        { q: 'Are Server Actions secure by default?', a: 'No. Each one is a publicly reachable endpoint. You must authenticate, authorize, and validate input inside every action, just like an API route.' },
        { q: 'Server Action vs route handler?', a: 'Use Server Actions for mutations triggered by your own UI. Use route handlers for endpoints others call: webhooks, mobile clients, public APIs, or GET endpoints.' },
        { q: 'How do you show validation errors from an action?', a: 'Return an object from the action and read it with React 19\'s `useActionState`, which also gives a pending flag.' },
        { q: 'Do Server Actions work without JavaScript?', a: 'Yes, when used as a form `action` in a Server Component form; the browser does a normal POST. That\'s progressive enhancement.' },
      ],
      answer30: "Server Actions are async functions marked 'use server' that I can pass straight to a form's action or call from a client component. Next.js turns them into POST endpoints, so I skip writing an API route and a fetch call. Inside, I always check the session, authorize, and validate input with Zod, because every action is a public endpoint. Then I update the cache with updateTag or revalidatePath and redirect. For webhooks or external clients I use route handlers instead.",
      mistakes: [
        "Skipping auth checks because 'the button is only shown to admins'. The endpoint can still be called directly.",
        "Trusting a `tenantId` or `userId` from FormData instead of the session.",
        "Using Server Actions for data reads. They're POST requests, run one at a time per client, and aren't cached; read in Server Components instead.",
        "Trap: 'Can you call `redirect()` inside try/catch?' `redirect` works by throwing a special error. If you catch it, the redirect doesn't happen; call it outside the try block.",
      ],
      takeaway: "'use server' turns a function into a POST endpoint; treat it as public and authorize every call.",
    },

    {
      id: 'route-handlers',
      title: 'Route handlers (API endpoints)',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'A `route.ts` file exports functions named after HTTP methods and returns standard Web `Response` objects.',
      what: [
        "Route handlers are the App Router's API routes. Create `app/api/jobs/route.ts` and export `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, or `OPTIONS`. Each receives a standard `Request` and returns a `Response`.",
        "They replace `pages/api/*` from the Pages Router, and use Web APIs (`Request`, `Response`, `Headers`) instead of Express-style `req` and `res`.",
      ],
      deeper: [
        "`NextRequest` and `NextResponse` extend the Web types with helpers like `request.nextUrl.searchParams` and `NextResponse.json()`. Dynamic segments work as in pages: the second argument has `params`, which is a Promise you `await`.",
        "Since Next.js 15, GET handlers are not cached by default. A folder can't have both `page.tsx` and `route.ts`, because they'd answer the same URL.",
        "Good uses: webhooks from Stripe or an ATS (you need the raw body to verify the signature, via `await request.text()`), endpoints for a mobile app, file downloads, health checks, OAuth callbacks, and streaming responses for AI output.",
      ],
      why: "Some callers aren't your React UI: payment providers, mobile apps, cron jobs, other services. They need a normal HTTP endpoint with a stable URL and full control over status codes and headers.",
      analogy: "Server Actions are the internal phone line between your own departments. Route handlers are the public reception desk with a published address, open to any visitor who follows the rules.",
      code: {
        lang: 'ts',
        title: 'REST-style handlers with params, validation, and status codes',
        source: `// app/api/jobs/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const job = await db.job.findFirst({ where: { id, tenantId: session.tenantId } });
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(job);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  if (typeof body.title !== 'string') {
    return NextResponse.json({ error: 'title must be a string' }, { status: 400 });
  }
  const job = await db.job.update({ where: { id, tenantId: session.tenantId }, data: { title: body.title } });
  return NextResponse.json(job);
}`,
      },
      output: "`GET /api/jobs/abc` returns 401 without a session, 404 if the job isn't in the caller's tenant, otherwise the job as JSON. `PATCH` with `{ \"title\": 42 }` returns 400.",
      questions: [
        { q: 'How do you create an API endpoint in the App Router?', a: 'Add a `route.ts` file in a folder under `app/` and export functions named after HTTP methods, like `GET` and `POST`, that return a Response.' },
        { q: 'Are GET route handlers cached?', a: 'Not by default since Next.js 15. You can opt in, for example with route config in the v15 model or by calling a `\'use cache\'` function with Cache Components.' },
        { q: 'Why use a route handler for a webhook instead of a Server Action?', a: 'Webhooks come from an external service that needs a stable URL, and you need the raw request body and headers to verify the signature. Server Actions are meant for your own UI.' },
        { q: 'Can page.tsx and route.ts be in the same folder?', a: 'No, both would handle the same URL, so Next.js reports a conflict.' },
      ],
      answer30: "Route handlers are the App Router's API endpoints: a route.ts file exporting GET, POST and so on, using standard Request and Response objects. I use them for anything called from outside my own UI: webhooks, mobile apps, OAuth callbacks, file downloads, or streamed AI responses. Inside, I authenticate, scope queries by the caller's tenant, validate input, and return proper status codes. Since Next.js 15, GET handlers aren't cached by default.",
      mistakes: [
        "Calling your own route handler from a Server Component with `fetch('/api/...')`. It's an extra network hop; call the data function directly.",
        "Reading `await request.json()` in a webhook before verifying the signature. You need the raw text for verification.",
        "Expecting Express-style `res.status(200).send()`. Return a `Response` instead.",
        "Trap: 'Does middleware/proxy protect my API routes so I can skip checks?' No. Check auth inside the handler too; proxy is an optimistic first filter.",
      ],
      takeaway: '`route.ts` + exported HTTP method functions + Web Request/Response; use it for external callers.',
    },

    {
      id: 'middleware-proxy',
      title: 'Middleware (now proxy.ts in Next.js 16)',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Code that runs before a request reaches a route, for redirects, rewrites, and headers; renamed from `middleware.ts` to `proxy.ts` in Next.js 16.',
      note: "Next.js 16 renamed `middleware.ts` to `proxy.ts` (export a function named `proxy`), and it runs on the Node.js runtime. `middleware.ts` still works for Edge runtime cases but is deprecated. Interviewers may say either name.",
      what: [
        "Proxy (formerly middleware) is one file at the project root that runs before matched requests are handled. It can redirect, rewrite to a different path, set headers and cookies, or return a response early.",
        "Typical uses: send logged-out users to `/login`, redirect old URLs, pick a locale, add security headers, or run A/B test bucketing.",
      ],
      deeper: [
        "A `config.matcher` limits which paths it runs on. Without it, it runs on every request, including static assets, which wastes time. Keep it fast: it sits in front of every matched request.",
        "Treat it as an **optimistic** check: read a session cookie and redirect if it's missing, but don't do full permission checks or database-heavy work there. In March 2025 a vulnerability (CVE-2025-29927) let attackers skip middleware with a crafted header on unpatched versions, which showed why auth must also be enforced where data is read: in Server Components, Server Actions, and route handlers.",
        "The rename to 'proxy' signals its job: it's a network boundary in front of your app, like a reverse proxy, not a general-purpose request pipeline like Express middleware.",
      ],
      why: "Some decisions must happen before rendering starts, like redirecting an unauthenticated user or rewriting a path for a locale. Doing it once at the edge of the app avoids repeating it in every page.",
      analogy: "A building's security guard at the front gate. The guard checks for a badge and turns people away early, but each office (route) still checks whether you're allowed in that specific room.",
      code: {
        lang: 'ts',
        title: 'proxy.ts: optimistic auth redirect and a header',
        source: `// proxy.ts  (project root, next to app/)
import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has('session');
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/dashboard') && !hasSession) {
    const url = new URL('/login', request.url);
    url.searchParams.set('next', pathname);       // come back after login
    return NextResponse.redirect(url);
  }

  const res = NextResponse.next();
  res.headers.set('X-Frame-Options', 'DENY');
  return res;
}

export const config = {
  // Skip static files and images
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};`,
      },
      output: "Visiting /dashboard/jobs without a session cookie redirects to /login?next=%2Fdashboard%2Fjobs. Every other matched response gets an `X-Frame-Options: DENY` header. Static files skip the proxy entirely.",
      questions: [
        { q: 'What is middleware in Next.js?', a: 'Code that runs before a request is routed, able to redirect, rewrite, set headers or cookies, or respond early. In Next.js 16 the file is called `proxy.ts`.' },
        { q: 'Should you do all authorization in middleware?', a: 'No. Use it for a quick optimistic check, like "is there a session cookie", and enforce real authorization next to the data in Server Components, Server Actions, and route handlers.' },
        { q: 'What does the matcher do?', a: 'It limits which request paths run the proxy, so static assets and images don\'t pay the cost.' },
        { q: 'Redirect vs rewrite?', a: 'A redirect tells the browser to go to a new URL (the address bar changes). A rewrite serves content from a different path while the URL stays the same.' },
      ],
      answer30: "Middleware, renamed to proxy.ts in Next.js 16, runs before a request reaches a route. I use it for quick decisions: redirecting users without a session cookie to login, locale redirects, rewrites, and security headers, with a matcher so static assets skip it. I treat it as an optimistic check only. Real authorization lives next to the data, in Server Components, actions, and route handlers, which also protects you if the proxy is ever bypassed, as happened with a 2025 CVE.",
      mistakes: [
        "No matcher, so every image and JS chunk runs the proxy.",
        "Querying the database on every request from the proxy.",
        "Relying on it as the only auth layer.",
        "Trap: 'Is Next.js middleware like Express middleware?' No. There's one file, it can't chain handlers per route, and it shouldn't do business logic. It's a gate in front of the app.",
      ],
      takeaway: 'proxy.ts (formerly middleware) = fast gate for redirects and headers; never your only auth check.',
    },

    {
      id: 'dynamic-routes-static-params',
      title: 'Dynamic routes and generateStaticParams',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Square-bracket folders like `[id]` capture URL parts; `generateStaticParams` lists which ones to prerender at build time.',
      what: [
        "A folder named in square brackets is a **dynamic segment**: `app/blog/[slug]/page.tsx` matches `/blog/hello` and `/blog/next-16`, and the page receives `{ slug: 'hello' }` in `params`.",
        "`generateStaticParams` is a function you export from that route to return the list of params to build ahead of time, so those pages are static HTML.",
      ],
      deeper: [
        "Variants: `[...slug]` is a catch-all (`/docs/a/b` gives `slug: ['a', 'b']`) and `[[...slug]]` is an optional catch-all that also matches `/docs`.",
        "In Next.js 15+ `params` and `searchParams` are Promises: `const { slug } = await params`. In Client Components you can read them with `useParams()` and `useSearchParams()`, or unwrap the Promise with React's `use()`.",
        "Params not returned by `generateStaticParams` are rendered on demand at first request and then cached. Set `export const dynamicParams = false` to return 404 for anything not in the list. A common pattern is to prerender the top 100 popular pages and generate the long tail on demand.",
        "Call `notFound()` from `next/navigation` when the record doesn't exist; it renders the nearest `not-found.tsx` with a 404 status.",
      ],
      why: "You can't create a file for every blog post or job. Dynamic segments give one template for many URLs, and generateStaticParams lets the popular ones be as fast as static files.",
      analogy: "A form letter with a blank for the name. The template is the dynamic route; generateStaticParams is printing letters in advance for the people you know will come, and printing on demand for anyone else.",
      code: {
        lang: 'tsx',
        title: 'Blog post route with prerendered slugs',
        source: `// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const posts = await getAllPosts();          // runs at build time
  return posts.map((p) => ({ slug: p.slug }));  // [{ slug: 'hello' }, { slug: 'next-16' }]
}

export const dynamicParams = true; // default: unknown slugs render on demand

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();                     // renders not-found.tsx, status 404
  return <article><h1>{post.title}</h1></article>;
}`,
      },
      output: "`next build` prerenders /blog/hello and /blog/next-16. A request for a new slug added later renders on first visit and is then cached. A slug with no post returns the 404 page.",
      questions: [
        { q: 'How do you create a dynamic route in the App Router?', a: 'Name the folder in square brackets, like `app/jobs/[id]/page.tsx`. The page receives the value in `params`, which you await in Next.js 15+.' },
        { q: 'What does generateStaticParams do?', a: 'It returns the list of param values to prerender at build time for a dynamic route, replacing `getStaticPaths` from the Pages Router.' },
        { q: 'What happens to params not returned by generateStaticParams?', a: 'By default they render on demand on first request. With `dynamicParams = false` they return 404.' },
        { q: 'Catch-all vs optional catch-all?', a: '`[...slug]` matches one or more segments; `[[...slug]]` also matches zero segments, so the base path works too.' },
      ],
      answer30: "A folder in square brackets, like [slug], is a dynamic segment, and the page gets the value through params, which is a Promise since Next.js 15. generateStaticParams returns the params to prerender at build time; it replaces getStaticPaths. Anything not in the list renders on demand by default, or returns 404 if dynamicParams is false. I call notFound() when the record doesn't exist so the user gets a real 404.",
      mistakes: [
        "Accessing `params.slug` without awaiting `params` in Next.js 15+.",
        "Generating thousands of pages at build time and making builds very slow. Prerender the popular ones only.",
        "Returning `null` for a missing record instead of calling `notFound()`, which sends a 200 status for a missing page.",
        "Trap: 'Does generateStaticParams run on every request?' No, at build time (and it can't use request data like cookies).",
      ],
      takeaway: '`[param]` folders for dynamic URLs, `await params`, generateStaticParams for build-time pages, `notFound()` for misses.',
    },

    {
      id: 'metadata-seo',
      title: 'Metadata and SEO',
      level: 'basic',
      priority: 'good',
      frequency: 'common',
      summary: 'Export a `metadata` object or a `generateMetadata` function from a layout or page; Next.js renders the `<title>`, meta, and Open Graph tags.',
      what: [
        "In the App Router you don't write `<head>` tags by hand. You export `metadata` (static) or `generateMetadata` (based on data) from a `layout.tsx` or `page.tsx`, and Next.js puts the right tags in the HTML.",
        "Metadata merges from the root layout down: a page can override the title while keeping the site-wide description and icons.",
      ],
      deeper: [
        "`title.template` in the root layout (`'%s | Acme Jobs'`) lets each page set only its own part. `openGraph` and `twitter` fields control link previews. `alternates.canonical` avoids duplicate-content issues.",
        "File conventions generate SEO files: `app/sitemap.ts`, `app/robots.ts`, `opengraph-image.tsx` (generated images), and `icon.png`. Metadata only works in Server Components.",
        "`generateMetadata` and the page often need the same record. Wrap the data function in React's `cache()` (or `'use cache'`) so it runs once per request.",
        "SEO also depends on rendering: server-rendered HTML, real links with `<Link>`, correct 404 status via `notFound()`, and good Core Web Vitals.",
      ],
      why: "Search engines and social platforms read the HTML head. Good titles, descriptions, and preview images directly affect click-through, and getting them per page by hand is error-prone.",
      analogy: "The label on a jar. The shop (search engine) doesn't open every jar; it reads the label. Metadata is how each page prints its own accurate label.",
      code: {
        lang: 'tsx',
        title: 'Site defaults plus per-page dynamic metadata',
        source: `// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://jobs.example.com'),
  title: { default: 'Acme Jobs', template: '%s | Acme Jobs' },
  description: 'Find your next role.',
};

// app/jobs/[id]/page.tsx
import type { Metadata } from 'next';
import { cache } from 'react';

const getJob = cache(async (id: string) => db.job.findUnique({ where: { id } }));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const job = await getJob(id);
  return {
    title: job?.title ?? 'Job not found',
    description: job?.summary,
    openGraph: { title: job?.title, images: [\`/api/og?job=\${id}\`] },
    alternates: { canonical: \`/jobs/\${id}\` },
  };
}

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await getJob(id); // same request -> cached, no second DB query
  return <h1>{job?.title}</h1>;
}`,
      },
      output: "The job page's HTML has `<title>Senior Node Engineer | Acme Jobs</title>`, a description, Open Graph tags, and a canonical link. The database is queried once even though both functions ask for the job.",
      questions: [
        { q: 'How do you set the page title in the App Router?', a: 'Export a `metadata` object or a `generateMetadata` function from the page or layout. Next.js renders the head tags.' },
        { q: 'What is title.template?', a: 'A pattern like `\'%s | Acme\'` in a parent layout; child pages set only their own title and it gets inserted into the pattern.' },
        { q: 'How do you avoid fetching the same data twice for metadata and the page?', a: 'Wrap the data function in React\'s `cache()` (or use `\'use cache\'`), which deduplicates calls with the same arguments within one request.' },
        { q: 'How do you add a sitemap?', a: 'Create `app/sitemap.ts` that returns an array of URLs; Next.js serves it at /sitemap.xml. `app/robots.ts` works the same way.' },
      ],
      answer30: "In the App Router I export a metadata object for static pages or generateMetadata for data-driven ones, from layouts or pages, and Next.js renders the head tags. The root layout sets defaults like a title template and metadataBase, and pages override what they need, including Open Graph images and canonical URLs. I wrap shared data functions in React's cache so metadata and page don't query twice, and add sitemap.ts and robots.ts. Server rendering and correct 404s matter for SEO too.",
      mistakes: [
        "Using `next/head` in the App Router. It's a Pages Router API.",
        "Exporting `metadata` from a Client Component. It's only read from Server Components.",
        "Forgetting `metadataBase`, so relative Open Graph image URLs break.",
        "Trap: 'Does a 200 page that says Not Found hurt SEO?' Yes, it's a soft 404. Call `notFound()` to send a real 404 status.",
      ],
      takeaway: 'Export `metadata` or `generateMetadata`; layouts set defaults, pages override; dedupe data with `cache()`.',
    },

    {
      id: 'image-font-script-optimization',
      title: 'Image, font, and script optimization',
      level: 'basic',
      priority: 'good',
      frequency: 'common',
      summary: '`next/image` resizes and lazy-loads images, `next/font` self-hosts fonts with no layout shift, and `next/script` controls when third-party scripts load.',
      what: [
        "`<Image>` from `next/image` serves images in the right size and modern formats (like WebP or AVIF), lazy-loads them by default, and reserves space so the page doesn't jump.",
        "`next/font` downloads Google or local fonts at build time and serves them from your own domain. `<Script>` from `next/script` lets you choose when a third-party script loads so it doesn't block the page.",
      ],
      deeper: [
        "Images need `width` and `height` (or `fill` with a sized parent) so the browser reserves space, which prevents Cumulative Layout Shift (CLS). Don't lazy-load the main hero image, the Largest Contentful Paint (LCP) element: in Next.js 16 use `loading='eager'` or `fetchPriority='high'` (or `preload`). The old `priority` prop is deprecated since v16 in favor of `preload`. `sizes` tells the browser which width to pick for responsive layouts.",
        "Remote images must be allowed in `next.config` with `images.remotePatterns` (`images.domains` is deprecated in v16). Next.js 16 changed some defaults: `minimumCacheTTL` is now 4 hours, and `qualities` defaults to `[75]`.",
        "`next/font` removes the extra request to Google, avoids layout shift with automatic fallback metrics, and works with CSS variables for Tailwind. `<Script strategy>` options: `beforeInteractive`, `afterInteractive` (default, like analytics), `lazyOnload` (chat widgets), and `worker` (experimental, Partytown).",
      ],
      why: "Images, fonts, and third-party scripts are the usual causes of slow pages and poor Core Web Vitals. These components apply best practices by default so you don't have to remember them for every tag.",
      analogy: "A good tailor. Instead of handing everyone the same giant coat (a 4000px image), they cut a coat to each person's size, mark the space on the rack in advance, and deliver it only when the person reaches the fitting room.",
      code: {
        lang: 'tsx',
        title: 'Hero image, self-hosted font, and a lazy third-party script',
        source: `// app/layout.tsx
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        {children}
        <Script src="https://widget.example.com/chat.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}

// app/page.tsx
import Image from 'next/image';

export default function Home() {
  return (
    <Image
      src="/hero.jpg"
      alt="Recruiters reviewing candidates"
      width={1200}
      height={600}
      loading="eager"             // LCP image: don't lazy-load it
      fetchPriority="high"        // (the old \`priority\` prop is deprecated in v16)
      sizes="(max-width: 768px) 100vw, 1200px"
    />
  );
}

// next.config.ts
// images: { remotePatterns: [{ protocol: 'https', hostname: 'cdn.example.com' }] }`,
      },
      output: "A phone gets a smaller WebP or AVIF version of the hero, with space reserved so text doesn't jump. The Inter font is served from your own domain with no flash of unstyled layout shift, and the chat widget loads only after the page is idle.",
      questions: [
        { q: 'What does next/image do for you?', a: 'Resizes images per device, converts to modern formats, lazy-loads by default, and reserves space with width and height to avoid layout shift.' },
        { q: 'How do you make the hero image load fast?', a: 'The hero is usually the LCP element, so don\'t lazy-load it. In Next.js 16 use `loading="eager"` or `fetchPriority="high"` (or `preload`); the older `priority` prop is deprecated.' },
        { q: 'How do you allow images from an external domain?', a: 'Add the host to `images.remotePatterns` in next.config. `images.domains` is deprecated as of Next.js 16.' },
        { q: 'Why use next/font instead of a Google Fonts link tag?', a: 'Fonts are downloaded at build time and served from your domain, so there\'s no extra third-party request, better privacy, and automatic fallback sizing to avoid layout shift.' },
      ],
      answer30: "next/image serves correctly sized, modern-format images, lazy-loads them, and reserves space so there's no layout shift; I load the hero image eagerly with high fetch priority because it's usually the LCP element, and whitelist external hosts with remotePatterns. next/font self-hosts fonts at build time with fallback metrics to avoid shifts. next/script lets me load analytics after hydration and chat widgets lazily so they don't block the page. Together they target Core Web Vitals.",
      mistakes: [
        "Leaving out `width`/`height` (or `fill` in a sized container).",
        "Lazy-loading the LCP image.",
        "Adding a third-party script in a plain `<script>` tag in the head, blocking rendering.",
        "Trap: 'Does next/image cost anything when self-hosting?' Optimization runs on your server (using `sharp`), using CPU and disk; on Vercel it's metered. Some teams use a CDN image service instead via a custom loader.",
      ],
      takeaway: 'Image: sized, lazy, modern formats, eager for the LCP image. Font: self-hosted, no shift. Script: choose a loading strategy.',
    },

    {
      id: 'authentication-patterns',
      title: 'Authentication patterns in Next.js',
      level: 'advanced',
      priority: 'must',
      frequency: 'common',
      summary: 'Store the session in an httpOnly cookie, check it optimistically in proxy, and verify it again in a data access layer right before reading or changing data.',
      note: "Library landscape moves fast. As of 2026 the Next.js docs list options like Auth.js, Better Auth, Clerk, and others; Auth.js maintenance moved under the Better Auth team in 2025. Name the one you've actually used and focus on the pattern.",
      what: [
        "Authentication answers 'who are you?' and authorization answers 'what may you do?'. In Next.js the session usually lives in an **httpOnly cookie**, which JavaScript in the browser can't read, so XSS can't steal it.",
        "Because Next.js code runs in several places (proxy, Server Components, Server Actions, route handlers), the recommended pattern is a small **data access layer (DAL)**: one `verifySession()` function that every data read and mutation calls.",
      ],
      deeper: [
        "Two session styles: **stateless** (a signed or encrypted JWT in the cookie; no DB lookup, but hard to revoke before expiry) and **database sessions** (the cookie holds a random id; the server looks it up, so logout and revocation are instant).",
        "Layered checks: (1) proxy reads the cookie and redirects to /login if it's missing (fast, optimistic). (2) The DAL verifies the session and role near the data. (3) Server Actions and route handlers call the DAL too, because they're public endpoints. Wrap `verifySession` in React's `cache()` so it runs once per request.",
        "Don't do auth checks in layouts only: layouts don't re-render on client navigation between their pages, and a page's data can be fetched without the layout's check running again. Return only the fields the UI needs (DTOs), never the whole user record with password hashes.",
        "Cookie flags: `httpOnly`, `secure`, `sameSite: 'lax'` (blocks most CSRF), a sensible `maxAge`, and `path: '/'`. For OAuth sign-in (Google, Microsoft), let a library handle the redirect, state, and PKCE.",
        "On your resume: the cookie-based JWT auth with auto-renewal and RBAC you built at Octagnt (see the Projects stack, 'Cookie-based JWT auth with auto-renewal, and RBAC') is the same idea: tokens in httpOnly cookies, and a permission check before every protected action.",
      ],
      why: "Next.js blurs client and server, so it's easy to check auth in one place (a layout or the proxy) and forget another (a Server Action). Centralizing the check next to the data closes those gaps.",
      analogy: "Hotel key cards. The lobby guard (proxy) glances at whether you have a card. Each room door (data access layer) actually reads the card and checks it opens that specific room.",
      code: {
        lang: 'ts',
        title: 'A small data access layer used by pages and actions',
        source: `// lib/dal.ts
import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { decrypt } from '@/lib/session'; // verifies the signed JWT

export const verifySession = cache(async () => {
  const token = (await cookies()).get('session')?.value;
  const session = await decrypt(token);           // null if missing, expired, or tampered
  if (!session?.userId) redirect('/login');
  return { userId: session.userId, tenantId: session.tenantId, role: session.role };
});

export async function getCandidates() {
  const { tenantId, role } = await verifySession();
  if (!['admin', 'recruiter'].includes(role)) throw new Error('Forbidden');
  return db.candidate.findMany({
    where: { tenantId },                          // tenant comes from the session, never the client
    select: { id: true, name: true, stage: true }, // DTO: only what the UI needs
  });
}

// lib/session.ts (on login)
export async function createSession(user: { id: string; tenantId: string; role: string }) {
  const token = await encrypt({ userId: user.id, tenantId: user.tenantId, role: user.role });
  (await cookies()).set('session', token, {
    httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 8,
  });
}`,
      },
      output: "A logged-out request for the candidates page is redirected to /login. A logged-in viewer without the recruiter role gets a Forbidden error. A recruiter sees only their own tenant's candidates, with id, name, and stage, and the session is verified once per request even if several components call it.",
      questions: [
        { q: 'Where should you check authentication in the App Router?', a: 'Optimistically in proxy for fast redirects, and authoritatively in a data access layer called by Server Components, Server Actions, and route handlers, right before data is read or changed.' },
        { q: 'Why not rely on a layout for auth checks?', a: 'Layouts don\'t re-render on navigation between their child pages, and pages, actions, and route handlers can be reached without the layout\'s check. Check close to the data instead.' },
        { q: 'JWT session vs database session?', a: 'A JWT in the cookie needs no DB lookup but can\'t be revoked easily before it expires. A database session stores only an id in the cookie, so you can revoke it instantly at the cost of a lookup.' },
        { q: 'Why store the session in an httpOnly cookie instead of localStorage?', a: 'JavaScript can\'t read httpOnly cookies, so an XSS bug can\'t steal the token. The cookie is also sent automatically to the server, which server rendering needs.' },
      ],
      answer30: "I keep the session in an httpOnly, secure, sameSite cookie. Proxy does a quick check and redirects to login if there's no cookie, but the real check lives in a server-only data access layer: a verifySession function wrapped in React's cache, called by every Server Component, Server Action, and route handler before touching data. It returns the user, tenant, and role from the token, scopes queries by tenant, and returns only the fields the UI needs. At Octagnt I built cookie-based JWT auth with automatic renewal and role-based access in our Node API, and the same layering applies in Next.js.",
      mistakes: [
        "Auth only in proxy or only in a layout.",
        "Reading `tenantId` or `role` from the request body instead of the verified session.",
        "Passing the full user object, including sensitive fields, to a Client Component.",
        "Storing the token in localStorage, which XSS can read.",
        "Trap: 'Is sameSite=lax enough against CSRF for Server Actions?' It blocks most cross-site POSTs, and Next.js also checks the Origin header for actions, but custom route handlers that change data should still verify origin or use CSRF tokens if cookies authenticate them.",
      ],
      takeaway: 'httpOnly cookie session, optimistic proxy check, authoritative check in a data access layer next to the data.',
    },

    {
      id: 'environment-variables',
      title: 'Environment variables',
      level: 'basic',
      priority: 'must',
      frequency: 'common',
      summary: 'Variables are server-only by default; only ones prefixed `NEXT_PUBLIC_` reach the browser, and they are baked in at build time.',
      what: [
        "Next.js loads variables from `.env` files into `process.env`. By default they're only available on the server, so secrets like database URLs and API keys stay private.",
        "To use a value in the browser, prefix it with `NEXT_PUBLIC_`, like `NEXT_PUBLIC_API_URL`. Anything with that prefix is visible to anyone who opens your JavaScript files.",
      ],
      deeper: [
        "Files load in priority order: `.env.$(NODE_ENV).local`, then `.env.local`, then `.env.$(NODE_ENV)`, then `.env`. Real environment variables set by the host override all files. `.env.local` is skipped when `NODE_ENV=test` so tests are reproducible. Commit `.env.example`; never commit `.env.local`.",
        "`NEXT_PUBLIC_` values are **inlined at build time**: the build replaces `process.env.NEXT_PUBLIC_API_URL` with the literal string. So one Docker image can't use different public values per environment unless you rebuild, or you read the value on the server at runtime and pass it down as a prop.",
        "Server-side variables used during dynamic rendering are read at runtime, so they can differ per deployment. Variables read during a static prerender are frozen into that HTML at build time. Next.js 16 removed `serverRuntimeConfig` and `publicRuntimeConfig`; use env variables instead.",
        "Validate env at startup (for example with Zod) so a missing secret fails the deploy loudly instead of causing a confusing error later.",
      ],
      why: "Config changes between local, staging, and production, and secrets must never reach the browser. A clear naming rule makes it obvious what's public.",
      analogy: "Envelopes in an office. Unmarked envelopes stay in the back office (server). Anything stamped 'PUBLIC' gets photocopied into every brochure printed that day, and old brochures keep the old text.",
      code: {
        lang: 'bash',
        title: '.env.local and how each value is used',
        source: `# .env.local  (git-ignored)
DATABASE_URL=mongodb+srv://user:pass@cluster/app   # server only
OPENAI_API_KEY=sk-...                              # server only
NEXT_PUBLIC_API_URL=https://api.example.com        # inlined into client JS at build

# Server Component / route handler / action:
#   process.env.DATABASE_URL        -> works
# Client Component:
#   process.env.DATABASE_URL        -> undefined
#   process.env.NEXT_PUBLIC_API_URL -> 'https://api.example.com' (fixed at build time)`,
      },
      output: "Server code can read all three values. In a Client Component only `NEXT_PUBLIC_API_URL` has a value, and it's the value present when `next build` ran, even if you change it on the server later without rebuilding.",
      questions: [
        { q: 'How do you expose an environment variable to the browser in Next.js?', a: 'Prefix it with `NEXT_PUBLIC_`. Without the prefix, it\'s only available on the server.' },
        { q: 'When are NEXT_PUBLIC_ variables resolved?', a: 'At build time. The build replaces references with the literal value, so changing it later requires a rebuild.' },
        { q: 'What is the load order of .env files?', a: '`.env.{environment}.local`, then `.env.local`, then `.env.{environment}`, then `.env`; real process environment variables override all of them.' },
        { q: 'How do you use one Docker image across staging and production with different public config?', a: 'Don\'t rely on NEXT_PUBLIC_ for values that change per environment. Read a server-side variable at request time and pass it to the client as a prop, or expose it from an endpoint.' },
      ],
      answer30: "Environment variables in Next.js are server-only by default, which keeps secrets out of the browser. To expose one to client code, I prefix it with NEXT_PUBLIC_, knowing it's public and inlined at build time, so a change needs a rebuild. Local secrets go in .env.local, which is git-ignored, and I commit a .env.example. I validate required variables at startup so a missing one fails fast.",
      mistakes: [
        "Putting an API secret behind `NEXT_PUBLIC_` to 'make it work' in a Client Component. Call it from the server instead.",
        "Expecting a `NEXT_PUBLIC_` change on the host to take effect without rebuilding.",
        "Committing `.env.local`.",
        "Trap: 'Can you read `process.env[name]` with a dynamic key in client code?' No. Inlining only works with the literal `process.env.NEXT_PUBLIC_X` form.",
      ],
      takeaway: 'Server-only by default; `NEXT_PUBLIC_` is public and frozen at build time.',
    },

    {
      id: 'deployment-vercel-vs-self-host',
      title: 'Deployment: Vercel vs self-hosting',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: "Vercel runs Next.js with zero config; self-hosting with `next start` or a standalone Docker image works too, but you own caching, scaling, and image optimization.",
      what: [
        "**Vercel** (the company behind Next.js) deploys from Git with no setup: preview URLs per branch, a global CDN, functions that scale automatically, and ISR and image optimization handled for you.",
        "**Self-hosting**: build with `next build`, then run `next start` on any Node server, a container on AWS (ECS, App Runner, or EC2), or Kubernetes. You can also do a fully static export (`output: 'export'`) to S3 + CloudFront if you don't need server features.",
      ],
      deeper: [
        "`output: 'standalone'` copies only the files and dependencies needed to run, producing a small Docker image that you start with `node server.js`.",
        "With several instances behind a load balancer, each one has its own in-memory and disk cache by default. For consistent ISR and `'use cache'` results and on-demand revalidation across instances, configure a shared cache handler (for example backed by Redis). Image optimization uses `sharp` on your server, so plan CPU for it or use a custom loader with an image CDN.",
        "Static export can't use request-time features: no Server Actions, no cookies-based rendering, no ISR, no default image optimization. Next.js 16 also introduced the Build Adapters API (alpha) so other platforms can integrate more deeply.",
        "Trade-off in one line: Vercel buys speed of delivery and managed infrastructure at a usage-based price; self-hosting gives control and possibly lower cost at scale, plus the operational work.",
      ],
      why: "Interviewers want to know you understand what the platform does for you, so you can run Next.js on your company's own cloud (often AWS) without surprises in caching or scaling.",
      analogy: "Vercel is a serviced apartment: furniture, cleaning, and maintenance included, and you pay for it. Self-hosting is renting an empty flat: cheaper and fully yours, but you fix the boiler.",
      code: {
        lang: 'text',
        title: 'Dockerfile for a standalone build (next.config: output: "standalone")',
        source: `FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build            # NEXT_PUBLIC_* values are baked in here

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]`,
      },
      output: "The final image contains only the standalone server, static assets, and public files, so it's much smaller than copying all of `node_modules`. It runs on ECS or any container platform on port 3000.",
      questions: [
        { q: 'Can you deploy Next.js without Vercel?', a: 'Yes. Run `next start` on any Node server or container, use `output: \'standalone\'` for a slim Docker image, or `output: \'export\'` for a fully static site.' },
        { q: 'What do you lose with a static export?', a: 'Anything that needs a server at request time: Server Actions, dynamic rendering with cookies or headers, ISR and on-demand revalidation, and the default image optimizer.' },
        { q: 'What breaks when you run several self-hosted instances?', a: 'Each instance has its own cache, so ISR pages and cached data can differ, and revalidation only hits one instance. Configure a shared cache handler, such as Redis.' },
        { q: 'Why would a company choose self-hosting?', a: 'To keep everything in its own cloud account for compliance, use existing infrastructure, or control cost at high traffic.' },
      ],
      answer30: "Vercel gives zero-config deploys, preview URLs, a CDN, and managed ISR and image optimization. Self-hosting is fully supported: I'd use output standalone in a multi-stage Docker image and run it on ECS behind a load balancer. The catches are that NEXT_PUBLIC values are baked in at build, each instance has its own cache unless I configure a shared cache handler, and image optimization uses my servers' CPU. For a site with no server features, a static export to S3 and CloudFront is simplest.",
      mistakes: [
        "Copying all of `node_modules` into the image instead of using standalone output.",
        "Running several instances without a shared cache and wondering why pages disagree.",
        "Choosing `output: 'export'` and then adding a Server Action.",
        "Trap: 'Is Next.js locked to Vercel?' No. Some features are easiest there, but `next start` and Docker are first-class, and Next.js 16 added Build Adapters for other platforms.",
      ],
      takeaway: 'Vercel = managed and instant; self-host = standalone Docker + shared cache + your own ops.',
    },

    {
      id: 'hydration-errors-pitfalls',
      title: 'Hydration errors and common Next.js pitfalls',
      level: 'advanced',
      priority: 'must',
      frequency: 'very common',
      summary: 'A hydration error means the HTML from the server differs from what React renders first in the browser; the fix is to make the first render identical.',
      what: [
        "**Hydration** is React attaching event handlers to the HTML the server already sent. To do that, React renders the component again in the browser and expects the same result.",
        "If the first browser render differs (different text, attributes, or structure), React logs a hydration mismatch and may throw away the server HTML and re-render on the client, losing the speed benefit.",
      ],
      deeper: [
        "Common causes: `new Date()` or `Math.random()` during render; `typeof window !== 'undefined'` branches; reading `localStorage` during render; locale-dependent formatting that differs between server and browser time zones; invalid HTML nesting like a `<div>` inside a `<p>`; and browser extensions that change the DOM before React hydrates.",
        "Fixes: render a stable value on the server and update after mount in `useEffect`; format dates with a fixed time zone or on the client only; fix the HTML nesting; for a component that truly can't run on the server (a chart library touching `window`), load it with `dynamic(() => import('./Chart'), { ssr: false })` inside a Client Component. `suppressHydrationWarning` is only for single, expected differences like a timestamp.",
        "Other frequent Next.js pitfalls: `'use client'` too high in the tree; secrets imported into client code; a Server Component calling its own `/api` route over HTTP; reading `cookies()` in the root layout and making everything dynamic; waterfall awaits; forgetting that `params` is a Promise; and treating proxy as the only auth check.",
      ],
      why: "Hydration bugs are the most common 'it works locally but logs scary errors' problem in SSR apps, and they're a favorite interview question because the fix shows you understand where code runs.",
      analogy: "A furniture delivery with a floor plan. The server delivers the furniture already placed (HTML). React arrives with the floor plan to plug things in. If the plan says 'sofa by the window' but the sofa is by the door, React gives up and rearranges the room itself.",
      code: {
        lang: 'tsx',
        title: 'A mismatch and two fixes',
        source: `'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Bad: server and browser render different text -> hydration mismatch
function BadClock() {
  return <p>Rendered at {new Date().toLocaleTimeString()}</p>;
}

// Fix 1: same output on both sides first, then update after mount
function GoodClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => setTime(new Date().toLocaleTimeString()), []);
  return <p>Rendered at {time ?? '...'}</p>;
}

// Fix 2: skip server rendering for a browser-only widget
const Chart = dynamic(() => import('./Chart'), { ssr: false, loading: () => <p>Loading chart...</p> });

// Also a mismatch: invalid nesting. <p> cannot contain <div>.
// <p><div>Score</div></p>  ->  use <div><div>Score</div></div>`,
      },
      output: "`BadClock` logs a hydration mismatch because the server's time differs from the browser's. `GoodClock` renders '...' on both sides, then shows the browser's time after mount. The chart is rendered only in the browser, with a loading placeholder in the server HTML.",
      questions: [
        { q: 'What is a hydration error?', a: 'The HTML rendered on the server doesn\'t match what React renders on its first pass in the browser, so React can\'t attach to it cleanly and may re-render on the client.' },
        { q: 'Name common causes of hydration mismatches.', a: 'Dates or random values during render, `typeof window` checks, reading localStorage during render, time zone or locale differences, invalid HTML nesting, and browser extensions modifying the DOM.' },
        { q: 'How do you render something that only works in the browser?', a: 'Render a placeholder first and fill it in `useEffect`, or load the component with `next/dynamic` and `ssr: false` from a Client Component.' },
        { q: 'When is suppressHydrationWarning acceptable?', a: 'For a single element with an expected, harmless difference like a timestamp. It only works one level deep and shouldn\'t hide real bugs.' },
      ],
      answer30: "Hydration is React attaching to server-rendered HTML, and it requires the first browser render to match the server's output. Mismatches usually come from dates, random values, typeof window checks, localStorage, time zones, invalid HTML nesting like a div inside a p, or browser extensions. I fix them by rendering the same value on both sides and updating in useEffect, or by loading browser-only components with next/dynamic and ssr false. suppressHydrationWarning is a last resort for timestamps.",
      mistakes: [
        "Using `typeof window !== 'undefined'` to render different JSX. It's exactly what causes the mismatch.",
        "Spreading `suppressHydrationWarning` everywhere to silence errors.",
        "Using `ssr: false` in a Server Component. It's only allowed in Client Components.",
        "Trap: 'The error only appears for some users.' Suspect browser extensions (password managers, translators) or time zone and locale differences, not your code first.",
      ],
      takeaway: 'First browser render must equal the server HTML; move browser-only values into effects or client-only components.',
    },
  ],

  rapidFire: [
    { q: 'Current major version of Next.js (late 2026)?', a: 'Next.js 16 (16.4 released October 2026), with React 19.x and Turbopack as the default bundler.' },
    { q: 'Default component type in the App Router?', a: 'Server Component; add \'use client\' to opt into a Client Component.' },
    { q: 'Do Client Components render on the server?', a: 'Yes, they are prerendered to HTML and then hydrated in the browser.' },
    { q: 'Which file makes a folder a visitable route?', a: '`page.tsx` (or `route.ts` for an API endpoint).' },
    { q: 'What is loading.tsx under the hood?', a: 'A React Suspense boundary around the page segment.' },
    { q: 'Why must error.tsx be a Client Component?', a: 'It is a React error boundary with a client-side `reset` function.' },
    { q: 'Is fetch cached by default in Next.js 15+?', a: 'No. Caching is opt-in since v15 (it was cached by default in v14).' },
    { q: "What does 'use cache' do?", a: 'Marks a page, component, or function as cacheable, with the key built from its inputs (Cache Components, Next.js 16).' },
    { q: 'updateTag vs revalidateTag?', a: 'updateTag (Server Actions only) expires now for read-your-writes; revalidateTag(tag, profile) refreshes in the background.' },
    { q: 'What replaced getStaticPaths?', a: '`generateStaticParams`.' },
    { q: 'Are params synchronous in Next.js 15+?', a: 'No, `params` and `searchParams` are Promises; await them.' },
    { q: 'What is ISR?', a: 'Static pages regenerated in the background after a time limit or on demand.' },
    { q: 'What is Partial Prerendering?', a: 'A static shell served instantly with dynamic parts streamed in the same response.' },
    { q: 'What is a Server Action?', a: "An async function marked 'use server' that Next.js exposes as a POST endpoint for mutations." },
    { q: 'Are Server Actions protected automatically?', a: 'No, they are public endpoints; authenticate, authorize, and validate in each one.' },
    { q: 'What is middleware called in Next.js 16?', a: '`proxy.ts`, exporting a `proxy` function; it runs on the Node.js runtime.' },
    { q: 'How do you expose an env variable to the browser?', a: 'Prefix it with `NEXT_PUBLIC_`; it is inlined at build time.' },
    { q: 'How do you set page titles in the App Router?', a: 'Export `metadata` or `generateMetadata` from a page or layout.' },
    { q: 'Which next/image prop replaced `priority` in v16?', a: '`preload` (or use `loading="eager"` / `fetchPriority="high"`).' },
    { q: 'Slim Docker image for Next.js?', a: "`output: 'standalone'` in next.config, then `node server.js`." },
    { q: 'Top cause of hydration errors?', a: 'Rendering different output on server and client, like dates, random values, or `typeof window` branches.' },
    { q: 'How to load a browser-only component?', a: "`dynamic(() => import('./X'), { ssr: false })` inside a Client Component." },
  ],
};

export default nextjs;
