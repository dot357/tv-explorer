import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'


// helper tye for testing
type Show = {
  id: number
  name: string
  genres?: string[]
  rating?: { average?: number | null }
}

const show = (id: number, name: string, rating: number | null, genres: string[]): Show => ({
  id, name, genres, rating: { average: rating }
})

const makePageStub = (initial: Show[] | null = null) => {
  const data = ref<Show[] | null>(initial)
  const loading = ref(false)
  const error = ref<any>(null)
  const refresh = vi.fn()
  return { data, loading, error, refresh }
}


const pagesPool: Array<ReturnType<typeof makePageStub>> = []

vi.mock('../composables/useShowsPage', () => ({
  useShowsPage: (index: number) => {
    if (!pagesPool[index]) {pagesPool[index] = makePageStub([])}
    return pagesPool[index]
  },
}))

// ! : Important : Import it here due to mock above
import { useGenreBuckets } from '../composables/useGenreBuckets'

beforeEach(() => {
   pagesPool.length = 0
})


describe('useGenreBuckets', () => {
  it('creates empty buckets for the provided genres when no data', () => {
    // prepare two empty pages
    pagesPool[0] = makePageStub([])
    pagesPool[1] = makePageStub([])

    const genres = ['Drama', 'Comedy', 'Action']
    const { buckets, loading, error } = useGenreBuckets(genres, { pagesToScan: 2 })

    expect(loading.value).toBe(false)
    expect(error.value).toBe(null)
    // Map contains all provided genres with empty arrays
    expect([...buckets.value.keys()]).toEqual(genres)
    for (const arr of buckets.value.values()) {expect(arr).toHaveLength(0)}
  })

  it('fills buckets only for provided genres and respects perGenreLimit', () => {
    // Page 0 has mixed genres
    pagesPool[0] = makePageStub([
      show(1, 'A', 9.2, ['Drama']),
      show(2, 'B', 8.7, ['Drama', 'Action']),
      show(3, 'C', 7.5, ['Comedy']),
      show(4, 'D', 9.6, ['Sci-Fi']), // not in provided genres
    ])
    // Page 1 has more for Drama/Action
    pagesPool[1] = makePageStub([
      show(5, 'E', 9.0, ['Drama']),
      show(6, 'F', 8.9, ['Action']),
      show(7, 'G', 8.8, ['Action']),
    ])

    const { buckets } = useGenreBuckets(['Drama', 'Action'], {
      pagesToScan: 2,
      perGenreLimit: 2,
    })

    const drama = buckets.value.get('Drama')!
    const action = buckets.value.get('Action')!

    // limit respected
    expect(drama).toHaveLength(2)
    expect(action).toHaveLength(2)

    // sorted by rating desc
    expect(drama.map(s => s.name)).toEqual(['A', 'E']) // 9.2, 9.0
    expect(action.map(s => s.name)).toEqual(['F', 'G']) // 8.9, 8.8

    // no bucket created for Sci‑Fi since it was not provided
    expect(buckets.value.get('Sci-Fi')).toBeUndefined()
  })

  it('filters by minRating before adding to buckets', () => {
    pagesPool[0] = makePageStub([
      show(1, 'Low', 6.0, ['Comedy']),
      show(2, 'High', 8.5, ['Comedy']),
      show(3, 'Null', null, ['Comedy']),
    ])
    const { buckets } = useGenreBuckets(['Comedy'], {
      pagesToScan: 1,
      minRating: 7.0,
    })
    const comedy = buckets.value.get('Comedy')!
    expect(comedy.map(s => s.name)).toEqual(['High'])
  })

  it('loading is true if any page is loading; error surfaces first error', () => {
    const p0 = makePageStub([])
    const p1 = makePageStub([])
    p1.loading.value = true
    pagesPool[0] = p0
    pagesPool[1] = p1

    const { loading, error } = useGenreBuckets(['Drama'], { pagesToScan: 2 })
    expect(loading.value).toBe(true)
    expect(error.value).toBe(null)

    // flip to error
    p1.loading.value = false
    p1.error.value = new Error('Boom')
    expect(loading.value).toBe(false)
    expect(error.value?.message).toBe('Boom')
  })

  it('refreshAll calls refresh on each page', () => {
    const p0 = makePageStub([])
    const p1 = makePageStub([])
    pagesPool[0] = p0
    pagesPool[1] = p1

    const { refreshAll } = useGenreBuckets(['Drama'], { pagesToScan: 2 })
    refreshAll()
    expect(p0.refresh).toHaveBeenCalledTimes(1)
    expect(p1.refresh).toHaveBeenCalledTimes(1)
  })

  it('watchEffect triggers initial refresh for pages with no data/loading/error', () => {
    const p0 = makePageStub(null) // no data yet
    const p1 = makePageStub([])   // has data
    pagesPool[0] = p0
    pagesPool[1] = p1

    useGenreBuckets(['Drama'], { pagesToScan: 2 })
    // p0 had null data, not loading, no error => should refresh
    expect(p0.refresh).toHaveBeenCalledTimes(1)
    // p1 already had data => should not refresh automatically
    expect(p1.refresh).not.toHaveBeenCalled()
  })

  it('updates buckets reactively when page data changes', () => {
    const p0 = makePageStub([])
    const p1 = makePageStub([])
    pagesPool[0] = p0
    pagesPool[1] = p1

    const { buckets } = useGenreBuckets(['Drama'], { pagesToScan: 2, perGenreLimit: 3 })
    expect(buckets.value.get('Drama')!).toHaveLength(0)

    // later, data arrives
    p0.data.value = [
      show(1, 'A', 8.0, ['Drama']),
      show(2, 'B', 9.0, ['Drama']),
    ]
    p1.data.value = [
      show(3, 'C', 7.5, ['Drama']),
    ]

    const names = (buckets.value.get('Drama') ?? []).map(s => s.name)
    // sorted desc: B (9.0), A (8.0), C (7.5)
    expect(names).toEqual(['B', 'A', 'C'])
  })
})