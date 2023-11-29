<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import { z } from 'zod';

const supabaseClient = useSupabaseClient();
const router = useRouter();
const toast = useToast();

const formSchema = z.object({
    name: z.string().refine((name) => name.length > 0, 'Name is required'),
    email: z.string().email(),
    password: z
        .string()
        .refine(
            (password) => password.length >= 8,
            'Password must be at least 8 characters long'
        ),
});

type Schema = z.infer<typeof formSchema>;
const formState = reactive({
    name: '',
    email: '',
    password: '',
});
const authenticating = ref(false);

const onRegister = async (event: FormSubmitEvent<Schema>) => {
    authenticating.value = true;
    const { error } = await supabaseClient.auth.signUp({
        email: event.data.email,
        password: event.data.password,
        options: {
            data: {
                name: event.data.name,
            },
        },
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
        @submit="onRegister"
    >
        <UFormGroup label="Name" name="name">
            <UInput v-model="formState.name" />
        </UFormGroup>
        <UFormGroup label="Email" name="email">
            <UInput v-model="formState.email" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
            <UInput v-model="formState.password" type="password" />
        </UFormGroup>

        <UButton type="submit" :loading="authenticating"> Register </UButton>
    </UForm>
</template>

<style></style>
