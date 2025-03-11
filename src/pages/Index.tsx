
import React, { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";
import PaymentDialog from "@/components/payment/PaymentDialog";

const Index = () => {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  const handleSubscribe = () => {
    setPaymentDialogOpen(true);
  };

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Navbar onPricingClick={scrollToPricing} />
      <main>
        <HeroSection />
        <FeaturesSection />
        <div ref={pricingRef}>
          <PricingSection onSubscribe={handleSubscribe} />
        </div>
      </main>
      <Footer />
      <PaymentDialog open={paymentDialogOpen} setOpen={setPaymentDialogOpen} />
    </div>
  );
};

export default Index;
