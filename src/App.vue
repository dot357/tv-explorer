<script setup lang="ts">
import SearchComponent from '@/components/SearchComponent.vue';
import AppHeader from '@components/AppHeader.vue';
import TailwindGenerator from '@/components/TailwindGenerator.vue'
</script>

<template>
  <!-- Skip link (visible on focus) -->
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only"
  >Skip to main content</a>

  <div class="px-4 py-4 relative">
    <AppHeader /> 

   
 
    <div class="px-4 mt-4">
      <SearchComponent />
    </div>

    <!-- Main section with landmark role and focus target -->
    <section
      id="main-content"
      role="main"
      tabindex="-1"
      class="mt-4"
    >
      <router-view />
    </section>

    <TailwindGenerator />
  </div>
</template>
