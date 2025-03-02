
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Slide {
  title: string;
  content: string;
  image?: string;
}

interface SidebarSlidesProps {
  slides: Slide[];
  currentSlide: number;
  setCurrentSlide: (index: number) => void;
  incomingSlides: boolean;
}

const SidebarSlides: React.FC<SidebarSlidesProps> = ({
  slides,
  currentSlide,
  setCurrentSlide,
  incomingSlides,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {slides.map((slide, index) => (
          <button
            key={index}
            className={`w-full text-left p-3 rounded-md hover:bg-secondary/50 transition-colors ${
              currentSlide === index ? "bg-secondary" : ""
            }`}
            onClick={() => setCurrentSlide(index)}
          >
            <p className="font-medium truncate">{slide.title}</p>
            <p className="text-xs text-muted-foreground truncate">
              {slide.content.substring(0, 60)}...
            </p>
          </button>
        ))}
      </div>
      <Button className="w-full" variant="outline">
        Add new slide
      </Button>
    </div>
  );
};

export default SidebarSlides;
