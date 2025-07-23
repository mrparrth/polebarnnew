//App.vue
<template>
  <v-app>
    <v-main class="main-gradient-bg">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const router = useRouter()

onMounted(() => {
  router.push('/login')
})
</script>
