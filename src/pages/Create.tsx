
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
    // Only check subscription status and show dialog if:
    // 1. User is authenticated
    // 2. We have subscription data
    // 3. They've already used their free trial (presentations_generated > 0)
    // 4. They can't create a presentation (not on paid plan)
    // 5. We haven't already shown the payment dialog in this session
    if (
      user && 
      subscription && 
      subscription.presentations_generated > 0 && 
      !canCreatePresentation() && 
      !hasDisplayedPaymentPrompt
    ) {
      // Set this first to prevent multiple dialogs
      setHasDisplayedPaymentPrompt(true);
      setPaymentDialogOpen(true);
      
      // Only show this toast once
      toast.info("You've used your free trial. Please subscribe for unlimited access.", {
        id: "free-trial-used-toast", // Add an ID to prevent duplicate toasts
      });
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
