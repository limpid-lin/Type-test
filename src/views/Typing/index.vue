<template>
  <div class="typing-wrapper" :class="{ 'keyboard-expanded': !isKeyboardCollapsed }">
    <div class="mesh-gradient-bg">
      <div class="mesh-layer layer-1"></div>
      <div class="mesh-layer layer-2"></div>
      <div class="mesh-layer layer-3"></div>
      <div class="mesh-layer layer-4"></div>
      <div class="noise-overlay"></div>
    </div>

    <TypingHeader
      @open-selector="openSelector"
      @open-importer="openImporter"
      @openAI="openAI"
      @open-stats="openStats"
      @open-settings="openSettings"
    />

    <main class="main-content" ref="mainContentRef">
      <TypingContent @open-selector="openSelector" />
      <KeyboardMap ref="keyboardMapRef" />
    </main>

    <div v-if="hasArticle" class="progress-bar-wrapper">
      <div class="progress-bar" :style="{ width: `${progressPercent}%` }"></div>
    </div>


    <SettingsPanel ref="settingsPanelRef" @close="closePanel" />
    <ArticleImporter ref="importerRef" @import="handleImport" @imported="handleImport" @close="closePanel" />
    <AIGenerator ref="aiGeneratorRef" @use-article="handleAIGenerate" @close="closePanel" />
    <ArticleSelector ref="selectorRef" @select="handleSelect" @close="closePanel" />
    <StatsPanel ref="statsPanelRef" @close="closePanel" />

    <CompletionModal
      v-if="showCompletionModal"
      :speed="typingSpeed"
      :accuracy="typingAccuracy"
      :time="elapsedTime"
      @restart="handleRestart"
      @next="handleNext"
      @close="closeCompletionModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { useArticleStore } from '@/stores/article'
import { useTypingStore } from '@/stores/typing'
import { useStatsStore } from '@/stores/stats'
import { useAudio } from '@/composables/useAudio'
import { usePinyin } from '@/composables/usePinyin'
import TypingHeader from './TypingHeader.vue'
import TypingContent from './TypingContent.vue'
import KeyboardMap from '@/components/KeyboardMap.vue'
import SettingsPanel from '@/components/SettingsPanel.vue'
import ArticleImporter from '@/components/ArticleImporter.vue'
import AIGenerator from '@/components/AIGenerator.vue'
import ArticleSelector from '@/components/ArticleSelector.vue'
import StatsPanel from '@/components/StatsPanel.vue'
import CompletionModal from './CompletionModal.vue'
import type { Article } from '@/types'

const router = useRouter()
const route = useRoute()
const settingsStore = useSettingsStore()
const articleStore = useArticleStore()
const typingStore = useTypingStore()
const statsStore = useStatsStore()
const { play } = useAudio()
const { convertToPinyin } = usePinyin()

const mainContentRef = ref<HTMLElement | null>(null)
const keyboardMapRef = ref<InstanceType<typeof KeyboardMap>>()
const settingsPanelRef = ref<InstanceType<typeof SettingsPanel>>()
const importerRef = ref<InstanceType<typeof ArticleImporter>>()
const aiGeneratorRef = ref<InstanceType<typeof AIGenerator>>()
const selectorRef = ref<InstanceType<typeof ArticleSelector>>()
const statsPanelRef = ref<InstanceType<typeof StatsPanel>>()

const isKeyboardCollapsed = computed(() => !settingsStore.keyboardVisible)
const hasArticle = computed(() => typingStore.article !== null)
const progressPercent = computed(() => typingStore.progressPercent)
const typingSpeed = computed(() => typingStore.typingSpeed)
const typingAccuracy = computed(() => typingStore.typingAccuracy)
const elapsedTime = computed(() => {
  if (!typingStore.startTime) return 0
  return Math.floor((Date.now() - typingStore.startTime) / 1000)
})

const showCompletionModal = ref(false)
const isPanelOpen = ref(false)

