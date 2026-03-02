<template>
  <dialog ref="dialogRef" class="importer-dialog">
    <div class="importer-container">
      <div class="importer-header">
        <div class="header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </div>
        <h2 class="header-title">导入文章</h2>
        <p class="header-subtitle">创建属于你的专属练习内容</p>
        <button class="close-btn" @click="close" aria-label="关闭">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="importer-body">
        <div class="form-section">
          <div class="section-label">基本信息</div>
          
          <div class="form-row">
            <div class="form-field flex-2">
              <label>标题</label>
              <input 
                v-model="formData.title" 
                type="text" 
                placeholder="给文章起个名字"
                class="input-field"
              />
            </div>
            <div class="form-field flex-1">
              <label>作者</label>
              <input 
                v-model="formData.author" 
                type="text" 
                placeholder="选填"
                class="input-field"
              />
            </div>
          </div>

          <div class="form-row" v-if="formData.language === 'cn'">
            <div class="form-field">
              <label>朝代</label>
              <select v-model="formData.dynasty" class="select-field">
                <option value="">请选择</option>
                <option v-for="d in dynasties" :key="d" :value="d">{{ d }}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="section-label">语言类型</div>
          <div class="language-selector">
            <button 
              class="lang-option"
              :class="{ active: formData.language === 'cn' }"
              @click="formData.language = 'cn'"
            >
              <span class="lang-icon">文</span>
              <span class="lang-name">汉语拼音</span>
              <span class="lang-desc">支持自动注音</span>
            </button>
            <button 
              class="lang-option"
              :class="{ active: formData.language === 'en' }"
              @click="formData.language = 'en'"
            >
              <span class="lang-icon">En</span>
              <span class="lang-name">英文</span>
              <span class="lang-desc">单词练习</span>
            </button>
            <button 
              class="lang-option"
              :class="{ active: formData.language === 'hanzi' }"
              @click="formData.language = 'hanzi'"
            >
              <span class="lang-icon">字</span>
              <span class="lang-name">汉字</span>
              <span class="lang-desc">汉字输入练习</span>
            </button>
          </div>
        </div>

        <div class="form-section">
          <div class="section-label">
            正文内容 <span class="required">*</span>
            <span class="char-count">{{ formData.content.length }} 字符</span>
          </div>
          <textarea 
            v-model="formData.content" 
            :placeholder="contentPlaceholder"
            class="content-textarea"
            rows="8"
          ></textarea>
          <div class="content-hint" v-if="formData.language === 'cn'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
            中文文章将自动生成拼音，无需手动输入
          </div>
          <div class="content-hint" v-if="formData.language === 'hanzi'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
            汉字练习需要完整输入每个汉字
          </div>
        </div>
      </div>

      <div class="importer-footer">
        <button class="btn-cancel" @click="close">取消</button>
        <button 
          class="btn-submit" 
          :disabled="!canSubmit"
          @click="submit"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
          导入文章
        </button>
      </div>

      <Transition name="toast">
        <div v-if="showToast" class="toast-message" :class="toastType">
          {{ toastMessage }}
        </div>
      </Transition>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useArticleStore } from '@/stores/article'
import { pinyin as pinyinPro } from 'pinyin-pro'

const emit = defineEmits(['imported', 'close'])

const dialogRef = ref<HTMLDialogElement | null>(null)
const articleStore = useArticleStore()

const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'error' | 'success'>('error')

const dynasties = [
  '先秦', '两汉', '魏晋', '南北朝', '隋', '唐', 
  '宋', '元', '明', '清', '近代', '现代'
]

interface FormData {
  title: string
  author: string
  dynasty: string
  language: 'cn' | 'en' | 'hanzi'
  content: string
}

const formData = reactive<FormData>({
  title: '',
  author: '',
  dynasty: '',
  language: 'cn',
  content: ''
})

