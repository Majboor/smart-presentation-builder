
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Create from "./pages/Create";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import PresentationViewer from "./components/presentation/PresentationViewer";
import { AuthProvider } from "./contexts/AuthContext";
import PaymentSuccess from "./pages/PaymentSuccess";

const queryClient = new QueryClient();

// Route guard component to protect routes that require authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Get auth state from localStorage for initial render to avoid flickering
  const sessionStr = localStorage.getItem('supabase.auth.token');
  const hasSession = !!sessionStr;

  if (!hasSession) {
    // Instead of redirecting to /auth, return the Navigate component
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner position="top-center" closeButton />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/account" 
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create" 
              element={
                <ProtectedRoute>
                  <Create />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/present/:id" 
              element={
                <ProtectedRoute>
                  <PresentationViewer />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/payment-success" 
              element={
                <ProtectedRoute>
                  <PaymentSuccess />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
