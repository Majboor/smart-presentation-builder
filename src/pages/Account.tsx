import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, User, CreditCard, Crown, Calendar, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import PaymentDialog from "@/components/payment/PaymentDialog";
import { Badge } from "@/components/ui/badge";

const Account = () => {
  const { user, loading: authLoading } = useAuth();
  const { subscription, loading: subLoading } = useSubscription();
  const [paymentDialogOpen, setPaymentDialogOpen] = React.useState(false);
  
  const isPremium = subscription?.status === 'paid';
  const isLoading = authLoading || subLoading;

  const handleSubscribe = () => {
    setPaymentDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container max-w-4xl mx-auto px-4 pt-32 pb-16">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
        
        <div className="space-y-8">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Your basic account information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Email:</span>
                  <p>{user?.email}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Account created:</span>
                  <p>{user?.created_at ? format(new Date(user.created_at), 'MMMM dd, yyyy') : 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Subscription Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isPremium ? (
                  <Crown className="h-5 w-5 text-amber-500" />
                ) : (
                  <CreditCard className="h-5 w-5 text-primary" />
                )}
                Subscription Details
                {isPremium && (
                  <Badge className="ml-2 bg-amber-100 text-amber-800 border-amber-300">
                    Premium
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Your current plan and subscription status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 rounded-lg border bg-background">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {isPremium ? "Starter Package" : "Free Trial"}
                      </h3>
                      <p className="text-muted-foreground mt-1">
                        {isPremium 
                          ? "Unlimited presentations and premium features" 
                          : "Create 1 presentation for free"}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xl">
                        {isPremium ? "$14" : "$0"}
                        {isPremium && <span className="text-sm font-normal text-muted-foreground">/month</span>}
                      </div>
                      {subscription && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>
                            {subscription.created_at ? 
                              `Started on ${format(new Date(subscription.created_at), 'MMM dd, yyyy')}` : 
                              'N/A'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className={`h-5 w-5 mt-0.5 ${isPremium ? 'text-amber-500' : 'text-primary'}`} />
                    <div>
                      <span className="font-medium">Presentations</span>
                      <p className="text-muted-foreground">
                        {isPremium 
                          ? "Unlimited presentations" 
                          : `${subscription?.presentations_generated || 0}/1 presentations used`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <CheckCircle className={`h-5 w-5 mt-0.5 ${isPremium ? 'text-amber-500' : 'text-muted-foreground'}`} />
                    <div>
                      <span className="font-medium">Premium Templates</span>
                      <p className="text-muted-foreground">
                        {isPremium 
                          ? "Access to all premium templates" 
                          : "Upgrade to access premium templates"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <CheckCircle className={`h-5 w-5 mt-0.5 ${isPremium ? 'text-amber-500' : 'text-muted-foreground'}`} />
                    <div>
                      <span className="font-medium">Export Options</span>
                      <p className="text-muted-foreground">
                        {isPremium 
                          ? "All export formats available" 
                          : "Limited export formats"}
                      </p>
                    </div>
                  </div>
                </div>
                
                {!isPremium && (
                  <Button onClick={handleSubscribe} className="w-full gap-2">
                    <CreditCard size={16} />
                    Upgrade to Premium
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
      <PaymentDialog open={paymentDialogOpen} setOpen={setPaymentDialogOpen} />
    </div>
  );
};

export default Account;
