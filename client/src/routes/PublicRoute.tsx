import EmptyLayout from "@/components/layouts/MainLayout";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

interface PublicRouteProps {
  redirectPath?: string;
  layout?: React.ComponentType<{ children: React.ReactNode }> | null;
  restrictedWhenLoggedIn?: boolean;
}

const PublicRoute: React.FC<PublicRouteProps> = ({
  redirectPath = ROUTES.DASHBOARD,
  layout: Layout = EmptyLayout,
  restrictedWhenLoggedIn = false,
}) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated && restrictedWhenLoggedIn) {
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

export default PublicRoute;
