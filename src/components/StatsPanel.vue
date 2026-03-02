<template>
  <dialog ref="dialogRef" class="stats-dialog">
    <div class="stats-panel">
      <div class="header">
        <div class="header-content">
          <div class="header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 3v18h18"/>
              <path d="M18 17V9"/>
              <path d="M13 17V5"/>
              <path d="M8 17v-3"/>
            </svg>
          </div>
          <div class="header-text">
            <h3>历史成绩</h3>
            <p>查看你的练习进度</p>
          </div>
        </div>
        <button class="close-btn" @click="close" aria-label="关闭">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="stats-content" v-if="statsStore.records.length === 0">
        <div class="empty-state">
          <div class="empty-illustration">
            <svg viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="60" r="50" :fill="`rgba(var(--accent-primary-rgb, 6, 182, 212), 0.08)`"/>
              <path d="M40 50h40M40 65h40M40 80h25" stroke="var(--accent-primary)" stroke-width="3" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="empty-text">还没有练习记录</div>
          <div class="empty-desc">开始练习后，这里会展示你的进步历程</div>
        </div>
      </div>

      <div v-else class="stats-main">
        <div class="overview">
          <div class="overview-item" v-for="(item, index) in overviewItems" :key="index" :style="{ animationDelay: `${index * 80}ms` }">
            <div class="overview-value">{{ item.value }}</div>
            <div class="overview-label">{{ item.label }}</div>
          </div>
        </div>

        <div class="chart-section">
          <div class="section-header">
            <div class="section-title">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 16v-8M8 16V4M12 16v-4M16 16V8"/>
              </svg>
              速度进步曲线
            </div>
          </div>
          <div class="chart-container">
            <ProgressChart :data="statsStore.chartData" />
          </div>
        </div>

        <div class="records-section">
          <div class="section-header">
            <div class="section-title">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
                <path d="M8 6h4M8 10h4M8 14h3"/>
              </svg>
              最近记录
            </div>
            <span class="records-count">{{ statsStore.records.length }} 条记录</span>
          </div>
          <div class="records-list">
            <div 
              v-for="(record, index) in recentRecords" 
              :key="record.id"
              class="record-item"
              :style="{ animationDelay: `${index * 60}ms` }"
            >
              <div class="record-left">
                <div class="record-title">{{ record.articleTitle }}</div>
                <div class="record-meta">
                  <span class="record-date">{{ record.date }}</span>
                  <span class="record-dot">·</span>
                  <span class="record-lang">{{ record.language }}</span>
                </div>
              </div>
              <div class="record-right">
                <div class="record-stat speed">
                  <div class="stat-label">速度</div>
                  <div class="stat-value">{{ record.speed }} WPM</div>
                </div>
                <div class="record-stat accuracy">
                  <div class="stat-label">准确率</div>
                  <div class="stat-value">{{ record.accuracy }}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="actions-section">
          <button class="clear-btn" @click="clearRecords">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h14M8 6V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2M19 6l-1 12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2L1 6"/>
              <path d="M10 11v6M7 11v6M13 11v6"/>
            </svg>
            清空记录
          </button>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStatsStore } from '@/stores/stats'
import ProgressChart from './ProgressChart.vue'

const emit = defineEmits(['close'])

const dialogRef = ref<HTMLDialogElement | null>(null)
const statsStore = useStatsStore()

const languageMap: Record<string, string> = {
  cn: '汉语拼音',
  en: '英文',
  hanzi: '汉字'
}

const overviewItems = computed(() => [
  { value: overallStats.value.totalSessions, label: '总练习次数' },
  { value: `${overallStats.value.avgSpeed} WPM`, label: '平均速度' },
  { value: `${overallStats.value.avgAccuracy}%`, label: '平均准确率' },
  { value: `${overallStats.value.bestSpeed} WPM`, label: '最快速度' }
])

const overallStats = computed(() => statsStore.overallStats)

const recentRecords = computed(() => {
  return [...statsStore.records]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10)
    .map(record => ({
      ...record,
      speed: record.speed,
      date: new Date(record.timestamp).toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      language: languageMap[record.language] || record.language
    }))
})

const open = () => {
  dialogRef.value?.showModal()
}

