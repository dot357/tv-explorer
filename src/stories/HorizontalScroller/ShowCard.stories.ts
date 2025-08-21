import type { Meta, StoryObj } from '@storybook/vue3'
import ShowCard from '@/components/ShowCard.vue'
import type { Show } from '@/types/adapters/tv.adaptersTypes'
import { shows } from '../data/data'

// Use the first item as the base fixture
const baseShow = (shows?.[0] ?? {
  id: 1,
  name: 'Sample Show',
  rating: { average: 7.8 },
  image: { medium: '', original: '' },
  genres: ['Drama', 'Thriller', 'Mystery'],
}) as Show

const meta: Meta<typeof ShowCard> = {
  title: 'Cards/ShowCard',
  component: ShowCard,
  args: {
    show: baseShow,
    as: 'div',
    href: undefined,
    openInNewTab: false,
  },
  argTypes: {
    as: {
      control: { type: 'inline-radio' },
      options: ['div', 'a'],
      description: 'Wrapper element',
    },
    href: {
      control: 'text',
      if: { arg: 'as', eq: 'a' },
      description: 'Target URL when `as="a"`',
    },
    openInNewTab: {
      control: 'boolean',
      description: 'Add rel + target when link',
    },
    show: {
      control: 'object',
      description: 'Show data object',
    },
  },
  parameters: {
    layout: 'centered',
    // optional: try light/dark backgrounds without Tailwind dark class
    backgrounds: {
      default: 'surface',
      values: [
        { name: 'surface', value: 'hsl(210 30% 98%)' },
        { name: 'dark-surface', value: 'hsl(210 30% 10%)' },
      ],
    },
  },
}
export default meta
type Story = StoryObj<typeof ShowCard>

export const Default: Story = {}

export const AsLink: Story = {
  args: {
    as: 'a',
    href: 'https://example.com',
    openInNewTab: true,
  },
}

export const NoImage: Story = {
  args: {
    show: {
      ...baseShow,
      image: { medium: '', original: '' },
      name: 'No Image Available',
    },
  },
}

export const ManyGenres: Story = {
  args: {
    show: {
      ...baseShow,
      genres: [
        'Action',
        'Adventure',
        'Comedy',
        'Crime',
        'Drama',
        'Fantasy',
        'Horror',
        'Sci-Fi',
        'Thriller',
      ],
    },
  },
}


export const DarkMode: Story = {
  decorators: [
    () => ({
      template: `<div class="dark bg-[hsl(210_35%_6%)] p-6"><story /></div>`,
    }),
  ],
  parameters: {
    backgrounds: { default: 'dark-surface' },
  },
}
