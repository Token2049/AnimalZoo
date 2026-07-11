/**
 * Pinia Store 入口文件
 * 集中管理所有状态模块
 * 
 * 功能说明：
 * 1. 创建Pinia实例
 * 2. 配置持久化插件
 * 3. 导出Pinia实例
 * 
 * @author Cloud Zoo Team
 * @version 2.1.0
 */
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

export default pinia
