// src/constants/routes.ts

export const ROUTES = {
  // Authentication
  LOGIN: "/auth/login",

  // Main App
  HOME: "/",
  PROFILE: "/profile",

  // Error Handling
  ERROR: "/error",
  NOT_FOUND: "/not-found",
} as const;

export type RouteKey = keyof typeof ROUTES;

export type RoutePath = (typeof ROUTES)[RouteKey];
