/**
 * 动物详情视图组件
 * 
 * 功能说明：
 * 1. 展示动物详细信息
 * 2. 图片画廊
 * 3. 相关知识
 * 4. 收藏功能
 * 
 * @author Cloud Zoo Team
 * @version 2.0.0
 */
<template>
  <AppLayout>
    <div class="detail-view" v-if="animal">
      <div class="back-nav">
        <router-link to="/animals" class="back-link">← 返回列表</router-link>
      </div>

      <div class="detail-content">
        <div class="main-image">
          <img v-lazy="animal.image" :alt="animal.name" class="image" />
        </div>

        <div class="info-section">
          <h1 class="animal-name">{{ animal.name }}</h1>
          <p class="animal-species">{{ animal.species }}</p>

          <div class="tags">
            <span class="tag">{{ animal.category }}</span>
            <span class="tag">{{ animal.conservationStatus }}</span>
          </div>

          <div class="description">
            <h3>简介</h3>
            <p>{{ animal.description }}</p>
          </div>

          <div class="actions">
            <button 
              class="btn-favorite"
              :class="{ active: isFavorite }"
              @click="toggleFavorite"
            >
              {{ isFavorite ? '❤️ 已收藏' : '🤍 收藏' }}
            </button>
            <button class="btn-share">📤 分享</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="detail-view loading">
      <p>加载中...</p>
    </div>
  </AppLayout>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useAnimalStore } from '@/stores/animal'
import { useUserStore } from '@/stores/user'
import { useNotificationStore } from '@/stores/notification'
import { animalsData } from '@/data/animals'

export default {
  name: 'AnimalDetailView',
  
  components: {
    AppLayout
  },
  
  setup() {
    const route = useRoute()
    const animalStore = useAnimalStore()
    const userStore = useUserStore()
    const notificationStore = useNotificationStore()

    const animal = ref(null)

    const isFavorite = computed(() => 
      animal.value ? userStore.isFavorite(animal.value.id) : false
    )

    const toggleFavorite = () => {
      if (!animal.value) return
      const newState = userStore.toggleFavorite(animal.value.id)
      if (newState) {
        notificationStore.success(`已收藏 ${animal.value.name}`)
      } else {
        notificationStore.info(`已取消收藏 ${animal.value.name}`)
      }
      
      const progress = Math.min(100, (userStore.favorites.length / 5) * 100)
      userStore.updateAchievementProgress(4, progress)
    }

    onMounted(() => {
      const id = parseInt(route.params.id)
      
      if (animalStore.animals.length === 0) {
        animalStore.setAnimals(animalsData)
      }
      
      const found = animalStore.getAnimalById(id)
      if (found) {
        animal.value = found
      } else {
        const directFound = animalsData.find(a => a.id === id)
        if (directFound) {
          animal.value = directFound
        }
      }
    })

    return {
      animal,
      isFavorite,
      toggleFavorite
    }
  }
}
</script>

<style scoped>
.detail-view {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 64px;
}

.back-nav {
  margin-bottom: 24px;
}

.back-link {
  color: #0060ac;
  text-decoration: none;
  font-weight: 600;
}

.detail-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
}

.main-image {
  border-radius: 16px;
  overflow: hidden;
}

.image {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.animal-name {
  font-family: 'Quicksand', sans-serif;
  font-size: 40px;
  font-weight: 700;
  color: #154212;
}

.animal-species {
  font-size: 16px;
  color: rgba(28, 28, 24, 0.6);
  font-style: italic;
}

.tags {
  display: flex;
  gap: 12px;
}

.tag {
  padding: 8px 16px;
  background: rgba(21, 66, 18, 0.1);
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 600;
}

.description h3 {
  font-family: 'Quicksand', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #154212;
  margin-bottom: 12px;
}

.description p {
  font-size: 16px;
  line-height: 1.6;
  color: rgba(28, 28, 24, 0.8);
}

.actions {
  display: flex;
  gap: 16px;
}

.btn-favorite,
.btn-share {
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 16px;
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

.btn-share {
  background: transparent;
  border: 2px solid rgba(21, 66, 18, 0.3);
  color: #154212;
}

@media (max-width: 768px) {
  .detail-view {
    padding: 24px 20px;
  }

  .detail-content {
    grid-template-columns: 1fr;
  }
}
</style>
