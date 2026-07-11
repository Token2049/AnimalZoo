<template>
  <div class="map-view">
    <div class="map-header">
      <h2 class="map-title">{{ title }}</h2>
      <div class="map-controls">
        <button 
          v-for="layer in layers"
          :key="layer.id"
          class="layer-btn"
          :class="{ active: activeLayer === layer.id }"
          @click="setActiveLayer(layer.id)"
        >
          {{ layer.icon }} {{ layer.label }}
        </button>
      </div>
    </div>

    <div class="map-container" ref="mapContainer">
      <div class="map-placeholder">
        <div class="map-grid">
          <div 
            v-for="zone in zones"
            :key="zone.id"
            class="zone"
            :class="{ highlighted: highlightedZone === zone.id }"
            :style="getZoneStyle(zone)"
            @click="selectZone(zone)"
            @mouseenter="highlightedZone = zone.id"
            @mouseleave="highlightedZone = null"
          >
            <span class="zone-icon">{{ zone.icon }}</span>
            <span class="zone-name">{{ zone.name }}</span>
            <span v-if="zone.animalCount" class="zone-count">
              {{ zone.animalCount }}种动物
            </span>
          </div>
        </div>
      </div>

      <div v-if="selectedZone" class="zone-info">
        <div class="info-header">
          <h3 class="info-title">{{ selectedZone.name }}</h3>
          <button class="close-btn" @click="selectedZone = null">✕</button>
        </div>
        <p class="info-description">{{ selectedZone.description }}</p>
        <div class="info-animals">
          <h4 class="animals-title">区域动物</h4>
          <div class="animals-list">
            <span 
              v-for="animal in selectedZone.animals"
              :key="animal.id"
              class="animal-tag"
              @click="$emit('animal-click', animal)"
            >
              {{ animal.name }}
            </span>
          </div>
        </div>
        <button class="explore-btn" @click="$emit('explore', selectedZone)">
          探索此区域 →
        </button>
      </div>
    </div>

    <div class="map-legend">
      <h4 class="legend-title">图例</h4>
      <div class="legend-items">
        <div 
          v-for="item in legendItems"
          :key="item.label"
          class="legend-item"
        >
          <span 
            class="legend-color"
            :style="{ backgroundColor: item.color }"
          ></span>
          <span class="legend-label">{{ item.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'MapView',
  
  props: {
    title: {
      type: String,
      default: '动物园地图'
    },
    zones: {
      type: Array,
      default: () => []
    }
  },

  emits: ['zone-select', 'animal-click', 'explore'],

  setup(props, { emit }) {
    const mapContainer = ref(null)
    const selectedZone = ref(null)
    const highlightedZone = ref(null)
    const activeLayer = ref('all')

    const layers = [
      { id: 'all', label: '全部', icon: '🗺️' },
      { id: 'mammals', label: '哺乳动物', icon: '🦁' },
      { id: 'birds', label: '鸟类', icon: '🦅' },
      { id: 'aquatic', label: '水生动物', icon: '🐠' }
    ]

    const legendItems = [
      { label: '哺乳动物区', color: '#154212' },
      { label: '鸟类区', color: '#0060ac' },
      { label: '爬行动物区', color: '#592e03' },
      { label: '水族馆', color: '#68abff' }
    ]

    const getZoneStyle = (zone) => ({
      gridRow: zone.row,
      gridColumn: zone.col,
      backgroundColor: zone.color || 'rgba(21, 66, 18, 0.1)'
    })

    const setActiveLayer = (layerId) => {
      activeLayer.value = layerId
    }

    const selectZone = (zone) => {
      selectedZone.value = zone
      emit('zone-select', zone)
    }

    return {
      mapContainer,
      selectedZone,
      highlightedZone,
      activeLayer,
      layers,
      legendItems,
      getZoneStyle,
      setActiveLayer,
      selectZone
    }
  }
}
</script>

<style scoped>
.map-view {
  width: 100%;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.map-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #1c1c18;
}

.map-controls {
  display: flex;
  gap: 8px;
}

.layer-btn {
  padding: 8px 16px;
  background: rgba(21, 66, 18, 0.08);
  border: none;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #1c1c18;
  cursor: pointer;
  transition: all 0.2s ease;
}

.layer-btn:hover {
  background: rgba(21, 66, 18, 0.15);
}

.layer-btn.active {
  background: #154212;
  color: #ffffff;
}

.map-container {
  position: relative;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid rgba(21, 66, 18, 0.1);
  overflow: hidden;
  box-shadow: 0px 4px 20px rgba(45, 90, 39, 0.08);
}

.map-placeholder {
  padding: 24px;
  min-height: 500px;
}

.map-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 150px);
  gap: 16px;
}

.zone {
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.zone:hover,
.zone.highlighted {
  transform: scale(1.02);
  border-color: #154212;
}

.zone-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.zone-name {
  font-family: 'Quicksand', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #1c1c18;
  text-align: center;
}

.zone-count {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: rgba(28, 28, 24, 0.6);
  margin-top: 4px;
}

.zone-info {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 300px;
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(21, 66, 18, 0.1);
  box-shadow: 0px 12px 32px rgba(45, 90, 39, 0.12);
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.info-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #1c1c18;
}

.close-btn {
  width: 32px;
  height: 32px;
  background: rgba(21, 66, 18, 0.08);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

.info-description {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: rgba(28, 28, 24, 0.8);
  line-height: 1.6;
  margin-bottom: 16px;
}

.info-animals {
  margin-bottom: 16px;
}

.animals-title {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: rgba(28, 28, 24, 0.6);
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.animals-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.animal-tag {
  padding: 4px 12px;
  background: rgba(21, 66, 18, 0.08);
  border-radius: 9999px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #1c1c18;
  cursor: pointer;
  transition: background 0.2s ease;
}

.animal-tag:hover {
  background: rgba(21, 66, 18, 0.15);
}

.explore-btn {
  width: 100%;
  padding: 12px;
  background: #154212;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.explore-btn:hover {
  background: #2d5a27;
}

.map-legend {
  margin-top: 24px;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid rgba(21, 66, 18, 0.1);
}

.legend-title {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: rgba(28, 28, 24, 0.6);
  letter-spacing: 0.05em;
  margin-bottom: 12px;
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-label {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #1c1c18;
}

@media (max-width: 768px) {
  .map-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .map-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(6, 120px);
  }

  .zone-info {
    position: static;
    width: 100%;
    margin-top: 16px;
  }
}
</style>
