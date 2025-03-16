
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
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if we're sure the user is not authenticated (after loading)
    if (!loading && !user) {
      toast.error("Please log in to create presentations");
      navigate("/auth");
      return;
    }

    // Check on component mount if the user can create a presentation
    // Only after we're sure they're authenticated
    if (!loading && user && !canCreatePresentation()) {
      setPaymentDialogOpen(true);
      toast.info("You've used your free trial. Please subscribe for unlimited access.");
    }
  }, [canCreatePresentation, user, navigate, loading]);

  // Return null during authentication loading or redirect
  if (loading || !user) {
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
