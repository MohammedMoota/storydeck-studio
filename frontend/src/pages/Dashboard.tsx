import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import {
  Zap,
  History,
  ArrowRight,
  ArrowUpRight,
  ArrowDownLeft,
  LayoutDashboard,
  LineChart,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { toast } from "sonner";

const backend_url = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

function Dashboard() {
  const navigate = useNavigate();
  const { session } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = session?.access_token;
        if (!token) return console.warn("No session");

        // Fetch profile row — contains credits
        const profileRes = await fetch(`${backend_url}/api/supabase/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData?.credits !== undefined) {
            setCredits(profileData.credits);
          }
        } else {
          setError("Failed to load credits");
          toast.error("Could not load your credit balance");
        }

        // Fetch transaction log
        const transactionRes = await fetch(
          `${backend_url}/api/supabase/transactions`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (transactionRes.ok) {
          const transactionData = await transactionRes.json();
          // [{created_at, credit_usage, transaction_log_id, transaction_type, user_id}, ...]
          setTransactions(transactionData || []);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to connect to server");
        toast.error("Could not connect to server. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  return (
      <div className="min-h-screen bg-white font-inter selection:bg-brand-pink/20 overflow-hidden relative">
      {/* Prismatic Background Blurs */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-brand-pink/20 rounded-full blur-[100px] opacity-40 animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-violet-400/20 rounded-full blur-[120px] opacity-30"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col min-h-screen">
        <Navbar />

        <div className="flex-1 max-w-7xl mx-auto w-full px-6 pt-32 pb-20">
          {/* Header Section */}
          <div className="mb-16 relative">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full mb-4">
                 <LayoutDashboard size={14} className="text-gray-500"/>
                 <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Workspace</span>
             </div>
             
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-3">
                    Dashboard
                  </h1>
                  <p className="text-lg text-gray-500 max-w-xl">
                    Manage your credits, billing, and usage history.
                  </p>
                </div>
             </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Credit Balance Card */}
            <div className="lg:col-span-2 relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-pink/30 to-violet-400/30 rounded-[2rem] blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                
                <div className="relative h-full bg-white/70 backdrop-blur-xl border border-white/60 rounded-[1.8rem] p-8 md:p-10 shadow-xl shadow-indigo-100/20 overflow-hidden flex flex-col justify-between">
                    <div className="flex items-start justify-between mb-8">
                        <div>
                           <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-1">
                             <Zap className="w-5 h-5 text-brand-pink fill-brand-pink" /> 
                             Credit Balance
                           </h2>
                           <p className="text-sm text-gray-500">Available for generation</p>
                        </div>
                        <button
                           onClick={() => navigate("/pricing")}
                           className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group/btn"
                         >
                           Upgrade Plan
                           <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                         </button>
                    </div>

                    <div className="mt-auto">
                        <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600">
                                {credits !== null ? credits : "..."}
                            </span>
                            <span className="text-lg text-gray-400 font-medium">credits</span>
                        </div>
                        
                        {/* Progress Bar Visual */}
                         <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: "20%" }} 
                               className="h-full bg-gradient-to-r from-brand-pink to-violet-500"
                            />
                         </div>
                         <p className="text-xs text-gray-400 mt-3 font-medium">
                            {credits !== null ? "Ready to create magic." : "Syncing details..."}
                         </p>
                    </div>
                </div>
            </div>

            {/* Quick Actions / Status Placeholder (Optional 3rd Column) */}
            <div className="hidden lg:flex flex-col gap-6">
                <div className="flex-1 bg-white/50 backdrop-blur-lg border border-white/60 rounded-[1.8rem] p-6 shadow-lg shadow-gray-100/20 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-violet-100/50 rounded-2xl flex items-center justify-center mb-4 text-violet-500">
                        <LineChart className="w-8 h-8"/>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">Usage Trends</h3>
                    <p className="text-sm text-gray-500 mb-4">Coming soon</p>
                </div>
                 <div className="flex-1 bg-white/50 backdrop-blur-lg border border-white/60 rounded-[1.8rem] p-6 shadow-lg shadow-gray-100/20 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-blue-100/50 rounded-2xl flex items-center justify-center mb-4 text-blue-500">
                        <Clock className="w-8 h-8"/>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">History</h3>
                     <p className="text-sm text-gray-500 mb-4">Archive access enabled</p>
                </div>
            </div>
          </div>

          {/* Transaction Log Section */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6 px-2">
                 <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <History className="w-5 h-5 text-gray-400" />
                    Transaction Log
                 </h2>
                 <span className="text-sm text-gray-400">Recent activity</span>
            </div>

            <div className="bg-white/60 backdrop-blur-md border border-white/80 rounded-[2rem] p-1 shadow-xl shadow-gray-100/40 overflow-hidden min-h-[400px]">
              {loading ? (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-gray-400 gap-3">
                  <div className="w-8 h-8 border-2 border-gray-200 border-t-brand-pink rounded-full animate-spin"></div>
                  <p className="text-sm font-medium">Loading transactions...</p>
                </div>
              ) : transactions.length > 0 ? (
                <div className="divide-y divide-gray-100/50">
                  {transactions.map((tx: any, index: number) => (
                    <div
                      key={tx.transaction_log_id || index}
                      className="group flex flex-col md:flex-row md:items-center justify-between p-5 hover:bg-white/60 transition-colors rounded-2xl"
                    >
                      <div className="flex items-center gap-4 mb-2 md:mb-0">
                        <div className={`p-3 rounded-xl ${
                            tx.credit_usage < 0 
                            ? "bg-green-50 text-green-600 ring-1 ring-green-100" 
                            : "bg-gray-50 text-gray-500 ring-1 ring-gray-100"
                        }`}>
                           {tx.credit_usage < 0 ? <ArrowUpRight size={18}/> : <ArrowDownLeft size={18}/>}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 flex items-center gap-2">
                            {tx.transaction_type?.replace(/_/g, ' ') || "Transaction"}
                            {tx.credit_usage < 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 bg-green-100 text-green-700 rounded-md uppercase tracking-wide">Credit</span>}
                          </p>
                          <p className="text-sm text-gray-500 font-mono mt-0.5">
                            {new Date(tx.created_at).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })} • {new Date(tx.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                      <div className={`font-mono font-bold text-lg ${
                          tx.credit_usage < 0 ? "text-green-600" : "text-gray-900"
                      }`}>
                        {tx.credit_usage < 0 ? "+" : ""}
                        {Math.abs(tx.credit_usage)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-gray-400">
                   <div className="p-4 bg-gray-50 rounded-full mb-3">
                      <Clock className="w-6 h-6 text-gray-300" />
                   </div>
                  <p className="font-medium">No transactions yet</p>
                  <p className="text-sm">Your activity will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;
