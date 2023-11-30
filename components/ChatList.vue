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
        <div>
            <div
                v-for="conversation in chatState.conversations"
                class="flex p-4 border-b border-gray-200 dark:border-gray-800 cursor-pointer hover:bg-sky-400/50"
                @click="setConversation(conversation.id)"
            >
                <div class="flex-1 flex justify-between">
                    <span>{{ conversation.id }}</span>
                    <span class="dark:text-sky-400 text-sky-600">{{
                        useTimeAgo(conversation.createdAt).value.replace(
                            '"',
                            ''
                        )
                    }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>
