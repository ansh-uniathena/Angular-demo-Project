# Course Catalog (Grid/List) — Test Cases

**Screen:** `/courses` · **Component:** `features/courses/catalog/courses-catalog.page.ts`
**Facade:** `CourseCatalogStore` · **Endpoint:** `GET /courses`

**Business rules actually implemented:**
- One dataset (12 mock courses total), rendered by two layout components (grid/list) that share the same data — switching view does **not** re-fetch, it's a pure client-side render toggle.
- Page size is fixed at **9** — with 12 total courses, this is exactly 2 pages (9 + 3) under no filters, which is useful for exercising pagination without needing a huge dataset.
- Search matches **course title only**, case-insensitive substring match (`title.toLowerCase().includes(search)`) — it does not match instructor names, categories, or descriptions.
- Search is **debounced 300ms** and piped through `switchMap` — a fast-typed second keystroke cancels the in-flight request for the first.
- Filters: Category (multi-select), Level (multi-select), Price (`all`/`free`/`paid` — a course is "free" only when `price === null`), and a decorative price-range slider (its `rangeChange` output exists on the component but **is not wired to any store method** in `CoursesCatalogPage` — moving it does not actually filter results; this is a real functional gap worth testing explicitly, not just documenting).
- Any filter/sort/search change resets `page` back to 1.
- **Clear filters** resets category/level/price/search all at once and reloads.
- Sort options: Newly Published (default/no-op order), Price Low→High, Price High→Low, Top Rated (`rating` desc). Free courses (`price === null`) sort as `0` under both price sorts (`price ?? 0`).
- The "Instructors" facet in the sidebar is **display-only** — selecting/clicking it does not filter (documented, `CLAUDE.md` §22).
- Favoriting (heart icon) is a documented no-op — does not persist.
- Arriving from `/?search=...` (Home hero) pre-fills and pre-filters via `CoursesCatalogPage`'s constructor reading the query param once, on load only.

---

## Functional / Happy Path

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CATALOG-001 | Catalog loads with the default (unfiltered) list | Any auth state | 1. Navigate to `/courses` | — | Shows "Showing 1-9 of 12 results", grid view, 9 course cards, sorted "Newly Published" | High | Functional |
| CATALOG-002 | Switch from Grid to List view | On `/courses` | 1. Click the List toggle button | — | Cards re-render in list layout using the **same 9 items already loaded** — no new network request fires | High | Functional |
| CATALOG-003 | Switch back from List to Grid | Currently in List view | 1. Click the Grid toggle button | — | Reverts to grid layout, same data | Medium | Functional |
| CATALOG-004 | Search for a term that matches exactly one course title | On `/courses` | 1. Type a unique word from one course's title into Search | e.g. `Sketch` | After the 300ms debounce, results narrow to that one course; "Showing 1-1 of 1 results" | High | Functional |
| CATALOG-005 | Filter by a single category | On `/courses` | 1. Check one category checkbox in the sidebar | e.g. `Design` | Results narrow to only that category's courses; page resets to 1; result count updates | High | Functional |
| CATALOG-006 | Filter by multiple categories at once | On `/courses` | 1. Check two category checkboxes | e.g. `Design` + `Programming` | Results include courses from **either** category (OR logic, not AND — `categoryIds.includes(c.category)`) | High | Functional |
| CATALOG-007 | Filter by Level | On `/courses` | 1. Check a level checkbox | e.g. `Beginner` | Results narrow to that level only | Medium | Functional |
| CATALOG-008 | Filter by Price = Free | On `/courses` | 1. Select the "Free" price option | — | Only courses with `price === null` show | High | Functional |
| CATALOG-009 | Filter by Price = Paid | On `/courses` | 1. Select the "Paid" price option | — | Only courses with a non-null price show | High | Functional |
| CATALOG-010 | Sort by Price: Low to High | On `/courses`, no filters | 1. Select "Price: Low to High" from the sort dropdown | — | List re-orders ascending by price; free courses (price `null`→0) sort first | Medium | Functional |
| CATALOG-011 | Sort by Price: High to Low | On `/courses` | 1. Select "Price: High to Low" | — | List re-orders descending by price | Medium | Functional |
| CATALOG-012 | Sort by Top Rated | On `/courses` | 1. Select "Top Rated" | — | List re-orders by `rating` descending | Medium | Functional |
| CATALOG-013 | Combine search + filter + sort together | On `/courses` | 1. Enter a search term 2. Check a category 3. Change sort | e.g. search `e`, category `Programming`, sort `Top Rated` | All three constraints apply together (AND between search/category/level/price, then the whole set is sorted) | High | Functional |
| CATALOG-014 | Pagination — go to page 2 | On `/courses`, unfiltered (12 results = 2 pages) | 1. Click page **2** | — | Shows the remaining 3 courses; "Showing 10-12 of 12 results" | High | Functional |
| CATALOG-015 | Pagination — return to page 1 | On page 2 | 1. Click page **1** | — | Shows the first 9 again | Medium | Functional |
| CATALOG-016 | Clear Filters resets everything | Search + at least one filter + non-default sort applied | 1. Click **Clear** | — | Search box empties, all checkboxes uncheck, price option resets to "all", page resets to 1, full 12-result list returns (sort selection may or may not visually reset — verify actual behavior since `clearFilters()` does not touch `_sort`) | High | Functional |
| CATALOG-017 | Arriving from Home hero search pre-fills and pre-filters | On `/`, hero search submitted for a real term | 1. Submit the Home hero search for a term that matches a course | e.g. `Wordpress` | Lands on `/courses?search=Wordpress` with the search box already showing "Wordpress" and results already filtered — no second manual search needed | High | Functional |

