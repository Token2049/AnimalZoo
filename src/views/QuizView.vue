/**
 * 问答视图组件 - 企业商业级别
 * 
 * 功能说明：
 * 1. 精美的Hero区域展示
 * 2. 多种问答模式选择
 * 3. 实时进度和计时系统
 * 4. 流畅的答题交互体验
 * 5. 成绩统计与成就系统
 * 6. 历史记录可视化
 * 
 * @author Cloud Zoo Team
 * @version 3.0.0
 */
<template>
  <AppLayout>
    <div class="quiz-page">
      <!-- Hero区域 -->
      <section v-if="!quizStore.isQuizActive && !showFinalResult" class="hero-section">
        <div class="hero-background">
          <div class="hero-gradient"></div>
          <div class="hero-pattern"></div>
        </div>
        
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-icon">🎯</span>
            <span class="badge-text">知识挑战</span>
          </div>
          
          <h1 class="hero-title">
            动物<span class="highlight">知识问答</span>
          </h1>
          
          <p class="hero-description">
            探索神奇的动物世界，测试你的知识储备，解锁专属成就徽章
          </p>
          
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-icon">📚</span>
              <div class="stat-content">
                <span class="stat-value">{{ totalQuestions }}</span>
                <span class="stat-label">题库总数</span>
              </div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-icon">🏆</span>
              <div class="stat-content">
                <span class="stat-value">{{ quizStore.history.length }}</span>
                <span class="stat-label">挑战次数</span>
              </div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-icon">⭐</span>
              <div class="stat-content">
                <span class="stat-value">{{ averageAccuracy }}%</span>
                <span class="stat-label">平均正确率</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 问答模式选择 -->
      <section v-if="!quizStore.isQuizActive && !showFinalResult" class="modes-section">
        <div class="section-header">
          <h2 class="section-title">选择挑战模式</h2>
          <p class="section-subtitle">不同难度，不同挑战，证明你的实力</p>
        </div>
        
        <div class="modes-grid">
          <div 
            v-for="mode in quizModes" 
            :key="mode.id"
            class="mode-card"
            :class="mode.id"
            @click="startQuiz(mode)"
          >
            <div class="mode-glow"></div>
            
            <div class="mode-header">
              <div class="mode-icon-wrapper">
                <span class="mode-icon">{{ mode.icon }}</span>
              </div>
              <span class="mode-badge">{{ mode.difficulty }}</span>
            </div>
            
            <h3 class="mode-title">{{ mode.title }}</h3>
            <p class="mode-description">{{ mode.description }}</p>
            
            <div class="mode-features">
              <div class="feature">
                <span class="feature-icon">📝</span>
                <span class="feature-text">{{ mode.questionCount }} 道题目</span>
              </div>
              <div class="feature">
                <span class="feature-icon">⏱️</span>
                <span class="feature-text">{{ formatTimeLimit(mode.timeLimit) }}</span>
              </div>
              <div class="feature">
                <span class="feature-icon">💎</span>
                <span class="feature-text">{{ mode.points }} 积分</span>
              </div>
            </div>
            
            <button class="mode-start-btn">
              <span class="btn-text">开始挑战</span>
              <span class="btn-icon">→</span>
            </button>
          </div>
        </div>

        <!-- 历史记录 -->
        <div v-if="quizStore.history.length > 0" class="history-section">
          <div class="section-header">
            <h2 class="section-title">挑战记录</h2>
            <button class="view-all-btn" @click="showAllHistory = !showAllHistory">
              {{ showAllHistory ? '收起' : '查看全部' }}
              <span class="btn-arrow">{{ showAllHistory ? '↑' : '↓' }}</span>
            </button>
          </div>
          
          <div class="history-grid">
            <div 
              v-for="record in displayHistory" 
              :key="record.id" 
              class="history-card"
            >
              <div class="history-header">
                <span class="history-mode">{{ getModeLabel(record.type) }}</span>
                <span class="history-date">{{ formatDate(record.completedAt) }}</span>
              </div>
              
              <div class="history-score">
                <div class="score-circle" :class="getScoreClass(record.accuracy)">
                  <svg viewBox="0 0 36 36" class="score-svg">
                    <path
                      class="score-bg"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      class="score-fill"
                      :stroke-dasharray="`${record.accuracy}, 100`"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span class="score-text">{{ record.accuracy }}%</span>
                </div>
              </div>
              
              <div class="history-details">
                <div class="detail">
                  <span class="detail-label">正确</span>
                  <span class="detail-value correct">{{ record.score }}</span>
                </div>
                <div class="detail">
                  <span class="detail-label">错误</span>
                  <span class="detail-value wrong">{{ record.total - record.score }}</span>
                </div>
                <div class="detail">
                  <span class="detail-label">用时</span>
                  <span class="detail-value">{{ formatTime(record.timeSpent || 0) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 问答进行中 -->
      <section v-if="quizStore.isQuizActive" class="quiz-active-section">
        <div class="quiz-container">
          <!-- 顶部信息栏 -->
          <div class="quiz-header">
            <div class="header-left">
              <span class="quiz-mode-badge">{{ currentModeLabel }}</span>
              <span class="question-counter">
                第 {{ quizStore.currentQuestionIndex + 1 }} / {{ quizStore.totalQuestions }} 题
              </span>
            </div>
            
            <div class="header-center">
              <div class="progress-bar-wrapper">
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: quizStore.progress + '%' }"
                  >
                    <div class="progress-glow"></div>
                  </div>
                </div>
                <div class="progress-markers">
                  <span 
                    v-for="i in quizStore.totalQuestions" 
                    :key="i"
                    class="marker"
                    :class="{ 
                      active: i <= quizStore.currentQuestionIndex + 1,
                      correct: answeredQuestions[i-1]?.isCorrect,
                      wrong: answeredQuestions[i-1] && !answeredQuestions[i-1]?.isCorrect
                    }"
                  ></span>
                </div>
              </div>
            </div>
            
            <div class="header-right">
              <div class="timer" :class="{ warning: quizStore.timeRemaining < 60 }">
                <span class="timer-icon">⏱️</span>
                <span class="timer-value">{{ formatTime(quizStore.timeRemaining) }}</span>
              </div>
              <div class="current-score">
                <span class="score-icon">💎</span>
                <span class="score-value">{{ currentScore }}</span>
              </div>
            </div>
          </div>

          <!-- 题目卡片 -->
          <div class="question-card" v-if="quizStore.currentQuestion">
            <div class="question-background">
              <div class="bg-pattern"></div>
            </div>
            
            <div class="question-content">
              <div class="question-meta">
                <span class="category-badge">
                  <span class="category-icon">{{ getCategoryIcon(quizStore.currentQuestion.category) }}</span>
                  {{ quizStore.currentQuestion.category }}
                </span>
                <span class="points-badge">+{{ questionPoints }} 分</span>
              </div>
              
              <h2 class="question-text">{{ quizStore.currentQuestion.question }}</h2>
              
              <!-- 选项列表 -->
              <div class="options-grid">
                <button
                  v-for="(option, index) in quizStore.currentQuestion.options"
                  :key="index"
                  class="option-btn"
                  :class="[ 
                    { selected: selectedAnswer === index },
                    { correct: showResult && index === quizStore.currentQuestion.correctAnswer },
                    { wrong: showResult && selectedAnswer === index && index !== quizStore.currentQuestion.correctAnswer }
                  ]"
                  :disabled="showResult"
                  @click="selectAnswer(index)"
                >
                  <div class="option-indicator">
                    <span class="option-letter">{{ String.fromCharCode(65 + index) }}</span>
                    <transition name="check-fade">
                      <span v-if="showResult && index === quizStore.currentQuestion.correctAnswer" class="check-icon correct">✓</span>
                      <span v-else-if="showResult && selectedAnswer === index && index !== quizStore.currentQuestion.correctAnswer" class="check-icon wrong">✕</span>
                    </transition>
                  </div>
                  <span class="option-text">{{ option }}</span>
                </button>
              </div>

              <!-- 答案解析 -->
              <transition name="slide-up">
                <div v-if="showResult" class="result-panel">
                  <div class="result-header" :class="isCorrect ? 'correct' : 'wrong'">
                    <span class="result-icon">{{ isCorrect ? '🎉' : '😔' }}</span>
                    <span class="result-text">{{ isCorrect ? '回答正确！' : '回答错误' }}</span>
                    <span class="result-points" v-if="isCorrect">+{{ questionPoints }}分</span>
                  </div>
                  
                  <div v-if="quizStore.currentQuestion.explanation" class="explanation-box">
                    <div class="explanation-header">
                      <span class="exp-icon">💡</span>
                      <span class="exp-title">知识解析</span>
                    </div>
                    <p class="explanation-text">{{ quizStore.currentQuestion.explanation }}</p>
                  </div>
                  
                  <button class="next-btn" @click="nextQuestion">
                    <span class="btn-text">{{ quizStore.isLastQuestion ? '查看成绩' : '下一题' }}</span>
                    <span class="btn-icon">→</span>
                  </button>
                </div>
              </transition>
            </div>
          </div>

          <!-- 底部操作栏 -->
          <div v-if="!showResult" class="quiz-actions">
            <button class="action-btn skip" @click="skipQuestion">
              <span class="btn-icon">⏭️</span>
              <span class="btn-text">跳过此题</span>
            </button>
            <button 
              class="action-btn submit" 
              :disabled="selectedAnswer === null"
              @click="submitAnswer"
            >
              <span class="btn-icon">✓</span>
              <span class="btn-text">提交答案</span>
            </button>
          </div>
        </div>
      </section>

      <!-- 结果展示 -->
      <section v-if="showFinalResult" class="result-section">
        <div class="result-container">
          <div class="result-background">
            <div class="bg-gradient"></div>
            <div class="bg-pattern"></div>
          </div>
          
          <div class="result-content">
            <!-- 成绩展示 -->
            <div class="achievement-display">
              <div class="achievement-icon-wrapper">
                <span class="achievement-icon">{{ resultEmoji }}</span>
                <div class="icon-ring"></div>
              </div>
              
              <h2 class="result-title">{{ resultTitle }}</h2>
              <p class="result-subtitle">{{ resultSubtitle }}</p>
            </div>

            <!-- 统计数据 -->
            <div class="stats-grid">
              <div class="stat-card score">
                <div class="stat-icon-wrapper">
                  <span class="stat-icon">💎</span>
                </div>
                <div class="stat-info">
                  <span class="stat-value">{{ totalScore }}</span>
                  <span class="stat-label">总得分</span>
                </div>
              </div>
              
              <div class="stat-card accuracy">
                <div class="stat-icon-wrapper">
                  <span class="stat-icon">🎯</span>
                </div>
                <div class="stat-info">
                  <span class="stat-value">{{ quizStore.accuracy }}%</span>
                  <span class="stat-label">正确率</span>
                </div>
                <div class="accuracy-bar">
                  <div class="accuracy-fill" :style="{ width: quizStore.accuracy + '%' }"></div>
                </div>
              </div>
              
              <div class="stat-card correct">
                <div class="stat-icon-wrapper">
                  <span class="stat-icon">✓</span>
                </div>
                <div class="stat-info">
                  <span class="stat-value">{{ quizStore.correctCount }}</span>
                  <span class="stat-label">正确题数</span>
                </div>
              </div>
              
              <div class="stat-card time">
                <div class="stat-icon-wrapper">
                  <span class="stat-icon">⏱️</span>
                </div>
                <div class="stat-info">
                  <span class="stat-value">{{ formatTime(timeSpent) }}</span>
                  <span class="stat-label">用时</span>
                </div>
              </div>
            </div>

            <!-- 解锁成就 -->
            <transition name="achievement-pop">
              <div v-if="unlockedAchievements.length > 0" class="unlocked-achievements">
                <h3 class="achievements-title">
                  <span class="title-icon">🏆</span>
                  解锁成就
                </h3>
                <div class="achievements-list">
                  <div 
                    v-for="achievement in unlockedAchievements" 
                    :key="achievement.id"
                    class="achievement-badge"
                  >
                    <span class="badge-icon">{{ achievement.icon }}</span>
                    <span class="badge-name">{{ achievement.name }}</span>
                  </div>
                </div>
              </div>
            </transition>

            <!-- 操作按钮 -->
            <div class="result-actions">
              <button class="action-btn retry" @click="retryQuiz">
                <span class="btn-icon">🔄</span>
                <span class="btn-text">再试一次</span>
              </button>
              <router-link to="/" class="action-btn home">
                <span class="btn-icon">🏠</span>
                <span class="btn-text">返回首页</span>
              </router-link>
              <router-link to="/animals" class="action-btn explore">
                <span class="btn-icon">🐾</span>
                <span class="btn-text">探索动物</span>
              </router-link>
            </div>
          </div>
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<script>
import { ref, computed, onUnmounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useQuizStore } from '@/stores/quiz'
import { useUserStore } from '@/stores/user'
import { useNotificationStore } from '@/stores/notification'

