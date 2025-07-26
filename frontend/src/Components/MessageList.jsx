import Message from './Message';

const MessageList = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto text-black p-4">
      {messages.map((msg, idx) => (
        <Message key={idx} role={msg.role} content={msg.content} />
      ))}
    </div>
  );
};

export default MessageList;
