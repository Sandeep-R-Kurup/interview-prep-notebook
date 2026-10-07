// Tools and Workflow stack. Topics are auto-sorted Basic -> Intermediate -> Advanced by the registry.

const tools = {
  name: 'Tools and Workflow',
  intro: 'Git, package managers, build tools, linting, debugging and team process. These questions test whether you can work smoothly in a real team, not just write code.',
  topics: [
    {
      id: 'git-fundamentals',
      title: 'Git fundamentals',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Working directory -> staging area -> commits; branches are just movable pointers to commits.',
      what: [
        "Git is a version control system: it records snapshots of your project so you can see history, undo changes and work in parallel on branches.",
        "Changes move through three areas. The **working directory** is your files on disk. The **staging area** (index) is what will go into the next commit; you add to it with `git add`. A **commit** is a saved snapshot with a message, author and a pointer to its parent commit.",
        "A **branch** is just a named pointer to a commit. Committing moves the current branch forward. `HEAD` points to the branch (or commit) you're on. A **remote** (usually `origin`) is another copy of the repository, like the one on GitHub.",
      ],
      deeper: [
        "Every commit is identified by a hash of its contents and parent, so history can't be changed silently; rewriting a commit creates a new hash. That's why rewriting shared history causes trouble for others.",
        "`git fetch` downloads new commits from the remote without changing your branch; `git pull` is `fetch` plus a merge (or rebase, if configured) into your current branch. `git push` uploads your commits.",
        "Newer, clearer commands: `git switch` changes branches and `git restore` discards file changes, instead of the overloaded `git checkout`. Detached HEAD means you checked out a commit, not a branch; new commits there are easy to lose unless you create a branch.",
        "Good commits are small, focused and have messages that explain why. Many teams use Conventional Commits (`feat:`, `fix:`, `chore:`) so changelogs and version bumps can be automated.",
      ],
      why: "Every team uses Git daily. Understanding the model (snapshots, pointers, staging) is what lets you fix mistakes calmly instead of deleting the folder and cloning again.",
      analogy: "Commits are photos in an album, each one pointing back to the previous photo. A branch is a sticky note saying 'latest photo of this storyline'. The staging area is the pile of prints you've picked for the next page.",
      code: {
        lang: 'bash',
        title: 'Everyday flow',
        source: `git switch -c feat/bulk-upload-status   # create and switch to a branch
# ...edit files...
git status                              # what changed, what is staged
git diff                                # unstaged changes
git add src/uploads/status.ts           # stage a file (or: git add -p to pick hunks)
git diff --staged                       # what will be committed
git commit -m "feat(uploads): add batch status endpoint"
git fetch origin
git rebase origin/main                  # replay my work on the latest main
git push -u origin feat/bulk-upload-status
git log --oneline --graph -10           # compact history`,
      },
      output: "A new branch is created from the current commit, one file is staged and committed, the branch is updated with the latest `main`, and pushed to GitHub with upstream tracking set, ready for a pull request. `git log --oneline --graph` shows the last 10 commits as a compact graph.",
      questions: [
        { q: 'What is the staging area?', a: 'An intermediate area between your working files and the repository. You choose exactly which changes go into the next commit with `git add`, so one commit can contain only related changes.' },
        { q: 'What is the difference between git fetch and git pull?', a: '`git fetch` downloads new commits from the remote but doesn\'t change your branch. `git pull` fetches and then merges (or rebases) those commits into your current branch.' },
        { q: 'What is a branch in Git?', a: 'A lightweight, movable pointer to a commit. Creating a branch is instant because it just writes a reference; committing moves the current branch pointer forward.' },
        { q: 'What is HEAD and what is a detached HEAD?', a: '`HEAD` points to what you currently have checked out, normally a branch. A detached HEAD means it points directly at a commit; new commits there aren\'t on any branch and can be lost unless you create one.' },
      ],
      answer30: "Git stores snapshots called commits, each pointing to its parent. Changes go from the working directory to the staging area with git add, then into a commit. A branch is just a pointer to a commit, which is why branching is cheap, and HEAD tells Git what I'm on. Fetch downloads remote changes, pull fetches and integrates them, and push uploads mine. I keep commits small and focused with messages that explain why.",
      mistakes: [
        "`git add .` without checking, committing `.env` files or debug code.",
        "Huge commits mixing refactors, features and formatting, which are hard to review and revert.",
        "Messages like 'fix' or 'changes' that explain nothing.",
        "Trap: 'If you commit on a detached HEAD, is the work lost?' Not immediately. It's reachable through `git reflog` until garbage collection; create a branch on it with `git switch -c`.",
      ],
      takeaway: 'Working dir -> staging -> commit; branches are pointers; fetch is safe, pull integrates.',
    },

    {
      id: 'merge-vs-rebase',
      title: 'Merge vs rebase',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Merge joins histories with a merge commit; rebase replays your commits on top for a linear history. Never rebase shared commits.',
      what: [
        "Both combine work from two branches. **Merge** keeps both histories as they happened and adds a **merge commit** that ties them together. **Rebase** takes your branch's commits and replays them, one by one, on top of the other branch, as if you had started from there.",
        "Merge preserves the true history but can make it noisy. Rebase gives a clean, straight line but **rewrites** your commits (new hashes).",
      ],
      deeper: [
        "**Golden rule**: don't rebase commits that others have already pulled. Their copies still have the old commits, and pushing rewritten history (`git push --force`) can wipe out their work. Rebasing your own unpushed or private feature branch is fine; push with `--force-with-lease`, which refuses if the remote has commits you haven't seen.",
        "**Fast-forward merge**: if `main` hasn't moved since you branched, Git just moves the pointer forward and no merge commit is needed. `--no-ff` forces a merge commit to keep the feature grouped.",
        "**Interactive rebase** (`git rebase -i HEAD~5`) lets you squash, reword, reorder or drop commits to tidy a branch before review. **Squash merge** on GitHub combines a whole PR into one commit on `main`.",
        "During a rebase, conflicts may appear commit by commit; fix, `git add`, then `git rebase --continue`, or `git rebase --abort` to go back. Note that during a rebase 'ours' and 'theirs' are swapped compared to a merge: 'ours' is the branch you're rebasing onto.",
      ],
      why: "Teams have strong preferences about history, and the wrong command on a shared branch can destroy colleagues' work. Interviewers want to see that you know the trade-off and the golden rule.",
      analogy: "Merging is stapling two diaries together with a note saying 'joined here'. Rebasing is rewriting your diary entries as if you'd started writing after the other person finished: tidier, but it's a rewrite.",
      code: {
        lang: 'bash',
        title: 'Both ways of updating a feature branch',
        source: `# Option A: merge main into my branch (keeps history, adds a merge commit)
git switch feat/search
git merge origin/main

# Option B: rebase my branch onto main (linear history, rewrites my commits)
git switch feat/search
git fetch origin
git rebase origin/main
# conflict? fix files, then:
git add src/search.ts
git rebase --continue          # or: git rebase --abort
git push --force-with-lease    # safe force-push of my own branch

# Tidy my last 4 commits before review
git rebase -i HEAD~4           # mark commits as squash / fixup / reword`,
      },
      output: "Option A leaves the feature commits unchanged and adds one merge commit. Option B gives the feature commits new hashes, sitting on top of the latest `main` in a straight line, so the branch must be force-pushed; `--force-with-lease` fails safely if someone else pushed to it meanwhile.",
      questions: [
        { q: 'What is the difference between merge and rebase?', a: 'Merge combines branches with a merge commit and keeps the real history. Rebase replays your commits on top of another branch, creating new commits and a linear history.' },
        { q: 'When should you not rebase?', a: 'When the commits have already been pushed and others may have based work on them, such as `main` or a shared branch. Rewriting them forces everyone to recover from diverged history.' },
        { q: 'What is `--force-with-lease`?', a: 'A safer force-push that only overwrites the remote branch if it is still where you last saw it. If someone pushed new commits meanwhile, it refuses instead of deleting their work.' },
        { q: 'What is a fast-forward merge?', a: 'When the target branch has no new commits since you branched, Git just moves its pointer to your latest commit. No merge commit is created.' },
        { q: 'What does squash merging do?', a: 'It combines all commits from a branch or PR into one new commit on the target branch. History on `main` stays tidy, one commit per feature, but individual commit detail is lost there.' },
      ],
      answer30: "Merge joins two branches with a merge commit and keeps history exactly as it happened. Rebase replays my commits on top of another branch, giving a clean linear history but rewriting the commits. My rule is to rebase only my own branch before it's shared or reviewed, using force-with-lease to push, and never rebase main or shared branches. Many teams squash-merge PRs so main has one commit per change.",
      mistakes: [
        "Rebasing `main` or a branch others are working on.",
        "`git push --force` instead of `--force-with-lease`.",
        "Panicking mid-rebase. `git rebase --abort` returns everything to how it was.",
        "Trap: 'Does rebase lose commits?' Not really; the old commits are still in `git reflog` for a while, so a bad rebase can be undone with `git reset --hard <old-hash>`.",
      ],
      takeaway: 'Merge preserves, rebase rewrites; rebase only private work and force-push with lease.',
    },

    {
      id: 'branching-strategies',
      title: 'Branching strategies: GitFlow vs trunk-based',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'GitFlow uses long-lived develop and release branches; trunk-based uses short-lived branches merged to main daily, with feature flags.',
      what: [
        "**GitFlow** has two long-lived branches: `main` (production) and `develop` (integration). Features branch off `develop`; `release/*` branches prepare a release; `hotfix/*` branches fix production and merge into both.",
        "**GitHub Flow** is simpler: branch off `main`, open a PR, review, merge, deploy. **Trunk-based development** pushes this further: everyone merges small changes into `main` (the trunk) at least daily, and unfinished features hide behind feature flags.",
      ],
      deeper: [
        "GitFlow suits software with scheduled, versioned releases (mobile apps, libraries, on-premise products) where several versions are supported at once. Its cost is long-lived branches, painful merges and slower feedback.",
        "Trunk-based development suits web apps and SaaS with continuous delivery. It needs strong CI (every merge must keep `main` releasable), good tests, code review on small PRs, and feature flags. Research from the DORA reports links it to higher delivery performance.",
        "Release branches can still exist in trunk-based workflows (cut from `main` and only receive cherry-picked fixes), but they are short-lived and never receive new features.",
      ],
      why: "The strategy shapes how often you hit merge conflicts, how fast changes reach users, and how releases work. Interviewers ask to learn how you've worked and whether you understand the trade-offs.",
      analogy: "GitFlow is a publishing house with drafts, editing rounds and print runs. Trunk-based is a live news site: small updates go out all day, and stories not ready yet stay hidden until they are.",
      code: {
        lang: 'text',
        title: 'The two shapes',
        source: `GitFlow
main      ●───────────────●──────────●      tagged releases: v1.0, v1.0.1
develop   ●──●──●──●──●──●──●──●──●──●      integration branch
feature/*   branch from develop  -> merge back into develop (days to weeks)
release/*   branch from develop  -> merge into main AND develop
hotfix/*    branch from main     -> merge into main AND develop

Trunk-based
main      ●──●──●──●──●──●──●──●──●──●      always releasable, deploys often
feature branches live hours to a day; unfinished work hides behind flags`,
      },
      output: "GitFlow has parallel long-lived branches and merges back and forth. Trunk-based has one main line with tiny branches that merge back quickly, so conflicts stay small and every merge can be deployed.",
      questions: [
        { q: 'What is GitFlow?', a: 'A branching model with long-lived `main` and `develop` branches, plus `feature/*`, `release/*` and `hotfix/*` branches. It suits products with planned, versioned releases.' },
        { q: 'What is trunk-based development?', a: 'Developers integrate small changes into the main branch at least daily, using short-lived branches and feature flags for unfinished work. Main is always releasable, which supports continuous delivery.' },
        { q: 'Which would you choose for a SaaS web app and why?', a: 'Trunk-based or GitHub Flow, because a SaaS deploys continuously and only one version runs in production. Small, frequent merges reduce conflicts and get feedback quickly, with feature flags for incomplete features.' },
        { q: 'How do you ship half-finished features in trunk-based development?', a: 'Merge them behind a feature flag that is off in production, so the code is integrated and tested continuously but invisible to users until it is ready.' },
      ],
      answer30: "GitFlow uses long-lived main and develop branches plus feature, release and hotfix branches. It fits products with scheduled versioned releases, but long branches mean painful merges. Trunk-based development has everyone merging small changes into main at least daily, with feature flags hiding unfinished work and CI keeping main releasable. For a SaaS that deploys continuously, I prefer trunk-based or GitHub Flow.",
      mistakes: [
        "Feature branches that live for weeks and end in a huge, risky merge.",
        "Using GitFlow for a web app with one production version, adding ceremony without benefit.",
        "Doing trunk-based development without good CI and tests, so main breaks often.",
        "Trap: 'Doesn't trunk-based mean no code review?' No. Short-lived branches with small PRs are still reviewed; they're just merged quickly.",
      ],
      takeaway: 'GitFlow for versioned releases; trunk-based with flags and strong CI for continuously deployed apps.',
    },

    {
      id: 'git-recovery-tools',
      title: 'Conflicts, cherry-pick, reset vs revert, stash, bisect',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'The commands for fixing real situations: resolve conflicts, copy a commit, undo safely, park work, and find the commit that broke something.',
      what: [
        "**Merge conflict**: Git can't combine two changes to the same lines, so it marks them in the file (`<<<<<<<`, `=======`, `>>>>>>>`). You edit the file to the correct final version, `git add` it, and continue.",
        "**cherry-pick** copies one commit from another branch onto your current branch (for example, a hotfix). **stash** shelves uncommitted changes so you can switch branches, then brings them back. **bisect** binary-searches history to find the commit that introduced a bug.",
        "**reset** moves your branch pointer back, removing commits from the branch (rewrites history). **revert** creates a new commit that undoes an old one (history stays intact). On shared branches, use revert.",
      ],
      deeper: [
        "`git reset` modes: `--soft` moves the branch but keeps changes staged; `--mixed` (default) keeps changes but unstages them; `--hard` throws the changes away. `--hard` is the dangerous one.",
        "`git reflog` records every place `HEAD` has been, including commits 'lost' by reset or rebase. It's the safety net: find the old hash and `git reset --hard <hash>` or create a branch there.",
        "Reverting a merge commit needs `-m 1` to say which parent is the mainline. Re-merging that branch later won't bring the changes back unless you revert the revert.",
        "`git bisect run npm test` can automate the search: Git checks out midpoints and uses the command's exit code to mark good or bad. With 1,000 commits it needs about 10 steps.",
        "For conflicts, understand both sides before choosing; a tool like VS Code's merge editor helps. After resolving, run the tests: a conflict-free merge can still be logically broken.",
      ],
      why: "Interviewers ask these to see if you can recover from mistakes without destroying anyone's work. Knowing reset vs revert and reflog is the difference between a calm fix and a lost afternoon.",
      analogy: "Reset is tearing pages out of a shared notebook; revert is writing a new page saying 'ignore page 12'. Stash is putting your half-done work in a drawer. Bisect is finding which step of a recipe went wrong by checking the middle step first, then halving again.",
      code: {
        lang: 'bash',
        title: 'Recipes for common situations',
        source: `# Resolve a conflict
git merge origin/main            # CONFLICT in src/auth.ts
# edit src/auth.ts, remove the <<<<<<< ======= >>>>>>> markers
git add src/auth.ts
git commit                       # (or git rebase --continue during a rebase)

# Undo a bad commit already on main: make a new commit that reverses it
git revert a1b2c3d

# Undo my last local commit but keep the changes to redo it
git reset --soft HEAD~1

# Bring one fix from another branch
git cherry-pick 9f8e7d6

# Park work, switch, come back
git stash push -m "wip: upload status"
git switch hotfix/login && git switch -
git stash pop

# Find the commit that broke the tests
git bisect start
git bisect bad                   # current commit is broken
git bisect good v1.4.0           # this tag was fine
git bisect run npm test          # Git tests midpoints automatically
git bisect reset

# Recover "lost" commits after a bad reset or rebase
git reflog                       # find the hash from before
git reset --hard HEAD@{2}`,
      },
      output: "Each block solves one situation: a conflict is resolved by editing and staging the file; `revert` adds an undo commit safe for shared branches; `reset --soft` removes the last commit but keeps its changes staged; `cherry-pick` copies one commit; `stash` parks and restores uncommitted work; `bisect run` reports the first bad commit; `reflog` finds where the branch pointed before a mistake.",
      questions: [
        { q: 'What is the difference between git reset and git revert?', a: 'Reset moves the branch pointer back and removes commits from the branch, rewriting history. Revert adds a new commit that undoes an earlier one, keeping history intact, so it is safe on shared branches.' },
        { q: 'Explain the reset modes soft, mixed and hard.', a: '`--soft` moves the branch and keeps changes staged. `--mixed`, the default, keeps changes in the working directory but unstaged. `--hard` moves the branch and discards the changes entirely.' },
        { q: 'When would you use cherry-pick?', a: 'To copy a specific commit onto another branch, for example applying a hotfix from main to a release branch, without merging everything else from that branch.' },
        { q: 'How does git bisect work?', a: 'You mark a known good and a known bad commit, and Git binary-searches the commits between, checking out midpoints for you to test. `git bisect run <cmd>` automates it using the command\'s exit code.' },
        { q: 'You ran git reset --hard and lost commits. Can you recover them?', a: 'Usually yes. `git reflog` lists where HEAD has been, so you find the hash before the reset and run `git reset --hard <hash>` or create a branch at it. Uncommitted changes discarded by `--hard` are not recoverable this way.' },
      ],
      answer30: "To resolve a conflict I read both sides, edit the file to the correct result, stage it, continue, and rerun the tests. To undo something on a shared branch I use git revert, which adds a new undo commit; reset rewrites history, so I only use it on local commits, usually with --soft to redo a commit. Cherry-pick copies a single commit, stash parks unfinished work, and bisect binary-searches history for the commit that broke something. If anything goes wrong, reflog lets me get back.",
      mistakes: [
        "Using `git reset --hard` on a shared branch and force-pushing.",
        "Committing a file that still has conflict markers in it.",
        "Forgetting a stash for weeks; stashes are easy to lose track of. Use `git stash list`.",
        "Cherry-picking lots of commits between long-lived branches, creating duplicate commits and confusing history.",
        "Trap: 'Does reflog exist on the remote?' No. It's local to your clone, so it can't recover commits that only existed on someone else's machine.",
      ],
      takeaway: 'Revert on shared branches, reset only locally, reflog is your safety net, bisect finds the culprit.',
    },

    {
      id: 'pull-requests-code-review',
      title: 'Pull requests and code review etiquette',
      level: 'basic',
      priority: 'must',
      frequency: 'common',
      summary: 'Small, well-described PRs get fast, good reviews; reviewers focus on correctness and clarity and phrase comments kindly.',
      what: [
        "A **pull request** (PR) asks to merge your branch into another, usually `main`. It shows the diff, runs CI, and lets teammates review and comment before merging.",
        "A good PR is **small** (ideally a few hundred lines or less), does **one thing**, and has a description that explains what changed, why, how to test it, and screenshots for UI changes.",
        "A good review checks correctness, edge cases, security, tests, and readability. Comments are about the code, not the person, and say clearly whether something is a blocker or just a suggestion.",
      ],
      deeper: [
        "Prefix comments to set expectations: `nit:` (minor, optional), `question:`, `suggestion:`, `blocking:`. Ask questions instead of giving orders ('What happens if this list is empty?').",
        "Let tools handle style. Formatting and lint rules belong in Prettier, ESLint and CI, not in review comments.",
        "As the author: review your own diff first, keep refactors in separate PRs, respond to every comment (fix it or explain), and don't take feedback personally. As a reviewer: review within a working day, approve when it's good enough rather than perfect, and pair or call if a thread goes back and forth.",
        "Stacked PRs (a chain of small dependent PRs) help keep large features reviewable. Draft PRs signal work in progress and get early feedback on direction.",
      ],
      why: "Review catches bugs, spreads knowledge and keeps code consistent. Behavioural interviews often ask how you give and receive feedback, and the answer shows how you collaborate.",
      analogy: "A PR is handing in a draft to an editor. A short chapter with a clear note ('I changed the ending because...') gets a quick, useful edit. A 500-page manuscript with no note gets a skim and a rubber stamp.",
      code: {
        lang: 'text',
        title: 'PR description template',
        source: `## What
Adds GET /batches/:id/status returning per-file progress for bulk uploads.

## Why
Users couldn't tell whether a 50-file upload was still running or had failed.

## How
- New aggregation on upload_items grouped by status
- Index on { batchId: 1, status: 1 }
- Frontend polls every 3s until all items are done or failed

## Testing
- Unit tests for the status mapper
- Supertest test for 200 / 404 / other-tenant access
- Manually: uploaded 60 files on LocalStack, killed a worker, saw retry + DLQ

## Screenshots
(progress bar before / after)

## Notes for reviewers
The polling interval is a constant for now; happy to make it configurable.`,
      },
      output: "A reviewer can understand the change, its reason and how it was tested in under a minute, and knows where to focus. That usually leads to a faster and more useful review.",
      questions: [
        { q: 'What makes a good pull request?', a: 'It is small and focused on one change, has a clear description of what, why and how it was tested, includes tests, passes CI, and has been self-reviewed by the author before asking others.' },
        { q: 'What do you look for when reviewing code?', a: 'Correctness and edge cases first, then security (auth, input validation, data leaks), tests, error handling, performance where it matters, and readability. Formatting should be left to automated tools.' },
        { q: 'How do you handle disagreement in a code review?', a: 'Discuss the trade-off with reasons, not opinions. If a thread goes back and forth, talk it through on a call. If it is a preference rather than a problem, the author decides; if it is a team standard, document it.' },
        { q: 'How do you give critical feedback without upsetting people?', a: 'Comment on the code, not the person, explain why, ask questions rather than command, mark minor points as nits, and also note what is done well.' },
      ],
      answer30: "I keep PRs small and focused, with a description of what changed, why, and how I tested it, and I review my own diff first. When reviewing, I check correctness, edge cases, security and tests before style, and leave formatting to Prettier and ESLint. I label comments as nits, questions or blockers, ask rather than order, and move long threads to a quick call. I try to review within a day so nobody is blocked.",
      mistakes: [
        "Opening a 2,000-line PR mixing a feature, a refactor and formatting changes.",
        "Review comments about style that a linter should enforce.",
        "Approving without reading ('LGTM') because the author is senior.",
        "Trap: 'What if a reviewer is wrong?' Explain your reasoning politely with evidence (a test, docs). Being open to being wrong yourself matters just as much.",
      ],
      takeaway: 'Small PRs with clear context; reviews about correctness and clarity, written kindly.',
    },

    {
      id: 'package-managers-monorepos',
      title: 'npm, yarn, pnpm, lockfiles and monorepos',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Lockfiles pin exact versions for reproducible installs; pnpm saves disk with a shared store; workspaces plus Turborepo or Nx manage monorepos.',
      what: [
        "A package manager installs the libraries listed in `package.json`. `dependencies` are needed at runtime; `devDependencies` only for building and testing.",
        "Versions use **semver**: `MAJOR.MINOR.PATCH`. `^1.4.2` allows any `1.x.x` at or above 1.4.2; `~1.4.2` allows only `1.4.x`. Because ranges float, the **lockfile** (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`) records the exact versions installed, so everyone and CI get the same tree. Always commit it.",
        "**npm** comes with Node. **Yarn** and **pnpm** are alternatives. **pnpm** stores each package version once on disk and links it into projects, so installs are fast and use less space, and its stricter `node_modules` stops you importing packages you didn't declare.",
      ],
      deeper: [
        "In CI use `npm ci` (or `pnpm install --frozen-lockfile`, `yarn install --immutable`): it installs exactly what the lockfile says and fails if it's out of sync with `package.json`.",
        "A **monorepo** keeps several packages or apps in one repository (for example `apps/web`, `apps/api`, `packages/shared-types`). **Workspaces** (supported by npm, yarn and pnpm) link local packages together and hoist shared dependencies.",
        "**Turborepo** and **Nx** add task orchestration on top: they understand the dependency graph, run tasks in the right order and in parallel, and **cache** results so unchanged packages aren't rebuilt or retested (locally and remotely in CI).",
        "Corepack (bundled with older Node versions) let projects pin the package manager via the `packageManager` field, but it is no longer bundled starting with Node 25, so install pnpm/yarn explicitly or via your version manager. Security: review new dependencies, run `npm audit`, use Dependabot or Renovate, and be wary of install scripts and typosquatted package names.",
      ],
      why: "Reproducible installs prevent 'works on my machine' bugs and surprise breakages from upstream releases. Monorepo tooling matters once frontend, backend and shared code need to change together.",
      analogy: "`package.json` is a shopping list ('milk, any brand of 1 litre'); the lockfile is the receipt showing exactly which brand and batch you bought, so everyone can buy the identical items.",
      code: [
        {
          lang: 'json',
          title: 'Root package.json for a workspaces monorepo',
          source: `{
  "name": "octo-monorepo",
  "private": true,
  "packageManager": "pnpm@10.0.0",
  "scripts": {
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  }
}`,
        },
        {
          lang: 'yaml',
          title: 'pnpm-workspace.yaml',
          source: `packages:
  - 'apps/*'
  - 'packages/*'`,
        },
        {
          lang: 'json',
          title: 'turbo.json',
          source: `{
  "$schema": "https://turborepo.com/schema.json",
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "test":  { "dependsOn": ["build"] },
    "lint":  {}
  }
}`,
        },
      ],
      output: "`pnpm install` links every package under `apps/` and `packages/` together. `pnpm build` runs Turborepo, which builds each package's dependencies first (`^build`), runs independent builds in parallel, and replays cached `dist/` output for packages whose inputs haven't changed.",
      questions: [
        { q: 'Why commit the lockfile?', a: 'It records the exact version of every installed package, including nested ones, so every developer, CI run and deployment gets the same dependency tree. Without it, semver ranges can pull in new versions and break builds.' },
        { q: 'npm install vs npm ci?', a: '`npm install` resolves ranges and may update the lockfile. `npm ci` deletes `node_modules` and installs exactly what the lockfile says, failing if it doesn\'t match package.json, which makes it right for CI.' },
        { q: 'What do ^ and ~ mean in package.json?', a: '`^1.4.2` allows minor and patch updates within major version 1. `~1.4.2` allows only patch updates within 1.4. A plain `1.4.2` pins the exact version.' },
        { q: 'Why might a team choose pnpm?', a: 'It is fast and disk-efficient because packages live once in a shared store and are linked, and its strict node_modules layout prevents code from importing dependencies it didn\'t declare. It also has strong workspace support.' },
        { q: 'What do Turborepo or Nx add to workspaces?', a: 'Task orchestration that understands the package dependency graph, runs tasks in the right order and in parallel, and caches outputs locally or remotely so unchanged packages aren\'t rebuilt or retested.' },
      ],
      answer30: "package.json lists dependencies with semver ranges, and the lockfile pins the exact versions actually installed, so I always commit it and use npm ci in CI for reproducible installs. pnpm is a popular alternative because it's fast, saves disk with a shared store and is strict about undeclared dependencies. For monorepos, workspaces link local packages like shared types between the API and frontend, and Turborepo or Nx run tasks in dependency order and cache results so CI only rebuilds what changed.",
      mistakes: [
        "Adding the lockfile to `.gitignore`, or deleting it to 'fix' an install problem.",
        "Mixing package managers in one repo, ending up with two lockfiles.",
        "Putting build tools in `dependencies`, bloating production images.",
        "Trap: 'If package.json says ^4.18.0, which version do you get?' Whatever the lockfile says. Without a lockfile, the newest 4.x available at install time.",
      ],
      takeaway: 'Commit the lockfile, use npm ci in CI; workspaces link packages, Turborepo/Nx order and cache tasks.',
    },

    {
      id: 'bundlers-vite-webpack',
      title: 'Bundlers: Vite vs webpack, minification, tree-shaking',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Bundlers turn many source modules into a few optimised files; Vite serves native ES modules in dev and bundles for production.',
      note: "Tooling moves quickly. As of 2026, Vite is moving its internals to Rolldown, a Rust bundler, replacing the esbuild + Rollup combination; webpack 5 remains common in older apps and Next.js has moved to Turbopack by default. Check versions in the job's stack before going deep.",
      what: [
        "A **bundler** takes your source files and their imports and produces optimised files the browser can load efficiently. Along the way it transpiles (TypeScript and JSX to plain JS), bundles modules together, and processes CSS and assets.",
        "**Minification** removes whitespace and comments and shortens variable names, so files are smaller. **Tree-shaking** removes exported code that is never imported. **Code splitting** breaks the bundle into chunks that load only when needed (for example, per route with dynamic `import()`).",
        "**webpack** bundles everything up front, even in development, and is extremely configurable. **Vite** serves your source as native ES modules during development, so the dev server starts almost instantly and hot updates are fast; for production it does a full optimised build.",
      ],
      deeper: [
        "Tree-shaking works with ES modules (`import`/`export`) because they are static and analysable; CommonJS `require` is much harder to shake. Libraries mark themselves safe with `\"sideEffects\": false` in package.json. Importing `lodash-es` functions individually shakes; importing all of CommonJS `lodash` doesn't.",
        "**Hot Module Replacement (HMR)** swaps changed modules in the running page without a full reload, keeping React state.",
        "Production output uses **content-hashed filenames** (`index-3f9a1c.js`) so they can be cached forever; any change produces a new name. Source maps map minified code back to the original for debugging; upload them to your error tracker rather than publishing them if the code is sensitive.",
        "Environment variables are inlined at build time. In Vite only variables prefixed with `VITE_` are exposed to client code via `import.meta.env`; anything in the bundle is public, so never put secrets there.",
      ],
      why: "Bundle size and splitting directly affect page load time. Interviewers ask about these to check that you understand what happens between your source code and the browser, and can fix a slow, bloated frontend.",
      analogy: "A bundler is a moving company: it packs hundreds of small items (modules) into a few well-labelled boxes, leaves behind what you never use (tree-shaking), squeezes out the air (minification), and sends rarely needed boxes later (code splitting).",
      code: {
        lang: 'js',
        title: 'vite.config.js with code splitting hints',
        source: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        // keep big, rarely changing libraries in their own cacheable chunk
        manualChunks: { vendor: ['react', 'react-dom'] },
      },
    },
  },
});