export default {
  name: 'QuizView',
  
  components: {
    AppLayout
  },
  
  setup() {
    const quizStore = useQuizStore()
    const userStore = useUserStore()
    const notificationStore = useNotificationStore()

    const selectedAnswer = ref(null)
    const showResult = ref(false)
    const isCorrect = ref(false)
    const showFinalResult = ref(false)
    const showAllHistory = ref(false)
    const answeredQuestions = ref({})
    const currentScore = ref(0)
    const timeSpent = ref(0)
    const startTime = ref(null)
    const unlockedAchievements = ref([])
    const currentMode = ref(null)
    let timer = null
    let timeTimer = null

    const quizModes = ref([
      {
        id: 'quick',
        title: '快速问答',
        icon: '⚡',
        description: '快速测试，轻松入门',
        difficulty: '简单',
        questionCount: 5,
        timeLimit: 300,
        points: 50
      },
      {
        id: 'standard',
        title: '标准模式',
        icon: '📚',
        description: '全面考察，稳步提升',
        difficulty: '中等',
        questionCount: 10,
        timeLimit: 600,
        points: 100
      },
      {
        id: 'challenge',
        title: '挑战模式',
        icon: '🏆',
        description: '终极挑战，证明实力',
        difficulty: '困难',
        questionCount: 20,
        timeLimit: 1200,
        points: 200
      }
    ])

    const questionBank = ref([
      {
        id: 1,
        category: '哺乳动物',
        question: '大熊猫的主要食物是什么？',
        options: ['肉类', '竹子', '水果', '昆虫'],
        correctAnswer: 1,
        explanation: '大熊猫99%的食物是竹子，每天需要吃12-38公斤的竹子来满足能量需求。'
      },
      {
        id: 2,
        category: '鸟类',
        question: '企鹅主要生活在哪个地区？',
        options: ['北极', '南极', '热带', '温带'],
        correctAnswer: 1,
        explanation: '企鹅主要生活在南半球，尤其是南极地区，已适应寒冷环境。'
      },
      {
        id: 3,
        category: '哺乳动物',
        question: '地球上最大的动物是什么？',
        options: ['非洲象', '蓝鲸', '长颈鹿', '北极熊'],
        correctAnswer: 1,
        explanation: '蓝鲸是地球上最大的动物，体长可达30米，体重可达180吨。'
      },
      {
        id: 4,
        category: '爬行动物',
        question: '鳄鱼是冷血动物还是温血动物？',
        options: ['温血动物', '冷血动物', '两者都是', '两者都不是'],
        correctAnswer: 1,
        explanation: '鳄鱼是爬行动物，属于冷血动物（变温动物），需要靠外界环境调节体温。'
      },
      {
        id: 5,
        category: '海洋生物',
        question: '海豚是用什么呼吸的？',
        options: ['鳃', '肺', '皮肤', '气管'],
        correctAnswer: 1,
        explanation: '海豚是哺乳动物，用肺呼吸，需要定期浮出水面换气。'
      },
      {
        id: 6,
        category: '昆虫',
        question: '蜜蜂跳舞是为了什么？',
        options: ['求偶', '传递食物位置信息', '驱赶敌人', '庆祝'],
        correctAnswer: 1,
        explanation: '蜜蜂通过"8字舞"来告诉同伴食物的方向和距离，这是它们独特的沟通方式。'
      },
      {
        id: 7,
        category: '哺乳动物',
        question: '长颈鹿的脖子有多少节颈椎？',
        options: ['5节', '7节', '12节', '20节'],
        correctAnswer: 1,
        explanation: '长颈鹿和大多数哺乳动物一样有7节颈椎，只是每节都很长。'
      },
      {
        id: 8,
        category: '鸟类',
        question: '鸵鸟会飞吗？',
        options: ['会飞', '不会飞', '只能滑翔', '偶尔会飞'],
        correctAnswer: 1,
        explanation: '鸵鸟是不会飞的鸟类，但它们跑得很快，时速可达70公里。'
      },
      {
        id: 9,
        category: '海洋生物',
        question: '章鱼有几颗心脏？',
        options: ['1颗', '2颗', '3颗', '4颗'],
        correctAnswer: 2,
        explanation: '章鱼有3颗心脏：1颗主心脏泵血到全身，2颗鳃心脏泵血到鳃。'
      },
      {
        id: 10,
        category: '哺乳动物',
        question: '猎豹的最高时速约为多少？',
        options: ['60公里/小时', '80公里/小时', '110公里/小时', '150公里/小时'],
        correctAnswer: 2,
        explanation: '猎豹是陆地上跑得最快的动物，最高时速可达110-120公里。'
      },
      {
        id: 11,
        category: '哺乳动物',
        question: '大象的孕期大约是多长时间？',
        options: ['6个月', '12个月', '22个月', '30个月'],
        correctAnswer: 2,
        explanation: '大象的孕期约为22个月，是陆生哺乳动物中最长的。'
      },
      {
        id: 12,
        category: '鸟类',
        question: '蜂鸟有什么独特的能力？',
        options: ['可以倒飞', '可以游泳', '可以变色', '可以冬眠'],
        correctAnswer: 0,
        explanation: '蜂鸟是唯一能够倒飞的鸟类，它们可以悬停在空中甚至向后飞行。'
      },
      {
        id: 13,
        category: '爬行动物',
        question: '变色龙变色主要是为了什么？',
        options: ['伪装躲避天敌', '表达情绪', '调节体温', '以上都是'],
        correctAnswer: 3,
        explanation: '变色龙变色有多种功能：伪装、表达情绪、调节体温和交流。'
      },
      {
        id: 14,
        category: '海洋生物',
        question: '海马有什么独特的特点？',
        options: ['雄性负责育儿', '没有尾巴', '会发光', '有翅膀'],
        correctAnswer: 0,
        explanation: '海马是少数由雄性负责孕育后代的动物，雄海马有育儿袋。'
      },
      {
        id: 15,
        category: '昆虫',
        question: '蝴蝶的寿命一般有多长？',
        options: ['几天到几周', '几个月', '一年', '几年'],
        correctAnswer: 0,
        explanation: '大多数蝴蝶的寿命只有几天到几周，但有些种类可以存活几个月。'
      },
      {
        id: 16,
        category: '哺乳动物',
        question: '蝙蝠是什么类型的动物？',
        options: ['鸟类', '哺乳动物', '爬行动物', '昆虫'],
        correctAnswer: 1,
        explanation: '蝙蝠是唯一能够真正飞行的哺乳动物，它们用肺呼吸，胎生哺乳。'
      },
      {
        id: 17,
        category: '鸟类',
        question: '猫头鹰可以在白天看清东西吗？',
        options: ['可以', '不可以', '只能看清近处', '只能看清远处'],
        correctAnswer: 0,
        explanation: '虽然猫头鹰主要在夜间活动，但它们在白天也能看清东西。'
      },
      {
        id: 18,
        category: '海洋生物',
        question: '鲨鱼的骨骼是由什么组成的？',
        options: ['骨头', '软骨', '硬骨', '角质'],
        correctAnswer: 1,
        explanation: '鲨鱼属于软骨鱼类，它们的骨骼由软骨组成，而不是硬骨。'
      },
      {
        id: 19,
        category: '哺乳动物',
        question: '考拉主要吃什么？',
        options: ['竹子', '桉树叶', '水果', '昆虫'],
        correctAnswer: 1,
        explanation: '考拉主要吃桉树叶，每天需要吃大量的桉树叶来获取能量和水分。'
      },
      {
        id: 20,
        category: '爬行动物',
        question: '蛇为什么经常吐舌头？',
        options: ['威吓敌人', '嗅闻气味', '调节体温', '清洁口腔'],
        correctAnswer: 1,
        explanation: '蛇通过吐舌头来收集空气中的气味分子，然后用犁鼻器分析气味。'
      },
      {
        id: 21,
        category: '哺乳动物',
        question: '北极熊的毛是什么颜色的？',
        options: ['白色', '透明', '浅黄色', '浅灰色'],
        correctAnswer: 1,
        explanation: '北极熊的毛实际上是透明的，看起来是白色是因为光线的反射。'
      },
      {
        id: 22,
        category: '鸟类',
        question: '世界上飞得最快的鸟是什么？',
        options: ['老鹰', '雨燕', '游隼', '信天翁'],
        correctAnswer: 2,
        explanation: '游隼是世界上飞得最快的鸟，俯冲时速可达300公里以上。'
      },
      {
        id: 23,
        category: '哺乳动物',
        question: '大象的耳朵主要有什么作用？',
        options: ['听觉', '散热', '威吓', '交流'],
        correctAnswer: 1,
        explanation: '大象的耳朵主要用来散热，通过扇动耳朵来调节体温。'
      },
      {
        id: 24,
        category: '海洋生物',
        question: '鲨鱼有多少排牙齿？',
        options: ['1排', '2-3排', '5-15排', '20排以上'],
        correctAnswer: 2,
        explanation: '鲨鱼有5-15排牙齿，前排牙齿脱落后，后排牙齿会向前移动补充。'
      },
      {
        id: 25,
        category: '昆虫',
        question: '萤火虫发光的目的是什么？',
        options: ['照明', '求偶', '驱赶敌人', '吸引猎物'],
        correctAnswer: 1,
        explanation: '萤火虫发光主要是为了求偶，不同种类的萤火虫有不同的闪光模式。'
      },
      {
        id: 26,
        category: '哺乳动物',
        question: '河马的汗液是什么颜色的？',
        options: ['无色', '红色', '黄色', '蓝色'],
        correctAnswer: 1,
        explanation: '河马的汗液是红色的，含有天然防晒成分，被称为"血汗"。'
      },
      {
        id: 27,
        category: '爬行动物',
        question: '海龟的性别由什么决定？',
        options: ['基因', '孵化温度', '父母体型', '食物种类'],
        correctAnswer: 1,
        explanation: '海龟的性别由孵化温度决定，温度高孵化出雌性，温度低孵化出雄性。'
      },
      {
        id: 28,
        category: '鸟类',
        question: '火烈鸟为什么是粉红色的？',
        options: ['天生如此', '食物中的色素', '环境反射', '基因突变'],
        correctAnswer: 1,
        explanation: '火烈鸟的粉红色来自食物中的类胡萝卜素，主要是虾和藻类。'
      },
      {
        id: 29,
        category: '哺乳动物',
        question: '长颈鹿每天只睡多长时间？',
        options: ['8小时', '5小时', '2小时', '30分钟'],
        correctAnswer: 3,
        explanation: '长颈鹿每天只睡约30分钟，是哺乳动物中睡眠时间最短的之一。'
      },
      {
        id: 30,
        category: '海洋生物',
        question: '章鱼的血液是什么颜色的？',
        options: ['红色', '蓝色', '绿色', '无色'],
        correctAnswer: 1,
        explanation: '章鱼的血液是蓝色的，因为它们使用铜基血蓝蛋白运输氧气。'
      }
    ])

    const totalQuestions = computed(() => questionBank.value.length)

    const averageAccuracy = computed(() => {
      if (quizStore.history.length === 0) return 0
      const total = quizStore.history.reduce((sum, record) => sum + record.accuracy, 0)
      return Math.round(total / quizStore.history.length)
    })

    const displayHistory = computed(() => {
      return showAllHistory.value 
        ? quizStore.history 
        : quizStore.history.slice(0, 4)
    })

    const currentModeLabel = computed(() => {
      if (!currentMode.value) return ''
      const mode = quizModes.value.find(m => m.id === currentMode.value)
      return mode?.title || ''
    })

    const questionPoints = computed(() => 10)

    const totalScore = computed(() => quizStore.correctCount * 10)

    const resultEmoji = computed(() => {
      const accuracy = quizStore.accuracy
      if (accuracy >= 90) return '🏆'
      if (accuracy >= 80) return '🎉'
      if (accuracy >= 60) return '😊'
      if (accuracy >= 40) return '😐'
      return '😔'
    })

    const resultTitle = computed(() => {
      const accuracy = quizStore.accuracy
      if (accuracy >= 90) return '太棒了！你是动物专家！'
      if (accuracy >= 80) return '优秀！知识渊博！'
      if (accuracy >= 60) return '不错！继续加油！'
      if (accuracy >= 40) return '还需要多学习哦！'
      return '再接再厉！'
    })

    const resultSubtitle = computed(() => {
      const accuracy = quizStore.accuracy
      if (accuracy >= 90) return '你对动物世界了如指掌，令人敬佩！'
      if (accuracy >= 80) return '你的动物知识储备很丰富！'
      if (accuracy >= 60) return '你已经掌握了不错的动物知识！'
      if (accuracy >= 40) return '继续探索，你会发现更多精彩！'
      return '不要灰心，每次挑战都是进步的机会！'
    })

    const startQuiz = (mode) => {
      currentMode.value = mode.id
      const shuffled = [...questionBank.value].sort(() => Math.random() - 0.5)
      const questions = shuffled.slice(0, mode.questionCount)

      quizStore.startQuiz({
        questions,
        timeLimit: mode.timeLimit,
        type: mode.id
      })

      startTime.value = Date.now()
      answeredQuestions.value = {}
      currentScore.value = 0
      unlockedAchievements.value = []

      timer = setInterval(() => {
        quizStore.timeRemaining--
        if (quizStore.timeRemaining <= 0) {
          clearInterval(timer)
          clearInterval(timeTimer)
          timeSpent.value = Math.floor((Date.now() - startTime.value) / 1000)
          quizStore.endQuiz(timeSpent.value)
          showFinalResult.value = true
          finalizeQuiz()
        }
      }, 1000)

      timeTimer = setInterval(() => {
        timeSpent.value = Math.floor((Date.now() - startTime.value) / 1000)
      }, 1000)
    }

    const selectAnswer = (index) => {
      if (!showResult.value) {
        selectedAnswer.value = index
      }
    }

    const submitAnswer = () => {
      if (selectedAnswer.value === null) return

      const result = quizStore.submitAnswer(selectedAnswer.value)
      isCorrect.value = result.isCorrect
      showResult.value = true

      answeredQuestions.value[quizStore.currentQuestionIndex] = {
        isCorrect: result.isCorrect
      }

      if (isCorrect.value) {
        currentScore.value += 10
        notificationStore.success('回答正确！+10分')
      } else {
        notificationStore.error('回答错误')
      }
    }

    const nextQuestion = () => {
      if (quizStore.isLastQuestion) {
        clearInterval(timer)
        clearInterval(timeTimer)
        timeSpent.value = Math.floor((Date.now() - startTime.value) / 1000)
        quizStore.endQuiz(timeSpent.value)
        showFinalResult.value = true
        finalizeQuiz()
      } else {
        quizStore.currentQuestionIndex++
        selectedAnswer.value = null
        showResult.value = false
      }
    }

    const skipQuestion = () => {
      answeredQuestions.value[quizStore.currentQuestionIndex] = {
        isCorrect: false
      }
      
      const question = quizStore.currentQuestion
      if (question) {
        quizStore.answers.push({
          questionId: question.id,
          questionIndex: quizStore.currentQuestionIndex,
          answer: -1,
          correctAnswer: question.correctAnswer,
          isCorrect: false,
          skipped: true,
          timestamp: new Date().toISOString()
        })
      }
      
      selectedAnswer.value = null
      showResult.value = false

      if (quizStore.isLastQuestion) {
        clearInterval(timer)
        clearInterval(timeTimer)
        timeSpent.value = Math.floor((Date.now() - startTime.value) / 1000)
        quizStore.endQuiz(timeSpent.value)
        showFinalResult.value = true
        finalizeQuiz()
      } else {
        quizStore.currentQuestionIndex++
      }
    }

    const finalizeQuiz = () => {
      userStore.addQuizScore(quizStore.score)
      
      const progress = Math.min(100, (userStore.stats.quizCompleted / 10) * 100)
      userStore.updateAchievementProgress(3, progress)
      
      checkAchievements()
    }

    const retryQuiz = () => {
      quizStore.resetQuiz()
      selectedAnswer.value = null
      showResult.value = false
      showFinalResult.value = false
      currentMode.value = null
      answeredQuestions.value = {}
      currentScore.value = 0
      timeSpent.value = 0
      unlockedAchievements.value = []
    }

    const checkAchievements = () => {
      const stats = quizStore.getStatistics()
      
      if (stats.totalQuizzes >= 1 && !userStore.hasAchievement(5)) {
        const achievement = {
          id: 5,
          name: '问答新手',
          icon: '🎯',
          description: '完成首次问答'
        }
        userStore.unlockAchievement(achievement)
        unlockedAchievements.value.push(achievement)
      }

      if (quizStore.accuracy >= 80 && !userStore.hasAchievement(6)) {
        const achievement = {
          id: 6,
          name: '知识达人',
          icon: '🧠',
          description: '问答正确率达到80%'
        }
        userStore.unlockAchievement(achievement)
        unlockedAchievements.value.push(achievement)
      }

      if (quizStore.accuracy === 100 && !userStore.hasAchievement(7)) {
        const achievement = {
          id: 7,
          name: '完美答题',
          icon: '⭐',
          description: '问答全部正确'
        }
        userStore.unlockAchievement(achievement)
        unlockedAchievements.value.push(achievement)
      }

      if (unlockedAchievements.value.length > 0) {
        notificationStore.success('🎉 解锁新成就！')
      }
    }

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const formatTimeLimit = (seconds) => {
      const mins = Math.floor(seconds / 60)
      return `${mins} 分钟`
    }

    const formatDate = (dateStr) => {
      return new Date(dateStr).toLocaleDateString('zh-CN')
    }

    const getModeLabel = (type) => {
      const mode = quizModes.value.find(m => m.id === type)
      return mode?.title || type
    }

    const getCategoryIcon = (category) => {
      const icons = {
        '哺乳动物': '🦁',
        '鸟类': '🦅',
        '爬行动物': '🦎',
        '海洋生物': '🐠',
        '昆虫': '🦋'
      }
      return icons[category] || '🐾'
    }

    const getScoreClass = (accuracy) => {
      if (accuracy >= 80) return 'excellent'
      if (accuracy >= 60) return 'good'
      if (accuracy >= 40) return 'average'
      return 'poor'
    }

    onUnmounted(() => {
      if (timer) clearInterval(timer)
      if (timeTimer) clearInterval(timeTimer)
    })

    return {
      quizStore,
      quizModes,
      selectedAnswer,
      showResult,
      isCorrect,
      showFinalResult,
      showAllHistory,
      answeredQuestions,
      currentScore,
      timeSpent,
      unlockedAchievements,
      currentMode,
      totalQuestions,
      averageAccuracy,
      displayHistory,
      currentModeLabel,
      questionPoints,
      totalScore,
      resultEmoji,
      resultTitle,
      resultSubtitle,
      startQuiz,
      selectAnswer,
      submitAnswer,
      nextQuestion,
      skipQuestion,
      retryQuiz,
      formatTime,
      formatTimeLimit,
      formatDate,
      getModeLabel,
      getCategoryIcon,
      getScoreClass
    }
  }
}
</script>

