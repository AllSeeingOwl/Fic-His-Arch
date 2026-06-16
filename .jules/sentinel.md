## 2025-02-23 - Hardcoded Admin Default Password

**Vulnerability:** Found `const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';` in `server.ts`. This falls back to a highly guessable password ('admin') if the environment variable is not set. Furthermore, `app.post('/api/admin/verify', ...)` responds with the `ADMIN_PASSWORD` as the token when verification succeeds (`res.json({ success: true, token: ADMIN_PASSWORD });`).
**Learning:** Default fallbacks for sensitive credentials in server code lead to critical vulnerabilities, especially if the code returns this token to the client.
**Prevention:** Remove fallback logic for sensitive credentials. If `process.env.ADMIN_PASSWORD` is not set, the server should either generate a strong random string or refuse to start/fail securely rather than defaulting to 'admin'.

## 2025-02-23 - Express Error Handler Information Leak

**Vulnerability:** The Express error handler `console.error('Unhandled error:', err);` and the HTTP response `res.status(httpErr.status).json({ error: httpErr.message || 'Error' });` might leak sensitive stack traces or internal implementation details if an unexpected error propagates.
**Learning:** Returning `httpErr.message` directly without validating or sanitizing it can inadvertently leak application structure or sensitive server state.
**Prevention:** In a production environment, send a generic error message (e.g., "An unexpected error occurred") and log the detailed error internally.

## 2024-05-28 - [Add rate limiting to login endpoint]

**Vulnerability:** The `/api/admin/verify` endpoint lacked rate limiting, making it susceptible to brute-force attacks against the admin password.
**Learning:** Added a basic in-memory rate limiter to track failed login attempts by IP address. The rate limiter locks out the IP for 15 minutes after 5 failed attempts and includes a simple map-size check to clear entries if they exceed 1000 items (preventing minor memory exhaustion vectors).
**Prevention:** Always implement basic rate limiting and lockouts for authentication and sensitive administrative endpoints to mitigate brute forcing. Avoid adding dependencies like `express-rate-limit` without permission, preferring custom lightweight maps when appropriate.

## 2024-06-03 - Masking Expected API Errors

**Vulnerability:** A previous attempt to mask all Express error messages in production broke client applications.
**Learning:** Only mask server-side errors (>= 500) in production. Expected client errors (< 500) often contain safe, client-facing messages (e.g., validation errors) and should not be masked.
**Prevention:** When implementing secure error handling, always differentiate between client-caused errors (4xx) and unhandled server exceptions (5xx).

## 2024-06-04 - [Rate Limit Bypass via Cache Eviction]

**Vulnerability:** A simplistic rate limiter cache eviction strategy (`if (map.size > limit) map.clear();`) allowed attackers to bypass rate limits. By flooding the server from many dummy IPs, an attacker could artificially fill the cache and trigger a global clear, thereby deleting their own block record and resetting their attempt count.
**Learning:** Naive size-based eviction in in-memory rate limiters creates a DoS vector against the security mechanism itself.
**Prevention:** Implement time-aware cleanup that selectively removes only expired entries, or use established rate limiting middleware (like `express-rate-limit`) instead of custom implementations when possible. If an in-memory limit must be used, never clear active blocks during eviction.

## 2025-02-23 - XSS Vulnerability via Zod `url()` Validation

**Vulnerability:** Zod's `z.string().url()` validation natively allows arbitrary protocol schemes, including `javascript:`, `vbscript:`, and `data:` URIs. In this project, if users contribute articles containing timeline variants with malicious `javascript:` URIs (e.g., `javascript:alert('XSS')`), these URLs would pass the Astro Content Collection validation and be rendered directly into `href` attributes, creating a Cross-Site Scripting (XSS) vulnerability.
**Learning:** Default URL validation in popular libraries like Zod only validates syntax, not protocol safety. Unsafe protocols can easily bypass these checks.
**Prevention:** Avoid relying solely on `z.string().url()`. Instead, define a custom refinement (e.g., `safeUrlSchema`) that explicitly checks the `URL.protocol` to only allow safe schemes like `http:` and `https:`, or safe internal paths (starting with `/` or `#`).

## 2025-02-23 - Timing Side-Channel in Password Comparison

**Vulnerability:** The Express server (`server.ts`) previously used `crypto.timingSafeEqual` directly on `Buffer.from(password)` and compared lengths before execution. Even with a dummy `timingSafeEqual` branch, length comparisons introduce slight timing deviations, which can leak the length of the secret admin password and theoretically reduce the search space.
**Learning:** Comparing varying length strings safely against timing attacks requires hashing the strings to a fixed length first. Comparing fixed-length hashes (e.g., SHA-256) using `crypto.timingSafeEqual` completely mitigates length-based side-channels.
**Prevention:** Whenever verifying tokens, API keys, or passwords with `timingSafeEqual`, hash both the provided and expected strings first to guarantee they are the same constant length, instead of adding error-prone fallback/dummy length comparisons.

## 2025-02-23 - DOM-based XSS via Client-Side Markdown Parsing

**Vulnerability:** In `src/pages/archive/[slug].astro`, custom `||spoiler||` syntax was handled client-side by recursively reading text nodes (`node.nodeValue`), using a regex to replace the syntax with HTML (`<span class="redacted-spoiler">...</span>`), and then injecting the result directly back into the DOM using `span.innerHTML = ...`. Because `nodeValue` unescapes HTML entities, any raw HTML tags inside the text (e.g. `<img src=x onerror=alert(1)>`) would be interpreted as real executable HTML during the `innerHTML` assignment, leading to DOM-based XSS.
**Learning:** Any time client-side JavaScript reads from a text node and writes to `innerHTML`, it acts as an unescaping mechanism that creates an XSS sink.
**Prevention:** Always sanitize or HTML-escape text retrieved from a DOM text node (`node.nodeValue`) before applying string replacements and assigning the result to `.innerHTML`.

