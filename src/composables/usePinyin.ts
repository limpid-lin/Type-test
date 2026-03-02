import { pinyin } from 'pinyin-pro'
import { convertChinesePunctuation } from '@/utils'

export function usePinyin() {
  const convertToPinyin = (
    text: string
  ): Array<
    Array<{
      hanzi: string
      pinyinTone: string
      pinyin: string
    }>
  > => {
    const lines = text.trim().split('\n')
    return lines.map((line) => {
      const trimmedLine = line.trim()
      return trimmedLine.split('').map((char) => ({
        hanzi: char,
        pinyinTone: pinyin(char),
        pinyin: pinyin(char, { toneType: 'none', v: true })
      }))
    })
  }

  const flattenPinyinArray = (
    content: Array<
      Array<{
        hanzi: string
        pinyinTone: string
        pinyin: string
      }>
    >
  ): string[] => {
    const result: string[] = []
    content.forEach((line) => {
      line.forEach((char) => {
        char.pinyin.split('').forEach((p) => {
          result.push(convertChinesePunctuation(p))
        })
      })
    })
    return result
  }

  return {
    convertToPinyin,
    flattenPinyinArray
  }
}
