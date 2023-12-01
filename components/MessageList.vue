<script lang="ts" setup>
const { chat } = useChatStore();
const user = useSupabaseUser();
const isLoggedIn = computed(() => !!user.value);
const avatar = computed(() => {
    if (!isLoggedIn.value) return null;

    return (
        user.value?.user_metadata.avatar_url ??
        '/images/avatars/default-avatar.png'
    );
});
</script>

<template>
    <div class="p-4">
        <div
            v-for="(message, idx) in chat.messages"
            :key="idx"
            class="flex w-full p-8 dark:bg-sky-600 bg-sky-400 rounded-lg mb-8"
        >
            <UAvatar
                :src="
                    message.role === 'human'
                        ? avatar
                        : '/images/avatars/default-avatar.png'
                "
                alt="Avatar"
            />
            <p class="ml-4" :class="{ 'line-through': !message.delivered }">
                {{ message.content }}
            </p>
        </div>
    </div>
</template>

<style scoped></style>
