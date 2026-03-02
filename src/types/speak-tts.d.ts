declare module 'speak-tts' {
  interface SpeechOptions {
    text: string
    queue?: boolean
    listeners?: {
      onstart?: () => void
      onend?: () => void
      onerror?: (e: any) => void
    }
  }

  interface InitOptions {
    volume?: number
    lang?: string
    rate?: number
    pitch?: number
    splitSentences?: boolean
    listeners?: {
      onstart?: () => void
      onend?: () => void
      onerror?: (e: any) => void
    }
  }

  interface SpeechData {
    voices: SpeechSynthesisVoice[]
    lang: string
    voice?: SpeechSynthesisVoice
  }

  class Speech {
    constructor()
    init(options?: InitOptions): Promise<SpeechData>
    speak(options: SpeechOptions): Promise<void>
    setLanguage(lang: string): void
    setVoice(voice: string): void
    setVolume(volume: number): void
    setRate(rate: number): void
    setPitch(pitch: number): void
    pause(): void
    resume(): void
    cancel(): void
    pending(): boolean
    speaking(): boolean
    paused(): boolean
  }

  export default Speech
}
