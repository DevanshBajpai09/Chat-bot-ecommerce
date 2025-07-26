import { Sidebar } from "./Sidebar";
import { MessageList } from "./MessageList";
import { UserInput } from "./UserInput";
import { useChatStore } from "@/store/chatStore";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, MessageSquare, Sparkles, Menu, Sun, Moon, Settings, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const ChatWindow = () => {
  const { addMessage, setLoading, messages } = useChatStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text) => {
    const userMessage = {
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    addMessage(userMessage);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: 1,
          message: text,
          conversation_id: null
        }),
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const data = await res.json();

      addMessage({
        role: "assistant",
        content: data.ai_response || "No response from AI",
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      addMessage({ 
        role: "assistant", 
        content: "❌ Something went wrong. Please try again.",
        timestamp: new Date().toISOString(),
      });
      console.error("Error in handleSend:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900'} overflow-hidden transition-colors duration-300`}>
      
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-30 p-2 rounded-full bg-white/80 backdrop-blur-lg shadow-md border border-gray-200"
      >
        <Menu className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`fixed md:relative z-20 w-64 h-full ${darkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-lg'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <Sidebar onClose={() => setIsSidebarOpen(false)} darkMode={darkMode} />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-10 bg-black/30 md:hidden"
            />
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-col flex-1 relative overflow-hidden">
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`sticky top-0 z-20 ${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'} backdrop-blur-lg border-b shadow-sm`}
        >
          <div className="container flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-2">
              <motion.div whileHover={{ rotate: 10 }} whileTap={{ scale: 0.9 }}>
                <Bot className="h-6 w-6 text-indigo-600" />
              </motion.div>
              <h1 className="text-xl font-bold">AI Assistant</h1>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <Settings className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-1 text-sm font-medium text-white hover:text-indigo-700 dark:text-white dark:hover:text-white px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/40 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>New Chat</span>
              </motion.button>
            </div>
          </div>
        </motion.header>

        {messages.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center h-full px-4 text-center"
          >
            <motion.div 
              animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              className={`p-6 rounded-full ${darkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'} mb-6`}
            >
              <MessageSquare className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">How can I help you today?</h2>
            <p className={`max-w-md ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
              Ask me anything, from creative ideas to technical explanations. I'm here to assist!
            </p>
            <motion.div 
              className="grid grid-cols-2 gap-3 w-full max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {["Explain quantum computing", "Write a poem about AI", "Suggest productivity tips", "Help debug my code"].map((suggestion, i) => (
                <motion.button
                  key={i}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSend(suggestion)}
                  className={`p-3 rounded-lg text-sm text-left ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'} shadow-sm border ${darkMode ? 'border-gray-600' : 'border-gray-200'} transition-all`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  {suggestion}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}

        <main className={`flex-1 overflow-y-auto p-4 pt-6 ${messages.length === 0 ? 'hidden' : ''}`}>
          <MessageList darkMode={darkMode} />
          <div ref={messagesEndRef} />
        </main>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`sticky bottom-0 border-t p-4 ${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'} backdrop-blur-lg`}
        >
          <UserInput onSend={handleSend} darkMode={darkMode} />
          <motion.p 
            className={`text-xs text-center mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            AI Assistant may produce inaccurate information. Please verify important facts.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};
