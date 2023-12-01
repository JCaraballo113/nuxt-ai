<script lang="ts" setup>
const { chat } = useChatStore();

const chatListRef = ref<HTMLElement | null>(null);
const lastMessageStatus = computed(() => {
    return chat.messages[chat.messages.length - 1].status;
});

watch(
    () => chatListRef.value,
    () => {
        if (chatListRef.value) {
            chatListRef.value.scrollTop = chatListRef.value.scrollHeight;
        }
    }
);

// nextTick(() => {
//     if (chatListRef.value) {
//         chatListRef.value.scrollTop = chatListRef.value.scrollHeight;
//     }
// });
</script>

<template>
    <div class="p-4 h-[80%] overflow-y-scroll" ref="chatListRef">
        <template v-for="(message, idx) in chat.messages" :key="idx">
            <Message
                :message="message"
                :index="idx"
                :total-messages="chat.messages.length - 1"
            />
        </template>
    </div>
</template>
