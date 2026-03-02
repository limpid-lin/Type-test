import { defineStore } from 'pinia'
import type { Article, CharStatus } from '@/types'
import { convertChinesePunctuation } from '@/utils'

interface TypingState {
  index: number
  correctCount: number
  isComplete: boolean
  startTime: number | null
  isFirstKeyDown: boolean
  currentArticleId: string | null
  currentArticleTitle: string
  language: 'cn' | 'en' | 'hanzi'
  article: Article | null
  charStatuses: CharStatus[]
  typingSpeed: number
  typingAccuracy: number
  hasStarted: boolean
}

function getTargetCharsForArticle(art: Article | null): string[] {
  if (!art) return []
  const content = art.content
  if (art.language === 'cn') {
    const chars: string[] = []
    const cnContent = content as Array<Array<{ pinyin?: string; pinyinTone?: string; hanzi?: string }>>
    for (const line of cnContent) {
      for (const char of line) {
        if (char.pinyin && typeof char.pinyin === 'string') {
          char.pinyin.split('').forEach((p) => {
            chars.push(convertChinesePunctuation(p))
          })
        } else if (char.hanzi) {
          chars.push(char.hanzi)
        }
      }
    }
    return chars
  } else if (art.language === 'en') {
    return (content as string[]).join('').split('')
  } else if (art.language === 'hanzi') {
    const chars: string[] = []
    const hanziContent = content as Array<Array<{ hanzi?: string }>>
    for (const line of hanziContent) {
      for (const char of line) {
        if (char.hanzi) {
          chars.push(char.hanzi)
        }
      }
    }
    return chars
  }
  return []
}

export const useTypingStore = defineStore('typing', {
  state: (): TypingState => ({
    index: 0,
    correctCount: 0,
    isComplete: false,
    startTime: null,
    isFirstKeyDown: true,
    currentArticleId: null,
    currentArticleTitle: '',
    language: 'en',
    article: null,
    charStatuses: [],
    typingSpeed: 0,
    typingAccuracy: 0,
    hasStarted: false
  }),

  getters: {
    progressPercent: (state) => {
      if (!state.article) return 0
      const total = state.charStatuses.length
      if (total === 0) return 0
      return Math.min(100, (state.index / total) * 100)
    },

    targetChars: (state): string[] => {
      return getTargetCharsForArticle(state.article)
    }
  },

  actions: {
    reset() {
      this.index = 0
      this.correctCount = 0
      this.isComplete = false
      this.startTime = null
      this.isFirstKeyDown = true
      this.hasStarted = false
      this.typingSpeed = 0
      this.typingAccuracy = 0
    },

    startTypingWithArticle(article: Article) {
      this.article = article
      this.currentArticleId = article.id
      this.currentArticleTitle = article.title
      this.language = article.language
      const chars = getTargetCharsForArticle(article)
      this.charStatuses = chars.map(() => 'pending')
      this.reset()
    },

    startTimer() {
      if (this.isFirstKeyDown) {
        this.startTime = Date.now()
        this.isFirstKeyDown = false
        this.hasStarted = true
      }
    },

    updateStats() {
      if (this.startTime !== null) {
        const timeSpent = (Date.now() - this.startTime) / 1000 / 60
        if (timeSpent > 0) {
          this.typingSpeed = Math.round(this.index / timeSpent)
        }
      }

      if (this.index > 0) {
        this.typingAccuracy = Math.round((this.correctCount / this.index) * 100)
      }
    },

    handleKeyPress(key: string) {
      if (!this.article || this.isComplete) return false

      const chars = this.targetChars

      if (key === 'Backspace') {
        if (this.index <= 0) return false
        this.index--
        if (this.charStatuses[this.index] === 'correct' || this.charStatuses[this.index] === 'modified') {
          this.correctCount--
        }
        this.charStatuses[this.index] = 'pending'
      } else if (key.length === 1) {
        const currentChar = chars[this.index]
        const prevStatus = this.charStatuses[this.index]

        if (key === currentChar) {
          if (prevStatus === 'pending') {
            this.charStatuses[this.index] = 'correct'
            this.correctCount++
          } else if (prevStatus === 'error') {
            this.charStatuses[this.index] = 'modified'
            this.correctCount++
          }
        } else {
          this.charStatuses[this.index] = 'error'
        }

        this.index++

        if (this.index >= chars.length) {
          this.isComplete = true
        }
      }

      this.updateStats()
      return true
    },

    handleHanziInput(inputChars: string[]) {
      if (!this.article || this.isComplete) return false

      const chars = this.targetChars
      let processed = 0

      for (const inputChar of inputChars) {
        if (this.index >= chars.length) break

        const currentChar = chars[this.index]
        const prevStatus = this.charStatuses[this.index]

        if (inputChar === currentChar) {
          if (prevStatus === 'pending') {
            this.charStatuses[this.index] = 'correct'
            this.correctCount++
          } else if (prevStatus === 'error') {
            this.charStatuses[this.index] = 'modified'
            this.correctCount++
          }
        } else {
          this.charStatuses[this.index] = 'error'
        }

        this.index++
        processed++
      }

      if (this.index >= chars.length) {
        this.isComplete = true
      }

      this.updateStats()
      return processed > 0
    },

    handleHanziBackspace(count: number = 1) {
      if (!this.article || this.index <= 0) return false

      for (let i = 0; i < count && this.index > 0; i++) {
        this.index--
        if (this.charStatuses[this.index] === 'correct' || this.charStatuses[this.index] === 'modified') {
          this.correctCount--
        }
        this.charStatuses[this.index] = 'pending'
      }

      this.updateStats()
      return true
    }
  }
})
