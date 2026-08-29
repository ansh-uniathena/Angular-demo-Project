# Route Guards & Unauthorized Page — Test Cases

**Not a screen of its own** — this file covers the route-level access-control
behavior enforced across the whole app: `authGuard`, `guestGuard`,
`roleGuard('student')`, `passwordResetFlowGuard`, `lockScreenGuard`
(`core/auth/auth.guard.ts`), and the `/unauthorized` destination page
(`features/unauthorized/unauthorized.page.ts`).

**Read this before testing:** `CLAUDE.md` §15 states these guards are a
**UX convenience, not a security boundary** — this is a frontend-only demo
with a mock API and no real backend authorization. Every case below tests
*client-side routing behavior*, not server-enforced security. Do not
conclude the app is "secure" from these cases passing; report separately if
the project ever adds a real backend without matching server-side checks.

**Guard reference:**

| Guard | Applied to | Behavior |
| --- | --- | --- |
| `authGuard` | `/student/*` | Requires `isAuthenticated() && !locked()`. If locked → redirect to `/auth/lock`. Otherwise if not authenticated → redirect to `/auth/login`. |
| `guestGuard` | `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/otp`, `/auth/set-password` | If authenticated and unlocked → redirect to `/`. Otherwise allow. |
| `roleGuard('student')` | `/student/*` (in addition to `authGuard`) | No user → redirect to `/auth/login`. User whose `role !== 'student'` → redirect to `/unauthorized`. |
| `passwordResetFlowGuard` | `/auth/otp`, `/auth/set-password` | Requires `AuthService.pendingEmail()` to be set; otherwise redirect to `/auth/forgot-password`. |
| `lockScreenGuard` | `/auth/lock` | Requires *any* known user (`currentUser() !== null`); otherwise redirect to `/auth/login`. Does **not** require `locked()` to actually be true. |
| none | `/`, `/courses`, `/courses/:slug`, `/unauthorized` | Fully public. |

Since there is currently only one role (`student`) with real accounts in the
mock data, and no `/instructor/*` routes exist yet (`instructor-dashboard`
is an unbuilt, empty feature folder), the `role !== 'student'` branch of
`roleGuard` cannot be exercised by normal registration — see GUARD-010.

---

