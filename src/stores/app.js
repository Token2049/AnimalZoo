/**
 * 应用全局状态管理 Store
 * 管理主题、加载状态等全局配置
 * 
 * @features
 * - 主题管理
 * - 语言设置
 * - 侧边栏状态
 * - 模态框状态
 * - 数据持久化
 * 
 * @author Cloud Zoo Team
 * @version 2.1.0
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  
  // ==================== 状态定义 ====================
  
  /** @type {Ref<boolean>} 全局加载状态 */
  const isLoading = ref(false)
  
  /** @type {Ref<string>} 当前主题 (light|dark) */
  const theme = ref('light')
  
  /** @type {Ref<string>} 语言设置 */
  const locale = ref('zh-CN')
  
  /** @type {Ref<Object>} 侧边栏状态 */
  const sidebar = ref({
    collapsed: false,
    mobileOpen: false
  })
  
  /** @type {Ref<Object>} 模态框状态 */
  const modals = ref({
    login: false,
    settings: false
  })

  // ==================== 计算属性 ====================
  
  /**
   * 是否为深色主题
   * @returns {boolean}
   */
  const isDark = computed(() => theme.value === 'dark')
  
  /**
   * 主题类名
   * @returns {string}
   */
  const themeClass = computed(() => `theme-${theme.value}`)

  // ==================== 动作方法 ====================
  
  /**
   * 设置加载状态
   * @param {boolean} state - 加载状态
   */
  function setLoading(state) {
    isLoading.value = state
  }
  
  /**
   * 设置主题
   * @param {string} newTheme - 主题名称
   */
  function setTheme(newTheme) {
    theme.value = newTheme
    
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }
  
  /**
   * 切换主题
   */
  function toggleTheme() {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }
  
  /**
   * 初始化主题（从持久化存储恢复）
   */
  function initTheme() {
    if (theme.value) {
      document.documentElement.classList.toggle('dark', theme.value === 'dark')
    }
  }
  
  /**
   * 设置语言
   * @param {string} newLocale - 语言代码
   */
  function setLocale(newLocale) {
    locale.value = newLocale
  }
  
  /**
   * 切换侧边栏折叠状态
   */
  function toggleSidebar() {
    sidebar.value.collapsed = !sidebar.value.collapsed
  }
  
  /**
   * 设置侧边栏状态
   * @param {boolean} collapsed - 是否折叠
   */
  function setSidebarCollapsed(collapsed) {
    sidebar.value.collapsed = collapsed
  }
  
  /**
   * 切换移动端侧边栏
   */
  function toggleMobileSidebar() {
    sidebar.value.mobileOpen = !sidebar.value.mobileOpen
  }
  
  /**
   * 关闭移动端侧边栏
   */
  function closeMobileSidebar() {
    sidebar.value.mobileOpen = false
  }
  
  /**
   * 打开模态框
   * @param {string} name - 模态框名称
   */
  function openModal(name) {
    if (modals.value.hasOwnProperty(name)) {
      modals.value[name] = true
    }
  }
  
  /**
   * 关闭模态框
   * @param {string} name - 模态框名称
   */
  function closeModal(name) {
    if (modals.value.hasOwnProperty(name)) {
      modals.value[name] = false
    }
  }
  
  /**
   * 切换模态框状态
   * @param {string} name - 模态框名称
   */
  function toggleModal(name) {
    if (modals.value.hasOwnProperty(name)) {
      modals.value[name] = !modals.value[name]
    }
  }

  // ==================== 导出 ====================
  
  return {
    // 状态
    isLoading,
    theme,
    locale,
    sidebar,
    modals,
    
    // 计算属性
    isDark,
    themeClass,
    
    // 动作
    setLoading,
    setTheme,
    toggleTheme,
    initTheme,
    setLocale,
    toggleSidebar,
    setSidebarCollapsed,
    toggleMobileSidebar,
    closeMobileSidebar,
    openModal,
    closeModal,
    toggleModal
  }
}, {
  persist: {
    key: 'cloudzoo-app',
    storage: localStorage,
    paths: ['theme', 'locale', 'sidebar']
  }
})
