<template>
  <div class="typing-display" :class="language">
    <div class="typing-lines">
      <div 
        v-for="(line, lineIndex) in content" 
        :key="lineIndex"
        class="typing-line"
      >
        <div 
          v-for="(word, wordIndex) in line.split(/(\s+)/)" 
          :key="wordIndex"
          class="typing-word"
        >
          <span 
            v-for="(char, charIndex) in word.split('')" 
            :key="charIndex"
            class="typing-char"
            :class="getEnglishClassForWord(lineIndex, wordIndex, charIndex)"
          >
            {{ char }}
          </span>
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
  if (!article || article.language !== 'en') return []
  return article.content as string[]
})
const index = computed(() => typingStore.index)
const charStatuses = computed(() => typingStore.charStatuses)

const getEnglishIndexForWord = (lineIndex: number, wordIndex: number, charIndex: number) => {
  let idx = 0
  
  for (let i = 0; i < lineIndex; i++) {
    idx += content.value[i].length
  }
  
  const currentLine = content.value[lineIndex]
  const words = currentLine.split(/(\s+)/)
  
  for (let j = 0; j < wordIndex; j++) {
    idx += words[j].length
  }
  
  return idx + charIndex
}

const getEnglishClassForWord = (lineIndex: number, wordIndex: number, charIndex: number) => {
  const idx = getEnglishIndexForWord(lineIndex, wordIndex, charIndex)
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

const getCharToSpeak = (idx: number): { text: string; lang: 'zh-CN' | 'en-US' } | null => {
  let flatIndex = 0
  
  for (let lineIndex = 0; lineIndex < content.value.length; lineIndex++) {
    const line = content.value[lineIndex]
    const words = line.split(/(\s+)/)
    
    for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
      const word = words[wordIndex]
      const isWord = /\w/.test(word)
      
      if (isWord) {
        for (let charIndex = 0; charIndex < word.length; charIndex++) {
          if (idx === flatIndex + charIndex) {
            if (charIndex === word.length - 1) {
              return { text: word, lang: 'en-US' }
            }
            return null
          }
        }
      }
      flatIndex += word.length
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

  &.en {
    .typing-line {
      white-space: pre-wrap;
      word-break: keep-all;
      word-wrap: normal;
    }
  }

  .typing-lines {
    position: relative;
    z-index: 1;

    .typing-line {
      margin-bottom: 24px;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      row-gap: 12px;
    }

    .typing-word {
      margin-right: 8px;
      display: inline-flex;
      flex-wrap: nowrap;
    }

    .typing-char {
      position: relative;
      display: inline-block;
      padding: 6px 3px;
      margin: 0 2px;
      background-color: transparent;
      transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1),
                  background-color 0.15s,
                  box-shadow 0.15s;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3px;
        background-color: var(--typing-active-border);
        transform: scaleX(0);
        transition: transform 0.15s;
      }

      &.active {
        background-color: var(--typing-active-bg);
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

        &::after {
          transform: scaleX(1);
        }
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
        animation: shake 0.3s ease-in-out;
      }
    }
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
</style>
