<template>
  <div class="login-page">
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
                <v-btn
                  type="submit"
                  color="primary"
                  size="large"
                  block
                  class="mb-4"
                  :loading="isLoading"
                  :disabled="isLoading"
                >
                  {{ isLoading ? 'LOGGING IN...' : 'LOGIN' }}
                </v-btn>
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
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { API } from '@/services/apiService'
import { useRouter } from 'vue-router'
import { DEV_ENV } from '@/global'
import { useProjectStore } from '@/stores/projectStore'

const projectStore = useProjectStore()

const formData = reactive({
  username: '',
  password: '',
})

const showPassword = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)
const router = useRouter()

const handleLogin = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  if (!formData.username || !formData.password) {
    errorMessage.value = 'Please fill in all fields'
    isLoading.value = false
    return
  }

  try {
    const result = await API.login(formData.username, formData.password)
    projectStore.setProjects(result.data)
    projectStore.setUser(result.user)
    localStorage.setItem('authToken', result.token)
    successMessage.value = 'Login successful!'
    router.push('/form')
  } catch (error) {
    errorMessage.value = error.message
    throw error
  } finally {
    isLoading.value = false
  }
}

const checkExistingSession = async () => {
  isLoading.value = true
  try {
    const result = await API.autoLogin()
    if (result.token) {
      localStorage.setItem('authToken', result.token)
      projectStore.setProjects(result.data)
      router.push('/form')
    }
  } catch (error) {
    errorMessage.value = error.message
    console.error(`Auto login failed: Do try to login manually`)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  if (DEV_ENV) {
    let email = 'test@test.com'
    let password = '123456'
    formData.username = email
    formData.password = password
    try {
      isLoading.value = true
      await handleLogin()
      router.push('/form')
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  } else {
    await checkExistingSession()
  }
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  width: 100%;
}

.login-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #e0e7ef 0%, #f5f6fa 100%);
}
</style>
