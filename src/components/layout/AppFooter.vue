<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <h4 class="footer-title">Cloud Zoo</h4>
          <p class="footer-desc">
            探索自然奇观，了解野生动物的奇妙世界。我们致力于野生动物保护与教育。
          </p>
        </div>

        <div class="footer-section">
          <h4 class="footer-title">快速链接</h4>
          <nav class="footer-nav">
            <router-link to="/animals" class="footer-link">动物列表</router-link>
            <router-link to="/quiz" class="footer-link">知识问答</router-link>
            <router-link to="/map" class="footer-link">园区地图</router-link>
            <router-link to="/gallery" class="footer-link">相册展示</router-link>
          </nav>
        </div>

        <div class="footer-section">
          <h4 class="footer-title">联系我们</h4>
          <div class="contact-info">
            <p>📍 北京市朝阳区动物园路1号</p>
            <p>📞 010-12345678</p>
            <p>✉️ contact@cloudzoo.com</p>
          </div>
        </div>

        <div class="footer-section">
          <h4 class="footer-title">关注我们</h4>
          <div class="social-links">
            <a href="#" class="social-link">微博</a>
            <a href="#" class="social-link">微信</a>
            <a href="#" class="social-link">抖音</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="copyright">
          © {{ currentYear }} Cloud Zoo. All rights reserved.
        </p>
        <div class="footer-bottom-links">
          <a href="#" class="bottom-link">隐私政策</a>
          <a href="#" class="bottom-link">使用条款</a>
        </div>
      </div>
    </div>

    <slot name="footer-extra"></slot>
  </footer>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'AppFooter',
  
  setup() {
    const currentYear = computed(() => new Date().getFullYear())
    return { currentYear }
  }
}
</script>

<style scoped>
.footer {
  background: #154212;
  color: #ffffff;
  padding: 48px 0 24px;
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 64px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 48px;
  margin-bottom: 48px;
}

.footer-section {
  min-width: 0;
}

.footer-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #9dd090;
}

.footer-desc {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
}

.footer-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #ffffff;
}

.contact-info {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.8);
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-link {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #ffffff;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  transition: background 0.2s ease;
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.2);
}

.footer-bottom {
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.footer-bottom-links {
  display: flex;
  gap: 24px;
}

.bottom-link {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  transition: color 0.2s ease;
}

.bottom-link:hover {
  color: #ffffff;
}

@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .footer-container {
    padding: 0 20px;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
}
</style>
