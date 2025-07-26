import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

export const Message = ({ role, content, timestamp }) => {
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex w-full group",
        isUser ? "justify-end" : "justify-start",
        "mb-4 last:mb-0"
      )}
    >
      <div className={cn(
        "max-w-[min(80%,600px)] rounded-lg px-4 py-3 text-sm relative",
        "transition-all duration-200",
        isUser
          ? "bg-primary text-primary-foreground rounded-tr-none shadow-sm"
          : "bg-muted text-muted-foreground rounded-tl-none shadow-sm"
      )}>
        {/* Avatar */}
        <div className={cn(
          "absolute -top-2 flex items-center justify-center rounded-full w-8 h-8",
          isUser 
            ? "-right-2 bg-primary border-2 border-background"
            : "-left-2 bg-muted border-2 border-background"
        )}>
          {isUser ? (
            <User className="w-4 h-4 text-primary-foreground" />
          ) : (
            <Bot className="w-4 h-4 text-muted-foreground" />
          )}
        </div>

        {/* Message content */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {content.split('\n').map((paragraph, i) => (
            <p key={i} className="mb-2 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Message footer */}
        <div className={cn(
          "flex items-center justify-between mt-1",
          "text-xs opacity-70",
          isUser ? "text-primary-foreground/70" : "text-muted-foreground/70"
        )}>
          <div>
            {isUser ? 'You' : 'AI Assistant'} • {formatTime(timestamp)}
          </div>
          
          {/* Copy button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCopy}
            className={cn(
              "opacity-0 group-hover:opacity-100 transition-opacity",
              "p-1 rounded-full",
              isUser ? "hover:bg-primary-foreground/20" : "hover:bg-muted-foreground/20"
            )}
            aria-label="Copy message"
          >
            {copied ? (
              <Check className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </motion.button>
        </div>

        {/* Tail for speech bubble effect */}
        <div className={cn(
          "absolute top-0 w-3 h-3",
          isUser 
            ? "-right-3 bg-primary clip-path-triangle-right" 
            : "-left-3 bg-muted clip-path-triangle-left"
        )} />
      </div>
    </motion.div>
  );
};

// Add this to your global CSS:
// .clip-path-triangle-right {
//   clip-path: polygon(0 0, 100% 0, 0 100%);
// }
// .clip-path-triangle-left {
//   clip-path: polygon(100% 0, 0 0, 100% 100%);
// }