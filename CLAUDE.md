# CLAUDE.md — Dreams LMS (Angular Demo)

This is the development contract for this repository. It is scoped to what
was actually learned from the Figma file (`GgZrhJTj5g9ixqUFRHvUhm`,
"Angular Demo Project") plus the architectural decisions made from it. Keep
it accurate as the app evolves — stale rules are worse than no rules.

No application code exists yet. This file governs Phase 1 onward.

### Non-negotiable: architecture compliance & file size

This architecture (§2–§13) is mandatory, not a suggestion — every change
must follow it, not work around it. Code quality is the top priority in
this project:

- **No file may exceed 400 lines of code.** Component, service, facade,
  model — all of it. If a file is approaching 400 lines, that's a signal
  to split it, not to compress it: extract a child component, pull logic
  into a separate pure function/service, break a large template into
  sub-components. This is checked as part of §20's "after implementation"
  review and §21's final self-review — a PR that introduces or grows a
  file past 400 lines is not done until it's split.
- Do not achieve the line limit by deleting readability (removing
  whitespace, collapsing logic onto fewer lines) — split responsibilities
  instead, per §6.
- Never bypass the folder structure (§4) or layer boundaries (§8's
  UI → facade → API-client chain) to avoid creating a new file — creating
  the extra file is correct; skipping the architecture to stay in one file
  is not.

---

## 1. What this app is

**Dreams LMS** — an online-courses / education platform with three
audiences: anonymous visitors, students, and instructors.

Confirmed from the Figma sitemap (7 top-level sections, one is a template
promo frame and is **not part of the app**):

| Section | Frames | Audience |
|---|---|---|
| HomePages | 6 alternate homepage *design explorations* (not 6 real routes — see §12) | Public |
| Authentication | Login, Register, Forgot Password, OTP, Set Password, Lock Screen | Public |
| Courses | Course Grid, Course List, Course Detail 1, Course Detail 2 — **built, see §22** | Public + role-aware CTAs |
| Instructors | Instructor Grid, Instructor List, Instructor Details | Public |
| Student Dashboard | Dashboard, Profile, Enrolled Courses, My Certificates, My Quiz Attempts — **built, see §23** | Student (auth) |
| Instructor Dashboard | Dashboard, 2× "Card", Calendar, 2× "Container" (exact sub-pages unconfirmed) | Instructor (auth) |
| ~~Full Product Link~~ | Template marketing cover | **Ignore — not an app screen** |

This directly implies the top-level route groups in §5 and the guard
structure in §7.

### Confirmed reusable patterns (verified via Figma inspection)

- **Auth shell**: a split-panel layout (branded gradient/illustration panel
  left, form panel right) reused identically across Login, Register, Forgot
  Password, OTP, Set Password. Lock Screen is a *different*, centered-card
  layout — do not force it into the split-panel shell.
- **Catalog toolbar**: Filter button + Clear filters + results count + Sort
  dropdown + Search input + Grid/List view-toggle buttons — this exact
  structure was confirmed present on the Instructor Grid frame and is named
  consistently enough to be a single shared component reused by Courses and
  Instructors browsing screens.
- **Footer**: a shared `Footer` component instance appears on catalog pages.
- **Grid/List toggle**: Course Grid vs Course List and Instructor Grid vs
  Instructor List are almost certainly the *same dataset* rendered by two
  layout components sharing one card model — not independent screens.
- **Auth field primitives**: labeled input with leading icon, password
  field with show/hide + 4-segment strength meter, 4-digit segmented OTP
  input with a countdown badge, pill-shaped full-width primary button.

### Open ambiguities — verify before building these areas

Figma's MCP tool quota (Starter plan) was exhausted mid-investigation.
Courses, Instructors, Student Dashboard, and Instructor Dashboard were
**not** visually inspected beyond the sitemap and one partial Instructor
Grid structure dump. Do not invent field lists, table columns, or exact
tokens for these — re-run `get_screenshot` / `get_design_context` /
`get_variable_defs` on the specific frame before implementing it. Known
open questions:

- Instructor Dashboard's two "Card" and two "Container" frames — their
  actual content (My Courses? Students? Earnings? Settings?) is unconfirmed.
- No error/invalid form state, no loading/disabled button state, and no
  empty-state screen exists anywhere in the file — these must be designed
  by implementation convention (§10, §14), not copied from Figma.

**Resolved during Authentication implementation** (2026-08-29), from the
`Ui-Image/` mockup exports rather than a live Figma session:

- Register's primary CTA read "Login" in the mockup — built as **"Sign Up"**
  instead; shipping a button that says "Login" but registers an account
  would be a real UX bug, not a fidelity choice worth preserving.
- OTP is wired **only** to the Forgot Password flow (Forgot Password → OTP →
  Set Password). Register does not require OTP verification — it logs the
  user straight in. Revisit if a future design pass specifies otherwise.
- Form-level errors (wrong password, no such account, invalid OTP, etc.) —
  since Figma designed no error state — render as a dismissed-on-retry
  banner above the form (`shared/ui/alert`), consistent across all six auth
  screens.
- Password strength meter thresholds and colors (weak/fair/good/strong) are
  an implementation default (`shared/forms/password-strength.ts`), not
  pulled from Figma — the mockup only shows the meter's empty state.
- Lock Screen has no real trigger yet (no dashboard/idle-timeout exists to
  fire it) — the route is reachable for preview whenever a session exists,
  not only when actually "locked." Revisit once a dashboard can call
  `AuthService.lock()`.
- Design tokens below (§3) are sampled visually from Authentication screens
  only, not pulled from Figma Variables (rate-limited). Treat as
  provisional until `get_variable_defs` succeeds.

**Resolved during Courses implementation** (2026-08-29), from
`Ui-Image/auth.css` (a full Figma CSS export covering Auth + Course
Grid/List/Detail 1-4, superseding the earlier provisional tokens) plus the
`Course Grid.png` / `Course List.png` / `Course Detail 3.jpg` / `Course
Detail 4.jpg` mockups:

