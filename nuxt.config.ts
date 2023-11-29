// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: ['@nuxt/content', '@nuxt/ui', '@nuxtjs/supabase'],
    supabase: {
        redirectOptions: {
            login: '/login',
            callback: '/confirm',
            exclude: ['/'],
        },
    },
    ui: {
        icons: ['heroicons', 'grommet-icons'],
    },
});
