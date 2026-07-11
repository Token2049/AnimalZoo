/**
 * 相册展示视图组件 - 企业级优化版
 * 
 * 功能说明：
 * 1. Hero区域展示精选图片和统计数据
 * 2. 智能搜索和筛选功能
 * 3. 多视图切换（网格/瀑布流）
 * 4. 排序功能（最新/最热/随机）
 * 5. 企业级预览模态框（导航/下载/分享）
 * 6. 加载状态和骨架屏
 * 7. 图片计数和统计信息
 * 8. 流畅动画效果
 * 9. 完善响应式设计
 * 10. 空状态处理
 * 
 * @author Cloud Zoo Team
 * @version 3.0.0
 */
<template>
  <AppLayout>
    <div class="gallery-view">
      <!-- Hero区域 -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">精彩瞬间</h1>
            <p class="hero-subtitle">记录动物世界的每一个精彩时刻</p>
            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-number">{{ totalImages }}</span>
                <span class="stat-label">精选照片</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-number">{{ categories.length - 1 }}</span>
                <span class="stat-label">动物分类</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-number">{{ uniqueSpecies }}</span>
                <span class="stat-label">珍稀物种</span>
              </div>
            </div>
          </div>
          <div class="hero-featured">
            <div class="featured-image-wrapper">
              <img 
                v-if="featuredImage" 
                :src="featuredImage.src" 
                :alt="featuredImage.alt"
                class="featured-image"
              />
              <div class="featured-overlay">
                <span class="featured-badge">精选</span>
                <span class="featured-caption">{{ featuredImage?.caption }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 工具栏 -->
      <section class="toolbar-section">
        <!-- 搜索框 -->
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="搜索动物名称..."
            class="search-input"
          />
          <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">
            ✕
          </button>
        </div>

        <!-- 分类标签 -->
        <div class="category-tabs">
          <button 
            v-for="cat in categories" 
            :key="cat.id"
            class="tab-btn"
            :class="{ active: selectedCategory === cat.id }"
            @click="selectedCategory = cat.id"
          >
            <span class="tab-icon">{{ cat.icon }}</span>
            <span class="tab-label">{{ cat.label }}</span>
            <span class="tab-count">{{ cat.count }}</span>
          </button>
        </div>

        <!-- 视图和排序控制 -->
        <div class="controls">
          <div class="view-toggle">
            <button 
              class="toggle-btn"
              :class="{ active: viewMode === 'grid' }"
              @click="viewMode = 'grid'"
              title="网格视图"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <rect x="2" y="2" width="7" height="7" rx="1"/>
                <rect x="11" y="2" width="7" height="7" rx="1"/>
                <rect x="2" y="11" width="7" height="7" rx="1"/>
                <rect x="11" y="11" width="7" height="7" rx="1"/>
              </svg>
            </button>
            <button 
              class="toggle-btn"
              :class="{ active: viewMode === 'masonry' }"
              @click="viewMode = 'masonry'"
              title="瀑布流视图"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <rect x="2" y="2" width="5" height="8" rx="1"/>
                <rect x="9" y="2" width="9" height="5" rx="1"/>
                <rect x="2" y="12" width="5" height="6" rx="1"/>
                <rect x="9" y="9" width="9" height="9" rx="1"/>
              </svg>
            </button>
          </div>

          <div class="sort-select">
            <select v-model="sortBy" class="sort-dropdown">
              <option value="newest">最新添加</option>
              <option value="name">名称排序</option>
              <option value="random">随机排列</option>
            </select>
          </div>
        </div>
      </section>

      <!-- 图片计数 -->
      <div class="result-info">
        <span class="result-count">
          显示 {{ filteredImages.length }} 张图片
          <span v-if="searchQuery">，搜索 "{{ searchQuery }}"</span>
        </span>
      </div>

      <!-- 图片网格 -->
      <section class="gallery-section">
        <transition-group 
          :name="viewMode === 'grid' ? 'grid-fade' : 'masonry-fade'"
          tag="div"
          class="gallery-grid"
          :class="viewMode"
        >
          <div 
            v-for="(image, index) in filteredImages" 
            :key="image.src"
            class="gallery-item"
            :style="viewMode === 'masonry' ? { gridRowEnd: `span ${getMasonrySpan(index)}` } : {}"
            @click="openPreview(index)"
          >
            <div class="image-wrapper">
              <img 
                v-lazy="image.src" 
                :alt="image.alt" 
                class="gallery-image"
                @load="handleImageLoad(index)"
              />
              <div class="image-loading" v-if="!loadedImages.has(image.src)">
                <div class="skeleton"></div>
              </div>
            </div>
            <div class="image-overlay">
              <div class="overlay-content">
                <span class="image-caption">{{ image.caption }}</span>
                <span class="image-category">{{ getCategoryLabel(image.category) }}</span>
              </div>
              <div class="overlay-actions">
                <button class="action-btn" @click.stop="downloadImage(image)" title="下载">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 12l-4-4h3V2h2v6h3l-4 4z"/>
                    <path d="M2 14h12v-1H2v1z"/>
                  </svg>
                </button>
                <button class="action-btn" @click.stop="shareImage(image)" title="分享">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M12 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-8 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm8 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6.34 9.66l3.32 1.98-.68 1.14-3.32-1.98.68-1.14zm3.32-3.3l-3.32 1.98.68 1.14 3.32-1.98-.68-1.14z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </transition-group>

        <!-- 空状态 -->
        <div v-if="filteredImages.length === 0" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3 class="empty-title">未找到匹配的图片</h3>
          <p class="empty-desc">尝试调整搜索条件或选择其他分类</p>
          <button class="empty-action" @click="resetFilters">
            查看全部图片
          </button>
        </div>
      </section>

      <!-- 预览模态框 -->
      <transition name="modal-fade">
        <div v-if="showPreview" class="preview-modal" @click="closePreview">
          <div class="preview-backdrop"></div>
          <div class="preview-container" @click.stop>
            <!-- 关闭按钮 -->
            <button class="modal-close" @click="closePreview">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
              </svg>
            </button>

            <!-- 导航按钮 -->
            <button 
              v-if="canNavigatePrev" 
              class="nav-btn prev"
              @click="navigatePrev"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z"/>
              </svg>
            </button>
            <button 
              v-if="canNavigateNext" 
              class="nav-btn next"
              @click="navigateNext"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"/>
              </svg>
            </button>

            <!-- 图片内容 -->
            <div class="preview-content">
              <img 
                :src="previewImage.src" 
                :alt="previewImage.alt" 
                class="preview-image"
              />
            </div>

            <!-- 图片信息 -->
            <div class="preview-info">
              <div class="info-left">
                <h3 class="preview-title">{{ previewImage.caption }}</h3>
                <p class="preview-desc">{{ previewImage.alt }}</p>
                <span class="preview-category">{{ getCategoryLabel(previewImage.category) }}</span>
              </div>
              <div class="info-right">
                <span class="preview-counter">{{ previewIndex + 1 }} / {{ filteredImages.length }}</span>
                <div class="preview-actions">
                  <button class="preview-action-btn" @click="downloadImage(previewImage)">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 15l-5-5h4V3h2v7h4l-5 5z"/>
                      <path d="M2 17h16v-1H2v1z"/>
                    </svg>
                    <span>下载</span>
                  </button>
                  <button class="preview-action-btn" @click="shareImage(previewImage)">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M15 2c-1.38 0-2.5 1.12-2.5 2.5S13.62 7 15 7s2.5-1.12 2.5-2.5S16.38 2 15 2zm-10 5c-1.38 0-2.5 1.12-2.5 2.5S3.62 12 5 12s2.5-1.12 2.5-2.5S6.38 7 5 7zm10 5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5zM7.92 12.08l4.15 2.48-.85 1.42-4.15-2.48.85-1.42zm4.15-4.16l-4.15 2.48.85 1.42 4.15-2.48-.85-1.42z"/>
                    </svg>
                    <span>分享</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </AppLayout>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'

export default {
  name: 'GalleryView',
  
  components: {
    AppLayout
  },
  
  setup() {
    const selectedCategory = ref('all')
    const searchQuery = ref('')
    const viewMode = ref('grid')
    const sortBy = ref('newest')
    const showPreview = ref(false)
    const previewIndex = ref(0)
    const loadedImages = ref(new Set())

    const categories = ref([
      { id: 'all', label: '全部', icon: '📷', count: 80 },
      { id: 'mammals', label: '哺乳动物', icon: '🦁', count: 57 },
      { id: 'birds', label: '鸟类', icon: '🦅', count: 9 },
      { id: 'marine', label: '海洋生物', icon: '🐋', count: 14 }
    ])

    const images = ref([
      { src: new URL('../assets/images/animals_top100/african_elephant-portrait-001.png', import.meta.url).href, alt: '非洲象肖像', caption: '温柔的巨人', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/african_elephant-wild-001.png', import.meta.url).href, alt: '非洲象野外', caption: '野外的非洲象', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/american_bison-portrait-001.png', import.meta.url).href, alt: '美洲野牛肖像', caption: '强壮的美洲野牛', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/american_bison-wild-003.png', import.meta.url).href, alt: '美洲野牛野外', caption: '野外的美洲野牛', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/arctic_fox-resting-001.png', import.meta.url).href, alt: '北极狐休憩', caption: '雪白的北极狐', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/arctic_fox-wild-001.png', import.meta.url).href, alt: '北极狐野外', caption: '野外的北极狐', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/bear-portrait-002.png', import.meta.url).href, alt: '熊肖像', caption: '威武的熊', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/bear-running-002.png', import.meta.url).href, alt: '熊奔跑', caption: '奔跑的熊', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/bear-wild-001.png', import.meta.url).href, alt: '熊野外', caption: '野外的熊', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/cat-family-001.png', import.meta.url).href, alt: '猫科家族', caption: '猫科家族', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/cat-hunting-001.png', import.meta.url).href, alt: '猫狩猎', caption: '狩猎的猫', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/cat-resting-001.png', import.meta.url).href, alt: '猫休憩', caption: '休憩的猫', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/cat-wild-001.png', import.meta.url).href, alt: '猫野外', caption: '野外的猫', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/cheetah-portrait-001.png', import.meta.url).href, alt: '猎豹肖像', caption: '速度之王', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/deer-portrait-001.png', import.meta.url).href, alt: '鹿肖像', caption: '优雅的鹿', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/deer-resting-001.png', import.meta.url).href, alt: '鹿休憩', caption: '休憩的鹿', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/dog-family-001.png', import.meta.url).href, alt: '犬科家族', caption: '犬科家族', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/dog-resting-002.png', import.meta.url).href, alt: '犬休憩', caption: '休憩的犬', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/dog-running-001.png', import.meta.url).href, alt: '犬奔跑', caption: '奔跑的犬', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/dog-wild-001.png', import.meta.url).href, alt: '犬野外', caption: '野外的犬', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/elephant-resting-002.png', import.meta.url).href, alt: '大象休憩', caption: '休憩的大象', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/elephant-running-001.png', import.meta.url).href, alt: '大象奔跑', caption: '奔跑的大象', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/fox-portrait-001.png', import.meta.url).href, alt: '狐狸肖像', caption: '机敏的狐狸', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/giraffe-portrait-001.png', import.meta.url).href, alt: '长颈鹿肖像', caption: '优雅的长颈鹿', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/giraffe-resting-002.png', import.meta.url).href, alt: '长颈鹿休憩', caption: '休憩的长颈鹿', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/giraffe-wild-003.png', import.meta.url).href, alt: '长颈鹿野外', caption: '野外的长颈鹿', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/gorilla-portrait-001.png', import.meta.url).href, alt: '大猩猩肖像', caption: '智慧的大猩猩', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/hippopotamus-resting-001.png', import.meta.url).href, alt: '河马休憩', caption: '慵懒的河马', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/hippopotamus-wild-003.png', import.meta.url).href, alt: '河马野外', caption: '野外的河马', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/horse-wild-001.png', import.meta.url).href, alt: '马野外', caption: '野外的马', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/jaguar-portrait-001.png', import.meta.url).href, alt: '美洲豹肖像', caption: '美洲豹', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/kangaroo-portrait-003.png', import.meta.url).href, alt: '袋鼠肖像', caption: '跳跃的袋鼠', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/lion-family-001.png', import.meta.url).href, alt: '狮子家族', caption: '狮子家族', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/lion-portrait-001.png', import.meta.url).href, alt: '狮子肖像', caption: '威武的狮子', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/lion-resting-001.png', import.meta.url).href, alt: '狮子休憩', caption: '休憩的狮子', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/lion-wild-001.png', import.meta.url).href, alt: '狮子野外', caption: '野外的狮子', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/orangutan-portrait-001.png', import.meta.url).href, alt: '红毛猩猩肖像', caption: '红毛猩猩', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/orangutan-resting-002.png', import.meta.url).href, alt: '红毛猩猩休憩', caption: '休憩的红毛猩猩', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/panda-portrait-001.png', import.meta.url).href, alt: '大熊猫肖像', caption: '可爱的大熊猫', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/panda-resting-001.png', import.meta.url).href, alt: '大熊猫休憩', caption: '慵懒的大熊猫', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/panda-wild-001.png', import.meta.url).href, alt: '大熊猫野外', caption: '野外的大熊猫', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/polar_bear-portrait-001.png', import.meta.url).href, alt: '北极熊肖像', caption: '北极霸主', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/polar_bear-resting-002.png', import.meta.url).href, alt: '北极熊休憩', caption: '休憩的北极熊', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/rhinoceros-resting-003.png', import.meta.url).href, alt: '犀牛休憩', caption: '厚重的犀牛', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/rhinoceros-wild-002.png', import.meta.url).href, alt: '犀牛野外', caption: '野外的犀牛', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/snow_leopard-portrait-001.png', import.meta.url).href, alt: '雪豹肖像', caption: '雪山之王', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/snow_leopard-wild-002.png', import.meta.url).href, alt: '雪豹野外', caption: '野外的雪豹', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/tiger-portrait-001.png', import.meta.url).href, alt: '老虎肖像', caption: '丛林之王', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/tiger-resting-001.png', import.meta.url).href, alt: '老虎休憩', caption: '休憩的老虎', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/tiger-wild-002.png', import.meta.url).href, alt: '老虎野外', caption: '野外的老虎', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/white_rhinoceros-portrait-003.png', import.meta.url).href, alt: '白犀牛肖像', caption: '白犀牛', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/white_rhinoceros-wild-001.png', import.meta.url).href, alt: '白犀牛野外', caption: '野外的白犀牛', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/wildebeest-portrait-001.png', import.meta.url).href, alt: '角马肖像', caption: '迁徙的角马', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/wolf-portrait-001.png', import.meta.url).href, alt: '狼肖像', caption: '威武的狼', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/wolf-resting-002.png', import.meta.url).href, alt: '狼休憩', caption: '休憩的狼', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/wolf-running-001.png', import.meta.url).href, alt: '狼奔跑', caption: '奔跑的狼', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/wolf-wild-001.png', import.meta.url).href, alt: '狼野外', caption: '野外的狼', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/zebra-resting-001.png', import.meta.url).href, alt: '斑马休憩', caption: '条纹斑马', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/zebra-running-002.png', import.meta.url).href, alt: '斑马奔跑', caption: '奔跑的斑马', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/zebra-wild-003.png', import.meta.url).href, alt: '斑马野外', caption: '野外的斑马', category: 'mammals' },
      { src: new URL('../assets/images/animals_top100/eagle-portrait-001.png', import.meta.url).href, alt: '鹰肖像', caption: '威武的鹰', category: 'birds' },
      { src: new URL('../assets/images/animals_top100/eagle-resting-001.png', import.meta.url).href, alt: '鹰休憩', caption: '休憩的鹰', category: 'birds' },
      { src: new URL('../assets/images/animals_top100/eagle-wild-001.png', import.meta.url).href, alt: '鹰野外', caption: '野外的鹰', category: 'birds' },
      { src: new URL('../assets/images/animals_top100/emperor_penguin-portrait-002.png', import.meta.url).href, alt: '帝企鹅肖像', caption: '帝企鹅家族', category: 'birds' },
      { src: new URL('../assets/images/animals_top100/flamingo-portrait-001.png', import.meta.url).href, alt: '火烈鸟肖像', caption: '优雅的火烈鸟', category: 'birds' },
      { src: new URL('../assets/images/animals_top100/golden_eagle-wild-003.png', import.meta.url).href, alt: '金雕野外', caption: '翱翔的金雕', category: 'birds' },
      { src: new URL('../assets/images/animals_top100/owl-running-002.png', import.meta.url).href, alt: '猫头鹰飞行', caption: '飞翔的猫头鹰', category: 'birds' },
      { src: new URL('../assets/images/animals_top100/owl-wild-001.png', import.meta.url).href, alt: '猫头鹰野外', caption: '野外的猫头鹰', category: 'birds' },
      { src: new URL('../assets/images/animals_top100/peacock-resting-003.png', import.meta.url).href, alt: '孔雀休憩', caption: '开屏的孔雀', category: 'birds' },
      { src: new URL('../assets/images/animals_top100/penguin-resting-002.png', import.meta.url).href, alt: '企鹅休憩', caption: '休憩的企鹅', category: 'birds' },
      { src: new URL('../assets/images/animals_top100/dolphin-wild-002.png', import.meta.url).href, alt: '海豚野外', caption: '跳跃的海豚', category: 'marine' },
      { src: new URL('../assets/images/animals_top100/green_sea_turtle-portrait-002.png', import.meta.url).href, alt: '绿海龟肖像', caption: '悠闲的海龟', category: 'marine' },
      { src: new URL('../assets/images/animals_top100/green_sea_turtle-wild-003.png', import.meta.url).href, alt: '绿海龟野外', caption: '野外的海龟', category: 'marine' },
      { src: new URL('../assets/images/animals_top100/seal-portrait-001.png', import.meta.url).href, alt: '海豹肖像', caption: '可爱的海豹', category: 'marine' },
      { src: new URL('../assets/images/animals_top100/shark-resting-002.png', import.meta.url).href, alt: '鲨鱼休憩', caption: '休憩的鲨鱼', category: 'marine' },
      { src: new URL('../assets/images/animals_top100/crocodile-portrait-002.png', import.meta.url).href, alt: '鳄鱼肖像', caption: '凶猛的鳄鱼', category: 'marine' },
      { src: new URL('../assets/images/animals_top100/crocodile-running-002.png', import.meta.url).href, alt: '鳄鱼奔跑', caption: '奔跑的鳄鱼', category: 'marine' },
      { src: new URL('../assets/images/animals_top100/crocodile-wild-003.png', import.meta.url).href, alt: '鳄鱼野外', caption: '野外的鳄鱼', category: 'marine' },
      { src: new URL('../assets/images/animals_top100/komodo_dragon-portrait-001.png', import.meta.url).href, alt: '科莫多巨蜥肖像', caption: '科莫多巨蜥', category: 'marine' }
    ])

    const totalImages = computed(() => images.value.length)
    
    const uniqueSpecies = computed(() => {
      const species = new Set(images.value.map(img => img.caption))
      return species.size
    })

    const featuredImage = computed(() => images.value[0])

    const filteredImages = computed(() => {
      let result = [...images.value]

      if (selectedCategory.value !== 'all') {
        result = result.filter(img => img.category === selectedCategory.value)
      }

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(img => 
          img.caption.toLowerCase().includes(query) ||
          img.alt.toLowerCase().includes(query)
        )
      }

      switch (sortBy.value) {
        case 'name':
          result.sort((a, b) => a.caption.localeCompare(b.caption))
          break
        case 'random':
          result = shuffleArray(result)
          break
        default:
          break
      }

      return result
    })

    const previewImage = computed(() => filteredImages.value[previewIndex.value] || {})

    const canNavigatePrev = computed(() => previewIndex.value > 0)
    const canNavigateNext = computed(() => previewIndex.value < filteredImages.value.length - 1)

    const getCategoryLabel = (categoryId) => {
      const cat = categories.value.find(c => c.id === categoryId)
      return cat ? cat.label : categoryId
    }

    const getMasonrySpan = (index) => {
      return Math.floor(Math.random() * 2) + 1
    }

    const shuffleArray = (array) => {
      const arr = [...array]
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]
      }
      return arr
    }

    const handleImageLoad = (index) => {
      const image = filteredImages.value[index]
      if (image) {
        loadedImages.value.add(image.src)
      }
    }

    const openPreview = (index) => {
      previewIndex.value = index
      showPreview.value = true
      document.body.style.overflow = 'hidden'
    }

    const closePreview = () => {
      showPreview.value = false
      document.body.style.overflow = ''
    }

    const navigatePrev = () => {
      if (canNavigatePrev.value) {
        previewIndex.value--
      }
    }

    const navigateNext = () => {
      if (canNavigateNext.value) {
        previewIndex.value++
      }
    }

    const downloadImage = async (image) => {
      try {
        const response = await fetch(image.src)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${image.caption}.png`
        a.click()
        window.URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Download failed:', error)
      }
    }

    const shareImage = async (image) => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: image.caption,
            text: image.alt,
            url: window.location.href
          })
        } catch (error) {
          console.error('Share failed:', error)
        }
      } else {
        alert('分享功能暂不支持')
      }
    }

    const resetFilters = () => {
      searchQuery.value = ''
      selectedCategory.value = 'all'
    }

    const handleKeydown = (e) => {
      if (!showPreview.value) return
      
      switch (e.key) {
        case 'ArrowLeft':
          navigatePrev()
          break
        case 'ArrowRight':
          navigateNext()
          break
        case 'Escape':
          closePreview()
          break
      }
    }

    onMounted(() => {
      window.addEventListener('keydown', handleKeydown)
    })

    onUnmounted(() => {
      window.removeEventListener('keydown', handleKeydown)
    })

    return {
      selectedCategory,
      searchQuery,
      viewMode,
      sortBy,
      categories,
      filteredImages,
      showPreview,
      previewIndex,
      previewImage,
      loadedImages,
      totalImages,
      uniqueSpecies,
      featuredImage,
      canNavigatePrev,
      canNavigateNext,
      getCategoryLabel,
      getMasonrySpan,
      handleImageLoad,
      openPreview,
      closePreview,
      navigatePrev,
      navigateNext,
      downloadImage,
      shareImage,
      resetFilters
    }
  }
}
</script>

<style scoped>
.gallery-view {
  min-height: 100vh;
  background: #fcf9f2;
}

/* Hero区域 */
.hero-section {
  position: relative;
  padding: 80px 64px;
  background: linear-gradient(135deg, #154212 0%, #2d5a27 100%);
  overflow: hidden;
}

.hero-content {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}

.hero-text {
  color: #ffffff;
}

.hero-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 56px;
  font-weight: 700;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  opacity: 0.9;
  margin-bottom: 48px;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 32px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-number {
  font-family: 'Quicksand', sans-serif;
  font-size: 36px;
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

.hero-featured {
  position: relative;
}

.featured-image-wrapper {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.featured-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.featured-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.featured-badge {
  background: #154212;
  color: #ffffff;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.featured-caption {
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
}

/* 工具栏 */
.toolbar-section {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 64px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.search-box {
  position: relative;
  width: 100%;
  max-width: 600px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  opacity: 0.5;
}

.search-input {
  width: 100%;
  padding: 16px 48px;
  border: 2px solid rgba(21, 66, 18, 0.1);
  border-radius: 16px;
  font-size: 16px;
  background: #ffffff;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #0060ac;
  box-shadow: 0 0 0 4px rgba(0, 96, 172, 0.1);
}

.clear-btn {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border: none;
  background: rgba(21, 66, 18, 0.1);
  border-radius: 50%;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: rgba(21, 66, 18, 0.2);
}

.category-tabs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #ffffff;
  border: 2px solid rgba(21, 66, 18, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
}

.tab-btn:hover {
  background: rgba(21, 66, 18, 0.05);
  border-color: rgba(21, 66, 18, 0.2);
}

.tab-btn.active {
  background: #154212;
  color: #ffffff;
  border-color: #154212;
}

.tab-icon {
  font-size: 18px;
}

.tab-label {
  font-size: 14px;
  font-weight: 600;
}

.tab-count {
  padding: 2px 8px;
  background: rgba(21, 66, 18, 0.1);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.tab-btn.active .tab-count {
  background: rgba(255, 255, 255, 0.2);
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-toggle {
  display: flex;
  gap: 8px;
  background: #ffffff;
  padding: 4px;
  border-radius: 12px;
  border: 2px solid rgba(21, 66, 18, 0.1);
}

.toggle-btn {
  padding: 8px 16px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: rgba(28, 28, 24, 0.5);
}

.toggle-btn:hover {
  background: rgba(21, 66, 18, 0.05);
}

.toggle-btn.active {
  background: #154212;
  color: #ffffff;
}

.sort-dropdown {
  padding: 10px 16px;
  border: 2px solid rgba(21, 66, 18, 0.1);
  border-radius: 12px;
  background: #ffffff;
  font-size: 14px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
}

.sort-dropdown:focus {
  outline: none;
  border-color: #0060ac;
}

/* 结果信息 */
.result-info {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 64px 24px;
}

.result-count {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: rgba(28, 28, 24, 0.6);
}

/* 图片网格 */
.gallery-section {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 64px 64px;
}

.gallery-grid {
  display: grid;
  gap: 24px;
}

.gallery-grid.grid {
  grid-template-columns: repeat(4, 1fr);
}

.gallery-grid.masonry {
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 200px;
}

.gallery-item {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(45, 90, 39, 0.08);
  transition: all 0.3s ease;
}

.gallery-grid.grid .gallery-item {
  aspect-ratio: 1;
}

.gallery-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(45, 90, 39, 0.12);
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.gallery-item:hover .gallery-image {
  transform: scale(1.05);
}

.image-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skeleton {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-item:hover .image-overlay {
  opacity: 1;
}

.overlay-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.image-caption {
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
}

.image-category {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
}

.overlay-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 24px;
}

.empty-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #154212;
  margin-bottom: 8px;
}

.empty-desc {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: rgba(28, 28, 24, 0.6);
  margin-bottom: 24px;
}

.empty-action {
  padding: 12px 24px;
  background: #154212;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.empty-action:hover {
  background: #2d5a27;
}

/* 预览模态框 */
.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
}

.preview-container {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  z-index: 1;
}

.modal-close {
  position: absolute;
  top: -48px;
  right: 0;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.nav-btn.prev {
  left: -64px;
}

.nav-btn.next {
  right: -64px;
}

.preview-content {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.preview-image {
  max-width: 100%;
  max-height: 70vh;
  display: block;
}

.preview-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 24px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 0 0 16px 16px;
  color: #ffffff;
}

.info-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preview-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 24px;
  font-weight: 600;
}

.preview-desc {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  opacity: 0.7;
}

.preview-category {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 12px;
  width: fit-content;
}

.info-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.preview-counter {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  opacity: 0.7;
}

.preview-actions {
  display: flex;
  gap: 12px;
}

.preview-action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #ffffff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.preview-action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 动画 */
.grid-fade-enter-active,
.grid-fade-leave-active {
  transition: all 0.3s ease;
}

.grid-fade-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.grid-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.masonry-fade-enter-active,
.masonry-fade-leave-active {
  transition: all 0.3s ease;
}

.masonry-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.masonry-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .preview-container {
  transform: scale(0.9);
}

.modal-fade-leave-to .preview-container {
  transform: scale(0.9);
}

/* 响应式 */
@media (max-width: 1024px) {
  .hero-section {
    padding: 64px 48px;
  }

  .hero-content {
    grid-template-columns: 1fr;
    gap: 48px;
  }

  .hero-title {
    font-size: 48px;
  }

  .toolbar-section {
    padding: 32px 48px;
  }

  .gallery-section {
    padding: 0 48px 48px;
  }

  .result-info {
    padding: 0 48px 24px;
  }

  .gallery-grid.grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .gallery-grid.masonry {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 48px 20px;
  }

  .hero-title {
    font-size: 36px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .hero-stats {
    gap: 16px;
  }

  .stat-number {
    font-size: 28px;
  }

  .featured-image {
    height: 300px;
  }

  .toolbar-section {
    padding: 24px 20px;
  }

  .gallery-section {
    padding: 0 20px 32px;
  }

  .result-info {
    padding: 0 20px 16px;
  }

  .gallery-grid.grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .gallery-grid.masonry {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 150px;
  }

  .nav-btn.prev {
    left: 16px;
  }

  .nav-btn.next {
    right: 16px;
  }

  .preview-info {
    flex-direction: column;
    gap: 16px;
  }

  .info-right {
    align-items: flex-start;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .gallery-grid.grid {
    grid-template-columns: 1fr;
  }

  .gallery-grid.masonry {
    grid-template-columns: 1fr;
  }
}
</style>
