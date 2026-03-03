<template>
  <nav class="glass-nav">
    <div class="nav-inner">
      <div class="nav-brand" @click="goHome">
        <div class="brand-icon">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="8" width="40" height="32" rx="4" stroke="url(#grad1)" stroke-width="2"/>
            <rect x="8" y="14" width="8" height="4" rx="1" fill="url(#grad1)"/>
            <rect x="18" y="14" width="8" height="4" rx="1" fill="url(#grad1)"/>
            <rect x="28" y="14" width="12" height="4" rx="1" fill="url(#grad1)"/>
            <rect x="8" y="22" width="32" height="4" rx="1" fill="url(#grad1)"/>
            <rect x="8" y="30" width="20" height="4" rx="1" fill="url(#grad1)"/>
            <defs>
              <linearGradient id="grad1" x1="4" y1="8" x2="44" y2="40" gradientUnits="userSpaceOnUse">
                <stop stop-color="#06B6D4"/>
                <stop offset="0.5" stop-color="#8B5CF6"/>
                <stop offset="1" stop-color="#EC4899"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span class="brand-text">VoleType</span>
      </div>

      <!-- 中间区域：文章标题和作者信息 -->
      <div v-if="currentArticle" class="nav-article-info">
        <div class="article-title" :title="currentArticle.title">
          {{ currentArticle.title }}
        </div>
        <div v-if="articleAuthor" class="article-author">
          {{ articleAuthor }}
        </div>
      </div>

      <div class="nav-actions">
        <button class="nav-btn" @click="openSelector">
          <svg class="btn-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10l6 6v10a2 2 0 0 1-2 2z"/>
            <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
          </svg>
          <span>选择文章</span>
        </button>
        <button class="nav-btn" @click="openImporter">
          <svg class="btn-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <span>导入</span>
        </button>
        <button class="nav-btn" @click="openAI">
          <svg class="btn-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
          <span>灵感</span>
        </button>
        <button class="nav-btn" @click="openStats">
          <svg class="btn-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 3v18h18"/>
            <path d="M18 17V9"/>
            <path d="M13 17V5"/>
            <path d="M8 17v-3"/>
          </svg>
          <span>数据</span>
        </button>
        <button class="nav-btn" @click="openSettings">
          <svg class="btn-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <span>设置</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTypingStore } from '@/stores/typing'
import type { ArticleCN } from '@/types/article'

const router = useRouter()
const typingStore = useTypingStore()

const emit = defineEmits<{
  openSelector: []
  openImporter: []
  openAI: []
  openStats: []
  openSettings: []
}>()

// 当前文章信息
const currentArticle = computed(() => typingStore.article)

// 文章作者信息（包含朝代）
const articleAuthor = computed(() => {
  if (!currentArticle.value) return ''
  
  const article = currentArticle.value
  
  // 中文文章可能有 dynasty 和 author
  if (article.language === 'cn') {
    const cnArticle = article as ArticleCN
    const parts: string[] = []
    if (cnArticle.dynasty) parts.push(cnArticle.dynasty)
    if (cnArticle.author) parts.push(cnArticle.author)
    return parts.join(' · ')
  }
  
  // 其他类型文章只显示 author
  return article.author || ''
})

const goHome = () => {
  router.push('/')
}

const openSelector = () => {
  emit('openSelector')
}

const openImporter = () => {
  emit('openImporter')
}

const openAI = () => {
  emit('openAI')
}

const openStats = () => {
  emit('openStats')
}

const openSettings = () => {
  emit('openSettings')
}
</script>

<style scoped lang="scss">
.glass-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0px 40px;
  background: rgba(10, 10, 15, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--border-color);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  .nav-inner {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80px;
  }

  .nav-brand {
    display: flex;
    align-items: center;
    gap: 14px;
    cursor: pointer;
    transition: transform 0.3s ease;
    flex-shrink: 0;

    &:hover {
      transform: scale(1.02);
    }

    .brand-icon {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: icon-float 4s ease-in-out infinite;
    }

    .brand-text {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 50%, var(--accent-tertiary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  // 中间文章信息区域
  .nav-article-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    min-width: 0; // 允许flex item收缩
    max-width: 500px;
    margin: 0 auto;

    .article-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
      line-height: 1.3;
    }

    .article-author {
      font-size: 13px;
      color: var(--text-secondary);
      text-align: center;
      margin-top: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
  }

  .nav-actions {
    display: flex;
    gap: 12px;
    flex-shrink: 0;

    .nav-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: var(--bg-tertiary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      color: var(--text-primary);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;

      .btn-svg {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
      }

      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary), var(--accent-tertiary));
        transition: all 0.3s ease;
        transform: translateX(-50%);
      }

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
        border-color: var(--border-hover);

        &::before {
          width: 80%;
        }
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}

@keyframes icon-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

html[data-theme="light"] {
  .glass-nav {
    background: rgba(255, 255, 255, 0.85);

    .nav-actions .nav-btn:hover {
      background: rgba(79, 70, 229, 0.12);
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .glass-nav {
    .nav-article-info {
      max-width: 400px;

      .article-title {
        font-size: 16px;
      }

      .article-author {
        font-size: 12px;
      }
    }
  }
}

@media (max-width: 968px) {
  .glass-nav {
    padding: 16px 20px;
    background: rgba(10, 10, 15, 0.95);

    .nav-article-info {
      max-width: 300px;
      padding: 0 10px;

      .article-title {
        font-size: 15px;
      }

      .article-author {
        font-size: 11px;
      }
    }

    .nav-actions {
      .nav-btn {
        padding: 10px 16px;

        span:not(.btn-svg) {
          display: none;
        }
      }
    }
  }
}

@media (max-width: 640px) {
  .glass-nav {
    .nav-article-info {
      max-width: 200px;

      .article-title {
        font-size: 14px;
      }

      .article-author {
        display: none; // 小屏幕隐藏作者信息
      }
    }

    .nav-brand {
      .brand-text {
        display: none; // 小屏幕隐藏品牌文字
      }
    }
  }
}

@media (max-width: 480px) {
  .glass-nav {
    padding: 12px 16px;

    .nav-inner {
      height: 60px;
    }

    .nav-article-info {
      max-width: 150px;

      .article-title {
        font-size: 13px;
      }
    }

    .nav-actions {
      gap: 8px;

      .nav-btn {
        padding: 8px;

        .btn-svg {
          width: 16px;
          height: 16px;
        }
      }
    }
  }
}
</style>
