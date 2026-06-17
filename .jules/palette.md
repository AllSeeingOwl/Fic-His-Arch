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

## 2024-06-06 - [Global Navigation Focus States]

**Learning:** Relying on default browser outlines (`focus:outline-none` with no replacement) or missing custom focus indicators on primary global navigation elements (hamburger menus, top-level links) severely hinders keyboard users, especially over custom dark backgrounds where default outlines are invisible.
**Action:** Always provide explicitly styled, high-contrast focus indicators (e.g., `focus-visible:ring-2 focus-visible:ring-archive-accent focus-visible:ring-offset-2`) to all interactive elements within primary navigation structures to ensure a clear visual path for keyboard users.

## 2024-06-07 - Screen Reader Grouping for Filter Buttons

**Learning:** When implementing a set of filter buttons (like the timeline filters in `index.astro`), screen readers may announce them simply as individual buttons without context. Wrapping the filter container with `role="group"` and linking it via `aria-labelledby` to a descriptive heading or label (e.g., "Filter by Timeline:") provides crucial context, ensuring users understand they are interacting with a related set of controls.
**Action:** When creating filter groups or related sets of buttons in the future, always wrap them in a semantic or ARIA `group` and provide an accessible label for the container.

## 2025-02-18 - [Interactive Inline Redactions Accessibility]

**Learning:** Inline redactions acting as buttons (`role="button"`, `tabindex="0"`) generated dynamically via JS replacement lacked `focus-visible` states, making them invisible to keyboard navigation.
**Action:** Added Tailwind `focus-visible:ring-2 focus-visible:ring-archive-accent` classes to dynamically generated inline interactive elements to ensure keyboard users can perceive focus on redacted text.

## 2025-10-24 - [Required Form Field Indicators]

**Learning:** Sighted users often struggle to identify which form fields are mandatory when only the native `required` attribute is used (which is only announced by screen readers). Conversely, simply adding an asterisk (_) to the label text will be read aloud by screen readers on every field, which can be annoying and redundant when `required` is already present.
**Action:** When building forms, utilize native HTML5 `required` attributes and include a visual indicator (e.g., `<span aria-hidden="true" className="text-archive-accent ml-1">_</span>`) on labels to prevent user confusion without creating redundant screen reader announcements.

## 2025-10-25 - [Toggle Button Groups Accessibility]

**Learning:** When implementing toggle button groups (like view switches between 'Master List' and 'Timeline'), screen readers may announce them as disconnected buttons without context or current active state. Furthermore, lacking a `focus-visible` ring makes keyboard navigation difficult.
**Action:** Wrap the button group in `role="group"` with an `aria-label` describing the action (e.g., `aria-label="View selection"`). Apply `aria-pressed="true|false"` dynamically to the buttons based on the active state, and ensure standard `focus-visible` ring utilities are applied for keyboard accessibility.

## 2025-10-26 - [Custom CSS Tooltip Accessibility]

**Learning:** When building custom tooltips using pure CSS `group-hover` and `group-focus-within`, using a generic `<span tabIndex="0">` as the trigger causes screen readers to either ignore it or announce it without context. Additionally, if the visual tooltip container isn't hidden from screen readers, the text will be read redundantly or out of context.
**Action:** Use a native `<button type="button">` trigger instead of a generic `<span tabIndex="0">`. Set the button's `aria-label` to the actual tooltip text for native screen reader support, add `aria-hidden="true"` to the visual tooltip container to prevent redundant reading, and ensure `focus-visible` styles are present on the trigger.

## 2025-10-26 - [Tooltip Accessibility Pattern]

**Learning:** When building custom tooltips using pure CSS `group-hover` and `group-focus-within`, using a generic `<span tabIndex="0">` lacks native button semantics. Additionally, generic `aria-label="More info"` forces screen reader users to infer meaning rather than reading the tooltip's actual text.
**Action:** Replace interactive tooltip triggers with native `<button type="button">`. Set the button's `aria-label` to the actual tooltip text so screen readers read it natively, and add `aria-hidden="true"` to the visual tooltip container to prevent redundant reading. Always include `focus-visible` styles for the trigger.

## 2025-10-26 - [Contextual ARIA Labels for Repeated Form Actions]

**Learning:** When generating multiple repeating dynamic elements that perform the same action (like "Remove" buttons for a list of links or variants), simply relying on the visible text "Remove" causes screen readers to announce identical, contextless actions for every button.
**Action:** Always add a descriptive, contextual `aria-label` (e.g., `aria-label={"Remove link " + (index + 1)}`) to repeating action buttons inside mapped arrays so screen reader users know exactly which item the button affects.

## 2025-10-27 - [Inline Link Focus States]

**Learning:** Inline text links lacking explicit focus states are difficult to spot for keyboard users.
**Action:** When working with inline text links, particularly over dark backgrounds, add explicit custom focus styling to improve visibility. Classes such as `focus:outline-none focus-visible:ring-2 focus-visible:ring-archive-accent rounded px-1 -ml-1` can be added to the link styling.

## 2026-06-17 - Active Navigation Link Pattern

**Learning:** Adding an active state to global navigation menus requires careful path normalization and matching logic (especially for the root path `/`). Relying solely on visual cues (like `text-archive-accent font-bold`) leaves screen reader users without context of their current location. The `aria-current="page"` attribute is essential.
**Action:** When implementing navigation, always combine visual active states with `aria-current="page"`. Ensure routing logic correctly handles base paths and trailing slashes to prevent false-positive active states.
