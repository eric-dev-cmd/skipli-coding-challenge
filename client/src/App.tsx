import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

import router from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  // Initialize React Query client (singleton for the app)
  const queryClient = new QueryClient();

  return (
    <AuthProvider>
      {/* Global toast notifications */}
      <Toaster position="top-center" />

      {/* React Query Provider */}
      <QueryClientProvider client={queryClient}>
        {/* React Router Provider */}
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
