<template>
  <div class="typing-display" :class="language">
    <div class="typing-lines-cn">
      <div 
        v-for="(line, lineIndex) in content" 
        :key="lineIndex"
        class="typing-line-cn"
      >
        <div 
          v-for="(char, charIndex) in line" 
          :key="charIndex"
          class="char-wrapper-cn"
        >
          <div class="pinyin-cn">
            <span 
              v-for="(py, pyIndex) in getPinyinList(char)"
              :key="pyIndex"
              class="py-item"
              :class="getPinyinClass(lineIndex, charIndex, Number(pyIndex))"
            >
              {{ py }}
            </span>
          </div>
          <div class="hanzi-cn" :class="{ 'pass': isHanziPassed(lineIndex, charIndex) }">
            {{ char.hanzi }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTypingStore } from '@/stores/typing'
import { useSpeech } from '@/composables/useSpeech'
import { watch, onMounted } from 'vue'

const typingStore = useTypingStore()
const { initSpeech, speak, updateLastSpokenIndex, lastSpokenIndex } = useSpeech()

const language = computed(() => typingStore.language)
const content = computed(() => {
  const article = typingStore.article
  if (!article || article.language !== 'cn') return []
  return article.content as Array<Array<{ pinyin?: string; hanzi?: string }>>
})
const index = computed(() => typingStore.index)
const charStatuses = computed(() => typingStore.charStatuses)

const getPinyinList = (char: any) => {
  if (Array.isArray(char.pinyin)) {
    return char.pinyin
  }
  if (typeof char.pinyin === 'string') {
    return char.pinyin.split('')
  }
  if (typeof char.hanzi === 'string') {
    return char.hanzi.split('')
  }
  return []
}

const getPinyinLength = (char: any) => {
  if (Array.isArray(char.pinyin)) {
    return char.pinyin.length
  }
  return (char.pinyin || char.hanzi || '').length
}

const getCharFlatIndex = (lineIndex: number, charIndex: number) => {
  let idx = 0
  for (let i = 0; i < lineIndex; i++) {
    for (const char of content.value[i]) {
      const len = getPinyinLength(char)
      idx += len
    }
  }
  for (let j = 0; j < charIndex; j++) {
    const len = getPinyinLength(content.value[lineIndex][j])
    idx += len
  }
  return idx
}

const getPinyinIndex = (lineIndex: number, charIndex: number, pyIndex: number) => {
  return getCharFlatIndex(lineIndex, charIndex) + pyIndex
}

const getPinyinClass = (lineIndex: number, charIndex: number, pyIndex: number) => {
  const idx = getPinyinIndex(lineIndex, charIndex, pyIndex)
  if (idx === index.value) {
    return 'active'
  }
  if (idx >= charStatuses.value.length) {
    return ''
  }
  const status = charStatuses.value[idx]
  if (status === 'pending') return ''
  return status
}

const isHanziPassed = (lineIndex: number, charIndex: number) => {
  const startIdx = getCharFlatIndex(lineIndex, charIndex)
  const charLen = getPinyinLength(content.value[lineIndex][charIndex])
  return startIdx + charLen <= index.value
}

const getCharToSpeak = (idx: number): { text: string; lang: 'zh-CN' | 'en-US' } | null => {
  let flatIndex = 0
  
  for (let lineIndex = 0; lineIndex < content.value.length; lineIndex++) {
    const line = content.value[lineIndex]
    for (let charIndex = 0; charIndex < line.length; charIndex++) {
      const char = line[charIndex]
      const pinyinLen = getPinyinLength(char)
      
      if (idx >= flatIndex && idx < flatIndex + pinyinLen) {
        if (idx === flatIndex + pinyinLen - 1) {
          return { text: char.hanzi || '', lang: 'zh-CN' }
        }
        return null
      }
      flatIndex += pinyinLen
    }
  }
  return null
}

watch(index, (newIndex) => {
  if (newIndex <= 0) return
  
  const toSpeak = getCharToSpeak(newIndex - 1)
  
  if (toSpeak && newIndex - 1 !== lastSpokenIndex.value) {
    speak(toSpeak.text, toSpeak.lang)
    updateLastSpokenIndex(newIndex - 1)
  }
})

onMounted(() => {
  initSpeech()
})
</script>

<style scoped lang="scss">
.typing-display {
  width: 100%;
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 48px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  font-size: 24px;
  user-select: none;
  position: relative;
  overflow: hidden;


  .typing-lines-cn {
    position: relative;
    z-index: 1;

    .typing-line-cn {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      margin-bottom: 32px;
      gap: 20px;
    }

    .char-wrapper-cn {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 70px;
    }

    .pinyin-cn {
      display: flex;
      margin-bottom: 6px;
      height: 32px;

      .py-item {
        display: inline-block;
        font-size: 16px;
        transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        min-width: 16px;
        text-align: center;
        padding: 6px 2px;
        margin: 0 2px;

        &.active {
          background-color: var(--typing-active-bg);
          border-bottom: solid 3px var(--typing-active-border);
          box-sizing: border-box;
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        &.correct {
          color: var(--typing-correct-text);
          background: var(--typing-correct-bg);
        }

        &.modified {
          color: var(--typing-modified-text);
          background: var(--typing-modified-bg);
        }

        &.error {
          color: var(--typing-error-text);
          background: var(--typing-error-bg);
        }
      }
    }

    .hanzi-cn {
      font-size: 36px;
      background-color: rgba(255, 255, 255, 0.1);
      padding: 10px 20px;
      border-radius: 3px;
      border: 1px solid var(--border-color);
      transition: all 0.3s ease-in-out;

      &.pass {
        background-color: transparent;
        border-color: transparent;
        color: var(--text-primary);
      }
    }
  }
}
</style>
