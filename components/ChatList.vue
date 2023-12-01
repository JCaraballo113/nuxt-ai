<script lang="ts" setup>
defineProps({
    conversations: Array<Conversation>,
});
const { chat, setConversation } = useChatStore();
</script>

<template>
    <div>
        <div
            v-for="conversation in chat.conversations"
            class="flex p-4 border-b border-gray-200 dark:border-gray-800 cursor-pointer hover:bg-sky-400/50"
            :class="{
                'bg-sky-400/50': conversation.id === chat.currentConversation,
            }"
            :key="conversation.id"
            @click="setConversation(conversation.id)"
        >
            <div class="flex-1 flex justify-between">
                <span>{{ conversation.id }}</span>
                <span>
                    <i>
                        {{
                            useTimeAgo(conversation.createdAt).value.replace(
                                '"',
                                ''
                            )
                        }}
                    </i>
                </span>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
