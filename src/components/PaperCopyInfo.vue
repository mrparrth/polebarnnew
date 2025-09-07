<template>
  <v-dialog
    :model-value="props.modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    max-width="700px"
  >
    <v-card class="rounded-lg overflow-hidden">
      <v-card-title class="dialog-header pa-6 pb-4">
        <div class="d-flex align-center">
          <v-icon icon="mdi-package-variant" class="me-3" size="28" color="primary"></v-icon>
          <span class="text-h5 font-weight-bold">Paper Copy Stock Management</span>
        </div>
      </v-card-title>

      <v-card-text class="pa-6">
        <v-row no-gutters>
          <v-col cols="12" v-for="(stock, type) in updatedPaperStock" :key="type">
            <v-card
              :class="PAPER_COPY_CARD_CSS_CLASSES[GET_STOCK_LEVEL_KEY(stock.qty)]"
              class="stock-item-card pa-4 mb-3"
              elevation="2"
            >
              <div class="d-flex align-center justify-space-between">
                <div class="stock-info">
                  <div class="d-flex align-center mb-2">
                    <v-icon
                      :icon="PAPER_COPY_ICONS[type]"
                      :color="PAPER_COPY_STOCK_COLORS[GET_STOCK_LEVEL_KEY(stock.qty)]"
                      class="me-2"
                      size="24"
                    ></v-icon>
                    <h3 class="text-h6 font-weight-bold mb-0">{{ PAPER_COPY_TYPES[type] }}</h3>
                  </div>
                  <div class="d-flex align-center flex-wrap gap-2">
                    <v-chip
                      :color="
                        PAPER_COPY_STOCK_COLORS[GET_STOCK_LEVEL_KEY(origPaperStock[type]?.qty || 0)]
                      "
                      :variant="(origPaperStock[type]?.qty || 0) <= 2 ? 'flat' : 'tonal'"
                      size="small"
                      class="me-2"
                    >
                      <v-icon
                        :icon="
                          (origPaperStock[type]?.qty || 0) <= 2 ? 'mdi-alert' : 'mdi-check-circle'
                        "
                        class="me-1"
                        size="16"
                      ></v-icon>
                      {{ (origPaperStock[type]?.qty || 0) <= 2 ? 'Low Stock' : 'In Stock' }}
                    </v-chip>
                    <span class="text-body-2 text-medium-emphasis">
                      {{ origPaperStock[type]?.qty || 0 }} copies available
                    </span>
                    <span
                      v-if="stock.qty !== origPaperStock[type]?.qty"
                      class="text-body-2 text-primary ml-2 font-weight-medium"
                    >
                      → will be updated to {{ stock.qty }}
                    </span>
                  </div>
                </div>
                <div class="stock-controls">
                  <v-btn
                    icon="mdi-minus"
                    :color="stock.qty <= 0 ? 'grey-lighten-1' : 'error'"
                    variant="flat"
                    size="small"
                    @click="decreaseStock(type)"
                    :disabled="stock.qty <= 0"
                    class="control-btn"
                  />
                  <v-text-field
                    v-model.number="stock.qty"
                    type="number"
                    variant="outlined"
                    density="compact"
                    class="stock-input mx-2"
                    min="0"
                    hide-details
                    width="80px"
                    :color="PAPER_COPY_STOCK_COLORS[GET_STOCK_LEVEL_KEY(stock.qty)]"
                  />
                  <v-btn
                    icon="mdi-plus"
                    color="success"
                    variant="flat"
                    size="small"
                    @click="increaseStock(type)"
                    class="control-btn"
                  />
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="dialog-actions pa-6">
        <v-btn
          color="warning"
          variant="flat"
          @click="handlePlaceOrder"
          class="action-btn"
          :disabled="isSaving"
        >
          <v-icon icon="mdi-cart-plus" class="me-2"></v-icon>
          Place an Order
        </v-btn>
        <v-spacer />
        <v-btn variant="outlined" color="grey-darken-1" @click="handleCancel" class="action-btn">
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="handleSave"
          :loading="isSaving"
          class="action-btn"
          :disabled="!atLeastOneChange"
        >
          <v-icon icon="mdi-content-save" class="me-2"></v-icon>
          Update Stock
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { API } from '@/services/apiService'
import { useProjectStore } from '@/stores/projectStore'
import { useSnackbar } from '@/composables/useSnackbar'
import {
  PAPER_COPY_TYPES,
  PAPER_COPY_ICONS,
  PAPER_COPY_STOCK_COLORS,
  PAPER_COPY_CARD_CSS_CLASSES,
  GET_STOCK_LEVEL_KEY,
} from '@/global'

