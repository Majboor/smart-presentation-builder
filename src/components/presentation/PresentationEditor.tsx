import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Layout, ImageIcon, ChevronRight, ChevronLeft, Play, Download, Save, FileDown, ExternalLink, Loader2, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { generatePresentationMarkdown, generatePresentationJson, ensureHttps } from "@/services/presentationApi";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const templatePrompts = {
  Business: "Create a professional business presentation about {topic}. Include sections for executive summary, market analysis, competitive landscape, strategy, implementation plan, and financial projections.",
  Creative: "Design a visually engaging and creative presentation about {topic}. Use metaphors, storytelling elements, and compelling visuals to create an inspiring narrative that captures imagination.",
  Education: "Develop an educational presentation about {topic} suitable for classroom or training environments. Structure it with clear learning objectives, key concepts, examples, practice opportunities, and assessment questions.",
  Minimal: "Create a clean, minimalist presentation about {topic} with concise text, ample white space, and only essential visuals. Focus on key messages with no more than 5 bullet points per slide."
};

const PresentationEditor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("Untitled Presentation");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportType, setExportType] = useState<"markdown" | "json">("markdown");
  const [numSlides, setNumSlides] = useState(5);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [incomingSlides, setIncomingSlides] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [slides, setSlides] = useState<Array<{ title: string; content: string; image?: string }>>([
    {
      title: "Welcome to Your Presentation",
      content: "Created with SlideAI",
      image: "",
    },
  ]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleGeneratePresentation = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a topic or description for your presentation");
      return;
    }

    setLoading(true);
    setIncomingSlides(true);
    
    setTimeout(() => {
      const generatedSlides = [
        {
          title: "Introduction to " + prompt,
          content: "An overview of key concepts and ideas",
          image: "",
        },
        {
          title: "Key Benefits",
          content: "• Improved efficiency\n• Enhanced productivity\n• Better outcomes",
          image: "",
        },
        {
          title: "Implementation Strategy",
          content: "How to successfully implement these ideas in practice",
          image: "",
        },
        {
          title: "Results & Impact",
          content: "Measurable outcomes and long-term benefits",
          image: "",
        },
        {
          title: "Next Steps",
          content: "Action items and recommendations",
          image: "",
        },
      ];

      setSlides(generatedSlides);
      setTitle(prompt);
      setLoading(false);
      setIncomingSlides(false);
      setCurrentSlide(0);
      toast.success("Presentation generated successfully!");
    }, 2000);
  };

  const handleExportPowerPoint = async () => {
    try {
      setExportLoading(true);
      
      let finalPrompt = prompt;
      if (selectedTemplate && templatePrompts[selectedTemplate as keyof typeof templatePrompts]) {
        finalPrompt = templatePrompts[selectedTemplate as keyof typeof templatePrompts].replace("{topic}", prompt);
      }
      
      const request = {
        topic: finalPrompt,
        num_slides: numSlides
      };
      
      let response;
      if (exportType === "markdown") {
        response = await generatePresentationMarkdown(request);
      } else {
        response = await generatePresentationJson(request);
      }
      
      console.log("Download URL:", response.download_url);
      setDownloadUrl(response.download_url);
      toast.success("Presentation export successful! Click the link to open your presentation.");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export presentation. Please try again.");
    } finally {
      setExportLoading(false);
    }
  };

  const handleSlideChange = (direction: "prev" | "next") => {
    if (direction === "prev" && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else if (direction === "next" && currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
  };

  const handleSlideContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const updatedSlides = [...slides];
    updatedSlides[currentSlide] = {
      ...updatedSlides[currentSlide],
      content: newContent,
    };
    setSlides(updatedSlides);
  };

  const handleSlideTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    const updatedSlides = [...slides];
    updatedSlides[currentSlide] = {
      ...updatedSlides[currentSlide],
      title: newTitle,
    };
    setSlides(updatedSlides);
  };

  const handleSavePresentation = () => {
    toast.success("Presentation saved successfully!");
  };

  const handlePresentationMode = () => {
    const presentationId = "demo";
    navigate(`/present/${presentationId}`, { state: { slides, title } });
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    toast.success(`${template} template selected`);
  };

  return (
    <div className="min-h-screen bg-secondary/20 flex flex-col">
      <header className="bg-white border-b border-border px-4 sm:px-6 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="rounded-full"
            >
              <a href="/">
                <ChevronLeft size={18} />
              </a>
            </Button>
            <Input
              value={title}
              onChange={handleTitleChange}
              className="text-base sm:text-lg font-medium border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto max-w-[140px] sm:max-w-xs"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSavePresentation} className="gap-1 hidden sm:flex">
              <Save size={16} />
              <span className="hidden sm:inline">Save</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={handlePresentationMode}
            >
              <Play size={16} />
              <span className="hidden sm:inline">Present</span>
            </Button>
            <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download size={16} />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Export Presentation</DialogTitle>
                  <DialogDescription>
                    Generate a PowerPoint presentation based on your current content.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="export-type" className="text-right">
                      Export Format
                    </Label>
                    <select 
                      id="export-type" 
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                      value={exportType}
                      onChange={(e) => setExportType(e.target.value as "markdown" | "json")}
                    >
                      <option value="markdown">Fast</option>
                      <option value="json">Precise</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="num-slides" className="text-right">
                      Number of Slides
                    </Label>
                    <Input
                      id="num-slides"
                      type="number"
                      min="1"
                      max="20"
                      value={numSlides}
                      onChange={(e) => setNumSlides(parseInt(e.target.value))}
                      className="col-span-3"
                    />
                  </div>
                  {selectedTemplate && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">
                        Template
                      </Label>
                      <div className="col-span-3">
                        <div className="p-2 bg-muted/50 rounded text-sm">
                          Using {selectedTemplate} template
                        </div>
                      </div>
                    </div>
                  )}
                  {downloadUrl && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">
                        Presentation
                      </Label>
                      <div className="col-span-3">
                        <Button asChild variant="default" className="w-full">
                          <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                            <ExternalLink size={16} />
                            Open Presentation
                          </a>
                        </Button>
                      </div>
                    </div>
                  )}
                  {downloadUrl && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">
                        Direct Link
                      </Label>
                      <div className="col-span-3">
                        <div className="flex items-center gap-2">
                          <Input value={downloadUrl} readOnly className="text-xs" />
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => {
                              navigator.clipboard.writeText(downloadUrl);
                              toast.success("URL copied to clipboard!");
                            }}
                          >
                            <ExternalLink size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button 
                    type="submit" 
                    onClick={handleExportPowerPoint}
                    disabled={exportLoading}
                  >
                    {exportLoading ? "Generating..." : "Generate PowerPoint"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
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
              
              <TabsContent value="generate" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    What's your presentation about?
                  </label>
                  <div className="relative">
                    <Textarea
                      placeholder="E.g. A marketing plan for our new product launch"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-32 resize-none pr-10"
                    />
                    <Sparkles
                      size={18}
                      className="absolute right-3 top-3 text-muted-foreground"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleGeneratePresentation}
                    className="flex-1 gap-1"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        Generate presentation
                        <Sparkles size={16} />
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setExportDialogOpen(true)}
                    className="gap-1"
                  >
                    <Download size={16} />
                    Export
                  </Button>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-medium mb-3">Templates</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(templatePrompts).map((template, index) => (
                      <Button
                        key={index}
                        variant={selectedTemplate === template ? "default" : "outline"}
                        size="sm"
                        className="h-auto py-2 justify-start"
                        onClick={() => handleTemplateSelect(template)}
                      >
                        {template}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="slides" className="space-y-4">
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
              </TabsContent>
              
              <TabsContent value="design" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium mb-1">Theme</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {["Modern", "Classic", "Vibrant", "Minimal", "Bold", "Elegant"].map(
                      (theme, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="h-auto py-2 justify-start"
                        >
                          {theme}
                        </Button>
                      )
                    )}
                  </div>
                </div>
                
                <div className="space-y-1 pt-4 border-t border-border">
                  <h3 className="text-sm font-medium mb-3">Layout</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="h-auto py-1.5 justify-start gap-2">
                      <Layout size={16} />
                      Full
                    </Button>
                    <Button variant="outline" size="sm" className="h-auto py-1.5 justify-start gap-2">
                      <Layout size={16} />
                      Split
                    </Button>
                    <Button variant="outline" size="sm" className="h-auto py-1.5 justify-start gap-2">
                      <ImageIcon size={16} />
                      Image Left
                    </Button>
                    <Button variant="outline" size="sm" className="h-auto py-1.5 justify-start gap-2">
                      <ImageIcon size={16} />
                      Image Right
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

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
      </div>
    </div>
  );
};

export default PresentationEditor;
