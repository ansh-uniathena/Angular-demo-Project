# Testing Documentation — Dreams LMS

This folder is the project's manual test-case library. It exists so that any
QA engineer — including one who has never opened the Angular source — can
pick up a feature and know exactly what to click, type, and check, without
reading code.

This is **manual test documentation**, not automated test code. It
complements (and currently substantially exceeds) the project's automated
test suite — see `CLAUDE.md` §14/§25 and `docs/CLAUDE_CODE_DEMO_EVALUATION.md`
§10 for the current state of automation. Writing a test case here does not
require or imply an automated test exists for it.

---

## Purpose

- Give QA a single, predictable place to find test cases for any feature.
- Force developers (human or Claude) to think through happy-path, negative,
  edge-case, UI, API, data, security, and performance scenarios **before**
  a feature is called "done" — not as an afterthought.
- Create a durable record of *intended* behavior, including deliberate
  no-ops and known gaps (e.g. "favoriting a course does not persist" is a
  documented product decision, not a bug QA should keep re-reporting).
- Make it possible to regression-test a feature manually even though the
  project currently has almost no automated coverage.

## Folder structure

```text
docs/testing/
├── README.md                                    ← this file
├── auth/
│   ├── login-test-cases.md
│   ├── register-test-cases.md
│   ├── password-reset-test-cases.md              (Forgot Password → OTP → Set Password)
│   ├── lock-screen-test-cases.md
│   └── route-guards-test-cases.md                (authGuard, roleGuard, guestGuard, /unauthorized)
├── home/
│   └── home-test-cases.md
├── courses/
│   ├── course-catalog-test-cases.md              (Course Grid/List + filters/search/sort)
│   └── course-detail-test-cases.md               (Course Detail + comment form)
└── student-dashboard/
    ├── dashboard-home-test-cases.md
    ├── profile-test-cases.md
    ├── enrolled-courses-test-cases.md
    ├── certificates-test-cases.md
    └── quiz-attempts-test-cases.md
```

One file per **screen or closely-related flow**, not per component. Small
presentational components (buttons, cards, icons, the catalog toolbar,
pagination, etc.) do not get their own test document — their behavior is
exercised and documented inside whichever screen actually uses them. A
component only earns its own file once it carries meaningful, independent
business logic (none currently do).

## Test case format

Every test case is a row in a table with these fields:

| Field | Description |
| --- | --- |
| **Test ID** | Unique ID, e.g. `LOGIN-004`. See "Test Case IDs" below. |
| **Test Scenario** | One line: what is being tested. |
| **Preconditions** | What must already be true (logged out, on a specific page, specific mock data present, etc.). |
| **Test Steps** | Numbered, concrete steps a QA engineer can literally follow. |
| **Test Data** | The exact input values to use, if any. |
| **Expected Result** | What should happen — specific enough to mark pass/fail without guessing. |
| **Priority** | High / Medium / Low — see below. |
| **Type** | Functional / Negative / Edge / API / UI / Security. |

Test cases are grouped under category headings within each file (Functional,
Negative, Edge Cases, UI, API, Data, Security, Performance) — a file only
has the categories that are actually relevant to that feature. A read-only
list screen with no form, for example, won't have a "Security" section
beyond auth-guard coverage, and won't invent one for the sake of symmetry.

## Priority definitions

- **High** — Critical functionality or a primary business flow. If this
  breaks, the feature is unusable or unsafe (login, registration, course
  search returning results, profile save, route guards).
- **Medium** — Important functionality that isn't on the critical path. If
  this breaks, the feature is degraded but still usable (sort order, resend
  OTP cooldown, pagination edge counts, comment form validation messages).
- **Low** — Minor UI detail or an uncommon scenario (icon rendering,
  decorative hover states, a rarely-hit edge case like a 0-character search
  after clearing filters).

## Test categories

- **Functional / Happy Path** — the feature working correctly with valid input.
- **Negative** — invalid input, wrong credentials, disallowed actions.
- **Edge Cases** — unusual but real conditions (double-click submit, empty
  results, boundary values, rapid repeated actions).
- **UI** — layout, buttons, labels, validation messages, loading/empty/error
  states, responsive behavior, keyboard interaction.
- **API** — the feature's actual mock endpoint(s): success, error status
  codes, empty/malformed responses, timeouts. Every API test case names the
  real endpoint and, where relevant, notes whether that failure mode is
  **currently simulated by the mock API** or not (most are not — see each
  file's notes) so QA doesn't waste time chasing an untestable case.
- **Data** — where the feature reads/writes the in-memory mock dataset:
  create/read/update, duplicates, missing/null values, consistency across
  navigation. There is no real database and no delete endpoint anywhere in
  this app — see each file for what's actually applicable.
- **Security** — unauthorized access, session/token handling, guard
  behavior, sensitive data exposure. Concentrated in `auth/route-guards-test-cases.md`
  and repeated per-feature only where a feature has its own access rule.
- **Performance** — large datasets, pagination, slow/repeated requests.
  Noted where relevant; this is a demo app with small mock datasets, so most
  performance cases here describe what *should* be verified once real data
  volumes exist, not defects in the current build.

## Test Case IDs

Each file uses one short prefix, numbered sequentially from `001`:

| Prefix | File |
| --- | --- |
| `LOGIN-###` | auth/login-test-cases.md |
| `REG-###` | auth/register-test-cases.md |
| `PWRESET-###` | auth/password-reset-test-cases.md |
| `LOCK-###` | auth/lock-screen-test-cases.md |
| `GUARD-###` | auth/route-guards-test-cases.md |
| `HOME-###` | home/home-test-cases.md |
| `CATALOG-###` | courses/course-catalog-test-cases.md |
| `COURSE-###` | courses/course-detail-test-cases.md |
| `DASH-###` | student-dashboard/dashboard-home-test-cases.md |
| `PROFILE-###` | student-dashboard/profile-test-cases.md |
| `ENROLL-###` | student-dashboard/enrolled-courses-test-cases.md |
| `CERT-###` | student-dashboard/certificates-test-cases.md |
| `QUIZ-###` | student-dashboard/quiz-attempts-test-cases.md |

IDs are never reused or renumbered, even if a case is later removed — leave
a gap rather than shift every ID below it.

## How developers should create/update test documentation

Per `CLAUDE.md`'s Feature Testing Documentation rule (see the section added
alongside this folder):

