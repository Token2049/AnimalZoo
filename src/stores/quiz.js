/**
 * 问答系统状态管理 Store
 * 管理问答题目、答题进度、得分等
 * 
 * @features
 * - 问答题目管理
 * - 答题进度跟踪
 * - 得分统计
 * - 计时功能
 * - 答题历史记录
 * - 数据持久化
 * 
 * @author Cloud Zoo Team
 * @version 2.1.0
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useQuizStore = defineStore('quiz', () => {
  
  // ==================== 状态定义 ====================
  
  /** @type {Ref<Array>} 问答题目列表 */
  const questions = ref([])
  
  /** @type {Ref<number>} 当前题目索引 */
  const currentQuestionIndex = ref(0)
  
  /** @type {Ref<Array>} 答题记录 */
  const answers = ref([])
  
  /** @type {Ref<number>} 当前得分 */
  const score = ref(0)
  
  /** @type {Ref<number>} 剩余时间（秒） */
  const timeRemaining = ref(0)
  
  /** @type {Ref<boolean>} 问答是否进行中 */
  const isQuizActive = ref(false)
  
  /** @type {Ref<string>} 问答类型 */
  const quizType = ref('')
  
  /** @type {Ref<Array>} 答题历史记录 */
  const history = ref([])
  
  /** @type {Ref<number>} 每题时间限制（秒） */
  const questionTimeLimit = ref(30)

  // ==================== 计算属性 ====================
  
  /**
   * 获取当前题目
   * @returns {Object|null} 当前题目对象
   */
  const currentQuestion = computed(() => 
    questions.value[currentQuestionIndex.value] || null
  )
  
  /**
   * 获取总题目数
   * @returns {number} 题目总数
   */
  const totalQuestions = computed(() => questions.value.length)
  
  /**
   * 获取答题进度百分比
   * @returns {number} 进度百分比 (0-100)
   */
  const progress = computed(() => {
    if (questions.value.length === 0) return 0
    return Math.round((currentQuestionIndex.value / questions.value.length) * 100)
  })
  
  /**
   * 是否为最后一题
   * @returns {boolean}
   */
  const isLastQuestion = computed(() => 
    currentQuestionIndex.value >= questions.value.length - 1
  )
  
  /**
   * 获取正确率
   * @returns {number} 正确率百分比
   */
  const accuracy = computed(() => {
    if (answers.value.length === 0) return 0
    const correct = answers.value.filter(a => a.isCorrect).length
    return Math.round((correct / answers.value.length) * 100)
  })
  
  /**
   * 获取正确答题数
   * @returns {number}
   */
  const correctCount = computed(() => 
    answers.value.filter(a => a.isCorrect).length
  )

  // ==================== 动作方法 ====================
  
  /**
   * 开始问答
   * @param {Object} config - 问答配置
   * @param {Array} config.questions - 题目数组
   * @param {number} config.timeLimit - 总时间限制（秒）
   * @param {string} config.type - 问答类型
   */
  function startQuiz({ questions: quizQuestions, timeLimit, type }) {
    questions.value = quizQuestions
    timeRemaining.value = timeLimit
    quizType.value = type
    currentQuestionIndex.value = 0
    answers.value = []
    score.value = 0
    isQuizActive.value = true
  }
  
  /**
   * 提交答案
   * @param {number} answerIndex - 选择的答案索引
   * @returns {Object} 答题结果
   */
  function submitAnswer(answerIndex) {
    const question = currentQuestion.value
    if (!question) return { isCorrect: false }
    
    const isCorrect = question.correctAnswer === answerIndex
    
    const answerRecord = {
      questionId: question.id,
      questionIndex: currentQuestionIndex.value,
      answer: answerIndex,
      correctAnswer: question.correctAnswer,
      isCorrect,
      timestamp: new Date().toISOString()
    }
    
    answers.value.push(answerRecord)
    
    if (isCorrect) {
      score.value++
    }
    
    return {
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation
    }
  }
  
  /**
   * 进入下一题
   * @returns {boolean} 是否还有下一题
   */
  function nextQuestion() {
    if (isLastQuestion.value) {
      endQuiz()
      return false
    }
    
    currentQuestionIndex.value++
    return true
  }
  
  /**
   * 跳过当前题目
   */
  function skipQuestion() {
    const question = currentQuestion.value
    if (!question) return
    
    answers.value.push({
      questionId: question.id,
      questionIndex: currentQuestionIndex.value,
      answer: -1,
      correctAnswer: question.correctAnswer,
      isCorrect: false,
      skipped: true,
      timestamp: new Date().toISOString()
    })
    
    nextQuestion()
  }
  
  /**
   * 减少剩余时间
   */
  function decrementTime() {
    if (timeRemaining.value > 0) {
      timeRemaining.value--
    }
    
    if (timeRemaining.value === 0) {
      endQuiz()
    }
  }
  
  /**
   * 结束问答
   * @param {number} timeSpent - 用时（秒）
   */
  function endQuiz(timeSpent = 0) {
    isQuizActive.value = false
    
    // 保存到历史记录
    history.value.unshift({
      id: Date.now(),
      type: quizType.value,
      score: score.value,
      total: totalQuestions.value,
      accuracy: accuracy.value,
      answers: [...answers.value],
      completedAt: new Date().toISOString(),
      timeSpent: timeSpent
    })
    
    // 只保留最近20条记录
    if (history.value.length > 20) {
      history.value = history.value.slice(0, 20)
    }
  }
  
  /**
   * 重置问答状态
   */
  function resetQuiz() {
    questions.value = []
    currentQuestionIndex.value = 0
    answers.value = []
    score.value = 0
    timeRemaining.value = 0
    isQuizActive.value = false
    quizType.value = ''
  }
  
  /**
   * 重新开始当前问答
   */
  function restartQuiz() {
    const currentQuestions = [...questions.value]
    const currentType = quizType.value
    const currentTimeLimit = timeRemaining.value + (answers.value.length * questionTimeLimit.value)
    
    resetQuiz()
    
    startQuiz({
      questions: currentQuestions,
      timeLimit: currentTimeLimit,
      type: currentType
    })
  }
  
  /**
   * 获取答题统计
   * @returns {Object} 统计数据
   */
  function getStatistics() {
    return {
      totalQuizzes: history.value.length,
      totalScore: history.value.reduce((sum, h) => sum + h.score, 0),
      averageAccuracy: history.value.length > 0 
        ? Math.round(history.value.reduce((sum, h) => sum + h.accuracy, 0) / history.value.length)
        : 0,
      recentHistory: history.value.slice(0, 5)
    }
  }
  
  /**
   * 清除历史记录
   */
  function clearHistory() {
    history.value = []
  }

  // ==================== 导出 ====================
  
  return {
    // 状态
    questions,
    currentQuestionIndex,
    answers,
    score,
    timeRemaining,
    isQuizActive,
    quizType,
    history,
    questionTimeLimit,
    
    // 计算属性
    currentQuestion,
    totalQuestions,
    progress,
    isLastQuestion,
    accuracy,
    correctCount,
    
    // 动作
    startQuiz,
    submitAnswer,
    nextQuestion,
    skipQuestion,
    decrementTime,
    endQuiz,
    resetQuiz,
    restartQuiz,
    getStatistics,
    clearHistory
  }
}, {
  persist: {
    key: 'cloudzoo-quiz',
    storage: localStorage,
    paths: ['history', 'totalScore', 'totalQuizzes']
  }
})
