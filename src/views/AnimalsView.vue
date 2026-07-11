/**
 * 动物列表视图组件
 * 
 * 功能说明：
 * 1. Hero区域展示
 * 2. 统计数据可视化
 * 3. 快速分类导航
 * 4. 高级搜索和筛选
 * 5. 响应式布局
 * 
 * @author Cloud Zoo Team
 * @version 3.0.0
 */
<template>
  <AppLayout>
    <div class="animals-view">
      <!-- Hero区域 -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-icon">🌿</span>
            <span class="badge-text">探索自然</span>
          </div>
          <h1 class="hero-title">
            探索<span class="highlight">珍稀动物</span>的世界
          </h1>
          <p class="hero-description">
            发现来自世界各地的神奇生物，了解它们的生活习性与保护现状
          </p>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-label">珍稀物种</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-label">濒危保护</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-label">栖息环境</span>
            </div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="visual-circle"></div>
          <div class="visual-pattern"></div>
        </div>
      </section>

      <!-- 快速分类导航 -->
      <section class="quick-nav-section">
        <div class="quick-nav-container">
          <button
            v-for="category in categories"
            :key="category.id"
            class="category-chip"
            :class="{ active: activeCategory === category.id }"
            @click="handleCategoryFilter(category.id)"
          >
            <span class="chip-icon">{{ category.icon }}</span>
            <span class="chip-label">{{ category.label }}</span>
            <span class="chip-count">{{ category.count }}</span>
          </button>
        </div>
      </section>

      <!-- 搜索和筛选区域 -->
      <section class="search-filter-section">
        <div class="search-container">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="搜索动物名称、学名或特征..."
              @input="handleSearch"
            />
            <transition name="fade">
              <button
                v-if="searchQuery"
                class="clear-btn"
                @click="clearSearch"
              >
                ✕
              </button>
            </transition>
          </div>
          <div class="search-suggestions" v-if="showSuggestions && suggestions.length > 0">
            <button
              v-for="suggestion in suggestions"
              :key="suggestion"
              class="suggestion-item"
              @click="selectSuggestion(suggestion)"
            >
              <span class="suggestion-icon">🐾</span>
              <span class="suggestion-text">{{ suggestion }}</span>
            </button>
          </div>
        </div>

        <div class="filter-bar">
          <div class="filter-group">
            <label class="filter-label">栖息地</label>
            <div class="filter-options">
              <button
                v-for="habitat in habitats"
                :key="habitat"
                class="filter-chip"
                :class="{ active: filters.habitat === habitat }"
                @click="toggleFilter('habitat', habitat)"
              >
                {{ habitat }}
              </button>
            </div>
          </div>

          <div class="filter-group">
            <label class="filter-label">保护状态</label>
            <div class="filter-options">
              <button
                v-for="status in conservationStatuses"
                :key="status.value"
                class="filter-chip status-chip"
                :class="[status.class, { active: filters.status === status.value }]"
                @click="toggleFilter('status', status.value)"
              >
                {{ status.label }}
              </button>
            </div>
          </div>

          <button
            v-if="hasActiveFilters"
            class="clear-filters-btn"
            @click="clearAllFilters"
          >
            <span class="clear-icon">✕</span>
            清除筛选
          </button>
        </div>
      </section>

      <!-- 结果统计 -->
      <section class="results-info">
        <div class="results-count">
          <span class="count-number">{{ filteredAnimals.length }}</span>
          <span class="count-text">个结果</span>
        </div>
        <div class="results-actions">
          <div class="sort-dropdown">
            <button class="sort-btn" @click="showSortMenu = !showSortMenu">
              <span class="sort-icon">⇅</span>
              <span>{{ sortOptions[sortBy] }}</span>
              <span class="dropdown-arrow">▼</span>
            </button>
            <transition name="slide-down">
              <div v-if="showSortMenu" class="sort-menu">
                <button
                  v-for="(label, value) in sortOptions"
                  :key="value"
                  class="sort-option"
                  :class="{ active: sortBy === value }"
                  @click="changeSort(value)"
                >
                  {{ label }}
                </button>
              </div>
            </transition>
          </div>
          <div class="view-toggle">
            <button
              class="view-btn"
              :class="{ active: viewMode === 'grid' }"
              @click="viewMode = 'grid'"
              title="网格视图"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <rect x="1" y="1" width="8" height="8" rx="1"/>
                <rect x="11" y="1" width="8" height="8" rx="1"/>
                <rect x="1" y="11" width="8" height="8" rx="1"/>
                <rect x="11" y="11" width="8" height="8" rx="1"/>
              </svg>
            </button>
            <button
              class="view-btn"
              :class="{ active: viewMode === 'list' }"
              @click="viewMode = 'list'"
              title="列表视图"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <rect x="1" y="2" width="18" height="4" rx="1"/>
                <rect x="1" y="8" width="18" height="4" rx="1"/>
                <rect x="1" y="14" width="18" height="4" rx="1"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      <!-- 动物列表 -->
      <section class="animals-section">
        <Loading v-if="loading" type="skeleton" :count="6" />

        <transition-group
          v-else-if="filteredAnimals.length > 0"
          :name="viewMode === 'grid' ? 'grid-fade' : 'list-fade'"
          tag="div"
          class="animals-grid"
          :class="viewMode"
        >
          <AnimalCard
            v-for="animal in sortedAnimals"
            :key="animal.id"
            :animal="animal"
            :view-mode="viewMode"
            @click="handleAnimalClick"
            @favorite-toggle="handleFavoriteToggle"
          />
        </transition-group>

        <!-- 空状态 -->
        <div v-else class="empty-state">
          <div class="empty-illustration">
            <div class="empty-circle">
              <span class="empty-icon">🔍</span>
            </div>
          </div>
          <h3 class="empty-title">未找到匹配的动物</h3>
          <p class="empty-description">
            尝试调整搜索条件或筛选器，发现更多珍稀动物
          </p>
          <button class="empty-action" @click="clearAllFilters">
            查看全部动物
          </button>
        </div>
      </section>

      <!-- 分页 -->
      <section v-if="totalPages > 1" class="pagination-section">
        <div class="pagination">
          <button
            class="page-btn prev"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            <span class="btn-icon">←</span>
            <span class="btn-text">上一页</span>
          </button>

          <div class="page-numbers">
            <button
              v-for="page in visiblePages"
              :key="page"
              class="page-number"
              :class="{ active: page === currentPage, ellipsis: page === '...' }"
              :disabled="page === '...'"
              @click="page !== '...' && changePage(page)"
            >
              {{ page }}
            </button>
          </div>

          <button
            class="page-btn next"
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            <span class="btn-text">下一页</span>
            <span class="btn-icon">→</span>
          </button>
        </div>
        <div class="pagination-info">
          显示 {{ startIndex + 1 }}-{{ endIndex }} 条，共 {{ filteredAnimals.length }} 条
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import AnimalCard from '@/components/animal/AnimalCard.vue'
import Loading from '@/components/common/Loading.vue'
import { useAnimalStore } from '@/stores/animal'
import { useUserStore } from '@/stores/user'
import { animalsData } from '@/data/animals'

