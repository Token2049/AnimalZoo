<template>
  <div class="gallery">
    <div class="gallery-header">
      <h2 class="gallery-title">{{ title }}</h2>
      <div class="gallery-controls">
        <button 
          class="view-btn"
          :class="{ active: viewMode === 'grid' }"
          @click="viewMode = 'grid'"
        >
          网格视图
        </button>
        <button 
          class="view-btn"
          :class="{ active: viewMode === 'slider' }"
          @click="viewMode = 'slider'"
        >
          滑动视图
        </button>
      </div>
    </div>

    <div v-if="viewMode === 'grid'" class="gallery-grid">
      <div 
        v-for="(image, index) in images"
        :key="index"
        class="gallery-item"
        @click="openLightbox(index)"
      >
        <img 
          v-lazy="image.src || image"
          :alt="image.alt || `Image ${index + 1}`"
          class="gallery-image"
        />
        <div v-if="image.caption" class="gallery-caption">
          {{ image.caption }}
        </div>
      </div>
    </div>

    <div v-else class="gallery-slider">
      <button 
        class="slider-btn prev"
        :disabled="currentIndex === 0"
        @click="prevSlide"
      >
        ←
      </button>
      
      <div class="slider-content">
        <img 
          :src="currentImage.src || currentImage"
          :alt="currentImage.alt || `Image ${currentIndex + 1}`"
          class="slider-image"
        />
        <div v-if="currentImage.caption" class="slider-caption">
          {{ currentImage.caption }}
        </div>
        <div class="slider-counter">
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>
      </div>

      <button 
        class="slider-btn next"
        :disabled="currentIndex === images.length - 1"
        @click="nextSlide"
      >
        →
      </button>
    </div>

    <div v-if="showLightbox" class="lightbox" @click.self="closeLightbox">
      <button class="lightbox-close" @click="closeLightbox">
        ✕
      </button>
      <button 
        class="lightbox-btn prev"
        :disabled="lightboxIndex === 0"
        @click="lightboxIndex--"
      >
        ←
      </button>
      <img 
        :src="lightboxImage.src || lightboxImage"
        :alt="lightboxImage.alt"
        class="lightbox-image"
      />
      <button 
        class="lightbox-btn next"
        :disabled="lightboxIndex === images.length - 1"
        @click="lightboxIndex++"
      >
        →
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'Gallery',
  
  props: {
    images: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: '相册展示'
    }
  },

  emits: ['image-click'],

  setup(props, { emit }) {
    const viewMode = ref('grid')
    const currentIndex = ref(0)
    const showLightbox = ref(false)
    const lightboxIndex = ref(0)

    const currentImage = computed(() => 
      props.images[currentIndex.value] || {}
    )

    const lightboxImage = computed(() => 
      props.images[lightboxIndex.value] || {}
    )

    const prevSlide = () => {
      if (currentIndex.value > 0) {
        currentIndex.value--
      }
    }

    const nextSlide = () => {
      if (currentIndex.value < props.images.length - 1) {
        currentIndex.value++
      }
    }

    const openLightbox = (index) => {
      lightboxIndex.value = index
      showLightbox.value = true
      emit('image-click', props.images[index])
    }

    const closeLightbox = () => {
      showLightbox.value = false
    }

    return {
      viewMode,
      currentIndex,
      showLightbox,
      lightboxIndex,
      currentImage,
      lightboxImage,
      prevSlide,
      nextSlide,
      openLightbox,
      closeLightbox
    }
  }
}
</script>

<style scoped>
.gallery {
  width: 100%;
}

.gallery-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.gallery-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #1c1c18;
}

.gallery-controls {
  display: flex;
  gap: 8px;
  background: rgba(21, 66, 18, 0.08);
  border-radius: 8px;
  padding: 4px;
}

.view-btn {
  padding: 8px 16px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #1c1c18;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-btn.active {
  background: #154212;
  color: #ffffff;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.gallery-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  background: #ffffff;
  border: 1px solid rgba(21, 66, 18, 0.1);
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  transform: scale(1.02);
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
}

.gallery-slider {
  display: flex;
  align-items: center;
  gap: 16px;
}

.slider-btn {
  width: 48px;
  height: 48px;
  border: none;
  background: #154212;
  color: #ffffff;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.slider-btn:hover:not(:disabled) {
  background: #2d5a27;
}

.slider-btn:disabled {
  background: rgba(21, 66, 18, 0.2);
  cursor: not-allowed;
}

.slider-content {
  flex: 1;
  position: relative;
}

.slider-image {
  width: 100%;
  max-height: 600px;
  object-fit: contain;
  border-radius: 12px;
}

.slider-caption {
  text-align: center;
  margin-top: 16px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: #1c1c18;
}

.slider-counter {
  text-align: center;
  margin-top: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: rgba(28, 28, 24, 0.6);
}

.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
}

.lightbox-btn {
  position: absolute;
  width: 48px;
  height: 48px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
}

.lightbox-btn.prev {
  left: 20px;
}

.lightbox-btn.next {
  right: 20px;
}

.lightbox-image {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

@media (max-width: 768px) {
  .gallery-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .slider-btn {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
}
</style>
