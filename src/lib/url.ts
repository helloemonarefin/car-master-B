/**
 * Public path for a page: the build writes /protection.html (build.format
 * "file"), but the site is served and linked as /protection.
 * "/index.html" → "/", "/coatings.html" → "/coatings", "/coatings/" → "/coatings".
 */
export function cleanPath(pathname: string): string {
  const p = pathname.replace(/(\/index)?\.html$/, '').replace(/\/+$/, '');
  return p === '' ? '/' : p;
}
