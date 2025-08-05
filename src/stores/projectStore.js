import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProjectStore = defineStore('project', () => {
  // State
  const projects = ref([])
  const isUpdating = ref(false)
  const user = ref(null)

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
    console.log('projectData', projectData)
    projects.value.push(projectData)
  }

  function setIsUpdating(value) {
    isUpdating.value = value
  }

  function setLoginStatus(value) {
    isLogin.value = value
  }

  return {
    // State
    projects,
    isUpdating,
    user,
    // Actions
    updateProject,
    newProject,
    setIsUpdating,
    setLoginStatus,
    setProjects,
    setUser,
  }
})