<style scoped>
.quiz-page {
  min-height: 100vh;
  background: #fcf9f2;
}

/* Hero区域 */
.hero-section {
  position: relative;
  padding: 80px 64px;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.hero-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(21, 66, 18, 0.05) 0%, rgba(157, 208, 144, 0.1) 100%);
}

.hero-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(21, 66, 18, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(0, 96, 172, 0.06) 0%, transparent 50%);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: rgba(21, 66, 18, 0.1);
  border-radius: 9999px;
  margin-bottom: 24px;
}

.badge-icon {
  font-size: 20px;
}

.badge-text {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #154212;
  letter-spacing: 0.05em;
}

.hero-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 48px;
  font-weight: 700;
  color: #154212;
  margin-bottom: 16px;
  line-height: 1.2;
}

.hero-title .highlight {
  background: linear-gradient(135deg, #154212 0%, #0060ac 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  color: rgba(28, 28, 24, 0.7);
  margin-bottom: 48px;
  line-height: 1.6;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 48px;
  padding: 32px;
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(21, 66, 18, 0.1);
  box-shadow: 0px 4px 20px rgba(45, 90, 39, 0.08);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  font-size: 32px;
}

.stat-content {
  text-align: left;
}

.stat-value {
  font-family: 'Quicksand', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #154212;
  display: block;
}

.stat-label {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: rgba(28, 28, 24, 0.6);
}

.stat-divider {
  width: 1px;
  height: 48px;
  background: rgba(21, 66, 18, 0.15);
}

/* 模式选择区域 */
.modes-section {
  padding: 0 64px 80px;
  max-width: 1280px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #154212;
  margin-bottom: 12px;
}

.section-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: rgba(28, 28, 24, 0.6);
}

