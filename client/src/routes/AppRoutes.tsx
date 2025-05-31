import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import PublicRoute from "@/routes/PublicRoute";
import RestrictedRoute from "./RestrictedRoute";
import withSuspenseAndErrorBoundary from "@/hocs/withSuspenseAndErrorBoundary";

import MainLayout from "@/components/layouts/MainLayout";
import { ROUTES } from "@/constants/routes";

// Lazy-loaded pages wrapped with Suspense and ErrorBoundary
const LoginPage = withSuspenseAndErrorBoundary(
  lazy(() => import("@/pages/LoginPage"))
);
const GithubPage = withSuspenseAndErrorBoundary(
  lazy(() => import("@/pages/GithubPage"))
);
const NotFoundPage = withSuspenseAndErrorBoundary(
  lazy(() => import("@/components/errorPages/NotFound"))
);
const ErrorPage = withSuspenseAndErrorBoundary(
  lazy(() => import("@/components/errorPages/ErrorPage"))
);

// Router configuration
const router = createBrowserRouter([
  {
    element: <PublicRoute layout={MainLayout} />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: ROUTES.HOME,
        element: <GithubPage />,
      },
      {
        path: ROUTES.LOGIN,
        element: (
          <RestrictedRoute>
            <LoginPage />
          </RestrictedRoute>
        ),
      },
      {
        path: ROUTES.NOT_FOUND,
        element: <NotFoundPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
