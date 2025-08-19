<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-5">
        <div class="card shadow">
          <div class="card-body">
            <h3 class="text-center mb-4" style="color: var(--primary-color)">Register</h3>

            <form @submit.prevent="registerUser">
              <div class="mb-3">
                <label>Name</label>
                <input type="text" v-model="name" class="form-control" required />
              </div>

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

              <div class="mb-3">
                <label>Confirm Password</label>
                <div class="input-group">
                  <input :type="showConfirmPassword ? 'text' : 'password'" v-model="password_confirmation" class="form-control" required />
                  <button type="button" class="btn btn-outline-secondary" @click="showConfirmPassword = !showConfirmPassword">
                    <i class="bi" :class="showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                  </button>
                </div>
              </div>

              <button type="submit" class="btn btn-primary-custom w-100" :disabled="loading">
                {{ loading ? "Registering..." : "Register" }}
              </button>

              <p class="mt-3 text-center">
                Already have an account?
                <router-link to="/login" style="color: var(--primary-color)">Login</router-link>
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

export default {
  name: "Register",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      loading: false,
      error: null,
      showPassword: false,
      showConfirmPassword: false,
    };
  },
  methods: {
    async registerUser() {
      this.error = null;
      this.loading = true;
      try {
        await AuthService.register({
          name: this.name,
          email: this.email,
          password: this.password,
          password_confirmation: this.password_confirmation,
        });
        this.$router.push("/login");
      } catch (err) {
        this.error = err.response?.data?.message || "Registration failed";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
