// ⚡ Bolt: Hoist environment checks and static string normalization to the module level
// to prevent repetitive string manipulation and environment checking on every call to resolvePath.
const base =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.BASE_URL || '/Fic-His-Arch/'
    : '/Fic-His-Arch/';

const cleanBase = base === '/' ? '' : base.endsWith('/') ? base.slice(0, -1) : base;

export function resolvePath(path) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // If the path already has the base, don't double it up
  if (cleanBase && cleanPath.startsWith(cleanBase)) {
    return cleanPath;
  }

  return `${cleanBase}${cleanPath}`;
}
