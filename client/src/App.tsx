import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import router from "./routes/AppRoutes";

function App() {
  const queryClient = new QueryClient();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {/* Toast notifications displayed here */}
      <Toaster position="top-center" />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </div>
  );
}

export default App;
