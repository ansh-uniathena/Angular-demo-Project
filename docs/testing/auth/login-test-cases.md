# Login — Test Cases

**Screen:** `/auth/login` · **Component:** `features/auth/login/login.page.ts`
**Guard:** `guestGuard` (an already-logged-in, unlocked user is redirected to `/`)

**Business rules actually implemented:**
- Email: required, must pass Angular's built-in email format validator.
- Password: required only — **no minimum length, complexity, or format check on login** (unlike Register/Set Password, which do enforce password strength). A password of any non-empty value is accepted by client-side validation; only the mock API decides right/wrong.
- Mock credentials (seeded): `ronald.richard@example.com` / `Dreams@123`.
- Mock API (`POST /auth/login`): returns `404 "No account found for this email."` if the email doesn't match a seeded user (case-insensitive match), `401 "Incorrect password."` if the password doesn't match, otherwise `200` with a session.
- "Remember Me" defaults to checked; unchecking it means the session is not written to `localStorage`, so it does not survive a full page reload.
- On success: navigates to `/`. On failure: shows the error inline, form stays filled, submit re-enables.
- There is no lockout / rate limit / attempt counter anywhere in the mock API.

---

## Functional / Happy Path

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LOGIN-001 | Login with valid email and password | Logged out, on `/auth/login` | 1. Enter email 2. Enter password 3. Click **Login** | `ronald.richard@example.com` / `Dreams@123` | Redirected to `/` (Home); header shows "Ronald Richard" and a **Log out** button | High | Functional |
| LOGIN-002 | Login with "Remember Me" checked, then reload | Logged out | 1. Login with valid credentials, "Remember Me" left checked 2. Refresh the browser (F5) | Valid credentials | Still logged in after reload — session persisted | High | Functional |
| LOGIN-003 | Login with "Remember Me" unchecked, then reload | Logged out | 1. Uncheck "Remember Me" 2. Login with valid credentials 3. Refresh the browser | Valid credentials | Session does not survive the reload — user is logged out again on `/` | Medium | Functional |
| LOGIN-004 | Email match is case-insensitive | Logged out | 1. Enter email in a different case than seeded 2. Enter correct password 3. Submit | `Ronald.Richard@Example.com` / `Dreams@123` | Login succeeds | Medium | Functional |
| LOGIN-005 | Successful login redirects to Home, not back to login | Logged out | 1. Login successfully | Valid credentials | Browser URL is `/`, not `/auth/login` | High | Functional |

