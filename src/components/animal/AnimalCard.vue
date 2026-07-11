/**
 * 动物卡片组件
 * 
 * 功能说明：
 * 1. 精美的卡片设计
 * 2. 流畅的悬停动画
 * 3. 保护状态可视化
 * 4. 收藏功能
 * 5. 双视图模式支持
 * 
 * @author Cloud Zoo Team
 * @version 3.0.0
 */
<template>
  <article 
    class="animal-card"
    :class="[viewModeClass, { 'is-favorite': isFavorite, 'is-featured': animal.featured }]"
    @click="handleClick"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- 图片区域 -->
    <div class="card-media">
      <div class="image-container">
        <img 
          v-lazy="animal.image"
          :alt="animal.name"
          class="card-image"
          :class="{ loaded: imageLoaded }"
          @load="imageLoaded = true"
          @error="handleImageError"
        />
        <div class="image-placeholder" v-if="!imageLoaded">
          <span class="placeholder-icon">🐾</span>
        </div>
      </div>
      
      <!-- 渐变遮罩 -->
      <div class="image-overlay"></div>
      
      <!-- 角标 -->
      <div class="card-badges">
        <span v-if="animal.featured" class="badge featured">
          <span class="badge-icon">⭐</span>
          精选
        </span>
        <span class="badge category">
          <span class="badge-icon">{{ categoryIcon }}</span>
        </span>
      </div>
      
      <!-- 收藏按钮 -->
      <button 
        class="favorite-btn"
        :class="{ active: isFavorite }"
        @click.stop="toggleFavorite"
        :aria-label="isFavorite ? '取消收藏' : '添加收藏'"
      >
        <transition name="favorite-pop" mode="out-in">
          <span v-if="isFavorite" key="filled" class="heart-filled">❤️</span>
          <span v-else key="empty" class="heart-empty">🤍</span>
        </transition>
      </button>
      
      <!-- 保护状态指示器 -->
      <div class="status-indicator" :class="statusClass">
        <span class="status-dot"></span>
        <span class="status-text">{{ animal.conservationStatus }}</span>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="card-content">
      <div class="content-header">
        <h3 class="card-title">{{ animal.name }}</h3>
        <p class="card-species">{{ animal.species }}</p>
      </div>
      
      <!-- 标签 -->
      <div class="card-tags">
        <span class="tag habitat">
          <span class="tag-icon">{{ habitatIcon }}</span>
          {{ animal.habitat }}
        </span>
        <span class="tag category">{{ animal.category }}</span>
      </div>

      <!-- 描述 -->
      <p class="card-description">{{ truncatedDescription }}</p>

      <!-- 底部操作 -->
      <div class="card-footer">
        <div class="footer-stats">
          <div class="stat">
            <span class="stat-icon">🌍</span>
            <span class="stat-value">{{ animal.habitat }}</span>
          </div>
        </div>
        <button class="view-btn">
          <span class="btn-text">查看详情</span>
          <span class="btn-icon">→</span>
        </button>
      </div>
    </div>

    <!-- 悬停效果层 -->
    <div class="hover-effect" :class="{ active: isHovered }"></div>
  </article>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useNotificationStore } from '@/stores/notification'

export default {
  name: 'AnimalCard',
  
  props: {
    animal: {
      type: Object,
      required: true
    },
    viewMode: {
      type: String,
      default: 'grid',
      validator: (v) => ['grid', 'list'].includes(v)
    }
  },

  emits: ['click', 'favorite-toggle'],

  setup(props, { emit }) {
    const router = useRouter()
    const userStore = useUserStore()
    const notificationStore = useNotificationStore()

    const imageLoaded = ref(false)
    const isHovered = ref(false)

    const categoryIcons = {
      '哺乳动物': '🦁',
      '鸟类': '🦅',
      '爬行动物': '🦎',
      '两栖动物': '🐸',
      '鱼类': '🐠',
      '昆虫': '🦋'
    }

    const habitatIcons = {
      '草原': '🌿',
      '森林': '🌲',
      '海洋': '🌊',
      '极地': '❄️',
      '山地': '⛰️',
      '湿地': '🏞️'
    }

    const isFavorite = computed(() => 
      userStore.isFavorite(props.animal.id)
    )

    const viewModeClass = computed(() => 
      props.viewMode === 'list' ? 'list-mode' : 'grid-mode'
    )

    const categoryIcon = computed(() => 
      categoryIcons[props.animal.category] || '🐾'
    )

    const habitatIcon = computed(() => 
      habitatIcons[props.animal.habitat] || '🌍'
    )

    const truncatedDescription = computed(() => {
      const desc = props.animal.description || ''
      return desc.length > 100 ? desc.slice(0, 100) + '...' : desc
    })

    const statusClass = computed(() => {
      const status = props.animal.conservationStatus
      const classMap = {
        '极危': 'critical',
        '濒危': 'endangered',
        '易危': 'vulnerable',
        '近危': 'near-threatened',
        '无危': 'least-concern'
      }
      return classMap[status] || 'unknown'
    })

    const handleClick = () => {
      emit('click', props.animal)
      router.push(`/animals/${props.animal.id}`)
    }

    const toggleFavorite = () => {
      const newState = userStore.toggleFavorite(props.animal.id)
      
      if (newState) {
        notificationStore.success(`已收藏 ${props.animal.name}`)
      } else {
        notificationStore.info(`已取消收藏 ${props.animal.name}`)
      }
      
      emit('favorite-toggle', {
        animal: props.animal,
        isFavorite: newState
      })
    }

    const handleImageError = (e) => {
      e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="%23fcf9f2" width="400" height="300"/><text x="200" y="150" text-anchor="middle" dy=".3em" font-size="60" fill="%23154212">🐾</text></svg>'
      imageLoaded.value = true
    }

    return {
      imageLoaded,
      isHovered,
      isFavorite,
      viewModeClass,
      categoryIcon,
      habitatIcon,
      truncatedDescription,
      statusClass,
      handleClick,
      toggleFavorite,
      handleImageError
    }
  }
}
</script>

