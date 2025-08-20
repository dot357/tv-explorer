// src/stories/Foundations/Genres.stories.ts
import type { Meta, StoryObj } from '@storybook/vue3';
import { showGenres } from '@/data/genres';
import { genreColorClass, genreBgClass } from '@/utils/genreClass';
import { defineComponent } from 'vue';

const Demo = defineComponent({
  setup() { return { showGenres, genreColorClass, genreBgClass }; },
  template: `
  <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
    <div v-for="g in showGenres" :key="g.name"
         class="p-3 rounded-xl border border-white/10">
      <div :class="['genre-chip', genreColorClass(g.name), genreBgClass(g.name, 14)]">
        {{ g.name }}
      </div>
      <div class="mt-2 text-xs text-muted">
        class: {{ genreColorClass(g.name) }} bg : {{ genreBgClass(g.name, 14) }}
      </div>
    </div>
  </div>`
});

export default { title: 'Design System/Foundations/Genres', component: Demo } satisfies Meta<typeof Demo>;
export const All: StoryObj<typeof Demo> = {};
