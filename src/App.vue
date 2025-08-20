<script setup lang="ts">
import { Button } from 'primevue';
import GenerateTailwindStaticsClassesComponent from '@components/GenerateTailwindStaticsClassesComponent.vue'
import { provideTheme } from '@/composables/theme'

const { isDark, toggleTheme } = provideTheme()
</script>

<template>
  <!-- Skip link (visible on focus) -->
  <a href="#main-content" class="sr-only focus:not-sr-only">Skip to main content</a>

  <div class="px-4 py-4">
    <Button
      :label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
      class="btn"
      :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
      @click="toggleTheme"
      role="switch"
      :aria-checked="isDark"
      :aria-label="isDark ? 'Currently dark theme. Switch to light theme' : 'Currently light theme. Switch to dark theme'"
    />

    <!-- Main section with landmark role and focus target -->
    <section id="main-content" role="main" tabindex="-1" class="mt-4">
      <router-view />
    </section>

    <GenerateTailwindStaticsClassesComponent />
  </div>
</template>
