import { useArticleStore } from './article'
import { useSettingsStore } from './settings'
import { useStatsStore } from './stats'
import { useAIStore } from './ai'

export function initStores() {
  const articleStore = useArticleStore()
  const settingsStore = useSettingsStore()
  const statsStore = useStatsStore()
  const aiStore = useAIStore()

  articleStore.loadFromStorage()
  settingsStore.init()
  statsStore.loadFromStorage()
  aiStore.loadFromStorage()
}
