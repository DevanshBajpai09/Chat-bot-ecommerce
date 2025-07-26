import { create } from 'zustand';

export const useChatStore = create((set) => ({
  messages: [],
  input: '',
  isLoading: false,
  conversationId: null,

  setInput: (val) => set({ input: val }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setLoading: (val) => set({ isLoading: val }),

  setConversationId: (id) => set({ conversationId: id }),

  clearMessages: () => set({ messages: [] }),
}));
