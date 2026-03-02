<template>
  <div class="hanzi-practice-container">
    <div class="hanzi-lines">
      <div 
        v-for="(line, lineIndex) in content" 
        :key="lineIndex"
        class="hanzi-line"
        :class="{ active: isLineActive(lineIndex) }"
      >
        <div class="target-line">
          <span 
            v-for="(char, charIndex) in line" 
            :key="charIndex"
            class="target-char"
            :class="getTargetCharClass(lineIndex, charIndex)"
          >
            {{ char.hanzi }}
          </span>
        </div>
        
        <div class="input-line" v-if="isLineActive(lineIndex)">
          <div class="input-wrapper">
            <span class="confirmed-chars">
              <span 
                v-for="(char, idx) in getLineConfirmedChars(lineIndex)" 
                :key="idx"
                class="confirmed-char"
                :class="getConfirmedCharClass(lineIndex, idx)"
              >
                {{ char }}
              </span>
            </span>
            <input
              :ref="(el) => setInputRef(el, lineIndex)"
              v-model="inputValues[lineIndex]"
              type="text"
              class="hanzi-input"
              @compositionstart="handleCompositionStart"
              @compositionend="handleCompositionEnd($event, lineIndex)"
              @input="handleInput(lineIndex)"
              @keydown="handleKeyDown($event, lineIndex)"
              autocomplete="off"
              autocapitalize="off"
              spellcheck="false"
            />
          </div>
        </div>
        
        <div class="completed-line" v-else-if="isLineCompleted(lineIndex)">
          <span class="completed-chars">
            <span 
              v-for="(char, idx) in getLineConfirmedChars(lineIndex)" 
              :key="idx"
              class="completed-char"
              :class="getConfirmedCharClass(lineIndex, idx)"
            >
              {{ char }}
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick, reactive } from 'vue'
import { useTypingStore } from '@/stores/typing'
import { useAudio } from '@/composables/useAudio'

const typingStore = useTypingStore()
const { play } = useAudio()

const inputRefs = ref<(HTMLInputElement | null)[]>([])
const inputValues = reactive<Record<number, string>>({})
const confirmedInputs = reactive<Record<number, string[]>>({})
const isComposing = ref(false)

const content = computed(() => {
  const article = typingStore.article
  if (!article || article.language !== 'hanzi') return []
  return article.content as Array<Array<{ hanzi: string }>>
})
const index = computed(() => typingStore.index)
const charStatuses = computed(() => typingStore.charStatuses)


const setInputRef = (el: any, lineIndex: number) => {
  if (el) {
    inputRefs.value[lineIndex] = el
  }
}

const getLineStartIndex = (lineIndex: number) => {
  let idx = 0
  for (let i = 0; i < lineIndex; i++) {
    idx += content.value[i].length
  }
  return idx
}

const getLineEndIndex = (lineIndex: number) => {
  return getLineStartIndex(lineIndex) + content.value[lineIndex].length
}

const isLineActive = (lineIndex: number) => {
  const start = getLineStartIndex(lineIndex)
  const end = getLineEndIndex(lineIndex)
  return index.value >= start && index.value < end
}

const isLineCompleted = (lineIndex: number) => {
  const end = getLineEndIndex(lineIndex)
  return index.value >= end
}

const getLineConfirmedChars = (lineIndex: number) => {
  const start = getLineStartIndex(lineIndex)
  const end = getLineEndIndex(lineIndex)
  const chars = confirmedInputs[lineIndex] || []
  const result: string[] = []
  for (let i = start; i < Math.min(end, index.value); i++) {
    const charIndex = i - start
    if (charIndex < chars.length) {
      result.push(chars[charIndex])
    }
  }
  return result
}

