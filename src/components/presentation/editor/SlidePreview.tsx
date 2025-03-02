
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  title: string;
  content: string;
  image?: string;
}

interface SlidePreviewProps {
  slides: Slide[];
  currentSlide: number;
  handleSlideChange: (direction: "prev" | "next") => void;
  handleSlideTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSlideContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  downloadUrl: string;
  sidebarOpen: boolean;
}

const SlidePreview: React.FC<SlidePreviewProps> = ({
  slides,
  currentSlide,
  handleSlideChange,
  handleSlideTitleChange,
  handleSlideContentChange,
  downloadUrl,
  sidebarOpen,
}) => {
  return (
    <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-0 opacity-50 md:opacity-100' : 'opacity-100'} md:opacity-100`}>
      <div className="flex-1 p-2 sm:p-4 md:p-8 flex items-center justify-center bg-secondary/30 overflow-y-auto">
        {downloadUrl ? (
          <div className="w-full max-w-4xl aspect-[16/9] bg-white rounded-lg shadow-lg overflow-hidden">
            <iframe 
              src={downloadUrl} 
              className="w-full h-full" 
              title="PowerPoint Presentation Preview"
            ></iframe>
          </div>
        ) : (
          <div className="w-full max-w-4xl aspect-[16/9] bg-white rounded-lg shadow-lg p-4 sm:p-8 md:p-16 flex flex-col items-center justify-center text-center">
            <Input
              value={slides[currentSlide]?.title || ""}
              onChange={handleSlideTitleChange}
              className="text-xl sm:text-2xl md:text-3xl font-bold text-center border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto mb-4 sm:mb-8"
            />
            <Textarea
              value={slides[currentSlide]?.content || ""}
              onChange={handleSlideContentChange}
              className="text-base sm:text-lg md:text-xl text-center border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto resize-none"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between p-2 sm:p-4 border-t border-border bg-white">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSlideChange("prev")}
          disabled={currentSlide === 0 || !!downloadUrl}
          className="gap-1"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Previous</span>
        </Button>
        <div className="text-xs sm:text-sm">
          {downloadUrl ? (
            <span className="whitespace-nowrap">PowerPoint Preview</span>
          ) : (
            <span className="whitespace-nowrap">Slide {currentSlide + 1} of {slides.length}</span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSlideChange("next")}
          disabled={currentSlide === slides.length - 1 || !!downloadUrl}
          className="gap-1"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default SlidePreview;
