import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brush, Sparkles, Film, ArrowRight } from "lucide-react";

import sketchImg from "../../assets/demo/sketch.png";
import refinedImg from "../../assets/demo/refined.png";
import videoImg from "../../assets/demo/video.png";

const steps = [
  {
    id: "sketch",
    label: "Simple Sketch",
    icon: Brush,
    image: sketchImg,
    description: "Start with a rough sketch. Draw your concept quickly on the infinite canvas.",
    color: "bg-gray-100 text-gray-600",
  },
  {
    id: "refined",
    label: "Polished Art",
    icon: Sparkles,
    image: refinedImg,
    description: "AI finishes your drawing. Our engine transforms your lines into production-quality art.",
    color: "bg-brand-pink/10 text-brand-pink",
  },
  {
    id: "video",
    label: "Video Clip",
    icon: Film,
    image: videoImg,
    description: "Motion from stillness. Instantly generate a cinematic video loop from your static scene.",
    color: "bg-violet-100 text-violet-600",
  },
];

export const InstantAnimation = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-8 items-center justify-center max-w-6xl mx-auto">
      {/* Steps Indicator */}
      <div className="flex flex-col gap-4 w-full md:w-1/3">
        {steps.map((step, index) => {
          const isActive = index === activeStep;
          const Icon = step.icon;
          return (
            <motion.div
              key={step.id}
              onClick={() => setActiveStep(index)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                isActive
                  ? "border-brand-pink bg-white shadow-lg scale-105"
                  : "border-transparent hover:bg-white/50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${step.color}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <h4
                    className={`font-bold text-lg ${
                      isActive ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </h4>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>
              </div>
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="w-1 h-full absolute left-0 top-0 bg-brand-pink rounded-l-2xl"
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Visual Display */}
      <div className="w-full md:w-2/3 aspect-video relative rounded-3xl overflow-hidden shadow-2xl shadow-indigo-200/50 border border-white/50 bg-white">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeStep}
            src={steps[activeStep].image}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Overlay Label */}
        <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
             <span className="font-bold text-sm text-gray-800">
                {steps[activeStep].label} Mode
             </span>
        </div>
      </div>
    </div>
  );
};
