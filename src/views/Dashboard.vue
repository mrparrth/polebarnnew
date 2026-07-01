<template>
  <v-container fluid class="project-form-bg d-flex justify-center">
    <v-row justify="center" align="center" class="fill-height" style="max-width: 1280px; width: 100%;">
      <v-col cols="12" class="fill-height">
        <v-card elevation="8" class="pa-0 rounded-xl main-form-card fill-height">
          <v-sheet class="header-bar d-flex align-center py-4 position-relative" elevation="0">
            <v-img src="https://ucarecdn.com/e767c054-980a-4511-aabe-8d7cbe48d732/CeedCivilEngineering.jpg" height="100"
              width="100" class="rounded-lg position-absolute"
              style="left: 30px; top: 50%; transform: translateY(-50%)" />
            <div class="position-absolute w-100 d-flex justify-center">
              <h2 class="form-title mb-0 text-center">
                Site Specific Pole Barn <br />Order Form & Agreement
              </h2>
            </div>
            <div class="position-absolute d-flex flex-column" style="right: 20px; top: 33px; gap: 10px">
              <v-btn v-if="isElevatedDashboardUser" color="secondary" variant="flat" @click="updatePaperStock">Update
                Paper
                Stock</v-btn>
              <v-btn color="primary" variant="flat" @click="newProject">New Project</v-btn>
            </div>
          </v-sheet>
          <v-main class="dashboard-main">
            <v-row class="px-6 py-2">
              <v-col cols="12" class="d-flex justify-start">
                <div class="d-flex ga-4">
                  <div class="d-flex ga-2 align-center">
                    <div class="legend-color non-florida"></div>
                    <span>Non-Florida Projects</span>
                  </div>
                  <div class="d-flex ga-2 align-center">
                    <div class="legend-color florida-wet-seal"></div>
                    <span>Florida Projects with Wet Map and Seal</span>
                  </div>
                </div>
              </v-col>
            </v-row>

            <v-card elevation="1" class="dashboard-card">
              <!-- Search Bar and Controls -->
              <v-card-text class="py-3 px-5">
                <v-row class="pr-2" align="center">
                  <v-col cols="6">
                    <v-text-field v-model="searchQuery" placeholder="Search projects..."
                      prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details clearable
                      @input="filterProjects" />
                  </v-col>
                  <v-col cols="3" class="d-flex justify-end align-center">
                    <v-select v-model="projectStore.dashboardFilter" label="Project Type" hide-details
                      variant="outlined" density="compact" :items="Object.entries(projectTypeOptions)" item-title="1"
                      item-value="0" />
                  </v-col>
                  <v-col cols="2" class="d-flex justify-end align-center">
                    <v-checkbox v-model="showArchived" label="Show Archived" hide-details density="compact" />
                  </v-col>
                  <v-col cols="1" class="d-flex justify-end align-center">
                    <v-btn icon color="primary" variant="text" :loading="loading" @click="refreshDashboardData">
                      <v-icon>mdi-refresh</v-icon>
                      <v-tooltip activator="parent" location="top">Get Latest Updated Projects</v-tooltip>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>

              <!-- Projects Table -->
              <v-card-text class="pt-0 flex-grow-1 d-flex flex-column">
                <v-data-table :headers="headers" :items="filteredProjects" :loading="loading" :items-per-page="-1"
                  class="projects-table flex-grow-1" hover item-value="id" :sort-by="sortBy"
                  @update:sort-by="(value) => (sortBy = value)">
                  <template v-slot:item="{ item }">
                    <tr :class="getRowClass(item)">
                      <td>{{ item.data.projectId }}</td>
                      <td v-if="isElevatedDashboardUser">{{ item.data.fBInvoiceId || 'N/A' }}</td>
                      <td>{{ item.data.clientName }}</td>
                      <td>{{ item.data.projectName }}</td>
                      <td>{{ formatDate(item.data.orderDate) }}</td>
                      <td>
                        <v-btn v-if="item.data.driveFolder" variant="text" color="primary" size="small" icon
                          @click.stop="openFolder(item.data.driveFolder)">
                          <v-icon>mdi-open-in-new</v-icon>
                        </v-btn>
                        <span v-else class="text-grey">N/A</span>
                      </td>
                      <td>
                        <v-select :model-value="item.data.status" :items="statusOptions" variant="outlined"
                          density="compact" hide-details class="status-select"
                          @update:model-value="(value) => updateStatus(item.data.projectId, value)" />
                      </td>
                      <td>
                        <div class="d-flex align-center justify-end ga-1">
                          <!-- View Only Details Button -->
                          <v-btn icon size="x-small" variant="text" color="grey-darken-1" @click="viewOnly(item)">
                            <v-icon size="16">mdi-eye</v-icon>
                            <v-tooltip activator="parent" location="top">View Details (Read-only)</v-tooltip>
                          </v-btn>

                          <!-- Kebab Menu Actions -->
                          <v-menu location="bottom end" transition="scale-transition">
                            <template v-slot:activator="{ props }">
                              <v-btn v-bind="props" variant="text" size="small" icon="mdi-dots-vertical" />
                            </template>
                            <v-list class="py-1 rounded-lg" elevation="4">
                              <!-- Edit/View Details -->
                              <v-list-item @click="viewDetails(item)">
                                <template v-slot:prepend>
                                  <v-icon color="primary" class="mr-2">
                                    {{ isElevatedDashboardUser && item.data.projectType !== 'paperCopy' ? 'mdi-pencil' :
                                      'mdi-eye' }}
                                  </v-icon>
                                </template>
                                <v-list-item-title class="text-body-2 font-weight-medium">
                                  {{ isElevatedDashboardUser && item.data.projectType !== 'paperCopy' ? 'Edit Details' :
                                    'View Details' }}
                                </v-list-item-title>
                              </v-list-item>
                              <!-- Revision History -->
                              <v-list-item v-if="item.data.projectType !== 'paperCopy'"
                                @click="handleShowHistoryDialog(item.data.projectId)">
                                <template v-slot:prepend>
                                  <v-icon color="indigo" class="mr-2">mdi-history</v-icon>
                                </template>
                                <v-list-item-title class="text-body-2 font-weight-medium">Revision
                                  History</v-list-item-title>
                              </v-list-item>

                              <!-- View PDF -->
                              <v-list-item v-if="item.data.pdfUrl" @click="openFolder(item.data.pdfUrl)">
                                <template v-slot:prepend>
                                  <v-icon color="red-darken-2" class="mr-2">mdi-file-pdf-box</v-icon>
                                </template>
                                <v-list-item-title class="text-body-2 font-weight-medium">View PDF</v-list-item-title>
                              </v-list-item>

                              <!-- Generate PDF -->
                              <v-list-item
                                v-if="standardBuildings.includes(item.data.projectType) && [USER_TYPES.Admin, USER_TYPES.Employee].includes(projectStore.user?.type)"
                                @click="handlePdfGenerateClick(item)">
                                <template v-slot:prepend>
                                  <v-icon color="red-darken-2" class="mr-2">mdi-file-pdf-box</v-icon>
                                </template>
                                <v-list-item-title class="text-body-2 font-weight-medium"> {{ item.data.pdfUrl ?
                                  'Regenerate PDF' : 'Generate PDF' }}</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </div>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-main>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <PaperCopyStockRequest />
  <PaperCopyStockInfo v-model="paperStockDialog" />

  <!-- Revision History Dialog -->
  <v-dialog v-model="showHistoryDialog" max-width="700px" scrollable>
    <v-card class="rounded-xl pa-4">
      <v-card-title class="d-flex align-center justify-space-between pb-3 border-bottom">
        <div class="d-flex align-center ga-2">
          <v-icon color="indigo" class="mr-2">mdi-history</v-icon>
          <span class="text-h6 font-weight-bold text-grey-darken-3">Revision History</span>
        </div>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" color="grey-darken-1" @click="showHistoryDialog = false" />
      </v-card-title>

      <v-card-text class="py-4">
        <div v-if="isLoadingHistory" class="d-flex flex-column align-center justify-center py-8">
          <v-progress-circular indeterminate color="indigo" size="48" class="mb-2" />
          <span class="text-body-2 text-grey-darken-1">Loading revision log...</span>
        </div>

        <div v-else-if="projectHistory.length === 0" class="d-flex flex-column align-center justify-center py-8">
          <v-icon size="64" color="grey-lighten-1" class="mb-2">mdi-history-off</v-icon>
          <span class="text-body-1 font-weight-medium text-grey-darken-2">No History Found</span>
          <span class="text-body-2 text-grey-darken-1 text-center mt-1">
            This project has no recorded revisions yet.
          </span>
        </div>

        <v-timeline v-else side="end" align="start" density="comfortable" class="revision-timeline">
          <v-timeline-item v-for="(item, index) in projectHistory" :key="index" dot-color="indigo-lighten-1"
            size="small">
            <template v-slot:opposite>
              <div class="text-caption text-grey-darken-1 font-weight-bold">
                {{ formatDateTime(item.time) }}
              </div>
            </template>

            <v-card class="elevation-1 rounded-lg border pa-3 bg-grey-lighten-5">
              <div class="d-flex align-center justify-space-between mb-1">
                <span class="text-subtitle-2 font-weight-bold text-indigo-darken-2 mr-4">{{ item.email }}</span>
                <span class="text-caption text-grey d-sm-none">{{ formatDateTime(item.time) }}</span>
              </div>
              <div class="text-body-2 text-grey-darken-3" style="white-space: pre-line;">{{ item.diff }}</div>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-card-text>

      <v-card-actions class="pt-3 border-top justify-end">
        <v-btn color="grey-darken-1" variant="text" @click="showHistoryDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- PDF Already Exists Dialog -->
  <v-dialog v-model="showPdfExistsDialog" max-width="500">
    <v-card class="rounded-xl pa-4">
      <v-card-title class="d-flex align-center justify-space-between pb-3 border-bottom">
        <div class="d-flex align-center ga-2">
          <v-icon color="info" class="mr-2">mdi-information</v-icon>
          <span class="text-h6 font-weight-bold text-grey-darken-3">PDF Already Exists</span>
        </div>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" color="grey-darken-1" @click="showPdfExistsDialog = false" />
      </v-card-title>

      <v-card-text class="py-4 text-center">
        <v-icon size="64" color="info" class="mb-4">mdi-file-check-outline</v-icon>
        <div class="text-body-1 font-weight-bold mb-2">A PDF already exists for this project.</div>
        <div class="text-body-2 text-grey-darken-1 mb-4">
          The document was already created and is ready to view.
        </div>
        <v-btn :href="selectedProjectPdfUrl" target="_blank" color="red-darken-2" variant="flat"
          prepend-icon="mdi-open-in-new" class="text-none">
          Open PDF Document
        </v-btn>
      </v-card-text>

      <v-card-actions class="pt-3 border-top justify-end">
        <v-btn color="grey-darken-1" variant="text" @click="showPdfExistsDialog = false">Close</v-btn>
        <v-btn color="red-darken-2" variant="flat" @click="confirmRegeneratePdf">Regenerate</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- PDF Age Confirmation Dialog -->
  <v-dialog v-model="showAgeConfirmationDialog" max-width="500">
    <v-card class="rounded-xl pa-4">
      <v-card-title class="d-flex align-center justify-space-between pb-3 border-bottom">
        <div class="d-flex align-center ga-2">
          <v-icon color="warning" class="mr-2">mdi-alert</v-icon>
          <span class="text-h6 font-weight-bold text-grey-darken-3">Generate PDF manually?</span>
        </div>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" color="grey-darken-1" @click="showAgeConfirmationDialog = false" />
      </v-card-title>

      <v-card-text class="py-4 text-body-1 text-grey-darken-2">
        <div class="mb-3">
          This project was created less than 2 hours ago.
        </div>
        <div class="mb-4 text-body-2 text-grey-darken-1">
          A background PDF generation task is already scheduled to run. Generating it manually now will cancel the
          scheduled task.
        </div>
        <div>
          Are you sure you want to proceed with manual generation?
        </div>
      </v-card-text>

      <v-card-actions class="pt-3 border-top justify-end ga-2">
        <v-btn color="grey-darken-1" variant="text" @click="showAgeConfirmationDialog = false">Cancel</v-btn>
        <v-btn color="red-darken-2" variant="flat" class="text-white font-weight-bold px-4"
          @click="confirmManualPdfGenerate">
          Proceed
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- PDF Generation Success Dialog -->
  <v-dialog v-model="showPdfSuccessDialog" max-width="500">
    <v-card class="rounded-xl pa-4">
      <v-card-title class="d-flex align-center justify-space-between pb-3 border-bottom">
        <div class="d-flex align-center ga-2">
          <v-icon color="success" class="mr-2">mdi-check-circle</v-icon>
          <span class="text-h6 font-weight-bold text-grey-darken-3">PDF Generated</span>
        </div>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" color="grey-darken-1" @click="showPdfSuccessDialog = false" />
      </v-card-title>

      <v-card-text class="py-4 text-center">
        <v-icon size="64" color="success" class="mb-4">mdi-file-check</v-icon>
        <div class="text-body-1 font-weight-bold mb-2">The PDF has been generated successfully!</div>
        <div class="text-body-2 text-grey-darken-1 mb-4">You can now view or download the document using the button
          below.
        </div>

        <v-btn :href="generatedPdfUrl" target="_blank" color="red-darken-2" variant="flat"
          prepend-icon="mdi-open-in-new" class="text-none">
          Open PDF Document
        </v-btn>
      </v-card-text>

      <v-card-actions class="pt-3 border-top justify-end">
        <v-btn color="primary" variant="flat" @click="showPdfSuccessDialog = false">Done</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- PDF Generation Loading Overlay -->
  <v-overlay :model-value="isGeneratingPdf" class="align-center justify-center" persistent>
    <v-card class="pa-6 rounded-xl text-center" max-width="320" elevation="12">
      <v-progress-circular indeterminate color="red-darken-2" size="64" width="6" class="mb-4" />
      <div class="text-h6 font-weight-bold text-grey-darken-3 mb-1">Generating PDF</div>
      <div class="text-body-2 text-grey-darken-1">Please wait while we prepare your document...</div>
    </v-card>
  </v-overlay>

  <!-- Error Alert Dialog -->
  <v-dialog v-model="showErrorDialog" max-width="500">
    <v-card class="rounded-xl pa-4">
      <v-card-title class="d-flex align-center justify-space-between pb-3 border-bottom">
        <div class="d-flex align-center ga-2">
          <v-icon color="red-darken-2" class="mr-2">mdi-alert-circle</v-icon>
          <span class="text-h6 font-weight-bold text-grey-darken-3">{{ errorDialogTitle || 'Error' }}</span>
        </div>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" color="grey-darken-1" @click="showErrorDialog = false" />
      </v-card-title>

      <v-card-text class="py-4 text-body-1 text-grey-darken-2">
        <div v-if="errorDialogMessages.length === 1">
          {{ errorDialogMessages[0] }}
        </div>
        <ul v-else-if="errorDialogMessages.length > 1" class="pl-4">
          <li v-for="(msg, index) in errorDialogMessages" :key="index" class="mb-1">
            {{ msg }}
          </li>
        </ul>
      </v-card-text>

      <v-card-actions class="pt-3 border-top justify-end">
        <v-btn color="red-darken-2" variant="flat" class="text-white font-weight-bold px-6"
          @click="showErrorDialog = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Scroll to Top Button -->
  <v-btn v-show="showScrollTop" color="primary" icon="mdi-arrow-up" size="large" elevation="4" class="scroll-to-top-btn"
    @click="scrollToTop" />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { API } from '@/services/apiService'
