import { defineStore } from 'pinia';
export enum CHAT_STATUS {
    IDLE = 'IDLE',
    LOADING_MESSAGES = 'LOADING_MESSAGES',
    SENDING_MESSAGE = 'SENDING_MESSAGE',
    RECEIVING_MESSAGE = 'RECEIVING_MESSAGE',
    LOADING_CONVERSATIONS = 'LOADING_CONVERSATIONS',
    CREATING_CONVERSATION = 'CREATING_CONVERSATION',
    ERROR_LOADING_CONVERSATIONS = 'ERROR_LOADING_CONVERSATIONS',
    ERROR_LOADING_MESSAGES = 'ERROR_LOADING_MESSAGES',
    ERROR_SENDING_MESSAGE = 'ERROR_SENDING_MESSAGE',
    ERROR_RECEIVING_MESSAGE = 'ERROR_RECEIVING_MESSAGE',
    ERROR_LOADING_CONVERSATION = 'ERROR_LOADING_CONVERSATION',
    ERROR_CREATING_CONVERSATION = 'ERROR_CREATING_CONVERSATION',
}
export type Message = {
    id?: string;
    role: 'ai' | 'human';
    content: string;
    createdAt: string;
    delivered: boolean;
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
    error?: string;
    status: CHAT_STATUS;
}
export const useChatStore = defineStore('chat', () => {
    const chat = reactive<ChatState>({
        currentConversation: '',
        conversations: [],
        messages: [],
        status: CHAT_STATUS.IDLE,
    });

    const createConversation = async () => {
        chat.status = CHAT_STATUS.CREATING_CONVERSATION;
        chat.error = undefined;
        chat.currentConversation = '';
        const { data, error } = await useFetch('/api/conversations/new');
        if (data.value) {
            chat.conversations.unshift(data.value as Conversation);
            chat.currentConversation = data.value.id;
        }
        chat.status = CHAT_STATUS.IDLE;
    };

    const fetchConversations = async () => {
        chat.status = CHAT_STATUS.LOADING_CONVERSATIONS;
        chat.error = undefined;
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
            role: 'human',
            createdAt: new Date().toString(),
            delivered: true,
        });

        const { error } = await useFetch(`/api/messages/send`, {
            method: 'POST',
            headers: useRequestHeaders(['cookie']),
            body: JSON.stringify({
                content,
                conversation: chat.currentConversation,
            }),
        });

        if (error.value) {
            chat.status = CHAT_STATUS.ERROR_SENDING_MESSAGE;
            chat.error = error.value?.message;
            const lastSentMessage = chat.messages.pop();
            if (lastSentMessage) {
                lastSentMessage.delivered = false;
                chat.messages.push(lastSentMessage);
            }
        }

        chat.status = CHAT_STATUS.IDLE;
    };

    const loadMessages = async () => {
        chat.status = CHAT_STATUS.LOADING_MESSAGES;
        chat.messages = [];

        chat.error = undefined;
        const controller = new AbortController();
        const signal = controller.signal;
        const { data, error } = await useFetch(
            `/api/messages?conversation=${chat.currentConversation}`,
            {
                headers: useRequestHeaders(['cookie']),
                signal,
            }
        );
        if (data.value) {
            chat.messages = data.value.map((message) => ({
                ...message,
                delivered: true,
            })) as Message[];
        }

        chat.status = CHAT_STATUS.IDLE;
    };

    return {
        chat,
        createConversation,
        fetchConversations,
        setConversation,
        sendMessage,
        loadMessages,
    };
});
