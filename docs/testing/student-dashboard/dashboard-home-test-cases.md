# Student Dashboard (Home) — Test Cases

**Screen:** `/student` · **Component:** `features/student-dashboard/dashboard-home/dashboard-home.page.ts`
**Facade:** `DashboardHomeStore` · **Endpoint:** `GET /student/dashboard-summary`
**Guards:** `authGuard` + `roleGuard('student')` — see `auth/route-guards-test-cases.md` for guard-specific cases; this file assumes access is already granted.

**What's real vs. decorative:**

| Element | Behavior |
| --- | --- |
| Stat cards (Enrolled/Active/Completed Courses) | **Real** — sourced from `dashboard-summary`. |
| "Continue Quiz" banner + button | Banner content is **real** (shows the actual in-progress quiz title and answered/total count); the **Continue Quiz button itself is decorative** — no quiz-taking feature exists (`CLAUDE.md` §24 known gap). |
| Recently Enrolled Courses cards | **Real**, and "View Course" navigates to the genuine `/courses/:slug` page (the mock dashboard data's slugs are deliberately aligned with the real Courses catalog). |
| Recent Invoices list | **Read-only display**, no click-through action. |
| Latest Quiz Results list | **Read-only display**, no click-through action. |
| Favorite icon on course cards | **Decorative no-op**, same as everywhere else. |
| Quiz score ring color | Green/normal if `percent >= 50`, red/"low" styling otherwise — **50% is an implementation default, not a Figma-specified threshold** (`CLAUDE.md` §23). |

---

## Functional / Happy Path

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DASH-001 | Dashboard loads with all widgets populated | Logged in as a student | 1. Navigate to `/student` | — | Stat cards, Continue Quiz banner, Recently Enrolled Courses, Recent Invoices, and Latest Quiz Results all render with real mock data | High | Functional |
| DASH-002 | Stat card counts match the actual enrolled-course data | Logged in | 1. Compare the dashboard's "Enrolled Courses" count to the count shown on the Enrolled Courses page | — | Both numbers match (same underlying mock dataset) | Medium | Functional |
| DASH-003 | "View Course" on a Recently Enrolled card navigates to the real course | Logged in, on `/student` | 1. Click "View Course" on any recently-enrolled card | — | Navigates to `/courses/<real slug>` and shows the matching course, not a 404 | High | Functional |
| DASH-004 | Continue Quiz banner shows the correct in-progress quiz | Logged in, mock data has an in-progress quiz | 1. Observe the banner text | — | Shows the real quiz title and "Answered: X/Y" matching `InProgressQuiz` mock data | Medium | Functional |
| DASH-005 | Latest Quiz Results ring color reflects pass/fail threshold | Logged in | 1. Compare a quiz's score ring color to its percent value | — | Rings for scores ≥50% render in the normal/pass style; rings below 50% render in the "low" style | Medium | Functional |
| DASH-006 | Recent Invoices statuses display correctly | Logged in | 1. Observe the invoice list's status labels | — | `paid`/`pending`/`failed` each render with a distinguishable label/style, matching the mock data | Low | Functional |

## Negative Testing

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DASH-007 | Continue Quiz button clicked | Logged in, on `/student` | 1. Click **Continue Quiz** | — | No quiz-taking flow launches — documented no-op, not a defect | Low | Negative |
| DASH-008 | No in-progress quiz in the data | Contrived — would require `inProgressQuiz: null` in mock data | 1. Observe the dashboard | — | The Continue Quiz banner should not render (or should render an empty/neutral state) rather than crash on a null value — verify actual behavior against the `InProgressQuiz | null` model | Medium | Negative |

## Edge Cases

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DASH-009 | Favorite icon clicked on a Recently Enrolled card | Logged in | 1. Click the heart icon | — | No persistence after reload — documented no-op | Low | Edge |
| DASH-010 | Score ring at exactly 50% | Contrived — needs a quiz result at exactly 50% | 1. Observe that specific result's ring color | 50% | Renders as "passed" per `computed(() => this.percent() >= PASS_THRESHOLD)` — the boundary is inclusive | Low | Edge |
| DASH-011 | Score ring at 0% and 100% | Contrived boundary values | 1. Observe rings at these two extremes | 0%, 100% | 0% renders fully "low"/empty progress with no SVG rendering error; 100% renders fully filled with no overflow past the circle | Low | Edge |
| DASH-012 | Zero recently-enrolled courses | Contrived — empty `recentlyEnrolledCourses` array | 1. Observe the section | — | Section shows an empty state or is hidden gracefully — not a broken/empty grid with leftover headings | Medium | Edge |
| DASH-013 | Empty invoices / quiz-results lists | Contrived | 1. Observe both sections with empty arrays | — | Each renders a sensible empty state, not a blank gap | Low | Edge |
| DASH-014 | Navigating away and back to `/student` re-fetches fresh data | Logged in | 1. Navigate to `/student/profile` 2. Navigate back to `/student` | — | Dashboard reloads via `store.load()` in the constructor each time the component is (re)created — confirm no stale data lingers | Low | Edge |

## UI Testing

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DASH-015 | Loading state while `dashboard-summary` is in flight | Logged in | 1. Navigate to `/student` and observe immediately | — | Spinner shown during the mock delay | Medium | UI |
| DASH-016 | Sidebar navigation highlights "Dashboard" as active | Logged in, on `/student` | 1. Observe the dashboard-layout sidebar | — | "Dashboard" nav item is visually marked active; other items are not | Low | UI |
| DASH-017 | Responsive layout of stat cards and widgets | Logged in | 1. Resize to mobile/tablet widths | — | Cards/widgets reflow without horizontal overflow | Medium | UI |

## API Testing

Endpoint: `GET /student/dashboard-summary`. No error-path simulation exists — this endpoint always succeeds.

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DASH-018 | 200 success returns the full summary payload | Logged in | 1. Load `/student` | — | Single response with `stats`, `inProgressQuiz`, `recentlyEnrolledCourses`, `recentInvoices`, `latestQuizResults` | High | API |
| DASH-019 | 401/403/404/500/timeout/network-unavailable/malformed/empty response | — | Not simulated by the current mock API | — | **Not currently producible** — a real gap; the guard already prevents an unauthenticated view, but a genuinely *authenticated-but-API-fails* scenario cannot be triggered today | Medium | API |

---

**Coverage note:** no dedicated Security section — access control for the
whole `/student/*` area is centrally tested in
`auth/route-guards-test-cases.md` (GUARD-001–GUARD-004) rather than
repeated per dashboard page.
