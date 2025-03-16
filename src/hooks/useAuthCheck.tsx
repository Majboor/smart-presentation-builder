
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export const useAuthCheck = () => {
  const { user } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const checkAuth = (): boolean => {
    if (!user) {
      setShowLoginPrompt(true);
      return false;
    }
    return true;
  };

  return { 
    isAuthenticated: !!user, 
    checkAuth, 
    showLoginPrompt, 
    setShowLoginPrompt 
  };
};
