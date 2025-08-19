<template>
  <div class="welcome-section p-4 bg-white rounded-3 shadow-sm mb-4">
    <div class="d-flex justify-content-between align-items-start">
      <div>
        <h2 class="welcome-text mb-2">Welcome back, {{ userName }}! 👋</h2>
        <p class="text-muted mb-3">What's on your mind today?</p>
        <router-link to="/create-post" class="btn btn-primary d-inline-flex align-items-center">
          <i class="bi bi-plus-lg me-2"></i>
          Share your thoughts
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

export default {
  name: 'WelcomeSection',
  setup() {
    const userStore = useUserStore()
    const { getName: userName } = storeToRefs(userStore)

    return {
      userName
    }
  }
}
</script>

<style scoped>
.welcome-section {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid rgba(0,0,0,0.05);
}

.welcome-text {
  color: var(--primary-color);
  font-size: 1.75rem;
}
</style>
