// Databases stack. Topics are auto-sorted Basic -> Intermediate -> Advanced by the registry.

const databases = {
  name: 'Databases',
  intro: 'MongoDB and Mongoose first (your daily tools), then PostgreSQL, Redis and Firebase. Interviewers test data modelling, indexes and trade-offs far more than syntax.',
  topics: [
    {
      id: 'sql-vs-nosql',
      title: 'SQL vs NoSQL',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'SQL stores data in related tables with a fixed schema; NoSQL covers document, key-value, wide-column and graph stores with flexible shapes.',
      what: [
        "A SQL (relational) database like PostgreSQL or MySQL stores data in tables made of rows and columns. Every row in a table has the same columns, and tables are linked with foreign keys. You read data with SQL queries and combine tables with joins.",
        "NoSQL is an umbrella word for databases that are not relational. MongoDB stores JSON-like documents, Redis stores keys and values in memory, Cassandra stores wide rows, and Neo4j stores graphs. Each is built for a different access pattern.",
      ],
      deeper: [
        "The real difference is not 'schema vs no schema'. A document database still has a schema; it just lives in your application code (Mongoose) or in optional validators instead of being enforced by the database on every write. Relational databases enforce structure, types, foreign keys and constraints for you.",
        "Relational databases shine when data is highly connected and you need flexible queries and strong consistency across many tables (payments, inventory, accounting). Document databases shine when you read and write whole objects together, the shape changes often, or you need easy horizontal scaling. Modern systems blur the line: PostgreSQL has `JSONB` columns, and MongoDB has multi-document ACID transactions and `$lookup` joins.",
        "Scaling: SQL databases traditionally scale up (bigger machine) and add read replicas. Many NoSQL systems were designed to scale out by sharding across machines from day one. Both can do both today; it's a matter of how much work it is.",
      ],
      why: "Picking the wrong model creates pain for years: lots of joins faked in application code, or rigid tables fighting constantly changing data. Interviewers ask this to see whether you choose by access pattern instead of by habit.",
      analogy: "SQL is a filing cabinet with printed forms: every form has the same boxes, and folders reference each other by number. A document store is a set of folders where each folder holds everything about one customer, written however suits that customer.",
      code: {
        lang: 'text',
        title: 'Same data, two models',
        source: `-- Relational (PostgreSQL): two tables linked by a foreign key
users(id, name, email)
orders(id, user_id -> users.id, total, created_at)
SELECT u.name, o.total FROM users u JOIN orders o ON o.user_id = u.id;

// Document (MongoDB): one document holds the user and recent orders
{
  _id: ObjectId("..."),
  name: "Asha",
  email: "asha@example.com",
  recentOrders: [
    { orderId: 101, total: 499, createdAt: ISODate("2026-01-10") },
    { orderId: 102, total: 120, createdAt: ISODate("2026-02-02") }
  ]
}`,
      },
      output: "In the relational model, getting a user with their orders needs a join, but each fact is stored once. In the document model, one read returns everything, but if order data is also needed elsewhere it may be duplicated.",
      questions: [
        { q: 'When would you pick PostgreSQL over MongoDB?', a: 'When data is highly relational, needs strong constraints (foreign keys, unique, check), complex ad-hoc queries and reporting with joins, or multi-row transactions are central, like payments or inventory.' },
        { q: 'When would you pick MongoDB?', a: 'When you read and write whole objects together, the shape varies or evolves quickly, and you want easy horizontal scaling. Content, catalogs, user profiles and event-style data fit well.' },
        { q: 'Is MongoDB schemaless?', a: 'Not really. The database doesn\'t force a schema by default, but your application still has one. You enforce it with Mongoose schemas or MongoDB JSON Schema validators.' },
        { q: 'Does NoSQL mean no transactions?', a: 'No. MongoDB has supported multi-document ACID transactions since version 4.0 (replica sets) and 4.2 (sharded clusters). Single-document writes were always atomic.' },
      ],
      answer30: "SQL databases store data in tables with a fixed schema and relate them with foreign keys and joins, which is great for connected data, constraints and complex queries. NoSQL is a family: document stores like MongoDB, key-value like Redis, wide-column and graph. I choose by access pattern. If I mostly read and write whole objects and the shape evolves, MongoDB fits. If data is heavily related and needs strict consistency and reporting, PostgreSQL fits. Both now overlap a lot, with JSONB in Postgres and transactions in Mongo.",
      mistakes: [
        "Saying NoSQL is always faster. It's faster for the access pattern it was modelled for, and slower for others.",
        "Saying MongoDB has no schema, so there's nothing to design. Bad document design is the most common Mongo performance problem.",
        "Choosing a database because it's popular rather than by the queries you need to run.",
        "Trap: 'Can MongoDB do joins?' Yes, `$lookup` in the aggregation pipeline, but if you need it on every request your model is probably wrong.",
      ],
      takeaway: 'Choose by access pattern: relational for connected, constrained data; documents for whole-object reads and evolving shapes.',
    },

    {
      id: 'mongodb-documents-collections',
      title: 'MongoDB documents, collections and CRUD',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'A document is a BSON object with an `_id`; a collection is a group of documents; CRUD uses filters and update operators.',
      what: [
        "MongoDB stores **documents**: JSON-like objects that can hold nested objects and arrays. Documents live in **collections** (like tables), and collections live in a database.",
        "Every document has an `_id` field that is unique in its collection. If you don't provide one, MongoDB creates an `ObjectId`, a 12-byte value that includes a timestamp, so ids roughly sort by creation time.",
        "You create, read, update and delete with `insertOne`, `find`, `updateOne` and `deleteOne`. Filters are objects like `{ status: 'active' }`, and updates use operators like `$set`, `$inc` and `$push`.",
      ],
      deeper: [
        "Documents are stored as BSON (binary JSON), which adds types JSON lacks: `Date`, `ObjectId`, `Decimal128`, 64-bit integers and binary data. A single document can be at most 16 MB, which is the hard reason you can't keep pushing into an array forever.",
        "Writes to a single document are atomic, including all nested fields. That's why embedding related data in one document often removes the need for a transaction.",
        "`updateOne(filter, { name: 'x' })` without an operator is rejected by modern drivers; use `$set`. `replaceOne` is the call that swaps the whole document. `upsert: true` inserts when nothing matches, which is the standard way to make a sync job safe to re-run.",
      ],
      why: "These are the building blocks of everything else in MongoDB. Interviewers check that you know update operators, atomicity per document and the 16 MB limit before they go deeper.",
      analogy: "A collection is a drawer, and each document is a folder in it. Each folder has a unique label (`_id`) and can hold loose sheets, envelopes inside envelopes, and lists, without every folder looking the same.",
      code: {
        lang: 'js',
        title: 'Basic CRUD with the official driver',
        source: `import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URL);
const jobs = client.db('app').collection('jobs');

// Create
const { insertedId } = await jobs.insertOne({
  title: 'Backend Engineer',
  status: 'open',
  skills: ['node', 'mongodb'],
  applicants: 0,
  createdAt: new Date(),
});

// Read: filter + projection + sort + limit
const open = await jobs
  .find({ status: 'open', skills: 'node' }, { projection: { title: 1 } })
  .sort({ createdAt: -1 })
  .limit(10)
  .toArray();

// Update with operators (atomic on this one document)
await jobs.updateOne(
  { _id: insertedId },
  { $inc: { applicants: 1 }, $push: { skills: 'aws' }, $set: { updatedAt: new Date() } }
);

// Upsert: insert if missing, update if present (safe to re-run)
await jobs.updateOne(
  { externalId: 'ats-42' },
  { $set: { title: 'SDE II' }, $setOnInsert: { createdAt: new Date() } },
  { upsert: true }
);

// Delete
await jobs.deleteOne({ _id: insertedId });`,
      },
      output: "The insert returns the generated `_id`. The `find` returns up to 10 open jobs that list 'node' in their skills array, newest first, with only `_id` and `title`. The update increments the counter and appends 'aws' in one atomic write. The upsert creates the 'ats-42' job the first time and only updates its title on later runs.",
      questions: [
        { q: 'What is an ObjectId?', a: 'A 12-byte id MongoDB generates for `_id`. It contains a timestamp, a random value and a counter, so it is unique without a central counter and roughly ordered by creation time.' },
        { q: 'What is the maximum document size?', a: '16 MB per document. Unbounded arrays (like every log entry ever) eventually hit it, so such data belongs in its own collection.' },
        { q: 'Are MongoDB writes atomic?', a: 'Every write to a single document is atomic, even if it changes many nested fields. Changes across multiple documents need a transaction to be atomic together.' },
        { q: 'What does `upsert: true` do?', a: 'If the filter matches nothing, MongoDB inserts a new document built from the filter and the update. It is the standard way to make imports and syncs idempotent.' },
        { q: 'How do you query an array field?', a: '`{ skills: \'node\' }` matches documents whose array contains that value. Use `$all` for several values and `$elemMatch` when one array element must meet several conditions.' },
      ],
      answer30: "MongoDB stores BSON documents, which are JSON-like objects with extra types like Date and ObjectId, grouped into collections. Every document has a unique _id. I use insertOne, find, updateOne and deleteOne, with update operators like $set, $inc and $push. Writes to one document are atomic, which is a big reason to embed related data. Documents max out at 16 MB, so unbounded arrays go in their own collection. And I use upserts to make sync jobs safe to re-run.",
      mistakes: [
        "Passing a plain object as the update (`updateOne(f, { name })`) instead of `{ $set: { name } }`.",
        "Comparing an `_id` string to an `ObjectId`: `{ _id: '65f...' }` matches nothing; convert with `new ObjectId(id)` (Mongoose casts for you).",
        "Growing an array forever inside one document until it hits 16 MB or slows every read.",
        "Trap: 'Is `find()` returning all documents at once?' No, it returns a cursor that fetches results in batches; `toArray()` loads them all into memory.",
      ],
      takeaway: 'Documents with `_id`, update operators, atomic per document, 16 MB max.',
    },

    {
      id: 'mongodb-schema-design',
      title: 'MongoDB schema design: embed vs reference',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Embed data that is read together and bounded; reference data that is shared, large, or grows without limit.',
      what: [
        "In MongoDB you design documents around how the app reads them. The main choice for related data is: **embed** it inside the parent document, or **reference** it by storing its `_id` and keeping it in another collection.",
        "Embed when the child belongs to one parent, is read with the parent, and has a small, bounded size (an address, a few line items). Reference when the child is shared by many parents, is large, is queried on its own, or grows without limit (comments, logs, applications).",
      ],
      deeper: [
        "Think in relationship sizes. One-to-few (a user's 3 addresses): embed. One-to-many (a job's hundreds of applications): reference from the child (`application.jobId`). One-to-squillions (log events for a tenant): always reference from the child, never an array of ids in the parent.",
        "Many-to-many (candidates and skills tags) can be an array of ids on one side, or a separate collection when the relationship itself carries data (like an `applications` collection linking candidate and job with a status).",
        "Common patterns: the **extended reference** (copy a few fields like the job title into the application so lists don't need a lookup), the **subset** pattern (embed the latest 5 reviews, keep all reviews in another collection), the **computed** pattern (store a counter instead of counting every time), and the **bucket** pattern (group time-series readings into hourly documents). Duplication is fine when the copied data rarely changes and you have a plan to update it.",
      ],
      why: "Most MongoDB performance problems come from schema design, not missing hardware: documents that grow forever, or data split across so many collections that every page needs five lookups. Good design makes the common query one indexed read.",
      analogy: "Embedding is putting the receipt inside the shopping bag: you always carry them together. Referencing is a library card number: the book lives on its own shelf, many people can borrow it, and you only fetch it when you need it.",
      code: {
        lang: 'js',
        title: 'Embed the bounded, reference the unbounded',
        source: `// candidates: profile + a small, bounded list -> embed
{
  _id: ObjectId("c1"),
  tenantId: ObjectId("t1"),
  name: "Asha",
  emails: ["asha@example.com"],            // one-to-few: embedded
  address: { city: "Kochi", country: "IN" } // always read with the candidate
}

// applications: one job has many applications -> reference from the child
{
  _id: ObjectId("a1"),
  tenantId: ObjectId("t1"),
  jobId: ObjectId("j1"),
  candidateId: ObjectId("c1"),
  jobTitle: "Backend Engineer",   // extended reference: copied for list pages
  status: "shortlisted",
  createdAt: ISODate("2026-03-01")
}

// Anti-pattern: unbounded array in the parent
{
  _id: ObjectId("j1"),
  title: "Backend Engineer",
  applicationIds: [ /* grows forever, rewrites a bigger doc each time */ ]
}`,
      },
      output: "The candidate page needs one read. The job's application list is one indexed query on `applications` by `{ tenantId, jobId }`, and it already has the job title, so no lookup is needed. The job document stays small no matter how many people apply.",
      questions: [
        { q: 'When do you embed and when do you reference?', a: 'Embed when the data is owned by one parent, read together with it, and bounded in size. Reference when it is shared, large, queried on its own, or can grow without limit.' },
        { q: 'Why is an ever-growing array a problem?', a: 'The document gets bigger with every push, so every read and write moves more data, indexes on the array (multikey) get large, and eventually it hits the 16 MB document limit.' },
        { q: 'Isn\'t duplicating data bad?', a: 'Not always. Copying a few rarely-changing fields (like a job title onto applications) saves a lookup on every read. The cost is updating copies when the source changes, so only duplicate when reads far outnumber changes.' },
        { q: 'How would you model many-to-many in MongoDB?', a: 'An array of ids on one side if the list is small and has no extra data. If the link has its own data (status, dates), use a separate collection like `applications` with both ids and index it for each direction.' },
      ],
      answer30: "In MongoDB I design for the queries. I embed data that belongs to one parent, is read with it and stays bounded, like addresses. I reference data that is shared, large or unbounded, storing the parent id on the child, like applications pointing at a job. I avoid arrays that grow forever because of the 16 MB limit and write cost. I'll duplicate a few stable fields, like a job title on applications, so list pages are one query.",
      mistakes: [
        "Designing MongoDB like SQL tables and then using `$lookup` or `populate` on every request.",
        "Storing an unbounded array of child ids on the parent.",
        "Duplicating fields that change often, then forgetting to update the copies.",
        "Trap: 'What's the right schema?' There isn't one without the queries. Ask what the main read and write patterns are before answering.",
      ],
      note: "On your resume: the Octagnt schemas were multi-tenant, so every collection carries `tenantId` and indexes start with it. See the projects topic on multi-tenant isolation.",
      takeaway: 'Model for your queries: embed bounded data read together, reference shared or unbounded data from the child side.',
    },

    {
      id: 'mongoose-schemas-models',
      title: 'Mongoose schemas, models and validation',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'A Mongoose schema defines shape, types, defaults and validation; a model is the class you query with.',
      what: [
        "Mongoose is an ODM (object document mapper) for MongoDB in Node. You describe the shape of a document with a **schema**: field types, required fields, defaults, enums and validators.",
        "From a schema you create a **model** with `mongoose.model('Candidate', schema)`. The model is what you use to query (`Candidate.find()`) and create documents (`Candidate.create()`). Mongoose casts values to the right type and validates before saving.",
      ],
      deeper: [
        "Validation runs on `save()` and `create()` by default. For `updateOne` and `findOneAndUpdate`, it only runs if you pass `runValidators: true`, and even then `this` inside custom validators is the query, not the document. This gap is a classic production bug.",
        "`unique: true` is not a validator; it creates a unique index in MongoDB. If the index was never built (for example `autoIndex` off in production, or duplicates already existed), duplicates get in silently. Build indexes deliberately in migrations or at deploy time.",
        "Useful schema options: `timestamps: true` adds `createdAt` and `updatedAt`; virtuals add computed fields that aren't stored; `toJSON` transforms can hide fields like `passwordHash`; `select: false` excludes a field unless you explicitly ask for it. Since Mongoose 7, model methods return promises and no longer accept callbacks.",
      ],
      why: "MongoDB itself accepts any shape, so without a schema layer one typo (`emial`) creates bad data forever. Mongoose gives one place to define the shape, defaults and rules for the whole app.",
      analogy: "The schema is the blueprint for a house; the model is the construction company that builds houses from it and also knows where every built house is.",
      code: {
        lang: 'ts',
        title: 'Schema, model, validation',
        source: `import { Schema, model, Types } from 'mongoose';

const candidateSchema = new Schema(
  {
    tenantId: { type: Schema.Types.ObjectId, required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true },
    status: { type: String, enum: ['new', 'shortlisted', 'rejected'], default: 'new' },
    experienceYears: { type: Number, min: 0, max: 60 },
    passwordHash: { type: String, select: false }, // never returned unless asked
  },
  { timestamps: true } // adds createdAt / updatedAt
);

// Unique per tenant: this is an INDEX, not a validator
candidateSchema.index({ tenantId: 1, email: 1 }, { unique: true });

candidateSchema.virtual('isSenior').get(function () {
  return (this.experienceYears ?? 0) >= 5;
});

export const Candidate = model('Candidate', candidateSchema);

// Usage
const c = await Candidate.create({ tenantId: new Types.ObjectId(), name: ' Asha ', email: 'ASHA@x.com' });
// c.name === 'Asha', c.email === 'asha@x.com', c.status === 'new'

// Validators on updates only run when asked
await Candidate.updateOne({ _id: c._id }, { status: 'hired' }, { runValidators: true }); // throws: not in enum`,
      },
      output: "`create` trims the name, lowercases the email, fills `status` with 'new' and adds timestamps. The update to 'hired' throws a ValidationError because `runValidators: true` makes Mongoose check the enum. Without that option, the invalid status would have been saved.",
      questions: [
        { q: 'What is the difference between a schema and a model?', a: 'A schema describes the shape, types, defaults and rules. A model is compiled from a schema and bound to a collection; you use it to create and query documents.' },
        { q: 'Does validation run on `updateOne`?', a: 'Not by default. Validation runs on `save` and `create`. For update queries you must pass `runValidators: true`, and some validators behave differently because `this` is the query.' },
        { q: 'Is `unique: true` a validator?', a: 'No. It asks Mongoose to create a unique index. The database enforces it, and if the index failed to build, duplicates can still be inserted. Handle duplicate key error code 11000.' },
        { q: 'Why use Mongoose instead of the native driver?', a: 'Schemas, casting, validation, middleware, populate and a cleaner model API. The native driver is lighter and faster for bulk or very hot paths, and you can mix both.' },
      ],
      answer30: "Mongoose adds a schema layer on top of MongoDB. The schema defines types, required fields, defaults, enums and validators, and a model built from it gives me find, create and update methods with casting and validation. Two gotchas I watch for: validators don't run on update queries unless I pass runValidators, and unique is an index, not a validator, so I handle the 11000 duplicate key error. I also use timestamps and select: false for secrets.",
      mistakes: [
        "Assuming validation protects `updateOne` and `findOneAndUpdate` by default.",
        "Relying on `unique: true` without checking the index really exists.",
        "Returning Mongoose documents straight to the client and leaking fields like `passwordHash`.",
        "Trap: 'What does the `11000` error mean?' A duplicate key error from a unique index. Map it to a 409 Conflict, not a 500.",
      ],
      takeaway: 'Schema defines shape and rules; model queries; validators skip updates unless you ask; unique is an index.',
    },

    {
      id: 'mongoose-middleware-populate-lean',
      title: 'Mongoose middleware, populate and lean',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Middleware runs hooks around saves and queries; populate fills references with extra queries; lean returns plain objects fast.',
      what: [
        "**Middleware** (hooks) are functions that run before or after an operation, like `pre('save')` to hash a password or `pre('find')` to add a filter.",
        "**populate** replaces a stored id with the referenced document, for example turning `application.candidateId` into the candidate object.",
        "**lean()** makes a query return plain JavaScript objects instead of full Mongoose documents. They are much lighter and faster, but have no `save()`, getters, virtuals or change tracking.",
      ],
      deeper: [
        "There are document middleware (`save`, `validate`, `deleteOne` on a document), where `this` is the document, and query middleware (`find`, `findOne`, `updateOne`, `findOneAndUpdate`...), where `this` is the query. `findOneAndUpdate` does NOT trigger `pre('save')`, so logic like password hashing must also be added to update hooks or kept to `save()`.",
        "`populate` is not a database join. Mongoose runs a second query with `$in` over the collected ids and stitches results in memory. That's fine for one level on a page of 20 items, but nested or wide populates on big lists are slow. For heavy cases use an aggregation with `$lookup`, or duplicate the needed fields.",
        "Use `lean()` for read-only endpoints that just serialize to JSON. Skip it when you need to modify and `save()` the document, or when you depend on virtuals and getters (there are plugins for lean virtuals).",
      ],
      why: "Hooks keep cross-cutting rules (hashing, tenant filters, audit fields) in one place. populate saves hand-written lookup code. lean is the easiest large performance win on read-heavy APIs.",
      analogy: "Middleware is a security guard at the door who checks everyone going in and out. populate is a waiter who goes back to the kitchen to fetch each side dish you named. lean is getting the food in a takeaway box: fast and simple, but no table service.",
      code: {
        lang: 'ts',
        title: 'Hooks, populate and lean',
        source: `import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  email: String,
  password: { type: String, select: false },
  tenantId: Schema.Types.ObjectId,
  deletedAt: Date,
});

// Document middleware: 'this' is the document
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password!, 12);
});

// Query middleware: 'this' is the query. Hide soft-deleted users everywhere.
userSchema.pre(/^find/, function () {
  this.where({ deletedAt: null });
});

const User = model('User', userSchema);

const applicationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  status: String,
});
const Application = model('Application', applicationSchema);

// populate: 2 queries total (applications, then users with $in)
const apps = await Application.find({ status: 'new' })
  .populate('userId', 'email') // only fetch the email field
  .lean();                      // plain objects: fast, read-only

console.log(apps[0].userId); // { _id: ..., email: 'asha@x.com' }`,
      },
      output: "Saving a user hashes the password only when it changed. Every `find`, `findOne` and `findOneAndUpdate` on users automatically excludes soft-deleted ones. The application query runs two queries, replaces each `userId` with `{ _id, email }`, and returns plain objects.",
      questions: [
        { q: 'Does `findOneAndUpdate` trigger `pre(\'save\')`?', a: 'No. Save middleware only runs on `doc.save()` and `Model.create()`. Update queries trigger query middleware like `pre(\'findOneAndUpdate\')`, so logic like hashing must be handled there too or updates must go through save.' },
        { q: 'Is populate a join?', a: 'No. Mongoose runs a separate query using `$in` on the referenced ids and merges results in application memory. For large or nested cases, `$lookup` in an aggregation or denormalizing is better.' },
        { q: 'What does `lean()` do and when shouldn\'t you use it?', a: 'It returns plain objects instead of Mongoose documents, which is faster and uses less memory. Don\'t use it when you need to call `save()`, or rely on virtuals, getters or defaults applied at hydration.' },
        { q: 'What is `this` inside Mongoose middleware?', a: 'In document middleware like `save`, it\'s the document. In query middleware like `find`, it\'s the Query object, so you modify filters with `this.where()` or `this.getFilter()`.' },
      ],
      answer30: "Mongoose middleware runs hooks around operations. Document hooks like pre save see the document, which is where I hash passwords. Query hooks like pre find see the query, which is great for automatic filters like soft delete or tenant scoping. A common bug is that findOneAndUpdate skips save hooks. populate fetches referenced documents with a second $in query, not a real join, so I keep it shallow. And I use lean on read-only endpoints for a big speed and memory win.",
      mistakes: [
        "Hashing passwords in `pre('save')` and then updating passwords with `findOneAndUpdate`, which stores plain text.",
        "Using arrow functions for hooks; `this` is then not the document or query.",
        "Deep nested populate on large lists, creating many queries and large memory use.",
        "Trap: 'Why is my virtual missing in the API response?' Either you used `lean()`, or `toJSON: { virtuals: true }` isn't set.",
      ],
      takeaway: 'Hooks centralize rules (watch save vs query hooks), populate is extra queries, lean for fast reads.',
    },

    {
      id: 'mongodb-indexes',
      title: 'MongoDB indexes, the ESR rule and explain()',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Indexes let MongoDB find documents without scanning the collection; order compound index fields Equality, Sort, Range.',
      what: [
        "An index is a sorted structure (a B-tree) that maps field values to documents, like the index at the back of a book. Without one, MongoDB does a **collection scan**: it reads every document to find matches.",
        "A **single-field** index covers one field (`{ email: 1 }`). A **compound** index covers several fields in a fixed order (`{ tenantId: 1, status: 1, createdAt: -1 }`). MongoDB always has an index on `_id`.",
        "`explain('executionStats')` shows how a query ran: whether it used an index (`IXSCAN`) or scanned everything (`COLLSCAN`), and how many keys and documents it examined.",
      ],
      deeper: [
        "A compound index can serve queries on its **prefixes**. `{ tenantId, status, createdAt }` helps queries on `tenantId`, or `tenantId + status`, or all three, but not a query on `status` alone.",
        "The **ESR rule** for ordering compound fields: **E**quality fields first (exact matches like `tenantId`, `status`), then **S**ort fields, then **R**ange fields (`$gt`, `$lt`, `$in` with many values, regex). Putting a range before the sort forces an in-memory sort, which is slow and limited in memory.",
        "Read `explain` like this: compare `nReturned` with `totalKeysExamined` and `totalDocsExamined`. Ideally all three are close. If docs examined is far bigger than returned, the index isn't selective enough. A `SORT` stage means the sort isn't using the index. A **covered query** (all filter and returned fields in the index, `_id` excluded) can skip reading documents entirely.",
        "Indexes cost something: every insert and update must update every index, and they use RAM. Other types: multikey (arrays, automatic), text, TTL (auto-delete after a time), partial (index only matching documents), unique, and 2dsphere for geo.",
      ],
      why: "Missing or badly ordered indexes are the number one cause of slow MongoDB queries. A query that takes seconds on a collection scan often drops to milliseconds with the right compound index.",
      analogy: "A phone book sorted by city, then surname, then first name. Finding 'Kochi, Kurup' is instant. Finding everyone named 'Sandeep' in any city means reading the whole book, because first name isn't at the front of the sort order.",
      code: [
        {
          lang: 'js',
          title: 'ESR in practice',
          source: `// Query: open jobs for one tenant, created in the last 30 days, newest first
db.jobs.find({
  tenantId: ObjectId("t1"),          // Equality
  status: "open",                    // Equality
  createdAt: { $gte: ISODate("2026-09-01") } // Range
}).sort({ createdAt: -1 })           // Sort

// ESR: Equality (tenantId, status) -> Sort/Range (createdAt)
db.jobs.createIndex({ tenantId: 1, status: 1, createdAt: -1 })

// Check it
db.jobs.find({ tenantId: ObjectId("t1"), status: "open" })
  .sort({ createdAt: -1 })
  .explain("executionStats")`,
        },
        {
          lang: 'json',
          title: 'What to look for in explain output (trimmed)',
          source: `{
  "queryPlanner": {
    "winningPlan": {
      "stage": "FETCH",
      "inputStage": { "stage": "IXSCAN", "indexName": "tenantId_1_status_1_createdAt_-1" }
    }
  },
  "executionStats": {
    "nReturned": 50,
    "totalKeysExamined": 50,
    "totalDocsExamined": 50,
    "executionTimeMillis": 2
  }
}`,
        },
      ],
      output: "The winning plan is `IXSCAN` on the compound index, with no separate `SORT` stage, and keys examined equals documents returned. Without the index the plan would show `COLLSCAN` and `totalDocsExamined` equal to the whole collection size.",
      questions: [
        { q: 'What is the ESR rule?', a: 'When building a compound index, put Equality-match fields first, then Sort fields, then Range fields. This lets MongoDB jump to the exact match, read in sorted order, and avoid an in-memory sort.' },
        { q: 'Can the index `{ a: 1, b: 1, c: 1 }` serve a query on `b` alone?', a: 'Generally no. A compound index serves its prefixes: `a`, `a,b`, and `a,b,c`. A query on `b` alone can\'t use the index efficiently and needs its own index.' },
        { q: 'How do you find out why a query is slow?', a: 'Run it with `explain(\'executionStats\')`. Look for COLLSCAN, an in-memory SORT stage, and a big gap between documents examined and documents returned. Also check the slow query log or Atlas profiler.' },
        { q: 'Why not index every field?', a: 'Each index slows every write, because it must be updated too, and uses memory. Index for your real queries, and drop unused indexes (`$indexStats` shows usage).' },
        { q: 'What is a covered query?', a: 'A query where the filter and all returned fields are in the index (and `_id` is excluded), so MongoDB answers from the index alone without reading documents.' },
      ],
      answer30: "An index is a sorted B-tree over field values so MongoDB doesn't have to scan the whole collection. For compound indexes I follow the ESR rule: equality fields first, then the sort field, then range fields, because that avoids in-memory sorts. A compound index also serves its prefixes, so in a multi-tenant app tenantId goes first. To verify, I run explain with executionStats and check for IXSCAN, no SORT stage, and documents examined close to documents returned. And I don't over-index, since every index slows writes.",
      mistakes: [
        "Putting the range field before the sort field, causing a blocking in-memory sort.",
        "Creating separate single-field indexes and expecting MongoDB to combine them like one compound index.",
        "Leading with a low-selectivity field that queries don't always filter on.",
        "Trap: 'Does a regex use an index?' Only a case-sensitive prefix regex like `/^abc/` uses it efficiently. `/abc/i` scans the whole index or collection.",
      ],
      note: "On your resume: on Octagnt, compound indexes start with `tenantId` because every query is tenant-scoped. See the projects topics on multi-tenant isolation and the boolean search engine.",
      takeaway: 'Index for real queries, order compound fields Equality-Sort-Range, and prove it with explain().',
    },

    {
      id: 'aggregation-pipeline',
      title: 'Aggregation pipeline',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'A list of stages ($match, $group, $sort, $lookup, $project...) that transform documents step by step, like a data assembly line.',
      what: [
        "The aggregation pipeline processes documents through a series of **stages**. Each stage takes documents in and passes transformed documents to the next stage.",
        "Common stages: `$match` (filter), `$group` (group and compute sums, counts, averages), `$sort`, `$limit`, `$project` (shape fields), `$lookup` (join another collection), `$unwind` (one document per array element), `$facet` (several pipelines at once) and `$addFields`.",
      ],
      deeper: [
        "Order matters for performance. Put `$match` (and `$sort` + `$limit` where possible) at the start so they can use indexes and shrink the data early. Once a stage like `$group` or `$project` reshapes documents, later stages can't use the collection's indexes.",
        "Each stage has a 100 MB memory limit for blocking operations like `$group` and `$sort`. Since MongoDB 6.0, `allowDiskUse` defaults to true, so big stages spill to disk instead of failing, but that's slow; it's a sign to match earlier or pre-aggregate.",
        "`$lookup` is a left outer join. It's fine for occasional reporting, but running it on every hot request usually means the schema should embed or duplicate that data. Index the `foreignField` you look up on.",
        "In Mongoose, `Model.aggregate()` skips schema casting and query middleware. You must cast ids yourself (`new Types.ObjectId(id)`) and add filters like `tenantId` manually.",
      ],
      why: "Reports, dashboards and analytics (counts per status, averages per job) would otherwise mean pulling thousands of documents into Node and looping. The pipeline does it inside the database, close to the data.",
      analogy: "A factory assembly line. Raw documents enter, one station throws away what you don't need, the next station sorts them into bins, the next counts each bin, and a finished report comes off the end.",
      code: {
        lang: 'js',
        title: 'Applications per status for one job, with candidate names',
        source: `const stats = await Application.aggregate([
  // 1) Filter first: uses an index on { tenantId, jobId }
  { $match: { tenantId: new Types.ObjectId(tenantId), jobId: new Types.ObjectId(jobId) } },

  // 2) Group by status: count and average score
  { $group: {
      _id: '$status',
      count: { $sum: 1 },
      avgScore: { $avg: '$score' },
      candidateIds: { $push: '$candidateId' },
  } },

  // 3) Sort biggest group first
  { $sort: { count: -1 } },

  // 4) Join candidate names (left outer join)
  { $lookup: {
      from: 'candidates',
      localField: 'candidateIds',
      foreignField: '_id',
      as: 'candidates',
      pipeline: [{ $project: { name: 1 } }],
  } },

  // 5) Final shape
  { $project: { _id: 0, status: '$_id', count: 1, avgScore: { $round: ['$avgScore', 1] }, candidates: 1 } },
]);`,
      },
      output: "Returns one object per status, for example `{ status: 'shortlisted', count: 12, avgScore: 78.4, candidates: [{ _id, name }, ...] }`, sorted by count. Only one job's applications are processed, because `$match` runs first on an index.",
      questions: [
        { q: 'Why put `$match` first?', a: 'So it can use an index and reduce the number of documents early. Every later stage then works on less data, and stages after a reshaping stage can\'t use collection indexes.' },
        { q: 'What does `$unwind` do?', a: 'It turns one document with an array into one document per array element. It\'s useful before grouping by array values, but it can multiply document counts a lot.' },
        { q: 'What is `$lookup` and when should you avoid it?', a: 'A left outer join to another collection in the same database. Avoid it on hot, high-traffic paths; if you need the joined data on every read, embed or duplicate it instead.' },
        { q: 'Does Mongoose middleware or casting apply to `aggregate()`?', a: 'Not the query middleware or automatic casting. You must convert string ids to ObjectId yourself and add filters like tenant scoping in your own `$match`.' },
      ],
      answer30: "The aggregation pipeline is a sequence of stages that transform documents: $match filters, $group computes counts and averages, $sort and $limit order and trim, $project shapes output, and $lookup joins another collection. I always put $match first so it uses an index and shrinks the data early. I'm careful with $lookup on hot paths and with stage memory limits. In Mongoose, aggregate doesn't cast ids or run find middleware, so I cast ObjectIds and add tenant filters myself.",
      mistakes: [
        "Putting `$match` after `$group` or `$project`, so the whole collection is processed and indexes aren't used.",
        "Passing a string id into `$match` in Mongoose aggregate and getting zero results.",
        "Using `$lookup` + `$unwind` on every API call instead of fixing the schema.",
        "Trap: 'Count documents fast?' Use `countDocuments(filter)` with an index, or `estimatedDocumentCount()` for the whole collection; don't fetch and count in Node.",
      ],
      note: "On your resume: on Octagnt, tenant-scoped aggregations always start with `{ $match: { tenantId } }`, because query middleware does not cover aggregate.",
      takeaway: 'Stages transform data in order; $match early, cast ids yourself, keep $lookup off hot paths.',
    },

    {
      id: 'mongodb-transactions',
      title: 'Transactions in MongoDB',
      level: 'advanced',
      priority: 'good',
      frequency: 'common',
      summary: 'Multi-document ACID transactions need a replica set and a session; prefer single-document atomic writes when the schema allows.',
      what: [
        "A transaction groups several writes so they all succeed or all fail. MongoDB supports multi-document transactions on replica sets (since 4.0) and sharded clusters (since 4.2).",
        "You start a **session**, run writes inside it, and commit. If anything throws, you abort and none of the writes are visible.",
      ],
      deeper: [
        "Transactions don't work on a standalone `mongod`; even local development needs a single-node replica set (Atlas clusters already are). Use `session.withTransaction()` or Mongoose's `connection.transaction()`, which automatically retry on `TransientTransactionError` and unknown commit results.",
        "Every operation inside must be passed the session (`{ session }`). Forgetting it on one write is the classic bug: that write happens outside the transaction and isn't rolled back.",
        "Transactions have costs: they hold locks and a snapshot, have a default 60-second lifetime, and can abort on write conflicts. Keep them short, never call external APIs inside them, and don't use them as a substitute for good modelling. Often a single-document update with operators (`$inc` with a condition) is atomic and enough.",
        "Use write concern `majority` for the commit so the result survives a primary failover, and read concern `snapshot` gives a consistent view inside the transaction.",
      ],
      why: "Some operations really span documents: moving credits from one account to another, or creating an order and decrementing stock. Without a transaction, a crash between the two writes leaves the data inconsistent.",
      analogy: "A bank transfer slip with two signatures needed. Until both the debit and the credit are signed, nothing leaves the bank. If either signature is missing, the whole slip is torn up.",
      code: {
        lang: 'ts',
        title: 'Deduct credits and record usage atomically (Mongoose)',
        source: `import mongoose from 'mongoose';

async function consumeCredits(tenantId: string, amount: number, feature: string) {
  // connection.transaction() wraps withTransaction(): commits, aborts and retries transient errors
  await mongoose.connection.transaction(async (session) => {
    const res = await Tenant.updateOne(
      { _id: tenantId, credits: { $gte: amount } }, // condition guards against going negative
      { $inc: { credits: -amount } },
      { session }
    );
    if (res.modifiedCount === 0) throw new Error('INSUFFICIENT_CREDITS');

    await UsageLog.create([{ tenantId, feature, amount, at: new Date() }], { session });
    // no HTTP calls, emails or queue messages in here: they can't be rolled back
  });
}`,
      },
      output: "If the tenant has enough credits, both the credit deduction and the usage log entry are committed together. If credits are insufficient, or the log insert fails, the transaction aborts and the credit balance is unchanged.",
      questions: [
        { q: 'What do you need to use transactions in MongoDB?', a: 'A replica set or sharded cluster (not a standalone server), a client session, and passing that session to every operation inside the transaction.' },
        { q: 'Why use `withTransaction` instead of manual start/commit?', a: 'It retries the whole callback on transient errors such as write conflicts or a primary step-down, and retries the commit when its result is unknown, which manual code usually forgets.' },
        { q: 'When can you avoid a transaction?', a: 'When the change fits in one document. Single-document writes are atomic, so a conditional update like `{ credits: { $gte: n } }` with `$inc` is safe without a transaction.' },
        { q: 'What should never go inside a transaction?', a: 'Slow work and side effects that can\'t be rolled back: HTTP calls, sending emails, publishing to a queue. Do them after commit, or use an outbox pattern.' },
      ],
      answer30: "MongoDB supports multi-document ACID transactions on replica sets and sharded clusters. I open a session and use withTransaction, or Mongoose's connection.transaction, which retries transient errors, and I pass the session to every operation. I keep transactions short and never put external calls inside. But my first choice is modelling so that the change fits one document, because single-document writes are already atomic, for example a conditional $inc that won't go below zero.",
      mistakes: [
        "Forgetting `{ session }` on one operation, so it runs outside the transaction.",
        "Trying transactions on a local standalone `mongod` and getting an error; run a single-node replica set.",
        "Calling external APIs inside the callback, which then run twice when the transaction retries.",
        "Trap: 'Read-then-write race without a transaction?' Put the condition in the update filter (`credits: { $gte: amount }`) so check and write happen atomically.",
      ],
      takeaway: 'Transactions need a replica set and the session on every call; prefer single-document atomic updates.',
    },

    {
      id: 'postgresql-basics-joins',
      title: 'PostgreSQL basics and joins',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Tables with typed columns and constraints; joins combine rows from related tables (INNER, LEFT, RIGHT, FULL).',
      what: [
        "PostgreSQL is an open-source relational database. Data lives in tables with typed columns (`integer`, `text`, `timestamptz`, `jsonb`...). Constraints like `PRIMARY KEY`, `FOREIGN KEY`, `UNIQUE`, `NOT NULL` and `CHECK` keep the data valid.",
        "A **join** combines rows from two tables using a matching column. `INNER JOIN` keeps only rows that match on both sides. `LEFT JOIN` keeps every row from the left table, with `NULL`s where there's no match. `RIGHT JOIN` is the mirror, and `FULL JOIN` keeps unmatched rows from both.",
      ],
      deeper: [
        "Query clauses run in a logical order: `FROM/JOIN` -> `WHERE` -> `GROUP BY` -> `HAVING` -> `SELECT` -> `ORDER BY` -> `LIMIT`. That's why you can't use a `SELECT` alias in `WHERE`, and why `HAVING` (filter on groups) is different from `WHERE` (filter on rows).",
        "Putting a condition on the right table in `WHERE` after a `LEFT JOIN` silently turns it into an inner join, because rows with `NULL` fail the condition. Put such conditions in the `ON` clause instead.",
        "Postgres extras worth knowing: `SERIAL`/`IDENTITY` and `uuid` keys, `RETURNING` to get inserted rows back, `ON CONFLICT ... DO UPDATE` for upserts, `jsonb` with GIN indexes, CTEs (`WITH`), and window functions (`ROW_NUMBER() OVER (...)`). Always use parameterized queries (`$1`) to prevent SQL injection.",
      ],
      why: "Joins are the core reason relational databases exist: each fact is stored once and combined at query time. Join questions are among the most asked SQL interview questions, often with a small whiteboard query.",
      analogy: "Two guest lists for a wedding: one for the ceremony, one for dinner. INNER JOIN is people on both lists. LEFT JOIN is everyone at the ceremony, with a note on who's also at dinner. FULL JOIN is everyone on either list.",
      code: {
        lang: 'sql',
        title: 'Schema and the common joins',
        source: `CREATE TABLE jobs (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title      text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE applications (
  id        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  job_id    bigint NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  candidate text NOT NULL,
  status    text NOT NULL CHECK (status IN ('new', 'shortlisted', 'rejected'))
);

-- INNER: only jobs that have applications
SELECT j.title, a.candidate
FROM jobs j
JOIN applications a ON a.job_id = j.id;

-- LEFT: every job, with application count (0 for none)
SELECT j.title, COUNT(a.id) AS applicants
FROM jobs j
LEFT JOIN applications a ON a.job_id = j.id AND a.status <> 'rejected'
GROUP BY j.id, j.title
HAVING COUNT(a.id) < 5
ORDER BY applicants DESC;

-- Parameterized from Node (node-postgres): never string-concatenate input
-- await pool.query('SELECT * FROM jobs WHERE id = $1', [jobId]);`,
      },
      output: "The first query lists one row per job-candidate pair, skipping jobs with no applications. The second lists every job with its count of non-rejected applicants (0 included because of the LEFT JOIN and `COUNT(a.id)`), keeps only jobs with fewer than 5, and sorts by count.",
      questions: [
        { q: 'Difference between INNER JOIN and LEFT JOIN?', a: 'INNER JOIN returns only rows that match in both tables. LEFT JOIN returns every row from the left table and fills the right side with NULL when there\'s no match.' },
        { q: 'Difference between WHERE and HAVING?', a: 'WHERE filters individual rows before grouping. HAVING filters groups after GROUP BY, so it can use aggregates like `COUNT(*) > 5`.' },
        { q: 'Why does `COUNT(a.id)` give 0 but `COUNT(*)` gives 1 for a job with no applications in a LEFT JOIN?', a: '`COUNT(*)` counts rows, and the LEFT JOIN still produces one row for that job. `COUNT(a.id)` counts non-null values, and `a.id` is NULL there.' },
        { q: 'How do you prevent SQL injection?', a: 'Use parameterized queries or prepared statements (`$1`, `$2` placeholders) so input is sent as data, never concatenated into SQL. ORMs and query builders do this for you.' },
        { q: 'How do you upsert in PostgreSQL?', a: '`INSERT ... ON CONFLICT (unique_column) DO UPDATE SET ...`. It needs a unique constraint or index on the conflict column.' },
      ],
      answer30: "PostgreSQL stores data in tables with typed columns and constraints like primary keys, foreign keys, unique and check, so the database itself keeps data valid. Joins combine related tables: INNER keeps matching rows, LEFT keeps all left rows with NULLs for no match, and FULL keeps both sides. I remember the logical order, FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, and that filtering the right table in WHERE after a LEFT JOIN turns it into an inner join. And I always use parameterized queries.",
      mistakes: [
        "Filtering the right-hand table in `WHERE` after a `LEFT JOIN`, which drops the unmatched rows.",
        "Using `COUNT(*)` instead of `COUNT(column)` with LEFT JOIN and reporting 1 instead of 0.",
        "Building SQL with template strings from user input.",
        "Trap: 'Can you use a SELECT alias in WHERE?' No, WHERE runs before SELECT. Repeat the expression or wrap the query in a subquery or CTE.",
      ],
      takeaway: 'Constraints keep data valid, joins combine tables; know INNER vs LEFT, WHERE vs HAVING, and always parameterize.',
    },

    {
      id: 'normalization',
      title: 'Normalization and denormalization',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Normalize so each fact is stored once (1NF, 2NF, 3NF); denormalize deliberately when reads need it.',
      what: [
        "Normalization means organizing tables so each fact is stored in exactly one place. That avoids anomalies: updating a customer's email in one row but not another, or losing a product's data when its last order is deleted.",
        "The usual levels: **1NF** each column holds one atomic value and there are no repeating groups. **2NF** every non-key column depends on the whole primary key (matters for composite keys). **3NF** non-key columns depend only on the key, not on other non-key columns.",
        "**Denormalization** is deliberately duplicating data to make reads faster, accepting extra work on writes.",
      ],
      deeper: [
        "A quick 3NF test: 'every non-key column depends on the key, the whole key, and nothing but the key'. If `orders` stores `customer_city`, that depends on the customer, not the order, so it belongs in `customers`.",
        "Denormalize when a read path is hot and the duplicated data rarely changes: storing `order_total`, keeping a `comments_count` column, or building a reporting table or materialized view. Keep copies in sync with triggers, application code in a transaction, or background jobs, and accept that some copies may be briefly stale.",
        "MongoDB design is mostly controlled denormalization: embedding and extended references are the same trade-off, made per access pattern.",
      ],
      why: "Normalized data is correct by construction and easy to change. Denormalized data is fast to read. Interviewers want to hear that you know the rules and when to break them on purpose.",
      analogy: "Normalization is keeping one master contact list and referring to people by name everywhere else. Denormalization is writing someone's phone number directly on the event poster so readers don't have to look it up, and accepting you must reprint posters if the number changes.",
      code: {
        lang: 'sql',
        title: 'From one messy table to 3NF',
        source: `-- Not normalized: customer details repeated on every order,
-- and a list of products crammed into one column (breaks 1NF)
-- orders(id, customer_name, customer_email, customer_city, products, total)
-- (1, 'Asha', 'asha@x.com', 'Kochi', 'pen,book', 250)

-- 3NF
CREATE TABLE customers (id bigint PRIMARY KEY, name text, email text UNIQUE, city text);
CREATE TABLE products  (id bigint PRIMARY KEY, name text, price numeric(10,2));
CREATE TABLE orders    (id bigint PRIMARY KEY, customer_id bigint REFERENCES customers(id), created_at timestamptz);
CREATE TABLE order_items (
  order_id   bigint REFERENCES orders(id),
  product_id bigint REFERENCES products(id),
  quantity   int NOT NULL,
  unit_price numeric(10,2) NOT NULL,  -- price at time of purchase: a deliberate copy
  PRIMARY KEY (order_id, product_id)
);`,
      },
      output: "Each customer's email lives in one row, so changing it is one update. Products are rows in `order_items` instead of a comma list. `unit_price` is copied on purpose, because the order must keep the price paid even if the product price changes later.",
      questions: [
        { q: 'What is normalization and why do it?', a: 'Structuring tables so each fact is stored once. It prevents update, insert and delete anomalies and keeps data consistent.' },
        { q: 'Explain 1NF, 2NF and 3NF briefly.', a: '1NF: atomic values, no repeating groups. 2NF: 1NF plus no column depends on only part of a composite key. 3NF: 2NF plus no non-key column depends on another non-key column.' },
        { q: 'When would you denormalize?', a: 'When a hot read path needs fewer joins and the duplicated data changes rarely, like counters, totals or reporting tables. You accept extra write work and must keep copies in sync.' },
        { q: 'Is storing the price on an order line denormalization?', a: 'It looks like it, but it\'s actually a different fact: the price at the time of purchase. It must not change when the product price changes, so it belongs on the order line.' },
      ],
      answer30: "Normalization organizes tables so every fact is stored once, which prevents anomalies like updating an email in one place but not another. First normal form means atomic values, second means no partial dependency on a composite key, and third means non-key columns depend only on the key. In practice I normalize by default and denormalize deliberately for hot reads, like counters or reporting tables, with a clear way to keep copies in sync.",
      mistakes: [
        "Storing comma-separated lists in one column.",
        "Denormalizing without a plan to keep copies updated.",
        "Over-normalizing into many tiny tables so simple pages need six joins.",
        "Trap: 'Is a historical price a duplicate?' No, it's a separate fact (price at purchase time) and must be stored on the order.",
      ],
      takeaway: 'Normalize by default so each fact lives once; denormalize on purpose for hot reads.',
    },

    {
      id: 'acid-isolation-levels',
      title: 'ACID and transaction isolation levels',
      level: 'advanced',
      priority: 'must',
      frequency: 'common',
      summary: 'ACID = Atomic, Consistent, Isolated, Durable; isolation levels trade safety against concurrency (dirty, non-repeatable and phantom reads).',
      what: [
        "**ACID** describes what a transaction guarantees. **Atomicity**: all of its changes happen, or none do. **Consistency**: it moves the database from one valid state to another (constraints hold). **Isolation**: concurrent transactions don't see each other's half-done work. **Durability**: once committed, data survives a crash.",
        "Full isolation is expensive, so databases offer **isolation levels**. From weakest to strongest: Read Uncommitted, Read Committed, Repeatable Read, Serializable. Weaker levels allow more concurrency but also more anomalies.",
      ],
      deeper: [
        "The classic anomalies: a **dirty read** (seeing another transaction's uncommitted change), a **non-repeatable read** (reading the same row twice and getting different values because someone committed in between), and a **phantom read** (running the same range query twice and getting new rows). There's also the **lost update**: two transactions read a value, both add to it, and one overwrites the other.",
        "PostgreSQL's default is **Read Committed**: each statement sees data committed before that statement began. Postgres treats Read Uncommitted as Read Committed, so dirty reads never happen. Its Repeatable Read uses a snapshot for the whole transaction (which also prevents phantoms in Postgres), and Serializable adds conflict detection that aborts transactions with a serialization error, which your code must retry. MySQL InnoDB defaults to Repeatable Read.",
        "Practical fixes for lost updates without going Serializable: do the arithmetic in the database (`UPDATE ... SET balance = balance - 10`), lock rows you'll change with `SELECT ... FOR UPDATE`, or use optimistic concurrency with a `version` column (`UPDATE ... WHERE id = $1 AND version = $2`, retry if 0 rows changed). The version-field approach works the same way in MongoDB.",
      ],
      why: "Concurrency bugs (double-spends, overselling the last item, counters that lose increments) only show up under load and are hard to reproduce. Knowing isolation levels lets you explain why they happen and pick the cheapest correct fix.",
      analogy: "Isolation levels are like how much privacy you give someone editing a shared document. Read Uncommitted lets you watch them type. Read Committed shows only saved versions, but they might change while you read. Repeatable Read gives you a photocopy taken when you started. Serializable makes everyone take turns, at least in effect.",
      code: {
        lang: 'sql',
        title: 'Lost update and three ways to prevent it',
        source: `-- Problem (Read Committed): two requests both read stock = 1, both write 0, both sell
-- T1: SELECT stock FROM products WHERE id = 7;   -- 1
-- T2: SELECT stock FROM products WHERE id = 7;   -- 1
-- T1: UPDATE products SET stock = 0 WHERE id = 7; COMMIT;
-- T2: UPDATE products SET stock = 0 WHERE id = 7; COMMIT;  -- sold twice!

-- Fix 1: atomic conditional update (simplest)
UPDATE products SET stock = stock - 1
WHERE id = 7 AND stock > 0
RETURNING stock;            -- 0 rows returned = sold out

-- Fix 2: pessimistic lock
BEGIN;
SELECT stock FROM products WHERE id = 7 FOR UPDATE;  -- others wait here
UPDATE products SET stock = stock - 1 WHERE id = 7;
COMMIT;

-- Fix 3: optimistic concurrency with a version column
UPDATE products SET stock = 0, version = version + 1
WHERE id = 7 AND version = 3;  -- 0 rows updated = someone else won, retry

-- Stronger isolation for a whole transaction (be ready to retry on error 40001)
BEGIN ISOLATION LEVEL SERIALIZABLE;
-- ...
COMMIT;`,
      },
      output: "With fix 1, the second request's update matches 0 rows because stock is already 0, so the item is sold once. With fix 2, the second transaction waits for the lock and then sees stock 0. With fix 3, the second update matches 0 rows because the version changed, and the app retries or reports a conflict.",
      questions: [
        { q: 'What does ACID stand for?', a: 'Atomicity (all or nothing), Consistency (constraints always hold), Isolation (concurrent transactions don\'t see each other\'s partial work), Durability (committed data survives crashes).' },
        { q: 'What is the default isolation level in PostgreSQL?', a: 'Read Committed. Each statement sees only data committed before it started, so dirty reads can\'t happen, but non-repeatable reads and lost updates can.' },
        { q: 'What is a phantom read?', a: 'Running the same range query twice in one transaction and seeing extra or missing rows because another transaction inserted or deleted rows and committed in between.' },
        { q: 'How do you prevent a lost update?', a: 'Do the change atomically in one statement (`SET x = x - 1 WHERE x > 0`), lock the row with `SELECT ... FOR UPDATE`, or use optimistic locking with a version column and retry on conflict.' },
        { q: 'What happens at Serializable when there\'s a conflict?', a: 'In PostgreSQL, one transaction fails with a serialization error (SQLSTATE 40001). The application must catch it and retry the whole transaction.' },
      ],
      answer30: "ACID means atomic, all or nothing; consistent, constraints hold; isolated, concurrent transactions don't see partial work; and durable, committed data survives crashes. Isolation levels trade safety for concurrency: read uncommitted, read committed, repeatable read, serializable, preventing dirty, non-repeatable and phantom reads in turn. Postgres defaults to read committed. For the common lost-update bug I usually don't jump to serializable; I use an atomic conditional update, SELECT FOR UPDATE, or a version column for optimistic locking.",
      mistakes: [
        "Reading a value in Node, changing it, and writing it back without a lock or condition.",
        "Turning on Serializable without adding retry logic for serialization failures.",
        "Holding a row lock while calling an external API, blocking everyone else.",
        "Trap: 'Does a transaction alone stop double-selling?' Not at Read Committed if you read then write separately. You still need a lock, a conditional update or a stricter level.",
      ],
      takeaway: 'Know the four letters and the anomalies; fix lost updates with atomic updates, row locks or version checks.',
    },

    {
      id: 'sql-indexes-explain',
      title: 'SQL indexes and query plans (EXPLAIN)',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'B-tree indexes speed up lookups and sorts; EXPLAIN ANALYZE shows whether the planner used them and where time went.',
      what: [
        "Like in MongoDB, an index in PostgreSQL is a separate sorted structure (a B-tree by default) that lets the database find rows without reading the whole table. Primary keys and unique constraints create indexes automatically; foreign keys do **not**.",
        "`EXPLAIN` shows the plan the planner chose. `EXPLAIN ANALYZE` actually runs the query and shows real times and row counts. Key plan nodes: **Seq Scan** (read the whole table), **Index Scan**, **Index Only Scan** (answer from the index alone), **Bitmap Heap Scan**, and join types like **Nested Loop**, **Hash Join** and **Merge Join**.",
      ],
      deeper: [
        "The planner is cost-based. It uses table statistics to estimate rows; if the estimate (`rows=`) is far from the actual count, statistics may be stale (run `ANALYZE`) or the data is skewed. For a small table or a filter that matches most rows, a Seq Scan is genuinely faster, so a Seq Scan isn't always a problem.",
        "Compound (multi-column) indexes follow the same left-prefix rule as MongoDB: `(tenant_id, created_at)` helps `WHERE tenant_id = ?` and `WHERE tenant_id = ? ORDER BY created_at`, but not `WHERE created_at > ?` alone. Put equality columns first.",
        "Things that stop index use: wrapping the column in a function (`WHERE lower(email) = ...` needs an expression index on `lower(email)`), leading wildcards (`LIKE '%abc'`), type mismatches, and `OR` across different columns. Other index types: partial (`WHERE deleted_at IS NULL`), GIN for `jsonb` and full-text, and `INCLUDE` columns for index-only scans. Build indexes on busy production tables with `CREATE INDEX CONCURRENTLY` to avoid blocking writes.",
      ],
      why: "Slow queries are the most common database production issue, and 'how would you debug a slow query?' is a standard interview question. The answer is always: read the plan, then fix the index or the query.",
      analogy: "EXPLAIN is asking a taxi driver which route they plan to take before you leave. EXPLAIN ANALYZE is checking the GPS log after the trip, with how long each road actually took.",
      code: {
        lang: 'sql',
        title: 'Read a plan, add the right index, read it again',
        source: `EXPLAIN ANALYZE
SELECT id, title FROM applications
WHERE tenant_id = 42 AND status = 'new'
ORDER BY created_at DESC
LIMIT 20;

-- Before (trimmed):
-- Limit  (actual time=180.2..180.3 rows=20)
--   -> Sort  (Sort Key: created_at DESC)
--        -> Seq Scan on applications  (rows=1180 ... Rows Removed by Filter: 998820)

CREATE INDEX CONCURRENTLY idx_app_tenant_status_created
  ON applications (tenant_id, status, created_at DESC);

-- After (trimmed):
-- Limit  (actual time=0.05..0.09 rows=20)
--   -> Index Scan using idx_app_tenant_status_created on applications

-- Foreign keys are NOT indexed automatically: add one for joins and cascades
CREATE INDEX CONCURRENTLY idx_app_job_id ON applications (job_id);

-- A function on the column needs an expression index
CREATE INDEX idx_users_lower_email ON users (lower(email));`,
      },
      output: "Before the index, Postgres scans about a million rows, throws most away, and sorts the rest. After it, the planner walks the index already in `created_at DESC` order and stops after 20 rows, with no Sort node. The timings shown are illustrative; the shape of the plan is what matters.",
      questions: [
        { q: 'How would you debug a slow SQL query?', a: 'Run `EXPLAIN ANALYZE`, look for Seq Scans on big tables, Sort nodes, and big gaps between estimated and actual rows. Then add or adjust an index, rewrite the query, or refresh statistics with `ANALYZE`, and compare the plan again.' },
        { q: 'Difference between EXPLAIN and EXPLAIN ANALYZE?', a: 'EXPLAIN shows the planned steps and estimated costs without running the query. EXPLAIN ANALYZE runs it and adds real timings and row counts, so be careful using it on writes (wrap in a transaction and roll back).' },
        { q: 'Are foreign keys indexed automatically in PostgreSQL?', a: 'No. Primary keys and unique constraints are, but the referencing column of a foreign key isn\'t. Index it yourself for joins and to keep cascading deletes fast.' },
        { q: 'Why might Postgres ignore your index?', a: 'The filter matches a large share of rows so a Seq Scan is cheaper, statistics are stale, the column is wrapped in a function, there\'s a type mismatch, or the query doesn\'t use the index\'s leading column.' },
      ],
      answer30: "Indexes in Postgres are B-trees by default, and they speed up filtering, joining and sorting at the cost of slower writes. To debug a slow query I run EXPLAIN ANALYZE and look for sequential scans on large tables, separate Sort nodes, and estimated rows far off from actual rows. Then I add a composite index with equality columns first and the sort column next, or fix things that block index use, like functions on the column. I also remember foreign keys aren't indexed automatically.",
      mistakes: [
        "Assuming every Seq Scan is bad; on small tables or broad filters it's the right choice.",
        "Forgetting to index foreign key columns.",
        "Running `EXPLAIN ANALYZE` on a DELETE in production without a transaction to roll back.",
        "Trap: 'Why is `WHERE lower(email) = $1` slow when email is indexed?' The index is on `email`, not `lower(email)`. Create an expression index.",
      ],
      takeaway: 'Read the plan (EXPLAIN ANALYZE), index for filter + sort with equality first, and index your foreign keys.',
    },

    {
      id: 'n-plus-one',
      title: 'The N+1 query problem',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'One query for a list, then one more query per item; fix it by batching with $in / IN, joins, or a DataLoader.',
      what: [
        "The N+1 problem happens when you load a list with 1 query, then loop over the N results and run another query for each one. For 100 posts, that's 101 round trips to the database instead of 2.",
        "It hides easily: a loop with `await` inside, an ORM lazy-loading relations, or a GraphQL resolver that fetches the author for every post.",
      ],
      deeper: [
        "Fixes: collect all ids and fetch them in one query (`$in` in MongoDB, `WHERE id = ANY($1)` or `IN (...)` in SQL), use a join or `$lookup`, use the ORM's eager loading (`include` in Prisma, `populate` in Mongoose, which batches with `$in`), or embed the needed fields so no second query is required.",
        "In GraphQL, the standard fix is **DataLoader**: it collects all ids requested in the same tick and calls one batch function, and it also caches per request.",
        "Spot it in logs or APM traces: many nearly identical queries in one request. Each query might be fast, but network round trips add up, and under load they exhaust the connection pool.",
      ],
      why: "It is the most common hidden performance bug in ORM-based apps. A page fast with 10 test rows becomes slow with 1,000 real rows, and the database load grows linearly with list size.",
      analogy: "Going to the shop once for every item on your shopping list, instead of taking the whole list in one trip.",
      code: {
        lang: 'js',
        title: 'Counting queries: N+1 vs batched',
        source: `// A fake database that counts queries, so we can see the N+1 problem
let queries = 0;
const users = [{ id: 1, name: 'Asha' }, { id: 2, name: 'Ravi' }, { id: 3, name: 'Meera' }];
const posts = Array.from({ length: 6 }, (_, i) => ({ id: i + 1, userId: (i % 3) + 1, title: 'Post ' + (i + 1) }));
const db = {
  async findPosts() { queries++; return posts; },
  async findUserById(id) { queries++; return users.find((u) => u.id === id); },
  async findUsersByIds(ids) { queries++; return users.filter((u) => ids.includes(u.id)); },
};

// N+1: 1 query for posts + 1 query per post
queries = 0;
const list = await db.findPosts();
for (const p of list) p.author = (await db.findUserById(p.userId)).name;
console.log('N+1 queries:', queries);

// Batched: 1 query for posts + 1 query for all authors ($in / WHERE id IN)
queries = 0;
const list2 = await db.findPosts();
const ids = [...new Set(list2.map((p) => p.userId))];
const byId = new Map((await db.findUsersByIds(ids)).map((u) => [u.id, u]));
for (const p of list2) p.author = byId.get(p.userId).name;
console.log('Batched queries:', queries);
console.log(list2[3]);`,
      },
      output: "Prints `N+1 queries: 7`, then `Batched queries: 2`, then `{ id: 4, userId: 1, title: 'Post 4', author: 'Asha' }`. With 6 posts the loop made 7 queries; the batched version always makes 2, no matter how many posts there are.",
      questions: [
        { q: 'What is the N+1 query problem?', a: 'Loading a list with one query, then running one extra query per item to load related data. For N items that\'s N+1 database round trips instead of one or two.' },
        { q: 'How do you fix N+1 in MongoDB or Mongoose?', a: 'Collect the ids and fetch them in one `$in` query, use `populate` (which batches with `$in`), use `$lookup` in an aggregation, or embed the needed fields in the parent document.' },
        { q: 'How do you fix N+1 in GraphQL?', a: 'Use DataLoader in each request. It batches all `load(id)` calls made in the same tick into one query and caches results for that request.' },
        { q: 'How do you detect N+1 in production?', a: 'Look for many repeated, nearly identical queries per request in query logs, APM traces, or ORM debug logging. Request time that grows with list length is another sign.' },
      ],
      answer30: "N+1 is when I fetch a list in one query and then make one more query per item for related data, so 100 items means 101 round trips. It's easy to create with an await inside a loop or lazy-loading ORMs. I fix it by batching: collect the ids and fetch them with one $in or IN query and map them back, or use a join, populate, or DataLoader in GraphQL. Or I embed the few fields I need so there's no second query at all.",
      mistakes: [
        "`await` inside a `for` loop over database results.",
        "Fixing N+1 with `Promise.all` of N queries: faster, but still N queries and it floods the pool.",
        "Only testing with tiny datasets where 11 queries feel instant.",
        "Trap: 'Isn't populate the same as N+1?' No. Mongoose populate collects ids and runs one `$in` query per path, so it's 2 queries, not N+1. Nested populates add one query per level.",
      ],
      takeaway: 'Never query inside a loop: batch ids into one $in / IN query, join, or use DataLoader.',
    },

    {
      id: 'pagination-offset-cursor',
      title: 'Pagination: offset vs cursor',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Offset (skip/limit) is simple but slows down and shifts with new data; cursor (keyset) pagination is fast and stable.',
      what: [
        "**Offset pagination** uses `skip` and `limit` (or `OFFSET` and `LIMIT`): page 3 with size 20 means skip 40, take 20. It's easy and supports jumping to any page number.",
        "**Cursor (keyset) pagination** remembers where the last page ended and asks for 'the next 20 items after this one', using an indexed sort key like `createdAt` plus `_id`.",
      ],
      deeper: [
        "Offset gets slower on deep pages because the database still has to walk past every skipped row: `skip(100000)` reads 100,000 entries and throws them away. It's also unstable: if a new item is inserted at the top while a user pages, items shift and the user sees duplicates or misses some.",
        "Cursor queries look like `WHERE (created_at, id) < ($1, $2) ORDER BY created_at DESC, id DESC LIMIT 20`. With an index on the sort keys, every page costs the same, however deep. Always add a unique tiebreaker (`_id`/`id`) because many rows can share a timestamp.",
        "Encode the cursor as an opaque string (base64 of the last item's sort values) so clients don't depend on its format. Return `nextCursor` (and `hasMore`, by fetching `limit + 1` rows). The trade-off: no 'jump to page 37' and no cheap total count. Use offset for small admin tables with page numbers; use cursors for feeds, infinite scroll and APIs.",
      ],
      why: "List endpoints are everywhere, and they're where performance problems show up first as data grows. Interviewers like this because it tests indexes, consistency and API design in one question.",
      analogy: "Offset is telling a friend 'start reading from the 40th line', which breaks if someone adds lines at the top. A cursor is a bookmark placed after the last line you read: wherever new lines appear, you continue from the bookmark.",
      code: [
        {
          lang: 'js',
          title: 'Why offset repeats items when new data arrives',
          source: `// Items sorted newest first (higher id = newer)
let items = [5, 4, 3, 2, 1].map((id) => ({ id }));
const sorted = () => [...items].sort((a, b) => b.id - a.id);

// Offset pagination: skip N rows
const offsetPage = (page, size) => sorted().slice(page * size, page * size + size).map((i) => i.id);

// Cursor (keyset) pagination: "give me items older than the last one I saw"
const cursorPage = (afterId, size) =>
  sorted().filter((i) => afterId == null || i.id < afterId).slice(0, size).map((i) => i.id);

const o1 = offsetPage(0, 2);
const c1 = cursorPage(null, 2);
items.push({ id: 6 }); // a new item arrives before the user loads page 2
console.log('offset:', o1, offsetPage(1, 2));               // repeats an item
console.log('cursor:', c1, cursorPage(c1[c1.length - 1], 2)); // no repeat`,
        },
        {
          lang: 'ts',
          title: 'Cursor pagination in Mongoose',
          source: `// Index: { tenantId: 1, createdAt: -1, _id: -1 }
async function listApplications(tenantId: string, limit = 20, cursor?: string) {
  const filter: Record<string, unknown> = { tenantId };
  if (cursor) {
    const { createdAt, id } = JSON.parse(Buffer.from(cursor, 'base64url').toString());
    filter.$or = [
      { createdAt: { $lt: new Date(createdAt) } },
      { createdAt: new Date(createdAt), _id: { $lt: id } }, // tiebreaker
    ];
  }
  const rows = await Application.find(filter)
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit + 1) // one extra tells us if there's another page
    .lean();

  const hasMore = rows.length > limit;
  const page = rows.slice(0, limit);
  const last = page[page.length - 1];
  const nextCursor = hasMore
    ? Buffer.from(JSON.stringify({ createdAt: last.createdAt, id: last._id })).toString('base64url')
    : null;
  return { items: page, nextCursor };
}`,
        },
      ],
      output: "The first snippet prints `offset: [ 5, 4 ] [ 4, 3 ]` (item 4 appears twice because item 6 pushed everything down) and `cursor: [ 5, 4 ] [ 3, 2 ]` (continues correctly after 4). The Mongoose version returns 20 items and an opaque `nextCursor`, or `null` on the last page.",
      questions: [
        { q: 'Why is offset pagination slow on deep pages?', a: 'The database must still walk through all skipped rows before returning the page, so `skip(100000)` does 100,000 rows of wasted work. Cost grows with the page number.' },
        { q: 'What is cursor (keyset) pagination?', a: 'Instead of skipping rows, the client sends the sort values of the last item it saw, and the query asks for items after those values using an index. Each page costs the same and new inserts don\'t shift results.' },
        { q: 'Why do you need a tiebreaker in the cursor?', a: 'Several rows can share the same sort value, like the same `createdAt`. Adding the unique `_id` to the sort and the cursor makes the order total, so no row is skipped or repeated.' },
        { q: 'When is offset pagination still fine?', a: 'For small datasets or admin tables where users need page numbers and \'jump to page N\', and where a slightly shifting result is acceptable.' },
      ],
      answer30: "Offset pagination uses skip and limit. It's simple and supports page numbers, but deep pages get slow because the database walks past every skipped row, and new inserts shift items so users see duplicates. Cursor pagination sends the last item's sort key, like createdAt plus _id as a tiebreaker, and asks for items after it using an index. It's constant cost per page and stable, which is why I use it for feeds and APIs. I fetch limit plus one to know if there's a next page.",
      mistakes: [
        "Cursor on `createdAt` alone without `_id`, skipping rows that share a timestamp.",
        "No index matching the sort, so cursor pagination still scans and sorts.",
        "Exposing the raw cursor format so clients start building cursors themselves.",
        "Trap: 'How do you show the total count with cursors?' A full count is expensive on large collections. Show 'more results' instead, or an approximate or cached count.",
      ],
      takeaway: 'Offset for small paged tables; cursor with a unique tiebreaker and a matching index for everything that grows.',
    },

    {
      id: 'redis-caching',
      title: 'Redis data types and caching patterns',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Redis is an in-memory key-value store with rich types; cache-aside with TTLs and delete-on-write is the default caching pattern.',
      what: [
        "Redis is an in-memory data store. Reads and writes usually take well under a millisecond because data lives in RAM. It's used for caching, sessions, rate limits, queues, leaderboards and pub/sub.",
        "Its main types: **strings** (also counters with `INCR`), **hashes** (an object's fields), **lists** (queues), **sets** (unique members), **sorted sets** (members ordered by score, great for leaderboards), and **streams** (append-only logs with consumer groups). Any key can have a **TTL** so it expires automatically.",
        "**Cache-aside** (lazy loading) is the common pattern: read from the cache; on a miss, read from the database and store the result in the cache with a TTL. On update, write to the database and delete the cache key.",
      ],
      deeper: [
        "Why delete instead of update on write? Two concurrent writers can update the database in one order and the cache in the other, leaving stale data forever. Deleting means the next read reloads the truth. TTLs are your safety net: even a missed invalidation heals when the key expires. Add a little random jitter to TTLs so many keys don't expire at the same moment.",
        "Other patterns: **write-through** (write to cache and DB together, cache always warm, more write cost), **write-behind** (write to cache, flush to DB later, fast but risky), and **read-through** (the cache layer itself loads from the DB).",
        "Classic problems: **cache stampede** (a hot key expires and thousands of requests hit the DB at once; fix with a short lock using `SET key val NX EX`, or serve stale while one request refreshes), **cache penetration** (repeated lookups for ids that don't exist; cache the 'not found' briefly), and memory limits (set `maxmemory` and an eviction policy like `allkeys-lru`). Remember Redis is a cache here: the database stays the source of truth.",
      ],
      why: "Caching hot, rarely changing reads (config, permissions, job details) cuts database load and latency dramatically. Interviewers ask about it because the hard part, invalidation, is where real bugs live.",
      analogy: "Redis is the sticky note on your monitor with the numbers you use all day. Cache-aside means you check the sticky note first and only open the big filing cabinet (the database) when the note is missing; when a number changes, you throw the old note away rather than trying to correct it.",
      code: [
        {
          lang: 'js',
          title: 'Cache-aside with TTL and delete-on-write (runnable with a Map)',
          source: `// Cache-aside with TTL, using a Map in place of Redis so it runs anywhere
const cache = new Map(); // key -> { value, expiresAt }
let dbReads = 0;

async function getJobFromDb(id) {
  dbReads++;
  return { id, title: 'Backend Engineer', version: dbReads };
}

async function getJob(id, ttlMs = 1000) {
  const key = 'job:' + id;
  const hit = cache.get(key);
  if (hit && hit.expiresAt > Date.now()) return { ...hit.value, from: 'cache' };

  const value = await getJobFromDb(id);                  // miss: read the source of truth
  cache.set(key, { value, expiresAt: Date.now() + ttlMs }); // then fill the cache
  return { ...value, from: 'db' };
}

async function updateJob(id) {
  // write to the database first, then DELETE the cache entry (don't update it)
  cache.delete('job:' + id);
}

console.log(await getJob(7));   // miss
console.log(await getJob(7));   // hit
await updateJob(7);
console.log(await getJob(7));   // miss again after invalidation
console.log('db reads:', dbReads);`,
        },
        {
          lang: 'ts',
          title: 'The same pattern with real Redis (node-redis v4+)',
          source: `import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

export async function getJob(id: string) {
  const key = \`job:\${id}\`;
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const job = await Job.findById(id).lean();
  if (job) {
    const ttl = 300 + Math.floor(Math.random() * 60); // 5-6 min, jitter avoids mass expiry
    await redis.set(key, JSON.stringify(job), { EX: ttl });
  }
  return job;
}

export async function updateJob(id: string, data: Partial<JobInput>) {
  const job = await Job.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  await redis.del(\`job:\${id}\`); // invalidate after the DB write succeeds
  return job;
}`,
        },
      ],
      output: "The runnable version prints the job three times: first `from: 'db'` with version 1, then `from: 'cache'` with version 1, then after the update `from: 'db'` with version 2, and finally `db reads: 2`. The cache saved one database read and the update forced a fresh read.",
      questions: [
        { q: 'What is the cache-aside pattern?', a: 'The app checks the cache first. On a miss it reads the database, stores the result in the cache with a TTL, and returns it. On writes it updates the database and deletes the cache key.' },
        { q: 'Why delete the cache key on update instead of setting the new value?', a: 'Concurrent writers can update the database and cache in different orders, leaving an old value cached indefinitely. Deleting forces the next read to load the current value from the database.' },
        { q: 'What is a cache stampede and how do you prevent it?', a: 'When a popular key expires and many requests miss at once and all hit the database. Prevent it with a short lock (`SET lock NX EX 5`) so one request refreshes, serving slightly stale data meanwhile, or adding jitter to TTLs.' },
        { q: 'Name the main Redis data types and a use for each.', a: 'Strings for cached values and counters, hashes for objects, lists for simple queues, sets for unique tags or online users, sorted sets for leaderboards and time-ordered items, streams for durable event logs.' },
        { q: 'What happens when Redis runs out of memory?', a: 'It follows the `maxmemory-policy`. With `noeviction` writes fail; with `allkeys-lru` or `volatile-lru` it evicts least recently used keys. For a cache, an LRU or LFU policy is usual.' },
      ],
      answer30: "Redis is an in-memory key-value store with types like strings, hashes, lists, sets, sorted sets and streams, and any key can have a TTL. For caching I use cache-aside: check Redis, on a miss read the database and set the value with a TTL, and on writes update the database then delete the key. I delete rather than update to avoid races, add jitter to TTLs, and protect hot keys from stampedes with a short NX lock. The database always stays the source of truth.",
      mistakes: [
        "Caching without a TTL, so a missed invalidation means stale data forever.",
        "Updating the cache on write instead of deleting it, creating race conditions.",
        "Caching per-user or per-tenant data under a global key and leaking it to other users.",
        "Trap: 'Is Redis durable?' It can persist with RDB snapshots and AOF, but as a cache you should assume data can be lost and always be able to rebuild from the database.",
      ],
      note: "Redis isn't on your resume, so present this as knowledge, not experience. Licensing changed in 2024-2025: Redis moved away from the BSD licence (Redis 8 added AGPLv3 as an option), and the Linux Foundation fork Valkey is now offered by AWS ElastiCache. The commands are the same; check the current details if asked.",
      takeaway: 'Cache-aside + TTL + delete on write; guard hot keys from stampedes; the DB is the source of truth.',
    },

    {
      id: 'redis-rate-limit-sessions-pubsub',
      title: 'Redis for rate limiting, sessions and pub/sub',
      level: 'advanced',
      priority: 'good',
      frequency: 'common',
      summary: 'Atomic counters with expiry give shared rate limits; Redis holds sessions all servers can read; pub/sub broadcasts messages between servers.',
      what: [
        "When you run several Node servers behind a load balancer, in-memory state (a counter in a `Map`, `express-session`'s default memory store) only exists on one server. Redis gives all servers one shared, fast place for that state.",
        "**Rate limiting**: count requests per user or IP in a Redis key with `INCR` and give the key an expiry, so every server sees the same count. **Sessions**: store session data in Redis under the session id from the cookie, with a TTL. **Pub/sub**: one server `PUBLISH`es a message to a channel and every subscribed server receives it instantly, which is how Socket.IO and WebSocket apps broadcast across servers.",
      ],
      deeper: [
        "**Fixed window** limiting (`INCR` + `EXPIRE`) is simple but allows bursts at window edges: 100 requests at 12:00:59 and 100 more at 12:01:00. **Sliding window log** uses a sorted set of timestamps (`ZADD`, `ZREMRANGEBYSCORE`, `ZCARD`) and is exact but stores every request. **Token bucket** allows controlled bursts. Run multi-step logic atomically with `MULTI` or a Lua script, so concurrent requests can't slip between steps.",
        "Pub/sub is fire-and-forget: if a subscriber is disconnected when a message is published, it never gets it. For work that must not be lost, use **Redis Streams** with consumer groups, or a real queue like SQS or BullMQ (which itself runs on Redis). A subscribing connection can't run normal commands, so use a separate client for it.",
        "Sessions in Redis vs JWT: Redis sessions are easy to revoke (delete the key) and keep tokens small, at the cost of a Redis lookup per request. JWTs are stateless but hard to revoke before expiry, so many apps keep a Redis denylist or short-lived tokens with refresh tokens.",
      ],
      why: "Once an app scales beyond one server, anything kept in process memory breaks: limits are per server, users get logged out when they hit a different instance, and real-time events reach only some clients. Redis is the standard shared layer that fixes all three.",
      analogy: "Redis is the shared whiteboard in an office with many receptionists. Each receptionist (server) writes visitor counts and guest passes on the same board, and when one shouts an announcement into the intercom (pub/sub), everyone listening hears it at once; anyone out of the room misses it.",
      code: {
        lang: 'ts',
        title: 'Fixed-window rate limiter and cross-server pub/sub (node-redis v4+)',
        source: `import { createClient } from 'redis';
import type { Request, Response, NextFunction } from 'express';

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

// 100 requests per 60 seconds per user (or IP when anonymous)
export async function rateLimit(req: Request, res: Response, next: NextFunction) {
  const who = req.user?.id ?? req.ip;
  const window = Math.floor(Date.now() / 60_000);
  const key = \`rl:\${who}:\${window}\`;

  // MULTI makes INCR + EXPIRE one atomic step: no key is ever left without a TTL
  const [count] = await redis.multi().incr(key).expire(key, 60).exec();

  res.setHeader('RateLimit-Remaining', String(Math.max(0, 100 - Number(count))));
  if (Number(count) > 100) return res.status(429).json({ error: 'Too many requests' });
  next();
}

// Pub/sub: a subscriber needs its own connection
const sub = redis.duplicate();
await sub.connect();
await sub.subscribe('job-updated', (message) => {
  const { jobId } = JSON.parse(message);
  // e.g. push to this server's WebSocket clients, or clear a local cache
  console.log('job changed', jobId);
});

// Any server can publish; every subscribed server receives it
await redis.publish('job-updated', JSON.stringify({ jobId: 'j1' }));`,
      },
      output: "Requests from one user share a counter across all servers; the 101st request in the same minute gets a 429. Publishing 'job-updated' delivers the message to every server currently subscribed, each of which logs 'job changed j1'. A server that was offline at that moment never receives it.",
      questions: [
        { q: 'Why use Redis for rate limiting instead of an in-memory counter?', a: 'With several servers, each in-memory counter only sees part of the traffic, so the real limit becomes limit times server count. Redis gives one shared, atomic counter that every server uses.' },
        { q: 'What is the weakness of a fixed-window rate limiter?', a: 'It allows a burst of up to twice the limit around a window boundary. A sliding window (sorted set of timestamps) or token bucket smooths that out at the cost of more work.' },
        { q: 'Is Redis pub/sub reliable?', a: 'No, it\'s fire-and-forget. Subscribers that are disconnected miss messages, and nothing is stored. For guaranteed delivery use Redis Streams with consumer groups or a queue like SQS.' },
        { q: 'Why store sessions in Redis?', a: 'So every server behind the load balancer can read the same session, and sessions survive app restarts. You can revoke a session instantly by deleting its key, and TTLs expire idle sessions.' },
      ],
      answer30: "Redis is the shared state layer once you have more than one server. For rate limiting I INCR a per-user key for the current window and set an expiry in the same MULTI, returning 429 over the limit; a sorted-set sliding window is more precise. For sessions, Redis lets every instance read the same session and lets me revoke one by deleting a key. Pub/sub broadcasts events across servers, for example to fan out WebSocket updates, but it's fire-and-forget, so for anything that must not be lost I use Streams or a real queue.",
      mistakes: [
        "Rate limiting with an in-memory map behind a load balancer.",
        "Running `INCR` and `EXPIRE` as separate un-atomic calls, risking keys with no TTL that block a user forever.",
        "Using pub/sub for jobs that must not be lost.",
        "Trap: 'Rate limit by IP only?' Many users can share one IP (offices, mobile carriers). Prefer user id or API key when authenticated, IP as a fallback.",
      ],
      takeaway: 'Redis gives many servers one shared counter, session store and broadcast channel; pub/sub is not durable.',
    },

    {
      id: 'firebase-firestore',
      title: 'Firebase: Firestore, Auth and security rules',
      level: 'intermediate',
      priority: 'good',
      frequency: 'occasional',
      summary: 'Firestore is a managed document database clients can talk to directly; Firebase Auth identifies users; security rules are the only thing protecting the data.',
      what: [
        "Firebase is Google's backend-as-a-service. **Cloud Firestore** is a NoSQL document database: data lives in documents grouped into collections, and documents can contain subcollections. **Firebase Auth** handles sign-up and login (email, Google, phone and more).",
        "The big difference from MongoDB with Express: web and mobile clients usually read and write Firestore **directly**, with real-time listeners (`onSnapshot`) that push updates instantly. Because there's no server in between, **security rules** decide who can read or write each document.",
      ],
      deeper: [
        "Rules check `request.auth` (the signed-in user's uid and token claims), `resource.data` (the existing document) and `request.resource.data` (the incoming write). Rules are not filters: a query is rejected unless the rules allow every document it could return, so client queries must include the same conditions the rules check (for example `where('ownerId', '==', uid)`).",
        "Firestore limits shape the design: a document is at most 1 MiB, queries must be backed by an index (single-field indexes are automatic; composite ones you create), there are no joins, and you pay per document read, so you denormalize and keep counters instead of counting. Sustained writes to a single document are limited (roughly one per second), so hot counters use distributed counter shards.",
        "On your own Node backend, use the **Admin SDK**: it bypasses security rules, so it must only run on trusted servers. To authenticate requests from a Firebase client, the client sends its ID token and the server verifies it with `getAuth().verifyIdToken(token)`. Custom claims (like `role: 'admin'`) can be added to tokens for RBAC in rules.",
      ],
      why: "Firebase lets small teams ship real-time apps without running servers. Interviewers ask about it mainly to check that you understand rules are the security boundary, and how its limits differ from MongoDB.",
      analogy: "Firestore with rules is a self-service locker room. There's no attendant (server); each locker's lock (rules) checks your membership card (auth token) before it opens. Leave a lock off and anyone can take anything.",
      code: [
        {
          lang: 'js',
          title: 'Client: modular SDK, query and live updates',
          source: `import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore, collection, query, where, orderBy, limit,
  onSnapshot, addDoc, serverTimestamp,
} from 'firebase/firestore';

const app = initializeApp(firebaseConfig); // public config, not a secret
const db = getFirestore(app);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (!user) return;
  // The query includes ownerId so it matches the security rule below
  const q = query(
    collection(db, 'notes'),
    where('ownerId', '==', user.uid),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  onSnapshot(q, (snap) => {
    console.log(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });

  addDoc(collection(db, 'notes'), { ownerId: user.uid, text: 'Hi', createdAt: serverTimestamp() });
});`,
        },
        {
          lang: 'text',
          title: 'firestore.rules',
          source: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /notes/{noteId} {
      // read/update/delete only your own notes
      allow read, update, delete: if request.auth != null
                                  && resource.data.ownerId == request.auth.uid;
      // create only notes owned by yourself, with a short text field
      allow create: if request.auth != null
                    && request.resource.data.ownerId == request.auth.uid
                    && request.resource.data.text is string
                    && request.resource.data.text.size() < 5000;
    }
  }
}`,
        },
      ],
      output: "After login, the listener logs the user's 20 newest notes and fires again whenever one changes, including the note just added. If the query left out `where('ownerId', '==', uid)`, Firestore would reject it with a permission error, because rules are not filters. Note: `where` plus `orderBy` on different fields needs a composite index, which Firestore's error message links you to create.",
      questions: [
        { q: 'Why are security rules so important in Firebase?', a: 'Clients talk to Firestore directly with a public config, so there\'s no server to enforce access. Rules are the only check on who can read or write each document; missing or open rules expose all data.' },
        { q: 'What does \'rules are not filters\' mean?', a: 'Firestore won\'t silently drop documents you can\'t read. A query is rejected unless the rules allow every document it could return, so the query must include the same conditions the rules check.' },
        { q: 'How does a Node backend verify a Firebase user?', a: 'The client sends its Firebase ID token in the Authorization header, and the server verifies it with the Admin SDK\'s `verifyIdToken`, which gives the uid and custom claims.' },
        { q: 'How is Firestore different from MongoDB?', a: 'Firestore is fully managed, has real-time listeners and direct client access with security rules, but documents max at 1 MiB, there are no joins or aggregation pipeline, every query needs an index, and you pay per document read.' },
      ],
      answer30: "Firebase gives you managed Auth and Firestore, a document database that web and mobile clients can read and write directly with real-time listeners. Since there's no server in between, security rules are the security boundary: they check request.auth and the document data on every read and write, and they're not filters, so queries must match them. On a Node backend I use the Admin SDK, which bypasses rules, and verify client ID tokens with verifyIdToken. Design-wise I denormalize, because there are no joins and reads are billed per document.",
      mistakes: [
        "Shipping test-mode rules (`allow read, write: if true`) to production.",
        "Treating the Firebase web config as a secret, or assuming hiding it adds security; rules do that job.",
        "Using the Admin SDK in client code; it bypasses all rules.",
        "Trap: 'Count all documents cheaply?' Reading them all is billed per document. Use the aggregation `count()` query or maintain a counter document.",
      ],
      note: "Firebase isn't on your resume. Firestore limits and query features change over time (for example, OR queries and range filters on multiple fields were added in recent years), so check the current docs if asked about specifics.",
      takeaway: 'Firestore = managed docs with live listeners; Auth identifies users; rules are your only security, and they are not filters.',
    },

    {
      id: 'connection-pooling',
      title: 'Connection pooling',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Keep a set of open database connections and reuse them; size the pool for the database, and be careful with serverless.',
      what: [
        "Opening a database connection is slow: TCP handshake, TLS, authentication. A **connection pool** opens a number of connections once and lends them to queries as needed, returning them to the pool afterwards.",
        "The MongoDB Node driver (and so Mongoose) pools automatically, with `maxPoolSize` defaulting to 100 per client. In PostgreSQL with `pg`, you create a `Pool` (default `max` is 10) and call `pool.query()`, or check out a client for a transaction and release it.",
      ],
      deeper: [
        "Create **one** pool or client per process at startup and reuse it everywhere. Creating a client per request is a classic bug that exhausts the database's connection limit (PostgreSQL's `max_connections` defaults to 100).",
        "Total connections = pool size x processes x instances. Ten containers with a pool of 20 already need 200 Postgres connections. Each Postgres connection is a backend process using memory, so for many app instances put **PgBouncer** or **RDS Proxy** in front to multiplex connections.",
        "Serverless (Lambda) makes it worse: each concurrent invocation is its own process. Create the client outside the handler so warm invocations reuse it, keep the pool small (often 1 to 5), and use RDS Proxy for relational databases. Atlas handles more connections, but the same rules apply.",
        "When you check out a client for a transaction (`pool.connect()`), always `release()` it in a `finally`. A leaked client means the pool slowly empties and requests start hanging while waiting for a connection.",
      ],
      why: "Pool problems cause some of the most confusing outages: everything looks fine until traffic spikes, then requests hang on 'waiting for connection' or the database refuses new ones. Knowing the arithmetic lets you prevent it.",
      analogy: "A taxi stand. Instead of buying a new car for every trip (new connection), passengers take the next waiting taxi and it comes back to the stand afterwards. If people keep taxis and never return them (leaks), the queue grows until no one can travel.",
      code: {
        lang: 'ts',
        title: 'One pool per process, released in finally',
        source: `import { Pool } from 'pg';
import mongoose from 'mongoose';

// Created ONCE at startup, reused by every request
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,                        // per process
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000, // fail fast instead of hanging forever
});

await mongoose.connect(process.env.MONGO_URL!, { maxPoolSize: 20 });

// Simple queries: pool.query checks out and releases automatically
export const getJob = (id: string) =>
  pool.query('SELECT * FROM jobs WHERE id = $1', [id]).then((r) => r.rows[0]);

// Transactions need ONE client for all statements
export async function transfer(from: string, to: string, amount: number) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, from]);
    await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amount, to]);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release(); // always return the connection
  }
}`,
      },
      output: "Each process keeps up to 10 Postgres connections and up to 20 MongoDB connections open and reuses them. The transfer runs both updates on the same client inside one transaction and always returns that client to the pool, even on error.",
      questions: [
        { q: 'What is connection pooling and why use it?', a: 'Keeping a set of open database connections and reusing them for many queries. It avoids the cost of connecting per request and caps how many connections the app opens.' },
        { q: 'Why can\'t you run a Postgres transaction with `pool.query()` calls?', a: 'Each `pool.query()` may use a different connection, and a transaction belongs to one connection. Check out one client with `pool.connect()`, run BEGIN to COMMIT on it, and release it.' },
        { q: 'How do you size a pool?', a: 'Start from the database\'s connection limit and divide by the number of processes and instances, leaving headroom for admin tools and migrations. Bigger isn\'t better: too many connections slow the database down.' },
        { q: 'What changes with AWS Lambda?', a: 'Every concurrent invocation is a separate process with its own pool. Create the client outside the handler to reuse it on warm starts, keep the pool tiny, and use RDS Proxy (or a serverless-friendly database) to avoid exhausting connections.' },
      ],
      answer30: "Connecting to a database is expensive, so a pool keeps connections open and lends them to queries. I create one pool per process at startup: Mongoose pools automatically with maxPoolSize, and with pg I use a Pool. For transactions I check out a single client and release it in finally, otherwise the pool leaks. I size pools by the database's limit divided by total processes, and in serverless I create the client outside the handler and use something like RDS Proxy.",
      mistakes: [
        "Creating a new client or calling `mongoose.connect` inside each request handler.",
        "Forgetting `client.release()` on an error path.",
        "Setting a huge pool size on many instances and exceeding the database's connection limit.",
        "Trap: 'Requests hang but the DB CPU is low. Why?' Often pool exhaustion: all connections are checked out (leaked or slow queries), so new requests wait for a free one.",
      ],
      note: "On your resume: your Octagnt services use MongoDB from Node, so the one-client-per-process rule applies directly. If you're asked about serverless, only describe Lambda experience you really have.",
      takeaway: 'One pool per process, release in finally, size it against the DB limit times instance count.',
    },

    {
      id: 'sharding-replication',
      title: 'Replication vs sharding',
      level: 'advanced',
      priority: 'good',
      frequency: 'common',
      summary: 'Replication copies the same data to several nodes for availability and read scaling; sharding splits data across nodes to scale writes and size.',
      what: [
        "**Replication** keeps copies of the same data on several servers. In MongoDB a **replica set** has one primary that takes writes and secondaries that copy it; if the primary fails, the members elect a new one automatically. In PostgreSQL you add read replicas fed by streaming replication.",
        "**Sharding** splits one dataset across several servers (shards), each holding part of the data. In MongoDB a **shard key** decides which shard a document belongs to, and a router (`mongos`) sends each query to the right shard.",
      ],
      deeper: [
        "Replication gives high availability and read scaling, but every node still holds all data and every write still goes to one primary. Replicas are usually asynchronous, so reading from a secondary can return slightly old data (**replication lag**). Read your own writes from the primary, and use write concern `majority` so acknowledged writes survive a failover.",
        "Sharding scales writes and storage, but it's complex. The shard key is the most important decision: it needs high cardinality, even distribution, and should appear in most queries. A monotonically increasing key like `createdAt` sends all new writes to one shard (a hot shard); a hashed key spreads writes but makes range queries hit every shard. Queries without the shard key become **scatter-gather** to all shards. In a multi-tenant app, `{ tenantId, _id }` or a hashed tenant key is a common choice, watching for one giant tenant.",
        "This connects to the **CAP theorem**: during a network partition, a distributed system must choose between consistency and availability. MongoDB with majority write concern leans towards consistency; many systems let you tune it per operation.",
        "Order of scaling: first fix queries and indexes, then scale up the machine, add caching and read replicas, and only shard when one primary truly can't handle the writes or data size.",
      ],
      why: "System design rounds almost always reach 'how would this scale?'. You should explain that replication is for availability and reads, sharding is for writes and size, and that sharding is a last step because it adds lots of complexity.",
      analogy: "Replication is printing several copies of the same encyclopedia for different libraries: if one burns down, others still have everything. Sharding is splitting one encyclopedia into volumes A-F, G-M, N-Z on different shelves: more room in total, but you need the index to know which shelf to visit.",
      code: {
        lang: 'js',
        title: 'Replica set reads and a shard key (mongosh)',
        source: `// Replica set connection string: driver discovers the primary and fails over automatically