- Course Detail 1 vs Course Detail 2 — confirmed **two hero-layout
  variants of identical content**, not two different page structures. Detail
  1 (`Course Detail 3.jpg`) is a full-bleed dark-overlay hero with the title
  over the image; Detail 2 (`Course Detail 4.jpg`) is a light header card
  with a separate banner image below. Everything below the hero (Overview,
  Course Content curriculum, About the instructor, Post a Comment, and the
  sticky sidebar) is pixel-identical between the two. Built Detail 1's hero
  as the canonical variant (§22) — Detail 2's hero style is unbuilt.
- The site-wide header/footer built from `Home Page 12.jpg` alone (§12) was
  a lower-fidelity guess — no Figma CSS existed for that page. The Courses
  mockups came with a full CSS export and are visually consistent across
  all 4 screens, so they're authoritative: the header (utility bar + main
  nav + cart/theme-toggle icons) and footer (For Instructor / For Student /
  Newsletter columns + navy bottom bar) were rebuilt to match and now
  supersede the Home-only guess everywhere, including on the homepage.
- Design tokens corrected to exact Figma values now that a real CSS export
  exists: primary navy `#392C7D` (was estimated `#2B1B58`), danger
  `#E70D0D` (was `#EF4444`), success `#03C95A`, star `#FFC107`, body
  secondary text `#6D6D6D` "Grey 500" (was `#888888` "Grey 400", now kept
  as `--color-text-tertiary` for lighter placeholder text), card radius
  `10px` (was `12px`), input radius `5px` (was `4px`).

---

## 2. Angular architecture decisions

| Decision | Choice | Why |
|---|---|---|
| Angular version | 22.1, standalone-only | No NgModules; signal inputs/outputs, `model()`, new control flow (`@if`/`@for`/`@switch`) are stable and simpler than the legacy patterns. Pinned to the version installed by `ng new` at scaffold time (2026-08-29) — bump deliberately, not silently, via `ng update`. |
| Change detection | `OnPush` everywhere + signals | App is read-heavy (catalogs, dashboards); avoids default CD cost |
| State management | Signals in services (no NgRx/Akita/Elf) | Data complexity is "a few catalogs + two dashboards," not cross-cutting workflow state — a store adds ceremony with no payoff here (see §6) |
| Styling | Plain SCSS + CSS custom properties mirrored from Figma Variables | The design is a bespoke visual system (pill buttons, gradient auth panel, custom OTP input) — Angular Material would fight it, and Tailwind adds a utility-class abstraction the tokens don't need. Revisit only if the team explicitly wants utility classes. |
| HTTP | `provideHttpClient(withInterceptors([...]))`, functional interceptors | Modern Angular default, no RxJS-heavy class-based interceptors needed |
| Forms | Typed Reactive Forms only | Template-driven forms don't give compile-time type safety on the auth/profile forms this app needs |
| Unit/component tests | Vitest via Angular's supported alternative builder | Karma is deprecated by the Angular team; Vitest is the modern, ESM-native, officially supported path |
| E2E tests | Playwright | Official Angular CLI schematic, replaces deprecated Protractor |
| Lint/format | ESLint (`@angular-eslint`) + Prettier | Catch errors and enforce consistency before review, not during it |

Do not add a UI/component library, a CSS framework, or a state library
without writing the reason in this file first.

---

## 3. Design tokens (provisional — confirm via Figma Variables)

Sampled from Authentication screens only:

- Primary accent (buttons, links, focus rings, required-asterisks): coral/pink-red, ~`#F0455C`
- Brand text (logo, headings): deep indigo, ~`#2B1B58`
- Auth panel background: pink/lavender gradient
- Body/helper text: gray, ~`#6B7280`
- Headings ~28–32px bold · field labels ~14px medium · body ~13–14px
- Buttons: full-width pill (`border-radius: 999px`), ~48–52px tall
- Inputs: ~8px radius, ~44–48px tall, trailing icon
- Vertical rhythm between form groups: ~24px

Store real tokens in `src/styles/tokens.scss` as CSS custom properties once
pulled from Figma Variables. Never hand-guess a hex/px value when the
Figma node is inspectable — re-fetch it.

---

## 4. Folder structure

```
src/
├── app/
│   ├── core/                        # singleton, app-wide infrastructure — no UI
│   │   ├── auth/                    # AuthService (session/token state), authGuard, roleGuard, guestGuard
│   │   ├── http/                    # functional interceptors: auth, error-normalization, (optional) loading
│   │   ├── error-handling/          # GlobalErrorHandler, AppError model, toast/notification service
│   │   └── config/                  # environment tokens, app-wide constants
│   │
│   ├── shared/                      # reusable, presentation-only, no feature knowledge
│   │   ├── ui/                      # Button, Card, Badge, Avatar, Modal, Pagination, DataTable,
│   │   │                            #   ProgressBar, RatingStars, Spinner, EmptyState, ErrorState, Footer
│   │   ├── forms/                   # FormFieldComponent, PasswordStrengthMeter, OtpInput, validators.ts
│   │   ├── directives/
│   │   ├── pipes/
│   │   └── models/                  # cross-feature types only (e.g. Pagination<T>, ApiError)
│   │
│   ├── layout/
│   │   ├── public-layout/           # header/nav + Footer shell — Home, Courses, Instructors
│   │   ├── auth-layout/             # split-panel shell (§1) for auth routes
│   │   └── dashboard-layout/        # sidebar + topbar shell — role-scoped nav for both dashboards
│   │
│   ├── features/
│   │   ├── home/
│   │   ├── auth/                    # login, register, forgot-password, otp, set-password, lock-screen
│   │   ├── courses/                 # grid+list view, detail
│   │   ├── instructors/             # grid+list view, detail
│   │   ├── student-dashboard/       # dashboard, profile, enrolled-courses, certificates, quiz-attempts
│   │   └── instructor-dashboard/    # sub-pages TBD — confirm against Figma before scaffolding (§1)
│   │
│   ├── app.routes.ts
│   ├── app.config.ts
│   └── app.ts
│
├── assets/
└── styles/                          # tokens.scss, resets, typography — global only, not component styles
```

