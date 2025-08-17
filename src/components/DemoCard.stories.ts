import DemoCard from './DemoCard.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

export default {
  title: 'Components/DemoCard',
  component: DemoCard,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof DemoCard>;

export const Default: StoryObj<typeof DemoCard> = {};