const getTargetCharClass = (lineIndex: number, charIndex: number) => {
  const idx = getLineStartIndex(lineIndex) + charIndex
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

const getConfirmedCharClass = (lineIndex: number, charIndex: number) => {
  const idx = getLineStartIndex(lineIndex) + charIndex
  if (idx >= charStatuses.value.length) {
    return ''
  }
  const status = charStatuses.value[idx]
  if (status === 'pending') return ''
  return status
}

const getCurrentLineIndex = () => {
  for (let i = 0; i < content.value.length; i++) {
    if (isLineActive(i)) {
      return i
    }
  }
  return content.value.length - 1
}

const processInput = (lineIndex: number) => {
  const inputValue = inputValues[lineIndex]
  if (!inputValue || isComposing.value) return

  const inputChars = Array.from(inputValue)
  if (inputChars.length === 0) return

  typingStore.startTimer()

  const chars = typingStore.targetChars
  let correctCount = 0
  let hasError = false

  if (!confirmedInputs[lineIndex]) {
    confirmedInputs[lineIndex] = []
  }

  for (const inputChar of inputChars) {
    if (typingStore.index >= chars.length) break

    const currentChar = chars[typingStore.index]
    const prevStatus = typingStore.charStatuses[typingStore.index]

    if (inputChar === currentChar) {
      if (prevStatus === 'pending') {
        typingStore.charStatuses[typingStore.index] = 'correct'
        typingStore.correctCount++
      } else if (prevStatus === 'error') {
        typingStore.charStatuses[typingStore.index] = 'modified'
        typingStore.correctCount++
      }
      correctCount++
      confirmedInputs[lineIndex].push(inputChar)
    } else {
      typingStore.charStatuses[typingStore.index] = 'error'
      hasError = true
      confirmedInputs[lineIndex].push(inputChar)
    }

    typingStore.index++
  }

  if (correctCount > 0) {
    play('correct')
  }
  if (hasError) {
    play('error')
  }

  typingStore.updateStats()

  if (typingStore.index >= chars.length) {
    typingStore.isComplete = true
  }

  inputValues[lineIndex] = ''
  focusInput(lineIndex)
}

const handleCompositionStart = () => {
  isComposing.value = true
}

const handleCompositionEnd = (_e: CompositionEvent, lineIndex: number) => {
  isComposing.value = false
  processInput(lineIndex)
}

const handleInput = (lineIndex: number) => {
  const inputValue = inputValues[lineIndex]
  if (!inputValue) return

  if (isComposing.value) return

  const inputChars = Array.from(inputValue)
  if (inputChars.length === 0) return

  typingStore.startTimer()

  const chars = typingStore.targetChars
  let processed = 0
  let correctCount = 0
  let hasError = false

  if (!confirmedInputs[lineIndex]) {
    confirmedInputs[lineIndex] = []
  }

  for (const inputChar of inputChars) {
    if (typingStore.index >= chars.length) break

    const currentChar = chars[typingStore.index]
    const prevStatus = typingStore.charStatuses[typingStore.index]

    if (inputChar === currentChar) {
      if (prevStatus === 'pending') {
        typingStore.charStatuses[typingStore.index] = 'correct'
        typingStore.correctCount++
      } else if (prevStatus === 'error') {
        typingStore.charStatuses[typingStore.index] = 'modified'
        typingStore.correctCount++
      }
      correctCount++
      confirmedInputs[lineIndex].push(inputChar)
    } else {
      typingStore.charStatuses[typingStore.index] = 'error'
      hasError = true
      confirmedInputs[lineIndex].push(inputChar)
    }

    typingStore.index++
    processed++
  }

  if (correctCount > 0) {
    play('correct')
  }
  if (hasError) {
    play('error')
  }

  typingStore.updateStats()

  if (typingStore.index >= chars.length) {
    typingStore.isComplete = true
  }

  inputValues[lineIndex] = ''
  focusInput(lineIndex)
}

const handleKeyDown = (e: KeyboardEvent, lineIndex: number) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    if (!isComposing.value) {
      processInput(lineIndex)
    }
  } else if (e.key === 'Backspace') {
    if (inputValues[lineIndex] === '' && typingStore.index > 0) {
      e.preventDefault()
      typingStore.index--
      
      if (typingStore.charStatuses[typingStore.index] === 'correct' || 
          typingStore.charStatuses[typingStore.index] === 'modified') {
        typingStore.correctCount--
      }
      typingStore.charStatuses[typingStore.index] = 'pending'
      
      const prevCharIndex = typingStore.index
      
      for (let i = 0; i < content.value.length; i++) {
        const lineStart = getLineStartIndex(i)
        const lineEnd = getLineEndIndex(i)
        if (prevCharIndex >= lineStart && prevCharIndex < lineEnd) {
          if (confirmedInputs[i] && confirmedInputs[i].length > 0) {
            confirmedInputs[i].pop()
          }
          break
        }
      }
      
      typingStore.updateStats()
      play('delete')
    }
  }
}

const focusInput = (lineIndex: number) => {
  nextTick(() => {
    const inputEl = inputRefs.value[lineIndex]
    if (inputEl) {
      inputEl.focus()
    }
  })
}

watch(() => typingStore.index, () => {
  const currentLine = getCurrentLineIndex()
  if (currentLine >= 0) {
    focusInput(currentLine)
  }
})

onMounted(() => {
  nextTick(() => {
    const currentLine = getCurrentLineIndex()
    if (currentLine >= 0) {
      focusInput(currentLine)
    }
  })
})
</script>

<style scoped lang="scss">
.hanzi-practice-container {
  width: 100%;
  background: transparent;
  user-select: none;
}

.hanzi-lines {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hanzi-line {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.4;
  border-radius: 8px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border-color), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:first-child::before {
    display: none;
  }

  &.active {
    opacity: 1;
    transform: translateY(-2px);
    
    &::before {
      opacity: 1;
    }
    
    .input-line {
      .input-wrapper {
        border-left: 3px solid var(--accent-primary);
        padding: 16px 20px;
        box-shadow: var(--shadow-sm);
      }
    }
  }
  
  &:hover {
    opacity: 0.6;
  }
  
  &.active:hover {
    opacity: 1;
  }
}

