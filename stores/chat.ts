import { defineStore } from 'pinia';
type Message = {
    id: string;
    role: 'assistant' | 'user';
    content: string;
    createdAt: Date;
};

type Conversation = {
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
        const { data, error } = await useFetch('/api/conversations/new');
        if (data.value) {
            chatState.conversations.push(data.value as Conversation);
            chatState.currentConversation = data.value.id;
        }
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

    return {
        chatState,
        createConversation,
        fetchConversations,
        setConversation,
    };
});