## 2025-02-23 - Permanent DoS via Incomplete Cache Eviction

**Vulnerability:** The custom rate limiter in `server.ts` tracked IP addresses but its cache eviction loop only deleted expired records (`lockUntil > 0 && lockUntil <= now`). It failed to clear partial failed attempts (`count > 0` but `lockUntil === 0`). If an attacker made requests from 1000 distinct IP addresses, the map would reach its 1000 item capacity and refuse all new connections with a 503 error, resulting in a permanent Denial of Service (DoS) for legitimate users.
**Learning:** Custom in-memory rate limiters must implement comprehensive eviction logic that accounts for all possible states (e.g., partial failures, expired locks). Failure to do so can result in permanent capacity exhaustion.
**Prevention:** Track the timestamp of the last attempt (`lastAttempt: now`) for each record and update the eviction loop to delete both expired locks and partial failures that are older than the lockout duration.

## 2025-02-23 - CSP Unsafe-Inline Mitigation

**Vulnerability:** The Content-Security-Policy (CSP) header in `server.ts` previously allowed `script-src 'self' 'unsafe-inline'`. This configuration significantly weakens the application's defense against Cross-Site Scripting (XSS) attacks by allowing arbitrary inline scripts to execute.
**Learning:** Permitting `'unsafe-inline'` in `script-src` defeats the primary purpose of a CSP, which is to ensure only trusted, external script files are executed.
**Prevention:** When configuring a Content-Security-Policy (CSP) header, ensure the `script-src` directive strictly uses `'self'` (or specific trusted domains/nonces) and explicitly avoids `'unsafe-inline'` to effectively mitigate Cross-Site Scripting (XSS) vulnerabilities.

## 2024-05-28 - Split Rate Limiter into Checker and Tracker

**Vulnerability:** The global authentication rate limiter indiscriminately tracked any `401 Unauthorized` response on any `/api/admin/*` endpoint. This could cause a self-inflicted DoS if a legitimate admin's token expired and they made concurrent requests to non-login endpoints. Previous attempts to fix this by checking `req.path === '/verify'` or moving the middleware introduced severe rate-limit bypass vulnerabilities due to Express's handling of `req.path` and trailing slashes.
**Learning:** Checking `req.path` inside globally mounted middleware is prone to routing nuances and query string/trailing slash bypasses. Furthermore, modifying the mount scope of middleware changes the value of `req.path`.
**Prevention:** To implement rate limiting on authentication securely without risking a self-inflicted DoS or a bypass, separate the logic into two middlewares: a global `Checker` that enforces the lockout across all endpoints, and a route-specific `Tracker` attached only to the login endpoint (e.g. `app.post('/api/admin/verify')`) that specifically tracks and increments the failed attempt count.

## 2025-02-23 - Session Token Implementation over Plaintext Return

**Vulnerability:** The application's login endpoint (`/api/admin/verify`) previously returned the plaintext `ADMIN_PASSWORD` directly in the JSON response upon successful login (`res.json({ success: true, token: ADMIN_PASSWORD })`). This created a risk of password exposure if the response was logged or intercepted, and it meant any client-side code saving the token was effectively saving the permanent administrator password.
**Learning:** Returning a static secret/password to the client upon successful authentication violates security best practices, even if the client just provided that secret.
**Prevention:** Rather than returning the password or removing the token field (which breaks frontend API contracts expecting a token), generate a short-lived cryptographically secure session identifier (`crypto.randomBytes(32).toString('hex')`). Store this token in an expiring data structure (like a `Map` with timestamps) and update the verification middleware to accept this token alongside the original password fallback.

## 2025-02-23 - Parallel Execution Rate Limit Bypass

**Vulnerability:** A custom in-memory rate limiter tracked login attempts (`loginAttempts`) by retrieving or defaulting an object (`const record = loginAttempts.get(ip) || { count: 0 }`). If an attacker sent 100 concurrent requests, the `get(ip)` lookup would be undefined for all of them before any single request finished and updated the map. As a result, each request created its own independent `{ count: 0 }` object, incremented it to 1, and eventually overwrote the map's state, entirely bypassing the rate limit logic.
**Learning:** Checking state and deferring the write to an asynchronous callback creates a race condition. In an asynchronous environment like Node.js, multiple requests can execute the initial synchronous lookup phase before the first response completes and persists the state.
**Prevention:** Always persist state immediately (e.g. `loginAttempts.set(ip, record)`) when initializing a new tracking object for rate limiting. This ensures subsequent concurrent requests reference the same object in memory, maintaining correct counter state.

## 2026-06-15 - Missing Input Validation on Maintenance Configuration Endpoints

**Vulnerability:** The `/api/admin/maintenance-config` and `/api/admin/maintenance-config/all` endpoints directly extracted variables (`key`, `value`) from `req.body` and passed them into state-mutating functions (`updateMaintenanceConfig`, `updateAllMaintenanceConfig`) and global state assignments (`MAINTENANCE_MODE = value`) without verifying their type or presence. This allowed potential unexpected behavior (like setting `MAINTENANCE_MODE` to an object or a non-boolean string) and opened the door to simple injection vulnerabilities.
**Learning:** Endpoints that mutate server state or external configuration maps must strictly validate the type and format of their inputs. Assuming `req.body` structure from an Express JSON parser is unsafe because attackers can send arbitrarily nested JSON structures.
**Prevention:** Always enforce strict type checking and input validation (e.g., `typeof key === 'string' && key.trim() !== '' && typeof value === 'boolean'`) on API endpoints, especially those that mutate server state or configurations, before passing inputs to internal functions.
