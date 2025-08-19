<template>
  <div class="bg-light min-vh-100 py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow">
            <div class="card-header bg-primary text-white">
              <h2 class="mb-0">
                <i class="fas fa-edit me-2"></i>Create New Post
              </h2>
            </div>
            <div class="card-body">
              <form @submit.prevent="handleSubmit">
                <!-- Title -->
                <div class="mb-3">
                  <label class="form-label fw-bold">Post Title *</label>
                  <input 
                    v-model="form.title"
                    type="text" 
                    class="form-control form-control-lg"
                    placeholder="Enter post title"
                    required
                  >
                </div>

                <!-- Featured Image -->
                <div class="mb-3">
                  <label class="form-label fw-bold">Featured Image</label>
                  <input 
                    type="file"
                    class="form-control"
                    @change="handleImageUpload"
                    accept="image/*"
                  >
                  <img 
                    v-if="imagePreview" 
                    :src="imagePreview" 
                    class="img-fluid mt-2 rounded"
                    style="max-height: 200px; object-fit: cover;"
                  >
                </div>

                <!-- Content -->
                <div class="mb-3">
                  <label class="form-label fw-bold">Post Content *</label>
                  <textarea 
                    v-model="form.body"
                    class="form-control"
                    rows="8"
                    placeholder="Write your content here..."
                    required
                  ></textarea>
                </div>

                <!-- Buttons -->
                <div class="d-flex gap-2 justify-content-end">
                  <button type="button" class="btn btn-outline-secondary" @click="resetForm">
                    <i class="fas fa-undo me-1"></i>Reset
                  </button>
                  <button type="submit" class="btn btn-primary" :disabled="loading">
                    <span v-if="loading">
                      <i class="fas fa-spinner fa-spin me-1"></i>Creating...
                    </span>
                    <span v-else>
                      <i class="fas fa-paper-plane me-1"></i>Create Post
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Alerts -->
          <div v-if="successMessage" class="alert alert-success mt-3">
            <i class="fas fa-check-circle me-2"></i>{{ successMessage }}
          </div>
          <div v-if="errorMessage" class="alert alert-danger mt-3">
            <i class="fas fa-exclamation-triangle me-2"></i>{{ errorMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { PostService } from '@/services/api'

export default {
  name: 'CreatePost',
  data() {
    return {
      loading: false,
      successMessage: '',
      errorMessage: '',
      imagePreview: null,
      form: {
        title: '',
        body: '',
        featured_image: null
      }
    }
  },
  methods: {
    async handleSubmit() {
      if (!this.form.title.trim() || !this.form.body.trim()) {
        this.errorMessage = 'Please fill in all required fields'
        return
      }

      this.loading = true
      this.errorMessage = ''

      try {
        const formData = new FormData()
        formData.append('title', this.form.title)
        formData.append('body', this.form.body)
        if (this.form.featured_image) {
          formData.append('featured_image', this.form.featured_image)
        }

        const response = await PostService.create(formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        
        if (response.data) {
          this.successMessage = 'Post created successfully!'
          setTimeout(() => {
            this.resetForm()
            this.$router.push('/dashboard')
          }, 2000)
        }
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Failed to create post'
      } finally {
        this.loading = false
      }
    },
    
    handleImageUpload(event) {
      const file = event.target.files[0]
      if (file) {
        this.form.featured_image = file
        this.imagePreview = URL.createObjectURL(file)
      }
    },
    
    resetForm() {
      this.form = {
        title: '',
        body: '',
        featured_image: null
      }
      this.imagePreview = null
      this.successMessage = ''
      this.errorMessage = ''
    }
  }
}
</script>

<style scoped>
/* Bootstrap overrides for color scheme */
:root {
  --bs-primary: #d63384;
  --bs-primary-rgb: 214, 51, 132;
}

.bg-primary {
  background-color: var(--bs-primary) !important;
}

.btn-primary {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
}

.btn-primary:hover {
  background-color: #b82c6d;
  border-color: #b82c6d;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  border-color: #6c757d;
}
</style>
