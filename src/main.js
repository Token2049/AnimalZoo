/**
 * Vue 应用入口文件
 * 
 * 功能说明：
 * 1. 创建Vue应用实例
 * 2. 注册全局插件（Pinia、Router）
 * 3. 注册全局自定义指令
 * 4. 挂载应用到DOM
 * 
 * @author Cloud Zoo Team
 * @version 2.0.0
 */

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import lazyLoadDirective from './directives/lazyLoad'

// 创建Vue应用实例
const app = createApp(App)

// 注册Pinia状态管理
app.use(pinia)

// 注册Vue Router路由
app.use(router)

// 注册全局自定义指令：v-lazy 图片懒加载
app.directive('lazy', lazyLoadDirective)

// 挂载应用到 #app 元素
app.mount('#app')