Each `features/<name>/` follows this internal shape (example: `courses`):

```
features/courses/
├── data-access/
│   ├── course.model.ts        # Course, CourseFilter, CourseListResponse — typed contracts
│   ├── course-api.service.ts  # HTTP/mock calls only — see §8
│   ├── course.mock-data.ts    # dev-only fixture data, never imported by components directly
│   └── course.store.ts        # signal-based facade: data/loading/error signals + methods (§6)
├── ui/                        # feature-scoped presentational components (CourseCard, CourseFilterBar)
│                               #   — promote to shared/ui the moment a second feature needs it
├── course-list.page.ts        # route-level container component (smart)
└── course-detail.page.ts
```

A component/service belongs in `shared/` only once **two or more
features** need it. Don't pre-emptively generalize.

---

## 5. Routing

- Standalone components, `loadComponent`/`loadChildren` per feature — every
  feature route group is lazy.
- Route groups: `/` (home), `/courses`, `/courses/:slug`, `/instructors`,
  `/instructors/:id`, `/auth/*`, `/student/*` (guarded), `/instructor/*`
  (guarded).
- 404 route (`**`) and a guard-rejection "unauthorized" route both required
  — Figma has no error-page design; build these to match the app's shared
  `EmptyState`/`ErrorState` components, not ad hoc.

---

## 6. Component & state rules

**Components**
- Route-level components (`*.page.ts`) are the only "smart" components —
  they own facade injection and pass data down via inputs.
- Everything under `ui/` is presentational: inputs/outputs only, no service
  injection beyond pure display helpers (pipes).
- No component should exceed roughly one screen's worth of template logic —
  extract a child component or move logic to the facade instead of growing
  the template.
- Hard limit: **400 lines per file** (see the non-negotiable rule above).
  Treat 300+ lines as the point to start planning a split, not 400 as a
  target to write up to.
- Prefer composition (slot content via `ng-content`, small focused
  components) over near-duplicate components.

**State — pick the narrowest scope that works**
- **Local signal** in the component: pure UI state with no other consumer
  (a dropdown's open/closed, a form's touched flag beyond what the
  `FormGroup` already tracks).
- **Feature facade signal** (`*.store.ts` in `data-access/`): anything a
  route and its children share — list data, active filters, selected
  entity, loading/error. This is the default for "list + detail" and
  "dashboard + widgets" screens.
- **Root-provided service signal** (`core/`): only truly cross-feature
  state — the authenticated user/session, global toast queue. Do not put
  course or dashboard data here.
- Never duplicate the same entity's state in two places "to be safe" —
  one facade owns it, others read it via `computed()` or input binding.

**Business logic**
- Validation rules, formatting, progress/score calculations, and anything
  reused across ≥2 components live in the feature's facade or a pure
  function in `data-access/`, never copy-pasted into components.
- If two features need the same business rule, it moves to `shared/` (a
  pure function or injectable), not duplicated a second time.

---

## 7. Guards & auth

- `authGuard` — redirects unauthenticated users to `/auth/login` for any
  `/student/*` or `/instructor/*` route.
- `roleGuard('student' | 'instructor')` — the two dashboards are
  role-exclusive; a student hitting `/instructor/*` (or vice versa) is
  redirected, not shown a broken layout.
- `guestGuard` — redirects an already-authenticated user away from
  `/auth/*` (except Lock Screen, which is reachable while "locked" —
  confirm the actual trigger condition once its Figma flow is clarified,
  see §1).
- Guards read session state from `core/auth`'s signal-based `AuthService`
  only — never re-implement auth checks inside a component.

---

## 8. API & mock-API architecture

```
UI (page/component)
  → Feature facade (data-access/*.store.ts)   — signals: data, loading, error
    → API service (data-access/*-api.service.ts) — one per feature, typed
      → ApiClient abstraction (core) — injection-token-selected implementation
        → MockApiClient (dev)  |  HttpApiClient (real backend)
```

Rules:
- Components **never** inject `HttpClient` or an API service directly —
  only the feature facade does.
- Every API service method is typed end-to-end: request model in, response
  model out (`course.model.ts`), never a bare `any`/`object`.
- Facades expose four states per query, not just data: `loading`,
  `data`, `error`, and an explicit `empty` derived signal
  (`computed(() => !loading() && !error() && data().length === 0)`).
- Switching mock → real backend is a single DI provider change in
  `app.config.ts` (which `ApiClient` implementation is provided) —
  it must never require touching a component or facade.
- Mock data lives only in `*.mock-data.ts` files, gated behind an
  environment flag; components must not import mock data directly.
- The mock client simulates: network delay, empty responses, and at least
  one representative failure (e.g. 500) per endpoint — so error/empty UI
  states are exercised without a real backend.
- Pagination: request models take `{ page, pageSize }` (or cursor, once
  confirmed from a re-inspected catalog screen), responses return
  `{ items, total, page, pageSize }`. Don't hardcode a page size assumed
  from a screenshot — confirm it from Figma when building each list.

---

## 9. TypeScript rules

- `strict: true`. No `any` without a `// TODO(reason):` comment explaining
  why it's unavoidable (e.g. a genuinely untyped third-party callback).
- Every API boundary (request/response) is an `interface`, not inferred
  from usage.
- Model nullability explicitly — `avatarUrl: string | null`, not an
  implicit optional that silently becomes `undefined`.
- No non-null assertions (`!`) as a substitute for a real null check,
  except immediately after a guard clause that has already proven the
  value exists.
- Domain models are named for the domain (`Course`, `Enrollment`), not for
  the UI (`CourseCardData`) — UI-shape adapters, if needed, are a separate
  small mapping function, not a second parallel model.

---

## 10. Forms

