/**
 * 通知组件
 * 
 * 功能说明：
 * 1. 显示全局通知消息
 * 2. 支持多种通知类型（成功、错误、警告、信息）
 * 3. 支持自动消失和手动关闭
 * 4. 使用TransitionGroup实现动画效果
 * 
 * @author Cloud Zoo Team
 * @version 2.0.0
 */
<template>
  <TransitionGroup name="notification" tag="div" class="notification-container">
    <div 
      v-for="notification in notifications"
      :key="notification.id"
      class="notification"
      :class="[`type-${notification.type}`]"
    >
      <!-- 通知图标 -->
      <span class="notification-icon">{{ getIcon(notification.type) }}</span>
      
      <!-- 通知内容 -->
      <div class="notification-content">
        <h4 v-if="notification.title" class="notification-title">
          {{ notification.title }}
        </h4>
        <p class="notification-message">{{ notification.message }}</p>
      </div>
      
      <!-- 关闭按钮 -->
      <button class="notification-close" @click="removeNotification(notification.id)">
        ✕
      </button>
    </div>
  </TransitionGroup>
</template>

<script>
import { computed } from 'vue'
import { useNotificationStore } from '@/stores/notification'

export default {
  name: 'Notification',
  
  setup() {
    // 使用通知store
    const notificationStore = useNotificationStore()

    // 通知列表
    const notifications = computed(() => notificationStore.notifications)

    /**
     * 根据通知类型获取图标
     * @param {string} type - 通知类型
     * @returns {string} 图标字符
     */
    const getIcon = (type) => {
      const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
      }
      return icons[type] || 'ℹ'
    }

    /**
     * 移除通知
     * @param {number} id - 通知ID
     */
    const removeNotification = (id) => {
      notificationStore.remove(id)
    }

    return {
      notifications,
      getIcon,
      removeNotification
    }
  }
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}

.notification {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid rgba(21, 66, 18, 0.1);
  box-shadow: 0px 12px 32px rgba(45, 90, 39, 0.12);
}

.notification.type-success {
  border-left: 4px solid #154212;
}

.notification.type-error {
  border-left: 4px solid #ba1a1a;
}

.notification.type-warning {
  border-left: 4px solid #592e03;
}

.notification.type-info {
  border-left: 4px solid #0060ac;
}

.notification-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}

.type-success .notification-icon {
  background: rgba(21, 66, 18, 0.15);
  color: #154212;
}

.type-error .notification-icon {
  background: rgba(186, 26, 26, 0.15);
  color: #ba1a1a;
}

.type-warning .notification-icon {
  background: rgba(89, 46, 3, 0.15);
  color: #592e03;
}

.type-info .notification-icon {
  background: rgba(0, 96, 172, 0.15);
  color: #0060ac;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #1c1c18;
  margin-bottom: 4px;
}

.notification-message {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: rgba(28, 28, 24, 0.8);
  line-height: 1.4;
}

.notification-close {
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: rgba(28, 28, 24, 0.4);
  transition: color 0.2s ease;
  flex-shrink: 0;
}

.notification-close:hover {
  color: #1c1c18;
}

/* 过渡动画 */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@media (max-width: 768px) {
  .notification-container {
    left: 20px;
    right: 20px;
    max-width: none;
  }
}
</style>
