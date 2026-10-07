// TypeScript stack. Topics are auto-sorted Basic -> Intermediate -> Advanced by the registry.

const typescript = {
  name: 'TypeScript',
  intro: 'Types for the JavaScript you already write. Interviews check that you can model data precisely, narrow safely, and know where compile-time types stop and runtime validation must start.',
  topics: [
    {
      id: 'why-typescript',
      title: 'Why TypeScript',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'TypeScript adds static types to JavaScript, catching mistakes at compile time; the types are erased before the code runs.',
      what: [
        "TypeScript is JavaScript plus a type system. You describe the shape of your data (`name: string`, `age?: number`), and the compiler checks every use of it before the code runs.",
        "The browser and Node never run TypeScript directly in the classic setup. `tsc`, a bundler (Vite, esbuild) or a runner (tsx) turns it into plain JavaScript by removing the types. So types help while you write code; at runtime it's ordinary JavaScript.",
      ],
      deeper: [
        "The real benefits are at scale: editor autocomplete and safe renames across hundreds of files, refactors where the compiler lists every place you broke, and types acting as always-up-to-date documentation for API payloads and function contracts.",
        "TypeScript is **structurally typed** and **erased**. Because types disappear at runtime, data from outside your program (request bodies, `JSON.parse`, third-party APIs, the database) is not checked by TypeScript at all. You validate it at runtime (for example with zod) and get types from that validation.",
        "Recent Node versions can run `.ts` files directly by stripping types (unflagged since Node 22.18 and 23.6). This only removes type syntax; it doesn't type-check, and it rejects TS-only runtime features such as `enum` and constructor parameter properties. You still run `tsc --noEmit` in CI to check types.",
      ],
      why: "JavaScript fails at runtime with errors like `Cannot read properties of undefined`. TypeScript moves a big share of those failures to compile time, where they are cheap to fix and never reach users.",
      analogy: "TypeScript is a spell-checker for your code's data. It underlines mistakes while you type, but once the letter is printed and posted (compiled to JS), the spell-checker isn't inside the envelope.",
      code: {
        lang: 'ts',
        source: `type User = { id: number; name: string; email?: string };

function greet(user: User): string {
  return \`Hello \${user.name.toUpperCase()}\`;
}

console.log(greet({ id: 1, name: 'Asha' }));

// Each of these is caught at compile time, before the code ever runs:
// greet({ id: 1, nme: 'Asha' });   // Object literal may only specify known properties
// greet('Asha');                   // Argument of type 'string' is not assignable to 'User'
function domain(user: User) {
  // return user.email.split('@')[1];  // 'user.email' is possibly 'undefined'
  return user.email?.split('@')[1] ?? 'no email';
}
console.log(domain({ id: 2, name: 'Ravi' }));`,
      },
      output: "Prints `Hello ASHA` and `no email`. The commented-out lines would each fail compilation: a typo in a property name, the wrong argument type, and using `email` without handling `undefined`.",
      questions: [
        { q: 'Why use TypeScript over JavaScript?', a: 'It catches type mistakes at compile time, gives strong editor support (autocomplete, safe refactors) and documents data shapes in code. That matters most in large codebases and teams.' },
        { q: 'Does TypeScript make your code safe at runtime?', a: 'No. Types are erased when compiling to JavaScript. Data from outside (API requests, JSON, databases) must still be validated at runtime, for example with zod.' },
        { q: 'What does `tsc` do?', a: 'It type-checks your code and, unless `noEmit` is set, outputs JavaScript with the types removed. Many projects use `tsc --noEmit` only for checking and let a bundler or runner do the transpiling.' },
        { q: 'Can Node run TypeScript directly?', a: 'Recent Node versions can strip type annotations and run `.ts` files, but they don\'t type-check, and features that generate code like `enum` aren\'t supported in strip-only mode. You still run `tsc` for checking.' },
      ],
      answer30: "TypeScript is JavaScript with static types. I describe data shapes once and the compiler checks every use, so mistakes like typos, wrong arguments or forgetting undefined are caught before runtime, and refactors become safe across a big codebase. The types are erased at compile time, so anything coming from outside, like request bodies or JSON, still needs runtime validation. I use strict mode and run tsc --noEmit in CI.",
      mistakes: [
        "Thinking TypeScript validates API input at runtime.",
        "Turning off `strict` or sprinkling `any` until the errors go away, which removes most of the value.",
        "Believing TS makes code faster; it has no effect on runtime performance.",
        "Trap: 'Is TypeScript a different language?' It's a superset of JavaScript: valid JS is (mostly) valid TS, and TS compiles to plain JS.",
      ],
      note: "On your resume: you led the TypeScript migration on Skillkeepr (see the projects topic typescript-migration-node-upgrade). Expect 'why did you migrate and what did it catch?'.",
      takeaway: 'TypeScript checks your code at compile time and disappears at runtime; validate outside data yourself.',
    },

    {
      id: 'basic-types-any-unknown-never',
      title: 'Basic types: any vs unknown vs never',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: '`any` turns checking off; `unknown` is a safe "could be anything" that must be narrowed; `never` means a value that can never exist.',
      what: [
        "The everyday types are `string`, `number`, `boolean`, `null`, `undefined`, arrays (`string[]`), tuples (`[number, number]`), object types and function types. TypeScript usually **infers** them, so you only annotate function parameters and places where inference can't help.",
        "`any` disables type checking for that value: you can do anything with it, and mistakes slip through. `unknown` also accepts any value, but you can't use it until you narrow it (`typeof`, `instanceof`, a type guard). `never` is the type with no values: a function that always throws, or a branch that should be impossible.",
      ],
      deeper: [
        "`any` is contagious: properties of `any` are `any`, and it can be assigned to every other type, so one `any` silently spreads. `JSON.parse` and older libraries return `any`, which is a common source of hidden bugs. Prefer `unknown` at boundaries and narrow it.",
        "`never` is useful for **exhaustiveness checks**: in the `default` branch of a switch over a union, assign the value to a `never` variable. If someone later adds a new union member and forgets to handle it, the assignment fails to compile.",
        "Also know: `void` for functions that return nothing useful, `object` for any non-primitive, and that `strictNullChecks` (part of `strict`) is what makes `null` and `undefined` separate types you must handle.",
      ],
      why: "Choosing between `any` and `unknown` is the most common TypeScript judgement call. Interviewers ask it to see whether you keep type safety at the edges of your system or quietly turn it off.",
      analogy: "`any` is a parcel with no label that the post office promises not to inspect. `unknown` is a parcel with no label that must be opened and checked before you use what's inside. `never` is a parcel that can't exist: if the system ever thinks it's holding one, something is wrong.",
      code: {
        lang: 'ts',
        source: `function parse(json: string): unknown {
  return JSON.parse(json);
}

const data = parse('{"name":"Asha","age":30}');
// data.name;   // error: 'data' is of type 'unknown'. You must narrow first.
if (typeof data === 'object' && data !== null && 'name' in data && typeof data.name === 'string') {
  console.log(data.name.toUpperCase());
}

const risky: any = parse('42');
// risky.toUpperCase();   // compiles fine with any, crashes at runtime
console.log(typeof risky);

function fail(message: string): never {
  throw new Error(message);
}

type Shape = 'circle' | 'square';
function area(shape: Shape, size: number): number {
  switch (shape) {
    case 'circle': return Math.PI * size ** 2;
    case 'square': return size * size;
    default: {
      const unreachable: never = shape; // compile error here if a new Shape is added
      return fail('Unknown shape: ' + unreachable);
    }
  }
}
console.log(area('square', 3));`,
      },
      output: "Prints `ASHA`, `number`, then `9`. The `unknown` value could only be used after the checks proved it's an object with a string `name`. If a third shape is added to `Shape` without a new case, the `never` line becomes a compile error.",
      questions: [
        { q: 'What is the difference between `any` and `unknown`?', a: 'Both accept any value. `any` switches off type checking so you can use it freely and unsafely. `unknown` forces you to narrow the type (with `typeof`, `instanceof` or a type guard) before using it.' },
        { q: 'When would you use `never`?', a: 'As the return type of functions that always throw or never finish, and for exhaustiveness checks: assigning a value to `never` in a switch\'s default branch makes the compiler flag unhandled union members.' },
        { q: 'What is type inference?', a: 'TypeScript works out types from values and return statements without annotations, like `const n = 5` being `number`. You annotate function parameters and public APIs; let inference handle the rest.' },
        { q: 'Difference between `void` and `never`?', a: '`void` means a function returns without a useful value. `never` means it never returns normally at all, because it throws or loops forever.' },
      ],
      answer30: "any turns off type checking, so mistakes slip through and it spreads to everything it touches. unknown also accepts any value but forces me to narrow it before use, so I use unknown for anything from outside, like parsed JSON or caught errors. never is the type with no values: for functions that always throw, and for exhaustive switches, where assigning the leftover value to never makes the compiler catch unhandled cases.",
      mistakes: [
        "Using `any` for API responses instead of `unknown` plus validation.",
        "Annotating everything, even where inference already gives the right type.",
        "Forgetting that `catch (err)` gives `unknown` under strict settings; narrow with `err instanceof Error`.",
        "Trap: 'Is `unknown` assignable to `string`?' No, only to `unknown` and `any`. Anything is assignable to `unknown`, but `unknown` isn't assignable to specific types until narrowed.",
      ],
      takeaway: 'Prefer `unknown` over `any` at boundaries, narrow before use, and use `never` for exhaustiveness.',
    },

    {
      id: 'interfaces-vs-types',
      title: 'Interfaces vs type aliases',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Both describe object shapes; only `type` can name unions, tuples and mapped types; only `interface` can be reopened (declaration merging).',
      what: [
        "An `interface` describes the shape of an object: `interface User { id: number; name: string }`. A `type` alias gives a name to any type: an object shape, but also a union (`'a' | 'b'`), a tuple, a function type or a mapped type.",
        "For plain object shapes they are almost interchangeable. Interfaces extend with `extends`; types combine with `&` (intersection).",
      ],
      deeper: [
        "Only interfaces support **declaration merging**: declaring `interface User` twice merges the fields. That's exactly how you add fields to library types, such as `req.user` on Express's `Request`. It's also a risk: an accidental duplicate name silently merges.",
        "Only type aliases can express unions, tuples, conditional and mapped types, and template literal types. `extends` also gives clearer errors than `&` when properties conflict: conflicting intersections can quietly produce `never` fields.",
        "A common team convention: `interface` for object shapes and public contracts (especially ones others may extend), `type` for unions, utility compositions and everything else. Consistency matters more than the choice.",
      ],
      why: "It's one of the most asked TypeScript questions. A good answer shows you know the real differences (unions, merging) instead of just preferring one by habit.",
      analogy: "An `interface` is a job description that HR can add responsibilities to later. A `type` is a label maker: it can label anything, from one box to 'box A or box B', but once printed, the label can't be edited, only replaced.",
      code: {
        lang: 'ts',
        source: `interface User { id: number; name: string }
interface User { email?: string }              // declaration merging: interfaces can be reopened
interface Admin extends User { permissions: string[] }

type Status = 'active' | 'banned';             // only a type alias can name a union
type Point = [number, number];                 // ...or a tuple
type WithStatus = User & { status: Status };   // intersection: has both sets of fields

const admin: Admin = { id: 1, name: 'Asha', permissions: ['jobs:write'] };
const user: WithStatus = { id: 2, name: 'Ravi', email: 'r@x.com', status: 'active' };
const point: Point = [10, 20];

console.log(admin.permissions[0], user.status, point[1]);`,
      },
      output: "Prints `jobs:write active 20`. The two `interface User` declarations merged, so `email` exists on `User`. `Status`, `Point` and `WithStatus` could only be written as type aliases.",
      questions: [
        { q: 'Interface or type: which do you use?', a: 'Interfaces for object shapes and contracts that may be extended, types for unions, tuples, function types and type-level compositions. Both work for plain objects; the team convention matters most.' },
        { q: 'What is declaration merging?', a: 'Declaring the same interface name twice merges their members into one interface. It\'s how you extend library types, like adding `user` to Express\'s `Request`. Type aliases can\'t be merged; redeclaring is an error.' },
        { q: 'Can a type alias express things an interface can\'t?', a: 'Yes: unions (`\'a\' | \'b\'`), tuples, primitives, mapped types, conditional types and template literal types.' },
        { q: '`extends` vs `&`?', a: 'Both combine shapes. `extends` checks compatibility and errors on conflicting properties; an intersection with conflicting property types quietly makes that property `never`.' },
      ],
      answer30: "For plain object shapes interfaces and type aliases are almost the same. The real differences: only type aliases can name unions, tuples, mapped and conditional types, and only interfaces support declaration merging, which is how I add fields like req.user to Express's Request. I use interfaces for object contracts that may be extended and type aliases for unions and compositions, and I follow whatever convention the codebase already has.",
      mistakes: [
        "Saying interfaces are faster or 'more correct' without explaining the actual differences.",
        "Trying to write a union with an interface.",
        "Accidentally merging two unrelated interfaces with the same name in global scope.",
        "Trap: 'Can a class implement a type alias?' Yes, if the alias is an object type, `class A implements MyType` works; it can't implement a union.",
      ],
      takeaway: 'Same for objects; type for unions and type-level tricks, interface for extendable contracts and merging.',
    },

    {
      id: 'structural-typing-assertions',
      title: 'Structural typing and type assertions',
      level: 'basic',
      priority: 'good',
      frequency: 'common',
      summary: 'TypeScript compares shapes, not names; `as` and `!` tell the compiler to trust you and check nothing at runtime.',
      what: [
        "TypeScript is **structurally typed**: if an object has the required properties with the right types, it fits, whatever its class or name. A `Pixel` with `x`, `y` and `color` can be passed where a `Point` with `x` and `y` is expected.",
        "A **type assertion** (`value as User`) tells the compiler 'treat this as a User'. The **non-null assertion** (`value!`) says 'this is not null or undefined'. Neither does anything at runtime; if you're wrong, the code still crashes.",
      ],
      deeper: [
        "**Excess property checks** are a special rule for fresh object literals: passing `{ x, y, z }` straight into a `Point` parameter errors on `z`, to catch typos. The same object stored in a variable first is accepted, because it's no longer fresh.",
        "TypeScript blocks obviously wrong assertions (`'hello' as number`), but `as unknown as number` gets around that. Treat double assertions as a code smell. Prefer narrowing (`if`, type guards) or runtime validation, which actually prove the type.",
        "Because typing is structural, two types with the same shape are interchangeable: a `UserId` string and an `OrderId` string mix freely. When that's dangerous, teams use **branded types** (`string & { __brand: 'UserId' }`).",
      ],
      why: "Most 'TypeScript said it was fine but it crashed' bugs come from assertions on untrusted data. Knowing structural typing also explains many surprising errors and non-errors.",
      analogy: "Structural typing is a plug socket: any plug with the right pin shape fits, whatever brand it is. A type assertion is taping over the warning light: the machine stops complaining, but the problem is still there.",
      code: {
        lang: 'ts',
        source: `// Structural typing: shape matters, not the name
interface Point { x: number; y: number }
class Pixel { constructor(public x: number, public y: number, public color = 'red') {} }
function len(p: Point) { return Math.hypot(p.x, p.y); }
console.log(len(new Pixel(3, 4)));          // OK: Pixel has x and y

// Excess property check: only for fresh object literals
// len({ x: 3, y: 4, z: 5 });               // error: 'z' does not exist in type 'Point'
const p3 = { x: 3, y: 4, z: 5 };
console.log(len(p3));                       // OK: not a fresh literal

// Type assertion: you tell the compiler, nothing is checked at runtime
const raw = JSON.parse('{"x":"oops"}');      // any
const asserted = raw as Point;               // compiles...
console.log(asserted.x.toFixed);             // ...but x is a string: undefined at runtime

// Non-null assertion '!': "trust me, it's not null"
const ids = new Map([['a', 1]]);
console.log(ids.get('a')! + 1);
// const n: number = 'hello' as number;      // error: conversion may be a mistake
const forced = 'hello' as unknown as number; // double assertion: escape hatch, a smell
console.log(typeof forced);`,
      },
      output: "Prints `5`, `5`, `undefined`, `2`, `string`. The assertion `raw as Point` compiled, but `x` was really a string, so `x.toFixed` is `undefined`. The double assertion made a string pretend to be a number: `typeof` still says `string`.",
      questions: [
        { q: 'What does structural typing mean?', a: 'Types are compatible if their shapes match, not because of their names or classes. Any object with the required properties fits the type.' },
        { q: 'Does `as` convert or check a value?', a: 'No. A type assertion only changes what the compiler believes. Nothing happens at runtime, so a wrong assertion leads to runtime errors.' },
        { q: 'When is the non-null assertion `!` acceptable?', a: 'Rarely, when you truly know a value is set but TS can\'t prove it, like right after a check in another function. Prefer optional chaining, an explicit check, or a default.' },
        { q: 'Why did TS reject `{ x: 1, y: 2, z: 3 }` for a Point but accept the same object from a variable?', a: 'Excess property checking only applies to fresh object literals, to catch typos. A variable isn\'t fresh, and structurally it has everything Point needs.' },
      ],
      answer30: "TypeScript is structurally typed: it compares shapes, so any object with the required properties fits, whatever its class. Fresh object literals also get excess property checks to catch typos. Type assertions with as, and the non-null assertion, only tell the compiler to trust me; they don't check or convert anything at runtime. So I avoid them on untrusted data, and prefer narrowing or runtime validation, which actually prove the type.",
      mistakes: [
        "`const user = await res.json() as User;` with no validation.",
        "Using `!` to silence `possibly undefined` errors instead of handling the case.",
        "Using `as unknown as X` to force types through.",
        "Trap: 'Is `<User>value` different from `value as User`?' Same thing, older syntax; it doesn't work in `.tsx` files, so `as` is standard.",
      ],
      takeaway: 'Shapes decide compatibility; `as` and `!` are promises you make, not checks TypeScript does.',
    },

    {
      id: 'unions-narrowing',
      title: 'Unions, intersections and narrowing',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'A union is "one of these types"; narrowing (typeof, instanceof, in, type guards, discriminants) tells TS which one you have.',
      what: [
        "A **union** `A | B` means a value is one of several types. An **intersection** `A & B` means it has everything from both.",
        "With a union you can only use what all members share. To use member-specific fields you **narrow**: `typeof x === 'string'`, `x instanceof Date`, `'meow' in pet`, checking for `null`, or a custom **type guard** function returning `pet is Cat`.",
        "A **discriminated union** gives each member a common literal field (like `state: 'loading' | 'success' | 'error'`). Checking that field narrows to exactly one member.",
      ],
      deeper: [
        "Discriminated unions model states that can't coexist. Instead of `{ loading: boolean; data?: T; error?: string }`, where impossible combinations like loading with an error are allowed, each state carries only its own fields. Combined with a `never` exhaustiveness check, adding a new state forces every switch to handle it.",
        "Type guards (`function isCat(p): p is Cat`) are trusted, not verified: if the function body is wrong, TS believes it anyway. Keep them small and obvious. TypeScript 5.5+ can infer simple type predicates from functions like `x => x !== null`, which makes `array.filter(...)` narrow correctly.",
        "Narrowing is per control-flow path. After `if (!user) return;`, `user` is non-null for the rest of the function. Narrowing on a property can be lost across an `await` or callback if the object could have changed.",
      ],
      why: "Real data has variants: API results that succeed or fail, events of different kinds, optional fields. Unions plus narrowing model those exactly, and discriminated unions are a favourite interview topic because they make impossible states impossible.",
      analogy: "A union is a mystery box that holds either a cat or a dog. Narrowing is listening at the box: if it meows, you know to treat it as a cat. A discriminated union is a box with a label printed on it saying which animal is inside.",
      code: {
        lang: 'ts',
        source: `// Discriminated union: every member has a literal 'state' field
type Loading = { state: 'loading' };
type Success = { state: 'success'; data: string[] };
type Failure = { state: 'error'; error: string };
type Result = Loading | Success | Failure;

function render(r: Result): string {
  switch (r.state) {
    case 'loading': return 'Spinner';
    case 'success': return \`Got \${r.data.length} items\`; // r is Success here
    case 'error':   return \`Error: \${r.error}\`;          // r is Failure here
  }
}

// Narrowing with typeof (instanceof and 'in' work the same way)
function format(v: string | number | Date): string {
  if (typeof v === 'string') return v.trim();
  if (typeof v === 'number') return v.toFixed(2);
  return v.toISOString().slice(0, 10); // only Date is left
}

// Custom type guard: the return type 'pet is Cat' teaches TS what the check means
interface Cat { meow(): string }
interface Dog { bark(): string }
function isCat(pet: Cat | Dog): pet is Cat {
  return 'meow' in pet;
}

// Intersection: combine types
type Timestamped = { createdAt: Date };
type SavedResult = Success & Timestamped;
const saved: SavedResult = { state: 'success', data: ['x'], createdAt: new Date() };

console.log(render({ state: 'success', data: ['a', 'b'] }));
console.log(render({ state: 'error', error: 'timeout' }));
console.log(format('  hi  '), format(3.14159), format(new Date('2026-01-15T00:00:00Z')));
const pets: (Cat | Dog)[] = [{ bark: () => 'woof' }, { meow: () => 'meow' }];
console.log(pets.map((p) => (isCat(p) ? p.meow() : p.bark())), saved.data.length);`,
      },
      output: "Prints `Got 2 items`, `Error: timeout`, `hi 3.14 2026-01-15`, and `[ 'woof', 'meow' ] 1`. In each branch, TypeScript knew exactly which member of the union it had, so `r.data` and `r.error` were only allowed where they exist.",
      questions: [
        { q: 'What is a discriminated union?', a: 'A union where every member has a shared literal property, like `state: \'loading\' | \'success\' | \'error\'`. Checking that property narrows the value to one member, giving access to its specific fields.' },
        { q: 'What is a type guard?', a: 'A check that narrows a type: `typeof`, `instanceof`, `in`, equality checks, or a custom function whose return type is `value is Type`. Custom guards are trusted by the compiler, so they must be correct.' },
        { q: 'Union vs intersection?', a: 'A union `A | B` is one or the other, so you can only use shared members until you narrow. An intersection `A & B` has all members of both at once.' },
        { q: 'Why model state as a discriminated union instead of optional fields?', a: 'Optional fields allow impossible combinations like `loading: true` with an `error`. A discriminated union only allows valid states and forces each case to be handled.' },
      ],
      answer30: "A union means a value is one of several types, and I narrow it before using member-specific fields, with typeof, instanceof, the in operator, null checks or a custom type guard returning 'x is T'. My favourite pattern is the discriminated union: every variant has a literal field like state or type, so a switch on it narrows to one variant, and a never check in the default makes the compiler flag any unhandled variant. It models API states and events without impossible combinations.",
      mistakes: [
        "Modelling state with several optional fields and booleans instead of a discriminated union.",
        "Writing a type guard whose logic doesn't really prove the type.",
        "Expecting `typeof x === 'object'` to rule out `null`; it doesn't.",
        "Trap: 'Why can't I call `.toFixed()` on `string | number`?' Only members common to all union types are allowed until you narrow.",
      ],
      takeaway: 'Unions model variants; narrow before use, and prefer discriminated unions with an exhaustive switch.',
    },

    {
      id: 'generics',
      title: 'Generics and constraints',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Generics are type parameters: write a function or type once and keep the caller\'s exact type flowing through it; constraints limit what T can be.',
      what: [
        "A **generic** is a type parameter, written `<T>`. It lets one function, interface or class work with many types while keeping the specific type. `first<T>(items: T[]): T` returns a `number` for a number array and a `string` for a string array.",
        "A **constraint** (`T extends { id: string }`) says what T must at least have, so you can safely use those properties inside. `K extends keyof T` means K must be one of T's keys.",
      ],
      deeper: [
        "TypeScript infers type arguments from the call, so you rarely write `first<number>(...)`. You pass them explicitly when there's nothing to infer from, like `useState<User | null>(null)` or `fetchJson<Job[]>(url)`.",
        "`pluck<T, K extends keyof T>(obj: T, key: K): T[K]` is the classic pattern: the key is checked against the real keys, and the return type is the type of that exact property. Type parameters can have defaults (`ApiResponse<T = unknown>`).",
        "Don't over-generify. A type parameter used only once usually adds nothing: `function log<T>(x: T): void` is no better than `(x: unknown) => void`. Generics should connect types, typically an input to an output. And a generic like `fetchJson<T>()` that just casts the response is an assertion in disguise; it doesn't validate anything.",
      ],
      why: "Without generics you either duplicate code per type or fall back to `any` and lose type safety. Repositories, API clients, React components and utility functions all rely on them.",
      analogy: "A generic is a labelled storage box: 'Box of ___'. Fill in 'books' and everyone knows a book comes out. A constraint says 'only things with a barcode', so the scanner always works.",
      code: {
        lang: 'ts',
        source: `function first<T>(items: T[]): T | undefined {
  return items[0];
}
const n = first([1, 2, 3]);    // T inferred as number
const s = first(['a', 'b']);   // T inferred as string

// Constraint: T must at least have an id
function indexById<T extends { id: string }>(items: T[]): Map<string, T> {
  return new Map(items.map((item) => [item.id, item]));
}
const jobs = indexById([{ id: 'j1', title: 'SDE' }, { id: 'j2', title: 'QA' }]);
console.log(jobs.get('j2')?.title); // TS still knows about .title

// keyof constraint: key must be a real key of obj, and the return type follows it
function pluck<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const user = { name: 'Asha', age: 30 };
const age = pluck(user, 'age');   // number
// pluck(user, 'salary');         // error: '"salary"' is not assignable to '"name" | "age"'

// Generic interface with a default
interface ApiResponse<T = unknown> {
  data: T;
  error: string | null;
}
const res: ApiResponse<string[]> = { data: ['a'], error: null };

console.log(n, s, age, res.data.length);`,
      },
      output: "Prints `QA`, then `1 a 30 1`. `n` is typed `number | undefined`, `s` is `string | undefined`, and `age` is `number`, all inferred. Asking `pluck` for a key that doesn't exist is a compile error.",
      questions: [
        { q: 'What are generics and why use them?', a: 'Type parameters that let you write reusable code while preserving the specific types used by each caller. They avoid both duplicated code and `any`.' },
        { q: 'What does `T extends { id: string }` mean in a generic?', a: 'It\'s a constraint: T can be any type, as long as it has an `id` string. Inside the function you can safely use `item.id`, and callers still get their full type back.' },
        { q: 'What does `K extends keyof T` do?', a: 'It restricts K to the property names of T. Combined with a return type `T[K]`, the function returns the exact type of the property requested.' },
        { q: 'When should you pass type arguments explicitly?', a: 'When TypeScript can\'t infer them from arguments, like `useState<User | null>(null)` or an empty array. Otherwise let inference do it.' },
      ],
      answer30: "Generics are type parameters. They let me write a function or type once, like a repository or an API response wrapper, and keep the caller's exact type flowing through instead of using any. Constraints with extends say what T must have, like an id, so I can use it inside. The classic example is pluck with K extends keyof T returning T[K]. TypeScript usually infers the type arguments, and I only pass them explicitly when there's nothing to infer from, like useState with null.",
      mistakes: [
        "Using `any` where a generic would keep the type.",
        "Adding type parameters that appear only once and connect nothing.",
        "Believing `fetchJson<User>()` validates the response; it's just an assertion.",
        "Trap: 'Why does `function f<T>(x: T) { return x.id }` fail?' T could be anything; add a constraint like `T extends { id: unknown }`.",
      ],
      takeaway: 'Generics keep the caller\'s type flowing through reusable code; constraints say what T must have.',
    },

    {
      id: 'utility-types',
      title: 'Utility types',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Built-in type helpers (Partial, Required, Pick, Omit, Record, Readonly, Exclude, ReturnType, Parameters, Awaited...) derive new types from existing ones.',
      what: [
        "Utility types are generic types built into TypeScript that transform other types, so you derive related types instead of writing them by hand.",
        "The everyday ones: `Partial<T>` (all fields optional, great for PATCH bodies), `Required<T>`, `Readonly<T>`, `Pick<T, 'a' | 'b'>` (keep some fields), `Omit<T, 'password'>` (drop fields), `Record<K, V>` (an object with keys K and values V), `Exclude` / `Extract` (filter union members), `NonNullable<T>`, `ReturnType<typeof fn>`, `Parameters<typeof fn>` and `Awaited<T>` (the resolved type of a promise).",
      ],
      deeper: [
        "Deriving keeps types in sync. If `User` gains a field, `PublicUser = Omit<User, 'password'>` gains it too. Hand-copied DTO interfaces drift apart silently.",
        "`Awaited<ReturnType<typeof loadUser>>` gets the resolved value type of an async function you don't own the types for. `Record<Role, string>` forces you to cover every role: adding a role breaks the build until you add its label, which is exactly what you want.",
        "Gotchas: `Omit` is not type-safe on its keys (`Omit<User, 'pasword'>` with a typo compiles and removes nothing). `Partial` is shallow, so nested objects stay required. `Readonly` is shallow and compile-time only; use `Object.freeze` for runtime protection.",
      ],
      why: "They remove duplicated type definitions, keep request, response and database types aligned, and are asked about constantly because they show you can model real API shapes.",
      analogy: "Utility types are photo filters for types. Start from one original photo (`User`), then crop it (`Pick`), blur out a face (`Omit`), or make every part optional (`Partial`), without retaking the picture.",
      code: {
        lang: 'ts',
        source: `interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'recruiter' | 'viewer';
}

type UpdateUserInput = Partial<Omit<User, 'id'>>;   // all optional, id not allowed
type PublicUser = Omit<User, 'password'>;           // safe to send to clients
type Credentials = Pick<User, 'email' | 'password'>;
type RoleLabels = Record<User['role'], string>;     // must cover every role
type NonAdminRole = Exclude<User['role'], 'admin'>; // 'recruiter' | 'viewer'
type FrozenUser = Readonly<User>;                   // can't assign to fields

async function loadUser(id: string) {
  return { id, name: 'Asha', plan: 'pro' as const };
}
type LoadedUser = Awaited<ReturnType<typeof loadUser>>; // { id: string; name: string; plan: 'pro' }
type LoadArgs = Parameters<typeof loadUser>;            // [id: string]

const labels: RoleLabels = { admin: 'Admin', recruiter: 'Recruiter', viewer: 'Viewer' };
const patch: UpdateUserInput = { name: 'Asha K' };
const login: Credentials = { email: 'a@x.com', password: 'secret' };
const role: NonAdminRole = 'viewer';

function toPublic({ password, ...rest }: User): PublicUser {
  return rest;
}
const frozen: FrozenUser = { id: 'u1', name: 'Asha', email: 'a@x.com', password: 'h', role: 'admin' };
// frozen.name = 'x';   // error: Cannot assign to 'name' because it is a read-only property

const args: LoadArgs = ['u1'];
const loaded: LoadedUser = await loadUser(...args);
console.log(labels.recruiter, Object.keys(patch), login.email, role);
console.log(toPublic(frozen), loaded.plan);`,
      },
      output: "Prints `Recruiter [ 'name' ] a@x.com viewer`, then `{ id: 'u1', name: 'Asha', email: 'a@x.com', role: 'admin' } pro`. `toPublic` stripped the password, and its return type `PublicUser` guarantees the password field can't be returned by mistake.",
      questions: [
        { q: 'Difference between Pick and Omit?', a: '`Pick<T, K>` keeps only the listed keys. `Omit<T, K>` keeps everything except the listed keys. Use Pick for small subsets, Omit to drop a few sensitive or generated fields.' },
        { q: 'How would you type a PATCH request body?', a: '`Partial<Omit<Entity, \'id\' | \'createdAt\'>>`: every editable field optional, and server-controlled fields not allowed at all.' },
        { q: 'How do you get the type a function returns, including async ones?', a: '`ReturnType<typeof fn>` for the return type; wrap in `Awaited<...>` to unwrap the Promise of an async function.' },
        { q: 'What does `Record<K, V>` give you?', a: 'An object type whose keys are K and values are V. With a union of literal keys, like `Record<Role, string>`, every key is required, so adding a new role forces you to update the object.' },
        { q: 'Is `Partial` deep?', a: 'No, it only makes top-level properties optional. Nested objects keep their required fields; you\'d need a custom recursive `DeepPartial` type.' },
      ],
      answer30: "Utility types derive new types from existing ones so definitions stay in sync. I use Partial for PATCH bodies, Omit to drop sensitive fields like password from response types, Pick for small subsets, Record for lookup objects keyed by a union so every key is required, and ReturnType with Awaited to get the result type of an async function. Two gotchas: Partial and Readonly are shallow, and Omit doesn't check that the key you remove really exists.",
      mistakes: [
        "Hand-writing DTO types that duplicate the model and drift out of sync.",
        "Expecting `Readonly` to stop mutation at runtime.",
        "A typo in an `Omit` key that silently removes nothing.",
        "Trap: 'Partial<User> for a create endpoint?' No, that allows creating a user with no fields. Use the full required shape, minus server-generated fields.",
      ],
      takeaway: 'Derive types with Partial, Pick, Omit, Record and ReturnType instead of copying them.',
    },

    {
      id: 'keyof-typeof-indexed-access',
      title: 'keyof, typeof and indexed access types',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: '`typeof` gets a type from a value, `keyof` gets the union of an object type\'s keys, and `T[K]` looks up a property\'s type.',
      what: [
        "In a type position, `typeof value` turns a JavaScript value into its type. That lets a config object or constant array be the single source of truth.",
        "`keyof T` produces a union of T's property names, like `'port' | 'db' | 'features'`.",
        "**Indexed access** `T['db']` gives the type of one property, and `T[number]` gives the element type of an array or tuple.",
      ],
      deeper: [
        "Together they derive types from data: `const ROLES = ['admin', 'recruiter'] as const; type Role = (typeof ROLES)[number];` gives the union `'admin' | 'recruiter'` and a runtime array to loop over or validate against. Add a role in one place and both update.",
        "`typeof` in a type position is TypeScript's operator; `typeof x === 'string'` in an expression is JavaScript's runtime operator. Same word, two different things.",
        "`Object.keys(obj)` returns `string[]`, not `(keyof T)[]`, because structural typing means an object may have extra keys at runtime. Casting with `as (keyof T)[]` is common but is your promise, not a check.",
      ],
      why: "These operators let types follow your real values, so constants, configs and lookup tables can't drift from their types. They're also the building blocks of every advanced type.",
      analogy: "`typeof` is tracing a shape from a real object. `keyof` is reading the list of drawer labels on a cabinet. Indexed access is opening one drawer by its label to see what kind of thing it holds.",
      code: {
        lang: 'ts',
        source: `const config = {
  port: 3000,
  db: { url: 'mongodb://localhost/app', poolSize: 10 },
  features: ['search', 'ai'],
};

type Config = typeof config;                // type taken from a value
type ConfigKey = keyof Config;              // 'port' | 'db' | 'features'
type DbConfig = Config['db'];               // { url: string; poolSize: number }
type Feature = Config['features'][number];  // string

const ROLES = ['admin', 'recruiter', 'viewer'] as const;
type Role = (typeof ROLES)[number];         // 'admin' | 'recruiter' | 'viewer'

function getSetting<K extends ConfigKey>(key: K): Config[K] {
  return config[key];
}

const db: DbConfig = getSetting('db');      // typed as the db object, not a union
const feature: Feature = 'search';
const role: Role = 'recruiter';
console.log(db.poolSize, feature, role);

// Object.keys returns string[], not (keyof T)[], so you cast deliberately
const keys = Object.keys(config) as ConfigKey[];
console.log(keys);`,
      },
      output: "Prints `10 search recruiter` and `[ 'port', 'db', 'features' ]`. `getSetting('db')` is typed as the db object specifically, not a union of all setting types, because the return type is `Config[K]`.",
      questions: [
        { q: 'What does `keyof` do?', a: 'It produces a union of the property names of an object type. For `{ a: string; b: number }`, `keyof` gives `\'a\' | \'b\'`.' },
        { q: 'What is `typeof` in a type position?', a: 'It extracts the TypeScript type of a JavaScript value, like `type Config = typeof config`. It\'s different from the runtime `typeof` operator that returns a string.' },
        { q: 'How do you get a union type from a constant array?', a: 'Declare it `as const` and use `(typeof ARR)[number]`. For `[\'a\', \'b\'] as const` that gives `\'a\' | \'b\'`, and you keep the array for runtime use.' },
        { q: 'Why does `Object.keys` return `string[]`?', a: 'Because with structural typing an object can have more keys at runtime than its type lists, so TypeScript can\'t promise they\'re only `keyof T`.' },
      ],
      answer30: "typeof in a type position turns a value into a type, so a config object or constant array can be the single source of truth. keyof gives a union of an object type's keys, and indexed access like T['db'] or T[number] looks up a property or element type. A pattern I use a lot: a const array of roles with as const, then (typeof ROLES)[number] for the union type. Combined in generics, K extends keyof T returning T[K] gives precisely typed getters.",
      mistakes: [
        "Duplicating a list as both a union type and an array, which then drift apart.",
        "Forgetting `as const`, which widens `['admin']` to `string[]`, so `[number]` gives `string`.",
        "Confusing type-level `typeof` with runtime `typeof`.",
        "Trap: 'Is `keyof` of an index signature type a literal union?' No. `keyof { [k: string]: number }` is `string | number`, since numeric keys are allowed too.",
      ],
      takeaway: 'typeof turns values into types, keyof lists keys, T[K] looks them up: derive types from data.',
    },

    {
      id: 'mapped-conditional-types',
      title: 'Mapped and conditional types, infer',
      level: 'advanced',
      priority: 'good',
      frequency: 'occasional',
      summary: 'Mapped types loop over keys to build new types; conditional types are type-level if/else; `infer` captures a type from inside another.',
      what: [
        "A **mapped type** loops over the keys of a type: `{ [K in keyof T]: T[K] | null }` makes every property nullable. This is how `Partial`, `Readonly` and `Record` are built.",
        "A **conditional type** chooses a type based on a test: `T extends string ? 'yes' : 'no'`.",
        "`infer` lets a conditional type capture part of a type: `T extends Promise<infer V> ? V : T` pulls out what a promise resolves to. `ReturnType` and `Awaited` are built this way.",
      ],
      deeper: [
        "Mapped types can rename keys with `as` and template literal types: `` `get${Capitalize<K>}` `` turns `title` into `getTitle`. Mapping a key to `never` with `as` removes it, which is how you filter keys by their value type.",
        "Conditional types **distribute** over unions when the checked type is a naked type parameter: `NotNull<string | null>` checks `string` and `null` separately and unions the results. Wrap in brackets (`[T] extends [X]`) to stop that.",
        "Use these in library code and shared utilities, not everywhere. Deeply clever types are hard for teammates to read and slow the compiler. Interviews usually ask you to explain or write a small one like `MyPartial`, `MyReturnType` or `ElementOf`.",
      ],
      why: "They explain how the built-in utility types work, and let you build type-safe helpers such as typed event emitters, form field maps and API client types derived from route definitions.",
      analogy: "A mapped type is a mail-merge: take a template and apply it to every name on the list. A conditional type is a sorting machine: 'if it's a parcel, go left; otherwise go right'. `infer` is the scanner that reads what's inside the parcel and labels it.",
      code: {
        lang: 'ts',
        source: `// Mapped types: build a new type by looping over keys
type Nullable<T> = { [K in keyof T]: T[K] | null };
type Getters<T> = { [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K] };

// Conditional types: if/else at the type level
type IsString<T> = T extends string ? 'yes' : 'no';
type A = IsString<'hi'>; // 'yes'
type B = IsString<42>;   // 'no'

// infer: capture a type from inside another type
type ElementOf<T> = T extends (infer U)[] ? U : never;
type UnwrapPromise<T> = T extends Promise<infer V> ? V : T;
type C = ElementOf<string[]>;             // string
type D = UnwrapPromise<Promise<number>>;  // number

// Distributive: a conditional on a naked type parameter runs once per union member
type NotNull<T> = T extends null | undefined ? never : T;
type E = NotNull<string | null | undefined>; // string

interface Job { title: string; openings: number }

const getters: Getters<Job> = {
  getTitle: () => 'SDE',
  getOpenings: () => 2,
};
const draft: Nullable<Job> = { title: null, openings: 3 };
const proof: [A, B, C, D, E] = ['yes', 'no', 'text', 1, 'ok'];

console.log(getters.getTitle(), draft.title, proof);`,
      },
      output: "Prints `SDE null [ 'yes', 'no', 'text', 1, 'ok' ]`. The tuple `proof` only compiles because A is `'yes'`, B is `'no'`, C is `string`, D is `number` and E is `string`, proving each type resolved as the comments say.",
      questions: [
        { q: 'What is a mapped type?', a: 'A type that loops over keys with `[K in keyof T]` to produce a new object type, like making every property optional or readonly. Partial, Readonly and Record are mapped types.' },
        { q: 'What is a conditional type?', a: 'A type-level if/else: `T extends U ? X : Y`. If T is assignable to U the result is X, otherwise Y.' },
        { q: 'What does `infer` do?', a: 'Inside a conditional type it declares a type variable that TypeScript fills in from the matched structure, like extracting the element type of an array or the resolved type of a Promise.' },
        { q: 'How would you write `ReturnType` yourself?', a: '`type MyReturnType<F> = F extends (...args: any[]) => infer R ? R : never;`' },
        { q: 'What does distributive mean for conditional types?', a: 'When the checked type is a bare type parameter and you pass a union, the condition runs on each member separately and the results are unioned. Wrapping both sides in brackets turns this off.' },
      ],
      answer30: "Mapped types loop over the keys of a type to build a new one, which is how Partial, Readonly and Record work, and they can rename keys with as and template literals. Conditional types are a type-level if/else with extends, and infer captures a piece of the matched type, like the element type of an array or what a Promise resolves to; that's how ReturnType and Awaited are built. Conditional types also distribute over unions. I use them for shared helpers, but keep everyday code simple.",
      mistakes: [
        "Writing very clever types that no one else on the team can maintain.",
        "Being surprised by distribution over unions in conditional types.",
        "Recursive types that hit the compiler's depth limit or slow down the editor.",
        "Trap: 'Write `Partial` yourself.' `type MyPartial<T> = { [K in keyof T]?: T[K] };`",
      ],
      takeaway: 'Mapped types loop over keys, conditional types branch, infer extracts; they power all the built-in utilities.',
    },

    {
      id: 'enums-vs-unions-as-const',
      title: 'Enums vs union literals and as const',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Enums generate runtime objects and have quirks; string literal unions plus `as const` objects give the same safety with plain JavaScript.',
      what: [
        "An `enum` is a TypeScript feature that creates both a type and a real JavaScript object: `enum Status { Active = 'ACTIVE' }`. Numeric enums (`enum Direction { Up, Down }`) number members from 0.",
        "A **union of string literals** (`type Role = 'admin' | 'recruiter'`) gives the same checking with no runtime code at all. When you also need runtime values (to loop over, show in a dropdown, or validate), use an object or array with **`as const`**, which makes the values readonly literal types, and derive the union from it.",
      ],
      deeper: [
        "Enum quirks: numeric enums have reverse mappings (`Direction[0]` is `'Up'`); string enums are nominal, so you can't pass the plain string `'ACTIVE'` where `Status` is expected, which is awkward with JSON from APIs; and `const enum` gets inlined, which breaks with tools that compile one file at a time (`isolatedModules`).",
        "Enums aren't plain JavaScript syntax. Node's built-in type stripping rejects them, and the `erasableSyntaxOnly` compiler option (TS 5.8+) bans them along with namespaces and constructor parameter properties. That's pushing many teams towards unions and `as const`.",
        "`as const` also freezes the type of nested objects and arrays to readonly literals, which is useful for config, route tables and lists of options.",
      ],
      why: "It's a common code-review debate and interview question. The good answer weighs readability against runtime cost and tool compatibility, rather than just liking one.",
      analogy: "An enum is a printed menu that the restaurant has to reprint (runtime code) and that only accepts orders by item number. A union of literals is ordering by the dish name, which everyone already understands; `as const` is the same menu written on a board you can still read at runtime.",
      code: {
        lang: 'ts',
        source: `// 1) Numeric enum: a real runtime object with reverse mapping
enum Direction { Up, Down }
console.log(Direction.Up, Direction[0]);

// 2) String enum: readable values, but nominal (plain strings are rejected)
enum Status { Active = 'ACTIVE', Banned = 'BANNED' }
function setStatus(s: Status) { return s; }
console.log(setStatus(Status.Active));
// setStatus('ACTIVE');   // error: '"ACTIVE"' is not assignable to parameter of type 'Status'

// 3) Union of string literals: zero runtime code
type Role = 'admin' | 'recruiter';
function setRole(r: Role) { return r; }
console.log(setRole('admin'));

// 4) 'as const' object: runtime values AND a derived union type
const Plan = { Free: 'free', Pro: 'pro', Enterprise: 'enterprise' } as const;
type Plan = (typeof Plan)[keyof typeof Plan]; // 'free' | 'pro' | 'enterprise'
function setPlan(p: Plan) { return p; }
console.log(setPlan('pro'), setPlan(Plan.Enterprise), Object.values(Plan));`,
      },
      output: "Prints `0 Up`, `ACTIVE`, `admin`, and `pro enterprise [ 'free', 'pro', 'enterprise' ]`. Passing the string `'ACTIVE'` to `setStatus` is a compile error, while `setPlan('pro')` is fine because `Plan` is a plain string union. Run with tsx or tsc: Node's strip-only mode refuses the enums.",
      questions: [
        { q: 'Enum or union of string literals?', a: 'I usually prefer unions: no runtime code, plain strings from JSON fit directly, and they work with type-stripping tools. If I need runtime values too, I use an `as const` object and derive the union from it. Enums are fine if the codebase already uses them consistently.' },
        { q: 'What does `as const` do?', a: 'It makes a literal expression deeply readonly and keeps the narrowest literal types, so `[\'a\', \'b\'] as const` is `readonly [\'a\', \'b\']` instead of `string[]`.' },
        { q: 'What is a reverse mapping in enums?', a: 'Numeric enums compile to an object mapping both name to number and number to name, so `Direction[0]` returns `\'Up\'`. String enums don\'t have reverse mappings.' },
        { q: 'What is a `const enum` and why be careful?', a: 'An enum whose uses are inlined as values at compile time, with no object emitted. It breaks with single-file compilers (`isolatedModules`, Babel, esbuild), so most projects avoid it.' },
      ],
      answer30: "Enums create a runtime object plus a type, and they have quirks: numeric enums have reverse mappings, string enums don't accept plain strings from JSON, and const enums break with single-file compilers. They're also not erasable syntax, so Node's type stripping rejects them. I usually use a union of string literals, and when I need the values at runtime I write an as const object or array and derive the union with typeof and keyof. That's plain JavaScript with the same type safety.",
      mistakes: [
        "Using numeric enums for values stored in the database, then reordering members and changing every stored value.",
        "Forgetting `as const` and getting `string` instead of a literal union.",
        "Using `const enum` with esbuild or `isolatedModules`.",
        "Trap: 'Can a numeric enum accept any number?' Older TypeScript allowed it; since TS 5.0 assigning a literal that isn't a member is an error, but computed numbers can still slip through.",
      ],
      takeaway: 'Prefer string literal unions and `as const` objects; use enums only when the codebase already does.',
    },

    {
      id: 'function-overloads',
      title: 'Function overloads',
      level: 'advanced',
      priority: 'rare',
      frequency: 'occasional',
      summary: 'Several call signatures for one implementation, so the return type depends on how the function is called.',
      what: [
        "Function overloads let one function have several typed signatures. You write the overload signatures first (what callers see), then one **implementation signature** that handles all cases.",
        "TypeScript picks the first overload that matches the call, so different argument types can give different return types: `toArray('a,b')` returns `string[]`, `toArray(7, 3)` returns `number[]`.",
      ],
      deeper: [
        "The implementation signature is not callable from outside; it must be compatible with every overload, and its body is only checked against itself, so a wrong overload can lie. Order overloads from most specific to most general, since the first match wins.",
        "Often a union parameter or a generic is simpler and just as precise. Use overloads when the relationship between inputs and output can't be expressed with a generic, for example when argument count changes the result, as in many DOM and Node APIs like `document.createElement('div')` returning `HTMLDivElement`.",
        "Arrow functions can't have overloads directly; you'd describe them with an interface or type that has several call signatures.",
      ],
      why: "You meet overloads constantly in library typings (`addEventListener`, `createElement`, Mongoose's `find`), so you need to read them, even if you rarely write them.",
      analogy: "A vending machine with two slots: insert coins and you get a snack; insert a card and you get a receipt too. Same machine (implementation), different results depending on what you put in (overloads).",
      code: {
        lang: 'ts',
        source: `// Overload signatures: what callers see
function toArray(value: string): string[];
function toArray(value: number, count: number): number[];
// Implementation signature: hidden from callers, must handle every overload
function toArray(value: string | number, count = 1): (string | number)[] {
  return typeof value === 'string' ? value.split(',') : Array(count).fill(value);
}

const letters = toArray('a,b,c'); // string[]
const sevens = toArray(7, 3);     // number[]
// toArray(7);                    // error: no overload takes a number without a count
console.log(letters, sevens);

// Often simpler: a generic or a union instead of overloads
function wrap<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}
console.log(wrap(1), wrap(['x', 'y']));`,
      },
      output: "Prints `[ 'a', 'b', 'c' ] [ 7, 7, 7 ]` and `[ 1 ] [ 'x', 'y' ]`. Callers see two precise signatures; calling `toArray(7)` with no count matches neither overload and fails to compile.",
      questions: [
        { q: 'What are function overloads in TypeScript?', a: 'Multiple call signatures declared above one implementation. TypeScript picks the first matching signature for each call, so return types can depend on the arguments.' },
        { q: 'Can callers use the implementation signature?', a: 'No. Only the overload signatures are visible. The implementation signature must be general enough to cover all of them.' },
        { q: 'When would you prefer a generic or a union over overloads?', a: 'When one signature can express the relationship, like `<T>(x: T | T[]) => T[]`. It\'s simpler to read and maintain. Overloads are for cases a single signature can\'t describe.' },
        { q: 'Does overload order matter?', a: 'Yes. TypeScript uses the first overload that matches, so put the most specific signatures first.' },
      ],
      answer30: "Overloads let one function expose several call signatures with one implementation underneath. The return type can then depend on the arguments, like createElement returning a specific element type. Only the overload signatures are visible to callers, they're matched top to bottom so specific ones go first, and the implementation must cover all of them. I write them rarely; usually a generic or a union says the same thing more simply.",
      mistakes: [
        "Expecting the implementation signature to be callable.",
        "Putting a general overload first so specific ones are never chosen.",
        "Writing overloads where a generic would do.",
        "Trap: 'Does TypeScript check that each overload's return type is true?' Only loosely against the implementation signature, so overloads can lie if the body is wrong.",
      ],
      takeaway: 'Overloads give argument-dependent return types; reach for a generic or union first.',
    },

    {
      id: 'satisfies-operator',
      title: 'The satisfies operator',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: '`satisfies` checks a value against a type without widening it, so you get validation and keep the precise inferred type.',
      what: [
        "`value satisfies Type` (TypeScript 4.9+) checks that a value matches a type, but the variable keeps its own, more precise inferred type.",
        "Compare with an annotation `const x: Type = ...`: that also checks, but then the variable's type becomes exactly `Type`, losing details like which keys exist or which union member each property is.",
      ],
      deeper: [
        "Classic use: config and lookup objects. `routes satisfies Record<string, Route>` validates every entry, yet `keyof typeof routes` is still `'home' | 'jobs'`, so typos like `routes.hmoe` are caught. With an annotation, any string key would be allowed.",
        "It also keeps narrower property types: in a theme where values may be `string | number[]`, `satisfies` remembers that `primary` is a string, so `.toUpperCase()` works without narrowing.",
        "Combine with `as const` (`{...} as const satisfies Config`) to get readonly literal types that are also validated. Unlike `as`, `satisfies` never forces a wrong type through: if the value doesn't match, it's an error.",
      ],
      why: "It replaces many annotations and assertions with something strictly better for constant objects, and interviewers use it to check whether you're current with modern TypeScript.",
      analogy: "An annotation is pouring your stuff into a standard-sized box: it fits the rules but loses its shape. `satisfies` is having an inspector confirm your box meets the rules while you keep your own custom-shaped box.",
      code: {
        lang: 'ts',
        source: `type Route = { path: string; auth: boolean };

// Type annotation: checked, but the variable's type becomes Record<string, Route>
const routesA: Record<string, Route> = {
  home: { path: '/', auth: false },
  jobs: { path: '/jobs', auth: true },
};
console.log(routesA.typo); // no compile error: any string key is allowed -> undefined at runtime

// satisfies: checked against Route, but keeps the precise inferred type
const routes = {
  home: { path: '/', auth: false },
  jobs: { path: '/jobs', auth: true },
} satisfies Record<string, Route>;
// routes.typo;             // error: Property 'typo' does not exist
type RouteName = keyof typeof routes; // 'home' | 'jobs'
const name: RouteName = 'jobs';

const theme = {
  primary: '#2563eb',
  spacing: [4, 8, 16],
} satisfies Record<string, string | number[]>;
console.log(theme.primary.toUpperCase(), theme.spacing.map((n) => n * 2), routes[name].path);
// With ': Record<string, string | number[]>' instead, theme.primary.toUpperCase() would be an error`,
      },
      output: "Prints `undefined` (the annotated version happily accepted the `typo` key at compile time), then `#2563EB [ 8, 16, 32 ] /jobs`. With `satisfies`, `routes.typo` is a compile error and `theme.primary` is known to be a string.",
      questions: [
        { q: 'What does `satisfies` do?', a: 'It checks that an expression matches a type without changing the expression\'s inferred type. You get the error checking of an annotation and keep the precise keys and literal types.' },
        { q: 'Annotation vs `satisfies`?', a: 'An annotation makes the variable exactly that type, widening it. `satisfies` validates but keeps the narrower inferred type, so known keys and specific value types are preserved.' },
        { q: '`as` vs `satisfies`?', a: '`as` is an assertion that can force a wrong type through. `satisfies` is a check that fails if the value doesn\'t match, and it doesn\'t change the type.' },
        { q: 'When is an annotation still better?', a: 'When you want the wider type on purpose, like a variable that will be reassigned to other valid values later, or a function\'s public return type.' },
      ],
      answer30: "satisfies checks a value against a type without widening it. With an annotation like Record<string, Route>, the object becomes that type, so any string key is allowed and specific value types are lost. With satisfies, every entry is still validated, but TypeScript keeps the exact keys and literal types, so typos are caught and autocomplete works. Unlike as, it can never force a wrong type through. I use it mostly for config objects, route tables and maps, sometimes with as const.",
      mistakes: [
        "Annotating config objects with a wide `Record<string, X>` and losing the key names.",
        "Using `as Config` where `satisfies Config` would actually check the value.",
        "Using `satisfies` on a variable that's later reassigned, expecting the wider type.",
        "Trap: 'Does `satisfies` exist at runtime?' No, like all type syntax it's removed when compiling.",
      ],
      takeaway: 'Use `satisfies` to validate constant objects while keeping their precise inferred types.',
    },

    {
      id: 'declaration-files',
      title: 'Declaration files and @types',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: '`.d.ts` files describe the types of JavaScript code; `@types/*` packages provide them for libraries; module augmentation adds to existing types.',
      what: [
        "A **declaration file** (`.d.ts`) contains only types, no runtime code. It tells TypeScript what a JavaScript module exports, or what globals exist.",
        "Many libraries ship their own types (zod, Mongoose, Prisma). For libraries that don't, the community publishes types on DefinitelyTyped, installed as `@types/<name>` (for example `@types/express`, `@types/node`). If no types exist, you write a small `declare module 'name'` yourself.",
      ],
      deeper: [
        "**Module augmentation** adds members to existing types. The everyday case is typing `req.user` in Express: you merge a `user` property into the `Request` interface via `declare global { namespace Express { interface Request { ... } } }`. It works because interfaces merge. The file must be a module (have an `import` or `export {}`) for `declare global` to be allowed, and it must be included by your `tsconfig`.",
        "`declare module 'x';` with no body makes the whole module `any`, a quick escape hatch while migrating. Better to type just the functions you use.",
        "With `declaration: true`, `tsc` generates `.d.ts` files from your own code, which is how you publish a typed internal package. `skipLibCheck: true` skips type-checking all `.d.ts` files in `node_modules`, which speeds builds and avoids errors from conflicting library types.",
      ],
      why: "Every Node and React project depends on untyped or separately typed packages, and every Express app needs `req.user` typed. Knowing how declaration files work is how you fix 'Could not find a declaration file for module' and 'Property user does not exist on type Request'.",
      analogy: "A `.d.ts` file is the instruction leaflet for an appliance that came without one: it doesn't change the appliance, it just tells you which buttons exist and what they do.",
      code: {
        lang: 'ts',
        title: 'Typing an untyped package and adding req.user',
        source: `// types/legacy-pdf.d.ts
declare module 'legacy-pdf' {
  export interface PdfOptions {
    pageSize?: 'A4' | 'Letter';
    margin?: number;
  }
  export function render(html: string, options?: PdfOptions): Promise<Buffer>;
}

// types/express.d.ts
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; tenantId: string; role: 'admin' | 'recruiter' | 'viewer' };
    }
  }
}
export {}; // keep this line: it makes this file a module so 'declare global' is allowed

// src/routes/offer.ts: both are now fully typed
import { render } from 'legacy-pdf';
import type { Request, Response } from 'express';

export async function download(req: Request, res: Response) {
  const tenantId = req.user?.tenantId;        // typed thanks to the augmentation
  if (!tenantId) return res.sendStatus(401);
  const pdf = await render('<h1>Offer</h1>', { pageSize: 'A4' }); // typed: Promise<Buffer>
  res.type('application/pdf').send(pdf);
}`,
      },
      output: "TypeScript now knows `render` returns `Promise<Buffer>` and accepts only valid options, and `req.user` is typed as an optional object with `tenantId`. Without these files you'd get 'Could not find a declaration file for module legacy-pdf' and 'Property user does not exist on type Request'.",
      questions: [
        { q: 'What is a `.d.ts` file?', a: 'A file containing only type declarations, no runtime code. It describes the shape of JavaScript modules or globals so TypeScript can type-check code that uses them.' },
        { q: 'What are `@types` packages?', a: 'Community-maintained type declarations from DefinitelyTyped for libraries that don\'t ship their own types, like `@types/express` or `@types/node`. They\'re dev dependencies.' },
        { q: 'How do you add `user` to Express\'s `Request` type?', a: 'Module augmentation: in a `.d.ts` file, `declare global { namespace Express { interface Request { user?: AuthUser } } }`, with `export {}` so the file is a module, and make sure tsconfig includes it.' },
        { q: 'What does `skipLibCheck` do?', a: 'It skips type-checking declaration files, mainly those in `node_modules`. Builds are faster and you avoid errors from mismatched library types, at the cost of not catching errors inside them.' },
      ],
      answer30: "Declaration files, .d.ts, contain only types and describe JavaScript code to the compiler. Libraries either ship their own, or the community provides them as @types packages from DefinitelyTyped. For an untyped package I write a small declare module with just the functions I use. And I use module augmentation for things like req.user in Express: interfaces merge, so I add a user property to the Express Request interface inside declare global, in a file that's a module and included by tsconfig.",
      mistakes: [
        "Writing the augmentation file but not including it in `tsconfig`, so it has no effect.",
        "Forgetting `export {}`, so `declare global` errors because the file isn't a module.",
        "Using `declare module 'x';` permanently, making the whole package `any`.",
        "Trap: 'Why do types and runtime disagree?' The `@types` version may not match the installed library version; keep them in step.",
      ],
      takeaway: '.d.ts files describe JS to TypeScript; use @types or write your own, and augment interfaces like Express Request.',
    },

    {
      id: 'tsconfig-essentials',
      title: 'tsconfig essentials',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Turn on `strict`, pick `module`/`moduleResolution` to match how the code runs (nodenext for Node, bundler for Vite), and know what each common flag does.',
      what: [
        "`tsconfig.json` tells the compiler which files to include and how to check and emit them. The settings that matter most in interviews: `strict`, `target`, `module` and `moduleResolution`, `outDir`/`rootDir`, `noEmit`, `esModuleInterop`, `skipLibCheck`, `jsx`, and `allowJs`.",
        "`strict: true` turns on a family of checks, the most important being `noImplicitAny` (no silent `any`) and `strictNullChecks` (`null` and `undefined` must be handled). New projects should always start strict.",
      ],
      deeper: [
        "Match module settings to the runtime. **Node** backends: `module: \"nodenext\"` (which implies the matching resolution) so TypeScript follows Node's real ESM/CommonJS rules, including requiring `.js` extensions in relative ESM imports. **Vite/webpack** frontends: `module: \"esnext\"` with `moduleResolution: \"bundler\"` and `noEmit: true`, because the bundler does the transpiling and TypeScript only checks.",
        "Extra safety flags worth knowing: `noUncheckedIndexedAccess` (array and record lookups may be `undefined`), `exactOptionalPropertyTypes`, `noImplicitOverride`, `noFallthroughCasesInSwitch`. `isolatedModules` and `verbatimModuleSyntax` make sure each file can be compiled alone by esbuild/SWC, and force `import type` for type-only imports.",
        "`target` sets which JavaScript syntax is emitted (and default `lib`). `lib` sets which built-in APIs exist (`dom` for browsers). `types: [\"node\"]` limits which global `@types` are loaded. `paths` gives import aliases, but the runtime or bundler must understand them too.",
      ],
      why: "Most 'it compiles but breaks at runtime' and 'works in the editor but not in the build' problems are config problems. Interviewers ask about `strict` and module resolution to see whether you've set up real projects or only used templates.",
      analogy: "tsconfig is the settings page of a spell-checker: which language (target), which dictionary (lib, types), how strict to be, and which documents to check.",
      code: [
        {
          lang: 'json',
          title: 'Node + Express backend (package.json has "type": "module")',
          source: `{
  "compilerOptions": {
    "target": "es2023",
    "module": "nodenext",           // follow Node's real ESM/CJS rules
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,                 // noImplicitAny, strictNullChecks, ...
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "esModuleInterop": true,        // import express from 'express' works with CJS packages
    "skipLibCheck": true,
    "sourceMap": true,              // readable stack traces in production
    "types": ["node"],
    "verbatimModuleSyntax": true,   // forces 'import type' for type-only imports
    "isolatedModules": true
  },
  "include": ["src"]
}`,
        },
        {
          lang: 'json',
          title: 'React + Vite frontend (the bundler compiles, tsc only checks)',
          source: `{
  "compilerOptions": {
    "target": "es2022",
    "lib": ["es2022", "dom", "dom.iterable"],
    "module": "esnext",
    "moduleResolution": "bundler",  // resolve imports the way Vite does
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,                 // Vite/esbuild produce the JS
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}`,
        },
      ],
      output: "Both configs type-check cleanly with TypeScript 5.9 and 7.0. The backend compiles `src` to `dist` following Node's module rules; the frontend config emits nothing, and `tsc --noEmit` (or `tsc -b`) runs in CI as the type check while Vite builds the bundle.",
      questions: [
        { q: 'What does `strict: true` enable?', a: 'A group of checks including `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `useUnknownInCatchVariables`, `alwaysStrict` and `noImplicitThis`.' },
        { q: 'Which `moduleResolution` should a Node backend use vs a Vite app?', a: 'A Node backend should use `nodenext` (set via `module: nodenext`) so TS follows Node\'s real ESM/CommonJS rules. A Vite app uses `bundler`, which matches how bundlers resolve imports without needing file extensions.' },
        { q: 'What does `noUncheckedIndexedAccess` do?', a: 'It makes indexed access like `arr[i]` or `record[key]` return `T | undefined`, forcing you to handle missing elements. It catches real bugs but adds some friction.' },
        { q: 'What does `esModuleInterop` do?', a: 'It lets you default-import CommonJS modules (`import express from \'express\'`) the way Node and bundlers actually do, by emitting small interop helpers.' },
        { q: 'Why `noEmit` in a Vite project?', a: 'Vite (esbuild/Rollup) already transpiles TypeScript by stripping types without checking them, so tsc is only used as a type checker in CI or the editor.' },
      ],
      answer30: "I always start with strict on, mainly for noImplicitAny and strictNullChecks, and often add noUncheckedIndexedAccess. Module settings must match the runtime: for a Node backend I use module nodenext so TypeScript follows Node's real ESM and CommonJS rules; for a Vite frontend I use moduleResolution bundler with noEmit, because Vite compiles and tsc only type-checks in CI. I also set isolatedModules or verbatimModuleSyntax so single-file compilers work, and skipLibCheck for speed.",
      mistakes: [
        "Turning `strict` off to make a migration easier and never turning it back on.",
        "Using `paths` aliases that the runtime or bundler doesn't understand, so the build passes and the app fails to start.",
        "Thinking Vite or tsx type-check your code; they only strip types.",
        "Trap: 'Why does Node say it can't find `./utils` in compiled ESM?' Node ESM needs file extensions: write `import './utils.js'` in the TS source with `nodenext`.",
      ],
      note: "Version note (verified with tsc 7.0.2, October 2026): TypeScript 6.0 (March 2026) prepared for the native Go-based TypeScript 7.0 (July 2026). In 7.0 `strict` is on by default, and old options are removed: `baseUrl`, `moduleResolution: node`/`node10`, `target: es5`, and `esModuleInterop: false`. Older guides still use these, so mention them only as legacy.",
      takeaway: 'strict always; nodenext for Node, bundler + noEmit for Vite; know what isolatedModules and skipLibCheck do.',
    },

    {
      id: 'typescript-with-react',
      title: 'TypeScript with React',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Type props with a type or interface, events with React\'s event types, state with generics when it starts empty, and write generic components for lists and tables.',
      what: [
        "In React with TypeScript you type a component's **props** like any function parameter: `function Card({ title }: { title: string })` or with a named `type CardProps`. `children` is typed as `ReactNode`.",
        "**State** is usually inferred from the initial value (`useState('')` is a string). When it starts empty, give the type: `useState<User | null>(null)`. **Refs** to DOM elements are `useRef<HTMLInputElement>(null)`. **Events** use React's types, like `ChangeEvent<HTMLInputElement>` and `FormEvent<HTMLFormElement>`.",
      ],
      deeper: [
        "To accept all native props of an element (onClick, disabled, aria-*), extend `ComponentProps<'button'>` and spread the rest. That makes reusable UI components feel like real HTML elements.",
        "**Generic components** (`function List<T>(props: ListProps<T>)`) let the item type flow from the `items` prop into callbacks like `renderItem`, so tables, selects and lists stay fully typed without `any`.",
        "`React.FC` is optional and no longer recommended by most teams; plain functions with typed props are simpler. In React 19, `ref` is a normal prop for function components, so `forwardRef` is no longer needed in new code. For context, type the value and handle the 'no provider' case (`createContext<AuthState | null>(null)` plus a custom hook that throws if null). Model async UI state as a discriminated union.",
      ],
      why: "Most frontend TypeScript interview questions are about this: typing props, children, events, state and reusable components. It's also where `any` creeps in most often.",
      analogy: "Typed props are the labelled ports on the back of a TV: HDMI here, power there. Plug the wrong cable in and it won't fit, before you ever switch it on.",
      code: {
        lang: 'tsx',
        source: `import { useState, useRef, type ReactNode, type ChangeEvent, type FormEvent, type ComponentProps } from 'react';

// 1) Props: a type for the inputs; extend native button props
type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'ghost';
};
export function Button({ variant = 'primary', className = '', ...rest }: ButtonProps) {
  return <button className={\`btn btn-\${variant} \${className}\`} {...rest} />;
}

// 2) children
type CardProps = { title: string; children: ReactNode };
export function Card({ title, children }: CardProps) {
  return <section><h2>{title}</h2>{children}</section>;
}

// 3) State, refs and events
type User = { id: string; name: string };
export function SearchForm({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('');                 // inferred: string
  const [user, setUser] = useState<User | null>(null);    // explicit: starts as null
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSearch(query);
    inputRef.current?.focus();
    setUser({ id: 'u1', name: query });
  }
  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} value={query} onChange={handleChange} />
      <Button type="submit" disabled={!query}>Search</Button>
      {user && <p>Last search by {user.name}</p>}
    </form>
  );
}

// 4) Generic component: the item type flows from the 'items' prop
type ListProps<T> = {
  items: T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
};
export function List<T>({ items, getKey, renderItem }: ListProps<T>) {
  return <ul>{items.map((item) => <li key={getKey(item)}>{renderItem(item)}</li>)}</ul>;
}

export function Jobs() {
  const jobs = [{ id: 'j1', title: 'SDE', openings: 2 }];
  return (
    <List
      items={jobs}
      getKey={(job) => job.id}
      renderItem={(job) => \`\${job.title} (\${job.openings})\`} // job is fully typed
    />
  );
}`,
      },
      output: "Everything compiles under `strict`. In `Jobs`, `job` inside `getKey` and `renderItem` is typed as `{ id: string; title: string; openings: number }` with no annotations, because `T` was inferred from `items`. Using a property that doesn't exist, like `job.salary`, would be a compile error.",
      questions: [
        { q: 'How do you type `children`?', a: 'As `ReactNode`, which covers elements, strings, numbers, arrays, fragments, null and undefined. Use `ReactElement` only if you truly require a single element.' },
        { q: 'How do you type an input\'s onChange handler?', a: '`(e: ChangeEvent<HTMLInputElement>) => void`. Inline handlers like `onChange={(e) => ...}` get the type inferred automatically.' },
        { q: 'When do you pass a type to useState?', a: 'When the initial value doesn\'t describe all future values, like `useState<User | null>(null)` or `useState<string[]>([])`. Otherwise inference from the initial value is enough.' },
        { q: 'Should you use `React.FC`?', a: 'It\'s optional. Most teams now type props directly on a plain function, which is simpler and handles generics better. Older `React.FC` also implicitly added `children`, which was removed in React 18 types.' },
        { q: 'How do you make a component accept all native button props?', a: 'Type props as `ComponentProps<\'button\'> & { variant?: ... }` and spread the rest onto the `<button>`. Callers then get onClick, disabled, type and aria attributes for free.' },
      ],
      answer30: "In React I type props as a plain type on the function parameter, with children as ReactNode. State is inferred from the initial value, and I pass a generic when it starts empty, like useState<User | null>(null). Refs are useRef<HTMLInputElement>(null), and events use ChangeEvent or FormEvent with the element type. For reusable UI I extend ComponentProps<'button'> so components accept native props, and I write generic components like List<T> so the item type flows into render callbacks.",
      mistakes: [
        "Typing event handlers as `any`.",
        "`useState([])` without a type, which infers `never[]` and blocks adding items.",
        "Using `useRef<HTMLInputElement>()` without `null` and fighting the types.",
        "Trap: 'Why is `user.name` an error after `useState(null)`?' The state was inferred as `null` only. Use `useState<User | null>(null)` and check for null before use.",
      ],
      takeaway: 'Type props, children as ReactNode, events with React event types, empty state with a generic, and use generic components.',
    },

    {
      id: 'typescript-with-express-node',
      title: 'TypeScript with Express and Node',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Type params, body, query and response with `Request<P, ResBody, ReqBody, Query>`, augment `req.user`, and remember request data is unvalidated at runtime.',
      what: [
        "Express handlers receive `Request` and `Response` objects from `@types/express`. `Request` takes generic parameters in this order: `Request<Params, ResBody, ReqBody, Query>`. `Response<Body>` types what you send.",
        "Route params and query values arrive as **strings** (or arrays of strings for repeated query keys), so a `limit` query must be converted to a number. Custom fields like `req.user` are added with module augmentation.",
      ],
      deeper: [
        "The big trap: typing `req.body` as `CreateJobBody` only tells the compiler what to assume. Nothing checks it. A client can send anything, so validate the body with a schema (zod, for example) in middleware and only then treat it as typed.",
        "Error-handling middleware has four parameters `(err, req, res, next)`, and `err` should be typed `unknown` and narrowed. In Express 5, a rejected promise from an async handler is passed to `next(err)` automatically; in Express 4 you needed a wrapper or `express-async-errors`.",
        "Layering helps types: controllers parse and validate HTTP input, services take typed domain objects, repositories return typed documents. Mongoose models can be typed from the schema (`InferSchemaType<typeof schema>`) or with an explicit interface. Run in development with `tsx watch`, build with `tsc`, and run the compiled JavaScript in production.",
      ],
      why: "Most of your daily work is typed Express and Node code. Interviewers want to see that you type the request properly, keep `req.user` typed, and know that types don't validate input.",
      analogy: "Typing `req.body` without validation is like labelling a box 'glasses' because that's what you ordered. The label helps you plan, but you still have to open it and check before putting it on the shelf.",
      code: {
        lang: 'ts',
        source: `import express, { type Request, type Response, type NextFunction } from 'express';

interface Job { id: string; tenantId: string; title: string; openings: number }
type CreateJobBody = Pick<Job, 'title' | 'openings'>;
type JobParams = { id: string };
type ListQuery = { status?: string; limit?: string }; // query values arrive as strings

const jobs = new Map<string, Job>();
const app = express();
app.use(express.json());

// Request<Params, ResBody, ReqBody, Query>
app.get('/jobs/:id', (req: Request<JobParams>, res: Response<Job | { error: string }>) => {
  const job = jobs.get(req.params.id);            // req.params.id: string
  if (!job) return res.status(404).json({ error: 'Not found' });
  res.json(job);                                  // must match Response<Job | ...>
});

app.get('/jobs', (req: Request<{}, Job[], unknown, ListQuery>, res: Response<Job[]>) => {
  const limit = Number(req.query.limit ?? 20);    // convert: it's a string
  res.json([...jobs.values()].slice(0, limit));
});

app.post('/jobs', async (req: Request<{}, Job, CreateJobBody>, res: Response<Job>) => {
  // The type says CreateJobBody, but NOTHING checked it at runtime. Validate (see zod topic).
  const job: Job = { id: crypto.randomUUID(), tenantId: req.user!.tenantId, ...req.body };
  jobs.set(job.id, job);
  res.status(201).json(job);
});

// Error handler: 4 arguments; errors are 'unknown' until you narrow them
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = err instanceof Error ? err.message : 'Unknown error';
  res.status(500).json({ error: message });
});

export default app;`,
      },
      output: "Compiles under `strict` with `@types/express` 5 and the `req.user` augmentation from the declaration-files topic. `req.params.id` is a string, `req.query.limit` is `string | undefined` and is converted to a number, and `res.json(...)` must match the declared response type. The POST body is typed but not yet validated.",
      questions: [
        { q: 'What are the generic parameters of Express\'s `Request`?', a: '`Request<Params, ResBody, ReqBody, Query>`: route params, response body, request body and query string types, in that order.' },
        { q: 'Does typing `req.body` validate it?', a: 'No. It only changes what the compiler assumes. You must validate at runtime, for example with a zod schema in middleware, and derive the type from that schema.' },
        { q: 'How do you type `req.user` set by auth middleware?', a: 'Augment Express\'s `Request` interface in a `.d.ts` file with `declare global { namespace Express { interface Request { user?: AuthUser } } }`.' },
        { q: 'How do you type an error-handling middleware?', a: 'With four parameters `(err: unknown, req: Request, res: Response, next: NextFunction)`, then narrow `err`, for example with `instanceof Error` or your own `AppError` class.' },
        { q: 'How do you run a TypeScript Node app in development and production?', a: 'In development a runner like `tsx watch src/index.ts`. In production compile with `tsc` to JavaScript and run `node dist/index.js`, with source maps for readable stack traces.' },
      ],
      answer30: "In Express I type handlers with Request<Params, ResBody, ReqBody, Query> and Response<Body>, remembering params and query values are strings. I add req.user once through module augmentation. The key point is that typing req.body doesn't validate it, so I validate with a zod schema in middleware and infer the type from it. Error middleware takes err as unknown and narrows it. Express 5 forwards rejected async handlers to the error middleware. I develop with tsx and ship compiled JS.",
      mistakes: [
        "Trusting `req.body as CreateJobBody` without validation.",
        "Forgetting that `req.query.limit` is a string, then comparing it to a number.",
        "Using `req: any` to make augmentation errors go away.",
        "Trap: 'Why is `req.user` possibly undefined in a protected route?' The type can't know your auth middleware ran. Narrow it, or create a typed `AuthedRequest` for routes behind auth.",
      ],
      note: "On your resume: your Octagnt and Skillkeepr APIs are Node + Express + TypeScript, and `req.user` carries the tenant and role from the verified JWT (see the projects topics on multi-tenant isolation and JWT cookie auth).",
      takeaway: 'Type Request generics and req.user, convert string params, and validate bodies at runtime because types don\'t.',
    },

    {
      id: 'type-safe-api-contracts-zod',
      title: 'Type-safe API contracts with zod',
      level: 'advanced',
      priority: 'must',
      frequency: 'common',
      summary: 'Write one runtime schema, validate untrusted data with it, and derive the TypeScript type with `z.infer`, so runtime checks and types can never disagree.',
      what: [
        "TypeScript types vanish at runtime, so they can't check request bodies, environment variables or third-party API responses. **zod** lets you write a schema that exists at runtime, validates data, and gives you the matching TypeScript type with `z.infer<typeof Schema>`.",
        "`Schema.parse(data)` returns typed, cleaned data or throws. `Schema.safeParse(data)` returns `{ success: true, data }` or `{ success: false, error }` so you can answer with a 400 instead of throwing.",
      ],
      deeper: [
        "One schema, many uses: Express middleware validates the body; the controller gets `z.infer` typed data; the same schema (or one derived with `.extend`, `.pick`, `.partial`) can live in a shared package used by the React frontend for form validation and for parsing API responses. If the API changes shape, the frontend fails loudly at the boundary instead of rendering `undefined`.",
        "`z.input` vs `z.infer` (`z.output`): with defaults and transforms they differ. The input type has `experienceYears` optional; the output type always has it, because the default was applied.",
        "Validate environment variables at startup with a schema too, so a missing `DATABASE_URL` crashes on boot with a clear message, not later in a request. Alternatives to zod: Valibot, ArkType, TypeBox (JSON Schema based, used by Fastify), and contract tools like tRPC, ts-rest or OpenAPI code generation for end-to-end typed clients.",
      ],
      why: "It closes the biggest gap in TypeScript: data crossing a boundary. It's also the cleanest answer to 'how do you keep frontend and backend types in sync?', which comes up in nearly every full-stack interview.",
      analogy: "The schema is a security scanner at the airport that also prints your boarding pass. Everything that goes through is checked, and the pass (the type) is printed from what was actually scanned, so the two can never disagree.",
      code: [
        {
          lang: 'ts',
          title: 'candidate.schema.ts: one schema, validated and inferred (zod 4)',
          source: `import { z } from 'zod';

// ONE source of truth: the schema. The TS type is derived from it.
export const CreateCandidateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email(),
  experienceYears: z.number().int().min(0).default(0),
  source: z.enum(['upload', 'ats', 'referral']),
});

export type CreateCandidateInput = z.input<typeof CreateCandidateSchema>; // what clients send
export type CreateCandidate = z.infer<typeof CreateCandidateSchema>;      // after parsing (defaults applied)

// Validate untrusted data at the boundary
const good = CreateCandidateSchema.safeParse({ name: ' Asha ', email: 'asha@x.com', source: 'ats' });
if (good.success) {
  const c: CreateCandidate = good.data; // fully typed, experienceYears filled in
  console.log(c);
}

const bad = CreateCandidateSchema.safeParse({ name: '', email: 'nope', source: 'linkedin' });
if (!bad.success) {
  console.log(bad.error.issues.map((i) => \`\${i.path.join('.')}: \${i.message}\`));
}`,
        },
        {
          lang: 'ts',
          title: 'Using the same schema in Express and in the frontend',
          source: `import { z } from 'zod';
import express, { type Request, type Response, type NextFunction } from 'express';
import { CreateCandidateSchema, type CreateCandidate } from './candidate.schema.js';

// Generic middleware: validates req.body and replaces it with the parsed value
function validateBody<S extends z.ZodType>(schema: S) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid body', issues: result.error.issues });
    }
    req.body = result.data;
    next();
  };
}

const app = express();
app.use(express.json());

app.post(
  '/candidates',
  validateBody(CreateCandidateSchema),
  (req: Request<{}, unknown, CreateCandidate>, res: Response) => {
    // req.body has been checked at runtime AND is typed at compile time
    res.status(201).json({ ok: true, name: req.body.name });
  }
);

// Frontend: same schema validates the response shape, no hand-written interface
const CandidateResponse = CreateCandidateSchema.extend({ id: z.string() });
export async function fetchCandidate(id: string) {
  const res = await fetch(\`/api/candidates/\${id}\`);
  return CandidateResponse.parse(await res.json()); // typed, and throws if the API drifted
}`,
        },
      ],
      output: "The first block prints the cleaned candidate `{ name: 'Asha', email: 'asha@x.com', experienceYears: 0, source: 'ats' }` (name trimmed, default filled in), then three error messages: `name: Too small: expected string to have >=1 characters`, `email: Invalid email address`, and `source: Invalid option: expected one of \"upload\"|\"ats\"|\"referral\"`. In Express, invalid bodies get a 400 with those issues before the handler runs.",
      questions: [
        { q: 'Why do you need runtime validation if you use TypeScript?', a: 'TypeScript types are erased at compile time and can\'t see data from outside the program. Request bodies, env variables and external API responses must be checked at runtime.' },
        { q: 'What does `z.infer` do?', a: 'It derives a TypeScript type from a zod schema, so the schema is the single source of truth and the type can never drift from what is validated.' },
        { q: '`parse` vs `safeParse`?', a: '`parse` returns the data or throws a ZodError. `safeParse` never throws; it returns a result object with `success` and either `data` or `error`, which suits returning a 400 response.' },
        { q: 'How do you keep frontend and backend types in sync?', a: 'Share schemas or generated types from one source: a shared package with zod schemas, tRPC or ts-rest, or OpenAPI with code generation. Validate at both edges so drift fails loudly.' },
        { q: 'What is the difference between `z.input` and `z.infer`?', a: '`z.input` is the shape before parsing; `z.infer` (same as `z.output`) is after defaults and transforms run. With a default, the field is optional in the input type but always present in the output type.' },
      ],
      answer30: "TypeScript types disappear at runtime, so anything crossing a boundary, like request bodies, env vars or third-party responses, needs runtime validation. I write a zod schema once, validate with safeParse in Express middleware and return a 400 with the issues, and derive the type with z.infer, so the type and the validation can never disagree. The same schema can live in a shared package, so the React app validates forms and API responses with it too, keeping frontend and backend in sync.",
      mistakes: [
        "Writing an interface and a separate validation schema by hand, which drift apart.",
        "Validating the body but then using the original `req.body` instead of the parsed data (losing trims, defaults and stripped unknown keys).",
        "Calling `parse` in a handler without catching the error, turning bad input into a 500.",
        "Trap: 'Does zod keep unknown keys?' By default `z.object` strips them from the output. Use `z.strictObject` to reject them or `z.looseObject` to keep them.",
      ],
      note: "Snippets use zod 4 (verified with 4.6). In zod 4, string formats moved to top-level helpers such as `z.email()`; the older `z.string().email()` still works but is deprecated. Error message wording differs between versions.",
      takeaway: 'One zod schema per boundary: validate at runtime with safeParse, derive the type with z.infer, share it across the stack.',
    },

    {
      id: 'migrating-js-to-ts',
      title: 'Migrating JavaScript to TypeScript incrementally',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Let JS and TS live together with `allowJs`, convert shared code first, tighten strictness step by step, and never mix migration with behaviour changes.',
      what: [
        "An incremental migration converts a codebase file by file while the app keeps shipping. With `allowJs: true`, `.js` and `.ts` files compile together, so you never need a big-bang rewrite.",
        "A common order: add tsconfig and the build step, convert shared foundations first (types for models, API payloads, utilities), then convert feature modules as you touch them, and finally tighten the compiler settings until everything is `strict`.",
      ],
      deeper: [
        "A gentle first step is `// @ts-check` with JSDoc types in plain `.js` files: you get type checking without renaming anything. Renaming to `.ts` then mostly means turning JSDoc into real annotations.",
        "Tighten in stages: start with `noImplicitAny` (so new `any` is visible), then `strictNullChecks`, which usually produces the most errors and finds real bugs, then full `strict`. Track the number of errors or `any`s and keep it going down. Use `// @ts-expect-error` with a comment rather than `any` for known problems, because it fails once the problem is fixed.",
        "Rules that keep it safe: migration pull requests change types only, never behaviour; add runtime validation at boundaries (request bodies, external APIs), since types alone don't protect those; and keep tests running the whole time. Tools like `ts-migrate` can do a first mechanical pass, but review the `any`s it leaves.",
      ],
      why: "Most companies with an existing Node or React codebase either are mid-migration or will be. Being able to describe a safe, step-by-step plan, ideally from experience, is a strong signal.",
      analogy: "Repainting a busy road one lane at a time. Traffic keeps flowing, each lane is finished properly before moving on, and you don't redesign the junctions while you're painting.",
      code: [
        {
          lang: 'js',
          title: 'Step 1: type-check a JS file with JSDoc, no rename yet',
          source: `// @ts-check
// Step 1 in a JS file: JSDoc types + @ts-check, no renaming yet

/** @typedef {{ id: string, title: string, openings: number }} Job */

/**
 * @param {Job[]} jobs
 * @param {number} minOpenings
 * @returns {string[]}
 */
export function openTitles(jobs, minOpenings) {
  return jobs.filter((j) => j.openings >= minOpenings).map((j) => j.title);
}

openTitles([{ id: 'j1', title: 'SDE', openings: 2 }], 1);
// openTitles([{ id: 'j1', title: 'SDE' }], '1');  // error: Property 'openings' is missing`,
        },
        {
          lang: 'text',
          title: 'A migration plan you can say out loud',
          source: `1. Add tsconfig: allowJs true, checkJs false, noImplicitAny true, strict false.
   Add "tsc --noEmit" to CI so the build fails on new type errors.
2. Convert foundations first: shared types for models, API payloads, utils.
   Every later file benefits from them.
3. Convert modules when you touch them; one module per PR; types only, no behaviour changes.
4. Add runtime validation (zod) at boundaries: request bodies, env, external APIs.
5. Turn on strictNullChecks; fix module by module (expect real bugs here).
6. Turn on full strict; replace remaining any with unknown + narrowing.
7. Remove allowJs once no .js files are left.`,
        },
      ],
      output: "With `// @ts-check`, the editor and `tsc --allowJs --checkJs` check the JSDoc-typed function: the commented-out call would fail with `Property 'openings' is missing`, without renaming the file. The plan keeps features shipping while strictness increases step by step.",
      questions: [
        { q: 'How would you migrate a large JS codebase to TypeScript?', a: 'Incrementally: enable `allowJs`, add `tsc --noEmit` to CI, convert shared types and utilities first, then modules as they\'re touched, one per PR with no behaviour changes, and tighten strict flags step by step until full `strict`.' },
        { q: 'Which strict flag is the hardest to turn on, and why?', a: 'Usually `strictNullChecks`, because it makes every possibly null or undefined value explicit. It produces the most errors, but many of them are real bugs.' },
        { q: '`@ts-ignore` vs `@ts-expect-error`?', a: '`@ts-ignore` silences the next line forever. `@ts-expect-error` silences it but errors when there is no longer an error, so leftover suppressions get cleaned up.' },
        { q: 'How do you stop `any` from spreading during a migration?', a: 'Turn on `noImplicitAny` early, use `unknown` at boundaries, add lint rules like `no-explicit-any`, and track the count of anys and suppressions so it only goes down.' },
      ],
      answer30: "I'd migrate incrementally. First add a tsconfig with allowJs and a tsc --noEmit step in CI. Then convert the shared foundations, like model types, API payload types and utilities, because every later file benefits. After that, convert modules as we touch them, one per PR, with types only and no behaviour changes. I'd start with noImplicitAny, then strictNullChecks module by module, then full strict, and add zod validation at the boundaries, since types don't check runtime data.",
      mistakes: [
        "A big-bang rewrite that freezes feature work for weeks.",
        "Mixing behaviour changes into migration PRs, so regressions are hard to trace.",
        "Silencing errors with `any` and `@ts-ignore` and never coming back.",
        "Trap: 'Did the migration remove the need for tests?' No. Types catch shape errors, not wrong logic; keep the test suite running throughout.",
      ],
      note: "On your resume: you led the Skillkeepr TypeScript migration. The story, the tsconfig you used and the Node upgrade are in the projects topic typescript-migration-node-upgrade; keep both answers consistent.",
      takeaway: 'Migrate in small type-only steps: allowJs, foundations first, then tighten strictness flag by flag.',
    },
  ],
  rapidFire: [
    { q: 'Do TypeScript types exist at runtime?', a: 'No, they are erased when compiling to JavaScript.' },
    { q: '`any` vs `unknown`?', a: '`any` turns checking off; `unknown` must be narrowed before use.' },
    { q: 'What is `never` for?', a: 'Functions that never return, and exhaustiveness checks.' },
    { q: 'What can a type alias do that an interface can\'t?', a: 'Name unions, tuples, mapped and conditional types.' },
    { q: 'What can an interface do that a type alias can\'t?', a: 'Declaration merging (reopening to add fields).' },
    { q: 'Is TypeScript nominally or structurally typed?', a: 'Structurally: shapes matter, not names.' },
    { q: 'Does `value as User` check anything?', a: 'No, an assertion only changes what the compiler believes.' },
    { q: 'What is a discriminated union?', a: 'A union whose members share a literal field you can switch on.' },
    { q: 'Custom type guard return type?', a: '`value is Type`, for example `function isCat(p): p is Cat`.' },
    { q: 'What does `T extends { id: string }` mean in a generic?', a: 'A constraint: T must at least have a string `id`.' },
    { q: 'Type of a PATCH body?', a: '`Partial<Omit<Entity, \'id\'>>`.' },
    { q: 'Pick vs Omit?', a: 'Pick keeps listed keys; Omit removes them.' },
    { q: 'Resolved type of an async function?', a: '`Awaited<ReturnType<typeof fn>>`.' },
    { q: 'Union type from a const array?', a: '`(typeof ARR)[number]` with the array declared `as const`.' },
    { q: 'What does `keyof` return?', a: 'A union of an object type\'s property names.' },
    { q: 'What does `infer` do?', a: 'Captures a type inside a conditional type, like a Promise\'s value.' },
    { q: 'Enum or union of literals?', a: 'Usually a union (or `as const` object): no runtime code, works with type stripping.' },
    { q: '`satisfies` vs annotation?', a: '`satisfies` checks without widening; the annotation widens to the declared type.' },
    { q: 'Where do types for untyped npm packages come from?', a: '`@types/<name>` from DefinitelyTyped, or your own `.d.ts`.' },
    { q: 'How do you add `req.user` to Express?', a: 'Augment `Express.Request` inside `declare global` in a `.d.ts`.' },
    { q: 'moduleResolution for a Vite app?', a: '`bundler`, with `noEmit: true`.' },
    { q: 'module setting for a Node backend?', a: '`nodenext`.' },
    { q: 'Hardest strict flag to enable during a migration?', a: 'Usually `strictNullChecks`.' },
    { q: '`@ts-ignore` vs `@ts-expect-error`?', a: '`@ts-expect-error` fails when the error is gone, so it can\'t go stale.' },
    { q: 'Type for React `children`?', a: '`ReactNode`.' },
    { q: 'Get a TS type from a zod schema?', a: '`z.infer<typeof Schema>`.' },
  ],
};

export default typescript;
