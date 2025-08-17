<script setup lang="ts">
import { Button } from 'primevue';
import TestComponent from '@components/TestComponent.vue';
</script>

<template>
  

 <div>
  <h1>
    TV Explorer
  </h1>

  <section>
     <Button label="Hello World" icon="pi pi-plus" />

     <TestComponent />

  <Button
    label="Search asd"
    icon="pi pi-search"
    unstyled
    pt:root="bg-teal-200 hover:bg-teal-700 active:bg-teal-900 cursor-pointer py-2 px-4 rounded-full border-0 flex gap-2"
    pt:label="text-white font-bold text-lg"
    pt:icon="text-white text-xl"
/>
  </section>
 </div>
</template>

