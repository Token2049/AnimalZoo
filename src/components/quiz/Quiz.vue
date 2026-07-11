/**
 * 动物知识问答组件
 * 
 * 功能说明：
 * 1. 展示问答题目
 * 2. 计时功能
 * 3. 答题反馈
 * 4. 成绩统计
 * 
 * @author Cloud Zoo Team
 * @version 2.0.0
 */
<template>
  <div class="quiz-container">
    <div class="quiz-header">
      <h2 class="quiz-title">动物知识问答</h2>
      <div class="quiz-info">
        <span class="question-count">题目 {{ currentIndex + 1 }}/{{ questions.length }}</span>
        <span class="timer">⏱️ {{ formatTime(timeLeft) }}</span>
        <span class="score">得分: {{ score }}</span>
      </div>
    </div>

    <div v-if="!completed" class="question-section">
      <div class="question-card">
        <p class="question-text">{{ currentQuestion.question }}</p>
        
        <div class="options-list">
          <button
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            class="option-btn"
            :class="{ 
              selected: selectedAnswer === index,
              correct: showAnswer && index === currentQuestion.correctIndex,
              wrong: showAnswer && selectedAnswer === index && index !== currentQuestion.correctIndex
            }"
            :disabled="showAnswer"
            @click="selectAnswer(index)"
          >
            <span class="option-letter">{{ ['A', 'B', 'C', 'D'][index] }}</span>
            <span class="option-text">{{ option }}</span>
          </button>
        </div>

        <div v-if="showAnswer" class="answer-feedback">
          <p :class="isCorrect ? 'correct-text' : 'wrong-text'">
            {{ isCorrect ? '✅ 回答正确！' : '❌ 回答错误' }}
          </p>
          <p class="explanation">{{ currentQuestion.explanation }}</p>
          <button class="next-btn" @click="nextQuestion">
            {{ currentIndex < questions.length - 1 ? '下一题' : '查看结果' }}
          </button>
        </div>
      </div>

      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      </div>
    </div>

    <div v-else class="result-section">
      <div class="result-card">
        <h3 class="result-title">答题完成！</h3>
        <div class="result-stats">
          <div class="stat-item">
            <span class="stat-value">{{ score }}</span>
            <span class="stat-label">总得分</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ correctCount }}/{{ questions.length }}</span>
            <span class="stat-label">正确率</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ formatTime(totalTime - timeLeft) }}</span>
            <span class="stat-label">用时</span>
          </div>
        </div>
        <div class="result-actions">
          <button class="retry-btn" @click="restartQuiz">重新答题</button>
          <router-link to="/profile" class="profile-link">查看成就</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useQuizStore } from '@/stores/quiz'
import { useUserStore } from '@/stores/user'
import { useNotificationStore } from '@/stores/notification'

