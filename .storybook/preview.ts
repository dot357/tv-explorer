import type { Preview } from '@storybook/vue3';
import { setup } from '@storybook/vue3';
import { watch, defineComponent } from 'vue';
import PrimeVue from 'primevue/config';

// styles
import 'primeicons/primeicons.css';
import '../public/tokens.css';
import '../src/assets/styles/foundations.css';
import '../src/assets/styles/recipes.css';

// register Vue plugins
setup((app) => {
  app.use(PrimeVue);
});

const preview: Preview = {
  // Wrap every story so we can apply data-theme and keep page padding/background
  decorators: [
    (story, context) => {
      const S = story();
      const Wrapper = defineComponent({
        components: { S },
        setup() {
          const theme = (context.globals as unknown).theme ?? 'dark';

          // set on mount + watch for toolbar changes
          const setTheme = (t: string) =>
            document.documentElement.setAttribute('data-theme', t);
          setTheme(theme);
          watch(
            () => (context.globals as any).theme,
            (t: string) => setTheme(t),
            { immediate: false }
          );

          return { theme };
        },
        template: `
          <div class="min-h-screen p-6 bg-bg text-text">
            <S />
          </div>
        `,
      });
      return { components: { Wrapper }, template: '<Wrapper />' };
    },
  ],

  // define the toolbar control + default (no separate `globals` field)
  globalTypes: {
    theme: {
      name: 'Theme',
      defaultValue: 'dark',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'dark', title: 'Dark' },
          { value: 'light', title: 'Light' },
        ],
      },
    },
  },

  parameters: {
    layout: 'fullscreen',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { test: 'todo' },
  },
};

export default preview;
