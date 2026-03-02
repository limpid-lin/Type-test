<template>
  <dialog ref="dialogRef" class="settings-dialog">
    <div class="settings-panel">
      <div class="header">
        <div class="header-content">
          <div class="header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </div>
          <div class="header-text">
            <h3>设置</h3>
            <p>自定义你的练习体验</p>
          </div>
        </div>
        <button class="close-btn" @click="close" aria-label="关闭">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="settings-content">
        <div class="setting-section">
          
          <div class="sound-master-toggle">
            <div class="master-toggle-left">
              <div class="master-icon" :class="{ active: settingsStore.soundEnabled }">
                <svg v-if="settingsStore.soundEnabled" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                  <path d="M23 9l-6 6M17 9l6 6"/>
                </svg>
              </div>
              <div class="master-info">
                <div class="master-title">{{ settingsStore.soundEnabled ? '音效已启用' : '音效已关闭' }}</div>
                <div class="master-desc">{{ settingsStore.soundEnabled ? '点击切换为静音模式' : '点击启用音效反馈' }}</div>
              </div>
            </div>
            <button 
              class="toggle-btn large"
              :class="{ active: settingsStore.soundEnabled }"
              @click="toggleSound"
            >
              <span class="toggle-track">
                <span class="toggle-thumb"></span>
              </span>
            </button>
          </div>

          <div class="sound-detail-section" v-if="settingsStore.soundEnabled">
            <div class="sound-individual-controls">
              <div class="control-header">独立音效控制</div>
              
              <div class="sound-control-item">
                <div class="control-info">
                  <div class="control-icon correct">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div class="control-text">
                    <div class="control-label">正确输入</div>
                    <div class="control-desc">输入正确时的提示音</div>
                  </div>
                </div>
                <div class="control-actions">
                  <button 
                    class="play-btn"
                    :class="{ playing: playingSound === 'correct' }"
                    @click="playSound('correct')"
                    :disabled="playingSound === 'correct'"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path v-if="playingSound !== 'correct'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
                      <path v-else d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"/>
                    </svg>
                  </button>
                  <button 
                    class="toggle-btn small"
                    :class="{ active: soundConfig.correct }"
                    @click="toggleSoundConfig('correct')"
                  >
                    <span class="toggle-track">
                      <span class="toggle-thumb"></span>
                    </span>
                  </button>
                </div>
              </div>

              <div class="sound-control-item">
                <div class="control-info">
                  <div class="control-icon error">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div class="control-text">
                    <div class="control-label">错误输入</div>
                    <div class="control-desc">输入错误时的提示音</div>
                  </div>
                </div>
                <div class="control-actions">
                  <button 
                    class="play-btn"
                    :class="{ playing: playingSound === 'error' }"
                    @click="playSound('error')"
                    :disabled="playingSound === 'error'"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path v-if="playingSound !== 'error'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
                      <path v-else d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"/>
                    </svg>
                  </button>
                  <button 
                    class="toggle-btn small"
                    :class="{ active: soundConfig.error }"
                    @click="toggleSoundConfig('error')"
                  >
                    <span class="toggle-track">
                      <span class="toggle-thumb"></span>
                    </span>
                  </button>
                </div>
              </div>

              <div class="sound-control-item">
                <div class="control-info">
                  <div class="control-icon backspace">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 4H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h6M9 7l4-4M9 11l4 4"/>
                    </svg>
                  </div>
                  <div class="control-text">
                    <div class="control-label">退格删除</div>
                    <div class="control-desc">删除字符时的提示音</div>
                  </div>
                </div>
                <div class="control-actions">
                  <button 
                    class="play-btn"
                    :class="{ playing: playingSound === 'backspace' }"
                    @click="playSound('backspace')"
                    :disabled="playingSound === 'backspace'"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path v-if="playingSound !== 'backspace'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
                      <path v-else d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"/>
                    </svg>
                  </button>
                  <button 
                    class="toggle-btn small"
                    :class="{ active: soundConfig.backspace }"
                    @click="toggleSoundConfig('backspace')"
                  >
                    <span class="toggle-track">
                      <span class="toggle-thumb"></span>
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div class="sound-pack-section">
              <div class="pack-header">
                <span class="pack-title">音效风格</span>
                <span class="pack-subtitle">选择你喜欢的声音风格</span>
              </div>
              
              <div class="pack-grid">
                <div 
                  v-for="pack in soundPacks"
                  :key="pack.id"
                  class="pack-box"
                  :class="{ active: settingsStore.soundPack === pack.id }"
                  @click="selectSoundPack(pack.id)"
                >
                  <div class="pack-visual">
                    <div class="wave" :class="pack.id">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                  <div class="pack-name">{{ pack.name }}</div>
                  <button 
                    class="pack-preview-btn"
                    @click.stop="previewPackSounds(pack.id)"
                    :class="{ playing: previewingPack === pack.id }"
                    title="试听全部音效"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path v-if="previewingPack !== pack.id" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
                      <path v-else d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"/>
                    </svg>
                  </button>
                  <div class="pack-check" v-if="settingsStore.soundPack === pack.id">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="sound-disabled-state" v-else>
            <div class="disabled-illustration">
              <svg viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="35" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4"/>
                <path d="M25 25l30 30M55 25L25 55" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="disabled-text">
              <div class="disabled-title">音效已关闭</div>
              <div class="disabled-desc">开启后可在打字时获得声音反馈</div>
            </div>
          </div>
        </div>

        <div class="setting-section">

          <div class="speech-master-toggle">
            <div class="master-toggle-left">
              <div class="master-icon" :class="{ active: settingsStore.speechEnabled }">
                <svg v-if="settingsStore.speechEnabled" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
                  <path d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>
                </svg>
              </div>
              <div class="master-info">
                <div class="master-title">{{ settingsStore.speechEnabled ? '播报已启用' : '播报已关闭' }}</div>
                <div class="master-desc">{{ settingsStore.speechEnabled ? '点击关闭语音播报' : '点击启用语音播报' }}</div>
              </div>
            </div>
            <button 
              class="toggle-btn large"
              :class="{ active: settingsStore.speechEnabled }"
              @click="toggleSpeech"
            >
              <span class="toggle-track">
                <span class="toggle-thumb"></span>
              </span>
            </button>
          </div>
        </div>

        <div class="setting-section">
          <div class="section-header">
            <div class="section-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
              </svg>
            </div>
            <div class="section-info">
              <div class="section-title">主题设置</div>
              <div class="section-desc">选择你喜欢的外观风格</div>
            </div>
          </div>

          <div class="theme-selector">
            <div 
              v-for="theme in themes"
              :key="theme.id"
              class="theme-card"
              :class="{ active: settingsStore.theme === theme.id }"
              @click="selectTheme(theme.id)"
            >
              <div class="theme-preview">
                <div class="preview-bg" :style="{ background: theme.previewBg }"></div>
                <div class="preview-accent" :style="{ background: theme.previewAccent }"></div>
              </div>
              <div class="theme-info">
                <div class="theme-name">{{ theme.name }}</div>
              </div>
              <div class="theme-check" v-if="settingsStore.theme === theme.id">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div class="setting-section">
          <div class="section-header">
            <div class="section-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M8 16h8"/>
              </svg>
            </div>
            <div class="section-info">
              <div class="section-title">键盘设置</div>
              <div class="section-desc">显示虚拟键盘辅助</div>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-label">显示键盘映射</div>
            <button 
              class="toggle-btn"
              :class="{ active: settingsStore.keyboardVisible }"
              @click="toggleKeyboard"
            >
              <span class="toggle-track">
                <span class="toggle-thumb"></span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useAudio } from '@/composables/useAudio'
