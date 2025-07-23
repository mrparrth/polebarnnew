<template>
  <v-container fluid class="login-bg fill-height d-flex align-center justify-center">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="5" lg="4">
        <v-card class="pa-8" elevation="10" rounded="xl">
          <div class="text-center mb-6">
            <v-img
              src="https://ucarecdn.com/e767c054-980a-4511-aabe-8d7cbe48d732/CeedCivilEngineering.jpg"
              width="100"
              class="mx-auto mb-4"
              style="border-radius: 12px"
            />
            <h2 class="text-h5 font-weight-bold mb-2">Welcome to Pole Barn Dashboard</h2>
            <div class="text-body-1 text-grey-darken-1 mb-4">Login to continue</div>
          </div>

          <v-form @submit.prevent="handleLogin">
            <v-text-field
              v-model="formData.username"
              label="Email Address"
              prepend-inner-icon="mdi-email"
              :rules="[(v) => !!v || 'Email is required']"
              color="primary"
              variant="outlined"
              density="comfortable"
              class="mb-4"
              required
            />

            <v-text-field
              v-model="formData.password"
              label="Password"
              prepend-inner-icon="mdi-lock"
              :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              :rules="[(v) => !!v || 'Password is required']"
              color="primary"
              variant="outlined"
              density="comfortable"
              class="mb-6"
              required
            />

            <div class="text-center">
              <v-btn type="submit" color="primary" size="large" block class="mb-4"> LOGIN </v-btn>
            </div>

            <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-2">
              {{ errorMessage }}
            </v-alert>

            <v-alert v-if="successMessage" type="success" variant="tonal" class="mb-2">
              {{ successMessage }}
            </v-alert>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { reactive, ref } from 'vue'

const formData = reactive({
  username: '',
  password: '',
})

const showPassword = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleLogin = () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!formData.username || !formData.password) {
    errorMessage.value = 'Please fill in all fields'
    return
  }
  successMessage.value = 'Login successful!'
}
</script>

<style scoped>
.login-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #e0e7ef 0%, #f5f6fa 100%);
}
</style>
