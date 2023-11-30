import { defineStore } from 'pinia';
export type Message = {
    id?: string;
    role: 'assistant' | 'user';
    content: string;
    createdAt: string;
};

export type Conversation = {
    id: string;
    user_id: string;
    llm: string | null;
    memory: string | null;
    createdAt: string;
};
interface ChatState {
    currentConversation: string;
    conversations: Conversation[];
    messages: Message[];
    error: string | null;
    loading: boolean;
}
export const useChatStore = defineStore('chat', () => {
    const chatState = reactive<ChatState>({
        currentConversation: '',
        conversations: [],
        messages: [],
        error: null,
        loading: false,
    });

    const createConversation = async () => {
        chatState.loading = true;
        chatState.error = null;
        const { data, error } = await useFetch('/api/conversations/new');
        if (data.value) {
            chatState.conversations.unshift(data.value as Conversation);
            chatState.currentConversation = data.value.id;
        }
        chatState.loading = false;
    };

    const fetchConversations = async () => {
        const { data, error } = await useFetch('/api/conversations', {
            headers: useRequestHeaders(['cookie']),
        });

        if (data.value) {
            chatState.conversations = [...data.value] as Conversation[];
        }
    };

    const setConversation = (conversationId: string) => {
        chatState.currentConversation = conversationId;
    };

    const sendMessage = async (conversationId: string, content: string) => {
        chatState.messages.push({
            content,
            role: 'user',
            createdAt: new Date().toString(),
        });
    };

    return {
        chatState,
        createConversation,
        fetchConversations,
        setConversation,
        sendMessage,
    };
});
