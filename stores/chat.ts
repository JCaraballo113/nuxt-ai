import { defineStore } from 'pinia';
type Message = {
    id: string;
    role: 'assistant' | 'user';
    content: string;
    createdAt: Date;
};
interface ChatState {
    currentConversation: string;
    messages: string[];
    error: string | null;
    loading: boolean;
}
export const useChatStore = defineStore('chat', () => {
    const chatState = reactive<ChatState>({
        currentConversation: '',
        messages: [],
        error: null,
        loading: false,
    });

    const createConversation = async () => {
        const { data, error } = await useFetch('/api/chat/new');
        console.log(data.value);
    };
    return {
        chatState,
        createConversation,
    };
});