.modes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-bottom: 64px;
}

.mode-card {
  position: relative;
  background: #ffffff;
  border-radius: 24px;
  padding: 32px;
  border: 1px solid rgba(21, 66, 18, 0.1);
  box-shadow: 0px 4px 20px rgba(45, 90, 39, 0.08);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.mode-card:hover {
  transform: translateY(-8px);
  box-shadow: 0px 20px 40px rgba(45, 90, 39, 0.15);
  border-color: rgba(21, 66, 18, 0.2);
}

.mode-card.quick .mode-glow {
  background: radial-gradient(circle, rgba(255, 193, 7, 0.15) 0%, transparent 70%);
}

.mode-card.standard .mode-glow {
  background: radial-gradient(circle, rgba(0, 96, 172, 0.15) 0%, transparent 70%);
}

.mode-card.challenge .mode-glow {
  background: radial-gradient(circle, rgba(21, 66, 18, 0.15) 0%, transparent 70%);
}

.mode-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.mode-card:hover .mode-glow {
  opacity: 1;
}

.mode-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.mode-icon-wrapper {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, rgba(21, 66, 18, 0.1) 0%, rgba(157, 208, 144, 0.15) 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mode-icon {
  font-size: 32px;
}

.mode-badge {
  padding: 6px 14px;
  background: rgba(21, 66, 18, 0.1);
  color: #154212;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
}

.mode-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #154212;
  margin-bottom: 8px;
}

.mode-description {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: rgba(28, 28, 24, 0.6);
  margin-bottom: 24px;
}

.mode-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: rgba(28, 28, 24, 0.7);
}

