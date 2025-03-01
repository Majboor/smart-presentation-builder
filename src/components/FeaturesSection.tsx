
import React from "react";
import { Sparkles, Clock, PenTool, PresentationIcon, Wand2 } from "lucide-react";

const features = [
  {
    icon: <Sparkles size={24} className="text-primary" />,
    title: "AI-Powered Content Generation",
    description:
      "Generate professionally written content and beautiful slides from simple prompts."
  },
  {
    icon: <Clock size={24} className="text-primary" />,
    title: "Save Hours of Work",
    description:
      "Create presentation-ready slides in seconds instead of hours."
  },
  {
    icon: <PenTool size={24} className="text-primary" />,
    title: "Pixel-Perfect Design",
    description:
      "Every slide follows modern design principles with perfect typography and spacing."
  },
  {
    icon: <PresentationIcon size={24} className="text-primary" />,
    title: "Ready-to-Use Templates",
    description:
      "Choose from dozens of professionally designed templates for any occasion."
  },
  {
    icon: <Wand2 size={24} className="text-primary" />,
    title: "Intelligent Formatting",
    description:
      "AI automatically organizes your content with optimal visual hierarchy."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-24 px-6 md:px-10 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Create presentations better and faster
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI-powered platform handles the heavy lifting so you can focus on what matters
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-sm border border-border hover-lift"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-secondary rounded-md mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
