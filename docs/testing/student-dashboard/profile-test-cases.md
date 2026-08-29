# Student Profile — Test Cases

**Screen:** `/student/profile` · **Component:** `features/student-dashboard/profile/student-profile.page.ts`
**Facade:** `StudentProfileStore` · **Endpoints:** `GET /student/profile`, `PUT /student/profile`
**Guards:** `authGuard` + `roleGuard('student')` (see `auth/route-guards-test-cases.md`).

**Business rules actually implemented:**
- Read-only view by default; a pencil/edit icon toggles `StudentProfileStore.editing` to swap in an editable form.
- **Editable fields**: First Name (required), Last Name (required), Phone (required), Gender (defaults to `Male`, no validation beyond being present), Bio (optional, no validation).
- **Read-only, never editable**: Username, Email, Date of Birth, Age, Registration Date — these are displayed but have no form controls, per the mockup's edit affordance not implying they should be editable (`CLAUDE.md` §23).
- The edit form is populated from live store data via an `effect()` that fires whenever `data()`/`editing()` change — **not** in the constructor (constructor data isn't loaded yet).
- Save (`PUT /student/profile`) always succeeds in the mock API (`Object.assign(mockStudentProfile, patch)`) — there is no server-side validation or duplicate/conflict check on this endpoint.
- A saved change persists only for the lifetime of the browser tab (in-memory mock data) — a full reload resets the profile back to its seeded values.

---

## Functional / Happy Path

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PROFILE-001 | View profile in read-only mode | Logged in, on `/student/profile` | 1. Observe the page | — | Shows First/Last Name, Username, Phone, Email, Gender, DOB, Age, Bio, Registration Date as plain text, no inputs visible | High | Functional |
| PROFILE-002 | Enter edit mode | Logged in, on `/student/profile` | 1. Click the pencil/edit icon | — | Read-only grid swaps for the editable form, pre-filled with the current values for First/Last Name, Phone, Gender, Bio | High | Functional |
| PROFILE-003 | Save a valid change to First Name | In edit mode | 1. Change First Name 2. Click Save | e.g. `Ronaldo` | `PUT /student/profile` succeeds; view reverts to read-only mode showing the new First Name | High | Functional |
| PROFILE-004 | Save a valid change to Bio | In edit mode | 1. Change Bio text 2. Save | New bio paragraph | Bio updates and displays correctly, including line breaks if any | Medium | Functional |
| PROFILE-005 | Saved change is reflected immediately without a manual reload | Just saved (PROFILE-003) | 1. Observe the read-only view right after saving | — | New value shows immediately (store's own signal updates, no reload needed) | Medium | Functional |

## Negative Testing

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PROFILE-006 | Empty First Name | In edit mode | 1. Clear First Name 2. Click Save | `""` | Required-field error under First Name; no API call | High | Negative |
| PROFILE-007 | Empty Last Name | In edit mode | 1. Clear Last Name 2. Save | `""` | Required-field error; no API call | High | Negative |
| PROFILE-008 | Empty Phone | In edit mode | 1. Clear Phone 2. Save | `""` | Required-field error; no API call | High | Negative |
| PROFILE-009 | Phone with non-numeric characters | In edit mode | 1. Enter letters into Phone 2. Save | `abcdefg` | **No format validation exists on Phone** — this is currently accepted and saved as-is; record this as a known validation gap, not a defect to silently "fix" during testing | Medium | Negative |
| PROFILE-010 | Whitespace-only First/Last Name | In edit mode | 1. Enter only spaces in First Name 2. Save | `"   "` | Angular's `required` validator treats non-empty whitespace as present — currently **accepted**; flag as a validation gap | Low | Negative |
| PROFILE-011 | Attempt to edit a read-only field via browser dev tools | In edit mode | 1. Attempt to modify the DOM to expose an input for Email/Username/DOB/Age/Registration Date | — | Even if the DOM is tampered with client-side, no form control is wired to those fields in the component — nothing meaningful could be submitted for them; this is a defense-in-depth sanity check, not an expected real-world path | Low | Negative |
| PROFILE-012 | Very long Bio text | In edit mode | 1. Enter a 5000+ character Bio 2. Save | long string | Accepted (no max-length rule); saves and displays without breaking the layout — verify no runaway overflow in the read-only card | Low | Edge |

## Edge Cases

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PROFILE-013 | Cancel edit mode without saving (if a cancel affordance exists) | In edit mode, fields changed | 1. Exit edit mode without clicking Save (via a Cancel control or by clicking the edit icon again) | Changed but unsaved values | Read-only view shows the **original**, unsaved values — changes are discarded | Medium | Edge |
| PROFILE-014 | Re-entering edit mode after a cancelled edit shows original values, not the discarded draft | After PROFILE-013 | 1. Click edit again | — | Form re-populates from the still-original store data, not the previously-typed draft | Medium | Edge |
| PROFILE-015 | Double-click Save | In edit mode, valid changes | 1. Click Save twice quickly | Valid data | Only one `PUT` request is effectively actioned/needed — verify no duplicate submission or double state-toggle out of edit mode | Medium | Edge |
| PROFILE-016 | Save with no actual changes made | In edit mode, form untouched | 1. Click Save without changing anything | Unchanged values | Succeeds as a no-op update — profile data is unchanged, no error | Low | Edge |
| PROFILE-017 | Switch Gender and save | In edit mode | 1. Change the Gender selection 2. Save | e.g. `Female` | New gender value saves and displays correctly | Low | Functional |
| PROFILE-018 | Navigate away mid-edit without saving | In edit mode, fields changed | 1. Click a different sidebar nav item (not Save) | Changed but unsaved values | Navigating away discards the in-progress edit; returning to Profile shows the original saved values, not the abandoned draft | Medium | Edge |
| PROFILE-019 | Reload the page after saving | Just saved a change | 1. Refresh the browser | — | Since the mock data change is in-memory only, **the saved change is lost on a full reload** — the profile reverts to its originally-seeded values; this is expected mock-API behavior, not a defect (record it, don't "fix" it without a product decision) | Medium | Edge |

## UI Testing

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PROFILE-020 | Loading state while profile data loads | Logged in | 1. Navigate to `/student/profile` and observe immediately | — | Spinner shown before profile data renders | Medium | UI |
| PROFILE-021 | Field-level red border + message on touched invalid fields in edit mode | In edit mode | 1. Clear a required field and tab away | — | Shared `FormField` red-border + message pattern applies | Medium | UI |
| PROFILE-022 | Save button loading/disabled state while submitting | In edit mode, valid data | 1. Click Save and observe the button during the mock delay | Valid data | Button shows a loading indicator and disables during the request | Medium | UI |
| PROFILE-023 | Keyboard-only edit-and-save flow | Logged in | 1. Enter edit mode, fill/change fields, and save using only the keyboard | Valid data | Fully operable via keyboard | Medium | UI |

## API Testing

Endpoints: `GET /student/profile`, `PUT /student/profile`. Neither simulates any error path — both always succeed.

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PROFILE-024 | 200 success on profile fetch | Logged in | Covered by PROFILE-001 | — | Full `StudentProfile` payload returned | High | API |
| PROFILE-025 | 200 success on profile save | Valid edit | Covered by PROFILE-003 | — | Server "accepts" and merges the patch (`Object.assign`); response echoes the updated profile | High | API |
| PROFILE-026 | 400/401/403/404/409/500/timeout/network-unavailable/malformed response on save | — | Not simulated by the current mock API | — | **Not currently producible** — notably, there's no simulated 409 even though editing is exactly the kind of operation a real backend might reject on a stale/conflicting write; flagged as a real gap worth prioritizing if this endpoint is ever backed by a real API | Medium | API |

## Data

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PROFILE-027 | Update (the only real data-mutation on this page) is idempotent for unchanged data | Covered by PROFILE-016 | — | — | Repeated identical saves don't corrupt or duplicate data (there's nothing to duplicate — it's a single-record `Object.assign`) | Low | Data |
| PROFILE-028 | Read/Update consistency across the same session | Logged in, one save performed | 1. Save a change 2. Navigate to Dashboard 3. Navigate back to Profile | — | The updated value is still shown (same in-memory object, read again via `GET /student/profile`) — confirms writes and reads share the same mock data source | Medium | Data |

---

**Coverage note:** there is no Security section — this page has no
role/permission distinction beyond the standard `/student/*` guard already
covered centrally, and no sensitive-data-exposure risk beyond what's already
visible in the normal read-only view.
