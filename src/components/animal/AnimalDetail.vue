/**
 * 动物详情组件
 * 
 * 功能说明：
 * 1. 展示动物详细信息
 * 2. 图片展示
 * 3. 分类标签
 * 4. 收藏功能
 * 
 * @author Cloud Zoo Team
 * @version 2.0.0
 */
<template>
  <div class="animal-detail">
    <div class="detail-image">
      <img v-lazy="animal.image" :alt="animal.name" class="image" />
    </div>
    
    <div class="detail-content">
      <h2 class="animal-name">{{ animal.name }}</h2>
      <p class="animal-species">{{ animal.species }}</p>
      
      <div class="tags">
        <span class="tag category">{{ animal.category }}</span>
        <span class="tag status">{{ animal.conservationStatus }}</span>
        <span class="tag habitat">{{ animal.habitat }}</span>
      </div>
      
      <p class="description">{{ animal.description }}</p>
      
      <div class="detail-actions">
        <button 
          class="btn-favorite"
          :class="{ active: isFavorite }"
          @click="toggleFavorite"
        >
          {{ isFavorite ? '❤️ 已收藏' : '🤍 收藏' }}
        </button>
        <button class="btn-learn" @click="handleLearn">了解更多</button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useNotificationStore } from '@/stores/notification'

export default {
  name: 'AnimalDetail',
  
  props: {
    animal: {
      type: Object,
      required: true
    }
  },
  
  emits: ['learn'],
  
  setup(props, { emit }) {
    const userStore = useUserStore()
    const notificationStore = useNotificationStore()

    const isFavorite = computed(() => 
      userStore.isFavorite(props.animal.id)
    )

    const toggleFavorite = () => {
      const newState = userStore.toggleFavorite(props.animal.id)
      if (newState) {
        notificationStore.success(`已收藏 ${props.animal.name}`)
      } else {
        notificationStore.info(`已取消收藏 ${props.animal.name}`)
      }
    }

    const handleLearn = () => {
      emit('learn', props.animal)
    }

    return {
      isFavorite,
      toggleFavorite,
      handleLearn
    }
  }
}
</script>

<style scoped>
.animal-detail {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(21, 66, 18, 0.1);
  box-shadow: 0px 4px 20px rgba(45, 90, 39, 0.08);
}

.detail-image {
  position: relative;
  height: 300px;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-content {
  padding: 24px;
}

.animal-name {
  font-family: 'Quicksand', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #154212;
  margin-bottom: 8px;
}

.animal-species {
  font-size: 14px;
  color: rgba(28, 28, 24, 0.6);
  font-style: italic;
  margin-bottom: 16px;
}

.tags {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.tag {
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
}

.tag.category {
  background: rgba(21, 66, 18, 0.1);
  color: #154212;
}

.tag.status {
  background: rgba(186, 26, 26, 0.1);
  color: #ba1a1a;
}

.tag.habitat {
  background: rgba(0, 96, 172, 0.1);
  color: #0060ac;
}

.description {
  font-size: 14px;
  line-height: 1.6;
  color: rgba(28, 28, 24, 0.8);
  margin-bottom: 24px;
}

.detail-actions {
  display: flex;
  gap: 12px;
}

.btn-favorite,
.btn-learn {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-favorite {
  background: #154212;
  color: #ffffff;
  border: none;
}

.btn-favorite.active {
  background: #ba1a1a;
}

.btn-learn {
  background: transparent;
  border: 2px solid rgba(21, 66, 18, 0.3);
  color: #154212;
}

.btn-learn:hover {
  background: rgba(21, 66, 18, 0.08);
}
</style>
