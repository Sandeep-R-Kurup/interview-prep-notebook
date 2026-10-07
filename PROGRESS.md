# Progress

Last updated: 7 October 2026. Run `npm run check` for live counts.

## Status: all 23 stacks written

411 topics, 581 rapid-fire questions, about 2,170 swipe cards.

| # | Stack | Topics | Rapid-fire |
|---|---|---|---|
| 1 | My Resume and Projects | 18 | 22 |
| 2 | React.js | 35 | 44 |
| 3 | JavaScript | 35 | 46 |
| 4 | Node.js (incl. 16->18 and 18->20 migration, LTS status 2026) | 21 | 27 |
| 5 | Express.js (incl. Express 4 vs 5) | 16 | 23 |
| 6 | Databases (MongoDB/Mongoose, PostgreSQL, Redis, Firebase) | 20 | 26 |
| 7 | TypeScript | 18 | 26 |
| 8 | Next.js (written for Next.js 16) | 16 | 22 |
| 9 | API Design and Communication | 17 | 25 |
| 10 | Redux and Redux-Saga | 14 | 23 |
| 11 | HTML5, CSS3, SCSS | 16 | 24 |
| 12 | UI Libraries | 10 | 17 |
| 13 | Cloud and DevOps | 19 | 28 |
| 14 | Architecture (incl. 6 system design walkthroughs) | 20 | 24 |
| 15 | Integrations and AI | 14 | 23 |
| 16 | Testing and Quality | 16 | 24 |
| 17 | Tools and Workflow | 12 | 22 |
| 18 | Security (OWASP Top 10 2025) | 18 | 25 |
| 19 | Web Performance and Browser Internals | 14 | 24 |
| 20 | Machine Coding Round (React) | 14 | 18 |
| 21 | JavaScript Coding and Output Questions | 14 | 22 |
| 22 | DSA and Problem Solving | 17 | 24 |
| 23 | HR and Behavioral | 17 | 22 |

App: sidebar, search, progress, bookmarks, filters, swipe Q&A cards, flip cards, rapid-fire, swipe between topics on mobile, dark mode, GitHub Pages deploy.

## How the content was checked

- Every snippet that states an output was run (Node 26, tsx, Jest, esbuild + jsdom for the React machine-coding solutions), and the `output` text matches the real run.
- TypeScript snippets compile under `--strict` with TypeScript 5.9 and 7.0.
- Snippets that need a server, database, AWS, Docker or a browser were written to current APIs but not executed.
- Version facts were checked on the web in October 2026 where marked in a yellow `note`.

## Double-check before an interview (less certain or fast-moving)

- **Node.js:** release schedule (26 becomes LTS on 28 Oct 2026; Node 20 is end-of-life; yearly releases from Node 27).
- **Next.js 16:** Cache Components default, `middleware.ts` renamed to `proxy.ts`, next/image `preload`.
- **React Router v7 imports and TanStack Virtual API:** written from memory.
- **Cloud:**
  - API Gateway timeout increases.
  - ingress-nginx retirement (March 2026).
  - Terraform S3-native state locking.
- **UI libraries:** MUI v9, Tailwind v4.3, shadcn/ui defaulting to Base UI. Ant Design and Chakra versions are not pinned.
- **Integrations:**
  - Razorpay flow, Twilio Media Streams / ConversationRelay, Jitsi IFrame API: from knowledge, not a fresh search.
  - Zoho token limits: not confirmed.
- **Security:** RFC 9700 (OAuth security BCP) and helmet / express-rate-limit option names: not looked up.
- **Machine coding:** the solutions call dummyjson.com endpoints; they were tested against a mocked fetch.

## Content you should personalise

- **HR and Behavioral:** answers are templates built only from facts in projects.js. Fill every "(say your real ...)" gap with your real story, team size and numbers.
- **Integrations and AI, HR:** Stripe, Boolean search, Jitsi, the Twilio voice agent, Zoho CRM and the "~70%" figure carry a yellow note because they are in the study brief, not on the resumes.
- **UI Libraries, Redux, Databases (Redis, Firebase):** projects.js doesn't say which of these you used. Notes tell you to present them as knowledge unless you really used them.

## Things to fix in your resume or answers

- Node upgrade: the brief says 16 to 18; all three resumes say 18 to 20. Match the resume you sent.
- Octagnt role: the resumes say "Feb 2026 - Present"; the brief says the role ends September 2026. Update the resume, and prepare your "why are you leaving" answer (HR stack has both versions).
- Stripe, Boolean search, Jitsi, Twilio voice agent, Zoho CRM, and the OpenAI JD "~70%" figure are in the brief but not on the resumes. Either add them to the resume or be ready to explain why they're not there.

## Possible next steps

- The JS bundle is about 890 KB gzipped because all content ships in one file. Loading each stack on demand would make the first load faster on mobile data.
- Two flashcards overlap: JavaScript "Promise combinators in depth" and the original promises topic both ask all vs allSettled vs race vs any.
