<template>
  <dialog ref="dialogRef" class="result-dialog">
    <div class="result-panel">
      <div class="header">
        <h3>🎉 恭喜完成！</h3>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">⚡</div>
          <div class="stat-value">{{ speed }} WPM</div>
          <div class="stat-label">打字速度</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-value">{{ accuracy }}%</div>
          <div class="stat-label">准确率</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✏️</div>
          <div class="stat-value">{{ modifiedRatio }}%</div>
          <div class="stat-label">修改比例</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⏱️</div>
          <div class="stat-value">{{ formatDuration(duration) }}</div>
          <div class="stat-label">用时</div>
        </div>
      </div>

      <div class="rating" v-if="rating">
        <div class="rating-icon">{{ rating.icon }}</div>
        <div class="rating-text">{{ rating.text }}</div>
      </div>

      <div class="actions">
        <button class="btn-secondary" @click="restart">再来一次</button>
        <button class="btn-primary" @click="goHome">返回首页</button>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  speed: number
  accuracy: number
  modifiedRatio: number
  duration: number
}

const props = defineProps<Props>()
const emit = defineEmits(['restart', 'close'])

const router = useRouter()
const dialogRef = ref<HTMLDialogElement | null>(null)

const rating = computed(() => {
  if (props.accuracy >= 98 && props.speed >= 60) {
    return { icon: '🏆', text: '太棒了！你是打字高手！' }
  } else if (props.accuracy >= 95 && props.speed >= 40) {
    return { icon: '⭐', text: '非常出色！继续保持！' }
  } else if (props.accuracy >= 90) {
    return { icon: '👍', text: '不错！再接再厉！' }
  } else {
    return { icon: '💪', text: '加油！多多练习会更好！' }
  }
})

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const open = () => {
  dialogRef.value?.showModal()
}

const close = () => {
  dialogRef.value?.close()
  emit('close')
}

const restart = () => {
  close()
  emit('restart')
}

const goHome = () => {
  close()
  router.push('/')
}

defineExpose({
  open,
  close
})
</script>

<style scoped lang="scss">
.result-dialog {
  padding: 0;
  border: none;
  background: none;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.result-panel {
  width: 500px;
  max-width: 90vw;
  padding: 32px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 16px;
  color: #fff;
}

.header {
  text-align: center;
  margin-bottom: 32px;

  h3 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.08);
  }

  .stat-icon {
    font-size: 28px;
    margin-bottom: 8px;
  }

  .stat-value {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 4px;
    color: #667eea;
  }

  .stat-label {
    font-size: 12px;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
}

.rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  margin-bottom: 24px;

  .rating-icon {
    font-size: 32px;
  }

  .rating-text {
    font-size: 16px;
    color: #a5b4fc;
  }
}

.actions {
  display: flex;
  gap: 12px;

  button {
    flex: 1;
    padding: 14px 24px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    border: none;
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  }

  .btn-primary {
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    color: #fff;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }
  }
}
</style>
