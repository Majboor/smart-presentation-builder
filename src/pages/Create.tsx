
import React, { useState, useEffect } from "react";
import PresentationEditor from "@/components/presentation/PresentationEditor";
import PaymentDialog from "@/components/payment/PaymentDialog";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Create = () => {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const { subscription, canCreatePresentation } = useSubscription();
  const { user } = useAuth();

  useEffect(() => {
    // Check on component mount if the user can create a presentation
    if (user && !canCreatePresentation()) {
      setPaymentDialogOpen(true);
      toast.info("You've used your free trial. Please subscribe for unlimited access.");
    }
  }, [canCreatePresentation, user]);

  return (
    <>
      <PresentationEditor />
      <PaymentDialog open={paymentDialogOpen} setOpen={setPaymentDialogOpen} />
    </>
  );
};

export default Create;