- Typed Reactive Forms (`FormGroup<T>`) for every form — Login, Register,
  Forgot Password, OTP, Set Password, Profile edit.
- Shared validators (`shared/forms/validators.ts`): email format, password
  strength (matches the 4-segment meter seen in Figma — define the actual
  4 thresholds explicitly, don't leave them implicit), confirm-password
  match, OTP-digit format.
- Figma shows no error-state visuals (§1) — until design provides one,
  render validation errors as: red input border + inline message below the
  field, using the shared `FormFieldComponent`, consistent across every
  form. Do not invent a different pattern per form.
- Every submit button reflects `form.invalid`, `submitting` (disabled +
  loading indicator), and re-enables on failure. This is an assumption
  (Figma has no loading-state frame) — keep it consistent app-wide rather
  than per-screen.
- Cover with tests: required-field rejection, format validators, confirm-
  password mismatch, submit-disabled-while-submitting.

---

## 11. Figma implementation rules

- Never approximate a spacing, size, or color the Figma node exposes —
  inspect the actual node (`get_design_context` / `get_variable_defs`)
  before writing the value.
- Before building any screen in §1's "open ambiguities" list, re-fetch its
  Figma node (screenshot + metadata) — do not build from this document's
  guesses about it.
- Build the Grid/List toggle, catalog toolbar, and card components once,
  shared between Courses and Instructors — do not fork them per feature
  (§1 confirms they're structurally identical).
- When Figma is ambiguous or contradicts itself (e.g. Register's "Login"
  button label, the two undifferentiated OTP-flow entry points), record
  the ambiguity in this file's §1 or in the feature's own doc (§19) —
  never silently pick an interpretation without noting it.
- UI review process before marking a screen done: side-by-side the
  rendered app against `get_screenshot` for that exact node at 100% zoom;
  check spacing, type scale, and color against `get_variable_defs`, not by
  eye.

---

## 12. Home page — built (2026-08-29)

Resolved: the user provided one canonical homepage design directly as image
exports (`Ui-Image/Home Page 12.jpg` + per-section crops named
`Main Container*.png`) rather than through Figma — that one variant is what
was built. The other 5 "HomePages" frames noted in §1's original sitemap
were never used and remain unbuilt; treat them as superseded, not pending.

Built as `layout/public-layout/` (header + footer, shared by any future
public route) wrapping `features/home/` (14 section components under
`ui/`, one `HomeStore` facade, one `/home` mock endpoint returning all
section data in a single aggregate `HomePageData`).

**Asset substitutions made** (no Figma CSS export exists for this page —
only raster mockups, and several referenced assets were flattened
screenshots rather than usable individual images):

- Trusted-by logos and the bottom "partners" banner: only the Jira mark was
  a clean asset. The rest render as plain text wordmarks rather than
  hand-drawn trademarked logos.
- Mentor-CTA section and both dual-CTA cards (Become An Instructor /
  Transform Access): no usable photo/illustration asset existed separately
  from a flattened screenshot — built text-only / solid-color instead.
- Instructor cards use placeholder avatar photos with **live HTML
  badges** (verified check, course count, favorite) rather than the one
  provided composite photo, which had a course count baked into the
  pixels — reusing it across 4 differently-countED instructors would have
  shown wrong data. This was the correct call per §8 (never bake mock data
  into an image), not just an asset shortage workaround.
- Only 3 course thumbnail photos were provided for 6 course cards — cycled
  deliberately, per the "minimal assets" instruction.
- Featured Courses and Trending Courses render from the **same** course
  list (`HomeStore.featuredCourses` / `.trendingCourses`, both derived from
  one `courses` array via a `trending` flag) — the two mockup sections
  showed overlapping courses with slightly inconsistent stats between them
  (template lorem-data drift), so treating them as one dataset sidesteps
  that inconsistency entirely rather than reproducing it.
- The source design's "Docker Development" category card visually shows a
  Vue.js icon — an inherited inconsistency, not something introduced here.
  Preserved as-is (icon file `Group.png`) since fixing it would contradict
  "exact same UI"; flag to the design owner if it should actually be
  Docker's mark or a corrected label.
- Register page's button read "Login" in the mockup — shipped as "Sign Up"
  (see §1); footer copyright year is computed (`new Date().getFullYear()`)
  rather than the mockup's hardcoded "2025".

**Known gap**: header nav items (Courses, Dashboard, Pages, Blogs) and
every `ctaLink="/courses"` on section headings point at routes that don't
exist yet — they currently fall through to the wildcard redirect. Not a
bug; those features (§1) haven't been scoped yet.

---

## 13. Data model (frontend-compatible contract, not a real DB)

Analyzed from the Figma sitemap to keep frontend types backend-swappable
(§8). Treat as a starting sketch — extend `data-access/*.model.ts` files as
real fields are confirmed from each screen; do not let this list drift from
the actual `.model.ts` files.

- **User**: id, name, email, role (`student`|`instructor`), avatarUrl, createdAt
- **StudentProfile** (1:1 User): firstName, lastName, username, phone, email,
  gender, dob, age, bio, registeredAt — confirmed from the Profile screen,
  see §23
- **InstructorProfile** (1:1 User): bio, expertise[], rating, totalStudents, totalCourses, socialLinks
- **Category**: id, name, slug
- **Course**: id, title, slug, description, thumbnailUrl, instructorId (FK→User), categoryId (FK), level, price, rating, ratingCount, durationMinutes, status
- **Module** (FK→Course) → **Lesson** (FK→Module): title, type, durationMinutes, order, isPreview
- **Enrollment**: id, studentId (FK), courseId (FK), enrolledAt, progressPercent, status (`active`|`completed`) — confirmed, see §23
- **Review**: id, courseId (FK), studentId (FK), rating, comment, createdAt
- **Certificate**: id, studentId (FK), courseId (FK), courseName, issuedAt, marks, outOf, fileUrl — confirmed, see §23
- **Quiz** (FK→Course) → **QuizAttempt**: id, quizId (FK), studentId (FK), questionCount, score, status, attemptedAt — confirmed, see §23

Required/optional and validation rules belong in each `*.model.ts` and its
matching form validators (§10), not duplicated here.

---

## 14. Testing strategy

- **Unit**: facades/services, validators, pure transform functions
  (progress %, currency/duration formatting). No DOM.
- **Component**: rendering per state — loading, empty, error, populated —
  for every list/detail component; input/output contracts; form validation
  feedback.
- **API layer**: mock the `ApiClient`, assert facade behavior for 200/201,
  400, 401, 403, 404, 409, 500, timeout, network failure, empty body,
  malformed body.
- **Edge cases** (apply per feature, not generically): null/empty fields,
  zero-result search, large lists (virtualization/pagination correctness),
  duplicate enrollment attempts, rapid repeated submit clicks (must not
  double-submit), overlapping in-flight requests when filters change fast.
- **Integration**: at least one full-stack test per major flow — login →
  dashboard redirect by role; browse → filter → detail → enroll; quiz
  attempt → score → certificate issuance — through UI → facade →
  mock API.
- New business logic or a new API integration ships with tests in the same
  change; UI-only tweaks don't require new integration tests.

---

## 15. Security

- No secrets, API keys, or tokens in source — environment-injected only,
  never committed.
- Session token stored per `core/auth` convention (httpOnly cookie
  preferred over `localStorage` once a real backend exists); do not read/
  write auth tokens from feature code directly.
- Route guards are a UX convenience, not a security boundary — the backend
  must enforce authorization independently; never assume a hidden route is
  a protected route.
- Sanitize/avoid `[innerHTML]`; no `bypassSecurityTrust*` without a
  documented reason reviewed in the PR.
- Validate all user input client-side for UX, but never treat client-side
  validation as sufficient on its own.

---

## 16. Performance

- Every feature route is lazy-loaded (§5); no eager-loading a feature "for
  convenience."
- `OnPush` + signals everywhere (§2) — avoid `any` subscriptions that force
  default change detection.
- Lists use `@for` with `track` by id; paginate server-side once a list can
  plausibly exceed ~50 items rather than client-side slicing.
- Unsubscribe/cleanup: prefer signals/`toSignal`/`takeUntilDestroyed()`
  over manual `Subscription` bookkeeping.
- Cache only where re-fetching is wasteful and staleness risk is low (e.g.
  category list), never cache per-user dashboard data without an explicit
  invalidation rule.
- No premature optimization — don't add virtualization, memoization, or
  caching until a real list size or measured cost justifies it.

---

## 17. Accessibility

- Semantic elements first (`<nav>`, `<button>`, `<table>` for real tabular
  data) — ARIA only fills a gap semantic HTML can't.
- Every form field has a bound `<label>`; every icon-only control
  (grid/list toggle, filter button) has an accessible name.
- Modals/dialogs trap focus, restore focus to the trigger on close, close
  on `Escape`.
- All interactive elements reachable and operable by keyboard alone,
  including the OTP segmented input (arrow/auto-advance behavior) and the
  grid/list toggle.
- Verify contrast for the coral-on-white and coral-on-gradient text/button
  combinations (§3) against WCAG AA once real token values are pulled.

---

## 18. Error handling

- HTTP errors are normalized once, in the error interceptor, into a single
  `AppError` shape — features never parse raw HTTP error bodies themselves.
- User-facing errors: short, plain-language, shown via the shared
  `ErrorState`/toast components — never a raw stack trace or status code.
- Developer-facing detail (status, endpoint, correlation id if available)
  goes to console/logging in dev only, stripped in production builds.
- Guard rejections route to the "unauthorized" page (§5), not a silent
  redirect loop or blank screen.
- 404s (missing course/instructor id) render the shared `EmptyState`
  variant for "not found," not the generic error state.

---

## 19. Documentation

- For each feature, once built, add `docs/features/<feature>.md` covering:
  overview, data flow, API contract, business rules, key decisions, known
  limitations. Don't write this for trivial changes (a copy tweak, a style
  fix).
- Update this CLAUDE.md itself whenever an architectural decision changes
  — it is the contract, not a snapshot.
- Update §1's ambiguity list as each item gets resolved from a real Figma
  re-inspection; don't let resolved ambiguities linger as open questions.

---

## 20. Development workflow

**Before coding**
1. Re-read the relevant section of this file and the actual Figma node(s)
   for the screen (not this file's summary of them, if the screen is one
   of §1's open ambiguities).
2. Check `shared/` and sibling features for an existing component/service
   before creating a new one.
3. Identify affected files, cross-feature impact, and edge cases.
4. State assumptions explicitly (in the PR description or a code comment
   if non-obvious) — don't silently resolve a Figma ambiguity.
5. Ask before implementing if a requirement is genuinely ambiguous and the
   ambiguity materially affects the architecture (routing, data model,
   guard structure) — don't ask for things resolvable by inspecting the
   design or code.

**During implementation**
- Follow §2–§13; stay inside the scope of the requirement — no unrelated
  refactors bundled into a feature change.
- Add tests per §14 for new business logic or API integration.

**After implementation**
1. Run tests, lint, and type-check.
2. Compare the rendered screen against its Figma node per §11.
3. Re-check this file's rules were followed (state placement, API
   isolation, error/empty/loading states present).
4. Check every changed/created file is under 400 lines; split anything
   that isn't (non-negotiable rule above).
5. Check accessibility (§17) and security (§15) for the change.
6. Update docs (§19) if the change is feature-level, not trivial.
7. Report what changed and what remains — including any new ambiguity
   discovered.

---

## 21. Git & review

- Inspect `git status`/diff before any change that could discard work.
- Keep changes scoped to the stated task — no drive-by refactors.
- Never commit secrets, `.env` files, or generated output.
- Before calling a PR ready, verify: requirement met, architecture
  followed (§2–§8), no file over 400 lines (non-negotiable rule above),
  tests added (§14), security (§15) and performance (§16) considered,
  Figma fidelity (§11) checked, docs updated (§19).

**Final self-review**, before declaring anything complete, read the diff
as each of: an Angular developer (correctness, idioms), an architect (does
this fit §2–§8), a QA engineer (edge cases, §14), a security reviewer
(§15), and a UI reviewer against the actual Figma node (§11). Report issues
found — don't fold unrelated "improvements" into the same change.

---

## 22. Courses — built (2026-08-29)

Built from `Ui-Image/auth.css` (full Figma CSS export, see §1) plus
`Course Grid.png`, `Course List.png`, `Course Detail 3.jpg`, and
`Course Detail 4.jpg`.

**Routes**: `/courses` (grid+list, one page, view toggled client-side —
confirmed same-dataset pattern from §1) and `/courses/:slug` (detail).
Both lazy-loaded under `features/courses/courses.routes.ts`.

**Shared components added** (promoted straight to `shared/ui/` per §11's
explicit "share with Instructors" mandate, not held back for a second
feature to need them first): `catalog-toolbar` (Filters/Clear, results
count, grid-list toggle, sort dropdown, search — deliberately typed with
generic `string` sort values, not Courses' own `CourseSort`, so it carries
no feature knowledge per §4), `page-banner` (gradient breadcrumb hero),
`pagination`, `collapsible-section`, `checkbox-option-list`,
`price-range-slider` (a dual-thumb range built from two overlaid native
`<input type=range>`s — the standard lightweight technique, not a
from-scratch drag implementation).

**Feature-scoped** (`features/courses/`): `filter-sidebar` (Categories/
Instructors/Price/Range/Level facets — Instructors facet is
display-only, no course needed per-instructor filtering yet),
`course-catalog-card` (one card, `layout: 'grid' | 'list'` input, per the
confirmed shared-dataset pattern), and on the detail page: `course-hero`,
`course-purchase-card`, `course-includes-card`, `course-features-card`,
`course-overview`, `course-curriculum` (accordion, first section open by
default), `course-instructor-bio`, `course-comment-form` (typed reactive
form, wired to a real `POST /courses/:slug/comments` mock endpoint).

**Data/mock-API**: `CourseCatalogStore` drives `GET /courses` with real
query params (page, pageSize, search, sort, categoryIds, levelIds,
priceOptionId) — search is debounced 300ms and piped through `switchMap`
so fast filter changes don't race (§14's overlapping-request edge case).
`CourseDetailStore` drives `GET /courses/:slug` and the comment POST.
Filter facet counts (`buildCourseFilters`) are derived from the actual
mock array, never hardcoded, so they can't drift from the real data.

