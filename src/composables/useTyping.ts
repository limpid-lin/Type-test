import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTypingStore } from '@/stores/typing'
import { useAudio } from './useAudio'
import { calculateSpeed, calculateAccuracy } from '@/utils'
import type { CharStatus } from '@/types'

export function useTyping(targetChars: string[], options?: { isCodeMode?: boolean }) {
  const { isCodeMode = false } = options || {}
  const typingStore = useTypingStore()
  const { play } = useAudio()

  const index = ref(0)
  const correctCount = ref(0)
  const charStatuses = ref<Array<CharStatus>>(
    targetChars.map(() => 'pending')
  )

  const speed = ref(0)
  const accuracy = ref(0)
  const isComplete = ref(false)
  const startTime = ref<number | null>(null)

  const progress = computed(() => {
    if (targetChars.length === 0) return 0
    return (index.value / targetChars.length) * 100
  })

  const modifiedCount = computed(() => {
    return charStatuses.value.filter(s => s === 'modified').length
  })

  const findNextNonWhitespace = (startIndex: number): number => {
    for (let i = startIndex; i < targetChars.length; i++) {
      const char = targetChars[i]
      if (char !== ' ' && char !== '\t') {
        return i
      }
    }
    return targetChars.length
  }

  const autoSkipIndentation = () => {
    if (!isCodeMode) return
    
    const nextIndex = findNextNonWhitespace(index.value)
    if (nextIndex > index.value) {
      for (let i = index.value; i < nextIndex; i++) {
        charStatuses.value[i] = 'correct'
        correctCount.value++
      }
      index.value = nextIndex
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isComplete.value) return

    const { key } = e

    if (key === ' ') e.preventDefault()
    if (key === 'Shift') return

    if (startTime.value === null) {
      startTime.value = Date.now()
    }

    if (key === 'Backspace') {
      if (index.value <= 0) return

      play('delete')
      index.value--

      if (charStatuses.value[index.value] === 'correct' || charStatuses.value[index.value] === 'modified') {
        correctCount.value--
        if (correctCount.value < 0) correctCount.value = 0
      }
      charStatuses.value[index.value] = 'pending'
    } else if (key === 'Enter') {
      e.preventDefault()
      if (targetChars[index.value] === '\n') {
        play('correct')
        charStatuses.value[index.value] = 'correct'
        correctCount.value++
        index.value++
        
        if (isCodeMode) {
          autoSkipIndentation()
        }
      } else {
        play('error')
        charStatuses.value[index.value] = 'error'
        index.value++
      }
    } else if (key.length === 1) {
      const currentChar = targetChars[index.value]
      const prevStatus = charStatuses.value[index.value]

      if (key === currentChar) {
        play('correct')
        if (prevStatus === 'error') {
          charStatuses.value[index.value] = 'modified'
        } else {
          charStatuses.value[index.value] = 'correct'
        }
        correctCount.value++
      } else {
        play('error')
        charStatuses.value[index.value] = 'error'
      }

      index.value++
    }

    const duration = Date.now() - (startTime.value || Date.now())
    speed.value = calculateSpeed(index.value, duration)
    accuracy.value = calculateAccuracy(correctCount.value, index.value)

    if (index.value >= targetChars.length) {
      isComplete.value = true
      play('complete')
    }
  }

  const reset = () => {
    index.value = 0
    correctCount.value = 0
    charStatuses.value = targetChars.map(() => 'pending')
    speed.value = 0
    accuracy.value = 0
    isComplete.value = false
    startTime.value = null
    typingStore.reset()
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })

  return {
    index,
    correctCount,
    charStatuses,
    speed,
    accuracy,
    isComplete,
    progress,
    modifiedCount,
    reset
  }
}
