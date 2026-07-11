<template>
  <aside class="sidebar" :class="{ collapsed: isCollapsed }">
    <div class="sidebar-header">
      <button class="toggle-btn" @click="toggleSidebar">
        <span v-if="isCollapsed">→</span>
        <span v-else>←</span>
      </button>
    </div>

    <nav class="sidebar-nav">
      <div 
        v-for="item in menuItems" 
        :key="item.id"
        class="nav-item"
        :class="{ active: activeItem === item.id }"
        @click="handleItemClick(item)"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span v-if="!isCollapsed" class="nav-label">{{ item.label }}</span>
      </div>
    </nav>

    <div v-if="!isCollapsed" class="sidebar-footer">
      <slot name="sidebar-footer">
        <div class="stats">
          <div class="stat-item">
            <span class="stat-value">{{ animalCount }}</span>
            <span class="stat-label">动物种类</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ visitCount }}</span>
            <span class="stat-label">今日参观</span>
          </div>
        </div>
      </slot>
    </div>
  </aside>
</template>

<script>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'AppSidebar',
  
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },

  emits: ['update:collapsed', 'item-click'],

  setup(props, { emit }) {
    const router = useRouter()
    const isCollapsed = ref(props.collapsed)
    const activeItem = ref('home')

    const animalCount = inject('animalCount', 150)
    const visitCount = inject('visitCount', 2340)

    const menuItems = [
      { id: 'home', label: '首页', icon: '🏠', path: '/' },
      { id: 'animals', label: '动物列表', icon: '🦁', path: '/animals' },
      { id: 'quiz', label: '知识问答', icon: '❓', path: '/quiz' },
      { id: 'map', label: '园区地图', icon: '🗺️', path: '/map' },
      { id: 'gallery', label: '相册展示', icon: '📷', path: '/gallery' },
      { id: 'profile', label: '个人中心', icon: '👤', path: '/profile' }
    ]

    const toggleSidebar = () => {
      isCollapsed.value = !isCollapsed.value
      emit('update:collapsed', isCollapsed.value)
    }

    const handleItemClick = (item) => {
      activeItem.value = item.id
      emit('item-click', item)
      if (item.path) {
        router.push(item.path)
      }
    }

    return {
      isCollapsed,
      activeItem,
      menuItems,
      animalCount,
      visitCount,
      toggleSidebar,
      handleItemClick
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid rgba(21, 66, 18, 0.1);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  box-shadow: 0px 4px 20px rgba(45, 90, 39, 0.08);
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  padding: 16px;
  display: flex;
  justify-content: flex-end;
}

.toggle-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(21, 66, 18, 0.08);
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s ease;
}

.toggle-btn:hover {
  background: rgba(21, 66, 18, 0.15);
}

.sidebar-nav {
  flex: 1;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: rgba(21, 66, 18, 0.08);
}

.nav-item.active {
  background: #154212;
  color: #ffffff;
}

.nav-icon {
  font-size: 20px;
  min-width: 24px;
  text-align: center;
}

.nav-label {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(21, 66, 18, 0.1);
}

.stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-value {
  display: block;
  font-family: 'Quicksand', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #154212;
}

.stat-label {
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #1c1c18;
  margin-top: 4px;
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
}
</style>
