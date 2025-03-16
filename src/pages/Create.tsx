
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
  const [hasDisplayedPaymentPrompt, setHasDisplayedPaymentPrompt] = useState(false);

  useEffect(() => {
    // Only check subscription status if the user is authenticated
    // And we haven't already shown the payment dialog
    if (user && subscription && !canCreatePresentation() && !hasDisplayedPaymentPrompt) {
      setPaymentDialogOpen(true);
      setHasDisplayedPaymentPrompt(true);
      toast.info("You've used your free trial. Please subscribe for unlimited access.");
    }
  }, [user, subscription, canCreatePresentation, hasDisplayedPaymentPrompt]);

  return (
    <>
      <PresentationEditor />
      <PaymentDialog 
        open={paymentDialogOpen} 
        setOpen={(open) => {
          setPaymentDialogOpen(open);
          // If dialog is closed, don't immediately reopen it
          if (!open) {
            setHasDisplayedPaymentPrompt(true);
          }
        }} 
      />
    </>
  );
};

export default Create;
