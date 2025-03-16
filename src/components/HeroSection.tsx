
import React from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import LoginPromptModal from "@/components/auth/LoginPromptModal";

const HeroSection = () => {
  const navigate = useNavigate();
  const { checkAuth, showLoginPrompt, setShowLoginPrompt } = useAuthCheck();

  const handleCreateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (checkAuth()) {
      navigate("/create");
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-32 md:py-40 overflow-hidden">
      {/* Background gradient element */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[40%] -right-[10%] w-[80%] h-[80%] rounded-full bg-secondary/50 blur-3xl" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-secondary/50 blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
        <div className="inline-block px-4 py-1.5 rounded-full bg-secondary text-muted-foreground text-sm font-medium mb-6 animate-slide-down">
          Intelligent presentation creation
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
          Create stunning presentations with the power of AI
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Turn your ideas into professional, visually captivating presentations in seconds. 
          No design skills required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button onClick={handleCreateClick} size="lg" className="group">
            <span className="flex items-center gap-1">
              Create your presentation
              <ChevronRight
                size={16}
                className="ml-1 transition-transform group-hover:translate-x-1"
              />
            </span>
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              if (checkAuth()) {
                navigate("/templates");
              }
            }}
            size="lg"
            variant="outline"
            className="hover:bg-secondary/80"
          >
            View templates
          </Button>
        </div>
      </div>

      {/* Preview mockup */}
      <div className="relative w-full max-w-6xl mt-24 md:mt-32 glass-effect rounded-lg shadow-xl overflow-hidden animate-slide-up">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 pointer-events-none"></div>
        <div className="h-[400px] md:h-[500px] bg-secondary/40 p-6 flex items-center justify-center">
          <div className="text-muted-foreground text-lg font-medium">
            Presentation preview
          </div>
        </div>
      </div>

      {/* Login Prompt Modal */}
      <LoginPromptModal 
        open={showLoginPrompt} 
        setOpen={setShowLoginPrompt} 
      />
    </section>
  );
};

export default HeroSection;
