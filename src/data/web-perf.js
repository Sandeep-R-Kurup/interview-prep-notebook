// Web Performance and Browser Internals stack. Topics are auto-sorted Basic -> Intermediate -> Advanced by the registry.

const webPerf = {
  name: 'Web Performance and Browser Internals',
  intro: 'How the browser turns bytes into pixels, and how to make that fast. Learn the pipeline first; every optimisation is just removing work from one of its steps.',
  topics: [
    {
      id: 'what-happens-url',
      title: 'What happens when you type a URL and press Enter',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'DNS lookup, TCP and TLS handshakes, HTTP request, server response, then parsing, rendering and running JavaScript.',
      what: [
        "The browser first finds the server's IP address (DNS), opens a connection (TCP, then TLS for HTTPS), sends an HTTP request, and receives HTML. Then it parses the HTML, fetches CSS, JavaScript and images, builds the page and paints it on screen.",
        "Every step costs time, which is why so many performance tricks are about skipping or overlapping these steps: caching, CDNs, preconnect, and fewer blocking resources.",
      ],
      deeper: [
        "**1. URL parsing and cache checks.** The browser decides if the input is a URL or a search. It checks HSTS (force HTTPS), the back/forward cache, a service worker, and the HTTP cache. A fresh cached response means no network at all.",
        "**2. DNS.** Browser cache, OS cache, then a recursive resolver that asks root, TLD (`.com`) and the domain's authoritative servers. Results are cached for the record's TTL.",
        "**3. Connection.** TCP three-way handshake (1 round trip), then TLS 1.3 (1 more round trip; 0-RTT on resumption). HTTP/2 multiplexes many requests on one connection. HTTP/3 runs over QUIC on UDP, combining transport and TLS setup, and avoids TCP head-of-line blocking.",
        "**4. Request and response.** Often via a CDN edge near the user. The server (load balancer, app, database) builds the response. Redirects (`http` to `https`, `example.com` to `www`) each add a full round trip.",
        "**5. Rendering.** The HTML parser builds the DOM as bytes stream in; a preload scanner finds CSS, scripts and images early. CSS builds the CSSOM. Then render tree, layout, paint and composite. Synchronous `<script>` tags pause parsing; `defer` and `async` don't.",
        "**6. After load.** JavaScript hydrates or attaches event handlers, fetches data, and the page becomes interactive.",
      ],
      why: "It's a classic opener because it shows breadth: networking, servers and browsers in one answer. It also maps every performance technique to a step, which is how you explain why something is slow.",
      analogy: "Ordering from a restaurant you've never been to: look up the address (DNS), walk there and get seated (TCP and TLS), order (request), the kitchen cooks (server), and the dishes arrive one by one and get arranged on the table (parse and render).",
      code: {
        lang: 'text',
        title: 'The timeline, with where time goes',
        source: `type "https://app.example.com/jobs" + Enter
  |
  |-- cache checks: HSTS, bfcache, service worker, HTTP cache   (hit = skip the network)
  |-- DNS lookup                                               (~0-100 ms, cached after)
  |-- TCP handshake                                            1 RTT
  |-- TLS 1.3 handshake                                        1 RTT  (HTTP/3 + QUIC merges these)
  |-- HTTP GET /jobs  --> CDN edge --> LB --> app --> DB         TTFB
  |<- 200 OK, HTML streams in
  |
  |-- parse HTML -> DOM  (preload scanner fetches CSS/JS/images early)
  |-- parse CSS  -> CSSOM            (render-blocking)
  |-- <script> without defer/async   (parser-blocking)
  |-- render tree -> layout -> paint -> composite   = first pixels (FCP), main content (LCP)
  |-- JS runs, hydrates, fetches data                 = interactive`,
      },
      output: "On a first visit, a user far from the server can spend several hundred milliseconds just on DNS, TCP and TLS before the first HTML byte. On a repeat visit, cached DNS, a reused connection and cached assets can cut most of that out.",
      questions: [
        { q: 'What happens when you type a URL and press Enter?', a: "The browser checks its caches, resolves the domain with DNS, opens a TCP connection and TLS handshake, sends the HTTP request and gets HTML back. It parses HTML into the DOM and CSS into the CSSOM, runs scripts, builds the render tree, does layout, paints and composites the page." },
        { q: 'What is TTFB?', a: "Time to First Byte: the time from the request starting to the first byte of the response arriving. It includes redirects, DNS, connection setup and server processing time, so a slow TTFB points at the network or backend." },
        { q: 'How does HTTP/2 or HTTP/3 help performance?', a: "HTTP/2 sends many requests in parallel over one connection with compressed headers. HTTP/3 runs over QUIC on UDP, sets up the connection and encryption in fewer round trips, and a lost packet only stalls its own stream." },
        { q: 'Why do redirects hurt performance?', a: "Each redirect is a full extra round trip, sometimes with new DNS and TLS setup, before the real page can even start loading. Link directly to the final URL and use HSTS to skip the http-to-https redirect." },
      ],
      answer30: "First the browser checks caches, including HSTS and any service worker. Then DNS resolves the domain to an IP, and it opens a TCP connection plus a TLS handshake, or QUIC with HTTP/3. It sends the request, often to a CDN edge, and HTML streams back. The parser builds the DOM while a preload scanner fetches CSS and scripts early; CSS builds the CSSOM. Then render tree, layout, paint and composite give the first pixels, and JavaScript makes the page interactive.",
      mistakes: [
        "Stopping at 'DNS, then the server sends HTML'. Mention rendering too; that's where front-end interviewers want depth.",
        "Saying the browser waits for the whole HTML before doing anything. It parses and renders progressively as bytes stream in.",
        "Forgetting caches. The fastest request is the one that never goes to the network.",
        "Trap: 'Does TLS add a round trip?' Yes, TLS 1.3 adds one on a new connection (TLS 1.2 added two), and session resumption can make it zero.",
      ],
      takeaway: 'Cache, DNS, TCP, TLS, request, response, then DOM, CSSOM, render tree, layout, paint, composite.',
    },

    {
      id: 'critical-rendering-path',
      title: 'Critical rendering path',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'The steps from HTML and CSS to pixels: DOM, CSSOM, render tree, layout, paint, composite. Blocking resources delay all of them.',
      what: [
        "The critical rendering path is the sequence of steps the browser must finish before it can show the first pixels: build the **DOM** from HTML, build the **CSSOM** from CSS, combine them into the **render tree** (only visible elements), work out sizes and positions (**layout**), fill in pixels (**paint**), and put layers together on the screen (**composite**).",
        "CSS is **render-blocking**: the browser won't paint until it has the CSS, to avoid a flash of unstyled content. A normal `<script>` is **parser-blocking**: HTML parsing stops until the script downloads and runs.",
      ],
      deeper: [
        "**Scripts.** `<script>` blocks parsing. `<script defer>` downloads in parallel and runs after parsing, in order: the best default. `<script async>` downloads in parallel and runs as soon as it arrives, in any order: good for independent things like analytics. `<script type='module'>` is deferred by default. A script also waits for preceding CSS, because it might read styles.",
        "**Optimising the path:** fewer critical resources (inline small critical CSS, defer the rest), fewer bytes (minify, compress with Brotli), and fewer round trips (preload key resources, avoid chains like CSS that `@import`s more CSS). Put scripts in the `<head>` with `defer` rather than at the bottom of the body.",
        "**Render tree** excludes `display: none` elements and `<head>`, but includes `visibility: hidden` (it takes up space). **Composite:** elements with `transform`, `opacity`, `will-change` or video can get their own GPU layer, so changes to them skip layout and paint.",
      ],
      why: "Every millisecond the path is blocked is a millisecond of blank screen. Knowing which resources block what is the basis of improving First Contentful Paint and LCP.",
      analogy: "Building a printed newspaper page. You need the text (DOM) and the style guide (CSSOM) before you can lay out columns (layout), ink the page (paint) and stack the colour plates (composite). If the style guide arrives late, the whole print run waits.",
      code: {
        lang: 'html',
        title: 'A head that unblocks rendering',
        source: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <!-- Small critical CSS inline: first paint doesn't wait for a network request -->
  <style>header{height:64px} .hero{min-height:60vh}</style>

  <!-- Rest of the CSS: still render-blocking, but preload discovers it early -->
  <link rel="preload" href="/app.css" as="style" />
  <link rel="stylesheet" href="/app.css" />

  <!-- App code: downloads in parallel, runs after parsing, in order -->
  <script defer src="/vendor.js"></script>
  <script defer src="/app.js"></script>

  <!-- Independent third party: runs whenever it arrives -->
  <script async src="https://analytics.example.com/a.js"></script>
</head>
<body>
  <header>...</header>
  <main class="hero">...</main>
</body>
</html>`,
      },
      output: "The browser can paint the header and hero as soon as app.css arrives, without waiting for any JavaScript. vendor.js and app.js download in parallel and run in order after the HTML is parsed; analytics runs whenever it lands and never blocks the page.",
      questions: [
        { q: 'What are the steps of the critical rendering path?', a: "Parse HTML into the DOM, parse CSS into the CSSOM, combine them into the render tree of visible nodes, run layout to compute sizes and positions, paint pixels into layers, and composite the layers on screen." },
        { q: 'defer vs async?', a: "Both download without blocking the parser. `defer` scripts run after the HTML is parsed, in document order. `async` scripts run as soon as they download, in any order, which can interrupt parsing. Use defer for app code and async for independent scripts like analytics." },
        { q: 'Why is CSS render-blocking?', a: "The browser can't paint correctly without knowing the styles, so it waits for the CSSOM instead of showing unstyled content that would then jump around. That's why critical CSS should be small and load early." },
        { q: 'What is the difference between display: none and visibility: hidden in rendering?', a: "`display: none` removes the element from the render tree, so it takes no space and has no layout. `visibility: hidden` keeps it in the render tree and layout, taking up space, but doesn't paint it." },
      ],
      answer30: "The browser parses HTML into the DOM and CSS into the CSSOM, combines them into a render tree of visible elements, computes layout, paints, and composites layers. CSS is render-blocking and plain scripts are parser-blocking, so I keep critical CSS small or inline, load scripts with defer, use async for independent third parties, and avoid request chains. That gets the first meaningful pixels on screen sooner.",
      mistakes: [
        "Plain `<script>` tags in the head without defer.",
        "CSS `@import` chains, which make the browser discover stylesheets one after another.",
        "Huge CSS bundles where most rules are for other pages.",
        "Trap: 'Is a script at the end of body as good as defer?' Close, but with defer in the head the download starts much earlier while the HTML is still parsing.",
      ],
      takeaway: 'DOM + CSSOM -> render tree -> layout -> paint -> composite; unblock it with small CSS and deferred scripts.',
    },

    {
      id: 'core-web-vitals',
      title: 'Core Web Vitals: LCP, INP, and CLS',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: "Google's three user-centred metrics: loading (LCP), responsiveness (INP, which replaced FID in March 2024) and visual stability (CLS).",
      note: "INP replaced FID as a Core Web Vital on 12 March 2024. If an interviewer says 'FID', mention that it was retired, which shows you are current.",
      what: [
        "Core Web Vitals are three metrics that measure how a page feels to real users. **LCP (Largest Contentful Paint):** how long until the biggest image or text block is visible. Good is 2.5 s or less. **INP (Interaction to Next Paint):** how long the page takes to visually respond to clicks, taps and key presses. Good is 200 ms or less. **CLS (Cumulative Layout Shift):** how much the content jumps around unexpectedly. Good is 0.1 or less.",
        "Google judges a page at the **75th percentile** of real visits, so 75% of users must get a 'good' experience. These metrics feed into search ranking as one signal among many.",
      ],
      deeper: [
        "**Improve LCP:** find the LCP element (often the hero image or heading). Then: fast TTFB (CDN, caching, server-side rendering), make the LCP image discoverable in the HTML (not set by JS or CSS background), add `fetchpriority='high'` and never `loading='lazy'` on it, compress it and serve modern formats (AVIF/WebP) at the right size, remove render-blocking CSS and JS, and preload the font if the LCP element is text.",
        "**Improve INP:** INP looks at nearly all interactions in the visit and reports roughly the worst. Each interaction = input delay (main thread busy) + processing time (your handlers) + presentation delay (rendering the next frame). Fixes: break up long tasks and yield to the main thread, do less in event handlers (update the UI first, defer the rest), avoid huge re-renders in React (`useTransition`, memoisation, virtualisation), reduce DOM size, and move heavy work to a Web Worker.",
        "**Improve CLS:** always set `width` and `height` (or `aspect-ratio`) on images, videos and iframes; reserve space for ads, embeds and banners; don't insert content above existing content unless the user asked; use `font-display` and size-matched fallback fonts to limit text shifts; animate with `transform`, not `top` or `height`. Shifts within 500 ms of a user input don't count.",
        "**Lab vs field.** Lighthouse is lab data from one simulated load; it can't measure INP, so it shows **Total Blocking Time (TBT)** as a proxy. Field data (RUM, Chrome UX Report, Search Console) is what Google actually uses. Other useful metrics: TTFB and FCP (First Contentful Paint).",
      ],
      why: "They give a shared, measurable definition of 'fast' that product, SEO and engineering can all agree on. Interviewers ask you to name them, give thresholds and, more importantly, say how you'd fix each.",
      analogy: "Visiting a shop. LCP is how soon the main shelf is lit up, INP is how quickly the shopkeeper reacts when you ask for something, and CLS is whether shelves move just as you reach for an item.",
      code: {
        lang: 'js',
        title: 'Measuring real users with the web-vitals library',
        source: `import { onLCP, onINP, onCLS, onTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify({
    name: metric.name,          // 'LCP' | 'INP' | 'CLS' | 'TTFB'
    value: metric.value,        // ms for LCP/INP/TTFB, unitless score for CLS
    rating: metric.rating,      // 'good' | 'needs-improvement' | 'poor'
    id: metric.id,
    page: location.pathname,
  });
  // sendBeacon survives the page being closed; fall back to fetch keepalive
  if (!navigator.sendBeacon?.('/rum', body)) {
    fetch('/rum', { method: 'POST', body, keepalive: true });
  }
}

onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onCLS(sendToAnalytics);
onTTFB(sendToAnalytics);`,
      },
      output: "Each real visit reports its LCP, INP, CLS and TTFB with a good/needs-improvement/poor rating. Aggregated on the server at the 75th percentile per page, this tells you which pages fail which metric for real users, which Lighthouse alone can't.",
      questions: [
        { q: 'What are the Core Web Vitals and their good thresholds?', a: "LCP (loading) at or under 2.5 seconds, INP (responsiveness) at or under 200 milliseconds, and CLS (visual stability) at or under 0.1, measured at the 75th percentile of real page visits." },
        { q: 'What replaced FID and why?', a: "INP replaced FID in March 2024. FID only measured the input delay of the first interaction, while INP measures the full time to the next paint across nearly all interactions in the visit, so it reflects real responsiveness much better." },
        { q: 'How would you improve a slow LCP?', a: "Identify the LCP element, then reduce TTFB with a CDN or caching, make the image discoverable in the HTML with fetchpriority high and no lazy loading, serve it compressed in AVIF or WebP at the right size, and remove render-blocking CSS and JavaScript." },
        { q: 'How do you fix layout shift (CLS)?', a: "Give images, videos and iframes explicit width and height or aspect-ratio, reserve space for ads and late content, avoid inserting content above what the user is reading, and control font swaps with matched fallback fonts." },
        { q: 'How would you improve a poor INP?', a: "Find the slow interactions, then break up long tasks so the main thread can respond, do the minimum in the handler and defer the rest, reduce unnecessary React re-renders, keep the DOM small, and move heavy computation to a Web Worker." },
      ],
      answer30: "The Core Web Vitals are LCP for loading, good under 2.5 seconds; INP for responsiveness, good under 200 milliseconds, which replaced FID in 2024; and CLS for visual stability, good under 0.1, all at the 75th percentile of real users. For LCP I fix TTFB and make the hero image discoverable, prioritised and small. For INP I break up long tasks and keep handlers light. For CLS I reserve space for images, ads and fonts. I measure in the field with the web-vitals library, not just Lighthouse.",
      mistakes: [
        "Lazy-loading the hero image, which delays LCP.",
        "Still talking about FID as current.",
        "Optimising only the Lighthouse score; real users on slow phones are what count.",
        "Trap: 'Can Lighthouse measure INP?' No, it has no real user interactions. It reports Total Blocking Time as a lab proxy; INP needs field data.",
      ],
      takeaway: 'LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1 at p75; INP replaced FID in 2024; measure in the field.',
    },

    {
      id: 'reflow-repaint',
      title: 'Reflow vs repaint, and layout thrashing',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Reflow recalculates layout (expensive), repaint redraws pixels (cheaper), and compositor-only changes like transform skip both.',
      what: [
        "**Reflow** (or layout) happens when something changes size or position, like width, font size or adding elements. The browser has to recalculate the geometry of that element and often its neighbours and children.",
        "**Repaint** happens when something changes look but not geometry, like colour or background. Pixels are redrawn but layout is not redone. Changes to `transform` and `opacity` can often be handled by the **compositor** alone, skipping both, which is why they make smooth animations.",
      ],
      deeper: [
        "**Cost ladder:** layout -> paint -> composite. Changing `width` triggers all three. Changing `background-color` triggers paint and composite. Changing `transform` or `opacity` on a layer triggers only composite, on the GPU, off the main thread.",
        "**Layout thrashing (forced synchronous layout):** the browser normally batches style changes and does layout once per frame. But if you write a style and then read a layout property (`offsetHeight`, `getBoundingClientRect()`, `scrollTop`, `clientWidth`), it must do layout immediately to give you a correct answer. Doing write, read, write, read in a loop forces layout on every iteration.",
        "**Fixes:** batch all reads first, then all writes; use `requestAnimationFrame` for visual writes; change a class instead of many inline styles; animate `transform` and `opacity` instead of `top`, `left`, `width` or `height`; use `will-change` sparingly to promote an element to its own layer; and use CSS containment (`contain: layout` or `content-visibility: auto`) to limit how far a change spreads.",
      ],
      why: "Janky scrolling and slow interactions (poor INP) are often caused by repeated layouts. Knowing which properties are cheap to change is how you build smooth 60 fps UIs.",
      analogy: "Rearranging furniture (reflow) means measuring and moving everything around it. Repainting a wall (repaint) just needs a new coat of paint. Sliding a picture along its rail (transform) doesn't disturb anything else at all.",
      code: {
        lang: 'js',
        title: 'Layout thrashing and the fix',
        source: `const cards = document.querySelectorAll('.card');

// BAD: write then read in a loop. Each read of offsetWidth forces a fresh layout.
cards.forEach((card) => {
  card.style.width = card.parentElement.offsetWidth / 2 + 'px';   // read + write
  card.style.height = card.offsetWidth * 0.75 + 'px';              // read forces layout again
});

// GOOD: read everything first, then write everything (one layout)
const widths = [...cards].map((card) => card.parentElement.offsetWidth / 2); // all reads
requestAnimationFrame(() => {
  cards.forEach((card, i) => {                                       // all writes
    card.style.width = widths[i] + 'px';
    card.style.height = widths[i] * 0.75 + 'px';
  });
});

// GOOD: animate with transform (compositor only), not left/top (layout every frame)
// .drawer { transition: transform 200ms ease; transform: translateX(-100%); }
// .drawer.open { transform: translateX(0); }`,
      },
      output: "With 500 cards, the bad version can force hundreds of layouts in one frame and show up in the Performance panel as purple 'Layout' blocks with a 'Forced reflow' warning. The good version does one layout, and the drawer animation stays smooth because transform skips layout and paint.",
      questions: [
        { q: 'What is the difference between reflow and repaint?', a: "Reflow (layout) recalculates the size and position of elements and is expensive because changes can spread to other elements. Repaint redraws pixels for visual changes like colour without changing geometry, so it's cheaper." },
        { q: 'What is layout thrashing?', a: "Interleaving DOM writes and layout reads, like setting a style and then reading offsetHeight in a loop. Each read forces the browser to recalculate layout immediately, so one frame can contain dozens of layouts." },
        { q: 'Which CSS properties are cheapest to animate?', a: "`transform` and `opacity`. They can be handled by the compositor on the GPU without layout or paint, so animations stay smooth even when the main thread is busy." },
        { q: 'Name some properties or methods that force layout when read.', a: "offsetWidth/offsetHeight, clientWidth/clientHeight, scrollTop/scrollHeight, getBoundingClientRect(), getComputedStyle() for layout values, and focus() in some cases." },
      ],
      answer30: "Reflow recalculates geometry and can cascade through the page, repaint just redraws pixels, and transform or opacity changes can skip both and run on the compositor. The classic problem is layout thrashing: writing a style and then reading something like offsetHeight in a loop forces a layout every time. I batch reads before writes, do visual writes in requestAnimationFrame, toggle classes instead of many inline styles, and animate only transform and opacity.",
      mistakes: [
        "Animating `left`, `top`, `width` or `height` instead of `transform`.",
        "Reading `getBoundingClientRect()` inside a scroll handler after changing styles.",
        "Adding `will-change` to everything, which wastes GPU memory and can slow things down.",
        "Trap: 'Does changing visibility cause reflow?' `visibility: hidden` only repaints because the element keeps its space; `display: none` changes layout.",
      ],
      takeaway: 'Batch reads then writes, and animate transform and opacity only.',
    },

    {
      id: 'lazy-loading-code-splitting',
      title: 'Lazy loading and code splitting',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: "Ship only the code and media needed for the current screen; load the rest on demand.",
      what: [
        "**Code splitting** breaks one big JavaScript bundle into smaller chunks. The browser downloads the chunk for the current page first and fetches others when needed, for example when the user opens the admin page.",
        "**Lazy loading** delays loading something until it's needed: route components, heavy widgets (charts, editors), images and iframes below the fold.",
      ],
      deeper: [
        "**How it works:** dynamic `import('./Chart.js')` returns a promise; bundlers (Vite/Rollup, webpack, Next.js) automatically turn each dynamic import into a separate chunk. In React, `React.lazy(() => import('./Page'))` plus `<Suspense fallback={...}>` renders a placeholder while the chunk loads.",
        "**Where to split:** by route first (biggest win, simplest), then large components the user may never open (modals, rich text editors, PDF viewers, charts), then big libraries used in one place. Next.js App Router splits by route automatically, and `next/dynamic` lazy-loads components.",
        "**Avoid waterfalls:** lazy loading adds a network round trip when the user needs the chunk. Prefetch likely next chunks on hover or when idle (`import()` early, or `<link rel='prefetch'>`), and don't lazy load what's needed for the first screen.",
        "**Images and iframes:** `loading='lazy'` is native in all modern browsers. Use it for below-the-fold images, never for the LCP image. `IntersectionObserver` lets you lazy load anything else when it nears the viewport.",
      ],
      why: "JavaScript is the most expensive byte on the web: it must be downloaded, parsed, compiled and executed on the main thread. Shipping less up front improves LCP and INP, especially on mid-range phones.",
      analogy: "Packing for a trip by sending luggage ahead in boxes. You carry what you need for day one, and the rest is delivered when you get to each city, instead of dragging everything through the airport.",
      code: {
        lang: 'jsx',
        title: 'Route-level and component-level splitting in React',
        source: `import { lazy, Suspense, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

// Each lazy import becomes its own chunk
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Reports = lazy(() => import('./pages/Reports'));
const loadChart = () => import('./components/ScoreChart');   // heavy charting library inside
const ScoreChart = lazy(loadChart);

export function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Suspense>
  );
}

export function CandidateRow({ candidate }) {
  const [showChart, setShowChart] = useState(false);
  return (
    <div>
      {/* Prefetch on hover so the click feels instant */}
      <button onMouseEnter={loadChart} onClick={() => setShowChart(true)}>Show scores</button>
      {showChart && (
        <Suspense fallback={<p>Loading chart...</p>}>
          <ScoreChart data={candidate.scores} />
        </Suspense>
      )}
      <img src={candidate.photo} loading="lazy" width="48" height="48" alt="" />
    </div>
  );
}`,
      },
      output: "The first load downloads only the main bundle and the Dashboard chunk. The Reports chunk downloads when the user navigates there, and the chart library starts downloading on hover, so by the time they click, it's usually ready. Row photos load only as they scroll into view.",
      questions: [
        { q: 'What is code splitting?', a: "Splitting the JavaScript bundle into smaller chunks that load on demand, usually per route or per heavy component, so the first page only downloads the code it needs. Bundlers create a chunk for each dynamic import()." },
        { q: 'How do you lazy load a component in React?', a: "Wrap a dynamic import in `React.lazy(() => import('./X'))` and render it inside a `<Suspense fallback={...}>` boundary, which shows the fallback while the chunk downloads." },
        { q: 'What should you never lazy load?', a: "Anything needed for the first screen, especially the LCP image or above-the-fold content. Lazy loading it delays the most important paint." },
        { q: 'What is the downside of code splitting and how do you reduce it?', a: "Loading a chunk on demand adds a network delay at the moment the user needs it, and too many tiny chunks add overhead. Prefetch likely next chunks on hover or idle, and split at meaningful boundaries like routes." },
      ],
      answer30: "Code splitting breaks the bundle into chunks using dynamic import, so the first screen ships only what it needs. I split by route first, then heavy components like charts or editors, with React.lazy and Suspense. To avoid a delay on click, I prefetch likely chunks on hover or when idle. For media, I use native loading='lazy' on below-the-fold images and iframes, but never on the LCP image.",
      mistakes: [
        "`loading='lazy'` on the hero image.",
        "Splitting into dozens of tiny chunks that create request waterfalls.",
        "Calling `lazy()` inside a component body, which creates a new component every render and remounts it.",
        "Trap: 'Does code splitting reduce total bytes?' Not necessarily; it reduces bytes needed up front. Total can even grow slightly from chunk overhead.",
      ],
      takeaway: 'Split by route, lazy load heavy and below-the-fold things, prefetch what comes next, never lazy load the LCP.',
    },

    {
      id: 'image-optimization',
      title: 'Image optimisation',
      level: 'basic',
      priority: 'must',
      frequency: 'common',
      summary: 'Right format, right size for each screen, compressed, lazy below the fold, prioritised above it, with dimensions set.',
      what: [
        "Images are usually the biggest bytes on a page and often the LCP element. Optimising them means: use modern formats (**AVIF**, **WebP**), serve the right size for each screen (`srcset` and `sizes`), compress, lazy load images below the fold, and always set `width` and `height` to prevent layout shift.",
      ],
      deeper: [
        "**Formats:** AVIF is usually smallest, WebP is close and very widely supported, JPEG is the fallback for photos, PNG only for when you need lossless (screenshots, some graphics), and SVG for icons and logos. Use `<picture>` to offer AVIF and WebP with a JPEG fallback.",
        "**Responsive images:** `srcset` lists several widths, `sizes` tells the browser how wide the image will display, and the browser picks the best file for the screen size and pixel density. A 400 px wide phone shouldn't download a 2400 px desktop image.",
        "**Priority:** for the LCP image use `fetchpriority='high'`, no lazy loading, and put it in the HTML (not as a CSS background or injected by JS) so the preload scanner finds it early. For everything below the fold use `loading='lazy'` and `decoding='async'`.",
        "**Delivery:** an image CDN (Cloudinary, imgix, CloudFront with a resizing function, or Next.js `next/image`) can resize and convert formats on the fly based on the request. Serve images with long cache lifetimes and content-hashed URLs.",
      ],
      why: "Smaller, well-prioritised images directly improve LCP and save mobile data. Missing dimensions are one of the most common causes of CLS.",
      analogy: "Shipping furniture flat-packed and in the right size for the room, instead of sending a full-size assembled wardrobe to every house regardless of whether it fits through the door.",
      code: {
        lang: 'html',
        title: 'Hero image (LCP) vs a list image',
        source: `<!-- LCP hero: modern formats, responsive, high priority, NOT lazy -->
<picture>
  <source type="image/avif"
          srcset="/img/hero-640.avif 640w, /img/hero-1280.avif 1280w, /img/hero-1920.avif 1920w"
          sizes="100vw" />
  <source type="image/webp"
          srcset="/img/hero-640.webp 640w, /img/hero-1280.webp 1280w, /img/hero-1920.webp 1920w"
          sizes="100vw" />
  <img src="/img/hero-1280.jpg" alt="Recruiters reviewing a shortlist"
       width="1920" height="800" fetchpriority="high" />
</picture>

<!-- Below the fold: lazy, async decode, fixed box so nothing shifts -->
<img src="/img/avatar-96.webp"
     srcset="/img/avatar-48.webp 48w, /img/avatar-96.webp 96w"
     sizes="48px" width="48" height="48"
     loading="lazy" decoding="async" alt="Candidate photo" />`,
      },
      output: "A phone downloads the 640 px AVIF hero (often a few tens of KB) instead of a large JPEG, and requests it at high priority. Avatars load only as they approach the viewport, and because every image has width and height, the layout doesn't jump when they arrive.",
      questions: [
        { q: 'How do you optimise images on a website?', a: "Use modern formats like AVIF or WebP with fallbacks, serve responsive sizes with srcset and sizes, compress them, set width and height to avoid layout shift, lazy load below-the-fold images, give the LCP image high priority, and serve through a CDN with long caching." },
        { q: 'What do srcset and sizes do?', a: "`srcset` lists the same image at several widths; `sizes` tells the browser how wide the image will be displayed. The browser then picks the smallest file that looks sharp for the device's screen size and pixel density." },
        { q: 'Why set width and height on images when CSS controls the size?', a: "The browser uses them to compute the aspect ratio and reserve space before the image loads. Without them, content jumps when the image arrives, which hurts CLS." },
        { q: 'How should the LCP image be loaded?', a: "Directly in the HTML as an img element, not lazy, with fetchpriority high, in a modern format at the right size, ideally from a CDN, so the browser discovers and downloads it as early as possible." },
      ],
      answer30: "I serve AVIF or WebP with a JPEG fallback through picture, and responsive sizes with srcset and sizes so phones don't download desktop images. Every image gets width and height so there's no layout shift. Below-the-fold images get loading lazy and async decoding; the LCP image is the opposite: in the HTML, not lazy, with fetchpriority high. An image CDN handles resizing and format conversion, with long cache headers.",
      mistakes: [
        "One huge image served to all screen sizes.",
        "Hero image set as a CSS background or injected by JavaScript, so the browser finds it late.",
        "Using PNG for photos.",
        "Trap: 'Is WebP always smaller than JPEG?' Usually, not always; very small or already well-compressed images can come out similar. Measure, and let an image CDN choose per request.",
      ],
      takeaway: 'Modern format, right size, dimensions set, lazy below the fold, high priority for the LCP image.',
    },

    {
      id: 'caching-http-sw-cdn',
      title: 'Caching: HTTP cache, service workers, and CDNs',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Cache-Control headers decide what browsers and CDNs keep and for how long; hashed filenames let you cache forever and still deploy instantly.',
      what: [
        "The **HTTP cache** stores responses in the browser based on headers from the server. `Cache-Control: max-age=31536000, immutable` means 'keep for a year, don't even check'. `no-cache` means 'store it, but check with the server before using it'. `no-store` means 'never store it'.",
        "A **CDN** caches responses at servers close to users. A **service worker** is a script in the browser that can intercept network requests and answer them from its own cache, enabling offline support and custom strategies.",
      ],
      deeper: [
        "**The standard strategy:** build tools put a content hash in asset filenames (`app.3f9a1c.js`). Those files get `max-age=31536000, immutable`. The HTML that references them gets `no-cache` (revalidate every time), so a deploy changes the HTML, which points to new filenames, and users get new code at once.",
        "**Revalidation:** with `ETag` (a version id) or `Last-Modified`, the browser sends `If-None-Match` / `If-Modified-Since`; if unchanged, the server replies `304 Not Modified` with no body. **stale-while-revalidate** lets the cache serve a slightly old response instantly while fetching a fresh one in the background.",
        "**CDN and shared caches:** `s-maxage` sets the lifetime for shared caches like CDNs separately from browsers. `private` stops CDNs from caching per-user responses; anything with personal data must be `private` or `no-store`. `Vary` (e.g. `Vary: Accept-Encoding`) tells caches which request headers change the response.",
        "**Service worker strategies:** cache-first (static assets, app shell), network-first (API data that should be fresh, falling back to cache offline), stale-while-revalidate (things that can be slightly old, like avatars). Workbox is the common library. Service workers need HTTPS and must be versioned carefully, because a buggy one can serve old code until it's replaced.",
        "**Back/forward cache (bfcache):** browsers keep the whole page in memory for instant back/forward navigation. `unload` handlers and `Cache-Control: no-store` on the HTML can make a page ineligible in some browsers.",
      ],
      why: "The fastest request is one that never leaves the device. Good caching makes repeat visits nearly instant and cuts CDN and server load, and wrong caching causes users to run old code or see someone else's data.",
      analogy: "Keeping a pantry. Labelled tins with a date (hashed filenames, long max-age) can stay for a year. Milk (the HTML) you check every time before using. The corner shop down the road (CDN) is closer than the warehouse (origin).",
      code: {
        lang: 'js',
        title: 'Cache headers in Express for a built SPA',
        source: `import express from 'express';
const app = express();

// 1. Hashed assets (app.3f9a1c.js): cache for a year, never revalidate
app.use('/assets', express.static('dist/assets', {
  setHeaders: (res) => res.set('Cache-Control', 'public, max-age=31536000, immutable'),
}));

// 2. API: per-user data must never be stored in shared caches
app.get('/api/me', auth, (req, res) => {
  res.set('Cache-Control', 'private, no-store');
  res.json(req.user);
});

// 3. Public, slow-changing API: CDN keeps it 60 s, can serve stale for 5 min while refreshing
app.get('/api/public/jobs', async (req, res) => {
  res.set('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=300');
  res.json(await listPublicJobs());
});

// 4. index.html (SPA fallback): always revalidate, so a deploy is picked up immediately (ETag -> 304)
//    A final app.use works in Express 4 and 5 (Express 5 no longer accepts a bare '*' path)
app.use((req, res) => {
  res.set('Cache-Control', 'no-cache');
  res.sendFile('index.html', { root: 'dist' });
});`,
      },
      output: "On a repeat visit, the browser revalidates index.html (usually a tiny 304), then loads every hashed asset straight from disk with no request. After a deploy, the new index.html points to new hashed files, so users get the new version on their next load. Per-user API responses are never cached by the CDN.",
      questions: [
        { q: 'What is the difference between no-cache and no-store?', a: "`no-cache` lets the browser store the response but requires revalidating it with the server before each use, often getting a cheap 304. `no-store` forbids storing it at all, which is for sensitive data." },
        { q: 'How do you cache static assets forever but still deploy updates instantly?', a: "Put a content hash in each asset's filename and serve those with a one-year max-age and immutable. Serve the HTML with no-cache. A deploy changes the HTML to point at new filenames, so the old cached files are simply never requested again." },
        { q: 'What is an ETag?', a: "A version identifier for a response. The browser sends it back in If-None-Match; if the resource hasn't changed, the server answers 304 Not Modified with no body, saving bandwidth." },
        { q: 'What can a service worker do for performance?', a: "It intercepts requests and can answer from its own cache, enabling cache-first loading of the app shell, offline support, and strategies like stale-while-revalidate for API calls. It only works over HTTPS." },
        { q: 'What does s-maxage do?', a: "It sets how long shared caches like CDNs may keep a response, overriding max-age for them, so you can cache at the CDN for a while but make browsers revalidate more often." },
      ],
      answer30: "I use content-hashed filenames for JS, CSS and images with Cache-Control max-age of a year and immutable, and serve the HTML with no-cache so it's revalidated with an ETag every load. That gives instant repeat visits and instant deploys. Personal API responses are private or no-store so a CDN never shares them, and public endpoints can use s-maxage with stale-while-revalidate at the CDN. A service worker adds offline support and custom strategies like cache-first for the app shell.",
      mistakes: [
        "Long max-age on index.html, so users keep loading old code after a deploy.",
        "Caching authenticated API responses at the CDN without private, leaking data between users.",
        "A service worker with no update strategy that serves a broken version for days.",
        "Trap: 'Does no-cache mean the browser doesn't cache?' No, it caches but must revalidate first. no-store is the one that prevents caching.",
      ],
      takeaway: 'Hashed assets cached forever, HTML revalidated, private data never in shared caches.',
    },

    {
      id: 'resource-hints',
      title: 'Resource hints: preload, prefetch, preconnect',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Tell the browser early about what it will need: preconnect to origins, preload for this page, prefetch for the next one.',
      what: [
        "Resource hints are `<link>` tags that give the browser a head start. **preconnect** opens the connection (DNS, TCP, TLS) to another origin early. **dns-prefetch** does only the DNS step. **preload** downloads a resource the current page definitely needs but the browser would discover late. **prefetch** downloads something the *next* page will probably need, at low priority.",
      ],
      deeper: [
        "**preload** needs a correct `as` attribute (`style`, `script`, `font`, `image`, `fetch`) so it gets the right priority and is reused; fonts also need `crossorigin` even on the same origin, or the font is downloaded twice. Typical uses: web fonts referenced deep inside CSS, the LCP image when it's a CSS background, and critical scripts loaded by other scripts. `modulepreload` is the version for ES modules.",
        "**preconnect** is for a few critical third-party origins (font CDN, image CDN, API domain). Each one costs a socket and CPU, so limit it to 2 to 4; use `dns-prefetch` for the rest.",
        "**prefetch** is a low-priority guess for future navigations. Frameworks do this automatically: Next.js `<Link>` prefetches routes in view. The **Speculation Rules API** (supported in Chromium-based browsers) can prefetch or even fully prerender likely next pages.",
        "**fetchpriority** (`high`/`low`/`auto`) is a related hint that adjusts the priority of a single request, for example raising the LCP image or lowering below-the-fold carousel images.",
        "Over-preloading backfires: everything preloaded competes for bandwidth with the truly critical resources, and Chrome warns in the console about preloads not used within a few seconds.",
      ],
      why: "The browser discovers many critical resources late: fonts only after CSS is parsed, third-party origins only when a script asks. Hints cut those delays, often by hundreds of milliseconds on mobile.",
      analogy: "Preconnect is calling ahead so the restaurant has a table ready. Preload is ordering the main course while you are still parking. Prefetch is picking up tomorrow's breakfast on the way home tonight.",
      code: {
        lang: 'html',
        title: 'Hints in the head',
        source: `<head>
  <!-- Connect early to critical third-party origins (keep this list short) -->
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preconnect" href="https://api.example.com" />
  <link rel="dns-prefetch" href="https://analytics.example.com" />

  <!-- Needed now, but discovered late (font is referenced inside CSS) -->
  <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin />

  <!-- LCP image that is a CSS background: make it discoverable and important -->
  <link rel="preload" href="/img/hero-1280.avif" as="image" type="image/avif" fetchpriority="high" />

  <!-- Probably needed on the next page: low priority, uses idle bandwidth -->
  <link rel="prefetch" href="/assets/reports.8c1d2e.js" />
</head>`,
      },
      output: "The font and hero image start downloading as soon as the head is parsed instead of after the CSS arrives, and the connection to the API is already open when the app makes its first fetch. The reports chunk is quietly cached, so navigating there feels instant.",
      questions: [
        { q: 'preload vs prefetch?', a: "preload fetches a resource the current page needs soon, at high priority, because the browser would discover it late. prefetch fetches a resource that a future navigation will probably need, at low priority, in idle time." },
        { q: 'When would you use preconnect?', a: "For a few critical third-party origins the page will definitely use soon, like a font or image CDN or the API domain. It does DNS, TCP and TLS early so the first request there doesn't pay that cost." },
        { q: 'Why do font preloads need crossorigin?', a: "Fonts are always fetched in CORS mode. A preload without crossorigin is made in a different mode, so it doesn't match the real request and the font downloads twice." },
        { q: 'Can you overuse preload?', a: "Yes. Every preload competes for bandwidth with the truly critical resources, so preloading many things can make LCP worse. Preload only the few late-discovered resources that matter for the first render." },
      ],
      answer30: "Resource hints give the browser a head start. preconnect opens connections early to a few critical origins, dns-prefetch just resolves DNS for the rest. preload fetches something the current page needs but would discover late, like a font inside CSS or a CSS-background hero image, with the right as and crossorigin. prefetch grabs likely next-page resources at low priority. And fetchpriority tunes a single request. I keep the lists short, because over-preloading steals bandwidth from what matters.",
      mistakes: [
        "Preloading a font without `crossorigin`, causing a double download.",
        "Preconnecting to ten origins.",
        "Using preload for next-page resources (should be prefetch) or prefetch for current-page critical ones (should be preload).",
        "Trap: 'Is preload a guarantee?' preload is a mandatory fetch for this page; prefetch and dns-prefetch are hints the browser may ignore, for example on data saver.",
      ],
      takeaway: 'preconnect a few origins, preload late-discovered critical files, prefetch the next page, and keep all lists short.',
    },

    {
      id: 'bundle-tree-shaking',
      title: 'Bundle analysis and tree shaking',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Measure what is in your bundle, then remove unused code (tree shaking), heavy dependencies and duplicates.',
      what: [
        "A **bundle analyser** shows a visual map of your JavaScript bundles: which libraries and files take the most space. It's the first step before optimising, because the biggest problems are usually one or two surprise dependencies.",
        "**Tree shaking** is the bundler removing code you never import. It works with ES modules (`import`/`export`) because they are static: the bundler can see at build time exactly what is used.",
      ],
      deeper: [
        "**Tools:** `rollup-plugin-visualizer` for Vite, `webpack-bundle-analyzer` for webpack, `@next/bundle-analyzer` for Next.js, `source-map-explorer` for any build with source maps. Check sizes before adding a library with bundlephobia or pkg-size.",
        "**What blocks tree shaking:** CommonJS (`require`, `module.exports`) is dynamic, so bundlers usually include the whole module. **Side effects:** if a module does something on import (adds polyfills, CSS, globals), the bundler must keep it; libraries mark themselves safe with `\"sideEffects\": false` in package.json. Importing a whole namespace and using it dynamically can also defeat it.",
        "**Common wins:** import specific functions (`import debounce from 'lodash-es/debounce'` or `lodash-es` instead of `lodash`), replace heavy libraries (moment.js -> date-fns, Day.js or native `Intl`), load big features lazily, drop polyfills for browsers you don't support, remove duplicate versions of the same package (`npm ls <pkg>`), and keep large data out of the JS bundle.",
        "**Set budgets:** fail the build or CI when a bundle grows past a size limit (`size-limit`, Lighthouse CI budgets), so regressions are caught in the PR rather than in production. Look at compressed (gzip/Brotli) sizes, but remember parse and execution cost depends on the uncompressed size.",
      ],
      why: "Bundle size grows quietly, one dependency at a time. Smaller bundles download, parse and execute faster, which helps LCP and INP, especially on mid-range Android phones.",
      analogy: "Cleaning out a wardrobe: first take everything out and look at it (bundle analysis), then throw away what you never wear (tree shaking), and stop buying three of the same jacket (duplicate dependencies).",
      code: [
        {
          lang: 'js',
          title: 'Imports that tree-shake vs imports that pull in everything',
          source: `// BAD: CommonJS lodash, the whole library ends up in the bundle
import _ from 'lodash';
const search = _.debounce(runSearch, 300);

// GOOD: ES module build, only debounce (and what it uses) is included
import { debounce } from 'lodash-es';
const search2 = debounce(runSearch, 300);

// BAD: moment.js with all locales just to format a date
import moment from 'moment';
moment(job.createdAt).format('D MMM YYYY');

// GOOD: built into the browser, zero bytes added
new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(new Date(job.createdAt));

// Your own library code: help bundlers by declaring no side effects
// package.json -> { "sideEffects": ["*.css"] }   // everything except CSS files is safe to drop`,
        },
        {
          lang: 'bash',
          title: 'Look at the bundle (Vite example)',
          source: `npm i -D rollup-plugin-visualizer
# vite.config.js: plugins: [react(), visualizer({ filename: 'stats.html', gzipSize: true })]
npm run build && open stats.html

# Is a package installed twice in different versions?
npm ls date-fns`,
        },
      ],
      output: "The visualiser shows a treemap of every chunk with its parsed and gzip size. Typical findings are a full lodash or moment build, an icon library imported as a whole, or two versions of the same package; fixing them often removes a large share of the bundle.",
      questions: [
        { q: 'What is tree shaking?', a: "The bundler removing exports that are never imported, so unused code isn't shipped. It relies on ES module import and export being static, so the bundler can tell at build time what is used." },
        { q: 'Why doesn\'t tree shaking work with CommonJS?', a: "require and module.exports are dynamic: what gets imported can depend on runtime values, so the bundler can't safely tell what is unused and usually keeps the whole module." },
        { q: 'What does sideEffects: false in package.json do?', a: "It tells the bundler that importing a module does nothing except provide its exports, so if none of its exports are used, the whole module can be dropped. Files that do have side effects, like CSS imports, should be listed instead." },
        { q: 'How do you find out why a bundle is large?', a: "Run a bundle analyser like rollup-plugin-visualizer or webpack-bundle-analyzer to see a treemap of each chunk, look for the largest libraries and duplicates, then replace, lazy load or import them more precisely. Add a size budget in CI to stop regressions." },
      ],
      answer30: "I start by measuring with a bundle analyser, because the problem is usually one or two big or duplicated dependencies. Tree shaking removes unused exports, but only works well with ES modules and side-effect-free code, so I prefer libraries like lodash-es or date-fns, import specific functions, and use native Intl for dates. Heavy features get lazy loaded, and a size budget in CI catches growth before it ships.",
      mistakes: [
        "Optimising blindly without looking at the analyser first.",
        "Importing a whole icon set or component library when you use a few pieces.",
        "Judging by gzip size alone; the browser still parses and executes the full uncompressed code.",
        "Trap: 'If I import one function from a library, is only that function shipped?' Only if the library is ES modules, marked side-effect free, and the bundler can prove the rest is unused.",
      ],
      takeaway: 'Measure with an analyser, prefer ESM and side-effect-free imports, replace heavy dependencies, and set a size budget.',
    },

    {
      id: 'react-performance',
      title: 'React performance: memo, virtualisation, and the Profiler',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Measure with the Profiler, avoid unnecessary re-renders (memo, stable props, state placement), and virtualise long lists.',
      note: "React Compiler 1.0 (stable since October 2025) can add memoisation automatically at build time. If a project uses it, manual useMemo, useCallback and memo are needed far less, but you should still understand them, because interviewers ask and many codebases don't use the compiler yet.",
      what: [
        "A React component re-renders when its state changes, its parent re-renders, or a context it uses changes. Re-rendering is usually cheap; it becomes a problem with big trees, expensive calculations, or long lists.",
        "The main tools: the **React DevTools Profiler** to find what's slow, **`memo`** to skip re-rendering a child when its props are the same, **`useMemo`/`useCallback`** to keep values and functions stable, **`useTransition`/`useDeferredValue`** to keep typing responsive, and **virtualisation** to render only the visible rows of a long list.",
      ],
      deeper: [
        "**Measure first.** The Profiler shows each commit, which components rendered, why, and how long they took. Chrome's Performance panel shows long tasks. Optimise what's actually slow.",
        "**Cheapest fixes are structural:** move state down to the component that needs it, so typing in a search box doesn't re-render the whole page; pass components as `children` so they aren't re-rendered by the parent's state; split a big context into smaller ones or separate state and dispatch contexts.",
        "**memo needs stable props.** `memo(Row)` is useless if the parent passes a new object, array or inline function each render, because the shallow comparison sees a change. That's what `useMemo` and `useCallback` are for.",
        "**Virtualisation:** rendering 10,000 rows creates 10,000 DOM nodes. Libraries like TanStack Virtual or react-window render only the ~20 visible rows plus a small buffer, and swap them as you scroll.",
        "**Concurrent features:** `useTransition` marks an update as non-urgent so React can interrupt it to handle typing; `useDeferredValue` lets an expensive child lag behind a fast-changing value. Both improve INP without reducing work.",
      ],
      why: "Large dashboards (like candidate tables) and fast-typing inputs are where React apps feel sluggish. Interviewers want to see that you measure first and know which tool fixes which cause.",
      analogy: "A school photo. You don't retake the whole class photo because one student blinked (memo and moving state down), and in a stadium you only light the seats the camera is pointing at (virtualisation).",
      code: {
        lang: 'jsx',
        title: 'Stable props + memo, deferred filtering, and a virtualised list',
        source: `import { memo, useCallback, useDeferredValue, useMemo, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

const Row = memo(function Row({ candidate, onSelect }) {
  return <div onClick={() => onSelect(candidate.id)}>{candidate.name} - {candidate.score}</div>;
});

export function CandidateList({ candidates }) {           // e.g. 10,000 candidates
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const deferredQuery = useDeferredValue(query);           // input stays responsive

  const visible = useMemo(                                  // recompute only when inputs change
    () => candidates.filter((c) => c.name.toLowerCase().includes(deferredQuery.toLowerCase())),
    [candidates, deferredQuery]
  );
  const onSelect = useCallback((id) => setSelected(id), []); // same function every render

  const parentRef = useRef(null);
  const virtualizer = useVirtualizer({
    count: visible.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,                                 // row height in px
  });

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" />
      <p>Selected: {selected ?? 'none'}</p>
      <div ref={parentRef} style={{ height: 600, overflow: 'auto' }}>
        <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
          {virtualizer.getVirtualItems().map((item) => (
            <div key={visible[item.index].id}
                 style={{ position: 'absolute', top: 0, width: '100%', height: item.size,
                          transform: \`translateY(\${item.start}px)\` }}>
              <Row candidate={visible[item.index]} onSelect={onSelect} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}`,
      },
      output: "Only about 15 to 20 rows exist in the DOM at any time instead of 10,000. Typing updates the input immediately while the filtered list catches up a moment later, and selecting a candidate doesn't re-render every Row, because onSelect stays the same function and memo skips rows whose props didn't change.",
      questions: [
        { q: 'When does a React component re-render?', a: "When its own state changes, when its parent re-renders (even if props are the same), or when a context value it reads changes. memo can skip the parent-triggered case if props are shallowly equal." },
        { q: 'Why might React.memo not prevent re-renders?', a: "Because the parent passes new object, array or function props each render, so the shallow comparison sees them as changed. Stabilise them with useMemo and useCallback, or restructure so they don't change." },
        { q: 'What is list virtualisation?', a: "Rendering only the rows currently visible in a scroll container, plus a small buffer, and positioning them inside a spacer of the full height. It keeps the DOM small, so huge lists scroll smoothly. TanStack Virtual and react-window are common libraries." },
        { q: 'How do you find React performance problems?', a: "Record with the React DevTools Profiler to see which components rendered, why, and how long they took, and use Chrome's Performance panel for long tasks. Then fix the biggest cause, instead of adding memo everywhere." },
        { q: 'What do useTransition and useDeferredValue do?', a: "They mark some updates as non-urgent so React can interrupt them to handle urgent ones like typing. useTransition wraps a state update; useDeferredValue gives you a lagging copy of a value for an expensive child." },
      ],
      answer30: "I measure first with the React Profiler and the Performance panel. The cheapest fixes are structural: move state down, pass children, split contexts. Then memo on expensive children, with useMemo and useCallback to keep props stable, because memo is useless if props change every render. For long lists I virtualise so only visible rows are in the DOM, and for typing-heavy UIs I use useDeferredValue or useTransition to keep input responsive. With React Compiler, much of the manual memoisation is automatic.",
      mistakes: [
        "Wrapping everything in useMemo and useCallback without measuring; it adds complexity and memory for nothing.",
        "Using memo but passing inline objects or functions as props.",
        "Rendering thousands of rows or table cells without virtualisation.",
        "Trap: 'Does useMemo guarantee the value is cached?' React treats it as a performance hint and may discard cached values; your code must still be correct if it recomputes.",
      ],
      takeaway: 'Profile first, fix structure, memo with stable props, virtualise long lists, defer non-urgent updates.',
    },

    {
      id: 'debounce-throttle-perf',
      title: 'Debounce and throttle for performance (with trailing calls and cancel)',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Debounce runs once after events stop; throttle runs at most once per interval. Production versions need trailing calls, cancel and flush.',
      what: [
        "Scroll, resize, input and mousemove events can fire dozens of times per second. **Debounce** waits until the events stop for a set time and then runs once (search as you type, autosave). **Throttle** runs at most once per interval while events keep coming (scroll position, infinite scroll checks, resize layout).",
        "The basic versions are in the JavaScript stack. Here the focus is the production details interviewers follow up with: a throttle that doesn't lose the last event, `cancel` and `flush` on debounce, and `requestAnimationFrame` for visual work.",
      ],
      deeper: [
        "**Leading vs trailing.** A simple throttle runs on the first call and ignores the rest of the window, so the final scroll position can be lost. A **trailing** call runs once more at the end of the window with the latest arguments. lodash's `throttle` does leading and trailing by default; its `debounce` is trailing by default.",
        "**cancel and flush.** `cancel()` drops a pending call, for example on component unmount or when the user clears the search box. `flush()` runs the pending call immediately, for example to save a draft before the user leaves the page.",
        "**requestAnimationFrame throttle:** for work that updates the screen (moving a tooltip, parallax), run it at most once per frame with `requestAnimationFrame` instead of a fixed time, so it lines up with the browser's paint.",
        "**Better than both, sometimes:** use `IntersectionObserver` instead of scroll handlers for lazy loading or infinite scroll, `ResizeObserver` instead of window resize for element size, and `{ passive: true }` on scroll and touch listeners so the browser can scroll without waiting for your handler. For search, also cancel stale requests with `AbortController` so old responses can't overwrite newer ones.",
      ],
      why: "Running a heavy handler or an API call on every event wastes requests, blocks the main thread and hurts INP. Rate-limiting the handler keeps the page responsive and the server calm.",
      analogy: "Debounce is a lift door that closes only after people stop walking in. Throttle is a bus that leaves every 10 minutes: it doesn't wait for everyone, but the last people at the stop still get the next bus (trailing call).",
      code: {
        lang: 'js',
        title: 'Debounce with cancel/flush and throttle with a trailing call, tested on a stream of events',
        source: `// Debounce with cancel() and flush(): runs once after calls stop for 'wait' ms
function debounce(fn, wait) {
  let timer, lastArgs, lastThis;
  function debounced(...args) {
    lastArgs = args; lastThis = this;
    clearTimeout(timer);
    timer = setTimeout(() => { timer = undefined; fn.apply(lastThis, lastArgs); }, wait);
  }
  debounced.cancel = () => { clearTimeout(timer); timer = undefined; };
  debounced.flush = () => { if (timer) { debounced.cancel(); fn.apply(lastThis, lastArgs); } };
  return debounced;
}

// Throttle with leading AND trailing calls: at most once per 'wait' ms, and the last call is never lost
function throttle(fn, wait) {
  let last = 0, timer, lastArgs;
  return function (...args) {
    const now = Date.now();
    const remaining = wait - (now - last);
    lastArgs = args;
    if (remaining <= 0) {                       // leading edge: run now
      clearTimeout(timer); timer = undefined;
      last = now;
      fn.apply(this, args);
    } else if (!timer) {                        // schedule one trailing run
      timer = setTimeout(() => {
        last = Date.now(); timer = undefined;
        fn.apply(this, lastArgs);
      }, remaining);
    }
  };
}

// Simulate a user typing / scrolling: one event every 20 ms for 240 ms
const start = Date.now();
const t = () => String(Math.round((Date.now() - start) / 100) * 100).padStart(3) + 'ms';
const search = debounce((q) => console.log(t(), 'debounced search:', q), 100);
const onScroll = throttle((y) => console.log(t(), 'throttled scroll y =', y), 100);

let i = 0;
const id = setInterval(() => {
  i++;
  search('q' + i);
  onScroll(i * 10);
  if (i === 12) clearInterval(id);              // last event at ~240 ms
}, 20);`,
      },
      output: "Prints (times rounded to 100 ms): '  0ms throttled scroll y = 10', '100ms throttled scroll y = 50', '200ms throttled scroll y = 100', '300ms throttled scroll y = 120', then '400ms debounced search: q12'. Twelve events became four scroll updates, including the final position 120 thanks to the trailing call, and one search for the final text. Exact y values can shift by one event on a busy machine because timers are not precise.",
      questions: [
        { q: 'Debounce vs throttle, with a performance example of each?', a: "Debounce waits until events stop and runs once, ideal for search-as-you-type or autosave. Throttle runs at most once per interval during continuous events, ideal for scroll or resize handlers that update the UI." },
        { q: 'What is the trailing call in a throttle and why does it matter?', a: "It's one final run at the end of the interval with the latest arguments. Without it, the last event can be dropped, so, for example, the UI shows a scroll position from slightly before the user stopped." },
        { q: 'Why add cancel and flush to a debounced function?', a: "cancel drops a pending call, which you need on unmount or when the input is cleared. flush runs the pending call now, which you need to save a draft before navigation or page close." },
        { q: 'When is requestAnimationFrame better than a time-based throttle?', a: "For visual updates like moving an element with the mouse. rAF runs at most once per frame, right before paint, so updates line up with the display instead of firing at arbitrary times." },
        { q: 'What can replace scroll handlers entirely?', a: "IntersectionObserver for lazy loading, infinite scroll and 'is it visible' checks, and ResizeObserver for element size changes. They are asynchronous and don't run on every scroll event." },
      ],
      answer30: "Debounce runs once after events stop, like search after typing; throttle runs at most once per interval, like a scroll handler. In production I make sure the throttle has a trailing call so the last event isn't lost, and the debounce has cancel for unmount and flush for saving before leaving. For visual updates I throttle with requestAnimationFrame, use passive listeners, and where possible replace scroll handlers with IntersectionObserver. For search I also abort stale requests.",
      mistakes: [
        "A throttle without a trailing call, losing the final scroll or resize state.",
        "Not cancelling a debounced call on unmount, so it runs against a component that's gone.",
        "Debouncing the API call but not aborting in-flight requests, so an old response can overwrite a newer one.",
        "Trap: 'Should you debounce a scroll-driven animation?' No. Debounce only fires after scrolling stops, so the animation would freeze while scrolling. Use rAF for that.",
      ],
      takeaway: 'Debounce = once after quiet, throttle = steady rate with a trailing call; add cancel/flush, and prefer rAF or observers when they fit.',
    },

    {
      id: 'measuring-performance',
      title: 'Measuring performance: Lighthouse, the Performance panel, and RUM',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Lab tools (Lighthouse, DevTools) find and debug problems; real user monitoring (RUM) tells you what users actually experience.',
      what: [
        "**Lab data** is collected in a controlled test: Lighthouse and the Chrome DevTools Performance panel load the page on your machine with throttled CPU and network. It's repeatable and great for debugging.",
        "**Field data** (RUM, real user monitoring) is collected from real visitors' browsers: their devices, networks and actual clicks. It's what users really feel, and it's what Google uses for Core Web Vitals (via the Chrome UX Report).",
      ],
      deeper: [
        "**Lighthouse** gives scores for performance, accessibility, best practices and SEO, plus specific suggestions. Its performance metrics are FCP, LCP, TBT, CLS and Speed Index. Scores vary run to run, so compare several runs and use the same settings. Run it in CI with Lighthouse CI and budgets to catch regressions.",
        "**Performance panel:** record a page load or an interaction. Look for **long tasks** (red-flagged, over 50 ms) on the Main track, the flame chart of what JavaScript ran, Layout and Recalculate Style blocks, and the timings track for LCP and layout shifts. CPU throttling (4x or 6x) mimics a mid-range phone. The panel also shows live Core Web Vitals, including INP for your own clicks.",
        "**RUM:** the `web-vitals` library or `PerformanceObserver` in your own code sends metrics to an endpoint; tools like Sentry, Datadog RUM, New Relic or Vercel Analytics do it for you. Segment by page, device and country, and look at the 75th percentile.",
        "**Other lab tools:** WebPageTest (real devices and locations, filmstrips, waterfalls), the Network panel (waterfall, priorities, caching), and PageSpeed Insights (Lighthouse lab plus CrUX field data for public URLs).",
      ],
      why: "You can't improve what you don't measure. Lab tools tell you why something is slow; field data tells you whether it matters to real users and whether your fix worked.",
      analogy: "Lab testing is a car on a test track: controlled and repeatable. RUM is the dashcam data from thousands of real drivers in real traffic. You need the track to diagnose and the dashcams to know what really happens.",
      code: {
        lang: 'js',
        title: 'Spot long tasks and LCP in the browser with PerformanceObserver',
        source: `// Long tasks: anything that blocked the main thread for more than 50 ms
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('Long task', Math.round(entry.duration), 'ms at', Math.round(entry.startTime));
  }
}).observe({ type: 'longtask', buffered: true });

// LCP candidates: the last one reported before user input is the final LCP
new PerformanceObserver((list) => {
  const last = list.getEntries().at(-1);
  console.log('LCP', Math.round(last.startTime), 'ms', last.element);
}).observe({ type: 'largest-contentful-paint', buffered: true });

// Your own timings around a slow operation (shows up in the Performance panel's Timings track)
performance.mark('render-table-start');
renderCandidateTable(data);
performance.mark('render-table-end');
performance.measure('render-table', 'render-table-start', 'render-table-end');`,
      },
      output: "In the console you see each long task with its duration and the LCP time with the element that caused it, for example the hero img. The 'render-table' measure appears in the Performance panel next to the flame chart, so you can see exactly how much of a long task your table rendering takes.",
      questions: [
        { q: 'Lab data vs field data?', a: "Lab data comes from a controlled test like Lighthouse on one machine and is repeatable, good for debugging. Field data comes from real users' devices and networks and shows the real experience; Google's Core Web Vitals assessment uses field data." },
        { q: 'What is a long task?', a: "Any piece of work that keeps the main thread busy for more than 50 ms. During it the browser can't respond to input, so long tasks are the main cause of poor INP and high Total Blocking Time." },
        { q: 'How do you use the Chrome Performance panel to debug a slow interaction?', a: "Turn on CPU throttling, start recording, perform the interaction, stop, then look at the Main track for long tasks, open the flame chart to see which functions took the time, and check for layout or style recalculation blocks." },
        { q: 'What is RUM and how do you implement it?', a: "Real user monitoring: collecting performance metrics from real visitors. Use the web-vitals library or PerformanceObserver to capture metrics, send them with sendBeacon to an endpoint or a vendor like Sentry or Datadog, and analyse the 75th percentile per page and device." },
      ],
      answer30: "I use lab tools to diagnose and field data to decide. Lighthouse and the DevTools Performance panel, with CPU throttling, show long tasks, the flame chart, layout work and the LCP element, and Lighthouse CI catches regressions. For real users I collect Core Web Vitals with the web-vitals library or a RUM tool, and look at the 75th percentile by page and device. If lab and field disagree, field wins.",
      mistakes: [
        "Testing only on a fast laptop with no CPU or network throttling.",
        "Chasing a Lighthouse score of 100 while real users' INP is poor.",
        "Comparing single Lighthouse runs; results vary, so use several runs or a median.",
        "Trap: 'Lighthouse says 95 but Search Console says poor. Which is right?' Search Console uses real user data, so it reflects what users experience; the lab test probably doesn't match their devices or interactions.",
      ],
      takeaway: 'Lab to diagnose, field to decide; look for long tasks and measure the 75th percentile.',
    },

    {
      id: 'storage-same-origin',
      title: 'Browser storage and the same-origin policy',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Cookies, localStorage, sessionStorage and IndexedDB differ in size, lifetime and who can read them; the same-origin policy isolates sites from each other, and CORS relaxes it on purpose.',
      what: [
        "**Cookies:** small (about 4 KB each), sent to the server with every matching request, can be `HttpOnly` (JavaScript can't read them). **localStorage:** about 5 MB per origin, persists until cleared, synchronous, readable by any script on the page. **sessionStorage:** like localStorage but per tab, cleared when the tab closes. **IndexedDB:** large, asynchronous, structured storage for big or offline data. **Cache Storage:** for service workers.",
        "The **same-origin policy** says a page can only read data from the same **origin**: same scheme, host and port. `https://app.example.com` can't read responses or storage from `https://api.example.com` unless that server allows it with **CORS** headers.",
      ],
      deeper: [
        "**Auth tokens:** storing JWTs in localStorage means any XSS can steal them. An `HttpOnly; Secure; SameSite` cookie can't be read by JavaScript, so XSS can't exfiltrate it (though XSS can still make requests). Cookies bring CSRF risk instead, which `SameSite=Lax` or `Strict` plus CSRF tokens handle.",
        "**CORS:** the browser sends an `Origin` header; the server answers with `Access-Control-Allow-Origin`. Non-simple requests (JSON body, custom headers, PUT/DELETE) first send an `OPTIONS` **preflight**. With cookies you need `credentials: 'include'` on the client and `Access-Control-Allow-Credentials: true` plus a specific origin (not `*`) on the server. CORS is enforced by the browser; it does not protect your API from curl or other servers.",
        "**Site vs origin:** `app.example.com` and `api.example.com` are different origins but the same **site**, which matters for `SameSite` cookies. **Performance angle:** localStorage is synchronous and blocks the main thread, so don't store big blobs there; cookies add bytes to every request, so keep them small and scoped to the right path or domain.",
        "**Storage limits and eviction:** browsers give each origin a quota and can evict data under storage pressure; `navigator.storage.persist()` requests persistent storage. Safari can clear script-writable storage for sites the user hasn't visited in a while.",
      ],
      why: "Choosing the wrong storage creates security holes (tokens stolen by XSS) or performance problems (huge cookies on every request, synchronous localStorage reads). Same-origin and CORS questions come up in almost every full-stack interview.",
      analogy: "Cookies are a wristband you show at every door (sent with every request). localStorage is a locker in the building anyone inside can open. sessionStorage is a locker that's emptied when you leave. The same-origin policy is that you can only open lockers in your own building; CORS is the other building's guest list.",
      code: {
        lang: 'js',
        title: 'Storage choices and a credentialed CORS setup',
        source: `// Browser: non-sensitive preferences in localStorage (sync, about 5 MB, any script can read it)
localStorage.setItem('theme', 'dark');

// Per-tab state, cleared when the tab closes
sessionStorage.setItem('wizardStep', '2');

// Auth: the server sets an HttpOnly cookie; JavaScript never sees the token
// Set-Cookie: access=...; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=900
await fetch('https://api.example.com/me', { credentials: 'include' });

// Server (Express + cors): allow exactly one origin, with cookies
import cors from 'cors';
app.use(cors({
  origin: 'https://app.example.com',   // must be specific when credentials are allowed
  credentials: true,                   // sends Access-Control-Allow-Credentials: true
}));`,
      },
      output: "The theme survives restarts, the wizard step disappears when the tab closes, and the auth cookie is sent automatically to the API but can't be read by any script, so an XSS bug can't steal it. The browser lets app.example.com read the API's responses because the API's CORS headers name that exact origin.",
      questions: [
        { q: 'localStorage vs sessionStorage vs cookies?', a: "localStorage is about 5 MB per origin and persists until cleared. sessionStorage is per tab and cleared when the tab closes. Cookies are small, sent to the server with every matching request, and can be HttpOnly so JavaScript can't read them." },
        { q: 'Where should you store a JWT in the browser?', a: "Preferably in an HttpOnly, Secure, SameSite cookie, so XSS can't read it, and protect against CSRF with SameSite and CSRF tokens where needed. localStorage is simpler but any injected script can steal the token." },
        { q: 'What is the same-origin policy?', a: "A browser rule that a page can only read data (responses, storage, DOM) from the same origin, meaning the same scheme, host and port. It stops a malicious site from reading your bank's pages using your logged-in session." },
        { q: 'What is a CORS preflight?', a: "An automatic OPTIONS request the browser sends before a non-simple cross-origin request, such as one with a JSON body, custom headers or PUT/DELETE, to ask the server which methods, headers and origins are allowed." },
        { q: 'Does CORS protect your API?', a: "No. CORS is enforced by browsers to protect users. Scripts, curl and other servers ignore it, so the API still needs authentication, authorisation and rate limiting." },
      ],
      answer30: "Cookies are small and sent with every request, and can be HttpOnly so scripts can't read them; that's where I keep auth tokens, with Secure and SameSite. localStorage persists about 5 MB per origin and sessionStorage is per tab; both are synchronous and readable by any script, so only non-sensitive data. IndexedDB is for large or offline data. The same-origin policy blocks reading another origin's data, and CORS lets a server allow specific origins, with credentials needing an exact origin.",
      mistakes: [
        "Storing access tokens in localStorage in an app with any risk of XSS.",
        "`Access-Control-Allow-Origin: *` together with credentials; browsers reject it.",
        "Treating CORS as API security.",
        "Trap: 'Are app.example.com and api.example.com the same origin?' No, the host differs, so they're different origins, but they are the same site, which matters for SameSite cookies.",
        "On your resume: Octagnt uses cookie-based JWT auth with automatic renewal, which is exactly this trade-off; be ready to explain your SameSite and CSRF choices.",
      ],
      takeaway: 'HttpOnly cookies for auth, localStorage only for non-sensitive small data, origin = scheme + host + port, CORS is the server opting in.',
    },

    {
      id: 'js-engine-main-thread',
      title: 'JS engine basics (JIT, hidden classes) and the main thread',
      level: 'advanced',
      priority: 'good',
      frequency: 'occasional',
      summary: 'V8 interprets then JIT-compiles hot code using hidden classes and inline caches; all of it shares one main thread with rendering, so long tasks freeze the page.',
      what: [
        "A JavaScript engine (V8 in Chrome and Node, SpiderMonkey in Firefox, JavaScriptCore in Safari) parses your code, runs it quickly in an **interpreter**, watches which functions are 'hot', and **JIT-compiles** (just-in-time) them into fast machine code based on the types it has seen.",
        "In the browser, your JavaScript runs on the **main thread**, the same thread that handles input, style, layout and paint. A **long task** (over 50 ms) blocks all of that, so clicks feel ignored and animations stutter.",
      ],
      deeper: [
        "**V8 pipeline:** Ignition (bytecode interpreter) -> Sparkplug (fast baseline compiler) -> Maglev (mid-tier optimiser) -> TurboFan (top-tier optimiser). Optimised code makes assumptions ('this is always a small integer', 'this object always has this shape'). If an assumption breaks, V8 **deoptimises** back to slower code.",
        "**Hidden classes (V8 calls them 'maps' or shapes):** objects created with the same properties in the same order share a hidden class, so property lookups become a fixed offset. **Inline caches** remember the shapes seen at each property access. Code that always sees one shape is monomorphic and fast; many shapes (megamorphic) are slow. Practical rules: initialise all properties in the constructor, in the same order; don't add properties later; avoid `delete`; keep arrays of one element type.",
        "**Garbage collection:** V8 uses a generational GC; most objects die young and are cleaned cheaply. Creating lots of short-lived objects in hot loops still causes GC pauses.",
        "**Freeing the main thread:** break long work into chunks and yield (`await scheduler.yield()` where supported, otherwise `setTimeout(0)`), move CPU-heavy work (parsing big files, image processing) to a **Web Worker**, and keep event handlers short: update the UI first, then do the rest. The same idea applies in Node: a long synchronous loop blocks every request on that process.",
      ],
      why: "It explains why some JavaScript is mysteriously slow and why the page freezes during heavy work. INP problems almost always come down to long tasks on the main thread.",
      analogy: "The main thread is a single cashier who also restocks shelves. If they spend 300 ms restocking (a long task), the queue at the till (clicks) waits. Hidden classes are standard-sized boxes on the shelves: if every box is the same shape, the cashier grabs items without looking.",
      code: [
        {
          lang: 'js',
          title: 'Hidden classes, checked with V8 debug helpers',
          source: `// Run with: node --allow-natives-syntax hidden-classes.mjs
// %HaveSameMap is a V8 debug helper that says whether two objects share a hidden class ("map").

function Point(x, y) { this.x = x; this.y = y; }   // same properties, same order, every time

const a = new Point(1, 2);
const b = new Point(3, 4);
console.log('a and b share a hidden class:', %HaveSameMap(a, b));

const c = { x: 1, y: 2 };
const d = { y: 2, x: 1 };                           // same keys, different order
console.log('c and d share a hidden class:', %HaveSameMap(c, d));

const e = new Point(5, 6);
e.z = 7;                                            // property added later
console.log('a and e share a hidden class:', %HaveSameMap(a, e));

const f = new Point(7, 8);
delete f.x;                                         // delete can drop the object into slow "dictionary" mode
console.log('f has fast properties:', %HasFastProperties(f));`,
        },
        {
          lang: 'js',
          title: 'A long task delays input; chunking fixes it',
          source: `// A "click handler" scheduled for 10 ms from now
const start = performance.now();
setTimeout(() => console.log('timer wanted 10 ms, ran after', Math.round(performance.now() - start), 'ms'), 10);

// A long task: 300 ms of synchronous work blocks the only main thread
function heavyWork(ms) { const end = performance.now() + ms; while (performance.now() < end) {} }
heavyWork(300);

// Fix: split the same work into ~10 ms chunks and yield between them
async function chunkedWork(totalMs, chunkMs = 10) {
  for (let done = 0; done < totalMs; done += chunkMs) {
    heavyWork(chunkMs);
    await new Promise((r) => setTimeout(r, 0));     // yield (in browsers: await scheduler.yield())
  }
}
setTimeout(async () => {
  const s2 = performance.now();
  setTimeout(() => console.log('during chunked work, timer ran after', Math.round(performance.now() - s2), 'ms'), 10);
  await chunkedWork(300);
  console.log('chunked work finished');
}, 50);`,
        },
      ],
      output: "The first script prints 'a and b share a hidden class: true', 'c and d share a hidden class: false', 'a and e share a hidden class: false' and 'f has fast properties: false'. The second prints 'timer wanted 10 ms, ran after 300 ms' (the long task blocked it), then 'during chunked work, timer ran after 11 ms' and 'chunked work finished': the same 300 ms of work no longer blocks the timer, just as chunking lets a browser handle clicks between chunks.",
      questions: [
        { q: 'What is JIT compilation?', a: "Just-in-time compilation: the engine starts by interpreting code, profiles which functions run often and with which types, then compiles those hot functions to optimised machine code while the program runs. If its type assumptions break, it deoptimises." },
        { q: 'What are hidden classes and why do they matter?', a: "V8 gives objects with the same properties added in the same order a shared internal shape, so property access becomes a fast fixed-offset lookup cached at each call site. Adding properties later, changing order or using delete creates new shapes and slows hot code." },
        { q: 'What is a long task and why is it bad?', a: "Work that occupies the main thread for more than 50 ms. While it runs the browser can't handle input, run style or layout, or paint, so clicks feel ignored and INP gets worse." },
        { q: 'How do you keep the main thread free?', a: "Split long work into small chunks and yield between them with scheduler.yield or setTimeout, move heavy computation to a Web Worker, keep event handlers minimal and defer non-urgent work, and reduce unnecessary rendering." },
      ],
      answer30: "V8 parses JavaScript into bytecode and interprets it, then JIT-compiles hot functions using the types and object shapes it has observed. Objects built with the same properties in the same order share a hidden class, which makes property access fast, so I initialise everything in the constructor and avoid delete in hot paths. In the browser all JS shares the main thread with input and rendering, so any task over 50 ms blocks interaction. I chunk work and yield, or move it to a Web Worker.",
      note: "`scheduler.yield()` is supported in Chromium-based browsers and has been rolling out elsewhere; check current support and feature-detect it, falling back to `setTimeout`. The `%` helpers in the first snippet are V8 internals for learning only and need the `--allow-natives-syntax` flag.",
      mistakes: [
        "Micro-optimising object shapes before checking for long tasks; the main-thread problem is far more common.",
        "Doing heavy parsing or sorting of big data in a click handler.",
        "Thinking async/await makes code run in parallel. An async function still runs on the main thread between awaits.",
        "Trap: 'Do Web Workers share memory with the page?' Not by default. They communicate by messages that copy data (or transfer ownership of buffers); SharedArrayBuffer needs cross-origin isolation headers.",
      ],
      takeaway: 'Keep object shapes stable for the JIT, and keep every main-thread task short.',
    },
  ],
  rapidFire: [
    { q: 'First network step after typing a URL?', a: 'DNS lookup (after checking caches).' },
    { q: 'What does TLS 1.3 add on a new connection?', a: 'One round trip.' },
    { q: 'Steps of the critical rendering path?', a: 'DOM, CSSOM, render tree, layout, paint, composite.' },
    { q: 'Is CSS render-blocking or parser-blocking?', a: 'Render-blocking.' },
    { q: 'defer vs async?', a: 'defer runs after parsing in order; async runs when downloaded, any order.' },
    { q: 'Cheapest properties to animate?', a: 'transform and opacity.' },
    { q: 'What is layout thrashing?', a: 'Alternating DOM writes and layout reads, forcing many layouts.' },
    { q: 'Good LCP threshold?', a: '2.5 seconds or less at the 75th percentile.' },
    { q: 'Good INP threshold?', a: '200 ms or less.' },
    { q: 'Good CLS threshold?', a: '0.1 or less.' },
    { q: 'What replaced FID, and when?', a: 'INP, in March 2024.' },
    { q: 'Lab proxy for INP in Lighthouse?', a: 'Total Blocking Time (TBT).' },
    { q: 'Should the LCP image be lazy loaded?', a: 'No. Load it eagerly with fetchpriority high.' },
    { q: 'How do you split code in React?', a: 'React.lazy with dynamic import inside Suspense.' },
    { q: 'Why set width and height on images?', a: 'To reserve space and avoid layout shift.' },
    { q: 'no-cache vs no-store?', a: 'no-cache stores but revalidates; no-store never stores.' },
    { q: 'How do you cache JS forever but deploy instantly?', a: 'Hashed filenames with long max-age, HTML with no-cache.' },
    { q: 'preload vs prefetch?', a: 'preload: this page, high priority. prefetch: next page, low priority.' },
    { q: 'What does tree shaking need?', a: 'ES modules and side-effect-free code.' },
    { q: 'What is a long task?', a: 'Main-thread work over 50 ms.' },
    { q: 'Throttle detail people forget?', a: 'A trailing call so the last event is not lost.' },
    { q: 'What is an origin?', a: 'Scheme + host + port.' },
    { q: 'Where to store an auth token?', a: 'HttpOnly, Secure, SameSite cookie.' },
    { q: 'Why initialise all properties in the constructor?', a: 'So objects share one hidden class and stay fast.' },
  ],
};

export default webPerf;
