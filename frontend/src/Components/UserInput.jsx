import { useChatStore } from '../store/chatStore.js';

const UserInput = ({ onSend }) => {
  const input = useChatStore((s) => s.input);
  const setInput = useChatStore((s) => s.setInput);
  const isLoading = useChatStore((s) => s.isLoading);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex border-t p-4 bg-white">
      <input
        type="text"
        className="flex-1 px-4 py-2 border rounded-md"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isLoading}
      />
      <button
        type="submit"
        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md"
        disabled={isLoading}
      >
        {isLoading ? '...' : 'Send'}
      </button>
    </form>
  );
};

export default UserInput;
