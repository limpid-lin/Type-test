<template>
  <div class="typing-content">
    <div v-if="!article" class="placeholder">
      <div class="placeholder-inner">
        <div class="placeholder-icon-wrap">
          <div class="placeholder-icon">📝</div>
        </div>
        <h2 class="placeholder-title">选择一篇文章开始练习</h2>
        <p class="placeholder-subtitle">
          点击上方"选择文章"按钮<br/>
          或导入你自己的文章
        </p>
        <button class="placeholder-btn" @click="openSelector">
          <span class="btn-text">开始选择</span>
          <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>

    <div v-else class="typing-display-wrapper">
      <div class="typing-scroll-container" ref="scrollContainerRef">
        <component :is="currentPracticeComponent" ref="practiceRef" />
      </div>
    </div>

    <div v-if="hasStarted && article" class="typing-info-fixed">
      <div class="info-card">
        <div class="info-icon">⚡</div>
        <div class="info-content">
          <div class="info-label">速度</div>
          <div class="info-value">
            <span class="value-highlight">{{ typingSpeed }}</span>
            <span class="value-unit">WPM</span>
          </div>
        </div>
      </div>
      <div class="info-card">
        <div class="info-icon">🎯</div>
        <div class="info-content">
          <div class="info-label">正确率</div>
          <div class="info-value">
            <span class="value-highlight">{{ typingAccuracy }}</span>
            <span class="value-unit">%</span>
          </div>
        </div>
      </div>
      <div class="info-card">
        <div class="info-icon">📊</div>
        <div class="info-content">
          <div class="info-label">进度</div>
          <div class="info-value">
            <span class="value-highlight">{{ index }}</span>
            <span class="value-separator">/</span>
            <span class="value-total">{{ targetChars.length }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch, nextTick } from 'vue'
import { useTypingStore } from '@/stores/typing'

const emit = defineEmits<{
  openSelector: []
}>()

const typingStore = useTypingStore()

const PinyinPractice = defineAsyncComponent(() => import('@/components/typing/Practice/PinyinPractice.vue'))
const EnglishPractice = defineAsyncComponent(() => import('@/components/typing/Practice/EnglishPractice.vue'))
const HanziPractice = defineAsyncComponent(() => import('@/components/typing/Practice/HanziPractice.vue'))

const scrollContainerRef = ref<HTMLElement | null>(null)
const practiceRef = ref<any>(null)

const article = computed(() => typingStore.article)
const index = computed(() => typingStore.index)
const typingSpeed = computed(() => typingStore.typingSpeed)
const typingAccuracy = computed(() => typingStore.typingAccuracy)
const hasStarted = computed(() => typingStore.hasStarted)
const targetChars = computed(() => typingStore.targetChars)

const currentPracticeComponent = computed(() => {
  const lang = article.value?.language
  if (lang === 'cn') return PinyinPractice
  if (lang === 'en') return EnglishPractice
  if (lang === 'hanzi') return HanziPractice
  return null
})

const openSelector = () => {
  emit('openSelector')
}

const scrollToCurrentPosition = () => {
  nextTick(() => {
    if (!scrollContainerRef.value) return
    
    const activeElement = scrollContainerRef.value.querySelector('.active, .char-wrapper-cn:has(.active), .char-item:has(.active)')
    
    if (activeElement) {
      const containerRect = scrollContainerRef.value.getBoundingClientRect()
      const elementRect = activeElement.getBoundingClientRect()
      
      const isElementVisible = 
        elementRect.top >= containerRect.top &&
        elementRect.bottom <= containerRect.bottom
      
      if (!isElementVisible) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        })
      }
    }
  })
}

watch(index, () => {
  scrollToCurrentPosition()
})
</script>

<style scoped lang="scss">
.typing-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 10;
  padding: 40px 20px;

  .placeholder {
    text-align: center;
    animation: fade-up 0.8s ease-out;

    .placeholder-inner {
      background: var(--bg-tertiary);
      border: 1px solid var(--border-color);
      border-radius: 32px;
      padding: 60px 80px;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1));
        opacity: 0;
        transition: opacity 0.4s ease;
      }

      &:hover::before {
        opacity: 1;
      }
    }

    .placeholder-icon-wrap {
      width: 100px;
      height: 100px;
      margin: 0 auto 24px;
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2));
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: icon-bounce 3s ease-in-out infinite;
    }

    .placeholder-icon {
      font-size: 48px;
    }

    .placeholder-title {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 12px;
      color: var(--text-primary);
      letter-spacing: -0.02em;
    }

    .placeholder-subtitle {
      font-size: 16px;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 32px;
    }

    .placeholder-btn {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 16px 36px;
      background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 50%, var(--accent-tertiary) 100%);
      color: white;
      border: none;
      border-radius: 16px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(6, 182, 212, 0.3);

      .btn-text {
        position: relative;
        z-index: 1;
      }

      .btn-arrow {
        width: 20px;
        height: 20px;
        position: relative;
        z-index: 1;
        transition: transform 0.3s ease;
      }

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, var(--accent-tertiary) 0%, var(--accent-secondary) 50%, var(--accent-primary) 100%);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:hover {
        transform: translateY(-4px) scale(1.02);
        box-shadow: 0 8px 30px rgba(6, 182, 212, 0.4);

        .btn-arrow {
          transform: translateX(4px);
        }

        &::before {
          opacity: 1;
        }
      }

      &:active {
        transform: translateY(-2px) scale(0.98);
      }
    }
  }

  .typing-display-wrapper {
    width: 100%;
    max-width: 1200px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .typing-scroll-container {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: calc(100vh - 280px);
    padding: 20px;
    padding-bottom: 40px;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.15);
      border-radius: 4px;

      &:hover {
        background: rgba(255, 255, 255, 0.25);
      }
    }
  }

  .typing-info-fixed {
    position: fixed;
    bottom: 6vh;
    right: 12vw;
    display: flex;
    flex-direction: row;
    gap: 16px;
    z-index: 50;
    animation: fade-in-right 0.5s ease-out;

    .info-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 24px;
      background: var(--bg-tertiary);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      min-width: 140px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
        border-color: var(--accent-primary);
      }
    }

    .info-icon {
      font-size: 24px;
    }

    .info-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .info-label {
      font-size: 11px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }

    .info-value {
      font-size: 20px;
      font-weight: 700;
      color: var(--text-primary);
      display: flex;
      align-items: baseline;
      gap: 4px;

      .value-highlight {
        background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .value-unit {
        font-size: 12px;
        font-weight: 500;
        color: var(--text-muted);
      }

      .value-separator {
        color: var(--text-muted);
      }

      .value-total {
        font-size: 14px;
        color: var(--text-muted);
      }
    }
  }
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-right {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes icon-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@media (max-width: 768px) {
  .typing-content {
    padding: 24px 16px;
    padding-bottom: 160px;

    .placeholder {
      .placeholder-inner {
        padding: 40px 24px;
      }

      .placeholder-title {
        font-size: 22px;
      }

      .placeholder-subtitle {
        font-size: 14px;
      }
    }

    .typing-scroll-container {
      max-height: calc(100vh - 320px);
      padding: 16px;
    }

    .typing-info-fixed {
      bottom: 40px;
      right: 20px;
      left: 20px;
      flex-direction: row;
      justify-content: center;
      flex-wrap: wrap;
      gap: 10px;

      .info-card {
        min-width: 100px;
        padding: 12px 16px;
      }

      .info-value {
        font-size: 16px;
      }
    }
  }
}
</style>
