import { Navigate, Outlet } from "react-router-dom";
import LoadingFallback from "@/components/loading/LoadingFallback";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import MainLayout from "@/components/layouts/MainLayout";

interface ProtectedRouteProps {
  redirectPath?: string;
  layout?: React.ComponentType<{ children: React.ReactNode }>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = ROUTES.LOGIN,
  layout: Layout = MainLayout,
}) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return Layout ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Outlet />
  );
};

export default ProtectedRoute;
