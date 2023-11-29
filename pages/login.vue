<script lang="ts" setup>
const supabaseClient = useSupabaseClient();
const toast = useToast();
const login = async (type: 'email' | 'github') => {
    if (type === 'github') {
        const { error } = await supabaseClient.auth.signInWithOAuth({
            provider: type,
        });

        if (error) {
            toast.add({ title: 'Something went wrong' });
        }
    }
};
</script>

<template>
    <UContainer class="max-w-3xl mt-10">
        <UCard>
            <template #header> Login </template>
            <h1>Hello</h1>
            <template #footer>
                <div class="flex justify-center">
                    <UButton
                        icon="i-grommet-icons-github"
                        color="gray"
                        variant="ghost"
                        aria-label="Github"
                        @click="login('github')"
                    />
                </div>
            </template>
        </UCard>
    </UContainer>
</template>

<style></style>
