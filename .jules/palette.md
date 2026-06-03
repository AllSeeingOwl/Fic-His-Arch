## 2024-06-01 - [Tabs Accessibility]

**Learning:** React Tabs pattern using basic buttons in a row lacked full ARIA roles (`role="tablist"`, `role="tab"`, `role="tabpanel"`), `aria-selected`, and keyboard-focus states (`focus-visible:ring-2`) specific to this app's components.
**Action:** Applied standard ARIA attributes (`aria-selected`, `aria-controls`, `aria-labelledby`) and proper keyboard focus rings for tab navigation within interactive React components.

## 2024-06-01 - [Tabs Accessibility Continuation]

**Learning:** Adding ARIA `role="tab"` and removing `tabIndex={-1}` allows native focus tracking, which works better unless I can ensure complete keyboard interactions like `onKeyDown` with Left and Right Arrows for tablists. Without keyboard interaction, using native tab focus via the generic Tab Key is much preferred.
**Action:** Removed `tabIndex={-1}` to ensure native tabability.

## 2024-06-03 - [Collapsible Accessibility using Native Buttons]

**Learning:** Using `onClick` directly on structural elements like `<tr>` or generic `<div>` for collapsible sections removes keyboard accessibility (tab navigation) and prevents screen readers from understanding the element's state, even with `cursor-pointer`.
**Action:** Replaced `onClick` wrappers with native `<button>` elements, added `aria-expanded` reflecting the state, `aria-controls` pointing to the expanded container's ID, and `focus-visible:ring-2` to restore full native keyboard/screen reader interaction for the accordion/collapsible pattern.
