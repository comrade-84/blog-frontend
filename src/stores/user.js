import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null
  }),
  getters: {
    getName: (state) => state.user?.name || 'User',
    getEmail: (state) => state.user?.email || '',
    getAvatar: (state) => state.user?.avatar || `https://ui-avatars.com/api/?name=${state.user?.name || 'User'}&background=random`,
    isAuthenticated: (state) => !!state.user
  },
  actions: {
    setUser(userData) {
      this.user = userData;
    },
    loadUserFromStorage() {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          // Check if the string starts with '{' to determine if it needs parsing
          this.user = userStr.startsWith('{') ? JSON.parse(userStr) : userStr;
          
          // If user is a string (JWT payload), try to parse it
          if (typeof this.user === 'string') {
            try {
              this.user = JSON.parse(this.user);
            } catch {
              // If parsing fails, create a basic user object
              this.user = { name: 'User' };
            }
          }
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
        this.user = { name: 'User' };
      }
    },
    clearUser() {
      this.user = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }
});
