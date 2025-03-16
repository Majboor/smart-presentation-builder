
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
import { useAuth } from "./contexts/AuthContext";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

// Route guard component to protect routes that require authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  // Show loading indicator while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Redirect to auth page if not logged in
  if (!user) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};

const AppRoutes = () => (
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
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner position="top-center" closeButton />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
