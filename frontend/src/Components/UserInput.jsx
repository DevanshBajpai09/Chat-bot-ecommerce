import React, { useRef, useState } from 'react';
import { useChatStore } from '../store/chatStore';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Paperclip, Send, Loader2, Mic, Smile, Image, File } from 'lucide-react';
import { useHotkeys } from 'react-hotkeys-hook';
import { motion, AnimatePresence } from 'framer-motion';

export const UserInput = ({ onSend, darkMode = false }) => {
  const { input, setInput, isLoading } = useChatStore();
  const textareaRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isHoveringSend, setIsHoveringSend] = useState(false);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useHotkeys('mod+enter', () => handleSubmit(), {
    enableOnFormTags: ['TEXTAREA'],
    preventDefault: true
  });

  return (
    <div className={`sticky bottom-0 ${darkMode ? 'bg-gray-900/95 border-gray-700' : 'bg-background/95 border-gray-200'} backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t transition-colors duration-300`}>
      <form onSubmit={handleSubmit} className="p-4 pt-2">
        {/* Attachment Menu */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-2 mb-2 p-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={isLoading}
              >
                <Image className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={isLoading}
              >
                <File className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={isLoading}
              >
                <Mic className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area */}
        <div className="relative flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              disabled={isLoading}
            >
              <Smile className="h-4 w-4" />
            </Button>
          </motion.div>

          <Textarea
            ref={textareaRef}
            className={`flex-1 min-h-[60px] max-h-32 pl-10 pr-12 resize-none ${darkMode ? 'bg-gray-800 border-gray-700 focus:border-indigo-500' : 'border-gray-200 focus:border-indigo-400'} transition-colors`}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isLoading}
            rows={1}
          />

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsHoveringSend(true)}
            onHoverEnd={() => setIsHoveringSend(false)}
          >
            <Button
              type="submit"
              size="icon"
              className={`absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 transition-all ${
                isHoveringSend && !isLoading && input.trim()
                  ? darkMode
                    ? 'bg-indigo-600'
                    : 'bg-indigo-500 text-white'
                  : ''
              }`}
              disabled={isLoading || !input.trim()}
              variant={isHoveringSend && !isLoading && input.trim() ? "default" : "ghost"}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className={`h-4 w-4 ${
                  isHoveringSend && !isLoading && input.trim()
                    ? 'text-white'
                    : darkMode
                      ? 'text-gray-400'
                      : 'text-gray-500'
                }`} />
              )}
              <span className="sr-only">Send message</span>
            </Button>
          </motion.div>
        </div>

        {/* Helper Text */}
        <div className={`flex justify-between items-center mt-2 px-1 ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
          <p className="text-xs">
            Press <kbd className={`pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-muted border-gray-200'
            }`}>Shift</kbd> + <kbd className={`pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-muted border-gray-200'
            }`}>Enter</kbd> for new line
          </p>
          <p className="text-xs">
            <kbd className={`pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-muted border-gray-200'
            }`}>⌘</kbd> + <kbd className={`pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-muted border-gray-200'
            }`}>Enter</kbd> to send
          </p>
        </div>
      </form>
    </div>
  );
};