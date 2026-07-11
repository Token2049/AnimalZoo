/**
 * 应用根组件
 * 
 * 功能说明：
 * 1. 提供全局布局容器
 * 2. 管理主题切换
 * 3. 处理页面过渡动画
 * 4. 显示全局通知组件
 * 
 * @author Cloud Zoo Team
 * @version 2.0.0
 */
<template>
  <div id="app" :class="themeClass">
    <!-- 路由视图，带过渡动画 -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    
    <!-- 全局通知组件 -->
    <Notification />
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { useNotificationStore } from '@/stores/notification'
import Notification from '@/components/common/Notification.vue'
import eventBus from '@/utils/eventBus'

export default {
  name: 'App',
  
  components: {
    Notification
  },

  setup() {
    // 使用Pinia stores
    const appStore = useAppStore()
    const notificationStore = useNotificationStore()

    // 计算主题类名
    const themeClass = computed(() => appStore.themeClass)

    // 组件挂载时初始化
    onMounted(() => {
      // 初始化主题
      appStore.initTheme()
      
      // 监听事件总线的通知事件
      eventBus.on('notification:show', (notification) => {
        notificationStore.show(notification)
      })
    })

    return {
      themeClass
    }
  }
}
</script>

<style>
/**
 * 全局样式定义
 * 包含字体导入、重置样式、主题变量、滚动条样式等
 */

/* 导入Google字体：Quicksand用于标题，Inter用于正文 */
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');

/* CSS重置和基础设置 */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.5;
}

/* 应用容器基础样式 */
#app {
  min-height: 100vh;
  background: #fcf9f2;  /* Soft Cream - Cloud Zoo背景色 */
  color: #1c1c18;
}

/* 深色主题 */
.theme-dark {
  background: #1c1c18;
  color: #fcf9f2;
}

/* 链接基础样式 */
a {
  color: inherit;
  text-decoration: none;
}

/* 按钮基础样式 */
button {
  font-family: inherit;
}

/* 图片响应式 */
img {
  max-width: 100%;
  height: auto;
}

/* 页面过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(21, 66, 18, 0.05);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(21, 66, 18, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(21, 66, 18, 0.3);
}

/* 文本选中样式 */
::selection {
  background: rgba(21, 66, 18, 0.2);
  color: #1c1c18;
}
</style>
