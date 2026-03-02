<template>
  <dialog ref="dialogRef" class="ai-generator-dialog">
    <div class="ai-generator">
      <div class="header">
        <div class="header-content">
          <div class="header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <path d="M12 17h.01"/>
            </svg>
          </div>
          <div class="header-text">
            <h3>AI 灵感生成器</h3>
            <p>让 AI 帮你创作练习内容</p>
          </div>
        </div>
        <button class="close-btn" @click="close" aria-label="关闭">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="content" v-if="!showConfig">
        <div class="category-selector">
          <button 
            v-for="category in categories"
            :key="category.id"
            class="category-btn"
            :class="{ active: aiStore.currentLanguage === category.id }"
            @click="selectCategory(category.id)"
          >
            <span class="category-emoji">{{ (category as any).emoji }}</span>
            <span class="category-name">{{ (category as any).name }}</span>
          </button>
        </div>

        <div class="tag-section" v-if="currentCategory">
          <div class="section-label">选择主题</div>
          <div class="tag-list">
            <button 
              v-for="tag in currentCategory.tags"
              :key="tag.id"
              class="tag-btn"
              :class="{ active: aiStore.currentTagId === tag.id }"
              @click="selectTag(tag)"
            >
              {{ tag.name }}
            </button>
          </div>
        </div>

        <div class="template-section" v-if="currentTag">
          <div class="section-header" @click="showTemplate = !showTemplate">
            <div class="section-label">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16v12H5.5L4 15.5V4z"/>
                <path d="M8 8h8M8 12h6"/>
              </svg>
              Prompt 模板
            </div>
            <svg 
              class="toggle-icon" 
              viewBox="0 0 20 20" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2"
              :style="{ transform: showTemplate ? 'rotate(180deg)' : '' }"
            >
              <path d="M6 8l4 4 4-4"/>
            </svg>
          </div>
          <div class="template-editor" v-show="showTemplate">
            <textarea 
              v-model="customPrompt"
              placeholder="自定义 AI 生成提示词..."
              rows="4"
              class="template-textarea"
            ></textarea>
          </div>
        </div>

        <div class="action-section">
          <button 
            class="generate-btn"
            :class="{ loading: aiStore.isGenerating, disabled: !currentTag }"
            :disabled="aiStore.isGenerating || !currentTag"
            @click="startGenerate"
          >
            <svg v-if="aiStore.isGenerating" class="spinner" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" opacity="0.3"/>
              <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <svg v-else viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            <span>{{ aiStore.isGenerating ? '生成中...' : '生成文章' }}</span>
          </button>
          <button class="config-btn" @click="showConfig = true">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <circle cx="10" cy="10" r="3"/>
            </svg>
            配置
          </button>
        </div>

        <div class="preview-section" v-if="aiStore.generatedContent">
          <div class="preview-header">
            <div class="preview-title">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 6a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V16a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"/>
              </svg>
              生成预览
            </div>
            <button class="use-btn" @click="useArticle" :disabled="aiStore.isGenerating">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
              </svg>
              使用文章
            </button>
          </div>
          <div class="preview-content" :class="{ generating: aiStore.isGenerating }">
            <span 
              v-for="(char, index) in aiStore.generatedContent"
              :key="index"
              class="generated-char"
              :style="{ animationDelay: `${index * 0.015}s` }"
            >{{ char }}</span>
            <span v-if="aiStore.isGenerating" class="cursor"></span>
          </div>
        </div>

        <div class="history-section" v-if="aiStore.generatedArticles.length > 0">
          <div class="history-header">
            <div class="history-title">
              <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              历史生成
            </div>
            <button class="clear-btn" @click="clearHistory">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H3.862a2 2 0 01-1.995-1.858L1 7h18z"/>
                <path d="M3 3h18v4H3V3z"/>
                <path d="M8 11v6M12 11v6M16 11v6"/>
              </svg>
              清空
            </button>
          </div>
          <div class="history-list">
            <div 
              v-for="article in aiStore.generatedArticles.slice(0, 5)"
              :key="article.id"
              class="history-item"
              @click="selectHistoryArticle(article)"
            >
              <div class="history-info">
                <div class="history-title">{{ article.title }}</div>
                <div class="history-meta">
                  <span class="ai-badge">
                    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="7" cy="7" r="5"/>
                      <path d="M5 7h4"/>
                    </svg>
                    AI 生成
                  </span>
                  <span>{{ article.date }}</span>
                </div>
              </div>
              <div class="history-preview">{{ article.content.slice(0, 60) }}...</div>
            </div>
          </div>
        </div>
      </div>

      <div class="config-panel" v-else>
        <div class="config-header">
          <button class="back-btn" @click="showConfig = false">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"/>
            </svg>
            返回
          </button>
          <h4>API 配置</h4>
        </div>
        
        <div class="config-form">
          <div class="form-group">
            <label>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 2v8m0 0l3-3m-3 3L7 7"/>
                <rect x="3" y="10" width="14" height="8" rx="2"/>
              </svg>
              API Key
            </label>
            <input 
              v-model="tempConfig.apiKey"
              type="password"
              placeholder="输入你的 API Key"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              API URL
            </label>
            <input 
              v-model="tempConfig.apiUrl"
              type="text"
              placeholder="https://api.openai.com/v1/chat/completions"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h6v6H4V4zM10 4h6v6h-6V4zM4 10h6v6H4v-6zM10 10h6v6h-6v-6z"/>
              </svg>
              Model
            </label>
            <input 
              v-model="tempConfig.model"
              type="text"
              placeholder="gpt-3.5-turbo"
              class="form-input"
            />
          </div>
          
          <button class="save-btn" @click="saveConfig">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 4v3a1 1 0 001 1h8a1 1 0 001-1V4M5 4h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/>
              <path d="M8 20v-6h4v6"/>
            </svg>
            保存配置
          </button>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAIStore } from '@/stores/ai'
