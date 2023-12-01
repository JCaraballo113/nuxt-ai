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

export type MESSAGE_ROLE = 'human' | 'ai';

export enum MESSAGE_STATUS {
    DELIVERED = 'DELIVERED',
    PENDING = 'PENDING',
    FAILED = 'FAILED',
}
export type Message = {
    id?: string;
    role: MESSAGE_ROLE;
    content: string;
    createdAt: string;
    status: MESSAGE_STATUS;
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

    const getLatestMessage = (role: MESSAGE_ROLE) => {
        return [...chat.messages].reverse().find((m) => m.role === role);
    };

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
        chat.messages.push({
            content,
            role: 'human',
            createdAt: new Date().toString(),
            status: MESSAGE_STATUS.DELIVERED,
        });

        chat.messages.push({
            content: '',
            role: 'ai',
            createdAt: new Date().toString(),
            status: MESSAGE_STATUS.PENDING,
        });
        chat.status = CHAT_STATUS.SENDING_MESSAGE;

        const { error, data } = await useFetch(`/api/messages/send`, {
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
            const lastSentMessage = getLatestMessage('human');
            const lastAiMessage = getLatestMessage('ai');
            if (lastSentMessage) {
                lastSentMessage.status = MESSAGE_STATUS.FAILED;
            }

            if (lastAiMessage) {
                lastAiMessage.status = MESSAGE_STATUS.FAILED;
                lastAiMessage.content = 'Sorry, I cant help you right now';
            }
        } else {
            const lastAIMessage = getLatestMessage('ai');
            if (lastAIMessage) {
                lastAIMessage.status = MESSAGE_STATUS.DELIVERED;
                lastAIMessage.content = data.value;
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
                status: MESSAGE_STATUS.DELIVERED,
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
