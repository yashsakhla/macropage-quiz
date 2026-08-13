const DARK_PREFIXES = ["/waiting", "/quiz", "/results", "/display"];

/** True for the dark, `bg-tech-grid` participant/display screens; false for the light admin/onboarding screens. */
export function isDarkPage(pathname: string): boolean {
  return DARK_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
