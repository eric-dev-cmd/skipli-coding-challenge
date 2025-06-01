import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

import router from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/auth/AuthProvider";

function App() {
  // Initialize React Query client (singleton for the app)
  const queryClient = new QueryClient();

  return (
    // React Query Provider (singleton for the app)
    <QueryClientProvider client={queryClient}>
      {/* Auth Context Provider */}
      <AuthProvider>
        {/* Global toast notifications */}
        <Toaster position="bottom-right" />

        {/* Router */}
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
