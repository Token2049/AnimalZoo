/**
 * 首页视图组件 - 企业级优化版
 * 
 * 功能说明：
 * 1. 震撼的Hero区域展示
 * 2. 精选动物展示
 * 3. 统计数据可视化
 * 4. 快速入口导航
 * 5. 流畅动画效果
 * 6. 完善响应式设计
 * 
 * @author Cloud Zoo Team
 * @version 3.0.0
 */
<template>
  <AppLayout>
    <div class="home-view">
      <!-- Hero区域 -->
      <section class="hero-section">
        <div class="hero-background">
          <div class="gradient-overlay"></div>
          <div class="pattern-overlay"></div>
        </div>
        
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-icon">🌿</span>
            <span class="badge-text">探索自然</span>
          </div>
          
          <h1 class="hero-title">
            欢迎来到<span class="highlight">Cloud Zoo</span>
          </h1>
          
          <p class="hero-subtitle">
            探索神奇的动物世界，开启您的自然之旅
          </p>
          
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-icon">🦁</span>
              <div class="stat-content">
                <span class="stat-value">200+</span>
                <span class="stat-label">珍稀物种</span>
              </div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-icon">🗺️</span>
              <div class="stat-content">
                <span class="stat-value">12</span>
                <span class="stat-label">主题展区</span>
              </div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-icon">🎓</span>
              <div class="stat-content">
                <span class="stat-value">50+</span>
                <span class="stat-label">科普问答</span>
              </div>
            </div>
          </div>
          
          <div class="hero-actions">
            <router-link to="/animals" class="btn-primary">
              <span class="btn-icon">🐾</span>
              <span class="btn-text">开始探索</span>
            </router-link>
            <router-link to="/quiz" class="btn-secondary">
              <span class="btn-icon">❓</span>
              <span class="btn-text">知识问答</span>
            </router-link>
          </div>
        </div>
        
        <div class="hero-visual">
          <div class="visual-circle"></div>
          <div class="visual-pattern"></div>
        </div>
      </section>

      <!-- 特色区域 -->
      <section class="features-section">
        <div class="section-header">
          <div class="header-content">
            <h2 class="section-title">园区特色</h2>
            <p class="section-subtitle">探索不同的生态区域，感受自然的魅力</p>
          </div>
        </div>
        
        <div class="features-grid">
          <div 
            v-for="feature in features" 
            :key="feature.id"
            class="feature-card"
            :style="{ '--feature-color': feature.color }"
          >
            <div class="feature-icon-wrapper">
              <span class="feature-icon">{{ feature.icon }}</span>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
            <div class="feature-footer">
              <span class="feature-count">{{ feature.count }}+ 物种</span>
              <span class="feature-arrow">→</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 精选动物展示 -->
      <section class="animals-section">
        <div class="section-header">
          <div class="header-content">
            <h2 class="section-title">精选动物</h2>
            <p class="section-subtitle">来自世界各地的珍稀动物</p>
          </div>
          <router-link to="/animals" class="view-all-btn">
            <span>查看全部</span>
            <span class="arrow">→</span>
          </router-link>
        </div>
        
        <div class="animals-grid">
          <div 
            v-for="animal in featuredAnimals" 
            :key="animal.id"
            class="animal-card"
            @click="handleAnimalClick(animal)"
          >
            <div class="card-image-wrapper">
              <img v-lazy="animal.image" :alt="animal.name" class="card-image" />
              <div class="image-overlay"></div>
              <div class="card-badges">
                <span class="badge category">{{ animal.category }}</span>
                <span class="badge status" :class="getStatusClass(animal.conservationStatus)">
                  {{ animal.conservationStatus }}
                </span>
              </div>
            </div>
            
            <div class="card-content">
              <h3 class="card-title">{{ animal.name }}</h3>
              <p class="card-species">{{ animal.species }}</p>
              <div class="card-footer">
                <span class="view-detail">
                  查看详情
                  <span class="arrow">→</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 快速入口 -->
      <section class="quick-links-section">
        <div class="section-header">
          <div class="header-content">
            <h2 class="section-title">快速入口</h2>
            <p class="section-subtitle">一键直达您感兴趣的内容</p>
          </div>
        </div>
        
        <div class="links-grid">
          <router-link 
            v-for="link in quickLinks" 
            :key="link.path" 
            :to="link.path"
            class="link-card"
            :style="{ '--link-color': link.color }"
          >
            <div class="link-icon-wrapper">
              <span class="link-icon">{{ link.icon }}</span>
            </div>
            <div class="link-content">
              <h3 class="link-title">{{ link.label }}</h3>
              <p class="link-description">{{ link.description }}</p>
            </div>
            <div class="link-arrow">
              <span>→</span>
            </div>
          </router-link>
        </div>
      </section>

      <!-- 成就展示 -->
      <section class="achievements-section">
        <div class="achievement-content">
          <div class="achievement-text">
            <h2 class="achievement-title">解锁成就</h2>
            <p class="achievement-description">
              完成各种挑战，获得专属成就徽章
            </p>
            <router-link to="/profile" class="achievement-btn">
              查看我的成就
              <span class="arrow">→</span>
            </router-link>
          </div>
          <div class="achievement-badges">
            <div 
              v-for="achievement in achievements" 
              :key="achievement.id"
              class="badge-item"
              :class="{ unlocked: achievement.unlocked }"
            >
              <span class="badge-icon">{{ achievement.icon }}</span>
              <span class="badge-name">{{ achievement.name }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useAnimalStore } from '@/stores/animal'
