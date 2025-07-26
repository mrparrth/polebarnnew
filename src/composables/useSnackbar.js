import { reactive } from 'vue'

const snackbar = reactive({
  show: false,
  message: '',
  color: 'success',
  timeout: 3000,
})

export function useSnackbar() {
  const showSnackbar = (message, color = 'success', timeout = 3000) => {
    snackbar.message = message
    snackbar.color = color
    snackbar.timeout = timeout
    snackbar.show = true
  }

  const hideSnackbar = () => {
    snackbar.show = false
  }

  return {
    snackbar,
    showSnackbar,
    hideSnackbar,
  }
}
