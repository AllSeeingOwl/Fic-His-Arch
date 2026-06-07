## 2025-06-01 - Avoid unnecessary `client:load` on static Astro components

**Learning:** React components (`.jsx`) used in Astro are completely static by default. Adding `client:load` (or other `client:*` directives) to purely UI-driven components (like `ArticleCard.jsx`) without interactivity (e.g. `useState`, `useEffect`) unnecessarily ships the React runtime and component JavaScript to the client, inflating bundle sizes and slowing down page load performance.
**Action:** Before applying `client:*` hydration directives, confirm the component actually needs interactivity. If it only accepts props and renders HTML, omit the hydration directive so Astro compiles it to pure static HTML.

## 2025-06-03 - Lazy Load Below-the-Fold React Components in Astro

**Learning:** Using `client:load` on React components that are typically rendered below the initial viewport (like `ArchiveInteractiveSection` at the bottom of an article) unnecessarily forces the client to download and hydrate the component's JavaScript during the critical initial page load, increasing Time to Interactive (TTI).
**Action:** When an interactive React component is not immediately visible upon page load, use the `client:visible` directive instead. This ensures Astro only fetches and hydrates the component's JS when it enters the viewport, reducing the initial JavaScript payload.

## 2024-06-05 - Avoid Object Creation in frequently called utility functions

**Learning:** Utility functions like `getFlairColors` that re-instantiate constant dictionaries (`colorMap`) on every call can lead to significant overhead and garbage collection pressure when called repeatedly, especially inside mapping functions for lists or multiple times within a single component render.
**Action:** Always move static configuration objects or maps outside of the function body in utility scripts so they are allocated only once per module load. Additionally, cache the results of such functions locally within the component when they are needed multiple times for the same input.

## 2025-06-06 - Hoist Environment Checks and Static String Normalization

**Learning:** Utility functions like `resolvePath` that perform environment checks (`import.meta.env`) and string manipulations (like slicing trailing slashes from base URLs) on every invocation add unnecessary CPU overhead, especially since they are often called repeatedly inside loops (e.g., rendering lists of links).
**Action:** Hoist static environment checks and string normalization to the module level. They only need to be evaluated once when the module is imported, allowing the core function logic to be as fast as possible.

## 2025-06-07 - Hoist RegExp Allocation and Add String Fast-Paths in DOM Traversal
**Learning:** Re-declaring and compiling Regular Expressions (like `const regex = /\|\|(.*?)\|\|/g;`) inside recursive DOM traversal functions (like `walkDOM`) forces the JavaScript engine to allocate and compile the Regex repeatedly for every single DOM node visited. This significantly degrades client-side render performance on pages with large content payloads. Furthermore, repeatedly calling `regex.test()` on every text node is slower than necessary.
**Action:** Always hoist static Regular Expressions outside of recursive functions or loops. In addition, introduce a lightweight fast-path check (e.g., `text.includes('||')`) before executing the Regex logic to quickly bypass the overhead of Regex execution on strings that definitely don't match.
