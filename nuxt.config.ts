// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: [
        '@nuxt/content',
        '@nuxt/ui',
        '@nuxtjs/supabase',
        '@nuxtjs/google-fonts',
        '@pinia/nuxt',
        '@vueuse/nuxt',
    ],
    supabase: {
        redirectOptions: {
            login: '/login',
            callback: '/confirm',
            exclude: ['/'],
        },
    },
    ui: {
        icons: [
            'heroicons',
            'grommet-icons',
            'logos',
            'raphael',
            'simple-icons',
            'carbon',
        ],
    },
    googleFonts: {
        families: {
            Roboto: true,
            Lato: true,
        },
    },
});
