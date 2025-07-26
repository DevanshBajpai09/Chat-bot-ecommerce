import { create } from 'zustand';

export const useChatStore = create((set) => ({
  // Chat state
  messages: [],
  input: '',
  isLoading: false,
  conversationId: null,

  // Conversation history state
  conversations: [],

  // Actions
  setInput: (val) => set({ input: val }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setLoading: (val) => set({ isLoading: val }),

  setConversationId: (id) => set({ conversationId: id }),

  clearMessages: () =>
    set({
      messages: [],
      conversationId: null,
    }),

  // Conversation list setter
  setConversations: (convs) => set({ conversations: convs }),

  // Load a full conversation's messages
  loadConversation: async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/conversations/${id}`);
      const data = await res.json();
      set({
        messages: data.messages,
        conversationId: id,
      });
    } catch (err) {
      console.error('Failed to load conversation', err);
    }
  },
}));
