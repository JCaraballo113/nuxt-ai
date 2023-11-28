<template>
    <Navbar />
    <div class="mt-4 p-8">
        <UCard>
            <template #header>
                <h1>What would you like to write about today?</h1>
            </template>
            <UInput
                type="text"
                placeholder="Best practices writing Nuxt components"
                v-model="chatInput"
            />
        </UCard>
    </div>
</template>

<script setup lang="ts">
const chatInput = ref();
</script>
