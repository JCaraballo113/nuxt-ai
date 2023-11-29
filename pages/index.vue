<script setup lang="ts">
const user = useSupabaseUser();

const isLoggedIn = computed(() => !!user.value);
</script>
<template>
    <UContainer class="flex flex-col mt-20 p-8 items-center text-center">
        <h1 class="text-4xl">A Nuxt AI Application</h1>
        <h2 class="text-2xl mt-4">
            Made with <UIcon name="i-raphael-fave" class="text-red-600" /> using
            <UIcon name="i-logos-nuxt-icon" class="icon" />
            + <UIcon name="i-logos-supabase-icon" />
            and langchain
        </h2>
        <UButton
            v-if="!isLoggedIn"
            label="Get Started"
            to="/login"
            class="mt-8 text-xs md:text-lg"
        />
    </UContainer>
</template>

<style scoped></style>
