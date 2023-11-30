<script lang="ts" setup>
import { useChatStore } from '#imports';

const { createConversation, fetchConversations, setConversation, chatState } =
    useChatStore();
fetchConversations();
</script>
<template>
    <div class="w-full h-full overflow-y-scroll">
        <div
            class="border-b border-gray-200 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-background/75 backdrop-blur"
        >
            <h3 class="p-4">Conversations</h3>
            <span class="pr-4"
                ><UButton
                    icon="i-grommet-icons-chat"
                    label="New"
                    size="sm"
                    :loading="chatState.loading"
                    @click="createConversation"
            /></span>
        </div>
        <ChatList :conversations="chatState.conversations" />
    </div>
</template>

<style></style>
