# Register — Test Cases

**Screen:** `/auth/register` · **Component:** `features/auth/register/register.page.ts`
**Guard:** `guestGuard` (already-logged-in users are redirected to `/`)

**Business rules actually implemented:**
- Full Name: required, minimum 2 characters.
- Email: required, must pass Angular's email format validator.
- Password: required, and must score **≥ 2 out of 4** on the shared strength scale (`calculatePasswordStrength`): +1 for length ≥ 8, +1 for having both a lowercase and an uppercase letter, +1 for a digit, +1 for a special character. A password scoring 0 or 1 is rejected with a "weak password" error.
- Confirm Password: required, must exactly match Password; re-validated live as Password changes.
- "I agree to the Terms" checkbox: required to be checked (`Validators.requiredTrue`).
- Mock API (`POST /auth/register`): returns `409 "An account with this email already exists."` if the email is already seeded/registered, otherwise creates the user with role `student` and logs them straight in — **there is no OTP/email-verification step for Register** (`CLAUDE.md` §1 — OTP is wired only to the Forgot Password flow).
- On success: navigates to `/` immediately, already authenticated.
- Newly registered users are added to the in-memory `mockUsers` array for the lifetime of the browser tab/session only — a full app reload (not just a route change) resets to only the original seeded user.

---

## Functional / Happy Path

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| REG-001 | Register with all valid data | Logged out, on `/auth/register` | 1. Fill Full Name, Email, Password, Confirm Password 2. Check "I agree to Terms" 3. Click **Sign Up** | `Jane Doe` / `jane.doe@example.com` / `Str0ng!Pass` / same / checked | Account is created; user is logged in immediately and redirected to `/` | High | Functional |
| REG-002 | New account can immediately log out and log back in | Just registered (REG-001) | 1. Log out 2. Log in again with the same email/password | Same credentials as REG-001 | Login succeeds — the newly created account is a real, reusable session-scoped account | High | Functional |
| REG-003 | Password strength meter reflects a strong password | Logged out | 1. Type a password meeting all 4 strength criteria | `Str0ng!Pass` | Strength meter shows the highest ("strong") segment filled | Medium | Functional |
| REG-004 | Password strength meter updates live as password is edited | Logged out | 1. Type a weak password, observe meter 2. Keep typing to make it strong, observe meter again | `a` → `Str0ng!Pass` | Meter updates on every keystroke, not just on blur/submit | Medium | Functional |

