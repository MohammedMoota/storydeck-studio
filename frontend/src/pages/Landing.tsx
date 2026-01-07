import { Theme } from "@radix-ui/themes";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import { InstantAnimation } from "../components/landing/InstantAnimation";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Sparkles, Film } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <Theme>
      <div className="relative min-h-screen bg-white text-gray-900 overflow-hidden font-inter selection:bg-brand-pink/20">
        
        {/* Prismatic Background Blurs */}
        <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-brand-pink/20 rounded-full blur-[100px] opacity-40 animate-pulse"></div>
            <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-violet-400/20 rounded-full blur-[120px] opacity-30"></div>
        </div>

        <div className="relative z-10">
          <Navbar />
          
          <main className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
            {/* Hero Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm mb-6"
              >
                <div className="w-2 h-2 rounded-full bg-brand-pink animate-pulse"></div>
                <span className="text-sm font-bold tracking-wide text-gray-500 uppercase">Radiant Studio 2.0</span>
              </motion.div>
              
              <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6 text-gray-900">
                Enhance. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink via-violet-400 to-sky-400">
                  Re-Imagine.
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                The all-in-one creative studio for upgrading your visuals. 
                Turn images into stories and sketches into cinema.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                
              </div>
            </motion.div>

            {/* Feature 1: Instant Animation Showcase */}
            <div className="mb-32">
                 <div className="text-center mb-12">
                    <div className="w-12 h-12 rounded-2xl bg-brand-pink/10 flex items-center justify-center mx-auto mb-4 text-brand-pink">
                        <Sparkles size={24} />
                    </div>
                    <h2 className="text-4xl font-bold mb-4">From Sketch to Cinema</h2>
                    <p className="text-gray-500 text-lg">Draw a rough idea, and watch StoryDeck turn it into a polised video instantly.</p>
                 </div>
                 
                 <InstantAnimation />
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <motion.div 
                 whileHover={{ y: -5 }}
                 className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50 relative overflow-hidden group"
               >
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Zap size={120} />
                  </div>
                  <div className="relative z-10">
                     <div className="w-12 h-12 rounded-xl bg-brand-pink/10 text-brand-pink flex items-center justify-center mb-6">
                        <Zap size={24} />
                     </div>
                     <h3 className="text-3xl font-bold mb-3">Instant Animation</h3>
                     <p className="text-gray-500 mb-6">Bring static images to life with our motion engine. Liquid smooth transitions automatically generated.</p>
                     <div className="h-48 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                        <span className="text-gray-400 font-medium">Motion Preview UI</span>
                     </div>
                  </div>
               </motion.div>

               <motion.div 
                 whileHover={{ y: -5 }}
                 className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50 relative overflow-hidden group"
               >
                   <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Film size={120} />
                  </div>
                  <div className="relative z-10">
                     <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-6">
                        <Film size={24} />
                     </div>
                     <h3 className="text-3xl font-bold mb-3">Video Synthesis</h3>
                     <p className="text-gray-500 mb-6">Merge clips, add sound, and export in cinematic quality directly from the browser.</p>
                     <div className="h-48 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                        <span className="text-gray-400 font-medium">Timeline UI</span>
                     </div>
                  </div>
               </motion.div>
            </div>
            
          </main>
          <Footer />
        </div>
      </div>
    </Theme>
  );
}

export default Landing;
