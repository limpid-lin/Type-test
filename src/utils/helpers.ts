import { PUNCTUATION_MAP } from './constants'

export function convertChinesePunctuation(input: string): string {
  const regex = new RegExp(`[${Object.keys(PUNCTUATION_MAP).join('')}]`, 'g')
  return input.replace(regex, (match) => PUNCTUATION_MAP[match] || match)
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toISOString().split('T')[0]
}

export function calculateSpeed(charCount: number, durationMs: number): number {
  if (durationMs <= 0) return 0
  return Math.floor((charCount / durationMs) * 1000 * 60)
}

export function calculateAccuracy(correctCount: number, totalCount: number): number {
  if (totalCount <= 0) return 0
  return Math.floor((correctCount / totalCount) * 100)
}
