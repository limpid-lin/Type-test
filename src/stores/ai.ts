import { defineStore } from 'pinia'
import type { AIConfig, AILanguage, GeneratedArticle } from '@/types/ai'

const DEFAULT_API_KEY = import.meta.env.VITE_AI_API_KEY || ''
const DEFAULT_API_URL = import.meta.env.VITE_AI_API_URL || ''
const DEFAULT_MODEL = import.meta.env.VITE_AI_MODEL || 'deepseek-chat'

export const useAIStore = defineStore('ai', {
  state: () => ({
    config: {
      apiKey: DEFAULT_API_KEY,
      apiUrl: DEFAULT_API_URL,
      model: DEFAULT_MODEL
    } as AIConfig,
    
    isGenerating: false,
    generatedContent: '',
    generatedTitle: '',
    currentLanguage: 'cn' as AILanguage,
    currentTagId: '',
    
    generatedArticles: [] as GeneratedArticle[]
  }),

  getters: {
    hasApiKey: (state) => state.config.apiKey.length > 0
  },

  actions: {
    loadFromStorage() {
      const savedConfig = localStorage.getItem('aiConfig')
      const savedArticles = localStorage.getItem('aiGeneratedArticles')
      
      if (savedConfig) {
        this.config = JSON.parse(savedConfig)
      }
      if (savedArticles) {
        this.generatedArticles = JSON.parse(savedArticles)
      }
    },

    saveConfig() {
      localStorage.setItem('aiConfig', JSON.stringify(this.config))
    },

    saveGeneratedArticles() {
      localStorage.setItem('aiGeneratedArticles', JSON.stringify(this.generatedArticles))
    },

    setConfig(config: Partial<AIConfig>) {
      this.config = { ...this.config, ...config }
      this.saveConfig()
    },

    setLanguage(language: AILanguage) {
      this.currentLanguage = language
    },

    setTagId(tagId: string) {
      this.currentTagId = tagId
    },

    startGeneration() {
      this.isGenerating = true
      this.generatedContent = ''
      this.generatedTitle = ''
    },

    appendContent(chunk: string) {
      this.generatedContent += chunk
    },

    setTitle(title: string) {
      this.generatedTitle = title
    },

    async generateContent(prompt: string, title: string) {
      this.startGeneration()
      this.setTitle(title)

      try {
        if (!this.config.apiKey) {
          this.generatedContent = 'AI 生成需要配置 API Key。请在设置中配置你的 API Key。\n\n这是一段示例文本，用于演示功能。'
          this.finishGeneration()
          return
        }

        const response = await fetch(this.config.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`
          },
          body: JSON.stringify({
            model: this.config.model,
            messages: [
              {
                role: 'system',
                content: 'You are a helpful assistant that generates text for typing practice. Generate only the text content without any extra explanation or formatting.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            stream: true
          })
        })

        if (!response.ok) {
          throw new Error('API request failed')
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') continue

                try {
                  const parsed = JSON.parse(data)
                  const content = parsed.choices?.[0]?.delta?.content
                  if (content) {
                    this.appendContent(content)
                  }
                } catch {
                  continue
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('AI generation error:', error)
        this.generatedContent = `AI 生成失败：${error instanceof Error ? error.message : '未知错误'}\n\n这是一段示例文本，用于演示功能。`
      }

      this.finishGeneration()
    },

    finishGeneration() {
      this.isGenerating = false

      if (this.generatedContent && this.generatedContent.length > 10) {
        const article: GeneratedArticle = {
          id: Date.now().toString(),
          title: this.generatedTitle || `AI 生成 - ${new Date().toLocaleDateString()}`,
          content: this.generatedContent,
          language: this.currentLanguage,
          source: 'ai',
          tagId: this.currentTagId,
          timestamp: Date.now(),
          date: new Date().toISOString().split('T')[0]
        }

        this.generatedArticles.unshift(article)
        if (this.generatedArticles.length > 50) {
          this.generatedArticles = this.generatedArticles.slice(0, 50)
        }
        this.saveGeneratedArticles()
      }
    },

    clearGeneratedArticles() {
      this.generatedArticles = []
      this.saveGeneratedArticles()
    }
  }
})
