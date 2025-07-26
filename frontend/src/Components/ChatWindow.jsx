import MessageList from './MessageList';
import UserInput from './UserInput';
import  {useChatStore}  from '../store/chatStore';
import axios from 'axios';

const ChatWindow = () => {
//   const messages = useChatStore((s) => s.messages);
  const addMessage = useChatStore((s) => s.addMessage);
  const setLoading = useChatStore((s) => s.setLoading);
//   const isLoading = useChatStore((s) => s.isLoading);
  const conversationId = useChatStore((s) => s.conversationId);
  const setConversationId = useChatStore((s) => s.setConversationId);

  const handleSend = async (text) => {
    addMessage({ role: 'user', content: text });
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/api/chat', {
        user_id: 1,
        message: text,
        conversation_id: conversationId,
      });

      setConversationId(res.data.conversation_id);
      addMessage({ role: 'ai', content: res.data.ai_response });
    } catch (err) {
      addMessage({ role: 'ai', content: '⚠️ AI is not responding' });
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="text-xl font-bold p-4 text-center border-b bg-white shadow">AI Chat</header>
      <MessageList />
      <UserInput onSend={handleSend} />
    </div>
  );
};

export default ChatWindow;
