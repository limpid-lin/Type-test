import { computed, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import type { SoundType, SoundPack, SoundPackId } from '@/types/settings'
import clickSound from '@/assets/audios/点击音效.mp3'
import errorSound from '@/assets/audios/tengtong.mp3'
import deleteSound from '@/assets/audios/koubanji.mp3'
import completeSound from '@/assets/audios/胜利号角.mp3'
import arcadeSound from '@/assets/audios/街机游戏按钮.mp3'
import dogSound from '@/assets/audios/dog.mp3'
import dogSound2 from '@/assets/audios/dog-2.mp3'
import duckSound from '@/assets/audios/duck.mp3'

const SOUND_PACKS: Record<SoundPackId, SoundPack> = {
  classic: {
    name: '经典',
    correct: clickSound,
    error: errorSound,
    delete: deleteSound,
    complete: completeSound
  },
  mechanical: {
    name: '机械',
    correct: dogSound2,
    error: dogSound,
    delete: deleteSound,     
    complete: completeSound
  },
  soft: {
    name: '轻柔',
    correct: arcadeSound,
    error: duckSound,
    delete: deleteSound,
    complete: completeSound
  }
}

const audioCache = new Map<string, HTMLAudioElement>()

export function useAudio() {
  const settingsStore = useSettingsStore()

  const currentSounds = computed(() => SOUND_PACKS[settingsStore.soundPack])
  
  const soundPackList = Object.entries(SOUND_PACKS).map(([key, pack]) => ({
    id: key as SoundPackId,
    name: pack.name
  }))

  const play = (type: SoundType) => {
    if (!settingsStore.soundEnabled) return

    const src = currentSounds.value[type]
    let audio = audioCache.get(src)

    if (!audio) {
      audio = new Audio()
      audio.src = src
      audio.preload = 'auto'
      audioCache.set(src, audio)
    }

    audio.currentTime = 0
    audio.play().catch(() => {})
  }

  const previewSound = (type: SoundType, packId: SoundPackId) => {
    const src = SOUND_PACKS[packId][type]
    let audio = audioCache.get(`preview-${src}`)

    if (!audio) {
      audio = new Audio()
      audio.src = src
      audio.preload = 'auto'
      audioCache.set(`preview-${src}`, audio)
    }

    audio.currentTime = 0
    audio.play().catch(() => {})
  }

  const playCorrectSound = () => {
    const src = currentSounds.value.correct
    let audio = audioCache.get(src)

    if (!audio) {
      audio = new Audio()
      audio.src = src
      audio.preload = 'auto'
      audioCache.set(src, audio)
    }

    audio.currentTime = 0
    audio.play().catch(() => {})
  }

  const playErrorSound = () => {
    const src = currentSounds.value.error
    let audio = audioCache.get(src)

    if (!audio) {
      audio = new Audio()
      audio.src = src
      audio.preload = 'auto'
      audioCache.set(src, audio)
    }

    audio.currentTime = 0
    audio.play().catch(() => {})
  }

  const playBackspaceSound = () => {
    const src = currentSounds.value.delete
    let audio = audioCache.get(src)

    if (!audio) {
      audio = new Audio()
      audio.src = src
      audio.preload = 'auto'
      audioCache.set(src, audio)
    }

    audio.currentTime = 0
    audio.play().catch(() => {})
  }

  onMounted(() => {
    settingsStore.init()
  })

  return {
    soundEnabled: computed(() => settingsStore.soundEnabled),
    currentPack: computed(() => settingsStore.soundPack),
    currentSounds,
    soundPackList,
    play,
    previewSound,
    playCorrectSound,
    playErrorSound,
    playBackspaceSound,
    setSoundPack: settingsStore.setSoundPack,
    toggleSound: settingsStore.toggleSound
  }
}
