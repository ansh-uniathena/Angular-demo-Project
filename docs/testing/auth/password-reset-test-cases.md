# Password Reset (Forgot Password → OTP → Set Password) — Test Cases

**Screens:** `/auth/forgot-password` → `/auth/otp` → `/auth/set-password`
**Components:** `features/auth/forgot-password/`, `features/auth/otp/`, `features/auth/set-password/`
**Guards:** `guestGuard` on all three; `passwordResetFlowGuard` additionally on OTP and Set Password.

**Business rules actually implemented:**
- **Forgot Password**: email required + valid format. Mock API (`POST /auth/forgot-password`) returns `404 "No account found for this email."` for an unknown email, otherwise `200` with a masked email (e.g. `***ard@example.com`) and sets `AuthService.pendingEmail`. On success, navigates to `/auth/otp`.
- **`passwordResetFlowGuard`**: OTP and Set Password are only reachable when `AuthService.pendingEmail()` is set (i.e. only by completing Forgot Password first in the same session) — direct/typed navigation to either URL redirects to `/auth/forgot-password`.
- **OTP**: 4-digit numeric code, required, pattern `^\d{4}$`. The fixed demo OTP is **`1234`** for every account (`DEMO_OTP`) — there is no per-account OTP. Mock API (`POST /auth/otp/verify`) returns `400 "Invalid or expired OTP."` for any other value. A resend countdown starts at **09:59** (599 seconds) and the **Resend** action is disabled until it reaches `00:00`; resending (`POST /auth/otp/resend`) resets the timer back to 09:59 and re-masks the email (404 if the account somehow no longer exists). On successful verify, navigates to `/auth/set-password`.
- **Set Password**: same password-strength rule as Register (score ≥ 2/4) plus a matching Confirm Password. Mock API (`POST /auth/set-password`) requires the reset session to still be valid — returns `401 "Reset session expired — please start again."` if OTP wasn't verified or the token doesn't match, `404` if the account vanished. On success, the in-memory password is updated, the pending-reset state is cleared, and the user is navigated to `/auth/login` (**not** auto-logged-in — must log in with the new password).
- Completing or abandoning the flow (e.g. logging in successfully elsewhere) clears `pendingEmail`; a stale/refreshed OTP or Set Password tab loses access per the guard above.

---

## Functional / Happy Path

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PWRESET-001 | Full flow: forgot password → OTP → set new password → login | Logged out, seeded account exists | 1. On Forgot Password, enter the seeded email 2. Submit 3. On OTP, enter `1234` 4. Submit 5. On Set Password, enter a new strong password + confirm 6. Submit 7. Log in with the new password | `ronald.richard@example.com`, OTP `1234`, new password `NewStr0ng!` | Each step navigates to the next screen; final login with the new password succeeds | High | Functional |
| PWRESET-002 | Masked email is shown on the OTP screen | Mid-flow, just past Forgot Password | 1. Observe the OTP screen | — | Shows a masked version of the entered email (e.g. `***ard@example.com`), not the full address | Medium | Functional |
| PWRESET-003 | Old password stops working after reset | Just completed PWRESET-001 | 1. Try logging in with the *old* password | Old password | Login fails with 401 — the mock user record's password was actually overwritten | High | Functional |
| PWRESET-004 | Resend OTP after the cooldown expires | On OTP screen, timer has reached 00:00 (or test with a shortened wait) | 1. Wait for the countdown to hit `00:00` 2. Click **Resend** | — | Resend succeeds; timer resets to `09:59`; masked email re-displayed | Medium | Functional |
| PWRESET-005 | Verified OTP can still complete Set Password after navigating back and forward | Mid-flow | 1. Verify OTP successfully 2. Navigate back to `/auth/otp` via browser back button 3. Navigate forward again to Set Password | — | `pendingEmail` is still set (not cleared by back/forward), so Set Password remains reachable and completes normally | Low | Functional |
| PWRESET-006 | Set Password strength meter behaves identically to Register's | Mid-flow, on Set Password | 1. Type passwords of increasing strength | Weak → strong | Meter fills progressively, same 4-segment logic as Register | Medium | Functional |