<style scoped>
.animal-card {
  position: relative;
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(21, 66, 18, 0.08);
  box-shadow: 0px 4px 20px rgba(45, 90, 39, 0.06);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.animal-card:hover {
  transform: translateY(-8px);
  box-shadow: 0px 20px 40px rgba(45, 90, 39, 0.15);
  border-color: rgba(21, 66, 18, 0.15);
}

.animal-card.is-featured {
  border-color: rgba(21, 66, 18, 0.2);
}

.animal-card.is-featured::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #154212 0%, #9dd090 100%);
  z-index: 10;
}

/* 图片区域 */
.card-media {
  position: relative;
  height: 280px;
  overflow: hidden;
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
  opacity: 0;
}

.card-image.loaded {
  opacity: 1;
}

.animal-card:hover .card-image {
  transform: scale(1.08);
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fcf9f2 0%, rgba(157, 208, 144, 0.1) 100%);
}

.placeholder-icon {
  font-size: 64px;
  opacity: 0.3;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 100%);
  pointer-events: none;
}

/* 角标 */
.card-badges {
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  gap: 8px;
  z-index: 5;
}

.badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(8px);
}

.badge.featured {
  background: rgba(255, 215, 0, 0.95);
  color: #1c1c18;
  box-shadow: 0px 4px 12px rgba(255, 215, 0, 0.4);
}

.badge.category {
  background: rgba(255, 255, 255, 0.95);
  color: #154212;
  padding: 8px;
}

.badge-icon {
  font-size: 14px;
}

/* 收藏按钮 */
.favorite-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  backdrop-filter: blur(8px);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 5;
}

.favorite-btn:hover {
  transform: scale(1.1);
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.15);
}

.favorite-btn.active {
  background: rgba(186, 26, 26, 0.1);
}

.favorite-pop-enter-active {
  animation: favorite-pop-in 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.favorite-pop-leave-active {
  animation: favorite-pop-out 0.2s ease;
}

@keyframes favorite-pop-in {
  0% { transform: scale(0); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

@keyframes favorite-pop-out {
  from { transform: scale(1); }
  to { transform: scale(0); }
}

/* 保护状态指示器 */
.status-indicator {
  position: absolute;
  bottom: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  backdrop-filter: blur(8px);
  z-index: 5;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-indicator.critical .status-dot {
  background: #ba1a1a;
  box-shadow: 0 0 8px rgba(186, 26, 26, 0.6);
}

.status-indicator.endangered .status-dot {
  background: #d32f2f;
  box-shadow: 0 0 8px rgba(211, 47, 47, 0.6);
}

.status-indicator.vulnerable .status-dot {
  background: #ff9800;
  box-shadow: 0 0 8px rgba(255, 152, 0, 0.6);
}

.status-indicator.near-threatened .status-dot {
  background: #0060ac;
  box-shadow: 0 0 8px rgba(0, 96, 172, 0.6);
}

.status-indicator.least-concern .status-dot {
  background: #154212;
  box-shadow: 0 0 8px rgba(21, 66, 18, 0.6);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.status-text {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #1c1c18;
}

/* 内容区域 */
.card-content {
  padding: 24px;
}

.content-header {
  margin-bottom: 16px;
}

.card-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #154212;
  margin-bottom: 6px;
  line-height: 1.3;
}

.card-species {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: rgba(28, 28, 24, 0.5);
  font-style: italic;
}

/* 标签 */
.card-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
}

.tag.habitat {
  background: rgba(0, 96, 172, 0.1);
  color: #0060ac;
}

.tag.category {
  background: rgba(21, 66, 18, 0.1);
  color: #154212;
}

.tag-icon {
  font-size: 14px;
}

/* 描述 */
.card-description {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(28, 28, 24, 0.7);
  margin-bottom: 20px;
}

/* 底部 */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid rgba(21, 66, 18, 0.08);
}

.footer-stats {
  display: flex;
  gap: 16px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: rgba(28, 28, 24, 0.6);
}

.stat-icon {
  font-size: 16px;
}

.view-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #154212;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-btn:hover {
  background: #2d5a27;
  transform: translateX(4px);
}

.btn-icon {
  transition: transform 0.3s ease;
}

.view-btn:hover .btn-icon {
  transform: translateX(4px);
}

/* 悬停效果层 */
.hover-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  box-shadow: inset 0 0 0 2px rgba(21, 66, 18, 0.2);
}

.hover-effect.active {
  opacity: 1;
}

/* 列表模式 */
.animal-card.list-mode {
  display: grid;
  grid-template-columns: 300px 1fr;
}

.animal-card.list-mode .card-media {
  height: 100%;
  min-height: 200px;
}

.animal-card.list-mode .card-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.animal-card.list-mode:hover {
  transform: translateX(8px);
}

/* 响应式 */
@media (max-width: 768px) {
  .card-media {
    height: 220px;
  }

  .card-content {
    padding: 20px;
  }

  .card-title {
    font-size: 20px;
  }

  .animal-card.list-mode {
    grid-template-columns: 1fr;
  }

  .animal-card.list-mode .card-media {
    height: 200px;
  }
}
</style>
