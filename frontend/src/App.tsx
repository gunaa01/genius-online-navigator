
import * as React from "react";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/ThemeProvider";
import RoutesComponent from "./routes";

// Create a client for React Query
const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <Toaster richColors position="top-right" />
        <RoutesComponent />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);

export default App;
