<template>
  <dialog ref="dialogRef" class="article-selector-dialog">
    <div class="selector-container">
      <div class="selector-header">
        <div class="header-decoration">
          <div class="deco-line"></div>
          <div class="deco-dot"></div>
        </div>
        <h2 class="header-title">选择文章</h2>
        <p class="header-subtitle">挑选一篇开始你的打字练习</p>
        <button class="close-btn" @click="close" aria-label="关闭">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="tabs-container">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          class="tab-item"
          :class="{ active: currentTab === tab.id }"
          @click="currentTab = tab.id"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-name">{{ tab.name }}</span>
          <span class="tab-count">{{ getArticleCount(tab.id) }}</span>
        </button>
      </div>

      <div class="articles-wrapper">
        <TransitionGroup name="article-list" tag="div" class="article-grid">
          <div 
            v-for="(article, index) in filteredArticles" 
            :key="article.id"
            class="article-card"
            :class="{ 
              selected: selectedId === article.id,
              [`card-index-${index % 4}`]: true
            }"
            :style="{ '--delay': `${index * 0.05}s` }"
            @click="selectArticle(article)"
            @dblclick="confirm"
          >
            <div class="card-glow"></div>
            <div class="card-content">
              <div class="card-header">
                <span class="card-number">{{ String(index + 1).padStart(2, '0') }}</span>
              </div>
              
              <h3 class="card-title">{{ article.title }}</h3>
              
              <p class="card-author" v-if="article.language === 'cn' && (article as any).author">
                  <span v-if="(article as any).dynasty">{{ (article as any).dynasty }}</span> · {{ (article as any).author }}
              </p>
              
              <div class="card-meta">
                <span class="meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 6h16M4 12h16M4 18h7"/>
                  </svg>
                  {{ getCharCount(article) }} 字符
                </span>
              </div>

              <div class="card-preview">
                {{ getPreview(article) }}
              </div>
            </div>
            
            <div class="selected-indicator" v-if="selectedId === article.id">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <div class="selector-footer">
        <div class="footer-hint">
          <kbd>双击</kbd> 快速选择
        </div>
        <div class="footer-actions">
          <button class="btn-cancel" @click="close">取消</button>
          <button 
            class="btn-confirm" 
            :disabled="!selectedId"
            @click="confirm"
          >
            <span>开始练习</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useArticleStore } from '@/stores/article'
import type { Article } from '@/types/article'

const emit = defineEmits<{
  select: [article: Article]
  close: []
}>()

const router = useRouter()
const dialogRef = ref<HTMLDialogElement | null>(null)
const articleStore = useArticleStore()
const currentTab = ref<'cn' | 'en' | 'hanzi'>('cn')
const selectedId = ref<string | null>(null)

const STORAGE_KEY = 'articleSelectorLanguage'

onMounted(() => {
  const savedLanguage = localStorage.getItem(STORAGE_KEY) as 'cn' | 'en' | 'hanzi' | null
  if (savedLanguage && ['cn', 'en', 'hanzi'].includes(savedLanguage)) {
    currentTab.value = savedLanguage
  }
})

watch(currentTab, (newTab) => {
  localStorage.setItem(STORAGE_KEY, newTab)
})

const tabs = [
  { id: 'cn' as const, name: '汉语拼音', icon: '文' },
  { id: 'en' as const, name: '英文', icon: 'En' },
  { id: 'hanzi' as const, name: '汉字', icon: '字' }
]

const filteredArticles = computed(() => {
  const articlesMap = {
    cn: articleStore.articlesCN,
    en: articleStore.articlesEN,
    hanzi: articleStore.articlesHanzi
  }
  return Object.values(articlesMap[currentTab.value]) as Article[]
})

const getArticleCount = (tabId: 'cn' | 'en' | 'hanzi') => {
  const counts = {
    cn: Object.keys(articleStore.articlesCN).length,
    en: Object.keys(articleStore.articlesEN).length,
    hanzi: Object.keys(articleStore.articlesHanzi).length
  }
  return counts[tabId]
}