import { useProjectStore } from '@/stores/projectStore'
import { useSnackbar } from '@/composables/useSnackbar'
import PaperCopyStockRequest from '@/components/PaperCopyRequest.vue'
import PaperCopyStockInfo from '@/components/PaperCopyInfo.vue'
import { USER_TYPES } from '@/global'

const router = useRouter()
const projectStore = useProjectStore()
const isElevatedDashboardUser = ref([USER_TYPES.Admin, USER_TYPES.Client].includes(projectStore.user.type))
const loading = ref(false)
const searchQuery = ref('')
// const projectTypeFilter = ref('allPoleBarnTypes')
const showArchived = ref(false)
const { showSnackbar } = useSnackbar()

const paperStockDialog = ref(false)
const showScrollTop = ref(false)
const showHistoryDialog = ref(false)
const isLoadingHistory = ref(false)
const projectHistory = ref([])
const showErrorDialog = ref(false)
const errorDialogTitle = ref('Error')
const errorDialogMessages = ref([])

function parseErrorMessage(message) {
  if (!message) return ['An unknown error occurred']

  // Clean up "Error: " prefix from Google Apps Script if present
  let cleanMessage = message.replace(/^Error:\s*/i, '')

  if (cleanMessage.includes('||')) {
    return cleanMessage.split('||').map(msg => msg.trim()).filter(Boolean)
  }
  return [cleanMessage]
}

