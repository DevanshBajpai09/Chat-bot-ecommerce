import  {useChatStore} from '../store/chatStore';
import Message from './Message';

const MessageList = () => {
  const messages = useChatStore((s) => s.messages);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((msg, idx) => (
        <Message key={idx} role={msg.role} content={msg.content} />
      ))}
    </div>
  );
};

export default MessageList;
