<script lang="ts" setup>
const { chatState, sendMessage } = useChatStore();
const message = ref('');

const chat = () => {
    if (message.value.length > 0) {
        sendMessage(chatState.currentConversation, message.value);
        message.value = '';
    }
};

const isChatting = computed(() => chatState.currentConversation !== '');

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
        <div v-else class="w-full h-full">
            <div
                class="border-b border-gray-200 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-background/75 backdrop-blur"
            >
                <p class="p-4">{{ chatState.currentConversation }}</p>
            </div>
            <div
                class="border-t border-gray-200 dark:border-gray-800 flex justify-between items-center absolute bottom-0 bg-background/75 backdrop-blur w-full"
            >
                <div class="p-4 w-full flex justify-between">
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
                        size="sm"
                        @click="chat"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
