<script lang="ts" setup>
const supabaseClient = useSupabaseClient();
const toast = useToast();

const tabs = [
    {
        key: 'login',
        label: 'Login',
    },
    {
        key: 'register',
        label: 'Register',
    },
];

const oauthLogin = async (type: 'github' | 'discord') => {
    const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: type,
    });

    if (error) {
        toast.add({ title: 'Something went wrong' });
    }
};
</script>

<template>
    <UContainer class="max-w-3xl mt-10">
        <UTabs :items="tabs" class="w-full">
            <template #item="{ item }">
                <UCard>
                    <div v-if="item.key === 'login'">
                        <LoginForm />
                    </div>
                    <div v-else-if="item.key === 'register'">
                        <RegisterForm />
                    </div>
                </UCard>
            </template>
        </UTabs>
        <UDivider label="OR" class="mt-4" />
        <div class="flex justify-center mt-4">
            <UButton
                icon="i-grommet-icons-github"
                color="gray"
                variant="ghost"
                aria-label="Github"
                @click="oauthLogin('github')"
            />
            <UButton
                icon="i-logos-discord-icon"
                color="gray"
                variant="ghost"
                aria-label="Discord"
                @click="oauthLogin('discord')"
            />
        </div>
    </UContainer>
</template>

<style></style>