## Negative Testing

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LOGIN-006 | Empty email | Logged out | 1. Leave email blank 2. Enter any password 3. Click **Login** | email = `""` | "Login" is blocked client-side; a required-field error shows under Email; no API call is made | High | Negative |
| LOGIN-007 | Invalid email format — missing @ | Logged out | 1. Enter email without `@` 2. Submit | `ronald.richardexample.com` | Inline "invalid email" error; no API call | High | Negative |
| LOGIN-008 | Invalid email format — missing domain | Logged out | 1. Enter `ronald.richard@` 2. Submit | `ronald.richard@` | Inline "invalid email" error | High | Negative |
| LOGIN-009 | Invalid email format — spaces inside the address | Logged out | 1. Enter an email with an embedded space 2. Submit | `ronald richard@example.com` | Inline "invalid email" error | Medium | Negative |
| LOGIN-010 | Email with leading/trailing spaces | Logged out | 1. Enter valid email with a leading/trailing space 2. Enter valid password 3. Submit | `" ronald.richard@example.com "` / `Dreams@123` | Angular's email validator accepts this (spaces are not trimmed); the mock API's `findUserByEmail` does an exact string match after only a case-fold, so this will surface as a 404 "No account found for this email." unless the input control trims it — record actual behavior and treat mismatch as a real bug, since a user retyping their own email shouldn't be silently rejected | Medium | Negative |
| LOGIN-011 | Very long email address | Logged out | 1. Enter a syntactically valid but very long (200+ char) local-part email 2. Submit | `"<190 chars>@example.com"` | Passes format validation (Angular's validator has no length cap); mock API returns 404 since no such user exists — form shows the "No account found" error cleanly, no crash/overflow in the UI | Low | Edge |
| LOGIN-012 | Unsupported/special characters in email | Logged out | 1. Enter an email with disallowed characters 2. Submit | `ronald..richard@@example.com` | Inline "invalid email" error | Low | Negative |
| LOGIN-013 | Empty password | Logged out | 1. Enter valid email 2. Leave password blank 3. Submit | password = `""` | Required-field error under Password; no API call | High | Negative |
| LOGIN-014 | Incorrect password for an existing account | Logged out | 1. Enter valid email 2. Enter a wrong password 3. Submit | `ronald.richard@example.com` / `WrongPass1` | `401` from the API; inline error banner reads "Incorrect password."; password field is cleared or left as-is but form remains editable, not stuck in a loading state | High | Negative |
| LOGIN-015 | Very short password | Logged out | 1. Enter valid email 2. Enter a 1-character password 3. Submit | `ronald.richard@example.com` / `a` | No client-side length rule exists for Login — request is sent; API returns 401 since it doesn't match the real password | Medium | Negative |
| LOGIN-016 | Very long password | Logged out | 1. Enter valid email 2. Enter a 300+ character password 3. Submit | 300-char string | Accepted client-side (no max-length rule); API returns 401; no UI breakage from the long string | Low | Edge |
| LOGIN-017 | Password with only spaces | Logged out | 1. Enter valid email 2. Enter a password of only spaces 3. Submit | `"   "` | Angular's `required` validator treats a non-empty string of spaces as present (not empty) — request is sent; API returns 401 | Low | Edge |
| LOGIN-018 | Password is case-sensitive | Logged out | 1. Enter valid email 2. Enter the correct password with different case | `ronald.richard@example.com` / `dreams@123` | Login fails with 401 — password comparison is exact-match, not case-insensitive | High | Negative |
| LOGIN-019 | Account does not exist | Logged out | 1. Enter an email not in the seeded user list 2. Enter any password 3. Submit | `nobody@nowhere.com` / `anything` | `404` from the API; inline error reads "No account found for this email." | High | Negative |
| LOGIN-020 | Login attempted while already authenticated (guest guard) | Already logged in | 1. Manually navigate to `/auth/login` | — | Redirected away to `/` immediately — the login form never renders | High | Negative |

## Edge Cases

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LOGIN-021 | Double-click the Login button | Logged out, valid credentials entered | 1. Click **Login** twice in rapid succession | Valid credentials | Only one login request is effectively actioned — the button/form disables (`submitting` signal) after the first click so the second click is a no-op; user is not double-navigated or shown two error banners | High | Edge |
| LOGIN-022 | Press Enter to submit | Logged out | 1. Fill both fields 2. Press **Enter** instead of clicking the button | Valid credentials | Form submits the same as clicking Login | Medium | Edge |
| LOGIN-023 | Refresh the page mid-request | Logged out, valid credentials entered | 1. Click Login 2. Immediately refresh the browser before the ~600 ms mock delay resolves | Valid credentials | No crash; on reload the user lands back on a fresh, logged-out `/auth/login` (the in-flight request is abandoned by the navigation) | Low | Edge |
| LOGIN-024 | Resubmit after a failed attempt | Logged out | 1. Submit with wrong password (see LOGIN-014) 2. Correct the password 3. Submit again | Wrong then correct password | Second submission succeeds and the earlier error banner is cleared | High | Edge |
| LOGIN-025 | Toggle "Remember Me" off then back on before submitting | Logged out | 1. Uncheck "Remember Me" 2. Check it again 3. Login | Valid credentials | Behaves as a normal remembered login (final checkbox state is what's sent) | Low | Edge |
| LOGIN-026 | Whitespace-only email | Logged out | 1. Enter only spaces in the email field 2. Submit | `"    "` | Fails Angular's `email` format validator (not a valid email shape) — blocked client-side | Low | Edge |

## UI Testing

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LOGIN-027 | Login button reflects invalid/submitting/idle state | Logged out | 1. Leave form empty and observe the button 2. Fill it in and observe again 3. Submit and observe while loading | — | Button is not required to be disabled while the form is invalid (it validates on click), but must show a loading indicator and disable itself while `submitting` is true, then re-enable on failure | Medium | UI |
| LOGIN-028 | Field-level error message and red border on invalid touched field | Logged out | 1. Click into Email, then click out without typing (blur) | — | Email field shows a red border and an inline required-field message once touched, per the shared `FormField` convention | Medium | UI |
| LOGIN-029 | Password visibility toggle | Logged out | 1. Type a password 2. Click the show/hide icon | Any password | Password becomes visible as plain text, then masked again on a second click | Medium | UI |
| LOGIN-030 | Error banner is dismissed on retry | Logged out | 1. Trigger the 401 error (LOGIN-014) 2. Start editing the email or password field again | — | The error banner clears once the user starts correcting the form (per `CLAUDE.md`'s dismissed-on-retry banner convention), rather than staying stuck on screen | Medium | UI |
| LOGIN-031 | Keyboard-only navigation | Logged out | 1. Using only Tab/Shift+Tab/Enter/Space, reach and fill Email, Password, "Remember Me", and submit | Valid credentials | Every control is reachable and operable via keyboard alone; focus order is logical (Email → Password → Remember Me → Login) | Medium | UI |
| LOGIN-032 | Navigation links to Register / Forgot Password | Logged out | 1. Click "Sign up" / "Forgot Password?" links | — | Navigates to `/auth/register` and `/auth/forgot-password` respectively | Low | UI |

## API Testing

Endpoint: `POST /auth/login`. The mock client (`MockApiClient`) adds a fixed ~600 ms delay to every response and has **no built-in simulation for timeout, network-unavailable, 500, or malformed-response scenarios** for this endpoint — the rows below marked "Not simulated" describe what *should* be verified once a real backend (or a fault-injection mode) exists, and cannot currently be produced by normal UI interaction alone.

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LOGIN-033 | 200 success response | Logged out | 1. Login with valid credentials | Valid credentials | Response contains `{ user, token }`; session is stored | High | API |
| LOGIN-034 | 401 incorrect password | Logged out | 1. Login with a wrong password | Valid email, wrong password | `AppError` with status 401, message "Incorrect password." surfaced via `toUserMessage` | High | API |
| LOGIN-035 | 404 unknown account | Logged out | 1. Login with an unregistered email | Unregistered email | `AppError` with status 404, message "No account found for this email." | High | API |
| LOGIN-036 | 500 / timeout / network-unavailable / malformed response | — | Not simulated by the current mock API for this endpoint | — | **Not currently producible** — flagged as a gap; the UI's generic error-interceptor path should be exercised once a fault-injection mode or real backend exists | Medium | API |
| LOGIN-037 | Duplicate in-flight request is not sent twice | Logged out | Covered functionally by LOGIN-021 (double-click) | Valid credentials | Only one HTTP call is observed in the network panel for a double-click | Medium | API |

## Security

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LOGIN-038 | Password is not exposed in the DOM/URL | Logged out | 1. Submit login 2. Inspect the network request and the URL bar | Valid credentials | Password travels in the POST body only, never as a query parameter or in the URL; not logged to the console | High | Security |
| LOGIN-039 | No account-existence oracle beyond the documented 404/401 split | Logged out | 1. Try a wrong password for a real account (LOGIN-014) 2. Try any password for a fake account (LOGIN-019) | Both | This app *does* distinguish "no such account" (404) from "wrong password" (401) — record this as a known, accepted trade-off (this is a demo app, not a hardened login), not something to silently "fix" without a product decision | Low | Security |

---

**Coverage note:** rate-limiting / account-lockout after repeated failed attempts, CAPTCHA, and MFA are **not implemented** in this app and therefore have no test cases here — do not report their absence as a defect without confirming it's actually in scope for this project.
