export type CharStatus = 'pending' | 'correct' | 'error' | 'modified'

export interface TypingState {
  index: number
  correctCount: number
  isComplete: boolean
  startTime: number | null
  isFirstKeyDown: boolean
  currentArticleId: string | null
  currentArticleTitle: string
  language: 'cn' | 'en' | 'hanzi'
}

export interface TypingRecord {
  id: string
  articleId: string
  articleTitle: string
  language: 'cn' | 'en' | 'hanzi'
  speed: number
  accuracy: number
  modifiedRatio: number
  duration: number
  timestamp: number
  date: string
}

export interface ChartDataPoint {
  date: string
  speed: number
  accuracy: number
}
