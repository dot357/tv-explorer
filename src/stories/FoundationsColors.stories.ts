import { defineComponent } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const Swatch = defineComponent({
  name: 'Swatch',
  template: `
    <div class="grid gap-3 w-[560px]">
      <div class="grid gap-3 w-[560px]">
        <div class="rounded-xl p-4 bg-bg text-text ring-1 ring-white/10">
          <div class="text-sm text-muted">bg-bg + text-text</div>
        </div>

        <div class="rounded-xl p-4 bg-surface text-text ring-1 ring-white/10">
          <div class="text-sm text-muted">bg-surface + text-muted</div>
          <div class="mt-2 inline-flex items-center gap-2">
            <span class="px-2 py-0.5 rounded-full text-xs bg-primary/15">primary</span>
            <span class="px-2 py-0.5 rounded-full text-xs bg-accent/15">accent</span>
            <span class="px-2 py-0.5 rounded-full text-xs bg-success/15">success</span>
            <span class="px-2 py-0.5 rounded-full text-xs bg-warn/15">warn</span>
            <span class="px-2 py-0.5 rounded-full text-xs bg-error/15">error</span>
          </div>
        </div>

        <div class="rounded-xl p-4 bg-surface ring-1 ring-white/10">
          <div class="text-sm text-muted mb-2">Spacing scale</div>
          <div class="flex items-center gap-4">
            <div class="h-2 w-8  bg-primary/40 rounded"></div>
            <div class="h-2 w-12 bg-primary/40 rounded"></div>
            <div class="h-2 w-16 bg-primary/40 rounded"></div>
            <div class="h-2 w-24 bg-primary/40 rounded"></div>
            <div class="h-2 w-32 bg-primary/40 rounded"></div>
          </div>
          <div class="mt-2 text-xs text-muted">8 • 12 • 16 • 24 • 32</div>
        </div>
      </div>
    </div>
  `,
});

const meta: Meta<typeof Swatch> = {
  title: 'Design System/Foundations/Colors & Spacing',
  component: Swatch,
  parameters: { layout: 'centered' },
};
export default meta;

export const Demo: StoryObj<typeof Swatch> = {};
