<template>
  <v-container class="project-form-bg d-flex">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" class="fill-height">
        <v-card elevation="8" class="pa-0 rounded-xl main-form-card fill-height">
          <v-sheet class="header-bar d-flex align-center px-6 py-4" elevation="0">
            <v-img
              src="https://ucarecdn.com/e767c054-980a-4511-aabe-8d7cbe48d732/CeedCivilEngineering.jpg"
              height="100"
              width="100"
              class="mr-10 rounded-lg"
            />
            <div class="flex-grow-1 text-center mr-10">
              <h2 class="form-title mb-0">Site Specific Pole Barn Order Form & Agreement</h2>
            </div>
            <v-btn color="primary" variant="flat" class="ml-auto" @click="newProject"
              >New Project</v-btn
            >
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
                <v-row class="pr-2">
                  <v-col cols="8">
                    <v-text-field
                      v-model="searchQuery"
                      placeholder="Search projects..."
                      prepend-inner-icon="mdi-magnify"
                      variant="outlined"
                      density="compact"
                      hide-details
                      @input="filterProjects"
                    />
                  </v-col>
                  <v-col cols="4" class="d-flex justify-end align-center">
                    <v-checkbox
                      v-model="showArchived"
                      label="Show Archived"
                      hide-details
                      density="compact"
                    />
                  </v-col>
                </v-row>
              </v-card-text>

              <!-- Projects Table -->
              <v-card-text class="pt-0 flex-grow-1 d-flex flex-column">
                <v-data-table
                  :headers="headers"
                  :items="filteredProjects"
                  :loading="loading"
                  class="projects-table flex-grow-1"
                  hover
                  item-value="id"
                >
                  <template v-slot:item="{ item }">
                    <tr :class="getRowClass(item)">
                      <td>{{ item.data.projectId }}</td>
                      <td v-if="isAdmin">{{ item.data.fBInvoiceId || 'N/A' }}</td>
                      <td>{{ item.data.clientName }}</td>
                      <td>{{ item.data.projectName }}</td>
                      <td>{{ formatDate(item.data.orderDate) }}</td>
                      <td>
                        <v-btn
                          v-if="item.data.driveFolder"
                          variant="text"
                          color="primary"
                          size="small"
                          icon
                          @click.stop="openFolder(item.data.driveFolder)"
                        >
                          <v-icon>mdi-open-in-new</v-icon>
                        </v-btn>
                        <span v-else class="text-grey">N/A</span>
                      </td>
                      <td>
                        <v-select
                          :model-value="item.data.status"
                          :items="statusOptions"
                          variant="outlined"
                          density="compact"
                          hide-details
                          class="status-select"
                          @update:model-value="(value) => updateStatus(item.data.projectId, value)"
                        />
                      </td>
                      <td>
                        <v-btn
                          color="primary"
                          variant="text"
                          size="small"
                          icon
                          @click.stop="viewDetails(item)"
                        >
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { API } from '@/services/apiService'
import { useProjectStore } from '@/stores/projectStore'
import { useSnackbar } from '@/composables/useSnackbar'

const router = useRouter()
const projectStore = useProjectStore()
const loading = ref(false)
const searchQuery = ref('')
const showArchived = ref(false)
const { showSnackbar } = useSnackbar()

const projects = ref(projectStore.projects)

// Admin detection
const isAdmin = computed(() => {
  return projectStore.user?.type === 'Admin' || projectStore.user?.isAdmin === true
})

// Dynamic headers based on admin status
const headers = computed(() => {
  if (isAdmin.value) {
    return [
      { title: 'Project ID', key: 'id', sortable: true, width: '6%' },
      { title: 'Invoice ID', key: 'invoiceId', sortable: true, width: '6%' },
      { title: 'Client Name', key: 'clientName', sortable: true, width: '22%' },
      { title: 'Project Name', key: 'projectName', sortable: true, width: '22%' },
      { title: 'Order Date', key: 'orderDate', sortable: true, width: '11%' },
      { title: 'Folder Link', key: 'folderLink', sortable: false, width: '4%' },
      { title: 'Status', key: 'status', sortable: true, width: '24%' },
      { title: '', key: 'actions', sortable: false, width: '1%' },
    ]
  } else {
    return [
      { title: 'Project ID', key: 'id', sortable: true, width: '5%' },
      { title: 'Client Name', key: 'clientName', sortable: true, width: '26%' },
      { title: 'Project Name', key: 'projectName', sortable: true, width: '26%' },
      { title: 'Order Date', key: 'orderDate', sortable: true, width: '13%' },
      { title: 'Folder Link', key: 'folderLink', sortable: false, width: '5%' },
      { title: 'Status', key: 'status', sortable: true, width: '22%' },
      { title: '', key: 'actions', sortable: false, width: '3%' },
    ]
  }
})

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

const filteredProjects = computed(() => {
  let filtered = projects.value

  if (!showArchived.value) {
    filtered = filtered.filter((project) => project.data.status !== 'Archived')
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (project) =>
        project.data.projectId.toLowerCase().includes(query) ||
        project.data.projectName.toLowerCase().includes(query) ||
        project.data.clientName.toLowerCase().includes(query),
    )
  }

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

function getRowClass(item) {
  if (item.data.state.toLowerCase() !== 'fl') {
    return 'non-florida-row'
  } else if (item.data.wetMapAndSeal) {
    return 'florida-wet-seal-row'
  }
  return ''
}

function filterProjects() {}

function viewDetails(item) {
  router.push(`/form?projectId=${item.data.projectId}`)
}

function newProject() {
  router.push('/form')
}

function openFolder(url) {
  window.open(url, '_blank')
}

async function updateStatus(projectId, newStatus) {
  const project = projects.value.find((p) => p.data.projectId === projectId)
  if (project) {
    project.data.status = newStatus
    await API.updateProjectStatus(projectId, newStatus)
    showSnackbar(`Status for project ${projectId} updated to ${newStatus}!`, 'success')
  }
}
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
</style>
