<template>
  <div class="layout">
    <AppHeader>
      <template #header-actions>
        <slot name="header-actions"></slot>
      </template>
    </AppHeader>

    <div class="layout-body">
      <AppSidebar 
        v-if="showSidebar"
        :collapsed="sidebarCollapsed"
        @update:collapsed="sidebarCollapsed = $event"
      >
        <template #sidebar-footer>
          <slot name="sidebar-footer"></slot>
        </template>
      </AppSidebar>

      <main class="main-content">
        <slot></slot>
      </main>
    </div>

    <AppFooter>
      <template #footer-extra>
        <slot name="footer-extra"></slot>
      </template>
    </AppFooter>
  </div>
</template>

<script>
import { ref, provide } from 'vue'
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
import AppSidebar from './AppSidebar.vue'

export default {
  name: 'AppLayout',
  
  components: {
    AppHeader,
    AppFooter,
    AppSidebar
  },

  props: {
    showSidebar: {
      type: Boolean,
      default: true
    }
  },

  setup() {
    const sidebarCollapsed = ref(false)

    provide('animalCount', 150)
    provide('visitCount', 2340)

    return {
      sidebarCollapsed
    }
  }
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fcf9f2;
}

.layout-body {
  flex: 1;
  display: flex;
}

.main-content {
  flex: 1;
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 64px;
  width: 100%;
}

@media (max-width: 768px) {
  .main-content {
    padding: 20px;
  }
}
</style>
