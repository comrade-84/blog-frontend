// /src/services/api.js
import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // Your Laravel API URL
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Automatically attach token if logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Services
export const AuthService = {
  register(data) {
    return api.post("/register", data);
  },
  login(data) {
    return api.post("/login", data);
  },
  logout() {
    return api.post("/logout");
  },
};

// Post Services
export const PostService = {
  getAll(params = {}) {
    return api.get("/posts", { 
      params: {
        ...params,
        with: 'category,user' // Always include category and user relations
      }
    });
  },
  getById(id) {
    return api.get(`/posts/${id}`);
  },
  create(data) {
    // Ensure we're sending with the correct content type and that the backend knows to expect JSON
    const config = {
      headers: { 
        "Content-Type": "multipart/form-data",
        "Accept": "application/json"
      }
    };
    return api.post("/posts", data, config);
  },
  update(id, data) {
    // If there's a featured_image, use multipart/form-data, otherwise use JSON
    const headers = data.featured_image
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" };
    
    return api.post(`/posts/${id}?_method=PUT`, data, { headers });
  },
  delete(id) {
    return api.delete(`/posts/${id}`);
  },
  publish(id) {
    return api.put(`/posts/${id}/publish`);
  },
  getUserStats() {
    return api.get('/posts', { 
      params: { 
        user_stats: true 
      }
    });
  },
  getUserPosts() {
    return api.get('/posts/user', { 
      params: { 
        per_page: 'all'
      }
    });
  }
};

// Like Services
export const LikeService = {
  like(postId) {
    return api.post(`/posts/${postId}/like`);
  },
  unlike(postId) {
    return api.post(`/posts/${postId}/unlike`);
  },
};

// Comment Services
export const CommentService = {
  getForPost(postId) {
    return api.get(`/posts/${postId}/comments`);
  },
  addToPost(postId, data) {
    return api.post(`/posts/${postId}/comments`, data);
  },
};

// Export main axios instance if needed
export default api;
