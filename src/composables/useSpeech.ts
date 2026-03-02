import { ref } from 'vue'
import Speech from 'speak-tts'
import { useSettingsStore } from '@/stores/settings'
import { useTypingStore } from '@/stores/typing'

export function useSpeech() {
  const settingsStore = useSettingsStore()
  const typingStore = useTypingStore()

  // 状态
  const speechSupported = ref(false)
  const speechInitialized = ref(false)
  const lastSpokenIndex = ref(-1)
  const isSpeaking = ref(false)

  let speechInstance: Speech | null = null

  const initSpeech = async () => {
    if (typeof window === 'undefined') return

    try {
      speechInstance = new Speech()
      
      // 初始化
      await speechInstance.init({
        volume: 1,
        lang: 'zh-CN',
        rate: 1, 
        pitch: 1,
        splitSentences: false,
        listeners: {
          onstart: () => { isSpeaking.value = true },
          onend: () => { isSpeaking.value = false },
          onerror: () => { isSpeaking.value = false }
        }
      })

      speechSupported.value = true
      speechInitialized.value = true
    } catch (e) {
      console.error('Speech init failed:', e)
      speechSupported.value = false
    }
  }

  const speak = (text: string, lang: 'zh-CN' | 'en-US' = 'zh-CN') => {
    // 1. 基础检查
    if (!settingsStore.speechEnabled || !speechInitialized.value || !text || !speechInstance) return
    
    // 2. 防止重复触发逻辑（光标回退时不要重读）
    if (lastSpokenIndex.value >= typingStore.index - 1) return

    try {
      // 3. 设置语言
      // speak-tts 的 setLanguage 是同步的，会在创建发音对象前生效
      speechInstance.setLanguage(lang)

      // 4. 核心修改：queue: true
      // 不要 await，直接发给浏览器，浏览器会自动排队
      // queue: true 表示 "加入队列，等上一句读完再读我"
      speechInstance.speak({
        text: text,
        queue: false, 
        listeners: {
          onerror: () => {
            // console.error('Single utterance error:', e)
          }
        }
      }).catch(e => {
        // 捕获可能的 Promise rejection，防止控制台报错
        // 这里的 catch 不会影响队列里的其他声音
        console.warn('Speech ignored or canceled:', e)
      })

    } catch (e) {
      console.error('Speak calling error:', e)
    }
  }

  const resetLastSpokenIndex = () => {
    lastSpokenIndex.value = -1
    // 如果重置了（比如重新开始游戏），才需要取消当前正在读的声音
    if (speechInstance) {
      speechInstance.cancel()
    }
    isSpeaking.value = false
  }

  const updateLastSpokenIndex = (index: number) => {
    lastSpokenIndex.value = index
  }

  return {
    speechSupported,
    speechInitialized,
    lastSpokenIndex,
    isSpeaking,
    initSpeech,
    speak,
    resetLastSpokenIndex,
    updateLastSpokenIndex
  }
}