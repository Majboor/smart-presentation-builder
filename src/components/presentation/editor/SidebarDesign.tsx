
import React from "react";
import { Button } from "@/components/ui/button";
import { Layout, ImageIcon } from "lucide-react";

const SidebarDesign: React.FC = () => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default SidebarDesign;