const getCharCount = (article: Article) => {
  if (article.language === 'cn') {
    const content = article.content as Array<Array<{ hanzi?: string }>>
    return content.reduce((sum, line) => sum + line.length, 0)
  } else if (article.language === 'en') {
    const content = article.content as string[]
    return content.join('').length
  } else if (article.language === 'hanzi') {
    const content = article.content as Array<Array<{ hanzi?: string }>>
    return content.reduce((sum, line) => sum + line.length, 0)
  }
  return 0
}

const getPreview = (article: Article) => {
  if (article.language === 'cn') {
    const content = article.content as Array<Array<{ hanzi?: string }>>
    const firstLine = content[0]
    return firstLine?.map(c => c.hanzi).join('') || ''
  } else if (article.language === 'en') {
    const content = article.content as string[]
    return content[0]?.substring(0, 40) + (content[0]?.length > 40 ? '...' : '') || ''
  } else if (article.language === 'hanzi') {
    const content = article.content as Array<Array<{ hanzi?: string }>>
    const firstLine = content[0]
    return firstLine?.map(c => c.hanzi).join('') || ''
  }
  return ''
}

const open = () => {
  selectedId.value = null
  dialogRef.value?.showModal()
}

const close = () => {
  dialogRef.value?.close()
  emit('close')
}

const selectArticle = (article: Article) => {
  selectedId.value = article.id
}

const confirm = () => {
  if (selectedId.value) {
    const article = filteredArticles.value.find(a => a.id === selectedId.value)
    if (article) {
      router.push(`/typing/${article.language}/${article.id}`)
      emit('select', article)
      close()
    }
  }
}

defineExpose({
  open,
  close
})
</script>

<style scoped lang="scss">
.article-selector-dialog {
  padding: 0;
  border: none;
  background: transparent;
  max-width: 100vw;
  max-height: 100vh;
  
  &::backdrop {
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(8px);
  }
}

.selector-container {
  width: 720px;
  max-width: 95vw;
  max-height: 90vh;
  background: var(--bg-secondary);
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: auto 0.5s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 200px;
    background: linear-gradient(
      180deg,
      rgba(var(--accent-primary-rgb, 6, 182, 212), 0.08) 0%,
      transparent 100%
    );
    pointer-events: none;
  }
}

.selector-header {
  padding: 28px 32px 20px;
  position: relative;
  text-align: center;
}

.header-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}

.deco-line {
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent-primary));
  border-radius: 1px;
  
  &:last-of-type {
    background: linear-gradient(90deg, var(--accent-primary), transparent);
  }
}

.deco-dot {
  width: 8px;
  height: 8px;
  background: var(--accent-primary);
  border-radius: 50%;
  box-shadow: 0 0 12px var(--accent-primary);
}

.header-title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 2px;
}

.header-subtitle {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--text-muted);
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  
  svg {
    width: 18px;
    height: 18px;
  }
  
  &:hover {
    background: var(--accent-primary);
    border-color: var(--accent-primary);
    color: white;
    transform: rotate(90deg);
  }
}

.tabs-container {
  display: flex;
  gap: 4px;
  padding: 0 32px;
  margin-bottom: 20px;
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 20px;
  background: var(--bg-tertiary);
  border: 1px solid transparent;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
    opacity: 0;
    transition: opacity 0.25s ease;
  }
  
  .tab-icon {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-secondary);
    position: relative;
    z-index: 1;
    transition: color 0.25s ease;
  }
  
  .tab-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-secondary);
    position: relative;
    z-index: 1;
    transition: color 0.25s ease;
  }
  
  .tab-count {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    background: var(--bg-secondary);
    padding: 2px 8px;
    border-radius: 20px;
    position: relative;
    z-index: 1;
    transition: all 0.25s ease;
  }
  
  &:hover:not(.active) {
    border-color: var(--border-hover);
    
    .tab-icon, .tab-name {
      color: var(--text-primary);
    }
  }
  
  &.active {
    border-color: transparent;
    
    &::before {
      opacity: 1;
    }
    
    .tab-icon, .tab-name {
      color: white;
    }
    
    .tab-count {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }
  }
}

