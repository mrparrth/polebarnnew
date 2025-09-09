import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { API } from '@/services/apiService'

export const useProjectStore = defineStore('project', () => {
  // State
  const projects = ref([])
  const isUpdating = ref(false)
  const user = ref(null)
  const paperCopyStock = ref({})
  const paperCopyData = ref([])
  const metaData = ref(API.getMetaData())
  const showPaperCopyRequest = ref(false)
  const showPaperCopyInfo = ref(false)
  const dashboardFilter = ref('allPoleBarnTypes')

  const isLowStock = computed(() => {
    return Object.values(paperCopyStock.value).some(
      (item) => item.qty <= metaData.value.lowStockThreshold,
    )
  })

  function setUser(newUser) {
    user.value = newUser
  }

  function setProjects(newProjects) {
    projects.value = newProjects
  }

  function updateProject(projectId, updatedData) {
    const projectIndex = projects.value.findIndex((project) => project.data.projectId === projectId)
    if (projectIndex !== -1) {
      projects.value[projectIndex].data = {
        ...projects.value[projectIndex].data,
        ...updatedData.data,
      }
      projects.value[projectIndex].images = updatedData.images
    }
  }

  function newProject(projectData) {
    projects.value.push(projectData)
  }

  function newPaperCopyProject(project) {
    projects.value.push(project)
    let projectData = project.data
    let updatedPaperCopyStock = { ...paperCopyStock.value }
    if (projectData.opbPaperSold) {
      updatedPaperCopyStock.openPoleBarn.qty -= projectData.opbPaperSold
    }
    if (projectData.leanToPaperSold) {
      updatedPaperCopyStock.leanTo.qty -= projectData.leanToPaperSold
    }
    if (projectData.singleSlopePaperSold) {
      updatedPaperCopyStock.singleSlope.qty -= projectData.singleSlopePaperSold
    }

    setPaperCopyStock(updatedPaperCopyStock)
  }

  function setIsUpdating(value) {
    isUpdating.value = value
  }

  function setLoginStatus(value) {
    isLogin.value = value
  }

  function setPaperCopyStock(newPaperCopyStock) {
    paperCopyStock.value = newPaperCopyStock

    if (isLowStock.value) {
      setShowPaperCopyRequest(true)
    } else {
      setShowPaperCopyRequest(false)
    }
  }

  function setPaperCopyData(newPaperCopyData) {
    paperCopyData.value = newPaperCopyData
  }

  function setShowPaperCopyRequest(value) {
    showPaperCopyRequest.value = value
  }

  function setShowPaperCopyInfo(value) {
    showPaperCopyInfo.value = value
  }

  function setDashboardFilter(value) {
    dashboardFilter.value = value
  }

  return {
    // State
    projects,
    isUpdating,
    user,
    metaData,
    paperCopyStock,
    paperCopyData,
    isLowStock,
    showPaperCopyRequest,
    showPaperCopyInfo,
    dashboardFilter,
    // Actions
    updateProject,
    newProject,
    newPaperCopyProject,
    setIsUpdating,
    setLoginStatus,
    setProjects,
    setUser,
    setPaperCopyStock,
    setPaperCopyData,
    setShowPaperCopyRequest,
    setShowPaperCopyInfo,
    setDashboardFilter,
  }
})
