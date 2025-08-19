<template>
  <div class="dashboard-container p-4">
    <!-- Error Alert -->
    <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
      {{ error }}
      <button type="button" class="btn-close" @click="error = null"></button>
    </div>

    <!-- Welcome Section -->
    <welcome-section />

    <!-- User Profile -->
    <user-profile 
      :total-posts="stats.total"
      :total-views="totalViews"
    />

    <!-- Loading State for Analytics -->
    <div v-if="loading.stats" class="row g-4 mb-4">
      <div v-for="i in 3" :key="i" class="col-12 col-md-4">
        <div class="card h-100">
          <div class="card-body d-flex justify-content-center align-items-center">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Analytics Cards Section -->
    <dashboard-stats v-else :stats="stats" />

    <!-- Posts Table Section -->
    <div class="card">
      <div class="card-header bg-white py-3">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0">My Blog Posts</h5>
          <router-link to="/create-post" class="btn btn-primary">
            <i class="bi bi-plus-lg me-2"></i>New Post
          </router-link>
        </div>
      </div>
      <div class="card-body">
        <!-- Loading State for Table -->
        <div v-if="loading.posts" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      

        <!-- No Posts Message -->
        <div v-else-if="!posts.length" class="text-center py-5 text-muted">
          <i class="bi bi-journal-x display-1"></i>
          <p class="mt-3">You haven't created any posts yet.</p>
        </div>

        <!-- Posts Table -->
        <div v-else class="table-responsive">
          <table class="table table-hover align-middle">
            <thead>
              <tr>
                <th>Post Title</th>
                <th>Views</th>
                <th>Likes</th>
                <th>Comments</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="post in posts" :key="post.id">
                <td>{{ post.title }}</td>
                <td>
                  <i class="bi bi-eye me-2"></i>
                  {{ post.views || 0 }}
                </td>
                <td>
                  <i class="bi bi-heart me-2"></i>
                  {{ post.likes_count || 0 }}
                </td>
                <td>
                  <i class="bi bi-chat me-2"></i>
                  {{ post.comments_count || 0 }}
                </td>
                <td>
                  <span
                    class="badge"
                    :class="post.status === 'published' ? 'bg-success' : 'bg-warning'"
                  >
                    {{ post.status }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button
                      class="btn btn-sm btn-outline-primary me-2"
                      @click="editPost(post.id)"
                      :disabled="loading.action === post.id"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button
                      v-if="post.status === 'draft'"
                      class="btn btn-sm btn-outline-success me-2"
                      @click="publishPost(post)"
                      :disabled="loading.action === post.id"
                    >
                      <i
                        class="bi"
                        :class="loading.action === post.id ? 'bi-hourglass-split' : 'bi-send'"
                      ></i>
                    </button>
                    <button
                      class="btn btn-sm btn-outline-danger"
                      @click="confirmDelete(post)"
                      :disabled="loading.action === post.id"
                    >
                      <i
                        class="bi"
                        :class="loading.action === post.id ? 'bi-hourglass-split' : 'bi-trash'"
                      ></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Delete Post</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete "{{ postToDelete?.title }}"? This action cannot be
            undone.
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button
              type="button"
              class="btn btn-danger"
              @click="deletePost()"
              :disabled="loading.action === postToDelete?.id"
            >
              <span
                v-if="loading.action === postToDelete?.id"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { PostService } from '@/services/api'
import { Modal } from 'bootstrap'
import { useUserStore } from '@/stores/user'
import WelcomeSection from '@/components/dashboard/WelcomeSection.vue'
import UserProfile from '@/components/dashboard/UserProfile.vue'
import DashboardStats from '@/components/dashboard/DashboardStats.vue'

export default {
  name: 'Dashboard',
  components: {
    WelcomeSection,
    UserProfile,
    DashboardStats
  },
  data() {
    return {
      stats: {
        published: 0,
        drafts: 0,
        total: 0,
      },
      posts: [],
      loading: {
        stats: true,
        posts: true,
        action: null,
      },
      error: null,
      postToDelete: null,
      deleteModal: null,
    }
  },
  computed: {
    totalViews() {
      return this.posts.reduce((total, post) => total + (post.views || 0), 0);
    }
  },
  created() {
    this.fetchPosts()
    const userStore = useUserStore()
    userStore.loadUserFromStorage()
  },
  mounted() {
    this.deleteModal = new Modal(document.getElementById('deleteModal'))
  },
  methods: {
    async fetchPosts() {
      try {
        this.loading.posts = true
        this.loading.stats = true
        const response = await PostService.getUserPosts()
        // Check if the response contains paginated data or direct array
        this.posts = response.data.data.data || response.data.data
        this.updateStats()
      } catch (err) {
        this.error = 'Failed to load your posts. Please try again later.'
        console.error('Error fetching posts:', err)
      } finally {
        this.loading.posts = false
        this.loading.stats = false
      }
    },
    updateStats() {
      // Calculate stats from the posts array
      const published = this.posts.filter(post => post.status === 'published').length
      const drafts = this.posts.filter(post => post.status === 'draft').length
      
      this.stats = {
        published: published,
        drafts: drafts,
        total: this.posts.length
      }
    },
    editPost(id) {
      this.$router.push(`/edit-post/${id}`)
    },
    async publishPost(post) {
      try {
        this.loading.action = post.id
        // Only send the status update
        await PostService.update(post.id, { status: 'published' })
        await this.fetchPosts() // This will update both posts and stats
      } catch (err) {
        this.error = 'Failed to publish post. Please try again.'
        console.error('Error publishing post:', err)
      } finally {
        this.loading.action = null
      }
    },
    confirmDelete(post) {
      this.postToDelete = post
      this.deleteModal.show()
    },
    async deletePost() {
      if (!this.postToDelete) return

      try {
        this.loading.action = this.postToDelete.id
        await PostService.delete(this.postToDelete.id)
        await this.fetchPosts() // This will update both posts and stats
        this.deleteModal.hide()
      } catch (err) {
        this.error = 'Failed to delete post. Please try again.'
        console.error('Error deleting post:', err)
      } finally {
        this.loading.action = null
        this.postToDelete = null
      }
    },
  },
}
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
}

.analytics-card {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.analytics-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.published-card {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.draft-card {
  background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
  color: white;
}

.total-card {
  background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
  color: white;
}

.icon-container {
  background: rgba(255, 255, 255, 0.2);
  padding: 1rem;
  border-radius: 50%;
}

.icon-container i {
  font-size: 1.5rem;
}

.action-buttons button {
  transition: all 0.2s;
}

.action-buttons button:hover {
  transform: translateY(-2px);
}

.table th {
  font-weight: 600;
}

.table tbody tr {
  transition: background-color 0.2s;
}

.table tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

@media (max-width: 768px) {
  .action-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .card-title {
    font-size: 1.5rem;
  }
}
</style>
