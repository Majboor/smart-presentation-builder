
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export const useAuthCheck = () => {
  const { user } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);

  const checkAuth = (): boolean => {
    if (!user && !hasPrompted) {
      setShowLoginPrompt(true);
      setHasPrompted(true);
      return false;
    }
    return !!user;
  };

  // Reset hasPrompted when user changes
  useEffect(() => {
    if (user) {
      setHasPrompted(false);
      setShowLoginPrompt(false);
    }
  }, [user]);

  return { 
    isAuthenticated: !!user, 
    checkAuth, 
    showLoginPrompt, 
    setShowLoginPrompt 
  };
};
