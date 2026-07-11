/**
 * 个人中心视图组件
 * 
 * 功能说明：
 * 1. 用户资料展示与编辑
 * 2. 成就徽章展示
 * 3. 收藏动物列表
 * 4. 统计数据展示
 * 
 * @author Cloud Zoo Team
 * @version 2.1.0
 */
<template>
  <AppLayout>
    <div class="profile-view">
      <!-- 用户资料卡片 -->
      <section class="profile-card">
        <div class="avatar-section">
          <div class="avatar">{{ profile.avatar || '👤' }}</div>
          <button class="edit-btn" @click="openEditModal">编辑资料</button>
        </div>
        <div class="profile-info">
          <h1 class="profile-name">{{ profile.name }}</h1>
          <p class="profile-email">{{ profile.email }}</p>
          <div class="profile-stats">
            <div class="stat">
              <span class="stat-value">{{ userStore.stats.animalsViewed }}</span>
              <span class="stat-label">浏览动物</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ userStore.stats.quizScore }}</span>
              <span class="stat-label">问答得分</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ userStore.unlockedAchievements.length }}</span>
              <span class="stat-label">解锁成就</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 成就徽章 -->
      <section class="achievements-section">
        <h2 class="section-title">我的成就</h2>
        <div class="achievements-grid">
          <AchievementBadge
            v-for="achievement in achievements"
            :key="achievement.id"
            :achievement="achievement"
          />
        </div>
      </section>

      <!-- 收藏动物 -->
      <section class="favorites-section">
        <h2 class="section-title">我的收藏</h2>
        <div v-if="favoriteAnimals.length > 0" class="favorites-grid">
          <AnimalCard
            v-for="animal in favoriteAnimals"
            :key="animal.id"
            :animal="animal"
            @click="handleAnimalClick"
          />
        </div>
        <div v-else class="empty-state">
          <span class="empty-icon">💔</span>
          <p>还没有收藏任何动物</p>
          <router-link to="/animals" class="link-btn">去逛逛</router-link>
        </div>
      </section>

      <!-- 答题历史 -->
      <section class="history-section">
        <h2 class="section-title">答题历史</h2>
        <div v-if="quizStore.history.length > 0" class="history-list">
          <div v-for="record in quizStore.history.slice(0, 5)" :key="record.id" class="history-item">
            <div class="history-info">
              <span class="history-type">{{ record.type }}</span>
              <span class="history-date">{{ formatDate(record.completedAt) }}</span>
            </div>
            <div class="history-score">
              <span class="score">{{ record.score }}/{{ record.total }}</span>
              <span class="accuracy">{{ record.accuracy }}%</span>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <span class="empty-icon">📝</span>
          <p>还没有答题记录</p>
          <router-link to="/quiz" class="link-btn">开始答题</router-link>
        </div>
      </section>

      <!-- 编辑资料模态框 -->
      <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">编辑资料</h2>
            <button class="close-btn" @click="closeEditModal">×</button>
          </div>
          
          <form @submit.prevent="saveProfile" class="edit-form">
            <div class="form-group">
              <label class="form-label">昵称</label>
              <input 
                v-model="editForm.name"
                type="text" 
                class="form-input"
                placeholder="请输入昵称"
                maxlength="20"
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">邮箱</label>
              <input 
                v-model="editForm.email"
                type="email" 
                class="form-input"
                placeholder="请输入邮箱"
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">头像</label>
              <div class="avatar-selector">
                <div 
                  v-for="avatar in avatarOptions" 
                  :key="avatar"
                  class="avatar-option"
                  :class="{ selected: editForm.avatar === avatar }"
                  @click="editForm.avatar = avatar"
                >
                  {{ avatar }}
                </div>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn-cancel" @click="closeEditModal">取消</button>
              <button type="submit" class="btn-save">保存</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import AchievementBadge from '@/components/user/AchievementBadge.vue'
import AnimalCard from '@/components/animal/AnimalCard.vue'
import { useUserStore } from '@/stores/user'
import { useQuizStore } from '@/stores/quiz'
import { useAnimalStore } from '@/stores/animal'