## Negative Testing

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CATALOG-018 | Search with no matching results | On `/courses` | 1. Enter a term matching no course title | `zzzznomatch` | Empty state — "No courses match these filters." (or equivalent), not a blank screen or leftover stale cards | High | Negative |
| CATALOG-019 | Filter combination with no matching results | On `/courses` | 1. Select a category + level combination that yields zero courses | contrived combination | Same empty state as CATALOG-018 | Medium | Negative |
| CATALOG-020 | Search is case-insensitive | On `/courses` | 1. Search using the opposite case of a real title's letters | `WORDPRESS` vs `wordpress` | Same results regardless of case | Medium | Functional |
| CATALOG-021 | Search does not match instructor name or category, only title | On `/courses` | 1. Search for a known instructor's name that doesn't also appear in any course title | e.g. an instructor's full name | No results (unless coincidentally also a title substring) — confirms search scope is title-only, not a bug if it returns nothing | Low | Negative |
| CATALOG-022 | Navigating to page beyond the last page number is not possible via UI | On `/courses`, 2 total pages | 1. Attempt to select a page number beyond 2 (none should be rendered) | — | `goToPage()` guards `page > totalPages()` — no such page button exists to click in the first place | Low | Negative |
| CATALOG-023 | Price range slider does not actually filter results | On `/courses` | 1. Drag either thumb of the price-range slider away from its default | Any value | **Known gap:** the result list does not change — `PriceRangeSlider`'s `rangeChange` output isn't wired to `CourseCatalogStore` in this page. Confirm this is still the case; if a developer later wires it up, this test case's expectation must be updated | Medium | Negative |

