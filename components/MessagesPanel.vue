<script lang="ts" setup>
import { CHAT_STATUS } from '~/stores/chat';

const { chat, sendMessage } = useChatStore();
const message = ref('');

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

watch(isChatting, () => {
    if (isChatting.value) {
        console.log('User is chatting');
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
        <div v-else class="w-full h-full overflow-y-scroll">
            <div
                class="border-b border-gray-200 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-background/75 backdrop-blur"
            >
                <p class="p-4">{{ chat.currentConversation }}</p>
            </div>
            <MessageList />
            <div
                class="border-t border-gray-200 dark:border-gray-800 flex justify-between items-center absolute bottom-0 bg-background/75 backdrop-blur w-full"
            >
                <UForm
                    @submit="onMessage"
                    :state="{ message: message }"
                    class="p-4 w-full flex justify-between"
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
                    />
                </UForm>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
