export interface Article {
  id: string
  language: 'cn' | 'en' | 'hanzi'
  title: string
  dynasty?: string
  author?: string
  content: string | Array<any>
}

export interface ArticleCN extends Article {
  language: 'cn'
  content: Array<
    Array<{
      hanzi: string
      pinyinTone: string
      pinyin: string
    }>
  >
}

export interface ArticleEN extends Article {
  language: 'en'
  content: string[]
}

export interface ArticleHanzi extends Article {
  language: 'hanzi'
  content: Array<
    Array<{
      hanzi: string
    }>
  >
}
