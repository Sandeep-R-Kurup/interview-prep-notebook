// Testing and Quality stack. Topics are auto-sorted Basic -> Intermediate -> Advanced by the registry.
// Jest examples were run with Jest 30 on Node; outputs match real runs.

const testing = {
  name: 'Testing and Quality',
  intro: 'How to prove your code works and keep it working. Interviewers care less about tool trivia and more about what you test, why, and how you keep tests fast and trustworthy.',
  topics: [
    {
      id: 'testing-pyramid-trophy',
      title: 'The testing pyramid and the testing trophy',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Many fast unit tests, fewer integration tests, a handful of e2e tests. The trophy shifts the weight towards integration.',
      what: [
        "The testing pyramid is a picture of how many tests of each kind you should have. The wide bottom is unit tests: many, fast, cheap. The middle is integration tests: fewer, slower. The narrow top is end-to-end (e2e) tests: very few, slowest, most realistic.",
        "The testing trophy (Kent C. Dodds) is a newer shape for frontend-heavy apps. It adds static checks (TypeScript, ESLint) at the base and makes integration tests the biggest part, because they give the most confidence per test.",
      ],
      deeper: [
        "Both shapes balance two forces: confidence and cost. The closer a test is to how a real user uses the app, the more it proves, but the slower and more fragile it is. A unit test that mocks everything runs in milliseconds but can pass while the real system is broken.",
        "The 'ice-cream cone' is the anti-pattern: mostly manual and e2e tests, few unit tests. Suites like that are slow, flaky and expensive to maintain.",
        "For a Node API, a practical mix is: unit tests for pure business logic (pricing, scoring, validation), integration tests that hit Express routes with Supertest against a real test database, and a few e2e tests for critical user journeys like login and checkout.",
      ],
      why: "Without a strategy, teams either write too few tests and ship bugs, or write the wrong tests: slow, brittle e2e suites that nobody trusts. The pyramid and trophy give you a shared vocabulary for where to spend testing effort.",
      analogy: "Checking a car. Unit tests check each part on the bench (brakes, lights). Integration tests check parts that work together (pedal moves the brakes). An e2e test is a real test drive. You do lots of bench checks, some combined checks, and only a few full test drives.",
      code: {
        lang: 'text',
        title: 'Two shapes, same idea',
        source: `Testing pyramid                   Testing trophy

        /\\    e2e (few)                  ___  e2e
       /  \\                             |   |
      /----\\  integration              /     \\  integration (biggest)
     /      \\                          \\     /
    /--------\\ unit (many)               |_|   unit
                                        =====  static (TS, ESLint)

Rule of thumb: the higher up, the slower, the more realistic, the fewer.`,
      },
      output: "There is nothing to run here. The diagram shows that both shapes put fast tests at the bottom and only a few slow e2e tests at the top. They differ on the middle: the trophy says integration tests give the best value.",
      questions: [
        { q: 'What is the testing pyramid?', a: 'A guideline to have many fast unit tests, fewer integration tests, and very few slow end-to-end tests. It balances confidence against speed and maintenance cost.' },
        { q: 'How is the testing trophy different?', a: 'It adds static analysis (TypeScript, linting) as the base and makes integration tests the largest layer, because they test pieces working together the way users use them, without the cost of full e2e tests.' },
        { q: 'What is the ice-cream cone anti-pattern?', a: 'A suite that is mostly manual and e2e tests with few unit tests. It is slow, flaky, and gives late feedback, so developers stop trusting it.' },
        { q: 'Which layer would you invest in for a Node/Express API?', a: 'Integration tests with Supertest against a real test database give the most confidence, plus unit tests for pure business rules. A few e2e tests cover critical flows like login.' },
      ],
      answer30: "The pyramid says have many fast unit tests, fewer integration tests, and very few end-to-end tests, because the higher you go the slower and more fragile tests get. The trophy, popular for frontend, puts static checks like TypeScript at the base and makes integration tests the biggest layer, since they give the most confidence per test. In practice I unit test pure logic, integration test API routes with Supertest, and keep e2e tests for critical journeys.",
      mistakes: [
        "Treating the shape as a strict ratio. It's a guideline about cost and confidence, not a number to hit.",
        'Mocking so much in unit tests that they pass while the real integration is broken.',
        'Covering every edge case with e2e tests. Push edge cases down to unit tests and keep e2e for happy paths.',
        "Trap: 'Pyramid or trophy, which is right?' Both. The pyramid fits backend logic; the trophy fits UI code where integration tests are cheap with tools like React Testing Library.",
      ],
      takeaway: 'Fast tests at the bottom, few slow ones at the top; integration tests usually give the best value.',
    },

    {
      id: 'unit-integration-e2e',
      title: 'Unit vs integration vs end-to-end tests',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Unit tests check one piece alone, integration tests check pieces together, e2e tests drive the whole app like a user.',
      what: [
        "A **unit test** checks one small piece of code (a function, a class, a hook) on its own. Anything slow or external, like the database or an email service, is replaced with a fake.",
        "An **integration test** checks that several real pieces work together, for example an Express route plus its middleware, service and a real test database.",
        "An **end-to-end (e2e) test** runs the whole system the way a user does: a real browser clicks through the real frontend talking to the real backend.",
      ],
      deeper: [
        "The boundaries are fuzzy, and interviewers know that. What matters is being able to say what is real and what is faked in each test. A Supertest test with a mocked repository is closer to a unit test of the HTTP layer; the same test with a real MongoDB (for example a Docker container or `mongodb-memory-server`) is an integration test.",
        "Trade-offs: unit tests are fast and pinpoint the failure, but miss wiring bugs. Integration tests catch wrong queries, middleware order and serialization bugs. E2E tests catch everything, including config and browser issues, but are slow, flaky and hard to debug.",
      ],
      why: "Each kind catches different bugs. Knowing the difference lets you put each check at the cheapest level that still catches the bug.",
      analogy: "Building a house. A unit test checks that each brick is solid. An integration test checks that a wall stands when bricks and cement meet. An e2e test is someone actually living in the finished house for a day.",
      code: {
        lang: 'js',
        title: 'Same feature, three levels',
        source: `// UNIT: pure logic, no I/O
test('score is weighted', () => {
  expect(scoreCandidate({ skills: 8, experience: 6 })).toBe(7.2);
});

// INTEGRATION: real Express app + real test database, via Supertest
test('POST /candidates saves and returns 201', async () => {
  const res = await request(app).post('/candidates').send({ name: 'Asha' });
  expect(res.status).toBe(201);
  expect(await Candidate.countDocuments()).toBe(1);
});

// E2E: a real browser against the running app (Playwright)
test('recruiter can add a candidate', async ({ page }) => {
  await page.goto('/candidates/new');
  await page.getByLabel('Name').fill('Asha');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Candidate saved')).toBeVisible();
});`,
      },
      output: "The unit test runs in about a millisecond and only proves the formula. The integration test takes tens of milliseconds and proves routing, validation and the database write. The e2e test takes seconds and proves a user can actually do it in a browser.",
      questions: [
        { q: 'What is the difference between a unit and an integration test?', a: 'A unit test checks one piece in isolation with its dependencies faked. An integration test checks several real pieces working together, like a route, its middleware and a real database.' },
        { q: 'Is a Supertest test a unit or integration test?', a: 'It depends on what is real. With mocked repositories it mostly tests the HTTP layer in isolation; with a real test database it is an integration test.' },
        { q: 'Why not test everything end-to-end?', a: 'E2E tests are slow, flaky and hard to debug, because a failure could come from anywhere. Edge cases are cheaper and clearer at the unit level.' },
        { q: 'What bugs do unit tests miss?', a: 'Wiring bugs: wrong query filters, middleware order, serialization, config, and mismatched contracts between modules or services.' },
      ],
      answer30: "A unit test checks one piece, like a function, with its dependencies faked, so it's fast and pinpoints failures. An integration test checks real pieces together, for example an Express route with a real test database through Supertest, which catches wiring bugs. An end-to-end test drives the real app in a browser like a user. I put edge cases in unit tests, main flows in integration tests, and a few critical journeys in e2e.",
      mistakes: [
        'Calling a test with a mocked database an integration test without saying what is mocked.',
        'Duplicating the same edge case at all three levels.',
        'Letting e2e tests depend on each other or on shared data.',
        "Trap: 'Can integration tests use mocks?' Yes, usually for third parties you don't own (payment, email). The parts you own stay real.",
      ],
      takeaway: 'Say what is real and what is faked: that is what makes a test unit, integration, or e2e.',
    },

    {
      id: 'jest-basics',
      title: 'Jest basics: describe, it, expect, and matchers',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'describe groups tests, it/test defines one, expect plus a matcher states what should be true.',
      what: [
        "Jest is a JavaScript test runner. You group related tests with `describe`, write each test with `it` (or its alias `test`), and check results with `expect(value).matcher(expected)`.",
        "The most used matchers: `toBe` (same value or same reference), `toEqual` (same content, deep), `toMatchObject` (contains these fields), `toContain`, `toThrow`, `toBeCloseTo` (decimals), and `.not` to flip any of them.",
      ],
      deeper: [
        "`toBe` uses `Object.is`, so two objects with the same content fail it. `toEqual` compares recursively and ignores `undefined` properties; `toStrictEqual` also checks `undefined` properties and class types.",
        "Setup and teardown hooks: `beforeAll`/`afterAll` run once per file or describe block (open and close a DB connection), and `beforeEach`/`afterEach` run around every test (reset data and mocks). Each test should be independent of the order it runs in.",
        "For `toThrow`, wrap the call in a function: `expect(() => fn()).toThrow()`. Otherwise the error is thrown before `expect` can catch it.",
      ],
      why: "A small, readable vocabulary makes tests read like specifications. A failing test then tells you exactly which behaviour broke.",
      analogy: "A checklist for a home inspection. `describe` is the room, `it` is one line on the checklist, and `expect` is the inspector checking that line.",
      code: {
        lang: 'js',
        title: 'price.test.js',
        source: `function applyDiscount(price, percent) {
  if (percent < 0 || percent > 100) throw new RangeError('percent must be 0-100');
  return Math.round(price * (1 - percent / 100) * 100) / 100;
}

describe('applyDiscount', () => {
  it('takes 10% off', () => {
    expect(applyDiscount(200, 10)).toBe(180);
  });

  it('handles floating point money', () => {
    expect(0.1 + 0.2).not.toBe(0.3);        // classic float trap
    expect(0.1 + 0.2).toBeCloseTo(0.3);     // use toBeCloseTo for decimals
    expect(applyDiscount(19.99, 15)).toBe(16.99);
  });

  it('throws on a bad percent', () => {
    expect(() => applyDiscount(100, 150)).toThrow(RangeError);
    expect(() => applyDiscount(100, -1)).toThrow('percent must be 0-100');
  });

  it('compares objects by value with toEqual', () => {
    const order = { id: 1, items: ['pen'] };
    expect(order).toEqual({ id: 1, items: ['pen'] });     // deep equality
    expect(order).not.toBe({ id: 1, items: ['pen'] });    // different reference
    expect(order).toMatchObject({ id: 1 });               // subset match
    expect(order.items).toContain('pen');
  });
});`,
      },
      output: "`npx jest` reports 4 passed tests. `0.1 + 0.2` is 0.30000000000000004, so `toBe(0.3)` would fail but `toBeCloseTo(0.3)` passes. The object passes `toEqual` (same content) and fails `toBe` (different reference), which is why `.not.toBe` passes.",
      questions: [
        { q: 'What is the difference between toBe and toEqual?', a: '`toBe` checks identity with `Object.is`, so it suits primitives. `toEqual` compares objects and arrays recursively by content.' },
        { q: 'Why wrap the call in a function when using toThrow?', a: 'If you call the function directly, it throws before `expect` runs and the test crashes. Passing `() => fn()` lets Jest call it and catch the error.' },
        { q: 'beforeEach vs beforeAll?', a: '`beforeAll` runs once before all tests in the block, good for expensive setup like a DB connection. `beforeEach` runs before every test, good for resetting data so tests stay independent.' },
        { q: 'What is the difference between toEqual and toStrictEqual?', a: '`toStrictEqual` also fails on `undefined` properties, sparse arrays and different class types, which `toEqual` ignores.' },
      ],
      answer30: "In Jest, describe groups related tests, it or test defines one case, and expect with a matcher states the expectation. toBe is identity, good for primitives; toEqual is deep equality for objects; toMatchObject checks a subset; toThrow needs the call wrapped in a function. I use beforeEach to reset state so tests don't depend on each other, and beforeAll for expensive setup like opening a database connection.",
      mistakes: [
        'Using `toBe` to compare objects or arrays.',
        'Writing `expect(fn()).toThrow()` instead of `expect(() => fn()).toThrow()`.',
        'Sharing mutable data between tests so they only pass in a certain order.',
        'Comparing decimals with `toBe` instead of `toBeCloseTo`.',
        "Trap: 'Does toEqual check that a property is undefined?' No. `{ a: 1, b: undefined }` equals `{ a: 1 }` with `toEqual`; use `toStrictEqual` if that matters.",
      ],
      takeaway: 'describe groups, it defines, expect asserts; toBe for primitives, toEqual for objects.',
    },

    {
      id: 'test-doubles',
      title: 'Test doubles: mock, stub, fake, spy',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Stand-ins for real dependencies: a stub returns canned data, a fake is a simple working version, a spy records calls, a mock verifies them.',
      what: [
        "A test double is anything that replaces a real dependency in a test, the way a stunt double replaces an actor. You use one when the real thing is slow, costly, random or not under your control (database, email, payments, the clock).",
        "**Stub**: returns fixed answers, no logic. **Fake**: a real but simplified implementation, like an in-memory repository. **Spy**: wraps or records calls so you can check them later. **Mock**: a double you set expectations on, and the test checks that the expected calls happened.",
      ],
      deeper: [
        "In Jest the words blur: `jest.fn()` is called a mock function but works as a stub (`mockReturnValue`), a spy (it records calls) and a mock (`toHaveBeenCalledWith`). Interviewers mainly want to hear that you know the ideas and when each fits.",
        "State vs behaviour verification. With stubs and fakes you check the result (state): 'the function returned 1'. With mocks you check interactions (behaviour): 'send was called once with this email'. Over-using behaviour checks couples tests to implementation details, so refactors break tests even when behaviour is unchanged.",
        "Good rule: mock what you don't own and what crosses a boundary (email, payment, HTTP to another service); prefer fakes or the real thing for what you do own. Dependency injection (passing the repo and emailer in) makes swapping doubles trivial.",
      ],
      why: "Real dependencies make tests slow, flaky and sometimes dangerous (sending real emails or charging real cards). Doubles keep tests fast and focused, as long as you pick the right kind.",
      analogy: "A flight simulator is a fake (it really flies, just not in the sky). A cardboard cut-out of a passenger is a stub (it only sits there). A black box recorder is a spy. A checklist the examiner ticks off ('did the pilot call the tower?') is a mock.",
      code: {
        lang: 'js',
        title: 'All four in one test file (runs with Jest)',
        source: `async function remindUnpaid(invoiceRepo, emailer, clock) {
  const invoices = await invoiceRepo.findUnpaid();
  const overdue = invoices.filter((i) => i.dueDate < clock.now());
  for (const inv of overdue) await emailer.send(inv.email, \`Invoice \${inv.id} is overdue\`);
  return overdue.length;
}

// STUB: canned answer, no logic
const clockStub = { now: () => new Date('2026-03-10') };

// FAKE: a simple but working implementation
class InMemoryInvoiceRepo {
  constructor(rows) { this.rows = rows; }
  async findUnpaid() { return this.rows.filter((r) => !r.paid); }
}

test('emails only overdue unpaid invoices', async () => {
  const repo = new InMemoryInvoiceRepo([
    { id: 1, paid: false, dueDate: new Date('2026-03-01'), email: 'a@x.com' },
    { id: 2, paid: true,  dueDate: new Date('2026-03-01'), email: 'b@x.com' },
    { id: 3, paid: false, dueDate: new Date('2026-04-01'), email: 'c@x.com' },
  ]);
  // MOCK: records calls so we can verify the interaction
  const emailer = { send: jest.fn().mockResolvedValue(true) };

  const count = await remindUnpaid(repo, emailer, clockStub);

  expect(count).toBe(1);
  expect(emailer.send).toHaveBeenCalledTimes(1);
  expect(emailer.send).toHaveBeenCalledWith('a@x.com', 'Invoice 1 is overdue');
});

test('SPY: the real method still runs, we just watch it', async () => {
  const repo = new InMemoryInvoiceRepo([]);
  const spy = jest.spyOn(repo, 'findUnpaid');
  await remindUnpaid(repo, { send: jest.fn() }, clockStub);
  expect(spy).toHaveBeenCalledTimes(1);
  spy.mockRestore();
});`,
      },
      output: "Both tests pass. Only invoice 1 is unpaid and past due on the stubbed date (10 March 2026), so exactly one email is sent, to a@x.com. Invoice 2 is paid and invoice 3 is not due yet. The spy confirms `findUnpaid` was called once while still running the real code.",
      questions: [
        { q: 'What is the difference between a stub and a mock?', a: 'A stub just returns canned data so the code can run; you check the result. A mock has expectations about how it is called, and the test verifies those calls happened.' },
        { q: 'What is a fake?', a: 'A real working implementation that takes a shortcut, like an in-memory repository instead of MongoDB, or LocalStack instead of real AWS. It behaves realistically without the cost.' },
        { q: 'What is a spy?', a: 'A wrapper that records calls to a function, often while still running the real implementation. In Jest, `jest.spyOn(obj, "method")` creates one.' },
        { q: 'When is mocking harmful?', a: 'When you mock things you own so heavily that tests only check implementation details. Refactors then break tests even though behaviour is the same, and real wiring bugs slip through.' },
      ],
      answer30: "Test doubles replace real dependencies in tests. A stub returns canned answers, a fake is a simplified working version like an in-memory repo, a spy records calls while often keeping the real behaviour, and a mock is set up with expectations that the test verifies. In Jest, jest.fn can play all these roles. I mock boundaries I don't own, like email or payments, and prefer fakes or real implementations for my own code so tests don't lock in implementation details.",
      mistakes: [
        'Mocking the module you are testing, so the test proves nothing.',
        'Asserting on every internal call, making tests break on harmless refactors.',
        'Forgetting to restore spies, so a later test still sees the mocked version.',
        "Trap: 'Is jest.fn a mock or a stub?' Both. It is a configurable test double; what matters is whether you assert on returned results or on calls.",
      ],
      takeaway: 'Stub answers, fake works, spy watches, mock verifies; mock boundaries, not your own logic.',
    },

    {
      id: 'jest-mocking',
      title: 'Mocking in Jest: jest.fn, jest.mock, spyOn, fake timers',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'jest.fn makes a fake function, jest.mock replaces a whole module, jest.spyOn wraps one method, fake timers control time.',
      what: [
        "`jest.fn()` creates a fake function that remembers every call. You can tell it what to return: `mockReturnValue`, `mockResolvedValue` (for promises), or `mockImplementation`.",
        "`jest.mock('./module')` replaces every export of a module with fakes, so code that imports it gets the fake. `jest.spyOn(obj, 'method')` replaces just one method on an object and can be restored.",
        "Fake timers (`jest.useFakeTimers()`) replace `setTimeout`, `setInterval` and `Date`, so you can jump forward in time with `jest.advanceTimersByTime(ms)` instead of really waiting.",
      ],
      deeper: [
        "`jest.mock` calls are hoisted above imports by babel-jest, which is why they work even when written after the `import` line. Because of the hoisting, the mock factory can't use outer variables unless their names start with `mock`. In native ESM mode this hoisting doesn't happen; you use `jest.unstable_mockModule` plus a dynamic `import()`.",
        "Three reset levels: `mockClear` wipes recorded calls, `mockReset` also removes the fake return value, and `mockRestore` puts the original method back (for `spyOn`). Setting `restoreMocks: true` in the Jest config does this automatically between tests.",
        "With fake timers and async code, use the async variants like `await jest.advanceTimersByTimeAsync(ms)` so promise callbacks scheduled between timers also run.",
      ],
      why: "Real emails, payments, HTTP calls and long waits make tests slow and unreliable. Mocking lets you control what dependencies return and check how your code used them.",
      analogy: "A film set. `jest.fn` is a prop phone that rings on cue. `jest.mock` swaps an entire actor for a stand-in. `spyOn` puts a hidden microphone on one actor. Fake timers let the director say 'cut to three days later' without waiting three days.",
      code: {
        lang: 'js',
        title: 'Runs with Jest (spyOn + jest.fn + fake timers)',
        source: `const mailer = { send: async (to, msg) => { throw new Error('real email!'); } };

async function registerUser(repo, user) {
  const saved = await repo.save(user);
  await mailer.send(user.email, 'Welcome!');
  return saved;
}

function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

afterEach(() => jest.restoreAllMocks());

test('jest.fn and spyOn', async () => {
  const repo = { save: jest.fn().mockResolvedValue({ id: 'u1' }) };
  const sendSpy = jest.spyOn(mailer, 'send').mockResolvedValue(undefined);

  const result = await registerUser(repo, { email: 'a@x.com' });

  expect(result).toEqual({ id: 'u1' });
  expect(repo.save).toHaveBeenCalledTimes(1);
  expect(sendSpy).toHaveBeenCalledWith('a@x.com', 'Welcome!');
});

test('fake timers: no real waiting', () => {
  jest.useFakeTimers();
  const fn = jest.fn();
  const search = debounce(fn, 300);

  search('a'); search('ab'); search('abc');
  expect(fn).not.toHaveBeenCalled();

  jest.advanceTimersByTime(300);
  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith('abc');
  jest.useRealTimers();
});

// Replacing a whole module (hoisted above imports by babel-jest):
// jest.mock('./emailService', () => ({ sendEmail: jest.fn().mockResolvedValue(true) }));`,
      },
      output: "Both tests pass in a few milliseconds. The real `mailer.send` would throw 'real email!', but the spy replaced it, so no email is sent. The debounced function is called once with 'abc' after the fake clock jumps 300 ms; nothing really waited.",
      questions: [
        { q: 'jest.fn vs jest.mock vs jest.spyOn?', a: '`jest.fn` creates a standalone fake function. `jest.mock` replaces a whole module for everything that imports it. `jest.spyOn` replaces one method on an existing object and can restore the original.' },
        { q: 'What is the difference between mockClear, mockReset and mockRestore?', a: '`mockClear` resets recorded calls. `mockReset` also removes any fake implementation. `mockRestore` additionally puts back the original function, which only works for spies.' },
        { q: 'Why does jest.mock work even when written below the imports?', a: 'babel-jest hoists `jest.mock` calls to the top of the file, so the module is replaced before it is imported. Native ESM does not get this hoisting, so you use `jest.unstable_mockModule` and dynamic import.' },
        { q: 'How do you test a debounce or a retry with delays?', a: 'Use fake timers: `jest.useFakeTimers()`, trigger the code, then `jest.advanceTimersByTime(ms)` and assert. Use the async variant if promises are involved.' },
      ],
      answer30: "jest.fn creates a fake function that records calls and can return whatever I set, like mockResolvedValue for async. jest.mock replaces a whole module, and babel-jest hoists it above the imports. jest.spyOn swaps one method on an object and can be restored. For time-based code like debounce or retries, I use fake timers and advance the clock instead of waiting. I turn on restoreMocks in config so mocks never leak between tests.",
      mistakes: [
        'Forgetting to restore spies or reset mocks, so one test affects the next.',
        'Using an outer variable inside a `jest.mock` factory; it fails because of hoisting unless the name starts with `mock`.',
        'Forgetting `jest.useRealTimers()` after fake timers, which can hang later tests that really wait.',
        "Trap: 'Your mock returns a value but the code awaits it, what breaks?' Use `mockResolvedValue` for async functions. `mockReturnValue(x)` returns a plain value, so code that calls `.then()` on the result crashes with 'then is not a function'.",
      ],
      takeaway: 'fn for a function, mock for a module, spyOn for one method, fake timers for time; always restore.',
    },

    {
      id: 'testing-async',
      title: 'Testing async code',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Return or await the promise, or the test finishes before the assertion runs.',
      what: [
        "Jest only waits for async work if you tell it to. Make the test `async` and `await` the promise, or `return` the promise. Then Jest waits for it to settle before deciding pass or fail.",
        "For promises you can also use `await expect(promise).resolves.toEqual(...)` and `await expect(promise).rejects.toThrow(...)`.",
      ],
      deeper: [
        "If you forget to await, the test function returns immediately and Jest marks it passed. The assertion runs later. When we tried this in Jest 30, the failure was either blamed on whichever test was running next, or printed as a crash after the summary already said 'passed'. Either way, the test itself lied.",
        "When checking a rejection with try/catch, add `expect.assertions(1)`. If the promise unexpectedly resolves, the catch block never runs, zero assertions happen, and without that line the test would pass.",
        "Old callback-style code uses the `done` argument: call `done()` when finished, or `done(err)` to fail. Don't mix `done` with returning a promise.",
      ],
      why: "Most backend code is async: database calls, HTTP, queues. A test that doesn't wait gives false confidence, which is worse than no test.",
      analogy: "Ordering food and leaving before it arrives. If you don't wait, you can't check whether the order was right, and someone else gets blamed for the wrong dish.",
      code: {
        lang: 'js',
        title: 'Runs with Jest',
        source: `const fetchUser = (id) =>
  new Promise((resolve, reject) =>
    setTimeout(() => (id > 0 ? resolve({ id, name: 'Asha' }) : reject(new Error('Not found'))), 10));

test('async/await', async () => {
  const user = await fetchUser(1);
  expect(user.name).toBe('Asha');
});

test('resolves / rejects matchers (await them!)', async () => {
  await expect(fetchUser(1)).resolves.toMatchObject({ name: 'Asha' });
  await expect(fetchUser(0)).rejects.toThrow('Not found');
});

test('expect.assertions guards against a catch that never runs', async () => {
  expect.assertions(1);
  try {
    await fetchUser(0);
  } catch (e) {
    expect(e.message).toBe('Not found');
  }
});

// BUG: no await or return. Jest reports this test as passed
// even though the name is wrong; the failure shows up later or elsewhere.
// test('broken', () => {
//   fetchUser(1).then((user) => expect(user.name).toBe('Ravi'));
// });`,
      },
      output: "The three tests pass. If you uncomment the broken test, Jest still reports it as passed, because the function returned before the promise settled. The 'Expected Ravi, received Asha' error then appears blamed on another test or after the summary.",
      questions: [
        { q: 'How do you test a function that returns a promise?', a: 'Make the test async and await it, or return the promise from the test. Then use normal matchers, or `await expect(p).resolves` / `.rejects`.' },
        { q: 'Why can an async test pass when it should fail?', a: 'If the promise is not awaited or returned, the test function finishes first and Jest marks it passed. The assertion runs later, outside the test.' },
        { q: 'What does expect.assertions(n) do?', a: 'It fails the test unless exactly n assertions ran. It protects try/catch tests where the catch never runs because the promise resolved.' },
        { q: 'How do you test that an async function rejects?', a: '`await expect(fn()).rejects.toThrow("message")`. The `await` is required, or the check never completes inside the test.' },
      ],
      answer30: "For async code I make the test async and await the promise, or use await expect(promise).resolves or rejects. If you forget the await, Jest finishes the test before the promise settles and marks it as passed, so the test lies. For try/catch rejection tests I add expect.assertions(1) so the test fails if the catch never runs. For timers inside async code, I combine fake timers with the async advance functions.",
      mistakes: [
        'Forgetting `await` before `expect(...).rejects`.',
        'Using `.then` without returning the promise.',
        'Testing rejections with try/catch but no `expect.assertions`.',
        "Trap: 'Can you use done and async together?' No. Jest errors if a test both takes `done` and returns a promise. Pick one.",
      ],
      takeaway: 'Always await or return the promise; add expect.assertions for try/catch tests.',
    },

    {
      id: 'vitest-vs-jest',
      title: 'Vitest vs Jest',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Vitest is a Vite-native runner with a Jest-compatible API; Jest is the long-standing default. Pick by build tool and ESM needs.',
      note: "Versions as of 2026: Jest 30 (released mid-2025) and Vitest 4 (browser mode became stable in 4.0, late 2025). Check release notes before quoting exact numbers or flags.",
      what: [
        "Jest is the classic JavaScript test runner from Meta: test runner, assertions, mocks and coverage in one package. It is everywhere in Node and older React projects.",
        "Vitest is a newer runner built on Vite. Its API copies Jest (`describe`, `it`, `expect`), with `vi` instead of `jest` for mocks: `vi.fn()`, `vi.mock()`, `vi.spyOn()`, `vi.useFakeTimers()`.",
      ],
      deeper: [
        "Why teams move to Vitest: it reuses the Vite config, so TypeScript, JSX, path aliases and ESM work without extra Babel or ts-jest setup. Watch mode is fast because only affected tests rerun. Native ESM is first-class, while ESM in Jest still needs experimental flags.",
        "Why teams stay on Jest: huge ecosystem and docs, mature React Native support, and big existing suites. Jest 30 improved speed and memory and added TypeScript config files.",
        "Migration is usually easy: swap `jest.` for `vi.`, enable `globals: true` or import from 'vitest', and fix the differences in module mocking (for example, `vi.mock` factories and `importActual` being async).",
      ],
      why: "Interviewers ask this to see whether you understand tooling trade-offs, not to hear brand loyalty.",
      analogy: "Two cars with the same steering wheel and pedals. Jest is the reliable sedan everyone knows how to fix. Vitest is the newer model built on the same engine as your Vite frontend, so no adapter kit is needed.",
      code: {
        lang: 'ts',
        title: 'Same test in Vitest',
        source: `// vitest.config.ts
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: { environment: 'jsdom', globals: true, coverage: { provider: 'v8' } },
});

// cart.test.ts
import { describe, it, expect, vi } from 'vitest';
import { checkout } from './cart';
import * as payments from './payments';

describe('checkout', () => {
  it('charges the total', async () => {
    const charge = vi.spyOn(payments, 'charge').mockResolvedValue({ ok: true });
    await checkout([{ price: 50 }, { price: 25 }]);
    expect(charge).toHaveBeenCalledWith(75);
  });
});`,
      },
      output: "`npx vitest` runs this in watch mode and reruns only tests affected by a saved file. The same test in Jest would differ only in the import line and `jest.spyOn` instead of `vi.spyOn`.",
      questions: [
        { q: 'Why would you choose Vitest over Jest?', a: 'In a Vite project it reuses the same config, handles TypeScript and ESM natively without Babel or ts-jest, and has a fast watch mode. The API is Jest-compatible, so the learning cost is small.' },
        { q: 'Why might you stay on Jest?', a: 'A large existing suite, React Native, or tooling that depends on Jest. Jest 30 is still actively maintained and faster than before; migrating has a cost.' },
        { q: 'What changes when migrating from Jest to Vitest?', a: 'Mostly `jest.*` becomes `vi.*`, you import test functions or enable globals, and module mocking details differ slightly, for example async `importActual`.' },
      ],
      answer30: "Both have almost the same API. Jest is the long-standing default with a huge ecosystem. Vitest is built on Vite, so in a Vite or modern TypeScript project it uses the same config, supports ESM and TypeScript natively, and has a very fast watch mode. Mocks use vi instead of jest. For a new Vite app I'd pick Vitest; for a big existing Jest suite I'd only migrate if setup pain or speed were real problems.",
      mistakes: [
        "Claiming Vitest only works in Vite apps. It runs fine for plain Node code too.",
        "Assuming `vi.mock` behaves identically to `jest.mock` in every edge case.",
        "Trap: 'Is Jest dead?' No. Jest 30 shipped in 2025 and Jest is still widely used; choose by project needs.",
      ],
      takeaway: 'Same API shape; Vitest wins on Vite/ESM/TS setup and speed, Jest on ecosystem and existing suites.',
    },

    {
      id: 'react-testing-library',
      title: 'React Testing Library: philosophy and queries',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Test what the user sees and does, not component internals. Prefer getByRole, then getByLabelText, then getByText.',
      what: [
        "React Testing Library (RTL) renders a component into a fake DOM (jsdom) and lets you find elements the way a user would: by their role, label or visible text. Its motto: 'The more your tests resemble the way your software is used, the more confidence they can give you.'",
        "It deliberately gives no easy access to state, props or component instances. If you rename a state variable or swap `useState` for `useReducer`, good RTL tests keep passing.",
      ],
      deeper: [
        "Query priority (from the RTL docs): `getByRole` (with `{ name }`) first, because it also checks accessibility. Then `getByLabelText` for form fields, `getByPlaceholderText`, `getByText`, `getByDisplayValue`. `getByTestId` is the last resort.",
        "Three query types. `getBy...` returns the element or throws if missing. `queryBy...` returns `null` if missing, so use it to assert something is NOT there. `findBy...` returns a promise and retries until the element appears (default timeout 1000 ms), so use it for async UI. Each has an `All` version for multiple matches.",
        "Use `screen` instead of destructuring from `render`, and use `@testing-library/jest-dom` matchers like `toBeInTheDocument`, `toBeDisabled` and `toHaveValue` for readable assertions.",
      ],
      why: "Tests that check internals (Enzyme-style `wrapper.state()`) break on every refactor and still miss real bugs, like a button that isn't clickable. Testing through the user's eyes catches what matters and survives refactors.",
      analogy: "A mystery shopper. They don't open the till or read the shop's code; they walk in, look for the 'Checkout' sign, and see whether buying works.",
      code: {
        lang: 'jsx',
        title: 'LoginForm.test.jsx',
        source: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

test('shows an error for a wrong password', async () => {
  const user = userEvent.setup();
  const onLogin = vi.fn().mockRejectedValue(new Error('Invalid credentials')); // or jest.fn()
  render(<LoginForm onLogin={onLogin} />);

  await user.type(screen.getByLabelText(/email/i), 'asha@example.com');
  await user.type(screen.getByLabelText(/password/i), 'wrong');
  await user.click(screen.getByRole('button', { name: /sign in/i }));

  // findBy waits for the async error to appear
  expect(await screen.findByRole('alert')).toHaveTextContent('Invalid credentials');
  // queryBy returns null instead of throwing: use it for "not there"
  expect(screen.queryByText(/welcome/i)).not.toBeInTheDocument();
});`,
      },
      output: "The test types into the email and password fields found by their labels, clicks the button found by its accessible name, then waits until an element with role 'alert' shows 'Invalid credentials'. If the form had no proper labels, `getByLabelText` would fail, which also flags an accessibility bug.",
      questions: [
        { q: 'What is the philosophy of React Testing Library?', a: 'Test components the way users use them: find elements by role, label and text, interact through events, and assert on what is visible. Avoid testing state, props or implementation details.' },
        { q: 'getBy vs queryBy vs findBy?', a: '`getBy` throws if the element is missing. `queryBy` returns null, so use it to assert absence. `findBy` returns a promise that retries until the element appears, for async UI.' },
        { q: 'Which query should you prefer and why?', a: '`getByRole` with a name, because it matches how users and screen readers find elements and checks accessibility at the same time. `getByTestId` is a last resort.' },
        { q: 'Why not test component state directly?', a: 'Users never see state. Tests tied to state break on refactors that keep behaviour the same, and can pass while the visible UI is broken.' },
      ],
      answer30: "React Testing Library tests components the way a user sees them. I render the component, find elements with screen.getByRole or getByLabelText, interact with user-event, and assert on visible output with jest-dom matchers. getBy throws if missing, queryBy returns null for checking absence, and findBy waits for async content. I avoid test ids and never check internal state, so tests survive refactors and also catch accessibility problems.",
      mistakes: [
        'Using `getBy` to assert something is absent; it throws. Use `queryBy` with `not.toBeInTheDocument()`.',
        'Wrapping everything in `act()` manually; RTL and user-event already do this.',
        'Reaching for `getByTestId` first instead of role or label queries.',
        "Using `waitFor` with a `getBy` inside when `findBy` does the same in one line.",
        "Trap: 'Why does my test warn about act?' Usually a state update happened after the test finished, like an unawaited fetch. Await the UI change with `findBy` instead of silencing the warning.",
      ],
      takeaway: 'Query like a user (role, label, text), interact like a user, assert on what is visible.',
    },

    {
      id: 'testing-hooks-user-events',
      title: 'Testing custom hooks and user events',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Test hooks with renderHook (or through a component), and simulate input with user-event rather than fireEvent.',
      what: [
        "A custom hook can't be called outside a component. `renderHook` from `@testing-library/react` renders a tiny test component that calls your hook and gives you `result.current`, the latest return value.",
        "To simulate user input, use `@testing-library/user-event`. It fires the full chain of events a real user causes (focus, keydown, input, keyup, click), unlike `fireEvent`, which fires one event.",
      ],
      deeper: [
        "`renderHook` moved into `@testing-library/react` itself (since v13.1); the separate `@testing-library/react-hooks` package is deprecated for React 18 and later. Wrap state changes in `act()`, and use `waitFor` for async hooks. Pass a `wrapper` option to provide context such as a Redux store or React Query client.",
        "user-event v14 API: call `const user = userEvent.setup()` at the start of the test, then `await user.click(el)`, `await user.type(el, 'text')`, `await user.keyboard('{Enter}')`. Every call returns a promise, so always await it.",
        "Often the best test of a hook is through a small component that uses it, because that's how it's really used. Use `renderHook` for reusable hooks with logic of their own, like `useDebounce` or `usePagination`.",
      ],
      why: "Hooks hold most of the logic in modern React apps. Testing them directly gives fast, focused feedback, and realistic events catch bugs that a single synthetic event would miss.",
      analogy: "fireEvent is a robot that teleports a finger onto a button. user-event is a person who moves the mouse, hovers, presses, and releases, so things like hover menus and focus behave as in real life.",
      code: {
        lang: 'jsx',
        title: 'useCounter.test.jsx',
        source: `import { renderHook, act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  return { count, inc: () => setCount((c) => c + 1) };
}

test('renderHook: test the hook directly', () => {
  const { result } = renderHook(() => useCounter(5));
  act(() => result.current.inc());
  expect(result.current.count).toBe(6);
});

function Counter() {
  const { count, inc } = useCounter();
  return <button onClick={inc}>Clicked {count} times</button>;
}

test('user-event: test the hook through a component', async () => {
  const user = userEvent.setup();
  render(<Counter />);
  await user.click(screen.getByRole('button'));
  await user.click(screen.getByRole('button'));
  expect(screen.getByRole('button')).toHaveTextContent('Clicked 2 times');
});`,
      },
      output: "Both tests pass. The hook starts at 5 and `inc` raises it to 6, read through `result.current`. In the component test two realistic clicks update the text to 'Clicked 2 times'.",
      questions: [
        { q: 'How do you test a custom hook?', a: 'Use `renderHook` from `@testing-library/react`, read the value from `result.current`, and wrap updates in `act()`. Or test it through a small component that uses it.' },
        { q: 'Why prefer user-event over fireEvent?', a: 'user-event simulates the full sequence a real user triggers, like focus, keydown, input and click, so it catches bugs that a single synthetic event misses.' },
        { q: 'How do you test a hook that needs context or a provider?', a: 'Pass a `wrapper` component to `renderHook` (or `render`) that wraps children in the provider, such as a Redux store or a QueryClientProvider.' },
        { q: 'Why must you await user-event calls?', a: 'In v14 every interaction returns a promise. Without await, assertions can run before the events and resulting state updates have finished.' },
      ],
      answer30: "For custom hooks I use renderHook from React Testing Library, read result.current, and wrap updates in act. If the hook needs context, I pass a wrapper with the provider. Often I just test the hook through a small component that uses it. For interactions I use user-event with userEvent.setup and await every call, because it simulates real typing and clicking, not just one synthetic event like fireEvent.",
      mistakes: [
        'Calling a hook directly in a test outside a component: React throws an invalid hook call error.',
        'Destructuring `const { count } = result.current` once and expecting it to update; read `result.current` after each change.',
        'Not awaiting `user.click` or `user.type`.',
        "Trap: 'Is @testing-library/react-hooks still needed?' No. For React 18+ `renderHook` lives in `@testing-library/react`.",
      ],
      takeaway: 'renderHook for reusable hooks, user-event (awaited) for realistic interaction.',
    },

    {
      id: 'supertest-api-testing',
      title: 'API testing with Supertest',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Supertest sends HTTP requests to your Express app in memory, so you test routes, middleware and status codes without starting a server.',
      note: "On your resume: you wrote Supertest endpoint tests and Jest unit tests with mocked repositories on Octagnt. See the 'LocalStack, Docker Compose, and testing with Jest and Supertest' topic in My Resume and Projects.",
      what: [
        "Supertest takes your Express `app` object and sends real HTTP requests to it, without you calling `app.listen()`. You then check the status code, headers and body.",
        "It tests the full HTTP path: routing, middleware (auth, validation, error handler), controller and response format.",
      ],
      deeper: [
        "Split `app.js` (builds and exports the app) from `server.js` (calls `listen`). Tests import `app` only. If the app is built by a function that receives its dependencies (`createApp({ candidateRepo })`), tests can pass fakes or real repos as needed.",
        "Decide what is real. With a mocked repository you test the HTTP layer fast. With a real test database (a Docker MongoDB or `mongodb-memory-server`) you also test queries and indexes. Clean the collections in `beforeEach` so tests are independent, and close connections in `afterAll` so Jest exits.",
        "Test the security behaviour, not just happy paths: 401 without a token, 403 for the wrong role, 404 for another tenant's record, 400 for invalid input. These are the checks that matter most in multi-tenant APIs.",
      ],
      why: "Most backend bugs live in the wiring: wrong middleware order, a missing auth check, a bad status code. Unit tests of controllers miss these; Supertest catches them in milliseconds.",
      analogy: "A test kitchen. Instead of opening the restaurant to the public (starting a server), you send orders straight to the kitchen and inspect each plate that comes out.",
      code: {
        lang: 'js',
        title: 'candidates.test.js',
        source: `const request = require('supertest');
const { createApp } = require('../src/app');
const { signTestToken } = require('./helpers');

const fakeRepo = { findById: jest.fn() };
const app = createApp({ candidateRepo: fakeRepo });

describe('GET /candidates/:id', () => {
  const token = signTestToken({ sub: 'u1', tenantId: 't1', role: 'recruiter' });

  it('401 without a token', async () => {
    await request(app).get('/candidates/c1').expect(401);
  });

  it('404 when the candidate is not in this tenant', async () => {
    fakeRepo.findById.mockResolvedValue(null);
    const res = await request(app)
      .get('/candidates/c1')
      .set('Cookie', \`access_token=\${token}\`);
    expect(res.status).toBe(404);
    expect(fakeRepo.findById).toHaveBeenCalledWith('t1', 'c1'); // tenant from token
  });

  it('200 with the candidate', async () => {
    fakeRepo.findById.mockResolvedValue({ id: 'c1', name: 'Asha' });
    const res = await request(app).get('/candidates/c1').set('Cookie', \`access_token=\${token}\`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 'c1', name: 'Asha' });
  });
});`,
      },
      output: "Three requests run in memory against the Express app. Without a cookie the auth middleware returns 401. With a token the route asks the repo for tenant t1's candidate (the tenant comes from the token); null gives 404 and a found record gives 200 with the JSON body.",
      questions: [
        { q: 'What does Supertest do?', a: 'It sends HTTP requests to an Express (or any Node HTTP) app in memory without calling listen, so you can assert on status codes, headers and bodies across routing and middleware.' },
        { q: 'How do you structure an app so it is easy to test with Supertest?', a: 'Export the app from `app.js` without calling `listen`, and start the server in a separate file. Better still, build the app with a factory that receives its dependencies so tests can inject fakes.' },
        { q: 'Should Supertest tests use a real database?', a: 'For true integration tests, yes: a disposable test DB catches query and index bugs that mocks hide. Use mocked repositories when you only want to test the HTTP layer quickly.' },
        { q: 'What API cases do you always test?', a: 'Happy path, invalid input (400), missing auth (401), wrong role (403), not found or other tenant\'s data (404), and the error format from the error handler.' },
      ],
      answer30: "Supertest lets me send HTTP requests to my Express app in memory, without starting a server, and assert on status, headers and body. I export the app separately from the listen call and build it with injected dependencies, so tests can use a mocked repository for fast HTTP-layer tests or a real test database for integration. I always test the unhappy paths too: 400, 401, 403, and 404 for another tenant's data.",
      mistakes: [
        'Calling `app.listen` in the module that tests import, causing port clashes and open handles.',
        'Not closing DB connections in `afterAll`, so Jest prints "did not exit one second after the test run".',
        'Only testing happy paths, missing the auth and validation behaviour.',
        "Trap: 'How do you test authenticated routes?' Sign a real test token with the test secret, or inject a fake auth middleware. Don't skip auth entirely, or you never test it.",
      ],
      takeaway: 'Import the app, not the server; test the unhappy paths; decide clearly whether the DB is real.',
    },

    {
      id: 'e2e-playwright-cypress',
      title: 'End-to-end testing with Playwright and Cypress',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'E2E tools drive a real browser through your running app. Playwright is multi-browser and parallel; Cypress runs inside the browser with a great debugger.',
      what: [
        "An e2e tool opens a real browser, visits your app, clicks and types like a user, and checks what appears. It tests frontend, backend, database and config together.",
        "Playwright (Microsoft) drives Chromium, Firefox and WebKit, runs tests in parallel, and has auto-waiting locators. Cypress runs your test inside the browser next to the app, with time-travel debugging that is very friendly for frontend developers.",
      ],
      deeper: [
        "Both auto-wait: Playwright locators and web-first assertions like `await expect(locator).toBeVisible()` retry until the condition is true or the timeout hits. Never use fixed sleeps like `waitForTimeout(3000)`.",
        "Keep e2e tests independent and fast: create data through the API or a seed script instead of clicking through setup screens, and log in once and reuse the saved session (Playwright `storageState`).",
        "Differences interviewers like: Playwright supports multiple tabs, origins and browsers natively and is free to parallelize; Cypress historically had limits with multiple tabs and cross-origin flows (improved with `cy.origin`) and parallel runs are easiest with its paid cloud. Both can record traces, videos and screenshots on failure.",
      ],
      why: "Only e2e tests prove a user can actually complete a journey through the deployed stack. A few of them on critical paths (sign up, log in, pay) catch config and integration bugs nothing else catches.",
      analogy: "A dress rehearsal with the full cast, lights and costumes. Expensive, so you only do a few, but it's the only way to know the whole show works.",
      code: {
        lang: 'ts',
        title: 'login.spec.ts (Playwright)',
        source: `import { test, expect } from '@playwright/test';

test('recruiter can log in and see the dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('recruiter@test.com');
  await page.getByLabel('Password').fill(process.env.E2E_PASSWORD!);
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Web-first assertion: retries until visible or timeout, no sleeps
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page).toHaveURL(/\\/dashboard/);
});

// Cypress equivalent:
// cy.visit('/login');
// cy.get('input[name=email]').type('recruiter@test.com');
// cy.contains('button', 'Sign in').click();
// cy.contains('h1', 'Dashboard').should('be.visible');`,
      },
      output: "`npx playwright test` launches a headless browser, logs in, and waits for the Dashboard heading. If it doesn't appear within the timeout, the test fails and Playwright saves a trace you can open to see each step, screenshot and network call.",
      questions: [
        { q: 'Playwright vs Cypress?', a: 'Playwright drives Chromium, Firefox and WebKit from outside the browser, handles multiple tabs and origins, and parallelizes for free. Cypress runs inside the browser with excellent interactive debugging but has had limits around tabs and cross-origin flows.' },
        { q: 'How do you avoid flaky e2e tests?', a: 'Use auto-waiting locators and web-first assertions instead of sleeps, seed data through the API, isolate each test\'s data, and use role or label locators instead of brittle CSS selectors.' },
        { q: 'How many e2e tests should you have?', a: 'Few: only the critical user journeys like sign-up, login and checkout. Edge cases belong in faster unit and integration tests.' },
        { q: 'How do you avoid logging in through the UI in every test?', a: 'Log in once in a setup step and reuse the saved session, for example Playwright `storageState`, or log in through the API.' },
      ],
      answer30: "E2E tools drive a real browser through the running app. Playwright supports Chromium, Firefox and WebKit, runs in parallel, and auto-waits with locators and web-first assertions. Cypress runs inside the browser and has a great interactive debugger. Either way I keep e2e tests to critical journeys, seed data through the API, reuse login state, never use fixed sleeps, and keep traces and screenshots on failure for debugging.",
      mistakes: [
        'Using fixed waits like `waitForTimeout(3000)`.',
        'Chaining tests so one depends on data from the previous one.',
        'Selecting elements by CSS classes that change with styling.',
        "Trap: 'Should e2e tests run against production?' A small read-only smoke test is fine; full suites run against a staging or ephemeral environment with test data.",
      ],
      takeaway: 'Few e2e tests, on critical paths, with auto-waiting and isolated data.',
    },

    {
      id: 'tdd',
      title: 'Test-driven development (TDD)',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Red, green, refactor: write a failing test, write just enough code to pass, then clean up.',
      what: [
        "TDD means writing the test before the code. The loop has three steps. **Red**: write a small test for the next behaviour and watch it fail. **Green**: write the simplest code that makes it pass. **Refactor**: clean up the code while the tests stay green.",
        "You repeat this loop in small steps, a few minutes each.",
      ],
      deeper: [
        "Seeing the test fail first proves the test can fail. A test written after the code may pass for the wrong reason and never catch anything.",
        "TDD shines for pure logic with clear rules: parsers, pricing, validation, scoring, bug fixes (write a test that reproduces the bug first). It is less useful for exploratory UI work or spikes where you don't yet know what you're building.",
        "An honest interview answer: few teams do strict TDD all the time. Saying 'I use TDD for business rules and bug fixes, and write tests alongside code elsewhere' sounds more credible than claiming 100% TDD.",
      ],
      why: "Writing the test first forces you to design the API from the caller's side, keeps the code testable, and leaves a safety net that makes refactoring safe.",
      analogy: "Writing the exam questions before teaching the lesson. You know exactly what 'done' means, and you can't fool yourself afterwards.",
      code: {
        lang: 'js',
        title: 'slugify.test.js, after a few red-green-refactor loops (runs with Jest)',
        source: `// Loop 1: 'lower-cases and joins words' failed (red), then passed (green).
// Loop 2: 'removes punctuation' failed until the first replace was added.
// Loop 3: 'trims and collapses spaces' drove the trim and the + in the regex.
// Then refactor: same behaviour, cleaner chain, tests stayed green.
function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\\s-]/g, '')   // drop punctuation
    .replace(/[\\s-]+/g, '-');       // spaces and repeated dashes -> one dash
}

describe('slugify', () => {
  it('lower-cases and joins words with dashes', () => {
    expect(slugify('Senior Node Engineer')).toBe('senior-node-engineer');
  });
  it('removes punctuation', () => {
    expect(slugify('React & Redux: 101!')).toBe('react-redux-101');
  });
  it('trims and collapses spaces', () => {
    expect(slugify('  Full   Stack  ')).toBe('full-stack');
  });
});`,
      },
      output: "All three tests pass. 'React & Redux: 101!' loses the '&', ':' and '!', and the leftover double space collapses into one dash, giving 'react-redux-101'.",
      questions: [
        { q: 'What is the red-green-refactor cycle?', a: 'Write a failing test (red), write the minimum code to pass it (green), then improve the code without changing behaviour while tests stay green (refactor).' },
        { q: 'Why see the test fail first?', a: 'It proves the test actually checks something. A test that has never failed might pass for the wrong reason, for example a missing await.' },
        { q: 'When is TDD not a good fit?', a: 'Exploratory work and spikes where requirements are unclear, or highly visual UI. It fits best for clear business rules and reproducing bugs.' },
        { q: 'Do you practise TDD?', a: 'Answer honestly. A good answer: I use it for business logic and bug fixes, where I write a failing test that reproduces the bug before fixing it, and write tests alongside code for the rest.' },
      ],
      answer30: "TDD is red, green, refactor: write a small failing test, write the simplest code that passes, then clean up with the tests as a safety net. Seeing the test fail first proves it can catch a bug, and writing it first makes me design the function from the caller's side. I use it most for business rules and for bug fixes, where the first step is a test that reproduces the bug.",
      mistakes: [
        'Writing many tests at once before any code; TDD works in tiny steps.',
        'Skipping the refactor step, so code stays messy.',
        "Claiming you do strict TDD for everything when you don't; interviewers will probe.",
        "Trap: 'Does TDD guarantee good design?' No. It pushes towards testable code, but you can still test-drive a bad design.",
      ],
      takeaway: 'Red, green, refactor in small steps; always see the test fail first.',
    },

    {
      id: 'code-coverage',
      title: 'Code coverage and its limits',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Coverage measures which code ran during tests, not whether it was checked. Branch coverage matters more than line coverage.',
      note: "On your resume: on Skillkeepr you added Jest coverage across backend modules, which cut regression bugs by about 30%. Be ready to say which modules and how you chose them.",
      what: [
        "Code coverage is the percentage of your code that ran while the tests ran. Jest reports four numbers: statements, branches, functions and lines (`jest --coverage`).",
        "High coverage means code was executed, not that it was tested well. A test with no assertions can still give 100%.",
      ],
      deeper: [
        "Branch coverage is the most useful number: it checks that both sides of every `if`, `? :`, `&&` and `||` ran. You can hit 100% line coverage with only 50% branch coverage, as the example shows.",
        "Use thresholds (`coverageThreshold` in the Jest config) as a floor in CI so coverage doesn't silently fall, not as a target to game. Many teams require coverage on changed lines in a PR rather than a global number.",
        "Mutation testing (for example Stryker) answers the real question: it changes your code (flips `>` to `>=`, removes a line) and checks whether any test fails. Surviving mutants show code that runs but isn't really checked.",
      ],
      why: "Coverage reports show untested areas, which is useful. But chasing a number leads to useless tests, so you need to know what it does and doesn't tell you.",
      analogy: "A security guard's patrol log. It proves the guard walked past every door. It doesn't prove they checked whether the doors were locked.",
      code: [
        {
          lang: 'js',
          title: 'canEdit.js and canEdit.test.js',
          source: `// canEdit.js
function canEdit(user, doc) {
  return user.isAdmin || doc.ownerId === user.id;
}
module.exports = canEdit;

// canEdit.test.js
const canEdit = require('./canEdit');
test('admin can edit', () => {
  expect(canEdit({ id: 'u1', isAdmin: true }, { ownerId: 'u2' })).toBe(true);
});`,
        },
        {
          lang: 'text',
          title: 'npx jest --coverage',
          source: `------------|---------|----------|---------|---------|-------------------
File        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------|---------|----------|---------|---------|-------------------
All files   |     100 |       50 |     100 |     100 |
 canEdit.js |     100 |       50 |     100 |     100 | 2
------------|---------|----------|---------|---------|-------------------`,
        },
        {
          lang: 'json',
          title: 'package.json: fail CI if coverage drops',
          source: `{
  "jest": {
    "coverageThreshold": {
      "global": { "branches": 80, "functions": 80, "lines": 80, "statements": 80 }
    }
  }
}`,
        },
      ],
      output: "Line coverage is 100% but branch coverage is 50%. Because the admin check is true, `||` short-circuits and the owner check never runs. A bug like `doc.ownerId !== user.id` would let non-owners edit, and this suite would still pass.",
      questions: [
        { q: 'What does code coverage measure?', a: 'Which statements, branches, functions and lines ran during the tests. It does not measure whether the results were checked correctly.' },
        { q: 'Is 100% coverage a good goal?', a: 'Usually not. The last few percent costs a lot and encourages tests with weak assertions. A sensible floor (often 70-80%) plus good tests on critical logic is better.' },
        { q: 'Why is branch coverage more useful than line coverage?', a: 'One line can contain several paths, like `a || b`. Branch coverage shows when only one side of a condition was tested, which line coverage hides.' },
        { q: 'What is mutation testing?', a: 'A tool changes your code in small ways, like flipping a comparison, and reruns the tests. If no test fails, the mutant survived, which shows code that is run but not really checked.' },
      ],
      answer30: "Coverage tells you which code ran during tests: statements, branches, functions and lines. It doesn't tell you whether anything was asserted, so 100% can still miss bugs. I care most about branch coverage, because a line like a || b can be fully covered while one side is never tested. I use a threshold in CI as a floor so coverage doesn't drop, focus real effort on critical logic, and mutation testing is the stronger check if you want to know tests actually catch bugs.",
      mistakes: [
        'Treating coverage as a quality score instead of a map of untested code.',
        'Writing assertion-free tests just to raise the number.',
        'Setting 100% thresholds, which leads to testing trivial getters and config.',
        "Trap: 'Coverage is 95%, so the code is well tested?' Not necessarily. Ask about branch coverage, assertion quality and whether critical paths are covered.",
      ],
      takeaway: 'Coverage shows what ran, not what was checked; watch branches and use thresholds as a floor.',
    },

    {
      id: 'flaky-tests',
      title: 'Flaky tests: causes and fixes',
      level: 'advanced',
      priority: 'good',
      frequency: 'common',
      summary: 'A flaky test passes and fails without code changes. Usual causes: time, order, shared state, async races, and real network calls.',
      what: [
        "A flaky test sometimes passes and sometimes fails on the same code. It's dangerous because people start ignoring red builds and re-running until green, and then real failures slip through.",
        "Common causes: depending on the current date or time, test order and shared data, not waiting for async work, fixed sleeps, random data, real network or third-party calls, and resource limits in CI.",
      ],
      deeper: [
        "Fixes by cause. **Time**: freeze it with fake timers and `jest.setSystemTime`. **Order/shared state**: reset data in `beforeEach`, give each test unique ids, run with `--randomize` to expose order dependence. **Async**: await everything, use `findBy` or web-first assertions, never `sleep`. **Network**: mock third parties or use a local fake. **Randomness**: seed it or fix the values.",
        "Process: when a test flakes, quarantine it (skip with a ticket and owner) so the main branch stays trustworthy, reproduce it by running it many times (`jest -t 'name' --runInBand` in a loop, or Playwright `--repeat-each`), fix the root cause, then bring it back. Automatic retries hide flakiness; if you use them in e2e, track and report retried tests.",
        "Timezone is a classic: a test that formats dates passes on a laptop in IST and fails in CI on UTC. Set `TZ=UTC` for the test run.",
      ],
      why: "A test suite is only useful if a red build means something is broken. Flaky tests destroy that trust and waste hours of re-runs.",
      analogy: "A smoke alarm that goes off randomly. After a week everyone ignores it, including the day there's a real fire.",
      code: {
        lang: 'js',
        title: 'Freezing time removes a date-based flake (runs with Jest)',
        source: `function isTrialExpired(user) {
  const days = (Date.now() - user.trialStartedAt.getTime()) / 86_400_000;
  return days > 14;
}

// FLAKY version: depends on when the test runs
// it('is expired', () => {
//   expect(isTrialExpired({ trialStartedAt: new Date('2026-05-05') })).toBe(true);
// }); // fails if run before 20 May 2026

describe('isTrialExpired', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-20T10:00:00Z')); // freeze "now"
  });
  afterEach(() => jest.useRealTimers());

  it('is false on day 14', () => {
    expect(isTrialExpired({ trialStartedAt: new Date('2026-05-06T10:00:00Z') })).toBe(false);
  });
  it('is true on day 15', () => {
    expect(isTrialExpired({ trialStartedAt: new Date('2026-05-05T10:00:00Z') })).toBe(true);
  });
});`,
      },
      output: "Both tests pass on any day and in any timezone, because 'now' is frozen at 20 May 2026 10:00 UTC. Exactly 14 days is not expired; 15 days is.",
      questions: [
        { q: 'What is a flaky test?', a: 'A test that passes and fails on the same code without any change. It destroys trust in the test suite because people start re-running until green.' },
        { q: 'What are the most common causes of flakiness?', a: 'Dependence on real time or timezone, shared state and test order, unawaited async work or fixed sleeps, random data, and real network calls.' },
        { q: 'How do you handle a flaky test in a team?', a: 'Quarantine it with a ticket and owner so the main build stays trustworthy, reproduce it by running it many times, fix the root cause, then re-enable it. Don\'t just add retries.' },
        { q: 'How do you make date-based tests deterministic?', a: 'Freeze the clock with fake timers and `jest.setSystemTime`, or inject a clock, and run tests with a fixed timezone like `TZ=UTC`.' },
      ],
      answer30: "A flaky test passes or fails on the same code. The usual causes are real time and timezones, shared state between tests, unawaited async work or sleeps, randomness, and real network calls. I fix the cause: freeze time with fake timers, reset data per test, await properly or use auto-waiting assertions, and mock third parties. As a process, I quarantine a flaky test with an owner, reproduce it by running it in a loop, and fix it rather than hiding it with retries.",
      mistakes: [
        'Adding retries and calling it fixed.',
        'Using `setTimeout`-based sleeps to wait for async results.',
        'Tests that rely on data created by another test.',
        "Trap: 'It only fails in CI.' Look at what differs: timezone, CPU speed (timeouts), parallelism (shared DB), environment variables, and network access.",
      ],
      takeaway: 'Control time, isolate state, await properly, mock the network; quarantine and fix, never just retry.',
    },

    {
      id: 'contract-testing-localstack',
      title: 'Contract testing and testing with LocalStack',
      level: 'advanced',
      priority: 'good',
      frequency: 'occasional',
      summary: 'Contract tests check that two services agree on an API without running both together; LocalStack fakes AWS locally for realistic integration tests.',
      note: "On your resume: you set up LocalStack with Docker Compose for S3 and SQS on Octagnt. See 'LocalStack, Docker Compose, and testing with Jest and Supertest' in My Resume and Projects. Contract testing (Pact) is not on your resume, so present it as something you understand, not something you shipped. Pact's JS API has changed across major versions (V3 and V4 interfaces), so check the current docs before writing it from memory.",
      what: [
        "**Contract testing** checks that a consumer (say, the frontend or another service) and a provider (an API) agree on the request and response shape. The consumer's test records what it expects as a 'contract'. The provider's CI then replays that contract against the real provider and fails if it would break the consumer.",
        "**LocalStack** runs fake versions of AWS services (S3, SQS, DynamoDB and more) in Docker on your machine or in CI. Your code uses the real AWS SDK, just pointed at `http://localhost:4566`.",
      ],
      deeper: [
        "Why contracts instead of only e2e: in microservices, spinning up every service for e2e tests is slow and flaky. Contracts give fast, independent checks per service and catch breaking changes (renamed field, removed endpoint) before deploy. Pact is the best-known tool; OpenAPI schema validation is a lighter alternative.",
        "LocalStack integration tests catch what mocks of the AWS SDK miss: wrong bucket names, IAM-free logic errors, message shape, and queue behaviour like visibility timeouts. Limits: it is not a perfect copy of AWS. IAM policy enforcement, some service features and exact error behaviour can differ, and some advanced features need a paid tier. Keep a small smoke test against real AWS in staging.",
        "A good mix for an AWS-backed Node service: unit tests with the AWS client mocked (or `aws-sdk-client-mock`), integration tests against LocalStack in CI via Docker Compose or Testcontainers, and a staging smoke test.",
      ],
      why: "Distributed systems break at the seams: between services and between your code and the cloud. Contract tests guard service-to-service seams; LocalStack guards the code-to-AWS seam, without cost or shared environments.",
      analogy: "Contract testing is two companies agreeing on a written spec for a plug and socket, and each testing against the spec at their own factory. LocalStack is a flight simulator for AWS: same controls, no real plane.",
      code: [
        {
          lang: 'ts',
          title: 'Integration test against LocalStack S3',
          source: `import { S3Client, PutObjectCommand, GetObjectCommand, CreateBucketCommand } from '@aws-sdk/client-s3';
import { saveResume } from '../src/resumes';

const s3 = new S3Client({
  region: 'us-east-1',
  endpoint: process.env.AWS_ENDPOINT_URL ?? 'http://localhost:4566', // LocalStack
  forcePathStyle: true,                       // needed for LocalStack S3 URLs
  credentials: { accessKeyId: 'test', secretAccessKey: 'test' },
});

beforeAll(async () => {
  await s3.send(new CreateBucketCommand({ Bucket: 'resumes-test' }));
});

test('saveResume stores the file under the tenant prefix', async () => {
  const key = await saveResume(s3, 'resumes-test', { tenantId: 't1', fileName: 'cv.pdf', body: 'PDF' });
  expect(key).toBe('t1/resumes/cv.pdf');
  const obj = await s3.send(new GetObjectCommand({ Bucket: 'resumes-test', Key: key }));
  expect(await obj.Body!.transformToString()).toBe('PDF');
});`,
        },
        {
          lang: 'js',
          title: 'Consumer contract test (Pact, V3-style API)',
          source: `const { PactV3, MatchersV3: { like } } = require('@pact-foundation/pact');
const provider = new PactV3({ consumer: 'recruiter-web', provider: 'candidate-api' });

test('gets a candidate', () => {
  provider
    .given('candidate c1 exists')
    .uponReceiving('a request for candidate c1')
    .withRequest({ method: 'GET', path: '/candidates/c1' })
    .willRespondWith({ status: 200, body: like({ id: 'c1', name: 'Asha' }) });

  return provider.executeTest(async (mockServer) => {
    const res = await fetch(\`\${mockServer.url}/candidates/c1\`);
    expect((await res.json()).name).toBe('Asha');
  });
});
// The generated pact file is then verified against the real candidate-api in its CI.`,
        },
      ],
      output: "With LocalStack running, the first test creates a real (local) bucket, uploads through the real AWS SDK, and reads the file back; no AWS account is touched. The Pact test runs against a mock provider and writes a contract file; if the provider later renames `name`, its verification step fails before deploy.",
      questions: [
        { q: 'What is contract testing?', a: 'The consumer records the requests it makes and the responses it expects as a contract. The provider verifies that contract against its real implementation in CI, so breaking API changes are caught without running both services together.' },
        { q: 'Why use LocalStack instead of mocking the AWS SDK?', a: 'Mocks only check that you called the SDK the way you think. LocalStack runs real S3 and SQS behaviour locally, catching wrong keys, message shapes and queue behaviour, without AWS cost or shared environments.' },
        { q: 'What are the limits of LocalStack?', a: 'It is an emulator, not AWS. IAM enforcement, some features and exact error responses can differ, and some services need a paid tier. Keep a smoke test against real AWS in staging.' },
        { q: 'Contract tests vs e2e tests?', a: 'Contract tests check one service boundary quickly and independently. E2E tests check the whole system together but are slow and flaky. Contracts reduce how many e2e tests you need.' },
      ],
      answer30: "Contract testing checks that a consumer and provider agree on an API. The consumer's tests generate a contract, for example with Pact, and the provider verifies it in CI, so a renamed field fails before deploy, without spinning up every service. For AWS, I use LocalStack in Docker so integration tests use the real SDK against local S3 and SQS. It's not a perfect copy of AWS, so I keep a small staging smoke test too.",
      mistakes: [
        "Forgetting `forcePathStyle: true` (or the LocalStack S3 hostname) so S3 requests go to the wrong URL.",
        'Pointing tests at real AWS by accident because the endpoint env var was missing.',
        'Writing contracts that pin exact values instead of shapes (use matchers like `like`).',
        "Trap: 'If you have LocalStack, do you still need unit tests with mocks?' Yes. Unit tests are faster and cover edge cases; LocalStack covers the integration seam.",
      ],
      takeaway: 'Contracts guard service-to-service seams; LocalStack guards the code-to-AWS seam.',
    },

    {
      id: 'code-review-quality-gates',
      title: 'Code review and quality gates in CI',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Automated gates (lint, types, tests, coverage, audit) block bad merges; human review checks design, correctness and readability.',
      what: [
        "A quality gate is an automatic check that must pass before code can merge or deploy. Typical gates: formatting and lint (Prettier, ESLint), type check (`tsc --noEmit`), unit and integration tests, coverage threshold, build, and a dependency audit.",
        "Code review is a teammate reading the pull request before it merges. Machines catch style and obvious errors; people check whether the change is correct, safe, readable and the right design.",
      ],
      deeper: [
        "Branch protection makes gates real: require the CI checks to pass and at least one approval before merging to `main`. Add pre-commit hooks (Husky + lint-staged) so problems are caught before they even reach CI.",
        "What a good reviewer looks at: correctness and edge cases, security (auth checks, injection, secrets, tenant filters), tests for the new behaviour, naming and readability, performance traps (N+1 queries, missing indexes), and whether it matches the agreed design.",
        "Good review culture: small PRs (a few hundred lines at most), a clear description with how to test it, comments that explain why, labelling nits as optional, and reviewing within a day. Automate everything about style so humans don't argue about semicolons.",
      ],
      why: "Gates stop known classes of problems from ever reaching main. Reviews catch the problems tools can't, and spread knowledge so more than one person understands each part.",
      analogy: "An airport. The automated scanner (CI gates) checks every bag for known dangers in seconds. The officer (reviewer) handles judgment calls the machine can't.",
      code: {
        lang: 'yaml',
        title: '.github/workflows/ci.yml',
        source: `name: CI
on:
  pull_request:
    branches: [main]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run lint           # ESLint + Prettier check
      - run: npx tsc --noEmit       # type check
      - run: npm test -- --coverage # fails if coverageThreshold is not met
      - run: npm audit --audit-level=high
      - run: npm run build`,
      },
      output: "Every pull request to main runs lint, type check, tests with coverage, a dependency audit and a build. With branch protection requiring this job, a PR with a type error, failing test, dropped coverage or a high-severity vulnerable package cannot be merged.",
      questions: [
        { q: 'What is a quality gate?', a: 'An automated check that must pass before code merges or deploys, such as lint, type check, tests, coverage threshold, build and dependency audit. Branch protection enforces it.' },
        { q: 'What do you look for when reviewing a PR?', a: 'Correctness and edge cases, security (auth, validation, tenant filters, secrets), tests for the new behaviour, readability, performance traps like N+1 queries, and fit with the overall design.' },
        { q: 'How do you give good review feedback?', a: 'Be specific and kind, explain why, separate blocking issues from optional nits, and suggest code when it helps. Review the code, not the person.' },
        { q: 'How do you keep reviews fast?', a: 'Small focused PRs with a clear description, automation for style so humans skip it, and a team habit of reviewing within a day.' },
      ],
      answer30: "Quality gates are automated checks in CI that must pass before merging: lint, type check, tests with a coverage threshold, a dependency audit and the build, enforced with branch protection. Code review covers what tools can't: correctness, security like missing auth or tenant filters, test quality, readability and design. I keep PRs small with clear descriptions, automate style so reviews focus on substance, and mark nits as optional.",
      mistakes: [
        'Huge PRs that nobody can review properly.',
        'Arguing about formatting in review instead of letting Prettier decide.',
        'Gates that can be bypassed or that are so flaky people ignore failures.',
        "Trap: 'What do you do when you disagree with a reviewer?' Discuss the trade-off with evidence, take it to a quick call if it drags on, and accept the team's decision; don't merge around it.",
      ],
      takeaway: 'Automate the checkable, review the judgment calls, keep PRs small.',
    },
  ],

  rapidFire: [
    { q: 'Testing pyramid in one line?', a: 'Many unit tests, fewer integration tests, very few e2e tests.' },
    { q: 'What does the testing trophy emphasize?', a: 'Integration tests, on top of a base of static checks.' },
    { q: 'toBe vs toEqual?', a: 'toBe is identity (Object.is); toEqual is deep content equality.' },
    { q: 'How to assert a function throws?', a: 'expect(() => fn()).toThrow(), wrapping the call in a function.' },
    { q: 'How to compare decimals?', a: 'toBeCloseTo, because 0.1 + 0.2 is not exactly 0.3.' },
    { q: 'jest.fn vs jest.spyOn?', a: 'jest.fn makes a new fake function; spyOn wraps an existing method and can restore it.' },
    { q: 'mockReset vs mockRestore?', a: 'mockReset clears calls and fake behaviour; mockRestore also puts the original back (spies only).' },
    { q: 'Why does jest.mock work above imports?', a: 'babel-jest hoists it to the top of the file.' },
    { q: 'How to test a debounce without waiting?', a: 'Fake timers plus jest.advanceTimersByTime.' },
    { q: 'Why can an async test falsely pass?', a: 'The promise was not awaited or returned, so the test ended first.' },
    { q: 'What does expect.assertions(1) protect?', a: 'A try/catch test where the catch never runs.' },
    { q: 'Vitest mock function name?', a: 'vi.fn(), vi.mock(), vi.spyOn().' },
    { q: 'Preferred RTL query?', a: 'getByRole with an accessible name.' },
    { q: 'getBy vs queryBy vs findBy?', a: 'getBy throws, queryBy returns null, findBy waits (promise).' },
    { q: 'user-event vs fireEvent?', a: 'user-event simulates the full real event sequence; fireEvent fires one event.' },
    { q: 'Where does renderHook live now?', a: 'In @testing-library/react (React 18+).' },
    { q: 'Why export app separately from listen for Supertest?', a: 'So tests can import the app without opening a port.' },
    { q: 'Stub vs mock?', a: 'A stub returns canned data; a mock verifies how it was called.' },
    { q: 'Fake vs mock?', a: 'A fake is a simple working implementation, like an in-memory repo.' },
    { q: 'Which coverage number matters most?', a: 'Branch coverage.' },
    { q: 'What does mutation testing reveal?', a: 'Code that runs in tests but whose behaviour no test checks.' },
    { q: 'Red-green-refactor?', a: 'Failing test, minimal code to pass, then clean up with tests green.' },
    { q: 'First fix for a flaky test in CI?', a: 'Quarantine with an owner, reproduce in a loop, fix the root cause.' },
    { q: 'What does LocalStack do?', a: 'Emulates AWS services like S3 and SQS locally in Docker.' },
  ],
};

export default testing;
