# Lock Screen — Test Cases

**Screen:** `/auth/lock` · **Component:** `features/auth/lock-screen/lock-screen.page.ts`
**Guard:** `lockScreenGuard` — reachable whenever a **known session exists** (`AuthService.currentUser()` is set), regardless of whether the app actually considers itself "locked."

**Important context — read before testing:** `CLAUDE.md` §1 documents that Lock Screen **has no real trigger yet** — no dashboard idle-timeout or manual "lock" button calls `AuthService.lock()` anywhere in the current UI. This screen is only reachable today by **typing the URL directly** while logged in. Test cases below reflect that reality; do not report "there's no way to lock the app from the UI" as a new defect — it's a documented, known gap.

**Business rules actually implemented:**
- Shows the current logged-in user's name (`AuthService.currentUser()`).
- Password field only — required, no strength/format check (same as Login).
- Mock API (`POST /auth/unlock`): looks up the current user's email, returns `401 "Incorrect password."` on a wrong password, `404` if the account record has somehow vanished, otherwise `200` and re-authenticates.
- On success: session is refreshed, `locked` is set back to `false`, navigates to `/`.
- Reaching `/auth/lock` does **not**, by itself, set `AuthService.locked` to `true` — only a call to `AuthService.lock()` does, and nothing in the current UI calls it.

---

## Functional / Happy Path

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LOCK-001 | Unlock with the correct password | Logged in, on `/auth/lock` (reached via direct URL) | 1. Enter the current account's password 2. Click **Unlock** (or equivalent submit action) | `Dreams@123` | Redirected to `/`; session remains the same user, now unlocked | High | Functional |
| LOCK-002 | Current user's name is displayed | Logged in, on `/auth/lock` | 1. Observe the screen | — | Shows "Ronald Richard" (or whichever account is logged in) — not a generic placeholder | Medium | Functional |
| LOCK-003 | Unlocking does not change the logged-in user | Logged in as the seeded account | 1. Unlock successfully | Correct password | The user remains the same account post-unlock (no account-switch side effect) | Medium | Functional |

## Negative Testing

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LOCK-004 | Empty password | Logged in, on `/auth/lock` | 1. Leave password blank 2. Submit | `""` | Required-field error; no API call | High | Negative |
| LOCK-005 | Incorrect password | Logged in, on `/auth/lock` | 1. Enter a wrong password 2. Submit | `WrongPass1` | `401` "Incorrect password."; form stays editable | High | Negative |
| LOCK-006 | Lock Screen reached while logged out | Logged out | 1. Manually navigate to `/auth/lock` | — | `lockScreenGuard` redirects to `/auth/login` — the lock screen never renders for an anonymous visitor | High | Negative |
| LOCK-007 | Very long password entered | Logged in | 1. Enter a 300+ character password | long string | Accepted client-side; API returns 401 since it won't match; no UI breakage | Low | Edge |
| LOCK-008 | Password is case-sensitive | Logged in | 1. Enter the correct password with wrong case | `dreams@123` | `401` — exact match required | Medium | Negative |
| LOCK-009 | Password with only spaces | Logged in | 1. Enter a password of only spaces 2. Submit | `"   "` | Passes the `required` check (non-empty), sent to the API, returns 401 | Low | Edge |

## Edge Cases

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LOCK-010 | Double-click Unlock | Logged in, correct password entered | 1. Click Unlock twice quickly | Correct password | Only one request effectively actioned; button disables after the first click | Medium | Edge |
| LOCK-011 | Press Enter to submit | Logged in | 1. Fill password 2. Press Enter | Correct password | Submits identically to clicking the button | Low | Edge |
| LOCK-012 | Retry after a failed unlock attempt | Logged in | 1. Submit a wrong password 2. Correct it and submit again | Wrong then correct | Second attempt succeeds; earlier error clears | Medium | Edge |

## UI Testing

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LOCK-013 | Centered-card layout, not the split-panel auth shell | Logged in, on `/auth/lock` | 1. Observe the page layout | — | Uses its own centered-card layout — distinct from the split-panel shell used by Login/Register/etc. (per `CLAUDE.md` §1) | Low | UI |
| LOCK-014 | Loading indicator while submitting | Logged in | 1. Submit and observe the button during the mock delay | Correct password | Button shows a loading state and disables | Medium | UI |
| LOCK-015 | Error banner shown and dismissed-on-retry | Logged in | 1. Trigger LOCK-005 2. Start retyping the password | — | Error banner shows the message, then clears once the user starts correcting the field | Medium | UI |
| LOCK-016 | Keyboard-only completion | Logged in | 1. Fill and submit using only the keyboard | Correct password | Fully operable via keyboard | Low | UI |

## API Testing

Endpoint: `POST /auth/unlock`. No timeout/network-failure/500/malformed-response simulation exists.

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LOCK-017 | 200 success / 401 wrong password | Logged in | Covered by LOCK-001 / LOCK-005 | Correct / incorrect password | Documented status codes and messages | High | API |

---

**Coverage note:** because there is no in-app trigger for locking, there is no test case here for "the app automatically locks after N minutes of idle time" — that behavior does not exist yet. Revisit this file once `AuthService.lock()` gets a real caller.
