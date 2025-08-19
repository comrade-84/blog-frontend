<template>
  <div>
    <!-- HERO SECTION (Visible only for guests) -->
  <section v-if="!isLoggedIn" class="hero-section">
    <div class="container hero-content">
      <div class="hero-text">
        <h1>
          Welcome to <span class="highlight">BlogSphere</span>
        </h1>
        <p class="subtitle">
          Share your voice with the world. Create posts, build your audience, 
          and manage your blog with ease.
        </p>
        <router-link to="/register" class="btn-get-started">
          Get Started 🚀
        </router-link>
        <p class="supporting-text">
          Join 10,000+ creators already publishing great content.
        </p>
      </div>
      <div class="hero-image">
        <img src="../assets/images/blog_landing.png" alt="Hero Illustration" />
      </div>
    </div>
  </section>

  <futures-section v-if="!isLoggedIn"/>

    <!-- FEATURED POSTS -->
    <section id="blogs" class="container my-5">
      <h3 class="mb-4" style="color: var(--primary-color)">Featured Posts</h3>
      <div class="row">
        <div class="col-md-4" v-for="post in featuredPosts" :key="post.id">
          <div class="card h-100 shadow-sm">
            <img
              :src="post.featured_image || defaultImage"
              class="card-img-top"
              alt="Post image"
            />
            <div class="card-body">
              <h5 class="card-title">{{ post.title }}</h5>
              <p class="card-text">{{ truncate(post.body, 100) }}</p>
              <button @click="openPostModal(post)" class="btn btn-primary-custom">
                Read More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ALL POSTS -->
    <section class="container border my-5">
      <h3 class="mb-4" style="color: var(--primary-color)">All Posts</h3>
      <div class="row">
        <template v-if="posts && posts.length > 0">
          <div class="col-md-4 mb-4" v-for="post in posts" :key="post.id">
            <div class="card h-100 shadow-sm">
              <img
                :src="post.featured_image || defaultImage"
                class="card-img-top"
                alt="Post image"
              />
              <div class="card-body">
                <h5 class="card-title">{{ post.title }}</h5>
                <p class="card-text">{{ truncate(post.body, 100) }}</p>
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <button @click="openPostModal(post)" class="btn btn-primary-custom">
                    Read More
                  </button>
                  <div class="d-flex align-items-center gap-3">
                    <button @click="handleLike(post)" class="btn btn-link text-decoration-none">
                      <i class="bi" :class="post.liked ? 'bi-heart-fill text-danger' : 'bi-heart'">&nbsp;</i>
                      <span>{{ post.likes_count || 0 }}</span>
                    </button>
                    <button @click="openCommentModal(post)" class="btn btn-link text-decoration-none">
                      <i class="bi bi-chat">&nbsp;</i>
                      <span>{{ post.comments_count || 0 }}</span>
                    </button>
                  </div>
                </div>
                <hr class="my-2">
                <div class="d-flex align-items-center">
                  <img 
                    :src="post.user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user?.name || '')}&background=random`" 
                    class="rounded-circle me-2"
                    width="32"
                    height="32"
                    :alt="post.user?.name"
                  >
                  <div class="small">
                    <div class="fw-medium text-body">{{ post.user?.name }}</div>
                    <div class="text-muted">{{ formatDate(post.created_at) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div v-else class="col-12 text-center">
          <p>No posts available.</p>
        </div>
      </div>

      <!-- PAGINATION -->
      <nav v-if="totalPages > 1">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: page === 1 }">
            <button class="page-link" @click="changePage(page - 1)">Prev</button>
          </li>
          <li
            v-for="n in totalPages"
            :key="n"
            class="page-item"
            :class="{ active: page === n }"
          >
            <button class="page-link" @click="changePage(n)">{{ n }}</button>
          </li>
          <li class="page-item" :class="{ disabled: page === totalPages }">
            <button class="page-link" @click="changePage(page + 1)">Next</button>
          </li>
        </ul>
      </nav>
    </section>

    <!-- Comment Modal -->
    <div class="modal fade" id="commentModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Comments</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <!-- Add Comment Form -->
            <form v-if="isLoggedIn" @submit.prevent="submitComment" class="mb-4">
              <div class="form-group">
                <textarea 
                  v-model="newComment" 
                  class="form-control" 
                  rows="3" 
                  placeholder="Write your comment..."
                  required
                ></textarea>
              </div>
              <button 
                type="submit" 
                class="btn btn-primary mt-2"
                :disabled="commentLoading"
              >
                {{ commentLoading ? 'Posting...' : 'Post Comment' }}
              </button>
            </form>
            <div v-else class="alert alert-info">
              Please <router-link to="/login">login</router-link> to comment.
            </div>

            <!-- Comments List -->
            <div class="comments-section">
              <div v-if="loadingComments" class="text-center py-3">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
              <div v-else-if="!comments.length" class="text-center py-3">
                No comments yet. Be the first to comment!
              </div>
              <div v-else class="comment-list">
                <div v-for="comment in comments" :key="comment.id" class="comment-item mb-3">
                  <div class="d-flex align-items-start">
                    <div class="comment-avatar me-2">
                      <img 
                        :src="comment.user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user.name || '')}&background=random`" 
                        class="rounded-circle"
                        width="40"
                        height="40"
                        :alt="comment.user.name"
                      >
                    </div>
                    <div class="comment-content">
                      <h6 class="mb-1">{{ comment.user.name }}</h6>
                      <p class="mb-1">{{ comment.content }}</p>
                      <small class="text-muted">{{ formatDate(comment.created_at) }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Post Details Modal -->
    <div class="modal fade" id="postModal" tabindex="-1">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedPost?.title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <!-- Post Content -->
            <img 
              :src="selectedPost?.featured_image || defaultImage" 
              class="img-fluid rounded mb-4" 
              :alt="selectedPost?.title"
            />
            <div class="post-content mb-4">
              {{ selectedPost?.body }}
            </div>
            <div class="post-meta d-flex align-items-center gap-3 mb-4">
              <button 
                @click="handleLike(selectedPost)" 
                class="btn btn-link text-decoration-none"
                v-if="selectedPost"
              >
                <i class="bi" :class="selectedPost.liked ? 'bi-heart-fill text-danger' : 'bi-heart'">&nbsp;</i>
                <span>{{ selectedPost?.likes_count || 0 }} likes</span>
              </button>
              <span class="text-muted">
                <i class="bi bi-calendar me-1"></i>
                {{ selectedPost ? formatDate(selectedPost.created_at) : '' }}
              </span>
            </div>

            <!-- Comments Section -->
            <div class="comments-section mt-4">
              <h6 class="mb-3">Comments</h6>
              
              <!-- Add Comment Form -->
              <form v-if="isLoggedIn" @submit.prevent="submitComment" class="mb-4">
                <div class="form-group">
                  <textarea 
                    v-model="newComment" 
                    class="form-control" 
                    rows="3" 
                    placeholder="Write your comment..."
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  class="btn btn-primary mt-2"
                  :disabled="commentLoading"
                >
                  {{ commentLoading ? 'Posting...' : 'Post Comment' }}
                </button>
              </form>
              <div v-else class="alert alert-info">
                Please <router-link to="/login">login</router-link> to comment.
              </div>

              <!-- Comments List -->
              <div v-if="loadingComments" class="text-center py-3">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
              <div v-else-if="!comments.length" class="text-center py-3">
                No comments yet. Be the first to comment!
              </div>
              <div v-else class="comment-list">
                <div v-for="comment in comments" :key="comment.id" class="comment-item mb-3">
                  <div class="d-flex align-items-start">
                    <div class="comment-avatar me-2">
                      <img 
                        :src="comment.user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user.name || '')}&background=random`" 
                        class="rounded-circle"
                        width="40"
                        height="40"
                        :alt="comment.user.name"
                      >
                    </div>
                    <div class="comment-content">
                      <h6 class="mb-1">{{ comment.user.name }}</h6>
                      <p class="mb-1">{{ comment.content }}</p>
                      <small class="text-muted">{{ formatDate(comment.created_at) }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { PostService, LikeService, CommentService } from "../services/api";
import FuturesSection from "@/components/FuturesSection.vue";
import { Modal } from 'bootstrap';

export default {
  components:{
    FuturesSection
  },
  name: "Home",
  data() {
    return {
      posts: [],
      featuredPosts: [],
      page: 1,
      totalPages: 1,
      defaultImage: "https://via.placeholder.com/600x400?text=Blog+Post",
      commentModal: null,
      postModal: null,
      selectedPost: null,
      comments: [],
      newComment: "",
      loadingComments: false,
      commentLoading: false,
    };
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem("token");
    },
  },
  methods: {
 truncate(text, length) {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
},

    async fetchPosts() {
      try {
        console.log('Fetching posts with page:', this.page);
        const res = await PostService.getAll({ 
          page: this.page,
          status: 'published' // Only fetch published posts
        });
        console.log('Fetched posts response:', JSON.stringify(res.data, null, 2));
        
        if (res.data?.success && res.data?.data?.data && Array.isArray(res.data.data.data)) {
          this.posts = res.data.data.data;
          this.totalPages = res.data.data.last_page || 1;
        } else {
          console.error('Invalid posts data format:', res.data);
          this.posts = [];
          this.totalPages = 1;
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        this.posts = [];
        this.totalPages = 1;
      }
    },
    async fetchFeatured() {
      try {
        const res = await PostService.getAll({ 
          per_page: 3,
          status: 'published' // Only fetch published posts
        });
        const featuredData = res.data?.data?.data || [];
        this.featuredPosts = Array.isArray(featuredData) ? featuredData : [];
      } catch (error) {
        console.error('Error fetching featured posts:', error);
        this.featuredPosts = [];
      }
    },
    changePage(newPage) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.page = newPage;
        this.fetchPosts();
      }
    },
    async handleLike(post) {
      if (!this.isLoggedIn) {
        this.$router.push('/login');
        return;
      }

      try {
        if (post.liked) {
          await LikeService.unlike(post.id);
          post.likes_count--;
        } else {
          await LikeService.like(post.id);
          post.likes_count++;
        }
        post.liked = !post.liked;
      } catch (error) {
        console.error('Error handling like:', error);
      }
    },
    async openPostModal(post) {
      this.selectedPost = post;
      this.comments = [];
      this.newComment = '';
      this.loadingComments = true;

      if (!this.postModal) {
        this.postModal = new Modal(document.getElementById('postModal'));
      }
      this.postModal.show();

      try {
        const response = await CommentService.getForPost(post.id);
        this.comments = response.data.data;
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        this.loadingComments = false;
      }
    },

    async openCommentModal(post) {
      this.selectedPost = post;
      this.comments = [];
      this.newComment = '';
      this.loadingComments = true;

      if (!this.commentModal) {
        this.commentModal = new Modal(document.getElementById('commentModal'));
      }
      this.commentModal.show();

      try {
        const response = await CommentService.getForPost(post.id);
        this.comments = response.data.data;
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        this.loadingComments = false;
      }
    },
    async submitComment() {
      if (!this.selectedPost || !this.newComment.trim()) return;

      this.commentLoading = true;
      try {
        const response = await CommentService.addToPost(this.selectedPost.id, {
          content: this.newComment
        });
        this.comments.unshift(response.data.data);
        this.newComment = '';
        this.selectedPost.comments_count++;
      } catch (error) {
        console.error('Error posting comment:', error);
      } finally {
        this.commentLoading = false;
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  },
  mounted() {
    this.fetchFeatured();
    this.fetchPosts();
    this.postModal = new Modal(document.getElementById('postModal'));
  },
};
</script>

<style>
:root {
  --primary-color: #d63384; /* Dark Pink */
  --secondary-color: #ffffff;
}

.hero-section {
  background: linear-gradient(135deg, #f8f9fa, #e3f2fd);
  padding: 60px 0;
}

.hero-section {
  /* background-color: #f8fcff; light background */
    background: linear-gradient(135deg, #f8f9fa, #e3f2fd);

  padding: 60px 0;
}

.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.hero-text {
  flex: 1;
}

.hero-text h1 {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.hero-text .highlight {
  color: #1e73ff; /* blue highlight */
}

.subtitle {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 1.5rem;
}

.btn-get-started {
  display: inline-block;
  background-color: #1e73ff;
  color: white;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
}

.btn-get-started:hover {
  background-color: #145ecc;
}

.supporting-text {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #777;
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
}

.hero-image img {
  max-width: 100%;
  height: auto;
}

.btn-primary-custom {
  background-color: var(--primary-color);
  border: none;
  color: white;
  font-size: 0.9rem;
  padding: 0.375rem 0.75rem;
}

.btn-primary-custom:hover {
  background-color: #b82c6d;
}

@media (max-width: 768px) {
  .btn-primary-custom {
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
  }
}

.comment-list {
  max-height: 500px;
  overflow-y: auto;
}

.comment-item {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-content {
  flex: 1;
}

.btn-link {
  color: #666;
  padding: 0.25rem 0.5rem;
}

.btn-link:hover {
  color: var(--primary-color);
}

.btn-link i {
  font-size: 1.1rem;
}

.card-body hr {
  margin: 0.5rem 0;
  opacity: 0.15;
}

.small {
  font-size: 0.875rem;
}

.fw-medium {
  font-weight: 500;
}
</style>