import { useUserStore } from '@/stores/user'

export default {
  name: 'HomeView',
  
  components: {
    AppLayout
  },
  
  setup() {
    const router = useRouter()
    const animalStore = useAnimalStore()
    const userStore = useUserStore()

    const features = ref([
      { 
        id: 1, 
        title: '非洲草原区',
        icon: '🦁',
        description: '体验非洲大草原的壮阔，感受野生动物的自由',
        color: '#154212',
        count: 45
      },
      { 
        id: 2, 
        title: '热带雨林区',
        icon: '🌴',
        description: '探索神秘的热带雨林，发现珍稀物种',
        color: '#0060ac',
        count: 38
      },
      { 
        id: 3, 
        title: '海洋世界',
        icon: '🐋',
        description: '遨游深蓝色的海洋，了解海洋生物',
        color: '#68abff',
        count: 52
      },
      {
        id: 4,
        title: '极地冰川',
        icon: '❄️',
        description: '探索极地冰川，认识极地动物',
        color: '#0060ac',
        count: 28
      }
    ])

    const featuredAnimals = ref([
      {
        id: 1,
        name: '非洲狮',
        species: 'Panthera leo',
        image: new URL('../assets/images/feizhoushi.png', import.meta.url).href,
        category: '哺乳动物',
        conservationStatus: '易危'
      },
      {
        id: 2,
        name: '大熊猫',
        species: 'Ailuropoda melanoleuca',
        image: new URL('../assets/images/daxiongmao.png', import.meta.url).href,
        category: '哺乳动物',
        conservationStatus: '易危'
      },
      {
        id: 7,
        name: '非洲象',
        species: 'Loxodonta africana',
        image: new URL('../assets/images/feizhouxiang.png', import.meta.url).href,
        category: '哺乳动物',
        conservationStatus: '濒危'
      },
      {
        id: 10,
        name: '长颈鹿',
        species: 'Giraffa camelopardalis',
        image: new URL('../assets/images/changjinlu.png', import.meta.url).href,
        category: '哺乳动物',
        conservationStatus: '易危'
      }
    ])

    const quickLinks = ref([
      { 
        path: '/animals', 
        icon: '🐾', 
        label: '动物百科',
        description: '了解各种动物的详细信息',
        color: '#154212'
      },
      { 
        path: '/quiz', 
        icon: '❓', 
        label: '知识问答',
        description: '测试你的动物知识',
        color: '#0060ac'
      },
      { 
        path: '/map', 
        icon: '🗺️', 
        label: '园区地图',
        description: '探索园区各个区域',
        color: '#68abff'
      },
      { 
        path: '/gallery', 
        icon: '📷', 
        label: '精彩相册',
        description: '欣赏精美的动物照片',
        color: '#9dd090'
      }
    ])

    const achievements = computed(() => [
      { id: 1, name: '初来乍到', icon: '🌟', unlocked: true },
      { id: 2, name: '动物爱好者', icon: '🦁', unlocked: false },
      { id: 3, name: '问答达人', icon: '🎓', unlocked: false }
    ])

    const getStatusClass = (status) => {
      const statusMap = {
        '极危': 'critical',
        '濒危': 'endangered',
        '易危': 'vulnerable',
        '近危': 'near-threatened'
      }
      return statusMap[status] || 'unknown'
    }

    const handleAnimalClick = (animal) => {
      animalStore.setCurrentAnimal(animal)
      router.push(`/animals/${animal.id}`)
    }

    onMounted(() => {
      if (userStore.achievements.length === 0) {
        userStore.setAchievements([
          { id: 1, name: '初来乍到', icon: '🌟', description: '首次访问动物园', unlocked: true },
          { id: 2, name: '动物爱好者', icon: '🦁', description: '浏览10种动物', unlocked: false, progress: 40 },
          { id: 3, name: '问答达人', icon: '🎓', description: '完成10次问答', unlocked: false, progress: 20 }
        ])
      }
    })

    return {
      features,
      featuredAnimals,
      quickLinks,
      achievements,
      getStatusClass,
      handleAnimalClick
    }
  }
}
</script>

