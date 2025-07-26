import { useState } from 'react';

const UserInput = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSend(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex border-t p-4 bg-white">
      <input
        type="text"
        className="flex-1 px-4 py-2 border text-black rounded-md focus:outline-none focus:ring"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Send
      </button>
    </form>
  );
};

export default UserInput;
