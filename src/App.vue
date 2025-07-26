//App.vue
<template>
  <v-app>
    <v-main class="main-gradient-bg">
      <router-view />
    </v-main>

    <!-- Global Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      location="bottom"
      class="global-snackbar"
    >
      {{ snackbar.message }}

      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar.show = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useSnackbar } from '@/composables/useSnackbar'

const router = useRouter()
const { snackbar } = useSnackbar()

onMounted(() => {
  router.push('/login')
})
</script>
