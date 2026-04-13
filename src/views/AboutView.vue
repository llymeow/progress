<template>
  <div class="about-container">
    <!-- 页面标题 -->
    <div class="about-header">
      <h1 class="page-title">关于</h1>
      <p class="page-subtitle">追踪进度</p>
    </div>

    <!-- 应用介绍 -->
    <div class="about-section">
      <div class="section-card">
        <h2 class="section-title">应用简介</h2>
        <p class="section-text">
          这是一个简洁而强大的任务管理应用，帮助你追踪日常任务的进度。支持自定义颜色、日期筛选和实时进度显示，让你更好地管理时间和任务。
        </p>
      </div>
    </div>

    <!-- 版本历史 -->
    <div class="about-section">
      <h2 class="section-heading">版本历史</h2>
      <div class="version-list">
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
          <div class="feature-icon">📊</div>
          <h3 class="feature-title">进度追踪</h3>
          <p class="feature-text">实时查看任务进度，直观的环形进度条展示</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3 class="feature-title">自定义颜色</h3>
          <p class="feature-text">为每个任务选择喜欢的颜色，个性化管理</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📅</div>
          <h3 class="feature-title">日期筛选</h3>
          <p class="feature-text">按日期范围筛选任务，随时查看历史记录</p>
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
      <p class="footer-text">© 2025 Progress. 追踪你的每一步进度。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
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
