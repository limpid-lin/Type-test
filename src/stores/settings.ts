import { defineStore } from 'pinia'
import type { SettingsState, Theme, SoundPackId } from '@/types/settings'

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    theme: 'dark',
    soundPack: 'classic',
    soundEnabled: true,
    speechEnabled: true,
    keyboardVisible: false
  }),

  actions: {
    setTheme(theme: Theme) {
      this.theme = theme
      document.documentElement.setAttribute('data-theme', theme)
      localStorage.setItem('theme', theme)
    },

    setSoundPack(pack: SoundPackId) {
      this.soundPack = pack
      localStorage.setItem('soundPack', pack)
    },

    toggleSound() {
      this.soundEnabled = !this.soundEnabled
      localStorage.setItem('soundEnabled', String(this.soundEnabled))
    },

    toggleSpeech() {
      this.speechEnabled = !this.speechEnabled
      localStorage.setItem('speechEnabled', String(this.speechEnabled))
    },

    toggleKeyboard() {
      this.keyboardVisible = !this.keyboardVisible
      localStorage.setItem('keyboardVisible', String(this.keyboardVisible))
    },

    setKeyboardVisible(visible: boolean) {
      this.keyboardVisible = visible
      localStorage.setItem('keyboardVisible', String(visible))
    },

    init() {
      const savedTheme = localStorage.getItem('theme') as Theme
      const savedSoundPack = localStorage.getItem('soundPack') as SoundPackId
      const savedSoundEnabled = localStorage.getItem('soundEnabled')
      const savedSpeechEnabled = localStorage.getItem('speechEnabled')
      const savedKeyboardVisible = localStorage.getItem('keyboardVisible')

      if (savedTheme) this.theme = savedTheme
      if (savedSoundPack) this.soundPack = savedSoundPack
      if (savedSoundEnabled !== null) this.soundEnabled = savedSoundEnabled === 'true'
      if (savedSpeechEnabled !== null) this.speechEnabled = savedSpeechEnabled === 'true'
      if (savedKeyboardVisible !== null) this.keyboardVisible = savedKeyboardVisible === 'true'

      document.documentElement.setAttribute('data-theme', this.theme)
    }
  }
})
