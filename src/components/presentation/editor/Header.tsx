
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Save, Play, Download, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSavePresentation: () => void;
  handlePresentationMode: () => void;
  setExportDialogOpen: (open: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  handleTitleChange,
  handleSavePresentation,
  handlePresentationMode,
  setExportDialogOpen,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const navigate = useNavigate();

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-border px-4 sm:px-6 py-3 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={handleHomeClick}
            type="button"
          >
            <ChevronLeft size={18} />
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
            type="button"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSavePresentation} className="gap-1 hidden sm:flex" type="button">
            <Save size={16} />
            <span className="hidden sm:inline">Save</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={handlePresentationMode}
            type="button"
          >
            <Play size={16} />
            <span className="hidden sm:inline">Present</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => setExportDialogOpen(true)}
            type="button"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
