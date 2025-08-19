<template>
  <nav class="navbar navbar-expand-lg bg-light border-bottom">
    <div class="container">
      <!-- Brand -->
      <router-link to="/" class="navbar-brand nav-style fw-bold"><img height="40" src="../assets/images/Logo.png" alt="">BlogSphere</router-link>

      <!-- Mobile Toggler -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Nav Links -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-lg-center">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li v-if="!isLoggedIn" class="nav-item">
            <a class="nav-link" href="#blogs">Blogs</a>
          </li>
          <li v-if="isLoggedIn" class="nav-item">
            <router-link to="/dashboard" class="nav-link" href="">Dashboard</router-link>
          </li>
          <template v-if="!isLoggedIn">
            <li class="nav-item">
              <a href="#features" class="nav-link" to="/features">Features</a >
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/register" class="btn btn-primary ms-lg-2">Sign Up</router-link>
            </li>
          </template>

          <template v-else>
            <li class="nav-item">
              <router-link class="nav-link" to="/create-post">Create Post</router-link>
            </li>
            <li class="nav-item">
              <button @click="logout" class="btn  bg-danger text-light ms-lg-2">Logout</button>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { AuthService } from "../services/api";

export default {
  name: "Navbar",
  data() {
    return {
      isLoggedIn: !!localStorage.getItem("token"),
    };
  },
  methods: {
    async logout() {
      try {
        await AuthService.logout();
      } catch (error) {
        console.error(error);
      }
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.isLoggedIn = false;
      this.$router.push("/login");
    },
  },
  watch: {
    $route() {
      this.isLoggedIn = !!localStorage.getItem("token");
    },
  },
};
</script>


<style scoped>
.nav-style{
  font-family: Edu NSW ACT  Cursive;
}
</style>