.feature-icon {
  font-size: 18px;
}

.mode-start-btn {
  width: 100%;
  padding: 14px 24px;
  background: #154212;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.mode-start-btn:hover {
  background: #2d5a27;
}

.mode-start-btn .btn-icon {
  transition: transform 0.3s ease;
}

.mode-card:hover .mode-start-btn .btn-icon {
  transform: translateX(4px);
}

/* 历史记录 */
.history-section {
  margin-top: 48px;
}

.history-section .section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
}

.view-all-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: transparent;
  border: 1px solid rgba(21, 66, 18, 0.2);
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #154212;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-all-btn:hover {
  background: rgba(21, 66, 18, 0.08);
}

.history-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.history-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(21, 66, 18, 0.1);
  transition: all 0.3s ease;
}

.history-card:hover {
  box-shadow: 0px 8px 24px rgba(45, 90, 39, 0.1);
}

.history-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.history-mode {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #154212;
}

.history-date {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: rgba(28, 28, 24, 0.5);
}

.history-score {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.score-circle {
  position: relative;
  width: 80px;
  height: 80px;
}

.score-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.score-bg {
  fill: none;
  stroke: rgba(21, 66, 18, 0.1);
  stroke-width: 3;
}

.score-fill {
  fill: none;
  stroke: #154212;
  stroke-width: 3;
  stroke-linecap: round;
  transition: stroke-dasharray 0.5s ease;
}

.score-circle.excellent .score-fill {
  stroke: #154212;
}

.score-circle.good .score-fill {
  stroke: #0060ac;
}

.score-circle.average .score-fill {
  stroke: #ff9800;
}

.score-circle.poor .score-fill {
  stroke: #ba1a1a;
}

.score-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Quicksand', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #154212;
}

