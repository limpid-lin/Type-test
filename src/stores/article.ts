import { defineStore } from 'pinia'
import type { Article, ArticleCN, ArticleEN, ArticleHanzi } from '@/types/article'
import articlesData from '@/data/articles.json'

// 从JSON文件加载文章数据
const cnArticles: ArticleCN[] = articlesData.cnArticles as ArticleCN[]
const enArticles: ArticleEN[] = articlesData.enArticles as ArticleEN[]
const hanziArticles: ArticleHanzi[] = articlesData.hanziArticles as ArticleHanzi[]

export const useArticleStore = defineStore('article', {
  state: () => ({
    articlesCN: {} as Record<string, ArticleCN>,
    articlesEN: {} as Record<string, ArticleEN>,
    articlesHanzi: {} as Record<string, ArticleHanzi>,
    currentArticle: null as Article | null
  }),

  getters: {
    hasArticlesCN: (state) => Object.keys(state.articlesCN).length > 0,
    hasArticlesEN: (state) => Object.keys(state.articlesEN).length > 0,
    hasArticlesHanzi: (state) => Object.keys(state.articlesHanzi).length > 0,
    allHanziArticles: (state) => Object.values(state.articlesHanzi)
  },

  actions: {
    initializeCNArticles() {
      cnArticles.forEach(article => {
        this.articlesCN[article.id] = article as ArticleCN
      })
      this.saveToStorage()
    },

    initializeENArticles() {
      enArticles.forEach(article => {
        this.articlesEN[article.id] = article as ArticleEN
      })
      this.saveToStorage()
    },

    initializeHanziArticles() {
      hanziArticles.forEach(article => {
        this.articlesHanzi[article.id] = article as ArticleHanzi
      })
      this.saveToStorage()
    },

    loadFromStorage() {
      // 先加载默认文章
      this.initializeCNArticles()
      this.initializeENArticles()
      this.initializeHanziArticles()
      
      // 然后加载用户保存的文章（会覆盖默认文章的ID冲突）
      const savedCN = localStorage.getItem('ContentInfoCN')
      const savedEN = localStorage.getItem('ContentInfoEN')
      const savedHanzi = localStorage.getItem('ContentInfoHanzi')
      
      if (savedCN) {
        try {
          const parsed = JSON.parse(savedCN)
          // 只加载非默认文章（ID大于默认文章数量的）
          Object.entries(parsed).forEach(([id, article]) => {
            if (Number(id) > cnArticles.length) {
              this.articlesCN[id] = article as ArticleCN
            }
          })
        } catch (e) {
          console.error('Failed to load CN articles:', e)
        }
      }
      
      if (savedEN) {
        try {
          const parsed = JSON.parse(savedEN)
          Object.entries(parsed).forEach(([id, article]) => {
            if (Number(id) > enArticles.length) {
              this.articlesEN[id] = article as ArticleEN
            }
          })
        } catch (e) {
          console.error('Failed to load EN articles:', e)
        }
      }
      
      if (savedHanzi) {
        try {
          const parsed = JSON.parse(savedHanzi)
          Object.entries(parsed).forEach(([id, article]) => {
            if (Number(id) > hanziArticles.length) {
              this.articlesHanzi[id] = article as ArticleHanzi
            }
          })
        } catch (e) {
          console.error('Failed to load Hanzi articles:', e)
        }
      }
    },

    saveToStorage() {
      localStorage.setItem('ContentInfoCN', JSON.stringify(this.articlesCN))
      localStorage.setItem('ContentInfoEN', JSON.stringify(this.articlesEN))
      localStorage.setItem('ContentInfoHanzi', JSON.stringify(this.articlesHanzi))
    },

    addArticleCN(article: ArticleCN) {
      const id = String(Object.keys(this.articlesCN).length + 1)
      this.articlesCN[id] = { ...article, id }
      this.saveToStorage()
    },

    addArticleEN(article: ArticleEN) {
      const id = String(Object.keys(this.articlesEN).length + 1)
      this.articlesEN[id] = { ...article, id }
      this.saveToStorage()
    },

    addArticleHanzi(article: ArticleHanzi) {
      const id = String(Object.keys(this.articlesHanzi).length + 1)
      this.articlesHanzi[id] = { ...article, id }
      this.saveToStorage()
    }
  }
})
