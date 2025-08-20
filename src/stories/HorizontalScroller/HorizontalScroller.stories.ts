import type { Meta, StoryObj } from '@storybook/vue3'
import HorizontalScroller from '@/components/HorizontalScroller.vue'
import ShowCard from '@/components/ShowCard.vue'
import { shows } from './data'



const meta: Meta<typeof HorizontalScroller> = {
  title: 'Components/HorizontalScroller',
  component: HorizontalScroller,
  args: {
    label: 'Drama',
    showControls: true,
  },
  render: (args) => ({
    components: { HorizontalScroller, ShowCard },
    setup() {
      const items = shows
      return { args, items }
    },
    template: `
      <HorizontalScroller v-bind="args">
        <template #default>
          <ul class="flex gap-4" role="none">
            <ShowCard
              v-for="(s,index) in items"
              :key="index"
              :show="s"
              as="a"
              :href="'/show/' + s.id"
            />
          </ul>
        </template>
      </HorizontalScroller>
    `,
  }),
}
export default meta

export const WithShowCards: StoryObj<typeof HorizontalScroller> = {}

export const NoControls: StoryObj<typeof HorizontalScroller> = {
  args: { label: 'Action', showControls: false },
}
