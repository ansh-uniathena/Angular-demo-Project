# Home Page — Test Cases

**Screen:** `/` · **Component:** `features/home/home.page.ts` (14 section components, one `GET /home` mock endpoint via `HomeStore`)

**What's real vs. decorative on this page** (read before testing — this
determines what counts as a defect vs. an intentional documented gap, per
`CLAUDE.md` §12/§24):

| Element | Behavior |
| --- | --- |
| Hero search box | **Real.** Submits to `/courses?search=<term>`, which pre-fills and actually filters the catalog. |
| Category cards | **Real navigation, not real filtering.** Link to `/courses` (unfiltered) — the category names shown don't map to any real `Course.category` value, so no per-category filter exists (documented, not a bug). |
| Featured/Trending course cards — title & "Buy Now" | **Real.** Link to `/courses/:slug` for the real course. |
| Instructor cards, blog cards | **Decorative.** No instructor-detail or blog feature exists; not expected to navigate anywhere meaningful. |
| Testimonial prev/next arrows | **Real**, client-side only (cycles through a fixed in-memory array; no API call). |
| Header nav dropdowns (Courses/Instructors/Pages/Blog chevrons), cart icon, theme toggle | **Decorative.** No sub-menus, cart, or theme system is implemented. |
| Footer newsletter "Subscribe" | **Decorative no-op** — `(submit)="$event.preventDefault()"`, no endpoint. |
| Footer "For Instructor"/"For Student" links | **Partially real** — only Login/Register are real routes; the rest point at `/`. |
| Favorite (heart) icons on any course card | **Decorative no-op** — click is handled but does not persist (`onFavoriteToggled` is an empty stub everywhere it appears). |

---

