
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Download, Loader2 } from "lucide-react";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { useSubscription } from "@/hooks/useSubscription";
import LoginPromptModal from "@/components/auth/LoginPromptModal";

interface SidebarGenerateProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  loading: boolean;
  handleGeneratePresentation: () => void;
  setExportDialogOpen: (open: boolean) => void;
  selectedTemplate: string | null;
  handleTemplateSelect: (template: string) => void;
  templatePrompts: Record<string, string>;
}

const SidebarGenerate: React.FC<SidebarGenerateProps> = ({
  prompt,
  setPrompt,
  loading,
  handleGeneratePresentation,
  setExportDialogOpen,
  selectedTemplate,
  handleTemplateSelect,
  templatePrompts,
}) => {
  const { checkAuth, showLoginPrompt, setShowLoginPrompt } = useAuthCheck();
  const { canCreatePresentation } = useSubscription();

  const handleGenerate = () => {
    if (checkAuth()) {
      if (!canCreatePresentation()) {
        // If can't create presentation, don't proceed with generation
        return;
      }
      handleGeneratePresentation();
    }
  };

  const handleExport = () => {
    if (checkAuth()) {
      setExportDialogOpen(true);
    }
  };

  // Determine if the generate button should be disabled
  const isGenerateDisabled = loading || !canCreatePresentation();

  return (
    <div className="space-y-4">
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
          onClick={handleGenerate}
          className="flex-1 gap-1"
          disabled={isGenerateDisabled}
          title={!canCreatePresentation() ? "Free trial used. Please subscribe." : ""}
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
          onClick={handleExport}
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
              disabled={!canCreatePresentation()}
              onClick={() => {
                if (checkAuth()) {
                  if (!canCreatePresentation()) {
                    // If can't create presentation, don't proceed with template selection
                    return;
                  }
                  handleTemplateSelect(template);
                }
              }}
            >
              {template}
            </Button>
          ))}
        </div>
      </div>

      {/* Login Prompt Modal */}
      <LoginPromptModal 
        open={showLoginPrompt} 
        setOpen={setShowLoginPrompt} 
      />
    </div>
  );
};

export default SidebarGenerate;
