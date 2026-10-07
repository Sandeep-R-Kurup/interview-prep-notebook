// HTML5, CSS3, SCSS stack. Topics are auto-sorted Basic -> Intermediate -> Advanced by the registry.
// SCSS examples use lang 'css' (the closest allowed highlighter); they were compiled with Dart Sass to check them.

const htmlCss = {
  name: 'HTML5, CSS3, SCSS',
  intro: 'The markup and styling questions every frontend round still asks: semantics and accessibility, the cascade, layout with Flexbox and Grid, responsive design, and SCSS.',
  topics: [
    {
      id: 'semantic-html',
      title: 'Semantic HTML',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Use elements for their meaning (header, nav, main, button) instead of generic divs, so browsers, screen readers and search engines understand the page.',
      what: [
        "Semantic HTML means choosing the element that describes what the content **is**, not how it looks. A navigation menu goes in `<nav>`, the main content in `<main>`, a clickable action in `<button>`, a self-contained post in `<article>`.",
        "A `<div>` or `<span>` has no meaning. It's fine for styling wrappers, but if every element is a div, assistive technology sees a flat pile of text with no structure.",
      ],
      deeper: [
        "Landmark elements (`header`, `nav`, `main`, `aside`, `footer`) let screen reader users jump between regions. Headings `h1` to `h6` form an outline; users often navigate by headings, so don't skip levels just to get a smaller font.",
        "Native elements bring free behaviour. A `<button>` is focusable, works with Enter and Space, and announces itself as a button. A `<div onClick>` does none of that until you add `role`, `tabIndex` and key handlers. A link (`<a href>`) navigates; a button performs an action. Mixing them up confuses keyboard and screen reader users.",
        "`<section>` is a thematic group that normally has a heading; `<article>` is content that makes sense on its own (a blog post, a comment, a job card). Other useful ones: `<figure>`/`<figcaption>`, `<time datetime>`, `<dialog>`, `<details>`/`<summary>`, `<table>` for real tabular data.",
      ],
      why: "It improves accessibility, SEO, and maintainability at almost zero cost, and it gives you keyboard and focus behaviour for free instead of rebuilding it in JavaScript.",
      analogy: "Semantic tags are labels on moving boxes: 'Kitchen', 'Books', 'Fragile'. Divs are unlabelled boxes. Everything still arrives, but nobody, especially someone who can't see inside, knows where anything goes.",
      code: {
        lang: 'html',
        source: `<body>
  <header>
    <a href="/" class="logo">JobBoard</a>
    <nav aria-label="Main">
      <ul>
        <li><a href="/jobs" aria-current="page">Jobs</a></li>
        <li><a href="/companies">Companies</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <h1>Open roles</h1>
    <article class="job-card">
      <h2>Node.js Engineer</h2>
      <p>Posted <time datetime="2026-10-01">1 Oct 2026</time></p>
      <button type="button">Save job</button>        <!-- action: button -->
      <a href="/jobs/42">View details</a>             <!-- navigation: link -->
    </article>
  </main>

  <aside aria-label="Filters">...</aside>
  <footer>&copy; 2026 JobBoard</footer>
</body>

<!-- Avoid: no meaning, no keyboard support -->
<div class="btn" onclick="save()">Save job</div>`,
      },
      output: "The page looks the same as a div version once styled, but a screen reader announces 'banner', 'navigation, Main', 'main', headings at the right levels, and 'Save job, button'. Keyboard users can Tab to the button and press Enter or Space. The div 'button' at the bottom can't be reached with Tab at all.",
      questions: [
        { q: 'What is semantic HTML and why does it matter?', a: 'Using elements that describe meaning, like nav, main, article and button, instead of generic divs. It helps screen readers, search engines and other developers understand the page, and native elements come with keyboard and focus behaviour built in.' },
        { q: 'section vs article vs div?', a: 'article is self-contained content that could stand alone, like a post or card. section is a themed group of content, usually with a heading. div has no meaning and is only for styling or layout.' },
        { q: 'When do you use a button vs a link?', a: 'A link (`a href`) navigates to another page or location. A button performs an action on the current page, like submit, open a modal, or save.' },
        { q: 'Why not use a div with onClick as a button?', a: 'It is not focusable, does not respond to Enter or Space, and is not announced as a button. You would have to add role, tabIndex and key handlers to rebuild what button already does.' },
      ],
      answer30: "Semantic HTML means using elements for their meaning: header, nav, main, article, footer, real headings in order, and button for actions versus links for navigation. Screen reader users navigate by those landmarks and headings, search engines understand the structure better, and native elements give keyboard support for free. A div with an onClick isn't focusable or announced as a button, so I avoid that.",
      mistakes: [
        'Choosing heading levels for font size, like jumping from h1 to h4.',
        'Clickable divs and spans instead of buttons.',
        'Using a link with `href=\"#\"` as a button.',
        'Several `<main>` elements on one page; there should be one visible main.',
        "Trap: 'Is a page full of divs invalid HTML?' No, it's valid. It's just inaccessible and harder to maintain, which is the point interviewers want you to make.",
      ],
      takeaway: 'Pick the element that matches the meaning; you get accessibility and keyboard behaviour for free.',
    },

    {
      id: 'accessibility-basics',
      title: 'Accessibility basics: ARIA, labels, focus, contrast',
      level: 'basic',
      priority: 'must',
      frequency: 'common',
      summary: 'Accessible pages work with a keyboard and screen reader: label every control, keep focus visible, use enough contrast, and use ARIA only to fill gaps.',
      what: [
        "Accessibility (a11y) means people with disabilities can use your site: blind users with screen readers, people who only use a keyboard, people with low vision or colour blindness. The standard is WCAG; most companies aim for level AA.",
        "The basics: every input has a label, every image has `alt` text (empty `alt=\"\"` if decorative), everything clickable is reachable with Tab and has a visible focus outline, and text has enough contrast with its background.",
        "**ARIA** attributes (`aria-label`, `aria-expanded`, `role`, and so on) add information for assistive technology when HTML alone can't express it. They change what's announced, not how anything behaves.",
      ],
      deeper: [
        "The first rule of ARIA: don't use ARIA if a native element does the job. `<button>` beats `<div role=\"button\">`, because the role doesn't add focus or keyboard handling. Wrong ARIA is worse than none.",
        "Useful ARIA: `aria-label` or `aria-labelledby` for controls with no visible text (icon buttons), `aria-describedby` to link hints and error messages, `aria-expanded` and `aria-controls` on toggles, `aria-live=\"polite\"` for messages that appear dynamically (toasts, 'saved'), and `aria-hidden=\"true\"` for decorative icons.",
        "Focus: never remove outlines without a replacement. `:focus-visible` shows the ring for keyboard users but not mouse clicks. Modals must move focus inside, trap it there, close on Escape, and return focus to the trigger when closed. The native `<dialog>` with `showModal()` does much of this.",
        "Contrast for WCAG AA: at least 4.5:1 for normal text and 3:1 for large text and for UI parts like input borders and focus rings. Don't use colour alone to show meaning, like red borders for errors; add text or an icon.",
      ],
      why: "It's a legal requirement in many places, it widens your audience, and the same practices (labels, keyboard support, clear focus) make the product better and easier to test for everyone.",
      analogy: "A building with ramps, lifts and signs in Braille. Steps (mouse-only UI) work for most people, but a ramp (keyboard and screen reader support) lets everyone in, and parents with prams use it too.",
      code: {
        lang: 'html',
        source: `<!-- Label tied to input; hint and error linked with aria-describedby -->
<label for="email">Work email</label>
<input id="email" type="email" required
       aria-describedby="email-hint email-error" aria-invalid="true" />
<p id="email-hint">We'll send the offer letter here.</p>
<p id="email-error">Enter a valid email address.</p>

<!-- Icon-only button needs an accessible name; the icon itself is hidden -->
<button type="button" aria-label="Close dialog">
  <svg aria-hidden="true" focusable="false" width="16" height="16">...</svg>
</button>

<!-- Disclosure: state announced with aria-expanded -->
<button type="button" aria-expanded="false" aria-controls="filters">Filters</button>
<div id="filters" hidden>...</div>

<!-- Dynamic status message read out without moving focus -->
<div aria-live="polite" id="status"></div>

<img src="team.jpg" alt="Five engineers at a whiteboard" />
<img src="divider.svg" alt="" />  <!-- decorative: empty alt -->

<style>
  /* Keyboard users get a clear ring; mouse clicks don't */
  button:focus-visible { outline: 3px solid #1d4ed8; outline-offset: 2px; }
</style>`,
      },
      output: "A screen reader announces 'Work email, edit text, required, invalid entry, We'll send the offer letter here. Enter a valid email address.' The icon button is read as 'Close dialog, button'. The Filters button is read as 'collapsed' or 'expanded'. Text placed in the live region later is read out automatically. Tabbing shows a blue focus ring; clicking with a mouse doesn't.",
      questions: [
        { q: 'What is ARIA and when should you use it?', a: 'Attributes that give assistive technology extra information like roles, names and states. Use it only when native HTML cannot express something, because ARIA changes what is announced but adds no behaviour.' },
        { q: 'How do you make an icon-only button accessible?', a: 'Give the button an accessible name with `aria-label` (or visually hidden text), and hide the decorative icon with `aria-hidden=\"true\"`.' },
        { q: 'What is the difference between :focus and :focus-visible?', a: ':focus matches whenever an element has focus. :focus-visible matches only when the browser decides a focus ring is helpful, usually keyboard navigation, so mouse users do not see rings on click.' },
        { q: 'What contrast ratios does WCAG AA require?', a: '4.5:1 for normal text, 3:1 for large text (about 24px, or 18.5px bold) and for meaningful UI graphics like input borders and focus indicators.' },
        { q: 'What should a modal do for accessibility?', a: 'Move focus into it, keep focus trapped inside, close on Escape, make the background inert, and return focus to the element that opened it. The native dialog element with showModal handles much of this.' },
      ],
      answer30: "I start with semantic HTML, because native elements bring keyboard support and roles for free. Every input has a label, images have alt text, everything interactive is reachable by Tab with a visible focus style, and colours meet WCAG AA contrast, 4.5 to 1 for normal text. I use ARIA only to fill gaps: aria-label for icon buttons, aria-expanded on toggles, aria-describedby for errors, aria-live for dynamic messages. Then I test with just the keyboard and a screen reader.",
      mistakes: [
        '`outline: none` on focus with no replacement style.',
        'Placeholder text used as the only label; it disappears when typing and often fails contrast.',
        'Adding `role=\"button\"` to a div and thinking it is now a button.',
        'Showing errors only with a red border, which colour-blind users may miss.',
        "Trap: 'Does `aria-hidden=\"true\"` make an element unfocusable?' No. If it contains a focusable element, keyboard users can still reach something the screen reader won't announce. Use `inert` or remove it from the tab order.",
      ],
      takeaway: 'Native HTML first, label everything, keep focus visible, meet contrast, and use ARIA only to fill gaps.',
    },

    {
      id: 'forms-validation',
      title: 'Forms and validation',
      level: 'basic',
      priority: 'good',
      frequency: 'common',
      summary: 'Use the right input types and built-in constraints for quick feedback, but always validate again on the server.',
      what: [
        "HTML forms have built-in validation. Attributes like `required`, `type=\"email\"`, `minlength`, `maxlength`, `min`, `max` and `pattern` make the browser block submission and show a message when the value is wrong.",
        "The right `type` (`email`, `tel`, `number`, `date`, `url`) also gives mobile users the right keyboard, and `autocomplete` values (`email`, `current-password`, `one-time-code`) let browsers and password managers fill fields.",
        "Client-side validation is only for user experience. Anyone can bypass it with dev tools or a direct API call, so the server must validate everything again.",
      ],
      deeper: [
        "CSS can style validity with `:valid`, `:invalid`, and better, `:user-invalid`, which only matches after the user has interacted, so empty required fields aren't red on page load. Support for `:user-invalid` is good in current browsers, but check your browser targets.",
        "The Constraint Validation API gives JS control: `input.validity` (with flags like `valueMissing`, `typeMismatch`), `input.setCustomValidity('message')` for custom rules, `form.checkValidity()` and `reportValidity()`. Adding `novalidate` on the form turns off the browser's popups so you can show your own messages while still using the API.",
        "Good form UX: labels above fields, errors next to the field and linked with `aria-describedby`, validate on blur or submit rather than every keystroke, keep typed values after a failed submit, and focus the first invalid field. In React, libraries like React Hook Form plus a schema (Zod) handle this; the same schema can validate on the server.",
      ],
      why: "Forms are where users give you data and where most frustration happens. Native validation gives fast feedback for free, while server validation protects your data.",
      analogy: "Client-side validation is a friendly receptionist who checks your form is filled in before you queue. Server-side validation is the officer at the counter who actually verifies it. You need the officer even if the receptionist is on a break.",
      code: {
        lang: 'html',
        source: `<form id="signup" novalidate>
  <label for="name">Full name</label>
  <input id="name" name="name" required minlength="2" autocomplete="name" />

  <label for="email">Email</label>
  <input id="email" name="email" type="email" required autocomplete="email"
         aria-describedby="email-err" />
  <span id="email-err" class="error" aria-live="polite"></span>

  <label for="pin">PIN code</label>
  <input id="pin" name="pin" inputmode="numeric" pattern="[0-9]{6}" required />

  <button type="submit">Create account</button>
</form>

<style>
  input:user-invalid { border-color: #b91c1c; } /* only after interaction */
</style>

<script>
  const form = document.getElementById('signup');
  const email = document.getElementById('email');

  email.addEventListener('input', () => {
    // custom rule on top of type="email"
    email.setCustomValidity(email.value.endsWith('@example.com') ? 'Use your work email.' : '');
  });

  form.addEventListener('submit', (e) => {
    if (!form.checkValidity()) {
      e.preventDefault();
      document.getElementById('email-err').textContent = email.validationMessage;
      form.querySelector(':invalid')?.focus(); // jump to the first problem
      return;
    }
    // still validated again on the server
  });
</script>`,
      },
      output: "Submitting an empty form is blocked, the first invalid field (name) gets focus, and the email error text appears and is read out by screen readers. Entering 'a@example.com' shows 'Use your work email.' On a phone, the PIN field opens a numeric keypad. Red borders only appear after the user has touched a field.",
      questions: [
        { q: 'Why validate on the server if the browser already validates?', a: 'Client-side checks can be bypassed with dev tools or direct API requests. They exist for user experience; the server is the real gatekeeper for security and data integrity.' },
        { q: 'Name some built-in HTML validation attributes.', a: '`required`, `type` (email, url, number), `minlength`, `maxlength`, `min`, `max`, `step` and `pattern`.' },
        { q: 'What does novalidate do?', a: 'It stops the browser from blocking submission and showing its own error bubbles, so you can display custom messages. The Constraint Validation API still works.' },
        { q: 'How do you add a custom validation rule without a library?', a: 'Call `input.setCustomValidity(\"message\")` when the rule fails and `setCustomValidity(\"\")` when it passes. The field then counts as invalid for `checkValidity()` and `:invalid`.' },
      ],
      answer30: "I use proper input types and autocomplete values, and built-in constraints like required, minlength and pattern for instant feedback. For custom messages I add novalidate and use the Constraint Validation API, setCustomValidity and checkValidity, and show errors next to fields linked with aria-describedby, then focus the first invalid field. In React I'd use React Hook Form with a Zod schema. But client validation is only UX; the server validates everything again.",
      mistakes: [
        'Relying only on client-side validation.',
        'Showing every field as red before the user has typed anything; use `:user-invalid` or validate on blur.',
        "Using `type=\"number\"` for things like phone numbers or PIN codes; it strips leading zeros and adds spinners. Use `inputmode=\"numeric\"` instead.",
        "Trap: 'Does `pattern` need ^ and $?' No, the pattern must match the whole value automatically.",
      ],
      takeaway: 'Native constraints for fast feedback, clear accessible errors, and always validate again on the server.',
    },

    {
      id: 'box-model',
      title: 'The box model and box-sizing',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Every element is a box of content, padding, border and margin; box-sizing decides whether width includes padding and border.',
      what: [
        "Every element is drawn as a rectangle made of four layers, from inside out: **content**, **padding** (space inside the border), **border**, and **margin** (space outside the border, between this box and others).",
        "By default (`box-sizing: content-box`), `width` sets only the content. Padding and border are added on top, so a `width: 200px` box with 20px padding and a 1px border is 242px wide. With `box-sizing: border-box`, `width` includes padding and border, so the box stays 200px. Almost every project sets border-box globally.",
      ],
      deeper: [
        "Vertical margins between block elements **collapse**: two stacked paragraphs with 20px and 30px margins are 30px apart, not 50px. A parent's top margin can also collapse with its first child's. Margins don't collapse inside flex or grid containers, or with padding, a border, or `display: flow-root` in between.",
        "Block elements (`div`, `p`) take the full width and start on a new line. Inline elements (`span`, `a`) flow in text; width, height, and vertical margins don't apply to them. `inline-block` flows inline but respects width and height.",
        "Percentage padding and margin, even vertical ones, are calculated from the **width** of the containing block. Outline and box-shadow don't take up space in the box model.",
      ],
      why: "Most 'why is this overflowing?' and 'why is this gap wrong?' bugs come from the box model: padding added to width, or margins collapsing.",
      analogy: "A framed picture on a wall. The photo is the content, the white mat around it is padding, the frame is the border, and the empty wall space you leave around it is the margin.",
      code: {
        lang: 'css',
        source: `/* The global reset most projects use */
*, *::before, *::after {
  box-sizing: border-box;
}

.card-content-box {
  box-sizing: content-box;
  width: 200px;
  padding: 20px;
  border: 1px solid #ccc;   /* rendered width: 200 + 40 + 2 = 242px */
}

.card-border-box {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 1px solid #ccc;   /* rendered width: 200px; content shrinks to 158px */
}

/* Margin collapsing */
.a { margin-bottom: 20px; }
.b { margin-top: 30px; }    /* gap between .a and .b is 30px, not 50px */

/* Inside a flex (or grid) container, margins do not collapse */
.stack { display: flex; flex-direction: column; }  /* same children: 50px gap */`,
      },
      output: "The content-box card renders 242px wide; the border-box card renders exactly 200px with 158px for content. Two stacked blocks with 20px and 30px margins sit 30px apart in normal flow, but 50px apart inside the flex column.",
      questions: [
        { q: 'Explain the CSS box model.', a: 'Every element is a box with content, then padding, then border, then margin. Width and height apply to the content by default, and padding and border are added on top.' },
        { q: 'What does box-sizing: border-box do?', a: 'It makes width and height include padding and border, so a 200px box stays 200px no matter its padding. It makes layouts much easier to reason about.' },
        { q: 'What is margin collapsing?', a: 'Adjacent vertical margins of block elements combine into one margin equal to the larger value, instead of adding up. It does not happen inside flex or grid containers or for horizontal margins.' },
        { q: 'Padding vs margin?', a: 'Padding is space inside the border and takes the element\'s background. Margin is space outside the border, transparent, and separates the element from its neighbours.' },
      ],
      answer30: "Every element is a box: content, then padding, border, and margin. By default width only covers the content, so padding and border make the box bigger than its width. I set box-sizing: border-box globally so width includes padding and border. One gotcha is margin collapsing: vertical margins between blocks merge into the larger one, but not inside flex or grid containers.",
      mistakes: [
        'Forgetting border-box and getting overflow when adding padding to a `width: 100%` element.',
        'Expecting vertical margins to add up between stacked blocks.',
        'Setting width or vertical margin on an inline element like `span` and wondering why nothing changes.',
        "Trap: 'Percentage padding-top is relative to what?' The containing block's width, not height. That's how the old aspect-ratio padding hack worked; today use `aspect-ratio`.",
      ],
      takeaway: 'Content + padding + border + margin; use border-box everywhere and remember vertical margins collapse.',
    },

    {
      id: 'specificity-cascade',
      title: 'Specificity and the cascade (including @layer)',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'When rules conflict, the cascade picks a winner by importance, layer, specificity, then source order.',
      what: [
        "When several CSS rules set the same property on an element, the browser needs a winner. That process is the **cascade**.",
        "**Specificity** is a score for each selector, written as three numbers (IDs, classes, elements). `#nav` is (1,0,0), `.btn.primary` is (0,2,0), `nav a` is (0,0,2). Compare from left to right: one ID beats any number of classes, and one class beats any number of elements. If specificity is equal, the rule written **later** wins.",
      ],
      deeper: [
        "The full order the browser checks: (1) origin and importance (`!important` user-agent and user styles beat author `!important`, which beats normal author styles), (2) inline `style` attributes, (3) cascade layers, (4) specificity, (5) source order. Inheritance comes last: an inherited value loses to any rule that targets the element directly.",
        "Counting: IDs in the first column; classes, attributes (`[type=email]`) and pseudo-classes (`:hover`) in the second; elements and pseudo-elements (`::before`) in the third. `*` and combinators add nothing. `:is()` and `:not()` take the specificity of their most specific argument; `:where()` always counts as zero, which is great for easily-overridable library styles.",
        "**`@layer`** (supported in all modern browsers since 2022) lets you group CSS into named layers and set their order: `@layer reset, base, components, utilities;`. A rule in a later layer beats one in an earlier layer **regardless of specificity**. Unlayered styles beat all layers. For `!important`, the order flips: earlier layers win. Tailwind v4 uses real cascade layers for its theme, base, components and utilities.",
      ],
      why: "Specificity wars ('just add another class', 'add !important') make CSS impossible to maintain. Understanding the cascade, and layers in particular, lets you control overrides on purpose.",
      analogy: "A court deciding between conflicting orders. First, which court level issued it (layer); then the rank of the official who signed it (specificity: an ID is a judge, a class is a clerk); if same rank, the most recent order wins (source order). `!important` is an emergency order that skips the normal queue.",
      code: {
        lang: 'css',
        source: `/* Specificity: (IDs, classes, elements) */
p { color: black; }                      /* (0,0,1) */
.intro { color: green; }                 /* (0,1,0) */
article p.intro { color: blue; }         /* (0,1,2)  <- wins over .intro */
#hero .intro { color: purple; }          /* (1,1,0)  <- wins: one ID beats any classes */

:where(.card) .title { color: gray; }    /* (0,1,0): :where() adds nothing */
:is(#main, .card) .title { color: red; } /* (1,1,0): :is() takes its strongest argument */

/* Cascade layers: order is declared once, then layer beats specificity */
@layer reset, components, utilities;

@layer components {
  #signup .btn { background: navy; }     /* high specificity, but earlier layer */
}
@layer utilities {
  .bg-red { background: crimson; }       /* low specificity, later layer: WINS */
}

/* Unlayered styles beat every layer */
.btn { background: teal; }               /* this beats both layers above */`,
      },
      output: "A `<p class=\"intro\">` inside `#hero` is purple. For `<button class=\"btn bg-red\">` inside `#signup`, ignoring the last rule, the background is crimson: the utilities layer comes after components, so it wins even though `#signup .btn` has an ID. With the unlayered `.btn` rule present, it becomes teal, because unlayered styles beat all layers.",
      questions: [
        { q: 'How is specificity calculated?', a: 'As three counts: IDs; classes, attributes and pseudo-classes; and elements and pseudo-elements. Compare left to right, so one ID beats any number of classes. Inline styles beat all selectors, and !important beats normal declarations.' },
        { q: 'What happens when two selectors have the same specificity?', a: 'The one that appears later in the stylesheet (source order) wins.' },
        { q: 'What are cascade layers (@layer)?', a: 'Named groups of styles with a declared order. A rule in a later layer beats an earlier layer regardless of specificity, and unlayered styles beat all layers. They let you control overrides without specificity hacks.' },
        { q: ':is() vs :where()?', a: 'Both match any selector in their list. :is() takes the specificity of its most specific argument; :where() always has zero specificity, which makes it ideal for default styles that are easy to override.' },
        { q: 'Why avoid !important?', a: 'It escalates conflicts: the only way to override it is another !important with higher specificity, which leads to a war. Use layers or lower-specificity selectors instead; keep !important for utilities or overriding third-party inline styles.' },
      ],
      answer30: "When rules conflict, the cascade checks importance and origin first, then inline styles, then cascade layers, then specificity, then source order. Specificity counts IDs, then classes, attributes and pseudo-classes, then elements, compared left to right, so one ID beats any number of classes. Cascade layers let me declare order like reset, components, utilities, and a later layer wins regardless of specificity, which removes most need for !important.",
      mistakes: [
        'Using IDs for styling, which makes rules very hard to override.',
        'Fixing conflicts by adding `!important` instead of understanding which rule wins.',
        "Thinking 10 classes beat an ID. They don't: columns never carry over.",
        "Trap: 'Unlayered vs layered: which wins?' Unlayered normal styles beat all layers. Many people assume the opposite.",
      ],
      takeaway: 'Importance, then layer, then specificity (IDs, classes, elements), then source order.',
    },

    {
      id: 'positioning-stacking',
      title: 'Positioning, stacking contexts, and z-index',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'position controls how an element is placed; z-index only orders elements within the same stacking context.',
      what: [
        "`position` has five values. **static** (default): normal flow. **relative**: stays in flow, but `top`/`left` nudge it visually, and it becomes the reference point for absolute children. **absolute**: taken out of flow, placed relative to the nearest positioned ancestor. **fixed**: placed relative to the viewport, stays put when scrolling. **sticky**: acts relative until you scroll past a threshold, then sticks like fixed within its parent.",
        "`z-index` decides which overlapping element is on top. Higher numbers are in front, but only among elements in the same **stacking context**.",
      ],
      deeper: [
        "A stacking context is a self-contained layer group. Children are stacked inside their parent's context and can never escape it: a child with `z-index: 9999` inside a parent with `z-index: 1` stays below a sibling of that parent with `z-index: 2`.",
        "Many properties create a new stacking context, not just `position` with `z-index`: `opacity` below 1, `transform`, `filter`, `will-change`, `isolation: isolate`, `position: fixed` or `sticky`, and flex or grid children with a `z-index`. That's why adding a harmless `transform` can suddenly put a dropdown behind something.",
        "A `transform`, `filter` or `perspective` on an ancestor also becomes the containing block for `position: fixed` children, so a 'fixed' modal inside a transformed card scrolls with the card. This is one reason modals are rendered through a portal at the end of `body`.",
        "Sticky gotchas: it needs a `top` (or other inset) value, and it stops working if any ancestor has `overflow: hidden`, `auto` or `scroll`, because that ancestor becomes its scroll container.",
      ],
      why: "Dropdowns hidden behind headers, modals that won't cover the page, and sticky headers that don't stick are some of the most common CSS bugs, and they all come down to positioning and stacking contexts.",
      analogy: "Stacking contexts are folders in a pile of folders. You can reorder sheets inside a folder (z-index), but a sheet can't jump out of its folder to sit above a different folder. To move it up, you move the whole folder.",
      code: {
        lang: 'html',
        source: `<style>
  .card { position: relative; }               /* reference for the badge */
  .badge { position: absolute; top: 8px; right: 8px; }

  .header { position: sticky; top: 0; z-index: 10; background: white; }

  /* Bug: transform creates a stacking context, so the menu can't rise above .content */
  .nav { transform: translateZ(0); z-index: 1; position: relative; }
  .menu { position: absolute; z-index: 9999; }
  .content { position: relative; z-index: 2; }

  /* Fix: isolate stacking on purpose, keep the nav above the content */
  .nav--fixed { position: relative; z-index: 3; }
</style>

<header class="header">Sticky header</header>

<div class="card">
  <span class="badge">New</span>
  Job card
</div>

<nav class="nav">
  <ul class="menu">Dropdown menu</ul>
</nav>
<main class="content">Main content</main>`,
      },
      output: "The 'New' badge sits in the card's top-right corner. The header sticks to the top while scrolling. The dropdown, despite `z-index: 9999`, appears behind the main content, because it lives inside `.nav`'s stacking context (z-index 1), which is below `.content` (z-index 2). Giving the nav `z-index: 3`, as in `.nav--fixed`, brings the whole menu on top.",
      questions: [
        { q: 'relative vs absolute vs fixed vs sticky?', a: 'relative stays in flow and can be nudged; absolute leaves flow and is placed relative to the nearest positioned ancestor; fixed is placed relative to the viewport; sticky behaves like relative until a scroll threshold, then sticks within its parent.' },
        { q: 'Why is my z-index: 9999 not working?', a: 'Either the element is not positioned (for non-flex, non-grid items), or it is inside a parent stacking context that is lower than the thing covering it. z-index only competes within the same stacking context.' },
        { q: 'What creates a stacking context?', a: 'The root, positioned elements with a z-index, opacity below 1, transform, filter, will-change, isolation: isolate, fixed and sticky positioning, and flex or grid children with a z-index, among others.' },
        { q: 'Why might position: sticky not work?', a: 'No `top` value is set, or an ancestor has overflow hidden, auto or scroll, or the parent is no taller than the sticky element, so there is no room to stick.' },
      ],
      answer30: "Static is normal flow; relative stays in flow and acts as the anchor for absolute children; absolute leaves flow and positions against the nearest positioned ancestor; fixed positions against the viewport; sticky is relative until you scroll past its offset. z-index only orders elements inside the same stacking context, and many properties create one, like transform, opacity under 1, or isolation. So a 9999 z-index can still be behind something if its parent context is lower.",
      mistakes: [
        'Raising z-index to huge numbers instead of finding the stacking context.',
        'Absolute elements jumping to the page corner because no ancestor is positioned.',
        'Adding `overflow: hidden` to a parent and breaking sticky headers.',
        "Trap: 'Can a transformed parent break a fixed child?' Yes. The transformed ancestor becomes the containing block, so the child is fixed to it, not the viewport.",
      ],
      takeaway: 'absolute needs a positioned ancestor; z-index only works within a stacking context, and transform or opacity create new ones.',
    },

    {
      id: 'flexbox',
      title: 'Flexbox',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Flexbox lays items out in one direction (row or column) and controls how they grow, shrink, align and wrap.',
      what: [
        "`display: flex` turns an element into a flex container, and its direct children into flex items laid out along one axis. `flex-direction: row` (default) is horizontal; `column` is vertical.",
        "`justify-content` aligns items along the **main axis** (the direction of flow). `align-items` aligns them on the **cross axis** (perpendicular). `gap` adds space between items. `flex-wrap: wrap` lets items move to a new line when there isn't room.",
      ],
      deeper: [
        "`flex` is shorthand for `flex-grow`, `flex-shrink`, `flex-basis`. `flex: 1` means `1 1 0%`: start from zero and share the free space equally. `flex: auto` is `1 1 auto`: start from the content size, then share leftovers, so items with more content end up wider. `flex: none` is `0 0 auto`: rigid.",
        "Flex items have `min-width: auto` by default, so they won't shrink below their content's minimum size. That's why long text or a wide table overflows a flex child. The fix is `min-width: 0` (or `overflow: hidden`) on the item.",
        "`margin-left: auto` on one item pushes it, and everything after it, to the far end, a neat trick for nav bars. `align-self` overrides alignment for one item; `order` changes visual order but not tab or reading order, so use it carefully.",
      ],
      why: "Before flexbox, centring, equal-height columns and 'push this to the right' needed floats and hacks. Flexbox makes one-dimensional layouts like navbars, toolbars, cards and form rows simple.",
      analogy: "People on a bench. justify-content decides whether they sit at one end, the middle, or spread out. align-items decides whether they sit, stand, or stretch to the bench's height. flex-grow decides who takes the extra space when someone leaves.",
      code: {
        lang: 'css',
        source: `/* Navbar: logo left, links right */
.nav {
  display: flex;
  align-items: center;     /* vertical centre (cross axis) */
  gap: 1rem;
}
.nav .login { margin-left: auto; } /* push to the far right */

/* Sidebar + content: sidebar fixed, content takes the rest */
.layout { display: flex; }
.sidebar { flex: 0 0 240px; }      /* don't grow, don't shrink, 240px */
.content { flex: 1; min-width: 0; } /* take remaining space; allow shrinking below content size */

/* Wrapping cards with equal share */
.cards { display: flex; flex-wrap: wrap; gap: 16px; }
.cards > .card { flex: 1 1 250px; } /* at least ~250px, grow to fill the row */

/* Perfect centre */
.center { display: flex; justify-content: center; align-items: center; min-height: 100vh; }`,
      },
      output: "The nav shows the logo and links on the left and the login button pushed to the right, all vertically centred. The sidebar stays 240px and the content fills the rest without overflowing, even with a long URL inside. Cards fill each row and wrap to new rows on narrow screens. The `.center` box puts its child in the middle of the screen.",
      questions: [
        { q: 'justify-content vs align-items?', a: 'justify-content aligns items along the main axis (horizontal in a row); align-items aligns them on the cross axis (vertical in a row). Changing flex-direction to column swaps which is which.' },
        { q: 'What does flex: 1 mean?', a: 'flex-grow 1, flex-shrink 1, flex-basis 0%. Items start from zero width and share the available space equally.' },
        { q: 'Why does my flex child overflow with long text?', a: 'Flex items default to `min-width: auto`, so they cannot shrink below their content. Set `min-width: 0` on the item (or overflow hidden) to let it shrink.' },
        { q: 'Flexbox vs Grid?', a: 'Flexbox is one-dimensional and content-driven: good for rows of items like navbars. Grid is two-dimensional and layout-driven: good for page layouts and aligned rows and columns.' },
      ],
      answer30: "Flexbox lays out a container's children along one axis. justify-content aligns them along that main axis, align-items on the cross axis, gap spaces them, and flex-wrap lets them wrap. The flex shorthand controls grow, shrink and basis; flex: 1 shares space equally. A common gotcha is that flex items won't shrink below their content because of min-width auto, so I add min-width: 0. I use flex for one-dimensional things and Grid for two-dimensional layouts.",
      mistakes: [
        'Mixing up the axes after switching to `flex-direction: column`.',
        'Forgetting `min-width: 0` and getting horizontal overflow.',
        'Using `order` to rearrange content, which breaks keyboard and screen reader order.',
        "Trap: 'Does `align-items: center` need a height?' To see vertical centring, the container must be taller than its items, for example with `min-height`.",
      ],
      takeaway: 'Flexbox is for one axis: justify on the main axis, align on the cross axis, and remember min-width: 0.',
    },

    {
      id: 'css-grid',
      title: 'CSS Grid',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Grid lays out content in rows and columns at once, with tracks you define on the container.',
      what: [
        "`display: grid` creates a two-dimensional layout. You define columns with `grid-template-columns` and rows with `grid-template-rows`, and items fill the cells in order, or you place them explicitly.",
        "The `fr` unit means 'a fraction of the free space'. `grid-template-columns: 1fr 2fr` makes two columns, the second twice as wide. `repeat(3, 1fr)` makes three equal columns.",
      ],
      deeper: [
        "Responsive grid without media queries: `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))`. The browser fits as many 250px+ columns as possible and stretches them to fill the row. `auto-fill` keeps empty tracks when there are few items; `auto-fit` collapses them so items stretch.",
        "`grid-template-areas` names regions with strings, which makes page layouts very readable and easy to rearrange in a media query. Items can also span: `grid-column: 1 / -1` spans all columns, `grid-column: span 2` spans two.",
        "`minmax(0, 1fr)` instead of `1fr` stops long content from blowing out a column, the grid equivalent of flexbox's `min-width: 0`. **Subgrid** (`grid-template-columns: subgrid`), supported in all major browsers since 2023, lets nested items align to the parent grid's tracks, for example so card titles and buttons line up across cards.",
      ],
      why: "Page layouts and card grids need alignment in both directions. Grid does this directly instead of nesting many flex containers.",
      analogy: "A spreadsheet. You decide how many columns and rows, how wide each is, and then drop content into cells, or merge cells across a range.",
      code: {
        lang: 'css',
        source: `/* Page layout with named areas */
.page {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  min-height: 100vh;
  gap: 16px;
}
.page > header { grid-area: header; }
.page > aside  { grid-area: sidebar; }
.page > main   { grid-area: main; }
.page > footer { grid-area: footer; }

@media (max-width: 768px) {
  .page {
    grid-template-columns: 1fr;
    grid-template-areas: "header" "main" "sidebar" "footer";
  }
}

/* Responsive cards, no media query */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}
.cards > .featured { grid-column: span 2; }

/* Subgrid: card sections line up across the row */
.card { display: grid; grid-row: span 3; grid-template-rows: subgrid; }`,
      },
      output: "On desktop: header across the top, a 240px sidebar beside the main content, footer at the bottom, and the footer stays at the bottom even on short pages. Under 768px it becomes one column with the sidebar below the main content. The cards show as many 250px+ columns as fit (four on a wide screen, one on a phone), with the featured card spanning two.",
      questions: [
        { q: 'When would you use Grid instead of Flexbox?', a: 'When the layout needs to line up in both rows and columns, like a page layout or a card grid. Flexbox is better for a single row or column of items whose size depends on content.' },
        { q: 'What does the fr unit mean?', a: 'A fraction of the free space in the grid container, after fixed sizes and gaps are taken out. `1fr 2fr` splits it one third and two thirds.' },
        { q: 'auto-fit vs auto-fill?', a: 'Both create as many tracks as fit. auto-fill keeps empty tracks if there are not enough items; auto-fit collapses empty tracks so the existing items stretch to fill the row.' },
        { q: 'How do you make a responsive grid without media queries?', a: '`grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))`. Columns are at least 250px and as many as fit, then share the remaining space.' },
      ],
      answer30: "Grid is CSS's two-dimensional layout system. I define tracks on the container with grid-template-columns and rows, using fr units for shares of free space, and gap for spacing. For page layouts I like grid-template-areas, which reads like a map and is easy to rearrange in a media query. For card grids, repeat auto-fit with minmax gives a responsive layout with no media queries. I use flex for one-dimensional rows of items and Grid when things must align both ways.",
      mistakes: [
        'Using `1fr` with long unbreakable content and getting overflow; use `minmax(0, 1fr)`.',
        "Mixing up auto-fill and auto-fit.",
        'Nesting many flex containers to fake a grid.',
        "Trap: 'Does grid replace flexbox?' No. They work together; a grid cell often contains a flex row.",
      ],
      takeaway: 'Grid for two-dimensional layout: define tracks with fr, use areas for pages and auto-fit + minmax for cards.',
    },

    {
      id: 'responsive-design',
      title: 'Responsive design: media queries, container queries, units',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Build mobile-first with fluid units, then add media queries for the viewport and container queries for components.',
      what: [
        "Responsive design means one page that works on any screen size. It starts with `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">`, otherwise phones render a zoomed-out desktop page.",
        "**Mobile-first** means writing the base styles for small screens and adding `@media (min-width: ...)` rules for larger ones. Small screens get less CSS to override, and you design the essentials first.",
        "Units: `px` is fixed. `rem` is relative to the root font size (usually 16px), so it respects the user's browser font setting. `em` is relative to the current element's font size. `%` is relative to the parent. `vw`/`vh` are 1% of the viewport width or height. `clamp(min, preferred, max)` picks a value between limits.",
      ],
      deeper: [
        "**Container queries** (supported in all major browsers since 2023) let a component respond to the size of its container, not the viewport. Mark the parent with `container-type: inline-size`, then use `@container (min-width: 400px)`. A card can then be compact in a sidebar and wide in the main area on the same screen.",
        "Fluid typography: `font-size: clamp(1rem, 0.9rem + 1vw, 1.5rem)` grows smoothly with the viewport but never below 1rem or above 1.5rem. Always mix in a rem part so zooming still works.",
        "On mobile, `100vh` can be taller than the visible area because of the browser's address bar. The newer units `svh`, `lvh` and `dvh` (small, large and dynamic viewport height) fix that; `min-height: 100dvh` is the usual choice now.",
        "Responsive images: `srcset` and `sizes` let the browser pick the right file size; `<picture>` lets you switch formats or crops. Always set `width` and `height` (or `aspect-ratio`) to avoid layout shift.",
      ],
      why: "Most traffic is on phones, and the same component often appears in places of different widths. Fluid units and queries let one codebase serve every screen.",
      analogy: "Water takes the shape of its container. Fluid units are the water; media queries are deciding which glass to pour into for each room; container queries let each glass decide for itself, wherever it's placed.",
      code: {
        lang: 'css',
        source: `/* Mobile-first base */
.grid { display: grid; gap: 1rem; grid-template-columns: 1fr; }
h1 { font-size: clamp(1.75rem, 1.2rem + 2.5vw, 3rem); } /* fluid, with limits */
.hero { min-height: 100dvh; } /* dynamic viewport height, mobile-safe */

/* Larger screens: add, don't override everything */
@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1200px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}

/* Container queries: the card adapts to where it is placed */
.card-wrapper { container-type: inline-size; }

.card { display: grid; gap: 0.75rem; }
@container (min-width: 420px) {
  .card { grid-template-columns: 120px 1fr; } /* image beside text when there's room */
}

/* Respect user preferences too */
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}`,
      },
      output: "On a phone the grid is one column, at 768px two, at 1200px three. The h1 scales smoothly between 28px and 48px. The same card stacks its image above the text in a narrow sidebar, but shows image and text side by side in the wide main column, on the same screen. Users who ask for reduced motion get almost no animation.",
      questions: [
        { q: 'What does mobile-first mean in CSS?', a: 'Base styles target small screens, and `min-width` media queries add or change styles for larger screens. Small devices load less override CSS, and the design focuses on essentials first.' },
        { q: 'rem vs em?', a: 'rem is relative to the root (html) font size, so it is consistent everywhere. em is relative to the current element\'s font size, so it compounds when nested. I use rem for most sizing and em for things that should scale with their own text, like button padding.' },
        { q: 'What are container queries?', a: 'Queries based on the size of a parent container instead of the viewport. You set `container-type: inline-size` on the parent and use `@container (min-width: ...)`, so a component adapts wherever it is placed.' },
        { q: 'What does clamp() do?', a: '`clamp(min, preferred, max)` returns the preferred value but never below min or above max. It is commonly used for fluid font sizes and spacing.' },
        { q: 'Why is 100vh a problem on mobile?', a: 'Mobile browsers have toolbars that appear and hide, so 100vh can be taller than the visible area. Use `dvh`, `svh` or `lvh` units, typically `min-height: 100dvh`.' },
      ],
      answer30: "I build mobile-first: base styles for small screens, then min-width media queries to enhance for larger ones, plus the viewport meta tag. I size with rem so user font settings are respected, use clamp for fluid type, and Grid with auto-fit for layouts that adapt without breakpoints. For reusable components I prefer container queries, so a card adapts to its container rather than the viewport. On mobile I use dvh instead of vh for full-height sections.",
      mistakes: [
        'Forgetting the viewport meta tag.',
        'Using px for font sizes everywhere, which ignores the user\'s preferred text size.',
        'Desktop-first CSS with many `max-width` overrides that fight each other.',
        'Fluid type using only `vw`, which breaks browser zoom.',
        "Trap: 'Can a container query style the container itself?' No. A container can't query its own size; you style its descendants.",
      ],
      takeaway: 'Mobile-first, rem and clamp for sizing, media queries for the page, container queries for components.',
    },

    {
      id: 'css-variables',
      title: 'CSS custom properties (variables)',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Custom properties like --brand are live values that cascade and inherit, can change at runtime, and power theming.',
      what: [
        "A custom property is a variable you define in CSS with two dashes, `--brand: #2563eb;`, and read with `var(--brand)`. `var(--gap, 1rem)` gives a fallback if it isn't set.",
        "Defining them on `:root` makes them global. Defining them on a component overrides them for that element and its children, because they cascade and inherit like normal properties.",
      ],
      deeper: [
        "The big difference from SCSS variables: SCSS variables are replaced at build time and disappear. CSS variables exist in the browser, so you can change them with a class, a media query, or JavaScript (`el.style.setProperty('--x', '10px')`), and everything using them updates.",
        "That's what makes theming cheap: define design tokens as variables, then swap their values under `[data-theme=\"dark\"]` or `@media (prefers-color-scheme: dark)`. Tailwind v4, shadcn/ui and most modern design systems are built on this.",
        "An invalid value doesn't fall back to the previous rule: if `--size: red` is used in `width: var(--size)`, width becomes its initial or inherited value ('invalid at computed-value time'). `@property` lets you register a variable with a type (`<color>`, `<length>`), an initial value and inheritance, which also makes it animatable.",
      ],
      why: "Hard-coded colours and spacing get duplicated hundreds of times. Variables give one source of truth for design tokens and make dark mode and per-component theming a few lines of CSS.",
      analogy: "A paint colour name like 'Ocean Blue' in a decorator's plan. Change what 'Ocean Blue' means once, and every wall painted with it updates. A room can also say 'in here, Ocean Blue means a lighter shade'.",
      code: {
        lang: 'css',
        source: `:root {
  --color-bg: #ffffff;
  --color-text: #111827;
  --color-brand: #2563eb;
  --radius: 8px;
  --space: 1rem;
}

[data-theme="dark"] {
  --color-bg: #0b1120;
  --color-text: #e5e7eb;
  --color-brand: #60a5fa;
}

body { background: var(--color-bg); color: var(--color-text); }

.btn {
  padding: calc(var(--space) * 0.5) var(--space);
  border-radius: var(--radius);
  background: var(--color-brand);
}

/* Local override: only this section's buttons are compact */
.toolbar { --space: 0.5rem; }

/* Fallback when the variable isn't defined */
.badge { gap: var(--badge-gap, 4px); }

/* Typed, animatable custom property */
@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
.spinner { background: conic-gradient(from var(--angle), #2563eb, transparent); transition: --angle 1s; }
.spinner:hover { --angle: 360deg; }`,
      },
      output: "Adding `data-theme=\"dark\"` to `<html>` (for example from a toggle button) instantly switches every background, text and brand colour, with no extra CSS per component. Buttons inside `.toolbar` get half the padding because `--space` is overridden there. The spinner's gradient rotates smoothly on hover because `--angle` is a registered angle.",
      questions: [
        { q: 'CSS variables vs SCSS variables?', a: 'SCSS variables are compiled away at build time and cannot change in the browser. CSS custom properties live at runtime, cascade and inherit, and can be changed by classes, media queries or JavaScript.' },
        { q: 'How would you implement dark mode with CSS variables?', a: 'Define colour tokens on `:root`, redefine them under a `[data-theme=\"dark\"]` selector or a `prefers-color-scheme: dark` media query, and use only the variables in components.' },
        { q: 'How do you change a CSS variable from JavaScript?', a: '`element.style.setProperty(\"--name\", value)` to set it, and `getComputedStyle(element).getPropertyValue(\"--name\")` to read it.' },
        { q: 'What is @property for?', a: 'It registers a custom property with a type, an initial value and whether it inherits. Typed properties can be animated and transitioned, and invalid values fall back to the initial value.' },
      ],
      answer30: "Custom properties are CSS variables like --brand, read with var() and an optional fallback. Unlike SCSS variables, they exist at runtime: they cascade and inherit, so I can override them for a component, in a media query, or from JavaScript. That makes them the basis for design tokens and theming: define colours on :root and redefine them under a dark theme selector, and every component updates without extra CSS.",
      mistakes: [
        'Expecting a variable defined on one component to be available on its siblings or parents. It only inherits downward.',
        'Using CSS variables inside media query conditions, like `@media (min-width: var(--md))`, which does not work.',
        'Forgetting a fallback for optional variables.',
        "Trap: 'Can you transition a normal custom property?' Not smoothly; unregistered properties switch instantly. Register it with `@property` and a type first.",
      ],
      takeaway: 'CSS variables are runtime, cascading tokens: perfect for theming, unlike build-time SCSS variables.',
    },

    {
      id: 'transitions-animations',
      title: 'Transitions, animations, and performance',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Transitions animate between two states, keyframe animations run sequences; animate transform and opacity to stay smooth.',
      what: [
        "A **transition** animates a property when its value changes, for example on hover: `transition: transform 200ms ease`. It needs a start and end state and a trigger.",
        "A **keyframe animation** (`@keyframes` plus `animation`) runs a sequence of steps on its own, can loop, and doesn't need a trigger. Spinners, skeleton shimmer and attention pulses use these.",
      ],
      deeper: [
        "The browser renders in steps: style, **layout** (sizes and positions), **paint** (pixels), and **composite** (layers combined, often on the GPU). Animating `width`, `height`, `top` or `margin` triggers layout on every frame, which is slow. Animating `background-color` or `box-shadow` triggers paint. Animating `transform` and `opacity` can usually skip both and run on the compositor, so they stay at 60fps even when the main thread is busy.",
        "So: move with `transform: translate()`, resize with `scale()`, fade with `opacity`. `will-change: transform` hints the browser to create a layer ahead of time, but every layer costs memory, so add it only to elements that will really animate.",
        "Respect `prefers-reduced-motion`: reduce or remove large movement for users who get motion sickness. In JavaScript, the Web Animations API (`el.animate()`) and `requestAnimationFrame` are the tools; never animate with `setInterval`. The View Transitions API animates between page or DOM states; it's supported in Chromium and Safari, and Firefox support for same-document transitions arrived more recently, so check targets.",
      ],
      why: "Smooth motion makes UI feel fast and understandable; janky motion makes it feel broken. Knowing which properties are cheap is a common performance interview question.",
      analogy: "Moving a framed photo on a table (transform) is easy. Repainting the photo every frame (paint) is slower. Rearranging all the furniture in the room every frame because the photo grew (layout) is slowest.",
      code: {
        lang: 'css',
        source: `/* Transition: hover lift, using transform not top/margin */
.card {
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.12);
}

/* Slide-in panel: translate instead of animating 'left' or 'width' */
.drawer { transform: translateX(100%); transition: transform 250ms ease-out; }
.drawer.open { transform: translateX(0); }

/* Keyframe animation: loading skeleton */
@keyframes shimmer {
  from { opacity: 0.5; }
  50%  { opacity: 1; }
  to   { opacity: 0.5; }
}
.skeleton { animation: shimmer 1.2s ease-in-out infinite; }

/* Keyframes: spinner */
@keyframes spin { to { transform: rotate(360deg); } }
.spinner { animation: spin 0.8s linear infinite; }

/* Respect users who prefer less motion */
@media (prefers-reduced-motion: reduce) {
  .card, .drawer { transition: none; }
  .spinner { animation-duration: 2s; }
}`,
      },
      output: "Cards lift slightly on hover and the drawer slides in smoothly, without the page reflowing, because only transform changes. Skeletons pulse and spinners rotate continuously. Users with reduced motion enabled see instant state changes and a slower spinner.",
      questions: [
        { q: 'Transition vs animation?', a: 'A transition animates between two values when a property changes, needing a trigger like hover or a class change. A keyframe animation defines multiple steps, runs on its own, and can loop or be paused.' },
        { q: 'Which CSS properties are cheapest to animate and why?', a: 'transform and opacity. They usually only affect compositing, so the browser can skip layout and paint and run them on the GPU, keeping animations smooth.' },
        { q: 'Why is animating width or top slow?', a: 'They change layout, so the browser recalculates positions of the element and possibly many others, then repaints, on every frame.' },
        { q: 'What does will-change do?', a: 'It tells the browser a property will change soon so it can prepare, often by promoting the element to its own layer. Overusing it wastes memory, so apply it only to elements that will animate.' },
      ],
      answer30: "Transitions animate a property between two states when it changes; keyframe animations run multi-step sequences on their own. For performance I animate transform and opacity, because they can be handled at the compositing stage and skip layout and paint, while width, top or margin force layout every frame. I use will-change sparingly, and I always respect prefers-reduced-motion.",
      mistakes: [
        'Using `transition: all`, which animates properties you did not intend and can be costly.',
        'Animating `left`, `top`, `width` or `height` for movement and size.',
        'Adding `will-change` to many elements up front.',
        "Trap: 'Can you transition from `display: none`?' Traditionally no, because display isn't animatable. Newer CSS (`transition-behavior: allow-discrete` with `@starting-style`) makes it possible in current browsers; otherwise animate opacity and toggle visibility.",
      ],
      takeaway: 'Animate transform and opacity, avoid layout properties, and honour prefers-reduced-motion.',
    },

    {
      id: 'bem-css-architecture',
      title: 'BEM and CSS architecture',
      level: 'intermediate',
      priority: 'good',
      frequency: 'occasional',
      summary: 'BEM names classes as block__element--modifier, keeping specificity flat and making styles predictable in large codebases.',
      what: [
        "CSS is global: any rule can affect any element. In big projects that leads to clashes and fear of deleting anything. CSS architecture is a set of naming and structure rules to avoid that.",
        "**BEM** (Block, Element, Modifier) is the most common naming convention. A **block** is a standalone component (`.card`). An **element** is a part of it (`.card__title`). A **modifier** is a variation (`.card--featured`, `.card__title--large`).",
      ],
      deeper: [
        "BEM keeps every selector a single class, so specificity is flat (0,1,0) and the order of rules is easy to reason about. You avoid nesting like `.sidebar .card h2`, which ties styles to page structure and makes overrides hard.",
        "Other approaches: **ITCSS** organizes files by specificity (settings, tools, generic, elements, objects, components, utilities), which maps neatly onto `@layer`. **OOCSS** separates structure from skin. **Utility-first** (Tailwind) avoids naming entirely. **CSS Modules** and CSS-in-JS scope class names automatically, which solves the global-naming problem with tooling instead of discipline.",
        "Whatever the method, the goals are the same: low and consistent specificity, components that don't depend on where they're placed, and design tokens (variables) for colours and spacing.",
      ],
      why: "Without conventions, CSS grows by appending overrides until nobody dares touch it. A naming system makes it clear what each class belongs to and safe to change.",
      analogy: "BEM is a postal address for styles: city (block), street (element), and 'flat B' (modifier). Every class tells you exactly where it belongs, so nothing gets delivered to the wrong house.",
      code: [
        {
          lang: 'html',
          source: `<article class="job-card job-card--featured">
  <h3 class="job-card__title">Node.js Engineer</h3>
  <p class="job-card__meta">Remote · Full-time</p>
  <button class="job-card__action job-card__action--primary">Apply</button>
</article>`,
        },
        {
          lang: 'css',
          source: `/* Every selector is one class: flat, predictable specificity */
.job-card { padding: 1rem; border: 1px solid var(--border); border-radius: 8px; }
.job-card--featured { border-color: var(--brand); }

.job-card__title { font-size: 1.125rem; margin: 0; }
.job-card__meta { color: var(--muted); }

.job-card__action { padding: 0.5rem 1rem; }
.job-card__action--primary { background: var(--brand); color: white; }

/* Avoid: tied to page structure, higher specificity, hard to reuse */
/* .sidebar .jobs div h3 { ... } */`,
        },
      ],
      output: "The card renders with a brand-coloured border because of the featured modifier, and its Apply button uses the primary modifier. Moving the card into a sidebar or a modal doesn't change its look, because no selector depends on where it sits.",
      questions: [
        { q: 'What is BEM?', a: 'A class naming convention: Block (component), Element (part of the block, joined with __), Modifier (variation, joined with --). For example `.card`, `.card__title`, `.card--featured`.' },
        { q: 'Why does BEM avoid nested selectors?', a: 'Nesting raises specificity and ties styles to HTML structure. BEM uses single-class selectors so all rules have the same specificity and components work anywhere.' },
        { q: 'Is BEM still relevant with CSS Modules or Tailwind?', a: 'Less needed, because CSS Modules scope class names and Tailwind avoids custom class names. But BEM is still common in plain CSS and SCSS codebases, and its ideas (flat specificity, component-based naming) still apply.' },
      ],
      answer30: "CSS is global, so large projects need conventions. BEM names classes as block, block__element and block--modifier, so every selector is a single class with flat specificity and components don't depend on where they're placed. Other approaches solve the same problem: ITCSS orders files by specificity, CSS Modules scope names automatically, and Tailwind avoids naming with utilities. The shared goal is low, consistent specificity and reusable components.",
      mistakes: [
        'Deep element chains like `.card__body__title__icon`. Elements belong to the block, not to other elements: use `.card__icon`.',
        'Using a modifier class alone without its base class (`class=\"card--featured\"` without `card`).',
        'Mixing BEM with deep descendant selectors, which defeats the point.',
        "Trap: 'Isn't BEM verbose?' Yes, the names are long, but they are self-documenting, and with SCSS `&__title` the source stays short.",
      ],
      takeaway: 'BEM gives every style one flat class with a clear owner: block__element--modifier.',
    },

    {
      id: 'scss',
      title: 'SCSS: variables, nesting, mixins, functions, partials, @use',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'SCSS is CSS with build-time variables, nesting, mixins, functions and modules; use @use instead of the deprecated @import.',
      what: [
        "SCSS is a syntax of Sass, a CSS preprocessor. You write `.scss` files, and a compiler turns them into plain CSS at build time. Any valid CSS is valid SCSS.",
        "Main features: **variables** (`$brand: #2563eb`), **nesting** (write child selectors inside parents, with `&` for the parent), **mixins** (reusable blocks of declarations, included with `@include`), **functions** (return a value), **partials** (files starting with `_` that are only imported, not compiled alone), and **placeholders** (`%name`) with `@extend`.",
      ],
      deeper: [
        "**`@use` vs `@import`:** `@import` dumped everything into one global namespace, could include a file many times, and made it unclear where a variable came from. `@use` loads a module once, namespaces it (`tokens.$brand`, or `as t` for `t.$brand`), and keeps private members (starting with `-` or `_`) private. `@forward` re-exports modules from an index file. Sass has deprecated `@import` and plans to remove it in Dart Sass 3.0, so new code should use `@use`.",
        "Built-in modules also need `@use`: `sass:math` (use `math.div` instead of `/` for division), `sass:color`, `sass:map`, `sass:list`. LibSass and node-sass are deprecated; use Dart Sass (the `sass` npm package), which Vite and Next.js support out of the box.",
        "Mixin vs `@extend`: a mixin copies declarations into each place it's used (bigger CSS, but predictable). `@extend` groups selectors together (smaller CSS, but can create surprising selector combinations and doesn't work across media queries). Most teams prefer mixins.",
        "Don't nest more than about three levels; deep nesting produces long, high-specificity selectors. Many features (variables, nesting) now exist in native CSS, so some teams drop Sass; it still shines for mixins, loops, maps and functions.",
      ],
      why: "Large stylesheets need reuse and organization: shared tokens, breakpoint helpers, and component files. SCSS gave CSS those tools long before native CSS did, and many codebases still use it.",
      analogy: "SCSS is a recipe template with placeholders and reusable sub-recipes. The compiler is the cook who reads it and produces the actual dish, plain CSS, which is all the browser ever sees.",
      code: [
        {
          lang: 'css',
          title: '_tokens.scss and _mixins.scss (partials)',
          source: `// _tokens.scss
$brand: #2563eb;
$radius: 8px;
$breakpoints: (md: 768px, lg: 1200px);

// _mixins.scss
@use 'sass:map';
@use 'tokens';

@mixin respond($size) {
  @media (min-width: map.get(tokens.$breakpoints, $size)) {
    @content;
  }
}

@mixin focus-ring($color: tokens.$brand) {
  outline: 3px solid $color;
  outline-offset: 2px;
}`,
        },
        {
          lang: 'css',
          title: 'button.scss',
          source: `@use 'sass:color';
@use 'sass:math';
@use 'tokens' as t;   // namespaced: t.$brand
@use 'mixins' as m;

@function rem($px) {
  @return math.div($px, 16px) * 1rem;
}

%reset-button {
  border: 0;
  font: inherit;
  cursor: pointer;
}

.btn {
  @extend %reset-button;
  padding: rem(10px) rem(20px);
  border-radius: t.$radius;
  background: t.$brand;
  color: white;

  &:hover { background: color.mix(black, t.$brand, 15%); }
  &:focus-visible { @include m.focus-ring; }

  &--ghost {               // BEM modifier via &
    background: transparent;
    color: t.$brand;
  }

  @include m.respond(md) {
    padding: rem(12px) rem(28px);
  }
}`,
        },
        {
          lang: 'css',
          title: 'Compiled CSS (abridged)',
          source: `.btn { border: 0; font: inherit; cursor: pointer; }
.btn { padding: 0.625rem 1.25rem; border-radius: 8px; background: #2563eb; color: white; }
.btn:hover { background: rgb(12.33%, 33%, 78.33%); } /* 15% black mixed in; Sass prints more decimals */
.btn:focus-visible { outline: 3px solid #2563eb; outline-offset: 2px; }
.btn--ghost { background: transparent; color: #2563eb; }
@media (min-width: 768px) { .btn { padding: 0.75rem 1.75rem; } }`,
        },
      ],
      output: "Compiling `button.scss` with Dart Sass produces plain CSS: the placeholder's declarations under `.btn`, `rem(10px)` turned into `0.625rem`, `&:hover`, `&:focus-visible` and `&--ghost` expanded to `.btn:hover`, `.btn:focus-visible` and `.btn--ghost`, and the mixin turned into a `@media (min-width: 768px)` block. None of the variables, mixins or functions exist in the output.",
      questions: [
        { q: 'What are the main features of SCSS?', a: 'Variables, nesting with `&`, mixins with `@include`, functions, partials, placeholder selectors with `@extend`, maps and loops, and a module system with `@use` and `@forward`.' },
        { q: '@use vs @import?', a: '@import puts everything in a global namespace and can load a file multiple times. @use loads each module once, namespaces its members, and keeps private members private. @import is deprecated and will be removed in Dart Sass 3.0.' },
        { q: 'Mixin vs @extend?', a: 'A mixin copies its declarations wherever it is included and can take arguments. @extend makes selectors share one rule, giving smaller CSS but sometimes unexpected selectors, and it cannot extend across media queries. Mixins are usually safer.' },
        { q: 'What is a partial?', a: 'An SCSS file whose name starts with an underscore, like `_tokens.scss`. It is not compiled to its own CSS file; it is only loaded by other files with @use or @forward.' },
        { q: 'SCSS variables vs CSS custom properties?', a: 'SCSS variables are replaced at compile time and cannot change at runtime. CSS custom properties live in the browser, cascade, and can be changed by media queries, classes or JavaScript. Many teams use SCSS for build-time helpers and CSS variables for theming.' },
      ],
      answer30: "SCSS is a Sass syntax that compiles to CSS. It adds variables, nesting with the ampersand, mixins for reusable declaration blocks, functions, partials, and a module system. I use @use instead of @import: it namespaces modules, loads them once and keeps private members private, and @import is deprecated. I keep nesting shallow to avoid high specificity, prefer mixins over @extend, use Dart Sass, and use CSS variables for anything that must change at runtime, like themes.",
      mistakes: [
        'Deep nesting that mirrors the HTML, producing long, high-specificity selectors.',
        'Still using `@import` and global variables in new code.',
        'Using `/` for division instead of `math.div`, which is deprecated in Dart Sass.',
        'Using node-sass, which is deprecated; use the `sass` package (Dart Sass).',
        "Trap: 'Can you change a SCSS variable at runtime for dark mode?' No. It no longer exists after compilation; use CSS custom properties for runtime theming.",
      ],
      takeaway: 'SCSS adds build-time variables, nesting, mixins and modules; use @use, keep nesting shallow, theme with CSS variables.',
    },

    {
      id: 'css-in-js-utility-modules',
      title: 'CSS-in-JS vs utility CSS (Tailwind) vs CSS Modules',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Three ways to scope styles in component apps: generated class names (Modules), styles in JavaScript (CSS-in-JS), or composing utility classes (Tailwind).',
      what: [
        "**CSS Modules**: you write normal CSS in `Button.module.css`; the build tool renames classes to unique names (`Button_primary__x7f2a`), so styles can't leak. You import them as an object: `styles.primary`.",
        "**CSS-in-JS** (styled-components, Emotion): styles are written in JavaScript next to the component and can use props directly, like `color: ${p => p.primary ? 'blue' : 'gray'}`.",
        "**Utility-first CSS** (Tailwind): you style by combining small single-purpose classes in the markup (`px-4 py-2 rounded bg-blue-600`). A build step scans your files and generates only the classes you use.",
      ],
      deeper: [
        "Runtime CSS-in-JS (styled-components, Emotion) generates and injects styles in the browser as components render. That costs JavaScript and render time, and it doesn't fit React Server Components, which can't use the context these libraries rely on. styled-components went into maintenance mode in 2025. The trend is towards zero-runtime options (vanilla-extract, Panda CSS, Linaria, StyleX) that extract static CSS at build time.",
        "Tailwind's strengths: no naming, no dead CSS, a consistent design scale, and tiny production CSS. Weaknesses: long class lists, and it needs discipline (components, `cn()`/`clsx` helpers) to stay readable. Dynamic classes must be complete strings: `bg-${color}-500` won't be detected by the scanner.",
        "CSS Modules are the lowest-risk choice: plain CSS, zero runtime, supported by Vite and Next.js out of the box, and they work with Server Components. Dynamic values go through CSS variables (`style={{ '--progress': '40%' }}`).",
      ],
      why: "Global CSS doesn't scale in component-based apps. Each approach solves scoping differently, with different trade-offs in performance, developer experience and SSR support, which is why interviewers ask you to compare them.",
      analogy: "CSS Modules: each flat has its own labelled paint cans. CSS-in-JS: the painter mixes paint on the spot from your instructions every visit. Tailwind: a box of standard colour swatches you combine, with no custom paint at all.",
      code: [
        {
          lang: 'jsx',
          title: 'CSS Modules',
          source: `// Button.module.css:  .button { padding: 8px 16px; }  .primary { background: #2563eb; color: white; }
import styles from './Button.module.css';

export function Button({ primary, children }) {
  return (
    <button className={primary ? \`\${styles.button} \${styles.primary}\` : styles.button}>
      {children}
    </button>
  );
}`,
        },
        {
          lang: 'jsx',
          title: 'CSS-in-JS (styled-components / Emotion style)',
          source: `import styled from 'styled-components';

const StyledButton = styled.button\`
  padding: 8px 16px;
  background: \${(p) => (p.$primary ? '#2563eb' : '#e5e7eb')};
  color: \${(p) => (p.$primary ? 'white' : '#111827')};
\`;

export const Button = ({ primary, children }) => <StyledButton $primary={primary}>{children}</StyledButton>;`,
        },
        {
          lang: 'jsx',
          title: 'Tailwind',
          source: `import { clsx } from 'clsx';

export function Button({ primary, children }) {
  return (
    <button
      className={clsx(
        'rounded px-4 py-2 font-medium',
        primary ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-900',
      )}
    >
      {children}
    </button>
  );
}`,
        },
      ],
      output: "All three render the same two-style button. CSS Modules output a scoped class like `Button_primary__x7f2a` from a static CSS file. styled-components generates a class and injects a style tag at runtime. Tailwind outputs only the utility classes used across the project into one small CSS file.",
      questions: [
        { q: 'What problem do CSS Modules solve?', a: 'Global name clashes. Class names are rewritten to unique names at build time, so each component\'s styles are scoped locally while you still write plain CSS with no runtime cost.' },
        { q: 'What are the downsides of runtime CSS-in-JS?', a: 'Styles are generated in the browser during render, which adds JavaScript and slows rendering, and it does not work well with React Server Components or streaming SSR without extra setup.' },
        { q: 'Pros and cons of Tailwind?', a: 'Pros: no naming, consistent design tokens, no unused CSS, small output, fast to build. Cons: long class lists in markup, a learning curve, and dynamic class names must be written in full so the scanner finds them.' },
        { q: 'Which would you choose for a new Next.js App Router project?', a: 'Tailwind or CSS Modules, since both produce static CSS and work with Server Components. I would avoid runtime CSS-in-JS, or pick a zero-runtime library if the team wants styles in TypeScript.' },
      ],
      answer30: "All three scope styles to components. CSS Modules rewrite class names at build time, so it's plain CSS with no runtime. Runtime CSS-in-JS like styled-components puts styles in JavaScript with easy prop-based styling, but generates CSS in the browser, costing performance, and fits poorly with Server Components. Tailwind composes utility classes, so there's no naming and tiny CSS, at the cost of long class lists. For new React apps I'd pick Tailwind or CSS Modules.",
      mistakes: [
        "Building Tailwind class names dynamically (`text-${size}`), so they're missing from the generated CSS.",
        'Choosing runtime CSS-in-JS for a new Server Components app without checking compatibility.',
        'Mixing all three approaches in one codebase without a reason.',
        "Trap: 'Is Tailwind just inline styles?' No. It uses classes, so it supports hover, focus, media queries, dark mode and a shared design scale, which inline styles can't.",
      ],
      takeaway: 'CSS Modules: scoped plain CSS. CSS-in-JS: styles in JS, runtime cost. Tailwind: utilities, tiny output.',
    },

    {
      id: 'centering',
      title: 'Centering things',
      level: 'basic',
      priority: 'must',
      frequency: 'very common',
      summary: 'Use flex or grid for centring in both directions, margin auto for horizontal blocks, and text-align for inline content.',
      what: [
        "Which method you use depends on what you're centring. **Inline content** (text, inline images) inside a block: `text-align: center`. **A block with a width**, horizontally: `margin-inline: auto` (or `margin: 0 auto`).",
        "**Anything, in both directions**: make the parent a flex or grid container. `display: grid; place-items: center;` is the shortest. `display: flex; justify-content: center; align-items: center;` also works.",
      ],
      deeper: [
        "**Absolute centring** for overlays and badges: `position: absolute; inset: 0; margin: auto;` with a fixed size, or `top: 50%; left: 50%; transform: translate(-50%, -50%);` for unknown sizes. The transform version can render on half pixels, which may blur text slightly.",
        "Vertical centring only shows if the parent is taller than the child, so give the parent a height or `min-height` (for a full screen, `min-height: 100dvh`).",
        "`margin: auto` on a flex or grid child centres it in both directions, because auto margins absorb free space in both axes there. `align-content: center` now also works on plain block containers in current browsers, but flex or grid is the safest answer in an interview.",
      ],
      why: "It's a classic interview warm-up, and the answer shows whether you know which layout model fits which situation.",
      analogy: "Hanging a picture in the middle of a wall. You can measure from the edges (absolute + transform), or use a frame that automatically holds the picture in the middle (flex or grid).",
      code: {
        lang: 'css',
        source: `/* 1) Both axes, shortest */
.center-grid { display: grid; place-items: center; min-height: 100dvh; }

/* 2) Both axes with flexbox */
.center-flex { display: flex; justify-content: center; align-items: center; min-height: 300px; }

/* 3) Horizontal only: block with a width */
.container { max-width: 960px; margin-inline: auto; }

/* 4) Inline content (text, inline images) */
.title { text-align: center; }

/* 5) Overlay on top of a positioned parent, unknown size */
.parent { position: relative; }
.modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 6) Known size, absolute */
.badge { position: absolute; inset: 0; margin: auto; width: 120px; height: 40px; }

/* 7) Auto margins inside a flex or grid parent */
.flex-parent { display: flex; min-height: 200px; }
.flex-parent > .child { margin: auto; }`,
      },
      output: "Each technique places the child in the centre of its parent. Grid's `place-items` and flexbox centre in both directions; `margin-inline: auto` centres the container horizontally only; `text-align` centres the text inside a block; the absolute versions centre an overlay over its positioned parent regardless of the content around it.",
      questions: [
        { q: 'How do you centre a div horizontally and vertically?', a: 'Make the parent a grid with `place-items: center`, or a flex container with `justify-content: center` and `align-items: center`. The parent needs a height for vertical centring to show.' },
        { q: 'Why does margin: 0 auto not centre vertically?', a: 'In normal block flow, auto vertical margins resolve to zero. Auto margins only absorb vertical space inside flex or grid containers, or for absolutely positioned elements with insets.' },
        { q: 'How do you centre an element of unknown size absolutely?', a: '`position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);` The transform shifts it back by half its own size.' },
      ],
      answer30: "It depends on what I'm centring. For text or inline content, text-align: center. For a block with a width, horizontally, margin-inline auto. For both directions, the parent becomes a grid with place-items: center, or flex with justify-content and align-items center, and the parent needs a height. For overlays I use absolute positioning with top and left 50% and translate minus 50%.",
      mistakes: [
        "Using `text-align: center` to centre a block element; it only centres inline content inside it.",
        'Expecting vertical centring when the parent is only as tall as its content.',
        '`margin: auto` on a block with no width, which already fills the line, so nothing moves.',
        "Trap: 'Why not use `vertical-align: middle`?' It only works for inline and table-cell elements, not for blocks.",
      ],
      takeaway: 'Grid place-items or flex for both axes, margin-inline auto for blocks, text-align for inline content.',
    },

    {
      id: 'critical-rendering-path-css',
      title: 'The critical rendering path from a CSS angle',
      level: 'advanced',
      priority: 'good',
      frequency: 'occasional',
      summary: 'CSS is render-blocking: the browser won\'t paint until it has the CSSOM, so ship critical CSS fast and load the rest without blocking.',
      what: [
        "The critical rendering path is the steps from receiving HTML to showing pixels: parse HTML into the **DOM**, parse CSS into the **CSSOM**, combine them into the **render tree**, calculate **layout**, then **paint** and **composite**.",
        "CSS is **render-blocking**: the browser won't paint anything until it has downloaded and parsed all the CSS in the `<head>`, otherwise you'd see unstyled content flash. So big or slow CSS files delay the first paint.",
      ],
      deeper: [
        "CSS can also block JavaScript: a classic `<script>` that comes after a stylesheet won't run until that stylesheet is loaded, because the script might read styles. That's why CSS goes in the head and scripts use `defer` or `type=\"module\"`.",
        "Speed-ups: keep CSS small (remove unused CSS, which Tailwind does by design), inline the small **critical CSS** for above-the-fold content in a `<style>` tag, and load the rest without blocking. `media` attributes help too: `<link rel=\"stylesheet\" href=\"print.css\" media=\"print\">` doesn't block rendering on screens. `@import` inside CSS is bad because it creates a serial chain of requests.",
        "Fonts: web fonts can hide text until they load. `font-display: swap` shows a fallback font immediately; `<link rel=\"preload\" as=\"font\" crossorigin>` fetches important fonts early. Use `size-adjust` or fallback metrics to reduce the layout shift when the font swaps.",
        "Core Web Vitals link: render-blocking CSS hurts **LCP** (Largest Contentful Paint); images without dimensions and late-loading fonts or banners hurt **CLS** (Cumulative Layout Shift). `content-visibility: auto` lets the browser skip rendering off-screen sections until they're near the viewport.",
      ],
      why: "First paint and LCP are what users feel as 'the page is slow'. CSS is often the hidden blocker, and a few loading changes give big wins.",
      analogy: "A restaurant won't bring any food until the chef has read the whole order (CSS), in case a later line says 'no onions'. A short order for the starter (critical CSS) gets food on the table sooner; the dessert order can arrive later.",
      code: {
        lang: 'html',
        source: `<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <!-- 1) Small critical CSS inlined: first paint needs no extra request -->
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; }
    .hero { min-height: 60dvh; display: grid; place-items: center; }
  </style>

  <!-- 2) Preload the main font, show fallback text while it loads -->
  <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />
  <style>
    @font-face { font-family: Inter; src: url(/fonts/inter.woff2) format('woff2'); font-display: swap; }
  </style>

  <!-- 3) Main stylesheet: render-blocking, keep it small -->
  <link rel="stylesheet" href="/css/app.css" />

  <!-- 4) Only blocks when printing -->
  <link rel="stylesheet" href="/css/print.css" media="print" />

  <!-- 5) Scripts don't block parsing -->
  <script src="/js/app.js" defer></script>
</head>
<body>
  <section class="hero"><h1>Find your next role</h1></section>
  <!-- Reserve space for images to avoid layout shift (CLS) -->
  <img src="/team.webp" width="1200" height="600" alt="Our team" loading="lazy" />
  <section style="content-visibility: auto; contain-intrinsic-size: auto 800px;">Long footer content</section>
</body>`,
      },
      output: "The hero renders as soon as app.css arrives, styled by the inlined rules. Text appears straight away in a system font and switches to Inter when it loads. print.css downloads at low priority without blocking the screen render. The image has reserved space, so nothing jumps when it loads, and the long section below is only rendered when it scrolls near the viewport.",
      questions: [
        { q: 'Why is CSS render-blocking?', a: 'The browser needs the full CSSOM to know how anything looks. Painting before CSS arrives would show unstyled content and then reflow, so it waits for stylesheets in the head before the first paint.' },
        { q: 'What is critical CSS?', a: 'The minimal CSS needed to render above-the-fold content. Inlining it in the head lets the first paint happen without waiting for the full stylesheet, which can then load without blocking.' },
        { q: 'Why is @import in CSS bad for performance?', a: 'The browser only discovers the imported file after downloading and parsing the first one, creating a chain of sequential requests that delays rendering. Use multiple link tags or bundle the files.' },
        { q: 'What does font-display: swap do?', a: 'It shows text immediately in a fallback font and swaps in the web font when it loads, instead of hiding text. It improves perceived speed but can cause a small layout shift.' },
        { q: 'How does CSS affect Core Web Vitals?', a: 'Large render-blocking CSS delays LCP. Missing image dimensions, late fonts and injected banners cause CLS. Heavy CSS animations on layout properties can hurt INP by keeping the main thread busy.' },
      ],
      answer30: "The browser builds the DOM and the CSSOM, combines them into a render tree, then does layout, paint and composite. CSS is render-blocking, so nothing paints until the head's stylesheets are loaded, and it also delays scripts placed after it. So I keep CSS small and remove unused rules, inline critical above-the-fold CSS, use media attributes for non-screen styles, avoid @import, preload key fonts with font-display swap, and set image dimensions to avoid layout shift.",
      mistakes: [
        'Using `@import` in CSS files for production.',
        'Shipping one huge stylesheet with lots of unused CSS from a UI library.',
        'Images and embeds without width and height, causing layout shift.',
        "Trap: 'Does CSS block HTML parsing?' No, the parser keeps building the DOM. CSS blocks rendering, and it blocks running scripts that come after it.",
      ],
      takeaway: 'CSS blocks first paint: keep it small, inline the critical part, and avoid @import and layout shifts.',
    },
  ],

  rapidFire: [
    { q: 'Button or link?', a: 'Link navigates; button performs an action.' },
    { q: 'First rule of ARIA?', a: 'Don\'t use ARIA if a native element does the job.' },
    { q: 'Alt text for a decorative image?', a: 'Empty: `alt=""`.' },
    { q: 'WCAG AA contrast for normal text?', a: '4.5:1 (3:1 for large text and UI components).' },
    { q: ':focus vs :focus-visible?', a: ':focus-visible shows only when a focus ring helps, usually keyboard use.' },
    { q: 'Is client-side validation enough?', a: 'No, always validate again on the server.' },
    { q: 'What does box-sizing: border-box do?', a: 'Width and height include padding and border.' },
    { q: 'Do horizontal margins collapse?', a: 'No, only vertical margins between blocks in normal flow.' },
    { q: 'Specificity of `#nav .item a`?', a: '(1,1,1): one ID, one class, one element.' },
    { q: 'What wins: unlayered styles or @layer styles?', a: 'Unlayered normal styles beat all layers.' },
    { q: 'Specificity of :where()?', a: 'Always zero.' },
    { q: 'absolute is positioned relative to what?', a: 'The nearest positioned ancestor (or the initial containing block).' },
    { q: 'Name three things that create a stacking context.', a: 'z-index on a positioned element, opacity below 1, transform.' },
    { q: 'What does flex: 1 expand to?', a: '`flex: 1 1 0%`.' },
    { q: 'Fix for a flex child overflowing with long text?', a: '`min-width: 0` on the child.' },
    { q: 'Responsive grid without media queries?', a: '`repeat(auto-fit, minmax(250px, 1fr))`.' },
    { q: 'rem vs em?', a: 'rem is relative to the root font size; em to the element\'s own font size.' },
    { q: 'What do container queries respond to?', a: 'The size of a parent container marked with container-type.' },
    { q: 'Cheapest properties to animate?', a: 'transform and opacity.' },
    { q: 'BEM stands for?', a: 'Block, Element, Modifier: `.block__element--modifier`.' },
    { q: '@use vs @import in Sass?', a: '@use is namespaced and loads once; @import is deprecated.' },
    { q: 'Can you change a SCSS variable at runtime?', a: 'No, use CSS custom properties.' },
    { q: 'Shortest way to centre in both axes?', a: '`display: grid; place-items: center;`' },
    { q: 'Is CSS render-blocking?', a: 'Yes, stylesheets in the head block the first paint.' },
  ],
};

export default htmlCss;
