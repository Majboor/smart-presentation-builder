
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

interface SlideType {
  title: string;
  content: string;
  image?: string;
}

const PresentationViewer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Get slides from location state or use default slides
  const [slides, setSlides] = useState<SlideType[]>([]);
  const [title, setTitle] = useState("Presentation");
  
  useEffect(() => {
    // Get data from location state if available
    if (location.state?.slides) {
      setSlides(location.state.slides);
    } else {
      // Default slides if no data is passed
      setSlides([
        {
          title: "Welcome to Your Presentation",
          content: "Created with SlideAI",
        },
        {
          title: "Key Points",
          content: "• First important point\n• Second important point\n• Third important point",
        },
        {
          title: "Data & Analysis",
          content: "This is where you would display charts and data analysis",
        },
        {
          title: "Conclusion",
          content: "Thank you for watching!",
        },
      ]);
    }

    if (location.state?.title) {
      setTitle(location.state.title);
    }
    
    // Set up fullscreen
    const presentationElement = document.getElementById('presentation-container');
    if (presentationElement) {
      presentationElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    }
    
    // Exit fullscreen when component unmounts
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => {
          console.log(`Error attempting to exit fullscreen: ${err.message}`);
        });
      }
    };
  }, [location.state]);

  const handleSlideChange = (direction: "prev" | "next") => {
    if (direction === "prev" && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else if (direction === "next" && currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      handleSlideChange("next");
    } else if (e.key === "ArrowLeft") {
      handleSlideChange("prev");
    } else if (e.key === "Escape") {
      // Let the browser handle exiting fullscreen, then navigate
      setTimeout(() => navigate(-1), 100);
    }
  };

  return (
    <div 
      id="presentation-container"
      className="h-screen w-screen bg-black flex flex-col" 
      tabIndex={0} 
      onKeyDown={handleKeyDown}
      autoFocus
    >
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-1 bg-white/10 hover:bg-white/20 text-white border-white/20"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Exit</span>
        </Button>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl aspect-[16/9] bg-white rounded-lg p-4 sm:p-8 md:p-16 flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6 md:mb-10">{slides[currentSlide]?.title}</h1>
          <div className="text-base sm:text-xl md:text-2xl whitespace-pre-line">
            {slides[currentSlide]?.content}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between p-2 sm:p-4 bg-black/50 text-white">
        <Button
          variant="ghost"
          onClick={() => handleSlideChange("prev")}
          disabled={currentSlide === 0}
          className="text-white hover:bg-white/10"
        >
          <ChevronLeft size={20} />
          <span className="hidden sm:inline">Previous</span>
        </Button>
        <div className="text-xs sm:text-sm">
          {title} - Slide {currentSlide + 1} of {slides.length}
        </div>
        <Button
          variant="ghost"
          onClick={() => handleSlideChange("next")}
          disabled={currentSlide === slides.length - 1}
          className="text-white hover:bg-white/10"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
};

export default PresentationViewer;
