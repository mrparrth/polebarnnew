<template>
  <v-dialog :model-value="props.modelValue" @update:model-value="emit('update:modelValue', $event)" max-width="600px">
    <v-card class="rounded-lg overflow-hidden">
      <v-card-title class="warning-header pa-6 pb-4">
        <div class="d-flex align-center">
          <v-icon icon="mdi-alert" class="me-3" size="28" color="white"></v-icon>
          <span class="text-h5 font-weight-bold">New Paper Copy Stock Request</span>
        </div>
      </v-card-title>

      <v-card-text class="pa-6">
        <div class="warning-message mb-4">
          <v-alert type="warning" variant="tonal" density="comfortable" class="mb-4" :icon="false">
            <span class="text-body-1 font-weight-medium">
              The following paper copy types are running low on stock. Click "Order Paper Copy" to
              place an order.
            </span>
          </v-alert>
        </div>

        <v-row no-gutters>
          <v-col cols="12" v-for="[type, label] in Object.entries(PAPER_COPY_TYPES)" :key="type">
            <v-card class="stock-item-card pa-4 mb-3" elevation="2" :class="PAPER_COPY_CARD_CSS_CLASSES[
              GET_STOCK_LEVEL_KEY(projectStore.paperCopyStock[type].qty)
              ]
              ">
              <div class="d-flex align-center justify-space-between">
                <div class="stock-info">
                  <div class="d-flex align-center mb-2">
                    <v-icon :icon="PAPER_COPY_ICONS[type]" :color="PAPER_COPY_STOCK_COLORS[
                      GET_STOCK_LEVEL_KEY(projectStore.paperCopyStock[type].qty)
                      ]
                      " class="me-2" size="24"></v-icon>
                    <h3 class="text-h6 font-weight-bold mb-0">{{ label }}</h3>
                  </div>
                  <div class="d-flex align-center flex-wrap gap-2">
                    <span class="text-body-2 text-medium-emphasis">
                      {{ projectStore.paperCopyStock[type].qty }} copies remaining
                    </span>
                  </div>
                </div>
                <div class="d-flex flex-column align-center gap-2">
                  <v-text-field v-model.number="orderQuantities[type]" type="number" min="1" max="10" variant="outlined"
                    density="compact" width="100px" hide-details :color="PAPER_COPY_STOCK_COLORS[
                      GET_STOCK_LEVEL_KEY(projectStore.paperCopyStock[type].qty)
                      ]
                      " prepend-inner-icon="mdi-package-variant" />
                  <div class="text-caption text-center mt-1 text-medium-emphasis">
                    Order Quantity
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-alert v-if="totalOrderQuantity > 0" type="info" variant="tonal" density="comfortable" class="mt-4">
          <div class="d-flex align-center">
            <v-icon icon="mdi-calculator" class="me-2"></v-icon>
            <span class="font-weight-bold">Total Order Quantity: {{ totalOrderQuantity }}</span>
          </div>
        </v-alert>
      </v-card-text>

      <v-card-actions class="warning-actions pa-6">
        <v-spacer />
        <v-btn variant="outlined" color="grey-darken-1" @click="dismissWarning" class="action-btn">
          Dismiss
        </v-btn>
        <v-btn color="warning" variant="flat" @click="orderPaperCopy" class="action-btn" :loading="isSubmitting">
          <v-icon icon="mdi-cart-plus" class="me-2"></v-icon>
          Order Paper Copy
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, watch, reactive, ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { API } from '@/services/apiService'
import { useSnackbar } from '@/composables/useSnackbar'
import {
  PAPER_COPY_TYPES,
  PAPER_COPY_ICONS,
  PAPER_COPY_STOCK_COLORS,
  PAPER_COPY_CARD_CSS_CLASSES,
  GET_STOCK_LEVEL_KEY,
  generateShortId,
} from '@/global'

const { showSnackbar } = useSnackbar()
const projectStore = useProjectStore()
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue'])
const orderQuantities = reactive({})
const isSubmitting = ref(false)

const totalOrderQuantity = computed(() => {
  return Object.values(orderQuantities).reduce((sum, qty) => sum + (qty || 0), 0)
})

const dismissWarning = () => {
  emit('update:modelValue', false)
}

const orderPaperCopy = async () => {
  isSubmitting.value = true

  try {
    const query = Object.fromEntries(
      Object.entries(orderQuantities).filter(([key, value]) => value > 0),
    )

    query.projectId = generateShortId('pc_')
    query.projectSubtype = 'paperCopyRequest'
    query.projectType = 'paperCopy'
    query.orderDate = new Date().toISOString()

    await API.orderPaperCopy(query)
    showSnackbar('Paper copy order placed!', 'success')
    dismissWarning()
    isSubmitting.value = false
  } catch (error) {
    console.error('Error ordering paper copy:', error)
    showSnackbar('Error ordering paper copy:', error)
    isSubmitting.value = false
  }
}

watch(
  () => projectStore.paperCopyStock,
  (newStats) => {
    if (newStats && Object.keys(newStats).length > 0) {
      Object.keys(orderQuantities).forEach((key) => delete orderQuantities[key])
      for (let key of Object.keys(newStats)) {
        orderQuantities[key] = newStats[key].qty <= projectStore.metaData.lowStockThreshold ? 10 : 0
      }
    }
  },
  { immediate: true, deep: true },
)
</script>

<style scoped>
.warning-header {
  background: linear-gradient(135deg, #000106 0%, #b5b1ba 100%);
  color: white !important;
}

.warning-header .v-icon {
  color: white !important;
}

.stock-info h3 {
  color: #2c3e50;
}

.warning-actions {
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.action-btn {
  border-radius: 8px !important;
  font-weight: 600;
  text-transform: none;
  padding: 0 24px;
}

.v-chip {
  border-radius: 20px !important;
  font-weight: 500;
}
</style>
