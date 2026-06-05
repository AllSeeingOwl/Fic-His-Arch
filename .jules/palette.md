## 2024-06-01 - [Tabs Accessibility]

**Learning:** React Tabs pattern using basic buttons in a row lacked full ARIA roles (`role="tablist"`, `role="tab"`, `role="tabpanel"`), `aria-selected`, and keyboard-focus states (`focus-visible:ring-2`) specific to this app's components.
**Action:** Applied standard ARIA attributes (`aria-selected`, `aria-controls`, `aria-labelledby`) and proper keyboard focus rings for tab navigation within interactive React components.

## 2024-06-01 - [Tabs Accessibility Continuation]

**Learning:** Adding ARIA `role="tab"` and removing `tabIndex={-1}` allows native focus tracking, which works better unless I can ensure complete keyboard interactions like `onKeyDown` with Left and Right Arrows for tablists. Without keyboard interaction, using native tab focus via the generic Tab Key is much preferred.
**Action:** Removed `tabIndex={-1}` to ensure native tabability.

## 2024-06-03 - [Collapsible Accessibility using Native Buttons]

**Learning:** Using `onClick` directly on structural elements like `<tr>` or generic `<div>` for collapsible sections removes keyboard accessibility (tab navigation) and prevents screen readers from understanding the element's state, even with `cursor-pointer`.
**Action:** Replaced `onClick` wrappers with native `<button>` elements, added `aria-expanded` reflecting the state, `aria-controls` pointing to the expanded container's ID, and `focus-visible:ring-2` to restore full native keyboard/screen reader interaction for the accordion/collapsible pattern.

## 2026-06-04 - [Sortable Table Header Accessibility]

**Learning:** Placing `onClick` handlers directly on `<th>` elements for sorting functionality makes them inaccessible to keyboard users (no tab focus) and screen readers (no semantics about interactive or sorting state).
**Action:** Replaced direct `onClick` on `<th>` with native `<button>` elements inside the headers, restoring natural keyboard navigation and adding `focus-visible` styles. Applied `aria-sort="ascending|descending|none"` to the `<th>` tags so screen readers can correctly announce the active sort state.

## 2024-06-05 - [Skip Links for Keyboard Accessibility]

**Learning:** Global navigation menus without a 'skip-to-content' link force keyboard users to tab through all navigation items repetitively on every page before reaching the main content. This is a crucial accessibility gap for keyboard and screen reader users.
**Action:** Added a visually hidden 'Skip to main content' link (`sr-only focus:not-sr-only`) at the top of the body that anchors to `<main id="main-content">`, allowing users to bypass global navigation efficiently.
