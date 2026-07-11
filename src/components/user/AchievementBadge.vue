<template>
  <div 
    class="achievement-badge"
    :class="[`size-${size}`, { unlocked: achievement.unlocked }]"
  >
    <div class="badge-icon-wrapper">
      <span class="badge-icon">{{ achievement.icon || '🏆' }}</span>
      <div v-if="!achievement.unlocked" class="lock-overlay">
        🔒
      </div>
    </div>
    
    <div v-if="showDetails" class="badge-details">
      <h4 class="badge-title">{{ achievement.name }}</h4>
      <p class="badge-description">{{ achievement.description }}</p>
      <div v-if="achievement.progress !== undefined" class="badge-progress">
        <div 
          class="progress-fill"
          :style="{ width: `${achievement.progress}%` }"
        ></div>
        <span class="progress-text">{{ achievement.progress }}%</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AchievementBadge',
  
  props: {
    achievement: {
      type: Object,
      required: true
    },
    size: {
      type: String,
      default: 'medium',
      validator: (v) => ['small', 'medium', 'large'].includes(v)
    },
    showDetails: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped>
.achievement-badge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid rgba(21, 66, 18, 0.1);
  transition: all 0.3s ease;
}

.achievement-badge.unlocked {
  background: linear-gradient(135deg, #ffffff 0%, rgba(21, 66, 18, 0.05) 100%);
  border-color: #154212;
}

.badge-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.badge-icon {
  display: block;
}

.lock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.badge-details {
  flex: 1;
  min-width: 0;
}

.badge-title {
  font-family: 'Quicksand', sans-serif;
  font-weight: 600;
  color: #1c1c18;
  margin-bottom: 4px;
}

.badge-description {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: rgba(28, 28, 24, 0.6);
  line-height: 1.4;
  margin-bottom: 8px;
}

.badge-progress {
  position: relative;
  height: 6px;
  background: rgba(21, 66, 18, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #154212;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  right: 0;
  top: -16px;
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  color: rgba(28, 28, 24, 0.6);
}

.size-small {
  padding: 8px 12px;
}

.size-small .badge-icon-wrapper {
  width: 32px;
  height: 32px;
}

.size-small .badge-icon {
  font-size: 20px;
}

.size-small .badge-title {
  font-size: 12px;
}

.size-small .badge-description {
  display: none;
}

.size-small .badge-progress {
  display: none;
}

.size-medium {
  padding: 12px 16px;
}

.size-medium .badge-icon-wrapper {
  width: 48px;
  height: 48px;
}

.size-medium .badge-icon {
  font-size: 28px;
}

.size-medium .badge-title {
  font-size: 14px;
}

.size-large {
  padding: 16px 20px;
}

.size-large .badge-icon-wrapper {
  width: 64px;
  height: 64px;
}

.size-large .badge-icon {
  font-size: 36px;
}

.size-large .badge-title {
  font-size: 18px;
}
</style>