export default {
  name: 'ProfileView',
  
  components: {
    AppLayout,
    AchievementBadge,
    AnimalCard
  },
  
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const quizStore = useQuizStore()
    const animalStore = useAnimalStore()

    const profile = ref({
      name: '动物爱好者',
      email: 'visitor@cloudzoo.com',
      avatar: null
    })

    const showEditModal = ref(false)
    
    const editForm = ref({
      name: '',
      email: '',
      avatar: null
    })

    const avatarOptions = [
      '👤', '🦁', '🐯', '🐘', '🦒', '🐼', '🦊', '🐻', '🐨', '🦝'
    ]

    const achievements = computed(() => userStore.achievements)

    const favoriteAnimals = computed(() => {
      return animalStore.animals.filter(a => 
        userStore.favorites.includes(a.id)
      )
    })

    const openEditModal = () => {
      editForm.value = {
        name: profile.value.name,
        email: profile.value.email,
        avatar: profile.value.avatar
      }
      showEditModal.value = true
    }

    const closeEditModal = () => {
      showEditModal.value = false
    }

    const saveProfile = () => {
      if (!editForm.value.name.trim()) {
        alert('请输入昵称')
        return
      }
      
      if (!editForm.value.email.trim()) {
        alert('请输入邮箱')
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(editForm.value.email)) {
        alert('请输入有效的邮箱地址')
        return
      }

      profile.value = {
        name: editForm.value.name.trim(),
        email: editForm.value.email.trim(),
        avatar: editForm.value.avatar
      }
      
      userStore.setProfile(profile.value)
      
      closeEditModal()
      
      alert('资料更新成功！')
    }

    const handleAnimalClick = (animal) => {
      router.push(`/animals/${animal.id}`)
    }

    const formatDate = (dateStr) => {
      return new Date(dateStr).toLocaleDateString('zh-CN')
    }

    onMounted(() => {
      if (userStore.profile) {
        profile.value = userStore.profile
      }
      
      if (userStore.achievements.length === 0) {
        userStore.setAchievements([
          { id: 1, name: '初来乍到', icon: '🌟', description: '首次访问动物园', unlocked: true, progress: 100 },
          { id: 2, name: '动物爱好者', icon: '🦁', description: '浏览10种动物', unlocked: false, progress: 40 },
          { id: 3, name: '问答达人', icon: '🎓', description: '完成10次问答', unlocked: false, progress: 20 },
          { id: 4, name: '收藏家', icon: '❤️', description: '收藏5种动物', unlocked: false, progress: 0 }
        ])
      }
    })

    return {
      profile,
      achievements,
      favoriteAnimals,
      userStore,
      quizStore,
      showEditModal,
      editForm,
      avatarOptions,
      openEditModal,
      closeEditModal,
      saveProfile,
      handleAnimalClick,
      formatDate
    }
  }
}
</script>

<style scoped>
.profile-view {
  max-width: 1280px;
  margin: 0 auto;
  padding: 48px 64px;
}

.profile-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 32px;
  display: flex;
  gap: 32px;
  margin-bottom: 48px;
  border: 1px solid rgba(21, 66, 18, 0.1);
  box-shadow: 0px 4px 20px rgba(45, 90, 39, 0.08);
}

.avatar-section {
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(21, 66, 18, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60px;
  margin-bottom: 16px;
}

.edit-btn {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid rgba(21, 66, 18, 0.3);
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #154212;
  font-weight: 600;
}

.edit-btn:hover {
  background: rgba(21, 66, 18, 0.08);
  border-color: #154212;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-family: 'Quicksand', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #154212;
  margin-bottom: 8px;
}

.profile-email {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: rgba(28, 28, 24, 0.6);
  margin-bottom: 24px;
}

.profile-stats {
  display: flex;
  gap: 32px;
}

.stat {
  text-align: center;
}

.stat-value {
  font-family: 'Quicksand', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #154212;
  display: block;
}

.stat-label {
  font-size: 14px;
  color: rgba(28, 28, 24, 0.6);
}

.section-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #154212;
  margin-bottom: 24px;
}

.achievements-section,
.favorites-section,
.history-section {
  margin-bottom: 48px;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.empty-state {
  text-align: center;
  padding: 48px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid rgba(21, 66, 18, 0.1);
}

.empty-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 16px;
  color: rgba(28, 28, 24, 0.6);
  margin-bottom: 24px;
}

.link-btn {
  padding: 12px 24px;
  background: #154212;
  color: #ffffff;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
}

.link-btn:hover {
  background: #2d5a27;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(21, 66, 18, 0.1);
}

.history-info {
  display: flex;
  gap: 16px;
}

.history-type {
  font-weight: 600;
  color: #154212;
}

.history-date {
  color: rgba(28, 28, 24, 0.5);
  font-size: 14px;
}

.history-score {
  display: flex;
  gap: 12px;
}

.score {
  font-weight: 600;
  color: #0060ac;
}

.accuracy {
  color: rgba(28, 28, 24, 0.6);
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: #ffffff;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  padding: 32px;
  box-shadow: 0px 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.modal-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #154212;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(21, 66, 18, 0.1);
  border: none;
  font-size: 24px;
  color: #154212;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(21, 66, 18, 0.2);
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #154212;
}

.form-input {
  padding: 12px 16px;
  border: 1px solid rgba(21, 66, 18, 0.2);
  border-radius: 8px;
  font-size: 16px;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #0060ac;
  box-shadow: 0px 0px 0px 3px rgba(0, 96, 172, 0.1);
}

.avatar-selector {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.avatar-option {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(21, 66, 18, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.avatar-option:hover {
  background: rgba(21, 66, 18, 0.15);
  transform: scale(1.1);
}

.avatar-option.selected {
  border-color: #154212;
  background: rgba(21, 66, 18, 0.2);
  transform: scale(1.1);
}

.form-actions {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}

.btn-cancel,
.btn-save {
  flex: 1;
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-cancel {
  background: rgba(21, 66, 18, 0.1);
  color: #154212;
}

.btn-cancel:hover {
  background: rgba(21, 66, 18, 0.15);
}

.btn-save {
  background: #154212;
  color: #ffffff;
}

.btn-save:hover {
  background: #2d5a27;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .profile-view {
    padding: 24px 20px;
  }

  .profile-card {
    flex-direction: column;
    align-items: center;
  }

  .achievements-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .favorites-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    padding: 24px;
    margin: 20px;
  }

  .avatar-selector {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
