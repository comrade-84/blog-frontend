<template>
  <div class="row g-4 mb-4">
    <!-- Published Posts Card -->
    <div class="col-12 col-md-4">
      <div class="card analytics-card published-card h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h6 class="card-subtitle mb-2">Published Posts</h6>
              <h2 class="card-title mb-0">{{ stats.published || 0 }}</h2>
            </div>
            <div class="icon-container">
              <i class="bi bi-file-earmark-text"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Draft Posts Card -->
    <div class="col-12 col-md-4">
      <div class="card analytics-card draft-card h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h6 class="card-subtitle mb-2">Draft Posts</h6>
              <h2 class="card-title mb-0">{{ stats.drafts || 0 }}</h2>
            </div>
            <div class="icon-container">
              <i class="bi bi-file-earmark"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Total Posts Card -->
    <div class="col-12 col-md-4">
      <div class="card analytics-card total-card h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h6 class="card-subtitle mb-2">Total Posts</h6>
              <h2 class="card-title mb-0">{{ stats.total || 0 }}</h2>
            </div>
            <div class="icon-container">
              <i class="bi bi-files"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardStats',
  props: {
    stats: {
      type: Object,
      required: true,
      default: () => ({
        published: 0,
        drafts: 0,
        total: 0
      })
    }
  }
}
</script>

<style scoped>
.analytics-card {
  transition: transform 0.2s, box-shadow 0.2s;
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
</style>
