import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SlideViewerProps {
  slides: string[];
}

export default function SlideViewer({ slides }: SlideViewerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const next = () => setCurrentSlide((s) => Math.min(s + 1, slides.length - 1));
  const prev = () => setCurrentSlide((s) => Math.max(s - 1, 0));

  return (
    <div className="relative">
      <img
        src={slides[currentSlide]}
        alt={`Slide ${currentSlide + 1}`}
        className="w-full aspect-video object-contain"
      />
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <Button variant="outline" size="icon" onClick={prev} disabled={currentSlide === 0}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={next}
          disabled={currentSlide === slides.length - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-center mt-2">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
}
