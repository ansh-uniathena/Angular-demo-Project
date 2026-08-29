# Enrolled Courses — Test Cases

**Screen:** `/student/enrolled-courses` · **Component:** `features/student-dashboard/enrolled-courses/enrolled-courses.page.ts`
**Facade:** `EnrolledCoursesStore` · **Endpoint:** `GET /student/enrolled-courses`
**Guards:** `authGuard` + `roleGuard('student')` (see `auth/route-guards-test-cases.md`).

**Business rules actually implemented:**
- Three tabs: **Enrolled** (all of the student's courses), **Active**, **Completed** — "Enrolled" isn't its own status, it's the full set; Active/Completed partition that set by `enrollmentStatus`.
- Each tab shows a live count badge sourced from the server response's `counts` object, not just the currently-displayed page length.
- Page size is fixed at 9 (`PAGE_SIZE`), same pagination component as the Course Catalog.
- Switching tabs calls `store.setFilter(id)`, which re-fetches with the new `filter` query param and (implicitly, per the same pattern as the catalog) should reset to page 1.
- Cards reuse the shared `CourseCatalogCard` (promoted to `shared/ui/` specifically because this screen needed it too — `CLAUDE.md` §23) — so "View Course" navigates to the real `/courses/:slug` page, same as everywhere else this card is used.
- Favoriting is a documented no-op.
- There is no "unenroll" or "drop course" action anywhere on this screen.

---

## Functional / Happy Path

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ENROLL-001 | Page loads on the "Enrolled" tab by default | Logged in | 1. Navigate to `/student/enrolled-courses` | — | "Enrolled" tab is active by default, showing all enrolled courses (both active and completed) | High | Functional |
| ENROLL-002 | Switch to the "Active" tab | On the page, "Enrolled" tab active | 1. Click **Active** | — | Shows only courses with `enrollmentStatus: 'active'`; tab count badge matches the number shown | High | Functional |
| ENROLL-003 | Switch to the "Completed" tab | On the page | 1. Click **Completed** | — | Shows only courses with `enrollmentStatus: 'completed'` | High | Functional |
| ENROLL-004 | Tab count badges match actual filtered results | On the page | 1. Compare each tab's badge number to the number of cards shown when that tab is selected | — | Counts match exactly | Medium | Functional |
| ENROLL-005 | "View Course" navigates to the real course detail page | On any tab | 1. Click "View Course" on any card | — | Navigates to `/courses/<real slug>`, showing the genuine course (not a 404) | High | Functional |
| ENROLL-006 | Pagination works within a tab | A tab with more than 9 results (if the mock dataset supports it — otherwise verify with "Enrolled", which aggregates both statuses) | 1. Navigate to page 2 | — | Shows the remaining results for that tab specifically | Medium | Functional |

## Negative Testing

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ENROLL-007 | "Completed" tab with zero completed courses | Contrived — depends on current mock data having 0 completed courses | 1. Click **Completed** | — | Shows an empty state ("No courses" or equivalent), not a blank grid | Medium | Negative |
| ENROLL-008 | Favorite icon clicked | On any tab | 1. Click a card's heart icon | — | No persistence — documented no-op | Low | Negative |

## Edge Cases

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ENROLL-009 | Switching tabs resets to page 1 | On page 2 of any tab with multiple pages | 1. Switch to a different tab | — | New tab starts on page 1, not stuck on whatever page number the previous tab was on | Medium | Edge |
| ENROLL-010 | Rapidly switching tabs | On the page | 1. Click Enrolled → Active → Completed → Enrolled quickly | — | Final displayed tab/content matches the last click — no stale/out-of-order result from an earlier in-flight request overwrites the final selection | High | Edge |
| ENROLL-011 | Navigate away and back to the page | On a non-default tab (e.g. Active) | 1. Navigate to Dashboard 2. Navigate back to Enrolled Courses | — | Since the store is route-scoped (`providers: [EnrolledCoursesStore]`), a fresh instance loads on re-entry — confirm it resets to the default "Enrolled" tab rather than remembering the previous tab | Low | Edge |
| ENROLL-012 | A course appears consistently between the Dashboard's "Recently Enrolled" and this page | Logged in | 1. Note a course shown on `/student` 2. Find the same course here | — | Same title/slug/instructor — both screens read from the same underlying mock course data, no drift | Low | Data |

## UI Testing

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ENROLL-013 | Loading state on initial load and on every tab switch | On the page | 1. Observe during the mock delay for the initial load and for each tab click | — | Spinner shown each time `loading` is true | Medium | UI |
| ENROLL-014 | Active tab is visually distinguished from inactive tabs | On the page | 1. Observe the segmented tabs component | — | Selected tab has a clear visual state (per the shared `SegmentedTabs` pill style) distinct from unselected tabs | Low | UI |
| ENROLL-015 | Empty state styling for a tab with zero results | Covered by ENROLL-007 | — | — | Uses the shared empty-state pattern, not an ad hoc message | Low | UI |
| ENROLL-016 | Keyboard-only tab switching and pagination | On the page | 1. Operate tabs and pagination using only the keyboard | — | Fully operable via keyboard; tabs have accessible names/roles | Medium | UI |
| ENROLL-017 | Responsive layout of the card grid | On the page | 1. Resize to mobile/tablet widths | — | Cards reflow without horizontal overflow | Medium | UI |

## API Testing

Endpoint: `GET /student/enrolled-courses`. No error-path simulation exists.

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ENROLL-018 | 200 success includes items, total, and counts | On the page | 1. Inspect the network response for any tab | — | Response includes `items`, `total`, `page`, `pageSize`, and a `counts` object for all three filters regardless of which one was requested | High | API |
| ENROLL-019 | Query param `filter` matches the active tab | Any tab selected | 1. Inspect the request URL for each tab | — | `?filter=enrolled` / `?filter=active` / `?filter=completed` sent correctly | Medium | API |
| ENROLL-020 | 400/401/403/404/409/500/timeout/network-unavailable/malformed/empty response | — | Not simulated by the current mock API | — | **Not currently producible** | Medium | API |

## Data

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ENROLL-021 | "Enrolled" total always equals Active + Completed | On the page | 1. Compare the three tab counts | — | `enrolled === active + completed`, since "enrolled" is the full set, not a fourth independent status | Medium | Data |

---

**Coverage note:** no Security section — access control is centrally
covered in `auth/route-guards-test-cases.md`. There is no
create/delete/duplicate-record scenario on this screen since enrollment
itself cannot be created or removed anywhere in the current build.
