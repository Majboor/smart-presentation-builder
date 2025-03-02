
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface ExportDialogProps {
  exportDialogOpen: boolean;
  setExportDialogOpen: (open: boolean) => void;
  exportType: "markdown" | "json";
  setExportType: (type: "markdown" | "json") => void;
  numSlides: number;
  setNumSlides: (num: number) => void;
  selectedTemplate: string | null;
  downloadUrl: string;
  exportLoading: boolean;
  handleExportPowerPoint: () => Promise<void>;
}

const ExportDialog: React.FC<ExportDialogProps> = ({
  exportDialogOpen,
  setExportDialogOpen,
  exportType,
  setExportType,
  numSlides,
  setNumSlides,
  selectedTemplate,
  downloadUrl,
  exportLoading,
  handleExportPowerPoint,
}) => {
  return (
    <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
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
  );
};

export default ExportDialog;
