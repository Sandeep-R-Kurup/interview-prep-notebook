// HR and Behavioral stack. Topics are auto-sorted Basic -> Intermediate -> Advanced by the registry.
// Built from projects.js (the uploaded resumes). Every story here is a template: fill the gaps with what really happened.
// Never invent achievements, numbers, team sizes or employers. If you don't have a detail, leave it out.

const hr = {
  name: 'HR and Behavioral',
  intro:
    'The questions that decide offers more often than code does. Every answer here is a template built from your resume: replace each gap in brackets with your real detail, say it out loud a few times, and never add anything you can\'t back up.',
  topics: [
    // ------------------------------------------------------------------ 1
    {
      id: 'tell-me-about-yourself',
      title: 'Tell me about yourself',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'A 60 to 90 second pitch: who you are now, what you have built, and why you are here, ending on a hook the interviewer can pick up.',
      what: [
        "This is almost always the first question. It's not a request for your life story. It's 'give me a short professional summary so I know where to start'.",
        "Use the **present - past - future** shape. Present: what you do now and your stack. Past: two or three things you built that match this job. Future: why this role is the next step. Keep it to 60 to 90 seconds.",
      ],
      deeper: [
        "Tailor the middle part to the job description. For a backend role, lead with multi-tenant APIs, the SQS pipeline, and the audit logging service. For a full stack role, add the React integration work. For an AI role, lead with the agent orchestrator and the AI-driven screening flow.",
        "End with a hook, not a fade-out. 'Happy to go deeper into any of these' invites them to pick a topic you prepared for. The 'Walk me through your projects' page in My Resume and Projects is the longer version of this answer.",
      ],
      why: "First impressions anchor the rest of the interview. A clear, confident summary tells them your level and gives them good topics to ask about. A rambling one makes them pick topics for you.",
      analogy: "A movie trailer. It shows the best scenes and the genre in 90 seconds, and makes you want to watch the film. It doesn't tell the whole plot.",
      code: {
        lang: 'text',
        title: 'Your 90-second answer (fill the gaps, then say it out loud)',
        source: `PRESENT
"I'm a full stack engineer with 3+ years at Haspaces Technology Solutions in Trivandrum,
 mostly backend-focused: Node.js, TypeScript, Express, MongoDB and AWS, with React on the frontend."

PAST (pick the 2-3 that match this job)
"Right now I work on Octagnt.ai, an agentic AI platform that helps companies shortlist candidates.
 I design multi-tenant REST APIs with tenant isolation on every query, built cookie-based JWT auth
 with RBAC across 4 roles and 8 modules, designed an orchestrator that runs pipelines across 35+
 AI agents behind one gateway, and built an SQS and S3 pipeline for bulk uploads of 50+ files.

 Before that, on Skillkeepr, an HR and recruitment SaaS, I built a compliance-grade audit logging
 service, led our TypeScript migration, upgraded Node from 18 to 20, and added Jest coverage that
 cut regression bugs by about 30%."

FUTURE
"I'm looking for (say what you want next: e.g. a role with larger scale / more ownership of system
 design / a product in this domain), and this role fits because (one specific reason from their
 job description)."

HOOK
"Happy to go deeper into any of those."`,
      },
      output: "Said at a calm pace, this takes about 75 to 90 seconds. The interviewer now knows your stack, your level (you own designs), your domain (HR tech and AI), and at least four topics they can dig into, all of which you've prepared.",
      questions: [
        {
          q: "Tell me about yourself.",
          a: "Present, past, future in 90 seconds: 'Full stack engineer, 3+ years, backend-focused on Node, TypeScript, MongoDB, AWS. On Octagnt.ai I built multi-tenant APIs, auth and RBAC, an orchestrator over 35+ AI agents, and an SQS bulk-upload pipeline. On Skillkeepr I built audit logging and led the TypeScript migration. I'm looking for (your real goal), which is why this role interests me.'",
        },
        {
          q: "Walk me through your resume.",
          a: "Same structure, in time order and a bit longer: one company, two products. Skillkeepr from June 2023 to February 2026, then Octagnt.ai from February 2026. Give each product one line on what it does and two lines on what you owned, then stop.",
        },
        {
          q: "You've been at one company your whole career. Why?",
          a: "'It gave me two very different products: a mature HR SaaS where I learned reliability and testing, and a new agentic AI platform where I designed core pieces from scratch. The scope kept growing, so I kept learning without needing to move.' Only say this if it's true for you.",
        },
        {
          q: "Describe yourself in three words.",
          a: "Pick three you can back with a story each, like 'reliable, curious, ownership-driven', and give a one-line example for one of them, such as leading the TypeScript migration for ownership.",
        },
      ],
      answer30:
        "I'm a full stack engineer with over three years at Haspaces Technology Solutions, mostly backend: Node, TypeScript, MongoDB, and AWS, with React on the front. On Octagnt.ai, an agentic AI hiring platform, I design multi-tenant APIs, built JWT auth with RBAC, an orchestrator over 35+ AI agents, and an SQS pipeline for bulk uploads. Before that, on Skillkeepr, I built a compliance-grade audit logging service and led our TypeScript migration. I'm now looking for (your real goal), and this role fits because (their specific reason).",
      mistakes: [
        "Starting with school, hometown, or hobbies. Start with what you do now.",
        "Reading the resume line by line. Pick the two or three items that match this job.",
        "Going past two minutes. Stop and let them choose.",
        "Using numbers you can't explain. The 30% regression figure will get a 'how did you measure that?'.",
        "Trap: a vague ending like 'so yeah, that's me'. End with why this role and an offer to go deeper.",
      ],
      takeaway: 'Present, past, future in 90 seconds, tailored to the job, ending on a hook you prepared for.',
    },

    // ------------------------------------------------------------------ 2
    {
      id: 'why-leaving-why-now',
      title: 'Why are you leaving? Why now?',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'One honest, positive reason, focused on what you are moving towards, never a complaint about your current employer.',
      note:
        "Your resumes say Octagnt.ai 'Feb 2026 - Present', but your study brief says the role ends in September 2026. Decide which is true, update your resume so it matches, and use the matching answer below. If you've already left, interviewers will ask what you've been doing since; have a short, true answer (for example interview preparation, upskilling, or a personal project).",
      what: [
        "The interviewer is checking two things: that you're not running from a problem you caused, and that you won't leave them just as quickly. The best answer is short, honest, and about what you're moving **towards**.",
        "Never criticise your current or previous company, manager, or team, even if it's true. It makes the interviewer wonder what you'll say about them.",
      ],
      deeper: [
        "Good honest reasons: the project or engagement ended, you want larger scale or a different domain, you want more ownership of system design, you've been at one company for 3+ years and want to see how other teams build, or relocation.",
        "If your role ended (project wound down, restructuring), say so plainly and without drama. It's common and not a red flag. Then pivot to what you want next.",
        "Keep it to two or three sentences. The longer you talk about leaving, the more it sounds like a grievance.",
      ],
      why: "A bad answer here can end an otherwise good interview. A calm, forward-looking answer shows maturity and reassures them you'll stay.",
      analogy: "Moving house. 'We needed more space for the family' sounds like a plan. 'Our neighbours were terrible and the landlord was a crook' makes the new landlord nervous.",
      code: {
        lang: 'text',
        title: 'Pick the version that is true, then fill the gap',
        source: `IF YOUR OCTAGNT ROLE ENDED (or ends) IN SEPTEMBER 2026
"My role on Octagnt.ai (say the real reason in one neutral line, e.g. 'was a fixed-scope
 engagement that wrapped up in September' / 'ended when the company restructured the team').
 I'm proud of what I built there, especially (one thing: e.g. the agent orchestrator or the
 SQS pipeline). Now I'm looking for (what you want next), which is why this role stands out."

IF YOU ARE STILL EMPLOYED
"I've had over three years at Haspaces across two products, and I've grown a lot there.
 I'm looking for (say the real pull: larger scale / deeper system design ownership /
 a product in this domain / a bigger engineering team to learn from), and this role offers that
 because (one specific thing from their job description)."

IF ASKED 'WHAT HAVE YOU BEEN DOING SINCE?'
"(Say what you have really been doing, e.g. 'preparing for interviews and going deeper into
 system design and AI integrations, and building (a real personal project, if any).')"`,
      },
      output: "A two to three sentence answer that states a neutral reason, names one thing you're proud of, and moves the conversation to why this new role fits. No complaints, no long explanations.",
      questions: [
        {
          q: "Why are you leaving your current job?",
          a: "One honest, neutral line on the reason, one line on what you're proud of, and one line on what you want next and why this role offers it. Example shape: 'My role on Octagnt (real reason). I'm proud of (one thing). Now I want (real goal), which this role offers.'",
        },
        {
          q: "Why now, after more than three years?",
          a: "'I've had a good run across two products and built core pieces of both. (If true: the Octagnt work has wrapped up.) It's a natural point to take what I've learned to a bigger or different challenge, specifically (your real goal).'",
        },
        {
          q: "Were you let go?",
          a: "Answer honestly and briefly. If the role ended because the project or company changed, say that in one line. If it was performance-related, say what you learned and what you do differently now. Don't lie: reference checks exist.",
        },
        {
          q: "What would make you stay at your current company?",
          a: "Be honest but brief: 'If the kind of work I'm looking for, (your goal), were available there, I'd consider it. That's why I'm being selective about the next role.' If you've already left, this question doesn't apply.",
        },
      ],
      answer30:
        "My work on Octagnt.ai (say the real reason in one neutral line, for example that the engagement wrapped up in September 2026). I'm proud of what I built there, especially (one thing, such as the agent orchestrator). After more than three years at one company across two products, I'm looking for (your real goal), and this role stands out because (one specific reason from their job description).",
      mistakes: [
        "Complaining about salary, managers, or the company.",
        "A long, defensive explanation. Two or three sentences is enough.",
        "Saying 'present' on the resume and 'it ended in September' in the interview. Make them match before you apply.",
        "Trap: 'So money is the reason?' If salary is part of it, it's fine to say 'it's one factor, but the main reason is (growth reason)'. Don't pretend money doesn't matter, and don't make it the only reason.",
      ],
      takeaway: 'Short, honest, neutral reason; one thing you are proud of; pivot to what you want next.',
    },

    // ------------------------------------------------------------------ 3
    {
      id: 'why-this-company',
      title: 'Why this company? Why this role?',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Three specific reasons: their product or mission, the technical work, and how your experience fits, all researched before the interview.',
      what: [
        "This tests whether you did your homework and whether you actually want **this** job, not any job. Generic praise ('great culture, big brand') is the most common weak answer.",
        "A strong answer connects three things: something specific about **them** (product, customers, recent news, engineering blog), the **work** in this role, and **your** matching experience.",
      ],
      deeper: [
        "Ten minutes of research is enough: their website and product, the job description line by line, their engineering blog or GitHub, recent funding or launches, and the interviewer's LinkedIn. Note one thing you genuinely find interesting.",
        "Match your projects to their job description. If they mention multi-tenancy, queues, payments, or LLMs, you have direct stories for each.",
      ],
      why: "Companies want people who will stay and care about the product. A specific answer signals both, and it's an easy chance to steer them towards your strongest projects.",
      analogy: "A cover letter that starts 'Dear Sir or Madam' versus one that names the team and the product. The second one gets read.",
      code: {
        lang: 'text',
        title: 'Three-part answer template',
        source: `1) THEM (specific, researched)
"I've been reading about (their product / a recent launch / an engineering blog post),
 and (what specifically interests you about it)."

2) THE WORK (from their job description)
"The role focuses on (two things from the JD, e.g. 'scaling multi-tenant APIs' or
 'building LLM features into the product')."

3) YOU (matching experience, from your resume only)
"That's close to what I've been doing: (one matching item, e.g. 'designing tenant-isolated
 APIs on Octagnt' / 'the SQS pipeline for bulk uploads' / 'the orchestrator over 35+ AI agents'),
 so I can contribute early, and I'd learn (something real you'd gain from them)."`,
      },
      output: "A 45 to 60 second answer that proves you researched them, shows you understand the role, and links it to a project you can talk about for five minutes. It often leads straight into a technical question about that project.",
      questions: [
        {
          q: "Why do you want to work here?",
          a: "Three parts: something specific about their product or engineering you genuinely like, two things from the job description, and the matching experience from your resume. For example, if they build on Node and AWS with multi-tenant SaaS, point to your tenant isolation and SQS work on Octagnt.",
        },
        {
          q: "What do you know about our company?",
          a: "Two or three researched facts: what the product does and for whom, a recent launch or milestone, and something about how they build (stack, blog post). Then one line on why that interests you.",
        },
        {
          q: "Why should we hire you?",
          a: "Match their top two or three requirements to your proof: 'You need someone who can (requirement); on Octagnt I (real example). You need (requirement); on Skillkeepr I (real example). And I (one trait with evidence).'",
        },
      ],
      answer30:
        "Three reasons. First, (something specific about their product or engineering that you genuinely find interesting). Second, the role focuses on (two things from their job description), which is the kind of work I want more of. Third, it matches what I've done: on Octagnt.ai I (the most relevant item, for example designed tenant-isolated APIs or an orchestrator over 35+ AI agents), so I can contribute early while learning (something real you'd gain there).",
      mistakes: [
        "Generic praise that could apply to any company.",
        "Talking only about what you'll get (salary, brand, location) and nothing about what you'll contribute.",
        "Getting a basic fact about their product wrong because you didn't check.",
        "Trap: 'We're a small startup, why not a big company?' (or the reverse). Have a real answer about the kind of environment you want, not a flattering one.",
      ],
      takeaway: 'Something specific about them, the work in the role, and your matching proof.',
    },

    // ------------------------------------------------------------------ 4
    {
      id: 'strengths-weaknesses',
      title: 'Strengths and weaknesses',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Strengths backed by a resume example; a real but manageable weakness plus what you are doing about it.',
      what: [
        "**Strengths**: pick two or three that matter for the job and prove each with a short example from your work. A strength without proof is just a claim.",
        "**Weakness**: pick something real that won't disqualify you for the role, and show what you're actively doing about it. The interviewer is testing self-awareness, not looking for a confession.",
      ],
      deeper: [
        "Strengths your resume supports (choose the ones that are true for you): owning things end to end (multi-tenant APIs, the orchestrator), reliability thinking (idempotent SQS workers, audit logging with redaction), improving codebases (the TypeScript migration, Jest coverage), and safe delivery (feature flags, staged Node upgrade).",
        "Weakness ideas, only if true: going too deep on a problem before asking for help, less experience with frontend design systems because your work is backend-heavy, under-communicating progress while heads-down, or limited public speaking. Pair it with a concrete fix: 'I now time-box investigations to (N) hours before asking', 'I post a short daily update'.",
      ],
      why: "These questions reveal self-awareness and honesty. A believable weakness with a fix often scores better than a polished strength.",
      analogy: "A product's spec sheet: features with test results (strengths with examples), and known limitations with a roadmap (weakness with a plan). Buyers trust spec sheets that admit limitations.",
      code: {
        lang: 'text',
        title: 'Strength and weakness templates',
        source: `STRENGTH (claim -> proof -> result)
"One of my strengths is (strength, e.g. 'building reliable backend systems').
 For example, on Octagnt I (real example, e.g. 'built the SQS bulk-upload pipeline with idempotent
 workers and a dead-letter queue'), so (result you can honestly state, e.g. 'one bad file no longer
 failed the whole batch')."

WEAKNESS (real -> impact -> what you do now -> progress)
"Something I'm working on is (a real weakness that isn't core to this job).
 In the past it meant (honest small impact).
 Now I (specific habit you actually use).
 (Real sign of progress, e.g. 'my lead mentioned my updates are clearer' - only if it happened)."`,
      },
      output: "Strengths come across as evidence, not adjectives, and point the interviewer to projects you can discuss. The weakness sounds honest and controlled, ending on what you're doing, which leaves a positive last impression.",
      questions: [
        {
          q: "What are your greatest strengths?",
          a: "Two or three with proof. Example shape: 'Ownership: I designed and built the multi-tenant APIs and the agent orchestrator on Octagnt end to end. Improving codebases: I led Skillkeepr's TypeScript migration.' Only use the ones that are true for you.",
        },
        {
          q: "What is your biggest weakness?",
          a: "A real, non-critical weakness, its past impact, and the habit you use now. For example, 'I used to dig into a hard bug for too long before asking for help. Now I time-box it and ask after (your real limit), with notes on what I tried.' Use your own.",
        },
        {
          q: "What would your manager say you need to improve?",
          a: "Give a real piece of feedback you received and what you changed after it. If you never got formal feedback, say what you'd expect them to say and why.",
        },
        {
          q: "What do your colleagues say about you?",
          a: "One or two traits with a short example, ideally something a teammate actually said. Don't invent quotes.",
        },
      ],
      answer30:
        "My main strength is ownership of backend systems end to end. On Octagnt I designed and built the multi-tenant APIs and the orchestrator over 35+ AI agents, and on Skillkeepr I led the TypeScript migration. A weakness I'm working on is (your real weakness, for example spending too long on a problem before asking for help). Now I (the specific habit you use, such as time-boxing and asking with notes), and it's (honest progress).",
      mistakes: [
        "Fake weaknesses like 'I'm a perfectionist' or 'I work too hard'. Interviewers hear them daily.",
        "A weakness that is a core requirement of the job, like 'I'm not good with databases' for a backend role.",
        "Strengths with no example.",
        "Trap: 'Give me another weakness.' Prepare two, so you're not caught improvising.",
      ],
      takeaway: 'Strengths need proof; weaknesses need a fix you are actually using.',
    },

    // ------------------------------------------------------------------ 5
    {
      id: 'star-method',
      title: 'The STAR method for behavioral answers',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Situation, Task, Action, Result: a short setup, most of the time on what you did, and a clear result with what you learned.',
      what: [
        "Behavioral questions start with 'Tell me about a time when...'. The interviewer believes past behaviour predicts future behaviour, so they want a real story, not a hypothetical.",
        "STAR keeps the story tight: **Situation** (context in one or two sentences), **Task** (your responsibility), **Action** (what **you** did, step by step), **Result** (outcome, ideally measurable, plus what you learned).",
      ],
      deeper: [
        "Time split: about 10% Situation, 10% Task, 60% Action, 20% Result. Most weak answers spend a minute on background and ten seconds on what they did.",
        "Say 'I', not 'we', for your parts. Be specific about decisions and trade-offs. End the Result with a learning, which turns even a failure into a good answer.",
        "Build a story bank of five to seven real stories you can adapt: a technical challenge, a conflict, a mistake, a deadline, a time you led or helped someone, ambiguous requirements, and something you're proud of. Good sources from your resume: the TypeScript migration, the Node 18 to 20 upgrade, the SQS pipeline, the audit logging service, a production issue you fixed, and the ATS sync deduplication decisions. Use only the stories that really happened the way you tell them.",
      ],
      why: "Unstructured stories wander and lose the point. STAR makes you sound clear and senior, and makes it easy for the interviewer to score you on their rubric.",
      analogy: "A news report: where and when (situation), what the reporter set out to cover (task), what happened (action), and the outcome (result). Readers get the point in the first few lines.",
      code: {
        lang: 'text',
        title: 'STAR template and your story bank',
        source: `S - Situation (1-2 sentences): "On (product), (context)."
T - Task (1 sentence):          "I was responsible for (your part)."
A - Action (most of the answer): "First I ... Then I ... I chose X over Y because ..."
R - Result (with numbers if real): "(Outcome). I learned (lesson), and now I (habit)."

STORY BANK (fill each with what really happened)
1. Technical challenge  -> e.g. SQS bulk-upload pipeline (timeouts, duplicates, partial failure)
2. Leading a change     -> e.g. TypeScript migration on Skillkeepr
3. Risky rollout        -> e.g. Node 18 -> 20 upgrade, or a LaunchDarkly flagged release
4. Production issue     -> (your real incident, how fast it was fixed, what you added after)
5. Conflict/disagreement-> (a real technical disagreement and how it was resolved)
6. Mistake              -> (a real mistake you made and what you changed)
7. Ambiguity            -> e.g. (a real feature with unclear requirements, such as ATS sync rules)`,
      },
      output: "Each story fits in about two minutes, spends most of its time on your actions and reasoning, and ends with a result and a lesson. With seven stories prepared, you can answer most behavioral questions by adapting one of them.",
      questions: [
        {
          q: "What is the STAR method?",
          a: "A structure for behavioral answers: Situation (brief context), Task (your responsibility), Action (what you did, the longest part), Result (outcome and what you learned).",
        },
        {
          q: "How long should a STAR answer be?",
          a: "About one and a half to two minutes. Keep setup short, spend most time on your actions and decisions, and finish with the result. The interviewer will ask follow-ups if they want more.",
        },
        {
          q: "What if the result wasn't good?",
          a: "Say so honestly, then focus on what you learned and what you changed afterwards. A failure with a clear lesson is a strong answer.",
        },
        {
          q: "What if you don't have an example for the question?",
          a: "Adapt the closest real story, or say honestly 'I haven't faced exactly that, but the closest was...'. Never invent a story; follow-up questions expose made-up details quickly.",
        },
      ],
      answer30:
        "I answer behavioral questions with STAR: a sentence or two of situation, my specific task, then most of the time on the actions I took and why, and finally the result, with numbers if I have real ones, plus what I learned. I keep a bank of real stories from my work, like the TypeScript migration, the SQS pipeline, the Node upgrade, and a production issue, and adapt them to the question.",
      mistakes: [
        "Spending most of the answer on background.",
        "Saying 'we' throughout so your own contribution is invisible.",
        "No result, or a result with no lesson.",
        "Trap: inventing or exaggerating a story. Interviewers dig with 'what exactly did you do next?' and made-up details fall apart.",
      ],
      takeaway: 'Short setup, long action, clear result and lesson, and only real stories.',
    },

    // ------------------------------------------------------------------ 6
    {
      id: 'conflict-with-teammate',
      title: 'A conflict with a teammate',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'A real disagreement about work (not personality), handled privately with data and listening, ending in a decision and a working relationship that survived.',
      what: [
        "The interviewer wants to see that you can disagree without damaging the relationship, that you listen, and that you focus on the problem rather than the person.",
        "Pick a **professional** disagreement: a design choice, code review feedback, priorities, how strict a migration should be. Avoid stories about personal dislike, and never make the other person the villain.",
      ],
      deeper: [
        "A good arc: you noticed the disagreement, talked one to one (not in a public channel), asked questions to understand their view, brought data or a small experiment instead of opinions, agreed on a decision (yours, theirs, or a mix, or escalated to the lead together), and kept working well together afterwards.",
        "It's fine, even good, if the other person turned out to be right. 'I changed my mind when I saw X' shows maturity.",
        "Possible sources from your work, only if a real disagreement happened: how strict to make TypeScript settings during the migration, whether to process bulk uploads in the request or in a queue, whether to auto-merge duplicate candidates in the ATS sync, or how long a retry policy should be.",
      ],
      why: "Every team disagrees. Companies want people who turn disagreements into better decisions, not into tension that slows the whole team.",
      analogy: "Two drivers disagreeing on the route. Good drivers pull over, look at the map together, check the traffic, and pick one. Bad ones argue while driving.",
      code: {
        lang: 'text',
        title: 'STAR outline: a disagreement with a teammate',
        source: `S: "On (Skillkeepr / Octagnt), a teammate (their role, not their name) and I disagreed about
    (the real technical or process question)."
T: "I (owned / was reviewing / was co-building) (the part), so we needed to agree before (deadline
    or milestone)."
A: "I asked to talk one to one instead of going back and forth in comments.
    I first asked about their reasons: (their real concern).
    I explained mine: (your real concern).
    To avoid an opinion fight, I (brought data / built a small spike / listed trade-offs in a doc).
    We agreed to (the decision), (and I adjusted my approach because ... / they agreed because ...)."
R: "(What shipped and how it went - real outcome only.) We kept working well together, and I
    learned to (lesson, e.g. 'raise design questions earlier, before code review')."`,
      },
      output: "A two-minute story where the disagreement was about the work, you listened first, the decision was based on evidence, and the relationship stayed good. The interviewer sees collaboration, not combat.",
      questions: [
        {
          q: "Tell me about a conflict with a coworker.",
          a: "STAR with a real professional disagreement: what it was about, that you talked one to one, asked about their reasons first, used data or a small spike to decide, and what was decided. End with the outcome, the relationship afterwards, and what you learned.",
        },
        {
          q: "What if you couldn't agree?",
          a: "'We wrote down both options with trade-offs and took it to our lead together, agreeing to go with the decision. Once decided, I committed fully, even though it wasn't my option.' Disagree and commit.",
        },
        {
          q: "How do you handle code review disagreements?",
          a: "Assume good intent, ask what problem the comment is trying to prevent, separate must-fix issues from preferences, and move long threads to a quick call. If it's a style question, follow the team's convention or add a lint rule so it isn't debated again.",
        },
        {
          q: "Have you worked with someone difficult?",
          a: "Describe the behaviour, not the person, explain how you adapted (clearer written agreements, more frequent check-ins) and the result. Keep it respectful; the interviewer imagines being your colleague.",
        },
      ],
      answer30:
        "On (product), a teammate and I disagreed about (the real technical question). Instead of arguing in comments, I set up a quick one-to-one, asked about their concerns first, then explained mine. To get past opinions, I (brought data or built a small spike). We agreed on (the decision), and (real outcome). We kept a good working relationship, and I learned to (your lesson, for example raise design questions before code review).",
      mistakes: [
        "Making the other person the villain or calling them names.",
        "A story where you 'won' and they were simply wrong, with no listening.",
        "Choosing a trivial disagreement with no stakes.",
        "Trap: 'I've never had a conflict.' Nobody believes it. Pick a real professional disagreement.",
      ],
      takeaway: 'Disagree about the work, talk privately, listen first, decide with evidence, commit, keep the relationship.',
    },

    // ------------------------------------------------------------------ 7
    {
      id: 'failure-or-mistake',
      title: 'A failure or mistake',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'A real mistake you owned, how you contained it, what you fixed, and the habit or safeguard you added so it does not happen again.',
      what: [
        "The interviewer is testing ownership and learning. Everyone makes mistakes; what matters is that you admit it plainly, fix it fast, and change something afterwards.",
        "Choose a real mistake with moderate impact: a bug you shipped, an estimate you missed, an assumption you didn't check. Not something catastrophic or unethical, and not a fake mistake that's really a boast.",
      ],
      deeper: [
        "Structure: what happened (owned with 'I'), how you noticed, what you did first to limit the damage, the root cause, the fix, and the safeguard that now prevents it (a test, an alert, a checklist, a code review rule).",
        "The safeguard is what makes this a senior answer. 'I added a test for this case and an alert on that metric' shows you improve systems, not just patch them. The 'Fixing a production issue fast' page in My Resume and Projects has the incident version of this.",
      ],
      why: "People who hide mistakes cause bigger ones later. Companies want engineers who raise problems early and leave the system safer.",
      analogy: "A pilot's incident report. Aviation is safe because every mistake is reported without blame and leads to a checklist change, so the next pilot doesn't repeat it.",
      code: {
        lang: 'text',
        title: 'STAR outline: a mistake you made',
        source: `S: "On (product), I (the real mistake, e.g. 'shipped a change that (what broke)' /
    'underestimated (task)' / 'assumed (thing) without checking')."
T: "It was my change / my estimate, so it was on me to fix it and tell people."
A: "As soon as I noticed (how you found out), I (contained it: rollback / flag off / told my lead).
    The root cause was (real cause).
    I fixed it by (fix), and to stop it happening again I (safeguard: test / alert / checklist /
    review rule)."
R: "(Real impact and how fast it was resolved.) Since then (real result, e.g. 'that class of bug
    hasn't come back'). The lesson: (one line)."`,
      },
      output: "A short, honest story that shows you take ownership, act calmly, and turn mistakes into safeguards. Ending on the safeguard leaves the interviewer thinking about your judgment, not the mistake.",
      questions: [
        {
          q: "Tell me about a time you failed.",
          a: "A real, moderate failure told with STAR: own it with 'I', explain how you contained it, the root cause, the fix, and the safeguard you added. Finish with what you do differently now.",
        },
        {
          q: "What's the biggest mistake you've made at work?",
          a: "Same structure. Pick something real with moderate impact, not a disaster and not a disguised boast. The safeguard you added afterwards is the most important part.",
        },
        {
          q: "How do you react when you realise you've made a mistake?",
          a: "'I tell the people affected straight away, contain it first (rollback or flag off), then find the root cause and fix it, and add a test or alert so it can't quietly happen again.'",
        },
      ],
      answer30:
        "On (product) I (the real mistake). As soon as I noticed, I (contained it, for example rolled back or turned off the flag) and told my lead. The root cause was (real cause). I fixed it, and to make sure it couldn't happen again I added (the real safeguard, such as a test or an alert). It was resolved in (real time), and since then I (the habit you kept).",
      mistakes: [
        "Fake mistakes like 'I cared too much about quality'.",
        "Blaming someone else, or the tools.",
        "No safeguard or lesson at the end.",
        "Trap: a mistake so serious it raises doubts about your judgment (data deleted with no backup, ignored a security issue). Choose a moderate, real one.",
      ],
      takeaway: 'Own it, contain it, fix the root cause, add a safeguard, share the lesson.',
    },

    // ------------------------------------------------------------------ 8
    {
      id: 'tight-deadline',
      title: 'Working under a tight deadline',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Clarify what really must ship, cut scope rather than quality, communicate risk early, and deliver the core on time.',
      note:
        "The 'critical production issues fixed within 24 hours' line comes from your study brief, not your uploaded resumes. Use it only if it really happened, with the real issue and timing.",
      what: [
        "This tests prioritisation and communication under pressure. 'I worked all night' is not the answer they want; 'I worked out what mattered most, agreed on scope, and kept people informed' is.",
        "The core skills: break the work down, separate must-have from nice-to-have, protect quality on the critical path (tests, security), raise risks early, and ask for help or trade-offs before it's too late.",
      ],
      deeper: [
        "Useful tools from your own experience: feature flags let you ship the core behind a flag and finish the rest after (you used LaunchDarkly on Skillkeepr); queues let you ship a simple synchronous version first only if it's safe, then move slow work off the request path; a short written plan with daily checkpoints keeps everyone aligned.",
        "Your brief mentions fixing critical production issues within 24 hours. If that's true, it's a natural deadline story. Use the real timing and the real issue.",
      ],
      why: "Deadlines are constant in product companies. They want people who deliver the most valuable thing on time and flag problems early, not people who silently miss dates or ship broken work.",
      analogy: "Packing for a flight that leaves in an hour. You don't pack perfectly; you make sure passport, tickets, and medicine are in the bag first, then add what fits.",
      code: {
        lang: 'text',
        title: 'STAR outline: a tight deadline',
        source: `S: "On (product), we had (real time, e.g. 'one week') to deliver (feature or fix) because
    (real reason: client demo / contract / production issue)."
T: "I was responsible for (your part)."
A: "I broke it into tasks and agreed with (PM / lead) on the must-haves: (list).
    We moved (nice-to-haves) to a follow-up release.
    I kept (tests / security checks) for the critical path and (used a feature flag / shipped
    in stages) to reduce risk.
    I flagged (a real risk) on (day) instead of at the end, and we (how it was handled)."
R: "We delivered (what) on (time). (Follow-up items shipped by when.) I learned (lesson, e.g.
    'agree scope on day one, not day five')."`,
      },
      output: "A story that shows calm planning: scope agreed early, quality protected where it matters, risks raised in time, and the core delivered on schedule.",
      questions: [
        {
          q: "Tell me about a time you worked under a tight deadline.",
          a: "STAR: the real deadline and why it existed, your part, how you split must-have from nice-to-have and agreed scope with the PM or lead, what you did to keep quality on the critical path, how you raised risks early, and what shipped when.",
        },
        {
          q: "What do you do if you realise you'll miss a deadline?",
          a: "Tell the stakeholders as soon as I know, not on the last day, with options: reduce scope, move the date, or add help. Bring a recommendation, not just the problem.",
        },
        {
          q: "Do you cut corners to meet deadlines?",
          a: "I cut scope, not quality on the critical path. Tests for the core flow, security, and data correctness stay. Polish and edge features can go to a follow-up, and I note any shortcuts as tracked tech debt.",
        },
      ],
      answer30:
        "When we had (real deadline) to deliver (feature or fix) on (product), I first agreed the must-haves with (PM or lead) and moved the nice-to-haves to a follow-up. I kept tests on the critical path, (shipped behind a feature flag or in stages) to reduce risk, and flagged (a real risk) early rather than at the end. We delivered (what) on time, and the rest shipped (when). My lesson was to agree scope on day one.",
      mistakes: [
        "Heroics as the whole story: 'I worked 18 hours a day.' It suggests poor planning.",
        "Shipping without tests and calling it a success.",
        "Telling stakeholders about a slip only on the deadline day.",
        "Trap: 'What would you do differently?' Always have one honest improvement ready.",
      ],
      takeaway: 'Agree scope early, protect quality where it matters, flag risks early, deliver the core on time.',
    },

    // ------------------------------------------------------------------ 9
    {
      id: 'disagreeing-with-manager',
      title: 'Disagreeing with your manager',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Raise it privately with reasons and data, propose an alternative, then commit fully to the final decision.',
      what: [
        "This checks whether you can push back respectfully and whether you can commit once a decision is made. Both blind obedience and stubbornness are red flags.",
        "Good pattern: understand their reasoning first, raise your concern privately, back it with evidence (risk, cost, data), offer an alternative, and accept the final decision, unless it's an ethical or security issue.",
      ],
      deeper: [
        "Frame it around shared goals: 'I want this launch to go well too, and I'm worried about (risk).' Offer a low-cost way to reduce the risk, like a feature flag, a staging test, or a smaller first release.",
        "If you turned out to be wrong, say so. If you were right, don't gloat; describe what the team learned.",
        "For security, privacy, or legal concerns (for example logging candidate personal data, or skipping tenant checks), it's right to escalate further if needed. Say that in your answer if asked.",
      ],
      why: "Managers want engineers who surface risks they might not see, and then get behind the decision. That combination builds trust.",
      analogy: "A co-pilot who says 'I think we're low on fuel for that route, here's the gauge' and then flies the route the captain chooses, unless the plane is actually unsafe.",
      code: {
        lang: 'text',
        title: 'STAR outline: disagreeing with a manager or lead',
        source: `S: "On (product), my (manager / lead) wanted to (real decision)."
T: "I owned (the related part), and I was concerned about (real risk: timeline / reliability /
    data safety / user impact)."
A: "I first asked what was driving the decision: (their real reason).
    Then I raised my concern one to one and showed (evidence: numbers / an example / a quick test).
    I suggested (alternative, e.g. 'ship behind a feature flag' / 'do X first, Y next sprint').
    (They agreed / We went with their plan with (a safeguard) / We went with their plan as is),
    and I committed to making it work."
R: "(Real outcome.) I learned (lesson, e.g. 'bring a concrete alternative, not just a concern')."`,
      },
      output: "The interviewer sees someone who speaks up with evidence, respects the manager's call, and commits, which is what most managers want from a mid-level engineer.",
      questions: [
        {
          q: "Tell me about a time you disagreed with your manager.",
          a: "STAR: the decision, your concern and why, how you asked about their reasoning first, raised it privately with evidence, offered an alternative, and committed to the final call. End with the outcome and the lesson.",
        },
        {
          q: "What if your manager asks you to do something you think is wrong?",
          a: "If it's a judgment call, I raise my concern with evidence and an alternative, then commit to the decision. If it's unethical, insecure, or illegal, like exposing customer data, I don't do it and escalate through the proper channel.",
        },
        {
          q: "How do you give feedback to someone senior?",
          a: "Privately, specifically, and about the work: 'When X happened, the impact was Y. Could we try Z?' And ask for their view first; they may have context I don't.",
        },
      ],
      answer30:
        "On (product), my lead wanted to (real decision), and I was worried about (real risk). I first asked what was driving it, then raised my concern one to one with (evidence) and suggested (an alternative, such as shipping behind a feature flag). (Real outcome of the decision.) Once it was decided, I committed fully. I learned to always bring an alternative, not just a concern.",
      mistakes: [
        "Disagreeing in public or in a group channel.",
        "Saying 'I just did what I was told' with no thought.",
        "Continuing to resist after a decision was made.",
        "Trap: 'Have you ever been wrong in a disagreement like this?' A yes with a lesson is a strong answer.",
      ],
      takeaway: 'Ask first, disagree privately with evidence and an alternative, then commit.',
    },

    // ------------------------------------------------------------------ 10
    {
      id: 'leadership-mentoring',
      title: 'Leadership and mentoring without the title',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Leading a technical change, owning a design, unblocking or teaching others, and setting standards, with real examples and honest scope.',
      what: [
        "At three years, interviewers don't expect you to have managed people. They look for **technical leadership**: leading a change across the codebase, owning a design, reviewing code, helping teammates, and improving how the team works.",
        "Your resume has clear examples: you **led** the TypeScript migration on Skillkeepr, and on Octagnt you led the low-level design (schemas and API contracts) for the features you owned and designed the agent orchestrator and gateway.",
      ],
      deeper: [
        "What made the TypeScript migration leadership, not just work (use only the parts that are true): deciding the approach (incremental, `allowJs`, shared types first), getting the team to agree, writing the conventions, reviewing others' migration PRs, keeping feature work going, and tightening strict settings over time.",
        "Mentoring examples, only if real: helping a new joiner set up LocalStack and Docker Compose, pairing on tests with Jest and Supertest, explaining tenant isolation rules in code review, or writing a short guide.",
        "Be honest about scope. 'I led the migration's technical approach and reviewed most of the PRs' is stronger than an inflated 'I managed the team'.",
      ],
      why: "Companies hire mid-level engineers partly for their growth into senior roles. Evidence that you already lead changes and help others is what separates you from candidates with similar technical skills.",
      analogy: "The person in a group trip who checks the train times, books the tickets, and makes sure the slowest walker isn't left behind. Nobody elected them, but everyone follows their plan.",
      code: {
        lang: 'text',
        title: 'STAR outline: leading the TypeScript migration (fill with real details)',
        source: `S: "Skillkeepr's codebase was (describe the real state: mostly JavaScript / mixed / older TS
    patterns), which caused (real problems, e.g. 'runtime type bugs and risky refactors')."
T: "I led the migration to modern TypeScript. (Say your real team size here) engineers were also
    shipping features at the same time, so the migration couldn't stop that work."
A: "I proposed an incremental plan: allowJs so JS and TS could live together, shared types and
    models first, one module per PR with no behaviour changes, and stricter compiler settings
    step by step.
    I (wrote the conventions / ran a short session for the team / reviewed migration PRs).
    I (helped teammates with the tricky typing cases: real example)."
R: "(Real outcome: how much was migrated, what kinds of bugs it caught, how it helped refactoring.)
    I learned that a migration succeeds when it's easy for everyone to contribute, not when one
    person converts everything."`,
      },
      output: "A concrete leadership story without a manager title: you chose the approach, brought people along, unblocked them, and delivered without stopping feature work. It also sets up a technical follow-up you can handle.",
      questions: [
        {
          q: "Tell me about a time you showed leadership.",
          a: "Use the TypeScript migration if it fits: you proposed the incremental plan, got agreement, set conventions, reviewed PRs, and helped teammates, while feature work continued. Give the real scope and outcome.",
        },
        {
          q: "Have you mentored anyone?",
          a: "Give a real example: who (role, not name), what they needed, what you did (pairing, reviews, a guide), and how they progressed. If you haven't formally mentored, describe informal help in code reviews or onboarding.",
        },
        {
          q: "How do you get a team to adopt a new practice?",
          a: "Make it easy and show the benefit: a small pilot, clear conventions, examples in the codebase, tooling like lint rules or CI checks, and patience. Mandates without help don't stick.",
        },
        {
          q: "Do you want to become a manager?",
          a: "Answer honestly. Many engineers at your stage say: 'I want to grow as a technical lead first, owning bigger designs and mentoring. I'll decide on people management once I've tried more of it.'",
        },
      ],
      answer30:
        "I led Skillkeepr's migration to modern TypeScript. I proposed an incremental plan so feature work never stopped: allowJs, shared types first, one module per PR with no behaviour changes, and stricter settings over time. I (set the conventions, reviewed migration PRs, and helped teammates with tricky typing cases: say only what's true). On Octagnt I led the low-level design of schemas and API contracts for the features I owned. Leadership for me is making the right thing easy for the whole team.",
      mistakes: [
        "Inflating scope, like saying you managed a team when you led a technical change.",
        "Describing leadership as 'I did everything myself'.",
        "No example of helping another person grow.",
        "Trap: 'How many people were on that team?' Know the real number. If unsure, say 'a small team of around (your real estimate)'.",
      ],
      takeaway: 'Lead changes, own designs, help others, and describe your real scope precisely.',
    },

    // ------------------------------------------------------------------ 11
    {
      id: 'ambiguous-requirements',
      title: 'Handling ambiguous requirements',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Ask the right questions, write down assumptions, build the smallest useful version, and get feedback early.',
      what: [
        "Real requirements are often vague: 'sync candidates from the ATS', 'make bulk upload faster'. This question checks whether you freeze, guess silently, or clarify sensibly and move forward.",
        "A good approach: find out the **goal** (what problem, for whom), ask about **edge cases and constraints**, write down your **assumptions** and share them, build a **small first version**, and get feedback before building the rest.",
      ],
      deeper: [
        "Questions that usually unlock things: Who is the user? What does success look like? What happens in the edge case (duplicate, failure, huge input)? What's the deadline and what can wait? Are there limits (rate limits, data rules)?",
        "A natural example from your resume, if it matches what happened: the ATS sync on Octagnt needed decisions nobody had specified, like what counts as the same candidate, and whether to auto-merge on fuzzy matches. Your stated choice was to match on external id and normalized email, and to leave a possible duplicate rather than risk a wrong merge. That's a good 'decision under ambiguity' story.",
        "A one-page design note with assumptions and open questions is a cheap way to turn ambiguity into a decision everyone can see.",
      ],
      why: "As you get more senior, requirements get vaguer. Engineers who turn a fuzzy request into a clear plan are worth more than ones who need everything specified.",
      analogy: "A tailor with a customer who says 'something smart for a wedding'. A good tailor asks about the season, the budget, and the colour, sketches a design, and does a fitting before cutting all the cloth.",
      code: {
        lang: 'text',
        title: 'STAR outline: ambiguous requirements',
        source: `S: "On (product), I got a request to (real vague requirement, e.g. 'sync candidates from
    clients' ATS'), with no detail on (what was unclear)."
T: "I owned (the feature)."
A: "I asked (PM / client team) about the goal: (real answer).
    I listed the open questions, e.g. (real ones: 'what counts as a duplicate?',
    'what if the ATS is down?').
    I wrote a short note with my assumptions and shared it for sign-off.
    I built (the smallest useful version) first and showed it on (when).
    Based on feedback, we (changed what)."
R: "(Real outcome.) I learned to (lesson, e.g. 'write assumptions down; silence isn't agreement')."`,
      },
      output: "A story that shows you turn uncertainty into a plan: clarify the goal, surface edge cases, document assumptions, build small, and adjust with feedback.",
      questions: [
        {
          q: "How do you handle unclear requirements?",
          a: "Clarify the goal and the user, ask about edge cases and constraints, write down assumptions and share them for sign-off, build the smallest useful version, and get feedback before building more.",
        },
        {
          q: "What if nobody can answer your questions?",
          a: "Make a reasonable, reversible decision, document it clearly with the reasoning, design so it's easy to change (config instead of hard-coded rules), and flag it for review. Don't block on it.",
        },
        {
          q: "Tell me about a time requirements changed midway.",
          a: "STAR with a real example: what changed and why, how you assessed the impact, what you told stakeholders about timeline or scope, and how you adapted. Config-driven designs, like interview workflows or pipelines, are good examples if true.",
        },
      ],
      answer30:
        "When requirements are vague, I first ask what problem we're solving and for whom. Then I list the edge cases and constraints, write my assumptions in a short note, and get sign-off. I build the smallest useful version and get feedback early. For example, on the ATS sync (if that fits your experience), I had to decide what counts as the same candidate; I matched on external id and normalized email, and chose not to auto-merge fuzzy matches because a wrong merge is worse than a duplicate.",
      mistakes: [
        "Guessing silently and building the wrong thing for weeks.",
        "Refusing to start until everything is specified.",
        "Asking a long list of questions without proposing answers.",
        "Trap: 'Isn't asking lots of questions slow?' Ten minutes of questions saves days of rework. Bring proposed answers so it's quick to confirm.",
      ],
      takeaway: 'Clarify the goal, list edge cases, write assumptions, build small, get feedback.',
    },

    // ------------------------------------------------------------------ 12
    {
      id: 'biggest-achievement',
      title: 'Your biggest achievement',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'One project told with STAR: the problem, your specific design decisions, and an honest result you can defend in follow-ups.',
      note:
        "Pick your achievement from what's on the resume you sent. Stripe subscriptions, the Boolean search engine, Jitsi interviews, the Twilio voice agent, Zoho CRM, and the '~70% less effort' JD-generation figure are in your study brief but not on your uploaded resumes. Use them only if you really did them, and expect 'how did you measure 70%?' if you quote that number.",
      what: [
        "Pick **one** achievement and go deep, rather than listing several. The interviewer wants to see the size of problem you can handle, how you think, and what you count as success.",
        "Strong candidates from your resume: the **SQS bulk-upload pipeline** (clear before and after), the **orchestrator over 35+ AI agents** (design ownership), the **audit logging service** (compliance plus performance trade-off), or **leading the TypeScript migration** (leadership). Choose the one that best matches the job.",
      ],
      deeper: [
        "Prepare the follow-ups for whichever you choose: why this design over alternatives, what failed along the way, what you'd do differently, how you tested it, and how you know it worked.",
        "Only use numbers you can explain. Your resume's real figures are: 35+ agents, 50+ files per bulk upload, 4 roles across 8 permission modules, about 30% fewer regression bugs after Jest coverage, and Node 18 to 20. If you have no metric for the result, describe the before and after in words.",
      ],
      why: "This answer often sets the level the interviewer assigns you. A well-chosen achievement told with clear decisions and trade-offs reads as senior; a vague list reads as junior.",
      analogy: "An athlete's best race. They don't list every race; they describe one, the plan, the moment it got hard, what they did, and the time on the clock.",
      code: {
        lang: 'text',
        title: 'STAR outline: the SQS bulk-upload pipeline (swap in your own choice)',
        source: `S: "On Octagnt.ai, recruiters needed to upload 50+ CVs at once. Each file needs AI extraction,
    which is slow. (Describe the real problem before: e.g. 'requests were timing out and a failure
    lost the whole batch'.)"
T: "I (designed and built / owned) the bulk-upload pipeline."
A: "Files go to S3. The API creates a batch, puts one SQS message per file, and returns 202 with a
    batch id straight away.
    Workers process files in parallel. Because SQS can deliver twice, workers claim each item
    atomically, so processing is idempotent.
    Files that keep failing go to a dead-letter queue without failing the batch, and a monitor
    catches items stuck in processing.
    The UI polls a status endpoint to show progress."
R: "(Real result: e.g. 'uploads of 50+ files no longer timed out and users could see progress and
    retry single failures'. Add a number only if you measured it.)
    What I'd improve: (a real idea, e.g. server-sent events instead of polling)."`,
      },
      output: "A two-minute story with a clear problem, your concrete design decisions (queue, idempotency, DLQ, polling), and an honest result. It invites follow-up questions you've already prepared.",
      questions: [
        {
          q: "What's your biggest professional achievement?",
          a: "One project, told with STAR: the problem, your role, your key design decisions and why, and an honest result. For example, the SQS bulk-upload pipeline on Octagnt: 202 plus batch id, one message per file, idempotent workers, DLQ, and status polling.",
        },
        {
          q: "What project are you most proud of and why?",
          a: "Name it and give the 'why' in one line: the hardest problem, the biggest impact, or the most ownership. Then a short STAR. Pick the one that matches this job.",
        },
        {
          q: "How did you measure success?",
          a: "Use a real measure: fewer timeouts or errors, faster processing, fewer support tickets, fewer regression bugs. If you didn't measure it, say what you observed and how you'd measure it now. Never invent a number.",
        },
      ],
      answer30:
        "The achievement I'm proudest of is (your choice, for example the SQS bulk-upload pipeline on Octagnt). (The real problem before.) I moved the slow AI extraction off the request path: the API returns a batch id immediately, each file is its own queue message, workers claim items atomically so duplicates are harmless, failures go to a dead-letter queue without failing the batch, and the UI polls for progress. (The real result.) If I did it again, I'd (a real improvement).",
      mistakes: [
        "Listing five achievements with no depth.",
        "Choosing something you can't defend for ten minutes of follow-ups.",
        "Inventing or rounding up metrics.",
        "Trap: 'What was your exact part versus the team's?' Be precise about what you designed, built, and reviewed.",
      ],
      takeaway: 'One project, your decisions, an honest result, and follow-ups prepared.',
    },

    // ------------------------------------------------------------------ 13
    {
      id: 'salary-expectations',
      title: 'Salary expectations and negotiation',
      level: 'advanced',
      priority: 'must',
      frequency: 'very common',
      summary: 'Research the market, give a range with your target near the bottom, talk total compensation, and negotiate politely with reasons.',
      note:
        "No numbers are given here on purpose. Fill in your real current CTC and a researched range for your role, city, and experience. Check sites like Glassdoor, AmbitionBox, Levels.fyi, and recruiter conversations before your first HR call.",
      what: [
        "In India, companies usually ask for your **current CTC** (cost to company, the total yearly package) and your **expected CTC**. CTC includes fixed pay, variable or bonus, and sometimes benefits like insurance or ESOPs (stock options), so compare offers on the same basis.",
        "The safest approach: research the market range for your role first, give a **range** rather than one number, and put your real target near the bottom of that range.",
      ],
      deeper: [
        "If asked early, you can defer politely: 'I'd like to understand the role and level first; I'm sure we can find a number that works.' If they insist, give your researched range.",
        "Negotiation after an offer: thank them, ask for the breakdown in writing (fixed, variable, joining bonus, ESOPs and vesting, notice buyout), compare the fixed component, and counter once with a reason (market data, a competing offer if you really have one, the scope of the role). Ask for something specific. If base is fixed, ask about joining bonus, notice buyout, or level.",
        "Never lie about your current CTC or a competing offer. Companies often ask for payslips, and it can cost you the offer.",
      ],
      why: "Your first number anchors the whole negotiation. Too low and you leave money on the table for years; too high without reasons and you can drop out of the process. Preparation fixes both.",
      analogy: "Selling a used car. You check what similar cars sell for, set an asking range, know your walk-away price, and explain the value (service history) instead of just repeating the number.",
      code: {
        lang: 'text',
        title: 'Salary script (fill in your real numbers)',
        source: `CURRENT CTC
"My current CTC is (your real current CTC), of which (real fixed amount) is fixed."

EXPECTED CTC (range, target near the bottom)
"Based on the role and what I've seen in the market for (role) with around 3 years in (city),
 I'm looking for (your researched range). I'm flexible depending on the overall package and
 the role."

IF ASKED VERY EARLY
"I'd like to understand the role and level a bit more first. I'm confident we'll find a number
 that works if it's the right fit."

AFTER AN OFFER
"Thank you, I'm excited about this. Could you share the breakdown: fixed, variable, any joining
 bonus or ESOPs? ... Based on (real reason: market data / scope / a real competing offer), would
 it be possible to move the fixed component to (specific number)?"`,
      },
      output: "You give a confident, researched range instead of a nervous guess, keep the conversation on total compensation, and negotiate once, politely, with a reason and a specific ask.",
      questions: [
        {
          q: "What are your salary expectations?",
          a: "Give a researched range for the role, city, and experience, with your real target near the bottom: 'Based on the role and market, I'm looking for (range), flexible depending on the overall package.' Don't give a number you haven't researched.",
        },
        {
          q: "What is your current CTC?",
          a: "State it honestly with the split: total, fixed, and variable. Companies may ask for payslips, so never inflate it. Then move to expectations based on the new role, not just a percentage hike.",
        },
        {
          q: "Why do you expect such a big hike?",
          a: "Tie it to the role and the market, not to your current pay: 'The scope here is (bigger/different), and the market range for this role is (range). My experience with (relevant resume items) matches what you need.'",
        },
        {
          q: "Is this offer final, or can you negotiate?",
          a: "Thank them, ask for the full breakdown, and make one specific, reasoned counter. If base salary can't move, ask about joining bonus, notice period buyout, or a review after six months, in writing.",
        },
      ],
      answer30:
        "My current CTC is (your real figure), with (real fixed part) fixed. Based on the scope of this role and market data for engineers with around three years' experience in Node, TypeScript, and AWS, I'm looking for (your researched range). I'm flexible depending on the full package, including fixed pay, variable, and any joining bonus or ESOPs.",
      mistakes: [
        "Giving a single number with no research.",
        "Lying about current CTC or a competing offer.",
        "Accepting on the spot without seeing the breakdown in writing.",
        "Comparing offers on total CTC only, when one has a large variable or ESOP part.",
        "Trap: 'What's the lowest you'd accept?' Don't answer with a number lower than your range. Say you're looking at the overall package within the range you gave.",
      ],
      takeaway: 'Research first, give a range, compare fixed pay, negotiate once with a reason, never lie.',
    },

    // ------------------------------------------------------------------ 14
    {
      id: 'notice-period-joining',
      title: 'Notice period and joining date',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Know your exact notice period or availability date, whether buyout is possible, and give a date you can actually keep.',
      note:
        "Fill this in from your real situation. If your Octagnt role ended in September 2026 (as your study brief says), you may be able to join immediately; if you are still employed, use the notice period in your offer letter or contract.",
      what: [
        "Most Indian tech companies have a notice period of 30, 60, or 90 days. HR asks early because a long notice can decide whether they move forward. Many companies prefer candidates who can join within 30 days.",
        "Know three facts: your **notice period** in your contract, whether your company allows **early release** or **buyout** (paying to shorten it), and your **earliest realistic joining date**.",
      ],
      deeper: [
        "If you're immediately available, say so clearly; it's an advantage. Be ready for 'why are you available immediately?' with the same honest answer as 'why are you leaving'.",
        "If you have a long notice period, say what you can do about it: 'My notice is (N) days; I can request early release, and I've (real step: discussed it with my manager / checked the buyout policy).' Ask whether the new company offers a notice buyout.",
        "Don't promise an early date you can't keep. Missing the joining date after accepting damages trust before you start.",
      ],
      why: "Hiring managers plan projects around your start date. A clear, reliable answer removes a common reason for rejection or a delayed offer.",
      analogy: "A tenant moving flats. You need to know your current lease end date and whether the landlord allows early exit before you sign the new lease.",
      code: {
        lang: 'text',
        title: 'Pick the version that is true',
        source: `IMMEDIATELY AVAILABLE
"I'm available to join immediately. (If asked why: the honest one-line reason from your
 'why are you leaving' answer.)"

SERVING OR ABOUT TO SERVE NOTICE
"My notice period is (your real number) days. I (have resigned on (date) / will resign once I
 have an offer), so my last working day would be (date). I can ask for early release, and I'd
 like to know if you offer a notice buyout."

LONG NOTICE (60-90 days)
"My contractual notice is (N) days, but (real step you've taken or can take: e.g. 'my manager
 has indicated early release is possible after handover'). Realistically I could join by (date)."`,
      },
      output: "A short, factual answer with a real date, plus options if the notice is long. HR can plan around it, and you don't over-promise.",
      questions: [
        {
          q: "What is your notice period?",
          a: "State the real number from your contract and your earliest realistic joining date. If it's long, mention early release or buyout options you've checked. If you're already free, say you can join immediately.",
        },
        {
          q: "Can you join earlier?",
          a: "Only promise what you can deliver: 'I can request early release after handing over (work). I'll confirm the date within (days) of accepting.' Ask if they offer a notice buyout.",
        },
        {
          q: "Do you have other offers?",
          a: "Answer honestly. If yes, say where you are in those processes without exact figures unless asked, and say this role is (a real priority) for you. If no, 'I'm in a few processes' is fine only if it's true.",
        },
      ],
      answer30:
        "(Pick the true version.) I'm available to join immediately. Or: my notice period is (real number) days, so my last working day would be (date). I can request early release after handover, and I'd be glad to know if you offer a notice buyout. Either way, I'll give you a firm date as soon as we agree on the offer.",
      mistakes: [
        "Not knowing your own notice period or buyout policy.",
        "Promising a date you can't keep.",
        "Accepting an offer, then not joining without telling the company.",
        "Trap: 'If you're immediately available, why did you leave without an offer?' Have a calm, honest one-line answer ready.",
      ],
      takeaway: 'Know your notice, buyout options, and a real joining date; never over-promise.',
    },

    // ------------------------------------------------------------------ 15
    {
      id: 'questions-to-ask-interviewer',
      title: 'Questions to ask the interviewer',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Two or three thoughtful questions about the work, the team, and how success is measured, matched to who is interviewing you.',
      what: [
        "'Do you have any questions for us?' comes at the end of almost every round. 'No, I'm good' signals low interest. Two or three good questions show curiosity and help you judge the job.",
        "Match questions to the interviewer: an engineer can tell you about code and on-call; a manager about priorities and growth; HR about process, benefits, and policies.",
      ],
      deeper: [
        "Avoid questions answered on their website, and leave salary and leave policy for the HR round. Ask open questions that invite real answers, not yes or no.",
        "Listen to the answers; they're data. Vague answers about on-call, testing, or how decisions are made can be warning signs.",
      ],
      why: "It's your interview of them, and it's also the last impression you leave. Good questions make the conversation end on a thoughtful note.",
      analogy: "Test-driving a car. You don't just let the salesperson talk; you ask about service costs, mileage, and what breaks most often.",
      code: {
        lang: 'text',
        title: 'Question bank by interviewer',
        source: `ENGINEER / TECH ROUND
- "What does a typical week look like for someone in this role?"
- "How do changes get to production here: reviews, tests, feature flags, deploy frequency?"
- "What's the hardest technical problem the team is working on right now?"
- "How is on-call handled, and what happened in the last incident?"

ENGINEERING MANAGER
- "What would success look like for this role in the first 3 and 6 months?"
- "How does the team decide what to build and how to build it?"
- "How do engineers grow here, for example towards a senior or tech lead role?"

HR
- "What are the next steps in the process, and the timeline?"
- "How are performance reviews and salary revisions done?"
- "Is the role remote, hybrid, or on-site, and how flexible is that?"

FOR AN AI / LLM ROLE
- "How do you evaluate LLM features before shipping, and how do you track cost?"`,
      },
      output: "You end each round with two or three relevant questions, learn something real about the job, and leave the interviewer with the impression of a curious, serious candidate.",
      questions: [
        {
          q: "Do you have any questions for us?",
          a: "Always yes. Ask two or three open questions matched to the interviewer: for an engineer, how code gets to production or the hardest current problem; for a manager, what success looks like in 3 to 6 months; for HR, next steps and timeline.",
        },
        {
          q: "What should you not ask in a first technical round?",
          a: "Avoid salary, leave days, and things on their website. Save compensation and policies for HR, and don't ask 'how did I do?' in a way that puts the interviewer on the spot.",
        },
        {
          q: "What's a good question to ask a hiring manager?",
          a: "'What would success look like in this role after three and six months?' It shows you think about impact and tells you what they really need.",
        },
      ],
      answer30:
        "Yes, a few. What would success look like for this role in the first three to six months? How do changes get from a pull request to production here, in terms of reviews, tests, and deploys? And what's the most interesting technical problem the team is working on right now?",
      mistakes: [
        "'No questions, you covered everything.'",
        "Asking about salary or leave in the first technical round.",
        "Asking something answered on their homepage.",
        "Trap: asking ten questions when time is up. Ask your best two and offer to follow up by email.",
      ],
      takeaway: 'Always ask two or three open, role-matched questions, and listen to the answers.',
    },

    // ------------------------------------------------------------------ 16
    {
      id: 'career-goals-five-years',
      title: 'Where do you see yourself in 5 years?',
      level: 'basic',
      priority: 'good',
      frequency: 'common',
      summary: 'A realistic growth path that fits this company: deeper technical ownership, bigger designs, mentoring others.',
      what: [
        "This checks ambition, realism, and whether you're likely to stay. The best answers describe the **kind of engineer** you want to become, in a way this role helps with, not a job title at another company.",
        "A natural path from your background: from building and owning features to owning larger system designs (multi-tenant platforms, distributed pipelines, AI systems), and helping other engineers grow, as a senior engineer or tech lead.",
      ],
      deeper: [
        "Make it concrete with skills, not titles: designing systems end to end, making architecture decisions with trade-offs, being the person others come to for (backend reliability / AI integrations), and mentoring.",
        "Don't say 'running my own startup' or 'your job' unless you can say it in a way that helps them. Avoid 'I don't know'.",
      ],
      why: "Companies invest months in onboarding. They want people whose goals line up with what the company can offer over several years.",
      analogy: "A hiking plan. You don't need every step mapped, but you know which mountain you're heading for and why this trail goes that way.",
      code: {
        lang: 'text',
        title: 'Answer template',
        source: `"In five years I'd like to be (the kind of engineer: e.g. 'a senior engineer or tech lead who
 owns the design of large backend or AI systems end to end').

 Over the last three years I've moved from (building features on Skillkeepr) to (designing pieces
 like the multi-tenant APIs and the agent orchestrator on Octagnt). The next step is (real goal:
 bigger scale / deeper distributed systems / leading designs across teams / mentoring).

 This role helps because (one specific reason from their job description), and I'd like to grow
 here (real reason)."`,
      },
      output: "A short, believable answer that shows direction and ambition, links your past growth to your future, and explains why this company is a good place for that growth.",
      questions: [
        {
          q: "Where do you see yourself in five years?",
          a: "'A senior engineer or tech lead who owns the design of large systems end to end and helps others grow. I've moved from building features to designing core pieces like multi-tenant APIs and an agent orchestrator; this role helps me take that further because (specific reason).' Adjust to your real goal.",
        },
        {
          q: "What are your long-term career goals?",
          a: "Describe skills and impact, not just titles: deeper system design, owning reliability for important systems, mentoring, and possibly leading a team. Link one part to this role.",
        },
        {
          q: "Do you want to stay technical or move into management?",
          a: "Answer honestly. A common and credible answer: 'Technical leadership first. I enjoy design and mentoring, and I'll decide about people management once I've done more of it.'",
        },
      ],
      answer30:
        "In five years I'd like to be a senior engineer or tech lead who owns the design of large backend and AI systems end to end, and helps other engineers grow. Over the last three years I've moved from building features on Skillkeepr to designing core pieces of Octagnt, like the multi-tenant APIs and the agent orchestrator. This role fits that path because (one specific reason from their job description).",
      mistakes: [
        "'I don't know' or 'I haven't thought about it.'",
        "Naming a goal that clearly means leaving soon, like 'starting my own company next year'.",
        "Only titles, no skills or impact.",
        "Trap: 'What if we can't offer that growth?' Say what matters most to you and that you'd discuss it openly with your manager.",
      ],
      takeaway: 'Describe the engineer you want to become, link it to your past growth and to this role.',
    },

    // ------------------------------------------------------------------ 17
    {
      id: 'working-with-remote-teams',
      title: 'Working with remote and distributed teams',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Write things down, over-communicate status, use async tools well, respect time zones, and make your work visible.',
      what: [
        "Many teams are remote or hybrid, sometimes across time zones. Interviewers want to know you can work without someone watching, communicate clearly in writing, and keep work moving when people aren't online at the same time.",
        "Core habits: clear written updates, decisions documented (design notes, PR descriptions, tickets), status shared before people have to ask, and questions asked early with enough context that someone can answer asynchronously.",
      ],
      deeper: [
        "Async-friendly practices: a short daily written update (done, next, blocked), PR descriptions that explain why and how to test, recorded demos for features, and design decisions in a doc rather than only in a call.",
        "Time zones: keep a few overlap hours for live discussion, batch questions for that window, and never leave a teammate blocked overnight without a reply or a workaround.",
        "Be honest about your experience. Say whether your team was in-office, hybrid, or remote, and give one real example of a habit you use. Don't claim remote or cross-time-zone experience you don't have; talk about the habits instead.",
      ],
      why: "In remote teams, unclear communication costs days, not minutes. Engineers who write clearly and make status visible are trusted with more ownership.",
      analogy: "Running a relay across time zones: each runner leaves the baton in an obvious place with a note saying what's done and what's next, so the next runner can start without a phone call.",
      code: {
        lang: 'text',
        title: 'STAR outline plus habits checklist',
        source: `S: "On (product), (describe your real setup: e.g. 'our team was hybrid / partly remote / worked
    with (a real external team or client) in another location')."
T: "I needed to (real goal: deliver X with people who weren't online at the same time)."
A: "I (real habits, e.g. 'posted a short daily update', 'wrote design notes for API contracts
    before building', 'recorded a short demo instead of waiting for a meeting', 'kept PR
    descriptions detailed so reviews could happen async')."
R: "(Real outcome.) I learned (lesson)."

HABITS CHECKLIST
- Daily written status: done / next / blocked
- Decisions written down (doc, ticket, PR), not only said in calls
- Questions with full context, asked early
- Overlap hours used for discussion; everything else async
- Calendar and availability visible`,
      },
      output: "A short, honest answer that shows concrete remote-work habits backed by one real example, rather than general claims like 'I'm good at communication'.",
      questions: [
        {
          q: "Have you worked with remote teams?",
          a: "Describe your real setup honestly (in-office, hybrid, or remote) and one or two habits you actually use: written daily updates, documented decisions, detailed PR descriptions, early questions with context.",
        },
        {
          q: "How do you stay productive working from home?",
          a: "A fixed routine and working hours, a clear daily plan, written updates so my progress is visible, and focused blocks without notifications for deep work.",
        },
        {
          q: "How do you handle time-zone differences?",
          a: "Use the overlap hours for discussion, batch questions for that window, write everything else down so work continues async, and make sure nobody is left blocked overnight.",
        },
        {
          q: "How do you make sure you're not blocked waiting for answers?",
          a: "Ask early with full context and a proposed answer ('I plan to do X unless you say otherwise'), and work on something else in parallel while waiting.",
        },
      ],
      answer30:
        "(Say your real setup: in-office, hybrid, or remote.) The habits that matter most to me are writing things down and making status visible: a short daily update with what's done, what's next, and what's blocked; design notes for API contracts; detailed PR descriptions so reviews can happen async; and asking questions early with a proposed answer. With time zones, I use overlap hours for discussion and keep everything else async.",
      mistakes: [
        "Claiming remote experience you don't have.",
        "Saying you prefer to 'just get on a call' for everything.",
        "Going silent for days while working on something.",
        "Trap: 'How would your manager know what you did this week?' If the answer is 'they'd ask me', your work isn't visible enough.",
      ],
      takeaway: 'Write it down, make status visible, ask early with context, respect overlap hours.',
    },
  ],

  rapidFire: [
    { q: 'Shape of "Tell me about yourself"?', a: 'Present, past, future in 60-90 seconds, ending with a hook.' },
    { q: 'Which company have you worked at?', a: 'Haspaces Technology Solutions, Trivandrum, 3+ years, on Skillkeepr then Octagnt.ai.' },
    { q: 'Skillkeepr dates?', a: 'June 2023 to February 2026.' },
    { q: 'Octagnt.ai dates?', a: 'February 2026 onwards. Make your resume and your answer agree on the end date.' },
    { q: 'Rule for "why are you leaving"?', a: 'One honest, neutral reason, then what you are moving towards. Never criticise your employer.' },
    { q: 'What is STAR?', a: 'Situation, Task, Action, Result: short setup, long action, clear result and lesson.' },
    { q: 'STAR time split?', a: 'About 10% situation, 10% task, 60% action, 20% result.' },
    { q: '"We" or "I" in stories?', a: '"I" for your own actions, so your contribution is visible.' },
    { q: 'A good weakness answer has?', a: 'A real, non-critical weakness, its impact, and the habit you use now to fix it.' },
    { q: 'Conflict story focus?', a: 'A work disagreement, handled privately, listening first, decided with evidence, relationship intact.' },
    { q: 'Failure story must end with?', a: 'The safeguard you added (test, alert, checklist) and the lesson.' },
    { q: 'Tight deadline: cut what?', a: 'Scope, not quality on the critical path. Flag risks early.' },
    { q: 'Disagreeing with a manager?', a: 'Ask their reasoning, disagree privately with evidence and an alternative, then commit.' },
    { q: 'Your clearest leadership example?', a: 'Leading the TypeScript migration on Skillkeepr (describe your real scope).' },
    { q: 'Ambiguous requirements in one line?', a: 'Clarify the goal, list edge cases, write assumptions, build small, get feedback.' },
    { q: 'Numbers you can safely quote?', a: '35+ agents, 50+ files per upload, 4 roles x 8 modules, ~30% fewer regressions, Node 18 to 20.' },
    { q: 'Expected salary: number or range?', a: 'A researched range with your real target near the bottom.' },
    { q: 'What is CTC?', a: 'Cost to company: fixed + variable + benefits. Compare the fixed part across offers.' },
    { q: 'Can you lie about current CTC?', a: 'No. Payslips are often checked; it can cost you the offer.' },
    { q: 'Notice period answer needs?', a: 'Your real notice, buyout or early-release options, and a date you can keep.' },
    { q: 'Questions for the interviewer?', a: 'Always ask two or three, e.g. "What does success look like in 3-6 months?"' },
    { q: 'Five-year goal shape?', a: 'The engineer you want to become (senior or tech lead owning big designs), linked to this role.' },
  ],
};

export default hr;