## Negative Testing

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| REG-005 | Empty Full Name | Logged out | 1. Leave Full Name blank 2. Fill the rest validly 3. Submit | name = `""` | Required-field error under Full Name; no API call | High | Negative |
| REG-006 | Full Name shorter than 2 characters | Logged out | 1. Enter a 1-character name 2. Submit | `J` | "minimum length" error under Full Name | Medium | Negative |
| REG-007 | Empty email | Logged out | 1. Leave email blank 2. Submit | email = `""` | Required-field error under Email | High | Negative |
| REG-008 | Invalid email format — missing @ | Logged out | 1. Enter `jane.doeexample.com` 2. Submit | as given | "invalid email" error | High | Negative |
| REG-009 | Invalid email format — missing domain | Logged out | 1. Enter `jane.doe@` 2. Submit | as given | "invalid email" error | High | Negative |
| REG-010 | Email with leading/trailing spaces | Logged out | 1. Enter `" jane.doe@example.com "` 2. Fill the rest validly 3. Submit | as given | Passes Angular's email validator (not trimmed); record actual registration behavior — a mismatch between the typed and stored email is a real UX bug worth flagging if it occurs | Medium | Negative |
| REG-011 | Very long email | Logged out | 1. Enter a syntactically valid 200+ character email | long string | Accepted client-side; no length cap; registration proceeds normally | Low | Edge |
| REG-012 | Unsupported characters in email | Logged out | 1. Enter `jane..doe@@example.com` 2. Submit | as given | "invalid email" error | Low | Negative |
| REG-013 | Empty password | Logged out | 1. Leave Password blank 2. Submit | password = `""` | Required-field error under Password; no strength-meter false positive | High | Negative |
| REG-014 | Weak password (score 0) | Logged out | 1. Enter a short, all-lowercase, no-digit password 2. Submit | `abc` | "weak password" error; API is not called | High | Negative |
| REG-015 | Weak password (score 1) | Logged out | 1. Enter a password satisfying only one strength criterion 2. Submit | `abcdefgh` (length only) | Still rejected as weak (score must be ≥ 2) | High | Negative |
| REG-016 | Borderline password (score exactly 2) is accepted | Logged out | 1. Enter a password meeting exactly 2 criteria (length + digit, no case-mix, no symbol) 2. Submit | `password1` (8+ chars, has a digit — but no uppercase and no symbol, so only 2 of 4 pass) | Accepted — the validator's threshold is `< 2` rejected, so exactly 2 passes | Medium | Edge |
| REG-017 | Very long password | Logged out | 1. Enter a 300+ character strong password | long strong string | Accepted; no crash or truncation in the UI | Low | Edge |
| REG-018 | Password with spaces | Logged out | 1. Enter a password containing spaces that otherwise scores ≥2 | `Pass word1` | Accepted by both the strength validator and confirm-match, since spaces aren't excluded by any rule | Low | Edge |
| REG-019 | Empty Confirm Password | Logged out | 1. Fill Password validly 2. Leave Confirm Password blank 3. Submit | — | Required-field error under Confirm Password | High | Negative |
| REG-020 | Confirm Password does not match Password | Logged out | 1. Enter a valid strong Password 2. Enter a different value in Confirm Password 3. Submit | `Str0ng!Pass` / `Different1!` | "passwords don't match" error under Confirm Password; no API call | High | Negative |
| REG-021 | Confirm Password matches after editing Password | Logged out | 1. Fill both fields to match 2. Edit Password only, breaking the match 3. Observe Confirm Password's validity | — | Confirm Password's error re-triggers live (its validator re-runs on every Password change, per `RegisterPage`'s subscription) without needing to touch the Confirm field again | Medium | Edge |
| REG-022 | Terms checkbox not checked | Logged out | 1. Fill all fields validly 2. Leave "I agree to Terms" unchecked 3. Submit | — | Form is blocked from submitting; no API call | High | Negative |
| REG-023 | Duplicate email — account already exists | Logged out | 1. Register with an email that's already seeded/registered (e.g. the demo account) 2. Submit | `ronald.richard@example.com` + any valid password/name | `409` from the API; inline error reads "An account with this email already exists." | High | Negative |
| REG-024 | Duplicate email is case-insensitive on the server side | Logged out | 1. Register with a different-cased version of an existing email | `RONALD.RICHARD@EXAMPLE.COM` | Still rejected as a duplicate — `findUserByEmail` lowercases before comparing | Medium | Negative |
| REG-025 | Register while already authenticated (guest guard) | Already logged in | 1. Manually navigate to `/auth/register` | — | Redirected away to `/`; the register form never renders | High | Negative |

## Edge Cases

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| REG-026 | Double-click Sign Up | Logged out, valid data entered | 1. Click **Sign Up** twice quickly | Valid data | Only one account is created / one request sent — button disables via `submitting` after the first click | High | Edge |
| REG-027 | Press Enter to submit | Logged out | 1. Fill the form 2. Press Enter | Valid data | Submits the same as clicking Sign Up | Medium | Edge |
| REG-028 | Retry after a 409 duplicate-email error | Logged out | 1. Trigger REG-023 2. Change the email to a unique one 3. Submit again | New unique email | Second submission succeeds and clears the earlier error banner | High | Edge |
| REG-029 | Refresh mid-request | Logged out, valid data entered | 1. Click Sign Up 2. Refresh before the response resolves | Valid data | No crash; the account may or may not have been created server-side depending on timing — reload lands on a normal logged-out `/auth/register` | Low | Edge |
| REG-030 | Full Name with only spaces | Logged out | 1. Enter `"  "` as the full name (passes length ≥2 but is meaningless) 2. Submit | `"  "` | Currently **accepted** — `minLength(2)` counts whitespace characters; note this as a potential validation gap, not a defect to silently patch during testing | Low | Edge |

## UI Testing

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| REG-031 | Sign Up button shows loading state while submitting | Logged out, valid data entered | 1. Submit and observe the button during the ~600 ms mock delay | Valid data | Button shows a loading indicator and is disabled; re-enables on error | Medium | UI |
| REG-032 | Password visibility toggle (both Password and Confirm Password) | Logged out | 1. Type into both fields 2. Toggle each field's show/hide icon independently | Any password | Each field's visibility toggles independently of the other | Medium | UI |
| REG-033 | Field-level red border + inline message on touched invalid fields | Logged out | 1. Tab through each field without filling it in | — | Each field shows the shared `FormField` red-border + message pattern once touched | Medium | UI |
| REG-034 | Keyboard-only completion | Logged out | 1. Complete the entire form and submit using only the keyboard | Valid data | All fields, the checkbox, and the submit button are reachable and operable via keyboard | Medium | UI |
| REG-035 | Navigation link back to Login | Logged out | 1. Click the "Login" / "Already have an account?" link | — | Navigates to `/auth/login` | Low | UI |

## API Testing

Endpoint: `POST /auth/register`. No timeout/network-failure/500/malformed-response simulation exists for this endpoint in the mock API.

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| REG-036 | 200/201-equivalent success response | Logged out | 1. Register with unique valid data | Valid data | Response is `{ user, token }`; user role defaults to `student`; `avatarUrl` is `null` for a self-registered account | High | API |
| REG-037 | 409 duplicate account | Logged out | Covered by REG-023 | Existing email | `AppError` status 409 with the documented message | High | API |
| REG-038 | 500 / timeout / network-unavailable / malformed response | — | Not simulated by the current mock API | — | **Not currently producible** — gap noted for when fault-injection or a real backend exists | Medium | API |

---

**Coverage note:** there is intentionally no separate "email verification" or "OTP" test section for Register — per `CLAUDE.md` §1, Register does not require OTP verification. Do not treat its absence as a missing test case.
