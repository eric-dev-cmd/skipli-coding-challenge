export const ROUTES = {
  // Auth
  LOGIN: "/auth/login",

  // Main App
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",

  // Errors
  ERROR: "/error",
  FORBIDDEN: "/forbidden",
  NOT_FOUND: "/not-found",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
