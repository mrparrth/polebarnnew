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

    <PaperCopyRequest v-model="projectStore.showPaperCopyRequest" />
    <PaperCopyInfo v-model="projectStore.showPaperCopyInfo" />
  </v-app>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useSnackbar } from '@/composables/useSnackbar'
import { useProjectStore } from '@/stores/projectStore'
import PaperCopyRequest from '@/components/PaperCopyRequest.vue'
import PaperCopyInfo from '@/components/PaperCopyInfo.vue'

const router = useRouter()
const { snackbar } = useSnackbar()
const projectStore = useProjectStore()

onMounted(() => {
  router.push('/login')
})
</script>