import type { SoundPackId } from '@/types/settings'

const emit = defineEmits(['close'])

const dialogRef = ref<HTMLDialogElement | null>(null)
const settingsStore = useSettingsStore()
const { previewSound, setSoundPack, toggleSound: toggleSoundFn, playCorrectSound, playErrorSound, playBackspaceSound } = useAudio()

const playingSound = ref<'correct' | 'error' | 'backspace' | null>(null)
const previewingPack = ref<SoundPackId | null>(null)

const soundConfig = reactive({
  correct: true,
  error: true,
  backspace: true
})

const soundPacks = [
  { 
    id: 'classic' as SoundPackId, 
    name: '经典', 
    desc: '清脆悦耳的传统提示音',
    icon: '🔔'
  },
  { 
    id: 'mechanical' as SoundPackId, 
    name: '机械', 
    desc: '类似机械键盘的段落感',
    icon: '⌨️'
  },
  { 
    id: 'soft' as SoundPackId, 
    name: '轻柔', 
    desc: '柔和不刺耳的轻声提示',
    icon: '🍃'
  }
]

const themes = [
  { 
    id: 'dark', 
    name: '暗夜', 
    previewBg: 'linear-gradient(135deg, #000000 0%, #1c1c1e 100%)',
    previewAccent: '#0a84ff'
  },
  { 
    id: 'light', 
    name: '日光', 
    previewBg: 'linear-gradient(135deg, #ffffff 0%, #f5f5f7 100%)',
    previewAccent: '#007aff'
  },
  { 
    id: 'purple', 
    name: '紫罗兰', 
    previewBg: 'linear-gradient(135deg, #0f0a1e 0%, #1a1030 100%)',
    previewAccent: '#a78bfa'
  },
  { 
    id: 'ocean', 
    name: '海洋', 
    previewBg: 'linear-gradient(135deg, #0a1628 0%, #0f2137 100%)',
    previewAccent: '#10b981'
  },
  { 
    id: 'sunset', 
    name: '日落', 
    previewBg: 'linear-gradient(135deg, #1a0f0a 0%, #2d1810 100%)',
    previewAccent: '#f97316'
  }
]

