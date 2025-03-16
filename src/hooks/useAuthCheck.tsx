
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const useAuthCheck = () => {
  const { user } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const navigate = useNavigate();

  const checkAuth = (): boolean => {
    if (!user) {
      setShowLoginPrompt(true);
      // Don't automatically navigate - just show the login prompt
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