export default {
  name: 'AnimalsView',
  
  components: {
    AppLayout,
    AnimalCard,
    Loading
  },

  setup() {
    const router = useRouter()
    const animalStore = useAnimalStore()
    const userStore = useUserStore()
    
    const loading = ref(false)
    const searchQuery = ref('')
    const showSuggestions = ref(false)
    const activeCategory = ref('all')
    const viewMode = ref('grid')
    const sortBy = ref('name')
    const showSortMenu = ref(false)
    const currentPage = ref(1)
    const pageSize = 12

    const filters = ref({
      habitat: '',
      status: ''
    })

    const animals = ref(animalsData)

    const categories = computed(() => [
      { id: 'all', label: '全部', icon: '🐾', count: animals.value.length },
      { id: '哺乳动物', label: '哺乳动物', icon: '🦁', count: animals.value.filter(a => a.category === '哺乳动物').length },
      { id: '鸟类', label: '鸟类', icon: '🦅', count: animals.value.filter(a => a.category === '鸟类').length },
      { id: '爬行动物', label: '爬行动物', icon: '🦎', count: animals.value.filter(a => a.category === '爬行动物').length },
      { id: '海洋生物', label: '海洋生物', icon: '🐋', count: animals.value.filter(a => a.habitat === '海洋').length }
    ])

    const habitats = computed(() => {
      const unique = [...new Set(animals.value.map(a => a.habitat))]
      return unique.filter(Boolean)
    })

    const conservationStatuses = [
      { value: '极危', label: '极危', class: 'critical' },
      { value: '濒危', label: '濒危', class: 'endangered' },
      { value: '易危', label: '易危', class: 'vulnerable' },
      { value: '近危', label: '近危', class: 'near-threatened' }
    ]

    const sortOptions = {
      name: '按名称',
      category: '按类别',
      status: '按保护等级',
      habitat: '按栖息地'
    }

    const suggestions = computed(() => {
      if (!searchQuery.value) return []
      const query = searchQuery.value.toLowerCase()
      return animals.value
        .filter(a => a.name.toLowerCase().includes(query) || a.species.toLowerCase().includes(query))
        .slice(0, 5)
        .map(a => a.name)
    })

    const endangeredCount = computed(() => 
      animals.value.filter(a => ['极危', '濒危'].includes(a.conservationStatus)).length
    )

    const filteredAnimals = computed(() => {
      let result = animals.value

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(a => 
          a.name.toLowerCase().includes(query) ||
          a.species.toLowerCase().includes(query) ||
          a.description.toLowerCase().includes(query)
        )
      }

      if (activeCategory.value !== 'all') {
        if (activeCategory.value === '海洋生物') {
          result = result.filter(a => a.habitat === '海洋')
        } else {
          result = result.filter(a => a.category === activeCategory.value)
        }
      }

      if (filters.value.habitat) {
        result = result.filter(a => a.habitat === filters.value.habitat)
      }

      if (filters.value.status) {
        result = result.filter(a => a.conservationStatus === filters.value.status)
      }

      return result
    })

    const totalPages = computed(() => 
      Math.ceil(filteredAnimals.value.length / pageSize)
    )

    const startIndex = computed(() => (currentPage.value - 1) * pageSize)
    const endIndex = computed(() => 
      Math.min(startIndex.value + pageSize, filteredAnimals.value.length)
    )

    const sortedAnimals = computed(() => {
      const sorted = [...filteredAnimals.value]
      let result
      
      switch (sortBy.value) {
        case 'name':
          result = sorted.sort((a, b) => a.name.localeCompare(b.name))
          break
        case 'category':
          result = sorted.sort((a, b) => a.category.localeCompare(b.category))
          break
        case 'status':
          const statusOrder = { '极危': 1, '濒危': 2, '易危': 3, '近危': 4 }
          result = sorted.sort((a, b) => 
            (statusOrder[a.conservationStatus] || 5) - (statusOrder[b.conservationStatus] || 5)
          )
          break
        case 'habitat':
          result = sorted.sort((a, b) => a.habitat.localeCompare(b.habitat))
          break
        default:
          result = sorted
      }
      
      return result.slice(startIndex.value, endIndex.value)
    })

    const hasActiveFilters = computed(() => 
      activeCategory.value !== 'all' || 
      filters.value.habitat || 
      filters.value.status ||
      searchQuery.value
    )

    const visiblePages = computed(() => {
      const pages = []
      const total = totalPages.value
      const current = currentPage.value

      if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i)
      } else {
        pages.push(1)
        if (current > 3) pages.push('...')
        for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
          pages.push(i)
        }
        if (current < total - 2) pages.push('...')
        pages.push(total)
      }

      return pages
    })

    const handleSearch = () => {
      showSuggestions.value = searchQuery.value.length > 0
      currentPage.value = 1
    }

    const selectSuggestion = (suggestion) => {
      searchQuery.value = suggestion
      showSuggestions.value = false
    }

    const clearSearch = () => {
      searchQuery.value = ''
      showSuggestions.value = false
    }

    const handleCategoryFilter = (categoryId) => {
      activeCategory.value = categoryId
      currentPage.value = 1
    }

    const toggleFilter = (type, value) => {
      if (filters.value[type] === value) {
        filters.value[type] = ''
      } else {
        filters.value[type] = value
      }
      currentPage.value = 1
    }

    const clearAllFilters = () => {
      activeCategory.value = 'all'
      filters.value = { habitat: '', status: '' }
      searchQuery.value = ''
      currentPage.value = 1
    }

    const changeSort = (value) => {
      sortBy.value = value
      showSortMenu.value = false
    }

    const changePage = (page) => {
      currentPage.value = page
      window.scrollTo({ top: 400, behavior: 'smooth' })
    }

    const handleAnimalClick = (animal) => {
      animalStore.setCurrentAnimal(animal)
      userStore.incrementAnimalsViewed()
      
      const progress = Math.min(100, (userStore.stats.animalsViewed / 10) * 100)
      userStore.updateAchievementProgress(2, progress)
      
      router.push(`/animals/${animal.id}`)
    }

    const handleFavoriteToggle = ({ animal, isFavorite }) => {
      console.log(`${animal.name} 收藏状态: ${isFavorite}`)
    }

    watch([searchQuery, filters, activeCategory], () => {
      currentPage.value = 1
    })

    onMounted(() => {
      animalStore.setAnimals(animals.value)
    })

    return {
      loading,
      searchQuery,
      showSuggestions,
      suggestions,
      activeCategory,
      categories,
      habitats,
      conservationStatuses,
      filters,
      hasActiveFilters,
      filteredAnimals,
      sortedAnimals,
      viewMode,
      sortBy,
      sortOptions,
      showSortMenu,
      currentPage,
      totalPages,
      visiblePages,
      startIndex,
      endIndex,
      animals,
      endangeredCount,
      handleSearch,
      selectSuggestion,
      clearSearch,
      handleCategoryFilter,
      toggleFilter,
      clearAllFilters,
      changeSort,
      changePage,
      handleAnimalClick,
      handleFavoriteToggle
    }
  }
}
</script>

