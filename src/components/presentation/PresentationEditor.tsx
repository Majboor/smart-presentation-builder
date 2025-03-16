
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { generatePresentationMarkdown, generatePresentationJson, ensureHttps } from "@/services/presentationApi";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";

// Import our components
import Header from "./editor/Header";
import Sidebar from "./editor/Sidebar";
import SlidePreview from "./editor/SlidePreview";
import ExportDialog from "./editor/ExportDialog";
import PaymentDialog from "@/components/payment/PaymentDialog";

const templatePrompts = {
  Business: "Create a professional business presentation about {topic}. Include sections for executive summary, market analysis, competitive landscape, strategy, implementation plan, and financial projections.",
  Creative: "Design a visually engaging and creative presentation about {topic}. Use metaphors, storytelling elements, and compelling visuals to create an inspiring narrative that captures imagination.",
  Education: "Develop an educational presentation about {topic} suitable for classroom or training environments. Structure it with clear learning objectives, key concepts, examples, practice opportunities, and assessment questions.",
  Minimal: "Create a clean, minimalist presentation about {topic} with concise text, ample white space, and only essential visuals. Focus on key messages with no more than 5 bullet points per slide."
};

const PresentationEditor = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const { canCreatePresentation, incrementPresentationCount, subscription } = useSubscription();

  const [slides, setSlides] = useState<Array<{ title: string; content: string; image?: string }>>([
    {
      title: "Welcome to Your Presentation",
      content: "Created with SlideAI",
      image: "",
    },
  ]);

  // Only check subscription on mount once, and only show payment dialog if they've
  // already used their free trial (presentations_generated > 0)
  useEffect(() => {
    if (user && subscription && subscription.presentations_generated > 0 && !canCreatePresentation()) {
      setPaymentDialogOpen(true);
    }
  }, [user, subscription, canCreatePresentation]);

  const handleGeneratePresentation = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a topic or description for your presentation");
      return;
    }

    // Only block generation and show payment dialog if they've already used their free trial
    if (subscription && subscription.presentations_generated > 0 && !canCreatePresentation()) {
      setPaymentDialogOpen(true);
      toast.info("You've used your free trial. Please subscribe for unlimited access.");
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
      
      incrementPresentationCount();
      
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
      <Header 
        title={title}
        handleTitleChange={handleTitleChange}
        handleSavePresentation={handleSavePresentation}
        handlePresentationMode={handlePresentationMode}
        setExportDialogOpen={setExportDialogOpen}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          prompt={prompt}
          setPrompt={setPrompt}
          loading={loading}
          handleGeneratePresentation={handleGeneratePresentation}
          setExportDialogOpen={setExportDialogOpen}
          selectedTemplate={selectedTemplate}
          handleTemplateSelect={handleTemplateSelect}
          templatePrompts={templatePrompts}
          slides={slides}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          incomingSlides={incomingSlides}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <SlidePreview 
          slides={slides}
          currentSlide={currentSlide}
          handleSlideChange={handleSlideChange}
          handleSlideTitleChange={handleSlideTitleChange}
          handleSlideContentChange={handleSlideContentChange}
          downloadUrl={downloadUrl}
          sidebarOpen={sidebarOpen}
        />
      </div>

      <ExportDialog 
        exportDialogOpen={exportDialogOpen}
        setExportDialogOpen={setExportDialogOpen}
        exportType={exportType}
        setExportType={setExportType}
        numSlides={numSlides}
        setNumSlides={setNumSlides}
        selectedTemplate={selectedTemplate}
        downloadUrl={downloadUrl}
        exportLoading={exportLoading}
        handleExportPowerPoint={handleExportPowerPoint}
      />

      <PaymentDialog 
        open={paymentDialogOpen}
        setOpen={setPaymentDialogOpen}
      />
    </div>
  );
};

export default PresentationEditor;
