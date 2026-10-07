// UI Libraries stack. Topics are auto-sorted Basic -> Intermediate -> Advanced by the registry.
// Your resume (projects.js) doesn't name a UI library. This notebook app itself is styled with Tailwind CSS v3.

const uiLibraries = {
  name: 'UI Libraries',
  intro: 'Choosing and using component libraries: Material UI, Tailwind, shadcn/ui and Radix, plus theming, accessibility, forms and bundle size. Library versions move fast, so check the notes.',
  topics: [
    {
      id: 'choosing-ui-library',
      title: 'Choosing a UI library',
      level: 'basic',
      priority: 'must',
      frequency: 'common',
      summary: 'Pick between full component kits, headless primitives and utility CSS based on design freedom, speed, accessibility, bundle size and team skills.',
      note: "Your resume doesn't name a UI library for Skillkeepr or Octagnt. Say what you actually used there. You can honestly mention that this interview-prep app is built with React, Vite and Tailwind CSS v3.",
      what: [
        "There are three broad kinds of UI tooling. **Styled component kits** (Material UI, Ant Design, Chakra UI, Mantine) give you ready-made, styled components: buttons, tables, date pickers. **Headless libraries** (Radix UI, React Aria, Headless UI, Base UI) give behaviour and accessibility with no styling. **Utility CSS** (Tailwind) gives styling tools but no components.",
        "Popular combinations sit in between: **shadcn/ui** copies Radix-based components styled with Tailwind into your own codebase.",
      ],
      deeper: [
        "Questions to ask: Does the product have its own strong brand design, or is a standard look fine (admin tools often just need MUI or AntD)? Do we need complex components like data grids, date pickers or tree selects? What accessibility level do we need? How much bundle size can we afford? Does it work with our rendering model (React Server Components, SSR)? Is it actively maintained, typed, and documented? What does the team already know?",
        "Trade-off in one line: kits are fastest to start but hardest to make look custom; headless plus your own styles is slower to start but gives full control; owning the code (shadcn) gives control but also makes you responsible for updates.",
        "For an internal dashboard with heavy tables and forms, a kit like MUI or AntD saves weeks. For a consumer product with a custom brand, headless primitives plus Tailwind or a design system usually win.",
      ],
      why: "The UI library shapes every screen, the bundle and the hiring pool for years. Interviewers ask this to see whether you weigh trade-offs or just name your favourite.",
      analogy: "Furnishing a flat. A kit is a fully furnished rental: move in today, but it looks like everyone else's. Headless is a solid frame and plumbing you decorate yourself. Tailwind is a well-organized paint and tool shop.",
      code: {
        lang: 'text',
        title: 'Quick decision table',
        source: `Need                                   Good fit
------------------------------------   ---------------------------------------------
Internal admin, data-heavy, fast       Material UI (+ MUI X Data Grid), Ant Design
Custom brand, full design control      Radix / React Aria (headless) + Tailwind
Custom look, but start fast            shadcn/ui (Radix + Tailwind, code you own)
Simple app, styling only               Tailwind or CSS Modules
Strict accessibility requirements      React Aria, Radix, MUI (all test with AT)
React Server Components / Next.js      Tailwind, CSS Modules, shadcn/ui;
                                       MUI works but its components are client-side

Always check: maintenance, TypeScript types, bundle size, SSR/RSC support, licence
(some advanced components, like MUI X Pro/Premium, are paid).`,
      },
      output: "There is no single best library. The table maps common needs to sensible defaults, and the checklist at the bottom is what you mention to show you've thought about long-term cost, not just the first week.",
      questions: [
        { q: 'How would you choose a UI library for a new project?', a: 'I look at design needs (standard look or custom brand), the components we need (data grids, date pickers), accessibility, bundle size, SSR or Server Components support, maintenance and typing, and what the team knows. Then I pick a kit, headless primitives, or utility CSS accordingly.' },
        { q: 'What is a headless UI library?', a: 'A library that provides behaviour, state and accessibility for components like dialogs, menus and tabs, but no styles, so you style them completely yourself. Examples are Radix UI, React Aria and Headless UI.' },
        { q: 'When would you pick Material UI over Tailwind with shadcn/ui?', a: 'For internal tools and data-heavy dashboards where speed and a complete component set (including data grids) matter more than a unique look. For a custom-branded product I would lean towards shadcn/ui or headless plus Tailwind.' },
        { q: 'What risks come with a big component library?', a: 'Large bundles, difficulty customizing the look, upgrade pain across major versions, and lock-in, since replacing it means touching every screen.' },
      ],
      answer30: "I start from the product. For an internal, data-heavy tool, a full kit like Material UI or Ant Design is fastest because it ships tables, forms and date pickers. For a branded consumer product I prefer headless primitives like Radix or React Aria styled with Tailwind, often through shadcn/ui so we own the code. I also check accessibility, bundle size, Server Components support, maintenance, types and licensing, and what the team already knows.",
      mistakes: [
        'Choosing by popularity alone without checking design needs and component coverage.',
        'Mixing two full component kits in one app, doubling bundle size and visual inconsistency.',
        'Picking a kit, then overriding almost every style to match a custom design.',
        "Trap: 'Is shadcn/ui a library you install?' Not in the usual sense. Its CLI copies component source into your project; you own and maintain that code.",
      ],
      takeaway: 'Kits for speed, headless for control, utilities for styling; decide from design needs, a11y, bundle and team.',
    },

    {
      id: 'material-ui',
      title: 'Material UI: theming, sx, and styled',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'MUI is a full React component kit; customise it globally with createTheme, per instance with sx, and for reusable variants with styled.',
      note: "As of mid-2026 Material UI is on v9 (Material UI and MUI X now share version numbers). The APIs below (createTheme, ThemeProvider, sx, styled) have been stable for several majors, but check the migration guide for the version your project uses.",
      what: [
        "Material UI (MUI) is a large React component library based on Google's Material Design: buttons, inputs, dialogs, tables, menus and more, all accessible and themeable. MUI X adds advanced components like the Data Grid and Date Pickers (some features are paid).",
        "There are three levels of customization. **Theme**: `createTheme` sets colours, typography, spacing, breakpoints and default component styles for the whole app, passed through `<ThemeProvider>`. **sx prop**: one-off styles on a single element, with access to theme values. **styled()**: create a reusable styled version of a component.",
      ],
      deeper: [
        "The `sx` prop understands theme shortcuts: `p: 2` means `padding: theme.spacing(2)` (16px by default), `color: 'primary.main'` reads the palette, and responsive values like `{ xs: 1, md: 3 }` apply at breakpoints.",
        "The theme's `components` key sets default props and `styleOverrides` for every instance of a component, for example all buttons without uppercase text. That's better than overriding the same thing on every screen.",
        "MUI's default styling engine is Emotion, a runtime CSS-in-JS library, which adds JavaScript cost and means MUI components run as Client Components in the Next.js App Router. MUI supports CSS variables in the theme (`cssVariables: true`) and `colorSchemes` for light and dark mode without a flash on load.",
        "Imports: `import Button from '@mui/material/Button'` or named imports from `@mui/material` both tree-shake in modern bundlers; icons from `@mui/icons-material` should be imported by path in dev setups that don't tree-shake well, to avoid slow builds.",
      ],
      why: "MUI lets a small team ship a consistent, accessible, professional UI fast, especially for dashboards and internal tools, while still allowing brand customization through the theme.",
      analogy: "A well-made uniform supplier. The theme is the company dress code (colours, fonts) applied to everyone; sx is pinning a badge on one person's jacket; styled() is ordering a special jacket variant for a whole team.",
      code: {
        lang: 'tsx',
        source: `import { createTheme, ThemeProvider, CssBaseline, Button, Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: true,
  colorSchemes: { light: true, dark: true },   // built-in light and dark palettes
  palette: { primary: { main: '#2563eb' } },
  shape: { borderRadius: 10 },
  typography: { fontFamily: 'Inter, system-ui, sans-serif' },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } }, // every Button
    },
  },
});

// Reusable styled variant
const JobCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(1),
  borderLeft: \`4px solid \${theme.palette.primary.main}\`,
}));

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <JobCard>
        <CardContent>
          <Typography variant="h6">Node.js Engineer</Typography>
          {/* sx: one-off, theme-aware, responsive */}
          <Typography sx={{ color: 'text.secondary', mb: { xs: 1, md: 2 } }}>Remote · Full-time</Typography>
          <Button variant="contained">Apply</Button>
        </CardContent>
      </JobCard>
    </ThemeProvider>
  );
}`,
      },
      output: "The card shows a blue left border from the styled variant, a grey subtitle with more bottom margin on larger screens from sx, and an Apply button in the brand blue with normal-case bold text and no shadow, because the theme overrides apply to every Button in the app.",
      questions: [
        { q: 'How do you customize Material UI?', a: 'Globally with createTheme (palette, typography, spacing, and component defaultProps and styleOverrides) passed to ThemeProvider; per instance with the sx prop; and for reusable variants with styled().' },
        { q: 'What is the sx prop?', a: 'A prop on MUI components for one-off styles. It accepts CSS plus theme shortcuts like `p: 2` for theme spacing, palette paths like `primary.main`, and responsive objects like `{ xs: 1, md: 2 }`.' },
        { q: 'sx vs styled()?', a: 'sx is for one-off tweaks on a single usage. styled() creates a named, reusable component with its own styles, better when the same look appears in many places.' },
        { q: 'What are the downsides of MUI?', a: 'A recognisable Material look that takes effort to brand, a larger bundle, runtime CSS-in-JS cost from Emotion, and components that must be Client Components in the Next.js App Router.' },
      ],
      answer30: "Material UI is a full React component kit. I set brand colours, typography, shape and default component styles once with createTheme and ThemeProvider, using the components key so every Button, for example, drops uppercase text. For one-off tweaks I use the sx prop, which understands theme spacing, palette paths and responsive values. For a reusable variant I use styled. It's great for dashboards, with trade-offs in bundle size and runtime styling.",
      mistakes: [
        'Overriding the same styles with sx on every screen instead of once in the theme.',
        'Hard-coding colours and pixel values instead of using theme tokens.',
        'Importing the whole icons package in a way that slows dev builds.',
        "Trap: 'Does `p: 2` in sx mean 2px?' No. It means `theme.spacing(2)`, which is 16px with the default 8px spacing unit.",
      ],
      takeaway: 'Theme for global rules, sx for one-offs, styled for reusable variants; mind runtime and bundle cost.',
    },

    {
      id: 'tailwind-in-depth',
      title: 'Tailwind CSS in depth',
      level: 'intermediate',
      priority: 'must',
      frequency: 'very common',
      summary: 'Tailwind is utility-first CSS: compose small classes in markup, with variants for states and breakpoints, generated on demand from a design scale.',
      note: "Tailwind isn't on your resume, but this interview-prep app uses Tailwind CSS v3 (tailwind.config.js with PostCSS). The current major is v4 (v4.3 as of mid-2026), which moves configuration into CSS. Be clear which version you are describing.",
      what: [
        "Tailwind gives you thousands of small classes, each doing one thing: `p-4` (padding 1rem), `flex`, `text-sm`, `bg-blue-600`, `rounded-lg`. You build designs by combining them in `className` instead of writing custom CSS.",
        "**Variants** are prefixes for states and conditions: `hover:bg-blue-700`, `focus-visible:ring-2`, `md:grid-cols-2` (from the md breakpoint up, mobile-first), `dark:bg-gray-900`, `disabled:opacity-50`, `group-hover:` and `peer-checked:` for styling based on a parent or sibling.",
        "Tailwind scans your source files and generates CSS only for the classes you use, so production CSS stays small.",
      ],
      deeper: [
        "**v3 vs v4:** v3 uses `tailwind.config.js` with a `content` array of files to scan, and `@tailwind base; @tailwind components; @tailwind utilities;`. v4 (2025) is configured in CSS: `@import \"tailwindcss\";` plus an `@theme { --color-brand: ...; }` block, detects source files automatically, uses real cascade layers, and exposes every theme value as a CSS variable. It also has a much faster engine.",
        "Because the scanner reads plain text, class names must appear complete in the source. `bg-${color}-500` won't work; map to full strings like `{ red: 'bg-red-500' }`. Arbitrary values (`w-[372px]`, `grid-cols-[200px_1fr]`) cover one-offs.",
        "Keeping it maintainable: extract **components** (React components), not `@apply` everywhere. Use `clsx` plus `tailwind-merge` (often wrapped as `cn()`) so conditional classes and overrides like `px-2` vs `px-4` resolve correctly. The official Prettier plugin sorts classes consistently. Libraries like `cva` (class-variance-authority) define variant props such as `size` and `intent`.",
      ],
      why: "It removes naming, keeps styling consistent with a shared scale, avoids dead CSS, and lets you style without switching files. It's also the base of shadcn/ui and many modern design systems.",
      analogy: "LEGO bricks. Each brick (utility) is tiny and standard, so anything you build matches everything else. You don't carve a custom piece (write CSS) for every model, and nothing unused ends up in the box you ship.",
      code: [
        {
          lang: 'css',
          title: 'app.css (Tailwind v4: config lives in CSS)',
          source: `@import "tailwindcss";

@theme {
  --color-brand: #2563eb;
  --color-brand-dark: #1d4ed8;
  --font-sans: "Inter", system-ui, sans-serif;
}

/* class-based dark mode instead of the default prefers-color-scheme */
@custom-variant dark (&:where(.dark, .dark *));`,
        },
        {
          lang: 'tsx',
          title: 'Button.tsx with cva + cn()',
          source: `import { cva, type VariantProps } from 'class-variance-authority';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

const button = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-50',
  {
    variants: {
      intent: {
        primary: 'bg-brand text-white hover:bg-brand-dark',
        ghost: 'bg-transparent text-brand hover:bg-brand/10 dark:text-blue-300',
      },
      size: { sm: 'h-8 px-3 text-sm', md: 'h-10 px-4' },
    },
    defaultVariants: { intent: 'primary', size: 'md' },
  },
);

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>;

export function Button({ intent, size, className, ...rest }: Props) {
  return <button className={cn(button({ intent, size }), className)} {...rest} />;
}

// Usage: caller's px-8 wins over px-4 thanks to tailwind-merge
// <Button size="md" className="px-8 md:w-auto w-full">Apply</Button>`,
        },
      ],
      output: "The button is brand blue with white text, darkens on hover, shows a ring only for keyboard focus, and fades when disabled. With `className=\"px-8 w-full md:w-auto\"` it is full width on phones and auto width from the md breakpoint, and twMerge removes the conflicting `px-4` so `px-8` applies. The `dark:` styles apply when a `.dark` class is on an ancestor.",
      questions: [
        { q: 'What is utility-first CSS?', a: 'Styling by composing small single-purpose classes in the markup, like `flex p-4 text-sm`, instead of writing custom class names and CSS rules for each component.' },
        { q: 'How does Tailwind keep the CSS small?', a: 'It scans your source files for class names and generates only the utilities you actually use, so unused styles never reach production.' },
        { q: 'Why does `bg-${color}-500` not work?', a: 'The scanner reads source text and needs complete class names. A template string is only built at runtime, so the class is never generated. Map values to full class strings instead.' },
        { q: 'What changed in Tailwind v4?', a: 'Configuration moved into CSS with `@import \"tailwindcss\"` and `@theme`, content detection is automatic, theme values become CSS variables, it uses native cascade layers, and the engine is much faster. v3 used tailwind.config.js.' },
        { q: 'How do you keep long Tailwind class lists maintainable?', a: 'Extract React components, use cva for variants, use a `cn()` helper with clsx and tailwind-merge for conditional classes and overrides, and sort classes with the Prettier plugin. Use @apply sparingly.' },
      ],
      answer30: "Tailwind is utility-first: I compose small classes like flex, p-4 and bg-blue-600, and use variants such as hover, focus-visible, md and dark for states and breakpoints, mobile-first. It scans the source and generates only used classes, so the CSS stays tiny, which also means class names must be complete strings. To keep it clean I extract components, use cva for variants and a cn helper with tailwind-merge. In v4, config moved into CSS with @theme.",
      mistakes: [
        'Building class names with template strings so they are never generated.',
        'Overusing `@apply` to recreate BEM-style classes, losing most of the benefits.',
        'Conflicting classes like `p-2 p-4` without tailwind-merge; the winner depends on CSS order, not class order.',
        "Trap: 'Does `md:` mean only on medium screens?' No. It means from the md breakpoint and up; unprefixed classes apply to all sizes.",
      ],
      takeaway: 'Compose utilities with variants, keep class names static, extract components, and use cn() and cva for variants.',
    },

    {
      id: 'shadcn-radix-headless',
      title: 'shadcn/ui and Radix: headless components',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Radix gives unstyled, accessible behaviour; shadcn/ui copies Radix-based, Tailwind-styled components into your repo so you own the code.',
      note: "As of mid-2026, shadcn/ui lets you choose Radix UI or Base UI (from the MUI team) as the primitive layer, and new projects default to Base UI. Radix is still fully supported. The ideas below apply to both.",
      what: [
        "**Headless** components provide behaviour and accessibility without any styles. **Radix UI** primitives handle the hard parts of dialogs, dropdown menus, tabs, popovers and tooltips: focus management, keyboard navigation, ARIA attributes, and closing on Escape or outside click. You add the styles.",
        "**shadcn/ui** is not a normal npm dependency. Its CLI (`npx shadcn@latest add dialog`) copies a ready-made component file into your project, built on headless primitives and styled with Tailwind. From then on, it's your code to change.",
      ],
      deeper: [
        "Radix uses a **compound component** API: `Dialog.Root`, `Dialog.Trigger`, `Dialog.Portal`, `Dialog.Overlay`, `Dialog.Content`, `Dialog.Title`. `asChild` merges Radix behaviour into your own element instead of rendering an extra one, for example making your `Button` the trigger. State attributes like `data-state=\"open\"` let you style and animate open and closed states.",
        "Owning the code is the key trade-off. Pros: complete control, no fighting a library's styles, nothing extra in the bundle. Cons: no automatic upgrades; bug fixes upstream must be pulled in manually, and teams can let copies drift.",
        "shadcn/ui themes through CSS variables (`--primary`, `--background`, and so on) mapped to Tailwind colours, so dark mode and rebranding are mostly variable changes. It also includes a `Form` pattern built on React Hook Form and Zod.",
      ],
      why: "Building an accessible dropdown or dialog from scratch is surprisingly hard. Headless primitives solve behaviour once, while you keep full control of the design.",
      analogy: "Radix is a car's engine, steering and brakes with no body. shadcn/ui is a designer body kit that is bolted on and then handed to you with the keys and the toolbox: you can repaint or reshape it, but servicing is now your job.",
      code: {
        lang: 'tsx',
        source: `// Radix primitive used directly, styled with Tailwind
import * as Dialog from '@radix-ui/react-dialog';

export function DeleteJobDialog({ onConfirm }: { onConfirm: () => void }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="rounded-md bg-red-600 px-3 py-2 text-white">Delete job</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6">
          <Dialog.Title className="text-lg font-semibold">Delete this job?</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-600">This cannot be undone.</Dialog.Description>
          <div className="mt-6 flex justify-end gap-2">
            <Dialog.Close className="rounded-md px-3 py-2">Cancel</Dialog.Close>
            <Dialog.Close onClick={onConfirm} className="rounded-md bg-red-600 px-3 py-2 text-white">Delete</Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// shadcn/ui: run  npx shadcn@latest add dialog button
// then import from YOUR project, e.g. '@/components/ui/dialog', and edit freely.`,
      },
      output: "Clicking 'Delete job' opens a centred dialog over a dimmed backdrop, rendered in a portal at the end of body. Focus moves into the dialog and is trapped there, Escape or Cancel closes it, focus returns to the trigger, and screen readers announce the title and description. None of that behaviour was written by hand.",
      questions: [
        { q: 'What is shadcn/ui, and how is it different from MUI?', a: 'A collection of components you copy into your project with a CLI, built on headless primitives and styled with Tailwind. MUI is an installed dependency you configure; shadcn/ui is source code you own and edit.' },
        { q: 'What does Radix UI provide?', a: 'Unstyled, accessible primitives for interactive components like dialogs, menus, popovers and tabs, handling focus management, keyboard support and ARIA so you only add styles.' },
        { q: 'What does asChild do in Radix?', a: 'It makes Radix pass its behaviour and props onto your child element instead of rendering its own, so your custom Button can act as the trigger without extra DOM nesting.' },
        { q: 'What is the downside of owning component code?', a: 'Upstream fixes and improvements do not arrive automatically. You must update copies yourself, and teams can let them drift into inconsistent versions.' },
      ],
      answer30: "Radix is a headless library: it gives accessible behaviour for dialogs, menus, tabs and popovers, with focus trapping, keyboard support and ARIA, but no styles. shadcn/ui builds on headless primitives and Tailwind, but instead of installing a package, its CLI copies component source into your repo, so you own and can change everything. That gives full design control and a small bundle, with the trade-off that updates are your responsibility.",
      mistakes: [
        'Treating shadcn/ui like an npm package and expecting `npm update` to fix bugs.',
        'Rebuilding dialog focus trapping and keyboard handling by hand instead of using primitives.',
        'Removing `Dialog.Title` because the design has no visible title; give it a visually hidden one so screen readers still get a name.',
        "Trap: 'Is headless the same as unstyled CSS reset?' No. Headless means full behaviour and accessibility logic with no visual opinion.",
      ],
      takeaway: 'Headless primitives handle behaviour and a11y; shadcn/ui gives you styled source you own and maintain.',
    },

    {
      id: 'antd-chakra',
      title: 'Ant Design and Chakra UI, briefly',
      level: 'basic',
      priority: 'rare',
      frequency: 'occasional',
      summary: 'Ant Design is an enterprise-focused kit with very rich data components; Chakra UI is a developer-friendly kit with style props.',
      note: "Both libraries have shipped big rewrites recently (Chakra UI v3 changed many APIs; Ant Design moved to a CSS-in-JS token system in v5 and has continued since). Check the version a codebase uses before quoting APIs.",
      what: [
        "**Ant Design (AntD)** comes from Alibaba and targets enterprise and admin apps. It has a huge set of components: tables with sorting, filtering and pagination built in, Form with validation, tree select, transfer lists, date and range pickers. Its look is clean and business-like.",
        "**Chakra UI** focuses on developer experience: components take **style props** directly (`<Box p={4} bg=\"blue.500\" />`), with a token-based theme, good accessibility, and simple dark mode.",
      ],
      deeper: [
        "AntD theming uses **design tokens** through `ConfigProvider` (`token: { colorPrimary: '#2563eb', borderRadius: 8 }`) and algorithms like `theme.darkAlgorithm`. Its Form manages state and validation itself, which is fast for CRUD screens but a different model from React Hook Form.",
        "Chakra v3 is built on Ark UI (headless state machines) and a recipe-based styling system, and it changed many component APIs from v2. Like MUI, both libraries use runtime CSS-in-JS by default, which matters for bundle size and Server Components.",
        "How to talk about them: know when each fits (AntD for data-heavy admin panels, especially in teams already using it; Chakra for quick, accessible apps with a custom-ish look) and the general trade-offs of kits.",
      ],
      why: "You may join a codebase that uses either, and interviewers sometimes ask how they compare with MUI or Tailwind.",
      analogy: "AntD is an office supply catalogue with every specialised item a back office needs. Chakra is a flexible starter kit where you adjust each piece by turning labelled dials (style props).",
      code: [
        {
          lang: 'tsx',
          title: 'Ant Design: theme tokens and a data table',
          source: `import { ConfigProvider, Table, theme } from 'antd';

const columns = [
  { title: 'Candidate', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
  { title: 'Score', dataIndex: 'score', sorter: (a, b) => a.score - b.score },
];
const data = [{ key: 1, name: 'Asha', score: 82 }, { key: 2, name: 'Ravi', score: 74 }];

export default function Candidates() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#2563eb', borderRadius: 8 }, algorithm: theme.defaultAlgorithm }}>
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} />
    </ConfigProvider>
  );
}`,
        },
        {
          lang: 'tsx',
          title: 'Chakra UI: style props',
          source: `import { Box, Heading, Text, Button } from '@chakra-ui/react';

export function JobCard() {
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" bg={{ base: 'white', _dark: 'gray.800' }}>
      <Heading size="md">Node.js Engineer</Heading>
      <Text color="gray.500" mt={1}>Remote</Text>
      <Button mt={3} colorPalette="blue">Apply</Button>
    </Box>
  );
}`,
        },
      ],
      output: "The AntD table renders sortable Candidate and Score columns with pagination and the brand blue as its primary colour, with no extra code for sorting. The Chakra card renders with padding, a border, rounded corners and a darker background in dark mode, all from props.",
      questions: [
        { q: 'When would you choose Ant Design?', a: 'For enterprise or admin apps with lots of tables, forms, and complex inputs like tree selects and range pickers, where a complete, consistent component set matters more than a unique look.' },
        { q: 'What are Chakra UI style props?', a: 'Props like `p`, `bg`, `mt` and `color` that map to CSS and theme tokens directly on components, so you can style without separate CSS files.' },
        { q: 'How do MUI, AntD and Chakra compare?', a: 'All three are full styled kits with theming. MUI follows Material Design and has MUI X for grids; AntD has the richest enterprise data components; Chakra emphasises developer experience with style props. All have runtime styling costs compared with Tailwind or CSS Modules.' },
      ],
      answer30: "Ant Design is an enterprise-focused kit with very rich data components, like tables with built-in sorting and pagination, forms and tree selects, themed with design tokens through ConfigProvider. Chakra UI is a developer-friendly kit where components take style props mapped to theme tokens, with good accessibility and easy dark mode. I'd consider AntD for data-heavy admin panels and Chakra for fast, accessible apps, keeping in mind both have runtime styling costs.",
      mistakes: [
        'Quoting Chakra v2 APIs for a v3 codebase, or the reverse.',
        'Mixing AntD Form with another form library on the same form.',
        'Importing large AntD locale or icon bundles you do not need.',
        "Trap: 'Are these Server Component friendly?' Their interactive components run as Client Components, so check each library's Next.js App Router guide.",
      ],
      takeaway: 'AntD for enterprise data screens, Chakra for style-prop DX; both are full kits with runtime styling.',
    },

    {
      id: 'design-system',
      title: 'Building a design system and component library',
      level: 'advanced',
      priority: 'good',
      frequency: 'common',
      summary: 'A design system is shared tokens, components, patterns and docs; the component library is its code, versioned and published for many apps.',
      what: [
        "A **design system** is the single source of truth for how a product looks and behaves: **design tokens** (colours, spacing, typography, radii, shadows), **components** (Button, Input, Modal), **patterns** (forms, empty states), and **guidelines** (when to use what, accessibility rules).",
        "The **component library** is the code part: a package of reusable React components built from those tokens, documented (usually in Storybook) and shared across apps.",
      ],
      deeper: [
        "Token layers: **primitive** tokens are raw values (`blue-600: #2563eb`), **semantic** tokens give meaning (`color-action-primary: blue-600`, `color-text-muted`), and optionally component tokens (`button-primary-bg`). Components use semantic tokens only, so a rebrand or dark mode changes the mapping, not the components. Tokens are often stored as JSON and exported to CSS variables, Tailwind theme and native apps with a tool like Style Dictionary.",
        "Component API design: keep props small and consistent (`variant`, `size`, `disabled` everywhere), forward refs and spread remaining props so components behave like native elements, support `className` or `asChild` for escape hatches, and use composition (compound components) over dozens of boolean props. In React 19, `ref` is a normal prop for function components; `forwardRef` still works and is what you'll see in most existing libraries.",
        "Engineering: build on headless primitives for accessibility, write Storybook stories for every state, add visual regression tests (Chromatic, Playwright screenshots) and automated a11y checks (axe), publish as a versioned package with semantic versioning and changelogs (Changesets), ship ESM with `sideEffects` set correctly for tree shaking, and keep React as a peer dependency.",
        "Governance matters as much as code: who approves new components, how designers and engineers stay in sync (Figma variables matching code tokens), and how breaking changes are communicated with codemods or deprecation warnings.",
      ],
      why: "Without a system, every team rebuilds buttons and modals slightly differently, accessibility bugs multiply, and a rebrand touches thousands of files. A design system makes UI consistent and faster to build.",
      analogy: "A city's building code plus a catalogue of pre-approved parts. Architects (teams) still design different buildings, but doors, stairs and fire exits are standard, safe and interchangeable.",
      code: [
        {
          lang: 'json',
          title: 'tokens.json (primitive -> semantic)',
          source: `{
  "color": {
    "blue":  { "600": { "value": "#2563eb" }, "300": { "value": "#93c5fd" } },
    "gray":  { "900": { "value": "#111827" }, "100": { "value": "#f3f4f6" } }
  },
  "semantic": {
    "action-primary": { "value": "{color.blue.600}" },
    "text-default":   { "value": "{color.gray.900}" },
    "surface":        { "value": "{color.gray.100}" }
  },
  "radius": { "md": { "value": "8px" } },
  "space":  { "2": { "value": "0.5rem" }, "4": { "value": "1rem" } }
}`,
        },
        {
          lang: 'tsx',
          title: 'A library-quality Button',
          source: `import { forwardRef } from 'react';
import { cn } from './cn';

type Variant = 'primary' | 'secondary' | 'danger';
type Size = 'sm' | 'md';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary: 'bg-[var(--action-primary)] text-white',
  secondary: 'bg-[var(--surface)] text-[var(--text-default)]',
  danger: 'bg-red-600 text-white',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, disabled, className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}                                  // consumers can focus or measure it
      type="button"                              // safe default inside forms
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn('rounded-[var(--radius-md)] font-medium', size === 'sm' ? 'h-8 px-3' : 'h-10 px-4', variants[variant], className)}
      {...rest}                                  // onClick, aria-*, data-* pass through
    >
      {loading ? 'Saving...' : children}
    </button>
  );
});`,
        },
      ],
      output: "The tokens file defines raw colours once and semantic names that point at them; a build step turns it into CSS variables like `--action-primary`. The Button only uses semantic variables, accepts every native button prop, forwards its ref, defaults to `type=\"button\"`, and shows a disabled, busy state while loading. Changing `action-primary` in the tokens rebrands every primary button in every app.",
      questions: [
        { q: 'What is a design system?', a: 'A shared source of truth for UI: design tokens, reusable components, patterns and usage guidelines, kept in sync between design (Figma) and code (a component library).' },
        { q: 'What are design tokens, and why use semantic tokens?', a: 'Tokens are named design values like colours and spacing. Semantic tokens such as `color-action-primary` describe purpose, so themes, dark mode and rebrands change the mapping in one place instead of every component.' },
        { q: 'What makes a good component API?', a: 'Consistent, minimal props (variant, size), native props passed through, refs forwarded, accessible defaults, composition over many booleans, and an escape hatch like className or asChild.' },
        { q: 'How would you ship and maintain a shared component library?', a: 'Publish a versioned package with semantic versioning and changelogs, document every component in Storybook, run visual regression and axe accessibility tests in CI, ship tree-shakable ESM, and provide migration notes or codemods for breaking changes.' },
      ],
      answer30: "A design system is tokens, components, patterns and guidelines shared by design and engineering. I'd define primitive tokens and semantic tokens on top, exported to CSS variables, so theming is a mapping change. Components are built on headless primitives for accessibility, with small consistent APIs, forwarded refs and native props passed through. Each is documented in Storybook with visual and axe tests, and the library is published as a versioned, tree-shakable package with changelogs.",
      mistakes: [
        'Components using raw hex values instead of semantic tokens, so dark mode means editing everything.',
        'Boolean prop explosion (`isPrimary`, `isLarge`, `isOutlined`) instead of `variant` and `size`.',
        'Not forwarding refs or spreading props, so consumers cannot focus the component or add aria attributes.',
        'Shipping breaking changes without a major version or migration notes.',
        "Trap: 'Should the design system include business components like JobCard?' Usually no. Keep the core generic; product teams compose domain components on top.",
      ],
      takeaway: 'Semantic tokens, accessible composable components, Storybook docs and disciplined versioning.',
    },

    {
      id: 'theming-dark-mode',
      title: 'Theming and dark mode',
      level: 'intermediate',
      priority: 'must',
      frequency: 'common',
      summary: 'Define colours as CSS variables, switch their values per theme, respect the OS preference, persist the user\'s choice, and avoid a flash on load.',
      what: [
        "Dark mode works best when components never use raw colours. They use semantic variables like `--bg` and `--text`, and a theme just changes what those variables are.",
        "There are two triggers: the system setting (`@media (prefers-color-scheme: dark)`), and a user toggle that sets a class or attribute like `data-theme=\"dark\"` on `<html>` and saves the choice in localStorage. The usual design is three options: Light, Dark, System.",
      ],
      deeper: [
        "**Flash of incorrect theme:** if the theme is applied by React after hydration, users see a white flash first. Fix it with a tiny inline script in `<head>` that reads localStorage and sets the class before the first paint. Libraries like `next-themes` do this for you, and MUI's `colorSchemes` with CSS variables provides `InitColorSchemeScript` for the same reason.",
        "Also set `color-scheme: light dark` (or per theme) so native controls, scrollbars and form inputs match. Newer CSS has `light-dark(#fff, #111)` to pick a value based on the active color-scheme.",
        "Dark mode isn't just inverted colours: use dark grey rather than pure black, slightly desaturated brand colours, lighter surfaces for elevation instead of shadows, and re-check contrast ratios. Images and charts may need their own variants.",
        "In Tailwind, `dark:` variants follow the media query by default; switch them to a class strategy (v3: `darkMode: 'class'`; v4: `@custom-variant dark`) to support a manual toggle.",
      ],
      why: "Users expect dark mode, and many enable it system-wide. Done with tokens, it's cheap; done with per-component overrides, it doubles your CSS and breaks constantly.",
      analogy: "Stage lighting. The set and actors (components) stay the same; the lighting desk (theme variables) switches between day and night scenes. You never repaint the set.",
      code: [
        {
          lang: 'html',
          title: 'index.html: set the theme before first paint',
          source: `<head>
  <script>
    // Runs before CSS paints anything: no white flash
    (function () {
      try {
        var saved = localStorage.getItem('theme'); // 'light' | 'dark' | null (system)
        var dark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.dataset.theme = dark ? 'dark' : 'light';
      } catch (e) {}
    })();
  </script>
  <link rel="stylesheet" href="/app.css" />
</head>`,
        },
        {
          lang: 'css',
          title: 'app.css',
          source: `:root {
  color-scheme: light;
  --bg: #ffffff;
  --surface: #f3f4f6;
  --text: #111827;
  --brand: #2563eb;
}
:root[data-theme="dark"] {
  color-scheme: dark;     /* native inputs and scrollbars go dark too */
  --bg: #0b1120;          /* dark grey-blue, not pure black */
  --surface: #172033;
  --text: #e5e7eb;
  --brand: #60a5fa;       /* lighter brand for contrast on dark */
}
body { background: var(--bg); color: var(--text); }
.card { background: var(--surface); }`,
        },
        {
          lang: 'tsx',
          title: 'ThemeToggle.tsx',
          source: `import { useEffect, useState } from 'react';

type Choice = 'light' | 'dark' | 'system';

export function ThemeToggle() {
  const [choice, setChoice] = useState<Choice>(() => (localStorage.getItem('theme') as Choice) || 'system');

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = choice === 'dark' || (choice === 'system' && media.matches);
      document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    };
    apply();
    if (choice === 'system') localStorage.removeItem('theme');
    else localStorage.setItem('theme', choice);
    media.addEventListener('change', apply); // follow OS changes live in 'system' mode
    return () => media.removeEventListener('change', apply);
  }, [choice]);

  return (
    <select aria-label="Theme" value={choice} onChange={(e) => setChoice(e.target.value as Choice)}>
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  );
}`,
        },
      ],
      output: "On first visit the page follows the OS setting with no flash. Choosing Dark switches every colour instantly and is remembered on reload. Choosing System clears the saved value, and if the OS switches to dark at sunset, the page follows live. Native inputs and scrollbars match because of color-scheme.",
      questions: [
        { q: 'How would you implement dark mode?', a: 'Use semantic CSS variables for all colours, redefine them under a `data-theme=\"dark\"` attribute or class, default to `prefers-color-scheme`, let users choose Light, Dark or System, and save the choice in localStorage.' },
        { q: 'How do you avoid the flash of the wrong theme?', a: 'Apply the theme before first paint with a small inline script in the head that reads the saved preference and sets the attribute on the html element, instead of waiting for React to hydrate.' },
        { q: 'What does the color-scheme property do?', a: 'It tells the browser which colour schemes the page supports, so built-in UI like form controls, scrollbars and default backgrounds render in matching light or dark styles.' },
        { q: 'Why not just invert colours for dark mode?', a: 'Inversion breaks images and brand colours and often gives harsh contrast. Dark themes need tuned greys, adjusted brand shades, different elevation cues, and rechecked contrast.' },
      ],
      answer30: "I theme with semantic CSS variables, so components never use raw colours, and redefine those variables under a data-theme attribute on the html element. By default I follow prefers-color-scheme, and a Light, Dark, System toggle saves the user's choice in localStorage. To avoid a white flash, a tiny inline script in the head sets the attribute before first paint. I also set color-scheme so native controls match, and recheck contrast in dark mode.",
      mistakes: [
        'Applying the theme in a React effect only, causing a flash on every load.',
        'Writing `dark:` overrides on every component instead of switching tokens.',
        'Pure black backgrounds with pure white text, which is harsh and causes smearing on some screens.',
        "Trap: 'Server rendering: why is there a hydration warning on the theme toggle?' The server can't know localStorage, so it renders a different value. Render a neutral state until mounted, or suppress the warning on the attribute only.",
      ],
      takeaway: 'Semantic variables per theme, OS default plus saved choice, and an inline head script to prevent the flash.',
    },

    {
      id: 'a11y-component-libraries',
      title: 'Accessibility in component libraries',
      level: 'intermediate',
      priority: 'good',
      frequency: 'occasional',
      summary: 'Good libraries handle keyboard, focus and ARIA for complex widgets, but you still must provide labels, names and correct usage.',
      what: [
        "Complex widgets like dialogs, menus, comboboxes, tabs and date pickers need a lot of hidden work: correct roles, keyboard support (arrows, Home/End, Escape, typeahead), focus trapping, and announcing state. The WAI-ARIA Authoring Practices Guide (APG) documents the expected behaviour for each.",
        "Libraries like Radix, React Aria, MUI and Chakra implement these patterns and test them with screen readers. That's one of the strongest reasons to use them instead of building widgets from scratch.",
        "A library can't fix everything: you still need to give inputs labels, icon buttons accessible names, dialogs titles, and choose the right component (a menu is for actions, a select is for choosing a value).",
      ],
      deeper: [
        "Common app-level gaps even with a good library: missing `aria-label` on icon-only buttons, placeholder used instead of a label, custom colours that break contrast, removing focus styles in the theme, error messages not linked to fields, and toasts that are not announced.",
        "Testing: automated checks (axe via `jest-axe`, `@axe-core/playwright`, Storybook's a11y addon, eslint-plugin-jsx-a11y) catch roughly a third to a half of issues. Keyboard-only walkthroughs and a real screen reader (VoiceOver, NVDA) catch the rest. React Testing Library's `getByRole` queries also nudge you towards accessible markup.",
        "When wrapping a library component in your own, keep the accessibility: forward refs (focus management needs them), pass through `aria-*` props, and don't put interactive elements inside other interactive elements.",
      ],
      why: "Accessibility bugs in a shared component multiply across every screen, but so do fixes. Using and wrapping libraries correctly gives the whole app solid accessibility.",
      analogy: "A car with airbags and ABS (the library) is much safer, but you still have to wear the seatbelt and not drive the wrong way (labels and correct usage).",
      code: {
        lang: 'tsx',
        source: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { DeleteJobDialog } from './DeleteJobDialog';

test('dialog is accessible and keyboard-operable', async () => {
  const user = userEvent.setup();
  const { container } = render(<DeleteJobDialog onConfirm={() => {}} />);

  // Find by role and name: fails if the button has no accessible name
  const trigger = screen.getByRole('button', { name: /delete job/i });
  await user.keyboard('{Tab}');
  expect(trigger).toHaveFocus();
  await user.keyboard('{Enter}');

  const dialog = screen.getByRole('dialog', { name: /delete this job/i }); // title gives it a name
  expect(dialog).toBeInTheDocument();
  expect(await axe(container)).toHaveNoViolations();   // automated checks (setup: expect.extend(toHaveNoViolations))

  await user.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();                        // focus returns to the trigger
});`,
      },
      output: "The test passes when the trigger is reachable by Tab, Enter opens a dialog whose accessible name comes from its title, axe finds no violations, Escape closes it, and focus returns to the trigger. Removing the dialog title or the button text makes the role queries fail.",
      questions: [
        { q: 'Does using an accessible component library make your app accessible?', a: 'It handles the hard behaviour for complex widgets, like focus and keyboard support, but you still must provide labels, accessible names, titles, adequate contrast, and use components for their intended purpose.' },
        { q: 'How do you test accessibility in a React app?', a: 'Automated axe checks (jest-axe, Playwright, Storybook addon) and eslint-plugin-jsx-a11y, role-based queries in React Testing Library, plus manual keyboard-only testing and a screen reader for what tools cannot catch.' },
        { q: 'What is the WAI-ARIA Authoring Practices Guide?', a: 'A W3C guide describing the expected roles, states and keyboard interactions for common widgets like dialogs, menus, tabs and comboboxes. Good libraries follow it.' },
        { q: 'What should you keep in mind when wrapping a library component?', a: 'Forward the ref, pass through aria and other native props, keep the accessible name and labels, and do not nest interactive elements.' },
      ],
      answer30: "Good libraries like Radix, React Aria or MUI implement the ARIA Authoring Practices for complex widgets: focus trapping, keyboard navigation, roles and states. That's a big reason to use them. But I'm still responsible for labels, accessible names on icon buttons, dialog titles, contrast in my theme, and using the right component. I test with axe in unit tests and Storybook, role-based queries in Testing Library, and manual keyboard and screen reader checks.",
      mistakes: [
        'Assuming the library makes everything accessible.',
        'Theme overrides that remove focus outlines or break contrast.',
        'Wrapping components without forwarding refs, breaking focus return in dialogs and menus.',
        "Trap: 'Does a clean axe report mean the app is accessible?' No. Automated tools catch only part of the issues; keyboard and screen reader testing are still needed.",
      ],
      takeaway: 'Libraries handle widget behaviour; you handle names, labels, contrast, correct usage and testing.',
    },

    {
      id: 'forms-with-ui-kits',
      title: 'Form libraries with UI kits',
      level: 'intermediate',
      priority: 'good',
      frequency: 'common',
      summary: 'Use React Hook Form with a Zod schema; connect native-like inputs with register and controlled kit components with Controller.',
      what: [
        "Forms need state, validation, error messages and submission handling. **React Hook Form** (RHF) is the most common library: it keeps inputs mostly uncontrolled, so typing doesn't re-render the whole form. **Zod** describes the data shape and rules once, and `zodResolver` connects it to RHF.",
        "Plain inputs (and kit inputs that forward refs to a real input) connect with `register('email')`. Fully controlled components like MUI `Select`, `Autocomplete`, date pickers, or Radix-based selects connect with `<Controller>`, which gives you `value` and `onChange` to pass in.",
      ],
      deeper: [
        "Wiring errors into the kit: MUI `TextField` takes `error` and `helperText`; shadcn/ui's `Form` components (`FormField`, `FormItem`, `FormMessage`) wrap Controller and link labels, descriptions and errors with the right ids and ARIA for you.",
        "The same Zod schema can validate on the server (an Express route or a Next.js server action), and `z.infer<typeof schema>` gives the TypeScript type, so client, server and types never drift.",
        "Performance: `register` avoids re-renders on every keystroke; `watch` re-renders on change, so prefer `useWatch` scoped to the field you need. Set `mode: 'onBlur'` or `'onTouched'` to avoid shouting errors while the user types. Ant Design's own `Form` has built-in state and rules; don't mix it with RHF on the same form.",
      ],
      why: "Hand-writing form state with useState for every field leads to re-renders, duplicated validation and inconsistent errors. A form library plus a schema gives consistent, typed, accessible forms with little code.",
      analogy: "React Hook Form is a clipboard that quietly notes what's written in each box, Zod is the rulebook that checks the form, and Controller is an adapter plug for fancy inputs that don't fit the standard socket.",
      code: {
        lang: 'tsx',
        source: `import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextField, MenuItem, Button, Stack } from '@mui/material';

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  email: z.string().email('Enter a valid email'),
  type: z.enum(['full-time', 'contract'], { message: 'Pick a job type' }),
});
type JobForm = z.infer<typeof schema>; // the same schema can validate on the server

export function NewJobForm({ onSave }: { onSave: (data: JobForm) => Promise<void> }) {
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<JobForm>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: { title: '', email: '', type: undefined },
  });

  return (
    <form onSubmit={handleSubmit(onSave)} noValidate>
      <Stack spacing={2}>
        {/* TextField forwards the ref to a real input, so register works */}
        <TextField label="Job title" {...register('title')} error={!!errors.title} helperText={errors.title?.message} />
        <TextField label="Contact email" type="email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} />

        {/* Select is controlled: use Controller */}
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <TextField select label="Job type" {...field} value={field.value ?? ''} error={!!errors.type} helperText={errors.type?.message}>
              <MenuItem value="full-time">Full-time</MenuItem>
              <MenuItem value="contract">Contract</MenuItem>
            </TextField>
          )}
        />
        <Button type="submit" variant="contained" disabled={isSubmitting}>Save job</Button>
      </Stack>
    </form>
  );
}`,
      },
      output: "Leaving the title as 'Ab' and moving on shows 'Title must be at least 3 characters' under the field in MUI's error style. Submitting with no job type shows 'Pick a job type'. With valid data, onSave receives a typed object `{ title, email, type }`, and the button is disabled while saving. Typing does not re-render the whole form.",
      questions: [
        { q: 'Why use React Hook Form?', a: 'It manages form state, validation and submission with mostly uncontrolled inputs, so typing does not re-render the whole form. It integrates with schema validators like Zod and works with any UI kit.' },
        { q: 'register vs Controller?', a: '`register` connects inputs that expose a real input element through a ref. `Controller` is for controlled components like MUI Select, Autocomplete or date pickers, giving you `field.value` and `field.onChange` to pass in.' },
        { q: 'Why validate with a Zod schema?', a: 'One schema defines rules and messages, gives a TypeScript type through `z.infer`, and can be reused on the server, so client validation, server validation and types stay in sync.' },
        { q: 'How do you show errors accessibly with a UI kit?', a: 'Use the kit\'s error props (MUI `error` and `helperText`, shadcn `FormMessage`), which link the message to the input with aria-describedby and set aria-invalid, and focus the first invalid field on submit, which React Hook Form does by default.' },
      ],
      answer30: "I use React Hook Form with a Zod schema through zodResolver. Inputs that forward refs, like MUI TextField, connect with register, and controlled components like Select, Autocomplete or date pickers go through Controller. Errors feed the kit's own error props, like helperText in MUI or FormMessage in shadcn, so they're styled and accessible. The same Zod schema gives the TypeScript type and validates again on the server.",
      mistakes: [
        'Using `register` on a controlled component that has no real input ref, so values never update.',
        'Storing every field in useState and validating by hand.',
        'Calling `watch()` at the top of a big form, re-rendering it on every keystroke.',
        "Trap: 'Is client-side Zod validation enough?' No. Reuse the schema on the server; the client check is only for user experience.",
      ],
      takeaway: 'React Hook Form + Zod; register for ref-forwarding inputs, Controller for controlled kit components.',
    },

    {
      id: 'bundle-size-tree-shaking',
      title: 'Bundle size and tree shaking for UI libraries',
      level: 'advanced',
      priority: 'good',
      frequency: 'occasional',
      summary: 'Tree shaking drops unused exports only with ES modules and side-effect-free code; measure the bundle, import precisely, and lazy-load heavy components.',
      what: [
        "**Tree shaking** is the bundler (Vite/Rollup, webpack, esbuild) removing code you import but never use. It works with ES modules (`import`/`export`), because those can be analysed at build time.",
        "UI libraries are big. If tree shaking fails, importing one Button can pull in the whole library. So you check what ends up in the bundle and import in ways the bundler can optimize.",
      ],
      deeper: [
        "Tree shaking needs: ESM builds of the library, a `\"sideEffects\": false` (or a list of files with side effects, like CSS) in the library's package.json so the bundler may drop unused modules, and no code patterns that force everything to load (CommonJS `require`, `import * as X` used dynamically, barrel files that run code).",
        "Barrel files (`index.ts` re-exporting everything) can slow development builds and sometimes defeat tree shaking. Modern bundlers handle well-marked libraries fine, and Next.js has `optimizePackageImports` for common ones. Icon packs are the classic trap: import individual icons, not the whole set.",
        "Measure, don't guess: `rollup-plugin-visualizer` for Vite, `webpack-bundle-analyzer`, `source-map-explorer`, and bundlephobia or pkg-size to compare packages before adding them.",
        "Beyond tree shaking: **code splitting** with `React.lazy` and dynamic `import()` for heavy, rarely used parts (rich text editors, charts, date pickers, data grids); replace heavy dependencies (moment with date-fns or Day.js; lodash with lodash-es or native methods); and for runtime CSS-in-JS kits, remember there's also runtime styling cost, not just bytes.",
      ],
      why: "JavaScript size directly affects load time and interactivity, especially on mid-range phones. UI libraries are often the biggest dependency, so they're the first place to look.",
      analogy: "Packing for a trip from a huge wardrobe. Tree shaking is packing only the clothes on your list; it only works if items are separately labelled (ES modules) and nothing is sewn together (side effects). Code splitting is shipping the ski gear later, only if you actually go skiing.",
      code: [
        {
          lang: 'tsx',
          title: 'Import precisely, lazy-load heavy parts',
          source: `// Named imports from ESM, side-effect-free packages tree-shake well
import { Button, TextField } from '@mui/material';

// Icons: import individual modules, not a whole icon namespace
import DeleteIcon from '@mui/icons-material/Delete';
import { Trash2 } from 'lucide-react'; // ESM, per-icon tree shaking

// Avoid: loads everything (CommonJS, or a dynamic namespace)
// const _ = require('lodash');
// import _ from 'lodash';            -> prefer: import debounce from 'lodash-es/debounce';

// Heavy, rarely used component: split into its own chunk
import { lazy, Suspense } from 'react';
const ReportChart = lazy(() => import('./ReportChart')); // charts library loads only when needed

export function Reports({ show }: { show: boolean }) {
  return show ? (
    <Suspense fallback={<p>Loading chart...</p>}>
      <ReportChart />
    </Suspense>
  ) : null;
}`,
        },
        {
          lang: 'json',
          title: 'Your own component library: package.json essentials',
          source: `{
  "name": "@acme/ui",
  "type": "module",
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
    "./styles.css": "./dist/styles.css"
  },
  "sideEffects": ["**/*.css"],
  "peerDependencies": { "react": "^18 || ^19", "react-dom": "^18 || ^19" }
}`,
        },
        {
          lang: 'bash',
          title: 'Measure',
          source: `# Vite: add rollup-plugin-visualizer to vite.config, then
npx vite build        # opens/writes stats.html showing what each dependency costs

# Next.js
ANALYZE=true npx next build   # with @next/bundle-analyzer configured`,
        },
      ],
      output: "The main bundle contains only the MUI components and the two icons actually used. The chart library is split into a separate chunk that downloads only when `show` becomes true, with a loading message meanwhile. The visualizer report shows each dependency's size so you can spot a library that was pulled in whole.",
      questions: [
        { q: 'What is tree shaking?', a: 'Removing unused exports from the final bundle at build time. It relies on ES module imports and exports being statically analysable, and on code being marked free of side effects.' },
        { q: 'Why might tree shaking fail for a library?', a: 'The library ships only CommonJS, does not declare `sideEffects: false`, has modules that run code on import, or you import it in a way that pulls everything, like a default import of the whole package or `require`.' },
        { q: 'How do you find what is making a bundle large?', a: 'Run a bundle analyzer such as rollup-plugin-visualizer, webpack-bundle-analyzer or source-map-explorer, and check packages on bundlephobia before adding them.' },
        { q: 'Tree shaking vs code splitting?', a: 'Tree shaking removes code that is never used. Code splitting moves code that is used, but not immediately, into separate chunks loaded on demand with dynamic import or React.lazy.' },
        { q: 'What does the sideEffects field in package.json do?', a: 'It tells the bundler which files can be safely dropped if their exports are unused. `false` means none have side effects; a list like `[\"**/*.css\"]` keeps CSS imports that must run.' },
      ],
      answer30: "Tree shaking lets the bundler drop unused exports, but only with ES modules and libraries marked side-effect free in package.json. With UI libraries I use named ESM imports, import icons individually, avoid CommonJS packages like plain lodash, and lazy-load heavy components such as charts, editors and data grids with React.lazy. I measure with a bundle visualizer rather than guessing, and when building our own library I ship ESM, set sideEffects and keep React as a peer dependency.",
      mistakes: [
        'Importing a whole icon set or utility library for one function.',
        "Setting `\"sideEffects\": false` in a library whose CSS imports are needed, so styles vanish from the build.",
        'Lazy-loading tiny components, adding requests without saving anything.',
        "Trap: 'Is dev-mode bundle size meaningful?' No. Dev builds are unminified and not tree-shaken the same way; always measure the production build.",
      ],
      takeaway: 'ESM + sideEffects for tree shaking, precise imports, lazy-load heavy parts, and measure the production bundle.',
    },
  ],

  rapidFire: [
    { q: 'Styled kit vs headless library?', a: 'A kit ships styled components; headless ships behaviour and a11y with no styles.' },
    { q: 'Three ways to customise MUI?', a: 'createTheme (global), sx (one-off), styled() (reusable variant).' },
    { q: 'What does `p: 2` mean in MUI sx?', a: '`theme.spacing(2)`, 16px by default.' },
    { q: 'MUI default styling engine?', a: 'Emotion, a runtime CSS-in-JS library.' },
    { q: 'Where is Tailwind v4 configured?', a: 'In CSS, with `@import "tailwindcss"` and `@theme`.' },
    { q: 'Why can\'t you build Tailwind classes with template strings?', a: 'The scanner only finds complete class names in source text.' },
    { q: 'What does tailwind-merge do?', a: 'Resolves conflicting Tailwind classes so the last one wins, like `px-2` vs `px-4`.' },
    { q: 'What is cva for?', a: 'Defining variant props (intent, size) that map to Tailwind class sets.' },
    { q: 'How do you add a shadcn/ui component?', a: '`npx shadcn@latest add <name>` copies its source into your project.' },
    { q: 'What does Radix asChild do?', a: 'Passes Radix behaviour onto your own child element instead of rendering a new one.' },
    { q: 'Primitive vs semantic tokens?', a: 'Primitive = raw value (blue-600); semantic = purpose (action-primary) pointing at a primitive.' },
    { q: 'How to prevent the dark-mode flash?', a: 'An inline head script sets the theme before first paint.' },
    { q: 'What does color-scheme do?', a: 'Makes native controls and scrollbars match light or dark.' },
    { q: 'register vs Controller in React Hook Form?', a: 'register for ref-forwarding inputs; Controller for controlled components like MUI Select.' },
    { q: 'Tree shaking needs what?', a: 'ES modules and side-effect-free packages (`sideEffects` in package.json).' },
    { q: 'Tree shaking vs code splitting?', a: 'Tree shaking removes unused code; code splitting defers used code into lazy chunks.' },
    { q: 'Does an accessible library make your app accessible?', a: 'No; you still need labels, names, contrast and correct usage.' },
  ],
};

export default uiLibraries;
