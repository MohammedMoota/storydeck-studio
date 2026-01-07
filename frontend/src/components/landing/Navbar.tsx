import React, { useState } from "react";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { useAuth } from "../../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isDashboard = location.pathname === "/dashboard";

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      navigate("/");
    }
  };

  return (
    <motion.div 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4"
    >
      <nav className="relative group">
        {/* Prismatic Glow Behind */}
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 rounded-2xl opacity-50 blur-lg group-hover:opacity-80 transition duration-500"></div>
        
        {/* Glass Dock - Light Mode */}
        <div className="relative flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl shadow-xl shadow-indigo-100/30">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group/logo">
            <div className="relative">
              <div className="absolute inset-0 bg-violet-400 rounded-lg blur opacity-30 group-hover/logo:opacity-60 transition-opacity"></div>
              <div className="relative bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                <Sparkles className="w-5 h-5 text-violet-500" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              StoryDeck<span className="text-violet-500">.ai</span>
            </span>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {isDashboard ? (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate("/")}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2 rounded-lg hover:bg-gray-100"
                  >
                    ← Back to Home
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate("/dashboard")}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2 rounded-lg hover:bg-gray-100"
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/app")}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2 rounded-lg hover:bg-gray-100"
                >
                  <Sparkles size={16} />
                  Open Studio
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                  title="Log Out"
                >
                  <LogOut size={20} />
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/login")}
                  className="px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-black transition-all flex items-center gap-2"
                >
                  Get Started
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Dialog.Root open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <Dialog.Trigger asChild>
                <button className="text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Menu />
                </button>
              </Dialog.Trigger>
              <AnimatePresence>
                {isMobileOpen && (
                  <Dialog.Portal forceMount>
                    <Dialog.Overlay asChild>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" 
                      />
                    </Dialog.Overlay>
                    <Dialog.Content asChild>
                      <motion.div 
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed z-50 right-0 top-0 bottom-0 w-3/4 max-w-xs bg-white p-6 border-l border-gray-100 shadow-2xl"
                      >
                         <div className="flex justify-between items-center mb-8">
                            <span className="font-bold text-xl text-gray-900">Menu</span>
                            <Dialog.Close asChild>
                              <button className="text-gray-400 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <X />
                              </button>
                            </Dialog.Close>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            {user ? (
                              <>
                                <button
                                  onClick={() => { navigate("/dashboard"); setIsMobileOpen(false); }}
                                  className="w-full py-3 px-4 text-left text-base font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                  Dashboard
                                </button>
                                <button
                                  onClick={() => { navigate("/app"); setIsMobileOpen(false); }}
                                  className="w-full py-3 px-4 text-left text-base font-bold text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-xl transition-colors"
                                >
                                  Open Studio
                                </button>
                                <button
                                  onClick={() => { handleLogout(); setIsMobileOpen(false); }}
                                  className="w-full py-3 px-4 text-left text-base font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-4"
                                >
                                  Log Out
                                </button>
                              </>
                            ) : (
                              <>

                                <button
                                  onClick={() => { navigate("/login"); setIsMobileOpen(false); }}
                                  className="w-full py-3 mt-4 bg-gradient-to-r from-violet-500 to-pink-500 text-white font-bold rounded-xl text-center shadow-lg"
                                >
                                  Get Started
                                </button>
                              </>
                            )}
                          </div>
                      </motion.div>
                    </Dialog.Content>
                  </Dialog.Portal>
                )}
              </AnimatePresence>
            </Dialog.Root>
          </div>
        </div>
      </nav>
    </motion.div>
  );
};

export default Navbar;