<style scoped>
.home-view {
  min-height: 100vh;
}

/* Hero区域 */
.hero-section {
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  padding: 80px 64px;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #154212 0%, #2d5a27 50%, #154212 100%);
}

.pattern-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(157, 208, 144, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(104, 171, 255, 0.1) 0%, transparent 50%);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  color: #ffffff;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border-radius: 9999px;
  margin-bottom: 24px;
}

.badge-icon {
  font-size: 20px;
}

.badge-text {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.hero-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 64px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 24px;
}

.hero-title .highlight {
  background: linear-gradient(135deg, #9dd090 0%, #68abff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  line-height: 1.6;
  opacity: 0.9;
  margin-bottom: 48px;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 32px;
  margin-bottom: 48px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  font-size: 32px;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-family: 'Quicksand', sans-serif;
  font-size: 28px;
  font-weight: 700;
}

.stat-label {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  opacity: 0.8;
}

.stat-divider {
  width: 1px;
  height: 48px;
  background: rgba(255, 255, 255, 0.3);
}

.hero-actions {
  display: flex;
  gap: 16px;
}

.btn-primary,
.btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #ffffff;
  color: #154212;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover {
  transform: translateY(-4px);
  box-shadow: 0px 12px 32px rgba(0, 0, 0, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-4px);
}

.hero-visual {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  z-index: 0;
}

.visual-circle {
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(157, 208, 144, 0.2) 0%, transparent 70%);
  animation: pulse 4s ease-in-out infinite;
}

.visual-pattern {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  background-image: 
    radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  animation: rotate 20s linear infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.3; }
}

@keyframes rotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

/* 通用区域样式 */
.features-section,
.animals-section,
.quick-links-section,
.achievements-section {
  max-width: 1280px;
  margin: 0 auto;
  padding: 80px 64px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 48px;
}

.header-content {
  flex: 1;
}

.section-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 40px;
  font-weight: 700;
  color: #154212;
  margin-bottom: 12px;
}

.section-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: rgba(28, 28, 24, 0.6);
}

.view-all-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(21, 66, 18, 0.1);
  color: #154212;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.view-all-btn:hover {
  background: rgba(21, 66, 18, 0.15);
  transform: translateX(4px);
}

.view-all-btn .arrow {
  transition: transform 0.3s ease;
}

.view-all-btn:hover .arrow {
  transform: translateX(4px);
}

/* 特色区域 */
.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.feature-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 32px;
  border: 1px solid rgba(21, 66, 18, 0.08);
  box-shadow: 0px 4px 20px rgba(45, 90, 39, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0px 20px 40px rgba(45, 90, 39, 0.15);
  border-color: var(--feature-color);
}

.feature-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--feature-color) 0%, rgba(157, 208, 144, 0.3) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.feature-icon {
  font-size: 32px;
}

.feature-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #154212;
  margin-bottom: 12px;
}

.feature-description {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(28, 28, 24, 0.7);
  margin-bottom: 20px;
}

.feature-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid rgba(21, 66, 18, 0.08);
}

.feature-count {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--feature-color);
}

