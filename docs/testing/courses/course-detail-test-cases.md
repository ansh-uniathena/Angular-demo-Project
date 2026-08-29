# Course Detail — Test Cases

**Screen:** `/courses/:slug` · **Component:** `features/courses/detail/course-detail.page.ts`
**Facade:** `CourseDetailStore` · **Endpoints:** `GET /courses/:slug`, `POST /courses/:slug/comments`

**What's real vs. decorative on this page:**

| Element | Behavior |
| --- | --- |
| Curriculum accordion | **Real**, client-side only — first section open by default, no API involved. |
| Comment form ("Post a Comment") | **Real** — submits to `POST /courses/:slug/comments`, requires Name/Email/Subject/Comment. |
| Purchase card "Enroll Now" button | **Decorative** — no checkout/enrollment flow exists (`CLAUDE.md` §22/§24 known gap). |
| Favorite (heart) icon | **Decorative no-op**, same as elsewhere. |
| Hero layout | Uses the "Detail 1" full-bleed dark-overlay variant only — "Detail 2"'s light-header variant is unbuilt (`CLAUDE.md` §1/§22). |

**Business rules actually implemented:**
- `:slug` is read once, from the route snapshot, in the constructor — the page does **not** react to the slug changing without a full navigation/remount (relevant if ever linked slug-to-slug without a full route re-entry).
- Unknown slug → mock API returns `404 "Course not found."`.
- Comment form: Name (required, min 2 chars), Email (required, valid format), Subject (required), Comment (required, min 5 chars) — all client-side. The mock API itself only checks `name`, `email`, `comment` are non-empty (not `subject`, and no server-side length/format re-check) — since the client blocks first, this server gap is not reachable through the UI, but is worth knowing.
- On successful comment submission: the store sets `commentSubmitted = true`; the form component has an `effect()` that resets the form **only** when `submitted()` becomes true — a failed submission never clears the user's typed input.
- The comment endpoint does not actually append the new comment to any displayed comment list — there is no comment-list UI reading back submitted comments in this build; success is communicated via the form's own state only.

---

## Functional / Happy Path

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| COURSE-001 | Load a valid course detail page | Any auth state | 1. Navigate to `/courses/<a real slug>` (e.g. via a catalog card) | Real slug | Hero, Overview, Curriculum, Instructor bio, Comment form, and the sticky purchase/includes/features sidebar all render with that course's real data | High | Functional |
| COURSE-002 | Curriculum — first section open by default | On a course detail page | 1. Observe the curriculum accordion on load | — | The first module/section is expanded; others are collapsed | Medium | Functional |
| COURSE-003 | Curriculum — expand/collapse other sections | On a course detail page | 1. Click a collapsed section's header | — | That section expands showing its lessons; clicking again collapses it | Medium | Functional |
| COURSE-004 | Submit a valid comment | On a course detail page | 1. Fill Name, Email, Subject, Comment 2. Click submit | `Jane Doe` / `jane@example.com` / `Great course!` / `Really enjoyed the curriculum.` | `200` success; the form resets to empty (per the `submitted()` effect); a success indication is shown (via the shared `Alert`/form `submitted` state) | High | Functional |
| COURSE-005 | Navigating here from a catalog card shows the same course | On `/courses`, viewing a specific card | 1. Click that card's title or "Buy Now" | — | Detail page shows the exact same course (same title, price, instructor) as the card clicked | High | Functional |

## Negative Testing

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| COURSE-006 | Unknown/invalid slug | Any auth state | 1. Navigate to `/courses/this-slug-does-not-exist` | invalid slug | `404` from the API; page shows the shared "not found" `EmptyState`, not a raw error or blank page (per `CLAUDE.md` §18) | High | Negative |
| COURSE-007 | Comment — empty Name | On a course detail page | 1. Leave Name blank 2. Fill the rest 3. Submit | name = `""` | Required-field error under Name; no API call | High | Negative |
| COURSE-008 | Comment — Name shorter than 2 characters | On a course detail page | 1. Enter `J` 2. Submit | `J` | "minimum length" error | Medium | Negative |
| COURSE-009 | Comment — empty Email | On a course detail page | 1. Leave Email blank 2. Submit | `""` | Required-field error | High | Negative |
| COURSE-010 | Comment — invalid email format | On a course detail page | 1. Enter `not-an-email` 2. Submit | as given | "invalid email" error | High | Negative |
| COURSE-011 | Comment — empty Subject | On a course detail page | 1. Leave Subject blank 2. Submit | `""` | Required-field error | Medium | Negative |
| COURSE-012 | Comment — empty Comment body | On a course detail page | 1. Leave Comment blank 2. Submit | `""` | Required-field error | High | Negative |
| COURSE-013 | Comment — body shorter than 5 characters | On a course detail page | 1. Enter `Hi` 2. Submit | `Hi` | "minimum length" error under Comment | Medium | Negative |
| COURSE-014 | Comment — all fields empty | On a course detail page | 1. Click submit with nothing filled | — | All four required-field errors show at once; no API call | High | Negative |
| COURSE-015 | Enroll Now clicked | On a course detail page | 1. Click **Enroll Now** on the purchase card | — | No checkout/enrollment happens — this is a documented, intentional no-op; do not report as a defect without confirming against `CLAUDE.md` §24's known-gaps list | Low | Negative |

