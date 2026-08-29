# Quiz Attempts — Test Cases

**Screen:** `/student/quiz-attempts` · **Component:** `features/student-dashboard/quiz-attempts/quiz-attempts.page.ts`
**Facade:** `QuizAttemptsStore` · **Endpoint:** `GET /student/quiz-attempts`
**Guards:** `authGuard` + `roleGuard('student')` (see `auth/route-guards-test-cases.md`).

**This is a simple, read-only list screen** — no forms, no pagination, no filters. Test scope is intentionally narrow.

**What's real vs. decorative:**

| Element | Behavior |
| --- | --- |
| Quiz list (course title, question count) | **Real** — sourced from the mock endpoint. |
| Arrow/CTA button per row, colored by `attempted` | **Decorative navigation** — no quiz-taking feature exists to actually navigate into (`CLAUDE.md` §23/§24 known gap). Color (red vs. dark) is an **inferred** convention for "not yet attempted" vs. "already attempted" — Figma didn't label this distinction explicitly, so treat the *color meaning* as a documented assumption to confirm with design, not a bug if it looks "backwards" to a new reviewer. |

---

## Functional / Happy Path

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| QUIZ-001 | Quiz list loads with data | Logged in, mock data has quiz attempts | 1. Navigate to `/student/quiz-attempts` | — | List renders each quiz's course title and question count | High | Functional |
| QUIZ-002 | Attempted quizzes render with the "already attempted" style | Logged in | 1. Identify a quiz with `attempted: true` | — | Its CTA renders in the dark/reviewed style, not the red/pending style | Medium | Functional |
| QUIZ-003 | Not-yet-attempted quizzes render with the "pending" style | Logged in | 1. Identify a quiz with `attempted: false` | — | Its CTA renders in the red/pending style | Medium | Functional |
| QUIZ-004 | Question counts display correctly | Logged in | 1. Compare a row's question count to the mock data | — | Matches exactly | Low | Functional |
| QUIZ-005 | Multiple quiz attempts render as distinct rows | Logged in, multiple mock entries | 1. Count the rows | — | One row per `QuizAttemptListItem`, no merging | Low | Functional |

## Negative Testing

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| QUIZ-006 | Arrow/CTA button clicked | Logged in, on the page | 1. Click any row's arrow button | — | No quiz-taking flow launches — documented no-op | Low | Negative |

## Edge Cases

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| QUIZ-007 | No quizzes available | Contrived — empty `mockQuizAttempts` array | 1. Load the page | — | Shows the documented empty state: "No quizzes available yet." via `ErrorState [retryable]="false"` | High | Edge |
| QUIZ-008 | All quizzes attempted | Contrived — every item has `attempted: true` | 1. Observe the list | — | No item shows the red/pending style | Low | Edge |
| QUIZ-009 | All quizzes unattempted | Contrived — every item has `attempted: false` | 1. Observe the list | — | Every item shows the red/pending style | Low | Edge |
| QUIZ-010 | Quiz with a very high question count | Contrived | 1. Observe that row | e.g. 500 questions | Displays the number correctly, no layout break | Low | Edge |
| QUIZ-011 | Very long course title in a row | Contrived | 1. Observe that row | Long title | Truncates/wraps gracefully, doesn't break row layout | Low | Edge |

## UI Testing

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| QUIZ-012 | Loading state while quiz attempts load | Logged in | 1. Navigate to the page and observe immediately | — | Spinner shown during the mock delay | Medium | UI |
| QUIZ-013 | List is keyboard-navigable | Logged in | 1. Tab through each row's CTA button | — | Reachable via keyboard with an accessible name, even though it's currently a no-op | Low | UI |
| QUIZ-014 | Responsive layout on narrow viewports | Logged in | 1. Resize to mobile width | — | List reflows/scrolls without breaking the page layout | Medium | UI |

## API Testing

Endpoint: `GET /student/quiz-attempts`. No error-path simulation exists beyond the naturally-producible empty-array case (QUIZ-007).

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| QUIZ-015 | 200 success returns the quiz-attempt array | Logged in | Covered by QUIZ-001 | — | Array of `QuizAttemptListItem` objects | High | API |

---

**Coverage note:** no Data or Security sections — no
create/update/delete capability exists here, and access control is
centrally tested in `auth/route-guards-test-cases.md`. The `attempted`
color-meaning assumption noted above is the one item in this file worth
periodically re-confirming against design, since it was inferred rather
than explicitly specified.
