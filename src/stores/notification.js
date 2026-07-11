/**
 * 通知系统状态管理 Store
 * 管理应用内的通知消息
 * 
 * @features
 * - 通知消息管理
 * - 多类型通知（成功、错误、警告、信息）
 * - 自动消失
 * - 未读计数
 * 
 * @author Cloud Zoo Team
 * @version 2.0.0
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  
  // ==================== 状态定义 ====================
  
  /** @type {Ref<Array>} 通知列表 */
  const notifications = ref([])
  
  /** @type {Ref<number>} 通知ID计数器 */
  let notificationId = 0

  // ==================== 计算属性 ====================
  
  /**
   * 获取未读通知数量
   * @returns {number}
   */
  const unreadCount = computed(() => 
    notifications.value.filter(n => !n.read).length
  )
  
  /**
   * 获取最新通知
   * @returns {Object|null}
   */
  const latestNotification = computed(() => 
    notifications.value[0] || null
  )

  // ==================== 动作方法 ====================
  
  /**
   * 显示通知
   * @param {Object} options - 通知配置
   * @param {string} options.type - 通知类型 (success|error|warning|info)
   * @param {string} options.message - 通知消息
   * @param {string} [options.title] - 通知标题
   * @param {number} [options.duration] - 显示时长（毫秒），0表示不自动关闭
   * @returns {number} 通知ID
   */
  function show(options) {
    const {
      type = 'info',
      message,
      title,
      duration = 5000
    } = options
    
    const id = ++notificationId
    
    const notification = {
      id,
      type,
      message,
      title,
      duration,
      read: false,
      timestamp: new Date().toISOString()
    }
    
    notifications.value.unshift(notification)
    
    // 设置自动消失
    if (duration !== 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
    
    return id
  }
  
  /**
   * 显示成功通知
   * @param {string} message - 消息内容
   * @param {string} [title] - 标题
   * @returns {number}
   */
  function success(message, title) {
    return show({ type: 'success', message, title })
  }
  
  /**
   * 显示错误通知
   * @param {string} message - 消息内容
   * @param {string} [title] - 标题
   * @returns {number}
   */
  function error(message, title) {
    return show({ type: 'error', message, title, duration: 8000 })
  }
  
  /**
   * 显示警告通知
   * @param {string} message - 消息内容
   * @param {string} [title] - 标题
   * @returns {number}
   */
  function warning(message, title) {
    return show({ type: 'warning', message, title, duration: 6000 })
  }
  
  /**
   * 显示信息通知
   * @param {string} message - 消息内容
   * @param {string} [title] - 标题
   * @returns {number}
   */
  function info(message, title) {
    return show({ type: 'info', message, title })
  }
  
  /**
   * 移除通知
   * @param {number} id - 通知ID
   */
  function remove(id) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }
  
  /**
   * 标记通知为已读
   * @param {number} id - 通知ID
   */
  function markAsRead(id) {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }
  
  /**
   * 标记所有通知为已读
   */
  function markAllAsRead() {
    notifications.value.forEach(n => {
      n.read = true
    })
  }
  
  /**
   * 清除所有通知
   */
  function clearAll() {
    notifications.value = []
  }
  
  /**
   * 获取指定类型的通知
   * @param {string} type - 通知类型
   * @returns {Array}
   */
  function getByType(type) {
    return notifications.value.filter(n => n.type === type)
  }

  // ==================== 导出 ====================
  
  return {
    // 状态
    notifications,
    
    // 计算属性
    unreadCount,
    latestNotification,
    
    // 动作
    show,
    success,
    error,
    warning,
    info,
    remove,
    markAsRead,
    markAllAsRead,
    clearAll,
    getByType
  }
})