## Functional / Happy Path

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| HOME-001 | Home page loads and renders all sections | Any auth state | 1. Navigate to `/` | — | All 14 sections render without error once the `GET /home` mock call resolves | High | Functional |
| HOME-002 | Hero search with a term that matches a real course | Any auth state, on `/` | 1. Type a search term into the hero search box 2. Submit | A word from a real course title, e.g. `Wordpress` | Navigates to `/courses?search=Wordpress`; the catalog search box is pre-filled with the same term and results are filtered accordingly | High | Functional |
| HOME-003 | Hero search submitted empty | On `/` | 1. Leave the search box empty 2. Submit | `""` | Navigates to `/courses` with no `search` query param (per `HeroSection.submitSearch()`'s `term ? {...} : {}` branch) — catalog shows the unfiltered list | Medium | Functional |
| HOME-004 | Category card navigates to the catalog | On `/` | 1. Click any category card | — | Navigates to `/courses` (unfiltered — see the table above) | High | Functional |
| HOME-005 | Featured/Trending course card title navigates to its detail page | On `/` | 1. Click a course card's title | — | Navigates to `/courses/<that course's slug>` and shows the matching course | High | Functional |
| HOME-006 | "Buy Now" navigates to the course detail page | On `/` | 1. Click **Buy Now** on any course card | — | Navigates to `/courses/<that course's slug>` (same destination as the title — "buying" does not add to a cart) | High | Functional |
| HOME-007 | Testimonial carousel — Next | On `/`, testimonials section visible | 1. Click the **Next** (→) arrow | — | Advances to the next testimonial; wraps back to the first after the last | Medium | Functional |
| HOME-008 | Testimonial carousel — Previous | On `/`, testimonials section visible | 1. Click the **Previous** (←) arrow | — | Goes to the previous testimonial; wraps to the last one from the first | Medium | Functional |

## Negative Testing

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| HOME-009 | Hero search with a term matching no course | On `/` | 1. Enter a term guaranteed not to match any course title 2. Submit | `zzzznonexistentzzzz` | Navigates to `/courses?search=zzzznonexistentzzzz`; catalog shows "No courses match these filters." — not an error | Medium | Negative |
| HOME-010 | Newsletter form submitted with no email | On `/`, footer visible | 1. Leave the newsletter email field blank 2. Click **Subscribe** | `""` | The native email input has no `required` enforcement configured beyond the browser's own `type="email"` behavior if present — since the handler is a no-op (`preventDefault()` only), nothing happens either way; confirm no console error is thrown | Low | Negative |
| HOME-011 | Clicking an unbuilt header nav item (Instructors/Pages/Blog) | On `/` | 1. Click "Instructors" (or Pages/Blog) in the header | — | Falls through to the wildcard route, which redirects to `/` — the user ends up back on Home, not a broken/blank page (documented gap, not a crash) | Low | Negative |

## Edge Cases

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| HOME-012 | Hero search term with only spaces | On `/` | 1. Enter only spaces 2. Submit | `"   "` | `searchTerm().trim()` empties it — treated the same as HOME-003 (no `search` param sent) | Low | Edge |
| HOME-013 | Hero search term with special characters | On `/` | 1. Enter symbols/URL-unsafe characters 2. Submit | `C# & .NET?!` | The term is passed as an Angular Router query param (auto-encoded) — catalog receives and displays it in the search box correctly, no broken URL | Medium | Edge |
| HOME-014 | Testimonial carousel with only one testimonial | Contrived — would need mock data reduced to 1 item | 1. Click Next/Previous | — | `(i ± 1 + total) % total` with `total = 1` always resolves back to index 0 — no crash, testimonial doesn't visibly change | Low | Edge |
| HOME-015 | Rapid repeated clicking of testimonial Next | On `/` | 1. Click **Next** many times quickly | — | Cycles through smoothly with no skipped/duplicated renders or console errors | Low | Edge |
| HOME-016 | Favorite (heart) icon clicked on a Home course card | On `/` | 1. Click the heart icon on any course card | — | Icon may show a local UI state change if the card component tracks it, but nothing persists after a page reload — `onFavoriteToggled` is a documented no-op | Low | Edge |

## UI Testing

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| HOME-017 | Loading state while `GET /home` is in flight | Any auth state | 1. Navigate to `/` and observe immediately (throttle network if needed to see it clearly) | — | A spinner (`app-spinner`) shows briefly before content renders | Medium | UI |
| HOME-018 | Error state if `/home` fails | Contrived — would need the mock endpoint to be forced to error (none of the current mock handlers simulate a Home failure) | — | — | **Not currently producible** — `registerHomeMockHandlers` only ever returns success; flagged as an untestable case, not a defect | Low | UI |
| HOME-019 | Header shows Login/Register when logged out, user name + Log out when logged in | Logged out, then logged in | 1. Observe header in both states | — | Correct conditional rendering based on `AuthService.currentUser()` | High | UI |
| HOME-020 | Log out from the header | Logged in, on `/` | 1. Click **Log out** | — | Session cleared, header reverts to logged-out state, still on `/` | High | UI |
| HOME-021 | Footer pink/lavender glow decoration renders without visual glitches | Any state | 1. Scroll to the footer | — | The radial-gradient `::before` decoration sits behind the content (not overlapping/obscuring text or links) | Low | UI |
| HOME-022 | Responsive behavior at common breakpoints | Any state | 1. Resize the viewport to mobile/tablet/desktop widths | — | Sections reflow without horizontal scrollbars or overlapping content — **not previously verified against any Figma mobile frame** (none exists), so record actual behavior rather than assume compliance | Medium | UI |

## API Testing

Endpoint: `GET /home`. No error-path simulation currently exists for this endpoint.

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| HOME-023 | 200 success returns the full aggregate payload | Any state | 1. Load `/` | — | Single response contains all section data (hero stats, categories, featured/trending courses, testimonials, etc.) in one call — not N separate requests | Medium | API |
| HOME-024 | 400/401/403/404/409/500/timeout/network-unavailable/malformed/empty response | — | Not simulated by the current mock API | — | **Not currently producible** — every one of these is a coverage gap to close if Home ever needs resilience testing | Low | API |

---

**Coverage note:** no Security section exists for this file — Home is a
fully public page with no form that submits sensitive data (the newsletter
field is decorative). Guard-related access-control cases live in
`auth/route-guards-test-cases.md`.
