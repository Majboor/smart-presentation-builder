
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import SidebarGenerate from "./SidebarGenerate";
import SidebarSlides from "./SidebarSlides";
import SidebarDesign from "./SidebarDesign";

interface Slide {
  title: string;
  content: string;
  image?: string;
}

interface SidebarProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  loading: boolean;
  handleGeneratePresentation: () => void;
  setExportDialogOpen: (open: boolean) => void;
  selectedTemplate: string | null;
  handleTemplateSelect: (template: string) => void;
  templatePrompts: Record<string, string>;
  slides: Slide[];
  currentSlide: number;
  setCurrentSlide: (index: number) => void;
  incomingSlides: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  prompt,
  setPrompt,
  loading,
  handleGeneratePresentation,
  setExportDialogOpen,
  selectedTemplate,
  handleTemplateSelect,
  templatePrompts,
  slides,
  currentSlide,
  setCurrentSlide,
  incomingSlides,
  sidebarOpen,
}) => {
  return (
    <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 absolute md:relative z-10 md:z-0 w-full md:w-80 h-[calc(100vh-56px)] border-r border-border bg-white overflow-y-auto`}>
      <div className="p-4">
        <Tabs defaultValue="generate">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="generate" className="flex-1">
              Generate
            </TabsTrigger>
            <TabsTrigger value="slides" className="flex-1 relative">
              Slides
              {incomingSlides && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/80 text-primary-foreground text-xs font-medium rounded-md">
                  <Loader2 size={14} className="mr-1 animate-spin" />
                  Incoming
                </div>
              )}
            </TabsTrigger>
            <TabsTrigger value="design" className="flex-1">
              Design
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate">
            <SidebarGenerate 
              prompt={prompt}
              setPrompt={setPrompt}
              loading={loading}
              handleGeneratePresentation={handleGeneratePresentation}
              setExportDialogOpen={setExportDialogOpen}
              selectedTemplate={selectedTemplate}
              handleTemplateSelect={handleTemplateSelect}
              templatePrompts={templatePrompts}
            />
          </TabsContent>
          
          <TabsContent value="slides">
            <SidebarSlides 
              slides={slides}
              currentSlide={currentSlide}
              setCurrentSlide={setCurrentSlide}
              incomingSlides={incomingSlides}
            />
          </TabsContent>
          
          <TabsContent value="design">
            <SidebarDesign />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Sidebar;