// mongodb://db1,db2,db3/app?replicaSet=rs0&w=majority&readPreference=primary

// Analytics can tolerate slightly stale data -> read from secondaries
db.events.find({ tenantId: ObjectId("t1") }).readPref("secondaryPreferred")

// Sharding a multi-tenant collection
sh.enableSharding("app")   // optional since MongoDB 6.0, shown for clarity
db.applications.createIndex({ tenantId: 1, _id: 1 })
sh.shardCollection("app.applications", { tenantId: 1, _id: 1 })

// Targeted query: includes the shard key prefix -> goes to one shard
db.applications.find({ tenantId: ObjectId("t1"), status: "new" })

// Scatter-gather: no shard key -> asks every shard
db.applications.find({ status: "new" })`,
      },
      output: "The app reads from the primary by default, so it always sees its own writes, while analytics reads go to secondaries. After sharding, a query with `tenantId` is routed to one shard, but a query without it is sent to all shards and merged, which gets slower as shards are added.",
      questions: [
        { q: 'What is the difference between replication and sharding?', a: 'Replication copies all data to several nodes for high availability and read scaling. Sharding splits the data across nodes so each holds a part, which scales writes and storage.' },
        { q: 'What makes a good shard key?', a: 'High cardinality, even distribution of writes, and presence in most queries so they can be routed to one shard. Avoid monotonically increasing keys like timestamps on their own, which create a hot shard.' },
        { q: 'What is replication lag and why does it matter?', a: 'Secondaries apply the primary\'s changes slightly later. Reading from a secondary right after a write may return old data, so read-your-own-write flows should read from the primary.' },
        { q: 'When would you shard?', a: 'Only after optimizing queries and indexes, scaling up, caching and adding replicas, when a single primary can no longer handle the write rate or the data size. Sharding adds a lot of operational complexity.' },
        { q: 'What happens when a MongoDB primary fails?', a: 'The remaining members hold an election and a secondary becomes primary, usually within seconds. Drivers with retryable writes reconnect automatically; writes acknowledged with `majority` aren\'t lost.' },
      ],
      answer30: "Replication keeps full copies of the data on several nodes. In MongoDB that's a replica set with one primary and automatic failover, which gives availability and lets me scale reads, at the cost of replication lag on secondaries. Sharding splits data across nodes by a shard key to scale writes and storage. The shard key should have high cardinality, spread writes evenly and be in most queries, otherwise you get hot shards or scatter-gather queries. I'd shard last, after indexes, caching and replicas.",
      mistakes: [
        "Saying replicas scale writes; all writes still go to one primary.",
        "Choosing a timestamp or auto-increment shard key and creating one hot shard.",
        "Reading from secondaries right after a write and showing users stale data.",
        "Trap: 'Is a replica set a backup?' No. A bad delete replicates to every member in seconds. You still need point-in-time backups.",
      ],
      takeaway: 'Replicate for availability and reads, shard for writes and size, and shard last with a well-chosen key.',
    },

    {
      id: 'choosing-a-database',
      title: 'Choosing a database',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Start from access patterns, consistency needs and team skills; most apps need one primary database plus a cache.',
      what: [
        "There is no best database, only a best fit for a workload. Ask: What does the data look like? How will it be queried? How much consistency do we need? How will it grow? What does the team already know how to run?",
        "A common modern setup is one primary database (PostgreSQL or MongoDB) for the source of truth, Redis for caching and short-lived state, object storage like S3 for files, and a search engine like OpenSearch only when full-text search becomes a real feature.",
      ],
      deeper: [
        "Rules of thumb: **PostgreSQL** for relational data, strong constraints, complex reporting, financial data. **MongoDB** for document-shaped data read as a whole, evolving schemas, and easy horizontal scaling. **Redis** for caching, rate limits, sessions, leaderboards. **Firestore** for small teams that want real-time sync with mobile and web clients and no servers. **DynamoDB** for huge scale with well-known key-based access patterns. **Elasticsearch/OpenSearch** for full-text search and log analytics. Time-series and vector stores (or extensions like pgvector, or Atlas Vector Search) for metrics and AI embeddings.",
        "Polyglot persistence (many databases) has a cost: more systems to run, monitor, back up and keep in sync. Add a second database only when the first clearly can't serve a need. Many teams go far with Postgres plus `jsonb`, or MongoDB plus Atlas Search.",
        "In interviews, answer as a trade-off: name the requirements, say what you'd pick and why, and say what you'd give up and how you'd handle it.",
      ],
      why: "System design interviews nearly always include 'which database would you use and why?'. A structured answer based on requirements shows judgement; naming a favourite database doesn't.",
      analogy: "Choosing a vehicle. A truck, a scooter and a bus are all 'best' for different jobs. You don't pick by which one is newest; you pick by what you carry, how far, and who drives it.",
      code: {
        lang: 'text',
        title: 'A quick decision guide',
        source: `Need                                        -> Good default
