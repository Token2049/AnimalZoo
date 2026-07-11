/**
 * 路由配置文件
 * 
 * 功能说明：
 * 1. 定义应用路由规则
 * 2. 使用路由懒加载优化性能
 * 3. 配置路由元信息
 * 
 * @author Cloud Zoo Team
 * @version 2.0.0
 */
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '首页 - Cloud Zoo' }
  },
  {
    path: '/animals',
    name: 'Animals',
    component: () => import('@/views/AnimalsView.vue'),
    meta: { title: '动物列表 - Cloud Zoo' }
  },
  {
    path: '/animals/:id',
    name: 'AnimalDetail',
    component: () => import('@/views/AnimalDetailView.vue'),
    meta: { title: '动物详情 - Cloud Zoo' }
  },
  {
    path: '/quiz',
    name: 'Quiz',
    component: () => import('@/views/QuizView.vue'),
    meta: { title: '知识问答 - Cloud Zoo' }
  },
  {
    path: '/map',
    name: 'Map',
    component: () => import('@/views/MapView.vue'),
    meta: { title: '园区地图 - Cloud Zoo' }
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: () => import('@/views/GalleryView.vue'),
    meta: { title: '相册展示 - Cloud Zoo' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { title: '个人中心 - Cloud Zoo' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '页面未找到 - Cloud Zoo' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Cloud Zoo'
  next()
})

export default router
