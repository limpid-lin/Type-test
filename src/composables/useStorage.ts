import { STORAGE_KEYS } from '@/utils'

export function useStorage() {
  const get = <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue ?? null
    } catch {
      return defaultValue ?? null
    }
  }

  const set = <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }

  const remove = (key: string): void => {
    localStorage.removeItem(key)
  }

  const getArticlesCN = () => get(STORAGE_KEYS.ARTICLES_CN, {})
  const getArticlesEN = () => get(STORAGE_KEYS.ARTICLES_EN, {})
  const setArticlesCN = (value: any) => set(STORAGE_KEYS.ARTICLES_CN, value)
  const setArticlesEN = (value: any) => set(STORAGE_KEYS.ARTICLES_EN, value)
  const getStats = () => get(STORAGE_KEYS.STATS, [])
  const setStats = (value: any) => set(STORAGE_KEYS.STATS, value)

  return {
    get,
    set,
    remove,
    getArticlesCN,
    getArticlesEN,
    setArticlesCN,
    setArticlesEN,
    getStats,
    setStats
  }
}
