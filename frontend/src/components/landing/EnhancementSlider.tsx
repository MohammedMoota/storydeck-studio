import { useState, useRef } from "react";
import { MoveHorizontal } from "lucide-react";

interface EnhancementSliderProps {
  beforeImage: string;
  afterImage: string;
}

export const EnhancementSlider: React.FC<EnhancementSliderProps> = ({ beforeImage, afterImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };
  
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };

  return (
    <div 
      className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden cursor-crosshair shadow-2xl shadow-indigo-200/50 border border-white/50"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* After Image (Background) */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${afterImage})` }}
      />
      
      {/* Before Image (Clipped) */}
      <div 
        className="absolute inset-0 bg-cover bg-center border-r-2 border-white"
        style={{ 
          backgroundImage: `url(${beforeImage})`,
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
        }}
      />
      
      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg transform active:scale-95 transition-transform">
          <MoveHorizontal className="w-4 h-4 text-gray-600" />
        </div>
      </div>
      
      {/* Labels */}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white z-10 pointer-events-none">Original</div>
      <div className="absolute bottom-4 right-4 bg-brand-pink/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white z-10 pointer-events-none">Enhanced</div>
    </div>
  );
};
