<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import { z } from 'zod';

const supabaseClient = useSupabaseClient();
const toast = useToast();
const router = useRouter();

const formSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

type Schema = z.infer<typeof formSchema>;
const formState = reactive({
    email: '',
    password: '',
});
const authenticating = ref(false);
const onLogin = async (event: FormSubmitEvent<Schema>) => {
    authenticating.value = true;
    const { error } = await supabaseClient.auth.signInWithPassword({
        email: event.data.email,
        password: event.data.password,
    });

    authenticating.value = false;

    if (error) {
        toast.add({ title: error.message });
        return;
    }

    router.push('/');
};
</script>

<template>
    <UForm
        :schema="formSchema"
        :state="formState"
        class="space-y-4"
        @submit="onLogin"
    >
        <UFormGroup label="Email" name="email">
            <UInput v-model="formState.email" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
            <UInput v-model="formState.password" type="password" />
        </UFormGroup>

        <UButton type="submit" :loading="authenticating"> Login </UButton>
    </UForm>
</template>

<style></style>