.history-details {
  display: flex;
  justify-content: space-around;
}

.detail {
  text-align: center;
}

.detail-label {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: rgba(28, 28, 24, 0.5);
  display: block;
  margin-bottom: 4px;
}

.detail-value {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #1c1c18;
}

.detail-value.correct {
  color: #154212;
}

.detail-value.wrong {
  color: #ba1a1a;
}

/* 问答进行中 */
.quiz-active-section {
  padding: 48px 64px;
  max-width: 1000px;
  margin: 0 auto;
}

.quiz-container {
  background: #ffffff;
  border-radius: 24px;
  padding: 32px;
  border: 1px solid rgba(21, 66, 18, 0.1);
  box-shadow: 0px 8px 32px rgba(45, 90, 39, 0.1);
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(21, 66, 18, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.quiz-mode-badge {
  padding: 8px 16px;
  background: rgba(21, 66, 18, 0.1);
  color: #154212;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
}

.question-counter {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: rgba(28, 28, 24, 0.6);
}

.header-center {
  flex: 1;
  max-width: 400px;
  margin: 0 32px;
}

.progress-bar-wrapper {
  position: relative;
}

.progress-bar {
  height: 8px;
  background: rgba(21, 66, 18, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #154212 0%, #9dd090 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
  position: relative;
}

.progress-glow {
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.5) 100%);
}

.progress-markers {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}

.marker {
  width: 8px;
  height: 8px;
  background: rgba(21, 66, 18, 0.15);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.marker.active {
  background: #154212;
}

.marker.correct {
  background: #154212;
  box-shadow: 0 0 8px rgba(21, 66, 18, 0.5);
}

.marker.wrong {
  background: #ba1a1a;
  box-shadow: 0 0 8px rgba(186, 26, 26, 0.5);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.timer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(0, 96, 172, 0.1);
  border-radius: 10px;
}

.timer.warning {
  background: rgba(186, 26, 26, 0.1);
  animation: pulse-warning 1s infinite;
}

@keyframes pulse-warning {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.timer-icon {
  font-size: 18px;
}

.timer-value {
  font-family: 'Quicksand', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #0060ac;
}

.timer.warning .timer-value {
  color: #ba1a1a;
}

.current-score {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(21, 66, 18, 0.1);
  border-radius: 10px;
}

.score-icon {
  font-size: 18px;
}

.current-score .score-value {
  font-family: 'Quicksand', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #154212;
}

/* 题目卡片 */
.question-card {
  position: relative;
  margin-bottom: 32px;
}

.question-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  overflow: hidden;
}

.bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(21, 66, 18, 0.02) 0%, rgba(0, 96, 172, 0.02) 100%);
}

