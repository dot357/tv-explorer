import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import { provideTheme, useTheme } from '../composables/theme'


describe('theme composable', () => {
  let setItemSpy: ReturnType<typeof vi.spyOn>
  let getItemSpy: ReturnType<typeof vi.spyOn>
  let matchMediaSpy: any

  beforeEach(() => {
    // reset DOM
    document.documentElement.className = ''
    document.documentElement.removeAttribute('data-theme')

    // mock localStorage
    setItemSpy = vi.spyOn(window.localStorage.__proto__, 'setItem')
    getItemSpy = vi.spyOn(window.localStorage.__proto__, 'getItem')
    setItemSpy.mockClear()
    getItemSpy.mockClear()

    // mock matchMedia
    matchMediaSpy = vi.spyOn(window, 'matchMedia')
    matchMediaSpy.mockReturnValue({ matches: false, addListener: vi.fn(), removeListener: vi.fn() })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  function mountWithProvider() {
    return mount(defineComponent({
      setup() {
        const { theme, isDark, toggleTheme } = provideTheme()
        return { theme, isDark, toggleTheme }
      },
      render() {
        return h('div')
      }
    }))
  }


  it('initializes theme to light by default', () => {
    const wrapper = mountWithProvider()
    expect(wrapper.vm.theme).toBe('light')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('initializes theme from localStorage if present', () => {
    getItemSpy.mockReturnValue('dark')
    const wrapper = mountWithProvider()
    expect(wrapper.vm.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('initializes theme from prefers-color-scheme if no saved theme', () => {
    getItemSpy.mockReturnValue(null)
    matchMediaSpy.mockReturnValue({ matches: true })
    const wrapper = mountWithProvider()
    expect(wrapper.vm.theme).toBe('dark')
  })

  it('toggles theme correctly', async () => {
    const wrapper = mountWithProvider()
    expect(wrapper.vm.isDark).toBe(false)

    wrapper.vm.toggleTheme()
    await nextTick()

    expect(wrapper.vm.isDark).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(setItemSpy).toHaveBeenCalledWith('theme', 'dark')
  })

  it('dispatches theme-changed custom event', async () => {
    const eventSpy = vi.fn()
    window.addEventListener('theme-changed', eventSpy)

    const wrapper = mountWithProvider()
    wrapper.vm.toggleTheme()
    await nextTick()

    expect(eventSpy).toHaveBeenCalled()
  })

  it('useTheme throws error if not provided', () => {
    const badMount = () => mount(defineComponent({
      setup() {
        // no provideTheme called
        return useTheme()
      },
      render() {
        return h('div')
      }
    }))
    expect(badMount).toThrowError(/Theme not provided/)
  })
})
