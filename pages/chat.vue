<script lang="ts" setup>
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
let socket: Socket | undefined;

const { chat, setApiKey, updateAIMessage } = useChatStore();
const isApiModalOpen = computed(() => chat.apiKey === '');
const apiKey = ref('');

const handleSubmit = async () => {
    if (apiKey.value === '') return;
    setApiKey(apiKey.value);
};

onMounted(() => {
    const apiKey = localStorage.getItem('chat-api-key');

    setApiKey(apiKey ?? '');

    socket = io(
        `${location.protocol === 'https:' ? 'wss://' : 'ws://'}${location.host}`
    );

    socket.on('conversation-stream', (messageValue: string) => {
        try {
            console.log('Frontend received: ', messageValue);
            updateAIMessage(messageValue);
        } catch (e) {
            console.error(e);
        }
    });

    onUnmounted(() => {
        socket?.disconnect();
    });
});
</script>
<template>
    <div class="flex w-full h-[calc(100vh-96px-64px)] flex-col md:flex-row">
        <section
            class="w-full md:w-[40%] border-r border-gray-200 dark:border-gray-800 md:h-full h-[40%] border-b md:border-b-0"
        >
            <ConversationPanel />
        </section>
        <ClientOnly>
            <section class="w-full md:w-[60%] md:h-full h-[60%]">
                <MessagesPanel />
            </section>

            <template #placeholder>
                <p
                    class="w-full md:w-[60%] md:h-full h-[60%] flex items-center justify-center"
                >
                    Start or select a conversation
                </p>
            </template>
        </ClientOnly>
    </div>
    <ClientOnly>
        <UModal v-model="isApiModalOpen" prevent-close>
            <div class="p-4">
                <UCard>
                    <template #header>
                        <h4 class="text-xl font-semibold">API Key</h4>
                    </template>
                    <p>
                        Hello! In order to not get my wallet crying due to
                        OpenAI rates, you must provide your own API key. Don't
                        worry I never store it anywhere (except localStorage
                        under the key <code>chat-api-key</code>) and only send
                        it over the wire to talk to OpenAI
                    </p>
                    <UInput
                        class="mt-4"
                        color="primary"
                        variant="outline"
                        v-model="apiKey"
                        placeholder="Enter your API key here"
                    />
                    <UButton @click="handleSubmit" label="Enter" class="mt-4" />
                    <UButton
                        type="button"
                        label="Cancel"
                        class="ml-4"
                        @click="$router.push('/')"
                    />
                </UCard>
            </div>
        </UModal>
    </ClientOnly>
</template>
