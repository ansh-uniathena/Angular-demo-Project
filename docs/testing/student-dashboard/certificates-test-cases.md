# Certificates — Test Cases

**Screen:** `/student/certificates` · **Component:** `features/student-dashboard/certificates/certificates.page.ts`
**Facade:** `CertificatesStore` · **Endpoint:** `GET /student/certificates`
**Guards:** `authGuard` + `roleGuard('student')` (see `auth/route-guards-test-cases.md`).

**This is a simple, read-only table screen** — no forms, no create/update/delete, no filters or pagination. Test scope is intentionally narrow.

**What's real vs. decorative:**

| Element | Behavior |
| --- | --- |
| Certificates table (course name, date, marks/outOf) | **Real** — sourced from the mock endpoint. |
| View/download icons in the table | **Decorative** — no real certificate file exists to view or download (`CLAUDE.md` §24 known gap). |

---

## Functional / Happy Path

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CERT-001 | Certificates table loads with data | Logged in, mock data has certificates | 1. Navigate to `/student/certificates` | — | Table renders each certificate's course name, date, and marks/outOf | High | Functional |
| CERT-002 | Marks/outOf display correctly | Logged in | 1. Compare a row's displayed marks against the mock data | — | Values match exactly (e.g. "42 / 50") | Medium | Functional |
| CERT-003 | Multiple certificates render as multiple distinct rows | Logged in, mock data has more than one certificate | 1. Count the rows | — | One row per certificate, no merging/duplication | Medium | Functional |
| CERT-004 | Date label displays as provided by the mock data | Logged in | 1. Observe a row's date column | — | Shows the pre-formatted `dateLabel` string as-is (this model stores a display-ready label, not a raw date needing client-side formatting) | Low | Functional |

## Negative Testing

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CERT-005 | View/download icon clicked | Logged in, on the page | 1. Click a view or download icon in any row | — | Nothing meaningful happens (no file opens/downloads) — documented no-op, not a defect | Low | Negative |

## Edge Cases

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CERT-006 | No certificates earned yet | Contrived — empty `mockCertificates` array | 1. Load the page | — | Shows the documented empty state: "No certificates earned yet." via `ErrorState` with `[retryable]="false"` — not a raw empty table or a "retry" button that makes no sense here | High | Edge |
| CERT-007 | Certificate with marks of 0 | Contrived — a certificate scored 0/outOf | 1. Observe that row | 0 / N | Displays "0 / N" correctly, not blank or "undefined" | Low | Edge |
| CERT-008 | Certificate with marks equal to outOf (perfect score) | Contrived | 1. Observe that row | N / N | Displays correctly, e.g. "50 / 50" | Low | Edge |
| CERT-009 | Very long course name in a row | Contrived — a certificate for a course with an unusually long title | 1. Observe the row | Long title | Table cell truncates/wraps gracefully, doesn't break the table layout | Low | Edge |

## UI Testing

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CERT-010 | Loading state while certificates load | Logged in | 1. Navigate to the page and observe immediately | — | Spinner shown during the mock delay | Medium | UI |
| CERT-011 | Error state has a working Retry action | Contrived — would need the endpoint to fail (not currently simulated) | 1. Trigger an error 2. Click Retry | — | **Not currently producible** since `GET /student/certificates` never fails in the mock API — the `ErrorState`'s `(retry)="store.load()"` wiring exists in code but cannot be exercised through normal UI interaction today | Low | UI |
| CERT-012 | Table is keyboard-navigable | Logged in | 1. Tab through the table's interactive elements (view/download icons) | — | Icons are reachable via keyboard, with accessible names even though they're currently no-ops | Low | UI |
| CERT-013 | Responsive behavior of the table on narrow viewports | Logged in | 1. Resize to mobile width | — | Table scrolls horizontally within its own container rather than breaking the page layout (per the project's "wide content scrolls in its own container" convention) | Medium | UI |

## API Testing

Endpoint: `GET /student/certificates`. No error-path simulation exists.

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CERT-014 | 200 success returns the certificate array | Logged in | Covered by CERT-001 | — | Array of `Certificate` objects | High | API |
| CERT-015 | 401/403/404/500/timeout/network-unavailable/malformed/empty response | — | Not simulated by the current mock API (an **empty array** response — CERT-006 — is the one "empty" scenario that *is* naturally producible, by definition of the mock data; the others are not) | — | Empty-array case is covered by CERT-006; the rest remain a coverage gap | Medium | API |

---

**Coverage note:** no Data or Security sections — this screen has no
create/update/delete capability and no access-control logic beyond the
centrally-tested route guards.
