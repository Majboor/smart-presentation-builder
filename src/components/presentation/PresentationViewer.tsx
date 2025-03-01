
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const PresentationViewer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // This would come from an API in a real app
  const [slides] = useState([
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
      navigate(-1);
    }
  };

  return (
    <div 
      className="h-screen w-screen bg-black flex flex-col" 
      tabIndex={0} 
      onKeyDown={handleKeyDown}
      autoFocus
    >
      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-1 bg-white/10 hover:bg-white/20 text-white border-white/20"
        >
          <ArrowLeft size={16} />
          Exit
        </Button>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-6xl aspect-[16/9] bg-white rounded-lg p-16 flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl font-bold mb-10">{slides[currentSlide].title}</h1>
          <div className="text-2xl whitespace-pre-line">
            {slides[currentSlide].content}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between p-4 bg-black/50 text-white">
        <Button
          variant="ghost"
          onClick={() => handleSlideChange("prev")}
          disabled={currentSlide === 0}
          className="text-white hover:bg-white/10"
        >
          <ChevronLeft size={20} />
          Previous
        </Button>
        <div>
          Slide {currentSlide + 1} of {slides.length}
        </div>
        <Button
          variant="ghost"
          onClick={() => handleSlideChange("next")}
          disabled={currentSlide === slides.length - 1}
          className="text-white hover:bg-white/10"
        >
          Next
          <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
};

export default PresentationViewer;
