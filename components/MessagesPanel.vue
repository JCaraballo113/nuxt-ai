<script lang="ts" setup>
import { RealtimeChannel } from '@supabase/realtime-js';
import { CHAT_STATUS } from '~/stores/chat';

const { chat, sendMessage, loadMessages, updateAIMessage } = useChatStore();
const message = ref('');
const supabase = useSupabaseClient();
let channel: RealtimeChannel | null = null;

const onMessage = () => {
    if (message.value.length > 0) {
        sendMessage(message.value);
        message.value = '';
    }
};

const isChatting = computed(() => chat.currentConversation !== '');

const messaging = computed(() => {
    return (
        chat.status === CHAT_STATUS.SENDING_MESSAGE ||
        chat.status === CHAT_STATUS.RECEIVING_MESSAGE
    );
});

const streamTokens = () => {
    channel = supabase.channel(`conversation-${chat.currentConversation}`);

    channel.on('broadcast', { event: 'token-stream' }, ({ payload }) =>
        updateAIMessage(payload)
    );

    channel.subscribe();
};

watch(
    () => chat.currentConversation,
    (currConvo, oldConvo) => {
        if (currConvo !== '' && currConvo !== oldConvo) {
            loadMessages();

            if (channel) {
                channel.unsubscribe();
            }
            streamTokens();
        }
    }
);

onMounted(() => {
    if (chat.currentConversation !== '') {
        streamTokens();
    }
});

onUnmounted(() => {
    if (channel) {
        channel.unsubscribe();
    }
});
</script>

<template>
    <div class="w-full h-full relative">
        <p
            v-if="!isChatting"
            class="w-full h-full flex items-center justify-center"
        >
            Start or select a conversation
        </p>
        <div v-else class="w-full h-full">
            <div
                class="border-b h-[10%] border-gray-200 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-background/75 backdrop-blur"
            >
                <p class="p-4">{{ chat.currentConversation }}</p>
            </div>
            <template v-if="chat.status !== CHAT_STATUS.LOADING_MESSAGES">
                <MessageList />
                <div
                    class="p-4 border-t h-[10%] border-gray-200 dark:border-gray-800 flex justify-between items-center sticky bottom-0 bg-background/75 backdrop-blur w-full"
                >
                    <UForm
                        @submit="onMessage"
                        :state="{ message: message }"
                        class="w-full flex justify-between"
                    >
                        <UInput
                            class="w-11/12"
                            color="primary"
                            size="xl"
                            variant="none"
                            placeholder="Send a message to our AI overlord..."
                            v-model="message"
                        />
                        <UButton
                            class="flex-shrink-0 p-3"
                            icon="i-carbon-send-alt-filled"
                            :loading="messaging"
                            size="sm"
                            type="submit"
                            :disabled="messaging"
                        />
                    </UForm>
                </div>
            </template>
            <template v-else>
                <div
                    class="w-full h-full flex flex-col justify-center items-center"
                >
                    <UIcon
                        name="i-heroicons-arrow-path"
                        class="spin text-6xl"
                    />
                    <p>Loading messages...</p>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.spin {
    animation: spin 1s linear infinite;
}
</style>
