<template>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card elevation="6" class="pa-8 text-center">
          <h1 class="text-h4 font-weight-bold mb-4">Dashboard</h1>
          <p class="mb-8">Welcome to the Pole Barn Dashboard!</p>
          <v-btn color="error" @click="logout" size="large">Logout</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
  localStorage.removeItem('authToken')
  router.push('/login')
}
</script>
