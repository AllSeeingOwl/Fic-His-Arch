// Sentry error reporting for the browser.
// PUBLIC_SENTRY_DSN is read at build time: the Render build sets it, while
// GitHub Pages and local builds don't, so they never load Sentry at all.
export async function initSentry(): Promise<void> {
  const dsn = import.meta.env.PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  const Sentry = await import('@sentry/browser');
  Sentry.init({
    dsn,
    environment: import.meta.env.PUBLIC_SENTRY_ENVIRONMENT || 'production',
    // Sentry v11 collects user info (including IP addresses), cookies, headers,
    // query strings and request bodies by default. All of it stays out of Sentry.
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: false,
      httpBodies: [],
      urlQueryParams: false,
    },
  });
}