function triggerErrorDialog(title, message) {
  errorDialogTitle.value = title
  errorDialogMessages.value = parseErrorMessage(message)
  showErrorDialog.value = true
}

const standardBuildings = ['standardOpb', 'standardLeanTo', 'standardSingleSlope']
const selectedProjectId = ref('')
const selectedProjectPdfUrl = ref('')
const isGeneratingPdf = ref(false)
const showPdfExistsDialog = ref(false)
const showAgeConfirmationDialog = ref(false)
const showPdfSuccessDialog = ref(false)
const generatedPdfUrl = ref('')

async function refreshDashboardData() {
  if (loading.value || isGeneratingPdf.value || isLoadingHistory.value) {
    return
  }
  loading.value = true
  try {
    const freshProjects = await API.getSubmissionData()
    if (Array.isArray(freshProjects)) {
      projectStore.setProjects(freshProjects)
      projects.value = freshProjects
      showSnackbar('Dashboard data refreshed!', 'success')
    }
  } catch (error) {
    console.error('Error refreshing dashboard data:', error)
    triggerErrorDialog('Refresh Error', error.message || error)
  } finally {
    loading.value = false
  }
}

const projects = ref(projectStore.projects)

const headers = computed(() => {
  if (isElevatedDashboardUser.value) {
    return [
      { title: 'Project ID', key: 'id', sortable: true, width: '6%' },
      { title: 'Invoice ID', key: 'invoiceId', sortable: true, width: '6%' },
      { title: 'Client Name', key: 'clientName', sortable: true, width: '23%' },
      { title: 'Project Name', key: 'projectName', sortable: true, width: '23%' },
      { title: 'Order Date', key: 'orderDate', sortable: true, width: '11%' },
      { title: 'Folder Link', key: 'folderLink', sortable: false, width: '4%' },
      { title: 'Status', key: 'status', sortable: true, width: '24%' },
      { title: '', key: 'actions', sortable: false, width: '3%' },
    ]
  } else {
    return [
      { title: 'Project ID', key: 'id', sortable: true, width: '5%' },
      { title: 'Client Name', key: 'clientName', sortable: true, width: '25%' },
      { title: 'Project Name', key: 'projectName', sortable: true, width: '25%' },
      { title: 'Order Date', key: 'orderDate', sortable: true, width: '13%' },
      { title: 'Folder Link', key: 'folderLink', sortable: false, width: '5%' },
      { title: 'Status', key: 'status', sortable: true, width: '24%' },
      { title: '', key: 'actions', sortable: false, width: '3%' },
    ]
  }
})

