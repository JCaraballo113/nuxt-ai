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
    <div class="p-4" ref="el">
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
            <p
                v-if="message.status !== MESSAGE_STATUS.PENDING"
                class="ml-4"
                :class="{
                    'line-through': message.status === MESSAGE_STATUS.FAILED,
                }"
            >
                {{ message.content }}
            </p>
            <div class="flex w-full justify-center" v-else>
                <UIcon name="i-heroicons-arrow-path" class="spin text-3xl" />
            </div>
        </div>
    </div>
</template>
<style scoped>
@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.spin {
    animation: spin 1s linear infinite;
}
</style>
