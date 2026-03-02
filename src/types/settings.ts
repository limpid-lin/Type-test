export type Theme = 'dark' | 'light' | 'eye-care'

export type SoundType = 'correct' | 'error' | 'delete' | 'complete'

export type SoundPackId = 'classic' | 'mechanical' | 'soft'

export interface SoundPack {
  name: string
  correct: string
  error: string
  delete: string
  complete: string
}

export interface SettingsState {
  theme: Theme
  soundPack: SoundPackId
  soundEnabled: boolean
  speechEnabled: boolean
  keyboardVisible: boolean
}
