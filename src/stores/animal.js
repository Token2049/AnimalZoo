/**
 * 动物数据状态管理 Store
 * 使用Pinia进行状态管理，提供动物数据的操作
 * 
 * @features
 * - 动物列表管理
 * - 搜索和筛选功能
 * - 分页处理
 * - 当前选中动物
 * 
 * @author Cloud Zoo Team
 * @version 2.0.0
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAnimalStore = defineStore('animal', () => {
  
  // ==================== 状态定义 ====================
  
  /** @type {Ref<Array>} 动物列表数据 */
  const animals = ref([])
  
  /** @type {Ref<Object|null>} 当前选中的动物详情 */
  const currentAnimal = ref(null)
  
  /** @type {Ref<Object>} 筛选条件 */
  const filters = ref({
    category: '',      // 动物类别
    habitat: '',       // 栖息地
    status: ''         // 保护状态
  })
  
  /** @type {Ref<string>} 搜索关键词 */
  const searchQuery = ref('')
  
  /** @type {Ref<Object>} 分页配置 */
  const pagination = ref({
    page: 1,
    limit: 12,
    total: 0
  })
  
  /** @type {Ref<boolean>} 加载状态 */
  const loading = ref(false)
  
  /** @type {Ref<string|null>} 错误信息 */
  const error = ref(null)

  // ==================== 计算属性 ====================
  
  /**
   * 根据筛选条件过滤动物列表
   * @returns {Array} 过滤后的动物数组
   */
  const filteredAnimals = computed(() => {
    let result = animals.value
    
    // 搜索过滤
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(a => 
        a.name.toLowerCase().includes(query) ||
        a.species.toLowerCase().includes(query) ||
        a.description?.toLowerCase().includes(query)
      )
    }
    
    // 类别筛选
    if (filters.value.category) {
      result = result.filter(a => a.category === filters.value.category)
    }
    
    // 栖息地筛选
    if (filters.value.habitat) {
      result = result.filter(a => a.habitat === filters.value.habitat)
    }
    
    // 保护状态筛选
    if (filters.value.status) {
      result = result.filter(a => a.conservationStatus === filters.value.status)
    }
    
    return result
  })
  
  /**
   * 获取动物分类统计
   * @returns {Object} 各类别动物数量统计
   */
  const categoryStats = computed(() => {
    const stats = {}
    animals.value.forEach(animal => {
      const cat = animal.category || 'other'
      stats[cat] = (stats[cat] || 0) + 1
    })
    return stats
  })
  
  /**
   * 获取总页数
   * @returns {number} 总页数
   */
  const totalPages = computed(() => 
    Math.ceil(filteredAnimals.value.length / pagination.value.limit)
  )

  // ==================== 动作方法 ====================
  
  /**
   * 设置动物列表数据
   * @param {Array} data - 动物数据数组
   */
  function setAnimals(data) {
    animals.value = data
    pagination.value.total = data.length
  }
  
  /**
   * 添加新动物
   * @param {Object} animal - 动物对象
   */
  function addAnimal(animal) {
    animals.value.push({
      ...animal,
      id: animal.id || Date.now()
    })
  }
  
  /**
   * 更新动物信息
   * @param {number|string} id - 动物ID
   * @param {Object} updates - 更新的字段
   */
  function updateAnimal(id, updates) {
    const index = animals.value.findIndex(a => a.id === id)
    if (index !== -1) {
      animals.value[index] = { ...animals.value[index], ...updates }
    }
  }
  
  /**
   * 删除动物
   * @param {number|string} id - 动物ID
   */
  function deleteAnimal(id) {
    animals.value = animals.value.filter(a => a.id !== id)
  }
  
  /**
   * 设置当前动物详情
   * @param {Object|null} animal - 动物对象
   */
  function setCurrentAnimal(animal) {
    currentAnimal.value = animal
  }
  
  /**
   * 根据ID获取动物详情
   * @param {number|string} id - 动物ID
   * @returns {Object|null} 动物对象
   */
  function getAnimalById(id) {
    return animals.value.find(a => a.id === id) || null
  }
  
  /**
   * 设置筛选条件
   * @param {Object} newFilters - 新的筛选条件
   */
  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
    pagination.value.page = 1 // 重置页码
  }
  
  /**
   * 设置搜索关键词
   * @param {string} query - 搜索关键词
   */
  function setSearchQuery(query) {
    searchQuery.value = query
    pagination.value.page = 1 // 重置页码
  }
  
  /**
   * 清除所有筛选条件
   */
  function clearFilters() {
    filters.value = { category: '', habitat: '', status: '' }
    searchQuery.value = ''
    pagination.value.page = 1
  }
  
  /**
   * 设置当前页码
   * @param {number} page - 页码
   */
  function setPage(page) {
    pagination.value.page = page
  }
  
  /**
   * 设置加载状态
   * @param {boolean} state - 加载状态
   */
  function setLoading(state) {
    loading.value = state
  }
  
  /**
   * 设置错误信息
   * @param {string|null} message - 错误信息
   */
  function setError(message) {
    error.value = message
  }

  // ==================== 导出 ====================
  
  return {
    // 状态
    animals,
    currentAnimal,
    filters,
    searchQuery,
    pagination,
    loading,
    error,
    
    // 计算属性
    filteredAnimals,
    categoryStats,
    totalPages,
    
    // 动作
    setAnimals,
    addAnimal,
    updateAnimal,
    deleteAnimal,
    setCurrentAnimal,
    getAnimalById,
    setFilters,
    setSearchQuery,
    clearFilters,
    setPage,
    setLoading,
    setError
  }
})
