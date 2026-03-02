<template>
  <div v-if="settingsStore.keyboardVisible" class="keyboard-map" :class="{ collapsed: isCollapsed }">
    <button class="toggle-btn" @click="toggleCollapse">
      <span v-if="isCollapsed" class="toggle-icon">⌨️</span>
      <span class="toggle-text">{{ isCollapsed ? '显示键盘' : '收起键盘' }}</span>
    </button>
    
    <div class="keyboard-container" v-show="!isCollapsed">
      <div class="keyboard">
        <div class="keyboard-row" v-for="(row, rowIndex) in keyboardRows" :key="rowIndex">
          <div 
            v-for="key in row" 
            :key="key"
            class="key"
            :class="{
              active: activeKey === key,
              wide: key === 'space',
              special: specialKeys.includes(key)
            }"
          >
            <span class="key-label">{{ key === 'space' ? 'Space' : key }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()
const isCollapsed = ref(!settingsStore.keyboardVisible)
const activeKey = ref<string | null>(null)

const keyboardRows = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
  ['space']
]

const specialKeys = ['Tab', 'Caps', 'Shift', 'Enter', 'Backspace', 'space']

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const handleKeyDown = (e: KeyboardEvent) => {
  let key = e.key
  
  if (key === ' ') {
    key = 'space'
  } else if (key === 'CapsLock') {
    key = 'Caps'
  } else if (key.length === 1) {
    key = key.toUpperCase()
  }
  
  activeKey.value = key
}

const handleKeyUp = () => {
  activeKey.value = null
}

watch(() => settingsStore.keyboardVisible, (visible) => {
  isCollapsed.value = !visible
})

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
})
</script>

<style scoped lang="scss">
.keyboard-map {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg-tertiary, rgba(0, 0, 0, 0.9));
  backdrop-filter: blur(16px);
  border-top: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);

  &.collapsed {
    .keyboard-container {
      max-height: 0;
      opacity: 0;
      overflow: hidden;
    }
  }

  .toggle-btn {
    width: 100%;
    height: 50px;
    background: linear-gradient(135deg, rgba(var(--accent-primary-rgb, 6, 182, 212), 0.1), rgba(var(--accent-secondary-rgb, 129, 140, 248), 0.1));
    border: 1px solid rgba(var(--accent-primary-rgb, 6, 182, 212), 0.2);
    border-radius: 0;
    color: var(--text-primary, #ffffff);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    &:hover {
      background: linear-gradient(135deg, rgba(var(--accent-primary-rgb, 6, 182, 212), 0.2), rgba(var(--accent-secondary-rgb, 129, 140, 248), 0.2));
      border-color: rgba(var(--accent-primary-rgb, 6, 182, 212), 0.4);
      transform: translateY(-1px);
    }

    .toggle-icon {
      font-size: 16px;
    }

    .toggle-text {
      transition: all 0.3s ease;
    }
  }

  .keyboard-container {
    padding: 20px;
    display: flex;
    justify-content: center;
    max-height: 300px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 1;
  }

  .keyboard {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 1000px;
    width: 100%;
  }

  .keyboard-row {
    display: flex;
    gap: 6px;
    justify-content: center;
    flex-wrap: wrap;

    &:last-child {
      .key.wide {
        max-width: 500px;
        width: 100%;
      }
    }
  }

  .key {
    min-width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
    border-radius: 8px;
    color: var(--text-secondary, #aaa);
    font-size: 13px;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    user-select: none;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      transition: left 0.6s ease;
    }

    &:hover::before {
      left: 100%;
    }

    &.active {
      background: linear-gradient(135deg, var(--accent-primary, #06b6d4), var(--accent-secondary, #818cf8));
      color: var(--text-primary, #ffffff);
      border-color: var(--accent-primary, #06b6d4);
      transform: translateY(2px) scale(0.98);
      box-shadow: 0 4px 16px rgba(var(--accent-primary-rgb, 6, 182, 212), 0.4);

      &::before {
        left: 100%;
      }
    }

    &.special {
      background: linear-gradient(145deg, rgba(var(--accent-primary-rgb, 6, 182, 212), 0.1), rgba(var(--accent-secondary-rgb, 129, 140, 248), 0.1));
      color: var(--accent-primary, #06b6d4);
      border-color: rgba(var(--accent-primary-rgb, 6, 182, 212), 0.2);

      &.active {
        background: linear-gradient(135deg, var(--accent-secondary, #818cf8), var(--accent-tertiary, #ec4899));
        border-color: var(--accent-secondary, #818cf8);
      }
    }

    &.wide {
      min-width: 240px;
      flex: 1;
    }

    .key-label {
      pointer-events: none;
      position: relative;
      z-index: 1;
    }
  }
}

@media (max-width: 768px) {
  .keyboard-map {
    .keyboard-container {
      padding: 12px;
    }

    .key {
      min-width: 36px;
      height: 36px;
      font-size: 11px;
    }

    .key.wide {
      min-width: 180px;
    }
  }
}

@media (max-width: 480px) {
  .keyboard-map {
    .keyboard-row {
      gap: 4px;
    }

    .key {
      min-width: 32px;
      height: 32px;
      font-size: 10px;
    }

    .key.wide {
      min-width: 140px;
    }
  }
}
</style>