const projectStore = useProjectStore()
const { showSnackbar } = useSnackbar()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const updatedPaperStock = ref({})
const origPaperStock = ref({})
const isSaving = ref(false)
const atLeastOneChange = ref(false)

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      loadStockData()
    }
  },
)

watch(
  updatedPaperStock,
  (newValue) => {
    atLeastOneChange.value = Object.entries(newValue).some(
      ([key, value]) => value.qty != origPaperStock.value[key].qty,
    )
  },
  { deep: true },
)

function loadStockData() {
  updatedPaperStock.value = JSON.parse(JSON.stringify(projectStore.paperCopyStock))
  origPaperStock.value = JSON.parse(JSON.stringify(projectStore.paperCopyStock))
}

function increaseStock(type) {
  if (updatedPaperStock.value[type]) {
    updatedPaperStock.value[type].qty++
  }
}

function decreaseStock(type) {
  if (updatedPaperStock.value[type] && updatedPaperStock.value[type].qty > 0) {
    updatedPaperStock.value[type].qty--
  }
}

function handleCancel() {
  emit('update:modelValue', false)
  updatedPaperStock.value = JSON.parse(JSON.stringify(origPaperStock.value))
}

async function handleSave() {
  isSaving.value = true
  try {
    let dataToSend = Object.fromEntries(
      Object.entries(updatedPaperStock.value).filter(
        ([key, value]) => value.qty != origPaperStock.value[key].qty,
      ),
    )
    API.updatePaperCopyStock(dataToSend)

    projectStore.setPaperCopyStock(updatedPaperStock.value, false)

    emit('update:modelValue', false)
  } catch (error) {
    showSnackbar('Error saving paper stock:', error)
  } finally {
    isSaving.value = false
  }
}

function handlePlaceOrder() {
  projectStore.setShowPaperCopyRequest(true)

  emit('update:modelValue', false)
}
</script>

<style scoped>
.dialog-header {
  background: linear-gradient(135deg, #000106 0%, #b5b1ba 100%);
  color: white !important;
}

.dialog-header .v-icon {
  color: white !important;
}

.good-stock-card {
  border-left-color: #4caf50 !important;
  background: linear-gradient(135deg, #f8fff8 0%, #e8f5e8 100%);
}

.warning-stock-card {
  border-left-color: #ff9800 !important;
  background: linear-gradient(135deg, #fff8f0 0%, #ffe8d1 100%);
}

.low-stock-card {
  border-left-color: #f44336 !important;
  background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
}

.stock-info h3 {
  color: #2c3e50;
}

.stock-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-btn {
  border-radius: 8px !important;
  min-width: 36px !important;
  height: 36px !important;
}

.stock-input :deep(.v-field) {
  border-radius: 8px !important;
}

.dialog-actions {
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.action-btn {
  border-radius: 8px !important;
  font-weight: 600;
  text-transform: none;
  padding: 0 24px;
}

/* Custom chip styling */
.v-chip {
  border-radius: 20px !important;
  font-weight: 500;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .stock-item-card {
    padding: 16px !important;
  }

  .stock-controls {
    flex-direction: column;
    gap: 4px;
  }

  .stock-input {
    width: 60px;
  }
}
</style>