import { useArticleStore } from '@/stores/article'
import { usePinyin } from '@/composables/usePinyin'
import { AI_CATEGORIES } from '@/types/ai'
import type { AITag, AILanguage, GeneratedArticle } from '@/types/ai'
import type { ArticleCN, ArticleEN, ArticleHanzi } from '@/types/article'

const emit = defineEmits(['useArticle', 'close'])

const dialogRef = ref<HTMLDialogElement | null>(null)
const aiStore = useAIStore()
const articleStore = useArticleStore()
const { convertToPinyin } = usePinyin()

const showConfig = ref(false)
const showTemplate = ref(false)
const customPrompt = ref('')

const tempConfig = ref({
  apiKey: aiStore.config.apiKey,
  apiUrl: aiStore.config.apiUrl,
  model: aiStore.config.model
})

const categories = AI_CATEGORIES

const currentCategory = computed(() => 
  categories.find(c => c.id === aiStore.currentLanguage)
)

const currentTag = computed(() => 
  currentCategory.value?.tags.find(t => t.id === aiStore.currentTagId)
)

const open = () => {
  showConfig.value = !aiStore.hasApiKey
  tempConfig.value = { ...aiStore.config }
  dialogRef.value?.showModal()
}

const close = () => {
  dialogRef.value?.close()
  emit('close')
}

const selectCategory = (language: AILanguage) => {
  aiStore.setLanguage(language)
  aiStore.setTagId('')
}

const selectTag = (tag: AITag) => {
  aiStore.setTagId(tag.id)
  customPrompt.value = tag.promptTemplate
}

const startGenerate = async () => {
  if (!currentTag.value) return
  
  const prompt = customPrompt.value || currentTag.value.promptTemplate
  const title = `${currentCategory.value?.name} - ${currentTag.value.name}`
  
  await aiStore.generateContent(prompt, title)
}

const useArticle = () => {
  if (!aiStore.generatedContent) return
  
  const title = aiStore.generatedTitle || 'AI 生成文章'
  const content = aiStore.generatedContent
  const language = aiStore.currentLanguage
  
  // 保存到对应语言的文章存储中
  saveGeneratedArticleToStore(title, content, language)
  
  emit('useArticle', {
    title,
    content,
    language
  })
  close()
}

const saveGeneratedArticleToStore = (title: string, content: string, language: AILanguage) => {
  console.log('原始内容:', content)
  if (language === 'cn') {
    // 使用convertToPinyin函数正确处理拼音
    const articleContent = convertToPinyin(content)
    
    console.log('转换后的内容:', articleContent)
    
    const article: Omit<ArticleCN, 'id'> = {
      language: 'cn',
      title,
      dynasty: '现代',
      author: 'AI',
      content: articleContent
    }
    
    articleStore.addArticleCN(article as ArticleCN)
  } else if (language === 'en') {
    const articleContent = content.split('\n').filter(line => line.trim())
    
    const article: Omit<ArticleEN, 'id'> = {
      language: 'en',
      title,
      content: articleContent
    }
    
    articleStore.addArticleEN(article as ArticleEN)
  } else if (language === 'hanzi') {
    const articleContent = content.split('\n').filter(line => line.trim()).map(line => {
      return line.split('').map(char => ({
        hanzi: char
      }))
    })
    
    const article: Omit<ArticleHanzi, 'id'> = {
      language: 'hanzi',
      title,
      content: articleContent
    }
    
    articleStore.addArticleHanzi(article as ArticleHanzi)
  }
}

