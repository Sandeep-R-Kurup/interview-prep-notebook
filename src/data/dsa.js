// DSA and Problem Solving stack. Topics are auto-sorted Basic -> Intermediate -> Advanced by the registry.
// Every JavaScript solution here was run with Node, and each `output` is what it really prints.

const dsa = {
  name: 'DSA and Problem Solving',
  intro: 'The patterns behind most coding-round problems, each with solved JavaScript examples and their time and space cost. Learn to spot the pattern first; the code follows from it.',
  topics: [
    {
      id: 'big-o',
      title: 'Big-O: time and space complexity',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Big-O describes how the work (or memory) grows as the input grows, ignoring constants.',
      what: [
        "Big-O notation answers one question: if the input gets bigger, how much slower does my code get? `O(1)` means the same time no matter the size. `O(n)` means time grows in step with the input. `O(n^2)` means doubling the input makes it four times slower.",
        "Space complexity is the same idea for extra memory: a new array of size n is `O(n)` space; a few variables are `O(1)`.",
      ],
      deeper: [
        "Common classes from fastest to slowest: `O(1)` (hash lookup), `O(log n)` (binary search, halving each step), `O(n)` (one pass), `O(n log n)` (good sorting), `O(n^2)` (nested loops over the same input), `O(2^n)` (all subsets), `O(n!)` (all permutations).",
        "Rules of thumb: drop constants (`O(2n)` is `O(n)`), keep the biggest term (`O(n^2 + n)` is `O(n^2)`), and use different letters for different inputs (looping over two arrays is `O(a + b)`, nesting them is `O(a * b)`).",
        "Know the cost of built-ins: `arr.push/pop` are `O(1)`, `arr.shift/unshift/splice/includes/indexOf` are `O(n)`, `Map/Set` get/has/add are `O(1)` on average, `arr.sort` is `O(n log n)`. Recursion uses stack space: a recursion that goes n levels deep is `O(n)` space even with no arrays.",
        "Amortized cost: `push` is `O(1)` on average even though the array occasionally copies itself to grow.",
      ],
      why: "Interviewers don't only want working code; they want to know you can tell whether it will survive 10 million rows. Every coding round ends with 'what's the time and space complexity?'.",
      analogy: "Looking for a name in a phone book. Reading every page is O(n). Opening the middle and halving each time is O(log n). Already knowing the page number is O(1).",
      code: {
        lang: 'js',
        title: 'Same problem, three complexities: does the array contain a duplicate?',
        source: `// O(n^2) time, O(1) space: compare every pair
function hasDupBrute(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}

// O(n log n) time: sort a copy, then duplicates sit next to each other
function hasDupSort(arr) {
  const s = [...arr].sort((a, b) => a - b);
  for (let i = 1; i < s.length; i++) if (s[i] === s[i - 1]) return true;
  return false;
}

// O(n) time, O(n) space: remember what we've seen in a Set
function hasDupSet(arr) {
  const seen = new Set();
  for (const x of arr) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;
}

const data = [4, 1, 7, 3, 1];
console.log(hasDupBrute(data), hasDupSort(data), hasDupSet(data));
console.log(hasDupSet([1, 2, 3]));`,
      },
      output: "Prints `true true true` (all three find the repeated 1), then `false`. Same answers, different costs: the Set version trades O(n) extra memory for O(n) time, which is the most common trade-off in interviews.",
      questions: [
        { q: 'What is the time complexity of binary search and why?', a: 'O(log n). Each step throws away half of the remaining items, so a million items need only about 20 steps.' },
        { q: 'What is the time complexity of `arr.includes(x)` inside a loop over arr?', a: 'O(n^2). `includes` is itself a linear scan, so calling it n times is n times n. Replace it with a Set lookup to get O(n).' },
        { q: 'What is the space complexity of a recursive function with depth n?', a: 'At least O(n), because each pending call keeps a frame on the call stack, even if it creates no arrays.' },
        { q: 'Why do we drop constants in Big-O?', a: 'Big-O describes growth as n gets huge, where the shape of the curve matters far more than a constant factor. In practice constants still matter for real performance, so mention them when they are large.' },
        { q: 'What does amortized O(1) mean for `push`?', a: 'Most pushes are instant, but occasionally the array has to grow and copy everything. Averaged over many pushes, the cost per push is still constant.' },
      ],
      answer30: "Big-O tells you how running time or memory grows as the input grows, ignoring constants and smaller terms. One loop is O(n), nested loops over the same data are O(n^2), halving each step is O(log n), and sorting is O(n log n). I always state both time and space, and I watch for hidden costs like includes, indexOf, or shift inside a loop, which turn O(n) into O(n^2). The most common fix is trading memory for speed with a Map or Set.",
      mistakes: [
        'Forgetting hidden loops: `includes`, `indexOf`, `splice`, `shift` and spreading an array are all O(n).',
        'Ignoring recursion stack space when giving the space complexity.',
        'Saying O(n) for two separate inputs. Looping over two different arrays is O(a + b), not O(n).',
        "Trap: 'Is a hash map lookup always O(1)?' Average O(1); worst case O(n) if many keys collide. Say 'average' and you look precise.",
      ],
      takeaway: 'State time and space for every solution, and look for hidden O(n) built-ins inside loops.',
      note: "On your resume: the same idea shows up in MongoDB. A query that uses an index (like one starting with tenantId) is a B-tree lookup, roughly O(log n); a query without one is a collection scan, O(n).",
    },

    {
      id: 'arrays-hashing',
      title: 'Arrays and hashing (Two Sum, Group Anagrams)',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Use a Map or Set to remember what you have seen, turning O(n^2) searches into O(n).',
      what: [
        "Many array problems ask 'have I seen something that matches this before?'. Checking with a nested loop is O(n^2). Storing what you have seen in a `Map` (or `Set`) makes each check O(1), so the whole thing is O(n).",
        "The trick is choosing the right key. For Two Sum, the key is the number and the value is its index. For Group Anagrams, the key is the word with its letters sorted, because all anagrams sort to the same string.",
      ],
      deeper: [
        "Prefer `Map` over a plain object for hashing in interviews: keys can be any type, there are no inherited keys like `constructor`, it keeps insertion order, and `map.size` is O(1).",
        "Frequency counting is the other big use: count each item in one pass, then answer questions about the counts (anagrams, majority element, first unique character).",
        "For anagram keys, sorting each word costs O(k log k). A faster key is a count of 26 letters joined into a string, which is O(k). Mention it as an optimisation.",
      ],
      why: "Hashing is the single most useful trick in coding rounds. It is usually the step from the brute-force answer to the expected answer.",
      analogy: "A guest list at the door. Instead of walking around the party asking everyone 'is your partner here?', you check the list once at the entrance.",
      code: {
        lang: 'js',
        source: `// Two Sum: return indices of the two numbers that add up to target.
// O(n) time, O(n) space.
function twoSum(nums, target) {
  const seen = new Map(); // value -> index
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i); // set AFTER checking, so we never pair a number with itself
  }
  return [];
}

// Group Anagrams. O(n * k log k) time where k is the longest word.
function groupAnagrams(words) {
  const groups = new Map(); // sorted letters -> list of words
  for (const w of words) {
    const key = [...w].sort().join('');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(w);
  }
  return [...groups.values()];
}

console.log(twoSum([2, 7, 11, 15], 9));
console.log(twoSum([3, 3], 6));
console.log(JSON.stringify(groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat'])));`,
      },
      output: "Prints `[ 0, 1 ]`, then `[ 0, 1 ]` (the set-after-check order makes [3, 3] work), then `[[\"eat\",\"tea\",\"ate\"],[\"tan\",\"nat\"],[\"bat\"]]`. Groups appear in the order their first word was seen, because Map keeps insertion order.",
      questions: [
        { q: 'How do you solve Two Sum in O(n)?', a: 'Walk the array once with a Map from value to index. For each number, check whether `target - num` is already in the Map; if yes, return both indices, otherwise store the current number.' },
        { q: 'Why insert into the map after the check in Two Sum?', a: 'So a number is never paired with itself. With target 6 and [3, 4], checking first stops the single 3 from matching itself.' },
        { q: 'What key do you use to group anagrams?', a: 'Something every anagram shares: the letters sorted (`eat` becomes `aet`), or a 26-letter count string for O(k) per word instead of O(k log k).' },
        { q: 'If the array in Two Sum is sorted, can you do better on space?', a: 'Yes. Use two pointers from both ends: move left forward if the sum is too small, right backward if it is too big. O(n) time and O(1) space.' },
        { q: 'Map or plain object for counting?', a: 'Map. It accepts any key type, has no inherited keys, keeps insertion order and gives `size` directly. Objects also turn number keys into strings.' },
      ],
      answer30: "When a brute force compares every pair, I ask what I need to remember to answer in one pass, and store it in a Map or Set. For Two Sum I keep a map from value to index and, for each number, look up target minus it, which is O(n) time and O(n) space. For Group Anagrams the key is the sorted word, so all anagrams land in the same bucket. Choosing the key is the real problem.",
      mistakes: [
        'Pairing an element with itself by inserting before checking.',
        'Using `indexOf` or `includes` inside the loop, which quietly brings back O(n^2).',
        "Using a plain object and getting surprised by keys like `'constructor'` or number keys becoming strings.",
        "Trap: 'What if there are many valid pairs?' Clarify first: return any one, all pairs, or a count. Each needs a slightly different answer.",
      ],
      takeaway: 'Nested loop looking for a match? Store what you have seen in a Map and look it up in O(1).',
    },

    {
      id: 'two-pointers',
      title: 'Two pointers',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Two indexes move through the array (from both ends, or one fast and one slow) to avoid a nested loop.',
      what: [
        "Two pointers means keeping two indexes into the same array and moving them based on a rule. Each step moves at least one pointer, so the whole scan is O(n) instead of checking every pair in O(n^2).",
        "Two common shapes: (1) opposite ends, `left = 0` and `right = n - 1`, moving towards each other (sorted pair sum, palindrome check, container with most water). (2) Same direction, a slow pointer that marks where to write and a fast pointer that reads (remove duplicates, move zeroes).",
      ],
      deeper: [
        "Opposite-end pointers usually need the array to be sorted, or a property that tells you which side to move. In Container With Most Water, the area is limited by the shorter wall, so moving the taller wall can never help; you always move the shorter one.",
        "Slow/fast pointers edit the array in place with O(1) extra space, which is often the follow-up ('can you do it without a new array?').",
        "The same idea on linked lists becomes fast and slow pointers (cycle detection, finding the middle). Three Sum is 'sort, fix one number, then two pointers on the rest', O(n^2).",
      ],
      why: "It is the standard way to get O(1) extra space on sorted arrays and strings, and it shows the interviewer you can reason about why a pointer is allowed to move.",
      analogy: "Two people searching a bookshelf for two books whose page counts add up to 500. One starts at the thin end, one at the thick end; depending on the total, one of them takes a step inward.",
      code: {
        lang: 'js',
        source: `// 1) Pair with target sum in a SORTED array. O(n) time, O(1) space.
function pairSumSorted(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;   // need a bigger sum
    else right--;               // need a smaller sum
  }
  return [];
}

// 2) Remove duplicates from a sorted array in place; return the new length.
function removeDuplicates(nums) {
  let write = 1; // slow pointer: next place to write a unique value
  for (let read = 1; read < nums.length; read++) {
    if (nums[read] !== nums[write - 1]) nums[write++] = nums[read];
  }
  return write;
}

// 3) Container With Most Water. O(n).
function maxArea(heights) {
  let left = 0, right = heights.length - 1, best = 0;
  while (left < right) {
    const area = Math.min(heights[left], heights[right]) * (right - left);
    best = Math.max(best, area);
    if (heights[left] < heights[right]) left++; else right--; // move the shorter wall
  }
  return best;
}

console.log(pairSumSorted([1, 3, 4, 6, 9], 13));
const arr = [1, 1, 2, 3, 3, 3, 4];
const len = removeDuplicates(arr);
console.log(len, arr.slice(0, len));
console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]));`,
      },
      output: "Prints `[ 2, 4 ]`: 1 + 9 and 3 + 9 are too small, so left moves forward twice until 4 + 9 = 13, then `4 [ 1, 2, 3, 4 ]`, then `49` (walls of height 8 and 7, seven apart).",
      questions: [
        { q: 'When does the two-pointer technique apply?', a: 'When the input is sorted (or can be sorted), or when a rule tells you which pointer to move, such as pair sums, palindromes, merging two sorted arrays, or in-place filtering.' },
        { q: 'In Container With Most Water, why move the shorter wall?', a: 'The area is capped by the shorter wall. Moving the taller one only shrinks the width while the cap stays the same or drops, so it can never give a bigger area.' },
        { q: 'How do you solve Three Sum?', a: 'Sort the array, loop over each number as the first value, then use two pointers on the rest to find pairs that sum to its negative. Skip duplicates to avoid repeated triplets. O(n^2) time.' },
        { q: 'How do you remove duplicates from a sorted array without extra space?', a: 'Use a slow write pointer and a fast read pointer. Copy a value to the write position only when it differs from the last written value. Return the write index as the new length.' },
      ],
      answer30: "Two pointers replace a nested loop with a single pass. On a sorted array I put one pointer at each end and move whichever side brings the sum closer to the target, which is O(n) time and O(1) space. For in-place problems I use a slow pointer that writes and a fast pointer that reads. The key is being able to explain why moving a pointer never skips a valid answer.",
      mistakes: [
        'Using opposite-end pointers on an unsorted array, where moving a pointer has no meaning.',
        'Off-by-one loop conditions: `left < right` for pairs, `left <= right` only when one element on its own counts.',
        'Forgetting to skip duplicates in Three Sum, which produces repeated triplets.',
        "Trap: 'Sorting changes the indices, so how do you return original indices?' Sort pairs of [value, index], or use the hash map approach instead.",
      ],
      takeaway: 'Sorted input or an in-place edit? Think two pointers, and justify each pointer move.',
    },

    {
      id: 'sliding-window',
      title: 'Sliding window',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Keep a window over a contiguous part of the array and update it as it slides, instead of recomputing every subarray.',
      what: [
        "Sliding window is for questions about a contiguous subarray or substring: the largest sum of k items in a row, the shortest part whose sum reaches a target, the longest part with no repeats.",
        "Instead of recomputing each window from scratch, you add the item entering on the right and remove the item leaving on the left. Each item enters and leaves once, so the work is O(n).",
      ],
      deeper: [
        "Fixed-size window: the window is always k wide. Add `arr[i]`, subtract `arr[i - k]`.",
        "Variable-size window: grow the right edge every step; while the window breaks the rule (sum too big, a repeated character), shrink from the left. Record the answer when the window is valid. The inner `while` doesn't make it O(n^2), because `left` only ever moves forward, n times in total.",
        "The window only works when shrinking makes the condition 'better' in a predictable way. With negative numbers, 'sum at least target' no longer behaves like that, and you need prefix sums with a Map or a deque instead.",
      ],
      why: "It turns O(n * k) or O(n^2) brute force into O(n), and it is behind a large share of string and array questions (longest substring, minimum window, max average).",
      analogy: "A train window on a long fence. You don't repaint your view each second; one new plank slides in on the right as one slides out on the left.",
      code: {
        lang: 'js',
        source: `// Fixed window: max sum of any k consecutive numbers. O(n) time, O(1) space.
function maxSumK(nums, k) {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  for (let i = k; i < nums.length; i++) {
    sum += nums[i] - nums[i - k]; // add the new item, drop the oldest
    best = Math.max(best, sum);
  }
  return best;
}

// Variable window: length of the shortest subarray with sum >= target
// (positive numbers only). O(n) time, O(1) space.
function minSubArrayLen(target, nums) {
  let left = 0, sum = 0, best = Infinity;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];             // grow
    while (sum >= target) {         // valid: record, then try to shrink
      best = Math.min(best, right - left + 1);
      sum -= nums[left++];
    }
  }
  return best === Infinity ? 0 : best;
}

console.log(maxSumK([2, 1, 5, 1, 3, 2], 3));
console.log(minSubArrayLen(7, [2, 3, 1, 2, 4, 3]));
console.log(minSubArrayLen(100, [1, 2, 3]));`,
      },
      output: "Prints `9` (the window 5, 1, 3), then `2` (the window 4, 3), then `0` because no window ever reaches 100.",
      questions: [
        { q: 'How do you recognise a sliding window problem?', a: "The question talks about a contiguous subarray or substring and asks for a longest, shortest, maximum or count, often with a condition like 'at most k distinct' or 'no repeats'." },
        { q: 'Why is a variable window O(n) even with a while loop inside a for loop?', a: 'The left pointer only moves forward and can move at most n times in total across the whole run. So the two pointers together do at most 2n steps.' },
        { q: 'Why does the minimum-length window need positive numbers?', a: 'With only positives, adding an item always increases the sum and removing one always decreases it, so shrinking is safe. Negative numbers break that, and you need prefix sums instead.' },
        { q: 'What is the difference between a fixed and a variable window?', a: 'A fixed window always has size k: add one, remove one each step. A variable window grows on the right and shrinks from the left while a condition is broken.' },
      ],
      answer30: "Sliding window is for contiguous subarray or substring questions. I keep left and right pointers and a running state, like a sum or a character count. I grow the window on the right every step, and while it breaks the rule I shrink it from the left, recording the best answer when it is valid. Because each element enters and leaves once, it is O(n) time, usually with O(1) or O(alphabet) space.",
      mistakes: [
        'Recomputing the window sum with a loop each time, which is O(n * k).',
        'Recording the answer at the wrong moment (before shrinking vs. after) and getting an off-by-one window length.',
        'Applying the shrink rule to arrays with negative numbers.',
        "Trap: 'Subarray vs subsequence?' A subarray is contiguous, so sliding window applies. A subsequence can skip items, which usually means dynamic programming.",
      ],
      takeaway: 'Contiguous + longest/shortest/max = sliding window: grow right, shrink left while invalid.',
    },

    {
      id: 'stack-monotonic',
      title: 'Stack and monotonic stack',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'A stack handles last-in-first-out matching; a monotonic stack finds the next greater or smaller element in O(n).',
      what: [
        "A stack is last in, first out: you only add (`push`) or remove (`pop`) at the top. In JavaScript a plain array is a stack. It fits any problem where the most recent open thing must be closed first, like brackets, undo, or nested function calls.",
        "A monotonic stack is a stack kept in sorted order (always increasing or always decreasing). Before pushing a new item, you pop everything that breaks the order. Each item that gets popped has just found its 'next greater' (or smaller) element.",
      ],
      deeper: [
        "Valid Parentheses: push opening brackets; on a closing bracket, the top must be its matching opener. At the end the stack must be empty.",
        "Next Greater Element / Daily Temperatures: keep a stack of indexes whose answer isn't known yet, with values decreasing from bottom to top. When a bigger value arrives, pop and fill in answers until the top is bigger than it. Every index is pushed and popped once, so it is O(n) despite the inner loop.",
        "Store indexes, not values, in the stack when you need distances (days to wait) or need to write into a result array.",
        "Other stack problems: evaluate Reverse Polish Notation, min stack (store the current min with each push), largest rectangle in a histogram (monotonic increasing stack).",
      ],
      why: "Brackets and nesting come up everywhere (parsers, JSON, HTML), and 'next greater element' is a classic O(n^2)-to-O(n) improvement interviewers like to see.",
      analogy: "A stack of plates: you take from the top. A monotonic stack is a queue of people where a taller newcomer makes everyone shorter in front of them step aside, because they can now see who is taller than them.",
      code: {
        lang: 'js',
        source: `// Valid Parentheses. O(n) time, O(n) space.
function isValid(s) {
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);
    else if (stack.pop() !== pairs[ch]) return false;
  }
  return stack.length === 0;
}

// Daily Temperatures: days to wait for a warmer day (0 if never).
// Monotonic decreasing stack of indexes. O(n) time, O(n) space.
function dailyTemperatures(temps) {
  const result = new Array(temps.length).fill(0);
  const stack = []; // indexes still waiting for a warmer day
  for (let i = 0; i < temps.length; i++) {
    while (stack.length && temps[i] > temps[stack[stack.length - 1]]) {
      const j = stack.pop();
      result[j] = i - j;
    }
    stack.push(i);
  }
  return result;
}

console.log(isValid('({[]})'), isValid('(]'), isValid('(('));
console.log(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]).join(' '));`,
      },
      output: "Prints `true false false` (the last one fails because two openers are never closed), then `1 1 4 2 1 1 0 0`: day 0 waits 1 day, day 2 (75) waits 4 days for 76, and the last two never get warmer.",
      questions: [
        { q: 'How do you check if brackets are balanced?', a: 'Push every opening bracket onto a stack. For each closing bracket, pop and check it is the matching opener. At the end the stack must be empty, or some opener was never closed.' },
        { q: 'What is a monotonic stack?', a: 'A stack whose values stay sorted from bottom to top. Before pushing, you pop items that would break the order; popping is the moment you learn their next greater or smaller element.' },
        { q: 'Why is Daily Temperatures O(n) with a nested while loop?', a: 'Each index is pushed once and popped at most once, so the total work across all iterations is at most 2n.' },
        { q: 'How do you design a stack that returns its minimum in O(1)?', a: 'Push pairs of [value, minSoFar], or keep a second stack of minimums. The current minimum is always at the top, and popping restores the previous one.' },
      ],
      answer30: "A stack is last in, first out, which matches nesting: for valid parentheses I push openers and each closer must match the top, and the stack must be empty at the end. For 'next greater element' problems I use a monotonic stack of indexes: when a bigger value arrives, I pop the smaller ones and fill in their answers. Each index is pushed and popped once, so it is O(n) instead of O(n^2).",
      mistakes: [
        'Forgetting the final `stack.length === 0` check, so `((` is reported as valid.',
        'Storing values instead of indexes when the answer needs a distance.',
        'Using `arr.shift()` as a stack pop; that is a queue operation and O(n).',
        "Trap: 'Can you do Valid Parentheses with a counter instead?' Only for one bracket type. With mixed types, `([)]` has balanced counts but is invalid, so you need the stack.",
      ],
      takeaway: 'Nesting means stack; next greater/smaller means monotonic stack of indexes.',
    },

    {
      id: 'binary-search',
      title: 'Binary search',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Halve the search space each step to find a value or a boundary in O(log n).',
      what: [
        "Binary search works on sorted data. Look at the middle item: if it is the target, done; if the target is bigger, search the right half; otherwise the left half. Each step halves the remaining range, so a million items need about 20 checks.",
        "The more powerful version searches for a boundary: the first index where a condition becomes true (first position of a value, first bad version, smallest speed that finishes in time).",
      ],
      deeper: [
        "Two templates. Exact match: `while (lo <= hi)`, return when found, move `lo = mid + 1` or `hi = mid - 1`. Boundary (lower bound): `while (lo < hi)`, if the condition holds at mid then `hi = mid` (mid might be the answer) else `lo = mid + 1`. The loop ends with `lo === hi` on the first true position.",
        "Compute the middle as `lo + Math.floor((hi - lo) / 2)`. In JavaScript numbers don't overflow at 2^31, but interviewers from Java/C++ backgrounds expect this form.",
        "Binary search on the answer: if you can check 'is speed x enough?' and the answer is monotonic (enough at x means enough at anything bigger), binary search over x. Koko Eating Bananas and shipping capacity are classic examples.",
        "Rotated sorted array: one half around `mid` is always sorted. Check whether the target lies inside the sorted half; if so go there, otherwise go to the other half.",
      ],
      why: "It is the go-to O(log n) tool and a favourite for testing careful thinking, because off-by-one errors and infinite loops are easy to make.",
      analogy: "Guessing a number between 1 and 100 when someone says 'higher' or 'lower'. Always guess the middle and you need at most 7 guesses.",
      code: {
        lang: 'js',
        source: `// Classic: index of target or -1. O(log n) time, O(1) space.
function binarySearch(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1; else hi = mid - 1;
  }
  return -1;
}

// Lower bound: first index with nums[i] >= target (nums.length if none).
function lowerBound(nums, target) {
  let lo = 0, hi = nums.length;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid] >= target) hi = mid; else lo = mid + 1;
  }
  return lo;
}

// Search in a rotated sorted array (no duplicates). O(log n).
function searchRotated(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) { // left half is sorted
      if (target >= nums[lo] && target < nums[mid]) hi = mid - 1; else lo = mid + 1;
    } else {                     // right half is sorted
      if (target > nums[mid] && target <= nums[hi]) lo = mid + 1; else hi = mid - 1;
    }
  }
  return -1;
}

console.log(binarySearch([1, 3, 5, 7, 9, 11], 7), binarySearch([1, 3, 5], 4));
console.log(lowerBound([1, 2, 2, 2, 5], 2), lowerBound([1, 2, 2, 2, 5], 6));
console.log(searchRotated([4, 5, 6, 7, 0, 1, 2], 0), searchRotated([4, 5, 6, 7, 0, 1, 2], 3));`,
      },
      output: "Prints `3 -1` (7 is at index 3; 4 is missing), then `1 5` (the first 2 is at index 1; nothing is >= 6 so it returns the length), then `4 -1`.",
      questions: [
        { q: 'What does binary search require?', a: 'A sorted array, or more generally a yes/no condition that is false for a while and then true for the rest (monotonic). That is what makes it safe to throw away half.' },
        { q: 'How do you find the first occurrence of a value?', a: 'Use the lower-bound template: when `nums[mid] >= target`, set `hi = mid` instead of returning, so the search keeps moving left. When the loop ends, check that `nums[lo]` really equals the target.' },
        { q: 'How do you search a rotated sorted array?', a: 'At each step, one of the two halves around mid is sorted. If the target lies within that sorted half, search there; otherwise search the other half. Still O(log n).' },
        { q: "What is 'binary search on the answer'?", a: 'When you can test whether a candidate answer works and the results are monotonic, you binary search over the range of possible answers instead of over an array, like the smallest capacity that ships all packages in D days.' },
        { q: 'Why `lo + Math.floor((hi - lo) / 2)` instead of `(lo + hi) / 2`?', a: 'In languages with 32-bit integers, `lo + hi` can overflow. JavaScript numbers do not overflow there, but the safe form is the habit interviewers expect, and you still need `Math.floor`.' },
      ],
      answer30: "Binary search halves the search space each step, so it's O(log n). It needs sorted data or a monotonic condition. I use two templates: an exact-match one with lo <= hi, and a boundary one with lo < hi, where hi = mid when the condition holds, which finds the first true position. The same idea extends to rotated arrays, where one half is always sorted, and to searching over the answer itself, like a minimum capacity.",
      mistakes: [
        'Infinite loops from `lo = mid` combined with a floor mid. With `lo < hi`, always move `lo` to `mid + 1`.',
        'Mixing templates: `while (lo <= hi)` with `hi = mid` can loop forever.',
        'Forgetting `Math.floor`, which gives a fractional index in JavaScript.',
        "Trap: 'What about duplicates in a rotated array?' When `nums[lo] === nums[mid]` you can't tell which half is sorted; shrink with `lo++`, and the worst case becomes O(n).",
      ],
      takeaway: 'Sorted or monotonic? Halve it. Learn the exact-match and lower-bound templates cold.',
    },

    {
      id: 'linked-lists',
      title: 'Linked lists',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Nodes that point to the next node; most questions are pointer rewiring plus the fast/slow pointer trick.',
      what: [
        "A linked list is a chain of nodes. Each node holds a value and a `next` pointer to the following node; the last one points to `null`. You only keep a reference to the first node, the head.",
        "Unlike an array, there are no indexes: reaching the 5th node means walking 5 steps (O(n)). But inserting or removing a node, once you are standing next to it, is O(1) because you just change pointers.",
      ],
      deeper: [
        "Reverse a list: walk once with three variables, `prev`, `curr` and `next`. Save `curr.next`, point `curr.next` back to `prev`, then step both forward. O(n) time, O(1) space.",
        "Fast and slow pointers: fast moves 2 steps, slow moves 1. If there is a cycle, fast eventually laps slow and they meet (Floyd's algorithm). If there is no cycle, fast hits `null`. When fast reaches the end, slow is at the middle.",
        "A dummy (sentinel) head node removes edge cases when the real head might change, such as merging two lists or deleting the first node. Return `dummy.next` at the end.",
        "Remove the nth node from the end: move a fast pointer n steps ahead, then move both until fast reaches the end; slow is just before the node to remove.",
      ],
      why: "Linked lists test whether you can manipulate references carefully without losing part of the list. The same reasoning applies to trees and graphs, and to LRU caches, which use a doubly linked list.",
      analogy: "A treasure hunt where each clue tells you where the next clue is. You can't jump to clue 7; you follow the chain. Reversing it means rewriting every clue to point back the way you came.",
      code: {
        lang: 'js',
        source: `class ListNode {
  constructor(val, next = null) { this.val = val; this.next = next; }
}
const fromArray = (arr) => arr.reduceRight((next, val) => new ListNode(val, next), null);
const toArray = (head) => { const out = []; for (let n = head; n; n = n.next) out.push(n.val); return out; };

// Reverse. O(n) time, O(1) space.
function reverse(head) {
  let prev = null, curr = head;
  while (curr) {
    const next = curr.next; // save the rest of the list
    curr.next = prev;       // flip the pointer
    prev = curr;
    curr = next;
  }
  return prev;
}

// Merge two sorted lists using a dummy head. O(a + b).
function mergeSorted(a, b) {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (a && b) {
    if (a.val <= b.val) { tail.next = a; a = a.next; } else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a || b; // attach whatever is left
  return dummy.next;
}

// Cycle detection with fast/slow pointers. O(n) time, O(1) space.
function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

// Middle node (second middle for even length).
function middle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }
  return slow.val;
}

console.log(toArray(reverse(fromArray([1, 2, 3, 4]))));
console.log(toArray(mergeSorted(fromArray([1, 3, 5]), fromArray([2, 4, 6]))).join(' '));
const loop = fromArray([1, 2, 3]);
loop.next.next.next = loop.next; // 3 -> 2 makes a cycle
console.log(hasCycle(loop), hasCycle(fromArray([1, 2, 3])));
console.log(middle(fromArray([1, 2, 3, 4, 5])), middle(fromArray([1, 2, 3, 4])));`,
      },
      output: "Prints `[ 4, 3, 2, 1 ]`, then `1 2 3 4 5 6`, then `true false`, then `3 3` (for an even-length list this version returns the second of the two middle nodes).",
      questions: [
        { q: 'How do you reverse a linked list in place?', a: 'Walk the list with `prev` and `curr`. For each node, save `curr.next`, point `curr.next` to `prev`, then move `prev` and `curr` forward. At the end `prev` is the new head. O(n) time, O(1) space.' },
        { q: 'How do you detect a cycle?', a: "Floyd's fast and slow pointers: slow moves one step, fast moves two. If they ever point to the same node there is a cycle; if fast reaches null there isn't. O(1) extra space, unlike storing visited nodes in a Set." },
        { q: 'Why use a dummy head node?', a: 'It gives you a fixed node before the real head, so you never need special cases when the first node changes, such as when merging or deleting. You return `dummy.next`.' },
        { q: 'Array vs linked list?', a: 'Arrays give O(1) access by index and are cache-friendly. Linked lists give O(1) insert or delete once you hold the neighbouring node, but O(n) access. In JavaScript you rarely build one except for things like an LRU cache.' },
      ],
      answer30: "A linked list is nodes connected by next pointers, so access is O(n) but insert and delete next to a known node are O(1). Most questions are careful pointer rewiring: to reverse, I keep prev and curr and flip each next pointer. I use a dummy head to avoid edge cases when the head can change, and fast and slow pointers to find the middle, detect a cycle, or find the nth node from the end, all in O(1) extra space.",
      mistakes: [
        'Overwriting `curr.next` before saving it, which loses the rest of the list.',
        'Not checking `fast && fast.next` before `fast.next.next`, which crashes on even-length lists.',
        'Forgetting to attach the leftover list after a merge loop.',
        "Trap: 'Find where the cycle starts.' After slow and fast meet, move one pointer back to the head and step both one at a time; they meet at the cycle's start.",
      ],
      takeaway: 'Save next before rewiring, use a dummy head for edge cases, and fast/slow pointers for middle and cycles.',
    },

    {
      id: 'recursion-backtracking',
      title: 'Recursion and backtracking',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Solve a problem by calling the same function on a smaller input; backtracking builds choices step by step and undoes them.',
      what: [
        "Recursion is a function calling itself on a smaller version of the problem. Every recursive function needs a base case (when to stop) and a recursive step that moves towards it.",
        "Backtracking is recursion for 'generate all possibilities' problems: subsets, permutations, combinations, N-Queens, word search. You make a choice, recurse, then undo the choice (backtrack) and try the next one.",
      ],
      deeper: [
        "The backtracking template: `function backtrack(path, choices) { if (done) { save a copy of path; return; } for (const c of choices) { if (!valid(c)) continue; path.push(c); backtrack(...); path.pop(); } }`.",
        "Always save a copy (`[...path]`) at the base case, because `path` keeps changing afterwards.",
        "Complexities: subsets are O(2^n) results, permutations O(n!) results, each costing O(n) to copy. Recursion depth is the stack space, O(n) here.",
        "Pruning (skipping a branch as soon as it can't succeed, like a sum already over target) is what makes backtracking fast enough in practice. To avoid duplicate results from repeated input values, sort first and skip `nums[i] === nums[i - 1]` at the same level.",
        "JavaScript has no tail-call optimisation in Node or Chrome, so very deep recursion (around 10,000+ frames) throws 'Maximum call stack size exceeded'. Convert to a loop with your own stack when depth can be large.",
      ],
      why: "Trees, graphs, divide-and-conquer and DP all build on recursion, and 'generate all X' questions are a common medium-level round.",
      analogy: "Exploring a maze: at each fork you pick a path, and if it dead-ends you walk back to the last fork and try the next path.",
      code: {
        lang: 'js',
        source: `// All subsets. O(n * 2^n) time.
function subsets(nums) {
  const result = [];
  const path = [];
  function backtrack(start) {
    result.push([...path]);            // every node of the tree is a subset
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);              // choose
      backtrack(i + 1);                // explore
      path.pop();                      // un-choose
    }
  }
  backtrack(0);
  return result;
}

// All permutations. O(n * n!) time.
function permute(nums) {
  const result = [];
  const used = new Array(nums.length).fill(false);
  const path = [];
  function backtrack() {
    if (path.length === nums.length) { result.push([...path]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true; path.push(nums[i]);
      backtrack();
      used[i] = false; path.pop();
    }
  }
  backtrack();
  return result;
}

console.log(JSON.stringify(subsets([1, 2, 3])));
console.log(permute([1, 2, 3]).map((p) => p.join('')).join(' '));`,
      },
      output: "Prints `[[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]` (8 subsets, 2^3), then `123 132 213 231 312 321` (6 permutations, 3!).",
      questions: [
        { q: 'What are the two parts every recursive function needs?', a: 'A base case that stops the recursion, and a recursive step that calls itself on a smaller input so it eventually reaches the base case. Missing either causes infinite recursion and a stack overflow.' },
        { q: 'What is backtracking?', a: 'A way to explore all candidate solutions by building them one choice at a time: choose, recurse, then undo the choice and try the next. It abandons a branch early when it can no longer lead to a valid answer.' },
        { q: 'Why push `[...path]` instead of `path`?', a: "`path` is one shared array that keeps being changed by later push and pop calls. Pushing it directly stores the same reference many times, and at the end they're all empty." },
        { q: 'How many subsets and permutations does a set of n items have?', a: '2^n subsets and n! permutations. So these solutions are exponential by nature; you can only prune, not make them polynomial.' },
        { q: 'How do you avoid a stack overflow in deep recursion?', a: 'Rewrite it iteratively with an explicit stack array, or reduce the depth. JavaScript engines do not do tail-call optimisation in practice, so deep recursion can throw a RangeError.' },
      ],
      answer30: "Recursion solves a problem by calling itself on a smaller input, with a base case to stop. Backtracking uses it to generate all candidates: I choose an option, recurse, then undo the choice and try the next. For subsets I record the path at every call; for permutations I record it when it has all n items and track used indexes. I always save a copy of the path, and I prune branches early. Subsets are 2^n and permutations n!, so these are inherently exponential.",
      mistakes: [
        'Saving `path` instead of a copy, ending up with a list of empty arrays.',
        'Forgetting to undo state (`pop`, `used[i] = false`) after the recursive call.',
        'No base case, or a step that does not shrink the problem, causing a stack overflow.',
        "Trap: 'The input has duplicates, how do you avoid duplicate subsets?' Sort first, then at the same level skip `i > start && nums[i] === nums[i - 1]`.",
      ],
      takeaway: 'Base case + smaller step; for backtracking: choose, explore, un-choose, and save copies.',
    },

    {
      id: 'trees',
      title: 'Binary trees: traversals, BFS/DFS, depth, LCA',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Most tree problems are a DFS (recursion) or a BFS (queue, level by level) with a small piece of logic at each node.',
      what: [
        "A binary tree is a set of nodes where each node has a value and up to two children, `left` and `right`. The top node is the root; nodes with no children are leaves.",
        "There are two ways to visit every node. Depth-first search (DFS) goes down one branch fully before the next, usually with recursion. Breadth-first search (BFS) visits level by level using a queue.",
      ],
      deeper: [
        "DFS orders: preorder (node, left, right) is good for copying or serialising a tree; inorder (left, node, right) gives sorted order for a binary search tree (BST); postorder (left, right, node) is for when a node needs its children's answers first, such as height or deleting a tree.",
        "Max depth is the classic postorder recursion: `1 + Math.max(depth(left), depth(right))`, with `0` for null.",
        "BFS level order: put the root in a queue; while it is not empty, take the current queue length as the level size, and process exactly that many nodes, adding their children. Used for level-order output, right-side view, and the minimum depth.",
        "Lowest common ancestor (LCA) in a general binary tree: recurse into both sides; if both return a node, the current node is the LCA; otherwise pass up whichever side found something. In a BST it's simpler: if both values are smaller go left, both bigger go right, otherwise you're at the split point.",
        "Time is O(n) for visiting every node. Space is O(h) for recursion, where h is the height: O(log n) if balanced, O(n) if the tree is a long chain.",
      ],
      why: "Trees are one of the most asked topics, and they model real things you work with: the DOM, JSON, file systems, org charts, comment threads.",
      analogy: "DFS is exploring a family tree by following one line of descendants all the way down before trying a sibling. BFS is a group photo taken one generation at a time.",
      code: {
        lang: 'js',
        source: `class TreeNode {
  constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; }
}
//        3
//       / \\
//      9   20
//     / \\  / \\
//    1  4 15  7
const root = new TreeNode(3,
  new TreeNode(9, new TreeNode(1), new TreeNode(4)),
  new TreeNode(20, new TreeNode(15), new TreeNode(7)));

// DFS traversals
const preorder = (n) => (n ? [n.val, ...preorder(n.left), ...preorder(n.right)] : []);
const inorder = (n) => (n ? [...inorder(n.left), n.val, ...inorder(n.right)] : []);

// Max depth (postorder). O(n) time, O(h) space.
const maxDepth = (n) => (n ? 1 + Math.max(maxDepth(n.left), maxDepth(n.right)) : 0);

// BFS level order. O(n) time, O(width) space.
function levelOrder(root) {
  if (!root) return [];
  const levels = [], queue = [root];
  while (queue.length) {
    const size = queue.length, level = [];
    for (let i = 0; i < size; i++) {
      const node = queue.shift(); // fine for interviews; use an index pointer for huge trees
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    levels.push(level);
  }
  return levels;
}

// Lowest common ancestor in any binary tree. O(n).
function lca(node, p, q) {
  if (!node || node.val === p || node.val === q) return node;
  const left = lca(node.left, p, q);
  const right = lca(node.right, p, q);
  if (left && right) return node; // p and q are on different sides
  return left || right;
}

console.log(preorder(root).join(' '), '|', inorder(root).join(' '));
console.log(maxDepth(root));
console.log(JSON.stringify(levelOrder(root)));
console.log(lca(root, 1, 4).val, lca(root, 1, 7).val, lca(root, 9, 4).val);`,
      },
      output: "Prints `3 9 1 4 20 15 7 | 1 9 4 3 15 20 7`, then `3`, then `[[3],[9,20],[1,4,15,7]]`, then `9 3 9`: the LCA of 1 and 4 is 9, of 1 and 7 is the root 3, and of 9 and its own child 4 is 9 itself.",
      questions: [
        { q: 'What is the difference between DFS and BFS on a tree?', a: 'DFS goes deep down one branch before backtracking, usually with recursion or a stack. BFS visits the tree level by level with a queue. BFS finds the shallowest node first; DFS uses less memory on wide trees.' },
        { q: 'How do you find the maximum depth of a binary tree?', a: 'Recursively: an empty node has depth 0, otherwise depth is 1 plus the larger of the left and right depths. O(n) time and O(h) stack space.' },
        { q: 'Which traversal gives sorted output for a BST?', a: 'Inorder (left, node, right), because every value in the left subtree is smaller and every value in the right subtree is bigger than the node.' },
        { q: 'How do you find the lowest common ancestor?', a: 'Recurse into both subtrees. If a node is p or q, return it. If both sides return something, the current node is the LCA; otherwise return the side that found something. For a BST, just walk down until p and q fall on different sides.' },
        { q: 'How do you print a tree level by level?', a: "BFS with a queue. At the start of each level, record the queue's length and process exactly that many nodes, pushing their children for the next level." },
      ],
      answer30: "Almost every tree problem is either DFS or BFS plus a little logic at each node. For DFS I write a recursive function with a null base case, and pick pre, in or postorder depending on whether the node needs its children's answers first; max depth is 1 plus the max of both sides. For level-by-level questions I use BFS with a queue and process one level's size at a time. Both are O(n) time; DFS uses O(height) stack space.",
      mistakes: [
        'Forgetting the null base case, which crashes on leaves.',
        'Assuming a binary tree is a BST and using the BST shortcut for LCA or search.',
        'Using `queue.shift()` on a huge tree; it is O(n) per call. Use a head index instead.',
        "Trap: 'Validate a BST.' Checking only `left < node < right` locally is wrong; pass down a min and max range for each subtree, or check that inorder is strictly increasing.",
      ],
      takeaway: 'DFS (recursion) for depth and path questions, BFS (queue) for level questions; both O(n).',
    },

    {
      id: 'graphs',
      title: 'Graphs: BFS, DFS, islands, topological sort',
      level: 'advanced',
      priority: 'must',
      frequency: 'common',
      summary: 'Represent the graph as an adjacency list, track visited nodes, and pick BFS for shortest steps, DFS for exploring, and topological sort for dependencies.',
      what: [
        "A graph is a set of nodes connected by edges. Unlike a tree, it can have cycles and nodes can have many parents. Edges can be directed (one-way, like 'A must happen before B') or undirected (two-way, like friendships).",
        "Store it as an adjacency list: a Map from each node to the list of its neighbours. Then BFS and DFS work like on trees, with one extra rule: keep a `visited` set so you never process a node twice and never loop forever.",
      ],
      deeper: [
        "BFS gives the shortest path in steps for an unweighted graph, because it explores everything 1 step away, then 2 steps, and so on. For weighted edges you need Dijkstra's algorithm (BFS with a min-heap).",
        "Grids are graphs in disguise: each cell is a node and its 4 neighbours are edges. Number of Islands: for each unvisited land cell, start a DFS/BFS that marks the whole island, and count how many times you started one.",
        "Topological sort orders the nodes of a directed acyclic graph (DAG) so every edge goes from earlier to later, like a valid order to take courses or run build steps. Kahn's algorithm: count incoming edges for each node, start a queue with the nodes that have none, and repeatedly remove a node and decrease its neighbours' counts. If you can't output every node, there is a cycle.",
        "Complexity for BFS, DFS and topological sort is O(V + E): every vertex and every edge is processed once.",
      ],
      why: "Graphs model dependencies, networks, maps and permissions. Islands and course schedule (topological sort) are two of the most common medium questions.",
      analogy: "A city map. BFS is ripples spreading from a dropped stone: everything 1 block away, then 2 blocks. DFS is walking one street as far as it goes before turning back. Topological sort is getting dressed: socks before shoes, any valid order works.",
      code: {
        lang: 'js',
        source: `// 1) Number of Islands (grid DFS). O(rows * cols).
function numIslands(grid) {
  const rows = grid.length, cols = grid[0].length;
  let count = 0;
  function sink(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] !== '1') return;
    grid[r][c] = '0'; // mark visited by sinking the land
    sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1);
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') { count++; sink(r, c); }
    }
  }
  return count;
}

// 2) Shortest path length (edges) in an unweighted graph with BFS. O(V + E).
function shortestPath(graph, start, goal) {
  const queue = [[start, 0]];
  const visited = new Set([start]);
  for (let i = 0; i < queue.length; i++) {   // index pointer instead of shift()
    const [node, dist] = queue[i];
    if (node === goal) return dist;
    for (const next of graph[node] || []) {
      if (!visited.has(next)) { visited.add(next); queue.push([next, dist + 1]); }
    }
  }
  return -1;
}

// 3) Topological sort (Kahn's algorithm). Returns null if there is a cycle.
function topoSort(numNodes, edges) {
  const adj = Array.from({ length: numNodes }, () => []);
  const indegree = new Array(numNodes).fill(0);
  for (const [from, to] of edges) { adj[from].push(to); indegree[to]++; }
  const queue = [];
  indegree.forEach((d, node) => { if (d === 0) queue.push(node); });
  const order = [];
  for (let i = 0; i < queue.length; i++) {
    const node = queue[i];
    order.push(node);
    for (const next of adj[node]) if (--indegree[next] === 0) queue.push(next);
  }
  return order.length === numNodes ? order : null;
}

console.log(numIslands([
  ['1', '1', '0', '0'],
  ['1', '0', '0', '1'],
  ['0', '0', '1', '1'],
  ['0', '0', '0', '0'],
]));
const graph = { A: ['B', 'C'], B: ['D'], C: ['D', 'E'], D: ['F'], E: ['F'], F: [] };
console.log(shortestPath(graph, 'A', 'F'), shortestPath(graph, 'F', 'A'));
console.log(topoSort(4, [[0, 1], [0, 2], [1, 3], [2, 3]]), topoSort(2, [[0, 1], [1, 0]]));`,
      },
      output: "Prints `2` (one island top-left, one on the right), then `3 -1` (A to F takes 3 edges; F has no way back to A because edges are one-way), then `[ 0, 1, 2, 3 ] null` (the second graph is a cycle, so no valid order exists).",
      questions: [
        { q: 'How do you represent a graph in code?', a: 'Usually an adjacency list: a Map or object from each node to an array of its neighbours. It uses O(V + E) space. An adjacency matrix (V by V) is only worth it for dense graphs or when you need O(1) edge checks.' },
        { q: 'When do you use BFS instead of DFS?', a: 'BFS when you need the shortest path in steps in an unweighted graph, or anything level by level. DFS for exploring everything reachable, counting components, detecting cycles, and backtracking.' },
        { q: 'How do you count islands in a grid?', a: 'Loop over every cell. When you find unvisited land, increase the count and run a DFS or BFS that marks every connected land cell as visited. O(rows * cols) time.' },
        { q: 'What is topological sort, and how do you detect a cycle with it?', a: "An ordering of a directed graph's nodes where every edge points forward, like a valid course order. With Kahn's algorithm you repeatedly remove nodes with no incoming edges; if some nodes are never removed, there is a cycle." },
        { q: 'Why do graph traversals need a visited set when tree traversals do not?', a: 'Graphs can have cycles and multiple paths to the same node. Without a visited set you would process nodes many times or loop forever.' },
      ],
      answer30: "I model the graph as an adjacency list and always keep a visited set. BFS with a queue gives the shortest path in an unweighted graph; DFS is simpler for exploring and counting connected components, like islands in a grid. For dependencies I use topological sort with Kahn's algorithm: start from nodes with no incoming edges and peel them off; if not every node gets output, there's a cycle. All of these are O(V + E).",
      mistakes: [
        'Marking a node visited when you pop it instead of when you push it in BFS, which lets the same node enter the queue many times.',
        'Forgetting to check grid bounds before reading a cell.',
        'Using BFS for shortest path on weighted edges; that needs Dijkstra.',
        "Trap: 'Is recursion safe for a 1000 x 1000 grid?' A single huge island can make DFS a million calls deep and overflow the stack; use BFS or an explicit stack.",
      ],
      takeaway: 'Adjacency list + visited set; BFS for shortest steps, DFS for exploring, Kahn for dependency order.',
      note: "On your resume: the Octagnt orchestrator runs configurable multi-step pipelines across AI agents. If asked how you would order steps that depend on each other, topological sort is the textbook answer. Only describe it as your actual implementation if it really was.",
    },

    {
      id: 'heaps-top-k',
      title: 'Heaps and priority queues (Top-K)',
      level: 'advanced',
      priority: 'good',
      frequency: 'common',
      summary: 'A heap gives the smallest (or largest) item in O(1) and adds or removes in O(log n); a size-k heap solves Top-K in O(n log k).',
      what: [
        "A heap is a tree-shaped structure, stored in a plain array, that always keeps the smallest item (min-heap) or largest item (max-heap) at the top. Adding an item or removing the top costs O(log n). Looking at the top is O(1).",
        "A priority queue is the idea of 'always give me the most important item next'; a heap is how it's built. JavaScript has no built-in heap, so in interviews you either write a small one or say you would use a library and explain how it works.",
      ],
      deeper: [
        "Array layout: for the item at index i, its parent is at `Math.floor((i - 1) / 2)` and its children at `2i + 1` and `2i + 2`. Push: add at the end and 'bubble up' while smaller than the parent. Pop: take the root, move the last item to the root, and 'sink down' by swapping with the smaller child.",
        "Top-K largest: keep a min-heap of size k. For each item push it, and if the heap grows past k, pop the smallest. What remains is the k largest, and the top is the kth largest. O(n log k) time, O(k) space, which beats sorting (O(n log n)) when k is small and works on streams.",
        "Other heap problems: merge k sorted lists (heap of list heads), find the median of a stream (a max-heap for the lower half and a min-heap for the upper half), task scheduling, and Dijkstra's shortest path.",
        "Alternatives worth mentioning: for Top K Frequent, bucket sort by frequency gives O(n); Quickselect finds the kth largest in average O(n).",
      ],
      why: "Any 'top k', 'kth largest', 'merge k sorted' or 'next most urgent job' question is a heap question, and building one by hand shows real understanding of trees in arrays.",
      analogy: "A hospital emergency room. Patients don't wait in arrival order; the most urgent case is always seen next, and a new arrival is slotted in by urgency without re-sorting the whole waiting room.",
      code: {
        lang: 'js',
        source: `class MinHeap {
  constructor(compare = (a, b) => a - b) { this.data = []; this.compare = compare; }
  size() { return this.data.length; }
  peek() { return this.data[0]; }
  push(val) {
    const d = this.data;
    d.push(val);
    let i = d.length - 1;
    while (i > 0) {                              // bubble up
      const parent = Math.floor((i - 1) / 2);
      if (this.compare(d[i], d[parent]) >= 0) break;
      [d[i], d[parent]] = [d[parent], d[i]];
      i = parent;
    }
  }
  pop() {
    const d = this.data;
    const top = d[0];
    const last = d.pop();
    if (d.length) {
      d[0] = last;
      let i = 0;
      while (true) {                             // sink down
        const l = 2 * i + 1, r = 2 * i + 2;
        let smallest = i;
        if (l < d.length && this.compare(d[l], d[smallest]) < 0) smallest = l;
        if (r < d.length && this.compare(d[r], d[smallest]) < 0) smallest = r;
        if (smallest === i) break;
        [d[i], d[smallest]] = [d[smallest], d[i]];
        i = smallest;
      }
    }
    return top;
  }
}

// Kth largest: min-heap of size k. O(n log k).
function kthLargest(nums, k) {
  const heap = new MinHeap();
  for (const n of nums) {
    heap.push(n);
    if (heap.size() > k) heap.pop(); // drop the smallest
  }
  return heap.peek();
}

// Top K frequent elements: count, then a size-k heap ordered by count.
function topKFrequent(nums, k) {
  const count = new Map();
  for (const n of nums) count.set(n, (count.get(n) || 0) + 1);
  const heap = new MinHeap((a, b) => a[1] - b[1]); // [value, count]
  for (const entry of count) {
    heap.push(entry);
    if (heap.size() > k) heap.pop();
  }
  const out = [];
  while (heap.size()) out.push(heap.pop()[0]);
  return out.reverse(); // most frequent first
}

const h = new MinHeap();
[5, 3, 8, 1, 9, 2].forEach((x) => h.push(x));
const sorted = [];
while (h.size()) sorted.push(h.pop());
console.log(sorted.join(' '));
console.log(kthLargest([3, 2, 1, 5, 6, 4], 2));
console.log(topKFrequent([1, 1, 1, 2, 2, 3, 4, 4, 4, 4], 2));`,
      },
      output: "Prints `1 2 3 5 8 9` (popping a min-heap repeatedly gives sorted order, which is heap sort), then `5` (the 2nd largest of 1 to 6), then `[ 4, 1 ]` (4 appears four times, 1 three times).",
      questions: [
        { q: 'What is a heap and what are its operation costs?', a: 'A complete binary tree stored in an array where every parent is smaller (min-heap) or larger (max-heap) than its children. Peek is O(1); push and pop are O(log n); building one from n items is O(n).' },
        { q: 'How do you find the kth largest element efficiently?', a: 'Keep a min-heap of size k: push each number and pop when the size exceeds k. The top is the kth largest. O(n log k) time and O(k) space. Quickselect is average O(n) but O(n^2) worst case.' },
        { q: 'Why a min-heap for the k largest, not a max-heap?', a: 'The min-heap holds the current k best, with the weakest of them on top. Each new number only has to beat that weakest one, so you evict it in O(log k). A max-heap of everything would need O(n) space.' },
        { q: 'How do you find the parent and children of index i in an array heap?', a: 'Parent is `Math.floor((i - 1) / 2)`, left child is `2i + 1`, right child is `2i + 2`.' },
        { q: 'How would you find the running median of a stream?', a: 'Keep two heaps: a max-heap with the smaller half and a min-heap with the larger half, balanced so their sizes differ by at most one. The median is the top of the bigger heap, or the average of both tops.' },
      ],
      answer30: "A heap keeps the min or max at the top with O(1) peek and O(log n) push and pop, stored in an array where children of i are 2i+1 and 2i+2. JavaScript has no built-in, so I can write one: push bubbles up, pop moves the last item to the root and sinks it down. For Top-K I keep a min-heap of size k and pop whenever it grows past k, giving O(n log k), which beats sorting when k is small and works on a stream.",
      mistakes: [
        'Sorting the whole array for Top-K when k is small; O(n log n) instead of O(n log k).',
        'Forgetting that a JavaScript `sort()` without a comparator sorts numbers as strings.',
        'Popping from an empty heap or forgetting the `d.length` check after removing the last item.',
        "Trap: 'Isn't a sorted array a priority queue?' Peek is O(1), but inserting into the right spot is O(n). A heap makes both insert and remove O(log n).",
      ],
      takeaway: "Top-K, kth largest, merge k sorted, or 'next most urgent': reach for a heap.",
    },

    {
      id: 'dynamic-programming',
      title: 'Dynamic programming intro (stairs, robber, LIS, LCS)',
      level: 'advanced',
      priority: 'must',
      frequency: 'common',
      summary: 'Break a problem into overlapping subproblems, solve each once, and store the answers.',
      what: [
        "Dynamic programming (DP) is for problems where the same smaller question gets asked again and again. Instead of recomputing it, you save each answer and reuse it.",
        "The recipe: (1) define the state, what `dp[i]` means in words. (2) Write the recurrence, how `dp[i]` is built from smaller answers. (3) Set the base cases. (4) Decide the order to fill the table, and where the final answer lives.",
      ],
      deeper: [
        "Top-down (memoization) is the recursive solution plus a cache. Bottom-up (tabulation) fills an array from the base cases upwards with no recursion. Both give the same complexity; bottom-up avoids stack overflow and often lets you keep only the last one or two values (O(1) space).",
        "Signals that it's DP: 'count the number of ways', 'minimum/maximum cost', 'longest/shortest subsequence', 'can you reach / is it possible', and a brute-force recursion that makes choices and repeats work.",
        "Climbing Stairs: `ways(n) = ways(n - 1) + ways(n - 2)`, the Fibonacci pattern. House Robber: at each house either skip it or rob it plus the best from two houses back: `dp[i] = max(dp[i - 1], dp[i - 2] + nums[i])`.",
        "Longest Increasing Subsequence (LIS): `dp[i]` = longest increasing subsequence ending at i, `dp[i] = 1 + max(dp[j])` for every `j < i` with a smaller value. O(n^2); an O(n log n) version keeps the smallest tail for each length and binary searches it.",
        "Longest Common Subsequence (LCS) of two strings: a 2D table where `dp[i][j]` is the LCS of the first i chars of a and first j chars of b. If the characters match, `1 + dp[i-1][j-1]`; otherwise `max(dp[i-1][j], dp[i][j-1])`. O(m * n). The same 2D table shape solves edit distance.",
      ],
      why: "DP questions turn exponential brute force into polynomial time. They're the hardest common category, and interviewers mostly care whether you can define the state and recurrence out loud.",
      analogy: "Climbing a staircase and writing on each step how many ways there are to reach it. To fill in a new step you just add the numbers on the two steps below, instead of recounting every route from the bottom.",
      code: {
        lang: 'js',
        source: `// Climbing Stairs: 1 or 2 steps at a time. O(n) time, O(1) space.
function climbStairs(n) {
  let a = 1, b = 1; // ways to reach step 0 and step 1
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
  return b;
}

// Same thing top-down with memoization, to show the other style.
function climbMemo(n, memo = new Map()) {
  if (n <= 1) return 1;
  if (memo.has(n)) return memo.get(n);
  const ways = climbMemo(n - 1, memo) + climbMemo(n - 2, memo);
  memo.set(n, ways);
  return ways;
}

// House Robber: no two adjacent houses. O(n) time, O(1) space.
function rob(nums) {
  let prev2 = 0, prev1 = 0; // best up to i-2, best up to i-1
  for (const money of nums) {
    const best = Math.max(prev1, prev2 + money); // skip it, or rob it
    prev2 = prev1;
    prev1 = best;
  }
  return prev1;
}

// Longest Increasing Subsequence. O(n^2).
function lengthOfLIS(nums) {
  const dp = new Array(nums.length).fill(1); // LIS ending at i
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    }
  }
  return Math.max(...dp);
}

// Longest Common Subsequence. O(m * n) time and space.
function lcs(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

console.log(climbStairs(5), climbMemo(5), climbStairs(45));
console.log(rob([2, 7, 9, 3, 1]));
console.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]));
console.log(lcs('abcde', 'ace'), lcs('abc', 'def'));`,
      },
      output: "Prints `8 8 1836311903` (both styles agree; 45 stairs is instant with DP but would take billions of calls with plain recursion), then `12` (rob 2 + 9 + 1), then `4` (for example 2, 3, 7, 101), then `3 0` ('ace' is common to both; 'abc' and 'def' share nothing).",
      questions: [
        { q: 'What is dynamic programming?', a: 'Solving a problem by combining answers to overlapping smaller subproblems, computing each subproblem only once and storing it. It applies when the problem has optimal substructure and repeated subproblems.' },
        { q: 'What is the difference between memoization and tabulation?', a: 'Memoization is top-down: the natural recursion plus a cache. Tabulation is bottom-up: fill a table from the base cases in a loop. Same complexity; tabulation avoids deep recursion and often allows space optimisation.' },
        { q: 'What is the recurrence for House Robber?', a: '`dp[i] = max(dp[i - 1], dp[i - 2] + nums[i])`: either skip house i and keep the best so far, or rob it and add the best from two houses back. Only two previous values are needed, so space is O(1).' },
        { q: 'How do you solve Longest Common Subsequence?', a: 'A 2D table where `dp[i][j]` is the LCS of the first i characters of one string and first j of the other. If the characters match, take the diagonal plus 1; otherwise take the max of the cell above and the cell to the left. O(m * n).' },
        { q: 'How do you recognise a DP problem?', a: "The question asks for a count of ways, a min or max, a longest or shortest, or whether something is possible, and a brute-force recursion would solve the same subproblem many times." },
      ],
      answer30: "Dynamic programming is recursion with memory: when subproblems overlap, I solve each once and store it. I start by saying what dp[i] means in words, then write the recurrence and base cases. For example, House Robber is dp[i] = max of skipping house i or robbing it plus dp[i - 2]. I usually go bottom-up with a loop, then shrink the table to a couple of variables when only the last few values matter. LCS and edit distance use the same idea with a 2D table.",
      mistakes: [
        'Jumping to code before stating what `dp[i]` means; the recurrence then comes out wrong.',
        'Wrong base cases or an off-by-one table size (LCS needs `length + 1` rows and columns).',
        'Plain recursion without a memo, which is exponential (Fibonacci-style trees).',
        "Trap: 'Can you return the actual subsequence, not just its length?' Keep the table and walk back from the final cell, following the choice that produced each value.",
      ],
      takeaway: 'Define the state in words, write the recurrence and base cases, then fill the table bottom-up.',
    },

    {
      id: 'intervals',
      title: 'Intervals (merge, meeting rooms)',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Sort intervals by start time, then sweep once, merging any that overlap.',
      what: [
        "Interval problems give you ranges like `[start, end]`: meetings, bookings, time slots. Almost all of them start the same way: sort by start time. After sorting, any interval that overlaps the current one must come right after it.",
        "Two intervals `[a, b]` and `[c, d]` (sorted so `a <= c`) overlap when `c <= b`. Merging them gives `[a, Math.max(b, d)]`.",
      ],
      deeper: [
        "Merge Intervals: sort, then for each interval either extend the last merged one (if it overlaps) or start a new one. O(n log n) for the sort, O(n) for the sweep.",
        "Meeting Rooms (can one person attend all?): sort and check whether any meeting starts before the previous one ends. Meeting Rooms II (how many rooms?): sort start times and end times separately and sweep with two pointers, or use a min-heap of end times.",
        "Decide early whether touching intervals like `[1, 2]` and `[2, 3]` count as overlapping. For merging, usually yes; for meetings, a meeting ending at 2 frees the room for one starting at 2. Ask the interviewer.",
      ],
      why: "Calendars, booking systems, rate-limit windows and log time ranges are all interval problems, and Merge Intervals is one of the most frequently asked medium questions.",
      analogy: "Laying strips of tape on a ruler. Sort them by where they start, then lay each one down; if it starts before the last strip ends, it just extends that strip.",
      code: {
        lang: 'js',
        source: `// Merge overlapping intervals. O(n log n) time, O(n) output.
function merge(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const result = [];
  for (const [start, end] of sorted) {
    const last = result[result.length - 1];
    if (last && start <= last[1]) last[1] = Math.max(last[1], end); // overlap: extend
    else result.push([start, end]);                                // gap: new interval
  }
  return result;
}

// Minimum meeting rooms: sweep sorted starts and ends. O(n log n).
function minMeetingRooms(meetings) {
  const starts = meetings.map((m) => m[0]).sort((a, b) => a - b);
  const ends = meetings.map((m) => m[1]).sort((a, b) => a - b);
  let rooms = 0, maxRooms = 0, e = 0;
  for (const s of starts) {
    if (s >= ends[e]) e++;      // a meeting ended, reuse its room
    else rooms++;               // need a new room
    maxRooms = Math.max(maxRooms, rooms);
  }
  return maxRooms;
}

console.log(JSON.stringify(merge([[1, 3], [8, 10], [2, 6], [15, 18], [17, 20]])));
console.log(JSON.stringify(merge([[1, 4], [4, 5]])));
console.log(minMeetingRooms([[0, 30], [5, 10], [15, 20]]), minMeetingRooms([[1, 5], [5, 9]]));`,
      },
      output: "Prints `[[1,6],[8,10],[15,20]]` (the input was unsorted; [1,3] and [2,6] merge, and so do [15,18] and [17,20]), then `[[1,5]]` (touching intervals merge), then `2 1` (the second pair can share one room because one meeting ends exactly as the next starts).",
      questions: [
        { q: 'How do you merge overlapping intervals?', a: 'Sort by start time, then walk through them: if an interval starts at or before the end of the last merged one, extend that end with `Math.max`; otherwise push it as a new interval. O(n log n) because of the sort.' },
        { q: 'When do two intervals overlap?', a: 'After sorting so a starts first, `[a1, a2]` and `[b1, b2]` overlap when `b1 <= a2` (or `<` if touching does not count). In general, two intervals overlap when `a1 <= b2 && b1 <= a2`.' },
        { q: 'How many meeting rooms do you need?', a: 'Sort start times and end times separately. Walk through starts; if a start is at or after the earliest unfinished end, reuse that room and move the end pointer, otherwise add a room. The peak count is the answer. A min-heap of end times works too.' },
        { q: 'Why `Math.max` when merging, instead of just taking the new end?', a: 'The new interval can sit fully inside the last one, like [1, 10] and [2, 3]. Taking 3 would wrongly shrink the merged interval.' },
      ],
      answer30: "For interval problems I sort by start time first, because then any overlap must be with the interval just before. To merge, I keep a result list and either extend the last interval's end with Math.max or push a new one. That's O(n log n) for the sort plus one pass. For meeting rooms I sort starts and ends separately and sweep, reusing a room whenever a meeting has already ended. I always confirm whether touching intervals count as overlapping.",
      mistakes: [
        'Forgetting to sort first, or sorting with the default string comparison.',
        'Using the new end instead of `Math.max(lastEnd, end)` when one interval contains another.',
        'Mutating the caller\'s input array by sorting it in place.',
        "Trap: 'Insert a new interval into an already sorted, non-overlapping list in O(n)?' Add everything that ends before it, merge everything that overlaps it, then add the rest; no sort needed.",
      ],
      takeaway: 'Sort by start, then one sweep: overlap means extend with max, otherwise start a new interval.',
    },

    {
      id: 'strings',
      title: 'String problems (palindromes, longest substring, anagrams)',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Most string problems reuse two pointers, sliding windows and character counts.',
      what: [
        "Strings are arrays of characters, so the same patterns apply. Palindromes use two pointers from both ends. 'Longest substring with some rule' uses a sliding window. Anagrams and 'same letters' use a character count.",
        "Strings in JavaScript are immutable: every `+=` creates a new string. When building a big result in a loop, push pieces into an array and `join('')` at the end.",
      ],
      deeper: [
        "Valid Palindrome: skip non-alphanumeric characters and compare lowercase letters from both ends. O(n) time, O(1) space.",
        "Longest Substring Without Repeating Characters: sliding window with a Map from character to its last index. When you see a repeat inside the window, jump `left` to just past the previous occurrence. O(n).",
        "Longest Palindromic Substring: expand around each centre (each character, and each gap between two characters, for even lengths). O(n^2) time, O(1) space; simpler than the DP table and fine for interviews.",
        "Watch out for Unicode: `str.length` and `str[i]` work in UTF-16 code units, so an emoji counts as 2. `[...str]` splits by code point, which is usually what you want.",
      ],
      why: "String questions are the most common warm-up problems, and they test whether you can apply the core patterns to a slightly different shape of input.",
      analogy: "Checking a palindrome is like two people reading a word, one from each end, walking towards each other and comparing letters until they meet.",
      code: {
        lang: 'js',
        source: `// Valid Palindrome (ignore case and non-alphanumerics). O(n), O(1) space.
function isPalindrome(s) {
  const ok = (ch) => /[a-z0-9]/i.test(ch);
  let l = 0, r = s.length - 1;
  while (l < r) {
    if (!ok(s[l])) { l++; continue; }
    if (!ok(s[r])) { r--; continue; }
    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;
    l++; r--;
  }
  return true;
}

// Longest substring without repeating characters. O(n) time.
function lengthOfLongestSubstring(s) {
  const lastSeen = new Map(); // char -> last index
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (lastSeen.has(ch) && lastSeen.get(ch) >= left) left = lastSeen.get(ch) + 1;
    lastSeen.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}

// Longest palindromic substring: expand around every centre. O(n^2) time.
function longestPalindrome(s) {
  let start = 0, maxLen = 0;
  const expand = (l, r) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
    if (r - l - 1 > maxLen) { maxLen = r - l - 1; start = l + 1; }
  };
  for (let i = 0; i < s.length; i++) { expand(i, i); expand(i, i + 1); }
  return s.slice(start, start + maxLen);
}

// Valid Anagram with one count map. O(n).
function isAnagram(a, b) {
  if (a.length !== b.length) return false;
  const count = new Map();
  for (const ch of a) count.set(ch, (count.get(ch) || 0) + 1);
  for (const ch of b) {
    if (!count.get(ch)) return false;
    count.set(ch, count.get(ch) - 1);
  }
  return true;
}

console.log(isPalindrome('A man, a plan, a canal: Panama'), isPalindrome('race a car'));
console.log(lengthOfLongestSubstring('abcabcbb'), lengthOfLongestSubstring('pwwkew'), lengthOfLongestSubstring(''));
console.log(longestPalindrome('babad'), longestPalindrome('cbbd'));
console.log(isAnagram('listen', 'silent'), isAnagram('rat', 'car'));`,
      },
      output: "Prints `true false`, then `3 3 0` ('abc' and 'wke'), then `bab bb` ('aba' is equally long, but 'bab' is found first), then `true false`.",
      questions: [
        { q: 'How do you check if a string is a palindrome, ignoring punctuation and case?', a: 'Two pointers from both ends. Skip characters that are not letters or digits, compare the rest in lowercase, and move inward. O(n) time, O(1) space, with no need to build a cleaned copy.' },
        { q: 'How do you find the longest substring without repeating characters?', a: 'Sliding window with a Map of each character to its last index. When the current character was seen inside the window, move the left edge to just after that last position. Track the max window size. O(n).' },
        { q: 'How do you find the longest palindromic substring?', a: 'Expand around each centre: every character (odd length) and every gap between two characters (even length). Keep the longest expansion. O(n^2) time and O(1) space.' },
        { q: 'How do you check if two strings are anagrams?', a: 'If the lengths differ, they are not. Otherwise count characters of the first with a Map and decrement for the second; any missing or zero count means no. O(n). Sorting both and comparing is O(n log n).' },
        { q: 'Why is `s += x` in a loop potentially slow?', a: 'Strings are immutable, so in principle each `+=` copies the string. Engines optimise this a lot, but collecting parts in an array and calling `join` at the end is the safe, clearly linear way.' },
      ],
      answer30: "String problems map onto the core patterns. Palindromes are two pointers from both ends, skipping non-alphanumeric characters. Longest substring without repeats is a sliding window with a map of last-seen indexes, jumping the left edge past a repeat, so O(n). Anagrams are a character count. For the longest palindromic substring I expand around each centre, both odd and even, for O(n^2) time and O(1) space.",
      mistakes: [
        'Forgetting even-length palindromes when expanding around centres.',
        "In the longest-substring window, moving `left` backwards because the repeated character's last index is before the window; check `>= left`.",
        'Using `split(\'\')` on text with emoji, which breaks surrogate pairs; use `[...str]`.',
        "Trap: 'Is `s.split('').reverse().join('') === s` fine for a palindrome check?' It works but uses O(n) extra space and ignores the cleaning rules; the two-pointer version is what they want.",
      ],
      takeaway: 'Strings are arrays: two pointers for palindromes, sliding window for substrings, counts for anagrams.',
    },

    {
      id: 'greedy',
      title: 'Greedy algorithms (stock, jump game, max subarray)',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Make the best local choice at each step and never go back; works only when you can argue local best leads to global best.',
      what: [
        "A greedy algorithm makes the choice that looks best right now and never reconsiders it. It is usually one pass with a variable or two, so it is fast and short.",
        "The catch: greedy is only correct for some problems. For coin change with coins [1, 3, 4] and amount 6, greedily taking 4 first gives 4 + 1 + 1 (3 coins), but 3 + 3 (2 coins) is better. That problem needs DP.",
      ],
      deeper: [
        "Best Time to Buy and Sell Stock (one trade): track the lowest price so far; at each day the best profit is today's price minus that minimum. O(n), O(1).",
        "Jump Game: track the furthest index you can reach. If the current index is ever beyond it, you're stuck. O(n).",
        "Maximum Subarray (Kadane's algorithm): at each number, either extend the current subarray or start fresh from this number, whichever is bigger: `cur = max(n, cur + n)`. It's often called greedy, and it's also the simplest DP.",
        "Interval scheduling (most non-overlapping meetings) is greedy too: sort by end time and always take the meeting that finishes first.",
        "To justify greedy in an interview, give an exchange argument: 'if an optimal answer made a different choice here, swapping in my choice is never worse'. If you can't argue it, try a counterexample, then fall back to DP.",
      ],
      why: "Greedy solutions are the shortest correct answers to many common questions, and interviewers like to ask 'why is greedy correct here?' or show a case where it fails.",
      analogy: "Walking downhill in fog by always stepping in the steepest downward direction. On a smooth hill you reach the bottom; on a bumpy landscape you can get stuck in a small dip. Greedy is only safe when the landscape has no traps.",
      code: {
        lang: 'js',
        source: `// Best Time to Buy and Sell Stock (one buy, one sell). O(n), O(1).
function maxProfit(prices) {
  let minPrice = Infinity, best = 0;
  for (const p of prices) {
    minPrice = Math.min(minPrice, p);     // cheapest day to have bought so far
    best = Math.max(best, p - minPrice);  // sell today?
  }
  return best;
}

// Jump Game: nums[i] = max jump length from i. Can we reach the end? O(n).
function canJump(nums) {
  let reach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > reach) return false;          // this index is unreachable
    reach = Math.max(reach, i + nums[i]);
  }
  return true;
}

// Maximum Subarray sum (Kadane). O(n), O(1).
function maxSubArray(nums) {
  let cur = nums[0], best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]); // extend, or start fresh here
    best = Math.max(best, cur);
  }
  return best;
}

// Where greedy fails: coin change with coins [1, 3, 4].
function greedyCoins(coins, amount) {
  let count = 0;
  for (const c of [...coins].sort((a, b) => b - a)) {
    count += Math.floor(amount / c);
    amount %= c;
  }
  return count;
}

console.log(maxProfit([7, 1, 5, 3, 6, 4]), maxProfit([7, 6, 4, 3, 1]));
console.log(canJump([2, 3, 1, 1, 4]), canJump([3, 2, 1, 0, 4]));
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]), maxSubArray([-3, -1, -2]));
console.log(greedyCoins([1, 3, 4], 6));`,
      },
      output: "Prints `5 0` (buy at 1, sell at 6; prices only fall in the second case), then `true false` (the second gets stuck at the 0), then `6 -1` (the subarray 4, -1, 2, 1; with all negatives the answer is the largest single number), then `3`: greedy picks 4 + 1 + 1, although 3 + 3 needs only 2 coins.",
      questions: [
        { q: 'What is a greedy algorithm?', a: 'One that makes the locally best choice at each step and never reconsiders it. It is correct only when you can show that local best choices always build a globally best answer.' },
        { q: 'How do you find the best time to buy and sell a stock once?', a: 'One pass: keep the minimum price seen so far and, at each day, update the best profit with today minus that minimum. O(n) time, O(1) space.' },
        { q: "What is Kadane's algorithm?", a: 'It finds the maximum subarray sum in O(n): at each element, the best subarray ending here is either the element alone or the element added to the best subarray ending just before. Track the overall max.' },
        { q: 'Give an example where greedy fails.', a: 'Coin change with coins [1, 3, 4] and amount 6. Greedy takes the biggest coin first, 4 + 1 + 1 = 3 coins, but 3 + 3 = 2 coins. That problem needs dynamic programming.' },
        { q: 'How would you prove a greedy choice is correct?', a: 'With an exchange argument: take any optimal solution, and show you can swap its choice for the greedy one without making it worse. Repeating that turns the optimal solution into the greedy one.' },
      ],
      answer30: "Greedy means taking the best local choice at each step without backtracking, which gives short O(n) solutions. For one stock trade I track the minimum price so far and the best profit; for Jump Game I track the furthest reachable index; Kadane's algorithm decides at each element whether to extend the current subarray or restart. The risk is that greedy is often wrong, like coin change with coins 1, 3 and 4, so I either justify it with an exchange argument or switch to DP.",
      mistakes: [
        'Assuming greedy works without checking a counterexample.',
        'Initialising Kadane with `0` instead of the first element, which gives 0 for an all-negative array.',
        'For the stock problem, using the overall minimum and maximum, even when the max comes before the min.',
        "Trap: 'Multiple buys and sells allowed?' Then just add every positive day-to-day increase. Still greedy, still O(n).",
      ],
      takeaway: 'Greedy is fast and simple but must be justified; when a counterexample exists, use DP.',
    },

    {
      id: 'lru-cache',
      title: 'LRU cache with Map',
      level: 'advanced',
      priority: 'must',
      frequency: 'common',
      summary: 'A fixed-size cache that evicts the least recently used item; in JavaScript a Map gives O(1) get and put because it keeps insertion order.',
      what: [
        "An LRU (least recently used) cache holds a fixed number of items. When it's full and a new item arrives, it throws out the item that hasn't been used for the longest time. Both `get` and `put` must be O(1).",
        "In JavaScript, a `Map` remembers the order keys were inserted. If you delete a key and set it again on every use, the most recently used keys move to the end, and the least recently used key is always the first one.",
      ],
      deeper: [
        "`get(key)`: if missing return -1; otherwise read the value, `delete` the key and `set` it again (moves it to the end), and return the value.",
        "`put(key, value)`: delete the key if present, set it, and if the size is over capacity, remove the first key: `map.keys().next().value`. All operations are O(1).",
        "The language-neutral answer (what a Java or C++ interviewer expects) is a hash map plus a doubly linked list. The map finds a node in O(1); the list keeps usage order, with the most recent at the head and eviction from the tail. Moving or removing a node is O(1) because each node knows its neighbours. Mention it even if you code the Map version.",
        "Real-world notes: Redis can evict with an approximate LRU policy (`allkeys-lru`), and libraries like `lru-cache` on npm add TTLs and size limits. An LFU cache (least frequently used) is the harder follow-up.",
      ],
      why: "It's one of the most asked design-a-data-structure questions because it combines hashing, ordering and O(1) constraints, and it mirrors real caching decisions.",
      analogy: "A small desk with room for three books. Every time you use a book you put it on top of the pile. When you need space, the book at the bottom of the pile, the one you haven't touched in longest, goes back to the shelf.",
      code: {
        lang: 'js',
        source: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map(); // keeps insertion order: oldest first
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const value = this.map.get(key);
    this.map.delete(key);      // move to the "most recent" end
    this.map.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.capacity) {
      const oldest = this.map.keys().next().value; // first key = least recently used
      this.map.delete(oldest);
    }
  }
}

const cache = new LRUCache(2);
cache.put(1, 'one');
cache.put(2, 'two');
console.log(cache.get(1));   // touching 1 makes 2 the least recently used
cache.put(3, 'three');       // evicts 2
console.log(cache.get(2));
cache.put(4, 'four');        // evicts 1
console.log(cache.get(1), cache.get(3), cache.get(4));
console.log([...cache.map.keys()]);`,
      },
      output: "Prints `one`, then `-1` (key 2 was evicted), then `-1 three four` (key 1 was evicted when 4 arrived), then `[ 3, 4 ]`: reading 3 and then 4 left 4 as the most recent.",
      questions: [
        { q: 'How do you implement an LRU cache with O(1) get and put?', a: 'In JavaScript, use a Map: on every access delete and re-set the key so it moves to the end, and on overflow delete the first key from `map.keys()`. In general, a hash map plus a doubly linked list, where the map finds nodes and the list keeps recency order.' },
        { q: 'Why does a Map work for LRU in JavaScript?', a: 'A Map iterates keys in insertion order, and delete plus set moves a key to the end. So the first key is always the least recently used, and reading it with `keys().next()` is O(1).' },
        { q: 'Why a doubly linked list in the classic design, not a singly linked one?', a: 'To remove a node from the middle in O(1) you need its previous node. Each node in a doubly linked list has a `prev` pointer, so unlinking is constant time.' },
        { q: 'What is the difference between LRU and LFU?', a: 'LRU evicts the item not used for the longest time. LFU evicts the item used the fewest times. LFU protects popular items better but is harder to build in O(1).' },
        { q: 'Does `get` count as a use in an LRU cache?', a: 'Yes. Both reading and writing a key make it the most recently used, which is why `get` has to move the key to the end.' },
      ],
      answer30: "An LRU cache has a fixed capacity and evicts the least recently used key. In JavaScript I build it on a Map because a Map keeps insertion order: get deletes and re-sets the key so it becomes the newest, and put does the same and, if the size goes over capacity, deletes the first key from map.keys(). Everything is O(1). The language-neutral design is a hash map plus a doubly linked list, which I'd describe if asked.",
      mistakes: [
        "Forgetting to refresh the key's position on `get`.",
        'Evicting before inserting, which can evict the key you are updating.',
        'Using an array for ordering, which makes moving or removing items O(n).',
        "Trap: 'Is `map.keys().next()` really O(1)?' Yes, it just returns the first entry of the iterator; it doesn't build a list of all keys.",
      ],
      takeaway: 'LRU = Map with delete-and-reinsert on every use, evict `keys().next().value`; classic version is map + doubly linked list.',
      note: "On your resume: if you talk about caching in a multi-tenant system like Octagnt, remember cache keys must include the tenant id so one tenant can never read another's cached data.",
    },

    {
      id: 'talk-through-problem',
      title: 'How to talk through a problem in an interview',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Clarify, give examples, state brute force, optimise, code, test, and state complexity, talking the whole time.',
      what: [
        "In a coding round, the interviewer grades how you think as much as whether the code runs. Silent coding, even if correct, gives them nothing to score. Narrate your reasoning in plain words.",
        "Follow the same steps every time so nerves don't decide for you: understand the problem, try examples, describe a brute force, improve it, write the code, test it by hand, and give the complexity.",
      ],
      deeper: [
        "Clarify (2 to 3 minutes): input size and types, empty input, duplicates, negatives, sorted or not, what to return when there's no answer, and whether you may modify the input.",
        "Brute force first, out loud, with its complexity. It proves you understand the problem and gives a fallback. Then look for the bottleneck: a repeated search suggests a Map; sorted input suggests two pointers or binary search; contiguous ranges suggest a sliding window; 'all combinations' suggests backtracking; repeated subproblems suggest DP.",
        "Get agreement before coding: 'I'll go with the hash map approach, O(n) time and O(n) space. Sound good?'. Then write clean code with clear names and small helper functions.",
        "Test by walking through a small example line by line, then edge cases (empty, one item, all the same, very large). Fix bugs calmly and say what you changed.",
        "If you're stuck, say what you're thinking and what you've ruled out. Interviewers often give hints, and taking a hint well is a positive signal.",
      ],
      why: "Two candidates with the same final code can get opposite results. The one who clarified, reasoned out loud and tested comes across as someone you'd want to work with.",
      analogy: "A driving test. The examiner watches you check mirrors and signal, not just whether you arrived. Arriving silently by luck still fails.",
      code: {
        lang: 'text',
        title: 'A 45-minute coding round, step by step',
        source: `0-5 min    CLARIFY
           "Can the array be empty? Can it have negatives or duplicates?"
           "Return indices or values? What if there's no answer?"
           Write 1-2 examples, including an edge case.

5-10 min   BRUTE FORCE, then OPTIMISE
           "The simple way is to check every pair: O(n^2) time, O(1) space."
           "The slow part is searching for the partner. A Map makes that O(1),
            so the whole thing is O(n) time and O(n) space."
           "Does that approach sound good before I code it?"

10-30 min  CODE
           Clear names, small helpers, talk while typing.
           "This map stores value -> index. I check before inserting so
            a number can't pair with itself."

30-38 min  TEST
           Walk one example through the code line by line.
           Then edge cases: empty, one element, duplicates, no answer.

38-45 min  COMPLEXITY + FOLLOW-UPS
           "O(n) time, O(n) space."
           "If the input were sorted I could use two pointers for O(1) space."
           Ask your own question about the team or the problem.`,
      },
      output: "Following this script, the interviewer sees structured thinking within the first five minutes, agrees with your approach before you spend time on code, and watches you find your own bugs. Even an unfinished solution scores well when the reasoning is clear.",
      questions: [
        { q: 'What should you do in the first few minutes of a coding interview?', a: 'Restate the problem, ask about input size, edge cases (empty, duplicates, negatives) and the expected return value, and write one or two small examples. Do not start coding yet.' },
        { q: 'Should you mention the brute-force solution?', a: 'Yes, briefly, with its complexity. It shows you understand the problem, gives you a working fallback, and makes the optimisation easier to explain as removing a specific bottleneck.' },
        { q: 'What do you do if you are stuck?', a: "Say what you are thinking and what you have ruled out, try a smaller example by hand, and go through the patterns (hash map, two pointers, sliding window, sort, BFS/DFS, DP). Accepting a hint gracefully counts in your favour." },
        { q: 'How do you test your code without running it?', a: 'Walk a small example through the code line by line, tracking variable values out loud. Then check edge cases like empty input, a single element, duplicates and the no-answer case.' },
        { q: 'What are interviewers actually grading?', a: 'Problem solving (did you find a good approach), coding (clean, correct code), communication (could they follow you), and testing (did you check your own work). Optimal code alone is not enough.' },
      ],
      answer30: "I follow the same steps every time. First I clarify the inputs, edge cases and expected output, and write a couple of examples. Then I state a brute force with its complexity, find the bottleneck, and propose an optimised approach, checking the interviewer agrees before coding. While coding I explain what each part does. Then I walk through an example and edge cases by hand, and finish with time and space complexity and possible follow-ups.",
      mistakes: [
        'Coding immediately without clarifying, then solving the wrong problem.',
        'Going silent for minutes; the interviewer cannot give credit for thinking they cannot hear.',
        "Saying 'I think it works' without tracing an example.",
        "Trap: 'Can you do better?' Don't panic. Say what the current bottleneck is and whether there's a known lower bound, like 'we must read every element, so O(n) is the best possible'.",
      ],
      takeaway: 'Clarify, brute force, optimise, agree, code, test, complexity: out loud, every time.',
    },
  ],
  rapidFire: [
    { q: 'Time complexity of binary search?', a: 'O(log n).' },
    { q: 'Time complexity of a good comparison sort?', a: 'O(n log n); that is also the lower bound for comparison sorting.' },
    { q: 'Cost of `arr.shift()` vs `arr.pop()`?', a: 'shift is O(n) because every item moves; pop is O(1).' },
    { q: 'Average cost of Map/Set get, has, add?', a: 'O(1) average.' },
    { q: 'Default `[10, 9, 1].sort()` result?', a: '[1, 10, 9]: it sorts as strings. Pass `(a, b) => a - b`.' },
    { q: 'Two Sum in O(n)?', a: 'One pass with a Map from value to index, looking up `target - num`.' },
    { q: 'Sorted array, find a pair with a given sum?', a: 'Two pointers from both ends, O(n) time, O(1) space.' },
    { q: 'Longest substring without repeats pattern?', a: 'Sliding window with a Map of last-seen indexes.' },
    { q: 'Next greater element pattern?', a: 'Monotonic stack of indexes, O(n).' },
    { q: 'Detect a cycle in a linked list?', a: "Floyd's fast and slow pointers; they meet if there is a cycle." },
    { q: 'Find the middle of a linked list?', a: 'Slow moves 1, fast moves 2; when fast ends, slow is at the middle.' },
    { q: 'Inorder traversal of a BST gives?', a: 'The values in sorted order.' },
    { q: 'Shortest path in an unweighted graph?', a: 'BFS.' },
    { q: 'Shortest path with non-negative weights?', a: "Dijkstra's algorithm with a min-heap." },
    { q: 'Order tasks with dependencies?', a: "Topological sort (Kahn's algorithm); leftover nodes mean a cycle." },
    { q: 'Complexity of BFS/DFS on a graph?', a: 'O(V + E).' },
    { q: 'Kth largest element?', a: 'Min-heap of size k, O(n log k); or Quickselect, average O(n).' },
    { q: 'Number of subsets of n items?', a: '2^n.' },
    { q: 'Number of permutations of n distinct items?', a: 'n!' },
    { q: 'Memoization vs tabulation?', a: 'Top-down recursion with a cache vs bottom-up loop filling a table.' },
    { q: 'Maximum subarray sum?', a: "Kadane's algorithm, O(n)." },
    { q: 'First step for most interval problems?', a: 'Sort by start time.' },
    { q: 'LRU cache in JavaScript?', a: 'A Map: delete and re-set on use, evict `map.keys().next().value`.' },
    { q: 'Space complexity of recursion n levels deep?', a: 'O(n) for the call stack.' },
  ],
};

export default dsa;