// In app code: load a heavy page only when the route is visited
// const Reports = lazy(() => import('./pages/Reports.jsx'));`,
      },
      output: "`vite build` outputs minified, tree-shaken, content-hashed files in `dist/`, with React in a separate `vendor` chunk that stays cached across app releases, and the Reports page in its own chunk loaded on demand. Source maps are generated for debugging. (In Vite versions built on Rolldown, the chunking options may differ; check the docs for your version.)",
      questions: [
        { q: 'What does a bundler do?', a: 'It follows imports from an entry file, transpiles TypeScript and JSX, combines modules into a few optimised files, processes CSS and assets, and applies minification, tree-shaking and code splitting for production.' },
        { q: 'What is tree-shaking and what does it need?', a: 'Removing exported code that nothing imports. It relies on static ES module `import`/`export` syntax and on packages being free of side effects, often declared with `sideEffects: false`.' },
        { q: 'Why is Vite\'s dev server faster than webpack\'s?', a: 'Vite doesn\'t bundle in development. It serves source files as native ES modules, transforming each on request, and pre-bundles dependencies once, so startup and hot updates stay fast as the app grows.' },
        { q: 'What is code splitting?', a: 'Breaking the bundle into separate chunks, often per route using dynamic `import()` with `React.lazy`, so users download only the code needed for the current page.' },
        { q: 'Are VITE_ environment variables secret?', a: 'No. They are inlined into the JavaScript bundle at build time, so anyone can read them in the browser. Only public values like API base URLs belong there.' },
      ],
      answer30: "A bundler turns many modules into a few optimised files: it transpiles TypeScript and JSX, minifies, tree-shakes unused exports, and splits code into chunks with content-hashed names for caching. webpack bundles everything even in development and is very configurable. Vite serves native ES modules in development, so it starts instantly with fast HMR, and does a full optimised build for production. To keep bundles small I use route-level lazy loading, import only what I need, and check the output with a bundle analyser.",
      mistakes: [
        "Importing a whole library (`import _ from 'lodash'`) for one function.",
        "Putting API secrets in `VITE_` or `REACT_APP_` variables, which end up in the public bundle.",
        "One giant bundle with no route-level splitting.",
        "Trap: 'Does tree-shaking remove unused code inside a function?' Not really. It removes unused exports and modules; dead code inside used functions is mostly removed by the minifier, not tree-shaking.",
      ],
      takeaway: 'Bundlers transpile, combine, minify, tree-shake and split; Vite is fast in dev via native ESM, and anything in the bundle is public.',
    },

    {
      id: 'eslint-prettier-husky',
      title: 'ESLint, Prettier, Husky and lint-staged',
      level: 'basic',
      priority: 'good',
      frequency: 'common',
      summary: 'ESLint catches bugs and bad patterns, Prettier formats code, and Git hooks run them automatically before each commit.',
      note: "ESLint 9 made the flat config file (`eslint.config.js`) the default, and the old `.eslintrc` format is deprecated and being removed. Husky v9 is set up with `npx husky init` and hooks are plain shell files in `.husky/`. Check versions in the project you join.",
      what: [
        "**ESLint** is a linter: it analyses code for likely bugs and bad patterns, like unused variables, missing `await`, or breaking the rules of React hooks. **Prettier** is a formatter: it rewrites code into one consistent style (quotes, line width, commas), so nobody argues about formatting.",
        "**Husky** installs Git hooks, scripts that run at moments like before a commit. **lint-staged** runs commands only on the files staged for that commit, so the hook is fast.",
      ],
      deeper: [
        "Let each tool do its job: Prettier for formatting, ESLint for code quality. Use `eslint-config-prettier` to turn off ESLint rules that conflict with Prettier. For TypeScript, `typescript-eslint` adds type-aware rules such as `no-floating-promises`, which catch real async bugs.",
        "Hooks are a convenience, not a guarantee: developers can skip them with `--no-verify`. CI must run the same lint, format check and type-check so nothing unchecked reaches `main`.",
        "Commit message linting (commitlint) in a `commit-msg` hook enforces formats like Conventional Commits. Editor integration (format on save) gives instant feedback before the hook runs.",
        "Newer, faster alternatives exist, like Biome (formatter + linter in one Rust tool) and oxlint. They're worth knowing by name.",
      ],
      why: "Automated checks catch a class of bugs early and remove style debates from code review, so reviewers focus on logic. Consistent formatting also keeps diffs small and readable.",
      analogy: "Prettier is a spell-checker that also fixes your handwriting. ESLint is a proofreader who flags sentences that are grammatically fine but probably wrong. Husky is the rule that the proofreader checks every letter before it's posted.",
      code: [
        {
          lang: 'js',
          title: 'eslint.config.js (flat config, TypeScript + React hooks)',
          source: `import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  prettier, // last: turns off rules that clash with Prettier
);`,
        },
        {
          lang: 'json',
          title: 'package.json: lint-staged config',
          source: `{
  "scripts": {
    "prepare": "husky",
    "lint": "eslint .",
    "format:check": "prettier --check ."
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css,yml}": ["prettier --write"]
  }
}`,
        },
        {
          lang: 'bash',
          title: '.husky/pre-commit',
          source: `npx lint-staged`,
        },
      ],
      output: "On `git commit`, Husky runs `lint-staged`, which runs ESLint with auto-fix and Prettier only on the staged files. If ESLint finds an error it can't fix, the commit is blocked with the error shown. CI separately runs `npm run lint` and `npm run format:check` on the whole project.",
      questions: [
        { q: 'What is the difference between ESLint and Prettier?', a: 'ESLint is a linter that finds likely bugs and bad patterns in code. Prettier is a formatter that only changes code style. Use both, with eslint-config-prettier to switch off ESLint\'s formatting rules.' },
        { q: 'What do Husky and lint-staged do?', a: 'Husky installs Git hooks such as pre-commit. lint-staged runs commands like ESLint and Prettier only on the files staged for the commit, keeping the hook fast.' },
        { q: 'If you have a pre-commit hook, do you still need lint in CI?', a: 'Yes. Hooks run on developers\' machines and can be skipped with `--no-verify` or not installed. CI is the enforced check before merging.' },
        { q: 'Give an example of a lint rule that catches a real bug.', a: '`@typescript-eslint/no-floating-promises` flags async calls that aren\'t awaited or handled, which otherwise cause silent failures. `react-hooks/exhaustive-deps` flags missing effect dependencies that cause stale data.' },
      ],
      answer30: "ESLint finds likely bugs and bad patterns; Prettier formats code consistently, and I use eslint-config-prettier so they don't fight. Husky adds a pre-commit hook that runs lint-staged, which lints and formats only the staged files, so feedback is fast. Since hooks can be skipped, CI runs the same lint, format check and type-check on every PR. That keeps style out of code review so reviewers focus on logic.",
      mistakes: [
        "Running ESLint formatting rules and Prettier together, so they fight over the same lines.",
        "Hooks that run the full test suite on every commit, so people start using `--no-verify`.",
        "Disabling rules with `eslint-disable` everywhere instead of fixing the cause.",
        "Trap: 'Does Prettier catch bugs?' No. It only changes formatting; it doesn't understand what the code does.",
      ],
      takeaway: 'Prettier formats, ESLint finds bugs, hooks give fast local feedback, CI enforces it.',
    },

    {
      id: 'env-and-secrets',
      title: 'Environment management and secrets',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Config comes from environment variables validated at startup; secrets live in a secrets manager, never in Git or frontend bundles.',
      what: [
        "The same code runs in development, staging and production with different settings: database URLs, API keys, feature switches. These come from **environment variables**, not from the code (one of the Twelve-Factor App principles).",
        "Locally, values usually live in a `.env` file that is **never committed** (add it to `.gitignore`; commit a `.env.example` with dummy values instead). In the cloud, secrets live in a **secrets manager** such as AWS Secrets Manager or SSM Parameter Store, and are injected into the app at runtime.",
      ],
      deeper: [
        "Validate configuration once at startup and fail fast with a clear message, rather than crashing later on the first request that needs a missing value. Libraries like zod or envalid help; a small function works too.",
        "Node 20.6+ can load env files natively with `node --env-file=.env server.js` (and `process.loadEnvFile()` in newer versions), so `dotenv` is optional.",
        "Frontend variables (`VITE_*`, `NEXT_PUBLIC_*`) are baked into the public bundle. Secrets must stay on the server; the frontend calls your API, which holds the key.",
        "If a secret is committed, deleting the file isn't enough: it's still in Git history and may be in forks or caches. **Rotate the secret first**, then clean history if needed. Prevent leaks with secret scanning (GitHub push protection, gitleaks) and rotate secrets regularly; Secrets Manager can rotate database credentials automatically.",
      ],
      why: "Leaked credentials are one of the most common causes of breaches, and misconfigured environments cause many outages. Clean config handling shows professional discipline.",
      analogy: "Your code is a car; the environment variables are the key and the fuel. The same car works for anyone with the right key, but you don't tape the key to the windscreen (commit it) or hand copies to passers-by (frontend bundles).",
      code: {
        lang: 'js',
        title: 'Validate config at startup and fail fast',
        source: `// config.mjs: read and validate environment variables once, at startup
function loadConfig(env = process.env) {
  const errors = [];
  const required = (name) => {
    const value = env[name];
    if (!value) errors.push(\`\${name} is required\`);
    return value;
  };

  const config = {
    nodeEnv: env.NODE_ENV ?? 'development',
    port: Number(env.PORT ?? 3000),
    mongoUrl: required('MONGO_URL'),
    jwtSecret: required('JWT_SECRET'),
  };
  if (Number.isNaN(config.port)) errors.push('PORT must be a number');

  if (errors.length) {
    throw new Error('Invalid configuration:\\n- ' + errors.join('\\n- '));
  }
  return Object.freeze(config);
}

try {
  loadConfig({ PORT: 'abc', MONGO_URL: 'mongodb://localhost/app' });
} catch (err) {
  console.log(err.message);
}

const ok = loadConfig({ MONGO_URL: 'mongodb://localhost/app', JWT_SECRET: 's3cret' });
console.log(ok.port, ok.nodeEnv, Object.isFrozen(ok));`,
      },
      output: "Invalid configuration:\n- JWT_SECRET is required\n- PORT must be a number\n3000 development true\n\nThe first call reports every problem at once instead of failing on the first one. The second call succeeds, uses defaults for PORT and NODE_ENV, and returns a frozen object so config can't be changed by accident at runtime.",
      questions: [
        { q: 'Where should secrets be stored?', a: 'In a secrets manager like AWS Secrets Manager or SSM Parameter Store (or the CI system\'s secret store for pipelines), injected at runtime. Never in Git, Docker images, logs or frontend code.' },
        { q: 'You accidentally committed an API key. What do you do?', a: 'Rotate or revoke the key immediately, because it is in Git history and may already be copied. Then remove it from the code, clean history if required, check logs for misuse, and add secret scanning to prevent a repeat.' },
        { q: 'Why validate environment variables at startup?', a: 'So the app fails fast with a clear error during deployment instead of starting successfully and crashing later on the first request that needs the missing or invalid value.' },
        { q: 'Can you put an API key in a VITE_ or NEXT_PUBLIC_ variable?', a: 'Only if it is meant to be public. Those variables are inlined into the browser bundle, so anyone can read them. Secret keys must stay on the server behind your own API.' },
      ],
      answer30: "Config comes from environment variables so the same build runs in every environment. Locally I use a git-ignored .env file and commit a .env.example; in AWS, secrets live in Secrets Manager or Parameter Store and are injected at runtime with IAM controlling access. I validate config at startup and fail fast. Frontend env variables are public, so secrets never go there. If a secret leaks, I rotate it first, then clean up and add secret scanning.",
      mistakes: [
        "Committing `.env` files, or secrets in `docker-compose.yml` or CI YAML.",
        "Logging the whole config object or request headers, leaking tokens into logs.",
        "Deleting a leaked key from the latest commit and assuming it's safe.",
        "Trap: 'Are environment variables themselves secure?' They're better than hard-coding, but anyone with access to the process or its configuration can read them. A secrets manager adds access control, audit logs and rotation.",
      ],
      takeaway: 'Config from env, validated at startup; secrets in a manager, never in Git or bundles; rotate on leak.',
    },

    {
      id: 'debugging-tools',
      title: 'Debugging tools: Chrome DevTools and the Node inspector',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Breakpoints beat console.log: DevTools for the browser (Network, Sources, Performance, Memory) and --inspect for Node.',
      what: [
        "**Chrome DevTools** is built into the browser. Key panels: **Elements** (inspect and edit DOM and CSS), **Console**, **Network** (every request, status, timing, headers, payload), **Sources** (breakpoints and stepping through code), **Performance** (what the main thread is doing) and **Memory** (heap snapshots to find leaks). React DevTools adds component props, state and a render profiler.",
        "**Node.js** has the same debugger. Start with `node --inspect` (or `--inspect-brk` to pause on the first line), then attach from Chrome at `chrome://inspect` or from VS Code. You can set breakpoints, inspect variables and step through server code.",
      ],
      deeper: [
        "Useful breakpoint types: conditional breakpoints (`userId === '42'`), logpoints (log without editing code), DOM breakpoints (pause when an element changes), XHR/fetch breakpoints, and 'pause on exceptions'. The `debugger;` statement pauses when DevTools is open.",
        "Network tab tips: filter by Fetch/XHR, check the status, response body and timing breakdown, throttle to slow 3G, disable cache, and 'Copy as cURL' to replay a request.",
        "Memory leaks: take a heap snapshot, repeat the action, take another, and compare; look for detached DOM nodes, growing arrays, listeners or timers never cleaned up. In Node, `--inspect` plus heap snapshots works the same way, and `--cpu-prof` records CPU profiles.",
        "A good debugging process: reproduce reliably, read the actual error and stack trace, form a hypothesis, check it with the smallest experiment, fix, and add a test so it can't come back. In production, use logs, traces and source-mapped error tracking (like Sentry) since you can't attach a debugger.",
      ],
      why: "Interviewers ask 'how would you debug X' to see your process. Using the right tool (Network tab for API issues, Performance for jank, breakpoints for logic) solves problems much faster than scattering console.log.",
      analogy: "console.log is asking a witness what they remember. A breakpoint is freezing time at the crime scene and walking around to look at everything.",
      code: [
        {
          lang: 'bash',
          title: 'Debug a Node server',
          source: `# Start with the inspector (default port 9229), pause on the first line
node --inspect-brk dist/server.js

# With TypeScript sources and a watcher
node --inspect --enable-source-maps --watch dist/server.js

# Then open chrome://inspect in Chrome -> "Open dedicated DevTools for Node"
# or use VS Code: Run and Debug -> "Attach to Node Process"

# Record a CPU profile to find slow code
node --cpu-prof dist/server.js   # writes a .cpuprofile file on exit`,
        },
        {
          lang: 'ts',
          title: 'Pause only when a condition is met',
          source: `export async function scoreCandidate(candidate: Candidate) {
  const score = await computeScore(candidate);
  if (Number.isNaN(score)) {
    debugger; // pauses here only when DevTools/inspector is attached
  }
  return score;
}`,
        },
      ],
      output: "With `--inspect-brk` Node waits for a debugger to attach, so you can set breakpoints before any code runs. Once attached, you can step through requests and inspect variables. The `debugger;` statement pauses only when a NaN score appears, and only if a debugger is attached; otherwise it does nothing.",
      questions: [
        { q: 'How would you debug a failing API call from the frontend?', a: 'Open the Network tab, find the request, check the URL, method, status code, request payload, headers (auth, CORS) and response body. Then reproduce it with "Copy as cURL" or Postman and check the server logs for that request id.' },
        { q: 'How do you debug a Node.js app with breakpoints?', a: 'Start it with `node --inspect` (or `--inspect-brk` to pause at start), then attach Chrome DevTools via `chrome://inspect` or the VS Code debugger, set breakpoints and step through the code.' },
        { q: 'How would you find a memory leak in a web app?', a: 'Use the Memory panel: take a heap snapshot, repeat the suspected action several times, take another, and compare them. Look for growing object counts, detached DOM nodes, and listeners, timers or subscriptions that were never cleaned up.' },
        { q: 'Why is my React page janky when typing?', a: 'Record with the Performance panel or the React Profiler to see long tasks and which components re-render. Common causes are expensive work on every render or state too high in the tree; fixes include memoisation, moving state down, or deferring work.' },
      ],
      answer30: "I start by reproducing the bug and reading the actual error. In the browser, the Network tab shows the request, status and payload for API problems, Sources lets me set conditional breakpoints, Performance and React Profiler find slow renders, and Memory snapshots find leaks. For Node I run with --inspect and attach Chrome DevTools or VS Code. In production I can't attach a debugger, so I rely on structured logs, traces and source-mapped error tracking. After fixing, I add a test.",
      mistakes: [
        "Adding console.logs everywhere instead of setting one breakpoint.",
        "Ignoring the Network tab and debugging frontend code when the API returned an error.",
        "Exposing the inspector port publicly (`--inspect=0.0.0.0`) on a server: it allows remote code execution.",
        "Trap: 'The bug only happens in production.' Compare config and data, check logs and traces for that request, use source maps, and try to reproduce with production-like data locally or in staging.",
      ],
      takeaway: 'Reproduce, then use the right panel: Network for APIs, breakpoints for logic, Performance for jank, Memory for leaks; --inspect for Node.',
    },

    {
      id: 'agile-scrum',
      title: 'Agile, Scrum, estimation and Jira',
      level: 'basic',
      priority: 'good',
      frequency: 'common',
      summary: 'Short iterations, regular feedback and visible work: sprints, standups, reviews, retros, story points and a Jira board.',
      what: [
        "**Agile** is a way of building software in small increments with frequent feedback, instead of one big plan delivered at the end. **Scrum** is a popular Agile framework built around fixed-length **sprints** (usually two weeks).",
        "Scrum roles: the **Product Owner** prioritises the backlog, the **Scrum Master** helps the team follow the process and removes blockers, and the **developers** build the work. Events: **sprint planning**, a daily **standup**, a **sprint review** (demo to stakeholders) and a **retrospective** (how to work better).",
        "**Kanban** is an alternative without sprints: work flows continuously across a board, with limits on work in progress. **Jira** is the common tool for tracking stories, bugs and tasks on these boards.",
      ],
      deeper: [
        "**User stories** describe value from the user's view ('As a recruiter, I want to upload 50 CVs at once so that I save time') with **acceptance criteria** that define done. Big stories (epics) are split into small, independently deliverable stories.",
        "**Story points** estimate relative effort, complexity and uncertainty (often Fibonacci: 1, 2, 3, 5, 8, 13), not hours. **Planning poker** has everyone estimate at once to avoid anchoring; big differences start a useful discussion. **Velocity** (points done per sprint) helps forecast, but it's not a productivity score to compare teams.",
        "Good estimation habits: break work down, include testing and review time, call out unknowns, use a spike (time-boxed research) when uncertainty is high, and update stakeholders early when something will slip.",
        "A **Definition of Done** (code reviewed, tests passing, deployed to staging, docs updated) makes 'done' mean the same to everyone.",
      ],
      why: "Behavioural rounds often ask how your team worked, how you estimate and what you do when you'll miss a deadline. Clear answers show you can work predictably with product managers and other engineers.",
      analogy: "Scrum is planning a road trip in two-day legs instead of booking the whole month up front: you check the map after each leg, adjust the route, and still reach the destination, with fewer wrong turns.",
      code: {
        lang: 'text',
        title: 'A well-written story in Jira',
        source: `Title: Show progress for bulk CV uploads

As a recruiter
I want to see the status of each file in a bulk upload
So that I know which CVs failed and can retry them

Acceptance criteria
- Given an upload of N files, the batch page shows done / processing / failed counts
- Failed files show a reason and a Retry button
- Status refreshes automatically until all files are done or failed
- Users only see batches from their own tenant

Estimate: 5 points   (API endpoint + UI + tests; polling approach already agreed)
Subtasks: status endpoint, index, UI progress list, retry action, e2e test`,
      },
      output: "The story states who benefits and why, the acceptance criteria are testable, and the estimate notes what is included. Anyone can pick it up, and everyone agrees what 'done' means before work starts.",
      questions: [
        { q: 'What happens in the main Scrum ceremonies?', a: 'Sprint planning picks and plans the work for the sprint, the daily standup syncs progress and blockers, the sprint review demos the work to stakeholders, and the retrospective looks at how the team can improve its process.' },
        { q: 'What are story points and why not use hours?', a: 'Story points estimate relative size, combining effort, complexity and uncertainty. They are easier to agree on than hours, which vary by person and hide uncertainty, and they let the team forecast using past velocity.' },
        { q: 'What do you do if you realise mid-sprint that you will miss a deadline?', a: 'Tell the team and the product owner as soon as I know, explain why, and offer options: reduce scope, split the story, get help, or move the date. Raising it early is much better than surprising people at the end.' },
        { q: 'Scrum vs Kanban?', a: 'Scrum works in fixed-length sprints with planned commitments and set ceremonies. Kanban has continuous flow with work-in-progress limits and no sprints, which suits support and operations work with unpredictable arrivals.' },
      ],
      answer30: "We worked in two-week sprints with planning, daily standups, a review demo and a retrospective, tracking stories in Jira. Stories had clear acceptance criteria, and we estimated in story points using planning poker, which surfaces unknowns early. When uncertainty was high we used a time-boxed spike first. If I saw that something would slip, I raised it immediately with options like cutting scope or splitting the story, rather than waiting until the end of the sprint.",
      mistakes: [
        "Treating the standup as a status report to a manager instead of a quick team sync on blockers.",
        "Converting story points directly to hours, or comparing velocity between teams.",
        "Stories without acceptance criteria, so 'done' is argued about at review.",
        "Trap: 'Have you used Agile?' Don't just list ceremonies. Give a concrete example of how a retro or early feedback changed what your team did. Only describe what you really practised.",
      ],
      takeaway: 'Small increments, visible work, clear acceptance criteria, relative estimates, and raise risks early.',
    },

    {
      id: 'ai-coding-tools',
      title: 'Using AI coding tools responsibly',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'AI assistants speed up coding, but you own the output: review it, test it, protect secrets and data, and understand every line you ship.',
      what: [
        "AI coding tools (GitHub Copilot, Cursor, Claude Code, ChatGPT and others) autocomplete code, write functions and tests, explain unfamiliar code, and in agent mode can edit several files and run commands.",
        "Using them responsibly means treating their output like a pull request from a fast but sometimes wrong colleague: read it, test it, and only ship what you understand and can defend.",
      ],
      deeper: [
        "Common failure modes: invented APIs or package names (sometimes registered by attackers: 'slopsquatting'), outdated library usage, subtle logic or security bugs (missing auth checks, SQL/NoSQL injection, unsafe defaults), and code that passes the happy path but not edge cases.",
        "Data and IP: follow company policy on which tools are approved. Don't paste secrets, customer data or proprietary code into tools that aren't approved for it; prefer enterprise plans with no training on your data. Check licensing concerns for generated code where it matters.",
        "Getting good results: give context (types, existing patterns, constraints), ask for small steps, ask it to write tests first or explain its approach, and review diffs carefully. For agents, limit permissions and review commands before they run.",
        "Where they help most: boilerplate, tests, refactors with clear rules, regex and SQL drafts, migration scripts, docs, and learning a new codebase. Where to be most careful: auth, payments, security-sensitive and concurrency code.",
      ],
      why: "By 2026 almost every team uses AI tools, and interviewers now ask how you use them. They want to hear that you gain speed without giving up judgment, security or understanding.",
      analogy: "An AI assistant is a very fast junior pair programmer who has read every textbook but never seen your codebase. Great for first drafts; you still review everything before it goes out with your name on it.",
      code: {
        lang: 'text',
        title: 'A personal checklist before accepting AI-generated code',
        source: `[ ] I can explain every line and why it's there
[ ] Imports and packages actually exist (checked npm / docs), versions are current
[ ] Inputs are validated; auth and tenant checks are present
[ ] No secrets, tokens or customer data were pasted into the prompt
[ ] Edge cases: empty, null, huge input, concurrent requests, errors
[ ] Tests written or updated, and they fail without the change
[ ] Matches our patterns (error handling, logging, naming)
[ ] Lint, type-check and CI pass
[ ] The PR says what was AI-assisted if the team asks for that`,
      },
      output: "Going through the checklist turns AI output into code you'd be happy to defend in review. Most problems it catches are invented APIs, missing validation or auth, and untested edge cases.",
      questions: [
        { q: 'How do you use AI coding tools in your work?', a: 'Describe real use: for example drafting tests, boilerplate, refactors and explaining unfamiliar code. Then explain your safeguards: you review every change, run tests and lint, check that APIs exist, and never paste secrets or customer data into unapproved tools.' },
        { q: 'What are the risks of AI-generated code?', a: 'It can invent APIs or packages, use outdated patterns, miss security checks or edge cases, and look convincing while being wrong. There are also data-privacy and licensing concerns depending on the tool and what you paste into it.' },
        { q: 'How do you review AI-generated code?', a: 'The same way as a colleague\'s PR, but more sceptically: make sure I understand every line, verify libraries and APIs against docs, check auth, validation and error handling, and require tests that fail without the change.' },
        { q: 'Where would you avoid relying on AI?', a: 'In security-critical or high-risk code, like authentication, payments, permissions and data migrations, unless I review it very carefully. And whenever company policy or data sensitivity doesn\'t allow it.' },
      ],
      answer30: "I use AI tools to move faster on things like boilerplate, tests, refactors and understanding unfamiliar code. I treat the output like a PR from a fast colleague who can be confidently wrong: I read and understand every line, check that APIs and packages really exist, look for missing validation and auth checks, and make sure tests and CI pass. I follow company policy on approved tools and never paste secrets or customer data. The responsibility for the code stays with me.",
      mistakes: [
        "Accepting large AI changes without reading them because the tests passed.",
        "Installing a package an AI suggested without checking it's real and maintained.",
        "Pasting production data, credentials or proprietary code into an unapproved tool.",
        "Trap: 'Doesn't AI make code review unnecessary?' No. It makes careful review more important, because code can be produced faster than it's understood.",
      ],
      takeaway: 'AI drafts, you decide: review, verify, test, and protect data. You own every line you ship.',
    },
  ],
  rapidFire: [
    { q: 'git fetch vs git pull?', a: 'Fetch downloads only; pull fetches and merges (or rebases) into your branch.' },
    { q: 'What is a branch?', a: 'A movable pointer to a commit.' },
    { q: 'Merge vs rebase?', a: 'Merge adds a merge commit and keeps history; rebase replays commits for a linear history.' },
    { q: 'Golden rule of rebasing?', a: 'Never rebase commits others have already pulled.' },
    { q: 'Safe way to force-push?', a: '`git push --force-with-lease`.' },
    { q: 'Undo a commit already on main?', a: '`git revert <hash>`: a new commit that reverses it.' },
    { q: 'reset --soft vs --hard?', a: 'Soft keeps changes staged; hard discards them.' },
    { q: 'Recover commits after a bad reset?', a: '`git reflog`, then reset or branch to the old hash.' },
    { q: 'Find the commit that broke tests?', a: '`git bisect`, ideally `git bisect run npm test`.' },
    { q: 'Copy one commit to another branch?', a: '`git cherry-pick <hash>`.' },
    { q: 'Trunk-based development in one line?', a: 'Small changes merged to main at least daily, unfinished work behind flags.' },
    { q: 'What makes a good PR?', a: 'Small, one purpose, clear what/why/how-tested, passing CI.' },
    { q: 'npm install vs npm ci?', a: 'ci installs exactly from the lockfile and fails if it is out of sync.' },
    { q: '^1.4.2 vs ~1.4.2?', a: 'Caret allows minor and patch updates; tilde only patch updates.' },
    { q: 'What is tree-shaking?', a: 'Removing unused exports from the bundle; needs ES modules.' },
    { q: 'Why is Vite dev fast?', a: 'It serves native ES modules instead of bundling everything first.' },
    { q: 'ESLint vs Prettier?', a: 'ESLint finds bugs and bad patterns; Prettier only formats.' },
    { q: 'Are VITE_ variables secret?', a: 'No, they are inlined into the public bundle.' },
    { q: 'First step after leaking a secret?', a: 'Rotate or revoke it, then clean up.' },
    { q: 'Debug Node with breakpoints?', a: '`node --inspect`, then attach via chrome://inspect or VS Code.' },
    { q: 'Story points measure?', a: 'Relative effort, complexity and uncertainty, not hours.' },
    { q: 'Who owns AI-generated code you ship?', a: 'You do: review, verify and test it like any other code.' },
  ],
};
export default tools;
