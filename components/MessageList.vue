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
    <div class="p-4"></div>
</template>

<style scoped></style>
