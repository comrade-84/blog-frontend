<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-5">
        <div class="card shadow">
          <div class="card-body">
            <h3 class="text-center mb-4" style="color: var(--primary-color)">Login</h3>

            <form @submit.prevent="loginUser">
              <div class="mb-3">
                <label>Email</label>
                <input type="email" v-model="email" class="form-control" required />
              </div>

              <div class="mb-3">
                <label>Password</label>
                <div class="input-group">
                  <input :type="showPassword ? 'text' : 'password'" v-model="password" class="form-control" required />
                  <button type="button" class="btn btn-outline-secondary" @click="showPassword = !showPassword">
                    <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                  </button>
                </div>
              </div>

              <button type="submit" class="btn btn-primary-custom w-100" :disabled="loading">
                {{ loading ? "Logging in..." : "Login" }}
              </button>

              <p class="mt-3 text-center">
                Don't have an account?
                <router-link to="/register" style="color: var(--primary-color)">Register</router-link>
              </p>
            </form>

            <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { AuthService } from "../services/api";
import { useUserStore } from '@/stores/user';

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      loading: false,
      error: null,
      showPassword: false,
    };
  },
  methods: {
    async loginUser() {
      this.error = null;
      this.loading = true;
      try {
        const res = await AuthService.login({
          email: this.email,
          password: this.password,
        });
        
        const userStore = useUserStore();
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        userStore.setUser(res.data.user);
        
        this.$router.push("/");
      } catch (err) {
        this.error = err.response?.data?.message || "Login failed";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
