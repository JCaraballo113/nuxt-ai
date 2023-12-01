import { defineStore } from 'pinia';
export enum CHAT_STATUS {
    IDLE,
    LOADING_MESSAGES,
    SENDING_MESSAGE,
    RECEIVING_MESSAGE,
    LOADING_CONVERSATIONS,
    CREATING_CONVERSATION,
    ERROR_LOADING_CONVERSATIONS,
    ERROR_LOADING_MESSAGES,
    ERROR_SENDING_MESSAGE,
    ERROR_RECEIVING_MESSAGE,
    ERROR_LOADING_CONVERSATION,
    ERROR_CREATING_CONVERSATION,
}
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
    status: CHAT_STATUS;
}
export const useChatStore = defineStore('chat', () => {
    const chat = reactive<ChatState>({
        currentConversation: '',
        conversations: [],
        messages: [],
        error: null,
        status: CHAT_STATUS.IDLE,
    });

    const createConversation = async () => {
        chat.status = CHAT_STATUS.CREATING_CONVERSATION;
        chat.error = null;
        const { data, error } = await useFetch('/api/conversations/new');
        if (data.value) {
            chat.conversations.unshift(data.value as Conversation);
            chat.currentConversation = data.value.id;
        }
        chat.status = CHAT_STATUS.IDLE;
    };

    const fetchConversations = async () => {
        chat.status = CHAT_STATUS.LOADING_CONVERSATIONS;
        chat.error = null;
        const { data, error } = await useFetch('/api/conversations', {
            headers: useRequestHeaders(['cookie']),
        });

        if (data.value) {
            chat.conversations = [...data.value] as Conversation[];
        }
        chat.status = CHAT_STATUS.IDLE;
    };

    const setConversation = (conversationId: string) => {
        chat.currentConversation = conversationId;
    };

    const sendMessage = async (content: string) => {
        if (chat.currentConversation === '') {
            return;
        }
        chat.status = CHAT_STATUS.SENDING_MESSAGE;

        chat.messages.push({
            content,
            role: 'user',
            createdAt: new Date().toString(),
        });

        chat.status = CHAT_STATUS.IDLE;
    };

    return {
        chat,
        createConversation,
        fetchConversations,
        setConversation,
        sendMessage,
    };
});
