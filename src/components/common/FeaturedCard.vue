/**
 * 特色卡片组件
 * 用于展示园区特色区域
 * 
 * @author Cloud Zoo Team
 * @version 2.0.0
 */
<template>
  <div class="featured-card" :style="{ borderColor: feature.color }">
    <span class="feature-icon">{{ feature.icon }}</span>
    <h3 class="feature-title">{{ feature.title }}</h3>
    <p class="feature-description">{{ feature.description }}</p>
  </div>
</template>

<script>
export default {
  name: 'FeaturedCard',
  
  props: {
    feature: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.featured-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 32px;
  border: 1px solid rgba(21, 66, 18, 0.1);
  border-left: 4px solid;
  box-shadow: 0px 4px 20px rgba(45, 90, 39, 0.08);
}

.feature-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.feature-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #154212;
  margin-bottom: 8px;
}

.feature-description {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: rgba(28, 28, 24, 0.7);
}
</style>