**Two pre-existing bugs found and fixed while building this** (both
predate Courses, surfaced because this feature exercised paths nothing
before it did):

- `tsconfig.json` didn't actually have `strict: true` despite `ng new
  --strict` at scaffold time and §9 requiring it — the flag silently
  didn't take. Added `"strict": true` and `"strictTemplates": true`
  explicitly; the existing codebase built clean under it with zero
  fallout.
- `MockApiClient.dispatch()` discarded the entire query string before
  calling a handler (`url.split('?')` and only keeping the path) — any
  `?page=1&search=...` on a GET vanished silently. No feature before
  Courses sent real query params, so this went unnoticed. Fixed by
  parsing the query string and merging it into the same `params` object
  route params already use.
- The shared `FormField` (a `ControlValueAccessor`) stored its value in a
  plain class field, not a signal. Typing worked (the component's own
  `(input)` handler triggers its own change detection), but an *external*
  `writeValue()` call — e.g. `form.reset()` after a successful submit —
  mutated the field without triggering a re-render under `OnPush`, so the
  input visually kept showing stale text. Converted `value` to a
  `signal('')`. Rule for any future custom `ControlValueAccessor`: its
  internal value must be a signal, never a plain field, or programmatic
  `writeValue()` calls will silently fail to repaint under OnPush.
- Relatedly, `Icon` had icons (`badge-check`, `quote`, the social marks)
  defined only in `FILLED_PATHS` with no stroke variant — using one
  without `[filled]="true"` rendered a blank `<path d="">`. Fixed by
  computing render-mode as `filled() || !STROKE_PATHS[name]`, so an
  icon with only one drawn variant always renders in that variant
  regardless of what the caller passes, instead of silently disappearing.

**Known gaps**: the "Instructors" facet in the filter sidebar and the
header's cart/theme-toggle icons are presentational only (no backing
feature exists yet) — same documented-no-op convention used for
favoriting elsewhere. The newsletter subscribe form has no endpoint.
Course Detail 2's hero layout is unbuilt (§1).

---

## 23. Student Dashboard — built (2026-08-29)

Built from the 5 `Ui-Image/Student - Dashb(a)ord - *.png` mockups. No Figma
CSS export exists for these screens (see the file-corruption note below) —
built from visual inspection plus the design tokens already confirmed in
§22, which the same design system clearly shares (identical header/footer,
card radius, primary/navy colors).

**⚠️ Source-file corruption during this pass, now fixed**: partway through,
`src/app/core/auth/auth.mock-data.ts` was found overwritten end-to-end with
raw Figma CSS (91,858 lines) instead of its actual TypeScript content —
some external CSS-paste workflow wrote to the wrong file path (this
project's source file instead of `Ui-Image/auth.css`). A full sweep of
`src/**/*.ts` for CSS-like content (`grep -rl "position: absolute\|Brand
Colors/"`) found no other affected files. Restored from memory of the
original implementation and verified via a clean rebuild. If a future
session hits build errors that look like raw CSS parsed as TypeScript,
check `src/**/*.ts` for the same failure mode before assuming a code bug —
and double-check where any pasted Figma CSS actually landed before trusting
it's in `Ui-Image/`.