export default {
  name: 'Quiz',
  
  setup() {
    const quizStore = useQuizStore()
    const userStore = useUserStore()
    const notificationStore = useNotificationStore()

    const currentIndex = ref(0)
    const selectedAnswer = ref(null)
    const showAnswer = ref(false)
    const score = ref(0)
    const correctCount = ref(0)
    const completed = ref(false)
    const timeLeft = ref(300)
    const totalTime = 300
    let timer = null

    const questions = ref([
      {
        question: '大熊猫主要生活在哪个地区？',
        options: ['非洲', '中国西南地区', '南美洲', '东南亚'],
        correctIndex: 1,
        explanation: '大熊猫是中国特有的珍稀动物，主要分布在四川、陕西和甘肃的山区。'
      },
      {
        question: '以下哪种动物是现存最大的陆生哺乳动物？',
        options: ['非洲象', '长颈鹿', '河马', '犀牛'],
        correctIndex: 0,
        explanation: '非洲象是现存陆地上最大的哺乳动物，成年雄象体重可达6吨。'
      },
      {
        question: '帝企鹅主要生活在哪个地区？',
        options: ['北极', '南极', '非洲', '亚洲'],
        correctIndex: 1,
        explanation: '帝企鹅是南极特有的企鹅物种，是企鹅家族中个体最大的。'
      },
      {
        question: '以下哪种动物的保护状态是"濒危"？',
        options: ['非洲狮', '大熊猫', '长颈鹿', '斑马'],
        correctIndex: 1,
        explanation: '大熊猫被列为濒危物种，经过多年保护，数量已有所回升。'
      },
      {
        question: '长颈鹿最显著的特征是什么？',
        options: ['长鼻子', '长脖子', '长尾巴', '长腿'],
        correctIndex: 1,
        explanation: '长颈鹿以其超长的脖子闻名，是世界上现存最高的陆生动物。'
      }
    ])

    const currentQuestion = computed(() => questions.value[currentIndex.value])
    
    const isCorrect = computed(() => 
      selectedAnswer.value === currentQuestion.value.correctIndex
    )

    const progressPercent = computed(() => 
      ((currentIndex.value + 1) / questions.value.length) * 100
    )

    const selectAnswer = (index) => {
      if (showAnswer.value) return
      selectedAnswer.value = index
      showAnswer.value = true
      
      if (isCorrect.value) {
        score.value += 20
        correctCount.value++
        notificationStore.success('回答正确！+20分')
      } else {
        notificationStore.error('回答错误')
      }
    }

    const nextQuestion = () => {
      if (currentIndex.value < questions.value.length - 1) {
        currentIndex.value++
        selectedAnswer.value = null
        showAnswer.value = false
      } else {
        completeQuiz()
      }
    }

    const completeQuiz = () => {
      completed.value = true
      clearInterval(timer)
      
      quizStore.addHistory({
        type: '动物知识问答',
        score: score.value,
        total: questions.value.length * 20,
        accuracy: Math.round((correctCount.value / questions.value.length) * 100),
        completedAt: new Date().toISOString()
      })
      
      userStore.addQuizScore(score.value)
      notificationStore.success(`答题完成！总得分: ${score.value}`)
    }

    const restartQuiz = () => {
      currentIndex.value = 0
      selectedAnswer.value = null
      showAnswer.value = false
      score.value = 0
      correctCount.value = 0
      completed.value = false
      timeLeft.value = 300
      startTimer()
    }

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const startTimer = () => {
      timer = setInterval(() => {
        if (timeLeft.value > 0) {
          timeLeft.value--
        } else {
          completeQuiz()
        }
      }, 1000)
    }

    onMounted(() => {
      startTimer()
    })

    onUnmounted(() => {
      clearInterval(timer)
    })

    return {
      currentIndex,
      questions,
      currentQuestion,
      selectedAnswer,
      showAnswer,
      isCorrect,
      score,
      correctCount,
      completed,
      timeLeft,
      totalTime,
      progressPercent,
      selectAnswer,
      nextQuestion,
      restartQuiz,
      formatTime
    }
  }
}
</script>

<style scoped>
.quiz-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 32px;
}

.quiz-header {
  margin-bottom: 32px;
}

.quiz-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #154212;
  margin-bottom: 16px;
}

.quiz-info {
  display: flex;
  gap: 24px;
  font-size: 14px;
  color: rgba(28, 28, 24, 0.6);
}

.question-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  border: 1px solid rgba(21, 66, 18, 0.1);
  box-shadow: 0px 4px 20px rgba(45, 90, 39, 0.08);
}

.question-text {
  font-size: 20px;
  font-weight: 600;
  color: #1c1c18;
  margin-bottom: 24px;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-btn {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: rgba(21, 66, 18, 0.05);
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.option-btn:hover:not(:disabled) {
  background: rgba(21, 66, 18, 0.1);
}

.option-btn.selected {
  border-color: #0060ac;
  background: rgba(0, 96, 172, 0.1);
}

.option-btn.correct {
  border-color: #154212;
  background: rgba(21, 66, 18, 0.15);
}

.option-btn.wrong {
  border-color: #ba1a1a;
  background: rgba(186, 26, 26, 0.1);
}

.option-letter {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #154212;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.option-text {
  flex: 1;
  font-size: 16px;
}

.answer-feedback {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(21, 66, 18, 0.1);
}

.correct-text {
  color: #154212;
  font-weight: 600;
  font-size: 18px;
}

.wrong-text {
  color: #ba1a1a;
  font-weight: 600;
  font-size: 18px;
}

.explanation {
  margin-top: 12px;
  color: rgba(28, 28, 24, 0.7);
  line-height: 1.6;
}

.next-btn {
  margin-top: 16px;
  padding: 12px 32px;
  background: #154212;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.progress-bar {
  height: 8px;
  background: rgba(21, 66, 18, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #154212;
  transition: width 0.3s ease;
}

.result-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 48px;
  text-align: center;
  border: 1px solid rgba(21, 66, 18, 0.1);
}

.result-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #154212;
  margin-bottom: 32px;
}

.result-stats {
  display: flex;
  justify-content: center;
  gap: 48px;
  margin-bottom: 32px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-family: 'Quicksand', sans-serif;
  font-size: 36px;
  font-weight: 700;
  color: #154212;
  display: block;
}

.stat-label {
  font-size: 14px;
  color: rgba(28, 28, 24, 0.6);
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.retry-btn {
  padding: 16px 32px;
  background: #154212;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.profile-link {
  padding: 16px 32px;
  background: transparent;
  border: 2px solid #154212;
  color: #154212;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
}
</style>
