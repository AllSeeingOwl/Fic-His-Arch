export function resolvePath(path) {
  // Use astro's import.meta.env if available (in client/astro files),
  // otherwise fallback to a hardcoded base or process.env for Node contexts
  const base = typeof import.meta !== 'undefined' && import.meta.env
    ? (import.meta.env.BASE_URL || '/Fic-His-Arch/')
    : '/Fic-His-Arch/';

  const cleanBase = base === '/' ? '' : (base.endsWith('/') ? base.slice(0, -1) : base);
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // If the path already has the base, don't double it up
  if (cleanBase && cleanPath.startsWith(cleanBase)) {
      return cleanPath;
  }

  return `${cleanBase}${cleanPath}`;
}