**Routes**: `/student` (guarded — `authGuard` + `roleGuard('student')`),
with 5 children: `''` (Dashboard), `profile`, `enrolled-courses`,
`certificates`, `quiz-attempts`. All nest under a new
`layout/dashboard-layout/` (fulfilling the folder structure §4 had already
reserved for this) which renders `PageBanner` + `ProfileBanner` +
`DashboardSidebar` + `<router-outlet>` — the page title comes from each
leaf route's `data.title`, read via `Router.events` + `toSignal`, not
hardcoded per page.

**Guards completed**: `roleGuard(role)` and the `/unauthorized` page were
both declared in §5/§7 from the start but never actually built until this
pass needed them for real. `roleGuard` redirects to `/auth/login` if no
session, `/unauthorized` if the session's role doesn't match.

**`CourseCatalogCard` promoted to `shared/ui/`** (from
`features/courses/ui/`): the dashboard's "Recently Enrolled Courses" and
the Enrolled Courses page both needed it — the exact "shared once a second
feature needs it" trigger from §6. No visual or behavioral change, just a
new location and an updated relative-import depth.

**New shared components**: `segmented-tabs` (Enrolled/Active/Completed
pill filter — generic, not Courses-specific, so it's reusable for e.g. a
future Order History status filter).

**Feature-scoped** (`features/student-dashboard/`): `stat-card`,
`continue-quiz-banner`, `quiz-score-ring` (SVG stroke-dasharray, colored by
a 50%-pass-threshold implementation default — no threshold was designed in
Figma, same convention as `password-strength.ts`), `recent-invoices-list`,
`latest-quizzes-list`, `certificates-table` (kept feature-scoped, not
promoted to the aspirational shared `DataTable` in §4's folder sketch,
since only one feature needs tabular UI so far — §6's "don't
pre-emptively generalize" rule wins over that earlier aspirational note),
`quiz-attempt-list`.

**Profile editing is real, not decorative**: the pencil icon toggles
`StudentProfileStore.editing`, which swaps the read-only grid for a typed
reactive form (First/Last Name, Phone, Gender, Bio — Username/Email/DOB/Age/
Registration Date are read-only, not exposed as editable since the mockup's
edit affordance didn't imply they should be) and calls a real `PUT
/student/profile` mock endpoint. Two implementation notes: the form is
populated via an `effect()` reading `store.data()`/`store.editing()`
together (never in the constructor — inputs and async data aren't
guaranteed ready then, see the next paragraph), and the mockup's displayed
email (`studentdemo@example.com`) was normalized to match the actual login
email (`ronald.richard@example.com`) — another instance of the Figma
lorem-data drift already documented for Home/Courses, not a real second
email.

**One more bug found and fixed**: three shared components
(`PriceRangeSlider`, `CollapsibleSection`, and this feature's own curriculum
accordion default) were reading their own non-required `input()` values
inside the constructor to set an initial signal. For a *required* input
this is a compile error (`NG8118`) and gets caught immediately; for a
plain `input()` with a default it compiles fine but is subtly wrong —
Angular doesn't guarantee bindings are applied before the constructor
runs, so the read silently returns the input's *default*, not whatever the
caller actually passed. Moved all three to `ngOnInit()`. Rule: never read
an `input()` — required or not — inside a component's constructor; use
`ngOnInit()`, a `computed()`, or an `effect()` instead.

**Known gaps**: 6 of the 11 sidebar nav items (Wishlist, Reviews, Order
History, Referrals, Messages, Support Tickets) plus Settings link to routes
that don't exist yet — same wildcard-fallthrough convention as the header's
unbuilt nav dropdowns. "Become an Instructor" / "Instructor Dashboard" in
the profile banner are presentational (no instructor-application flow or
instructor dashboard exists yet). The quiz-attempt list's red-vs-dark arrow
color was inferred as "not yet attempted" vs. "already attempted" — Figma
didn't label this distinction, only showed one red and five dark arrows.

---

## 24. Site-wide connectivity pass + Home asset fixes (2026-08-29)

A follow-up pass, not a new screen: connected previously-dead buttons/links
across the site, filled in two Home sections that had shipped without a
usable asset (§12), and added a missing decorative element visible in every
mockup's footer but never built.

**Hero search → Course catalog**: `HeroSection` (`features/home/ui/
hero-section/`) now owns the search input as a local signal and calls
`Router.navigate(['/courses'], { queryParams: { search } })` on submit,
instead of doing nothing. `CoursesCatalogPage` reads `?search=` from
`ActivatedRoute.snapshot.queryParamMap` in its constructor and passes it to
`CourseCatalogStore.load(initialSearch)`, which seeds the search signal
before the first request fires — so arriving from the Home hero both
pre-fills the catalog's search box and actually filters results, rather
than landing on an unfiltered grid with a suspiciously-populated input. The
category dropdown next to the search box stays decorative (no per-category
filter exists — see §1's original note, still true).

**"Buy Now" and course-card titles now link to the real detail page**: Home's
`shared/ui/course-card` (used by Featured/Trending Courses — distinct from
Courses' own `course-catalog-card`) had a title with no link and a Buy Now
`<button>` with no handler at all — a real dead end, not just an unbuilt
route. Both now `[routerLink]="['/courses', course().slug]"`.

**Category cards link to the catalog**: `category-section`'s cards were
plain non-interactive `<div>`s; now `<a routerLink="/courses">`. They still
link to the *unfiltered* catalog, not a per-category filter — as already
noted in §1/§12, these category names don't correspond to the mock
catalog's actual `Course.category` values (Design/Wordpress/Programming),
so pretending to filter by them would be dishonest. Revisit once a real
category taxonomy exists.

**Two new Home assets incorporated** (`public/Instructor Image.png`,
`public/OBJECTS.png` — added by the user after §12 shipped its "no usable
asset" text-only fallbacks):

- `mentor-cta-section` was rebuilt from a dark (`--color-ink`) text-only
  panel to a light two-column layout using `OBJECTS.png` as the
  illustration — this supersedes §12's "no usable illustration asset"
  note for this section specifically; the rest of §12's asset-substitution
  log still stands for sections that didn't get a new asset.
- `dual-cta-section`'s "Become An Instructor" card now shows
  `Instructor Image.png` (absolutely positioned, bottom-right, `object-fit:
  contain`) over the existing purple gradient. "Transform Access" is
  unchanged — still no asset provided for it, stays solid-navy/text-only.

**Footer + Partners-section pink glow decoration added**: every mockup
(Home, Auth, Courses, Dashboard) shows a soft pink/lavender radial glow
bleeding into these two sections' corners; the earlier build had flat
backgrounds. Added via a `::before` radial-gradient pseudo-element
(`var(--color-panel-gradient-start)` fading to transparent) on `.footer__
content` (bottom-left) and `partners-section`'s `:host` (top-right), with
the real content wrapped in a `position: relative; z-index: 1` layer so the
glow sits behind it. Purely decorative — no layout/interaction change.

**Footer links restructured to typed data + real routes**: `PublicFooter`'s
"For Instructor"/"For Student" columns were re-typed as
`{ label, link }[]` arrays instead of hardcoded template `<a>` tags, so
Login/Register now genuinely route to `/auth/login` / `/auth/register`.
Everything else in those two columns (Search Mentors, Booking, Students,
Dashboard, Appointments, Chat, Instructor Dashboard) has no built
destination yet and stays pointed at `/` — the same documented-gap
convention used everywhere else in this file, not a new pattern.

**Verified, not changed** (regression check requested alongside this pass):
all 5 Student Dashboard screens (`/student`, `/student/profile`,
`/student/enrolled-courses`, plus certificates/quiz-attempts unchanged from
§23) re-checked in-browser after the above changes — no visual or
functional regression; "Enrolled Courses" cards still route to real course
detail pages via the slugs §23 already aligned to the Courses mock catalog.

**Still-open dead ends, deliberately left as-is** (no backing feature
exists, consistent with every prior "known gaps" note in this file — not
newly discovered by this pass): header's Instructors/Pages/Blog nav
dropdowns, Home's instructor cards and blog cards, the Dashboard's Continue
Quiz button, Certificates table's view/download icons, Quiz Attempts'
arrow buttons, and the course-detail purchase card's Enroll Now button —
each would need a feature (instructor profiles, blog, quiz-taking flow,
checkout) that hasn't been scoped per §1.

---

## 25. Feature Testing Documentation

Every new feature MUST have corresponding testing documentation. This is a
process rule, not a suggestion — it exists specifically because §14's
testing *strategy* was defined early in this project but was not actually
executed as automated tests for Auth, Home, Courses, or Student Dashboard
(see `docs/CLAUDE_CODE_DEMO_EVALUATION.md` §10 for the honest accounting of
that gap). Manual testing documentation is the interim safety net until
real automated coverage exists — it is not a replacement for §14, it is
what makes the feature testable *at all* in the meantime.

Before considering a feature complete, the developer/Claude must:

1. Identify all major user flows.
2. Identify happy-path scenarios.
3. Identify negative scenarios.
4. Identify edge cases.
5. Identify UI states (loading, empty, error, validation).
6. Identify API failure scenarios — and explicitly note which ones the
   mock API can and cannot currently simulate, rather than writing a test
   case no one can ever pass or fail.
7. Identify data scenarios where applicable (there is no real database in
   this app — "data scenarios" means the in-memory mock dataset's
   create/read/update behavior, not SQL-level concerns).
8. Identify security scenarios where applicable (most concentrate in
   route-guard behavior — see `docs/testing/auth/route-guards-test-cases.md`
   for the pattern; don't repeat guard cases per feature, reference them).
9. Create or update the feature's testing document.
10. Ensure test cases have clear, specific expected results — "it should
    work" is not an expected result.

Testing documentation lives at:

```text
docs/testing/<area>/<feature>-test-cases.md
```

Follow `docs/testing/README.md` for the folder structure, the test-case
table format, ID-prefix convention, and priority definitions — don't
invent a new format per feature. Small presentational components (buttons,
cards, the catalog toolbar, pagination, icons) do not get their own testing
document; their behavior is covered inside whichever screen(s) use them,
per the same "promote once a second feature needs it" instinct as §6 —
here it's "only a component with independent business logic earns its own
file," and none currently do.

Developers must update the testing documentation whenever feature behavior
changes — a validation rule change, a new field, a new API endpoint, or a
newly wired-up affordance (e.g. if the price-range slider in Courses is
ever actually connected to filtering, `courses/course-catalog-test-cases.md`
CATALOG-023 must be rewritten, not left describing the old no-op behavior).
Stale test documentation is worse than none, because QA will trust it.

**Do not consider a feature complete until its testing documentation has
been reviewed** — per §20/§21's existing "after implementation" and
self-review steps, testing documentation is one more thing to check before
declaring a change done, not a separate follow-up task.

---

## 26. Developer Workflow

```text
Requirement
     ↓
Understand Feature
     ↓
Architecture / Plan
     ↓
Implementation
     ↓
Testing Documentation
     ↓
Automated Tests
     ↓
Self Review
     ↓
QA Testing
     ↓
Feature Complete
```

Testing documentation is part of the feature deliverable, not an optional
activity — it sits between Implementation and Automated Tests deliberately:
writing the test cases first forces the functional/negative/edge/UI/API
scenarios to be enumerated *before* deciding what's worth automating, which
is a better ordering than trying to reverse-engineer scenarios from
whatever code already happens to exist.

This workflow supersedes nothing in §20 — it's the same "Before coding /
During implementation / After implementation" structure with the testing
step made explicit and given its own artifact, because §20 as originally
written let testing stay implicit and it was consequently skipped across
every feature phase of this project (§25's opening paragraph, and
`docs/CLAUDE_CODE_DEMO_EVALUATION.md` §10, are the evidence for why this
needed to become explicit rather than staying a bullet point under §14).