.target-line {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding-bottom: 8px;
  position: relative;
  padding: 8px;
}

.target-line::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--border-color);
  transition: background 0.3s ease;
}

.target-char {
  font-size: 40px;
  padding: 4px 8px;
  color: var(--text-muted);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  line-height: 1.2;
  border-radius: 4px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    transition: left 0.6s ease;
  }

  &:hover::before {
    left: 100%;
  }

  &.active {
    color: var(--text-primary);
    font-weight: 600;
    background: var(--typing-active-bg);
    border: 1px solid var(--typing-active-border);
    transform: scale(1.05);
  }

  &.correct {
    color: var(--text-primary);
    background: var(--typing-correct-bg);
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(48, 209, 88, 0.3);
  }

  &.modified {
    color: var(--text-primary);
    background: var(--typing-modified-bg);
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(255, 214, 10, 0.3);
  }

  &.error {
    color: var(--text-primary);
    background: var(--typing-error-bg);
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(255, 69, 58, 0.3);
  }
}

.input-line {
  margin-top: 4px;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background: transparent;
  border-radius: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 64px;
  position: relative;
  overflow: hidden;
}

.confirmed-chars {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.confirmed-char {
  font-size: 36px;
  padding: 4px 8px;
  font-family: inherit;
  line-height: 1.2;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 4px;
  font-weight: 500;

  &.correct {
    color: var(--text-primary);
    background: var(--typing-correct-bg);
    box-shadow: 0 1px 4px rgba(48, 209, 88, 0.2);
  }

  &.modified {
    color: var(--text-primary);
    background: var(--typing-modified-bg);
    box-shadow: 0 1px 4px rgba(255, 214, 10, 0.2);
  }

  &.error {
    color: var(--text-primary);
    background: var(--typing-error-bg);
    box-shadow: 0 1px 4px rgba(255, 69, 58, 0.2);
  }
}

.hanzi-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 36px;
  color: var(--text-primary);
  font-family: inherit;
  line-height: 1.2;
  min-width: 160px;
  padding: 4px 8px;
  caret-color: var(--accent-primary);
  transition: all 0.3s ease;
  border-radius: 4px;

  &::placeholder {
    color: var(--text-muted);
    opacity: 0.6;
    font-size: 28px;
  }
  
  &:focus {
    background: rgba(255, 255, 255, 0.05);
  }
}

.completed-line {
  margin-top: 8px;
  min-height: 64px;
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-radius: 8px;
  background: var(--bg-tertiary);
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--bg-secondary);
    box-shadow: var(--shadow-sm);
  }
}

.completed-chars {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 0 12px;
  width: 100%;
}

.completed-char {
  font-size: 36px;
  padding: 4px 8px;
  font-family: inherit;
  line-height: 1.2;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 4px;
  font-weight: 500;

  &.correct {
    color: var(--text-primary);
    background: var(--typing-correct-bg);
    box-shadow: 0 1px 4px rgba(48, 209, 88, 0.2);
  }

  &.modified {
    color: var(--text-primary);
    background: var(--typing-modified-bg);
    box-shadow: 0 1px 4px rgba(255, 214, 10, 0.2);
  }

  &.error {
    color: var(--text-primary);
    background: var(--typing-error-bg);
    box-shadow: 0 1px 4px rgba(255, 69, 58, 0.2);
  }
}

@media (max-width: 768px) {
  .target-char {
    font-size: 36px;
    padding: 3px 6px;
  }
  
  .confirmed-char,
  .completed-char,
  .hanzi-input {
    font-size: 32px;
    padding: 3px 6px;
  }

  .hanzi-input::placeholder {
    font-size: 24px;
  }

  .hanzi-line {
    padding: 10px 0;
    gap: 6px;
  }

  .input-wrapper {
    min-height: 56px;
    padding: 12px 16px;
  }

  .completed-line {
    min-height: 56px;
  }
  
  .hanzi-lines {
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .target-char {
    font-size: 32px;
    padding: 2px 4px;
  }
  
  .confirmed-char,
  .completed-char,
  .hanzi-input {
    font-size: 28px;
    padding: 2px 4px;
  }

  .hanzi-input::placeholder {
    font-size: 20px;
  }

  .hanzi-line {
    padding: 8px 0;
    gap: 4px;
  }

  .target-line {
    padding-bottom: 6px;
  }

  .input-wrapper {
    min-height: 48px;
    padding: 10px 12px;
  }

  .completed-line {
    min-height: 48px;
  }

  .hanzi-lines {
    gap: 10px;
  }
  
  .confirmed-chars,
  .completed-chars {
    gap: 2px;
  }
}
</style>
