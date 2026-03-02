import { defineStore } from 'pinia'
import type { TypingRecord, ChartDataPoint } from '@/types/typing'

export const useStatsStore = defineStore('stats', {
  state: () => ({
    records: [] as TypingRecord[]
  }),

  getters: {
    recentRecords: (state) => state.records.slice(0, 20),

    chartData: (state): ChartDataPoint[] => {
      return state.records
        .slice()
        .sort((a, b) => a.timestamp - b.timestamp)
        .map((record) => ({
          date: record.date,
          speed: record.speed,
          accuracy: record.accuracy
        }))
    },

    bestRecords: (state) => {
      const bestByArticle: Record<string, TypingRecord> = {}
      state.records.forEach((record) => {
        const existing = bestByArticle[record.articleId]
        if (!existing || record.accuracy > existing.accuracy) {
          bestByArticle[record.articleId] = record
        }
      })
      return Object.values(bestByArticle)
    },

    overallStats: (state) => {
      if (state.records.length === 0) {
        return {
          totalSessions: 0,
          avgSpeed: 0,
          avgAccuracy: 0,
          avgModifiedRatio: 0,
          bestSpeed: 0,
          bestAccuracy: 0
        }
      }

      const speeds = state.records.map(r => r.speed)
      const accuracies = state.records.map(r => r.accuracy)
      const modifiedRatios = state.records.map(r => r.modifiedRatio || 0)

      return {
        totalSessions: state.records.length,
        avgSpeed: Math.round(speeds.reduce((a, b) => a + b, 0) / speeds.length),
        avgAccuracy: Math.round(accuracies.reduce((a, b) => a + b, 0) / accuracies.length),
        avgModifiedRatio: Math.round(modifiedRatios.reduce((a, b) => a + b, 0) / modifiedRatios.length),
        bestSpeed: Math.max(...speeds),
        bestAccuracy: Math.max(...accuracies)
      }
    }
  },

  actions: {
    loadFromStorage() {
      const saved = localStorage.getItem('typingStats')
      if (saved) {
        this.records = JSON.parse(saved)
      }
    },

    persist() {
      localStorage.setItem('typingStats', JSON.stringify(this.records))
    },

    addRecord(record: Omit<TypingRecord, 'id' | 'timestamp' | 'date'>) {
      const newRecord: TypingRecord = {
        ...record,
        id: Date.now().toString(),
        timestamp: Date.now(),
        date: new Date().toISOString().split('T')[0]
      }
      this.records.unshift(newRecord)
      if (this.records.length > 100) {
        this.records = this.records.slice(0, 100)
      }
      this.persist()
    },

    getRecordsByArticle(articleId: string) {
      return this.records.filter(r => r.articleId === articleId)
    },

    getBestRecordByArticle(articleId: string) {
      const records = this.getRecordsByArticle(articleId)
      if (records.length === 0) return null
      return records.reduce((best, current) => 
        current.accuracy > best.accuracy ? current : best
      )
    },

    clearAll() {
      this.records = []
      this.persist()
    }
  }
})