const FUNCTION_KEYS = [
  'Meta', 'Alt', 'Control', 'Escape', 'Tab', 'CapsLock', 'ContextMenu',
  'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  'Home', 'End', 'PageUp', 'PageDown', 'Insert', 'Delete',
  'NumLock', 'ScrollLock', 'Pause',
  'OS'
]

const isFunctionKey = (key: string): boolean => {
  if (key === 'Backspace') return false
  return FUNCTION_KEYS.includes(key) || key.startsWith('Arrow') || key.length > 1
}

const loadArticleFromRoute = () => {
  const { language, id } = route.params
  if (language && id) {
    let articles: Article[] = []
    if (language === 'cn') {
      articles = Object.values(articleStore.articlesCN)
    } else if (language === 'en') {
      articles = Object.values(articleStore.articlesEN)
    } else if (language === 'hanzi') {
      articles = Object.values(articleStore.articlesHanzi)  
    }
    
    const article = articles.find(a => a.id === String(id))
    if (article) {
      typingStore.startTypingWithArticle(article)
    }
  } else {
    typingStore.reset()
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (isPanelOpen.value) return
  if (!typingStore.article || typingStore.isComplete) return
  
  if (typingStore.language === 'hanzi') {
    return
  }

  const { key } = e

  if (isFunctionKey(key)) return

  if (key === ' ') e.preventDefault()

  typingStore.startTimer()

  if (key === 'Backspace') {
    if (typingStore.index > 0) {
      play('delete')
    }
    typingStore.handleKeyPress(key)
  } else if (key.length === 1) {
    const prevIndex = typingStore.index
    typingStore.handleKeyPress(key)
    const newStatus = typingStore.charStatuses[prevIndex]
    if (newStatus === 'correct' || newStatus === 'modified') {
      play('correct')
    } else if (newStatus === 'error') {
      play('error')
    }
  }

  const currentStatus = typingStore.charStatuses[typingStore.index] || ''
  ;(keyboardMapRef.value as any)?.updateKey?.(key, currentStatus)
}

const saveRecord = () => {
  if (!typingStore.article) return
  
  statsStore.addRecord({
    articleId: typingStore.article.id,
    articleTitle: typingStore.article.title,
    language: typingStore.article.language,
    speed: typingStore.typingSpeed,
    accuracy: typingStore.typingAccuracy,
    duration: elapsedTime.value,
    modifiedRatio: 0
  })
}

const openSettings = () => {
  isPanelOpen.value = true
  settingsPanelRef.value?.open()
}

const openImporter = () => {
  isPanelOpen.value = true
  importerRef.value?.open()
}

const openStats = () => {
  isPanelOpen.value = true
  statsPanelRef.value?.open()
}

const openAI = () => {
  isPanelOpen.value = true
  aiGeneratorRef.value?.open()
}

const openSelector = () => {
  isPanelOpen.value = true
  selectorRef.value?.open()
}

const closePanel = () => {
  isPanelOpen.value = false
}

const convertToArticleFormat = (rawArticle: any): Article => {
  if (rawArticle.language === 'cn') {
    let formattedContent
    if (Array.isArray(rawArticle.content)) {
      formattedContent = rawArticle.content
    } else if (typeof rawArticle.content === 'string') {
      // 使用convertToPinyin函数正确处理拼音
      formattedContent = convertToPinyin(rawArticle.content)
    } else {
      formattedContent = []
    }
    
    return {
      id: rawArticle.id || Date.now().toString(),
      title: rawArticle.title || `自定义中文文章-${Object.keys(articleStore.articlesCN).length + 1}`,
      author: rawArticle.author || '',
      dynasty: rawArticle.dynasty || '',
      language: 'cn',
      content: formattedContent
    }
  } else if (rawArticle.language === 'hanzi') {
    let hanziContent
    if (Array.isArray(rawArticle.content)) {
      hanziContent = rawArticle.content
    } else if (typeof rawArticle.content === 'string') {
      const lines = (rawArticle.content as string).split('\n').filter((line: string) => line.trim())
      hanziContent = lines.map((line: string) => {
        return line.split('').map((char: string) => ({
          hanzi: char
        }))
      })
    } else {
      hanziContent = []
    }
    
    return {
      id: rawArticle.id || Date.now().toString(),
      title: rawArticle.title || `汉字练习-${Object.keys(articleStore.articlesHanzi).length + 1}`,
      author: rawArticle.author || '',
      language: 'hanzi',
      content: hanziContent
    }
  } else {
    let enContent
    if (Array.isArray(rawArticle.content)) {
      enContent = rawArticle.content
    } else if (typeof rawArticle.content === 'string') {
      enContent = (rawArticle.content as string).split('\n').filter((line: string) => line.trim())
    } else {
      enContent = []
    }
    
    return {
      id: rawArticle.id || Date.now().toString(),
      title: rawArticle.title || `自定义英文文章-${Object.keys(articleStore.articlesEN).length + 1}`,
      author: rawArticle.author || '',
      language: rawArticle.language || 'en',
      content: enContent
    }
  }
}

const handleImport = (importedArticle: any) => {
  const article = convertToArticleFormat(importedArticle)
  typingStore.startTypingWithArticle(article)
  // play('correct')
}

const handleAIGenerate = (generatedArticle: any) => {
  const article = convertToArticleFormat(generatedArticle)
  typingStore.startTypingWithArticle(article)
  // play('correct')
}

const handleSelect = (selectedArticle: Article) => {
  typingStore.startTypingWithArticle(selectedArticle)
  // play('correct')
  router.push(`/typing/${selectedArticle.language}/${selectedArticle.id}`)
}

const handleRestart = () => {
  if (typingStore.article) {
    typingStore.startTypingWithArticle(typingStore.article)
  }
  showCompletionModal.value = false
}

const handleNext = () => {
  openSelector()
  showCompletionModal.value = false
}

const closeCompletionModal = () => {
  showCompletionModal.value = false
}

watch(() => route.params, () => {
  loadArticleFromRoute()
}, { immediate: true })

watch(() => typingStore.isComplete, (newValue) => {
  if (newValue && !showCompletionModal.value) {
    play('complete')
    saveRecord()
    showCompletionModal.value = true
  }
})

onMounted(() => {
  articleStore.loadFromStorage()
  statsStore.loadFromStorage()
  loadArticleFromRoute()
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped lang="scss">
.typing-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.mesh-gradient-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;

  .mesh-layer {
    position: absolute;
    width: 150%;
    height: 150%;
    top: -25%;
    left: -25%;
    opacity: 0.6;
    filter: blur(80px);
    animation: mesh-float 20s ease-in-out infinite;
  }

  .layer-1 {
    background: radial-gradient(ellipse at 20% 30%, rgba(6, 182, 212, 0.3) 0%, transparent 50%);
    animation-delay: 0s;
  }

  .layer-2 {
    background: radial-gradient(ellipse at 80% 20%, rgba(139, 92, 246, 0.25) 0%, transparent 50%);
    animation-delay: -5s;
  }

  .layer-3 {
    background: radial-gradient(ellipse at 40% 80%, rgba(236, 72, 153, 0.2) 0%, transparent 50%);
    animation-delay: -10s;
  }

  .layer-4 {
    background: radial-gradient(ellipse at 70% 70%, rgba(34, 197, 94, 0.15) 0%, transparent 50%);
    animation-delay: -15s;
  }

  .noise-overlay {
    position: absolute;
    inset: 0;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    pointer-events: none;
  }
}

@keyframes mesh-float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg) scale(1);
  }
  25% {
    transform: translate(2%, 3%) rotate(1deg) scale(1.02);
  }
  50% {
    transform: translate(-1%, 2%) rotate(-1deg) scale(0.98);
  }
  75% {
    transform: translate(1%, -2%) rotate(0.5deg) scale(1.01);
  }
}

.main-content {
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
  padding-top: 80px;
  padding-bottom: 50px;
  box-sizing: border-box;
}

.progress-bar-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 100;

  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary), var(--accent-tertiary));
    transition: width 0.3s ease;
    box-shadow: 0 0 20px rgba(6, 182, 212, 0.5);
  }
}

.keyboard-expanded {
  padding-bottom: 280px;
}
</style>