## Edge Cases

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CATALOG-024 | Fast typing in search does not race/flicker results | On `/courses` | 1. Type a full search term character-by-character quickly (faster than 300ms between keystrokes) | e.g. type "Wordpress" fast | Only the final debounced value's request resolves and renders — no flash of intermediate single-letter results (the `switchMap` cancels stale in-flight requests) | High | Edge |
| CATALOG-025 | Clearing the search box after typing returns to the unfiltered list | On `/courses`, search applied | 1. Select all text in Search and delete it | `""` | After debounce, the full unfiltered (but still page-1) list returns | Medium | Edge |
| CATALOG-026 | Rapidly toggling the same category checkbox on/off | On `/courses` | 1. Click a category checkbox on, then off, quickly, several times | — | Ends in a consistent state matching the checkbox's final checked/unchecked value — no stuck "loading" state or stale filtered result | Medium | Edge |
| CATALOG-027 | Rapidly clicking Grid/List toggle | On `/courses` | 1. Click Grid/List toggle several times quickly | — | No flicker, crash, or duplicate network calls (it's a pure client-side signal, not an API call) | Low | Edge |
| CATALOG-028 | Changing filters while a previous filtered request is still in flight | On `/courses`, throttled network | 1. Check a category 2. Immediately check a different category before the first request resolves | Two categories in quick succession | Only the latest combined filter state's result is shown — no stale/overwritten intermediate result flashes (same `switchMap` protection as search) | High | Edge |
| CATALOG-029 | Search term with special/URL-unsafe characters | On `/courses` | 1. Enter symbols | `C++ & C#` | Handled safely as a query param and as a filter string — no broken request or unescaped-character crash | Medium | Edge |
| CATALOG-030 | Very long search term | On `/courses` | 1. Enter a 200+ character search string | long string | No match (assuming no course title is that long); empty state renders cleanly, no layout break | Low | Edge |
| CATALOG-031 | Whitespace-only search term | On `/courses` | 1. Enter only spaces | `"   "` | The mock handler does `search?.toLowerCase().trim()` — a whitespace-only value trims to `""`, which is falsy, so **no filter is applied** (same as an empty search), not an empty-result state | Medium | Edge |
| CATALOG-032 | Double-clicking Clear Filters | Filters applied | 1. Click **Clear** twice quickly | — | Second click is a no-op on an already-cleared state — no error, no duplicate request causing a flicker | Low | Edge |
| CATALOG-033 | Result count exactly at the page-size boundary (9 results) | Filtered down to exactly 9 matching courses | 1. Apply a filter yielding exactly 9 results | contrived filter | Exactly 1 page shown, no pagination controls needed/rendered for a second page | Low | Edge |

## UI Testing

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CATALOG-034 | Loading spinner shown during initial load and every subsequent filter/search/sort/page change | On `/courses` | 1. Observe during the ~600ms mock delay for each interaction type | — | Spinner (or equivalent loading indicator) shows every time `loading` is true | Medium | UI |
| CATALOG-035 | Results count label updates correctly ("Showing X-Y of Z results") | Various filter states | 1. Apply different filters/pages and read the label | — | Label math is always correct, including the 0-results case ("Showing 0 results") | Medium | UI |
| CATALOG-036 | Category/Level checkboxes show live counts per option | On `/courses` | 1. Observe the number next to each category/level checkbox | — | Counts are derived from the actual full mock dataset (`buildCourseFilters`), not hardcoded — they should never drift from what's actually filterable | Low | UI |
| CATALOG-037 | Keyboard-only interaction with search, filters, sort, and pagination | On `/courses` | 1. Operate every control using only the keyboard | — | Search input, checkboxes, sort dropdown, grid/list toggle buttons, and pagination buttons are all reachable and operable via keyboard, with accessible names on icon-only controls (per `CLAUDE.md` §17) | Medium | UI |
| CATALOG-038 | Responsive behavior of the sidebar + grid layout | On `/courses` | 1. Resize to mobile/tablet widths | — | Sidebar and card grid reflow without horizontal overflow — record actual behavior, no Figma mobile frame exists to compare against | Medium | UI |

## API Testing

Endpoint: `GET /courses`. No error-path (400/401/403/404/409/500/timeout/network/malformed) simulation currently exists — every call this endpoint receives succeeds.

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CATALOG-039 | 200 success with correct query params sent | On `/courses`, filters/search/sort/page applied | 1. Inspect the network request for `GET /courses` | Various | Query string correctly includes `page`, `pageSize`, `search`, `sort`, `categoryIds`, `levelIds`, `priceOptionId` matching the current UI state | High | API |
| CATALOG-040 | Empty response (0 total matches) | Filter combo with zero matches | Covered by CATALOG-019 | — | `{ items: [], total: 0, ... }` handled as the empty state, not an error | Medium | API |
| CATALOG-041 | 400/401/403/404/409/500/timeout/network-unavailable/malformed response | — | Not simulated by the current mock API for this endpoint | — | **Not currently producible** — a real gap to close before this endpoint could be considered resilience-tested | Medium | API |

## Data

| Test ID | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Priority | Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CATALOG-042 | Filter facet counts stay consistent with the actual dataset | On `/courses` | 1. Sum the counts shown for all category checkboxes | — | Sum equals the total course count only if categories are mutually exclusive per course (verify against the known 12-course mock set — do not assume without checking, since a course could theoretically belong to only one category in this model) | Low | Data |
| CATALOG-043 | Read consistency across a grid↔list toggle | On `/courses`, filtered/searched state | 1. Apply a filter 2. Toggle grid→list→grid | Any filter | The exact same filtered result set is shown in both views — toggling never silently drops or duplicates items | Medium | Data |

---

**Coverage note:** there is no Security section for this file — the catalog
is fully public with no user-specific or sensitive data. Comment-form
security (name/email/comment submission) is covered in
`courses/course-detail-test-cases.md` instead, where that form actually
lives.