const contentPlaceholder = computed(() => {
  const placeholders = {
    cn: '在此粘贴或输入中文文章内容...\n\n例如：\n床前明月光，疑是地上霜。\n举头望明月，低头思故乡。',
    en: 'Paste or type your English content here...\n\nFor example:\nThe quick brown fox jumps over the lazy dog.',
    hanzi: '在此粘贴或输入汉字内容...\n\n例如：\n一心一意\n风和日丽\n春暖花开'
  }
  return placeholders[formData.language]
})

const canSubmit = computed(() => {
  return formData.content.trim()
})

const showNotification = (message: string, type: 'error' | 'success' = 'error') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2500)
}

const generatePinyinContent = (text: string) => {
  const lines = text.split('\n').filter(line => line.trim())
  return lines.map(line => {
    const chars = line.split('')
    return chars.map(char => {
      if (/[\u4e00-\u9fa5]/.test(char)) {
        const py = pinyinPro(char, { toneType: 'symbol' })
        const pyNum = pinyinPro(char, { toneType: 'num' })
        return {
          hanzi: char,
          pinyin: pyNum.replace(/\d/g, ''),
          pinyinTone: py
        }
      }
      return {
        hanzi: char,
        pinyin: char,
        pinyinTone: char
      }
    })
  })
}

const generateHanziContent = (text: string) => {
  const lines = text.split('\n').filter(line => line.trim())
  return lines.map(line => {
    const chars = line.split('')
    return chars.map(char => {
      return {
        hanzi: char
      }
    })
  })
}

const getDefaultTitle = () => {
  if (formData.language === 'cn') {
    return `自定义汉语拼音文章-${Object.keys(articleStore.articlesCN).length + 1}`
  } else if (formData.language === 'en') {
    return `自定义英文文章-${Object.keys(articleStore.articlesEN).length + 1}`
  } else {
    return `自定义汉字文章-${Object.keys(articleStore.articlesHanzi).length + 1}`
  }
}

const open = () => {
  formData.language = 'cn'
  formData.title = getDefaultTitle()
  formData.author = ''
  formData.dynasty = ''
  formData.content = ''
  dialogRef.value?.showModal()
}

watch(() => formData.language, () => {
  if (!formData.title || formData.title.startsWith('自定义')) {
    formData.title = getDefaultTitle()
  }
})

const close = () => {
  dialogRef.value?.close()
  emit('close')
}

const submit = () => {
  if (!formData.title.trim()) {
    formData.title = getDefaultTitle()
  }
  if (!formData.content.trim()) {
    showNotification('请输入内容')
    return
  }

  const id = String(Date.now())
  
  if (formData.language === 'cn') {
    const article = {
      id,
      title: formData.title,
      author: formData.author,
      dynasty: formData.dynasty,
      language: 'cn' as const,
      content: generatePinyinContent(formData.content)
    }
    articleStore.addArticleCN(article)
    emit('imported', article)
  } else if (formData.language === 'en') {
    const article = {
      id,
      title: formData.title,
      language: 'en' as const,
      content: formData.content.split('\n').filter(line => line.trim())
    }
    articleStore.addArticleEN(article)
    emit('imported', article)
  } else {
    const article = {
      id,
      title: formData.title,
      language: 'hanzi' as const,
      content: generateHanziContent(formData.content)
    }
    articleStore.addArticleHanzi(article)
    emit('imported', article)
  }

  showNotification('导入成功！', 'success')
  setTimeout(() => close(), 500)
}

defineExpose({
  open,
  close
})
</script>

<style scoped lang="scss">
.importer-dialog {
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

.importer-container {
  width: 640px;
  max-width: 95vw;
  max-height: 90vh;
  background: var(--bg-secondary);
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 200px;
    background: linear-gradient(
      180deg,
      rgba(var(--accent-primary-rgb, 6, 182, 212), 0.06) 0%,
      transparent 100%
    );
    pointer-events: none;
  }
}

.importer-header {
  padding: 28px 32px 20px;
  text-align: center;
  position: relative;
}