const open = () => {
  dialogRef.value?.showModal()
}

const close = () => {
  dialogRef.value?.close()
  emit('close')
}

const toggleSound = () => {
  toggleSoundFn()
}

const toggleSoundConfig = (type: 'correct' | 'error' | 'backspace') => {
  soundConfig[type] = !soundConfig[type]
}

const playSound = async (type: 'correct' | 'error' | 'backspace') => {
  if (playingSound.value) return
  
  playingSound.value = type
  
  try {
    if (type === 'correct') {
      await playCorrectSound()
    } else if (type === 'error') {
      await playErrorSound()
    } else {
      await playBackspaceSound()
    }
  } catch (e) {
    console.log('播放音效失败')
  }
  
  setTimeout(() => {
    playingSound.value = null
  }, 500)
}

const previewPackSounds = async (packId: SoundPackId) => {
  if (previewingPack.value) return
  
  previewingPack.value = packId
  
  try {
    previewSound('correct', packId)
    await new Promise(r => setTimeout(r, 300))
    previewSound('error', packId)
    await new Promise(r => setTimeout(r, 300))
    previewSound('delete', packId)
  } catch (e) {
    console.log('预览音效失败')
  }
  
  setTimeout(() => {
    previewingPack.value = null
  }, 1000)
}

const selectSoundPack = (packId: SoundPackId) => {
  setSoundPack(packId)
}

const selectTheme = (themeId: string) => {
  settingsStore.setTheme(themeId as any)
}

const toggleSpeech = () => {
  settingsStore.toggleSpeech()
}

const toggleKeyboard = () => {
  settingsStore.toggleKeyboard()
}

defineExpose({
  open,
  close
})
</script>

