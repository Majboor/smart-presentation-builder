
import React, { useState, useEffect } from "react";
import { createPayment, verifyPayment } from "@/services/paymentService";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PaymentDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { setPaidStatus } = useSubscription();
  const { user } = useAuth();
  
  // Set amount to exactly 5141 AED cents
  const SUBSCRIPTION_AMOUNT = 5141;
  
  // Check for payment verification on component mount
  useEffect(() => {
    const checkPayment = async () => {
      if (!user) return;
      
      // Get URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const success = urlParams.get('success');
      
      // If success parameter exists, verify the payment
      if (success) {
        setLoading(true);
        
        try {
          // For security, we would use the backend verification, but for now let's use the client-side check
          const isSuccessful = await verifyPayment(urlParams);
          
          if (isSuccessful) {
            await setPaidStatus();
            toast.success("Payment successful! You now have unlimited access.");
            
            // Clean up the URL parameters
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          } else {
            toast.error("Payment verification failed. Please try again or contact support.");
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          toast.error("Error verifying payment. Please contact support.");
        } finally {
          setLoading(false);
          setOpen(false);
        }
      }
    };
    
    checkPayment();
  }, [user]);
  
  const handlePayment = async () => {
    if (!user) {
      toast.error("You must be logged in to make a payment");
      return;
    }
    
    try {
      setLoading(true);
      
      // Create a redirect URL with the current origin
      const redirectUrl = `${window.location.origin}${window.location.pathname}`;
      
      const response = await createPayment(SUBSCRIPTION_AMOUNT, redirectUrl);
      
      // Open payment URL in the same window
      window.location.href = response.payment_url;
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment processing failed. Please try again.");
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
