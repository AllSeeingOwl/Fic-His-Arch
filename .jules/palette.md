## 2024-06-01 - [Tabs Accessibility]

**Learning:** React Tabs pattern using basic buttons in a row lacked full ARIA roles (`role="tablist"`, `role="tab"`, `role="tabpanel"`), `aria-selected`, and keyboard-focus states (`focus-visible:ring-2`) specific to this app's components.
**Action:** Applied standard ARIA attributes (`aria-selected`, `aria-controls`, `aria-labelledby`) and proper keyboard focus rings for tab navigation within interactive React components.
## 2024-06-01 - [Tabs Accessibility Continuation]
**Learning:** Adding ARIA `role="tab"` and removing `tabIndex={-1}` allows native focus tracking, which works better unless I can ensure complete keyboard interactions like `onKeyDown` with Left and Right Arrows for tablists. Without keyboard interaction, using native tab focus via the generic Tab Key is much preferred.
**Action:** Removed `tabIndex={-1}` to ensure native tabability.