.header-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 24px rgba(var(--accent-primary-rgb, 6, 182, 212), 0.3);
  
  svg {
    width: 28px;
    height: 28px;
  }
}

.header-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 1px;
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

.importer-body {
  flex: 1;
  overflow-y: auto;
  padding: 0 32px 24px;
  
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

.form-section {
  margin-bottom: 24px;
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
  
  .required {
    color: var(--accent-tertiary);
  }
  
  .char-count {
    font-size: 11px;
    color: var(--text-muted);
    font-weight: 400;
    text-transform: none;
    margin-left: auto;
  }
}

.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  &.flex-1 { flex: 1; }
  &.flex-2 { flex: 2; }
  
  label {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
  }
}

.input-field,
.select-field,
.content-textarea {
  width: 100%;
  padding: 12px 16px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 14px;
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

.select-field {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 40px;
  
  option {
    background: var(--bg-secondary);
    color: var(--text-primary);
    padding: 8px 12px;
  }
}

.content-textarea {
  resize: vertical;
  min-height: 160px;
  font-family: inherit;
  line-height: 1.6;
}

.content-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding: 10px 14px;
  background: rgba(var(--accent-primary-rgb, 6, 182, 212), 0.08);
  border-radius: 10px;
  font-size: 12px;
  color: var(--text-secondary);
  
  svg {
    width: 16px;
    height: 16px;
    color: var(--accent-primary);
    flex-shrink: 0;
  }
}

.language-selector {
  display: flex;
  gap: 12px;
}

.lang-option {
  flex: 1;
  padding: 16px;
  background: var(--bg-tertiary);
  border: 2px solid var(--border-color);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
  text-align: center;
  
  &:hover {
    border-color: var(--border-hover);
    background: rgba(var(--accent-primary-rgb, 6, 182, 212), 0.05);
  }
  
  &.active {
    border-color: var(--accent-primary);
    background: rgba(var(--accent-primary-rgb, 6, 182, 212), 0.1);
    
    .lang-icon {
      background: var(--accent-primary);
      color: white;
    }
  }
  
  .lang-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: var(--bg-secondary);
    border-radius: 10px;
    font-size: 14px;
    font-weight: 700;
    color: var(--text-secondary);
    margin-bottom: 8px;
    transition: all 0.25s ease;
  }
  
  .lang-name {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 4px;
  }
  
  .lang-desc {
    font-size: 11px;
    color: var(--text-muted);
  }
}

.importer-footer {
  display: flex;
  gap: 12px;
  padding: 20px 32px;
  background: var(--bg-tertiary);
  border-top: 1px solid var(--border-color);
}

.btn-cancel,
.btn-submit {
  padding: 14px 28px;
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

.btn-submit {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border: none;
  color: white;
  box-shadow: 0 4px 16px rgba(var(--accent-primary-rgb, 6, 182, 212), 0.3);
  
  svg {
    width: 18px;
    height: 18px;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(var(--accent-primary-rgb, 6, 182, 212), 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
}

.toast-message {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  z-index: 100;
  
  &.error {
    border-color: var(--accent-tertiary);
    background: rgba(236, 72, 153, 0.1);
  }
  
  &.success {
    border-color: var(--accent-primary);
    background: rgba(6, 182, 212, 0.1);
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

@media (max-width: 600px) {
  .importer-container {
    border-radius: 20px;
  }
  
  .importer-header {
    padding: 20px 20px 16px;
  }
  
  .header-icon {
    width: 48px;
    height: 48px;
    
    svg {
      width: 24px;
      height: 24px;
    }
  }
  
  .header-title {
    font-size: 20px;
  }
  
  .importer-body {
    padding: 0 20px 20px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 12px;
  }
  
  .language-selector {
    flex-direction: column;
  }
  
  .importer-footer {
    padding: 16px 20px;
    flex-direction: column;
  }
  
  .btn-submit {
    width: 100%;
  }
}
</style>
