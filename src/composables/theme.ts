import { ref, computed, provide, inject, watch, type Ref } from 'vue'

export type Theme = 'light' | 'dark'
const THEME_KEY = Symbol('theme')
const IS_DARK_KEY = Symbol('isDark')
const TOGGLE_KEY = Symbol('toggleTheme')

function applyTheme(isDark: boolean) {
  const root = document.documentElement
  root.classList.toggle('dark', isDark)
  root.setAttribute('data-theme', isDark ? 'dark' : 'light')
}

export function provideTheme() {
  // inherit current
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  const saved = (localStorage.getItem('theme') as Theme | null)
  const theme = ref<Theme>(saved ?? (prefersDark ? 'dark' : 'light'))
  const isDark = computed(() => theme.value === 'dark')

  // init and persist
  applyTheme(isDark.value)
  watch(isDark, (d) => {
    localStorage.setItem('theme', d ? 'dark' : 'light')
    applyTheme(d)
    // custom event
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: { isDark: d } }))
  }, { immediate: false })

  function toggleTheme() { theme.value = isDark.value ? 'light' : 'dark' }

  provide(THEME_KEY, theme as Ref<Theme>)
  provide(IS_DARK_KEY, isDark)
  provide(TOGGLE_KEY, toggleTheme)

  return { theme, isDark, toggleTheme }
}

export function useTheme() {
  const theme = inject<Ref<Theme>>(THEME_KEY)
  const isDark = inject<ReturnType<typeof computed>>(IS_DARK_KEY)
  const toggleTheme = inject<() => void>(TOGGLE_KEY)
  if (!theme || !isDark || !toggleTheme) throw new Error('Theme not provided')
  return { theme, isDark, toggleTheme }
}