.feature-arrow {
  color: var(--feature-color);
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-arrow {
  transform: translateX(4px);
}

/* 精选动物 */
.animals-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.animal-card {
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
}

.card-image-wrapper {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.animal-card:hover .card-image {
  transform: scale(1.08);
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 100%);
}

.card-badges {
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  gap: 8px;
}

.badge {
  padding: 6px 12px;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(8px);
}

.badge.category {
  background: rgba(255, 255, 255, 0.95);
  color: #154212;
}

.badge.status {
  background: rgba(255, 255, 255, 0.95);
}

.badge.status.critical { color: #ba1a1a; }
.badge.status.endangered { color: #d32f2f; }
.badge.status.vulnerable { color: #ff9800; }
.badge.status.near-threatened { color: #0060ac; }

.card-content {
  padding: 24px;
}

.card-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #154212;
  margin-bottom: 8px;
}

.card-species {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: rgba(28, 28, 24, 0.5);
  font-style: italic;
  margin-bottom: 16px;
}

.card-footer {
  padding-top: 16px;
  border-top: 1px solid rgba(21, 66, 18, 0.08);
}

.view-detail {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #0060ac;
  transition: all 0.3s ease;
}

.animal-card:hover .view-detail {
  color: #154212;
}

.view-detail .arrow {
  transition: transform 0.3s ease;
}

.animal-card:hover .view-detail .arrow {
  transform: translateX(4px);
}

/* 快速入口 */
.links-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.link-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 32px;
  border: 1px solid rgba(21, 66, 18, 0.08);
  box-shadow: 0px 4px 20px rgba(45, 90, 39, 0.06);
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.link-card:hover {
  transform: translateY(-8px);
  box-shadow: 0px 20px 40px rgba(45, 90, 39, 0.15);
  border-color: var(--link-color);
}

.link-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--link-color) 0%, rgba(157, 208, 144, 0.3) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.link-icon {
  font-size: 32px;
}

.link-content {
  flex: 1;
}

.link-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #154212;
  margin-bottom: 8px;
}

.link-description {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(28, 28, 24, 0.6);
}

.link-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(21, 66, 18, 0.1);
  color: #154212;
  font-size: 18px;
  transition: all 0.3s ease;
}

.link-card:hover .link-arrow {
  background: var(--link-color);
  color: #ffffff;
  transform: translateX(4px);
}

/* 成就展示 */
.achievements-section {
  background: linear-gradient(135deg, #154212 0%, #2d5a27 100%);
  border-radius: 24px;
  margin: 0 64px 80px;
  padding: 64px;
}

.achievement-content {
  display: flex;
  align-items: center;
  gap: 64px;
}

.achievement-text {
  flex: 1;
  color: #ffffff;
}

.achievement-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 16px;
}

.achievement-description {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  opacity: 0.9;
  margin-bottom: 32px;
}

.achievement-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  background: #ffffff;
  color: #154212;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.achievement-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0px 12px 32px rgba(0, 0, 0, 0.3);
}

.achievement-btn .arrow {
  transition: transform 0.3s ease;
}

.achievement-btn:hover .arrow {
  transform: translateX(4px);
}

.achievement-badges {
  display: flex;
  gap: 24px;
}

.badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.badge-item.unlocked {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

.badge-item .badge-icon {
  font-size: 48px;
  filter: grayscale(100%);
  opacity: 0.5;
}

.badge-item.unlocked .badge-icon {
  filter: grayscale(0%);
  opacity: 1;
}

.badge-item .badge-name {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  opacity: 0.7;
}

.badge-item.unlocked .badge-name {
  opacity: 1;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .features-grid,
  .links-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .animals-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 40px 20px;
    min-height: auto;
  }
  
  .hero-title {
    font-size: 40px;
  }
  
  .hero-subtitle {
    font-size: 16px;
  }
  
  .hero-stats {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .stat-divider {
    display: none;
  }
  
  .hero-actions {
    flex-direction: column;
  }
  
  .hero-visual {
    display: none;
  }
  
  .features-section,
  .animals-section,
  .quick-links-section,
  .achievements-section {
    padding: 48px 20px;
  }
  
  .section-title {
    font-size: 32px;
  }
  
  .features-grid,
  .animals-grid,
  .links-grid {
    grid-template-columns: 1fr;
  }
  
  .achievements-section {
    margin: 0 20px 48px;
    padding: 32px;
  }
  
  .achievement-content {
    flex-direction: column;
    gap: 32px;
  }
  
  .achievement-badges {
    justify-content: center;
  }
}
</style>