const selectHistoryArticle = (article: GeneratedArticle) => {
  // 保存到对应语言的文章存储中
  saveGeneratedArticleToStore(article.title, article.content, article.language)
  
  emit('useArticle', {
    title: article.title,
    content: article.content,
    language: article.language
  })
  close()
}

const saveConfig = () => {
  aiStore.setConfig(tempConfig.value)
  showConfig.value = false
}

const clearHistory = () => {
  if (confirm('确定要清空 AI 生成历史吗？')) {
    aiStore.clearGeneratedArticles()
  }
}

watch(() => aiStore.config, (config) => {
  tempConfig.value = { ...config }
}, { deep: true })

defineExpose({
  open,
  close
})
</script>

<style scoped lang="scss">
.ai-generator-dialog {
  padding: 0;
  border: none;
  background: transparent;
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;
  
  &::backdrop {
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(8px);
    animation: fadeIn 0.3s ease;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.ai-generator {
  width: 620px;
  max-width: 95vw;
  max-height: 88vh;
  background: var(--bg-secondary);
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(
      135deg,
      rgba(var(--accent-primary-rgb, 6, 182, 212), 0.08) 0%,
      rgba(var(--accent-secondary-rgb, 129, 140, 248), 0.04) 50%,
      transparent 100%
    );
    pointer-events: none;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28px 32px 20px;
  position: relative;
  z-index: 1;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 24px rgba(var(--accent-primary-rgb, 6, 182, 212), 0.3);
  
  svg {
    width: 24px;
    height: 24px;
  }
}

.header-text {
  h3 {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.3px;
  }
  
  p {
    margin: 4px 0 0;
    font-size: 13px;
    color: var(--text-muted);
  }
}

.close-btn {
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

.content {
  flex: 1;
  overflow-y: auto;
  padding: 28px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;
  }
}

.category-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.category-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
  
  &:hover {
    background: rgba(var(--accent-primary-rgb, 6, 182, 212), 0.08);
    border-color: var(--accent-primary);
    transform: translateY(-2px);
  }
  
  &.active {
    background: rgba(var(--accent-primary-rgb, 6, 182, 212), 0.12);
    border-color: var(--accent-primary);
    box-shadow: 0 4px 16px rgba(var(--accent-primary-rgb, 6, 182, 212), 0.2);
  }
}

.category-emoji {
  font-size: 24px;
  line-height: 1;
}

.category-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.tag-section {
  margin-bottom: 20px;
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    width: 16px;
    height: 16px;
    color: var(--accent-primary);
  }
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-btn {
  padding: 10px 18px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  
  &:hover {
    background: rgba(var(--accent-primary-rgb, 6, 182, 212), 0.08);
    border-color: var(--accent-primary);
    color: var(--text-primary);
    transform: translateY(-1px);
  }
  
  &.active {
    background: rgba(var(--accent-primary-rgb, 6, 182, 212), 0.15);
    border-color: var(--accent-primary);
    color: var(--accent-primary);
    font-weight: 600;
  }
}

.template-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--bg-secondary);
    border-color: var(--border-hover);
  }
}

.toggle-icon {
  width: 18px;
  height: 18px;
  color: var(--text-muted);
  transition: transform 0.2s ease;
}

.template-editor {
  margin-top: 12px;
}

.template-textarea {
  width: 100%;
  padding: 14px 16px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  box-sizing: border-box;
  transition: all 0.2s ease;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(var(--accent-primary-rgb, 6, 182, 212), 0.15);
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
}

.action-section {
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
}

.generate-btn {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 4px 16px rgba(var(--accent-primary-rgb, 6, 182, 212), 0.3);
  
  svg {
    width: 18px;
    height: 18px;
  }
  
  .spinner {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  &:hover:not(.disabled):not(.loading) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(var(--accent-primary-rgb, 6, 182, 212), 0.4);
  }
  
  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  &.loading {
    cursor: not-allowed;
  }
}