const projectTypeOptions = {
  all: 'All',
  allPoleBarnTypes: 'All Pole Barn Types',
  standardOpb: 'Typical OPB ONLY',
  standardLeanTo: 'Typical Lean To ONLY',
  standardSingleSlope: 'Typical Single Slope ONLY',
  customPoleBarn: 'Custom Pole Barn',
  paperCopy: 'All Paper Copy',
  paperCopyRequest: 'Paper Copy Request',
  paperCopySold: 'Paper Copy Sold',
}

const statusOptions = [
  'New Request',
  'Accepted',
  'In Progress',
  'For Review by BW',
  'Approved by BW',
  'Rework',
  'S&S',
  'Delivered',
  'Archived',
]

const sortBy = ref([{ key: 'id', order: 'desc' }])

const filteredProjects = computed(() => {
  let filtered = projects.value

  if (!showArchived.value) {
    filtered = filtered.filter((project) => project.data.status !== 'Archived')
  }
  if (projectStore.dashboardFilter) {
    filtered = filtered.filter((project) => {
      if (projectStore.dashboardFilter === 'all') {
        return true
      } else if (project.data.projectType === projectStore.dashboardFilter) {
        return true
      } else if (projectStore.dashboardFilter === 'allPoleBarnTypes') {
        return (
          project.data.projectType === 'customPoleBarn' ||
          project.data.projectType === 'standardOpb' ||
          project.data.projectType === 'standardLeanTo' ||
          project.data.projectType === 'standardSingleSlope' ||
          !project.data.projectType
        )
      } else if (projectStore.dashboardFilter === 'customPoleBarn' && !project.data.projectType) {
        return true
      } else if (
        projectStore.dashboardFilter === 'paperCopy' &&
        project.data.projectType === 'paperCopy'
      ) {
        return true
      } else if (
        projectStore.dashboardFilter === 'paperCopyRequest' &&
        project.data.projectSubtype === 'paperCopyRequest'
      ) {
        return true
      } else if (
        projectStore.dashboardFilter === 'paperCopySold' &&
        project.data.projectSubtype === 'paperCopySold'
      ) {
        return true
      }
    })
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (project) =>
        String(project.data.projectId).toLowerCase().includes(query) ||
        (project.data.projectName || '').toLowerCase().includes(query) ||
        (project.data.clientName || '').toLowerCase().includes(query),
    )
  }

  // Apply sorting
  let sortKey = 'id'
  let sortOrder = 'desc'

  if (sortBy.value && sortBy.value.length > 0) {
    const sortConfig = sortBy.value[0]
    sortKey = sortConfig.key
    sortOrder = sortConfig.order
  }

  filtered = [...filtered].sort((a, b) => {
    let aValue, bValue

    switch (sortKey) {
      case 'id':
        aValue = a.data.projectId
        bValue = b.data.projectId
        break
      case 'invoiceId':
        aValue = a.data.fBInvoiceId || ''
        bValue = b.data.fBInvoiceId || ''
        break
      case 'clientName':
        aValue = a.data.clientName
        bValue = b.data.clientName
        break
      case 'projectName':
        aValue = a.data.projectName
        bValue = b.data.projectName
        break
      case 'orderDate':
        aValue = a.data.orderDate ? new Date(a.data.orderDate).getTime() : 0
        bValue = b.data.orderDate ? new Date(b.data.orderDate).getTime() : 0
        break
      case 'status':
        aValue = a.data.status
        bValue = b.data.status
        break
      default:
        return 0
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  return filtered
})

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function updatePaperStock() {
  paperStockDialog.value = true
}

function getRowClass(item) {
  if (!['FL', 'FLORIDA'].includes(item.data.state?.toUpperCase())) {
    return 'non-florida-row'
  } else if (item.data.wetMapAndSeal) {
    return 'florida-wet-seal-row'
  }
  return ''
}

function filterProjects() { }

function viewDetails(item) {
  router.push(`/form?projectId=${item.data.projectId}`)
}

function viewOnly(item) {
  router.push(`/form?projectId=${item.data.projectId}&mode=view`)
}

function newProject() {
  router.push('/form')
}

function openFolder(url) {
  window.open(url, '_blank')
}

async function handlePdfGenerateClick(project) {
  const projectId = project.data.projectId
  selectedProjectId.value = projectId

  if (project.data.pdfUrl) {
    selectedProjectPdfUrl.value = project.data.pdfUrl
    showPdfExistsDialog.value = true
    return
  }

  await executePdfGenerationCheck()
}

async function confirmRegeneratePdf() {
  showPdfExistsDialog.value = false
  await executePdfGenerationCheck(true)
}

async function executePdfGenerationCheck(forceRegenerate = false) {
  const projectId = selectedProjectId.value

  // 1. Fetch latest data first
  loading.value = true
  isGeneratingPdf.value = true

  try {
    const freshProjects = await API.getSubmissionData()
    if (freshProjects && Array.isArray(freshProjects)) {
      projectStore.setProjects(freshProjects)
      projects.value = freshProjects
    }
  } catch (err) {
    console.error('Error fetching latest project data before PDF check:', err)
  } finally {
    loading.value = false
  }

  // 2. Locate the updated project record
  const updatedProject = projects.value.find(p => p.data.projectId === projectId)
  if (!updatedProject) return

  const pdfUrl = updatedProject.data.pdfUrl || ''
  selectedProjectPdfUrl.value = pdfUrl

  // 3. Check if it already has a pdfUrl
  if (pdfUrl && !forceRegenerate) {
    showPdfExistsDialog.value = true
    isGeneratingPdf.value = false
  } else {
    // 4. Check if less than 2 hours since project creation
    const createdAt = updatedProject.data.createdAt
    const createdTime = createdAt ? new Date(createdAt).getTime() : 0
    const now = new Date().getTime()
    const hoursSinceCreation = createdTime ? (now - createdTime) / (1000 * 60 * 60) : 999

    if (createdAt && hoursSinceCreation < 2) {
      showAgeConfirmationDialog.value = true
      isGeneratingPdf.value = false
    } else {
      await generatePdf(projectId)
    }
  }
}

async function confirmManualPdfGenerate() {
  showAgeConfirmationDialog.value = false
  await generatePdf(selectedProjectId.value)
}

async function generatePdf(projectId) {
  isGeneratingPdf.value = true
  try {
    const result = await API.generatePdf(projectId)
    if (result && result.pdfUrl) {
      // Update local state
      const project = projects.value.find((p) => p.data.projectId === projectId)
      if (project) {
        project.data.pdfUrl = result.pdfUrl
      }
      projectStore.updateProject(projectId, { data: { pdfUrl: result.pdfUrl } })
      generatedPdfUrl.value = result.pdfUrl
      showPdfSuccessDialog.value = true
    } else {
      showSnackbar('Failed to generate PDF: No URL returned', 'error')
    }
  } catch (error) {
    console.error('Error generating PDF:', error)
    triggerErrorDialog('PDF Generation Error', error.message || error)
  } finally {
    isGeneratingPdf.value = false
  }
}

async function updateStatus(projectId, newStatus) {
  const project = projects.value.find((p) => p.data.projectId === projectId)
  if (project) {
    const oldStatus = project.data.status
    const updatedAt = new Date().toISOString()
    const updatedBy = projectStore.user?.email || 'unknown'

    // Optimistically update locally
    project.data.status = newStatus
    project.data.updatedAt = updatedAt
    project.data.updatedBy = updatedBy

    try {
      await API.updateProjectStatus(projectId, newStatus, updatedAt, updatedBy)
      showSnackbar(`Status for project ${projectId} updated to ${newStatus}!`, 'success')
    } catch (error) {
      console.error('Error updating project status:', error)
      // Revert status on failure
      project.data.status = oldStatus
      triggerErrorDialog('Status Update Error', error.message || error)
    }
  }
}

async function handleShowHistoryDialog(projectId) {
  showHistoryDialog.value = true
  isLoadingHistory.value = true
  try {
    const history = await API.getProjectHistory(projectId)
    projectHistory.value = history || []
  } catch (error) {
    console.error('Error fetching project history:', error)
    triggerErrorDialog('History Load Error', error.message || error)
  } finally {
    isLoadingHistory.value = false
  }
}

function formatDateTime(val) {
  if (!val) return ''
  const date = new Date(val)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.project-form-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #e8eafc 0%, #fbe9e7 100%);
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.main-form-card {
  background: #fff6f6;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.07);
}

.header-bar {
  background: #fff;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  border-bottom: 1.5px solid #f2caca;
  min-height: 150px;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #222;
  letter-spacing: 0.5px;
}

.legend-color {
  width: 15px;
  height: 15px;
  border-radius: 2px;
}

.legend-color.non-florida {
  background-color: #aaaaff;
}

.legend-color.florida-wet-seal {
  background-color: #7fffff;
}

.dashboard-main {
  background: transparent;
}

.dashboard-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.projects-table {
  border: 1px solid #f2caca;
  border-radius: 8px;
}

.projects-table :deep(.v-data-table-header) {
  background: #ffeaea;
}

.projects-table :deep(.v-data-table-header th) {
  color: #b62025;
  font-weight: 700;
  font-size: 1.05rem;
}

.projects-table :deep(.v-data-table__wrapper) {
  border-radius: 8px;
  overflow: hidden;
  height: 100%;
}

.non-florida-row {
  background-color: #aaaaff !important;
}

.florida-wet-seal-row {
  background-color: #7fffff !important;
}

.status-select {
  width: 100%;
}

.status-select :deep(.v-field__input) {
  min-height: 32px;
  padding-top: 0;
  padding-bottom: 0;
}

/* Column width controls */
.projects-table :deep(.v-data-table__wrapper table) {
  table-layout: fixed;
  width: 100%;
}

.projects-table :deep(.v-data-table__wrapper td) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Invoice ID column styling for admins */
.projects-table :deep(.v-data-table__wrapper td:nth-child(2)) {
  font-family: monospace;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .dashboard-title {
    font-size: 1.2rem;
  }
}

/* Scroll to top floating button */
.scroll-to-top-btn {
  position: fixed !important;
  bottom: 24px;
  right: 24px;
  z-index: 999;
}

/* Revision History timeline styles */
.revision-timeline :deep(.v-timeline-item__opposite) {
  min-width: 104px;
  text-align: right;
}
</style>