1. Before marking any feature complete, walk through §3 of the main
   instructions (functional, negative, edge, UI, API, data, security,
   performance) and write down what applies.
2. Add cases to the existing file for that screen, or create a new file
   following the folder/prefix convention above if it's a genuinely new
   screen.
3. Keep scenarios **specific to that feature** — do not copy-paste another
   feature's cases and rename them. A read-only table screen does not need
   password-validation cases; a form screen does.
4. When a feature's behavior changes (a new field, a changed validation
   rule, a new API endpoint), update the affected test cases in the same
   change — stale test documentation is worse than none, because QA will
   trust it.
5. Note explicitly, in the API section, when a failure mode described by
   the checklist (500, timeout, network failure, etc.) is **not actually
   producible** because the mock API doesn't simulate it yet — don't write
   a test case QA can never make pass or fail.

## How QA should use these documents

1. Open the file for the feature you're testing.
2. Work through each table top to bottom — Functional first, then Negative,
   Edge Cases, UI, API, Data, Security, Performance (only the sections
   present in that file).
3. For each row, follow **Test Steps** exactly using **Test Data**, and
   compare the real result against **Expected Result**.
4. Log a defect referencing the **Test ID** (e.g. "Fails LOGIN-014") so it's
   traceable back to this document.
5. If a scenario in a file no longer matches what the app actually does,
   flag it to a developer rather than silently reinterpreting it — the
   document should be corrected, not worked around.

---

## Coverage summary (as of 2026-08-30)

See §12 of the request that produced this folder for methodology. Counts are
exact per-file case counts at the time this table was written; they will
drift as files are updated and should be refreshed periodically rather than
trusted indefinitely.

| Feature | File | Test Cases | Functional | Negative | Edge | UI | API | Data | Security |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Login | auth/login-test-cases.md | 39 | 5 | 12 | 9 | 6 | 5 | 0 | 2 |
| Register | auth/register-test-cases.md | 38 | 4 | 16 | 10 | 5 | 3 | 0 | 0 |
| Password Reset (Forgot/OTP/Set) | auth/password-reset-test-cases.md | 39 | 6 | 15 | 8 | 5 | 4 | 0 | 1 |
| Lock Screen | auth/lock-screen-test-cases.md | 17 | 3 | 4 | 5 | 4 | 1 | 0 | 0 |
| Route Guards & Unauthorized | auth/route-guards-test-cases.md | 22 | 6 | 0 | 3 | 0 | 0 | 0 | 13 |
| Home | home/home-test-cases.md | 24 | 8 | 3 | 5 | 6 | 2 | 0 | 0 |
| Course Catalog | courses/course-catalog-test-cases.md | 43 | 18 | 5 | 10 | 5 | 3 | 2 | 0 |
| Course Detail | courses/course-detail-test-cases.md | 34 | 5 | 10 | 6 | 6 | 5 | 1 | 1 |
| Dashboard Home | student-dashboard/dashboard-home-test-cases.md | 19 | 6 | 2 | 6 | 3 | 2 | 0 | 0 |
| Profile | student-dashboard/profile-test-cases.md | 28 | 6 | 6 | 7 | 4 | 3 | 2 | 0 |
| Enrolled Courses | student-dashboard/enrolled-courses-test-cases.md | 21 | 6 | 2 | 3 | 5 | 3 | 2 | 0 |
| Certificates | student-dashboard/certificates-test-cases.md | 15 | 4 | 1 | 4 | 4 | 2 | 0 | 0 |
| Quiz Attempts | student-dashboard/quiz-attempts-test-cases.md | 15 | 5 | 1 | 5 | 3 | 1 | 0 | 0 |
| **Total** | | **354** | **82** | **77** | **81** | **56** | **34** | **7** | **17** |

*(Counts are exact, produced by parsing each file's `Type` column — not
estimated. Route Guards' Functional=6 covers guard-allow scenarios, which
this file classifies under Functional rather than Security since they test
"access granted correctly," not an attack surface; its 13 Security rows are
the redirect/deny scenarios.)*

**Every implemented, non-trivial screen has a testing document.** The two
unbuilt feature areas (`instructors`, `instructor-dashboard`) have no test
documentation because they contain zero implementation — see
`CLAUDE.md` §1 and `docs/CLAUDE_CODE_DEMO_EVALUATION.md` §2 for their status.
Shared presentational components (buttons, cards, pagination, the catalog
toolbar, icons) are intentionally not separately documented per this
README's folder-structure rule — their behavior is covered inside the
screens that use them.
