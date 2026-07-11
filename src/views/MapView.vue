/**
 * 世界园区地图视图组件 - 动物分布热力图版本
 * 
 * 功能说明：
 * 1. 世界地图可视化
 * 2. 动物分布热力图
 * 3. 数据统计面板
 * 4. 区域筛选功能
 * 5. 交互式探索
 * 
 * @author Cloud Zoo Team
 * @version 4.0.0
 */
<template>
  <AppLayout>
    <div class="world-map-page">
      <!-- Hero区域 -->
      <section class="hero-section">
        <div class="hero-background">
          <div class="hero-gradient"></div>
          <div class="hero-particles">
            <span v-for="i in 20" :key="i" class="particle" :style="getParticleStyle(i)"></span>
          </div>
        </div>
        
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-icon">🌍</span>
            <span class="badge-text">全球视野</span>
          </div>
          
          <h1 class="hero-title">
            世界<span class="highlight">动物分布</span>地图
          </h1>
          
          <p class="hero-description">
            探索全球动物分布，了解珍稀物种的栖息地与保护现状
          </p>
          
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-icon">🗺️</span>
              <div class="stat-content">
                <span class="stat-value">{{ continents.length }}</span>
                <span class="stat-label">大洲分布</span>
              </div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-icon">🐾</span>
              <div class="stat-content">
                <span class="stat-value">{{ totalSpecies }}</span>
                <span class="stat-label">物种数量</span>
              </div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-icon">⚠️</span>
              <div class="stat-content">
                <span class="stat-value">{{ endangeredCount }}</span>
                <span class="stat-label">濒危物种</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 主内容区域 -->
      <section class="main-content">
        <div class="content-container">
          <!-- 左侧：地图区域 -->
          <div class="map-section">
            <!-- 地图控制栏 -->
            <div class="map-controls">
              <div class="controls-left">
                <h2 class="map-title">全球动物分布地图</h2>
              </div>
              
              <div class="controls-right">
                <button class="reset-btn" @click="resetMap">
                  <span class="reset-icon">⟲</span>
                  重置视图
                </button>
              </div>
            </div>

            <!-- Leaflet地图容器 -->
            <div class="map-container">
              <l-map
                ref="map"
                v-model:zoom="zoom"
                v-model:center="center"
                :use-global-leaflet="false"
                :max-bounds="mapBounds"
                :max-bounds-viscosity="1.0"
                :min-zoom="2"
                :max-zoom="10"
                class="leaflet-map"
              >
                <l-tile-layer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  layer-type="base"
                  name="OpenStreetMap"
                  attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                ></l-tile-layer>
                
                <l-marker
                  v-for="marker in filteredMarkers"
                  :key="marker.id"
                  :lat-lng="[marker.lat, marker.lng]"
                  @click="selectMarker(marker)"
                >
                  <l-icon
                    :icon-size="[40, 40]"
                    :icon-anchor="[20, 40]"
                    class-name="custom-marker-icon"
                  >
                    <div class="marker-wrapper" :class="marker.status">
                      <span class="marker-emoji">{{ marker.icon }}</span>
                    </div>
                  </l-icon>
                  <l-popup :options="{ maxWidth: 300, minWidth: 200 }">
                    <div class="marker-popup">
                      <div class="popup-header">
                        <span class="popup-icon">{{ marker.icon }}</span>
                        <div class="popup-title-group">
                          <h3 class="popup-title">{{ marker.name }}</h3>
                          <p class="popup-subtitle">{{ marker.scientificName }}</p>
                        </div>
                      </div>
                      <div class="popup-content">
                        <div class="popup-stat">
                          <span class="stat-label">分布区域：</span>
                          <span class="stat-value">{{ marker.region }}</span>
                        </div>
                        <div class="popup-stat">
                          <span class="stat-label">种群数量：</span>
                          <span class="stat-value">{{ marker.population }}</span>
                        </div>
                        <div class="popup-stat">
                          <span class="stat-label">保护级别：</span>
                          <span class="stat-value status" :class="marker.status">{{ marker.statusLabel }}</span>
                        </div>
                      </div>
                      <button class="popup-btn" @click="exploreSpecies(marker)">
                        查看详情 →
                      </button>
                    </div>
                  </l-popup>
                </l-marker>
              </l-map>
              
              <!-- 图例 -->
              <div class="map-legend">
                <div class="legend-title">图例说明</div>
                <div class="legend-items">
                  <div class="legend-item">
                    <span class="legend-dot safe"></span>
                    <span class="legend-label">安全</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-dot vulnerable"></span>
                    <span class="legend-label">易危</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-dot endangered"></span>
                    <span class="legend-label">濒危</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-dot critical"></span>
                    <span class="legend-label">极危</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：数据面板 -->
          <div class="data-panel">
            <!-- 筛选器 -->
            <div class="panel-filters">
              <div class="filter-group">
                <label class="filter-label">大洲筛选</label>
                <div class="filter-options">
                  <button 
                    v-for="continent in continents" 
                    :key="continent.id"
                    class="filter-chip"
                    :class="{ active: selectedContinent === continent.id }"
                    @click="toggleContinent(continent.id)"
                  >
                    {{ continent.icon }} {{ continent.name }}
                  </button>
                </div>
              </div>
              
              <div class="filter-group">
                <label class="filter-label">保护状态</label>
                <div class="filter-options">
                  <button 
                    v-for="status in conservationStatuses" 
                    :key="status.value"
                    class="filter-chip status"
                    :class="[status.class, { active: selectedStatus === status.value }]"
                    @click="toggleStatus(status.value)"
                  >
                    {{ status.label }}
                  </button>
                </div>
              </div>
            </div>

            <!-- 统计概览 -->
            <div class="stats-overview">
              <h3 class="panel-title">统计概览</h3>
              
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-header">
                    <span class="stat-icon">🦁</span>
                    <span class="stat-name">哺乳动物</span>
                  </div>
                  <div class="stat-body">
                    <span class="stat-number">{{ stats.mammals }}</span>
                    <span class="stat-unit">种</span>
                  </div>
                  <div class="stat-bar">
                    <div class="bar-fill" :style="{ width: (stats.mammals / totalSpecies * 100) + '%' }"></div>
                  </div>
                </div>
                
                <div class="stat-card">
                  <div class="stat-header">
                    <span class="stat-icon">🐦</span>
                    <span class="stat-name">鸟类</span>
                  </div>
                  <div class="stat-body">
                    <span class="stat-number">{{ stats.birds }}</span>
                    <span class="stat-unit">种</span>
                  </div>
                  <div class="stat-bar">
                    <div class="bar-fill" :style="{ width: (stats.birds / totalSpecies * 100) + '%' }"></div>
                  </div>
                </div>
                
                <div class="stat-card">
                  <div class="stat-header">
                    <span class="stat-icon">🐍</span>
                    <span class="stat-name">爬行动物</span>
                  </div>
                  <div class="stat-body">
                    <span class="stat-number">{{ stats.reptiles }}</span>
                    <span class="stat-unit">种</span>
                  </div>
                  <div class="stat-bar">
                    <div class="bar-fill" :style="{ width: (stats.reptiles / totalSpecies * 100) + '%' }"></div>
                  </div>
                </div>
                
                <div class="stat-card">
                  <div class="stat-header">
                    <span class="stat-icon">🐠</span>
                    <span class="stat-name">鱼类</span>
                  </div>
                  <div class="stat-body">
                    <span class="stat-number">{{ stats.fish }}</span>
                    <span class="stat-unit">种</span>
                  </div>
                  <div class="stat-bar">
                    <div class="bar-fill" :style="{ width: (stats.fish / totalSpecies * 100) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 分布图表 -->
            <div class="distribution-chart">
              <h3 class="panel-title">大洲分布</h3>
              <div class="chart-container">
                <div 
                  v-for="continent in continentDistribution" 
                  :key="continent.id"
                  class="chart-bar"
                >
                  <div class="bar-label">
                    <span class="label-icon">{{ continent.icon }}</span>
                    <span class="label-name">{{ continent.name }}</span>
                  </div>
                  <div class="bar-track">
                    <div 
                      class="bar-fill-animated"
                      :style="{ width: continent.percentage + '%' }"
                    >
                      <span class="bar-value">{{ continent.count }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 热门物种 -->
            <div class="hot-species">
              <h3 class="panel-title">热门物种</h3>
              <div class="species-list">
                <div 
                  v-for="species in hotSpeciesList" 
                  :key="species.id"
                  class="species-item"
                  @click="viewSpecies(species)"
                >
                  <div class="species-icon">{{ species.icon }}</div>
                  <div class="species-info">
                    <h4 class="species-name">{{ species.name }}</h4>
                    <p class="species-location">{{ species.location }}</p>
                  </div>
                  <div class="species-status" :class="species.status">
                    {{ species.statusLabel }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 详情弹窗 -->
      <transition name="modal">
        <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
          <div class="modal-content" @click.stop>
            <button class="modal-close" @click="closeDetailModal">✕</button>
            
            <div class="modal-header">
              <div class="modal-icon">{{ selectedMarker?.icon }}</div>
              <div class="modal-title-group">
                <h2 class="modal-title">{{ selectedMarker?.name }}</h2>
                <p class="modal-subtitle">{{ selectedMarker?.scientificName }}</p>
              </div>
            </div>
            
            <div class="modal-body">
              <div class="modal-stats">
                <div class="modal-stat">
                  <span class="stat-label">分布区域</span>
                  <span class="stat-value">{{ selectedMarker?.region }}</span>
                </div>
                <div class="modal-stat">
                  <span class="stat-label">种群数量</span>
                  <span class="stat-value">{{ selectedMarker?.population }}</span>
                </div>
                <div class="modal-stat">
                  <span class="stat-label">保护级别</span>
                  <span class="stat-value status" :class="selectedMarker?.status">
                    {{ selectedMarker?.statusLabel }}
                  </span>
                </div>
              </div>
              
              <div class="modal-description">
                <h4>物种简介</h4>
                <p>{{ selectedMarker?.description }}</p>
              </div>
              
              <div class="modal-threats" v-if="selectedMarker?.threats">
                <h4>主要威胁</h4>
                <div class="threats-list">
                  <span 
                    v-for="threat in selectedMarker.threats" 
                    :key="threat"
                    class="threat-tag"
                  >
                    {{ threat }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="modal-footer">
              <button class="modal-btn secondary" @click="closeDetailModal">
                关闭
              </button>
              <button class="modal-btn primary" @click="exploreSpecies(selectedMarker)">
                查看详情
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </AppLayout>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from '@vue-leaflet/vue-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'WorldMapView',
  
  components: {
    AppLayout,
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LIcon
  },
  
  setup() {
    const router = useRouter()
    
    const map = ref(null)
    const zoom = ref(3)
    const center = ref([20, 0])
    const selectedContinent = ref(null)
    const selectedStatus = ref(null)
    const showDetailModal = ref(false)
    const selectedMarker = ref(null)
    
    const mapBounds = [
      [-90, -180],
      [90, 180]
    ]
    
    const continents = ref([
      { id: 'africa', name: '非洲', icon: '🌍' },
      { id: 'asia', name: '亚洲', icon: '🌏' },
      { id: 'europe', name: '欧洲', icon: '🌍' },
      { id: 'north-america', name: '北美洲', icon: '🌎' },
      { id: 'south-america', name: '南美洲', icon: '🌎' },
      { id: 'oceania', name: '大洋洲', icon: '🌏' }
    ])
    
    const conservationStatuses = ref([
      { value: 'safe', label: '安全', class: 'safe' },
      { value: 'vulnerable', label: '易危', class: 'vulnerable' },
      { value: 'endangered', label: '濒危', class: 'endangered' },
      { value: 'critical', label: '极危', class: 'critical' }
    ])
    
    const stats = ref({
      mammals: 185,
      birds: 246,
      reptiles: 142,
      fish: 328
    })
    
    const animalMarkers = ref([
      {
        id: 1,
        name: '非洲狮',
        icon: '🦁',
        lat: -2.50,
        lng: 34.50,
        status: 'vulnerable',
        statusLabel: '易危',
        scientificName: 'Panthera leo',
        region: '非洲撒哈拉以南',
        population: '约2万只',
        description: '非洲狮是非洲最大的猫科动物，被誉为"草原之王"。它们主要生活在非洲撒哈拉以南的草原和稀树草原地区。',
        threats: ['栖息地丧失', '人类冲突', '猎物减少']
      },
      {
        id: 2,
        name: '大熊猫',
        icon: '🐼',
        lat: 30.50,
        lng: 103.50,
        status: 'vulnerable',
        statusLabel: '易危',
        scientificName: 'Ailuropoda melanoleuca',
        region: '中国四川、陕西、甘肃',
        population: '约1800只',
        description: '大熊猫是中国特有的珍稀动物，被誉为"国宝"。主要栖息在中国西南部的高山竹林中。',
        threats: ['栖息地破碎化', '竹子开花死亡', '气候变化']
      },
      {
        id: 3,
        name: '北极熊',
        icon: '🐻‍❄️',
        lat: 71.00,
        lng: -40.00,
        status: 'vulnerable',
        statusLabel: '易危',
        scientificName: 'Ursus maritimus',
        region: '北极圈',
        population: '约2.5万只',
        description: '北极熊是世界上最大的陆地食肉动物，依赖海冰进行捕猎和繁殖。',
        threats: ['气候变暖', '海冰消融', '污染累积']
      },
      {
        id: 4,
        name: '美洲野牛',
        icon: '🦬',
        lat: 45.00,
        lng: -100.00,
        status: 'safe',
        statusLabel: '安全',
        scientificName: 'Bison bison',
        region: '北美大平原',
        population: '约50万只',
        description: '美洲野牛是北美洲最大的陆地哺乳动物，曾一度濒临灭绝，现已恢复。',
        threats: ['基因多样性降低', '疾病传播']
      },
      {
        id: 5,
        name: '美洲豹',
        icon: '🐆',
        lat: -10.00,
        lng: -65.00,
        status: 'vulnerable',
        statusLabel: '易危',
        scientificName: 'Panthera onca',
        region: '中南美洲热带雨林',
        population: '约17万只',
        description: '美洲豹是美洲最大的猫科动物，是热带雨林生态系统的重要顶级捕食者。',
        threats: ['森林砍伐', '偷猎', '人兽冲突']
      },
      {
        id: 6,
        name: '袋鼠',
        icon: '🦘',
        lat: -25.00,
        lng: 135.00,
        status: 'safe',
        statusLabel: '安全',
        scientificName: 'Macropus',
        region: '澳大利亚',
        population: '数千万只',
        description: '袋鼠是澳大利亚的标志性动物，有多种不同种类，适应各种生态环境。',
        threats: ['栖息地改变', '气候变化']
      },
      {
        id: 7,
        name: '非洲象',
        icon: '🐘',
        lat: -5.00,
        lng: 25.00,
        status: 'endangered',
        statusLabel: '濒危',
        scientificName: 'Loxodonta africana',
        region: '非洲撒哈拉以南',
        population: '约41万只',
        description: '非洲象是现存最大的陆地动物，对非洲生态系统起着关键作用。',
        threats: ['象牙偷猎', '栖息地丧失', '人象冲突']
      },
      {
        id: 8,
        name: '老虎',
        icon: '🐅',
        lat: 25.00,
        lng: 90.00,
        status: 'endangered',
        statusLabel: '濒危',
        scientificName: 'Panthera tigris',
        region: '亚洲南部和东南部',
        population: '约4000只',
        description: '老虎是亚洲最具标志性的大型猫科动物，是森林生态系统的顶级捕食者。',
        threats: ['偷猎', '栖息地破碎化', '猎物减少']
      },
      {
        id: 9,
        name: '犀牛',
        icon: '🦏',
        lat: -20.00,
        lng: 30.00,
        status: 'critical',
        statusLabel: '极危',
        scientificName: 'Rhinocerotidae',
        region: '非洲和南亚',
        population: '约2.7万只',
        description: '犀牛是大型草食性动物，因其犀牛角而遭到严重偷猎。',
        threats: ['犀牛角偷猎', '栖息地丧失', '政治动荡']
      },
      {
        id: 10,
        name: '长颈鹿',
        icon: '🦒',
        lat: -5.00,
        lng: 35.00,
        status: 'vulnerable',
        statusLabel: '易危',
        scientificName: 'Giraffa camelopardalis',
        region: '非洲撒哈拉以南',
        population: '约6.8万只',
        description: '长颈鹿是世界上现存最高的陆生动物，以其独特的长脖子闻名。它们主要生活在非洲的稀树草原和开阔林地。',
        threats: ['栖息地丧失', '偷猎', '人类冲突']
      },
      {
        id: 11,
        name: '帝企鹅',
        icon: '🐧',
        lat: -75.00,
        lng: 0.00,
        status: 'near-threatened',
        statusLabel: '近危',
        scientificName: 'Aptenodytes forsteri',
        region: '南极洲',
        population: '约60万只',
        description: '帝企鹅是企鹅家族中个体最大的物种，也是唯一在南极冬季繁殖的企鹅。它们能够承受极端寒冷的环境。',
        threats: ['气候变化', '海冰减少', '食物短缺']
      },
      {
        id: 12,
        name: '绿海龟',
        icon: '🐢',
        lat: 20.00,
        lng: -160.00,
        status: 'endangered',
        statusLabel: '濒危',
        scientificName: 'Chelonia mydas',
        region: '热带和亚热带海域',
        population: '约8.5万只',
        description: '绿海龟是现存最大的硬壳海龟之一，以其脂肪呈绿色而得名。它们在全球热带和亚热带海域广泛分布。',
        threats: ['海洋污染', '栖息地破坏', '过度捕捞']
      },
      {
        id: 13,
        name: '雪豹',
        icon: '🐆',
        lat: 35.00,
        lng: 80.00,
        status: 'vulnerable',
        statusLabel: '易危',
        scientificName: 'Panthera uncia',
        region: '中亚高山地区',
        population: '约4000-6500只',
        description: '雪豹是一种大型猫科动物，被誉为"雪山之王"。它们生活在海拔2500-5000米的高山地区。',
        threats: ['偷猎', '栖息地丧失', '气候变化']
      },
      {
        id: 14,
        name: '红毛猩猩',
        icon: '🦧',
        lat: 0.00,
        lng: 115.00,
        status: 'critical',
        statusLabel: '极危',
        scientificName: 'Pongo pygmaeus',
        region: '婆罗洲和苏门答腊',
        population: '约10万只',
        description: '红毛猩猩是亚洲唯一的大型猿类，以其红褐色的毛发和极高的智慧著称。',
        threats: ['栖息地丧失', '偷猎', '宠物贸易']
      }
    ])
    
    const continentDistribution = ref([
      { id: 'asia', name: '亚洲', icon: '🌏', count: 312, percentage: 32 },
      { id: 'africa', name: '非洲', icon: '🌍', count: 285, percentage: 29 },
      { id: 'south-america', name: '南美洲', icon: '🌎', count: 198, percentage: 20 },
      { id: 'north-america', name: '北美洲', icon: '🌎', count: 95, percentage: 10 },
      { id: 'oceania', name: '大洋洲', icon: '🌏', count: 62, percentage: 6 },
      { id: 'europe', name: '欧洲', icon: '🌍', count: 49, percentage: 5 }
    ])
    
    const hotSpeciesList = ref([
      { 
        id: 1, 
        icon: '🦁', 
        name: '非洲狮', 
        location: '非洲撒哈拉以南',
        scientificName: 'Panthera leo',
        population: '约2万只',
        status: 'vulnerable', 
        statusLabel: '易危',
        description: '非洲狮是非洲最大的猫科动物，被誉为"草原之王"。它们主要生活在非洲撒哈拉以南的草原和稀树草原地区。',
        threats: ['栖息地丧失', '人类冲突', '猎物减少']
      },
      { 
        id: 2, 
        icon: '🐼', 
        name: '大熊猫', 
        location: '中国四川、陕西、甘肃',
        scientificName: 'Ailuropoda melanoleuca',
        population: '约1800只',
        status: 'vulnerable', 
        statusLabel: '易危',
        description: '大熊猫是中国特有的珍稀动物，被誉为"国宝"。主要栖息在中国西南部的高山竹林中。',
        threats: ['栖息地破碎化', '竹子开花死亡', '气候变化']
      },
      { 
        id: 7, 
        icon: '🐘', 
        name: '非洲象', 
        location: '非洲撒哈拉以南',
        scientificName: 'Loxodonta africana',
        population: '约41万只',
        status: 'endangered', 
        statusLabel: '濒危',
        description: '非洲象是现存最大的陆地动物，对非洲生态系统起着关键作用。',
        threats: ['象牙偷猎', '栖息地丧失', '人象冲突']
      },
      { 
        id: 8, 
        icon: '🐅', 
        name: '老虎', 
        location: '亚洲南部和东南部',
        scientificName: 'Panthera tigris',
        population: '约4000只',
        status: 'endangered', 
        statusLabel: '濒危',
        description: '老虎是亚洲最具标志性的大型猫科动物，是森林生态系统的顶级捕食者。',
        threats: ['偷猎', '栖息地破碎化', '猎物减少']
      },
      { 
        id: 9, 
        icon: '🦏', 
        name: '犀牛', 
        location: '非洲和南亚',
        scientificName: 'Rhinocerotidae',
        population: '约2.7万只',
        status: 'critical', 
        statusLabel: '极危',
        description: '犀牛是大型草食性动物，因其犀牛角而遭到严重偷猎。',
        threats: ['犀牛角偷猎', '栖息地丧失', '政治动荡']
      },
      { 
        id: 10, 
        icon: '🦒', 
        name: '长颈鹿', 
        location: '非洲撒哈拉以南',
        scientificName: 'Giraffa camelopardalis',
        population: '约6.8万只',
        status: 'vulnerable', 
        statusLabel: '易危',
        description: '长颈鹿是世界上现存最高的陆生动物，以其独特的长脖子闻名。',
        threats: ['栖息地丧失', '偷猎', '人类冲突']
      },
      { 
        id: 13, 
        icon: '🐆', 
        name: '雪豹', 
        location: '中亚高山地区',
        scientificName: 'Panthera uncia',
        population: '约4000-6500只',
        status: 'vulnerable', 
        statusLabel: '易危',
        description: '雪豹是一种大型猫科动物，被誉为"雪山之王"。',
        threats: ['偷猎', '栖息地丧失', '气候变化']
      }
    ])
    
    const totalSpecies = computed(() => 
      stats.value.mammals + stats.value.birds + stats.value.reptiles + stats.value.fish
    )
    
    const endangeredCount = computed(() => 156)
    
    const filteredMarkers = computed(() => {
      let markers = animalMarkers.value
      
      if (selectedContinent.value) {
        // 根据大洲筛选（这里简化处理，实际应该根据经纬度判断）
        const continentBounds = {
          'africa': { latMin: -35, latMax: 37, lngMin: -17, lngMax: 51 },
          'asia': { latMin: -10, latMax: 77, lngMin: 60, lngMax: 180 },
          'europe': { latMin: 36, latMax: 71, lngMin: -25, lngMax: 60 },
          'north-america': { latMin: 15, latMax: 72, lngMin: -168, lngMax: -52 },
          'south-america': { latMin: -56, latMax: 13, lngMin: -81, lngMax: -34 },
          'oceania': { latMin: -47, latMax: -10, lngMin: 110, lngMax: 180 }
        }
        
        const bounds = continentBounds[selectedContinent.value]
        if (bounds) {
          markers = markers.filter(m => 
            m.lat >= bounds.latMin && m.lat <= bounds.latMax &&
            m.lng >= bounds.lngMin && m.lng <= bounds.lngMax
          )
        }
      }
      
      if (selectedStatus.value) {
        markers = markers.filter(m => m.status === selectedStatus.value)
      }
      
      return markers
    })
    
    const getParticleStyle = (index) => {
      const size = Math.random() * 4 + 2
      return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${Math.random() * 3 + 2}s`
      }
    }
    
    const resetMap = () => {
      zoom.value = 3
      center.value = [20, 0]
      selectedContinent.value = null
      selectedStatus.value = null
    }
    
    const toggleContinent = (continent) => {
      selectedContinent.value = selectedContinent.value === continent ? null : continent
    }
    
    const toggleStatus = (status) => {
      selectedStatus.value = selectedStatus.value === status ? null : status
    }
    
    const selectMarker = (marker) => {
      selectedMarker.value = marker
    }
    
    const closeDetailModal = () => {
      showDetailModal.value = false
      selectedMarker.value = null
    }
    
    const viewSpecies = (species) => {
      router.push(`/animals/${species.id}`)
    }
    
    const exploreSpecies = (marker) => {
      if (marker) {
        router.push(`/animals/${marker.id}`)
      }
    }
    
    return {
      map,
      zoom,
      center,
      mapBounds,
      selectedContinent,
      selectedStatus,
      showDetailModal,
      selectedMarker,
      continents,
      conservationStatuses,
      stats,
      animalMarkers,
      continentDistribution,
      hotSpeciesList,
      totalSpecies,
      endangeredCount,
      filteredMarkers,
      getParticleStyle,
      resetMap,
      toggleContinent,
      toggleStatus,
      selectMarker,
      closeDetailModal,
      viewSpecies,
      exploreSpecies
    }
  }
}
</script>

<style scoped>
.world-map-page {
  min-height: 100vh;
  background: #fcf9f2;
}

/* Hero区域 */
.hero-section {
  position: relative;
  padding: 60px 64px;
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
  background: linear-gradient(135deg, rgba(21, 66, 18, 0.08) 0%, rgba(0, 96, 172, 0.08) 100%);
}

.hero-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.particle {
  position: absolute;
  background: rgba(21, 66, 18, 0.3);
  border-radius: 50%;
  animation: float-particle 3s infinite ease-in-out;
}

@keyframes float-particle {
  0%, 100% { transform: translateY(0); opacity: 0.3; }
  50% { transform: translateY(-20px); opacity: 0.6; }
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
  margin-bottom: 20px;
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
  font-size: 42px;
  font-weight: 700;
  color: #154212;
  margin-bottom: 12px;
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
  font-size: 16px;
  color: rgba(28, 28, 24, 0.7);
  margin-bottom: 32px;
  line-height: 1.6;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  padding: 24px 32px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid rgba(21, 66, 18, 0.1);
  box-shadow: 0px 4px 20px rgba(45, 90, 39, 0.08);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  font-size: 28px;
}

.stat-content {
  text-align: left;
}

.stat-value {
  font-family: 'Quicksand', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #154212;
  display: block;
}

.stat-label {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: rgba(28, 28, 24, 0.6);
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(21, 66, 18, 0.15);
}

/* 主内容区域 */
.main-content {
  padding: 0 64px 64px;
}

.content-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 地图区域 */
.map-section {
  background: #ffffff;
  border-radius: 24px;
  padding: 24px;
  border: 1px solid rgba(21, 66, 18, 0.1);
  box-shadow: 0px 8px 32px rgba(45, 90, 39, 0.1);
}

.map-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(21, 66, 18, 0.1);
}

.controls-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.map-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #154212;
}

.controls-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.reset-btn {
  padding: 8px 16px;
  background: rgba(21, 66, 18, 0.1);
  border: 1px solid rgba(21, 66, 18, 0.2);
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #154212;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: rgba(21, 66, 18, 0.2);
}

.reset-icon {
  font-size: 16px;
}

/* 地图容器 */
.map-container {
  position: relative;
  height: 500px;
  overflow: hidden;
  border-radius: 16px;
}

.leaflet-map {
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* 自定义标记图标 */
.custom-marker-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.marker-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 3px solid white;
  transition: all 0.3s ease;
  cursor: pointer;
}

.marker-wrapper:hover {
  transform: scale(1.2);
}

.marker-wrapper.safe {
  background: linear-gradient(135deg, #154212 0%, #2d5a27 100%);
}

.marker-wrapper.vulnerable {
  background: linear-gradient(135deg, #0060ac 0%, #68abff 100%);
}

.marker-wrapper.endangered {
  background: linear-gradient(135deg, #f8b47f 0%, #592e03 100%);
}

.marker-wrapper.critical {
  background: linear-gradient(135deg, #ba1a1a 0%, #744419 100%);
}

.marker-emoji {
  font-size: 20px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

/* 弹窗样式 */
.marker-popup {
  padding: 8px;
}

.popup-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(21, 66, 18, 0.1);
}

.popup-icon {
  font-size: 32px;
}

.popup-title-group {
  flex: 1;
}

.popup-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #154212;
  margin: 0 0 4px 0;
}

.popup-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: rgba(28, 28, 24, 0.6);
  font-style: italic;
  margin: 0;
}

.popup-content {
  margin-bottom: 12px;
}

.popup-stat {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
}

.popup-stat .stat-label {
  color: rgba(28, 28, 24, 0.6);
  min-width: 70px;
}

.popup-stat .stat-value {
  color: #1c1c18;
  font-weight: 600;
}

.popup-stat .stat-value.status.safe { color: #154212; }
.popup-stat .stat-value.status.vulnerable { color: #0060ac; }
.popup-stat .stat-value.status.endangered { color: #592e03; }
.popup-stat .stat-value.status.critical { color: #ba1a1a; }

.popup-btn {
  width: 100%;
  padding: 10px 16px;
  background: #154212;
  color: white;
  border: none;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.popup-btn:hover {
  background: #2d5a27;
}

/* 地图图例 */
.map-legend {
  position: absolute;
  bottom: 16px;
  left: 16px;
  background: rgba(255, 255, 255, 0.95);
  padding: 12px 16px;
  border-radius: 10px;
  backdrop-filter: blur(8px);
}

.legend-title {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #154212;
  margin-bottom: 8px;
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-dot.safe { background: #154212; }
.legend-dot.vulnerable { background: #0060ac; }
.legend-dot.endangered { background: #f8b47f; }
.legend-dot.critical { background: #ba1a1a; }

.legend-label {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: rgba(28, 28, 24, 0.7);
}

/* 数据面板 */
.data-panel {
  background: #ffffff;
  border-radius: 24px;
  padding: 24px;
  border: 1px solid rgba(21, 66, 18, 0.1);
  box-shadow: 0px 8px 32px rgba(45, 90, 39, 0.1);
}

.panel-filters {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(21, 66, 18, 0.1);
}

.filter-group {
  margin-bottom: 16px;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-label {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: rgba(28, 28, 24, 0.7);
  margin-bottom: 8px;
  display: block;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.filter-chip {
  padding: 6px 12px;
  background: rgba(21, 66, 18, 0.05);
  border: 1px solid rgba(21, 66, 18, 0.1);
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: rgba(28, 28, 24, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-chip:hover {
  background: rgba(21, 66, 18, 0.1);
}

.filter-chip.active {
  background: #154212;
  color: #ffffff;
  border-color: #154212;
}

.filter-chip.status.safe { border-left: 3px solid #154212; }
.filter-chip.status.vulnerable { border-left: 3px solid #0060ac; }
.filter-chip.status.endangered { border-left: 3px solid #f8b47f; }
.filter-chip.status.critical { border-left: 3px solid #ba1a1a; }

.panel-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #154212;
  margin-bottom: 16px;
}

/* 统计概览 */
.stats-overview {
  margin-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.stat-card {
  padding: 16px;
  background: #fcf9f2;
  border-radius: 12px;
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.stat-icon {
  font-size: 20px;
}

.stat-name {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: rgba(28, 28, 24, 0.7);
}

.stat-body {
  margin-bottom: 8px;
}

.stat-number {
  font-family: 'Quicksand', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #154212;
}

.stat-unit {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: rgba(28, 28, 24, 0.6);
  margin-left: 4px;
}

.stat-bar {
  height: 4px;
  background: rgba(21, 66, 18, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: #154212;
  border-radius: 2px;
  transition: width 0.6s ease;
}

/* 分布图表 */
.distribution-chart {
  margin-bottom: 24px;
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chart-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bar-label {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 80px;
}

.label-icon {
  font-size: 16px;
}

.label-name {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: rgba(28, 28, 24, 0.7);
}

.bar-track {
  flex: 1;
  height: 24px;
  background: rgba(21, 66, 18, 0.05);
  border-radius: 12px;
  overflow: hidden;
}

.bar-fill-animated {
  height: 100%;
  background: linear-gradient(90deg, #154212 0%, #2d5a27 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  transition: width 0.8s ease;
}

.bar-value {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #ffffff;
}

/* 热门物种 */
.hot-species {
  margin-bottom: 24px;
}

.species-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.species-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #fcf9f2;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.species-item:hover {
  background: rgba(21, 66, 18, 0.1);
  transform: translateX(4px);
}

.species-icon {
  font-size: 24px;
}

.species-info {
  flex: 1;
}

.species-name {
  font-family: 'Quicksand', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #154212;
  margin-bottom: 2px;
}

.species-location {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: rgba(28, 28, 24, 0.6);
}

.species-status {
  padding: 4px 10px;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 600;
}

.species-status.safe {
  background: rgba(21, 66, 18, 0.15);
  color: #154212;
}

.species-status.vulnerable {
  background: rgba(0, 96, 172, 0.15);
  color: #0060ac;
}

.species-status.endangered {
  background: rgba(248, 180, 127, 0.2);
  color: #592e03;
}

.species-status.critical {
  background: rgba(186, 26, 26, 0.15);
  color: #ba1a1a;
}

/* 详情弹窗 */
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
  backdrop-filter: blur(8px);
}

.modal-content {
  background: #ffffff;
  border-radius: 24px;
  padding: 32px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  animation: modal-slide-up 0.3s ease;
}

@keyframes modal-slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  background: rgba(28, 28, 24, 0.05);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: rgba(28, 28, 24, 0.5);
  font-size: 16px;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(28, 28, 24, 0.1);
}

.modal-header {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.modal-icon {
  font-size: 48px;
}

.modal-title-group {
  flex: 1;
}

.modal-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #154212;
  margin-bottom: 4px;
}

.modal-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: rgba(28, 28, 24, 0.6);
  font-style: italic;
}

.modal-body {
  margin-bottom: 24px;
}

.modal-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.modal-stat {
  text-align: center;
  padding: 16px;
  background: #fcf9f2;
  border-radius: 12px;
}

.modal-stat .stat-label {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: rgba(28, 28, 24, 0.6);
  display: block;
  margin-bottom: 4px;
}

.modal-stat .stat-value {
  font-family: 'Quicksand', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #154212;
}

.modal-stat .stat-value.status.safe { color: #154212; }
.modal-stat .stat-value.status.vulnerable { color: #0060ac; }
.modal-stat .stat-value.status.endangered { color: #f8b47f; }
.modal-stat .stat-value.status.critical { color: #ba1a1a; }

.modal-description {
  margin-bottom: 24px;
}

.modal-description h4 {
  font-family: 'Quicksand', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #154212;
  margin-bottom: 8px;
}

.modal-description p {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  line-height: 1.6;
  color: rgba(28, 28, 24, 0.8);
}

.modal-threats h4 {
  font-family: 'Quicksand', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #154212;
  margin-bottom: 8px;
}

.threats-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.threat-tag {
  padding: 6px 12px;
  background: rgba(186, 26, 26, 0.1);
  color: #ba1a1a;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.modal-btn {
  padding: 12px 24px;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-btn.secondary {
  background: rgba(28, 28, 24, 0.05);
  border: 1px solid rgba(28, 28, 24, 0.1);
  color: rgba(28, 28, 24, 0.7);
}

.modal-btn.secondary:hover {
  background: rgba(28, 28, 24, 0.1);
}

.modal-btn.primary {
  background: #154212;
  border: none;
  color: #ffffff;
}

.modal-btn.primary:hover {
  background: #2d5a27;
}

/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* 响应式 */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 40px 20px;
  }
  
  .hero-title {
    font-size: 32px;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }
  
  .stat-divider {
    width: 100%;
    height: 1px;
  }
  
  .main-content {
    padding: 0 20px 40px;
  }
  
  .map-controls {
    flex-direction: column;
    gap: 16px;
  }
  
  .controls-left,
  .controls-right {
    width: 100%;
    justify-content: space-between;
  }
  
  .map-container {
    height: 400px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