## Edge Cases

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| COURSE-016 | Double-click submit on the comment form | Valid comment data entered | 1. Click submit twice quickly | Valid data | `CourseDetailStore.submitComment()` guards on `_commentSubmitting` — the second click is a no-op, only one request is sent | High | Edge |
| COURSE-017 | Resubmit after a failed comment submission | Invalid data submitted once, causing a client-side block | 1. Trigger COURSE-007 (or similar) 2. Fill in the missing field 3. Submit again | Corrected data | Second submission succeeds normally | Medium | Edge |
| COURSE-018 | Failed submission does not clear the form | Comment form filled, then a validation error is triggered (or, if reachable, a server error) | 1. Trigger a failure 2. Observe the form fields | — | Typed values remain in the form — only a **successful** submission clears it (per the `submitted()`-gated reset effect) | Medium | Edge |
| COURSE-019 | Very long comment text | On a course detail page | 1. Enter a 2000+ character comment 2. Submit | long string | Accepted (no max-length rule); submits successfully; no layout break in the form or (if shown) confirmation area | Low | Edge |
| COURSE-020 | Comment with special characters / basic HTML-looking text | On a course detail page | 1. Enter text containing `<script>`-like content in the Comment field 2. Submit | `<b>test</b> <script>alert(1)</script>` | Submits successfully as plain text; confirm the app does not render this back via `[innerHTML]` anywhere (per `CLAUDE.md` §15 — and this repo's own audit confirms 0 `innerHTML` usages app-wide) | Medium | Security |
| COURSE-021 | Curriculum accordion — expand all sections, then collapse all | On a course detail page with multiple sections | 1. Click each section header to open all 2. Click each again to close all | — | Each section's open/closed state is independent; no section auto-closes another (unless the design intends only one section open at a time — verify actual behavior) | Low | Edge |
| COURSE-022 | Favorite icon clicked on the detail page | On a course detail page | 1. Click the heart icon | — | No persistence after reload — documented no-op, same as catalog/Home cards | Low | Edge |

## UI Testing

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| COURSE-023 | Loading state while the course loads | Any state | 1. Navigate to a detail page and observe before data arrives | — | Spinner shown during the ~600ms mock delay | Medium | UI |
| COURSE-024 | Comment submit button loading state | Valid data entered | 1. Submit and observe the button during the mock delay | Valid data | Button shows a loading indicator and disables while `commentSubmitting` is true | Medium | UI |
| COURSE-025 | Field-level red border + message on touched invalid comment fields | On a course detail page | 1. Tab through each comment field without filling it | — | Shared `FormField` red-border + inline message pattern applies consistently | Medium | UI |
| COURSE-026 | Sticky sidebar (purchase/includes/features cards) behavior on scroll | On a course detail page | 1. Scroll down the page | — | Sidebar cards stick within their container as designed, without overlapping the footer or floating incorrectly | Low | UI |
| COURSE-027 | Keyboard-only completion of the comment form | On a course detail page | 1. Fill and submit the comment form using only the keyboard | Valid data | Fully operable via keyboard, including the accordion's expand/collapse controls | Medium | UI |
| COURSE-028 | Responsive layout (hero, sidebar, curriculum) | On a course detail page | 1. Resize to mobile/tablet widths | — | Content reflows without horizontal overflow — record actual behavior, not previously verified against a Figma mobile frame | Medium | UI |

## API Testing

Endpoints: `GET /courses/:slug`, `POST /courses/:slug/comments`. No error-path simulation exists beyond the two documented cases below.

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| COURSE-029 | 200 success on course fetch | Real slug | Covered by COURSE-001 | — | Full `CourseDetail` payload returned | High | API |
| COURSE-030 | 404 on unknown slug | Invalid slug | Covered by COURSE-006 | — | `AppError` 404 "Course not found." | High | API |
| COURSE-031 | 200 success on comment submit | Valid comment data | Covered by COURSE-004 | — | `{ success: true }` | High | API |
| COURSE-032 | 400 on comment submit missing a required field, if the client-side block is somehow bypassed | Contrived (would require sending the request outside the UI, e.g. via dev tools) | 1. Send `POST /courses/:slug/comments` with an empty `name`/`email`/`comment` directly | `{ comment: "" }` etc. | `AppError` 400 "Name, email, and comment are required." — confirms the server-side check exists as a backstop even though the UI never triggers it | Low | API |
| COURSE-033 | 401/403/409/500/timeout/network-unavailable/malformed/empty response on either endpoint | — | Not simulated by the current mock API | — | **Not currently producible** — coverage gap, same pattern as every other feature in this app | Medium | API |

## Data

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| COURSE-034 | Submitted comment is not persisted or displayed anywhere | Comment submitted successfully (COURSE-004) | 1. Reload the page | — | No comment list shows the just-submitted comment — confirms there is no read-back/display feature for comments in this build (not a bug, just scope) | Low | Data |

---

**Coverage note:** COURSE-020 is the one place a Security-typed case
appears in this file, because it's the only user-generated free-text input
on this screen that could theoretically be reflected somewhere; it is
covered rather than assumed safe, consistent with this project's confirmed
zero `innerHTML`/`bypassSecurityTrust*` usage audit finding.
