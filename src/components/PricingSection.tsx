
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, CreditCard } from "lucide-react";

interface PricingProps {
  onSubscribe: () => void;
}

const PricingSection: React.FC<PricingProps> = ({ onSubscribe }) => {
  return (
    <section id="pricing" className="py-24 px-6 bg-secondary/20">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
          Get started for free and upgrade when you're ready to create unlimited presentations.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free plan */}
          <div className="border rounded-lg p-8 bg-background shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold">Free Trial</h3>
            <div className="text-3xl font-bold my-4">$0</div>
            <ul className="space-y-3 text-left mb-8">
              <li className="flex items-start gap-2">
                <Check size={18} className="text-primary mt-0.5 shrink-0" />
                <span>1 presentation</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={18} className="text-primary mt-0.5 shrink-0" />
                <span>Basic templates</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={18} className="text-primary mt-0.5 shrink-0" />
                <span>Standard export format</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full">
              Current Plan
            </Button>
          </div>
          
          {/* Paid plan */}
          <div className="border rounded-lg p-8 bg-background shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium py-1 px-3 rounded-bl-lg">
              RECOMMENDED
            </div>
            <h3 className="text-xl font-bold">Starter Package</h3>
            <div className="text-3xl font-bold my-4">$14<span className="text-sm font-normal text-muted-foreground">/month</span></div>
            <ul className="space-y-3 text-left mb-8">
              <li className="flex items-start gap-2">
                <Check size={18} className="text-primary mt-0.5 shrink-0" />
                <span><strong>Unlimited</strong> presentations</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={18} className="text-primary mt-0.5 shrink-0" />
                <span>All premium templates</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={18} className="text-primary mt-0.5 shrink-0" />
                <span>All export formats</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={18} className="text-primary mt-0.5 shrink-0" />
                <span>Priority support</span>
              </li>
            </ul>
            <Button onClick={onSubscribe} className="w-full gap-2">
              <CreditCard size={16} />
              Subscribe Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