## Negative Testing

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PWRESET-007 | Forgot Password — empty email | Logged out | 1. Leave email blank 2. Submit | `""` | Required-field error; no API call | High | Negative |
| PWRESET-008 | Forgot Password — invalid email format | Logged out | 1. Enter `not-an-email` 2. Submit | as given | "invalid email" error | High | Negative |
| PWRESET-009 | Forgot Password — unknown account | Logged out | 1. Enter an email that isn't seeded/registered 2. Submit | `nobody@nowhere.com` | `404` "No account found for this email." shown inline | High | Negative |
| PWRESET-010 | OTP — empty code | Mid-flow | 1. Leave the 4-digit input empty 2. Submit | `""` | Required-field error; no API call | High | Negative |
| PWRESET-011 | OTP — wrong code (not `1234`) | Mid-flow | 1. Enter any 4-digit code other than `1234` 2. Submit | `0000` | `400` "Invalid or expired OTP." shown inline | High | Negative |
| PWRESET-012 | OTP — fewer than 4 digits | Mid-flow | 1. Enter `12` 2. Attempt to submit | `12` | Blocked client-side by the `^\d{4}$` pattern validator; no API call | Medium | Negative |
| PWRESET-013 | OTP — non-numeric input | Mid-flow | 1. Attempt to type letters into the OTP segments | `abcd` | Rejected by the segmented OTP input / pattern validator — non-digit characters are not accepted into the field | Medium | Negative |
| PWRESET-014 | OTP — Resend clicked before cooldown expires | Mid-flow, timer not yet at 00:00 | 1. Click **Resend** while the timer still shows time remaining | — | `canResend` is false — the click is a no-op (`resend()` returns early); no API call, no error shown | Medium | Negative |
| PWRESET-015 | Set Password — empty password | Mid-flow, OTP verified | 1. Leave Password blank 2. Submit | `""` | Required-field error | High | Negative |
| PWRESET-016 | Set Password — weak password | Mid-flow | 1. Enter a password scoring < 2 | `abc` | "weak password" error; no API call | High | Negative |
| PWRESET-017 | Set Password — Confirm Password mismatch | Mid-flow | 1. Enter a valid strong password 2. Enter a different Confirm Password 3. Submit | `NewStr0ng!` / `Different1!` | "passwords don't match" error; no API call | High | Negative |
| PWRESET-018 | Set Password — attempted without ever verifying OTP | Logged out, no reset flow started this session | 1. Manually navigate directly to `/auth/set-password` | — | `passwordResetFlowGuard` redirects to `/auth/forgot-password` — the Set Password form is never shown | High | Negative |
| PWRESET-019 | OTP screen reached without starting Forgot Password | Logged out, no reset flow started | 1. Manually navigate directly to `/auth/otp` | — | `passwordResetFlowGuard` redirects to `/auth/forgot-password` | High | Negative |
| PWRESET-020 | Set Password submitted with a stale/mismatched reset token | Mid-flow, contrived (e.g. reset flow started twice in parallel tabs and an older token reused) | 1. Attempt to set the password using a reset session whose token no longer matches the server's current pending state | — | `401` "Reset session expired — please start again." | Medium | Negative |
| PWRESET-021 | Any of the three screens accessed while already logged in | Logged in, unlocked | 1. Navigate to `/auth/forgot-password`, `/auth/otp`, or `/auth/set-password` | — | `guestGuard` redirects to `/` before the reset-flow guard is even reached | High | Negative |

