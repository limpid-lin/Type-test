<template>
  <Teleport to="body">
    <div class="completion-overlay" @click.self="close">
      <div class="completion-modal">
        <div class="confetti-container">
          <div v-for="i in 50" :key="i" class="confetti" :style="getConfettiStyle(i)"></div>
        </div>

        <div class="modal-content">
          <div class="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>

          <h2 class="title">🎉 练习完成！</h2>
          <p class="subtitle">恭喜你完成了这篇文章的打字练习</p>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">⚡</div>
              <div class="stat-value">{{ speed }}</div>
              <div class="stat-label">WPM</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🎯</div>
              <div class="stat-value">{{ accuracy }}%</div>
              <div class="stat-label">正确率</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">⏱️</div>
              <div class="stat-value">{{ formatTime(time) }}</div>
              <div class="stat-label">用时</div>
            </div>
          </div>

          <div class="rating">
            <div class="rating-label">评级</div>
            <div class="rating-stars">
              <span v-for="i in 5" :key="i" class="star" :class="{ active: i <= rating }">★</span>
            </div>
            <div class="rating-text">{{ ratingText }}</div>
          </div>

          <div class="actions">
            <button class="btn btn-restart" @click="restart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 4v6h6"/>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
              </svg>
              重新练习
            </button>
            <button class="btn btn-next" @click="next">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              下一篇
            </button>
          </div>
        </div>

        <button class="close-btn" @click="close">×</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  speed: number
  accuracy: number
  time: number
}>()

const emit = defineEmits<{
  restart: []
  next: []
  close: []
}>()

const rating = computed(() => {
  const score = props.speed * (props.accuracy / 100)
  if (score >= 80) return 5
  if (score >= 60) return 4
  if (score >= 40) return 3
  if (score >= 20) return 2
  return 1
})

const ratingText = computed(() => {
  const texts = ['', '继续加油', '还需努力', '表现不错', '非常出色', '完美表现']
  return texts[rating.value]
})

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const getConfettiStyle = (index: number) => {
  const colors = ['#06B6D4', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981']
  const left = Math.random() * 100
  const delay = Math.random() * 3
  const duration = 3 + Math.random() * 2
  const color = colors[index % colors.length]
  
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    backgroundColor: color
  }
}

const restart = () => {
  emit('restart')
}

const next = () => {
  emit('next')
}

const close = () => {
  emit('close')
}
</script>

<style scoped lang="scss">
.completion-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fade-in 0.3s ease;
}

.completion-modal {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 48px;
  max-width: 500px;
  width: 90%;
  animation: modal-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
}

.confetti-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;

  .confetti {
    position: absolute;
    width: 10px;
    height: 10px;
    top: -10px;
    animation: confetti-fall linear infinite;
    opacity: 0.8;
  }
}

@keyframes confetti-fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(600px) rotate(720deg);
    opacity: 0;
  }
}

.modal-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s ease-in-out infinite;

  svg {
    width: 40px;
    height: 40px;
    color: white;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 20px rgba(6, 182, 212, 0);
  }
}

.title {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 8px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary), var(--accent-tertiary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 32px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;

  .stat-card {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 20px 16px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      border-color: var(--border-hover);
    }

    .stat-icon {
      font-size: 24px;
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 12px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  }
}

.rating {
  margin-bottom: 32px;

  .rating-label {
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 8px;
  }

  .rating-stars {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 8px;

    .star {
      font-size: 32px;
      color: var(--text-muted);
      transition: all 0.3s ease;

      &.active {
        color: #F59E0B;
        text-shadow: 0 0 20px rgba(245, 158, 11, 0.5);
        animation: star-pop 0.4s ease;
      }
    }
  }

  .rating-text {
    font-size: 18px;
    font-weight: 600;
    color: var(--accent-primary);
  }
}

@keyframes star-pop {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

.actions {
  display: flex;
  gap: 16px;
  justify-content: center;

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;

    svg {
      width: 18px;
      height: 18px;
    }

    &.btn-restart {
      background: var(--bg-tertiary);
      border: 1px solid var(--border-color);
      color: var(--text-primary);

      &:hover {
        background: var(--border-color);
        transform: translateY(-2px);
      }
    }

    &.btn-next {
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
      color: white;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(6, 182, 212, 0.3);
      }
    }
  }
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  color: var(--text-secondary);
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: var(--border-color);
    color: var(--text-primary);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modal-pop {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

html[data-theme="light"] {
  .completion-overlay {
    background: rgba(0, 0, 0, 0.5);
  }

  .completion-modal {
    background: var(--bg-secondary);
  }
}
</style>