<style scoped>
.animals-view {
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
  position: relative;
  max-width: 800px;
  z-index: 2;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 9999px;
  margin-bottom: 24px;
  backdrop-filter: blur(8px);
}

.badge-icon {
  font-size: 16px;
}

.badge-text {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.05em;
}

.hero-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 56px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
  margin-bottom: 20px;
}

.hero-title .highlight {
  color: #9dd090;
}

.hero-description {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
  margin-bottom: 40px;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 32px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-family: 'Quicksand', sans-serif;
  font-size: 40px;
  font-weight: 700;
  color: #ffffff;
  display: block;
}

.stat-label {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.05em;
}

.stat-divider {
  width: 1px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
}

.hero-visual {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}

.visual-circle {
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: rgba(157, 208, 144, 0.1);
  border: 2px solid rgba(157, 208, 144, 0.2);
}

.visual-pattern {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(157, 208, 144, 0.15) 0%, transparent 70%);
}

/* 快速导航 */
.quick-nav-section {
  padding: 32px 64px;
  background: #ffffff;
  border-bottom: 1px solid rgba(21, 66, 18, 0.08);
}

.quick-nav-container {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.category-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: #fcf9f2;
  border: 1px solid rgba(21, 66, 18, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-chip:hover {
  background: rgba(21, 66, 18, 0.08);
  border-color: rgba(21, 66, 18, 0.2);
  transform: translateY(-2px);
}

.category-chip.active {
  background: #154212;
  border-color: #154212;
  box-shadow: 0px 4px 12px rgba(21, 66, 18, 0.3);
}

.chip-icon {
  font-size: 20px;
}

.chip-label {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #1c1c18;
}

.category-chip.active .chip-label {
  color: #ffffff;
}

.chip-count {
  padding: 2px 8px;
  background: rgba(21, 66, 18, 0.1);
  border-radius: 6px;
  font-family: 'Quicksand', sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: #154212;
}

.category-chip.active .chip-count {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

/* 搜索筛选区域 */
.search-filter-section {
  padding: 32px 64px;
  background: #ffffff;
}

.search-container {
  position: relative;
  max-width: 600px;
  margin-bottom: 24px;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: #fcf9f2;
  border: 2px solid rgba(21, 66, 18, 0.1);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.search-box:focus-within {
  border-color: #0060ac;
  box-shadow: 0px 0px 0px 4px rgba(0, 96, 172, 0.1);
}

.search-icon {
  font-size: 20px;
  opacity: 0.5;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: #1c1c18;
  outline: none;
}

.search-input::placeholder {
  color: rgba(28, 28, 24, 0.4);
}

.clear-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(28, 28, 24, 0.1);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: rgba(28, 28, 24, 0.6);
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: rgba(28, 28, 24, 0.2);
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  background: #ffffff;
  border: 1px solid rgba(21, 66, 18, 0.1);
  border-radius: 12px;
  box-shadow: 0px 12px 32px rgba(45, 90, 39, 0.12);
  overflow: hidden;
  z-index: 10;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
  text-align: left;
}

.suggestion-item:hover {
  background: rgba(21, 66, 18, 0.05);
}

.suggestion-icon {
  font-size: 18px;
}

.suggestion-text {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #1c1c18;
}

.filter-bar {
  display: flex;
  gap: 32px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-label {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: rgba(28, 28, 24, 0.6);
  letter-spacing: 0.05em;
}

.filter-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-chip {
  padding: 8px 16px;
  background: #fcf9f2;
  border: 1px solid rgba(21, 66, 18, 0.1);
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #1c1c18;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-chip:hover {
  background: rgba(21, 66, 18, 0.08);
}

.filter-chip.active {
  background: #154212;
  border-color: #154212;
  color: #ffffff;
}

.filter-chip.status-chip.critical {
  border-left: 3px solid #ba1a1a;
}

.filter-chip.status-chip.endangered {
  border-left: 3px solid #d32f2f;
}

.filter-chip.status-chip.vulnerable {
  border-left: 3px solid #ff9800;
}

.filter-chip.status-chip.near-threatened {
  border-left: 3px solid #0060ac;
}

.clear-filters-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: transparent;
  border: 1px solid rgba(186, 26, 26, 0.3);
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #ba1a1a;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: auto;
}

.clear-filters-btn:hover {
  background: rgba(186, 26, 26, 0.08);
}

/* 结果统计 */
.results-info {
  padding: 24px 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  border-top: 1px solid rgba(21, 66, 18, 0.08);
}

.results-count {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.count-number {
  font-family: 'Quicksand', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #154212;
}

.count-text {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: rgba(28, 28, 24, 0.6);
}

.results-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.sort-dropdown {
  position: relative;
}

.sort-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #fcf9f2;
  border: 1px solid rgba(21, 66, 18, 0.1);
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #1c1c18;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sort-btn:hover {
  background: rgba(21, 66, 18, 0.08);
}

.sort-icon {
  font-size: 16px;
}

.dropdown-arrow {
  font-size: 10px;
  opacity: 0.5;
}

.sort-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: #ffffff;
  border: 1px solid rgba(21, 66, 18, 0.1);
  border-radius: 12px;
  box-shadow: 0px 12px 32px rgba(45, 90, 39, 0.12);
  overflow: hidden;
  min-width: 160px;
  z-index: 10;
}

.sort-option {
  display: block;
  width: 100%;
  padding: 12px 20px;
  background: transparent;
  border: none;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #1c1c18;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s ease;
}

.sort-option:hover {
  background: rgba(21, 66, 18, 0.05);
}

.sort-option.active {
  background: rgba(21, 66, 18, 0.1);
  color: #154212;
  font-weight: 600;
}

.view-toggle {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: #fcf9f2;
  border-radius: 8px;
}

.view-btn {
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: rgba(28, 28, 24, 0.5);
  transition: all 0.2s ease;
}

.view-btn:hover {
  color: #1c1c18;
}

.view-btn.active {
  background: #ffffff;
  color: #154212;
  box-shadow: 0px 2px 8px rgba(45, 90, 39, 0.1);
}

/* 动物列表 */
.animals-section {
  padding: 0 64px 48px;
  background: #ffffff;
}

.animals-grid {
  display: grid;
  gap: 24px;
}

.animals-grid.grid {
  grid-template-columns: repeat(3, 1fr);
}

.animals-grid.list {
  grid-template-columns: 1fr;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-illustration {
  margin-bottom: 32px;
}

.empty-circle {
  width: 120px;
  height: 120px;
  margin: 0 auto;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(21, 66, 18, 0.1) 0%, rgba(157, 208, 144, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  font-size: 48px;
}

.empty-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #154212;
  margin-bottom: 12px;
}

.empty-description {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: rgba(28, 28, 24, 0.6);
  margin-bottom: 32px;
}

.empty-action {
  padding: 14px 32px;
  background: #154212;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.empty-action:hover {
  background: #2d5a27;
  transform: translateY(-2px);
  box-shadow: 0px 8px 20px rgba(21, 66, 18, 0.3);
}

/* 分页 */
.pagination-section {
  padding: 32px 64px;
  background: #ffffff;
  border-top: 1px solid rgba(21, 66, 18, 0.08);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.page-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #fcf9f2;
  border: 1px solid rgba(21, 66, 18, 0.1);
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #1c1c18;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  background: rgba(21, 66, 18, 0.08);
  border-color: rgba(21, 66, 18, 0.2);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 8px;
}

.page-number {
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  background: #fcf9f2;
  border: 1px solid rgba(21, 66, 18, 0.1);
  border-radius: 8px;
  font-family: 'Quicksand', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #1c1c18;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-number:hover:not(:disabled):not(.ellipsis) {
  background: rgba(21, 66, 18, 0.08);
}

.page-number.active {
  background: #154212;
  border-color: #154212;
  color: #ffffff;
}

.page-number.ellipsis {
  border: none;
  background: transparent;
  cursor: default;
}

.pagination-info {
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: rgba(28, 28, 24, 0.6);
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.grid-fade-enter-active,
.grid-fade-leave-active {
  transition: all 0.4s ease;
}

.grid-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.grid-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.list-fade-enter-active,
.list-fade-leave-active {
  transition: all 0.3s ease;
}

.list-fade-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.list-fade-leave-to {
  opacity: 0;
}

/* 响应式 */
@media (max-width: 1024px) {
  .animals-grid.grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 48px 20px;
  }

  .hero-title {
    font-size: 36px;
  }

  .hero-description {
    font-size: 16px;
  }

  .hero-stats {
    flex-wrap: wrap;
    gap: 24px;
  }

  .stat-value {
    font-size: 32px;
  }

  .hero-visual {
    display: none;
  }

  .quick-nav-section,
  .search-filter-section,
  .results-info,
  .animals-section,
  .pagination-section {
    padding-left: 20px;
    padding-right: 20px;
  }

  .filter-bar {
    flex-direction: column;
    gap: 20px;
  }

  .clear-filters-btn {
    margin-left: 0;
  }

  .results-info {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .animals-grid.grid {
    grid-template-columns: 1fr;
  }

  .pagination {
    flex-wrap: wrap;
  }
}
</style>
