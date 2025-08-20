<script setup lang="ts">
import GenerateTailwindStaticsClassesComponent from '@components/GenerateTailwindStaticsClassesComponent.vue'
import SearchComponent from '@/components/SearchComponent.vue';
import AppHeader from '@components/AppHeader.vue';
</script>

<template>
  <!-- Skip link (visible on focus) -->
  <a href="#main-content" class="sr-only focus:not-sr-only">Skip to main content</a>

  <div class="px-4 py-4 relative">
    <AppHeader /> 

   
 
    <div class="px-4 mt-4">
      <SearchComponent />
    </div>

    <!-- Main section with landmark role and focus target -->
    <section id="main-content" role="main" tabindex="-1" class="mt-4">
      <router-view />
    </section>

    <GenerateTailwindStaticsClassesComponent />
  </div>
</template>