## Edge Cases (route/state combinations)

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| GUARD-001 | `/student` visited while logged out | Logged out | 1. Navigate to `/student` | — | Redirected to `/auth/login` | High | Security |
| GUARD-002 | `/student/profile`, `/student/enrolled-courses`, `/student/certificates`, `/student/quiz-attempts` each visited while logged out | Logged out | 1. Navigate directly to each URL in turn | — | Every one redirects to `/auth/login` — the guard applies to the whole `/student/*` subtree via the parent route, not per-child | High | Security |
| GUARD-003 | `/student` visited while logged in and unlocked | Logged in | 1. Navigate to `/student` | — | Dashboard renders normally | High | Functional |
| GUARD-004 | `/student` visited while a session exists but is locked | Logged in, then `AuthService.lock()` has been triggered (currently only reachable via dev console — see the Lock Screen file's coverage note) | 1. With a locked session, navigate to `/student` | — | Redirected to `/auth/lock`, not `/auth/login` — the guard distinguishes "no session" from "locked session" | Medium | Security |
| GUARD-005 | `/auth/login` visited while already logged in and unlocked | Logged in | 1. Navigate to `/auth/login` | — | Redirected to `/` — the login form never renders for an authenticated user | High | Security |
| GUARD-006 | `/auth/register`, `/auth/forgot-password` visited while already logged in | Logged in | 1. Navigate to each URL | — | Both redirect to `/` | High | Security |
| GUARD-007 | `/auth/otp` visited directly with no prior Forgot Password submission | Logged out, no pending reset | 1. Navigate directly to `/auth/otp` | — | Redirected to `/auth/forgot-password` | High | Security |
| GUARD-008 | `/auth/set-password` visited directly with no prior Forgot Password submission | Logged out, no pending reset | 1. Navigate directly to `/auth/set-password` | — | Redirected to `/auth/forgot-password` | High | Security |
| GUARD-009 | `/auth/lock` visited while logged out | Logged out | 1. Navigate to `/auth/lock` | — | Redirected to `/auth/login` | High | Security |
| GUARD-010 | A non-`student` role hitting `/student/*` | Not producible with current mock data (only `student` accounts exist; registration always creates `role: 'student'`) | 1. (If a non-student account is ever seeded) log in as it 2. Navigate to `/student` | Hypothetical non-student account | Should redirect to `/unauthorized`, per `roleGuard`'s implementation — **cannot currently be exercised through the UI**; flag as a coverage gap rather than mark pass/fail | Medium | Security |
| GUARD-011 | `/unauthorized` page content and navigation | Reached via GUARD-010, or by navigating there directly (it's unguarded) | 1. Navigate to `/unauthorized` | — | Renders a clear "not authorized" message using the shared `EmptyState`/`ErrorState` pattern (per `CLAUDE.md` §5/§18), not a blank screen or raw error | Medium | Functional |
| GUARD-012 | `/unauthorized` is reachable by anyone, including logged-out visitors | Logged out | 1. Navigate directly to `/unauthorized` | — | Page renders — it is intentionally not itself guarded | Low | Functional |
| GUARD-013 | Deep-linking to a protected child route while logged out | Logged out | 1. Navigate directly to `/student/profile` (a child route, not the parent `/student`) | — | Still redirected to `/auth/login` — confirms the guard is inherited by children, not bypassable by skipping the parent path | High | Security |
| GUARD-014 | Logging out from within `/student/*` returns to a public page, not a guard loop | Logged in, on any `/student/*` page | 1. Click **Log out** | — | Navigates to a public page (Home) without bouncing back into a login→home→login redirect loop | High | Functional |
| GUARD-015 | Browser back-button after logout does not restore the protected page | Just logged out from `/student/profile` | 1. Click the browser **Back** button | — | The guard re-evaluates on navigation — back button lands back on `/auth/login`, not a stale cached view of the profile page | High | Security |
| GUARD-016 | `/**` wildcard for a completely unknown URL | Any auth state | 1. Navigate to a nonsense path, e.g. `/this-page-does-not-exist` | — | Redirected to `/` (the app's `**` route is `redirectTo: ''`) — not a raw 404 or blank page | Medium | Functional |
| GUARD-017 | `/courses` and `/courses/:slug` remain public regardless of auth state | Logged out, then logged in | 1. Visit `/courses` and a valid course detail URL in both states | — | Both render identically whether logged in or out — no guard applied | Medium | Functional |
| GUARD-018 | Manually clearing `localStorage` mid-session does not crash the app | Logged in with "Remember Me" | 1. Open dev tools, clear the `dreams-lms.session` key from `localStorage` 2. Refresh | — | On reload, `AuthService` finds no stored session and treats the user as logged out; protected routes redirect to login instead of crashing on a missing/corrupt value | Medium | Security |
| GUARD-019 | Corrupted `localStorage` session value does not crash the app | Logged in | 1. Edit the `dreams-lms.session` value in `localStorage` to invalid JSON 2. Refresh | Invalid JSON string | `loadStoredSession()`'s try/catch returns `null` — app treats this as logged out rather than throwing | Medium | Edge |
| GUARD-020 | Two tabs, one logs out — the other tab's protected page is not live-guarded until it navigates | Logged in in two tabs, both on `/student` | 1. Log out in Tab A 2. Without refreshing, interact with Tab B | — | Tab B's already-rendered page does **not** instantly disappear (guards run on navigation, not on a live session-watch) — record actual behavior; this is expected given the architecture, not necessarily a defect | Low | Edge |
| GUARD-021 | `roleGuard` with no user at all reaching the check | Logged out | 1. Navigate to `/student` while logged out | — | `roleGuard`'s own "no user" branch would also redirect to `/auth/login`, but in practice `authGuard` (which runs first in the guard array) already redirects before `roleGuard` is reached — confirm only one redirect happens, not a double-bounce | Low | Edge |
| GUARD-022 | Guard redirects preserve no unintended query/fragment leakage | Logged out | 1. Navigate to `/student/profile?foo=bar#section` | — | Redirect target is a clean `/auth/login` — no sensitive fragment/query data from the attempted deep link is exposed on the login page | Low | Security |

---

**Coverage note:** GUARD-004, GUARD-010, and GUARD-020 require either
triggering `AuthService.lock()` (no UI button exists — see the Lock Screen
file) or a non-`student` account (none exist in the mock data). These are
documented as **currently unreachable through normal UI interaction** —
QA should exercise them via the browser dev console (`ng.getComponent` /
directly calling the injected service, or a temporary mock-data edit) if a
release genuinely needs this verified, rather than skipping them silently.
