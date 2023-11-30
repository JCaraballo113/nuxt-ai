<template>
    <footer
        class="bg-background/75 backdrop-blur z-50 absolute bottom-0 flex items-center justify-center h-24 p-8 w-full border-t border-gray-200 dark:border-gray-800"
    >
        <span class="flex items-center">
            Made with
            <UIcon name="i-raphael-fave" class="mx-1 text-red-600" /> by John
            Caraballo
        </span>
        <div class="ml-auto">
            <UButton
                icon="i-grommet-icons-github"
                color="gray"
                variant="ghost"
                aria-label="Github"
                class="hover:text-purple-600 dark:hover:text-purple-400"
                to="https://github.com/JCaraballo113"
                target="_blank"
            />
            <UButton
                icon="i-grommet-icons-twitter"
                color="gray"
                variant="ghost"
                aria-label="Twitter"
                class="hover:text-sky-600 dark:hover:text-sky-400"
                to="https://twitter.com/@john_m_codes"
                target="_blank"
            />
            <UButton
                icon="i-grommet-icons-linkedin"
                color="gray"
                variant="ghost"
                aria-label="Linkedin"
                class="hover:text-sky-600 dark:hover:text-sky-400"
                to="https://www.linkedin.com/in/johncaraballo/"
                target="_blank"
            />
            <UButton
                icon="i-simple-icons-upwork"
                color="gray"
                variant="ghost"
                aria-label="Upwork"
                class="hover:text-green-600 dark:hover:text-green-400"
                to="https://www.upwork.com/freelancers/~01afcabc0b9b8c28e6"
                target="_blank"
            />
        </div>
    </footer>
</template>

<script lang="ts" setup></script>

<style scoped>
.icon:hover {
    color: red;
}
</style>
