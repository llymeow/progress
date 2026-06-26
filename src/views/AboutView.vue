<template>
  <div class="about-container">
    <!-- 页面标题 -->
    <div class="about-header">
      <h1 class="page-title">关于</h1>
      <p class="page-subtitle">书影音记录</p>
    </div>

    <!-- 应用介绍 -->
    <div class="about-section">
      <div class="section-card">
        <h2 class="section-title">应用简介</h2>
        <p class="section-text">
          这是一个简洁的书影音管理应用，帮你记录想看的清单、追踪阅读/观影进度，并归档已看完的内容。支持漫画（话数）、动画/剧集（集数）和电影四种类型。
        </p>
      </div>
    </div>

    <!-- 数据导出 -->
    <div class="about-section">
      <h2 class="section-heading">数据导出</h2>
      <div class="section-card">
        <p class="section-text">
          将本地记录导出为文件，便于备份或在表格软件中查看。手机上会弹出分享面板，可选择「存储到文件」保存。
        </p>
        <div class="export-buttons">
          <button class="export-action-btn" type="button" @click="handleExport('json')">
            导出 JSON
          </button>
          <button
            class="export-action-btn export-action-btn--secondary"
            type="button"
            @click="handleExport('csv')"
          >
            导出 CSV
          </button>
        </div>
      </div>
    </div>

    <!-- 版本历史 -->
    <div class="about-section">
      <h2 class="section-heading">版本历史</h2>
      <div class="version-list">
        <div class="version-item">
          <div class="version-header">
            <span class="version-badge">v3.0.0</span>
            <span class="version-date">26-06-26</span>
          </div>
          <p class="version-description">
            升级为书影音管理；新增想看/在看/看过状态；支持书/影/剧三种类型
          </p>
        </div>
        <div class="version-item">
          <div class="version-header">
            <span class="version-badge">v2.0.0</span>
            <span class="version-date">26-04-13</span>
          </div>
          <p class="version-description">UI全面更新；区分任务状态</p>
        </div>
        <div class="version-item">
          <div class="version-header">
            <span class="version-badge">v1.0.2</span>
            <span class="version-date">26-01-20</span>
          </div>
          <p class="version-description">增加暗色模式；优化日期选择区间</p>
        </div>

        <div class="version-item">
          <div class="version-header">
            <span class="version-badge">v1.0.1</span>
            <span class="version-date">25-12-23</span>
          </div>
          <p class="version-description">增加任务排序功能和日期显示</p>
        </div>

        <div class="version-item">
          <div class="version-header">
            <span class="version-badge">v1.0.0</span>
            <span class="version-date">25-07-04</span>
          </div>
          <p class="version-description">初始版本上线</p>
        </div>
      </div>
    </div>

    <!-- 功能特性 -->
    <div class="about-section">
      <h2 class="section-heading">主要功能</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">📚</div>
          <h3 class="feature-title">书影音分类</h3>
          <p class="feature-text">漫画按话数、动画/剧集按集数、电影一键标记看过</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3 class="feature-title">进度追踪</h3>
          <p class="feature-text">在看列表支持点击进度环快速更新阅读/观影进度</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3 class="feature-title">自定义颜色</h3>
          <p class="feature-text">为每条记录选择喜欢的颜色，个性化管理</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🌙</div>
          <h3 class="feature-title">暗色模式</h3>
          <p class="feature-text">舒适的暗色界面，保护眼睛</p>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <div class="about-footer">
      <p class="footer-text">© 2025 书影音. 记录你的阅读与观影足迹。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { showToast } from 'vant'
import { fetchMediaItems } from '@/db/mediaStore'
import { exportMedia, getExportSuccessMessage, type ExportFormat } from '@/utils/exportMedia'
import type { MediaItem } from '@/types/media'

const items = ref<MediaItem[]>([])

onMounted(async () => {
  items.value = await fetchMediaItems()
})

async function handleExport(format: ExportFormat) {
  if (!items.value.length) {
    showToast('暂无数据，请先添加记录')
    return
  }
  const result = await exportMedia(items.value, format)
  if (result === 'cancelled') return
  showToast(getExportSuccessMessage(result))
}
</script>

<style scoped>
.about-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

/* 页面标题 */
.about-header {
  margin-bottom: 40px;
  text-align: center;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0;
  font-weight: 400;
}

/* 段落区域 */
.about-section {
  margin-bottom: 32px;
}

.section-heading {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  letter-spacing: -0.3px;
}

.section-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 20px;
  box-shadow: var(--card-shadow);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 12px 0;
}

.section-text {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.export-buttons {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.export-action-btn {
  flex: 1;
  padding: 12px 16px;
  font-size: 15px;
  font-weight: 600;
  color: white;
  background: var(--color-primary);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.export-action-btn:active {
  opacity: 0.85;
}

.export-action-btn--secondary {
  color: var(--color-primary);
  background: var(--color-primary-soft, rgba(0, 122, 255, 0.12));
}

/* 版本列表 */
.version-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.version-item {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 16px;
  box-shadow: var(--card-shadow);
  transition: all 0.3s ease;
}

.version-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--card-shadow-hover);
}

.version-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.version-badge {
  display: inline-block;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-success) 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.version-date {
  font-size: 13px;
  color: var(--text-tertiary);
  font-weight: 500;
}

.version-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

/* 功能网格 */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.feature-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 20px;
  box-shadow: var(--card-shadow);
  text-align: center;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--card-shadow-hover);
}

.feature-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.feature-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.feature-text {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

/* 页脚 */
.about-footer {
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid var(--border-color);
  text-align: center;
}

.footer-text {
  font-size: 13px;
  color: var(--text-tertiary);
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .about-container {
    padding: 16px;
  }

  .page-title {
    font-size: 28px;
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .feature-card {
    padding: 16px;
  }

  .feature-icon {
    font-size: 28px;
  }
}
</style>