------------------------------------------------------------------------------
Relational data, joins, constraints, money  -> PostgreSQL
Whole-object reads, flexible/evolving shape -> MongoDB
Cache, sessions, rate limits, leaderboards  -> Redis
Real-time mobile/web sync, no backend team  -> Firebase Firestore
Massive scale, simple key-based access      -> DynamoDB / Cassandra
Full-text search, log analytics             -> OpenSearch / Elasticsearch
Files, images, videos                       -> S3 (store only the key in the DB)
AI embeddings / semantic search             -> pgvector, Atlas Vector Search, or a vector DB

Questions to ask first:
1. What are the top 3 reads and writes, and how often?
2. How strong must consistency be (money? counters? feeds)?
3. Expected size and growth in 1-2 years?
4. What does the team already operate well?`,
      },
      output: "This is a starting point, not a rule. For example, a recruiting SaaS with tenant-scoped candidate profiles, flexible fields and AI features fits MongoDB well, with Redis for caching and S3 for resumes and videos; a billing ledger in the same company would fit PostgreSQL better.",
      questions: [
        { q: 'Which database would you choose for a new app and why?', a: 'It depends on the access patterns and consistency needs. For heavily relational data with reporting I\'d pick PostgreSQL; for document-shaped data read as a whole I\'d pick MongoDB. Either way I\'d add Redis for caching only when needed.' },
        { q: 'Why not store files in the database?', a: 'Large binaries bloat the database, backups and memory. Store files in object storage like S3 and keep only the key and metadata in the database, using presigned URLs for upload and download.' },
        { q: 'What is polyglot persistence and what\'s the downside?', a: 'Using different databases for different needs. The downside is more systems to operate, monitor, secure and keep in sync, so only add one when the main database clearly can\'t do the job.' },
        { q: 'Why did your team use MongoDB?', a: 'Answer with real reasons: document-shaped data like candidate profiles with varying fields, fast iteration on schemas, and good fit with Node. Also mention what you did to cover its gaps, like strict Mongoose schemas and careful indexes.' },
      ],
      answer30: "I choose by requirements, not preference. I look at the main reads and writes, consistency needs, growth and what the team can operate. Relational data with constraints and reporting goes to PostgreSQL; document-shaped data read as a whole goes to MongoDB; Redis handles caching and short-lived state; files go to S3 with just the key in the database. I avoid adding extra databases until there's a clear need, because each one adds operational cost.",
      mistakes: [
        "Answering with a favourite database before asking about the access patterns.",
        "Adding Redis, Elasticsearch and a graph database to a design that needs one database.",
        "Storing large files as blobs in MongoDB or Postgres.",
        "Trap: 'MongoDB because it scales better?' Both scale a long way; say what specifically about the workload makes one fit better.",
      ],
      note: "On your resume: Octagnt uses MongoDB for tenant data and S3 for uploaded files (see the projects topics on the public upload API and the SQS bulk pipeline). Give your real reasons for that choice if asked.",
      takeaway: 'Pick by access pattern, consistency and team skill; one primary DB plus a cache covers most apps.',
    },
  ],
  rapidFire: [
    { q: 'Max MongoDB document size?', a: '16 MB.' },
    { q: 'Are single-document writes in MongoDB atomic?', a: 'Yes, even when they change many nested fields.' },
    { q: 'What does MongoDB need for multi-document transactions?', a: 'A replica set or sharded cluster, and the session passed to every operation.' },
    { q: 'Embed or reference an unbounded list?', a: 'Reference it from the child side; never grow an array forever.' },
    { q: 'What is the ESR rule?', a: 'Order compound index fields: Equality, then Sort, then Range.' },
    { q: 'COLLSCAN vs IXSCAN in explain()?', a: 'COLLSCAN reads every document; IXSCAN uses an index.' },
    { q: 'Can `{ a: 1, b: 1 }` serve a query on `b` alone?', a: 'Not efficiently; compound indexes serve their prefixes.' },
    { q: 'Does Mongoose validate on `updateOne`?', a: 'Only with `runValidators: true`.' },
    { q: 'Is `unique: true` a Mongoose validator?', a: 'No, it builds a unique index; duplicates throw error 11000.' },
    { q: 'Does `findOneAndUpdate` run `pre(\'save\')` hooks?', a: 'No, only query middleware.' },
    { q: 'What does `lean()` return?', a: 'Plain JS objects: faster, but no save(), getters or virtuals.' },
    { q: 'Is Mongoose populate a join?', a: 'No, it runs a second `$in` query and merges in memory.' },
    { q: 'Where should `$match` go in a pipeline?', a: 'As early as possible, so it uses indexes and shrinks data.' },
    { q: 'Does Mongoose cast ids in `aggregate()`?', a: 'No, convert strings to ObjectId yourself.' },
    { q: 'INNER vs LEFT JOIN?', a: 'INNER keeps only matches; LEFT keeps all left rows with NULLs.' },
    { q: 'WHERE vs HAVING?', a: 'WHERE filters rows before grouping; HAVING filters groups after.' },
    { q: 'Default isolation level in PostgreSQL?', a: 'Read Committed.' },
    { q: 'What does ACID stand for?', a: 'Atomicity, Consistency, Isolation, Durability.' },
    { q: 'Are foreign keys indexed automatically in Postgres?', a: 'No, index the referencing column yourself.' },
    { q: 'EXPLAIN vs EXPLAIN ANALYZE?', a: 'EXPLAIN shows the plan; ANALYZE runs it and shows real times.' },
    { q: 'Fix for N+1 queries?', a: 'Batch ids into one $in / IN query, join, or use DataLoader.' },
    { q: 'Why is offset pagination slow on deep pages?', a: 'The database still walks past every skipped row.' },
    { q: 'Cache-aside on write: update or delete the key?', a: 'Delete it, after the database write succeeds.' },
    { q: 'Is Redis pub/sub durable?', a: 'No, offline subscribers miss messages; use Streams or a queue.' },
    { q: 'Are Firestore security rules filters?', a: 'No, queries must match the rules or they are rejected.' },
    { q: 'Replication vs sharding in one line?', a: 'Replication copies data for availability and reads; sharding splits it for writes and size.' },
  ],
};

export default databases;