.question-content {
  position: relative;
  padding: 32px;
}

.question-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.category-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(21, 66, 18, 0.1);
  color: #154212;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
}

.category-icon {
  font-size: 18px;
}

.points-badge {
  padding: 8px 16px;
  background: rgba(0, 96, 172, 0.1);
  color: #0060ac;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
}

.question-text {
  font-family: 'Inter', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #1c1c18;
  margin-bottom: 32px;
  line-height: 1.5;
}

/* 选项 */
.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.option-btn {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: #fcf9f2;
  border: 2px solid rgba(21, 66, 18, 0.1);
  border-radius: 16px;
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: all 0.3s ease;
}

.option-btn:hover:not(:disabled) {
  background: rgba(21, 66, 18, 0.05);
  border-color: rgba(21, 66, 18, 0.3);
  transform: translateY(-2px);
}

.option-btn.selected {
  background: rgba(21, 66, 18, 0.1);
  border-color: #154212;
  box-shadow: 0px 4px 16px rgba(21, 66, 18, 0.15);
}

.option-btn.correct {
  background: rgba(21, 66, 18, 0.15);
  border-color: #154212;
}

.option-btn.wrong {
  background: rgba(186, 26, 26, 0.15);
  border-color: #ba1a1a;
}

.option-indicator {
  position: relative;
  width: 40px;
  height: 40px;
  background: rgba(21, 66, 18, 0.15);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.option-btn.selected .option-indicator {
  background: #154212;
}

.option-btn.correct .option-indicator {
  background: #154212;
}

.option-btn.wrong .option-indicator {
  background: #ba1a1a;
}

.option-letter {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #154212;
}

.option-btn.selected .option-letter,
.option-btn.correct .option-letter,
.option-btn.wrong .option-letter {
  color: #ffffff;
}

.check-icon {
  position: absolute;
  font-size: 20px;
}

.check-icon.correct {
  color: #ffffff;
}

.check-icon.wrong {
  color: #ffffff;
}

.option-text {
  flex: 1;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: #1c1c18;
}

.check-fade-enter-active,
.check-fade-leave-active {
  transition: all 0.3s ease;
}

.check-fade-enter-from {
  opacity: 0;
  transform: scale(0);
}

/* 结果面板 */
.result-panel {
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid rgba(21, 66, 18, 0.1);
}

.result-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.result-header.correct {
  color: #154212;
}

.result-header.wrong {
  color: #ba1a1a;
}

.result-icon {
  font-size: 28px;
}

.result-text {
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 600;
}

.result-points {
  margin-left: auto;
  padding: 6px 14px;
  background: rgba(21, 66, 18, 0.15);
  color: #154212;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
}

.explanation-box {
  background: rgba(28, 28, 24, 0.03);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.explanation-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.exp-icon {
  font-size: 20px;
}

.exp-title {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #154212;
}

.explanation-text {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(28, 28, 24, 0.8);
}

.next-btn {
  width: 100%;
  padding: 16px 24px;
  background: #154212;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.next-btn:hover {
  background: #2d5a27;
}

.next-btn .btn-icon {
  transition: transform 0.3s ease;
}

.next-btn:hover .btn-icon {
  transform: translateX(4px);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 操作按钮 */
.quiz-actions {
  display: flex;
  gap: 16px;
}

.action-btn {
  flex: 1;
  padding: 16px 24px;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.action-btn.skip {
  background: transparent;
  border: 2px solid rgba(28, 28, 24, 0.2);
  color: rgba(28, 28, 24, 0.7);
}

.action-btn.skip:hover {
  border-color: rgba(28, 28, 24, 0.4);
  background: rgba(28, 28, 24, 0.03);
}

.action-btn.submit {
  background: #154212;
  color: #ffffff;
  border: none;
}

.action-btn.submit:hover:not(:disabled) {
  background: #2d5a27;
}

.action-btn.submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 结果展示 */
.result-section {
  padding: 80px 64px;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-container {
  position: relative;
  width: 100%;
  max-width: 800px;
}

.result-background {
  position: absolute;
  top: -40px;
  left: -40px;
  right: -40px;
  bottom: -40px;
  border-radius: 40px;
  overflow: hidden;
  z-index: 0;
}

.bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(21, 66, 18, 0.05) 0%, rgba(157, 208, 144, 0.1) 100%);
}

.result-content {
  position: relative;
  z-index: 1;
  background: #ffffff;
  border-radius: 32px;
  padding: 48px;
  border: 1px solid rgba(21, 66, 18, 0.1);
  box-shadow: 0px 20px 60px rgba(45, 90, 39, 0.15);
}

.achievement-display {
  text-align: center;
  margin-bottom: 48px;
}

.achievement-icon-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 24px;
}

.achievement-icon {
  font-size: 80px;
  display: block;
}

.icon-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  border: 3px solid rgba(21, 66, 18, 0.2);
  border-radius: 50%;
  animation: ring-pulse 2s infinite;
}

@keyframes ring-pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.5; }
}

