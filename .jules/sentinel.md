## 2025-02-23 - Hardcoded Admin Default Password

**Vulnerability:** Found `const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';` in `server.ts`. This falls back to a highly guessable password ('admin') if the environment variable is not set. Furthermore, `app.post('/api/admin/verify', ...)` responds with the `ADMIN_PASSWORD` as the token when verification succeeds (`res.json({ success: true, token: ADMIN_PASSWORD });`).
**Learning:** Default fallbacks for sensitive credentials in server code lead to critical vulnerabilities, especially if the code returns this token to the client.
**Prevention:** Remove fallback logic for sensitive credentials. If `process.env.ADMIN_PASSWORD` is not set, the server should either generate a strong random string or refuse to start/fail securely rather than defaulting to 'admin'.

## 2025-02-23 - Express Error Handler Information Leak

**Vulnerability:** The Express error handler `console.error('Unhandled error:', err);` and the HTTP response `res.status(httpErr.status).json({ error: httpErr.message || 'Error' });` might leak sensitive stack traces or internal implementation details if an unexpected error propagates.
**Learning:** Returning `httpErr.message` directly without validating or sanitizing it can inadvertently leak application structure or sensitive server state.
**Prevention:** In a production environment, send a generic error message (e.g., "An unexpected error occurred") and log the detailed error internally.
