// Хранилище кэша готовых страниц (swr в routeRules, nuxt.config.ts).
// Ограничиваем число страниц в памяти: адреса с уникальными метками
// (yclid, utm и т.п.) иначе копились бы в памяти до следующего деплоя.
import { defineDriver } from 'unstorage'

const MAX_ENTRIES = Number(process.env.PAGE_CACHE_MAX || 300)

const lruMemory = defineDriver(() => {
  const data = new Map<string, unknown>()

  return {
    name: 'page-cache-lru',
    hasItem: (key) => data.has(key),
    getItem(key) {
      if (!data.has(key)) return null
      const value = data.get(key)
      data.delete(key)
      data.set(key, value)
      return value
    },
    setItem(key, value) {
      data.delete(key)
      data.set(key, value)
      while (data.size > MAX_ENTRIES) {
        data.delete(data.keys().next().value as string)
      }
    },
    removeItem(key) {
      data.delete(key)
    },
    getKeys: () => [...data.keys()],
    clear() {
      data.clear()
    },
  }
})

export default defineNitroPlugin(async () => {
  const storage = useStorage()
  await storage.unmount('cache')
  storage.mount('cache', lruMemory())
})
