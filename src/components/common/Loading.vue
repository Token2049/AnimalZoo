<template>
  <div class="loading" :class="{ fullscreen }">
    <div class="loading-content">
      <div class="spinner">
        <div class="spinner-ring"></div>
        <span class="spinner-icon">🦁</span>
      </div>
      <p v-if="message" class="loading-message">{{ message }}</p>
      <div v-if="showProgress" class="loading-progress">
        <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  
  props: {
    message: {
      type: String,
      default: ''
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    showProgress: {
      type: Boolean,
      default: false
    },
    progress: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped>
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
}

.loading.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(252, 249, 242, 0.95);
  z-index: 9999;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  position: relative;
  width: 64px;
  height: 64px;
}

.spinner-ring {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 4px solid rgba(21, 66, 18, 0.1);
  border-top-color: #154212;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
}

.loading-message {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: #1c1c18;
}

.loading-progress {
  width: 200px;
  height: 8px;
  background: rgba(21, 66, 18, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: #154212;
  border-radius: 4px;
  transition: width 0.3s ease;
}
</style>
