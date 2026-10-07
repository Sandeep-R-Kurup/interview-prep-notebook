// Cloud and DevOps stack. Topics are auto-sorted Basic -> Intermediate -> Advanced by the registry.

const cloud = {
  name: 'Cloud and DevOps',
  intro: 'AWS services a full-stack engineer actually touches, plus Docker, Kubernetes, CI/CD and safe deployments. Learn the simple version first, then the limits and trade-offs interviewers like to probe.',
  topics: [
    {
      id: 'cloud-basics',
      title: 'Cloud basics: IaaS, PaaS, SaaS, regions and AZs',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'How much of the stack you manage (IaaS vs PaaS vs SaaS), and where AWS runs it (regions made of isolated availability zones).',
      what: [
        "Cloud computing means renting servers, storage and services over the internet and paying for what you use, instead of buying hardware.",
        "The models differ by how much you manage. **IaaS** (Infrastructure as a Service, like EC2) gives you a virtual machine; you manage the OS, runtime and app. **PaaS** (like Elastic Beanstalk, Heroku or Vercel) runs your code; you manage only the app. **SaaS** (like Gmail or Jira) is a finished product you just use. Serverless (Lambda) sits close to PaaS: you give it a function, it runs it.",
        "A **region** is a geographic area (like `ap-south-1`, Mumbai). Each region has several **availability zones** (AZs): separate data centres with their own power and network, close enough for fast links. Spreading your app across AZs keeps it up if one data centre fails.",
      ],
      deeper: [
        "The **shared responsibility model**: AWS secures the cloud itself (hardware, physical data centres, the hypervisor); you secure what you put in it (IAM, your data, security groups, patching your EC2 OS). The more managed the service, the more AWS takes on.",
        "Pick a region by: distance to users (latency), data residency laws, service availability (not every service is in every region) and price. Multi-AZ is the normal way to get high availability; multi-region is for disaster recovery and global latency, and it is much harder (data replication, failover).",
        "Some services are global (IAM, CloudFront, Route 53), most are regional (S3 buckets live in a region, even though bucket names are globally unique), and some are zonal (an EC2 instance or EBS volume lives in one AZ).",
      ],
      why: "It's the vocabulary for every other cloud question. Knowing what you manage under each model, and how AZs give high availability, shows you can reason about cost, effort and failure.",
      analogy: "IaaS is renting an empty flat (you furnish and clean it). PaaS is a serviced apartment (furniture and cleaning included, you just live there). SaaS is a hotel room (you only bring yourself). Regions are cities; AZs are separate buildings in the same city with separate power supplies.",
      code: {
        lang: 'text',
        title: 'Who manages what',
        source: `                IaaS (EC2)   PaaS (Beanstalk)   Serverless (Lambda)   SaaS (Gmail)
Application        you            you                you                vendor
Runtime            you            vendor             vendor             vendor
OS / patching      you            vendor             vendor             vendor
Servers / scaling  you*           vendor             vendor             vendor
Hardware           AWS            AWS                AWS                vendor

* you configure Auto Scaling; AWS provides the machines

Region ap-south-1 (Mumbai)
  ├── AZ ap-south-1a   (data centre group A)
  ├── AZ ap-south-1b   (data centre group B)
  └── AZ ap-south-1c   (data centre group C)
  -> run app servers in 2+ AZs behind a load balancer`,
      },
      output: "The table shows responsibility moving from you to the vendor as you go right. The region diagram shows why you deploy into at least two AZs: if one goes down, the load balancer sends traffic to the others.",
      questions: [
        { q: 'What is the difference between IaaS, PaaS and SaaS?', a: 'How much you manage. IaaS gives you virtual machines and you manage the OS and up. PaaS runs your code and manages the OS and runtime. SaaS is a finished application you just use.' },
        { q: 'What is the difference between a region and an availability zone?', a: 'A region is a geographic area like Mumbai or Ireland. An availability zone is one or more isolated data centres inside a region. Regions contain several AZs connected by fast, low-latency links.' },
        { q: 'How do you make an app highly available on AWS?', a: 'Run at least two instances in different availability zones behind a load balancer, use a managed database with Multi-AZ failover, and keep the app stateless so any instance can serve any request.' },
        { q: 'What is the shared responsibility model?', a: 'AWS is responsible for security of the cloud: hardware, data centres, the virtualisation layer. You are responsible for security in the cloud: IAM permissions, your data and encryption, network rules, and patching any OS you manage.' },
      ],
      answer30: "IaaS, PaaS and SaaS differ in how much you manage. With IaaS like EC2 you get a virtual machine and manage the OS upward. With PaaS or serverless you hand over code and the provider runs it. SaaS is a finished product. AWS is split into regions, which are geographic areas, and each region has multiple availability zones, which are isolated data centres. For high availability I run stateless app servers in at least two AZs behind a load balancer, with a Multi-AZ database.",
      mistakes: [
        "Thinking an AZ is a single server or that a region is a single data centre.",
        "Running everything in one AZ and calling it highly available.",
        "Assuming every AWS service and instance type is available in every region. Check before you design around it.",
        "Trap: 'Is serverless the same as no servers?' No. There are servers; you just don't manage, patch or scale them.",
      ],
      takeaway: 'IaaS -> PaaS -> SaaS hands more work to the vendor; regions contain isolated AZs, and HA means spanning AZs.',
    },

    {
      id: 'aws-ec2',
      title: 'EC2, Auto Scaling and load balancers',
      level: 'basic',
      priority: 'good',
      frequency: 'common',
      summary: 'Virtual servers you rent by the second, scaled by Auto Scaling groups and fronted by a load balancer.',
      what: [
        "EC2 (Elastic Compute Cloud) gives you virtual machines called instances. You pick an instance type (CPU and memory size, like `t3.micro` or `m7g.large`), an AMI (the disk image with the OS), and a security group (a firewall).",
        "An **Auto Scaling group** keeps a chosen number of instances running and adds or removes them based on load (for example, keep average CPU at 50%). An **Application Load Balancer** (ALB) spreads HTTP traffic across the healthy instances.",
      ],
      deeper: [
        "Pricing options: **On-Demand** (pay per second, no commitment), **Savings Plans / Reserved** (commit for 1 or 3 years, much cheaper), and **Spot** (spare capacity at a big discount, but AWS can take it back with a two-minute warning; good for batch jobs and stateless workers).",
        "Instance storage: **EBS** volumes are network disks that survive a stop/start and can be snapshotted. **Instance store** is a fast local disk that is lost when the instance stops. Never keep important state only on the instance.",
        "Security groups are stateful (if inbound is allowed, the reply is allowed) and only have allow rules. Use IAM roles attached to the instance (instance profiles) instead of storing access keys on the server.",
        "Graviton (ARM, the `g` in `m7g`) instances are usually cheaper for the same performance; Node.js runs fine on them, but check native npm modules.",
      ],
      why: "EC2 is the basic building block when you need full control: long-running processes, custom software, or steady load where serverless pricing gets expensive. Many 'how would you deploy this' answers start here or with containers.",
      analogy: "An EC2 instance is a rented car. Auto Scaling is the rental office that adds more cars when the queue grows and returns them when it shrinks. The load balancer is the dispatcher sending each customer to a free car.",
      code: {
        lang: 'bash',
        title: 'Launch an instance with the AWS CLI',
        source: `aws ec2 run-instances \\
  --image-id ami-0abcdef1234567890 \\
  --instance-type t3.micro \\
  --subnet-id subnet-0123abcd \\
  --security-group-ids sg-0123abcd \\
  --iam-instance-profile Name=app-server-role \\
  --user-data file://bootstrap.sh \\
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=api-1}]'

# bootstrap.sh runs once on first boot, for example:
#   install Docker, pull the app image, start it`,
      },
      output: "AWS starts one `t3.micro` instance in the given subnet with the firewall rules from the security group and the permissions of the attached IAM role. On first boot it runs `bootstrap.sh`. In real projects you would put this in a launch template used by an Auto Scaling group, not launch instances by hand.",
      questions: [
        { q: 'What is an Auto Scaling group?', a: 'A group that keeps a desired number of EC2 instances running, replaces unhealthy ones, and scales in or out based on policies like target CPU or request count per target.' },
        { q: 'What is the difference between a security group and a network ACL?', a: 'A security group is attached to an instance or ENI, is stateful, and only has allow rules. A network ACL is attached to a subnet, is stateless (you must allow return traffic) and supports deny rules.' },
        { q: 'When would you use Spot instances?', a: 'For interruptible, stateless work such as batch processing, queue workers or CI runners. They are much cheaper, but AWS can reclaim them with a two-minute notice, so the work must be safe to retry.' },
        { q: 'How should an app on EC2 get AWS credentials?', a: 'Through an IAM role attached as an instance profile. The SDK picks up temporary, auto-rotated credentials from the instance metadata service, so no access keys live on the server.' },
      ],
      answer30: "EC2 gives you virtual machines. You choose an instance type, an AMI and a security group. For production I wouldn't manage instances by hand: I'd use a launch template and an Auto Scaling group across two or more AZs, behind an Application Load Balancer that health-checks instances. The app gets AWS access through an IAM role, not stored keys. For cost, On-Demand for spiky or new workloads, Savings Plans for steady load, and Spot for interruptible workers.",
      mistakes: [
        "Hard-coding AWS access keys on the instance instead of using an instance role.",
        "Opening SSH (port 22) to `0.0.0.0/0`. Use Session Manager or restrict to known IPs.",
        "Storing uploads or sessions on the instance disk, which breaks when Auto Scaling replaces it.",
        "Trap: 'What happens to data when you stop vs terminate?' EBS root volumes survive a stop; by default the root volume is deleted on terminate. Instance store data is lost on both.",
      ],
      takeaway: 'EC2 = rented VMs; in production use Auto Scaling + ALB across AZs, IAM roles for credentials, and keep instances stateless.',
    },

    {
      id: 'aws-s3',
      title: 'S3: buckets, presigned URLs, storage classes, lifecycle',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Object storage for files; presigned URLs let browsers upload or download directly; storage classes and lifecycle rules control cost.',
      note: "On your resume: on Octagnt you built a public, token-based API that gives candidates short-lived presigned URLs to upload videos straight to S3, and the bulk CV pipeline stores files in S3 before queueing them (see My Resume and Projects).",
      what: [
        "S3 (Simple Storage Service) stores files, called **objects**, inside **buckets**. Each object has a **key** (its path-like name, such as `tenant-42/cv/abc.pdf`), the bytes, and metadata. There are no real folders; the slashes are just part of the key.",
        "A **presigned URL** is a temporary link signed with your credentials. Anyone holding it can do one specific thing (for example, PUT one object to one key) until it expires. This lets the browser upload or download directly from S3 without the file passing through your server.",
        "**Storage classes** trade price against access speed: Standard for hot data, Standard-IA for rarely read data, Intelligent-Tiering when you don't know, and the Glacier classes for archives. **Lifecycle rules** move or delete objects automatically after some days.",
      ],
      deeper: [
        "S3 has strong read-after-write consistency (since December 2020): after a successful PUT, a GET returns the new object. A single PUT can upload up to 5 GB; larger files need **multipart upload** (recommended from about 100 MB), which also lets you retry parts and upload them in parallel.",
        "A presigned PUT cannot limit file size. To enforce size or content type, use a **presigned POST** with policy conditions like `content-length-range`, or check the object after upload (an S3 event can trigger a Lambda that validates it). Presigned URLs made with temporary credentials (like a role) stop working when those credentials expire, even if the URL's own expiry is longer.",
        "Security: keep **Block Public Access** on, encrypt at rest (SSE-S3 is the default for new objects), use bucket policies and IAM for access, and serve public assets through CloudFront with Origin Access Control instead of making the bucket public.",
        "Lifecycle examples: move logs to Standard-IA after 30 days and Glacier after 90, delete after a year; abort incomplete multipart uploads after 7 days (otherwise the orphaned parts are billed); expire old versions in a versioned bucket.",
      ],
      why: "Almost every app stores files: CVs, avatars, videos, exports. S3 is cheap, very durable and scales without effort. Presigned URLs keep large uploads off your API servers, which saves memory, bandwidth and timeouts.",
      analogy: "S3 is a huge warehouse of labelled boxes. A presigned URL is a one-time gate pass: it lets one courier drop off one specific box before a deadline, without giving them a key to the warehouse.",
      code: [
        {
          lang: 'ts',
          title: 'Issue a presigned upload URL (AWS SDK v3)',
          source: `import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'node:crypto';

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function createUploadUrl(tenantId: string, contentType: string) {
  // The server builds the key, never the client, so users can't overwrite other files
  const key = \`\${tenantId}/uploads/\${randomUUID()}\`;
  const command = new PutObjectCommand({
    Bucket: process.env.UPLOAD_BUCKET,
    Key: key,
    ContentType: contentType,
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 minutes
  return { url, key };
}

// Browser side:
// await fetch(url, { method: 'PUT', headers: { 'Content-Type': type }, body: file });`,
        },
        {
          lang: 'json',
          title: 'Lifecycle rule: tier down, then expire',
          source: `{
  "Rules": [
    {
      "ID": "logs-tiering",
      "Filter": { "Prefix": "logs/" },
      "Status": "Enabled",
      "Transitions": [
        { "Days": 30, "StorageClass": "STANDARD_IA" },
        { "Days": 90, "StorageClass": "GLACIER" }
      ],
      "Expiration": { "Days": 365 }
    },
    {
      "ID": "cleanup-multipart",
      "Filter": {},
      "Status": "Enabled",
      "AbortIncompleteMultipartUpload": { "DaysAfterInitiation": 7 }
    }
  ]
}`,
        },
      ],
      output: "`createUploadUrl` returns a URL valid for 5 minutes that allows exactly one PUT to the server-chosen key. The browser uploads the file directly to S3, and the API only stores the key. The lifecycle JSON moves objects under `logs/` to cheaper classes at 30 and 90 days, deletes them at 365 days, and cleans up abandoned multipart uploads.",
      questions: [
        { q: 'What is a presigned URL and why use it?', a: 'A temporary URL signed with server credentials that allows one specific S3 action, like uploading to one key, until it expires. Browsers upload or download directly from S3, so big files never pass through your API servers.' },
        { q: 'How do you stop users uploading huge files through a presigned URL?', a: 'A presigned PUT cannot enforce size. Use a presigned POST with a `content-length-range` condition, or validate the object after upload with an S3 event and delete anything too large.' },
        { q: 'Name some S3 storage classes and when to use them.', a: 'Standard for frequently accessed data, Standard-IA for data read rarely but needed fast, Intelligent-Tiering when access patterns are unknown, and Glacier Instant, Flexible Retrieval or Deep Archive for archives with cheaper storage and slower or costlier retrieval.' },
        { q: 'What are S3 lifecycle rules?', a: 'Rules on a bucket or prefix that automatically move objects to cheaper storage classes or delete them after a number of days. They are also used to expire old versions and abort incomplete multipart uploads.' },
        { q: 'Is S3 eventually consistent?', a: 'Not any more. Since December 2020, S3 gives strong read-after-write consistency for all PUTs and DELETEs, so a read right after a successful write returns the latest data.' },
      ],
      answer30: "S3 is object storage: buckets hold objects addressed by keys. For uploads I don't stream files through Node. The API checks the user, builds the key on the server, and returns a short-lived presigned URL, and the browser uploads straight to S3. For cost, I pick storage classes by access pattern and add lifecycle rules to move old data to Infrequent Access or Glacier and to clean up incomplete multipart uploads. Buckets stay private with Block Public Access on, and public assets go through CloudFront.",
      mistakes: [
        "Letting the client choose the S3 key, so one user can overwrite another's files.",
        "Making a bucket public to serve images instead of using CloudFront with Origin Access Control.",
        "Long expiry times on presigned URLs. Keep them to minutes.",
        "Forgetting CORS on the bucket, so browser PUTs to the presigned URL fail.",
        "Trap: 'What is the maximum object size?' A single PUT is limited to 5 GB, so bigger files use multipart upload. The total object limit was raised from 5 TB to 50 TB in December 2025.",
      ],
      takeaway: 'Server builds the key, issues a short-lived presigned URL, browser talks to S3; lifecycle rules keep the bill down.',
    },

    {
      id: 'lambda-serverless',
      title: 'Lambda and serverless: cold starts and limits',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Functions that run on events and bill per millisecond; know cold starts, the 15-minute limit, and when serverless is the wrong fit.',
      note: "Limits change. As of 2026: max timeout 15 minutes, memory 128 MB to 10,240 MB, `/tmp` 512 MB default up to 10 GB, synchronous payload 6 MB, asynchronous payload 1 MB (raised from 256 KB in October 2025), default concurrency 1,000 per region (a soft quota). Check the Lambda quotas page before quoting numbers in an interview.",
      what: [
        "AWS Lambda runs your function when an event happens: an HTTP request through API Gateway, a file landing in S3, a message on SQS, a schedule. You don't manage servers. You pay per request and per millisecond of run time, scaled by the memory you choose.",
        "A **cold start** happens when Lambda has no warm environment ready: it must create one, download your code, start the runtime and run your top-level code before handling the event. Later requests reuse that warm environment, so they're fast.",
      ],
      deeper: [
        "Each environment handles one request at a time. Ten simultaneous requests need ten environments, so a traffic spike causes many cold starts at once. Concurrency is capped per account and region; **reserved concurrency** caps (and guarantees) one function's share, and **provisioned concurrency** keeps environments pre-warmed for a fee.",
        "Reducing cold starts in Node: keep the bundle small (bundle with esbuild, import only the AWS SDK v3 clients you need), do expensive setup (DB connections, SDK clients) outside the handler so it's reused, and give more memory (CPU scales with memory). SnapStart snapshots an initialised environment, but it supports Java, Python and .NET, not Node.js.",
        "Watch out for databases: many concurrent Lambdas can open too many connections to RDS. Use RDS Proxy, or a database built for HTTP/connectionless access like DynamoDB. For MongoDB, cache the client outside the handler and keep the pool small.",
        "Invocation types: **synchronous** (API Gateway waits for the answer), **asynchronous** (S3, SNS, EventBridge; Lambda queues the event and retries twice on error, then can send it to a failure destination or DLQ), and **poll-based** event source mappings (SQS, Kinesis, DynamoDB Streams), where Lambda polls and invokes you with batches.",
        "When not to use Lambda: work longer than 15 minutes, steady high traffic (containers may be cheaper), WebSocket servers holding connections, or latency-critical paths that cannot tolerate cold starts.",
      ],
      why: "Serverless removes server management and scales to zero, which is perfect for spiky or event-driven work like processing uploads or queue messages. Interviewers want to see you know its limits, not just its benefits.",
      analogy: "Lambda is a taxi rank. If a taxi is waiting, you leave immediately (warm). If not, one has to be called from the depot first (cold start). You pay only for the ride, but a 15-minute ride is the maximum.",
      code: {
        lang: 'ts',
        title: 'SQS-triggered Lambda with partial batch failures',
        source: `import type { SQSEvent, SQSBatchResponse } from 'aws-lambda';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

// Runs once per cold start, then reused by warm invocations
const s3 = new S3Client({});

export const handler = async (event: SQSEvent): Promise<SQSBatchResponse> => {
  const batchItemFailures: { itemIdentifier: string }[] = [];

  for (const record of event.Records) {
    try {
      const { bucket, key } = JSON.parse(record.body);
      const obj = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
      await processFile(await obj.Body!.transformToString());
    } catch (err) {
      console.error('failed', record.messageId, err);
      // Only this message is retried, not the whole batch
      batchItemFailures.push({ itemIdentifier: record.messageId });
    }
  }
  return { batchItemFailures };
};

async function processFile(text: string) {
  /* parse, extract, save idempotently */
}`,
      },
      output: "Lambda receives a batch of SQS messages. Each one is processed separately. Failed message ids are returned in `batchItemFailures` (this needs `ReportBatchItemFailures` enabled on the event source mapping), so SQS deletes the successful ones and only the failed ones become visible again for retry. The S3 client is created once per environment and reused.",
      questions: [
        { q: 'What is a cold start and how do you reduce it?', a: 'The delay when Lambda must create a new environment, load your code and run init before the first request. Reduce it with smaller bundles, fewer imports, initialising clients outside the handler, more memory, or provisioned concurrency for latency-critical functions.' },
        { q: 'What are the main Lambda limits?', a: 'A 15-minute maximum run time, up to 10,240 MB memory, a 6 MB synchronous request/response payload, 1 MB for asynchronous invokes, and a default regional concurrency of 1,000 that you can request to raise.' },
        { q: 'When would you not use Lambda?', a: 'For jobs longer than 15 minutes, steady high-volume traffic where containers are cheaper, long-lived connections like WebSocket servers, or very latency-sensitive paths where cold starts are unacceptable.' },
        { q: 'Why initialise database clients outside the handler?', a: 'Code outside the handler runs once per environment and is reused by warm invocations. Creating clients inside the handler would open a new connection on every request, which is slow and can exhaust database connections.' },
        { q: 'What is the difference between reserved and provisioned concurrency?', a: 'Reserved concurrency sets aside and caps how many environments one function can use. Provisioned concurrency keeps a number of environments initialised and warm in advance to avoid cold starts, and you pay for it while it is on.' },
      ],
      answer30: "Lambda runs functions on events and bills per millisecond, so it's great for spiky, event-driven work like processing S3 uploads or queue messages. The trade-offs are cold starts, a 15-minute maximum run time, payload limits, and concurrency limits that can overwhelm a relational database. I keep bundles small, create clients outside the handler, use partial batch responses with SQS, and add provisioned concurrency only where latency really matters. For long or steady workloads I'd use containers instead.",
      mistakes: [
        "Opening a new DB connection inside the handler on every invocation.",
        "Setting the SQS visibility timeout shorter than the Lambda timeout, so messages are retried while still running. AWS recommends at least six times the function timeout.",
        "Throwing on one bad message without partial batch responses, so the whole batch is retried.",
        "Assuming `/tmp` or global variables persist forever. They survive only while that environment stays warm.",
        "Trap: 'Does more memory cost more?' Per millisecond, yes, but CPU scales with memory, so the function may finish faster and cost the same or less.",
      ],
      takeaway: 'Lambda is event-driven, pay-per-use compute; design around cold starts, 15 minutes, payload and concurrency limits.',
    },

    {
      id: 'api-gateway',
      title: 'API Gateway',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'A managed front door for APIs: routing, auth, throttling, CORS and stages, usually in front of Lambda.',
      note: "REST APIs have a default 29-second integration timeout. Since June 2024 it can be raised for Regional and private REST APIs (with a possible reduction in throttle quota); HTTP APIs max out at 30 seconds. Payloads are limited to 10 MB. Verify current quotas before relying on them.",
      what: [
        "Amazon API Gateway receives HTTP requests and forwards them to a backend: usually a Lambda function, but also any HTTP service or AWS service. It handles routing, authentication, rate limiting, CORS and versioned stages (like `dev` and `prod`) for you.",
        "There are three flavours: **HTTP APIs** (simpler, cheaper, lower latency, JWT authorizers built in), **REST APIs** (more features: API keys and usage plans, request validation, caching, WAF) and **WebSocket APIs** (two-way connections).",
      ],
      deeper: [
        "Auth options: IAM (signed requests), Cognito user pools, JWT authorizers (HTTP APIs) and Lambda authorizers (your own code that checks a token and returns an allow/deny policy, with optional caching).",
        "Throttling uses a token bucket: a steady rate plus a burst. Clients over the limit get `429 Too Many Requests`. Usage plans with API keys let you give different customers different quotas (on REST APIs). API keys are for metering, not for authentication.",
        "With a Lambda proxy integration, the whole request (path, headers, query, body) is passed to the function as an event, and the function returns `{ statusCode, headers, body }`. Long-running work should not sit behind API Gateway: return `202 Accepted` and process asynchronously via a queue.",
      ],
      why: "It gives you a production-ready HTTP front end without running servers: TLS, auth, throttling and monitoring are built in, and it pairs naturally with Lambda for serverless APIs.",
      analogy: "API Gateway is a hotel reception desk. It checks your ID, tells you which room to go to, limits how many people enter at once, and keeps a log, so the staff in the rooms can just do their jobs.",
      code: {
        lang: 'ts',
        title: 'Lambda handler behind an HTTP API (payload v2)',
        source: `import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  const id = event.pathParameters?.id;          // from route GET /jobs/{id}
  const tenant = event.requestContext.authorizer?.jwt?.claims?.tenant_id;

  if (!id) {
    return { statusCode: 400, body: JSON.stringify({ error: 'id required' }) };
  }
  const job = await findJob(String(tenant), id);
  return job
    ? { statusCode: 200, headers: { 'content-type': 'application/json' }, body: JSON.stringify(job) }
    : { statusCode: 404, body: JSON.stringify({ error: 'not found' }) };
};

async function findJob(tenant: string, id: string) {
  return { id, tenant, title: 'Backend Engineer' };
}`,
      },
      output: "A request to `GET /jobs/42` with a valid JWT reaches the function with `id = '42'` and the tenant id from the verified token claims. The function returns a JSON 200 response. Requests without a valid token are rejected by the JWT authorizer before the function runs, so you don't pay for them.",
      questions: [
        { q: 'What does API Gateway do?', a: 'It is a managed HTTP front door: it routes requests to Lambda or other backends and handles TLS, authentication, throttling, CORS, stages and logging, so you don\'t run your own proxy servers.' },
        { q: 'HTTP API vs REST API in API Gateway?', a: 'HTTP APIs are cheaper, faster and simpler, with built-in JWT authorizers. REST APIs cost more but add features like API keys and usage plans, request validation, response caching and direct WAF integration.' },
        { q: 'What is a Lambda authorizer?', a: 'A Lambda function that API Gateway calls before your backend to check a token or request and return an allow or deny decision, optionally with context. Results can be cached for a few minutes to save calls.' },
        { q: 'What happens if your backend takes longer than the API Gateway timeout?', a: 'The client gets a 504 Gateway Timeout even though the backend may keep running. For slow work, return 202 with a job id, process asynchronously, and let the client poll or receive a notification.' },
      ],
      answer30: "API Gateway is a managed front door for APIs. It routes HTTP requests to Lambda or other backends and handles auth, throttling, CORS and stages. I'd choose an HTTP API for most Lambda backends because it's cheaper and has JWT authorizers built in, and a REST API when I need usage plans, request validation or caching. It has a timeout around 29 to 30 seconds by default, so long work should be queued and the client should poll.",
      mistakes: [
        "Using API keys as the only authentication. They're for metering and throttling, not identity.",
        "Doing long processing behind API Gateway and hitting the timeout.",
        "Forgetting to configure CORS on the API, then debugging browser errors in the frontend.",
        "Trap: 'Who returns the 429?' API Gateway itself, when the stage or usage plan throttle is exceeded, before your function is invoked.",
      ],
      takeaway: 'API Gateway handles routing, auth and throttling in front of Lambda; keep requests short and push slow work to queues.',
    },

    {
      id: 'sqs-sns-eventbridge',
      title: 'SQS vs SNS vs EventBridge',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'SQS is a queue (one consumer group pulls work), SNS is pub/sub fan-out (push to many), EventBridge is an event bus with content-based routing.',
      note: "On your resume: on Octagnt you built an SQS + S3 pipeline for bulk uploads of 50+ files, with idempotent workers, a DLQ and status polling (see My Resume and Projects). SQS max message size became 1 MiB in August 2025 (previously 256 KiB).",
      what: [
        "**SQS** (Simple Queue Service) is a message queue. Producers add messages; consumers poll and process them, then delete them. Each message is handled by one consumer. It buffers work so slow jobs don't block your API.",
        "**SNS** (Simple Notification Service) is publish/subscribe. You publish one message to a topic and SNS pushes a copy to every subscriber: SQS queues, Lambda functions, HTTP endpoints, email, SMS.",
        "**EventBridge** is an event bus. Services publish events, and **rules** match events by their content (for example `detail-type = 'CandidateShortlisted'`) and send them to targets. It also receives events from AWS services and SaaS partners, and has a scheduler for cron-like jobs.",
      ],
      deeper: [
        "**Visibility timeout**: when a consumer receives a message, SQS hides it (default 30 seconds, max 12 hours). If the consumer deletes it in time, it's done; if not, it becomes visible again and is retried. Set it longer than your processing time, and extend it with `ChangeMessageVisibility` for long jobs.",
        "**Dead-letter queue (DLQ)**: after a message has been received `maxReceiveCount` times without being deleted, SQS moves it to a DLQ. You alarm on the DLQ depth, inspect the poison message, fix the bug and redrive it back.",
        "**Standard vs FIFO**: standard queues have nearly unlimited throughput but deliver at least once and in roughly-best-effort order, so consumers must be idempotent. FIFO queues keep order within a message group and deduplicate within a 5-minute window, with lower throughput.",
        "Other details: long polling (`WaitTimeSeconds` up to 20) reduces empty receives and cost; retention is 4 days by default, up to 14; delay queues can postpone delivery up to 15 minutes.",
        "Common pattern, **fan-out**: SNS topic -> several SQS queues, so each service gets its own durable copy and processes at its own pace. EventBridge does the same with richer filtering, schema registry, archive and replay.",
      ],
      why: "Queues and events decouple services: the API responds fast, workers scale separately, and failures are retried instead of lost. Knowing which tool fits (one consumer vs many, push vs pull, routing rules) is a classic system design question.",
      analogy: "SQS is a to-do tray: each task is picked up by one worker. SNS is a group announcement over a loudspeaker: everyone subscribed hears it at once. EventBridge is a mail room that reads each letter and forwards it to the right departments based on what it says.",
      code: [
        {
          lang: 'ts',
          title: 'Producer and polling consumer (SDK v3)',
          source: `import {
  SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand,
} from '@aws-sdk/client-sqs';

const sqs = new SQSClient({});
const QueueUrl = process.env.UPLOAD_QUEUE_URL!;

export async function enqueue(batchId: string, key: string) {
  await sqs.send(new SendMessageCommand({
    QueueUrl,
    MessageBody: JSON.stringify({ batchId, key }),
  }));
}

export async function pollOnce() {
  const { Messages = [] } = await sqs.send(new ReceiveMessageCommand({
    QueueUrl,
    MaxNumberOfMessages: 10,
    WaitTimeSeconds: 20,      // long polling
    VisibilityTimeout: 120,   // longer than the slowest job
  }));
  for (const m of Messages) {
    await handle(JSON.parse(m.Body!));   // must be idempotent
    await sqs.send(new DeleteMessageCommand({ QueueUrl, ReceiptHandle: m.ReceiptHandle! }));
  }
}

async function handle(msg: { batchId: string; key: string }) {}`,
        },
        {
          lang: 'json',
          title: 'Redrive policy: send to DLQ after 5 failed receives',
          source: `{
  "deadLetterTargetArn": "arn:aws:sqs:ap-south-1:123456789012:uploads-dlq",
  "maxReceiveCount": 5
}`,
        },
      ],
      output: "`enqueue` adds one message per file. `pollOnce` waits up to 20 seconds for up to 10 messages, hides each for 120 seconds while processing, and deletes it only after success. If `handle` throws, the message isn't deleted, reappears after 120 seconds and is retried; after 5 receives it moves to `uploads-dlq`.",
      questions: [
        { q: 'When would you use SQS vs SNS?', a: 'SQS when one consumer group should process each message, with buffering and retries: a work queue. SNS when one event must be pushed to many subscribers at once: fan-out. They are often combined as SNS to several SQS queues.' },
        { q: 'What is the SQS visibility timeout?', a: 'After a consumer receives a message, SQS hides it from others for that period. If the consumer deletes it in time it is done; otherwise it reappears and is retried. Set it longer than your processing time.' },
        { q: 'What is a dead-letter queue?', a: 'A separate queue where messages go after failing a set number of times (`maxReceiveCount`). It stops poison messages from retrying forever and lets you inspect, fix and redrive them later.' },
        { q: 'Standard vs FIFO queue?', a: 'Standard queues have very high throughput but at-least-once delivery and best-effort ordering, so consumers must be idempotent. FIFO queues guarantee order within a message group and deduplicate, with lower throughput.' },
        { q: 'When would you choose EventBridge over SNS?', a: 'When you need content-based routing rules, events from AWS services or SaaS partners, schema discovery, archive and replay, or scheduled events. SNS is simpler and higher-throughput for straightforward fan-out.' },
      ],
      answer30: "SQS is a queue: messages wait until one consumer pulls and deletes them, which gives buffering and retries. SNS is pub/sub: it pushes each message to every subscriber. EventBridge is an event bus that routes events by content to targets. For background work like bulk uploads I use SQS with a visibility timeout longer than the job, idempotent consumers because standard queues can deliver twice, and a dead-letter queue with an alarm for messages that keep failing. For fan-out I'd put SNS or EventBridge in front of several queues.",
      mistakes: [
        "Deleting the message before processing finishes, so a crash loses it.",
        "Non-idempotent consumers on a standard queue, so a duplicate delivery creates duplicate records.",
        "No DLQ, so one bad message retries forever and burns money.",
        "Using SNS alone when consumers can be down: without an SQS queue behind it, the subscriber has no durable buffer.",
        "Trap: 'Does FIFO mean exactly-once processing?' No. FIFO deduplicates sends within 5 minutes, but a consumer can still crash after doing the work and before deleting, so processing should still be idempotent.",
      ],
      takeaway: 'SQS = one consumer pulls work; SNS = push to many; EventBridge = route by content. Idempotent consumers, sane visibility timeout, always a DLQ.',
    },

    {
      id: 'dynamodb-basics',
      title: 'DynamoDB basics',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'A serverless key-value/document database: design keys around your access patterns, query by partition key, add GSIs for other lookups.',
      what: [
        "DynamoDB is AWS's fully managed NoSQL database. Data is stored as **items** (like rows or documents) in **tables**. Every item has a **primary key**: either a partition key alone, or a partition key plus a sort key.",
        "Reads are fast and predictable when you look items up by key. You `GetItem` by the full key or `Query` all items with one partition key (optionally a sort key range). A `Scan` reads the whole table and should be avoided in hot paths.",
      ],
      deeper: [
        "The partition key decides which physical partition stores the item, so pick a key with many distinct values to spread load. A key like `status` creates a **hot partition**.",
        "Design starts from **access patterns**, not entities. You list the queries the app needs, then choose keys (often generic `PK`/`SK` with prefixes like `TENANT#42` and `JOB#7`) so each query is a single `Query`. Single-table design stores several entity types in one table this way.",
        "**Global secondary indexes** (GSIs) give an alternative key for other queries and are eventually consistent. **Local secondary indexes** share the partition key but use another sort key and must be created with the table.",
        "Capacity: **on-demand** (pay per request, no planning) or **provisioned** (set read/write units, optionally auto scaling, cheaper for steady load). Items are limited to 400 KB. Reads are eventually consistent by default; strongly consistent reads are optional (not on GSIs). Transactions, TTL for auto-expiring items, and Streams for change events are built in.",
      ],
      why: "It scales to huge traffic with single-digit-millisecond latency and no servers, and fits serverless apps well because it has no connection limits. Interviewers ask about it to see if you can model data around queries instead of joins.",
      analogy: "DynamoDB is a giant filing cabinet. The partition key picks the drawer, the sort key orders folders inside it. Finding something is instant if you know the drawer; searching every drawer (a Scan) is slow and expensive.",
      code: {
        lang: 'ts',
        title: 'Query one tenant\'s jobs, newest first',
        source: `import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));

await db.send(new PutCommand({
  TableName: 'app',
  Item: { PK: 'TENANT#42', SK: 'JOB#2026-10-01#7', title: 'Backend Engineer' },
  ConditionExpression: 'attribute_not_exists(PK)', // no silent overwrite
}));

const { Items } = await db.send(new QueryCommand({
  TableName: 'app',
  KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
  ExpressionAttributeValues: { ':pk': 'TENANT#42', ':prefix': 'JOB#' },
  ScanIndexForward: false, // descending sort key = newest first
  Limit: 20,
}));`,
      },
      output: "The put stores a job under tenant 42, failing if that exact key already exists. The query reads only tenant 42's partition, returns items whose sort key starts with `JOB#`, newest first, up to 20. No other tenant's data is read, and cost is proportional to the items returned.",
      questions: [
        { q: 'What is the difference between a partition key and a sort key?', a: 'The partition key decides which partition stores the item and must be given in every query. The sort key orders items within a partition and allows range conditions like `begins_with` or `between`. Together they form the primary key.' },
        { q: 'Query vs Scan in DynamoDB?', a: 'A Query reads items from one partition key, optionally filtered by sort key, so it is fast and cheap. A Scan reads every item in the table and then filters, so it is slow and expensive on large tables.' },
        { q: 'What is a GSI?', a: 'A global secondary index: a copy of selected attributes with a different partition and sort key, so you can query by another attribute. It is updated asynchronously and is eventually consistent.' },
        { q: 'DynamoDB vs MongoDB: when would you pick each?', a: 'DynamoDB for serverless, key-based access at any scale with no servers or connection limits. MongoDB when you need flexible ad hoc queries, rich aggregation and secondary indexes without designing every access pattern up front.' },
      ],
      answer30: "DynamoDB is a managed NoSQL key-value and document store. Each item has a partition key, and optionally a sort key. Fast access comes from querying by key, so I design the table from the access patterns: list the queries first, then choose keys, often with prefixed composite keys, and add GSIs for other lookups. I avoid scans, watch out for hot partitions, and choose on-demand capacity for unpredictable traffic. Items are limited to 400 KB.",
      mistakes: [
        "Modelling it like a relational database and then needing joins or scans.",
        "Choosing a low-cardinality partition key, creating hot partitions.",
        "Using `FilterExpression` and thinking it reduces read cost. Items are read first, then filtered.",
        "Trap: 'Can you do strongly consistent reads on a GSI?' No. GSIs are always eventually consistent.",
      ],
      takeaway: 'Design DynamoDB keys from access patterns; Query by key, avoid Scan, add GSIs for other lookups.',
    },

    {
      id: 'aws-rds',
      title: 'RDS and Aurora',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Managed relational databases: AWS handles backups, patching and failover; you choose Multi-AZ for availability and read replicas for read scale.',
      what: [
        "RDS (Relational Database Service) runs PostgreSQL, MySQL, MariaDB, SQL Server or Oracle for you. AWS handles installs, patching, automated backups and point-in-time restore. You still design schemas, indexes and queries.",
        "**Aurora** is AWS's own engine compatible with MySQL and PostgreSQL. Storage is shared and replicated six ways across three AZs, it grows automatically, and failover is faster. Aurora Serverless v2 scales capacity up and down with load.",
      ],
      deeper: [
        "**Multi-AZ** is for availability: a standby in another AZ receives synchronous copies, and if the primary fails, RDS fails over automatically and the DNS name points to the new primary. A classic Multi-AZ standby does not serve reads.",
        "**Read replicas** are for read scaling: asynchronous copies that serve read traffic. Because they lag slightly, reads right after a write may be stale; send read-your-own-write queries to the primary.",
        "Connections: each connection uses database memory. Lambdas or many container tasks can exhaust them; **RDS Proxy** pools and shares connections, and also speeds up failover.",
        "Security: put the database in private subnets, allow access only from the app's security group, enable encryption at rest, and consider IAM database authentication or Secrets Manager rotation for passwords.",
      ],
      why: "Running your own database on EC2 means owning backups, replication and failover. RDS gives you that out of the box, so most teams use it for relational data.",
      analogy: "RDS is a managed parking garage. You decide where your car goes (schema and queries), but the garage does the security, maintenance and has a backup garage next door if this one floods (Multi-AZ).",
      code: {
        lang: 'text',
        title: 'Typical production layout',
        source: `                 ┌──────────── VPC ────────────┐
App (ECS/EC2) ──>│ RDS Proxy ──> Primary (AZ a) │  writes + fresh reads
                 │                 │  sync copy  │
                 │                 ▼             │
                 │           Standby (AZ b)      │  takes over on failure
                 │                 │ async copy  │
                 │                 ▼             │
                 │          Read replica (AZ c)  │  reports, search, lists
                 └─────────── private subnets ───┘

Backups: automated daily + transaction logs -> point-in-time restore (up to 35 days)`,
      },
      output: "Writes go to the primary through RDS Proxy. The standby is a hot spare for failover, not for reads. Heavy read queries like reports go to the read replica, accepting a little lag. Everything sits in private subnets.",
      questions: [
        { q: 'Multi-AZ vs read replica?', a: 'Multi-AZ is for high availability: a synchronous standby in another AZ that takes over automatically if the primary fails. A read replica is for scaling reads: an asynchronous copy that serves read traffic and may lag behind.' },
        { q: 'What is RDS Proxy for?', a: 'It pools and reuses database connections between many clients, such as Lambda functions or container tasks, so they don\'t exhaust the database\'s connection limit. It also makes failover faster for the application.' },
        { q: 'What does Aurora add over standard RDS?', a: 'Shared storage replicated across three AZs that grows automatically, faster failover, up to 15 low-lag replicas, and options like Aurora Serverless v2 and global databases, at a higher price.' },
        { q: 'How would you restore a database to before a bad migration?', a: 'Use point-in-time restore from automated backups to create a new instance at a timestamp before the change, verify it, then point the app at it or copy back the lost data.' },
      ],
      answer30: "RDS is managed relational databases: AWS handles patching, backups and failover, and I handle schema, indexes and queries. For availability I enable Multi-AZ, which keeps a synchronous standby in another AZ and fails over automatically. For read scaling I add read replicas, remembering they lag, so read-after-write goes to the primary. With Lambda or many containers I put RDS Proxy in front to pool connections. Aurora is the AWS-built option with faster failover and auto-growing storage.",
      mistakes: [
        "Thinking a Multi-AZ standby serves read traffic (in the classic setup it doesn't).",
        "Reading from a replica right after writing and showing users stale data.",
        "Putting the database in a public subnet or opening port 5432/3306 to the internet.",
        "Trap: 'Is a read replica a backup?' No. A bad DELETE is replicated to it too. Backups and point-in-time restore protect against that.",
      ],
      takeaway: 'RDS manages the database; Multi-AZ for availability, read replicas for reads, RDS Proxy for connection pooling.',
    },

    {
      id: 'aws-iam',
      title: 'IAM: users, roles, policies and least privilege',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'IAM decides who can do what on which AWS resource; prefer roles with temporary credentials and the smallest set of permissions.',
      what: [
        "IAM (Identity and Access Management) controls access to AWS. An **identity** is a user, a group, or a role. A **policy** is a JSON document that says which actions are allowed or denied on which resources.",
        "A **role** is an identity with no password or long-term keys. Something trusted (an EC2 instance, a Lambda function, a CI pipeline, a user from another account) **assumes** the role and gets temporary credentials. Apps should use roles, not access keys.",
        "**Least privilege** means giving only the permissions needed for the job: not `s3:*` on everything, but `s3:PutObject` on one bucket prefix.",
      ],
      deeper: [
        "Evaluation logic: everything is denied by default; an explicit `Allow` grants access; an explicit `Deny` anywhere always wins. Permissions boundaries, service control policies (SCPs in AWS Organizations) and session policies can only narrow what is allowed.",
        "Identity-based policies attach to users, groups and roles. Resource-based policies attach to resources (S3 bucket policies, SQS queue policies, KMS key policies) and name a `Principal`. A role has a **trust policy** (who can assume it) and **permission policies** (what it can do once assumed).",
        "For humans, use IAM Identity Center (SSO) with MFA rather than IAM users. For CI like GitHub Actions, use OIDC federation so the workflow assumes a role with short-lived credentials and no stored secrets. Never use the root account for daily work.",
        "Tools to tighten access: IAM Access Analyzer (finds public or cross-account access and can generate policies from CloudTrail activity), last-accessed data, and condition keys like `aws:SourceIp`, `aws:PrincipalTag` or `s3:prefix`.",
      ],
      why: "Most cloud security incidents come from leaked keys or overly broad permissions. Clean IAM limits the blast radius when something goes wrong, and interviewers expect you to default to roles and least privilege.",
      analogy: "IAM is an office key-card system. A role is a visitor badge handed out at reception for the day; a policy is the list of doors that badge opens. Least privilege means the cleaner's badge opens the supply cupboard, not the server room.",
      code: {
        lang: 'json',
        title: 'Least-privilege policy for an upload worker',
        source: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReadUploads",
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::app-uploads-prod/uploads/*"
    },
    {
      "Sid": "ConsumeQueue",
      "Effect": "Allow",
      "Action": ["sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:ChangeMessageVisibility"],
      "Resource": "arn:aws:sqs:ap-south-1:123456789012:uploads-queue"
    }
  ]
}`,
      },
      output: "A worker with this role can read objects under `uploads/` in one bucket and consume one queue, nothing else. It can't delete files, write to other buckets or read other queues. If its credentials leak, the damage is limited to reading those uploads.",
      questions: [
        { q: 'What is the difference between an IAM user and a role?', a: 'A user is a long-lived identity with a password or access keys. A role has no long-term credentials; trusted entities assume it and get temporary credentials that expire. Apps and services should use roles.' },
        { q: 'What is the principle of least privilege?', a: 'Grant only the specific actions on the specific resources an identity needs, and nothing more. It limits the damage if credentials leak or code has a bug.' },
        { q: 'If one policy allows an action and another denies it, what happens?', a: 'The explicit deny wins. IAM denies by default, an allow grants access, and any explicit deny overrides every allow.' },
        { q: 'What is the difference between an identity-based and a resource-based policy?', a: 'An identity-based policy is attached to a user, group or role and says what that identity can do. A resource-based policy is attached to a resource like an S3 bucket or SQS queue and says which principals can access it, which also enables cross-account access.' },
        { q: 'How should a CI pipeline get AWS access?', a: 'Use OIDC federation: the CI provider issues a signed token, AWS trusts it, and the pipeline assumes a narrowly scoped role with short-lived credentials. No long-lived access keys are stored as secrets.' },
      ],
      answer30: "IAM controls who can do what on which resource. Policies are JSON allow and deny statements; everything is denied by default and an explicit deny always wins. I avoid long-lived access keys: services use roles, like a Lambda execution role or an instance profile, and CI uses OIDC to assume a role. Policies follow least privilege, with specific actions on specific ARNs instead of wildcards, and humans sign in through SSO with MFA.",
      mistakes: [
        "Committing access keys to Git or putting them in frontend code.",
        "`\"Action\": \"*\", \"Resource\": \"*\"` because it was quicker to make it work.",
        "Using the root account for daily tasks, or not enabling MFA on it.",
        "Trap: 'The role has s3:GetObject but access is still denied. Why?' Check the bucket policy for a deny, an SCP, a permissions boundary, a KMS key policy if the object is encrypted with a customer key, or a wrong resource ARN (bucket ARN vs `bucket/*`).",
      ],
      takeaway: 'Roles over keys, explicit deny wins, and grant only the exact actions on the exact resources.',
    },

    {
      id: 'vpc-basics',
      title: 'VPC basics: subnets, routing and security groups',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Your private network in AWS: public subnets for load balancers, private subnets for apps and databases, NAT for outbound internet.',
      what: [
        "A **VPC** (Virtual Private Cloud) is your own isolated network inside an AWS region, with an IP range like `10.0.0.0/16`. You split it into **subnets**, each in one availability zone.",
        "A **public subnet** has a route to an **internet gateway**, so things in it can be reached from the internet (if they have a public IP and the firewall allows it). A **private subnet** has no direct route from the internet. Apps and databases normally live in private subnets.",
        "**Security groups** are firewalls on each resource. A common pattern: the load balancer allows 443 from anywhere, the app allows traffic only from the load balancer's security group, and the database allows traffic only from the app's security group.",
      ],
      deeper: [
        "Private resources that need to call the internet (npm registry, third-party APIs) go through a **NAT gateway** placed in a public subnet. NAT gateways are charged per hour and per GB, and can become a surprising cost.",
        "**VPC endpoints** let private resources reach AWS services without the internet: gateway endpoints (free) for S3 and DynamoDB, interface endpoints (PrivateLink, paid) for most others like SQS and Secrets Manager. They save NAT costs and keep traffic private.",
        "Route tables decide where traffic goes. Network ACLs are optional stateless subnet-level rules. VPC peering or Transit Gateway connect VPCs; Flow Logs record traffic for debugging and security.",
        "Lambda functions only need to be attached to a VPC when they must reach private resources like RDS; once attached they need a NAT gateway or endpoints to reach the internet or AWS APIs.",
      ],
      why: "Network layout is your first line of defence. Keeping databases unreachable from the internet and allowing only the traffic you need prevents a whole class of breaches.",
      analogy: "A VPC is a gated housing society. Public subnets are the front area near the gate where visitors are allowed; private subnets are the inner houses. The NAT gateway is the society's outgoing courier: residents can send things out, but strangers can't walk in.",
      code: {
        lang: 'text',
        title: 'Standard three-tier layout across two AZs',
        source: `VPC 10.0.0.0/16
├── AZ a
│   ├── public  10.0.0.0/24   ALB, NAT gateway      route 0.0.0.0/0 -> internet gateway
│   ├── private 10.0.10.0/24  app servers / tasks   route 0.0.0.0/0 -> NAT gateway
│   └── private 10.0.20.0/24  database              no internet route
└── AZ b
    ├── public  10.0.1.0/24
    ├── private 10.0.11.0/24
    └── private 10.0.21.0/24

Security groups:
  sg-alb : inbound 443 from 0.0.0.0/0
  sg-app : inbound 3000 from sg-alb only
  sg-db  : inbound 5432 from sg-app only`,
      },
      output: "Only the load balancer is reachable from the internet. It forwards to the app on port 3000, and only the app can reach the database. App servers can still make outbound calls through the NAT gateway. Losing one AZ leaves the other half of every tier running.",
      questions: [
        { q: 'What makes a subnet public or private?', a: 'Its route table. A public subnet has a route to an internet gateway; a private subnet does not. The resource also needs a public IP and security group rules to be reachable.' },
        { q: 'What is a NAT gateway for?', a: 'It lets resources in private subnets start outbound connections to the internet, such as calling APIs or downloading packages, while preventing inbound connections from the internet.' },
        { q: 'Security group vs NACL?', a: 'Security groups are stateful, allow-only firewalls attached to resources. Network ACLs are stateless rules on subnets that can allow or deny, and you must allow return traffic explicitly.' },
        { q: 'What is a VPC endpoint?', a: 'A private connection from your VPC to an AWS service, so traffic to S3, DynamoDB, SQS and others doesn\'t go over the internet or through a NAT gateway. Gateway endpoints for S3 and DynamoDB are free.' },
      ],
      answer30: "A VPC is my private network in a region, split into subnets per availability zone. Load balancers go in public subnets with a route to the internet gateway. App servers and databases go in private subnets; apps reach the internet through a NAT gateway, and reach AWS services like S3 through VPC endpoints. Security groups chain access: the internet can reach only the load balancer, the load balancer reaches the app, and the app reaches the database.",
      mistakes: [
        "Putting the database in a public subnet 'just for easier access'.",
        "Allowing database ports from the whole VPC CIDR instead of from the app's security group.",
        "Sending heavy S3 traffic through a NAT gateway and paying per GB when a free gateway endpoint would do.",
        "Trap: 'Why can't my Lambda in a VPC call an external API?' Lambda ENIs in a VPC don't get public IPs, so it needs a private subnet with a NAT gateway route.",
      ],
      takeaway: 'Public subnets for the edge, private for apps and data, security groups referencing each other, NAT and endpoints for outbound.',
    },

    {
      id: 'cloudfront-cdn',
      title: 'CloudFront and CDNs',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'A CDN caches content at edge locations near users; control freshness with Cache-Control headers, hashed filenames and invalidations.',
      what: [
        "A **CDN** (content delivery network) keeps copies of your files in many locations around the world. Users get content from the nearest location, which is much faster than fetching from your origin server every time.",
        "**CloudFront** is AWS's CDN. You point it at an **origin** (an S3 bucket, a load balancer, an API) and it caches responses at edge locations. It also gives you HTTPS, HTTP/2 and HTTP/3, compression, and protection with AWS WAF and Shield.",
      ],
      deeper: [
        "Caching rules: **cache behaviors** match paths (`/assets/*`, `/api/*`) and each uses a cache policy (what forms the cache key: path, chosen headers, query strings, cookies) and an origin request policy (what to forward). Keep the cache key small; forwarding every header or cookie kills the hit ratio.",
        "Freshness: built frontend files get content hashes in their names (`index-3f9a1c.js`), so they can be cached for a year (`Cache-Control: public, max-age=31536000, immutable`). `index.html` gets a short TTL or `no-cache` so new deploys show up. **Invalidations** remove cached paths early, but they're slower and the first 1,000 paths per month are free, then paid.",
        "For a private S3 origin, use **Origin Access Control** so only CloudFront can read the bucket. For private content, use signed URLs or signed cookies. For SPAs, map 403/404 errors to `/index.html` so client-side routes work.",
        "CloudFront Functions (lightweight JS at the edge, for header rewrites and redirects) and Lambda@Edge (heavier logic) let you run code close to users.",
      ],
      why: "Static assets and media are most of a page's bytes. A CDN cuts latency, reduces load and data-transfer cost on your origin, and absorbs traffic spikes and some attacks.",
      analogy: "A CDN is a chain of local convenience stores stocked from a central warehouse. Customers buy from the shop on their street instead of driving to the warehouse. When the product changes, you give it a new label (hashed filename) so shops don't sell the old one.",
      code: {
        lang: 'bash',
        title: 'Deploy a Vite build to S3 + CloudFront',
        source: `npm run build

# Hashed assets: cache for a year
aws s3 sync dist/assets s3://my-site/assets \\
  --cache-control "public,max-age=31536000,immutable" --delete

# HTML: always revalidate so new releases appear
aws s3 cp dist/index.html s3://my-site/index.html \\
  --cache-control "no-cache"

# Only the HTML needs invalidating
aws cloudfront create-invalidation --distribution-id E123EXAMPLE --paths "/index.html"`,
      },
      output: "Asset files with hashed names are cached at the edge and in browsers for a year, which is safe because every new build produces new names. `index.html` is revalidated on every request, so users get the new HTML, which references the new asset names. Only one path is invalidated.",
      questions: [
        { q: 'What is a CDN and why use one?', a: 'A network of edge servers that cache your content close to users. It lowers latency, reduces load and bandwidth cost on your origin, and helps absorb traffic spikes and DDoS attacks.' },
        { q: 'How do you make sure users get the new version after a frontend deploy?', a: 'Use content-hashed filenames for JS and CSS with long cache lifetimes, and serve `index.html` with `no-cache` or a short TTL. If needed, invalidate just `/index.html` in the CDN.' },
        { q: 'What is the cache key and why does it matter?', a: 'The parts of a request the CDN uses to decide whether two requests are the same: path plus any chosen headers, cookies and query strings. Including too much makes every request unique and destroys the cache hit ratio.' },
        { q: 'How do you keep an S3 origin private behind CloudFront?', a: 'Block public access on the bucket and use Origin Access Control, with a bucket policy that allows only that CloudFront distribution to read objects.' },
      ],
      answer30: "A CDN like CloudFront caches content at edge locations near users, so pages load faster and the origin does less work. For a React app I put the build in a private S3 bucket behind CloudFront with Origin Access Control. Hashed asset files get a one-year immutable cache, while index.html is served with no-cache so new releases appear immediately. I keep the cache key minimal so the hit ratio stays high, and use invalidations only for the few files that need it.",
      mistakes: [
        "Caching `index.html` for a long time, so users keep loading an old release.",
        "Forwarding all headers and cookies to the origin, making the cache nearly useless.",
        "Invalidating `/*` on every deploy instead of relying on hashed filenames.",
        "Trap: 'Can you cache API responses on a CDN?' Yes, for public, cacheable GETs with correct Cache-Control. Never cache personalised responses unless the user identity is part of the cache key, or you will serve one user's data to another.",
      ],
      takeaway: 'CDNs cache at the edge; hashed assets cache forever, HTML stays fresh, keep the cache key small.',
    },

    {
      id: 'cloudwatch-observability',
      title: 'CloudWatch: logs, metrics and alarms',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Structured logs, key metrics and alarms that page someone, so you find problems before users report them.',
      what: [
        "**CloudWatch** is AWS's monitoring service. **Logs** collect output from Lambda, containers and servers into log groups. **Metrics** are numbers over time (CPU, request count, errors, queue depth). **Alarms** watch a metric and notify you (usually through SNS to email, Slack or a pager) when it crosses a threshold.",
        "AWS services publish many metrics automatically: Lambda errors and duration, SQS `ApproximateNumberOfMessagesVisible` and `ApproximateAgeOfOldestMessage`, ALB 5xx counts and latency.",
      ],
      deeper: [
        "Log in **structured JSON** (with a library like pino) so you can filter by fields. Include a request or correlation id, tenant id and error details, and redact secrets and personal data. **Logs Insights** queries logs with a SQL-like language; **metric filters** turn log patterns into metrics.",
        "Set **retention** on every log group. The default is never expire, which quietly grows your bill.",
        "Good alarms watch symptoms users feel: error rate, p95/p99 latency, DLQ messages > 0, oldest message age on a queue. Use percentiles, not averages, for latency. Avoid alarms nobody acts on.",
        "The three pillars of observability are logs, metrics and **traces**. Tracing (AWS X-Ray, or OpenTelemetry sending to X-Ray or another backend) follows one request across services, which is essential in a microservice or agent-based system.",
      ],
      why: "Without observability you learn about outages from users. Good logs and alarms shorten the time to notice and fix problems, which is what interviewers mean when they ask how you'd debug production.",
      analogy: "Metrics are the dashboard gauges in a car, logs are the trip diary, traces are the GPS route of one journey, and alarms are the warning lights that come on before the engine dies.",
      code: [
        {
          lang: 'sql',
          title: 'Logs Insights: slowest error-prone routes in the last hour',
          source: `fields @timestamp, route, statusCode, durationMs, requestId
| filter statusCode >= 500
| stats count(*) as errors, pct(durationMs, 95) as p95 by route
| sort errors desc
| limit 10`,
        },
        {
          lang: 'bash',
          title: 'Alarm when anything lands in the DLQ',
          source: `aws cloudwatch put-metric-alarm \\
  --alarm-name uploads-dlq-not-empty \\
  --namespace AWS/SQS --metric-name ApproximateNumberOfMessagesVisible \\
  --dimensions Name=QueueName,Value=uploads-dlq \\
  --statistic Maximum --period 300 --evaluation-periods 1 \\
  --threshold 0 --comparison-operator GreaterThanThreshold \\
  --alarm-actions arn:aws:sns:ap-south-1:123456789012:oncall-alerts`,
        },
      ],
      output: "The query lists the 10 routes with the most 5xx responses in the selected time range, with their p95 duration (the Logs Insights syntax is SQL-like, shown here with `sql` highlighting). The alarm fires when the DLQ has at least one visible message in a 5-minute window and notifies the on-call SNS topic.",
      questions: [
        { q: 'What is the difference between logs, metrics and traces?', a: 'Logs are detailed event records, metrics are numeric measurements over time for dashboards and alarms, and traces follow a single request across multiple services to show where time was spent or where it failed.' },
        { q: 'What would you alarm on for an API and a queue worker?', a: 'For the API: 5xx error rate and p95 or p99 latency. For the worker: DLQ depth above zero, the age of the oldest message, and Lambda errors or throttles. Alarm on what users feel, not on every metric.' },
        { q: 'Why use structured logging?', a: 'JSON logs with consistent fields like requestId, tenantId and level can be filtered and aggregated reliably in tools like CloudWatch Logs Insights, instead of searching free text.' },
        { q: 'Why look at p99 latency instead of average?', a: 'Averages hide outliers. p99 shows what the slowest 1% of users experience, which is often where real problems like cold starts, slow queries or timeouts appear.' },
      ],
      answer30: "CloudWatch gives me logs, metrics and alarms. I log structured JSON with a request id and tenant id, redact sensitive data, and set retention on every log group. I alarm on things users feel: error rate, p95 latency, and for queues the DLQ depth and oldest message age, routed through SNS to the on-call channel. For anything spanning several services I add tracing with X-Ray or OpenTelemetry so I can follow one request end to end.",
      mistakes: [
        "Leaving log retention at 'never expire'.",
        "Logging tokens, passwords or personal data.",
        "Alarms on averages, or so many noisy alarms that people ignore them.",
        "Trap: 'Your queue has no errors but users say jobs are slow. What do you check?' `ApproximateAgeOfOldestMessage` and consumer concurrency: work may be piling up faster than workers can process it.",
      ],
      takeaway: 'Structured logs with ids, symptom-based alarms, retention set, and tracing once requests cross services.',
    },

    {
      id: 'docker-basics',
      title: 'Docker: images, layers, multi-stage builds',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'An image packages your app with everything it needs; layers are cached; multi-stage builds keep production images small and safe.',
      what: [
        "Docker packages an app and everything it needs (runtime, libraries, files) into an **image**. A **container** is a running instance of an image. The same image runs the same way on your laptop, in CI and in production.",
        "A **Dockerfile** is the recipe. Each instruction (`FROM`, `COPY`, `RUN`) creates a **layer**. Docker caches layers, so if a step and everything before it hasn't changed, it reuses the cached result instead of running it again.",
        "Containers are not virtual machines. They share the host's kernel and are isolated processes, so they start in seconds and use far less memory than a VM.",
      ],
      deeper: [
        "**Layer order matters**: copy `package.json` and the lockfile, run `npm ci`, and only then copy the source. Then a code change doesn't reinstall all dependencies.",
        "**Multi-stage builds**: one stage has the full toolchain to install and compile (TypeScript, dev dependencies); the final stage starts from a small base and copies only the built output and production dependencies. The final image is smaller, faster to pull and has less attack surface.",
        "Best practices: pin a base image version (`node:24-alpine` or a digest), use a `.dockerignore` (exclude `node_modules`, `.git`, `.env`), run as a non-root user (`USER node`), one process per container, configure via environment variables, never bake secrets into images (they stay in layer history), and add a `HEALTHCHECK` or rely on the orchestrator's health checks.",
        "Node in containers: handle `SIGTERM` to shut down gracefully (stop accepting requests, finish in-flight ones, close DB connections). Run `node` directly instead of `npm start` so signals reach your process, or use `--init`/tini as PID 1.",
      ],
      why: "'Works on my machine' disappears when everyone runs the same image. Images are also the unit that ECS, Kubernetes, Lambda container images and most CI pipelines deploy.",
      analogy: "An image is a frozen meal kit with the exact ingredients and instructions; a container is that meal being cooked. Layers are the kit's sealed compartments: if the sauce hasn't changed, you reuse yesterday's sauce compartment instead of making it again.",
      code: {
        lang: 'text',
        title: 'Dockerfile: multi-stage Node + TypeScript build',
        source: `# ---- build stage ----
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
# Cached unless package.json or the lockfile changes
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build && npm prune --omit=dev

# ---- runtime stage ----
FROM node:24-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
# Don't run as root (the node image ships a 'node' user)
USER node
EXPOSE 3000
# Exec form: node is PID 1 and receives SIGTERM directly.
# As PID 1 it has no default signal handling, so the app must handle SIGTERM itself.
# (Dockerfile comments must be on their own line, not after an instruction)
CMD ["node", "dist/server.js"]`,
      },
      output: "`docker build -t api .` produces an image containing only compiled JavaScript, production dependencies and the Node runtime; TypeScript and dev tools stay in the discarded build stage. Rebuilding after a source-only change reuses the cached `npm ci` layer, so builds are fast. `docker run -p 3000:3000 api` starts it as the non-root `node` user.",
      questions: [
        { q: 'What is the difference between an image and a container?', a: 'An image is a read-only template with the app and its dependencies. A container is a running instance of an image with its own writable layer, process and network. You can run many containers from one image.' },
        { q: 'How is a container different from a virtual machine?', a: 'A VM virtualises hardware and runs a full guest operating system. A container shares the host kernel and isolates only processes, files and network, so it is much lighter and starts in seconds.' },
        { q: 'Why copy package.json before the rest of the source?', a: 'Docker caches each layer. If dependencies are installed before the source is copied, changing code reuses the cached install layer, so rebuilds take seconds instead of reinstalling everything.' },
        { q: 'What is a multi-stage build?', a: 'A Dockerfile with several `FROM` stages. You compile in a stage with all build tools, then copy only the output into a small final image. The result is smaller and has fewer vulnerabilities.' },
        { q: 'Why shouldn\'t you put secrets in a Dockerfile?', a: 'Every instruction is stored in the image layers and history, so anyone who can pull the image can read the secret. Pass secrets at runtime through environment variables or a secrets manager, or use BuildKit secret mounts for build-time secrets.' },
      ],
      answer30: "Docker packages an app with its runtime and dependencies into an image, and a container is a running instance of it. Containers share the host kernel, so they're much lighter than VMs. My Dockerfiles copy the package files and run npm ci before copying source so the install layer is cached, use a multi-stage build so the final image has only compiled code and production dependencies, run as a non-root user, and never contain secrets. The app handles SIGTERM so it shuts down gracefully.",
      mistakes: [
        "`COPY . .` before `npm ci`, so every code change reinstalls all packages.",
        "No `.dockerignore`, so `node_modules`, `.git` and `.env` end up in the image.",
        "Using `latest` tags for the base image, so builds change without warning.",
        "Running as root, or using `npm start` as the command so `SIGTERM` doesn't reach Node.",
        "Trap: 'If I delete a file in a later layer, is the image smaller?' No. The file still exists in the earlier layer. Avoid adding it, or clean up in the same `RUN` step.",
      ],
      takeaway: 'Order layers for caching, build in one stage and ship a small one, run as non-root, keep secrets out.',
    },

    {
      id: 'docker-compose',
      title: 'Docker Compose for local development',
      level: 'basic',
      priority: 'good',
      frequency: 'common',
      summary: 'One YAML file that starts your app and its dependencies (database, cache, LocalStack) together on one machine.',
      note: "On your resume: you set up LocalStack with Docker Compose so every developer could run S3 and SQS locally (see My Resume and Projects). Compose v2 is the `docker compose` command (with a space); the top-level `version:` key is obsolete and ignored.",
      what: [
        "Docker Compose describes several containers in one `compose.yaml` (or `docker-compose.yml`) file: the API, MongoDB, Redis, LocalStack and so on. `docker compose up` starts them all with the right ports, environment variables and volumes.",
        "Compose creates a private network where services reach each other by service name. Your API connects to `mongodb://mongo:27017`, not `localhost`.",
      ],
      deeper: [
        "`depends_on` controls start order, but by default it only waits for the container to start, not for the service to be ready. Add a `healthcheck` and `condition: service_healthy` to wait for readiness.",
        "Use **named volumes** for database data so it survives `docker compose down` (`down -v` deletes them). Use **bind mounts** of your source code plus a watcher (or `docker compose watch`) for hot reload during development.",
        "Profiles let you start optional services only when needed, and multiple files (`compose.yaml` + `compose.override.yaml`) let you layer dev-only settings. Compose is for local development and simple single-host setups; production usually uses ECS, Kubernetes or a PaaS.",
      ],
      why: "New developers can run the whole stack with one command, and everyone uses the same database and service versions. It removes 'install MongoDB 7 and configure it like this' from the onboarding doc.",
      analogy: "Compose is a band's set list and stage plan: it says which musicians play, where each stands, and who starts first, so the whole show starts with one cue.",
      code: {
        lang: 'yaml',
        title: 'compose.yaml: API + MongoDB + LocalStack',
        source: `services:
  api:
    build: .
    ports: ['3000:3000']
    environment:
      MONGO_URL: mongodb://mongo:27017/app
      AWS_ENDPOINT_URL: http://localstack:4566
      AWS_REGION: ap-south-1
      AWS_ACCESS_KEY_ID: test
      AWS_SECRET_ACCESS_KEY: test
    depends_on:
      mongo:
        condition: service_healthy
      localstack:
        condition: service_healthy

  mongo:
    image: mongo:7
    volumes: ['mongo-data:/data/db']
    healthcheck:
      test: ['CMD', 'mongosh', '--quiet', '--eval', 'db.adminCommand("ping")']
      interval: 5s
      retries: 10

  localstack:
    image: localstack/localstack:latest
    ports: ['4566:4566']
    environment:
      SERVICES: s3,sqs
    volumes: ['./localstack-init:/etc/localstack/init/ready.d']

volumes:
  mongo-data:`,
      },
      output: "`docker compose up --build` builds the API image, starts MongoDB and LocalStack, waits until both pass their health checks, then starts the API. The API reaches them by service name. Scripts in `localstack-init` run when LocalStack is ready, for example to create buckets and queues. Mongo data persists in the `mongo-data` volume across restarts.",
      questions: [
        { q: 'What is Docker Compose used for?', a: 'Defining and running multi-container setups from one YAML file, mostly for local development and testing: the app plus its database, cache and fake cloud services, started with `docker compose up`.' },
        { q: 'How do containers in Compose talk to each other?', a: 'Compose puts them on a shared network with DNS, so each service is reachable by its service name, like `mongo:27017`. `localhost` inside a container refers to that container itself.' },
        { q: 'Does depends_on wait until the database is ready?', a: 'Not by default; it only waits for the container to start. Add a healthcheck to the database and use `condition: service_healthy` so the app starts only once the database answers.' },
        { q: 'How do you keep database data between restarts?', a: 'Mount a named volume at the database\'s data directory. `docker compose down` keeps named volumes; `docker compose down -v` deletes them.' },
      ],
      answer30: "Docker Compose defines the app and its dependencies in one YAML file so anyone can start the whole stack with docker compose up. Services talk to each other by service name on a shared network. I use healthchecks with depends_on conditions so the API waits for the database, named volumes so data survives restarts, and LocalStack in the same file to fake S3 and SQS locally. It's a development tool; production runs on an orchestrator.",
      mistakes: [
        "Connecting to `localhost` from inside a container instead of the service name.",
        "Relying on plain `depends_on` and getting connection errors at startup.",
        "Running `docker compose down -v` and wondering where the local data went.",
        "Trap: 'Would you run production on Compose?' For a small single server it can work, but you lose multi-host scheduling, self-healing and rolling deploys. Use ECS, Kubernetes or a PaaS for real production.",
      ],
      takeaway: 'Compose = whole local stack in one file; services talk by name, healthchecks for readiness, volumes for data.',
    },

    {
      id: 'kubernetes-essentials',
      title: 'Kubernetes essentials',
      level: 'advanced',
      priority: 'good',
      frequency: 'common',
      summary: 'An orchestrator that keeps the desired number of containers running: Pods, Deployments, Services, Ingress, ConfigMaps and Secrets.',
      note: "The community ingress-nginx controller was retired in March 2026 (no more releases or security fixes). New clusters are moving to the Gateway API or another maintained controller. Check what your target company uses.",
      what: [
        "Kubernetes (K8s) runs containers across a cluster of machines (nodes). You describe the **desired state** in YAML (\"run 3 copies of this image\") and Kubernetes keeps reality matching it: restarting crashed containers, rescheduling them if a node dies, and rolling out new versions.",
        "Core objects: a **Pod** is one or more containers that run together (usually one). A **Deployment** manages replicas of a Pod and rolling updates. A **Service** gives a stable name and IP that load-balances across the Pods. An **Ingress** (or the newer Gateway API) routes external HTTP traffic to Services. **ConfigMaps** and **Secrets** hold configuration.",
      ],
      deeper: [
        "**Probes**: a readiness probe decides whether a Pod receives traffic; a liveness probe restarts a Pod that is stuck; a startup probe gives slow starters time. Wrong liveness probes (for example, checking the database) can cause restart storms.",
        "**Requests and limits**: requests reserve CPU/memory for scheduling; limits cap usage. Exceeding the memory limit gets the container OOM-killed. The **Horizontal Pod Autoscaler** adds Pods based on CPU or custom metrics.",
        "Kubernetes Secrets are only base64-encoded by default, not encrypted. Enable encryption at rest and restrict access with RBAC, or sync from a secrets manager (External Secrets, Secrets Store CSI driver).",
        "On AWS, **EKS** runs the control plane for you. Many teams with simpler needs choose **ECS** (with Fargate) instead, which has fewer concepts and less to operate. Knowing when K8s is overkill is a good senior signal.",
      ],
      why: "Once you have many services and containers, you need something to schedule them, heal them, scale them and roll out updates safely. Kubernetes is the industry standard for that.",
      analogy: "Kubernetes is an orchestra conductor with a score. The score (YAML) says how many violins should play; if a violinist leaves, the conductor brings in a replacement without stopping the music.",
      code: {
        lang: 'yaml',
        title: 'Deployment + Service for a Node API',
        source: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels: { app: api }
  strategy:
    rollingUpdate: { maxUnavailable: 0, maxSurge: 1 }
  template:
    metadata:
      labels: { app: api }
    spec:
      containers:
        - name: api
          image: 123456789012.dkr.ecr.ap-south-1.amazonaws.com/api:1.4.2
          ports: [{ containerPort: 3000 }]
          envFrom: [{ secretRef: { name: api-secrets } }]
          resources:
            requests: { cpu: 250m, memory: 256Mi }
            limits: { memory: 512Mi }
          readinessProbe:
            httpGet: { path: /health/ready, port: 3000 }
          livenessProbe:
            httpGet: { path: /health/live, port: 3000 }
---
apiVersion: v1
kind: Service
metadata:
  name: api
spec:
  selector: { app: api }
  ports: [{ port: 80, targetPort: 3000 }]`,
      },
      output: "`kubectl apply -f api.yaml` creates 3 API Pods and a Service named `api` that other Pods reach at `http://api`. On a new image tag, Kubernetes starts one new Pod at a time and removes an old one only after the new one passes its readiness probe, so capacity never drops. A Pod over 512 MiB memory is killed and restarted.",
      questions: [
        { q: 'What is the difference between a Pod, a Deployment and a Service?', a: 'A Pod runs one or more containers. A Deployment keeps a set number of identical Pods running and handles rolling updates. A Service gives those changing Pods one stable name and IP and load-balances traffic across them.' },
        { q: 'Readiness vs liveness probe?', a: 'Readiness decides if a Pod should receive traffic; failing removes it from the Service without restarting it. Liveness decides if the container is stuck; failing restarts it.' },
        { q: 'What are resource requests and limits?', a: 'Requests are what the scheduler reserves for a container when placing it on a node. Limits are the maximum it can use; going over the memory limit gets it OOM-killed, and CPU over the limit is throttled.' },
        { q: 'Are Kubernetes Secrets secure?', a: 'Only partly. By default they are base64-encoded, not encrypted, in etcd. You need encryption at rest, RBAC to limit who can read them, and ideally a sync from a real secrets manager.' },
        { q: 'When would you choose ECS over Kubernetes on AWS?', a: 'When the team wants simple container hosting without operating Kubernetes: ECS with Fargate has fewer concepts and integrates tightly with AWS. Kubernetes makes sense for portability, a large platform team, or its ecosystem of tools.' },
      ],
      answer30: "Kubernetes keeps a cluster's actual state matching the desired state you declare in YAML. A Deployment manages replicas of a Pod and rolls out new versions; a Service gives them a stable address; Ingress or the Gateway API routes external traffic in. I set readiness probes so Pods only get traffic when ready, resource requests and limits so scheduling works, and use an autoscaler for load. On AWS I'd use EKS if we need Kubernetes, but ECS with Fargate is often simpler for a small team.",
      mistakes: [
        "Liveness probes that check dependencies like the database, causing all Pods to restart when the DB blips.",
        "No resource requests, so the scheduler overpacks nodes.",
        "Deploying with the `latest` tag, which makes rollbacks and audits unreliable.",
        "Trap: 'Is base64 in a Secret encryption?' No. It's just encoding. Anyone with read access can decode it.",
      ],
      takeaway: 'Declare desired state; Deployments roll out Pods, Services find them, probes and resources keep them healthy.',
    },

    {
      id: 'ci-cd-pipelines',
      title: 'CI/CD pipelines with GitHub Actions',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'CI checks every change automatically (lint, type-check, test, build); CD ships passing changes to environments safely.',
      what: [
        "**Continuous Integration (CI)** means every push or pull request is automatically built and tested, so problems are found in minutes, not at release time.",
        "**Continuous Delivery** means every change that passes CI is ready to release, often with a manual approval for production. **Continuous Deployment** goes one step further and releases to production automatically.",
        "**GitHub Actions** runs pipelines defined as YAML **workflows** in `.github/workflows/`. A workflow is triggered by events (push, pull_request, a schedule), has **jobs** that run on runners, and each job has **steps** that run commands or reusable **actions**.",
      ],
      deeper: [
        "A typical Node pipeline: checkout -> setup Node with dependency caching -> `npm ci` -> lint -> type-check -> unit tests -> build -> (on main) build and push a Docker image tagged with the commit SHA -> deploy to staging -> smoke tests -> approval -> deploy to production.",
        "Build once, deploy many: the same artifact (image digest) moves through environments; only configuration changes. Rebuilding per environment risks shipping something different from what you tested.",
        "Security: use OIDC (`permissions: id-token: write`) to assume an AWS role instead of storing access keys; give `GITHUB_TOKEN` minimal permissions; pin third-party actions to a full commit SHA; be careful with `pull_request_target`, which runs with secrets on code from forks.",
        "Speed: cache dependencies, run independent jobs in parallel, use a test matrix only where it matters, and use `concurrency` to cancel outdated runs on the same branch. Environments in GitHub can require reviewers before a production deploy.",
      ],
      why: "Manual builds and deploys are slow and error-prone. A pipeline makes quality checks unavoidable, gives fast feedback on every PR, and makes releases boring and repeatable.",
      analogy: "CI is the quality inspection on a factory line that checks every part as it's made. CD is the conveyor that carries approved parts straight to the shop shelves, with a supervisor's sign-off before the big store.",
      code: {
        lang: 'yaml',
        title: '.github/workflows/ci.yml',
        source: `name: CI
on:
  pull_request:
  push:
    branches: [main]

concurrency:
  group: ci-\${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: read

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test -- --coverage
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production        # can require a reviewer
    permissions:
      id-token: write              # OIDC, no stored AWS keys
      contents: read
    steps:
      - uses: actions/checkout@v4
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/gha-deploy
          aws-region: ap-south-1
      - run: ./scripts/deploy.sh \${{ github.sha }}`,
      },
      output: "Every PR runs lint, type-check, tests and build; a newer push to the same branch cancels the older run. On `main`, if tests pass, the deploy job waits for any required approval on the `production` environment, assumes an AWS role via OIDC with short-lived credentials, and deploys the exact commit SHA.",
      questions: [
        { q: 'What is the difference between continuous delivery and continuous deployment?', a: 'Continuous delivery keeps every passing change ready to release, usually with a manual approval for production. Continuous deployment releases every passing change to production automatically with no manual step.' },
        { q: 'What stages would you put in a CI pipeline for a Node app?', a: 'Install with `npm ci`, lint, type-check, unit and integration tests, build, then on the main branch build and push an image, deploy to staging, run smoke tests, and promote to production.' },
        { q: 'How do you give GitHub Actions access to AWS safely?', a: 'Use OIDC federation: the workflow requests a GitHub-signed token and assumes an IAM role whose trust policy only allows that repository and branch. No long-lived AWS keys are stored in secrets.' },
        { q: 'Why use `npm ci` instead of `npm install` in CI?', a: '`npm ci` installs exactly what the lockfile says, fails if package.json and the lockfile disagree, and starts from a clean `node_modules`, so builds are reproducible.' },
        { q: 'What does "build once, deploy many" mean?', a: 'Build a single artifact, like a Docker image identified by its digest, and promote that same artifact through staging and production, changing only configuration. You deploy exactly what you tested.' },
      ],
      answer30: "CI runs automatically on every PR: install with npm ci, lint, type-check, test and build, so problems are caught before merge. CD takes what passed and ships it. I build one artifact, usually a Docker image tagged with the commit SHA, and promote it through staging to production, with smoke tests and an approval gate. In GitHub Actions I use OIDC to assume an AWS role instead of storing keys, keep token permissions minimal, cache dependencies, and cancel outdated runs.",
      mistakes: [
        "Storing long-lived AWS access keys as repository secrets.",
        "Rebuilding the app separately for each environment.",
        "Tests that are flaky and get re-run until green, so nobody trusts the pipeline.",
        "Using third-party actions by a moving tag without reviewing them.",
        "Trap: 'Your pipeline is green but production broke. Why?' Tests didn't cover it, config differs between environments, or a migration or dependency behaved differently. Answer with smoke tests after deploy, canary releases and fast rollback.",
      ],
      takeaway: 'CI checks every change automatically; CD promotes one tested artifact through environments with OIDC and gates.',
    },

    {
      id: 'infrastructure-as-code',
      title: 'Infrastructure as code: Terraform and CDK',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Define cloud resources in version-controlled code, review changes as diffs, and recreate environments reliably.',
      note: "Terraform moved to the Business Source License in 2023; OpenTofu is the open-source fork with a compatible language. AWS CDK v2 is current (v1 is end of life). Both are widely used; pick whichever the target company uses.",
      what: [
        "**Infrastructure as code (IaC)** means describing servers, queues, buckets, roles and networks in files instead of clicking in the console. The files live in Git, go through code review, and a tool creates or updates the real resources to match.",
        "**Terraform** uses its own declarative language (HCL) and works with many providers (AWS, GCP, Cloudflare, GitHub). **AWS CDK** lets you write infrastructure in TypeScript (or Python, Java...) and compiles it to CloudFormation, AWS's native IaC service.",
      ],
      deeper: [
        "Terraform keeps a **state file** that maps your code to real resource ids. In teams, store it remotely (an S3 backend with locking; recent Terraform versions support S3-native lock files, older setups use a DynamoDB table) so two people can't apply at once. The workflow is `init` -> `plan` (preview the diff) -> `apply`.",
        "CDK synthesises CloudFormation templates; CloudFormation tracks state for you in stacks and rolls back failed deployments. CDK's higher-level constructs bundle best practices (for example, `bucket.grantRead(fn)` writes a least-privilege IAM policy for you). `cdk diff` previews changes.",
        "**Drift** is when someone changes a resource by hand so it no longer matches the code. Avoid console changes in managed environments, and detect drift with `terraform plan` or CloudFormation drift detection.",
        "Good practices: one module/construct per reusable pattern, separate state per environment, run `plan`/`diff` in CI on every PR and `apply` only from the pipeline, and protect stateful resources (databases, buckets) from accidental deletion.",
      ],
      why: "Clicked-together infrastructure can't be reviewed, reproduced or rolled back. IaC makes environments consistent (staging really matches production), documents the setup, and makes disaster recovery a matter of re-running code.",
      analogy: "IaC is an architect's blueprint instead of building from memory. You can review the blueprint, build the same house twice, and see exactly what a renovation will change before anyone picks up a hammer.",
      code: [
        {
          lang: 'ts',
          title: 'AWS CDK (TypeScript): queue + DLQ + worker Lambda',
          source: `import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export class UploadsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'Uploads', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
    });
    const dlq = new sqs.Queue(this, 'UploadsDlq', { retentionPeriod: Duration.days(14) });
    const queue = new sqs.Queue(this, 'UploadsQueue', {
      visibilityTimeout: Duration.minutes(6),          // 6x the function timeout
      deadLetterQueue: { queue: dlq, maxReceiveCount: 5 },
    });

    const worker = new lambda.NodejsFunction(this, 'Worker', {
      entry: 'src/worker.ts',
      timeout: Duration.minutes(1),
    });
    worker.addEventSource(new SqsEventSource(queue, { batchSize: 10, reportBatchItemFailures: true }));
    bucket.grantRead(worker);                           // least-privilege IAM, generated
  }
}`,
        },
        {
          lang: 'bash',
          title: 'Terraform workflow',
          source: `terraform init          # download providers, connect to the remote state backend
terraform fmt -check    # formatting in CI
terraform plan -out=tfplan   # show exactly what will change
terraform apply tfplan  # apply only the reviewed plan`,
        },
      ],
      output: "`cdk deploy` creates a private bucket, a queue with a dead-letter queue after 5 failed receives, and a bundled Node Lambda that consumes the queue with partial batch failures; `grantRead` adds an IAM policy allowing only reads from that bucket. The Terraform commands show the usual review-then-apply loop: `plan` prints the diff, and `apply tfplan` applies exactly that plan.",
      questions: [
        { q: 'What is infrastructure as code and why use it?', a: 'Defining cloud resources in version-controlled files that a tool applies. Changes are reviewed like code, environments are reproducible and consistent, and you can recreate everything after a disaster.' },
        { q: 'Terraform vs AWS CDK?', a: 'Terraform uses its own declarative language, keeps its own state file and works across many cloud providers. CDK lets you write AWS infrastructure in TypeScript or other languages with high-level constructs and deploys through CloudFormation, which manages state and rollback.' },
        { q: 'What is the Terraform state file and how do teams handle it?', a: 'It maps your configuration to real resource ids so Terraform knows what exists. Teams store it remotely, for example in S3 with locking, so it is shared, backed up and never applied by two people at once. It can contain secrets, so access is restricted.' },
        { q: 'What is configuration drift?', a: 'When the real infrastructure differs from the code, usually because someone changed it by hand in the console. The next apply may revert or conflict with the change. You detect it with `terraform plan` or CloudFormation drift detection, and prevent it by making changes only through code.' },
      ],
      answer30: "Infrastructure as code means my AWS resources are defined in files in Git, reviewed in PRs and applied by a tool, so environments are reproducible and changes are visible as diffs. Terraform uses HCL, works across providers and keeps a state file, which teams store remotely with locking. CDK lets me write AWS infrastructure in TypeScript and deploys through CloudFormation, and its constructs generate things like least-privilege IAM grants. Either way, I run plan or diff in CI and apply only from the pipeline.",
      mistakes: [
        "Keeping Terraform state on one laptop, or committing it to Git (it can contain secrets).",
        "Mixing manual console changes with IaC, causing drift.",
        "Applying without reading the plan, and replacing a database because a property change forces recreation.",
        "Trap: 'Is CDK a different engine from CloudFormation?' No. CDK synthesises CloudFormation templates, and CloudFormation does the actual deployment.",
      ],
      takeaway: 'Infra in Git, reviewed as diffs, applied by a pipeline; Terraform is multi-cloud HCL, CDK is TypeScript over CloudFormation.',
    },

    {
      id: 'deployment-strategies',
      title: 'Deployment strategies: rolling, blue-green, canary, feature flags',
      level: 'advanced',
      priority: 'must',
      frequency: 'common',
      summary: 'Ways to release without downtime and limit the blast radius: replace gradually, switch environments, test on a slice of traffic, or hide code behind flags.',
      note: "On your resume: on Skillkeepr you used LaunchDarkly feature flags in microservices for incremental deployments and A/B testing (see My Resume and Projects).",
      what: [
        "**Rolling**: replace old instances with new ones a few at a time. No extra environment needed, but for a while both versions serve traffic.",
        "**Blue-green**: run the new version (green) next to the old one (blue), test it, then switch all traffic at once (load balancer or DNS). Rollback is switching back. It needs double the capacity during the switch.",
        "**Canary**: send a small share of traffic (say 5%) to the new version, watch error rates and latency, then increase step by step. If metrics get worse, roll back automatically.",
        "**Feature flags**: deploy code switched off, then turn it on for chosen users or a percentage of users at runtime, without a redeploy. This separates *deploying* code from *releasing* a feature.",
      ],
      deeper: [
        "Whatever the strategy, old and new versions run at the same time, so changes must be **backward compatible**. Database migrations follow **expand and contract**: add the new column (expand), deploy code that writes both, backfill, switch reads, and only later remove the old column (contract).",
        "Canaries need good metrics and automated rollback (for example CodeDeploy alarms, Argo Rollouts, or Lambda alias weighted routing). Sticky routing keeps a user on one version to avoid confusing switches mid-session.",
        "Feature flag hygiene: flags have owners and expiry dates; old flags are removed, because each one doubles the code paths to test. Use deterministic hashing so a user always gets the same variant, and keep a kill switch for risky features.",
        "Others: **recreate** (stop old, start new; downtime, but simple) and **shadow** traffic (copy real requests to the new version without returning its responses).",
      ],
      why: "Most incidents are caused by changes. These strategies let you release often while limiting how many users a bad release can hurt and how fast you can undo it.",
      analogy: "Rolling is replacing a bridge's planks one at a time while people walk on it. Blue-green is building a second bridge and moving everyone across at once. Canary is sending a few walkers first and watching. Feature flags are a curtain over a finished room that you open when you're ready.",
      code: {
        lang: 'js',
        title: 'Percentage rollout with deterministic hashing (how flag tools work)',
        source: `import { createHash } from 'node:crypto';

// Deterministic bucket 0-99 for a user + flag, so a user always gets the same answer
function bucket(flagKey, userId) {
  const hash = createHash('sha256').update(\`\${flagKey}:\${userId}\`).digest();
  return hash.readUInt32BE(0) % 100;
}

function isEnabled(flag, user) {
  if (!flag.enabled) return false;                       // kill switch
  if (flag.allowTenants.includes(user.tenantId)) return true; // beta tenants
  return bucket(flag.key, user.id) < flag.rolloutPercent; // gradual rollout
}

const flag = { key: 'new-scoring', enabled: true, rolloutPercent: 10, allowTenants: ['t-beta'] };

const users = Array.from({ length: 10000 }, (_, i) => ({ id: \`u\${i}\`, tenantId: 't-1' }));
const on = users.filter((u) => isEnabled(flag, u)).length;
console.log('enabled for', on, 'of', users.length);
console.log('same user, same answer:', isEnabled(flag, users[42]) === isEnabled(flag, users[42]));
console.log('beta tenant:', isEnabled(flag, { id: 'x', tenantId: 't-beta' }));
console.log('kill switch:', isEnabled({ ...flag, enabled: false }, { id: 'x', tenantId: 't-beta' }));`,
      },
      output: "enabled for 962 of 10000\nsame user, same answer: true\nbeta tenant: true\nkill switch: false\n\nAbout 10% of users (962 here) get the feature, and the same user always gets the same answer because the bucket comes from a hash, not a random number. Beta tenants always get it, and turning `enabled` off disables it for everyone instantly.",
      questions: [
        { q: 'Compare rolling, blue-green and canary deployments.', a: 'Rolling replaces instances gradually with no extra environment but mixes versions for a while. Blue-green runs a full new environment and switches all traffic at once, with instant rollback but double capacity. Canary sends a small slice of traffic to the new version and increases it while watching metrics.' },
        { q: 'What is the difference between deploying and releasing?', a: 'Deploying puts new code on servers; releasing makes a feature visible to users. Feature flags separate the two, so you can deploy dark and release later, gradually, or roll back without a redeploy.' },
        { q: 'How do you handle database migrations with zero-downtime deploys?', a: 'Use expand and contract: make additive, backward-compatible changes first, deploy code that works with both shapes, backfill data, switch over, and remove the old column or field only in a later release.' },
        { q: 'What makes a canary release safe?', a: 'Clear health metrics compared against the stable version (error rate, latency, business metrics), small traffic steps with time to observe, and automatic rollback when an alarm fires.' },
        { q: 'What are the downsides of feature flags?', a: 'Every flag adds a code path to test and reason about, and stale flags pile up as technical debt. Flags need owners, expiry dates and cleanup, and flag evaluation must not become a single point of failure.' },
      ],
      answer30: "I choose a strategy by risk. Rolling deploys are the default for routine changes. Blue-green gives instant rollback by switching traffic between two environments. Canary sends a small percentage of traffic to the new version and increases it while watching error rates and latency, with automatic rollback. Feature flags separate deploy from release, so I can ship code dark and turn it on per tenant or percentage. In all of them both versions run at once, so APIs and database migrations must be backward compatible, using expand and contract.",
      mistakes: [
        "A breaking database migration in the same release as the code that needs it, so the old version breaks mid-rollout.",
        "Canary without metrics or automated rollback, which is just a slower deploy.",
        "Random (not hashed) flag assignment, so users flip between variants on every request.",
        "Leaving dozens of old flags in the code.",
        "Trap: 'Blue-green means instant rollback, right?' Only for stateless code. If green already wrote data in a new format, switching back to blue may break unless the change was backward compatible.",
      ],
      takeaway: 'Limit the blast radius: roll, switch or canary deploys, flag releases, and keep every change backward compatible.',
    },

    {
      id: 'localstack',
      title: 'LocalStack: AWS on your laptop',
      level: 'basic',
      priority: 'good',
      frequency: 'occasional',
      summary: 'An emulator for AWS services in Docker, so you can develop and test S3, SQS and friends locally without touching a real account.',
      note: "On your resume: you set up LocalStack with Docker Compose so developers could run S3 and SQS locally (see My Resume and Projects). LocalStack has a free community edition and paid tiers; which services are free has changed over time, so check before promising a specific service works locally.",
      what: [
        "LocalStack runs emulated AWS services (S3, SQS, SNS, Lambda, DynamoDB and more) inside a Docker container, all on one port, `4566`. Your code uses the normal AWS SDK, but points at `http://localhost:4566` instead of real AWS.",
        "It's used for local development, automated tests in CI, and trying out infrastructure code without cost or risk.",
      ],
      deeper: [
        "Point the SDK at LocalStack by setting an endpoint. With AWS SDK v3 you can pass `endpoint` in the client config, or set the `AWS_ENDPOINT_URL` environment variable, which recent SDKs and the AWS CLI read automatically. For S3, use path-style URLs (`forcePathStyle: true`) so bucket names don't need DNS.",
        "Create resources on startup with init hooks (scripts in `/etc/localstack/init/ready.d`) or by running your IaC against LocalStack (`tflocal`, `cdklocal`).",
        "Limits: it's an emulator, not AWS. IAM policies aren't enforced by default, some behaviours and limits differ, and some services need a paid plan. Keep a staging environment in real AWS for final checks.",
      ],
      why: "Testing against real AWS from every laptop is slow, costs money, needs credentials and risks shared resources. LocalStack gives every developer and CI run an isolated, disposable copy.",
      analogy: "LocalStack is a flight simulator: the same controls as the real plane, so you can practise and crash for free, but you still do a real test flight before carrying passengers.",
      code: [
        {
          lang: 'bash',
          title: 'localstack-init/init.sh (runs when LocalStack is ready)',
          source: `#!/bin/bash
awslocal s3 mb s3://app-uploads
awslocal sqs create-queue --queue-name uploads-dlq
awslocal sqs create-queue --queue-name uploads-queue \\
  --attributes '{"RedrivePolicy":"{\\"deadLetterTargetArn\\":\\"arn:aws:sqs:ap-south-1:000000000000:uploads-dlq\\",\\"maxReceiveCount\\":\\"5\\"}"}'`,
        },
        {
          lang: 'ts',
          title: 'One client config for local and cloud',
          source: `import { S3Client } from '@aws-sdk/client-s3';

const isLocal = process.env.NODE_ENV !== 'production' && !!process.env.AWS_ENDPOINT_URL;

export const s3 = new S3Client({
  region: process.env.AWS_REGION ?? 'ap-south-1',
  ...(isLocal && {
    endpoint: process.env.AWS_ENDPOINT_URL, // http://localstack:4566 in Compose
    forcePathStyle: true,                   // http://host/bucket/key, no DNS tricks
  }),
});`,
        },
      ],
      output: "On startup LocalStack runs the init script: it creates the bucket, the DLQ and the main queue with a redrive policy (LocalStack's default account id is `000000000000`). The app's S3 client talks to LocalStack locally and to real AWS in production, with no other code changes.",
      questions: [
        { q: 'What is LocalStack?', a: 'A tool that emulates AWS services like S3, SQS, SNS, Lambda and DynamoDB in a Docker container, so you can develop and test against them locally using the normal AWS SDK and CLI.' },
        { q: 'How does your code talk to LocalStack instead of AWS?', a: 'By overriding the endpoint, either with the `endpoint` option on the SDK client or the `AWS_ENDPOINT_URL` environment variable, pointing at `http://localhost:4566`, with dummy credentials. For S3, path-style addressing is usually enabled.' },
        { q: 'What are LocalStack\'s limitations?', a: 'It is an emulator, so behaviour, limits and IAM enforcement can differ from real AWS, and some services or features need a paid plan. You still need a real staging environment for final verification.' },
        { q: 'Why not just test against a dev AWS account?', a: 'Shared dev accounts cost money, need credentials on every laptop, are slower, and developers or CI runs can interfere with each other\'s data. LocalStack gives each run an isolated, disposable environment.' },
      ],
      answer30: "LocalStack emulates AWS services like S3 and SQS in a Docker container. I ran it with Docker Compose next to the API, used an init script to create buckets and queues, and pointed the AWS SDK at it with an endpoint override, so developers could run the whole upload pipeline locally without real AWS. It's great for development and CI, but it's an emulator, so IAM and some behaviours differ, and we still verify in a real staging environment.",
      mistakes: [
        "Hard-coding `localhost:4566` so the same code can't run in production.",
        "Forgetting path-style addressing for S3 and getting DNS errors for `bucket.localhost`.",
        "Assuming IAM policies are tested locally. By default LocalStack doesn't enforce them.",
        "Trap: 'Inside Docker Compose, why does localhost:4566 fail?' Inside a container, `localhost` is that container. Use the service name, `http://localstack:4566`.",
      ],
      takeaway: 'LocalStack = free, disposable AWS for dev and CI; switch by endpoint config, and still verify on real AWS.',
    },
  ],
  rapidFire: [
    { q: 'IaaS vs PaaS vs SaaS?', a: 'You manage the OS (IaaS), only your code (PaaS), or nothing but usage (SaaS).' },
    { q: 'Region vs availability zone?', a: 'A region is a geographic area; an AZ is an isolated data centre group inside it.' },
    { q: 'How do you get high availability on AWS?', a: 'Stateless instances in 2+ AZs behind a load balancer, plus a Multi-AZ database.' },
    { q: 'What is a presigned URL?', a: 'A temporary signed URL allowing one specific S3 action, so clients upload or download directly.' },
    { q: 'Can a presigned PUT limit file size?', a: 'No. Use a presigned POST with content-length-range, or validate after upload.' },
    { q: 'Max single S3 PUT size?', a: '5 GB; larger objects need multipart upload.' },
    { q: 'Lambda maximum timeout?', a: '15 minutes.' },
    { q: 'What causes a Lambda cold start?', a: 'Creating a new execution environment and running init code before the first request.' },
    { q: 'Why init clients outside the Lambda handler?', a: 'They are reused across warm invocations instead of recreated per request.' },
    { q: 'SQS default visibility timeout?', a: '30 seconds (maximum 12 hours).' },
    { q: 'What does a DLQ do?', a: 'Collects messages that failed maxReceiveCount times so they stop retrying and can be inspected.' },
    { q: 'SQS standard queue delivery guarantee?', a: 'At least once, best-effort order, so consumers must be idempotent.' },
    { q: 'SQS vs SNS in one line?', a: 'SQS: one consumer pulls each message. SNS: push a copy to every subscriber.' },
    { q: 'DynamoDB item size limit?', a: '400 KB.' },
    { q: 'Query vs Scan?', a: 'Query reads one partition key; Scan reads the whole table.' },
    { q: 'Multi-AZ vs read replica?', a: 'Multi-AZ is failover for availability; read replicas scale reads and may lag.' },
    { q: 'IAM: allow and deny both match. Result?', a: 'Explicit deny always wins.' },
    { q: 'User vs role?', a: 'Users have long-term credentials; roles are assumed for temporary credentials.' },
    { q: 'What makes a subnet public?', a: 'A route to an internet gateway in its route table.' },
    { q: 'NAT gateway purpose?', a: 'Outbound internet for private subnets, no inbound.' },
    { q: 'How to cache a SPA on a CDN?', a: 'Hashed assets cached for a year, index.html with no-cache.' },
    { q: 'Image vs container?', a: 'An image is the template; a container is a running instance of it.' },
    { q: 'Why multi-stage Docker builds?', a: 'Build with full tooling, ship a small image with only runtime files.' },
    { q: 'Readiness vs liveness probe?', a: 'Readiness gates traffic; liveness restarts a stuck container.' },
    { q: 'Continuous delivery vs deployment?', a: 'Delivery is always releasable with a manual gate; deployment releases automatically.' },
    { q: 'How should CI access AWS?', a: 'OIDC to assume a scoped IAM role, no stored access keys.' },
    { q: 'Canary deployment?', a: 'Send a small slice of traffic to the new version, watch metrics, then expand or roll back.' },
    { q: 'Expand and contract?', a: 'Additive, backward-compatible schema changes first, remove old fields only in a later release.' },
  ],
};
export default cloud;
