<template>
  <section id="features" class="py-5 bg-light">
    <div class="container">
      <div class="text-center mb-5">
        <h2 class="fw-bold">Our Features</h2>
        <p class="text-muted">
          Discover the amazing benefits of using our platform
        </p>
      </div>
      <div class="row g-4">
        <div
          class="col-md-4"
          v-for="(feature, index) in features"
          :key="index"
        >
          <div class="card h-100 border-0 shadow-sm text-center p-4">
            <div
              class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
              style="width: 60px; height: 60px;"
            >
              <i :class="feature.icon" style="font-size: 1.5rem;"></i>
            </div>
            <h5 class="fw-bold">{{ feature.title }}</h5>
            <p class="text-muted">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "FeaturesSection",
  data() {
    return {
      features: [
        {
          icon: "bi bi-speedometer2",
          title: "Fast & Reliable",
          description: "Our service is designed for speed, ensuring quick access to your needs.",
        },
        {
          icon: "bi bi-shield-lock",
          title: "Secure Platform",
          description: "We use top-notch security protocols to keep your data safe.",
        },
        {
          icon: "bi bi-people",
          title: "User Friendly",
          description: "An intuitive design that makes navigation and use a breeze.",
        },
      ],
    };
  },
};
</script>

<style scoped>
.card:hover {
  transform: translateY(-5px);
  transition: 0.3s;
}
</style>
