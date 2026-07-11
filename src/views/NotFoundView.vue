<template>
  <AppLayout>
    <div class="not-found-view">
      <div class="error-content">
        <span class="error-icon">🔍</span>
        <h1 class="error-code">404</h1>
        <h2 class="error-title">页面未找到</h2>
        <p class="error-desc">
          抱歉，您访问的页面不存在或已被移除。
          请检查URL是否正确，或返回首页继续探索。
        </p>
        <div class="error-actions">
          <router-link to="/" class="btn-primary">
            返回首页
          </router-link>
          <router-link to="/animals" class="btn-secondary">
            浏览动物
          </router-link>
        </div>
      </div>

      <div class="suggestions">
        <h3 class="suggestions-title">您可能在寻找</h3>
        <div class="suggestions-grid">
          <router-link 
            v-for="suggestion in suggestions"
            :key="suggestion.path"
            :to="suggestion.path"
            class="suggestion-card"
          >
            <span class="suggestion-icon">{{ suggestion.icon }}</span>
            <span class="suggestion-label">{{ suggestion.label }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import AppLayout from '@/components/layout/AppLayout.vue'

export default {
  name: 'NotFoundView',
  
  components: {
    AppLayout
  },

  setup() {
    const suggestions = [
      { path: '/', label: '首页', icon: '🏠' },
      { path: '/animals', label: '动物列表', icon: '🦁' },
      { path: '/quiz', label: '知识问答', icon: '❓' },
      { path: '/map', label: '园区地图', icon: '🗺️' },
      { path: '/gallery', label: '相册展示', icon: '📷' },
      { path: '/profile', label: '个人中心', icon: '👤' }
    ]

    return {
      suggestions
    }
  }
}
</script>

<style scoped>
.not-found-view {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 0;
}

.error-content {
  text-align: center;
  max-width: 500px;
  margin-bottom: 64px;
}

.error-icon {
  font-size: 80px;
  display: block;
  margin-bottom: 24px;
}

.error-code {
  font-family: 'Quicksand', sans-serif;
  font-size: 120px;
  font-weight: 700;
  color: #154212;
  line-height: 1;
  margin-bottom: 16px;
}

.error-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 32px;
  font-weight: 600;
  color: #1c1c18;
  margin-bottom: 16px;
}

.error-desc {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: rgba(28, 28, 24, 0.6);
  line-height: 1.6;
  margin-bottom: 32px;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.btn-primary {
  padding: 16px 32px;
  background: #154212;
  color: #ffffff;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s ease;
}

.btn-primary:hover {
  background: #2d5a27;
}

.btn-secondary {
  padding: 16px 32px;
  background: transparent;
  color: #0060ac;
  border: 2px solid #0060ac;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: rgba(0, 96, 172, 0.08);
}

.suggestions {
  width: 100%;
  max-width: 800px;
}

.suggestions-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #1c1c18;
  text-align: center;
  margin-bottom: 24px;
}

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.suggestion-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid rgba(21, 66, 18, 0.1);
  text-decoration: none;
  transition: all 0.2s ease;
}

.suggestion-card:hover {
  transform: translateY(-4px);
  box-shadow: 0px 12px 32px rgba(45, 90, 39, 0.12);
}

.suggestion-icon {
  font-size: 32px;
}

.suggestion-label {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #1c1c18;
}

@media (max-width: 768px) {
  .error-code {
    font-size: 80px;
  }

  .error-actions {
    flex-direction: column;
  }

  .suggestions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
