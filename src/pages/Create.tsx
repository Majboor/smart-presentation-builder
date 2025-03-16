
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PresentationEditor from "@/components/presentation/PresentationEditor";
import PaymentDialog from "@/components/payment/PaymentDialog";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Create = () => {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const { subscription, canCreatePresentation } = useSubscription();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      toast.error("Please log in to create presentations");
      navigate("/auth");
      return;
    }

    // Check on component mount if the user can create a presentation
    if (!canCreatePresentation()) {
      setPaymentDialogOpen(true);
      toast.info("You've used your free trial. Please subscribe for unlimited access.");
    }
  }, [canCreatePresentation, user, navigate]);

  // Return null during redirect to prevent rendering the editor
  if (!user) {
    return null;
  }

  return (
    <>
      <PresentationEditor />
      <PaymentDialog open={paymentDialogOpen} setOpen={setPaymentDialogOpen} />
    </>
  );
};

export default Create;
