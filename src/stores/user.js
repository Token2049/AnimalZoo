/**
 * 用户状态管理 Store
 * 管理用户信息、成就、收藏等用户相关数据
 * 
 * @features
 * - 用户资料管理
 * - 成就系统
 * - 收藏功能
 * - 登录状态
 * - 数据持久化
 * 
 * @author Cloud Zoo Team
 * @version 2.1.0
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  
  // ==================== 状态定义 ====================
  
  /** @type {Ref<Object|null>} 用户资料 */
  const profile = ref(null)
  
  /** @type {Ref<Array>} 用户成就列表 */
  const achievements = ref([])
  
  /** @type {Ref<Array>} 收藏的动物ID列表 */
  const favorites = ref([])
  
  /** @type {Ref<boolean>} 登录状态 */
  const isLoggedIn = ref(false)
  
  /** @type {Ref<Object>} 用户统计数据 */
  const stats = ref({
    animalsViewed: 0,    // 浏览动物数
    quizScore: 0,        // 问答得分
    quizCompleted: 0,    // 完成问答次数
    achievementsUnlocked: 0 // 解锁成就数
  })

  // ==================== 计算属性 ====================
  
  /**
   * 获取用户显示名称
   * @returns {string} 用户名或默认名称
   */
  const displayName = computed(() => 
    profile.value?.name || '游客'
  )
  
  /**
   * 获取已解锁的成就列表
   * @returns {Array} 已解锁成就数组
   */
  const unlockedAchievements = computed(() => 
    achievements.value.filter(a => a.unlocked)
  )
  
  /**
   * 获取成就完成进度
   * @returns {number} 成就完成百分比
   */
  const achievementProgress = computed(() => {
    if (achievements.value.length === 0) return 0
    return Math.round((unlockedAchievements.value.length / achievements.value.length) * 100)
  })

  // ==================== 动作方法 ====================
  
  /**
   * 设置用户资料
   * @param {Object} data - 用户资料对象
   */
  function setProfile(data) {
    profile.value = data
    isLoggedIn.value = !!data
  }
  
  /**
   * 更新用户资料
   * @param {Object} updates - 更新的字段
   */
  function updateProfile(updates) {
    if (profile.value) {
      profile.value = { ...profile.value, ...updates }
    }
  }
  
  /**
   * 设置成就列表
   * @param {Array} list - 成就数组
   */
  function setAchievements(list) {
    achievements.value = list
  }
  
  /**
   * 解锁成就
   * @param {Object} achievement - 成就对象
   * @returns {boolean} 是否成功解锁
   */
  function unlockAchievement(achievement) {
    const existing = achievements.value.find(a => a.id === achievement.id)
    
    if (existing && !existing.unlocked) {
      existing.unlocked = true
      existing.unlockedAt = new Date().toISOString()
      stats.value.achievementsUnlocked++
      return true
    }
    
    if (!existing) {
      achievements.value.push({
        ...achievement,
        unlocked: true,
        unlockedAt: new Date().toISOString()
      })
      stats.value.achievementsUnlocked++
      return true
    }
    
    return false
  }
  
  /**
   * 更新成就进度
   * @param {string|number} id - 成就ID
   * @param {number} progress - 进度值 (0-100)
   */
  function updateAchievementProgress(id, progress) {
    const achievement = achievements.value.find(a => a.id === id)
    if (achievement) {
      achievement.progress = Math.min(100, Math.max(0, progress))
      
      // 进度达到100%自动解锁
      if (achievement.progress >= 100 && !achievement.unlocked) {
        unlockAchievement(achievement)
      }
    }
  }
  
  /**
   * 检查是否拥有某成就
   * @param {string|number} id - 成就ID
   * @returns {boolean} 是否已解锁
   */
  function hasAchievement(id) {
    const achievement = achievements.value.find(a => a.id === id)
    return achievement?.unlocked || false
  }
  
  /**
   * 设置收藏列表
   * @param {Array} list - 收藏的动物ID数组
   */
  function setFavorites(list) {
    favorites.value = list
  }
  
  /**
   * 添加收藏
   * @param {number|string} animalId - 动物ID
   */
  function addFavorite(animalId) {
    if (!favorites.value.includes(animalId)) {
      favorites.value.push(animalId)
    }
  }
  
  /**
   * 移除收藏
   * @param {number|string} animalId - 动物ID
   */
  function removeFavorite(animalId) {
    favorites.value = favorites.value.filter(id => id !== animalId)
  }
  
  /**
   * 切换收藏状态
   * @param {number|string} animalId - 动物ID
   * @returns {boolean} 操作后的收藏状态
   */
  function toggleFavorite(animalId) {
    if (isFavorite(animalId)) {
      removeFavorite(animalId)
      return false
    } else {
      addFavorite(animalId)
      return true
    }
  }
  
  /**
   * 检查是否已收藏
   * @param {number|string} animalId - 动物ID
   * @returns {boolean} 是否已收藏
   */
  function isFavorite(animalId) {
    return favorites.value.includes(animalId)
  }
  
  /**
   * 更新统计数据
   * @param {Object} updates - 更新的统计字段
   */
  function updateStats(updates) {
    stats.value = { ...stats.value, ...updates }
  }
  
  /**
   * 增加浏览动物数
   */
  function incrementAnimalsViewed() {
    stats.value.animalsViewed++
  }
  
  /**
   * 更新问答得分
   * @param {number} score - 得分
   */
  function addQuizScore(score) {
    stats.value.quizScore += score
    stats.value.quizCompleted++
  }
  
  /**
   * 用户登录
   * @param {Object} userData - 用户数据
   */
  function login(userData) {
    setProfile(userData)
    isLoggedIn.value = true
  }
  
  /**
   * 用户登出
   */
  function logout() {
    profile.value = null
    isLoggedIn.value = false
    favorites.value = []
    stats.value = {
      animalsViewed: 0,
      quizScore: 0,
      quizCompleted: 0,
      achievementsUnlocked: 0
    }
  }

  // ==================== 导出 ====================
  
  return {
    // 状态
    profile,
    achievements,
    favorites,
    isLoggedIn,
    stats,
    
    // 计算属性
    displayName,
    unlockedAchievements,
    achievementProgress,
    
    // 动作
    setProfile,
    updateProfile,
    setAchievements,
    unlockAchievement,
    updateAchievementProgress,
    hasAchievement,
    setFavorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    updateStats,
    incrementAnimalsViewed,
    addQuizScore,
    login,
    logout
  }
}, {
  persist: {
    key: 'cloudzoo-user',
    storage: localStorage,
    paths: ['profile', 'achievements', 'favorites', 'stats']
  }
})