<style scoped lang="scss">
.settings-dialog {
  padding: 0;
  border: none;
  background: transparent;
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;
  
  &::backdrop {
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    animation: fadeIn 0.25s ease;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.settings-panel {
  width: 560px;
  max-width: 95vw;
  max-height: 88vh;
  background: var(--bg-secondary);
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: var(--shadow-lg);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 90px;
    background: linear-gradient(
      135deg,
      rgba(var(--accent-primary-rgb, 10, 132, 255), 0.06) 0%,
      rgba(var(--accent-secondary-rgb, 94, 92, 230), 0.03) 50%,
      transparent 100%
    );
    pointer-events: none;
    border-radius: 24px 24px 0 0;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px 20px;
  position: relative;
  z-index: 1;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 6px 20px rgba(var(--accent-primary-rgb, 10, 132, 255), 0.3);
  
  svg {
    width: 22px;
    height: 22px;
  }
}

.header-text {
  h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.2px;
  }
  
  p {
    margin: 3px 0 0;
    font-size: 13px;
    color: var(--text-muted);
  }
}

.close-btn {
  width: 36px;
  height: 36px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  &:hover {
    background: rgba(255, 59, 48, 0.1);
    border-color: rgba(255, 59, 48, 0.5);
    color: #ff453a;
    transform: rotate(90deg);
  }
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 28px 28px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;
  }
}

.setting-section {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 18px;
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--border-hover);
  }
  
  &:last-child {
    margin-bottom: 8px;
  }
}

.section-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 18px;
}

.section-icon {
  width: 38px;
  height: 38px;
  background: rgba(var(--accent-primary-rgb, 10, 132, 255), 0.12);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-primary);
  flex-shrink: 0;
  
  svg {
    width: 18px;
    height: 18px;
  }
}

.section-info {
  flex: 1;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 3px;
}

.section-desc {
  font-size: 13px;
  color: var(--text-muted);
}

.sound-master-toggle,
.speech-master-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: var(--bg-secondary);
  border-radius: 14px;
}

.master-toggle-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.master-icon {
  width: 44px;
  height: 44px;
  background: var(--bg-tertiary);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: all 0.3s ease;
  
  svg {
    width: 22px;
    height: 22px;
  }
  
  &.active {
    background: linear-gradient(135deg, #30d158, #34c759);
    color: white;
    box-shadow: 0 4px 16px rgba(48, 209, 88, 0.3);
  }
}

.master-info {
  .master-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 2px;
  }
  
  .master-desc {
    font-size: 12px;
    color: var(--text-muted);
  }
}

