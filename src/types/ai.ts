export type AILanguage = 'cn' | 'en' | 'hanzi'

export interface AITag {
  id: string
  name: string
  promptTemplate: string
}

export interface AICategory {
  id: AILanguage
  name: string
  tags: AITag[]
}

export interface AIConfig {
  apiKey: string
  apiUrl: string
  model: string
}

export interface GeneratedArticle {
  id: string
  title: string
  content: string
  language: AILanguage
  source: 'manual' | 'ai'
  tagId?: string
  timestamp: number
  date: string
}

export const AI_CATEGORIES: AICategory[] = [
  {
    id: 'cn',
    name: '汉语拼音',
    tags: [
      {
        id: 'tang-song',
        name: '唐诗宋词',
        promptTemplate: '请生成一段优美的中文古典诗词片段，200字左右。'
      },
      {
        id: 'sci-fi',
        name: '科幻片段',
        promptTemplate: '请生成一段精彩的科幻小说片段，描写未来世界的场景，250字左右。'
      },
      {
        id: 'healing',
        name: '治愈语录',
        promptTemplate: '请生成一段温暖治愈的文字，给人带来心灵慰藉，200字左右。'
      }
    ]
  },
  {
    id: 'en',
    name: 'English',
    tags: [
      {
        id: 'tech-news',
        name: 'Tech News',
        promptTemplate: 'Please write a short tech news article about the latest technology trends, about 200 words.'
      },
      {
        id: 'classic-literature',
        name: 'Classic Literature',
        promptTemplate: 'Please generate a beautiful paragraph of classic English literature style, about 200 words.'
      },
      {
        id: 'ielts-essay',
        name: 'IELTS Essay',
        promptTemplate: 'Please write an IELTS-style essay paragraph on a common topic, about 250 words.'
      }
    ]
  },
  {
    id: 'hanzi',
    name: '汉字练习',
    tags: [
      {
        id: 'common-chars',
        name: '常用汉字',
        promptTemplate: '请生成一段包含20个常用汉字的文字，适合汉字输入练习。'
      },
      {
        id: 'idioms',
        name: '成语练习',
        promptTemplate: '请生成5个常用成语，每个成语单独一行。'
      },
      {
        id: 'poetry',
        name: '诗词名句',
        promptTemplate: '请生成3句经典诗词名句，每句单独一行。'
      }
    ]
  }
]
