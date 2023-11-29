<script setup>
const colorMode = useColorMode();

const isDark = computed({
    get() {
        return colorMode.value === 'dark';
    },
    set() {
        colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
    },
});
</script>

<template>
    <header
        className="bg-background/75 backdrop-blur border-b border-gray-200 dark:border-gray-800 -mb-px sticky top-0 z-50"
    >
        <div
            class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex items-center justify-between gap-3 h-[4rem]"
        >
            <NuxtLink to="/">Nuxt AI</NuxtLink>
            <div class="flex items-center justify-end lg:flex-1 gap-1.5">
                <ClientOnly>
                    <UButton
                        :icon="
                            isDark
                                ? 'i-heroicons-moon-20-solid'
                                : 'i-heroicons-sun-20-solid'
                        "
                        color="gray"
                        variant="ghost"
                        aria-label="Theme"
                        @click="isDark = !isDark"
                    />

                    <template #fallback>
                        <div class="w-8 h-8" />
                    </template>
                </ClientOnly>
            </div>
        </div>
    </header>
</template>
<style scoped></style>
