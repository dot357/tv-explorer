<script setup lang="ts">
import { Button } from 'primevue';




function switchTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  if (currentTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }

}
</script>

<template>
  

 
 <div>
    <Button label="Switch theme" class="btn" icon="pi pi-plus" @click="switchTheme" />
    <router-view />
 </div>
</template>

