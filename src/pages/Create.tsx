
import React, { useState, useEffect } from "react";
import PresentationEditor from "@/components/presentation/PresentationEditor";
import PaymentDialog from "@/components/payment/PaymentDialog";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";

const Create = () => {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const { subscription, canCreatePresentation } = useSubscription();

  useEffect(() => {
    // Check on component mount if the user can create a presentation
    if (!canCreatePresentation()) {
      setPaymentDialogOpen(true);
      toast.info("You've used your free trial. Please subscribe for unlimited access.");
    }
  }, [canCreatePresentation]);

  return (
    <>
      <PresentationEditor />
      <PaymentDialog open={paymentDialogOpen} setOpen={setPaymentDialogOpen} />
    </>
  );
};

export default Create;
