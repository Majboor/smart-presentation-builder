
import React, { useState } from "react";
import { createPayment } from "@/services/paymentService";
import { useSubscription } from "@/hooks/useSubscription";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface PaymentDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { setPaidStatus } = useSubscription();
  
  // Convert 14 USD to the equivalent in AED cents (approx. 51.41 AED * 100)
  const SUBSCRIPTION_AMOUNT = 5141.5;
  
  const handlePayment = async () => {
    try {
      setLoading(true);
      const response = await createPayment(SUBSCRIPTION_AMOUNT);
      
      // Open payment link in a new tab
      window.open(response.payment_link, '_blank');
      
      // In a real app, we would check the payment status using the reference
      // For demo purposes, we'll just assume payment was successful after a delay
      setTimeout(() => {
        setPaidStatus();
        setOpen(false);
        toast.success("Payment successful! You now have unlimited access.");
      }, 5000);
      
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment processing failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upgrade to Unlimited Access</DialogTitle>
          <DialogDescription>
            You've used your free presentation. Upgrade to our Starter package for unlimited presentations.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
          <div className="bg-secondary/50 p-6 rounded-lg text-center">
            <h3 className="text-xl font-bold">Starter Package</h3>
            <div className="text-3xl font-bold my-3">$14<span className="text-sm font-normal text-muted-foreground">/month</span></div>
            <ul className="text-sm space-y-2 text-left ml-4 mb-4">
              <li>✓ Unlimited presentations</li>
              <li>✓ All templates included</li>
              <li>✓ Premium export formats</li>
              <li>✓ Priority support</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handlePayment} disabled={loading} className="gap-2">
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard size={16} />
                Subscribe Now
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
