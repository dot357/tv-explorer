<script setup lang="ts">
import { Button } from 'primevue';
import TestComponent from '@components/TestComponent.vue';
import { onMounted } from 'vue';
import { NetworkHandler } from '@services/NetworkHandler';
import { tvAdapter } from '@services/tv.adapter';
import TestSearchComponent from './components/TestSearchComponent.vue';



onMounted(async () => {
  const nh = new NetworkHandler(tvAdapter);
  const {
    data,
    status,
    loading,
    error,
    run
  } = nh.useRequest('getShowsPage', { page : 0})

   await  run()

   console.log(data.value)
   console.log(status.value)
   console.log(loading.value)
   console.log(error.value)


  // console.log(await tvAdapter.execute('getShowsPage', { page : 0 }))
})

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
  

 <div class="">
  <h1>
    TV Explorer
  </h1>
<!-- 
  <div class="bg-bg text-text p-4 rounded-xl shadow-card">
  <p class="text-muted">Hello tokens 👋</p>
  <button class="ring-focus rounded-md px-4 py-2 bg-primary/15 hover:bg-primary/20">
    Action
  </button>
</div> -->

<TestSearchComponent />

  <section class="card">
    
     <Button label="Switch theme" class="btn" icon="pi pi-plus" @click="switchTheme" />
    <div class="chip">
      test
    </div>
     <section class="bg-bg">
      <TestComponent /> 
     </section>

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

