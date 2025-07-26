import { useEffect, useState } from 'react';
import { useChatStore } from '../store/chatStore';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';
import { CalendarDays, MessageSquarePlus, Loader2, User, ChevronRight, Plus, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export const Sidebar = ({ onClose, darkMode = false }) => {
  const {
    conversations,
    setConversations,
    loadConversation,
    currentConversationId,
    createNewConversation,
    isLoading
  } = useChatStore();

  const [isHoveringNewChat, setIsHoveringNewChat] = useState(false);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/conversations?user_id=1');
        const data = await response.json();
        setConversations(data || []);
      } catch (err) {
        console.error("Failed to load conversations", err);
      }
    };

    fetchConversations();
  }, [setConversations]);

  return (
    <div className={`flex flex-col h-full w-72 ${darkMode ? 'bg-gray-900' : 'bg-background/95'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors duration-300`}>
      {/* Header */}
      <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <motion.h2 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg font-semibold flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4 text-indigo-500" />
            Chat History
          </motion.h2>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={isHoveringNewChat ? "default" : "ghost"}
              size="icon"
              onClick={createNewConversation}
              disabled={isLoading}
              onMouseEnter={() => setIsHoveringNewChat(true)}
              onMouseLeave={() => setIsHoveringNewChat(false)}
              className="transition-all duration-200"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className={`h-4 w-4 ${isHoveringNewChat ? 'text-white' : 'text-primary'}`} />
              )}
              <span className="sr-only">New chat</span>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Conversation List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          <AnimatePresence>
            {isLoading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton 
                    key={i} 
                    className={`h-14 w-full rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
                  />
                ))}
              </motion.div>
            ) : conversations.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center justify-center p-8 text-center"
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
                  className={`p-4 rounded-full ${darkMode ? 'bg-indigo-900/20' : 'bg-indigo-50'} mb-4`}
                >
                  <MessageSquarePlus className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </motion.div>
                <h3 className="text-sm font-medium mb-1">No conversations yet</h3>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-muted-foreground'} mb-4`}>
                  Start a new conversation to see history here
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={createNewConversation}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" />
                  New Chat
                </Button>
              </motion.div>
            ) : (
              <motion.ul 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-1"
              >
                {conversations.map((conv) => (
                  <motion.li
                    key={conv.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => loadConversation(conv.id)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg transition-all",
                        "flex items-center gap-3 group",
                        currentConversationId === conv.id
                          ? darkMode 
                            ? "bg-gray-800 text-white" 
                            : "bg-accent font-medium"
                          : darkMode 
                            ? "text-gray-300 hover:bg-gray-800/50" 
                            : "text-muted-foreground hover:bg-accent"
                      )}
                    >
                      <div className={`p-1.5 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors`}>
                        <MessageSquarePlus className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium">
                          {conv.title || "New conversation"}
                        </div>
                        <div className={`text-xs flex items-center gap-1.5 mt-1 ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                          <CalendarDays className="h-3 w-3" />
                          {new Date(conv.created_at).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.button>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* User Profile */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
      >
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/user-avatar.jpg" />
            <AvatarFallback className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="text-sm min-w-0">
            <div className="font-medium truncate">User Name</div>
            <div className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
              Free Plan
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};