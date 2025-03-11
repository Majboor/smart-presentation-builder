
import React, { useState } from "react";
import PresentationEditor from "@/components/presentation/PresentationEditor";
import PaymentDialog from "@/components/payment/PaymentDialog";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";

const Create = () => {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const { subscription, canCreatePresentation } = useSubscription();

  React.useEffect(() => {
    if (!canCreatePresentation()) {
      setPaymentDialogOpen(true);
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
