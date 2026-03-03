<template>
  <div class="home-container">
    <div class="mesh-gradient-bg">
      <div class="mesh-layer layer-1"></div>
      <div class="mesh-layer layer-2"></div>
      <div class="mesh-layer layer-3"></div>
      <div class="mesh-layer layer-4"></div>
      <div class="noise-overlay"></div>
    </div>

    <nav class="glass-nav">
      <div class="nav-inner">
        <div class="nav-brand">
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

        <div class="nav-actions">
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

    <main class="main-content">
      <div class="hero-section">
        <div class="hero-text-wrap">
          <div class="hero-eyebrow">
            <span class="eyebrow-dot"></span>
            <span class="eyebrow-text">专业打字练习</span>
          </div>
          
          <h1 class="hero-title">
            <span class="title-line">提升你的</span>
            <span class="title-gradient-wrap">
              <span class="title-gradient">打字速度</span>
              <span class="title-glow"></span>
            </span>
          </h1>
          
          <p class="hero-subtitle">
            精准 · 高效 · 流畅的打字练习体验<br/>
            支持汉语拼音、英文、汉字三种模式
          </p>
        </div>

        <div class="modes-grid">
          <div class="mode-card" @click="startPractice('cn')">
            <div class="card-border"></div>
            <div class="card-content">
              <div class="card-icon-wrap">
                <span class="card-icon">🀄</span>
              </div>
              <h3 class="card-title">汉语拼音练习</h3>
              <p class="card-desc">唐诗宋词 · 治愈语录 · 科幻片段</p>
              <div class="card-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="mode-card" @click="startPractice('en')">
            <div class="card-border"></div>
            <div class="card-content">
              <div class="card-icon-wrap">
                <span class="card-icon">🔤</span>
              </div>
              <h3 class="card-title">英文练习</h3>
              <p class="card-desc">Tech News · 经典文学 · IELTS Essay</p>
              <div class="card-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="mode-card" @click="startPractice('hanzi')">
            <div class="card-border"></div>
            <div class="card-content">
              <div class="card-icon-wrap">
                <span class="card-icon">✍️</span>
              </div>
              <h3 class="card-title">汉字练习</h3>
              <p class="card-desc">常用汉字 · 成语练习 · 诗词名句</p>
              <div class="card-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <SettingsPanel ref="settingsPanelRef" />
    <StatsPanel ref="statsPanelRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SettingsPanel from '@/components/SettingsPanel.vue'
import StatsPanel from '@/components/StatsPanel.vue'

const router = useRouter()
const settingsPanelRef = ref<InstanceType<typeof SettingsPanel> | null>(null)
const statsPanelRef = ref<InstanceType<typeof StatsPanel> | null>(null)

const openSettings = () => {
  settingsPanelRef.value?.open()
}

const openStats = () => {
  statsPanelRef.value?.open()
}

const startPractice = (language: string) => {
  router.push({
    name: 'Typing',
    params: {
      language: language,
      id: '1'
    }
  })
}
</script>

<style scoped lang="scss">
.home-container {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.mesh-gradient-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;

  .mesh-layer {
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    opacity: 0.4;
    mix-blend-mode: screen;
    animation: mesh-move 25s ease-in-out infinite;
  }

  .layer-1 {
    width: 700px;
    height: 700px;
    background: radial-gradient(circle, var(--accent-primary) 0%, transparent 70%);
    top: -200px;
    left: -100px;
    animation-delay: 0s;
  }

  .layer-2 {
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, var(--accent-secondary) 0%, transparent 70%);
    top: 40%;
    right: -150px;
    animation-delay: -8s;
  }

  .layer-3 {
    width: 650px;
    height: 650px;
    background: radial-gradient(circle, var(--accent-tertiary) 0%, transparent 70%);
    bottom: -150px;
    left: 20%;
    animation-delay: -16s;
  }

  .layer-4 {
    width: 550px;
    height: 550px;
    background: radial-gradient(circle, #10B981 0%, transparent 70%);
    bottom: 30%;
    right: 25%;
    animation-delay: -12s;
  }

  .noise-overlay {
    position: absolute;
    inset: 0;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    pointer-events: none;
  }
}

@keyframes mesh-move {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(50px, -40px) scale(1.1);
  }
  50% {
    transform: translate(-30px, 30px) scale(0.95);
  }
  75% {
    transform: translate(-50px, -20px) scale(1.05);
  }
}

