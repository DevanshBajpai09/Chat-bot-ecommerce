import { useEffect, useRef } from 'react';
import { useChatStore } from '../store/chatStore';
import { Message } from './Message';
import { ScrollArea } from './ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, MessageSquare } from 'lucide-react';

export const MessageList = ({ darkMode = false }) => {
  const messages = useChatStore((s) => s.messages);
  const isLoading = useChatStore((s) => s.loading);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 relative">
      <div ref={scrollRef} className="flex flex-col min-h-full justify-end">
        <div className="pt-4 pb-24 px-4">
          <AnimatePresence>
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center h-[60vh] text-center p-8"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
                    darkMode ? 'bg-indigo-900/20' : 'bg-indigo-50'
                  }`}
                >
                  <MessageSquare className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                </motion.div>
                <h3 className="text-xl font-medium mb-3 text-foreground">
                  How can I help you today?
                </h3>
                <p className={`text-sm max-w-md mb-8 ${
                  darkMode ? 'text-muted-foreground' : 'text-muted-foreground/80'
                }`}>
                  Ask me anything, from creative ideas to technical explanations.
                </p>
                <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                  {[
                    "Explain quantum computing",
                    "Write a poem about AI",
                    "Suggest productivity tips",
                    "Help debug my code"
                  ].map((suggestion, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * i }}
                      className={`p-3 rounded-lg text-sm text-left cursor-pointer ${
                        darkMode 
                          ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' 
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                      } border shadow-sm transition-colors`}
                    >
                      {suggestion}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => (
                  <Message
                    key={`${msg.id || idx}`}
                    role={msg.role}
                    content={msg.content}
                    timestamp={msg.timestamp}
                    darkMode={darkMode}
                  />
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start mb-4"
                  >
                    <div className={`max-w-[80%] rounded-lg px-4 py-3 text-sm ${
                      darkMode 
                        ? 'bg-gray-800 text-gray-100' 
                        : 'bg-gray-100 text-gray-800'
                    } rounded-tl-none shadow-sm`}>
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-75" />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-150" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ScrollArea>
  );
};