.toggle-btn {
  width: 52px;
  height: 30px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 15px;
  cursor: pointer;
  padding: 3px;
  transition: all 0.25s ease;
  
  &.large {
    width: 56px;
    height: 32px;
  }
  
  &.small {
    width: 44px;
    height: 24px;
    
    .toggle-thumb {
      width: 18px;
      height: 18px;
    }
    
    &.active .toggle-thumb {
      transform: translateX(20px);
    }
  }
  
  .toggle-track {
    display: block;
    width: 100%;
    height: 100%;
    position: relative;
  }
  
  .toggle-thumb {
    display: block;
    width: 22px;
    height: 22px;
    background: var(--text-muted);
    border-radius: 50%;
    transition: all 0.25s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
  
  &.active {
    background: var(--accent-primary);
    border-color: var(--accent-primary);
    
    .toggle-thumb {
      background: white;
      transform: translateX(26px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
  }
  
  &:hover:not(.active) {
    border-color: var(--border-hover);
    
    .toggle-thumb {
      background: var(--text-secondary);
    }
  }
}

.sound-detail-section {
  animation: fadeSlideIn 0.3s ease;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.sound-individual-controls {
  margin-bottom: 20px;
}

.control-header {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 14px;
}

.sound-control-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: var(--bg-secondary);
  border-radius: 12px;
  margin-bottom: 10px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.control-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.control-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  &.correct {
    background: rgba(48, 209, 88, 0.12);
    color: #30d158;
  }
  
  &.error {
    background: rgba(255, 69, 58, 0.12);
    color: #ff453a;
  }
  
  &.backspace {
    background: rgba(255, 214, 10, 0.12);
    color: #ffd60a;
  }
}

.control-text {
  .control-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 2px;
  }
  
  .control-desc {
    font-size: 12px;
    color: var(--text-muted);
  }
}

.control-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.play-btn {
  width: 36px;
  height: 36px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  &:hover:not(:disabled) {
    background: rgba(var(--accent-primary-rgb, 10, 132, 255), 0.1);
    border-color: var(--accent-primary);
    color: var(--accent-primary);
  }
  
  &.playing {
    background: rgba(var(--accent-primary-rgb, 10, 132, 255), 0.15);
    border-color: var(--accent-primary);
    color: var(--accent-primary);
    animation: pulse 0.5s ease infinite;
  }
  
  &:disabled {
    cursor: not-allowed;
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.sound-pack-section {
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.pack-header {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 14px;
}

.pack-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.pack-subtitle {
  font-size: 12px;
  color: var(--text-muted);
}

.pack-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.pack-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    border-color: var(--border-hover);
    transform: translateY(-3px);
  }
  
  &.active {
    border-color: var(--accent-primary);
    background: rgba(var(--accent-primary-rgb, 10, 132, 255), 0.08);
  }
}

.pack-visual {
  width: 52px;
  height: 52px;
  background: var(--bg-tertiary);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 10px;
}

.wave {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  height: 24px;
  
  span {
    width: 3px;
    background: var(--text-muted);
    border-radius: 2px;
    animation: wave 1s ease-in-out infinite;
    
    &:nth-child(1) { height: 12px; animation-delay: 0s; }
    &:nth-child(2) { height: 20px; animation-delay: 0.1s; }
    &:nth-child(3) { height: 16px; animation-delay: 0.2s; }
    &:nth-child(4) { height: 24px; animation-delay: 0.3s; }
  }
  
  &.classic span { background: #0a84ff; }
  &.mechanical span { background: #5e5ce6; }
  &.soft span { background: #30d158; }
}

@keyframes wave {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.6); }
}

.pack-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.pack-preview-btn {
  width: 32px;
  height: 32px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  margin-bottom: 4px;
  
  svg {
    width: 14px;
    height: 14px;
  }
  
  &:hover:not(:disabled) {
    background: rgba(var(--accent-primary-rgb, 10, 132, 255), 0.1);
    border-color: var(--accent-primary);
    color: var(--accent-primary);
  }
  
  &.playing {
    background: rgba(var(--accent-primary-rgb, 10, 132, 255), 0.15);
    border-color: var(--accent-primary);
    color: var(--accent-primary);
    animation: pulse 0.5s ease infinite;
  }
}

.pack-check {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 22px;
  height: 22px;
  background: var(--accent-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  animation: scaleIn 0.2s ease;
  
  svg {
    width: 12px;
    height: 12px;
  }
}

@keyframes scaleIn {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

.sound-disabled-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  background: var(--bg-secondary);
  border-radius: 14px;
  text-align: center;
}

.disabled-illustration {
  width: 80px;
  height: 80px;
  color: var(--text-muted);
  margin-bottom: 16px;
  opacity: 0.5;
}

.disabled-text {
  .disabled-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 4px;
  }
  
  .disabled-desc {
    font-size: 13px;
    color: var(--text-muted);
  }
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--bg-secondary);
  border-radius: 12px;
}

.setting-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.theme-selector {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.theme-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    border-color: var(--border-hover);
    transform: translateY(-2px);
  }
  
  &.active {
    border-color: var(--accent-primary);
    background: rgba(var(--accent-primary-rgb, 10, 132, 255), 0.08);
  }
  
  .theme-preview {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    position: relative;
    overflow: hidden;
    margin-bottom: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    
    .preview-bg {
      position: absolute;
      inset: 0;
      border-radius: 12px;
    }
    
    .preview-accent {
      position: absolute;
      bottom: 6px;
      right: 6px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 2px solid var(--bg-secondary);
    }
  }
  
  .theme-name {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .theme-check {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 18px;
    height: 18px;
    background: var(--accent-primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    animation: scaleIn 0.2s ease;
    
    svg {
      width: 10px;
      height: 10px;
    }
  }
}

@media (max-width: 600px) {
  .settings-panel {
    width: 100%;
    max-width: 100%;
    border-radius: 20px 20px 0 0;
  }
  
  .header {
    padding: 20px 20px 16px;
  }
  
  .settings-content {
    padding: 0 16px 20px;
  }
  
  .theme-selector {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .pack-grid {
    grid-template-columns: repeat(1, 1fr);
  }
  
  .sound-control-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .control-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
