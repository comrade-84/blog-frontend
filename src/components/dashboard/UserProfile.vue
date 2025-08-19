<template>
  <div>
    <div class="user-profile-card bg-white rounded-3 shadow-sm p-4 mb-4">
      <div class="d-flex justify-content-between align-items-start">
        <div class="d-flex gap-3">
          <div class="profile-image">
            <img 
              :src="userAvatar" 
              :alt="userName"
              class="rounded-circle"
              width="80"
              height="80"
            >
          </div>
          <div class="user-info">
            <h4 class="mb-1">{{ userName }}</h4>
            <p class="text-muted mb-2">{{ userEmail }}</p>
            <div class="user-stats d-flex gap-4">
              <div>
                <strong>{{ totalPosts }}</strong>
                <span class="text-muted ms-1">Posts</span>
              </div>
              <div>
                <strong>{{ totalViews }}</strong>
                <span class="text-muted ms-1">Views</span>
              </div>
            </div>
          </div>
        </div>
        <button @click="openSettings" class="btn btn-light" title="Settings">
          <i class="bi bi-gear"> settings</i>
        </button>
      </div>
    </div>

    <!-- Settings Modal -->
    <div class="modal fade" id="settingsModal" tabindex="-1" aria-labelledby="settingsModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="settingsModalLabel">Edit Profile</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateProfile" class="needs-validation" novalidate>
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="name" 
                  v-model="form.name" 
                  required
                >
              </div>
              
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="email" 
                  v-model="form.email" 
                  required
                >
              </div>
              
              <div class="mb-3">
                <label for="avatar" class="form-label">Profile Picture</label>
                <input 
                  type="file" 
                  class="form-control" 
                  id="avatar" 
                  @change="handleAvatarChange"
                  accept="image/*"
                >
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">New Password (optional)</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="password" 
                  v-model="form.password"
                  autocomplete="new-password"
                >
              </div>

              <div class="mb-3">
                <label for="password_confirmation" class="form-label">Confirm New Password</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="password_confirmation" 
                  v-model="form.password_confirmation"
                  :disabled="!form.password"
                >
              </div>

              <div v-if="error" class="alert alert-danger">
                {{ error }}
              </div>

              <div class="modal-footer px-0 pb-0">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user'
import { Modal } from 'bootstrap'

export default {
  name: 'UserProfile',
  props: {
    totalPosts: {
      type: Number,
      default: 0
    },
    totalViews: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      settingsModal: null,
      error: '',
      loading: false,
      form: {
        name: '',
        email: '',
        avatar: null,
        password: '',
        password_confirmation: ''
      }
    }
  },
  computed: {
    userStore() {
      return useUserStore()
    },
    userName() {
      return this.userStore.getName
    },
    userEmail() {
      return this.userStore.getEmail
    },
    userAvatar() {
      const user = this.userStore.user
      return user?.avatar_url || `https://ui-avatars.com/api/?name=${this.userName}&background=random`
    }
  },
  mounted() {
    this.settingsModal = new Modal(document.getElementById('settingsModal'))
  },
  methods: {
    openSettings() {
      // Reset form and error before opening
      this.form.name = this.userName
      this.form.email = this.userEmail
      this.form.password = ''
      this.form.password_confirmation = ''
      this.error = ''
      this.settingsModal.show()
    },
    handleAvatarChange(event) {
      const file = event.target.files[0]
      if (file) {
        this.form.avatar = file
      }
    },
    async updateProfile() {
      this.loading = true
      this.error = ''

      try {
        const formData = new FormData()
        formData.append('name', this.form.name)
        formData.append('email', this.form.email)
        
        if (this.form.avatar) {
          formData.append('avatar', this.form.avatar)
        }
        
        if (this.form.password) {
          if (this.form.password !== this.form.password_confirmation) {
            this.error = 'Passwords do not match'
            return
          }
          formData.append('password', this.form.password)
          formData.append('password_confirmation', this.form.password_confirmation)
        }

        const response = await fetch('http://127.0.0.1:8000/api/user/profile', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || 'Failed to update profile')
        }

        const data = await response.json()
        
        // Update store and localStorage
        this.userStore.setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))

        this.settingsModal.hide()
      } catch (err) {
        this.error = err.message || 'Failed to update profile'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.user-profile-card {
  border: 1px solid rgba(0,0,0,0.05);
}

.profile-image img {
  border: 2px solid var(--primary-color);
  padding: 2px;
}

.user-stats {
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.modal-header, .modal-body {
  padding: 1.5rem;
}

.form-label {
  font-weight: 500;
  color: #555;
}
</style>
