
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LogIn } from "lucide-react";

interface LoginPromptModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  description?: string;
}

const LoginPromptModal: React.FC<LoginPromptModalProps> = ({
  open,
  setOpen,
  title = "Authentication Required",
  description = "You need to be logged in to use this feature.",
}) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    setOpen(false);
    navigate("/auth");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Please sign in or create an account to continue using all features of SlideAI.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleLogin} className="gap-2">
            <LogIn size={16} />
            Log in
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginPromptModal;
