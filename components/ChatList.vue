<script lang="ts" setup>
import { useChatStore } from '#imports';

const { createConversation } = useChatStore();
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
                    @click="createConversation"
            /></span>
        </div>
    </div>
</template>

<style></style>
