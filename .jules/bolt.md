## 2025-06-01 - Avoid unnecessary `client:load` on static Astro components

**Learning:** React components (`.jsx`) used in Astro are completely static by default. Adding `client:load` (or other `client:*` directives) to purely UI-driven components (like `ArticleCard.jsx`) without interactivity (e.g. `useState`, `useEffect`) unnecessarily ships the React runtime and component JavaScript to the client, inflating bundle sizes and slowing down page load performance.
**Action:** Before applying `client:*` hydration directives, confirm the component actually needs interactivity. If it only accepts props and renders HTML, omit the hydration directive so Astro compiles it to pure static HTML.