## Edge Cases

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PWRESET-022 | Double-click submit on each of the 3 forms | Mid-flow at each step | 1. Click the submit button twice quickly on Forgot Password, then OTP, then Set Password | Valid data at each step | Each screen's `submitting` guard prevents a duplicate request/double-navigation | High | Edge |
| PWRESET-023 | Press Enter to submit on each screen | Mid-flow | 1. Fill each form and press Enter instead of clicking | Valid data | Submits identically to clicking the button | Medium | Edge |
| PWRESET-024 | Refresh the browser mid-flow (between steps) | Mid-flow, e.g. on the OTP screen | 1. Refresh the browser while on `/auth/otp` | — | `pendingEmail` is held in an in-memory signal, not persisted to `localStorage` — a full page reload loses it, so the guard now redirects back to `/auth/forgot-password`; the countdown timer also resets | Medium | Edge |
| PWRESET-025 | Countdown reaches exactly 00:00 | Mid-flow, on OTP | 1. Wait for the timer to hit 0 | — | Timer stays at `00:00` (does not go negative — `Math.max(s - 1, 0)`); Resend becomes enabled exactly at this point | Low | Edge |
| PWRESET-026 | Navigate back from Set Password to OTP and re-verify with the same OTP | Mid-flow, OTP already verified once | 1. Go back to `/auth/otp` 2. Re-enter `1234` and submit again | `1234` | Verifying again succeeds and issues a new reset token (the old one is simply overwritten in `pendingResets`) | Low | Edge |
| PWRESET-027 | Restart the whole flow with a different email mid-session | Mid-flow with email A | 1. Navigate back to Forgot Password 2. Submit with a different, valid email B | Email B | `pendingEmail`/`maskedEmail` are overwritten to email B's flow; continuing proceeds against B, not the abandoned A flow | Low | Edge |
| PWRESET-028 | OTP resend spam-clicked right at the boundary | Mid-flow, timer at 00:01 | 1. Click Resend repeatedly as the timer crosses from 1 to 0 | — | No duplicate resend requests fire before `canResend()` actually flips true; once true, a single click resets the timer | Low | Edge |
| PWRESET-029 | Set Password password/confirm both filled with only spaces | Mid-flow | 1. Enter a password of only space characters in both fields | `"        "` | Confirm-match validator passes (equal strings); strength validator likely scores 0 (no letter/digit/symbol classes match spaces) — expect a weak-password rejection; verify actual behavior | Low | Edge |

## UI Testing

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PWRESET-030 | OTP segmented input — auto-advance and backspace behavior | Mid-flow | 1. Type digits one at a time 2. Use Backspace on an empty segment | 4 digits | Focus auto-advances to the next box on entry; Backspace on an empty box moves focus to the previous box and clears it (per `CLAUDE.md` §17's accessibility requirement) | Medium | UI |
| PWRESET-031 | OTP timer label formatting | Mid-flow | 1. Observe the countdown label at various points | — | Always shown as `MM:SS` with zero-padding (e.g. `09:59`, `00:07`, `00:00`) | Low | UI |
| PWRESET-032 | Loading indicators on all 3 submit buttons | Mid-flow | 1. Submit each form and observe the button during the mock delay | Valid data | Each shows a loading state and disables during submission | Medium | UI |
| PWRESET-033 | Password visibility toggle on Set Password (both fields) | Mid-flow | 1. Toggle show/hide on Password and Confirm Password independently | Any password | Each toggles independently | Low | UI |
| PWRESET-034 | Keyboard-only completion of the whole flow | Logged out | 1. Complete Forgot Password → OTP → Set Password using only the keyboard, including the segmented OTP input | Valid data throughout | Every control across all 3 screens is reachable and operable by keyboard | Medium | UI |

## API Testing

Endpoints: `POST /auth/forgot-password`, `POST /auth/otp/resend`, `POST /auth/otp/verify`, `POST /auth/set-password`. None of the four simulate timeout, network-unavailable, 500, or malformed-response scenarios.

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PWRESET-035 | 200 success on all 4 endpoints in sequence | Logged out | Covered by PWRESET-001 | Valid flow | Each call returns 200 with its documented shape (`{maskedEmail}`, `{maskedEmail}`, `{resetToken}`, `{success:true}`) | High | API |
| PWRESET-036 | 404 on Forgot Password for unknown account | Logged out | Covered by PWRESET-009 | Unknown email | `AppError` 404 | High | API |
| PWRESET-037 | 400 on OTP verify for a wrong code | Mid-flow | Covered by PWRESET-011 | Wrong OTP | `AppError` 400 | High | API |
| PWRESET-038 | 401 on Set Password for an expired/invalid reset session | Mid-flow, contrived | Covered by PWRESET-020 | — | `AppError` 401 | Medium | API |

## Security

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PWRESET-039 | OTP and reset token are not the full account identity, and the email is masked in the UI | Mid-flow | 1. Inspect the OTP screen for any full, unmasked email or password display | — | Only the masked email is shown; the raw email/reset token never renders in the visible UI (they do still travel over the network to the mock API, same as any real backend would) | Low | Security |

---

**Coverage note:** the fixed, universal `1234` demo OTP (rather than a per-request random code delivered by real email) is a documented demo-only simplification — do not report "the same OTP always works" as a security defect in this context; do flag it clearly if this codebase is ever used as a template beyond a demo.