.result-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 36px;
  font-weight: 700;
  color: #154212;
  margin-bottom: 12px;
}

.result-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: rgba(28, 28, 24, 0.6);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: #fcf9f2;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  background: rgba(21, 66, 18, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}

.stat-card .stat-icon {
  font-size: 24px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-card .stat-value {
  font-family: 'Quicksand', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #154212;
}

.stat-card .stat-label {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: rgba(28, 28, 24, 0.6);
}

.accuracy-bar {
  height: 4px;
  background: rgba(21, 66, 18, 0.1);
  border-radius: 2px;
  margin-top: 12px;
  overflow: hidden;
}

.accuracy-fill {
  height: 100%;
  background: #154212;
  border-radius: 2px;
  transition: width 0.5s ease;
}

/* 解锁成就 */
.unlocked-achievements {
  background: rgba(21, 66, 18, 0.05);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
}

.achievements-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Quicksand', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #154212;
  margin-bottom: 16px;
}

.title-icon {
  font-size: 24px;
}

.achievements-list {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.achievement-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid rgba(21, 66, 18, 0.15);
}

.achievement-badge .badge-icon {
  font-size: 24px;
}

.achievement-badge .badge-name {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #154212;
}

.achievement-pop-enter-active {
  animation: achievement-pop-in 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes achievement-pop-in {
  0% { opacity: 0; transform: scale(0.8) translateY(20px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

/* 结果操作按钮 */
.result-actions {
  display: flex;
  gap: 16px;
}

.result-actions .action-btn {
  padding: 16px 32px;
}

.result-actions .action-btn.retry {
  background: #154212;
  color: #ffffff;
  border: none;
}

.result-actions .action-btn.retry:hover {
  background: #2d5a27;
}

.result-actions .action-btn.home {
  background: transparent;
  border: 2px solid rgba(21, 66, 18, 0.3);
  color: #154212;
  text-decoration: none;
}

.result-actions .action-btn.home:hover {
  background: rgba(21, 66, 18, 0.08);
}

.result-actions .action-btn.explore {
  background: #0060ac;
  color: #ffffff;
  border: none;
  text-decoration: none;
}

.result-actions .action-btn.explore:hover {
  background: #005090;
}

/* 响应式 */
@media (max-width: 1024px) {
  .modes-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 48px 20px;
  }
  
  .hero-title {
    font-size: 32px;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 24px;
  }
  
  .stat-divider {
    width: 100%;
    height: 1px;
  }
  
  .modes-section {
    padding: 0 20px 48px;
  }
  
  .modes-grid {
    grid-template-columns: 1fr;
  }
  
  .quiz-active-section {
    padding: 24px 20px;
  }
  
  .quiz-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .header-center {
    margin: 0;
    max-width: 100%;
  }
  
  .options-grid {
    grid-template-columns: 1fr;
  }
  
  .result-section {
    padding: 48px 20px;
  }
  
  .result-content {
    padding: 32px 24px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .result-actions {
    flex-direction: column;
  }
}
</style>