const close = () => {
  dialogRef.value?.close()
  emit('close')
}

const clearRecords = () => {
  if (confirm('确定要清空所有练习记录吗？')) {
    statsStore.clearAll()
  }
}

defineExpose({
  open,
  close
})
</script>

<style scoped lang="scss">
.stats-dialog {
  padding: 0;
  border: none;
  background: transparent;
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;
  
  &::backdrop {
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(8px);
    animation: fadeIn 0.3s ease;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.stats-panel {
  width: 680px;
  max-width: 95vw;
  max-height: 90vh;
  background: var(--bg-secondary);
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(
      135deg,
      rgba(var(--accent-primary-rgb, 6, 182, 212), 0.08) 0%,
      rgba(var(--accent-secondary-rgb, 129, 140, 248), 0.04) 50%,
      transparent 100%
    );
    pointer-events: none;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.96);
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
  padding: 28px 32px 24px;
  position: relative;
  z-index: 1;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 24px rgba(var(--accent-primary-rgb, 6, 182, 212), 0.3);
  
  svg {
    width: 24px;
    height: 24px;
  }
}

.header-text {
  h3 {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.3px;
  }
  
  p {
    margin: 4px 0 0;
    font-size: 13px;
    color: var(--text-muted);
  }
}

.close-btn {
  width: 40px;
  height: 40px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  
  svg {
    width: 18px;
    height: 18px;
  }
  
  &:hover {
    background: var(--accent-primary);
    border-color: var(--accent-primary);
    color: white;
    transform: rotate(90deg);
  }
}

.stats-content,
.stats-main {
  flex: 1;
  overflow-y: scroll;
  padding: 10px 32px 28px;

  
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

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-illustration {
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.empty-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 14px;
  color: var(--text-muted);
}

.overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 28px;
  position: relative;
  z-index: 1;
}

.overview-item {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  padding: 18px 16px;
  border-radius: 14px;
  text-align: center;
  transition: all 0.25s ease;
  animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
  
  &:hover {
    transform: translateY(-2px);
    border-color: var(--accent-primary);
    box-shadow: 0 8px 24px rgba(var(--accent-primary-rgb, 6, 182, 212), 0.15);
    cursor: pointer;
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.overview-value {
  font-size: 26px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 6px;
  letter-spacing: -0.5px;
}

.overview-label {
  font-size: 12px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-weight: 500;
}

.chart-section,
.records-section {
  margin-bottom: 28px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    width: 16px;
    height: 16px;
    color: var(--accent-primary);
  }
}

.records-count {
  font-size: 12px;
  color: var(--text-muted);
}

.chart-container {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 18px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  transition: all 0.2s ease;
  animation: slideInLeft 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
  
  &:hover {
    background: var(--bg-secondary);
    border-color: var(--border-hover);
    transform: translateX(4px);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.record-left {
  flex: 1;
  min-width: 0;
}

.record-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.record-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-muted);
}

.record-dot {
  color: var(--border-color);
}

.record-lang {
  padding: 2px 8px;
  background: rgba(var(--accent-primary-rgb, 6, 182, 212), 0.1);
  color: var(--accent-primary);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
}

.record-right {
  display: flex;
  gap: 24px;
  flex-shrink: 0;
}

.record-stat {
  text-align: right;
  
  &.speed .stat-value {
    color: var(--accent-primary);
  }
  
  &.accuracy .stat-value {
    color: var(--accent-tertiary);
  }
}

.stat-label {
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
}

.actions-section {
  text-align: center;
  padding-top: 8px;
}

.clear-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  &:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.5);
    transform: translateY(-1px);
  }
}

@media (max-width: 640px) {
  .stats-panel {
    width: 100%;
    max-width: 100%;
    border-radius: 20px 20px 0 0;
  }
  
  .header {
    padding: 24px 20px 20px;
  }
  
  .header-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
  }
  
  .header-text h3 {
    font-size: 20px;
  }
  
  .stats-content,
  .stats-main {
    padding: 0 20px 24px;
  }
  
  .overview {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .overview-value {
    font-size: 24px;
  }
  
  .record-right {
    gap: 16px;
  }
  
  .stat-value {
    font-size: 14px;
  }
}
</style>
