import { useState } from 'react';
import MessageList from './MessageList';
import UserInput from './UserInput';
import axios from 'axios';

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const userId = 1; // temp

  const handleSend = async (text) => {
    setMessages(prev => [...prev, { role: 'user', content: text }]);

    try {
      const res = await axios.post('http://localhost:8000/api/chat', {
        user_id: userId,
        message: text,
        conversation_id: conversationId,
      });

      setConversationId(res.data.conversation_id);
      setMessages(prev => [...prev, { role: 'user', content: text }, { role: 'ai', content: res.data.ai_response }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', content: "⚠️ AI is currently unavailable." }]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="text-xl font-bold p-4 text-center border-b bg-white text-black shadow">AI Assistant</header>
      <MessageList messages={messages} />
      <UserInput onSend={handleSend} />
    </div>
  );
};

export default ChatWindow;
