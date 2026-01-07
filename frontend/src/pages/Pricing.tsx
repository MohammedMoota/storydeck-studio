import { useState, useEffect, useRef } from "react";
import { Container } from "@radix-ui/themes";
import { Check, Sparkles, Video, Loader2, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import { apiFetch } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Pricing() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState<string | null>(null);
  const [creditsAdded, setCreditsAdded] = useState<number | null>(null);
  const [syncing, setSyncing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    // Check for success query param after payment redirect
    const syncCredits = async () => {
      const success = searchParams.get("success");
      const productId = searchParams.get("product");

      // Only sync if we have both params and haven't synced yet
      if (success === "true" && productId && !hasSyncedRef.current) {
        hasSyncedRef.current = true;
        setSyncing(true);

        try {
          // Call backend to sync credits (verifies payment with Autumn)
          const response = await apiFetch(
            `${backendUrl}/api/autumn/sync-credits?product=${encodeURIComponent(productId)}`,
            { method: "GET" },
          );

          const result = await response.json();
          console.log("Sync result:", result);

          if (response.status === 402 || result.verified === false) {
            // Payment not verified - user didn't complete checkout
            setShowError(
              "Payment not completed. Please complete the checkout to receive credits.",
            );
            setTimeout(() => setShowError(null), 8000);
            return;
          }

          if (result.credits_added) {
            setCreditsAdded(result.credits_added);
          }

          setShowSuccess(true);
        } catch (error) {
          console.error("Failed to sync credits:", error);
          setShowError("Something went wrong. Please try again.");
          setTimeout(() => setShowError(null), 5000);
        } finally {
          setSyncing(false);
          // Clean up the URL
          setSearchParams({}, { replace: true });
          // Auto-hide success after 5 seconds
          setTimeout(() => {
            setShowSuccess(false);
            setCreditsAdded(null);
          }, 5000);
        }
      }
    };

    syncCredits();
  }, [searchParams, setSearchParams, backendUrl]);

  const handleBuyCredits = async (productId: string) => {
    if (!user) {
      navigate("/login", { state: { from: "/pricing" } });
      return;
    }
    if (loadingProductId) return;
    setLoadingProductId(productId);

    try {
      const response = await apiFetch(`${backendUrl}/api/autumn/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId }),
      });

      const result = await response.json();

      if (result.url || result.checkout_url) {
        window.location.href = result.url || result.checkout_url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoadingProductId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-inter selection:bg-brand-pink/20 overflow-hidden relative">
      {/* Prismatic Background Blurs */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-brand-pink/20 rounded-full blur-[100px] opacity-40 animate-pulse"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-violet-400/20 rounded-full blur-[120px] opacity-30"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <Navbar />

        <Container size="4" className="py-24 px-4 flex-1">
          {syncing && (
             <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="mb-8 p-4 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center gap-2 border border-blue-100">
                <Loader2 className="animate-spin" size={20} />
                <span className="font-medium">Verifying your purchase...</span>
             </motion.div>
          )}

          {showError && (
             <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="mb-8 p-4 rounded-xl bg-red-50 text-red-600 flex items-center justify-center gap-2 border border-red-100">
                <span>⚠️</span>
                <span className="font-medium">{showError}</span>
             </motion.div>
          )}

          {showSuccess && (
             <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="mb-8 p-4 rounded-xl bg-green-50 text-green-700 flex items-center justify-center gap-2 border border-green-100 shadow-sm">
                <CheckCircle size={20} />
                <span className="font-medium">
                  Payment successful! {creditsAdded ? `${creditsAdded} credits added.` : "Credits added."}
                </span>
             </motion.div>
          )}

          <div className="text-center mb-16 relative">
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.6}}>
                <span className="inline-block py-1 px-3 rounded-full bg-brand-pink/10 text-brand-pink font-bold text-xs tracking-wider mb-4 border border-brand-pink/20">
                    PRICING
                </span>
                <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900">
                  Pay as you create.
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                  Purchase credits for video generation or image enhancement. <br className="hidden md:block"/>
                  No monthly subscriptions. Credits never expire.
                </p>
                
                <div className="mt-8 inline-flex items-center gap-8 justify-center p-4 rounded-2xl bg-white/50 backdrop-blur-md border border-white/60 shadow-xl shadow-gray-100/50">
                    <div className="flex items-center gap-3 text-gray-600">
                        <div className="p-2 bg-violet-100 text-violet-600 rounded-lg">
                             <Video size={18} />
                        </div>
                        <span className="font-semibold text-sm">1 Video = 10 Credits</span>
                    </div>
                    <div className="w-px h-8 bg-gray-200"></div>
                     <div className="flex items-center gap-3 text-gray-600">
                        <div className="p-2 bg-brand-pink/10 text-brand-pink rounded-lg">
                             <Sparkles size={18} />
                        </div>
                        <span className="font-semibold text-sm">1 Enhancement = 1 Credit</span>
                    </div>
                </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Starter Pack */}
            <motion.div
              initial={{opacity:0, x:-20}}
              animate={{opacity:1, x:0}}
              transition={{delay:0.2, duration:0.6}}
              whileHover={{y:-8}}
              className="relative p-8 rounded-[2rem] bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden group"
            >
              <div className="absolute top-0 right-0 bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-bl-2xl">
                POPULAR
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-pink transition-colors">Starter Pack</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold tracking-tighter text-gray-900">$10</span>
                    <span className="text-gray-400 font-medium">/ 500 Credits</span>
                </div>
                <p className="text-gray-500 mt-2 text-sm">Perfect for hobbyists and trying it out.</p>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6"></div>

              <div className="space-y-4 mb-8">
                  <FeatureItem text="Full Access to Studio" />
                  <FeatureItem text="Stable Video Generation" />
                  <FeatureItem text="Standard Support" />
                  <FeatureItem text="Commercial License" />
              </div>

              <button
                 onClick={() => handleBuyCredits("starter-pack")}
                 disabled={loadingProductId !== null}
                 className="w-full py-4 rounded-xl bg-gray-900 text-white font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group-hover:scale-[1.02]"
              >
                  {loadingProductId === "starter-pack" ? <Loader2 className="animate-spin"/> : "Get Starter Pack"}
              </button>
            </motion.div>

            {/* Pro Pack */}
            <motion.div
               initial={{opacity:0, x:20}}
               animate={{opacity:1, x:0}}
               transition={{delay:0.3, duration:0.6}}
               whileHover={{y:-8}}
               className="relative p-8 rounded-[2rem] bg-white border-2 border-brand-pink/20 shadow-2xl shadow-brand-pink/10 overflow-hidden group"
            >
               {/* Glowing effect behind */}
               <div className="absolute -inset-1 bg-gradient-to-r from-brand-pink via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500"></div>

              <div className="absolute top-0 right-0 bg-gradient-to-r from-brand-pink to-violet-500 text-white text-xs font-bold px-4 py-2 rounded-bl-2xl shadow-lg shadow-brand-pink/20">
                BEST VALUE
              </div>
              
              <div className="mb-6 relative z-10">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-violet-600 mb-2">Pro Pack</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold tracking-tighter text-gray-900">$30</span>
                    <span className="text-gray-400 font-medium">/ 2000 Credits</span>
                </div>
                <p className="text-gray-500 mt-2 text-sm">For serious creators and power users.</p>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-brand-pink/20 to-transparent my-6"></div>

              <div className="space-y-4 mb-8 relative z-10">
                  <FeatureItem text="Everything in Starter" highlighted />
                  <FeatureItem text="Priority Generation Queue" highlighted />
                  <FeatureItem text="Priority Email Support" highlighted/>
                  <FeatureItem text="Early Access to New Models" highlighted/>
              </div>

              <button
                 onClick={() => handleBuyCredits("pro-pack")}
                 disabled={loadingProductId !== null}
                 className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-pink to-violet-600 text-white font-bold hover:shadow-lg hover:shadow-brand-pink/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative z-10 group-hover:scale-[1.02]"
              >
                  {loadingProductId === "pro-pack" ? <Loader2 className="animate-spin"/> : "Get Pro Pack"}
              </button>
            </motion.div>
          </div>
        </Container>

        <Footer />
      </div>
    </div>
  );
}

function FeatureItem({ text, highlighted = false }: { text: string; highlighted?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`p-1 rounded-full ${highlighted ? "bg-brand-pink/10 text-brand-pink" : "bg-gray-100 text-gray-500"}`}>
        <Check size={14} className={highlighted ? "text-brand-pink" : "text-gray-900"} />
      </div>
      <span className="text-sm font-medium text-gray-700">{text}</span>
    </div>
  );
}