.glass-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 20px 40px;
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
  }

  .nav-brand {
    display: flex;
    align-items: center;
    gap: 14px;
    cursor: pointer;
    transition: transform 0.3s ease;

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

  .nav-actions {
    display: flex;
    gap: 12px;

    .nav-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 22px;
      background: var(--bg-tertiary);
      border: 1px solid var(--border-color);
      border-radius: 14px;
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

.main-content {
  position: relative;
  z-index: 10;
  padding: 140px 32px 80px;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-section {
  max-width: 1200px;
  width: 100%;
  text-align: center;
}

.hero-text-wrap {
  margin-bottom: 60px;
  animation: fade-up 0.8s ease-out;
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px 6px 6px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 100px;
  margin-bottom: 28px;
  animation: fade-up 0.8s ease-out 0.1s both;

  .eyebrow-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
    animation: pulse 2s ease-in-out infinite;
  }

  .eyebrow-text {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-secondary);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.9);
  }
}

.hero-title {
  margin-bottom: 20px;
  line-height: 1;
  animation: fade-up 0.8s ease-out 0.2s both;

  .title-line {
    display: block;
    font-size: 52px;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: var(--text-primary);
    margin-bottom: 4px;
  }

  .title-gradient-wrap {
    position: relative;
    display: inline-block;
  }

  .title-gradient {
    display: block;
    font-size: 84px;
    font-weight: 900;
    letter-spacing: -0.04em;
    background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 35%, var(--accent-tertiary) 70%, #F59E0B 100%);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradient-shift 6s ease-in-out infinite, title-glow 3s ease-in-out infinite;
  }

  .title-glow {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 35%, var(--accent-tertiary) 70%, #F59E0B 100%);
    background-size: 200% 200%;
    filter: blur(40px);
    opacity: 0.3;
    animation: gradient-shift 6s ease-in-out infinite;
    pointer-events: none;
  }
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes title-glow {
  0%, 100% {
    filter: drop-shadow(0 0 20px rgba(6, 182, 212, 0.3));
  }
  50% {
    filter: drop-shadow(0 0 40px rgba(139, 92, 246, 0.5));
  }
}

.hero-subtitle {
  font-size: 20px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 48px;
  font-weight: 400;
  animation: fade-up 0.8s ease-out 0.3s both;
}

.modes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 1000px;
  margin: 0 auto;
  animation: fade-up 0.8s ease-out 0.4s both;
}

.mode-card {
  position: relative;
  padding: 2px;
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2));
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  .card-border {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary), var(--accent-tertiary));
    opacity: 0;
    transition: opacity 0.4s ease;
    animation: card-border-rotate 8s linear infinite;
  }

  .card-content {
    position: relative;
    padding: 44px 32px;
    background: var(--bg-tertiary);
    border-radius: 22px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    transition: all 0.4s ease;
  }

  .card-icon-wrap {
    width: 72px;
    height: 72px;
    margin: 0 auto 20px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .card-icon {
    font-size: 36px;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .card-title {
    font-size: 22px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 10px;
  }

  .card-desc {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.5;
    margin-bottom: 20px;
  }

  .card-arrow {
    width: 40px;
    height: 40px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-primary);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
    transform: translateX(-8px);

    svg {
      width: 20px;
      height: 20px;
    }
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);

    .card-border {
      opacity: 0.5;
    }

    .card-content {
      background: rgba(255, 255, 255, 0.06);
    }

    .card-icon-wrap {
      transform: scale(1.1) rotate(5deg);
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2));
    }

    .card-icon {
      transform: scale(1.1);
    }

    .card-arrow {
      opacity: 1;
      transform: translateX(0);
    }
  }

  &:active {
    transform: translateY(-4px) scale(1.01);
  }
}

@keyframes card-border-rotate {
  from {
    filter: hue-rotate(0deg);
  }
  to {
    filter: hue-rotate(360deg);
  }
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 968px) {
  .main-content {
    padding: 120px 20px 60px;
  }

  .hero-title {
    .title-line {
      font-size: 36px;
    }
    .title-gradient {
      font-size: 52px;
    }
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .modes-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
  }

  .glass-nav {
    padding: 16px 20px;
    background: rgba(10, 10, 15, 0.95);

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

html[data-theme="light"] {
  .glass-nav {
    background: rgba(255, 255, 255, 0.85);
  }

  .mode-card {
    .card-content {
      background: rgba(255, 255, 255, 0.7);
    }

    &:hover {
      .card-content {
        background: rgba(255, 255, 255, 0.9);
      }
    }
  }

  .glass-nav .nav-actions .nav-btn:hover {
    background: rgba(79, 70, 229, 0.12);
  }
}
</style>


