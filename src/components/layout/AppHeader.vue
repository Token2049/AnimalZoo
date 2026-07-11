/**
 * 应用头部组件
 * 
 * 功能说明：
 * 1. 显示Logo和导航菜单
 * 2. 支持主题切换
 * 3. 响应式设计，移动端显示汉堡菜单
 * 4. 使用具名插槽支持自定义操作区
 * 
 * @author Cloud Zoo Team
 * @version 2.0.0
 */
<template>
  <header class="header">
    <div class="header-container">
      <!-- Logo区域 -->
      <div class="header-left">
        <router-link to="/" class="logo">
          <span class="logo-icon">🦁</span>
          <span class="logo-text">Cloud Zoo</span>
        </router-link>
      </div>

      <!-- 导航菜单 -->
      <nav class="nav-menu">
        <router-link 
          v-for="item in navItems" 
          :key="item.path" 
          :to="item.path"
          class="nav-link"
          :class="{ active: $route.path === item.path }"
        >
          {{ item.label }}
        </router-link>
      </nav>

      <!-- 右侧操作区 -->
      <div class="header-right">
        <!-- 具名插槽：自定义操作按钮 -->
        <slot name="header-actions">
          <button class="btn-icon" @click="toggleTheme">
            <span v-if="isDark">☀️</span>
            <span v-else>🌙</span>
          </button>
          <router-link to="/profile" class="btn-profile">
            <span class="avatar">👤</span>
          </router-link>
        </slot>
      </div>

      <!-- 移动端菜单按钮 -->
      <button class="mobile-menu-btn" @click="toggleMobileMenu">
        <span v-if="!isMobileMenuOpen">☰</span>
        <span v-else>✕</span>
      </button>
    </div>

    <!-- 移动端菜单 -->
    <div v-if="isMobileMenuOpen" class="mobile-menu">
      <router-link 
        v-for="item in navItems" 
        :key="item.path" 
        :to="item.path"
        class="mobile-nav-link"
        @click="closeMobileMenu"
      >
        {{ item.label }}
      </router-link>
    </div>
  </header>
</template>

<script>
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'

export default {
  name: 'AppHeader',
  
  setup() {
    // 使用应用store
    const appStore = useAppStore()
    const isMobileMenuOpen = ref(false)

    // 导航菜单项配置
    const navItems = [
      { path: '/', label: '首页' },
      { path: '/animals', label: '动物列表' },
      { path: '/quiz', label: '知识问答' },
      { path: '/map', label: '园区地图' },
      { path: '/gallery', label: '相册展示' }
    ]

    // 是否为深色主题
    const isDark = computed(() => appStore.isDark)

    /**
     * 切换主题
     */
    const toggleTheme = () => {
      appStore.toggleTheme()
    }

    /**
     * 切换移动端菜单
     */
    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value
    }

    /**
     * 关闭移动端菜单
     */
    const closeMobileMenu = () => {
      isMobileMenuOpen.value = false
    }

    return {
      navItems,
      isDark,
      isMobileMenuOpen,
      toggleTheme,
      toggleMobileMenu,
      closeMobileMenu
    }
  }
}
</script>

<style scoped>
.header {
  background: #fcf9f2;
  border-bottom: 1px solid rgba(21, 66, 18, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0px 4px 20px rgba(45, 90, 39, 0.08);
}

.header-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 64px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #154212;
}

.logo-icon {
  font-size: 32px;
}

.logo-text {
  font-family: 'Quicksand', sans-serif;
  font-size: 24px;
  font-weight: 700;
}

.nav-menu {
  display: flex;
  gap: 8px;
}

.nav-link {
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  color: #1c1c18;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.05em;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background: rgba(21, 66, 18, 0.08);
}

.nav-link.active {
  background: #154212;
  color: #ffffff;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-icon {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  font-size: 20px;
  transition: background 0.2s ease;
}

.btn-icon:hover {
  background: rgba(21, 66, 18, 0.08);
}

.btn-profile {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #154212;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: transform 0.2s ease;
}

.btn-profile:hover {
  transform: scale(1.05);
}

.avatar {
  font-size: 20px;
}

.mobile-menu-btn {
  display: none;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  font-size: 24px;
  cursor: pointer;
}

.mobile-menu {
  display: none;
  padding: 16px;
  background: #fcf9f2;
  border-top: 1px solid rgba(21, 66, 18, 0.1);
}

.mobile-nav-link {
  display: block;
  padding: 12px 16px;
  text-decoration: none;
  color: #1c1c18;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  border-radius: 8px;
}

.mobile-nav-link:hover {
  background: rgba(21, 66, 18, 0.08);
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 20px;
  }

  .nav-menu,
  .header-right {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mobile-menu {
    display: block;
  }
}
</style>
