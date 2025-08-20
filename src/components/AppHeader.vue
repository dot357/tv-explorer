
<script setup lang="ts">
import { Button } from 'primevue';
import { provideTheme } from '@/composables/theme'
const props = defineProps<{ appName?: string }>()


const { isDark, toggleTheme } = provideTheme()

</script>

<template>

   
    <header  class=" z-10 w-full bg-surface-100 flex flex-row justify-between px-4">
        <RouterLink to="/">
            <span class="font-semibold tracking-tight">
                {{ props.appName ?? 'TV Explorer' }}
            </span>
        </RouterLink>
        <Button     
            class="btn bg-surface/90 hover:bg-surface/80 active:bg-surface/70 ring-1 ring-black/10 dark:ring-white/10"
            :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
            @click="toggleTheme"
            role="switch"
            :aria-checked="isDark"
            :aria-label="isDark ? 'Currently dark theme. Switch to light theme' : 'Currently light theme. Switch to dark theme'"           
        />

    </header>

</template>