.config-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  
  svg {
    width: 18px;
    height: 18px;
  }
  
  &:hover {
    background: rgba(var(--accent-primary-rgb, 6, 182, 212), 0.08);
    border-color: var(--accent-primary);
    color: var(--accent-primary);
    transform: translateY(-1px);
  }
}

.preview-section {
  margin-bottom: 28px;
  padding: 18px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.preview-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  
  svg {
    width: 18px;
    height: 18px;
    color: var(--accent-primary);
  }
}

.use-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(var(--accent-primary-rgb, 6, 182, 212), 0.12);
  border: 1px solid var(--accent-primary);
  border-radius: 10px;
  color: var(--accent-primary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  &:hover:not(:disabled) {
    background: rgba(var(--accent-primary-rgb, 6, 182, 212), 0.2);
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
}

.preview-content {
  line-height: 1.8;
  color: var(--text-primary);
  font-size: 14px;
  min-height: 80px;
  
  &.generating {
    .generated-char {
      display: inline-block;
      animation: charPop 0.25s ease-out forwards;
      opacity: 0;
      transform: translateY(6px);
    }
    
    .cursor {
      display: inline-block;
      width: 6px;
      height: 18px;
      background: var(--accent-primary);
      margin-left: 2px;
      animation: breathe 1s ease-in-out infinite;
      vertical-align: middle;
      border-radius: 2px;
    }
  }
  
  .generated-char {
    display: inline;
  }
}

@keyframes charPop {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes breathe {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.history-section {
  margin-bottom: 8px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.history-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  
  svg {
    width: 18px;
    height: 18px;
    color: var(--accent-primary);
  }
}

.clear-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #f87171;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  
  svg {
    width: 14px;
    height: 14px;
  }
  
  &:hover {
    background: rgba(239, 68, 68, 0.18);
    border-color: rgba(239, 68, 68, 0.5);
  }
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-item {
  padding: 14px 16px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--bg-secondary);
    border-color: var(--accent-primary);
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(var(--accent-primary-rgb, 6, 182, 212), 0.1);
  }
}

.history-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.history-item .history-title {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 600;
  margin: 0;
}

.history-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-muted);
}

.ai-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  background: rgba(var(--accent-primary-rgb, 6, 182, 212), 0.12);
  border-radius: 20px;
  color: var(--accent-primary);
  font-size: 11px;
  font-weight: 500;
  
  svg {
    width: 12px;
    height: 12px;
  }
}

.history-preview {
  font-size: 13px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.config-panel {
  flex: 1;
  overflow-y: auto;
  padding:28px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;
  }
}

.config-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 8px 14px;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  &:hover {
    background: rgba(var(--accent-primary-rgb, 6, 182, 212), 0.08);
    border-color: var(--accent-primary);
    color: var(--accent-primary);
    transform: translateX(-2px);
  }
}

.config-header h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.config-form {
  .form-group {
    margin-bottom: 22px;
    
    label {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
      
      svg {
        width: 16px;
        height: 16px;
        color: var(--accent-primary);
      }
    }
  }
  
  .form-input {
    width: 100%;
    padding: 12px 16px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    color: var(--text-primary);
    font-size: 14px;
    box-sizing: border-box;
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 3px rgba(var(--accent-primary-rgb, 6, 182, 212), 0.15);
    }
    
    &::placeholder {
      color: var(--text-muted);
    }
  }
  
  .save-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px;
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
    border: none;
    border-radius: 12px;
    color: white;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 4px 16px rgba(var(--accent-primary-rgb, 6, 182, 212), 0.3);
    
    svg {
      width: 18px;
      height: 18px;
    }
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(var(--accent-primary-rgb, 6, 182, 212), 0.4);
    }
  }
}

@media (max-width: 640px) {
  .ai-generator {
    width: 100%;
    max-width: 100%;
    border-radius: 20px 20px 0 0;
  }
  
  .header {
    padding: 24px 20px 18px;
  }
  
  .header-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
  }
  
  .header-text h3 {
    font-size: 20px;
  }
  
  .content,
  .config-panel {
    padding: 0 20px 24px;
  }
  
  .category-selector {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  
  .category-btn {
    padding: 14px 10px;
  }
  
  .category-emoji {
    font-size: 22px;
  }
  
  .action-section {
    flex-direction: column;
  }
  
  .generate-btn,
  .config-btn {
    width: 100%;
  }
}
</style>
