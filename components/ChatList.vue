<script lang="ts" setup>
import { useChatStore } from '#imports';

const { createConversation, fetchConversations, chatState } = useChatStore();
fetchConversations();
</script>
<template>
    <div class="w-full h-full">
        <div
            class="border-b border-gray-200 dark:border-gray-800 flex justify-between items-center"
        >
            <h3 class="p-4">Chat List</h3>
            <span class="pr-4"
                ><UButton
                    icon="i-grommet-icons-chat"
                    label="New"
                    size="sm"
                    :loading="chatState.loading"
                    @click="createConversation"
            /></span>
        </div>
        <div>
            <div
                v-for="conversation in chatState.conversations"
                class="flex p-4 border-b border-gray-200 dark:border-gray-800 cursor-pointer"
            >
                {{ conversation.id }}
            </div>
        </div>
    </div>
</template>

<style></style>
