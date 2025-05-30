import PublicRoute from "@/routes/PublicRoute";
import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import withSuspenseAndErrorBoundary from "@/hocs/withSuspenseAndErrorBoundary";
import EmptyLayout from "@/components/layouts/MainLayout";
import { ROUTES } from "@/constants/routes";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "@/components/layouts/MainLayout";

// Error pages

const NotFound = withSuspenseAndErrorBoundary(
  lazy(() => import("@/components/errorPages/NotFound"))
);
const Error = withSuspenseAndErrorBoundary(
  lazy(() => import("@/components/errorPages/ErrorPage"))
);

const LoginPage = withSuspenseAndErrorBoundary(
  lazy(() => import("@/pages/LoginPage"))
);

const DashboardPage = withSuspenseAndErrorBoundary(
  lazy(() => import("@/pages/DashboardPage"))
);

const router = createBrowserRouter([
  {
    element: <PublicRoute layout={EmptyLayout} restrictedWhenLoggedIn={true} />,
    errorElement: <Error />,
    children: [
      { path: "/", element: <Navigate to={ROUTES.LOGIN} replace /> },
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: ROUTES.NOT_FOUND, element: <NotFound /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    element: <ProtectedRoute layout={MainLayout} />,
    errorElement: <Error />,
    children: [
      { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
