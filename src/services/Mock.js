import LOCAL_DATA from '@/data/data.json'
import { DEFAULT_MOCK_API_DELAY } from '../global'
import PAPER_COPY_STATS from '@/data/paperCopyStats.json'
import PAPER_COPY_DATA from '@/data/paperCopyData.json'

const FAKE_USER = {
  email: 'test@test.com',
  password: '123456',
  type: 'Admin',
  token: 'dev_fake_token_123456',
}

export class Mock {
  static async executeMockFunction(functionName, { data, token }) {
    await this.simulateNetworkDelay()

    const handlers = {
      // Auth related functions
      login: () => this.handleMockLogin({ ...data, token }),
      autoLogin: () => this.handleMockAutoLogin(),
      logout: () => this.handleMockLogout(),

      // Data related functions
      newProject: () => this.handleMockNewProject(data),
      updateProject: () => this.handleMockUpdateProject(data),
      updateProjectStatus: () => this.handleMockUpdateProjectStatus(data),
      getLatestData: () => this.handleMockGetLatestData(),
      newPaperCopyProject: () => this.handleMockNewPaperCopyProject(data),
      orderPaperCopy: () => this.handleMockOrderPaperCopy(data),
      updatePaperCopyStock: () => this.handleMockUpdatePaperCopyStock(data),
    }

    const handler = handlers[functionName]
    if (!handler) {
      throw new Error(
        `Unhandled function: ${functionName}${
          Object.keys(data).length ? ` with data: ${JSON.stringify(data)}` : ''
        }`,
      )
    }

    return handler()
  }

  static handleMockLogin({ email, password, token }) {
    console.log('handleMockLogin', email, password, token)
    if (token) {
      if (token === FAKE_USER.token) {
        return JSON.stringify({
          user: FAKE_USER,
          token: `dev_fake_token_123456`,
          data: LOCAL_DATA,
          paperCopyStock: PAPER_COPY_STATS,
        })
      }
      localStorage.removeItem('authToken')
      throw new Error('Invalid token')
    }

    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      return JSON.stringify({
        user: FAKE_USER,
        token: `dev_fake_token_123456`,
        data: LOCAL_DATA,
        paperCopyStock: PAPER_COPY_STATS,
      })
    }

    throw new Error('Invalid credentials')
  }

  static handleMockAutoLogin() {
    if (LOCAL_DATA) {
      return JSON.stringify({
        user: FAKE_USER,
        token: `dev_fake_token_123456`,
        data: LOCAL_DATA,
        paperCopyStock: PAPER_COPY_STATS,
      })
    }
  }

  static handleMockLogout() {
    return { success: true }
  }

  static handleMockNewProject(data) {
    console.log('handleMockNewProject', data)
    data.projectId = Math.random().toString(36).substring(2, 15)
    return { data, images: [] }
  }

  static handleMockNewPaperCopyProject(data) {
    console.log('handleMockNewPaperCopyProject', data)
    data.projectId = Math.random().toString(36).substring(2, 15)
    return { data, images: [] }
  }

  static handleMockUpdateProject(data) {
    console.log('handleMockUpdateProject', data)
    return { data, images: [] }
  }

  static handleMockGetLatestData() {
    console.log('handleMockGetLatestData')
    return { success: true }
  }

  static handleMockUpdateProjectStatus(data) {
    console.log('handleMockUpdateProjectStatus', data)
    return { success: true }
  }

  static handleMockOrderPaperCopy(data) {
    console.log('handleMockOrderPaperCopy', data)
    return { success: true }
  }

  static handleMockUpdatePaperCopyStock(data) {
    console.log('handleMockUpdatePaperCopyStock', data)
    return { success: true }
  }

  static simulateNetworkDelay(ms = DEFAULT_MOCK_API_DELAY) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  static getMetaData() {
    // return { startingProjectId: 'pc_f96d301a', lowStockThreshold: 3 }
    // http://localhost:5173/form?projectId=pc_f96d301a
    return { lowStockThreshold: 1 }
  }
}