.articles-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 10px 24px 24px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;
    
    &:hover {
      background: var(--border-hover);
    }
  }
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.article-card {
  position: relative;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  animation: cardFadeIn 0.4s ease backwards;
  animation-delay: var(--delay);
  
  @keyframes cardFadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  &:hover {
    border-color: var(--border-hover);
    transform: translateY(-4px);
    box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.3);
    
    .card-glow {
      opacity: 1;
    }
  }
  
  &.selected {
    border-color: var(--accent-primary);
    background: rgba(var(--accent-primary-rgb, 6, 182, 212), 0.08);
    
    .card-glow {
      opacity: 1;
      background: radial-gradient(
        ellipse at center,
        rgba(var(--accent-primary-rgb, 6, 182, 212), 0.15) 0%,
        transparent 70%
      );
    }
    
    .selected-indicator {
      opacity: 1;
      transform: scale(1);
    }
  }
}

.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 0%,
    rgba(var(--accent-primary-rgb, 6, 182, 212), 0.1) 0%,
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.card-content {
  padding: 20px;
  position: relative;
  z-index: 1;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.card-number {
  font-size: 11px;
  font-weight: 700;
  color: var(--accent-primary);
  font-family: 'SF Mono', 'Fira Code', monospace;
  letter-spacing: 1px;
}

.card-badge {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--bg-secondary);
  padding: 3px 10px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-title {
  margin: 0 0 6px;
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
}

.card-author {
  margin: 0 0 12px;
  font-size: 13px;
  color: var(--text-secondary);
}

.card-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-muted);
  
  svg {
    width: 14px;
    height: 14px;
    opacity: 0.6;
  }
}

.card-preview {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.6;
  padding-top: 12px;
  border-top: 1px dashed var(--border-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.selected-indicator {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 28px;
  height: 28px;
  background: var(--accent-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 12px rgba(var(--accent-primary-rgb, 6, 182, 212), 0.4);
  
  svg {
    width: 14px;
    height: 14px;
  }
}

.selector-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 32px;
  background: var(--bg-tertiary);
  border-top: 1px solid var(--border-color);
}

.footer-hint {
  font-size: 12px;
  color: var(--text-muted);
  
  kbd {
    display: inline-block;
    padding: 2px 8px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-family: inherit;
    font-size: 11px;
    color: var(--text-secondary);
    margin-right: 4px;
  }
}

.footer-actions {
  display: flex;
  gap: 12px;
}

.btn-cancel,
.btn-confirm {
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  
  &:hover {
    background: var(--bg-tertiary);
    border-color: var(--border-hover);
    color: var(--text-primary);
  }
}

.btn-confirm {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border: none;
  color: white;
  box-shadow: 0 4px 16px rgba(var(--accent-primary-rgb, 6, 182, 212), 0.3);
  
  svg {
    width: 16px;
    height: 16px;
    transition: transform 0.2s ease;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(var(--accent-primary-rgb, 6, 182, 212), 0.4);
    
    svg {
      transform: translateX(4px);
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
}

.article-list-enter-active,
.article-list-leave-active {
  transition: all 0.3s ease;
}

.article-list-enter-from,
.article-list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

@media (max-width: 600px) {
  .selector-container {
    border-radius: 20px;
  }
  
  .selector-header {
    padding: 20px 20px 16px;
  }
  
  .header-title {
    font-size: 22px;
  }
  
  .tabs-container {
    padding: 0 20px;
  }
  
  .tab-item {
    padding: 12px 16px;
    flex-direction: column;
    gap: 4px;
  }
  
  .articles-wrapper {
    padding: 0 16px 16px;
  }
  
  .article-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .selector-footer {
    padding: 16px 20px;
    flex-direction: column;
    gap: 16px;
  }
  
  .footer-actions {
    width: 100%;
  }
  
  .btn-cancel,
  .btn-confirm {
    flex: 1;
    justify-content: center;
  }
}
</style>
