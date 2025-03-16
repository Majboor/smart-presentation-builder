
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { verifyPayment } from "@/services/paymentService";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setPaidStatus } = useSubscription();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Verify the payment using URL parameters
        const isSuccessful = await verifyPayment(searchParams);
        
        if (isSuccessful) {
          // Update the user's subscription status
          await setPaidStatus();
          setStatus("success");
          toast.success("Payment successful! You now have premium access.");
          
          // Redirect to account page after 3 seconds
          setTimeout(() => {
            navigate("/account");
          }, 3000);
        } else {
          setStatus("error");
          toast.error("Payment verification failed. Please try again or contact support.");
        }
      } catch (error) {
        console.error("Payment processing error:", error);
        setStatus("error");
        toast.error("Error processing payment. Please contact support.");
      }
    };

    processPayment();
  }, [searchParams, setPaidStatus, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        {status === "loading" && (
          <>
            <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin mb-4" />
            <h1 className="text-2xl font-bold mb-2">Processing Payment</h1>
            <p className="text-muted-foreground mb-4">
              Please wait while we verify your payment...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-muted-foreground mb-4">
              Your subscription has been activated. You now have access to all premium features.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Redirecting to your account page in a few seconds...
            </p>
            <Button onClick={() => navigate("/account")} className="w-full">
              Go to Account
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't verify your payment. Please try again or contact our support team.
            </p>
            <div className="flex flex-col gap-2">
              <Button onClick={() => navigate("/account")} variant="outline" className="w-full">
                Go to Account
              </Button>
              <Button onClick={() => navigate("/")} className="w-full">
                Return Home
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
